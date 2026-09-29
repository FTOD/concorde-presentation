---
theme: slidev-theme-tahta
themeConfig:
  variant: brutalist
transition: slide-left
mdc: true
layout: cover
kicker: Six weeks of building a harness for AI agents
title: Concorde
subtitle: Specs that <span class="accent2">harness</span> your agents — the problems, the attempts, and the choices that stuck
---

<!--
This is not a feature tour. It is the story of building Concorde: what went wrong, what I tried,
what I threw away, and why the current design looks the way it does.
Every claim here can be traced to a commit or a Spec in the ./concorde submodule.
-->

---
layout: statement
kicker: The goal
title: Let AI agents change a real project — <em>without watching every step</em>.
---

<!--
A coding agent in one long session works for a small change. On a real project it breaks down:
it sees too much or too little, anything it can read it can write, it infers what the code "should" do,
it says "done" when nobody checked, and when it fails the reason is lost on the way to a human.
-->

---
layout: reference
kicker: What breaks
title: Four failures the Protocol names
items:
  - { term: Inferred promises, desc: "a file name or nearby text suggests it, so it's treated as promised" }
  - { term: Meaning drift, desc: "one word, different meanings in different places" }
  - { term: Authority creep, desc: "read access quietly becomes write access" }
  - { term: Fabricated evidence, desc: "“tests pass” claimed rather than observed" }
---

<!--
None of these are about model capability. They are about the environment the agent works in — the harness.
The names come from protocol/principles.md; they first appear in Protocol v11, as names for older rules.
-->

---
layout: define
kicker: The bet
term: Specs are the harness
definition: The <span class="accent2">Spec</span>, not the code, is the source of truth — and each Module's responsibility is the boundary of every agent that works on it.
points:
  - What an agent may read and write is computed, not asked for
  - An agent's answer is checked by a program, not trusted
  - A missing promise stops the work instead of being guessed from code
---

<!--
Source: the opening of Design in specs/concorde/module.md.
This bet stayed fixed; almost everything around it was rebuilt at least once.
-->

---
layout: timeline
kicker: How it actually went
title: 1,029 commits in <em>six weeks</em>
events:
  - { date: "Aug 19", title: A Spec Kit extension, desc: "feature specs in numbered folders; agents as session subagents" }
  - { date: "Sep 2", title: Standalone, desc: "host-launched workers, an admission layer, attestations" }
  - { date: "Sep 12", title: Graphs and pi, desc: "every orchestration a LangGraph flow; pi the only runtime" }
  - { date: "Sep 24", title: The reset, desc: "two tiers on Claude Code; plain-Python Operations" }
  - { date: "Sep 25", title: Grow back, desc: "task sessions, workflows, pi again, the two halves, tracing" }
---

<!--
Reset: commit 6b8e150e "Remove the Pi, LangGraph and admission harness and restructure the Specs",
driven by the design doc docs/design/concorde-refactor.md (efeb3513, later deleted).
-->

---
layout: stats
kicker: By the numbers
title: One big reset in the middle
stats:
  - { value: 1029, label: commits in 42 days, icon: "lucide:git-branch" }
  - { value: 15, label: Spec Protocol major versions, icon: "lucide:layers" }
  - { value: 87, unit: k, label: lines deleted in one commit, icon: "lucide:scissors", tone: bad }
  - { value: 3, label: "roles LangGraph played", icon: "lucide:workflow" }
---

<!--
Protocol v1 on Sep 6, v15 on Sep 28. The reset commit: 634 files changed, 9,861 insertions, 87,264 deletions.
-->

---
layout: section
index: "01"
kicker: Part one
title: How do you describe a project to an agent?
subtitle: From feature specs to one declared graph
---

