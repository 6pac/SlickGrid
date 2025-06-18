import type { MenuItem } from './menuItem.interface.js';
import type { GridMenuCommandItemCallbackArgs } from './gridMenuCommandItemCallbackArgs.interface.js';
import type { MenuCommandItemCallbackArgs } from './menuCommandItemCallbackArgs.interface.js';
import type { MenuCallbackArgs } from './menuCallbackArgs.interface.js';
import type { SlickEventData } from '../slick.core.js';
export interface MenuCommandItem<A = MenuCommandItemCallbackArgs | GridMenuCommandItemCallbackArgs, R = MenuCallbackArgs> extends MenuItem<R> {
    /** A command identifier to be passed to the onCommand event callback handler (when using "commandItems"). */
    command: string;
    /** Array of Command Items (title, command, disabled, ...) */
    commandItems?: Array<MenuCommandItem | 'divider'>;
    /** Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event) */
    action?: (event: SlickEventData | Event, callbackArgs: A) => void;
}
//# sourceMappingURL=menuCommandItem.interface.d.ts.map