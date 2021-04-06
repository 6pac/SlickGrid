declare namespace Slick {
  class Range {
    fromRow: number;
    toRow: number;
    fromCell: number;
    toCell: number;
  }
}

type CellCopyManager = {
  onCopyCancelled: Slick.Event;
  onCopyCells: Slick.Event;
  onPasteCells: Slick.Event;
};

(function ($) {
  // register namespace
  $.extend(true, window, {
    Slick: {
      CellCopyManager: CellCopyManager,
    },
  });

  function CellCopyManager(this: CellCopyManager) {
    let _grid: SlickGrid;
    const _self = this;
    let _copiedRanges: Range[] | null;

    function init(grid: SlickGrid) {
      _grid = grid;
      _grid.onKeyDown.subscribe(handleKeyDown);
    }

    function destroy() {
      _grid.onKeyDown.unsubscribe(handleKeyDown);
    }

    function handleKeyDown(e: KeyboardEvent) {
      let ranges;
      if (!_grid.getEditorLock().isActive()) {
        if (e.which == $.ui.keyCode.ESCAPE) {
          if (_copiedRanges) {
            e.preventDefault();
            clearCopySelection();
            _self.onCopyCancelled.notify({ ranges: _copiedRanges });
            _copiedRanges = null;
          }
        }

        if (e.which == 67 && (e.ctrlKey || e.metaKey)) {
          ranges = _grid.getSelectionModel().getSelectedRanges();
          if (ranges.length !== 0) {
            e.preventDefault();
            _copiedRanges = ranges;
            markCopySelection(ranges);
            _self.onCopyCells.notify({ ranges: ranges });
          }
        }

        if (e.which == 86 && (e.ctrlKey || e.metaKey)) {
          if (_copiedRanges) {
            e.preventDefault();
            ranges = _grid.getSelectionModel().getSelectedRanges();
            _self.onPasteCells.notify({ from: _copiedRanges, to: ranges });
            if (!_grid.getOptions().preserveCopiedSelectionOnPaste) {
              clearCopySelection();
              _copiedRanges = null;
            }
          }
        }
      }
    }

    function markCopySelection(ranges: Slick.Range[]) {
      const columns = _grid.getColumns();
      const hash: Record<number, Record<string | number, string>> = {};
      for (let i = 0; i < ranges.length; i++) {
        for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
            hash[j][columns[k].id] = "copied";
          }
        }
      }
      _grid.setCellCssStyles("copy-manager", hash);
    }

    function clearCopySelection() {
      _grid.removeCellCssStyles("copy-manager");
    }

    $.extend(this, {
      init: init,
      destroy: destroy,
      pluginName: "CellCopyManager",

      clearCopySelection: clearCopySelection,

      onCopyCells: new Slick.Event(),
      onCopyCancelled: new Slick.Event(),
      onPasteCells: new Slick.Event(),
    });
  }
})(jQuery);
