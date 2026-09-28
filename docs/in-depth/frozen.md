---
title: Frozen rows & columns
---

# Frozen rows & columns

Frozen (pinned) rows and columns stay in place while the rest of the grid scrolls. Use them for row headers, key columns, or a totals row that must stay visible.

::: tip v6
Version 6 reworks frozen panes into a 3×3 band model. You can now pin columns on the **right** as well as the left, and pin rows at the **top and bottom at the same time**. This is the ViewportMgr work from PR #1238.
:::

## The mental model

The grid is split into up to nine viewports: a left / centre / right column band, crossed with a top / middle / bottom row band. Frozen bands do not scroll. The centre-middle viewport scrolls in both directions. You choose which bands exist through options.

## Freeze columns on the left

Set [`frozenColumn`](/reference/grid#opt-frozenColumn) to the zero-based index of the last column to pin. Every column up to and including that index stays fixed on the left.

```ts
const grid = new SlickGrid('#grid', data, columns, {
  frozenColumn: 1, // pin the first two columns
});
```

## Freeze columns on the right (v6)

Set `frozenRightColumn` to the **number** of columns to pin on the right edge.

```ts
const grid = new SlickGrid('#grid', data, columns, {
  frozenRightColumn: 1, // pin the last column on the right
});
```

`frozenRightColumn` is a count from the right, not a column index. The count stays correct when columns are reordered or hidden. Keep at least one scrollable column between the left and right frozen bands; see the freeze-validation options below.

## Freeze rows at the top

Set [`frozenRow`](/reference/grid#opt-frozenRow) to the number of rows to pin. By default they pin at the top.

```ts
const grid = new SlickGrid('#grid', data, columns, {
  frozenRow: 1, // pin the first row
});
```

## Freeze rows at the bottom

There are two ways, for two different needs.

- Legacy single band: set [`frozenBottom`](/reference/grid#opt-frozenBottom) to `true`. This moves the single `frozenRow` band to the bottom instead of the top.
- v6 top **and** bottom: set `frozenBottomRow` to the number of rows to pin at the bottom, together with `frozenRow` for the top. When `frozenBottomRow` is greater than 0, the legacy `frozenBottom` flag is ignored.

```ts
const grid = new SlickGrid('#grid', data, columns, {
  frozenRow: 1,        // one pinned row at the top
  frozenBottomRow: 1,  // one pinned row at the bottom (v6)
});
```

## Keep a usable scroll area

When you pin columns, keep the scrollable middle wide enough to use.

- `frozenRightViewportMinWidth` (default 100) sets the smallest width to keep for the right section of a frozen grid.
- The grid validates that frozen columns are not wider than the visible canvas. You can control the message and callback with the `invalidColumnFreeze*` options, or skip the check with `skipFreezeColumnValidation`.

## Notes

- Frozen columns work well with the column `hidden` property. Because `frozenRightColumn` is a count from the right, hiding or reordering columns does not break the right band. See [Migrating to v6](/in-depth/migration-v6).
- Mouse-wheel scrolling over a frozen band is handled for you; `enableMouseWheelScrollHandler` is on by default.

## See also

- [Migrating to v6](/in-depth/migration-v6)
- Reference: [`frozenColumn`](/reference/grid#opt-frozenColumn), [`frozenRow`](/reference/grid#opt-frozenRow), [`frozenBottom`](/reference/grid#opt-frozenBottom), and the other frozen options on the [SlickGrid reference](/reference/grid).
