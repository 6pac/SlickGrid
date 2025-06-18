import type { Aggregator, CustomDataView, DataViewHints, Grouping, ItemMetadata, ItemMetadataProvider, OnGroupCollapsedEventArgs, OnGroupExpandedEventArgs, OnRowCountChangedEventArgs, OnRowsChangedEventArgs, OnRowsOrCountChangedEventArgs, OnSelectedRowIdsChangedEventArgs, OnSetItemsCalledEventArgs, PagingInfo, SlickGridModel } from './models/index.js';
import { type BasePubSub, SlickEvent as SlickEvent_, SlickGroup as SlickGroup_, SlickGroupTotals as SlickGroupTotals_, type SlickNonDataItem } from './slick.core.js';
import { SlickGroupItemMetadataProvider as SlickGroupItemMetadataProvider_ } from './slick.groupitemmetadataprovider.js';
export interface DataViewOption {
    /** global override for all rows */
    globalItemMetadataProvider: ItemMetadataProvider | null;
    /** Optionally provide a GroupItemMetadataProvider in order to use Grouping/DraggableGrouping features */
    groupItemMetadataProvider: SlickGroupItemMetadataProvider_ | null;
    /** defaults to false, are we using inline filters? */
    inlineFilters: boolean;
    /**
     * defaults to false, option to use CSP Safe approach,
     * Note: it is an opt-in option because it is slightly slower (perf impact) when compared to the non-CSP safe approach.
     */
    useCSPSafeFilter: boolean;
}
export type FilterFn<T> = (item: T, args: any) => boolean;
export type FilterCspFn<T> = (item: T[], args: any) => T[];
export type FilterWithCspCachingFn<T> = (item: T[], args: any, filterCache: any[]) => T[];
export type DataIdType = number | string;
export type SlickDataItem = SlickNonDataItem | SlickGroup_ | SlickGroupTotals_ | any;
export type GroupGetterFn = (val: any) => string | number;
/**
  * A simple Model implementation.
  * Provides a filtered view of the underlying data.
  * Relies on the data item having an "id" property uniquely identifying it.
  */
