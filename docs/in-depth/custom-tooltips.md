---
title: Custom tooltips
---
# Custom tooltips

`SlickCustomTooltip` displays formatted tooltips over cells, column headers, and header-row cells. It can also show regular `title` tooltips and, optionally, observe tooltip attributes outside the grid.

## Register the plugin

Create the grid, then register the plugin. You can pass defaults to the plugin constructor, set grid-wide defaults with `customTooltip`, and override them on individual columns. Column options take precedence over grid options; constructor options take precedence over grid options.

```ts
import { SlickCustomTooltip, SlickGrid } from 'slickgrid';

const grid = new SlickGrid('#myGrid', data, columns, {
  customTooltip: {
    position: 'auto',
  },
});

grid.registerPlugin(new SlickCustomTooltip());
```

Set options on one column with `Column.customTooltip`:

```ts
const columns = [{
  id: 'title',
  name: 'Title',
  field: 'title',
  customTooltip: {
    formatter: (row, cell, value, column, item) =>
      `<strong>${item.title}</strong><br>${item.description}`,
  },
}];
```

Or configure a formatter for all columns through `GridOption.customTooltip`:

```ts
const gridOptions = {
  customTooltip: {
    formatter: (row, cell, value, column, item) => `${column.name}: ${value}`,
    usabilityOverride: ({ cell, column }) => cell !== 0 && column.id !== 'actions',
  },
};
```

Tooltip formatter output can be a string or HTML. HTML is passed through the grid's sanitizer. The formatter receives the same arguments as a cell formatter: `row`, `cell`, `value`, `column`, `dataContext`, and `grid`.

## Cell tooltips

Set `formatter` to provide custom content. When `asyncProcess` is also set, this formatter can display loading content while the asynchronous result is pending.

```ts
customTooltip: {
  formatter: (row, cell, value, column, item) =>
    `<strong>${item.title}</strong><br>Completion: ${item.percentComplete}%`,
}
```

### Async content

`asyncProcess` can return a Promise or an Observable. Provide `asyncPostFormatter` to format the result. The result is merged into a copy of the row data under `__params` by default; change the key with `asyncParamsPropName`.

```ts
customTooltip: {
  formatter: () => '<span>Loading…</span>',
  asyncProcess: (row, cell, value, column, item) =>
    fetch(`/api/tasks/${item.id}`).then((response) => response.json()),
  asyncPostFormatter: (row, cell, value, column, item) =>
    `<strong>${item.title}</strong><br>Owner: ${item.__params.owner}`,
}
```

Pending Promise work is cancelled when the tooltip closes or another tooltip opens. Observable subscriptions are unsubscribed at the same time.

### Delay showing a tooltip

There is no separate opening-delay option. Use `asyncProcess` with an empty initial formatter, then render the tooltip from `asyncPostFormatter` after a timer or asynchronous operation completes:

```ts
customTooltip: {
  formatter: () => '',
  asyncProcess: () => new Promise((resolve) => setTimeout(() => resolve({}), 500)),
  asyncPostFormatter: () => 'This tooltip appears after half a second.',
}
```

## Header tooltips

Use `headerFormatter` for column headers and `headerRowFormatter` for header-row cells such as filters. Both receive the row and cell indices, the value, the column, and the grid data context.

```ts
customTooltip: {
  headerFormatter: (row, cell, value, column) => `Column: ${column.name}`,
  headerRowFormatter: (row, cell, value, column) => `Filter for ${column.field}`,
}
```

Column-level options let you enable these formatters for selected columns only. Set `disableTooltip: true` on a column to suppress its tooltips.

## Regular tooltips and truncated cells

Set `useRegularTooltip: true` to read a `title` or `data-slick-tooltip` attribute from the cell formatter output. Regular tooltip content is plain text by default; set `renderRegularTooltipAsHtml: true` to render it as HTML.

When cell text is clipped, the plugin can show the full cell text automatically. Set `useRegularTooltipFromFormatterOnly: true` to read only tooltip attributes from the formatter output and skip the clipped-cell text fallback.
Set `useRegularTooltipFromCellTextOnly: true` to inspect the cell itself instead of a nested element under the pointer.

```ts
customTooltip: {
  useRegularTooltip: true,
  // useRegularTooltipFromFormatterOnly: true,
  // renderRegularTooltipAsHtml: true,
}
```

`tooltipTextMaxLength` limits tooltip text to 700 characters by default. Set it to another number to change the limit.

## Nested tooltip targets

Elements inside a cell can have their own `title` or `data-slick-tooltip` attributes. The tooltip uses the attribute on the hovered element, allowing a child control to show its own text while the rest of the cell uses the cell tooltip.

```html
<button title="Open task">
  <span title="Task actions">⋯</span>
</button>
```

## Position and hover behavior

`position` accepts `'auto'`, `'top'`, `'bottom'`, `'left-align'`, `'right-align'`, or `'center'`. The default is `'auto'`, which chooses an available side. `offsetLeft`, `offsetRight`, and `offsetTopBottom` adjust the placement.

By default, the tooltip closes when the pointer leaves its trigger. Set `persistOnHover: false` to let the pointer move onto the tooltip; `autoHideDelay` (3000 ms by default) then sets its maximum display time.

Other display options include `className`, `bodyClassName`, `maxWidth`, `maxHeight`, `whiteSpace`, and `regularTooltipWhiteSpace`.

## Tooltips outside the grid

Set `observeAllTooltips: true` to use the plugin for `title` and `data-slick-tooltip` attributes outside the grid. By default it observes the document body. Set `observeTooltipContainer` to a CSS selector to limit observation; comma-separated selectors are supported.

```ts
const grid = new SlickGrid('#myGrid', data, columns, {
  customTooltip: {
    observeAllTooltips: true,
    observeTooltipContainer: '.toolbar, #dialog',
  },
});
grid.registerPlugin(new SlickCustomTooltip());
```

```html
<button title="Save changes">Save</button>
<span data-slick-tooltip="More information">ⓘ</span>
```

## See also

- [Custom tooltip API](/reference/plugins)
- [Formatters](/in-depth/formatters)
- [Plugins](/in-depth/plugins)
