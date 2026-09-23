// Pure scan engine shared by the plugin hooks, templates/commit-msg, and
// this repository's own CI (prose-guard / prose-guard-advisory) -- see
// docs/adr/0004. Takes rules and text in, returns findings out; it never
// touches the filesystem or a subprocess itself (that's cli.mjs).
import { maskProse } from './mask.mjs'

// A rule's detector.kind === 'builtin' looks up its function here by
// detector.name. Kept as a fixed, auditable registry rather than eval()ing
// arbitrary code from rules.json.
const BUILTINS = {}

export function registerBuiltin(name, fn) {
  BUILTINS[name] = fn
}

function scanRegex(text, lang, rule) {
  const re = new RegExp(rule.detector.pattern, rule.detector.flags ?? 'i')
  const lines = text.split('\n')
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) hits.push(i + 1)
    re.lastIndex = 0
  }
  return hits
}

function scanDensity(text, lang, rule) {
  const re = new RegExp(rule.detector.pattern, (rule.detector.flags ?? 'g').includes('g') ? rule.detector.flags : `${rule.detector.flags ?? ''}g`)
  const count = (text.match(re) ?? []).length
  const per = rule.detector.per
  const chars = text.length || 1
  const density = (count / chars) * per
  return density > rule.detector.threshold ? [1] : []
}

function scanBuiltin(text, lang, rule) {
  const fn = BUILTINS[rule.detector.name]
  if (!fn) return []
  return fn(text, lang, rule)
}

// files: [{path, text}]. rules: parsed rules.json array. surface: which
// rule.applies value this call represents ('markdown' | 'commit' | 'pr').
// onlySeverity, when given, restricts to 'error' or 'advisory' rules.
export function scan(files, rules, { surface, onlySeverity } = {}) {
  const findings = []
  for (const file of files) {
    const masked = maskProse(file.text)
    for (const rule of rules) {
      if (surface && !rule.applies.includes(surface)) continue
      if (onlySeverity && rule.severity !== onlySeverity) continue
      const lang = file.lang ?? null
      if (lang && !rule.lang.includes(lang)) continue

      const scanner = rule.detector.kind === 'regex' ? scanRegex : rule.detector.kind === 'density' ? scanDensity : scanBuiltin
      for (const line of scanner(masked, lang, rule)) {
        findings.push({
          path: file.path,
          line,
          ruleId: `writing-guard:${rule.id}`,
          severity: rule.severity,
          message: rule.message,
        })
      }
    }
  }
  return findings
}
