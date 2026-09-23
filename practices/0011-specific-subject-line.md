---
id: "0011"
title:
  ja: "件名・タイトルは具体的な語で書く"
  en: "Make the subject line or title specific"
status: active
scope: convention
reader_tasks: [decide, lookup]
genres: [commit-message, pr-description]
lang: [ja, en]
rule:
  ja: "コミットの件名やPRのタイトルには、対象と内容を表す具体的な語を入れる。「〜について」のような曖昧な言い方にしない。"
  en: "A commit subject or PR title names the specific subject and what changed about it -- never a vague \"about X\" placeholder."
core:
  section: genre
  order: 1
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
      文化審議会建議「公用文作成の考え方」解説 Ⅲ-2-ア「標題(タイトル)
      では、主題と文書の性格を示す」。標題には主題を示す具体的な言葉を
      入れ、何についてのどんな文書かを一目で分かるようにするよう定める。
    quote: >-
      何について書かれた文書であるのかが一目で分かるように、標題(タイ
      トル)には、主題となる案件を示す言葉を入れる。鍵となる言葉は、で
      きるだけ具体的なものとし、取り上げる事柄を特定できるようにする。
---

## 理由

コミット一覧や PR 一覧は、件名・タイトルだけを見て読み手が「開くか・後回しにするか・無視す
るか」を判断する場所であり、後から `git log --oneline` や検索で特定の変更を探す手がかりにもな
る。「Update」「Fix bug」「〜について」のような具体性のない件名は、この判断も検索も助けない。

## 適用範囲

コミットメッセージの1行目と、PRのタイトルに適用する。対象(どのファイル・機能・コンポーネ
ント)と、何をしたか(修正・追加・変更の内容)の両方を、具体的な語で示す。

## 例

- 悪い例: `Update`、`Fix bug`、`ログイン処理について`
- 良い例: `Fix session timeout not clearing on logout`、`ログアウト時にセッションタイムアウトが
  クリアされない不具合を修正`
