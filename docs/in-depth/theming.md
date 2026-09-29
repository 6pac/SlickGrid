---
title: Theming & styling
---
# Theming & styling

SlickGrid draws every cell, header, and control from CSS, so the way a grid looks is entirely up to the stylesheet you load. This chapter explains the two themes the library ships, how to import them, and how to change colours, spacing, and fonts. You customise a grid in two ways: set **CSS variables** at runtime (no build step), or override **SASS variables** and rebuild the theme. This chapter also covers the SVG icon set, the per-plugin stylesheets, and how to build a dark theme of your own. There is no jQuery and no image files — the look is CSS variables and inline SVG.

## Concepts

### Two themes: Alpine and Classic

SlickGrid ships two themes.

- **Alpine** is the modern theme. It is a flat, light design inspired by other data grids. It is **self-contained**: one file carries both the grid layout and the look. Use Alpine for new grids.
- **Classic** (also called *default*) is the original SlickGrid look — silver borders and grey headers. Its layout lives in `slick.grid.css` and its extra colours live in `slick-default-theme.css`.

The built stylesheets are in the package under `dist/styles/css/`:

| File | Role |
| --- | --- |
| `slick-alpine-theme.css` | Alpine theme — layout **and** look in one file. |
| `slick.grid.css` | Base grid layout with the classic look built in. |
| `slick-default-theme.css` | Extra classic colours. Layers on top of `slick.grid.css`. |
| `slick-icons.css` | The optional `sgi` SVG icon set. |
| `slick.<plugin>.css` | One stylesheet per plugin or control (see step 6 below). |

Pick **one** theme. Do not load Alpine and the classic files together.

### The container class

The Alpine theme styles the grid's outer element through two selectors: `#myGrid` and `.slick-container`. Give your grid element the `slick-container` class so the border, background, and font apply:

```html
<div id="myGrid" class="slick-container" style="width:100%;height:500px;"></div>
```

The class is optional but recommended. Without it, some Alpine styling — the outer border in particular — does not show. The classic theme does not need it.

### CSS variables vs SASS variables

Every colour, size, and spacing value in the Alpine theme is a variable, and you can set it two ways:

- A **CSS custom property** (`--alpine-…`) at runtime, in your own stylesheet. No build step. This is the common route.
- A **SASS variable** (`$alpine-…`) at build time, before you compile the theme. Use this for deeper changes or to swap the built-in icon glyphs.

The two share one naming scheme: the SASS name with `$` becomes the CSS name with `--`. So `$alpine-font-size` is `--alpine-font-size`. In the compiled CSS each value reads `var(--alpine-font-size, 13px)` — the CSS variable first, the SASS-compiled value as the fallback. **If you set both, the CSS variable wins**, because the SASS value is only the fallback.

## Walkthrough

### 1. Choose and import the Alpine theme

With a bundler (Vite, webpack, esbuild), import the CSS from the package:

```ts
import { SlickGrid } from 'slickgrid';
import 'slickgrid/dist/styles/css/slick-alpine-theme.css';
import 'slickgrid/dist/styles/css/slick-icons.css'; // optional icons
```

In plain HTML, link the file:

```html
<link rel="stylesheet" href="node_modules/slickgrid/dist/styles/css/slick-alpine-theme.css">
<link rel="stylesheet" href="node_modules/slickgrid/dist/styles/css/slick-icons.css">
```

Then build the grid on a container that has the `slick-container` class:

```ts
const grid = new SlickGrid<MyRow>('#myGrid', data, columns, options);
```

That is all a default Alpine grid needs.

### 2. Or use the Classic theme

For the original look, load `slick.grid.css`. Add `slick-default-theme.css` after it for the fuller classic palette:

```html
<link rel="stylesheet" href="node_modules/slickgrid/dist/styles/css/slick.grid.css">
<link rel="stylesheet" href="node_modules/slickgrid/dist/styles/css/slick-default-theme.css">
```

`slick.grid.css` alone gives a usable classic grid. `slick-default-theme.css` is a colour layer only — it has no layout rules, so it does nothing without `slick.grid.css` under it. Do not also load `slick-alpine-theme.css`.

