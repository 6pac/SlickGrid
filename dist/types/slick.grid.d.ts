import type { SortableInstance } from 'sortablejs';
import type { AutoSize, CellPosition, CellViewportRange, Column, ColumnMetadata, ColumnSort, CssStyleHash, CustomDataView, DOMEvent, DragPosition, DragRowMove, Editor, EditorConstructor, EditController, Formatter, FormatterResultWithHtml, FormatterResultWithText, GridOption as BaseGridOption, InteractionBase, ItemMetadata, MenuCommandItemCallbackArgs, MultiColumnSort, OnActivateChangedOptionsEventArgs, OnActiveCellChangedEventArgs, OnAddNewRowEventArgs, OnAfterSetColumnsEventArgs, OnAutosizeColumnsEventArgs, OnBeforeUpdateColumnsEventArgs, OnBeforeAppendCellEventArgs, OnBeforeCellEditorDestroyEventArgs, OnBeforeColumnsResizeEventArgs, OnBeforeEditCellEventArgs, OnBeforeHeaderCellDestroyEventArgs, OnBeforeHeaderRowCellDestroyEventArgs, OnBeforeFooterRowCellDestroyEventArgs, OnBeforeSetColumnsEventArgs, OnCellChangeEventArgs, OnCellCssStylesChangedEventArgs, OnClickEventArgs, OnColumnsDragEventArgs, OnColumnsReorderedEventArgs, OnColumnsResizedEventArgs, OnColumnsResizeDblClickEventArgs, OnCompositeEditorChangeEventArgs, OnDblClickEventArgs, OnFooterContextMenuEventArgs, OnFooterRowCellRenderedEventArgs, OnHeaderCellRenderedEventArgs, OnFooterClickEventArgs, OnHeaderClickEventArgs, OnHeaderContextMenuEventArgs, OnHeaderMouseEventArgs, OnHeaderRowCellRenderedEventArgs, OnKeyDownEventArgs, OnPreHeaderContextMenuEventArgs, OnPreHeaderClickEventArgs, OnRenderedEventArgs, OnSelectedRowsChangedEventArgs, OnSetOptionsEventArgs, OnScrollEventArgs, OnValidationErrorEventArgs, PagingInfo, RowInfo, SelectionModel, SingleColumnSort, SlickPlugin } from './models/index.js';
import { type BasePubSub, BindingEventService as BindingEventService_, type SlickEditorLock, SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickRange as SlickRange_ } from './slick.core.js';
/**
 * @license
 * (c) 2009-present Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v5.15.5
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
    onAfterSetColumns: SlickEvent_<OnAfterSetColumnsEventArgs>;
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
    onBeforeRemoveCachedRow: SlickEvent_<{
        row: number;
        grid: SlickGrid;
    }>;
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
    onPreHeaderContextMenu: SlickEvent_<OnPreHeaderContextMenuEventArgs>;
    onPreHeaderClick: SlickEvent_<OnPreHeaderClickEventArgs>;
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
    protected _columnResizeTimer?: number;
    protected _executionBlockTimer?: number;
    protected _flashCellTimer?: number;
    protected _highlightRowTimer?: number;
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
    protected _topHeaderPanel: HTMLDivElement;
    protected _topHeaderPanelScroller: HTMLDivElement;
    protected _topHeaderPanelSpacer: HTMLDivElement;
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
    protected activePosY: number;
    protected activeRow: number;
    protected activeCell: number;
    protected activeCellNode: HTMLDivElement | null;
    protected currentEditor: Editor | null;
    protected serializedEditorValue: any;
    protected editController?: EditController;
    protected _prevDataLength: number;
    protected _prevInvalidatedRowsCount: number;
    protected _rowSpanIsCached: boolean;
    protected _colsWithRowSpanCache: {
        [colIdx: number]: Set<string>;
    };
    protected rowsCache: Record<number, RowCaching>;
    protected renderedRows: number;
    protected numVisibleRows: number;
    protected prevScrollTop: number;
    protected scrollHeight: number;
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
    protected h_editorLoader?: number;
    protected h_postrender?: number;
    protected h_postrenderCleanup?: number;
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
     * Processes the provided grid options (mixing in default settings as needed),
     * validates required modules (for example, ensuring Sortable.js is loaded if column reordering is enabled),
     * and creates all necessary DOM elements for the grid (including header containers, viewports, canvases, panels, etc.).
     * It also caches CSS if the container or its ancestors are hidden and calls finish.
     *
     * @param {Partial<O>} options - Partial grid options to be applied during initialization.
     */
    protected initialize(options: Partial<O>): void;
    /**
     * Completes grid initialisation by calculating viewport dimensions, measuring cell padding and border differences,
     * disabling text selection (except on editable inputs), setting frozen options and pane visibility,
     * updating column caches, creating column headers and footers, setting up column sorting,
     * creating CSS rules, binding ancestor scroll events, and binding various event handlers
     * (e.g. for scrolling, mouse, keyboard, drag-and-drop).
     * It also starts up any asynchronous post–render processing if enabled.
     */
    protected finishInitialization(): void;
    /**
     * Finds all container ancestors/parents (including the grid container itself) that are hidden (i.e. have display:none)
     * and temporarily applies visible CSS properties (absolute positioning, hidden visibility, block display)
     * so that dimensions can be measured correctly.
     * It stores the original CSS properties in an internal array for later restoration.
     *
     * Related to issue: https://github.com/6pac/SlickGrid/issues/568 */
    cacheCssForHiddenInit(): void;
    /**
     * Restores the original CSS properties for the container and its hidden
     * ancestors that were modified by cacheCssForHiddenInit.
     * This ensures that after initial measurements the DOM elements revert
     * to their original style settings.
     */
    restoreCssFromHiddenInit(): void;
    /**
     * Registers an external plugin to the grid’s internal plugin list.
     * Once added, it immediately initialises the plugin by calling its init()
     * method with the grid instance.
     * @param {T} plugin - The plugin instance to be registered.
     */
    registerPlugin<T extends SlickPlugin>(plugin: T): void;
    /**
     * Unregister (destroy) an external Plugin.
     * Searches for the specified plugin in the grid’s plugin list.
     * When found, it calls the plugin’s destroy() method and removes the plugin from the list,
     * thereby unregistering it from the grid.
     * @param {T} plugin - The plugin instance to be registered.
     */
    unregisterPlugin(plugin: SlickPlugin): void;
    /**
     * Destroy (dispose) of SlickGrid
     *
     * Unbinds all event handlers, cancels any active cell edits, triggers the onBeforeDestroy event,
     * unregisters and destroys plugins, destroys sortable and other interaction instances,
     * unbinds ancestor scroll events, removes CSS rules, unbinds events from all key DOM elements
     * (canvas, viewports, header, footer, etc.), empties the grid container, removes the grid’s uid class,
     * and clears all timers. Optionally, if shouldDestroyAllElements is true,
     * calls destroyAllElements to nullify all DOM references.
     *
     * @param {boolean} shouldDestroyAllElements - do we want to destroy (nullify) all DOM elements as well? This help in avoiding mem leaks
     */
    destroy(shouldDestroyAllElements?: boolean): void;
    /**
     * Call destroy method, when exists, on all the instance(s) it found
     *
     * Given either a single instance or an array of instances (e.g. draggable, mousewheel, resizable),
     * pops each one and calls its destroy method if available, then resets the input to an empty array
     * (or null for a single instance). Returns the reset value.
     *
     * @params  instances - can be a single instance or a an array of instances
     */
    protected destroyAllInstances(inputInstances: null | InteractionBase | Array<InteractionBase>): InteractionBase[] | null;
    /**
     * Sets all internal references to DOM elements
     * (e.g. canvas containers, headers, viewports, focus sinks, etc.)
     * to null so that they can be garbage collected.
     */
    protected destroyAllElements(): void;
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
    /**
     * Attempts to commit any active cell edit via the editor lock; if successful, calls makeActiveCellNormal to exit edit mode.
     *
     * @returns {void} - Does not return a value.
     */
    protected prepareForOptionsChange(): void;
    /**
     * Depending on new options, sets column header visibility, validates options, sets frozen options,
     * forces viewport height recalculation if needed, updates viewport overflow, re-renders the grid (unless suppressed),
     * sets the scroller elements, and reinitialises mouse wheel scrolling as needed.
     *
     * @param {boolean} [suppressRender] - If `true`, prevents the grid from re-rendering.
     * @param {boolean} [suppressColumnSet] - If `true`, prevents the columns from being reset.
     * @param {boolean} [suppressSetOverflow] - If `true`, prevents updating the viewport overflow setting.
     */
    protected internal_setOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void;
    /**
     *
     * Ensures consistency in option setting, by thastIF autoHeight IS enabled, leaveSpaceForNewRows is set to FALSE.
     * And, if forceFitColumns is True, then autosizeColsMode is set to LegacyForceFit.
     */
    validateAndEnforceOptions(): void;
    /**
     * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
     * @param {Object} selectionModel A SelectionModel.
     */
    setSelectionModel(model: SelectionModel): void;
    /** Returns the current SelectionModel. See here for more information about SelectionModels. */
    getSelectionModel(): SelectionModel | undefined;
    /** add/remove frozen class to left headers/footer when defined */
    protected setPaneFrozenClasses(): void;
    protected hasFrozenColumns(): boolean;
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
    /**
     * If footer rows are enabled, clears existing footer cells then iterates over all columns.
     * For each visible column, it creates a footer cell element (adding “frozen” classes if needed),
     * stores the column definition in the element’s storage, and triggers the onFooterRowCellRendered event.
     */
    protected createColumnFooter(): void;
    /**
     * For each header container, binds a click event that—
     *    if the clicked header is sortable and no column resizing is in progress—
     *      --> toggles the sort direction (or adds/removes the column in a multi–column sort),
     *      --> triggers onBeforeSort
     *      --> and if not cancelled, updates the sort columns and triggers onSort.
     */
    protected setupColumnSort(): void;
    /**
     * Clears any existing header cells and header row cells, recalculates header widths,
     * then iterates over each visible column to create header cell elements
     * (and header row cells if enabled) with appropriate content, CSS classes, event bindings,
     * and sort indicator elements. Also triggers before–destroy and rendered events as needed.
     */
    protected createColumnHeaders(): void;
    /**
     * Destroys any existing sortable instances and creates new ones on the left and right header
     * containers using the Sortable library. Configures options including animation,
     * drag handle selectors, auto-scroll, and callbacks (onStart, onEnd) that
     * update the column order, set columns, trigger onColumnsReordered, and reapply column resizing.
     */
    protected setupColumnReorder(): void;
    /**
     * Returns a concatenated array containing the children (header column elements) from both the left and right header containers.
     * @returns {HTMLElement[]} - An array of header column elements.
     */
    protected getHeaderChildren(): HTMLElement[];
    /**
     * When a resizable handle is double–clicked, extracts the column identifier from the parent element’s id
     * (by removing the grid uid) and triggers the onColumnsResizeDblClick event with that identifier.
     * @param {MouseEvent & { target: HTMLDivElement }} evt - The double-click event on the resizable handle.
     */
    protected handleResizeableDoubleClick(evt: MouseEvent & {
        target: HTMLDivElement;
    }): void;
    /**
     * Ensures the Resizable module is available and then iterates over header children to remove
     * any existing resizable handles. Determines which columns are resizable (tracking the first
     * and last resizable columns) and for each eligible column, creates a resizable handle,
     * binds a double–click event, and creates a Resizable instance with callbacks for onResizeStart,
     * onResize, and onResizeEnd. These callbacks manage column width adjustments (including force–fit
     * and frozen column considerations), update header and canvas widths, trigger related events,
     * and re–render the grid as needed.
     * @returns {void}
     */
    protected setupColumnResize(): void;
    /**
     * Validates and sets the frozenColumn option (ensuring it is within valid bounds, or setting it to –1)
     * and, if a frozenRow is specified (greater than –1), sets the grid’s frozen–row flags,
     * computes the frozenRowsHeight (based on rowHeight), and determines the actual frozen row index
     * depending on whether frozenBottom is enabled.
     */
    protected setFrozenOptions(): void;
    /**
     * Proportionally resize a specific column by its name, index or Id
     *
     * Resizes based on its content, but determines the column definition from the provided identifier or index.
     * Then, obtains a grid canvas and calls getColAutosizeWidth to compute and update the column’s width.
     */
    autosizeColumn(columnOrIndexOrId: number | string, isInit?: boolean): void;
    /**
     * Returns true if the column should be treated as locked (i.e. not resized) based on autosize settings.
     * The decision is based on whether header text is not ignored, sizeToRemaining is false,
     * content size equals header width, and the current width is less than 100 pixels.
     *
     * @param {AutoSize} [autoSize={}] - The autosize configuration for the column.
     * @returns {boolean} - Returns `true` if the column should be treated as locked, otherwise `false`.
     */
    protected treatAsLocked(autoSize?: AutoSize): boolean;
    /** Proportionately resizes all columns to fill available horizontal space.
     * This does not take the cell contents into consideration.
     *
     * It does this by temporarily caching CSS for hidden containers, calling the internal autosizing logic
     * (internalAutosizeColumns) with the autosize mode and initialisation flag,
     * then restores the original CSS.
     */
    autosizeColumns(autosizeMode?: string, isInit?: boolean): void;
    /**
     * Implements the main autosizing algorithm. Depending on the autosize mode,
     * it may call legacyAutosizeColumns (for legacy force–fit modes), or proceed
     * to compute column widths based on available viewport width. It iterates over columns
     * to accumulate total widths, locked widths, and then adjusts widths proportionally.
     * Finally, it calls reRenderColumns to update the grid.
     *
     * @param {string} [autosizeMode] - The autosize mode. If undefined, defaults to `autosizeColsMode` from options.
     * @param {boolean} [isInit] - If `true`, applies initial settings for autosizing.
     */
    protected internalAutosizeColumns(autosizeMode?: string, isInit?: boolean): void;
    /**
     * Calculates the ideal autosize width for a given column. First, it sets the default width from the column definition.
     * If the autosize mode is not Locked or Guide, then for ContentIntelligent mode it determines the column’s data type
     * (handling booleans, numbers, strings, dates, moments) and adjusts autosize settings accordingly.
     * It then calls getColContentSize to compute the width needed by the content, applies an additional
     * percentage multiplier and padding, clamps to min/max widths, and if in ContentExpandOnly mode ensures
     * the width is at least the default width. The computed width is stored in autoSize.widthPx.
     *
     * @param {C} columnDef - The column definition containing autosize settings and constraints.
     * @param {number} colIndex - The index of the column within the grid.
     * @param {HTMLElement} gridCanvas - The grid's canvas element where temporary elements will be created.
     * @param {boolean} isInit - If `true`, applies initial settings for row selection mode.
     * @param {number} colArrayIndex - The index of the column in the column array (used for multi-column adjustments).
     */
    protected getColAutosizeWidth(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number): void;
    /**
     * Determines the width needed to render a column’s content. It first measures the header width (if not ignored)
     * and uses it as a baseline. If an explicit colValueArray is provided, it measures that; otherwise, it creates
     * a RowInfo object to select a range of rows based on the rowSelectionMode. Depending on the valueFilterMode
     * (e.g. DeDuplicate, GetGreatestAndSub, GetLongestTextAndSub, GetLongestText), it adjusts the values to measure.
     * It then calls getColWidth (using either canvas text measurement or DOM measurement) and returns the maximum
     * of the header width and computed content width (adjusted by a ratio, if applicable).
     *
     * @param {C} columnDef - The column definition containing formatting and auto-sizing options.
     * @param {number} colIndex - The index of the column within the grid.
     * @param {HTMLElement} gridCanvas - The grid's canvas element where temporary elements will be created.
     * @param {boolean} isInit - If `true`, applies initial row selection mode settings.
     * @param {number} colArrayIndex - The index of the column in the column array (used for multi-column adjustments).
     * @returns {number} - The computed optimal column width in pixels.
     */
    protected getColContentSize(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number): number;
    /**
     * Creates a temporary row and cell element (with absolute positioning, hidden visibility, and nowrap) and iterates
     * over the selected rows (as defined in a RowInfo object or provided value array) to render the cell content using
     * the column formatter. If in text-only mode and canvas measurement is enabled, uses canvas.measureText;
     * otherwise, uses DOM offsetWidth after applying the formatter result to the cell.
     * Returns the maximum measured width.
     *
     * @param {C} columnDef - The column definition containing formatting and auto-sizing options.
     * @param {HTMLElement} gridCanvas - The grid's canvas element where the temporary row will be added.
     * @param {RowInfo} rowInfo - Object containing row start/end indices and values for width evaluation.
     * @returns {number} - The computed optimal column width in pixels.
     */
    protected getColWidth(columnDef: C, gridCanvas: HTMLElement, rowInfo: RowInfo): number;
    /**
     * Determines the width of a column header by first attempting to find the header element using an ID composed of the
     * grid’s uid and the column’s id. If found, clones the element, makes it absolutely positioned and hidden,
     * inserts it into the DOM, measures its offsetWidth, and then removes it. If the header element does not exist yet,
     * creates a temporary header element with the column’s name and measures its width before removing it.
     * Returns the computed header width.
     *
     * @param {C} columnDef - The column definition containing the header information.
     * @returns {number} - The computed width of the column header in pixels.
     */
    protected getColHeaderWidth(columnDef: C): number;
    /**
     * Iterates over all columns to collect current widths (skipping hidden ones), calculates total width
     * and available shrink leeway, then enters a “shrink” loop if the total width exceeds the available
     * viewport width and a “grow” loop if below. Finally, it applies the computed widths to the columns
     * and calls reRenderColumns (with a flag if any width changed) to update the grid.
     */
    protected legacyAutosizeColumns(): void;
    /**
     * Apply Columns Widths in the UI and optionally invalidate & re-render the columns when specified
     * @param {Boolean} shouldReRender - should we invalidate and re-render the grid?
     */
    reRenderColumns(reRender?: boolean): void;
    /**
     * Returns an array of column definitions filtered to exclude any that are marked as hidden.
     *
     * @returns
     */
    getVisibleColumns(): C[];
    /**
     * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
     * @param {String | Number} id A column id.
     */
    getColumnIndex(id: number | string): number;
    /**
     * Iterates over the header elements (from both left and right headers) and updates each header’s width based on the
     * corresponding visible column’s width minus a computed adjustment (headerColumnWidthDiff).
     * Finally, it updates the internal column caches.
     *
     * @returns
     */
    protected applyColumnHeaderWidths(): void;
    /**
     * Iterates over all columns (skipping hidden ones) and, for each, retrieves the associated CSS rules
     * (using getColumnCssRules). It then sets the left and right CSS properties so that the columns align
     * correctly within the grid canvas. It also updates the cumulative offset for non–frozen columns.
     */
    protected applyColumnWidths(): void;
    /**
     * A convenience method that creates a sort configuration for one column (with the given sort direction)
     * and calls setSortColumns with it. Accepts a columnId string and an ascending boolean.
     * Applies a sort glyph in either ascending or descending form to the header of the column.
     * Note that this does not actually sort the column. It only adds the sort glyph to the header.
     *
     * @param {String | Number} columnId
     * @param {Boolean} ascending
     */
    setSortColumn(columnId: number | string, ascending: boolean): void;
    /**
     * Get column by index - iterates over header containers and returns the header column
     * element corresponding to the given index.
     *
     * @param {Number} id - column index
     * @returns
     */
    getColumnByIndex(id: number): HTMLElement | undefined;
    /**
     * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ] to
     * define the grid's sort order. When called, this will apply a sort glyph in either ascending
     * or descending form to the header of each column specified in the array.
     * Note that this does not actually sort the column. It only adds the sort glyph to the header.
     *
     * @param {ColumnSort[]} cols - column sort
     */
    setSortColumns(cols: ColumnSort[]): void;
    /** Returns the current array of column definitions. */
    getColumns(): C[];
    /** Get sorted columns representing the current sorting state of the grid **/
    getSortColumns(): ColumnSort[];
    /**
     * Iterates over all columns to compute and store their left and right boundaries
     * (based on cumulative widths). Resets the offset when a frozen column is encountered.
     */
    protected updateColumnCaches(): void;
    /**
     * Iterates over each column to (a) save its original width as widthRequest,
     * (b) apply default properties (using mixinDefaults if set) to both the column
     * and its autoSize property, (c) update the columnsById mapping, and (d) adjust
     * the width if it is less than minWidth or greater than maxWidth.
     */
    protected updateColumnProps(): void;
    /**
     * Sets grid columns. Column headers will be recreated and all rendered rows will be removed.
     * To rerender the grid (if necessary), call render().
     * @param {Column[]} columnDefinitions An array of column definitions.
     */
    setColumns(columnDefinitions: C[]): void;
    /** Update columns for when a hidden property has changed but the column list itself has not changed. */
    updateColumns(): void;
    /**
     * Triggers onBeforeUpdateColumns and calls updateColumnsInternal to update column properties,
     * caches, header/footer elements, CSS rules, canvas dimensions, and selections without changing the column array.
     */
    protected updateColumnsInternal(): void;
    /** Get Editor lock */
    getEditorLock(): SlickEditorLock;
    /** Get Editor Controller */
    getEditController(): EditController | undefined;
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
    /**
     * Returns the number of data items plus an extra row if enableAddRow is true and paging conditions allow.
     *
     * @returns
     */
    protected getDataLengthIncludingAddNew(): number;
    /**
     * Returns the databinding item at a given position.
     * @param {Number} index Item row index.
     */
    getDataItem(i: number): TData;
    /**  Are we using a DataView? */
    hasDataView(): boolean;
    /**
     * Returns item metadata by a row index when it exists
     * @param {Number} row
     * @returns {ItemMetadata | null}
     */
    getItemMetadaWhenExists(row: number): ItemMetadata | null;
    /**
     * Determines the proper formatter for a given cell by checking row metadata for column overrides,
     * then falling back to the column’s formatter, a formatter from the formatterFactory, or the default formatter.
     *
     * @param {number} row - The row index of the cell.
     * @param {C} column - The column definition containing formatting options.
     * @returns {Formatter} - The resolved formatter function for the specified cell.
     */
    protected getFormatter(row: number, column: C): Formatter;
    /**
     * Retrieves the editor (or editor constructor) for the specified cell by first checking for an override
     * in row metadata and then falling back to the column’s editor or an editor from the editorFactory.
     *
     * @param {number} row - The row index of the cell.
     * @param {number} cell - The column index of the cell.
     * @returns {Editor | EditorConstructor | null | undefined} - The editor instance or constructor if available, otherwise `null` or `undefined`.
     */
    protected getEditor(row: number, cell: number): Editor | EditorConstructor | null | undefined;
    /**
     * Returns the value for the specified column from a given data item. If a dataItemColumnValueExtractor
     * is provided in options, it is used; otherwise, the property named by the column’s field is returned.
     *
     * @param {TData} item - The data item containing the requested value.
     * @param {C} columnDef - The column definition containing the field key.
     * @returns {*} - The extracted value from the data item based on the column definition.
     */
    protected getDataItemValueForColumn(item: TData, columnDef: C): TData | TData[keyof TData];
    /** Resets active cell by making cell normal and other internal reset. */
    resetActiveCell(): void;
    /** Clear active cell by making cell normal & removing "active" CSS class. */
    unsetActiveCell(): void;
    /** @alias `setFocus` */
    focus(): void;
    protected setFocus(): void;
    /**
     * Clears any previously active cell (removing “active” CSS classes), sets the new active cell,
     * calculates its position, and updates active row and cell indices.
     * If conditions are met (grid is editable and `opt_editMode` is `true`),
     * it initiates editing on the cell (with an asynchronous delay if configured).
     * Finally, it triggers `onActiveCellChanged` unless suppressed.
     *
     * @param {HTMLDivElement | null} newCell - The new active cell element, or `null` to deactivate the current cell.
     * @param {boolean | null} [opt_editMode] - If `true`, enables edit mode for the active cell.
     *                                          If `null` or `undefined`, it follows `autoEditNewRow` and `autoEdit` settings.
     * @param {boolean | null} [preClickModeOn] - If `true`, indicates that the cell was activated by a pre-click action.
     * @param {boolean} [suppressActiveCellChangedEvent] - If `true`, prevents triggering `onActiveCellChanged` event.
     * @param {Event | SlickEvent_} [e] - The event that triggered the cell activation (if applicable).
     */
    protected setActiveCellInternal(newCell: HTMLDivElement | null, opt_editMode?: boolean | null, preClickModeOn?: boolean | null, suppressActiveCellChangedEvent?: boolean, e?: Event | SlickEvent_): void;
    /**
     * Checks whether data for the row is loaded, whether the cell is in an “Add New” row
     * (and the column disallows insert triggering), and whether an editor exists and the cell is not hidden.
     * Returns true if the cell is editable.
     *
     * @param {number} row - The row index of the cell.
     * @param {number} cell - The cell index (column index) within the row.
     * @returns {boolean} - Returns `true` if the cell is editable, otherwise `false`.
     */
    protected isCellPotentiallyEditable(row: number, cell: number): boolean;
    /**
     * Make the cell normal again (for example after destroying cell editor),
     * we can also optionally refocus on the current active cell (again possibly after closing cell editor)
     *
     * If an editor is active, triggers onBeforeCellEditorDestroy and calls the editor’s destroy method.
     * It then removes “editable” and “invalid” CSS classes from the active cell, re–applies the formatter
     * to restore the cell’s original content, invalidates any post–processing results,
     * and deactivates the editor lock. Optionally, it can also re–focus the grid.
     * In IE, it clears any text selection to ensure focus is properly reset.
     *
     * @param {Boolean} [refocusActiveCell]
     */
    protected makeActiveCellNormal(refocusActiveCell?: boolean): void;
    /**
     * A public method that starts editing on the active cell by calling
     * makeActiveCellEditable with the provided editor, pre–click flag, and event.
     */
    editActiveCell(editor?: EditorConstructor, preClickModeOn?: boolean | null, e?: Event): void;
    /**
     * Makes the currently active cell editable by initializing an editor instance.
     *
     * @param {EditorConstructor} [editor] - An optional custom editor constructor to use for editing.
     * @param {boolean | null} [preClickModeOn] - Indicates if pre-click mode is enabled.
     * @param {Event | SlickEvent_} [e] - The event that triggered editing.
     *
     * @throws {Error} If called when the grid is not editable.
     */
    protected makeActiveCellEditable(editor?: EditorConstructor, preClickModeOn?: boolean | null, e?: Event | SlickEvent_): void;
    /**
     * Commits the current edit and sets focus back to the grid.
     * If the commit fails due to validation, the focus remains in the editor.
     */
    protected commitEditAndSetFocus(): void;
    /**
     * Cancels the current edit and restores focus to the grid.
     */
    protected cancelEditAndSetFocus(): void;
    /**
     * Commits the current edit, validating and applying changes if necessary.
     * If validation fails, an error is triggered and focus remains in the editor.
     *
     * @returns {boolean} Whether the edit was successfully committed.
     */
    protected commitCurrentEdit(): boolean;
    /**
     * Cancels the current edit and restores the cell to normal mode.
     *
     * @returns {boolean} Always returns true.
     */
    protected cancelCurrentEdit(): boolean;
    /** Returns an array of row indices corresponding to the currently selected rows. */
    getSelectedRows(): number[];
    /**
     * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
     * @param {Array<number>} rowsArray - an array of row numbers.
     * @param {String} [caller] - an optional string to identify who called the method
     */
    setSelectedRows(rows: number[], caller?: string): void;
    /**
     * A generic helper that creates (or uses) a SlickEventData from the provided event,
     * attaches the grid instance to the event arguments, and calls notify on the given event.
     * Returns the result of the notification.
     *
     * @param {SlickEvent_} evt - The Slick event instance to trigger.
     * @param {ArgType} [args] - Optional arguments to pass with the event.
     * @param {Event | SlickEventData_} [e] - The original event object or SlickEventData.
     * @returns {*} - The result of the event notification.
     */
    protected trigger<ArgType = any>(evt: SlickEvent_, args?: ArgType, e?: Event | SlickEventData_): SlickEventData_<any>;
    /**
     * Handles the mouseout event for a cell.
     * Triggers the `onMouseLeave` event.
     *
     * @param {MouseEvent & { target: HTMLElement }} e - The mouse event.
     */
    protected handleCellMouseOut(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Handles mouse hover over a header cell.
     * Adds CSS classes to indicate a hover state.
     *
     * @param {Event | SlickEventData_} e - The mouse event.
     */
    protected handleHeaderMouseHoverOn(e: Event | SlickEventData_): void;
    /**
     * Handles mouse hover off a header cell.
     * Removes CSS classes indicating a hover state.
     *
     * @param {Event | SlickEventData_} e - The mouse event.
     */
    protected handleHeaderMouseHoverOff(e: Event | SlickEventData_): void;
    /**
     * Called when the grid’s selection model reports a change. It builds a new selection
     * (and CSS hash for selected cells) from the provided ranges, applies the new cell CSS styles,
     * and if the selection has changed from the previous state, triggers the onSelectedRowsChanged
     * event with details about added and removed selections.
     *
    * @param {SlickEventData_} e - The Slick event data for selection changes.
    * @param {SlickRange_[]} ranges - The list of selected row and cell ranges.
     */
    protected handleSelectedRangesChanged(e: SlickEventData_, ranges: SlickRange_[]): void;
    /**
     * Processes a mouse wheel event by adjusting the vertical scroll (scrollTop) based on deltaY (scaled by rowHeight)
     * and horizontal scroll (scrollLeft) based on deltaX. It then calls the internal scroll handler with the “mousewheel”
     * type and, if any scrolling occurred, prevents the default action.
     *
     * @param {MouseEvent} e - The mouse event.
     * @param {number} _delta - Unused delta value.
     * @param {number} deltaX - The horizontal scroll delta.
     * @param {number} deltaY - The vertical scroll delta.
     */
    protected handleMouseWheel(e: MouseEvent, _delta: number, deltaX: number, deltaY: number): void;
    /**
     * Called when a drag is initiated. It retrieves the cell from the event; if the cell does not exist or is not selectable,
     * it returns false. Otherwise, it triggers the onDragInit event and returns the event’s return value if
     * propagation is stopped, else returns false to cancel the drag.
     *
     * @param {DragEvent} e - The drag event.
     * @param {DragPosition} dd - The drag position data.
     * @returns {boolean} - Whether the drag is valid or should be cancelled.
     */
    protected handleDragInit(e: DragEvent, dd: DragPosition): any;
    /**
     * Similar to handleDragInit, this method retrieves the cell from the event
     * and triggers the `onDragStart` event. If the event propagation is stopped,
     * it returns the specified value; otherwise, it returns false.
     *
     * @param {DragEvent} e - The drag event that initiated the action.
     * @param {DragPosition} dd - The current drag position.
     * @returns {boolean} - The result of the event trigger or false if propagation was not stopped.
     */
    protected handleDragStart(e: DragEvent, dd: DragPosition): any;
    protected handleDrag(e: DragEvent, dd: DragPosition): any;
    protected handleDragEnd(e: DragEvent, dd: DragPosition): void;
    /**
     * Handles keydown events for grid navigation and editing.
     * It triggers the `onKeyDown` event and, based on the key pressed (such as HOME, END, arrow keys, PAGE_UP/DOWN, TAB, ENTER, ESC),
     * calls the appropriate navigation or editing method. If the key event is handled,
     * it stops propagation and prevents the default browser behaviour.
     *
     * @param {KeyboardEvent & { originalEvent: Event; }} e - The keydown event, with the original event attached.
     */
    protected handleKeyDown(e: KeyboardEvent & {
        originalEvent: Event;
    }): void;
    /**
     * Handles a click event on the grid. It logs the event (for debugging), ensures focus is restored if necessary,
     * triggers the onClick event, and if the clicked cell is selectable and not already active, scrolls it into view
     * and activates it.
     *
     * @param {DOMEvent<HTMLDivElement> | SlickEventData_} evt - The click event, either a native DOM event or a Slick event.
     */
    protected handleClick(evt: DOMEvent<HTMLDivElement> | SlickEventData_): void;
    /**
     * Retrieves the cell DOM element from the event target.
     * If the cell exists and is not currently being edited, triggers the onContextMenu event.
     */
    protected handleContextMenu(e: Event & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the cell from the event and triggers the onDblClick event.
     * If the event is not prevented and the grid is editable,
     * it initiates cell editing by calling gotoCell with edit mode enabled.
     */
    protected handleDblClick(e: MouseEvent): void;
    /**
     * When the mouse enters a header column element, retrieves the column definition from the element’s
     * stored data and triggers the onHeaderMouseEnter event with the column and grid reference.
     */
    protected handleHeaderMouseEnter(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Similar to handleHeaderMouseEnter, but triggers the onHeaderMouseLeave event
     * when the mouse leaves a header column element.
     */
    protected handleHeaderMouseLeave(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseEnter event.
     */
    protected handleHeaderRowMouseEnter(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseLeave event.
     */
    protected handleHeaderRowMouseLeave(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the header column element and its associated column definition,
     * then triggers the onHeaderContextMenu event with the column data.
     */
    protected handleHeaderContextMenu(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * If not in the middle of a column resize, retrieves the header column element and its column definition, then triggers the onHeaderClick event.
     */
    protected handleHeaderClick(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Triggers the onPreHeaderContextMenu event with the event target (typically the pre–header panel).
     */
    protected handlePreHeaderContextMenu(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * If not resizing columns, triggers the onPreHeaderClick event with the event target.
     */
    protected handlePreHeaderClick(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the footer cell element and its column definition, then triggers the onFooterContextMenu event.
     */
    protected handleFooterContextMenu(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Retrieves the footer cell element and its column definition, then triggers the onFooterClick event.
     */
    protected handleFooterClick(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Triggers the onMouseEnter event when the mouse pointer enters a cell element.
     */
    protected handleCellMouseOver(e: MouseEvent & {
        target: HTMLElement;
    }): void;
    /**
     * Handles the change in the position of the active cell.
     * Triggers the `onActiveCellPositionChanged` event and adjusts the editor visibility and positioning.
     */
    protected handleActiveCellPositionChange(): void;
    /**
     * limits the frequency at which the provided action is executed.
     * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
     * call dequeue to cancel any pending action.
     */
    protected actionThrottle(action: () => void, minPeriod_ms: number): {
        enqueue: () => void;
        dequeue: () => void;
    };
    /**
     * Returns a hash containing row and cell indexes from a standard W3C event.
     * @param {*} event A standard W3C event.
     */
    getCellFromEvent(evt: Event | SlickEventData_): {
        row: number;
        cell: number;
    } | null;
    /**
     * Apply HTML code by 3 different ways depending on what is provided as input and what options are enabled.
     * 1. value is an HTMLElement or DocumentFragment, then first empty the target and simply append the HTML to the target element.
     * 2. value is string and `enableHtmlRendering` is enabled, then use `target.innerHTML = value;`
     * 3. value is string and `enableHtmlRendering` is disabled, then use `target.textContent = value;`
     * @param {HTMLElement} target  - target element to apply to
     * @param {string | HTMLElement | DocumentFragment} val - input value can be either a string or an HTMLElement
     * @param {{ emptyTarget?: boolean; skipEmptyReassignment?: boolean; }} [options]  -
     *   `emptyTarget`, defaults to true, will empty the target.
     *   `skipEmptyReassignment`, defaults to true, when enabled it will not try to reapply an empty value when the target is already empty
     */
    applyHtmlCode(target: HTMLElement, val: string | HTMLElement | DocumentFragment, options?: {
        emptyTarget?: boolean;
        skipEmptyReassignment?: boolean;
    }): void;
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
    /**
     * Calls setActiveViewportNode (using the provided event) to set the active viewport,
     * then returns the active viewport DOM element.
     *
     * @param e
     * @returns
     */
    getActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement;
    /**
     * Sets an active viewport node
     *
     * @param {number | string} [columnIdOrIdx] - The column identifier or index.
     * @param {number} [rowIndex] - The row index.
     * @returns {HTMLElement} The corresponding viewport element.
     */
    setActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement;
    /** Get the headers width in pixel
     *
     * Iterates over all columns to accumulate the widths for the left and right header sections,
     * adds scrollbar width if needed, and adjusts for frozen columns.
     * Returns the computed overall header width in pixels.
    */
    getHeadersWidth(): number;
    /** Get the grid canvas width
     *
     * Computes the available width (considering vertical scrollbar if present),
     * then iterates over the columns (left vs. right based on frozen columns) to sum their widths.
     * If full–width rows are enabled, extra width is added. Returns the total calculated width.
    */
    getCanvasWidth(): number;
    /**
     * Recalculates the canvas width by calling getCanvasWidth and then adjusts widths of header containers,
     * canvases, panels, and viewports. If widths have changed (or forced), it applies the new column widths
     * by calling applyColumnWidths.
     *
     * @param {boolean} [forceColumnWidthsUpdate] - Whether to force an update of column widths.
     */
    protected updateCanvasWidth(forceColumnWidthsUpdate?: boolean): void;
    /** @alias `getPreHeaderPanelLeft` */
    getPreHeaderPanel(): HTMLDivElement;
    /** Get the Pre-Header Panel Left DOM node element */
    getPreHeaderPanelLeft(): HTMLDivElement;
    /** Get the Pre-Header Panel Right DOM node element */
    getPreHeaderPanelRight(): HTMLDivElement;
    /** Get the Top-Header Panel DOM node element */
    getTopHeaderPanel(): HTMLDivElement;
    /**
     * Based on whether frozen columns (and/or rows) are enabled, shows or hides the right–side header
     * and top panes as well as the bottom panes. If no frozen columns exist, hides right–side panes;
     * otherwise, conditionally shows or hides the bottom panes depending on whether frozen rows exist.
     */
    protected setPaneVisibility(): void;
    /**
     * Sets the CSS overflowX and overflowY styles for all four viewport elements
     * (top–left, top–right, bottom–left, bottom–right) based on the grid’s frozen columns/rows status
     * and options such as alwaysAllowHorizontalScroll and alwaysShowVerticalScroll.
     * If a viewportClass is specified in options, the class is added to each viewport.
     */
    protected setOverflow(): void;
    /**
     * Creates a <style> element (using a provided nonce if available) and appends it to the shadowRoot (or document head).
     * Inserts rules that set heights for panels, header rows, footer rows, and cells based on grid options.
     * It also loops through each column (if not hidden) to add empty rules for left and right column classes.
     * If the stylesheet cannot be accessed via the modern API, it falls back to createCssRulesAlternative.
     */
    protected createCssRules(): void;
    /** Create CSS rules via template in case the first approach with createElement('style') doesn't work.
     *
     * In cases where the standard method of inserting CSS rules fails (as may occur in some environments),
     * this function creates a <style> element using a template, appends it to the document, and then adds
     * the provided CSS rules as a concatenated text node.
     * Also appends rules for each visible column for left and right classes.
     */
    protected createCssRulesAlternative(rules: string[]): void;
    /**
     * Finds and caches the CSS rules from the grid’s dynamically created stylesheet
     * that correspond to a column’s left (".lX") and right (".rX") classes.
     * Returns an object containing the left and right rule objects for the specified column index.
     * If the stylesheet has not been located yet, it iterates through available styleSheets to find it.
     *
     * @param idx
     * @returns
     */
    protected getColumnCssRules(idx: number): {
        left: {
            selectorText: string;
        };
        right: {
            selectorText: string;
        };
    };
    /**
     * Removes the dynamically created <style> element (if it exists) from the DOM and
     * clears the cached stylesheet reference.
     */
    protected removeCssRules(): void;
    /** Get Top Panel DOM element */
    getTopPanel(): HTMLDivElement;
    /** Get Top Panels (left/right) DOM element */
    getTopPanels(): HTMLDivElement[];
    /**
     * Based on the provided option (e.g. showTopPanel, showHeaderRow, etc.) and the target container(s),
     * sets the grid option to the desired visibility. It then either slides down/up the container
     * (if animation is enabled) or shows/hides it immediately, followed by a canvas resize.
     * @param {'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel' | 'showTopHeaderPanel'} option - The grid option to modify.
     * @param {HTMLElement | HTMLElement[]} container - The panel element(s) to show or hide.
     * @param {boolean} [visible] - Whether the panel should be visible.
     * @param {boolean} [animate] - Whether to animate the visibility change.
     */
    protected togglePanelVisibility(option: 'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel' | 'showTopHeaderPanel', container: HTMLElement | HTMLElement[], visible?: boolean, animate?: boolean): void;
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
    /**
     * Set the Top-Header Visibility
     * @param {Boolean} [visible] - optionally set if top-header panel is visible or not
     */
    setTopHeaderPanelVisibility(visible?: boolean): void;
    /**
     * Retrieves the height of a row.
     *
     * @returns {number} The row height defined in the grid options.
     */
    protected getRowHeight(): number;
    /**
     * Returns the top pixel position for a given row, based on the row height and current vertical offset.
     *
     * @param {number} row - The row index.
     * @returns {number} The pixel position of the top of the row.
     */
    protected getRowTop(row: number): number;
    /**
     * Returns the bottom pixel position for a given row, based on the row height and current vertical offset.
     *
     * @param {number} row - The row index.
     * @returns {number} The pixel position of the bottom of the row.
     */
    protected getRowBottom(row: number): number;
    /**
     * Computes the row index corresponding to a given vertical pixel position (taking the current offset into account).
     *
     * @param {number} y - The vertical position in pixels.
     * @returns {number} The calculated row index.
     */
    protected getRowFromPosition(y: number): number;
    /**
     * Creates a row container element with CSS classes (e.g. active, odd/even, frozen, loading) based on the row’s state
     * and metadata. It positions the row using getRowTop (adjusting for frozen rows), clones the row for frozen-column
     * support if needed, and iterates over each column to call appendCellHtml
     * for each cell that is within the visible viewport range.
     *
     * @param {HTMLElement[]} divArrayL - The array to store left-side row elements.
     * @param {HTMLElement[]} divArrayR - The array to store right-side row elements (for frozen columns).
     * @param {number} row - The row index to be rendered.
     * @param {CellViewportRange} range - The visible viewport range for rendering cells.
     * @param {number} dataLength - The total data length to determine if the row is loading.
     */
    protected appendRowHtml(divArrayL: HTMLElement[], divArrayR: HTMLElement[], row: number, range: CellViewportRange, dataLength: number): void;
    /**
     * Creates a cell element with appropriate CSS classes (including frozen and active classes) and retrieves its value
     * via the formatter. It applies additional CSS classes from event return values and formatter results,
     * sets tooltips if provided, and inserts any additional DOM elements if required. It then appends the cell element
     * to the row container and updates the row’s cellRenderQueue and cellColSpans in the rowsCache.
     *
     * @param {HTMLElement} divRow - The row container element to append the cell to.
     * @param {number} row - The row index where the cell belongs.
     * @param {number} cell - The column index of the cell.
     * @param {number} colspan - The column span value for the cell.
     * @param {number} rowspan - The row span value for the cell.
     * @param {ColumnMetadata | null} columnMetadata - The metadata associated with the column, if available.
     * @param {TData} item - The data item corresponding to the row.
     */
    protected appendCellHtml(divRow: HTMLElement, row: number, cell: number, colspan: number, rowspan: number, columnMetadata: ColumnMetadata | null, item: TData): void;
    /**
     * Iterates over keys in the rowsCache and, for each row that is not the active row and falls
     * outside the provided visible range (and is not a frozen row), calls removeRowFromCache to remove
     * its DOM elements. If asynchronous post–render cleanup is enabled, it triggers that process afterward.
     *
     * @param {{ bottom: number; top: number; }} rangeToKeep - The range of rows to keep.
     */
    protected cleanupRows(rangeToKeep: {
        bottom: number;
        top: number;
    }): void;
    /** Invalidate all grid rows and re-render the visible grid rows */
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
    /**
     * Given a row index, retrieves the corresponding cache entry. If asynchronous post–render cleanup is enabled
     * and post–processed results exist, queues cleanup actions; otherwise, removes the row nodes from the DOM.
     * It then deletes the row’s entry from rowsCache and postProcessedRows, decrements the rendered row count,
     * and increments a removal counter.
     *
     * @param {number} row - The index of the row to remove.
     */
    protected removeRowFromCache(row: number): void;
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
    /**
     * Calculates the vertical height available for displaying grid rows. In auto–height mode it sums panel heights
     * (header, footer, top panel) plus the total row height; otherwise, it subtracts header, footer, pre–header,
     * top–header heights and container paddings from the container’s computed height. It also computes and stores
     * the number of visible rows.
     */
    getViewportHeight(): number;
    /** returns the available viewport inner width, that is the viewport width minus the scrollbar when shown */
    protected getViewportInnerWidth(): number;
    /**
     * Returns the width of the grid’s viewport by measuring the inner width of the grid container (using a utility function).
     * It falls back to a devMode–specified width if necessary.
     */
    getViewportWidth(): number;
    /** Execute a Resize of the Grid Canvas.
     *
     * Recalculates the grid’s canvas, pane, and viewport dimensions based on the current container size,
     * frozen rows/columns settings, and auto–height configuration. It then applies these dimensions to various DOM elements
     * (panes, viewports, canvases) and updates the scrollbar dimensions.
     * Finally, it updates the row count, handles scrolling, and forces a re–render.
     */
    resizeCanvas(): void;
    /** Update the dataset row count */
    updateRowCount(): void;
    /** @alias `getVisibleRange` */
    getViewport(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    /**
     * Returns an object with the top and bottom row indices that are visible in the viewport, as well
     * as the left and right pixel boundaries.
     * It uses the current (or provided) scroll positions and viewport dimensions.
     *
     * @param {number} [viewportTop] - The top scroll position.
     * @param {number} [viewportLeft] - The left scroll position.
     * @returns {{ top: number; bottom: number; leftPx: number; rightPx: number }} The visible range.
     */
    getVisibleRange(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    /**
     * Computes the range of rows (and horizontal pixel boundaries) that should be rendered,
     * including an additional buffer (based on row height and a minimum buffer) determined by
     * the current vertical scroll direction.
     * This range is used to decide which rows and cells to render.
     *
     * @param {number} [viewportTop] - The top scroll position.
     * @param {number} [viewportLeft] - The left scroll position.
     * @returns {{ top: number; bottom: number; leftPx: number; rightPx: number }} The rendered range.
     */
    getRenderedRange(viewportTop?: number, viewportLeft?: number): {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
    /**
     * Returns the rows cache that are currently rendered in the DOM,
     * the cache includes certain properties like the row div element, cell rendered queue and the row colspan when defined.
     */
    getRowCache(): Record<number, RowCaching>;
    /**
     * Ensures that the row’s cache entry contains all cell DOM nodes by transferring nodes
     * from the cellRenderQueue into the cellNodesByColumnIdx array. This is used to guarantee
     * that each cell is indexed properly for later updates.
     *
     * @param {number} row - The row index to ensure cell nodes exist for.
     */
    protected ensureCellNodesInRowsCache(row: number): void;
    /**
     * For the specified row and a given horizontal visible range, iterates over the cached cell nodes and
     * removes those cells that fall completely outside the visible range (except for frozen or always–rendered cells).
     * Cells are either removed immediately or queued for asynchronous cleanup if enabled.
     * @param {CellViewportRange} range - The visible cell viewport range.
     * @param {number} row - The row index to clean up.
     */
    protected cleanUpCells(range: CellViewportRange, row: number): void;
    /**
     * Iterates over each row in the provided rendered range. For each row, ensures cell nodes exist,
     * calls cleanUpCells to remove outdated cells, and then renders any missing cells (by calling appendCellHtml)
     * for columns that are now within the viewport. Finally, processes the row’s cellRenderQueue to attach rendered
     * cells to the correct row containers (handling frozen columns), and reselects the active cell if needed.
     */
    protected cleanUpAndRenderCells(range: CellViewportRange): void;
    /**
     * Iterates over the row indices in the given rendered range and, for each row not yet in the cache,
     * creates a new cache entry and calls appendRowHtml to build the row’s cell content. Once built,
     * the row is appended to the appropriate canvas element (top or bottom, left or right depending on frozen settings).
     * If the active cell is rendered, it reselects it.
     *
     * @param {{ top: number; bottom: number; leftPx: number; rightPx: number; }} range - The range of rows to render.
     */
    protected renderRows(range: {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    }): void;
    /**
     * Iterates over each row in the rowsCache and updates the top position of the row’s DOM element
     * using the getRowTop calculation. Depending on the grid option, it either uses CSS transform
     * or sets the top property directly.
     */
    protected updateRowPositions(): void;
    /**
     * (re)Render the grid
     *
     * Main rendering method that first dequeues any pending scroll throttling, then obtains the visible and rendered ranges.
     * It removes rows no longer visible, calls cleanUpAndRenderCells and renderRows to render missing cells and new rows,
     * and, if frozen rows are present, renders them separately. It then sets post–processing boundaries, starts post–processing,
     * updates scroll positions, and triggers the onRendered event.
     */
    render(): void;
    /**
     * Get frozen (pinned) row offset
     *
     * Returns the vertical pixel offset to apply for frozen rows.
     * Depending on whether frozen rows are pinned at the bottom or top and based on grid height,
     * it returns either a fixed frozen rows height or a calculated offset.
     *
     * @param {Number} row - grid row number
     */
    getFrozenRowOffset(row: number): number;
    /**
     * Traverses up from a specific canvas element and binds a scroll event handler
     * (to update active cell positions) on each ancestor element that is scrollable.
     * Also stores these ancestors for later unbinding.
     */
    protected bindAncestorScrollEvents(): void;
    /**
     * Iterates through the stored ancestor elements (in _boundAncestors)
     * and unbinds any scroll events previously attached, then clears the stored array.
     */
    protected unbindAncestorScrollEvents(): void;
    /**
     * Chooses which viewport container(s) will serve as the scroll container for horizontal and vertical scrolling.
     * The selection depends on whether the grid has frozen columns and/or frozen rows and whether frozenBottom is set.
     */
    protected setScroller(): void;
    /**
     * Scroll to a Y position in the grid (clamped to valid bounds)
     *
     * Updates internal offsets, recalculates the visible range, cleans up rows outside the viewport,
     * updates row positions, and triggers the onViewportChanged event.
     *
     * @param {Number} y
     */
    scrollTo(y: number): void;
    protected handleHeaderRowScroll(): void;
    protected handleFooterRowScroll(): void;
    /** Invokes handleElementScroll for the pre–header panel scroller to synchronize its
     * horizontal scroll position with the main viewport.
     */
    protected handlePreHeaderPanelScroll(): void;
    /**
     * Invokes handleElementScroll for the top–header panel scroller to synchronize its horizontal
     * scroll position with the main viewport.
     */
    protected handleTopHeaderPanelScroll(): void;
    /**
     * Given a DOM element, checks its scrollLeft value and, if it differs from the viewport scroll
     * container’s scrollLeft, updates the latter to match.
     *
     * @param {HTMLElement} element - The element whose scroll position needs to be synced.
     */
    protected handleElementScroll(element: HTMLElement): void;
    /**
     * Called when the grid’s main scroll container scrolls. Updates internal scroll properties (scrollHeight,
     * scrollTop, scrollLeft) from the container, then calls _handleScroll (with an argument
     * indicating whether the event came from a system event or a mousewheel).
     * Returns the result of _handleScroll.
     *
     * @param {Event} [e] - The scroll event.
     * @returns {boolean} The result of `_handleScroll`.
     */
    protected handleScroll(e?: Event): boolean;
    /**
     * Handles the detailed processing of a scroll event. It calculates maximum allowed scroll distances,
     * clamps the current scrollTop/scrollLeft to valid bounds, computes vertical and horizontal scroll distances,
     * and if significant horizontal scroll occurred, synchronizes various elements (header, panels, etc.)
     * to the new scrollLeft. For vertical scroll (if autoHeight is off), updates the virtual scrolling page,
     * offset, and may invalidate all rows. Finally, if scroll distances exceed thresholds, either calls render
     * immediately or enqueues rendering via a throttle; triggers onViewportChanged and onScroll events with
     * detailed parameters (including the cell at the top–left).
     *
     * Returns true if any scroll movement occurred, else false.
     *
     * @param {'mousewheel' | 'scroll' | 'system'} [eventType='system'] - The type of scroll event.
     * @returns {boolean} True if any scroll movement occurred, otherwise false.
     */
    protected _handleScroll(eventType?: 'mousewheel' | 'scroll' | 'system'): boolean;
    /** Scroll to a specific cell and make it into the view
     *
     * First calls scrollRowIntoView for the row. If the cell is not in a frozen column,
     * calculates the cell’s colspan and then calls internalScrollColumnIntoView with the
     * cell’s left and right boundaries.
     */
    scrollCellIntoView(row: number, cell: number, doPaging?: boolean): void;
    /**
     * Checks if the given left/right pixel boundaries are outside the current
     * horizontal scroll position of the viewport container.
     * If so, adjusts scrollLeft appropriately and triggers a re–render.
     *
     * @param left
     * @param right
     */
    protected internalScrollColumnIntoView(left: number, right: number): void;
    /**
     * Scroll to a specific column and show it into the viewport
     * @param {Number} cell - cell column number
     */
    scrollColumnIntoView(cell: number): void;
    /**
     * Update paging information status from the View
     * @param {PagingInfo} pagingInfo
     */
    updatePagingStatusFromView(pagingInfo: Pick<PagingInfo, 'pageSize' | 'pageNum' | 'totalPages'>): void;
    /**
     * from a row number, return any column indexes that intersected with the grid row including the cell
     * @param {Number} row - grid row index
     */
    getRowSpanColumnIntersects(row: number): number[];
    /**
     * from a row number, verify if the rowspan is intersecting and return it when found,
     * otherwise return `null` when nothing is found or when the rowspan feature is disabled.
     * @param {Number} row - grid row index
     */
    getRowSpanIntersect(row: number): number | null;
    /**
     * Determines the intersection of a given row with row span metadata.
     * Depending on the `outputType` parameter, it returns either the intersecting columns
     * or the start row of the span.
     *
     * @template R - The return type, either an array of column indices or a single row index.
     * @param {number} row - The row index to check for intersections.
     * @param {'columns' | 'start'} [outputType] - Determines the output type:
     *   - `'columns'`: Returns an array of column indices that intersect with the row span.
     *   - `'start'`: Returns the starting row index of the intersecting row span.
     * @returns {R} The intersection result based on the specified output type.
     */
    protected getRowSpanIntersection<R>(row: number, outputType?: 'columns' | 'start'): R;
    /**
     * Returns the parent rowspan details when child cell are spanned from a rowspan or `null` when it's not spanned.
     * By default it will exclude the parent cell that holds the rowspan, and return `null`, that initiated the rowspan unless the 3rd argument is disabled.
     * The exclusion is helpful to find out when we're dealing with a child cell of a rowspan
     * @param {Number} row - grid row index
     * @param {Number} cell - grid cell/column index
     * @param {Boolean} [excludeParentRow] - should we exclude the parent who initiated the rowspan in the search (defaults to true)?
     */
    getParentRowSpanByCell(row: number, cell: number, excludeParentRow?: boolean): {
        start: number;
        end: number;
        range: string;
    } | null;
    /**
     * Remap all the rowspan metadata by looping through all dataset rows and keep a cache of rowspan by column indexes
     * For example:
     *  1- if 2nd row of the 1st column has a metadata.rowspan of 3 then the cache will be: `{ 0: '1:4' }`
     *  2- if 2nd row if the 1st column has a metadata.rowspan of 3 AND a colspan of 2 then the cache will be: `{ 0: '1:4', 1: '1:4' }`
     */
    remapAllColumnsRowSpan(): void;
    /**
     * Remaps row span metadata for a given row by iterating through its column metadata.
     * Calls `remapRowSpanMetadata` for each column to update row span information.
     *
     * @param {number} row - The row index for which to remap row span metadata.
     */
    protected remapRowSpanMetadataByRow(row: number): void;
    /**
     * Updates the row span metadata for a given row and cell.
     * If a cell spans multiple rows, it records the span in `_colsWithRowSpanCache`.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} colspan - The number of columns the cell spans.
     * @param {number} rowspan - The number of rows the cell spans.
     */
    protected remapRowSpanMetadata(row: number, cell: number, colspan: number, rowspan: number): void;
    /**
     * Creates an empty row caching object to store metadata about rendered row elements.
     * Used to optimize cell rendering and access within the grid.
     */
    protected createEmptyCachingRow(): RowCaching;
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
    /**
     * Scrolls the grid by a full page in the specified direction.
     * Adjusts the scroll position and re-renders the grid accordingly.
     * If cell navigation is enabled, it also updates the active cell position.
     *
     *  * @param {number} dir - The direction to scroll:
     *   - `1` for scrolling down
     *   - `-1` for scrolling up
     *    Acts as a multiplier on numVisibleRows
     */
    protected scrollPage(dir: number): void;
    /** Navigate (scroll) by a page down */
    navigatePageDown(): void;
    /** Navigate (scroll) by a page up */
    navigatePageUp(): void;
    /** Navigate to the top of the grid */
    navigateTop(): void;
    /** Navigate to the bottom of the grid */
    navigateBottom(): void;
    /**
     * Navigates to a specified row, ensuring it is visible and selecting an active cell if applicable.
     * Adjusts the scroll position and updates the active cell based on cell navigation rules.
     *
     * @param {number} row - The row index to navigate to.
     * @returns {boolean} Whether the navigation was successful.
     */
    navigateToRow(row: number): boolean;
    /**
     * Retrieves the colspan for a specified cell in a row, determining how many columns it spans.
     * Uses column metadata to derive the correct colspan value.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @returns {number} The number of columns the cell spans.
     */
    protected getColspan(row: number, cell: number): number;
    /**
     * Increments an internal group id and, for each column in the provided postProcessedRow object,
     * queues a cleanup action (action type 'C') for that cell. It also queues a cleanup action for the
     * entire row (action type 'R') and removes all row nodes from the DOM.
     *
     * @param {RowCaching} cacheEntry - The cache entry for the row.
     * @param {any} postProcessedRow - The object containing post-processed row data.
     * @param {number} rowIdx - The index of the row being processed.
     */
    protected queuePostProcessedRowForCleanup(cacheEntry: RowCaching, postProcessedRow: any, rowIdx: number): void;
    /**
     * Queues a cleanup action (action type 'C') for the provided cell DOM element and
     * immediately removes the cell element from the DOM.
     *
     * @param {HTMLElement} cellnode - The DOM element representing the cell.
     * @param {number} columnIdx - The column index of the cell.
     * @param {number} rowIdx - The row index of the cell.
     */
    protected queuePostProcessedCellForCleanup(cellnode: HTMLElement, columnIdx: number, rowIdx: number): void;
    /** Apply a Formatter Result to a Cell DOM Node
     *
     * If the formatter result is not an object, it is applied directly as HTML/text;
     * otherwise, it extracts the content (from a property such as “html” or “text”) and applies it.
     * Additionally, it conditionally removes or adds CSS classes and sets a tooltip on the cell.
     */
    applyFormatResultToCellNode(formatterResult: FormatterResultWithHtml | FormatterResultWithText | string | HTMLElement | DocumentFragment, cellNode: HTMLDivElement, suppressRemove?: boolean): void;
    /**
     * If asynchronous post–rendering is enabled, clears any existing post–render timer and sets a new timeout
     * to call asyncPostProcessRows after the configured delay.
     *
     * @returns {void}
     */
    protected startPostProcessing(): void;
    /**
     * If asynchronous post–render cleanup is enabled, clears any existing cleanup timer and
     * sets a new timeout to call asyncPostProcessCleanupRows after the configured delay.
     *
     * @returns {void}
     */
    protected startPostProcessingCleanup(): void;
    /**
     * For the specified row, if post–processed results exist, sets each column’s status to “C” (indicating cleanup is needed),
     * adjusts the postProcessFromRow and postProcessToRow boundaries, and starts the post–processing timer.
     *
     * @param {number} row - The index of the row to invalidate.
     */
    protected invalidatePostProcessingResults(row: number): void;
    /**
     * Iterates over the range of rows defined by postProcessFromRow and postProcessToRow
     * (direction determined by vScrollDir). For each row found in the cache,
     * it ensures cell nodes exist, then for each cell that has an async post–render function
     * and is not yet rendered (status not “R”), it calls the asyncPostRender callback
     * (passing a flag if cleanup is needed). Finally, it schedules another asynchronous
     * processing cycle using a timeout with the configured delay.
     *
     * @returns {void}
     */
    protected asyncPostProcessRows(): void;
    /**
     * Checks if there are cleanup queue entries; if so, it retrieves the group id from the first entry and processes
     * (removes) all entries in the queue with that group id. For each entry, if the action type is “R”,
     * it removes all nodes in the array; if “C”, it calls the asyncPostRenderCleanup callback on the
     * corresponding column. It then schedules another cleanup cycle using the configured delay.
     */
    protected asyncPostProcessCleanupRows(): void;
    /**
     * Iterates over every row in the rows cache. For each row, if there is a removed hash (previous CSS classes)
     * and/or an added hash (new CSS classes), then for each column key it retrieves the cell node and removes any
     * CSS class from the removed hash (if not re–added) and adds CSS classes from the added hash.
     * This synchronises the cell CSS overlays with the provided hash changes.
     *
     * @param {CssStyleHash | null} [addedHash] - A hash of CSS styles to be added.
     * @param {CssStyleHash | null} [removedHash] - A hash of CSS styles to be removed.
     */
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
    /**
     * Helper method that selects the proper container element from a provided array based on the column
     * identifier/index and row index. It calculates whether the target should be from the “bottom” or
     * “right” side based on frozen rows/columns.
     *
     * @param {HTMLElement[]} targetContainers - The array of possible container elements.
     * @param {number | string} [columnIdOrIdx] - The column identifier or index.
     * @param {number} [rowIndex] - The row index.
     * @returns {HTMLElement | undefined} The selected container element or undefined if not found.
     */
    protected _getContainerElement(targetContainers: HTMLElement[], columnIdOrIdx?: number | string, rowIndex?: number): HTMLElement | undefined;
    /**
     * Dynamically creates temporary DOM elements to measure the difference between offsetWidth/Height
     * and clientWidth/Height, thereby computing the scrollbar width and height. After measuring, it
     * removes the temporary elements and returns the dimensions.
     *
     * @returns {{ width: number; height: number }} The computed scrollbar dimensions.
     */
    protected measureScrollbar(): {
        width: number;
        height: number;
    };
    /**
     * Dynamically doubles a test height on a temporary element until the element no longer accepts the height
     * (or exceeds a browser-specific maximum). Returns the highest supported CSS height in pixels.
     *
     * @returns {number} The highest supported CSS height in pixels.
     */
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
    /**
     * Returns an object with width and height of scrollbars currently displayed in the viewport (zero if not visible).
     */
    getDisplayedScrollbarDimensions(): {
        width: number;
        height: number;
    };
    /** Get the absolute column minimum width */
    getAbsoluteColumnMinWidth(): number;
    /**
     * Calculates the vertical box sizes (the sum of top/bottom borders and paddings)
     * for a given element by reading its computed style.
     * @param el
     * @returns number
     */
    protected getVBoxDelta(el: HTMLElement): number;
    /**
     * Creates temporary elements in the header and a grid cell to calculate the extra width
     * and height added by borders and padding (when box-sizing is not “border-box”).
     * Sets internal properties (headerColumnWidthDiff, headerColumnHeightDiff, cellWidthDiff, cellHeightDiff)
     * and computes the absoluteColumnMinWidth as the maximum of the header and cell width differences.
     *
     */
    protected measureCellPaddingAndBorder(): void;
    /** Clear all highlight timers that might have been left opened */
    protected clearAllTimers(): void;
    /** Logs a string to the console listing each column’s width (or “H” if hidden) for debugging purposes. */
    protected LogColWidths(): void;
    simpleArrayEquals(arr1: any[], arr2: any[]): boolean;
    /**
     * Converts a value to a string and escapes HTML characters (&, <, >). Returns an empty string if the value is not defined.
     */
    protected defaultFormatter(_row: number, _cell: number, value: any): string;
    /** Returns false if the specified row or cell index is out of bounds or if the column is hidden; otherwise returns true. */
    protected cellExists(row: number, cell: number): boolean;
    /** Reads the CSS class (of the form “l<number>”) from the given cell DOM node to extract and return the column index. Throws an error if not found. */
    protected getCellFromNode(cellNode: HTMLElement): number;
    /** Iterates through the rows cache to find which row’s DOM element matches the given node and returns its row index; returns null if not found. */
    protected getRowFromNode(rowNode: HTMLElement): number | null;
    /** Clears the current text selection using IE’s document.selection.empty (if available) or window.getSelection to remove all ranges. */
    protected clearTextSelection(): void;
    /**
     * For each provided element in target, sets the “unselectable” attribute, disables Mozilla’s user selection style,
     * and binds a “selectstart” event that always returns false, thus disabling text selection.
     *
     * @param target
     */
    protected disableSelection(target: HTMLElement[]): void;
    /** Get the displayed scrollbar dimensions */
    getPubSubService(): BasePubSub | undefined;
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
    /** Get a Plugin (addon) by its name */
    getPluginByName<P extends SlickPlugin | undefined = undefined>(name: string): P | undefined;
    /** Get Grid Canvas Node DOM Element */
    getContainerNode(): HTMLElement;
    /**
     * Computes the height of a cell, taking into account row span if applicable.
     *
     * @param {number} row - The row index of the cell.
     * @param {number} rowspan - The number of rows the cell spans.
     * @returns {number} The computed cell height in pixels.
     */
    getCellHeight(row: number, rowspan: number): number;
    /**
     * Computes the difference between two sets, returning elements that exist in `a` but not in `b`.
     * This serves as a polyfill for `Set.prototype.difference()` introduced in ES2024.
     *
     * @param {Set<number>} a - The base set from which elements will be removed.
     * @param {Set<number>} b - The set containing elements to be excluded from `a`.
     * @returns {Set<number>} A new set containing elements present in `a` but not in `b`.
     */
    protected setDifference(a: Set<number>, b: Set<number>): Set<number>;
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
    /**
     * Computes the absolute position of an element relative to the document,
     * taking into account offsets, scrolling, and visibility within scrollable containers.
     *
     * @param {HTMLElement} elem - The element to compute the absolute position for.
     * @returns {Object} An object containing:
     *   - `top`: The top position relative to the document.
     *   - `left`: The left position relative to the document.
     *   - `bottom`: The bottom position relative to the document.
     *   - `right`: The right position relative to the document.
     *   - `width`: The width of the element.
     *   - `height`: The height of the element.
     *   - `visible`: A boolean indicating whether the element is visible within its scrollable container.
     *     This accounts for both vertical (`overflowY`) and horizontal (`overflowX`) visibility.
     */
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
    /**
     * Sets the text selection to the specified range within the document.
     * Clears any existing selections before applying the new range.
     *
     * @param {Range} selection - The text range to be selected.
     */
    protected setTextSelection(selection: Range): void;
    /** html sanitizer to avoid scripting attack */
    sanitizeHtmlString(dirtyHtml: string, suppressLogging?: boolean): string;
    /**
     * Retrieves the rowspan value for a specific cell in a row.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @returns {number} The number of rows the cell spans.
     */
    protected getRowspan(row: number, cell: number): number;
    /**
     * Finds the nearest focusable row in the specified direction.
     *
     * @param {number} row - The current row index.
     * @param {number} cell - The column index.
     * @param {'up' | 'down'} dir - The direction to search for a focusable row.
     * @returns {number} The index of the focusable row.
     */
    protected findFocusableRow(row: number, cell: number, dir: 'up' | 'down'): number;
    /**
     * Finds the first focusable cell in a given row.
     *
     * @param {number} row - The row index.
     * @returns {{ cell: number; row: number; }} The first focusable cell and its row.
     */
    protected findFirstFocusableCell(row: number): {
        cell: number;
        row: number;
    };
    /**
     * Finds the last focusable cell in a given row.
     *
     * @param {number} row - The row index.
     * @returns {{ cell: number; row: number; }} The last focusable cell and its row.
     */
    protected findLastFocusableCell(row: number): {
        cell: number;
        row: number;
    };
    /**
     * Converts an array of row indices into a range format.
     *
     * @param {number[]} rows - The row indices.
     * @returns {SlickRange_[]} An array of ranges covering the specified rows.
     */
    protected rowsToRanges(rows: number[]): SlickRange_[];
    /**
     * From any row/cell indexes that might have colspan/rowspan, find its starting indexes
     * For example, if we start at 0,0 and we have colspan/rowspan of 4 for both and our indexes is row:2,cell:3
     * then our starting row/cell is 0,0. If a cell has no spanning at all then row/cell output is same as input
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @returns {{ cell: number; row: number; }} The starting cell position.
     */
    findSpanStartingCell(row: number, cell: number): {
        cell: number;
        row: number;
    };
    /**
     * Moves the focus to the right within the grid.
     *
     * @param {number} _row - The row index.
     * @param {number} cell - The column index.
     * @param {number} posY - The current vertical position.
     * @param {number} [_posX] - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoRight(_row: number, cell: number, posY: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus to the left within the grid.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} posY - The current vertical position.
     * @param {number} [_posX] - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoLeft(row: number, cell: number, posY: number, _posX?: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus downward within the grid.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} _posY - The current vertical position.
     * @param {number} posX - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoDown(row: number, cell: number, _posY: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus upward within the grid.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} _posY - The current vertical position.
     * @param {number} posX - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoUp(row: number, cell: number, _posY: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus to the next cell in the grid.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} posY - The current vertical position.
     * @param {number} posX - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoNext(row: number, cell: number, posY: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus to the previous cell in the grid.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @param {number} posY - The current vertical position.
     * @param {number} posX - The current horizontal position.
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoPrev(row: number, cell: number, posY: number, posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus to the first focusable cell in a row.
     *
     * @param {number} row - The row index.
     * @param {number} _cell - The column index (ignored).
     * @param {number} _posY - The current vertical position (ignored).
     * @param {number} _posX - The current horizontal position (ignored).
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoRowStart(row: number, _cell: number, _posY: number, _posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
    } | null;
    /**
     * Moves the focus to the last focusable cell in a row.
     *
     * @param {number} row - The row index.
     * @param {number} _cell - The column index (ignored).
     * @param {number} _posY - The current vertical position (ignored).
     * @param {number} _posX - The current horizontal position (ignored).
     * @returns {CellPosition | null} The new cell position, or null if not found.
     */
    protected gotoRowEnd(row: number, _cell: number, _posY: number, _posX: number): {
        row: number;
        cell: number;
        posX: number;
        posY: number;
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
    /** Navigate to coordinate 0,0 (top left home) */
    navigateTopStart(): boolean | undefined;
    /** Navigate to bottom row end (bottom right end) */
    navigateBottomEnd(): boolean | undefined;
    /**
     * @param {string} dir Navigation direction.
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    protected navigate(dir: 'up' | 'down' | 'left' | 'right' | 'prev' | 'next' | 'home' | 'end'): boolean | undefined;
    /**
     * Navigates to a specified cell position within the grid.
     * Ensures the cell is visible, sets it as active, and updates position tracking.
     *
     * @param {CellPosition | null} pos - The target cell position.
     * @returns {boolean} Whether navigation was successful.
     */
    protected navigateToPos(pos: CellPosition | null): boolean | undefined;
    /**
     * Returns a DOM element containing a cell at a given row and cell.
     * @param row A row index.
     * @param cell A column index.
     * @returns {HTMLDivElement | null} The cell's DOM element, or null if not found.
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
}
export {};
//# sourceMappingURL=slick.grid.d.ts.map