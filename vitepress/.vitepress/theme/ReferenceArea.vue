<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { withBase } from 'vitepress';
import api from '../../../docs/data/api.json';
import overlays from '../../../docs/data/overlays.json';

const ov = (id) => overlays[`${props.area}:${id}`] ?? overlays[id];

const props = defineProps({ area: { type: String, required: true } });

const ALL_AREAS = [
  { key: 'grid', label: 'SlickGrid' },
  { key: 'dataview', label: 'DataView' },
  { key: 'column', label: 'Column' },
  { key: 'editors', label: 'Editors' },
  { key: 'formatters', label: 'Formatters' },
  { key: 'plugins', label: 'Plugins' },
  { key: 'controls', label: 'Controls' },
  { key: 'core', label: 'Core' },
];

function optEntry(o, prefix) {
  return { id: `${prefix}-${o.name}`, name: o.name, kind: 'option', type: o.type, def: o.default, optional: o.optional, description: o.description, deprecated: o.deprecated };
}
function evtEntry(e) {
  return { id: `evt-${e.name}`, name: e.name, kind: 'event', type: e.payload, description: e.description, args: e.args };
}
function methEntry(m) {
  return { id: `m-${m.name}`, name: m.name, kind: 'method', signature: m.signature, params: m.params, returns: m.returns, description: m.description, deprecated: m.deprecated };
}

function methodSections(methods) {
  const order = [];
  const map = new Map();
  for (const m of methods) {
    const g = m.group || 'Other';
    if (!map.has(g)) { map.set(g, []); order.push(g); }
    map.get(g).push(methEntry(m));
  }
  return order.map((g, i) => ({
    id: `sec-mg-${i}`,
    title: (order.length === 1 && g === 'Other') ? 'Methods' : g,
    entries: map.get(g),
  }));
}

function classSection(cls, idx) {
  const entries = [];
  for (const e of cls.events || []) entries.push({ id: `${cls.name}-evt-${e.name}`, name: e.name, kind: 'event', type: e.payload, description: e.description });
  for (const m of cls.methods || []) entries.push({ id: `${cls.name}-m-${m.name}`, name: m.name, kind: 'method', signature: m.signature, params: m.params, returns: m.returns, description: m.description, deprecated: m.deprecated });
  return { id: `sec-cls-${idx}`, title: cls.name, description: cls.description, entries };
}
function interfaceSection(iface, idx) {
  return {
    id: `sec-if-${idx}`,
    title: `${iface.name} (options)`,
    description: iface.description,
    entries: iface.properties.map((p) => ({ id: `${iface.name}-${p.name}`, name: p.name, kind: 'option', type: p.type, optional: p.optional, description: p.description })),
  };
}

function buildArea(area) {
  if (area === 'grid') {
    return {
      title: 'SlickGrid', sections: [
        { id: 'sec-options', title: 'Options', entries: api.gridOptions.map((o) => optEntry(o, 'opt')) },
        { id: 'sec-events', title: 'Events', entries: api.gridEvents.map(evtEntry) },
        ...methodSections(api.gridMethods),
      ],
    };
  }
  if (area === 'dataview') {
    return {
      title: 'DataView', sections: [
        { id: 'sec-options', title: 'Options', entries: api.dataViewOptions.map((o) => optEntry(o, 'dvopt')) },
        { id: 'sec-events', title: 'Events', entries: api.dataViewEvents.map(evtEntry) },
        ...methodSections(api.dataViewMethods),
      ],
    };
  }
  if (area === 'column') {
    return {
      title: 'Column definition', sections: [
        { id: 'sec-props', title: 'Properties', entries: api.columns.map((o) => optEntry(o, 'col')) },
      ],
    };
  }
  if (area === 'plugins' || area === 'controls') {
    const mods = api.modules?.[area] || [];
    const sections = [];
    mods.forEach((mod, mi) => {
      (mod.interfaces || []).forEach((iface, ii) => sections.push(interfaceSection(iface, `${mi}-i${ii}`)));
      (mod.classes || []).forEach((cls, ci) => sections.push(classSection(cls, `${mi}-c${ci}`)));
    });
    return { title: area === 'plugins' ? 'Plugins' : 'Controls', sections };
  }
  if (area === 'core') {
    const sections = (api.modules?.core?.classes || []).map((cls, i) => classSection(cls, i));
    const enums = api.modules?.enums || {};
    const enumEntries = Object.entries(enums).map(([name, map]) => ({
      id: `enum-${name}`, name, kind: 'option', type: 'const',
      description: Object.entries(map).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join('\n'),
    }));
    if (enumEntries.length) sections.push({ id: 'sec-enums', title: 'Enums & constants', entries: enumEntries });
    return { title: 'Core', sections };
  }
  if (area === 'editors' || area === 'formatters') {
    const m = api.modules?.[area] || {};
    const sections = [];
    if (m.registry?.length) {
      const reg = area === 'editors' ? 'Editors' : 'Formatters';
      sections.push({ id: 'sec-registry', title: 'Registry', entries: m.registry.map((n) => ({ id: `reg-${n}`, name: n, kind: 'option', type: `${reg}.${n}`, description: '' })) });
    }
    (m.classes || []).forEach((cls, i) => sections.push(classSection(cls, i)));
    return { title: area === 'editors' ? 'Editors' : 'Formatters', sections };
  }
  return { title: area, sections: [] };
}