---
layout: timeline
kicker: Fifteen Protocol versions
title: From feature folders to <em>one graph</em>
events:
  - { date: "Aug 20", title: Spec Kit extension, desc: "a pile of features gives no model of the whole" }
  - { date: "Sep 6", title: Three kinds of unit, desc: "Domain / Service / Module, each restating what it shares" }
  - { date: "Sep 9", title: Implementation Specs, desc: "added 10:19, removed 21:05 — one generic template, repeated" }
  - { date: "Sep 22", title: "v11: one declared graph", desc: "boundaries computed from typed relations" }
  - { date: "Sep 28", title: "v15: one glossary", desc: "no word defined twice without anyone noticing" }
---

<!--
280a6ce3 (first design), 754bcab3 / ad4db321 (kinds), 50264182 (v3), 83305ed4 decision log D01/D09,
6ae81a0d D14 (Modules by capability), d5c6b026 (v11), 249efb0b (v15).
-->

---
layout: vs
kicker: What survived
title: Removed vs kept
left:
  title: Tried, then removed
  items:
    - Feature-oriented specs
    - Three kinds of unit
    - One Implementation Spec per file
    - Architecture JSON beside the prose
    - A terminology table per Module
right:
  title: Kept
  items:
    - A Module is a responsibility, not a folder
    - One graph — every relation declared once
    - One glossary for the whole project
    - D2 diagrams next to the prose
    - Tests point at scenarios; Specs never list evidence
label: →
---

<!--
Archify JSON: "external JSON formed several representations that had to be kept in sync" (D01).
Implementation Specs mostly repeated "obey the public contract" (D09).
Per-Module terminology tables: link-only rows, and a word could be defined twice in two Modules (v15 migration).
-->

---
layout: diagram
kicker: Protocol v11
title: Stop writing permissions — <em>compute</em> them
note: Read comes from <strong>dependency</strong>, write only from <strong>ownership</strong> — reading never becomes writing. Selection is one level deep, never recursive.
---

```d2 {h: 300}
direction: right
g: "Declared\ngraph" {class: program}
s: "Boundary\nsets" {class: program}
t: "Task\ntype" {class: program}
gr: "Grant\nnames · ro · rw" {class: chosen}
h: "Harness\nClaude Code · pi" {class: agent}
g -> s: computed
s -> t: combined
t -> gr
gr -> h: compiled
```

<!--
Before v11 (protocol/migration.md): relations lived in four different carriers; a Module could depend on another
whose Spec was never in its context; a diagram could show a collaboration nothing declared.
v12 (d460b95e) made the task types normative "so two harnesses give the same task the same boundary".
-->

---
layout: define
kicker: Brownfield
term: code-to-spec
definition: The <span class="accent2">one sanctioned road</span> from existing code to a Spec.
points:
  - "The rules said: never infer a promise from code — and every file belongs to a Module"
  - A project whose code came first had no legal first step
  - code-to-spec records behaviour as it is and never changes code
  - Unclear intent becomes an open question for the developer, not a promise
---

<!--
Protocol 13.1 (ba9756a3). The brownfield workflow: survey → scaffold → code_to_spec per Module → review → validate → deliver.
Verified end to end in 54b64922. Once described, a Module is Spec first again.
-->

---
layout: section
index: "02"
kicker: Part two
title: How do you run an agent inside a boundary?
subtitle: Subagents, headless sessions, and a spike
---

---
layout: vs
kicker: Permissions must be fixed before the agent starts
title: Subagent vs a separate process
left:
  title: A subagent in the session
  items:
    - Shares its parent's settings, hooks and sandbox
    - No per-worker computed boundary
    - Its answer lands in a model, unchecked
    - It can delegate further
right:
  title: claude -p / pi -p, launched by the host
  items:
    - Boundary written before launch
    - No agent tool — never starts other agents
    - Output is a claim; the host audits and checks it
    - Its own program and model
---

