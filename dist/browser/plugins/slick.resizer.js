"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.resizer.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils, DATAGRID_MIN_HEIGHT = 180, DATAGRID_MIN_WIDTH = 300, DATAGRID_BOTTOM_PADDING = 20, SlickResizer = class {
    constructor(options, fixedDimensions) {
      // --
      // public API
      __publicField(this, "pluginName", "Resizer");
      __publicField(this, "onGridAfterResize", new SlickEvent("onGridAfterResize"));
      __publicField(this, "onGridBeforeResize", new SlickEvent("onGridBeforeResize"));
      // --
      // protected props
      __publicField(this, "_bindingEventService");
      __publicField(this, "_fixedHeight");
      __publicField(this, "_fixedWidth");
      __publicField(this, "_grid");
      __publicField(this, "_gridDomElm");
      __publicField(this, "_gridContainerElm");
      __publicField(this, "_pageContainerElm");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_lastDimensions");
      __publicField(this, "_resizePaused", !1);
      __publicField(this, "_timer");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        bottomPadding: 20,
        applyResizeToContainer: !1,
        minHeight: 180,
        minWidth: 300,
        rightPadding: 0
      });
      this._bindingEventService = new BindingEventService(), this._options = Utils.extend(!0, {}, this._defaults, options), fixedDimensions && (this._fixedHeight = fixedDimensions.height, this._fixedWidth = fixedDimensions.width);
    }
    setOptions(newOptions) {
      this._options = Utils.extend(!0, {}, this._defaults, this._options, newOptions);
    }
    init(grid) {
      this.setOptions(this._options), this._grid = grid, this._gridOptions = this._grid.getOptions(), this._gridUid = this._grid.getUID(), this._gridDomElm = this._grid.getContainerNode(), this._pageContainerElm = typeof this._options.container == "string" ? document.querySelector(this._options.container) : this._options.container, this._options.gridContainer && (this._gridContainerElm = this._options.gridContainer), Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._gridOptions && this.bindAutoResizeDataGrid();
    }
    /** Bind an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
    * Options: we could also provide a % factor to resize on each height/width independently
    */
    bindAutoResizeDataGrid(newSizes) {
      let gridElmOffset = Utils.offset(this._gridDomElm);
      (this._gridDomElm !== void 0 || gridElmOffset !== void 0) && (this.resizeGrid(0, newSizes, null), this._bindingEventService.bind(window, "resize", (event) => {
        this.onGridBeforeResize.notify({ grid: this._grid }, event, this), this._resizePaused || (this.resizeGrid(0, newSizes, event), this.resizeGrid(0, newSizes, event));
      }));
    }
    /**
     * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
     */
    calculateGridNewDimensions() {
      var _a, _b, _c, _d, _e, _f;
      let gridElmOffset = Utils.offset(this._gridDomElm);
      if (!window || this._pageContainerElm === void 0 || this._gridDomElm === void 0 || gridElmOffset === void 0)
        return null;
      let bottomPadding = ((_a = this._options) == null ? void 0 : _a.bottomPadding) !== void 0 ? this._options.bottomPadding : DATAGRID_BOTTOM_PADDING, gridHeight = 0, gridOffsetTop = 0;
      this._options.calculateAvailableSizeBy === "container" ? gridHeight = Utils.innerSize(this._pageContainerElm, "height") || 0 : (gridHeight = window.innerHeight || 0, gridOffsetTop = gridElmOffset !== void 0 ? gridElmOffset.top : 0);
      let availableHeight = gridHeight - gridOffsetTop - bottomPadding, availableWidth = Utils.innerSize(this._pageContainerElm, "width") || window.innerWidth || 0, maxHeight = ((_b = this._options) == null ? void 0 : _b.maxHeight) || void 0, minHeight = ((_c = this._options) == null ? void 0 : _c.minHeight) !== void 0 ? this._options.minHeight : DATAGRID_MIN_HEIGHT, maxWidth = ((_d = this._options) == null ? void 0 : _d.maxWidth) || void 0, minWidth = ((_e = this._options) == null ? void 0 : _e.minWidth) !== void 0 ? this._options.minWidth : DATAGRID_MIN_WIDTH, newHeight = availableHeight, newWidth = (_f = this._options) != null && _f.rightPadding ? availableWidth - this._options.rightPadding : availableWidth;
      return newHeight < minHeight && (newHeight = minHeight), maxHeight && newHeight > maxHeight && (newHeight = maxHeight), newWidth < minWidth && (newWidth = minWidth), maxWidth && newWidth > maxWidth && (newWidth = maxWidth), {
        height: this._fixedHeight || newHeight,
        width: this._fixedWidth || newWidth
      };
    }
    /** Destroy function when element is destroyed */
    destroy() {
      this.onGridBeforeResize.unsubscribe(), this.onGridAfterResize.unsubscribe(), this._bindingEventService.unbindAll();
    }
    /**
    * Return the last resize dimensions used by the service
    * @return {object} last dimensions (height: number, width: number)
    */
    getLastResizeDimensions() {
      return this._lastDimensions;
    }
    /**
     * Provide the possibility to pause the resizer for some time, until user decides to re-enabled it later if he wish to.
     * @param {boolean} isResizePaused are we pausing the resizer?
     */
    pauseResizer(isResizePaused) {
      this._resizePaused = isResizePaused;
    }
    /**
     * Resize the datagrid to fit the browser height & width.
     * @param {number} [delay] to wait before resizing, defaults to 0 (in milliseconds)
     * @param {object} [newSizes] can optionally be passed (height: number, width: number)
     * @param {object} [event] that triggered the resize, defaults to null
     * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
     */
    resizeGrid(delay, newSizes, event) {
      let resizeDelay = delay || 0;
      if (typeof Promise == "function")
        return new Promise((resolve) => {
          resizeDelay > 0 ? (clearTimeout(this._timer), this._timer = setTimeout(() => {
            resolve(this.resizeGridCallback(newSizes, event));
          }, resizeDelay)) : resolve(this.resizeGridCallback(newSizes, event));
        });
      resizeDelay > 0 ? (clearTimeout(this._timer), this._timer = setTimeout(() => {
        this.resizeGridCallback(newSizes, event);
      }, resizeDelay)) : this.resizeGridCallback(newSizes, event);
    }
    resizeGridCallback(newSizes, event) {
      let lastDimensions = this.resizeGridWithDimensions(newSizes);
      return this.onGridAfterResize.notify({ grid: this._grid, dimensions: lastDimensions }, event, this), lastDimensions;
    }
    resizeGridWithDimensions(newSizes) {
      var _a, _b;
      let availableDimensions = this.calculateGridNewDimensions();
      if ((newSizes || availableDimensions) && this._gridDomElm)
        try {
          let newHeight = newSizes != null && newSizes.height ? newSizes.height : availableDimensions == null ? void 0 : availableDimensions.height, newWidth = newSizes != null && newSizes.width ? newSizes.width : availableDimensions == null ? void 0 : availableDimensions.width;
          this._gridOptions.autoHeight || (this._gridDomElm.style.height = `${newHeight}px`), this._gridDomElm.style.width = `${newWidth}px`, this._gridContainerElm && (this._gridContainerElm.style.width = `${newWidth}px`), (_a = this._grid) != null && _a.resizeCanvas && this._grid.resizeCanvas(), (_b = this._gridOptions) != null && _b.enableAutoSizeColumns && this._grid.autosizeColumns && this._gridUid && document.querySelector(`.${this._gridUid}`) && this._grid.autosizeColumns(), this._lastDimensions = {
            height: newHeight,
            width: newWidth
          };
        } catch (e) {
          this.destroy();
        }
      return this._lastDimensions;
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        Resizer: SlickResizer
      }
    }
  });
})();
//# sourceMappingURL=slick.resizer.js.map
