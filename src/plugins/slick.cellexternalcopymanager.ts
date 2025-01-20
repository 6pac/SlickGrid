import type { Column, CssStyleHash, ExcelCopyBufferOption, ExternalCopyClipCommand, SlickPlugin } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
import { SlickEvent as SlickEvent_, type SlickEventData, SlickRange as SlickRange_, Utils as Utils_ } from '../slick.core.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

const CLEAR_COPY_SELECTION_DELAY = 2000;
const CLIPBOARD_PASTE_DELAY = 100;

/***
  This manager enables users to copy/paste data from/to an external Spreadsheet application
  such as MS-Excel® or OpenOffice-Spreadsheet.

  Since it is not possible to access directly the clipboard in javascript, the plugin uses
  a trick to do it's job. After detecting the keystroke, we dynamically create a textarea
  where the browser copies/pastes the serialized data.

  options:
    copiedCellStyle : sets the css className used for copied cells. default : "copied"
    copiedCellStyleLayerKey : sets the layer key for setting css values of copied cells. default : "copy-manager"
    dataItemColumnValueExtractor : option to specify a custom column value extractor function
    dataItemColumnValueSetter : option to specify a custom column value setter function
    clipboardCommandHandler : option to specify a custom handler for paste actions
    includeHeaderWhenCopying : set to true and the plugin will take the name property from each column (which is usually what appears in your header) and put that as the first row of the text that's copied to the clipboard
    bodyElement: option to specify a custom DOM element which to will be added the hidden textbox. It's useful if the grid is inside a modal dialog.
    onCopyInit: optional handler to run when copy action initializes
    onCopySuccess: optional handler to run when copy action is complete
    newRowCreator: function to add rows to table if paste overflows bottom of table, if this function is not provided new rows will be ignored.
    readOnlyMode: suppresses paste
    headerColumnValueExtractor : option to specify a custom column header value extractor function
*/
export class SlickCellExternalCopyManager implements SlickPlugin {
  // --
  // public API
  pluginName = 'CellExternalCopyManager' as const;
  onCopyCells = new SlickEvent<{ ranges: SlickRange_[]; }>('onCopyCells');
  onCopyCancelled = new SlickEvent<{ ranges: SlickRange_[]; }>('onCopyCancelled');
  onPasteCells = new SlickEvent<{ ranges: SlickRange_[]; }>('onPasteCells');

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _bodyElement: HTMLElement;
  protected _copiedRanges: SlickRange_[] | null = null;
  protected _clearCopyTI?: number;
  protected _copiedCellStyle: string;
  protected _copiedCellStyleLayerKey: string;
  protected _onCopyInit?: () => void;
  protected _onCopySuccess?: (rowCount: number) => void;
  protected _options: ExcelCopyBufferOption;

  protected keyCodes = {
    'C': 67,
    'V': 86,
    'ESC': 27,
    'INSERT': 45
  };

