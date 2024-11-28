import type { SlickGrid } from '../slick.grid.js';
import type { Column, Formatter } from './index.js';
export interface Observable<T = any> {
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): any;
    pipe(...fns: Array<any>): any;
}
export interface Subject<T = any> extends Observable<T> {
    complete(): any;
    next(value: T): void;
    unsubscribe(): void;
}
type PostProcessOutput<P> = P & {
    [asyncParamsPropName: string]: any;
};
export type AsyncProcess<T = any> = (row: number, cell: number, value: any, columnDef: Column<T>, dataContext: T, grid?: SlickGrid) => Promise<PostProcessOutput<T>> | Observable<PostProcessOutput<T>> | Subject<PostProcessOutput<T>>;
export interface CustomTooltipOption<T = any> {
    /** defaults to "__params", optionally change the property name that will be used to merge the data returned by the async method into the `dataContext` object */
    asyncParamsPropName?: string;
    /**
     * Async Post method returning a Promise, it must return an object with 1 or more properties
     * Note: internally the data that will automatically be merged into the `dataContext` object under the `__params` property so that you can use it in your `asyncPostFormatter` formatter.
     */
    asyncProcess?: AsyncProcess<T>;
    /** Formatter to execute once the async process is completed, to displayed the actual text result (used when dealing with an Async API to get data to display later in the tooltip) */
    asyncPostFormatter?: Formatter;
    /** Formatter to execute when custom tooltip is over a header column */
    headerFormatter?: Formatter;
    /** Formatter to execute when custom tooltip is over a heade row column (e.g. filter) */
    headerRowFormatter?: Formatter;
    /** defaults to False, should we hide the tooltip pointer arrow? */
    hideArrow?: boolean;
    /** defaults to "slick-custom-tooltip" */
    className?: string;
    /**
     * Formatter to execute for displaying the data that will show in the tooltip
     * NOTE: when using `asyncProcess`, this formatter will be executed first and prior to the actual async process,
     * in other words you will want to use this formatter as a loading spinner formatter and the `asyncPostFormatter` as the final formatter.
     */
    formatter?: Formatter;
    /** optional maximum height number (in pixel) of the tooltip container */
    maxHeight?: number;
    /** optional maximum width number (in pixel) of the tooltip container */
    maxWidth?: number;
    /** defaults to 0, optional left offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container. */
    offsetLeft?: number;
    /** defaults to 0, optional right offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container. */
    offsetRight?: number;
    /** defaults to 4, optional top or bottom offset (depending on which side it shows), it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container. */
    offsetTopBottom?: number;
    /**
     * Defaults to "auto" (note that "center" will never be used by "auto"), allows to align the tooltip to the best logical position in the window, by default it will show on top but if it calculates that it doesn't have enough space it will revert to bottom.
     * We can assume that in 80% of the time the default position is top left, the default is "auto" but we can also override this and use a specific align side.
     * Most of the time, the positioning of the tooltip will be "right-align" of the cell which is typically ok unless your column is completely on the right side and so we'll want to change the position to "left-align" in that case.
     * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are showing a tooltip from a cell on the top of the grid then we might need to reposition to "bottom" instead.
     */
    position?: 'auto' | 'top' | 'bottom' | 'left-align' | 'right-align' | 'center';
    /** defaults to False, when set to True it will skip custom tooltip formatter and instead will parse through the regular cell formatter and try to find a `title` to show regular tooltip */
    useRegularTooltip?: boolean;
    /**
     * defaults to False, optionally force to retrieve the `title` from the Formatter result instead of the cell itself.
     * For example, when used in combo with the AutoTooltip plugin we might want to force the tooltip to read the `title` attribute from the formatter result first instead of the cell itself,
     * make the cell as a 2nd read, in other words check the formatter prior to the cell which the AutoTooltip might have filled.
     */
    useRegularTooltipFromFormatterOnly?: boolean;
    /** defaults to false, regular "title" tooltip won't be rendered as html unless specified via this flag (also "\r\n" will be replaced by <br>) */
    renderRegularTooltipAsHtml?: boolean;
    /** defaults to 700 (characters), when defined the text will be truncated to the max length characters provided */
    tooltipTextMaxLength?: number;
    /**
     * defaults to `pre-line`, optionally change the style `white-space` when displaying regular text tooltip
     * NOTE: when using a formatter it will use the `whiteSpace` setting instead
     */
    regularTooltipWhiteSpace?: string;
    /** defaults to `normal`, optionally change the style `white-space` when displaying tooltip with formatter (tooltip or regular formatter) */
    whiteSpace?: string;
    /** Callback method that user can override the default behavior of showing the tooltip. If it returns False, then the tooltip won't show */
    usabilityOverride?: (args: {
        cell: number;
        row: number;
        column: Column;
        dataContext: any;
        type: 'cell' | 'header' | 'header-row';
        grid: SlickGrid;
    }) => boolean;
}
export {};
//# sourceMappingURL=customTooltipOption.interface.d.ts.map