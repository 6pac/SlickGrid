# Pinning and sticky docking

SlickGrid renders one scrollable viewport with one canvas. Columns and rows can be *pinned*
(always docked at an edge) or *sticky* (docked only while normal scrolling would move them out
of view). Both are resolved by the same internal docking logic and rendered without extra
panes: every row is one DOM node with a left, centre and right cell region, pinned rows are
moved into a small overlay outside the scrolling canvas, and a grid that uses docking scrolls
horizontally through one dedicated scrollbar below the body.

## Permanent pinning

```ts
const options = {
  pinning: {
    columns: { left: 2, right: 1 },
    rows: { top: [0], bottom: ['summary'] },
  },
};
```

### Columns

- `pinning.columns.left` — a number is an inclusive zero-based boundary among the *visible*
  columns (`2` pins the first three visible columns). An array lists explicit columns.
- `pinning.columns.right` — a number is a count from the trailing edge of the visible columns
  (`1` pins the last visible column). An array lists explicit columns.
- Array entries are column **indexes** when numeric and column **ids** when strings. A numeric
  entry is never matched against a numeric column id. Arrays may be non-contiguous
  (`left: ['account', 'status']`).
- `Column.pinned: 'left' | 'right' | null` is the per-column form and is kept in sync with the
  option; `grid.setColumnPinning(columnId, side)` changes one column at runtime and
  `grid.getPinnedColumns(side?)` reads the current state.
- Pinning is validated: a request that pins every visible column, or whose bands would consume
  more than `docking.maxColumnViewportWidthPercent` of the viewport, is rejected and the previous
  state is kept. `invalidColumnPinningPickerCallback` / `invalidColumnPinningWidthCallback`
  (default `alert`) receive the message (`invalidColumnPinning*Message`), and
  `skipPinningValidation: true` disables the check. Hiding a column through the Column Picker or
  Grid Menu runs the same validation. A colspan that would be split so that its pieces are no
  longer in left → centre → right order is rejected with `invalidColumnPinningSequenceMessage`.
- Columns are reordered within their band only; dragging a header never moves a column across
  a band. Changing a band is an explicit pinning operation.

### Rows

- `pinning.rows.top` / `pinning.rows.bottom` — arrays of row references, in one of three forms:

  | Reference | Meaning |
  |---|---|
  | `5` | row **index** 5 |
  | `'order-5'` | the row whose dataset id is `'order-5'` |
  | `{ id: 5 }` | the row whose dataset id is `5` |

  The object form exists so that a grid with numeric dataset ids can still pin by id: a bare
  number is always an index. Id references follow their row when the data is sorted or filtered;
  index references address whatever row currently occupies that position. Rows may be
  non-contiguous (`top: [0, 2, 4]`); the unpinned rows are laid out contiguously so no gaps
  appear.
- Pinned rows keep their place in the dataset and in the scroll height. Their slot collapses
  under the pinned band, so every scrolling row, including the add-new row, stays reachable.
- Permanent rows are always rendered in full; there is no budget for them (see
  `docking.minCenterRowCount` below).
- Rows are changed at runtime with `grid.setOptions({ pinning: { rows: { top: [...] } } })`. The
  `top`/`bottom` arrays are replaced, not merged. `setOptions({ pinning: undefined })` and
  `setOptions({ pinning: null })` both remove pinning entirely and return the grid to the plain
  layout.
- Index references do not survive a change in row count. A grid that pins "the last row" while
  filtering has to recompute the reference when the count changes, as
  `examples/example-pinning-columns-and-rows.html` does; otherwise the reference points past the
  end of the filtered set and the band disappears.
- In each band the permanent rows sit at the outer edge and active sticky rows stack inside them:
  a sticky row docked at the bottom sits **above** a permanently pinned bottom row, mirroring the
  top band, and carries `slick-row-pinned-bottom-edge`.

## Sticky docking

