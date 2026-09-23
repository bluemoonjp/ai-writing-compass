# Roadmap

Shape and order only; rationale and specifics live in issues and ADRs. This
file is not generated and is not a progress log — do not add a history
section to it (`no-history-words`, `no-addendum-sections`).

## v0.1 phases

0. Source re-verification for the always-loaded core's principles, the
   Japanese-specific rules, and the genres `core/` covers (chat reply,
   commit message, PR description), run alongside the phases below.
1. Scaffolding: schemas, checks, `pnpm gen`, CI, ADRs, one seed practice.
2. The always-loaded core (`core/core.ja.md`, `core/core.en.md`), generated
   from active `scope: principle` practices.
3. `starter/writing-guard`, the self-scan exclusion, `prose-guard`, and
   `antipatterns/` content.
4. The Claude Code plugin: hooks, `writing-compose`, `writing-review`.
5. Eval layer 1 (guard) and layer 2 (skill firing / core delta), via
   `claude plugin eval`.
6. Eval layer 3 (reader-task QA harness) and the first report.

Eval layers 4 (blind pairwise) and 5 (human calibration) land in a v0.1.x
release once layer 3 has run; a pairwise result is never published before
layer 5's calibration exists.

## Explicitly out of scope for v0.1

- A weekly patrol / source registry (style guidance changes slowly; a
  non-blocking `freshness-report` plus a review at each model release
  substitute for it).
- Accepting external pull requests from forks.
- `templates/` for another project's `AGENTS.md`/`CLAUDE.md` fragment
  (covered by pasting `core/*.md` directly until this is worth automating).
- `measurements/`-style published corpora (reconsidered once an eval
  report is itself worth citing as a source).
- Genres beyond `chat-answer`, `commit-message`, `pr-description`,
  `readme`, `design-doc`, `report` (a genre's enum widens only alongside
  content that uses it).
- Calling `starter/writing-guard`'s advisory rules directly from
  `textlint`/`Vale` hooks (advisory guidance ships as a CI report and a
  copyable config template for now).
- A non-Claude eval judge model.
