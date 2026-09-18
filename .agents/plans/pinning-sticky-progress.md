# Single-viewport pinning/stickiness — implementation progress

Last updated: 2026-09-15 (Firefox/Linux overlay-scrollbar findings and visual fixes, profiler-guided scroll-offset optimization, minCenterRowCount resize fix, and user-confirmed green Vanilla/framework Cypress CI)

> Repository status: this file is a historical implementation log adapted from another
> SlickGrid repository. Its framework-specific coverage counts, migration claims, and
> examples do not describe this flat repository. The current API and verification status are
> documented in `docs/pinning-sticky.md`; use the local `src/` and `cypress/e2e/` trees as the
> source of truth.

## Repository adaptation note

This progress record was copied from the multi-package fork and retains its historical framework
and example numbering. In this repository, the local source of truth is:

- library implementation: `src/` (not `packages/common/`);
- demos: `examples/` (not `demos/vanilla/`);
- unit tests: `tests/`;
- browser tests: `cypress/e2e/`;
- documentation entry points: `docs/README.md` and `docs/TOC.md`.

Use `rg --files examples cypress/e2e` to resolve current demo/spec names. In particular, the
pinning demos use `example-pinning-*` names here, and the row-span demo is
`examples/example-0031-row-span-employees.html`. References below to Angular, Aurelia, React,
Vue, `packages/common`, `demos/vanilla`, or fork-only documentation are historical status and
must not be treated as paths that exist in this checkout.

## Goal

Replace SlickGrid's multi-pane column/row architecture with an AG Grid-style docking model:

- performance is a highest-priority invariant: preserve smooth scrolling and rendering efficiency,
  especially with very large datasets (500K+ rows), and avoid per-scroll layout, DOM, or style work;
- exactly one live body viewport with one native vertical scrollbar; ordinary grids use the
  viewport for horizontal scrolling, while pinning/sticky grids use one dedicated docking
  horizontal scrollbar;
- one virtualized DOM row per data row;
- each rendered row contains stable sibling left, center, and right cell regions;
- permanent pinning and scroll-activated stickiness use the same internal docking resolver;
- vertical and horizontal virtualization must remain viable for large datasets;
- this is intentionally a major-version breaking change; compatibility with the old pane renderer is not a design goal.

## Accessibility audit (2026-09-15)

The pinning/sticky renderer was audited for semantic-tree integrity, keyboard navigation, and
ARIA handling. No pinning/sticky-specific semantic regression was found in the current scope.

- **Pass:** The grid keeps one semantic `grid`/`row`/`gridcell` tree. Left/center/right docking
  wrappers and the row overlay use `role="presentation"`, so visual docking layers do not create
  duplicate rows or cells for assistive technology.
- **Pass:** Docked rows reuse the existing row node rather than cloning it. Overlay event binding
  covers keyboard, click, double-click, and context-menu interactions.
- **Pass:** Cross-band colspan/rowspan hosts expose `aria-colspan`/`aria-rowspan`; visual
  continuation fragments are `aria-hidden="true"`, `role="presentation"`, and not focusable.
- **Pass:** Sticky keyboard navigation reveals a candidate's natural position before activating
  it, and sticky summary rows remain keyboard-addressable after vertical scrolling. Focused
  coverage exists in the Vanilla, Angular, Aurelia, React, and Vue sticky Example 58 suites.
- **Verified:** The focused common tests passed: 51 pinning tests and 19 targeted ARIA,
  accessibility, docking-wrapper, and colspan tests in `slickGrid.spec.ts`.
- **Coverage gap:** The repository has no automated axe/WCAG integration for these demos, and no
  screen-reader session was run. The audit therefore verifies DOM contracts and keyboard behavior,
  not complete assistive-technology compatibility.
- **Resolved (minimal):** Virtualized/docked rows and cells now expose `aria-rowindex` and
  `aria-colindex`, preserving their logical dataset and column positions through non-contiguous
  pinning, band reordering, and docking-overlay moves. Visual colspan fragments omit the index.
- **Resolved (minimal):** The dedicated docking horizontal scroller is keyboard-focusable and
  labelled `Horizontal grid scroll`. It remains the browser's native overflow control rather than
  a custom `role="scrollbar"`; screen-reader behaviour still needs manual validation.

The implementation supports per-column pinning and the canonical nested `pinning` option.
`pinning.columns.left` accepts an inclusive edge-boundary number for contiguous
left pinning, while `pinning.columns.right` accepts a count from the trailing
edge. Either side also accepts arrays of stable column ids/indexes for
non-contiguous pinning. An inclusive v11-and-lower boundary is written as
`pinning.columns.left: 2`; users do not need to expand it into an index array.
The removed legacy `frozen*` option names are not part of this major version. Use the nested
`pinning` option instead.
There is no separate `pinnedColumn` or `pinnedRows` grid option; those temporary
aliases were removed after the canonical shape was wired through core and state.
The implementation does not target compatibility with the old pane-based UX.

For ordinary colspans that cross docking bands, pinning is accepted only when the
resolved bands remain sequential (`left → center → right`). A non-sequential
change such as pinning the second column while leaving the first column in the
center is rejected through `invalidColumnPinningPickerCallback`; the default
message can be customized with `invalidColumnPinningSequenceMessage`. This
validation runs during pinning changes and does not add work to horizontal
scrolling.

The canonical grid-state shape is now a single nested `GridOption.pinning` object:
`{ columns: { left, right }, rows: { top, bottom } }`. `Column.pinned` remains the
per-column representation. `GridService.setPinning()` and `GridStateService` now read
and write the unified shape; sticky configuration remains separate because it has
different scroll-activated semantics. `CurrentColumn.pinning` also carries the
per-column side in column layouts, providing a hybrid preset representation for
consumers that do not want to persist a separate aggregate pinning object.
`Column.pinnable` defaults to `true`; setting it to `false` prevents Header Menu pinning changes
for protected columns while leaving programmatic pinning available. Sticky columns do not expose
Header Menu commands, so there is no separate `Column.stickable` option.

Vanilla Example 11 serializes the new nested `CurrentPinning` shape in its
saved views and intentionally enables the pinning header commands to
exercise the new behavior. The single-column menu action calls
`SlickGrid.setColumnPinning` and updates `Column.pinned`; the bulk “Pin
Columns” menu action updates
`pinning.columns.left`, which applies the same left pins through the unified
pinning resolver. Neither action uses removed legacy options or validation.
The `headerMenu.showPinningCommands` option controls whether the Header Menu exposes these
commands, while defining `pinning` automatically enables the same UI for
declarative pinning configurations. Individual command visibility is handled by
`headerMenu.hideCommands`.

Vanilla Example 04 and the Angular, Aurelia, React, and Vue Example 20 fixtures mark
`City of Origin` as `pinnable: false`; their Cypress suites verify that its Header Menu omits
the `Column Pinning` commands while programmatic right pinning remains available.

In the source fork, sticky usage was documented separately in
`docs/grid-functionalities/sticky.md` and matching framework guides. This checkout currently
has only the root documentation entry points `docs/README.md` and `docs/TOC.md`; keep any local
pinning/sticky documentation aligned there unless a dedicated page is added deliberately.

The sticky financial-report fixture from Vanilla Example 47 is also available as Example 58 in
the Angular, Aurelia, React, and Vue demos. Each framework route includes the same 18-column
report, two-sided sticky columns, sticky summary rows, docking budgets, and a focused Cypress
smoke test. The recent `Column.pinnable` behavior is covered by Vanilla Example 04 and all
framework Example 20 equivalents.

All available pinning locale assets and translation stubs were reviewed. The French singular
`PIN_COLUMN`/`TEXT_PIN_COLUMN` label is now `Épinglage de colonne`, matching the singular
`UNPIN_COLUMN` label; plural bulk actions remain plural. The English `Column Pinning` text is
intentionally retained as the Header Menu root label.

The Header Menu now exposes a `pin-column` root command displayed as `Column Pinning`. Its
sub-menu contains three command groups: `pin-left`/`pin-right`,
`pin-columns-left`/`pin-columns-right`, and `unpin-column`/`unpin-columns`, with separators only
between groups that still contain visible commands. The first group sets the selected column's
`Column.pinned` side, the bulk directional commands write the corresponding aggregate left/right
boundary, and the unpin commands clear the selected column or all aggregate column edges.
Setting `pinnable: false` removes the `Column Pinning` menu for that column and excludes it from
bulk pin-through operations. None of these commands recreates the old two-pane layout.

Pinning is opt-in in the Header Menu through `headerMenu.showPinningCommands`, which defaults to
false when no `pinning` state is supplied, or automatically when the `pinning` option is defined.
Applications set `headerMenu.showPinningCommands: true` when they want the `pin-column` root command before any pin state is
configured. Explicit `headerMenu.showPinningCommands: false` keeps pinning programmatic-only, and use
`headerMenu.hideCommands` only for individual command visibility. The former dedicated
`hidePinningColumnsCommand` and `hidePinColumnCommand` options are removed rather than carried
forward into v11.

The pinning Header Menu uses the directional labels
`pinningColumnsLeftCommand` and `pinningColumnsRightCommand`; the former generic
`pinningColumnsCommand` and `pinningColumnsCommandKey` compatibility aliases are removed because
the pinning API is still unreleased and the directional commands are the complete v11 design.

