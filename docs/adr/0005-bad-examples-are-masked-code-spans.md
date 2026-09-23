# ADR-0005: A bad example lives only inside a code span or fenced block, and self-scanning masks those spans

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

A writing-guidance repository necessarily shows bad examples — a sentence that buries its conclusion, a chat-residue opening line, a bare URL next to full-width punctuation. Every check that scans this repository's own prose for those exact patterns (`no-history-words`, `prose-guard`) would otherwise flag its own illustrative examples as violations. `ai-adr-compass`'s answer to the equivalent problem — splitting an example string across a sentence so no single contiguous match exists — makes the example itself hard to read, which is precisely the failure mode this repository exists to prevent.

## Decision

A deliberately bad example lives only inside an inline code span or a fenced code block, never in surrounding prose. `starter/writing-guard/mask.mjs` masks CommonMark fenced code blocks, inline code spans, HTML comments, and URI autolinks — replacing each with same-length whitespace, newlines preserved — before any prose-scanning tool (`starter/writing-guard/index.mjs`'s `scan`, and `scripts/lib/phrase-scan.mjs`) looks at the text. `docs/maintain/authoring.md` states the convention for anyone writing a practice or antipattern's `## Examples`/`## 例` section.

## Consequences

A check that forgets to mask (or a new prose-scanning check that is added without reusing `mask.mjs`) will flag this repository's own examples — which is the intended fail-safe direction: a missed mask produces a loud, blocking false positive in this repository's own CI, not a silent gap in coverage for a downstream user's text.
