---
id: "0008"
title:
  ja: "リンクテキストは行き先を表す語にする"
  en: "Link text names the destination"
status: active
scope: principle
reader_tasks: [verify, lookup]
genres: ["any"]
lang: [ja, en]
rule:
  ja: "リンクテキストだけで行き先や目的が分かるようにする。「こちら」「click here」は使わない。"
  en: "Make a link's purpose determinable from its text alone. Never use \"click here\" or \"こちら\" as the link text."
core:
  section: certainty
  order: 1
body_lang: en
license: CC-BY-4.0
sources:
  - url: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html
    evidence_strength: standard
    supports: rule
    lang: en
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      W3C WCAG 2.2 Understanding Success Criterion 2.4.4 (Link Purpose,
      In Context), Level A. Requires that a link's purpose be
      determinable from its own text (plus programmatically-associated
      context), except where ambiguous to users in general is
      acceptable.
    quote: >-
      The purpose of each link can be determined from the link text
      alone or from the link text together with its programmatically
      determined link context, except where the purpose of the link
      would be ambiguous to users in general.
---

## Why

A reader scanning a document, or a screen reader user pulling up a list of links out of context, has to decide whether to follow a link based on nothing but its visible text. Text like "here" or "こちら" carries no information at that point — the reader must go back and re-read the surrounding sentence, or follow the link blind and find out. Naming the destination in the link text itself removes that extra step, and it is also how the reader judges whether the source is worth checking before spending the click.

## When it applies

Any document with links: chat replies, README files, reports, and documentation. It does not require a link to be long — a link text of two or three words that names the destination (a document title, an organization, a specific claim) satisfies it; a single vague word does not, regardless of length.

## Examples

- Bad: "See [here](https://example.com/spec) for details."
- Good: "See the [W3C WCAG 2.2 specification](https://example.com/spec) for details."
