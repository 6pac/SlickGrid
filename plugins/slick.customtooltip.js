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
 *        usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *      }
 *    }
 *  ];
 * 
 *  OR Example 2 - via Grid Options (for all columns)
 *  var gridOptions = {
 *    enableCellNavigation: true,
 *    customTooltip: {
 *      formatter: tooltipTaskFormatter,
 *      usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *    },
 *  };
 *
 * @param options {Object} Custom Tooltip Options
 * @class Slick.Plugins.CustomTooltip
 * @varructor
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
   * @varructor
   * @param {boolean} [options.className="slick-custom-tooltip"]  - custom tooltip class name
   * @param {boolean} [options.offsetTop=5]                       - tooltip offset from the top
   */
  function CustomTooltip(options) {
    var _cancellablePromise;
    var _dataView;
    var _grid;
    var _gridOptions;
    var _tooltipElm;
    var _defaults = {
      className: 'slick-custom-tooltip',
      offsetLeft: 0,
      offsetRight: 0,
      offsetTopBottom: 4,
      hideArrow: false,
    };
    var _eventHandler = new Slick.EventHandler();
    var _options;

    /**
     * Initialize plugin.
     */
    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      var _data = grid && grid.getData() || [];
      _dataView = Array.isArray(_data) ? null : _data;
      _gridOptions = grid.getOptions() || {};
      _eventHandler
        .subscribe(grid.onMouseEnter, handleOnMouseEnter)
        .subscribe(grid.onMouseLeave, hideTooltip);
    }

    /**
     * Destroy plugin.
     */
    function destroy() {
      hideTooltip();
      _eventHandler.unsubscribeAll();
    }

    /**
     * Handle mouse entering grid cell to show tooltip.
     * @param {jQuery.Event} e - The event
     */
    function handleOnMouseEnter(e, args) {
      // before doing anything, let's remove any previous tooltip before
      // and cancel any opened Promise/Observable when using async
      hideTooltip();

      if (_grid && e) {
        var cell = _grid.getCellFromEvent(e);
        if (cell) {
          var item = _dataView ? _dataView.getItem(cell.row) : _grid.getDataItem(cell.row);
          var columnDef = _grid.getColumns()[cell.cell];
          if (item && columnDef) {
            _options = $.extend(true, {}, _options, _gridOptions.customTooltip, columnDef.customTooltip);

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

            var value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
            if (typeof _options.formatter === 'function') {
              renderTooltipFormatter(value, columnDef, item, _options.formatter, cell);
            }
            if (typeof _options.asyncPostProcess === 'function') {
              var asyncProcess = _options.asyncPostProcess(cell.row, cell.cell, value, columnDef, item, _grid);
              if (!_options.asyncPostFormatter) {
                throw new Error('[Slickgrid-Universal] when using "asyncPostProcess", you must also provide an "asyncPostFormatter" formatter');
              }

              if (asyncProcess instanceof Promise) {
                // create a new cancellable promise which will resolve, unless it's cancelled, with the udpated `dataContext` object that includes the `__params`
                _cancellablePromise = cancellablePromise(asyncProcess);
                _cancellablePromise.promise
                  .then(function (asyncResult) {
                    asyncProcessCallback(asyncResult, cell, value, columnDef, item)
                  })
                  .catch(function (error) {
                    // we will throw back any errors, unless it's a cancelled promise which in that case will be disregarded (thrown by the promise wrapper cancel() call)
                    if (!(error.isPromiseCancelled)) {
                      throw error;
                    }
                  });
              }
            }
          }
        }
      }
    }

    function asyncProcessCallback(asyncResult, cell, value, columnDef, dataContext) {
      hideTooltip();
      var itemWithAsyncData = $.extend(true, {}, dataContext, { [_options.asyncParamsPropName || '__params']: asyncResult });
      renderTooltipFormatter(value, columnDef, itemWithAsyncData, _options.asyncPostFormatter, cell);
    }


    function calculateAvailableSpaceTop(element) {
      let availableSpace = 0;
      var pageScrollTop = windowScrollPosition().top;
      var elmOffset = getHtmlElementOffset(element);
      if (elmOffset) {
        var elementOffsetTop = elmOffset.top;
        availableSpace = elementOffsetTop - pageScrollTop;
      }
      return availableSpace;
    }

    function cancellablePromise(inputPromise) {
      let hasCancelled = false;

      if (inputPromise instanceof Promise) {
        return {
          promise: inputPromise.then(function (result) {
            if (hasCancelled) {
              throw { isPromiseCancelled: true };
            }
            return result;
          }),
          cancel: function () {
            hasCancelled = true;
          }
        };
      }
      return inputPromise;
    }

    function windowScrollPosition() {
      return {
        left: window.pageXOffset || document.documentElement.scrollLeft || 0,
        top: window.pageYOffset || document.documentElement.scrollTop || 0,
      };
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
     * hide (remove) tooltip from the DOM,
     * when using async process, it will also cancel any opened Promise/Observable that might still be opened/pending.
     */
    function hideTooltip() {
      if (_cancellablePromise && _cancellablePromise.cancel) {
        _cancellablePromise.cancel();
      }
      var prevTooltip = document.body.querySelector('.' + _options.className + '.' + _grid.getUID());
      if (prevTooltip && prevTooltip.remove) {
        prevTooltip.remove();
      }
    }

    /**
     * Reposition the Tooltip to be top-left position over the cell.
     * By default we use an "auto" mode which will allow to position the Tooltip to the best logical position in the window, also when we mention position, we are talking about the relative position against the grid cell.
     * We can assume that in 80% of the time the default position is top-right, the default is "auto" but we can also override it and use a specific position.
     * Most of the time positioning of the tooltip will be to the "top-right" of the cell is ok but if our column is completely on the right side then we'll want to change the position to "left" align.
     * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are hovering a cell at the top of the grid and there's no room to display it then we might need to reposition to "bottom" instead.
     */
    function reposition(cell) {
      if (_tooltipElm) {
        var cellElm = _grid.getCellNode(cell.row, cell.cell);
        var cellPosition = getHtmlElementOffset(cellElm);
        var containerWidth = cellElm.offsetWidth;
        var calculatedTooltipHeight = _tooltipElm.getBoundingClientRect().height;
        var calculatedTooltipWidth = _tooltipElm.getBoundingClientRect().width;
        var calculatedBodyWidth = document.body.offsetWidth || window.innerWidth;

        // first calculate the default (top/left) position
        let newPositionTop = cellPosition.top - _tooltipElm.offsetHeight - (_options.offsetTopBottom || 0);
        let newPositionLeft = (cellPosition && cellPosition.left || 0) - (_options.offsetLeft || 0);

        // user could explicitely use a "left" position (when user knows his column is completely on the right)
        // or when using "auto" and we detect not enough available space then we'll position to the "left" of the cell
        var position = _options.position || 'auto';
        if (position === 'left' || (position === 'auto' && (newPositionLeft + calculatedTooltipWidth) > calculatedBodyWidth)) {
          newPositionLeft -= (calculatedTooltipWidth - containerWidth - (_options.offsetRight || 0));
          _tooltipElm.classList.remove('arrow-left');
          _tooltipElm.classList.add('arrow-right');
        } else {
          _tooltipElm.classList.add('arrow-left');
          _tooltipElm.classList.remove('arrow-right');
        }

        // do the same calculation/reposition with top/bottom (default is top of the cell or in other word starting from the cell going down)
        if (position === 'top' || (position === 'auto' && calculatedTooltipHeight > calculateAvailableSpaceTop(cellElm))) {
          newPositionTop = cellPosition.top + (_gridOptions.rowHeight || 0) + (_options.offsetTopBottom || 0);
          _tooltipElm.classList.remove('arrow-down');
          _tooltipElm.classList.add('arrow-up');
        } else {
          _tooltipElm.classList.add('arrow-down');
          _tooltipElm.classList.remove('arrow-up');
        }

        // reposition the editor over the cell (90% of the time this will end up using a position on the "right" of the cell)
        _tooltipElm.style.top = newPositionTop + 'px';
        _tooltipElm.style.left = newPositionLeft + 'px';
      }
    }

    function renderTooltipFormatter(value, columnDef, item, formatter, cell) {
      if (typeof formatter === 'function') {
        var tooltipText = formatter(cell.row, cell.cell, value, columnDef, item, _grid);

        // create the tooltip DOM element with the text returned by the Formatter
        _tooltipElm = document.createElement('div');
        _tooltipElm.className = _options.className + ' ' + _grid.getUID();
        _tooltipElm.innerHTML = typeof tooltipText === 'object' ? tooltipText.text : tooltipText;
        document.body.appendChild(_tooltipElm);

        // reposition the tooltip on top of the cell that triggered the mouse over event
        reposition(cell);

        // user could optionally hide the tooltip arrow (we can simply update the CSS variables, that's the only way we have to update CSS pseudo)
        if (!_options.hideArrow) {
          _tooltipElm.classList.add('tooltip-arrow');
        }
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

    function setOptions(newOptions) {
      _options = $.extend({}, _options, newOptions);
    }

    // Public API
    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "hide": hideTooltip,
      "setOptions": setOptions,
      "pluginName": "CustomTooltip"
    });
  }
})(jQuery);