### 3. Customise with CSS variables (no build)

Set any `--alpine-…` variable in your own stylesheet. Define it on `:root` to change every grid on the page, or on `.slick-container` to change one grid. The variables must be defined where the grid can read them, so declare them **after** the theme import.

```css
/* one grid only */
.slick-container {
  --alpine-font-size: 14px;
  --alpine-font-color: #1a1a1a;
  --alpine-header-bg-color: #eef2f7;
  --alpine-border-color: #cbd5e1;
  --alpine-odd-row-color: #f6f8fa;
  --alpine-row-mouse-hover-color: #e2edff;
  --alpine-cell-selected-bg-color: #cfe3ff;
}
```

These are the variables you reach for most often:

| Variable | Controls | Default |
| --- | --- | --- |
| `--alpine-font-family` | Grid font | system UI stack |
| `--alpine-font-size` | Grid font size | `13px` |
| `--alpine-font-color` | Cell text colour | `#181d1f` |
| `--alpine-grid-bgcolor` | Grid container background | `#fff` |
| `--alpine-bg-color` | Viewport (scroll area) background | `#ffffff` |
| `--alpine-border-color` | Grid and header borders | `#dae1e7` |
| `--alpine-border-radius` | Grid corner radius | `0` |
| `--alpine-odd-row-color` | Odd (zebra) row background | `#fbfbfb` |
| `--alpine-row-mouse-hover-color` | Row hover background | `#e8f4fe` |
| `--alpine-cell-selected-bg-color` | Selected cell/row background | derived blue |
| `--alpine-cell-selected-color` | Selected cell text colour | `#181d1f` |
| `--alpine-cell-padding` | Cell padding | `2px 4px` |
| `--alpine-cell-border-color` | Cell border colour | `#dae1e7` |
| `--alpine-header-bg-color` | Column header background | `#f8f8f8` |
| `--alpine-header-color` | Column header text colour | `#181d1f` |
| `--alpine-header-font-weight` | Column header weight | `bold` |
| `--alpine-header-column-line-height` | Header row height | `23px` |
| `--alpine-headerrow-bg-color` | Filter row background | `#f8fafc` |
| `--alpine-sort-indicator-color` | Sort arrow colour | `#3490dc` |
| `--alpine-menu-bg-color` | Menu/picker background | `#fbfbfb` |
| `--alpine-pager-bg-color` | Pager background | `#f8f8f8` |

