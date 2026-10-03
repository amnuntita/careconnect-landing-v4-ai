"""Uses an LLM to read an answer and (a) list the providers it names, in order,
and (b) judge whether what it says about CareConnect matches config/facts.json.

Anthropic is used when ANTHROPIC_API_KEY is set, otherwise OpenAI.
"""

from __future__ import annotations

import json

PROVIDERS_SCHEMA = {
    "type": "object",
    "properties": {"providers": {"type": "array", "items": {"type": "string"}}},
    "required": ["providers"],
    "additionalProperties": False,
}

ACCURACY_SCHEMA = {
    "type": "object",
    "properties": {
        "status": {"type": "string", "enum": ["correct", "minor_issue", "incorrect", "unclear"]},
        "notes": {"type": "string"},
    },
    "required": ["status", "notes"],
    "additionalProperties": False,
}

PROVIDERS_PROMPT = """Below is an answer an AI assistant gave to a question about home physiotherapy in Thailand.

List every home-physiotherapy provider, clinic, hospital, company or booking platform that the answer names or recommends, in the order they first appear. Use the name as written in the answer (keep Thai names in Thai). Do not include generic categories ("private clinics", "freelance therapists"), government schemes, professional bodies, or websites that are only cited as sources. If none are named, return an empty list.

<answer>
{answer}
</answer>"""

ACCURACY_PROMPT = """You are checking an AI assistant's answer for accuracy about the company CareConnect.

Here are the verified facts about CareConnect (JSON):
<facts>
{facts}
</facts>

Here is the answer:
<answer>
{answer}
</answer>

Look only at what the answer says about CareConnect (not other providers). Compare it with the facts and return:
- "correct": everything said about CareConnect is consistent with the facts.
- "minor_issue": small omissions or imprecision that would not mislead a customer.
- "incorrect": anything that contradicts the facts, e.g. a wrong price, wrong area served, wrong phone/LINE, saying it has clinic branches or per-session pricing, or claims listed under "does_not_claim" (such as guaranteed results).
- "unclear": the answer says too little about CareConnect to judge.
In "notes", quote the problematic claim and state the correct fact, in English, in one to three sentences. If correct, say briefly what was said."""


class Extractor:
    """Real extractor backed by the Anthropic or OpenAI API."""

    def __init__(self, provider: str, model: str, api_key: str, timeout: float):
        self.provider = provider
        self.model = model
        if provider == "anthropic":
            import anthropic

            self._client = anthropic.Anthropic(api_key=api_key, timeout=timeout, max_retries=0)
        else:
            from openai import OpenAI

            self._client = OpenAI(api_key=api_key, timeout=timeout, max_retries=0)

    @property
    def label(self) -> str:
        return f"{self.provider}:{self.model}"

    def _json(self, prompt: str, schema: dict, name: str) -> dict:
        if self.provider == "anthropic":
            response = self._client.messages.create(
                model=self.model,
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}],
                output_config={"effort": "low", "format": {"type": "json_schema", "schema": schema}},
            )
            if response.stop_reason == "refusal":
                raise RuntimeError("extractor declined (stop_reason=refusal)")
            text = next(b.text for b in response.content if b.type == "text")
        else:
            response = self._client.responses.create(
                model=self.model,
                input=prompt,
                text={"format": {"type": "json_schema", "name": name, "schema": schema, "strict": True}},
            )
            text = response.output_text
        return json.loads(text)

    def providers(self, answer: str, context: dict) -> list[str]:
        if not answer.strip():
            return []
        data = self._json(PROVIDERS_PROMPT.format(answer=answer), PROVIDERS_SCHEMA, "providers")
        return [p.strip() for p in data.get("providers", []) if isinstance(p, str) and p.strip()]

    def accuracy(self, answer: str, facts: dict, context: dict) -> dict:
        prompt = ACCURACY_PROMPT.format(facts=json.dumps(facts, ensure_ascii=False, indent=2),
                                        answer=answer)
        data = self._json(prompt, ACCURACY_SCHEMA, "accuracy")
        return {"status": data.get("status", "unclear"), "notes": data.get("notes", "")}
