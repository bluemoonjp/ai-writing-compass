# ADR-0006: Sources carry a graded evidence_strength, and an antipattern separates reader harm from a detection signal

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

The sibling repositories' `sources[].kind` (`primary`/`research`/`other`) records where a claim came from but not how strong the backing is — a government regulation and a single practitioner's blog post can both be `kind: primary` to their own subject. Writing guidance research surfaces this gap sharply: a regulation like Japan's public-document writing guidelines, a controlled experiment, an expert's style guide, and a practitioner's frequency count of an LLM's output are different kinds of evidence for different kinds of claims, and conflating them would let a weakly-sourced rule sit at the same authority as a strongly-sourced one.

A second, distinct gap: research on AI writing repeatedly finds patterns whose *frequency* changed after LLM adoption (an em dash, 体言止め, a specific vocabulary spike) without any evidence that the pattern itself harms a reader. Treating a frequency signal as if it were a harm claim would let this repository block a writer on something that is, at best, a hint to look closer.

## Decision

- `sources[].kind` is removed. `sources[].evidence_strength` (`standard` / `empirical` / `expert_guide` / `practitioner` / `anecdotal`) replaces it, and `sources[].supports` (`rule` / `harm` / `frequency`) records what the source is cited *for*.
- An `active` practice needs a `confidence: verified` source with `evidence_strength` in `standard`/`empirical`/`expert_guide` and `supports: rule` (`defs.schema.json#/$defs/strongVerified`).
- An antipattern's `classification` is `harmful` (a `strongVerified`, `supports: harm` source exists; `harmed_tasks` is required), `signal_only` (only a `supports: frequency` source exists; `signal_for` names the harmful antipattern(s) it is a proxy for; can never back a `severity: error` guard rule — ADR-0004), `undetermined`, or `obsolete`.
- `tier: durable` (reader-outcome-based) is separated from `tier: model_specific` (tied to `observed_on`/`observed_models`, reviewed at each model release rather than by a weekly patrol — see ROADMAP.md).

## Consequences

A pattern this repository has real research showing is currently common in a specific model's output, but no evidence harms a reader (an em dash, for instance), is documented and can drive an *advisory* guard rule or a detector, but can never become a blocking rule and can never claim to protect a reader task it has not been shown to damage. This is a deliberately higher bar than "the pattern got more common" — see `docs/maintain/authoring.md`.
