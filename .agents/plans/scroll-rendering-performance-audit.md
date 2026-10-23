# Scroll rendering performance audit

Date: 2026-10-22

Status: superseded by the user's request to port https://github.com/ghiscoding/slickgrid-universal/pull/2852.
The previous wheel, RTL and animation-frame changes and their tests were rolled back.
The historical implementation follow-up below describes the abandoned attempt, not the current code.
Its full suite ended with 783 passing, one failing and one pending test; it did not establish the requested UX outcome.
The port covers synchronous vertical rendering by default, removal of onBeforeAppendCell,
plain-text rendering and empty rowspan lookup. Tempo, services, framework wrappers and date warnings
do not apply here. The RTL fix is a candidate for a separate correctness change; none of the abandoned
implementation is retained in this port.

The initial audit
below is retained as the baseline; the implementation follow-up records later work.

## Final PR 2852 port validation — 2026-10-23

The applicable port is complete. No Tempo, date-service, framework-wrapper, wheel,
RTL-range or additional frame-scheduling changes are included. Positive throttle
values retain the timer path; the new default `0` explicitly bypasses that path for
vertical renders. The migration guide documents event removal and sanitizer semantics.

- `npm run build:prod`: passed, including lint and declaration generation.
- API extraction and `npm run drift --prefix vitepress`: passed; no newly undocumented symbols.
- Targeted Cypress checks: 138 passed across 10 specs, including five new regressions.
- Full Cypress run: 89 specs, 779 passed, one failed, one pending. The failure was
  the `translateY(150px)` selector in the many-column rowspan spec.
- That spec was rerun separately against an unmodified HEAD grid build and against
  the port: all 46 tests passed in both runs. Treat the full-run result as transient,
  not evidence of a confirmed port regression or a completely green full run.
- New tests verify synchronous row/cell geometry at 50K and 500K, opt-in throttling,
  plain text bypassing sanitization, entity decoding and HTML sanitization, formatter
  classes, and the removed event surface.
- `git diff --check`: passed. Generated `dist/` output is excluded from the change.

These checks establish the port's tested behavior; they do not establish a universal
absence of compositor blanking or transfer the fork's Tempo-related speedup to this
repository. No new before/after performance percentage is claimed here.

## Abandoned implementation follow-up (rolled back)

The user reported prior row/cell alignment problems with throttle values below
10 ms. Preserve `scrollRenderThrottling: 10` and its numeric semantics; lowering the
default is not an accepted solution. The requested outcome is less work during
scrolling and no missing visible rows, with explicit alignment regression checks.

Implemented against baseline commit `58d6a3716`:

- Modern wheel events on ordinary grids now use the native scroll default action,
  avoiding an intermediate movement/render. Docking forwarding and legacy wheel
  support remain. Canceled wheel input is respected.
- Large vertical jumps still use the existing throttle. If a throttled request
  leaves visible rows missing, it also queues a render on the shared animation-frame
  scheduler. Bursts use the latest position, and an actual render cancels pending
  timer work and the pending frame so neither renders the same position again.
- Wide RTL grids had an independent, pre-existing missing-cell bug: the visible
  range mirrored coordinates against canvas width even though column positions
  already use inline-start coordinates. Normalize negative native RTL scrollLeft
  to the column coordinate system instead.
- Added `cypress/e2e/quirk-fast-scroll-rendering.cy.ts`. The existing fractional-height
  wheel regression now explicitly exercises the legacy event; the new spec uses
  real browser wheel input for modern scrolling.
- Updated `docs/in-depth/performance.md` and option documentation. Modern ordinary
  wheel movement now reports `onScroll.triggeredBy: 'scroll'`, and synthetic modern
  wheel events do not scroll because they cannot invoke a native default action.

The focused tests were first run against the unchanged implementation: they caught
missing rows at the next frame, an extra render after explicit rendering, ignored
wheel cancellation, 925 px movement for a 900 px native wheel input, and missing RTL
cells. The first 15 focused checks passed with the fixes; additional RTL coverage,
the full suite, cross-browser checks, and isolated performance comparisons follow.

