---
title: Pivot tables
---

# Pivot tables

A pivot table summarizes rows by turning the items of some fields into row headers, the items of other fields into column headers, and aggregating values (sum, count, average, …) where they cross. SlickGrid provides opt-in modules for it:

- **`PivotEngine`** computes the pivot. It has no DOM dependency, so it also runs on a server or in a Web Worker.
- **`SlickPivot`** is a grid plugin that renders the result: multi-level column headers, row layouts, subtotals, grand totals, expand/collapse, sorting, drill-down, and write-back with undo.
- **`SlickPivotPanel`** is the Excel style *PivotTable Fields* pane: a searchable field list and four drop areas (Filters, Columns, Rows, Values).
- **`SlickPivotToolbar`** sets the report layout, subtotals and grand totals, expands or collapses every group, and undoes write-backs.
- **`SlickPivotDetails`** lists the source rows of a double-clicked cell in a dialog.
- **`SlickPivotTable`** puts them all together, with a status bar, in one container.

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

### Date hierarchies

Every date field has an automatic hierarchy, like the time grouping of Excel and the date hierarchies of Power Pivot. Each level is a field of its own, named after the date field: `OrderDate.year`, `OrderDate.quarter`, `OrderDate.month` and `OrderDate.day`. The levels need no declaration and can go wherever a field can (rows, columns, filters).

```ts
const fields: PivotField[] = [{ id: 'OrderDate', label: 'Order Date', type: 'date' }];
const spec = { rows: ['OrderDate.year', 'OrderDate.quarter', 'OrderDate.month'], columns: [], values: [{ field: 'Amount', aggregator: 'sum' }] };
```

The items are numbers, so they sort chronologically, and they are captioned like Excel: `2024`, `Qtr1`, `Jan` (in the `locale` option) and the date for days. Their captions are "Years (Order Date)", "Quarters (Order Date)", and so on. Dates, timestamps and date strings are all accepted. `PivotField.dateHierarchy` limits the levels (`['year', 'month']`) or turns the hierarchy off (`false`), and `engine.getDateHierarchy(fieldId)` returns the level fields.

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

## The ready-made pivot table

`SlickPivotTable` builds a complete pivot table in a container: the toolbar, the grid with the pivot plugin, the PivotTable Fields pane beside it, a status bar, and the details dialog. Its options are the pivot options plus one entry per part:

```ts
import { SlickPivotTable } from 'slickgrid';

const pivotTable = new SlickPivotTable('#pivotTable', {
  source: rows,
  fields,
  spec: { rows: ['Region'], columns: ['OrderDate.year'], values: [{ field: 'Amount', aggregator: 'sum' }] },
  gridOptions: { editable: true },        // merged with SlickPivot.getGridOptions()
  toolbar: { items: ['layout', 'subtotals', 'grandTotals', 'fieldList'] },
  fieldList: { position: 'end', width: 300, deferLayoutUpdate: false },
  details: { maxRows: 500 },
  statusBar: { formatter: ({ result }) => `${result.filteredRowCount} rows` },
});

pivotTable.getPivot().updateSpec({ layout: 'tabular' });
```

The container needs a height; the grid takes what the toolbar and the status bar leave. Set `toolbar`, `fieldList`, `details` or `statusBar` to `false` to leave a part out. The parts are the plugin and controls described below, so everything else is reached through them: `getPivot()`, `getGrid()`, `getFieldList()`, `getToolbar()` and `getDetails()`.

The field list sits at the `end` of the line (the right in a left-to-right page) or at its `start`. Users resize it by dragging the splitter, or with the arrow keys once the splitter has the focus (Shift for bigger steps, Home and End for the narrowest and widest widths), between `minWidth` and `maxWidth`. When the toolbar has its **Field List** button, the pane gets a close button and the button shows it again; `setFieldListVisible()`, `toggleFieldList()` and `setFieldListWidth()` do the same from code, raising `onFieldListToggled` and `onFieldListResized`. The other `fieldList` options are the ones of the pane. With `gridOptions.rtl`, the whole pivot table is mirrored.

`destroy()` destroys the grid, the plugin and every part.

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

