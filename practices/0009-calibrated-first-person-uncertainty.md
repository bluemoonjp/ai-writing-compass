---
id: "0009"
title:
  ja: "不確かさは該当箇所に一人称で具体的に書く"
  en: "State uncertainty at the specific claim, in first-person terms"
status: active
scope: principle
reader_tasks: [decide, verify]
genres: ["any"]
lang: [ja, en]
rule:
  ja: "不確かな主張には、その箇所に一人称で理由とともに不確かさを書く。文書全体にかかる定型の免責文は使わない。"
  en: "Mark an uncertain claim where it appears, in first-person terms, with the reason. Do not rely on a blanket disclaimer covering the whole document."
core:
  section: certainty
  order: 2
body_lang: en
license: CC-BY-4.0
sources:
  - url: https://facctconference.org/static/papers24/facct24-56.pdf
    evidence_strength: empirical
    supports: rule
    lang: en
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      Kim, Liao, Vorvoreanu, Ballard & Vaughan, "'I'm Not Sure, But...'"
      (ACM FAccT 2024). A pre-registered experiment on how an LLM's
      uncertainty expression affects user reliance and trust.
    quote: >-
      We find that participants who are shown first-person expressions
      of uncertainty are less confident in the system's answers, agree
      with the system's answers less often, and submit more correct
      answers compared with participants who see no expression of
      uncertainty.
---

## Why

A first-person, claim-specific expression of uncertainty ("I'm not sure, but...") measurably reduced overreliance and improved task accuracy in a controlled study. A disclaimer covering the whole document (or none at all) gives the reader no way to tell which specific claim is solid and which is not, so they either distrust everything or trust everything — both are worse for a decision that depends on knowing exactly where the ground is firm.

## When it applies

Any claim in any document where the writer is not certain: a number recalled rather than looked up, an inference from a partial source, a recommendation made without testing every case. State what is certain plainly; mark only the uncertain part, where it appears, with a first-person statement of what is unknown and why.

## Examples

- Bad: "Note: this information may not be fully accurate or up to date." (once, at the top, covering everything)
- Good: "The library's latest release is 3.2 (I have not confirmed this against the changelog)."
