import type { Column, MenuCommandItem } from './index';
import type { SlickGrid } from '../slick.grid';
export interface HeaderMenuItems {
    items: Array<MenuCommandItem | 'divider'>;
}
export interface HeaderMenuCommandItemCallbackArgs {
    /** Column definition */
    column: Column;
    /** Slick Grid object */
    grid: SlickGrid;
    /** html DOM element of the menu */
    menu: Array<MenuCommandItem | 'divider'>;
}
//# sourceMappingURL=headerMenuItems.interface.d.ts.map