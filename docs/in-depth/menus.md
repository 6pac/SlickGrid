---
title: Menus & header UI
---
# Menus & header UI

SlickGrid ships a family of menus and header widgets. They let the user pick columns, run commands, and act on a cell or row. This chapter explains what each one does, when to reach for it, how to construct and register it, and the shape of the items you put in it. All of them are plain DOM and event-driven. None use jQuery.

## Concepts

Two things decide how you wire up a menu: which **family** it belongs to, and where its **items** live.

### Two families: controls and plugins

The menu family splits into *controls* and *plugins*. They are attached in different ways.

- **Controls** live in `src/controls`. You attach one by constructing it with `(columns, grid, gridOptions)`. The constructor registers itself with the grid, so there is no extra call. Their settings come from the grid options object (for example `gridOptions.gridMenu`). Column Picker and Grid Menu are controls.
- **Plugins** live in `src/plugins`. You construct one with an options object, then pass it to [`grid.registerPlugin(...)`](/reference/grid#m-registerPlugin), which calls the plugin's `init(grid)`. Header Menu, Header Buttons, Context Menu, and Cell Menu are plugins. Remove one with [`grid.unregisterPlugin(...)`](/reference/grid#m-unregisterPlugin).

### Where items are defined

Some menus are grid-wide; you define their items once in the options. Others are per-column; you define their items on the [column definition](/reference/column).

| Menu | Trigger | Scope | Items defined in | Family |
| --- | --- | --- | --- | --- |
| Column Picker | right-click a header | show/hide columns | `gridOptions.columnPicker` | control |
| Grid Menu | hamburger button (top-right) | grid-wide commands + column list | `gridOptions.gridMenu` | control |
| Header Menu | caret drop-down on a column | one column | `column.header.menu` | plugin |
| Header Buttons | icon(s) inside a header | one column | `column.header.buttons` | plugin |
| Context Menu | right-click any cell | grid-wide (optionally per column) | plugin options | plugin |
| Cell Menu | click a cell | per column | `column.cellMenu` | plugin |

Rule of thumb: pick columns with the **Column Picker** or the column list in the **Grid Menu**; run a global action from the **Grid Menu** or **Context Menu**; act on one column from the **Header Menu** or **Header Buttons**; act on one row/cell from the **Cell Menu**.

### The shape of a menu item

Command menus share one item shape (`MenuCommandItem`, which extends `MenuItem`). The common fields are:

```ts
{
  command: 'export-csv',      // identifier passed to the onCommand event
  title: 'Export to CSV',     // the visible label
  tooltip: 'Save as CSV',     // hover text
  iconCssClass: 'mdi mdi-download',
  cssClass: 'bold',           // class on the item row
  textCssClass: 'red',        // class on the label text
  disabled: false,            // greyed out, not clickable
  hidden: false,              // not rendered
  action: (e, args) => { /* per-item callback */ },
}
```

Three details apply to every menu:

- **Dividers.** Add a separator with `{ divider: true }` or the string `'divider'`. Both work.
- **Two ways to handle a click.** Give the item an `action(e, args)` callback, or subscribe to the menu's `onCommand` event, or both. `action` runs per item; `onCommand` runs for every command in that menu.
- **Dynamic items.** `itemVisibilityOverride(args)` and `itemUsabilityOverride(args)` return a boolean to show/hide or enable/disable an item at open time. The menu re-reads them every time it opens.

Context Menu and Cell Menu add a second kind of item, the *option* item (`MenuOptionItem`). It uses `option` instead of `command` and fires `onOptionSelected` instead of `onCommand`. Options change one data value; commands run an action. See [Context Menu](#context-menu) below.

## Column Picker

The Column Picker shows a checkbox list of columns. The user right-clicks any header to open it, then toggles columns on and off. Use it when the only job is showing and hiding columns.

There are two classes. `SlickColumnMenu` is the modern, simpler version; it uses the column's [`hidden`](/reference/column#col-hidden) property. `SlickColumnPicker` is the older version that removes and re-inserts columns. Prefer `SlickColumnMenu` for new code.

Set options under `gridOptions.columnPicker`, then construct the control:

```ts
import { SlickGrid, SlickColumnMenu } from 'slickgrid';

const grid = new SlickGrid('#grid', data, columns, {
  columnPicker: {
    columnTitle: 'Columns',
    hideForceFitButton: true,
    hideSyncResizeButton: true,
  },
});

// constructing it attaches it — no registerPlugin call
const columnPicker = new SlickColumnMenu(columns, grid, grid.getOptions());
columnPicker.onColumnsChanged.subscribe((_e, args) => {
  console.log('visible columns:', args.visibleColumns);
});
```

Notes:

- Exclude a column from the list with [`column.excludeFromColumnPicker: true`](/reference/column#col-excludeFromColumnPicker).
- `onColumnsChanged` reports `columnId`, `showing`, `allColumns`, and `visibleColumns`.
- The last two checkboxes ("Force fit columns", "Synchronous resize") are optional. Hide them with `hideForceFitButton` and `hideSyncResizeButton`.
- Column show/hide itself is covered with the [`hidden`](/reference/column#col-hidden) column property; this control is just one way to drive it.

## Grid Menu

The Grid Menu is the hamburger button at the top-right of the grid. It combines two sections: a list of **commands** you define, and the same show/hide **column list** as the Column Picker. Use it as the grid's main action menu.

Set options under `gridOptions.gridMenu`, then construct the control:

```ts
import { SlickGrid, SlickGridMenu } from 'slickgrid';

const grid = new SlickGrid('#grid', data, columns, {
  gridMenu: {
    iconCssClass: 'sgi sgi-menu',
    commandTitle: 'Commands',
    columnTitle: 'Columns',
    commandItems: [
      { command: 'clear-filters', title: 'Clear filters', iconCssClass: 'mdi mdi-filter-remove' },
      { divider: true },
      { command: 'toggle-panel', title: 'Toggle header row', disabled: false },
    ],
  },
});

const gridMenu = new SlickGridMenu(columns, grid, grid.getOptions());
gridMenu.onCommand.subscribe((_e, args) => {
  if (args.command === 'clear-filters') { /* ... */ }
});
```

Notes:

- Command items use the shared shape above. Put them in `commandItems`. (`customItems` and `customTitle` are the deprecated names for `commandItems` and `commandTitle`.)
- `onCommand` args include `command`, `item`, `grid`, `allColumns`, and `visibleColumns`.
- The button icon is `iconCssClass` (a CSS class) or `iconImage` (an image URL). Hide the built-in button with `showButton: false` and open the menu from your own element.
- Other events: `onBeforeMenuShow`, `onAfterMenuShow`, `onMenuClose`, and `onColumnsChanged`. Returning `false` from a "before" handler cancels the open.
- Exclude a column from the column list with [`column.excludeFromGridMenu: true`](/reference/column#col-excludeFromGridMenu).
- Nest `commandItems` inside a command to make a sub-menu.

## Header Menu

The Header Menu adds a small caret drop-down to a column header. It is per-column, so each column can offer different commands (sort, hide, pin, and so on). Use it for actions that target one column.

Register the plugin once, then define items on each column under `header.menu.commandItems`:

```ts
import { SlickGrid, SlickHeaderMenu } from 'slickgrid';

const columns = [
  {
    id: 'name', name: 'Name', field: 'name',
    header: {
      menu: {
        commandItems: [
          { command: 'sort-asc', title: 'Sort ascending', iconCssClass: 'mdi mdi-sort-ascending' },
          { command: 'sort-desc', title: 'Sort descending', iconCssClass: 'mdi mdi-sort-descending' },
          { divider: true },
          { command: 'hide', title: 'Hide column', iconCssClass: 'mdi mdi-eye-off' },
        ],
      },
    },
  },
];

const grid = new SlickGrid('#grid', data, columns, {});
const headerMenu = new SlickHeaderMenu({}); // HeaderMenuOption
grid.registerPlugin(headerMenu);

headerMenu.onCommand.subscribe((_e, args) => {
  // args: { grid, column, command, item }
  if (args.command === 'hide') { /* ... */ }
});
```

Notes:

- Items go in `header.menu.commandItems`. (`header.menu.items` is the deprecated name.)
- `onCommand` args are `grid`, `column`, `command`, and `item`. The `column` tells you which header was used.
- Plugin options (`HeaderMenuOption`) include `buttonCssClass`, `buttonImage`, `minWidth`, `autoAlign`, `subMenuOpenByEvent`, and `menuUsabilityOverride`.
- Events: `onBeforeMenuShow`, `onAfterMenuShow`, `onCommand`.

## Header Buttons

Header Buttons put one or more clickable icons directly in a column header — no drop-down. Use them for a single, frequent action such as a filter toggle or a "pin" switch.

Register the plugin, then define buttons on each column under `header.buttons`:

```ts
import { SlickGrid, SlickHeaderButtons } from 'slickgrid';

const columns = [
  {
    id: 'name', name: 'Name', field: 'name',
    header: {
      buttons: [
        {
          command: 'toggle-pin',
          cssClass: 'mdi mdi-pin',
          tooltip: 'Pin this column',
          showOnHover: true,
        },
      ],
    },
  },
];

const grid = new SlickGrid('#grid', data, columns, {});
const headerButtons = new SlickHeaderButtons({}); // HeaderButtonOption
grid.registerPlugin(headerButtons);

headerButtons.onCommand.subscribe((_e, args) => {
  // args: { grid, column, command, button }
  if (args.command === 'toggle-pin') { /* update args.button, header re-renders */ }
});
```

Notes:

- A button is a `HeaderButtonItem`: `command`, `cssClass`, `image`, `tooltip`, `disabled`, `showOnHover`, `handler`, and `action`. Buttons are icons, so there is no `title`.
- A click can fire in three ways: the item `handler(e)`, the item `action(e, args)`, and the `onCommand` event (only when `command` is set and the button is enabled).
- After `onCommand`, the plugin calls `updateColumnHeader` for that column, so edits you make to `button` in the handler show at once — useful for a toggle button.
- `showOnHover: true` hides the icon until the pointer is over the header.

## Context Menu

The Context Menu opens on right-click over a cell. It has two sections: **commands** (run an action) and **options** (set one data value, like a priority). It is grid-wide, though you can restrict each section to specific columns. Use it for actions reachable from anywhere in the grid, or a quick value picker.

All settings are plugin options:

```ts
import { SlickGrid, SlickContextMenu } from 'slickgrid';

const grid = new SlickGrid('#grid', data, columns, {});

const contextMenu = new SlickContextMenu({
  commandTitle: 'Commands',
  commandItems: [
    { command: 'export-csv', title: 'Export to CSV', iconCssClass: 'mdi mdi-download' },
    { command: 'delete-row', title: 'Delete row', textCssClass: 'red' },
    'divider',
    { command: 'help', title: 'Help' },
  ],
  optionTitle: 'Priority',
  optionShownOverColumnIds: ['priority'], // options only over this column
  optionItems: [
    { option: 1, title: 'Low', iconCssClass: 'mdi mdi-flag' },
    { option: 2, title: 'Medium', iconCssClass: 'mdi mdi-flag' },
    { option: 3, title: 'High', iconCssClass: 'mdi mdi-flag' },
  ],
});
grid.registerPlugin(contextMenu);

contextMenu.onCommand.subscribe((_e, args) => {
  // args: { cell, row, grid, command, item, column, dataContext, value }
});
contextMenu.onOptionSelected.subscribe((_e, args) => {
  // args: { cell, row, grid, option, item, column, dataContext }
  args.dataContext.priority = args.option;
  args.grid.invalidate();
});
```

Notes:

- Command items use `command`; option items use `option`. Their callback events are `onCommand` and `onOptionSelected`.
- Restrict a section to columns with `commandShownOverColumnIds` and `optionShownOverColumnIds`. Leave them out to show over every column.
- Hide a whole section with `hideCommandSection` or `hideOptionSection`.
- The plugin subscribes to the grid's [`onContextMenu`](/reference/grid#evt-onContextMenu) event. There is one option list, so it best suits a single column; for different menus per column, use the Cell Menu.
- Other options: `hideCloseButton`, `hideMenuOnScroll`, `maxHeight`, `width`, `autoAdjustDrop`, `autoAlignSide`, `subMenuOpenByEvent`, `menuUsabilityOverride`.

## Cell Menu

The Cell Menu opens when the user clicks a cell in a column that defines one. It is per-column, so it fits an "actions" column with a button-like cell. It has the same command/option sections as the Context Menu.

Register the plugin once, then define the menu on each column under [`cellMenu`](/reference/column#col-cellMenu):

```ts
import { SlickGrid, SlickCellMenu } from 'slickgrid';

const columns = [
  {
    id: 'action', name: 'Action', field: 'action',
    formatter: () => `<button class="action-btn">Actions</button>`,
    cellMenu: {
      commandTitle: 'Commands',
      commandItems: [
        { command: 'edit', title: 'Edit', iconCssClass: 'sgi sgi-pencil-outline' },
        { command: 'delete', title: 'Delete', iconCssClass: 'sgi sgi-close', textCssClass: 'red' },
        { divider: true },
        { command: 'help', title: 'Help', disabled: true },
      ],
    },
  },
];

const grid = new SlickGrid('#grid', data, columns, {});
const cellMenu = new SlickCellMenu({}); // CellMenuOption defaults
grid.registerPlugin(cellMenu);

cellMenu.onCommand.subscribe((_e, args) => {
  // args: { cell, row, grid, command, item, column, dataContext }
  if (args.command === 'delete') { /* ... */ }
});
```

Notes:

- The plugin listens to the grid's cell click. It merges the column's `cellMenu` with its own defaults when the cell is clicked, so per-column menus just work.
- Item shapes and events match the Context Menu: `commandItems`/`onCommand` and `optionItems`/`onOptionSelected`.
- `hideMenuOnScroll` defaults to `true` for the Cell Menu, so scrolling closes it.
- Selecting an option first commits any open editor; if the commit fails, the menu does nothing.

## Sub-menus

Every command/option menu supports one or more levels of sub-menu. Nest a list on an item:

```ts
{
  command: 'export', title: 'Export',
  commandItems: [                       // makes 'Export' a sub-menu parent
    { command: 'export-csv', title: 'CSV' },
    { command: 'export-xlsx', title: 'Excel' },
  ],
  subMenuTitle: 'Export as',            // optional heading on the sub-menu
}
```

Use `optionItems` instead of `commandItems` to nest an option sub-menu. Sub-menus open on hover by default; set `subMenuOpenByEvent: 'click'` in the plugin/control options to require a click.

## Notes and pitfalls

- **Controls vs plugins.** A control (`SlickColumnMenu`, `SlickGridMenu`) attaches itself in its constructor — do not also call `registerPlugin`. A plugin (`SlickHeaderMenu`, `SlickHeaderButtons`, `SlickContextMenu`, `SlickCellMenu`) needs [`grid.registerPlugin(...)`](/reference/grid#m-registerPlugin).
- **Pass the grid options to controls.** Controls read their settings from the grid options object. Pass `grid.getOptions()` (or the same options you gave the grid) as the third constructor argument.
- **Per-column menus need both parts.** Header Menu, Header Buttons, and Cell Menu do nothing until you both register the plugin and add `header`/`cellMenu` to at least one column.
- **`command` is the identifier, `title` is the label.** `onCommand` receives `command`, not `title`. Keep commands stable; change titles freely.
- **Icons come from any CSS class.** `iconCssClass` accepts any class. SlickGrid ships a small built-in set — the `sgi-*` icons (see [Theming](/in-depth/theming)); the examples above also use `mdi-*` (Material Design Icons) for actions the built-in set does not cover, standing in for your own icon font or SVG.
- **Disabled vs hidden.** `disabled` greys the item out and blocks its click. `hidden` leaves it out of the DOM. Use the override callbacks for dynamic state.
- **Cancel an open.** Returning `false` from an `onBeforeMenuShow` handler stops the menu from opening (Grid Menu, Header Menu, Context Menu, Cell Menu).
- **Titles are inserted safely.** Most menus set an item's `title` as plain text; the Grid Menu runs its titles through the grid's HTML sanitizer. Neither lets raw markup through. See [CSP & sanitization](/in-depth/csp).
- **Clean up.** `unregisterPlugin` destroys a plugin; a control exposes `destroy()`. Both unsubscribe their events and remove their DOM.

## See also

- [Controls reference](/reference/controls) — `SlickColumnMenu`, `SlickColumnPicker`, `SlickGridMenu` and their options
- [Plugins reference](/reference/plugins) — `SlickHeaderMenu`, `SlickHeaderButtons`, `SlickContextMenu`, `SlickCellMenu` and their options
- [Grid reference: `registerPlugin`](/reference/grid#m-registerPlugin) · [`unregisterPlugin`](/reference/grid#m-unregisterPlugin)
- [Column reference: `header`](/reference/column#col-header) · [`cellMenu`](/reference/column#col-cellMenu) · [`hidden`](/reference/column#col-hidden) · [`excludeFromColumnPicker`](/reference/column#col-excludeFromColumnPicker) · [`excludeFromGridMenu`](/reference/column#col-excludeFromGridMenu)
- [Plugins](/in-depth/plugins) · [CSP & sanitization](/in-depth/csp)
