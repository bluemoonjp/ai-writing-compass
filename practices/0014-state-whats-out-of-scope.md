---
id: "0014"
title:
  ja: "対象外・不要なことも明示する"
  en: "State what does not apply or is not needed"
status: active
scope: convention
reader_tasks: [decide, act]
genres: [readme, design-doc, report]
lang: [ja, en]
rule:
  ja: "読み手が該当しない場合や、対応が不要な場合も明示し、読み手の判断を助ける。"
  en: "State explicitly when a case does not apply or no action is needed, not just when it does."
body_lang: ja
license: CC-BY-4.0
sources:
  - url: https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93651301_01.pdf
    evidence_strength: standard
    supports: rule
    lang: ja
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      文化審議会建議「公用文作成の考え方」解説 Ⅲ-4-エ「解説・広報等では、
      読み手の視点で構成を考える」。する必要のないことも明示すること
      で、読み手の不安を軽減できると定める。
    quote: >-
      その際、「上記に該当しない場合、手続は不要です」などと、する必
      要のないことも明示することによって、読み手の不安を軽減できる。
---

## 理由

手順や条件を説明する文書は、当てはまる場合のことしか書かないことが多い。しかし読み手は、自分
が当てはまるのかどうか分からないまま読み進め、最後まで読んでも確信が持てないことがある。「こ
の条件に当てはまらない場合は何もしなくてよい」と明示すれば、読み手はその場で判断でき、不要な
作業をせずに済む。

## 適用範囲

README・設計文書・レポートに適用する。対象読者・前提条件・このドキュメントが扱わない範囲
を、本文の早い段階で示す。

## 例

- 悪い例: 手順だけを書き、「この条件に当てはまらない場合はどうすればよいか」に触れない。
- 良い例: 「〜の場合は、この手順は不要です。」と明示する。
