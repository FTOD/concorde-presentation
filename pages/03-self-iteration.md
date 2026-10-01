---
layout: section
index: "03"
title: RSI with Concorde
subtitle: Improving Concorde on real projects — and Concorde itself
---

---
layout: diagram
title: Concorde is developed <em>with Concorde</em>
---

```d2 {h: 300}
grid-rows: 2
grid-columns: 2
horizontal-gap: 260
vertical-gap: 140
spec: "Concorde's own Specs\nspecs/concorde" {class: chosen}
main: "Main agent" {class: agent}
merge: "task merge\nbuild · spec-validation" {class: program}
task: "Task session + workers\nthe branch's own concorde" {class: agent}
spec -> main: "read by" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
main -> task: "every change is a task" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
task -> merge: "delivered" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
merge -> spec: "the new Concorde develops the next change" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; italic: false; font-size: 20}}
```

<!--
The Concorde checkout's CLAUDE.md: the main agent stays in the primary worktree and hands every change of Spec meaning or
code behaviour to a task session; it merges only with `task merge --check build --check spec-validation`.
specs/concorde/module.md: where a task's commands run with the branch's own copy of the Framework, "as in Concorde's own source
checkout, their success is self-validation, which is why a merge there runs the build and spec-validation once more on the
primary branch".
RSI = recursive self-improvement: Concorde improves itself with itself, and from what it sees on real projects (dogfooding).
-->

---
layout: stats
title: Six weeks, mostly by its own tasks
stats:
  - { value: 1624, label: commits in 44 days, icon: "lucide:git-branch" }
  - { value: 243, label: tasks delivered, icon: "lucide:check" }
  - { value: 667, unit: k, label: lines of code changed, icon: "lucide:code" }
  - { value: 1.6, unit: GB, label: of agent logs, icon: "lucide:scroll-text" }
---

<!--
Counted at concorde bea6631b (Oct 2), history Aug 19 – Oct 2:
- 1,624 commits; 243 "concorde: deliver" commits (delivered tasks); 226 decision logs committed; 183 Issues.
- Code: +379k / −288k = 667k lines changed in Python, TypeScript, JavaScript and shell, excluding generated/, references/
  (vendored docs and sources) and installed tool output (.agents/); renamed files counted. The code today is about 91k lines.
  Specs and Protocol: another 520k lines changed.
- Logs: 1.26 GB of Claude Code session transcripts (main session + task sessions) and 312 MB of Concorde's own records
  (.concorde/history, unbound runs, decision logs: traces, worker transcripts, check logs). Older transcripts may already have
  been pruned, so this is a floor.
-->

---
layout: diagram
title: Use it on a real project, <em>let it report</em>
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
title: What makes self-improvement possible
columns:
  - { title: Tracing & Issue management, items: ["Every step: task → session → run → worker round", "Tokens, cost, time and model of each", "Transcripts, grants, check logs, error chains", "Dedicated Issue system for continous improving"] }
  - { title: Dogfooding & E2E, items: ["Develop installs on real projects", "SWE-bench repositories, real agents"] }
---

<!--
Planted bugs = dogfood scenarios (specs/concorde/e2e/dogfood/module.md): inject one known fault into a clone of Concorde,
develop-install it into a real project, run a headless main session with an ordinary request, then check what it left behind.
First scenario, write-hook-rw-directories: the fault makes the write hook, pi's write check and the Bash sandbox ignore
writable directory entries, so an implement worker is refused src/requests/models.py although its grant allows it.
The request: add Response.is_informational to psf/requests v2.32.3 through the implement Operation. Expected: a defect report
of type bug whose basis names "Concorde implements the boundary wrongly", and src/requests/models.py unchanged — the agent
reported the bug instead of working around it.
What is traced (tracing/module.md): one trace node per level — the task, each task session, each merge attempt, the workflow
and its steps, each run of an Operation or command, each check, each worker run and each of its rounds — nested in one tree per task.
Each node records its status and times, its own usage (tokens in/out/cache, cost, turns, duration), metadata (Modules, task type,
backend, model, reasoning level, commit, grant and brief digests) and its files by path + digest: transcripts, briefs, grants,
check logs, run results. A failed node carries its error link. `concorde trace show <task>` rolls cost up over any subtree.
Error chain (owned by Tracing): a failure travels up the levels; each level that cannot handle it adds one link — what failed,
the evidence, what it tried, and why it cannot handle it (permission, decision, scope, capability, exhausted, environment, input) —
and keeps the causes it received unchanged. No summaries, so the story never drifts. A defect report from dogfooding carries the
whole chain, so the Concorde repository sees the full path from the failing check to the report.
tracing/module.md: "what ran, where, on which model, for how long, at what cost and with what outcome, from a whole task down to one round of one worker."
-->
