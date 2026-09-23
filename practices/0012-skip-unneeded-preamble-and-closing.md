---
id: "0012"
title:
  ja: "主文だけで足りるなら前置きや締めは書かない"
  en: "Skip the preamble or closing when the main content alone is enough"
status: active
scope: convention
reader_tasks: [decide, act]
genres: [commit-message, pr-description, chat-answer]
lang: [ja, en]
rule:
  ja: "目的・依頼・変更内容を主文に書けば足りるなら、前置きや締めの挨拶は書かない。"
  en: "If the purpose, request, or change is fully stated in the main content, do not add a preamble or closing."
core:
  section: genre
  order: 2
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
      文化審議会建議「公用文作成の考え方」解説 Ⅲ-4-ウ「通知等は、既存
      の形式によることを基本とする」。通知等の中心は主文であり、主文
      だけで目的や依頼が十分に伝わるなら前文や末文は不要と定める。
    quote: >-
      中心となるのは主文であり、この中で、文書の目的と主旨、相手に求
      める事柄とその方法を示す。主文だけで十分に必要を満たせるのであ
      れば、前文や末文は不要である。
---

## 理由

前文(時候の挨拶や背景の説明)や末文(締めの挨拶)は、主文がすでに目的・依頼・変更内容を伝
えているなら、読み手にとって新しい情報を持たない。読み手は用件にたどり着くまでの文字数が増
えるだけで、判断や行動を助けられない。

## 適用範囲

コミットメッセージ、PR本文、チャットの回答に適用する。背景や経緯の説明が読み手の判断に必
要な場合は、その部分だけを主文の前後に置いてよい(公用文の建議も、背景説明が必要な場合の前
文、事務手続の説明が必要な場合の末文は認めている)。

## 例

- 悪い例: 「いつもお世話になっております。今回、ログイン処理まわりの修正を行いましたのでご
  確認いただけますと幸いです。よろしくお願いいたします。」
- 良い例: 「ログアウト時にセッションタイムアウトがクリアされない不具合を修正した。」
