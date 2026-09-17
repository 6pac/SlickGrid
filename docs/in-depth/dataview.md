---
title: DataView
---

# DataView

`SlickDataView` sits between your data array and the grid. It filters, sorts, pages and groups the data on the client, then feeds the result to the grid one row at a time. This chapter explains what a DataView is, how items map to rows, and how to wire the core features. For the full member list, see the [DataView API reference](/reference/dataview).

## When you need one

The grid itself is deliberately small. It renders rows and reports events. It does not filter, sort, page or group.

Use a `SlickDataView` when all the data is on the client and you want any of these:

- Client-side sorting and multi-column sorting.
- A search or filter box.
- Paging.
- Grouping with totals (see [Grouping & aggregators](/in-depth/grouping)).
- Efficient, minimal re-rendering when the data changes.

If you only show a static array and need none of the above, pass the array straight to the grid. See [Providing data to the grid](/in-depth/providing-data).

## The mental model

### A DataView is a data provider

The grid can read its data from any object with three methods:

- `getLength()` — the number of rows to render.
- `getItem(index)` — the row at an index.
- `getItemMetadata(index)` — optional per-row metadata.

`SlickDataView` implements this interface. You pass the DataView to the grid in place of the array:

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';

const dataView = new SlickDataView();
const grid = new SlickGrid('#myGrid', dataView, columns, options);
```

The grid now asks the DataView for rows. When the DataView changes the data, it tells the grid which rows to repaint through events (see [Events](#events)).

### Items vs rows

This is the most important idea in the chapter.

- **Items** are your input. They are the objects you put in with [`setItems`](/reference/dataview#m-setItems). Read them back with [`getItems`](/reference/dataview#m-getItems).
- **Rows** are the grid's output. They are what the DataView shows after filtering, paging and grouping. The grid counts rows, not items.

A row index is *not* an item index. When a grid event gives you a row number, look the object up through the DataView:

```ts
grid.onClick.subscribe((_e, args) => {
  const item = dataView.getItem(args.row); // correct
  // const item = dataView.getItems()[args.row]; // WRONG - that is an item index
});
```

Note the naming quirk, kept for history: `getItem(row)` returns a **row**, while `getItems()` returns **items**.

### The id property

Every item must have a unique id. The DataView uses it to track items as they move, and to map between ids, items and rows.

- The default id property is `id`.
- Pass a different property name as the second argument to [`setItems`](/reference/dataview#m-setItems).
- The id must be unique and convertible to a string. A duplicate or missing id throws an error.
- [`getIdPropertyName`](/reference/dataview#m-getIdPropertyName) returns the name in use.

```ts
dataView.setItems(products, 'sku'); // use the "sku" property as the id
```

## Walkthrough

### 1. Wire the DataView to the grid

Subscribe once to [`onRowsOrCountChanged`](/reference/dataview#evt-onRowsOrCountChanged). This one event replaces the older pair `onRowCountChanged` + `onRowsChanged` and tells you which of the two changed:

```ts
dataView.onRowsOrCountChanged.subscribe((_e, args) => {
  if (args.rowCountChanged) {
    grid.updateRowCount();
  }
  if (args.rowsChanged) {
    grid.invalidateRows(args.rowsDiff);
  }
  grid.render();
});
```

Use `args.rowsDiff` for the changed rows. Do not use `args.rows`; that field belongs to the older `onRowsChanged` event.

### 2. Load the data

`setItems` replaces the whole dataset and refreshes the grid:

```ts
const data = [
  { id: 1, name: 'Apple', qty: 12 },
  { id: 2, name: 'Pear', qty: 3 },
  { id: 3, name: 'Plum', qty: 7 },
];

