import { defineConfig } from 'cypress';

import plugins from './plugins/index';

export default defineConfig({
  allowCypressEnv: false,
  video: false,
  viewportWidth: 1200,
  viewportHeight: 900,
  // retry once in headless runs only: absorbs machine-load flakes in timing-sensitive
  // tests (native clipboard paste, render waits) while Cypress still reports retried
  // tests as flaky, so real intermittent bugs stay visible
  retries: { runMode: 1, openMode: 0 },
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
});
