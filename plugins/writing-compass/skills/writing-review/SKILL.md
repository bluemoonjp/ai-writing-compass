---
name: writing-review
description: Use when asked to review, proofread, tighten, or rewrite existing Japanese or English prose so its reader can decide or act faster -- a buried conclusion, filler, a chain of reasons broken into bullets, a vague link, inconsistent terms, excessive honorifics (文章の添削・推敲・読みやすく直す). Not when drafting a new document from notes (writing-compose), and not when auditing an AGENTS.md, CLAUDE.md, or SKILL.md against agent best practices.
license: MIT
metadata:
  genres: ["any"]
---

# writing-review

## Procedure

1. **Read the whole text once before changing anything.** Identify its reader and what they need from it (decide, act, understand, look something up, verify).
2. **Check each rule against the text, in this order**, noting every place it fails before rewriting:
   - Does the first paragraph state the conclusion, answer, or decision? If the reader would have to read to the end to find it, that is the first thing to fix.
   - Is there a sentence that does not serve the reader's task (a front-loaded greeting, a restated question, praise, a length limit blown past what the reader needs)?
   - Is an uncertain claim marked where it appears, in first-person terms, with the reason -- or is uncertainty either absent or dumped into one blanket disclaimer?
   - Is a link's text the destination's name, or a vague "click here"/"こちら"?
   - Is a bulleted list standing in for reasoning (causes, trade-offs, conditions) that should be connected prose instead?
   - Is a word abstract where a concrete word (a number, a name, an observed behavior) would say the same thing more directly?
   - In Japanese text: does any sentence carry more than one point? Does the subject change partway through a sentence? Is there a double negation, or a chain of honorifics doing more work than the situation calls for?
   - Does anything in the text address the person who asked for the review, rather than the text's actual reader (a leftover "I hope this helps", a narrated summary of what changed)?
3. **Rewrite to fix what step 2 found**, keeping every fact and claim from the original text -- do not add a claim the original did not make, and do not soften or drop a caveat the original stated.
4. **Return the full rewritten text first**, then a short list of what changed and which rule each change addressed. Never lead with the change list; the rewritten text is what the reader is here for.
5. **Do not flag a pattern this skill has no rule for.** A frequency signal (a stylistic tic that got more common in AI output, without a shown reader harm) is not something to "fix" here -- note it only if the requester specifically asked for that kind of pass.
