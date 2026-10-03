"""Pure scoring functions: no network, no API keys. Covered by tests/test_scoring.py."""

from __future__ import annotations

import re
from urllib.parse import urlparse

URL_RE = re.compile(r"https?://[^\s<>\"'\)\]\}]+", re.IGNORECASE)


def _pattern_regex(pattern: str) -> re.Pattern[str]:
    """Build a case-insensitive regex for one brand pattern.

    Spaces in the pattern also match hyphens/dots/no space ("care connect" matches
    "Care-Connect"). Latin patterns must not be preceded by another letter, so
    "healthcare connects" does not count as "care connect".
    """
    parts = [re.escape(p) for p in pattern.strip().split()]
    body = r"[\s\-\.]*".join(parts)
    if re.match(r"[A-Za-z]", pattern.strip()):
        body = r"(?<![A-Za-z])" + body
    return re.compile(body, re.IGNORECASE)


def is_mentioned(text: str, brand_patterns: list[str]) -> bool:
    """True if any brand pattern appears in the answer text."""
    if not text:
        return False
    return any(_pattern_regex(p).search(text) for p in brand_patterns)


def is_brand_name(name: str, brand_patterns: list[str]) -> bool:
    """True if a provider name (from the extractor) refers to CareConnect."""
    return is_mentioned(name, brand_patterns)


def domain_of(url: str) -> str:
    """Lower-case hostname without a leading 'www.'; '' if not a URL."""
    if not url:
        return ""
    candidate = url.strip()
    if "://" not in candidate:
        candidate = "http://" + candidate
    try:
        host = (urlparse(candidate).hostname or "").lower()
    except ValueError:
        return ""
    if host.startswith("www."):
        host = host[4:]
    return host


def is_own_domain(domain: str, own_domains: list[str]) -> bool:
    """Match the domain itself or any subdomain (stroke.careconnectth.org)."""
    domain = domain.lower().strip(".")
    for own in own_domains:
        own = own.lower().strip(".")
        if domain == own or domain.endswith("." + own):
            return True
    return False


def own_site_urls(urls: list[str], own_domains: list[str]) -> list[str]:
    """Cited URLs that point to our own site, in order, without duplicates."""
    found: list[str] = []
    for url in urls:
        if is_own_domain(domain_of(url), own_domains) and url not in found:
            found.append(url)
    return found


def urls_in_text(text: str) -> list[str]:
    """Plain URLs written inside the answer text (e.g. markdown links)."""
    urls = []
    for match in URL_RE.findall(text or ""):
        url = match.rstrip(".,;:!?*_")
        if url not in urls:
            urls.append(url)
    return urls


def unique_domains(urls: list[str]) -> list[str]:
    domains: list[str] = []
    for url in urls:
        d = domain_of(url)
        if d and d not in domains:
            domains.append(d)
    return domains


def careconnect_rank(providers: list[str], brand_patterns: list[str]) -> int | None:
    """1-based position of CareConnect in the ordered provider list, or None."""
    for i, name in enumerate(providers, start=1):
        if is_brand_name(name, brand_patterns):
            return i
    return None


def _norm(name: str) -> str:
    return re.sub(r"[\s\-\.]+", " ", name).strip().casefold()


def competitors_found(
    text: str,
    providers: list[str],
    known_competitors: list[str],
    brand_patterns: list[str],
    aliases: dict[str, list[str]] | None = None,
) -> list[str]:
    """Known competitors named in the answer, then any other providers the extractor found.

    `aliases` maps one display name to other spellings of the same provider
    ({"Khayap": ["ขยับ"]}) so they are counted once. CareConnect itself is never
    listed. Names are de-duplicated case-insensitively.
    """
    aliases = aliases or {}
    result: list[str] = []
    seen: set[str] = set()

    def canonical(name: str) -> str:
        for canon, others in aliases.items():
            if any(_pattern_regex(a).search(name) for a in [canon, *others]):
                return canon
        return next((c for c in known_competitors if _pattern_regex(c).search(name)), name)

    def add(name: str) -> None:
        name = canonical(name)
        key = _norm(name)
        if key and key not in seen and not is_brand_name(name, brand_patterns):
            seen.add(key)
            result.append(name)

    for comp in known_competitors:
        if _pattern_regex(comp).search(text or ""):
            add(comp)
    for name in providers:
        add(name)
    return result