export declare class SlickDataView<TData extends SlickDataItem = any> implements CustomDataView {
    protected externalPubSub?: BasePubSub | undefined;
    protected defaults: DataViewOption;
    protected idProperty: string;
    protected items: TData[];
    protected rows: TData[];
    protected idxById: Map<DataIdType, number>;
    protected rowsById: {
        [id: DataIdType]: number;
    } | undefined;
    protected filter: FilterFn<TData> | null;
    protected filterCSPSafe: FilterFn<TData> | null;
    protected updated: ({
        [id: DataIdType]: boolean;
    }) | null;
    protected suspend: boolean;
    protected isBulkSuspend: boolean;
    protected bulkDeleteIds: Map<DataIdType, boolean>;
    protected sortAsc: boolean | undefined;
    protected fastSortField?: string | null | (() => string);
    protected sortComparer: ((a: TData, b: TData) => number);
    protected refreshHints: DataViewHints;
    protected prevRefreshHints: DataViewHints;
    protected filterArgs: any;
    protected filteredItems: TData[];
    protected compiledFilter?: FilterFn<TData> | null;
    protected compiledFilterCSPSafe?: FilterCspFn<TData> | null;
    protected compiledFilterWithCaching?: FilterFn<TData> | null;
    protected compiledFilterWithCachingCSPSafe?: FilterWithCspCachingFn<TData> | null;
    protected filterCache: any[];
    protected _grid?: SlickGridModel;
    protected groupingInfoDefaults: Grouping;
    protected groupingInfos: Array<Grouping & {
        aggregators: Aggregator[];
        getterIsAFn?: boolean;
        compiledAccumulators: any[];
        getter: GroupGetterFn | string;
    }>;
    protected groups: SlickGroup_[];
    protected toggledGroupsByLevel: any[];
    protected groupingDelimiter: string;
    protected selectedRowIds: DataIdType[];
    protected preSelectedRowIdsChangeFn?: (args?: any) => void;
    protected pagesize: number;
    protected pagenum: number;
    protected totalRows: number;
    protected _options: DataViewOption;
    protected _container?: HTMLElement;
    onBeforePagingInfoChanged: SlickEvent_<PagingInfo>;
    onGroupExpanded: SlickEvent_<OnGroupExpandedEventArgs>;
    onGroupCollapsed: SlickEvent_<OnGroupCollapsedEventArgs>;
    onPagingInfoChanged: SlickEvent_<PagingInfo>;
    onRowCountChanged: SlickEvent_<OnRowCountChangedEventArgs>;
    onRowsChanged: SlickEvent_<OnRowsChangedEventArgs>;
    onRowsOrCountChanged: SlickEvent_<OnRowsOrCountChangedEventArgs>;
    onSelectedRowIdsChanged: SlickEvent_<OnSelectedRowIdsChangedEventArgs>;
    onSetItemsCalled: SlickEvent_<OnSetItemsCalledEventArgs>;
    constructor(options?: Partial<DataViewOption>, externalPubSub?: BasePubSub | undefined);
    /**
     * Begins a bached update of the items in the data view.
     * including deletes and the related events are postponed to the endUpdate call.
     * As certain operations are postponed during this update, some methods might not
     * deliver fully consistent information.
     * @param {Boolean} [bulkUpdate] - if set to true, most data view modifications
     */
    beginUpdate(bulkUpdate?: boolean): void;
    endUpdate(): void;
    destroy(): void;
    /** provide some refresh hints as to what to rows needs refresh */
    setRefreshHints(hints: DataViewHints): void;
    /** get extra filter arguments of the filter method */
    getFilterArgs(): any;
    /** add extra filter arguments to the filter method */
    setFilterArgs(args: any): void;
    /**
     * Processes all delete requests placed during bulk update
     * by recomputing the items and idxById members.
     */
    protected processBulkDelete(): void;
    protected updateIdxById(startingIndex?: number): void;
    protected ensureIdUniqueness(): void;
    /** Get all DataView Items */
    getItems(): TData[];
    /** Get the DataView Id property name to use (defaults to "Id" but could be customized to something else when instantiating the DataView) */
    getIdPropertyName(): string;
    /**
     * Set the Items with a new Dataset and optionally pass a different Id property name
     * @param {Array<*>} data - array of data
     * @param {String} [objectIdProperty] - optional id property to use as primary id
     */
    setItems(data: TData[], objectIdProperty?: string): void;
    /** Set Paging Options */
    setPagingOptions(args: Partial<PagingInfo>): void;
    /** Get Paging Options */
    getPagingInfo(): PagingInfo;
    /** Sort Method to use by the DataView */
    sort(comparer: (a: TData, b: TData) => number, ascending?: boolean): void;
    /**
     * @deprecated, to be more removed in next major since IE is no longer supported and this is no longer useful.
     * Provides a workaround for the extremely slow sorting in IE.
     * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
     * to return the value of that field and then doing a native Array.sort().
     */
    fastSort(field: string | (() => string), ascending?: boolean): void;
    /** Re-Sort the dataset */
    reSort(): void;
    /** Get only the DataView filtered items */
    getFilteredItems<T extends TData>(): T[];
    /** Get the array length (count) of only the DataView filtered items */
    getFilteredItemCount(): number;
    /** Get current Filter used by the DataView */
    getFilter(): FilterFn<TData> | null;
    /**
     * Set a Filter that will be used by the DataView
     * @param {Function} fn - filter callback function
     */
    setFilter(filterFn: FilterFn<TData>): void;
    /** Get current Grouping info */
    getGrouping(): Grouping[];
    /** Set some Grouping */
    setGrouping(groupingInfo: Grouping | Grouping[]): void;
    /** Get an item in the DataView by its row index */
    getItemByIdx<T extends TData>(i: number): T;
    /** Get row index in the DataView by its Id */
    getIdxById(id: DataIdType): number | undefined;
    protected ensureRowsByIdCache(): void;
    /** Get row number in the grid by its item object */
    getRowByItem(item: TData): number | undefined;
    /** Get row number in the grid by its Id */
    getRowById(id: DataIdType): number | undefined;
    /** Get an item in the DataView by its Id */
    getItemById<T extends TData>(id: DataIdType): T;
    /** From the items array provided, return the mapped rows */
    mapItemsToRows(itemArray: TData[]): number[];
    /** From the Ids array provided, return the mapped rows */
    mapIdsToRows(idArray: DataIdType[]): number[];
    /** From the rows array provided, return the mapped Ids */
    mapRowsToIds(rowArray: number[]): DataIdType[];
    /**
     * Performs the update operations of a single item by id without
     * triggering any events or refresh operations.
     * @param id The new id of the item.
     * @param item The item which should be the new value for the given id.
     */
    updateSingleItem(id: DataIdType, item: TData): void;
    /**
     * Updates a single item in the data view given the id and new value.
     * @param id The new id of the item.
     * @param item The item which should be the new value for the given id.
     */
    updateItem<T extends TData>(id: DataIdType, item: T): void;
    /**
     * Updates multiple items in the data view given the new ids and new values.
     * @param id {Array} The array of new ids which is in the same order as the items.
     * @param newItems {Array} The new items that should be set in the data view for the given ids.
     */
    updateItems<T extends TData>(ids: DataIdType[], newItems: T[]): void;
    /**
     * Inserts a single item into the data view at the given position.
     * @param insertBefore {Number} The 0-based index before which the item should be inserted.
     * @param item The item to insert.
     */
    insertItem(insertBefore: number, item: TData): void;
    /**
     * Inserts multiple items into the data view at the given position.
     * @param insertBefore {Number} The 0-based index before which the items should be inserted.
     * @param newItems {Array}  The items to insert.
     */
    insertItems(insertBefore: number, newItems: TData[]): void;
    /**
     * Adds a single item at the end of the data view.
     * @param item The item to add at the end.
     */
    addItem(item: TData): void;
    /**
     * Adds multiple items at the end of the data view.
     * @param {Array} newItems The items to add at the end.
     */
    addItems(newItems: TData[]): void;
    /**
     * Deletes a single item identified by the given id from the data view.
     * @param {String|Number} id The id identifying the object to delete.
     */
    deleteItem(id: DataIdType): void;
    /**
     * Deletes multiple item identified by the given ids from the data view.
     * @param {Array} ids The ids of the items to delete.
     */
    deleteItems(ids: DataIdType[]): void;
    /** Add an item in a sorted dataset (a Sort function must be defined) */
    sortedAddItem(item: TData): void;
    /** Update an item in a sorted dataset (a Sort function must be defined) */
    sortedUpdateItem(id: string | number, item: TData): void;
    protected sortedIndex(searchItem: TData): number;
    /** Get item count, that is the full dataset lenght of the DataView */
    getItemCount(): number;
    /** Get row count (rows displayed in current page) */
    getLength(): number;
    /** Retrieve an item from the DataView at specific index */
    getItem<T extends TData>(i: number): T;
    getItemMetadata(row: number): ItemMetadata | null;
    protected expandCollapseAllGroups(level?: number, collapse?: boolean): void;
    /**
     * @param {Number} [level] Optional level to collapse.  If not specified, applies to all levels.
     */
    collapseAllGroups(level?: number): void;
    /**
     * @param {Number} [level] Optional level to expand.  If not specified, applies to all levels.
     */
    expandAllGroups(level?: number): void;
    expandCollapseGroup(level: number, groupingKey: string, collapse?: boolean): void;
    /**
     * @param varArgs Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
     *     the 'high' group.
     */
    collapseGroup(...args: any): void;
    /**
     * @param varArgs Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
     *     the 'high' group.
     */
    expandGroup(...args: any): void;
    getGroups(): SlickGroup_[];
    protected extractGroups(rows: any[], parentGroup?: SlickGroup_): SlickGroup_[];
    /** claculate Group Totals */
    protected calculateTotals(totals: SlickGroupTotals_): void;
    protected addGroupTotals(group: SlickGroup_): void;
    protected addTotals(groups: SlickGroup_[], level?: number): void;
    protected flattenGroupedRows(groups: SlickGroup_[], level?: number): any[];
    protected compileAccumulatorLoopCSPSafe(aggregator: Aggregator): (items: any[]) => void;
    protected compileFilterCSPSafe(items: TData[], args: any): TData[];
    protected compileFilter(stopRunningIfCSPSafeIsActive?: boolean): FilterFn<TData> | null;
    protected compileFilterWithCaching(stopRunningIfCSPSafeIsActive?: boolean): any;
    protected compileFilterWithCachingCSPSafe(items: TData[], args: any, filterCache: any[]): TData[];
    /**
     * In ES5 we could set the function name on the fly but in ES6 this is forbidden and we need to set it through differently
     * We can use Object.defineProperty and set it the property to writable, see MDN for reference
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     * @param {*} fn
     * @param {string} fnName
     */
    protected setFunctionName(fn: any, fnName: string): void;
    protected uncompiledFilter(items: TData[], args: any): any[];
    protected uncompiledFilterWithCaching(items: TData[], args: any, cache: any): any[];
    protected getFilteredAndPagedItems(items: TData[]): {
        totalRows: number;
        rows: TData[];
    };
    protected getRowDiffs(rows: TData[], newRows: TData[]): number[];
    protected recalc(_items: TData[]): number[];
    refresh(): void;
    /**
     * Wires the grid and the DataView together to keep row selection tied to item ids.
     * This is useful since, without it, the grid only knows about rows, so if the items
     * move around, the same rows stay selected instead of the selection moving along
     * with the items.
     *
     * NOTE:  This doesn't work with cell selection model.
     *
     * @param {SlickGrid} grid - The grid to sync selection with.
     * @param {Boolean} preserveHidden - Whether to keep selected items that go out of the
     *     view due to them getting filtered out.
     * @param {Boolean} [preserveHiddenOnSelectionChange] - Whether to keep selected items
     *     that are currently out of the view (see preserveHidden) as selected when selection
     *     changes.
     * @return {Event} An event that notifies when an internal list of selected row ids
     *     changes.  This is useful since, in combination with the above two options, it allows
     *     access to the full list selected row ids, and not just the ones visible to the grid.
     * @method syncGridSelection
     */
    syncGridSelection(grid: SlickGridModel, preserveHidden: boolean, preserveHiddenOnSelectionChange?: boolean): SlickEvent_<OnSelectedRowIdsChangedEventArgs>;
    /**
     * Get all selected IDs
     * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
     */
    getAllSelectedIds(): DataIdType[];
    /**
     * Get all selected filtered IDs (similar to "getAllSelectedIds" but only return filtered data)
     * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
     */
    getAllSelectedFilteredIds(): TData[keyof TData][];
    /**
     * Set current row selected IDs array (regardless of Pagination)
     * NOTE: This will NOT change the selection in the grid, if you need to do that then you still need to call
     * "grid.setSelectedRows(rows)"
     * @param {Array} selectedIds - list of IDs which have been selected for this action
     * @param {Object} options
     *  - `isRowBeingAdded`: defaults to true, are the new selected IDs being added (or removed) as new row selections
     *  - `shouldTriggerEvent`: defaults to true, should we trigger `onSelectedRowIdsChanged` event
     *  - `applyRowSelectionToGrid`: defaults to true, should we apply the row selections to the grid in the UI
     */
    setSelectedIds(selectedIds: Array<number | string>, options?: Partial<{
        isRowBeingAdded: boolean;
        shouldTriggerEvent: boolean;
        applyRowSelectionToGrid: boolean;
    }>): void;
    /**
     * Get all selected dataContext items
     * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
     */
    getAllSelectedItems<T extends TData>(): T[];
    /**
    * Get all selected filtered dataContext items (similar to "getAllSelectedItems" but only return filtered data)
    * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
    */
    getAllSelectedFilteredItems<T extends TData>(): T[];
    syncGridCellCssStyles(grid: SlickGridModel, key: string): void;
}
export declare class AvgAggregator<T = any> implements Aggregator {
    private _nonNullCount;
    private _sum;
    private _field;
    private _type;
    constructor(field: number | string);
    get field(): number | string;
    get type(): string;
    init(): void;
    accumulate(item: T): void;
    storeResult(groupTotals: SlickGroupTotals_ & {
        avg: Record<number | string, number>;
    }): void;
}
export declare class MinAggregator<T = any> implements Aggregator {
    private _min;
    private _field;
    private _type;
    constructor(field: number | string);
    get field(): number | string;
    get type(): string;
    init(): void;
    accumulate(item: T): void;
    storeResult(groupTotals: SlickGroupTotals_ & {
        min: Record<number | string, number | null>;
    }): void;
}
export declare class MaxAggregator<T = any> implements Aggregator {
    private _max;
    private _field;
    private _type;
    constructor(field: number | string);
    get field(): number | string;
    get type(): string;
    init(): void;
    accumulate(item: T): void;
    storeResult(groupTotals: SlickGroupTotals_ & {
        max: Record<number | string, number | null>;
    }): void;
}
export declare class SumAggregator<T = any> implements Aggregator {
    private _sum;
    private _field;
    private _type;
    constructor(field: number | string);
    get field(): number | string;
    get type(): string;
    init(): void;
    accumulate(item: T): void;
    storeResult(groupTotals: SlickGroupTotals_ & {
        sum: Record<number | string, number>;
    }): void;
}
export declare class CountAggregator implements Aggregator {
    private _field;
    private _type;
    constructor(field: number | string);
    get field(): number | string;
    get type(): string;
    init(): void;
    storeResult(groupTotals: SlickGroupTotals_ & {
        count: Record<number | string, number>;
    }): void;
}
export declare const Aggregators: {
    Avg: typeof AvgAggregator;
    Min: typeof MinAggregator;
    Max: typeof MaxAggregator;
    Sum: typeof SumAggregator;
    Count: typeof CountAggregator;
};
//# sourceMappingURL=slick.dataview.d.ts.map