Test environment notes: the local installation contained TypeScript 7 despite the
project's TypeScript 6 dependency and lacked top-level ESLint parser/plugin links.
Local dependency resolution was repaired using already-installed packages; no
manifest or lockfile changes were needed. Electron's headless/occluded windows
stalled animation frames on this host, so frame-sensitive checks run headed and
separately from the benchmark browser. Do not interpret runner timeouts as measured
grid render duration or include concurrent browser/build activity in final timing
comparisons.

## Objective and recommendation

Investigate white blanking during fast mouse-wheel scrolling with 50K–500K rows,
and assess removing `scrollRenderThrottling` or setting it to `0` for the next major
version. Compare the current implementation with the supplied audit from another
SlickGrid fork.

Keep the option and current default pending further evidence. Testing `0` at grid
construction is worthwhile: a controlled scroll-jump test found missing visible
rows with `10` but not with `0` or synchronous scrolling. Browser wheel tests of
the requested examples did not reproduce the reported seconds-long blanking.

Prioritize investigating redundant rendering in the ordinary-grid wheel path.
A temporary experiment reduced 180 renders to 90 for 90 wheel inputs. This confirms
redundant work, but does not establish a proportional reduction in rendering time
or prove that it causes the reported blanking.

## Current implementation

Source references are to `src/slick.grid.ts`; line numbers reflect the audit date.

| Area | Finding |
| --- | --- |
| Throttle initialization, line 762 | The constructor binds `render()` and captures the configured throttle period. `setOptions()` does not rebuild this throttle. Use fresh grids for comparisons. |
| `actionThrottle()`, line 4711 | Leading execution is immediate; blocked calls queue a trailing execution. The timer starts **before** rendering. The cycle is not necessarily render time plus the configured delay. |
| `_handleScroll()`, line 7034 | Once rendering thresholds are crossed, smaller vertical movements render synchronously. Large vertical jumps use the throttle unless `forceSyncScrolling` is enabled. Distances for this decision are measured from the last rendered position. |
| Horizontal scrolling, line 11175 | Horizontal movement uses a separate animation-frame render queue. Changing `scrollRenderThrottling` does not remove this scheduling. The horizontal branch precedes the synchronous-scrolling branch. |
| `handleMouseWheel()`, line 4389 | Ordinary grids update their position in the wheel handler and also allow the browser's default wheel movement. This can cause a second render. Docking grids prevent the default movement. |
| `getFormatter()`, line 3720 | Row metadata is still retrieved when resolving each cell's formatter. |
| Cell CSS classes, line 5635 | Classes are already indexed through `cellCssClassesByCell[row]?.[column.id]`; the other fork's per-cell `Object.keys()` criticism does not apply here. |
| `renderRows()`, line 6677 | Cached rows are retained when they remain in range. Scrolling does not unconditionally rebuild every row. |

Setting the throttle to `0` retains its leading/trailing timer implementation; it
does not mean animation-frame scheduling or unconditional synchronous execution.
`forceSyncScrolling` provides a separate vertical-scroll comparison.

## Measurement method and limitations

- Runtime: Linux, Cypress 15.21.1's Electron 37.6.0 / Chromium 138.0.7204.251,
  controlled through the Chrome DevTools Protocol.
- Current TypeScript source was bundled into `/tmp` with esbuild. Styles were
  compiled there from source. No generated `dist/` files or production files were
  changed during the investigation.
- Example tests used temporary copies of `example-grouping-esm.html` and
  `example4-model-esm.html`, loading the source bundle and compiled styles.
  Column reordering was disabled and external assets were removed to keep the
  tests local. These were instrumented copies, not untouched hosted pages.
- Each mode used a fresh grid. Wrappers measured synchronous `render()` duration,
  scroll-handler duration, throttle calls, and DataView refresh calls. The plain
  grid's throttle was reconstructed with the same implementation and period so
  its bound render action could be timed.
