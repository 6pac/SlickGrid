---
title: Columns
---

# Columns

A column is a plain object. You pass an array of columns to the grid.

## The properties you use most

- `id` — a unique id (required).
- `field` — the data property to read (required).
- `name` — the header text.
- `width`, `minWidth`, `maxWidth` — the column size.
- `sortable` — allow sorting by this column.
- `cssClass` — a CSS class for the cells.
- `formatter` — render the cell. See [Formatters](/in-depth/formatters).
- `editor` — edit the cell. See [Cell editors](/in-depth/custom-editors).
- `hidden` — hide the column without removing it.

```ts
const columns = [
  { id: 'title', name: 'Title', field: 'title', sortable: true, width: 200 },
  { id: 'pct', name: '% Complete', field: 'percentComplete', width: 90 },
];
```

## Change columns later

Use `setColumns` to replace the columns. The grid rebuilds the headers and re-renders.

```ts
grid.setColumns(newColumns);
```

Read the current columns with `getColumns`.

## Version 6 note

Version 6 changes how hidden columns work. The grid keeps all columns and uses the `hidden` property to show or hide them. See [Frozen & column changes in v6](/in-depth/frozen).

## See also

- Reference: [every column property](/reference/column) (50 in total).
- [Common options](/introduction/options)
