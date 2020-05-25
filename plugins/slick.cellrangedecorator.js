(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(grid, options) {
    var _elem;
    var _defaults = {
      selectionCssClass: 'slick-range-decorator',
      selectionCss: {
        "zIndex": "9999",
        "border": "2px dashed red"
      },
      offset: {
        top: -1,
        left: -1,
        height: -2,
        width: -2
      }
    };

    options = $.extend(true, {}, _defaults, options);


    function show(range) {
      if (!_elem) {
        _elem = $("<div></div>", {css: options.selectionCss})
          .addClass(options.selectionCssClass)
          .css("position", "absolute")
          .appendTo(grid.getActiveCanvasNode());
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      if (from && to && options && options.offset) {
        _elem.css({
          top: from.top + options.offset.top,
          left: from.left + options.offset.left,
          height: to.bottom - from.top + options.offset.height,
          width: to.right - from.left + options.offset.width
        });
      }

      return _elem;
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
    }

    $.extend(this, {
      "pluginName": "CellRangeDecorator",
      "show": show,
      "hide": hide
    });
  }
})(jQuery);
