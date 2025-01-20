import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
  },
});