  constructor(options: ExcelCopyBufferOption) {
    this._options = options || {};
    this._copiedCellStyleLayerKey = this._options.copiedCellStyleLayerKey || 'copy-manager';
    this._copiedCellStyle = this._options.copiedCellStyle || 'copied';
    this._bodyElement = this._options.bodyElement || document.body;
    this._onCopyInit = this._options.onCopyInit || undefined;
    this._onCopySuccess = this._options.onCopySuccess || undefined;
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);
    this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));

    // we need a cell selection model
    const cellSelectionModel = grid.getSelectionModel();
    if (!cellSelectionModel) {
      throw new Error('Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())');
    }
    // we give focus on the grid when a selection is done on it.
    // without this, if the user selects a range of cell without giving focus on a particular cell, the grid doesn't get the focus and key stroke handles (ctrl+c) don't work
    cellSelectionModel.onSelectedRangesChanged.subscribe(() => {
      if (!this._grid.getEditorLock().isActive()) {
        this._grid.focus();
      }
    });
  }

  destroy() {
    this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
  }

  protected getHeaderValueForColumn(columnDef: Column): string {
    if (this._options.headerColumnValueExtractor) {
      const val = Utils.getHtmlStringOutput(this._options.headerColumnValueExtractor(columnDef));
      if (val) {
        return val;
      }
    }

    return Utils.getHtmlStringOutput(columnDef.name || '');
  }

  protected getDataItemValueForColumn(item: any, columnDef: Column, event: SlickEventData): string {
    if (typeof this._options.dataItemColumnValueExtractor === 'function') {
      const val = this._options.dataItemColumnValueExtractor(item, columnDef) as string | null;
      if (val) {
        return val;
      }
    }

    let retVal = '';

    // if a custom getter is not defined, we call serializeValue of the editor to serialize
    if (columnDef?.editor) {
      const tmpP = document.createElement('p');
      const editor = new (columnDef.editor as any)({
        container: tmpP,  // a dummy container
        column: columnDef,
        event,
        position: { top: 0, left: 0 },  // a dummy position required by some editors
        grid: this._grid,
      });
      editor.loadValue(item);
      retVal = editor.serializeValue();
      editor.destroy();
      tmpP.remove();
    } else {
      retVal = item[columnDef.field || ''];
    }

    return retVal;
  }

  protected setDataItemValueForColumn(item: any, columnDef: Column, value: string): null | string | void {
    if (columnDef.denyPaste) {
      return null;
    }

    if (this._options.dataItemColumnValueSetter) {
      return this._options.dataItemColumnValueSetter(item, columnDef, value) as string;
    }

    // if a custom setter is not defined, we call applyValue of the editor to unserialize
    if (columnDef.editor) {
      const tmpDiv = document.createElement('div');
      const editor = new (columnDef.editor as any)({
        container: tmpDiv, // a dummy container
        column: columnDef,
        position: { top: 0, left: 0 },  // a dummy position required by some editors
        grid: this._grid
      });
      editor.loadValue(item);
      editor.applyValue(item, value);
      editor.destroy();
      tmpDiv.remove();
    } else {
      item[columnDef.field] = value;
    }
  }


  protected _createTextBox(innerText: string) {
    const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
    const ta = document.createElement('textarea');
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    ta.value = innerText;
    ta.style.top = `${scrollPos}px`;
    this._bodyElement.appendChild(ta);
    ta.select();

    return ta;
  }

  protected _decodeTabularData(grid: SlickGrid, ta: HTMLTextAreaElement) {
    const columns = grid.getColumns();
    const clipText = ta.value;
    const clipRows = clipText.split(/[\n\f\r]/);
    // trim trailing CR if present
    if (clipRows[clipRows.length - 1] === '') {
      clipRows.pop();
    }

    let j = 0;
    const clippedRange: any[] = [];

    this._bodyElement.removeChild(ta);
    for (let i = 0; i < clipRows.length; i++) {
      if (clipRows[i] !== '') {
        clippedRange[j++] = clipRows[i].split('\t');
      } else {
        clippedRange[j++] = [''];
      }
    }
    const selectedCell = grid.getActiveCell();
    const ranges = grid.getSelectionModel()?.getSelectedRanges();
    const selectedRange = ranges && ranges.length ? ranges[0] : null;   // pick only one selection
    let activeRow: number;
    let activeCell: number;

    if (selectedRange) {
      activeRow = selectedRange.fromRow;
      activeCell = selectedRange.fromCell;
    } else if (selectedCell) {
      activeRow = selectedCell.row;
      activeCell = selectedCell.cell;
    } else {
      // we don't know where to paste
      return;
    }

    let oneCellToMultiple = false;
    let destH = clippedRange.length;
    let destW = clippedRange.length ? clippedRange[0].length : 0;
    if (clippedRange.length === 1 && clippedRange[0].length === 1 && selectedRange) {
      oneCellToMultiple = true;
      destH = selectedRange.toRow - selectedRange.fromRow + 1;
      destW = selectedRange.toCell - selectedRange.fromCell + 1;
    }
    const availableRows = (grid.getData() as any[]).length - (activeRow || 0);
    let addRows = 0;

    // ignore new rows if we don't have a "newRowCreator"
    if (availableRows < destH && typeof this._options.newRowCreator === 'function') {
      const d = grid.getData<any[]>();
      for (addRows = 1; addRows <= destH - availableRows; addRows++) {
        d.push({});
      }
      grid.setData(d);
      grid.render();
    }

    const overflowsBottomOfGrid = (activeRow || 0) + destH > grid.getDataLength();
    if (this._options.newRowCreator && overflowsBottomOfGrid) {
      const newRowsNeeded = (activeRow || 0) + destH - grid.getDataLength();
      this._options.newRowCreator(newRowsNeeded);
    }

    const clipCommand: ExternalCopyClipCommand = {
      isClipboardCommand: true,
      clippedRange,
      oldValues: [],
      cellExternalCopyManager: this,
      _options: this._options,
      setDataItemValueForColumn: this.setDataItemValueForColumn.bind(this),
      markCopySelection: this.markCopySelection.bind(this),
      oneCellToMultiple,
      activeRow,
      activeCell,
      destH,
      destW,
      maxDestY: grid.getDataLength(),
      maxDestX: grid.getColumns().length,
      h: 0,
      w: 0,
      execute: () => {
        clipCommand.h = 0;
        for (let y = 0; y < clipCommand.destH; y++) {
          clipCommand.oldValues[y] = [];
          clipCommand.w = 0;
          clipCommand.h++;
          let xOffset = 0; // the x offset for hidden col

          for (let x = 0; x < clipCommand.destW; x++) {
            const desty = activeRow + y;
            const destx = activeCell + x;
            const column = columns[destx];

            // paste on hidden column will be skipped, but we need to paste 1 cell further on X axis
            // we'll increase our X and increase the offset`
            if (column.hidden) {
              clipCommand.destW++;
              xOffset++;
              continue;
            }
            clipCommand.w++;

            if (desty < clipCommand.maxDestY && destx < clipCommand.maxDestX) {
              const dt = grid.getDataItem(desty);

              clipCommand.oldValues[y][x - xOffset] = dt[column['field']];
              if (oneCellToMultiple) {
                clipCommand.setDataItemValueForColumn(dt, column, clippedRange[0][0]);
              } else {
                clipCommand.setDataItemValueForColumn(dt, column, clippedRange[y] ? clippedRange[y][x - xOffset] : '');
              }
              grid.updateCell(desty, destx);
              grid.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid,
                column: {} as Column
              });
            }
          }
        }

        const bRange = new SlickRange(
          activeRow,
          activeCell,
          activeRow + clipCommand.h - 1,
          activeCell + clipCommand.w - 1
        );

        this.markCopySelection([bRange]);
        grid.getSelectionModel()?.setSelectedRanges([bRange]);
        this.onPasteCells.notify({ ranges: [bRange] });
      },
      undo: () => {
        for (let y = 0; y < clipCommand.destH; y++) {
          for (let x = 0; x < clipCommand.destW; x++) {
            const desty = activeRow + y;
            const destx = activeCell + x;

            if (desty < clipCommand.maxDestY && destx < clipCommand.maxDestX) {
              const dt = grid.getDataItem(desty);
              if (oneCellToMultiple) {
                clipCommand.setDataItemValueForColumn(dt, columns[destx], clipCommand.oldValues[0][0]);
              } else {
                clipCommand.setDataItemValueForColumn(dt, columns[destx], clipCommand.oldValues[y][x]);
              }
              grid.updateCell(desty, destx);
              grid.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid,
                column: {} as Column
              });
            }
          }
        }

        const bRange = new SlickRange(
          activeRow,
          activeCell,
          activeRow + clipCommand.h - 1,
          activeCell + clipCommand.w - 1
        );

        this.markCopySelection([bRange]);
        grid.getSelectionModel()?.setSelectedRanges([bRange]);
        if (typeof this._options.onPasteCells === 'function') {
          this.onPasteCells.notify({ ranges: [bRange] });
        }

        if (addRows > 1) {
          const d = grid.getData<any[]>();
          for (; addRows > 1; addRows--) {
            d.splice(d.length - 1, 1);
          }
          grid.setData(d);
          grid.render();
        }
      }
    };

    if (typeof this._options.clipboardCommandHandler === 'function') {
      this._options.clipboardCommandHandler(clipCommand);
    } else {
      clipCommand.execute();
    }
  }

  protected handleKeyDown(e: SlickEventData): boolean | void {
    let ranges: SlickRange_[];
    if (!this._grid.getEditorLock().isActive() || this._grid.getOptions().autoEdit) {
      if (e.which === this.keyCodes.ESC) {
        if (this._copiedRanges) {
          e.preventDefault();
          this.clearCopySelection();
          this.onCopyCancelled.notify({ ranges: this._copiedRanges });
          this._copiedRanges = null;
        }
      }

      if ((e.which === this.keyCodes.C || e.which === this.keyCodes.INSERT) && (e.ctrlKey || e.metaKey) && !e.shiftKey) {    // CTRL+C or CTRL+INS
        if (typeof this._onCopyInit === 'function') {
          this._onCopyInit.call(this);
        }
        ranges = this._grid.getSelectionModel()?.getSelectedRanges() ?? [];
        if (ranges.length !== 0) {
          this._copiedRanges = ranges;
          this.markCopySelection(ranges);
          this.onCopyCells.notify({ ranges });

          const columns = this._grid.getColumns();
          let clipText = '';

          for (let rg = 0; rg < ranges.length; rg++) {
            const range = ranges[rg];
            const clipTextRows: string[] = [];
            for (let i = range.fromRow; i < range.toRow + 1; i++) {
              const clipTextCells: string[] = [];
              const dt = this._grid.getDataItem(i);

              if (clipTextRows.length === 0 && this._options.includeHeaderWhenCopying) {
                const clipTextHeaders: string[] = [];
                for (let j = range.fromCell; j < range.toCell + 1; j++) {
                  const colName: string = columns[j].name instanceof HTMLElement
                    ? (columns[j].name as HTMLElement).innerHTML
                    : columns[j].name as string;
                  if (colName.length > 0 && !columns[j].hidden) {
                    clipTextHeaders.push(this.getHeaderValueForColumn(columns[j]) || '');
                  }
                }
                clipTextRows.push(clipTextHeaders.join('\t'));
              }

              for (let j = range.fromCell; j < range.toCell + 1; j++) {
                const colName: string = columns[j].name instanceof HTMLElement
                  ? (columns[j].name as HTMLElement).innerHTML
                  : columns[j].name as string;
                if (colName.length > 0 && !columns[j].hidden) {
                  clipTextCells.push(this.getDataItemValueForColumn(dt, columns[j], e));
                }
              }
              clipTextRows.push(clipTextCells.join('\t'));
            }
            clipText += clipTextRows.join('\r\n') + '\r\n';
          }

          if ((window as any).clipboardData) {
            (window as any).clipboardData.setData('Text', clipText);
            return true;
          }
          else {
            const focusEl = document.activeElement as HTMLElement;
            const ta = this._createTextBox(clipText);
            ta.focus();

            window.setTimeout(() => {
              this._bodyElement.removeChild(ta);
              // restore focus when possible
              focusEl
                ? focusEl.focus()
                : console.log('No element to restore focus to after copy?');
            }, this._options?.clipboardPasteDelay ?? CLIPBOARD_PASTE_DELAY);

            if (typeof this._onCopySuccess === 'function') {
              let rowCount = 0;
              // If it's cell selection, use the toRow/fromRow fields
              if (ranges.length === 1) {
                rowCount = (ranges[0].toRow + 1) - ranges[0].fromRow;
              } else {
                rowCount = ranges.length;
              }
              this._onCopySuccess(rowCount);
            }

            return false;
          }
        }
      }

      if (!this._options.readOnlyMode && (
        (e.which === this.keyCodes.V && (e.ctrlKey || e.metaKey) && !e.shiftKey)
        || (e.which === this.keyCodes.INSERT && e.shiftKey && !e.ctrlKey)
      )) {    // CTRL+V or Shift+INS
        const focusEl = document.activeElement as HTMLElement;
        const ta = this._createTextBox('');
        window.setTimeout(() => {
          this._decodeTabularData(this._grid, ta);
          // restore focus when possible
          focusEl?.focus();
        }, this._options?.clipboardPasteDelay ?? CLIPBOARD_PASTE_DELAY);
        return false;
      }
    }
  }

  protected markCopySelection(ranges: SlickRange_[]) {
    this.clearCopySelection();

    const columns = this._grid.getColumns();
    const hash: CssStyleHash = {};
    for (let i = 0; i < ranges.length; i++) {
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] = {};
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell && k < columns.length; k++) {
          hash[j][columns[k].id] = this._copiedCellStyle;
        }
      }
    }
    this._grid.setCellCssStyles(this._copiedCellStyleLayerKey, hash);
    window.clearTimeout(this._clearCopyTI);
    this._clearCopyTI = window.setTimeout(() => {
      this.clearCopySelection();
    }, this._options?.clearCopySelectionDelay || CLEAR_COPY_SELECTION_DELAY);
  }

  clearCopySelection() {
    this._grid.removeCellCssStyles(this._copiedCellStyleLayerKey);
  }

  setIncludeHeaderWhenCopying(includeHeaderWhenCopying: boolean) {
    this._options.includeHeaderWhenCopying = includeHeaderWhenCopying;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      CellExternalCopyManager: SlickCellExternalCopyManager
    }
  });
}
