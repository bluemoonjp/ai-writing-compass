#!/usr/bin/env node
// PostToolUse hook: scans a file just written/edited (docs/adr/0002,
// docs/adr/0004). Reads the file from disk rather than tool_input/
// tool_response, since Write and Edit report their change in different
// shapes and the file has already been written to disk by the time this
// hook runs either way.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { scan } from './writing-guard/index.mjs'

const MAX_OUTPUT_CHARS = 9000
const TARGET_EXTENSIONS = new Set(['.md', '.mdx', '.markdown', '.txt'])

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

function loadRules() {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT ?? path.dirname(path.dirname(new URL(import.meta.url).pathname))
  try {
    return JSON.parse(readFileSync(path.join(pluginRoot, 'hooks', 'writing-guard', 'rules.json'), 'utf8'))
  } catch {
    return []
  }
}

function formatFindings(findings) {
  return findings.map((f) => `${f.path}:${f.line} ${f.message.ja} / ${f.message.en}`).join('\n')
}

function main() {
  const guardMode = process.env.WRITING_COMPASS_GUARD_MODE ?? 'enforce'
  if (guardMode === 'off') process.exit(0)

  const input = readStdin()
  const filePath = input?.tool_input?.file_path
  if (typeof filePath !== 'string') process.exit(0)
  if (!TARGET_EXTENSIONS.has(path.extname(filePath).toLowerCase())) process.exit(0)

  let text
  try {
    text = readFileSync(filePath, 'utf8')
  } catch {
    process.exit(0) // file gone or unreadable by the time this hook runs
  }

  const rules = loadRules()
  const findings = scan([{ path: filePath, text }], rules, { surface: 'markdown' })

  const errors = findings.filter((f) => f.severity === 'error')
  const advisories = findings.filter((f) => f.severity === 'advisory')

  if (errors.length > 0 && guardMode === 'enforce') {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          decision: 'block',
          reason: `writing-guard found ${errors.length} issue(s):\n${formatFindings(errors)}`.slice(0, MAX_OUTPUT_CHARS),
        },
      }),
    )
    process.exit(0)
  }

  const toReport = guardMode === 'advise' ? [...errors, ...advisories] : advisories
  if (toReport.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `writing-guard suggestions:\n${formatFindings(toReport)}`.slice(0, MAX_OUTPUT_CHARS),
        },
      }),
    )
  }

  process.exit(0)
}

main()
