"""Retries with exponential backoff, and scrubbing of secrets from error text."""

from __future__ import annotations

import os
import random
import re
import time
from typing import Callable, TypeVar

T = TypeVar("T")

SECRET_NAMES = ("OPENAI_API_KEY", "PERPLEXITY_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY")
# Shapes of API keys, in case an SDK echoes part of one in an error message.
KEY_SHAPES = re.compile(r"(sk-[A-Za-z0-9_\-*]{8,}|pplx-[A-Za-z0-9_\-*]{8,}|AIza[0-9A-Za-z_\-*]{20,})")

# HTTP statuses that will not get better by retrying (bad request, auth, not found).
NON_RETRYABLE = {400, 401, 403, 404, 422}


def redact(message: str) -> str:
    """Remove any API key value or key-shaped string from a message."""
    text = str(message)
    for name in SECRET_NAMES:
        value = os.environ.get(name)
        if value and len(value) >= 6:
            text = text.replace(value, "[redacted]")
    return KEY_SHAPES.sub("[redacted]", text)


def short_error(exc: BaseException) -> str:
    return redact(f"{type(exc).__name__}: {exc}")[:500]


def status_code(exc: BaseException) -> int | None:
    for attr in ("status_code", "code", "status"):
        value = getattr(exc, attr, None)
        if isinstance(value, int):
            return value
    response = getattr(exc, "response", None)
    value = getattr(response, "status_code", None)
    return value if isinstance(value, int) else None


def with_retries(
    fn: Callable[[], T],
    max_attempts: int = 4,
    base_delay: float = 5.0,
    max_delay: float = 90.0,
    sleep: Callable[[float], None] = time.sleep,
) -> T:
    """Call fn(); on failure wait 5s, 10s, 20s ... (plus jitter) and try again."""
    attempt = 0
    while True:
        attempt += 1
        try:
            return fn()
        except Exception as exc:  # noqa: BLE001 - every SDK raises its own classes
            if attempt >= max_attempts or status_code(exc) in NON_RETRYABLE:
                raise
            delay = min(max_delay, base_delay * 2 ** (attempt - 1)) * random.uniform(0.8, 1.2)
            sleep(delay)