const model = computed(() => buildArea(props.area));
const allEntries = computed(() => model.value.sections.flatMap((s) => s.entries));
const alpha = ref(false);

const navSections = computed(() => {
  if (!alpha.value) return model.value.sections;
  const all = [...allEntries.value].sort((a, b) => a.name.localeCompare(b.name));
  return [{ id: 'sec-az', title: 'A–Z', entries: all }];
});

const activeId = ref('');
let scheduled = false;

function fmtDefault(v) {
  if (typeof v === 'string') return v;
  return JSON.stringify(v);
}

function fieldSig(fields) {
  return '{ ' + fields.map((f) => `${f.name}${f.optional ? '?' : ''}: ${f.type}`).join('; ') + ' }';
}
function argSig(e) {
  const a = e.args;
  if (!a) return e.type;
  if (a.fields) return fieldSig(a.fields);
  if (a.variants) return a.variants.map((v) => (v.fields && v.fields.length ? fieldSig(v.fields) : v.label)).join(' | ');
  return e.type;
}
// Show the expanded signature line only for named types/unions — anonymous
// literals (e.g. `{ grid: SlickGrid }`) already read as their own signature.
function showArgSig(e) {
  return !!(e.args && (e.args.fields || e.args.variants)) && !String(e.type || '').trim().startsWith('{');
}

function onNavClick(id, e) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    activeId.value = id;
  }
}

function computeActive() {
  const els = document.querySelectorAll('.ref-entry[id]');
  if (!els.length) return;
  const line = 96; // reading line just below the fixed navbar
  let current = els[0].id;
  for (const el of els) {
    if (el.getBoundingClientRect().top - line <= 0) current = el.id;
    else break;
  }
  activeId.value = current;
}
function onScroll() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => { scheduled = false; computeActive(); }, 50);
}
function setupSpy() {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  computeActive();
}
function teardownSpy() {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
}

watch(activeId, (id) => {
  if (!id) return;
  const nav = document.querySelector(`.ref-right a[data-id="${id}"]`);
  if (nav) nav.scrollIntoView({ block: 'nearest' });
  try { history.replaceState(null, '', `#${id}`); } catch (e) { /* noop */ }
});

watch(() => props.area, async () => {
  activeId.value = '';
  await nextTick();
  computeActive();
});

onMounted(async () => {
  await nextTick();
  setupSpy();
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) { el.scrollIntoView(); activeId.value = location.hash.slice(1); }
  }
});
onBeforeUnmount(teardownSpy);
</script>

