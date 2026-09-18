# Pinning and sticky docking

SlickGrid uses one nested `pinning` option for permanent docking:

```ts
pinning: {
  columns: { left: 2, right: 1 },
  rows: { top: [0], bottom: ['summary'] },
}
```

Column boundary numbers are zero-based and inclusive on the left; the right number is a count
from the trailing edge. Arrays may contain explicit column indexes or IDs. Row references are
indexes first, then data-view IDs, and may be non-contiguous.

Scroll-activated docking is configured separately with `Column.sticky` and `stickyRows`:

```ts
stickyRows: {
  top: ['subtotal'],
  bottom: ['total'],
}
```

The legacy column/row pinning and pane-validation options were removed in this major version.
Migrate them to `pinning.columns` and `pinning.rows`.

The current implementation uses one live viewport and one horizontal proxy scrollbar only when
docking is configured. Cross-band colspans render one content host with visual continuation
fragments, while the fragments remain hidden from the accessibility tree.
