---
title: Migrating to v6
---

# Migrating to v6

Version 6 is a major release. It removes the last third-party dependency, reworks frozen rows and columns, and changes how columns are hidden. This page lists the breaking changes and how to update.

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

## Frozen rows and columns: the 3×3 band model

Version 6 reworks frozen panes. You can now freeze columns on the **right** as well as the left, and freeze rows at the **top and bottom at the same time**. The grid is organised as a 3×3 band of viewports.

See [Frozen rows & columns](/in-depth/frozen) for the full guide and the option list.

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

### Frozen columns (PR #1238)

- New options: `frozenRightColumn`, `frozenBottomRow`, `lazyPanes`.
- New methods: `getFrozenBandCounts()`, `getFrozenRightStartIndex()`.
- See [Frozen rows & columns](/in-depth/frozen).

### Column `hidden` (PR #1299)

- New option: `spreadHiddenColspan`.
- New methods: `getColumnById()`, `getVisibleColumnIndex()`, `updateColumnById()`, `getRowTop()`, `validateColumnFreeze()`.
- Renamed: `calculateFrozenColumnIndexById()` and `validateSetColumnFreeze()` are replaced by `validateColumnFreeze()`.

### SortableJS removal (PRs #1242–#1244)

- The `sortablejs` dependency is removed. Column reorder and draggable grouping use native drag and drop. No public grid option or method changes.

### Clipboard (PR #1270, draft)

- The change is inside the `SlickCellExternalCopyManager` plugin (async Clipboard API). No grid option or method changes.


## See also

- [Frozen rows & columns](/in-depth/frozen)
- [Plugins](/in-depth/plugins) · [Reference](/reference/)