Horizontal scrolling now uses the browser's native `WheelEvent` pixel deltas for trackpads and
physical horizontal-wheel mice. Legacy horizontal-wheel clicks advance by at least 40px instead
of the old 10px increment, while Shift+wheel falls back to the vertical delta when needed. In
docking mode a scroll event applies compositor transforms once rather than twice, and horizontal
virtual-cell rendering is coalesced on `requestAnimationFrame`. Sticky-column band resolution
uses the same frame cadence, keeping Vanilla Example 47's sticky transitions responsive without
performing repeated resolver/render work during a rapid horizontal scroll. The financial-report
examples also reuse one `Intl.NumberFormat` instance instead of allocating one per rendered cell.
Unchanged sticky passes now preserve the active layout/map, per-scroll updates no longer rewrite
invariant docking offsets, and the moving sticky-row clip is compositor-promoted.

### Firefox/Linux scrollbar and scroll-linked-effect notes (2026-09-15)

Firefox on Linux may use GTK overlay scrollbars. In that mode the scrollbar can be hidden until
the grid is hovered, can appear as an overlay before the track is hovered, and can report zero
width/height through DOM scrollbar measurements. This is browser/desktop scrollbar policy, not a
missing SlickGrid scroll owner, and library CSS cannot force the user's Firefox scrollbar
preference to become permanently visible. The docking proxy therefore uses a 15px fallback
height when Firefox reports zero, while retaining measured dimensions everywhere else.

When vertical overflow exists but Firefox reports a zero scrollbar width, the docked-row overlay
clips an 8px trailing strip so the overlay scrollbar cannot paint behind top/bottom pinned rows.
The last right-pinned filter/footer cell also restores the Grid Menu allowance in this zero-width
case, preventing an adjacent center filter from showing through the `Action` column. These
fallbacks are metric-based and are not Firefox user-agent branches.

Firefox may also log its standard [“scroll-linked positioning effect” warning](https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html). CSS `position: sticky`
for the ordinary left-pinned region is compositor-aware; the warning specifically reflects the
JavaScript scroll listener that synchronizes the dedicated horizontal proxy with the sibling
canvas, overlay, and chrome transforms/clip updates. This diagnostic is expected for the current
single-proxy architecture and is not an application exception. Async panning can still make this
path feel different across browsers, and Firefox/Safari should be validated manually where
available. The implementation keeps the scroll path compositor-oriented and does not attempt to
suppress the browser warning.

The Firefox profile supplied for Example 04/47 showed only a small JavaScript scroll-handler
cost, but 18 scroll-triggered style passes restyled 386 descendants each (156.8ms total,
8.7ms average, 20.2ms maximum). The cause was the inherited per-scroll
`--slick-docking-scroll-left` value on the grid root. The optimization registers that property
as non-inheriting, updates it only on moving docking targets, and writes the overlay `clip-path`
directly. This preserves the stable DOM/compositor design for Chrome, Firefox, and Safari without
user-agent detection. Focused tests and static checks pass; manual Firefox held-scroll and
resize/scroll feel confirmation remains the final performance check.

A follow-up Firefox capture from the localhost Example 04 tab confirms the profiler signature
improved: the previous 18 style passes traversing/styling 386 elements (156.8ms total, 20.2ms
maximum) are gone. The new capture has 15 larger style passes traversing 121 elements and styling
77 (59.0ms total, 3.9ms average, 7.7ms maximum). Refresh-driver work also improved in this
capture (3 frames over 16.7ms versus 7 previously). These captures are separate sessions, so
they are directional rather than a controlled benchmark, but they confirm that the full-grid
inherited-property restyle was removed. Manual perceived-smoothness validation remains useful.

A horizontal-wheel mouse (a second, dedicated tilt/horizontal wheel, as opposed to Shift+wheel)
could push `scrollLeft` below zero because `handleMouseWheel` added the raw wheel delta without a
floor and `_handleScroll` only ceilinged `scrollTop`/`scrollLeft` against their max scroll
distances without flooring either at zero. A negative `scrollLeft` produced a negative
`--slick-docking-scroll-left` custom property, which showed up as a white gap on the left side of
pinned/docked examples (e.g. vanilla Example 04) along with misaligned pinned-right columns.
Both `handleMouseWheel` and `_handleScroll` now floor `scrollLeft` (and `scrollTop`) at zero.

Full-span group headers now render as one viewport-wide row above all three docking regions, matching
the group-row model used by AG Grid: pinned columns still clip ordinary data rows, but group labels
remain fully visible across the grid. Ordinary cells (including injected row-selection checkboxes)
and group-total cells remain in their resolved bands. This fixes the blank/misaligned left side
described by the long-standing SlickGrid grouping-plus-frozen-columns issue.

HeaderGroupingService pre-header titles are also split at docking boundaries and rendered in the
same left/center/right band order as the column headers. A group such as `Period` therefore gets
separate correctly aligned title segments when `Start` is pinned and `Finish` remains scrollable.
Unchanged pre-header layouts are now identified by their dimensions, visible column groups, and
docking bands so ordinary grid renders do not destroy and recreate identical grouped-header DOM.

Draggable Grouping now creates a Sortable source for the center header band in addition to the left
and right bands, so dragging a scrollable column into the grouping dropzone continues to work with
either edge pinned. Focused full-span group cells also retain their full viewport width and remain
above the pinned-band backgrounds instead of hiding their group label.
The three Sortable source instances share one cleanup loop, and column-width application resolves
the rendered center width once per pass instead of once per column. The related cell-render branch
also no longer evaluates a duplicated docking-band predicate.

Vanilla Example 03 Cypress coverage now pins a right column temporarily and verifies split
pre-header titles, center-band grouping drag/drop, viewport-wide active group rows without pinned
separator cells, ordinary left/right separator overlays, and matching odd-row backgrounds across
all three row regions before restoring the original right-pin state.

The equivalent framework Example 18 Cypress suites now cover the same grouping/pinning contract
using their native column set: left and right pinning, split `Period` pre-header bands, grouping a
center column, viewport-wide active group rows, pinned-band separators, matching odd-row backgrounds,
and clearing pinning after the check.

Full-width group rows no longer paint left/right pinned separators through the group label. Regular
rows retain their existing pinned-band separators. Pinned edge filter/footer cells use their header
title's measured outer width but no longer extend into the vertical-scrollbar gutter; this keeps the
header chrome aligned and prevents a right-edge filter such as `Effort-Driven` from overlapping its
neighboring `Action` cell.

Ordinary colspans that cross left, center, or right docking bands now keep one logical/content host
cell and render lightweight visual continuation fragments in each affected band. Fragments share
the host's styling but are excluded from logical-cell caching and are removed/rebuilt with the host,
so formatters, selection, and virtualization continue to operate on one cell. Clicking any
fragment activates the complete span; keyboard arrows continue to navigate between logical cells,
skipping continuation fragments. The docking separator is suppressed only at an internal colspan
split, so the span remains visually continuous while real outer docking boundaries keep their cue.

Docked body cells now calculate center-band right offsets from the rendered center-region width when
left/right pinning expands that region to the viewport. This prevents the last remaining center
cell, such as `Action` after hiding `Finish`, from stretching away from its header. Vanilla Example
03 Cypress coverage compares the header and body bounds for this case.

Removed the old Angular Example 14/20 last-pinned-cell `border-right` override so it cannot add a
second separator beside the docking pinning cue. The same stale override was removed from the
equivalent Aurelia, React, React Fluent, and Vanilla Example 17 demo styles.

Header columns now rely exclusively on their existing flex root and `flex: 0 0 auto`; the obsolete
column-level inline-block and LTR/RTL float declarations were removed after the old ±1000px header
offset disappeared. Vanilla Example 42 and framework Example 53 Cypress coverage verify flex
layout, `float: none`, and the configured `--slick-header-row-count`, while Example 33 retains
auto-header-height coverage.

The implementation has gone through visual hardening, selected Cypress migration, framework demo parity,
and removal of the legacy pane options/interfaces and runtime branches. The common unit suite,
focused coverage checks, and user-confirmed Vanilla/framework browser CI workflows pass. The
remaining legacy terminology is limited to historical CSS variable names and intentional
migration-facing documentation.

## Refactoring status and immediate follow-up

The legacy option/interface/state/service branches have been removed from the runtime
implementation. The current code no longer defines or reads the former flat pinning
configuration or its legacy state fields.

A structural cleanup of the internal `_viewport*` and `_canvas*` aliases is complete: the
single live nodes are now `_viewportNode` and `_canvasNode`. The former `_pane*` fields and
`.slick-pane*` classes have been removed; they did not create additional panes in the current
implementation. The Migration documentation retains the old theme variable names as v11-and-lower
references, while the active stylesheet now uses `--slick-pinned-*`. Old command
IDs, locale keys, and demo selectors are removed from active examples/runtime and remain only in
migration docs where needed. Do not reintroduce legacy runtime branches.

The production LOC estimate below has been recalculated after the alias/style audit.

## Maintainability acceptance gate

The original PR 1238 motivation was reviewed as part of this work: multi-pane layouts
made `slickGrid.ts` harder to maintain because ordinary operations had to know about left/right
headers, footers, viewports, and canvases. The single-viewport rewrite is successful only if it
removes that model; it is **not** sufficient to create the old panes and force their options
off at runtime.

The final implementation must satisfy all of the following:

- construct one live header, header-row, footer-row, viewport, and canvas; the remaining pane-
  shaped fields must be aliases only and must not become separate DOM/scroll containers;
