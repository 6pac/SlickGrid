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

  // import-ns:./slick.cellrangeselector.js
  var require_slick_cellrangeselector = __commonJS({
    "import-ns:./slick.cellrangeselector.js"() {
    }
  });

  // src/plugins/slick.cellselectionmodel.js
  var require_slick_cellselectionmodel = __commonJS({
    "src/plugins/slick.cellselectionmodel.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCellSelectionModel = void 0;
      var slick_core_1 = require_slick_core(), slick_cellrangeselector_1 = require_slick_cellrangeselector(), SlickEvent = Slick.Event, SlickEventData = Slick.EventData, SlickRange = Slick.Range, SlickCellRangeSelector = Slick.CellRangeSelector, Utils = Slick.Utils, SlickCellSelectionModel = (
        /** @class */
        function() {
          function SlickCellSelectionModel2(options) {
            this.pluginName = "CellSelectionModel", this.onSelectedRangesChanged = new SlickEvent(), this._ranges = [], this._defaults = {
              selectActiveCell: !0
            }, options === void 0 || options.cellRangeSelector === void 0 ? this._selector = new SlickCellRangeSelector({ selectionCss: { border: "2px solid black" } }) : this._selector = options.cellRangeSelector;
          }
          return SlickCellSelectionModel2.prototype.init = function(grid) {
            this._options = Utils.extend(!0, {}, this._defaults, this._options), this._grid = grid, this._grid.onActiveCellChanged.subscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this)), grid.registerPlugin(this._selector), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this));
          }, SlickCellSelectionModel2.prototype.destroy = function() {
            var _a;
            this._grid.onActiveCellChanged.unsubscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), (_a = this._selector) === null || _a === void 0 || _a.destroy();
          }, SlickCellSelectionModel2.prototype.removeInvalidRanges = function(ranges) {
            for (var result = [], i = 0; i < ranges.length; i++) {
              var r = ranges[i];
              this._grid.canCellBeSelected(r.fromRow, r.fromCell) && this._grid.canCellBeSelected(r.toRow, r.toCell) && result.push(r);
            }
            return result;
          }, SlickCellSelectionModel2.prototype.rangesAreEqual = function(range1, range2) {
            var areDifferent = range1.length !== range2.length;
            if (!areDifferent) {
              for (var i = 0; i < range1.length; i++)
                if (range1[i].fromCell !== range2[i].fromCell || range1[i].fromRow !== range2[i].fromRow || range1[i].toCell !== range2[i].toCell || range1[i].toRow !== range2[i].toRow) {
                  areDifferent = !0;
                  break;
                }
            }
            return !areDifferent;
          }, SlickCellSelectionModel2.prototype.setSelectedRanges = function(ranges, caller) {
            if (caller === void 0 && (caller = "SlickCellSelectionModel.setSelectedRanges"), !((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))) {
              var rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);
              if (this._ranges = this.removeInvalidRanges(ranges), rangeHasChanged) {
                var eventData = new SlickEventData(null, this._ranges);
                Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } }), this.onSelectedRangesChanged.notify(this._ranges, eventData);
              }
            }
          }, SlickCellSelectionModel2.prototype.getSelectedRanges = function() {
            return this._ranges;
          }, SlickCellSelectionModel2.prototype.refreshSelections = function() {
            this.setSelectedRanges(this.getSelectedRanges());
          }, SlickCellSelectionModel2.prototype.handleBeforeCellRangeSelected = function(e) {
            if (this._grid.getEditorLock().isActive())
              return e.stopPropagation(), !1;
          }, SlickCellSelectionModel2.prototype.handleCellRangeSelected = function(_e, args) {
            this._grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), this.setSelectedRanges([args.range]);
          }, SlickCellSelectionModel2.prototype.handleActiveCellChange = function(_e, args) {
            var _a, _b;
            !((_a = this._options) === null || _a === void 0) && _a.selectActiveCell && args.row != null && args.cell != null ? this.setSelectedRanges([new SlickRange(args.row, args.cell)]) : !((_b = this._options) === null || _b === void 0) && _b.selectActiveCell || this.setSelectedRanges([]);
          }, SlickCellSelectionModel2.prototype.handleKeyDown = function(e) {
            var ranges, last, active = this._grid.getActiveCell(), metaKey = e.ctrlKey || e.metaKey;
            if (active && e.shiftKey && !metaKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
              ranges = this.getSelectedRanges().slice(), ranges.length || ranges.push(new SlickRange(active.row, active.cell)), last = ranges.pop(), last.contains(active.row, active.cell) || (last = new SlickRange(active.row, active.cell));
              var dRow = last.toRow - last.fromRow, dCell = last.toCell - last.fromCell, dirRow = active.row == last.fromRow ? 1 : -1, dirCell = active.cell == last.fromCell ? 1 : -1;
              e.which == 37 ? dCell -= dirCell : e.which == 39 ? dCell += dirCell : e.which == 38 ? dRow -= dirRow : e.which == 40 && (dRow += dirRow);
              var new_last = new SlickRange(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
              if (this.removeInvalidRanges([new_last]).length) {
                ranges.push(new_last);
                var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow, viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
                this._grid.scrollRowIntoView(viewRow), this._grid.scrollCellIntoView(viewRow, viewCell);
              } else
                ranges.push(last);
              this.setSelectedRanges(ranges), e.preventDefault(), e.stopPropagation();
            }
          }, SlickCellSelectionModel2;
        }()
      );
      exports.SlickCellSelectionModel = SlickCellSelectionModel;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          CellSelectionModel: SlickCellSelectionModel
        }
      });
    }
  });
  require_slick_cellselectionmodel();
})();
//# sourceMappingURL=slick.cellselectionmodel.js.map
