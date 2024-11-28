import type { CssStyleHash, SlickPlugin } from '../models/index.js';
import { keyCode as keyCode_, SlickEvent as SlickEvent_, type SlickEventData, Utils as Utils_, type SlickRange } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * This manager enables users to copy/paste cell data
 */
export class SlickCellCopyManager implements SlickPlugin {
  // --
  // public API
  pluginName = 'CellCopyManager' as const;
  onCopyCells = new SlickEvent<{ ranges: SlickRange[] | null; }>('onCopyCells');
  onCopyCancelled = new SlickEvent<{ ranges: SlickRange[] | null; }>('onCopyCancelled');
  onPasteCells = new SlickEvent<{ from: SlickRange[] | undefined; to: SlickRange[] | undefined; }>('onPasteCells');

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _copiedRanges?: SlickRange[] | null = null;

  init(grid: SlickGrid) {
    this._grid = grid;
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));
  }

  destroy() {
    this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
  }

  protected handleKeyDown(e: SlickEventData) {
    let ranges: SlickRange[] | undefined;
    if (!this._grid.getEditorLock().isActive()) {
      if (e.which === keyCode.ESCAPE) {
        if (this._copiedRanges) {
          e.preventDefault();
          this.clearCopySelection();
          this.onCopyCancelled.notify({ ranges: this._copiedRanges });
          this._copiedRanges = null;
        }
      }

      if (e.which === 67 && (e.ctrlKey || e.metaKey)) {
        ranges = this._grid.getSelectionModel()?.getSelectedRanges() ?? [];
        if (ranges.length !== 0) {
          e.preventDefault();
          this._copiedRanges = ranges;
          this.markCopySelection(ranges);
          this.onCopyCells.notify({ ranges });
        }
      }

      if (e.which === 86 && (e.ctrlKey || e.metaKey)) {
        if (this._copiedRanges) {
          e.preventDefault();
          ranges = this._grid.getSelectionModel()?.getSelectedRanges();
          this.onPasteCells.notify({ from: this._copiedRanges, to: ranges });
          if (!this._grid.getOptions().preserveCopiedSelectionOnPaste) {
            this.clearCopySelection();
            this._copiedRanges = null;
          }
        }
      }
    }
  }

  protected markCopySelection(ranges: SlickRange[]) {
    const columns = this._grid.getColumns();
    const hash: CssStyleHash = {};
    for (let i = 0; i < ranges.length; i++) {
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] = {};
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
          hash[j][columns[k].id] = 'copied';
        }
      }
    }
    this._grid.setCellCssStyles('copy-manager', hash);
  }

  protected clearCopySelection() {
    this._grid.removeCellCssStyles('copy-manager');
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      CellCopyManager: SlickCellCopyManager
    }
  });
}
