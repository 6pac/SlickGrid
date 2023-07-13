"use strict";
(() => {
  // src/plugins/slick.resizer.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils;
  function Resizer(_options, fixedDimensions) {
    let DATAGRID_MIN_HEIGHT = 180, DATAGRID_MIN_WIDTH = 300, DATAGRID_BOTTOM_PADDING = 20, _self = this, _fixedHeight, _fixedWidth, _grid, _gridOptions, _gridUid, _lastDimensions, _timer, _resizePaused = !1, _gridDomElm, _pageContainerElm, _gridContainerElm, _defaults = {
      bottomPadding: 20,
      applyResizeToContainer: !1,
      minHeight: 180,
      minWidth: 300,
      rightPadding: 0
    }, options = {}, _bindingEventService = new BindingEventService();
    function setOptions(_newOptions) {
      options = Utils.extend(!0, {}, _defaults, options, _newOptions);
    }
    function init(grid) {
      setOptions(_options), _grid = grid, _gridOptions = _grid.getOptions(), _gridUid = _grid.getUID(), _gridDomElm = _grid.getContainerNode(), typeof _options.container == "string" ? _pageContainerElm = typeof _options.container == "string" ? document.querySelector(_options.container) : _options.container : _pageContainerElm = _options.container, options.gridContainer && (_gridContainerElm = options.gridContainer), fixedDimensions && (_fixedHeight = fixedDimensions.height, _fixedWidth = fixedDimensions.width), _gridOptions && bindAutoResizeDataGrid();
    }
    function bindAutoResizeDataGrid(newSizes) {
      let gridElmOffset = Utils.offset(_gridDomElm);
      (_gridDomElm !== void 0 || gridElmOffset !== void 0) && (resizeGrid(0, newSizes, null), _bindingEventService.bind(window, "resize", function(event) {
        _self.onGridBeforeResize.notify({ grid: _grid }, event, _self), _resizePaused || (resizeGrid(0, newSizes, event), resizeGrid(0, newSizes, event));
      }));
    }
    function calculateGridNewDimensions() {
      let gridElmOffset = Utils.offset(_gridDomElm);
      if (!window || _pageContainerElm === void 0 || _gridDomElm === void 0 || gridElmOffset === void 0)
        return null;
      let bottomPadding = options && options.bottomPadding !== void 0 ? options.bottomPadding : DATAGRID_BOTTOM_PADDING, gridHeight = 0, gridOffsetTop = 0;
      options.calculateAvailableSizeBy === "container" ? gridHeight = Utils.innerSize(_pageContainerElm, "height") || 0 : (gridHeight = window.innerHeight || 0, gridOffsetTop = gridElmOffset !== void 0 ? gridElmOffset.top : 0);
      let availableHeight = gridHeight - gridOffsetTop - bottomPadding, availableWidth = Utils.innerSize(_pageContainerElm, "width") || window.innerWidth || 0, maxHeight = options && options.maxHeight || void 0, minHeight = options && options.minHeight !== void 0 ? options.minHeight : DATAGRID_MIN_HEIGHT, maxWidth = options && options.maxWidth || void 0, minWidth = options && options.minWidth !== void 0 ? options.minWidth : DATAGRID_MIN_WIDTH, newHeight = availableHeight, newWidth = options && options.rightPadding ? availableWidth - options.rightPadding : availableWidth;
      return newHeight < minHeight && (newHeight = minHeight), maxHeight && newHeight > maxHeight && (newHeight = maxHeight), newWidth < minWidth && (newWidth = minWidth), maxWidth && newWidth > maxWidth && (newWidth = maxWidth), {
        height: _fixedHeight || newHeight,
        width: _fixedWidth || newWidth
      };
    }
    function destroy() {
      _self.onGridBeforeResize.unsubscribe(), _self.onGridAfterResize.unsubscribe(), _bindingEventService.unbindAll();
    }
    function getLastResizeDimensions() {
      return _lastDimensions;
    }
    function pauseResizer(isResizePaused) {
      _resizePaused = isResizePaused;
    }
    function resizeGrid(delay, newSizes, event) {
      if (delay = delay || 0, typeof Promise == "function")
        return new Promise(function(resolve) {
          delay > 0 ? (clearTimeout(_timer), _timer = setTimeout(function() {
            resolve(resizeGridCallback(newSizes, event));
          }, delay)) : resolve(resizeGridCallback(newSizes, event));
        });
      delay > 0 ? (clearTimeout(_timer), _timer = setTimeout(function() {
        resizeGridCallback(newSizes, event);
      }, delay)) : resizeGridCallback(newSizes, event);
    }
    function resizeGridCallback(newSizes, event) {
      let lastDimensions = resizeGridWithDimensions(newSizes);
      return _self.onGridAfterResize.notify({ grid: _grid, dimensions: lastDimensions }, event, _self), lastDimensions;
    }
    function resizeGridWithDimensions(newSizes) {
      let availableDimensions = calculateGridNewDimensions();
      if ((newSizes || availableDimensions) && _gridDomElm)
        try {
          let newHeight = newSizes && newSizes.height ? newSizes.height : availableDimensions.height, newWidth = newSizes && newSizes.width ? newSizes.width : availableDimensions.width;
          _gridOptions.autoHeight || (_gridDomElm.style.height = `${newHeight}px`), _gridDomElm.style.width = `${newWidth}px`, _gridContainerElm && (_gridContainerElm.style.width = `${newWidth}px`), new RegExp("MSIE [6-8]").exec(navigator.userAgent) === null && _grid && _grid.resizeCanvas && _grid.resizeCanvas(), _gridOptions && _gridOptions.enableAutoSizeColumns && _grid.autosizeColumns && _gridUid && document.querySelector(`.${_gridUid}`) && _grid.autosizeColumns(), _lastDimensions = {
            height: newHeight,
            width: newWidth
          };
        } catch (e) {
          destroy();
        }
      return _lastDimensions;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "Resizer",
      bindAutoResizeDataGrid,
      getLastResizeDimensions,
      pauseResizer,
      resizeGrid,
      setOptions,
      onGridAfterResize: new SlickEvent(),
      onGridBeforeResize: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        Resizer
      }
    }
  });
})();
