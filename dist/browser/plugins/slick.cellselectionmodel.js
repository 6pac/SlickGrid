"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.cellselectionmodel.ts
  var SlickEvent = Slick.Event, SlickEventData = Slick.EventData, SlickRange = Slick.Range, SlickCellRangeSelector = Slick.CellRangeSelector, Utils = Slick.Utils, SlickCellSelectionModel = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "CellSelectionModel");
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
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        selectActiveCell: !0
      });
      options === void 0 || options.cellRangeSelector === void 0 ? this._selector = new SlickCellRangeSelector({ selectionCss: { border: "2px solid black" } }) : this._selector = options.cellRangeSelector;
    }
    init(grid) {
      this._options = Utils.extend(!0, {}, this._defaults, this._options), this._grid = grid, grid.hasDataView() && (this._dataView = grid.getData()), this._grid.onActiveCellChanged.subscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this)), grid.registerPlugin(this._selector), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this));
    }
    destroy() {
      var _a;
      this._grid.onActiveCellChanged.unsubscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), (_a = this._selector) == null || _a.destroy();
    }
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
    /** Provide a way to force a recalculation of page row count (for example on grid resize) */
    resetPageRowCount() {
      this._cachedPageRowCount = 0;
    }
    setSelectedRanges(ranges, caller = "SlickCellSelectionModel.setSelectedRanges") {
      if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))
        return;
      let rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);
      if (this._ranges = this.removeInvalidRanges(ranges), rangeHasChanged) {
        let eventData = new SlickEventData(null, this._ranges);
        Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } }), this.onSelectedRangesChanged.notify(this._ranges, eventData);
      }
    }
    getSelectedRanges() {
      return this._ranges;
    }
    refreshSelections() {
      this.setSelectedRanges(this.getSelectedRanges());
    }
    handleBeforeCellRangeSelected(e) {
      if (this._grid.getEditorLock().isActive())
        return e.stopPropagation(), !1;
    }
    handleCellRangeSelected(_e, args) {
      this._grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), this.setSelectedRanges([args.range]);
    }
    handleActiveCellChange(_e, args) {
      var _a, _b;
      this._prevSelectedRow = void 0;
      let isCellDefined = Utils.isDefined(args.cell), isRowDefined = Utils.isDefined(args.row);
      (_a = this._options) != null && _a.selectActiveCell && isRowDefined && isCellDefined ? this.setSelectedRanges([new SlickRange(args.row, args.cell)]) : (!((_b = this._options) != null && _b.selectActiveCell) || !isRowDefined && !isCellDefined) && this.setSelectedRanges([]);
    }
    isKeyAllowed(key) {
      return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageDown", "PageUp", "Home", "End"].some((k) => k === key);
    }
    handleKeyDown(e) {
      var _a;
      let ranges, last, colLn = this._grid.getColumns().length, active = this._grid.getActiveCell(), dataLn = 0;
      if (this._dataView ? dataLn = ((_a = this._dataView) == null ? void 0 : _a.getPagingInfo().pageSize) || this._dataView.getLength() : dataLn = this._grid.getDataLength(), active && (e.shiftKey || e.ctrlKey) && !e.altKey && this.isKeyAllowed(e.key)) {
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
        this.setSelectedRanges(ranges), e.preventDefault(), e.stopPropagation(), this._prevKeyDown = e.key;
      }
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellSelectionModel: SlickCellSelectionModel
    }
  });
})();
//# sourceMappingURL=slick.cellselectionmodel.js.map
