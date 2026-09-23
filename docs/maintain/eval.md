# Evaluation

Five layers, each with a distinct job. See ADR-0007 for why layers 4-5 gate publication.

| Layer | What it measures | Tool | Judge |
| --- | --- | --- | --- |
| 1. Guard | `starter/writing-guard` regex/density detectors behave correctly | `node --test` fixtures, `claude plugin eval` `regex` grader | none |
| 2. Firing | A skill fires on a genuine request and stays silent on a near-miss | `claude plugin eval` `tool_used` grader | none |
| 3. Reader-task QA | Whether a reader can actually answer questions about a generated document | `scripts/eval/run-qa.mjs` (planned) | none (answer-key match) |
| 4. Blind pairwise | Which of two documents lets a reader decide/act faster, with less reading | `scripts/eval/run-pairwise.mjs` (planned) | Claude, both presentation orders |
| 5. Calibration | Whether the layer-4 judge agrees with a human | maintainer-labeled pairs, Cohen's κ | human |

## Eval coverage for a skill

Every `plugins/*/skills/*/SKILL.md` needs, among that plugin's `evals/*/prompt.md` cases:

- At least one case tagged `fire` and `ja` for that skill's name.
- At least one case tagged `fire` and `en`.
- At least one `near-miss` case (tagged with the skill's name but expected not to fire it — `tool_used` with `min: 0, max: 0, arm: both`).

`eval-coverage` (`scripts/checks/eval-coverage.mjs`) enforces this from `prompt.md`'s frontmatter `tags`.

## The layer-4/5 gate

A pairwise result is not written into `eval/reports/`, cited from `README.md`, or referenced by any practice until a layer-5 calibration exists for the judge/model pair that produced it. A calibration with Cohen's κ below the threshold this file will set once the first calibration run exists means the layer-4 result is discarded, not published with a caveat.

## Status

Layers 1-2 exist (`starter/writing-guard`'s fixtures, `checks.json`'s `eval-coverage`). Layers 3-5 and the plugin itself (`plugins/writing-compass/`) are scaffolded once source verification (`docs/maintain/verification.md`) produces the genre conventions they need content for — see ROADMAP.md.
