import type { MenuItem } from './menuItem.interface';
import type { GridMenuCommandItemCallbackArgs } from './gridMenuCommandItemCallbackArgs.interface';
import type { MenuCommandItemCallbackArgs } from './menuCommandItemCallbackArgs.interface';
import type { MenuCallbackArgs } from './menuCallbackArgs.interface';
import type { SlickEventData } from '../slick.core';
export interface MenuCommandItem<A = MenuCommandItemCallbackArgs | GridMenuCommandItemCallbackArgs, R = MenuCallbackArgs> extends MenuItem<R> {
    /** A command identifier to be passed to the onCommand event callback handler (when using "commandItems"). */
    command: string;
    /** Array of Command Items (title, command, disabled, ...) */
    commandItems?: Array<MenuCommandItem | 'divider'>;
    /** Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event) */
    action?: (event: SlickEventData | Event, callbackArgs: A) => void;
}
//# sourceMappingURL=menuCommandItem.interface.d.ts.map