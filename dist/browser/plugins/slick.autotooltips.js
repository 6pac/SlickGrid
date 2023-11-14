"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.autotooltips.ts
  var Utils = Slick.Utils, SlickAutoTooltips = class {
    /**
     * Constructor of the SlickGrid 3rd party plugin, it can optionally receive options
     * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
     * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
     * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
     * @param {boolean} [options.replaceExisting=null]       - Allow preventing custom tooltips from being overwritten by auto tooltips
     */
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "AutoTooltips");
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        enableForCells: !0,
        enableForHeaderCells: !1,
        maxToolTipLength: void 0,
        replaceExisting: !0
      });
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    /**
     * Initialize plugin.
     */
    init(grid) {
      var _a, _b;
      this._grid = grid, (_a = this._options) != null && _a.enableForCells && this._grid.onMouseEnter.subscribe(this.handleMouseEnter.bind(this)), (_b = this._options) != null && _b.enableForHeaderCells && this._grid.onHeaderMouseEnter.subscribe(this.handleHeaderMouseEnter.bind(this));
    }
    /**
     * Destroy plugin.
     */
    destroy() {
      var _a, _b;
      (_a = this._options) != null && _a.enableForCells && this._grid.onMouseEnter.unsubscribe(this.handleMouseEnter.bind(this)), (_b = this._options) != null && _b.enableForHeaderCells && this._grid.onHeaderMouseEnter.unsubscribe(this.handleHeaderMouseEnter.bind(this));
    }
    /**
     * Handle mouse entering grid cell to add/remove tooltip.
     * @param {MouseEvent} event - The event
     */
    handleMouseEnter(event) {
      var _a, _b, _c, _d, _e;
      let cell = this._grid.getCellFromEvent(event);
      if (cell) {
        let node = this._grid.getCellNode(cell.row, cell.cell), text;
        this._options && node && (!node.title || (_a = this._options) != null && _a.replaceExisting) && (node.clientWidth < node.scrollWidth ? (text = (_c = (_b = node.textContent) == null ? void 0 : _b.trim()) != null ? _c : "", (_d = this._options) != null && _d.maxToolTipLength && text.length > ((_e = this._options) == null ? void 0 : _e.maxToolTipLength) && (text = text.substring(0, this._options.maxToolTipLength - 3) + "...")) : text = "", node.title = text), node = null;
      }
    }
    /**
     * Handle mouse entering header cell to add/remove tooltip.
     * @param {MouseEvent} event   - The event
     * @param {object} args.column - The column definition
     */
    handleHeaderMouseEnter(event, args) {
      var _a;
      let column = args.column, node, targetElm = event.target;
      if (targetElm && (node = targetElm.closest(".slick-header-column"), node && !(column != null && column.toolTip))) {
        let titleVal = targetElm.clientWidth < node.clientWidth && (_a = column == null ? void 0 : column.name) != null ? _a : "";
        node.title = titleVal instanceof HTMLElement ? titleVal.innerHTML : titleVal;
      }
      node = null;
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      AutoTooltips: SlickAutoTooltips
    }
  });
})();
//# sourceMappingURL=slick.autotooltips.js.map
