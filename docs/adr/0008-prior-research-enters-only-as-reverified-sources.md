# ADR-0008: Prior research enters this repository only as a re-verified source, never as a copied conclusion

Status: accepted

Issue: (none)
Date: 2026-09-23

## Context

Designing this repository started with a broad research pass across readability, Japanese writing conventions, AI-specific failure patterns, citation practice, structure, delivery mechanisms, and evaluation — dozens of claims, each with a URL a web-fetch tool opened and summarized. A web-fetch summary is a model's paraphrase of a page, not a verbatim quote; treating it as citable would mean this repository's own sourcing discipline (`frontmatter-schema`'s `confidence: verified` requiring a `quote`) is weaker than what it asks a downstream project to follow.

## Decision

A conclusion the prior research pass reached is never copied into a practice, antipattern, or ADR as if it were itself a source. Landing a claim in `practices/` or `antipatterns/` requires re-fetching the actual source directly (`curl`, or an equivalent that returns raw bytes rather than a summary — see `docs/maintain/verification.md`) and pulling the `quote` field from that raw text. `practices/0001` is this repository's first instance of the pattern: verified against the source PDF's extracted text, not against the earlier research pass's paraphrase of it.

A numeric claim the research pass could not independently confirm (an effect size, a percentage, a study's sample count) is tracked as "verify or drop" in the source re-verification backlog, not written into a file on the strength of the research pass alone.

## Consequences

This slows content growth relative to copying the research pass's summaries directly — the same trade `ai-adr-compass`'s ADR-0005 made, and for the same reason. A lead that turns out not to survive re-verification (the quote isn't actually there, the page has changed, the number was itself wrong) is simply dropped, not weakened and kept.
