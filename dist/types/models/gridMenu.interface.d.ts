import type { Column } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface GridMenuEventBaseCallbackArgs {
    /** list of all column definitions (visible & hidden) */
    allColumns: Column[];
    /** list of visible column definitions */
    visibleColumns: Column[];
    /** slick grid object */
    grid: SlickGrid;
}
export interface GridMenuEventWithElementCallbackArgs extends GridMenuEventBaseCallbackArgs {
    /** html DOM element of the menu */
    menu: HTMLElement;
}
export interface onGridMenuColumnsChangedCallbackArgs extends GridMenuEventBaseCallbackArgs {
    /** column definition id */
    columnId: string;
    /** last command, are we showing or not the column? */
    showing: boolean;
}
//# sourceMappingURL=gridMenu.interface.d.ts.map