<!--
Early on, reflection work ran as Claude Code subagents (.claude/agents/reflection-implementer.md, 6742f852; deleted in cce5a03b).
Sep 2 research (.concorde/attempts/feature.operations.permission-bounded-planning/research.md):
"Prompt-only file lists were rejected as non-enforcing"; letting the agent resolve its own permissions
"requires ambient read access before confinement". Today subagents appear only as relays in workflows.
-->

---
layout: diagram
kicker: One worker run
title: The worker's answer is only a <em>claim</em>
note: A failing check starts a resume round with the same worker. A Spec gap or an out-of-bounds write goes up the chain — it is never retried.
---

```d2 {h: 300}
direction: right
r: "Runner" {class: program}
w: "Worker\nclaude -p · pi -p" {class: agent}
a: "Write audit\n+ checks" {class: program}
e: "Run result\n+ evidence" {class: chosen}
r -> w: "grant, brief"
w -> a: claim
a -> w: "resume round" {style.stroke-dash: 3}
a -> e
```

<!--
specs/concorde/execution/workers/module.md: up to three resume rounds by default; the audit runs outside the worker.
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
§7 of docs/design/concorde-refactor.md (efeb3513); implemented in b2822690.
Also found: with the worktree as working directory Claude Code adds it to the sandbox, breaking per-file confinement;
in -p mode dontAsk denies Edit/Write even on granted files. So workers run from a runtime directory, in bypassPermissions,
with the hook as the write allow-list and a host write audit as the last line of defense.
-->

---
layout: bigtype
kicker: Lesson
title: Test the platform, <em>not its docs</em>.
subtitle: Two weeks earlier the Spec admitted the Claude boundary rested on docs “no test in this repository exercises”.
---

<!--
53725e48: "The Claude boundary has no physical probe… rests on Claude Code's documented… semantics, which no test in this repository exercises."
-->

---
layout: timeline
kicker: Which program runs the workers?
title: "pi: only runtime, gone, <em>back</em>"
events:
  - { date: "Sep 15", title: pi everywhere, desc: "a tool-gate extension, then bubblewrap" }
  - { date: "Sep 24", title: Claude Code only, desc: "pi removed in the reset" }
  - { date: "Sep 25", title: pi returns, desc: "a second backend, compiled from the same grant" }
  - { date: "Sep 27", title: pi by default, desc: "workers run on pi unless configured" }
  - { date: "Sep 29", title: Models pinned, desc: "only from the tracked workers.json" }
---

<!--
bf0262ee / 292a14d5 (pi everywhere), 89286633 (bubblewrap: "the tool gate bounded the model's tool calls but not the process itself"),
122f1cca / ae9a9af4 (pi permission extension), c355c639 (pi default), 725fba13 (models only from workers.json).
The mid-September switch to pi has no stated reason in the history.
-->

---
layout: columns
kicker: One grant, two compilers
title: Why not translate one config into the other?
columns:
  - { title: Each program, its own mechanism, items: ["Claude Code's rule language is closed and changes between versions", "pi has no permission system — but extensions see every tool call", "Only an OS sandbox confines what a command opens"] }
  - { title: Why keep two programs, items: ["Main sessions run on either", "Reviewers on different models are more independent", "Tracked models: every developer's workers of a commit run alike"] }
---

<!--
specs/concorde/harness/module.md (Design) and specs/concorde/execution/workers/module.md.
-->

---
layout: section
index: "03"
kicker: Part three
title: Who decides the next step?
subtitle: Leader agents, LangGraph, workflow scripts
---

---
layout: diagram
kicker: No leader agent
title: Agents at both ends, <em>programs</em> between
note: A judgment never passes from one model to another without a program checking it.
---

```d2 {h: 300}
direction: right
main: "Main\nagent" {class: agent}
ts: "Task\nsession" {class: agent}
mid: "programs" {
  class: layer
  wf: Workflow {class: program}
  op: Operation {class: program}
  wf -> op
}
w: "Workers" {class: agent}
main -> ts
ts -> mid.wf
mid.op -> w: grant
w -> mid.op: claim
```

