import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  // `IIFE_ONLY` is supplied by the browser/IIFE build, but unit tests import
  // the ES module sources directly.
  define: {
    IIFE_ONLY: false,
  },
  test: {
    cache: false,
    clearMocks: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    deps: {
      interopDefault: false,
    },
    coverage: {
      exclude: [...configDefaults.exclude, '**/interfaces.ts', '**/scripts/**', '*.mjs'],
    },
    watch: false,
  },
});
