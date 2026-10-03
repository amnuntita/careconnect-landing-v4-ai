"""One function per answer engine. Each sends the question as a single plain user
message (no system prompt) with web search turned on, and returns a normalised dict:

    {
      "model": str,               # model the provider reports it used
      "text": str,                # the answer as a user would see it
      "citations": [{"url", "title"}],   # sources the answer cites / shows
      "retrieved": [{"url", "title"}],   # pages searched but not necessarily cited
      "raw": dict,                # full provider response, for raw.jsonl
    }
"""

from __future__ import annotations

import re
from typing import Any, Callable

import httpx

DOMAIN_RE = re.compile(r"[a-z0-9.\-]+\.[a-z]{2,}")


# Opaque or bulky fields that add megabytes to raw.jsonl but nothing readable.
DROP_KEYS = {"encrypted_content", "encrypted_index", "rendered_content", "sdk_http_response",
             "signature", "thought_signature"}


def _slim(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: _slim(v) for k, v in value.items() if k not in DROP_KEYS}
    if isinstance(value, list):
        return [_slim(v) for v in value]
    return value


def _dump(obj: Any) -> dict:
    if hasattr(obj, "model_dump"):
        return _slim(obj.model_dump(mode="json", exclude_none=True))
    return _slim(obj) if isinstance(obj, dict) else {"value": str(obj)}


def _add(items: list[dict], url: str | None, title: str | None = None) -> None:
    if url and not any(i["url"] == url for i in items):
        items.append({"url": url, "title": title or ""})


# --------------------------------------------------------------------------- OpenAI
def ask_openai(question: str, model: str, api_key: str, settings: dict) -> dict:
    from openai import OpenAI

    loc = settings["location"]
    client = OpenAI(api_key=api_key, timeout=settings["request_timeout_seconds"], max_retries=0)
    response = client.responses.create(
        model=model,
        input=question,
        tools=[{
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "city": loc["city"],
                "region": loc["region"],
                "country": loc["country"],
                "timezone": loc["timezone"],
            },
        }],
        include=["web_search_call.action.sources"],
    )
    raw = _dump(response)
    citations: list[dict] = []
    retrieved: list[dict] = []
    texts: list[str] = []
    for item in raw.get("output", []):
        if item.get("type") == "message":
            for part in item.get("content", []):
                if part.get("type") == "output_text":
                    texts.append(part.get("text", ""))
                    for ann in part.get("annotations", []):
                        if ann.get("type") == "url_citation":
                            _add(citations, ann.get("url"), ann.get("title"))
        elif item.get("type") == "web_search_call":
            for src in (item.get("action") or {}).get("sources") or []:
                _add(retrieved, src.get("url"))
    return {"model": raw.get("model", model), "text": "\n".join(texts), "citations": citations,
            "retrieved": retrieved, "raw": raw}


# ----------------------------------------------------------------------- Perplexity
def ask_perplexity(question: str, model: str, api_key: str, settings: dict) -> dict:
    from perplexity import Perplexity

    loc = settings["location"]
    client = Perplexity(api_key=api_key, timeout=settings["request_timeout_seconds"], max_retries=0)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": question}],
        web_search_options={
            "user_location": {
                "country": loc["country"],
                "region": loc["region"],
                "city": loc["city"],
                "latitude": loc["latitude"],
                "longitude": loc["longitude"],
            },
        },
    )
    raw = _dump(response)
    text = ""
    choices = raw.get("choices") or []
    if choices:
        content = (choices[0].get("message") or {}).get("content")
        if isinstance(content, str):
            text = content
        elif isinstance(content, list):
            text = "".join(p.get("text", "") for p in content if isinstance(p, dict))
    citations: list[dict] = []
    for result in raw.get("search_results") or []:
        _add(citations, result.get("url"), result.get("title"))
    for url in raw.get("citations") or []:
        _add(citations, url)
    return {"model": raw.get("model", model), "text": text, "citations": citations,
            "retrieved": [], "raw": raw}


