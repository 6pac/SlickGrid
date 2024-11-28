import type { MenuCallbackArgs, MenuCommandItem, MenuOptionItem } from './index.js';
export interface CellMenuOption {
    /** Defaults to true, Auto-align dropup or dropdown menu to the left or right depending on grid viewport available space */
    autoAdjustDrop?: boolean;
    /** Defaults to 0, Optionally add an offset to the auto-align of the drop menu */
    autoAdjustDropOffset?: number;
    /** Defaults to true, Auto-align drop menu to the left or right depending on grid viewport available space */
    autoAlignSide?: boolean;
    /** Defaults to 0, Optionally add an offset to the left/right side auto-align */
    autoAlignSideOffset?: number;
    /** Array of Command Items (title, command, disabled, ...) */
    commandItems?: Array<MenuCommandItem | 'divider'>;
    /** Optional command title that shows up over the commands list, it will be hidden when nothing is provided */
    commandTitle?: string;
    /** Defaults to "bottom", user can optionally force the Cell Menu drop to be aligned to the top or bottom. */
    dropDirection?: 'top' | 'bottom';
    /** Defaults to "right", user can optionally force the Cell Menu drop to be aligned to the left or right. */
    dropSide?: 'left' | 'right';
    /** Defaults to false, Hide the Close button on top right */
    hideCloseButton?: boolean;
    /** Defaults to false, Hide the Commands section even when the commandItems array is filled */
    hideCommandSection?: boolean;
    /** Defaults to true, do we want to hide the Cell Menu when a scrolling event occurs? */
    hideMenuOnScroll?: boolean;
    /** Defaults to false, Hide the Options section even when the optionItems array is filled */
    hideOptionSection?: boolean;
    /** Maximum height that the drop menu can have, it could be a number (250) or text ("none") */
    maxHeight?: number | string;
    /** Maximum width that the drop menu can have, it could be a number (250) or text ("none") */
    maxWidth?: number | string;
    /**
     * Width that the drop menu can have.
     * NOTE: the menu also has a "min-width" defined in CSS/SASS and setting a "width" below that threshold won't work, you change this min-width via SASS `$slick-menu-min-width`
     */
    width?: number | string;
    /** Array of Option Items (title, option, disabled, ...) */
    optionItems?: Array<MenuOptionItem | 'divider'>;
    /** Optional Title of the Option section, it will be hidden when nothing is provided */
    optionTitle?: string;
    /** CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon) */
    subItemChevronClass?: string;
    /** Defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click" */
    subMenuOpenByEvent?: 'mouseover' | 'click';
    /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
    menuUsabilityOverride?: (args: MenuCallbackArgs) => boolean;
}
//# sourceMappingURL=cellMenuOption.interface.d.ts.map