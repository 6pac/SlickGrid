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

  // src/plugins/slick.resizer.js
  var require_slick_resizer = __commonJS({
    "src/plugins/slick.resizer.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickResizer = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils, DATAGRID_MIN_HEIGHT = 180, DATAGRID_MIN_WIDTH = 300, DATAGRID_BOTTOM_PADDING = 20, SlickResizer = (
        /** @class */
        function() {
          function SlickResizer2(options, fixedDimensions) {
            this.pluginName = "Resizer", this.onGridAfterResize = new SlickEvent(), this.onGridBeforeResize = new SlickEvent(), this._gridUid = "", this._resizePaused = !1, this._defaults = {
              bottomPadding: 20,
              applyResizeToContainer: !1,
              minHeight: 180,
              minWidth: 300,
              rightPadding: 0
            }, this._bindingEventService = new BindingEventService(), this._options = Utils.extend(!0, {}, this._defaults, options), fixedDimensions && (this._fixedHeight = fixedDimensions.height, this._fixedWidth = fixedDimensions.width);
          }
          return SlickResizer2.prototype.setOptions = function(newOptions) {
            this._options = Utils.extend(!0, {}, this._defaults, this._options, newOptions);
          }, SlickResizer2.prototype.init = function(grid) {
            this.setOptions(this._options), this._grid = grid, this._gridOptions = this._grid.getOptions(), this._gridUid = this._grid.getUID(), this._gridDomElm = this._grid.getContainerNode(), this._pageContainerElm = typeof this._options.container == "string" ? document.querySelector(this._options.container) : this._options.container, this._options.gridContainer && (this._gridContainerElm = this._options.gridContainer), this._gridOptions && this.bindAutoResizeDataGrid();
          }, SlickResizer2.prototype.bindAutoResizeDataGrid = function(newSizes) {
            var _this = this, gridElmOffset = Utils.offset(this._gridDomElm);
            (this._gridDomElm !== void 0 || gridElmOffset !== void 0) && (this.resizeGrid(0, newSizes, null), this._bindingEventService.bind(window, "resize", function(event) {
              _this.onGridBeforeResize.notify({ grid: _this._grid }, event, _this), _this._resizePaused || (_this.resizeGrid(0, newSizes, event), _this.resizeGrid(0, newSizes, event));
            }));
          }, SlickResizer2.prototype.calculateGridNewDimensions = function() {
            var _a, _b, _c, _d, _e, _f, gridElmOffset = Utils.offset(this._gridDomElm);
            if (!window || this._pageContainerElm === void 0 || this._gridDomElm === void 0 || gridElmOffset === void 0)
              return null;
            var bottomPadding = ((_a = this._options) === null || _a === void 0 ? void 0 : _a.bottomPadding) !== void 0 ? this._options.bottomPadding : DATAGRID_BOTTOM_PADDING, gridHeight = 0, gridOffsetTop = 0;
            this._options.calculateAvailableSizeBy === "container" ? gridHeight = Utils.innerSize(this._pageContainerElm, "height") || 0 : (gridHeight = window.innerHeight || 0, gridOffsetTop = gridElmOffset !== void 0 ? gridElmOffset.top : 0);
            var availableHeight = gridHeight - gridOffsetTop - bottomPadding, availableWidth = Utils.innerSize(this._pageContainerElm, "width") || window.innerWidth || 0, maxHeight = ((_b = this._options) === null || _b === void 0 ? void 0 : _b.maxHeight) || void 0, minHeight = ((_c = this._options) === null || _c === void 0 ? void 0 : _c.minHeight) !== void 0 ? this._options.minHeight : DATAGRID_MIN_HEIGHT, maxWidth = ((_d = this._options) === null || _d === void 0 ? void 0 : _d.maxWidth) || void 0, minWidth = ((_e = this._options) === null || _e === void 0 ? void 0 : _e.minWidth) !== void 0 ? this._options.minWidth : DATAGRID_MIN_WIDTH, newHeight = availableHeight, newWidth = !((_f = this._options) === null || _f === void 0) && _f.rightPadding ? availableWidth - this._options.rightPadding : availableWidth;
            return newHeight < minHeight && (newHeight = minHeight), maxHeight && newHeight > maxHeight && (newHeight = maxHeight), newWidth < minWidth && (newWidth = minWidth), maxWidth && newWidth > maxWidth && (newWidth = maxWidth), {
              height: this._fixedHeight || newHeight,
              width: this._fixedWidth || newWidth
            };
          }, SlickResizer2.prototype.destroy = function() {
            this.onGridBeforeResize.unsubscribe(), this.onGridAfterResize.unsubscribe(), this._bindingEventService.unbindAll();
          }, SlickResizer2.prototype.getLastResizeDimensions = function() {
            return this._lastDimensions;
          }, SlickResizer2.prototype.pauseResizer = function(isResizePaused) {
            this._resizePaused = isResizePaused;
          }, SlickResizer2.prototype.resizeGrid = function(delay, newSizes, event) {
            var _this = this, resizeDelay = delay || 0;
            if (typeof Promise == "function")
              return new Promise(function(resolve) {
                resizeDelay > 0 ? (clearTimeout(_this._timer), _this._timer = setTimeout(function() {
                  resolve(_this.resizeGridCallback(newSizes, event));
                }, resizeDelay)) : resolve(_this.resizeGridCallback(newSizes, event));
              });
            resizeDelay > 0 ? (clearTimeout(this._timer), this._timer = setTimeout(function() {
              _this.resizeGridCallback(newSizes, event);
            }, resizeDelay)) : this.resizeGridCallback(newSizes, event);
          }, SlickResizer2.prototype.resizeGridCallback = function(newSizes, event) {
            var lastDimensions = this.resizeGridWithDimensions(newSizes);
            return this.onGridAfterResize.notify({ grid: this._grid, dimensions: lastDimensions }, event, this), lastDimensions;
          }, SlickResizer2.prototype.resizeGridWithDimensions = function(newSizes) {
            var _a, _b, availableDimensions = this.calculateGridNewDimensions();
            if ((newSizes || availableDimensions) && this._gridDomElm)
              try {
                var newHeight = newSizes != null && newSizes.height ? newSizes.height : availableDimensions == null ? void 0 : availableDimensions.height, newWidth = newSizes != null && newSizes.width ? newSizes.width : availableDimensions == null ? void 0 : availableDimensions.width;
                this._gridOptions.autoHeight || (this._gridDomElm.style.height = "".concat(newHeight, "px")), this._gridDomElm.style.width = "".concat(newWidth, "px"), this._gridContainerElm && (this._gridContainerElm.style.width = "".concat(newWidth, "px")), !((_a = this._grid) === null || _a === void 0) && _a.resizeCanvas && this._grid.resizeCanvas(), !((_b = this._gridOptions) === null || _b === void 0) && _b.enableAutoSizeColumns && this._grid.autosizeColumns && this._gridUid && document.querySelector(".".concat(this._gridUid)) && this._grid.autosizeColumns(), this._lastDimensions = {
                  height: newHeight,
                  width: newWidth
                };
              } catch (e) {
                this.destroy();
              }
            return this._lastDimensions;
          }, SlickResizer2;
        }()
      );
      exports.SlickResizer = SlickResizer;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          Plugins: {
            Resizer: SlickResizer
          }
        }
      });
    }
  });
  require_slick_resizer();
})();
//# sourceMappingURL=slick.resizer.js.map
