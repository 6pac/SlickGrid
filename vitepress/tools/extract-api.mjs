// SlickGrid API extractor.
// Walks the TypeScript source with ts-morph and emits a structured api.json
// describing every grid option, column property, event and public method,
// pulling descriptions from the existing JSDoc and defaults from the runtime
// _defaults object literal. This is the single source of truth for the
// generated Reference section.
//
// Usage:  node tools/extract-api.mjs [pathToSlickGridRepo]
// The repo path may also be given via the SLICKGRID_REPO env var.

import { Project, SyntaxKind } from 'ts-morph';
import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VITEPRESS_ROOT = dirname(HERE);
const REPO_ROOT = dirname(VITEPRESS_ROOT);
const DOCS_ROOT = join(REPO_ROOT, 'docs');

const REPO =
  process.argv[2] ||
  process.env.SLICKGRID_REPO ||
  // The VitePress project is in <repo>/vitepress and authored pages are in <repo>/docs.
  (existsSync(join(REPO_ROOT, 'src')) ? REPO_ROOT : 'G:/Dropbox/Work/SlickGrid/SlickGrid-6pac');

const SRC = join(REPO, 'src');

const FILES = {
  gridOption: join(SRC, 'models', 'gridOption.interface.ts'),
  column: join(SRC, 'models', 'column.interface.ts'),
  grid: join(SRC, 'slick.grid.ts'),
  dataview: join(SRC, 'slick.dataview.ts'),
};

for (const [key, file] of Object.entries(FILES)) {
  if (!existsSync(file)) {
    console.error(`MISSING source file for "${key}": ${file}`);
    process.exit(2);
  }
}

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { allowJs: false, skipLibCheck: true },
});
for (const file of Object.values(FILES)) project.addSourceFileAtPath(file);

// ---- helpers ---------------------------------------------------------------

function jsdocText(node) {
  const docs = node.getJsDocs?.() ?? [];
  if (!docs.length) return '';
  return docs
    .map((d) => (d.getDescription() ?? '').trim())
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function jsdocTag(node, tagName) {
  const docs = node.getJsDocs?.() ?? [];
  for (const d of docs) {
    for (const t of d.getTags()) {
      if (t.getTagName() === tagName) return (t.getCommentText() ?? '').trim() || true;
    }
  }
  return undefined;
}

function paramDocs(node) {
  const map = {};
  const docs = node.getJsDocs?.() ?? [];
  for (const d of docs) {
    for (const t of d.getTags()) {
      if (t.getTagName() === 'param' && typeof t.getName === 'function') {
        map[t.getName()] = (t.getCommentText() ?? '').trim();
      }
    }
  }
  return map;
}

function literalValue(initText) {
  if (initText == null) return undefined;
  const t = initText.trim();
  if (/^(-?\d+(\.\d+)?|true|false|null)$/.test(t)) {
    try { return JSON.parse(t); } catch { return t; }
  }
  if (/^'([^']*)'$/.test(t) || /^"([^"]*)"$/.test(t)) return t.slice(1, -1);
  return t; // enum ref / expression – keep as source text
}

// ---- interface property extraction ----------------------------------------

function extractInterface(sourceFile, interfaceName) {
  const iface = sourceFile.getInterface(interfaceName);
  if (!iface) return [];
  return iface.getProperties().map((p) => {
    const entry = {
      name: p.getName(),
      type: p.getTypeNode()?.getText() ?? p.getType().getText(),
      optional: p.hasQuestionToken(),
      description: jsdocText(p),
    };
    const dep = jsdocTag(p, 'deprecated');
    if (dep) entry.deprecated = dep === true ? '' : dep;
    const def = jsdocTag(p, 'default');
    if (def && def !== true) entry.defaultFromDoc = def;
    return entry;
  });
}

// ---- grid class: events, methods, defaults ---------------------------------

const gridFile = project.getSourceFile(FILES.grid);
const gridClass = gridFile.getClass('SlickGrid') ?? gridFile.getClasses().find((c) => c.getName()?.includes('Grid'));

