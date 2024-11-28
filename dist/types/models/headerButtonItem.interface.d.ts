import type { Column, SlickGridModel } from './index.js';
export interface HeaderButtonItem {
    /** A command identifier to be passed to the onCommand event handlers. */
    command?: string;
    /** CSS class to add to the button. */
    cssClass?: string;
    /** Defaults to false, whether the item/command is disabled. */
    disabled?: boolean;
    /** Button click handler. */
    handler?: (e: Event) => void;
    /** Relative button image path. */
    image?: string;
    /** Only show the button on hover. */
    showOnHover?: boolean;
    /** Button tooltip. */
    tooltip?: string;
    /** Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event) */
    action?: (event: Event, callbackArgs: {
        command: string;
        button: any;
        column: Column;
        grid: SlickGridModel;
    }) => void;
    /** Callback method that user can override the default behavior of showing/hiding an item from the list. */
    itemVisibilityOverride?: (args: {
        node: any;
        column: Column;
        grid: SlickGridModel;
    }) => boolean;
    /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
    itemUsabilityOverride?: (args: {
        node: any;
        column: Column;
        grid: SlickGridModel;
    }) => boolean;
}
export interface HeaderButtonOption {
    /** an extra CSS class to add to the menu button */
    buttonCssClass?: string;
}
//# sourceMappingURL=headerButtonItem.interface.d.ts.map