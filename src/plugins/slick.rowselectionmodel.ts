import { keyCode as keyCode_, SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_, Utils as Utils_ } from '../slick.core';
import { Draggable as Draggable_ } from '../slick.interactions';
import { SlickCellRangeDecorator as SlickCellRangeDecorator_ } from './slick.cellrangedecorator';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector';
import type { SlickCrossGridRowMoveManager as SlickCrossGridRowMoveManager_ } from './slick.crossgridrowmovemanager';
import type { SlickRowMoveManager as SlickRowMoveManager_ } from './slick.rowmovemanager';
import type { CellRange, OnActiveCellChangedEventArgs, RowSelectionModelOption } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Draggable = IIFE_ONLY ? Slick.Draggable : Draggable_;
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const SlickCellRangeDecorator = IIFE_ONLY ? Slick.CellRangeDecorator : SlickCellRangeDecorator_;
const SlickCellRangeSelector = IIFE_ONLY ? Slick.CellRangeSelector : SlickCellRangeSelector_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventData = IIFE_ONLY ? Slick.EventData : SlickEventData_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export class SlickRowSelectionModel {
  // --
  // public API
  pluginName = 'RowSelectionModel' as const;
  onSelectedRangesChanged = new SlickEvent<CellRange[]>();
  // _handler, _inHandler, _isRowMoveManagerHandler, _options, wrapHandler
  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _ranges: CellRange[] = [];
  protected _eventHandler = new SlickEventHandler();
  protected _inHandler = false;
  protected _selector?: SlickCellRangeSelector_;
  protected _isRowMoveManagerHandler: any;
  protected _options: RowSelectionModelOption;
  protected _defaults: RowSelectionModelOption = {
    selectActiveRow: true,
    dragToSelect: false,
    autoScrollWhenDrag: true,
    cellRangeSelector: undefined
  };

  constructor(options?: Partial<RowSelectionModelOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  init(grid: SlickGrid) {
    if (Draggable === undefined) {
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    }

    this._selector = this._options.cellRangeSelector;
    this._grid = grid;

    if (!this._selector && this._options.dragToSelect) {
      if (!SlickCellRangeDecorator) {
        throw new Error('Slick.CellRangeDecorator is required when option dragToSelect set to true');
      }
      this._selector = new SlickCellRangeSelector({
        selectionCss: { border: 'none' } as CSSStyleDeclaration,
        autoScroll: this._options.autoScrollWhenDrag
      });
    }

    this._eventHandler.subscribe(this._grid.onActiveCellChanged, this.wrapHandler(this.handleActiveCellChange).bind(this));
    this._eventHandler.subscribe(this._grid.onKeyDown, this.wrapHandler(this.handleKeyDown).bind(this));
    this._eventHandler.subscribe(this._grid.onClick, this.wrapHandler(this.handleClick).bind(this));
    if (this._selector) {
      grid.registerPlugin(this._selector);
      this._selector.onCellRangeSelecting.subscribe(this.handleCellRangeSelected.bind(this));
      this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this));
      this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this));
    }
  }

  destroy() {
    this._eventHandler.unsubscribeAll();
    if (this._selector) {
      this._selector.onCellRangeSelecting.unsubscribe(this.handleCellRangeSelected.bind(this));
      this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this));
      this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this));
      this._grid.unregisterPlugin(this._selector);
      if (this._selector.destroy) {
        this._selector.destroy();
      }
    }
  }

  protected wrapHandler(handler: (...args: any) => void) {
    return (...args: any) => {
      if (!this._inHandler) {
        this._inHandler = true;
        handler.apply(this, args);
        this._inHandler = false;
      }
    };
  }

  protected rangesToRows(ranges: CellRange[]): number[] {
    const rows: number[] = [];
    for (let i = 0; i < ranges.length; i++) {
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        rows.push(j);
      }
    }
    return rows;
  }

  protected rowsToRanges(rows: number[]) {
    const ranges: SlickRange_[] = [];
    const lastCell = this._grid.getColumns().length - 1;
    for (let i = 0; i < rows.length; i++) {
      ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
    }
    return ranges;
  }

  protected getRowsRange(from: number, to: number) {
    let i;
    const rows: number[] = [];
    for (i = from; i <= to; i++) {
      rows.push(i);
    }
    for (i = to; i < from; i++) {
      rows.push(i);
    }
    return rows;
  }

  getSelectedRows() {
    return this.rangesToRows(this._ranges);
  }

  setSelectedRows(rows: number[]) {
    this.setSelectedRanges(this.rowsToRanges(rows), 'SlickRowSelectionModel.setSelectedRows');
  }

  setSelectedRanges(ranges: CellRange[], caller = 'SlickRowSelectionModel.setSelectedRanges') {
    // simple check for: empty selection didn't change, prevent firing onSelectedRangesChanged
    if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0)) {
      return;
    }
    this._ranges = ranges;

    // provide extra "caller" argument through SlickEventData to avoid breaking pubsub event that only accepts an array of selected range
    const eventData = new SlickEventData(null, this._ranges);
    Object.defineProperty(eventData, 'detail', { writable: true, configurable: true, value: { caller: caller || "SlickRowSelectionModel.setSelectedRanges" } });
    this.onSelectedRangesChanged.notify(this._ranges, eventData);
  }

  getSelectedRanges() {
    return this._ranges;
  }

  refreshSelections() {
    this.setSelectedRows(this.getSelectedRows());
  }

  protected handleActiveCellChange(_e: SlickEventData_, args: OnActiveCellChangedEventArgs) {
    if (this._options.selectActiveRow && args.row != null) {
      this.setSelectedRanges([new SlickRange(args.row, 0, args.row, this._grid.getColumns().length - 1)]);
    }
  }

  protected handleKeyDown(e: KeyboardEvent) {
    const activeRow = this._grid.getActiveCell();
    if (this._grid.getOptions().multiSelect && activeRow
      && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey
      && (e.which == keyCode.UP || e.which == keyCode.DOWN)) {
      let selectedRows = this.getSelectedRows();
      selectedRows.sort(function (x, y) {
        return x - y;
      });

      if (!selectedRows.length) {
        selectedRows = [activeRow.row];
      }

      let top = selectedRows[0];
      let bottom = selectedRows[selectedRows.length - 1];
      let active: number;

      if (e.which == keyCode.DOWN) {
        active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
      } else {
        active = activeRow.row < bottom ? --bottom : --top;
      }

      if (active >= 0 && active < this._grid.getDataLength()) {
        this._grid.scrollRowIntoView(active);
        const tempRanges = this.rowsToRanges(this.getRowsRange(top, bottom));
        this.setSelectedRanges(tempRanges);
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  protected handleClick(e: MouseEvent): boolean | void {
    const cell = this._grid.getCellFromEvent(e);
    if (!cell || !this._grid.canCellBeActive(cell.row, cell.cell)) {
      return false;
    }

    if (!this._grid.getOptions().multiSelect || (
      !e.ctrlKey && !e.shiftKey && !e.metaKey)) {
      return false;
    }

    let selection = this.rangesToRows(this._ranges);
    const idx = selection.indexOf(cell.row);

    if (idx === -1 && (e.ctrlKey || e.metaKey)) {
      selection.push(cell.row);
      this._grid.setActiveCell(cell.row, cell.cell);
    } else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
      selection = selection.filter((o) => o !== cell.row);
      this._grid.setActiveCell(cell.row, cell.cell);
    } else if (selection.length && e.shiftKey) {
      const last = selection.pop() as number;
      const from = Math.min(cell.row, last);
      const to = Math.max(cell.row, last);
      selection = [];
      for (let i = from; i <= to; i++) {
        if (i !== last) {
          selection.push(i);
        }
      }
      selection.push(last);
      this._grid.setActiveCell(cell.row, cell.cell);
    }

    const tempRanges = this.rowsToRanges(selection);
    this.setSelectedRanges(tempRanges);
    e.stopImmediatePropagation();

    return true;
  }

  protected handleBeforeCellRangeSelected(e: SlickEventData_, cell: { row: number; cell: number; }): boolean | void {
    if (!this._isRowMoveManagerHandler) {
      const rowMoveManager = this._grid.getPluginByName<SlickRowMoveManager_>('RowMoveManager') || this._grid.getPluginByName<SlickCrossGridRowMoveManager_>('CrossGridRowMoveManager');
      this._isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils.noop;
    }
    if (this._grid.getEditorLock().isActive() || this._isRowMoveManagerHandler(cell.cell)) {
      e.stopPropagation();
      return false;
    }
    this._grid.setActiveCell(cell.row, cell.cell);
  }

  protected handleCellRangeSelected(_e: SlickEventData_, args: { range: CellRange; }): boolean | void {
    if (!this._grid.getOptions().multiSelect || !this._options.selectActiveRow) {
      return false;
    }
    this.setSelectedRanges([new SlickRange(args.range.fromRow, 0, args.range.toRow, this._grid.getColumns().length - 1)])
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      RowSelectionModel: SlickRowSelectionModel
    }
  });
}

