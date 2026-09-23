import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const AUTHORING_PATH = 'docs/maintain/authoring.md'
const PRACTICES_DIR = 'practices'
const ANTIPATTERNS_DIR = 'antipatterns'
const README_PATH = 'README.md'
const TABLE_HEADER = '| Check | Blocking | Enforces | What it protects |'
const TABLE_SEP = '| --- | --- | --- | --- |'
const START_MARKER = '<!-- gen:start -->'
const END_MARKER = '<!-- gen:end -->'
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
const CONTENT_FILENAME = /^(\d{4})-[a-z0-9-]+\.md$/
const CC_BY_URL = 'https://creativecommons.org/licenses/by/4.0/'
export const CORE_VERSION = '0.1.0'
export const CORE_DIR = 'core'
export const PLUGIN_CORE_DIR = 'plugins/writing-compass/core'
export const WRITING_GUARD_SOURCE_DIR = 'starter/writing-guard'
export const PLUGIN_WRITING_GUARD_DIR = 'plugins/writing-compass/hooks/writing-guard'
// Runtime files only -- *.test.mjs is dev-only and adds nothing to a
// distributed copy a hook runs directly; test-fixtures/ is dev-only too.
export const WRITING_GUARD_FILE = /^(?!.*\.test\.mjs$).+\.(?:mjs|json)$/

// The fixed order and bilingual heading text for core/*.md. A section with
// zero active principle practices is omitted entirely -- see docs/adr/0003.
const CORE_SECTIONS = [
  { id: 'before', heading: { ja: '書く前に決める', en: 'Before you write' } },
  { id: 'structure', heading: { ja: '構成', en: 'Structure' } },
  { id: 'certainty', heading: { ja: '確かさと出典', en: 'Certainty and sources' } },
  { id: 'wording', heading: { ja: '言葉', en: 'Wording' } },
  { id: 'format', heading: { ja: '書式', en: 'Format' } },
  { id: 'ja', heading: { ja: '日本語で書くとき', en: 'Writing in Japanese' } },
  { id: 'en', heading: { ja: '英語で書くとき', en: 'Writing in English' } },
  { id: 'genre', heading: { ja: '場面別', en: 'By genre' } },
]

function parseFrontmatteredFile(file) {
  const match = FRONTMATTER.exec(file.text)
  if (!match) return null
  try {
    return { data: parseYaml(match[1]), body: match[2] }
  } catch {
    return null
  }
}

export function renderAuthoringTable(checks) {
  const rows = checks.map((c) => {
    const blocking = c.blocking ? 'yes' : 'no'
    const enforces = (c.enforces ?? []).join(', ')
    return `| \`${c.id}\` | ${blocking} | ${enforces} | ${c.protects} |`
  })
  return [TABLE_HEADER, TABLE_SEP, ...rows].join('\n')
}

export function applyBlock(text, block, id = null) {
  const startMarker = id ? `<!-- gen:start:${id} -->` : START_MARKER
  const endMarker = id ? `<!-- gen:end:${id} -->` : END_MARKER
  const startIdx = text.indexOf(startMarker)
  const endIdx = text.indexOf(endMarker)
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`applyBlock: could not find ${startMarker}/${endMarker} markers`)
  }
  const before = text.slice(0, startIdx + startMarker.length)
  const after = text.slice(endIdx)
  return `${before}\n${block}\n${after}`
}

function listContentFiles(root, dir) {
  const abs = path.join(root, dir)
  if (!existsSync(abs)) return []
  const files = []
  for (const name of readdirSync(abs)) {
    if (!CONTENT_FILENAME.test(name)) continue
    files.push({ path: `${dir}/${name}`, text: readFileSync(path.join(abs, name), 'utf8') })
  }
  return files
}

// Pure: active practices/antipatterns with their parsed frontmatter and raw
// body, for anything beyond the index's summary fields.
function parseActiveContentFiles(files, dir) {
  const items = []
  for (const file of files) {
    if (!file.path.startsWith(`${dir}/`)) continue
    if (!CONTENT_FILENAME.test(path.basename(file.path))) continue
    const parsed = parseFrontmatteredFile(file)
    if (!parsed || parsed.data?.status !== 'active') continue
    items.push({ ...parsed.data, body: parsed.body })
  }
  items.sort((a, b) => a.id.localeCompare(b.id))
  return items
}

export function parsePracticeDetails(files) {
  return parseActiveContentFiles(files, PRACTICES_DIR)
}

export function parseAntipatternDetails(files) {
  return parseActiveContentFiles(files, ANTIPATTERNS_DIR)
}

function strongestEvidence(sources) {
  const order = ['standard', 'empirical', 'expert_guide', 'practitioner', 'anecdotal']
  const verified = (sources ?? []).filter((s) => s?.confidence === 'verified')
  if (verified.length === 0) return ''
  verified.sort((a, b) => order.indexOf(a.evidence_strength) - order.indexOf(b.evidence_strength))
  return verified[0].evidence_strength
}

function oldestVerifiedOn(sources) {
  return (sources ?? [])
    .map((s) => s?.verified_on)
    .filter((v) => typeof v === 'string')
    .sort()[0]
}

