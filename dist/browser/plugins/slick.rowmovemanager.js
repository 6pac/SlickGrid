"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.rowmovemanager.ts
  var SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickRowMoveManager = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "RowMoveManager");
      __publicField(this, "onBeforeMoveRows", new SlickEvent("onBeforeMoveRows"));
      __publicField(this, "onMoveRows", new SlickEvent("onMoveRows"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_canvas");
      __publicField(this, "_dragging", !1);
      __publicField(this, "_eventHandler");
      __publicField(this, "_usabilityOverride");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
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
      });
      this._options = Utils.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler();
    }
    init(grid) {
      var _a;
      this._grid = grid, this._canvas = this._grid.getCanvasNode(), Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), typeof ((_a = this._options) == null ? void 0 : _a.usabilityOverride) == "function" && this.usabilityOverride(this._options.usabilityOverride), this._eventHandler.subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
    }
    destroy() {
      this._eventHandler.unsubscribeAll();
    }
    setOptions(newOptions) {
      this._options = Utils.extend({}, this._options, newOptions);
    }
    handleDragInit(e) {
      e.stopImmediatePropagation();
    }
    handleDragStart(e, dd) {
      var _a;
      let cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 }, currentRow = cell == null ? void 0 : cell.row, dataContext = this._grid.getDataItem(currentRow);
      if (!this.checkUsabilityOverride(currentRow, dataContext, this._grid))
        return;
      if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive() && this._grid.getEditorLock().cancelCurrentEdit(), this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell))
        return !1;
      if (this._dragging = !0, e.stopImmediatePropagation(), !this._options.hideRowMoveShadow) {
        let slickRowElm = (_a = this._grid.getCellNode(cell.row, cell.cell)) == null ? void 0 : _a.closest(".slick-row");
        slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${this._options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${this._options.rowMoveShadowScale || 0.75})`, this._canvas.appendChild(dd.clonedSlickRow));
      }
      let selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
      (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], this._options.disableRowSelection || this._grid.setSelectedRows(selectedRows));
      let rowHeight = this._grid.getOptions().rowHeight;
      dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${this._canvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, this._canvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${this._canvas.clientWidth}px`, dd.guide.style.top = "-1000px", this._canvas.appendChild(dd.guide), dd.insertBefore = -1;
    }
    handleDrag(evt, dd) {
      var _a, _b, _c, _d;
      if (!this._dragging)
        return;
      evt.stopImmediatePropagation();
      let e = evt.getNativeEvent(), top = ((_b = (_a = e == null ? void 0 : e.touches) == null ? void 0 : _a[0]) != null ? _b : e).pageY - ((_d = (_c = Utils.offset(this._canvas)) == null ? void 0 : _c.top) != null ? _d : 0);
      dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
      let insertBefore = Math.max(0, Math.min(Math.round(top / this._grid.getOptions().rowHeight), this._grid.getDataLength()));
      if (insertBefore !== dd.insertBefore) {
        let eventData = {
          grid: this._grid,
          rows: dd.selectedRows,
          insertBefore
        };
        if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, this._usabilityOverride && dd.canMove) {
          let insertBeforeDataContext = this._grid.getDataItem(insertBefore);
          dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._grid);
        }
        dd.canMove ? dd.guide.style.top = `${insertBefore * (this._grid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
      }
    }
    handleDragEnd(e, dd) {
      var _a, _b, _c;
      if (this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), (_a = dd.guide) == null || _a.remove(), (_b = dd.selectionProxy) == null || _b.remove(), (_c = dd.clonedSlickRow) == null || _c.remove(), dd.canMove)) {
        let eventData = {
          grid: this._grid,
          rows: dd.selectedRows,
          insertBefore: dd.insertBefore
        };
        this.onMoveRows.notify(eventData);
      }
    }
    getColumnDefinition() {
      var _a, _b;
      return {
        id: String((_b = (_a = this._options) == null ? void 0 : _a.columnId) != null ? _b : this._defaults.columnId),
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
    }
    moveIconFormatter(row, _cell, _val, _column, dataContext, grid) {
      if (this.checkUsabilityOverride(row, dataContext, grid)) {
        let iconElm = document.createElement("div");
        return iconElm.className = this._options.cssClass || "", {
          addClasses: `cell-reorder dnd ${this._options.containerCssClass || ""}`,
          html: iconElm
        };
      } else
        return "";
    }
    checkUsabilityOverride(row, dataContext, grid) {
      return typeof this._usabilityOverride == "function" ? this._usabilityOverride(row, dataContext, grid) : !0;
    }
    /**
     * Method that user can pass to override the default behavior or making every row moveable.
     * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
     * @param overrideFn: override function callback
     */
    usabilityOverride(overrideFn) {
      this._usabilityOverride = overrideFn;
    }
    isHandlerColumn(columnIndex) {
      return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || "");
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      RowMoveManager: SlickRowMoveManager
    }
  });
})();
//# sourceMappingURL=slick.rowmovemanager.js.map
