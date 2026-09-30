---
layout: section
index: "04"
kicker: Part four
title: Structure as a signal
subtitle: What a bounded task says about the architecture
---

---
layout: bigtype
title: Succeeds with <em>only what it needs</em>?
subtitle: Then the agent didn't cheat — and the project's Module split is largely sound.
---

<!--
This is my reading of the design rather than a sentence from the Specs. The closest Protocol statement (protocol/module.md):
"a Module that matches how the project actually changes yields boundaries that fit real tasks:
a typical change needs one Module's write sets, not slices of five."
-->

---
layout: reference
kicker: When it doesn't
title: A refused read is a <em>diagnosis</em>
items:
  - { term: The work overreaches, desc: "the goal doesn't need that access — do it another way" }
  - { term: The Specs draw it wrong, desc: "fix the Specs: a gap Issue and a task — the architecture changes" }
  - { term: Concorde implements it wrong, desc: "a bug report to the Concorde repository" }
  - { term: Concorde's design blocks it, desc: "a limitation report — the developer decides" }
  - { term: A Spec gap, desc: "a promise the goal needs is missing — say where it belongs" }
---

<!--
The four boundary cases (specs/concorde/dogfooding/module.md): "the tempting fix, loosening the boundary, is most often wrong."
Spec review also has a `context` dimension: a document the reviewer needed but was not given.
-->
