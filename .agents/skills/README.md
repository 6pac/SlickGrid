# Repository AI Skills

Portable project skills live under `.agents/skills/<skill-name>/SKILL.md` and can be discovered
by Cursor and other Agent Skills-compatible tools.

Available portable skills

- [`pinning-sticky/SKILL.md`](pinning-sticky/SKILL.md) — configuration and maintenance guidance
  for permanent pinning and sticky docking.

New cross-agent skills should use the portable structure above.

One skill is published with the documentation site instead, because it is meant for agents working on
applications that use SlickGrid rather than on this repository:

- [`docs/public/skills/slickgrid-v6-migration/SKILL.md`](../../docs/public/skills/slickgrid-v6-migration/SKILL.md)
  — migrating an application to v6. It defers every mapping to `docs/migration/v6.md` and only adds
  working rules, so it needs no update for a new section of the guide.

Project implementation plans live under `.agents/plans/`:

- [`pinning-sticky-progress.md`](../plans/pinning-sticky-progress.md)
