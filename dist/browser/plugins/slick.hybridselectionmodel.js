"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value);

  // src/plugins/slick.hybridselectionmodel.ts
  var Draggable = Slick.Draggable, keyCode = Slick.keyCode, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, SlickRange = Slick.Range, SlickCellRangeDecorator = Slick.CellRangeDecorator, SlickCellRangeSelector = Slick.CellRangeSelector, Utils = Slick.Utils, SlickHybridSelectionModel = class {
    constructor(options) {
      // hybrid selection model is CellSelectionModel except when selecting
      // specific columns, which behave as RowSelectionModel
      // --
      // public API
      __publicField(this, "pluginName", "HybridSelectionModel");
      __publicField(this, "onSelectedRangesChanged", new SlickEvent("onSelectedRangesChanged"));
      // --
      // protected props
      __publicField(this, "_cachedPageRowCount", 0);
      __publicField(this, "_dataView");
      __publicField(this, "_grid");
      __publicField(this, "_prevSelectedRow");
      __publicField(this, "_prevKeyDown", "");
      __publicField(this, "_ranges", []);
      __publicField(this, "_selector");
      __publicField(this, "_isRowMoveManagerHandler");
      __publicField(this, "_activeSelectionIsRow", !1);
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        selectActiveCell: !0,
        selectActiveRow: !0,
        dragToSelect: !1,
        autoScrollWhenDrag: !0,
        handleRowMoveManagerColumn: !0,
        // Row Selection on RowMoveManage column
        rowSelectColumnObjectArr: [],
        // Row Selection on these columns
        rowSelectOverride: void 0,
        // function to toggle Row Selection Models
        cellRangeSelector: void 0
      });
      options === void 0 || options.cellRangeSelector === void 0 ? this._selector = new SlickCellRangeSelector({ selectionCss: { border: "2px solid black" } }) : this._selector = options.cellRangeSelector;
    }
    // Region: Setup
    // -----------------------------------------------------------------------------
    init(grid) {
      if (Draggable === void 0)
        throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
      if (this._options = Utils.extend(!0, {}, this._defaults, this._options), this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), !this._selector && this._options.dragToSelect) {
        if (!SlickCellRangeDecorator)
          throw new Error("Slick.CellRangeDecorator is required when option dragToSelect set to true");
        this._selector = new SlickCellRangeSelector({
          selectionCss: { border: "none" },
          autoScroll: this._options.autoScrollWhenDrag
        });
      }
      grid.hasDataView() && (this._dataView = grid.getData()), this._grid.onActiveCellChanged.subscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this)), this._grid.onClick.subscribe(this.handleClick.bind(this)), this._selector && (grid.registerPlugin(this._selector), this._selector.onCellRangeSelecting.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this)));
    }
    destroy() {
      var _a;
      this._grid.onActiveCellChanged.unsubscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this)), this._grid.onClick.unsubscribe(this.handleClick.bind(this)), this._selector.onCellRangeSelecting.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), (_a = this._selector) == null || _a.destroy();
    }
    // Region: CellSelectionModel Members
    // -----------------------------------------------------------------------------
    removeInvalidRanges(ranges) {
      let result = [];
      for (let i = 0; i < ranges.length; i++) {
        let r = ranges[i];
        this._grid.canCellBeSelected(r.fromRow, r.fromCell) && this._grid.canCellBeSelected(r.toRow, r.toCell) && result.push(r);
      }
      return result;
    }
    rangesAreEqual(range1, range2) {
      let areDifferent = range1.length !== range2.length;
      if (!areDifferent) {
        for (let i = 0; i < range1.length; i++)
          if (range1[i].fromCell !== range2[i].fromCell || range1[i].fromRow !== range2[i].fromRow || range1[i].toCell !== range2[i].toCell || range1[i].toRow !== range2[i].toRow) {
            areDifferent = !0;
            break;
          }
      }
      return !areDifferent;
    }
    // Region: RowSelectionModel Members
    // -----------------------------------------------------------------------------
    rangesToRows(ranges) {
      let rows = [];
      for (let i = 0; i < ranges.length; i++)
        for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++)
          rows.push(j);
      return rows;
    }
    rowsToRanges(rows) {
      let ranges = [], lastCell = this._grid.getColumns().length - 1;
      return rows.forEach((row) => ranges.push(new SlickRange(row, 0, row, lastCell))), ranges;
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
      this.setSelectedRanges(this.rowsToRanges(rows), "SlickRowSelectionModel.setSelectedRows", "");
    }
    // Region: Shared Members
    // -----------------------------------------------------------------------------
    /** Provide a way to force a recalculation of page row count (for example on grid resize) */
    resetPageRowCount() {
      this._cachedPageRowCount = 0;
    }
    setSelectedRanges(ranges, caller = "SlickHybridSelectionModel.setSelectedRanges", selectionMode) {
      if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))
        return;
      let rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);
      if (this._activeSelectionIsRow) {
        this._ranges = ranges;
        let eventData = new SlickEventData(new CustomEvent("click", { detail: { caller, selectionMode } }), this._ranges);
        this.onSelectedRangesChanged.notify(this._ranges, eventData);
      } else if (this._ranges = this.removeInvalidRanges(ranges), rangeHasChanged) {
        let eventData = new SlickEventData(new CustomEvent("click", { detail: { caller, selectionMode } }), this._ranges);
        this.onSelectedRangesChanged.notify(this._ranges, eventData);
      }
    }
    currentSelectionModeIsRow() {
      return this._activeSelectionIsRow;
    }
    getSelectedRanges() {
      return this._ranges;
    }
    refreshSelections() {
      this._activeSelectionIsRow ? this.setSelectedRows(this.getSelectedRows()) : this.setSelectedRanges(this.getSelectedRanges(), void 0, "");
    }
    getRowMoveManagerPlugin() {
      return this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager");
    }
    rowSelectionModelIsActive(data) {
      var _a, _b, _c, _d;
      if ((_a = this._options) != null && _a.rowSelectOverride)
        return (_b = this._options) == null ? void 0 : _b.rowSelectOverride(data, this, this._grid);
      if ((_c = this._options) != null && _c.handleRowMoveManagerColumn) {
        let rowMoveManager = this.getRowMoveManagerPlugin();
        if (rowMoveManager != null && rowMoveManager.isHandlerColumn(data.cell))
          return !0;
      }
      let targetColumn = this._grid.getVisibleColumns()[data.cell];
      return ((_d = this._options) == null ? void 0 : _d.rowSelectColumnObjectArr.includes(targetColumn)) || !1;
    }
    handleActiveCellChange(_e, args) {
      var _a, _b, _c;
      this._prevSelectedRow = void 0;
      let isCellDefined = Utils.isDefined(args.cell), isRowDefined = Utils.isDefined(args.row);
      this._activeSelectionIsRow = this.rowSelectionModelIsActive(args), this._activeSelectionIsRow ? (_a = this._options) != null && _a.selectActiveRow && args.row !== null && this.setSelectedRanges([new Slick.Range(args.row, 0, args.row, this._grid.getColumns().length - 1)], void 0, "") : (_b = this._options) != null && _b.selectActiveCell && isRowDefined && isCellDefined ? this.setSelectedRanges([new SlickRange(args.row, args.cell)], void 0, "") : (!((_c = this._options) != null && _c.selectActiveCell) || !isRowDefined && !isCellDefined) && this.setSelectedRanges([], void 0, "");
    }
    isKeyAllowed(key) {
      return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageDown", "PageUp", "Home", "End"].some((k) => k === key);
    }
    handleKeyDown(e) {
      var _a;
      if (this._activeSelectionIsRow) {
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
            this.setSelectedRanges(tempRanges, void 0, "");
          }
          e.preventDefault(), e.stopPropagation();
        }
      } else {
        let ranges, last, colLn = this._grid.getColumns().length, active = this._grid.getActiveCell(), dataLn = 0;
        if (this._dataView && "getPagingInfo" in this._dataView ? dataLn = ((_a = this._dataView) == null ? void 0 : _a.getPagingInfo().pageSize) || this._dataView.getLength() : dataLn = this._grid.getDataLength(), active && (e.shiftKey || e.ctrlKey) && !e.altKey && this.isKeyAllowed(e.key)) {
          ranges = this.getSelectedRanges().slice(), ranges.length || ranges.push(new SlickRange(active.row, active.cell)), last = ranges.pop(), last.contains(active.row, active.cell) || (last = new SlickRange(active.row, active.cell));
          let dRow = last.toRow - last.fromRow, dCell = last.toCell - last.fromCell, dirRow = active.row === last.fromRow ? 1 : -1, dirCell = active.cell === last.fromCell ? 1 : -1, isSingleKeyMove = e.key.startsWith("Arrow"), toCell, toRow = 0;
          isSingleKeyMove && !e.ctrlKey ? (e.key === "ArrowLeft" ? dCell -= dirCell : e.key === "ArrowRight" ? dCell += dirCell : e.key === "ArrowUp" ? dRow -= dirRow : e.key === "ArrowDown" && (dRow += dirRow), toRow = active.row + dirRow * dRow) : (this._cachedPageRowCount < 1 && (this._cachedPageRowCount = this._grid.getViewportRowCount()), this._prevSelectedRow === void 0 && (this._prevSelectedRow = active.row), e.shiftKey && !e.ctrlKey && e.key === "Home" ? (toCell = 0, toRow = active.row) : e.shiftKey && !e.ctrlKey && e.key === "End" ? (toCell = colLn - 1, toRow = active.row) : e.ctrlKey && e.shiftKey && e.key === "Home" ? (toCell = 0, toRow = 0) : e.ctrlKey && e.shiftKey && e.key === "End" ? (toCell = colLn - 1, toRow = dataLn - 1) : e.key === "PageUp" ? (this._prevSelectedRow >= 0 && (toRow = this._prevSelectedRow - this._cachedPageRowCount), toRow < 0 && (toRow = 0)) : e.key === "PageDown" && (this._prevSelectedRow <= dataLn - 1 && (toRow = this._prevSelectedRow + this._cachedPageRowCount), toRow > dataLn - 1 && (toRow = dataLn - 1)), this._prevSelectedRow = toRow), toCell != null || (toCell = active.cell + dirCell * dCell);
          let new_last = new SlickRange(active.row, active.cell, toRow, toCell);
          if (this.removeInvalidRanges([new_last]).length) {
            ranges.push(new_last);
            let viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow, viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
            isSingleKeyMove ? (this._grid.scrollRowIntoView(viewRow), this._grid.scrollCellIntoView(viewRow, viewCell)) : (this._grid.scrollRowIntoView(toRow), this._grid.scrollCellIntoView(toRow, viewCell));
          } else
            ranges.push(last);
          this.setSelectedRanges(ranges, void 0, ""), e.preventDefault(), e.stopPropagation(), this._prevKeyDown = e.key;
        }
      }
    }
    handleClick(e) {
      if (!this._activeSelectionIsRow)
        return;
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
      return this.setSelectedRanges(tempRanges, void 0, ""), e.stopImmediatePropagation(), !0;
    }
    handleBeforeCellRangeSelected(e, cell) {
      if (this._activeSelectionIsRow) {
        if (!this._isRowMoveManagerHandler) {
          let rowMoveManager = this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager");
          this._isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils.noop;
        }
        if (this._grid.getEditorLock().isActive() || this._isRowMoveManagerHandler(cell.cell))
          return e.stopPropagation(), !1;
        this._grid.setActiveCell(cell.row, cell.cell);
      } else if (this._grid.getEditorLock().isActive())
        return e.stopPropagation(), !1;
    }
    handleCellRangeSelected(_e, args) {
      var _a;
      if (this._activeSelectionIsRow) {
        if (!this._grid.getOptions().multiSelect || !((_a = this._options) != null && _a.selectActiveRow))
          return !1;
        this.setSelectedRanges([new SlickRange(args.range.fromRow, 0, args.range.toRow, this._grid.getColumns().length - 1)], void 0, args.selectionMode);
      } else
        this._grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), this.setSelectedRanges([args.range], void 0, args.selectionMode);
      return !0;
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      HybridSelectionModel: SlickHybridSelectionModel
    }
  });
})();
//# sourceMappingURL=slick.hybridselectionmodel.js.map
