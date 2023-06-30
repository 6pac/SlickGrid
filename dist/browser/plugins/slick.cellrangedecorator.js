"use strict";
(() => {
  // src/plugins/slick.cellrangedecorator.js
  var Utils = Slick.Utils;
  function CellRangeDecorator(grid, options) {
    var _elem, _defaults = {
      selectionCssClass: "slick-range-decorator",
      selectionCss: {
        zIndex: "9999",
        border: "2px dashed red"
      },
      offset: { top: -1, left: -1, height: -2, width: -2 }
    };
    options = Utils.extend(!0, {}, _defaults, options);
    function show(range) {
      if (!_elem) {
        _elem = document.createElement("div"), _elem.className = options.selectionCssClass, Object.keys(options.selectionCss).forEach((cssStyleKey) => {
          _elem.style[cssStyleKey] = options.selectionCss[cssStyleKey];
        }), _elem.style.position = "absolute";
        let canvasNode = grid.getActiveCanvasNode();
        canvasNode && canvasNode.appendChild(_elem);
      }
      var from = grid.getCellNodeBox(range.fromRow, range.fromCell), to = grid.getCellNodeBox(range.toRow, range.toCell);
      return from && to && options && options.offset && (_elem.style.top = `${from.top + options.offset.top}px`, _elem.style.left = `${from.left + options.offset.left}px`, _elem.style.height = `${to.bottom - from.top + options.offset.height}px`, _elem.style.width = `${to.right - from.left + options.offset.width}px`), _elem;
    }
    function destroy() {
      hide();
    }
    function hide() {
      _elem && (_elem.remove(), _elem = null);
    }
    Utils.extend(this, {
      pluginName: "CellRangeDecorator",
      show,
      hide,
      destroy
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellRangeDecorator
    }
  });
})();
