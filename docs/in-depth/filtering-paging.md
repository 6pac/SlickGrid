---
title: Filtering & paging
---

# Filtering & paging

This chapter shows how to filter and page grid data with a `SlickDataView`. Filtering hides the rows that do not match a test. Paging shows one block of rows at a time. Both run on the client, inside the DataView. You need this chapter when you add a search box, a per-column filter row, or a pager. It builds on the [DataView](/in-depth/dataview) chapter; read that first if the terms *items* and *rows* are new.

## Concepts

### The DataView does the work

The grid renders rows and reports events. It does not filter or page. The `SlickDataView` filters the items, then pages the result, then feeds the visible rows to the grid. If you have no DataView, you cannot filter or page. See [Providing data to the grid](/in-depth/providing-data).

### Filter first, then page

Order matters. The DataView applies the filter first. It pages the filtered rows second. So [`getPagingInfo()`](/reference/dataview#m-getPagingInfo) reports `totalRows` and `totalPages` for the *filtered* rows, not for every item. When a new filter makes the current page fall past the last row, the DataView moves you to the last page.

### A filter is a predicate

A filter is one function. It receives an item and returns `true` to keep it:

```ts
type FilterFn = (item: any, args: any) => boolean;
```

Return `true` to show the row. Return `false` to hide it. The second parameter, `args`, carries any live values you supply, such as the text from a search box.

### The filter row is your own HTML

SlickGrid does not build filter inputs for you. It gives you a second header row and one event. You create the inputs. You read their values. You call the filter. This keeps the grid small and free of assumptions about your UI.

### The pager is optional UI

Paging is an API on the DataView: [`setPagingOptions`](/reference/dataview#m-setPagingOptions), [`getPagingInfo`](/reference/dataview#m-getPagingInfo), and [`onPagingInfoChanged`](/reference/dataview#evt-onPagingInfoChanged). The [`SlickGridPager`](/reference/controls) control is ready-made UI over that API. You can also build your own pager from the same three members.

::: tip Filtering is always CSP-safe
In v6 the DataView calls your filter function directly. It never compiles code with `new Function`. Filtering works under a strict Content-Security-Policy with no change.

The old options [`inlineFilters`](/reference/dataview#dvopt-inlineFilters) and [`useCSPSafeFilter`](/reference/dataview#dvopt-useCSPSafeFilter) are **deprecated and ignored**. Do not set them. See [CSP & sanitization](/in-depth/csp).
:::

## Walkthrough

The steps assume a grid and a DataView, wired as in the [DataView](/in-depth/dataview#walkthrough) chapter.

### 1. Write a filter function

Set the filter with [`setFilter`](/reference/dataview#m-setFilter). This example keeps rows whose name contains the search text:

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';

const dataView = new SlickDataView();
// ...wire the DataView to the grid and load items (see the DataView chapter)

dataView.setFilter((item, args) => {
  if (!args?.text) {
    return true;                     // no search text: keep every row
  }
  return item.name.toLowerCase().includes(args.text.toLowerCase());
});
```

- `setFilter` stores the function and refreshes once.
- Read the current filter back with [`getFilter`](/reference/dataview#m-getFilter).
- Keep the search value in `args`, not in the function body. One filter function then serves any search text.

### 2. Feed live values with setFilterArgs

The filter above reads `args.text`. Supply it from a search box:

```html
<input id="search" type="search" placeholder="Search…">
```

```ts
const search = document.querySelector<HTMLInputElement>('#search')!;

search.addEventListener('input', () => {
  dataView.setFilterArgs({ text: search.value });
  dataView.refresh();
});
```

- [`setFilterArgs`](/reference/dataview#m-setFilterArgs) passes extra data to the filter. It arrives as the second parameter.
- `setFilterArgs` does not re-run the filter on its own. Call [`refresh`](/reference/dataview#m-refresh) after it.
- Read the args back with [`getFilterArgs`](/reference/dataview#m-getFilterArgs).

### 3. Build a per-column filter row

For a filter under each column, turn on the header row and fill it yourself.

First, set the grid options:

```ts
const options = {
  showHeaderRow: true,          // add a second header row for filters
  headerRowHeight: 30,          // its height in pixels (default 25)
  explicitInitialization: true, // let us subscribe before headers render
};
```

- [`showHeaderRow`](/reference/grid#opt-showHeaderRow) adds the filter row. It defaults to `false`.
- [`headerRowHeight`](/reference/grid#opt-headerRowHeight) sets the row height.
- [`explicitInitialization`](/reference/grid#opt-explicitInitialization) is explained in the last part of this step.

Next, hold the filter values in one object, keyed by column id, and read them from the filter:

```ts
const columnFilters: Record<string, string> = {};

dataView.setFilter((item, args) => {
  for (const columnId in args) {
    const value = args[columnId];
    if (value !== '') {
      const col = grid.getColumns()[grid.getColumnIndex(columnId)];
      if (!String(item[col.field]).toLowerCase().includes(value.toLowerCase())) {
        return false;
      }
    }
  }
  return true;
});

dataView.setFilterArgs(columnFilters);
```

- The filter tests the item against every active column value.
- `setFilterArgs` keeps a reference to `columnFilters`. Later edits to that object are visible on the next `refresh`, so you set the args only once. Call `setFilterArgs` again only if you replace the object.

Now create an input each time a header cell renders:

```ts
grid.onHeaderRowCellRendered.subscribe((_e, args) => {
  args.node.replaceChildren();                   // clear the cell
  const input = document.createElement('input');
  input.type = 'search';
  input.dataset.columnId = String(args.column.id);
  input.value = columnFilters[args.column.id] ?? '';
  args.node.appendChild(input);
});
```

- [`onHeaderRowCellRendered`](/reference/grid#evt-onHeaderRowCellRendered) fires once per column, every time the grid renders its headers.
- `args.node` is the filter cell for that column. `args.column` is the [column](/reference/column#col-id).
- The grid rebuilds the header cells on resize and on a column change. Restore each input value from `columnFilters`, or typed text is lost.

Read the inputs with one delegated listener on the header row:

```ts
grid.getHeaderRow().addEventListener('input', (e) => {
  const input = e.target as HTMLInputElement;
  const columnId = input.dataset.columnId;
  if (columnId != null) {
    columnFilters[columnId] = input.value.trim();
    dataView.refresh();
  }
});
```

- [`getHeaderRow`](/reference/grid#m-getHeaderRow) returns the header row container.
- One listener on the container handles every input. Rebuilt inputs need no new listener. This is why delegation is better than binding each input.

Finally, initialize the grid so the subscription runs before the first render:

```ts
grid.init();
```

- With `explicitInitialization: true`, the grid does not build its headers until you call [`init`](/reference/grid#m-init). Subscribe to `onHeaderRowCellRendered` before this line.
- Without it, the grid builds headers inside its constructor. A subscription added after `new SlickGrid(...)` then misses that first render, and the inputs never appear.

To toggle the row later, call [`setHeaderRowVisibility(true)`](/reference/grid#m-setHeaderRowVisibility). To reach one cell directly, call [`getHeaderRowColumn(id)`](/reference/grid#m-getHeaderRowColumn).

### 4. Turn on paging

Set the page size and current page with [`setPagingOptions`](/reference/dataview#m-setPagingOptions):

```ts
dataView.setPagingOptions({ pageSize: 25, pageNum: 0 });
```

- `pageSize` is the number of rows per page. `pageNum` is the current page, counted from `0`.
- A `pageSize` of `0` shows all rows on one page.
- `setPagingOptions` refreshes the grid.
- It fires [`onBeforePagingInfoChanged`](/reference/dataview#evt-onBeforePagingInfoChanged) first. Return `false` from a handler to veto the change. It then fires [`onPagingInfoChanged`](/reference/dataview#evt-onPagingInfoChanged).

### 5. Read state and react to changes

[`getPagingInfo`](/reference/dataview#m-getPagingInfo) returns the current paging state:

```ts
const info = dataView.getPagingInfo();
// { pageSize, pageNum, totalRows, totalPages, dataView }
```

Move one page forward, without running past the end:

```ts
const info = dataView.getPagingInfo();
dataView.setPagingOptions({ pageNum: Math.min(info.pageNum + 1, info.totalPages - 1) });
```

Update your own UI from `onPagingInfoChanged`:

```ts
dataView.onPagingInfoChanged.subscribe((_e, info) => {
  label.textContent = `Page ${info.pageNum + 1} of ${info.totalPages}`;
});
```

- `onPagingInfoChanged` fires when the page, the size, or the total row count changes.
- `totalRows` and `totalPages` count the filtered rows. A new filter changes them, and fires this event.

### 6. Use the SlickGridPager control

The built-in pager renders a ready pager and keeps itself in sync. Add a container under the grid:

```html
<div id="myGrid" style="width:600px;height:400px;"></div>
<div id="pager" style="width:600px;height:24px;"></div>
```

Create the pager after the grid and the DataView:

```ts
import { SlickGridPager } from 'slickgrid';

new SlickGridPager(dataView, grid, '#pager', {
  showCount: true,      // add a "from-to of total" count
  showPageSizes: true,  // show the page-size chooser
});
```

- The constructor takes the DataView, the grid, a container (a CSS selector or an element), and options.
- The pager subscribes to `onPagingInfoChanged` and redraws itself. You never update it by hand.
- Its buttons call `setPagingOptions` for you: first, previous, next, and last page.
- The page-size list defaults to `All`, `Auto`, `25`, `50`, `100`. `All` uses one page; `Auto` fits the page to the viewport height. Override the list with the `pagingOptions` option.
- `showCount` and `showPageSizes` both default to `false`.
- Call `destroy()` on the pager to remove it and unbind its listeners.

The pager needs the SlickGrid stylesheet for its layout and icons. See [Controls](/reference/controls) for the full option list.

## Notes and pitfalls

- **`setFilterArgs` needs `refresh`.** Setting args does not re-run the filter. Follow it with `dataView.refresh()`.
- **`setFilter` refreshes; `setFilterArgs` does not.** `setFilter` runs the filter at once. `setFilterArgs` only stores the value.
- **Restore inputs on header render.** The grid rebuilds header cells often. Read each input value from your state in the `onHeaderRowCellRendered` handler.
- **Subscribe before `init`.** With `explicitInitialization`, add the `onHeaderRowCellRendered` handler before `grid.init()`. Otherwise the first render has no inputs.
- **A row index is not an item index.** In a filter or event handler, look items up through the DataView. See the [DataView](/in-depth/dataview#items-vs-rows) chapter.
- **`totalRows` is the filtered count.** Paging works on the filtered rows, so a filter can change the page count and the current page.
- **`pageSize: 0` means all rows.** Use it to turn paging off; `totalPages` is then `1`.
- **Large datasets: hint the refresh.** Before a `refresh` that does not change the filter, call [`setRefreshHints({ isFilterUnchanged: true })`](/reference/dataview#m-setRefreshHints). The DataView then skips re-running the filter. The pager does this for page changes.

## See also

- [DataView](/in-depth/dataview) — items vs rows, ids, and wiring the DataView to the grid.
- [DataView — API reference](/reference/dataview) — `setFilter`, `setFilterArgs`, `setPagingOptions`, `getPagingInfo`, and the paging events.
- [Controls — API reference](/reference/controls) — the `SlickGridPager` control and its options.
- [Grid — API reference](/reference/grid) — `showHeaderRow`, `onHeaderRowCellRendered`, `getHeaderRow`, and `init`.
- [Sorting](/in-depth/sorting) — the other DataView transform, driven by the grid's `onSort` event.
- [CSP & sanitization](/in-depth/csp) — why filtering is CSP-safe by default.
