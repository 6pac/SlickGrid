import type { Column, DOMEvent, HeaderButtonItem, HeaderButtonOnCommandArgs, HeaderButtonOption, OnHeaderCellRenderedEventArgs, SlickPlugin } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, type SlickEventData } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/***
   * A plugin to add custom buttons to column headers.
   *
   * USAGE:
   *
   * Add the plugin .js & .css files and register it with the grid.
   *
   * To specify a custom button in a column header, extend the column definition like so:
   *
   *   let columns = [
   *     {
   *       id: 'myColumn',
   *       name: 'My column',
   *
   *       // This is the relevant part
   *       header: {
   *          buttons: [
   *              {
   *                // button options
   *              },
   *              {
   *                // button options
   *              }
   *          ]
   *       }
   *     }
   *   ];
   *
   * Available button options:
   *    cssClass:     CSS class to add to the button.
   *    image:        Relative button image path.
   *    disabled:     Whether the item is disabled.
   *    tooltip:      Button tooltip.
   *    showOnHover:  Only show the button on hover.
   *    handler:      Button click handler.
   *    command:      A command identifier to be passed to the onCommand event handlers.
   *
   * Available menu item options:
   *    action:                   Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
   *    command:                  A command identifier to be passed to the onCommand event handlers.
   *    cssClass:                 CSS class to add to the button.
   *    handler:                  Button click handler.
   *    image:                    Relative button image path.
   *    showOnHover:              Only show the button on hover.
   *    tooltip:                  Button tooltip.
   *    itemVisibilityOverride:   Callback method that user can override the default behavior of showing/hiding an item from the list
   *    itemUsabilityOverride:    Callback method that user can override the default behavior of enabling/disabling an item from the list
   *
   * The plugin exposes the following events:
   *    onCommand:    Fired on button click for buttons with 'command' specified.
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
   *    buttonCssClass:   a CSS class to use for buttons (default 'slick-header-button')
   * @class Slick.Plugins.HeaderButtons
   * @constructor
   */
export declare class SlickHeaderButtons implements SlickPlugin {
    pluginName: "HeaderButtons";
    onCommand: SlickEvent_<HeaderButtonOnCommandArgs>;
    protected _grid: SlickGrid;
    protected _handler: import("../slick.core.js").SlickEventHandler;
    protected _bindingEventService: BindingEventService_;
    protected _defaults: HeaderButtonOption;
    protected _options: HeaderButtonOption;
    constructor(options: Partial<HeaderButtonOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected handleHeaderCellRendered(_e: SlickEventData, args: OnHeaderCellRenderedEventArgs): void;
    protected handleBeforeHeaderCellDestroy(_e: SlickEventData, args: {
        column: Column;
        node: HTMLElement;
    }): void;
    protected handleButtonClick(button: HeaderButtonItem, columnDef: Column, e: DOMEvent<HTMLDivElement>): void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
}
//# sourceMappingURL=slick.headerbuttons.d.ts.map