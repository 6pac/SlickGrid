---
title: Reacting to the grid
---

# Reacting to the grid

SlickGrid tells you what the user does through events. You subscribe a handler to each event.

## Subscribe to an event

```ts
grid.onClick.subscribe((e, args) => {
  console.log('clicked row', args.row, 'cell', args.cell);
});
```

The handler gets two arguments: the event data object, and an `args` object with details for that event.

## Events you use early

- `onClick` — a cell was clicked.
- `onSort` — the user clicked a sortable header. You sort your data here.
- `onCellChange` — a cell value was edited.
- `onSelectedRowsChanged` — the selection changed.

```ts
grid.onSort.subscribe((e, args) => {
  // args.sortCol / args.sortCols tell you how to sort
});
```

## Stop listening

Keep the handler and pass it to `unsubscribe` when you no longer need it.

```ts
const handler = (e, args) => { /* ... */ };
grid.onClick.subscribe(handler);
grid.onClick.unsubscribe(handler);
```

## Where to find the rest

The grid has 57 events. The [Reference](/reference/grid) lists every event and the shape of its `args`.
