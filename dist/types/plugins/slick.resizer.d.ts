import { BindingEventService as BindingEventService_ } from '../slick.core.js';
import type { GridOption, GridSize, ResizerOption } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
/***
 * A Resizer plugin that can be used to auto-resize a grid and/or resize with fixed dimensions.
 * When fixed height is defined, it will auto-resize only the width and vice versa with the width defined.
 * You can also choose to use the flag "enableAutoSizeColumns" if you want to the plugin to
 * automatically call the grid "autosizeColumns()" method after each resize.
 *
 * USAGE:
 *
 * Add the "slick.resizer.js" file and register it with the grid.
 *
 * You can specify certain options as arguments when instantiating the plugin like so:
 * var resizer = new Slick.Plugins.Resizer({
 *   container: '#gridContainer',
 *   rightPadding: 15,
 *   bottomPadding: 20,
 *   minHeight: 180,
 *   minWidth: 300,
 * });
 * grid.registerPlugin(resizer);
 *
 *
 * The plugin exposes the following events:
 *
 *    onGridAfterResize:  Fired after the grid got resized.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            grid:       Reference to the grid.
 *            dimensions: Resized grid dimensions used
 *
 *    onGridBeforeResize:   Fired before the grid gets resized.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            grid:     Reference to the grid.
 *
 *
 * @param {Object} options available plugin options that can be passed in the constructor:
 *   container:      (REQUIRED) DOM element selector of the page container, basically what element in the page will be used to calculate the available space
 *   gridContainer:             DOM element selector of the grid container, optional but when provided it will be resized with same size as the grid (typically a container holding the grid and extra custom footer/pagination)
 *   applyResizeToContainer:    Defaults to false, do we want to apply the resized dimentions to the grid container as well?
 *   rightPadding:              Defaults to 0, right side padding to remove from the total dimension
 *   bottomPadding:             Defaults to 20, bottom padding to remove from the total dimension
 *   minHeight:                 Defaults to 180, minimum height of the grid
 *   minWidth:                  Defaults to 300, minimum width of the grid
 *   maxHeight:                 Maximum height of the grid
 *   maxWidth:                  Maximum width of the grid
 *   calculateAvailableSizeBy:  Defaults to "window", which DOM element ("container" or "window") are we using to calculate the available size for the grid?
 *
 * @class Slick.Plugins.Resizer
 */
export declare class SlickResizer {
    pluginName: "Resizer";
    onGridAfterResize: import("../slick.core.js").SlickEvent<{
        grid: SlickGrid;
        dimensions: GridSize;
    }>;
    onGridBeforeResize: import("../slick.core.js").SlickEvent<{
        grid: SlickGrid;
    }>;
    protected _bindingEventService: BindingEventService_;
    protected _fixedHeight?: number | null;
    protected _fixedWidth?: number | null;
    protected _grid: SlickGrid;
    protected _gridDomElm: HTMLElement;
    protected _gridContainerElm: HTMLElement;
    protected _pageContainerElm: HTMLElement;
    protected _gridOptions: GridOption;
    protected _gridUid: string;
    protected _lastDimensions?: GridSize;
    protected _resizePaused: boolean;
    protected _timer?: number;
    protected _options: ResizerOption;
    protected _defaults: ResizerOption;
    constructor(options: Partial<ResizerOption>, fixedDimensions?: {
        height?: number;
        width?: number;
    });
    setOptions(newOptions: Partial<ResizerOption>): void;
    init(grid: SlickGrid): void;
    /** Bind an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
    * Options: we could also provide a % factor to resize on each height/width independently
    */
    bindAutoResizeDataGrid(newSizes?: GridSize): void;
    /**
     * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
     */
    calculateGridNewDimensions(): GridSize | null;
    /** Destroy function when element is destroyed */
    destroy(): void;
    /**
    * Return the last resize dimensions used by the service
    * @return {object} last dimensions (height: number, width: number)
    */
    getLastResizeDimensions(): GridSize | undefined;
    /**
     * Provide the possibility to pause the resizer for some time, until user decides to re-enabled it later if he wish to.
     * @param {boolean} isResizePaused are we pausing the resizer?
     */
    pauseResizer(isResizePaused: boolean): void;
    /**
     * Resize the datagrid to fit the browser height & width.
     * @param {number} [delay] to wait before resizing, defaults to 0 (in milliseconds)
     * @param {object} [newSizes] can optionally be passed (height: number, width: number)
     * @param {object} [event] that triggered the resize, defaults to null
     * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
     */
    resizeGrid(delay?: number, newSizes?: GridSize, event?: Event | null): Promise<GridSize | undefined> | void;
    protected resizeGridCallback(newSizes?: GridSize, event?: Event | null): GridSize;
    protected resizeGridWithDimensions(newSizes?: GridSize): GridSize | undefined;
}
//# sourceMappingURL=slick.resizer.d.ts.map