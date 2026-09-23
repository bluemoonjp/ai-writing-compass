// Extracts the message body a PreToolUse hook should scan from a shell
// command string, for the forms this repository's own commits and PRs use
// (docs/adr/0002, docs/adr/0004). Anything else -- an editor-based commit, a
// heredoc, -F/--body-file pointing at a file this process can't read -- is
// out of scope for v0.1 and returns null, which the caller treats as
// fail-open (pass the command through unexamined; the commit-msg hook and
// CI are the backstop -- see ROADMAP.md).
import { readFileSync } from 'node:fs'

// Splits on whitespace outside of single/double quotes, unescaping \" and
// \\ inside double quotes. Not a full shell grammar (no $(...), no
// variable expansion) -- deliberately: a command complex enough to need
// those is exactly the case this parser should decline, not guess at.
export function tokenize(command) {
  const tokens = []
  let current = ''
  let inSingle = false
  let inDouble = false
  let i = 0
  while (i < command.length) {
    const ch = command[i]
    if (inSingle) {
      if (ch === "'") {
        inSingle = false
      } else {
        current += ch
      }
    } else if (inDouble) {
      if (ch === '"') {
        inDouble = false
      } else if (ch === '\\' && i + 1 < command.length && '"\\$`'.includes(command[i + 1])) {
        current += command[i + 1]
        i++
      } else {
        current += ch
      }
    } else if (ch === "'") {
      inSingle = true
    } else if (ch === '"') {
      inDouble = true
    } else if (/\s/.test(ch)) {
      if (current.length > 0) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += ch
    }
    i++
  }
  if (current.length > 0) tokens.push(current)
  if (inSingle || inDouble) return null // unterminated quote: don't guess
  return tokens
}

function readBodyFile(target) {
  if (target === '-') return null // stdin: not something this hook can read
  try {
    return readFileSync(target, 'utf8')
  } catch {
    return null
  }
}

// Returns the message text to scan, or null if this command's message
// can't be confidently extracted (fail-open -- see file header).
export function extractMessage(command) {
  const tokens = tokenize(command)
  if (!tokens || tokens.length === 0) return null

  const messageParts = []
  let sawUnsupportedFlag = false

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]
    if (tok === '-m' || tok === '--message') {
      const value = tokens[i + 1]
      if (value === undefined) return null
      messageParts.push(value)
      i++
    } else if (tok.startsWith('-m') && tok.length > 2 && !tok.startsWith('--')) {
      messageParts.push(tok.slice(2))
    } else if (tok === '--body') {
      const value = tokens[i + 1]
      if (value === undefined) return null
      messageParts.push(value)
      i++
    } else if (tok === '-F' || tok === '--file' || tok === '--body-file') {
      const target = tokens[i + 1]
      if (target === undefined) return null
      const content = readBodyFile(target)
      if (content === null) return null
      messageParts.push(content)
      i++
    } else if (tok === '-e' || tok === '--edit' || tok === '--template' || tok === '-t') {
      sawUnsupportedFlag = true
    }
  }

  if (sawUnsupportedFlag) return null
  if (messageParts.length === 0) return null
  return messageParts.join('\n\n')
}
