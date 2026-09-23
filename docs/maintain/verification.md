# Source verification (Phase 0)

A conclusion from prior research is a lead, never a citable source (docs/adr/0008). Landing a claim in `practices/` or `antipatterns/` requires re-fetching the actual source and reading the real text.

## Procedure, per claim

1. **Identify** the canonical URL. A book or another offline source is out of scope for now (`sources[].url` is required and must be `http(s)://`).
2. **Fetch** the raw document, not a summary. A tool that returns a model's paraphrase of a page (including most web-fetch tools) does not produce a `quote`. For a PDF, download it and extract its text (`pdftotext -enc UTF-8` handles Japanese government PDFs that plain `pdftotext` garbles) before searching it. For a web page, prefer `curl` writing to a file over piping its output directly into a command.
3. **Classify** `evidence_strength` (`standard` / `empirical` / `expert_guide` / `practitioner` / `anecdotal`) and `sources[].supports` (`rule` / `harm` / `frequency`) — see `docs/maintain/authoring.md`.
4. **Quote** a verbatim excerpt (<=300 chars) actually found in the fetched text. For a source in Japanese, keep the quote within the bounds Article 32 of Japan's Copyright Act sets for citation (necessity, a minor and clearly-marked portion, the main text still standing on its own, and the source named).
5. **Draft or drop.** If the claim cannot be independently confirmed in the raw source, it does not land — it stays a lead, tracked outside `practices/`/`antipatterns/`, not written into a file with a weakened claim.

## Order

1. Core principles (`core: {...}` practices) — these block `core/*.md` from existing at all.
2. Japanese-specific rules.
3. Genre conventions the core covers (`chat-answer`, `commit-message`, `pr-description`).
4. Genre conventions a skill covers (`readme`, `design-doc`, `report`).
5. Antipatterns.

A numeric claim (an effect size, a percentage, a sample count) that cannot be traced to its primary source's own text is dropped by default, not carried forward on the strength of a research pass alone.

## Lessons carried from ai-adr-compass

- An antipattern count of zero is an acceptable outcome, not a problem to solve by lowering the bar.
- Build the machinery a piece of content actually needs once that content exists; building ahead of the content it serves is what produced that repository's own rework.
