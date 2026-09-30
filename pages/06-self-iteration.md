---
layout: section
index: "06"
kicker: Part six
title: Agents improving Concorde
subtitle: Issues, tracing, dogfooding
---

---
layout: diagram
kicker: Dogfooding
title: Use it on a real project, <em>let it report</em>
note: The project's main agent only observes and reports; every fix is ordinary work in the Concorde repository, and the project takes it with an update.
---

```d2 {h: 300}
direction: right
p: "Project\n(develop install)" {class: program}
m: "Main agent\nobserves" {class: agent}
i: "Defect report\n(Issue)" {class: chosen}
c: "Concorde repo\ntask + fix" {class: agent}
p -> m -> i -> c
c -> p: update {style.stroke-dash: 3}
```

<!--
specs/concorde/dogfooding/module.md. E2E runs installed Concorde on SWE-bench repositories with real agents.
-->

---
layout: columns
kicker: The feedback loop
title: What makes self-improvement possible
columns:
  - { title: Issues, items: ["One file per problem, branch-local", "Reports: bug · gap · limitation", "Recording never stops the work"] }
  - { title: Tracing, items: ["Every level leaves a node", "One tree per task, each with its cost", "concorde trace show <task>"] }
  - { title: Dogfooding & E2E, items: ["Develop installs on real projects", "SWE-bench repositories, real agents", "Injected faults with expected reports"] }
---

<!--
tracing/module.md: "what ran, where, on which model, for how long, at what cost and with what outcome, from a whole task down to one round of one worker."
-->

---
layout: stats
kicker: Concorde builds Concorde
title: Six weeks, mostly by its own tasks
stats:
  - { value: 1131, label: commits since Aug 19, icon: "lucide:git-branch" }
  - { value: 206, label: tasks delivered, icon: "lucide:check" }
  - { value: 187, label: decision logs kept, icon: "lucide:notebook-pen" }
  - { value: 15.1, label: Spec Protocol version, icon: "lucide:layers" }
---

<!--
Counts at f6e1723e: "concorde: deliver" commits, files in .concorde/decisions/.
-->

---
layout: reference
kicker: Found by its own runs
title: Defects agents reported
items:
  - { term: A dead run shown as running, desc: "a sandboxed runner recorded PID 2 — on the host, kthreadd" }
  - { term: A worker counted as a run, desc: "a develop install of psf/requests reported three defects at once" }
  - { term: 18 phantom findings, desc: "bubblewrap's /dev/null placeholders looked like unbound files" }
  - { term: A report nobody received, desc: "SendMessage to a main session whose name had changed" }
---

<!--
e0eeda37 (run lock, not PID), 09daf369 (three defects from a develop install), 110272aa / I-35a33208 (placeholders),
I-2dd7448e (open: "No agent named 'concorde-a2' is reachable"; the task session went idle).
-->
