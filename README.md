# ai-writing-compass

## 日本語

### What this is

AI(コーディングエージェント、チャットAI)が書く文章のための、出典つき・強度つきの文章作成指針です。分野の慣習を真似るのではなく、読み手の成果(理解・判断・行動・検証)に対して最適な設計を、調査に基づいて組み立てます。

### Who reads it

主な読者は、チャット回答・コミットメッセージ・PR本文・README・設計文書などを書くAIエージェントです。このリポジトリ自体は人間が保守し、エージェントの提案をレビューします。

### Status

v0.1 進行中。出典の再検証(Phase 0)と内容の追加を続けています。詳細は [ROADMAP.md](ROADMAP.md) を参照してください。

<!-- gen:start:how-to-use-ja -->
_`practices/*.md` と `antipatterns/*.md` から `pnpm gen` で生成。このブロックは編集しないこと。_ **7** 件の active な practice と **0** 件の active な antipattern を [`practices/index.md`](practices/index.md) / [`antipatterns/index.md`](antipatterns/index.md) に索引化(ライセンス: [CC BY 4.0](LICENSE-DOCS))。
<!-- gen:end:how-to-use-ja -->

### How to use

このリポジトリを clone し、`core/core.ja.md` の内容を自分のプロジェクトの `AGENTS.md` に貼り付けてください。Claude Code では `CLAUDE.md` から `@AGENTS.md` で取り込みます。

### Layout

各トップレベルディレクトリの中身は、このリポジトリ自身の [AGENTS.md](AGENTS.md) にある Map 表を参照してください。

### Update policy

出典の再検証を経た変更だけが `practices/` `antipatterns/` `core/` に反映されます。人間が全ての変更を承認します。

### License

文書(practices、antipatterns、docs、このREADMEの本文)は [CC BY 4.0](LICENSE-DOCS)、コード・スクリプト・スキーマ・設定は [MIT](LICENSE) です。

### Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

### How this differs

全ての主張は出典と評価済みの根拠の強さ(evidence_strength)にまで遡れます。読み手への実害が確認された規則(harmful)と、頻度が変わっただけの検出シグナル(signal_only)を区別します。

## English

### What this is

Sourced, evidence-graded writing guidance for AI (coding agents, chat assistants). Rather than imitating a genre's conventions, it designs for the reader's outcome (understand, decide, act, verify), built from research.

### Who reads it

The primary reader is an AI agent writing a chat reply, commit message, PR description, README, or design document. A human maintains this repository and reviews what an agent proposes.

### Status

v0.1 in progress. Source re-verification (Phase 0) and content are still being added. See [ROADMAP.md](ROADMAP.md).

<!-- gen:start:how-to-use-en -->
_Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit this block._ **7** active practices and **0** active antipatterns are indexed in [`practices/index.md`](practices/index.md) and [`antipatterns/index.md`](antipatterns/index.md), licensed under [CC BY 4.0](LICENSE-DOCS).
<!-- gen:end:how-to-use-en -->

### How to use

Clone this repository and paste `core/core.en.md`'s content into your own project's `AGENTS.md`. In Claude Code, `CLAUDE.md` pulls it in via `@AGENTS.md`.

### Layout

See the Map table in this repository's own [AGENTS.md](AGENTS.md) for what each top-level directory holds.

### Update policy

Only a change that went through source re-verification lands in `practices/`, `antipatterns/`, or `core/`. A human approves every change.

### License

Documentation (practices, antipatterns, docs, and this README's prose) is licensed under [CC BY 4.0](LICENSE-DOCS). Code, scripts, schemas, and configuration are licensed under [MIT](LICENSE).

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### How this differs

Every claim traces back to a source and a graded evidence strength. A rule confirmed to harm a reader (harmful) is kept distinct from a pattern that is merely a frequency-detection signal (signal_only).
