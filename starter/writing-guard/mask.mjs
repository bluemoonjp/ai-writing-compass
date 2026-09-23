// Masks the parts of a Markdown document where a bad-example sentence is
// allowed to live -- fenced code blocks, inline code spans, HTML comments,
// and URI autolinks -- so a prose-scanning tool (writing-guard,
// scripts/lib/phrase-scan.mjs) never mistakes a deliberately-bad example for
// a real violation in the surrounding prose. See docs/adr/0005.
//
// Every replacement keeps the exact same length and keeps newlines as
// newlines, so line numbers reported against the masked text still match
// the original file.

const FENCE_LINE = /^([ \t]{0,3})(`{3,}|~{3,})(.*)$/

function maskSpan(text, start, end) {
  let out = ''
  for (let i = start; i < end; i++) {
    out += text[i] === '\n' ? '\n' : ' '
  }
  return text.slice(0, start) + out + text.slice(end)
}

// Fenced code blocks (CommonMark 4.5): a closing fence must use the same
// character as the opener and be at least as long, indented 0-3 spaces, and
// contain nothing else (info-string-only openers, not closers).
function maskFencedBlocks(text) {
  const lines = text.split('\n')
  let offset = 0
  const spans = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const open = FENCE_LINE.exec(line)
    if (open) {
      const fenceChar = open[2][0]
      const fenceLen = open[2].length
      let j = i + 1
      let closeIdx = -1
      while (j < lines.length) {
        const close = FENCE_LINE.exec(lines[j])
        if (close && close[2][0] === fenceChar && close[2].length >= fenceLen && close[3].trim() === '') {
          closeIdx = j
          break
        }
        j++
      }
      const blockEndLine = closeIdx === -1 ? lines.length - 1 : closeIdx
      const startOffset = lines.slice(0, i).reduce((n, l) => n + l.length + 1, 0)
      const endOffset =
        lines.slice(0, blockEndLine + 1).reduce((n, l) => n + l.length + 1, 0) - 1
      spans.push([startOffset, endOffset])
      i = blockEndLine + 1
    } else {
      i++
    }
  }
  let masked = text
  for (const [start, end] of spans) masked = maskSpan(masked, start, end)
  return masked
}

// Inline code spans (CommonMark 6.1): a backtick run of length N is closed
// by the next backtick run of exactly length N.
function maskInlineCode(text) {
  let out = text
  const backtickRun = /`+/g
  let match
  const runs = []
  while ((match = backtickRun.exec(text))) {
    runs.push({ start: match.index, end: match.index + match[0].length, len: match[0].length })
  }
  let i = 0
  while (i < runs.length) {
    const open = runs[i]
    let closeIdx = -1
    for (let k = i + 1; k < runs.length; k++) {
      if (runs[k].len === open.len) {
        closeIdx = k
        break
      }
    }
    if (closeIdx === -1) {
      i++
      continue
    }
    out = maskSpan(out, open.start, runs[closeIdx].end)
    i = closeIdx + 1
  }
  return out
}

function maskHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
}

// URI autolinks: <scheme:...> with no internal whitespace or unescaped `<`.
function maskAutolinks(text) {
  return text.replace(/<[a-zA-Z][a-zA-Z0-9+.-]*:[^\s<>]*>/g, (m) => m.replace(/[^\n]/g, ' '))
}

export function maskProse(text) {
  let masked = maskFencedBlocks(text)
  masked = maskInlineCode(masked)
  masked = maskHtmlComments(masked)
  masked = maskAutolinks(masked)
  return masked
}
