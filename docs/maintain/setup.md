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

## Node and pnpm versions

`package.json`'s `engines.node` and `packageManager` pin the versions this repository is developed and tested against. `.github/actions/setup-node-pnpm` installs exactly those in CI.
