"""Main entry point: ask every question to every available engine, score the
answers, and write results/YYYY-MM-DD/{raw.jsonl, results.csv, summary.md}.

Environment variables:
  OPENAI_API_KEY, PERPLEXITY_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY
  DRY_RUN=1        use recorded fake answers (no keys, no cost)
  REPEATS=N        override "repeats" in config/settings.json
  RUN_DATE=YYYY-MM-DD   override the folder date (default: today in Bangkok)
  RESULTS_DIR=path override the output root (default: results/, or dry-run-results/ for DRY_RUN)
  ONLY_ENGINES=openai,gemini   ask only these engines (for a quick local test)
  QUESTION_IDS=B1,C1           ask only these questions (for a quick local test)
"""

from __future__ import annotations

import csv
import json
import os
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from . import scoring
from .config import ROOT, load_json, load_questions
from .engines import ENGINES
from .retry import short_error, with_retries
from .summary import write_summary

CSV_COLUMNS = [
    "run_date", "question_id", "group", "question", "engine", "model", "repeat", "status",
    "error", "mentioned", "cited", "cited_careconnect_urls", "careconnect_rank",
    "providers_ranked", "competitors", "accuracy_status", "accuracy_notes", "cited_domains",
    "num_citations", "careconnect_in_search_results", "answer_chars", "extractor_error",
]

LIST_SEP = " | "


def _env_list(name: str) -> list[str]:
    return [x.strip() for x in os.environ.get(name, "").split(",") if x.strip()]


