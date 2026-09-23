# Release

## Before tagging

1. `pnpm gen && pnpm check --strict && pnpm test` all pass, with `WRITING_COMPASS_PRIVATE_PATTERNS` set.
2. `npx markdownlint-cli2` and `gitleaks detect --no-git` are clean.
3. `claude plugin validate ./plugins/writing-compass --strict` passes.
4. Eval layers 1-2 have run (`claude plugin eval ./plugins/writing-compass`) and every case's score meets its threshold; the near-miss cases show `min:0, max:0` on both arms.
5. Eval layer 3 has run at least once per tracked material (`node scripts/eval/run-qa.mjs <material>`) and the canary reported clean.
6. `plugins/writing-compass/.claude-plugin/plugin.json`'s `version` and `.claude-plugin/marketplace.json`'s matching entry's `version` agree (`release-check` enforces this).

Layers 4-5 (blind pairwise, human calibration) are not a release gate for v0.1.0 -- see docs/adr/0007. A pairwise result is never published before a layer-5 calibration exists for the judge/model pair that produced it.

## Bumping the version

Update both `plugins/writing-compass/.claude-plugin/plugin.json`'s `version` and `.claude-plugin/marketplace.json`'s matching `plugins[].version` in the same PR (`release-check` fails otherwise). Tag as `vX.Y.Z`; CI's `check` job reads the pushed tag into `WRITING_COMPASS_RELEASE_TAG` and fails if it doesn't match `plugin.json`.

## Installing to try it

```sh
claude plugin marketplace add bluemoonjp/ai-writing-compass
claude plugin install writing-compass@ai-writing-compass
```

Without a marketplace, copy `plugins/writing-compass/skills/<name>/` directly into `~/.claude/skills/<name>/`; this loses the hooks and the SessionStart core injection, which only come from installing the plugin itself.
