# CareConnect AEO tracker

This repository holds the CareConnect website and an **AEO tracker** ("answer engine
optimisation"). Once a month the tracker asks four AI assistants the same list of
questions that a patient's family might ask, for example *"กายภาพบำบัดที่บ้าน กรุงเทพ ที่ไหนดี"*,
and records:

- whether the AI **names CareConnect**,
- whether it **links to careconnectth.org** (including stroke.careconnectth.org) as a source,
- **where CareConnect sits** in its list of recommended providers,
- which **competitors** and **websites** it mentions instead,
- whether what it says about CareConnect is **accurate** (price, area, services).

The AIs asked are ChatGPT (OpenAI), Perplexity, Gemini (Google) and Claude (Anthropic),
each with web search turned on and the location set to Bangkok where the AI supports it.
Every question is asked **twice per AI**, because AI answers change from one call to the next.

It runs by itself at **09:00 Bangkok time on the 1st of every month**. You can also start it
whenever you like (see "Run it now" below).

---

## Where the results are

Each run creates a folder named after its date, for example `results/2026-11-01/`:

| File | What it is | Who it's for |
|---|---|---|
| `summary.md` | **One-page report. Start here.** | Everyone |
| `results.csv` | One row per question × AI × repeat. Opens in Excel or Google Sheets. | Digging into details |
| `raw.jsonl` | Every full answer, with all its sources, exactly as the AI returned it. | Checking what an AI really said |

To read the summary, open the `results` folder on GitHub, click the newest date, then
click `summary.md`. GitHub shows it as a formatted page. The same summary also appears on the
run's page under **Actions → AEO tracker → (the run)**.

## How to read the results

**Names CareConnect ("mentioned")**: the answer text contains "CareConnect", "Care Connect",
"careconnectth" or "แคร์คอนเน็ค" (upper or lower case doesn't matter).
*45% (28/62)* means CareConnect was named in 28 of the 62 answers that AI gave.

**Cites careconnectth.org ("cited")**: one of the sources the AI showed or linked to is on
careconnectth.org or one of its subdomains. An AI can cite our site without naming us; that
happens when it uses one of our articles as a source for a general answer. That still counts
as a win for content.

**Avg. rank when listed**: when the AI gives a list of providers and CareConnect is in it,
its position in that list (1 = first). Lower is better. The list is worked out by asking
Claude (or ChatGPT if there is no Claude key) to read the answer and pull out the provider names
in order.

**Change vs (date)**: the difference from the previous run, in percentage points.
"+8 pts" means, for example, that 30% went up to 38%. AI answers vary from call to call, so
treat changes of a few points as noise and look for trends over several months.

**Who gets cited**: the websites the AIs use as sources most often. These are the sites
that shape what AIs say about home physiotherapy. They are useful places to be listed, reviewed or
mentioned.

**Competitors**: other providers the AIs name. This includes the known competitors in
`config/brand.json` and any new provider names the AI mentions.

**Accuracy problems**: for every answer that names CareConnect, an AI checker compares what it
says with the facts in `config/facts.json`:
- ❌ **incorrect**: contradicts our facts (wrong price, says we have branches, promises guaranteed results…). Worth fixing on the website or in listings the AI cites.
- ⚠️ **minor**: small imprecision.
- *unclear*: too little was said to judge.

**Question by question** (bottom of the summary): `2/2 ✓` means the AI named CareConnect in
both answers and cited careconnectth.org at least once. `0/2` means CareConnect wasn't named.

**Errors / skipped engines**: if an AI's key is missing, that AI is skipped and the summary
says so. If a call failed after several retries, it's listed and left out of the percentages.

## Run it now

1. Go to the repository on GitHub and click the **Actions** tab.
2. Click **AEO tracker** in the left-hand list.
3. Click **Run workflow** (right-hand side), leave the branch as `main`, and click the green **Run workflow** button.
4. It takes about 30–60 minutes. When it finishes, a new `results/<today's date>/` folder appears.

Running it twice on the same day overwrites that day's folder.

## Add, edit or remove questions

All questions are in **`config/questions.csv`**. You can edit it directly on GitHub (open the
file, click the pencil icon, then **Commit changes**), or in Excel/Google Sheets (save as CSV, UTF-8).

It has three columns:

| Column | What to put |
|---|---|
| `id` | A short, unique code, e.g. `C7`. Never reuse an old id for a different question, or month-to-month comparisons get mixed up. |
| `group` | One of: `brand`, `core`, `hiring`, `stroke`, `elderly`, `bedbound`, `price`, `location`, `other`. A new group name also works; it gets its own row in the summary. |
| `question` | The question exactly as a person would type it. Thai is fine. If it contains a comma, wrap it in double quotes: `"กายภาพ, ราคา"`. |

Each question costs 8 AI calls per month (4 AIs × 2 repeats), plus a small checking call.

## Other settings you may want to change

- **Facts about CareConnect** (used by the accuracy check): `config/facts.json`. Update this
  when prices, provinces or programmes change, or every later answer will be judged against old facts.
- **Brand spellings, competitors, our domains**: `config/brand.json`. Add a spelling to
  `brand_patterns` if AIs write the name another way (e.g. "แคร์ คอนเน็ค"). Add competitors to
  `competitors`. If a competitor has a Thai and an English name, add it to `competitor_aliases` so it is counted once.
- **Which AI models are used, and how many repeats**: `config/settings.json` (`model` for each
  engine, and `repeats`). AI companies regularly release new models. When you change one, note it,
  because results may shift for that reason alone.

## One-time setup (API keys)

The tracker needs an API key for each AI, stored as GitHub **secrets** (never in the code):
**Settings → Secrets and variables → Actions → New repository secret**, then add:

| Secret name | Where to get it |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `PERPLEXITY_API_KEY` | perplexity.ai → Settings → API |
| `GEMINI_API_KEY` | aistudio.google.com → Get API key |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |

Any key you leave out just means that AI is skipped. The checker that pulls out provider lists
and checks accuracy uses the Anthropic key, or the OpenAI key if there is no Anthropic key.
With neither, rank, competitor and accuracy columns stay empty.

---

## For developers

- Code: `src/aeo/` (`run.py` orchestration, `engines.py` one function per AI, `scoring.py`
  mention/citation/rank logic, `extractor.py` the LLM checker, `summary.md` builder in `summary.py`).
- Workflow: `.github/workflows/aeo-tracker.yml`.
- Tests: `pip install -r requirements.txt && python -m pytest`.
- Dry run with recorded fake answers (no keys, no cost):
  `DRY_RUN=1 PYTHONPATH=src python -m aeo` writes to `dry-run-results/` (git-ignored).
  Add `RUN_DATE=2026-09-01` to fake a date, e.g. to see the "change" columns.
- Quick real test on a few questions: `ONLY_ENGINES=perplexity QUESTION_IDS=B1,C1 REPEATS=1 RESULTS_DIR=/tmp/aeo PYTHONPATH=src python -m aeo`.
- Gemini returns its sources as Google redirect links; the tracker follows each redirect to
  find the real site, and falls back to the site name Gemini supplies.
- "Cited" also counts plain URLs written into the answer text, not only the formal source list.
- `results.csv` column `careconnect_in_search_results` (OpenAI and Claude only): our site came up
  in the AI's web search, whether or not it ended up cited.

## Website (Next.js)

The website itself is a [Next.js](https://nextjs.org) app. Run `pnpm dev` and open
http://localhost:3000. Blog content is managed in Sanity at the `/studio` path.
