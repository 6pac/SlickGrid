---
name: pinning-sticky
description: Configure, document, review, or change SlickGrid permanent pinning and scroll-activated sticky docking.
---

# Pinning and Sticky Docking

Use this skill when configuring, documenting, reviewing, or changing SlickGrid permanent pinning
or scroll-activated sticky docking. The user-facing reference is `docs/pinning-sticky.md`; keep
it and this file in agreement.

## Repository layout

This repository is the flat SlickGrid source tree. Use `src/` for library code, `examples/` for
demos and `cypress/e2e/` for browser tests. There is no unit-test runner; `tests/` holds legacy
manual benchmark pages. Paths such as `packages/common/`, `demos/vanilla/` or framework demo
packages belong to the slickgrid-universal fork and do not exist here.

## Canonical configuration

- Use the nested `GridOption.pinning` shape for permanent pins:
  `columns.left/right` and `rows.top/bottom`.
- Column references: a number is an inclusive left boundary or a right count over the visible
  columns; an array holds column indexes (numbers) and/or column ids (strings) and may be
  non-contiguous, for example `columns.left: ['account', 'status']`.
- Row references take three forms: a number is always a row index, a string is a dataset id, and
  `{ id: <value> }` is a dataset id of any type, which is how a grid with numeric ids pins by id.
  Id references follow their row through a sort or filter; index references do not, so a caller
  pinning a positional row such as the last one must recompute it when the row count changes.
  Non-contiguous rows are valid, for example `rows.top: [0, 2, 4]`.
- `setOptions({ pinning: null })` and `setOptions({ pinning: undefined })` both clear pinning.
- `Column.pinned` is the per-column permanent-pin form and is kept in sync with the option.
  There is no `Column.pinnable`; menus are application code built on `setColumnPinning()`.
- Reordering stays within a band; pinning and unpinning are explicit through configuration, the
  runtime API or application menus. Never infer pinning from a drag across bands.

## Sticky behavior

- Use `Column.sticky` and `GridOption.stickyRows` for scroll-activated docking. Sticky state is
  scroll-dependent and is never serialized; permanent pinning is what an application persists.
- Multiple active top sticky rows stack in natural dataset order. They do not push each other out.
- Sticky row capacity uses the current viewport, not a fixed row count. The default row budget is
  60% of viewport height after permanent pinned rows are accounted for, and measured row heights
  determine how many candidates fit. `docking.maxRowViewportHeightPercent` and
  `docking.overflowStrategy` control this behavior.
- Permanent pinned rows keep their slot in the dataset height; rows after a pin are rendered so
  the pinned slot collapses under the band, and the last scrolling row stays reachable.
- Both bands nest the same way: permanent rows sit at the outer edge and active sticky rows stack
  inside them, so a sticky bottom row sits above a permanently pinned bottom row.
- `docking.stickyActivationBuffer` (default 2px) is the column activation buffer; rows dock on the
  exact boundary.
- Pinning and sticky docking work in both reading directions. The band names follow the reading
  order, not the screen: `left` is the leading band and renders at the right edge of an RTL grid,
  `right` is the trailing band. `sticky: true` docks at the leading band either way, so the same
  options describe both directions. Distances inside the docking code are measured along the
  inline axis; `getInlineDirection()` converts them to physical pixels where a style needs one.

## Maintenance verification

When changing this feature:

1. Check the local interfaces and implementation first:
   `src/models/docking.interface.ts`, `src/models/gridOption.interface.ts`, `src/slick.grid.ts`
   (rendering, scrolling, hit-testing, options), `src/slick.core.ts` (`DockingController`), and
   `src/styles/_slick-docking.scss`.
2. Update `docs/pinning-sticky.md` for any option, selector or behavior change.
3. Add or update browser coverage under `cypress/e2e/`: the `example-pinning-*`,
   `example-sticky-*` and `quirk-pinning-*` specs, plus `example-colspan.cy.ts` for cross-band
   colspans. Self-hosted `quirk-*` harnesses (a page served through `cy.intercept`) are the
   pattern for focused regressions.
4. `DockingController` is exported (`Slick.DockingController`, ESM `DockingController`) but is
   an implementation detail; do not extend its public surface without an explicit API decision.
5. Keep fast vertical-scroll blanking as a separate virtual-rendering task; do not conflate it
   with sticky-row activation or docking-layout refresh.
6. Verify with `npm run build:prod` and the Cypress suite; CI runs on Linux, so re-check
   geometry-sensitive specs (menus, alignment) on Windows font metrics when they change.

## Source documentation

- [Pinning and sticky docking](../../../docs/pinning-sticky.md)
- [Implementation status](../../plans/pinning-sticky-progress.md)
- [Documentation README](../../../docs/README.md)
