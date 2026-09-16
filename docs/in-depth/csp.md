---
title: CSP compliance & sanitization
---
# CSP compliance & sanitization

This chapter shows how to run SlickGrid under a strict [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/CSP) (CSP). You need it when your page blocks inline styles, blocks `eval`, or turns on [Trusted Types](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API). A strict CSP stops some of the ways SlickGrid writes HTML and CSS into the DOM. SlickGrid gives you a small set of options to work within those limits: a `sanitizer`, `enableHtmlRendering`, a `nonce`, and native-HTML formatters. Data filtering is already CSP-safe in v6.

## Concepts

### How SlickGrid writes to the DOM

SlickGrid renders cells and headers through one method, [`applyHtmlCode`](/reference/grid#m-applyHtmlCode). It chooses how to write each value:

- **An `HTMLElement` or `DocumentFragment`** — it clears the target and calls `appendChild`. This never touches `innerHTML`.
- **A `number` or `boolean`** — it sets `textContent`.
- **A `string`** — it runs the string through [`sanitizeHtmlString`](/reference/grid#m-sanitizeHtmlString), then writes it. It uses `innerHTML` when [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) is on (the default), or `textContent` when it is off.

SlickGrid also injects one `<style>` element for column and row sizing. It builds this at runtime from the grid options.

### What a strict CSP breaks

Two grid behaviours conflict with a strict policy:

1. **String HTML into `innerHTML`.** A policy with `require-trusted-types-for 'script'` rejects a plain string assigned to `innerHTML`. The assignment throws a `TypeError`. This affects every string that reaches `applyHtmlCode` — formatter output, header names, menu titles, and tooltips.
2. **The injected `<style>` element.** A `style-src` directive without `'unsafe-inline'` blocks the sizing stylesheet. The grid then renders with wrong row and column sizes.

A policy without `'unsafe-eval'` also blocks `eval` and `new Function`. This does **not** affect v6 filtering (see [DataView filters](#dataview-filters-are-csp-safe) below).

### The four tools

| Option | Purpose |
| --- | --- |
| [`sanitizer`](/reference/grid#opt-sanitizer) | Clean every HTML string, and (with DOMPurify) return `TrustedHTML`. |
| [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) | Turn the string-to-`innerHTML` path off, so strings render as text. |
| [`nonce`](/reference/grid#opt-nonce) | Stamp the injected `<style>` element so `style-src` accepts it. |
| [`logSanitizedHtml`](/reference/grid#opt-logSanitizedHtml) | Log when the sanitizer changes your HTML. A debugging aid. |

You combine these two ways:

- **Strategy A — Trusted Types.** Keep `enableHtmlRendering` on and set a `sanitizer` that returns `TrustedHTML`. Every HTML string becomes trusted, so `innerHTML` is allowed. This is the most robust choice, because some plugins still use `innerHTML` from a sanitized string.
- **Strategy B — no HTML strings.** Set `enableHtmlRendering` to `false` and return native elements from your formatters. Your cells never use `innerHTML`.

You can use both together for the smallest attack surface.

## Walkthrough

### 1. Add the CSP header

Start from the policy the SlickGrid demo uses. It allows a nonced stylesheet and requires Trusted Types.

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' 'nonce-r4nd0m';
           require-trusted-types-for 'script';
           trusted-types dompurify">
```

Notes:

- `style-src 'self' 'nonce-r4nd0m'` allows the sizing stylesheet, but only when it carries the matching nonce.
- `require-trusted-types-for 'script'` forces every `innerHTML` assignment to receive a `TrustedHTML` value.
- `trusted-types dompurify` allows the Trusted Types policy that DOMPurify registers.
- In production, generate the nonce per request on the server. Do not hard-code it.

### 2. Provide a sanitizer

Set the [`sanitizer`](/reference/grid#opt-sanitizer) option. It receives a dirty HTML string and returns a clean one. SlickGrid calls it through [`sanitizeHtmlString`](/reference/grid#m-sanitizeHtmlString) for all HTML strings. Use [DOMPurify](https://github.com/cure53/DOMPurify).

For a normal CSP (no Trusted Types), return a string:

```typescript
import DOMPurify from 'dompurify';
import { SlickGrid } from 'slickgrid';

const options = {
  sanitizer: (dirtyHtml: string) => DOMPurify.sanitize(dirtyHtml),
};

const grid = new SlickGrid('#myGrid', data, columns, options);
```

For a Trusted Types CSP, return a `TrustedHTML`. DOMPurify does this with `RETURN_TRUSTED_TYPE`:

```typescript
import DOMPurify from 'dompurify';
import { SlickGrid } from 'slickgrid';

const options = {
  // DOMPurify returns TrustedHTML here; the option type is `string`, so cast it.
  sanitizer: (dirtyHtml: string) =>
    DOMPurify.sanitize(dirtyHtml, { RETURN_TRUSTED_TYPE: true }) as unknown as string,
  nonce: 'r4nd0m',
};

const grid = new SlickGrid('#myGrid', data, columns, options);
```

The `nonce` value must match the nonce in the `style-src` directive.

Without a `sanitizer`, `sanitizeHtmlString` returns the input unchanged. You then get no XSS protection, and under Trusted Types the `innerHTML` assignment throws.

### 3. (Optional) Log what the sanitizer removes

Turn on [`logSanitizedHtml`](/reference/grid#opt-logSanitizedHtml) while you develop. SlickGrid logs a message when the sanitizer changes your HTML.

```typescript
const options = {
  sanitizer: (dirtyHtml: string) => DOMPurify.sanitize(dirtyHtml),
  logSanitizedHtml: true,
};
```

A changed value logs as `sanitizer altered html: <before> --> <after>`. SlickGrid caps the number of messages, then silences the rest. Use this to find a formatter that emits markup your sanitizer strips.

### 4. Prefer native-HTML formatters

The cleanest way to stay CSP-safe is to stop producing HTML strings. A [formatter](/reference/formatters) may return several types:

```typescript
type Formatter = (
  row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid
) => string | HTMLElement | DocumentFragment | FormatterResultWithHtml | FormatterResultWithText;
```

When a formatter returns an `HTMLElement` or `DocumentFragment`, SlickGrid appends it directly. It does not use `innerHTML`, and it does not call the sanitizer. The cell is safe even with no sanitizer and with Trusted Types on.

A string formatter mixes data into markup and needs the `innerHTML` path:

```typescript
// String output — needs a sanitizer and innerHTML.
const linkFormatter: Formatter = (row, cell, value) =>
  `<a href="/user/${value}">${value}</a>`;
```

Rewrite it to build a real element. Put data into `textContent` and properties, never into a string:

```typescript
import type { Formatter } from 'slickgrid';

// Native element — no innerHTML, no sanitizer, no injection.
const linkFormatter: Formatter = (row, cell, value) => {
  const a = document.createElement('a');
  a.href = `/user/${encodeURIComponent(value)}`;
  a.textContent = String(value);
  return a;
};
```

To add CSS classes or a tooltip, return a [`FormatterResultWithHtml`](/reference/formatters) object. Its `html` property holds the element:

```typescript
const badgeFormatter: Formatter = (row, cell, value) => {
  const span = document.createElement('span');
  span.textContent = String(value);
  return { html: span, addClasses: 'badge', toolTip: `Value: ${value}` };
};
```

For plain text with classes, use `FormatterResultWithText` and its `text` property. SlickGrid writes `text` with `textContent`.

### 5. (Optional) Turn off HTML string rendering

Set [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) to `false` to close the string-to-`innerHTML` path in the core rendering method.

```typescript
const options = {
  enableHtmlRendering: false,
};
```

With this off, a string value renders as literal text. Any HTML tags in the string appear as text, not markup. So convert every formatter that must show markup to return a native element (step 4). This option controls the core cell and header path in `applyHtmlCode`; it does not change how a formatter that returns an element behaves.

### 6. DataView filters are CSP-safe

In v6, DataView filtering never compiles code. [`setFilter`](/reference/dataview#m-setFilter) takes a plain callback and runs it directly. It works under a `script-src` that omits `'unsafe-eval'`.

```typescript
import { SlickDataView } from 'slickgrid';

const dataView = new SlickDataView();
dataView.setFilter((item) => item.active === true);
```

The old [`useCSPSafeFilter`](/reference/dataview#dvopt-useCSPSafeFilter) and `inlineFilters` options are **deprecated and ignored**. They switched between filter strategies in earlier versions. You no longer need them. Remove them from your DataView setup; a later major release will delete them. The related `FilterCspFn` and `FilterWithCspCachingFn` type aliases are deprecated for the same reason.

## Common pitfalls

- **A missing sanitizer under Trusted Types.** With `require-trusted-types-for 'script'` and no `sanitizer`, the first HTML string assigned to `innerHTML` throws a `TypeError`. Set a `sanitizer` that returns `TrustedHTML`, or return native elements and set `enableHtmlRendering: false`.
- **A mismatched nonce.** The `nonce` option must equal the nonce in the `style-src` directive. If they differ, the browser blocks the sizing stylesheet and columns size wrongly. A wrong nonce fails silently apart from the layout.
- **Plugins that still use `innerHTML`.** Turning off `enableHtmlRendering` covers the core cell and header path, but some plugins (for example Row Detail) still assign a sanitized string to `innerHTML`. If you enable such a plugin under Trusted Types, keep a `sanitizer` that returns `TrustedHTML`. This is why Strategy A is the safer default.
- **Data inside an HTML string.** Even with a sanitizer, building strings like `` `<a>${value}</a>` `` risks breaking on quotes and relies on the sanitizer for safety. Prefer native elements and set data through `textContent` and properties.
- **Leftover filter options.** Passing `useCSPSafeFilter: true` does nothing in v6. Do not rely on it to change behaviour.
- **Header names as HTML.** A column `name` that contains markup also passes through `applyHtmlCode`. The same rules apply: it needs the sanitizer, or set `name` to a plain string, or assign an `HTMLElement`.

## See also

- Grid options: [`sanitizer`](/reference/grid#opt-sanitizer) · [`enableHtmlRendering`](/reference/grid#opt-enableHtmlRendering) · [`nonce`](/reference/grid#opt-nonce) · [`logSanitizedHtml`](/reference/grid#opt-logSanitizedHtml)
- Grid methods: [`sanitizeHtmlString`](/reference/grid#m-sanitizeHtmlString) · [`applyHtmlCode`](/reference/grid#m-applyHtmlCode)
- DataView: [`setFilter`](/reference/dataview#m-setFilter) · [`useCSPSafeFilter`](/reference/dataview#dvopt-useCSPSafeFilter) (deprecated)
- Column: [`formatter`](/reference/column#col-formatter)
- Reference pages: [Formatters](/reference/formatters)
- Related chapters: [Formatters](/in-depth/formatters) · [Filtering & paging](/in-depth/filtering-paging)
