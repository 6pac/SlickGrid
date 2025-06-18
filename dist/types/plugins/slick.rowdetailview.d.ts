import { SlickEvent as SlickEvent_, type SlickEventData, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { Column, FormatterResultWithHtml, GridOption, OnAfterRowDetailToggleArgs, OnBeforeRowDetailToggleArgs, OnRowBackToViewportRangeArgs, OnRowDetailAsyncEndUpdateArgs, OnRowDetailAsyncResponseArgs, OnRowOutOfViewportRangeArgs, RowDetailViewOption, UsabilityOverrideFn } from '../models/index.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * A plugin to add row detail panel
 * Original StackOverflow question & article making this possible (thanks to violet313)
 * https://stackoverflow.com/questions/10535164/can-slickgrids-row-height-be-dynamically-altered#29399927
 * http://violet313.org/slickgrids/#intro
 *
 * USAGE:
 * Add the slick.rowDetailView.(js|css) files and register the plugin with the grid.
 *
 * AVAILABLE ROW DETAIL OPTIONS:
 *    cssClass:               A CSS class to be added to the row detail
 *    expandedClass:          Extra classes to be added to the expanded Toggle
 *    expandableOverride:     callback method that user can override the default behavior of making every row an expandable row (the logic to show or not the expandable icon).
 *    collapsedClass:         Extra classes to be added to the collapse Toggle
 *    loadOnce:               Defaults to false, when set to True it will load the data once and then reuse it.
 *    preTemplate:            Template that will be used before the async process (typically used to show a spinner/loading)
 *    postTemplate:           Template that will be loaded once the async function finishes
 *    process:                Async server function call
 *    panelRows:              Row count to use for the template panel
 *    singleRowExpand:        Defaults to false, limit expanded row to 1 at a time.
 *    useRowClick:            Boolean flag, when True will open the row detail on a row click (from any column), default to False
 *    keyPrefix:              Defaults to '_', prefix used for all the plugin metadata added to the item object (meta e.g.: padding, collapsed, parent)
 *    collapseAllOnSort:      Defaults to true, which will collapse all row detail views when user calls a sort. Unless user implements a sort to deal with padding
 *    saveDetailViewOnScroll: Defaults to true, which will save the row detail view in a cache when it detects that it will become out of the viewport buffer
 *    useSimpleViewportCalc:  Defaults to false, which will use simplified calculation of out or back of viewport visibility
 *
 * AVAILABLE PUBLIC METHODS:
 *    init:                 initiliaze the plugin
 *    expandableOverride:   callback method that user can override the default behavior of making every row an expandable row (the logic to show or not the expandable icon).
 *    destroy:              destroy the plugin and it's events
 *    collapseAll:          collapse all opened row detail panel
 *    collapseDetailView:   collapse a row by passing the item object (row detail)
 *    expandDetailView:     expand a row by passing the item object (row detail)
 *    getColumnDefinition:  get the column definitions
 *    getExpandedRows:      get all the expanded rows
 *    getFilterItem:        takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on
 *    getOptions:           get current plugin options
 *    resizeDetailView:     resize a row detail view, it will auto-calculate the number of rows it needs
 *    saveDetailView:       save a row detail view content by passing the row object
 *    setOptions:           set or change some of the plugin options
 *
 * THE PLUGIN EXPOSES THE FOLLOWING SLICK EVENTS:
 *    onAsyncResponse:  This event must be used with the "notify" by the end user once the Asynchronous Server call returns the item detail
 *      Event args:
 *        item:         Item detail returned from the async server call
 *        detailView:   An explicit view to use instead of template (Optional)
 *
 *    onAsyncEndUpdate: Fired when the async response finished
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onBeforeRowDetailToggle: Fired before the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onAfterRowDetailToggle: Fired after the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        expandedRows: Array of the Expanded Rows
 *
 *    onRowOutOfViewportRange: Fired after a row becomes out of viewport range (user can't see the row anymore)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowId:        Id of the Row object (datacontext) in the Grid
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        rowIdsOutOfViewport: Array of the Out of viewport Range Rows
 *
 *    onRowBackToViewportRange: Fired after a row is back to viewport range (user can visually see the row detail)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowId:        Id of the Row object (datacontext) in the Grid
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        rowIdsOutOfViewport: Array of the Out of viewport Range Rows
 */
export declare class SlickRowDetailView {
    pluginName: "RowDetailView";
    onAsyncResponse: SlickEvent_<OnRowDetailAsyncResponseArgs>;
    onAsyncEndUpdate: SlickEvent_<OnRowDetailAsyncEndUpdateArgs>;
    onAfterRowDetailToggle: SlickEvent_<OnAfterRowDetailToggleArgs>;
    onBeforeRowDetailToggle: SlickEvent_<OnBeforeRowDetailToggleArgs>;
    onRowBackToViewportRange: SlickEvent_<OnRowBackToViewportRangeArgs>;
    onRowOutOfViewportRange: SlickEvent_<OnRowOutOfViewportRangeArgs>;
    protected _grid: SlickGrid;
    protected _gridOptions: GridOption;
    protected _gridUid: string;
    protected _dataView: SlickDataView;
    protected _dataViewIdProperty: string;
    protected _expandableOverride: UsabilityOverrideFn | null;
    protected _lastRange: {
        bottom: number;
        top: number;
    } | null;
    protected _expandedRows: any[];
    protected _eventHandler: SlickEventHandler_;
    protected _outsideRange: number;
    protected _visibleRenderedCellCount: number;
    protected _options: RowDetailViewOption;
    protected _defaults: RowDetailViewOption;
    protected _keyPrefix: string | undefined;
    protected _gridRowBuffer: number;
    protected _rowIdsOutOfViewport: Array<number | string>;
    /** Constructor of the Row Detail View Plugin which accepts optional options */
    constructor(options: RowDetailViewOption);
    /**
     * Initialize the plugin, which requires user to pass the SlickGrid Grid object
     * @param grid: SlickGrid Grid object
     */
    init(grid: SlickGrid): void;
    /** destroy the plugin and it's events */
    destroy(): void;
    /** Get current plugin options */
    getOptions(): RowDetailViewOption;
    /** set or change some of the plugin options */
    setOptions(options: Partial<RowDetailViewOption>): void;
    /** Find a value in an array and return the index when (or -1 when not found) */
    protected arrayFindIndex(sourceArray: any[], value: any): number;
    /** Handle mouse click event */
    protected handleClick(e: SlickEventData, args: {
        row: number;
        cell: number;
    }): void;
    /** If we scroll save detail views that go out of cache range */
    protected handleScroll(): void;
    /** Calculate when expanded rows become out of view range */
    protected calculateOutOfRangeViews(): void;
    /** This is an alternative & more simpler version of the Calculate when expanded rows become out of view range */
    protected calculateOutOfRangeViewsSimplerVersion(): void;
    /**
     * Check if the row became out of visible range (when user can't see it anymore)
     * @param rowIndex
     * @param renderedRange from SlickGrid
     */
    protected checkIsRowOutOfViewportRange(rowIndex: number, renderedRange: any): boolean;
    /** Send a notification, through "onRowOutOfViewportRange", that is out of the viewport range */
    protected notifyOutOfViewport(item: any, rowId: number | string): void;
    /** Send a notification, through "onRowBackToViewportRange", that a row came back into the viewport visible range */
    protected notifyBackToViewportWhenDomExist(item: any, rowId: number | string): void;
    /**
     * This function will sync the "out of viewport" array whenever necessary.
     * The sync can add a detail row (when necessary, no need to add again if it already exist) or delete a row from the array.
     * @param rowId: number
     * @param isAdding: are we adding or removing a row?
     */
    protected syncOutOfViewportArray(rowId: number | string, isAdding: boolean): (string | number)[];
    protected toggleRowSelection(rowNumber: number, dataContext: any): void;
    /** Collapse all of the open detail rows */
    collapseAll(): void;
    /** Collapse a detail row so that it is not longer open */
    collapseDetailView(item: any, isMultipleCollapsing?: boolean): void;
    /** Expand a detail row by providing the dataview item that is to be expanded */
    expandDetailView(item: any): void;
    /** Saves the current state of the detail view */
    saveDetailView(item: any): void;
    /**
     * subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
     * the response has to be as "args.item" (or "args.itemDetail") with it's data back
     */
    protected subscribeToOnAsyncResponse(): void;
    /** When row is getting toggled, we will handle the action of collapsing/expanding */
    protected handleAccordionShowHide(item: any): void;
    /** Get the Row Detail padding (which are the rows dedicated to the detail panel) */
    protected getPaddingItem(parent: any, offset: any): any;
    /** Create the detail ctr node. this belongs to the dev & can be custom-styled as per */
    protected applyTemplateNewLineHeight(item: any): void;
    /** Get the Column Definition of the first column dedicated to toggling the Row Detail View */
    getColumnDefinition(): {
        id: string | undefined;
        name: string;
        reorderable: boolean | undefined;
        toolTip: string | undefined;
        field: string;
        width: number | undefined;
        resizable: boolean;
        sortable: boolean;
        alwaysRenderColumn: boolean | undefined;
        cssClass: string | undefined;
        formatter: (row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid) => FormatterResultWithHtml | HTMLElement | "";
    };
    /** Return the currently expanded rows */
    getExpandedRows(): any[];
    /** The cell Formatter that shows the icon that will be used to toggle the Row Detail */
    protected detailSelectionFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultWithHtml | HTMLElement | '';
    /** Resize the Row Detail View */
    resizeDetailView(item: any): void;
    /** Takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on */
    getFilterItem(item: any): any;
    protected checkExpandableOverride(row: number, dataContext: any, grid: SlickGrid): boolean;
    /**
     * Method that user can pass to override the default behavior or making every row an expandable row.
     * In order word, user can choose which rows to be an available row detail (or not) by providing his own logic.
     * @param overrideFn: override function callback
     */
    expandableOverride(overrideFn: UsabilityOverrideFn): void;
}
//# sourceMappingURL=slick.rowdetailview.d.ts.map