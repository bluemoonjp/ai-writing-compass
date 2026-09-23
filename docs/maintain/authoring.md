# Authoring practices and antipatterns

A `practices/NNNN-slug.md` or `antipatterns/NNNN-slug.md` file's frontmatter must validate against `schemas/practice.schema.json` or `schemas/antipattern.schema.json` (both build on `schemas/defs.schema.json`).

## Fields that need care

- `title` and `rule` are bilingual (`{ja, en}`); both are always required, regardless of which language(s) `lang` says this rule governs.
- `scope: principle` means task-general (`genres` must be `["any"]`); `scope: convention` means specific to the listed genres.
- `core` is present only on a principle placed in the always-loaded `core/*.md`; absent means it never renders there.
- `sources[].evidence_strength` is one of `standard` (a regulation or spec), `empirical` (a study), `expert_guide` (an expert's book or style guide), `practitioner` (a practitioner's post or an OSS tool), or `anecdotal`.
- `sources[].supports` says what the source is cited for: `rule` (the rule itself), `harm` (that violating it harms a reader), or `frequency` (only that a pattern occurs at some rate -- a detection signal, never grounds for an antipattern to become `harmful`).
- `sources[].confidence: verified` requires an actual re-fetch of the live document (curl or an equivalent), not a recalled quote; it also requires `quote` (<=300 chars).
- An `active` practice or antipattern needs at least one source that is `confidence: verified`, `evidence_strength` in `standard`/`empirical`/`expert_guide`, and `supports: rule` (or `supports: harm` for a `harmful` antipattern).
- An antipattern's `classification` is `harmful` (a verified source ties it to reader harm; needs `harmed_tasks`), `signal_only` (only frequency evidence exists; needs `signal_for`, and can never back a `severity: error` guard rule), `undetermined`, or `obsolete`.
- An antipattern's `tier` is `durable` (reader-outcome-based) or `model_specific` (needs `observed_on` and `observed_models`, reviewed at each model release).

## What not to write

- A rule with no source.
- This repository's own history, in prose (`no-history-words`).
- A link from `practices/` to `antipatterns/` (`links-one-way`).
- A hand-edited generated file (`generated-fresh`).
- An `Addendum`/`Updates`/`Changelog` section (`no-addendum-sections`).

## Bad examples inside a practice/antipattern body

A deliberately bad example sentence must live inside a fenced code block or an inline code span, never in the surrounding prose -- `starter/writing-guard/mask.mjs` excludes exactly those spans before `prose-guard` and `no-history-words` scan a file, so a masked bad example is never mistaken for a real violation of this repository's own style (docs/adr/0004).

## Retiring a practice

Do not mark it deprecated in place. Delete the file, and if the change in guidance is itself worth recording, add an `antipattern` with `classification: obsolete`.

The following table is generated from `checks.json` by `pnpm gen`.

