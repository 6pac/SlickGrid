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

  // src/plugins/slick.rowmovemanager.js
  var require_slick_rowmovemanager = __commonJS({
    "src/plugins/slick.rowmovemanager.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickRowMoveManager = void 0;
      var slick_core_1 = require_slick_core(), SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickRowMoveManager = (
        /** @class */
        function() {
          function SlickRowMoveManager2(options) {
            this.pluginName = "RowMoveManager", this.onBeforeMoveRows = new SlickEvent(), this.onMoveRows = new SlickEvent(), this._dragging = !1, this._defaults = {
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
              width: 40
            }, this._options = Utils.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler();
          }
          return SlickRowMoveManager2.prototype.init = function(grid) {
            var _a;
            this._grid = grid, this._canvas = this._grid.getCanvasNode(), typeof ((_a = this._options) === null || _a === void 0 ? void 0 : _a.usabilityOverride) == "function" && this.usabilityOverride(this._options.usabilityOverride), this._eventHandler.subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
          }, SlickRowMoveManager2.prototype.destroy = function() {
            this._eventHandler.unsubscribeAll();
          }, SlickRowMoveManager2.prototype.setOptions = function(newOptions) {
            this._options = Utils.extend({}, this._options, newOptions);
          }, SlickRowMoveManager2.prototype.handleDragInit = function(e) {
            e.stopImmediatePropagation();
          }, SlickRowMoveManager2.prototype.handleDragStart = function(e, dd) {
            var _a, cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 }, currentRow = cell == null ? void 0 : cell.row, dataContext = this._grid.getDataItem(currentRow);
            if (this.checkUsabilityOverride(currentRow, dataContext, this._grid)) {
              if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive() && this._grid.getEditorLock().cancelCurrentEdit(), this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell))
                return !1;
              if (this._dragging = !0, e.stopImmediatePropagation(), !this._options.hideRowMoveShadow) {
                var slickRowElm = (_a = this._grid.getCellNode(cell.row, cell.cell)) === null || _a === void 0 ? void 0 : _a.closest(".slick-row");
                slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = "".concat(this._options.rowMoveShadowOpacity || 0.95), dd.clonedSlickRow.style.transform = "scale(".concat(this._options.rowMoveShadowScale || 0.75, ")"), this._canvas.appendChild(dd.clonedSlickRow));
              }
              var selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
              (selectedRows.length === 0 || !selectedRows.some(function(selectedRow) {
                return selectedRow === cell.row;
              })) && (selectedRows = [cell.row], this._options.disableRowSelection || this._grid.setSelectedRows(selectedRows));
              var rowHeight = this._grid.getOptions().rowHeight;
              dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = "".concat(this._canvas.clientWidth, "px"), dd.selectionProxy.style.height = "".concat(rowHeight * selectedRows.length, "px"), this._canvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = "".concat(this._canvas.clientWidth, "px"), dd.guide.style.top = "-1000px", this._canvas.appendChild(dd.guide), dd.insertBefore = -1;
            }
          }, SlickRowMoveManager2.prototype.handleDrag = function(evt, dd) {
            var _a, _b, _c, _d;
            if (this._dragging) {
              evt.stopImmediatePropagation();
              var e = evt.getNativeEvent(), targetEvent = (_b = (_a = e == null ? void 0 : e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, top = targetEvent.pageY - ((_d = (_c = Utils.offset(this._canvas)) === null || _c === void 0 ? void 0 : _c.top) !== null && _d !== void 0 ? _d : 0);
              dd.selectionProxy.style.top = "".concat(top - 5, "px"), dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = "".concat(top - 6, "px"), dd.clonedSlickRow.style.display = "block");
              var insertBefore = Math.max(0, Math.min(Math.round(top / this._grid.getOptions().rowHeight), this._grid.getDataLength()));
              if (insertBefore !== dd.insertBefore) {
                var eventData = {
                  grid: this._grid,
                  rows: dd.selectedRows,
                  insertBefore
                };
                if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, this._usabilityOverride && dd.canMove) {
                  var insertBeforeDataContext = this._grid.getDataItem(insertBefore);
                  dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._grid);
                }
                dd.canMove ? dd.guide.style.top = "".concat(insertBefore * (this._grid.getOptions().rowHeight || 0), "px") : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
              }
            }
          }, SlickRowMoveManager2.prototype.handleDragEnd = function(e, dd) {
            var _a, _b, _c;
            if (this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), (_a = dd.guide) === null || _a === void 0 || _a.remove(), (_b = dd.selectionProxy) === null || _b === void 0 || _b.remove(), (_c = dd.clonedSlickRow) === null || _c === void 0 || _c.remove(), dd.canMove)) {
              var eventData = {
                grid: this._grid,
                rows: dd.selectedRows,
                insertBefore: dd.insertBefore
              };
              this.onMoveRows.notify(eventData);
            }
          }, SlickRowMoveManager2.prototype.getColumnDefinition = function() {
            var _a, _b, columnId = String((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.columnId) !== null && _b !== void 0 ? _b : this._defaults.columnId);
            return {
              id: columnId,
              name: "",
              field: "move",
              behavior: "selectAndMove",
              excludeFromColumnPicker: !0,
              excludeFromGridMenu: !0,
              excludeFromHeaderMenu: !0,
              resizable: !1,
              selectable: !1,
              width: this._options.width || 40,
              formatter: this.moveIconFormatter.bind(this)
            };
          }, SlickRowMoveManager2.prototype.moveIconFormatter = function(row, _cell, _val, _column, dataContext, grid) {
            return this.checkUsabilityOverride(row, dataContext, grid) ? { addClasses: "cell-reorder dnd ".concat(this._options.cssClass || ""), text: "" } : "";
          }, SlickRowMoveManager2.prototype.checkUsabilityOverride = function(row, dataContext, grid) {
            return typeof this._usabilityOverride == "function" ? this._usabilityOverride(row, dataContext, grid) : !0;
          }, SlickRowMoveManager2.prototype.usabilityOverride = function(overrideFn) {
            this._usabilityOverride = overrideFn;
          }, SlickRowMoveManager2.prototype.isHandlerColumn = function(columnIndex) {
            return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || "");
          }, SlickRowMoveManager2;
        }()
      );
      exports.SlickRowMoveManager = SlickRowMoveManager;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          RowMoveManager: SlickRowMoveManager
        }
      });
    }
  });
  require_slick_rowmovemanager();
})();
//# sourceMappingURL=slick.rowmovemanager.js.map
