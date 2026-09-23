import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'

const RULE_ID = 'self-check-resolves'
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

function readJson(root, relPath, fallback) {
  try {
    return JSON.parse(readFileSync(path.join(root, relPath), 'utf8'))
  } catch {
    return fallback
  }
}

// checks.json's `enforces` and scripts/checks/data/not_applicable.json's keys
// both use the full "practices/0001" / "antipatterns/0001" form (unlike the
// sibling repositories, which only let a practice resolve via `enforces`):
// a guard rule in starter/writing-guard/rules.json links to an antipattern,
// not a practice, so an antipattern needs the same two resolution paths a
// practice has.
export function run({ root, files }) {
  const findings = []

  const checks = readJson(root, 'checks.json', { checks: [] }).checks ?? []
  const enforcedRefs = new Set(checks.flatMap((c) => c.enforces ?? []))

  const notApplicable = readJson(root, 'scripts/checks/data/not_applicable.json', {})
  const notApplicableKeys = new Set(Object.keys(notApplicable))

  const contentFiles = files.filter(
    (f) => (f.path.startsWith('practices/') || f.path.startsWith('antipatterns/')) && f.path.endsWith('.md'),
  )

  for (const file of contentFiles) {
    const data = extractFrontmatter(file.text)
    if (!data || data.status !== 'active' || typeof data.id !== 'string') continue
    const kind = file.path.startsWith('practices/') ? 'practices' : 'antipatterns'
    const ref = `${kind}/${data.id}`
    if (!enforcedRefs.has(ref) && !notApplicableKeys.has(ref)) {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:unresolved` })
    }
  }

  return { findings }
}
