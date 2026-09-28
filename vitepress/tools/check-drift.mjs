// Documentation drift gate.
// Regenerates api.json from the current source, then fails (in --strict) when a
// PUBLIC option/column/event/method has no JSDoc description and is not already
// in the known-gaps baseline. This is what stops new API from shipping
// undocumented, the way the old wiki silently rotted.
//
// Usage:
//   node tools/check-drift.mjs                 # report only (exit 0)
//   node tools/check-drift.mjs --strict        # exit 1 if NEW undocumented symbols
//   node tools/check-drift.mjs --update-baseline

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(dirname(dirname(HERE)), 'docs');
const strict = process.argv.includes('--strict');
const updateBaseline = process.argv.includes('--update-baseline');

execFileSync(process.execPath, [join(HERE, 'extract-api.mjs')], { stdio: 'inherit' });
const api = JSON.parse(readFileSync(join(DOCS_ROOT, 'data', 'api.json'), 'utf8'));

let overlays = {};
try { overlays = JSON.parse(readFileSync(join(DOCS_ROOT, 'data', 'overlays.json'), 'utf8')); } catch { /* noop */ }
const OV_KEY = {
  gridOption: (n) => `grid:opt-${n}`,
  gridMethod: (n) => `grid:m-${n}`,
  gridEvent: (n) => `grid:evt-${n}`,
  column: (n) => `column:col-${n}`,
  dataViewOption: (n) => `dataview:dvopt-${n}`,
  dataViewMethod: (n) => `dataview:m-${n}`,
  dataViewEvent: (n) => `dataview:evt-${n}`,
};
const hasOverlay = (area, n) => { const k = OV_KEY[area]?.(n); const o = k && overlays[k]; return !!(o && (o.notes || o.example)); };
// A symbol counts as documented if it has a JSDoc description OR a reference overlay.
const collect = (area, arr) => (arr || []).filter((x) => !(x.description || '').trim() && !hasOverlay(area, x.name)).map((x) => `${area}:${x.name}`);
const gaps = [
  ...collect('gridOption', api.gridOptions),
  ...collect('gridMethod', api.gridMethods),
  ...collect('gridEvent', api.gridEvents),
  ...collect('column', api.columns),
  ...collect('dataViewOption', api.dataViewOptions),
  ...collect('dataViewMethod', api.dataViewMethods),
  ...collect('dataViewEvent', api.dataViewEvents),
].sort();

const baselinePath = join(HERE, 'gaps-baseline.json');
if (updateBaseline || !existsSync(baselinePath)) {
  writeFileSync(baselinePath, JSON.stringify(gaps, null, 2) + '\n');
  console.log(`Wrote baseline with ${gaps.length} known-undocumented symbols: ${baselinePath}`);
  process.exit(0);
}

const baseline = new Set(JSON.parse(readFileSync(baselinePath, 'utf8')));
const novel = gaps.filter((g) => !baseline.has(g));
console.log(`Undocumented public symbols: ${gaps.length} (baseline ${baseline.size}); new this run: ${novel.length}`);
if (novel.length) {
  console.log('\nNEW undocumented public symbols — add a JSDoc comment in the source (or a reference overlay):');
  for (const n of novel) console.log('  - ' + n);
  if (strict) process.exit(1);
}
