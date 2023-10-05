import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickRange as SlickRange_, Utils as Utils_ } from '../slick.core';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector';
import type { CellRange, OnActiveCellChangedEventArgs } from '../models/index';
import type { SlickDataView } from '../slick.dataview';
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
  protected _cachedPageRowCount = 0;
  protected _dataView?: SlickDataView;
  protected _grid!: SlickGrid;
  protected _prevSelectedRow?: number;
  protected _prevKeyDown = '';
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
    if (grid.hasDataView()) {
      this._dataView = grid.getData<SlickDataView>();
    }
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
    const result: CellRange[] = [];

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
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

  /** Provide a way to force a recalculation of page row count (for example on grid resize) */
  resetPageRowCount() {
    this._cachedPageRowCount = 0;
  }

  setSelectedRanges(ranges: CellRange[], caller = 'SlickCellSelectionModel.setSelectedRanges') {
    // simple check for: empty selection didn't change, prevent firing onSelectedRangesChanged
    if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0)) { return; }

    // if range has not changed, don't fire onSelectedRangesChanged
    const rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);

    this._ranges = this.removeInvalidRanges(ranges);
    if (rangeHasChanged) {
      // provide extra "caller" argument through SlickEventData to avoid breaking pubsub event that only accepts an array of selected range
      const eventData = new SlickEventData(null, this._ranges);
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

  protected handleBeforeCellRangeSelected(e: Event): boolean | void {
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
    this._prevSelectedRow = undefined;
    if (this._options?.selectActiveCell && args.row != null && args.cell != null) {
      this.setSelectedRanges([new SlickRange(args.row, args.cell)]);
    } else if (!this._options?.selectActiveCell) {
      // clear the previous selection once the cell changes
      this.setSelectedRanges([]);
    }
  }

  protected isKeyAllowed(key: string) {
    return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End'].some(k => k === key);
  }

  protected handleKeyDown(e: KeyboardEvent) {
    let ranges: CellRange[], last: SlickRange_;
    const active = this._grid.getActiveCell();
    const metaKey = e.ctrlKey || e.metaKey;
    let dataLn = 0;
    if (this._dataView) {
      dataLn = this._dataView?.getPagingInfo().pageSize || this._dataView.getLength();
    } else {
      dataLn = this._grid.getDataLength();
    }

    if (active && e.shiftKey && !metaKey && !e.altKey && this.isKeyAllowed(e.key)) {

      ranges = this.getSelectedRanges().slice();
      if (!ranges.length)
        ranges.push(new SlickRange(active.row, active.cell));

      // keyboard can work with last range only
      last = ranges.pop() as SlickRange_;

      // can't handle selection out of active cell
      if (!last.contains(active.row, active.cell)) {
        last = new SlickRange(active.row, active.cell);
      }

      let dRow = last.toRow - last.fromRow;
      let dCell = last.toCell - last.fromCell;

      // walking direction
      const dirRow = active.row == last.fromRow ? 1 : -1;
      const dirCell = active.cell == last.fromCell ? 1 : -1;
      const isSingleKeyMove = e.key.startsWith('Arrow');
      let toRow = 0;

      if (isSingleKeyMove) {
        // single cell move: (Arrow{Up/ArrowDown/ArrowLeft/ArrowRight})
        if (e.key === 'ArrowLeft') {
          dCell -= dirCell;
        } else if (e.key === 'ArrowRight') {
          dCell += dirCell;
        } else if (e.key === 'ArrowUp') {
          dRow -= dirRow;
        } else if (e.key === 'ArrowDown') {
          dRow += dirRow;
        }
        toRow = active.row + dirRow * dRow;
      } else {
        // multiple cell moves: (Home, End, Page{Up/Down})
        if (this._cachedPageRowCount < 1) {
          this._cachedPageRowCount = this._grid.getViewportRowCount();
        }
        if (this._prevSelectedRow === undefined) {
          this._prevSelectedRow = active.row;
        }

        if (e.key === 'Home') {
          toRow = 0;
        } else if (e.key === 'End') {
          toRow = dataLn - 1;
        } else if (e.key === 'PageUp') {
          if (this._prevSelectedRow >= 0) {
            toRow = this._prevSelectedRow - this._cachedPageRowCount;
          }
          if (toRow < 0) {
            toRow = 0;
          }
        } else if (e.key === 'PageDown') {
          if (this._prevSelectedRow <= dataLn - 1) {
            toRow = this._prevSelectedRow + this._cachedPageRowCount;
          }
          if (toRow > dataLn - 1) {
            toRow = dataLn - 1;
          }
        }
        this._prevSelectedRow = toRow;
      }

      // define new selection range
      const new_last = new SlickRange(active.row, active.cell, toRow, active.cell + dirCell * dCell);
      if (this.removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        const viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
        const viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;

        if (isSingleKeyMove) {
          this._grid.scrollRowIntoView(viewRow);
          this._grid.scrollCellIntoView(viewRow, viewCell);
        } else {
          this._grid.scrollRowIntoView(toRow);
          this._grid.scrollCellIntoView(toRow, viewCell);
        }
      } else {
        ranges.push(last);
      }

      this.setSelectedRanges(ranges);

      e.preventDefault();
      e.stopPropagation();
      this._prevKeyDown = e.key;
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
