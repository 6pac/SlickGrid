import type { Column, DOMMouseOrTouchEvent, GridMenuCommandItemCallbackArgs, GridMenuEventWithElementCallbackArgs, GridMenuItem, GridMenuOption, GridOption, MenuCommandItem, onGridMenuColumnsChangedCallbackArgs } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_ } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * A control to add a Grid Menu (hambuger menu on top-right of the grid)
 *
 * USAGE:
 *
 * Add the slick.gridmenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * let gridMenuControl = new Slick.Controls.GridMenu(columns, grid, options);
 *
 * Available grid options, by defining a gridMenu object:
 *
 *  let options = {
 *    enableCellNavigation: true,
 *    gridMenu: {
 *      commandTitle: "Command List",                // default to empty string
 *      columnTitle: "Columns",                     // default to empty string
 *      iconImage: "some-image.png",                // this is the Grid Menu icon (hamburger icon)
 *      iconCssClass: "fa fa-bars",                 // you can provide iconImage OR iconCssClass
 *      leaveOpen: false,                           // do we want to leave the Grid Menu open after a command execution? (false by default)
 *      menuWidth: 18,                              // width (icon) that will be use to resize the column header container (18 by default)
 *      contentMinWidth: 0,							            // defaults to 0 (auto), minimum width of grid menu content (command, column list)
 *      marginBottom: 15,                           // defaults to 15, margin to use at the bottom of the grid when using max-height (default)
 *      resizeOnShowHeaderRow: false,               // false by default
 *      showButton: true,                           // true by default - it allows the user to control if the
 *                                                          // default gridMenu button (located on the top right corner by default CSS)
 *                                                          // should be created or omitted
 *      useClickToRepositionMenu: true,             // true by default
 *
 *      // the last 2 checkboxes titles
 *      hideForceFitButton: false,                  // show/hide checkbox near the end "Force Fit Columns"
 *      hideSyncResizeButton: false,                // show/hide checkbox near the end "Synchronous Resize"
 *      forceFitTitle: "Force fit columns",         // default to "Force fit columns"
 *      syncResizeTitle: "Synchronous resize",      // default to "Synchronous resize"
 *
 *      commandItems: [
 *        {
 *          // command menu item options
 *        },
 *        {
 *          // command menu item options
 *        }
 *      ]
 *    }
 *  };
 *
 *
 * Available menu options:
 *    hideForceFitButton:         Hide the "Force fit columns" button (defaults to false)
 *    hideSyncResizeButton:       Hide the "Synchronous resize" button (defaults to false)
 *    forceFitTitle:              Text of the title "Force fit columns"
 *    contentMinWidth:						minimum width of grid menu content (command, column list), defaults to 0 (auto)
 *    height:                     Height of the Grid Menu content, when provided it will be used instead of the max-height (defaults to undefined)
 *    menuWidth:                  Grid menu button width (defaults to 18)
 *    resizeOnShowHeaderRow:      Do we want to resize on the show header row event
 *    syncResizeTitle:            Text of the title "Synchronous resize"
 *    useClickToRepositionMenu:   Use the Click offset to reposition the Grid Menu (defaults to true), when set to False it will use the icon offset to reposition the grid menu
 *    menuUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *    marginBottom:               Margin to use at the bottom of the grid menu, only in effect when height is undefined (defaults to 15)
 *    subItemChevronClass:        CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon)
 *    subMenuOpenByEvent:         defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click"
 *
 * Available command menu item options:
 *    action:                     Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    title:                      Menu item text.
 *    divider:                    Whether the current item is a divider, not an actual command.
 *    disabled:                   Whether the item/command is disabled.
 *    hidden:                     Whether the item/command is hidden.
 *    tooltip:                    Item tooltip.
 *    command:                    A command identifier to be passed to the onCommand event handlers.
 *    cssClass:                   A CSS class to be added to the menu item container.
 *    iconCssClass:               A CSS class to be added to the menu item icon.
 *    iconImage:                  A url to the icon image.
 *    textCssClass:               A CSS class to be added to the menu item text.
 *    subMenuTitle:               Optional sub-menu title that will shows up when sub-menu commmands/options list is opened
 *    subMenuTitleCssClass:       Optional sub-menu title CSS class to use with `subMenuTitle`
 *    itemVisibilityOverride:     Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 *
 * The plugin exposes the following events:
 *
 *    onAfterMenuShow:   Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
 *      * ONLY works with a JS event (as per slick.core code), so we cannot notify when it's a button event (when grid menu is attached to an external button, not the hamburger menu)
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            menu:     Menu options.  Note that you can change the menu items here.
 *
 *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
 *      * ONLY works with a JS event (as per slick.core code), so we cannot notify when it's a button event (when grid menu is attached to an external button, not the hamburger menu)
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            menu:     Menu options.  Note that you can change the menu items here.
 *
 *    onMenuClose:      Fired when the menu is closing.
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            menu:     Menu options.  Note that you can change the menu items here.
 *
 *    onCommand:    Fired on menu item click for buttons with 'command' specified.
 *        Event args:
 *            grid:     Reference to the grid.
 *            column:   Column definition.
 *            command:  Button command identified.
 *            button:   Button options.  Note that you can change the button options in your
 *                      event handler, and the column header will be automatically updated to
 *                      reflect them.  This is useful if you want to implement something like a
 *                      toggle button.
 */