- make ordinary header/footer creation and column-element lookup direct single-container
  operations, without legacy pane target selection;
- keep the old option fields, state/menu/service plumbing, synchronized-scroll branches,
  and resize branches deleted; intentionally retained migration-facing command IDs, locale
  wording, and theme variable names must not turn into compatibility code. The obsolete
  `-1000px` header-container offset is also deleted;
- keep pinning-specific behavior in the DOM-free `DockingController` plus a small docking DOM
  layer that applies per-row left/center/right regions and pinned chrome offsets;
- remove the obsolete `HEADER_WIDTH_SLACK`/`1000px` header-coordinate workaround as part of the
  rewrite; header titles, grouped headers, and header regions now use ordinary coordinates;
- keep the neutral viewport/canvas node names so the old `L`/`R` pane model cannot leak back into
  normal code;
- complete sticky docking or remove any temporary feature-flag path; sticky docking is now
  implemented through the shared controller and renderer path, with no dormant feature flag.

Do not revive a `ViewportMgr` merely to conceal the old multi-pane renderer. In this design,
deleting the multi-pane renderer is simpler and better aligned with the major-version breaking
change. The single-renderer acceptance gate is satisfied; optional reduction of remaining
compatibility aliases is recorded below as a maintainability follow-up.

## leftover TODOs identified by user
- [x] Unified grid options support pinning (left, right, top, bottom)
- [x] Header Menu exposes a `Column Pinning` sub-menu with `Pin Left`, `Pin Right`, directional `Pin Columns` commands, and `Unpin Column`/`Unpin All Columns`; separators are added only between visible command groups
- [x] `CurrentColumn.pinning` provides a per-column Grid State/Preset representation alongside aggregate `GridState.pinning`
- [x] Row/body/header/footer docking regions have a predictable left/center/right DOM shape. Row
  regions use the compatibility-oriented names `.slick-pinned-left-cells`,
  `.slick-scrolling-cells`, and `.slick-pinned-right-cells`; they are per-row regions, not old
  full-height panes or independent scroll containers. Header, header-row, and footer regions use
  `.slick-*-columns-left/center/right` wrappers.
- [x] The optional `.slick-docking-overlay` is not created for a grid without row pinning or
  sticky-row configuration. Once row docking is configured, the overlay remains a stable row layer
  even when no row is currently active.
- [x] Rowspan stacking was reviewed for the docking overlay. The spanning cell retains its own
  elevated z-index while the host row keeps normal stacking, and active rowspan rows no longer
  receive padding that can clip the span.
- [x] Restored the original `.slick-viewport` horizontal scroll element for ordinary grids. The
  active horizontal scroll element always receives the generic `.slick-horizontal-scroller`
  class: ordinary grids apply it to `.slick-viewport`, while grids with pinning/sticky docking
  apply it to `.slick-docking-horizontal-scroller`. The docking-specific class remains available
  for code that needs to identify the docking scrollbar.
- [x] Added `.slick-vertical-scroller` as the stable selector for the native vertical scroll
  element. It currently points to the single `.slick-viewport` in all grid configurations.
- [x] Pinning validation now uses the canonical `invalidColumnPinning*` and
  `skipPinningValidation` options. Requests that pin every visible column or whose permanent
  left/right bands consume the viewport are rejected and preserve the previous state.
- [x] Header regions expose `.slick-header-columns-left/center/right` (and equivalent header-row/
  footer-row classes), so consumers can identify each region without relying on removed pane roots.
- [x] Sticky keyboard navigation now scrolls to a candidate's natural position before activating
  it, so ArrowRight does not unexpectedly jump from a center cell into a docked sticky cell.
  Example 47 Cypress coverage also verifies sticky summary rows remain keyboard-addressable.
- [x] Added dedicated right-pinning Cypress coverage to Vanilla Example 04, including multiple
  right columns, chrome alignment, scrolling, dynamic disable/re-enable, and edge removal.
- [x] Root context menus are clamped to the visible grid container when a target cell is outside
  the viewport, preventing the accessibility sub-menu tests from opening the menu off-grid.
- [x] Audited legacy configuration names. The former flat pinning options are removed from
  runtime code; historical references remain only in the
  migration guide and documented theme-variable compatibility notes.
- [x] Addressed the curated-skills suggestion for the pinning/sticky feature by adding the
  repository-shipped `.agents/skills/pinning-sticky/SKILL.md` guidance and registering it in the
  repository skills index:
  > I think the major version would indicate this well enough. yeah its a bit more than a break, its a feature deprecation sort of, but the replacement is subjectively better for me.
  > what the latest push in AI development made me think of though is that we might should start thinking about shipping curated skills along with the library. that would serve two purposes. first, LLMs would know better how to apply specific features from slickgrid on the consumer end. but secondly, the skills could also act as a verification of the docs and thus overall improve the development of new features as LLMs could check up on skills when touching existing features
- [x] Identify and document breaking changes in the v11 migration guide, including canonical
  pinning, sticky docking, `pinnable`, removed legacy options, and Header Menu terminology.
- [x] Reviewed and documented the pinning impact on Grid State and Presets. `GridState.pinning`
  uses the canonical nested shape, `CurrentColumn.pinning` preserves granular column sides,
  Vanilla Example 11 persists/restores pinning, and both the Grid State/Presets guide and v11
  migration guide document the saved-state migration. Example 11 Cypress coverage now asserts
  the persisted nested pinning payload. Sticky configuration remains option-based because active
  sticky membership is scroll-dependent and is intentionally not serialized.
- **COMPLETED MAJOR CLEANUP:** removed the legacy grid options, public interfaces,
  runtime validation names, state/service plumbing, old multi-pane behavior, and redundant
  viewport/canvas aliases across `SlickGrid`, GridState/GridService, header grouping, resizer,
  extensions, and framework integrations. Remaining historical CSS/demo terminology is
  intentional; do not add compatibility branches.

## Consolidated remaining work before declaring v1 complete

All required v1 production behavior, policy decisions, focused tests, documentation, and
user-confirmed Vanilla/framework Cypress validation are complete. The items below are retained
for transparency, but are optional validation, maintainability cleanup, or intentionally separate
future work; none currently requires a pinning/sticky runtime change.

- [x] Removed the unused `priority` overflow strategy. It was never requested and had no
  priority metadata or callback. A future release may add explicit priority support if users ask
  for hierarchy-aware sticky selection.
- [x] Changed `clamp` so it never selects a candidate larger than the remaining pixel budget;
  oversized sticky candidates remain in their normal scroll flow.
- [x] Added focused resolver coverage for oversized sticky candidates; they are skipped when they
  exceed the remaining pixel budget. A new cross-framework demo is intentionally deferred because
  this is an overflow-policy edge case, not a separate user-facing feature.
- [x] Added focused resolver coverage for simultaneous top/bottom sticky stacks. The v1 rule is
  one shared total budget after permanent rows, with the top stack resolved first; the bottom
  stack uses the remaining space.
- [x] Added focused coverage for sticky rows with variable heights, including measured offsets,
  top/bottom budget sharing, and candidates that remain in the center when they do not fit.
- [x] Added focused coverage for a sticky row containing a colspan/rowspan across docking
  regions. Cross-band permanent-pinning spans remain covered; no new demo is needed for this
  uncommon combination.
- [x] Added dedicated coexistence coverage for permanent pins and sticky docking across both axes.
  Permanent and scroll-activated bands retain their respective positions and offsets.
- [x] Resolved permanent pinned-row overflow semantics: permanent rows always remain pinned and
  part of the dataset height, even when their combined height exceeds the configured budget.
  Sticky rows use the remaining space and remain in normal flow when no space remains.
- [x] Fixed a permanent top/bottom row overlap bug reported against Example 04: `maxRowViewportHeightPercent`
  only ever budgeted *sticky* rows (`applyBudget()` in `DockingController.resolveRows()`); permanent
  `pinning.rows.top`/`bottom` rows have no budget and always render in full, by design. The bottom
  band's screen position was computed as `viewportHeight - bottomHeight`, with no floor, so shrinking
  the browser below `topHeight + bottomHeight` moved the bottom band above the bottom edge of the top
  band, visually overlapping/cutting off rows instead of degrading gracefully. `SlickGrid.applyRowTopOffset()`
  now anchors the bottom band at `Math.max(topHeight, viewportHeight - bottomHeight)` so the two permanent
  bands never overlap; when there truly is not enough height for both, the bottom band is pushed down
  and its own trailing rows are clipped at the viewport edge instead. There is intentionally no
  automatic reduction of the number of pinned rows and no console warning (unlike the analogous
  `invalidColumnPinningWidthCallback` used for columns) — reducing `pinning.rows.top`/`bottom` counts,
  or ensuring the grid has enough height for its configured pinned rows, remains the consumer's
  responsibility.
- [x] Decided hierarchical sticky-row push-off/priority behavior is a separate future product
  feature, not part of v1. v11 uses natural-order stacking plus conveyor/clamp overflow.
