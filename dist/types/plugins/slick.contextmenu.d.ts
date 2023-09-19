import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_ } from '../slick.core';
import type { ContextMenuOption, DOMMouseOrTouchEvent, GridOption, MenuCommandItem, MenuCommandItemCallbackArgs, MenuFromCellCallbackArgs, MenuOptionItem, MenuOptionItemCallbackArgs, Plugin } from '../models/index';
import type { SlickGrid } from '../slick.grid';
/**
 * A plugin to add Context Menu (mouse right+click), it subscribes to the cell "onContextMenu" event.
 * The "contextMenu" is defined in the Grid Options object
 * You can use it to change a data property (only 1) through a list of Options AND/OR through a list of Commands.
 * A good example of a Command would be an Export to CSV, that can be run from anywhere in the grid by doing a mouse right+click
 *
 * Note:
 *   There is only 1 list of Options, so typically that would be use for 1 column
 *   if you plan to use different Options for different columns, then the CellMenu plugin might be better suited.
 *
 * USAGE:
 *
 * Add the slick.contextmenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * var contextMenuPlugin = new Slick.Plugins.ContextMenu(columns, grid, options);
 *
 * Available grid options, by defining a contextMenu object:
 *
 *  var options = {
 *    enableCellNavigation: true,
 *    contextMenu: {
 *      optionTitle: 'Change Priority',
 *      optionShownOverColumnIds: ["priority"],
 *      optionItems: [
 *        { option: 0, title: 'none', cssClass: 'italic' },
 *        { divider: true },
 *        "divider" // just the string is also accepted
 *        { option: 1, iconCssClass: 'fa fa-fire grey', title: 'Low' },
 *        { option: 3, iconCssClass: 'fa fa-fire red', title: 'High' },
 *        { option: 2, iconCssClass: 'fa fa-fire orange', title: 'Medium' },
 *        { option: 4, iconCssClass: 'fa fa-fire', title: 'Extreme', disabled: true },
 *      ],
 *      commandTitle: 'Commands',
 *      commandShownOverColumnIds: ["title", "complete", "start", "finish", "effortDriven"],
 *      commandItems: [
 *        { command: 'export-excel', title: 'Export to CSV', iconCssClass: 'fa fa-file-excel-o', cssClass: '' },
 *        { command: 'delete-row', title: 'Delete Row', cssClass: 'bold', textCssClass: 'red' },
 *        { command: 'help', title: 'Help', iconCssClass: 'fa fa-question-circle',},
 *        { divider: true },
 *      ],
 *    }
 *  };
 *
 *
 * Available contextMenu properties:
 *    commandTitle:               Title of the Command section (optional)
 *    commandItems:               Array of Command item objects (command/title pair)
 *    commandShownOverColumnIds:  Define which column to show the Commands list. If not defined (defaults), the menu will be shown over all columns
 *    optionTitle:                Title of the Option section (optional)
 *    optionItems:                Array of Options item objects (option/title pair)
 *    optionShownOverColumnIds:   Define which column to show the Options list. If not defined (defaults), the menu will be shown over all columns
 *    hideCloseButton:            Hide the Close button on top right (defaults to false)
 *    hideCommandSection:         Hide the Commands section even when the commandItems array is filled (defaults to false)
 *    hideMenuOnScroll:           Do we want to hide the Cell Menu when a scrolling event occurs (defaults to false)?
 *    hideOptionSection:          Hide the Options section even when the optionItems array is filled (defaults to false)
 *    maxHeight:                  Maximum height that the drop menu will have, can be a number (250) or text ("none")
 *    width:                      Width that the drop menu will have, can be a number (250) or text (defaults to "auto")
 *    autoAdjustDrop:             Auto-align dropup or dropdown menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAdjustDropOffset:       Optionally add an offset to the auto-align of the drop menu (defaults to -4)
 *    autoAlignSide:              Auto-align drop menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAlignSideOffset:        Optionally add an offset to the left/right side auto-align (defaults to 0)
 *    menuUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *
 *
 * Available menu Command/Option item properties:
 *    action:                     Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    command:                    A command identifier to be passed to the onCommand event handlers (when using "commandItems").
 *    option:                     An option to be passed to the onOptionSelected event handlers (when using "optionItems").
 *    title:                      Menu item text.
 *    divider:                    Boolean which tell if the current item is a divider, not an actual command. You could also pass "divider" instead of an object
 *    disabled:                   Whether the item/command is disabled.
 *    hidden:                     Whether the item/command is hidden.
 *    tooltip:                    Item tooltip.
 *    cssClass:                   A CSS class to be added to the menu item container.
 *    iconCssClass:               A CSS class to be added to the menu item icon.
 *    textCssClass:               A CSS class to be added to the menu item text.
 *    iconImage:                  A url to the icon image.
 *    itemVisibilityOverride:     Callback method that user can override the default behavior of showing/hiding an item from the list
 *    itemUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling an item from the list
 *
 * The plugin exposes the following events:
 *
 *    onAfterMenuShow: Fired after the menu is shown.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *
 *    onBeforeMenuShow: Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *
 *    onBeforeMenuClose: Fired when the menu is closing.
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            menu:         Menu DOM element
 *
 *    onCommand: Fired on menu option clicked from the Command items list
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            command:      Menu command identified.
 *            item:         Menu item selected
 *            column:    Cell Column definition
 *            dataContext:  Cell Data Context (data object)
 *            value:        Value of the cell we triggered the context menu from
 *
 *    onOptionSelected: Fired on menu option clicked from the Option items list
 *        Event args:
 *            cell:         Cell or column index
 *            row:          Row index
 *            grid:         Reference to the grid.
 *            option:       Menu option selected.
 *            item:         Menu item selected
 *            column:    Cell Column definition
 *            dataContext:  Cell Data Context (data object)
 *
 *
 * @param options {Object} Context Menu Options
 * @class Slick.Plugins.ContextMenu
 */