export declare class SlickGridMenu {
    protected columns: Column[];
    protected readonly grid: SlickGrid;
    onAfterMenuShow: SlickEvent_<GridMenuEventWithElementCallbackArgs>;
    onBeforeMenuShow: SlickEvent_<GridMenuEventWithElementCallbackArgs>;
    onMenuClose: SlickEvent_<GridMenuEventWithElementCallbackArgs>;
    onCommand: SlickEvent_<GridMenuCommandItemCallbackArgs>;
    onColumnsChanged: SlickEvent_<onGridMenuColumnsChangedCallbackArgs>;
    protected _bindingEventService: BindingEventService_;
    protected _gridOptions: GridOption;
    protected _gridUid: string;
    protected _isMenuOpen: boolean;
    protected _columnCheckboxes: HTMLInputElement[];
    protected _columnTitleElm: HTMLElement;
    protected _commandTitleElm: HTMLElement;
    protected _commandListElm: HTMLDivElement;
    protected _headerElm: HTMLDivElement | null;
    protected _listElm: HTMLElement;
    protected _buttonElm: HTMLElement;
    protected _menuElm: HTMLElement;
    protected _subMenuParentId: string;
    protected _gridMenuOptions: GridMenuOption | null;
    protected _defaults: GridMenuOption;
    constructor(columns: Column[], grid: SlickGrid, gridOptions: GridOption);
    init(grid: SlickGrid): void;
    setOptions(newOptions: GridMenuOption): void;
    protected createGridMenu(): void;
    /** Create the menu or sub-menu(s) but without the column picker which is a separate single process */
    createMenu(level?: number, item?: GridMenuItem | MenuCommandItem | 'divider'): HTMLDivElement;
    /** Destroy the plugin by unsubscribing every events & also delete the menu DOM elements */
    destroy(): void;
    /** Delete the menu DOM element but without unsubscribing any events */
    deleteMenu(): void;
    /** Close and destroy all previously opened sub-menus */
    destroySubMenus(): void;
    /** Construct the custom command menu items. */
    protected populateCommandsMenu(commandItems: Array<GridMenuItem | MenuCommandItem | 'divider'>, commandListElm: HTMLElement, args: {
        grid: SlickGrid;
        level: number;
    }): void;
    /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
    protected populateColumnPicker(): void;
    /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
    recreateGridMenu(): void;
    showGridMenu(e: DOMMouseOrTouchEvent<HTMLButtonElement>): void;
    protected getGridUidSelector(): string;
    protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLElement>): void;
    protected handleMenuItemClick(item: GridMenuItem | MenuCommandItem | 'divider', level: number | undefined, e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>): void;
    hideMenu(e: DOMMouseOrTouchEvent<HTMLElement>): void;
    /** Update the Titles of each sections (command, commandTitle, ...) */
    updateAllTitles(gridMenuOptions: GridMenuOption): void;
    protected addSubMenuTitleWhenExists(item: GridMenuItem | MenuCommandItem | 'divider', commandOrOptionMenu: HTMLDivElement): void;
    protected repositionSubMenu(item: GridMenuItem | MenuCommandItem | 'divider', level: number, e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>): void;
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLButtonElement | HTMLDivElement>, menuElm: HTMLElement, buttonElm?: HTMLButtonElement): void;
    protected updateColumnOrder(): void;
    protected updateColumn(e: DOMMouseOrTouchEvent<HTMLInputElement>): void;
    getAllColumns(): Column<any>[];
    /** visible columns, we can simply get them directly from the grid */
    getVisibleColumns(): Column<any>[];
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.gridmenu.d.ts.map