# Single-viewport pinning/stickiness — implementation status

Last updated: 2026-09-18.

This file records the state of the pinning/sticky docking rewrite **in this repository** (the
flat 6pac/SlickGrid tree). It was originally an implementation log from the slickgrid-universal
fork; everything that only applied there (framework demos, unit-test counts, Grid State/Service
plumbing, Header Menu commands, locale strings, migration guides) has been removed. Treat
`src/`, `cypress/e2e/` and `docs/pinning-sticky.md` as the source of truth.

## Goal

Replace the multi-pane frozen-column/row architecture with a single-viewport docking model:

- one live body viewport with one native vertical scrollbar; ordinary grids scroll horizontally
  through the viewport, docking grids through one dedicated horizontal scrollbar;
- one virtualized DOM row per data row, each with stable left/centre/right cell regions;
- permanent pinning and scroll-activated stickiness resolved by the same internal controller;
- vertical and horizontal virtualization preserved for large datasets;
- an intentional major-version breaking change: no compatibility with the pane renderer.

## Implemented architecture

- `src/slick.core.ts` — `DockingController`, a DOM-free resolver for column and row bands
  (permanent pins, sticky activation from natural geometry, viewport-percentage budgets,
  `conveyor`/`clamp` overflow, revision counters). Exported as `Slick.DockingController`.
- `src/slick.grid.ts` — single viewport/canvas, per-row regions, header/header-row/footer
  regions (`display: contents` wrappers inside the existing roots), the docking overlay for
  pinned/sticky rows, the proxy horizontal scrollbar, transforms for chrome and pinned regions,
  cross-band colspan host + fragments, docking-aware hit-testing (`getCellFromPoint`), runtime
  API (`setColumnPinning`, `setColumnStickiness`, `getPinnedColumns`, `validateColumnPinning`)
  and option handling (`pinning`, `stickyRows`, `docking`, `invalidColumnPinning*`).
- `src/styles/_slick-docking.scss` — region layout, overlay stacking, separators, sticky cues.
- `src/models/docking.interface.ts` — public option and layout types.

The `-1000px` header offset and `HEADER_WIDTH_SLACK` are gone; header, grouped-header and body
coordinates share one coordinate system. The legacy `frozen*` options, `.slick-pane*` DOM and
the right/bottom pane elements no longer exist.

## Public surface

See `docs/pinning-sticky.md` for the option semantics, runtime API, selectors and the migration
table. Key rules:

- numeric column references are indexes (shorthands count visible columns); string references
  are column ids;
- numeric row references are indexes; string references are dataset ids via the DataView;
- sticky state is never serialized; permanent pinning is what applications persist;
- `setOptions` replaces the pinning/sticky arrays atomically; `setOptions({ pinning: undefined })`
  removes docking and tears the proxy scrollbar and chrome regions down again.

## Verification

- `npm run build:prod` (type-check, lint, bundles, CSS, types) must pass.
- Browser coverage (Cypress): `example-pinning-*`, `example-sticky-financial-report`,
  `example-colspan` (pinned colspans), `example-variable-row-height-*`, `example-auto-scroll-when-dragging`
  (pinned drag auto-scroll), `example11-autoheight`, and the self-hosted `quirk-pinning-*` /
  `quirk-sticky-*` harnesses (row boundary, empty configs, bottom hit-testing and cleanup,
  bottom-pin reachability, docked-row cell virtualization, hit-testing geometry, chrome scroll
  forwarding, lazy activation destroy events, sticky column reorder, destroy references).
- CI runs on Linux/Chrome; menu-alignment specs are geometry sensitive and are also checked on
  Windows font metrics.

## Resolved during review (2026-09-18)

- Column shorthands/arrays resolve to indexes only and over visible columns; numeric ids no
  longer collide with index references.
- Row references match by index or string id; the id→index cache is cleared on row invalidation;
  the DataView id property is honoured.
- Sticky-row thresholds account for the permanent top band and no longer subtract the bottom band
  twice; `conveyor` keeps the newest candidates on every edge.
- `autoHeight` grids size the container once (no header-height band); the vertical wheel is only
  intercepted on docking grids; Ctrl/Meta+drag multi-selection follows the selection model again;
  `absBox()`/editor positions are document-relative again.
- `getCellFromPoint()` resolves through the rendered layout (bands, overlay, non-contiguous
  pins, unrendered rows); `CellRangeSelector` prefers the event target.
- Bottom-pinned rows keep every scrolling row (including the add-new row) reachable.
- Docked rows virtualize their centre cells horizontally; chrome cells fire their destroy events
  on lazy activation/deactivation; native chrome scrolls are forwarded as deltas; reordering
  works while a sticky column is docked; cell CSS classes are mirrored onto colspan fragments;
  `destroy(true)` drops element references reflectively.
- slickgrid-universal-only options and code paths were removed; the legacy `frozen*` options are
  gone from the types; the header-menu demo command is "Column Pinning".

## Known limitations and follow-ups

- A colspan host that starts in a pinned band paints across the boundary and stays with its band
  while the centre scrolls (centre cells that scroll under it are covered). Clipping the host and
  letting the fragment carry the text is the alternative if this is not the wanted look.
- Sticky columns in RTL are not covered by browser tests.
- Sticky group headers (a grouped header that stays visible as a unit) are not supported.
- Focus sinks live outside the grid container (`tabIndex -1`); keyboard routing (Shift+Tab into
  header-row filters, F6 to the header) came from the fork and was removed during the audit; the
  base focus sinks and `navigatePrev()` handle Tab and Shift+Tab again
  with `tabIndex="0"` that the plugins here do not produce.
- Fast vertical-scroll blanking is a separate virtual-rendering task.
- Per-scroll work on row-docking grids (`syncDockedRowContainers` on every vertical scroll,
  per-row custom-property writes on horizontal scroll) can be reduced further.

## Resume checklist

1. Read `docs/pinning-sticky.md`, then the relevant `src/` code and the specs listed above.
2. Preserve the invariants: one native horizontal and one native vertical scroll owner, one row
   node with three regions, one shared `DockingController`, no legacy compatibility branches.
3. Add a self-hosted `quirk-*` spec for any regression fixed; run `npm run build:prod` and the
   affected Cypress specs before committing.
