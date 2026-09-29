# SlickGrid documentation

These are the contributor-facing documentation pages for SlickGrid. The site is built with [VitePress](https://vitepress.dev/); its configuration, theme, scripts, and dependencies live separately in [`../vitepress/`](../vitepress/).

The site has three sections — **Introduction**, **In-depth**, and **Reference** — and the Reference is **generated from the TypeScript source** (`../src`) so it cannot drift out of date.

## Local development

```bash
cd vitepress
npm install
npm run api       # generate ../docs/data/api.json from ../src
npm run docs:dev  # start the dev server
```

## Commands

- `npm run api` — regenerate `../docs/data/api.json` from the TypeScript source (`../src`).
- `npm run drift` — report public options/methods/events that have no JSDoc or overlay (`-- --strict` fails on new ones).
- `npm run links` — validate internal links and reference anchors.
- `npm run docs:build` — production build (runs `api` first) into `.vitepress/dist`.
- `npm run docs:preview` — preview the production build.

## How the Reference works

`../vitepress/tools/extract-api.mjs` walks `../src` with ts-morph and writes `data/api.json` (grid/DataView options, column properties, events with resolved arg types, methods grouped by their source sections, plus plugins, controls, core classes and enums). Hand-written prose and examples live in `data/overlays.json`, keyed by `area:entry-id`, and are merged at render time so they survive regeneration. The custom reference view (`../vitepress/.vitepress/theme/ReferenceArea.vue`) renders one long scroll-spy page per area with a Section / A–Z toggle.

## Deployment

The active GitHub Pages workflow is [`../.github/workflows/docs.yml`](../.github/workflows/docs.yml). It rebuilds the site when `docs/`, `src/`, or `vitepress/` changes. Set `DOCS_BASE` in that workflow to match the Pages path (for a project site at `https://6pac.github.io/SlickGrid/` use `/SlickGrid/`).

## Notes

- `data/api.json` is generated; it is committed as a convenience snapshot and regenerated on every build.
- `_legacy/` holds the previous `docs/` files (kept for reference; not part of the built site).
