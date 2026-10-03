"""End-to-end dry run (fake answers, no keys) and engine-response parsing."""

import csv
import json

from aeo import engines, run


def test_dry_run_end_to_end(tmp_path, monkeypatch):
    for key in ("OPENAI_API_KEY", "PERPLEXITY_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY"):
        monkeypatch.delenv(key, raising=False)
    monkeypatch.setenv("DRY_RUN", "1")
    monkeypatch.setenv("RESULTS_DIR", str(tmp_path))

    monkeypatch.setenv("RUN_DATE", "2026-09-01")
    assert run.main() == 0
    monkeypatch.setenv("RUN_DATE", "2026-10-01")
    assert run.main() == 0

    out = tmp_path / "2026-10-01"
    rows = list(csv.DictReader(open(out / "results.csv", encoding="utf-8-sig")))
    assert len(rows) == 31 * 4 * 2
    assert {r["engine"] for r in rows} == {"openai", "perplexity", "gemini", "anthropic"}
    assert any(r["mentioned"] == "TRUE" for r in rows)
    assert any(r["cited"] == "TRUE" and r["mentioned"] == "FALSE" for r in rows)
    assert any(r["accuracy_status"] == "incorrect" for r in rows)

    raw = [json.loads(line) for line in open(out / "raw.jsonl", encoding="utf-8")]
    assert len(raw) == len(rows)
    assert any(r["status"] == "error" for r in raw)

    summary = (out / "summary.md").read_text(encoding="utf-8")
    assert "change vs 2026-09-01" in summary
    assert "กายภาพบำบัดที่บ้าน ราคาเท่าไร" in summary
    assert "Top 15" in summary or "top 15" in summary


def test_missing_key_engine_is_skipped(tmp_path, monkeypatch):
    for key in ("OPENAI_API_KEY", "PERPLEXITY_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY"):
        monkeypatch.delenv(key, raising=False)
    monkeypatch.delenv("DRY_RUN", raising=False)
    monkeypatch.setenv("RESULTS_DIR", str(tmp_path))
    # No keys at all and not a dry run: nothing can run, nothing is written.
    assert run.main() == 1
    assert not any(tmp_path.iterdir())


class _Obj:
    def __init__(self, data):
        self._data = data

    def model_dump(self, **_):
        return self._data


def test_parse_openai_response(monkeypatch):
    payload = {
        "model": "gpt-test",
        "output": [
            {"type": "web_search_call", "action": {"type": "search", "sources": [
                {"type": "url", "url": "https://www.careconnectth.org/"}]}},
            {"type": "message", "content": [{"type": "output_text", "text": "Try CareConnect.",
             "annotations": [{"type": "url_citation", "url": "https://stroke.careconnectth.org/x",
                              "title": "Stroke", "start_index": 0, "end_index": 5}]}]},
        ],
    }

    class FakeResponses:
        def create(self, **kwargs):
            assert kwargs["tools"][0]["user_location"]["country"] == "TH"
            assert kwargs["input"] == "Q"
            return _Obj(payload)

    class FakeOpenAI:
        def __init__(self, **_):
            self.responses = FakeResponses()

    import openai
    monkeypatch.setattr(openai, "OpenAI", FakeOpenAI)
    settings = run.load_json("settings.json")
    out = engines.ask_openai("Q", "gpt-test", "k", settings)
    assert out["text"] == "Try CareConnect."
    assert out["citations"][0]["url"] == "https://stroke.careconnectth.org/x"
    assert out["retrieved"][0]["url"] == "https://www.careconnectth.org/"


def test_parse_anthropic_response_with_pause_turn(monkeypatch):
    first = {"model": "claude-test", "stop_reason": "pause_turn", "content": [
        {"type": "web_search_tool_result", "content": [
            {"type": "web_search_result", "url": "https://hdmall.co.th/a", "title": "HDmall"}]}]}
    second = {"model": "claude-test", "stop_reason": "end_turn", "content": [
        {"type": "text", "text": "แนะนำ CareConnect", "citations": [
            {"type": "web_search_result_location", "url": "https://www.careconnectth.org/",
             "title": "CC", "cited_text": "x", "encrypted_index": "e"}]}]}
    responses = [first, second]

    class FakeMessages:
        def create(self, **kwargs):
            assert "system" not in kwargs
            data = responses.pop(0)
            obj = _Obj(data)
            obj.content = data["content"]
            return obj

    class FakeAnthropic:
        def __init__(self, **_):
            self.messages = FakeMessages()

    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", FakeAnthropic)
    settings = run.load_json("settings.json")
    out = engines.ask_anthropic("Q", "claude-test", "k", settings)
    assert out["text"] == "แนะนำ CareConnect"
    assert out["citations"][0]["url"] == "https://www.careconnectth.org/"
    assert out["retrieved"][0]["url"] == "https://hdmall.co.th/a"
    assert not responses


def test_parse_gemini_redirect_falls_back_to_title(monkeypatch):
    payload = {"model_version": "gemini-test", "candidates": [{
        "content": {"parts": [{"text": "CareConnect ให้บริการ"}]},
        "grounding_metadata": {"grounding_chunks": [
            {"web": {"uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AAA",
                     "title": "careconnectth.org"}}]}}]}

    class FakeModels:
        def generate_content(self, **kwargs):
            return _Obj(payload)

    class FakeClient:
        def __init__(self, **_):
            self.models = FakeModels()

    from google import genai
    monkeypatch.setattr(genai, "Client", FakeClient)
    settings = run.load_json("settings.json")
    out = engines.ask_gemini("Q", "gemini-test", "k", settings, resolver=lambda u: u)
    assert out["citations"][0]["url"] == "https://careconnectth.org"
    out = engines.ask_gemini("Q", "gemini-test", "k", settings,
                             resolver=lambda u: "https://stroke.careconnectth.org/a")
    assert out["citations"][0]["url"] == "https://stroke.careconnectth.org/a"