export function renderContentIndex(kind, items) {
  const dir = kind === 'practice' ? PRACTICES_DIR : ANTIPATTERNS_DIR
  const title = kind === 'practice' ? '# Practice index' : '# Antipattern index'
  const header = [title, '', `Generated from \`${dir}/*.md\` by \`pnpm gen\`; do not edit.`, '']
  const extraCols = kind === 'practice' ? [] : ['Classification']
  const cols = ['ID', 'Title (ja)', 'Title (en)', 'Reader tasks', 'Genres', ...extraCols, 'Evidence', 'Verified on']
  const table = [`| ${cols.join(' | ')} |`, `| ${cols.map(() => '---').join(' | ')} |`]
  for (const item of items) {
    const row = [
      item.id,
      item.title?.ja ?? '',
      item.title?.en ?? '',
      (item.reader_tasks ?? []).join(', '),
      (item.genres ?? []).join(', '),
      ...(kind === 'antipattern' ? [item.classification ?? ''] : []),
      strongestEvidence(item.sources),
      oldestVerifiedOn(item.sources) ?? '',
    ]
    table.push(`| ${row.join(' | ')} |`)
  }
  const footer = ['', `This table's content is drawn from \`${dir}/\`, licensed under [CC BY 4.0](../LICENSE-DOCS).`]
  return [...header, ...table, ...footer, ''].join('\n')
}

export function renderReadmeBlockEn(practiceCount, antipatternCount) {
  const parts = [
    '_Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit this block._ ',
    `**${practiceCount}** active practices and **${antipatternCount}** active antipatterns are indexed in `,
    '[`practices/index.md`](practices/index.md) and [`antipatterns/index.md`](antipatterns/index.md), ',
    'licensed under [CC BY 4.0](LICENSE-DOCS).',
  ]
  return parts.join('')
}

export function renderReadmeBlockJa(practiceCount, antipatternCount) {
  const parts = [
    '_`practices/*.md` と `antipatterns/*.md` から `pnpm gen` で生成。このブロックは編集しないこと。_ ',
    `**${practiceCount}** 件の active な practice と **${antipatternCount}** 件の active な antipattern を `,
    '[`practices/index.md`](practices/index.md) / [`antipatterns/index.md`](antipatterns/index.md) に索引化',
    '(ライセンス: [CC BY 4.0](LICENSE-DOCS))。',
  ]
  return parts.join('')
}

// Pure: renders one language's core/*.md from the active, core-tagged
// Genre ids whose taxonomy/genres.json entry has delivery: "core" -- a
// commit-message/pr-description/chat-answer convention needs to reach the
// writer even when no skill is invoked (docs/adr/0002), so renderCore
// (below) includes a convention practice in the core when every genre it
// names is one of these. Reads from a files array (parseFrontmatteredFile's
// disk-free style) so a fixture can supply its own taxonomy/genres.json --
// same reason parsePracticeDetails takes `files` rather than reading
// practices/ from disk itself.
export function parseCoreDeliveryGenres(files) {
  const file = files.find((f) => f.path === 'taxonomy/genres.json')
  if (!file) return new Set()
  let data
  try {
    data = JSON.parse(file.text)
  } catch {
    return new Set()
  }
  return new Set((data.genres ?? []).filter((g) => g.delivery === 'core').map((g) => g.id))
}

// principle practices, plus a convention practice whose genres are *all*
// core-delivery genres (parseCoreDeliveryGenres, above). Grouped by
// CORE_SECTIONS order then practice.core.order. See docs/adr/0003 for why
// this file is generated rather than hand-edited.
export function renderCore(lang, practices, coreDeliverySet = new Set()) {
  const coreItems = practices.filter((p) => {
    if (!p.core) return false
    if (p.scope === 'principle') return true
    if (p.scope === 'convention') return (p.genres ?? []).every((g) => coreDeliverySet.has(g))
    return false
  })
  const bySection = new Map()
  for (const item of coreItems) {
    const list = bySection.get(item.core.section) ?? []
    list.push(item)
    bySection.set(item.core.section, list)
  }
  for (const list of bySection.values()) list.sort((a, b) => a.core.order - b.core.order)

  const lines = [
    `<!-- ai-writing-compass:core v${CORE_VERSION} ${lang} -->`,
    lang === 'ja' ? '# 文章の指針' : '# Writing guidance',
    '',
    lang === 'ja'
      ? 'チャット回答・コミットメッセージ・PR本文・ファイルに書くすべての文章に適用する。目的は、読み手が正しく速く理解し、判断・行動できることである。'
      : 'Applies to every piece of text written here: chat replies, commit messages, PR descriptions, and files. The goal is that the reader can understand, decide, and act correctly and quickly.',
  ]

  for (const section of CORE_SECTIONS) {
    const items = bySection.get(section.id)
    if (!items || items.length === 0) continue
    lines.push('', `## ${section.heading[lang]}`, '')
    for (const item of items) {
      lines.push(`- ${item.rule[lang]}`)
    }
  }

  lines.push('', `<!-- /ai-writing-compass:core -->`)
  return lines.join('\n')
}

