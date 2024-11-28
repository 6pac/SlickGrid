import type { Column, ExcelCopyBufferOption, SlickPlugin } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
import { SlickEvent as SlickEvent_, type SlickEventData, SlickRange as SlickRange_ } from '../slick.core.js';
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
export declare class SlickCellExternalCopyManager implements SlickPlugin {
    pluginName: "CellExternalCopyManager";
    onCopyCells: SlickEvent_<{
        ranges: SlickRange_[];
    }>;
    onCopyCancelled: SlickEvent_<{
        ranges: SlickRange_[];
    }>;
    onPasteCells: SlickEvent_<{
        ranges: SlickRange_[];
    }>;
    protected _grid: SlickGrid;
    protected _bodyElement: HTMLElement;
    protected _copiedRanges: SlickRange_[] | null;
    protected _clearCopyTI?: number;
    protected _copiedCellStyle: string;
    protected _copiedCellStyleLayerKey: string;
    protected _onCopyInit?: () => void;
    protected _onCopySuccess?: (rowCount: number) => void;
    protected _options: ExcelCopyBufferOption;
    protected keyCodes: {
        C: number;
        V: number;
        ESC: number;
        INSERT: number;
    };
    constructor(options: ExcelCopyBufferOption);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected getHeaderValueForColumn(columnDef: Column): string;
    protected getDataItemValueForColumn(item: any, columnDef: Column, event: SlickEventData): string;
    protected setDataItemValueForColumn(item: any, columnDef: Column, value: string): null | string | void;
    protected _createTextBox(innerText: string): HTMLTextAreaElement;
    protected _decodeTabularData(grid: SlickGrid, ta: HTMLTextAreaElement): void;
    protected handleKeyDown(e: SlickEventData): boolean | void;
    protected markCopySelection(ranges: SlickRange_[]): void;
    clearCopySelection(): void;
    setIncludeHeaderWhenCopying(includeHeaderWhenCopying: boolean): void;
}
//# sourceMappingURL=slick.cellexternalcopymanager.d.ts.map