- [x] Fixed `docking.minCenterRowCount` end-to-end for auto-resized Vanilla grids. The grid still
  clears and recomputes its `min-height` budget during `resizeCanvas()`, but `getViewportHeight()`
  now measures the effective rendered container height (the larger of inline `height` and the
  `getBoundingClientRect().height` produced by `min-height`). This lets the expanded container
  size the child viewport correctly instead of continuing to calculate from the smaller inline
  height that `ResizerService.resizeGridWithDimensions()` writes on each pass. The controller's
  required defaults also now include `minCenterRowCount: 3`, fixing the strict TypeScript build.
  Unit coverage remains in `slickGrid-pinning.spec.ts`; the user confirmed the live Example 04
  UI now reserves the center rows. Note for future debugging: a watch server that stops rebuilding
  after a TypeScript error can make this fix appear absent until the compile error is resolved.
- [x] A post-Firefox cleanup inlined the single-use overlay-scrollbar-width fallback and simplified
  the proxy scrollbar-height fallback without changing their metric-based behavior (`-5` production LOC).
- [ ] Optional validation: run targeted UX trials for sticky-row transitions, fast scrolling, and
  changing visible sticky sets. CI verifies correctness, while manual trials can assess feel and
  transition comfort.
- [ ] Separate virtual-rendering task: revisit fast vertical-scroll blanking after pinning/sticky
  work is merged. This includes auditing the row-docking synchronization that still runs during
  vertical scrolling; it is not part of sticky activation correctness.
- [x] Removed the five verified redundant right-side header aliases
  (`_headerScrollerR`, `_headerR`, `_headerRowScrollerR`, `_headerRowR`, `_headerRowSpacerR`),
  reducing the production implementation by 14 net LOC. The widely used one-item arrays remain
  unchanged because they still represent the active single-viewport collections.
- [x] Removed the remaining unused single-viewport pane aliases and duplicate footer/pre-header
  references, including dead group-header fields and top-panel aliases. This reduced the
  production implementation by an additional 31 net LOC while preserving the public pre-header
  right-panel getter and existing one-item collections.
- [ ] Separate future feature: support grouped sticky header bands, such as a quarterly group
  header spanning several columns. This would require approximately 150–300 additional library
  LOC and explicit cross-band and push-off rules; ordinary sticky columns do not require it.
- [ ] Deferred documentation: add framework-specific v11 migration guides if the release requires
  them. The root migration guide is current, and the framework guides are intentionally deferred.

## Starting point

- Branch: `master`
- Base commit: `e757539c2`
- Worktree was clean before this implementation.
- The earlier `feat/viewport-mgr`/PR 1238 approach was inspected but not reused because it extends the old full-height pane architecture.
- GitHub Discussion 1237 was reviewed for arbitrary sticky rows/columns, pixel budgets, overflow policies, variable row heights, and hierarchical sticky-row semantics.
- AG Grid v36's single-scroll DOM change was used as the structural reference.

## Implemented architecture

### One live scroll viewport

`SlickGrid.activateSingleViewportLayout()` configures the public/internal active collections to
one live viewport and one live canvas:

- `_viewport = [_viewportNode]`
- `_canvas = [_canvasNode]`
- the active header/header-row/top-panel/footer collections likewise contain only their left/single instance.

The viewport and canvas are represented by neutral node fields; they do not create separate DOM
panes or own additional scrollbars.

### Per-row left/center/right regions

In the single-viewport docking renderer, every rendered row has this shape, including grids
with no active pinned columns (the side regions are then empty and have no active separator):

```html
<div class="slick-row slick-row-docked" role="row">
  <div class="slick-pinned-left-cells" role="presentation">...</div>
  <div class="slick-scrolling-cells" role="presentation">...</div>
  <div class="slick-pinned-right-cells" role="presentation">...</div>
</div>
```

There is no left/right row clone and no second body canvas. `renderRows()` now appends exactly one row node to `_canvasNode`.

The same stable-region principle applies to chrome. The single header, header-row, and footer
roots each contain persistent `left`, `center`, and `right` semantic wrappers. They use
`display: contents`, so the wrappers do not introduce another layout or scrolling layer.

The center region retains horizontal cell virtualization. Pinned and active sticky cells are always materialized, while ordinary center cells continue to be created/cleaned according to the rendered pixel range.

### Horizontal positioning

The one native viewport scrolls the full-width canvas. The small number of rendered left/right row regions receive `translateX()` updates derived from that single `scrollLeft`:

- left region translation: `scrollLeft`;
- right region translation: `scrollLeft + viewportClientWidth - contentWidth`.

This is necessary for right-pinned cells to be visible immediately. Pure `position: sticky; right: 0` does not pull an element whose natural position starts beyond the right side of a wide canvas into the initial viewport.

The header, header-row, footer, and optional panel content receive whole-layer `translate3d(-scrollLeft, 0, 0)` transforms. Pinned chrome receives the inverse docking offset so it remains fixed at the edge. Horizontal virtual-cell rendering is queued behind the scroll task, and ordinary rows with only leading pinned columns avoid redundant per-scroll style writes because their left region already uses CSS sticky.

The old paired header coordinate trick (`-1000px` on the header root plus `+1000px` on
header-column rules) has been removed from the docking renderer. Header widths no longer include
the `HEADER_WIDTH_SLACK` value, and grouped/pre-header titles use the same normal coordinate
system. This is intentional cleanup for the major-version rewrite; the offset was layout
technical debt from the old pane renderer, not a pinning or virtualization requirement.

An attempted shared sticky-canvas coordinate system was **reverted** because it broke the far-right scroll geometry (visible blank space and header/body misalignment). The replacement preserves the canvas as a normal full-width element and moves horizontal scrolling to one dedicated scrollbar overlay aligned with the body viewport. The body viewport is now vertical-only; its canvas, the pinned-row overlay, headers, header row, footer, and optional panels all receive the same `translate3d(-scrollLeft, 0, 0)` from the dedicated scrollbar's scroll event. A pair of scoped CSS variables applies the inverse offset to left/right pinned regions and pinned chrome, so regular rows no longer receive individual JavaScript positioning writes during horizontal scrolling. This is the current single-scroll implementation and is covered by the passing Vanilla/framework Cypress suites.

The always-created right-region wrapper is now marked active only when right pinning has a non-zero width. This prevents a zero-width `slick-pinned-right-cells` region (present for the stable left/center/right row shape) from drawing a spurious pinned-border line in left-only pinning scenarios.

The pinned-row overlay now uses the full canvas/docking content width rather than the visible viewport width and is refreshed after every canvas-width update. Since the dedicated horizontal scrollbar translates the overlay by `-scrollLeft`, a viewport-sized (or stale) overlay would clip itself and expose a trailing blank square as soon as it scrolled right. The top pane remains the clipping boundary.

Example 04 keeps `enableAutoSizeColumns: true` to preserve the existing option
contract. The shared resizer service invokes `autosizeColumns()` after
browser/container resize, and the pinning layout must continue updating its
canvas, proxy scrollbar, and docked regions correctly when those widths change.

Example 04 now exercises both docking edges by default: the first three columns are pinned left and the final `Action` column is pinned right. A separate `Pinned Right` count control updates the right band dynamically; setting it to zero removes right pinning, and the existing remove button clears both edges.

### Unified docking resolver

New DOM-free `DockingController` resolves both axes:

- permanent left/right columns;
- center columns and their natural offsets;
- sticky left/right columns activated from their natural geometry when clipped, including after a direct scroll jump;
- permanent top/bottom rows;
- sticky rows activated from their natural geometry when they cross an edge, including after a direct scroll jump;
- viewport-percentage pixel budgets;
- `conveyor` and `clamp` sticky overflow policies;
- revision counters so DOM membership changes happen only when a docking boundary is crossed, not on every scroll pixel.

Scroll-activated sticky docking is now enabled through the same resolver as permanent pins.
Example 47 uses it for Q1–Q4 and its three summary rows. The transition path is covered by
the passing Vanilla/framework Cypress suites.

`sticky: true` means the leading edge (`left` in LTR and `right` in RTL). Explicit `'left'` and `'right'` remain physical edges.

### Sticky feasibility and quarterly-style groups

The current pinning implementation is the completed base for sticky columns/rows. Permanent
pins and scroll-activated sticky items resolve through the same controller, while the renderer
keeps LTR proxy-scrolled sticky candidates in stable natural center-band DOM and moves them with
compositor transforms:

- keep the single native horizontal and vertical scrollbars;
- let the controller activate/deactivate sticky candidates only when a visibility boundary is
  crossed (not on every scroll pixel);
- keep center cells horizontally and vertically virtualized; only configured pinned/sticky
  cells and rows are materialized outside the normal range;
- use the same width/height budgets, hysteresis, resize invalidation, and overlay stacking
  already needed for permanent pins.

The basic sticky-column/sticky-row implementation is complete for the agreed v1 behavior. Large
scroll jumps, RTL, resize/reorder, editors, selection, grouping, spans, and framework parity are
covered by the user-confirmed CI runs. Focused resolver and rendering tests also cover variable
sticky heights, sticky rows containing spans, and coexistence with permanent pins. Multiple active top sticky rows stack in natural order
within the existing viewport-percentage budget; they do not push each other off, and no fixed
row-count budget is used.

The user's quarterly example is also feasible, but there are two different scopes:

1. If Q1/Q2/etc. are ordinary columns with `sticky: 'left'` (or a runtime sticky callback),
   the basic estimate applies.
2. If Q1 is a group header spanning January–March and the group itself must remain visible,
   grouped-header metadata and a separate sticky group-header layout are required. That is
   approximately **+150 to +300 additional library LOC**, with explicit rules for groups that
   cross a pinned/center boundary and for push-off/replacement as the next quarter enters.

