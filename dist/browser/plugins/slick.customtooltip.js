"use strict";
(() => {
  // src/plugins/slick.customtooltip.js
  var EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function CustomTooltip(options) {
    var _cancellablePromise, _cellNodeElm, _dataView, _grid, _gridOptions, _tooltipElm, _defaults = {
      className: "slick-custom-tooltip",
      offsetLeft: 0,
      offsetRight: 0,
      offsetTopBottom: 4,
      hideArrow: !1,
      tooltipTextMaxLength: 700,
      regularTooltipWhiteSpace: "pre-line",
      whiteSpace: "normal"
    }, _eventHandler = new EventHandler(), _cellTooltipOptions = {}, _options;
    function init(grid) {
      _grid = grid;
      var _data = grid && grid.getData() || [];
      _dataView = Array.isArray(_data) ? null : _data, _gridOptions = grid.getOptions() || {}, _options = Utils.extend(!0, {}, _defaults, _gridOptions.customTooltip, options), _eventHandler.subscribe(grid.onMouseEnter, handleOnMouseEnter).subscribe(grid.onHeaderMouseEnter, handleOnHeaderMouseEnter).subscribe(grid.onHeaderRowMouseEnter, handleOnHeaderRowMouseEnter).subscribe(grid.onMouseLeave, hideTooltip).subscribe(grid.onHeaderMouseLeave, hideTooltip).subscribe(grid.onHeaderRowMouseLeave, hideTooltip);
    }
    function destroy() {
      hideTooltip(), _eventHandler.unsubscribeAll();
    }
    function handleOnHeaderMouseEnter(e, args) {
      handleOnHeaderMouseEnterByType(e, args, "slick-header-column");
    }
    function handleOnHeaderRowMouseEnter(e, args) {
      handleOnHeaderMouseEnterByType(e, args, "slick-headerrow-column");
    }
    function handleOnHeaderMouseEnterByType(e, args, selector) {
      hideTooltip();
      var cell = {
        row: -1,
        // negative row to avoid pulling any dataContext while rendering
        cell: _grid.getColumns().findIndex(function(col) {
          return args && args.column && args.column.id === col.id;
        })
      }, columnDef = args.column, item = {}, isHeaderRowType = selector === "slick-headerrow-column";
      if (args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = _grid, args.type = isHeaderRowType ? "header-row" : "header", _cellTooltipOptions = Utils.extend(!0, {}, _options, columnDef.customTooltip), !(columnDef && columnDef.disableTooltip || !runOverrideFunctionWhenExists(_cellTooltipOptions.usabilityOverride, args)) && columnDef && e.target) {
        _cellNodeElm = findClosestHeaderNode(e.target, selector);
        var formatter = isHeaderRowType ? _cellTooltipOptions.headerRowFormatter : _cellTooltipOptions.headerFormatter;
        if (_cellTooltipOptions.useRegularTooltip || !formatter) {
          var formatterOrText = isHeaderRowType ? _cellTooltipOptions.useRegularTooltip ? null : formatter : columnDef.name;
          renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
        } else
          _cellNodeElm && typeof formatter == "function" && renderTooltipFormatter(formatter, cell, null, columnDef, item);
      }
    }
    function findClosestHeaderNode(elm, selector) {
      return typeof elm.closest == "function" ? elm.closest("." + selector) : elm.classList.contains(selector) ? elm : elm.parentElement.classList.contains(selector) ? elm.parentElement : null;
    }
    function handleOnMouseEnter(e, args) {
      if (hideTooltip(), _grid && e) {
        var cell = _grid.getCellFromEvent(e);
        if (cell) {
          var item = _dataView ? _dataView.getItem(cell.row) : _grid.getDataItem(cell.row), columnDef = _grid.getColumns()[cell.cell];
          if (_cellNodeElm = _grid.getCellNode(cell.row, cell.cell), _cellTooltipOptions = Utils.extend(!0, {}, _options, columnDef.customTooltip), item && columnDef) {
            if (args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = _grid, args.type = "cell", columnDef && columnDef.disableTooltip || !runOverrideFunctionWhenExists(_cellTooltipOptions.usabilityOverride, args))
              return;
            var value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
            if (_cellTooltipOptions.useRegularTooltip || !_cellTooltipOptions.formatter)
              renderRegularTooltip(columnDef.formatter, cell, value, columnDef, item);
            else if (typeof _cellTooltipOptions.formatter == "function" && renderTooltipFormatter(_cellTooltipOptions.formatter, cell, value, columnDef, item), typeof _cellTooltipOptions.asyncProcess == "function") {
              var asyncProcess = _cellTooltipOptions.asyncProcess(cell.row, cell.cell, value, columnDef, item, _grid);
              if (!_cellTooltipOptions.asyncPostFormatter)
                throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
              asyncProcess instanceof Promise && (_cancellablePromise = cancellablePromise(asyncProcess), _cancellablePromise.promise.then(function(asyncResult) {
                asyncProcessCallback(asyncResult, cell, value, columnDef, item);
              }).catch(function(error) {
                if (!error.isPromiseCancelled)
                  throw error;
              }));
            }
          }
        }
      }
    }
    function findFirstElementAttribute(inputElm, attributes) {
      if (inputElm) {
        var outputAttrData;
        return attributes.forEach(function(attribute) {
          var attrData = inputElm.getAttribute(attribute);
          attrData && (outputAttrData = attrData);
        }), outputAttrData;
      }
      return null;
    }
    function renderRegularTooltip(formatterOrText, cell, value, columnDef, item) {
      var tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item);
      var tooltipText = columnDef.toolTip || "", tmpTitleElm;
      tooltipText || (_cellNodeElm && _cellNodeElm.clientWidth < _cellNodeElm.scrollWidth && !_cellTooltipOptions.useRegularTooltipFromFormatterOnly ? (tooltipText = (_cellNodeElm.textContent || "").trim() || "", _cellTooltipOptions.tooltipTextMaxLength && tooltipText.length > _cellTooltipOptions.tooltipTextMaxLength && (tooltipText = tooltipText.substring(0, _cellTooltipOptions.tooltipTextMaxLength - 3) + "..."), tmpTitleElm = _cellNodeElm) : (_cellTooltipOptions.useRegularTooltipFromFormatterOnly ? tmpTitleElm = tmpDiv.querySelector("[title], [data-slick-tooltip]") : (tmpTitleElm = findFirstElementAttribute(_cellNodeElm, ["title", "data-slick-tooltip"]) ? _cellNodeElm : tmpDiv.querySelector("[title], [data-slick-tooltip]"), (!tmpTitleElm || !findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"])) && _cellNodeElm && (tmpTitleElm = _cellNodeElm.querySelector("[title], [data-slick-tooltip]"))), (!tooltipText || typeof formatterOrText == "function" && _cellTooltipOptions.useRegularTooltipFromFormatterOnly) && (tooltipText = findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"]) || ""))), tooltipText !== "" && renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText), swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
    }
    function swapAndClearTitleAttribute(inputTitleElm, tooltipText) {
      var titleElm = inputTitleElm || _cellNodeElm && (_cellNodeElm.hasAttribute("title") && _cellNodeElm.getAttribute("title") ? _cellNodeElm : _cellNodeElm.querySelector("[title]"));
      titleElm && (titleElm.setAttribute("data-slick-tooltip", tooltipText || ""), titleElm.hasAttribute("title") && titleElm.setAttribute("title", ""));
    }
    function asyncProcessCallback(asyncResult, cell, value, columnDef, dataContext) {
      hideTooltip();
      var itemWithAsyncData = Utils.extend(!0, {}, dataContext, { [_cellTooltipOptions.asyncParamsPropName || "__params"]: asyncResult });
      renderTooltipFormatter(_cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
    }
    function calculateAvailableSpaceTop(element) {
      var availableSpace = 0, pageScrollTop = Utils.windowScrollPosition().top, elmOffset = getHtmlElementOffset(element);
      if (elmOffset) {
        var elementOffsetTop = elmOffset.top;
        availableSpace = elementOffsetTop - pageScrollTop;
      }
      return availableSpace;
    }
    function cancellablePromise(inputPromise) {
      var hasCancelled = !1;
      return inputPromise instanceof Promise ? {
        promise: inputPromise.then(function(result) {
          if (hasCancelled)
            throw { isPromiseCancelled: !0 };
          return result;
        }),
        cancel: function() {
          hasCancelled = !0;
        }
      } : inputPromise;
    }
    function getHtmlElementOffset(element) {
      if (element) {
        var rect = element.getBoundingClientRect(), top = 0, left = 0, bottom = 0, right = 0;
        return rect.top !== void 0 && rect.left !== void 0 && (top = rect.top + window.pageYOffset, left = rect.left + window.pageXOffset, right = rect.right, bottom = rect.bottom), { top, left, bottom, right };
      }
    }
    function hideTooltip() {
      _cancellablePromise && _cancellablePromise.cancel && _cancellablePromise.cancel();
      var prevTooltip = document.body.querySelector("." + _cellTooltipOptions.className + "." + _grid.getUID());
      prevTooltip && prevTooltip.remove && prevTooltip.remove();
    }
    function reposition(cell) {
      if (_tooltipElm) {
        _cellNodeElm = _cellNodeElm || _grid.getCellNode(cell.row, cell.cell);
        var cellPosition = getHtmlElementOffset(_cellNodeElm), cellContainerWidth = _cellNodeElm.offsetWidth, calculatedTooltipHeight = _tooltipElm.getBoundingClientRect().height, calculatedTooltipWidth = _tooltipElm.getBoundingClientRect().width, calculatedBodyWidth = document.body.offsetWidth || window.innerWidth, newPositionTop = cellPosition.top - _tooltipElm.offsetHeight - (_cellTooltipOptions.offsetTopBottom || 0), newPositionLeft = (cellPosition && cellPosition.left || 0) - (_cellTooltipOptions.offsetRight || 0), position = _cellTooltipOptions.position || "auto";
        position === "center" ? (newPositionLeft += cellContainerWidth / 2 - calculatedTooltipWidth / 2 + (_cellTooltipOptions.offsetRight || 0), _tooltipElm.classList.remove("arrow-left-align"), _tooltipElm.classList.remove("arrow-right-align"), _tooltipElm.classList.add("arrow-center-align")) : position === "right-align" || (position === "auto" || position !== "left-align") && newPositionLeft + calculatedTooltipWidth > calculatedBodyWidth ? (newPositionLeft -= calculatedTooltipWidth - cellContainerWidth - (_cellTooltipOptions.offsetLeft || 0), _tooltipElm.classList.remove("arrow-center-align"), _tooltipElm.classList.remove("arrow-left-align"), _tooltipElm.classList.add("arrow-right-align")) : (_tooltipElm.classList.remove("arrow-center-align"), _tooltipElm.classList.remove("arrow-right-align"), _tooltipElm.classList.add("arrow-left-align")), position === "bottom" || position === "auto" && calculatedTooltipHeight > calculateAvailableSpaceTop(_cellNodeElm) ? (newPositionTop = cellPosition.top + (_gridOptions.rowHeight || 0) + (_cellTooltipOptions.offsetTopBottom || 0), _tooltipElm.classList.remove("arrow-down"), _tooltipElm.classList.add("arrow-up")) : (_tooltipElm.classList.add("arrow-down"), _tooltipElm.classList.remove("arrow-up")), _tooltipElm.style.top = newPositionTop + "px", _tooltipElm.style.left = newPositionLeft + "px";
      }
    }
    function parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item) {
      if (typeof formatterOrText == "function") {
        var tooltipText = formatterOrText(cell.row, cell.cell, value, columnDef, item, _grid), formatterText = typeof tooltipText == "object" && tooltipText && tooltipText.text ? tooltipText.text : typeof tooltipText == "string" ? tooltipText : "";
        return _grid.sanitizeHtmlString(formatterText);
      } else if (typeof formatterOrText == "string")
        return _grid.sanitizeHtmlString(formatterOrText);
      return "";
    }
    function renderTooltipFormatter(formatter, cell, value, columnDef, item, tooltipText, inputTitleElm) {
      _tooltipElm = document.createElement("div"), _tooltipElm.className = _cellTooltipOptions.className, _tooltipElm.classList.add(_grid.getUID()), _tooltipElm.classList.add("l" + cell.cell), _tooltipElm.classList.add("r" + cell.cell);
      var outputText = tooltipText || parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || "";
      outputText = _cellTooltipOptions.tooltipTextMaxLength && outputText.length > _cellTooltipOptions.tooltipTextMaxLength ? outputText.substring(0, _cellTooltipOptions.tooltipTextMaxLength - 3) + "..." : outputText;
      let finalOutputText = "";
      !tooltipText || _cellTooltipOptions && _cellTooltipOptions.renderRegularTooltipAsHtml ? (finalOutputText = _grid.sanitizeHtmlString(outputText), _tooltipElm.innerHTML = finalOutputText, _tooltipElm.style.whiteSpace = _cellTooltipOptions && _cellTooltipOptions.whiteSpace || _defaults.whiteSpace) : (finalOutputText = outputText || "", _tooltipElm.textContent = finalOutputText, _tooltipElm.style.whiteSpace = _cellTooltipOptions && _cellTooltipOptions.regularTooltipWhiteSpace || _defaults.regularTooltipWhiteSpace), _cellTooltipOptions.maxHeight && (_tooltipElm.style.maxHeight = _cellTooltipOptions.maxHeight + "px"), _cellTooltipOptions.maxWidth && (_tooltipElm.style.maxWidth = _cellTooltipOptions.maxWidth + "px"), finalOutputText && (document.body.appendChild(_tooltipElm), reposition(cell), _cellTooltipOptions.hideArrow || _tooltipElm.classList.add("tooltip-arrow"), swapAndClearTitleAttribute(inputTitleElm, outputText));
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    function setOptions(newOptions) {
      _options = Utils.extend({}, _options, newOptions);
    }
    Utils.extend(this, {
      init,
      destroy,
      hide: hideTooltip,
      setOptions,
      pluginName: "CustomTooltip"
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        CustomTooltip
      }
    }
  });
})();
//# sourceMappingURL=slick.customtooltip.js.map
