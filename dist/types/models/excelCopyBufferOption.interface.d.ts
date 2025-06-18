import type { Column, FormatterResultWithHtml, FormatterResultWithText } from './index.js';
import type { SlickEventData, SlickRange } from '../slick.core.js';
export interface ExcelCopyBufferOption<T = any> {
    /** defaults to 2000(ms), delay in ms to wait before clearing the selection after a paste action */
    clearCopySelectionDelay?: number;
    /** defaults to 100(ms), delay in ms to wait before executing focus/paste */
    clipboardPasteDelay?: number;
    /** defaults to "copied", sets the css className used for copied cells. */
    copiedCellStyle?: string;
    /** defaults to "copy-manager", sets the layer key for setting css values of copied cells. */
    copiedCellStyleLayerKey?: string;
    /** option to specify a custom column value extractor function */
    dataItemColumnValueExtractor?: (item: any, columnDef: Column<T>) => string | FormatterResultWithHtml | FormatterResultWithText | null;
    /** option to specify a custom column value setter function */
    dataItemColumnValueSetter?: (item: any, columnDef: Column<T>, value: any) => string | FormatterResultWithHtml | FormatterResultWithText | null;
    /** option to specify a custom handler for paste actions */
    clipboardCommandHandler?: (editCommand: any) => void;
    /** set to true and the plugin will take the name property from each column (which is usually what appears in your header) and put that as the first row of the text that's copied to the clipboard */
    includeHeaderWhenCopying?: boolean;
    /** option to specify a custom DOM element which to will be added the hidden textbox. It's useful if the grid is inside a modal dialog. */
    bodyElement?: HTMLElement;
    /** optional handler to run when copy action initializes */
    onCopyInit?: () => void;
    /** optional handler to run when copy action is complete */
    onCopySuccess?: (rowCount: number) => void;
    /** function to add rows to table if paste overflows bottom of table, if this function is not provided new rows will be ignored. */
    newRowCreator?: (rows: number) => void;
    /** suppresses paste */
    readOnlyMode?: boolean;
    /** option to specify a custom column header value extractor function */
    headerColumnValueExtractor?: (columnDef: Column<T>) => string | HTMLElement | DocumentFragment;
    /** Fired when a copy cell is triggered */
    onCopyCells?: (e: SlickEventData, args: {
        ranges: SlickRange[];
    }) => void;
    /** Fired when the command to copy the cells is cancelled */
    onCopyCancelled?: (e: SlickEventData, args: {
        ranges: SlickRange[];
    }) => void;
    /** Fired when the user paste cells to the grid */
    onPasteCells?: (e: SlickEventData, args: {
        ranges: SlickRange[];
    }) => void;
}
//# sourceMappingURL=excelCopyBufferOption.interface.d.ts.map