---
title: Migrating to v6
---

# Migrating to v6

Version 6 is a major release. It removes the last third-party dependency, replaces frozen rows and columns with pinning and sticky docking, and changes how columns are hidden. This page lists the breaking changes and how to update.

::: tip
This page describes the upcoming v6 release. Some items come from feature branches that merge at release. The copy/paste change is still a draft and may change.
:::

## SortableJS is gone

Version 6 removes the SortableJS dependency. The grid now uses native browser drag and drop.

What to change:

- Remove any `<script>` tag that loads `Sortable`.
- Remove any global assignment such as `window.Sortable = Sortable`.
- Column reordering (`enableColumnReorder`) and draggable grouping keep working. You do not configure anything new.

The package now has no runtime dependency. Install is just the grid and a theme.

## Frozen panes become pinning and sticky docking

Version 6 removes frozen panes. The grid has one scrollable viewport, and the `pinning` option docks columns and rows at its edges. You can now pin columns on the **right** as well as the left, pin rows at the **top and bottom at the same time**, and make columns and rows **sticky**, so that they dock at an edge only while scrolling would hide them.

What to change:

- Replace `frozenColumn: N` with `pinning: { columns: { left: N } }`. The boundary is the same, but it now counts visible columns only.
- Replace `frozenRow: N` with `pinning: { rows: { top: [0, …, N-1] } }`. With `frozenBottom: true`, list the last rows in `pinning.rows.bottom` instead.
- Rename `skipFreezeColumnValidation` to `skipPinningValidation`, and the `invalidColumnFreeze*` options to `invalidColumnPinning*`. `throwWhenFrozenNotAllViewable` has no replacement.
- Replace `getFrozenColumnId()` with `getPinnedColumns()`, and `validateColumnFreeze()` with `validateColumnPinning()`.
- Update your CSS selectors. The `.slick-pane-*` classes and the `-right` and `-bottom` viewport, canvas and header classes are gone.

See [Pinning and sticky docking](/in-depth/pinning-sticky) for the full guide and the complete migration table.

## Columns: the `hidden` property

Version 6 keeps all columns at all times. To hide a column, set `hidden: true` on it, instead of removing it from the array.

What to change:

- Do not filter columns out of the array to hide them. Set `hidden` instead.
- `getColumns()` returns every column, including hidden ones.
- Use [`getVisibleColumns()`](/reference/grid#m-getVisibleColumns) to read only the visible ones.

This makes show/hide reversible and keeps each column's settings while it is hidden.

## Copy and paste: the async Clipboard API (draft)

Version 6 plans to move external copy and paste to the browser's async Clipboard API, in place of the old hidden-textarea approach. This is still a draft and may change before release. Watch the [CellExternalCopyManager](/reference/plugins) entry for the final shape.

## Already gone before v6

- **jQuery** and **jQuery UI** were removed in earlier major versions. If you still load them for the grid, you can stop.

## API changes by area

These are the public additions and renames from the v6 feature branches. New members appear in the [Reference](/reference/) once the release is integrated and the reference is regenerated.

### Pinning and sticky docking (PR #1302)

- New options: `pinning`, `stickyRows`, `docking`, `skipPinningValidation`, `invalidColumnPinningPickerMessage`, `invalidColumnPinningSequenceMessage`, `invalidColumnPinningPickerCallback`, `invalidColumnPinningWidthMessage`, `invalidColumnPinningWidthCallback`, `allowDragFromClosest`, `columnResizingDelay`.
- New column properties: `pinned`, `sticky`.
- New methods: `getPinnedColumns()`, `setColumnPinning()`, `setColumnStickiness()`, `validateColumnPinning()`.
- New events: `onHeaderMouseOver`, `onHeaderMouseOut`, `onHeaderRowMouseOver`, `onHeaderRowMouseOut`, `onHeaderKeyDown`.
- Removed options: `frozenColumn`, `frozenRow`, `frozenBottom`, `frozenRightViewportMinWidth`, `skipFreezeColumnValidation`, `throwWhenFrozenNotAllViewable`, and the four `invalidColumnFreeze*` options.
- Removed methods: `getFrozenColumnId()`, `getFrozenRowOffset()`, `validateColumnFreeze()`, `validateColumnFreezeWidth()`.
- Changed: `setColumns()` returns a boolean. It returns `false`, and changes nothing, when it rejects the pinning of the new columns.
- See [Pinning and sticky docking](/in-depth/pinning-sticky).

### Column `hidden` (PR #1299)

- New option: `spreadHiddenColspan`.
- New methods: `getColumnById()`, `getVisibleColumnIndex()`, `updateColumnById()`, `getRowTop()`.
- Removed: `calculateFrozenColumnIndexById()` and `validateSetColumnFreeze()`. Pinning is validated by `validateColumnPinning()` (PR #1302).

### SortableJS removal (PRs #1242–#1244)

- The `sortablejs` dependency is removed. Column reorder and draggable grouping use native drag and drop. No public grid option or method changes.

### Clipboard (PR #1270, draft)

- The change is inside the `SlickCellExternalCopyManager` plugin (async Clipboard API). No grid option or method changes.


## See also

- [Pinning and sticky docking](/in-depth/pinning-sticky)
- [Plugins](/in-depth/plugins) · [Reference](/reference/)
