"""Builds summary.md from the rows of results.csv (and the previous run's results.csv)."""

from __future__ import annotations

import csv
import re
from collections import Counter, defaultdict
from pathlib import Path

from .config import GROUP_ORDER

DATE_DIR = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LIST_SEP = " | "


def _split(value: str) -> list[str]:
    return [x.strip() for x in (value or "").split(LIST_SEP.strip()) if x.strip()]


def _ok(rows: list[dict]) -> list[dict]:
    return [r for r in rows if r.get("status") == "ok"]


def _rate(rows: list[dict], column: str) -> tuple[int, int]:
    ok = _ok(rows)
    return sum(1 for r in ok if r.get(column) == "TRUE"), len(ok)


def _pct(hits: int, total: int) -> str:
    return "–" if total == 0 else f"{round(100 * hits / total)}% ({hits}/{total})"


def _change(cur: tuple[int, int], prev: tuple[int, int] | None) -> str:
    if prev is None or prev[1] == 0:
        return "new"
    if cur[1] == 0:
        return "–"
    diff = round(100 * cur[0] / cur[1]) - round(100 * prev[0] / prev[1])
    if diff == 0:
        return "no change"
    return f"{'+' if diff > 0 else '−'}{abs(diff)} pts"


def _avg_rank(rows: list[dict]) -> tuple[float | None, int]:
    ranks = [int(r["careconnect_rank"]) for r in _ok(rows) if str(r.get("careconnect_rank", "")).strip()]
    return (sum(ranks) / len(ranks), len(ranks)) if ranks else (None, 0)


def _cell(text: str) -> str:
    return str(text).replace("|", "\\|").replace("\n", " ").strip()


def find_previous(results_root: Path, run_date: str) -> tuple[str, list[dict]] | None:
    if not results_root.exists():
        return None
    dates = sorted(
        d.name for d in results_root.iterdir()
        if d.is_dir() and DATE_DIR.match(d.name) and d.name < run_date and (d / "results.csv").exists()
    )
    if not dates:
        return None
    with open(results_root / dates[-1] / "results.csv", encoding="utf-8-sig", newline="") as f:
        return dates[-1], list(csv.DictReader(f))


