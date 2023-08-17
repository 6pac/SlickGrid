import { defineConfig } from 'cypress'

export default defineConfig({
  baseExampleUrl: 'http://localhost:8080/examples',
  video: false,
  viewportWidth: 1200,
  viewportHeight: 900,
  e2e: {
    experimentalRunAllSpecs: true,
    testIsolation: false,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8080',
  },
})
