# Repository Agent Instructions

## Generated files

- Everything under `dist/` is build output. Never write or hand-edit those files:
  produce them by running the project build (`npm run build:prod`) instead.
- `dist/` is refreshed on release commits, so keep it out of feature and fix
  commits even after a local build has rewritten it.
- The build output itself is disposable. It is regenerated from `src/` at any
  time, so there is nothing in `dist/` worth preserving across a rebuild.
