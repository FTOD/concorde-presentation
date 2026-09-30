---
layout: section
index: "05"
kicker: Part five
title: Discussions
---

---
layout: diagram
kicker: Agent orchestration today
title: Harnesses and frameworks are <em>converging</em>
note: You should start building your loop/graph
---

```d2 {h: 250, layout: elk}
direction: right
lg: "LangGraph\nflexible · low-level" {class: program}
mid: "Meeting\nin the middle" {class: chosen}
cc: "Claude Code · Codex — ready-made harness" {
  class: layer
  grid-rows: 3
  vertical-gap: 24
  wf: "workflow scripts → determinism" {class: program}
  hk: "hooks → constraints" {class: program}
  gap: "✗ subagents: no OS sandbox" {class: rejected}
}
lg -> mid: "Deep Agents:\nsimpler, less flexible" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
mid <- cc: "more customizable" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
```

<!--
My read of the landscape, not a claim from the Concorde repository: LangGraph now ships Deep Agents, a higher-level harness
with less flexibility and a simpler start; Claude Code and Codex keep adding hooks, SDKs, workflows and plugins so users can
customize more. The two ends are moving toward each other.
Merged from the former "Workflows + subagents already orchestrate" slide:
Much of what a low-level framework like LangGraph offers, a harness can now do: a workflow script gives a deterministic
procedure, and hooks constrain or supplement the model's interaction with the outside. The main gap is isolation — a subagent
is not its own process, so it cannot get an OS-level sandbox of its own. That is why Concorde's workers are separate processes.
-->

---
layout: diagram
kicker: Closing the gap
title: Independent sessions, <em>talking to each other</em>
note: Each session is its own process with its own OS sandbox; cross-session messaging connects them. When a delivered task is merged and closed, Concorde removes its sessions itself — the list never gets noisy.
---

```d2 {h: 300}
direction: right
main: "Main session" {class: agent}
s: "independent sessions — one process each" {
  class: layer
  direction: down
  t1: "Session · own OS sandbox" {class: agent}
  t2: "Session · own OS sandbox" {class: agent}
  t3: "Session · own OS sandbox" {class: agent}
}
close: "Concorde\ntask merged & closed" {class: program}
ui: "Claude Code\nsession list" {class: chosen}
main <-> s.t1
main <-> s.t2: "messages" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
main <-> s.t3
s -> close: "delivered" {style: {font-color: "#f2f2ee"; italic: false; font-size: 20}}
close -> ui: "claude rm" {style: {stroke: "#c8f135"; stroke-dash: 4; font-color: "#c8f135"; italic: false; font-size: 20}}
```

<!--
Concorde's task sessions are background Claude Code sessions (claude --bg); they report with SendMessage (cross-session messaging).
At task close Concorde copies each session's transcript into its trace and removes it from Claude's session list (claude rm,
9447c86f) — "ended ones are noise in Claude's session list".
Earlier notes on Claude Code's toolbox:
Vendored docs: "A subagent runs in the parent session's permission mode". Resume under -p gives a new session id each round.
25b789de: a --bg session "is never woken by the channel event of a wait it registered" (Claude Code 2.1.284).
d4b64e8e: task sessions use auto mode; bypassPermissions in a background session needs a one-time disclaimer.
-->

---
layout: feature
kicker: AI rarely achieves what you really want in one round
title: <em>Observability</em> is what makes it possible
columns: 3
features:
  - {
      icon: "lucide:scan-search",
      title: Detailed traces,
      desc: "AI reads what happened — every level, its cost, its transcript — to find
        what went wrong"
    }
  - {
      icon: "lucide:link",
      title: Error chains,
      desc: "when AI delegates to AI, each level adds why it stopped; the story never
        gets lost"
    }
  - {
      icon: "lucide:book-open",
      title: A good architecture fondation,
      desc: "a human readable interface for developer to control the architecture"
    }
---

<!--
Concorde can improve itself because it can see itself.
1. Traces (Tracing): one tree per task, from the task down to each worker round, with status, cost, model and the transcripts,
   grants and check logs. An agent investigating a failure reads what actually happened instead of guessing.
2. Error chains: with hierarchical agents (main agent → task session → Operation → worker), a failure climbs level by level;
   each level adds one link saying why it could not handle it and keeps the causes unchanged — no summaries, no drift.
   A defect report carries the whole chain back to the Concorde repository.
3. Architecture and Spec: the Specs describe the system in a form people (and agents) can read, so an observed failure can be
   placed in the right Module and fixed there — the boundary cases of dogfooding depend on it.
-->

---
layout: define
kicker: Long-running autonomy
term: Autonomy is triage
definition: Know what AI can settle <span class="accent2">on its own</span> — and when it must stop and ask you.
points:
  - "The policy is not given: it depends on the model's ability and on your project"
  - "Learn it on real tasks — AI plus some human review, which needs observability"
  - "Too much autonomy: a big ball of mud — and you no longer know what your project does"
  - "Longer is not better: a night of work alone is not a better result"
