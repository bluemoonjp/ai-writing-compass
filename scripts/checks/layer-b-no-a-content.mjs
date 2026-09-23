import { parse as parseYaml } from 'yaml'

const RULE_ID = 'layer-b-no-a-content'
const B_LAYER_EXACT = new Set(['AGENTS.md', 'CLAUDE.md'])
const B_LAYER_PREFIX = 'docs/maintain/'
const CONTENT_ID_PATTERN = /\b(practices?|antipatterns?)\/\d{4}\b|\b(practice|antipattern):\s*\d{4}\b/i
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/

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
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (CONTENT_ID_PATTERN.test(line)) {
        findings.push({ path: file.path, line: i + 1, ruleId: `${RULE_ID}:content-id` })
      }
      if (contentTitles.some((title) => line.includes(title))) {
        findings.push({ path: file.path, line: i + 1, ruleId: `${RULE_ID}:content-title` })
      }
    }
  }

  return { findings }
}
