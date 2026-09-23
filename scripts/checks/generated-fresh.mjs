import {
  applyBlock,
  parseAntipatternDetails,
  parsePracticeDetails,
  renderAuthoringTable,
  renderContentIndex,
  renderCore,
  renderReadmeBlockEn,
  renderReadmeBlockJa,
} from '../gen.mjs'

const RULE_ID = 'generated-fresh'
const CHECKS_PATH = 'checks.json'
const AUTHORING_PATH = 'docs/maintain/authoring.md'
const PRACTICE_INDEX_PATH = 'practices/index.md'
const ANTIPATTERN_INDEX_PATH = 'antipatterns/index.md'
const README_PATH = 'README.md'
const CORE_JA_PATH = 'core/core.ja.md'
const CORE_EN_PATH = 'core/core.en.md'

function normalize(text) {
  return text.replace(/\r\n/g, '\n')
}

function markerLine(text, marker) {
  const idx = text.indexOf(marker)
  if (idx === -1) return 1
  return text.slice(0, idx).split('\n').length
}

export function run({ files }) {
  const findings = []
  const notices = []

  const checksFile = files.find((f) => f.path === CHECKS_PATH)
  const authoringFile = files.find((f) => f.path === AUTHORING_PATH)
  if (checksFile && authoringFile) {
    const checks = JSON.parse(checksFile.text).checks
    const table = renderAuthoringTable(checks)
    const actual = normalize(authoringFile.text)
    const expected = normalize(applyBlock(actual, table))
    if (actual !== expected) {
      findings.push({ path: AUTHORING_PATH, line: markerLine(actual, '<!-- gen:start -->'), ruleId: `${RULE_ID}:stale` })
      notices.push(`${RULE_ID}: ${AUTHORING_PATH} is stale — run: pnpm gen`)
    }
  }

  const practices = parsePracticeDetails(files)
  const antipatterns = parseAntipatternDetails(files)

  const practiceIndexFile = files.find((f) => f.path === PRACTICE_INDEX_PATH)
  if (practiceIndexFile) {
    const actual = normalize(practiceIndexFile.text)
    const expected = normalize(renderContentIndex('practice', practices))
    if (actual !== expected) {
      findings.push({ path: PRACTICE_INDEX_PATH, line: 1, ruleId: `${RULE_ID}:index-stale` })
      notices.push(`${RULE_ID}: ${PRACTICE_INDEX_PATH} is stale — run: pnpm gen`)
    }
  }

  const antipatternIndexFile = files.find((f) => f.path === ANTIPATTERN_INDEX_PATH)
  if (antipatternIndexFile) {
    const actual = normalize(antipatternIndexFile.text)
    const expected = normalize(renderContentIndex('antipattern', antipatterns))
    if (actual !== expected) {
      findings.push({ path: ANTIPATTERN_INDEX_PATH, line: 1, ruleId: `${RULE_ID}:index-stale` })
      notices.push(`${RULE_ID}: ${ANTIPATTERN_INDEX_PATH} is stale — run: pnpm gen`)
    }
  }

  const readmeFile = files.find((f) => f.path === README_PATH)
  if (readmeFile) {
    const actual = normalize(readmeFile.text)
    const withEn = applyBlock(actual, renderReadmeBlockEn(practices.length, antipatterns.length), 'how-to-use-en')
    const expected = normalize(
      applyBlock(withEn, renderReadmeBlockJa(practices.length, antipatterns.length), 'how-to-use-ja'),
    )
    if (actual !== expected) {
      findings.push({
        path: README_PATH,
        line: markerLine(actual, '<!-- gen:start:how-to-use-en -->'),
        ruleId: `${RULE_ID}:readme-stale`,
      })
      notices.push(`${RULE_ID}: ${README_PATH} is stale — run: pnpm gen`)
    }
  }

  for (const [lang, corePath] of [['ja', CORE_JA_PATH], ['en', CORE_EN_PATH]]) {
    const coreFile = files.find((f) => f.path === corePath)
    if (!coreFile) continue
    const actual = normalize(coreFile.text)
    const expected = normalize(renderCore(lang, practices)) + '\n'
    if (actual !== expected) {
      findings.push({ path: corePath, line: 1, ruleId: `${RULE_ID}:core-stale` })
      notices.push(`${RULE_ID}: ${corePath} is stale — run: pnpm gen`)
    }
  }

  return notices.length > 0 ? { findings, notices } : { findings }
}
