import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineCodeblockTransformer, defineTransformersSetup } from '@slidev/types'

// Renders ```d2 code blocks to SVG images with the d2 CLI, as Concorde's own Specs draw diagrams.
// Options go in braces after the language, e.g. ```d2 {h: 320, layout: elk, theme: 0}
//   h       height of the diagram on the slide in px (default: 340)
//   layout  d2 layout engine, dagre (default) or elk
//   theme   d2 base theme id (default: 0); PRELUDE overrides its colours
// Rendered SVGs are cached by content under .slidev/d2-cache.
// Every diagram gets PRELUDE first: tahta's brutalist palette (black, off-white, lime accent,
// hard edges) and the node classes slides use. Diagrams are drawn in Space Mono (fonts/, OFL),
// the brutalist display face, on a transparent background so they sit on the slide's grid.

const PRELUDE = `
vars: {
  d2-config: {
    theme-overrides: {
      N1: "#f2f2ee"; N2: "#d6d6d0"; N3: "#8d8d86"; N4: "#5c5c57"; N5: "#2c2c2c"; N6: "#161616"; N7: "transparent"
      B1: "#8d8d86"; B2: "#c8f135"; B3: "#5c5c57"; B4: "#2c2c2c"; B5: "#161616"; B6: "#0c0c0c"
      AA2: "#35e0f1"; AA4: "#2c2c2c"; AA5: "#0c0c0c"; AB4: "#2c2c2c"; AB5: "#0c0c0c"
    }
  }
}
classes: {
  agent: {style: {fill: "#0c0c0c"; stroke: "#35e0f1"; stroke-width: 2; border-radius: 0; font-color: "#f2f2ee"; font-size: 20}}
  program: {style: {fill: "#0c0c0c"; stroke: "#8d8d86"; stroke-width: 2; border-radius: 0; font-color: "#f2f2ee"; font-size: 20}}
  rejected: {style: {fill: "#0c0c0c"; stroke: "#ff5a3c"; stroke-dash: 4; stroke-width: 2; border-radius: 0; font-color: "#ff5a3c"; font-size: 20}}
  chosen: {style: {fill: "#c8f135"; stroke: "#c8f135"; stroke-width: 2; border-radius: 0; font-color: "#000000"; font-size: 20; bold: true}}
  layer: {style: {fill: "transparent"; stroke: "#5c5c57"; stroke-dash: 4; border-radius: 0; bold: true; font-color: "#8d8d86"; font-size: 20}}
  note: {shape: text; style: {font-color: "#8d8d86"; italic: true; font-size: 18}}
}
`

const CACHE = join(process.cwd(), '.slidev', 'd2-cache')
const FONTS = join(process.cwd(), 'fonts')
const FONT_ARGS = [
  '--font-regular', join(FONTS, 'SpaceMono-Regular.ttf'),
  '--font-bold', join(FONTS, 'SpaceMono-Bold.ttf'),
  '--font-semibold', join(FONTS, 'SpaceMono-Bold.ttf'),
  '--font-italic', join(FONTS, 'SpaceMono-Italic.ttf'),
]

function parseOptions(info: string): Record<string, string> {
  const inner = info.match(/\{(.*)\}/)?.[1] ?? ''
  return Object.fromEntries(
    inner.split(',').map(p => p.split(':').map(s => s.trim())).filter(p => p.length === 2 && p[0]),
  )
}

function render(code: string, layout: string, theme: string): string {
  const key = createHash('sha256').update(`${layout}|${theme}|${PRELUDE}|${code}`).digest('hex').slice(0, 16)
  const file = join(CACHE, `${key}.svg`)
  if (existsSync(file))
    return readFileSync(file, 'utf8')
  const svg = execFileSync('d2', ['--layout', layout, '--theme', theme, '--pad', '8', ...FONT_ARGS, '-', '-'], { input: PRELUDE + code })
    .toString()
    .replace(/^<\?xml[^>]*>/, '')
    .replace('preserveAspectRatio="xMinYMin meet"', 'preserveAspectRatio="xMidYMid meet"')
  mkdirSync(CACHE, { recursive: true })
  writeFileSync(file, svg)
  return svg
}

const d2 = defineCodeblockTransformer(({ info, code }) => {
  if (!/^d2\b/.test(info))
    return
  const o = parseOptions(info)
  const svg = render(code, o.layout ?? 'dagre', o.theme ?? '0')
  // An <img> keeps d2's own <style> and fonts out of the Vue template, which rejects <style> tags.
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  return `<div class="d2-diagram" style="height:${o.h ?? 340}px"><img src="${src}" alt="diagram"></div>`
})

export default defineTransformersSetup(() => ({ codeblocks: [d2] }))
