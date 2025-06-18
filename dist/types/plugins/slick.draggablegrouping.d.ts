import type { SortableInstance } from 'sortablejs';
import type { Column, DraggableGroupingOption, Grouping, GroupingGetterFunction } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 *
 * Draggable Grouping contributed by:  Muthukumar Selvarasu
 *  muthukumar{dot}se{at}gmail{dot}com
 *  github.com/muthukumarse/Slickgrid
 *
 * NOTES:
 *     This plugin provides the Draggable Grouping feature which could be located in either the Top-Header or the Pre-Header
 * A plugin to add Draggable Grouping feature.
 *
 * USAGE:
 *
 * Add the plugin .js & .css files and register it with the grid.
 *
 *
 * The plugin expose the following methods:
 *    destroy: used to destroy the plugin
 *    setDroppedGroups: provide option to set default grouping on loading
 *    clearDroppedGroups: provide option to clear grouping
 *    getSetupColumnReorder: its function to setup draggable feature agains Header Column, should be passed on grid option. Also possible to pass custom function
 *
 *
 * The plugin expose the following event(s):
 *    onGroupChanged: pass the grouped columns to who subscribed.
 *
 */
export declare class SlickDraggableGrouping {
    pluginName: "DraggableGrouping";
    onGroupChanged: SlickEvent_<{
        caller?: string;
        groupColumns: Grouping[];
    }>;
    protected _grid: SlickGrid;
    protected _gridUid: string;
    protected _gridColumns: Column[];
    protected _dataView: SlickDataView;
    protected _dropzoneElm: HTMLDivElement;
    protected _droppableInstance?: SortableInstance;
    protected _dropzonePlaceholder: HTMLDivElement;
    protected _groupToggler?: HTMLDivElement;
    protected _isInitialized: boolean;
    protected _options: DraggableGroupingOption;
    protected _defaults: DraggableGroupingOption;
    protected _bindingEventService: BindingEventService_;
    protected _handler: SlickEventHandler_;
    protected _sortableLeftInstance?: SortableInstance;
    protected _sortableRightInstance?: SortableInstance;
    protected _columnsGroupBy: Column[];
    /**
     * @param options {Object} Options:
     *    deleteIconCssClass:  an extra CSS class to add to the delete button (default undefined), if deleteIconCssClass && deleteIconImage undefined then slick-groupby-remove-image class will be added
     *    deleteIconImage:     a url to the delete button image (default undefined)
     *    groupIconCssClass:   an extra CSS class to add to the grouping field hint  (default undefined)
     *    groupIconImage:      a url to the grouping field hint image (default undefined)
     *    dropPlaceHolderText:      option to specify set own placeholder note text
     */
    constructor(options: Partial<DraggableGroupingOption>);
    /**
     * Initialize plugin.
     */
    init(grid: SlickGrid): void;
    /**
     * Setup the column reordering
     * NOTE: this function is a standalone function and is called externally and does not have access to `this` instance
     * @param grid - slick grid object
     * @param headers - slick grid column header elements
     * @param _headerColumnWidthDiff - header column width difference
     * @param setColumns - callback to reassign columns
     * @param setupColumnResize - callback to setup the column resize
     * @param columns - columns array
     * @param getColumnIndex - callback to find index of a column
     * @param uid - grid UID
     * @param trigger - callback to execute when triggering a column grouping
     */
    getSetupColumnReorder(grid: SlickGrid, headers: any, _headerColumnWidthDiff: any, setColumns: (columns: Column[]) => void, setupColumnResize: () => void, _columns: Column[], getColumnIndex: (columnId: string) => number, _uid: string, trigger: (slickEvent: SlickEvent_, data?: any) => void): {
        sortableLeftInstance: any;
        sortableRightInstance: any;
    };
    /**
     * Destroy plugin.
     */
    destroy(): void;
    protected destroySortableInstances(): void;
    protected addDragOverDropzoneListeners(): void;
    protected setupColumnDropbox(): void;
    protected handleGroupByDrop(containerElm: HTMLDivElement, headerColumnElm: HTMLDivElement): void;
    protected addColumnGroupBy(column: Column): void;
    protected addGroupByRemoveClickHandler(id: string | number, groupRemoveIconElm: HTMLDivElement, headerColumnElm: HTMLDivElement, entry: any): void;
    setDroppedGroups(groupingInfo: Array<string | GroupingGetterFunction> | string): void;
    clearDroppedGroups(): void;
    protected removeFromArray(arrayToModify: any[], itemToRemove: any): any[];
    protected removeGroupBy(id: string | number, _hdrColumnElm: HTMLDivElement, entry: any): void;
    protected toggleGroupToggler(targetElm: Element | null, collapsing?: boolean, shouldExecuteDataViewCommand?: boolean): void;
    protected updateGroupBy(originator: string): void;
}
//# sourceMappingURL=slick.draggablegrouping.d.ts.map