const RULE_ID = 'core-budget'
const MAX_RULES = 25
const MAX_LINES = 60
const MAX_CHARS = 6000
const CORE_PATHS = { ja: 'core/core.ja.md', en: 'core/core.en.md' }

function wcLines(text) {
  return (text.match(/\n/g) ?? []).length
}

function countRuleLines(text) {
  return text.split('\n').filter((line) => line.startsWith('- ')).length
}

export function run({ files }) {
  const findings = []
  const notices = []

  for (const [lang, corePath] of Object.entries(CORE_PATHS)) {
    const file = files.find((f) => f.path === corePath)
    if (!file) continue

    const lines = wcLines(file.text)
    if (lines > MAX_LINES) {
      findings.push({ path: corePath, line: MAX_LINES + 1, ruleId: `${RULE_ID}:too-many-lines` })
    }

    if (file.text.length > MAX_CHARS) {
      findings.push({ path: corePath, line: 1, ruleId: `${RULE_ID}:too-many-chars` })
    }

    const ruleCount = countRuleLines(file.text)
    if (ruleCount > MAX_RULES) {
      findings.push({ path: corePath, line: 1, ruleId: `${RULE_ID}:too-many-rules` })
    }
    notices.push(`${RULE_ID}: ${corePath} — ${ruleCount} rules, ${lines} lines, ${file.text.length} chars`)
  }

  return { findings, notices }
}
