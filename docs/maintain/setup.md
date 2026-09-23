# Setup

## Local development

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm check
```

`pnpm check` skips the private-patterns check locally (it prints `private-patterns: skipped (env unset)`) unless `WRITING_COMPASS_PRIVATE_PATTERNS` is set or `--strict` is passed. CI always enforces it.

## WRITING_COMPASS_PRIVATE_PATTERNS

If this repository's maintainer ever needs to keep a maintainer-private string (unrelated to any public value) out of the repository, set the `WRITING_COMPASS_PRIVATE_PATTERNS` GitHub secret to a JSON object:

```json
{ "patterns": ["some-regex-pattern"], "probe": "a-string-that-matches-one-pattern-above" }
```

The `probe` string is required and must match at least one pattern — it is a self-test that catches a typo turning every pattern silently inert. `scripts/checks/forbidden-patterns.mjs` fails closed (treats an unset, invalid, or non-matching-probe value as a finding) whenever `CI` is set or `--strict` is passed.

Setting it with `gh secret set NAME -b '<json>'` from PowerShell can mangle the JSON (PowerShell's argument re-quoting to an external `.exe` does not always preserve nested double quotes) and land an unparseable value that only shows up as `forbidden-patterns:invalid-json` in CI, not as an error from `gh` itself. Pipe the JSON through stdin instead, which `gh secret set` reads when `-b`/`--body` is omitted:

```powershell
Get-Content path\to\patterns.json -Raw | gh secret set WRITING_COMPASS_PRIVATE_PATTERNS --repo bluemoonjp/ai-writing-compass
```

## Advisory lint for a downstream project

`templates/textlintrc.json.template` (Japanese, via `textlint`) and `templates/vale.ini.template` (English, via `Vale`) are copyable starting configs — see `templates/README.md`. Neither is wired into this repository's own CI or the plugin's hooks; only `starter/writing-guard`'s `severity: error` rules block anything here (docs/adr/0004).

## Node and pnpm versions

`package.json`'s `engines.node` and `packageManager` pin the versions this repository is developed and tested against. `.github/actions/setup-node-pnpm` installs exactly those in CI.
