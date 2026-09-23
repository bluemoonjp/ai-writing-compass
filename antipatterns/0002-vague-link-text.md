---
id: "0002"
title:
  ja: "「こちら」「click here」をリンクテキストにする"
  en: "\"click here\" or \"こちら\" as link text"
status: active
classification: harmful
harmed_tasks: [decide, lookup, verify]
tier: durable
genres: ["any"]
lang: [ja, en]
rule:
  ja: "「こちら」「ここ」「click here」「this link」だけのリンクテキストは使わない。"
  en: "Never use \"click here\", \"here\", \"this link\", or \"こちら\"/\"ここ\" alone as link text."
relates_to: ["0008"]
body_lang: en
license: CC-BY-4.0
sources:
  - url: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html
    evidence_strength: standard
    supports: harm
    lang: en
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      W3C WCAG 2.2 Understanding SC 2.4.4. Explains that the criterion
      exists so a reader can decide whether to follow a link, including
      from an assistive-technology-generated list of links out of
      context, without a "complicated strategy" to understand the page.
    quote: >-
      The intent of this success criterion is to help users understand
      the purpose of each link so they can decide whether they want to
      follow the link. ... Meaningful links help users choose which
      links to follow without requiring complicated strategies to
      understand the page.
---

## Symptom

A link whose visible text is only "click here", "here", "this link", "read more" (with no other qualifier), or the Japanese equivalents "こちら"/"ここ". Out of the surrounding sentence, the text alone says nothing about where the link goes or why the reader would follow it.

## Cause

This phrasing treats the link as a verb attached to the sentence ("click here to ...") rather than as a reference to a specific destination. It also mirrors how such phrases are commonly modeled in training data, where the surrounding sentence usually does carry the missing information — but a reader who encounters the link out of that context (an assistive-technology link list, a skimmed line, a quoted excerpt) does not have it.

## Remedy

Name the destination in the link text itself: the title of the page or document, the organization, or the specific claim it supports. If the link must stay short, put the descriptive words inside the link rather than around it.

## Examples

- Bad: `For more details, [click here](https://example.com/spec).`
- Good: `See the [project's release notes](https://example.com/spec) for details.`
