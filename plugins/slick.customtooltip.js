/**
 * A plugin to add Custom Tooltip when hovering a cell, it subscribes to the cell "onMouseEnter" and "onMouseLeave" events.
 * The "customTooltip" is defined in the Column Definition OR Grid Options (the first found will have priority over the second)
 *
 * USAGE:
 *
 * Add the slick.customTooltip.(js|css) files and register it with the grid.
 *
 * To specify a tooltip when hovering a cell, extend the column definition like so:
 * var customTooltipPlugin = new Slick.Plugins.CustomTooltip(columns, grid options);
 *
 * Available plugin options (same options are available in both column definition and/or grid options)
 *  
 * Example 1  - via Column Definition
 *  var columns = [
 *    {
 *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
 *      customTooltip: {
 *        formatter: tooltipTaskFormatter,
 *        usabilityOverride: (args) => !!(args.dataContext?.id % 2) // show it only every second row
 *      }
 *    }
 *  ];
 * 
 *  OR Example 2 - via Grid Options (for all columns)
 *  var gridOptions = {
 *    enableCellNavigation: true,
 *    customTooltip: {
 *      formatter: tooltipTaskFormatter,
 *      usabilityOverride: (args) => !!(args.dataContext?.id % 2) // show it only every second row
 *    },
 *  };
 *
 * @param options {Object} Custom Tooltip Options
 * @class Slick.Plugins.CustomTooltip
 * @constructor
 */
(function ($) {
  // Register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "CustomTooltip": CustomTooltip
      }
    }
  });

  /**
   * CustomTooltip plugin to show/hide tooltips when columns are too narrow to fit content.
   * @constructor
   * @param {boolean} [options.className="slick-custom-tooltip"]  - custom tooltip class name
   * @param {boolean} [options.offsetTop=5]                       - tooltip offset from the top
   */
  function CustomTooltip(options) {
    var _dataView;
    var _grid;
    var _gridOptions;
    var _defaults = {
      className: 'slick-custom-tooltip',
      offsetTop: 5
    };
    var _eventHandler = new Slick.EventHandler();
    var _options;

    /**
     * Initialize plugin.
     */
    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      var _data = grid && grid.getData() || [];
      _dataView = Array.isArray(_data) ? null : _data;
      _gridOptions = grid.getOptions() || {};
      _eventHandler
        .subscribe(grid.onMouseEnter, handleOnMouseEnter)
        .subscribe(grid.onMouseLeave, hide);
    }

    /**
     * Destroy plugin.
     */
    function destroy() {
      hide();
      _eventHandler.unsubscribeAll();
    }

    /**
     * Handle mouse entering grid cell to show tooltip.
     * @param {jQuery.Event} e - The event
     */
    function handleOnMouseEnter(e, args) {
      if (_grid && e) {
        var cell = _grid.getCellFromEvent(e);
        if (cell) {
          var item = _dataView ? _dataView.getItem(cell.row) : _grid.getDataItem(cell.row);
          var columnDef = _grid.getColumns()[cell.cell];
          if (item && columnDef) {
            _options = $.extend(true, {}, _defaults, _gridOptions.customTooltip, columnDef.customTooltip);

            // run the override function (when defined), if the result is false it won't go further
            if (!args) {
              args = {};
            }
            args.cell = cell.cell;
            args.row = cell.row;
            args.columnDef = columnDef;
            args.dataContext = item;
            args.grid = _grid;
            if (!runOverrideFunctionWhenExists(_options.usabilityOverride, args)) {
              return;
            }

            if (typeof _options.formatter === 'function') {
              var itemValue = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
              var tooltipText = _options.formatter(cell.row, cell.cell, itemValue, columnDef, item, _grid);

              // create the tooltip DOM element with the text returned by the Formatter
              var tooltipElm = document.createElement('div');
              tooltipElm.className = _options.className + ' ' + _grid.getUID();
              tooltipElm.innerHTML = typeof tooltipText === 'object' ? tooltipText.text : tooltipText;
              document.body.appendChild(tooltipElm);

              // reposition the tooltip on top of the cell that triggered the mouse over event
              var cellPosition = getHtmlElementOffset(_grid.getCellNode(cell.row, cell.cell));
              tooltipElm.style.left = cellPosition.left + 'px';
              tooltipElm.style.top = cellPosition.top - tooltipElm.clientHeight - (_options.offsetTop || 0) + 'px';
            }
          }
        }
      }
    }

    function getHtmlElementOffset(element) {
      if (!element) {
        return undefined;
      }
      var rect = element.getBoundingClientRect();
      var top = 0;
      var left = 0;
      var bottom = 0;
      var right = 0;

      if (rect.top !== undefined && rect.left !== undefined) {
        top = rect.top + window.pageYOffset;
        left = rect.left + window.pageXOffset;
        right = rect.right;
        bottom = rect.bottom;
      }
      return { top: top, left: left, bottom: bottom, right: right };
    }

    /**
     * Hide (destroy) the tooltip when mouse entering header cell to add/remove tooltip.
     */
    function hide() {
      var prevTooltip = document.body.querySelector('.' + _options.className + '.' + _grid.getUID());
      if (prevTooltip && prevTooltip.remove) {
        prevTooltip.remove();
      }
    }

    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    function runOverrideFunctionWhenExists(overrideFn, args) {
      if (typeof overrideFn === 'function') {
        return overrideFn.call(this, args);
      }
      return true;
    }

    // Public API
    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "hide": hide,
      "pluginName": "CustomTooltip"
    });
  }
})(jQuery);