const dataviewFile = project.getSourceFile(FILES.dataview);
const dataviewClass = dataviewFile.getClass('SlickDataView') ?? dataviewFile.getClasses().find((c) => /DataView/.test(c.getName() ?? ''));

// Built early (before any extractEvents call) so event args can be resolved.
const interfaceRegistry = buildInterfaceRegistry();

function extractEvents(cls) {
  const events = [];
  for (const prop of cls.getProperties()) {
    const name = prop.getName();
    if (!name.startsWith('on')) continue;
    const tn = prop.getTypeNode();
    const init = prop.getInitializer();
    const isEvent =
      /SlickEvent_?</.test(tn?.getText() ?? '') ||
      (init && init.getKind() === SyntaxKind.NewExpression && /SlickEvent/.test(init.getText().slice(0, 40)));
    if (!isEvent) continue;
    let payloadNode;
    if (tn && tn.getKind() === SyntaxKind.TypeReference) {
      const ta = tn.getTypeArguments?.() ?? [];
      if (ta.length) payloadNode = ta[0];
    }
    if (!payloadNode && init && init.getKind() === SyntaxKind.NewExpression) {
      const ta = init.getTypeArguments?.() ?? [];
      if (ta.length) payloadNode = ta[0];
    }
    const payload = payloadNode?.getText() ?? '';
    const args = payloadNode ? resolveArgsNode(payloadNode) : undefined;
    events.push({ name, payload, args, description: jsdocText(prop) });
  }
  return events;
}

function bannersFor(sf) {
  const text = sf.getFullText();
  const re = /\/\/ ?([^\n/][^\n]*?)\r?\n\s*\/{10,}/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push({ index: m.index, name: m[1].trim() });
  return out;
}

function extractMethods(cls) {
  const banners = bannersFor(cls.getSourceFile());
  const groupFor = (pos) => { let g = ''; for (const b of banners) { if (b.index < pos) g = b.name; else break; } return g; };
  const methods = [];
  for (const m of cls.getMethods()) {
    if (m.hasModifier(SyntaxKind.ProtectedKeyword) || m.hasModifier(SyntaxKind.PrivateKeyword)) continue;
    const name = m.getName();
    if (name.startsWith('_')) continue;
    const pdocs = paramDocs(m);
    const params = m.getParameters().map((p) => ({
      name: p.getName(),
      type: p.getTypeNode()?.getText() ?? '',
      optional: p.hasQuestionToken() || p.hasInitializer(),
      description: pdocs[p.getName()] ?? '',
    }));
    const returns = m.getReturnTypeNode()?.getText() ?? '';
    const sigParams = params.map((p) => `${p.name}${p.optional ? '?' : ''}${p.type ? ': ' + p.type : ''}`).join(', ');
    const entry = {
      name,
      group: groupFor(m.getStart()),
      signature: `${name}(${sigParams})${returns ? ': ' + returns : ''}`,
      params,
      returns,
      description: jsdocText(m),
    };
    const dep = jsdocTag(m, 'deprecated');
    if (dep) entry.deprecated = dep === true ? '' : dep;
    methods.push(entry);
  }
  return methods;
}

