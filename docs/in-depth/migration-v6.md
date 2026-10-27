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
- Rename `skipFreezeColumnValidation` to `skipPinningValidation`, and the `invalidColumnFreeze*Message` options to `invalidColumnPinning*Message`. `throwWhenFrozenNotAllViewable` has no replacement.
- Replace `invalidColumnFreezePickerCallback` and `invalidColumnFreezeWidthCallback` with the shared `errorCallback`. Keep the picker and width messages configurable with `invalidColumnPinningPickerMessage` and `invalidColumnPinningWidthMessage`.
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

## Removed deprecated code

### DataView `fastSort()`

The IE-specific `fastSort(field, ascending)` method has been removed. Use `sort(comparer, ascending)` instead. For example, to sort a string field:

```ts
dataView.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0, true);
```

Choose a comparator that matches your data and desired ordering. `reSort()` continues to reapply the comparator and direction passed to `sort()`.

### Legacy browser fallbacks

IE-specific stylesheet and global-event fallbacks have been removed. The Resizer plugin's `resizeGrid()` now always returns a Promise; its fallback for browsers without Promise support has been removed.

### Row positioning: `rowTopOffsetRenderType`

Version 6 removes the `rowTopOffsetRenderType` grid option. Remove it from your configuration, whether its value was `'top'` or `'transform'`. Row Detail and RowSpan no longer require an explicit `'top'` setting.

```diff
const gridOptions: GridOption = {
- rowTopOffsetRenderType: 'top',
  rowHeight: 25,
  // ... other grid options
};
```

Ordinary grid rows now use `transform: translateY(25px)` instead of `top: 25px` for scrolling performance. RowSpan host rows and the rows they cover retain internal `top` positioning so spanning cells and pinned columns stack correctly. The grid chooses the positioning automatically; no configuration is required.

The `SlickRowDetailView` plugin now renders detail panels in a canvas overlay. Its options are still passed to the plugin constructor, and there is no `renderMode` option to configure in this project. Each panel sits over the padding rows reserved below its parent (including shifts from pinned rows) and stays within the visible viewport width while scrolling horizontally.

If your custom CSS or tests locate a detail panel through its former cell sibling, update the selector to use the overlay:

```diff
- .slick-cell + .dynamic-cell-detail
+ .slick-row-detail-overlay .dynamic-cell-detail
```

The `.dynamic-cell-detail`, `.detail-container`, and item-specific detail classes remain available. If your tests inspect row positions, expect transforms on ordinary rows and `top` positioning on rows involved in a RowSpan.

## Grid Menu layout

_The following changes should be transparent to most users; they are listed here in case of side effects with custom styling._

Grid Menu now uses CSS flexbox instead of `calc(100% - 18px)` to position its button beside the column headers or pre-header. This improves alignment and gives the last column's resize handle room when the vertical scrollbar gutter is at least as wide as the menu slot; with overlay scrollbars (macOS) or no vertical scrollbar the slot still covers the trailing `menuWidth + 2` pixels of the last column at full horizontal scroll, as the previous layout did.

The default `gridMenu.menuWidth` is now `12` pixels, plus 2 pixels of spacing, and acts as a minimum: an icon class wider than that widens the slot instead of being clipped. The `resizeOnShowHeaderRow` option is deprecated and ignored because the menu no longer changes filter-row widths. Review custom CSS that positions `.slick-gridmenu-button` or overrides header widths.

## Already gone before v6

- **jQuery** and **jQuery UI** were removed in earlier major versions. If you still load them for the grid, you can stop.

## API changes by area

These are the public additions and renames from the v6 feature branches. New members appear in the [Reference](/reference/) once the release is integrated and the reference is regenerated.

### Pinning and sticky docking (PR #1302)

- New options: `pinning`, `stickyRows`, `docking`, `skipPinningValidation`, `errorCallback`, `invalidColumnPinningPickerMessage`, `invalidColumnPinningSequenceMessage`, `invalidColumnPinningWidthMessage`, `allowDragFromClosest`, `columnResizingDelay`.
- New column properties: `pinned`, `sticky`.
- New methods: `getPinnedColumns()`, `setColumnPinning()`, `setColumnStickiness()`, `validateColumnPinning()`.
- New events: `onHeaderMouseOver`, `onHeaderMouseOut`, `onHeaderRowMouseOver`, `onHeaderRowMouseOut`, `onHeaderKeyDown`.
- Removed options: `frozenColumn`, `frozenRow`, `frozenBottom`, `frozenRightViewportMinWidth`, `skipFreezeColumnValidation`, `throwWhenFrozenNotAllViewable`, and the four `invalidColumnFreeze*` options.
- Removed methods: `getFrozenColumnId()`, `getFrozenRowOffset()`, `validateColumnFreeze()`, `validateColumnFreezeWidth()`.
- Changed: `setColumns()` returns a boolean. It returns `false`, and changes nothing, when it rejects the pinning of the new columns.
- See [Pinning and sticky docking](/in-depth/pinning-sticky).

