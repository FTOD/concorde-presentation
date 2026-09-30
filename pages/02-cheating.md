---
layout: section
index: "02"
kicker: Part two
title: When AI may cheat
subtitle: Checks it cannot talk its way past
---

---
layout: diagram
kicker: The rule
title: An agent's “done” is a <em>claim</em>
note: The host, not the worker, reads Git, audits the writes and runs the checks. A failing check sends the same worker back; a Spec gap or an out-of-bounds write goes up, never retried.
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
kicker: Seven task types
title: Same Module, different jobs
items:
  - { term: understand, desc: "read the Specs; only the names of the code" }
  - { term: specify, desc: "write the Module's Specs — no code contents" }
  - { term: implement, desc: "write the Module's code — cannot change its Specs" }
  - { term: test · review, desc: "read the code, write nothing but a result" }
  - { term: code-to-spec, desc: "read code, write Specs — the one road for brownfield projects" }
---

<!--
protocol/boundaries.md. Writing a promise and realizing it are different jobs, so specify and implement never share a grant.
-->
