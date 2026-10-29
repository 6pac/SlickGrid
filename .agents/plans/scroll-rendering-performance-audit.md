# Scroll rendering performance audit

Audit date: 2026-10-22. Port validated: 2026-10-23.

Status: resolved by porting the applicable parts of
https://github.com/ghiscoding/slickgrid-universal/pull/2852. Large vertical jumps render
synchronously by default (`scrollRenderThrottling: 0`; a positive value opts back into the
timer and can also be changed later through `setOptions()`), the per-cell `onBeforeAppendCell`
event is removed in favour of the formatter `addClasses` result, plain strings skip the
sanitizer and HTML parser, and `getParentRowSpanByCell()` no longer allocates for columns
without a rowspan. The fork's Tempo date fast path, services, framework wrappers and date
warnings do not apply to this repository.

An earlier attempt (native wheel default action, an animation-frame fallback for throttled
renders, an RTL visible-range fix) was rolled back before the port and none of it is in the
code. The RTL range mirroring it found — the visible range is mirrored against the canvas width
although column positions already use inline-start coordinates — is still a candidate for a
separate correctness change.

## Port validation — 2026-10-23

The applicable port is complete. No Tempo, date-service, framework-wrapper, wheel,
RTL-range or additional frame-scheduling changes are included. Positive throttle
values retain the timer path; the default `0` bypasses that path for vertical renders.
The migration guide documents the event removal and the sanitizer semantics.

- `npm run build`: passed, including lint and declaration generation.
- API extraction and `npm run drift --prefix vitepress`: passed; no newly undocumented symbols.
- Targeted Cypress checks: 138 passed across 10 specs, including five new regressions.
- Full Cypress run: 89 specs, 779 passed, one failed, one pending. The failure was
  the `translateY(150px)` selector in the many-column rowspan spec.
- That spec was rerun separately against an unmodified HEAD grid build and against
  the port: all 46 tests passed in both runs. Treat the full-run result as transient,
  not evidence of a confirmed port regression or a completely green full run.
- New tests verify synchronous row/cell geometry at 50K and 500K, opt-in throttling
  (at construction and through `setOptions()`), plain text bypassing sanitization,
  entity decoding and HTML sanitization, formatter classes, and the removed event surface.
- `git diff --check`: passed. Generated `dist/` output is excluded from the change.

These checks establish the port's tested behavior; they do not establish a universal
absence of compositor blanking or transfer the fork's Tempo-related speedup to this
repository. No new before/after performance percentage is claimed here.

## Baseline audit — 2026-10-22

The audit investigated white blanking during fast mouse-wheel scrolling with 50K–500K rows
and assessed removing `scrollRenderThrottling` or defaulting it to `0` for the next major
version, comparing this implementation with the audit supplied from another SlickGrid fork.

Its recommendation at the time was to keep the `10` ms default pending further evidence. The
controlled scroll-jump test below (missing visible rows with `10`, none with `0` or synchronous
rendering) together with the fork's measurements led to the port above instead. Browser wheel
tests of the requested examples did not reproduce the reported seconds-long blanking.

The ordinary-grid wheel path still renders redundantly: a temporary experiment reduced 180
renders to 90 for 90 wheel inputs. This confirms redundant work but does not establish a
proportional reduction in rendering time or prove that it causes the reported blanking.

### Implementation at audit time

Source references are to `src/slick.grid.ts` as of the audit date; the throttle rows describe
the behaviour before the port.

| Area | Finding |
| --- | --- |
| Throttle initialization, line 762 | The constructor binds `render()` and captures the configured throttle period. `setOptions()` did not rebuild this throttle (it does since the port). Use fresh grids for comparisons. |
| `actionThrottle()`, line 4711 | Leading execution is immediate; blocked calls queue a trailing execution. The timer starts **before** rendering. The cycle is not necessarily render time plus the configured delay. |
| `_handleScroll()`, line 7034 | Once rendering thresholds are crossed, smaller vertical movements render synchronously. Large vertical jumps used the throttle unless `forceSyncScrolling` was enabled. Distances for this decision are measured from the last rendered position. |
| Horizontal scrolling, line 11175 | Horizontal movement uses a separate animation-frame render queue. Changing `scrollRenderThrottling` does not remove this scheduling. The horizontal branch precedes the synchronous-scrolling branch. |
| `handleMouseWheel()`, line 4389 | Ordinary grids update their position in the wheel handler and also allow the browser's default wheel movement. This can cause a second render. Docking grids prevent the default movement. |
| `getFormatter()`, line 3720 | Row metadata is still retrieved when resolving each cell's formatter. |
| Cell CSS classes, line 5635 | Classes are already indexed through `cellCssClassesByCell[row]?.[column.id]`; the other fork's per-cell `Object.keys()` criticism does not apply here. |
| `renderRows()`, line 6677 | Cached rows are retained when they remain in range. Scrolling does not unconditionally rebuild every row. |

Before the port, a throttle of `0` only shortened the leading/trailing timer; since the port
it bypasses the timer entirely for vertical renders. `forceSyncScrolling` remains a separate
vertical-scroll comparison for positive throttle values.

### Measurement method and limitations

- Runtime: Linux, Cypress 15.21.1's Electron 37.6.0 / Chromium 138.0.7204.251,
  controlled through the Chrome DevTools Protocol.
- Current TypeScript source was bundled into a temporary directory with esbuild. Styles were
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
  a physical mouse or trackpad's event timing. The reporter's browser and exact input
  device remain unconfirmed.
- The reported seconds-long blanking was **not reproduced**.
- The diagnostic scripts were not kept; the tables below are the record of the runs.

### Plain-grid scroll-jump results

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

### Requested examples: browser wheel results

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

### Temporary native-wheel experiment

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

### Corrections to the supplied fork audit

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
   lookup remains a candidate with no speedup measured here. The per-cell event
   dispatch was removed by the port on the strength of the fork's own profile, not a
   measurement in this repository.
6. **Moving cleanup after append is not a demonstrated visual fix.** Both occur
   within the synchronous render operation; changing their order alone does not
   establish an intervening paint opportunity.
7. **Row recycling remains a larger design change.** Node identity, active editors,
   async post-render cleanup, plugins, spans, and horizontal virtualization need
   explicit compatibility work. It is not justified as the first change by these
   measurements.

## Open follow-ups

1. Reproduce the reported fast-wheel blanking on the actual browser/device, recording
   a browser performance trace and visual evidence. Separate render scheduling,
   JavaScript work, style/layout, paint, and garbage collection.
2. Prototype eliminating redundant ordinary-grid wheel updates while preserving
   required event behavior and docking synchronization. Verify mouse/trackpad,
   horizontal and Shift-wheel input, RTL, scroll boundaries, nested scrolling,
   virtual-page transitions, and existing wheel regressions.
3. Measure total rendering work and input-to-paint latency, not just render count
   or median time per call. Add regression coverage for any confirmed bug.
4. Fix the RTL visible-range mirroring noted above as its own correctness change,
   with coverage for wide RTL grids.