dataView.setItems(data);
```

`setItems` fires [`onSetItemsCalled`](/reference/dataview#evt-onSetItemsCalled) and then refreshes.

### 3. Look items up by id

Since each item has an id, the DataView can map between ids, items and rows:

| Method | Returns |
| ------ | ------- |
| [`getItemById(id)`](/reference/dataview#m-getItemById) | the item with that id |
| [`getItemByIdx(idx)`](/reference/dataview#m-getItemByIdx) | the item at that index in the items array |
| [`getIdxById(id)`](/reference/dataview#m-getIdxById) | the item's index in the items array |
| [`getRowById(id)`](/reference/dataview#m-getRowById) | the item's grid row, or `undefined` if it is not visible |
| [`getRowByItem(item)`](/reference/dataview#m-getRowByItem) | the grid row for an item object |
| [`mapIdsToRows(ids)`](/reference/dataview#m-mapIdsToRows) / [`mapRowsToIds(rows)`](/reference/dataview#m-mapRowsToIds) | map arrays between ids and rows |

`getRowById` returns `undefined` when the item is filtered out or is on another page. That is expected; the item still exists, it just has no visible row.

To add, change or remove items, use [`addItem`](/reference/dataview#m-addItem), [`insertItem`](/reference/dataview#m-insertItem), [`updateItem`](/reference/dataview#m-updateItem) and [`deleteItem`](/reference/dataview#m-deleteItem) (and their plural forms). Each one refreshes the grid.

### 4. Sort

Wire the grid's [`onSort`](/reference/grid#evt-onSort) event to [`sort`](/reference/dataview#m-sort). Pass a comparer and the direction:

```ts
grid.onSort.subscribe((_e, args) => {
  const field = args.sortCol.field;
  dataView.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0), args.sortAsc);
});
```

For multi-column sorting, set the grid option [`multiColumnSort`](/reference/grid#opt-multiColumnSort). The event then gives `args.sortCols`, an array of `{ sortCol, sortAsc }`. See [Sorting](/in-depth/sorting) for the full pattern.

- `sort` reorders the underlying items array. Keep a copy first if you need the original order.
- [`reSort`](/reference/dataview#m-reSort) re-applies the last sort after the data changes.
- [`fastSort`](/reference/dataview#m-fastSort) is deprecated. Use `sort`.

### 5. Filter

A filter is a function that returns `true` to keep an item. Set it with [`setFilter`](/reference/dataview#m-setFilter):

```ts
const search = document.querySelector<HTMLInputElement>('#search')!;

dataView.setFilter((item, args) => {
  if (!args?.text) {
    return true;
  }
  return item.name.toLowerCase().includes(args.text.toLowerCase());
});

search.addEventListener('input', () => {
  dataView.setFilterArgs({ text: search.value });
  dataView.refresh();
});
```

- Pass extra data to the filter with [`setFilterArgs`](/reference/dataview#m-setFilterArgs). It arrives as the second parameter.
- `setFilterArgs` alone does not re-run the filter. Call [`refresh`](/reference/dataview#m-refresh) after it.

::: tip CSP-safe by default
In v6 all filtering is CSP-safe. The DataView calls your filter function directly and never builds code with `new Function`. It works unchanged under a strict Content-Security-Policy.

The old options [`inlineFilters`](/reference/dataview#dvopt-inlineFilters) and [`useCSPSafeFilter`](/reference/dataview#dvopt-useCSPSafeFilter) are deprecated and ignored. Do not set them.
:::

### 6. Page

Set the page size and current page with [`setPagingOptions`](/reference/dataview#m-setPagingOptions):

```ts
dataView.setPagingOptions({ pageSize: 25, pageNum: 0 });
```

Read the current state with [`getPagingInfo`](/reference/dataview#m-getPagingInfo). It returns `{ pageSize, pageNum, totalRows, totalPages, dataView }`:

```ts
const info = dataView.getPagingInfo();
dataView.setPagingOptions({ pageNum: Math.min(info.pageNum + 1, info.totalPages - 1) });
```

- A `pageSize` of `0` shows all rows on one page.
- The DataView fires [`onPagingInfoChanged`](/reference/dataview#evt-onPagingInfoChanged) whenever the page, size or total changes. Update any pager UI from that event.

The built-in `SlickGridPager` control renders a ready-made pager and keeps itself in sync. See [Controls](/reference/controls) and the [Filtering & paging](/in-depth/filtering-paging) chapter.

### 7. Batch several changes

Each mutating call refreshes the grid. When you make many changes at once, wrap them so the grid refreshes only once:

```ts
dataView.beginUpdate();
dataView.addItem({ id: 4, name: 'Fig', qty: 5 });
dataView.deleteItem(2);
dataView.updateItem(1, { id: 1, name: 'Apple', qty: 20 });
dataView.endUpdate(); // one refresh here
```

For very large insert or delete batches, use bulk mode: [`beginUpdate(true)`](/reference/dataview#m-beginUpdate). It defers index rebuilding and deletions to the [`endUpdate`](/reference/dataview#m-endUpdate) call for speed. While bulk mode is active, some lookups may return stale results until `endUpdate` runs.

### 8. Sync the selection

Without help, the grid tracks selection by row. If items move, sort or filter, the same rows stay selected instead of the same items. [`syncGridSelection`](/reference/dataview#m-syncGridSelection) fixes this by tracking selection by item id.

```ts
import { SlickRowSelectionModel } from 'slickgrid';

