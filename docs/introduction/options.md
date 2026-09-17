---
title: Common options
---

# Common options

Options control how the grid behaves. Set them when you create the grid, or later with `setOptions`.

## The everyday options

- `editable` — allow cell editing.
- `enableCellNavigation` — move between cells with the arrow keys. Editing and selection need this.
- `autoEdit` — open the editor as soon as a cell has focus.
- `enableColumnReorder` — drag headers to reorder columns. This is native in v6.
- `forceFitColumns` — size the columns to fill the width.
- `multiColumnSort` — sort by more than one column.
- `rowHeight` — the row height in pixels.
- `showHeaderRow` and `headerRowHeight` — add a second header row, often used for filters.
- `defaultColumnWidth` — the width for columns with no `width`.

```ts
const grid = new SlickGrid('#myGrid', data, columns, {
  editable: true,
  enableCellNavigation: true,
  autoEdit: false,
  forceFitColumns: true,
});
```

## Change options later

```ts
grid.setOptions({ editable: false });
```

## Where to find the rest

SlickGrid has 118 options. The [Reference](/reference/grid) lists every one with its type and default value. Use the **A–Z** toggle or search to find an option by name.
