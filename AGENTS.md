# AGENTS.md

Sourced, evidence-graded guidance for writing text an AI reads or writes; distilled for the moment of writing, not as a style-guide wiki.

Always-loaded context here is limited to principles and an index; anything longer belongs in a linked document.

## Layers

This repository has two layers (ADR-0001): the deliverable (layer A: `practices/`, `antipatterns/`, `core/`, `templates/`, plugin `SKILL.md` files) and this repository's own operation (layer B: this file, `CLAUDE.md`, `.claude/`, `docs/maintain/`). Layer B never restates layer A's content by id or title.

## Working rules

- Work only through pull requests. (none)
- PR titles match `#N: summary`. (none)
- Run `pnpm check` before opening a PR. (none)
- Regenerate generated files with `pnpm gen`; never hand-edit them. (ci: generated-fresh)
- Never narrate this repository's own history in prose. (ci: no-history-words)
- Never write filesystem paths, email addresses, or other private information. (ci: forbidden-patterns)
- Cite a source with a summary, an evidence strength, and a link, not a bare claim. (ci: frontmatter-schema)
- Re-verify a primary source directly (curl/fetch it); a recalled or paraphrased quote is not a citable quote. (none)

Write an ADR only when deleting the decision would let someone repeat the mistake, and re-deciding it would need reconstructing an incident or a long investigation.

## Map

| Path | Contents |
| --- | --- |
| `core/` | The always-loaded writing core, generated from `practices/` |
| `docs/adr/` | Architecture decision records |
| `docs/maintain/` | Maintainer setup, authoring, verification, and eval instructions |
| `plugins/` | The Claude Code plugin this repository distributes itself as |
| `practices/` | Sourced writing principles and genre conventions |
| `antipatterns/` | Sourced patterns that harm a reader, or are only a detection signal |
| `schemas/` | JSON Schemas for practice, antipattern, skill, and guard-rule frontmatter |
| `scripts/` | The check toolchain: runner, checks, and their fixtures |
| `starter/writing-guard/` | The dependency-free error-level prose guard shared by hooks, `commit-msg`, and this repository's own CI |
| `taxonomy/` | The reader-task and genre definitions content is organized by |
