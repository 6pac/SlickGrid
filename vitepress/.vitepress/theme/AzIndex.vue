<script setup>
import { ref, computed } from 'vue';
import { withBase } from 'vitepress';
import api from '../../../docs/data/api.json';

const items = [];
const push = (name, group, href) => { if (name) items.push({ name: String(name), group, href }); };

for (const o of api.gridOptions || []) push(o.name, 'Grid option', withBase('/reference/grid') + '#opt-' + o.name);
for (const e of api.gridEvents || []) push(e.name, 'Grid event', withBase('/reference/grid') + '#evt-' + e.name);
for (const m of api.gridMethods || []) push(m.name, 'Grid method', withBase('/reference/grid') + '#m-' + m.name);
for (const c of api.columns || []) push(c.name, 'Column property', withBase('/reference/column') + '#col-' + c.name);
for (const o of api.dataViewOptions || []) push(o.name, 'DataView option', withBase('/reference/dataview') + '#dvopt-' + o.name);
for (const e of api.dataViewEvents || []) push(e.name, 'DataView event', withBase('/reference/dataview') + '#evt-' + e.name);
for (const m of api.dataViewMethods || []) push(m.name, 'DataView method', withBase('/reference/dataview') + '#m-' + m.name);
for (const n of api.modules?.editors?.registry || []) push(n, 'Editor', withBase('/reference/editors'));
for (const n of api.modules?.formatters?.registry || []) push(n, 'Formatter', withBase('/reference/formatters'));
for (const mod of api.modules?.plugins || []) for (const c of mod.classes || []) push(c.name, 'Plugin', withBase('/reference/plugins'));
for (const mod of api.modules?.controls || []) for (const c of mod.classes || []) push(c.name, 'Control', withBase('/reference/controls'));
for (const c of api.modules?.core?.classes || []) push(c.name, 'Core class', withBase('/reference/core'));

const q = ref('');
const groups = computed(() => {
  const needle = q.value.trim().toLowerCase();
  const filtered = needle ? items.filter((i) => i.name.toLowerCase().includes(needle)) : items;
  const sorted = [...filtered].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const byLetter = new Map();
  for (const it of sorted) {
    const L = it.name[0].toUpperCase();
    const key = /[A-Z]/.test(L) ? L : '#';
    if (!byLetter.has(key)) byLetter.set(key, []);
    byLetter.get(key).push(it);
  }
  return [...byLetter.entries()].map(([letter, entries]) => ({ letter, entries }));
});
const total = computed(() => groups.value.reduce((n, g) => n + g.entries.length, 0));
</script>

<template>
  <div class="az-wrap">
    <p class="az-intro">Every member across all reference areas, alphabetically. Type to filter, then jump to its full entry.</p>
    <input class="az-search" type="search" v-model="q" placeholder="Filter by name…" />
    <p class="az-count">{{ total }} entries</p>
    <div v-for="g in groups" :key="g.letter" class="az-group">
      <h2 class="az-letter">{{ g.letter }}</h2>
      <ul class="az-list">
        <li v-for="(it, i) in g.entries" :key="it.name + i">
          <a :href="it.href"><code>{{ it.name }}</code></a>
          <span class="az-tag">{{ it.group }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