- A `requestAnimationFrame` sampler checked whether visible rows had connected
  cached DOM nodes. This detects missing rows at sampling time, not actual painted
  frames, rasterization delays, or every possible visual defect.
- Results are single-run diagnostics, with instrumentation overhead, fixed mode
  ordering, and no statistical performance claim. They do not establish FPS or
  end-to-end input-to-paint latency.
- Programmatic scrolling and protocol-injected wheel input do not fully reproduce
  a physical mouse or trackpad's event timing. The user's browser and exact input
  device remain unconfirmed.
- The reported seconds-long blanking was **not reproduced**.

## Plain-grid scroll-jump results

Setup: 1000 × 600 px grid, 25 px rows, 30 columns of 100 px, simple text cells,
plain arrays containing either 50K or 500K records. Each run performed 180 scroll
jumps, using 1500 px every third jump and 900 px otherwise, explicitly invoking the
scroll handler and requesting a 4 ms timer delay between jumps. Actual intervals
also include rendering and browser scheduling.

All modes rendered 180 times and ended with 51 cached rows / 1071 cells.

| Rows | Mode | Render median (ms) | Render p95 (ms) | Samples with missing rows / total |
| --- | --- | ---: | ---: | ---: |
| 50K | Throttle 10 | 6.6 | 10.0 | 64 / 193 |
| 50K | Throttle 0 | 7.2 | 10.2 | 0 / 196 |
| 50K | Force synchronous | 7.4 | 10.8 | 0 / 191 |
| 500K | Throttle 10 | 7.2 | 10.4 | 69 / 192 |
| 500K | Throttle 0 | 7.5 | 10.6 | 0 / 200 |
| 500K | Force synchronous | 9.4 | 11.6 | 0 / 196 |

Interpretation: scheduling contributed to missing visible rows in this workload.
The results do not support dismissing scheduling as irrelevant, or attributing
all blanking to formatter/DOM cost. They also do not prove that `0` eliminates
visible blanking during real-world wheel scrolling.

## Requested examples: browser wheel results

The Grouping example loaded 500K data records using its button, with its default
duration grouping active, producing 500,062 displayed rows including group and
total rows. The Model example contained 50K records. Both used 28 px rows.

Each run received 90 protocol-injected browser wheel inputs: 1500 px every third
input and 900 px otherwise, awaiting dispatch and then an additional 8 ms delay.
Sampling continued for 200 ms after input stopped. Protocol dispatch can pace
input, so this is not equivalent to a guaranteed 125 Hz physical wheel stream.

| Example | Mode | Render calls | Render median (ms) | Render p95 (ms) | Samples with missing rows / total |
| --- | --- | ---: | ---: | ---: | ---: |
| Grouping 500K | Throttle 10 | 180 | 3.3 | 6.7 | 0 / 282 |
| Grouping 500K | Throttle 0 | 180 | 2.9 | 5.9 | 0 / 282 |
| Grouping 500K | Force synchronous | 180 | 3.0 | 5.8 | 0 / 282 |
| Model 50K | Throttle 10 | 180 | 2.3 | 5.6 | 0 / 280 |
| Model 50K | Throttle 0 | 180 | 2.6 | 6.4 | 0 / 281 |
| Model 50K | Force synchronous | 180 | 2.3 | 6.5 | 0 / 280 |

All runs recorded zero DataView refresh calls during the measured scrolling.
The largest measured synchronous render was 16.8 ms. These tests provide no
evidence that grouping/filter recalculation caused a scrolling stall.

## Temporary native-wheel experiment

For the same ordinary-grid examples, a temporary prototype override made
`handleMouseWheel()` a no-op, leaving movement to the browser and rendering to
native scroll events. This was a diagnostic experiment, **not a production fix**.

| Example | Throttle | Render calls | Render median (ms) | Render p95 (ms) | Samples with missing rows / total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Grouping 500K | 10 | 90 | 4.5 | 8.1 | 0 / 275 |
| Grouping 500K | 0 | 90 | 4.4 | 9.2 | 0 / 263 |
| Model 50K | 10 | 90 | 4.4 | 7.7 | 0 / 267 |
| Model 50K | 0 | 90 | 4.4 | 6.0 | 0 / 263 |

