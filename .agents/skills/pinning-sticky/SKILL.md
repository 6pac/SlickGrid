---
name: pinning-sticky
description: Configure, document, review, or change SlickGrid permanent pinning and scroll-activated sticky docking.
---

# Pinning and Sticky Docking

Use this skill when configuring, documenting, reviewing, or changing SlickGrid permanent pinning
or scroll-activated sticky docking.

## Repository layout

This repository is the flat SlickGrid source tree, not the multi-package fork that supplied the
historical progress log. Use `src/` for library code, `examples/` for demos, `tests/` for unit
tests, and `cypress/e2e/` for browser tests. Paths such as `packages/common/`, `demos/vanilla/`,
or framework-specific demo packages belong to the source fork and are not local edit targets.

## Canonical configuration

- Use the nested `GridOption.pinning` shape for permanent pins:
  `columns.left/right` and `rows.top/bottom`.
- Column references may be numeric boundaries or explicit IDs/indexes. Explicit arrays may be
  non-contiguous, for example `columns.left: ['account', 'status']`.
- Row references may be indexes or `datasetIdPropertyName` values. An in-range numeric row
  reference is interpreted as an index first. Non-contiguous rows are valid, for example
  `rows.top: [0, 2, 4]`.
- `Column.pinned` is the per-column permanent-pin form. `Column.pinnable` only controls whether
  built-in pinning commands are exposed.
- Do not infer pinning from drag operations across center/pinned bands. Reordering stays within a
  band; pinning and unpinning are explicit through configuration, APIs, or menus.

## Sticky behavior

- Use `Column.sticky` and `GridOption.stickyRows` for scroll-activated docking. Sticky state is
  scroll-dependent and is not serialized in Grid State/Presets; permanent pinning is serialized.
- Multiple active top sticky rows stack in natural dataset order. They do not push each other out.
- Sticky row capacity uses the current viewport, not a fixed row count. The default row budget is
  60% of viewport height after permanent pinned rows are accounted for, and measured row heights
  determine how many candidates fit. `docking.maxRowViewportHeightPercent` and
  `docking.overflowStrategy` control this behavior.
- Permanent pinned rows remain part of the normal dataset height. When non-contiguous rows are
  pinned, unpinned rows are laid out contiguously so skipped indexes do not create blank gaps.

## Maintenance verification

When changing this feature:

1. Check the local interfaces and implementation first:
   `src/models/`, `src/slick.grid.ts`, `src/docking.controller.ts`, and
   `src/styles/_slick-docking.scss`.
2. Check the local documentation entry points, `docs/README.md` and `docs/TOC.md`. The
   fork-specific `docs/grid-functionalities/*` and `docs/migrations/*` pages are not present in
   this repository.
3. Add or update focused tests under `tests/`, then preserve the browser coverage under
   `cypress/e2e/` for pinning, sticky docking, resizing, editing, selection, grouping, spans,
   RTL, and variable row heights.
4. Treat `DockingController` as an internal implementation module; do not make it part of the
   public API without an explicit API decision.
5. Keep fast vertical-scroll blanking as a separate virtual-rendering task; do not conflate it
   with sticky-row activation or docking-layout refresh.

## Source documentation

- [Implementation progress](../../plans/pinning-sticky-progress.md)
- [Documentation README](../../../docs/README.md)
- [Documentation table of contents](../../../docs/TOC.md)
