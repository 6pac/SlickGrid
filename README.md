[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![NPM downloads](https://img.shields.io/npm/dm/slickgrid.svg)](https://npmjs.org/package/slickgrid)
[![npm](https://img.shields.io/npm/v/slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://npmjs.org/package/slickgrid)
[![Actions Status](https://github.com/6pac/SlickGrid/workflows/CI%20Build/badge.svg)](https://github.com/6pac/SlickGrid/actions)

## This is the 6pac SlickGrid repo

Check out the NEW SlickGrid Website! http://slickgrid.net/

This is the acknowledged most active non-customised fork of SlickGrid.

It aims to be a viable alternative master repo, building on the legacy of the mleibman/SlickGrid master branch, keeping libraries up to date and applying small, safe core patches and enhancements without turning into a personalised build.

Check out the **[Examples](https://github.com/6pac/SlickGrid/wiki/Examples)** for examples demonstrating new features and use cases, such as dynamic grid creation and editors with third party controls.

Also check out the [Wiki](https://github.com/6pac/SlickGrid/wiki) for news and documentation.

### E2E Tests with Cypress
We are now starting to add E2E (end to end) tests in the browser with [Cypress](https://www.cypress.io/). You can see [here](https://github.com/6pac/SlickGrid/tree/master/cypress/integration) the list of Examples that now have E2E tests. We also added these tests to the [GitHub Actions](https://github.com/features/actions) Workflow to automate certain steps while making sure any new commits aren't breaking the build/test. It will basically run all the E2E tests every time someone pushes a Commit or a Pull Request.

We also welcome any new contributions (tests or fixes) and if you wish to add Cypress E2E tests, all you need to do is to clone the repo and then run the following commands
```bash
npm install         # install all npm packages
npm run serve       # run a local http server on port 8080
npm run cypress     # open Cypress tool
```
Once the Cypress UI is open, you can then click on "Run all Specs" to execute all E2E browser tests.

## SlickGrid 3.x drops jQueryUI requirement

Great news we no longer require [jQueryUI](https://jqueryui.com/) in SlickGrid 3.0.0, we removed all associated code and replaced it with [SortableJS](https://sortablejs.github.io/Sortable/) which is a lot more modern and touch friendly. Please read [SlickGrid 3.0 - Annoucement & Migration](https://github.com/6pac/SlickGrid/wiki/Major-version-3.0----Removal-of-jQueryUI-requirement-(replaced-by-SortableJS)) Wiki for more info.