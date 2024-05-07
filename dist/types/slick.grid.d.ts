import type SortableInstance from 'sortablejs';
import type { AutoSize, CellViewportRange, Column, ColumnSort, CssStyleHash, CustomDataView, DOMEvent, DragPosition, DragRowMove, Editor, EditorConstructor, EditController, Formatter, FormatterResultWithHtml, FormatterResultWithText, GridOption as BaseGridOption, InteractionBase, MultiColumnSort, OnActiveCellChangedEventArgs, OnAddNewRowEventArgs, OnAutosizeColumnsEventArgs, OnBeforeUpdateColumnsEventArgs, OnBeforeAppendCellEventArgs, OnBeforeCellEditorDestroyEventArgs, OnBeforeColumnsResizeEventArgs, OnBeforeEditCellEventArgs, OnBeforeHeaderCellDestroyEventArgs, OnBeforeHeaderRowCellDestroyEventArgs, OnBeforeFooterRowCellDestroyEventArgs, OnBeforeSetColumnsEventArgs, OnCellChangeEventArgs, OnCellCssStylesChangedEventArgs, OnColumnsDragEventArgs, OnColumnsReorderedEventArgs, OnColumnsResizedEventArgs, OnColumnsResizeDblClickEventArgs, OnCompositeEditorChangeEventArgs, OnDblClickEventArgs, OnFooterContextMenuEventArgs, OnFooterRowCellRenderedEventArgs, OnHeaderCellRenderedEventArgs, OnFooterClickEventArgs, OnHeaderClickEventArgs, OnHeaderContextMenuEventArgs, OnHeaderMouseEventArgs, OnHeaderRowCellRenderedEventArgs, OnKeyDownEventArgs, OnValidationErrorEventArgs, OnRenderedEventArgs, OnSelectedRowsChangedEventArgs, OnSetOptionsEventArgs, OnActivateChangedOptionsEventArgs, OnScrollEventArgs, PagingInfo, RowInfo, SelectionModel, SingleColumnSort, SlickPlugin, MenuCommandItemCallbackArgs, OnClickEventArgs } from './models/index';
import { type BasePubSub, BindingEventService as BindingEventService_, type SlickEditorLock, SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickRange as SlickRange_ } from './slick.core';
/**
 * @license
 * (c) 2009-present Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v5.9.2
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */
interface RowCaching {
    rowNode: HTMLElement[] | null;
    cellColSpans: Array<number | '*'>;
    cellNodesByColumnIdx: HTMLElement[];
    cellRenderQueue: any[];
}
export declare class SlickGrid<TData = any, C extends Column<TData> = Column<TData>, O extends BaseGridOption<C> = BaseGridOption<C>> {
    protected readonly container: HTMLElement | string;
    protected data: CustomDataView<TData> | TData[];
    protected columns: C[];
    protected readonly externalPubSub?: BasePubSub | undefined;
    slickGridVersion: string;
    /** optional grid state clientId */
    cid: string;
    onActiveCellChanged: SlickEvent_<OnActiveCellChangedEventArgs>;
    onActiveCellPositionChanged: SlickEvent_<{
        grid: SlickGrid;
    }>;
    onAddNewRow: SlickEvent_<OnAddNewRowEventArgs>;
    onAutosizeColumns: SlickEvent_<OnAutosizeColumnsEventArgs>;
    onBeforeAppendCell: SlickEvent_<OnBeforeAppendCellEventArgs>;
    onBeforeCellEditorDestroy: SlickEvent_<OnBeforeCellEditorDestroyEventArgs>;
    onBeforeColumnsResize: SlickEvent_<OnBeforeColumnsResizeEventArgs>;
    onBeforeDestroy: SlickEvent_<{
        grid: SlickGrid;
    }>;
    onBeforeEditCell: SlickEvent_<OnBeforeEditCellEventArgs>;
    onBeforeFooterRowCellDestroy: SlickEvent_<OnBeforeFooterRowCellDestroyEventArgs>;
    onBeforeHeaderCellDestroy: SlickEvent_<OnBeforeHeaderCellDestroyEventArgs>;
    onBeforeHeaderRowCellDestroy: SlickEvent_<OnBeforeHeaderRowCellDestroyEventArgs>;
    onBeforeSetColumns: SlickEvent_<OnBeforeSetColumnsEventArgs>;
    onBeforeSort: SlickEvent_<SingleColumnSort | MultiColumnSort>;
    onBeforeUpdateColumns: SlickEvent_<OnBeforeUpdateColumnsEventArgs>;
    onCellChange: SlickEvent_<OnCellChangeEventArgs>;
    onCellCssStylesChanged: SlickEvent_<OnCellCssStylesChangedEventArgs>;
    onClick: SlickEvent_<OnClickEventArgs>;
    onColumnsReordered: SlickEvent_<OnColumnsReorderedEventArgs>;
    onColumnsDrag: SlickEvent_<OnColumnsDragEventArgs>;
    onColumnsResized: SlickEvent_<OnColumnsResizedEventArgs>;
    onColumnsResizeDblClick: SlickEvent_<OnColumnsResizeDblClickEventArgs>;
    onCompositeEditorChange: SlickEvent_<OnCompositeEditorChangeEventArgs>;
    onContextMenu: SlickEvent_<MenuCommandItemCallbackArgs>;
    onDrag: SlickEvent_<DragRowMove>;
    onDblClick: SlickEvent_<OnDblClickEventArgs>;
    onDragInit: SlickEvent_<DragRowMove>;
    onDragStart: SlickEvent_<DragRowMove>;
    onDragEnd: SlickEvent_<DragRowMove>;
    onFooterClick: SlickEvent_<OnFooterClickEventArgs>;
    onFooterContextMenu: SlickEvent_<OnFooterContextMenuEventArgs>;
    onFooterRowCellRendered: SlickEvent_<OnFooterRowCellRenderedEventArgs>;
    onHeaderCellRendered: SlickEvent_<OnHeaderCellRenderedEventArgs>;
    onHeaderClick: SlickEvent_<OnHeaderClickEventArgs>;
    onHeaderContextMenu: SlickEvent_<OnHeaderContextMenuEventArgs>;
    onHeaderMouseEnter: SlickEvent_<OnHeaderMouseEventArgs>;
    onHeaderMouseLeave: SlickEvent_<OnHeaderMouseEventArgs>;
    onHeaderRowCellRendered: SlickEvent_<OnHeaderRowCellRenderedEventArgs>;
    onHeaderRowMouseEnter: SlickEvent_<OnHeaderMouseEventArgs>;
    onHeaderRowMouseLeave: SlickEvent_<OnHeaderMouseEventArgs>;
    onKeyDown: SlickEvent_<OnKeyDownEventArgs>;
    onMouseEnter: SlickEvent_<OnHeaderMouseEventArgs>;
    onMouseLeave: SlickEvent_<OnHeaderMouseEventArgs>;
    onRendered: SlickEvent_<OnRenderedEventArgs>;
    onScroll: SlickEvent_<OnScrollEventArgs>;
    onSelectedRowsChanged: SlickEvent_<OnSelectedRowsChangedEventArgs>;
    onSetOptions: SlickEvent_<OnSetOptionsEventArgs>;
    onActivateChangedOptions: SlickEvent_<OnActivateChangedOptionsEventArgs>;
    onSort: SlickEvent_<SingleColumnSort | MultiColumnSort>;
    onValidationError: SlickEvent_<OnValidationErrorEventArgs>;
    onViewportChanged: SlickEvent_<{
        grid: SlickGrid;
    }>;
    protected scrollbarDimensions?: {
        height: number;
        width: number;
    };
    protected maxSupportedCssHeight: number;
    protected canvas: HTMLCanvasElement | null;
    protected canvas_context: CanvasRenderingContext2D | null;
    protected _options: O;
    protected _defaults: BaseGridOption;
    protected _columnDefaults: Partial<C>;
    protected _columnAutosizeDefaults: AutoSize;
    protected _columnResizeTimer?: any;
    protected _executionBlockTimer?: any;
    protected _flashCellTimer?: any;
    protected _highlightRowTimer?: any;
    protected th: number;
    protected h: number;
    protected ph: number;
    protected n: number;
    protected cj: number;
    protected page: number;
    protected offset: number;
    protected vScrollDir: number;
    protected _bindingEventService: BindingEventService_;
    protected initialized: boolean;
    protected _container: HTMLElement;
    protected uid: string;
    protected _focusSink: HTMLDivElement;
    protected _focusSink2: HTMLDivElement;
    protected _groupHeaders: HTMLDivElement[];
    protected _headerScroller: HTMLDivElement[];
    protected _headers: HTMLDivElement[];
    protected _headerRows: HTMLDivElement[];
    protected _headerRowScroller: HTMLDivElement[];
    protected _headerRowSpacerL: HTMLDivElement;
    protected _headerRowSpacerR: HTMLDivElement;
    protected _footerRow: HTMLDivElement[];
    protected _footerRowScroller: HTMLDivElement[];
    protected _footerRowSpacerL: HTMLDivElement;
    protected _footerRowSpacerR: HTMLDivElement;
    protected _preHeaderPanel: HTMLDivElement;
    protected _preHeaderPanelScroller: HTMLDivElement;
    protected _preHeaderPanelSpacer: HTMLDivElement;
    protected _preHeaderPanelR: HTMLDivElement;
    protected _preHeaderPanelScrollerR: HTMLDivElement;
    protected _preHeaderPanelSpacerR: HTMLDivElement;
    protected _topPanelScrollers: HTMLDivElement[];
    protected _topPanels: HTMLDivElement[];
    protected _viewport: HTMLDivElement[];
    protected _canvas: HTMLDivElement[];
    protected _style?: HTMLStyleElement;
    protected _boundAncestors: HTMLElement[];
    protected stylesheet?: {
        cssRules: Array<{
            selectorText: string;
        }>;
        rules: Array<{
            selectorText: string;
        }>;
    } | null;
    protected columnCssRulesL?: Array<{
        selectorText: string;
    }>;
    protected columnCssRulesR?: Array<{
        selectorText: string;
    }>;
    protected viewportH: number;
    protected viewportW: number;
    protected canvasWidth: number;
    protected canvasWidthL: number;
    protected canvasWidthR: number;
    protected headersWidth: number;
    protected headersWidthL: number;
    protected headersWidthR: number;
    protected viewportHasHScroll: boolean;
    protected viewportHasVScroll: boolean;
    protected headerColumnWidthDiff: number;
    protected headerColumnHeightDiff: number;
    protected cellWidthDiff: number;
    protected cellHeightDiff: number;
    protected absoluteColumnMinWidth: number;
    protected hasFrozenRows: boolean;
    protected frozenRowsHeight: number;
    protected actualFrozenRow: number;
    protected paneTopH: number;
    protected paneBottomH: number;
    protected viewportTopH: number;
    protected viewportBottomH: number;
    protected topPanelH: number;
    protected headerRowH: number;
    protected footerRowH: number;
    protected tabbingDirection: number;
    protected _activeCanvasNode: HTMLDivElement;
    protected _activeViewportNode: HTMLDivElement;
    protected activePosX: number;
    protected activeRow: number;
    protected activeCell: number;
    protected activeCellNode: HTMLDivElement | null;
    protected currentEditor: Editor | null;
    protected serializedEditorValue: any;
    protected editController?: EditController;
    protected rowsCache: Array<RowCaching>;
    protected renderedRows: number;
    protected numVisibleRows: number;
    protected prevScrollTop: number;
    protected scrollTop: number;
    protected lastRenderedScrollTop: number;
    protected lastRenderedScrollLeft: number;
    protected prevScrollLeft: number;
    protected scrollLeft: number;
    protected selectionModel?: SelectionModel;
    protected selectedRows: number[];
    protected plugins: SlickPlugin[];
    protected cellCssClasses: CssStyleHash;
    protected columnsById: Record<string, number>;
    protected sortColumns: ColumnSort[];
    protected columnPosLeft: number[];
    protected columnPosRight: number[];
    protected pagingActive: boolean;
    protected pagingIsLastPage: boolean;
    protected scrollThrottle: {
        enqueue: () => void;
        dequeue: () => void;
    };
    protected h_editorLoader: any;
    protected h_render: null;
    protected h_postrender: any;
    protected h_postrenderCleanup: any;
    protected postProcessedRows: any;
    protected postProcessToRow: number;
    protected postProcessFromRow: number;
    protected postProcessedCleanupQueue: Array<{
        actionType: string;
        groupId: number;
        node: HTMLElement | HTMLElement[];
        columnIdx?: number;
        rowIdx?: number;
    }>;
    protected postProcessgroupId: number;
    protected counter_rows_rendered: number;
    protected counter_rows_removed: number;
    protected _paneHeaderL: HTMLDivElement;
    protected _paneHeaderR: HTMLDivElement;
    protected _paneTopL: HTMLDivElement;
    protected _paneTopR: HTMLDivElement;
    protected _paneBottomL: HTMLDivElement;
    protected _paneBottomR: HTMLDivElement;
    protected _headerScrollerL: HTMLDivElement;
    protected _headerScrollerR: HTMLDivElement;
    protected _headerL: HTMLDivElement;
    protected _headerR: HTMLDivElement;
    protected _groupHeadersL: HTMLDivElement;
    protected _groupHeadersR: HTMLDivElement;
    protected _headerRowScrollerL: HTMLDivElement;
    protected _headerRowScrollerR: HTMLDivElement;
    protected _footerRowScrollerL: HTMLDivElement;
    protected _footerRowScrollerR: HTMLDivElement;
    protected _headerRowL: HTMLDivElement;
    protected _headerRowR: HTMLDivElement;
    protected _footerRowL: HTMLDivElement;
    protected _footerRowR: HTMLDivElement;
    protected _topPanelScrollerL: HTMLDivElement;
    protected _topPanelScrollerR: HTMLDivElement;
    protected _topPanelL: HTMLDivElement;
    protected _topPanelR: HTMLDivElement;
    protected _viewportTopL: HTMLDivElement;
    protected _viewportTopR: HTMLDivElement;
    protected _viewportBottomL: HTMLDivElement;
    protected _viewportBottomR: HTMLDivElement;
    protected _canvasTopL: HTMLDivElement;
    protected _canvasTopR: HTMLDivElement;
    protected _canvasBottomL: HTMLDivElement;
    protected _canvasBottomR: HTMLDivElement;
    protected _viewportScrollContainerX: HTMLDivElement;
    protected _viewportScrollContainerY: HTMLDivElement;
    protected _headerScrollContainer: HTMLDivElement;
    protected _headerRowScrollContainer: HTMLDivElement;
    protected _footerRowScrollContainer: HTMLDivElement;
    protected cssShow: {
        position: string;
        visibility: string;
        display: string;
    };
    protected _hiddenParents: HTMLElement[];
    protected oldProps: Array<Partial<CSSStyleDeclaration>>;
    protected enforceFrozenRowHeightRecalc: boolean;
    protected columnResizeDragging: boolean;
    protected slickDraggableInstance: InteractionBase | null;
    protected slickMouseWheelInstances: Array<InteractionBase>;
    protected slickResizableInstances: Array<InteractionBase>;
    protected sortableSideLeftInstance?: SortableInstance;
    protected sortableSideRightInstance?: SortableInstance;
    protected logMessageCount: number;
    protected logMessageMaxCount: number;
    protected _pubSubService?: BasePubSub;
    /**
     * Creates a new instance of the grid.
     * @class SlickGrid
     * @constructor
     * @param {Node} container - Container node to create the grid in.
     * @param {Array|Object} data - An array of objects for databinding or an external DataView.
     * @param {Array<C>} columns - An array of column definitions.
     * @param {Object} [options] - Grid Options
     * @param {Object} [externalPubSub] - optional External PubSub Service to use by SlickEvent
     **/
    constructor(container: HTMLElement | string, data: CustomDataView<TData> | TData[], columns: C[], options: Partial<O>, externalPubSub?: BasePubSub | undefined);
    /** Initializes the grid. */
    init(): void;
    /**
     * Apply HTML code by 3 different ways depending on what is provided as input and what options are enabled.
     * 1. value is an HTMLElement or DocumentFragment, then first empty the target and simply append the HTML to the target element.
     * 2. value is string and `enableHtmlRendering` is enabled, then use `target.innerHTML = value;`
     * 3. value is string and `enableHtmlRendering` is disabled, then use `target.textContent = value;`
     * @param target - target element to apply to
     * @param val - input value can be either a string or an HTMLElement
     * @param options -
     *   `emptyTarget`, defaults to true, will empty the target.
     *   `skipEmptyReassignment`, defaults to true, when enabled it will not try to reapply an empty value when the target is already empty
     */
    applyHtmlCode(target: HTMLElement, val: string | HTMLElement | DocumentFragment, options?: {
        emptyTarget?: boolean;
        skipEmptyReassignment?: boolean;
    }): void;
    protected initialize(options: Partial<O>): void;
    protected finishInitialization(): void;
    /** handles "display:none" on container or container parents, related to issue: https://github.com/6pac/SlickGrid/issues/568 */
    cacheCssForHiddenInit(): void;
    restoreCssFromHiddenInit(): void;
    protected hasFrozenColumns(): boolean;
    /** Register an external Plugin */
    registerPlugin<T extends SlickPlugin>(plugin: T): void;
    /** Unregister (destroy) an external Plugin */
    unregisterPlugin(plugin: SlickPlugin): void;
    /** Get a Plugin (addon) by its name */
    getPluginByName<P extends SlickPlugin | undefined = undefined>(name: string): P | undefined;
    /**
     * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
     * @param {Object} selectionModel A SelectionModel.
     */
    setSelectionModel(model: SelectionModel): void;
    /** Returns the current SelectionModel. See here for more information about SelectionModels. */
    getSelectionModel(): SelectionModel | undefined;
    /** Get Grid Canvas Node DOM Element */
    getCanvasNode(columnIdOrIdx?: number | string, rowIndex?: number): HTMLDivElement;
    /** Get the canvas DOM element */
    getActiveCanvasNode(e?: Event | SlickEventData_): HTMLDivElement;
    /** Get the canvas DOM element */
    getCanvases(): HTMLDivElement[];
    /** Get the Viewport DOM node element */
    getViewportNode(columnIdOrIdx?: number | string, rowIndex?: number): HTMLElement | undefined;
    /** Get all the Viewport node elements */
    getViewports(): HTMLDivElement[];
    getActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement;
    /** Sets an active viewport node */
    setActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement;
    protected _getContainerElement(targetContainers: HTMLElement[], columnIdOrIdx?: number | string, rowIndex?: number): HTMLElement | undefined;
    protected measureScrollbar(): {
        width: number;
        height: number;
    };
    /** Get the headers width in pixel */
    getHeadersWidth(): number;
    /** Get the grid canvas width */
    getCanvasWidth(): number;
    protected updateCanvasWidth(forceColumnWidthsUpdate?: boolean): void;
    protected disableSelection(target: HTMLElement[]): void;
    protected getMaxSupportedCssHeight(): number;
    /** Get grid unique identifier */
    getUID(): string;
    /** Get Header Column Width Difference in pixel */
    getHeaderColumnWidthDiff(): number;
    /** Get scrollbar dimensions */
    getScrollbarDimensions(): {
        height: number;
        width: number;
    } | undefined;
    /** Get the displayed scrollbar dimensions */
    getDisplayedScrollbarDimensions(): {
        width: number;
        height: number;
    };
    /** Get the absolute column minimum width */
    getAbsoluteColumnMinWidth(): number;
    getPubSubService(): BasePubSub | undefined;
    protected bindAncestorScrollEvents(): void;
    protected unbindAncestorScrollEvents(): void;
    /**
     * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
     * @param {Number|String} columnId Column id.
     * @param {string | HTMLElement | DocumentFragment} [title] New column name.
     * @param {String} [toolTip] New column tooltip.
     */
    updateColumnHeader(columnId: number | string, title?: string | HTMLElement | DocumentFragment, toolTip?: string): void;
    /**
     * Get the Header DOM element
     * @param {C} columnDef - column definition
     */
    getHeader(columnDef: C): HTMLDivElement | HTMLDivElement[];
    /**
     * Get a specific Header Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getHeaderColumn(columnIdOrIdx: number | string): HTMLDivElement;
    /** Get the Header Row DOM element */
    getHeaderRow(): HTMLDivElement | HTMLDivElement[];
    /** Get the Footer DOM element */
    getFooterRow(): HTMLDivElement | HTMLDivElement[];
    /** @alias `getPreHeaderPanelLeft` */
    getPreHeaderPanel(): HTMLDivElement;
    /** Get the Pre-Header Panel Left DOM node element */
    getPreHeaderPanelLeft(): HTMLDivElement;
    /** Get the Pre-Header Panel Right DOM node element */
    getPreHeaderPanelRight(): HTMLDivElement;
    /**
     * Get Header Row Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getHeaderRowColumn(columnIdOrIdx: number | string): HTMLDivElement;
    /**
     * Get the Footer Row Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getFooterRowColumn(columnIdOrIdx: number | string): HTMLDivElement;
    protected createColumnFooter(): void;
    protected handleHeaderMouseHoverOn(e: Event | SlickEventData_): void;
    protected handleHeaderMouseHoverOff(e: Event | SlickEventData_): void;
    protected createColumnHeaders(): void;
    protected setupColumnSort(): void;
    protected setupColumnReorder(): void;
    protected getHeaderChildren(): HTMLElement[];
    protected handleResizeableDoubleClick(evt: MouseEvent & {
        target: HTMLDivElement;
    }): void;
    protected setupColumnResize(): void;
    protected getVBoxDelta(el: HTMLElement): number;
    protected setFrozenOptions(): void;
    protected setPaneVisibility(): void;
    protected setOverflow(): void;
    protected setScroller(): void;
    protected measureCellPaddingAndBorder(): void;
    protected createCssRules(): void;
    /** Create CSS rules via template in case the first approach with createElement('style') doesn't work */
    protected createCssRulesAlternative(rules: string[]): void;
    protected getColumnCssRules(idx: number): {
        left: {
            selectorText: string;
        };
        right: {
            selectorText: string;
        };
    };
    protected removeCssRules(): void;
    /** Clear all highlight timers that might have been left opened */
    protected clearAllTimers(): void;
    /**
     * Destroy (dispose) of SlickGrid
     * @param {boolean} shouldDestroyAllElements - do we want to destroy (nullify) all DOM elements as well? This help in avoiding mem leaks
     */
    destroy(shouldDestroyAllElements?: boolean): void;
    /**
     * call destroy method, when exists, on all the instance(s) it found
     * @params instances - can be a single instance or a an array of instances
     */
    protected destroyAllInstances(inputInstances: null | InteractionBase | Array<InteractionBase>): InteractionBase[] | null;
    protected destroyAllElements(): void;
    /** Proportionally resize a specific column by its name, index or Id */
    autosizeColumn(columnOrIndexOrId: number | string, isInit?: boolean): void;
    protected treatAsLocked(autoSize?: AutoSize): boolean;
    /** Proportionately resizes all columns to fill available horizontal space. This does not take the cell contents into consideration. */
    autosizeColumns(autosizeMode?: string, isInit?: boolean): void;
    protected internalAutosizeColumns(autosizeMode?: string, isInit?: boolean): void;
    protected LogColWidths(): void;
    protected getColAutosizeWidth(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number): void;
    protected getColContentSize(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number): number;
    protected getColWidth(columnDef: C, gridCanvas: HTMLElement, rowInfo: RowInfo): number;
    protected getColHeaderWidth(columnDef: C): number;
    protected legacyAutosizeColumns(): void;
    /**
     * Apply Columns Widths in the UI and optionally invalidate & re-render the columns when specified
     * @param {Boolean} shouldReRender - should we invalidate and re-render the grid?
     */
    reRenderColumns(reRender?: boolean): void;
    getVisibleColumns(): C[];
    protected trigger<ArgType = any>(evt: SlickEvent_, args?: ArgType, e?: Event | SlickEventData_): SlickEventData_<any>;
    /** Get Editor lock */
    getEditorLock(): SlickEditorLock;
    /** Get Editor Controller */
    getEditController(): EditController | undefined;
    /**
     * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
     * @param {String | Number} id A column id.
     */
    getColumnIndex(id: number | string): number;
    protected applyColumnHeaderWidths(): void;
    protected applyColumnWidths(): void;
    /**
     * Accepts a columnId string and an ascending boolean. Applies a sort glyph in either ascending or descending form to the header of the column. Note that this does not actually sort the column. It only adds the sort glyph to the header.
     * @param {String | Number} columnId
     * @param {Boolean} ascending
     */
    setSortColumn(columnId: number | string, ascending: boolean): void;
    /**
     * Get column by index
     * @param {Number} id - column index
     * @returns
     */
    getColumnByIndex(id: number): HTMLElement | undefined;
    /**
     * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ]. When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array. Note that this does not actually sort the column. It only adds the sort glyph to the header
     * @param {ColumnSort[]} cols - column sort
     */
    setSortColumns(cols: ColumnSort[]): void;
    /** Get sorted columns **/
    getSortColumns(): ColumnSort[];
    protected handleSelectedRangesChanged(e: SlickEventData_, ranges: SlickRange_[]): void;
    simpleArrayEquals(arr1: any[], arr2: any[]): boolean;
    /** Returns an array of column definitions. */
    getColumns(): C[];
    protected updateColumnCaches(): void;
    protected updateColumnProps(): void;
    /**
     * Sets grid columns. Column headers will be recreated and all rendered rows will be removed. To rerender the grid (if necessary), call render().
     * @param {Column[]} columnDefinitions An array of column definitions.
     */
    setColumns(columnDefinitions: C[]): void;
    /** Update columns for when a hidden property has changed but the column list itself has not changed. */
    updateColumns(): void;
    protected updateColumnsInternal(): void;
    /** Returns an object containing all of the Grid options set on the grid. See a list of Grid Options here.  */
    getOptions(): O;
    /**
     * Extends grid options with a given hash. If an there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.
     * @param {Object} options - an object with configuration options.
     * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
     * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
     * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
     */
    setOptions(newOptions: Partial<O>, suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void;
    /**
     * If option.mixinDefaults is true then external code maintains a reference to the options object. In this case there is no need
     * to call setOptions() - changes can be made directly to the object. However setOptions() also performs some recalibration of the
     * grid in reaction to changed options. activateChangedOptions call the same recalibration routines as setOptions() would have.
     * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
     * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
     * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
     */
    activateChangedOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void;
    protected prepareForOptionsChange(): void;
    protected internal_setOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void;
    validateAndEnforceOptions(): void;
    /**
     * Sets a new source for databinding and removes all rendered rows. Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
     * @param {CustomDataView|Array<*>} newData New databinding source using a regular JavaScript array.. or a custom object exposing getItem(index) and getLength() functions.
     * @param {Number} [scrollToTop] If true, the grid will reset the vertical scroll position to the top of the grid.
     */
    setData(newData: CustomDataView<TData> | TData[], scrollToTop?: boolean): void;
    /** Returns an array of every data object, unless you're using DataView in which case it returns a DataView object. */
    getData<U extends CustomDataView<TData> | U[]>(): U;
    /** Returns the size of the databinding source. */
    getDataLength(): number;
    protected getDataLengthIncludingAddNew(): number;
    /**
     * Returns the databinding item at a given position.
     * @param {Number} index Item row index.
     */
    getDataItem(i: number): TData;
    /** Get Top Panel DOM element */
    getTopPanel(): HTMLDivElement;
    /** Get Top Panels (left/right) DOM element */
    getTopPanels(): HTMLDivElement[];
    /** Are we using a DataView? */
    hasDataView(): boolean;
    protected togglePanelVisibility(option: 'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel', container: HTMLElement | HTMLElement[], visible?: boolean, animate?: boolean): void;
    /**
     * Set the Top Panel Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if top panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setTopPanelVisibility(visible?: boolean, animate?: boolean): void;
    /**
     * Set the Header Row Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if header row panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setHeaderRowVisibility(visible?: boolean, animate?: boolean): void;
    /**
     * Set the Column Header Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if column header is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setColumnHeaderVisibility(visible?: boolean, animate?: boolean): void;
    /**
     * Set the Footer Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if footer row panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setFooterRowVisibility(visible?: boolean, animate?: boolean): void;
    /**
     * Set the Pre-Header Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if pre-header panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setPreHeaderPanelVisibility(visible?: boolean, animate?: boolean): void;
    /** Get Grid Canvas Node DOM Element */
    getContainerNode(): HTMLElement;
    protected getRowTop(row: number): number;
    protected getRowFromPosition(y: number): number;
    /**
     * Scroll to an Y position in the grid
     * @param {Number} y
     */
    scrollTo(y: number): void;
    protected defaultFormatter(_row: number, _cell: number, value: any): string;
    protected getFormatter(row: number, column: C): Formatter;
    protected getEditor(row: number, cell: number): Editor | EditorConstructor | null | undefined;
    protected getDataItemValueForColumn(item: TData, columnDef: C): TData | TData[keyof TData];
    protected appendRowHtml(divArrayL: HTMLElement[], divArrayR: HTMLElement[], row: number, range: CellViewportRange, dataLength: number): void;
    protected appendCellHtml(divRow: HTMLElement, row: number, cell: number, colspan: number, item: TData): void;
    protected cleanupRows(rangeToKeep: {
        bottom: number;
        top: number;
    }): void;
    /** Invalidate all grid rows and re-render the grid rows */
    invalidate(): void;
    /** Invalidate all grid rows */
    invalidateAllRows(): void;
    /**
     * Invalidate a specific set of row numbers
     * @param {Number[]} rows
     */
    invalidateRows(rows: number[]): void;
    /**
     * Invalidate a specific row number
     * @param {Number} row
     */
    invalidateRow(row: number): void;
    protected queuePostProcessedRowForCleanup(cacheEntry: RowCaching, postProcessedRow: any, rowIdx: number): void;
    protected queuePostProcessedCellForCleanup(cellnode: HTMLElement, columnIdx: number, rowIdx: number): void;
    protected removeRowFromCache(row: number): void;
    /** Apply a Formatter Result to a Cell DOM Node */
    applyFormatResultToCellNode(formatterResult: FormatterResultWithHtml | FormatterResultWithText | string | HTMLElement | DocumentFragment, cellNode: HTMLDivElement, suppressRemove?: boolean): void;
    /**
     * Update a specific cell by its row and column index
     * @param {Number} row - grid row number
     * @param {Number} cell - grid cell column number
     */
    updateCell(row: number, cell: number): void;
    /**
     * Update a specific row by its row index
     * @param {Number} row - grid row number
     */
    updateRow(row: number): void;
    /**
     * Get the number of rows displayed in the viewport
     * Note that the row count is an approximation because it is a calculated value using this formula (viewport / rowHeight = rowCount),
     * the viewport must also be displayed for this calculation to work.
     * @return {Number} rowCount
     */
    getViewportRowCount(): number;
    getViewportHeight(): number;
    getViewportWidth(): number;
    /** Execute a Resize of the Grid Canvas */
    resizeCanvas(): void;
    /**
     * Update paging information status from the View
     * @param {PagingInfo} pagingInfo
     */
    updatePagingStatusFromView(pagingInfo: Pick<PagingInfo, 'pageSize' | 'pageNum' | 'totalPages'>): void;
    /** Update the dataset row count */
    updateRowCount(): void;
    /** @alias `getVisibleRange` */
    getViewport(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    getVisibleRange(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    /** Get rendered range */
    getRenderedRange(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    protected ensureCellNodesInRowsCache(row: number): void;
    protected cleanUpCells(range: CellViewportRange, row: number): void;
    protected cleanUpAndRenderCells(range: CellViewportRange): void;
    protected renderRows(range: {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    }): void;
    protected startPostProcessing(): void;
    protected startPostProcessingCleanup(): void;
    protected invalidatePostProcessingResults(row: number): void;
    protected updateRowPositions(): void;
    /** (re)Render the grid */
    render(): void;
    protected handleHeaderRowScroll(): void;
    protected handleFooterRowScroll(): void;
    protected handlePreHeaderPanelScroll(): void;
    protected handleElementScroll(element: HTMLElement): void;
    protected handleScroll(): boolean;
    protected _handleScroll(isMouseWheel: boolean): boolean;
    /**
     * limits the frequency at which the provided action is executed.
     * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
     * call dequeue to cancel any pending action.
     */
    protected actionThrottle(action: () => void, minPeriod_ms: number): {
        enqueue: () => void;
        dequeue: () => void;
    };
    protected asyncPostProcessRows(): void;
    protected asyncPostProcessCleanupRows(): void;
    protected updateCellCssStylesOnRenderedRows(addedHash?: CssStyleHash | null, removedHash?: CssStyleHash | null): void;
    /**
     * Adds an "overlay" of CSS classes to cell DOM elements. SlickGrid can have many such overlays associated with different keys and they are frequently used by plugins. For example, SlickGrid uses this method internally to decorate selected cells with selectedCellCssClass (see options).
     * @param {String} key A unique key you can use in calls to setCellCssStyles and removeCellCssStyles. If a hash with that key has already been set, an exception will be thrown.
     * @param {CssStyleHash} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
     * @example
     * `{
     * 	 0: { number_column: SlickEvent; title_column: SlickEvent;	},
     * 	 4: { percent_column: SlickEvent; }
     * }`
     */
    addCellCssStyles(key: string, hash: CssStyleHash): void;
    /**
     * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
     * @param {String} key A string key.
     */
    removeCellCssStyles(key: string): void;
    /**
     * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash). key is name for this set of styles so you can reference it later - to modify it or remove it, for example. hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
     * Suppose you have a grid with columns:
     * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
     * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).
     * @param {String} key A string key. Will overwrite any data already associated with this key.
     * @param {Object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
     */
    setCellCssStyles(key: string, hash: CssStyleHash): void;
    /**
     * Accepts a key name, returns the group of CSS styles defined under that name. See setCellCssStyles for more info.
     * @param {String} key A string.
     */
    getCellCssStyles(key: string): CssStyleHash;
    /**
     * Flashes the cell twice by toggling the CSS class 4 times.
     * @param {Number} row A row index.
     * @param {Number} cell A column index.
     * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 250 ms.
     */
    flashCell(row: number, cell: number, speed?: number): void;
    /**
     * Highlight a row for a certain duration (ms) of time.
     * @param {Number} row - grid row number
     * @param {Number} [duration] - duration (ms), defaults to 400ms
     */
    highlightRow(row: number, duration?: number): void;
    protected handleMouseWheel(e: MouseEvent, _delta: number, deltaX: number, deltaY: number): void;
    protected handleDragInit(e: DragEvent, dd: DragPosition): any;
    protected handleDragStart(e: DragEvent, dd: DragPosition): any;
    protected handleDrag(e: DragEvent, dd: DragPosition): any;
    protected handleDragEnd(e: DragEvent, dd: DragPosition): void;
    protected handleKeyDown(e: KeyboardEvent & {
        originalEvent: Event;
    }): void;
    protected handleClick(evt: DOMEvent<HTMLDivElement> | SlickEventData_): void;
    protected handleContextMenu(e: Event & {
        target: HTMLElement;
    }): void;
    protected handleDblClick(e: MouseEvent): void;
    protected handleHeaderMouseEnter(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleHeaderMouseLeave(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleHeaderRowMouseEnter(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleHeaderRowMouseLeave(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleHeaderContextMenu(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleHeaderClick(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleFooterContextMenu(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleFooterClick(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleCellMouseOver(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected handleCellMouseOut(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    protected cellExists(row: number, cell: number): boolean;
    /**
     * Returns row and cell indexes by providing x,y coordinates.
     * Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
     * @param x An x coordinate.
     * @param y A y coordinate.
     */
    getCellFromPoint(x: number, y: number): {
        row: number;
        cell: number;
    };
    protected getCellFromNode(cellNode: HTMLElement): number;
    protected getRowFromNode(rowNode: HTMLElement): number | null;
    /**
     * Get frozen (pinned) row offset
     * @param {Number} row - grid row number
     */
    getFrozenRowOffset(row: number): number;
    /**
     * Returns a hash containing row and cell indexes from a standard W3C event.
     * @param {*} event A standard W3C event.
     */
    getCellFromEvent(evt: Event | SlickEventData_): {
        row: number;
        cell: number;
    } | null;
    /**
     * Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
     * @param {Number} row - A row number.
     * @param {Number} cell - A column number.
     */
    getCellNodeBox(row: number, cell: number): {
        top: number;
        left: number;
        bottom: number;
        right: number;
    } | null;
    /**  Resets active cell. */
    resetActiveCell(): void;
    /** @alias `setFocus` */
    focus(): void;
    protected setFocus(): void;
    /** Scroll to a specific cell and make it into the view */
    scrollCellIntoView(row: number, cell: number, doPaging?: boolean): void;
    protected internalScrollColumnIntoView(left: number, right: number): void;
    /**
     * Scroll to a specific column and show it into the viewport
     * @param {Number} cell - cell column number
     */
    scrollColumnIntoView(cell: number): void;
    protected setActiveCellInternal(newCell: HTMLDivElement | null, opt_editMode?: boolean | null, preClickModeOn?: boolean | null, suppressActiveCellChangedEvent?: boolean, e?: Event | SlickEvent_): void;
    protected clearTextSelection(): void;
    protected isCellPotentiallyEditable(row: number, cell: number): boolean;
    /**
     * Make the cell normal again (for example after destroying cell editor),
     * we can also optionally refocus on the current active cell (again possibly after closing cell editor)
     * @param {Boolean} [refocusActiveCell]
     */
    protected makeActiveCellNormal(refocusActiveCell?: boolean): void;
    editActiveCell(editor: EditorConstructor, preClickModeOn?: boolean | null, e?: Event): void;
    protected makeActiveCellEditable(editor?: EditorConstructor, preClickModeOn?: boolean | null, e?: Event | SlickEvent_): void;
    protected commitEditAndSetFocus(): void;
    protected cancelEditAndSetFocus(): void;
    protected absBox(elem: HTMLElement): {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width: number;
        height: number;
        visible: boolean;
    };
    /** Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. */
    getActiveCellPosition(): {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width: number;
        height: number;
        visible: boolean;
    };
    /** Get the Grid Position */
    getGridPosition(): {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width: number;
        height: number;
        visible: boolean;
    };
    protected handleActiveCellPositionChange(): void;
    /** Returns the active cell editor. If there is no actively edited cell, null is returned.   */
    getCellEditor(): Editor | null;
    /**
     * Returns an object representing the coordinates of the currently active cell:
     * @example	`{ row: activeRow, cell: activeCell }`
     */
    getActiveCell(): {
        row: number;
        cell: number;
    } | null;
    /** Returns the DOM element containing the currently active cell. If no cell is active, null is returned. */
    getActiveCellNode(): HTMLDivElement | null;
    protected getTextSelection(): Range | null;
    protected setTextSelection(selection: Range): void;
    /**
     * Scroll to a specific row and make it into the view
     * @param {Number} row - grid row number
     * @param {Boolean} doPaging - scroll when pagination is enabled
     */
    scrollRowIntoView(row: number, doPaging?: boolean): void;
    /**
     * Scroll to the top row and make it into the view
     * @param {Number} row - grid row number
     */
    scrollRowToTop(row: number): void;
    protected scrollPage(dir: number): void;
    /** Navigate (scroll) by a page down */
    navigatePageDown(): void;
    /** Navigate (scroll) by a page up */
    navigatePageUp(): void;
    /** Navigate to the top of the grid */
    navigateTop(): void;
    /** Navigate to the bottom of the grid */
    navigateBottom(): void;
    protected navigateToRow(row: number): boolean;
    protected getColspan(row: number, cell: number): number;
    protected findFirstFocusableCell(row: number): number | null;
    protected findLastFocusableCell(row: number): number | null;
    protected gotoRight(row: number, cell: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoLeft(row: number, cell: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoDown(row: number, cell: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoUp(row: number, cell: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoNext(row: number, cell: number, posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoPrev(row: number, cell: number, posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoRowStart(row: number, _cell: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    protected gotoRowEnd(row: number, _cell: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
    } | null;
    /** Switches the active cell one cell right skipping unselectable cells. Unline navigateNext, navigateRight stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not. */
    navigateRight(): boolean | undefined;
    /** Switches the active cell one cell left skipping unselectable cells. Unline navigatePrev, navigateLeft stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not. */
    navigateLeft(): boolean | undefined;
    /** Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
    navigateDown(): boolean | undefined;
    /** Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
    navigateUp(): boolean | undefined;
    /** Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not. */
    navigateNext(): boolean | undefined;
    /** Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not. */
    navigatePrev(): boolean | undefined;
    /** Navigate to the start row in the grid */
    navigateRowStart(): boolean | undefined;
    /** Navigate to the end row in the grid */
    navigateRowEnd(): boolean | undefined;
    /**
     * @param {string} dir Navigation direction.
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    protected navigate(dir: 'up' | 'down' | 'left' | 'right' | 'prev' | 'next' | 'home' | 'end'): boolean | undefined;
    /**
     * Returns a DOM element containing a cell at a given row and cell.
     * @param row A row index.
     * @param cell A column index.
     */
    getCellNode(row: number, cell: number): HTMLDivElement | null;
    /**
     * Sets an active cell.
     * @param {number} row - A row index.
     * @param {number} cell - A column index.
     * @param {boolean} [optionEditMode] Option Edit Mode is Auto-Edit?
     * @param {boolean} [preClickModeOn] Pre-Click Mode is Enabled?
     * @param {boolean} [suppressActiveCellChangedEvent] Are we suppressing Active Cell Changed Event (defaults to false)
     */
    setActiveCell(row: number, cell: number, opt_editMode?: boolean, preClickModeOn?: boolean, suppressActiveCellChangedEvent?: boolean): void;
    /**
     * Sets an active cell.
     * @param {number} row - A row index.
     * @param {number} cell - A column index.
     * @param {boolean} [suppressScrollIntoView] - optionally suppress the ScrollIntoView that happens by default (defaults to false)
     */
    setActiveRow(row: number, cell?: number, suppressScrollIntoView?: boolean): void;
    /**
     * Returns true if you can click on a given cell and make it the active focus.
     * @param {number} row A row index.
     * @param {number} col A column index.
     */
    canCellBeActive(row: number, cell: number): boolean;
    /**
     * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
     * @param {number} row A row index.
     * @param {number} col A column index.
     */
    canCellBeSelected(row: number, cell: number): boolean;
    /**
     * Accepts a row integer and a cell integer, scrolling the view to the row where row is its row index, and cell is its cell index. Optionally accepts a forceEdit boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.
     * Unlike setActiveCell, this scrolls the row into the viewport and sets the keyboard focus.
     * @param {Number} row A row index.
     * @param {Number} cell A column index.
     * @param {Boolean} [forceEdit] If true, will attempt to initiate the edit dialogue for the field in the specified cell.
     */
    gotoCell(row: number, cell: number, forceEdit?: boolean, e?: Event | SlickEvent_): void;
    protected commitCurrentEdit(): boolean;
    protected cancelCurrentEdit(): boolean;
    protected rowsToRanges(rows: number[]): SlickRange_[];
    /** Returns an array of row indices corresponding to the currently selected rows. */
    getSelectedRows(): number[];
    /**
     * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
     * @param {Array<number>} rowsArray - an array of row numbers.
     * @param {String} [caller] - an optional string to identify who called the method
     */
    setSelectedRows(rows: number[], caller?: string): void;
    /** html sanitizer to avoid scripting attack */
    sanitizeHtmlString(dirtyHtml: string, suppressLogging?: boolean): string;
}
export {};
//# sourceMappingURL=slick.grid.d.ts.map