```ts
const columns = [
  { id: 'account', field: 'account', sticky: 'left' },
  { id: 'q1', field: 'q1', sticky: 'both' },
];
const options = {
  stickyRows: { top: ['subtotal'], bottom: ['total'], both: ['net'] },
};
```

- `Column.sticky`: `'left'` or `'right'` docks at that physical edge once scrolling would clip the
  column; `'both'` docks at the nearer edge; `true` means the leading edge (`left` in LTR, `right`
  in RTL). `grid.setColumnStickiness(columnId, value)` changes it at runtime.
- `stickyRows.top` docks a row when its natural position crosses the top edge, `bottom` when it
  crosses the bottom edge, `both` at the nearer edge. References follow the same index/id rule as
  pinned rows.
- Sticky membership is recomputed from the current scroll position (including direct jumps), so it
  is never serialized in grid state.
- Multiple sticky rows stack in dataset order inside the budget below; they do not push each
  other out.

### Budgets (`docking` option)

| Option | Default | Meaning |
|---|---|---|
| `maxColumnViewportWidthPercent` | 60 | Maximum share of the viewport width the left and right bands (permanent + sticky) may occupy. |
| `maxRowViewportHeightPercent` | 60 | Maximum share of the viewport height that *sticky* rows may occupy after permanent rows are deducted. |
| `overflowStrategy` | `'conveyor'` | When the budget is exhausted: `conveyor` keeps the most recently activated candidates, `clamp` keeps the earliest ones. A candidate larger than the remaining budget stays in normal flow. |
| `stickyActivationBuffer` | 2 | Activation buffer in pixels for sticky columns. Rows use the exact boundary. |
| `minCenterRowCount` | 3 | When permanent top/bottom rows would leave less than this many centre rows visible, the container grows (`min-height`) instead of shrinking the centre to nothing. `0` disables. |

## Rendering notes

- Colspans that cross a band boundary keep one logical host cell (formatters, selection,
  navigation) and render a continuation in each further band. Every piece is clipped to its own
  band, and each continuation carries a presentational copy of the host's content, offset by what
  the earlier bands already showed, so the content reads as one cell while nothing is painted over
  the band beside it. The copy is `aria-hidden`; assistive technology and the API see only the
  host. Full-width group rows are rendered as one viewport-wide cell.
- Row spans are supported; a spanning cell that starts in a pinned row stays in the overlay.
- Pinned separators are painted with inset shadows, not layout borders, so header and body widths
  stay aligned across themes. The active theme can override the `--slick-pinned-*` custom
  properties read by `_slick-docking.scss`.

## DOM and selectors

| Selector | Meaning |
|---|---|
| `.slick-vertical-scroller` | The element that owns vertical scrolling (always `.slick-viewport`). |
| `.slick-horizontal-scroller` | The element that owns horizontal scrolling: `.slick-viewport` on a plain grid, `.slick-docking-horizontal-scroller` when docking is configured. |
| `.slick-row > .slick-pinned-left-cells / .slick-scrolling-cells / .slick-pinned-right-cells` | The three cell regions of a row on a docking grid. |
| `.slick-header-columns-left / -center / -right` (and `slick-headerrow-columns-*`, `slick-footerrow-columns-*`) | Chrome regions on a docking grid. On a plain grid the roots keep the legacy `.slick-header-columns-left` class. |
| `.slick-docking-overlay` | The layer that holds pinned and active sticky rows. Created only when row docking is configured. |
| `.slick-row-pinned-top / -bottom`, `.slick-row-sticky`, `.slick-column-pinned-left / -right`, `.slick-column-sticky` | State classes on rows and header cells. |

`grid.getCellFromPoint(x, y)` takes canvas-relative coordinates and resolves them through the
rendered layout (bands, overlay rows, non-contiguous shifts), including rows that are not rendered.

## Migrating from frozen panes (v5)

