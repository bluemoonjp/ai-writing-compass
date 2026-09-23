# ADR-0001: Two layers: deliverable (A) and repository operations (B)

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

This repository has two audiences for its instruction text. Layer A is the deliverable: `practices/`, `antipatterns/`, `core/`, `templates/`, and the plugin's `SKILL.md` files, written to be read by an agent writing text in *some other* project. Layer B is this repository's own operations: the root `AGENTS.md` and `CLAUDE.md`, `.claude/`, and `docs/maintain/`, written to be read by an agent working *on this repository*.

Left unstated, the two blur together. A practice's title or rationale creeps into `AGENTS.md` because it happens to be the rule the maintainer wants enforced right now, and the root instruction file grows without bound. Worse, this repository is itself a writing-guidance project — if it does not follow its own layer A content in its own prose, it has no way to notice, and nothing it publishes is credible.

## Decision

Keep the two layers separate by convention and by check:

- Layer A is written for another project's agent. It never assumes this repository's tooling, file layout, or check registry.
- Layer B is written only for an agent working on this repository. It never restates a layer A practice's title, id, or rule text — it may enforce one, but always by reference (`enforces` in `checks.json`, or `scripts/checks/data/not_applicable.json`), never by repetition.
- This repository follows its own layer A advice (dogfooding): `core/core.ja.md` and `core/core.en.md` are what this repository's own prose is held to, and `prose-guard` checks it.

The check `layer-b-no-a-content` is a coarse proxy for this boundary: it greps `AGENTS.md`, `CLAUDE.md`, and `docs/maintain/` for the shape of a practice/antipattern id or a bilingual title and fails if one appears. It cannot detect every violation of the boundary — only that specific, mechanically-checkable one — and `checks.json`'s `protects` field for that check says so.

## Consequences

This makes it possible to check the deliverable and the repository's own operation against different, sometimes conflicting, constraints (layer A must work when copied or quoted into a project with none of this repository's tooling; layer B must stay small enough to always-load) without one silently absorbing the other's content over time.

It does not solve human review on a single-maintainer repository. `.claude/settings.json`'s `permissions.deny` narrows what an agent working through Claude Code can do unsupervised, but it has no effect on any other agent or on a human running the same commands directly.
