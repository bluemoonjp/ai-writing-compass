import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import { parse as parseYaml } from 'yaml'

const schemasDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'schemas')

const defsSchema = JSON.parse(readFileSync(path.join(schemasDir, 'defs.schema.json'), 'utf8'))
const practiceSchema = JSON.parse(readFileSync(path.join(schemasDir, 'practice.schema.json'), 'utf8'))
const antipatternSchema = JSON.parse(readFileSync(path.join(schemasDir, 'antipattern.schema.json'), 'utf8'))

const ajv = new Ajv2020({ strict: true, allErrors: true })
ajv.addSchema(defsSchema)
const validatePractice = ajv.compile(practiceSchema)
const validateAntipattern = ajv.compile(antipatternSchema)

const RULE_ID = 'frontmatter-schema'
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
const FILENAME_ID = /^(\d{4})-[a-z0-9-]+\.md$/

// "Rule" is deliberately absent from every heading set: the frontmatter
// `rule` field already carries it verbatim in both languages, and an H2 of
// the same name would duplicate it in the body.
const PRACTICE_H2 = {
  ja: new Set(['理由', '適用範囲', '対立する指針', '例']),
  en: new Set(['Why', 'When it applies', 'Conflicting guidance', 'Examples']),
}
const ANTIPATTERN_H2 = {
  ja: {
    symptomSet: new Set(['症状', '原因', '対処', '例']),
    obsoleteSet: new Set(['以前の書き方', 'なぜそれでよかったか', '何が変わったか', '今すべきこと', '例']),
  },
  en: {
    symptomSet: new Set(['Symptom', 'Cause', 'Remedy', 'Examples']),
    obsoleteSet: new Set(['What we did', 'Why it worked', 'What changed', 'What to do now', 'Examples']),
  },
}

function kindOf(filePath) {
  if (!FILENAME_ID.test(path.basename(filePath))) return null
  if (filePath.startsWith('practices/')) return 'practice'
  if (filePath.startsWith('antipatterns/')) return 'antipattern'
  return null
}

function extractH2s(body) {
  const headings = []
  const pattern = /^##\s+(.+?)\s*$/gm
  let m
  while ((m = pattern.exec(body))) headings.push(m[1])
  return headings
}

export function run({ files }) {
  const findings = []
  const targetFiles = files.filter((f) => kindOf(f.path) && f.path.endsWith('.md'))

  const practiceIds = new Set()
  for (const file of targetFiles) {
    if (kindOf(file.path) !== 'practice') continue
    const m = FILENAME_ID.exec(path.basename(file.path))
    if (m) practiceIds.add(m[1])
  }

  for (const file of targetFiles) {
    const kind = kindOf(file.path)
    const match = FRONTMATTER.exec(file.text)
    if (!match) {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:missing-frontmatter` })
      continue
    }
    const [, frontmatterText, body] = match

    let data
    try {
      data = parseYaml(frontmatterText)
    } catch {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:invalid-yaml` })
      continue
    }

    const validate = kind === 'antipattern' ? validateAntipattern : validatePractice
    if (!validate(data)) {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:schema` })
    }

    const filenameMatch = FILENAME_ID.exec(path.basename(file.path))
    const filenameId = filenameMatch ? filenameMatch[1] : null
    if (!filenameId || data?.id !== filenameId) {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:id-filename-mismatch` })
    }

    const bodyLang = data?.body_lang === 'en' ? 'en' : 'ja'
    const headings = extractH2s(body)

    if (kind === 'practice') {
      const allowed = PRACTICE_H2[bodyLang]
      for (const heading of headings) {
        if (!allowed.has(heading)) {
          findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:unknown-heading` })
        }
      }
    } else {
      const { symptomSet, obsoleteSet } = ANTIPATTERN_H2[bodyLang]
      const headingSet = new Set(headings)
      const usesSymptom = headings.some((h) => symptomSet.has(h))
      const usesObsolete = headings.some((h) => obsoleteSet.has(h))
      if (usesSymptom && usesObsolete) {
        findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:mixed-heading-sets` })
      } else {
        const allowed = usesObsolete ? obsoleteSet : symptomSet
        for (const heading of headingSet) {
          if (!allowed.has(heading)) {
            findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:unknown-heading` })
          }
        }
      }

      if (Array.isArray(data?.relates_to)) {
        for (const relatedId of data.relates_to) {
          if (!practiceIds.has(relatedId)) {
            findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:unresolved-relates-to` })
          }
        }
      }
    }
  }

  return { findings }
}
