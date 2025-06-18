import { BindingEventService as BindingEventService_, type SlickEventData } from '../slick.core.js';
import type { Column, ColumnPickerOption, DOMMouseOrTouchEvent, GridOption, OnColumnsChangedArgs } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
/***
 * A control to add a Column Picker (right+click on any column header to reveal the column picker)
 * NOTE: this a simplified and updated version of slick.columnpicker.js
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
export declare class SlickColumnMenu {
    protected columns: Column[];
    protected readonly grid: SlickGrid;
    onColumnsChanged: import("../slick.core.js").SlickEvent<OnColumnsChangedArgs>;
    protected _gridUid: string;
    protected _columnTitleElm: HTMLElement;
    protected _listElm: HTMLElement;
    protected _menuElm: HTMLElement;
    protected _columnCheckboxes: HTMLInputElement[];
    protected _bindingEventService: BindingEventService_;
    protected _options: GridOption;
    protected _defaults: ColumnPickerOption;
    constructor(columns: Column[], grid: SlickGrid, options: GridOption);
    init(grid: SlickGrid): void;
    destroy(): void;
    handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    handleHeaderContextMenu(e: SlickEventData): void;
    repositionMenu(event: DOMMouseOrTouchEvent<HTMLDivElement> | SlickEventData): void;
    updateColumnOrder(): void;
    /** Update the Titles of each sections (command, customTitle, ...) */
    updateAllTitles(pickerOptions: {
        columnTitle: string;
    }): void;
    updateColumn(e: DOMMouseOrTouchEvent<HTMLInputElement>): void;
    /** @deprecated because of a typo @use `setColumnVisibility()` instead */
    setColumnVisibiliy(idxOrId: number | string, show: boolean): void;
    setColumnVisibility(idxOrId: number | string, show: boolean): void;
    getAllColumns(): Column<any>[];
    getColumnbyId(id: number | string): Column<any> | null;
    getColumnIndexbyId(id: number | string): number;
    /** visible columns, we can simply get them directly from the grid */
    getVisibleColumns(): Column<any>[];
}
//# sourceMappingURL=slick.columnmenu.d.ts.map