[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![NPM downloads](https://img.shields.io/npm/dm/slickgrid.svg)](https://npmjs.org/package/slickgrid)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/slickgrid?color=5dade2&label=gzip)](https://bundlephobia.com/result?p=slickgrid)
[![jsdelivr hits/month](https://data.jsdelivr.com/v1/package/npm/slickgrid/badge)](https://www.jsdelivr.com/package/npm/slickgrid)

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![npm](https://img.shields.io/npm/v/slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://npmjs.org/package/slickgrid)
[![Actions Status](https://github.com/6pac/SlickGrid/workflows/CI%20Build/badge.svg)](https://github.com/6pac/SlickGrid/actions)

## This is the 6pac SlickGrid repo

Check out the NEW SlickGrid Website! http://slickgrid.net/

This is the acknowledged and most active fork of SlickGrid.

It aims to be a viable alternative master repo, building on the legacy of the [mleibman/SlickGrid](https://github.com/mleibman/SlickGrid) master branch, keeping dependencies up to date and applying, safe core patches and enhancements to keep the project up to date.

We extended the project from the original SlickGrid foundation while also including the following changes:
- added a few more Plugins: RowDetail, CellMenu, ContextMenu, GridMenu, CustomTooltip, GridState
- merged [X-SlickGrid](https://github.com/ddomingues/X-SlickGrid) code into the project to bring Frozen Columns/Rows (aka Pinning)
- removed jQueryUI requirement in [v3](https://github.com/6pac/SlickGrid/wiki/Major-version-3.0----Removal-of-jQueryUI-requirement-(replaced-by-SortableJS)) (replaced it with [SortableJS](https://sortablejs.github.io/Sortable/))
- removed jQuery requirement in [v4](https://github.com/6pac/SlickGrid/wiki/Major-version-4.0---Removal-of-jQuery-requirement)
- modernized the project in [v5](https://github.com/6pac/SlickGrid/wiki/Major-version-5.0-%E2%80%90-ES6-ESM-and-TypeScript-Support) by migrating to TypeScript (we kept IIFE and added ES6/ESM build targets) and we also gave SlickGrid a fresh and more modern look via a new Alpine Theme (CSS/SASS)
- the project now has only 1 required small dependency which is [SortableJS](https://sortablejs.github.io/Sortable/)

### Vite Demo
You can also see a [ViteJS](https://vite.dev/) demo in the [./vite-demo](https://github.com/6pac/SlickGrid/tree/master/vite-demo) folder (also available via the Stackblitz link below). This Vite demo was created mostly to test the project ESM build and also the SASS imports as well, it could also be used to provide bug repro.

### Stackblitz

You can also try out the Vite demo (mentioned just above) live via Stackblitz. It can also be use to provide a repro when you openening any new bug/feature requests.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/6pac/SlickGrid/tree/master/vite-demo)

> Note: the Stackblitz demo only includes couple of examples, note however that there are a lot more example in the **[Examples](https://github.com/6pac/SlickGrid/wiki/Examples)** Wiki page

### Examples
Check out the **[Examples](https://github.com/6pac/SlickGrid/wiki/Examples)** Wiki for a full list of examples demonstrating new features and use cases, such as dynamic grid creation and editors with third party controls.

Also take a look at the [Wiki](https://github.com/6pac/SlickGrid/wiki) and [Releases](https://github.com/6pac/SlickGrid/releases) for documentation and recent news.

_For a basic TypeScript example, take a look at the v5.0 Annoucement & Migration guide shown below and also the [TypeScript Example Wiki](https://github.com/6pac/SlickGrid/wiki/TypeScript-Examples)._

Below is one of the available examples available in Stackblitz (which is mentioned just above)

![Realtime Trading Demo](https://github.com/user-attachments/assets/a098b242-88e5-418d-a40b-3a8e44e93ca4)

### Installation
There are multiple ways to use and install SlickGrid, you can use it as a standalone `<script>` (IIFE) or install it through NPM and then `import` or `require` SlickGrid (`import` is preferred for tree shaking).

```sh
# Alpine style from CDN
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slickgrid@5.14.0/dist/styles/css/slick-alpine-theme.min.css">

# standalone scripts (IIFE) from CDN
<script src="https://cdn.jsdelivr.net/npm/slickgrid@5.14.0/dist/browser/slick.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/slickgrid@5.14.0/dist/browser/slick.interactions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/slickgrid@5.14.0/dist/browser/slick.grid.min.js"></script>
<script>
  const grid = new Slick.Grid("#myGrid", dataView, columns, options);
</script>
---
# or install from NPM
npm install slickgrid

<script type="module">
  import 'slickgrid/dist/styles/css/slick-alpine-theme.css';
  import { SlickGrid, SlickDataView } from 'slickgrid';
  const dataView = new SlickDataView({ inlineFilters: true });
  const grid = new SlickGrid("#myGrid", dataView, columns, options);
</script>
```

For more CDN links, like controls and plugins, just headover to [jsDevlivr - SlickGrid](https://www.jsdelivr.com/package/npm/slickgrid) for the full list and click on the "Files" tab (or use this jsdelivr CDN link ["dist/browser"](https://www.jsdelivr.com/package/npm/slickgrid?tab=files&path=dist%2Fbrowser)).

### Contributions
See [Contributing Guide](https://github.com/6pac/SlickGrid/blob/master/CONTRIBUTING.md)

### E2E Tests with Cypress
A lot of our Examples now have [Cypress](https://www.cypress.io/) E2E (end to end) tests in the browser. You can see [here](https://github.com/6pac/SlickGrid/tree/master/cypress/e2e) the complete list of Examples that now have E2E tests. The biggest advantage is that these tests are executed in the [GitHub Actions](https://github.com/features/actions) Workflow (CI) for every Pull Request and that is to avoid committing changes that might break the library. We currently have tests for over 35+ examples with about 400 tests.

We welcome any new contributions and if you wish to add Cypress E2E tests, all you need to do is to clone the repo and run the following commands
```bash
npm install         # install all npm packages
npm run dev         # run a local development server on port 8080 in watch mode (or `npm run serve` without watch)
npm run cypress     # open Cypress UI tool
```
Once the Cypress UI is open, you can then click on "Run all Specs" to execute all E2E browser tests.

## Migrations

| SlickGrid | Migration Guide | Description |
| --------- | --------------- | ----------- |
| 3.x       | [Announcing v3.0](https://github.com/6pac/SlickGrid/wiki/Major-version-3.0----Removal-of-jQueryUI-requirement-(replaced-by-SortableJS)) | dropping [jQueryUI](https://jqueryui.com/) requirement and replaced it with [SortableJS](https://sortablejs.github.io/Sortable/) which is a lot more modern and touch friendly |
| 4.x       | [Announcing v4.0](https://github.com/6pac/SlickGrid/wiki/Major-version-4.0---Removal-of-jQuery-requirement) | dropping [jQuery](https://jquery.com/) requirement, SlickGrid is now using browser native code |
| 5.x       | [Announcing v5.0](https://github.com/6pac/SlickGrid/wiki/Major-version-5.0-%E2%80%90-ES6-ESM-and-TypeScript-Support) | project modernization, we added TypeScript with ES6, ESM builds and also a new Alpine Theme |

## CSP Compliance
The library is now, at least for the most part, CSP (Content Security Policy) compliant since `v5.5.0`, however there are some exceptions to be aware of. When using any html strings as template (for example with Custom Formatter returning an html string), you will not be fully compliant unless you return `TrustedHTML`. You can achieve this by using the `sanitizer` method in combo with [DOMPurify](https://github.com/cure53/DOMPurify) to return [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) and for more info, you can take a look at the [CSP Compliance](https://github.com/6pac/SlickGrid/wiki/CSP-Compliance) Wiki.

### Quick Little Fun Survey ✨
We are conducting a small little poll for fun, it is a single question survey about our latest releases. Thanks for taking the time to participate.

**[What do you think was the most exciting change(s) for you?](https://github.com/6pac/SlickGrid/discussions/853)**
