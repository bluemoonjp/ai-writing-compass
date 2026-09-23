# eval/

Eval layer 3 (reader-task QA) material and reports -- see `docs/maintain/eval.md` for what each eval layer measures and why layer 3 uses answer-key matching instead of an LLM judge (docs/adr/0007).

- `materials/<scenario>/`: `facts.json` (planted fictional facts and metadata), `notes.<lang>.md` (the raw source a writer session turns into a document), `questions.<lang>.json` (questions with either an `answer_pattern` regex or, for a deliberately unanswerable question, a `not_stated_pattern` regex the reader's decline should match).
- `reports/`: output of `scripts/eval/run-qa.mjs`, one `.jsonl` per material. Not tracked in git (`.gitignore`) -- each run reflects a specific model and date, and a stale report committed to the repo would be read as current.

Run a material with:

```sh
node scripts/eval/run-qa.mjs <material-name> [--trials=N] [--arms=A,C]
```

Each writer and reader step is a real `claude` CLI invocation (billed, not simulated). The script runs a canary check first and aborts if the writer session is contaminated by this machine's own global config or an installed `writing-compass` plugin.
