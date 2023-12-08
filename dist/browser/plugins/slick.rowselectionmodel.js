"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.rowselectionmodel.ts
  var Draggable = Slick.Draggable, keyCode = Slick.keyCode, SlickCellRangeDecorator = Slick.CellRangeDecorator, SlickCellRangeSelector = Slick.CellRangeSelector, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, SlickEventHandler = Slick.EventHandler, SlickRange = Slick.Range, Utils = Slick.Utils, SlickRowSelectionModel = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "RowSelectionModel");
      __publicField(this, "onSelectedRangesChanged", new SlickEvent("onSelectedRangesChanged"));
      // _handler, _inHandler, _isRowMoveManagerHandler, _options, wrapHandler
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_ranges", []);
      __publicField(this, "_eventHandler", new SlickEventHandler());
      __publicField(this, "_inHandler", !1);
      __publicField(this, "_selector");
      __publicField(this, "_isRowMoveManagerHandler");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        selectActiveRow: !0,
        dragToSelect: !1,
        autoScrollWhenDrag: !0,
        cellRangeSelector: void 0
      });
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    init(grid) {
      if (Draggable === void 0)
        throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
      if (this._selector = this._options.cellRangeSelector, this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), !this._selector && this._options.dragToSelect) {
        if (!SlickCellRangeDecorator)
          throw new Error("Slick.CellRangeDecorator is required when option dragToSelect set to true");
        this._selector = new SlickCellRangeSelector({
          selectionCss: { border: "none" },
          autoScroll: this._options.autoScrollWhenDrag
        });
      }
      this._eventHandler.subscribe(this._grid.onActiveCellChanged, this.wrapHandler(this.handleActiveCellChange).bind(this)), this._eventHandler.subscribe(this._grid.onKeyDown, this.wrapHandler(this.handleKeyDown).bind(this)), this._eventHandler.subscribe(this._grid.onClick, this.wrapHandler(this.handleClick).bind(this)), this._selector && (grid.registerPlugin(this._selector), this._selector.onCellRangeSelecting.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this)));
    }
    destroy() {
      this._eventHandler.unsubscribeAll(), this._selector && (this._selector.onCellRangeSelecting.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), this._selector.destroy && this._selector.destroy());
    }
    wrapHandler(handler) {
      return (...args) => {
        this._inHandler || (this._inHandler = !0, handler.apply(this, args), this._inHandler = !1);
      };
    }
    rangesToRows(ranges) {
      let rows = [];
      for (let i = 0; i < ranges.length; i++)
        for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++)
          rows.push(j);
      return rows;
    }
    rowsToRanges(rows) {
      let ranges = [], lastCell = this._grid.getColumns().length - 1;
      for (let i = 0; i < rows.length; i++)
        ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
      return ranges;
    }
    getRowsRange(from, to) {
      let i, rows = [];
      for (i = from; i <= to; i++)
        rows.push(i);
      for (i = to; i < from; i++)
        rows.push(i);
      return rows;
    }
    getSelectedRows() {
      return this.rangesToRows(this._ranges);
    }
    setSelectedRows(rows) {
      this.setSelectedRanges(this.rowsToRanges(rows), "SlickRowSelectionModel.setSelectedRows");
    }
    setSelectedRanges(ranges, caller = "SlickRowSelectionModel.setSelectedRanges") {
      if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))
        return;
      this._ranges = ranges;
      let eventData = new SlickEventData(null, this._ranges);
      Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickRowSelectionModel.setSelectedRanges" } }), this.onSelectedRangesChanged.notify(this._ranges, eventData);
    }
    getSelectedRanges() {
      return this._ranges;
    }
    refreshSelections() {
      this.setSelectedRows(this.getSelectedRows());
    }
    handleActiveCellChange(_e, args) {
      this._options.selectActiveRow && Utils.isDefined(args.row) && this.setSelectedRanges([new SlickRange(args.row, 0, args.row, this._grid.getColumns().length - 1)]);
    }
    handleKeyDown(e) {
      let activeRow = this._grid.getActiveCell();
      if (this._grid.getOptions().multiSelect && activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which === keyCode.UP || e.which === keyCode.DOWN)) {
        let selectedRows = this.getSelectedRows();
        selectedRows.sort(function(x, y) {
          return x - y;
        }), selectedRows.length || (selectedRows = [activeRow.row]);
        let top = selectedRows[0], bottom = selectedRows[selectedRows.length - 1], active;
        if (e.which === keyCode.DOWN ? active = activeRow.row < bottom || top === bottom ? ++bottom : ++top : active = activeRow.row < bottom ? --bottom : --top, active >= 0 && active < this._grid.getDataLength()) {
          this._grid.scrollRowIntoView(active);
          let tempRanges = this.rowsToRanges(this.getRowsRange(top, bottom));
          this.setSelectedRanges(tempRanges);
        }
        e.preventDefault(), e.stopPropagation();
      }
    }
    handleClick(e) {
      let cell = this._grid.getCellFromEvent(e);
      if (!cell || !this._grid.canCellBeActive(cell.row, cell.cell) || !this._grid.getOptions().multiSelect || !e.ctrlKey && !e.shiftKey && !e.metaKey)
        return !1;
      let selection = this.rangesToRows(this._ranges), idx = selection.indexOf(cell.row);
      if (idx === -1 && (e.ctrlKey || e.metaKey))
        selection.push(cell.row), this._grid.setActiveCell(cell.row, cell.cell);
      else if (idx !== -1 && (e.ctrlKey || e.metaKey))
        selection = selection.filter((o) => o !== cell.row), this._grid.setActiveCell(cell.row, cell.cell);
      else if (selection.length && e.shiftKey) {
        let last = selection.pop(), from = Math.min(cell.row, last), to = Math.max(cell.row, last);
        selection = [];
        for (let i = from; i <= to; i++)
          i !== last && selection.push(i);
        selection.push(last), this._grid.setActiveCell(cell.row, cell.cell);
      }
      let tempRanges = this.rowsToRanges(selection);
      return this.setSelectedRanges(tempRanges), e.stopImmediatePropagation(), !0;
    }
    handleBeforeCellRangeSelected(e, cell) {
      if (!this._isRowMoveManagerHandler) {
        let rowMoveManager = this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager");
        this._isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils.noop;
      }
      if (this._grid.getEditorLock().isActive() || this._isRowMoveManagerHandler(cell.cell))
        return e.stopPropagation(), !1;
      this._grid.setActiveCell(cell.row, cell.cell);
    }
    handleCellRangeSelected(_e, args) {
      if (!this._grid.getOptions().multiSelect || !this._options.selectActiveRow)
        return !1;
      this.setSelectedRanges([new SlickRange(args.range.fromRow, 0, args.range.toRow, this._grid.getColumns().length - 1)]);
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      RowSelectionModel: SlickRowSelectionModel
    }
  });
})();
//# sourceMappingURL=slick.rowselectionmodel.js.map
