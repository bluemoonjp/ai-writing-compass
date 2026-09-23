#!/usr/bin/env node
// PreToolUse hook: scans a commit message or PR body before git
// commit/gh pr create/gh pr edit runs (docs/adr/0002, docs/adr/0004).
// Fails open on anything it can't confidently parse -- see
// parse-command.mjs's header and ROADMAP.md's known-gap list.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { extractMessage } from './parse-command.mjs'
import { scan } from './writing-guard/index.mjs'

const MAX_OUTPUT_CHARS = 9000

// Denying the same message twice in a row would loop Claude on a guard
// false positive; the second attempt is let through as advisory instead.
// Persisted to a state file rather than an environment variable -- each
// hook invocation is a fresh process, and CLAUDE_ENV_FILE (the mechanism
// that does persist across invocations) is not available to PreToolUse
// hooks. See docs/adr/0004.
function hashText(text) {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0
  }
  return String(h)
}

function statePath() {
  const dataDir = process.env.CLAUDE_PLUGIN_DATA
  if (!dataDir) return null
  return path.join(dataDir, 'guard-last-deny.json')
}

function wasLastDenied(surface, hash) {
  const p = statePath()
  if (!p || !existsSync(p)) return false
  try {
    const state = JSON.parse(readFileSync(p, 'utf8'))
    return state?.[surface] === hash
  } catch {
    return false
  }
}

function recordDenied(surface, hash) {
  const p = statePath()
  if (!p) return
  let state = {}
  try {
    state = JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    // no prior state, or it's unreadable/corrupt: start fresh
  }
  state[surface] = hash
  try {
    mkdirSync(path.dirname(p), { recursive: true })
    writeFileSync(p, JSON.stringify(state))
  } catch {
    // best-effort: if this fails, the only cost is losing the anti-loop
    // memory, not a broken hook
  }
}

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
  return findings.map((f) => `- ${f.message.ja} / ${f.message.en}`).join('\n')
}

function main() {
  const guardMode = process.env.WRITING_COMPASS_GUARD_MODE ?? 'enforce'
  if (guardMode === 'off') process.exit(0)

  const input = readStdin()
  const command = input?.tool_input?.command
  if (typeof command !== 'string') process.exit(0)

  const surface = /gh\s+pr\s+(create|edit)\b/.test(command) ? 'pr' : /git\s+commit\b/.test(command) ? 'commit' : null
  if (!surface) process.exit(0)

  const message = extractMessage(command)
  if (message === null) process.exit(0) // fail-open: could not confidently parse

  const rules = loadRules()
  const findings = scan([{ path: `(${surface}-message)`, text: message }], rules, { surface })

  const errors = findings.filter((f) => f.severity === 'error')
  const advisories = findings.filter((f) => f.severity === 'advisory')

  if (errors.length > 0 && guardMode === 'enforce') {
    const hash = hashText(message)
    if (wasLastDenied(surface, hash)) {
      // Same message denied last time and sent again unchanged: let it
      // through this time rather than loop, and say so as advisory.
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            additionalContext: `writing-guard: allowing a previously-denied ${surface} message through unchanged; findings were:\n${formatFindings(errors)}`.slice(0, MAX_OUTPUT_CHARS),
          },
        }),
      )
      process.exit(0)
    }
    recordDenied(surface, hash)
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `writing-guard found ${errors.length} issue(s) in this ${surface} message:\n${formatFindings(errors)}`.slice(0, MAX_OUTPUT_CHARS),
        },
      }),
    )
    process.exit(0)
  }

  if (advisories.length > 0 || (errors.length > 0 && guardMode === 'advise')) {
    const all = guardMode === 'advise' ? findings : advisories
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext: `writing-guard suggestions for this ${surface} message:\n${formatFindings(all)}`.slice(0, MAX_OUTPUT_CHARS),
        },
      }),
    )
  }

  process.exit(0)
}

main()
