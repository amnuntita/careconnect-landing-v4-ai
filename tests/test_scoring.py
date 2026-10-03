import json
from pathlib import Path

import pytest

from aeo import scoring
from aeo.retry import redact, with_retries

ROOT = Path(__file__).resolve().parents[1]
BRAND = json.loads((ROOT / "config" / "brand.json").read_text(encoding="utf-8"))
PATTERNS = BRAND["brand_patterns"]
OWN = BRAND["own_domains"]
COMPETITORS = BRAND["competitors"]


# ------------------------------------------------------------------ mention
@pytest.mark.parametrize("text", [
    "แนะนำ CareConnect กายภาพบำบัดที่บ้าน มีแพทย์เวชศาสตร์ฟื้นฟูดูแล",
    "ลองใช้บริการของ แคร์คอนเน็ค ดูครับ",
    "You could try Care Connect, which sends therapists to your home.",
    "Care-Connect offers home visits.",
    "See careconnectth.org for prices.",
    "CARECONNECT is one option.",
    "1. **CareConnect (careconnectth.org)** – ขั้นแรก 1,500 บาท",
])
def test_mentioned(text):
    assert scoring.is_mentioned(text, PATTERNS)


@pytest.mark.parametrize("text", [
    "กายภาพบำบัดที่บ้าน แนะนำ Kin Rehab และ VRP Home Rehab",
    "Home healthcare connects patients with nurses and physiotherapists.",
    "HealthcareConnect is a different company.",
    "Premier Home Health Care provides physiotherapy at home in Bangkok.",
    "",
])
def test_not_mentioned(text):
    assert not scoring.is_mentioned(text, PATTERNS)


# ------------------------------------------------------------------ citation
def test_cited_main_site_and_subdomain():
    urls = [
        "https://hdmall.co.th/c/home-physiotherapy",
        "https://www.careconnectth.org/pricing",
        "https://stroke.careconnectth.org/rehab-at-home?utm_source=chatgpt.com",
        "https://www.careconnectth.org/pricing",
    ]
    assert scoring.own_site_urls(urls, OWN) == [
        "https://www.careconnectth.org/pricing",
        "https://stroke.careconnectth.org/rehab-at-home?utm_source=chatgpt.com",
    ]


@pytest.mark.parametrize("url", [
    "https://notcareconnectth.org/page",
    "https://careconnectth.org.evil.example/",
    "https://www.google.com/search?q=careconnectth.org",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AbC123",
])
def test_not_cited_lookalikes(url):
    assert scoring.own_site_urls([url], OWN) == []


def test_domain_of():
    assert scoring.domain_of("https://www.CareConnectTH.org/a") == "careconnectth.org"
    assert scoring.domain_of("stroke.careconnectth.org") == "stroke.careconnectth.org"
    assert scoring.domain_of("") == ""


def test_urls_in_text_markdown():
    text = "ดูรายละเอียดที่ [CareConnect](https://www.careconnectth.org/pricing). หรือ https://hdmall.co.th/x,"
    assert scoring.urls_in_text(text) == ["https://www.careconnectth.org/pricing", "https://hdmall.co.th/x"]


def test_unique_domains():
    urls = ["https://www.pobpad.com/a", "https://pobpad.com/b", "https://hdmall.co.th/c"]
    assert scoring.unique_domains(urls) == ["pobpad.com", "hdmall.co.th"]


# ------------------------------------------------------------------ rank
def test_rank_thai_list():
    providers = ["Kin Rehab", "CareConnect (careconnectth.org)", "VRP Home Rehab"]
    assert scoring.careconnect_rank(providers, PATTERNS) == 2


def test_rank_thai_name_first():
    assert scoring.careconnect_rank(["แคร์คอนเน็ค", "ขยับ"], PATTERNS) == 1


def test_rank_english_spaced_name():
    assert scoring.careconnect_rank(["Premier Home Health Care", "Kin Rehab", "Care Connect"], PATTERNS) == 3


def test_rank_absent():
    assert scoring.careconnect_rank(["Kin Rehab", "MyNurz"], PATTERNS) is None
    assert scoring.careconnect_rank([], PATTERNS) is None


# ------------------------------------------------------------------ competitors
def test_competitors_known_and_extracted():
    text = "ลองดู ขยับ (Khayap), MyNurz และ โรงพยาบาลธนภัทร รวมถึง CareConnect และ คลินิกกายภาพสุขใจ"
    providers = ["ขยับ (Khayap)", "MyNurz", "โรงพยาบาลธนภัทร", "CareConnect", "คลินิกกายภาพสุขใจ"]
    found = scoring.competitors_found(text, providers, COMPETITORS, PATTERNS, BRAND["competitor_aliases"])
    # Thai and English spellings of the same company are counted once; unknown providers are kept.
    assert found == ["Khayap", "MyNurz", "Thanaphat", "คลินิกกายภาพสุขใจ"]


def test_competitors_dedupe_case_insensitive():
    found = scoring.competitors_found("Kin Rehab and KIN REHAB", ["kin rehab"], COMPETITORS, PATTERNS)
    assert found == ["Kin Rehab"]


# ------------------------------------------------------------------ retry / secrets
def test_retry_then_success():
    calls = {"n": 0}

    def flaky():
        calls["n"] += 1
        if calls["n"] < 3:
            raise RuntimeError("temporary")
        return "ok"

    assert with_retries(flaky, max_attempts=4, sleep=lambda s: None) == "ok"
    assert calls["n"] == 3


def test_no_retry_on_auth_error():
    class AuthError(Exception):
        status_code = 401

    calls = {"n": 0}

    def bad():
        calls["n"] += 1
        raise AuthError("bad key")

    with pytest.raises(AuthError):
        with_retries(bad, max_attempts=4, sleep=lambda s: None)
    assert calls["n"] == 1


def test_redact(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-proj-SECRETVALUE123456")
    msg = redact("Incorrect API key provided: sk-proj-SECRETVALUE123456 and AIzaSyA1234567890abcdefghijk")
    assert "SECRETVALUE" not in msg and "AIzaSy" not in msg
