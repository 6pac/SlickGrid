---
name: slickgrid-v6-migration
description: Migrate standalone 6pac/SlickGrid applications to v6, including IIFE and ESM integrations, grid options, plugins, styles, and tests. Use when upgrading SlickGrid to v6; do not use for SlickGrid Universal framework wrappers.
---

# Migrate SlickGrid to v6

Read the [v6 migration guide](https://6pac.github.io/SlickGrid/in-depth/migration-v6) before changing an application. In a SlickGrid checkout, the guide is `docs/in-depth/migration-v6.md`; it is the source of truth for detailed mappings and examples. The release is upcoming, so confirm that the target v6 version contains each referenced change. For applications older than v5, check earlier migrations first.

Inspect the application's dependencies, script tags or imports, grid and column options, plugins, saved configurations, styles, and tests. Apply only relevant changes and preserve existing behavior. SlickGrid standalone supports IIFE and ESM; it does not provide SlickGrid Universal's services or framework wrappers. Preserve the application's module format and explicitly loaded plugins.

## Migration decisions

- Remove SortableJS imports, script tags, and global assignments. Column reordering and draggable grouping use native drag and drop.
- Replace frozen panes with `pinning`: `frozenColumn: N` becomes `pinning: { columns: { left: N } }` with the same boundary, now counting visible columns. Convert `frozenRow: N` to `pinning.rows.top` with indexes `0` through `N - 1`; with `frozenBottom`, use the relevant last-row indexes in `pinning.rows.bottom`. Migrate saved settings too. Do not enable sticky docking unless requested.
- Keep columns in the array and use `hidden` to hide them. `getColumns()` includes hidden columns; use `getVisibleColumns()` when only visible ones are wanted.
- External clipboard operations use the async Clipboard API. Preserve application-provided overrides when needed, and account for secure-context and permission requirements.
- Remove `inlineFilters`, `useCSPSafeFilter`, and `rowTopOffsetRenderType`. Follow the guide for removed DataView methods, menu option renames, column picker options, and the `fastSort()` replacement.
- Update custom pane selectors for the single viewport and Row Detail selectors to `.slick-row-detail-container` or `.row-detail-{id}`. Ordinary rows use transforms; RowSpan rows retain internal top positioning. Preserve application styles and check its DOM-dependent tests.
- Replace removed `onBeforeAppendCell` subscriptions with formatter `addClasses` output. Plain strings without `<` or `&` bypass the sanitizer; do not use a sanitizer as a general plain-text transformation.
- Review grid menu slot sizing, renamed Alpine Sass/CSS variables, and content autosizing sampling where the application relies on those behaviors.
- For accessibility, review ARIA row indexes and counts, formatter HTML comparisons, and custom labels. Built-in editor columns accept `editorAriaLabel`; Checkbox Select Column accepts `rowAriaLabel` and `selectAllAriaLabel`; header button items accept `ariaLabel`. False checkmark output is now an element labeled `No`, not an empty string.

## Validate

Search for removed options, imports, CSS selectors, callbacks, and persisted configurations. Run the application's relevant type checks and focused tests, then exercise the migrated features in its actual IIFE or ESM build. Report unresolved mappings and checks that could not be run; do not claim accessibility conformance without appropriate assistive-technology testing.
