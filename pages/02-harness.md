---
layout: section
index: "02"
kicker: Part two
title: Specs are the harness
subtitle: What an agent may know and touch — computed, not asked for
---

---
layout: define
kicker: The method
term: Specs are the harness
definition: The <span class="accent2">Spec</span> is the shared source of truth — and the responsibility it gives each Module is the boundary of every AI agent.
points:
  - What an agent may read and write is computed from the Specs, not asked for
  - An agent's answer is checked by a program, not trusted
  - A missing promise stops the work instead of being guessed from code
---

<!--
The opening of specs/concorde/module.md. The rest of the talk unpacks these three lines.
-->

---
layout: diagram
kicker: Partition → permissions
title: The Spec splits the work — and the <em>permissions</em>
note: Each task works on some Modules with one task type; its grant is computed from the Specs, down to each file.
---

```d2 {h: 300}
direction: right
g: "Declared\ngraph" {class: program}
m: "Modules\nof the task" {class: program}
t: "Task\ntype" {class: program}
gr: "Grant\nnames · ro · rw" {class: chosen}
h: "Harness\nClaude Code · pi" {class: agent}
g -> m: selects
m -> t: combined
t -> gr
gr -> h: compiled
```

<!--
Read comes from dependency relations (uses, includes), write only from ownership — reading never becomes writing.
Selection is one level deep, never recursive. A file an unbound Module also binds is never made writable (shared_file).
-->

---
layout: reference
kicker: five task types
title: Same Module, different jobs
groups:
  - title: "Related Operations · concorde run …"
    items:
      - { term: understand, desc: "read the Specs; only the names of the code" }
      - { term: specify, desc: "write the Module's Specs — no code contents" }
      - { term: implement, desc: "write the Module's code — cannot change its Specs" }
      - { term: test · code_review, desc: "read the code, write nothing but a result" }
      - { term: code_to_spec, desc: "read code, write Specs — the one road for brownfield projects" }
---

<!--
Each row is a Protocol task type run by the Operation of the same name (specs/concorde/execution/operations/module.md):
review-code → code_review, review-spec → spec_review / spec_panel, code-to-spec → code_to_spec (and survey).
protocol/boundaries.md. Writing a promise and realizing it are different jobs, so specify and implement never share a grant.
-->

---
layout: diagram
kicker: One grant, two programs
title: Compiled into each program's <em>own</em> mechanism
---

```d2 {h: 300}
direction: right
gr: "Grant\nnames · ro · rw" {class: chosen}
cc: "Claude Code\nworker" {class: agent}
pi: "pi\nworker" {class: agent}
gr -> cc: "deny rules · reads\nwrite hook · writes\nBash sandbox · commands" {style: {font-color: "#f2f2ee"; font-size: 18; italic: false}}
gr -> pi: "permission extension · file tools\nsandbox-runtime · commands" {style: {font-color: "#f2f2ee"; font-size: 18; italic: false}}
```

<!--
Claude Code: deny rules limit reads, the write hook allows only the rw list, the Bash sandbox confines commands.
pi: the permission extension replaces the file tools and runs commands through sandbox-runtime.
specs/concorde/harness/module.md (Design). The same Harness also builds a task session's boundary from its task.
Outside both programs, the host's write audit compares every round's changes with the grant.
-->

---
layout: diagram
kicker: When AI may cheat
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
kicker: When AI may cheat
title: What checks the work
items:
  - { term: Configured checks, desc: "commands in .concorde/checks — trusted input the work cannot rewrite" }
  - { term: Read-only check boundary, desc: "a bubblewrap sandbox: every write fails at the system call" }
  - { term: Write audit, desc: "git diff against the grant after every round, outside the worker" }
  - { term: Validation & delivery, desc: "delivery never delivers what it did not validate in the same run" }
  - { term: Bound evidence, desc: "a result names the exact inputs it saw; changed inputs → stale_evidence" }
---

<!--
execution/checks/module.md ("a deterministic service … without model reasoning"), commands/delivery/module.md.
-->

---
layout: vs
kicker: Structure as a signal
title: Success, or a <em>diagnosis</em>
left:
  title: Given only what it needs, it succeeds
  items:
    - Done within its bounds
    - The agent didn't cheat
    - The Module split is largely sound
right:
  title: It is refused — why?
  items:
    - The work overreaches → do it another way
    - The Specs draw it wrong → fix the Specs
    - Concorde implements it wrong → bug report
    - Concorde's design blocks it → limitation
    - A Spec gap → name where it belongs
label: or
---

<!--
This is my reading of the design rather than a sentence from the Specs. The closest Protocol statement (protocol/module.md):
"a Module that matches how the project actually changes yields boundaries that fit real tasks:
a typical change needs one Module's write sets, not slices of five."
The four boundary cases (specs/concorde/dogfooding/module.md): "the tempting fix, loosening the boundary, is most often wrong."
Spec review also has a `context` dimension: a document the reviewer needed but was not given.
-->
