# ADR-0004: Blocking enforcement lives only in starter/writing-guard; textlint/Vale are advisory, not hook-wired, in v0.1

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

Japanese prose is best checked with `textlint`, English prose with `Vale` — both are real, capable tools this repository's own `docs/maintain` and a downstream user's CI can reasonably run. But wiring either into the plugin's `PreToolUse`/`PostToolUse` hooks means every user's environment must have that tool installed (or the plugin must install it on `SessionStart`, which is slow and network-dependent), and a hand-written rule enforced two ways — once as a `starter/writing-guard` regex, once as a `textlint`/`Vale` config — drifts the moment one side changes.

Separately, not every candidate rule deserves to block at all. A rule can only be enforced mechanically without false positives if it rests on a specification (GFM's autolink extension swallowing trailing punctuation) or is true regardless of context (a response opening with chat residue) — never on a reader's judgment call. And even a mechanically-sound rule must trace to an antipattern a source actually ties to reader harm, not merely to a pattern whose frequency changed (see ADR-0006's `harmful` vs `signal_only`).

## Decision

- `severity: error` in `starter/writing-guard/rules.json` is the only mechanism this repository blocks a writer on. It is dependency-free JavaScript, shared verbatim by the plugin's hooks, `templates/commit-msg`, and this repository's own `prose-guard` CI check (dogfooding).
- `guard-rules-resolve` enforces, in code, the three conditions an `error` rule must meet: its `basis` is `spec` or `mechanical` (never `judgment`), every antipattern it links to is `classification: harmful` (never `signal_only`), and that antipattern actually resolves to a real, active file.
- `textlint` (Japanese) and `Vale` (English) run in this repository's own CI as advisory reports, and are shipped as copyable config templates (`templates/textlintrc.json.template`, `templates/vale.ini.template`) for a downstream user's own CI. Calling either from the plugin's hooks is deferred (ROADMAP.md) until a version-pinned, install-free way to do so is worked out.

## Consequences

v0.1 ships with `starter/writing-guard/rules.json` empty: no antipattern has yet cleared the re-verification bar this ADR and ADR-0006 set for `classification: harmful`. The guard exists and is exercised by fixtures, but blocks nothing in this repository yet — `prose-guard` and `guard-rules-resolve` still run in CI and pass vacuously until the first `harmful` antipattern lands.
