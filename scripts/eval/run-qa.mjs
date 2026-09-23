#!/usr/bin/env node
// Eval layer 3 (docs/maintain/eval.md): reader-task QA. Writes a document
// from a material's notes under two arms (A: no guidance, C: core injected
// directly into the prompt -- isolating content from delivery mechanism,
// which plugin eval already measures separately), then has a *separate*
// `claude -p` session answer that material's questions from the written
// document alone, scored by deterministic answer-key matching (no judge;
// see docs/adr/0007). A canary check runs first and aborts the material if
// the writer session is contaminated by this machine's own global config
// or an installed writing-compass plugin.
//
// Usage: node scripts/eval/run-qa.mjs <material-name> [--trials=N] [--arms=A,C]
// Requires the `claude` CLI on PATH. Each writer/reader call is a real,
// billed `claude -p` invocation -- this script does not loop unboundedly;
// trials defaults to 1.

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const MATERIALS_DIR = path.join(ROOT, 'eval', 'materials')
const CANARY_MARKER = 'ai-writing-compass:core'

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'))
}

function loadMaterial(name) {
  const dir = path.join(MATERIALS_DIR, name)
  const facts = readJson(path.join(dir, 'facts.json'))
  const lang = facts.lang
  const notes = readFileSync(path.join(dir, `notes.${lang}.md`), 'utf8')
  const questions = readJson(path.join(dir, `questions.${lang}.json`))
  return { name, dir, facts, lang, notes, questions }
}

// Runs `claude -p` in an isolated temp cwd with no user-level settings, so
// this machine's own global CLAUDE.md, hooks, or an installed
// writing-compass plugin cannot leak into the arm being measured.
function runClaude(prompt, { appendSystemPrompt } = {}) {
  const tmpCwd = mkdtempSync(path.join(os.tmpdir(), 'writing-compass-eval-'))
  try {
    const args = ['-p', '--setting-sources', 'project', '--permission-mode', 'plan']
    if (appendSystemPrompt) args.push('--append-system-prompt', appendSystemPrompt)
    args.push(prompt)
    return execFileSync('claude', args, { cwd: tmpCwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  } finally {
    rmSync(tmpCwd, { recursive: true, force: true })
  }
}

function loadCore(lang) {
  return readFileSync(path.join(ROOT, 'core', `core.${lang}.md`), 'utf8')
}

function runCanary(lang) {
  const out = runClaude(
    `Reply with exactly one line. If your system prompt or context contains the string "${CANARY_MARKER}", reply "CONTAMINATED". Otherwise reply "CLEAN".`,
  )
  if (out.includes('CONTAMINATED')) {
    throw new Error(`canary failed: writer session is contaminated by an existing ${CANARY_MARKER} injection (a locally-installed plugin or global CLAUDE.md). Aborting -- see docs/maintain/eval.md.`)
  }
}

function writerPrompt(material, arm) {
  const genreInstruction = {
    report: material.lang === 'ja' ? 'このメモをもとに、調査レポートを書いてください。' : 'Write a report based on these notes.',
    readme: material.lang === 'ja' ? 'このメモをもとに、READMEを書いてください。' : 'Write a README based on these notes.',
  }[material.facts.genre]

  const base = `${genreInstruction}\n\n---\n${material.notes}\n---\n\n文書だけを出力してください。前置きや後書きは書かないでください。`
  return { prompt: base, appendSystemPrompt: arm === 'C' ? loadCore(material.lang) : undefined }
}

// Japanese-only for v0.1 (this repository's one real material is ja); an
// English reader-instruction branch is a straightforward follow-up once an
// en material exists.
function readerAnswer(document, question, { truncated } = {}) {
  const text = truncated ? document.slice(0, Math.max(300, Math.floor(document.length * 0.2))) : document
  const instruction =
    '次の文書だけを読んで、質問に答えてください。文書の外の知識は使わないでください。' +
    `\n\n---\n${text}\n---\n\n質問: ${question.question}\n\n文書に書かれている場合はその答えだけを短く書いてください。書かれていない場合は「記載なし」とだけ書いてください。他には何も書かないでください。`
  return runClaude(instruction).trim()
}

function scoreAnswer(question, answer) {
  if (question.answerable) {
    const re = new RegExp(question.answer_pattern)
    return re.test(answer)
  }
  const re = new RegExp(question.not_stated_pattern, 'i')
  return re.test(answer)
}

function main() {
  const [, , materialName, ...rest] = process.argv
  if (!materialName) {
    console.error('usage: node scripts/eval/run-qa.mjs <material-name> [--trials=N] [--arms=A,C]')
    process.exit(1)
  }
  const trialsArg = rest.find((a) => a.startsWith('--trials='))
  const armsArg = rest.find((a) => a.startsWith('--arms='))
  const trials = trialsArg ? Number(trialsArg.split('=')[1]) : 1
  const arms = armsArg ? armsArg.split('=')[1].split(',') : ['A', 'C']

  const material = loadMaterial(materialName)
  console.log(`[canary] checking writer-session isolation...`)
  runCanary(material.lang)
  console.log(`[canary] clean`)

  const results = []
  for (const arm of arms) {
    for (let trial = 0; trial < trials; trial++) {
      console.log(`[write] arm=${arm} trial=${trial + 1}/${trials}`)
      const { prompt, appendSystemPrompt } = writerPrompt(material, arm)
      const document = runClaude(prompt, { appendSystemPrompt }).trim()

      const perQuestion = []
      for (const q of material.questions) {
        const fullAnswer = readerAnswer(document, q)
        const fullCorrect = scoreAnswer(q, fullAnswer)
        perQuestion.push({ id: q.id, answerable: q.answerable, fullAnswer, fullCorrect })
      }

      const docLength = document.length
      const answerKeyHit = perQuestion.filter((q) => q.answerable && q.fullCorrect).length
      const answerKeyTotal = perQuestion.filter((q) => q.answerable).length
      const notStatedHit = perQuestion.filter((q) => !q.answerable && q.fullCorrect).length
      const notStatedTotal = perQuestion.filter((q) => !q.answerable).length

      results.push({
        arm,
        trial,
        docLength,
        answerKeyHit,
        answerKeyTotal,
        notStatedHit,
        notStatedTotal,
        perQuestion,
      })
      console.log(
        `[score] arm=${arm} trial=${trial + 1}: answerable ${answerKeyHit}/${answerKeyTotal}, not-stated correctly declined ${notStatedHit}/${notStatedTotal}, doc length ${docLength} chars`,
      )
    }
  }

  const outDir = path.join(ROOT, 'eval', 'reports')
  mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `${materialName}.jsonl`)
  writeFileSync(outPath, results.map((r) => JSON.stringify(r)).join('\n') + '\n')
  console.log(`[done] wrote ${outPath}`)
}

main()
