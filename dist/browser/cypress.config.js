"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./cypress/plugins/index.js.js
  var require_index_js = __commonJS({
    "import-ns:./cypress/plugins/index.js.js"() {
    }
  });

  // cypress.config.ts
  var cypress_config_default = (void 0)({
    baseExampleUrl: "http://localhost:8080/examples",
    video: !1,
    viewportWidth: 1200,
    viewportHeight: 900,
    e2e: {
      experimentalRunAllSpecs: !0,
      testIsolation: !1,
      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      setupNodeEvents(on, config) {
        return require_index_js()(on, config);
      },
      baseUrl: "http://localhost:8080"
    }
  });
})();
//# sourceMappingURL=cypress.config.js.map