function extractDefaults(sourceFile) {
  const defaults = {};
  let objLit = sourceFile.getVariableDeclaration('_defaults')?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!objLit) {
    const prop = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).find((p) => p.getName?.() === '_defaults');
    objLit = prop?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  }
  if (!objLit) {
    const decl = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).find((d) => d.getName() === '_defaults');
    objLit = decl?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  }
  if (!objLit) return defaults;
  for (const p of objLit.getProperties()) {
    if (p.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const name = p.getName().replace(/^['"]|['"]$/g, '');
    defaults[name] = literalValue(p.getInitializer()?.getText());
  }
  return defaults;
}

// ---- assemble --------------------------------------------------------------

const gridOptions = extractInterface(project.getSourceFile(FILES.gridOption), 'GridOption');
const columns = extractInterface(project.getSourceFile(FILES.column), 'Column');
const dataViewOptions = extractInterface(project.getSourceFile(FILES.dataview), 'DataViewOption');
const gridEvents = gridClass ? extractEvents(gridClass) : [];
const gridMethods = gridClass ? extractMethods(gridClass) : [];
const dataViewEvents = dataviewClass ? extractEvents(dataviewClass) : [];
const dataViewMethods = dataviewClass ? extractMethods(dataviewClass) : [];
const defaults = extractDefaults(gridFile);

function addFile(abs) { return project.getSourceFile(abs) ?? project.addSourceFileAtPath(abs); }

function extractExportedInterfaces(sf) {
  return sf.getInterfaces().filter((i) => i.isExported()).map((i) => ({
    name: i.getName(),
    description: jsdocText(i),
    properties: i.getProperties().map((p) => ({
      name: p.getName(),
      type: p.getTypeNode()?.getText() ?? '',
      optional: p.hasQuestionToken(),
      description: jsdocText(p),
    })),
  }));
}

function extractExportedClasses(sf) {
  return sf.getClasses().filter((c) => c.isExported()).map((c) => ({
    name: c.getName(),
    description: jsdocText(c),
    methods: extractMethods(c),
    events: extractEvents(c),
  }));
}

function objectKeys(sf, varName) {
  const obj = sf.getVariableDeclaration(varName)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return null;
  return obj.getProperties()
    .filter((p) => p.getKind() === SyntaxKind.PropertyAssignment || p.getKind() === SyntaxKind.ShorthandPropertyAssignment)
    .map((p) => p.getName().replace(/^['"]|['"]$/g, ''));
}

function objectMap(sf, varName) {
  const obj = sf.getVariableDeclaration(varName)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return null;
  const m = {};
  for (const p of obj.getProperties()) {
    if (p.getKind() !== SyntaxKind.PropertyAssignment) continue;
    m[p.getName().replace(/^['"]|['"]$/g, '')] = literalValue(p.getInitializer()?.getText());
  }
  return m;
}

function scanModuleDir(dir, category) {
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts'); } catch { return []; }
  const out = [];
  for (const f of files) {
    try {
      const sf = addFile(join(dir, f));
      out.push({ file: `${category}/${f}`, classes: extractExportedClasses(sf), interfaces: extractExportedInterfaces(sf) });
    } catch (e) { out.push({ file: `${category}/${f}`, error: String(e?.message ?? e) }); }
  }
  return out;
}

// Registry of every interface under src/models, used to resolve an event's
// args type (e.g. OnAutosizeColumnsEventArgs) into its actual fields, following
// `extends` chains (so inherited `grid` etc. are included).
function buildInterfaceRegistry() {
  const registry = new Map();
  const modelsDir = join(SRC, 'models');
  let files = [];
  try { files = readdirSync(modelsDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts'); } catch { return registry; }
  for (const f of files) {
    let sf;
    try { sf = addFile(join(modelsDir, f)); } catch { continue; }
    for (const iface of sf.getInterfaces()) {
      const props = iface.getProperties().map((p) => ({ name: p.getName(), type: p.getTypeNode()?.getText() ?? '', optional: p.hasQuestionToken() }));
      const heritage = iface.getExtends().map((e) => e.getExpression().getText());
      registry.set(iface.getName(), { props, heritage });
    }
  }
  return registry;
}

function flattenInterface(name, registry, seen) {
  seen = seen || new Set();
  if (seen.has(name)) return [];
  seen.add(name);
  const entry = registry.get(name);
  if (!entry) return [];
  const out = [];
  const put = (p) => { const i = out.findIndex((x) => x.name === p.name); if (i >= 0) out[i] = p; else out.push(p); };
  for (const base of entry.heritage) for (const bp of flattenInterface(base, registry, seen)) put(bp);
  for (const p of entry.props) put(p);
  return out;
}

function resolveArgsNode(node) {
  if (!node) return undefined;
  const k = node.getKind();
  if (k === SyntaxKind.UnionType) {
    return { variants: node.getTypeNodes().map((n) => ({ label: n.getText(), fields: resolveArgsNode(n)?.fields ?? [] })) };
  }
  if (k === SyntaxKind.TypeLiteral) {
    const fields = node.getMembers()
      .filter((m) => m.getKind() === SyntaxKind.PropertySignature)
      .map((m) => ({ name: m.getName(), type: m.getTypeNode?.()?.getText() ?? '', optional: m.hasQuestionToken?.() ?? false }));
    return { typeName: node.getText(), fields };
  }
  const nm = node.getText().replace(/<[\s\S]*>/, '').trim();
  if (interfaceRegistry.has(nm)) return { typeName: nm, fields: flattenInterface(nm, interfaceRegistry) };
  return { typeName: node.getText(), unresolved: true };
}

const editorsFile = addFile(join(SRC, 'slick.editors.ts'));
const formattersFile = addFile(join(SRC, 'slick.formatters.ts'));
const coreFile = addFile(join(SRC, 'slick.core.ts'));

const modules = {
  editors: { registry: objectKeys(editorsFile, 'Editors'), classes: extractExportedClasses(editorsFile) },
  formatters: { registry: objectKeys(formattersFile, 'Formatters'), classes: extractExportedClasses(formattersFile) },
  core: { classes: extractExportedClasses(coreFile) },
  enums: {},
  controls: scanModuleDir(join(SRC, 'controls'), 'controls'),
  plugins: scanModuleDir(join(SRC, 'plugins'), 'plugins'),
};
const slickCoreObj = coreFile.getVariableDeclaration('SlickCore')?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
function enumMap(name) {
  let obj = coreFile.getVariableDeclaration(name)?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj && slickCoreObj) obj = slickCoreObj.getProperty(name)?.getInitializerIfKind?.(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return null;
  const m = {};
  for (const p of obj.getProperties()) {
    if (p.getKind() !== SyntaxKind.PropertyAssignment) continue;
    m[p.getName().replace(/^['"]|['"]$/g, '')] = literalValue(p.getInitializer()?.getText());
  }
  return m;
}
for (const name of ['keyCode', 'GridAutosizeColsMode', 'ColAutosizeMode', 'RowSelectionMode', 'CellSelectionMode', 'ValueFilterMode', 'WidthEvalMode']) {
  const m = enumMap(name);
  if (m) modules.enums[name] = m;
}

let withDoc = 0, withDefault = 0;
for (const o of gridOptions) {
  if (o.name in defaults) { o.default = defaults[o.name]; withDefault++; }
  if (o.description) withDoc++;
}

const api = {
  meta: {
    generatedAt: new Date().toISOString(),
    repo: REPO,
    counts: {
      gridOptions: gridOptions.length,
      gridOptionsWithDoc: withDoc,
      gridOptionsWithDefault: withDefault,
      columns: columns.length,
      gridEvents: gridEvents.length,
      gridMethods: gridMethods.length,
      dataViewOptions: dataViewOptions.length,
      dataViewEvents: dataViewEvents.length,
      dataViewMethods: dataViewMethods.length,
      plugins: modules.plugins.length,
      controls: modules.controls.length,
      coreClasses: modules.core.classes.length,
      editors: (modules.editors.registry ?? []).length,
      formatters: (modules.formatters.registry ?? []).length,
      enums: Object.keys(modules.enums).length,
    },
  },
  gridOptions,
  columns,
  gridEvents,
  gridMethods,
  dataViewOptions,
  dataViewEvents,
  dataViewMethods,
  modules,
};

const outFile = process.env.API_OUT || join(DOCS_ROOT, 'data', 'api.json');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(api, null, 2), 'utf8');

console.log('Extracted from:', REPO);
console.table(api.meta.counts);
console.log('Wrote', outFile);
const sample = gridOptions.find((o) => o.name === 'editable') || gridOptions[0];
console.log('\nSample option:', JSON.stringify(sample, null, 2));
const sampleM = gridMethods.find((m) => m.name === 'setColumns') || gridMethods[0];
console.log('\nSample method:', JSON.stringify(sampleM, null, 2));
