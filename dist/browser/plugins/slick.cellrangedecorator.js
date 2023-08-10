"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:../slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:../slick.core.js"() {
    }
  });

  // src/plugins/slick.cellrangedecorator.js
  var require_slick_cellrangedecorator = __commonJS({
    "src/plugins/slick.cellrangedecorator.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCellRangeDecorator = void 0;
      var slick_core_1 = require_slick_core(), Utils = Slick.Utils, SlickCellRangeDecorator = (
        /** @class */
        function() {
          function SlickCellRangeDecorator2(grid, options) {
            this.grid = grid, this.pluginName = "CellRangeDecorator", this._defaults = {
              selectionCssClass: "slick-range-decorator",
              selectionCss: {
                zIndex: "9999",
                border: "2px dashed red"
              },
              offset: { top: -1, left: -1, height: -2, width: -2 }
            }, this._options = Utils.extend(!0, {}, this._defaults, options);
          }
          return SlickCellRangeDecorator2.prototype.destroy = function() {
            this.hide();
          }, SlickCellRangeDecorator2.prototype.init = function() {
          }, SlickCellRangeDecorator2.prototype.hide = function() {
            var _a;
            (_a = this._elem) === null || _a === void 0 || _a.remove(), this._elem = null;
          }, SlickCellRangeDecorator2.prototype.show = function(range) {
            var _this = this, _a;
            if (!this._elem) {
              this._elem = document.createElement("div"), this._elem.className = this._options.selectionCssClass, Object.keys(this._options.selectionCss).forEach(function(cssStyleKey) {
                _this._elem.style[cssStyleKey] = _this._options.selectionCss[cssStyleKey];
              }), this._elem.style.position = "absolute";
              var canvasNode = this.grid.getActiveCanvasNode();
              canvasNode && canvasNode.appendChild(this._elem);
            }
            var from = this.grid.getCellNodeBox(range.fromRow, range.fromCell), to = this.grid.getCellNodeBox(range.toRow, range.toCell);
            return from && to && (!((_a = this._options) === null || _a === void 0) && _a.offset) && (this._elem.style.top = "".concat(from.top + this._options.offset.top, "px"), this._elem.style.left = "".concat(from.left + this._options.offset.left, "px"), this._elem.style.height = "".concat(to.bottom - from.top + this._options.offset.height, "px"), this._elem.style.width = "".concat(to.right - from.left + this._options.offset.width, "px")), this._elem;
          }, SlickCellRangeDecorator2;
        }()
      );
      exports.SlickCellRangeDecorator = SlickCellRangeDecorator;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          CellRangeDecorator: SlickCellRangeDecorator
        }
      });
    }
  });
  require_slick_cellrangedecorator();
})();
//# sourceMappingURL=slick.cellrangedecorator.js.map
