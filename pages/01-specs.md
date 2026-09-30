---
layout: section
index: "01"
kicker: Part one
title: The Specs
subtitle: One Spec, a facade for people and a facade for agents
---

---
layout: define
kicker: The standard
term: Spec Protocol
definition: A way to describe a project as <span class="accent2">one declared graph</span> — usable with or without Concorde.
points:
  - "A Module is not just an description, but also one responsibility"
  - Checks (tests) hooked to the specs, traceable when something's off
  - Typed relations among the codes, docs, and other all files, so read and write sets computed per task type — Agents get their scope
  - Prompts for AI to write it and review it
---

<!--
protocol/README.md: "the specification is one graph of declared nodes and relations, from which read sets, write sets, views and checks are computed."
Version 15.1 (Sep 30): no required entry sections; recommended order purpose → core concepts → overview → details.
Version 16.0 (Sep 30): pending realization entries dropped.
-->

---
layout: diagram
kicker: The design
title: A Spec is <em>one declared graph</em>
---

```d2 {h: 260}
direction: right
m: "Module · one responsibility" {
  class: layer
  direction: down
  doc: "documents\nentry · requirements\nscenarios · contracts" {class: chosen}
  r: "realization" {class: program}
}
sub: "child Module" {class: program}
prov: "provider Module" {class: program}
code: "code files" {class: program}
tests: "checks (tests)" {class: program}
m -> sub: contains
m -> prov: "uses · includes"
m.r -> code: binds
tests -> m.doc: verifies
```

<!--
protocol/model.md: seven node types — module, document, concept, realization, requirement, scenario, contract.
protocol/relations.md groups the relations: ownership and collaboration (owns, defines, contains, uses), context (includes),
realization (binds), interfaces and evidence (participates, verifies).
A file name, a folder or an undeclared diagram never creates a relation (axiom A2). Tests point at scenarios; the Spec never lists its tests.
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
layout: diagram
kicker: How it is used
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
