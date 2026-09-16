// v6 delta analysis.
// For each open-PR feature branch, materialise its src/ (read-only, via `git show`),
// run the same API extractor against it, and diff the result against master's api.json.
// Produces a Markdown report of every added/removed/changed option, column, event and
// method per topic — the precise "what changes in v6" picture for the affected areas.
//
// Read-only: never checks out, merges, or modifies the repo working tree.
// Usage: node tools/branch-diff.mjs

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = dirname(HERE);
const DOCS_ROOT = dirname(SITE);
// When the site lives in the repo at <repo>/docs, DOCS_ROOT is the repo root.
const REPO = process.env.SLICKGRID_REPO || (existsSync(join(DOCS_ROOT, 'src')) ? DOCS_ROOT : 'G:/Dropbox/Work/SlickGrid/SlickGrid-6pac');
const SCRATCH = process.env.SCRATCH || join(tmpdir(), 'slickgrid-branch-scratch');

const BRANCHES = [
  { slug: 'frozen', ref: 'origin/viewportmgr-phase4', pr: '#1238', topic: 'Frozen columns — 3x3 band model' },
  { slug: 'sortable-reorder', ref: 'origin/refactor/drop-sortablejs', pr: '#1242', topic: 'SortableJS removal — column header reorder' },
  { slug: 'sortable-grouping', ref: 'origin/refactor/drop-sortablejs-grouping', pr: '#1243', topic: 'SortableJS removal — draggable grouping' },
  { slug: 'sortable-dep', ref: 'origin/refactor/remove-sortablejs-dep', pr: '#1244', topic: 'SortableJS removal — drop the dependency' },
  { slug: 'hidden', ref: 'origin/feat/hidden-columns', pr: '#1299', topic: 'Column hidden property + always keep all columns' },
  { slug: 'clipboard', ref: 'origin/feat/modern-clipboard-api', pr: '#1270', topic: 'Async Clipboard API (DRAFT)' },
];

function git(args) { return execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 }); }

try { git(['fetch', 'origin', '--quiet']); console.error('fetched origin'); }
catch (e) { console.error('fetch failed, using local refs:', e.message); }

function materialize(ref, destRoot) {
  let files;
  try { files = git(['ls-tree', '-r', '--name-only', ref, 'src']).split('\n').map((s) => s.trim()).filter(Boolean); }
  catch (e) { return { error: `ls-tree failed: ${e.message}`, count: 0 }; }
  let count = 0;
  for (const f of files) {
    let content;
    try { content = execFileSync('git', ['-C', REPO, 'show', `${ref}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 28 }); }
    catch { continue; }
    const dest = join(destRoot, f);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content, 'utf8');
    count++;
  }
  return { count };
}

function runExtractor(repoRoot, outJson) {
  execFileSync(process.execPath, [join(HERE, 'extract-api.mjs'), repoRoot], { env: { ...process.env, API_OUT: outJson }, stdio: 'pipe' });
  return JSON.parse(readFileSync(outJson, 'utf8'));
}

function indexByName(arr) { const m = new Map(); for (const x of (arr || [])) m.set(x.name, x); return m; }
const norm = (v) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n') : v); // ignore CRLF/LF-only diffs
function diffList(masterArr, branchArr, fields) {
  const mm = indexByName(masterArr), bm = indexByName(branchArr);
  const added = [...bm.keys()].filter((k) => !mm.has(k));
  const removed = [...mm.keys()].filter((k) => !bm.has(k));
  const changed = [];
  for (const k of bm.keys()) {
    if (!mm.has(k)) continue;
    const a = mm.get(k), b = bm.get(k);
    for (const f of fields) {
      if (JSON.stringify(norm(a[f])) !== JSON.stringify(norm(b[f]))) changed.push({ name: k, field: f, from: a[f], to: b[f] });
    }
  }
  return { added, removed, changed };
}

const master = JSON.parse(readFileSync(join(SITE, 'data', 'api.json'), 'utf8'));
const AREAS = [
  ['Grid options', 'gridOptions', ['type', 'default']],
  ['Column properties', 'columns', ['type']],
  ['Grid events', 'gridEvents', ['payload']],
  ['Grid methods', 'gridMethods', ['signature']],
  ['DataView options', 'dataViewOptions', ['type']],
  ['DataView events', 'dataViewEvents', ['payload']],
  ['DataView methods', 'dataViewMethods', ['signature']],
];

let md = `# v6 API deltas\n\n_Generated ${new Date().toISOString()}. Each feature branch's public API is extracted and diffed against master (${master.meta.repo}). Read-only analysis._\n\n> **How to read this.** Each branch was cut at a different point in master's history, so many **Removed** entries are just options master gained *after* the branch (e.g. \`autoHeaderHeight\`, \`rtl\`, \`enableVariableRowHeight\`, \`rowHeightProvider\`, \`autoScrollOnColumnResize\`) — not intentional removals. The reliable signals are the PR-relevant **Added** members and the \`sortablejs in dependencies\` line.\n`;

for (const b of BRANCHES) {
  const dest = join(SCRATCH, b.slug);
  try { rmSync(dest, { recursive: true, force: true }); } catch { /* noop */ }
  md += `\n---\n\n## ${b.topic}\nPR ${b.pr} · \`${b.ref}\`\n`;
  const mat = materialize(b.ref, dest);
  if (mat.error || !mat.count) { md += `\n_Could not read this branch (${mat.error || 'no files'}). It may not exist locally; run \`git fetch\`._\n`; console.error(b.slug, 'skip:', mat.error || 'no files'); continue; }
  let api;
  try { api = runExtractor(dest, join(SCRATCH, `${b.slug}.api.json`)); }
  catch (e) { md += `\n_Extractor failed: ${e.message}_\n`; console.error(b.slug, 'extractor failed'); continue; }
  try { const pj = execFileSync('git', ['-C', REPO, 'show', `${b.ref}:package.json`], { encoding: 'utf8' }); md += `\nsortablejs in dependencies: **${/"sortablejs"\s*:/.test(pj) ? 'YES' : 'NO'}**\n`; } catch { /* noop */ }
  let any = false;
  for (const [label, key, fields] of AREAS) {
    const d = diffList(master[key], api[key], fields);
    if (!d.added.length && !d.removed.length && !d.changed.length) continue;
    any = true;
    md += `\n### ${label}\n`;
    if (d.added.length) md += `- **Added (${d.added.length}):** ${d.added.map((x) => `\`${x}\``).join(', ')}\n`;
    if (d.removed.length) md += `- **Removed (${d.removed.length}):** ${d.removed.map((x) => `\`${x}\``).join(', ')}\n`;
    for (const c of d.changed) md += `- **Changed** \`${c.name}\`.${c.field}: \`${JSON.stringify(c.from)}\` → \`${JSON.stringify(c.to)}\`\n`;
  }
  if (!any) md += `\n_No public option/column/event/method signature changes detected (change is behavioural or internal)._\n`;
  console.error(b.slug, 'done', mat.count, 'files');
}

const outMd = join(DOCS_ROOT, 'V6-API-DELTAS.md');
writeFileSync(outMd, md, 'utf8');
console.log('Wrote', outMd);