---

<!--
The key to long autonomous runs is triage: which situations the AI may handle alone, and which need you.
That policy does not exist up front — it depends on what the model can do and on the project. Find it by running real
tasks with AI plus partial human review, and by looking at what happened (traces, error chains): that is why observability
comes first. Concorde writes its policy down as the main session's escalation policy: ordinary decisions are taken and
logged, decisions with major impact go to the developer, all at once.
Too much autonomy gives you a big ball of mud and a project whose direction you no longer know.
And a long run is not a good run by itself — "the AI worked all night" says nothing about the result.
-->

---
layout: diagram
kicker: You are accumulating non-determinism
title: Building with AI · don't let AI decide the entire architecture
note: "AI did not realize that i was on the wrong path"
---

```d2 {h: 380}
grid-rows: 3
grid-columns: 5
horizontal-gap: 12
vertical-gap: 16
m1: "." {shape: rectangle; width: 560; style: {fill: transparent; stroke: transparent; font-color: transparent; font-size: 26}}
m2: "GPT-6 Astra\nSep 3 ▼" {shape: rectangle; width: 400; style: {fill: transparent; stroke: transparent; font-color: "#35e0f1"; font-size: 26; bold: true}}
m3: "Claude Opus 5.5\nSep 22 ▼" {shape: rectangle; width: 480; style: {fill: transparent; stroke: transparent; font-color: "#35e0f1"; font-size: 26; bold: true}}
m4: "." {shape: rectangle; width: 160; style: {fill: transparent; stroke: transparent; font-color: transparent; font-size: 26}}
m5: "." {shape: rectangle; width: 400; style: {fill: transparent; stroke: transparent; font-color: transparent; font-size: 26}}
p1: "Aug 19 – Sep 1\n14 days · 89 commits\n152k lines\n14% alive" {class: rejected; width: 560; height: 260; style.font-size: 30}
p2: "Sep 2 – 11\n10 days · 218 commits\n167k lines\n2% alive" {class: rejected; width: 400; height: 260; style.font-size: 30}
p3: "Sep 12 – 23\n12 days · 175 commits\n266k lines\n8% alive" {class: rejected; width: 480; height: 260; style.font-size: 30}
p4: "Sep 24\n−87k" {class: program; width: 160; height: 260; style.font-size: 30}
p5: "Sep 25 – 30\n6 days · 677 commits\n130k lines\n64% alive" {class: chosen; width: 400; height: 260; style.font-size: 30}
n1: "Spec Kit extension →\nstandalone; module specs" {class: note; width: 560; style.font-size: 26}
n2: "Protocol v1 → v10;\nthree Module kinds → one" {class: note; width: 400; style.font-size: 26}
n3: "LangGraph everywhere;\npi the only runtime" {class: note; width: 480; style.font-size: 26}
n4: "reset" {class: note; width: 160; style.font-size: 26}
n5: "task sessions, tracing;\nClaude Code + pi split" {class: note; width: 400; style.font-size: 26}
```

<!--
Model releases marked above the timeline: GPT-6 Astra on Sep 3, 2026 (staged rollout, API id gpt-6-astra);
Claude Opus 5.5 on Sep 22, 2026. Markers sit over the period they fall in, not at the exact day.
The core point: when AI builds a system whose parts are themselves AI, the non-determinism compounds — the model that
designs, the model that implements, the models that run inside. Mechanisms can be checked; architecture cannot. The
architecture (what the parts are, how they split, which platform they run on) is where over-relying on AI costs the most —
don't let AI decide it entirely.
The evidence — most of the first five weeks was thrown away. "42 days" is the whole project, Aug 19 – Sep 30; "36" is Aug 19 – Sep 23.
Work after the reset looks far more stable, though younger code has had less time to be replaced — the 2% vs 64% gap is too wide for that to explain.
Counted with git blame at d4e06d98 over code, Specs, Protocol, prompts and docs (excluding vendored references,
generated files and tool output):
- Aug 19 – Sep 23: 482 commits, 585k lines added, 46k (7.9%) still alive today.
  Aug 19 – Sep 1: 14% survive · Sep 2 – 11: 2% · Sep 12 – 23: 8%.
- Sep 24 (the reset): 29 commits; 87k lines deleted in one commit (6b8e150e).
- Sep 25 – 30: 677 commits, 130k lines added, 64% still alive.
Direction changes behind the churn: a Spec Kit extension → standalone (Sep 2); module-centered specs (Sep 1, −47k lines);
Domain/Service/Module kinds → one Module kind (Sep 6–9); 15 Protocol major versions; every orchestration a LangGraph flow
(Sep 12–17) → removed (Sep 20–24); pi as the only runtime (Sep 15) → removed (Sep 24) → back as a worker backend (Sep 25).
Not all of it was waste — the early attempts taught what to keep. Attributing the wrong turns to leaning on AI for the architecture
is my judgment, not something the history records.
-->
