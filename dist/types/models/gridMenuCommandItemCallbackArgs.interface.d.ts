import type { Column, GridMenuItem, MenuCommandItem } from './index';
import type { SlickGrid } from '../slick.grid';
export interface GridMenuCallbackArgs {
    grid: SlickGrid;
    menu: any;
    columns: Column[];
    visibleColumns: Column[];
}
export interface GridMenuCommandItemCallbackArgs {
    /** A command identifier returned by the onCommand (or action) event callback handler. */
    command: string;
    /** Menu item selected */
    item: GridMenuItem | MenuCommandItem;
    /** Slick Grid object */
    grid: SlickGrid;
    /** all columns (including hidden ones) */
    allColumns: Column[];
    /** only visible columns (excluding hidden columns) */
    visibleColumns: Column[];
}
//# sourceMappingURL=gridMenuCommandItemCallbackArgs.interface.d.ts.map