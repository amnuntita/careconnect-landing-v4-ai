from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG_DIR = ROOT / "config"

GROUP_ORDER = ["brand", "core", "hiring", "stroke", "elderly", "bedbound", "price", "location", "other"]


def load_json(name: str, config_dir: Path = CONFIG_DIR) -> dict:
    return json.loads((config_dir / name).read_text(encoding="utf-8"))


def load_questions(config_dir: Path = CONFIG_DIR) -> list[dict]:
    with open(config_dir / "questions.csv", encoding="utf-8-sig", newline="") as f:
        rows = [
            {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
            for row in csv.DictReader(f)
        ]
    questions = [r for r in rows if r.get("id") and r.get("question")]
    ids = [q["id"] for q in questions]
    duplicates = sorted({i for i in ids if ids.count(i) > 1})
    if duplicates:
        raise ValueError(f"questions.csv has duplicate ids: {', '.join(duplicates)}")
    for q in questions:
        q["group"] = q.get("group", "").lower() or "other"
    return questions
