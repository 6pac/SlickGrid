import { BindingEventService as BindingEventService_, type SlickEventData } from '../slick.core.js';
import type { Column, ColumnPickerOption, DOMMouseOrTouchEvent, GridOption, OnColumnsChangedArgs } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
/***
 * A control to add a Column Picker (right+click on any column header to reveal the column picker)
 * NOTE: this is the old 'complex' column pciker that hides columns by removing them from the grid
 *        for a more modern version that uses the column.hidden property and is a lot simpler, use slick.columnmenu.js
 *
 * USAGE:
 *
 * Add the slick.columnpicker.(js|css) files and register it with the grid.
 *
 * Available options, by defining a columnPicker object:
 *
 *  let options = {
 *    enableCellNavigation: true,
 *    columnPicker: {
 *      columnTitle: "Columns",                 // default to empty string
 *
 *      // the last 2 checkboxes titles
 *      hideForceFitButton: false,              // show/hide checkbox near the end "Force Fit Columns" (default:false)
 *      hideSyncResizeButton: false,            // show/hide checkbox near the end "Synchronous Resize" (default:false)
 *      forceFitTitle: "Force fit columns",     // default to "Force fit columns"
 *      headerColumnValueExtractor: "Extract the column label" // default to column.name
 *      syncResizeTitle: "Synchronous resize",  // default to "Synchronous resize"
 *    }
 *  };
 */
export declare class SlickColumnPicker {
    protected columns: Column[];
    protected readonly grid: SlickGrid;
    onColumnsChanged: import("../slick.core.js").SlickEvent<OnColumnsChangedArgs>;
    protected _gridUid: string;
    protected _columnTitleElm: HTMLElement;
    protected _listElm: HTMLElement;
    protected _menuElm: HTMLElement;
    protected _columnCheckboxes: HTMLInputElement[];
    protected _bindingEventService: BindingEventService_;
    protected _gridOptions: GridOption;
    protected _defaults: ColumnPickerOption;
    constructor(columns: Column[], grid: SlickGrid, gridOptions: GridOption);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLElement>): void;
    protected handleHeaderContextMenu(e: SlickEventData): void;
    protected repositionMenu(event: DOMMouseOrTouchEvent<HTMLDivElement> | SlickEventData): void;
    protected updateColumnOrder(): void;
    /** Update the Titles of each sections (command, customTitle, ...) */
    updateAllTitles(pickerOptions: {
        columnTitle: string;
    }): void;
    protected updateColumn(e: DOMMouseOrTouchEvent<HTMLInputElement>): void;
    /** @deprecated because of a typo @use `setColumnVisibility()` instead */
    setColumnVisibiliy(idxOrId: number | string, show: boolean): void;
    setColumnVisibility(idxOrId: number | string, show: boolean): void;
    getAllColumns(): Column<any>[];
    getColumnbyId(id: number | string): Column<any> | null;
    getColumnIndexbyId(id: number | string): number;
    /** visible columns, we can simply get them directly from the grid */
    getVisibleColumns(): Column<any>[];
}
//# sourceMappingURL=slick.columnpicker.d.ts.map