This is still compatible with permanent pinning: a permanent pin always wins its edge budget,
while sticky candidates use the remaining center viewport. The performance model remains
O(configured sticky candidates) per scroll event and O(1) DOM work between boundary crossings;
large datasets continue to render only the normal virtual range plus the small docked set.
Sticky activation is enabled for Example 47's quarterly columns. Permanent pinning and sticky
transition visuals are accepted in the current user-confirmed CI/browser validation. The remaining
future UX follow-ups are listed in the consolidated remaining-work section above.

### Pinned/sticky rows and virtual scrolling

Pinned row references are resolved to row indexes and cached. With a plain array, resolving a string ID may scan the dataset once; subsequent vertical scroll events are O(number of configured docked rows). With a SlickDataView, `getRowById()` is used when available.

The normal virtual rendered range is unchanged. Only configured top/bottom rows are additionally rendered, so a million-row dataset does not produce a million-row DOM.

Non-contiguous permanent top-pinned rows are removed from the normal visual row flow while the
canvas retains its natural dataset height. This prevents blank gaps behind rows such as
`pinning.rows.top: [0, 2, 4]` without changing scrollbar range or virtual row coordinates.

Pinned and active sticky rows reuse their normal cached row element, but are reparented into a small overlay outside the scrolling canvas. Their vertical `top`/`bottom` coordinates are constant during scrolling; only the center cell region follows horizontal scroll. No additional tall top/bottom canvas is created.

Pinned rows now live outside the scrolling canvas, so their vertical coordinate does not
change as `scrollTop` changes. Transforms remain available for ordinary rows because a
growing transform on a row inside the scrolling canvas produced visible jumps during
virtual-page recycling. Virtual-page changes update row positions only after the physical
scroll position and page offset have both been committed, avoiding a transient mixed-coordinate
frame. Pinned region boundaries use the current pinned-border color and
`--slick-pinned-border-bottom` theme variable for body rows and column chrome. The former
Legacy theme variable names are migration-guide references only. The horizontal
row boundary is emitted only on the last top-pinned row (or first bottom-pinned row), rather
than repeating across every pinned row. Normal virtual rows are repositioned only when a page
offset actually changes; the separate fast-scroll task in the consolidated remaining-work section
will audit the row-docking synchronization that still runs during vertical scrolling. The overlay now
inherits the normal grid-cell typography, borders, alternating backgrounds, and selection
styles, and is stacked above hovered scrolling rows so the pinned content cannot show through.
Header-row and footer cells in pinned bands now receive explicit border-box widths, so filter
controls track left- and right-pinned column resizing equally.
Their width calculation now preserves content-box semantics and subtracts each element's
horizontal padding/border from the rendered header width, preventing fractional header/body
boundary offsets.
Pinned boundary data cells now paint their inset separator in a transparent overlay, leaving each
theme's normal cell borders/shadows untouched. Full-width group rows have no boundary cells, so they
remain free of pinned separators. All three docked row regions now also receive the same
even/odd/hover background state, so striping cannot differ between pinned and scrolling sections.
Column-resize auto-scroll is now limited to center columns; resizing a permanently pinned
right column no longer forces the native horizontal viewport to jump to its maximum position.
Pinned body regions and header/filter/footer chrome now use opaque theme backgrounds and a
dedicated stacking layer, preventing center cells or hovered rows from painting over pinned
content during width updates.
For ordinary scrolling rows, the permanently left-pinned region uses native CSS sticky
positioning at the leading edge. The canvas and pinned-row overlay now share the same
CSS-variable horizontal transform as headers and filters, while scroll-activated sticky docking
is resolved through the shared controller.

## Current APIs

### Column definition

```ts
interface Column {
  pinned?: 'left' | 'right' | null;
  pinnable?: boolean;
  sticky?: 'left' | 'right' | 'both' | boolean;
}
```

Examples:

```ts
{ id: 'title', field: 'title', pinned: 'left' }
{ id: 'total', field: 'total', pinned: 'right' }
{ id: 'country', field: 'country', sticky: true }
{ id: 'quarter1', field: 'quarter1', sticky: 'both' }
```

### Grid options

```ts
interface GridOption {
  pinning?: {
    columns?: {
      left?: number | Array<number | string>;
      right?: number | Array<number | string>;
    };
    rows?: {
      top?: Array<number | string>;
      bottom?: Array<number | string>;
    };
  };
  stickyRows?: {
    top?: Array<number | string>;
    bottom?: Array<number | string>;
    both?: Array<number | string>;
  };
  docking?: {
    maxColumnViewportWidthPercent?: number; // default 60
    maxRowViewportHeightPercent?: number;  // default 60
    overflowStrategy?: 'conveyor' | 'clamp';
    stickyHysteresis?: number;              // default 2px
  };
}
```

Row references can currently be row indexes or values from `datasetIdPropertyName` (default `id`). Numeric references prefer row-index semantics when they are within the current data range.

The unified `GridOption.pinning` shape now owns both column bands and row bands
(`pinning.columns.left/right` and `pinning.rows.top/bottom`). `Column.pinned`
remains the per-column representation for explicit/non-contiguous pinning.
Runtime updates and state serialization use the nested shape so initial options,
dynamic updates, and grid-state persistence cannot drift apart.

### Runtime grid methods

```ts
grid.getPinnedColumns(side?);
grid.setColumnPinning(columnId, 'left' | 'right' | null);
grid.setColumnStickiness(columnId, true | false | 'left' | 'right' | 'both');
```

Rows are changed through `grid.setOptions({ pinning: { rows }, stickyRows })`.
`stickyRows.top` docks a configured row when its natural position crosses above the viewport,
while `stickyRows.bottom` docks it when its natural position crosses the lower viewport edge.
`stickyRows.both` chooses the closest vertical edge, including after a direct scroll jump.

## Example 04 conversion

Vanilla Example 04 now loads the equivalent of its previous configuration through the new APIs:

- the previous column boundary becomes `pinning.columns.left: 2`; core expands that
  inclusive boundary to the first three final visible columns (checkbox, title,
  percent complete). Explicit arrays remain available for non-contiguous pins;
- the previous top-row count becomes `pinning.rows.top: [0, 1, 2]`;
- the existing column-count, row-count, remove, set-three, top/bottom, and large-width controls now mutate the nested `pinning` option;
- Grid Menu/Header Menu pin commands now write the canonical `pinning` state without recreating
  a second pane;
- the page title identifies it as the single-viewport implementation.

Example variable/function names and Cypress `data-test` attributes now use pinning terminology.
The old names remain only in the v11 migration guide where they are needed as migration inputs.

## Example 47 — sticky financial-report fixture

Vanilla Example 47 reproduces the report shape from Discussion 1237's animated mockup:

- the example intentionally has **no permanent pins**;
- `Account`, Q1–Q4, and YTD retain their natural locations and declare `sticky: 'both'`, so
  each docks to the nearest edge only after scrolling would clip it;
- the three report totals (`Total Revenue`, `Total Expenses`, and `Net Profit`) declare
  `stickyRows.both`, so they dock to whichever vertical edge is closest after they have been
  seen; they retain the dark summary band from the mockup;
- follow-on Capex, headcount, R&D, grants, FX, and provisions rows remain after Net Profit,
  allowing the statement totals to be crossed in both vertical scroll directions;
- normal manual grid scrolling is used to inspect the sticky transitions.

Example 47 is the primary fixture for validating sticky columns and sticky summary rows; grouped
sticky-header behavior remains a separate product decision without conflating those semantics with Example 04's
permanent-pinning controls.

## User-observed status

- Initial load first failed in `getHeaderChildren()` because column resize assumed `_headers[1]` existed.
- That was fixed by flattening the connected header collection.
- SortableJS no longer assumes or creates a connected second header instance.
- The user subsequently reported no more console errors before the Example 04 API conversion.
- The user confirms that all Vanilla and framework Cypress CI workflows have been run repeatedly
  and pass, including the pinning/sticky, resize, reorder, RTL, variable-row-height, editor,
  selection, grouping, span, and framework-parity coverage.
- The stable docking-region DOM is now implemented and the old 1000px header offset has been
  removed. Header/row/footer regions and per-row body regions should now be selected by their
  explicit left/center/right classes rather than by legacy pane roots.
- Horizontal scrolling is conditional: the active horizontal scroll element is always
  exposed as `.slick-horizontal-scroller`. Ordinary grids apply that class to the legacy
  `.slick-viewport.slick-viewport-top.slick-viewport-left`, while grids with permanent pinning
  or sticky docking apply it to `.slick-docking-horizontal-scroller`. The docking scroller is
  materialized lazily if pinning/sticky state is enabled after initialization.
- The native vertical scroll element is always exposed as `.slick-vertical-scroller` and remains
  separate from the docking horizontal scroller when pinning or sticky docking is active.
- On Firefox/Linux, the user confirmed that overlay scrollbars may remain hidden until the grid
  is hovered and then appear as a very narrow overlay. The user also observed Firefox's standard
  scroll-linked-positioning warning; it is expected from the JavaScript proxy-to-canvas/chrome
  synchronization, not CSS sticky itself or a runtime error. The zero-metric scrollbar fallbacks
  and overlay clipping fix the reported pinned-row and right-filter bleed, while final
  scroll-smoothness confirmation after the scoped offset optimization remains pending.

## Files changed

