// Every skill under plugins/*/skills/ must have, among plugins/*/evals/,
// at least one case tagged to fire it in ja and in en, and at least one
// near-miss case tagged not to fire it (tags include "near-miss" and the
// skill's name) -- see docs/maintain/eval.md.
import { parse as parseYaml } from 'yaml'

const RULE_ID = 'eval-coverage'
const SKILL_MD_PATTERN = /^plugins\/([^/]+)\/skills\/([^/]+)\/SKILL\.md$/
const PROMPT_MD_PATTERN = /^plugins\/([^/]+)\/evals\/([^/]+)\/prompt\.md$/
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

  const skillsByPlugin = new Map()
  for (const file of files) {
    const m = SKILL_MD_PATTERN.exec(file.path)
    if (!m) continue
    const [, plugin, skill] = m
    if (!skillsByPlugin.has(plugin)) skillsByPlugin.set(plugin, [])
    skillsByPlugin.get(plugin).push(skill)
  }

  const casesByPlugin = new Map()
  for (const file of files) {
    const m = PROMPT_MD_PATTERN.exec(file.path)
    if (!m) continue
    const [, plugin] = m
    const data = extractFrontmatter(file.text)
    const tags = new Set(data?.tags ?? [])
    if (!casesByPlugin.has(plugin)) casesByPlugin.set(plugin, [])
    casesByPlugin.get(plugin).push(tags)
  }

  for (const [plugin, skills] of skillsByPlugin) {
    const cases = casesByPlugin.get(plugin) ?? []
    for (const skill of skills) {
      const forSkill = cases.filter((tags) => tags.has(skill))
      const hasFireJa = forSkill.some((tags) => tags.has('fire') && tags.has('ja'))
      const hasFireEn = forSkill.some((tags) => tags.has('fire') && tags.has('en'))
      const hasNearMiss = forSkill.some((tags) => tags.has('near-miss'))
      const skillPath = `plugins/${plugin}/skills/${skill}/SKILL.md`
      if (!hasFireJa) findings.push({ path: skillPath, line: 1, ruleId: `${RULE_ID}:missing-fire-ja` })
      if (!hasFireEn) findings.push({ path: skillPath, line: 1, ruleId: `${RULE_ID}:missing-fire-en` })
      if (!hasNearMiss) findings.push({ path: skillPath, line: 1, ruleId: `${RULE_ID}:missing-near-miss` })
    }
  }

  return { findings }
}
