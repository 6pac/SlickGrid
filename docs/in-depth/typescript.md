---
title: TypeScript usage
---
# TypeScript usage

SlickGrid v6 is written in TypeScript and ships its own type declarations. You import the
classes you need, give the grid your row type, and the compiler checks your columns,
options, and every value you read back. This chapter shows how to install, import, type,
and extend the library. It assumes a bundler such as Vite, webpack, or esbuild.

## Concepts

- **The package is `slickgrid`.** Import from it with named ESM imports. There is no
  default export.
- **Runtime classes use the `Slick` prefix.** `SlickGrid`, `SlickDataView`,
  `SlickRowSelectionModel`, and so on. A few value exports do not: the `Editors`,
  `Formatters`, `Aggregators`, and `Utils` helpers, and enums and enum-like constants (for example
  `FieldType` and `SortDirectionNumber`).
- **You type the grid with your row model.** Pass an interface as a generic, for example
  `new SlickGrid<User>(...)`. Reads such as `getDataItem` then return `User`, and column
  `field` names are checked against `User`.
- **The library has no jQuery.** All examples use native DOM (`document.querySelector`,
  `addEventListener`). v6 also removes the SortableJS dependency, so no global setup is
  needed (see the pitfalls below).

## Set up a typed grid

Follow these steps for a minimal, fully typed grid.

### 1. Install

```sh
npm install slickgrid
```

### 2. Import the classes

