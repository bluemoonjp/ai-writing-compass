import { scanPhraseGroups } from '../lib/phrase-scan.mjs'

const RULE_ID = 'no-history-words'
// The false-premise group is deferred (no no-false-premises check yet --
// see ROADMAP.md; it needs at least one confirmed-wrong number from
// Phase 0 before it has a fixture to enforce).
const GROUP_IDS = ['history', 'single-canon']

export function run({ files }) {
  return { findings: scanPhraseGroups(files, RULE_ID, GROUP_IDS) }
}
