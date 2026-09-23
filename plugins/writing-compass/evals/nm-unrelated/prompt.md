---
name: nm-unrelated
description: An unrelated bug-fixing request should fire neither writing-compose nor writing-review.
tags: [writing-compose, writing-review, near-miss]
runs: 1
---

There's a bug in `parseConfig()`: it throws when the config file has a trailing comma in the JSON. Please fix it so trailing commas are tolerated.
