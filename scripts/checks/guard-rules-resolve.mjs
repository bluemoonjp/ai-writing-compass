// Verifies every starter/writing-guard/rules.json entry against its own
// schema and, for severity: "error" rules specifically, the three
// conditions docs/adr/0004 sets for a rule to be mechanically enforced:
// (1) basis is "spec" or "mechanical", never "judgment"; (2) every linked
// antipattern is classification: "harmful" (never "signal_only" -- a
// frequency signal is never grounds to block); (3) the linked antipattern
// actually resolves to a real, active file.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import { parse as parseYaml } from 'yaml'

const schemaPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'schemas',
  'guard-rule.schema.json',
)
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const ajv = new Ajv2020({ strict: true, allErrors: true })
const validate = ajv.compile(schema)

const RULE_ID = 'guard-rules-resolve'
const RULES_PATH = 'starter/writing-guard/rules.json'
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/

function extractFrontmatter(text) {
  const match = FRONTMATTER.exec(text)
  if (!match) return null
  try {
    return parseYaml(match[1])
  } catch {
    return null
  }
}

export function run({ files }) {
  const findings = []
  const rulesFile = files.find((f) => f.path === RULES_PATH)
  if (!rulesFile) return { findings }

  let rules
  try {
    rules = JSON.parse(rulesFile.text)
  } catch {
    return { findings: [{ path: RULES_PATH, line: 1, ruleId: `${RULE_ID}:invalid-json` }] }
  }

  const antipatternById = new Map()
  for (const file of files) {
    if (!file.path.startsWith('antipatterns/') || !file.path.endsWith('.md')) continue
    const data = extractFrontmatter(file.text)
    if (data?.id) antipatternById.set(`antipatterns/${data.id}`, data)
  }

  for (const rule of rules) {
    if (!validate(rule)) {
      findings.push({ path: RULES_PATH, line: 1, ruleId: `${RULE_ID}:schema:${rule?.id ?? '?'}` })
      continue
    }

    for (const link of rule.links) {
      const antipattern = antipatternById.get(link)
      if (!antipattern) {
        findings.push({ path: RULES_PATH, line: 1, ruleId: `${RULE_ID}:unresolved-link:${rule.id}` })
        continue
      }
      if (rule.severity === 'error') {
        if (rule.basis === 'judgment') {
          findings.push({ path: RULES_PATH, line: 1, ruleId: `${RULE_ID}:judgment-cannot-error:${rule.id}` })
        }
        if (antipattern.classification !== 'harmful') {
          findings.push({ path: RULES_PATH, line: 1, ruleId: `${RULE_ID}:error-needs-harmful:${rule.id}` })
        }
      }
    }
  }

  return { findings }
}