<!--
specs/concorde/module.md, "Agents at both ends, programs between" (e7cb43eb).
Models are needed in two places for opposite reasons: understanding the developer, and doing one bounded job.
-->

---
layout: vs
kicker: What sits in the middle?
title: Tried vs kept
left:
  title: Tried
  items:
    - A leader agent directing the workers
    - Every orchestration a LangGraph flow
    - The outer agent picks the order
right:
  title: Kept
  items:
    - Models only where judgment is needed
    - Programs for grants, launches, audits, checks, order
    - The task session at the agent end, not in the middle
---

<!--
Sep 24 design doc: "No leader tier". Sep 12: 1335d293. Sep 20: df270184 "callers own contract edits and operation order".
-->

---
layout: timeline
kicker: LangGraph
title: Everything, nothing, <em>one tool</em>
events:
  - { date: "Sep 2", title: First use, desc: "an optional composer of prompt stages" }
  - { date: "Sep 12", title: Everything, desc: "every orchestration a graph, for inspectable topology" }
  - { date: "Sep 20", title: Nothing, desc: "orchestrators removed; callers choose the order" }
  - { date: "Sep 24", title: Deleted, desc: "vestigial — gone with 87k other lines" }
  - { date: "Sep 27", title: One tool, desc: "fan-out and join inside the Spec panel" }
---

<!--
efe50e94, 1335d293, a28e4cfa (Graph API only: the functional API "compiles to one opaque node"), df270184, 6b8e150e,
13bfbcca + b8c81449 (back as a runtime dependency). Why it came back (spec-review/module.md): "the fan-out, the join and
the bounded repair are declared in one place and its state is plain data between steps, which a later version can checkpoint and resume."
-->

---
layout: reference
kicker: Which engine for which flow
title: Workflow scripts, LangGraph, or Dynamic Workflows?
items:
  - { term: Known procedure → workflow script, desc: "brownfield adoption; runs in the client's background; one procedure for Claude Code and pi" }
  - { term: Fan-out and join → LangGraph, desc: "the Spec panel; branches, join and bounded repair declared in one place" }
  - { term: Operation steps → plain Python, desc: "implement, specify …; deterministic and recorded" }
  - { term: Dynamic Workflows → not used, desc: "meant for workers sharing one permission set — every Concorde worker has its own grant, and runs on pi too" }
---

<!--
Workflows: ba9756a3 / 3c4611c8; execution/workflows/module.md ("a procedure… not a prompt asking a model to invent the next steps").
Dynamic Workflows: a non-goal in the Sep 24 design; its future-work list reserves them for "parallel workers that share one permission set".
-->

---
layout: quote
quote: …instead of repeating it, the agent returned an invented outcome.
author: A live brownfield run on psf/requests — since then the script waits, and step agents only relay
---

<!--
28ad0dcb: the Haiku step agent ran a 540-second step under the Bash tool's two-minute default; the command went to the background,
and the agent returned an invented outcome. Now each call waits at most 100 s and the script repeats it; the report is built by a
command that reads each saved result itself.
-->

---
layout: diagram
kicker: Spec review
title: From a debate to a <em>panel</em>
note: The debate's challenger agreed with every finding; independent reviews each found what the others missed.
---

```d2 {h: 220}
direction: right
spec: Specs {class: program}
r1: "Reviewer\nmodel A" {class: agent}
r2: "Reviewer\nmodel B" {class: agent}
r3: "Reviewer\nmodel C" {class: agent}
chair: "Chair" {class: agent}
chk: "Host\ncheck" {class: chosen}
spec -> r1
spec -> r2
spec -> r3
r1 -> chair
r2 -> chair
r3 -> chair
chair -> chk
chk -> chair: "retry once" {style.stroke-dash: 3}
```

