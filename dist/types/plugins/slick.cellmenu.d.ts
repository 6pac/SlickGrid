import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_ } from '../slick.core';
import type { CellMenuOption, DOMMouseOrTouchEvent, GridOption, MenuCommandItem, MenuCommandItemCallbackArgs, MenuFromCellCallbackArgs, MenuOptionItem, MenuOptionItemCallbackArgs, Plugin } from '../models/index';
import type { SlickGrid } from '../slick.grid';
/**
 * A plugin to add Menu on a Cell click (click on the cell that has the cellMenu object defined)
 * The "cellMenu" is defined in a Column Definition object
 * Similar to the ContextMenu plugin (could be used in combo),
 * except that it subscribes to the cell "onClick" event (regular mouse click or touch).
 *
 * A general use of this plugin is for an Action Dropdown Menu to do certain things on the row that was clicked
 * You can use it to change the cell data property through a list of Options AND/OR through a list of Commands.
 *
 * USAGE:
 *
 * Add the slick.cellMenu.(js|css) files and register it with the grid.
 *
 * To specify a menu in a column header, extend the column definition like so:
 * var cellMenuPlugin = new Slick.Plugins.CellMenu(columns, grid, options);
 *
 * Available cellMenu options, by defining a cellMenu object:
 *
 *  var columns = [
 *    {
 *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
 *      cellMenu: {
 *        optionTitle: "Change Effort Driven",
 *        optionItems: [
 *          { option: true, title: "True", iconCssClass: 'checkmark' },
 *          { option: false, title: "False" }
 *        ],
 *        commandTitle: "Commands",
 *        commandItems: [
 *          { command: "delete-row", title: "Delete Row", iconCssClass: "sgi sgi-close", cssClass: 'bold', textCssClass: "red" },
 *          { divider: true },
 *          "divider" // you can pass "divider" as a string or an object
 *          { command: "help", title: "Help", iconCssClass: "icon-help" },
 *          { command: "help", title: "Disabled Command", disabled: true },
 *        ],
 *      }
 *    }
 *  ];
 *
 *
 * Available cellMenu properties:
 *    commandTitle:               Title of the Command section (optional)
 *    commandItems:               Array of Command item objects (command/title pair)
 *    optionTitle:                Title of the Option section (optional)
 *    optionItems:                Array of Options item objects (option/title pair)
 *    hideCloseButton:            Hide the Close button on top right (defaults to false)
 *    hideCommandSection:         Hide the Commands section even when the commandItems array is filled (defaults to false)
 *    hideMenuOnScroll:           Do we want to hide the Cell Menu when a scrolling event occurs (defaults to true)?
 *    hideOptionSection:          Hide the Options section even when the optionItems array is filled (defaults to false)
 *    maxHeight:                  Maximum height that the drop menu will have, can be a number (250) or text ("none")
 *    width:                      Width that the drop menu will have, can be a number (250) or text (defaults to "auto")
 *    autoAdjustDrop:             Auto-align dropup or dropdown menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAdjustDropOffset:       Optionally add an offset to the auto-align of the drop menu (defaults to 0)
 *    autoAlignSide:              Auto-align drop menu to the left or right depending on grid viewport available space (defaults to true)
 *    autoAlignSideOffset:        Optionally add an offset to the left/right side auto-align (defaults to 0)
 *    menuUsabilityOverride:      Callback method that user can override the default behavior of enabling/disabling the menu from being usable (must be combined with a custom formatter)
 *
 *
 * Available menu Command/Option item properties:
 *    action:                     Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
 *    command:                    A command identifier to be passed to the onCommand event handlers (when using "commandItems").
 *    option:                     An option to be passed to the onOptionSelected event handlers (when using "optionItems").
 *    title:                      Menu item text label.
 *    divider:                    Boolean which tells if the current item is a divider, not an actual command. You could also pass "divider" instead of an object
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
 * @param options {Object} Cell Menu Options
 * @class Slick.Plugins.CellMenu
 */
export declare class SlickCellMenu implements Plugin {
    pluginName: "CellMenu";
    onAfterMenuShow: SlickEvent_<MenuFromCellCallbackArgs>;
    onBeforeMenuShow: SlickEvent_<MenuFromCellCallbackArgs>;
    onBeforeMenuClose: SlickEvent_<MenuFromCellCallbackArgs>;
    onCommand: SlickEvent_<MenuCommandItemCallbackArgs>;
    onOptionSelected: SlickEvent_<MenuOptionItemCallbackArgs>;
    protected _cellMenuProperties: CellMenuOption;
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
    protected _defaults: CellMenuOption;
    constructor(optionProperties: Partial<CellMenuOption>);
    init(grid: SlickGrid): void;
    setOptions(newOptions: Partial<CellMenuOption>): void;
    destroy(): void;
    protected createMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>): HTMLDivElement | undefined;
    protected handleCloseButtonClicked(e: DOMMouseOrTouchEvent<HTMLButtonElement>): void;
    destroyMenu(e?: Event, args?: {
        cell: number;
        row: number;
    }): void;
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    repositionMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    protected handleCellClick(evt: SlickEventData_ | DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuCommandItemCallbackArgs): void;
    protected handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    closeMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>, args: MenuFromCellCallbackArgs): void;
    /** Construct the Option Items section. */
    protected populateOptionItems(cellMenu: CellMenuOption, optionMenuElm: HTMLElement, optionItems: Array<MenuOptionItem | 'divider'>, args: any): void;
    /** Construct the Command Items section. */
    protected populateCommandItems(cellMenu: CellMenuOption, commandMenuElm: HTMLElement, commandItems: Array<MenuCommandItem | 'divider'>, args: any): void;
    protected handleMenuItemCommandClick(item: MenuCommandItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    protected handleMenuItemOptionClick(item: MenuOptionItem | 'divider', e: DOMMouseOrTouchEvent<HTMLDivElement>): void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.cellmenu.d.ts.map