---
id: "0013"
title:
  ja: "見出しは内容を表す具体的な語にする"
  en: "Make headings informative, not vague topic labels"
status: active
scope: convention
reader_tasks: [lookup, understand]
genres: [readme, design-doc, report]
lang: [ja, en]
rule:
  ja: "見出しには内容を表す具体的な語を使う。「概要」「Scope」のような曖昧な見出しは避ける。"
  en: "Write headings that state their content specifically; avoid vague topic labels like \"Overview\" or \"Scope\" alone."
body_lang: en
license: CC-BY-4.0
sources:
  - url: https://centerforplainlanguage.org/wp-content/uploads/2025/12/FederalPLGuidelines.pdf
    evidence_strength: standard
    supports: rule
    lang: en
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      Federal Plain Language Guidelines, section "II.c. Use lots of
      useful headings". Distinguishes specific question/statement
      headings from vague topic headings (naming "Scope" and
      "Application" as examples) and shows a before/after table.
    quote: >-
      Topic Headings ... are so vague they just aren't helpful ...
      For example, "Application" might mean an application to your
      agency from someone reading your document. But it might as
      easily mean what the document applies to.
  - url: https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93651301_01.pdf
    evidence_strength: standard
    supports: rule
    lang: ja
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      文化審議会建議「公用文作成の考え方」解説 Ⅲ-2-エ「見出しを追えば
      全体の内容がつかめるようにする」。見出しだけを読んでも文書の内容
      と流れがおおよそつかめるよう、内容の中心を端的に言い表す見出しを
      付けるよう定める。
    quote: >-
      読み手は、標題から文書の主題と性格を理解した上で読み進める。見
      出しだけを読んでいけば、文書の内容と流れがおおよそつかめるよう
      にするとよい。
---

## Why

A vague topic heading ("Overview", "Scope", "概要") tells the reader nothing until they read the section under it. A reader scanning a long document for one specific piece of information relies on headings alone to decide where to look; a vague heading forces them to open every section instead of the one they need. The Federal Plain Language Guidelines' own example shows the same section renamed from "Applications" (ambiguous: an application form, or what the rule applies to?) to "How do I apply for a grant under this part?" (unambiguous).

## When it applies

A README, design document, ADR, or report long enough to need section headings. Prefer a heading that states a question the reader has or a specific claim over the section's content, not just its topic category.

## Examples

- Bad: `## Scope`, `## Application`, `## 概要`
- Good: `## What this change does not cover`, `## How to apply for a grant under this part`, `## キャッシュが無効化されない原因`
