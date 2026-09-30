---
layout: feature
kicker: The problems
title: When we develop with AIs...
class: tight
columns: 3
features:
  - { title: "What does it see?", desc: "Too much, or too little — then it guesses." }
  - { title: "What may it change?", desc: "Anything it can read. “Done” — unchecked." }
  - { title: "What should it do?", desc: "It infers promises from the code." }
  - { title: "What if it fails?", desc: "The reason is lost on the way up." }
  - { title: "How does it understand?", desc: "Every session starts from nothing." }
  - { title: "How human follows up?", desc: "It changes more than anyone can read." }
---

<!--
The first four are about the agent's environment — the harness. The last two are the two sides of one problem:
AI must understand the project, and people must keep up with what AI changes.
Code shows what is, not what is promised; a diff is not an understanding of the system; reviewing every step does not scale.
-->

---
layout: bigtype
hide: true
kicker: The idea
title: Both need a <em>stable intermediary</em> — the Spec.
---

<!--
The Spec, not the code, is what people and agents share. It changes more slowly than the code,
it says what is promised rather than what happens to be, and it is written to be read.
-->

---
layout: agenda
hide: true
title: What this talk covers
items:
  - { topic: The specs, desc: "one Spec, two facades, one Protocol" }
  - { topic: Specs are the harness, desc: "what an agent may know and touch, computed" }
  - { topic: When AI may cheat, desc: "checks it cannot talk its way past" }
  - { topic: Structure as a signal, desc: "what a bounded task says about the architecture" }
  - { topic: An agent-based framework, desc: "from task management down to workers — and loops in LangGraph" }
  - { topic: Agents improving Concorde, desc: "Issues, tracing, dogfooding" }
  - { topic: What I learned, desc: "Claude Code, pi, and building with agents" }
---
