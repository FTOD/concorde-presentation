---
layout: section
index: "05"
kicker: Part five
title: An agent-based framework
subtitle: Putting it together — from task management down to workers
---

---
layout: diagram
kicker: Five levels of work
title: Agents at both ends, <em>programs</em> between
note: Calls go down, results and errors come up. A judgment never passes from one model to another without a program checking it.
---

```d2 {h: 300}
direction: right
main: "Main\nsession" {class: agent}
ts: "Task\nsession" {class: agent}
mid: "programs" {
  class: layer
  wf: Workflow {class: program}
  op: "Run\n(Operation)" {class: program}
  wf -> op
}
w: "Workers" {class: agent}
main -> ts
ts -> mid.wf
mid.op -> w: grant
w -> mid.op: claim
```

<!--
specs/concorde/module.md, "The levels of work". Models are needed in two places for opposite reasons:
understanding the developer, and doing one bounded job. Everything between is reproducible code.
-->

---
layout: diagram
kicker: Main session vs tasks
title: Dispatch, <em>don't wait</em>
note: Every task is a branch, a worktree and a background task session. Several main sessions can dispatch at once; a run wakes only its owner, and merges queue on a kernel lock.
---

```d2 {h: 300, layout: elk}
direction: right
a: "Main session A" {class: agent}
b: "Main session B" {class: agent}
t1: "task · worktree" {class: agent}
t2: "task · worktree" {class: agent}
t3: "task · worktree" {class: agent}
p: "primary branch\nmerge lock" {class: chosen}
a -> t1
a -> t2
b -> t3
t1 -> p: delivered
t2 -> p
t3 -> p
```

<!--
coordination/main-session/module.md: "Several main sessions may work on one project at the same time, but a run wakes only its owner."
4269c26c (owner-only wake), 836613f0 (merge lock), 5cbc5921 (E2E owners case).
-->

---
layout: columns
kicker: Keeping the developer's session free
title: How nobody waits
columns:
  - { title: The main agent, items: ["Runs every command in background Bash", "Hands every task to a task session", "Asks the developer only what needs them — once"] }
  - { title: A task session, items: ["A background Claude Code session in its worktree", "Reports with SendMessage", "Gathers its decisions and escalates them together"] }
  - { title: The project MCP server, items: ["Tasks, traces and locks for each session", "Takes locks without waiting", "Wakes the session through a channel when a wait ends"] }
---

<!--
28d93c55 (project MCP server, lock handover, concorde task wait). A --bg session is not woken by channel events (25b789de),
so task sessions fall back to `concorde task wait` in background Bash.
-->

---
layout: diagram
kicker: Loops in LangGraph
title: Three loops, <em>one graph</em> each
note: "Every edge is decided by the host from what it checked — never by a model's opinion. Every loop has a counter and a recursion_limit."
---

```d2 {h: 320}
grid-columns: 3
horizontal-gap: 40
fan: "fan-out / join" {
  class: layer
  direction: down
  s: "Send × N" {class: program}
  r: "reviewers" {class: agent}
  g: "gather\n(reducer)" {class: program}
  s -> r -> g
}
rounds: "rounds" {
  class: layer
  direction: down
  c: challenge {class: agent}
  re: respond {class: agent}
  c -> re
  re -> c: "< rounds" {style.stroke-dash: 3}
}
repair: "bounded repair" {
  class: layer
  direction: down
  ch: chair {class: agent}
  ac: "host\naccounts" {class: chosen}
  ch -> ac
  ac -> ch: "missing label\n(max 2)" {style.stroke-dash: 3}
}
```

<!--
Fan-out/join and bounded repair: spec_panel (src/concorde/spec_review/panel.py). Rounds: the spec_debate pilot (8ce42104),
propose → challenge ⇄ respond → settle for at most --rounds (default 2, max 5); replaced by the panel because
the challenger confirmed every finding (1407440f).
-->

---
layout: code-explain
kicker: The Spec panel
title: A loop is an edge that points back
notes:
  - "<strong>Fan-out</strong> — one <code>Send</code> per reviewer seat; they run in parallel."
  - "<strong>Join</strong> — reviews land in a list with an <code>operator.add</code> reducer."
  - "<strong>Repair</strong> — the chair's edge points back to itself while a label is unaccounted."
  - "<strong>Ceiling</strong> — <code>recursion_limit</code> = the most steps the loop may take."
---

```python
g = StateGraph(PanelState)   # plain JSON
g.add_node("review", review)
g.add_node("gather", gather)
g.add_node("chair", chair)
g.add_conditional_edges(START, fan_out,
                        ["review"])
g.add_edge("review", "gather")
g.add_conditional_edges("gather", after_gather,
                        {"chair": "chair", "end": END})
g.add_conditional_edges("chair", after_chair,
                        {"chair": "chair", "end": END})
g.compile().invoke(state,
    {"recursion_limit": CHAIR_ATTEMPTS + 4})
```

<!--
Every node that launches a worker goes through the standard worker sequence: its own grant, audit and checks.
To the caller the whole graph is one Operation with one run result.
-->

---
layout: reference
kicker: Which engine for which flow
title: LangGraph is one tool among four
items:
  - { term: A known procedure, desc: "a Claude Code workflow script — brownfield adoption, in the background" }
  - { term: "Fan-out, rounds, repair", desc: "LangGraph inside one Operation — state as plain data" }
  - { term: One worker's retries, desc: "resume rounds in plain Python — same session, failing checks" }
  - { term: The steps of an Operation, desc: "a plain-Python step table — deterministic and recorded" }
  - { term: Dynamic Workflows, desc: "not used — meant for workers sharing one permission set" }
---

<!--
LangGraph's history: everything (Sep 12, every orchestration a graph) → nothing (Sep 24, deleted) → one tool (Sep 27, spec_panel).
spec-review/module.md: "the fan-out, the join and the bounded repair are declared in one place and its state is plain data between steps,
which a later version can checkpoint and resume." Dynamic Workflows: a non-goal of the Sep 24 design, whose future work reserves them
for "parallel workers that share one permission set" — every Concorde worker has its own grant.
-->
