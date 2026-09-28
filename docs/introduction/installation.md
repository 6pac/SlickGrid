---
title: Installation
---

# Installation

## With npm (recommended)

Install the package:

```bash
npm install slickgrid
```

Import the grid class and one theme stylesheet:

```ts
import { SlickGrid } from 'slickgrid';
import 'slickgrid/dist/styles/css/slick-alpine-theme.css';
```

Runtime classes use the `Slick` prefix, for example `SlickGrid`, `SlickDataView`, and `SlickRowSelectionModel`.

### Themes and styles

- `slick-alpine-theme.css` — the modern theme.
- `slick-default-theme.css` — the classic theme.
- A theme file already includes the base grid structure.
- Add extra CSS only for the parts you use, for example `slick.pager.css` or `slick.headermenu.css`.

The themes are built from SCSS with CSS variables, so you can restyle the grid. See [Theming](/in-depth/theming).

## With a script tag (no build step)

Use the browser build. It defines a global `Slick` object:

```html
<link rel="stylesheet" href="node_modules/slickgrid/dist/styles/css/slick-alpine-theme.css">
<script src="node_modules/slickgrid/dist/browser/slick.core.js"></script>
<script src="node_modules/slickgrid/dist/browser/slick.interactions.js"></script>
<script src="node_modules/slickgrid/dist/browser/slick.grid.js"></script>
```

Then create the grid with `new Slick.Grid(...)`.

## Version 6 note

Version 6 needs no jQuery and no SortableJS. Older guides that load a `Sortable` script are out of date; you no longer need it.

Next: [build your first grid](/introduction/first-grid).
