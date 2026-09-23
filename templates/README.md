# templates/

Copyable advisory-lint config for a downstream project. Neither template is wired into `plugins/writing-compass`'s hooks -- see docs/adr/0004 for why blocking enforcement lives only in `starter/writing-guard`, and ROADMAP.md for calling `textlint`/`Vale` from a hook directly as a deferred v0.2 item.

## `textlintrc.json.template`

Copy to `.textlintrc.json` and install:

```sh
npm install --save-dev textlint textlint-rule-preset-ja-technical-writing @textlint-ja/textlint-rule-preset-ai-writing
```

`sentence-length` and `max-ten` from `preset-ja-technical-writing` are left disabled: the preset's own README states no source for its thresholds, and 公用文作成の考え方 itself declines to give a fixed character count (see `practices/0003`'s body). Turn them on deliberately if your project wants a numeric guardrail anyway.

## `vale.ini.template`

Copy to `.vale.ini`, then run `vale sync` to fetch the referenced style. See [Vale's documentation](https://vale.sh/) for adding a style beyond the built-in `Vale` base style.
