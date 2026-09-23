# ADR-0007: A Claude-only eval judge is allowed, but a pairwise comparison result is never published before it is calibrated against human labels

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

LLM-as-judge research is consistent on several biases relevant here: a judge favors longer, more heavily formatted output regardless of content; a judge favors text with lower perplexity to itself, which runs directly against this repository's goal of writing that reads less like default LLM output; and a same-family judge shows measurable (if inconsistently sized) self-preference. This repository has no budget or account access for a genuinely independent (non-Claude) judge model, so every eval arm — writer and judge — runs on some Claude model.

Publishing a pairwise "guidance wins" result under those conditions, without any correction, would let exactly the biases above decide what "better writing" means for this repository — the opposite of the evidence discipline the rest of the project holds itself to.

## Decision

- Eval layer 3 (reader-task QA — docs/maintain/eval.md) is the primary v0.1 measurement: a planted-fact document is scored by whether a separate reading session can answer questions about it, a decision procedure with no judge-preference channel to exploit.
- Eval layer 4 (blind pairwise comparison) may run on a Claude judge, but every result records both arms' length and formatting-element counts, judges both presentation orders, and is never treated as a standalone conclusion.
- Eval layer 5 (human calibration) — a maintainer blind-labeling 30-50 pairs and computing agreement (Cohen's κ) against the judge — is a hard gate: a layer-4 result is not published in `eval/reports/`, `README.md`, or cited by any practice until a layer-5 calibration exists for that judge/model combination, and low agreement (κ below a threshold set in `docs/maintain/eval.md`) means the layer-4 result is discarded, not softened.

## Consequences

v0.1.0 ships without any pairwise-comparison claim; only layers 1-3 gate the release (ROADMAP.md). This is slower than publishing an uncalibrated "guidance improved quality by N%" number would have been, and that is the deliberate trade this ADR makes.
