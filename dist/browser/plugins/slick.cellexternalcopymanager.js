"use strict";
(() => {
  // src/plugins/slick.cellexternalcopymanager.js
  var SlickEvent = Slick.Event, Utils = Slick.Utils;
  function CellExternalCopyManager(options) {
    var _grid, _self = this, _copiedRanges, _options = options || {}, _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager", _copiedCellStyle = _options.copiedCellStyle || "copied", _clearCopyTI = 0, _bodyElement = _options.bodyElement || document.body, _onCopyInit = _options.onCopyInit || null, _onCopySuccess = _options.onCopySuccess || null, keyCodes = {
      C: 67,
      V: 86,
      ESC: 27,
      INSERT: 45
    };
    function init(grid) {
      _grid = grid, _grid.onKeyDown.subscribe(handleKeyDown);
      var cellSelectionModel = grid.getSelectionModel();
      if (!cellSelectionModel)
        throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
      cellSelectionModel.onSelectedRangesChanged.subscribe(() => {
        _grid.getEditorLock().isActive() || _grid.focus();
      });
    }
    function destroy() {
      _grid.onKeyDown.unsubscribe(handleKeyDown);
    }
    function getHeaderValueForColumn(columnDef) {
      if (_options.headerColumnValueExtractor) {
        var val = _options.headerColumnValueExtractor(columnDef);
        if (val)
          return val;
      }
      return columnDef.name;
    }
    function getDataItemValueForColumn(item, columnDef, event) {
      if (typeof _options.dataItemColumnValueExtractor == "function") {
        let val = _options.dataItemColumnValueExtractor(item, columnDef);
        if (val)
          return val;
      }
      let retVal = "";
      if (columnDef && columnDef.editor) {
        let tmpP = document.createElement("p"), editor = new columnDef.editor({
          container: tmpP,
          // a dummy container
          column: columnDef,
          event,
          position: { top: 0, left: 0 },
          // a dummy position required by some editors
          grid: _grid
        });
        editor.loadValue(item), retVal = editor.serializeValue(), editor.destroy(), tmpP.remove();
      } else
        retVal = item[columnDef.field || ""];
      return retVal;
    }
    function setDataItemValueForColumn(item, columnDef, value) {
      if (columnDef.denyPaste)
        return null;
      if (_options.dataItemColumnValueSetter)
        return _options.dataItemColumnValueSetter(item, columnDef, value);
      if (columnDef.editor) {
        let tmpDiv = document.createElement("div"), editor = new columnDef.editor({
          container: tmpDiv,
          // a dummy container
          column: columnDef,
          position: { top: 0, left: 0 },
          // a dummy position required by some editors
          grid: _grid
        });
        editor.loadValue(item), editor.applyValue(item, value), editor.destroy(), tmpDiv.remove();
      } else
        item[columnDef.field] = value;
    }
    function _createTextBox(innerText) {
      var ta = document.createElement("textarea");
      return ta.style.position = "absolute", ta.style.left = "-1000px", ta.style.top = document.body.scrollTop + "px", ta.value = innerText, _bodyElement.appendChild(ta), ta.select(), ta;
    }
    function _decodeTabularData(_grid2, ta) {
      var columns = _grid2.getColumns(), clipText = ta.value, clipRows = clipText.split(/[\n\f\r]/);
      clipRows[clipRows.length - 1] === "" && clipRows.pop();
      var clippedRange = [], j = 0;
      _bodyElement.removeChild(ta);
      for (var i = 0; i < clipRows.length; i++)
        clipRows[i] !== "" ? clippedRange[j++] = clipRows[i].split("	") : clippedRange[j++] = [""];
      var selectedCell = _grid2.getActiveCell(), ranges = _grid2.getSelectionModel().getSelectedRanges(), selectedRange = ranges && ranges.length ? ranges[0] : null, activeRow = null, activeCell = null;
      if (selectedRange)
        activeRow = selectedRange.fromRow, activeCell = selectedRange.fromCell;
      else if (selectedCell)
        activeRow = selectedCell.row, activeCell = selectedCell.cell;
      else
        return;
      var oneCellToMultiple = !1, destH = clippedRange.length, destW = clippedRange.length ? clippedRange[0].length : 0;
      clippedRange.length == 1 && clippedRange[0].length == 1 && selectedRange && (oneCellToMultiple = !0, destH = selectedRange.toRow - selectedRange.fromRow + 1, destW = selectedRange.toCell - selectedRange.fromCell + 1);
      var availableRows = _grid2.getData().length - activeRow, addRows = 0;
      if (availableRows < destH && _options.newRowCreator) {
        var d = _grid2.getData();
        for (addRows = 1; addRows <= destH - availableRows; addRows++)
          d.push({});
        _grid2.setData(d), _grid2.render();
      }
      var overflowsBottomOfGrid = activeRow + destH > _grid2.getDataLength();
      if (_options.newRowCreator && overflowsBottomOfGrid) {
        var newRowsNeeded = activeRow + destH - _grid2.getDataLength();
        _options.newRowCreator(newRowsNeeded);
      }
      var clipCommand = {
        isClipboardCommand: !0,
        clippedRange,
        oldValues: [],
        cellExternalCopyManager: _self,
        _options,
        setDataItemValueForColumn,
        markCopySelection,
        oneCellToMultiple,
        activeRow,
        activeCell,
        destH,
        destW,
        maxDestY: _grid2.getDataLength(),
        maxDestX: _grid2.getColumns().length,
        h: 0,
        w: 0,
        execute: function() {
          this.h = 0;
          for (var y = 0; y < this.destH; y++) {
            this.oldValues[y] = [], this.w = 0, this.h++;
            for (var x = 0; x < this.destW; x++) {
              this.w++;
              var desty = activeRow + y, destx = activeCell + x;
              if (desty < this.maxDestY && destx < this.maxDestX) {
                var nd = _grid2.getCellNode(desty, destx), dt = _grid2.getDataItem(desty);
                this.oldValues[y][x] = dt[columns[destx].field], oneCellToMultiple ? this.setDataItemValueForColumn(dt, columns[destx], clippedRange[0][0]) : this.setDataItemValueForColumn(dt, columns[destx], clippedRange[y] ? clippedRange[y][x] : ""), _grid2.updateCell(desty, destx), _grid2.onCellChange.notify({
                  row: desty,
                  cell: destx,
                  item: dt,
                  grid: _grid2
                });
              }
            }
          }
          var bRange = {
            fromCell: activeCell,
            fromRow: activeRow,
            toCell: activeCell + this.w - 1,
            toRow: activeRow + this.h - 1
          };
          this.markCopySelection([bRange]), _grid2.getSelectionModel().setSelectedRanges([bRange]), this.cellExternalCopyManager.onPasteCells.notify({ ranges: [bRange] });
        },
        undo: function() {
          for (var y = 0; y < this.destH; y++)
            for (var x = 0; x < this.destW; x++) {
              var desty = activeRow + y, destx = activeCell + x;
              if (desty < this.maxDestY && destx < this.maxDestX) {
                var nd = _grid2.getCellNode(desty, destx), dt = _grid2.getDataItem(desty);
                oneCellToMultiple ? this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[0][0]) : this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[y][x]), _grid2.updateCell(desty, destx), _grid2.onCellChange.notify({
                  row: desty,
                  cell: destx,
                  item: dt,
                  grid: _grid2
                });
              }
            }
          var bRange = {
            fromCell: activeCell,
            fromRow: activeRow,
            toCell: activeCell + this.w - 1,
            toRow: activeRow + this.h - 1
          };
          if (this.markCopySelection([bRange]), _grid2.getSelectionModel().setSelectedRanges([bRange]), this.cellExternalCopyManager.onPasteCells.notify({ ranges: [bRange] }), addRows > 1) {
            for (var d2 = _grid2.getData(); addRows > 1; addRows--)
              d2.splice(d2.length - 1, 1);
            _grid2.setData(d2), _grid2.render();
          }
        }
      };
      _options.clipboardCommandHandler ? _options.clipboardCommandHandler(clipCommand) : clipCommand.execute();
    }
    function handleKeyDown(e, args) {
      var ranges;
      if (!_grid.getEditorLock().isActive() || _grid.getOptions().autoEdit) {
        if (e.which == keyCodes.ESC && _copiedRanges && (e.preventDefault(), clearCopySelection(), _self.onCopyCancelled.notify({ ranges: _copiedRanges }), _copiedRanges = null), (e.which === keyCodes.C || e.which === keyCodes.INSERT) && (e.ctrlKey || e.metaKey) && !e.shiftKey && (_onCopyInit && _onCopyInit.call(), ranges = _grid.getSelectionModel().getSelectedRanges(), ranges.length !== 0)) {
          _copiedRanges = ranges, markCopySelection(ranges), _self.onCopyCells.notify({ ranges });
          for (var columns = _grid.getColumns(), clipText = "", rg = 0; rg < ranges.length; rg++) {
            for (var range = ranges[rg], clipTextRows = [], i = range.fromRow; i < range.toRow + 1; i++) {
              var clipTextCells = [], dt = _grid.getDataItem(i);
              if (clipTextRows.length === 0 && _options.includeHeaderWhenCopying) {
                for (var clipTextHeaders = [], j = range.fromCell; j < range.toCell + 1; j++)
                  columns[j].name.length > 0 && !columns[j].hidden && clipTextHeaders.push(getHeaderValueForColumn(columns[j]));
                clipTextRows.push(clipTextHeaders.join("	"));
              }
              for (var j = range.fromCell; j < range.toCell + 1; j++)
                columns[j].name.length > 0 && !columns[j].hidden && clipTextCells.push(getDataItemValueForColumn(dt, columns[j], e));
              clipTextRows.push(clipTextCells.join("	"));
            }
            clipText += clipTextRows.join(`\r
`) + `\r
`;
          }
          if (window.clipboardData)
            return window.clipboardData.setData("Text", clipText), !0;
          var focusEl = document.activeElement, ta = _createTextBox(clipText);
          if (ta.focus(), setTimeout(function() {
            _bodyElement.removeChild(ta), focusEl ? focusEl.focus() : console.log("Not element to restore focus to after copy?");
          }, 100), _onCopySuccess) {
            var rowCount = 0;
            ranges.length === 1 ? rowCount = ranges[0].toRow + 1 - ranges[0].fromRow : rowCount = ranges.length, _onCopySuccess.call(this, rowCount);
          }
          return !1;
        }
        if (!_options.readOnlyMode && (e.which === keyCodes.V && (e.ctrlKey || e.metaKey) && !e.shiftKey || e.which === keyCodes.INSERT && e.shiftKey && !e.ctrlKey)) {
          var ta = _createTextBox("");
          return setTimeout(function() {
            _decodeTabularData(_grid, ta);
          }, 100), !1;
        }
      }
    }
    function markCopySelection(ranges) {
      clearCopySelection();
      for (var columns = _grid.getColumns(), hash = {}, i = 0; i < ranges.length; i++)
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell && k < columns.length; k++)
            hash[j][columns[k].id] = _copiedCellStyle;
        }
      _grid.setCellCssStyles(_copiedCellStyleLayerKey, hash), clearTimeout(_clearCopyTI), _clearCopyTI = setTimeout(function() {
        _self.clearCopySelection();
      }, 2e3);
    }
    function clearCopySelection() {
      _grid.removeCellCssStyles(_copiedCellStyleLayerKey);
    }
    function setIncludeHeaderWhenCopying(includeHeaderWhenCopying) {
      _options.includeHeaderWhenCopying = includeHeaderWhenCopying;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "CellExternalCopyManager",
      clearCopySelection,
      handleKeyDown,
      onCopyCells: new SlickEvent(),
      onCopyCancelled: new SlickEvent(),
      onPasteCells: new SlickEvent(),
      setIncludeHeaderWhenCopying
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellExternalCopyManager
    }
  });
})();
