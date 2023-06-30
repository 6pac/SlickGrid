"use strict";
(() => {
  // src/plugins/slick.cellcopymanager.js
  var keyCode = Slick.keyCode, SlickEvent = Slick.Event, Utils = Slick.Utils;
  function CellCopyManager() {
    var _grid, _self = this, _copiedRanges;
    function init(grid) {
      _grid = grid, _grid.onKeyDown.subscribe(handleKeyDown);
    }
    function destroy() {
      _grid.onKeyDown.unsubscribe(handleKeyDown);
    }
    function handleKeyDown(e) {
      var ranges;
      _grid.getEditorLock().isActive() || (e.which == keyCode.ESCAPE && _copiedRanges && (e.preventDefault(), clearCopySelection(), _self.onCopyCancelled.notify({ ranges: _copiedRanges }), _copiedRanges = null), e.which == 67 && (e.ctrlKey || e.metaKey) && (ranges = _grid.getSelectionModel().getSelectedRanges(), ranges.length !== 0 && (e.preventDefault(), _copiedRanges = ranges, markCopySelection(ranges), _self.onCopyCells.notify({ ranges }))), e.which == 86 && (e.ctrlKey || e.metaKey) && _copiedRanges && (e.preventDefault(), ranges = _grid.getSelectionModel().getSelectedRanges(), _self.onPasteCells.notify({ from: _copiedRanges, to: ranges }), _grid.getOptions().preserveCopiedSelectionOnPaste || (clearCopySelection(), _copiedRanges = null)));
    }
    function markCopySelection(ranges) {
      for (var columns = _grid.getColumns(), hash = {}, i = 0; i < ranges.length; i++)
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
            hash[j][columns[k].id] = "copied";
        }
      _grid.setCellCssStyles("copy-manager", hash);
    }
    function clearCopySelection() {
      _grid.removeCellCssStyles("copy-manager");
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "CellCopyManager",
      clearCopySelection,
      onCopyCells: new SlickEvent(),
      onCopyCancelled: new SlickEvent(),
      onPasteCells: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CellCopyManager
    }
  });
})();