| v5 | Now |
|---|---|
| `frozenColumn: N` | `pinning: { columns: { left: N } }` (same inclusive boundary, now counted over visible columns) |
| `frozenRow: N` | `pinning: { rows: { top: [0, …, N-1] } }` |
| `frozenRow: N, frozenBottom: true` | `pinning: { rows: { bottom: [len-N, …, len-1] } }` |
| `frozenRightViewportMinWidth` | removed; use `docking.maxColumnViewportWidthPercent` |
| `skipFreezeColumnValidation` | `skipPinningValidation` |
| `invalidColumnFreezePickerMessage/Callback`, `invalidColumnFreezeWidthMessage/Callback`, `throwWhenFrozenNotAllViewable` | `invalidColumnPinningPickerMessage/Callback`, `invalidColumnPinningWidthMessage/Callback` (no throwing variant) |
| `grid.getFrozenColumnId()`, `grid.getFrozenRowOffset()`, `grid.validateColumnFreeze()`, `grid.validateColumnFreezeWidth()` | `grid.getPinnedColumns()`, `grid.validateColumnPinning()`; row offsets are internal |
| `getCanvases()`, `getViewports()`, `getHeaderRow()`, `getFooterRow()` returning left/right pairs | One element each; the array-returning forms still return one entry |
| `.slick-pane-*`, `.slick-viewport-right`, `.slick-viewport-bottom`, `.grid-canvas-right`, `.grid-canvas-bottom`, `.slick-header-right`, `.slick-headerrow-right`, `.slick-footerrow-right` | Removed. Use the selectors in the table above. `slick-viewport-top slick-viewport-left` and `grid-canvas-top grid-canvas-left` remain on the single viewport/canvas. |
| Column reorder across the frozen boundary | Not possible; pin/unpin explicitly |
| Grid State plugin `frozenColumn` | Not persisted; store `pinning` from `grid.getOptions()` |

`setColumns()` now returns a boolean. It validates the prospective pinning on a copy first, so a
rejected set leaves the caller's column definitions untouched and fires no `onBeforeSetColumns`;
it returns `false` in that case and `true` once the columns are applied.

`onHeaderKeyDown` is typed `OnHeaderKeyDownEventArgs` and publishes `{ event, column, grid }`.

The following grid methods were removed because nothing called them: `getColumnByIdx()` (use
`getColumns()[idx]`), `getColumnHeaderByIndex()` (use `getColumnByIndex()`) and
`removeCellCssStylesBatch()` (iterate `removeCellCssStyles()`). `getTopPanels()` returns the one
top panel this layout has rather than the same element twice.

Header, header-row, footer and cell events keep their argument shapes. `getGridPosition()` and
`getActiveCellPosition()` still return document-relative positions. `applyHtmlCode()`,
`trigger()`, `validateAndEnforceOptions()` and the `set*Visibility(visible, animate)` signatures
are unchanged from v5.

## Known limitations

- **RTL and docking do not work together.** A right-to-left grid still creates the docking
  scrollbar but takes the non-proxy geometry path, and the two disagree: a right-pinned column
  is placed outside the visible area (measured at roughly -859px against a 598px viewport) and an
  activated sticky column goes with it. `getCellFromPoint()` deliberately skips the docked
  hit-test path for RTL, so coordinates over a docked band resolve against the natural layout.
  Use pinning and sticky columns in LTR grids only until the docking geometry is mirrored.
- Sticky group headers (a header spanning several columns that itself stays visible) are not
  supported.
- There is no built-in Header Menu or Grid Menu command for pinning; an application adds its own
  menu command that calls `grid.setColumnPinning(columnId, side)`.

## Examples

`examples/example-pinning-columns.html`, `example-pinning-columns-and-rows.html`,
`example-pinning-rows.html`, `example-pinning-columns-and-column-group.html`,
`example-pinning-columns-and-rows-spreadsheet.html`, `example-variable-row-height-pinning.html`
and `example-sticky-financial-report.html`. Browser coverage lives in `cypress/e2e/*pinning*`,
`*sticky*`, `quirk-pinning-*` and `example-colspan.cy.ts`.