The implementation inventory below has been normalized to this checkout so future work starts
from the right local files; the historical framework references elsewhere in this record remain
context only.

Core implementation:

- `src/slick.core.ts` — shared docking resolver.
- `src/slick.grid.ts` — single live viewport, stable header/body regions,
  per-row pin/sticky routing, scrolling, row caching, runtime API, validation, and hit-testing fixes.
- `src/slick.grid.ts` — grouped/pre-header titles and header coordinates.
- `src/styles/_slick-docking.scss` and `src/styles/slick.grid.scss` — three-region row layout and
  docked stacking styles.

Public types:

- `src/models/docking.interface.ts`
- `src/models/column.interface.ts`
- `src/models/gridOption.interface.ts`
- `src/models/index.ts`

Implementation demonstration:

- `examples/example-pinning-columns-and-rows.html`
- `examples/example-pinning-columns-and-column-group.html`
- `examples/example-pinning-columns-and-column-group-hidden-col.html`
- `examples/example-pinning-rows.html`
- `examples/example-variable-row-height-pinning.html`

## Validation completed

The following implementation-only checks passed:

```bash
npx tsc --noEmit --incremental false
npx eslint <changed files> --no-warn-ignored
git diff --check
```

Static validation for the recent cleanup passed: common-package TypeScript, Oxlint,
Prettier, and `git diff --check`. The current focused DockingController/pinning unit run passes
(51 tests across four suites), and the common SlickGrid coverage run reports 100% statements, functions, and lines
for `slickGrid.ts`. The framework Cypress TypeScript configs also pass after
the custom-command typing fix. The user subsequently confirmed that all Vanilla and framework
Cypress CI workflows pass repeatedly, including the pinning/sticky regression coverage.

The Angular, Aurelia, React, and Vue demo builds pass with the Example 58 framework parity
implementation. Prettier and `git diff --check` also pass for the new demo routes, styles, and
focused Cypress smoke specs. The framework Cypress specs are also covered by the user-confirmed
green CI workflows.

The focused SlickGrid pinning/interaction unit tests, common-package TypeScript check, Oxlint,
and `git diff --check` pass after the horizontal wheel/scroll performance change. Focused
SlickGrid coverage executes every changed performance line; the aggregate report remains at
99.97% lines because of the pre-existing untested `getSelectedRows()` no-selection error path.

The 2026-09-15 Firefox scroll-offset optimization passed 454 focused common-core tests
(48 pinning tests and 406 SlickGrid tests), common-package TypeScript, targeted Oxlint,
Prettier, Sass compilation of the default theme, and `git diff --check`. Changed-range
statement coverage found no uncovered statements. Browser confirmation of held horizontal
scroll performance and resize/scroll feel remains a manual Firefox task.

The 2026-09-10 core/service audit passed all 71 focused SlickGrid pinning, Draggable Grouping, and
HeaderGroupingService tests. The common-package TypeScript check, targeted Oxlint, Prettier, and
`git diff --check` also pass. No example or Cypress changes were part of this audit.

The Cypress custom-command return-type fix was applied consistently to the root, Angular,
Aurelia, React, and Vue support copies: `getCell`/`getNthCell` now return
`Chainable<JQuery<HTMLElement>>`, and `convertPosition` has its concrete chainable shape.
Do not undo this narrowing when revisiting Cypress typings. The user-confirmed green CI workflows
supersede the earlier agent-environment browser-startup limitation recorded during implementation.

## Current production LOC delta and cleanup estimate

These are rough **library-only** figures for `src` (including SCSS and public
interfaces, excluding Example 04, tests, generated output, and framework-wrapper changes).
They are calculated from the current diff:

- current production-ish library diff: approximately `+3,989 / -1,550`, or **+2,439 net LOC**
relative to base commit `e757539c2` (source, excluding tests/examples);
- this includes the new `DockingController` and docking types, single-viewport/per-row routing,
  sticky/pinning hardening, and the pinning/docking stylesheet changes;
- this excludes test files and changelogs; historical migration references are documentation-only.

The earlier 800–1,200-line removal estimate is retained only as a planning range and is not a
forecast of the current implementation.

The basic sticky-column/sticky-row hardening is now implemented. The current transition fix is
approximately +185 net production lines in `slickGrid.ts` and the docking stylesheet, covering
stable natural geometry, both sticky edges, chrome/body alignment, permanent-pin coexistence,
virtualization, and the RTL/native-scroll fallback. Supporting grouped quarterly sticky header
bands would still be a separate feature and product decision.

## Known limitations and likely breakage

### Framework parity and recent Cypress regressions (2026-09-09)

- Angular and React Example 20 no longer install the obsolete hover-selection handlers that
  selected a row and called `preventDefault()` on mouse enter/leave. Those handlers were tied to
  the old split-pane renderer and could interfere with opening a Cell Menu from a pinned Action
  cell. Their behavior now matches Vue and Aurelia.
- The Example 20 cell-menu option callback uses each framework's grid service to update the
  selected item. Angular no longer calls the removed SlickGrid `updateItem()` method directly.
- Angular Example 25's grid-menu regression was caused by a stale Cypress double-click pattern;
  its menu-opening step now uses one click, matching Vue. The subsequent French metrics failure
  was a cascade from the filters not being cleared.
- These framework/demo fixes preserve the single horizontal scroll-owner contract: use
  `.slick-horizontal-scroller` for horizontal scrolling and `.slick-vertical-scroller` for
  vertical scrolling. The more specific `.slick-docking-horizontal-scroller` remains available
  for docking grids.

### Latest visual fixes (2026-09-03)

