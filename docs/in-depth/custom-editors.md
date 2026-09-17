---
title: Cell editors
---
# Cell editors

Cell editors turn a read-only grid into an editable one. This chapter shows how to enable editing, how to assign a built-in editor to a column, and how to write your own editor in TypeScript with no jQuery. It also covers validators, the composite editor, and the edit-command handler you use for undo/redo.

## Concepts

An **editor** is a small class. The grid creates one instance each time a cell enters edit mode, and destroys it when the edit ends. The editor owns the input UI inside the cell, reads the current value, reports whether the value changed, validates it, and writes the result back to the data item.

Every editor implements the [`Editor`](/reference/editors) interface. The grid drives it through a fixed set of methods. You never call these methods yourself; the grid calls them at the right time.

The grid never lets two cells edit at once. A single **editor lock** guards the active edit. A commit succeeds only after the editor validates. The lock is a `SlickEditorLock`, and by default all grids on the page share one global lock.

The edit result is applied through an **edit command**. The command carries an `execute()` and an `undo()` callback. This split is what makes undo/redo and deferred saves possible.

## Enable editing

Three things must be true before a cell can be edited:

1. The grid option [`editable`](/reference/grid#opt-editable) is `true`.
2. The grid option [`enableCellNavigation`](/reference/grid#opt-enableCellNavigation) is `true` (it is `true` by default). A cell must be able to become active.
3. The column has an [`editor`](/reference/column#col-editor).

```ts
import { SlickGrid, Editors } from 'slickgrid';

const columns = [
  { id: 'title', name: 'Title', field: 'title', editor: Editors.Text },
  { id: 'done', name: 'Done', field: 'done', editor: Editors.Checkbox },
];

const options = {
  editable: true,
  enableCellNavigation: true,
  autoEdit: false, // one click activates the cell; a second action opens the editor
};

const grid = new SlickGrid('#myGrid', data, columns, options);
```

Assign the editor **class**, not an instance. The grid constructs it for you.

### How the editor opens

The [`autoEdit`](/reference/grid#opt-autoEdit) option controls when the editor opens:

- `autoEdit: true` (the built-in default) — one click on an editable cell opens the editor at once.
- `autoEdit: false` — one click only selects the cell. The user opens the editor with a **double-click**, or by pressing **Enter** on the active cell.
- [`autoEditByKeypress`](/reference/grid#opt-autoEditByKeypress) — when `true`, typing a character on an active cell opens the editor and passes the keystroke through.

You can also open the editor from code with [`editActiveCell`](/reference/grid#m-editActiveCell) or [`setActiveCell`](/reference/grid#m-setActiveCell).

## Built-in editors

Import the `Editors` registry and pick an entry. The built-in editors are:

| `Editors` key | Class | Serialized value |
| --- | --- | --- |
| `Text` | `TextEditor` | `string` |
| `Integer` | `IntegerEditor` | `number` (via `parseInt`) |
| `Float` | `FloatEditor` | `number` (via `parseFloat`) |
| `Checkbox` | `CheckboxEditor` | `boolean` |
| `YesNoSelect` | `YesNoSelectEditor` | `boolean` |
| `PercentComplete` | `PercentCompleteEditor` | `number` (slider + buttons) |
| `LongText` | `LongTextEditor` | `string` (detached pop-up) |
| `Flatpickr` | `FlatpickrEditor` | `string` (needs the external Flatpickr library) |

```ts
import { Editors } from 'slickgrid';

const columns = [
  { id: 'name', name: 'Name', field: 'name', editor: Editors.Text },
  { id: 'qty', name: 'Qty', field: 'qty', editor: Editors.Integer },
  { id: 'cost', name: 'Cost', field: 'cost', editor: Editors.Float,
    editorFixedDecimalPlaces: 2 },
  { id: 'active', name: 'Active', field: 'active', editor: Editors.YesNoSelect },
];
```

Notes on the number editors:

- `FloatEditor` reads [`editorFixedDecimalPlaces`](/reference/column#col-editorFixedDecimalPlaces) from the column to round its value. You can set a page-wide default with the static `FloatEditor.DefaultDecimalPlaces`, and allow empty input with the static `FloatEditor.AllowEmptyValue`.
- The `Text`, `Integer`, and `Float` editors call the column [`validator`](/reference/column#col-validator) if one is set. The `Integer` and `Float` editors also reject non-numeric input on their own.

For the full option and method list of each editor, see the [Editors reference](/reference/editors).

## The Editor interface

The grid constructs your editor with `new YourEditor(args)`. It passes one [`EditorArguments`](/reference/editors) object. It then calls your methods in this order:

1. `loadValue(item)` — fill the UI from the data item.
2. `preClick()` — optional, only when the cell was opened by a pre-click (see below).
3. `serializeValue()` — the grid records this as the "before" value for undo.

The grid does **not** call `init()` itself. Build your UI in the constructor.

### Constructor arguments

`args` (an `EditorArguments`) carries:

| Field | Meaning |
| --- | --- |
| `container` | The cell's `HTMLDivElement`. Append your input here. |
| `column` | The column definition. Read `column.field`, `column.params`, `column.validator`. |
| `item` | The data item for the row being edited. |
| `grid` | The `SlickGrid` instance. |
| `position` / `gridPosition` | Cell and grid geometry, for detached editors. |
| `event` | The DOM event that started the edit, if any. |
| `commitChanges()` | Call to commit the edit yourself (used by detached editors). |
| `cancelChanges()` | Call to cancel the edit yourself. |
| `compositeEditorOptions` | Set only when the editor runs inside a composite editor. |

### Required methods

| Method | Job |
| --- | --- |
| `init()` | Optional in practice — the constructor does setup. The interface still declares it. |
| `destroy()` | Remove every DOM element and event listener you created. |
| `focus()` | Put focus on the main input. |
| `loadValue(item)` | Read the value from `item` and show it in the UI. Store it as the default. |
| `serializeValue()` | Return the current UI value in a plain, storable form. |
| `applyValue(item, state)` | Write `state` back onto `item`. Treat this as static — do not read instance fields. |
| `isValueChanged()` | Return `true` only if the user changed the value. |
| `validate()` | Return `{ valid, msg }`. |

`applyValue` may run after the editor is destroyed (during an undo). Keep it self-contained: use only its two arguments.

### Optional methods and properties

| Member | Use |
| --- | --- |
| `keyCaptureList` | An array of key codes the grid must let through to your input (for example arrow keys in a dropdown). |
| `preClick()` | Runs before edit mode starts, when the clicked element has the pre-click class. |
| `hide()` / `show()` | For a **detached** editor whose UI is on `document.body`. The grid calls these when the cell scrolls out of or into view. |
| `position(cellBox)` | For a detached editor. The grid calls it with `{ top, left, bottom, right, width, height, visible }` when the cell moves. |
| `save()` / `cancel()` | Convenience hooks a detached editor's own buttons can call. |
| `disabled` | Start the editor disabled (for example while an async option list loads). |

## Write a custom editor

This editor is a native `<select>` dropdown. It has no dependencies and no jQuery.

**Step 1 — implement the interface.**

```ts
import { type Editor, type EditorArguments, type EditorValidationResult, keyCode } from 'slickgrid';

export class SelectEditor implements Editor {
  protected select!: HTMLSelectElement;
  protected defaultValue = '';

  // let the grid pass these keys through to the <select>
  keyCaptureList = [keyCode.UP, keyCode.DOWN, keyCode.ENTER];

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    const choices: string[] = this.args.column.params?.options ?? [];
    this.select = document.createElement('select');
    this.select.className = 'editor-select';
    for (const choice of choices) {
      const opt = document.createElement('option');
      opt.value = choice;
      opt.textContent = choice;
      this.select.appendChild(opt);
    }
    this.args.container.appendChild(this.select);
    this.select.focus();
  }

  destroy() {
    this.select.remove();
  }

  focus() {
    this.select.focus();
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field] ?? '';
    this.select.value = String(this.defaultValue);
  }

  serializeValue() {
    return this.select.value;
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return this.select.value !== String(this.defaultValue);
  }

  validate(): EditorValidationResult {
    if (this.args.column.validator) {
      return this.args.column.validator(this.select.value, this.args);
    }
    return { valid: true, msg: null };
  }
}
```

**Step 2 — assign it to a column.** Pass the choices in `params`.

```ts
const columns = [
  {
    id: 'priority', name: 'Priority', field: 'priority',
    editor: SelectEditor,
    params: { options: ['Low', 'Medium', 'High'] },
  },
];
```

**Step 3 — clean up in `destroy`.** Remove every element and listener you added. The grid calls `destroy` on every edit end, so a leak here repeats on every cell.

Points to copy from this pattern:

- Do UI setup in the constructor, not in a method the grid must call.
- Save the loaded value in `loadValue`, then compare against it in `isValueChanged`. An unchanged cell must report `false`, or the grid records a no-op edit.
- Call the column validator inside `validate`. The grid does not call it for you.

## Validators

A validator is a function on the column. It receives the current value and the editor args, and returns an [`EditorValidationResult`](/reference/editors).

```ts
import { type EditorValidator } from 'slickgrid';

const required: EditorValidator = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, msg: 'This field is required' };
  }
  return { valid: true, msg: null };
};

const columns = [
  { id: 'name', name: 'Name', field: 'name', editor: Editors.Text, validator: required },
];
```

The commit flow works like this:

1. The grid calls `isValueChanged()`. If nothing changed, the edit closes with no command.
2. The grid calls the editor's `validate()`.
3. If the result is invalid, the grid adds the `invalid` CSS class to the cell, keeps focus in the editor, and fires [`onValidationError`](/reference/grid#evt-onValidationError). The edit does not commit.
4. If valid, the grid builds the edit command and commits.

Listen for validation failures to show your own message:

```ts
grid.onValidationError.subscribe((_e, args) => {
  console.warn(args.validationResults.msg, 'at row', args.row);
});
```

## The edit lifecycle and undo/redo

When an edit commits on an existing row, the grid builds an [`EditCommand`](/reference/editors) and runs it. The command holds:

| Field | Meaning |
| --- | --- |
| `row`, `cell` | The edited cell. |
| `editor` | The editor instance. |
| `serializedValue` | The new value, from `serializeValue()`. |
| `prevSerializedValue` | The value before the edit. |
| `execute()` | Apply the new value: `applyValue(item, serializedValue)`, update the row, then fire [`onCellChange`](/reference/grid#evt-onCellChange) with `command: 'execute'`. |
| `undo()` | Restore the old value: `applyValue(item, prevSerializedValue)`, update the row, then fire [`onCellChange`](/reference/grid#evt-onCellChange) with `command: 'undo'`. |

By default the grid runs `execute()` at once. To take control, set the [`editCommandHandler`](/reference/grid#opt-editCommandHandler) grid option. The grid then hands you the command instead of running it. You decide when to call `execute()`, and you can keep it for later `undo()`.

```ts
const undoStack: EditCommand[] = [];

const options = {
  editable: true,
  editCommandHandler: (_item, _column, editCommand) => {
    undoStack.push(editCommand);
    editCommand.execute(); // apply now
  },
};

// later, undo the last edit
function undoLast() {
  const cmd = undoStack.pop();
  cmd?.undo();
}
```

Because `execute()` and `undo()` are separate, you can commit to a remote source and still roll back. Apply the change, send it to the server, and call `undo()` from the error handler if the save fails. This keeps the grid and the server in step.

The simplest way to react to committed edits, without taking over control, is the `onCellChange` event:

```ts
grid.onCellChange.subscribe((_e, args) => {
  console.log('changed', args.column.field, '=', args.item[args.column.field]);
});
```

Editing the **add-new row** (the extra blank row past the data) does not fire `onCellChange`. The grid applies the values to a fresh item and fires [`onAddNewRow`](/reference/grid#evt-onAddNewRow) instead.

## The editor lock

The active edit is held by a `SlickEditorLock`. Get it with [`getEditorLock`](/reference/grid#m-getEditorLock). Use it before actions that must not interrupt a half-finished edit, such as reloading data or navigating away.

```ts
const lock = grid.getEditorLock();
if (lock.isActive() && !lock.commitCurrentEdit()) {
  return; // a validator blocked the commit; stay on the cell
}
// safe to proceed
```

`commitCurrentEdit()` returns `false` when validation fails. `cancelCurrentEdit()` always discards and returns `true`.

By default every grid on the page shares one global lock, so only one cell edits at a time page-wide. To give a grid its own lock, pass one in the [`editorLock`](/reference/grid#opt-editorLock) option:

```ts
import { SlickEditorLock } from 'slickgrid';

const options = { editable: true, editorLock: new SlickEditorLock() };
```

## Composite editors

Use the composite editor to edit several columns at once, for example in a modal form. `SlickCompositeEditor` is a factory. It takes the columns to edit, one container element per column, and an options object. It returns an editor **class** you pass to [`editActiveCell`](/reference/grid#m-editActiveCell).

```ts
import { SlickCompositeEditor } from 'slickgrid';

const editableColumns = columns.filter(c => c.editor);
const containers = editableColumns.map(() => {
  const div = document.createElement('div');
  document.querySelector('#myModalForm')!.appendChild(div);
  return div;
});

const CompositeEditor = SlickCompositeEditor(editableColumns, containers, {
  modalType: 'edit',
  validationFailedMsg: 'Some fields are invalid',
});

grid.editActiveCell(CompositeEditor);
```

Inside a composite editor, each child editor:

- Aggregates validation. `validate()` runs every child and collects the failures into the `errors` array of the result.
- Serializes as an array. `serializeValue()` returns one value per child, and `applyValue(item, state)` applies the matching array element to each.
- Fires [`onCompositeEditorChange`](/reference/grid#evt-onCompositeEditorChange) as the user edits, so the form can react live.

A child editor detects this mode through `args.compositeEditorOptions`. The built-in editors use it to hide their own Save/Cancel buttons and to notify on change. If you write a custom editor for use in a composite form, check that field.

Detached editors (such as `LongText`) position themselves against the active cell, not the supplied container, so they do not work inside a composite editor.

## Common pitfalls

- **Assigning an instance, not a class.** Set `editor: Editors.Text`, never `editor: new TextEditor(...)`. The grid constructs the editor.
- **`isValueChanged` always returns `true`.** Save the loaded value in `loadValue` and compare against it. Otherwise every opened cell records an edit, and undo stacks fill with no-ops.
- **Reading instance state in `applyValue`.** It can run after `destroy()`. Use only its `item` and `state` arguments.
- **Leaks in `destroy`.** Remove every listener and element. `destroy` runs on every edit end.
- **The grid does not call your validator.** Call `column.validator` yourself inside `validate()`, as the built-in editors do.
- **`enableCellNavigation` turned off.** With it `false`, no cell can become active, so no cell can edit. Keep it `true`.
- **Arrow or Enter keys hijacked.** If your editor needs a key the grid uses for navigation, list it in `keyCaptureList`.
- **Heavy editors block the UI.** For a slow-to-build editor, set [`asyncEditorLoading`](/reference/grid#opt-asyncEditorLoading) `true`; the grid then opens it after [`asyncEditorLoadDelay`](/reference/grid#opt-asyncEditorLoadDelay) milliseconds (default 100).

### Pre-click editing

A pre-click lets one click both open the editor and act on it. The built-in `CheckboxEditor` uses it to toggle on the first click, instead of one click to edit and a second to toggle.

To use it, add the pre-click class to the clickable element in your formatter. The default class is `slick-edit-preclick` (exported as `preClickClassName`).

```ts
import { preClickClassName } from 'slickgrid';

const checkFormatter = (_row, _cell, value) =>
  `<input type="checkbox" class="${preClickClassName}" ${value ? 'checked' : ''} />`;
```

When the user clicks that element, the grid opens the editor and calls its `preClick()` method after `loadValue`.

## See also

- [Editors reference](/reference/editors) — every built-in editor and the `Editor`, `EditorArguments`, and `EditCommand` types.
- [Formatters](/in-depth/formatters) — the read-only counterpart that renders cell values.
- Grid options: [`editable`](/reference/grid#opt-editable) · [`autoEdit`](/reference/grid#opt-autoEdit) · [`autoEditByKeypress`](/reference/grid#opt-autoEditByKeypress) · [`autoCommitEdit`](/reference/grid#opt-autoCommitEdit) · [`asyncEditorLoading`](/reference/grid#opt-asyncEditorLoading) · [`editCommandHandler`](/reference/grid#opt-editCommandHandler) · [`editorLock`](/reference/grid#opt-editorLock) · [`editorCellNavOnLRKeys`](/reference/grid#opt-editorCellNavOnLRKeys).
- Grid methods: [`editActiveCell`](/reference/grid#m-editActiveCell) · [`getEditorLock`](/reference/grid#m-getEditorLock) · [`getEditController`](/reference/grid#m-getEditController).
- Grid events: [`onBeforeEditCell`](/reference/grid#evt-onBeforeEditCell) · [`onCellChange`](/reference/grid#evt-onCellChange) · [`onValidationError`](/reference/grid#evt-onValidationError) · [`onAddNewRow`](/reference/grid#evt-onAddNewRow) · [`onCompositeEditorChange`](/reference/grid#evt-onCompositeEditorChange).
- Column properties: [`editor`](/reference/column#col-editor) · [`validator`](/reference/column#col-validator) · [`editorFixedDecimalPlaces`](/reference/column#col-editorFixedDecimalPlaces) · [`cannotTriggerInsert`](/reference/column#col-cannotTriggerInsert).
