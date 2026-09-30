---
layout: section
index: "03"
kicker: Part three
title: An agent-based framework
subtitle: Make Concorde actually usable with AI tools
---

---
layout: diagram
kicker: Five levels of work
title: Agents at both ends, <em>programs</em> between
note: Calls go down, results and errors come up. A judgment never passes from one model to another without a program checking it.
---

```d2 {h: 300}
direction: right
cc: "Claude Code" {
  class: layer
  style: {stroke: "#35e0f1"; font-color: "#35e0f1"}
  direction: right
  main: "Main\nsession" {class: agent}
  ts: "Task\nsession" {class: agent}
  main -> ts
}
mid: "programs" {
  class: layer
  wf: Workflow {class: program}
  op: "Run\n(Operation)" {class: program}
  wf -> op
}
pi: "pi or Claude Code" {
  class: layer
  style: {stroke: "#c8f135"; font-color: "#c8f135"}
  w: "Workers" {class: agent}
}
cc.ts -> mid.wf
mid.op -> pi.w: grant
pi.w -> mid.op: claim
```

<!--
Programs: the main agent and task sessions run on Claude Code only (for now); workers run on pi by default, and
.concorde/workers.json can put any worker or Operation on Claude Code instead.
specs/concorde/module.md, "The levels of work". Models are needed in two places for opposite reasons:
understanding the developer, and doing one bounded job. Everything between is reproducible code.
-->

---
layout: diagram
kicker: Main sessions and tasks
title: As architect, we don't like <em>bubbles</em>
---

```d2 {h: 290}
grid-rows: 4
vertical-gap: 70
mains: "" {
  style: {stroke: transparent; fill: transparent}
  grid-columns: 2
  horizontal-gap: 520
  a: "Main session A" {class: agent}
  b: "Main session B" {class: agent}
}
mcp: "Concorde task management · MCP service   —   tasks · traces · locks · wakes a session when its wait ends" {
  class: chosen
  width: 1500
}
tasks: "" {
  style: {stroke: transparent; fill: transparent}
  grid-columns: 3
  horizontal-gap: 300
  t1: "task session · worktree" {class: agent}
  t2: "task session · worktree" {class: agent}
  t3: "task session · worktree" {class: agent}
}
p: "primary branch · merge lock" {class: program; width: 1500}
mains.a -> mcp: "dispatch" {style: {font-color: "#f2f2ee"; font-size: 20; italic: false}}
mains.b -> mcp: "dispatch" {style: {font-color: "#f2f2ee"; font-size: 20; italic: false}}
mcp -> tasks.t1
mcp -> tasks.t2
mcp -> tasks.t3
tasks.t1 -> p
tasks.t2 -> p: "delivered → merge" {style: {font-color: "#f2f2ee"; font-size: 20; italic: false}}
tasks.t3 -> p
```

<!--
Nobody waits:
- The main agent runs every command in background Bash, hands every task to a task session, and asks the developer
  only what needs them — once, all together.
- A task session is a background Claude Code session (claude --bg) in its own worktree; it reports with SendMessage and
  gathers its decisions to escalate them together.
- The project MCP server (concorde project-mcp) serves each session the project's tasks, traces and locks, takes locks
  without waiting, and wakes the session through a Claude Code channel when a registered wait ends. A --bg session is not
  woken by channel events (25b789de), so task sessions fall back to `concorde task wait` in background Bash.
- Several main sessions may work on one project at once; a run wakes only its owner (4269c26c); merges queue on a kernel
  flock (836613f0). E2E owners case: 5cbc5921. MCP server: 28d93c55.
-->

---
layout: diagram
kicker: Why LangGraph — determinism
title: Three loops, <em>one graph</em> each
note: "Deterministic control flow: code picks every next step from what the host checked — never a model. Every loop is bounded."
---

```d2 {h: 330}
grid-rows: 2
vertical-gap: 80
overview: "" {
  style: {stroke: transparent; fill: transparent}
  direction: right
  main: "Main session" {style: {fill: "#0c0c0c"; stroke: "#3d3d3d"; font-color: "#6b6b66"; border-radius: 0}}
  ts: "Task session" {style: {fill: "#0c0c0c"; stroke: "#3d3d3d"; font-color: "#6b6b66"; border-radius: 0}}
  wf: "Workflow\nsubagents" {style: {fill: "#0c0c0c"; stroke: "#3d3d3d"; font-color: "#6b6b66"; border-radius: 0}}
  op: "Operation · backend\nPython steps + LangGraph" {class: chosen}
  w: "Workers\nresume rounds" {style: {fill: "#0c0c0c"; stroke: "#3d3d3d"; font-color: "#6b6b66"; border-radius: 0}}
  main -> ts -> wf -> op -> w
}
inside: "inside one Operation — LangGraph" {
  class: layer
  grid-columns: 3
  horizontal-gap: 70
  fan: "fan-out / join" {
    class: layer
    grid-rows: 3
    vertical-gap: 45
    s: "Send × N" {class: program}
    r: "reviewers" {class: agent}
    g: "gather (reducer)" {class: program}
    s -> r
    r -> g
  }
  rounds: "rounds" {
    class: layer
    direction: down
    c: challenge {class: agent}
    re: respond {class: agent}
    c -> re
    re -> c: "< rounds" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; italic: false}}
  }
  repair: "bounded repair" {
    class: layer
    direction: down
    ch: chair {class: agent}
    ac: "host accounts" {class: chosen}
    ch -> ac
    ac -> ch: "missing label · max 2" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; italic: false}}
  }
}
overview.op -> inside: "zoom in" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; italic: false}}
```

