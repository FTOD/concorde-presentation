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
