import type { MenuCallbackArgs } from './menuCallbackArgs.interface.js';
export type MenuType = 'command' | 'option';
export interface MenuItem<O = MenuCallbackArgs> {
    /** A CSS class to be added to the menu item container. */
    cssClass?: string;
    /** Defaults to false, whether the item/command is disabled. */
    disabled?: boolean;
    /** Defaults to false, whether the command is actually a divider (separator). */
    divider?: boolean | string;
    /** Defaults to false, whether the item/command is hidden. */
    hidden?: boolean;
    /** CSS class to be added to the menu item icon. */
    iconCssClass?: string;
    /** Grid Menu icon (hamburger icon) */
    iconImage?: string;
    /** position order in the list, a lower number will make it on top of the list. Internal commands starts at 50. */
    positionOrder?: number;
    /** Optional sub-menu title that will shows up when sub-menu commmands/options list is opened */
    subMenuTitle?: string;
    /** Optional sub-menu title CSS class to use with `subMenuTitle` */
    subMenuTitleCssClass?: string;
    /** CSS class to be added to the menu item text. */
    textCssClass?: string;
    /** Menu item text to show in the list. */
    title?: string;
    /** Item tooltip to show while hovering the command. */
    tooltip?: string;
    /** Callback method that user can override the default behavior of showing/hiding an item from the list. */
    itemVisibilityOverride?: (args: O) => boolean;
    /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
    itemUsabilityOverride?: (args: O) => boolean;
}
//# sourceMappingURL=menuItem.interface.d.ts.map