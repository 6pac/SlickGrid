---
title: What is SlickGrid
---

# What is SlickGrid?

SlickGrid is a data grid toolkit. You build the grid you need from small parts. It is not a finished, one-size widget.

## Why it is fast

SlickGrid uses virtual rendering. It keeps only the visible rows and cells in the DOM. It can show hundreds of thousands of rows without slowing down.

## What you get

- A grid that scrolls, sorts, and edits.
- Columns you define as plain objects.
- A data source: a simple array, or a `SlickDataView` for sorting, filtering, paging, and grouping.
- Options to control behaviour.
- Events to react to user actions.
- Plugins, editors, and formatters to extend the grid.

## Dependency-light

Version 6 has no jQuery and no jQuery UI. Column reordering uses native browser drag and drop. You import small ES modules and add only the parts you use.

## When to use it

Use SlickGrid for large datasets, spreadsheet-like editing, or custom cell rendering. For a handful of rows with simple needs, a plain HTML table may be enough.

## The main pieces

The grid, the columns, a data source, the options, the events, and any plugins. The next pages introduce each one.
