import type { GridMenuCallbackArgs, GridMenuCommandItemCallbackArgs, MenuCommandItem } from './index.js';
import type { SlickEventData } from '../slick.core.js';
export interface GridMenuItem extends MenuCommandItem<GridMenuCommandItemCallbackArgs, GridMenuCallbackArgs> {
    /** @deprecated use `commandItems` instead. Array of Command Items (title, command, disabled, ...) */
    customItems?: Array<GridMenuItem | 'divider'>;
    /** Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event) */
    action?: (event: SlickEventData | Event, callbackArgs: GridMenuCommandItemCallbackArgs) => void;
    /** Callback method that user can override the default behavior of showing/hiding an item from the list. */
    itemVisibilityOverride?: (args: GridMenuCallbackArgs) => boolean;
    /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
    itemUsabilityOverride?: (args: GridMenuCallbackArgs) => boolean;
}
//# sourceMappingURL=gridMenuItem.interface.d.ts.map