def build_summary(rows: list[dict], meta: dict, previous: tuple[str, list[dict]] | None) -> str:
    labels = meta.get("engine_labels", {})
    engines = list(meta["engines_run"])
    prev_date, prev_rows = previous if previous else (None, [])
    by_engine = defaultdict(list)
    prev_by_engine = defaultdict(list)
    for r in rows:
        by_engine[r["engine"]].append(r)
    for r in prev_rows:
        prev_by_engine[r["engine"]].append(r)

    ok_rows = _ok(rows)
    errors = [r for r in rows if r.get("status") != "ok"]
    out: list[str] = []
    w = out.append

    title = f"# AEO tracker — CareConnect — {meta['run_date']}"
    if meta.get("dry_run"):
        title += " (DRY RUN — fake answers, not real data)"
    w(title)
    w("")
    w("How often do AI assistants name CareConnect, and link to careconnectth.org, when people ask "
      "them about home physiotherapy? See README.md (\"How to read the results\") for definitions.")
    w("")

    # ---------------------------------------------------------------- run details
    w("## Run details")
    w("")
    w(f"- **Run date:** {meta['run_date']}")
    w("- **Engines run:** " + (", ".join(f"{labels.get(e, e)} (`{m}`)" for e, m in meta["engines_run"].items()) or "none"))
    if meta.get("engines_skipped"):
        w("- **Engines skipped:** " + "; ".join(f"{labels.get(e, e)} — {why}" for e, why in meta["engines_skipped"].items()))
    else:
        w("- **Engines skipped:** none")
    n_questions = len({r["question_id"] for r in rows})
    w(f"- **Calls:** {len(rows)} ({n_questions} questions × {len(engines)} engines × {meta['repeats']} repeats); "
      f"{len(ok_rows)} succeeded, {len(errors)} failed")
    w(f"- **Provider list / accuracy checked by:** {meta.get('extractor') or 'not available (no Anthropic or OpenAI key)'}")
    w(f"- **Compared with:** {prev_date or 'nothing yet — this is the first run, so there is no change column data'}")
    extractor_failures = [r for r in ok_rows if r.get("extractor_error")]
    if errors:
        w("")
        w("**Errors** (these calls are left out of every percentage below):")
        w("")
        for r in errors[:30]:
            w(f"- {labels.get(r['engine'], r['engine'])}, {r['question_id']} repeat {r['repeat']}: {_cell(r['error'])}")
        if len(errors) > 30:
            w(f"- … and {len(errors) - 30} more (see results.csv)")
    if extractor_failures:
        w("")
        w(f"**Note:** the provider-list/accuracy step failed for {len(extractor_failures)} answer(s); "
          "their rank and competitor data may be incomplete (see the extractor_error column in results.csv).")
    w("")

    # ---------------------------------------------------------------- headline
    chg = previous is not None
    w("## Headline: how often each AI names and cites CareConnect")
    w("")
    head = "| Engine | Answers | Names CareConnect | Cites careconnectth.org | Avg. rank when listed |"
    sep = "|---|---|---|---|---|"
    if chg:
        head += f" Names: change vs {prev_date} | Cites: change vs {prev_date} |"
        sep += "---|---|"
    w(head)
    w(sep)
    for engine in engines + ["__all__"]:
        cur = ok_rows if engine == "__all__" else _ok(by_engine[engine])
        prv = prev_rows if engine == "__all__" else prev_by_engine.get(engine, [])
        name = "**All engines**" if engine == "__all__" else labels.get(engine, engine)
        m, c = _rate(cur, "mentioned"), _rate(cur, "cited")
        avg, n = _avg_rank(cur)
        line = f"| {name} | {len(cur)} | {_pct(*m)} | {_pct(*c)} | {f'#{avg:.1f} ({n} answers)' if avg else '–'} |"
        if chg:
            pm = _rate(prv, "mentioned") if prv else None
            pc = _rate(prv, "cited") if prv else None
            line += f" {_change(m, pm)} | {_change(c, pc)} |"
        w(line)
    w("")

    # ---------------------------------------------------------------- groups
    w("## By question group (all engines combined)")
    w("")
    head = "| Group | Questions | Names CareConnect | Cites careconnectth.org |"
    sep = "|---|---|---|---|"
    if chg:
        head += " Names: change | Cites: change |"
        sep += "---|---|"
    w(head)
    w(sep)
    groups = [g for g in GROUP_ORDER if any(r["group"] == g for r in rows)]
    groups += sorted({r["group"] for r in rows} - set(groups))
    for g in groups:
        cur = [r for r in ok_rows if r["group"] == g]
        nq = len({r["question_id"] for r in rows if r["group"] == g})
        m, c = _rate(cur, "mentioned"), _rate(cur, "cited")
        line = f"| {g} | {nq} | {_pct(*m)} | {_pct(*c)} |"
        if chg:
            prv = [r for r in prev_rows if r.get("group") == g]
            line += f" {_change(m, _rate(prv, 'mentioned') if prv else None)} | {_change(c, _rate(prv, 'cited') if prv else None)} |"
        w(line)
    if chg and set(meta["engines_run"]) != {r["engine"] for r in prev_rows}:
        w("")
        w(f"_Note: the engines that ran differ from {prev_date}, so \"all engines\" changes partly reflect that._")
    w("")

    # ---------------------------------------------------------------- rank
    w("## CareConnect's position when it is named")
    w("")
    avg, n = _avg_rank(ok_rows)
    mentioned_rows = [r for r in ok_rows if r.get("mentioned") == "TRUE"]
    if avg is None:
        w("CareConnect was not placed in any list of recommended providers in this run.")
    else:
        firsts = sum(1 for r in ok_rows if str(r.get("careconnect_rank")) == "1")
        w(f"When an answer lists providers and CareConnect is among them, it is on average **#{avg:.1f}** "
          f"in the list ({n} answers; listed first in {firsts}). ")
    unranked = sum(1 for r in mentioned_rows if not str(r.get("careconnect_rank", "")).strip())
    if unranked:
        w(f"{unranked} answer(s) named CareConnect without putting it in a list of providers.")
    w("")

    # ---------------------------------------------------------------- domains
    w("## Who gets cited: top 15 websites")
    w("")
    w("Number of answers that cite each website (counted once per answer).")
    w("")
    domains = Counter(d for r in ok_rows for d in set(_split(r.get("cited_domains", ""))))
    if domains:
        w("| # | Website | Answers citing it | Share of answers |")
        w("|---|---|---|---|")
        for i, (d, n) in enumerate(domains.most_common(15), start=1):
            own = "careconnectth.org" in d
            name = f"**{d}** (ours)" if own else d
            w(f"| {i} | {name} | {n} | {round(100 * n / len(ok_rows))}% |")
    else:
        w("No citations were recorded.")
    w("")

    # ---------------------------------------------------------------- competitors
    w("## Competitors named most often")
    w("")
    comp_count: Counter = Counter()
    comp_engines: dict[str, set] = defaultdict(set)
    for r in ok_rows:
        for name in set(_split(r.get("competitors", ""))):
            comp_count[name] += 1
            comp_engines[name].add(labels.get(r["engine"], r["engine"]))
    cc_count = len(mentioned_rows)
    if comp_count:
        w(f"For comparison, CareConnect was named in **{cc_count}** answers.")
        w("")
        w("| # | Provider | Answers naming it | Engines |")
        w("|---|---|---|---|")
        for i, (name, n) in enumerate(comp_count.most_common(15), start=1):
            w(f"| {i} | {_cell(name)} | {n} | {', '.join(sorted(comp_engines[name]))} |")
    else:
        w("No other providers were named.")
    w("")

    # ---------------------------------------------------------------- accuracy
    w("## Accuracy problems in what AIs say about CareConnect")
    w("")
    issues = [r for r in ok_rows if r.get("accuracy_status") in ("incorrect", "minor_issue")]
    statuses = Counter(r.get("accuracy_status") or "not checked" for r in mentioned_rows)
    if mentioned_rows:
        w("Checked " + str(len(mentioned_rows)) + " answers that name CareConnect: "
          + ", ".join(f"{k} {v}" for k, v in sorted(statuses.items())) + ".")
        w("")
    if issues:
        issues.sort(key=lambda r: (r["accuracy_status"] != "incorrect", r["question_id"], r["engine"]))
        w("| Severity | Question | Engine | What's wrong |")
        w("|---|---|---|---|")
        for r in issues:
            sev = "❌ incorrect" if r["accuracy_status"] == "incorrect" else "⚠️ minor"
            w(f"| {sev} | {r['question_id']} {_cell(r['question'])} | {labels.get(r['engine'], r['engine'])} (#{r['repeat']}) | {_cell(r['accuracy_notes'])} |")
    else:
        w("No accuracy issues found.")
    w("")

    # ---------------------------------------------------------------- per question
    w("## Question by question")
    w("")
    w("Each cell: answers that name CareConnect / answers received. ✓ = careconnectth.org was cited at least once.")
    w("")
    w("| ID | Question | " + " | ".join(labels.get(e, e) for e in engines) + " |")
    w("|---|---|" + "---|" * len(engines))
    seen: list[str] = []
    for r in rows:
        if r["question_id"] not in seen:
            seen.append(r["question_id"])
    for qid in seen:
        qrows = [r for r in rows if r["question_id"] == qid]
        cells = []
        for e in engines:
            er = _ok([r for r in qrows if r["engine"] == e])
            if not er:
                cells.append("error" if any(r["engine"] == e for r in qrows) else "–")
                continue
            m = sum(1 for r in er if r["mentioned"] == "TRUE")
            cited = any(r["cited"] == "TRUE" for r in er)
            cells.append(f"{m}/{len(er)}{' ✓' if cited else ''}")
        w(f"| {qid} | {_cell(qrows[0]['question'])} | " + " | ".join(cells) + " |")
    w("")
    return "\n".join(out)


def write_summary(out_dir: Path, rows: list[dict], meta: dict, results_root: Path) -> Path:
    previous = find_previous(results_root, meta["run_date"])
    path = out_dir / "summary.md"
    path.write_text(build_summary(rows, meta, previous), encoding="utf-8")
    return path
