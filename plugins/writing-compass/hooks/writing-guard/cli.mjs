#!/usr/bin/env node
// Standalone CLI for starter/writing-guard, used by templates/commit-msg
// and by anyone running the guard outside this repository's own checks.
// Reads one file (or stdin with "-"), prints findings as
// "path:line severity ruleId message", and exits 1 if any error-severity
// finding was found (advisory findings never affect the exit code).
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { scan } from './index.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const args = { surface: 'markdown', lang: null, target: null }
  for (const arg of argv) {
    if (arg.startsWith('--surface=')) args.surface = arg.slice('--surface='.length)
    else if (arg.startsWith('--lang=')) args.lang = arg.slice('--lang='.length)
    else args.target = arg
  }
  return args
}

function readTarget(target) {
  if (!target || target === '-') return readFileSync(0, 'utf8')
  return readFileSync(target, 'utf8')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const rules = JSON.parse(readFileSync(path.join(here, 'rules.json'), 'utf8'))
  const text = readTarget(args.target)
  const file = { path: args.target ?? '(stdin)', text, lang: args.lang }

  const findings = scan([file], rules, { surface: args.surface })
  let hasError = false
  for (const f of findings) {
    if (f.severity === 'error') hasError = true
    const message = args.lang === 'en' ? f.message.en : f.message.ja
    console.log(`${f.path}:${f.line} ${f.severity} ${f.ruleId} ${message}`)
  }
  if (findings.length === 0) console.log('writing-guard: no findings')
  process.exit(hasError ? 1 : 0)
}

main()
