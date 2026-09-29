---
title: Providing data to the grid
---

# Providing data to the grid

Every grid needs a data source. This chapter explains the data-provider contract, the three ways to supply data (a plain array, a custom provider, or a `SlickDataView`), and how *item metadata* lets a single row or cell override its own appearance and behavior. Read it when you decide how to feed rows to the grid, or when you want per-row styling, cell spanning, or per-cell formatter and editor overrides.

## Concepts

### The data source

You pass the data source to the grid as the second constructor argument.

```ts
import { SlickGrid } from 'slickgrid';

const grid = new SlickGrid('#myGrid', data, columns, options);
```

`data` is one of two things:

- **An array** of item objects (`TData[]`). This is the simplest source.
- **A custom data provider** — any object that exposes `getLength()` and `getItem(index)`.

`SlickDataView` is a ready-made provider that adds sorting, filtering, paging, and grouping. It implements the same contract, so the grid treats it like any other provider.

### The provider contract

A custom provider is an object that matches the `CustomDataView` interface:

```ts
interface CustomDataView<T = any> {
  getLength(): number;                          // number of rows
  getItem(index: number): T;                    // the row at an index
  getItemMetadata(row: number): ItemMetadata | null;  // optional per-row overrides
  getCellValue?(index: number, field: string): unknown; // optional single-cell accessor
}
```

The grid detects each method at run time:

- If the source has `getLength()`, the grid calls it. Otherwise it reads `data.length`.
- If the source has `getItem()`, the grid calls it. Otherwise it reads `data[index]`.
- If the source has `getItemMetadata()`, the grid calls it for each visible row. A plain array has no such method, so the grid skips it.

`getCellValue(index, field)` is optional. Supply it when a column-oriented source can return one field faster than it can build a whole row object with `getItem()`. When it is absent, the grid falls back to `getItem(index)[field]`.

### Item metadata

`getItemMetadata(row)` gives one row a chance to override how the grid draws and handles it. Return `null` when the row needs no special handling. Return an `ItemMetadata` object to change the row, or individual cells in it.

```ts
interface ItemMetadata {
  // row-level
  cssClasses?: string;   // extra CSS class(es) for the whole row (space-separated)
  focusable?: boolean;   // can any cell in the row become active?
  selectable?: boolean;  // can the row (or its cells) be selected?
  formatter?: Formatter; // fallback formatter for the row's cells
  height?: number;       // row height in px (variable row height only)

  // per-column overrides, keyed by column id or column index
  columns?: {
    [colIdOrIndex: string | number]: {
      colspan?: number | '*'; // how many columns this cell spans
      cssClass?: string;      // extra CSS class for this one cell
      formatter?: Formatter;  // formatter for this one cell
      editor?: Editor | null; // editor for this one cell (null disables editing)
      focusable?: boolean;
      selectable?: boolean;
      rowspan?: number;       // see the rowspan feature
    };
  };
}
```

Two class properties look similar but differ:

- `cssClasses` (row level, plural) adds classes to the whole row.
- `cssClass` (column level, singular) adds a class to one cell.

Both are **additive** — the grid appends them, it does not replace the built-in classes.

## Walkthrough

### 1. Provide a plain array