Import runtime classes as values. Import interfaces with `import type`, because SlickGrid
exports them as types only.

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';
import type { Column, GridOption } from 'slickgrid';
```

The helpers and enums keep their plain names:

```ts
import {
  Editors,     // built-in cell editors
  Formatters,  // built-in cell formatters
  Aggregators, // grouping aggregators
  Utils,       // helper functions

  // enums and types have no Slick prefix either
  FieldType,
  SortDirectionNumber,

  // everything else (core, controls, plugins) is prefixed Slick*
  SlickGrid,
  SlickDataView,
  SlickRowSelectionModel,
} from 'slickgrid';
```

### 3. Import the styles

Load the core grid stylesheet plus one theme. Add per-feature stylesheets only when you
use that feature.

```ts
import 'slickgrid/dist/styles/css/slick.grid.css';       // required core layout
import 'slickgrid/dist/styles/css/slick-alpine-theme.css'; // or slick-default-theme.css
import 'slickgrid/dist/styles/css/slick-icons.css';      // only if you use the icons
```

The Sass sources are also published, at `slickgrid/dist/styles/sass/*.scss`, if you prefer
to compile the theme yourself and override its variables.

Give the container element a height and the `slick-container` class so the theme applies:

```html
<div id="myGrid" class="slick-container" style="width:100%; height:500px;"></div>
```

### 4. Type your row model

Declare an interface for one row. Use it as the first generic on `SlickGrid`.

```ts
import { SlickGrid } from 'slickgrid';
import type { Column, GridOption } from 'slickgrid';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age?: number;
}

const data: User[] = [
  { id: 1, firstName: 'Ada', lastName: 'Lovelace', age: 36 },
  { id: 2, firstName: 'Alan', lastName: 'Turing', age: 41 },
];

const columns: Column<User>[] = [
  { id: 'firstName', name: 'First Name', field: 'firstName' },
  { id: 'lastName', name: 'Last Name', field: 'lastName' },
  { id: 'age', name: 'Age', field: 'age' },
];

const options: GridOption = {
  enableCellNavigation: true,
  editable: false,
};

const grid = new SlickGrid<User>('#myGrid', data, columns, options);

const item = grid.getDataItem(0); // inferred as User
console.log(item.firstName);      // checked property
```

Because you typed the columns with `Column<User>`, the compiler checks each `field`
against `User`. A field name that is not a property of `User` is a compile error. This
catches typos before they reach the grid.

## The constructor

The public signature is:

```ts
new SlickGrid<TData>(
  container: HTMLElement | string,        // element or CSS selector
  data: TData[] | SlickDataView<TData>,   // an array, or a DataView
  columns: Column<TData>[],
  options: Partial<GridOption>,           // pass only the options you set
);
```

- `container` accepts a live element or a selector string such as `'#myGrid'`.
- `data` accepts a plain array or a `SlickDataView`.
- `options` is a `Partial`, so you set only the options you need.

## Using a DataView

`SlickDataView` takes the same row generic. Reads from it are typed the same way.

```ts
import { SlickGrid, SlickDataView } from 'slickgrid';

const dataView = new SlickDataView<User>();
dataView.setItems(data);

const grid = new SlickGrid<User>('#myGrid', dataView, columns, options);

const first = dataView.getItemByIdx(0); // inferred as User
```

For the full data workflow, see [Providing data to the grid](/in-depth/providing-data)
and [DataView](/in-depth/dataview).

## The three generics

`SlickGrid` has three generic parameters. You will almost always use only the first.

```ts
class SlickGrid<
  TData = any,                              // 1. your row type
  C extends Column<TData> = Column<TData>,  // 2. an extended Column interface
  O extends GridOption<C> = GridOption<C>,  // 3. an extended GridOption interface
>
```

1. **`TData`** is the row type. It drives the return types of `getDataItem`,
   `getCellValue`, and the `field` typing on columns.
2. **`C`** lets you supply a `Column` interface that you have extended with extra
   properties.
3. **`O`** lets you supply an extended `GridOption` interface.

The second and third generics exist mainly for libraries that add their own column and
option properties. Most applications set only `TData`.

## Extending the classes

SlickGrid uses `protected` (not `private`) members throughout, so you can subclass any
core class, control, or plugin. Override a method and call `super` to keep the base
behaviour.

```ts
import { SlickDataView, SlickEvent } from 'slickgrid';

interface Task {
  id: number;
  title: string;
}

class AuditDataView extends SlickDataView<Task> {
  onDestroyed = new SlickEvent<{ dataView: AuditDataView }>('onDestroyed');

  override destroy(): void {
    super.destroy();
    this.onDestroyed.notify({ dataView: this });
  }
}

const dv = new AuditDataView();
dv.onDestroyed.subscribe(() => console.log('DataView destroyed'));
```

`SlickEvent` is generic over its payload type, so `subscribe` handlers receive a typed
`args` object.

## Pitfalls and notes

- **No SortableJS global.** Old SlickGrid required you to assign
  `window.Sortable = Sortable`. v6 removes the SortableJS dependency, so delete that code;
  no global assignment or extra install is needed. See
  [Frozen rows & columns](/in-depth/frozen) for the related reordering notes.
- **Use `import type` for interfaces.** `Column`, `GridOption`, and the other interfaces
  are type-only exports. Import them with `import type` so bundlers with
  `verbatimModuleSyntax` do not try to emit a runtime import.
- **Import styles separately.** The JavaScript import does not pull in CSS. You must
  import at least `slick.grid.css` and one theme, or the grid renders unstyled.
- **`options` is a `Partial`.** You never need to fill in every option. Set the ones you
  want and let the defaults cover the rest.

## See also

- Reference: [SlickGrid](/reference/grid) — the [`getDataItem`](/reference/grid#m-getDataItem)
  and [`getCellValue`](/reference/grid#m-getCellValue) methods, and the
  [`enableCellNavigation`](/reference/grid#opt-enableCellNavigation) option
- Reference: [Column definition](/reference/column#col-field) — the typed `field` property
- Reference: [DataView](/reference/dataview#m-getItemByIdx)
- Reference: [Editors](/reference/editors) and [Formatters](/reference/formatters)
- [Theming & styling](/in-depth/theming) — themes and CSS variables
- [Providing data to the grid](/in-depth/providing-data) and [DataView](/in-depth/dataview)
