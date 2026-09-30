---
layout: section
index: "03"
kicker: Part three
title: When AI may cheat
subtitle: Checks it cannot talk its way past
---

---
layout: diagram
kicker: The rule
title: An agent's “done” is a <em>claim</em>
note: Concorde never takes a worker at its word. The host checks the claim itself — then retries it, escalates it, or records it as evidence.
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
kicker: Deterministic, not persuasive
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