<template>
  <div class="ref-wrap">
    <!-- LEFT: areas + section jumplist -->
    <nav class="ref-left">
      <div class="ref-left-title">Reference</div>
      <ul class="ref-areas">
        <li v-for="a in ALL_AREAS" :key="a.key">
          <a :href="withBase('/reference/' + a.key)" :class="{ current: a.key === props.area }">{{ a.label }}</a>
        </li>
      </ul>
      <div class="ref-left-title">On this page</div>
      <ul class="ref-jump">
        <li v-for="s in model.sections" :key="s.id">
          <a :href="'#' + s.id" @click="onNavClick(s.id, $event)">{{ s.title }} <span class="count">{{ s.entries.length }}</span></a>
        </li>
      </ul>
    </nav>

    <!-- CENTER: the long content -->
    <div class="ref-center">
      <details class="ref-mobile-nav">
        <summary>Jump to…</summary>
        <div class="ref-mobile-areas">
          <a v-for="a in ALL_AREAS" :key="a.key" :href="withBase('/reference/' + a.key)" :class="{ current: a.key === props.area }">{{ a.label }}</a>
        </div>
        <div class="ref-mobile-sections">
          <a v-for="s in model.sections" :key="s.id" :href="'#' + s.id" @click="onNavClick(s.id, $event)">{{ s.title }} ({{ s.entries.length }})</a>
        </div>
      </details>
      <h1 class="ref-h1">{{ model.title }}</h1>
      <section v-for="s in model.sections" :key="s.id" class="ref-section">
        <h2 :id="s.id" class="ref-section-h">{{ s.title }} <span class="count">{{ s.entries.length }}</span></h2>
        <p v-if="s.description" class="ref-section-desc">{{ s.description }}</p>
        <article v-for="e in s.entries" :key="e.id" :id="e.id" class="ref-entry">
          <h3 class="ref-name">
            {{ e.name }}
            <span v-if="e.deprecated !== undefined" class="badge deprecated">deprecated</span>
            <span v-if="e.kind === 'event'" class="badge event">event</span>
          </h3>
          <pre v-if="e.kind === 'method'" class="ref-sig"><code>{{ e.signature }}</code></pre>
          <template v-else-if="e.kind === 'event'">
            <p class="ref-type"><span class="k">type</span> <code>{{ e.type }}</code></p>
            <p v-if="showArgSig(e)" class="ref-argsig"><code>{{ argSig(e) }}</code></p>
          </template>
          <p v-else-if="e.type" class="ref-type">
            <span class="k">type</span> <code>{{ e.type }}</code>
            <template v-if="e.def !== undefined"> · <span class="k">default</span> <code>{{ fmtDefault(e.def) }}</code></template>
          </p>
          <div v-if="e.description" class="ref-desc">{{ e.description }}</div>
          <div v-if="e.deprecated" class="ref-deprecated">Deprecated: {{ e.deprecated }}</div>
          <div v-if="ov(e.id)?.notes" class="ref-overlay-notes">{{ ov(e.id).notes }}</div>
          <pre v-if="ov(e.id)?.example" class="ref-example"><code>{{ ov(e.id).example }}</code></pre>
          <table v-if="e.params && e.params.length" class="ref-params">
            <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              <tr v-for="p in e.params" :key="p.name">
                <td><code>{{ p.name }}{{ p.optional ? '?' : '' }}</code></td>
                <td><code>{{ p.type }}</code></td>
                <td>{{ p.description }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="e.kind === 'method' && e.returns" class="ref-returns"><span class="k">returns</span> <code>{{ e.returns }}</code></p>
        </article>
      </section>
    </div>

    <!-- RIGHT: scroll-spy nav -->
    <nav class="ref-right">
      <div class="ref-right-head">
        <span>Contents</span>
        <span class="toggle">
          <button :class="{ on: !alpha }" @click="alpha = false">Section</button>
          <button :class="{ on: alpha }" @click="alpha = true">A–Z</button>
        </span>
      </div>
      <div v-for="s in navSections" :key="s.id" class="ref-right-group">
        <div class="ref-right-group-title">{{ s.title }}</div>
        <a
          v-for="e in s.entries"
          :key="e.id"
          :href="'#' + e.id"
          :data-id="e.id"
          :class="{ active: activeId === e.id }"
          @click="onNavClick(e.id, $event)"
        >{{ e.name }}</a>
      </div>
    </nav>
  </div>
</template>
