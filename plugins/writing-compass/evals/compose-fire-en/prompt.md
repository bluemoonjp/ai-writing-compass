---
name: compose-fire-en
description: A design-doc-drafting request in English should fire writing-compose.
tags: [writing-compose, fire, en]
runs: 3
---

Write a short design doc for a new caching layer we're adding in front of our database. It should use an LRU cache with a 5-minute TTL, invalidate on write, and fall back to the database on a cache miss. Explain what we're deciding, why, and what we're explicitly not doing (a distributed cache, for now).