// { withFileTypes: true } + isFile() so a matching *directory* name is
// never handed to readFileSync (WRITING_GUARD_FILE could otherwise match a
// directory's basename and crash with EISDIR).
function listDirFilesFromDisk(root, dir, filenamePattern) {
  const abs = path.join(root, dir)
  if (!existsSync(abs)) return []
  return readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isFile() && filenamePattern.test(e.name))
    .map((e) => ({ name: e.name, text: readFileSync(path.join(abs, e.name), 'utf8') }))
}

// Removes any file directly inside targetDir not named in expectedNames --
// so a starter/writing-guard/ file that is later renamed or removed does
// not leave a stale, permanently-shipped copy behind inside the plugin.
function pruneOrphans(targetDir, expectedNames) {
  if (!existsSync(targetDir)) return
  for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
    if (entry.isFile() && !expectedNames.has(entry.name)) {
      unlinkSync(path.join(targetDir, entry.name))
    }
  }
}

// core/*.md is itself generated (renderCore, above); this copies that
// already-generated output into the plugin so plugins/writing-compass/core/
// is what the plugin's SessionStart hook actually reads at install time --
// an install only ever copies plugins/writing-compass/, never the
// repository root. See docs/adr/0002.
export function syncCoreIntoPlugin(root) {
  const targetDir = path.join(root, PLUGIN_CORE_DIR)
  mkdirSync(targetDir, { recursive: true })
  for (const lang of ['ja', 'en']) {
    const name = `core.${lang}.md`
    const sourceAbs = path.join(root, CORE_DIR, name)
    if (!existsSync(sourceAbs)) continue
    writeFileSync(path.join(targetDir, name), readFileSync(sourceAbs, 'utf8').replace(/\r\n/g, '\n'))
  }
  pruneOrphans(targetDir, new Set(['core.ja.md', 'core.en.md']))
}

// Copies starter/writing-guard/'s runtime files (not its *.test.mjs or
// test-fixtures/) into the plugin's own hooks/writing-guard/ -- the CI
// check (prose-guard/prose-guard-advisory) and the distributed plugin
// share this same source, copied here the same way generateReferences
// copies a sibling repository's starter/ tool into its skill.
export function syncWritingGuardIntoPlugin(root) {
  const targetDir = path.join(root, PLUGIN_WRITING_GUARD_DIR)
  mkdirSync(targetDir, { recursive: true })
  const entries = listDirFilesFromDisk(root, WRITING_GUARD_SOURCE_DIR, WRITING_GUARD_FILE)
  for (const { name, text } of entries) {
    writeFileSync(path.join(targetDir, name), text.replace(/\r\n/g, '\n'))
  }
  pruneOrphans(targetDir, new Set(entries.map((e) => e.name)))
}

function main() {
  const root = process.cwd()
  const checks = JSON.parse(readFileSync(path.join(root, 'checks.json'), 'utf8')).checks
  const table = renderAuthoringTable(checks)
  const authoringAbs = path.join(root, AUTHORING_PATH)
  const currentAuthoring = readFileSync(authoringAbs, 'utf8')
  const nextAuthoring = applyBlock(currentAuthoring, table).replace(/\r\n/g, '\n')
  writeFileSync(authoringAbs, nextAuthoring)

  const practices = parsePracticeDetails(listContentFiles(root, PRACTICES_DIR))
  const antipatterns = parseAntipatternDetails(listContentFiles(root, ANTIPATTERNS_DIR))

  writeFileSync(
    path.join(root, PRACTICES_DIR, 'index.md'),
    renderContentIndex('practice', practices).replace(/\r\n/g, '\n'),
  )
  writeFileSync(
    path.join(root, ANTIPATTERNS_DIR, 'index.md'),
    renderContentIndex('antipattern', antipatterns).replace(/\r\n/g, '\n'),
  )

  const readmeAbs = path.join(root, README_PATH)
  const currentReadme = readFileSync(readmeAbs, 'utf8')
  const withEn = applyBlock(currentReadme, renderReadmeBlockEn(practices.length, antipatterns.length), 'how-to-use-en')
  const nextReadme = applyBlock(withEn, renderReadmeBlockJa(practices.length, antipatterns.length), 'how-to-use-ja').replace(
    /\r\n/g,
    '\n',
  )
  writeFileSync(readmeAbs, nextReadme)

  const genresAbs = path.join(root, 'taxonomy', 'genres.json')
  const coreDeliverySet = parseCoreDeliveryGenres([{ path: 'taxonomy/genres.json', text: readFileSync(genresAbs, 'utf8') }])

  mkdirSync(path.join(root, 'core'), { recursive: true })
  writeFileSync(path.join(root, 'core', 'core.ja.md'), renderCore('ja', practices, coreDeliverySet).replace(/\r\n/g, '\n') + '\n')
  writeFileSync(path.join(root, 'core', 'core.en.md'), renderCore('en', practices, coreDeliverySet).replace(/\r\n/g, '\n') + '\n')

  syncCoreIntoPlugin(root)
  syncWritingGuardIntoPlugin(root)
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
