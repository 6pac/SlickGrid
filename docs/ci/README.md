# CI & deployment (prepared, not wired)

Nothing here is active yet. These files are ready to drop in when you decide to publish.

## To publish the docs on GitHub Pages

1. Move the whole `site/` folder into the repo as `docs/` (see the relocation note in `../../DOCUMENTATION-PLAN.md`).
2. Copy `github-pages.yml` to `.github/workflows/docs.yml`.
3. In the repo settings, set **Pages → Build and deployment → Source = GitHub Actions**.
4. Confirm the base path in the workflow (`DOCS_BASE`) matches your Pages URL (e.g. `/SlickGrid/`).

The workflow regenerates the API reference from `src/`, runs the drift gate, builds, and deploys.

## The drift gate

`npm run drift` regenerates `data/api.json` from the TypeScript source and lists any
public option / column / event / method that has no JSDoc description. `-- --strict`
makes it exit non-zero when a **new** undocumented symbol appears (compared with
`tools/gaps-baseline.json`). This keeps the reference from silently going stale.

- Bootstrap or refresh the baseline: `npm run drift -- --update-baseline`
- The right fix for a flagged symbol is a JSDoc comment in the source, not a baseline entry.

## Local commands

- `npm run api` — regenerate the reference data from source.
- `npm run drift` — report undocumented public API.
- `npm run docs:dev` — live preview.
- `npm run docs:build` / `npm run docs:preview` — production build and preview.
