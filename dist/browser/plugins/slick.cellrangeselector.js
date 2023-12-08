"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.cellrangeselector.ts
  var SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, SlickRange = Slick.Range, Draggable = Slick.Draggable, SlickCellRangeDecorator = Slick.CellRangeDecorator, Utils = Slick.Utils, SlickCellRangeSelector = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "CellRangeSelector");
      __publicField(this, "onBeforeCellRangeSelected", new SlickEvent("onBeforeCellRangeSelected"));
      __publicField(this, "onCellRangeSelected", new SlickEvent("onCellRangeSelected"));
      __publicField(this, "onCellRangeSelecting", new SlickEvent("onCellRangeSelecting"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_currentlySelectedRange", null);
      __publicField(this, "_canvas", null);
      __publicField(this, "_decorator");
      __publicField(this, "_gridOptions");
      __publicField(this, "_activeCanvas");
      __publicField(this, "_dragging", !1);
      __publicField(this, "_handler", new SlickEventHandler());
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        autoScroll: !0,
        minIntervalToShowNextCell: 30,
        maxIntervalToShowNextCell: 600,
        // better to a multiple of minIntervalToShowNextCell
        accelerateInterval: 5,
        // increase 5ms when cursor 1px outside the viewport.
        selectionCss: {
          border: "2px dashed blue"
        }
      });
      // Frozen row & column variables
      __publicField(this, "_rowOffset", 0);
      __publicField(this, "_columnOffset", 0);
      __publicField(this, "_isRightCanvas", !1);
      __publicField(this, "_isBottomCanvas", !1);
      // autoScroll related constiables
      __publicField(this, "_activeViewport");
      __publicField(this, "_autoScrollTimerId");
      __publicField(this, "_draggingMouseOffset");
      __publicField(this, "_moveDistanceForOneCell");
      __publicField(this, "_xDelayForNextCell", 0);
      __publicField(this, "_yDelayForNextCell", 0);
      __publicField(this, "_viewportHeight", 0);
      __publicField(this, "_viewportWidth", 0);
      __publicField(this, "_isRowMoveRegistered", !1);
      // Scrollings
      __publicField(this, "_scrollLeft", 0);
      __publicField(this, "_scrollTop", 0);
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    init(grid) {
      if (Draggable === void 0)
        throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
      this._decorator = this._options.cellDecorator || new SlickCellRangeDecorator(grid, this._options), this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._canvas = this._grid.getCanvasNode(), this._gridOptions = this._grid.getOptions(), this._handler.subscribe(this._grid.onScroll, this.handleScroll.bind(this)).subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
    }
    destroy() {
      var _a;
      this._handler.unsubscribeAll(), this._activeCanvas = null, this._activeViewport = null, this._canvas = null, (_a = this._decorator) == null || _a.destroy();
    }
    getCellDecorator() {
      return this._decorator;
    }
    handleScroll(_e, args) {
      this._scrollTop = args.scrollTop, this._scrollLeft = args.scrollLeft;
    }
    handleDragInit(e) {
      this._activeCanvas = this._grid.getActiveCanvasNode(e), this._activeViewport = this._grid.getActiveViewportNode(e);
      let scrollbarDimensions = this._grid.getDisplayedScrollbarDimensions();
      if (this._viewportWidth = this._activeViewport.offsetWidth - scrollbarDimensions.width, this._viewportHeight = this._activeViewport.offsetHeight - scrollbarDimensions.height, this._moveDistanceForOneCell = {
        x: this._grid.getAbsoluteColumnMinWidth() / 2,
        y: this._grid.getOptions().rowHeight / 2
      }, this._isRowMoveRegistered = this.hasRowMoveManager(), this._rowOffset = 0, this._columnOffset = 0, this._isBottomCanvas = this._activeCanvas.classList.contains("grid-canvas-bottom"), this._gridOptions.frozenRow > -1 && this._isBottomCanvas) {
        let canvasSelector = `.${this._grid.getUID()} .grid-canvas-${this._gridOptions.frozenBottom ? "bottom" : "top"}`, canvasElm = document.querySelector(canvasSelector);
        canvasElm && (this._rowOffset = canvasElm.clientHeight || 0);
      }
      if (this._isRightCanvas = this._activeCanvas.classList.contains("grid-canvas-right"), this._gridOptions.frozenColumn > -1 && this._isRightCanvas) {
        let canvasLeftElm = document.querySelector(`.${this._grid.getUID()} .grid-canvas-left`);
        canvasLeftElm && (this._columnOffset = canvasLeftElm.clientWidth || 0);
      }
      e.stopImmediatePropagation(), e.preventDefault();
    }
    handleDragStart(e, dd) {
      var _a, _b;
      let cell = this._grid.getCellFromEvent(e);
      if (cell && this.onBeforeCellRangeSelected.notify(cell).getReturnValue() !== !1 && this._grid.canCellBeSelected(cell.row, cell.cell) && (this._dragging = !0, e.stopImmediatePropagation()), !this._dragging)
        return;
      this._grid.focus();
      let canvasOffset = Utils.offset(this._canvas), startX = dd.startX - ((_a = canvasOffset == null ? void 0 : canvasOffset.left) != null ? _a : 0);
      this._gridOptions.frozenColumn >= 0 && this._isRightCanvas && (startX += this._scrollLeft);
      let startY = dd.startY - ((_b = canvasOffset == null ? void 0 : canvasOffset.top) != null ? _b : 0);
      this._gridOptions.frozenRow >= 0 && this._isBottomCanvas && (startY += this._scrollTop);
      let start = this._grid.getCellFromPoint(startX, startY);
      return dd.range = { start, end: {} }, this._currentlySelectedRange = dd.range, this._decorator.show(new SlickRange(start.row, start.cell));
    }
    handleDrag(evt, dd) {
      if (!this._dragging && !this._isRowMoveRegistered)
        return;
      this._isRowMoveRegistered || evt.stopImmediatePropagation();
      let e = evt.getNativeEvent();
      if (this._options.autoScroll && (this._draggingMouseOffset = this.getMouseOffsetViewport(e, dd), this._draggingMouseOffset.isOutsideViewport))
        return this.handleDragOutsideViewport();
      this.stopIntervalTimer(), this.handleDragTo(e, dd);
    }
    getMouseOffsetViewport(e, dd) {
      var _a, _b, _c, _d;
      let targetEvent = (_b = (_a = e == null ? void 0 : e.touches) == null ? void 0 : _a[0]) != null ? _b : e, viewportLeft = this._activeViewport.scrollLeft, viewportTop = this._activeViewport.scrollTop, viewportRight = viewportLeft + this._viewportWidth, viewportBottom = viewportTop + this._viewportHeight, viewportOffset = Utils.offset(this._activeViewport), viewportOffsetLeft = (_c = viewportOffset == null ? void 0 : viewportOffset.left) != null ? _c : 0, viewportOffsetTop = (_d = viewportOffset == null ? void 0 : viewportOffset.top) != null ? _d : 0, viewportOffsetRight = viewportOffsetLeft + this._viewportWidth, viewportOffsetBottom = viewportOffsetTop + this._viewportHeight, result = {
        e,
        dd,
        viewport: {
          left: viewportLeft,
          top: viewportTop,
          right: viewportRight,
          bottom: viewportBottom,
          offset: {
            left: viewportOffsetLeft,
            top: viewportOffsetTop,
            right: viewportOffsetRight,
            bottom: viewportOffsetBottom
          }
        },
        // Consider the viewport as the origin, the `offset` is based on the coordinate system:
        // the cursor is on the viewport's left/bottom when it is less than 0, and on the right/top when greater than 0.
        offset: {
          x: 0,
          y: 0
        },
        isOutsideViewport: !1
      };
      return targetEvent.pageX < viewportOffsetLeft ? result.offset.x = targetEvent.pageX - viewportOffsetLeft : targetEvent.pageX > viewportOffsetRight && (result.offset.x = targetEvent.pageX - viewportOffsetRight), targetEvent.pageY < viewportOffsetTop ? result.offset.y = viewportOffsetTop - targetEvent.pageY : targetEvent.pageY > viewportOffsetBottom && (result.offset.y = viewportOffsetBottom - targetEvent.pageY), result.isOutsideViewport = !!result.offset.x || !!result.offset.y, result;
    }
    handleDragOutsideViewport() {
      if (this._xDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.x) * this._options.accelerateInterval, this._yDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.y) * this._options.accelerateInterval, !this._autoScrollTimerId) {
        let xTotalDelay = 0, yTotalDelay = 0;
        this._autoScrollTimerId = setInterval(() => {
          let xNeedUpdate = !1, yNeedUpdate = !1;
          this._draggingMouseOffset.offset.x ? (xTotalDelay += this._options.minIntervalToShowNextCell, xNeedUpdate = xTotalDelay >= this._xDelayForNextCell) : xTotalDelay = 0, this._draggingMouseOffset.offset.y ? (yTotalDelay += this._options.minIntervalToShowNextCell, yNeedUpdate = yTotalDelay >= this._yDelayForNextCell) : yTotalDelay = 0, (xNeedUpdate || yNeedUpdate) && (xNeedUpdate && (xTotalDelay = 0), yNeedUpdate && (yTotalDelay = 0), this.handleDragToNewPosition(xNeedUpdate, yNeedUpdate));
        }, this._options.minIntervalToShowNextCell);
      }
    }
    handleDragToNewPosition(xNeedUpdate, yNeedUpdate) {
      let pageX = this._draggingMouseOffset.e.pageX, pageY = this._draggingMouseOffset.e.pageY, mouseOffsetX = this._draggingMouseOffset.offset.x, mouseOffsetY = this._draggingMouseOffset.offset.y, viewportOffset = this._draggingMouseOffset.viewport.offset;
      xNeedUpdate && mouseOffsetX && (mouseOffsetX > 0 ? pageX = viewportOffset.right + this._moveDistanceForOneCell.x : pageX = viewportOffset.left - this._moveDistanceForOneCell.x), yNeedUpdate && mouseOffsetY && (mouseOffsetY > 0 ? pageY = viewportOffset.top - this._moveDistanceForOneCell.y : pageY = viewportOffset.bottom + this._moveDistanceForOneCell.y), this.handleDragTo({ pageX, pageY }, this._draggingMouseOffset.dd);
    }
    stopIntervalTimer() {
      this._autoScrollTimerId && (clearInterval(this._autoScrollTimerId), this._autoScrollTimerId = void 0);
    }
    handleDragTo(e, dd) {
      var _a, _b, _c, _d, _e, _f;
      let targetEvent = (_b = (_a = e == null ? void 0 : e.touches) == null ? void 0 : _a[0]) != null ? _b : e, canvasOffset = Utils.offset(this._activeCanvas), end = this._grid.getCellFromPoint(
        targetEvent.pageX - ((_c = canvasOffset == null ? void 0 : canvasOffset.left) != null ? _c : 0) + this._columnOffset,
        targetEvent.pageY - ((_d = canvasOffset == null ? void 0 : canvasOffset.top) != null ? _d : 0) + this._rowOffset
      );
      if (!(this._gridOptions.frozenColumn >= 0 && !this._isRightCanvas && end.cell > this._gridOptions.frozenColumn || this._isRightCanvas && end.cell <= this._gridOptions.frozenColumn) && !(this._gridOptions.frozenRow >= 0 && !this._isBottomCanvas && end.row >= this._gridOptions.frozenRow || this._isBottomCanvas && end.row < this._gridOptions.frozenRow)) {
        if (this._options.autoScroll && this._draggingMouseOffset) {
          let endCellBox = this._grid.getCellNodeBox(end.row, end.cell);
          if (!endCellBox)
            return;
          let viewport = this._draggingMouseOffset.viewport;
          (endCellBox.left < viewport.left || endCellBox.right > viewport.right || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) && this._grid.scrollCellIntoView(end.row, end.cell);
        }
        if (this._grid.canCellBeSelected(end.row, end.cell) && dd != null && dd.range) {
          dd.range.end = end;
          let range = new SlickRange((_e = dd.range.start.row) != null ? _e : 0, (_f = dd.range.start.cell) != null ? _f : 0, end.row, end.cell);
          this._decorator.show(range), this.onCellRangeSelecting.notify({
            range
          });
        }
      }
    }
    hasRowMoveManager() {
      return !!(this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager"));
    }
    handleDragEnd(e, dd) {
      var _a, _b;
      this._decorator.hide(), this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), this.stopIntervalTimer(), this.onCellRangeSelected.notify({
        range: new SlickRange(
          (_a = dd.range.start.row) != null ? _a : 0,
          (_b = dd.range.start.cell) != null ? _b : 0,
          dd.range.end.row,
          dd.range.end.cell
        )
      }));
    }
    getCurrentRange() {
      return this._currentlySelectedRange;
    }
  };
  window.Slick && Utils.extend(Slick, {
    CellRangeSelector: SlickCellRangeSelector
  });
})();
//# sourceMappingURL=slick.cellrangeselector.js.map
