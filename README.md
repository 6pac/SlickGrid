[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![NPM downloads](https://img.shields.io/npm/dm/slickgrid.svg)](https://npmjs.org/package/slickgrid)
[![npm](https://img.shields.io/npm/v/slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://npmjs.org/package/slickgrid)
[![Actions Status](https://github.com/6pac/SlickGrid/workflows/CI%20Build/badge.svg)](https://github.com/6pac/SlickGrid/actions)

## This is the 6pac SlickGrid repo

Check out the NEW SlickGrid Website! http://slickgrid.net/

This is the acknowledged most active fork of SlickGrid.

It aims to be a viable alternative master repo, building on the legacy of the [mleibman/SlickGrid](https://github.com/mleibman/SlickGrid) master branch, keeping libraries up to date and applying, safe core patches and enhancements to keep the project up to date.

We extended the project from the original SlickGrid foundation while also including the following changes:
- added a few more Plugins: RowDetail, CellMenu, ContextMenu, GridMenu, CustomTooltip, GridState
- merged [X-SlickGrid](https://github.com/ddomingues/X-SlickGrid) code into the project which brought Frozen Columns/Rows (aka Pinning)
- removed jQueryUI requirement in [v3](https://github.com/6pac/SlickGrid/wiki/Major-version-3.0----Removal-of-jQueryUI-requirement-(replaced-by-SortableJS)) (replaced it with [SortableJS](https://sortablejs.github.io/Sortable/))
- removed jQuery requirement in [v4](https://github.com/6pac/SlickGrid/wiki/Major-version-4.0---Removal-of-jQuery-requirement)
- modernized the project in [v5](https://github.com/6pac/SlickGrid/wiki/Major-version-5.0-%E2%80%90-ES6-ESM-and-TypeScript-Support) by migrating to TypeScript (we kept IIFE and added ES6/ESM build targets) and we also gave SlickGrid a fresh new paint by providing a new Alpine Theme (CSS/SASS)

### Examples
Check out the **[Examples](https://github.com/6pac/SlickGrid/wiki/Examples)** Wiki for a full list of examples demonstrating new features and use cases, such as dynamic grid creation and editors with third party controls.

Also check out the [Wiki](https://github.com/6pac/SlickGrid/wiki) for news and documentation.

_For a basic TypeScript example, take a look at the v5.0 Annoucement & Migration guide shown below._

### Contributions
See [Contributing Guide](https://github.com/6pac/SlickGrid/blob/master/CONTRIBUTING.md)

### E2E Tests with Cypress
We have started to add E2E (end to end) tests in the browser by using [Cypress](https://www.cypress.io/). You can see [here](https://github.com/6pac/SlickGrid/tree/next/cypress/e2e) the list of Examples that now have E2E tests. We also added these tests to the [GitHub Actions](https://github.com/features/actions) Workflow (CI) to automate certain steps while also making sure that any new commits aren't breaking the build/tests. The concept is that it automatically runs all the E2E tests every time someone pushes a Commit or a Pull Request. We currently have tests for over 20+ examples with almost 300 tests.

We welcome any new contributions (tests or fixes) and if you wish to add Cypress E2E tests, all you need to do is to clone the repo and run the following commands
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
| 5.x       | [Announcing v5.0](https://github.com/6pac/SlickGrid/wiki/Major-version-5.0-%E2%80%90-ES6-ESM-and-TypeScript-Support) | project modernization, added TypeScript with ES6, ESM builds and added a new Alpine Theme |

### Quick Little Fun Survey ✨
We are conducting a small little poll for fun, it is a single question survey about our latest releases. Thanks for taking the time to participate.

**[What do you think was the most exciting change(s) for you?](https://github.com/6pac/SlickGrid/discussions/853)**
