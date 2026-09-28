// Internal link checker for the docs.
// Validates every markdown link that starts with "/": the target page must exist,
// and a #anchor into a reference AREA page must match a real generated entry id
// (mirrors the id scheme in ReferenceArea.vue). Catches dead deep-links that the
// VitePress build cannot, because reference anchors are rendered by a component.
//
// Usage: node tools/check-links.mjs   (exit 1 if problems)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(dirname(dirname(HERE)), 'docs');
const api = JSON.parse(readFileSync(join(DOCS_ROOT, 'data', 'api.json'), 'utf8'));

function methodGroupSecIds(methods) {
  const order = []; const seen = new Set();
  for (const m of methods) { const g = m.group || 'Other'; if (!seen.has(g)) { seen.add(g); order.push(g); } }
  return order.map((_, i) => `sec-mg-${i}`);
}
const classAnchors = (cls) => [
  ...(cls.events || []).map((e) => `${cls.name}-evt-${e.name}`),
  ...(cls.methods || []).map((m) => `${cls.name}-m-${m.name}`),
];
const ifaceAnchors = (iface) => (iface.properties || []).map((p) => `${iface.name}-${p.name}`);

const anchors = {
  grid: new Set(['sec-options', 'sec-events', ...api.gridOptions.map((o) => 'opt-' + o.name), ...api.gridEvents.map((e) => 'evt-' + e.name), ...api.gridMethods.map((m) => 'm-' + m.name), ...methodGroupSecIds(api.gridMethods)]),
  dataview: new Set(['sec-options', 'sec-events', ...api.dataViewOptions.map((o) => 'dvopt-' + o.name), ...api.dataViewEvents.map((e) => 'evt-' + e.name), ...api.dataViewMethods.map((m) => 'm-' + m.name), ...methodGroupSecIds(api.dataViewMethods)]),
  column: new Set(['sec-props', ...api.columns.map((c) => 'col-' + c.name)]),
  editors: new Set([...(api.modules?.editors?.registry || []).map((n) => 'reg-' + n), ...(api.modules?.editors?.classes || []).flatMap(classAnchors)]),
  formatters: new Set([...(api.modules?.formatters?.registry || []).map((n) => 'reg-' + n), ...(api.modules?.formatters?.classes || []).flatMap(classAnchors)]),
  core: new Set([...(api.modules?.core?.classes || []).flatMap(classAnchors), ...Object.keys(api.modules?.enums || {}).map((n) => 'enum-' + n), 'sec-enums']),
  plugins: new Set((api.modules?.plugins || []).flatMap((m) => [...(m.interfaces || []).flatMap(ifaceAnchors), ...(m.classes || []).flatMap(classAnchors)])),
  controls: new Set((api.modules?.controls || []).flatMap((m) => [...(m.interfaces || []).flatMap(ifaceAnchors), ...(m.classes || []).flatMap(classAnchors)])),
};
const referenceAreas = new Set(Object.keys(anchors));

function walk(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    if (f.startsWith('.') || f === 'node_modules') continue;
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (f.endsWith('.md')) out.push(p);
  }
  return out;
}

function pageExists(routePath) {
  let rel = routePath.replace(/^\//, '');
  if (rel === '' || rel.endsWith('/')) rel += 'index';
  return existsSync(join(DOCS_ROOT, rel + '.md'));
}

const problems = [];
let checked = 0;
const linkRe = /\]\((\/[^)\s]*)\)/g;
for (const file of walk(DOCS_ROOT)) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = linkRe.exec(text))) {
    checked++;
    const [path, anchor] = m[1].split('#');
    if (!pageExists(path)) { problems.push({ file, link: m[1], issue: 'missing page' }); continue; }
    if (anchor) {
      const seg = path.replace(/^\//, '').split('/');
      if (seg[0] === 'reference' && referenceAreas.has(seg[1]) && !anchors[seg[1]].has(anchor)) {
        problems.push({ file, link: m[1], issue: 'unknown anchor' });
      }
    }
  }
}

const rel = (f) => f.replace(DOCS_ROOT + '\\', '').replace(DOCS_ROOT + '/', '').replace(/\\/g, '/');
console.log(`Checked ${checked} internal links across ${walk(DOCS_ROOT).length} pages.`);
if (!problems.length) console.log('All internal links OK.');
else {
  console.log(`${problems.length} link problem(s):`);
  for (const p of problems) console.log(`  [${p.issue}] ${rel(p.file)} -> ${p.link}`);
  process.exit(1);
}
