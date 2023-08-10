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

  // src/plugins/slick.crossgridrowmovemanager.js
  var require_slick_crossgridrowmovemanager = __commonJS({
    "src/plugins/slick.crossgridrowmovemanager.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCrossGridRowMoveManager = void 0;
      var slick_core_1 = require_slick_core(), SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickCrossGridRowMoveManager = (
        /** @class */
        function() {
          function SlickCrossGridRowMoveManager2(options) {
            this.pluginName = "CrossGridRowMoveManager", this.onBeforeMoveRows = new SlickEvent(), this.onMoveRows = new SlickEvent(), this._dragging = !1, this._defaults = {
              columnId: "_move",
              cssClass: void 0,
              cancelEditOnDrag: !1,
              disableRowSelection: !1,
              hideRowMoveShadow: !0,
              rowMoveShadowMarginTop: 0,
              rowMoveShadowMarginLeft: 0,
              rowMoveShadowOpacity: 0.95,
              rowMoveShadowScale: 0.75,
              singleRowMove: !1,
              toGrid: void 0,
              width: 40
            }, this._options = Utils.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler();
          }
          return SlickCrossGridRowMoveManager2.prototype.init = function(grid) {
            var _a;
            this._grid = grid, this._canvas = this._grid.getCanvasNode(), this._toGrid = this._options.toGrid, this._toCanvas = this._toGrid.getCanvasNode(), typeof ((_a = this._options) === null || _a === void 0 ? void 0 : _a.usabilityOverride) == "function" && this.usabilityOverride(this._options.usabilityOverride), this._eventHandler.subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
          }, SlickCrossGridRowMoveManager2.prototype.destroy = function() {
            this._eventHandler.unsubscribeAll();
          }, SlickCrossGridRowMoveManager2.prototype.setOptions = function(newOptions) {
            this._options = Utils.extend({}, this._options, newOptions);
          }, SlickCrossGridRowMoveManager2.prototype.handleDragInit = function(e) {
            e.stopImmediatePropagation();
          }, SlickCrossGridRowMoveManager2.prototype.handleDragStart = function(e, dd) {
            var _a, cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 }, currentRow = (_a = cell == null ? void 0 : cell.row) !== null && _a !== void 0 ? _a : 0, dataContext = this._grid.getDataItem(currentRow);
            if (this.checkUsabilityOverride(currentRow, dataContext, this._grid)) {
              if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive() && this._grid.getEditorLock().cancelCurrentEdit(), this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell))
                return !1;
              if (this._dragging = !0, e.stopImmediatePropagation(), !this._options.hideRowMoveShadow) {
                var cellNodeElm = this._grid.getCellNode(cell.row, cell.cell), slickRowElm = cellNodeElm == null ? void 0 : cellNodeElm.closest(".slick-row");
                slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = "".concat(this._options.rowMoveShadowOpacity || 0.95), dd.clonedSlickRow.style.transform = "scale(".concat(this._options.rowMoveShadowScale || 0.75, ")"), this._canvas.appendChild(dd.clonedSlickRow));
              }
              var selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
              (selectedRows.length === 0 || !selectedRows.some(function(selectedRow) {
                return selectedRow === cell.row;
              })) && (selectedRows = [cell.row], this._options.disableRowSelection || this._grid.setSelectedRows(selectedRows)), selectedRows.sort(function(a, b) {
                return a - b;
              });
              var rowHeight = this._grid.getOptions().rowHeight;
              dd.fromGrid = this._grid, dd.toGrid = this._toGrid, dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = "".concat(this._toCanvas.clientWidth, "px"), dd.selectionProxy.style.height = "".concat(rowHeight * selectedRows.length, "px"), this._toCanvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = "".concat(this._toCanvas.clientWidth, "px"), dd.guide.style.top = "-1000px", this._toCanvas.appendChild(dd.guide), dd.insertBefore = -1;
            }
          }, SlickCrossGridRowMoveManager2.prototype.handleDrag = function(evt, dd) {
            var _a, _b, _c, _d;
            if (this._dragging) {
              evt.stopImmediatePropagation();
              var e = evt.getNativeEvent(), targetEvent = (_b = (_a = e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, top = targetEvent.pageY - ((_d = (_c = Utils.offset(this._toCanvas)) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0);
              dd.selectionProxy.style.top = "".concat(top - 5, "px"), dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = "".concat(top - 6, "px"), dd.clonedSlickRow.style.display = "block");
              var insertBefore = Math.max(0, Math.min(Math.round(top / this._toGrid.getOptions().rowHeight), this._toGrid.getDataLength()));
              if (insertBefore !== dd.insertBefore) {
                var eventData = {
                  fromGrid: this._grid,
                  toGrid: this._toGrid,
                  rows: dd.selectedRows,
                  insertBefore
                };
                if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, this._usabilityOverride && dd.canMove) {
                  var insertBeforeDataContext = this._toGrid.getDataItem(insertBefore);
                  dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._toGrid);
                }
                dd.canMove ? dd.guide.style.top = "".concat(insertBefore * (this._toGrid.getOptions().rowHeight || 0), "px") : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
              }
            }
          }, SlickCrossGridRowMoveManager2.prototype.handleDragEnd = function(e, dd) {
            var _a, _b, _c;
            if (this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), (_a = dd.guide) === null || _a === void 0 || _a.remove(), (_b = dd.selectionProxy) === null || _b === void 0 || _b.remove(), (_c = dd.clonedSlickRow) === null || _c === void 0 || _c.remove(), dd.canMove)) {
              var eventData = {
                fromGrid: this._grid,
                toGrid: this._toGrid,
                rows: dd.selectedRows,
                insertBefore: dd.insertBefore
              };
              this.onMoveRows.notify(eventData);
            }
          }, SlickCrossGridRowMoveManager2.prototype.getColumnDefinition = function() {
            var _a, _b, columnId = String((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.columnId) !== null && _b !== void 0 ? _b : this._defaults.columnId);
            return {
              id: columnId,
              name: "",
              field: "move",
              behavior: "selectAndMove",
              excludeFromColumnPicker: !0,
              excludeFromGridMenu: !0,
              excludeFromHeaderMenu: !0,
              selectable: !1,
              resizable: !1,
              width: this._options.width || 40,
              formatter: this.moveIconFormatter.bind(this)
            };
          }, SlickCrossGridRowMoveManager2.prototype.moveIconFormatter = function(row, _cell, _val, _column, dataContext, grid) {
            return this.checkUsabilityOverride(row, dataContext, grid) ? { addClasses: "cell-reorder dnd ".concat(this._options.cssClass || ""), text: "" } : "";
          }, SlickCrossGridRowMoveManager2.prototype.checkUsabilityOverride = function(row, dataContext, grid) {
            return typeof this._usabilityOverride == "function" ? this._usabilityOverride(row, dataContext, grid) : !0;
          }, SlickCrossGridRowMoveManager2.prototype.usabilityOverride = function(overrideFn) {
            this._usabilityOverride = overrideFn;
          }, SlickCrossGridRowMoveManager2.prototype.isHandlerColumn = function(columnIndex) {
            return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || "");
          }, SlickCrossGridRowMoveManager2;
        }()
      );
      exports.SlickCrossGridRowMoveManager = SlickCrossGridRowMoveManager;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          CrossGridRowMoveManager: SlickCrossGridRowMoveManager
        }
      });
    }
  });
  require_slick_crossgridrowmovemanager();
})();
//# sourceMappingURL=slick.crossgridrowmovemanager.js.map
