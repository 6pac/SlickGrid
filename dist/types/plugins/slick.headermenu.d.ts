import { BindingEventService as BindingEventService_, type SlickEventData, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { Column, DOMEvent, DOMMouseOrTouchEvent, HeaderMenuCommandItemCallbackArgs, HeaderMenuItems, HeaderMenuOption, HeaderMenuCommandItem, MenuCommandItemCallbackArgs, SlickPlugin, OnHeaderCellRenderedEventArgs } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * A plugin to add drop-down menus to column headers.
 *
 * USAGE:
 *
 * Add the plugin .js & .css files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 *
 *   let columns = [
 *     {
 *       id: 'myColumn',
 *       name: 'My column',
 *
 *       // This is the relevant part
 *       header: {
 *          menu: {
 *              items: [
 *                {
 *                  // menu item options
 *                },
 *                {
 *                  // menu item options
 *                }
 *              ]
 *          }
 *       }
 *     }
 *   ];
 *
 *
 * Available menu options:
 *    autoAlign:              Auto-align drop menu to the left when not enough viewport space to show on the right
 *    autoAlignOffset:        When drop menu is aligned to the left, it might not be perfectly aligned with the header menu icon, if that is the case you can add an offset (positive/negative number to move right/left)
 *    buttonCssClass:         an extra CSS class to add to the menu button (default 'caret')
 *    buttonImage:            a url to the menu button image
 *    menuUsabilityOverride:  Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *    minWidth:               Minimum width that the drop menu will have
 *    subItemChevronClass:        CSS class that can be added on the right side of a sub-item parent (typically a chevron-right icon)
 *    subMenuOpenByEvent:         defaults to "mouseover", what event type shoud we use to open sub-menu(s), 2 options are available: "mouseover" or "click"
 *
 *
 * Available menu item options:
 *    action:                   Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    title:                    Menu item text.
 *    divider:                  Whether the current item is a divider, not an actual command.
 *    disabled:                 Whether the item/command is disabled.
 *    hidden:                   Whether the item/command is hidden.
 *    tooltip:                  Item tooltip.
 *    command:                  A command identifier to be passed to the onCommand event handlers.
 *    cssClass:                 A CSS class to be added to the menu item container.
 *    iconCssClass:             A CSS class to be added to the menu item icon.
 *    iconImage:                A url to the icon image.
 *    textCssClass:             A CSS class to be added to the menu item text.
 *    itemVisibilityOverride:   Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:    Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 *
 * The plugin exposes the following events:

  *    onAfterMenuShow:   Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
  *        Event args:
  *            grid:     Reference to the grid.
  *            column:   Column definition.
  *            menu:     Menu options.  Note that you can change the menu items here.
  *
  *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
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
  *
  *
  * @param options {Object} Options:
  *    buttonCssClass:   an extra CSS class to add to the menu button (default 'caret')
  *    buttonImage:      a url to the menu button image
  * @class Slick.Plugins.HeaderButtons
  */
export declare class SlickHeaderMenu implements SlickPlugin {
    pluginName: "HeaderMenu";
    onAfterMenuShow: import("../slick.core.js").SlickEvent<HeaderMenuCommandItemCallbackArgs>;
    onBeforeMenuShow: import("../slick.core.js").SlickEvent<HeaderMenuCommandItemCallbackArgs>;
    onCommand: import("../slick.core.js").SlickEvent<MenuCommandItemCallbackArgs>;
    protected _grid: SlickGrid;
    protected _gridUid: string;
    protected _handler: SlickEventHandler_;
    protected _bindingEventService: BindingEventService_;
    protected _defaults: HeaderMenuOption;
    protected _options: HeaderMenuOption;
    protected _activeHeaderColumnElm?: HTMLDivElement | null;
    protected _menuElm?: HTMLDivElement | null;
    protected _subMenuParentId: string;
    constructor(options: Partial<HeaderMenuOption>);
    init(grid: SlickGrid): void;
    setOptions(newOptions: Partial<HeaderMenuOption>): void;
    protected getGridUidSelector(): string;
    destroy(): void;
    destroyAllMenus(): void;
    /** Close and destroy all previously opened sub-menus */
    destroySubMenus(): void;
    protected handleBodyMouseDown(e: DOMEvent<HTMLElement>): void;
    hideMenu(): void;
    protected handleHeaderCellRendered(_e: SlickEventData, args: OnHeaderCellRenderedEventArgs): void;
    protected handleBeforeHeaderCellDestroy(_e: SlickEventData, args: {
        column: Column;
        node: HTMLElement;
    }): void;
    protected addSubMenuTitleWhenExists(item: HeaderMenuCommandItem | 'divider', commandMenuElm: HTMLDivElement): void;
    protected createParentMenu(event: DOMMouseOrTouchEvent<HTMLDivElement>, menu: HeaderMenuItems, columnDef: Column): void;
    protected createMenu(commandItems: Array<HeaderMenuCommandItem | 'divider'>, columnDef: Column, level?: number, item?: HeaderMenuCommandItem | 'divider'): HTMLDivElement;
    protected handleMenuItemClick(item: HeaderMenuCommandItem | 'divider', columnDef: Column, level: number | undefined, e: DOMMouseOrTouchEvent<HTMLDivElement>): boolean | void;
    protected repositionSubMenu(item: HeaderMenuCommandItem, columnDef: Column, level: number, e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, menuElm: HTMLDivElement): void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.headermenu.d.ts.map