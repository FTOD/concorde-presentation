---
layout: section
index: "01"
title: The Specs and Permission Model
---

---
layout: diagram
title: A project's Spec is <em>one declared graph</em>
---

```d2 {h: 280, layout: elk}
direction: right
tests: "checks (tests)" {class: program}
spec: "Project Spec · one declared graph" {
  class: layer
  m: "Module · one responsibility" {
    class: layer
    direction: down
    doc: "documents\nentry · requirements\nscenarios · contracts" {class: chosen}
    r: "realization" {class: program}
  }
  sub: "child Module" {class: program}
  prov: "provider Module/ other files" {class: program}
  m -> sub: contains
  m -> prov: "uses · includes"
}
code: "code files" {class: program}
spec.m.r -> code: binds
tests -> spec.m.doc: verifies
```

<!--
protocol/README.md: "the specification is one graph of declared nodes and relations, from which read sets, write sets, views and checks are computed."
Code files and tests sit outside the graph: a realization binds code, and a test points at a scenario.
protocol/model.md: seven node types — module, document, concept, realization, requirement, scenario, contract.
protocol/relations.md groups the relations: ownership and collaboration (owns, defines, contains, uses), context (includes),
realization (binds), interfaces and evidence (participates, verifies).
A file name, a folder or an undeclared diagram never creates a relation (axiom A2). Tests point at scenarios; the Spec never lists its tests.
-->

---
layout: diagram
title: From the graph to a <em>grant</em>
---

```d2 {h: 330}
grid-rows: 6
grid-columns: 3
grid-gap: 0
h0: "relation from M → paths" {class: note}
h1: "implement M" {class: agent}
h2: "review-code M" {class: agent}
r1: "owns → M's documents" {class: program}
r1a: "ro" {class: program}
r1b: "ro" {class: program}
r2: "uses · includes → providers' documents" {class: program}
r2a: "ro" {class: program}
r2b: "ro" {class: program}
r3: "binds → M's code" {class: program}
r3a: "rw" {class: chosen}
r3b: "ro" {class: program}
r4: "binds, any Module → all project code" {class: program}
r4a: "ro" {class: program}
r4b: "ro" {class: program}
r5: "no relation → everything else" {class: program}
r5a: "denied" {class: rejected}
r5b: "denied" {class: rejected}
```

