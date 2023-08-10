"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:./slick.core.js"() {
    }
  });

  // src/slick.formatters.js
  var require_slick_formatters = __commonJS({
    "src/slick.formatters.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.Formatters = exports.CheckmarkFormatter = exports.CheckboxFormatter = exports.YesNoFormatter = exports.PercentCompleteBarFormatter = exports.PercentCompleteFormatter = void 0;
      var slick_core_1 = require_slick_core(), Utils = Slick.Utils, PercentCompleteFormatter = function(_row, _cell, value) {
        return value == null || value === "" ? "-" : value < 50 ? '<span style="color:red;font-weight:bold;">'.concat(value, "%</span>") : '<span style="color:green">'.concat(value, "%</span>");
      };
      exports.PercentCompleteFormatter = PercentCompleteFormatter;
      var PercentCompleteBarFormatter = function(_row, _cell, value) {
        if (value == null || value === "")
          return "";
        var color;
        return value < 30 ? color = "red" : value < 70 ? color = "silver" : color = "green", '<span class="percent-complete-bar" style="background:'.concat(color, ";width:").concat(value, '%" title="').concat(value, '%"></span>');
      };
      exports.PercentCompleteBarFormatter = PercentCompleteBarFormatter;
      var YesNoFormatter = function(_row, _cell, value) {
        return value ? "Yes" : "No";
      };
      exports.YesNoFormatter = YesNoFormatter;
      var CheckboxFormatter = function(_row, _cell, value) {
        return '<span class="sgi sgi-checkbox-'.concat(value ? "intermediate" : "blank-outline", '"></span>');
      };
      exports.CheckboxFormatter = CheckboxFormatter;
      var CheckmarkFormatter = function(_row, _cell, value) {
        return value ? '<span class="sgi sgi-check"></span>' : "";
      };
      exports.CheckmarkFormatter = CheckmarkFormatter;
      exports.Formatters = {
        PercentComplete: exports.PercentCompleteFormatter,
        PercentCompleteBar: exports.PercentCompleteBarFormatter,
        YesNo: exports.YesNoFormatter,
        Checkmark: exports.CheckmarkFormatter,
        Checkbox: exports.CheckboxFormatter
      };
      window.Slick && Utils.extend(Slick, {
        Formatters: exports.Formatters
      });
    }
  });
  require_slick_formatters();
})();
//# sourceMappingURL=slick.formatters.js.map
