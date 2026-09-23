---
id: "0001"
title:
  ja: "むき出しのURLの直後に全角文字を続ける"
  en: "A bare URL immediately followed by a full-width character"
status: active
classification: harmful
harmed_tasks: [verify, lookup, understand]
tier: durable
genres: ["any"]
lang: [ja]
rule:
  ja: "地の文にむき出しのURLを書くとき、直後に全角の句読点・括弧・かな漢字を続けない。"
  en: "When writing a bare URL in running Japanese text, do not let a full-width character follow it directly."
relates_to: ["0008"]
body_lang: ja
license: CC-BY-4.0
sources:
  - url: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls
    evidence_strength: standard
    supports: harm
    lang: en
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      GitHub Docs: GitHub-Flavored Markdown の拡張自動リンクは、URLの後ろに
      続く文字を、空白や一部のASCII記号(? ! . , : * _ ~)、対応しない )
      に達するまで取り込む。全角文字はこの終端文字に含まれない。
    quote: >-
      GitHub automatically creates links when valid URLs, or references, are written in the body text of an Issue, Pull Request, or comment.
  - url: https://api.github.com/markdown
    evidence_strength: standard
    supports: harm
    lang: ja
    confidence: verified
    verified_on: "2026-09-23"
    summary: >-
      GitHub REST API の POST /markdown (mode=gfm) に
      `https://example.com/foo（詳細）` を渡して直接レンダリングした。
      URLの後ろの全角括弧が丸ごとリンクに取り込まれ、`href` にも混入する
      ことを確認した。全角の句点「。」でも同様に文末まで取り込まれること
      を別途確認した。
    quote: >-
      <p><a href="https://example.com/foo%EF%BC%88%E8%A9%B3%E7%B4%B0%EF%BC%89"
      rel="nofollow">https://example.com/foo（詳細）</a></p>
---

## 症状

Markdown の地の文に `https://example.com/foo（詳しくはこちら）` のようにむき出しの URL を書き、直後に全角の括弧・句点・かな漢字を続けると、GitHub の GFM レンダラはその後続文字ごとリンクに取り込む。結果として、表示されるリンクテキストは URL と後続の日本語がつながった長い文字列になり、`href` にも余分な文字がパーセントエンコードされて混入する。読み手がリンクを踏んでも、意図したページに届かないか、届いても読み手はリンクの範囲がどこまでかを誤認する。

## 原因

GFM の拡張自動リンクは、URL の終端を「空白、または一部の ASCII 記号(`? ! . , : * _ ~`)、または対応しない `)`」で判定する。全角文字はこの終端文字の集合に含まれないため、全角の句読点・括弧・かな漢字はすべて URL の一部として取り込まれ続ける。

## 対処

地の文に URL を書くときは、むき出しのまま書かず `[リンクテキスト](URL)` の明示的な Markdown リンク構文を使う。どうしてもむき出しで書く場合は、直後に半角スペースか改行を入れ、全角文字を直接続けない。

## 例

- 悪い例: `詳細は https://example.com/foo（詳しくはこちら）をご覧ください。`
- 良い例: `詳細は [こちらのページ](https://example.com/foo) をご覧ください。`
