"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:sortablejs.js
  var require_sortablejs = __commonJS({
    "import-ns:sortablejs.js"() {
    }
  });

  // import-ns:https://cdn.jsdelivr.net/npm/sortablejs/Sortable.min.js.js
  var require_Sortable_min_js = __commonJS({
    "import-ns:https://cdn.jsdelivr.net/npm/sortablejs/Sortable.min.js.js"() {
    }
  });

  // src/sortable-shim.js
  var require_sortable_shim = __commonJS({
    "src/sortable-shim.js"(exports, module) {
      var Sortable = require_sortablejs();
      console.log("sortable shim");
      module.exports = window.Sortable | require_Sortable_min_js();
    }
  });
  require_sortable_shim();
})();