Scroll-handler calls dropped from 270 to 90. Final scroll position changed from
101,520 px to 99,000 px for the same input sequence, consistent with removing the
handler's additional movement. Zero DataView refreshes were recorded.

Fewer render calls do not mean proportionally less work: the original path mixes
small intermediate updates and larger updates. A production change must preserve
intended scrolling, event, boundary, and propagation behavior. Docking, horizontal
scrolling, RTL, and different wheel delta modes were not covered by this override.

## Corrections to the supplied fork audit

1. **Virtual paging is conditional.** The measured CSS height cap was 16,000,000 px,
   and every tested grid had one virtual page. The Grouping example's roughly
   14 million px content height did not engage page compression. This conclusion
   is browser- and row-height-dependent; do not assume a universal row cutoff.
2. **Throttle timing differs.** The timer starts before the render in this branch,
   invalidating a blanket `render time + throttle period` calculation.
3. **Animation frames are not a paint guarantee.** `requestAnimationFrame` callbacks
   execute before repaint, not after paint. Expensive callbacks can delay painting;
   replacing timers alone does not make expensive rendering cheap. See
   [MDN's requestAnimationFrame documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
4. **Cell CSS lookup is already optimized.** The suggested empty-hash fast path
   addresses code that is no longer present in this branch's cell construction.
5. **Metadata/event optimizations need measurement.** Repeated formatter metadata
   lookup and per-cell event dispatch remain candidates, but no specific speedup
   was measured. Any subscriber fast path must preserve optional PubSub delivery.
6. **Moving cleanup after append is not a demonstrated visual fix.** Both occur
   within the synchronous render operation; changing their order alone does not
   establish an intervening paint opportunity.
7. **Row recycling remains a larger design change.** Node identity, active editors,
   async post-render cleanup, plugins, spans, and horizontal virtualization need
   explicit compatibility work. It is not justified as the first change by these
   measurements.

## Recommended next steps

1. Reproduce the user's fast-wheel blanking on the actual browser/device, recording
   a browser performance trace and visual evidence. Separate render scheduling,
   JavaScript work, style/layout, paint, and garbage collection.
2. Compare freshly constructed grids with throttle `10`, throttle `0`, and
   `forceSyncScrolling: true`. Keep viewport, data, formatters, and input comparable.
3. Prototype eliminating redundant ordinary-grid wheel updates while preserving
   required event behavior and docking synchronization. Verify mouse/trackpad,
   horizontal and Shift-wheel input, RTL, scroll boundaries, nested scrolling,
   virtual-page transitions, and existing wheel regressions.
4. Measure total rendering work and input-to-paint latency, not just render count
   or median time per call. Add regression coverage for any confirmed bug.
5. Consider supporting runtime throttle changes separately: the current
   `setOptions()` behavior can mislead callers and A/B tests.
6. Only then decide whether changing the default or introducing another scheduler
   is warranted. Preserve `0` semantics; do not silently reinterpret it as rAF.

## Session artifacts

The tables above preserve the findings independently of temporary files. Raw
results and diagnostic scripts were saved under `/tmp` and may disappear after
cleanup or reboot:

- `/tmp/slick-scroll-audit-results.json` — plain-grid comparisons.
- `/tmp/slick-scroll-examples-results.json` — example wheel comparisons.
- `/tmp/slick-scroll-native-experiment-results.json` — native-wheel experiment.
- `/tmp/slick-scroll-audit-build.cjs` — source bundle, CSS, and temporary pages.
- `/tmp/slick-scroll-audit-run.js` and `/tmp/slick-scroll-audit-cdp.cjs` — plain-grid runner.
- `/tmp/slick-scroll-examples-cdp.cjs` — example runner; its final mode list runs the
  native-wheel experiment. The original comparison used `['10', '0', 'sync']`.

These scripts are investigation aids, not a maintained benchmark suite. No library
code or generated distribution changes were made as part of this audit.
