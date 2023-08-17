import { defineConfig } from 'cypress'

import plugins from './plugins/index';

export default defineConfig({
  video: false,
  viewportWidth: 1200,
  viewportHeight: 900,
  e2e: {
    experimentalRunAllSpecs: true,
    testIsolation: false,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugins(on, config);
    },
    baseUrl: 'http://localhost:8080',
  },
})