# --------------------------------------------------------------------------- Gemini
def resolve_redirect(url: str, timeout: float = 15.0) -> str:
    """Gemini cites sources through vertexaisearch.cloud.google.com redirect links.
    Follow the redirect (without downloading the page) to learn the real URL."""
    if "grounding-api-redirect" not in url:
        return url
    try:
        with httpx.Client(follow_redirects=False, timeout=timeout) as http:
            resp = http.head(url)
            if resp.status_code >= 400 or "location" not in resp.headers:
                resp = http.get(url)
            return resp.headers.get("location") or url
    except httpx.HTTPError:
        return url


def ask_gemini(question: str, model: str, api_key: str, settings: dict,
               resolver: Callable[[str], str] = resolve_redirect) -> dict:
    from google import genai
    from google.genai import types

    loc = settings["location"]
    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(timeout=int(settings["request_timeout_seconds"] * 1000)),
    )
    response = client.models.generate_content(
        model=model,
        contents=question,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            # The Gemini API has no location field for Search grounding itself; the
            # retrieval config's lat/lng is the only user-location hint it accepts.
            tool_config=types.ToolConfig(
                retrieval_config=types.RetrievalConfig(
                    lat_lng=types.LatLng(latitude=loc["latitude"], longitude=loc["longitude"]),
                ),
            ),
        ),
    )
    raw = _dump(response)
    texts: list[str] = []
    citations: list[dict] = []
    candidates = raw.get("candidates") or []
    if candidates:
        cand = candidates[0]
        for part in (cand.get("content") or {}).get("parts") or []:
            if part.get("text") and not part.get("thought"):
                texts.append(part["text"])
        for chunk in (cand.get("grounding_metadata") or {}).get("grounding_chunks") or []:
            web = chunk.get("web") or {}
            uri, title = web.get("uri"), web.get("title") or ""
            if not uri:
                continue
            real = resolver(uri)
            if real == uri and "grounding-api-redirect" in uri and DOMAIN_RE.fullmatch(title.strip().lower()):
                # Could not resolve: Gemini puts the source's domain in the title.
                real = "https://" + title.strip()
            web["resolved_uri"] = real
            _add(citations, real, title)
    return {"model": raw.get("model_version") or model, "text": "".join(texts),
            "citations": citations, "retrieved": [], "raw": raw}


# ------------------------------------------------------------------------ Anthropic
def ask_anthropic(question: str, model: str, api_key: str, settings: dict) -> dict:
    import anthropic

    loc = settings["location"]
    engine = settings["engines"]["anthropic"]
    client = anthropic.Anthropic(api_key=api_key, timeout=settings["request_timeout_seconds"],
                                 max_retries=0)
    tools = [{
        "type": engine.get("web_search_tool", "web_search_20260209"),
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": loc["city"],
            "region": loc["region"],
            "country": loc["country"],
            "timezone": loc["timezone"],
        },
    }]
    messages: list[dict] = [{"role": "user", "content": question}]
    content: list[dict] = []
    raws: list[dict] = []
    response = None
    # A long server-side search turn can stop with "pause_turn"; send it back to continue.
    for _ in range(6):
        response = client.messages.create(model=model, max_tokens=16000, messages=messages,
                                          tools=tools)
        raw = _dump(response)
        raws.append(raw)
        content.extend(raw.get("content", []))
        if raw.get("stop_reason") != "pause_turn":
            break
        messages = [messages[0], {"role": "assistant", "content": response.content}]

    texts: list[str] = []
    citations: list[dict] = []
    retrieved: list[dict] = []
    for block in content:
        if block.get("type") == "text":
            texts.append(block.get("text", ""))
            for cit in block.get("citations") or []:
                if cit.get("type") == "web_search_result_location":
                    _add(citations, cit.get("url"), cit.get("title"))
        elif block.get("type") == "web_search_tool_result":
            results = block.get("content")
            if isinstance(results, list):  # an error result is a single object, not a list
                for r in results:
                    _add(retrieved, r.get("url"), r.get("title"))
    final = raws[-1] if raws else {}
    if final.get("stop_reason") == "refusal":
        raise RuntimeError("Claude declined to answer (stop_reason=refusal)")
    return {"model": final.get("model", model), "text": "".join(texts), "citations": citations,
            "retrieved": retrieved, "raw": {"responses": raws}}


ENGINES: dict[str, Callable[..., dict]] = {
    "openai": ask_openai,
    "perplexity": ask_perplexity,
    "gemini": ask_gemini,
    "anthropic": ask_anthropic,
}
