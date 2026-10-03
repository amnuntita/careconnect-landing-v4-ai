"""DRY_RUN=1 support: fake engines and a fake extractor that replay recorded answers
from tests/fixtures/fake_responses.json, so the pipeline runs without API keys."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

FIXTURE = Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "fake_responses.json"


class FakeWorld:
    def __init__(self, run_date: str, path: Path = FIXTURE):
        self.data = json.loads(path.read_text(encoding="utf-8"))
        self.run_date = run_date
        self.by_text = {a["text"]: a for a in self.data["answers"].values()}

    def _pick(self, engine: str, question: dict, repeat: int) -> dict:
        is_english = question["question"].isascii()
        pool = self.data["pools"]["english" if is_english else question["group"]]
        key = f"{self.run_date}|{engine}|{question['id']}|{repeat}".encode()
        index = int(hashlib.sha256(key).hexdigest(), 16) % len(pool)
        return self.data["answers"][pool[index]]

    def engine(self, engine: str):
        def ask(question: dict, repeat: int, model: str) -> dict:
            for fail in self.data.get("fail", []):
                if (fail["engine"], fail["question_id"], fail["repeat"]) == (engine, question["id"], repeat):
                    raise RuntimeError(fail["error"])
            answer = self._pick(engine, question, repeat)
            return {
                "model": f"{model} (dry run)",
                "text": answer["text"],
                "citations": answer["citations"],
                "retrieved": [],
                "raw": {"dry_run": True},
            }
        return ask


class FakeExtractor:
    label = "dry-run:recorded"

    def __init__(self, world: FakeWorld):
        self.world = world

    def providers(self, answer: str, context: dict) -> list[str]:
        return list(self.world.by_text.get(answer, {}).get("providers", []))

    def accuracy(self, answer: str, facts: dict, context: dict) -> dict:
        verdict = self.world.by_text.get(answer, {}).get("accuracy")
        return dict(verdict) if verdict else {"status": "unclear", "notes": "No recorded verdict."}