- The dedicated horizontal scrollbar now reserves its measured height from the live body viewport. Unlike the native scrollbar it replaces, the proxy is absolutely positioned and otherwise covered the last fully scrolled row.
- Financial-report summary rows now force their dark foreground/background palette on individual cells, including when a sticky row is moved to the docking overlay; this prevents an inherited canvas background from making Total Expenses unreadable.
- Bottom sticky-row activation now tests the row's bottom edge rather than its top edge. Bottom candidates are resolved upward from the viewport edge, reserving the height of each already-docked row; a preceding summary therefore docks against Net Profit rather than one full row-height late.
- Sticky-row transitions use the exact top/bottom boundary instead of the configurable 2px column hysteresis, preventing an otherwise visible 1–2px snap into the docking overlay.
- Example 47's sticky candidate and active sticky cells/headers now consistently use the exact `#e4edf7` report blue with higher CSS priority than odd-row striping; docking no longer darkens the cells.
- Horizontal sticky-column thresholds and cell coordinates now use the visible body width (excluding the vertical scrollbar gutter), preventing right stickies from activating 10–15px late. Scroll transitions commit the current header transform before measuring right chrome, avoiding stale left/right header offsets when the right sticky set changes.
- The initial leftmost sticky-column pass now seeds configured candidates as eligible, allowing offscreen-right Q3/Q4/YTD columns to dock immediately at load instead of requiring a right-and-back scroll first.
- The initial top sticky-row pass likewise seeds configured rows as eligible, allowing two-sided report summary rows to dock at their nearest vertical edge immediately at load.
- Example 47's YTD definition now retains the shared sticky-candidate classes when adding its YTD-specific classes, so it keeps the sticky blue background even when it reaches its natural right edge and Q4 takes over the separator.
- Added a higher-specificity right-edge inset-shadow rule for header, header-row, and footer chrome so the first right-sticky column title/filter receives the same pinned separator cue as the body region without changing its width.
- Removed the non-user-facing Example 47 auto-scroll control and timer; the fixture now uses only normal manual grid scrolling.
- Draggable Grouping now tolerates the single-viewport layout: it creates a Sortable instance only for header containers that actually exist, instead of passing a removed right header (`null`) to SortableJS.
- Pinned left/right edge header-row and footer cells use the measured header outer width without extending into the vertical-scrollbar gutter. This keeps an empty edge filter cell aligned with its data cells without overlapping its neighbor.
- The single horizontal scrollbar proxy now has an opaque canvas background, themed `scrollbar-color`, pointer events, and an isolated stacking context. Its z-index remains above grid rows but below application overlays such as Bulma navbar menus, and its track is aligned to the pane content edge.
- The docking scrollbar now uses `overflow-x: auto` and sizes its spacer from the natural docking content width. When all columns fit the viewport, the proxy has zero height and no horizontal track is shown; when overflow exists, its height still comes from the measured native scrollbar dimensions.
- The full-width docked-row overlay now uses a scroll-aware clip window equal to the viewport's content width. It can still retain enough translated width for right-pinned cells, while excluding the native vertical scrollbar strip from overlay painting.
- The docked-row overlay stacking layer is now `z-index: 5`, matching the normal pinned-row layer. This keeps pinned rows above scrolling cells but below application overlays such as Bulma navbar dropdowns (`z-index: 20`).
- In single-viewport mode the header-row scroller now gets an opaque header-row background. Its unused trailing gutter (the body viewport's scrollbar space) no longer reveals translated center columns when widths change; logical right-pinned column widths remain unchanged.
- Right-edge pinned header-row cells stop at the body's visible edge and retain their header title's measured outer width. They do not extend into the vertical-scrollbar gutter, which would overlap the next right-pinned filter cell.
- Pinned column separators use inset box shadows rather than layout borders, preserving header/body width alignment in Bootstrap, Salesforce, and other themes. Header grouping separators use the same non-layout approach, so a split pre-header title cannot accumulate extra width.
- Example04 now clears the opposite `pinning.rows` side when toggling top/bottom. This is required because `setOptions()` deep-merges nested option objects; supplying only `{ bottom }` previously left the old top references active.
- Example04 bottom mode now pins the last configured rows instead of reusing indexes `0..N`. This matches the former bottom-pinning behavior and prevents the first rows' natural slots from becoming blank when they move to the bottom overlay.
- Framework Example20 bottom mode now matches Example04 by pinning the last dataset rows (`Task 497` through `Task 499`) when toggled from the top.
- Docked left/right row regions now mirror odd-row striping and hover backgrounds. Their opaque pinning backgrounds no longer hide the configured gray odd-row color.
- Docked rows no longer receive the legacy active-row padding, preventing every cell in a clicked row from shrinking. Active-cell coordinate resolution now handles rows rendered in the docking overlay, allowing editors to open on top-pinned cells.
- Docked rows now receive an explicit resolved `rowHeight` inline, including the default value. This prevents active/editor box-model styles from reducing a configured 45px row to its 35px content height.
- Cell interaction handlers are bound to the docking overlay as well as the canvas, enabling click/auto-edit and double-click editing for top- and bottom-pinned rows.
- Example04 includes a Toggle Right Pinning button that switches the right-pinned Action column on/off while preserving the configured left pins.
- `internal_setOptions()` now renders after `setColumns()` invalidation. This fixes dynamic row-pinning count changes, which were previously rendered and then cleared when the column refresh removed cached rows.
- `setOptions()` now replaces `pinning.rows.top`/`bottom` arrays atomically instead of deep-merging them. This removes stale row references when the configured pin count decreases.
- Browser grow-after-shrink handling now separates the natural column-content width from the rendered docked-row width. The canvas and row center region grow to at least the body viewport, preventing a white gap before a right pin; right-pinned body regions use the rendered-width offset while header chrome retains natural scroll coordinates. Right-pinned header cells are also taken out of flex flow and explicitly positioned, so their titles remain at the visible right edge. The inner header/header-row/footer column containers now allow this docked chrome to overflow to their existing outer viewport clip; the old inner `overflow: hidden` was clipping every right-pinned header title and filter. This path is covered by the passing Vanilla/framework Cypress suites.
- Right-pinned header chrome no longer uses the shared natural-content transform used by row regions. Each right-pinned header/header-row/footer cell is positioned at its direct viewport coordinate (`scrollLeft + viewportWidth - rightBandWidth + columnOffset`) inside the already translated chrome layer. This fixes titles landing beside a center column and supports multiple right-pinned columns; the path is covered by the passing Vanilla/framework Cypress suites.
- The viewport width used for right-pinned chrome is now read from the header scroller itself, rather than from the horizontal-scroll proxy. The proxy can retain a stale narrow width during resize (for example, yielding `left: 1537px` from a 1637px proxy for a 100px column), while the header scroller is the actual visible clip boundary. Resize coverage passes in the Vanilla/framework Cypress suites.
- The legacy `-1000px` header-container / `+1000px` header-column coordinate pair has now been
  removed from the single-viewport renderer and grouped-header service. Header widths no longer
  include the corresponding 1000px slack. If any remaining legacy pane path is temporarily
  exercised during migration, it must not be mixed with the new docking coordinate system.
- Bulk pin/unpin state is keyed by stable column IDs rather than
  column object identity. This preserves the generated-pin bookkeeping across
  `updateColumnProps()` cloning and makes the existing `Unpin All Columns` command
  reliably restore the pre-pinning state.
- `getColumnsInRenderedOrder(includeHidden = false)` now returns the current left/center/right
  docking order and preserves hidden columns in their logical positions when requested. Column Picker
  and Excel/PDF/Text export consumers use that order so hiding a column does not move it to the end
  or change the WYSIWYG export order.
- Column reordering now reconstructs each docking band independently instead of flattening left,
  center, and right Sortable results into pinned slots when hidden columns exist. Vanilla Example 04
  and all framework Example 20 suites include a regression check that hides `Finish`, swaps the third
  and fourth center columns, and verifies all docking bands; the tests reset serial state with
  `cy.reload()`. Vanilla Example 08 and all framework Example 14 suites cover colspan content,
  fragments, and keyboard navigation across a valid pinning boundary.
- Vanilla Example 04's non-pinnable `City of Origin` column now has the pink visual marker and
  explanatory subtitle replicated in Angular, React, Vue, and Aurelia Example 20. The framework
  Example 20 suites assert the rendered pink cell, while the long colspan fixture text from Example
  08 is aligned across all four framework Example 14 demos.
- Docking accessibility audit is recorded in the dedicated Accessibility audit section near the
  top of this file. The verified semantic and keyboard passes, plus the remaining positional ARIA,
  automated-rule, screen-reader, and scrollbar-contract follow-ups, are kept explicit there.
- Audited the v11 migration guide against the public `SlickGrid` surface and documented the removed
  `getFrozenColumnId()`, `getFrozenRowOffset()`, and `validateColumnFreezeWidth()` methods plus the
  renamed `validateColumnPinning()` method and additive rendered-order argument.
- Sticky-column horizontal scrolling now keeps the scrollbar/compositor path
  immediate while coalescing sticky-band resolution to one animation-frame pass.
  On LTR proxy-scrolled grids, sticky candidates remain at stable natural
  center-band coordinates and activation changes only compositor transforms.
  The regular deferred virtualizer fills any missing buffered cell without
  changing the sticky scroll frame's column rules, chrome geometry, or row grid
  tracks. Native-horizontal-scroll and RTL paths retain the conservative
  three-band transition. Permanent-pinning-only grids retain the synchronous
  compositor path; Example 47 coverage passes in CI.
- Horizontal scroll events no longer resolve permanent pinning layouts: fixed
  memberships change only when columns, options, or the viewport are updated.
  This leaves permanent-pinning scrolling on the compositor and deferred
  virtual-render paths, while sticky candidates resolve once per animation frame.
- Single-viewport horizontal virtualization now consumes 80% of its existing
  one-viewport cell buffer before refreshing cells, avoiding a cleanup/render
  pass for every native scrollbar-arrow increment.
- Instrumented Example 47 profiling confirmed that scrollbar delivery, compositor transforms,
  and sticky resolution each take less than 1 ms. The visible hitch was the three-band DOM
  transition: changing sticky membership took roughly 47–72 ms, dominated by column CSS-rule
  writes, header-chrome updates, and per-row region sizing. The replacement sticky-rendering path
  keeps LTR proxy-scrolled sticky candidates at stable natural center-band coordinates and changes
  only compositor classes/custom properties at activation. Its scroll-frame branch no longer
  updates position caches, column CSS rules, measured chrome layout, or per-row grid dimensions;
  permanent pins retain the existing three-band layout. Focused unit coverage enforces this
  contract. Live held-scrollbar-arrow confirmation remains pending because Cypress exits with code
  132 before browser startup in the agent environment.
- Empty left docking regions no longer paint the left separator: the pinned
  border is now enabled only while the left region contains an active docked
  column, including when sticky membership changes during scrolling.
- Right-edge sticky/pinned header, header-row, and footer chrome retains the
  measured title width while its separator is painted as a non-layout inset
  shadow, so the title/filter cue aligns with the body without changing size.
- Vanilla Example 11 view presets now retain and restore the complete pinning
  state again. Creating/updating a view serializes `GridState.pinning`, reset
  clears permanent pinning, and selecting a view reapplies pinning after its
  column layout (the required order for hidden/reordered columns).
- Removed the duplicate `pinnedColumn` and `pinnedRows` grid options. Header-menu
  bulk pin/unpin and row docking now write/read the canonical `pinning`
  object directly; `Column.pinned` remains available for explicit per-column pins.
- Reworked the Vanilla Example 04 Cypress spec for the persistent docking DOM:
  header assertions now query `.slick-header-column` descendants, row assertions
  target `data-row` plus cell index, and no-pinning checks expect stable empty
  left/right regions rather than removed panes. Header-menu, accessibility, large-scroll,
  and reorder cases are enabled again; the two autocomplete-editor cases remain intentionally
  skipped, while the broader editor and interaction suites pass in CI.
- Restored the invalid-hide alert contract for pinning. The canonical pinning validation
  now checks the prospective visible set against the docking layout, so hiding the last
  available center column is rejected without mutating the grid.
- Column reorder now creates Sortable instances for the persistent left, center,
  and right docking wrappers and combines their order on drop. This keeps drag
  auto-scroll and reorder functional after the old right pane is removed.
- Sticky transitions now keep LTR proxy-scrolled header titles, header-row filters,
  footer cells, and body cells in stable natural center-band DOM, applying only
  compositor transforms when membership changes. This fixes the intermittent
  Example 47/48 chrome/body mismatch while avoiding the former 47–72 ms
  reparent-and-resize transition. RTL/native-horizontal-scroll retains the
  conservative wrapper transition for coordinate safety.
- Docking chrome now keeps the region bands as direct `.slick-header-columns`
  (and equivalent header-row/footer) children of a separate `*-columns-root`.
  This preserves the legacy selector contract where `.slick-header-columns`
  `.children()` are actual cells, while still exposing stable left/center/right
  region classes for pinning/sticky grids. Empty explicit pinning keeps the row
  bands stable; grids with no pinning configuration remain flat.
- Tightened docking activation so an empty `pinning.columns` state does not
  create nested header wrappers, while an explicitly pinning-configured grid
  retains predictable row-region DOM after clearing pinning. Fixed the related
  TypeScript narrowing error in `hasConfiguredRowDocking()`.
- Example 04 vertical-scroll coverage now uses rows that exist in its 40-item
  fixture, resets both scroll owners between suites, and identifies reordered
  columns by stable IDs. With the dev server running, Firefox headless Cypress
  passes all 42 Example 04 tests with retries disabled. Electron cannot start in
  this environment because its bundled binary exits with SIGILL.
- Example 04's large-column action now applies its explicit layout before
  applying pinning. This avoids validating stale, previously resized widths and
  accidentally clearing pinning (which removed the center docking region before
  the final drag/reorder test).
- Added dedicated right-pinning coverage to Example 04: multiple right columns,
  header/header-row regions, horizontal-scroll retention, numeric disable/re-enable,
  removing the first right-pinned column, and restoring the hidden edge column.
  The focused Firefox spec now passes all 46 tests.
- Example 04 now explicitly enables `showHeaderRow`. The persistent docking
  header-row root also receives `headerRowHeight`; without that root height,
  `display: contents` band wrappers collapsed the visible filter bar to the
  1px spacer height.
- Example 17 Cypress migration is complete for the current scope. Its demo uses canonical
  `pinning` instead of inert legacy options, and the shared drag helper reads the
  docking horizontal scrollbar for single-viewport grids. Active canvas/viewport
  fallback now also supports drag selection from pinned-row overlays. A related
  `scrollRowIntoView()` fix accounts for top/bottom docked-row height when
  determining the usable center viewport. Bottom-edge drag coverage is complete; the
  only pending case is the intentionally skipped flaky grouping auto-scroll test.

1. **Legacy runtime removal is complete.** The old options, interfaces, state/service
   fields, validation names, pane behavior, and redundant viewport/canvas aliases have been
   removed. Historical CSS variable names remain documentation-only and must not become
   compatibility branches.
2. **Old options intentionally no longer work.** The former flat options are not valid ways to
   configure this implementation. The old names and command ids are migration-guide
   references only; active menus use `Pin Columns Left`/`Pin Columns Right` and `Unpin All Columns` and write the canonical
   `pinning` option. `GridService.setPinning()` accepts the unified nested shape.
3. **Visual/browser validation is green.** The user confirms that all Vanilla and framework
   Cypress CI workflows pass repeatedly, including left/right pinning, bottom rows, sticky
   transitions, resize, reorder, RTL, variable row height, row/column spans, editors, selection,
   grouping, and framework-wrapper coverage. Do not treat those areas as outstanding blockers.
4. **Cross-band colspans are defined.** The logical cell remains one host while visual continuation
   fragments are rendered in each affected docking region; full-width group rows retain their
   dedicated viewport-wide rendering. A separator is omitted only when it would cut through the
   logical span.
5. **Grouped/pre-header chrome is dock-aware.** `HeaderGroupingService` orders visible columns by docking band and splits a repeated `columnGroup` title at each left/center/right boundary. Cross-framework coverage passes in CI.
6. **Large-jump sticky activation is resolved.** Sticky eligibility no longer depends on a
   previous fully-visible frame. Columns and rows resolve directly from their natural geometry,
   so programmatic jumps, restored scroll positions, and post-scroll configuration cannot skip a
   candidate that should be docked.
7. **Numeric row-reference semantics are resolved.** An in-range numeric reference is treated as
   a row index first; string references resolve through `datasetIdPropertyName` as dataset IDs.
   This preserves the existing low-LOC API without adding a second tagged reference shape.
8. **Pinned-row dataset-height semantics are resolved.** Pinned rows reuse/move the real row
   node into the docking overlay, while their natural dataset slot remains represented in scroll
   geometry. This keeps scrollbar range, virtual-row mapping, restored scroll positions, and
   variable-height row calculations stable when docking changes.
9. **Permanent column over-allocation is rejected at the API boundary.** Pinning every visible
   column or consuming the whole viewport invokes the configured canonical pinning validation
   callback and leaves the prior pinning state intact. Permanent rows always remain pinned and
   remain part of dataset height; sticky rows use only the remaining budget.
10. **Column reorder policy is resolved.** Columns reorder within their current docking band;
    dragging does not move a column between center and pinned regions or implicitly change its
    `pinned` state. Pin/unpin remains an explicit Header Menu or API action. This preserves the
    existing pinned-section and center-section behavior covered by reorder tests.
11. **Header Menu terminology is now pinning-based.** The `Column Pinning` root opens a
    sub-menu containing `Pin Left`, `Pin Right`, `Pin Columns Left`,
    `Pin Columns Right`, `Unpin Column`, and `Unpin All Columns` for pinnable columns.
    Separators appear only between non-empty command groups. The directional commands write
    `Column.pinned`, the bulk directional commands write the corresponding `pinning.columns` edge,
    and the unpin commands clear the selected column or all aggregate column edges. The removed
    v10 names remain documented in the migration guide only.
12. **`DockingController` API visibility is resolved.** The controller remains a separate internal
    module for separation of concerns, but is not exported from the public common-package barrel.
    Public consumers use the grid APIs and exported docking data types instead.
13. **Migration references are intentionally narrow.** Historical option names, command ids,
    translation keys, and labels belong in the v11 migration guide. Active runtime code and
    examples use pinning terminology; only the `--slick-pinned-*` theme variables remain as
    the current styling API.
14. **Sticky horizontal-scroll performance is resolved.** LTR grids using the
    horizontal proxy now leave sticky cells/chrome in stable center-band DOM and activate them with
    compositor transforms. The measured 47–72 ms row/chrome reparent-and-resize path is bypassed,
    and a focused regression test verifies that no column-rule, chrome-layout, or row-dimension
    rebuild occurs in the sticky scroll frame. RTL/native-horizontal-scroll paths retain the
    conservative band transition. The sticky boundary cue is painted by a non-layout pseudo-element,
    preserving the pinned blue shadow without replacing active/editor cell shadows. Live Example 47
    confirms that held-arrow scrolling is materially smoother. The user-confirmed Vanilla and
    framework CI workflows cover the related functional/browser regression surface.

## Documentation scope

The source fork's v11 migration guide and framework-specific guides are not present in this
checkout. Keep the local documentation entry points (`docs/README.md` and `docs/TOC.md`) as the
starting point for any documentation work; do not create fork-specific framework guides as part
of this plan unless explicitly requested.

## Resume checklist

1. [x] User-confirmed all Vanilla and framework Cypress CI workflows pass repeatedly, including
   the pinning/sticky, resize, reorder, RTL, variable-row-height, editor, selection, grouping,
   span, and framework-parity coverage.
2. [x] Example 04 right-pinned columns, header/filter/footer alignment, dynamic toggling, and
   large-scroll/reorder coverage pass in the focused and framework suites.
3. [x] Example 47/58 sticky-column transitions, sticky summary rows, resizing, and keyboard
   navigation are covered by the Vanilla/framework sticky suites. Direct large-jump activation
   is also covered by focused controller tests.
4. [x] Sticky implementation policy is resolved for v1. Multiple active top sticky rows stack in
   natural order within the existing viewport-percentage budget; they do not push each other off.
   Hierarchical push-off is explicitly deferred as a separate future product feature.
5. [x] Reviewed the unified `GridOption.pinning` shape, `CurrentColumn.pinning` precedence, and
   pinning-based Header Menu. The former shorthands and runtime aliases are removed; migration
   references remain documentation-only.
6. [x] Structural audit is complete for the single-renderer architecture. Remaining compatibility
   aliases are optional cleanup only and are listed in the consolidated remaining-work section.
7. [x] Recalculate production LOC after the structural audit: `+3,989 / -1,550`
   (**+2,439 net LOC**) from `e757539c2`, excluding `__tests__` and demos.
8. Keep unit, coverage, Cypress, framework, and documentation work aligned with the cleaned API;
   do not reintroduce the removed runtime options or pane renderer.

## New-context handoff checklist

- Treat this file and the current working tree as the source of truth; do not restart the implementation
  from the old PR 1238 multi-pane branch.
- The legacy runtime options/interfaces and pane behavior are removed. Do not restore compatibility
  branches for old configuration. Remaining alias cleanup is optional and must not increase LOC.
- Before changing layout code, preserve the current invariants: one native horizontal scroll,
  one native vertical scroll, one rendered row with left/center/right regions, stable header /
  header-row / footer region wrappers, and one shared `DockingController`.
- Re-run the focused checks after edits and preserve the user-confirmed green Vanilla/framework
  Cypress CI baseline.
- During future changes, distinguish intentional migration references (docs, command IDs, locale
  text, demo selectors, and theme variables) from runtime configuration. Preserve the current
  production LOC estimate and user-confirmed green framework CI baseline.

## Suggested resume prompt

> Read `.agents/plans/pinning-sticky-progress.md` and inspect the current diff. This is a major-breaking
> single-native-scroll pinning/stickiness rewrite, not an extension of the old pane renderer.
> The legacy runtime options/interfaces and pane behavior have already been removed.
> Preserve one live viewport, one row node with left/center/right cell regions, and the shared
> `DockingController`; do not add legacy compatibility branches. Review the remaining TODOs,
> run focused regressions, and preserve the production-library LOC estimate.