`subtotals` (`top`, `bottom` or `none`), `columnSubtotals` and `grandTotals` (`rows`, `columns`, their position, the values of the total columns and their caption) complete the layout. The row label columns are pinned to the leading edge and the grand total row is sticky at the bottom (see [below](#pinned-and-sticky-rows-and-columns)); change this with `pinRowHeaders` and `pinGrandTotalRow`.

### Interaction

- Click a toggle (or press Space, `+` or `-` on a row label) to expand or collapse a row group. Column groups have toggles in the group header; a collapsed column group shows its subtotal. `expandAllRows()`, `collapseAllRows(fieldId?)`, `expandAllColumns()` and `collapseAllColumns(fieldId?)` do the same from code.
- Click the row label header to sort the items by caption, or a value column header to sort the row items by that value, within each parent.
- Double-click a cell to raise `onPivotCellDrillDown` with the source rows behind it; [`SlickPivotDetails`](#the-details-dialog) lists them in a dialog.

### Pinned and sticky rows and columns

The pivot uses the grid's [pinning and sticky docking](/in-depth/pinning-sticky):

- The row label columns are pinned to the leading edge (`pinRowHeaders`).
- The grand total row is sticky by default (`pinGrandTotalRow: 'sticky'`): a short pivot shows it right below its last row, and a long one docks it at the bottom while the rows scroll under it. `true` pins it permanently and `false` lets it scroll.
- `pinGrandTotalColumns` pins (`true`) or sticks (`'sticky'`) the grand total columns to the trailing edge, or to the leading edge when `grandTotals.columns` is `'start'`. They are not pinned when they would leave the other columns too little room.

The column group header rows follow every docked column, including columns an application pins or makes sticky through `columnDefaults` or a value's `column` template.

The plugin only owns the pinning it applies, so an application can pin or stick pivot rows of its own. Pivot rows are referenced by id, which `SlickPivot.getRowId(type, path)` builds from the row type and the items of its row fields, and which stays the same when the pivot is computed again:

```ts
grid.setOptions({ stickyRows: { top: [SlickPivot.getRowId('group', ['East'])] } });
```

### Right-to-left grids

A grid created with `rtl: true` mirrors the whole pivot: the row labels are pinned at the right edge, the column groups read from right to left, the compact layout indents from the right and numbers align with the end of their cells. The fields pane follows the reading direction of the page or element it is in (`dir="rtl"`).

### Large pivots

`maxColumns` (1000 by default) cuts the column tree when a high-cardinality field is dropped on the columns. The result then has a `truncated` property, `onPivotTruncated` is raised, and the field list shows a notice.

## Write-back

With `enableWriteBack: true` (and `editable: true` in the grid options), users can type a new value into a value cell, including a subtotal or a grand total, and the plugin writes it back to the source rows behind the cell, then computes the pivot again. As in Excel What-If analysis, `writeBack.method` decides how the new value is spread:

| Method | Effect on the source rows behind the cell |
|---|---|
| `weighted` (default) | every value is scaled by the same factor, keeping their proportions (an equal split when the total is 0) |
| `equal` | every row gets the same share |
| `equalIncrement` | every row changes by the same amount |

`writeBack.precision` rounds the written values (`0` for quantities) and gives the rounding residue to the largest one, so the total is exactly the typed value. A value's own `writeBack` setting overrides the plugin one, and `writeBack: false` makes it read-only.

A value can be edited when its aggregator allocates (`sum`, `avg`, `first`, `last`, or a custom aggregator with an `allocate` function), its field can be written and it is not shown as a calculation (`showAs`). A plain property is written directly; a field with a `getter` needs a `setter`:

```ts
{ id: 'AmountK', getter: (row) => row.Amount / 1000, setter: (row, value) => (row.Amount = value * 1000) }
```

`onBeforeWriteBack` can cancel an edit, and `onWriteBack` receives the changes of the source rows (`{ row, field, oldValue, newValue }`), for example to save them. `pivot.setCellValue()` does the same as typing into a cell, and `engine.allocate()` computes the changes without applying them, for a server. A DataView source is told which items changed. The cell editor defaults to `Editors.Float`, so load `slick.editors.js` (or set `writeBack.editor`).

### Undo and redo

The plugin keeps the write-backs in a history. `pivot.undo()` (Ctrl+Z on the grid, Cmd+Z on macOS) restores the exact previous values of the source rows; typing the old total in again would allocate it anew and change the rows behind it. `pivot.redo()` (Ctrl+Y or Ctrl+Shift+Z) writes the same values again. The shortcuts are left to the editor while a cell is being edited.

`canUndo()` and `canRedo()` tell what is possible, and `onHistoryChanged` is raised when it changes. `onWriteBack` is raised for undo and redo too, with `source` set to `'undo'` or `'redo'` and changes whose `newValue` is what each row now holds, so one handler can save every change. `writeBack.undoLimit` (100 by default, 0 for none) caps the history, and `clearHistory()` empties it; replacing the source rows or the fields does that too. With a provider, the server writes the data itself, so its edits cannot be undone by the plugin. `pivot.applyChanges(changes, true)` still restores changes kept by the application.

## The PivotTable Fields pane

```ts
const panel = new SlickPivotPanel(pivot, '#pivotPanel');
```

The pane renders into the container you give it, so the page layout stays yours. Users can:

- check a field to add it (numbers go to Values, other fields to Rows), or uncheck it to remove it from every area. A date field added to the rows or the columns is grouped by years, quarters and months, like Excel does (`autoDateGrouping`), and its levels are listed below it so that each can be added on its own;
- drag fields from the list into an area, between areas, within an area to reorder them, or out of the areas to remove them;
- open the `▾` menu of a pill (or press Enter on it) to move it, filter its items or sort it. The menu of a value pill lists the common aggregators under **Summarize Values By** (Sum, Count, Average, Max, Min, Distinct Count; set `summarizeByAggregators` to change the list), and opens the **Value Field Settings** (custom name, every aggregator, show values as, number format);
- defer the layout updates and apply them with **Update**.

Dragging uses pointer events, so it works the same with a mouse, a pen or a touch screen. Every drag action is also available from the keyboard: Alt+↑/↓ moves the focused pill, Alt+←/→ moves it to another area, Delete removes it, and the arrow keys move the focus. Moves are announced through an `aria-live` region.

A field placed in the Filters area is stored as a `filters` entry; a field filtered while in the rows or the columns keeps its filter there too. `PivotField.allowedAreas` restricts where a field may go.

## The toolbar

```ts
const toolbar = new SlickPivotToolbar(pivot, '#pivotToolbar');
```

Like the PivotTable Design ribbon of Excel, the toolbar holds the **Report Layout**, **Subtotals** and **Grand Totals** dropdowns (row and column, row only, column only, or off), **Expand All** and **Collapse All**, and **Undo** and **Redo**, which are shown while `enableWriteBack` is on. It follows the spec however it changes. `items` picks and orders the items, `labels` translates them, and the `fieldList` item is a toggle button raising `onFieldListToggle`, for an application that can hide its field list (the ready-made pivot table uses it). The items are native dropdowns and buttons in a labelled group, reached with Tab.

## The details dialog

```ts
const details = new SlickPivotDetails(pivot);
```

Double-clicking a cell opens a modal dialog listing the source rows behind it in a grid, like the details sheet of Excel: one column per field (computed fields included, or the ones listed in `fields`), numbers in the format of a value summarizing the field, dates and items like the pivot, and every column sortable. The title tells which cell the rows come from, for example "131 source rows — East › China / 2023". `maxRows` (1,000 by default) caps the rows listed, `columns` replaces the generated columns, `gridOptions` configures the grid and `labels` translates the captions. `onBeforeShow` can keep the dialog closed for a cell, to show its rows another way. Escape, the Close button or a click on the backdrop closes the dialog and raises `onClose`.

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
    async writeBack(request, edit) { /* write the typed value back to the data */ },
  },
});
```

The request lists the level fields of the date hierarchies the spec uses, with a `dateLevel` property (`{ field: 'OrderDate', level: 'quarter' }`) that tells the server how to derive them.

A SQL backend can return the subtotals and grand totals of one request with `GROUP BY … GROUPING SETS`, `ROLLUP` or `CUBE`. A Node.js backend can run the `PivotEngine` itself.

## Styling

Include `slick.pivot.css` (or the `slick.pivot.scss` source). The colors are CSS variables that fall back to the grid theme variables, for example `--slick-pivot-group-bg`, `--slick-pivot-grand-total-bg` and `--slick-pivot-panel-accent`. The `--slick-pivot-panel-*` colors of the pane, the toolbar and the details dialog can be set once on `.slick-pivot-table`, and `--slick-pivot-details-grid-height` sets the height of the grid of the details dialog.

With a script tag per module, the ready-made pivot table needs `slick.pivotengine.js`, `plugins/slick.pivot.js` and the `controls/` scripts of its parts (`slick.pivotpanel.js`, `slick.pivottoolbar.js`, `slick.pivotdetails.js` and `slick.pivottable.js`), plus `slick.editors.js` for write-back.

## Examples

- [Pivoting](https://6pac.github.io/SlickGrid/examples/example-pivot.html): an MS Access style crosstab with custom column templates.
- [PivotTable Fields](https://6pac.github.io/SlickGrid/examples/example-pivot-panel.html): the ready-made pivot table, with its toolbar, resizable field list and details dialog; the three layouts, a date hierarchy, write-back with undo and redo, pinned or sticky grand totals, a right-to-left grid, deferred updates and a simulated server provider.
- [Crosstab, lookups and measures](https://6pac.github.io/SlickGrid/examples/example-pivot-crosstab.html): lookups into related tables, distinct count, a custom aggregator and measures.
