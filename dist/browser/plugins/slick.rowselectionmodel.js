"use strict";
(() => {
  // src/plugins/slick.rowselectionmodel.js
  var EventData = Slick.EventData, EventHandler = Slick.EventHandler, keyCode = Slick.keyCode, SlickEvent = Slick.Event, SlickRange = Slick.Range, Draggable = Slick.Draggable, CellRangeDecorator = Slick.CellRangeDecorator, CellRangeSelector = Slick.CellRangeSelector, Utils = Slick.Utils;
  function RowSelectionModel(options) {
    var _grid, _ranges = [], _self = this, _handler = new EventHandler(), _inHandler, _options, _selector, _isRowMoveManagerHandler, _defaults = {
      selectActiveRow: !0,
      dragToSelect: !1,
      autoScrollWhenDrag: !0,
      cellRangeSelector: void 0
    };
    function init(grid) {
      if (typeof Draggable == "undefined")
        throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
      if (_options = Utils.extend(!0, {}, _defaults, options), _selector = _options.cellRangeSelector, _grid = grid, !_selector && _options.dragToSelect) {
        if (!CellRangeDecorator)
          throw new Error("Slick.CellRangeDecorator is required when option dragToSelect set to true");
        _selector = new CellRangeSelector({
          selectionCss: {
            border: "none"
          },
          autoScroll: _options.autoScrollWhenDrag
        });
      }
      _handler.subscribe(
        _grid.onActiveCellChanged,
        wrapHandler(handleActiveCellChange)
      ), _handler.subscribe(
        _grid.onKeyDown,
        wrapHandler(handleKeyDown)
      ), _handler.subscribe(
        _grid.onClick,
        wrapHandler(handleClick)
      ), _selector && (grid.registerPlugin(_selector), _selector.onCellRangeSelecting.subscribe(handleCellRangeSelected), _selector.onCellRangeSelected.subscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected));
    }
    function destroy() {
      _handler.unsubscribeAll(), _selector && (_selector.onCellRangeSelecting.unsubscribe(handleCellRangeSelected), _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected), _grid.unregisterPlugin(_selector), _selector.destroy && _selector.destroy());
    }
    function wrapHandler(handler) {
      return function() {
        _inHandler || (_inHandler = !0, handler.apply(this, arguments), _inHandler = !1);
      };
    }
    function rangesToRows(ranges) {
      for (var rows = [], i = 0; i < ranges.length; i++)
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++)
          rows.push(j);
      return rows;
    }
    function rowsToRanges(rows) {
      for (var ranges = [], lastCell = _grid.getColumns().length - 1, i = 0; i < rows.length; i++)
        ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
      return ranges;
    }
    function getRowsRange(from, to) {
      var i, rows = [];
      for (i = from; i <= to; i++)
        rows.push(i);
      for (i = to; i < from; i++)
        rows.push(i);
      return rows;
    }
    function getSelectedRows() {
      return rangesToRows(_ranges);
    }
    function setSelectedRows(rows) {
      setSelectedRanges(rowsToRanges(rows), "SlickRowSelectionModel.setSelectedRows");
    }
    function setSelectedRanges(ranges, caller) {
      if (!((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0))) {
        _ranges = ranges;
        var eventData = new EventData(null, _ranges);
        Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickRowSelectionModel.setSelectedRanges" } }), _self.onSelectedRangesChanged.notify(_ranges, eventData);
      }
    }
    function getSelectedRanges() {
      return _ranges;
    }
    function refreshSelections() {
      setSelectedRows(getSelectedRows());
    }
    function handleActiveCellChange(e, data) {
      _options.selectActiveRow && data.row != null && setSelectedRanges([new SlickRange(data.row, 0, data.row, _grid.getColumns().length - 1)]);
    }
    function handleKeyDown(e) {
      var activeRow = _grid.getActiveCell();
      if (_grid.getOptions().multiSelect && activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == keyCode.UP || e.which == keyCode.DOWN)) {
        var selectedRows = getSelectedRows();
        selectedRows.sort(function(x, y) {
          return x - y;
        }), selectedRows.length || (selectedRows = [activeRow.row]);
        var top = selectedRows[0], bottom = selectedRows[selectedRows.length - 1], active;
        if (e.which == keyCode.DOWN ? active = activeRow.row < bottom || top == bottom ? ++bottom : ++top : active = activeRow.row < bottom ? --bottom : --top, active >= 0 && active < _grid.getDataLength()) {
          _grid.scrollRowIntoView(active);
          var tempRanges = rowsToRanges(getRowsRange(top, bottom));
          setSelectedRanges(tempRanges);
        }
        e.preventDefault(), e.stopPropagation();
      }
    }
    function handleClick(e) {
      var cell = _grid.getCellFromEvent(e);
      if (!cell || !_grid.canCellBeActive(cell.row, cell.cell) || !_grid.getOptions().multiSelect || !e.ctrlKey && !e.shiftKey && !e.metaKey)
        return !1;
      var selection = rangesToRows(_ranges), idx = selection.indexOf(cell.row);
      if (idx === -1 && (e.ctrlKey || e.metaKey))
        selection.push(cell.row), _grid.setActiveCell(cell.row, cell.cell);
      else if (idx !== -1 && (e.ctrlKey || e.metaKey))
        selection = selection.filter((o) => o !== cell.row), _grid.setActiveCell(cell.row, cell.cell);
      else if (selection.length && e.shiftKey) {
        var last = selection.pop(), from = Math.min(cell.row, last), to = Math.max(cell.row, last);
        selection = [];
        for (var i = from; i <= to; i++)
          i !== last && selection.push(i);
        selection.push(last), _grid.setActiveCell(cell.row, cell.cell);
      }
      var tempRanges = rowsToRanges(selection);
      return setSelectedRanges(tempRanges), e.stopImmediatePropagation(), !0;
    }
    function handleBeforeCellRangeSelected(e, cell) {
      if (!_isRowMoveManagerHandler) {
        var rowMoveManager = _grid.getPluginByName("RowMoveManager") || _grid.getPluginByName("CrossGridRowMoveManager");
        _isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils.noop;
      }
      if (_grid.getEditorLock().isActive() || _isRowMoveManagerHandler(cell.cell))
        return e.stopPropagation(), !1;
      _grid.setActiveCell(cell.row, cell.cell);
    }
    function handleCellRangeSelected(e, args) {
      if (!_grid.getOptions().multiSelect || !_options.selectActiveRow)
        return !1;
      setSelectedRanges([new SlickRange(args.range.fromRow, 0, args.range.toRow, _grid.getColumns().length - 1)]);
    }
    Utils.extend(this, {
      getSelectedRows,
      setSelectedRows,
      getSelectedRanges,
      setSelectedRanges,
      refreshSelections,
      init,
      destroy,
      pluginName: "RowSelectionModel",
      onSelectedRangesChanged: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      RowSelectionModel
    }
  });
})();
//# sourceMappingURL=slick.rowselectionmodel.js.map
