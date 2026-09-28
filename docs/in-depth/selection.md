---
title: Selection models
---
# Selection models

A *selection model* controls what the user can select in a grid and how. It listens to grid interactions (clicks, keyboard, drag), tracks the current selection, and tells the grid what to highlight. SlickGrid ships three built-in models — row, cell, and hybrid — and you can write your own. You need this chapter when you want selectable rows, spreadsheet-style cell ranges, or a mix of both.

## Concepts

The grid does not select anything on its own. A selection model does the work. The grid holds at most one model at a time, and by default it holds none.

Selection is expressed as **ranges**, not as a list of rows. A range is a `SlickRange` — a rectangle of cells defined by `fromRow`, `fromCell`, `toRow`, and `toCell`. A single cell is a 1×1 range. A whole row is a range that spans every column of that row.

The flow is one-directional:

1. The user clicks, drags, or presses a key.
2. The model works out the new set of ranges.
3. The model fires `onSelectedRangesChanged` with the ranges.
4. The grid receives the event, stores the ranges, and adds the `selectedCellCssClass` (default `'selected'`) to each selected cell.
5. If the set of selected *rows* changed, the grid then fires its own `onSelectedRowsChanged`.

So the model reports **ranges**; the grid re-broadcasts the row-level change. You attach a model with `setSelectionModel`, read ranges from the model, and read rows from the grid.

Two grid options shape selection behaviour:

- [`enableCellNavigation`](/reference/grid#opt-enableCellNavigation) — must be on for an active cell to exist. All built-in models react to the active cell and to the keyboard, so leave this on (it is on by default). Turning it off disables keyboard selection.
- [`multiSelect`](/reference/grid#opt-multiSelect) — allows more than one row or range at a time. On by default. Set it to `false` for single selection.

## The selection-model contract

A selection model is a plugin that implements the `SelectionModel` type. It must expose:

| Member | Purpose |
| --- | --- |
| `pluginName` | A short name for the plugin registry. |
| `init(grid)` | Called by `setSelectionModel`. Subscribe to grid events and set up state here. |
| `destroy()` | Called when the model is replaced or the grid is destroyed. Unsubscribe and release everything here. |
| `onSelectedRangesChanged` | A `SlickEvent<SlickRange[]>`. Fire it whenever the selection changes. The grid subscribes to it. |
| `getSelectedRanges()` | Return the current ranges. |
| `setSelectedRanges(ranges, caller?, selectionMode?)` | Set the ranges and fire `onSelectedRangesChanged`. |
| `getOptions()` / `setOptions(options)` | Read and merge the model's own options. |
| `refreshSelections()` | Re-apply the current selection (for example after the columns change). |

Note what is **not** on the contract: `getSelectedRows`, `setSelectedRows`, and `onSelectedRowsChanged` live on the grid, not the model. They are row-oriented helpers that work with any model (see [Reading and setting selection](#reading-and-setting-selection)).

## The three built-in models

### Row selection

`SlickRowSelectionModel` selects whole rows. Click a row to select it. With `multiSelect` on, `Ctrl`/`Cmd`-click toggles individual rows and `Shift`-click extends a range. `Shift`+`ArrowUp`/`ArrowDown` grows or shrinks the selection from the keyboard.

Use it for record pickers: master/detail views, bulk actions, a checkbox column, or anything where the unit of selection is the row.

Options ([`RowSelectionModelOption`](/reference/plugins)):

- `selectActiveRow` (default `true`) — select a row automatically when it becomes the active row.
- `dragToSelect` (default `false`) — let the user rubber-band rows with the mouse.
- `autoScrollWhenDrag` (default `true`) — scroll the viewport while drag-selecting.
- `cellRangeSelector` — supply your own range selector instead of the default.

### Cell selection

`SlickCellSelectionModel` selects one or more cell ranges, like a spreadsheet. The active cell is selected automatically. Drag to select a rectangle. From the keyboard, `Shift`+arrows/`Home`/`End`/`PageUp`/`PageDown` extend the range, and `Ctrl`+`A` selects the whole grid.

Use it when the user works with cells and rectangles rather than records — for example, copy and paste of a cell block.

Options ([`CellSelectionModelOption`](/reference/plugins)):

- `selectActiveCell` (default `true`) — select the active cell as it moves.
- `cellRangeSelector` — supply your own range selector.

### Hybrid selection

`SlickHybridSelectionModel` behaves as cell selection most of the time, but switches to row selection on specific columns. This suits a grid that is mainly cell-based but has a checkbox or row-move column that should select the entire row.

The `selectionType` option chooses the behaviour:

- `'mixed'` (default) — cell selection, except on the columns you nominate.
- `'cell'` — always cell selection.
- `'row'` — always row selection.

You nominate row-selecting columns with `rowSelectColumnIds` (an array of column ids), or with a `rowSelectOverride` function for custom logic. By default the row-move handler column also selects the row (`handleRowMoveManagerColumn`). Other options include `selectActiveCell`, `selectActiveRow`, `enableMultiSelection` (allow `Ctrl`/`Cmd` to add or toggle several ranges), `dragToSelect`, `autoScrollWhenDrag`, and `showDragHandle` (`true`, `false`, or `'hover'`). See [`HybridSelectionModelOption`](/reference/plugins).

### Which to use

| You want to select… | Use |
| --- | --- |
| Whole records (rows) | `SlickRowSelectionModel` |
| Cells and rectangles | `SlickCellSelectionModel` |
| Cells, but rows on a checkbox / row-move column | `SlickHybridSelectionModel` |

## Attaching a model

By default the grid has no selection model, so nothing is selectable. Attach one with [`setSelectionModel`](/reference/grid#m-setSelectionModel):

```ts
import { SlickGrid, SlickRowSelectionModel } from 'slickgrid';

const grid = new SlickGrid<MyRow>('#myGrid', data, columns, {
  enableCellNavigation: true, // required for the active cell (on by default)
  multiSelect: true,          // allow more than one row (on by default)
});

grid.setSelectionModel(new SlickRowSelectionModel({ selectActiveRow: true }));
```

`setSelectionModel` calls the model's `init(grid)` for you. Passing a new model destroys the previous one first, so you never have two active at once. Read the current model back with [`getSelectionModel`](/reference/grid#m-getSelectionModel).

The row and hybrid models use the drag interaction internally. With the ESM package (`import … from 'slickgrid'`) it is bundled automatically. With the IIFE/global build, load `slick.interactions.js` first, or `init` throws `Slick.Draggable is undefined`.

## Reading and setting selection

Work at whichever level fits — rows or ranges.

**Rows (grid-level helpers).** These work with any model and translate between rows and full-width ranges for you:

```ts
// read
const rows: number[] = grid.getSelectedRows();

// write
grid.setSelectedRows([0, 2, 5]);

// react to changes
grid.onSelectedRowsChanged.subscribe((_e, args) => {
  console.log('now selected:', args.rows);
  console.log('added:', args.changedSelectedRows);
  console.log('removed:', args.changedUnselectedRows);
});
```

- [`getSelectedRows`](/reference/grid#m-getSelectedRows) throws if no selection model is set.
- [`setSelectedRows`](/reference/grid#m-setSelectedRows) is ignored while a cell editor is open (the editor lock is active).
- [`onSelectedRowsChanged`](/reference/grid#evt-onSelectedRowsChanged) reports `rows`, `previousSelectedRows`, `changedSelectedRows`, `changedUnselectedRows`, and `caller`.

Row helpers are most meaningful with the row or hybrid model. With the cell model, prefer ranges.

**Ranges (model-level).** Reach the model through the grid, and build ranges with `SlickRange`:

```ts
import { SlickRange } from 'slickgrid';

const model = grid.getSelectionModel();

// read
const ranges = model.getSelectedRanges();

// write: select cell (0,0) and the block from (2,1) to (4,3)
model.setSelectedRanges([
  new SlickRange(0, 0),
  new SlickRange(2, 1, 4, 3),
]);

// react to changes
model.onSelectedRangesChanged.subscribe((_e, ranges) => {
  console.log('range count:', ranges.length);
});
```

`SlickRange` normalises its corners, so `from` is always the top-left and `to` the bottom-right. Helpers include `isSingleCell()`, `isSingleRow()`, and `contains(row, cell)`. A whole-row range is `new SlickRange(row, 0, row, grid.getColumns().length - 1)`.

## Writing a custom model

Implement the contract and fire `onSelectedRangesChanged`. The grid does the rest — it stores the ranges and applies the CSS class. The model below reacts only to clicks and selects one cell at a time.

```ts
import { SlickEvent, SlickRange } from 'slickgrid';
import type { SelectionModel, SlickGrid } from 'slickgrid';

export class SingleCellSelectionModel implements SelectionModel {
  pluginName = 'SingleCellSelectionModel' as const;
  onSelectedRangesChanged = new SlickEvent<SlickRange[]>('onSelectedRangesChanged');

  protected _grid!: SlickGrid;
  protected _ranges: SlickRange[] = [];
  protected _options: any;

  init(grid: SlickGrid) {
    this._grid = grid;
    grid.onClick.subscribe(this.handleClick);
  }

  destroy() {
    this._grid.onClick.unsubscribe(this.handleClick);
  }

  getOptions() { return this._options; }
  setOptions(options: any) { this._options = options; }
  getSelectedRanges() { return this._ranges; }
  refreshSelections() { this.setSelectedRanges(this._ranges); }

  setSelectedRanges(ranges: SlickRange[]) {
    this._ranges = ranges;
    this.onSelectedRangesChanged.notify(this._ranges);
  }

  protected handleClick = (e: MouseEvent) => {
    const cell = this._grid.getCellFromEvent(e);
    if (!cell || !this._grid.canCellBeSelected(cell.row, cell.cell)) {
      return;
    }
    this.setSelectedRanges([new SlickRange(cell.row, cell.cell)]);
  };
}
```

Attach it the same way as a built-in model:

```ts
grid.setSelectionModel(new SingleCellSelectionModel());
```

## Notes and pitfalls

- **No model, no selection.** The grid starts with no selection model. `getSelectedRows` throws until you attach one.
- **`enableCellNavigation` gates the keyboard.** The active cell and all keyboard selection depend on it. It is on by default; do not turn it off if you want selection.
- **Single vs multiple.** Set [`multiSelect: false`](/reference/grid#opt-multiSelect) to limit the grid to one row or one range.
- **Editing blocks writes.** `setSelectedRows` does nothing while a cell editor is open. Commit or cancel the edit first. See [Cell editors](/in-depth/custom-editors).
- **Styling.** Selected cells get the class from [`selectedCellCssClass`](/reference/grid#opt-selectedCellCssClass) (default `'selected'`). Style `.slick-cell.selected` in your theme to change the look. See [Theming & styling](/in-depth/theming).
- **Clean up in `destroy`.** Unsubscribe from every grid event you subscribed to in `init`, or listeners leak when the model is replaced.

## See also

- [Grid reference: `setSelectionModel`](/reference/grid#m-setSelectionModel) · [`getSelectionModel`](/reference/grid#m-getSelectionModel)
- [Grid reference: `getSelectedRows`](/reference/grid#m-getSelectedRows) · [`setSelectedRows`](/reference/grid#m-setSelectedRows) · [`onSelectedRowsChanged`](/reference/grid#evt-onSelectedRowsChanged)
- [Grid options: `multiSelect`](/reference/grid#opt-multiSelect) · [`enableCellNavigation`](/reference/grid#opt-enableCellNavigation) · [`selectedCellCssClass`](/reference/grid#opt-selectedCellCssClass)
- [Plugins reference](/reference/plugins) — the built-in selection models and their options
- [Core reference: `SlickRange`](/reference/core)
- [Plugins](/in-depth/plugins) · [Theming & styling](/in-depth/theming)