<!--
protocol/boundaries.md: a task is bound to Modules and has one task type; the type gives each boundary set one level.
Rows are the sets: SpecScope (owns), SpecContext (owns · contains · uses · includes), ImplementationScope (binds),
ProjectImplementation (every Module's binds). src/concorde/spec/grants.py computes the grant: per path, the highest
level any set assigns (names < ro < rw); anything not listed is denied.
implement may change only M's own code, never M's Specs; review-code reads exactly what implement read, plus nothing writable —
its verdict is task output, not a write in the project. Both read the whole project's code, because code runs together.
The same Specs, the same Module, two task types: two grants, computed — no one wrote either by hand.
-->

<!-- ---
layout: reference
title: The failures we can detect
items:
  - { term: Inferred promises, desc: "a file name or nearby text suggests it, so it's treated as promised" }
  - { term: Meaning drift, desc: "one word, different meanings in different places" }
  - { term: Authority creep, desc: "read access quietly becomes write access" }
  - { term: Fabricated evidence, desc: "“tests pass” claimed rather than observed" }
--- -->

<!--
protocol/principles.md. Every rule of the Protocol answers one of these.
-->

---
layout: diagram
title: One Spec, <em>two façades</em>
---

```d2 {h: 300, layout: elk}
direction: right
people: People {class: program}
views: "Docsite\npurpose · concepts\ndiagrams" {class: program}
spec: "Spec\none declared graph" {class: chosen}
ctx: "Context · grant\nnames · ro · rw" {class: program}
agents: Agents {class: agent}
people <- views <- spec -> ctx -> agents
people -> spec: "edit directly" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"}}
agents -> spec: "specify · review · fix" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"}}
people -> agents: "ask agents to change it" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"}}
agents -> people: "open questions · Spec gaps" {style: {stroke: "#35e0f1"; stroke-dash: 4; font-color: "#35e0f1"}}
```

<!--
Reading: Views publishes the Specs as a docsite — "a published page only views the Specs — no context granted,
no Spec changed, nothing proved about the code". Agents get computed context, a grant (names · ro · rw) and spec-mcp,
which "adds no rule of its own — every answer is Spec core's".
Changing: the developer and the main agent edit Specs directly; a specify run writes them; a task session changes them
within its task's goal; spec_review / spec_panel report problems; code_to_spec describes brownfield code.
Every change lands in the one Spec, and task-validation checks it before delivery.
Handing back: agents never infer a missing promise — they report a Spec gap, and behaviour whose intent is unclear
becomes an open question for the developer.
protocol/principles.md, "Two purposes": Understanding — "a human never needs to read the code to understand the project";
Boundaries — "a harness … can derive from the specification exactly what the task may read and what it may write".
-->

---
layout: diagram
title: The Spec splits the <em>permissions</em>
---

```d2 {h: 320}
direction: right
g: "Declared\ngraph" {class: program}
ms: "Main session\nwith the developer" {class: agent}
t: "Task type · one per task" {
  class: layer
  grid-columns: 1
  grid-gap: 0
  u: "understand · reads Specs, code by name" {class: program}
  s: "specify · writes its Specs" {class: program}
  i: "implement · writes its code" {class: program}
  r: "test · review-code · reads code" {class: program}
  c: "code-to-spec · code → its Specs" {class: program}
}
gr: "Grant\nnames · ro · rw" {class: chosen}
cc: "Claude Code worker\n\ndeny rules · reads\nwrite hook · writes\nBash sandbox · commands" {class: agent}
pi: "pi worker\n\npermission extension · file tools\nsandbox-runtime · commands" {class: agent}
g -> ms: reads
ms -> gr: "a task's\nModules"
t -> gr
gr -> cc: compiled
gr -> pi: compiled
```

<!--
The main session — the main agent with the developer, in the primary worktree — reads the graph (Spec MCP: which Modules exist,
what their contexts are) and splits agreed work into tasks, each bound to Modules (coordination/main-session/module.md, "Split into tasks").
Read comes from dependency relations (uses, includes), write only from ownership — reading never becomes writing.
Selection is one level deep, never recursive. A file an unbound Module also binds is never made writable (shared_file).
Task types (protocol/boundaries.md), each run by the Operation of the same name (specs/concorde/execution/operations/module.md):
review-code → code_review, review-spec → spec_review / spec_panel, code-to-spec → code_to_spec (and survey).
Writing a promise and realizing it are different jobs, so specify and implement never share a grant.
code-to-spec is the one road for brownfield projects: it reads code and writes Specs, never code.
The grant is compiled into each program's own mechanism (specs/concorde/harness/module.md, Design).
Claude Code: deny rules limit reads, the write hook allows only the rw list, the Bash sandbox confines commands.
pi: the permission extension replaces the file tools and runs commands through sandbox-runtime.
The same Harness also builds a task session's boundary from its task.
Outside both programs, the host's write audit compares every round's changes with the grant.
-->

---
layout: diagram
title: An agent's “done” is a <em>claim</em>
note: Concorde never takes a worker at its word. The host (a Python program w/o AI) checks the claim itself — then retries it, escalates it, or records it as evidence.
---

```d2 {h: 320}
direction: right
without: "Without Concorde" {
  class: layer
  direction: right
  a: "Agent" {class: agent}
  y: "You\n(trust it)" {class: program}
  a -> y: "“done, tests pass”" {style: {font-color: "#f2f2ee"; font-size: 18; italic: false}}
}
with: "With Concorde" {
  class: layer
  direction: right
  w: "Worker" {class: agent}
  h: "Host\n(a Concorde Python\nprogram, no AI)\n\ngit diff vs grant\nruns the checks" {class: program}
  ok: "Result\n+ evidence" {class: chosen}
  up: "Main session\ndecides" {class: agent}
  w -> h: claim {style: {font-color: "#f2f2ee"; font-size: 18; italic: false}}
  h -> w: "checks fail → retry" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; font-size: 18; italic: false}}
  h -> ok: "all pass" {style: {font-color: "#f2f2ee"; font-size: 18; italic: false}}
  h -> up: "out of bounds · Spec gap" {style: {stroke: "#35e0f1"; stroke-dash: 4; font-color: "#35e0f1"; font-size: 18; italic: false}}
}
```

<!--
Without Concorde: the agent says "done, tests pass" and you can only trust it — or re-check everything yourself.
With Concorde: the worker (claude -p / pi -p) returns a claim. The host — Concorde's own Python code (the Workers module), no AI in it — compares the
worktree's changes with the grant (write audit, git diff) and runs the project's configured checks in a read-only sandbox.
Checks fail → a resume round with the same worker (3 by default). A write outside the grant or a Spec gap is never retried:
it goes up the error chain to the main session, which decides it or, when it has major impact, asks the developer. All pass → a run result whose evidence is what the host observed.
workers/module.md: "The worker is untrusted in that its claims are proposals: only the host reads Git, audits, runs checks and records, after the worker ends."
-->

---
layout: reference
title: What checks the work
items:
  - { term: Configured checks (usually tests), desc: "commands in .concorde/checks — trusted input the work cannot rewrite" }
  - { term: Read-only check boundary, desc: "a bubblewrap sandbox: every write fails at the system call" }
  - { term: Write audit, desc: "git diff against the grant after every round, outside the worker" }
  - { term: Bound evidence, desc: "a result names the exact inputs it saw; changed inputs → stale_evidence" }
---

<!--
execution/checks/module.md ("a deterministic service … without model reasoning"), commands/delivery/module.md.
-->

---
layout: vs
title: Success, or a <em>diagnosis</em>
left:
  title: It is refused — why?
  items:
    - The work overreaches 
    - Implementaion is wrong 
    - "A Spec gap (unsufficient specification) "
    - Bad architecture design (AI does not get the necessary information easily, and it really tries hard to achieve what you asked, hitting the wall, usually means Low Cohesion and High Coupling) 
right:
  title: Given only what it needs, it succeeds
  items:
    - Done within its bounds
    - The agent didn't cheat
    - The Module split is largely sound
label: or
---

<!--
This is my reading of the design rather than a sentence from the Specs. The closest Protocol statement (protocol/module.md):
"a Module that matches how the project actually changes yields boundaries that fit real tasks:
a typical change needs one Module's write sets, not slices of five."
The four boundary cases (specs/concorde/dogfooding/module.md): "the tempting fix, loosening the boundary, is most often wrong."
Spec review also has a `context` dimension: a document the reviewer needed but was not given.
-->
