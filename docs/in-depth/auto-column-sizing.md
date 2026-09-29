---
title: Auto column sizing
---
# Auto column sizing

SlickGrid can set column widths for you from the content of the header and the data. This chapter explains the two sizing systems, the grid and column options that drive them, and when to trigger sizing. Use it when default widths do not fit your data, when you want columns to fill the viewport, or when you want the viewport to grow to fit the columns.

The defaults work well. Each column starts in `ContentIntelligent` mode, which inspects the data type and picks a good strategy on its own. You can leave the settings alone and only reach for this chapter when you need more control.

One rule shapes everything below: sizing needs data. An automatic algorithm cannot measure content that is not there. With no rows loaded, columns fall back to the width of their header text, which usually still looks fine.

## Two sizing systems

SlickGrid has two independent ways to set widths.

1. **Legacy force-fit.** The classic behaviour. It shrinks or grows the *current* column widths in proportion so they exactly fill the viewport. It never measures cell content.
2. **The autosize system.** The modern behaviour. It measures header and cell content per column, then fits the result to the viewport in one of several modes.

Both run through the same entry point, `grid.autosizeColumns()`. The grid option [`autosizeColsMode`](/reference/grid#opt-autosizeColsMode) selects which system runs and how. The legacy option [`forceFitColumns`](/reference/grid#opt-forceFitColumns) still works but only as a shortcut into legacy mode (see [Legacy force-fit](#legacy-force-fit)).

## The mental model

The autosize system has three layers. Set them in this order.

1. **Grid mode** — the relationship between the total column width and the viewport. Set with [`autosizeColsMode`](/reference/grid#opt-autosizeColsMode), one of the [`GridAutosizeColsMode`](#gridautosizecolsmode) values.
2. **Per-column strategy** — how one column derives its content width. Set with `column.autoSize.autosizeMode`, one of the [`ColAutosizeMode`](#colautosizemode) values.
3. **Measurement detail** — which rows to sample ([`RowSelectionMode`](#rowselectionmode)), how to reduce them ([`ValueFilterMode`](#valuefiltermode)), and how to measure width ([`WidthEvalMode`](#widthevalmode)).

The grid runs layer 2 for every column first. That produces a target width per column, stored in `autoSize.widthPx`. Then it runs layer 1 to fit those widths to the viewport.

### Why sizing is not trivial

Measuring content width looks simple: read the data and test each value. For a few rows it is. For large datasets it is slow, so the API trades a little accuracy for a lot of speed.

- **Character width varies.** In a proportional font, `mmmmm` is far wider than `iiiii`. The longest string is not always the widest. So a strategy may take the longest string and add a small percentage as a margin.
- **Canvas is fast, the DOM is slow.** A browser canvas can measure text width very quickly. Writing a test cell into the DOM and reading its width is much slower, because it can force reflows. But only the DOM can measure non-text content such as an image or an HTML formatter result.
- **Duplicates waste time.** Testing the same value a thousand times is pointless. A filter mode can reduce the data to unique values, or to a single representative value, before measuring.

These trade-offs are why the column options exist. Each one lets you avoid iterating every row when you do not have to.

## Quick start

```ts
import { SlickGrid, SlickDataView, GridAutosizeColsMode } from 'slickgrid';

const options = {
  enableCellNavigation: true,
  autosizeColsMode: GridAutosizeColsMode.FitColsToViewport,
};

const dataView = new SlickDataView();
const grid = new SlickGrid('#myGrid', dataView, columns, options);

// size the columns once the data is present
dataView.setItems(data);
grid.autosizeColumns();
```

The steps are:

1. Set [`autosizeColsMode`](/reference/grid#opt-autosizeColsMode) in the grid options.
2. Create the grid and load the data.
3. Call [`autosizeColumns()`](/reference/grid#m-autosizeColumns).

Step 3 matters. In the modern modes the grid does **not** size columns automatically. See [When to call autosizeColumns()](#when-to-call-autosizecolumns).

## Grid options

These options control the viewport behaviour plus global scaling and padding. Pass them to the grid constructor.

| Option | Default | Purpose |
| --- | --- | --- |
| [`autosizeColsMode`](/reference/grid#opt-autosizeColsMode) | `LegacyOff` | The grid mode. A [`GridAutosizeColsMode`](#gridautosizecolsmode) value. |
| [`autosizeColPaddingPx`](/reference/grid#opt-autosizeColPaddingPx) | `4` | Extra pixels added to each measured column width. |
| [`autosizeTextAvgToMWidthRatio`](/reference/grid#opt-autosizeTextAvgToMWidthRatio) | `0.75` | Multiplier that turns a string of `m` characters into an estimated average text width. Used by `GetLongestTextAndSub`. |
| [`colAutosizeTreatAsLockedBelowWidth`](/reference/grid#opt-colAutosizeTreatAsLockedBelowWidth) | `100` | Width (px) below which a small column is left at its natural size instead of being scaled to fill the viewport. |
| [`viewportSwitchToScrollModeWidthPercent`](/reference/grid#opt-viewportSwitchToScrollModeWidthPercent) | `undefined` | In `FitColsToViewport`, the point at which the grid gives up shrinking and shows a scrollbar. |
| [`viewportMinWidthPx`](/reference/grid#opt-viewportMinWidthPx) | `undefined` | In `FitViewportToCols`, the minimum viewport width. |
| [`viewportMaxWidthPx`](/reference/grid#opt-viewportMaxWidthPx) | `undefined` | In `FitViewportToCols`, the maximum viewport width. |
| [`forceFitColumns`](/reference/grid#opt-forceFitColumns) | `false` | Legacy shortcut. If `true`, sets `autosizeColsMode` to `LegacyForceFit` at startup. |

Notes on the less obvious ones:

- **`viewportSwitchToScrollModeWidthPercent`.** In `FitColsToViewport`, columns wider than the viewport shrink to fit. Past a point, shrinking makes them unreadable. A value of `120` means: if the columns add up to more than 120% of the viewport, stop shrinking and show a horizontal scrollbar instead.
- **`viewportMinWidthPx` / `viewportMaxWidthPx`.** In `FitViewportToCols`, the grid grows or shrinks its own element to match the columns. These set the limits. If a limit is crossed, the grid clamps to it and falls back to `FitColsToViewport`.
- **`colAutosizeTreatAsLockedBelowWidth`.** A small column such as a row index or a checkbox is left alone rather than stretched. The grid treats a column as locked when its header text is not ignored, it is not a `sizeToRemaining` column, its content is no wider than its header, and its width is under this threshold.

## Per-column options

Column strategy lives in the `autoSize` object on each [column definition](/reference/column#col-autoSize). The defaults are:

```ts
autoSize: {
  autosizeMode: ColAutosizeMode.ContentIntelligent,
  ignoreHeaderText: false,
  colValueArray: undefined,
  allowAddlPercent: undefined,
  formatterOverride: undefined,
  rowSelectionMode: RowSelectionMode.FirstNRows,
  rowSelectionModeOnInit: undefined,
  rowSelectionCount: 100,
  valueFilterMode: ValueFilterMode.None,
  widthEvalMode: WidthEvalMode.Auto,
  sizeToRemaining: undefined,
  colDataTypeOf: undefined,
}
```

These standard column properties also affect sizing:

- [`width`](/reference/column#col-width) — the base width. Used directly by the `Locked` and `Guide` modes, and as the target for `ContentExpandOnly`.
- [`minWidth`](/reference/column#col-minWidth) / [`maxWidth`](/reference/column#col-maxWidth) — hard limits. The final width is always clamped to this range.
- [`resizable`](/reference/column#col-resizable) — whether the user can drag the column edge. Autosize still resizes a non-resizable column unless its mode is `Locked`.

Field-by-field:

- **`autosizeMode`** — the column strategy. A [`ColAutosizeMode`](#colautosizemode) value.
- **`ignoreHeaderText`** — by default the header text sets a minimum width. Set `true` to ignore it and size from data only.
- **`colValueArray`** — an array of every possible value for the column. If set, the grid measures this array instead of the row data. Ideal for dropdowns, or a single "widest expected" value such as a full-length date. It catches values not yet present in the data but reachable by editing.
- **`allowAddlPercent`** — adds this percentage to the measured width, as a margin for strategies that estimate rather than measure exactly.
- **`formatterOverride`** — a cheaper [formatter](/in-depth/formatters) used only for measuring. Use it when the display formatter adds markup that does not change width. When measuring a cell the grid uses, in order: the formatter override, then the column formatter, then the raw value as text.
- **`rowSelectionMode`** — which rows to sample. A [`RowSelectionMode`](#rowselectionmode) value.
- **`rowSelectionModeOnInit`** — an optional `RowSelectionMode` used only during the first (init) sizing, when the sort order may be known. If unset, `rowSelectionMode` is used every time.
- **`rowSelectionCount`** — the row count for `FirstNRows`.
- **`valueFilterMode`** — how to reduce the sampled rows before measuring. A [`ValueFilterMode`](#valuefiltermode) value.
- **`widthEvalMode`** — how to measure width. A [`WidthEvalMode`](#widthevalmode) value.
- **`sizeToRemaining`** — marks a column to expand and fill leftover viewport space in `FitColsToViewport`. Good for a wide "notes" or "comments" column. Give it a modest `width` as a guide.
- **`colDataTypeOf`** — forces the data type for `ContentIntelligent`. Use the value that JavaScript `typeof` would return, or `'date'` / `'moment'`. Useful when the grid starts with no data.

Three fields are read-only outputs, written by the sizing pass. Do not set them:

- **`widthPx`** — the final computed width.
- **`contentSizePx`** — the measured content width.
- **`headerWidthPx`** — the measured header width.

## The enums

All of these are exported from the package and available on the [core](/reference/core) namespace.

### GridAutosizeColsMode

The grid mode. Sets the relationship between total column width and the viewport.

| Value | Behaviour |
| --- | --- |
| `None` | Do nothing. Autosize is switched off. |
| `LegacyOff` | *Default.* The legacy proportional algorithm, run only when you call `autosizeColumns()` yourself. |
| `LegacyForceFit` | The legacy proportional algorithm, run automatically whenever the grid resizes. |
| `IgnoreViewport` | Size columns from content and ignore the viewport. Empty space appears at the right if columns are narrower; a scrollbar appears if they are wider. |
| `FitColsToViewport` | Size columns from content, then fit them to the viewport (see the algorithm below). |
| `FitViewportToCols` | Size columns from content, then resize the grid element to fit them. |

### ColAutosizeMode

The per-column strategy, set on `column.autoSize.autosizeMode`.

| Value | Behaviour |
| --- | --- |
| `Locked` | Keep the column at its `width`. Autosize is disabled for this column. |
| `Guide` | Start at `width`, but allow later proportional scaling to fit the viewport. |
| `Content` | Measure the content using the column's `autoSize` settings. |
| `ContentExpandOnly` | Measure content, but never go below `width`. The column can grow but not shrink. |
| `ContentIntelligent` | *Default.* Inspect the data type and choose sensible `autoSize` settings automatically. |

`ContentIntelligent` sets these per detected type:

- **boolean** → measures the two values `[true, false]`.
- **number** → `valueFilterMode = GetGreatestAndSub`, `rowSelectionMode = AllRows`.
- **string** → `valueFilterMode = GetLongestText`, `rowSelectionMode = AllRows`, `allowAddlPercent = 5`.
- **date** / **moment** → measures a single wide reference date.

You can mix modes freely. Set explicit strategies on the columns you care about and leave the rest on `ContentIntelligent`.

### RowSelectionMode

Which rows to sample when measuring a column.

| Value | Behaviour |
| --- | --- |
| `FirstRow` | The first row only. Good when data is invariant or sorted descending. |
| `FirstNRows` | *Default.* The first `rowSelectionCount` rows (default 100). |
| `AllRows` | Every row. Most accurate, slowest. |
| `LastRow` | The last row only. Good when data is sorted ascending. |

### ValueFilterMode

How to reduce the sampled rows before measuring. These are speed strategies. Only measuring every row is 100% accurate, but on large datasets it is too slow.

| Value | Behaviour |
| --- | --- |
| `None` | *Default.* Measure the raw sampled values. |
| `DeDuplicate` | Measure the set of unique values only. |
| `GetGreatestAndSub` | For numbers: take the largest, replace every digit with `9`, measure that one value. |
| `GetLongestTextAndSub` | For strings: take the longest, replace every character with `m`, scale by `autosizeTextAvgToMWidthRatio`, measure that one value. |
| `GetLongestText` | For strings: measure the actual longest string. Usually paired with `allowAddlPercent` to allow for wider characters in shorter strings. |

### WidthEvalMode

How a value's width is measured.

| Value | Behaviour |
| --- | --- |
| `Auto` | *Default.* Use canvas when the column has no formatter, or a formatter marked text-only. Otherwise use the DOM. |
| `TextOnly` | Use the canvas to measure text. Fast, but text only. Do not use with a formatter that returns HTML. |
| `HTML` | Write the formatter result into a test cell and measure it. Handles HTML content. Slower, because it can cause reflows. |

## Worked example: strategy per column

Consider a task grid. Each column suits a different strategy.

```ts
import {
  ColAutosizeMode, ValueFilterMode, RowSelectionMode, WidthEvalMode,
} from 'slickgrid';

const columns = [
  // Row index: fixed and small. Lock it.
  { id: 'id', name: '#', field: 'id', width: 40,
    autoSize: { autosizeMode: ColAutosizeMode.Locked } },

  // Title: short text. Let the intelligent default handle it.
  { id: 'title', name: 'Title', field: 'title',
    autoSize: { autosizeMode: ColAutosizeMode.ContentIntelligent } },

  // Duration: a known set of options. Measure the options, not the data.
  { id: 'duration', name: 'Duration', field: 'duration',
    autoSize: {
      autosizeMode: ColAutosizeMode.Content,
      colValueArray: ['1 day', '2 days', '1 week', '1 month'],
    } },

  // Percent complete: an HTML bar. 100% is always the widest. Force HTML measuring.
  { id: 'pct', name: '% Complete', field: 'percentComplete',
    formatter: percentBarFormatter,
    autoSize: {
      autosizeMode: ColAutosizeMode.Content,
      colValueArray: [100],
      widthEvalMode: WidthEvalMode.HTML,
    } },

  // Start date: measure one wide reference date.
  { id: 'start', name: 'Start', field: 'start',
    autoSize: {
      autosizeMode: ColAutosizeMode.Content,
      colValueArray: [new Date(2009, 8, 30)],
    } },

  // Notes: very long, variable text. Give it the leftover space.
  { id: 'notes', name: 'Notes', field: 'notes', width: 150,
    autoSize: {
      autosizeMode: ColAutosizeMode.Guide,
      sizeToRemaining: true,
    } },
];
```

The principle: when you already know the widest value a column can hold, pass it in `colValueArray`. That is both faster and safer than reading the current data, which may not yet contain that value.

## The sizing algorithm

`autosizeColumns()` runs in two phases.

**Phase 1 — measure each column.** For every column:

1. If the mode is `Locked` or `Guide`, keep `width` and stop.
2. If the mode is `ContentIntelligent`, detect the data type and apply the default settings for it.
3. Measure the content:
   - Start from the header width, unless `ignoreHeaderText` is set.
   - If `colValueArray` is set, measure that array and skip the row logic.
   - Otherwise pick rows with `rowSelectionMode`, then reduce them with `valueFilterMode`.
   - Measure the resulting values with `widthEvalMode` (canvas or DOM).
4. Add `allowAddlPercent` and `autosizeColPaddingPx`.
5. Clamp to `minWidth` and `maxWidth`.
6. For `ContentExpandOnly`, ensure the result is at least `width`.
7. Store the result in `autoSize.widthPx`.

**Phase 2 — fit to the viewport.** This depends on `autosizeColsMode`:

- **`None`** — stop. No widths change.
- **`IgnoreViewport`** — apply each `widthPx` as-is. Columns may overflow (scrollbar) or leave a gap.
- **`FitColsToViewport`** —
  - If there are `sizeToRemaining` columns and spare space, expand only those, in proportion.
  - Else if the columns are too wide (past `viewportSwitchToScrollModeWidthPercent`, or wider than the viewport at their minimum widths), switch to `IgnoreViewport` and show a scrollbar.
  - Else scale all non-locked columns in proportion to fill the viewport.
- **`FitViewportToCols`** — compute the total width, clamp it to `viewportMinWidthPx` / `viewportMaxWidthPx`, resize the grid element, then apply the columns. If a limit is hit, fall back to `FitColsToViewport`.

Finally the grid applies the header widths and re-renders. It fires [`onAutosizeColumns`](/reference/grid#evt-onAutosizeColumns) with the updated columns.

To size one column instead of all, call [`autosizeColumn(indexOrId)`](/reference/grid#m-autosizeColumn). It runs phase 1 for that column and applies the result.

## Legacy force-fit

Force-fit predates the autosize system. It only rescales the current widths in proportion to fill the viewport. It never measures content, so columns keep their relative sizes and no column reads its data.

Two modes drive it:

- **`LegacyForceFit`** — the grid re-fits automatically whenever it resizes or gains a vertical scrollbar. This is the classic continuous force-fit.
- **`LegacyOff`** — the default. The same proportional fit, but only when you call `autosizeColumns()` yourself.

The old [`forceFitColumns: true`](/reference/grid#opt-forceFitColumns) option still works. At startup it simply sets `autosizeColsMode` to `LegacyForceFit`. Prefer setting `autosizeColsMode` directly in new code.

## When to call autosizeColumns()

This is the most common point of confusion.

- In the **modern modes** (`IgnoreViewport`, `FitColsToViewport`, `FitViewportToCols`), the grid does **not** size columns on its own. You must call [`autosizeColumns()`](/reference/grid#m-autosizeColumns) yourself, after the data is loaded.
- In **`LegacyForceFit`**, the grid re-fits automatically on resize. You rarely call it by hand.

Call `autosizeColumns()` after any change that affects width:

- after the first `setItems()` / data load;
- after a sort or filter that changes which rows are visible (widths sampled from `FirstNRows` may change);
- after adding or removing columns.

You can pass a one-off mode: `grid.autosizeColumns(GridAutosizeColsMode.IgnoreViewport)` sizes once in that mode without changing the option.

To re-fit automatically when the grid container resizes, use the **Resizer plugin** with the [`enableAutoSizeColumns`](/reference/grid#opt-enableAutoSizeColumns) grid option. The plugin then calls `autosizeColumns()` for you on container resize. See [Plugins](/in-depth/plugins) and the [plugin reference](/reference/plugins).

## Common pitfalls

- **Nothing happens on init.** In the modern modes you must call `autosizeColumns()` after loading data. It is not automatic.
- **Columns size to the header only.** There is no data to measure. Load data first, or supply `colValueArray`.
- **A slow first paint.** `Content` mode with `valueFilterMode: None` and `rowSelectionMode: AllRows` measures every row through the DOM. On large datasets this is very slow. Prefer `ContentIntelligent`, or set `colValueArray`, a filter mode, or `FirstNRows`.
- **Broken widths with an HTML formatter.** Canvas measures text only. If a formatter returns HTML, use `WidthEvalMode.HTML` (or leave `Auto`, which detects a text-only formatter). Do not force `TextOnly`.
- **A dropdown column too narrow after editing.** The measured data did not include the longest option. Pass every option in `colValueArray`.
- **A small column stretches oddly.** Adjust [`colAutosizeTreatAsLockedBelowWidth`](/reference/grid#opt-colAutosizeTreatAsLockedBelowWidth), or set the column to `Locked`.
- **Two different "locks."** Locking a column's *width* and locking it from *autosizing* are separate settings, easy to confuse because both say "lock". A column can be one, both, or neither:
    - [`resizable: false`](/reference/column#col-resizable) on the column locks its width, so the user cannot drag to resize it.
    - `autoSize: { autosizeMode: ColAutosizeMode.Locked }` on the column locks it from being autosized, so [`autosizeColumns()`](/reference/grid#m-autosizeColumns) leaves its width unchanged.

## See also

- Grid options: [`autosizeColsMode`](/reference/grid#opt-autosizeColsMode), [`forceFitColumns`](/reference/grid#opt-forceFitColumns), [`autosizeColPaddingPx`](/reference/grid#opt-autosizeColPaddingPx), [`colAutosizeTreatAsLockedBelowWidth`](/reference/grid#opt-colAutosizeTreatAsLockedBelowWidth), [`enableAutoSizeColumns`](/reference/grid#opt-enableAutoSizeColumns)
- Grid methods: [`autosizeColumns()`](/reference/grid#m-autosizeColumns), [`autosizeColumn()`](/reference/grid#m-autosizeColumn), [`reRenderColumns()`](/reference/grid#m-reRenderColumns)
- Grid event: [`onAutosizeColumns`](/reference/grid#evt-onAutosizeColumns)
- Column property: [`autoSize`](/reference/column#col-autoSize)
- Enums: [`GridAutosizeColsMode`, `ColAutosizeMode`, `RowSelectionMode`, `ValueFilterMode`, `WidthEvalMode`](/reference/core)
- Related chapters: [Formatters](/in-depth/formatters), [Providing data to the grid](/in-depth/providing-data), [Plugins](/in-depth/plugins)
