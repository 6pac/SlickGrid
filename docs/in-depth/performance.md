---
title: Performance & virtual rendering
---

# Performance & virtual rendering

SlickGrid stays fast because it never puts the whole dataset in the DOM. It renders only the rows you can see, plus a small buffer, and reuses the DOM nodes as you scroll. This chapter explains how that virtual rendering works, how the render buffers and scroll throttling behave, and how to keep large grids smooth. Read it when a grid feels slow, when you load or change a lot of data at once, or when a cell needs heavy content such as a chart. For the full member list, see the [Grid API reference](/reference/grid) and the [DataView API reference](/reference/dataview).

## Concepts

### Virtual rendering

The grid renders a window, not the whole dataset.

- Only the rows inside the viewport are in the DOM. Rows above and below are not.
- Rendering is virtual **horizontally** too. Cells to the left and right of the visible columns are not rendered. Frozen rows and frozen columns are always rendered.
- As you scroll, the grid removes rows that leave the window and builds rows that enter it.

The result: DOM size stays roughly constant no matter how many rows the data has. A 100-row grid and a 1,000,000-row grid hold about the same number of row elements. Memory and layout cost track the viewport size, not the data size.

### The row cache

The grid keeps a **row cache** of the DOM nodes it has already built ([`getRowCache`](/reference/grid#m-getRowCache) returns it). On each render the grid:

1. Computes the range of rows it wants on screen.
2. Removes cached rows that fall outside that range.
3. Builds only the rows inside the range that are not already cached.

Rows that are still in range are left untouched. This is why a render after a small scroll is cheap: most rows are reused, and the grid only builds the few new rows at the leading edge.

### The render range and buffers

Two ranges drive rendering:

- [`getVisibleRange()`](/reference/grid#m-getVisibleRange) — the rows currently inside the viewport.
- [`getRenderedRange()`](/reference/grid#m-getRenderedRange) — the visible range plus a buffer of extra rows.

The buffer is **asymmetric** and follows the scroll direction:

- Ahead of the scroll (the direction you are moving), the grid renders about one full viewport of extra rows.
- Behind the scroll, it keeps [`minRowBuffer`](/reference/grid#opt-minRowBuffer) rows (default `3`).
- When you are not scrolling, it keeps `minRowBuffer` rows on both sides.

Rendering ahead avoids blank rows during a fast scroll. Keeping only a few rows behind keeps the DOM small.

::: warning maxRowBuffer has no effect
[`maxRowBuffer`](/reference/grid#opt-maxRowBuffer) is still declared as a grid option, but the current render code does not read it. Setting it does nothing. Tune the buffer with `minRowBuffer` only.
:::

### The render pipeline: what each method does

These methods look similar. They do different amounts of work. Pick the smallest one that fits.

| Method | What it does | Cost |
| ------ | ------------ | ---- |
| [`render()`](/reference/grid#m-render) | Repaint. Cleans rows outside the rendered range, builds missing rows inside it. Reuses the cache. | Low |
| [`invalidateRow(row)`](/reference/grid#m-invalidateRow) | Drops one row from the cache so the next `render()` rebuilds it. | Low |
| [`invalidateRows(rows)`](/reference/grid#m-invalidateRows) | Drops the listed rows from the cache. | Low |
| [`invalidateAllRows()`](/reference/grid#m-invalidateAllRows) | Drops every cached row. The next render rebuilds all visible rows. | Medium |
| [`updateRowCount()`](/reference/grid#m-updateRowCount) | Recomputes the row count and canvas height from the data length. | Medium |
| [`invalidate()`](/reference/grid#m-invalidate) | `updateRowCount()` + `invalidateAllRows()` + `render()`. Rebuilds everything. | High |

Two rules follow from the table:

- `render()` does **not** change the row count. When rows were added or removed, call `updateRowCount()` first.
- `invalidateRow` / `invalidateRows` only mark rows dirty. They do not repaint. Call `render()` after them.

## Walkthrough

### 1. Re-render only what changed

After a change, invalidate the smallest set of rows you can, then render. Do not reach for `invalidate()` when a few rows changed.

```ts
// one row's contents changed (same row count)
data[42].price = 9.99;
grid.invalidateRow(42);
grid.render();

// several rows changed
grid.invalidateRows([10, 11, 12]);
grid.render();

// the row count changed (rows added or removed)
grid.updateRowCount();
grid.render();
```

`invalidate()` and `invalidateAllRows()` throw away every cached row and rebuild the whole viewport. Use them only when a global change makes every row wrong at once — for example after changing columns or a formatter.

### 2. Let the DataView drive targeted renders

With a [`SlickDataView`](/in-depth/dataview), subscribe once to [`onRowsOrCountChanged`](/reference/dataview#evt-onRowsOrCountChanged). It tells you which of the two changed, so you can call the cheap methods:

```ts
dataView.onRowsOrCountChanged.subscribe((_e, args) => {
  if (args.rowCountChanged) {
    grid.updateRowCount();
  }
  if (args.rowsChanged) {
    grid.invalidateRows(args.rowsDiff); // only the rows that differ
  }
  grid.render();
});
```

Use `args.rowsDiff`, the list of changed rows. This is targeted re-rendering handed to you for free: the DataView computes the diff, and the grid rebuilds only those rows.

### 3. Batch DataView changes

Every mutating DataView call — [`addItem`](/reference/dataview#m-addItem), [`updateItem`](/reference/dataview#m-updateItem), [`deleteItem`](/reference/dataview#m-deleteItem), [`sort`](/reference/dataview#m-sort), [`setFilter`](/reference/dataview#m-setFilter) — runs a [`refresh`](/reference/dataview#m-refresh). Each refresh recomputes rows, fires events, and drives a grid render. Ten separate calls cause ten refreshes.

Wrap a batch so the DataView refreshes once at the end:

```ts
dataView.beginUpdate();
for (const row of incoming) {
  dataView.addItem(row);
}
dataView.endUpdate(); // one refresh, one render
```

For very large insert or delete batches, use **bulk mode**. [`beginUpdate(true)`](/reference/dataview#m-beginUpdate) postpones index rebuilding and deletions until [`endUpdate`](/reference/dataview#m-endUpdate):

```ts
dataView.beginUpdate(true); // bulk mode
// thousands of addItem / deleteItem calls
dataView.endUpdate();
```

While bulk mode is active, some lookups may return stale results until `endUpdate` runs. That is the trade for the speed.

### 4. Hint the DataView about a refresh

[`setRefreshHints`](/reference/dataview#m-setRefreshHints) tells the DataView what changed before its next refresh, so it can skip work. Set the hints, then trigger the refresh. The DataView clears the hints after each refresh, so set them again each time.

The hints are:

| Hint | Meaning | The DataView then |
| ---- | ------- | ----------------- |
| `isFilterNarrowing` | the new filter is stricter (can only remove rows) | re-filters the already-filtered set, not the whole dataset |
| `isFilterExpanding` | the new filter is looser (can admit rows) | filters the whole set but reuses the filter cache |
| `isFilterUnchanged` | the filter did not change | skips filtering; keeps the current result |
| `ignoreDiffsBefore` / `ignoreDiffsAfter` | only a window of rows changed | computes row diffs only inside that window |

Narrowing is the common case. When the user adds characters to a search box, the filter can only remove rows:

```ts
search.addEventListener('input', () => {
  dataView.setRefreshHints({ isFilterNarrowing: true });
  dataView.setFilterArgs({ text: search.value });
  dataView.refresh();
});
```

When paging changes but the filter does not, hint `isFilterUnchanged` to skip re-filtering. The built-in `SlickGridPager` already does this before it changes the page size:

```ts
dataView.setRefreshHints({ isFilterUnchanged: true });
dataView.setPagingOptions({ pageSize: 50 });
```

This is an advanced optimisation. Reach for it when a refresh over a large dataset is measurably slow.

### 5. Move heavy cell content to async post-render

A formatter runs **synchronously** for every rendered cell on every render. Heavy work there — building a chart, a sparkline, a canvas, or a third-party widget — blocks the render and stutters scrolling.

Async post-render splits the work. The formatter renders a light placeholder now. A callback fills in the heavy content later, one row at a time, off the render path.

1. Turn on [`enableAsyncPostRender`](/reference/grid#opt-enableAsyncPostRender).
2. Give the column an [`asyncPostRender`](/reference/column#col-asyncPostRender) callback.
3. To free resources when rows leave the viewport, turn on [`enableAsyncPostRenderCleanup`](/reference/grid#opt-enableAsyncPostRenderCleanup) and add an [`asyncPostRenderCleanup`](/reference/column#col-asyncPostRenderCleanup) callback.

```ts
import { SlickGrid } from 'slickgrid';

const columns = [
  {
    id: 'trend', name: 'Trend', field: 'history',
    // light: runs synchronously for every rendered cell
    formatter: () => '<div class="sparkline"></div>',
    // heavy: runs later, one row at a time, off the render path
    asyncPostRender: (cellNode, row, dataItem, colDef) => {
      const host = cellNode.querySelector<HTMLElement>('.sparkline')!;
      drawSparkline(host, dataItem.history); // your chart library
    },
    // tear the widget down when the row scrolls away, to free memory
    asyncPostRenderCleanup: (cellNode, rowIdx, colDef) => {
      const host = cellNode.querySelector<HTMLElement>('.sparkline');
      if (host) {
        destroySparkline(host);
      }
    },
  },
];

const grid = new SlickGrid('#myGrid', data, columns, {
  enableAsyncPostRender: true,
  enableAsyncPostRenderCleanup: true,
});
```

How it runs:

- After a render, the grid waits [`asyncPostRenderDelay`](/reference/grid#opt-asyncPostRenderDelay) (default `50` ms), then processes rows one per timer tick. Each `asyncPostRender` runs once per cell; the grid marks it done so it does not run again.
- When a post-rendered row scrolls out or is invalidated, the grid queues cleanup and runs `asyncPostRenderCleanup` after [`asyncPostRenderCleanupDelay`](/reference/grid#opt-asyncPostRenderCleanupDelay) (default `40` ms).

Always pair a heavy `asyncPostRender` with a cleanup callback. Without it, widgets built during a long scrolling session are never torn down, and memory grows.

### 6. Understand scroll throttling and sync scrolling

On each scroll the grid chooses how to render:

- A **small** move — less than one viewport in each direction — renders immediately. It is cheap, because most cached rows are reused.
- A **large** jump — a viewport or more, such as dragging the scrollbar thumb — needs a full viewport rebuild. The grid throttles these to at most once per [`scrollRenderThrottling`](/reference/grid#opt-scrollRenderThrottling) ms (default `10`). This caps the work during a fast drag.

[`forceSyncScrolling`](/reference/grid#opt-forceSyncScrolling) (default `false`) removes the throttle and renders on every scroll event. It can look smoother on small datasets, but on large ones every scroll event forces a full viewport rebuild and can stutter. The source warns against enabling it on large data. Leave it off unless you have measured a gain.

Two related options rarely need changing:

- [`enableMouseWheelScrollHandler`](/reference/grid#opt-enableMouseWheelScrollHandler) (default `true`) attaches the grid's own wheel handler. Frozen grids need it, so keep it on.
- [`emulatePagingWhenScrolling`](/reference/grid#opt-emulatePagingWhenScrolling) (default `true`) changes how keyboard and programmatic navigation land a far-away target row: it pages so the row appears at the top of the viewport. It is a navigation behaviour, not a render-cost knob.

### 7. Measure what renders

Confirm virtualization instead of guessing. Subscribe to [`onRendered`](/reference/grid#evt-onRendered) to see the visible range on each render:

```ts
grid.onRendered.subscribe((_e, args) => {
  console.log('rendered rows', args.startRow, 'to', args.endRow);
});
```

Compare `getVisibleRange()` with `getRenderedRange()` to see the buffer. Count the row elements in the DOM: a correctly virtualized grid holds about a viewport of rows plus the buffer, never the whole dataset. If the DOM row count grows with the data, something is bypassing the grid — check that you are not building rows yourself.

## Very large datasets

Virtual rendering handles hundreds of thousands of rows without special care. Two extra facts matter at that scale.

**The browser height cap.** Browsers limit how tall an element can be. The grid stores the limit as [`maxSupportedCssHeight`](/reference/grid#opt-maxSupportedCssHeight) (default `1000000000` px; Firefox uses [`ffMaxSupportedCssHeight`](/reference/grid#opt-ffMaxSupportedCssHeight), default `6000000`). When the total row height would exceed the cap, the grid cannot make the scroll canvas that tall. It maps the scroll position onto virtual pages instead. This is why, with millions of rows, the scrollbar can jump non-linearly near the ends — one thumb pixel covers many rows. The behaviour is expected and unavoidable given the browser limit.

**Keep the per-render cost low.** At scale the render window is what you pay for on every scroll, so:

- Use a [`SlickDataView`](/in-depth/dataview) or a custom provider. Let virtual rendering do its job. Never expand all rows into the DOM yourself.
- Keep formatters cheap and pure. They run for every rendered cell on every render. Move expensive work to `asyncPostRender` (step 5).
- Batch data changes with `beginUpdate` / `endUpdate`, and bulk mode for big inserts and deletes (step 3).
- Prefer targeted `invalidateRows` over `invalidate` (step 1).
- Keep `minRowBuffer` small. A large buffer multiplies the DOM on every render.
- Avoid `forceSyncScrolling`.
- Keep row height uniform where you can. Variable row height adds a row-position index that is rebuilt when heights change.
- If you do not need one continuous scroll, page the data with [`setPagingOptions`](/reference/dataview#m-setPagingOptions). Paging bounds the row count per page.
- For remote or huge back-ends, write a custom provider backed by a page cache. The grid asks only for the rows in view. See [Providing data to the grid](/in-depth/providing-data).

## Common pitfalls

- **`render()` does not update the row count.** After adding or removing rows, call `updateRowCount()` first, then `render()`.
- **`invalidateRow` / `invalidateRows` do not repaint.** They only drop rows from the cache. Follow them with `render()`.
- **Do not use `invalidate()` for a few changed rows.** It rebuilds the whole viewport. Invalidate the specific rows instead.
- **Un-batched DataView writes re-render each time.** Wrap many changes in `beginUpdate` / `endUpdate`.
- **Heavy formatters block scrolling.** A formatter runs synchronously for every rendered cell. Put charts and widgets in `asyncPostRender`.
- **Async post-render without cleanup leaks.** Pair `asyncPostRender` with `asyncPostRenderCleanup` and enable `enableAsyncPostRenderCleanup`.
- **`forceSyncScrolling` on large data can stutter.** It forces a full viewport rebuild on every scroll event. Leave it off unless measured.
- **`maxRowBuffer` does nothing.** Only `minRowBuffer` changes the buffer.
- **The scrollbar jumps with millions of rows.** That is the browser height cap and virtual paging, not a bug.

## See also

- [Grid — API reference](/reference/grid) — [`render`](/reference/grid#m-render), [`invalidate`](/reference/grid#m-invalidate), [`invalidateRow`](/reference/grid#m-invalidateRow), [`invalidateRows`](/reference/grid#m-invalidateRows), [`invalidateAllRows`](/reference/grid#m-invalidateAllRows), [`updateRowCount`](/reference/grid#m-updateRowCount), and the render options.
- [DataView](/in-depth/dataview) — `beginUpdate`/`endUpdate`, refresh events, and `onRowsOrCountChanged`.
- [Providing data to the grid](/in-depth/providing-data) — plain arrays and custom providers for large or remote data.
- [Auto column sizing](/in-depth/auto-column-sizing) — sizing costs and when they run.
- Column properties: [`asyncPostRender`](/reference/column#col-asyncPostRender), [`asyncPostRenderCleanup`](/reference/column#col-asyncPostRenderCleanup).
- Grid events: [`onRendered`](/reference/grid#evt-onRendered), [`onScroll`](/reference/grid#evt-onScroll), [`onViewportChanged`](/reference/grid#evt-onViewportChanged).
