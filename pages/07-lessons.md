---
layout: section
index: "07"
kicker: Part seven
title: What I learned
subtitle: About Claude Code, pi, and building with agents
---

---
layout: reference
kicker: Claude Code's toolbox
title: What each piece is good for
items:
  - { term: Subagents, desc: "run in the parent's permissions — now only relays in workflows" }
  - { term: "claude -p", desc: "a worker: its own settings, tools, schema and config dir" }
  - { term: "claude --bg + SendMessage", desc: "task sessions — but nothing says when one ends" }
  - { term: Channels, desc: "wake a session when a wait ends — not a --bg session" }
  - { term: "Deny rules, hooks, sandbox", desc: "a boundary only together — each failed alone" }
---

<!--
Vendored docs: "A subagent runs in the parent session's permission mode". Resume under -p gives a new session id each round.
25b789de: a --bg session "is never woken by the channel event of a wait it registered" (Claude Code 2.1.284).
d4b64e8e: task sessions use auto mode; bypassPermissions in a background session needs a one-time disclaimer.
-->

---
layout: reference
kicker: pi's toolbox
title: The same ideas, more programmable
items:
  - { term: "pi -p", desc: "a worker with its own agent dir, no context files, no skills" }
  - { term: Extensions, desc: "see every tool call — replace the file tools, explain each denial" }
  - { term: sandbox-runtime, desc: "the engine Claude Code's own sandbox uses" }
  - { term: No background sessions, desc: "no messages between sessions — task sessions became rounds" }
  - { term: Any provider, desc: "models.json reaches OpenAI, Anthropic, local models" }
---

<!--
workers/pi.md, harness/pi.md; 16c47a73 (pi task sessions as rounds, later removed with pi main sessions).
-->

---
layout: vs
kicker: The split we landed on
title: Claude Code leads, pi works
left:
  title: Claude Code for the main agent
  items:
    - Background sessions, SendMessage, channels
    - Built for a long interactive session
    - One program on the main side keeps it simple
right:
  title: pi for workers
  items:
    - Any provider, local models, a model per worker
    - A permission extension that explains denials
    - Models pinned in workers.json, alike for everyone
---

<!--
Stated: fdc97452 / .concorde/decisions/drop-pi-main-session.md — "The developer rarely uses pi now and wants the design simpler";
pi stays the default worker backend (c355c639). docs/using-concorde.md: "a cheaper model for implement's worker or three different models for spec_panel".
725fba13: worker configuration "completely independent of the developer's system pi configuration".
The fit of Claude Code's session features to the main side, and pi's provider reach for workers, are my summary rather than a quoted reason.
-->

---
layout: columns
kicker: The spike · Claude Code 2.1.280
title: Every layer failed <em>alone</em>
columns:
  - { title: Bash sandbox alone, items: ["Governs only Bash", "Read returned the credentials file", "Edit changed read-only Specs"] }
  - { title: Deny rules alone, items: ["Restricts reads", "Write still creates new files", "Deny beats allow: no allow-list"] }
  - { title: "+ a write hook", items: ["Allows exactly the rw list", "Explains every refusal", "Closes the gap"] }
---

<!--
§7 of docs/design/concorde-refactor.md (efeb3513). Also: with the worktree as working directory Claude Code adds it to the sandbox;
a Bash write outside rw "appears to succeed, but writes to a throw-away tmpfs".
-->

---
layout: reference
kicker: Small things that bit
title: The platform surprises
items:
  - { term: A two-minute Bash timeout, desc: "a step agent returned an invented outcome — now the script waits" }
  - { term: A dropped field, desc: "a model retyped a request without \"answers\" — relays are marked unverified" }
  - { term: Proxies, desc: "workers reached no model until the proxy was passed on" }
  - { term: Personal settings, desc: "workers inherited the user's pi model — rejected the same day" }
  - { term: A closed network, desc: "broke npm and git in task sessions — reads and network stay open" }
---

<!--
28ad0dcb, 1883d203, e24ee272, fbf5a090 → 725fba13, 40d9e79e.
-->

---
layout: timeline
kicker: The platform, over six weeks
title: Subagents to a <em>split</em>
events:
  - { date: "Aug 30", title: Claude subagents, desc: "reflection agents inside the session" }
  - { date: "Sep 2", title: Host-launched workers, desc: "codex exec / claude -p with a fixed launch spec" }
  - { date: "Sep 15", title: pi everywhere, desc: "pi RPC workers, LangGraph flows" }
  - { date: "Sep 24", title: The reset, desc: "Claude Code only; 87k lines deleted" }
  - { date: "Sep 29", title: The split, desc: "Claude Code leads, pi works" }
---

<!--
Sep 2 research: "Prompt-only file lists were rejected as non-enforcing"; permissions must be fixed before the agent starts.
Reset: 6b8e150e (634 files, 87,264 deletions).
-->

---
layout: reference
kicker: Building with agents
title: What I would tell myself on day one
items:
  - { term: "Enforce, don't ask", desc: "a file list in a prompt is a wish" }
  - { term: Test the platform, desc: "not its docs — the harness came from a spike" }
  - { term: Programs between models, desc: "no judgment reaches another model unchecked" }
  - { term: "Derive, don't store", desc: "task state is recomputed from what happened" }
  - { term: Delete aggressively, desc: "a Spec layer lasted a day; the reset removed 87k lines" }
  - { term: Let live runs redesign you, desc: "an invented outcome; a debate that agreed with itself" }
---
