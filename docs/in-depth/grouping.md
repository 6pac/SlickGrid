---
title: Grouping & aggregators
---

# Grouping & aggregators

Grouping collects rows that share a value into a group, and shows a header row above each group and an optional totals row below it. The `SlickDataView` does the work: it reads a group value from each item, sorts the items into groups, and can run aggregators (sum, average, count, and so on) to build per-group totals. This chapter shows how to wire grouping, call [`setGrouping`](/reference/dataview#m-setGrouping), use the built-in aggregators, format group totals, and collapse or expand groups. It builds on the [DataView](/in-depth/dataview) chapter, so read that first.

## Concepts

### Three kinds of row

When you group data, the DataView produces three kinds of row, not one:

- **Data rows** — your items, as usual.
- **Group header rows** — one `SlickGroup` object per group. It carries the group `value`, the `count` of rows, the `level`, a `groupingKey`, and a `collapsed` flag.
- **Totals rows** — one `SlickGroupTotals` object per group when the group has aggregators. The aggregators write their results onto it.

The grid renders all three through the same row pipeline. It counts group and totals rows as rows, so a grouped grid has more rows than items.

### The group item metadata provider

The grid does not know how to draw a group header or a totals row on its own. `SlickGroupItemMetadataProvider` tells it how. For each special row it supplies the metadata the grid needs: which formatter to use, the CSS classes, whether the row is selectable or focusable, and the column colspan. The provider also acts as a grid plugin: it listens for clicks on the toggle icon and for the space key, and it collapses or expands the group.

That gives two wiring points, and you need both:

1. The **DataView** must hold the provider, through its [`groupItemMetadataProvider`](/reference/dataview#dvopt-groupItemMetadataProvider) option. The DataView asks the provider for the metadata of each group and totals row.
2. The **grid** must register the provider as a plugin with [`registerPlugin`](/reference/grid#m-registerPlugin). Without this, the headers still draw, but clicking the toggle does nothing.

Use one provider instance for both. `setGrouping` creates a provider on the DataView if you did not set one, but you cannot retrieve that instance to register it on the grid. So create it yourself.

### The grouping definition

You describe grouping with a `Grouping` object (or an array of them for multiple levels). The important fields are:

- `getter` — how to read the group value from an item. A string field name, or a function `(item) => value`.
- `formatter` — builds the group header title from the group. Optional.
- `aggregators` — an array of aggregators that compute the totals. Optional.
- `comparer` — orders the groups. Optional; the default sorts ascending by value.
- `collapsed` — start every group collapsed. Optional; default `false`.

## Walkthrough

### 1. Create the provider and wire it to both sides

```ts
import {
  SlickGrid,
  SlickDataView,
  SlickGroupItemMetadataProvider,
  type Column,
} from 'slickgrid';

const groupItemMetadataProvider = new SlickGroupItemMetadataProvider();

// give it to the DataView through options
const dataView = new SlickDataView({ groupItemMetadataProvider });

const grid = new SlickGrid('#myGrid', dataView, columns, options);

// register it as a grid plugin so expand/collapse works
grid.registerPlugin(groupItemMetadataProvider);
```

Wire the DataView change event to the grid as usual (see [DataView](/in-depth/dataview#_1-wire-the-dataview-to-the-grid)), then load items with [`setItems`](/reference/dataview#m-setItems).

### 2. Call setGrouping

Pass one `Grouping` object to group by a single field:

```ts
import { Aggregators, SortDirectionNumber } from 'slickgrid';

dataView.setGrouping({
  getter: 'category',
  formatter: (g) => `${g.value}  <span style="color:#666">(${g.count} items)</span>`,
  aggregators: [
    new Aggregators.Sum('cost'),
    new Aggregators.Avg('cost'),
  ],
  // optional: sort groups descending by value instead of the default ascending
  comparer: (a, b) =>
    a.value === b.value
      ? SortDirectionNumber.neutral
      : a.value > b.value
        ? SortDirectionNumber.desc
        : SortDirectionNumber.asc,
  collapsed: false,
});
```

`setGrouping` refreshes the grid for you; you do not call `refresh` after it. Read the current definition back with [`getGrouping`](/reference/dataview#m-getGrouping), and the built `SlickGroup` tree with [`getGroups`](/reference/dataview#m-getGroups).

The `formatter` receives a group with `value`, `count`, `level` and `groupingKey`. It returns a string; the provider inserts it as sanitized HTML, so simple markup is allowed. If you omit the formatter, the header shows the raw group value.

::: tip String getters use the grid's value extractor
When `getter` is a string field name, the DataView reads the value with the grid's [`dataItemColumnValueExtractor`](/reference/grid#opt-dataItemColumnValueExtractor) if one is set, so group values match what the cells display (useful for nested or computed fields). It falls back to plain `item[field]`. A function getter is called directly and ignores the extractor.
:::

### 3. Format the group totals

Aggregators only compute numbers; they do not display them. To show a total in a column, give that column a [`groupTotalsFormatter`](/reference/column#col-groupTotalsFormatter). It reads the value the aggregator stored and returns the cell text:

```ts
const columns: Column[] = [
  { id: 'category', name: 'Category', field: 'category' },
  {
    id: 'cost',
    name: 'Cost',
    field: 'cost',
    groupTotalsFormatter: (totals) => {
      const sum = totals.sum?.['cost'];
      return sum == null ? '' : `Total: ${sum.toFixed(2)}`;
    },
  },
];
```

The formatter signature is `(totals, columnDef, grid) => string`. Each aggregator stores its result on the totals object under its type and field, so `totals.sum['cost']`, `totals.avg['cost']`, and so on. A column with no `groupTotalsFormatter` shows an empty totals cell.

A totals row appears only when the grouping level has at least one aggregator and its `displayTotalsRow` flag is `true` (the default).

### 4. Group by more than one level

Pass an array. Level 0 is the outermost group; each further entry nests inside the one before it. Every level has its own getter, aggregators, formatter and flags:

```ts
dataView.setGrouping([
  {
    getter: 'category',
    aggregators: [new Aggregators.Sum('cost')],
  },
  {
    getter: 'inStock',
    formatter: (g) => (g.value ? 'In stock' : 'Out of stock'),
    aggregators: [new Aggregators.Count('id')],
  },
]);
```

### 5. Collapse and expand groups

The DataView exposes toggle methods you can call from your own UI:

```ts
dataView.collapseAllGroups();   // every level
dataView.collapseAllGroups(0);  // only level 0
dataView.expandAllGroups();

dataView.collapseGroup('Books'); // one group by its value / key
dataView.expandGroup('Books');
```

For a nested group, pass the path of values from the outer level inward. For example, `dataView.collapseGroup('Books', 'In stock')` collapses the "In stock" subgroup inside the "Books" group. You may also pass a single `groupingKey` string taken from a `SlickGroup`.

The DataView fires [`onGroupExpanded`](/reference/dataview#evt-onGroupExpanded) and [`onGroupCollapsed`](/reference/dataview#evt-onGroupCollapsed) on every toggle, each with `{ level, groupingKey }` (a `null` key means the whole level):

```ts
dataView.onGroupCollapsed.subscribe((_e, args) => {
  console.log('collapsed level', args.level, args.groupingKey);
});
```

To remove grouping and return to a flat list, call `setGrouping` with an empty array:

```ts
dataView.setGrouping([]);
```

## Built-in aggregators

Import the `Aggregators` object and construct each aggregator with the field it works on. The same aggregators are also exported as classes (`SumAggregator`, `AvgAggregator`, `MinAggregator`, `MaxAggregator`, `CountAggregator`).

| Aggregator | Construct | Result on the totals object |
| ---------- | --------- | --------------------------- |
| Sum | `new Aggregators.Sum(field)` | `totals.sum[field]` |
| Avg | `new Aggregators.Avg(field)` | `totals.avg[field]` |
| Min | `new Aggregators.Min(field)` | `totals.min[field]` |
| Max | `new Aggregators.Max(field)` | `totals.max[field]` |
| Count | `new Aggregators.Count(field)` | `totals.count[field]` (the group's row count) |

`Sum`, `Avg`, `Min` and `Max` skip values that are `null`, an empty string, or not a number. `Count` always returns the number of rows in the group.

To compute a total the built-ins do not cover, write your own. An aggregator implements the [`Aggregator`](/reference/dataview) interface: a `field`, a `type`, an `init()` that resets its state, an `accumulate(item)` called once per row, and a `storeResult(totals)` that writes the final value onto the totals object.

## Grouping options reference

Every field of the `Grouping` object, with its default:

| Field | Default | Purpose |
| ----- | ------- | ------- |
| `getter` | — | Field name or function that returns the group value. |
| `formatter` | show raw value | Builds the group header title. |
| `comparer` | ascending by value | Orders the groups at this level. |
| `aggregators` | `[]` | Aggregators that build the totals. |
| `collapsed` | `false` | Start every group at this level collapsed. |
| `displayTotalsRow` | `true` | Render a totals row under each group. |
| `lazyTotalsCalculation` | `false` | Compute a group's totals only when its totals row is first rendered. |
| `aggregateCollapsed` | `false` | Keep computing and showing totals for collapsed groups. |
| `aggregateEmpty` | `false` | Add a totals row even for groups with no rows. |
| `aggregateChildGroups` | `false` | Include child-group rows in a parent level's aggregation. |
| `predefinedValues` | `[]` | Force these group values to exist even when no row matches. |

## The draggable-grouping plugin

Everything above groups data through the API. A separate plugin, `SlickDraggableGrouping`, lets the user group interactively by dragging column headers into a drop zone. In v6 it uses native drag-and-drop and needs no third-party drag library. It sits on top of the same DataView grouping described here. This chapter does not cover its setup; see [Plugins reference](/reference/plugins) and the [Plugins](/in-depth/plugins) chapter.

## Common pitfalls

- **Register the provider on the grid.** If you set it on the DataView but skip `grid.registerPlugin(...)`, headers render but the toggle does nothing and no error appears.
- **Use one provider instance for both sides.** Create it yourself and pass it to the DataView option and to `registerPlugin`. Do not rely on the instance `setGrouping` auto-creates; you cannot get it back to register it.
- **A totals cell needs a column `groupTotalsFormatter`.** Aggregators only compute numbers. A column without a formatter shows a blank totals cell, even when the total exists.
- **Aggregators need numeric values.** `Sum`, `Avg`, `Min` and `Max` ignore null, empty and non-numeric values, so a text field aggregates to nothing. Use `Count` to count rows.
- **Do not refresh after `setGrouping`.** It refreshes itself. An extra `refresh` only does redundant work.
- **The comparer orders groups, not rows.** Items keep the DataView's current sort order inside each group. Sort the items with [`sort`](/reference/dataview#m-sort) as normal; the grouping comparer only decides the order of the group headers.

## See also

- [DataView](/in-depth/dataview) — items vs rows, wiring, sorting and filtering.
- [DataView — API reference](/reference/dataview) — [`setGrouping`](/reference/dataview#m-setGrouping), [`getGrouping`](/reference/dataview#m-getGrouping), [`getGroups`](/reference/dataview#m-getGroups), [`collapseGroup`](/reference/dataview#m-collapseGroup), [`expandGroup`](/reference/dataview#m-expandGroup), [`collapseAllGroups`](/reference/dataview#m-collapseAllGroups), [`expandAllGroups`](/reference/dataview#m-expandAllGroups), and the group events.
- [Column — API reference](/reference/column#col-groupTotalsFormatter) — the `groupTotalsFormatter` property.
- [Grid — API reference](/reference/grid#m-registerPlugin) — `registerPlugin` and [`dataItemColumnValueExtractor`](/reference/grid#opt-dataItemColumnValueExtractor).
- [Plugins reference](/reference/plugins) and [Plugins](/in-depth/plugins) — the draggable-grouping plugin.
