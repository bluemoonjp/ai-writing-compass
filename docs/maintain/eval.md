# Evaluation

Five layers, each with a distinct job. See ADR-0007 for why layers 4-5 gate publication.

| Layer | What it measures | Tool | Judge |
| --- | --- | --- | --- |
| 1. Guard | `starter/writing-guard` regex/density detectors behave correctly | `node --test` fixtures, `claude plugin eval` `regex` grader | none |
| 2. Firing | A skill fires on a genuine request and stays silent on a near-miss | `claude plugin eval` `tool_used` grader | none |
| 3. Reader-task QA | Whether a reader can actually answer questions about a generated document | `scripts/eval/run-qa.mjs` | none (answer-key match) |
| 4. Blind pairwise | Which of two documents lets a reader decide/act faster, with less reading | `scripts/eval/run-pairwise.mjs` (not yet built) | Claude, both presentation orders |
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

Layers 1-3 are built and have run against real content. `claude plugin eval ./plugins/writing-compass` scores both skills' fire/near-miss cases at 1.0, with a mean with/without delta of 0.8 across cases (each fire case scores 1.0 with the plugin installed and 0.0 without it; the shared near-miss case scores 1.0 in both arms). `node scripts/eval/run-qa.mjs incident-rollback-ja` answered 5/5 answerable planted-fact questions correctly and correctly declined both deliberately unanswerable ones, from the arm-A (no-guidance) document, with a clean canary. Layers 4-5 are not yet built — see ROADMAP.md.
