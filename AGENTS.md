# Repository Agent Instructions

## Pull requests

- Use `.github/pull_request_template.md` when preparing pull request titles and
  descriptions, including drafts provided to the user.
- Present the PR title and description in separate Markdown code blocks so each
  can be copied independently.

## Generated files

- Everything under `dist/` is build output. Never write or hand-edit those files:
  produce them by running the project build (`npm run build:prod`) instead.
- `dist/` is refreshed on release commits, so keep it out of feature and fix
  commits even after a local build has rewritten it.
- The build output itself is disposable. It is regenerated from `src/` at any
  time, so there is nothing in `dist/` worth preserving across a rebuild.
