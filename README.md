# Concorde presentation

Slides on how Concorde got its design — the problems met while building it, the approaches tried,
and what was kept and why — built with [Slidev](https://sli.dev). `concorde/` is a git submodule of
[FTOD/concorde](https://github.com/FTOD/concorde), the reference every slide is drawn from; each
slide's speaker notes cite the commits and Specs behind it.

```bash
git submodule update --init
npm install
npm run dev                       # live preview with hot reload, http://localhost:3030
npm run export                    # PDF (needs playwright-chromium, already a dev dependency)
npx slidev export --format png --output preview   # one PNG per slide, for review
npx tahta-lint pages/03-framework.md   # check one chapter against the theme's layout contract
```

- `slides.md` holds only the deck settings and the cover; each chapter is a file under `pages/`,
  pulled in with a `src:` slide, in order: `00-opening`, `01-specs`, `02-harness`,
  `03-framework`, `04-self-iteration`, `05-discussions`, `06-closing`. A chapter file is a
  run of slides, each starting with its own `---` frontmatter block. To add a chapter, create the
  file and add a `src:` slide for it in `slides.md`.
- The deck uses [tahta](https://tahta.cagdas.io) (`slidev-theme-tahta`) in its `brutalist` variant.
  Slides pick a tahta `layout` and fill its frontmatter; there is no custom slide styling. The
  theme's contract is `node_modules/slidev-theme-tahta/AGENTS.md`.
- Diagrams are D2, as in Concorde's own Specs. A ```` ```d2 {h: 300, layout: elk} ```` block is
  rendered at build time by `setup/transformers.ts`, which needs the `d2` CLI on `PATH`
  (https://d2lang.com). It prepends a brutalist palette and the node classes `agent`, `program`,
  `rejected`, `chosen`, `layer` and `note`, draws in Space Mono (`fonts/`, SIL Open Font License),
  and caches rendered SVGs in `.slidev/d2-cache`. `style.css` only sizes these diagrams.
  `tahta-lint` warns that `diagram` slides have no Mermaid block; that is expected.
- To follow a newer Concorde, `git -C concorde pull origin main` and commit the submodule bump.
