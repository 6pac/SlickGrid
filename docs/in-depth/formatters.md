---
title: Formatters
---
# Formatters

A formatter turns a cell's raw value into what the cell shows. It changes the display only; it never changes the underlying data. You set one per column through the [`formatter`](/reference/column#col-formatter) property. Read this chapter when a cell must show more than the plain value — a colored number, an icon, a link, or a value with an extra CSS class or tooltip. It covers the built-in formatters, the formatter signature and its return types, the CSP-safe way to emit HTML, a grid-wide default, a factory, and group totals formatters.

## Concepts

### What a formatter is

The grid reads each cell value from the row item. It uses the column's [`field`](/reference/column#col-field) (or a provider's `getCellValue`). Then it calls the column's formatter to build the cell content. Without a formatter, the grid uses its [`defaultFormatter`](#the-default-formatter).

A formatter runs on every render for every visible cell. Keep it fast, and cause no side effects.

### The formatter signature

A formatter is one function. Its type is [`Formatter`](/reference/formatters):

```typescript
import type { Formatter, Column, SlickGrid } from 'slickgrid';

type Formatter<T = any> = (
  row: number,          // row index
  cell: number,         // cell (column) index
  value: any,           // the cell value the grid read for this column
  columnDef: Column<T>, // the column definition
  dataContext: T,       // the whole row item
  grid: SlickGrid       // the grid instance
) => string | HTMLElement | DocumentFragment | FormatterResultWithHtml | FormatterResultWithText;
```