This is a subset. The full list is in [`_variables.scss`](https://github.com/6pac/SlickGrid/blob/master/src/styles/_variables.scss); every `$alpine-…` there has a matching `--alpine-…` custom property.

### 4. Build from SASS and override variables

Use SASS when you want a compiled theme with your values baked in, or when you need to change something a CSS variable cannot reach (see step 5 on icons). The raw SCSS ships in the package under `dist/styles/sass/`.

With modern Dart Sass, load the theme with the module system and configure the variables in one `@use` rule:

```scss
// my-theme.scss
@use 'slickgrid/dist/styles/sass/slick-alpine-theme' with (
  $alpine-font-size: 14px,
  $alpine-header-bg-color: #eef2f7,
  $alpine-border-color: #cbd5e1,
  $alpine-odd-row-color: #f6f8fa,
);
```

Every variable is declared with `!default`, so your `with (…)` values replace them before the theme compiles. Compile `my-theme.scss` and load the result instead of the pre-built `slick-alpine-theme.css`.

> The older pattern — set each `$alpine-…` variable, then `@import` the theme — still works, but `@import` is deprecated in Dart Sass. Prefer `@use … with (…)`.

Reach for SASS only when you need it. For colour and spacing tweaks, the CSS variables in step 3 need no build step and are easier to change.

### 5. Use the SVG icons

SlickGrid replaced all its image files with a small set of inline-SVG icons in pure CSS. They are prefixed `sgi` (SlickGrid Icons) and colour themselves from the current text colour, so they scale and recolour with CSS alone.

Import `slick-icons.css`, then use two classes together — the base `sgi` class **and** the specific icon class:

```html
<span class="sgi sgi-search"></span>
<span class="sgi sgi-star" style="color: teal"></span>
```

- **Colour** — the icon uses `currentColor`, so set `color` to recolour it.
- **Size** — set `font-size`, or use a size helper class from `sgi-10px` to `sgi-30px`.
- **Transform** — `sgi-flip-h` and `sgi-flip-v` mirror the icon; `sgi-spin` rotates it (useful with `sgi-loading`).
- **Disabled** — `sgi-state-disabled` dims the icon.

The built-in icon names are:

`sgi-chevron-start` · `sgi-chevron-left` · `sgi-chevron-right` · `sgi-chevron-end` · `sgi-arrow-collapse` · `sgi-arrow-expand` · `sgi-cancel` · `sgi-caret` · `sgi-check` · `sgi-check-bold` · `sgi-close` · `sgi-checkbox-outline` · `sgi-checkbox-marked-outline` · `sgi-checkbox-blank-outline` · `sgi-checkbox-intermediate` · `sgi-coffee-outline` · `sgi-drag` · `sgi-drag-vertical` · `sgi-hashtag` · `sgi-help-circle-outline` · `sgi-information-outline` · `sgi-lightbulb` · `sgi-loading` · `sgi-menu` · `sgi-message-outline` · `sgi-pencil-outline` · `sgi-minus-box-outline` · `sgi-plus-box-outline` · `sgi-search` · `sgi-star` · `sgi-star-outline` · `sgi-tag-outline` · `sgi-undo` · `sgi-user`

Many plugins take an icon CSS class in their options. Pass an `sgi` class there:

```ts
new SlickDraggableGrouping({
  deleteIconCssClass: 'sgi sgi-close',
  groupIconCssClass: 'sgi sgi-drag-vertical',
});
```

**Swap a glyph without rebuilding.** Each icon defines a CSS variable named `--<icon>-icon-svg` that holds its SVG. Redefine that variable in a rule that targets the icon class, and give it a new `url()` with your own SVG path:

```css
/* one long line; the SVG must be URL-escaped, and the path fill stays currentColor */
.sgi-search {
  --sgi-search-icon-svg: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="…your path…"/></svg>');
}
```

Set it on the icon's own class (or a more specific rule), not on `:root` — the theme defines the variable on `.sgi-search`, so a `:root` value does not win.

The theme's own icons — the group expand/collapse toggles and the percent-complete editor pencil — come from SASS **path** variables such as `$alpine-group-expanded-icon-svg-path`. To change those, override the SASS variable and rebuild the theme (step 4).

### 6. Add per-plugin CSS

Plugins and controls keep their styles in separate files. Import only the ones you use, alongside the theme:

| Plugin / control | Stylesheet |
| --- | --- |
| Column picker | `slick.columnpicker.css` |
| Grid menu | `slick.gridmenu.css` |
| Context menu | `slick.contextmenu.css` |
| Cell menu | `slick.cellmenu.css` |
| Header menu | `slick.headermenu.css` |
| Header buttons | `slick.headerbuttons.css` |
| Custom tooltip | `slick.customtooltip.css` |
| Draggable grouping | `slick.draggablegrouping.css` |
| Pager | `slick.pager.css` |
| Row detail view | `slick.rowdetailview.css` |

```ts
import 'slickgrid/dist/styles/css/slick-alpine-theme.css';
import 'slickgrid/dist/styles/css/slick.columnpicker.css';
import 'slickgrid/dist/styles/css/slick.pager.css';
```

The menu-style plugins read the same Alpine variables where it makes sense — `--alpine-menu-bg-color`, `--alpine-menu-border`, `--alpine-menu-color` — so your theme colours flow into them.

## Dark mode & custom themes

SlickGrid v6 does not ship a dark theme. You build one by overriding the CSS variables. Scope the overrides to a class or attribute on the container, and the values cascade to the cells, headers, and menus that read them.

```css
.slick-container.dark {
  --alpine-grid-bgcolor: #1e1e1e;
  --alpine-bg-color: #1e1e1e;
  --alpine-font-color: #e4e4e4;
  --alpine-border-color: #3a3a3a;
  --alpine-cell-border-color: #3a3a3a;
  --alpine-odd-row-color: #242424;
  --alpine-row-mouse-hover-color: #333a40;
  --alpine-cell-selected-bg-color: #2f4257;
  --alpine-cell-selected-color: #ffffff;
  --alpine-header-bg-color: #2a2a2a;
  --alpine-header-color: #e4e4e4;
  --alpine-headerrow-bg-color: #262626;
  --alpine-menu-bg-color: #2a2a2a;
  --alpine-menu-color: #e4e4e4;
  --alpine-pager-bg-color: #2a2a2a;
}
```

Add the `dark` class to the grid element to switch it on. You could instead key the block off `@media (prefers-color-scheme: dark)` to follow the operating system. The colours above are examples — adjust to taste.

Two details help with dark mode:

- **Icons follow the text colour.** Because `sgi` icons use `currentColor`, they turn light automatically when you set a light `--alpine-font-color`. No per-icon work is needed.
- **A few values are hardcoded.** The text editor's input background and the selected-editable cell background are white in the theme, and a selected cell's link text is white. For a polished dark theme, add a rule or two for these:

```css
.slick-container.dark input.editor-text,
.slick-container.dark .slick-cell.selected.editable {
  background: #1e1e1e;
  color: #e4e4e4;
}
```

For a theme you reuse across projects, compile a SASS build (step 4) with your palette baked in, rather than shipping a large override block.

## Notes and pitfalls

- **Add `slick-container` to the grid element.** The Alpine outer border and background style `.slick-container`; without the class they may not show.
- **Load one theme.** Do not import `slick-alpine-theme.css` and the classic files together. The Alpine theme already includes the layout that the classic `slick.grid.css` provides.
- **`slick-default-theme.css` is colours only.** It needs `slick.grid.css` under it; on its own it lays out nothing.
- **CSS variables beat SASS variables.** In the compiled theme the CSS custom property is first and the SASS value is the fallback. A `--alpine-…` rule always overrides a `$alpine-…` build value.
- **Keep the cell box model uniform.** Cells depend on consistent padding, margin, and border to stay aligned. Change padding through `--alpine-cell-padding`, not through a custom class that adds its own padding, margin, or border to `.slick-cell` — an ad-hoc value on one cell breaks column alignment. Use column [`cssClass`](/reference/column#col-cssClass) for colour and font, not for box-model size.
- **Icons need both classes.** Use `class="sgi sgi-search"`, not `class="sgi-search"` alone. The base `sgi` class carries the mask and sizing.
- **Override an icon glyph on its own class.** Set `--sgi-…-icon-svg` on the icon selector (or higher specificity), not on `:root`.
- **Row and header height are options, not CSS.** Set row height with the grid [`rowHeight`](/reference/grid#opt-rowHeight) option and the filter row with [`headerRowHeight`](/reference/grid#opt-headerRowHeight); the grid measures these in JavaScript, so a CSS `height` alone does not move the rows.

## See also

- [`_variables.scss`](https://github.com/6pac/SlickGrid/blob/master/src/styles/_variables.scss) — the full list of theme variables
- [Column reference: `cssClass`](/reference/column#col-cssClass) · [`headerCssClass`](/reference/column#col-headerCssClass) — attach your own classes to cells and headers
- [Grid reference: `rowHeight`](/reference/grid#opt-rowHeight) · [`headerRowHeight`](/reference/grid#opt-headerRowHeight) — sizes the grid computes
- [Formatters](/in-depth/formatters) — the cell HTML your CSS targets
- [Menus & header UI](/in-depth/menus) · [Plugins](/in-depth/plugins) — plugins with their own stylesheets
- [Auto column sizing](/in-depth/auto-column-sizing) — the runtime `--slick-auto-header-height` variable
- [Plugins reference](/reference/plugins) · [Controls reference](/reference/controls)