<!--
8ce42104 (spec_debate pilot), 1407440f (replaced by spec_panel, Sep 27).
The panel: reviewers on different models, a chair that audits and merges, and a host check that every finding
is accounted for exactly once.
-->

---
layout: section
index: "04"
kicker: Part four
title: Who works a task, and who decides?
subtitle: Sessions, delegation, errors and traces
---

---
layout: timeline
kicker: The task level
title: The leader came back — <em>as a task session</em>
events:
  - { date: "Sep 24", title: No leader tier, desc: "“one fewer place for an error to be lost”" }
  - { date: "Sep 25", title: For parallelism, desc: "parallel tasks need parallel sessions; escalation links contain the risk" }
  - { date: "Sep 29", title: Every task delegated, desc: "the main agent stays with the developer; every task runs under a write boundary" }
---

<!--
efeb3513 design doc; b364466c ("This revives the leader tier the root design had deferred"); 5a106ebb / 6ce5c316.
Decisions go up together, so the developer is asked once per round rather than once per question.
On pi a task session is a sequence of headless rounds (16c47a73): pi "has neither background sessions nor messages between sessions".
-->

---
layout: diagram
kicker: Two halves
title: One narrow seam, <em>no stored state</em>
note: Execution never learns that tasks exist. Task state is derived from what happened — “with no second copy there is nothing to recover”.
---

```d2 {h: 300, layout: elk}
direction: right
co: "coordination" {
  class: layer
  direction: down
  ts: "Task\nsessions" {class: agent}
  tasks: Tasks {class: program}
}
b: "Workspace\nbinding" {class: chosen}
ex: "execution" {
  class: layer
  direction: down
  runs: Runs {class: program}
  store: "Run store" {class: program}
  runs -> store
}
co.tasks -> b: writes
co.ts -> ex.runs: starts
ex.runs -> b: reads
co.tasks -> ex.store: reads
```

<!--
2cea5232 (the split, Sep 27): Execution used to take --task. specs/concorde/coordination/tasks/module.md ("Why the state is derived").
Merges take a kernel flock (836613f0): a crashed recorded owner would block everyone, and Claude Code and pi sessions share no channel.
-->

---
layout: diagram
kicker: Errors and traces
title: A chain, <em>not a summary</em>
note: Each level adds one link with its reason and keeps the causes unchanged. Tracing keeps every level's node in one tree per task, each with its own cost.
---

```d2 {h: 300}
direction: right
w: "worker\nchecks fail" {class: agent}
op: "operation\nexhausted" {class: program}
ts: "task session\nscope" {class: agent}
m: "main agent\ndecision" {class: agent}
d: "Developer" {class: chosen}
w -> op -> ts -> m -> d
```

<!--
The Sep 24 design's first error format was a flat envelope with a "summary" field; the same day 9aff9104 made it a chain.
Tracing (a5f05a95, 3fd47923, 449335f1): before it, "each level kept its own record in its own shape, flat and side by side… and nothing added up".
-->

---
layout: reference
kicker: Looking back
title: What building Concorde taught me
items:
  - { term: "Enforce, don't ask", desc: "a file list in a prompt is a wish" }
  - { term: Test the platform, desc: "the harness came from a spike where every layer failed" }
  - { term: Programs between models, desc: "no judgment reaches another model unchecked" }
  - { term: "Derive, don't store", desc: "state is recomputed from what happened" }
  - { term: Delete aggressively, desc: "a layer that lasted a day; 87k lines in one commit" }
  - { term: Let live runs redesign you, desc: "an invented outcome; a debate that agreed with itself" }
---

---
layout: statement
kicker: Still open
title: It guards against <em>mistakes</em> — not a malicious actor.
---

<!--
The Harness Spec lists the known limits of v1. Future work: an outer sandbox-runtime (srt) sandbox around the agent process, and proxied credentials.
-->

---
layout: end
title: Thank you
subtitle: Specs that harness your agents.
contact: github.com/FTOD/concorde
---
