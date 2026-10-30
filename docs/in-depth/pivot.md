---
title: Pivot tables
---

# Pivot tables

A pivot table summarizes rows by turning the items of some fields into row headers, the items of other fields into column headers, and aggregating values (sum, count, average, …) where they cross. SlickGrid provides three opt-in modules for it:

- **`PivotEngine`** computes the pivot. It has no DOM dependency, so it also runs on a server or in a Web Worker.
- **`SlickPivot`** is a grid plugin that renders the result: multi-level column headers, row layouts, subtotals, grand totals, expand/collapse, sorting and drill-down.
- **`SlickPivotPanel`** is the Excel style *PivotTable Fields* pane: a searchable field list and four drop areas (Filters, Columns, Rows, Values).

None of them adds a runtime dependency, and nothing changes for grids that do not use them. See the [pivot examples](#examples).

## Concepts

### Fields and the spec

A pivot is described by two things:

- **Fields** are the dimensions and measures the user can pick from. A field reads a property of the source row (`field`, defaulting to its `id`) or computes a value with a `getter`. Getters give you derived fields such as the year of a date, and lookups into related tables, like the Power Pivot data model.
- The **spec** (`PivotSpec`) says which fields go where. It is plain, serializable JSON (apart from optional functions such as filter predicates), so a layout can be saved, restored, or sent to a server.

```ts
const fields: PivotField[] = [
  { id: 'Region' },
  { id: 'Country' },
  { id: 'Year', type: 'number', getter: (row) => row.OrderDate.getFullYear() },
  { id: 'Quarter', getter: (row) => `Q${Math.floor(row.OrderDate.getMonth() / 3) + 1}`, predefinedValues: ['Q1', 'Q2', 'Q3', 'Q4'] },
  { id: 'Amount', type: 'number', getter: (row) => row.Units * row.UnitPrice },
];

const spec: Partial<PivotSpec> = {
  rows: ['Region', 'Country'],
  columns: ['Year'],
  values: [{ field: 'Amount', aggregator: 'sum' }],
  filters: [{ field: 'Region', exclude: ['North'] }],
};
```

| Spec property | Excel | MS Access crosstab |
|---|---|---|
| `rows` | Rows area | Row Heading |
| `columns` | Columns area | Column Heading (one only in Access) |
| `values` | Values area ("Sum of Amount") | Value + Total function |
| `filters` | Filters area and item filters | Where |
| `PivotField.predefinedValues` | Show items with no data | Column Headings property |
| `grandTotals` | Grand Totals | a Row Heading with an aggregate expression |

### Where the value headers go

With more than one value, every column item is repeated once per value. Put the `$values` token (exported as `PIVOT_VALUES_FIELD`) in `columns` to choose the nesting, like the *Σ Values* pill of Excel: `['Year', '$values']` shows the values under each year (the default), and `['$values', 'Year']` shows the years under each value.

### Subtotals are computed from the source rows

Every cell, including subtotal and grand total cells, is accumulated directly from the source rows rather than from the cells below it. Non-additive aggregators such as `distinctCount`, `avg` or `median` are therefore correct at every level: the grand total of a distinct count is not the sum of its children.

### Aggregators

The built-in aggregators are `sum`, `count` (non-blank values), `countNumbers`, `distinctCount`, `avg`, `min`, `max`, `product`, `stdDev`, `stdDevP`, `var`, `varP`, `median`, `first` and `last`. Numbers and numeric strings are aggregated; blanks are ignored.

A custom aggregator keeps a state per cell:

```ts
const weightedDiscount: PivotAggregator = {
  id: 'weightedDiscount',
  label: 'Weighted Avg',
  numericOnly: true,
  init: () => ({ weighted: 0, quantity: 0 }),
  accumulate: (state, discount, row) => {
    state.weighted += discount * row.Quantity;
    state.quantity += row.Quantity;
    return state;
  },
  result: (state) => (state.quantity ? state.weighted / state.quantity : null),
};

new SlickPivot({ fields, spec, source, aggregators: { weightedDiscount } });
```

`PivotAggregators.fromReducer()` wraps a `(row, currentValue, sourceField) => newValue` reducer, and `PivotAggregators.fromDataViewAggregator()` wraps a DataView aggregator class.

### Measures and "Show Values As"

**Measures** are calculated after aggregation, once per cell, from the other values of the same cell. A ratio measure is therefore right on every subtotal, unlike a ratio computed per row and then summed. Values used only by a measure can be `hidden`.

```ts
spec.values = [
  { id: 'amount', field: 'Amount', aggregator: 'sum' },
  { id: 'cost', field: 'Cost', aggregator: 'sum', hidden: true },
];
spec.measures = [{ id: 'margin', label: 'Margin %', compute: (v) => (v.amount - v.cost) / v.amount, numberFormat: { style: 'percent' } }];
```

`PivotValue.showAs` applies an Excel "Show Values As" calculation: percentage of the grand, row, column or parent totals, running total, difference from the previous item, and rank.

## Rendering a pivot in the grid

The plugin owns the grid columns and data. Create the grid with the plugin's row model, and merge `SlickPivot.getGridOptions()` into the grid options: it enables the pre-header panel in which the column group headers are drawn.

```ts
import { SlickGrid, SlickPivot } from 'slickgrid';

const pivot = new SlickPivot({ source: rows, fields, spec });
const grid = new SlickGrid('#grid', pivot.rowModel, pivot.getColumns(), SlickPivot.getGridOptions({ enableCellNavigation: true }));
grid.registerPlugin(pivot);
```

The source can be an array or a DataView. A DataView is watched, and the pivot is computed again when its items change. After changing an array, call `pivot.refresh()` or `pivot.setSource()`.

The generated rows are plain objects: a value cell is an ordinary column and an ordinary property, and each row also carries the item values of its row fields. Existing formatters, editors, copy managers and exporters therefore work unchanged. Use `PivotValue.column` to merge a column template (formatter, width, CSS classes) into the columns of a value, `PivotField.column` for a row label column, and `numberFormat` (`Intl.NumberFormat` options) for the default formatting.

### Layouts

- **Compact** (the default, like Excel): one indented *Row Labels* column, group rows carrying their subtotals.
- **Outline**: one column per row field, a group row for every outer item.
- **Tabular**: one column per row field and one row per inner item, with the subtotals below each group. `repeatItemLabels` repeats the outer captions on every row, like an MS Access crosstab.

`subtotals` (`top`, `bottom` or `none`), `columnSubtotals` and `grandTotals` (`rows`, `columns`, their position, the values of the total columns and their caption) complete the layout. The row label columns are pinned to the left and the grand total row to the bottom (see [Pinning & sticky docking](/in-depth/pinning-sticky)); turn this off with `pinRowHeaders` and `pinGrandTotalRow`.

### Interaction

- Click a toggle (or press Space, `+` or `-` on a row label) to expand or collapse a row group. Column groups have toggles in the group header; a collapsed column group shows its subtotal. `expandAllRows()`, `collapseAllRows(fieldId?)`, `expandAllColumns()` and `collapseAllColumns(fieldId?)` do the same from code.
- Click the row label header to sort the items by caption, or a value column header to sort the row items by that value, within each parent.
- Double-click a cell to raise `onPivotCellDrillDown` with the source rows behind it.

### Large pivots

`maxColumns` (1000 by default) cuts the column tree when a high-cardinality field is dropped on the columns. The result then has a `truncated` property, `onPivotTruncated` is raised, and the field list shows a notice.

## The PivotTable Fields pane

```ts
const panel = new SlickPivotPanel(pivot, '#pivotPanel');
```

The pane renders into the container you give it, so the page layout stays yours. Users can:

- check a field to add it (numbers go to Values, other fields to Rows), or uncheck it to remove it from every area;
- drag fields from the list into an area, between areas, within an area to reorder them, or out of the areas to remove them;
- open the `▾` menu of a pill (or press Enter on it) to move it, filter its items, sort it, or open the **Value Field Settings** (custom name, summarize by, show values as, number format);
- defer the layout updates and apply them with **Update**.

Dragging uses pointer events, so it works the same with a mouse, a pen or a touch screen. Every drag action is also available from the keyboard: Alt+↑/↓ moves the focused pill, Alt+←/→ moves it to another area, Delete removes it, and the arrow keys move the focus. Moves are announced through an `aria-live` region.

A field placed in the Filters area is stored as a `filters` entry; a field filtered while in the rows or the columns keeps its filter there too. `PivotField.allowedAreas` restricts where a field may go.

## Custom and server-side providers

Set `provider` to compute pivots elsewhere, for example on a server. The plugin sends a serializable `PivotRequest` (the spec and field descriptions without their functions) and expects a `PivotResult` back, the same structure as the one the local engine returns. A request superseded by a newer one is aborted through the `AbortSignal`, and the grid gets the `slick-pivot-loading` class while it waits.

```ts
pivot.setOptions({
  provider: {
    async execute(request, { signal }) {
      const response = await fetch('/api/pivot', { method: 'POST', body: JSON.stringify(request), signal });
      return response.json();
    },
    async getItems(fieldId, { search, signal }) { /* distinct items for the filter dropdowns */ },
    async getSourceRows(request, rowKey, columnKey) { /* drill-down */ },
  },
});
```

A SQL backend can return the subtotals and grand totals of one request with `GROUP BY … GROUPING SETS`, `ROLLUP` or `CUBE`. A Node.js backend can run the `PivotEngine` itself.

## Styling

Include `slick.pivot.css` (or the `slick.pivot.scss` source). The colors are CSS variables that fall back to the grid theme variables, for example `--slick-pivot-group-bg`, `--slick-pivot-grand-total-bg` and `--slick-pivot-panel-accent`.

## Examples

- [Pivoting](https://6pac.github.io/SlickGrid/examples/example-pivot.html): an MS Access style crosstab with custom column templates.
- [PivotTable Fields](https://6pac.github.io/SlickGrid/examples/example-pivot-panel.html): the interactive pane, the three layouts, drill-down, deferred updates and a simulated server provider.
- [Crosstab, lookups and measures](https://6pac.github.io/SlickGrid/examples/example-pivot-crosstab.html): lookups into related tables, distinct count, a custom aggregator and measures.
