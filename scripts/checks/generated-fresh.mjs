import {
  applyBlock,
  parseAntipatternDetails,
  parsePracticeDetails,
  renderAuthoringTable,
  renderContentIndex,
  renderCore,
  renderReadmeBlockEn,
  renderReadmeBlockJa,
  WRITING_GUARD_FILE,
} from '../gen.mjs'

const RULE_ID = 'generated-fresh'
const CHECKS_PATH = 'checks.json'
const AUTHORING_PATH = 'docs/maintain/authoring.md'
const PRACTICE_INDEX_PATH = 'practices/index.md'
const ANTIPATTERN_INDEX_PATH = 'antipatterns/index.md'
const README_PATH = 'README.md'
const CORE_JA_PATH = 'core/core.ja.md'
const CORE_EN_PATH = 'core/core.en.md'
const PLUGIN_CORE_DIR = 'plugins/writing-compass/core'
const WRITING_GUARD_SOURCE_DIR = 'starter/writing-guard'
const PLUGIN_WRITING_GUARD_DIR = 'plugins/writing-compass/hooks/writing-guard'

// The .mjs/.json files directly inside dirPath -- depth-1 only, matching
// WRITING_GUARD_FILE's dev-file exclusion (no *.test.mjs).
function directChildRuntimeFiles(files, dirPath) {
  const prefix = `${dirPath}/`
  const found = []
  for (const f of files) {
    if (!f.path.startsWith(prefix)) continue
    const rest = f.path.slice(prefix.length)
    if (rest.includes('/') || !WRITING_GUARD_FILE.test(rest)) continue
    found.push({ name: rest, text: f.text })
  }
  return found
}

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

    // The plugin's own copy must match core/*.md byte for byte -- checked
    // only once a plugin copy exists, the same "target missing is staleness
    // too" discipline as the checks above.
    const pluginCorePath = `${PLUGIN_CORE_DIR}/${corePath.split('/')[1]}`
    const pluginCoreFile = files.find((f) => f.path === pluginCorePath)
    if (pluginCoreFile) {
      const pluginActual = normalize(pluginCoreFile.text)
      if (pluginActual !== actual) {
        findings.push({ path: pluginCorePath, line: 1, ruleId: `${RULE_ID}:plugin-core-stale` })
        notices.push(`${RULE_ID}: ${pluginCorePath} is stale — run: pnpm gen`)
      }
    }
  }

  const pluginExists = files.some((f) => f.path === 'plugins/writing-compass/.claude-plugin/plugin.json')
  if (pluginExists) {
    const sourceFiles = directChildRuntimeFiles(files, WRITING_GUARD_SOURCE_DIR)
    for (const { name, text } of sourceFiles) {
      const targetPath = `${PLUGIN_WRITING_GUARD_DIR}/${name}`
      const targetFile = files.find((f) => f.path === targetPath)
      const expected = normalize(text)
      const actual = targetFile ? normalize(targetFile.text) : null
      if (actual !== expected) {
        findings.push({ path: targetPath, line: 1, ruleId: `${RULE_ID}:writing-guard-stale` })
        notices.push(`${RULE_ID}: ${targetPath} is stale — run: pnpm gen`)
      }
    }

    const expectedNames = new Set(sourceFiles.map((f) => f.name))
    for (const { name } of directChildRuntimeFiles(files, PLUGIN_WRITING_GUARD_DIR)) {
      if (!expectedNames.has(name)) {
        const orphanPath = `${PLUGIN_WRITING_GUARD_DIR}/${name}`
        findings.push({ path: orphanPath, line: 1, ruleId: `${RULE_ID}:writing-guard-orphan` })
        notices.push(`${RULE_ID}: ${orphanPath} is an orphaned copy — run: pnpm gen`)
      }
    }
  }

  return notices.length > 0 ? { findings, notices } : { findings }
}