<!-- gen:start -->
| Check | Blocking | Enforces | What it protects |
| --- | --- | --- | --- |
| `no-line-refs` | yes |  | Markdown and template files must not reference a specific line number, since the reference silently drifts out of sync the moment either file is edited. |
| `forbidden-patterns` | yes |  | Repository text and commit messages in the PR range must not contain filesystem paths, email addresses, or maintainer-private strings, since a public repository cannot redact history after the fact. |
| `adr-check` | yes |  | Each ADR file must follow the docs/adr/NNNN-slug.md naming scheme, declare one of the four valid Status values, declare a Date: line formatted YYYY-MM-DD, and reference other ADRs by ID only, since a broken, undated, or ambiguous decision record cannot be trusted the next time it is read. |
| `frontmatter-schema` | yes |  | Every practice and antipattern file's frontmatter must validate against its JSON Schema (including evidence_strength, reader_tasks, and genres), its id must match its file name, and its body may only use the fixed bilingual H2 heading set for its kind and body_lang, since ungoverned metadata is what lets a single unsupported claim, a mislabeled evidence strength, or an uncited quote pass as settled guidance. |
| `self-check-resolves` | yes |  | Every active practice and antipattern must be named in some check's `enforces` (as practices/NNNN or antipatterns/NNNN) or in scripts/checks/data/not_applicable.json with a reason, since a rule nothing checks and nobody has explicitly exempted is a rule that silently stops being followed. |
| `no-history-words` | yes |  | practices/, templates/, core/, and plugin SKILL.md files must not narrate this repository's own history (used to / 以前は / かつては) or present two conflicting canonical answers outside a practice's Conflicting guidance section, since a deliverable file is read by an agent working on another project with no access to this repository's history and needs exactly one answer. |
| `no-addendum-sections` | yes |  | practices/, antipatterns/, templates/, core/, plugin SKILL.md, AGENTS.md, CLAUDE.md, and README.md must not grow an Addendum/Updates/Changelog/追記/更新履歴 section, since that pattern is exactly how a file silently outgrows its own original purpose. |
| `links-one-way` | yes |  | A practices/ file must not link to antipatterns/, since layer A's practices are the deliverable read by an agent under time pressure and an antipattern is documentation for a maintainer deciding what to avoid, not something that belongs in the middle of an instruction an agent is following. |
| `readme-sections-paired` | yes |  | README.md's 日本語 and English sections must have the same number of H3 subsections, since the two are meant to say the same thing in two languages and a silent count mismatch is the cheapest signal that one language was edited without the other. |
| `doc-check-ids-resolve` | yes |  | Every `(ci: <id>)` annotation in AGENTS.md and every check-id table row in docs/maintain/authoring.md must name a check that actually exists in checks.json, since a stale reference to a renamed or removed check silently stops meaning anything. |
| `instruction-limits` | yes |  | AGENTS.md must stay at or under 40 lines and CLAUDE.md must stay at or under 10 lines with `@AGENTS.md` as its first line, since this repository's own always-loaded instructions must themselves stay minimal, the same discipline docs/adr/0002 and docs/adr/0003 hold core/*.md to (dogfooding; docs/adr/0001). |
| `layer-b-no-a-content` | yes |  | AGENTS.md, CLAUDE.md, and docs/maintain/ must not restate a practice or antipattern's id or bilingual title, since layer B enforces layer A only by reference, never by repetition (docs/adr/0001). This is a coarse, mechanically-detectable proxy for the boundary, not a complete check of it. |
| `no-live-instruction-files` | yes |  | Only the fixed allowlist of paths may use a filename some agent tool discovers as a live instruction file (CLAUDE.md, AGENTS.md, SKILL.md, .cursorrules, and directories such as .claude/), since a stray copy elsewhere in the tree would silently start being read as real instructions by whichever agent finds it. |
| `generated-fresh` | yes |  | docs/maintain/authoring.md's generated check table, practices/index.md, antipatterns/index.md, README.md's generated blocks, and core/core.ja.md / core/core.en.md must all match what `pnpm gen` produces, since a hand-edited or stale generated file silently drifts from the source content it claims to summarize. |
| `core-budget` | yes |  | core/core.ja.md and core/core.en.md must each stay at or under 25 rules, 60 lines, and 6,000 characters, since a longer always-loaded core is exactly the failure mode this repository exists to avoid in every other project (docs/adr/0002, docs/adr/0003). |
| `guard-rules-resolve` | yes |  | Every starter/writing-guard/rules.json entry must validate against schemas/guard-rule.schema.json, and a severity: error entry's basis must not be "judgment" and every antipattern it links to must be classification: "harmful" (never "signal_only"), since blocking a writer on a pattern that is merely a detection signal -- or on a rule nobody re-verified as causing reader harm -- is the exact failure mode docs/adr/0004 exists to prevent. |
| `prose-guard` | yes | antipatterns/0001, antipatterns/0002 | This repository's own tracked Markdown (outside fixtures/eval materials) must trigger no severity: error starter/writing-guard rule, since a writing-style repository that violates its own error-level rules has nothing to say to anyone else (dogfooding; see docs/adr/0004). |
| `prose-guard-advisory` | no |  | Reports this repository's own tracked Markdown against starter/writing-guard's severity: advisory rules, the same suggestions the plugin's hook would surface on a file a writer just edited, without ever failing CI on a rule that needs a reader's judgment. |
| `freshness-report` | no |  | Every active practice and antipattern's tracked date (observed_on for a model_specific antipattern, otherwise the oldest sources[].verified_on) is checked against a 180-day threshold and reported, since a citation nobody has revisited in six months is a candidate for the next review, even without this repository's siblings' weekly patrol (see ROADMAP.md). |
| `skill-shape` | yes |  | Every plugins/*/skills/*/SKILL.md must have frontmatter matching schemas/skill-frontmatter.schema.json with a name matching its own directory, a body under 500 lines, and relative links confined to its own references/ subdirectory, since a skill that grows past this shape stops being the thin, mostly-always-loaded file the runtime assumes it is. |
| `release-check` | yes |  | Every plugin a marketplace entry points at must have a plugin.json whose version matches the marketplace entry (and, when WRITING_COMPASS_RELEASE_TAG is set, the pushed tag) and must carry its own LICENSE/LICENSE-DOCS copies, since an install only ever copies the plugin directory, not the repository root. |
| `eval-coverage` | yes |  | Every plugins/*/skills/*/SKILL.md must have, among that plugin's evals/, at least one case tagged to fire it in ja, one in en, and one near-miss case tagged not to fire it, since an untested skill boundary is exactly what lets one skill silently fire for another's request (docs/maintain/eval.md). |
<!-- gen:end -->
