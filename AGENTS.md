# Repository Agent Instructions

## Generated files

- Never create, edit, or otherwise modify anything under `dist/`.
- The `dist/` folder contains dynamically generated build artifacts and must be
  left untouched, including when running builds or verification commands.
- When generated output is needed for validation, write it to a temporary
  location outside the repository, such as `/tmp`, or use a source-only check.
- Preserve any existing user changes under `dist/`; do not reset, clean, or
  overwrite them.