grid.setSelectionModel(new SlickRowSelectionModel());
dataView.syncGridSelection(grid, true);
```

- The second argument, `preserveHidden`, keeps items selected even after a filter hides them. When the filter clears, they are still selected.
- A third argument, `preserveHiddenOnSelectionChange`, keeps hidden selections while the visible selection changes (multi-select grids).
- The method returns the [`onSelectedRowIdsChanged`](/reference/dataview#evt-onSelectedRowIdsChanged) event, so you can read the full id list, including hidden selections.
- Read selections with [`getAllSelectedIds`](/reference/dataview#m-getAllSelectedIds) / [`getAllSelectedItems`](/reference/dataview#m-getAllSelectedItems), or the filtered-only [`getAllSelectedFilteredIds`](/reference/dataview#m-getAllSelectedFilteredIds) / [`getAllSelectedFilteredItems`](/reference/dataview#m-getAllSelectedFilteredItems).

`syncGridSelection` works with the row selection model, not the cell selection model. There is a matching [`syncGridCellCssStyles(grid, key)`](/reference/dataview#m-syncGridCellCssStyles) for cell CSS styles. See [Selection models](/in-depth/selection).

## Events

The DataView fires these events. Subscribe with `.subscribe((e, args) => { ... })`.

| Event | Fires when |
| ----- | ---------- |
| [`onSetItemsCalled`](/reference/dataview#evt-onSetItemsCalled) | `setItems` runs |
| [`onBeforePagingInfoChanged`](/reference/dataview#evt-onBeforePagingInfoChanged) | before paging info changes (return `false` to cancel) |
| [`onPagingInfoChanged`](/reference/dataview#evt-onPagingInfoChanged) | page, size or total row count changed |
| [`onRowCountChanged`](/reference/dataview#evt-onRowCountChanged) | the number of rows changed |
| [`onRowsChanged`](/reference/dataview#evt-onRowsChanged) | the content of some rows changed |
| [`onRowsOrCountChanged`](/reference/dataview#evt-onRowsOrCountChanged) | either of the two above changed (**use this one**) |
| [`onSelectedRowIdsChanged`](/reference/dataview#evt-onSelectedRowIdsChanged) | the synced selection changed |
| [`onGroupExpanded`](/reference/dataview#evt-onGroupExpanded) / [`onGroupCollapsed`](/reference/dataview#evt-onGroupCollapsed) | a group toggled |

### Firing order

A `refresh` fires the change events in a fixed order, and only those that apply:

1. `onBeforePagingInfoChanged`, then `onPagingInfoChanged` — only if the total row count changed.
2. `onRowCountChanged` — only if the visible row count changed.
3. `onRowsChanged` — only if some rows differ.
4. `onRowsOrCountChanged` — if either the count or the rows changed.

Prefer `onRowsOrCountChanged`. Handling the two separate events is a common source of bugs, because neither one knows whether the other will also fire. `onRowsOrCountChanged` reports both facts in one call, through `args.rowCountChanged` and `args.rowsChanged`, so its handler can do the right thing every time.

If you do use the separate events, each carries a flag naming the other: `onRowCountChanged` has `callingOnRowsChanged`, and `onRowsChanged` has `calledOnRowCountChanged`. Do not subscribe to both the pair and the combined event; pick one approach.

## Grouping

The DataView also groups data with totals. Call [`setGrouping`](/reference/dataview#m-setGrouping) and use the built-in `Aggregators` (`Avg`, `Min`, `Max`, `Sum`, `Count`). Grouping has its own chapter: [Grouping & aggregators](/in-depth/grouping).

## Common pitfalls

- **Row index is not item index.** In grid event handlers use `dataView.getItem(row)`, never `getItems()[row]`.
- **Every item needs a unique id.** A duplicate or `undefined` id throws. Set a custom id property with the second argument of `setItems`.
- **Sorting mutates your array.** `sort` reorders the items you passed to `setItems`. Copy first if you need the original order.
- **`getRowById` can return `undefined`.** A filtered or off-page item has no visible row. This is normal, not an error.
- **`setFilterArgs` needs `refresh`.** Changing the filter args does not re-run the filter on its own.
- **Use `args.rowsDiff`, not `args.rows`, in `onRowsOrCountChanged` handlers.** `rows` belongs to `onRowsChanged`.

## See also

- [DataView — API reference](/reference/dataview) — every method, option and event.
- [Providing data to the grid](/in-depth/providing-data) — the data provider interface and plain arrays.
- [Sorting](/in-depth/sorting) — single- and multi-column sorting in depth.
- [Filtering & paging](/in-depth/filtering-paging) — search boxes and the pager control.
- [Grouping & aggregators](/in-depth/grouping) — `setGrouping` and totals.
- [Selection models](/in-depth/selection) — row selection and `syncGridSelection`.
- [CSP & sanitization](/in-depth/csp) — why filtering is CSP-safe.
- [Grid — API reference](/reference/grid) — `onSort`, `updateRowCount`, `invalidateRows`, `render`.
