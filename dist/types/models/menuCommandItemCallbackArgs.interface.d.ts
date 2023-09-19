import type { MenuCallbackArgs } from './menuCallbackArgs.interface';
import type { MenuCommandItem } from './menuCommandItem.interface';
export interface MenuCommandItemCallbackArgs extends MenuCallbackArgs {
    /** A command identifier returned by the onCommand (or action) event callback handler. */
    command: string;
    /** Menu item selected */
    item: MenuCommandItem;
    /** Value of the cell we triggered the menu from */
    value?: any;
}
//# sourceMappingURL=menuCommandItemCallbackArgs.interface.d.ts.map