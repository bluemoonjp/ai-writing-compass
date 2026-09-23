import { parse as parseYaml } from 'yaml'

const RULE_ID = 'layer-b-no-a-content'
const B_LAYER_EXACT = new Set(['AGENTS.md', 'CLAUDE.md'])
const B_LAYER_PREFIX = 'docs/maintain/'
const CONTENT_ID_PATTERN = /\b(practices?|antipatterns?)\/\d{4}\b|\b(practice|antipattern):\s*\d{4}\b/i
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/
// docs/maintain/authoring.md's generated check table is checks.json's
// `enforces` field rendered as a table column -- ADR-0001 names `enforces`
// as the one sanctioned way layer B references layer A content by id, so a
// content id inside this specific generated block is not a violation. The
// content-id pattern still applies to any hand-written prose in this file,
// and the content-title check is unaffected (a title should never appear
// here, generated or not).
const GENERATED_BLOCK_PATH = 'docs/maintain/authoring.md'
const GENERATED_BLOCK_START = '<!-- gen:start -->'
const GENERATED_BLOCK_END = '<!-- gen:end -->'

function isBLayer(filePath) {
  return B_LAYER_EXACT.has(filePath) || filePath.startsWith(B_LAYER_PREFIX)
}

function extractTitles(text) {
  const match = FRONTMATTER.exec(text)
  if (!match) return []
  let data
  try {
    data = parseYaml(match[1])
  } catch {
    return []
  }
  const titles = []
  if (typeof data?.title?.ja === 'string' && data.title.ja.length > 0) titles.push(data.title.ja)
  if (typeof data?.title?.en === 'string' && data.title.en.length > 0) titles.push(data.title.en)
  return titles
}

// A coarse proxy, not a complete boundary check: it only catches the
// mechanically-detectable shape of a practice/antipattern id or a verbatim
// bilingual title. checks.json's `protects` for this check says so.
export function run({ files }) {
  const findings = []
  const bLayerFiles = files.filter((f) => isBLayer(f.path))
  if (bLayerFiles.length === 0) return { findings }

  const contentTitles = files
    .filter((f) => (f.path.startsWith('practices/') || f.path.startsWith('antipatterns/')) && f.path.endsWith('.md'))
    .flatMap((f) => extractTitles(f.text))

  for (const file of bLayerFiles) {
    const lines = file.text.split('\n')
    const inGeneratedBlock =
      file.path === GENERATED_BLOCK_PATH
        ? lines.map((_, i) => {
            const startIdx = file.text.indexOf(GENERATED_BLOCK_START)
            const endIdx = file.text.indexOf(GENERATED_BLOCK_END)
            if (startIdx === -1 || endIdx === -1) return false
            const offset = lines.slice(0, i).reduce((n, l) => n + l.length + 1, 0)
            return offset > startIdx && offset < endIdx
          })
        : lines.map(() => false)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (CONTENT_ID_PATTERN.test(line) && !inGeneratedBlock[i]) {
        findings.push({ path: file.path, line: i + 1, ruleId: `${RULE_ID}:content-id` })
      }
      if (contentTitles.some((title) => line.includes(title))) {
        findings.push({ path: file.path, line: i + 1, ruleId: `${RULE_ID}:content-title` })
      }
    }
  }

  return { findings }
}
