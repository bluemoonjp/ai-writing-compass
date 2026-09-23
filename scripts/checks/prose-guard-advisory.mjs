// Non-blocking counterpart to prose-guard: reports starter/writing-guard's
// advisory-severity rules against this repository's own Markdown, so a
// maintainer can see the same suggestions the plugin's hook would surface,
// without CI ever failing on a judgment call. See docs/adr/0004.
//
// Reads rules.json from `root` for the same fixture-testability reason as
// prose-guard.mjs -- see that file's comment.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { scan } from '../../starter/writing-guard/index.mjs'

const RULES_REL_PATH = 'starter/writing-guard/rules.json'
const RULE_ID = 'prose-guard-advisory'
const EXCLUDE_PREFIXES = [
  'scripts/checks/fixtures/',
  'starter/writing-guard/test-fixtures/',
  'eval/materials/',
  'eval/reports/',
]

function loadRules(root) {
  try {
    return JSON.parse(readFileSync(path.join(root, RULES_REL_PATH), 'utf8'))
  } catch {
    return []
  }
}

export function run({ root, files }) {
  const rules = loadRules(root)
  const targets = files.filter((f) => f.path.endsWith('.md') && !EXCLUDE_PREFIXES.some((p) => f.path.startsWith(p)))
  const findings = scan(targets, rules, { surface: 'markdown', onlySeverity: 'advisory' }).map((f) => ({
    path: f.path,
    line: f.line,
    ruleId: `${RULE_ID}:${f.ruleId}`,
  }))
  return { findings }
}