export declare class SlickContextMenu implements Plugin {
    pluginName: "ContextMenu";
    onAfterMenuShow: SlickEvent_<MenuFromCellCallbackArgs>;
    onBeforeMenuShow: SlickEvent_<MenuFromCellCallbackArgs>;
    onBeforeMenuClose: SlickEvent_<MenuFromCellCallbackArgs>;
    onCommand: SlickEvent_<MenuCommandItemCallbackArgs>;
    onOptionSelected: SlickEvent_<MenuOptionItemCallbackArgs>;
    protected _contextMenuProperties: ContextMenuOption;
    protected _currentCell: number;
    protected _currentRow: number;
    protected _grid: SlickGrid;
    protected _gridOptions: GridOption;
    protected _gridUid: string;
    protected _handler: SlickEventHandler_<any>;
    protected _commandTitleElm?: HTMLSpanElement;
    protected _optionTitleElm?: HTMLSpanElement;
    protected _menuElm?: HTMLDivElement | null;
    protected _bindingEventService: BindingEventService_;
    protected _defaults: ContextMenuOption;
    constructor(optionProperties: Partial<ContextMenuOption>);
    init(grid: SlickGrid): void;
    setOptions(newOptions: Partial<ContextMenuOption>): void;
    destroy(): void;
    protected createMenu(evt: SlickEventData_ | MouseEvent): HTMLDivElement | undefined;
    protected handleCloseButtonClicked(e: MouseEvent | TouchEvent): void;
    destroyMenu(e?: Event, args?: {
        cell: number;
        row: number;
    }): void;
    protected checkIsColumnAllowed(columnIds: Array<number | string>, columnId: number | string): boolean;
    protected handleOnContextMenu(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs): void;
    /** Construct the Option Items section. */
    protected populateOptionItems(contextMenu: ContextMenuOption, optionMenuElm: HTMLElement, optionItems: Array<MenuOptionItem | 'divider'>, args: any): void;
    /** Construct the Command Items section. */
    protected populateCommandItems(contextMenu: ContextMenuOption, commandMenuElm: HTMLElement, commandItems: Array<MenuCommandItem | 'divider'>, args: any): void;
    protected handleMenuItemCommandClick(item: MenuCommandItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    protected handleMenuItemOptionClick(item: MenuOptionItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    protected repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.contextmenu.d.ts.map