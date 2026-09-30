---
layout: feature
kicker: The problem
title: Let an AI agent change a real project
columns: 4
features:
  - { icon: "lucide:eye", title: "What does it see?", desc: "Too much, or too little — then it guesses." }
  - { icon: "lucide:pencil", title: "What may it change?", desc: "Anything it can read. “Done” — unchecked." }
  - { icon: "lucide:book-open", title: "What should it do?", desc: "It infers promises from the code." }
  - { icon: "lucide:siren", title: "What if it fails?", desc: "The reason is lost on the way up." }
---

<!--
None of these are about model capability. They are about the environment the agent works in — the harness.
-->

---
layout: vs
kicker: Two sides of one problem
title: Who understands the project?
left:
  title: People must keep up with AI
  items:
    - AI changes code faster than anyone reads it
    - A diff is not an understanding of the system
    - Reviewing every step does not scale
right:
  title: AI must understand the project
  items:
    - Every session starts knowing nothing
    - Code shows what is, not what is promised
    - The same word means different things in different files
label: ↔
---

---
layout: bigtype
kicker: The idea
title: Both need a <em>stable intermediary</em> — the Spec.
---

<!--
The Spec, not the code, is what people and agents share. It changes more slowly than the code,
it says what is promised rather than what happens to be, and it is written to be read.
-->

---
layout: reference
kicker: What the Spec Protocol designs against
title: Four failures, named
items:
  - { term: Inferred promises, desc: "a file name or nearby text suggests it, so it's treated as promised" }
  - { term: Meaning drift, desc: "one word, different meanings in different places" }
  - { term: Authority creep, desc: "read access quietly becomes write access" }
  - { term: Fabricated evidence, desc: "“tests pass” claimed rather than observed" }
---

<!--
protocol/principles.md. Every rule of the Protocol answers one of these.
-->

---
layout: define
kicker: The method
term: Specs are the harness
definition: The <span class="accent2">Spec</span> is the shared source of truth — and the responsibility it gives each Module is the boundary of every agent working on it.
points:
  - What an agent may read and write is computed from the Specs, not asked for
  - An agent's answer is checked by a program, not trusted
  - A missing promise stops the work instead of being guessed from code
---

<!--
The opening of specs/concorde/module.md. The rest of the talk unpacks these three lines.
-->

---
layout: agenda
title: What this talk covers
items:
  - { topic: A stable intermediary, desc: "one Spec, two facades, one Protocol" }
  - { topic: When AI may cheat, desc: "deterministic checks and computed permissions" }
  - { topic: Structure as a signal, desc: "what a bounded task says about the architecture" }
  - { topic: Agent-based tooling, desc: "sessions, tasks, levels — and loops in LangGraph" }
  - { topic: Agents improving Concorde, desc: "Issues, tracing, dogfooding" }
  - { topic: What I learned, desc: "Claude Code, pi, and building with agents" }
---
