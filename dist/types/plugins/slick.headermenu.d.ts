import { BindingEventService as BindingEventService_, SlickEventHandler as SlickEventHandler_ } from '../slick.core';
import type { Column, DOMEvent, HeaderMenuCommandItemCallbackArgs, HeaderMenuItems, HeaderMenuOption, MenuCommandItem, MenuCommandItemCallbackArgs, Plugin, OnHeaderCellRenderedEventArgs } from '../models/index';
import type { SlickGrid } from '../slick.grid';
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
export declare class SlickHeaderMenu implements Plugin {
    pluginName: "HeaderMenu";
    onAfterMenuShow: import("../slick.core").SlickEvent<HeaderMenuCommandItemCallbackArgs>;
    onBeforeMenuShow: import("../slick.core").SlickEvent<HeaderMenuCommandItemCallbackArgs>;
    onCommand: import("../slick.core").SlickEvent<MenuCommandItemCallbackArgs>;
    protected _grid: SlickGrid;
    protected _handler: SlickEventHandler_<any>;
    protected _bindingEventService: BindingEventService_;
    protected _defaults: HeaderMenuOption;
    protected _options: HeaderMenuOption;
    protected _activeHeaderColumnElm?: HTMLDivElement | null;
    protected _menuElm?: HTMLDivElement | null;
    constructor(options: Partial<HeaderMenuOption>);
    init(grid: SlickGrid): void;
    setOptions(newOptions: Partial<HeaderMenuOption>): void;
    protected getGridUidSelector(): string;
    destroy(): void;
    protected handleBodyMouseDown(e: DOMEvent<HTMLElement>): void;
    hideMenu(): void;
    protected handleHeaderCellRendered(_e: Event, args: OnHeaderCellRenderedEventArgs): void;
    protected handleBeforeHeaderCellDestroy(_e: Event, args: {
        column: Column;
        node: HTMLElement;
    }): void;
    protected showMenu(event: MouseEvent, menu: HeaderMenuItems, columnDef: Column): void;
    protected handleMenuItemClick(item: MenuCommandItem | 'divider', columnDef: Column, e: DOMEvent<HTMLDivElement>): boolean | void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.headermenu.d.ts.map