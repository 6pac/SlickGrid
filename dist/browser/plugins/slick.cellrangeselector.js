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

  // import-ns:../slick.interactions.js
  var require_slick_interactions = __commonJS({
    "import-ns:../slick.interactions.js"() {
    }
  });

  // import-ns:./slick.cellrangedecorator.js
  var require_slick_cellrangedecorator = __commonJS({
    "import-ns:./slick.cellrangedecorator.js"() {
    }
  });

  // src/plugins/slick.cellrangeselector.js
  var require_slick_cellrangeselector = __commonJS({
    "src/plugins/slick.cellrangeselector.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCellRangeSelector = void 0;
      var slick_core_1 = require_slick_core(), slick_interactions_1 = require_slick_interactions(), slick_cellrangedecorator_1 = require_slick_cellrangedecorator(), SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, SlickRange = Slick.Range, Draggable = Slick.Draggable, SlickCellRangeDecorator = Slick.CellRangeDecorator, Utils = Slick.Utils, SlickCellRangeSelector = (
        /** @class */
        function() {
          function SlickCellRangeSelector2(options) {
            this.pluginName = "CellRangeSelector", this.onBeforeCellRangeSelected = new SlickEvent(), this.onCellRangeSelected = new SlickEvent(), this.onCellRangeSelecting = new SlickEvent(), this._currentlySelectedRange = null, this._canvas = null, this._dragging = !1, this._handler = new SlickEventHandler(), this._defaults = {
              autoScroll: !0,
              minIntervalToShowNextCell: 30,
              maxIntervalToShowNextCell: 600,
              accelerateInterval: 5,
              selectionCss: {
                border: "2px dashed blue"
              }
            }, this._rowOffset = 0, this._columnOffset = 0, this._isRightCanvas = !1, this._isBottomCanvas = !1, this._xDelayForNextCell = 0, this._yDelayForNextCell = 0, this._viewportHeight = 0, this._viewportWidth = 0, this._isRowMoveRegistered = !1, this._scrollLeft = 0, this._scrollTop = 0, this._options = Utils.extend(!0, {}, this._defaults, options);
          }
          return SlickCellRangeSelector2.prototype.init = function(grid) {
            if (Draggable === void 0)
              throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
            this._decorator = this._options.cellDecorator || new SlickCellRangeDecorator(grid, this._options), this._grid = grid, this._canvas = this._grid.getCanvasNode(), this._gridOptions = this._grid.getOptions(), this._handler.subscribe(this._grid.onScroll, this.handleScroll.bind(this)).subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
          }, SlickCellRangeSelector2.prototype.destroy = function() {
            var _a;
            this._handler.unsubscribeAll(), this._activeCanvas = null, this._activeViewport = null, this._canvas = null, (_a = this._decorator) === null || _a === void 0 || _a.destroy();
          }, SlickCellRangeSelector2.prototype.getCellDecorator = function() {
            return this._decorator;
          }, SlickCellRangeSelector2.prototype.handleScroll = function(_e, args) {
            this._scrollTop = args.scrollTop, this._scrollLeft = args.scrollLeft;
          }, SlickCellRangeSelector2.prototype.handleDragInit = function(e) {
            this._activeCanvas = this._grid.getActiveCanvasNode(e), this._activeViewport = this._grid.getActiveViewportNode(e);
            var scrollbarDimensions = this._grid.getDisplayedScrollbarDimensions();
            if (this._viewportWidth = this._activeViewport.offsetWidth - scrollbarDimensions.width, this._viewportHeight = this._activeViewport.offsetHeight - scrollbarDimensions.height, this._moveDistanceForOneCell = {
              x: this._grid.getAbsoluteColumnMinWidth() / 2,
              y: this._grid.getOptions().rowHeight / 2
            }, this._isRowMoveRegistered = this.hasRowMoveManager(), this._rowOffset = 0, this._columnOffset = 0, this._isBottomCanvas = this._activeCanvas.classList.contains("grid-canvas-bottom"), this._gridOptions.frozenRow > -1 && this._isBottomCanvas) {
              var canvasSelector = ".".concat(this._grid.getUID(), " .grid-canvas-").concat(this._gridOptions.frozenBottom ? "bottom" : "top"), canvasElm = document.querySelector(canvasSelector);
              canvasElm && (this._rowOffset = canvasElm.clientHeight || 0);
            }
            if (this._isRightCanvas = this._activeCanvas.classList.contains("grid-canvas-right"), this._gridOptions.frozenColumn > -1 && this._isRightCanvas) {
              var canvasLeftElm = document.querySelector(".".concat(this._grid.getUID(), " .grid-canvas-left"));
              canvasLeftElm && (this._columnOffset = canvasLeftElm.clientWidth || 0);
            }
            e.stopImmediatePropagation(), e.preventDefault();
          }, SlickCellRangeSelector2.prototype.handleDragStart = function(e, dd) {
            var _a, _b, cell = this._grid.getCellFromEvent(e);
            if (cell && this.onBeforeCellRangeSelected.notify(cell).getReturnValue() !== !1 && this._grid.canCellBeSelected(cell.row, cell.cell) && (this._dragging = !0, e.stopImmediatePropagation()), !!this._dragging) {
              this._grid.focus();
              var canvasOffset = Utils.offset(this._canvas), startX = dd.startX - ((_a = canvasOffset == null ? void 0 : canvasOffset.left) !== null && _a !== void 0 ? _a : 0);
              this._gridOptions.frozenColumn >= 0 && this._isRightCanvas && (startX += this._scrollLeft);
              var startY = dd.startY - ((_b = canvasOffset == null ? void 0 : canvasOffset.top) !== null && _b !== void 0 ? _b : 0);
              this._gridOptions.frozenRow >= 0 && this._isBottomCanvas && (startY += this._scrollTop);
              var start = this._grid.getCellFromPoint(startX, startY);
              return dd.range = { start, end: {} }, this._currentlySelectedRange = dd.range, this._decorator.show(new SlickRange(start.row, start.cell));
            }
          }, SlickCellRangeSelector2.prototype.handleDrag = function(evt, dd) {
            if (!(!this._dragging && !this._isRowMoveRegistered)) {
              this._isRowMoveRegistered || evt.stopImmediatePropagation();
              var e = evt.getNativeEvent();
              if (this._options.autoScroll && (this._draggingMouseOffset = this.getMouseOffsetViewport(e, dd), this._draggingMouseOffset.isOutsideViewport))
                return this.handleDragOutsideViewport();
              this.stopIntervalTimer(), this.handleDragTo(e, dd);
            }
          }, SlickCellRangeSelector2.prototype.getMouseOffsetViewport = function(e, dd) {
            var _a, _b, _c, _d, targetEvent = (_b = (_a = e == null ? void 0 : e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, viewportLeft = this._activeViewport.scrollLeft, viewportTop = this._activeViewport.scrollTop, viewportRight = viewportLeft + this._viewportWidth, viewportBottom = viewportTop + this._viewportHeight, viewportOffset = Utils.offset(this._activeViewport), viewportOffsetLeft = (_c = viewportOffset == null ? void 0 : viewportOffset.left) !== null && _c !== void 0 ? _c : 0, viewportOffsetTop = (_d = viewportOffset == null ? void 0 : viewportOffset.top) !== null && _d !== void 0 ? _d : 0, viewportOffsetRight = viewportOffsetLeft + this._viewportWidth, viewportOffsetBottom = viewportOffsetTop + this._viewportHeight, result = {
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
          }, SlickCellRangeSelector2.prototype.handleDragOutsideViewport = function() {
            var _this = this;
            if (this._xDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.x) * this._options.accelerateInterval, this._yDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.y) * this._options.accelerateInterval, !this._autoScrollTimerId) {
              var xTotalDelay_1 = 0, yTotalDelay_1 = 0;
              this._autoScrollTimerId = setInterval(function() {
                var xNeedUpdate = !1, yNeedUpdate = !1;
                _this._draggingMouseOffset.offset.x ? (xTotalDelay_1 += _this._options.minIntervalToShowNextCell, xNeedUpdate = xTotalDelay_1 >= _this._xDelayForNextCell) : xTotalDelay_1 = 0, _this._draggingMouseOffset.offset.y ? (yTotalDelay_1 += _this._options.minIntervalToShowNextCell, yNeedUpdate = yTotalDelay_1 >= _this._yDelayForNextCell) : yTotalDelay_1 = 0, (xNeedUpdate || yNeedUpdate) && (xNeedUpdate && (xTotalDelay_1 = 0), yNeedUpdate && (yTotalDelay_1 = 0), _this.handleDragToNewPosition(xNeedUpdate, yNeedUpdate));
              }, this._options.minIntervalToShowNextCell);
            }
          }, SlickCellRangeSelector2.prototype.handleDragToNewPosition = function(xNeedUpdate, yNeedUpdate) {
            var pageX = this._draggingMouseOffset.e.pageX, pageY = this._draggingMouseOffset.e.pageY, mouseOffsetX = this._draggingMouseOffset.offset.x, mouseOffsetY = this._draggingMouseOffset.offset.y, viewportOffset = this._draggingMouseOffset.viewport.offset;
            xNeedUpdate && mouseOffsetX && (mouseOffsetX > 0 ? pageX = viewportOffset.right + this._moveDistanceForOneCell.x : pageX = viewportOffset.left - this._moveDistanceForOneCell.x), yNeedUpdate && mouseOffsetY && (mouseOffsetY > 0 ? pageY = viewportOffset.top - this._moveDistanceForOneCell.y : pageY = viewportOffset.bottom + this._moveDistanceForOneCell.y), this.handleDragTo({ pageX, pageY }, this._draggingMouseOffset.dd);
          }, SlickCellRangeSelector2.prototype.stopIntervalTimer = function() {
            this._autoScrollTimerId && (clearInterval(this._autoScrollTimerId), this._autoScrollTimerId = void 0);
          }, SlickCellRangeSelector2.prototype.handleDragTo = function(e, dd) {
            var _a, _b, _c, _d, _f, _g, targetEvent = (_b = (_a = e == null ? void 0 : e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, canvasOffset = Utils.offset(this._activeCanvas), end = this._grid.getCellFromPoint(targetEvent.pageX - ((_c = canvasOffset == null ? void 0 : canvasOffset.left) !== null && _c !== void 0 ? _c : 0) + this._columnOffset, targetEvent.pageY - ((_d = canvasOffset == null ? void 0 : canvasOffset.top) !== null && _d !== void 0 ? _d : 0) + this._rowOffset);
            if (!(this._gridOptions.frozenColumn >= 0 && !this._isRightCanvas && end.cell > this._gridOptions.frozenColumn || this._isRightCanvas && end.cell <= this._gridOptions.frozenColumn) && !(this._gridOptions.frozenRow >= 0 && !this._isBottomCanvas && end.row >= this._gridOptions.frozenRow || this._isBottomCanvas && end.row < this._gridOptions.frozenRow)) {
              if (this._options.autoScroll && this._draggingMouseOffset) {
                var endCellBox = this._grid.getCellNodeBox(end.row, end.cell);
                if (!endCellBox)
                  return;
                var viewport = this._draggingMouseOffset.viewport;
                (endCellBox.left < viewport.left || endCellBox.right > viewport.right || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) && this._grid.scrollCellIntoView(end.row, end.cell);
              }
              if (this._grid.canCellBeSelected(end.row, end.cell) && dd != null && dd.range) {
                dd.range.end = end;
                var range = new SlickRange((_f = dd.range.start.row) !== null && _f !== void 0 ? _f : 0, (_g = dd.range.start.cell) !== null && _g !== void 0 ? _g : 0, end.row, end.cell);
                this._decorator.show(range), this.onCellRangeSelecting.notify({
                  range
                });
              }
            }
          }, SlickCellRangeSelector2.prototype.hasRowMoveManager = function() {
            return !!(this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager"));
          }, SlickCellRangeSelector2.prototype.handleDragEnd = function(e, dd) {
            var _a, _b;
            this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), this.stopIntervalTimer(), this._decorator.hide(), this.onCellRangeSelected.notify({
              range: new SlickRange((_a = dd.range.start.row) !== null && _a !== void 0 ? _a : 0, (_b = dd.range.start.cell) !== null && _b !== void 0 ? _b : 0, dd.range.end.row, dd.range.end.cell)
            }));
          }, SlickCellRangeSelector2.prototype.getCurrentRange = function() {
            return this._currentlySelectedRange;
          }, SlickCellRangeSelector2;
        }()
      );
      exports.SlickCellRangeSelector = SlickCellRangeSelector;
      window.Slick && Utils.extend(Slick, {
        CellRangeSelector: SlickCellRangeSelector
      });
    }
  });
  require_slick_cellrangeselector();
})();
//# sourceMappingURL=slick.cellrangeselector.js.map
