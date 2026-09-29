# Concorde presentation

Slides on Concorde's design and the reasons behind it, built with [Slidev](https://sli.dev).
`concorde/` is a git submodule of [FTOD/concorde](https://github.com/FTOD/concorde), the reference
every slide is drawn from.

```bash
git submodule update --init
npm install
npm run dev                       # live preview with hot reload, http://localhost:3030
npm run export                    # PDF (needs playwright-chromium, already a dev dependency)
npx slidev export --format png --output preview   # one PNG per slide, for review
```

- `slides.md` holds the deck; each slide's frontmatter can set `layout`, `zoom` or `class`.
- `style.css` holds the shared styles (context cards, level bands, workflow steps).
- To follow a newer Concorde, `git -C concorde pull origin main` and commit the submodule bump.
