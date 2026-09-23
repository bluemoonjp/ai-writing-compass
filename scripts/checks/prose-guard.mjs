// Dogfooding: applies starter/writing-guard's error-severity rules to this
// repository's own Markdown, the same way the plugin's PostToolUse hook
// would apply them to a file an agent just wrote. See docs/adr/0004.
//
// Reads rules.json from `root` (a fixture's temp directory in a test, the
// real repository otherwise) rather than importing it as a module, so a
// fixture can supply its own rules.json + antipatterns/*.md pair without
// touching the real, currently-empty starter/writing-guard/rules.json.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { scan } from '../../starter/writing-guard/index.mjs'

const RULES_REL_PATH = 'starter/writing-guard/rules.json'
const RULE_ID = 'prose-guard'
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
  const findings = scan(targets, rules, { surface: 'markdown', onlySeverity: 'error' }).map((f) => ({
    path: f.path,
    line: f.line,
    ruleId: `${RULE_ID}:${f.ruleId}`,
  }))
  return { findings }
}
