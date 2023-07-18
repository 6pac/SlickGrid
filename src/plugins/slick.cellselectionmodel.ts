import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickRange as SlickRange_, Utils as Utils_ } from '../slick.core';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector';
import type { CellRange, OnActiveCellChangedEventArgs } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventData = IIFE_ONLY ? Slick.EventData : SlickEventData_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const SlickCellRangeSelector = IIFE_ONLY ? Slick.CellRangeSelector : SlickCellRangeSelector_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export interface CellSelectionModelOption {
  selectActiveCell: boolean;
  cellRangeSelector?: SlickCellRangeSelector_;
}

export class SlickCellSelectionModel {
  // --
  // public API
  pluginName = 'CellSelectionModel' as const;
  onSelectedRangesChanged = new SlickEvent<CellRange[]>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _ranges: CellRange[] = [];
  protected _selector: SlickCellRangeSelector_;
  protected _options?: CellSelectionModelOption;
  protected _defaults: CellSelectionModelOption = {
    selectActiveCell: true
  };

  constructor(options?: { selectActiveCell: boolean; cellRangeSelector: SlickCellRangeSelector_; }) {
    if (options === undefined || options.cellRangeSelector === undefined) {
      this._selector = new SlickCellRangeSelector({ selectionCss: { border: '2px solid black' } as CSSStyleDeclaration });
    } else {
      this._selector = options.cellRangeSelector;
    }
  }

  init(grid: SlickGrid) {
    this._options = Utils.extend(true, {}, this._defaults, this._options);
    this._grid = grid;
    this._grid.onActiveCellChanged.subscribe(this.handleActiveCellChange.bind(this));
    this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));
    grid.registerPlugin(this._selector);
    this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this));
    this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this));
  }

  destroy() {
    this._grid.onActiveCellChanged.unsubscribe(this.handleActiveCellChange.bind(this));
    this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
    this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this));
    this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this));
    this._grid.unregisterPlugin(this._selector);
    this._selector?.destroy();
  }

  protected removeInvalidRanges(ranges: CellRange[]) {
    let result: CellRange[] = [];

    for (let i = 0; i < ranges.length; i++) {
      let r = ranges[i];
      if (this._grid.canCellBeSelected(r.fromRow, r.fromCell) && this._grid.canCellBeSelected(r.toRow, r.toCell)) {
        result.push(r);
      }
    }

    return result;
  }

  protected rangesAreEqual(range1: CellRange[], range2: CellRange[]) {
    let areDifferent = (range1.length !== range2.length);
    if (!areDifferent) {
      for (let i = 0; i < range1.length; i++) {
        if (
          range1[i].fromCell !== range2[i].fromCell
          || range1[i].fromRow !== range2[i].fromRow
          || range1[i].toCell !== range2[i].toCell
          || range1[i].toRow !== range2[i].toRow
        ) {
          areDifferent = true;
          break;
        }
      }
    }
    return !areDifferent;
  }

  setSelectedRanges(ranges: CellRange[], caller = 'SlickCellSelectionModel.setSelectedRanges') {
    // simple check for: empty selection didn't change, prevent firing onSelectedRangesChanged
    if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0)) { return; }

    // if range has not changed, don't fire onSelectedRangesChanged
    let rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);

    this._ranges = this.removeInvalidRanges(ranges);
    if (rangeHasChanged) {
      // provide extra "caller" argument through SlickEventData to avoid breaking pubsub event that only accepts an array of selected range
      let eventData = new SlickEventData(null, this._ranges);
      Object.defineProperty(eventData, 'detail', { writable: true, configurable: true, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } });
      this.onSelectedRangesChanged.notify(this._ranges, eventData);
    }
  }

  getSelectedRanges() {
    return this._ranges;
  }

  refreshSelections() {
    this.setSelectedRanges(this.getSelectedRanges());
  }

  protected handleBeforeCellRangeSelected(e): boolean | void {
    if (this._grid.getEditorLock().isActive()) {
      e.stopPropagation();
      return false;
    }
  }

  protected handleCellRangeSelected(_e: any, args: { range: CellRange; }) {
    this._grid.setActiveCell(args.range.fromRow, args.range.fromCell, false, false, true);
    this.setSelectedRanges([args.range]);
  }

  protected handleActiveCellChange(_e: Event, args: OnActiveCellChangedEventArgs) {
    if (this._options?.selectActiveCell && args.row != null && args.cell != null) {
      this.setSelectedRanges([new SlickRange(args.row, args.cell)]);
    }
    else if (!this._options?.selectActiveCell) {
      // clear the previous selection once the cell changes
      this.setSelectedRanges([]);
    }
  }

  protected handleKeyDown(e: KeyboardEvent) {
    /***
     * Кey codes
     * 37 left
     * 38 up
     * 39 right
     * 40 down
     */
    let ranges: CellRange[], last: SlickRange_;
    let active = this._grid.getActiveCell();
    let metaKey = e.ctrlKey || e.metaKey;

    if (active && e.shiftKey && !metaKey && !e.altKey &&
      (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {

      ranges = this.getSelectedRanges().slice();
      if (!ranges.length)
        ranges.push(new SlickRange(active.row, active.cell));

      // keyboard can work with last range only
      last = ranges.pop() as SlickRange_;

      // can't handle selection out of active cell
      if (!last.contains(active.row, active.cell))
        last = new SlickRange(active.row, active.cell);

      let dRow = last.toRow - last.fromRow,
        dCell = last.toCell - last.fromCell,
        // walking direction
        dirRow = active.row == last.fromRow ? 1 : -1,
        dirCell = active.cell == last.fromCell ? 1 : -1;

      if (e.which == 37) {
        dCell -= dirCell;
      } else if (e.which == 39) {
        dCell += dirCell;
      } else if (e.which == 38) {
        dRow -= dirRow;
      } else if (e.which == 40) {
        dRow += dirRow;
      }

      // define new selection range
      let new_last = new SlickRange(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
      if (this.removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        let viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
        let viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
        this._grid.scrollRowIntoView(viewRow);
        this._grid.scrollCellIntoView(viewRow, viewCell);
      }
      else
        ranges.push(last);

      this.setSelectedRanges(ranges);

      e.preventDefault();
      e.stopPropagation();
    }
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      CellSelectionModel: SlickCellSelectionModel
    }
  });
}