For simplification, the previous frozen error callbacks were merged into a single grid option `errorCallback` for all error messages. The specific messages remain configurable through the new pinning error messages (`invalidColumnPinningWidthMessage`, `invalidColumnPinningPickerMessage`, and `invalidColumnPinningSequenceMessage`):

```diff
const gridOptions: GridOption = {
- invalidColumnFreezePickerCallback: (msg) => alert(msg),
- invalidColumnFreezeWidthCallback: (msg) => alert(msg),
+ errorCallback: (msg) => alert(msg),
};
```

### Column `hidden` (PR #1299)

- New option: `spreadHiddenColspan`.
- New methods: `getColumnById()`, `getVisibleColumnIndex()`, `updateColumnById()`, `getRowTop()`.
- Removed: `calculateFrozenColumnIndexById()` and `validateSetColumnFreeze()`. Pinning is validated by `validateColumnPinning()` (PR #1302).

##### jQueryUI CSS classes leftovers (PR #1313)

Since we dropped jQueryUI back in v4, there is no need to keep references to `.ui-...` CSS classes. All DOM elements with `.ui-...` CSS classes already had `.slick-...` classes for a while already, so in this version we are just cleaning up the few remaining traces of jQueryUI CSS classes like `.ui-state-default` and other similar classes in the core lib, they were all removed in this release. If you were querying any of them in CSS for styling purposes, you can simply rename them to `.slick-state-*`

```diff
- .ui-state-default, .ui-state-hover {
+ .slick-state-default, .slick-state-hover {
}
```

### SortableJS removal (PRs #1242–#1244)

- The `sortablejs` dependency is removed. Column reorder and draggable grouping use native drag and drop. No public grid option or method changes.
- Changed: `SlickDraggableGrouping.getSetupColumnReorder()` returns `{ columnReorderDragInstance }` (an object with a `destroy()` method) instead of the SortableJS instances `{ sortableLeftInstance, sortableCenterInstance, sortableRightInstance }`.

### Custom tooltips (PR #1316)

- Removed the `hideArrow` option from `CustomTooltipOption`; custom tooltips no longer render an arrow.
- New options include `bodyClassName`, `repositionByMouseOverTarget`, `useRegularTooltipFromCellTextOnly`, `persistOnHover`, `autoHideDelay`, `observeAllTooltips`, and `observeTooltipContainer`.
- The custom tooltip plugin can now show tooltips on elements outside the grid. Enable `observeAllTooltips` to observe `title` and `data-slick-tooltip` attributes. Observation defaults to the document body; set `observeTooltipContainer` to limit it to selected containers.

```ts
import { SlickCustomTooltip, SlickGrid } from 'slickgrid';

const grid = new SlickGrid('#myGrid', data, columns, {
  customTooltip: {
    observeAllTooltips: true,
    observeTooltipContainer: '.toolbar, #dialog', // optional; defaults to body
  },
});
grid.registerPlugin(new SlickCustomTooltip());
```

See [Custom tooltips](/in-depth/custom-tooltips) for usage and all available options.

### Clipboard (PR #1270, draft)

- The change is inside the `SlickCellExternalCopyManager` plugin (async Clipboard API). No grid option or method changes.

### Alpine Theme (PR #1317)

- SASS/CSS variables previously used `$alpine-...` (SASS) or `--alpine-...` (CSS) but everything else in SlickGrid stylesheets already use `.slick-...` as CSS classes. So in v6 we are aligning everything and making all variables and classes start with the `slick-` prefix, for example:

```diff
# SASS
- $alpine-odd-row-color: #fbfbfb;
+ $slick-odd-row-color: #fbfbfb;

# CSS
body {
- --alpine-odd-row-color: #fbfbfb;
+ --slick-odd-row-color: #fbfbfb;
}
```

## See also

- [Pinning and sticky docking](/in-depth/pinning-sticky)
- [Plugins](/in-depth/plugins) · [Reference](/reference/)

## Scroll rendering performance

Large vertical scroll jumps now render synchronously by default (`scrollRenderThrottling: 0`). Set a positive delay, such as `10`, to retain timer throttling. Horizontal rendering keeps its existing animation-frame scheduler.

The per-cell `onBeforeAppendCell` event and `OnBeforeAppendCellEventArgs` type were removed. Return classes from a formatter instead:

```ts
const formatter = (_row, _cell, value) => ({
  text: String(value),
  addClasses: value > 50 ? 'high-value' : '',
});
```

Plain strings without `<` or `&` now use `textContent` directly and bypass the sanitizer. Markup and entity-containing strings retain the existing sanitization/rendering path. A sanitizer should not be used as a general plain-text transformation hook.
