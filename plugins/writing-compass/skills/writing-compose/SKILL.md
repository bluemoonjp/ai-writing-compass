---
name: writing-compose
description: Use when writing a standalone document a specific reader will act on -- a README, a design document or the prose of an ADR, or a report -- in Japanese or English, from notes, code, or findings (README・設計文書・調査レポートを書く). Not when improving text that already exists (writing-review), not for a chat reply, commit message, or PR body (the always-loaded core covers those), and not when deciding whether a decision needs an ADR at all.
license: MIT
metadata:
  genres: [readme, design-doc, report]
---

# writing-compose

## Procedure

1. **Identify the reader and the genre.** Name who reads this document and what they do after reading (decide, act, understand, look something up, verify). Pick the genre it belongs to (README, design doc/ADR, report) -- if none fits, ask rather than guessing the structure.
2. **Gather the source material first.** Read the code, notes, or findings this document is based on before writing a line of prose. Do not invent a fact, a number, or a claim this document did not come from.
3. **Draft from the top down.** Write the first paragraph last-checked, first-written: it must state the conclusion, decision, or the single most important fact, in the reader's language (Japanese or English, per the request or the reader's own language if unstated). Everything after it is detail the first paragraph already summarized.
4. **Apply the rules below while drafting**, not as a pass afterward:
   - Structure: state the conclusion/answer/decision first; decide a length limit before writing and cut low-need information when reviewing.
   - Certainty: mark an uncertain claim where it appears, in first-person terms, with the reason -- never a single disclaimer covering the whole document.
   - Wording: prefer a concrete word (a number, a name, an observed behavior) over an abstraction; in Japanese, keep each sentence to one point, keep the subject-predicate relationship traceable, avoid double negation, default to です・ます with concise honorifics, and use a bulleted list only for three or more genuinely parallel items.
   - Links: name the destination in the link text itself. Never "click here"/"こちら". Cite only a source you actually opened and confirmed; put the citation next to the claim it supports.
   - Format: a bulleted list is for parallel items or ordered steps, never for a chain of reasons, causes, or trade-offs -- write those as connected prose.
5. **Write for the document's final reader, not the person who asked for it.** Nothing in the output should read as if addressed to the requester (no "I hope this helps", no narration of what you just did, no leftover dialogue). If you have something to tell the requester, say it outside the document, not inside it.
6. **Self-check before returning the document**: does the first paragraph alone state the conclusion? Is every uncertain claim marked where it appears, not just once at the top? Does every link's text name its destination? Is any list actually reasoning in disguise? If a check fails, fix it before returning the document, not after.
7. **Return only the document.** Put any note to the requester (what you assumed, what you could not verify) after the document, clearly separated, never inside its prose.
