"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.cellrangedecorator.ts
  var Utils = Slick.Utils, SlickCellRangeDecorator = class {
    constructor(grid, options) {
      this.grid = grid;
      // --
      // public API
      __publicField(this, "pluginName", "CellRangeDecorator");
      // --
      // protected props
      __publicField(this, "_options");
      __publicField(this, "_elem");
      __publicField(this, "_defaults", {
        selectionCssClass: "slick-range-decorator",
        selectionCss: {
          zIndex: "9999",
          border: "2px dashed red"
        },
        offset: { top: -1, left: -1, height: -2, width: -2 }
      });
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    destroy() {
      this.hide();
    }
    init() {
    }
    hide() {
      var _a;
      (_a = this._elem) == null || _a.remove(), this._elem = null;
    }
    show(range) {
      var _a;
      if (!this._elem) {
        this._elem = document.createElement("div"), this._elem.className = this._options.selectionCssClass, Object.keys(this._options.selectionCss).forEach((cssStyleKey) => {
          this._elem.style[cssStyleKey] = this._options.selectionCss[cssStyleKey];
        }), this._elem.style.position = "absolute";
        let canvasNode = this.grid.getActiveCanvasNode();
        canvasNode && canvasNode.appendChild(this._elem);
      }
      let from = this.grid.getCellNodeBox(range.fromRow, range.fromCell), to = this.grid.getCellNodeBox(range.toRow, range.toCell);
      return from && to && ((_a = this._options) != null && _a.offset) && (this._elem.style.top = `${from.top + this._options.offset.top}px`, this._elem.style.left = `${from.left + this._options.offset.left}px`, this._elem.style.height = `${to.bottom - from.top + this._options.offset.height}px`, this._elem.style.width = `${to.right - from.left + this._options.offset.width}px`), this._elem;
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellRangeDecorator: SlickCellRangeDecorator
    }
  });
})();
//# sourceMappingURL=slick.cellrangedecorator.js.map
