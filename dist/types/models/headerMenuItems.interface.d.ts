import type { Column, MenuCommandItem } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface HeaderMenuItems {
    /** List of command items to show in the header menu. */
    commandItems?: Array<HeaderMenuCommandItem | 'divider'>;
    /** @deprecated use `commandItems` instead. List of commands to show in the header menu. */
    items?: Array<HeaderMenuCommandItem | 'divider'>;
}
export interface HeaderMenuCommandItemCallbackArgs {
    /** Column definition */
    column: Column;
    /** Slick Grid object */
    grid: SlickGrid;
    /** html DOM element of the menu */
    menu: Array<HeaderMenuCommandItem | 'divider'>;
}
export interface HeaderMenuCommandItem extends Omit<MenuCommandItem, 'commandItems'> {
    /** Array of Command Items (title, command, disabled, ...) */
    commandItems?: Array<HeaderMenuCommandItem | 'divider'>;
    /** @deprecated use `commandItems` instead. Array of Command Items (title, command, disabled, ...) */
    items?: Array<HeaderMenuCommandItem | 'divider'>;
}
//# sourceMappingURL=headerMenuItems.interface.d.ts.map