"use strict";
(() => {
  // src/plugins/slick.cellselectionmodel.js
  var SlickEvent = Slick.Event, EventData = Slick.EventData, SlickRange = Slick.Range, CellRangeSelector = Slick.CellRangeSelector, Utils = Slick.Utils;
  function CellSelectionModel(options) {
    var _grid, _ranges = [], _self = this, _selector;
    typeof options == "undefined" || typeof options.cellRangeSelector == "undefined" ? _selector = new CellRangeSelector({
      selectionCss: {
        border: "2px solid black"
      }
    }) : _selector = options.cellRangeSelector;
    var _options, _defaults = {
      selectActiveCell: !0
    };
    function init(grid) {
      _options = Utils.extend(!0, {}, _defaults, options), _grid = grid, _grid.onActiveCellChanged.subscribe(handleActiveCellChange), _grid.onKeyDown.subscribe(handleKeyDown), grid.registerPlugin(_selector), _selector.onCellRangeSelected.subscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
    }
    function destroy() {
      _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange), _grid.onKeyDown.unsubscribe(handleKeyDown), _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected), _grid.unregisterPlugin(_selector), _selector && _selector.destroy && _selector.destroy();
    }
    function removeInvalidRanges(ranges) {
      for (var result = [], i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        _grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell) && result.push(r);
      }
      return result;
    }
    function rangesAreEqual(range1, range2) {
      var areDifferent = range1.length !== range2.length;
      if (!areDifferent) {
        for (var i = 0; i < range1.length; i++)
          if (range1[i].fromCell !== range2[i].fromCell || range1[i].fromRow !== range2[i].fromRow || range1[i].toCell !== range2[i].toCell || range1[i].toRow !== range2[i].toRow) {
            areDifferent = !0;
            break;
          }
      }
      return !areDifferent;
    }
    function setSelectedRanges(ranges, caller) {
      if (!((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0))) {
        var rangeHasChanged = !rangesAreEqual(_ranges, ranges);
        if (_ranges = removeInvalidRanges(ranges), rangeHasChanged) {
          var eventData = new EventData(null, _ranges);
          Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } }), _self.onSelectedRangesChanged.notify(_ranges, eventData);
        }
      }
    }
    function getSelectedRanges() {
      return _ranges;
    }
    function refreshSelections() {
      setSelectedRanges(getSelectedRanges());
    }
    function handleBeforeCellRangeSelected(e) {
      if (_grid.getEditorLock().isActive())
        return e.stopPropagation(), !1;
    }
    function handleCellRangeSelected(e, args) {
      _grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), setSelectedRanges([args.range]);
    }
    function handleActiveCellChange(e, args) {
      _options.selectActiveCell && args.row != null && args.cell != null ? setSelectedRanges([new SlickRange(args.row, args.cell)]) : _options.selectActiveCell || setSelectedRanges([]);
    }
    function handleKeyDown(e) {
      var ranges, last, active = _grid.getActiveCell(), metaKey = e.ctrlKey || e.metaKey;
      if (active && e.shiftKey && !metaKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
        ranges = getSelectedRanges().slice(), ranges.length || ranges.push(new SlickRange(active.row, active.cell)), last = ranges.pop(), last.contains(active.row, active.cell) || (last = new SlickRange(active.row, active.cell));
        var dRow = last.toRow - last.fromRow, dCell = last.toCell - last.fromCell, dirRow = active.row == last.fromRow ? 1 : -1, dirCell = active.cell == last.fromCell ? 1 : -1;
        e.which == 37 ? dCell -= dirCell : e.which == 39 ? dCell += dirCell : e.which == 38 ? dRow -= dirRow : e.which == 40 && (dRow += dirRow);
        var new_last = new SlickRange(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
        if (removeInvalidRanges([new_last]).length) {
          ranges.push(new_last);
          var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow, viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
          _grid.scrollRowIntoView(viewRow), _grid.scrollCellIntoView(viewRow, viewCell);
        } else
          ranges.push(last);
        setSelectedRanges(ranges), e.preventDefault(), e.stopPropagation();
      }
    }
    Utils.extend(this, {
      getSelectedRanges,
      setSelectedRanges,
      refreshSelections,
      init,
      destroy,
      pluginName: "CellSelectionModel",
      onSelectedRangesChanged: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellSelectionModel
    }
  });
})();