def _truthy(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in {"1", "true", "yes", "on"}


def score_answer(answer: dict, brand: dict, facts: dict, extractor, ctx: dict,
                 retry_kwargs: dict) -> dict:
    """Turn one engine answer into the scoring columns."""
    text = answer["text"]
    patterns = brand["brand_patterns"]
    own = brand["own_domains"]

    cited_urls = [c["url"] for c in answer["citations"]]
    for url in scoring.urls_in_text(text):
        if url not in cited_urls:
            cited_urls.append(url)
    own_urls = scoring.own_site_urls(cited_urls, own)
    retrieved_own = scoring.own_site_urls([r["url"] for r in answer.get("retrieved", [])], own)
    mentioned = scoring.is_mentioned(text, patterns)

    providers: list[str] = []
    accuracy = {"status": "", "notes": ""}
    extractor_errors: list[str] = []
    if extractor is not None:
        try:
            providers = with_retries(lambda: extractor.providers(text, ctx), **retry_kwargs)
        except Exception as exc:  # noqa: BLE001
            extractor_errors.append("providers: " + short_error(exc))
        if mentioned:
            try:
                accuracy = with_retries(lambda: extractor.accuracy(text, facts, ctx), **retry_kwargs)
            except Exception as exc:  # noqa: BLE001
                extractor_errors.append("accuracy: " + short_error(exc))
    else:
        extractor_errors.append("no extractor key (ANTHROPIC_API_KEY or OPENAI_API_KEY)")

    rank = scoring.careconnect_rank(providers, patterns)
    return {
        "mentioned": mentioned,
        "cited": bool(own_urls),
        "cited_careconnect_urls": own_urls,
        "careconnect_rank": rank,
        "providers_ranked": providers,
        "competitors": scoring.competitors_found(text, providers, brand["competitors"], patterns,
                                                  brand.get("competitor_aliases")),
        "accuracy": accuracy,
        "cited_domains": scoring.unique_domains(cited_urls),
        "num_citations": len(cited_urls),
        "careconnect_in_search_results": bool(retrieved_own),
        "extractor_error": "; ".join(extractor_errors),
    }


def csv_row(rec: dict) -> dict:
    s = rec.get("scores") or {}
    acc = s.get("accuracy") or {}
    ok = rec["status"] == "ok"

    def b(v):
        return "" if not ok else ("TRUE" if v else "FALSE")

    rank = s.get("careconnect_rank")
    return {
        "run_date": rec["run_date"],
        "question_id": rec["question_id"],
        "group": rec["group"],
        "question": rec["question"],
        "engine": rec["engine"],
        "model": rec["model"],
        "repeat": rec["repeat"],
        "status": rec["status"],
        "error": rec.get("error", ""),
        "mentioned": b(s.get("mentioned")),
        "cited": b(s.get("cited")),
        "cited_careconnect_urls": LIST_SEP.join(s.get("cited_careconnect_urls", [])),
        "careconnect_rank": "" if rank is None else rank,
        "providers_ranked": LIST_SEP.join(s.get("providers_ranked", [])),
        "competitors": LIST_SEP.join(s.get("competitors", [])),
        "accuracy_status": acc.get("status", ""),
        "accuracy_notes": acc.get("notes", ""),
        "cited_domains": LIST_SEP.join(s.get("cited_domains", [])),
        "num_citations": s.get("num_citations", "") if ok else "",
        "careconnect_in_search_results": b(s.get("careconnect_in_search_results")),
        "answer_chars": len(rec.get("answer", "")) if ok else "",
        "extractor_error": s.get("extractor_error", ""),
    }


def main() -> int:
    settings = load_json("settings.json")
    brand = load_json("brand.json")
    facts = load_json("facts.json")
    questions = load_questions()

    dry_run = _truthy("DRY_RUN")
    run_date = os.environ.get("RUN_DATE") or datetime.now(ZoneInfo("Asia/Bangkok")).date().isoformat()
    repeats = int(os.environ.get("REPEATS") or settings.get("repeats", 2))
    default_root = "dry-run-results" if dry_run else "results"
    results_root = Path(os.environ.get("RESULTS_DIR") or ROOT / default_root)
    out_dir = results_root / run_date

    if ids := _env_list("QUESTION_IDS"):
        questions = [q for q in questions if q["id"] in ids]
    only = _env_list("ONLY_ENGINES")

    # ---- decide which engines run
    engines: dict[str, dict] = {}
    skipped: dict[str, str] = {}
    keys: dict[str, str] = {}
    for name, cfg in settings["engines"].items():
        if name not in ENGINES:
            skipped[name] = "unknown engine name in settings.json"
            continue
        if only and name not in only:
            skipped[name] = "not selected (ONLY_ENGINES)"
            continue
        key = os.environ.get(cfg["secret"], "").strip()
        if not key and not dry_run:
            skipped[name] = f"{cfg['secret']} secret is not set"
            continue
        engines[name] = cfg
        keys[name] = key

    if not engines:
        print("No engines can run: none of the API key secrets are set. Nothing was written.")
        return 1

    # ---- extractor
    retry_kwargs = {"max_attempts": int(settings.get("max_attempts", 4))}
    if dry_run:
        from .fakes import FakeExtractor, FakeWorld

        world = FakeWorld(run_date)
        extractor = FakeExtractor(world)
        retry_kwargs["sleep"] = lambda _s: None
    else:
        from .extractor import Extractor

        timeout = settings["request_timeout_seconds"]
        if os.environ.get("ANTHROPIC_API_KEY", "").strip():
            extractor = Extractor("anthropic", settings["extractor"]["anthropic_model"],
                                  os.environ["ANTHROPIC_API_KEY"].strip(), timeout)
        elif os.environ.get("OPENAI_API_KEY", "").strip():
            extractor = Extractor("openai", settings["extractor"]["openai_model"],
                                  os.environ["OPENAI_API_KEY"].strip(), timeout)
        else:
            extractor = None

    out_dir.mkdir(parents=True, exist_ok=True)
    raw_path = out_dir / "raw.jsonl"
    raw_path.write_text("", encoding="utf-8")
    write_lock = threading.Lock()
    semaphores = {n: threading.Semaphore(int(settings.get("parallel_calls_per_engine", 3)))
                  for n in engines}

    print(f"AEO tracker {run_date}{' (DRY RUN)' if dry_run else ''}: "
          f"{len(questions)} questions x {len(engines)} engines x {repeats} repeats")
    if skipped:
        print("Skipped engines: " + ", ".join(f"{k} ({v})" for k, v in skipped.items()))

    def run_one(question: dict, engine: str, repeat: int) -> dict:
        cfg = engines[engine]
        model = cfg["model"]
        if dry_run:
            ask = lambda: world.engine(engine)(question, repeat, model)  # noqa: E731
        else:
            ask = lambda: ENGINES[engine](question["question"], model, keys[engine], settings)  # noqa: E731
        rec = {
            "run_date": run_date, "question_id": question["id"], "group": question["group"],
            "question": question["question"], "engine": engine, "model": model,
            "repeat": repeat, "started_at": datetime.now(timezone.utc).isoformat(),
        }
        start = time.monotonic()
        with semaphores[engine]:
            try:
                answer = with_retries(ask, **retry_kwargs)
                rec.update(status="ok", model=answer["model"] or model, answer=answer["text"],
                           citations=answer["citations"], retrieved=answer.get("retrieved", []))
            except Exception as exc:  # noqa: BLE001
                rec.update(status="error", error=short_error(exc))
                answer = None
        if answer is not None:
            rec["scores"] = score_answer(answer, brand, facts, extractor,
                                         {"engine": engine, "question_id": question["id"]},
                                         retry_kwargs)
            rec["extractor"] = getattr(extractor, "label", None)
            rec["response"] = answer["raw"]
        rec["duration_s"] = round(time.monotonic() - start, 1)
        with write_lock:
            with open(raw_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            status = "ok" if rec["status"] == "ok" else "ERROR " + rec["error"][:120]
            print(f"  {engine:<10} {question['id']:<4} #{repeat}  {status}", flush=True)
        return rec

    tasks = [(q, e, r) for q in questions for e in engines for r in range(1, repeats + 1)]
    workers = max(1, len(engines) * int(settings.get("parallel_calls_per_engine", 3)))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        records = list(pool.map(lambda t: run_one(*t), tasks))

    # Rewrite raw.jsonl in a stable order (question, engine, repeat).
    with open(raw_path, "w", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    rows = [csv_row(r) for r in records]
    with open(out_dir / "results.csv", "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)

    meta = {
        "run_date": run_date,
        "dry_run": dry_run,
        "repeats": repeats,
        "engines_run": {n: engines[n]["model"] for n in engines},
        "engine_labels": {n: c.get("label", n) for n, c in settings["engines"].items()},
        "engines_skipped": skipped,
        "extractor": getattr(extractor, "label", None) if extractor else None,
    }
    write_summary(out_dir, rows, meta, results_root)
    ok = sum(1 for r in rows if r["status"] == "ok")
    print(f"Done: {ok}/{len(rows)} calls succeeded. Wrote {out_dir}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
