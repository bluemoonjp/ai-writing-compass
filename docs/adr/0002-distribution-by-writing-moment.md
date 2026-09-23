# ADR-0002: Distribution is chosen per writing moment, not one mechanism for everything

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

Most of the text an AI coding agent writes is not produced by a dedicated "write a document" task. It is a chat reply, a commit message, or a PR description — none of which involve reading a file. A `paths`-scoped rule only fires when a matching file is read, so it never reaches any of those. A skill only loads when its `description` matches the request, and measured real-world firing rates for that mechanism run around 50%. An output style carries the most instruction weight but is singular (only one active at a time), overrides whatever style the user already chose, and does not reach subagents. Meanwhile, everything that *is* mechanically decidable (a bare URL next to Japanese punctuation, a chat-residue opening line) should never depend on any of the above firing at all.

## Decision

Route by the writing moment, not by a single preferred mechanism:

- Chat replies, commit messages, and PR descriptions (no file read) are reached only by an always-loaded core: `core/core.ja.md` / `core/core.en.md`, pasted into a project's `AGENTS.md` and imported from `CLAUDE.md`, and re-injected by the plugin's `SessionStart` hook (which also survives `/compact`).
- A dedicated long document (README, design doc, report) is reached by an Agent-Skills-compliant `SKILL.md` (`writing-compose`, `writing-review`), invoked explicitly or referenced by name from the core — never assumed to auto-fire.
- Whatever is mechanically decidable is reached by `starter/writing-guard`, wired to a `PreToolUse` hook on `git commit`/`gh pr create` and a `PostToolUse` hook on a file edit, plus a `commit-msg` git hook and CI as a tool-independent backstop.
- Maintainer-facing evidence lives in `docs/`, which is never always-loaded.

Rejected: `paths`-scoped rules as the primary channel (does not reach the moments above); an output style as the primary channel (see above); shipping a large style guide inside an always-loaded file (context budget; see ADR-0003/`core-budget`).

## Consequences

Coverage for chat/commit/PR text depends on the core actually being pasted or injected — this repository cannot force that outside its own plugin. The core must therefore stay small enough that pasting it is a reasonable ask (`core-budget`), and every rule in it must justify its presence against every other candidate rule that did not make the cut.
