---
id: "0006"
title:
  ja: "敬語は簡潔に、過剰に重ねない"
  en: "Keep honorifics minimal and concise (Japanese)"
status: active
scope: principle
reader_tasks: [understand, decide, act]
genres: ["any"]
lang: [ja]
rule:
  ja: "敬体(です・ます)を基本に、簡潔な表現で敬意を表し、過度な敬語を重ねない。"
  en: "In Japanese, default to です・ます, express respect concisely, and do not stack honorifics."
core:
  section: ja
  order: 4
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
      文化審議会建議「公用文作成の考え方」解説 Ⅱ-6-ウ「敬意を表す」。敬体を基本に簡潔な表現
      で敬意を表すべきであり、過度な敬語は内容を分かりにくくすると定める。
    quote: >-
      敬語は丁寧度の高い言葉を多用すればよいものではなく、かえってよそよそしい響きで読み手を
      遠ざけてしまう面もある。広報等では敬体(です・ます体)を基本としながら、簡潔な表現で敬
      意を表すよう意識するとよい。相手を立てようとする気持ちから過度の敬語を用いると、伝える
      べき内容が分かりにくくなることがある。
---

## 理由

敬語を重ねるほど丁寧になるとは限らない。過度な敬語は文を長くし、行為や依頼の中身を敬語表現の
中に埋もれさせる。読み手が本当に必要とするのは、正確に伝わる依頼や説明であって、敬語の多さで
はない。

## 適用範囲

日本語で書くチャット回答、業務メール、通知など、敬意を示す必要がある文書に適用する。設計文書
やコードコメントのように敬意の表出が目的でない文書では、そもそも敬体を基本にしない場合もある。

## 例

- 悪い例: 「ご確認いただけますと幸いに存じます。」
- 良い例: 「確認してください。」
