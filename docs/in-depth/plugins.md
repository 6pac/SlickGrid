---
title: Plugins
---
# Plugins

A *plugin* is an optional add-on that gives the grid a feature the core does not ship on by default: tooltips, context menus, a row-detail panel, drag-to-move rows, auto-resize, and more. You attach a plugin to a grid, it wires itself to the grid's events, and it cleans itself up when you remove it. This chapter explains what a plugin is, how the lifecycle works, the ways to attach one, and it maps the 20 built-in plugins so you can find the right one. It is a practical map, not a full API — each plugin links to its [Plugins reference](/reference/plugins).

## Concepts

### What a plugin is

Every plugin follows the same small contract, the `SlickPlugin` interface:

```ts
interface SlickPlugin {
  pluginName: string;              // a short name for the plugin registry
  init: (grid: SlickGridModel) => void; // set the plugin up (SlickGrid implements SlickGridModel)
  destroy: () => void;             // tear the plugin down
}
```

- `pluginName` is a unique label. The grid uses it to look a plugin up by name.
- `init(grid)` receives the grid. The plugin subscribes to grid events, builds any DOM it needs, and stores the grid reference here.
- `destroy()` reverses `init`. The plugin unsubscribes from every event and removes any DOM it added.

A plugin is a plain class. You create it with `new`, usually passing an options object. It does nothing until it is attached to a grid and its `init` runs.

### The lifecycle

The grid keeps a list of registered plugins. The lifecycle has three stages:

1. **Attach.** You hand the plugin to the grid. The grid stores it and calls `init(grid)` at once. The plugin starts working.
2. **Run.** The plugin reacts to grid events (clicks, scroll, key presses) for as long as it is attached.
3. **Detach.** You remove the plugin, or you destroy the grid. The grid calls the plugin's `destroy()`. The plugin stops working and releases its listeners.

Because `init` runs the moment you attach a plugin, **create the grid first, then attach plugins.**

## Walkthrough

### 1. Attach a plugin with `registerPlugin`

