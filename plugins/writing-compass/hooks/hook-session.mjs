#!/usr/bin/env node
// SessionStart hook: injects the always-loaded writing core (docs/adr/0002).
// Skips injection if the marker line already appears in the project's own
// AGENTS.md/CLAUDE.md -- the maintainer pasted core/*.md in directly, so a
// second copy from this hook would just double the content (docs/adr/0003's
// marker line is what both paths share).
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const CORE_MARKER_PREFIX = '<!-- ai-writing-compass:core '
const MAX_CONTEXT_CHARS = 9000 // stays under the 10,000-char hook output cap

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

function alreadyPresent(cwd) {
  const candidates = ['AGENTS.md', 'CLAUDE.md', path.join('.claude', 'CLAUDE.md')]
  for (const rel of candidates) {
    const abs = path.join(cwd ?? process.cwd(), rel)
    if (!existsSync(abs)) continue
    try {
      if (readFileSync(abs, 'utf8').includes(CORE_MARKER_PREFIX)) return true
    } catch {
      // unreadable file: fall through and try the next candidate
    }
  }
  return false
}

function main() {
  const input = readStdin()

  const enabled = process.env.WRITING_COMPASS_CORE_ENABLED !== 'false'
  if (!enabled) {
    process.exit(0)
  }

  if (alreadyPresent(input.cwd)) {
    process.exit(0)
  }

  const lang = process.env.WRITING_COMPASS_CORE_LANG === 'en' ? 'en' : 'ja'
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT ?? path.dirname(path.dirname(new URL(import.meta.url).pathname))
  const corePath = path.join(pluginRoot, 'core', `core.${lang}.md`)

  let core
  try {
    core = readFileSync(corePath, 'utf8')
  } catch {
    process.exit(0)
  }

  const additionalContext = core.length > MAX_CONTEXT_CHARS ? core.slice(0, MAX_CONTEXT_CHARS) : core

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    }),
  )
  process.exit(0)
}

main()
