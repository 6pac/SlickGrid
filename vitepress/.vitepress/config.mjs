import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

// Base is '/' for local dev. For GitHub Pages under 6pac/SlickGrid this becomes
// '/SlickGrid/' at build time (set via DOCS_BASE in the docs workflow).
const base = process.env.DOCS_BASE || '/';
const vuePath = fileURLToPath(new URL('../node_modules/vue', import.meta.url));

// VitePress runs both heading ids and the #hash of every internal link through this.
// Its default lowercases, which breaks links to the Reference anchors (`m-updateColumns`,
// `opt-frozenColumn`, ...) whose ids are the member names, so keep those exactly as written.
const referenceAnchor = /^[a-z]+-[A-Za-z_$][\w$]*$/;
const slugify = (str) =>
  referenceAnchor.test(str)
    ? str
    : str
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[\u0000-\u001f]/g, '')
        .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\;:"'“”‘’<>,.?/]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/^(\d)/, '_$1')
        .toLowerCase();

export default defineConfig({
  base,
  srcDir: '../docs',
  lang: 'en-US',
  title: 'SlickGrid',
  description: 'A lightning fast JavaScript data grid — official documentation.',
  head: [['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` }]],
  cleanUrls: true,
  markdown: { anchor: { slugify } },
  lastUpdated: true,
  vite: {
    // The Markdown source lives outside the VitePress project root, so make
    // Vue resolvable from the standalone vitepress/ dependency directory.
    resolve: { alias: { vue: vuePath } },
  },
  srcExclude: ['README.md', '_legacy/**', 'public/**'], // `public/` holds static files (e.g. the migration skill), not pages
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Introduction', link: '/introduction/' },
      { text: 'In-depth', link: '/in-depth/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Migration guides', link: '/migration/' },
      { text: 'Examples', link: '/examples' },
    ],
    sidebar: {
      '/introduction/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is SlickGrid', link: '/introduction/what-is-slickgrid' },
            { text: 'Installation', link: '/introduction/installation' },
            { text: 'Your first grid', link: '/introduction/first-grid' },
            { text: 'Columns', link: '/introduction/columns' },
            { text: 'Common options', link: '/introduction/options' },
            { text: 'Reacting to the grid', link: '/introduction/events' },
            { text: 'Adding a DataView', link: '/introduction/dataview' },
            { text: 'Next steps', link: '/introduction/next-steps' },
          ],
        },
      ],
      '/in-depth/': [
        {
          text: 'In-depth',
          items: [
            { text: 'Providing data', link: '/in-depth/providing-data' },
            { text: 'DataView', link: '/in-depth/dataview' },
            { text: 'Sorting', link: '/in-depth/sorting' },
            { text: 'Filtering & paging', link: '/in-depth/filtering-paging' },
            { text: 'Grouping & aggregators', link: '/in-depth/grouping' },
            { text: 'Auto column sizing', link: '/in-depth/auto-column-sizing' },
            { text: 'Selection models', link: '/in-depth/selection' },
            { text: 'Cell editors', link: '/in-depth/custom-editors' },
            { text: 'Formatters', link: '/in-depth/formatters' },
            { text: 'Pinning & sticky docking', link: '/in-depth/pinning-sticky' },
            { text: 'Menus & header UI', link: '/in-depth/menus' },
            { text: 'Theming', link: '/in-depth/theming' },
            { text: 'Plugins', link: '/in-depth/plugins' },
            { text: 'CSP & sanitization', link: '/in-depth/csp' },
            { text: 'Performance', link: '/in-depth/performance' },
            { text: 'TypeScript', link: '/in-depth/typescript' },
          ],
        },
      ],
      '/migration/': [
        {
          text: 'Migration guides',
          items: [
            { text: 'Overview', link: '/migration/' },
            { text: 'Migrating to v6', link: '/migration/v6' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'SlickGrid', link: '/reference/grid' },
            { text: 'DataView', link: '/reference/dataview' },
            { text: 'Column definition', link: '/reference/column' },
            { text: 'Editors', link: '/reference/editors' },
            { text: 'Formatters', link: '/reference/formatters' },
            { text: 'Plugins', link: '/reference/plugins' },
            { text: 'Controls', link: '/reference/controls' },
            { text: 'Core', link: '/reference/core' },
            { text: 'A–Z index', link: '/reference/a-z' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/6pac/SlickGrid' }],
    outline: [2, 3],
  },
});
