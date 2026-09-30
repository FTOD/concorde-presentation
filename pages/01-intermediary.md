---
layout: section
index: "01"
kicker: Part one
title: A stable intermediary
subtitle: One Spec, a facade for people and a facade for agents
---

---
layout: diagram
kicker: Two facades
title: One Spec, read <em>two ways</em>
note: People read a docsite that grants nothing and proves nothing. Agents get the same Specs as computed context, a grant and an MCP server — every answer is Spec core's.
---

```d2 {h: 300}
direction: right
people: People {class: program}
views: "Docsite\n(Views)" {class: program}
spec: "Spec\none declared graph" {class: chosen}
ctx: "Context · grant\nspec-mcp" {class: program}
agents: Agents {class: agent}
people <- views <- spec -> ctx -> agents
```

<!--
Views: "A published page only views the Specs — no context granted, no Spec changed, nothing proved about the code."
spec-mcp: "adds no rule of its own — every answer is Spec core's" (tools: modules, module, context, impact, boundary, validate).
-->

---
layout: columns
kicker: What each side gets
title: Written for people, computed for agents
columns:
  - { title: For people, items: ["Purpose, core concepts, overview diagrams, details", "Goal: understand the project without reading code", "A docsite of Modules and how they fit together"] }
  - { title: For agents, items: ["Context computed from declared relations", "A grant per file: names · ro · rw", "spec-mcp: modules, context, impact, boundary"] }
---

<!--
protocol/principles.md, "Two purposes": Understanding — "a human never needs to read the code to understand the project";
Boundaries — "a harness … can derive from the specification exactly what the task may read and what it may write".
"A Module that a human can understand as one responsibility is also the natural unit of a task."
-->

---
layout: define
kicker: The standard
term: Spec Protocol
definition: A way to describe a project as <span class="accent2">one declared graph</span> — usable with or without Concorde.
points:
  - A Module is one responsibility, not a folder or a package
  - Typed relations, each declared once; one glossary for every term
  - Read and write sets computed per task type — never written by hand
  - Diagrams in D2, next to the prose they explain
---

<!--
protocol/README.md: "the specification is one graph of declared nodes and relations, from which read sets, write sets, views and checks are computed."
Version 15.1 (Sep 30): no required entry sections; recommended order purpose → core concepts → overview → details.
-->