Give the grid an array of objects. Each object is one row. Each [column](/reference/column#col-field) reads its value from the item field named by `column.field`.

```ts
import { SlickGrid } from 'slickgrid';

const columns = [
  { id: 'name', name: 'Name', field: 'name' },
  { id: 'size', name: 'Size', field: 'size' },
];

const data = [
  { id: 0, name: 'Alice', size: 12 },
  { id: 1, name: 'Bob', size: 7 },
];

const grid = new SlickGrid('#myGrid', data, columns, { enableCellNavigation: true });
```

### 2. Update the data

To replace the whole source, call [`setData()`](/reference/grid#m-setData) then [`render()`](/reference/grid#m-render). `setData()` re-reads the row count and drops the rendered rows, but it does **not** repaint — you call `render()` for that.

```ts
grid.setData(newData);
grid.render();
```

To change an array in place, tell the grid what changed:

```ts
// added or removed rows (the length changed)
data.push({ id: 2, name: 'Cara', size: 3 });
grid.updateRowCount();
grid.render();

// changed an existing row's contents (same length)
data[0].size = 99;
grid.invalidateRow(0); // or invalidateRows([0, 4, 5])
grid.render();
```

### 3. Read data back

The grid exposes read accessors that work for both arrays and providers:

- [`getData()`](/reference/grid#m-getData) — the source you passed in.
- [`getDataLength()`](/reference/grid#m-getDataLength) — the row count.
- [`getDataItem(i)`](/reference/grid#m-getDataItem) — the item at a row index.
- [`getCellValue(i, field)`](/reference/grid#m-getCellValue) — one field value.
- [`hasDataView()`](/reference/grid#m-hasDataView) — `true` when the source is not a plain array.

### 4. Write a custom provider

Implement the contract when your data lives elsewhere — a remote page cache, a virtual list, or a column-oriented store. The provider just answers "how many rows?" and "what is row `i`?".

```ts
import { SlickGrid } from 'slickgrid';
import type { CustomDataView } from 'slickgrid';

const provider: CustomDataView = {
  getLength: () => rows.length,
  getItem: (i) => rows[i],
  getItemMetadata: (row) => getItemMetadata(row),
};

const grid = new SlickGrid('#myGrid', provider, columns, options);
```

### 5. Override rows and cells with metadata

Return an `ItemMetadata` object from `getItemMetadata(row)`. This example styles a summary row, blocks its selection, spans its first cell across the whole row, and gives that cell a custom formatter.

```ts
import type { ItemMetadata } from 'slickgrid';

function getItemMetadata(row: number): ItemMetadata | null {
  const item = rows[row];
  if (!item) {
    return null;
  }

  if (item.kind === 'summary') {
    return {
      cssClasses: 'row-summary',
      selectable: false,
      columns: {
        0: { colspan: '*', formatter: summaryFormatter },
      },
    };
  }

  return null; // a normal row needs no special handling
}
```

Notes on the per-column overrides:

- Key each entry by **column id** (`name`) or **column index** (`0`). The grid checks the id first, then the index. Prefer the id — it survives column reordering.
- `colspan` is a column count, or `'*'` to span the rest of the row. It affects rendering and cell navigation only; it does not merge the underlying data.
- A `formatter` or `editor` here applies to that one cell. Set `editor: null` to disable editing for a single cell.

## Order of checks

For each property, the grid resolves the value from the most specific source to the least specific. Column-level metadata is always looked up by **column id first, then by column index**.

The `formatter` and `editor` cell overrides resolve in this order:

| Order | `formatter` | `editor` |
|---|---|---|
| 1 | column metadata (id, then index) | column metadata (id, then index) |
| 2 | row metadata `formatter` | — |
| 3 | column definition | column definition |
| 4 | [`formatterFactory`](/reference/grid#opt-formatterFactory) | [`editorFactory`](/reference/grid#opt-editorFactory) |
| 5 | [`defaultFormatter`](/reference/grid#opt-defaultFormatter) | — |

The `focusable` and `selectable` gating flags invert the first two steps — the **row-level** value wins over the column-level value:

| Order | `focusable` and `selectable` |
|---|---|
| 1 | row metadata |
| 2 | column metadata (id, then index) |
| 3 | column definition ([`focusable`](/reference/column#col-focusable) / [`selectable`](/reference/column#col-selectable)) |

For these flags the grid accepts any value that is not `undefined`. A metadata value of `false` is a real match, so it explicitly turns the flag off for that row or cell.

`colspan` comes only from column-level metadata (id, then index) and defaults to `1`. The row and cell CSS classes are additive, as described above, so they have no "winner" — the grid adds every class it finds.

## When to use a plain array vs a DataView

Start with a plain array. Move to [`SlickDataView`](/in-depth/dataview) when you need what it adds.

| Use a plain array when | Use `SlickDataView` when |
|---|---|
| The data is small, simple, or static. | You need sorting, filtering, paging, or grouping. |
| You already sort and filter in your own code. | You want fast row updates and lookups by item id. |
| You do not need row-count change events. | You want the grid to stay in sync through events. |

`SlickDataView` implements the same [`getItem`](/reference/dataview#m-getItem) / [`getLength`](/reference/dataview#m-getLength) / [`getItemMetadata`](/reference/dataview#m-getItemMetadata) contract, so you pass it to the grid the same way. It also fires events when its rows change. Wire them once so the grid repaints itself:

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';

const dataView = new SlickDataView();
dataView.setItems(data); // each item needs a unique id

const grid = new SlickGrid('#myGrid', dataView, columns, options);

dataView.onRowCountChanged.subscribe(() => {
  grid.updateRowCount();
  grid.render();
});
dataView.onRowsChanged.subscribe((_e, args) => {
  grid.invalidateRows(args.rows);
  grid.render();
});
```

The [DataView chapter](/in-depth/dataview) covers `setItems`, `setFilter`, sorting, paging, and grouping in full.

## Common pitfalls and notes

- **`setData()` does not repaint.** Always follow it with `render()`.
- **In-place changes need a hint.** After you mutate the array yourself, call `updateRowCount()` (when the length changed) or `invalidateRows()` (when contents changed), then `render()`.
- **Keep `getItemMetadata` fast.** The grid calls it for every visible row on each render. Do a simple lookup, cause no side effects, and return `null` when there is nothing to override.
- **`focusable` needs cell navigation.** A cell can only become active when the [`enableCellNavigation`](/reference/grid#opt-enableCellNavigation) grid option is on; the `focusable` flag has no effect without it.
- **`cssClasses` vs `cssClass`.** Use the plural, row-level `cssClasses` for a whole row; use the singular, column-level `cssClass` for one cell.
- **Prefer column ids over indexes** in the `columns` metadata map. Ids stay correct when the user reorders columns.
- **With a DataView, do not call `setData()` on every change.** Update the DataView and let its events drive the grid, as shown above.

## See also

- [DataView](/in-depth/dataview) — sorting, filtering, paging, and grouping on the same contract.
- [Formatters](/in-depth/formatters) and [Cell editors](/in-depth/custom-editors) — the functions you plug in through metadata overrides.
- [Selection models](/in-depth/selection) — how `selectable` interacts with selection.
- Grid methods: [`setData`](/reference/grid#m-setData), [`getData`](/reference/grid#m-getData), [`getDataItem`](/reference/grid#m-getDataItem), [`getDataLength`](/reference/grid#m-getDataLength), [`getCellValue`](/reference/grid#m-getCellValue), [`render`](/reference/grid#m-render), [`invalidateRows`](/reference/grid#m-invalidateRows), [`updateRowCount`](/reference/grid#m-updateRowCount).
- Column properties: [`formatter`](/reference/column#col-formatter), [`editor`](/reference/column#col-editor), [`colspan`](/reference/column#col-colspan), [`cssClass`](/reference/column#col-cssClass), [`focusable`](/reference/column#col-focusable), [`selectable`](/reference/column#col-selectable).
- DataView events: [`onRowCountChanged`](/reference/dataview#evt-onRowCountChanged), [`onRowsChanged`](/reference/dataview#evt-onRowsChanged).
