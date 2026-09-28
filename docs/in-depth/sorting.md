---
title: Sorting
---
# Sorting

SlickGrid lets the user sort by clicking a column header. This chapter shows how to make columns sortable, how to read the sort event, and how to reorder the data — either through a `SlickDataView` or by sorting a plain array yourself. It also covers multi-column sort, the sort indicators, and tri-state sort. You need this chapter whenever the grid should re-order when a header is clicked.

## Concepts

The grid does **not** sort your data. This is the one idea to hold on to.

When the user clicks a sortable header, the grid does three things:

1. It works out the new sort state (which columns, which direction).
2. It updates the sort **indicator** — the arrow glyph on the header.
3. It fires the [`onSort`](/reference/grid#evt-onSort) event.

That is all. The rows do not move until *you* reorder the data in an `onSort` handler and re-render. If you never subscribe to `onSort`, the arrow flips but the rows stay put.

So sorting is a two-part job:

- **The grid** detects the click, tracks the sort state, and draws the indicator.
- **You** listen to `onSort` and reorder the data — most easily through a [`SlickDataView`](/in-depth/dataview).

The grid keeps the current sort state internally. Read it with [`getSortColumns`](/reference/grid#m-getSortColumns) and set it with [`setSortColumns`](/reference/grid#m-setSortColumns). Those methods move only the indicator, never the data.

## The `onSort` arguments

`onSort` (and [`onBeforeSort`](/reference/grid#evt-onBeforeSort)) pass one of two argument shapes. Which one you get depends on the [`multiColumnSort`](/reference/grid#opt-multiColumnSort) option. The two shapes form a discriminated union — check `args.multiColumnSort` first.

**Single-column mode** (`multiColumnSort: false`, the default) — `SingleColumnSort`:

| Field | Type | Meaning |
| --- | --- | --- |
| `multiColumnSort` | `false` | Discriminant. |
| `sortCol` | `Column` \| `null` | The clicked column definition. `null` when the sort was cleared (tri-state). |
| `columnId` | `string \| number` \| `null` | Id of that column, or `null` when cleared. |
| `sortAsc` | `boolean` | `true` for ascending. |
| `previousSortColumns` | `ColumnSort[]` | The sort state before this click. |
| `grid` | `SlickGrid` | The grid instance (added to every event). |

**Multi-column mode** (`multiColumnSort: true`) — `MultiColumnSort`:

| Field | Type | Meaning |
| --- | --- | --- |
| `multiColumnSort` | `true` | Discriminant. |
| `sortCols` | `ColumnSort[]` | One entry per sorted column, in precedence order. |
| `previousSortColumns` | `ColumnSort[]` | The sort state before this click. |
| `grid` | `SlickGrid` | The grid instance. |

Each `ColumnSort` in `sortCols` is `{ columnId, sortAsc, sortCol }`. Hidden or removed columns are dropped from the array for you.

Read these fields from the source interfaces `SingleColumnSort`, `MultiColumnSort`, and `ColumnSort`. Note the asymmetry: single mode gives you one column through `sortCol`/`sortAsc`; multi mode gives you an array through `sortCols`.

## Walkthrough

### 1. Make columns sortable

Set [`sortable: true`](/reference/column#col-sortable) on each column the user may sort. Header clicks are wired for you; no grid option is needed to turn sorting on.

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';
import type { Column, GridOption } from 'slickgrid';

interface Task {
  id: number;
  title: string;
  duration: number;
  percentComplete: number;
}

const columns: Column<Task>[] = [
  { id: 'title', name: 'Title', field: 'title', sortable: true },
  { id: 'duration', name: 'Duration', field: 'duration', sortable: true },
  { id: 'percent', name: '% Complete', field: 'percentComplete', sortable: true },
];
```

A column with no `sortable` (or `sortable: false`) shows no arrow and ignores clicks. By default the first click sorts ascending. Set [`defaultSortAsc: false`](/reference/column#col-defaultSortAsc) on a column to sort it descending first.

### 2. Reorder through a DataView (recommended)

A `SlickDataView` can sort the data for you. Give it a comparer and the direction, and — once its change events are wired to the grid (see below) — the sorted rows repaint.

```ts
const dataView = new SlickDataView<Task>();
const grid = new SlickGrid<Task>('#myGrid', dataView, columns, {});
dataView.setItems(tasks);

grid.onSort.subscribe((_e, args) => {
  if (args.multiColumnSort || !args.sortCol) {
    return; // handled elsewhere, or the sort was cleared
  }
  const field = args.sortCol.field as keyof Task;
  dataView.sort((a, b) => {
    const x = a[field];
    const y = b[field];
    return x === y ? 0 : x > y ? 1 : -1;
  }, args.sortAsc);
});
```

Write the comparer for **ascending** order and pass `args.sortAsc` as the second argument. [`sort`](/reference/dataview#m-sort) applies the direction itself and keeps equal rows in their existing order (a stable sort). Do not invert the comparer by hand — let the flag do it.

This works only when the DataView's change events are connected to the grid. Subscribe `onRowsChanged`/`onRowCountChanged` to repaint — shown in [Adding a DataView](/introduction/dataview) and [DataView](/in-depth/dataview). With that wiring in place, `dataView.sort(...)` repaints the grid for you, so you do not call `render` yourself.

### 3. Or sort a plain array yourself

Without a DataView, the grid is backed by your array. Sort the array in place, then repaint with [`invalidate`](/reference/grid#m-invalidate).

```ts
const data: Task[] = [...];
const grid = new SlickGrid<Task>('#myGrid', data, columns, {});

grid.onSort.subscribe((_e, args) => {
  if (args.multiColumnSort || !args.sortCol) {
    return;
  }
  const field = args.sortCol.field as keyof Task;
  const sign = args.sortAsc ? 1 : -1;
  data.sort((a, b) => {
    const x = a[field];
    const y = b[field];
    return (x === y ? 0 : x > y ? 1 : -1) * sign;
  });
  grid.invalidate(); // re-render with the new order
});
```

Two differences from the DataView path:

- `Array.prototype.sort` has no direction flag, so put the direction **inside** the comparer (multiply by `sign`).
- You must call `grid.invalidate()` yourself. It refreshes the row count and repaints the visible rows.

Sorting reorders the array you passed in. Keep a copy first if you need the original order back.

### 4. Multi-column sort

Set [`multiColumnSort: true`](/reference/grid#opt-multiColumnSort) to let the user sort by more than one column. With it on, `onSort` gives you `args.sortCols` instead of a single column.

```ts
const options: GridOption = { multiColumnSort: true };

grid.onSort.subscribe((_e, args) => {
  if (!args.multiColumnSort) {
    return;
  }
  const sortCols = args.sortCols;
  dataView.sort((a, b) => {
    for (const { sortCol, sortAsc } of sortCols) {
      const field = sortCol!.field as keyof Task;
      const sign = sortAsc ? 1 : -1;
      const x = a[field];
      const y = b[field];
      if (x !== y) {
        return (x > y ? 1 : -1) * sign;
      }
    }
    return 0;
  });
});
```

One comparer handles every column. It compares by the first column, and only moves to the next column when the values are equal. Each column carries its own `sortAsc`, so the direction goes **inside** the comparer here — do not pass an `ascending` flag to `sort`.

By default the user builds a multi-sort with modifier keys:

- **Click** a header — sort by that column only.
- **Shift-click** — add the column to the sort (or toggle its direction if already there).
- **Meta-click** (Cmd on macOS) — remove the column from the sort.

To handle both single- and multi-column modes with one block, normalise the args into an array:

```ts
const sortCols = args.multiColumnSort
  ? args.sortCols
  : args.sortCol
    ? [{ sortCol: args.sortCol, sortAsc: args.sortAsc }]
    : [];
```

Then run the loop-based comparer above over `sortCols`.

### 5. Show the sort indicator programmatically

To restore a saved sort, or to sort the grid on startup, set the indicator with [`setSortColumns`](/reference/grid#m-setSortColumns) and then sort the data to match. `setSortColumns` draws the arrows only; it does not reorder anything.

```ts
// draw the ascending arrow on the Duration header
grid.setSortColumns([{ columnId: 'duration', sortAsc: true }]);

// then apply the matching sort yourself
dataView.sort((a, b) => a.duration - b.duration, true);
```

For a single column, [`setSortColumn`](/reference/grid#m-setSortColumn) is a shorthand:

```ts
grid.setSortColumn('duration', true); // columnId, ascending
```

Read the current state back with [`getSortColumns`](/reference/grid#m-getSortColumns). It returns a `ColumnSort[]` you can persist (for example, to `localStorage`) and replay later.

```ts
const saved = grid.getSortColumns(); // [{ columnId, sortAsc }, ...]
```

Because `setSortColumns` does not fire `onSort`, it will not trigger your handler. Sort the data in the same place you set the columns.

Turn on [`numberedMultiColumnSort`](/reference/grid#opt-numberedMultiColumnSort) (off by default) to show precedence numbers (1, 2, 3…) beside the arrows when more than one column is sorted. [`sortColNumberInSeparateSpan`](/reference/grid#opt-sortColNumberInSeparateSpan) renders that number in its own span for easier styling.

### 6. Tri-state sort

Set [`tristateMultiColumnSort: true`](/reference/grid#opt-tristateMultiColumnSort) to cycle each column through three states on repeated clicks:

1. First click — ascending.
2. Second click — descending.
3. Third click — sort removed.

With `multiColumnSort` also on, tri-state lets the user build a multi-column sort by clicking columns in turn — no Shift or Meta key needed. Each click cycles the clicked column while the others stay sorted.

Handle the cleared state in your handler. In single mode, `args.sortCol` is `null` when the sort is removed; in multi mode, `args.sortCols` is empty. Restore the original order when nothing is sorted — sort by a stable field such as the id, or re-set the items.

### 7. Veto a sort with `onBeforeSort`

[`onBeforeSort`](/reference/grid#evt-onBeforeSort) fires before `onSort`, with the same arguments. Return `false` from a handler to cancel the sort: the indicator does not change and `onSort` never fires.

```ts
grid.onBeforeSort.subscribe((_e, _args) => {
  if (!userMayReorder) {
    return false; // cancel this sort
  }
});
```

Use it to block sorting while data loads, or to route sorting to a server instead of the client.

## Re-sorting after data changes

A DataView does not re-sort automatically when the data changes. After you add or replace items, call [`reSort`](/reference/dataview#m-reSort) to re-apply the last sort:

```ts
dataView.setItems(newTasks);
dataView.reSort(); // re-applies the previous comparer and direction
```

`reSort` does nothing if no sort has run yet. To keep a sorted view sorted as single items arrive, use [`sortedAddItem`](/reference/dataview#m-sortedAddItem) and [`sortedUpdateItem`](/reference/dataview#m-sortedUpdateItem) instead of a full re-sort. Both need a comparer, so call `sort` at least once first.

## Notes and pitfalls

- **The grid never sorts data.** If rows do not move, you forgot to subscribe to `onSort`, or your handler returned early.
- **DataView re-renders once wired; a plain array does not.** With the DataView's change events connected to the grid, `dataView.sort(...)` repaints it. After sorting your own array, call `grid.invalidate()` yourself.
- **Direction: flag vs comparer.** With one column, pass `args.sortAsc` to `dataView.sort`. With multiple columns (or a plain array), put the direction inside the comparer. Never do both — you would cancel the effect.
- **`args` is a union.** Check `args.multiColumnSort` before reading `sortCol` or `sortCols`. TypeScript narrows the type for you once you do.
- **Handle the cleared sort.** With tri-state, `sortCol` can be `null` and `sortCols` can be empty. Decide what "no sort" means for your data.
- **Comparers must be a total order.** Return a negative number, `0`, or a positive number. Return `0` for equal values; add a tiebreak (such as the id) if you need a deterministic order.
- **Sorting mutates your array.** `dataView.sort` and `Array.prototype.sort` reorder the items in place. Copy first if you need the original order.
- **`fastSort` is deprecated.** [`fastSort`](/reference/dataview#m-fastSort) was an old IE workaround. Use [`sort`](/reference/dataview#m-sort).
- **Number badges need two columns.** `numberedMultiColumnSort` shows precedence numbers only while more than one column is sorted.

## See also

- [Grid events: `onSort`](/reference/grid#evt-onSort) · [`onBeforeSort`](/reference/grid#evt-onBeforeSort)
- [Grid methods: `setSortColumns`](/reference/grid#m-setSortColumns) · [`setSortColumn`](/reference/grid#m-setSortColumn) · [`getSortColumns`](/reference/grid#m-getSortColumns) · [`invalidate`](/reference/grid#m-invalidate)
- [Grid options: `multiColumnSort`](/reference/grid#opt-multiColumnSort) · [`tristateMultiColumnSort`](/reference/grid#opt-tristateMultiColumnSort) · [`numberedMultiColumnSort`](/reference/grid#opt-numberedMultiColumnSort) · [`sortColNumberInSeparateSpan`](/reference/grid#opt-sortColNumberInSeparateSpan)
- [Column properties: `sortable`](/reference/column#col-sortable) · [`defaultSortAsc`](/reference/column#col-defaultSortAsc)
- [DataView methods: `sort`](/reference/dataview#m-sort) · [`reSort`](/reference/dataview#m-reSort) · [`sortedAddItem`](/reference/dataview#m-sortedAddItem) · [`sortedUpdateItem`](/reference/dataview#m-sortedUpdateItem)
- [DataView](/in-depth/dataview) — filtering, paging, and grouping on the same object.
- [Providing data](/in-depth/providing-data) — arrays vs the DataView contract.
