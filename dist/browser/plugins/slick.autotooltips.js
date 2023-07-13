"use strict";
(() => {
  // src/plugins/slick.autotooltips.ts
  var Utils = Slick.Utils;
  function SlickAutoTooltips(options) {
    let _grid, _defaults = {
      enableForCells: !0,
      enableForHeaderCells: !1,
      maxToolTipLength: void 0,
      replaceExisting: !0
    };
    function init(grid) {
      options = Utils.extend(!0, {}, _defaults, options), _grid = grid, options.enableForCells && _grid.onMouseEnter.subscribe(handleMouseEnter), options.enableForHeaderCells && _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
    }
    function destroy() {
      options.enableForCells && _grid.onMouseEnter.unsubscribe(handleMouseEnter), options.enableForHeaderCells && _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
    }
    function handleMouseEnter(event) {
      var _a, _b;
      let cell = _grid.getCellFromEvent(event);
      if (cell) {
        let node = _grid.getCellNode(cell.row, cell.cell), text;
        options && node && (!node.title || options != null && options.replaceExisting) && (node.clientWidth < node.scrollWidth ? (text = (_b = (_a = node.textContent) == null ? void 0 : _a.trim()) != null ? _b : "", options && options.maxToolTipLength && text.length > options.maxToolTipLength && (text = text.substring(0, options.maxToolTipLength - 3) + "...")) : text = "", node.title = text), node = null;
      }
    }
    function handleHeaderMouseEnter(event, args) {
      var _a;
      let column = args.column, node, targetElm = event.target;
      targetElm && (node = targetElm.closest(".slick-header-column"), node && !(column && column.toolTip) && (node.title = targetElm.clientWidth < node.clientWidth && (_a = column == null ? void 0 : column.name) != null ? _a : "")), node = null;
    }
    return {
      init,
      destroy,
      pluginName: "AutoTooltips"
    };
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      AutoTooltips: SlickAutoTooltips
    }
  });
})();
