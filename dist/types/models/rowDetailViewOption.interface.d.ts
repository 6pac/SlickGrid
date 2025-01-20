import type { UsabilityOverrideFn } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface RowDetailViewOption {
    /** Defaults to True, do we always render/reRender the column */
    alwaysRenderColumn?: boolean;
    /** Defaults to true, which will collapse all row detail views when user calls a sort. Unless user implements a sort to deal with padding */
    collapseAllOnSort?: boolean;
    /** Extra classes to be added to the collapse Toggle */
    collapsedClass?: string;
    /** Defaults to "_detail_selector", Row Detail column Id */
    columnId?: string;
    /**
     * Defaults to 0, the column index position in the grid by default it will show as the first column (index 0).
     * Also note that the index position might vary if you use other extensions, after each extension is created,
     * it will add an offset to take into consideration (1.CheckboxSelector, 2.RowDetail, 3.RowMove)
     */
    columnIndexPosition?: number;
    /** A CSS class to be added to the row detail */
    cssClass?: string;
    /** Extra classes to be added to the expanded Toggle */
    expandedClass?: string;
    /** Defaults to '_', prefix used for all the plugin metadata added to the item object (meta e.g.: padding, collapsed, parent) */
    keyPrefix?: string;
    /** Defaults to false, when True will load the data once and then reuse it. */
    loadOnce?: boolean;
    /** Defaults to null, do we want to defined a maximum number of rows to show. */
    maxRows?: number;
    /**
     * How many grid rows do we want to use for the detail panel view
     * also note that the detail view adds an extra 1 row for padding purposes
     * so if you choose 4 panelRows, the display will in fact use 5 rows
     */
    panelRows: number;
    /**
     * Optionally pass your Parent Component reference to your Child Component (row detail component).
     * note:: If anyone finds a better way of passing the parent to the row detail extension, please reach out and/or create a PR
     */
    parent?: any;
    /** Defaults to false, makes the column reorderable to another position in the grid. */
    reorderable?: boolean;
    /** Defaults to false, when True will open the row detail on a row click (from any column) */
    useRowClick?: boolean;
    /** Defaults to true, which will save the row detail view in a cache when it detects that it will become out of the viewport buffer */
    saveDetailViewOnScroll?: boolean;
    /** Defaults to false, which will limit expanded row to only 1 at a time (it will close all other rows before opening new one). */
    singleRowExpand?: boolean;
    /** Defaults to false, which will use a simpler way of calculating when rows become out (or back) of viewport range. */
    useSimpleViewportCalc?: boolean;
    /** no defaults, show a tooltip text while hovering the row detail icon */
    toolTip?: string;
    /** no defaults, width of the icon column */
    width?: number;
    /**
     * HTML Preload Template that will be used before the async process (typically used to show a spinner/loading)
     * It's preferable to use the "preloadView" property to use a framework View instead of plain HTML.
     * If you still wish to use these methods, we strongly suggest you to sanitize your HTML, e.g. "DOMPurify.sanitize()"
     */
    preTemplate?: (item?: any) => string;
    /**
     * HTML Post Template (when Row Detail data is available) that will be loaded once the async function finishes
     * It's preferable to use the "preloadView" property to use a framework View instead of plain HTML
     * If you still wish to use these methods, we strongly suggest you to sanitize your HTML, e.g. "DOMPurify.sanitize()"
     */
    postTemplate?: (item: any) => string;
    /** Async server function call */
    process: (item: any) => Promise<any>;
    /** Override the logic for showing (or not) the expand icon (use case example: only every 2nd row is expandable) */
    expandableOverride?: UsabilityOverrideFn;
}
/** This event must be used with the "notify" by the end user once the Asynchronous Server call returns the item detail */
export interface OnRowDetailAsyncResponseArgs {
    /** Item data context object */
    item: any;
    /** @alias `item` */
    itemDetail: any;
    /** An explicit view to use instead of template (Optional) */
    detailView?: any;
    /** SlickGrid instance */
    grid?: SlickGrid;
}
/** Fired when the async response finished */
export interface OnRowDetailAsyncEndUpdateArgs {
    /** Item data context object */
    item: any;
    /** @alias `item` */
    itemDetail: any;
    /** Reference to the Slick grid object */
    grid?: SlickGrid;
}
/** Fired after the row detail gets toggled */
export interface OnAfterRowDetailToggleArgs {
    /** Item data context object */
    item: any;
    /** Array of the Expanded Row Ids */
    expandedRows: Array<number | string>;
    /** Reference to the Slick grid object */
    grid: SlickGrid;
}
/** Fired before the row detail gets toggled */
export interface OnBeforeRowDetailToggleArgs {
    /** Item data context object */
    item: any;
    /** Reference to the Slick grid object */
    grid: SlickGrid;
}
/** Fired after the row detail gets toggled */
export interface OnRowBackToViewportRangeArgs {
    /** Item data context object */
    item: any;
    /** Id of the Row object (datacontext) in the Grid */
    rowId: string | number;
    /** Index of the Row in the Grid */
    rowIndex: number;
    /** Array of the Expanded Row Ids */
    expandedRows: Array<string | number>;
    /** Array of the Out of viewport Range Rows */
    rowIdsOutOfViewport: Array<string | number>;
    /** Reference to the Slick grid object */
    grid: SlickGrid;
}
/** Fired after a row becomes out of viewport range (user can't see the row anymore) */
export interface OnRowOutOfViewportRangeArgs {
    /** Item data context object */
    item: any;
    /** Id of the Row object (datacontext) in the Grid */
    rowId: string | number;
    /** Index of the Row in the Grid */
    rowIndex: number;
    /** Array of the Expanded Row Ids */
    expandedRows: Array<string | number>;
    /** Array of the Out of viewport Range Rows */
    rowIdsOutOfViewport: Array<string | number>;
    /** Reference to the Slick grid object */
    grid: SlickGrid;
}
//# sourceMappingURL=rowDetailViewOption.interface.d.ts.map