This is the usual way. Build the grid, then register each plugin. [`registerPlugin`](/reference/grid#m-registerPlugin) stores the plugin and calls its `init(grid)` for you.

```ts
import { SlickGrid, SlickAutoTooltips, SlickResizer } from 'slickgrid';

const grid = new SlickGrid<MyRow>('#myGrid', data, columns, options);

grid.registerPlugin(new SlickAutoTooltips({ enableForHeaderCells: true }));
grid.registerPlugin(new SlickResizer({ container: '#page' }));
```

Most plugins take an options object in the constructor and take the grid later, through `init`.

### 2. Or construct the plugin with the grid

Some low-level plugins take the grid directly in their constructor. They hold the reference from the start, so their `init()` does no extra work. [`SlickCellRangeDecorator`](/reference/plugins) is one:

```ts
import { SlickCellRangeDecorator } from 'slickgrid';

const decorator = new SlickCellRangeDecorator(grid, { selectionCssClass: 'my-range' });
```

You can also drive a plugin's lifecycle yourself. Call `plugin.init(grid)` to start it and `plugin.destroy()` to stop it, without adding it to the grid's registry. Use this only when you manage the plugin's life by hand.

### 3. Attach a selection model with `setSelectionModel`

Selection models are plugins too, but they attach through a different method. Use [`setSelectionModel`](/reference/grid#m-setSelectionModel), not `registerPlugin`. It calls `init(grid)` **and** connects the model's selection event to the grid.

```ts
import { SlickRowSelectionModel } from 'slickgrid';

grid.setSelectionModel(new SlickRowSelectionModel({ selectActiveRow: true }));
```

`registerPlugin` would run a selection model's `init`, but it would not connect the selection event, so the grid would not react. See [Selection models](/in-depth/selection) for the full story.

### 4. Find a plugin with `getPluginByName`

[`getPluginByName`](/reference/grid#m-getPluginByName) returns a registered plugin by its `pluginName`, or `undefined` if none matches. Pass the type argument so the result is typed.

```ts
import type { SlickResizer } from 'slickgrid';

const resizer = grid.getPluginByName<SlickResizer>('Resizer');
resizer?.resizeGrid();
```

The `pluginName` is a short label, not the class name — `'Resizer'`, `'AutoTooltips'`, `'RowDetailView'`. Each plugin's name is listed in the tour below.

### 5. Remove a plugin with `unregisterPlugin`

[`unregisterPlugin`](/reference/grid#m-unregisterPlugin) removes one plugin and calls its `destroy()`.

```ts
grid.unregisterPlugin(resizer);
```

You rarely need this. When you call [`grid.destroy()`](/reference/grid#m-destroy), the grid unregisters every plugin for you and calls each `destroy()`. So a plugin cleans up with the grid without extra code. Unregister a plugin by hand only when you want to remove a feature while the grid keeps running.

### 6. Plugins that add a column

Several plugins need a column of their own — a checkbox column, a drag handle, an expand toggle. These plugins expose `getColumnDefinition()`. Add its result to your columns **and** register the plugin.

```ts
import { SlickRowMoveManager } from 'slickgrid';

const rowMove = new SlickRowMoveManager({ cancelEditOnDrag: true });

// add the plugin's column to your column list
const columns = [rowMove.getColumnDefinition(), ...myColumns];

const grid = new SlickGrid<MyRow>('#myGrid', data, columns, options);
grid.registerPlugin(rowMove);
```

If you register the plugin but forget its column (or the reverse), the feature does not appear.

## A tour of the built-in plugins

SlickGrid ships 20 plugins. They are grouped below by purpose. Every name links to the [Plugins reference](/reference/plugins) for its options, methods, and events.

### Selection

Selection models decide what the user can select and how. Attach them with [`setSelectionModel`](/reference/grid#m-setSelectionModel). The [Selection models](/in-depth/selection) chapter covers them in full.

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickRowSelectionModel`](/reference/plugins) | `RowSelectionModel` | Select whole rows. |
| [`SlickCellSelectionModel`](/reference/plugins) | `CellSelectionModel` | Select cell ranges, like a spreadsheet. |
| [`SlickHybridSelectionModel`](/reference/plugins) | `HybridSelectionModel` | Cell selection, but row selection on the columns you nominate. |

Three more plugins support selection. Register these with `registerPlugin`:

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickCheckboxSelectColumn`](/reference/plugins) | `CheckboxSelectColumn` | Add a checkbox column with a select-all header. Pair it with a selection model and add its `getColumnDefinition()` to your columns. |
| [`SlickCellRangeSelector`](/reference/plugins) | `CellRangeSelector` | Drag a rubber-band rectangle to select a range. The cell and row models use it internally. |
| [`SlickCellRangeDecorator`](/reference/plugins) | `CellRangeDecorator` | Draw the border overlay around a selected range. A helper used by the selectors. |

### Menus and header UI

These plugins add menus and clickable controls. See [Menus](/in-depth/menus) for how to build items, commands, and submenus.

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickHeaderButtons`](/reference/plugins) | `HeaderButtons` | Show one or more clickable buttons inside a column header. |
| [`SlickHeaderMenu`](/reference/plugins) | `HeaderMenu` | Show a drop-down menu on a column header (sort, hide, filter actions). |
| [`SlickCellMenu`](/reference/plugins) | `CellMenu` | Show an action menu anchored to a cell. |
| [`SlickContextMenu`](/reference/plugins) | `ContextMenu` | Show a menu on right-click over the grid body. |

> Column pickers, the grid menu, and the pager are **controls**, not plugins. They are constructed differently — see the [Controls reference](/reference/controls).

### Tooltips

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickAutoTooltips`](/reference/plugins) | `AutoTooltips` | Add a native `title` tooltip to a cell (or header) when its text is too wide to fit. |
| [`SlickCustomTooltip`](/reference/plugins) | `CustomTooltip` | Show a rich tooltip on hover, built from a formatter set in the column or grid `customTooltip` option. Supports async content. |

### Copy and paste

Register these with `registerPlugin`. They are documented briefly here; the [Plugins reference](/reference/plugins) has the options and events.

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickCellCopyManager`](/reference/plugins) | `CellCopyManager` | Copy and paste a cell or range within the same grid, using an internal buffer. |
| [`SlickCellExternalCopyManager`](/reference/plugins) | `CellExternalCopyManager` | Excel-style copy and paste of a cell block to and from the system clipboard, as tab-separated values. |

### Row detail

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickRowDetailView`](/reference/plugins) | `RowDetailView` | Expand a row to show a detail panel below it. Register the plugin and add its `getColumnDefinition()` (the expand/collapse toggle) to your columns. |

### Row move

Both add a drag-handle column. Add each plugin's `getColumnDefinition()` to your columns and register the plugin.

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickRowMoveManager`](/reference/plugins) | `RowMoveManager` | Drag a handle to reorder rows within one grid. |
| [`SlickCrossGridRowMoveManager`](/reference/plugins) | `CrossGridRowMoveManager` | Drag rows from one grid to another. Its `onBeforeMoveRows` event reports the source and target grids. |

### Layout and grouping

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickResizer`](/reference/plugins) | `Resizer` | Auto-resize the grid to fit the window or a container, and re-size on window `resize`. |
| [`SlickDraggableGrouping`](/reference/plugins) | `DraggableGrouping` | Let the user drag column headers into a drop zone to group rows by those columns. |

### State

| Plugin | `pluginName` | What it does |
| --- | --- | --- |
| [`SlickState`](/reference/plugins) | `State` | Save column widths and order, sort columns, and the viewport to `localStorage`, and restore them next time. Fires `onStateChanged`. |

## Notes and pitfalls

- **Create the grid first.** `registerPlugin` and `setSelectionModel` run `init` at once, so the grid must already exist.
- **Selection models use `setSelectionModel`.** Do not attach them with `registerPlugin` — the selection event would not reach the grid. See [Selection models](/in-depth/selection).
- **Column plugins need their column.** For `SlickCheckboxSelectColumn`, `SlickRowDetailView`, `SlickRowMoveManager`, and `SlickCrossGridRowMoveManager`, add `getColumnDefinition()` to your columns **and** register the plugin.
- **`pluginName` is not the class name.** Look a plugin up with its short name — `grid.getPluginByName('Resizer')`, not `'SlickResizer'`.
- **Cleanup is automatic.** `grid.destroy()` unregisters every plugin and calls each `destroy()`. Only call `unregisterPlugin` to remove a feature while the grid keeps running.
- **Drag-based plugins need the interactions module.** The row/hybrid selection and row-move plugins use the drag interaction. The ESM package (`import … from 'slickgrid'`) bundles it. With the IIFE/global build, load `slick.interactions.js` first, or `init` throws `Slick.Draggable is undefined`.
- **Write your own.** Any class with `pluginName`, `init(grid)`, and `destroy()` is a valid plugin. Register it like a built-in one. See the custom-model example in [Selection models](/in-depth/selection#writing-a-custom-model).

## See also

- [Grid reference: `registerPlugin`](/reference/grid#m-registerPlugin) · [`unregisterPlugin`](/reference/grid#m-unregisterPlugin) · [`getPluginByName`](/reference/grid#m-getPluginByName)
- [Grid reference: `setSelectionModel`](/reference/grid#m-setSelectionModel) · [`getSelectionModel`](/reference/grid#m-getSelectionModel) · [`destroy`](/reference/grid#m-destroy)
- [Plugins reference](/reference/plugins) — every built-in plugin, with options and events
- [Controls reference](/reference/controls) — column picker, grid menu, pager
- [Selection models](/in-depth/selection) · [Menus](/in-depth/menus)