<!--
Why LangGraph: determinism. Which node runs next is decided by code from what the host observed (the accounting, the
round counter), not by an agent choosing. The same inputs give the same path; every loop is bounded (a counter plus
recursion_limit); the graph is declared in one place with its state as plain data (spec-review/module.md), so it can be
checkpointed and resumed later.
Each worker a node launches still goes through the standard worker sequence: its own grant, audit and checks.
Where this lives: the top strip is the global view from "Agents at both ends, programs between". The loops are backend —
inside one Operation, a program — never between the main session, task sessions and workers. To its caller the whole
graph is one Operation with one run result.
Fan-out/join and bounded repair: spec_panel (src/concorde/spec_review/panel.py). Rounds: the spec_debate pilot (8ce42104),
propose → challenge ⇄ respond → settle for at most --rounds (default 2, max 5); replaced by the panel because
the challenger confirmed every finding (1407440f).
Which engine at which level (merged from the former "LangGraph is one tool among four" slide):
- A known procedure → a workflow; its steps are subagents that only relay Operations, so no isolation is needed.
- Fan-out, rounds, repair → LangGraph inside one Operation, state as plain data.
- The steps of an Operation → a plain-Python step table, deterministic and recorded.
- One worker's retries → resume rounds of the same session on failing checks, in plain Python (Workers).
LangGraph's history: everything (Sep 12, every orchestration a graph) → nothing (Sep 24, deleted) → one tool (Sep 27, spec_panel).
spec-review/module.md: "the fan-out, the join and the bounded repair are declared in one place and its state is plain data between steps,
which a later version can checkpoint and resume." Workflows run their steps as subagents, so they are used only where no isolation is needed (see the previous slides).
-->

---
layout: vs
kicker: Why not a workflow everywhere?
title: Workflows run on <em>subagents</em>
left:
  title: Workflow · subagents
  items:
    - Claude Code workflows and pi subagents both run steps as subagents
    - Subagents share the session's process — no OS sandbox of their own
    - Fine when no isolation is needed — ordering a few Operations
    - e.g. brownfield adoption; step agents only relay each step
right:
  title: LangGraph · separate processes
  items:
    - Runs in Concorde's own Python process
    - Every worker is its own claude -p / pi -p process
    - Each gets an OS-level sandbox built from its grant
    - Used everywhere workers need isolation
label: vs
---

<!--
The main reason Concorde does not build on workflows: a workflow's steps are subagents (Claude Code's workflows, pi's
subagents system), and a subagent runs inside its session's process — it cannot get an OS-level sandbox of its own.
Workers need one, so they must be separate processes, launched by Concorde's Python host.
So: when the steps need no isolation — ordering a few Operations and commands, as the brownfield workflow does — a
workflow is fine; each Operation it starts still launches its own sandboxed workers. Everywhere else, LangGraph.
specs/concorde/execution/workflows/module.md: a workflow is "rendered as a Claude Code workflow"; the step agent
"is an adapter, not a Concorde worker: it relays a command and result".
-->

---
layout: vs
kicker: The split we landed on
title: Claude Code leads, pi works
left:
  title: Claude Code for main agent (user-face)
  items:
    - Background sessions and messages between them
    - Built for a long interactive session
    - "pi has neither: task sessions had to be rounds"
right:
  title: pi for workers
  items:
    - Extensions see every tool call — and explain each denial
    - Any provider, local models, a model per worker
    - Pinned in workers.json, alike for everyone
---

<!--
Why this split (merged from the former "pi's toolbox" slide):
- pi is the more programmable harness: an extension sees every tool call, so Concorde's permission extension replaces the
  file tools, runs commands through sandbox-runtime (the engine Claude Code's own sandbox uses) and explains each denial.
  A worker runs as `pi -p` with its own agent dir, no context files, no skills. models.json reaches OpenAI, Anthropic and local models.
- pi has no background sessions and no messages between sessions, so pi task sessions had to be sequences of headless rounds
  (16c47a73); they were dropped with pi main sessions on Sep 29.
Stated: fdc97452 / .concorde/decisions/drop-pi-main-session.md — "The developer rarely uses pi now and wants the design simpler";
pi stays the default worker backend (c355c639). docs/using-concorde.md: "a cheaper model for implement's worker or three different models for spec_panel".
725fba13: worker configuration "completely independent of the developer's system pi configuration".
The fit of Claude Code's session features to the main side, and pi's provider reach for workers, are my summary rather than a quoted reason.
-->
