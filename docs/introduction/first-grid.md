---
title: Your first grid
---

# Your first grid

Follow four steps. The result is a working grid with 500 rows.

## 1. Add a container

Give the container a width and height. SlickGrid fills it.

```html
<div id="myGrid" style="width:600px;height:500px;"></div>
```

## 2. Define columns

Each column needs an `id` and a `field`. The `field` names the data property to show.

```ts
const columns = [
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'duration', name: 'Duration', field: 'duration' },
  { id: 'pct', name: '% Complete', field: 'percentComplete', width: 90 },
];
```

## 3. Provide data

Data is an array of plain objects.

```ts
const data = [];
for (let i = 0; i < 500; i++) {
  data.push({
    title: `Task ${i}`,
    duration: '5 days',
    percentComplete: Math.round(Math.random() * 100),
  });
}
```

## 4. Create the grid

Set a few options, then create the grid. The first argument is a CSS selector or an element.

```ts
import { SlickGrid } from 'slickgrid';
import 'slickgrid/dist/styles/css/slick-alpine-theme.css';

const options = { enableCellNavigation: true, enableColumnReorder: false };
const grid = new SlickGrid('#myGrid', data, columns, options);
```

That is a working grid.

## Typing your rows (TypeScript)

Pass your row type as a generic. The grid then checks your columns and data.

```ts
interface Task { title: string; duration: string; percentComplete: number; }
const grid = new SlickGrid<Task>('#myGrid', data, columns, options);
```

See [TypeScript usage](/in-depth/typescript).

## See also

- [Columns](/introduction/columns) · [Common options](/introduction/options)
- Reference: the [SlickGrid constructor and methods](/reference/grid)