Most formatters use only `value`. Use `dataContext` to read another field of the same row. Use `columnDef` to read per-column config from [`columnDef.params`](#reuse-a-formatter-with-params).

### Return types

A formatter returns one of five things. The grid writes each one through a single method, [`applyHtmlCode`](/reference/grid#m-applyHtmlCode):

- **A `string`.** The grid treats it as HTML. It runs the string through the [`sanitizer`](/reference/grid#opt-sanitizer), then assigns it with `innerHTML` when [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) is on (the default). This is the simplest return, but it needs care under a strict CSP.
- **An `HTMLElement`.** The grid appends it directly. It does not use `innerHTML` and it does not call the sanitizer. This is the CSP-safe route.
- **A `DocumentFragment`.** Same as an element: the grid appends it directly. Use it to add several nodes at once.
- **A [`FormatterResultWithHtml`](/reference/formatters) object.** It carries an element plus extra cell options (see below).
- **A [`FormatterResultWithText`](/reference/formatters) object.** It carries a string plus the same extra options.

A formatter that returns `null` or `undefined` produces an empty cell.

### The result object

Return a result object when you also want to change the cell's classes or its tooltip. Both variants share these optional fields:

| Field | Effect |
| --- | --- |
| `addClasses` | CSS classes to add to the cell's `div` (space-separated). |
| `removeClasses` | CSS classes to remove from the cell's `div`. |
| `toolTip` | Sets the cell `div`'s `title` attribute. |
| `insertElementAfterTarget` | Inserts an element after the cell. Advanced; used by row detail. |

The two variants differ only in how you give the content:

- `FormatterResultWithHtml` has an `html` property — an `HTMLElement`. The grid appends it directly, like returning an element.
- `FormatterResultWithText` has a `text` property — a string. The grid handles it like a returned string (sanitized, then the `innerHTML` path).

Prefer `html` when a strict CSP is in play. See [CSP compliance](/in-depth/csp).

### How the grid picks a formatter

For each cell the grid resolves a formatter from the most specific source to the least specific:

1. A cell override from item metadata (`columns[colId].formatter`).
2. A row override from item metadata (`rowMetadata.formatter`).
3. The column's own [`formatter`](/reference/column#col-formatter).
4. The grid's [`formatterFactory`](#assign-formatters-with-a-factory).
5. The grid's [`defaultFormatter`](#the-default-formatter).

The [Providing data](/in-depth/providing-data#order-of-checks) chapter documents the metadata overrides (steps 1 and 2) in full.

### The default formatter

When no formatter applies, the grid uses its [`defaultFormatter`](/reference/grid#opt-defaultFormatter). The built-in one returns an empty string for an undefined value. Otherwise it converts the value to a string and escapes `&`, `<`, and `>`. So a plain column is safe by default; raw markup in the data shows as text, not as HTML.

## Walkthrough

### 1. Use a built-in formatter

SlickGrid ships a small set of example formatters in the `Formatters` registry. Import it and assign one to a column's `formatter`:

```typescript
import { SlickGrid, Formatters } from 'slickgrid';

const columns = [
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'done', name: 'Done', field: 'done', formatter: Formatters.Checkmark },
  { id: 'pct', name: 'Complete', field: 'percentComplete', formatter: Formatters.PercentCompleteBar },
];

const grid = new SlickGrid('#myGrid', data, columns, options);
```

The registry holds these:

| Registry key | Shows | Notes |
| --- | --- | --- |
| `Formatters.PercentComplete` | The number with a `%` sign, red below 50, green above. `-` when empty. | Uses an inline style color. |
| `Formatters.PercentCompleteBar` | A colored bar whose width is the value percent. | Needs CSS for `.percent-complete-bar`. |
| `Formatters.YesNo` | `Yes` for a truthy value, else `No`. | Plain text. |
| `Formatters.Checkmark` | A check icon when truthy, else empty. | Needs the SlickGrid icon CSS (`sgi` classes). |
| `Formatters.Checkbox` | A checkbox icon that reflects the value. | Needs the SlickGrid icon CSS. |

Each formatter is also exported on its own, for example `PercentCompleteFormatter` or `YesNoFormatter`.

These built-ins return HTML strings. Under a strict CSP they need a [`sanitizer`](/reference/grid#opt-sanitizer). The icon and bar formatters also need the matching CSS to render. Treat them as examples; write your own for production, as the source itself advises.

### 2. Write a string formatter

The quickest custom formatter returns a string. This one colors a number by sign:

```typescript
import type { Formatter } from 'slickgrid';

const signFormatter: Formatter = (row, cell, value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const color = value < 0 ? 'red' : 'green';
  return `<span style="color:${color}">${value}</span>`;
};
```

A string formatter mixes your data into markup. When the value can contain user text, the string reaches `innerHTML`, so you rely on the [`sanitizer`](/reference/grid#opt-sanitizer) for safety. The next step avoids that risk.

### 3. Return a native element (CSP-safe)

Return an `HTMLElement` to skip `innerHTML` and the sanitizer entirely. Put data into `textContent` and properties, never into a markup string:

```typescript
import type { Formatter } from 'slickgrid';

const linkFormatter: Formatter = (row, cell, value, columnDef, dataContext) => {
  const a = document.createElement('a');
  a.href = `/user/${encodeURIComponent(dataContext.id)}`;
  a.textContent = String(value ?? '');
  return a;
};
```

This is the recommended shape for anything that shows user data as markup. The [CSP chapter](/in-depth/csp#4-prefer-native-html-formatters) explains why, and how it fits a Trusted Types policy.

### 4. Add classes or a tooltip with a result object

Return a result object to set the content and change the cell at once. Use `html` with an element:

```typescript
import type { Formatter } from 'slickgrid';

const badgeFormatter: Formatter = (row, cell, value) => {
  const span = document.createElement('span');
  span.textContent = String(value ?? '');
  return {
    html: span,
    addClasses: 'badge',
    toolTip: `Value: ${value}`,
  };
};
```

Use `text` with a string when you do not need a native element:

```typescript
const statusFormatter: Formatter = (row, cell, value) => ({
  text: value ? 'Active' : 'Inactive',
  addClasses: value ? 'is-active' : 'is-inactive',
});
```

`addClasses` adds to the cell's classes; it does not replace them. Use `removeClasses` to drop a class the cell already has.

### 5. Reuse a formatter with `params`

The column carries an optional [`params`](/reference/column#col-params) property for your own data. Read it from `columnDef` to configure one formatter for several columns:

```typescript
import type { Formatter } from 'slickgrid';

const currencyFormatter: Formatter = (row, cell, value, columnDef) => {
  const symbol = columnDef.params?.symbol ?? '$';
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return `${symbol}${Number(value).toFixed(2)}`;
};

const columns = [
  { id: 'usd', name: 'USD', field: 'usd', formatter: currencyFormatter, params: { symbol: '$' } },
  { id: 'eur', name: 'EUR', field: 'eur', formatter: currencyFormatter, params: { symbol: '€' } },
];
```

### 6. Set a grid-wide default formatter

Set the [`defaultFormatter`](/reference/grid#opt-defaultFormatter) grid option to change how every column with no formatter renders. It uses the same signature:

```typescript
import type { Formatter } from 'slickgrid';

const dashForEmpty: Formatter = (row, cell, value) =>
  value === null || value === undefined || value === '' ? '—' : String(value);

const grid = new SlickGrid('#myGrid', data, columns, {
  defaultFormatter: dashForEmpty,
});
```

A per-column `formatter` still wins over the default.

### 7. Assign formatters with a factory

Set the [`formatterFactory`](/reference/grid#opt-formatterFactory) grid option to choose a formatter per column at run time. The grid calls `getFormatter(column)` for any column that has no `formatter` of its own. This suits a data-driven setup where columns declare a type:

```typescript
import { Formatters } from 'slickgrid';
import type { Column, Formatter } from 'slickgrid';

const formatterFactory = {
  getFormatter: (column: Column): Formatter => {
    switch (column.params?.type) {
      case 'bool': return Formatters.YesNo;
      case 'percent': return Formatters.PercentComplete;
      default: return (row, cell, value) => String(value ?? '');
    }
  },
};

const grid = new SlickGrid('#myGrid', data, columns, { formatterFactory });
```

The factory sits below a column's own `formatter` and above the `defaultFormatter` in the resolution order above.

### 8. Format group totals

A grouped grid shows a totals row under each group. That row uses a different function: the column's [`groupTotalsFormatter`](/reference/column#col-groupTotalsFormatter). Its signature differs from a cell formatter, and it returns a string:

```typescript
import type { GroupTotalsFormatter } from 'slickgrid';

const sumFormatter: GroupTotalsFormatter = (totals, columnDef) => {
  const val = totals.sum?.[columnDef.field];
  return val != null ? `Total: ${Number(val).toFixed(2)}` : '';
};

const columns = [
  { id: 'cost', name: 'Cost', field: 'cost', groupTotalsFormatter: sumFormatter },
];
```

The `totals` argument holds the aggregator results. Each aggregator writes under its type, keyed by field — for example `totals.sum[field]`, `totals.avg[field]`, `totals.min[field]`, `totals.max[field]`, and `totals.count[field]`. You choose the aggregators when you group the data. The `SlickGroupItemMetadataProvider` wires the totals row to call this formatter.

Grouping, aggregators, and the totals object have their own chapter: [Grouping & aggregators](/in-depth/grouping).

## Common pitfalls and notes

- **Tolerate an empty value.** The grid may call a formatter with `undefined` — for the add-new row, or an unloaded row in a remote model. Guard against `null`, `undefined`, and `''` before you read properties.
- **A string return needs sanitizing.** When a formatter returns a string that includes data, that string reaches `innerHTML`. Set a [`sanitizer`](/reference/grid#opt-sanitizer), or return a native element instead. See [CSP compliance](/in-depth/csp).
- **HTML strings only render when enabled.** With [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) off, a string formatter's tags show as literal text. Return an element to show markup in that mode.
- **Formatters are display only.** The value you return does not change the row item, sorting, or filtering. Sort and filter work on the raw data, not the formatted text.
- **Keep them cheap.** A formatter runs for every visible cell on each render. Do simple work; do not fetch, log, or mutate shared state.
- **Group totals use a different function.** `groupTotalsFormatter` takes `(totals, columnDef, grid)` and returns a string only. It is not the same as a cell `formatter`.
- **Built-ins are examples.** `Formatters.*` cover common cases but need their CSS, and emit HTML strings. Write your own for localization, safety, and full control.

## See also

- Reference: [Formatters](/reference/formatters) — the built-in registry and the result-object types.
- Column properties: [`formatter`](/reference/column#col-formatter) · [`groupTotalsFormatter`](/reference/column#col-groupTotalsFormatter) · [`params`](/reference/column#col-params) · [`field`](/reference/column#col-field)
- Grid options: [`defaultFormatter`](/reference/grid#opt-defaultFormatter) · [`formatterFactory`](/reference/grid#opt-formatterFactory) · [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) · [`sanitizer`](/reference/grid#opt-sanitizer)
- Grid methods: [`applyHtmlCode`](/reference/grid#m-applyHtmlCode)
- Related chapters: [CSP compliance](/in-depth/csp) · [Providing data](/in-depth/providing-data#order-of-checks) · [Cell editors](/in-depth/custom-editors) · [Grouping & aggregators](/in-depth/grouping) · [Theming & styling](/in-depth/theming)
