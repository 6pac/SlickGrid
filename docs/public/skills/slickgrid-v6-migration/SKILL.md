---
name: slickgrid-v6-migration
description: Migrate standalone 6pac/SlickGrid applications to v6, including IIFE and ESM integrations, grid options, plugins, styles, and tests. Use when upgrading SlickGrid to v6; do not use for SlickGrid Universal framework wrappers.
---

# Migrate SlickGrid to v6

Read the [v6 migration guide](https://6pac.github.io/SlickGrid/migration/v6) before changing an application. In a SlickGrid checkout, the guide is `docs/migration/v6.md`; it is the source of truth for detailed mappings and examples. It compares 5.20.2 with 6.0.0. For applications older than v5, check earlier migrations first.

Inspect the application's dependencies, script tags or imports, grid and column options, plugins, saved configurations, styles, and tests. Apply only relevant changes and preserve existing behavior. SlickGrid standalone supports IIFE and ESM; it does not provide SlickGrid Universal's services or framework wrappers. Preserve the application's module format and explicitly loaded plugins.

## Migration decisions

Take every mapping, renamed option and code sample from the guide; this skill does not repeat them. Work through the guide section by section and apply only the sections that match what the application uses. In addition:

- Migrate saved or persisted settings (for example stored frozen-pane or column-visibility state) along with the code.
- Do not turn on new behaviour the application did not ask for, such as sticky docking.
- Keep the application's own styles and labels; where a v6 default label is English, keep the application's translated or custom one through the new options the guide lists.
- Expect DOM-dependent tests to change (row positioning, Row Detail selectors, ARIA row indexes, formatter HTML) and update them rather than the behaviour.

## Validate

Search for removed options, imports, CSS selectors, callbacks, and persisted configurations. Run the application's relevant type checks and focused tests, then exercise the migrated features in its actual IIFE or ESM build. Report unresolved mappings and checks that could not be run; do not claim accessibility conformance without appropriate assistive-technology testing.
