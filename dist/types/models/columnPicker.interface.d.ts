import type { Column, GridOption } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface ColumnPickerOption {
    /** Defaults to "Columns" which is the title that shows up over the columns */
    columnTitle?: string;
    /** Defaults to "Force fit columns" which is 1 of the last 2 checkbox title shown at the end of the picker list */
    forceFitTitle?: string;
    /** Animation fade speed when opening/closing the column picker */
    fadeSpeed?: number;
    /** Defaults to True, show/hide 1 of the last 2 checkbox at the end of the picker list */
    hideForceFitButton?: boolean;
    /** Defaults to True, show/hide 1 of the last 2 checkbox at the end of the picker list */
    hideSyncResizeButton?: boolean;
    /**
     * Defaults to available space at the bottom, Grid Menu minimum height.
     * Can be a number or a string, if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as is.
     */
    maxHeight?: number | string;
    /**
     * Defaults to 200(px), Grid Menu minimum height.
     * Can be a number or a string, if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as is.
     */
    minHeight?: number | string;
    /** Defaults to "Synchronous resize" which is 1 of the last 2 checkbox title shown at the end of the picker list */
    syncResizeTitle?: string;
    /** Callback method to override the column name output used by the ColumnPicker/GridMenu. */
    headerColumnValueExtractor?: (column: Column, gridOptions?: GridOption) => string | HTMLElement | DocumentFragment;
}
export interface OnColumnsChangedArgs {
    /** column definition id */
    columnId: number | string;
    /** last command, are we showing or not the column? */
    showing: boolean;
    /** slick grid object */
    grid: SlickGrid;
    /** list of all column definitions (visible & hidden) */
    allColumns: Column[];
    /** list of all column definitions (visible & hidden) */
    columns: Column[];
    /** list of visible column definitions */
    visibleColumns: Column[];
}
//# sourceMappingURL=columnPicker.interface.d.ts.map