---
title: Adding a DataView
---

# Adding a DataView

A plain array works well for static data. For sorting, filtering, paging, or grouping, use a `SlickDataView`. It sits between your data and the grid.

## Wire up a DataView

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';

const dataView = new SlickDataView();
dataView.setItems(data); // each item needs a unique id

const grid = new SlickGrid('#myGrid', dataView, columns, options);

// keep the grid in sync with the data
dataView.onRowCountChanged.subscribe(() => {
  grid.updateRowCount();
  grid.render();
});
dataView.onRowsChanged.subscribe((e, args) => {
  grid.invalidateRows(args.rows);
  grid.render();
});
```

The grid reads rows from the DataView. When the DataView changes, it tells the grid to update.

## Filter and sort through the DataView

```ts
dataView.setFilter((item) => item.percentComplete > 50);
```

The grid shows only the rows that pass the filter. Sorting and paging work the same way, through DataView methods.

## Learn more

- Full guide: [DataView](/in-depth/dataview)
- Reference: [DataView methods, options, and events](/reference/dataview)
