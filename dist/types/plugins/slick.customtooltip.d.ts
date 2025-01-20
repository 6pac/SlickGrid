import type { CancellablePromiseWrapper, Column, CustomDataView, CustomTooltipOption, Formatter, GridOption } from '../models/index.js';
import { type SlickEventData, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * A plugin to add Custom Tooltip when hovering a cell, it subscribes to the cell "onMouseEnter" and "onMouseLeave" events.
 * The "customTooltip" is defined in the Column Definition OR Grid Options (the first found will have priority over the second)
 *
 * USAGE:
 *
 * Add the slick.customTooltip.(js|css) files and register it with the grid.
 *
 * To specify a tooltip when hovering a cell, extend the column definition like so:
 * const customTooltipPlugin = new Slick.Plugins.CustomTooltip(columns, grid options);
 *
 * Available plugin options (same options are available in both column definition and/or grid options)
 *
 * Example 1  - via Column Definition
 *  const columns = [
 *    {
 *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
 *      customTooltip: {
 *        formatter: tooltipTaskFormatter,
 *        usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *      }
 *    }
 *  ];
 *
 *  OR Example 2 - via Grid Options (for all columns), NOTE: the column definition tooltip options will win over the options defined in the grid options
 *  const gridOptions = {
 *    enableCellNavigation: true,
 *    customTooltip: {
 *      formatter: tooltipTaskFormatter,
 *      usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *    },
 *  };
 *
 * Available options that can be defined from either a column definition or in grid options (column definition options as precendence)
 *   asyncParamsPropName:                 defaults to "__params", optionally change the property name that will be used to merge the data returned by the async method into the `dataContext` object
 *   asyncProcess:                        Async Post method returning a Promise, it must return an object with 1 or more properties. internally the data that will automatically be merged into the `dataContext` object under the `__params` property so that you can use it in your `asyncPostFormatter` formatter.
 *   asyncPostFormatter:                  Formatter to execute once the async process is completed, to displayed the actual text result (used when dealing with an Async API to get data to display later in the tooltip)
 *   hideArrow:                           defaults to False, should we hide the tooltip pointer arrow?
 *   className:                           defaults to "slick-custom-tooltip"
 *   formatter:                           Formatter to execute for displaying the data that will show in the tooltip. NOTE: when using `asyncProcess`, this formatter will be executed first and prior to the actual async process.
 *   headerFormatter:                     Formatter to execute when custom tooltip is over a header column
 *   headerRowFormatter:                  Formatter to execute when custom tooltip is over a heade row column (e.g. filter)
 *   maxHeight:                           optional maximum height number (in pixel) of the tooltip container
 *   maxWidth:                            optional maximum width number (in pixel) of the tooltip container
 *   offsetLeft:                          defaults to 0, optional left offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   offsetRight:                         defaults to 0, optional right offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   offsetTopBottom:                     defaults to 4, optional top or bottom offset (depending on which side it shows), it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   position:                            defaults to "auto" (available options: 'auto' | 'top' | 'bottom' | 'left-align' | 'right-align'), allows to align the tooltip to the best logical position in the window, by default it will show on top left but if it calculates that it doesn't have enough space it will use bottom (same goes for each side align)
 *   regularTooltipWhiteSpace:            defaults to `pre-line`, optionally change the style `white-space` when displaying regular text tooltip. NOTE: when using a formatter it will use the `whiteSpace` setting instead
 *   whiteSpace:                          defaults to `normal`, optionally change the style `white-space` when displaying tooltip with formatter (tooltip or regular formatter)
 *   useRegularTooltip:                   defaults to False, when set to True it will try parse through the regular cell formatter and try to find a `title` attribute to show as a regular tooltip (also note: this has precedence over customTooltip formatter defined)
 *   useRegularTooltipFromFormatterOnly:  defaults to False, optionally force to retrieve the `title` from the Formatter result instead of the cell itself.
 *                                            for example, when used in combo with the AutoTooltip plugin we might want to force the tooltip to read the `title` attribute from the formatter result first instead of the cell itself,
 *                                            make the cell as a 2nd read, in other words check the formatter prior to the cell which the AutoTooltip might have filled.
 *   renderRegularTooltipAsHtml:          defaults to false, regular "title" tooltip won't be rendered as html unless specified via this flag (also "\r\n" will be replaced by <br>)
 *   tooltipTextMaxLength:                defaults to 700 (characters), when defined the text will be truncated to the max length characters provided
 *   usabilityOverride:                   callback method that user can override the default behavior of showing the tooltip. If it returns False, then the tooltip won't show
 *
 * @param options {Object} Custom Tooltip Options
 * @class Slick.Plugins.CustomTooltip
 * @constructor
 */
type CellType = 'slick-cell' | 'slick-header-column' | 'slick-headerrow-column';
/**
 * CustomTooltip plugin to show/hide tooltips when columns are too narrow to fit content.
 * @constructor
 * @param {boolean} [options.className="slick-custom-tooltip"]  - custom tooltip class name
 * @param {boolean} [options.offsetTop=5]                       - tooltip offset from the top
 */
export declare class SlickCustomTooltip {
    protected readonly tooltipOptions: Partial<CustomTooltipOption>;
    pluginName: "CustomTooltip";
    protected _cancellablePromise?: CancellablePromiseWrapper;
    protected _cellNodeElm?: HTMLDivElement;
    protected _dataView?: CustomDataView | null;
    protected _grid: SlickGrid;
    protected _gridOptions: GridOption;
    protected _tooltipElm?: HTMLDivElement;
    protected _options: CustomTooltipOption;
    protected _defaults: CustomTooltipOption;
    protected _eventHandler: SlickEventHandler_;
    protected _cellTooltipOptions: CustomTooltipOption;
    constructor(tooltipOptions: Partial<CustomTooltipOption>);
    /**
     * Initialize plugin.
     */
    init(grid: SlickGrid): void;
    /**
     * Destroy plugin.
     */
    destroy(): void;
    /** depending on the selector type, execute the necessary handler code */
    protected handleOnHeaderMouseEnterByType(e: SlickEventData, args: any, selector: CellType): void;
    /**
     * Handle mouse entering grid cell to show tooltip.
     * @param {jQuery.Event} e - The event
     */
    protected handleOnMouseEnter(e: SlickEventData, args: any): void;
    protected findFirstElementAttribute(inputElm: Element | null | undefined, attributes: string[]): string | null;
    /**
     * Parse the cell formatter and assume it might be html
     * then create a temporary html element to easily retrieve the first [title=""] attribute text content
     * also clear the "title" attribute from the grid div text content so that it won't show also as a 2nd browser tooltip
     */
    protected renderRegularTooltip(formatterOrText: Formatter | string | undefined, cell: {
        row: number;
        cell: number;
    }, value: any, columnDef: Column, item: any): void;
    /**
   * swap and copy the "title" attribute into a new custom attribute then clear the "title" attribute
   * from the grid div text content so that it won't show also as a 2nd browser tooltip
   */
    protected swapAndClearTitleAttribute(inputTitleElm?: Element | null, tooltipText?: string): void;
    protected asyncProcessCallback(asyncResult: any, cell: {
        row: number;
        cell: number;
    }, value: any, columnDef: Column, dataContext: any): void;
    protected cancellablePromise<T = any>(inputPromise: Promise<T>): CancellablePromiseWrapper<T>;
    protected getHtmlElementOffset(element?: HTMLElement | null): {
        top: number;
        left: number;
        bottom: number;
        right: number;
    } | undefined;
    /**
     * hide (remove) tooltip from the DOM,
     * when using async process, it will also cancel any opened Promise/Observable that might still be opened/pending.
     */
    hideTooltip(): void;
    /**
     * Reposition the Tooltip to be top-left position over the cell.
     * By default we use an "auto" mode which will allow to position the Tooltip to the best logical position in the window, also when we mention position, we are talking about the relative position against the grid cell.
     * We can assume that in 80% of the time the default position is top-right, the default is "auto" but we can also override it and use a specific position.
     * Most of the time positioning of the tooltip will be to the "top-right" of the cell is ok but if our column is completely on the right side then we'll want to change the position to "left" align.
     * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are hovering a cell at the top of the grid and there's no room to display it then we might need to reposition to "bottom" instead.
     */
    protected reposition(cell: {
        row: number;
        cell: number;
    }): void;
    /**
     * Parse the Custom Formatter (when provided) or return directly the text when it is already a string.
     * We will also sanitize the text in both cases before returning it so that it can be used safely.
     */
    protected parseFormatterAndSanitize(formatterOrText: Formatter | string | undefined, cell: {
        row: number;
        cell: number;
    }, value: any, columnDef: Column, item: unknown): string | HTMLElement;
    protected renderTooltipFormatter(formatter: Formatter | string | undefined, cell: {
        row: number;
        cell: number;
    }, value: any, columnDef: Column, item: unknown, tooltipText?: string, inputTitleElm?: Element | null): void;
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean;
    setOptions(newOptions: Partial<CustomTooltipOption>): void;
}
export {};
//# sourceMappingURL=slick.customtooltip.d.ts.map