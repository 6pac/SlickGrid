// @ts-ignore
import type { SortableOptions } from 'sortablejs';

import type {
  AutoSize,
  CellPosition,
  CellViewportRange,
  Column,
  ColumnMetadata,
  ColumnSort,
  CssStyleHash,
  CSSStyleDeclarationWritable,
  CustomDataView,
  DOMEvent,
  DragPosition,
  DragRowMove,
  Editor,
  EditorArguments,
  EditorConstructor,
  EditController,
  Formatter,
  FormatterResultObject,
  FormatterOverrideCallback,
  FormatterResultWithHtml,
  FormatterResultWithText,
  GridOption as BaseGridOption,
  InteractionBase,
  ItemMetadata,
  RowInfo,
  MenuCommandItemCallbackArgs,
  MultiColumnSort,
  OnActivateChangedOptionsEventArgs,
  OnActiveCellChangedEventArgs,
  OnAddNewRowEventArgs,
  OnAfterSetColumnsEventArgs,
  OnAutosizeColumnsEventArgs,
  OnColumnsEventArgs,
  OnBeforeAppendCellEventArgs,
  OnBeforeCellEditorDestroyEventArgs,
  OnBeforeColumnsResizeEventArgs,
  OnBeforeEditCellEventArgs,
  OnBeforeHeaderCellDestroyEventArgs,
  OnBeforeHeaderRowCellDestroyEventArgs,
  OnBeforeFooterRowCellDestroyEventArgs,
  OnBeforeSetColumnsEventArgs,
  OnCellChangeEventArgs,
  OnCellCssStylesChangedEventArgs,
  OnClickEventArgs,
  OnColumnsDragEventArgs,
  OnColumnsReorderedEventArgs,
  OnColumnsResizedEventArgs,
  OnColumnsResizeDblClickEventArgs,
  OnCompositeEditorChangeEventArgs,
  OnDblClickEventArgs,
  OnFooterContextMenuEventArgs,
  OnFooterRowCellRenderedEventArgs,
  OnHeaderCellRenderedEventArgs,
  OnFooterClickEventArgs,
  OnHeaderClickEventArgs,
  OnHeaderContextMenuEventArgs,
  OnHeaderKeyDownEventArgs,
  OnHeaderMouseEventArgs,
  OnHeaderRowCellRenderedEventArgs,
  OnKeyDownEventArgs,
  OnPreHeaderContextMenuEventArgs,
  OnPreHeaderClickEventArgs,
  OnRenderedEventArgs,
  OnSelectedRowsChangedEventArgs,
  OnSetOptionsEventArgs,
  OnScrollEventArgs,
  OnValidationErrorEventArgs,
  OnDragReplaceCellsEventArgs,
  PagingInfo,
  SelectionModel,
  SlickGridModel,
  SingleColumnSort,
  SlickPlugin,
  ColumnDockingBand,
  ColumnDockingLayout,
  ColumnPinningReferences,
  DockedColumn,

  DockedRow,
  DockingSide,
  PinnedColumns,
  PinnedRows,
  RowReference,
  StickyRows,
  RowDockingLayout,
  ElementPosition,
} from './models/index.js';
import {
  type BasePubSub,
  BindingEventService as BindingEventService_,
  ColAutosizeMode as ColAutosizeMode_,
  DockingController as DockingController_,
  GridAutosizeColsMode as GridAutosizeColsMode_,
  RowSelectionMode as RowSelectionMode_,
  ValueFilterMode as ValueFilterMode_,
  WidthEvalMode as WidthEvalMode_,
  GlobalEditorLock as GlobalEditorLock_,
  preClickClassName as preClickClassName_,
  RowPositionIndexer as RowPositionIndexer_,
  CellSelectionMode as CellSelectionMode_,
  type SlickEditorLock,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickRange as SlickRange_,
  Utils as Utils_,
  SelectionUtils as SelectionUtils_,
  DragExtendHandle as DragExtendHandle_,
} from './slick.core.js';
import { Draggable as Draggable_, MouseWheel as MouseWheel_, Resizable as Resizable_ } from './slick.interactions.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const ColAutosizeMode = IIFE_ONLY ? Slick.ColAutosizeMode : ColAutosizeMode_;
const GridAutosizeColsMode = IIFE_ONLY ? Slick.GridAutosizeColsMode : GridAutosizeColsMode_;
const RowSelectionMode = IIFE_ONLY ? Slick.RowSelectionMode : RowSelectionMode_;
const ValueFilterMode = IIFE_ONLY ? Slick.ValueFilterMode : ValueFilterMode_;
const WidthEvalMode = IIFE_ONLY ? Slick.WidthEvalMode : WidthEvalMode_;

const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventData = IIFE_ONLY ? Slick.EventData : SlickEventData_;
const GlobalEditorLock = IIFE_ONLY ? Slick.GlobalEditorLock : GlobalEditorLock_;
const preClickClassName = IIFE_ONLY ? Slick.preClickClassName : preClickClassName_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const CellSelectionMode = IIFE_ONLY ? Slick.CellSelectionMode : CellSelectionMode_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const SelectionUtils = IIFE_ONLY ? Slick.SelectionUtils : SelectionUtils_;

const COLUMN_AUTOSCROLL_DISTANCE_PX = 10;
const COLUMN_AUTOSCROLL_INTERVAL_MS = 30;
const RESIZE_AUTOSCROLL_BROWSER_EDGE_PX = 1;
const Draggable = IIFE_ONLY ? Slick.Draggable : Draggable_;
const MouseWheel = IIFE_ONLY ? Slick.MouseWheel : MouseWheel_;
const Resizable = IIFE_ONLY ? Slick.Resizable : Resizable_;
const RowPositionIndexer = IIFE_ONLY ? Slick.RowPositionIndexer : RowPositionIndexer_;
const DragExtendHandle = IIFE_ONLY ? Slick.DragExtendHandle : DragExtendHandle_;


const DockingController = IIFE_ONLY ? Slick.DockingController : DockingController_;

const DEFAULT_DOCKING_SCROLLBAR_HEIGHT = 15;

const isDefinedNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isPrimitiveOrHTML = (value: unknown): value is string | number | boolean | HTMLElement | DocumentFragment =>
  value === null || value === undefined || ['string', 'number', 'boolean'].includes(typeof value) || value instanceof HTMLElement || value instanceof DocumentFragment;
const queueMicrotaskPolyfill = (callback: () => void) => typeof queueMicrotask === 'function' ? queueMicrotask(callback) : setTimeout(callback, 0);
/**
 * @license
 * (c) 2009-present Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v5.20.1
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically,
 *  but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */

// SlickGrid class implementation (available as SlickGrid)

interface RowCaching {
  rowNode: HTMLElement[] | null;
  cellRegions?: { center: HTMLElement; left: HTMLElement; right: HTMLElement };
  /** Signature of the row-docking state the row was last synchronized against. */
  dockingSyncSignature?: string;
  /** Whether the row hosts a rowspan (from rendered cells or metadata). */
  rowSpanHost?: boolean;
  cellColSpans: Array<number | '*'>;
  cellNodesByColumnIdx: HTMLElement[];
  cellRenderQueue: any[];
  cellSpanFragments: Record<number, HTMLElement[]>;
  cellSpanSegments: Record<number, Array<{ start: number; end: number; band: ColumnDockingBand }>>;
}

const EMPTY_DOCKING_LAYOUT: ColumnDockingLayout = {
  center: [],
  centerWidth: 0,
  contentWidth: 0,
  left: [],
  leftBaseWidth: 0,
  leftWidth: 0,
  revision: 0,
  right: [],
  rightBaseWidth: 0,
  rightWidth: 0,
};

const EMPTY_ROW_DOCKING_LAYOUT: RowDockingLayout = {
  bottom: [],
  bottomHeight: 0,
  center: [],
  revision: 0,
  top: [],
  topHeight: 0,
};

export class SlickGrid<TData = any, C extends Column<TData> = Column<TData>, O extends BaseGridOption<C> = BaseGridOption<C>> {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Public API
  slickGridVersion = '5.20.1';

  /** Optional grid state client id retained for plugin compatibility. */
  cid = '';
  // -- Public API

  // Events
  onActiveCellChanged: SlickEvent_<OnActiveCellChangedEventArgs>;
  onActiveCellPositionChanged: SlickEvent_<{ grid: SlickGrid }>;
  onActivateChangedOptions: SlickEvent_<OnActivateChangedOptionsEventArgs>;
  onAddNewRow: SlickEvent_<OnAddNewRowEventArgs>;
  onAfterSetColumns: SlickEvent_<OnAfterSetColumnsEventArgs>;
  onAutosizeColumns: SlickEvent_<OnAutosizeColumnsEventArgs>;
  onBeforeAppendCell: SlickEvent_<OnBeforeAppendCellEventArgs>;
  onBeforeCellEditorDestroy: SlickEvent_<OnBeforeCellEditorDestroyEventArgs>;
  onBeforeColumnsResize: SlickEvent_<OnBeforeColumnsResizeEventArgs>;
  onBeforeDestroy: SlickEvent_<{ grid: SlickGrid }>;
  onBeforeEditCell: SlickEvent_<OnBeforeEditCellEventArgs>;
  onBeforeFooterRowCellDestroy: SlickEvent_<OnBeforeFooterRowCellDestroyEventArgs>;
  onBeforeHeaderCellDestroy: SlickEvent_<OnBeforeHeaderCellDestroyEventArgs>;
  onBeforeHeaderRowCellDestroy: SlickEvent_<OnBeforeHeaderRowCellDestroyEventArgs>;
  onBeforeRemoveCachedRow: SlickEvent_<{ row: number; grid: SlickGrid }>;
  onBeforeSetColumns: SlickEvent_<OnBeforeSetColumnsEventArgs>;
  onBeforeSort: SlickEvent_<SingleColumnSort | MultiColumnSort>;
  onBeforeUpdateColumns: SlickEvent_<OnColumnsEventArgs>;
  onAfterUpdateColumns: SlickEvent_<OnColumnsEventArgs>;
  onCellChange: SlickEvent_<OnCellChangeEventArgs>;
  onCellCssStylesChanged: SlickEvent_<OnCellCssStylesChangedEventArgs>;
  onClick: SlickEvent_<OnClickEventArgs>;
  onColumnsReordered: SlickEvent_<OnColumnsReorderedEventArgs>;
  onColumnsDrag: SlickEvent_<OnColumnsDragEventArgs>;
  onColumnsResized: SlickEvent_<OnColumnsResizedEventArgs>;
  onColumnsResizeDblClick: SlickEvent_<OnColumnsResizeDblClickEventArgs>;
  onCompositeEditorChange: SlickEvent_<OnCompositeEditorChangeEventArgs>;
  onContextMenu: SlickEvent_<MenuCommandItemCallbackArgs>;
  onDblClick: SlickEvent_<OnDblClickEventArgs>;
  onDrag: SlickEvent_<DragRowMove>;
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
  onHeaderMouseOver: SlickEvent_<OnHeaderMouseEventArgs>;
  onHeaderMouseOut: SlickEvent_<OnHeaderMouseEventArgs>;
  onHeaderKeyDown: SlickEvent_<OnHeaderKeyDownEventArgs>;
  onHeaderRowCellRendered: SlickEvent_<OnHeaderRowCellRenderedEventArgs>;
  onHeaderRowMouseEnter: SlickEvent_<OnHeaderMouseEventArgs>;
  onHeaderRowMouseLeave: SlickEvent_<OnHeaderMouseEventArgs>;
  onHeaderRowMouseOver: SlickEvent_<OnHeaderMouseEventArgs>;
  onHeaderRowMouseOut: SlickEvent_<OnHeaderMouseEventArgs>;
  onKeyDown: SlickEvent_<OnKeyDownEventArgs>;
  onMouseEnter: SlickEvent_<OnHeaderMouseEventArgs>;
  onMouseLeave: SlickEvent_<OnHeaderMouseEventArgs>;
  onPreHeaderClick: SlickEvent_<OnPreHeaderClickEventArgs>;
  onPreHeaderContextMenu: SlickEvent_<OnPreHeaderContextMenuEventArgs>;
  onRendered: SlickEvent_<OnRenderedEventArgs>;
  onScroll: SlickEvent_<OnScrollEventArgs>;
  onSelectedRowsChanged: SlickEvent_<OnSelectedRowsChangedEventArgs>;
  onSetOptions: SlickEvent_<OnSetOptionsEventArgs>;
  onSort: SlickEvent_<SingleColumnSort | MultiColumnSort>;
  onValidationError: SlickEvent_<OnValidationErrorEventArgs>;
  onViewportChanged: SlickEvent_<{ grid: SlickGrid }>;
  onDragReplaceCells: SlickEvent_<OnDragReplaceCellsEventArgs>;

  // ---
  // protected variables

  // shared across all grids on the page
  protected scrollbarDimensions?: { height: number; width: number };
  protected maxSupportedCssHeight!: number; // browser's breaking point

  protected canvas: HTMLCanvasElement | null = null;
  protected canvas_context: CanvasRenderingContext2D | null = null;
  protected _isResizingColumn = false;
  protected _columnResizeAutoScrollTimer?: ReturnType<typeof setInterval>;

  // settings
  protected _options!: O;
  protected logMessageCount = 0;
  protected logMessageMaxCount = 30;
  protected _defaults: BaseGridOption = {
    invalidColumnPinningPickerCallback: (error) => alert(error),
    invalidColumnPinningWidthCallback: (error) => alert(error),
    invalidColumnPinningWidthMessage: '[SlickGrid] Cannot pin these columns because they exceed the available grid width.',
    invalidColumnPinningPickerMessage: '[SlickGrid] Cannot complete pinning because at least one visible center column is required.',
    invalidColumnPinningSequenceMessage:
      '[SlickGrid] Cannot change pinning because it would split a colspan. Pin columns sequentially from the left or right edge.',
    skipPinningValidation: false,
    allowDragFromClosest: 'div.slick-cell.dnd, div.slick-cell.cell-reorder',
    alwaysShowVerticalScroll: false,
    alwaysAllowHorizontalScroll: false,
    enableVariableRowHeight: false,
    explicitInitialization: false,
    rowHeight: 25,
    rowHeightProvider: (grid, row) => grid.getItemMetadaWhenExists(row)?.height,
    defaultColumnWidth: 80,
    enableHtmlRendering: true,
    enableAddRow: false,
    leaveSpaceForNewRows: false,
    editable: false,
    autoEdit: true,
    autoEditNewRow: true,
    autoCommitEdit: false,
    suppressActiveCellChangeOnEdit: false,
    enableCellNavigation: true,
    enableColumnReorder: true,
    unorderableColumnCssClass: 'unorderable',
    asyncEditorLoading: false,
    asyncEditorLoadDelay: 100,
    forceFitColumns: false,
    autoHeaderHeight: false,
    autoScrollOnColumnResize: true,
    enableAsyncPostRender: false,
    asyncPostRenderDelay: 50,
    enableAsyncPostRenderCleanup: false,
    asyncPostRenderCleanupDelay: 40,
    columnResizingDelay: 300,
    nonce: '',
    editorLock: GlobalEditorLock,
    showColumnHeader: true,
    showHeaderRow: false,
    headerRowHeight: 25,
    createFooterRow: false,
    showFooterRow: false,
    footerRowHeight: 25,
    createPreHeaderPanel: false,
    createTopHeaderPanel: false,
    showPreHeaderPanel: false,
    showTopHeaderPanel: false,
    preHeaderPanelHeight: 25,
    preHeaderPanelWidth: 'auto', // mostly useful for Draggable Grouping dropzone to take full width
    topHeaderPanelHeight: 25,
    topHeaderPanelWidth: 'auto', // mostly useful for Draggable Grouping dropzone to take full width
    showTopPanel: false,
    topPanelHeight: 25,
    formatterFactory: null,
    editorFactory: null,
    cellFlashingCssClass: 'flashing',
    rowHighlightCssClass: 'highlight-animate',
    rowHighlightDuration: 400,
    selectedCellCssClass: 'selected',
    multiSelect: true,
    enableCellRowSpan: false,
    enableTextSelectionOnCells: false,
    dataItemColumnValueExtractor: null,
    autosizeColsMode: GridAutosizeColsMode.LegacyOff,
    autosizeColPaddingPx: 4,
    autosizeTextAvgToMWidthRatio: 0.75,
    colAutosizeTreatAsLockedBelowWidth: 100,
    docking: {
      maxColumnViewportWidthPercent: 60,
      maxRowViewportHeightPercent: 60,
      minCenterRowCount: 3,
      overflowStrategy: 'conveyor',
      stickyActivationBuffer: 2,
    },
    fullWidthRows: false,
    multiColumnSort: false,
    numberedMultiColumnSort: false,
    tristateMultiColumnSort: false,
    sortColNumberInSeparateSpan: false,
    defaultFormatter: this.defaultFormatter,
    forceSyncScrolling: false,
    addNewRowCssClass: 'new-row',
    preserveCopiedSelectionOnPaste: false,
    preventDragFromKeys: ['ctrlKey', 'metaKey'],
    showCellSelection: true,
    viewportClass: undefined,
    minRowBuffer: 3,
    emulatePagingWhenScrolling: true, // when scrolling off bottom of viewport, place new row at top of viewport
    editorCellNavOnLRKeys: false,
    enableMouseWheelScrollHandler: true,
    doPaging: true,
    rowTopOffsetRenderType: 'top',
    rtl: false,
    scrollRenderThrottling: 10,
    suppressCssChangesOnHiddenInit: false,
    ffMaxSupportedCssHeight: 6000000,
    maxSupportedCssHeight: 1000000000,
    maxPartialRowSpanRemap: 5000,
    sanitizer: undefined, // sanitize function
    mixinDefaults: false,
    shadowRoot: undefined,
  };

  protected _columnDefaults = {
    name: '',
    headerCssClass: null,
    defaultSortAsc: true,
    focusable: true,
    hidden: false,
    minWidth: 30,
    maxWidth: undefined,
    rerenderOnResize: false,
    reorderable: true,
    resizable: true,
    sortable: false,
    selectable: true,
  } as Partial<C>;

  protected _columnAutosizeDefaults: AutoSize = {
    ignoreHeaderText: false,
    colValueArray: undefined,
    allowAddlPercent: undefined,
    formatterOverride: undefined,
    autosizeMode: ColAutosizeMode.ContentIntelligent,
    rowSelectionModeOnInit: undefined,
    rowSelectionMode: RowSelectionMode.FirstNRows,
    rowSelectionCount: 100,
    valueFilterMode: ValueFilterMode.None,
    widthEvalMode: WidthEvalMode.Auto,
    sizeToRemaining: undefined,
    widthPx: undefined,
    contentSizePx: 0,
    headerWidthPx: 0,
    colDataTypeOf: undefined,
  };

  protected _columnResizeTimer?: any;
  protected _executionBlockTimer?: any;
  protected _flashCellTimer?: any;
  protected _highlightRowTimer?: any;

  // scroller
  protected th!: number; // virtual height
  protected h!: number; // real scrollable height
  protected ph!: number; // page height
  protected n!: number; // number of pages
  protected cj!: number; // "jumpiness" coefficient

  protected page = 0; // current page
  protected offset = 0; // current page offset
  protected vScrollDir = 1;
  protected _bindingEventService: BindingEventService_ = new BindingEventService();
  protected initialized = false;
  protected _container!: HTMLElement;
  protected uid = `slickgrid_${Math.round(1000000 * Math.random())}`;
  protected dragReplaceEl = new DragExtendHandle(this.uid);
  protected _focusSink!: HTMLDivElement;
  protected _focusSink2!: HTMLDivElement;
  protected _headerScroller: HTMLDivElement[] = [];
  protected _headers: HTMLDivElement[] = [];
  protected _headerRows!: HTMLDivElement[];
  protected _headerRowScroller!: HTMLDivElement[];
  protected _headerRowSpacerL!: HTMLDivElement;
  protected _footerRow!: HTMLDivElement[];
  protected _footerRowScroller!: HTMLDivElement[];
  protected _footerRowSpacerL!: HTMLDivElement;
  protected _preHeaderPanel!: HTMLDivElement;
  protected _preHeaderPanelScroller!: HTMLDivElement;
  protected _preHeaderPanelSpacer!: HTMLDivElement;
  protected _preHeaderPanelR!: HTMLDivElement;
  protected _topHeaderPanel!: HTMLDivElement;
  protected _topHeaderPanelScroller!: HTMLDivElement;
  protected _topHeaderPanelSpacer!: HTMLDivElement;
  protected _topPanelScrollers!: HTMLDivElement[];
  protected _topPanels!: HTMLDivElement[];
  protected _viewport!: HTMLDivElement[];
  protected _canvas!: HTMLDivElement[];
  protected _style?: HTMLStyleElement;
  protected stylesheet?: { cssRules: Array<{ selectorText: string }>; rules: Array<{ selectorText: string }> } | null;
  protected columnCssRulesL?: Array<{ selectorText: string }>;
  protected columnCssRulesR?: Array<{ selectorText: string }>;
  protected viewportH = 0;
  protected viewportW = 0;
  protected canvasWidth = 0;
  protected canvasWidthL = 0;
  protected canvasWidthR = 0;
  protected headersWidth = 0;
  protected headersWidthL = 0;
  protected headersWidthR = 0;
  protected viewportHasHScroll = false;
  protected viewportHasVScroll = false;
  protected headerColumnWidthDiff = 0;
  protected headerColumnHeightDiff = 0; // border+padding
  protected cellWidthDiff = 0;
  protected cellHeightDiff = 0;
  protected absoluteColumnMinWidth!: number;
  protected rowPositionIndexer?: RowPositionIndexer_; // row top positions (variable row height mode only)
  protected rowHeightsDirty = true; // set when row heights may have changed; the index is rebuilt on the next updateRowCount()
  /** flag to indicate if an invalid pinning alert has been shown already or not */
  protected _invalidPinningAlerted = false;
  protected paneTopH = 0;
  protected paneBottomH = 0;
  protected viewportTopH = 0;
  protected viewportBottomH = 0;
  protected topPanelH = 0;
  protected headerRowH = 0;
  protected footerRowH = 0;

  protected tabbingDirection = 1;
  protected _activeCanvasNode!: HTMLDivElement;
  protected _activeViewportNode!: HTMLDivElement;
  protected activePosX!: number;
  protected activePosY!: number;
  protected activeRow!: number;
  protected activeCell!: number;
  protected activeCellNode: HTMLDivElement | null = null;
  protected currentEditor: Editor | null = null;
  protected serializedEditorValue: any;
  protected editController?: EditController;
  protected _prevDataLength = 0;
  protected _prevInvalidatedRowsCount = 0;
  protected _rowSpanIsCached = false;
  protected _colsWithRowSpanCache: { [colIdx: number]: Set<string> } = {};
  protected rowsCache: Record<number, RowCaching> = {};
  protected renderedRows = 0;
  protected numVisibleRows = 0;
  protected prevScrollTop = 0;
  protected scrollHeight = 0;
  protected scrollTop = 0;
  protected lastRenderedScrollTop = 0;
  protected lastRenderedScrollLeft = 0;
  protected prevScrollLeft = 0;
  protected scrollLeft = 0;
  protected selectionBottomRow!: number;
  protected selectionRightCell!: number;

  protected selectionModel?: SelectionModel;
  protected selectedRows: number[] = [];
  protected selectedRanges: SlickRange_[] = [];

  protected plugins: SlickPlugin[] = [];
  protected cellCssClasses: CssStyleHash = Object.create(null);
  protected cellCssClassesByCell: CssStyleHash = Object.create(null);

  protected columnsById: Record<string, number> = Object.create(null);
  protected visibleColumnsById: Record<string, number> = Object.create(null);
  protected dockingController: DockingController_<C> = new DockingController<C>();
  protected dockingLayout: ColumnDockingLayout = EMPTY_DOCKING_LAYOUT;
  protected dockingByColumn: Map<
    number,
    { band: ColumnDockingBand; naturalOffset: number; offset: number; sticky: boolean; width: number }
  > = new Map();
  protected rowDockingLayout: RowDockingLayout = EMPTY_ROW_DOCKING_LAYOUT;
  protected dockingByRow: Map<number, DockedRow> = new Map<number, DockedRow>();
  protected dockingRowIndexByReference: Map<number | string, number> = new Map<number | string, number>();
  /** Set when row references were invalidated; the next render re-resolves the row docking layout. */
  protected rowDockingStale = false;
  protected dockingChromeByColumn: Map<number, HTMLElement[]> = new Map<number, HTMLElement[]>();
  protected sortColumns: ColumnSort[] = [];
  protected columnPosLeft: number[] = [];
  protected columnPosRight: number[] = [];

  protected pagingActive = false;
  protected pagingIsLastPage = false;

  protected scrollThrottle!: { enqueue: () => void; dequeue: () => void };
  /** Defers expensive horizontal virtual-cell renders so compositor offsets can paint first. */
  protected singleViewportRenderTimer?: number;
  protected animationFrameTimeouts = new Set<number>();
  /** Coalesces sticky-column resolution to one layout pass per animation frame. */
  protected stickyColumnLayoutFrame?: number;

  // async call handles
  protected h_editorLoader?: any;
  protected h_postrender?: any;
  protected h_postrenderCleanup?: any;
  protected postProcessedRows: any = {};
  protected postProcessToRow: number = null as any;
  protected postProcessFromRow: number = null as any;
  protected postProcessedCleanupQueue: Array<{
    actionType: string;
    groupId: number;
    node: HTMLElement | HTMLElement[];
    columnIdx?: number;
    rowIdx?: number;
  }> = [];
  protected postProcessgroupId = 0;

  // perf counters
  protected counter_rows_rendered = 0;
  protected counter_rows_removed = 0;

  protected _headerRoot!: HTMLDivElement;
  protected _contentRoot!: HTMLDivElement;
  protected _headerScrollerL!: HTMLDivElement;
  protected _headerL!: HTMLDivElement;
  protected _headerRowScrollerL!: HTMLDivElement;
  protected _footerRowScrollerL!: HTMLDivElement;
  protected _headerRowL!: HTMLDivElement;
  protected _footerRowL!: HTMLDivElement;
  protected _topPanelScrollerL!: HTMLDivElement;
  protected _topPanelL!: HTMLDivElement;
  protected _viewportNode!: HTMLDivElement;
  protected _canvasNode!: HTMLDivElement;
  protected _dockingOverlay?: HTMLDivElement;
  protected _dockingHorizontalScroller?: HTMLDivElement;
  protected _dockingHorizontalSpacer?: HTMLDivElement;
  /** Persistent semantic left/center/right wrappers for the single header roots. */
  protected dockingHeaderRegions?: Record<ColumnDockingBand, HTMLDivElement>;
  protected dockingHeaderRowRegions?: Record<ColumnDockingBand, HTMLDivElement>;
  protected dockingFooterRowRegions?: Record<ColumnDockingBand, HTMLDivElement>;
  protected _viewportScrollContainerX!: HTMLDivElement;
  protected _viewportScrollContainerY!: HTMLDivElement;
  protected _headerScrollContainer!: HTMLDivElement;
  protected _headerRowScrollContainer!: HTMLDivElement;
  protected _footerRowScrollContainer!: HTMLDivElement;

  // store css attributes if display:none is active in container or parent
  protected cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
  protected _hiddenParents: HTMLElement[] = [];
  protected oldProps: Array<Partial<CSSStyleDeclaration>> = [];
  protected columnResizeDragging = false;
  /** Whether resizeCanvas currently owns an inline auto-height value on the grid container. */
  protected autoHeightContainerSizeApplied = false;
  /** Cached result for the per-cell docking-region branch in the renderer. */
  protected dockingRowRegionsActive = false;
  protected slickDraggableInstance: InteractionBase | null = null;
  protected slickMouseWheelInstances: Array<InteractionBase> = [];
  protected dockingOverlayMouseWheelBound = false;
  protected slickResizableInstances: Array<InteractionBase> = [];
  protected sortableSideLeftInstance?: ReturnType<typeof Sortable.create>;
  protected sortableSideCenterInstance?: ReturnType<typeof Sortable.create>;
  protected sortableSideRightInstance?: ReturnType<typeof Sortable.create>;
  protected _pubSubService?: BasePubSub;
  /** Original pin states for columns changed by the unified pinning option, keyed by stable column id. */
  protected pinningColumnsState: Map<number | string, Column['pinned']> = new Map();

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
  constructor(
    protected readonly container: HTMLElement | string,
    protected data: CustomDataView<TData> | TData[],
    protected columns: C[],
    options: Partial<O>,
    protected readonly externalPubSub?: BasePubSub | undefined
  ) {
    this._container = typeof this.container === 'string' ? (document.querySelector(this.container) as HTMLDivElement) : this.container;

    if (!this._container) {
      throw new Error(`SlickGrid requires a valid container, ${this.container} does not exist in the DOM.`);
    }

    this._pubSubService = externalPubSub;
    this.onActiveCellChanged = new SlickEvent<OnActiveCellChangedEventArgs>('onActiveCellChanged', externalPubSub);
    this.onActiveCellPositionChanged = new SlickEvent<{ grid: SlickGrid }>('onActiveCellPositionChanged', externalPubSub);
    this.onAddNewRow = new SlickEvent<OnAddNewRowEventArgs>('onAddNewRow', externalPubSub);
    this.onAfterSetColumns = new SlickEvent<OnAfterSetColumnsEventArgs>('onAfterSetColumns', externalPubSub);
    this.onAutosizeColumns = new SlickEvent<OnAutosizeColumnsEventArgs>('onAutosizeColumns', externalPubSub);
    this.onBeforeAppendCell = new SlickEvent<OnBeforeAppendCellEventArgs>('onBeforeAppendCell', externalPubSub);
    this.onBeforeCellEditorDestroy = new SlickEvent<OnBeforeCellEditorDestroyEventArgs>('onBeforeCellEditorDestroy', externalPubSub);
    this.onBeforeColumnsResize = new SlickEvent<OnBeforeColumnsResizeEventArgs>('onBeforeColumnsResize', externalPubSub);
    this.onBeforeDestroy = new SlickEvent<{ grid: SlickGrid }>('onBeforeDestroy', externalPubSub);
    this.onBeforeEditCell = new SlickEvent<OnBeforeEditCellEventArgs>('onBeforeEditCell', externalPubSub);
    // prettier-ignore
    this.onBeforeFooterRowCellDestroy = new SlickEvent<OnBeforeFooterRowCellDestroyEventArgs>('onBeforeFooterRowCellDestroy', externalPubSub);
    this.onBeforeHeaderCellDestroy = new SlickEvent<OnBeforeHeaderCellDestroyEventArgs>('onBeforeHeaderCellDestroy', externalPubSub);
    // prettier-ignore
    this.onBeforeHeaderRowCellDestroy = new SlickEvent<OnBeforeHeaderRowCellDestroyEventArgs>('onBeforeHeaderRowCellDestroy', externalPubSub);
    this.onBeforeRemoveCachedRow = new SlickEvent<{ row: number; grid: SlickGrid }>('onRowRemovedFromCache', externalPubSub);
    this.onBeforeSetColumns = new SlickEvent<OnBeforeSetColumnsEventArgs>('onBeforeSetColumns', externalPubSub);
    this.onBeforeSort = new SlickEvent<SingleColumnSort | MultiColumnSort>('onBeforeSort', externalPubSub);
    this.onBeforeUpdateColumns = new SlickEvent<OnColumnsEventArgs>('onBeforeUpdateColumns', externalPubSub);
    this.onAfterUpdateColumns = new SlickEvent<OnColumnsEventArgs>('onBeforeUpdateColumns', externalPubSub);
    this.onCellChange = new SlickEvent<OnCellChangeEventArgs>('onCellChange', externalPubSub);
    this.onCellCssStylesChanged = new SlickEvent<OnCellCssStylesChangedEventArgs>('onCellCssStylesChanged', externalPubSub);
    this.onClick = new SlickEvent<OnClickEventArgs>('onClick', externalPubSub);
    this.onColumnsReordered = new SlickEvent<OnColumnsReorderedEventArgs>('onColumnsReordered', externalPubSub);
    this.onColumnsDrag = new SlickEvent<OnColumnsDragEventArgs>('onColumnsDrag', externalPubSub);
    this.onColumnsResized = new SlickEvent<OnColumnsResizedEventArgs>('onColumnsResized', externalPubSub);
    this.onColumnsResizeDblClick = new SlickEvent<OnColumnsResizeDblClickEventArgs>('onColumnsResizeDblClick', externalPubSub);
    this.onCompositeEditorChange = new SlickEvent<OnCompositeEditorChangeEventArgs>('onCompositeEditorChange', externalPubSub);
    this.onContextMenu = new SlickEvent<MenuCommandItemCallbackArgs>('onContextMenu', externalPubSub);
    this.onDblClick = new SlickEvent<OnDblClickEventArgs>('onDblClick', externalPubSub);
    this.onDrag = new SlickEvent<DragRowMove>('onDrag', externalPubSub);
    this.onDragInit = new SlickEvent<DragRowMove>('onDragInit', externalPubSub);
    this.onDragStart = new SlickEvent<DragRowMove>('onDragStart', externalPubSub);
    this.onDragEnd = new SlickEvent<DragRowMove>('onDragEnd', externalPubSub);
    this.onFooterClick = new SlickEvent<OnFooterClickEventArgs>('onFooterClick', externalPubSub);
    this.onFooterContextMenu = new SlickEvent<OnFooterContextMenuEventArgs>('onFooterContextMenu', externalPubSub);
    this.onFooterRowCellRendered = new SlickEvent<OnFooterRowCellRenderedEventArgs>('onFooterRowCellRendered', externalPubSub);
    this.onHeaderCellRendered = new SlickEvent<OnHeaderCellRenderedEventArgs>('onHeaderCellRendered', externalPubSub);
    this.onHeaderClick = new SlickEvent<OnHeaderClickEventArgs>('onHeaderClick', externalPubSub);
    this.onHeaderContextMenu = new SlickEvent<OnHeaderContextMenuEventArgs>('onHeaderContextMenu', externalPubSub);
    this.onHeaderMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderMouseEnter', externalPubSub);
    this.onHeaderMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderMouseLeave', externalPubSub);
    this.onHeaderMouseOver = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderMouseOver', externalPubSub);
    this.onHeaderMouseOut = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderMouseOut', externalPubSub);
    this.onHeaderRowMouseOver = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderRowMouseOver', externalPubSub);
    this.onHeaderRowMouseOut = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderRowMouseOut', externalPubSub);
    this.onHeaderKeyDown = new SlickEvent<OnHeaderKeyDownEventArgs>('onHeaderKeyDown', externalPubSub);
    this.onHeaderRowCellRendered = new SlickEvent<OnHeaderRowCellRenderedEventArgs>('onHeaderRowCellRendered', externalPubSub);
    this.onHeaderRowMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderRowMouseEnter', externalPubSub);
    this.onHeaderRowMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>('onHeaderRowMouseLeave', externalPubSub);
    this.onKeyDown = new SlickEvent<OnKeyDownEventArgs>('onKeyDown', externalPubSub);
    this.onMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>('onMouseEnter', externalPubSub);
    this.onMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>('onMouseLeave', externalPubSub);
    this.onPreHeaderClick = new SlickEvent<OnPreHeaderClickEventArgs>('onPreHeaderClick', externalPubSub);
    this.onPreHeaderContextMenu = new SlickEvent<OnPreHeaderContextMenuEventArgs>('onPreHeaderContextMenu', externalPubSub);
    this.onRendered = new SlickEvent<OnRenderedEventArgs>('onRendered', externalPubSub);
    this.onScroll = new SlickEvent<OnScrollEventArgs>('onScroll', externalPubSub);
    this.onSelectedRowsChanged = new SlickEvent<OnSelectedRowsChangedEventArgs>('onSelectedRowsChanged', externalPubSub);
    this.onSetOptions = new SlickEvent<OnSetOptionsEventArgs>('onSetOptions', externalPubSub);
    this.onActivateChangedOptions = new SlickEvent<OnActivateChangedOptionsEventArgs>('onActivateChangedOptions', externalPubSub);
    this.onSort = new SlickEvent<SingleColumnSort | MultiColumnSort>('onSort', externalPubSub);
    this.onValidationError = new SlickEvent<OnValidationErrorEventArgs>('onValidationError', externalPubSub);
    this.onViewportChanged = new SlickEvent<{ grid: SlickGrid }>('onViewportChanged', externalPubSub);
    this.onDragReplaceCells = new SlickEvent<OnDragReplaceCellsEventArgs>('onDragReplaceCells', externalPubSub);

    this.initialize(options);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Grid and Dom Initialisation
  //////////////////////////////////////////////////////////////////////////////////////////////

  /** Initializes the grid. */
  init(): void {
    this.finishInitialization();
  }

  /**
     * Processes the provided grid options (mixing in default settings as needed),
     * validates required modules (for example, ensuring Sortable.js is loaded if column reordering is enabled),
     * and creates all necessary DOM elements for the grid (including header containers, viewports, canvases, panels, etc.).
     * It also caches CSS if the container or its ancestors are hidden and calls finish.
     *
     * @param {Partial<O>} options - Partial grid options to be applied during initialization.
     */
  protected initialize(options: Partial<O>): void {
    // calculate these only once and share between grid instances
    if (options?.mixinDefaults) {
      // use provided options and then assign defaults
      if (!this._options) {
        this._options = options as O;
      }
      Utils.applyDefaults(this._options, this._defaults);
    } else {
      this._options = Utils.extend<O>(true, {}, this._defaults, options);
    }
    // `applyDefaults` only fills top-level properties. Keep nested option groups
    // complete when callers retain and mutate their options object through
    // `mixinDefaults`.
    this._options.docking = Utils.extend(true, {}, this._defaults.docking, this._options.docking);
    this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling as number);
    this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight();
    this.validateAndEnforceOptions();
    this.applyColumnPinningOptions(this.columns);
    this._columnDefaults.width = this._options.defaultColumnWidth;

    if (!this._options.suppressCssChangesOnHiddenInit) {
      this.cacheCssForHiddenInit();
    }

    this.updateColumnProps();

    // validate loaded JavaScript modules against requested options
    if (this._options.enableColumnReorder && (!Sortable || !Sortable.create)) {
      throw new Error('SlickGrid requires Sortable.js module to be loaded');
    }

    this.editController = {
      commitCurrentEdit: this.commitCurrentEdit.bind(this),
      cancelCurrentEdit: this.cancelCurrentEdit.bind(this),
    };

    Utils.emptyElement(this._container);
    this._container.style.outline = String(0);
    this._container.classList.add(this.uid);
    this._container.classList.add('slick-widget');
    this._container.setAttribute('role', 'grid');
    this._container.setAttribute('aria-colcount', this.columns.length.toString());
    this._container.setAttribute('aria-rowcount', Array.isArray(this.data) ? this.data.length.toString() : '0');

    const containerStyles = getComputedStyle(this._container);
    if (!/relative|absolute|fixed/.test(containerStyles.position)) {
      this._container.style.position = 'relative';
    }

    this._focusSink = Utils.createDomElement(
      'div',
      { tabIndex: 0, style: { position: 'fixed', width: '0px', height: '0px', top: '0px', left: '0px', outline: '0px' } },
      this._container
    );

    if (this._options.createTopHeaderPanel) {
      this._topHeaderPanelScroller = Utils.createDomElement(
        'div',
        { className: 'slick-topheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } },
        this._container
      );
      this._topHeaderPanelScroller.appendChild(document.createElement('div'));
      this._topHeaderPanel = Utils.createDomElement('div', null, this._topHeaderPanelScroller);
      this._topHeaderPanelSpacer = Utils.createDomElement(
        'div',
        { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } },
        this._topHeaderPanelScroller
      );

      if (!this._options.showTopHeaderPanel) {
        Utils.hide(this._topHeaderPanelScroller);
      }
    }

    // The grid uses one live header and one live content root.
    this._headerRoot = Utils.createDomElement('div', { className: 'slick-header-root' }, this._container);
    this._contentRoot = Utils.createDomElement('div', { className: 'slick-content-root' }, this._container);

    if (this._options.createPreHeaderPanel) {
      const headerContainer = Utils.createDomElement('div', { className: 'slick-preheader-container' }, this._headerRoot);
      this._preHeaderPanelScroller = Utils.createDomElement(
        'div',
        { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } },
        headerContainer
      );
      this._preHeaderPanelScroller.appendChild(document.createElement('div'));
      this._preHeaderPanel = Utils.createDomElement('div', null, this._preHeaderPanelScroller);
      this._preHeaderPanelSpacer = Utils.createDomElement(
        'div',
        { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } },
        this._preHeaderPanelScroller
      );

      this._preHeaderPanelR = this._preHeaderPanel;

      if (!this._options.showPreHeaderPanel) {
        Utils.hide(this._preHeaderPanelScroller);
      }
    }

    // Append the header scroller containers
    const headerContainerL = Utils.createDomElement('div', { className: 'slick-header-container' }, this._headerRoot);
    this._headerScrollerL = Utils.createDomElement(
      'div',
      { className: 'slick-header ui-state-default slick-state-default slick-header-left', role: 'rowgroup' },
      headerContainerL
    );

    // Cache the header scroller containers
    this._headerScroller.push(this._headerScrollerL);

    // Append the columnn containers to the headers
    this._headerL = Utils.createDomElement(
      'div',
      { className: 'slick-header-columns slick-header-columns-left', role: 'row' },
      this._headerScrollerL
    );

    // Cache the header columns
    this._headers = [this._headerL];

    this._headerRowScrollerL = Utils.createDomElement(
      'div',
      { className: 'slick-headerrow ui-state-default slick-state-default', role: 'rowgroup' },
      this._contentRoot
    );

    this._headerRowScroller = [this._headerRowScrollerL];

    this._headerRowSpacerL = Utils.createDomElement(
      'div',
      { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } },
      this._headerRowScrollerL
    );

    this._headerRowL = Utils.createDomElement(
      'div',
      { className: 'slick-headerrow-columns slick-headerrow-columns-left', role: 'row' },
      this._headerRowScrollerL
    );

    this._headerRows = [this._headerRowL];

    // Append the top panel scroller
    this._topPanelScrollerL = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this._contentRoot);

    this._topPanelScrollers = [this._topPanelScrollerL];

    // Append the top panel
    this._topPanelL = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this._topPanelScrollerL);

    this._topPanels = [this._topPanelL];

    if (!this._options.showColumnHeader) {
      this._headerScroller.forEach((el) => {
        Utils.hide(el);
      });
    }

    if (!this._options.showTopPanel) {
      this._topPanelScrollers.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    if (!this._options.showHeaderRow) {
      this._headerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    // Append the viewport
    this._viewportNode = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-left' }, this._contentRoot);

    // Cache the viewports
    this._viewport = [this._viewportNode];
    if (this._options.viewportClass) {
      this._viewport.forEach((view) => {
        view.classList.add(...Utils.classNameToList(this._options.viewportClass));
      });
    }

    // Default the active viewport
    this._activeViewportNode = this._viewportNode;

    // Append the canvas
    this._canvasNode = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-left' }, this._viewportNode);

    // Cache the canvases
    this._canvas = [this._canvasNode];

    this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar();
    const canvasWithScrollbarWidth = this.getCanvasWidth() + this.scrollbarDimensions.width;

    // Default the active canvas
    this._activeCanvasNode = this._canvasNode;

    // top-header
    if (this._topHeaderPanelSpacer) {
      Utils.width(this._topHeaderPanelSpacer, canvasWithScrollbarWidth);
    }

    // pre-header
    if (this._preHeaderPanelSpacer) {
      Utils.width(this._preHeaderPanelSpacer, canvasWithScrollbarWidth);
    }

    this._headers.forEach((el) => {
      Utils.width(el, this.getHeadersWidth());
    });

    Utils.width(this._headerRowSpacerL, canvasWithScrollbarWidth);

    // footer Row
    if (this._options.createFooterRow) {
      this.materializeFooterRow();
    }

    this._focusSink2 = this._focusSink.cloneNode(true) as HTMLDivElement;
    this._container.appendChild(this._focusSink2);

    if (!this._options.explicitInitialization) {
      this.finishInitialization();
    }

    this.applyRTL(this._options.rtl ?? false);
  }

  /**
   * Completes grid initialisation by calculating viewport dimensions, measuring cell padding and border differences,
   * disabling text selection (except on editable inputs), setting docking options and viewport visibility,
   * updating column caches, creating column headers and footers, setting up column sorting,
   * creating CSS rules, binding ancestor scroll events, and binding various event handlers
   * (e.g. for scrolling, mouse, keyboard, drag-and-drop).
   * It also starts up any asynchronous post–render processing if enabled.
   */
  protected finishInitialization(): void {
    if (!this.initialized) {
      this.initialized = true;

      this.getViewportWidth();
      this.getViewportHeight();
      this.refreshDockingLayout();

      // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
      // calculate the diff so we can set consistent sizes
      this.measureCellPaddingAndBorder();

      // disable all text selection in header (including input and textarea)
      this.disableSelection(this._headers);

      if (!this._options.enableTextSelectionOnCells) {
        // disable text selection in grid cells except in input and textarea elements
        this._viewport.forEach((view) => {
          this._bindingEventService.bind(view, 'selectstart', (event: Event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
              return;
            }
            event.preventDefault();
          });

        });
      }

      this.activateSingleViewportLayout();
      this.setScroller();
      this.setOverflow();

      this.updateColumnCaches();
      this.refreshRowDockingLayout(this.scrollTop, true);
      this.createColumnHeaders();
      this.createColumnFooter();
      this.setupColumnSort();
      this.createCssRules();
      this.resizeCanvas();

      if (this._options.autoHeaderHeight) {
        this.recalculateHeaderHeight();
      }
      this.bindAncestorScrollEvents();

      this._bindingEventService.bind(this._container, 'resize', this.resizeCanvas.bind(this));
      this._bindingEventService.bind(this._viewport, 'scroll', this.handleScroll.bind(this));
      if (this._dockingHorizontalScroller) {
        this._bindingEventService.bind(this._dockingHorizontalScroller, 'scroll', this.handleScroll.bind(this), {}, 'docking-horizontal-scroll');
      }

      if (this._options.enableMouseWheelScrollHandler) {
        this._viewport.forEach((view) => {
          this.slickMouseWheelInstances.push(
            MouseWheel({
              element: view,
              onMouseWheel: this.handleMouseWheel.bind(this),
            })

          );
        });
      }

      this._bindingEventService.bind(this._headerScroller, 'contextmenu', this.handleHeaderContextMenu.bind(this) as EventListener);
      this._bindingEventService.bind(this._headerScroller, 'click', this.handleHeaderClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._headerRowScrollerL, 'scroll', this.handleHeaderRowScroll.bind(this) as EventListener);

      if (this._options.createFooterRow) {
        this._bindingEventService.bind(this._footerRow, 'contextmenu', this.handleFooterContextMenu.bind(this) as EventListener);
        this._bindingEventService.bind(this._footerRow, 'click', this.handleFooterClick.bind(this) as EventListener);
        this._bindingEventService.bind(this._footerRowScrollerL, 'scroll', this.handleFooterRowScroll.bind(this) as EventListener);
      }

      if (this._options.createTopHeaderPanel) {
        this._bindingEventService.bind(this._topHeaderPanelScroller, 'scroll', this.handleTopHeaderPanelScroll.bind(this) as EventListener);
      }

      if (this._options.createPreHeaderPanel) {
        this._bindingEventService.bind(this._preHeaderPanelScroller, 'scroll', this.handlePreHeaderPanelScroll.bind(this) as EventListener);
        this._bindingEventService.bind(
          this._preHeaderPanelScroller,
          'contextmenu',
          this.handlePreHeaderContextMenu.bind(this) as EventListener
        );
        this._bindingEventService.bind(this._preHeaderPanelScroller, 'click', this.handlePreHeaderClick.bind(this) as EventListener);
      }

      this._bindingEventService.bind(this._focusSink, 'keydown', this.handleKeyDown.bind(this) as EventListener);
      this._bindingEventService.bind(this._focusSink2, 'keydown', this.handleKeyDown.bind(this) as EventListener);

      this._bindingEventService.bind(this._canvas, 'keydown', this.handleKeyDown.bind(this) as EventListener);
      this._bindingEventService.bind(this._canvas, 'click', this.handleClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._canvas, 'dblclick', this.handleDblClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._canvas, 'contextmenu', this.handleContextMenu.bind(this) as EventListener);
      this._bindingEventService.bind(this._canvas, 'mouseover', this.handleCellMouseOver.bind(this) as EventListener);
      this._bindingEventService.bind(this._canvas, 'mouseout', this.handleCellMouseOut.bind(this) as EventListener);
      // Pinned rows are moved out of the canvas into an optional overlay.

      // Bind the same cell interactions when a permanent or active sticky row
      // caused that overlay to be materialized.
      this.bindDockingOverlayEvents();

      this.createDraggable();

      if (!this._options.suppressCssChangesOnHiddenInit) {
        this.restoreCssFromHiddenInit();
      }
    }
  }

  /** Create the cell drag interaction using the active selection model's modifier-key policy. */
  protected createDraggable(): void {
    if (!Draggable) {
      return;
    }
    const preventDragFromKeys = this.getSelectionModel()?.getOptions()?.enableMultiSelection === true
      ? this._options.preventDragFromKeys?.filter((key) => key !== 'ctrlKey' && key !== 'metaKey')
      : this._options.preventDragFromKeys;
    this.slickDraggableInstance = Draggable({
      containerElement: this._container,
      allowDragFrom: `div.slick-cell, div.${this.dragReplaceEl.cssClass}`,
      dragFromClassDetectArr: [{ tag: 'dragReplaceHandle', id: this.dragReplaceEl.id }],
      // the slick cell parent must always contain `.dnd` and/or `.cell-reorder` class to be identified as draggable
      allowDragFromClosest: this._options.allowDragFromClosest,
      preventDragFromKeys,
      onDragInit: this.handleDragInit.bind(this),
      onDragStart: this.handleDragStart.bind(this),
      onDrag: this.handleDrag.bind(this),
      onDragEnd: this.handleDragEnd.bind(this),
    });
  }

  /**
  * Finds all container ancestors/parents (including the grid container itself) that are hidden (i.e. have display:none)
  * and temporarily applies visible CSS properties (absolute positioning, hidden visibility, block display)
  * so that dimensions can be measured correctly.
  * It stores the original CSS properties in an internal array for later restoration.
  *
  * Related to issue: https://github.com/6pac/SlickGrid/issues/568 */
  cacheCssForHiddenInit(): void {
    this._hiddenParents = Utils.parents(this._container, ':hidden') as HTMLElement[];
    this.oldProps = [];
    this._hiddenParents.forEach((el) => {
      const old: Partial<CSSStyleDeclaration> = {};
      Object.keys(this.cssShow).forEach((name) => {
        if (this.cssShow) {
          old[name as any] = el.style[name as 'position' | 'visibility' | 'display'];
          el.style[name as any] = this.cssShow[name as 'position' | 'visibility' | 'display'];
        }
      });
      this.oldProps.push(old);
    });
  }

  /**
   * Registers an external plugin to the grid’s internal plugin list.
   * Once added, it immediately initialises the plugin by calling its init()
   * method with the grid instance.
   * @param {T} plugin - The plugin instance to be registered.
   */
  registerPlugin<T extends SlickPlugin>(plugin: T): void {
    this.plugins.unshift(plugin);
    plugin.init(this as unknown as SlickGrid);
  }

  /**
   * Unregister (destroy) an external Plugin.
   * Searches for the specified plugin in the grid’s plugin list.
   * When found, it calls the plugin’s destroy() method and removes the plugin from the list,
   * thereby unregistering it from the grid.
   * @param {T} plugin - The plugin instance to be registered.
   */
  unregisterPlugin(plugin: SlickPlugin): void {
    for (let i = this.plugins.length; i >= 0; i--) {
      if (this.plugins[i] === plugin) {
        this.plugins[i]?.destroy();
        this.plugins.splice(i, 1);
        break;
      }
    }
  }

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
  destroy(shouldDestroyAllElements?: boolean): void {
    this.clearAllTimers();
    this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance) as null;
    this.slickMouseWheelInstances = this.destroyAllInstances(this.slickMouseWheelInstances) as InteractionBase[];
    this.slickResizableInstances = this.destroyAllInstances(this.slickResizableInstances) as InteractionBase[];
    this.getEditorLock()?.cancelCurrentEdit();
    this.clearInternalDomCaches();

    this.trigger(this.onBeforeDestroy, {});
    this._bindingEventService.unbindAll();
    (this._pubSubService as any)?.unsubscribeAll?.();

    let i = this.plugins.length;
    while (i--) {
      this.unregisterPlugin(this.plugins[i]);
    }

    if (this.sortableSideRightInstance?.el && typeof this.sortableSideRightInstance?.destroy === 'function') {
      this.sortableSideRightInstance.destroy();
    }
    if (this.sortableSideCenterInstance?.el && typeof this.sortableSideCenterInstance?.destroy === 'function') {
      this.sortableSideCenterInstance.destroy();
    }
    if (this.sortableSideLeftInstance?.el && typeof this.sortableSideLeftInstance?.destroy === 'function') {
      this.sortableSideLeftInstance.destroy();
    }

    this._focusSink?.remove();
    this._focusSink2?.remove();

    // Mark the grid as inactive before its DOM references are cleared. Async data/sort
    // callbacks can finish after destruction and must not attempt to update a null container.
    this.initialized = false;
    Utils.emptyElement(this._container);
    this._container?.style.setProperty('min-height', '');
    this.removeCssRules();

    if (shouldDestroyAllElements) {
      this.destroyElementReferences();
    }
  }

  /**
   * Drops every DOM reference the instance still holds so a retained grid object cannot keep the
   * detached tree alive. Fields are selected by content (an element, a non-empty array of elements,
   * or a plain record of elements), so new element fields are covered without a name list.
   */
  protected destroyElementReferences(): void {
    const isElement = (value: unknown): boolean => value instanceof Element;
    const holdsElements = (value: unknown): boolean =>
      isElement(value) ||
      (Array.isArray(value) && value.length > 0 && value.every(isElement)) ||
      (!!value &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype &&
        Object.values(value as object).length > 0 &&
        Object.values(value as object).every(isElement));
    const self = this as unknown as Record<string, unknown>;
    for (const key of Object.keys(self)) {
      if (holdsElements(self[key])) {
        self[key] = null;
      }
    }
    this.dockingChromeByColumn.clear();
  }

  /**
  * Call destroy method, when exists, on all the instance(s) it found
  *
  * Given either a single instance or an array of instances (e.g. draggable, mousewheel, resizable),
  * pops each one and calls its destroy method if available, then resets the input to an empty array
  * (or null for a single instance). Returns the reset value.
  *
  * @params  instances - can be a single instance or a an array of instances
  */
  protected destroyAllInstances(inputInstances: null | InteractionBase | Array<InteractionBase>): InteractionBase[] | null {
    if (inputInstances) {
      const instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances];
      let instance: InteractionBase | undefined;
      while (Utils.isDefined((instance = instances.pop()))) {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      }
    }
    // reset instance(s)
    inputInstances = Array.isArray(inputInstances) ? [] : null;
    return inputInstances;
  }

  /** Returns an object containing all of the Grid options set on the grid. See a list of Grid Options here. */
  getOptions(): O {
    return this._options;
  }

  /**
   * Extends grid options with a given hash. If an there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.
   * @param {Object} options - an object with configuration options.
   * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
   * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
   * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
   */
  setOptions(newOptions: Partial<O>, suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void {
    this.prepareForOptionsChange();
    const removePinning = Object.prototype.hasOwnProperty.call(newOptions, 'pinning') && (newOptions.pinning === undefined || newOptions.pinning === null);

    // Validate the prospective declarative column state before deep-merging it
    // into the live options. A rejected request leaves the current pinning in
    // place but still permits a sibling row-pinning update in the same call.
    if (newOptions.pinning?.columns !== undefined) {
      if (!suppressColumnSet) {
        this._invalidPinningAlerted = false;
      }
      const prospectivePinnedIndexes = this.getProspectivePinnedColumnIndexes(newOptions.pinning.columns);
      const validPinning = this.validatePinnedColumnIndexes(prospectivePinnedIndexes, true);
      if (!validPinning) {
        const pinningWithoutColumns = { ...newOptions.pinning };
        delete pinningWithoutColumns.columns;
        const optionsWithoutPinning = { ...newOptions };
        delete optionsWithoutPinning.pinning;
        newOptions = {
          ...optionsWithoutPinning,
          ...(Object.keys(pinningWithoutColumns).length ? { pinning: pinningWithoutColumns } : {}),
        } as Partial<O>;
      }
    }

    if (this._options.enableAddRow !== newOptions.enableAddRow) {
      this.invalidateRow(this.getDataLength());
    }

    const originalOptions = Utils.extend(true, {}, this._options);
    this._options = Utils.extend(true, this._options, newOptions);
    if (removePinning) {
      delete (this._options as Partial<O>).pinning;
    }
    // Row lists are complete per edge: replace them instead of deep-merging by index,
    // which would leave stale entries when a list shrinks.
    if (newOptions.stickyRows !== undefined) {
      const incomingStickyRows = newOptions.stickyRows ?? {};
      this._options.stickyRows = {
        top: Utils.replaceList(incomingStickyRows.top),
        bottom: Utils.replaceList(incomingStickyRows.bottom),
        both: Utils.replaceList(incomingStickyRows.both),
      };
    }
    if (newOptions.pinning !== undefined && newOptions.pinning !== null) {
      const incomingPinning = newOptions.pinning;
      const currentPinning = this._options.pinning ?? {};
      const replaceColumnReferences = (
        incoming: ColumnPinningReferences | undefined,
        current: ColumnPinningReferences | undefined
      ): ColumnPinningReferences => {
        const references = incoming !== undefined ? incoming : current;
        return typeof references === 'number' ? references : Utils.replaceList(references);
      };
      this._options.pinning = {
        ...currentPinning,
        ...(incomingPinning.columns !== undefined
          ? {
              columns: {
                left: replaceColumnReferences(incomingPinning.columns.left, currentPinning.columns?.left),
                right: replaceColumnReferences(incomingPinning.columns.right, currentPinning.columns?.right),
              },
            }
          : {}),
        ...(incomingPinning.rows !== undefined
          ? {
              rows: {
                top: Utils.replaceList(incomingPinning.rows.top, currentPinning.rows?.top),
                bottom: Utils.replaceList(incomingPinning.rows.bottom, currentPinning.rows?.bottom),
              },
            }
          : {}),
      };
    }
    this.trigger(this.onSetOptions, { optionsBefore: originalOptions, optionsAfter: this._options });

    // any option affecting row heights requires a rebuild of the row position index
    if (
      newOptions.rowHeight !== undefined ||
      newOptions.rowHeightProvider !== undefined ||
      newOptions.enableVariableRowHeight !== undefined
    ) {
      this.rowHeightsDirty = true;
    }

    this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
  }

  /**
   * If option.mixinDefaults is true then external code maintains a reference to the options object. In this case there is no need
   * to call setOptions() - changes can be made directly to the object. However setOptions() also performs some recalibration of the
   * grid in reaction to changed options. activateChangedOptions call the same recalibration routines as setOptions() would have.
   * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
   * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
   * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
   */
  activateChangedOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void {
    this.prepareForOptionsChange();
    this.invalidateRow(this.getDataLength());
    this.trigger(this.onActivateChangedOptions, { options: this._options });
    this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
  }

  /**
   * Attempts to commit any active cell edit via the editor lock; if successful, calls makeActiveCellNormal to exit edit mode.
   *
   * @returns {void} - Does not return a value.
   */
  protected prepareForOptionsChange(): void {
    if (!this.getEditorLock()?.commitCurrentEdit()) {
      return;
    }
    this.makeActiveCellNormal();
  }

  /**
   * Depending on new options, sets column header visibility, validates options, applies docking options,
   * forces viewport height recalculation if needed, updates viewport overflow, re-renders the grid (unless suppressed),
   * sets the scroller elements, and reinitialises mouse wheel scrolling as needed.
   *
   * @param {boolean} [suppressRender] - If `true`, prevents the grid from re-rendering.
   * @param {boolean} [suppressColumnSet] - If `true`, prevents the columns from being reset.
   * @param {boolean} [suppressSetOverflow] - If `true`, prevents updating the viewport overflow setting.
   */
  protected internal_setOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void {
    if (this._options.showColumnHeader !== undefined) {
      this.setColumnHeaderVisibility(this._options.showColumnHeader);
    }
    this.validateAndEnforceOptions();
    this.applyColumnPinningOptions(this.columns);
    this.refreshDockingLayout();
    this.refreshRowDockingLayout(this.scrollTop, true);
    if (!this.hasConfiguredDocking() && this.hasDockingHorizontalScroller()) {
      this.deactivateSingleViewportLayout();
    }

    if (this._options.createFooterRow && !this._footerRow) {
      this.materializeFooterRow();
    } else if (!this._options.createFooterRow && this._footerRow) {
      this._footerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    this._viewport.forEach((view) => {
      view.style.overflowY = this._options.autoHeight ? 'hidden' : 'auto';
    });

    this.setScroller();
    if (!suppressSetOverflow) {
      this.setOverflow();
    }

    if (!suppressColumnSet) {
      this.setColumns(this.columns);
    }

    // setColumns() invalidates and removes cached rows. Render only after that
    // phase, otherwise option changes such as pinned-row count are painted and
    // then immediately cleared by the column refresh.
    if (!suppressRender) {
      this.render();
    }

    if (
      this._options.enableMouseWheelScrollHandler &&
      this._viewport &&
      (!this.slickMouseWheelInstances || this.slickMouseWheelInstances.length === 0)
    ) {
      this._viewport.forEach((view) => {
        this.slickMouseWheelInstances.push(
          MouseWheel({
            element: view,
            onMouseWheel: this.handleMouseWheel.bind(this),
          })
        );
      });
    } else if (this._options.enableMouseWheelScrollHandler === false) {
      this.destroyAllInstances(this.slickMouseWheelInstances); // remove scroll handler when option is disable
    }

    // Keep header classes and styles synchronized when column rebuilding is suppressed.
    this.handleAutoHeaderHeightChange();
  }

  /**
  * Builds the footer-row DOM (scrollers, spacers and footer-row containers) in the
  * single viewport — the construction path shared by init and by a runtime
  * `setOptions({ createFooterRow: true })` enable. On an already-initialized grid it
  * also binds the footer events (during init they are bound in `finishInitialization`).
  * Runtime disable hides the footer rather than destroying it (symmetric with
  * `showFooterRow`).
  */
  protected materializeFooterRow(): void {
    const canvasWithScrollbarWidth = this.getCanvasWidth() + (this.scrollbarDimensions?.width || 0);

    this._footerRowScrollerL = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this._contentRoot);
    this._footerRowScroller = [this._footerRowScrollerL];

    this._footerRowSpacerL = Utils.createDomElement(
      'div',
      { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } },
      this._footerRowScrollerL
    );
    Utils.width(this._footerRowSpacerL, canvasWithScrollbarWidth);

    this._footerRowL = Utils.createDomElement(
      'div',
      { className: 'slick-footerrow-columns slick-footerrow-columns-left' },
      this._footerRowScrollerL
    );
    this._footerRow = [this._footerRowL];

    if (this.hasConfiguredColumnDocking()) {
      this.dockingFooterRowRegions = this.createDockingChromeRegionSet(this._footerRowL, 'slick-footerrow-columns');
    }

    if (!this._options.showFooterRow) {
      this._footerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    // Bind footer events only when footer row is created after init.
    if (this.initialized) {
      this._bindingEventService.bind(this._footerRow, 'contextmenu', this.handleFooterContextMenu.bind(this) as EventListener);
      this._bindingEventService.bind(this._footerRow, 'click', this.handleFooterClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._footerRowScroller, 'scroll', this.handleFooterRowScroll.bind(this) as EventListener);
    }
  }

  /**
   *
   * Ensures consistency in option setting, by thastIF autoHeight IS enabled, leaveSpaceForNewRows is set to FALSE.
   * And, if forceFitColumns is True, then autosizeColsMode is set to LegacyForceFit.
   */
  validateAndEnforceOptions(): void {
    if (this._options.autoHeight) {
      this._options.leaveSpaceForNewRows = false;
    }

    if (this._options.pinning?.columns) {
      this.validatePinnedColumnIndexes(this.getPinnedColumnIndexes(), false);
    }
  }

  /**
   * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
   * @param {Object} selectionModel A SelectionModel.
   */
  setSelectionModel(model: SelectionModel): void {
    const recreateDraggable = this.initialized && !!this.slickDraggableInstance;
    if (recreateDraggable) {
      this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance) as null;
    }
    if (this.selectionModel) {
      this.selectionModel.onSelectedRangesChanged.unsubscribe(this.handleSelectedRangesChanged.bind(this));
      this.selectionModel.destroy?.();
    }

    this.selectionModel = model;
    if (this.selectionModel) {
      this.selectionModel.init(this as unknown as SlickGrid);
      this.selectionModel.onSelectedRangesChanged.subscribe(this.handleSelectedRangesChanged.bind(this));
    }
    if (recreateDraggable) {
      this.createDraggable();
    }
  }

  /** Returns the current SelectionModel. See here for more information about SelectionModels. */
  getSelectionModel<T extends SelectionModel>(): T | undefined {
    return this.selectionModel as T;
  }

  /**
   * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
   * @param {Number|String} columnId Column id.
   * @param {string | HTMLElement | DocumentFragment} [title] New column name.
   * @param {String} [toolTip] New column tooltip.
   */
  updateColumnHeader(columnId: number | string, title?: string | HTMLElement | DocumentFragment, toolTip?: string): HTMLElement | void {
    if (this.initialized) {
      const idx = this.getColumnIndex(columnId);
      if (!Utils.isDefined(idx)) {
        return;
      }

      const columnDef = this.columns[idx];
      const header: HTMLElement | undefined = this.getColumnByIndex(idx);
      if (header) {
        if (title !== undefined) {
          this.columns[idx].name = title;
        }
        if (toolTip !== undefined) {
          this.columns[idx].toolTip = toolTip;
        }

        this.trigger(this.onBeforeHeaderCellDestroy, {
          node: header,
          column: columnDef,
          grid: this,
        });

        header.setAttribute('title', toolTip || '');
        if (title !== undefined) {
          this.applyHtmlCode(header.children[0] as HTMLElement, title);
        }

        this.trigger(this.onHeaderCellRendered, {
          node: header,
          column: columnDef,
          grid: this,
        });
      }

      return header;
    }
  }

  /**
   * Get the Header DOM element
   * @param {C} columnDef - column definition
   */
  getHeader(columnDef?: C): HTMLDivElement | HTMLDivElement[] {
    if (!columnDef) {
      return this._headerL;
    }
    const idx = this.getColumnIndex(columnDef.id);
    return this.usesDockingChromeRegions() ? this.getDockingChromeRegion('header', this.getColumnDockingBand(idx)) : this._headerL;
  }

  /**
   * Get a specific Header Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderColumn(columnIdOrIdx: number | string): HTMLDivElement {
    const idx = typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx);
    if (this.usesDockingChromeRegions()) {
      return this._headerL.querySelector(
        `.slick-header-column[data-id="${String(this.columns[idx]?.id ?? columnIdOrIdx)}"]`
      ) as HTMLDivElement;
    }
    const targetHeader = this._headerL;
    const targetIndex = idx;
    const directMatch = targetHeader.children[targetIndex] as HTMLDivElement | undefined;
    const targetColumnId = String(this.columns[idx]?.id ?? columnIdOrIdx);
    const directMatchColumn = Utils.storage.get(directMatch, 'column') as C | undefined;
    if (directMatch && (directMatch.dataset?.id === targetColumnId || String(directMatchColumn?.id) === targetColumnId)) {
      return directMatch;
    }

    return (
      (Array.from(targetHeader.children).find((child) => (child as HTMLDivElement).dataset?.id === targetColumnId) as HTMLDivElement) ||
      (undefined as any)
    );
  }

  /** Get the Header Row DOM element */
  getHeaderRow(): HTMLDivElement | HTMLDivElement[] {
    return this._headerRowL;
  }

  /** Get the Footer DOM element */
  getFooterRow(): HTMLDivElement | HTMLDivElement[] {
    return this._footerRowL;
  }

  /**
   * Get Header Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderRowColumn(columnIdOrIdx: number | string): HTMLDivElement {
    let idx = typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx);
    if (this.usesDockingChromeRegions()) {
      return this._headerRowL.querySelector(`.slick-headerrow-column.l${idx}`) as HTMLDivElement;
    }
    const headerRowTarget = this._headerRowL;
    return (headerRowTarget.querySelector(`.slick-headerrow-column.l${idx}`) || headerRowTarget.children[idx]) as HTMLDivElement;
  }

  /**
   * Get the Footer Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getFooterRowColumn(columnIdOrIdx: number | string): HTMLDivElement {
    let idx = typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx);
    if (this.usesDockingChromeRegions()) {
      return this._footerRowL?.querySelector(`.slick-footerrow-column.l${idx}`) as HTMLDivElement;
    }
    const footerRowTarget = this._footerRowL;
    return (footerRowTarget?.querySelector(`.slick-footerrow-column.l${idx}`) || footerRowTarget?.children[idx]) as HTMLDivElement;
  }

  /**
   * If footer rows are enabled, clears existing footer cells then iterates over all columns.
   * For each visible column, it creates a footer cell element (adding docking classes if needed),
   * stores the column definition in the element’s storage, and triggers the onFooterRowCellRendered event.
   */
  protected createColumnFooter(): void {
    if (this._options.createFooterRow) {
      // The region set/reset helpers announce every existing footer cell
      // (onBeforeFooterRowCellDestroy) before emptying the root.
      if (this.usesDockingChromeRegions()) {
        this.dockingFooterRowRegions = this.createDockingChromeRegionSet(this._footerRowL, 'slick-footerrow-columns');
      } else {
        this.resetDockingChromeRegionSet(this._footerRowL, 'slick-footerrow-columns', 'left');
        this.dockingFooterRowRegions = undefined;
      }
      for (let i = 0; i < this.columns.length; i++) {
        const m = this.columns[i];
        if (!m || m.hidden) {
          continue;
        }

        const band = this.getColumnDockingBand(i);
        const footerRowCell = Utils.createDomElement(
          'div',
          { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` },
          this.getDockingChromeRegion('footerRow', band)
        );
        const className = band !== 'center' ? 'pinned' : null;
        if (className) {
          footerRowCell.classList.add(className);
        }

        Utils.storage.put(footerRowCell, 'column', m);

        this.trigger(this.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: this,
        });
      }
      this.applyDockingToColumnChrome();
    }
  }

  /**
   * For each header container, binds a click event that—
   *    if the clicked header is sortable and no column resizing is in progress—
   *      --> toggles the sort direction (or adds/removes the column in a multi–column sort),
   *      --> triggers onBeforeSort
   *      --> and if not cancelled, updates the sort columns and triggers onSort.
   */
  protected setupColumnSort(): void {
    this._bindingEventService.unbindAll('colsorts');
    this._headers.forEach((header) => {
      const sortCallback = (e: (MouseEvent | KeyboardEvent) & { target: HTMLElement }) => {
        if (this.columnResizeDragging || e.target.classList.contains('slick-resizable-handle')) {
          return;
        }

        const coll = e.target.closest('.slick-header-column');
        if (!coll) {
          return;
        }

        const column = Utils.storage.get(coll, 'column');
        if (column?.sortable) {
          if (!this.getEditorLock()?.commitCurrentEdit()) {
            return;
          }

          const previousSortColumns = this.sortColumns.slice();
          let sortColumn: ColumnSort | null = null;
          let i = 0;
          for (; i < this.sortColumns.length; i++) {
            if (this.sortColumns[i].columnId === column.id) {
              sortColumn = this.sortColumns[i];
              sortColumn.sortAsc = !sortColumn.sortAsc;
              break;
            }
          }
          const hadSortCol = !!sortColumn;

          if (this._options.tristateMultiColumnSort) {
            if (!sortColumn) {
              sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column };
            }
            if (hadSortCol && sortColumn.sortAsc) {
              // three state: remove sort rather than go back to ASC
              this.sortColumns.splice(i, 1);
              sortColumn = null;
            }
            if (!this._options.multiColumnSort) {
              this.sortColumns = [];
            }
            if (sortColumn && (!hadSortCol || !this._options.multiColumnSort)) {
              this.sortColumns.push(sortColumn);
            }
          } else {
            // legacy behaviour
            if (e.metaKey && this._options.multiColumnSort) {
              if (sortColumn) {
                this.sortColumns.splice(i, 1);
              }
            } else {
              if ((!e.shiftKey && !e.metaKey) || !this._options.multiColumnSort) {
                this.sortColumns = [];
              }

              if (!sortColumn) {
                sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column };
                this.sortColumns.push(sortColumn);
              } else if (this.sortColumns.length === 0) {
                this.sortColumns.push(sortColumn);
              }
            }
          }

          let onSortArgs;
          if (!this._options.multiColumnSort) {
            onSortArgs = {
              multiColumnSort: false,
              previousSortColumns,
              columnId: this.sortColumns.length > 0 ? column.id : null,
              sortCol: this.sortColumns.length > 0 ? column : null,
              sortAsc: this.sortColumns.length > 0 ? this.sortColumns[0].sortAsc : true,
            };
          } else {
            onSortArgs = {
              multiColumnSort: true,
              previousSortColumns,
              sortCols: this.sortColumns
                .map((col) => {
                  const tempCol = this.getColumnById(col.columnId);
                  return tempCol && !tempCol.hidden ? { columnId: tempCol.id, sortCol: tempCol, sortAsc: col.sortAsc } : null;
                })
                .filter((el) => el),
            };
          }

          if (this.trigger(this.onBeforeSort, onSortArgs, e).getReturnValue() !== false) {
            this.setSortColumns(this.sortColumns);
            this.trigger(this.onSort, onSortArgs, e);
          }
        }
      };

      // Add keydown/click event handlers for sortable columns
      this._bindingEventService.bind(
        header,
        'keydown',
        ((e: KeyboardEvent & { target: HTMLElement }) => {
          this.trigger(this.onHeaderKeyDown, { event: e, column: Utils.storage.get(e.target, 'column'), grid: this });
          if (e.key === 'Enter' || e.key === ' ') {
            sortCallback(e);
          }
        }) as EventListener,
        {},
        'colsorts'
      );
      this._bindingEventService.bind(
        header,
        'click',
        ((e: MouseEvent & { target: HTMLElement }) => sortCallback(e)) as EventListener,
        {},
        'colsorts'
      );
    });
  }

  /**
   * Clears any existing header cells and header row cells, recalculates header widths,
   * then iterates over each visible column to create header cell elements
   * (and header row cells if enabled) with appropriate content, CSS classes, event bindings,
   * and sort indicator elements. Also triggers before–destroy and rendered events as needed.
   */
  protected createColumnHeaders(): void {
    this._bindingEventService.unbindAll('colheaders');

    // The region set/reset helpers announce every existing header and header-row cell
    // (onBeforeHeaderCellDestroy / onBeforeHeaderRowCellDestroy) before emptying the roots.
    if (this.hasConfiguredColumnDocking()) {
      this.dockingHeaderRegions = this.createDockingChromeRegionSet(this._headerL, 'slick-header-columns');
      this.dockingHeaderRowRegions = this.createDockingChromeRegionSet(this._headerRowL, 'slick-headerrow-columns');
    } else {
      this.resetDockingChromeRegionSet(this._headerL, 'slick-header-columns', 'left');
      this.resetDockingChromeRegionSet(this._headerRowL, 'slick-headerrow-columns', 'left');
      this.dockingHeaderRegions = undefined;
      this.dockingHeaderRowRegions = undefined;
    }
    this.getHeadersWidth();

    Utils.width(this._headerL, this.getDockingChromeRootWidth());

    for (let i = 0, ln = this.columns.length; i < ln; i++) {
      const m: C = this.columns[i];
      if (!m || m.hidden) {
        continue;
      }

      const band = this.getColumnDockingBand(i);
      const headerTarget = this.getDockingChromeRegion('header', band);
      const headerRowTarget = this.getDockingChromeRegion('headerRow', band);

      const header = Utils.createDomElement(
        'div',
        {
          id: `${this.uid + m.id}`,
          dataset: { id: String(m.id) },
          role: 'columnheader',
          className: 'ui-state-default slick-state-default slick-header-column',
          tabIndex: 0,
          ariaColIndex: `${i + 1}`,
        },
        headerTarget
      );
      if (m.toolTip) {
        header.title = m.toolTip;
      }
      if (!m.reorderable) {
        header.classList.add(this._options.unorderableColumnCssClass!);
      }
      const colNameElm = Utils.createDomElement('span', { className: 'slick-column-name' }, header);
      this.applyHtmlCode(colNameElm, m.name);

      const colWidth = m.width! - this.headerColumnWidthDiff;
      Utils.width(header, colWidth);

      let classname = m.headerCssClass || null;
      if (classname) {
        header.classList.add(...Utils.classNameToList(classname));
      }
      classname = band !== 'center' ? 'pinned' : null;
      if (classname) {
        header.classList.add(classname);
      }

      this._bindingEventService.bind(header, 'mouseenter', this.handleHeaderMouseEnter.bind(this) as EventListener, {}, 'colheaders');
      this._bindingEventService.bind(header, 'mouseleave', this.handleHeaderMouseLeave.bind(this) as EventListener, {}, 'colheaders');
      this._bindingEventService.bind(header, 'mouseover', this.handleHeaderMouseOver.bind(this) as EventListener, {}, 'colheaders');
      this._bindingEventService.bind(header, 'mouseout', this.handleHeaderMouseOut.bind(this) as EventListener, {}, 'colheaders');

      Utils.storage.put(header, 'column', m);

      if (this._options.enableColumnReorder || m.sortable) {
        this._bindingEventService.bind(header, 'mouseenter', this.handleHeaderMouseHoverOn.bind(this) as EventListener, {}, 'colheaders');
        this._bindingEventService.bind(header, 'mouseleave', this.handleHeaderMouseHoverOff.bind(this) as EventListener, {}, 'colheaders');
      }

      if (m.hasOwnProperty('headerCellAttrs') && m.headerCellAttrs instanceof Object) {
        Object.keys(m.headerCellAttrs).forEach((key) => {
          if (m.headerCellAttrs.hasOwnProperty(key)) {
            header.setAttribute(key, m.headerCellAttrs[key]);
          }
        });
      }

      if (m.sortable) {

        header.classList.add('slick-header-sortable');
        Utils.createDomElement(
          'div',
          {
            className: `slick-sort-indicator ${this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? ' slick-sort-indicator-numbered' : ''}`,
          },
          header
        );
        if (this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan) {
          Utils.createDomElement('div', { className: 'slick-sort-indicator-numbered' }, header);
        }
      }

      this.trigger(this.onHeaderCellRendered, {
        node: header,
        column: m,
        grid: this,
      });

      if (this._options.showHeaderRow) {
        const headerRowCell = Utils.createDomElement(
          'div',
          { className: `ui-state-default slick-state-default slick-headerrow-column l${i} r${i}`, role: 'gridcell', ariaColIndex: `${i + 1}` },
          headerRowTarget
        );
        const pinnedClasses = band !== 'center' ? 'pinned' : null;
        if (pinnedClasses) {
          headerRowCell.classList.add(pinnedClasses);
        }

        // prettier-ignore
        this._bindingEventService.bind(headerRowCell, 'mouseenter', this.handleHeaderRowMouseEnter.bind(this) as EventListener, {}, 'colheaders');
        // prettier-ignore
        this._bindingEventService.bind(headerRowCell, 'mouseleave', this.handleHeaderRowMouseLeave.bind(this) as EventListener, {}, 'colheaders');
        // prettier-ignore
        this._bindingEventService.bind(headerRowCell, 'mouseover', this.handleHeaderRowMouseOver.bind(this) as EventListener, {}, 'colheaders');
        this._bindingEventService.bind(

          headerRowCell,
          'mouseout',
          this.handleHeaderRowMouseOut.bind(this) as EventListener,
          {},
          'colheaders'
        );

        Utils.storage.put(headerRowCell, 'column', m);

        this.trigger(this.onHeaderRowCellRendered, {
          node: headerRowCell,
          column: m,
          grid: this,
        });
      }
    }

    this.setSortColumns(this.sortColumns);
    this.setupColumnResize();
    if (this._options.enableColumnReorder) {
      if (typeof this._options.enableColumnReorder === 'function') {
        this._options.enableColumnReorder(
          this as unknown as SlickGrid,
          this._headers,
          this.headerColumnWidthDiff,
          this.setColumns as any,
          this.setupColumnResize,
          this.columns,
          this.getColumnIndex,
          this.uid,
          this.trigger
        );
      } else {
        this.setupColumnReorder();
      }
    }

    this.applyDockingToColumnChrome();
    this.handleAutoHeaderHeightChange();

  }

  /**
  * Enables or disables automatic header height handling.
  */
  protected handleAutoHeaderHeightChange(): void {
    const enabled = !!this._options.autoHeaderHeight;
    const headers = [this._headerScrollerL];

    headers.forEach((header) => header.classList.toggle('slick-header-auto-height', enabled));

    if (!enabled) {
      this.clearAutoHeaderHeightStyles(headers);
    }
  }

  /**
  * Measures natural header heights and applies one common height to all header panes.
  */
  protected recalculateHeaderHeight(): void {
    if (!this._headerScrollerL) {
      return;
    }

    const headers = [this._headerScrollerL];
    const currentHeight = parseFloat(this._headerScrollerL.style.getPropertyValue('--slick-auto-header-height') || '0');

    // Remove the previous calculated height before measuring the rendered header content.
    this.clearAutoHeaderHeightStyles(headers);
    const maxHeight = Math.max(...headers.map((header) => header.getBoundingClientRect().height));

    if (maxHeight > 0) {
      this.setAutoHeaderHeightStyles(maxHeight, headers);

      // A viewport resize is only necessary when the calculated height actually changed.
      if (Math.abs(maxHeight - currentHeight) > 0.5) {
        this.resizeCanvas();
      }
    }
  }

  /**
   * Destroys any existing sortable instances and creates new ones on the left and right header
   * containers using the Sortable library. Configures options including animation,
   * drag handle selectors, auto-scroll, and callbacks (onStart, onEnd) that
   * update the column order, set columns, trigger onColumnsReordered, and reapply column resizing.
   */
  protected setupColumnReorder(): void {
    this.sortableSideLeftInstance?.destroy();
    this.sortableSideCenterInstance?.destroy();
    this.sortableSideRightInstance?.destroy();
    this.sortableSideLeftInstance = undefined;
    this.sortableSideCenterInstance = undefined;
    this.sortableSideRightInstance = undefined;

    let columnScrollTimer: ReturnType<typeof setInterval> | undefined;
    let columnScrollDirection = 0;

    const stopAutoScroll = () => {
      clearInterval(columnScrollTimer);
      columnScrollTimer = undefined;
      columnScrollDirection = 0;
    };
    let prevColumnIds: Array<string | number> = [];

    // fires on document during native drag; also bind 'mousemove' for SortableJS forceFallback mode
    const autoScrollHandler = (e: DragEvent | MouseEvent) => {
      if (!this.initialized || !this._viewportScrollContainerX) {
        stopAutoScroll();
        return;
      }
      const { clientX, clientY, pageX } = e;
      if (clientX && clientY) {
        const viewportLeft = Utils.offset(this._viewportScrollContainerX)!.left;
        const containerRight = Utils.offset(this._container)!.left + this._container.clientWidth;
        const direction = pageX > containerRight ? 1 : pageX < viewportLeft ? -1 : 0;
        if (direction !== columnScrollDirection) {
          stopAutoScroll();
          columnScrollDirection = direction;
          if (direction) {
            columnScrollTimer = setInterval(() => {
              if (!this.initialized || !this._viewportScrollContainerX) {
                stopAutoScroll();
                return;
              }
              this._viewportScrollContainerX.scrollLeft += direction * COLUMN_AUTOSCROLL_DISTANCE_PX;
            }, COLUMN_AUTOSCROLL_INTERVAL_MS);
          }
        }
      }
    };

    const sortableOptions = {
      animation: 50,
      direction: 'horizontal',
      ghostClass: 'slick-sortable-placeholder',
      draggable: '.slick-header-column',
      dragoverBubble: false,
      // Fixes broken Firefox-Linux dragging
      forceFallback: /firefox/i.test(navigator.userAgent) && /linux/i.test(navigator.userAgent),
      // allow column to be resized even when they are not orderable
      preventOnFilter: false,
      revertClone: true,
      // Use built-in SortableJS proximity scroll for unpinned grids; pinned grids use custom scroll.
      scroll: !this.hasDockedColumns(),
      // lock unorderable columns by using a combo of filter + onMove
      filter: `.${this._options.unorderableColumnCssClass}`,
      onMove: (event: any) => {
        return !event.related.classList.contains(this._options.unorderableColumnCssClass as string);
      },
      onStart: (e: any) => {
        e.item.classList.add('slick-header-column-active');
        // Only scrolling columns should auto-scroll; use contains() since offset comparisons
        // are not reliable across the header regions.
        const leftHeader = this.usesDockingChromeRegions() ? this.getDockingChromeRegion('header', 'left') : this._headerL;
        if (!this.hasDockedColumns() || !leftHeader.contains(e.item)) {
          // bind 'drag' for native HTML5 drag and 'mousemove' for SortableJS forceFallback
          this._bindingEventService.bind(document, 'drag', autoScrollHandler as EventListener, {}, 'colreorder');
          this._bindingEventService.bind(document, 'mousemove', autoScrollHandler as EventListener, {}, 'colreorder');
        }

        prevColumnIds = this.columns.map((c) => c.id);
      },
      onEnd: (e: any) => {
        e.item.classList.remove('slick-header-column-active');
        stopAutoScroll();
        this._bindingEventService.unbindAll('colreorder');
        const prevScrollLeft = this.scrollLeft;

        if (!this.getEditorLock()?.commitCurrentEdit()) {
          return;
        }

        const reorderedIdsByBand = [
          this.sortableSideLeftInstance?.toArray() || [],
          this.sortableSideCenterInstance?.toArray() || [],
          this.sortableSideRightInstance?.toArray() || [],
        ];
        const reorderedColumnsByBand = reorderedIdsByBand.map((ids: Array<string | number>) =>
          ids.map((id) => this.columns[this.getColumnIndex(id)])
        );
        const finalColumns = this.columns.slice();

        // Keep each docking band in its logical slots; flattening moves center columns into pinned slots.
        if (this.usesDockingChromeRegions()) {
          // Slots follow the DOM band each header lives in. On the sticky transform path an active
          // sticky column is docked visually but its header remains in the centre region, so the
          // resolved layout bands cannot be used directly.
          const transformPath = this.usesStickyColumnTransformPath();
          const inDomBand = (entry: DockedColumn): boolean => !(transformPath && entry.sticky);
          const leftSlots = this.dockingLayout.left.filter(inDomBand).map((entry) => entry.index);
          const rightSlots = this.dockingLayout.right.filter(inDomBand).map((entry) => entry.index);
          const pinnedSlots = new Set([...leftSlots, ...rightSlots]);
          const centerSlots = this.columns
            .map((column, index) => (column && !column.hidden && !pinnedSlots.has(index) ? index : -1))
            .filter((index) => index >= 0);
          const slotsByBand = [leftSlots, centerSlots, rightSlots];
          if (slotsByBand.some((slots, bandIndex) => slots.length !== reorderedColumnsByBand[bandIndex].length)) {
            return;
          }
          slotsByBand.forEach((slots, bandIndex) => {
            slots.forEach((index, reorderedIndex) => {
              finalColumns[index] = reorderedColumnsByBand[bandIndex][reorderedIndex];
            });
          });
        } else {
          let reorderedIndex = 0;
          const reorderedColumns = reorderedColumnsByBand.flat();
          this.columns.forEach((column, index) => {
            if (!column.hidden) {
              finalColumns[index] = reorderedColumns[reorderedIndex++];
            }
          });
        }

        e.stopPropagation();
        const finalColumnIds = finalColumns.map(({ id }) => id);
        if (!this.arrayEquals(prevColumnIds, finalColumnIds)) {
          this.setColumns(finalColumns);
          // reapply previous scroll position since it might move back to x=0 after calling `setColumns()`
          this.scrollToX(prevScrollLeft);
          this.trigger(this.onColumnsReordered, { impactedColumns: this.columns, previousColumnOrder: prevColumnIds });
          this.setupColumnResize();
        }
        if (this.activeCellNode) {
          this.setFocus(); // refocus on active cell
        }
      },
    } as SortableOptions;

    if (this.usesDockingChromeRegions()) {
      this.sortableSideLeftInstance = Sortable.create(this.getDockingChromeRegion('header', 'left'), sortableOptions);
      this.sortableSideCenterInstance = Sortable.create(this.getDockingChromeRegion('header', 'center'), sortableOptions);
      this.sortableSideRightInstance = Sortable.create(this.getDockingChromeRegion('header', 'right'), sortableOptions);
    } else {
      this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions);
      this.sortableSideRightInstance = undefined;
    }
  }

  /**
   * Returns a concatenated array containing the children (header column elements) from both the left and right header containers.
   * @returns {HTMLElement[]} - An array of header column elements.
   */
  protected getHeaderChildren(): HTMLElement[] {
    if (this.usesDockingChromeRegions()) {
      const headers = Array.from(this._headerL.querySelectorAll('.slick-header-column')) as HTMLElement[];
      return this.getVisibleColumns()
        .map((column) => headers.find((header) => header.dataset.id === String(column.id)))
        .filter((header): header is HTMLElement => !!header);
    }
    return this._headers.flatMap((header) => Array.from(header.children)) as HTMLElement[];
  }

  /**
   * When a resizable handle is double–clicked, extracts the column identifier from the parent element’s id
   * (by removing the grid uid) and triggers the onColumnsResizeDblClick event with that identifier.
   * @param {MouseEvent & { target: HTMLDivElement }} evt - The double-click event on the resizable handle.
   */
  protected handleResizeableDoubleClick(evt: MouseEvent & { target: HTMLDivElement }): void {
    const triggeredByColumn = evt.target.parentElement!.id.replace(this.uid, '');
    this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn });
  }

  /**
   * Ensures the Resizable module is available and then iterates over header children to remove
   * any existing resizable handles. Determines which columns are resizable (tracking the first
   * and last resizable columns) and for each eligible column, creates a resizable handle,
   * binds a double–click event, and creates a Resizable instance with callbacks for onResizeStart,
   * onResize, and onResizeEnd. These callbacks manage column width adjustments (including force–fit
   * and docked column considerations), update header and canvas widths, trigger related events,
   * and re–render the grid as needed.
   * @returns {void}
   */
  protected setupColumnResize(): void {
    let j: number, k: number, c: C;
    let pageX: number, minPageX: number, maxPageX: number;
    let firstResizable: number | undefined;
    let lastResizable = -1;
    let resizeAutoScrollDeltaX = 0;
    let autoScrollClientX: number | undefined;
    let autoScrollOffsetX = 0;

    this._bindingEventService.unbindAll('colresizes');
    this.clearAutoScrollTimer();
    const children: HTMLElement[] = this.getHeaderChildren();
    const vc = this.getVisibleColumns();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const handles = child.querySelectorAll('.slick-resizable-handle');
      handles.forEach((handle) => handle.remove());

      if (i < vc.length && vc[i]?.resizable) {
        if (firstResizable === undefined) {
          firstResizable = i;
        }
        lastResizable = i;
      }
    }

    if (firstResizable === undefined) {
      return;
    }

    // --- Minimal auto-scroll logic for browser edge ---
    const stopColumnResizeAutoScroll = () => {
      this.clearAutoScrollTimer();
      autoScrollOffsetX = 0;
    };

    const scheduleColumnResizeAutoScroll = (resizeCallback: (targetPageX: number) => void) => {
      if (this._columnResizeAutoScrollTimer) {
        return;
      }
      this._columnResizeAutoScrollTimer = setInterval(() => {
        if (!this.initialized || !this._viewportScrollContainerX) {
          stopColumnResizeAutoScroll();
          return;
        }
        const viewportOffset = Utils.offset(this._viewportScrollContainerX)!;
        /* v8 ignore next */
        const targetPageX =
          autoScrollOffsetX > 0
            ? viewportOffset.left + this._viewportScrollContainerX.clientWidth + COLUMN_AUTOSCROLL_DISTANCE_PX
            : viewportOffset.left - COLUMN_AUTOSCROLL_DISTANCE_PX;
        resizeCallback(targetPageX + resizeAutoScrollDeltaX);
      }, COLUMN_AUTOSCROLL_INTERVAL_MS);
    };

    const updateColumnResizeAutoScroll = (
      clientX: number | undefined,
      targetPageX: number,
      resizeCallback: (targetPageX: number) => void
    ): number => {
      if (!this.initialized || !this._viewportScrollContainerX) {
        stopColumnResizeAutoScroll();
        return targetPageX;
      }
      // TODO: there is a known bug with auto-scroll in RTL,
      // so disable it until someone can contribute a fix
      if (this._options.rtl || !this._options.autoScrollOnColumnResize) {
        stopColumnResizeAutoScroll();
        return targetPageX;
      }

      autoScrollClientX = isDefinedNumber(clientX) ? clientX : autoScrollClientX;
      const left = Utils.offset(this._viewportScrollContainerX)!.left;
      const viewportWidth = this._viewportScrollContainerX.clientWidth;
      const right = left + viewportWidth;
      const browserW = window.innerWidth || document.documentElement.clientWidth || 0;
      if (targetPageX <= left) {
        autoScrollOffsetX = targetPageX - left;
      } else if (targetPageX >= right) {
        autoScrollOffsetX = targetPageX - right;
      } else if (isDefinedNumber(autoScrollClientX) && browserW > 0) {
        autoScrollOffsetX =
          autoScrollClientX <= RESIZE_AUTOSCROLL_BROWSER_EDGE_PX
            ? -1
            : autoScrollClientX >= browserW - RESIZE_AUTOSCROLL_BROWSER_EDGE_PX
              ? 1
              : 0;
      } else {
        autoScrollOffsetX = 0;
      }
      if (autoScrollOffsetX) {
        scheduleColumnResizeAutoScroll(resizeCallback);
        return autoScrollOffsetX > 0 && viewportWidth ? Math.min(right, targetPageX) : targetPageX;
      }
      stopColumnResizeAutoScroll();
      return targetPageX;
    };

    for (let i = 0; i < children.length; i++) {
      const colElm = children[i];

      /* v8 ignore if */
      if (i >= vc.length || !vc[i]) {
        continue;
      }
      if (i < firstResizable || (this._options.forceFitColumns && i >= lastResizable)) {
        continue;
      }

      const resizeableHandle = Utils.createDomElement(
        'div',
        { className: 'slick-resizable-handle', role: 'separator', ariaOrientation: 'horizontal' },
        colElm
      );
      this._bindingEventService.bind(
        resizeableHandle,
        'dblclick',
        this.handleResizeableDoubleClick.bind(this) as EventListener,
        {},
        'colresizes'
      );

      const applyColumnResize = (
        targetPageX: number,
        resizeElms: { resizeableElement: HTMLElement; resizeableHandleElement: HTMLElement }
      ) => {
        this.columnResizeDragging = true;
        let actualMinWidth;
        let d = Math.min(maxPageX, Math.max(minPageX, targetPageX)) - pageX;

        if (this._options.rtl) {
          d = -d;
        }

        let x;
        // oxlint-disable-next-line no-unused-vars
        let newCanvasWidthR = 0;

        if (d < 0) {
          x = d;
          for (j = i; j >= 0; j--) {
            c = vc[j];
            if (c && c.resizable && !c.hidden) {
              actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
              /* v8 ignore if */
              if (x && (c.previousWidth || 0) + x < actualMinWidth) {
                x += (c.previousWidth || 0) - actualMinWidth;
                c.width = actualMinWidth;
              } else {
                c.width = (c.previousWidth || 0) + x;
                x = 0;
              }
            }
          }

          for (k = 0; k <= i; k++) {
            c = vc[k];
            if (c && !c.hidden) {
              if (this.getColumnDockingBand(k) === 'right') {
                newCanvasWidthR += c.width || 0;
              }
            }
          }

          if (this._options.forceFitColumns) {
            x = -d;
            for (j = i + 1; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden) {
                if (c.resizable) {
                  if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x) {
                    x -= c.maxWidth - (c.previousWidth || 0);
                    c.width = c.maxWidth;
                  } else {
                    c.width = (c.previousWidth || 0) + x;
                    x = 0;
                  }

                  if (this.getColumnDockingBand(j) === 'right') {
                    newCanvasWidthR += c.width || 0;
                  }
                }
              }
            }
          } else {
            for (j = i + 1; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden) {
                if (this.getColumnDockingBand(j) === 'right') {
                  newCanvasWidthR += c.width || 0;
                } else {
                  // The center width is resolved by the docking layout below.
                }
              }
            }
          }

          if (this._options.forceFitColumns) {
            x = -d;
            for (j = i + 1; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden && c.resizable) {
                /* v8 ignore if */
                if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x) {
                  x -= c.maxWidth - (c.previousWidth || 0);
                  c.width = c.maxWidth;
                } else {
                  c.width = (c.previousWidth || 0) + x;
                  x = 0;
                }
              }
            }
          }
        } else {
          x = d;

          newCanvasWidthR = 0;

          for (j = i; j >= 0; j--) {
            c = vc[j];
            if (c && !c.hidden && c.resizable) {
              if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x) {
                x -= c.maxWidth - (c.previousWidth || 0);
                c.width = c.maxWidth;
              } else {
                const newWidth = (c.previousWidth || 0) + x;
                c.width = newWidth;
                x = 0;
              }
            }
          }

          for (k = 0; k <= i; k++) {
            c = vc[k];
            if (c && !c.hidden) {
              if (this.getColumnDockingBand(k) === 'right') {
                newCanvasWidthR += c.width || 0;
              }
            }
          }

          if (this._options.forceFitColumns) {
            x = -d;
            for (j = i + 1; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden && c.resizable) {
                actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
                /* v8 ignore if */
                if (x && (c.previousWidth || 0) + x < actualMinWidth) {
                  x += (c.previousWidth || 0) - actualMinWidth;
                  c.width = actualMinWidth;
                } else {
                  c.width = (c.previousWidth || 0) + x;
                  x = 0;
                }

                if (this.getColumnDockingBand(j) === 'right') {
                  newCanvasWidthR += c.width || 0;
                }
              }
            }
          } else {
            for (j = i + 1; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden) {
                if (this.getColumnDockingBand(j) === 'right') {
                  // eslint-disable-next-line
                  newCanvasWidthR += c.width || 0;
                }
              }
            }
          }
        }

        this.applyColumnHeaderWidths();
        if (this._options.syncColumnCellResize) {
          this.applyColumnWidths();
        }

        this.updateCanvasWidth();
        if (
          this._options.autoScrollOnColumnResize &&
          !this._options.rtl &&
          !this._options.forceFitColumns &&
          this.getColumnDockingBand(i) === 'center'
        ) {
          const columnRight = this.columnPosRight[i];
          const previousScrollLeft = this._viewportScrollContainerX.scrollLeft;
          // A centre column's coordinates are relative to the centre band, so the width it has
          // to outgrow is the band's visible width, not the whole scroll owner's. Comparing
          // against the latter left the pinned bands' width as dead room, in which the column
          // could grow past the edge without the grid ever following it.
          const viewportWidth = Math.max(
            0,
            this._viewportScrollContainerX.clientWidth - this.dockingLayout.leftWidth - this.dockingLayout.rightWidth
          );
          const isLastVisibleColumn = i === vc.length - 1;
          if (isLastVisibleColumn) {
            this._isResizingColumn = true;
            const maxScrollLeft = Math.max(0, this._viewportScrollContainerX.scrollWidth - this._viewportScrollContainerX.clientWidth);
            this.scrollToX(maxScrollLeft);
          } else if (columnRight > previousScrollLeft + viewportWidth) {
            this._isResizingColumn = true;
            this.scrollToX(columnRight - viewportWidth);
          }
          resizeAutoScrollDeltaX += this._viewportScrollContainerX.scrollLeft - previousScrollLeft;
        }

        this.trigger(this.onColumnsDrag, {
          triggeredByColumn: resizeElms.resizeableElement,
          resizeHandle: resizeElms.resizeableHandleElement,
        });
      };

      this.slickResizableInstances.push(
        Resizable({
          resizeableElement: colElm as HTMLElement,
          resizeableHandleElement: resizeableHandle,
          onResizeStart: (e, resizeElms): boolean | void => {
            const targetEvent = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
            if (!this.getEditorLock()?.commitCurrentEdit()) {
              return false;
            }
            pageX = (targetEvent as MouseEvent).pageX;
            resizeElms.resizeableElement.classList.add('slick-header-column-active');
            let shrinkLeewayOnRight: number | null = null;
            let stretchLeewayOnRight: number | null = null;
            // lock each column's width option to current width
            for (let pw = 0; pw < children.length; pw++) {
              if (pw < vc.length && vc[pw]) {
                vc[pw].previousWidth = children[pw].offsetWidth;
              }
            }
            if (this._options.forceFitColumns) {
              shrinkLeewayOnRight = 0;
              stretchLeewayOnRight = 0;
              // colums on right affect maxPageX/minPageX
              for (j = i + 1; j < vc.length; j++) {
                c = vc[j];
                if (c?.resizable) {
                  if (stretchLeewayOnRight !== null) {
                    if (c.maxWidth) {
                      stretchLeewayOnRight += c.maxWidth - (c.previousWidth || 0);
                    } else {
                      stretchLeewayOnRight = null;
                    }
                  }
                  shrinkLeewayOnRight += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);

                }
              }
            }
            let shrinkLeewayOnLeft = 0;
            let stretchLeewayOnLeft: number | null = 0;
            for (j = 0; j <= i; j++) {
              // columns on left only affect minPageX
              c = vc[j];
              if (c?.resizable) {
                if (stretchLeewayOnLeft !== null) {
                  /* v8 ignore if */
                  if (c.maxWidth) {
                    stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0);
                  } else {
                    stretchLeewayOnLeft = null;
                  }
                }
                shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
              }
            }
            if (this._options.rtl) {
              maxPageX = pageX + Math.min(shrinkLeewayOnLeft ?? 100000, stretchLeewayOnRight ?? 100000);
              minPageX = pageX - Math.min(shrinkLeewayOnRight ?? 100000, stretchLeewayOnLeft ?? 100000);
            } else {
              maxPageX = pageX + Math.min(shrinkLeewayOnRight ?? 100000, stretchLeewayOnLeft ?? 100000);
              minPageX = pageX - Math.min(shrinkLeewayOnLeft ?? 100000, stretchLeewayOnRight ?? 100000);
            }
            resizeAutoScrollDeltaX = 0;
            autoScrollClientX = (targetEvent as MouseEvent).clientX;
            stopColumnResizeAutoScroll();
          },
          onResize: (e, resizeElms) => {
            const targetEvent = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
            let targetPageX = (targetEvent as MouseEvent).pageX;
            if (this.getColumnDockingBand(i) === 'center') {
              targetPageX = updateColumnResizeAutoScroll((targetEvent as MouseEvent).clientX, targetPageX, (resizePageX) =>
                applyColumnResize(resizePageX, resizeElms)
              );

            }
            applyColumnResize(targetPageX + resizeAutoScrollDeltaX, resizeElms);
          },
          onResizeEnd: (_e, resizeElms) => {
            stopColumnResizeAutoScroll();
            resizeAutoScrollDeltaX = 0;
            this._isResizingColumn = false;
            resizeElms.resizeableElement.classList.remove('slick-header-column-active');

            const triggeredByColumn = resizeElms.resizeableElement.id.replace(this.uid, '');
            if (this.trigger(this.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === true) {
              this.applyColumnHeaderWidths();
            }
            let newWidth;
            for (j = 0; j < vc.length; j++) {
              c = vc[j];
              if (c && !c.hidden && children[j]) {
                newWidth = children[j].offsetWidth;

                if (c.previousWidth !== newWidth && c.rerenderOnResize) {
                  this.invalidateAllRows();
                }
              }
            }
            this.updateCanvasWidth(true);
            if (this._options.autoHeaderHeight) {
              this.recalculateHeaderHeight();
            } else {
              this.render();
            }
            this.scrollToX(this._viewportScrollContainerX.scrollLeft);
            this.trigger(this.onColumnsResized, { triggeredByColumn });
            clearTimeout(this._columnResizeTimer);
            this._columnResizeTimer = setTimeout(() => (this.columnResizeDragging = false), this._options.columnResizingDelay);
          },
        })
      );
    }
  }

  // Column Management - Autosizing
  //////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Proportionally resize a specific column by its name, index or Id
   *
   * Resizes based on its content, but determines the column definition from the provided identifier or index.
   * Then, obtains a grid canvas and calls getColAutosizeWidth to compute and update the column’s width.
   */
  autosizeColumn(columnOrIndexOrId: number | string, isInit?: boolean) {
    let colDef: C | null = null;
    let colIndex = -1;
    if (typeof columnOrIndexOrId === 'number') {
      colDef = this.columns[columnOrIndexOrId];
      colIndex = columnOrIndexOrId;
    } else if (typeof columnOrIndexOrId === 'string') {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].id === columnOrIndexOrId) { colDef = this.columns[i]; colIndex = i; }
      }
    }
    if (!colDef) {
      return;
    }
    const gridCanvas = this.getCanvasNode(0, 0) as HTMLElement;
    this.getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit || false, colIndex);
  }

  /**
   * Returns true if the column should be treated as locked (i.e. not resized) based on autosize settings.
   * The decision is based on whether header text is not ignored, sizeToRemaining is false,
   * content size equals header width, and the current width is less than a pixel threshold (default 100px).
   *
   * @param {AutoSize} [autoSize={}] - The autosize configuration for the column.
   * @returns {boolean} - Returns `true` if the column should be treated as locked, otherwise `false`.
   */
  protected treatAsLocked(autoSize: AutoSize = {}): boolean {
    // treat as locked (don't resize) if small and header is the widest part
    return !autoSize.ignoreHeaderText
      && !autoSize.sizeToRemaining
      && (autoSize.contentSizePx === autoSize.headerWidthPx)
      && ((autoSize.widthPx ?? 0) < (this._options.colAutosizeTreatAsLockedBelowWidth ?? 100));
  }

  /** Proportionately resizes all columns to fill available horizontal space.
   * This does not take the cell contents into consideration.
   *
   * It does this by temporarily caching CSS for hidden containers, calling the internal autosizing logic
   * (internalAutosizeColumns) with the autosize mode and initialisation flag,
   * then restores the original CSS.
   */
  autosizeColumns(autosizeMode?: string, isInit?: boolean) {
    const checkHiddenParents = !(this._hiddenParents?.length);
    if (checkHiddenParents) {
      this.cacheCssForHiddenInit();
    }
    this.internalAutosizeColumns(autosizeMode, isInit);
    if (checkHiddenParents) {
      this.restoreCssFromHiddenInit();
    }
  }

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
  protected internalAutosizeColumns(autosizeMode?: string, isInit?: boolean) {
    // LogColWidths();
    autosizeMode = autosizeMode || this._options.autosizeColsMode;
    if (autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
      this.legacyAutosizeColumns();
      return;
    }

    if (autosizeMode === GridAutosizeColsMode.None) {
      return;
    }

    // test for brower canvas support, canvas_context!=null if supported
    this.canvas = document.createElement('canvas');
    if (this.canvas?.getContext) { this.canvas_context = this.canvas.getContext('2d'); }

    // pass in the grid canvas
    const gridCanvas = this.getCanvasNode(0, 0) as HTMLElement;
    const viewportWidth = this.getViewportInnerWidth();

    // iterate columns to get autosizes
    let i: number;
    let c: C;
    let colWidth: number;
    let reRender = false;
    let totalWidth = 0;
    let totalWidthLessSTR = 0;
    let strColsMinWidth = 0;
    let totalMinWidth = 0;
    let totalLockedColWidth = 0;
    for (i = 0; i < this.columns.length; i++) {
      c = this.columns[i];
      this.getColAutosizeWidth(c, i, gridCanvas, isInit || false, i);
      totalLockedColWidth += (c.autoSize?.autosizeMode === ColAutosizeMode.Locked ? (c.width || 0) : (this.treatAsLocked(c.autoSize) ? c.autoSize?.widthPx || 0 : 0));
      totalMinWidth += (c.autoSize?.autosizeMode === ColAutosizeMode.Locked ? (c.width || 0) : (this.treatAsLocked(c.autoSize) ? c.autoSize?.widthPx || 0 : c.minWidth || 0));
      totalWidth += (c.autoSize?.widthPx || 0);
      totalWidthLessSTR += (c.autoSize?.sizeToRemaining ? 0 : c.autoSize?.widthPx || 0);
      strColsMinWidth += (c.autoSize?.sizeToRemaining ? c.minWidth || 0 : 0);
    }
    const strColTotalGuideWidth = totalWidth - totalWidthLessSTR;

    if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
      // - if viewport with is outside MinViewportWidthPx and MaxViewportWidthPx, then the viewport is set to
      //   MinViewportWidthPx or MaxViewportWidthPx and the FitColsToViewport algorithm is used
      // - viewport is resized to fit columns
      let setWidth = totalWidth + (this.scrollbarDimensions?.width ?? 0);
      autosizeMode = GridAutosizeColsMode.IgnoreViewport;

      if (this._options.viewportMaxWidthPx && setWidth > this._options.viewportMaxWidthPx) {
        setWidth = this._options.viewportMaxWidthPx;
        autosizeMode = GridAutosizeColsMode.FitColsToViewport;
      } else if (this._options.viewportMinWidthPx && setWidth < this._options.viewportMinWidthPx) {
        setWidth = this._options.viewportMinWidthPx;
        autosizeMode = GridAutosizeColsMode.FitColsToViewport;
      } else {
        // falling back to IgnoreViewport will size the columns as-is, with render checking
        // for (i = 0; i < columns.length; i++) { columns[i].width = columns[i].autoSize.widthPx; }
      }
      Utils.width(this._container, setWidth);
    }

    if (autosizeMode === GridAutosizeColsMode.FitColsToViewport) {
      if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
        // if addl space remains in the viewport and there are SizeToRemaining cols, just the SizeToRemaining cols expand proportionally to fill viewport
        for (i = 0; i < this.columns.length; i++) {
          c = this.columns[i];
          if (!c || c.hidden) { continue; }

          const totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
          if (c.autoSize?.sizeToRemaining) {
            colWidth = totalSTRViewportWidth * (c.autoSize?.widthPx || 0) / strColTotalGuideWidth;
          } else {
            colWidth = (c.autoSize?.widthPx || 0);
          }
          if (c.rerenderOnResize && (c.width || 0) !== colWidth) {
            reRender = true;
          }
          c.width = colWidth;
        }
      } else if ((this._options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * this._options.viewportSwitchToScrollModeWidthPercent / 100)
        || (totalMinWidth > viewportWidth)) {
        // if the total columns width is wider than the viewport by switchToScrollModeWidthPercent, switch to IgnoreViewport mode
        autosizeMode = GridAutosizeColsMode.IgnoreViewport;
      } else {
        // otherwise (ie. no SizeToRemaining cols or viewport smaller than columns) all cols other than 'Locked' scale in proportion to fill viewport
        // and SizeToRemaining get minWidth
        let unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth;
        let unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
        for (i = 0; i < this.columns.length; i++) {
          c = this.columns[i];
          if (!c || c.hidden) { continue; }

          colWidth = c.width || 0;
          if (c.autoSize?.autosizeMode !== ColAutosizeMode.Locked && !this.treatAsLocked(c.autoSize)) {
            if (c.autoSize?.sizeToRemaining) {
              colWidth = c.minWidth || 0;
            } else {
              // size width proportionally to free space (we know we have enough room due to the earlier calculations)
              colWidth = unallocatedViewportWidth / unallocatedColWidth * (c.autoSize?.widthPx || 0) - 1;
              if (colWidth < (c.minWidth || 0)) {
                colWidth = c.minWidth || 0;
              }

              // remove the just allocated widths from the allocation pool
              unallocatedColWidth -= (c.autoSize?.widthPx || 0);
              unallocatedViewportWidth -= colWidth;
            }
          }
          if (this.treatAsLocked(c.autoSize)) {
            colWidth = (c.autoSize?.widthPx || 0);
            if (colWidth < (c.minWidth || 0)) {
              colWidth = c.minWidth || 0;
            }
          }
          if (c.rerenderOnResize && c.width !== colWidth) {
            reRender = true;
          }
          c.width = colWidth;
        }
      }
    }

    if (autosizeMode === GridAutosizeColsMode.IgnoreViewport) {
      // just size columns as-is
      for (i = 0; i < this.columns.length; i++) {
        if (!this.columns[i] || this.columns[i].hidden) { continue; }

        colWidth = this.columns[i].autoSize?.widthPx || 0;
        if (this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth) {
          reRender = true;
        }
        this.columns[i].width = colWidth;
      }
    }

    this.reRenderColumns(reRender);
  }

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
  protected getColAutosizeWidth(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number) {
    const autoSize = columnDef.autoSize as AutoSize;

    // set to width as default
    autoSize.widthPx = columnDef.width;
    if (autoSize.autosizeMode === ColAutosizeMode.Locked
      || autoSize.autosizeMode === ColAutosizeMode.Guide) {
      return;
    }

    const dl = this.getDataLength(); // getDataItem();
    const isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);

    // ContentIntelligent takes settings from column data type
    if (autoSize.autosizeMode === ColAutosizeMode.ContentIntelligent) {
      // default to column colDataTypeOf (can be used if initially there are no data rows)
      let colDataTypeOf = autoSize.colDataTypeOf;
      let colDataItem: any;
      if (dl > 0) {
        const tempRow = this.getDataItem(0);
        if (tempRow) {
          colDataItem = tempRow[columnDef.field as keyof TData];

          // check for dates in hiding
          if (isoDateRegExp.test(colDataItem)) { colDataItem = Date.parse(colDataItem); }

          colDataTypeOf = typeof colDataItem;
          if (colDataTypeOf === 'object') {
            if (colDataItem instanceof Date) { colDataTypeOf = 'date'; }
            if (typeof moment !== 'undefined' && colDataItem instanceof moment) { colDataTypeOf = 'moment'; }
          }
        }
      }
      if (colDataTypeOf === 'boolean') {
        autoSize.colValueArray = [true, false];
      }
      if (colDataTypeOf === 'number') {
        autoSize.valueFilterMode = ValueFilterMode.GetGreatestAndSub;
        autoSize.rowSelectionMode = RowSelectionMode.AllRows;
      }
      if (colDataTypeOf === 'string') {
        autoSize.valueFilterMode = ValueFilterMode.GetLongestText;
        autoSize.rowSelectionMode = RowSelectionMode.AllRows;
        autoSize.allowAddlPercent = 5;
      }
      if (colDataTypeOf === 'date') {
        autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]; // Sep 30th 2009, 12:20:20 AM
      }
      if (colDataTypeOf === 'moment' && typeof moment !== 'undefined') {
        autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]; // Sep 30th 2009, 12:20:20 AM
      }
    }

    // at this point, the autosizeMode is effectively 'Content', so proceed to get size
    let colWidth = autoSize.contentSizePx = this.getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);

    if (colWidth === 0) {
      colWidth = autoSize.widthPx || 0;
    }

    const addlPercentMultiplier = (autoSize.allowAddlPercent ? (1 + autoSize.allowAddlPercent / 100) : 1);
    colWidth = colWidth * addlPercentMultiplier + (this._options.autosizeColPaddingPx || 0);
    if (columnDef.minWidth && colWidth < columnDef.minWidth) { colWidth = columnDef.minWidth; }
    if (columnDef.maxWidth && colWidth > columnDef.maxWidth) { colWidth = columnDef.maxWidth; }

    if (autoSize.autosizeMode === ColAutosizeMode.ContentExpandOnly || ((columnDef?.editor as any)?.ControlFillsColumn)) {
      // only use content width if it's wider than the default column width (this is used for dropdowns and other fixed width controls)
      if (colWidth < (columnDef.width || 0)) {
        colWidth = columnDef.width || 0;
      }
    }
    autoSize.widthPx = colWidth;
  }

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
  protected getColContentSize(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number) {
    const autoSize = columnDef.autoSize as AutoSize;
    let widthAdjustRatio = 1;

    // at this point, the autosizeMode is effectively 'Content', so proceed to get size

    // get header width, if we are taking notice of it
    let i: number;
    let tempVal: any;
    let maxLen = 0;
    let maxColWidth = 0;
    autoSize.headerWidthPx = 0;

    if (!autoSize.ignoreHeaderText) {
      autoSize.headerWidthPx = this.getColHeaderWidth(columnDef);
    }
    if (autoSize.headerWidthPx === 0) {
      autoSize.headerWidthPx = (columnDef.width ? columnDef.width
        : (columnDef.maxWidth ? columnDef.maxWidth
          : (columnDef.minWidth ? columnDef.minWidth : 20)
        )
      );
    }

    if (autoSize.colValueArray) {
      // if an array of values are specified, measure them instead of the data. `getColWidth()` walks
      // `startIndex`..`endIndex`, so the values have to be wrapped in a RowInfo - handing it the bare
      // array leaves those bounds undefined and the measuring loop never runs.
      const valueArrRowInfo = {
        colIndex,
        rowCount: autoSize.colValueArray.length,
        startIndex: 0,
        endIndex: autoSize.colValueArray.length - 1,
        valueArr: autoSize.colValueArray,
      } as RowInfo;
      maxColWidth = this.getColWidth(columnDef, gridCanvas, valueArrRowInfo);
      return Math.max(autoSize.headerWidthPx, maxColWidth);
    }

    // select rows to evaluate using rowSelectionMode and rowSelectionCount
    const rowInfo = {} as RowInfo;
    rowInfo.colIndex = colIndex;
    rowInfo.rowCount = this.getDataLength();

    if (rowInfo.rowCount === 0) {
      return autoSize.headerWidthPx;
    }

    rowInfo.startIndex = 0;
    rowInfo.endIndex = rowInfo.rowCount - 1;
    rowInfo.valueArr = null;
    rowInfo.getRowVal = (j: number) => this.getCellValue(j, columnDef.field as string);

    const rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : undefined) || autoSize.rowSelectionMode;

    if (rowSelectionMode === RowSelectionMode.FirstRow) { rowInfo.endIndex = 0; }
    if (rowSelectionMode === RowSelectionMode.LastRow) { rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1; }
    if (rowSelectionMode === RowSelectionMode.FirstNRows) { rowInfo.endIndex = Math.min(autoSize.rowSelectionCount || 0, rowInfo.rowCount) - 1; }

    // now use valueFilterMode to further filter selected rows
    if (autoSize.valueFilterMode === ValueFilterMode.DeDuplicate) {
      const rowsDict: any = {};
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        rowsDict[rowInfo.getRowVal(i)] = true;
      }
      if (Object.keys) {
        rowInfo.valueArr = Object.keys(rowsDict);
      } else {
        rowInfo.valueArr = [];
        for (const v in rowsDict) {
          if (rowsDict) {
            rowInfo.valueArr.push(v);
          }
        }
      }
      rowInfo.startIndex = 0;
      rowInfo.endIndex = rowInfo.length - 1;
    }

    if (autoSize.valueFilterMode === ValueFilterMode.GetGreatestAndSub) {
      // get greatest abs value in data
      let maxVal;
      let maxAbsVal = -1;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        tempVal = rowInfo.getRowVal(i);
        if (Math.abs(tempVal) > maxAbsVal) {
          maxVal = tempVal; maxAbsVal = Math.abs(tempVal);
        }
      }
      // now substitute a '9' for all characters (to get widest width) and convert back to a number
      maxVal = '' + maxVal;
      maxVal = Array(maxVal.length + 1).join('9');
      maxVal = +maxVal;

      rowInfo.valueArr = [maxVal];
      rowInfo.startIndex = rowInfo.endIndex = 0;
    }

    if (autoSize.valueFilterMode === ValueFilterMode.GetLongestTextAndSub) {
      // get greatest abs value in data
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        tempVal = rowInfo.getRowVal(i);
        if ((tempVal || '').length > maxLen) { maxLen = tempVal.length; }
      }
      // now substitute a 'm' for all characters
      tempVal = Array(maxLen + 1).join('m');
      widthAdjustRatio = this._options.autosizeTextAvgToMWidthRatio || 0;

      rowInfo.maxLen = maxLen;
      rowInfo.valueArr = [tempVal];
      rowInfo.startIndex = rowInfo.endIndex = 0;
    }

    if (autoSize.valueFilterMode === ValueFilterMode.GetLongestText) {
      // get greatest abs value in data
      maxLen = 0; let maxIndex = 0;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        tempVal = rowInfo.getRowVal(i);
        if ((tempVal || '').length > maxLen) { maxLen = tempVal.length; maxIndex = i; }
      }
      // now substitute a 'c' for all characters
      tempVal = rowInfo.getRowVal(maxIndex);
      rowInfo.maxLen = maxLen;
      rowInfo.valueArr = [tempVal];
      rowInfo.startIndex = rowInfo.endIndex = 0;
    }

    // !!! HACK !!!!
    if (rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1) { autoSize.sizeToRemaining = true; }
    maxColWidth = this.getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio;
    return Math.max(autoSize.headerWidthPx, maxColWidth);
  }

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
  protected getColWidth(columnDef: C, gridCanvas: HTMLElement, rowInfo: RowInfo) {
    const rowEl = Utils.createDomElement('div', { className: 'slick-row ui-widget-content' }, gridCanvas);
    const cellEl = Utils.createDomElement('div', { className: 'slick-cell' }, rowEl);

    cellEl.style.position = 'absolute';
    cellEl.style.visibility = 'hidden';
    cellEl.style.textOverflow = 'initial';
    cellEl.style.whiteSpace = 'nowrap';

    let i: number;
    let len: number;
    let max = 0;
    let maxText = '';
    let formatterResult: string | FormatterResultWithHtml | FormatterResultWithText | HTMLElement | DocumentFragment;
    let val: any;

    // get mode - if text only display, use canvas otherwise html element
    let useCanvas = (columnDef.autoSize!.widthEvalMode === WidthEvalMode.TextOnly);

    if (columnDef.autoSize?.widthEvalMode === WidthEvalMode.Auto) {
      const noFormatter = !columnDef.formatterOverride && !columnDef.formatter;
      const formatterIsText = ((columnDef?.formatterOverride as { ReturnsTextOnly: boolean })?.ReturnsTextOnly)
        || (!columnDef.formatterOverride && (columnDef.formatter as any)?.ReturnsTextOnly);
      useCanvas = noFormatter || formatterIsText;
    }

    // use canvas - very fast, but text-only
    if (this.canvas_context && useCanvas) {
      const style = getComputedStyle(cellEl);
      this.canvas_context.font = style.fontSize + ' ' + style.fontFamily;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        // row is either an array or values or a single value
        val = (rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i));

        if (columnDef.formatterOverride) {
          // use formatterOverride as first preference
          formatterResult = (columnDef.formatterOverride as FormatterOverrideCallback)(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this as unknown as SlickGridModel);
        } else if (columnDef.formatter) {
          // otherwise, use formatter
          formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this as unknown as SlickGridModel);
        } else {
          // otherwise, use plain text
          formatterResult = '' + val;
        }
        len = formatterResult ? this.canvas_context.measureText(formatterResult as string).width : 0;
        if (len > max) {
          max = len;
          maxText = formatterResult as string;
        }
      }

      cellEl.textContent = maxText;
      len = cellEl.offsetWidth;

      rowEl.remove();
      return len;
    }

    for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
      val = (rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i));
      if (columnDef.formatterOverride) {
        // use formatterOverride as first preference
        formatterResult = (columnDef.formatterOverride as FormatterOverrideCallback)(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this as unknown as SlickGridModel);
      } else if (columnDef.formatter) {
        // otherwise, use formatter
        formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this as unknown as SlickGridModel);
      } else {
        // otherwise, use plain text
        formatterResult = '' + val;
      }
      this.applyFormatResultToCellNode(formatterResult, cellEl);
      len = cellEl.offsetWidth;
      if (len > max) { max = len; }
    }

    rowEl.remove();
    return max;
  }

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
  protected getColHeaderWidth(columnDef: C) {
    let width = 0;
    // if (columnDef && (!columnDef.resizable || columnDef._autoCalcWidth === true)) { return; }
    const headerColElId = this.getUID() + columnDef.id;
    const domRootOrDocument = (this._options?.shadowRoot ?? document) as Document | ShadowRoot;
    let headerColEl = (domRootOrDocument as Document).getElementById
      ? (domRootOrDocument as Document).getElementById(headerColElId) as HTMLDivElement
      : domRootOrDocument.querySelector<HTMLDivElement>(`[id="${headerColElId}"]`);
    const dummyHeaderColElId = `${headerColElId}_`;
    if (headerColEl) {
      // headers have been created, use clone technique
      const clone = headerColEl.cloneNode(true) as HTMLElement;
      clone.id = dummyHeaderColElId;
      clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
      headerColEl.parentNode!.insertBefore(clone, headerColEl);
      width = clone.offsetWidth;
      clone.remove();
    } else {
      // headers have not yet been created, create a new node
      const header = this.getHeader(columnDef) as HTMLElement;
      headerColEl = Utils.createDomElement('div', { id: dummyHeaderColElId, className: 'ui-state-default slick-state-default slick-header-column' }, header);
      const colNameElm = Utils.createDomElement('span', { className: 'slick-column-name' }, headerColEl);
      this.applyHtmlCode(colNameElm, columnDef.name);
      headerColEl.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
      if (columnDef.headerCssClass) {
        headerColEl.classList.add(...Utils.classNameToList(columnDef.headerCssClass));
      }
      width = headerColEl.offsetWidth;
      headerColEl.remove();
    }
    return width;
  }

  /**
   * Iterates over all columns to collect current widths (skipping hidden ones), calculates total width
   * and available shrink leeway, then enters a “shrink” loop if the total width exceeds the available
   * viewport width and a “grow” loop if below. Finally, it applies the computed widths to the columns
   * and calls reRenderColumns (with a flag if any width changed) to update the grid.
   */
  protected legacyAutosizeColumns() {
    let i;
    let c: C | undefined;
    let shrinkLeeway = 0;
    let total = 0;
    let prevTotal = 0;
    const widths: number[] = [];
    const availWidth = this.getViewportInnerWidth();

    for (i = 0; i < this.columns.length; i++) {
      c = this.columns[i];
      if (!c || c.hidden) {
        widths.push(0);
        continue;
      }
      widths.push(c.width || 0);
      total += c.width || 0;
      if (c.resizable) {
        shrinkLeeway += (c.width || 0) - Math.max((c.minWidth || 0), this.absoluteColumnMinWidth);
      }
    }

    // shrink
    prevTotal = total;
    while (total > availWidth && shrinkLeeway) {
      const shrinkProportion = (total - availWidth) / shrinkLeeway;
      for (i = 0; i < this.columns.length && total > availWidth; i++) {
        c = this.columns[i];
        if (!c || c.hidden) { continue; }
        const width = widths[i];
        if (!c.resizable || width <= c.minWidth! || width <= this.absoluteColumnMinWidth) {
          continue;
        }
        const absMinWidth = Math.max(c.minWidth!, this.absoluteColumnMinWidth);
        let shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
        shrinkSize = Math.min(shrinkSize, width - absMinWidth);
        total -= shrinkSize;
        shrinkLeeway -= shrinkSize;
        widths[i] -= shrinkSize;
      }
      if (prevTotal <= total) {  // avoid infinite loop
        break;
      }
      prevTotal = total;
    }

    // grow
    prevTotal = total;
    while (total < availWidth) {
      const growProportion = availWidth / total;
      for (i = 0; i < this.columns.length && total < availWidth; i++) {
        c = this.columns[i];
        if (!c || c.hidden) { continue; }
        const currentWidth = widths[i];
        let growSize;

        if (!c.resizable || c.maxWidth! <= currentWidth) {
          growSize = 0;
        } else {
          growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, (c.maxWidth! - currentWidth) || 1000000) || 1;
        }
        total += growSize;
        widths[i] += (total <= availWidth ? growSize : 0);
      }
      if (prevTotal >= total) {  // avoid infinite loop
        break;
      }
      prevTotal = total;
    }

    let reRender = false;
    for (i = 0; i < this.columns.length; i++) {
      c = this.columns[i];
      if (!c || c.hidden) { continue; }

      if (this.columns[i].rerenderOnResize && this.columns[i].width !== widths[i]) {
        reRender = true;
      }
      this.columns[i].width = widths[i];
    }

    this.reRenderColumns(reRender);
  }

  /**
   * Apply Columns Widths in the UI and optionally invalidate & re-render the columns when specified
   * @param {Boolean} shouldReRender - should we invalidate and re-render the grid?
   */
  reRenderColumns(reRender?: boolean) {
    this.applyColumnHeaderWidths();
    this.updateCanvasWidth(true);

    if (this._options.autoHeaderHeight) {
      this.recalculateHeaderHeight();
    }

    this.trigger(this.onAutosizeColumns, { columns: this.columns });

    if (reRender) {
      this.invalidateAllRows();
      this.render();
    }
  }

  /**
  * Returns an array of column definitions filtered to exclude any that are marked as hidden.
  *
  * @returns
  */
  getVisibleColumns(): C[] {
    return this.columns.filter((column) => !!column && !column.hidden);
  }

  /** Returns the index of a visible column by its id. */
  getVisibleColumnIndex(id: number | string): number {
    return this.visibleColumnsById[id];
  }

  /** Returns the column object by its id. */
  getColumnById(id: number | string): C | null {
    const index = this.getColumnIndex(id);
    if (Utils.isDefined(index)) {
      return this.columns[index];
    }
    return null;
  }

  /** Updates column properties by id and optionally refreshes the grid columns. */
  updateColumnById(columnId: number | string, props: Partial<C>, forceColumnUpdate = false): void {
    const column = this.getColumnById(columnId);
    if (Utils.isDefined(column)) {
      Object.assign(column, props);
    }

    if (forceColumnUpdate) {
      this.updateColumns();
    }
  }

  /**
   * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
   * @param {String | Number} id A column id.
   */
  getColumnIndex(id: number | string): number {
    return this.columnsById[id];
  }

  /**
   * Iterates over the header elements (from both left and right headers) and updates each header’s width based on the
   * corresponding visible column’s width minus a computed adjustment (headerColumnWidthDiff).
   * Finally, it updates the internal column caches.
   *
   * @returns
   */
  protected applyColumnHeaderWidths(): void {
    if (this.initialized) {
      const vc = this.getVisibleColumns();
      const headers = this.usesDockingChromeRegions()
        ? this.getHeaderChildren()
        : (this._headers.flatMap((header) => Array.from(header.children)) as HTMLElement[]);
      headers.forEach((h, columnIndex) => {
        const col = vc[columnIndex] || {};
        const width = (col.width || 0) - this.headerColumnWidthDiff;
        if (Utils.width(h) !== width) {
          Utils.width(h, width);
        }
      });

      this.updateColumnCaches();
    }
  }

  /**
   * Iterates over all columns (skipping hidden ones) and, for each, retrieves the associated CSS rules
   * (using getColumnCssRules). It then sets the left and right CSS properties so that the columns align
   * correctly within the grid canvas. It also updates the cumulative offset for center-band columns.
   */
  protected applyColumnWidths(): void {
    let rule: any;
    const centerWidth = this.hasDockedColumns() ? this.getDockingRenderedWidths().center : this.dockingLayout.centerWidth;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i]) {
        const w = this.columns[i].hidden ? 0 : this.columns[i].width || 0;
        const docked = this.dockingByColumn.get(i);
        const useNaturalCenterPosition = this.usesStickyColumnTransformPath() && !this.columns[i].pinned;
        const x = useNaturalCenterPosition ? docked?.naturalOffset || 0 : (this.columnPosLeft[i] ?? docked?.offset ?? 0);
        const rightEdge = x + w;
        const bandWidth =
          useNaturalCenterPosition || docked?.band === 'center'
            ? centerWidth
            : docked?.band === 'left'
              ? this.dockingLayout.leftWidth
              : this.dockingLayout.rightWidth;

        rule = this.getColumnCssRules(i);
        if (this._options.rtl) {
          if (rule.left) {
            rule.left.style.right = `${x}px`;
          }
          if (rule.right) {
            rule.right.style.left = `${bandWidth - rightEdge}px`;
          }
        } else {
          if (rule.left) {
            rule.left.style.left = `${x}px`;
          }
          if (rule.right) {
            rule.right.style.right = `${bandWidth - rightEdge}px`;
          }
        }
      }
    }

    this.updateRenderedColspanFragmentGeometry();
  }

  /**
  * A convenience method that creates a sort configuration for one column (with the given sort direction)
  * and calls setSortColumns with it. Accepts a columnId string and an ascending boolean.
  * Applies a sort glyph in either ascending or descending form to the header of the column.
  * Note that this does not actually sort the column. It only adds the sort glyph to the header.
  *
  * @param {String | Number} columnId
  * @param {Boolean} ascending
  */
  setSortColumn(columnId: number | string, ascending: boolean): void {
    this.setSortColumns([{ columnId, sortAsc: ascending }]);
  }

  /**
  * Get column by index - iterates over header containers and returns the header column
  * element corresponding to the given index.
  *
  * @param {Number} id - column index
  * @returns
  */
  getColumnByIndex(idx: number): HTMLElement | undefined {
    if (this.usesDockingChromeRegions()) {
      const column = this.getVisibleColumns()[idx];
      return Array.from(this._headerL.querySelectorAll('.slick-header-column')).find(
        (element) => (element as HTMLElement).dataset.id === String(column?.id)
      ) as HTMLElement | undefined;
    }
    let result: HTMLElement | undefined;
    this._headers.every((header) => {
      const length = header.children.length;
      if (idx < length) {
        result = header.children[idx] as HTMLElement;
        return false;
      }
      idx -= length;
      return true;
    });

    return result;
  }

  /**
  * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ] to
  * define the grid's sort order. When called, this will apply a sort glyph in either ascending
  * or descending form to the header of each column specified in the array.
  * Note that this does not actually sort the column. It only adds the sort glyph to the header.
  *
  * @param {ColumnSort[]} cols - column sort
  */
  setSortColumns(cols: ColumnSort[]): void {
    this.sortColumns = cols;

    const numberCols = this._options.numberedMultiColumnSort && this.sortColumns.length > 1;
    this._headers.forEach((header) => {
      let indicators = header.querySelectorAll('.slick-header-column-sorted');
      // v8 ignore next
      indicators.forEach((indicator) => indicator.classList.remove('slick-header-column-sorted'));

      indicators = header.querySelectorAll('.slick-sort-indicator');
      indicators.forEach((indicator) => indicator.classList.remove('slick-sort-indicator-asc', 'slick-sort-indicator-desc'));

      indicators = header.querySelectorAll('.slick-sort-indicator-numbered');
      indicators.forEach((el) => (el.textContent = ''));
    });

    let i = 1;
    this.sortColumns.forEach((col) => {
      if (!Utils.isDefined(col.sortAsc)) {
        col.sortAsc = true;
      }

      const columnIndex = this.getVisibleColumnIndex(col.columnId);
      if (Utils.isDefined(columnIndex)) {
        const column = this.getColumnByIndex(columnIndex);
        if (column) {
          column.classList.add('slick-header-column-sorted');
          let indicator = column.querySelector('.slick-sort-indicator');
          indicator?.classList.add(col.sortAsc ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');

          if (numberCols) {
            indicator = column.querySelector('.slick-sort-indicator-numbered') as HTMLElement;
            if (indicator) {
              indicator.textContent = String(i);
            }
          }
        }
      }
      i++;
    });
  }

  /** Returns the current array of column definitions. */
  getColumns(): C[] {
    return this.columns;
  }

  /** Get sorted columns representing the current sorting state of the grid **/
  getSortColumns(): ColumnSort[] {
    return this.sortColumns;
  }

  /**
   * Iterates over all columns to compute and store their left and right boundaries
   * (based on cumulative widths). Rebuilds the corresponding docking and visibility caches.
   */
  protected updateColumnCaches(): void {
    this.refreshDockingLayout();
    this.updateColumnPositionCaches();
  }

  /**
   * Iterates over each column to (a) save its original width as widthRequest,
   * (b) apply default properties (using mixinDefaults if set) to both the column
   * and its autoSize property, (c) update the columnsById mapping, and (d) adjust
   * the width if it is less than minWidth or greater than maxWidth.
   */
  protected updateColumnProps(): void {
    this.columnsById = Object.create(null);
    this.visibleColumnsById = Object.create(null);

    for (let i = 0; i < this.columns.length; i++) {
      let m: C = this.columns[i] || {};
      if (m.width) {
        m.widthRequest = m.width;
      }

      if (this._options.mixinDefaults) {
        Utils.applyDefaults(m, this._columnDefaults);
        if (!m.autoSize) {
          m.autoSize = {};
        }
        Utils.applyDefaults(m.autoSize, this._columnAutosizeDefaults);
      } else {
        m = this.columns[i] = Utils.extend({}, this._columnDefaults, m);
        m.autoSize = Utils.extend({}, this._columnAutosizeDefaults, m.autoSize);
      }

      this.columnsById[m.id] = i;
      if (m.minWidth && (m.width || 0) < m.minWidth) {
        m.width = m.minWidth;
      }
      if (m.maxWidth && (m.width || 0) > m.maxWidth) {
        m.width = m.maxWidth;
      }
    }
    // also update visible columns
    this.getVisibleColumns().forEach((col, idx) => {
      this.visibleColumnsById[col.id] = idx;
    });
    this.refreshDockingLayout();
  }

  /**
   * Sets grid columns. Column headers will be recreated and all rendered rows will be removed. To rerender the grid (if necessary), call render().
   * @param {Column[]} newColumns An array of column definitions.
   * @param {boolean} [waitNextCycle=false] - should we wait for a microtask cycle before updating column headers
   */
  setColumns(newColumns: C[], waitNextCycle = false): boolean {
    // Validate the prospective pinning on a copy so a rejected request leaves the caller's column
    // definitions untouched and fires no events.
    const shouldValidateProspectivePinning = this.hasConfiguredColumnDocking() || newColumns.some((column) => !!column?.pinned || !!column?.sticky);
    if (shouldValidateProspectivePinning) {
      const prospectiveColumns = newColumns.map((column) => (column ? { ...column } : column));
      this.applyColumnPinningOptions(prospectiveColumns);
      if (!this.validateColumnPinning(undefined, true, prospectiveColumns)) {
        return false;
      }
    }
    this.applyColumnPinningOptions(newColumns);
    this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns, grid: this });
    this.dockingController.reset();
    this.columns = newColumns;
    this._container.setAttribute('aria-colcount', this.columns.length.toString());
    const updateCols = () => {
      this.updateColumns();
      this.trigger(this.onAfterSetColumns, { newColumns, grid: this });
    };
    waitNextCycle ? queueMicrotaskPolyfill(() => updateCols()) : updateCols();
    return true;
  }

  /** Update columns for when a hidden property has changed but the column list itself has not changed. */
  updateColumns(): void {
    this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this });
    this.updateColumnsInternal();
    this.trigger(this.onAfterUpdateColumns, { columns: this.columns, grid: this });
  }

  /**
   * Triggers onBeforeUpdateColumns and calls updateColumnProps to update column properties,
   * caches, header/footer elements, CSS rules, canvas dimensions, and selections without changing the column array.
   */
  protected updateColumnsInternal(): void {
    this.updateColumnProps();
    // updateColumns() is also reached directly (for example from the Column Picker);
    // re-apply the declarative pinning so rebuilding the headers keeps the pinned flags.
    this.applyColumnPinningOptions(this.columns);
    this.updateColumnCaches();

    if (this.initialized) {
      // Materialize the docking scrollbar lazily when pinning/sticky state is
      // introduced after initialization, while preserving the legacy
      // viewport scroll owner for ordinary grids.
      if (this.hasConfiguredDocking() && !this.hasDockingHorizontalScroller()) {
        this.activateSingleViewportLayout();
        this.setScroller();
        this._bindingEventService.bind(
          this._dockingHorizontalScroller!,
          'scroll',
          this.handleScroll.bind(this),
          {},
          'docking-horizontal-scroll'
        );
      }
      this.setOverflow();
      this.invalidateAllRows();
      this.createColumnHeaders();
      this.createColumnFooter();
      this.removeCssRules();
      this.createCssRules();
      this.resizeCanvas();
      this.updateCanvasWidth();
      this.applyColumnWidths();
      if (this._options.autoHeaderHeight) {
        this.recalculateHeaderHeight();
      }
      this.handleScroll();
      this.getSelectionModel()?.refreshSelections();
    }
  }

  /** Get Editor lock */
  getEditorLock() {
    return this._options.editorLock as SlickEditorLock;
  }

  /** Get Editor Controller */
  getEditController(): EditController | undefined {
    return this.editController;
  }

  /**
   * Sets a new source for databinding and removes all rendered rows. Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
   * @param {CustomDataView|Array<*>} newData New databinding source using a regular JavaScript array.. or a custom object exposing getItem(index) and getLength() functions.
   * @param {Number} [scrollToTop] If true, the grid will reset the vertical scroll position to the top of the grid.
   */
  setData(newData: CustomDataView<TData> | TData[], scrollToTop?: boolean): void {
    this.data = newData;
    this.invalidateAllRows();
    this.updateRowCount();
    if (scrollToTop) {
      this.scrollTo(0);
    }
  }

  /** Returns the size of the databinding source. */
  getDataLength(): number {
    if ((this.data as CustomDataView<TData>).getLength) {
      return (this.data as CustomDataView<TData>).getLength();
    }
    return (this.data as TData[])?.length || 0;
  }

  /**
   * Returns the number of data items plus an extra row if enableAddRow is true and paging conditions allow.
   *
   * @returns
   */
  protected getDataLengthIncludingAddNew(): number {
    return this.getDataLength() + (!this._options.enableAddRow ? 0 : !this.pagingActive || this.pagingIsLastPage ? 1 : 0);
  }

  /**
   * Returns the databinding item at a given position.
   * @param {Number} index Item row index.
   */
  getDataItem(i: number): TData {
    if ((this.data as CustomDataView).getItem) {
      return (this.data as CustomDataView<TData>).getItem(i) as TData;
    }
    return (this.data as TData[])[i] as TData;
  }

  /**
  * Returns the value of a single field for a given row index.
  *
  * When the databinding source is a `CustomDataView` that implements the optional
  * `getCellValue(index, field)` accessor, that method is used directly. This allows
  * column-oriented (or otherwise non row-materializing) data sources to return a
  * single cell value without first having to build a full row object via `getItem()`,
  * which can be expensive when called repeatedly (e.g. during column content auto-sizing).
  *
  * Falls back to `getDataItem(i)[field]` for plain arrays or data sources that don't
  * implement `getCellValue`.
  *
  * @param {Number} i Item row index.
  * @param {String} field Column field name.
  */
  getCellValue(i: number, field: string): TData[keyof TData] {
    const item = this.getDataItem(i) as TData;
    if (Array.isArray(this.data)) {
      return item?.[field as keyof TData] as TData[keyof TData];
    }
    const dataView = this.data as CustomDataView<TData>;
    return (dataView.getCellValue ? dataView.getCellValue(i, field) : item?.[field as keyof TData]) as TData[keyof TData];
  }

  /** Are we using a DataView? */
  hasDataView(): boolean {
    return !Array.isArray(this.data);
  }

  /**
   * Returns item metadata by a row index when it exists
   * @param {Number} row
   * @returns {ItemMetadata | null}
   */
  getItemMetadaWhenExists(row: number): ItemMetadata | null {
    return 'getItemMetadata' in this.data ? (this.data as CustomDataView<TData>).getItemMetadata(row) : null;
  }

  /**
   * Determines the proper formatter for a given cell by checking row metadata for column overrides,
   * then falling back to the column’s formatter, a formatter from the formatterFactory, or the default formatter.
   *
   * @param {number} row - The row index of the cell.
   * @param {C} column - The column definition containing formatting options.
   * @returns {Formatter} - The resolved formatter function for the specified cell.
   */
  protected getFormatter(row: number, column: C): Formatter {
    const rowMetadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);

    // look up by id, then index
    const columnOverrides = rowMetadata?.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]);

    return (columnOverrides?.formatter ||
      rowMetadata?.formatter ||
      column.formatter ||
      this._options.formatterFactory?.getFormatter(column) ||
      this._options.defaultFormatter) as Formatter;
  }

  /**
   * Retrieves the editor (or editor constructor) for the specified cell by first checking for an override
   * in row metadata and then falling back to the column’s editor or an editor from the editorFactory.
   *
   * @param {number} row - The row index of the cell.
   * @param {number} cell - The column index of the cell.
   * @returns {Editor | EditorConstructor | null | undefined} - The editor instance or constructor if available, otherwise `null` or `undefined`.
   */
  protected getEditor(row: number, cell: number): Editor | EditorConstructor | null | undefined {
    const column = this.columns[cell];
    const rowMetadata = this.getItemMetadaWhenExists(row);
    const columnMetadata = rowMetadata?.columns;

    if (columnMetadata?.[column.id]?.editor !== undefined) {
      return columnMetadata[column.id].editor;
    }
    if (columnMetadata?.[cell]?.editor !== undefined) {
      return columnMetadata[cell].editor;
    }
    if (column.editor !== undefined) {
      return column.editor;
    }
    return this._options?.editorFactory?.getEditor(column);
  }

  /**
   * Returns the value for the specified column from a given data item. If a dataItemColumnValueExtractor
   * is provided in options, it is used; otherwise, the property named by the column’s field is returned.
   *
   * @param {TData} item - The data item containing the requested value.
   * @param {C} columnDef - The column definition containing the field key.
   * @returns {*} - The extracted value from the data item based on the column definition.
   */
  protected getDataItemValueForColumn(item: TData, columnDef: C): TData | TData[keyof TData] {
    if (this._options.dataItemColumnValueExtractor) {
      return this._options.dataItemColumnValueExtractor(item, columnDef) as TData;
    }
    return item[columnDef.field as keyof TData];
  }

  // Cell switching

  /** Resets active cell by making cell normal and other internal reset. */
  resetActiveCell(): void {
    this.setActiveCellInternal(null, false);
  }

  /** Clear active cell by making cell normal & removing "active" CSS class. */
  unsetActiveCell(): void {
    if (Utils.isDefined(this.activeCellNode)) {
      const activeRow = this.activeRow;
      const activeCell = this.getCellFromNode(this.activeCellNode);
      this.makeActiveCellNormal();
      this.activeCellNode.classList.remove('active');
      if (isDefinedNumber(activeRow)) {
        this.toggleCellSpanFragmentsActive(activeRow, activeCell, false);
      }
      this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.remove('active'));
    }
  }

  /** @alias `setFocus` */
  focus(): void {
    this.setFocus();
  }

  /** Restores focus to the appropriate hidden grid focus sink. */
  protected setFocus(): void {
    if (this.tabbingDirection === -1) {
      this._focusSink.focus();
    } else {
      this._focusSink2.focus();
    }
  }

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
  protected setActiveCellInternal(
    newCell: HTMLDivElement | null,
    opt_editMode?: boolean | null,
    preClickModeOn?: boolean | null,
    suppressActiveCellChangedEvent?: boolean,
    e?: Event | SlickEvent_
  ): void {
    // make current active cell as normal cell & remove "active" CSS classes
    this.unsetActiveCell();

    // let activeCellChanged = (this.activeCellNode !== newCell);
    this.activeCellNode = newCell;

    if (Utils.isDefined(this.activeCellNode)) {
      const rowNode = this.activeCellNode.closest('.slick-row') as HTMLElement | null;
      const rowFromDockedNode = rowNode?.dataset.row !== undefined ? Number(rowNode.dataset.row) : NaN;
      const hasRenderedRowIndex = Number.isInteger(rowFromDockedNode);

      if (hasRenderedRowIndex) {
        // The row DOM is the source of truth after row docking shifts or
        // reparenting. Geometric conversion from a canvas position can map a
        // non-contiguous pinned row to the wrong logical index.
        this.activeRow = this.activePosY = rowFromDockedNode;
        this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode);
      } else {
        const activeCellOffset = Utils.offset(this.activeCellNode);
        const activeCanvas = Utils.parents(this.activeCellNode, '.grid-canvas')[0] as HTMLElement;
        const canvasOffset = Utils.offset(activeCanvas);
        const rowOffset = Math.floor(canvasOffset!.top);
        const cell = this.getCellFromPoint(activeCellOffset!.left - canvasOffset!.left, Math.ceil(activeCellOffset!.top) - rowOffset);
        this.activeRow = this.activePosY = cell.row;
        this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode);
      }

      if (!Utils.isDefined(opt_editMode) && this._options.autoEditNewRow) {
        opt_editMode = this.activeRow === this.getDataLength() || this._options.autoEdit;
      }

      if (this._options.showCellSelection) {
        // make sure to never activate more than 1 cell at a time
        // v8 ignore next
        document.querySelectorAll('.slick-cell.active').forEach((node) => node.classList.remove('active'));
        this.activeCellNode.classList.add('active');
        if (isDefinedNumber(this.activeRow) && isDefinedNumber(this.activeCell)) {
          this.toggleCellSpanFragmentsActive(this.activeRow, this.activeCell, true);
        }
        this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.add('active'));
      }

      if (opt_editMode && this.isCellEditable(this.activeRow, this.activeCell)) {
        if (this._options.asyncEditorLoading) {
          clearTimeout(this.h_editorLoader);
          this.h_editorLoader = setTimeout(() => {
            this.makeActiveCellEditable(undefined, preClickModeOn, e);
          }, this._options.asyncEditorLoadDelay);
        } else {
          this.makeActiveCellEditable(undefined, preClickModeOn, e);
        }
      }
    } else {
      this.activeRow = this.activeCell = null as any;
    }

    // this optimisation causes trouble - MLeibman #329
    // if (activeCellChanged) {
    if (!suppressActiveCellChangedEvent) {
      this.trigger<OnActiveCellChangedEventArgs | null>(
        this.onActiveCellChanged,
        this.getActiveCell() as OnActiveCellChangedEventArgs
      );
    }
    // }
  }

  /** Check if cell is editable and check if grid is also editable */
  protected isCellEditable(row: number, cell: number): boolean {
    return !!(this._options.editable && this.isCellPotentiallyEditable(row, cell));
  }

  /**
  * Checks whether data for the row is loaded, whether the cell is in an “Add New” row
  * (and the column disallows insert triggering), and whether an editor exists and the cell is not hidden.
  * Returns true if the cell is editable.
  *
  * @param {number} row - The row index of the cell.
  * @param {number} cell - The cell index (column index) within the row.
  * @returns {boolean} - Returns `true` if the cell is editable, otherwise `false`.
  */
  protected isCellPotentiallyEditable(row: number, cell: number): boolean {
    const dataLength = this.getDataLength();
    // is the data for this row actually loaded?
    if (row < dataLength && !this.getDataItem(row)) {
      return false;
    }

    // are we in the Add New row? Can we actually and allowed to create new one from this cell?
    if (this.columns[cell].cannotTriggerInsert && row >= dataLength) {
      return false;
    }

    // does this cell have an editor?
    if (!this.columns[cell] || this.columns[cell].hidden || !this.getEditor(row, cell)) {
      return false;
    }

    return true;
  }

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
  protected makeActiveCellNormal(refocusActiveCell = false): void {
    if (this.currentEditor) {
      this.trigger(this.onBeforeCellEditorDestroy, { editor: this.currentEditor });
      this.currentEditor.destroy();
      this.currentEditor = null;

      if (this.activeCellNode) {
        const d = this.getDataItem(this.activeRow);
        this.activeCellNode.classList.remove('editable', 'invalid');
        if (d) {
          const column = this.columns[this.activeCell];
          const formatter = this.getFormatter(this.activeRow, column);
          const formatterResult = formatter(
            this.activeRow,
            this.activeCell,
            this.getDataItemValueForColumn(d, column),
            column,
            d,
            this as unknown as SlickGrid
          );
          this.applyFormatResultToCellNode(formatterResult, this.activeCellNode);
          this.invalidatePostProcessingResults(this.activeRow);
        }
        if (refocusActiveCell) {
          this.setFocus();
        }
      }

      this.getEditorLock()?.deactivate(this.editController as EditController);
    }
  }

  /**
   * A public method that starts editing on the active cell by calling
   * makeActiveCellEditable with the provided editor, pre–click flag, and event.
   */
  editActiveCell(editor?: Editor | EditorConstructor, preClickModeOn?: boolean | null, e?: Event): void {
    this.makeActiveCellEditable(editor, preClickModeOn, e);
  }

  /**
   * Makes the currently active cell editable by initializing an editor instance.
   *
   * @param {EditorConstructor} [editor] - An optional custom editor constructor to use for editing.
   * @param {boolean | null} [preClickModeOn] - Indicates if pre-click mode is enabled.
   * @param {Event | SlickEvent_} [e] - The event that triggered editing.
   *
   * @throws {Error} If called when the grid is not editable.
   */
  protected makeActiveCellEditable(editor?: Editor | EditorConstructor, preClickModeOn?: boolean | null, e?: Event | SlickEvent_): void {
    if (!this.activeCellNode) {
      return;
    }
    if (!this._options.editable) {
      throw new Error('SlickGrid makeActiveCellEditable : should never get called when grid options.editable is false');
    }

    // cancel pending async call if there is one
    clearTimeout(this.h_editorLoader);

    if (!this.isCellPotentiallyEditable(this.activeRow, this.activeCell)) {
      return;
    }

    const columnDef = this.columns[this.activeCell];
    const item = this.getDataItem(this.activeRow);

    if (
      this.trigger(this.onBeforeEditCell, {
        row: this.activeRow,
        cell: this.activeCell,
        item,
        column: columnDef,
        target: 'grid',
      }).getReturnValue() === false
    ) {
      this.setFocus();
      return;
    }

    this.getEditorLock()?.activate(this.editController as EditController);
    this.activeCellNode.classList.add('editable');

    const useEditor = editor || this.getEditor(this.activeRow, this.activeCell);

    // editor was null and columnMetadata and editorFactory returned null or undefined
    // the editor must be constructable. Also makes sure that useEditor is of type EditorConstructor
    if (typeof useEditor === 'function') {
      // don't clear the cell if a custom editor is passed through
      if (!editor && !useEditor.suppressClearOnEdit) {
        Utils.emptyElement(this.activeCellNode);
      }

      let metadata = this.getItemMetadaWhenExists(this.activeRow);
      metadata = metadata?.columns as any;
      const columnMetaData = metadata && (metadata[columnDef.id as keyof ItemMetadata] || (metadata as any)[this.activeCell]);

      const editorArgs: EditorArguments = {
        grid: this as any,
        gridPosition: this.absBox(this._container),
        position: this.absBox(this.activeCellNode),
        container: this.activeCellNode,
        column: columnDef,
        columnMetaData,
        item: item || {},
        event: e as Event,
        commitChanges: this.commitEditAndSetFocus.bind(this),
        cancelChanges: this.cancelEditAndSetFocus.bind(this),
      };
      this.currentEditor = new useEditor(editorArgs);

      if (item && this.currentEditor) {
        this.currentEditor.loadValue(item);
        if (preClickModeOn && typeof this.currentEditor?.preClick === 'function') {
          this.currentEditor.preClick();
        }
      }

      this.serializedEditorValue = this.currentEditor?.serializeValue();

      if (this.currentEditor?.position) {
        this.handleActiveCellPositionChange();
      }
    }
  }

  /**
   * Commits the current edit and sets focus back to the grid.
   * If the commit fails due to validation, the focus remains in the editor.
   */
  protected commitEditAndSetFocus(navigateCellDown = true): void {
    // if the commit fails, it would do so due to a validation error
    // if so, do not steal the focus from the editor
    if (this.getEditorLock()?.commitCurrentEdit()) {
      this.setFocus();
      if (this._options.autoEdit && !this._options.autoCommitEdit && navigateCellDown) {
        this.navigateDown();
      }
    }
  }

  /**
   * Cancels the current edit and restores focus to the grid.
   */
  protected cancelEditAndSetFocus(): void {
    if (this.getEditorLock()?.cancelCurrentEdit()) {
      this.setFocus();
    }
  }

  // IEditor implementation for the editor lock

  /**
   * Commits the current edit, validating and applying changes if necessary.
   * If validation fails, an error is triggered and focus remains in the editor.
   *
   * @returns {boolean} Whether the edit was successfully committed.
   */
  protected commitCurrentEdit(): boolean {
    const self = this as SlickGrid<TData, C, O>;
    const item = self.getDataItem(self.activeRow);
    const column = self.columns[self.activeCell];

    if (self.currentEditor) {
      if (self.currentEditor.isValueChanged()) {
        const validationResults = self.currentEditor.validate(undefined, {
          rowIndex: self.activeRow,
          cellIndex: self.activeCell,
        });

        if (validationResults.valid) {
          const row = self.activeRow;
          const cell = self.activeCell;
          const editor = self.currentEditor;
          const serializedValue = self.currentEditor.serializeValue();
          const prevSerializedValue = self.serializedEditorValue;

          if (self.activeRow < self.getDataLength()) {
            // editing existing item found
            const editCommand = {
              row,
              cell,
              editor,
              serializedValue,
              prevSerializedValue,
              execute: () => {
                editor.applyValue(item, serializedValue);
                self.updateRow(row);
                self.trigger(self.onCellChange, { command: 'execute', row, cell, item, column });
              },
              undo: () => {
                editor.applyValue(item, prevSerializedValue);
                self.updateRow(row);
                self.trigger(self.onCellChange, { command: 'undo', row, cell, item, column });
              },
            };

            if (self._options.editCommandHandler) {
              self.makeActiveCellNormal(true);
              self._options.editCommandHandler(item, column, editCommand);
            } else {
              editCommand.execute();
              self.makeActiveCellNormal(true);
            }
          } else {
            // editing new item to add to dataset
            const newItem = {};
            self.currentEditor.applyValue(newItem, self.currentEditor.serializeValue());
            self.makeActiveCellNormal(true);
            self.trigger(self.onAddNewRow, { item: newItem, column });
          }

          // check whether the lock has been re-acquired by event handlers
          return !self.getEditorLock()?.isActive();
        } else {
          // invalid editing: Re-add the CSS class to trigger transitions, if any.
          if (self.activeCellNode) {
            self.activeCellNode.classList.remove('invalid');
            Utils.width(self.activeCellNode); // force layout
            self.activeCellNode.classList.add('invalid');
          }

          self.trigger(self.onValidationError, {
            editor: self.currentEditor,
            cellNode: self.activeCellNode,
            validationResults,
            row: self.activeRow,
            cell: self.activeCell,
            column,
          });

          self.currentEditor.focus();
          return false;
        }
      }

      self.makeActiveCellNormal(true);
    }
    return true;
  }

  /**
  * Cancels the current edit and restores the cell to normal mode.
  *
  * @returns {boolean} Always returns true.
  */
  protected cancelCurrentEdit(): boolean {
    this.makeActiveCellNormal();
    return true;
  }

  /** Returns an array of row indices corresponding to the currently selected rows. */
  getSelectedRows(): number[] {
    if (!this.selectionModel) {
      throw new Error('SlickGrid Selection model is not set');
    }
    return this.selectedRows.slice(0);
  }

  /**
   * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
   * @param {Array<number>} rowsArray - an array of row numbers.
   * @param {String} [caller] - an optional string to identify who called the method
   */
  setSelectedRows(rows: number[], caller?: string): void {
    if (!this.selectionModel) {
      throw new Error('SlickGrid Selection model is not set');
    }

    const elock = this.getEditorLock();
    if (typeof elock?.isActive === 'function' && !elock.isActive()) {
      this.selectionModel.setSelectedRanges(this.rowsToRanges(rows, caller === 'click.selectAll'), caller || 'SlickGrid.setSelectedRows');
    }
  }

  /**
   * Handles the mouseout event for a cell.
   * Triggers the `onMouseLeave` event.
   *
   * @param {MouseEvent & { target: HTMLElement }} e - The mouse event.
   */
  protected handleCellMouseOut(e: MouseEvent & { target: HTMLElement }): void {
    this.trigger(this.onMouseLeave, {}, e);
  }

  /**
   * Handles mouse hover over a header cell.
   * Adds CSS classes to indicate a hover state.
   *
   * @param {Event | SlickEventData_} e - The mouse event.
   */
  protected handleHeaderMouseHoverOn(e: Event | SlickEventData_): void {
    (e as any)?.target.classList.add('slick-state-hover');
  }

  /**
   * Handles mouse hover off a header cell.
   * Removes CSS classes indicating a hover state.
   *
   * @param {Event | SlickEventData_} e - The mouse event.
   */
  protected handleHeaderMouseHoverOff(e: Event | SlickEventData_): void {
    (e as any)?.target.classList.remove('slick-state-hover');
  }

  /** Returns whether the drag handle should be displayed for the supplied column. */
  protected getDragHandleVisibility(): boolean | 'hover' {
    return this.getSelectionModel()?.getOptions()?.showDragHandle ?? true;
  }

  /**
   * Called when the grid’s selection model reports a change. It builds a new selection
   * (and CSS hash for selected cells) from the provided ranges, applies the new cell CSS styles,
   * and if the selection has changed from the previous state, triggers the onSelectedRowsChanged
   * event with details about added and removed selections.
   *
  * @param {SlickEventData_} e - The Slick event data for selection changes.
  * @param {SlickRange_[]} ranges - The list of selected row and cell ranges.
   */
  protected handleSelectedRangesChanged(e: SlickEventData_, ranges: SlickRange_[]): void {
    const ne = e.getNativeEvent<CustomEvent>();
    const selectionMode = ne?.detail?.selectionMode ?? '';
    const caller = ne?.detail?.caller ?? 'click';
    const isBulkSelection = caller === 'click.selectAll' || caller === 'click.unselectAll';
    let addDragHandle = !!ne?.detail?.addDragHandle;
    const selectedCellCssClass = this._options.selectedCellCssClass || '';

    const selectionType = this.getSelectionModel()?.getOptions()?.selectionType;
    const showDragHandle = this.getDragHandleVisibility();
    addDragHandle = selectionType === 'cell' || selectionType === 'mixed';

    // drag and replace functionality
    const prevSelectedRanges = this.selectedRanges.slice(0);
    this.selectedRanges = ranges;

    if (selectionMode === CellSelectionMode.Replace && prevSelectedRanges.length === this.selectedRanges.length && prevSelectedRanges.length > 0) {
      let changedRangeIndex = -1;
      for (let i = 0; i < this.selectedRanges.length; i++) {
        const previousRange = prevSelectedRanges[i];
        const selectedRange = this.selectedRanges[i];
        if (
          previousRange.fromRow !== selectedRange.fromRow ||
          previousRange.fromCell !== selectedRange.fromCell ||
          previousRange.toRow !== selectedRange.toRow ||
          previousRange.toCell !== selectedRange.toCell
        ) {
          if (changedRangeIndex !== -1) {
            changedRangeIndex = -1;
            break;
          }
          changedRangeIndex = i;
        }
      }

      if (changedRangeIndex !== -1) {
        const prevSelectedRange = prevSelectedRanges[changedRangeIndex];
        const selectedRange = this.selectedRanges[changedRangeIndex];

        // check range has expanded
        if (SelectionUtils.copyRangeIsLarger(prevSelectedRange, selectedRange)) {
          this.trigger(this.onDragReplaceCells, { prevSelectedRange, selectedRange });
          this.invalidate();
        }
      }
    }

    const previousSelectedRows = this.selectedRows.slice(0); // shallow copy previously selected rows for later comparison
    this.selectionBottomRow = -1;
    this.selectionRightCell = -1;
    this.dragReplaceEl.removeEl();
    this.selectedRows = [];
    const hash: CssStyleHash = Object.create(null);
    const selectedRowsSet = ranges.length > 1 ? new Set<number>() : undefined;
    let rangesAreOrdered = true;
    for (let i = 0; i < ranges.length; i++) {
      if (i > 0 && ranges[i - 1].toRow >= ranges[i].fromRow) {
        rangesAreOrdered = false;
      }
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        if (!selectedRowsSet || !selectedRowsSet.has(j)) {
          selectedRowsSet?.add(j);
          this.selectedRows.push(j);
        }
        const rowHash = this.rowsCache[j] ? (hash[j] ??= Object.create(null)) : undefined;
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
          if (rowHash && this.canCellBeSelected(j, k)) {
            rowHash[this.columns[k].id] = selectedCellCssClass;
          }
        }
      }
    }

    if (!isBulkSelection || !rangesAreOrdered) {
      // Preserve the legacy default sort order (numeric values are compared as strings).
      this.selectedRows.sort();
    }

    const activeRange = ranges[ranges.length - 1];
    if (activeRange) {
      this.selectionBottomRow = activeRange.toRow;
      this.selectionRightCell = activeRange.toCell;
    }

    this.setCellCssStyles(selectedCellCssClass, hash);

    if (this.selectionBottomRow >= 0 && this.selectionRightCell >= 0 && addDragHandle && showDragHandle !== false) {
      const lowerRightCell = this.getCellNode(this.selectionBottomRow, this.selectionRightCell);
      this.dragReplaceEl.createEl(lowerRightCell, showDragHandle);
    }

    let selectedRowsChanged = previousSelectedRows.length !== this.selectedRows.length;
    if (!selectedRowsChanged) {
      const previousSelectedRowsSet = new Set(previousSelectedRows);
      selectedRowsChanged = this.selectedRows.some((row) => !previousSelectedRowsSet.has(row));
    }
    if (selectedRowsChanged) {
      const selectedRows = this.getSelectedRows();
      const selectedRowsSet = selectedRows.length ? new Set(selectedRows) : undefined;
      const previousSelectedRowsSet = previousSelectedRows.length ? new Set(previousSelectedRows) : undefined;
      const newSelectedAdditions = previousSelectedRowsSet ? selectedRows.filter((i) => !previousSelectedRowsSet.has(i)) : selectedRows;
      const newSelectedDeletions = selectedRowsSet ? previousSelectedRows.filter((i) => !selectedRowsSet.has(i)) : previousSelectedRows;

      this.trigger(
        this.onSelectedRowsChanged,
        {
          rows: selectedRows,
          previousSelectedRows,
          caller,
          changedSelectedRows: newSelectedAdditions,
          changedUnselectedRows: newSelectedDeletions,
        },
        e
      );
    }
  }

  /**
   * Processes a mouse wheel event by adjusting the vertical scroll (scrollTop) based on deltaY (scaled by rowHeight)
   * and horizontal scroll (scrollLeft) based on deltaX. It then calls the internal scroll handler with the “mousewheel”
   * type and, if any scrolling occurred, stops propagation. When a docking scroller is active it also prevents the
   * browser's default scrolling so the shared viewport and docked regions remain synchronized.
   *
   * @param {MouseEvent} e - The mouse event.
   * @param {number} _delta - Unused delta value.
   * @param {number} deltaX - The horizontal scroll delta.
   * @param {number} deltaY - The vertical scroll delta.
   */
  protected handleMouseWheel(e: MouseEvent, _delta: number, deltaX: number, deltaY: number): void {
    const hasDocking = this.usesDockingRowRegions();
    this.scrollHeight = this._viewportScrollContainerY.scrollHeight;
    const wheelEvent = e as WheelEvent;
    const lineSize = Math.max(40, this._options.rowHeight!);
    const nativeDelta = wheelEvent.deltaX || (e.shiftKey ? wheelEvent.deltaY : 0);
    const deltaModeFactor = wheelEvent.deltaMode === 1 ? lineSize : wheelEvent.deltaMode === 2 ? this.viewportW : 1;
    const horizontalDelta = nativeDelta ? nativeDelta * deltaModeFactor : (deltaX || (e.shiftKey ? -deltaY : 0)) * lineSize;
    if (!e.shiftKey) {
      this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - deltaY * this._options.rowHeight!);
    }
    const nextScrollLeft = this._viewportScrollContainerX.scrollLeft + horizontalDelta;
    // Chromium/WebKit expose RTL horizontal offsets as negative values. Keep
    // that native coordinate system intact; LTR still gets the normal lower
    // bound so wheel input cannot move the docking offsets below zero.
    this.scrollLeft = this._options.rtl ? nextScrollLeft : Math.max(0, nextScrollLeft);
    const handled = this._handleScroll('mousewheel');
    if (handled) {
      e.stopPropagation();
      // Ordinary grids retain the browser's native wheel delta behaviour. A
      // docking grid must prevent the native event from moving a second scroll
      // owner after this handler synchronizes its bands.
      if (hasDocking) {
        e.preventDefault();
      }
    }
  }

  /**
   * Called when a drag is initiated. It retrieves the cell from the event; if the cell does not exist or is not selectable,
   * it returns false. Otherwise, it triggers the onDragInit event and returns the event’s return value if
   * propagation is stopped, else returns false to cancel the drag.
   *
   * @param {DragEvent} e - The drag event.
   * @param {DragPosition} dd - The drag position data.
   * @returns {boolean} - Whether the drag is valid or should be cancelled.
   */
  protected handleDragInit(e: DragEvent, dd: DragPosition): boolean {
    const cell = this.getCellFromEvent(e);
    if (!cell || !this.cellExists(cell.row, cell.cell)) {
      return false;
    }

    const retval = this.trigger(this.onDragInit, dd, e);
    if (retval.isImmediatePropagationStopped()) {
      return retval.getReturnValue();
    }

    // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
    // cancel out of it
    return false;
  }

  /**
   * Similar to handleDragInit, this method retrieves the cell from the event
   * and triggers the `onDragStart` event. If the event propagation is stopped,
   * it returns the specified value; otherwise, it returns false.
   *
   * @param {DragEvent} e - The drag event that initiated the action.
   * @param {DragPosition} dd - The current drag position.
   * @returns {boolean} - The result of the event trigger or false if propagation was not stopped.
   */
  protected handleDragStart(e: DragEvent, dd: DragPosition): boolean {
    const cell = this.getCellFromEvent(e);
    if (!cell || !this.cellExists(cell.row, cell.cell)) {
      return false;
    }

    if (this.currentEditor && !this.getEditorLock().commitCurrentEdit()) {
      return false;
    }

    const retval = this.trigger(this.onDragStart, dd, e);
    if (retval.isImmediatePropagationStopped()) {
      return retval.getReturnValue();
    }

    return false;
  }

  /** Publishes the grid drag event for an in-progress drag operation. */
  protected handleDrag(e: DragEvent, dd: DragPosition): void {
    return this.trigger(this.onDrag, dd, e).getReturnValue();
  }

  /** Publishes the grid drag-end event after a drag operation completes. */
  protected handleDragEnd(e: DragEvent, dd: DragPosition): void {
    this.trigger(this.onDragEnd, dd, e);
  }

  /**
   * Handles a click event on the grid. It logs the event (for debugging), ensures focus is restored if necessary,
   * triggers the onClick event, and if the clicked cell is selectable and not already active, scrolls it into view
   * and activates it.
   *
   * @param {DOMEvent<HTMLDivElement> | SlickEventData_} evt - The click event, either a native DOM event or a Slick event.
   */
  protected handleClick(evt: DOMEvent<HTMLDivElement> | SlickEventData_): void {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;

    if (!this.currentEditor) {
      // if this click resulted in some cell child node getting focus,
      // don't steal it back - keyboard events will still bubble up
      // IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
      // prettier-ignore
      if ((e as DOMEvent<HTMLDivElement>).target !== document.activeElement || (e as DOMEvent<HTMLDivElement>).target.classList.contains('slick-cell')) {
        const selection = this.getTextSelection(); // store text-selection and restore it after
        this.setFocus();
        this.setTextSelection(selection as Range);
      }
    }

    const cell = this.getCellFromEvent(e);
    if (!cell || (this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell)) {
      return;
    }

    evt = this.trigger(this.onClick, { row: cell.row, cell: cell.cell }, evt || e);
    if ((evt as SlickEventData_).isImmediatePropagationStopped()) {
      return;
    }

    // this optimisation causes trouble - MLeibman #329
    // if ((activeCell !== cell.cell || activeRow !== cell.row) && canCellBeActive(cell.row, cell.cell)) {
    if (this.canCellBeActive(cell.row, cell.cell)) {
      if (!this.getEditorLock()?.isActive() || this.getEditorLock()?.commitCurrentEdit()) {
        this.scrollRowIntoView(cell.row, false);

        const preClickModeOn = !!(e as DOMEvent<HTMLDivElement>).target?.classList?.contains(preClickClassName);
        const column = this.columns[cell.cell];
        const suppressActiveCellChangedEvent = !!(
          this._options.editable &&
          column?.editor &&
          this._options.suppressActiveCellChangeOnEdit
        );
        this.setActiveCellInternal(
          this.getCellNode(cell.row, cell.cell),
          null,
          preClickModeOn,
          suppressActiveCellChangedEvent,
          e as DOMEvent<HTMLDivElement>
        );
      }
    }
  }

  /**
   * Retrieves the cell DOM element from the event target.
   * If the cell exists and is not currently being edited, triggers the onContextMenu event.
   */
  protected handleContextMenu(e: Event & { target: HTMLElement }): void {
    // cancel context menu if we have an inline editor opened
    const cellElm = e.target.closest('.slick-cell');
    if (this.activeCellNode === cellElm && this.currentEditor !== null) {
      return;
    }

    // get the cell position or return {-1,-1} when opening from the grid but but not over a grid cell (e.g. empty dataset)
    const cell = this.getCellFromEvent(e) ?? { cell: -1, row: -1 };
    this.trigger(this.onContextMenu, { row: cell.row, cell: cell.cell }, e);
  }

  /**
   * Retrieves the cell from the event and triggers the onDblClick event.
   * If the event is not prevented and the grid is editable,
   * it initiates cell editing by calling gotoCell with edit mode enabled.
   */
  protected handleDblClick(e: MouseEvent): void {
    const cell = this.getCellFromEvent(e);
    if (!cell || (this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell)) {
      return;
    }

    this.trigger(this.onDblClick, { row: cell.row, cell: cell.cell }, e);
    if (e.defaultPrevented) {
      return;
    }

    if (this._options.editable) {
      this.gotoCell(cell.row, cell.cell, true, e);
    }
  }

  /**
   * When the mouse enters a header column element, retrieves the column definition from the element’s
   * stored data and triggers the onHeaderMouseEnter event with the column and grid reference.
   */
  protected handleHeaderMouseEnter(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderMouseEnter, { column, grid: this }, e);
    }
  }

  /**
   * Similar to handleHeaderMouseEnter, but triggers the onHeaderMouseLeave event
   * when the mouse leaves a header column element.
   */
  protected handleHeaderMouseLeave(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderMouseLeave, { column, grid: this }, e);
    }
  }

  /**
   * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseEnter event.
   */
  protected handleHeaderRowMouseEnter(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderRowMouseEnter, { column, grid: this }, e);
    }
  }

  /**
   * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseLeave event.
   */
  protected handleHeaderRowMouseLeave(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderRowMouseLeave, { column, grid: this }, e);
    }
  }

  /**
   * Retrieves the header column element and its associated column definition,
   * then triggers the onHeaderContextMenu event with the column data.
   */
  protected handleHeaderContextMenu(e: MouseEvent & { target: HTMLElement }): void {
    const header = e.target.closest('.slick-header-column');
    const column = header && Utils.storage.get(header, 'column');
    this.trigger(this.onHeaderContextMenu, { column }, e);
  }

  /**
   * If not in the middle of a column resize, retrieves the header column element and its column definition, then triggers the onHeaderClick event.
   */
  protected handleHeaderClick(e: MouseEvent & { target: HTMLElement }): void {
    if (!this.columnResizeDragging) {
      const header = e.target.closest('.slick-header-column');
      const column = header && Utils.storage.get(header, 'column');
      if (column) {
        this.trigger(this.onHeaderClick, { column }, e);
      }
    }
  }

  /**
   * Triggers the onPreHeaderContextMenu event with the event target (typically the pre–header panel).
   */
  protected handlePreHeaderContextMenu(e: MouseEvent & { target: HTMLElement }): void {
    this.trigger(this.onPreHeaderContextMenu, { node: e.target }, e);
  }

  /**
   * If not resizing columns, triggers the onPreHeaderClick event with the event target.
   */
  protected handlePreHeaderClick(e: MouseEvent & { target: HTMLElement }): void {
    if (!this.columnResizeDragging) {
      this.trigger(this.onPreHeaderClick, { node: e.target }, e);
    }
  }

  /**
   * Retrieves the footer cell element and its column definition, then triggers the onFooterContextMenu event.
   */
  protected handleFooterContextMenu(e: MouseEvent & { target: HTMLElement }): void {
    const footer = e.target.closest('.slick-footerrow-column');
    const column = footer && Utils.storage.get(footer, 'column');
    this.trigger(this.onFooterContextMenu, { column }, e);
  }

  /**
   * Retrieves the footer cell element and its column definition, then triggers the onFooterClick event.
   */
  protected handleFooterClick(e: MouseEvent & { target: HTMLElement }): void {
    const footer = e.target.closest('.slick-footerrow-column');
    const column = footer && Utils.storage.get(footer, 'column');
    this.trigger(this.onFooterClick, { column }, e);
  }

  /**
   * Triggers the onMouseEnter event when the mouse pointer enters a cell element.
   */
  protected handleCellMouseOver(e: MouseEvent & { target: HTMLElement }): void {
    if (!e.target?.closest('.slick-cell')) {
      return;
    }
    this.trigger(this.onMouseEnter, {}, e);
  }

  /**
   * Handles the change in the position of the active cell.
   * Triggers the `onActiveCellPositionChanged` event and adjusts the editor visibility and positioning.
   */
  protected handleActiveCellPositionChange(): void {
    if (this.activeCellNode) {
      this.trigger(this.onActiveCellPositionChanged, {});

      if (this.currentEditor) {
        const cellBox = this.getActiveCellPosition();
        if (this.currentEditor.show && this.currentEditor.hide) {
          if (!cellBox.visible) {
            this.currentEditor.hide();
          } else {
            this.currentEditor.show();
          }
        }

        if (this.currentEditor.position) {
          this.currentEditor.position(cellBox);
        }
      }
    }
  }

  /**
   * limits the frequency at which the provided action is executed.
   * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
   * call dequeue to cancel any pending action.
   */
  protected actionThrottle(action: () => void, minPeriod_ms: number): { enqueue: () => void; dequeue: () => void } {
    let blocked = false;
    let queued = false;

    const enqueue = () => {
      if (!blocked) {
        blockAndExecute();
      } else {
        queued = true;
      }
    };

    const dequeue = () => (queued = false);

    const blockAndExecute = () => {
      blocked = true;
      clearTimeout(this._executionBlockTimer);
      this._executionBlockTimer = setTimeout(unblock, minPeriod_ms);
      action.call(this);
    };

    const unblock = () => {
      /* v8 ignore if */
      if (queued) {
        dequeue();
        blockAndExecute();
      } else {
        blocked = false;
      }
    };

    return {
      enqueue: enqueue.bind(this),
      dequeue: dequeue.bind(this),
    };
  }

  /**
  * Returns a hash containing row and cell indexes from a standard W3C event.
  * @param {*} event A standard W3C event.
  */
  getCellFromEvent(evt: Event | SlickEventData_): { row: number; cell: number } | null {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
    if (!e) {
      return null;
    }

    const cellNode = (e as Event & { target?: HTMLElement }).target?.closest('.slick-cell');

    if (!cellNode) {
      return null;
    }

    let row = this.getRowFromNode(cellNode.closest('.slick-row') as HTMLElement);

    const cell = this.getCellFromNode(cellNode as HTMLElement);

    if (!isDefinedNumber(row) || !isDefinedNumber(cell)) {
      return null;
    }
    return { row, cell };
  }

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
  applyHtmlCode(
    target: HTMLElement,
    val: boolean | string | HTMLElement | DocumentFragment | null | undefined = '',
    options?: { emptyTarget?: boolean; skipEmptyReassignment?: boolean }
  ): void {
    if (target) {
      if (val instanceof HTMLElement || val instanceof DocumentFragment) {
        // first empty target and then append new HTML element
        if (options?.emptyTarget !== false) {
          Utils.emptyElement(target);
        }
        target.appendChild(val);
      } else {
        // when it's already empty and we try to reassign empty, it's probably ok to skip the assignment
        if (options?.skipEmptyReassignment !== false && !Utils.isDefined(val) && !target.innerHTML) {
          return;
        }
        if (typeof val === 'number' || typeof val === 'boolean') {
          target.textContent = String(val);
        } else {
          const sanitizedText = this.sanitizeHtmlString(val as string);
          // apply HTML when enableHtmlRendering is enabled but make sure we do have a value (without a value, it will simply use `textContent` to clear text content)
          if (this._options.enableHtmlRendering && sanitizedText) {
            target.innerHTML = sanitizedText;
          } else {
            target.textContent = sanitizedText;
          }
        }
      }
    }
  }

  /** Get Grid Canvas Node DOM Element */
  getCanvasNode(_columnIdOrIdx?: number | string, _rowIndex?: number): HTMLDivElement {
    return this._canvasNode;
  }

  /** Get the canvas DOM element */
  getActiveCanvasNode(e?: Event | SlickEventData_): HTMLDivElement {
    if (e === undefined) {
      return this._activeCanvasNode;
    }

    if (e instanceof SlickEventData) {
      e = e.getNativeEvent<Event>();
    }

    this._activeCanvasNode =
      ((e as Event & { target: HTMLElement })?.target?.closest('.grid-canvas') as HTMLDivElement | null) ||
      this._activeCanvasNode ||
      this._canvasNode;
    return this._activeCanvasNode;
  }

  /** Get the canvas DOM element */
  getCanvases(): HTMLDivElement[] {
    return this._canvas;
  }

  /** Get the Viewport DOM node element */
  getViewportNode(_columnIdOrIdx?: number | string, _rowIndex?: number): HTMLElement | undefined {
    return this._viewportNode;
  }

  /** Get all the Viewport node elements */
  getViewports(): HTMLDivElement[] {
    return this._viewport;
  }

  /**
   * Calls setActiveViewportNode (using the provided event) to set the active viewport,
   * then returns the active viewport DOM element.
   *
   * @param e
   * @returns
   */
  getActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement {
    this.setActiveViewportNode(e);

    return this._activeViewportNode;
  }

  /**
  * Sets an active viewport node
  *
  * @param {number | string} [columnIdOrIdx] - The column identifier or index.
  * @param {number} [rowIndex] - The row index.
  * @returns {HTMLElement} The corresponding viewport element.
  */
  setActiveViewportNode(e: Event | SlickEventData_): HTMLDivElement {
    if (e instanceof SlickEventData) {
      e = e.getNativeEvent<Event>();
    }
    this._activeViewportNode =
      ((e as Event & { target: HTMLDivElement })?.target?.closest('.slick-viewport') as HTMLDivElement | null) ||
      this._activeViewportNode ||
      this._viewportNode;
    return this._activeViewportNode;
  }

  /** Get the headers width in pixel
  *
  * Iterates over all columns to accumulate the widths for the left and right docking sections,
  * adds scrollbar width if needed, and adjusts for docked columns.
  * Returns the computed overall header width in pixels.
  */
  getHeadersWidth(): number {
    this.headersWidth = this.headersWidthL = this.headersWidthR = 0;
    const includeScrollbar = !this._options.autoHeight;

    for (let i = 0, ii = this.columns.length; i < ii; i++) {
      if (!this.columns[i] || this.columns[i].hidden) {
        continue;
      }
      const width = this.columns[i].width;
      if (this.getColumnDockingBand(i) === 'right') {
        this.headersWidthR += width || 0;
      } else {
        this.headersWidthL += width || 0;
      }
    }

    if (includeScrollbar) {
      // Attribute the scrollbar width to the active scrollable band: the right band
      // when columns are pinned, otherwise the left band.
      if (this.hasDockedColumns()) {
        this.headersWidthR += this.scrollbarDimensions?.width || 0;
      } else {
        this.headersWidthL += this.scrollbarDimensions?.width || 0;
      }
    }

    if (this.hasDockedColumns()) {
      this.headersWidthR = Math.max(this.headersWidthR, this.viewportW);
    } else {
      this.headersWidthL = Math.max(this.headersWidthL, this.viewportW);
    }

    this.headersWidth = this.headersWidthL + this.headersWidthR;
    return Math.max(this.headersWidth, this.viewportW);
  }

  /** Get the grid canvas width
  *
  * Computes the available width (considering vertical scrollbar if present),
  * then iterates over the columns (left, center, and right docking bands) to sum their widths.
  * If full–width rows are enabled, extra width is added. Returns the total calculated width.
  */
  getCanvasWidth(): number {
    const availableWidth = this.getViewportInnerWidth();
    let i = this.columns.length;

    this.canvasWidthL = this.canvasWidthR = 0;

    while (i--) {
      if (!this.columns[i] || this.columns[i].hidden) {
        continue;
      }

      if (this.getColumnDockingBand(i) === 'right') {
        this.canvasWidthR += this.columns[i].width || 0;
      } else {
        this.canvasWidthL += this.columns[i].width || 0;
      }
    }
    let totalRowWidth = this.canvasWidthL + this.canvasWidthR;
    if (this._options.fullWidthRows) {
      const extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
      if (extraWidth > 0) {
        totalRowWidth += extraWidth;
        if (this.hasDockedColumns()) {
          this.canvasWidthR += extraWidth;
        } else {
          this.canvasWidthL += extraWidth;
        }
      }
    }
    return totalRowWidth;
  }

  /**
   * Recalculates the canvas width by calling getCanvasWidth and then adjusts widths of header containers,
   * canvases, panels, and viewports. If widths have changed (or forced), it applies the new column widths
   * by calling applyColumnWidths.
   *
   * @param {boolean} [forceColumnWidthsUpdate] - Whether to force an update of column widths.
   */
  protected updateCanvasWidth(forceColumnWidthsUpdate?: boolean): void {
    const oldCanvasWidth = this.canvasWidth;
    const oldCanvasWidthL = this.canvasWidthL;
    const oldCanvasWidthR = this.canvasWidthR;
    this.canvasWidth = this.getCanvasWidth();
    // Keep the canvas at least viewport-wide so a right band at the visible edge leaves no
    // gap after the last centre column; dockingLayout keeps the natural width.
    if (this.hasDockedColumns()) {
      this.canvasWidth = Math.max(this.canvasWidth, this.getDockingRenderedWidth());
      this.canvasWidthL = this.canvasWidth;
    }

    if (this._options.createTopHeaderPanel && !this._isResizingColumn) {
      const panelWidth = this._options.topHeaderPanelWidth ?? this.canvasWidth;
      this._topHeaderPanel.style.width = typeof panelWidth === 'string' ? panelWidth : `${panelWidth}px`;
    }
    const widthChanged =
      this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;

    if (widthChanged) {
      Utils.width(this._canvasNode, this.canvasWidthL);

      this.getHeadersWidth();

      Utils.width(this._headerL, this.getDockingChromeRootWidth());
      // v11 uses one live content root for both pinned and center columns.
      this._headerRoot.style.left = '';
      this._contentRoot.style.left = '';
      Utils.width(this._headerRoot, '100%');
      Utils.width(this._contentRoot, '100%');
      Utils.width(this._headerRowScrollerL, '100%');
      Utils.width(this._headerRowL, this.canvasWidth);

      if (this._options.createFooterRow) {
        Utils.width(this._footerRowScrollerL, '100%');
        Utils.width(this._footerRowL, this.canvasWidth);
      }

      if (this._options.createPreHeaderPanel && !this._isResizingColumn) {
        const panelWidth = this._options.preHeaderPanelWidth ?? this.canvasWidth;
        this._preHeaderPanel.style.width = typeof panelWidth === 'string' ? panelWidth : `${panelWidth}px`;
      }
      Utils.width(this._viewportNode, '100%');

      if (this.rowDockingLayout.bottom.length > 0) {
        this._contentRoot.style.left = '';
      }
    }

    // Use the same test the docking scrollbar makes for itself, so the grid cannot reserve
    // room for a horizontal scrollbar that the proxy has decided not to show. Content that
    // exactly fills the viewport does not overflow it.
    this.viewportHasHScroll = this.hasDockingHorizontalScroller()
      ? (this.dockingLayout.contentWidth || this.canvasWidth) > this._viewportNode.clientWidth
      : this.canvasWidth > this.getViewportInnerWidth();

    Utils.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width || 0 : 0));

    if (this._options.createFooterRow) {
      Utils.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width || 0 : 0));
    }

    this.updateDockingHorizontalScrollerDimensions();
    this.updateDockingOverlayDimensions();

    if (widthChanged || forceColumnWidthsUpdate) {
      this.applyColumnWidths();
      this.applyDockingToColumnChrome();
      this.applyDockingDimensionsToRows();
    }
  }

  /** @alias `getPreHeaderPanelLeft` */
  getPreHeaderPanel(): HTMLDivElement {
    return this._preHeaderPanel;
  }

  /** Get the Pre-Header Panel Left DOM node element */
  getPreHeaderPanelLeft(): HTMLDivElement {
    return this._preHeaderPanel;
  }

  /** Get the Pre-Header Panel Right DOM node element */
  getPreHeaderPanelRight(): HTMLDivElement {
    return this._preHeaderPanelR;
  }

  /** Get the Top-Header Panel DOM node element */
  getTopHeaderPanel(): HTMLDivElement {
    return this._topHeaderPanel;
  }

  /**
   * Sets the CSS overflowX and overflowY styles for the shared viewport and, when needed,
   * the docking horizontal scroller based on the grid’s docking configuration and options such
   * as alwaysAllowHorizontalScroll and alwaysShowVerticalScroll.
   * If a viewportClass is specified in options, the class is added to the viewport.
   */
  protected setOverflow(): void {
    this._viewportNode.style.overflowX = this.hasDockingHorizontalScroller() ? 'hidden' : 'auto';
    this._viewportNode.style.overflowY = this._options.autoHeight ? 'hidden' : this._options.alwaysShowVerticalScroll ? 'scroll' : 'auto';
    if (this._dockingHorizontalScroller) {
      this._dockingHorizontalScroller.style.overflowX = 'auto';
      this._dockingHorizontalScroller.style.overflowY = 'hidden';
    }

    if (this._options.viewportClass) {
      const viewportClasses = Utils.classNameToList(this._options.viewportClass);
      this._viewportNode.classList.add(...viewportClasses);
    }
  }

  /**
   * Creates a <style> element (using a provided nonce if available) and appends it to the shadowRoot (or document head).
   * Inserts rules that set heights for panels, header rows, footer rows, and cells based on grid options.
   * It also loops through each column (if not hidden) to add empty rules for left and right column classes.
   * If the stylesheet cannot be accessed via the modern API, it falls back to createCssRulesAlternative.
   */
  protected createCssRules(): void {
    this._style = document.createElement('style');
    if (this._options.nonce) {
      this._style.nonce = this._options.nonce;
    }
    (this._options.shadowRoot || document.head).appendChild(this._style);

    const rules = [
      `.${this.uid} .slick-top-panel { height: ${this._options.topPanelHeight}px; }`,
      `.${this.uid} .slick-preheader-panel { height: ${this._options.preHeaderPanelHeight}px; }`,
      `.${this.uid} .slick-topheader-panel { height: ${this._options.topHeaderPanelHeight}px; }`,
      // Docking chrome bands use `display: contents`, so their persistent root
      // must carry the row height; otherwise the header-row/footer collapses to
      // the 1px spacer height even though each band has the configured height.
      `.${this.uid} .slick-headerrow-columns, .${this.uid} .slick-headerrow-columns-root { height: ${this._options.headerRowHeight}px; }`,
      `.${this.uid} .slick-footerrow-columns, .${this.uid} .slick-footerrow-columns-root { height: ${this._options.footerRowHeight}px; }`,
    ];

    // Rows get a default height from CSS; in variable-height mode, individual rows override
    // this via inline `style="height: Xpx"`. The cell height is reduced by the measured
    // vertical padding/border difference so its content-box plus those edges matches the row.
    if (this._options.enableVariableRowHeight) {
      rules.push(`.${this.uid} .slick-cell { height: calc(100% - ${this.cellHeightDiff}px); }`);
    } else {
      rules.push(`.${this.uid} .slick-cell { height: ${this._options.rowHeight! - this.cellHeightDiff}px; }`);
    }
    rules.push(`.${this.uid} .slick-row { height: ${this._options.rowHeight}px; }`);

    const sheet = this._style.sheet;

    /* v8 ignore else */
    if (sheet) {
      rules.forEach((rule) => sheet.insertRule(rule));

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]) {
          sheet.insertRule(`.${this.uid} .l${i} { }`);
          sheet.insertRule(`.${this.uid} .r${i} { }`);
        }
      }
    } else {
      // fallback in case the 1st approach doesn't work, let's use our previous way of creating the css rules which is what works in Salesforce :(
      this.createCssRulesAlternative(rules);
    }
  }

  /** Create CSS rules via template in case the first approach with createElement('style') doesn't work.
  *
  * In cases where the standard method of inserting CSS rules fails (as may occur in some environments),
  * this function creates a <style> element using a template, appends it to the document, and then adds
  * the provided CSS rules as a concatenated text node.
  * Also appends rules for each visible column for left and right classes.
  */
  protected createCssRulesAlternative(rules: string[]): void {
    const template = document.createElement('template');
    template.innerHTML = '<style type="text/css" rel="stylesheet" />';
    this._style = template.content.firstChild as HTMLStyleElement;
    (this._options.shadowRoot || document.head).appendChild(this._style);

    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i] && !this.columns[i].hidden) {
        rules.push(`.${this.uid} .l${i} { }`);
        rules.push(`.${this.uid} .r${i} { }`);
      }
    }

    if ((this._style as any).styleSheet) {
      (this._style as any).styleSheet.cssText = rules.join(' '); // IE
    } else {
      this._style.appendChild(document.createTextNode(rules.join(' ')));
    }
  }

  /**
   * Finds and caches the CSS rules from the grid’s dynamically created stylesheet
   * that correspond to a column’s left (".lX") and right (".rX") classes.
   * Returns an object containing the left and right rule objects for the specified column index.
   * If the stylesheet has not been located yet, it iterates through available styleSheets to find it.
   *
   * @param idx
   * @returns
   */
  protected getColumnCssRules(idx: number): { left: { selectorText: string }; right: { selectorText: string } } {
    let i: number;
    if (!this.stylesheet) {
      const sheets: any = (this._options.shadowRoot || document).styleSheets;

      if (this._options.devMode && typeof this._options.devMode.ownerNodeIndex === 'number' && this._options.devMode.ownerNodeIndex >= 0) {
        sheets[this._options.devMode.ownerNodeIndex].ownerNode = this._style;
      }

      for (i = 0; i < sheets.length; i++) {
        const sheet = sheets[i];
        if ((sheet.ownerNode || sheet.owningElement) === this._style) {
          this.stylesheet = sheet;
          break;
        }
      }

      /* v8 ignore if */
      if (!this.stylesheet) {
        throw new Error('SlickGrid Cannot find stylesheet.');
      }

      // find and cache column CSS rules
      this.columnCssRulesL = [];
      this.columnCssRulesR = [];
      const cssRules = this.stylesheet.cssRules || this.stylesheet.rules;
      let matches;
      let columnIdx;
      for (i = 0; i < cssRules.length; i++) {
        const selector = cssRules[i].selectorText;
        if ((matches = /\.l\d+/.exec(selector))) {
          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
          this.columnCssRulesL[columnIdx] = cssRules[i];
        } else if ((matches = /\.r\d+/.exec(selector))) {
          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
          this.columnCssRulesR[columnIdx] = cssRules[i];
        }
      }
    }

    return {
      left: this.columnCssRulesL![idx],
      right: this.columnCssRulesR![idx],
    };
  }

  /**
   * Removes the dynamically created <style> element (if it exists) from the DOM and
   * clears the cached stylesheet reference.
   */
  protected removeCssRules(): void {
    this._style?.remove();
    this.stylesheet = null;
  }

  /** Get Top Panel DOM element */
  getTopPanel(): HTMLDivElement {
    return this._topPanels[0];
  }

  /** Get the top panels used by the grid (the single-viewport renderer has one). */
  getTopPanels(): HTMLDivElement[] {
    return this._topPanels;
  }

  /**
   * Based on the provided option (e.g. showTopPanel, showHeaderRow, etc.) and the target container(s),
   * sets the grid option to the desired visibility. It then either slides down/up the container
   * (if animation is enabled) or shows/hides it immediately, followed by a canvas resize.
   * @param {'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel' | 'showTopHeaderPanel'} option - The grid option to modify.
   * @param {HTMLElement | HTMLElement[]} container - The panel element(s) to show or hide.
   * @param {boolean} [visible] - Whether the panel should be visible.
   * @param {boolean} [animate] - Whether to animate the visibility change.
   */
  protected togglePanelVisibility(
    option: 'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel' | 'showTopHeaderPanel',
    container: HTMLElement | HTMLElement[],
    visible?: boolean,
    animate?: boolean
  ): void {
    const animated = animate !== false;

    if (this._options[option] !== visible) {
      this._options[option] = visible as boolean;
      if (visible) {
        if (animated) {
          Utils.slideDown(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils.show(container);
      } else {
        if (animated) {
          Utils.slideUp(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils.hide(container);
      }
      this.resizeCanvas();
    }
  }

  /**
   * Set the Top Panel Visibility
   * @param {Boolean} [visible] - optionally set if top panel is visible or not
   */
  setTopPanelVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showTopPanel', this._topPanelScrollers, visible, animate);
  }

  /**
   * Set the Header Row Visibility
   * @param {Boolean} [visible] - optionally set if header row panel is visible or not
   */
  setHeaderRowVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showHeaderRow', this._headerRowScroller, visible, animate);
  }

  /**
   * Set the Column Header Visibility
   * @param {Boolean} [visible] - optionally set if column header is visible or not
   */
  setColumnHeaderVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showColumnHeader', this._headerScroller, visible, animate);
  }

  /**
   * Set the Footer Visibility
   * @param {Boolean} [visible] - optionally set if footer row panel is visible or not
   */
  setFooterRowVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showFooterRow', this._footerRowScroller, visible, animate);
  }

  /**
   * Set the Pre-Header Visibility
   * @param {Boolean} [visible] - optionally set if pre-header panel is visible or not
   */
  setPreHeaderPanelVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showPreHeaderPanel', this._preHeaderPanelScroller, visible, animate);
  }

  /**
   * Set the Top-Header Visibility
   * @param {Boolean} [visible] - optionally set if top-header panel is visible or not
   */
  setTopHeaderPanelVisibility(visible?: boolean, animate?: boolean): void {
    this.togglePanelVisibility('showTopHeaderPanel', this._topHeaderPanelScroller, visible, animate);
  }

  // Rendering / Scrolling

  /**
   * Retrieves the height of a row.
   * In variable row height mode (i.e. when `enableVariableRowHeight` is true) and with a row
   * index provided, returns that row's individual height; otherwise returns the default row
   * height defined in the grid options.
   *
   * @param {number} [row] - The row index. When omitted the default row height is returned.
   * @returns {number} The row height in pixels.
   */
  getRowHeight(row?: number): number {
    if (row !== undefined && this._options.enableVariableRowHeight && this.rowPositionIndexer) {
      return this.rowPositionIndexer.height(row);
    }
    return this._options.rowHeight!;
  }

  /**
   * Returns the virtual top pixel position of a row within the full grid content,
   * i.e. without the virtual-scrolling page offset applied. Since a row's top position equals
   * the combined height of all rows before it, this also serves as "the combined pixel height
   * of the first N rows" when called with a row count.
   *
   * @param {number} row - The row index (or a row count when summing row heights).
   * @returns {number} The virtual pixel position of the top of the row.
   */
  protected getRowPosition(row: number): number {
    if (this._options.enableVariableRowHeight && this.rowPositionIndexer) {
      return this.rowPositionIndexer.top(row);
    }
    return this._options.rowHeight! * row;
  }

  /**
   * Computes the row index at a virtual vertical pixel position within the full grid content,
   * i.e. without the virtual-scrolling page offset applied.
   *
   * @param {number} y - The virtual vertical position in pixels.
   * @returns {number} The calculated row index.
   */
  protected getRowIndexFromPosition(y: number): number {
    if (this._options.enableVariableRowHeight && this.rowPositionIndexer) {
      return this.rowPositionIndexer.rowAt(y);
    }
    return Math.floor(y / this._options.rowHeight!);
  }

  /** Get the rendered top offset of a row, including virtual-scroll page positioning. */
  getRowTop(row: number): number {
    return Math.round(this.getRowPosition(row) - this.offset);
  }

  /**
   * Returns the bottom pixel position for a given row, based on the row height and current vertical offset.
   *
   * @param {number} row - The row index.
   * @returns {number} The pixel position of the bottom of the row.
   */
  protected getRowBottom(row: number): number {
    return this.getRowTop(row) + this.getRowHeight(row);
  }

  /**
   * Computes the row index corresponding to a given vertical pixel position (taking the current offset into account).
   *
   * @param {number} y - The vertical position in pixels.
   * @returns {number} The calculated row index.
   */
  protected getRowFromPosition(y: number): number {
    return this.getRowIndexFromPosition(y + this.offset);
  }

  /**
   * Creates a row container element with CSS classes (e.g. active, odd/even, docked, loading) based on the row’s state
  * and metadata. It positions the row using getRowTop (adjusting for pinned rows), creates docking regions when needed,
  * and iterates over each column to call appendCellHtml
   * for each cell that is within the visible viewport range.
   *
   * @param {HTMLElement[]} divArray - The array to store the rendered row element.
   * @param {number} row - The row index to be rendered.
   * @param {CellViewportRange} range - The visible viewport range for rendering cells.
   * @param {number} dataLength - The total data length to determine if the row is loading.
   */
  protected appendRowHtml(divArray: HTMLElement[], row: number, range: CellViewportRange, dataLength: number): void {
    const d = this.getDataItem(row);
    const dataLoading = row < dataLength && !d;

    let rowCss =
      'slick-row' +
      (this.isPinnedRowIdx(row) ? ' pinned' : '') +
      (dataLoading ? ' loading' : '') +
      (row === this.activeRow && this._options.showCellSelection ? ' active' : '') +
      (row % 2 === 1 ? ' odd' : ' even');

    if (!d) {
      rowCss += ` ${this._options.addNewRowCssClass}`;
    }

    const metadata = this.getItemMetadaWhenExists(row);

    if (metadata?.cssClasses) {
      rowCss += ` ${metadata.cssClasses}`;
    }

    const rowDiv = Utils.createDomElement('div', {
      className: `ui-widget-content ${rowCss}`,
      role: 'row',
      ariaRowIndex: `${row + 1}`,
      dataset: { row: `${row}` },
    });
    const rowDocking = this.dockingByRow.get(row);
    if (rowDocking && rowDocking.band !== 'center') {
      rowDiv.classList.add(`slick-row-pinned-${rowDocking.band}`);
      rowDiv.classList.toggle('slick-row-sticky', !!rowDocking?.sticky);
    }
    let rowRegionLeft: HTMLElement | undefined;
    let rowRegionCenter: HTMLElement = rowDiv;
    let rowRegionRight: HTMLElement | undefined;
    if (this.usesDockingRowRegions()) {
      rowDiv.classList.add('slick-row-docked');
      const renderedWidth = this.getDockingRenderedWidth();
      const { left: leftWidth, center: renderedCenterWidth, right: rightWidth } = this.getDockingRenderedWidths(renderedWidth);
      rowDiv.style.width = `${renderedWidth}px`;
      rowDiv.style.gridTemplateColumns = `${leftWidth}px ${renderedCenterWidth}px ${rightWidth}px`;
      rowRegionLeft = Utils.createDomElement(
        'div',
        {
          className: `slick-pinned-left-cells${leftWidth > 0 ? ' slick-pinned-left-cells-active' : ''}`,
          role: 'presentation',
          style: { width: `${leftWidth}px` },
        },
        rowDiv
      );
      rowRegionCenter = Utils.createDomElement(
        'div',
        {
          className: 'slick-scrolling-cells',
          role: 'presentation',
          style: { width: `${renderedCenterWidth}px` },
        },
        rowDiv
      );
      rowRegionRight = Utils.createDomElement(
        'div',
        {
          className: `slick-pinned-right-cells${rightWidth > 0 ? ' slick-pinned-right-cells-active' : ''}`,
          role: 'presentation',
          style: { width: `${rightWidth}px` },
        },
        rowDiv
      );
      this.rowsCache[row].cellRegions = { center: rowRegionCenter, left: rowRegionLeft, right: rowRegionRight };
      this.applyDockingScrollOffsetToRow(rowDiv, this.rowsCache[row]);
    }
    if (this.usesDockingRowRegions() || this._options.enableVariableRowHeight) {
      // Docked rows have their own grid regions and pinned-row box model. Keep
      // the resolved rowHeight explicit so active/editor styles cannot make the
      // row fall back to content height (for example 35px instead of 45px).
      const rowHeight = this.getRowHeight(row);
      if (this.usesDockingRowRegions() || rowHeight !== this._options.rowHeight) {
        rowDiv.style.height = `${rowHeight}px`;
      }
    }

    divArray.push(rowDiv);

    const columnCount = this.columns.length;
    let columnData: ColumnMetadata | null;
    let colspan: number | string;
    let rowspan: number;
    let m: C;
    let isRenderCell = true;
    let isFullColspan = false;

    for (let i = 0, ii = columnCount; i < ii; i++) {
      isRenderCell = true;
      m = this.columns[i];
      if (m && (!m.hidden || metadata?.isGroup)) {
        colspan = 1;
        rowspan = 1;
        columnData = null;
        if (metadata?.columns) {
          columnData = metadata.columns[m.id] || metadata.columns[i];
          colspan = columnData?.colspan || 1;
          rowspan = columnData?.rowspan || 1;
          if (colspan === '*') {
            isFullColspan = true;
            colspan = ii - i;
          }
          if (rowspan > dataLength - row) {
            rowspan = dataLength - row;
          }
        }

        if (!this._options.enableCellRowSpan && rowspan > 1) {
          console.warn(
            '[SlickGrid] Cell "rowspan" is an opt-in grid option because of its small perf hit, you must enable it via the "enableCellRowSpan" grid option.'
          );
        }

        let ncolspan = colspan as number; // at this point colspan is for sure a number
        const isFullWidthGroup = this.usesDockingRowRegions() && this.isFullWidthGroupCell(metadata, columnData, i, ncolspan);
        if (isFullWidthGroup) {
          rowDiv.classList.add('slick-row-full-width-group');
        }

        // don't render child cell of a rowspan cell
        if (this.getParentRowSpanByCell(row, i)) {
          continue;
        }

        // Do not render cells outside of the viewport.
        if (this.getColumnRangeRight(Math.min(ii - 1, i + ncolspan - 1), i) > range.leftPx) {
          if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx) {
            isRenderCell = false; // render as false but keep looping to correctly save cellspan pointers
          }

          // when dealing with colspan, we'll count hidden columns and increase colspan when that happens
          if (!isFullColspan && this._options.spreadHiddenColspan) {
            ncolspan = this.increaseHiddenColspan(ncolspan, i);
          }

          // All columns to the right are outside the range, so no need to render them
          if (isRenderCell) {
            const targetedRowDiv = isFullWidthGroup ? rowDiv : this.getRowDockingRegion(rowDiv, i, this.rowsCache[row].cellRegions);
            this.appendCellHtml(targetedRowDiv, row, i, ncolspan, rowspan, columnData, d, isFullWidthGroup);
          }
        } else if (m.alwaysRenderColumn || this.getColumnDockingBand(i) !== 'center') {
          const targetedRowDiv = isFullWidthGroup ? rowDiv : this.getRowDockingRegion(rowDiv, i, this.rowsCache[row].cellRegions);
          this.appendCellHtml(targetedRowDiv, row, i, ncolspan, rowspan, columnData, d, isFullWidthGroup);
        }

        if (ncolspan > 1) {
          i += ncolspan - 1;
        }
      }
    }

    this.applyRowTopOffset(rowDiv, row);
  }

  /**
   * Creates a cell element with appropriate CSS classes (including docking and active classes) and retrieves its value
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
  protected appendCellHtml(
    divRow: HTMLElement,
    row: number,
    cell: number,
    colspan: number,
    rowspan: number,
    columnMetadata: ColumnMetadata | null,
    item: TData,
    isFullWidthGroup = false,
    deferFragments = false
  ): void {
    // divRow: the html element to append items too
    // row, cell: row and column index
    // colspan: HTML colspan
    // item: grid data for row

    const segments = colspan > 1 && !isFullWidthGroup && this.usesDockingRowRegions() ? this.getColspanSegments(cell, colspan) : [];
    // Keep the host's full colspan so its formatter content can flow through
    // the docking bands; fragments only provide the clipped region geometry.
    const renderedColspan = colspan;
    const m = this.columns[cell];
    let cellCss =
      `slick-cell l${cell} r${Math.min(this.columns.length - 1, cell + renderedColspan - 1)}` +
      (m.cssClass ? ` ${m.cssClass}` : '') +
      (rowspan > 1 ? ' rowspan' : '') +
      (columnMetadata?.cssClass ? ` ${columnMetadata.cssClass}` : '');

    if (isFullWidthGroup) {
      cellCss += ' slick-cell-full-width-group';
    }
    const docking = this.dockingByColumn.get(cell);
    const usesStickyTransform = !isFullWidthGroup && this.usesStickyColumnTransformPath() && !!m.sticky;
    if (!usesStickyTransform && !isFullWidthGroup && docking && docking.band !== 'center') {
      cellCss += ` slick-cell-pinned-${docking.band}`;
      if (docking?.sticky) {
        cellCss += ' slick-cell-sticky';
      }
    }

    if (row === this.activeRow && cell === this.activeCell && this._options.showCellSelection) {
      cellCss += ' active';
    }

    const cellCssClasses = this.cellCssClassesByCell[row]?.[m.id];
    if (cellCssClasses) {
      cellCss += ` ${cellCssClasses}`;
    }
    if (this.isCellSelected(row, cell) && !cellCssClasses?.includes(this._options.selectedCellCssClass || '')) {
      cellCss += ` ${this._options.selectedCellCssClass}`;
    }

    let value: any = null;
    let formatterResult: FormatterResultWithHtml | FormatterResultWithText | HTMLElement | DocumentFragment | string = '';
    if (item) {
      value = this.getDataItemValueForColumn(item, m);
      formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this as unknown as SlickGrid);
      if (formatterResult === null || formatterResult === undefined) {
        formatterResult = '';
      }
    }

    // get addl css class names from object type formatter return and from string type return of onBeforeAppendCell
    // we will only use the event result as CSS classes when it is a string type (undefined event always return a true boolean which is not a valid css class)
    const evt = this.trigger(this.onBeforeAppendCell, { row, cell, value, dataContext: item });
    const appendCellResult = evt.getReturnValue();
    let addlCssClasses = typeof appendCellResult === 'string' ? appendCellResult : '';
    if ((formatterResult as FormatterResultObject)?.addClasses) {
      addlCssClasses += Utils.classNameToList((addlCssClasses ? ' ' : '') + (formatterResult as FormatterResultObject).addClasses).join(' ');
    }

    const toolTipText = (formatterResult as FormatterResultObject)?.toolTip ? `${(formatterResult as FormatterResultObject).toolTip}` : '';
    const cellDiv = Utils.createDomElement('div', {
      className: Utils.classNameToList(`${cellCss} ${addlCssClasses || ''}`).join(' '),
      role: 'gridcell',
      tabIndex: -1,
      ariaColIndex: `${cell + 1}`,
    });
    if (usesStickyTransform) {
      this.applyStickyColumnTransform(cellDiv, cell, 'cell');
    }
    cellDiv.setAttribute('aria-describedby', this.uid + m.id);
    if (colspan > 1) {
      const visibleColspan = this.columns.slice(cell, cell + colspan).filter((column) => !column.hidden).length;
      if (visibleColspan > 1) {
        cellDiv.setAttribute('aria-colspan', `${visibleColspan}`);
      }
    }
    if (rowspan > 1) {
      cellDiv.setAttribute('aria-rowspan', `${rowspan}`);
    }
    if (toolTipText) {
      cellDiv.setAttribute('title', toolTipText);
    }

    // update cell rowspan height when spanning more than 1 row
    const cellHeight = this.getCellHeight(row, rowspan);
    if (rowspan > 1 && cellHeight !== this.getRowHeight(row) - this.cellHeightDiff) {
      cellDiv.style.height = `${cellHeight || 0}px`;
    }

    if (m.hasOwnProperty('cellAttrs') && m.cellAttrs instanceof Object) {
      Object.keys(m.cellAttrs).forEach((key) => {
        if (m.cellAttrs.hasOwnProperty(key)) {
          cellDiv.setAttribute(key, m.cellAttrs[key]);
        }
      });
    }

    // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
    if (item) {
      const cellResult = isPrimitiveOrHTML(formatterResult)
        ? formatterResult
        : (formatterResult as FormatterResultWithHtml).html || (formatterResult as FormatterResultWithText).text;
      this.applyHtmlCode(cellDiv, cellResult as string | HTMLElement);

      // add drag-to-replace handle
      const selectionType = this.getSelectionModel()?.getOptions()?.selectionType;
      const showDragHandle = this.getDragHandleVisibility();
      const addDragHandle = selectionType === 'cell' || selectionType === 'mixed';
      if (
        row === this.selectionBottomRow &&
        cell === this.selectionRightCell &&
        this._options.showCellSelection &&
        addDragHandle &&
        showDragHandle !== false
      ) {
        this.dragReplaceEl.createEl(cellDiv, showDragHandle);
      }
    }
    divRow.appendChild(cellDiv);

    // Formatter can optional add an "insertElementAfterTarget" option but it must be inserted only after the `.slick-row` div exists
    if ((formatterResult as FormatterResultObject).insertElementAfterTarget) {
      Utils.insertAfterElement(cellDiv, (formatterResult as FormatterResultObject).insertElementAfterTarget as HTMLElement);
    }

    this.rowsCache[row].cellRenderQueue.push(cell);
    this.rowsCache[row].cellColSpans[cell] = colspan;
    if (segments.length > 1) {
      this.appendColspanFragments(row, cell, cellDiv, segments, deferFragments);
    }
  }

  /**
   * Iterates over keys in the rowsCache and, for each row that is not the active row and falls
   * outside the provided visible range (and is not a pinned row), calls removeRowFromCache to remove
   * its DOM elements. If asynchronous post–render cleanup is enabled, it triggers that process afterward.
   *
   * @param {{ bottom: number; top: number; }} rangeToKeep - The range of rows to keep.
   */
  protected cleanupRows(rangeToKeep: { bottom: number; top: number }): void {
    // when using rowspan, we might have mandatory rows that cannot be cleaned up
    // that is basically the starting row that holds the rowspan, that row cannot be cleaned up because it would break the UI
    const mandatoryRows = new Set<number>();
    if (this._options.enableCellRowSpan) {
      for (let i = rangeToKeep.top, ln = rangeToKeep.bottom; i <= ln; i++) {
        const parentRowSpan = this.getRowSpanIntersect(i);
        if (parentRowSpan !== null) {
          mandatoryRows.add(parentRowSpan); // add to Set which will take care of duplicate rows
        }
      }
    }

    Object.keys(this.rowsCache).forEach((rowId) => {
      if (this.rowsCache) {
        let i = +rowId;
        let removePinnedRow = true;

        const dockingBand = this.dockingByRow.get(i)?.band;
        if (this.isPinnedRowIdx(i) || (dockingBand !== undefined && dockingBand !== 'center')) {
          removePinnedRow = false;
        }

        if (
          (i = parseInt(rowId, 10)) !== this.activeRow &&
          (i < rangeToKeep.top || i > rangeToKeep.bottom) &&
          removePinnedRow &&
          !mandatoryRows.has(i)
        ) {
          this.removeRowFromCache(i);
        }
      }
    });
    if (this._options.enableAsyncPostRenderCleanup) {
      this.startPostProcessingCleanup();
    }
  }

  /** Invalidate all grid rows and re-render the visible grid rows */
  invalidate(): void {
    if (!this.initialized || !this._container) {
      return;
    }
    this.updateRowCount();
    this.invalidateAllRows();
    this.render();
  }

  /** Invalidate all grid rows */
  invalidateAllRows(): void {
    this.dockingRowIndexByReference.clear();
    this.rowDockingStale = true;
    // invalidated row content may resize the rows, so conservatively mark dirty for rebuild
    this.rowHeightsDirty = true;
    if (this.currentEditor) {
      this.makeActiveCellNormal();
    }

    if (typeof this.rowsCache === 'object') {
      Object.keys(this.rowsCache).forEach((row) => {
        if (this.rowsCache) {
          this.removeRowFromCache(+row);
        }
      });
    }

    if (this._options.enableAsyncPostRenderCleanup) {
      this.startPostProcessingCleanup();
    }
  }

  /**
   * Invalidate a specific set of row numbers
   * @param {Number[]} rows
   */
  invalidateRows(rows: number[]): void {
    if (!rows || !rows.length) {
      return;
    }

    // A count-preserving sort/filter can move rows without calling
    // updateRowCount(), so cached id-to-index docking references must be
    // invalidated along with the affected rows.
    this.dockingRowIndexByReference.clear();
    this.rowDockingStale = true;
    let row;
    this.vScrollDir = 0;
    this.rowHeightsDirty = true;
    const rl = rows.length;

    // use Set to avoid duplicates
    const invalidatedRows = new Set<number>();
    const requiredRemapRows = new Set<number>();

    // only do a partial rowspan remapping when the number of rows is limited and the rows aren't the full dataset
    // otherwise a full rowspan remap of the cache is much quicker and cheaper to perform
    const isRowSpanFullRemap =
      rows.length > this._options.maxPartialRowSpanRemap! ||
      rows.length === this.getDataLength() ||
      this._prevInvalidatedRowsCount + rows.length === this.getDataLength();

    for (let i = 0; i < rl; i++) {
      row = rows[i];
      if (this.currentEditor && this.activeRow === row) {
        this.makeActiveCellNormal();
      }
      if (this.rowsCache[row]) {
        this.removeRowFromCache(row);
      }

      // add any rows that have rowspan intersects if it's not already in the list
      if (this._options.enableCellRowSpan && !isRowSpanFullRemap) {
        invalidatedRows.add(row);
        const parentRowSpan = this.getRowSpanIntersect(row);
        if (parentRowSpan !== null) {
          invalidatedRows.add(parentRowSpan);
        }
      }
    }

    // when a partial rowspan remapping is necessary
    if (this._options.enableCellRowSpan && !isRowSpanFullRemap) {
      for (const ir of Array.from(invalidatedRows)) {
        const colIdxs = this.getRowSpanColumnIntersects(ir);
        for (const cidx of colIdxs) {
          const prs = this.getParentRowSpanByCell(ir, cidx);
          if (prs && this._colsWithRowSpanCache[cidx]) {
            this._colsWithRowSpanCache[cidx].delete(prs.range);
            requiredRemapRows.add(prs.range.split(':').map(Number)[0]);
          }
        }
      }

      // now that we know all the rows that need remapping, let's start remapping
      for (const row of Array.from(requiredRemapRows)) {
        this.remapRowSpanMetadataByRow(row);
      }
    }

    if (this._options.enableAsyncPostRenderCleanup) {
      this.startPostProcessingCleanup();
    }
    this._prevInvalidatedRowsCount = rows.length;
  }

  /**
  * Invalidate a specific row number
  * @param {Number} row
  */
  invalidateRow(row: number): void {
    if (row >= 0) {
      const rows = [row];
      if (this._options.enableCellRowSpan) {
        const intersectedRow = this.getRowSpanIntersect(row);
        if (intersectedRow !== null) {
          rows.push(intersectedRow);
        }
      }
      this.invalidateRows(rows);
    }
  }

  /**
   * Given a row index, retrieves the corresponding cache entry. If asynchronous post–render cleanup is enabled
   * and post–processed results exist, queues cleanup actions; otherwise, removes the row nodes from the DOM.
   * It then deletes the row’s entry from rowsCache and postProcessedRows, decrements the rendered row count,
   * and increments a removal counter.
   *
   * @param {number} row - The index of the row to remove.
   */
  protected removeRowFromCache(row: number): void {
    const cacheEntry = this.rowsCache[row];
    if (cacheEntry?.rowNode) {
      this.trigger(this.onBeforeRemoveCachedRow, { row });
      if (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row]) {
        this.queuePostProcessedRowForCleanup(cacheEntry, this.postProcessedRows[row], row);
      } else {
        cacheEntry.rowNode?.forEach((node: HTMLElement) => node.parentElement?.removeChild(node));
      }

      delete this.rowsCache[row];
      delete this.postProcessedRows[row];
      this.renderedRows--;
      this.counter_rows_removed++;
    }
  }

  /**
   * Update a specific cell by its row and column index
   * @param {Number} row - grid row number
   * @param {Number} cell - grid cell column number
   */
  updateCell(row: number, cell: number): void {
    const cellNode = this.getCellNode(row, cell);
    if (cellNode) {
      const m = this.columns[cell];
      const d = this.getDataItem(row);
      if (this.currentEditor && this.activeRow === row && this.activeCell === cell) {
        this.currentEditor.loadValue(d);
      } else {
        // if the cell has other coordinates because of row/cell span, update that cell (which will invalidate this cellNode)
        // const spans = this.getSpans(row, cell);
        // if (spans[0] !== row || spans[1] !== cell) {
        //   this.updateCell(spans[0], spans[1]);
        //   return;
        // }
        const formatterResult = d
          ? this.getFormatter(row, m)(row, cell, this.getDataItemValueForColumn(d, m), m, d, this as unknown as SlickGrid)
          : '';
        this.applyFormatResultToCellNode(formatterResult, cellNode);
        this.invalidatePostProcessingResults(row);
      }
    }
  }

  /**
   * Update a specific row by its row index
   * @param {Number} row - grid row number
   */
  updateRow(row: number): void {
    const cacheEntry = this.rowsCache[row];
    if (!cacheEntry) {
      return;
    }

    this.ensureCellNodesInRowsCache(row);

    let formatterResult;
    const d = this.getDataItem(row);

    Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((colIdx) => {
      if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
        const columnIdx = +colIdx;
        const m = this.columns[columnIdx];
        const node = cacheEntry.cellNodesByColumnIdx[columnIdx];

        if (this.currentEditor && row === this.activeRow && columnIdx === this.activeCell) {
          this.currentEditor.loadValue(d);
        } else if (d) {
          formatterResult = this.getFormatter(row, m)(
            row,
            columnIdx,
            this.getDataItemValueForColumn(d, m),
            m,
            d,
            this as unknown as SlickGrid
          );
          this.applyFormatResultToCellNode(formatterResult, node as HTMLDivElement);
        } else {
          Utils.emptyElement(node);
        }
      }
    });

    this.invalidatePostProcessingResults(row);
  }

  /**
   * Get the number of rows displayed in the viewport
   * Note that the row count is an approximation because it is a calculated value using this formula (viewport / rowHeight = rowCount),
   * the viewport must also be displayed for this calculation to work.
   * @return {Number} rowCount
   */
  getViewportRowCount(): number {
    const vh = this.getViewportHeight();
    const scrollbarHeight = this.getScrollbarDimensions()?.height || 0;
    return Math.floor((vh - scrollbarHeight) / this._options.rowHeight!);
  }

  /**
   * Calculates the vertical height available for displaying grid rows. In auto–height mode it sums panel heights
   * (header, footer, top panel) plus the total row height; otherwise, it subtracts header, footer, pre–header,
   * top–header heights and container paddings from the container’s computed height. It also computes and stores
   * the number of visible rows.
   */
  getViewportHeight(): number {
    if (!this._options.autoHeight) {
      this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight! + this.getVBoxDelta(this._topPanelScrollers[0]) : 0;
      this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight! + this.getVBoxDelta(this._headerRowScroller[0]) : 0;
      this.footerRowH =
        this._options.createFooterRow && this._options.showFooterRow
          ? this._options.footerRowHeight! + this.getVBoxDelta(this._footerRowScroller[0])
          : 0;
    }

    if (this._options.autoHeight) {
      this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight! + this.getVBoxDelta(this._topPanelScrollers[0]) : 0;
      this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight! + this.getVBoxDelta(this._headerRowScroller[0]) : 0;
      this.footerRowH =
        this._options.createFooterRow && this._options.showFooterRow
          ? this._options.footerRowHeight! + this.getVBoxDelta(this._footerRowScroller[0])
          : 0;
      // viewportH is the body height. Header/pre-header heights belong to the
      // sibling header root and are added once by resizeCanvas below.
      this.viewportH = this.getRowPosition(this.getDataLengthIncludingAddNew());
      if (this.getCanvasWidth() > this.viewportW) {
        this.viewportH += this.scrollbarDimensions?.height || 0;
      }
    } else {
      const style = getComputedStyle(this._container);
      const containerBoxH = style.boxSizing !== 'content-box' ? this.getVBoxDelta(this._container) : 0;
      const topHeaderH =
        this._options.createTopHeaderPanel && this._options.showTopHeaderPanel
          ? this._options.topHeaderPanelHeight! + this.getVBoxDelta(this._topHeaderPanelScroller)
          : 0;
      const preHeaderH =
        this._options.createPreHeaderPanel && this._options.showPreHeaderPanel
          ? this._options.preHeaderPanelHeight! + this.getVBoxDelta(this._preHeaderPanelScroller)
          : 0;
      const columnNamesH = this._options.showColumnHeader ? Utils.toFloat(Utils.height(this._headerScroller[0]) as number) : 0;
      // `min-height` can make the rendered box taller than its inline `height`.
      // Measure the effective box so docking budgets are reflected in the child viewport.
      const containerHeight = Math.max(Utils.toFloat(style.height), this._container.getBoundingClientRect().height || 0);
      this.viewportH =
        containerHeight -
        Utils.toFloat(style.paddingTop) -
        Utils.toFloat(style.paddingBottom) -
        this.topPanelH -
        topHeaderH -
        preHeaderH -
        this.headerRowH -
        columnNamesH -
        this.footerRowH -
        containerBoxH;
    }

    this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight!);
    return this.viewportH;
  }

  /** returns the available viewport inner width, that is the viewport width minus the scrollbar when shown */
  protected getViewportInnerWidth(): number {
    return this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width || 0) : this.viewportW;
  }

  /**
   * Returns the width of the grid’s viewport by measuring the inner width of the grid container (using a utility function).
   * It falls back to a devMode–specified width if necessary.
   */
  getViewportWidth(): number {
    this.viewportW =
      parseFloat(Utils.innerSize(this._container, 'width') as unknown as string) ||
      (this._options.devMode && this._options.devMode.containerClientWidth) ||
      0;
    return this.viewportW;
  }

  /** Execute a Resize of the Grid Canvas.
  *
  * Recalculates the grid’s canvas, pane, and viewport dimensions based on the current container size,
  * docking rows/columns settings, and auto–height configuration. It then applies these dimensions to the viewport,
  * docking scroller, and canvas elements and updates the scrollbar dimensions.
  * Finally, it updates the row count, handles scrolling, and forces a re–render.
  */
  resizeCanvas(): void {
    if (this.initialized) {
      this.paneTopH = 0;
      this.paneBottomH = 0;
      this.viewportTopH = 0;
      this.viewportBottomH = 0;

      // Clear a previously applied minimum-height override before measuring, so the grid can
      // shrink back down once the container is comfortably large again.
      if (!this._options.autoHeight) {
        this._container.style.minHeight = '';
      }
      this.getViewportWidth();
      this.getViewportHeight();
      let dockingChanged = this.refreshDockingLayout();
      // Resolve the row bands before checking the minimum center budget. The budget
      // depends on the current pinned-row heights and must not use a stale layout.
      this.enforceMinCenterRowBudget();
      // The docking scrollbar is a sibling of the viewport and does not reduce its
      // clientHeight, so reserve its height before sizing the virtual rows.
      const dockingViewportWidth = this._viewportNode?.clientWidth || this.viewportW;
      const dockingContentWidth = this.dockingLayout.contentWidth || this.canvasWidth;
      const hasDockingHorizontalOverflow = dockingContentWidth > dockingViewportWidth;
      const dockingHorizontalScrollbarHeight =
        !this._options.autoHeight && this.hasDockingHorizontalScroller() && hasDockingHorizontalOverflow
          ? this.getDockingScrollbarHeight()
          : 0;
      if (dockingHorizontalScrollbarHeight) {
        this.viewportH = Math.max(0, this.viewportH - dockingHorizontalScrollbarHeight);
      }

      this.paneTopH = this.viewportH + dockingHorizontalScrollbarHeight;

      // The top pane includes the top panel and the header row
      this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH;

      // The top viewport does not contain the top panel or header row
      this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH - dockingHorizontalScrollbarHeight;

      if (this._options.autoHeight) {
        let fullHeight = this.paneTopH + this._headerRoot.offsetHeight;
        fullHeight += this.getVBoxDelta(this._container);
        if (this._options.showTopHeaderPanel) {
          fullHeight += this._options.topHeaderPanelHeight! + this.getVBoxDelta(this._topHeaderPanelScroller);
        }
        Utils.height(this._container, fullHeight);
        this.autoHeightContainerSizeApplied = true;
        this._contentRoot.style.position = 'relative';
      } else if (this.autoHeightContainerSizeApplied) {
        // A docking grid may be switched back to a plain auto-height grid at
        // runtime. Remove only the height owned by resizeCanvas; user-supplied
        // inline sizing was never marked as owned by us.
        this._container.style.height = '';
        this.autoHeightContainerSizeApplied = false;
      }

      let topHeightOffset = Utils.height(this._headerRoot);
      if (topHeightOffset) {
        topHeightOffset += this._options.showTopHeaderPanel ? this._options.topHeaderPanelHeight! : 0;
      } else {
        topHeightOffset =
          (this._options.showHeaderRow ? this._options.headerRowHeight! : 0) +
          (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight! : 0);
      }
      Utils.setStyleSize(this._contentRoot, 'top', topHeightOffset);
      Utils.height(this._contentRoot, this.paneTopH);

      if (!this._options.autoHeight) {
        Utils.height(this._viewportNode, this.viewportTopH);
      }
      this.updateDockingOverlayDimensions();
      this.updateDockingHorizontalScrollerDimensions();

      // The proxy scrollbar is sized in this pass, so resolve once more against its final
      // width; otherwise two-sided sticky columns can start on the wrong edge.
      this.scrollLeft = this._viewportScrollContainerX?.scrollLeft ?? this.scrollLeft;
      dockingChanged = this.refreshDockingLayout(this.scrollLeft) || dockingChanged;

      Utils.height(this._viewportNode, this.viewportTopH);

      if (!this.scrollbarDimensions || !this.scrollbarDimensions.width) {
        this.scrollbarDimensions = this.measureScrollbar();
      }

      if (this._options.forceFitColumns) {
        this.legacyAutosizeColumns();
      }


      if (dockingChanged) {
        this.updateColumnCaches();
        this.applyColumnWidths();
        this.applyDockingToColumnChrome();
        this.invalidateAllRows();
      }

      // Keep compositor transforms in sync even when the numeric scroll offset
      // itself did not change during resize.
      this.scrollToX(this.scrollLeft);

      this.updateRowCount();
      this.handleScroll();
      // Since the width has changed, force the render() to reevaluate virtually rendered cells.
      this.lastRenderedScrollLeft = -1;
      this.render();
    }
  }

  /**
  * (re)Builds the row position index used in variable row height mode when needed, i.e. when it is
  * marked dirty (see invalidateRowHeights) or when the indexed row count no longer matches the
  * dataset length. Since the pinned rows height depends on individual row heights, it is refreshed
  * after every rebuild. Does nothing (and drops the index) when variable row height is disabled.
  *
  * @param {number} rowCount - The number of rows to index (including the Add-New row when enabled).
  */
  protected ensureRowPositionIndexer(rowCount: number): void {
    if (!this._options.enableVariableRowHeight) {
      this.rowPositionIndexer = undefined;
      return;
    }
    if (!this.rowPositionIndexer) {
      this.rowPositionIndexer = new RowPositionIndexer();
      this.rowHeightsDirty = true;
    }
    if (this.rowHeightsDirty || this.rowPositionIndexer.count !== rowCount) {
      const provider = this._options.rowHeightProvider;
      this.rowPositionIndexer.rebuild(rowCount, this._options.rowHeight!, (row: number) =>
        provider?.(this as unknown as SlickGrid, row, this.getDataItem(row))
      );
      this.rowHeightsDirty = false;
    }
  }

  /**
  * Invalidate all row heights (variable row height mode) and fully re-render the grid.
  * Call this after the values driving `rowHeightProvider` (or, with the default provider, the
  * item metadata heights) have changed without a change in row count; the row position index
  * is then rebuilt with the new heights.
  */
  invalidateRowHeights(): void {
    if (this._options.enableVariableRowHeight) {
      this.rowHeightsDirty = true;
      this.invalidate();
    }
  }

  /** Update the dataset row count */
  updateRowCount(): void {
    if (this.initialized && this._container) {
      const dataLength = this.getDataLength();
      this._container.setAttribute('aria-rowcount', dataLength.toString());

      // remap all rowspan cache when necessary
      if (dataLength > 0 && dataLength !== this._prevDataLength) {
        this._rowSpanIsCached = false; // will force a full remap
      }
      if (this._options.enableCellRowSpan && !this._rowSpanIsCached) {
        this.remapAllColumnsRowSpan();
      }

      this._prevDataLength = dataLength;

      const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      let numberOfRows = 0;
      let oldH = Utils.height(this._canvasNode) as number;
      numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);

      // (re)build the row position index (variable row height mode) before any height computations
      this.ensureRowPositionIndexer(dataLengthIncludingAddNew);

      // Bottom-pinned rows keep their canvas slot; rows after a bottom pin render one pinned
      // height higher, so every scrolling row stays reachable above the band.
      const scrollableRowsHeight = this.getRowPosition(numberOfRows);

      const tempViewportH = Utils.height(this._viewportScrollContainerY) as number;
      const oldViewportHasVScroll = this.viewportHasVScroll;
      // with autoHeight, we do not need to accommodate the vertical scroll bar
      this.viewportHasVScroll =
        this._options.alwaysShowVerticalScroll || (!this._options.autoHeight && scrollableRowsHeight > tempViewportH);

      this.makeActiveCellNormal();

      // remove the rows that are now outside of the data range
      // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
      const r1 = dataLength - 1;
      if (typeof this.rowsCache === 'object') {
        Object.keys(this.rowsCache).forEach((row) => {
          const cachedRow = +row;
          if (cachedRow > r1) {
            this.removeRowFromCache(cachedRow);
          }
        });
      }

      if (this._options.enableAsyncPostRenderCleanup) {
        this.startPostProcessingCleanup();
      }

      if (this.activeCellNode && this.activeRow > r1) {
        this.resetActiveCell();
      }

      oldH = this.h;
      if (this._options.autoHeight) {
        this.h = scrollableRowsHeight;
      } else {
        this.th = Math.max(scrollableRowsHeight, tempViewportH - (this.scrollbarDimensions?.height || 0));
        if (this.th < this.maxSupportedCssHeight) {
          // just one page
          this.h = this.ph = this.th;
          this.n = 1;
          this.cj = 0;
        } else {
          // break into pages
          this.h = this.maxSupportedCssHeight;
          this.ph = this.h / 100;
          this.n = Math.floor(this.th / this.ph);
          this.cj = (this.th - this.h) / (this.n - 1);
        }
      }

      if (this.h !== oldH) {
        Utils.height(this._canvasNode, this.h);

        this.scrollTop = this._viewportScrollContainerY.scrollTop;
        this.scrollHeight = this._viewportScrollContainerY.scrollHeight;
      }

      const oldScrollTopInRange = this.scrollTop + this.offset <= this.th - tempViewportH;

      /* v8 ignore else */
      if (this.th === 0 || this.scrollTop === 0) {
        this.page = this.offset = 0;
      } else if (oldScrollTopInRange) {
        // maintain virtual position
        this.scrollTo(this.scrollTop + this.offset);
      } else {
        // scroll to bottom
        this.scrollTo(this.th - tempViewportH + (this.scrollbarDimensions?.height || 0));
      }

      if (this.h !== oldH && this._options.autoHeight) {
        this.resizeCanvas();
      }

      if (this._options.forceFitColumns && oldViewportHasVScroll !== this.viewportHasVScroll) {
        this.legacyAutosizeColumns();
      }
      this.refreshRowDockingLayout(this.scrollTop, true);
      this.updateCanvasWidth(false);
      // A first row-count measurement can establish the vertical scrollbar
      // after the initial docking pass. Reapply the edge geometry immediately
      // so right-pinned chrome does not wait for a later option change or resize.
      if (oldViewportHasVScroll !== this.viewportHasVScroll && this.hasConfiguredColumnDocking()) {
        this.applyDockingToColumnChrome();
        this.applyDockingDimensionsToRows();
      }
    }
  }

  /** @alias `getVisibleRange` */
  getViewport(viewportTop?: number, viewportLeft?: number): CellViewportRange {
    return this.getVisibleRange(viewportTop, viewportLeft);
  }

  /**
   * Returns an object with the top and bottom row indices that are visible in the viewport, as well
   * as the left and right pixel boundaries.
   * It uses the current (or provided) scroll positions and viewport dimensions.
   *
   * @param {number} [viewportTop] - The top scroll position.
   * @param {number} [viewportLeft] - The left scroll position.
   * @returns {{ top: number; bottom: number; leftPx: number; rightPx: number }} The visible range.
   */
  getVisibleRange(viewportTop?: number, viewportLeft?: number): CellViewportRange {
    viewportTop ??= this.scrollTop;
    viewportLeft ??= this.scrollLeft;

    let leftPx = viewportLeft;
    let rightPx = viewportLeft + Math.max(0, this.viewportW - this.dockingLayout.leftBaseWidth - this.dockingLayout.rightBaseWidth);

    if (this._options.rtl) {
      // In RTL mode, scrollLeft is the offset from the right edge.
      const maxScroll = this.canvasWidth - this.viewportW;
      leftPx = maxScroll - viewportLeft - this.viewportW;
      rightPx = maxScroll - viewportLeft;
    }

    return {
      top: this.getRowFromPosition(viewportTop),
      bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
      leftPx,
      rightPx,
    };
  }

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
  getRenderedRange(viewportTop?: number, viewportLeft?: number): CellViewportRange {
    const range = this.getVisibleRange(viewportTop, viewportLeft);
    const buffer = Math.round(this.viewportH / this.getRowHeight());
    const minBuffer = this._options.minRowBuffer as number;

    if (this.vScrollDir === -1) {
      range.top -= buffer;
      range.bottom += minBuffer;
    } else if (this.vScrollDir === 1) {
      range.top -= minBuffer;
      range.bottom += buffer;
    } else {
      range.top -= minBuffer;
      range.bottom += minBuffer;
    }

    range.top = Math.max(0, range.top);
    range.bottom = Math.min(this.getDataLengthIncludingAddNew() - 1, range.bottom);

    range.leftPx -= this.viewportW;
    range.rightPx += this.viewportW;

    range.leftPx = Math.max(0, range.leftPx);
    range.rightPx = Math.min(this.canvasWidth, range.rightPx);

    return range;
  }

  /**
   * Returns the rows cache that are currently rendered in the DOM,
   * the cache includes certain properties like the row div element, cell rendered queue and the row colspan when defined.
   */
  getRowCache(): Record<number, RowCaching> {
    return this.rowsCache;
  }

  /**
   * Ensures that the row’s cache entry contains all cell DOM nodes by transferring nodes
   * from the cellRenderQueue into the cellNodesByColumnIdx array. This is used to guarantee
   * that each cell is indexed properly for later updates.
   *
   * @param {number} row - The row index to ensure cell nodes exist for.
   */
  protected ensureCellNodesInRowsCache(row: number): void {
    const cacheEntry = this.rowsCache[row];
    if (cacheEntry?.cellRenderQueue.length && cacheEntry.rowNode?.length) {
      const rowNode = cacheEntry.rowNode as HTMLElement[];
      const children = this.getRowCellChildren(rowNode[0]);
      children.forEach((node) => (cacheEntry.cellNodesByColumnIdx[this.getCellFromNode(node)] = node));
      cacheEntry.cellRenderQueue.length = 0;
    }
  }

  /**
   * For the specified row and a given horizontal visible range, iterates over the cached cell nodes and
   * removes those cells that fall completely outside the visible range (except for docked or always–rendered cells).
   * Cells are either removed immediately or queued for asynchronous cleanup if enabled.
   * @param {CellViewportRange} range - The visible cell viewport range.
   * @param {number} row - The row index to clean up.
   */
  protected cleanUpCells(range: CellViewportRange, row: number): void {
    const cacheEntry = this.rowsCache[row];

    // Remove cells outside the range.
    const cellsToRemove: number[] = [];
    Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((cellNodeIdx) => {
      // I really hate it when people mess with Array.prototype.
      /* v8 ignore if */
      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx)) {
        return;
      }

      // This is a string, so it needs to be cast back to a number.
      const i = +cellNodeIdx;

      // Docked columns are always materialized; only the center band is horizontally virtualized.
      if (this.getColumnDockingBand(i) !== 'center') {
        return;
      }

      // Ignore alwaysRenderedColumns
      if (Array.isArray(this.columns) && this.columns[i]?.alwaysRenderColumn) {
        return;
      }

      const colspan = cacheEntry.cellColSpans[i];
      if (
        this.columnPosLeft[i] > range.rightPx ||
        this.getColumnRangeRight(Math.min(this.columns.length - 1, (i || 0) + (colspan as number) - 1), i) < range.leftPx
      ) {
        if (!(row === this.activeRow && Number(i) === this.activeCell)) {
          cellsToRemove.push(i as unknown as number);
        }
      }
    });

    let cellToRemove;
    let cellNode;
    while (Utils.isDefined((cellToRemove = cellsToRemove.pop()))) {
      cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove];

      /* v8 ignore if */
      if (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row]?.[cellToRemove]) {
        this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row);
      } else {
        cellNode.parentElement?.removeChild(cellNode);
      }

      cacheEntry.cellSpanFragments?.[cellToRemove]?.forEach((fragment) => fragment.remove());

      delete cacheEntry.cellColSpans[cellToRemove];
      delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
      delete cacheEntry.cellSpanFragments?.[cellToRemove];
      delete cacheEntry.cellSpanSegments?.[cellToRemove];
      /* v8 ignore if */
      if (this.postProcessedRows[row]) {
        delete this.postProcessedRows[row][cellToRemove];
      }
    }
  }

  /**
   * Iterates over each row in the provided rendered range. For each row, ensures cell nodes exist,
   * calls cleanUpCells to remove outdated cells, and then renders any missing cells (by calling appendCellHtml)
   * for columns that are now within the viewport. Finally, processes the row’s cellRenderQueue to attach rendered
   * cells to the correct docking regions, and reselects the active cell if needed.
   */
  protected cleanUpAndRenderCells(range: CellViewportRange): void {
    let cacheEntry: RowCaching;
    const divRow: HTMLElement = document.createElement('div');
    const processedRows: number[] = [];
    let cellsAdded: number;
    let colspan: number | string;
    let columnData: ColumnMetadata | null;
    const columnCount = this.columns.length;
    const hasAlwaysRenderColumn = this.columns.some((column) => column?.alwaysRenderColumn);
    let firstColumnIndex = 0;

    // Column positions are monotonic when there are no pinned columns, so use a lower-bound lookup
    // to avoid scanning columns that are entirely left of the rendered range in the common case.
    if (!this.hasDockedColumns() && !hasAlwaysRenderColumn) {
      firstColumnIndex = this.getFirstColumnIndexAtOrAfter(range.leftPx);
    }

    // Docked rows are rendered outside the vertical range, but their centre cells are
    // virtualized against the same horizontal range as every other row.
    const rowsToProcess: number[] = [];
    for (let row = range.top as number, btm = range.bottom as number; row <= btm; row++) {
      rowsToProcess.push(row);
    }
    for (const entry of [...this.rowDockingLayout.top, ...this.rowDockingLayout.bottom]) {
      if (entry.index < (range.top as number) || entry.index > (range.bottom as number)) {
        rowsToProcess.push(entry.index);
      }
    }

    for (const row of rowsToProcess) {
      cacheEntry = this.rowsCache[row];
      if (cacheEntry) {
        // cellRenderQueue populated in renderRows() needs to be cleared first
        this.ensureCellNodesInRowsCache(row);

        if (!this._options.enableCellRowSpan || this.getRowSpanIntersect(row) === null) {
          this.cleanUpCells(range, row);
        }

        // Render missing cells.
        cellsAdded = 0;

        const metadata = this.getItemMetadaWhenExists(row);
        const metadataCol = metadata?.columns;

        const d = this.getDataItem(row);
        let isFullColspan = false;
        const startColumnIndex = metadataCol || metadata?.isGroup ? 0 : firstColumnIndex;

        for (let i = startColumnIndex, ii = columnCount; i < ii; i++) {
          if (this.columns[i] && (!this.columns[i].hidden || metadata?.isGroup)) {
            // Cells to the right are outside the range.
            if (this.getColumnDockingBand(i) === 'center' && this.columnPosLeft[i] > range.rightPx) {
              if (!this.hasDockedColumns()) {
                break;
              }
              continue;
            }

            // Already rendered.
            if (Utils.isDefined((colspan = cacheEntry.cellColSpans[i] as number))) {
              i += colspan > 1 ? colspan - 1 : 0;
              continue;
            }

            colspan = 1;
            columnData = null;
            if (metadataCol) {
              columnData = metadataCol[this.columns[i].id as keyof ItemMetadata] || (metadataCol as any)[i];
              colspan = columnData?.colspan ?? 1;
              if (colspan === '*') {
                colspan = ii - i;
                isFullColspan = true;
              }
            }

            let ncolspan = colspan as number; // at this point colspan is for sure a number

            if (!isFullColspan && this._options.spreadHiddenColspan) {
              ncolspan = this.increaseHiddenColspan(ncolspan, i);
            }

            // don't render child cell of a rowspan cell
            if (this.getParentRowSpanByCell(row, i)) {
              continue;
            }

            if (
              this.getColumnDockingBand(i) !== 'center' ||
              this.getColumnRangeRight(Math.min(ii - 1, i + ncolspan - 1), i) > range.leftPx
            ) {
              const rowspan = this.getRowspan(row, i);
              const isFullWidthGroup = this.usesDockingRowRegions() && this.isFullWidthGroupCell(metadata, columnData, i, ncolspan);
              cacheEntry.rowNode?.[0].classList.toggle('slick-row-full-width-group', isFullWidthGroup);
              this.appendCellHtml(divRow, row, i, ncolspan, rowspan, columnData, d, isFullWidthGroup, true);
              cellsAdded++;
            }

            i += ncolspan > 1 ? ncolspan - 1 : 0;
          }
        }

        if (cellsAdded) {
          processedRows.push(row);
        }
      }
    }
    if (!divRow.children.length) {
      return;
    }

    let processedRow: number | null | undefined;
    let node: HTMLElement;
    while (Utils.isDefined((processedRow = processedRows.pop()))) {
      cacheEntry = this.rowsCache[processedRow];
      let columnIdx;
      while (Utils.isDefined((columnIdx = cacheEntry.cellRenderQueue.pop()))) {

        node = divRow.lastChild as HTMLElement;

        // no idea why node would be null here but apparently it could be..
        if (node) {
          /* v8 ignore if */
          if (this.usesDockingRowRegions()) {
            this.getRowDockingRegion(cacheEntry.rowNode![0], columnIdx, cacheEntry.cellRegions).appendChild(node);
          } else {
            cacheEntry.rowNode![0].appendChild(node);
          }
          cacheEntry.cellNodesByColumnIdx![columnIdx] = node;

          const fragments = cacheEntry.cellSpanFragments?.[columnIdx];
          const segments = cacheEntry.cellSpanSegments?.[columnIdx];
          fragments?.forEach((fragment, index) => {
            this.getRowDockingRegion(cacheEntry.rowNode![0], segments[index + 1].start, cacheEntry.cellRegions).appendChild(fragment);
          });
        }
      }
      cacheEntry.rowNode?.forEach((rowNode) => this.applyRowTopOffset(rowNode, processedRow!));
    }
  }

  /**
   * Iterates over the row indices in the given rendered range and, for each row not yet in the cache,
   * creates a new cache entry and calls appendRowHtml to build the row’s cell content. Once built,
   * the row is appended to the single canvas, with row docking applied when configured.
   * If the active cell is rendered, it reselects it.
   *
   * @param {{ top: number; bottom: number; leftPx: number; rightPx: number; }} range - The range of rows to render.
   */
  protected renderRows(range: { top: number; bottom: number; leftPx: number; rightPx: number }): void {
    const divArray: HTMLElement[] = [];
    const rows: number[] = [];
    let needToReselectCell = false;
    const dataLength = this.getDataLength();
    const mustRenderRows = new Set<number>();
    const renderingRows = new Set<number>();

    for (let i = range.top as number, ii = range.bottom as number; i <= ii; i++) {
      if (this.rowsCache[i]) {
        continue;
      }
      this.renderedRows++;
      rows.push(i);
      renderingRows.add(i);

      // Create an entry right away so that appendRowHtml() can start populating it.
      this.rowsCache[i] = this.createEmptyCachingRow();

      // add any rows that have rowspan intersects if it's not already in the list
      if (this._options.enableCellRowSpan) {
        const parentRowSpan = this.getRowSpanIntersect(i);
        if (parentRowSpan !== null) {
          renderingRows.add(parentRowSpan); // add to Set which will take care of duplicate rows
        }
      }

      this.appendRowHtml(divArray, i, range, dataLength);
      mustRenderRows.add(i);
      if (this.activeCellNode && this.activeRow === i) {
        needToReselectCell = true;
      }
      this.counter_rows_rendered++;
    }

    // check if there's any col/row span intersecting and if so add them to the renderingRows
    const mandatorySpanRows = this.setDifference(renderingRows, mustRenderRows);
    if (mandatorySpanRows.size > 0) {
      mandatorySpanRows.forEach((r) => {
        this.removeRowFromCache(r); // remove any previous element to avoid duplicates in DOM
        rows.push(r);
        this.rowsCache[r] = this.createEmptyCachingRow();
        this.appendRowHtml(divArray, r, range, dataLength);
      });
    }

    if (rows.length) {
      const x = document.createElement('div');
      divArray.forEach((elm) => x.appendChild(elm as HTMLElement));

      for (let i = 0, ii = rows.length; i < ii; i++) {
        if (this.rowsCache?.hasOwnProperty(rows[i]) && x.firstChild) {
          const row = rows[i];
          const rowNode = x.firstChild as HTMLElement;
          this.rowsCache[row].rowNode = [rowNode];
          const dockingBand = this.dockingByRow.get(row)?.band;
          (dockingBand && dockingBand !== 'center' ? this.ensureDockingOverlay() : this._canvasNode).appendChild(rowNode);
        }
      }

      if (needToReselectCell) {
        this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell);
      }
    }
  }

  /**
   * Iterates over each row in the rowsCache and updates the top position of the row’s DOM element
   * using the getRowTop calculation. Depending on the grid option, it either uses CSS transform
   * or sets the top property directly.
   */
  protected updateRowPositions(dockedOnly = false): void {
    if (this.rowsCache && typeof this.rowsCache === 'object') {
      Object.keys(this.rowsCache).forEach((row) => {
        const rowNumber = row ? parseInt(row, 10) : 0;
        if (dockedOnly && !this.dockingByRow.has(rowNumber)) {
          return;
        }
        this.rowsCache[rowNumber].rowNode!.forEach((rowNode) => {
          this.applyRowTopOffset(rowNode, rowNumber);
        });
      });
    }
  }

  /**
  * (re)Render the grid
  *
  * Main rendering method that first dequeues any pending scroll throttling, then obtains the visible and rendered ranges.
  * It removes rows no longer visible, calls cleanUpAndRenderCells and renderRows to render missing cells and new rows,
   * and, if pinned rows are present, renders their docking regions. It then sets post–processing boundaries, starts post–processing,
  * updates scroll positions, and triggers the onRendered event.
  */
  render(): void {
    if (this.initialized) {
      this.scrollThrottle.dequeue();
      if (this.rowDockingStale) {
        // A sort or filter can move referenced rows without changing the row count; re-resolve
        // ids to indexes and re-dock before the rows are rendered.
        this.rowDockingStale = false;
        this.refreshRowDockingLayout(this.scrollTop, true);
      }

      const visible = this.getVisibleRange();
      const rendered = this.getRenderedRange();

      // remove rows no longer in the viewport
      this.cleanupRows(rendered);

      // add new rows & missing cells in existing rows
      if (this.lastRenderedScrollLeft !== this.scrollLeft) {
        this.cleanUpAndRenderCells(rendered);
      }

      // render missing rows
      this.renderRows(rendered);

      for (const row of [...this.rowDockingLayout.top, ...this.rowDockingLayout.bottom]) {
        this.renderRows({ top: row.index, bottom: row.index, leftPx: rendered.leftPx, rightPx: rendered.rightPx });
      }

      this.postProcessFromRow = visible.top;
      this.postProcessToRow = Math.min(this.getDataLengthIncludingAddNew() - 1, visible.bottom);
      this.startPostProcessing();

      this.lastRenderedScrollTop = this.scrollTop;
      this.lastRenderedScrollLeft = this.scrollLeft;
      this.trigger(this.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: this });
    }
  }

  /**
   * Binds a capture-phase document listener so active-cell positions continue to
   * update when the grid is moved beneath a different scrollable ancestor.
   */
  protected bindAncestorScrollEvents(): void {
    this._bindingEventService.bind(
      document,
      'scroll',
      (event) => {
        const target = event.target;
        if (this._viewport.includes(target as HTMLDivElement) || (target instanceof Node && target.contains(this._container))) {
          this.handleActiveCellPositionChange();
        }
      },
      true
    );
  }

  /**
   * Chooses the scroll containers for horizontal and vertical scrolling.
   * The shared viewport handles vertical scrolling, while an optional docking scroller handles horizontal scrolling.
   */
  protected setScroller(): void {
    this._headerScrollContainer = this._headerScrollerL;
    this._headerRowScrollContainer = this._headerRowScrollerL;
    this._footerRowScrollContainer = this._footerRowScrollerL;
    this._viewportScrollContainerY = this._viewportNode;
    this._viewportScrollContainerX = this._dockingHorizontalScroller ?? this._viewportNode;

    // Expose the active horizontal scroll element through one stable selector.
    // The docking-specific class remains available for styling and diagnostics.
    this._viewportNode.classList.toggle('slick-horizontal-scroller', this._viewportScrollContainerX === this._viewportNode);
    this._dockingHorizontalScroller?.classList.toggle(
      'slick-horizontal-scroller',
      this._viewportScrollContainerX === this._dockingHorizontalScroller
    );
    this._viewportScrollContainerY.classList.add('slick-vertical-scroller');
  }

  /**
   * Map a virtual page index to its render offset in scroll-container space.
   * First and last pages are pinned to container edges; interior pages are spread
   * evenly between them to avoid browser edge clamping/jank near boundaries.
   */
  protected getPageOffset(page: number): number {
    if (this.n <= 1 || page <= 0) {
      return 0;
    }

    const lastOffset = Math.max(0, this.th - this.h);
    if (page >= this.n - 1) {
      return lastOffset;
    }

    // With no interior pages, keep legacy linear mapping.
    if (this.n <= 3 || lastOffset <= 0) {
      return Math.round(page * (this.cj || 0));
    }

    return Math.round(((page - 1) * lastOffset) / (this.n - 3));
  }

  /**
   * Infer page index from large-scale scroll movement in container space.
   * This mirrors page pinning logic used by getPageOffset().
   */
  protected getPageFromLargeScrollDelta(scrollTop: number): number {
    if (this.n <= 1 || this.ph <= 0 || this.h <= this.viewportH || scrollTop < this.ph) {
      return 0;
    }

    if (scrollTop >= this.h - this.ph) {
      return this.n - 1;
    }

    // With no interior pages, keep legacy page selection behavior.
    if (this.n <= 3 || this.h <= this.ph * 2) {
      return Math.min(this.n - 1, Math.floor(scrollTop / this.ph));
    }

    const scaleFactor = (this.th - this.ph * 2) / (this.h - this.ph * 2);
    return Math.min(this.n - 3, Math.floor(((scrollTop - this.ph) * scaleFactor) / this.ph)) + 1;
  }

  /**
   * Scroll to a Y position in the grid (clamped to valid bounds)
   *
   * Updates internal offsets, recalculates the visible range, cleans up rows outside the viewport,
   * updates row positions, and triggers the onViewportChanged event.
   *
   * @param {Number} y
   */
  scrollTo(y: number): void {
    y = Math.max(y, 0);
    y = Math.min(
      y,
      (this.th || 0) -
        (Utils.height(this._viewportScrollContainerY) as number) +
        (this.viewportHasHScroll && !this.hasDockingHorizontalScroller() ? this.scrollbarDimensions?.height || 0 : 0)
    );

    const oldOffset = this.offset;
    // determine the page for the target position first, then derive the offset from that page
    // (computing the offset from the previous page would lag one scroll event behind on jumps)
    this.page = this.ph ? Math.min((this.n || 0) - 1, Math.floor(y / this.ph)) : 0;
    this.offset = this.getPageOffset(this.page);
    const newScrollTop = (y - this.offset) as number;

    if (this.offset !== oldOffset) {
      const range = this.getVisibleRange(newScrollTop);
      this.cleanupRows(range);
    }

    // Read the committed scroll position back: the browser may clamp it, and a stale
    // requested value leaves the virtual rows one position ahead of the DOM.
    if (this._viewportScrollContainerY) {
      this._viewportScrollContainerY.scrollTop = newScrollTop;
    }
    const committedScrollTop = this._viewportScrollContainerY?.scrollTop ?? newScrollTop;

    if (this.prevScrollTop !== committedScrollTop) {
      this.vScrollDir = this.prevScrollTop + oldOffset < committedScrollTop + this.offset ? 1 : -1;
      this.scrollTop = this.prevScrollTop = committedScrollTop;

      if (this.hasDockedColumns() || this.rowDockingLayout.bottom.length > 0) {
        this._viewportNode.scrollTop = committedScrollTop;
      }

      this.trigger(this.onViewportChanged, {});
    }

    // Position rows only after both the page offset and the physical scroll position
    // are committed, otherwise docked rows flash at virtual-page boundaries.
    if (this.offset !== oldOffset) {
      this.updateRowPositions();
    }
  }

  /** Synchronizes header-row horizontal scrolling with the main grid viewport. */
  protected handleHeaderRowScroll(e?: Event): void {
    this.handleElementScroll((e?.currentTarget || e?.target || this._headerRowScrollContainer) as HTMLElement);
  }

  /** Synchronizes footer-row horizontal scrolling with the main grid viewport. */
  protected handleFooterRowScroll(e?: Event): void {
    this.handleElementScroll((e?.currentTarget || e?.target || this._footerRowScrollContainer) as HTMLElement);
  }

  /** Invokes handleElementScroll for the pre–header panel scroller to synchronize its
   * horizontal scroll position with the main viewport.
   */
  protected handlePreHeaderPanelScroll(e?: Event): void {
    this.handleElementScroll((e?.currentTarget || e?.target || this._preHeaderPanelScroller) as HTMLElement);
  }

  /**
   * Invokes handleElementScroll for the top–header panel scroller to synchronize its horizontal
   * scroll position with the main viewport.
   */
  protected handleTopHeaderPanelScroll(e?: Event): void {
    this.handleElementScroll((e?.currentTarget || e?.target || this._topHeaderPanelScroller) as HTMLElement);
  }

  /**
   * Given a DOM element, checks its scrollLeft value and, if it differs from the viewport scroll
   * container’s scrollLeft, updates the latter to match.
   *
   * @param {HTMLElement} element - The element whose scroll position needs to be synced.
   */
  protected handleElementScroll(element: HTMLElement): void {
    if (this.hasDockingHorizontalScroller()) {
      // The proxy owns horizontal scrolling. A native offset on a chrome container is forwarded as a
      // delta; the reset-to-zero echo that follows must not be mirrored as an absolute position.
      this.forwardDockingHorizontalScroll(element);
      return;
    }
    const scrollLeft = element.scrollLeft;
    if (scrollLeft !== this._viewportScrollContainerX.scrollLeft) {
      this._viewportScrollContainerX.scrollLeft = scrollLeft;
    }
  }

  /**
   * Called when the grid’s main scroll container scrolls. Updates internal scroll properties (scrollHeight,
   * scrollTop, scrollLeft) from the container, then calls _handleScroll (with an argument
   * indicating whether the event came from a system event or a mousewheel).
   * Returns the result of _handleScroll.
   *
   * @param {Event} [e] - The scroll event.
   * @returns {boolean} The result of `_handleScroll`.
   */
  protected handleScroll(e?: Event): boolean {
    const scrollSource = e?.target instanceof HTMLElement ? e.target : null;
    if (this.hasDockingHorizontalScroller()) {
      this.forwardDockingHorizontalScroll(scrollSource);
      this.clearDockingNativeHorizontalScrollOffsets();
    }
    this.scrollHeight = this._viewportScrollContainerY.scrollHeight;
    this.scrollTop = this._viewportScrollContainerY.scrollTop;
    this.scrollLeft = this._viewportScrollContainerX.scrollLeft;
    const handled = this._handleScroll(e ? 'scroll' : 'system');
    // Reapply transforms even when the numeric offset is unchanged after a
    // route transition or explicit reset.
    if (this.hasDockingHorizontalScroller() && !handled) {
      this.scrollToX(this.scrollLeft);
    }
    return handled;
  }

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
  protected _handleScroll(eventType: 'mousewheel' | 'scroll' | 'system' = 'system'): boolean {
    let maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight;
    let maxScrollDistanceX = this._viewportScrollContainerX.scrollWidth - this._viewportScrollContainerX.clientWidth;

    // Protect against erroneous clientHeight/Width greater than scrollHeight/Width.
    // Sometimes seen in Chrome.
    maxScrollDistanceY = Math.max(0, maxScrollDistanceY);
    maxScrollDistanceX = Math.max(0, maxScrollDistanceX);

    // Ceiling the max scroll values
    if (this.scrollTop > maxScrollDistanceY) {
      this.scrollTop = maxScrollDistanceY;
      this.scrollHeight = maxScrollDistanceY;
    }
    if (this.scrollLeft > maxScrollDistanceX) {
      this.scrollLeft = maxScrollDistanceX;
    }
    // A horizontal wheel can push scrollTop below zero. A negative scrollLeft is the
    // native RTL coordinate and is kept.
    if (this.scrollTop < 0) {
      this.scrollTop = 0;
    }
    if (this.scrollLeft < 0 && !this._options.rtl) {
      this.scrollLeft = 0;
    }

    const vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop);
    const hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);

    if (hScrollDist) {
      this.prevScrollLeft = this.scrollLeft;

      if (this.hasStickyColumns()) {
        // Keep the compositor path synchronous and defer sticky-band
        // membership changes so rapid horizontal scrolling is not blocked by
        // repeated resolver/render work.
        this.enqueueStickyColumnLayout();
      }

      // adjust scroll position of all div containers when scrolling the grid
      this.scrollToX(this.scrollLeft);
      this.applyDockingScrollOffsets();
    }

    // autoheight suppresses vertical scrolling, but editors can create a div larger than
    // the row vertical size, which can lead to a vertical scroll bar appearing temporarily
    // while the editor is displayed. this is not part of the grid scrolling, so we should ignore it
    if (vScrollDist && !this._options.autoHeight) {
      this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1;
      this.prevScrollTop = this.scrollTop;

      if (eventType === 'mousewheel') {
        this._viewportScrollContainerY.scrollTop = this.scrollTop;
      }

      this._viewportScrollContainerY.scrollTop = this.scrollTop;

      // switch virtual pages if needed
      if (vScrollDist < this.viewportH) {
        this.scrollTo(this.scrollTop + this.offset);
      } else {
        this.page = this.getPageFromLargeScrollDelta(this.scrollTop);
        this.offset = this.getPageOffset(this.page);
      }
    }

    if (vScrollDist) {
      this.refreshRowDockingLayout(this.scrollTop);
    }

    if (hScrollDist || vScrollDist) {
      const dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft);
      const dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
      // A single viewport has a full viewport-width horizontal cell buffer.
      // Consume most of it before recycling virtual cells so scrollbar-arrow
      // repeats stay on the native compositor path between renders.
      const horizontalRenderThreshold = this.viewportW * 0.8;
      if (dx > horizontalRenderThreshold || dy > 20) {
        if (this._isResizingColumn && hScrollDist && !vScrollDist) {
          this.lastRenderedScrollLeft = this.scrollLeft;
          this.trigger(this.onViewportChanged, {});
          return true;
        }

        // Keep the horizontal compositor transform ahead of expensive virtual
        // cell work in the single-viewport layout. A synchronous render here

        // can block the next paint while the native body scroll has already
        // advanced, making headers visibly trail the cells during fast scrolls.
        if (hScrollDist) {
          this.enqueueSingleViewportRender();
        } else if (this._options.forceSyncScrolling || (dy < this.viewportH && dx < this.viewportW)) {
          this.render();
        } else {
          // otherwise, perform "difficult" renders at a capped frequency
          this.scrollThrottle.enqueue();
        }

        this.trigger(this.onViewportChanged, {});
      }
    }

    this.trigger(this.onScroll, {
      triggeredBy: eventType,
      scrollHeight: this.scrollHeight,
      scrollLeft: this.scrollLeft,
      scrollTop: this.scrollTop,
    });

    if (hScrollDist || vScrollDist) {
      return true;
    }
    return false;
  }

  /** Scroll to a specific cell and make it into the view
  *
  * First calls scrollRowIntoView for the row. If the cell is not docked,
  * calculates the cell’s colspan and then calls internalScrollColumnIntoView with the
  * cell’s left and right boundaries.
  */
  scrollCellIntoView(row: number, cell: number, doPaging?: boolean): void {
    this.scrollRowIntoView(row, doPaging);

    const docking = this.dockingByColumn.get(cell);
    const isPermanentPinnedColumn = docking && docking.band !== 'center' && !docking.sticky;
    // Sticky columns must reveal their natural position before keyboard navigation
    // activates them; permanent pins are already visible.
    if (!isPermanentPinnedColumn && (docking?.sticky || docking?.band === 'center')) {
      const colspan = this.getColspan(row, cell);
      const lastCell = cell + (colspan > 1 ? colspan - 1 : 0);
      const { left, right } = this.getNaturalColumnRange(cell, lastCell);
      this.internalScrollColumnIntoView(left, right);
    }
  }

  /**
   * Checks if the given left/right pixel boundaries are outside the current
   * horizontal scroll position of the viewport container.
   * If so, adjusts scrollLeft appropriately and triggers a re–render.
   *
   * @param left
   * @param right
   */
  protected internalScrollColumnIntoView(left: number, right: number): void {
    const usesDynamicDockingBounds = this.hasDockedColumns();
    const leftDockedWidth = usesDynamicDockingBounds ? this.dockingLayout.leftWidth : this.dockingLayout.leftBaseWidth;
    const rightDockedWidth = usesDynamicDockingBounds ? this.dockingLayout.rightWidth : this.dockingLayout.rightBaseWidth;
    // clientWidth already excludes a vertical scrollbar, in both the proxy and the native
    // scroll-owner modes. Measuring the border box and subtracting the scrollbar separately
    // took it off twice in proxy mode, where the proxy is sized to the inner width.
    const viewportWidth = this._viewportScrollContainerX.clientWidth;
    const availableWidth = Math.max(0, viewportWidth - leftDockedWidth - rightDockedWidth);
    const visibleStart = this.scrollLeft + leftDockedWidth;
    const scrollRight = this.scrollLeft + leftDockedWidth + availableWidth;

    if (left < visibleStart) {
      this._viewportScrollContainerX.scrollLeft = Math.max(0, left - leftDockedWidth);
      this.handleScroll();
      this.render();
    } else if (right > scrollRight) {
      this._viewportScrollContainerX.scrollLeft = Math.max(0, Math.min(left, right - availableWidth - leftDockedWidth));
      this.handleScroll();
      this.render();
    }
  }

  /**
   * Scroll to a specific column and show it into the viewport
   * @param {Number} cell - cell column number
   */
  scrollColumnIntoView(cell: number): void {
    if (this.getColumnDockingBand(cell) === 'center') {
      const { left, right } = this.getNaturalColumnRange(cell);
      this.internalScrollColumnIntoView(left, right);
    }
  }

  /**
   * Update paging information status from the View
   * @param {PagingInfo} pagingInfo
   */
  updatePagingStatusFromView(pagingInfo: Pick<PagingInfo, 'pageSize' | 'pageNum' | 'totalPages'>): void {
    this.pagingActive = pagingInfo.pageSize !== 0;
    this.pagingIsLastPage = pagingInfo.pageNum === pagingInfo.totalPages - 1;
  }

  /**
   * from a row number, return any column indexes that intersected with the grid row including the cell
   * @param {Number} row - grid row index
   */
  getRowSpanColumnIntersects(row: number): number[] {
    return this.getRowSpanIntersection<number[]>(row, 'columns');
  }

  /**
  * from a row number, verify if the rowspan is intersecting and return it when found,
  * otherwise return `null` when nothing is found or when the rowspan feature is disabled.
  * @param {Number} row - grid row index
  */
  getRowSpanIntersect(row: number): number | null {
    return this.getRowSpanIntersection<number | null>(row);
  }

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
  protected getRowSpanIntersection<R>(row: number, outputType?: 'columns' | 'start'): R {
    const columnIntersects: number[] = [];
    let rowStartIntersect = null;

    for (let col = 0, cln = this.columns.length; col < cln; col++) {
      const rmeta = this._colsWithRowSpanCache[col];
      if (rmeta) {
        for (const range of Array.from(rmeta)) {
          const [start, end] = range.split(':').map(Number);
          if (row >= start && row <= end) {
            if (outputType === 'columns') {
              columnIntersects.push(col);
            } else {
              rowStartIntersect = start;
              break;
            }
          }
        }
      }
    }
    return (outputType === 'columns' ? columnIntersects : rowStartIntersect) as R;
  }

  /**
   * Returns the parent rowspan details when child cell are spanned from a rowspan or `null` when it's not spanned.
   * By default it will exclude the parent cell that holds the rowspan, and return `null`, that initiated the rowspan unless the 3rd argument is disabled.
   * The exclusion is helpful to find out when we're dealing with a child cell of a rowspan
   * @param {Number} row - grid row index
   * @param {Number} cell - grid cell/column index
   * @param {Boolean} [excludeParentRow] - should we exclude the parent who initiated the rowspan in the search (defaults to true)?
   */
  getParentRowSpanByCell(row: number, cell: number, excludeParentRow = true): { start: number; end: number; range: string } | null {
    let spanDetail = null;
    const rowspanRange = this._colsWithRowSpanCache[cell] || new Set<string>();

    for (const range of Array.from(rowspanRange)) {
      const [start, end] = range.split(':').map(Number);
      const startCondition = excludeParentRow ? row > start : row >= start;
      if (startCondition && row <= end) {
        spanDetail = { start, end, range };
        break;
      }
    }

    return spanDetail;
  }

  /**
   * Remap all the rowspan metadata by looping through all dataset rows and keep a cache of rowspan by column indexes
   * For example:
   *  1- if 2nd row of the 1st column has a metadata.rowspan of 3 then the cache will be: `{ 0: '1:4' }`
   *  2- if 2nd row if the 1st column has a metadata.rowspan of 3 AND a colspan of 2 then the cache will be: `{ 0: '1:4', 1: '1:4' }`
   */
  remapAllColumnsRowSpan(): void {
    const ln = this.getDataLength();
    if (ln > 0) {
      this._colsWithRowSpanCache = {};
      for (let row = 0; row < ln; row++) {
        this.remapRowSpanMetadataByRow(row);
      }

      this._rowSpanIsCached = true;
    }
  }

  /**
   * Remaps row span metadata for a given row by iterating through its column metadata.
   * Calls `remapRowSpanMetadata` for each column to update row span information.
   *
   * @param {number} row - The row index for which to remap row span metadata.
   */
  protected remapRowSpanMetadataByRow(row: number): void {
    const colMeta = this.getItemMetadaWhenExists(row);
    if (colMeta?.columns) {
      Object.keys(colMeta.columns).forEach((col) => {
        const colIdx = +col;
        if (this.columns[colIdx] && !this.columns[colIdx].hidden) {
          const columnMeta = colMeta.columns![colIdx];
          const colspan = +(columnMeta?.colspan || 1);
          const rowspan = +(columnMeta?.rowspan || 1);
          this.remapRowSpanMetadata(row, colIdx, colspan, rowspan);
        }
      });
    }
  }

  /**
   * Updates the row span metadata for a given row and cell.
   * If a cell spans multiple rows, it records the span in `_colsWithRowSpanCache`.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} colspan - The number of columns the cell spans.
   * @param {number} rowspan - The number of rows the cell spans.
   */
  protected remapRowSpanMetadata(row: number, cell: number, colspan: number, rowspan: number): void {
    if (rowspan > 1) {
      const rspan = `${row}:${row + rowspan - 1}`;
      this._colsWithRowSpanCache[cell] ??= new Set();
      this._colsWithRowSpanCache[cell].add(rspan);
      if (colspan > 1) {
        for (let i = 1; i < colspan; i++) {
          this._colsWithRowSpanCache[cell + i] ??= new Set();
          this._colsWithRowSpanCache[cell + i].add(rspan);
        }
      }
    }
  }

  /** Finds the first column whose cached right edge is at or beyond the supplied pixel. */
  protected getFirstColumnIndexAtOrAfter(leftPx: number): number {
    let low = 0;
    let high = this.columnPosRight.length;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (this.columnPosRight[mid] <= leftPx) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  /**
   * Creates an empty row caching object to store metadata about rendered row elements.
   * Used to optimize cell rendering and access within the grid.
   */
  protected createEmptyCachingRow(): RowCaching {
    return {
      rowNode: null,

      // ColSpans of rendered cells (by column idx).
      // Can also be used for checking whether a cell has been rendered.
      cellColSpans: [],


      // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
      cellNodesByColumnIdx: [],

      // Column indices of cell nodes that have been rendered, but not yet indexed in
      // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
      // end of the row.
      cellRenderQueue: [],

      // Continuation fragments for colspans crossing docking bands, keyed by host cell.
      cellSpanFragments: {},
      cellSpanSegments: {},
    };
  }

  /**
   * Scroll to a specific row and make it into the view
   * @param {Number} row - grid row number
   * @param {Boolean} doPaging - scroll when pagination is enabled
   */
  scrollRowIntoView(row: number, doPaging?: boolean): void {
    const dockingBand = this.dockingByRow.get(row)?.band;
    if (!this.isPinnedRowIdx(row) && (dockingBand === undefined || dockingBand === 'center')) {
      // Use the scroll owner's inner height: clientHeight excludes a horizontal
      // scrollbar, which is not usable row space.
      const viewportScrollH = Math.max(
        0,
        this._viewportScrollContainerY.clientHeight - this.rowDockingLayout.topHeight - this.rowDockingLayout.bottomHeight
      );

      const rowAtTop = this.getRenderedRowTop(row) + this.offset - this.rowDockingLayout.topHeight;
      const rowBottomPosition = rowAtTop + this.getRowHeight(row);
      const rowAtBottom = rowBottomPosition - viewportScrollH;

      // need to page down?
      if (rowBottomPosition > this.scrollTop + viewportScrollH + this.offset) {
        this.scrollTo(doPaging ? rowAtTop : rowAtBottom);
        this.render();
      }
      // or page up?
      else if (rowAtTop < this.scrollTop + this.offset) {
        this.scrollTo(doPaging ? rowAtBottom : rowAtTop);
        this.render();
      }
    }
  }

  /**
   * Scroll to the top row and make it into the view
   * @param {Number} row - grid row number
   */
  scrollRowToTop(row: number): void {
    const rowAtTop = this.getRowPosition(row) - this.getTopPinnedRowsHeight();
    this.scrollTo(rowAtTop);
    this.render();
  }

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
  protected scrollPage(dir: number): void {
    const deltaRows = dir * this.numVisibleRows;
    /// First fully visible row crosses the line with
    /// y === bottomOfTopmostFullyVisibleRow
    const bottomOfTopmostFullyVisibleRow = this.scrollTop + this.getRowHeight() - 1;
    this.scrollTo(this.getRowPosition(this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows));
    this.render();

    if (this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
      let row = this.activeRow + deltaRows;
      const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      if (row >= dataLengthIncludingAddNew) {
        row = dataLengthIncludingAddNew - 1;
      }
      if (row < 0) {
        row = 0;
      }

      // use the gotoDown/Up but cancel its row move to activate same row
      // (i.e.: gotoDown(row - 1) will go to same row if it can be activated or next one down).
      // We do this in order to find the next cell that can be activated which can be much further away (i.e. rowspan)
      const pos =
        dir === 1
          ? this.gotoDown(row - 1 || 0, this.activeCell, this.activePosY, this.activePosX)
          : this.gotoUp(row + 1, this.activeCell, this.activePosY, this.activePosX);
      this.navigateToPos(pos);
    }
  }

  /** Navigate (scroll) by a page down */
  navigatePageDown(): void {
    this.unsetActiveCell();
    this.scrollPage(1);
  }

  /** Navigate (scroll) by a page up */
  navigatePageUp(): void {
    this.unsetActiveCell();
    this.scrollPage(-1);
  }

  /** Navigate to the top of the grid */
  navigateTop(): void {
    this.unsetActiveCell();
    this.navigateToRow(0);
  }

  /** Navigate to the bottom of the grid */
  navigateBottom(): void {
    const row = this.getDataLength() - 1;
    let tmpRow = this.getParentRowSpanByCell(row, this.activeCell)?.start ?? row;

    do {
      if (this._options.enableCellRowSpan) {
        this.setActiveRow(tmpRow);
      }
      const isValidMode = this.navigateToRow(tmpRow);
      if ((isValidMode && this.activeCell === this.activePosX) || !Utils.isDefined(this.activeCell)) {
        break;
      }
    } while (--tmpRow > 0);
  }

  /**
   * Navigates to a specified row, ensuring it is visible and selecting an active cell if applicable.
   * Adjusts the scroll position and updates the active cell based on cell navigation rules.
   *
   * @param {number} row - The row index to navigate to.
   * @returns {boolean} Whether the navigation was successful.
   */
  navigateToRow(row: number): boolean {
    const num_rows = this.getDataLength();
    if (!num_rows) {
      return false;
    }

    /* v8 ignore next */
    if (row < 0) {
      row = 0;
    } else if (row >= num_rows) {
      row = num_rows - 1;
    }

    this.scrollCellIntoView(row, 0, true);
    let isValidMove = !Utils.isDefined(this.activeCell) || !Utils.isDefined(this.activeRow);

    if (this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
      let cell = 0;
      let prevCell: number | null = null;
      const prevActivePosX = this.activePosX;
      while (cell <= this.activePosX) {
        if (this.canCellBeActive(row, cell)) {
          prevCell = cell;
          if (!Utils.isDefined(this.activeCell) || cell === this.activeCell) {
            isValidMove = true;
          }
        }
        cell += this.getColspan(row, cell);
      }


      if (prevCell !== null) {
        this.setActiveCellInternal(this.getCellNode(row, prevCell));
        this.activePosX = prevActivePosX;
      } else {
        this.resetActiveCell();
      }
    }
    return isValidMove;
  }

  /**
   * Retrieves the colspan for a specified cell in a row, determining how many columns it spans.
   * Uses column metadata to derive the correct colspan value.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @returns {number} The number of columns the cell spans.
   */
  protected getColspan(row: number, cell: number): number {
    const metadata = this.getItemMetadaWhenExists(row);
    if (!metadata || !metadata.columns || this.columns[cell]?.hidden) {
      return 1;
    }

    if (cell >= this.columns.length) {
      cell = this.columns.length - 1;
    }
    let isFullColspan = false;
    const columnData = metadata.columns[this.columns[cell].id] || metadata.columns[cell];
    let colspan = columnData?.colspan;
    if (colspan === '*') {
      isFullColspan = true;
      colspan = this.columns.length - cell;
    } else {
      colspan = colspan || 1;
    }

    if (!isFullColspan && this._options.spreadHiddenColspan) {
      return this.increaseHiddenColspan(colspan as number, cell);
    }

    return colspan as number;
  }

  /**
   * Increments an internal group id and, for each column in the provided postProcessedRow object,
   * queues a cleanup action (action type 'C') for that cell. It also queues a cleanup action for the
   * entire row (action type 'R') and removes all row nodes from the DOM.
   *
   * @param {RowCaching} cacheEntry - The cache entry for the row.
   * @param {any} postProcessedRow - The object containing post-processed row data.
   * @param {number} rowIdx - The index of the row being processed.
   */
  protected queuePostProcessedRowForCleanup(cacheEntry: RowCaching, postProcessedRow: any, rowIdx: number): void {
    this.postProcessgroupId++;

    // store and detach node for later async cleanup
    if (typeof postProcessedRow === 'object') {
      Object.keys(postProcessedRow).forEach((columnIdx) => {
        if (postProcessedRow.hasOwnProperty(columnIdx)) {
          this.postProcessedCleanupQueue.push({
            actionType: 'C',
            groupId: this.postProcessgroupId,
            node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
            columnIdx: +columnIdx,
            rowIdx,
          });
        }
      });
    }

    /* v8 ignore if */
    if (!cacheEntry.rowNode) {
      cacheEntry.rowNode = [];
    }
    this.postProcessedCleanupQueue.push({
      actionType: 'R',
      groupId: this.postProcessgroupId,
      node: cacheEntry.rowNode as HTMLElement[],
    });
    cacheEntry.rowNode?.forEach((node) => node.remove());
  }


  /* v8 ignore next */
  /**
   * Queues a cleanup action (action type 'C') for the provided cell DOM element and
   * immediately removes the cell element from the DOM.
   *
   * @param {HTMLElement} cellnode - The DOM element representing the cell.
   * @param {number} columnIdx - The column index of the cell.
   * @param {number} rowIdx - The row index of the cell.
   */
  protected queuePostProcessedCellForCleanup(cellnode: HTMLElement, columnIdx: number, rowIdx: number): void {
    this.postProcessedCleanupQueue.push({
      actionType: 'C',
      groupId: this.postProcessgroupId,
      node: cellnode,
      columnIdx,
      rowIdx,
    });
    cellnode.remove();
  }

  /** Apply a Formatter Result to a Cell DOM Node
  *
  * If the formatter result is not an object, it is applied directly as HTML/text;
  * otherwise, it extracts the content (from a property such as “html” or “text”) and applies it.
  * Additionally, it conditionally removes or adds CSS classes and sets a tooltip on the cell.
  */
  applyFormatResultToCellNode(
    formatterResult: FormatterResultWithHtml | FormatterResultWithText | string | HTMLElement | DocumentFragment,
    cellNode: HTMLElement,
    suppressRemove?: boolean
  ): void {
    if (formatterResult === null || formatterResult === undefined) {
      formatterResult = '';
    }
    if (isPrimitiveOrHTML(formatterResult)) {
      this.applyHtmlCode(cellNode, formatterResult as string | HTMLElement);
      return;
    }

    const formatterVal: HTMLElement | DocumentFragment | string =
      (formatterResult as FormatterResultWithHtml).html || (formatterResult as FormatterResultWithText).text;
    this.applyHtmlCode(cellNode, formatterVal);

    if ((formatterResult as FormatterResultObject).removeClasses && !suppressRemove) {
      cellNode.classList.remove(...Utils.classNameToList((formatterResult as FormatterResultObject).removeClasses));
    }
    if ((formatterResult as FormatterResultObject).addClasses) {
      cellNode.classList.add(...Utils.classNameToList((formatterResult as FormatterResultObject).addClasses));
    }
    if ((formatterResult as FormatterResultObject).toolTip) {
      cellNode.setAttribute('title', (formatterResult as FormatterResultObject).toolTip!);
    }
  }

  /**
   * If asynchronous post–rendering is enabled, clears any existing post–render timer and sets a new timeout
   * to call asyncPostProcessRows after the configured delay.
   *
   * @returns {void}
   */
  protected startPostProcessing(): void {
    if (this._options.enableAsyncPostRender) {
      clearTimeout(this.h_postrender);
      this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
    }
  }

  /**
   * If asynchronous post–render cleanup is enabled, clears any existing cleanup timer and
   * sets a new timeout to call asyncPostProcessCleanupRows after the configured delay.
   *
   * @returns {void}
   */
  protected startPostProcessingCleanup(): void {
    if (this._options.enableAsyncPostRenderCleanup) {
      clearTimeout(this.h_postrenderCleanup);
      this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
    }
  }

  /**
   * For the specified row, if post–processed results exist, sets each column’s status to “C” (indicating cleanup is needed),
   * adjusts the postProcessFromRow and postProcessToRow boundaries, and starts the post–processing timer.
   *
   * @param {number} row - The index of the row to invalidate.
   */
  protected invalidatePostProcessingResults(row: number): void {
    // change status of columns to be re-rendered
    if (typeof this.postProcessedRows[row] === 'object') {
      Object.keys(this.postProcessedRows[row]).forEach((columnIdx) => {
        if (this.postProcessedRows[row].hasOwnProperty(columnIdx)) {
          this.postProcessedRows[row][columnIdx] = 'C';
        }
      });
    }
    this.postProcessFromRow = Math.min(this.postProcessFromRow as number, row);
    this.postProcessToRow = Math.max(this.postProcessToRow as number, row);
    this.startPostProcessing();
  }

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
  protected asyncPostProcessRows(): void {
    const dataLength = this.getDataLength();
    while (this.postProcessFromRow <= this.postProcessToRow) {
      const row = this.vScrollDir >= 0 ? this.postProcessFromRow++ : this.postProcessToRow--;
      const cacheEntry = this.rowsCache[row];
      if (!cacheEntry || row >= dataLength) {
        continue;
      }

      if (!this.postProcessedRows[row]) {
        this.postProcessedRows[row] = {};
      }

      this.ensureCellNodesInRowsCache(row);
      Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((colIdx) => {
        if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
          const columnIdx = +colIdx;
          const m = this.columns[columnIdx];
          const processedStatus = this.postProcessedRows[row][columnIdx]; // C=cleanup and re-render, R=rendered
          if (m.asyncPostRender && processedStatus !== 'R') {
            const node = cacheEntry.cellNodesByColumnIdx[columnIdx];
            if (node) {
              m.asyncPostRender(node, row, this.getDataItem(row), m, processedStatus === 'C');
            }
            this.postProcessedRows[row][columnIdx] = 'R';
          }
        }
      });

      this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
      return;
    }
  }

  /**
   * Checks if there are cleanup queue entries; if so, it retrieves the group id from the first entry and processes
   * (removes) all entries in the queue with that group id. For each entry, if the action type is “R”,
   * it removes all nodes in the array; if “C”, it calls the asyncPostRenderCleanup callback on the
   * corresponding column. It then schedules another cleanup cycle using the configured delay.
   */
  protected asyncPostProcessCleanupRows(): void {
    if (this.postProcessedCleanupQueue.length > 0) {
      const groupId = this.postProcessedCleanupQueue[0].groupId;

      // loop through all queue members with this groupID
      while (this.postProcessedCleanupQueue.length > 0 && this.postProcessedCleanupQueue[0].groupId === groupId) {
        const entry = this.postProcessedCleanupQueue.shift();
        if (entry?.actionType === 'R') {
          (entry.node as HTMLElement[]).forEach((node) => {
            node.remove();
          });
        }
        if (entry?.actionType === 'C') {
          const column = this.columns[entry.columnIdx as number];
          if (column.asyncPostRenderCleanup && entry.node) {
            // cleanup must also remove element
            column.asyncPostRenderCleanup(entry.node as HTMLDivElement, entry.rowIdx as number, column);
          }
        }
      }

      // call this function again after the specified delay
      this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
    }
  }

  /**
   * Iterates over every row in the rows cache. For each row, if there is a removed hash (previous CSS classes)
   * and/or an added hash (new CSS classes), then for each column key it retrieves the cell node and removes any
   * CSS class from the removed hash (if not re–added) and adds CSS classes from the added hash.
   * This synchronises the cell CSS overlays with the provided hash changes.
   *
   * @param {CssStyleHash | null} [addedHash] - A hash of CSS styles to be added.
   * @param {CssStyleHash | null} [removedHash] - A hash of CSS styles to be removed.
   */
  protected updateCellCssStylesOnRenderedRows(addedHash?: CssStyleHash | null, removedHash?: CssStyleHash | null): void {
    let node: HTMLElement | null;
    let addedRowHash: any;
    let removedRowHash: any;
    if (typeof this.rowsCache === 'object') {
      Object.keys(this.rowsCache).forEach((row) => {
        if (this.rowsCache) {
          removedRowHash = removedHash?.[row];
          addedRowHash = addedHash?.[row];

          if (removedRowHash) {
            Object.keys(removedRowHash).forEach((columnId) => {
              if (!addedRowHash || removedRowHash![columnId] !== addedRowHash[columnId]) {
                const cell = this.getColumnIndex(columnId);
                node = this.getCellNode(+row, cell);
                if (node) {
                  const classes = Utils.classNameToList(removedRowHash[columnId]);
                  node.classList.remove(...classes);
                  this.rowsCache[+row]?.cellSpanFragments?.[cell]?.forEach((fragment) => fragment.classList.remove(...classes));
                }
              }
            });
          }

          if (addedRowHash) {
            Object.keys(addedRowHash).forEach((columnId) => {
              if (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) {
                const cell = this.getColumnIndex(columnId);
                node = this.getCellNode(+row, cell);
                if (node) {
                  const classes = Utils.classNameToList(addedRowHash[columnId]);
                  node.classList.add(...classes);
                  this.rowsCache[+row]?.cellSpanFragments?.[cell]?.forEach((fragment) => fragment.classList.add(...classes));
                }
              }
            });
          }
        }
      });
    }
  }

  /** Merges the keyed CSS overlays once on update, rather than for every rendered cell. */
  protected updateCellCssClassesByCell(): void {
    this.cellCssClassesByCell = Object.create(null);

    Object.values(this.cellCssClasses).forEach((hash) => {
      Object.entries(hash).forEach(([row, cellClasses]) => {
        const mergedRowClasses = (this.cellCssClassesByCell[row] ??= Object.create(null));
        Object.entries(cellClasses).forEach(([columnId, cssClasses]) => {
          if (cssClasses) {
            mergedRowClasses[columnId] = mergedRowClasses[columnId] ? `${mergedRowClasses[columnId]} ${cssClasses}` : cssClasses;
          }
        });
      });
    });
  }

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
  addCellCssStyles(key: string, hash: CssStyleHash): void {
    if (this.cellCssClasses[key]) {
      throw new Error(`SlickGrid addCellCssStyles: cell CSS hash with key "${key}" already exists.`);
    }

    this.cellCssClasses[key] = hash;
    this.updateCellCssClassesByCell();
    this.updateCellCssStylesOnRenderedRows(hash, null);
    this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
  }

  /**
   * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
   * @param {String} key A string key.
   */
  removeCellCssStyles(key: string): void {
    if (this.cellCssClasses[key]) {
      this.updateCellCssStylesOnRenderedRows(null, this.cellCssClasses[key]);
      delete this.cellCssClasses[key];
      this.updateCellCssClassesByCell();
      this.trigger(this.onCellCssStylesChanged, { key, hash: null, grid: this });
    }
  }

  /**
   * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash). key is name for this set of styles so you can reference it later - to modify it or remove it, for example. hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
   * Suppose you have a grid with columns:
   * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
   * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).
   * @param {String} key A string key. Will overwrite any data already associated with this key.
   * @param {Object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
   */
  setCellCssStyles(key: string, hash: CssStyleHash): void {
    const prevHash = this.cellCssClasses[key];
    this.cellCssClasses[key] = hash;
    this.updateCellCssClassesByCell();
    this.updateCellCssStylesOnRenderedRows(hash, prevHash);
    this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
  }

  /**
   * Accepts a key name, returns the group of CSS styles defined under that name. See setCellCssStyles for more info.
   * @param {String} key A string.
   */
  getCellCssStyles(key: string): CssStyleHash {
    return this.cellCssClasses[key];
  }

  /** Returns whether a cell is included in the current selectable ranges. */
  protected isCellSelected(row: number, cell: number): boolean {
    return (
      !!this._options.selectedCellCssClass &&
      this.selectedRanges.some((range) => range.contains(row, cell)) &&
      this.canCellBeSelected(row, cell)
    );
  }

  /**
   * Flashes the cell twice by toggling the CSS class 4 times.
   * @param {Number} row A row index.
   * @param {Number} cell A column index.
   * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 250 ms.
   */
  flashCell(row: number, cell: number, speed = 250): void {
    const toggleCellClass = (cellNode: HTMLElement, times: number) => {
      if (times > 0) {
        clearTimeout(this._flashCellTimer);
        this._flashCellTimer = setTimeout(() => {
          cellNode.classList.toggle(this._options.cellFlashingCssClass || '', times % 2 === 0);
          toggleCellClass(cellNode, times - 1);
        }, speed);
      }
    };

    if (this.rowsCache[row]) {
      const cellNode = this.getCellNode(row, cell);
      if (cellNode) {
        toggleCellClass(cellNode, 5);
      }
    }
  }

  /**
   * Highlight a row for a certain duration (ms) of time.
   * @param {Number} row - grid row number
   * @param {Number} [duration] - duration (ms), defaults to 400ms
   */
  highlightRow(row: number, duration?: number): void {
    const rowCache = this.rowsCache[row];
    duration ||= this._options.rowHighlightDuration;

    if (Array.isArray(rowCache?.rowNode) && this._options.rowHighlightCssClass) {
      rowCache.rowNode.forEach((node) => node.classList.add(...Utils.classNameToList(this._options.rowHighlightCssClass)));
      clearTimeout(this._highlightRowTimer);
      this._highlightRowTimer = setTimeout(() => {
        rowCache.rowNode?.forEach((node) => node.classList.remove(...Utils.classNameToList(this._options.rowHighlightCssClass)));
      }, duration);
    }
  }

  /**
   * Dynamically creates temporary DOM elements to measure the difference between offsetWidth/Height
   * and clientWidth/Height, thereby computing the scrollbar width and height. After measuring, it
   * removes the temporary elements and returns the dimensions.
   *
   * @returns {{ width: number; height: number }} The computed scrollbar dimensions.
   */
  protected measureScrollbar(): { width: number; height: number } {
    let className = '';
    this._viewport.forEach((v) => (className += v.className));
    const outerdiv = Utils.createDomElement(
      'div',
      {
        className,
        style: { position: 'absolute', top: '-10000px', left: '-10000px', overflow: 'auto', width: '100px', height: '100px' },
      },
      document.body
    );
    const innerdiv = Utils.createDomElement('div', { style: { width: '200px', height: '200px', overflow: 'auto' } }, outerdiv);
    const dim = {
      width: outerdiv.offsetWidth - outerdiv.clientWidth,
      height: outerdiv.offsetHeight - outerdiv.clientHeight,
    };
    innerdiv.remove();
    outerdiv.remove();
    return dim;
  }

  /**
   * Dynamically doubles a test height on a temporary element until the element no longer accepts the height,
   * a child positioned at the bottom of the element no longer lands where it was asked,
   * or a browser-specific maximum is exceeded. Returns the highest supported CSS height in pixels.
   *
   * @returns {number} The highest supported CSS height in pixels.
   */
  protected getMaxSupportedCssHeight(): number {
    let supportedHeight = 1000000;
    // FF reports the height back but still renders blank after ~6M px
    // let testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
    const testUpTo = navigator.userAgent.toLowerCase().match(/firefox/)
      ? this._options.ffMaxSupportedCssHeight
      : this._options.maxSupportedCssHeight;
    const div = Utils.createDomElement('div', { style: { display: 'hidden' } }, document.body);
    const marker = Utils.createDomElement('div', { style: { position: 'absolute' } }, div);

    let condition = true;
    while (condition) {
      const test = supportedHeight * 2;
      Utils.height(div, test);
      const height = Utils.height(div);
      marker.style.top = `${test - 1}px`;
      const offsetTop = marker.offsetTop;

      /* v8 ignore else */
      if (test > testUpTo! || height !== test || offsetTop !== test - 1) {
        condition = false;
        break;
      } else {
        supportedHeight = test;
      }
    }

    div.remove();
    return supportedHeight;
  }

  /** Get grid unique identifier */
  getUID(): string {
    return this.uid;
  }

  /** Get Header Column Width Difference in pixel */
  getHeaderColumnWidthDiff(): number {
    return this.headerColumnWidthDiff;
  }

  /** Get scrollbar dimensions */
  getScrollbarDimensions(): { height: number; width: number } | undefined {
    return this.scrollbarDimensions;
  }

  /**
  * Returns an object with width and height of scrollbars currently displayed in the viewport (zero if not visible).
  */
  getDisplayedScrollbarDimensions(): { width: number; height: number } {
    return {
      width: this.viewportHasVScroll && this.scrollbarDimensions?.width ? this.scrollbarDimensions.width : 0,
      height: this.viewportHasHScroll && this.scrollbarDimensions?.height ? this.scrollbarDimensions.height : 0,
    };
  }

  /** Get the absolute column minimum width */
  getAbsoluteColumnMinWidth(): number {
    return this.absoluteColumnMinWidth;
  }


  /**
   * Calculates the vertical box sizes (the sum of top/bottom borders and paddings)
   * for a given element by reading its computed style.
   * @param el
   * @returns number
   */
  protected getVBoxDelta(el: HTMLElement): number {
    const p = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
    const styles = getComputedStyle(el);
    let delta = 0;
    p.forEach((val) => (delta += Utils.toFloat(styles[val as any])));
    return delta;
  }

  /**
   * Creates temporary elements in the header and a grid cell to calculate the extra width
   * and height added by borders and padding (when box-sizing is not “border-box”).
   * Sets internal properties (headerColumnWidthDiff, headerColumnHeightDiff, cellWidthDiff, cellHeightDiff)
   * and computes the absoluteColumnMinWidth as the maximum of the header and cell width differences.
   *
   */
  protected measureCellPaddingAndBorder(): void {
    const h = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
    const v = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
    const header = this._headers[0];

    this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0;
    this.cellWidthDiff = this.cellHeightDiff = 0;

    let el = Utils.createDomElement(
      'div',
      { className: 'ui-state-default slick-state-default slick-header-column', style: { visibility: 'hidden' }, textContent: '-' },
      header
    );
    let style = getComputedStyle(el);
    if (style.boxSizing !== 'border-box') {
      h.forEach((val) => (this.headerColumnWidthDiff += Utils.toFloat(style[val as any])));
      v.forEach((val) => (this.headerColumnHeightDiff += Utils.toFloat(style[val as any])));
    }
    el.remove();

    const r = Utils.createDomElement('div', { className: 'slick-row' }, this._canvas[0]);
    el = Utils.createDomElement('div', { className: 'slick-cell', id: '', style: { visibility: 'hidden' }, textContent: '-' }, r);
    style = getComputedStyle(el);
    if (style.boxSizing !== 'border-box') {
      h.forEach((val) => (this.cellWidthDiff += Utils.toFloat(style[val as any])));
      v.forEach((val) => (this.cellHeightDiff += Utils.toFloat(style[val as any])));
    }
    r.remove();

    this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
  }

  /** Clear all highlight timers that might have been left opened */
  protected clearAllTimers(): void {
    this.clearAutoScrollTimer();
    [
      this._columnResizeTimer,
      this._executionBlockTimer,
      this._flashCellTimer,
      this._highlightRowTimer,
      this.h_editorLoader,
      this.h_postrender,
      this.h_postrenderCleanup,
    ].forEach((timer) => {
      if (timer) {
        clearTimeout(timer);
      }
    });
    this.cancelSingleViewportRender();
    this.cancelScheduledAnimationFrame(this.stickyColumnLayoutFrame);
    this.stickyColumnLayoutFrame = undefined;
  }

  // compare 2 primitive type arrays, do not use to compare object arrays)
  /** Compares two arrays by length and strict element equality. */
  arrayEquals<T extends boolean | string | number>(arr1: Array<T>, arr2: Array<T>): boolean {
    return Array.isArray(arr1) && Array.isArray(arr2) && arr2.toString() === arr1.toString();
  }

  /**
   * Scroll to an X coordinate position in the grid
   * @param {Number} x
   */
  scrollToX(x: number): void {
    if (this._viewportScrollContainerX.scrollLeft !== x) {
      this._viewportScrollContainerX.scrollLeft = x;
    }

    const translateX = `translate3d(${-x}px, 0, 0)`;
    if (this.hasDockingHorizontalScroller()) {
      this._canvasNode.style.transform = translateX;
      if (this._dockingOverlay) {
        this._dockingOverlay.style.transform = translateX;
      }
      this.updateDockingOverlayClip(x);
      this.applyDockingProxyScrollOffsets(x);
    }

    // Move header/filter/footer content with compositor transforms so it stays in the
    // body's coordinate system within the same frame.
    this._headerL.style.transform = translateX;
    this._headerRowL.style.transform = translateX;
    if (this._footerRowL) {
      this._footerRowL.style.transform = translateX;
    }
    if (this._options.createPreHeaderPanel) {
      this._preHeaderPanel.style.transform = this._preHeaderPanel.classList.contains('slick-dropzone') ? '' : translateX;
    }
    if (this._options.createTopHeaderPanel) {
      this._topHeaderPanel.style.transform = this._topHeaderPanel.classList.contains('slick-dropzone') ? '' : translateX;
    }
  }

  /**
   * Converts a value to a string and escapes HTML characters (&, <, >). Returns an empty string if the value is not defined.
   */
  protected defaultFormatter(_row: number, _cell: number, value: any): string {
    if (!Utils.isDefined(value)) {
      return '';
    }
    return (value + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** Returns false if the specified row or cell index is out of bounds or if the column is hidden; otherwise returns true. */
  protected cellExists(row: number, cell: number): boolean {
    return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
  }

  /** Reads the CSS class (of the form “l<number>”) from the given cell DOM node to extract and return the column index. Throws an error if not found. */
  protected getCellFromNode(cellNode: HTMLElement): number {
    // read column number from .l<columnNumber> CSS class
    const cls = /l\d+/.exec(cellNode.className);
    if (!cls) {
      throw new Error(`SlickGrid getCellFromNode: cannot get cell - ${cellNode.className}`);
    }
    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
  }

  /** Iterates through the rows cache to find which row’s DOM element matches the given node and returns its row index; returns null if not found. */
  protected getRowFromNode(rowNode: HTMLElement | null | undefined): number | null {
    if (!rowNode) {
      return null;
    }
    rowNode = (rowNode.closest('.slick-row') as HTMLElement) || rowNode;
    for (const row in this.rowsCache) {
      if (this.rowsCache) {
        for (const i in this.rowsCache[row].rowNode) {
          if (this.rowsCache[row].rowNode?.[+i] === rowNode) {
            return row ? parseInt(row, 10) : 0;
          }
        }
      }
    }
    return null;
  }

  /**
   * For each provided element in target, sets the “unselectable” attribute, disables Mozilla’s user selection style,
   * and binds a “selectstart” event that always returns false, thus disabling text selection.
   *
   * @param target
   */
  protected disableSelection(target: HTMLElement[]): void {
    target.forEach((el) => {
      el.setAttribute('unselectable', 'on');
      (el.style as any).mozUserSelect = 'none';
      /* v8 ignore next */
      this._bindingEventService.bind(el, 'selectstart', () => false);
    });
  }

  /** Get the displayed scrollbar dimensions */
  getPubSubService(): BasePubSub | undefined {
    return this._pubSubService;
  }

  /**
   * Returns row and cell indexes by providing x,y coordinates.
   * Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
   * @param x An x coordinate.
   * @param y A y coordinate.
   */
  getCellFromPoint(x: number, y: number): { row: number; cell: number } {
    if (this.usesDockingRowRegions() && !this._options.rtl) {
      const docked = this.getCellFromDockedPoint(x, y);
      if (docked) {
        return docked;
      }
    }

    let row = this.getRowFromPosition(y);
    let cell = 0;

    let w = 0;
    for (let i = 0; i < this.columns.length && w <= x; i++) {
      if (this.columns[i] && !this.columns[i].hidden) {
        w += this.columns[i].width as number;
        cell = i + 1;
      }
    }
    cell -= 1;

    // we'll return -1 when coordinate falls outside the grid canvas
    if (row < -1) {
      row = -1;
    }

    return { row, cell };
  }

  /**
   * Resolves a canvas-relative point through the rendered docking layout: pinned/sticky rows in the
   * overlay bands, non-contiguous pins that shift the scrolling rows, and left/right column bands
   * that sit at the viewport edges regardless of scroll position. Returns null when the point does
   * not fall on a rendered band or column so the caller can use the natural layout.
   */
  protected getCellFromDockedPoint(x: number, y: number): { row: number; cell: number } | null {
    const scrollTop = this._viewportScrollContainerY?.scrollTop ?? this.scrollTop;
    const viewportHeight = this._viewportScrollContainerY?.clientHeight || this.viewportH;
    const viewportY = y - scrollTop;
    const { top, bottom, topHeight, bottomHeight } = this.rowDockingLayout;
    const bandRow = (entries: DockedRow[], start: number): number | undefined =>
      entries.find((entry) => viewportY >= start + entry.offset && viewportY < start + entry.offset + entry.height)?.index;

    let row: number | undefined;
    if (viewportY < topHeight) {
      row = bandRow(top, 0);
    } else {
      const bottomStart = Math.max(topHeight, viewportHeight - bottomHeight);
      if (viewportY >= bottomStart) {
        row = bandRow(bottom, bottomStart);
      }
    }
    if (row === undefined) {
      row = this.getRenderedRowFromPosition(y);
    }

    const scrollLeft = Math.max(0, this.scrollLeft);
    const viewportWidth = this.getViewportInnerWidth() || this._viewportScrollContainerX?.clientWidth || this.viewportW;
    const viewportX = x - scrollLeft;
    const { left, center, right, leftBaseWidth, leftWidth, rightWidth } = this.dockingLayout;
    const bandCell = (entries: DockedColumn[], start: number, position: number): number | undefined =>
      entries.find((entry) => position >= start + entry.offset && position < start + entry.offset + entry.width)?.index;

    let cell: number | undefined;
    if (viewportX < leftWidth) {
      cell = bandCell(left, 0, viewportX);
    } else if (viewportX >= viewportWidth - rightWidth) {
      cell = bandCell(right, viewportWidth - rightWidth, viewportX);
    }
    if (cell === undefined) {
      cell = bandCell(center, 0, x - leftBaseWidth);
    }
    return cell === undefined ? null : { row, cell };
  }

  /**
   * Inverse of getRenderedRowTop() for the scrolling rows: starts from the natural row for a canvas
   * y and walks over in-flow rows until the rendered span contains y. Permanently pinned rows are
   * out of the flow, so the walk is bounded by their count.
   */
  protected getRenderedRowFromPosition(y: number): number {
    const lastRow = this.getDataLengthIncludingAddNew() - 1;
    if (lastRow < 0) {
      return 0;
    }
    const outOfFlow = (row: number): boolean => {
      const docking = this.dockingByRow.get(row);
      return !!docking && !docking.sticky && docking.band !== 'center';
    };
    const step = (row: number, direction: 1 | -1): number => {
      let next = row + direction;
      while (next >= 0 && next <= lastRow && outOfFlow(next)) {
        next += direction;
      }
      return next;
    };

    let row = Math.min(lastRow, Math.max(0, this.getRowFromPosition(y)));
    if (outOfFlow(row)) {
      const next = step(row, 1);
      row = next <= lastRow ? next : step(row, -1);
      if (row < 0 || row > lastRow) {
        return Math.min(lastRow, Math.max(0, row));
      }
    }
    let guard = this.rowDockingLayout.top.length + this.rowDockingLayout.bottom.length + 2;
    while (guard-- > 0) {
      if (y < this.getRenderedRowTop(row)) {
        const previous = step(row, -1);
        if (previous < 0) {
          break;
        }
        row = previous;
      } else if (y >= this.getRenderedRowTop(row) + this.getRowHeight(row)) {
        const next = step(row, 1);
        if (next > lastRow) {
          break;
        }
        row = next;
      } else {
        break;
      }
    }
    return row;
  }

  /** Get a Plugin (addon) by its name */
  getPluginByName<P extends SlickPlugin | undefined = undefined>(name: string): P | undefined {
    for (let i = this.plugins.length - 1; i >= 0; i--) {
      if (this.plugins[i]?.pluginName === name) {
        return this.plugins[i] as P;
      }
    }
    return undefined;
  }

  /** Get Grid Canvas Node DOM Element */
  getContainerNode(): HTMLElement {
    return this._container;
  }

  /**
   * Computes the height of a cell, taking into account row span if applicable.
   *
   * @param {number} row - The row index of the cell.
   * @param {number} rowspan - The number of rows the cell spans.
   * @returns {number} The computed cell height in pixels.
   */
  getCellHeight(row: number, rowspan: number): number {
    let cellHeight = this._options.rowHeight || 0;
    if (rowspan > 1) {
      const rowSpanBottomIdx = row + rowspan - 1;
      cellHeight = this.getRowBottom(rowSpanBottomIdx) - this.getRowTop(row);
    } else {
      const rowHeight = this.getRowHeight(row);
      if (rowHeight !== cellHeight - this.cellHeightDiff) {
        cellHeight = rowHeight;
      }
    }

    cellHeight -= this.cellHeightDiff;
    return Math.ceil(cellHeight);
  }

  /**
  * Computes the difference between two sets, returning elements that exist in `a` but not in `b`.
  * This serves as a polyfill for `Set.prototype.difference()` introduced in ES2024.
  *
  * @param {Set<number>} a - The base set from which elements will be removed.
  * @param {Set<number>} b - The set containing elements to be excluded from `a`.
  * @returns {Set<number>} A new set containing elements present in `a` but not in `b`.
  */
  protected setDifference(a: Set<number>, b: Set<number>): Set<number> {
    return new Set(Array.from(a).filter((item) => !b.has(item)));
  }

  /**
   * Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
   * @param {Number} row - A row number.
   * @param {Number} cell - A column number.
   */
  getCellNodeBox(row: number, cell: number): { top: number; left: number; bottom: number; right: number } | null {
    if (!this.cellExists(row, cell)) {
      return null;
    }

    const rowDocking = this.dockingByRow.get(row);
    let y1 = this.getRenderedRowTop(row);
    if (rowDocking?.band === 'top') {
      y1 = this.scrollTop + rowDocking.offset;
    } else if (rowDocking?.band === 'bottom') {
      const viewportHeight = this._viewportScrollContainerY?.clientHeight || this.viewportH;
      y1 = this.scrollTop + viewportHeight - this.rowDockingLayout.bottomHeight + rowDocking.offset;
    }
    const y2 = y1 + this.getRowHeight(row) - 1;
    const columnDocking = this.dockingByColumn.get(cell);
    const centerOffset =
      this.usesStickyColumnTransformPath() && !this.columns[cell]?.pinned ? columnDocking?.naturalOffset || 0 : columnDocking?.offset || 0;
    let x1 = this.dockingLayout.leftBaseWidth + centerOffset;
    if (columnDocking?.band === 'left') {
      x1 = this.scrollLeft + columnDocking.offset;
    } else if (columnDocking?.band === 'right') {
      x1 = this.scrollLeft + this.getViewportInnerWidth() - this.dockingLayout.rightWidth + columnDocking.offset;
    }
    const x2 = x1 + (this.columns[cell]?.width || 0);

    return {
      top: y1,
      left: x1,
      bottom: y2,
      right: x2,
    };
  }

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
  protected absBox(elem: HTMLElement): ElementPosition {
    const rect = elem.getBoundingClientRect();
    const box = {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      visible: true,
    };
    if (rect.bottom === 0 && rect.top === 0) {
      return box; // assume element is visible when we can't determine it's position & size
    }

    // Keep the coordinates document-relative: editors and custom cell components
    // commonly append their elements to document.body.
    const gridRect = this._container?.getBoundingClientRect() || { top: 0, left: 0, bottom: 0, right: 0 };
    const windowScroll = Utils.windowScrollPosition();
    box.top = rect.top + windowScroll.top;
    box.left = rect.left + windowScroll.left;
    box.bottom = rect.bottom + windowScroll.top;
    box.right = rect.right + windowScroll.left;

    // Check if the element is visible within the grid viewport
    if (
      rect.bottom < gridRect.top ||
      rect.top > gridRect.top + (this._container?.clientHeight ?? window.innerHeight) ||
      rect.right < gridRect.left ||
      rect.left > gridRect.left + (this._container?.clientWidth ?? window.innerWidth)
    ) {
      box.visible = false;
    }
    return box;
  }

  /** Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. */
  getActiveCellPosition(): ElementPosition {
    return this.absBox(this.activeCellNode as HTMLElement);
  }

  /** Get the Grid Position */
  getGridPosition(): ElementPosition {
    return this.absBox(this._container);
  }

  /** Returns the active cell editor. If there is no actively edited cell, null is returned.   */
  getCellEditor(): Editor | null {
    return this.currentEditor;
  }

  /**
   * Returns an object representing the coordinates of the currently active cell:
   * @example	`{ row: activeRow, cell: activeCell }`
   */
  getActiveCell(): { row: number; cell: number } | null {
    if (this.activeCellNode) {
      return { row: this.activeRow, cell: this.activeCell };
    }
    return null;
  }

  /** Returns the DOM element containing the currently active cell. If no cell is active, null is returned. */
  getActiveCellNode(): HTMLDivElement | null {
    return this.activeCellNode;
  }

  // This get/set methods are used for keeping text-selection. These don't consider IE because they don't loose text-selection.
  // Fix for firefox selection. See https://github.com/mleibman/SlickGrid/pull/746/files
  /** Returns the current browser text selection, when one is available. */
  protected getTextSelection(): Range | null {
    let textSelection: Range | null = null;
    if (window.getSelection) {
      const selection = window.getSelection();
      if ((selection?.rangeCount || 0) > 0) {
        textSelection = selection!.getRangeAt(0);
      }
    }
    return textSelection;
  }

  /**
   * Sets the text selection to the specified range within the document.
   * Clears any existing selections before applying the new range.
   *
   * @param {Range} selection - The text range to be selected.
   */
  protected setTextSelection(selection: Range): void {
    if (window.getSelection && selection) {
      const target = window.getSelection();
      if (target) {
        target.removeAllRanges();
        target.addRange(selection);
      }
    }
  }

  /** html sanitizer to avoid scripting attack */
  sanitizeHtmlString(dirtyHtml: string, suppressLogging?: boolean): string {
    if (!this._options.sanitizer || typeof dirtyHtml !== 'string') {
      return dirtyHtml;
    }

    const cleanHtml = this._options.sanitizer(dirtyHtml);

    if (!suppressLogging && this._options.logSanitizedHtml && this.logMessageCount <= this.logMessageMaxCount && cleanHtml !== dirtyHtml) {
      console.log(`sanitizer altered html: ${dirtyHtml} --> ${cleanHtml}`);
      if (this.logMessageCount === this.logMessageMaxCount) {
        console.log(`sanitizer: silencing messages after first ${this.logMessageMaxCount}`);
      }
      this.logMessageCount++;
    }
    return cleanHtml;
  }

  /**
  * Applies or removes RTL (Right-to-Left) support on the grid container.
  *
  * When enabled, this method:
  * - Adds the `slick-rtl` CSS class for styling
  * - Sets the `dir="rtl"` attribute for proper text direction
  * When disabled, it removes both the class and attribute.
  * This makes the grid self-contained, allowing RTL to work regardless of the page's direction setting.
  *
  * @param enabled - Whether RTL should be enabled
  */
  private applyRTL(enabled: boolean): void {
    if (enabled) {
      this._container.classList.add('slick-rtl');
      this._container.setAttribute('dir', 'rtl');
    } else {
      this._container.classList.remove('slick-rtl');
      this._container.removeAttribute('dir');
    }
  }

  /**
   * Retrieves the rowspan value for a specific cell in a row.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @returns {number} The number of rows the cell spans.
   */
  protected getRowspan(row: number, cell: number): number {
    let rowspan = 1;
    const metadata = this.getItemMetadaWhenExists(row);
    if (metadata?.columns) {
      Object.keys(metadata.columns).forEach((col) => {
        const colIdx = Number(col);
        if (colIdx === cell) {
          const columnMeta = metadata.columns![colIdx];
          rowspan = Number(columnMeta?.rowspan || 1);

        }
      });
    }
    return rowspan;
  }

  /**
   * Finds the nearest focusable row in the specified direction.
   *
   * @param {number} row - The current row index.
   * @param {number} cell - The column index.
   * @param {'up' | 'down'} dir - The direction to search for a focusable row.
   * @returns {number} The index of the focusable row.
   */
  protected findFocusableRow(row: number, cell: number, dir: 'up' | 'down'): number {
    let r = row;
    const rowRange = this._colsWithRowSpanCache[cell] || new Set<string>();
    let found = false;

    Array.from(rowRange).forEach((rrange) => {
      const [start, end] = rrange.split(':').map(Number);
      if (!found && row >= start && row <= end) {
        r = dir === 'up' ? start : end;
        if (this.canCellBeActive(r, cell)) {
          found = true;
        }
      }
    });

    return r;
  }

  /**
   * Finds the first focusable cell in a given row.
   *
   * @param {number} row - The row index.
   * @returns {{ cell: number; row: number; }} The first focusable cell and its row.
   */
  protected findFirstFocusableCell(row: number): { cell: number; row: number } {
    let cell = 0;
    let focusableRow = row;
    let ff = -1;

    while (cell < this.columns.length) {
      const prs = this.getParentRowSpanByCell(row, cell);
      focusableRow = prs !== null && prs.start !== row ? prs.start : row;
      if (this.canCellBeActive(focusableRow, cell)) {
        ff = cell;
        break;
      }
      cell += this.getColspan(focusableRow, cell);
    }
    return { cell: ff, row: focusableRow };
  }

  /**
   * Finds the last focusable cell in a given row.
   *
   * @param {number} row - The row index.
   * @returns {{ cell: number; row: number; }} The last focusable cell and its row.
   */
  protected findLastFocusableCell(row: number): { cell: number; row: number } {
    let cell = 0;
    let focusableRow = row;
    let lf = -1;

    while (cell < this.columns.length) {
      const prs = this.getParentRowSpanByCell(row, cell);
      focusableRow = prs !== null && prs.start !== row ? prs.start : row;
      if (this.canCellBeActive(focusableRow, cell)) {
        lf = cell;
      }
      cell += this.getColspan(focusableRow, cell);
    }

    return { cell: lf, row: focusableRow };
  }

  /** Find the next non-hidden column at or after the supplied index. */
  protected findNextAvailableColumnCell(cell: number): number {
    let availableCell = cell;
    if (this.columns[availableCell]) {
      while (this.columns[availableCell].hidden || availableCell > this.columns.length) {
        availableCell++;
      }

    }
    return availableCell;
  }

  // when dealing with colspan, we'll count hidden columns and increase colspan when that happens
  /** Expand a colspan to account for hidden columns inside the span. */
  protected increaseHiddenColspan(colspan: number, cell: number): number {
    if (colspan > 1) {
      let hiddenCount = 0;
      for (let k = cell; k < cell + colspan; k++) {
        if (this.columns[k]?.hidden) {
          hiddenCount++;
        }
      }
      // increase colspan when hidden column(s) found
      if (hiddenCount > 0) {
        colspan = colspan + hiddenCount;
      }
    }
    return colspan;
  }

  /**
   * Converts an array of row indices into a range format.
   *
   * @param {number[]} rows - The row indices.
   * @returns {SlickRange_[]} An array of ranges covering the specified rows.
   */
  protected rowsToRanges(rows: number[], compactRows = false): SlickRange_[] {
    const columns = this.getVisibleColumns();
    const lastCell = this.getColumnIndex(columns[columns.length - 1].id);
    const ranges: SlickRange_[] = [];
    if (!compactRows) {
      rows.forEach((row) => ranges.push(new SlickRange(row, 0, row, lastCell)));
      return ranges;
    }

    let rangeStart = rows[0];
    let previousRow = rangeStart;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row <= previousRow) {
        return rows.map((row) => new SlickRange(row, 0, row, lastCell));
      }
      if (row !== previousRow + 1) {
        ranges.push(new SlickRange(rangeStart, 0, previousRow, lastCell));
        rangeStart = row;
      }
      previousRow = row;
    }
    if (rangeStart !== undefined) {
      ranges.push(new SlickRange(rangeStart, 0, previousRow, lastCell));
    }
    return ranges;
  }

  /**
  * From any row/cell indexes that might have colspan/rowspan, find its starting indexes
  * For example, if we start at 0,0 and we have colspan/rowspan of 4 for both and our indexes is row:2,cell:3
  * then our starting row/cell is 0,0. If a cell has no spanning at all then row/cell output is same as input
  *
  * @param {number} row - The row index.
  * @param {number} cell - The column index.
  * @returns {{ cell: number; row: number; }} The starting cell position.
  */
  findSpanStartingCell(
    row: number,
    cell: number
  ): {
    cell: number;
    row: number;
  } {
    cell = this.findNextAvailableColumnCell(cell);
    const prs = this.getParentRowSpanByCell(row, cell);
    const focusableRow = prs !== null && prs.start !== row ? prs.start : row;
    let fc = 0;
    let prevCell = 0;

    while (fc < this.columns.length) {
      fc += this.getColspan(focusableRow, fc);
      if (fc > cell) {
        fc = prevCell;
        return { cell: fc, row: focusableRow };
      }
      prevCell = fc;
    }

    return { cell: fc, row: focusableRow };
  }

  /**
   * Moves the focus to the right within the grid.
   *
   * @param {number} _row - The row index.
   * @param {number} cell - The column index.
   * @param {number} posY - The current vertical position.
   * @param {number} [_posX] - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoRight(
    _row: number,
    cell: number,
    posY: number,
    _posX?: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    if (cell < this.columns.length) {
      let fc = cell + 1;
      let fr = posY;

      do {
        const sc = this.findSpanStartingCell(posY, fc);
        fr = sc.row;
        fc = this.findNextAvailableColumnCell(sc.cell);
        if (this.canCellBeActive(fr, fc) && fc > cell) {
          break;
        }
        fc += this.getColspan(fr, sc.cell);
      } while (fc < this.columns.length);

      if (fc < this.columns.length) {
        return {
          row: fr,
          cell: fc,
          posX: fc,
          posY,
        };
      }
    }
    return null;
  }

  /**
   * Moves the focus to the left within the grid.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} posY - The current vertical position.
   * @param {number} [_posX] - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoLeft(
    row: number,
    cell: number,
    posY: number,
    _posX?: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    const ff = this.findFirstFocusableCell(row);
    if (cell <= 0 || ff.cell >= cell) {
      return null;
    }

    let pos: CellPosition | null;
    let prev = {
      row,
      cell: ff.cell,
      posX: ff.cell,
      posY,
    };

    while (true) {
      pos = this.gotoRight(prev.row, prev.cell, prev.posY, prev.posX);
      if (!pos) {
        return null;
      }
      if (pos.cell >= cell) {
        // when right cell is within a rowspan, we need to use original row (posY)
        const nextRow = this.findFocusableRow(posY, prev.cell, 'up');
        /* v8 ignore if */
        if (nextRow !== prev.row) {
          prev.row = nextRow;
        }
        return prev;
      }
      prev = pos;
    }
  }

  /**
   * Moves the focus downward within the grid.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} _posY - The current vertical position.
   * @param {number} posX - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoDown(
    row: number,
    cell: number,
    _posY: number,
    posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    let prevCell;
    const ub = this.getDataLengthIncludingAddNew();
    do {
      row += this.getRowspan(row, posX);
      prevCell = cell = 0;
      while (cell <= posX) {
        prevCell = this.findNextAvailableColumnCell(cell);
        cell += this.getColspan(row, cell);
      }
    } while (row <= ub && !this.canCellBeActive(row, prevCell));

    if (row <= ub) {
      return {
        row,
        cell: prevCell,
        posX,
        posY: row,
      };
    }
    return null;
  }

  /**
   * Moves the focus upward within the grid.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} _posY - The current vertical position.
   * @param {number} posX - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoUp(
    row: number,
    cell: number,
    _posY: number,
    posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    let prevCell;
    if (row > 0) {
      do {
        row = this.findFocusableRow(row - 1, posX, 'up');
        prevCell = cell = 0;
        while (cell <= posX) {
          prevCell = this.findNextAvailableColumnCell(cell);
          cell += this.getColspan(row, cell);
        }
      } while (row >= 0 && !this.canCellBeActive(row, prevCell));

      if (cell <= this.columns.length) {
        return {
          row,
          cell: prevCell,
          posX,
          posY: row,
        };
      }
    }
    return null;
  }

  /**
   * Moves the focus to the next cell in the grid.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} posY - The current vertical position.
   * @param {number} posX - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoNext(
    row: number,
    cell: number,
    posY: number,
    posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    if (!isDefinedNumber(row) && !isDefinedNumber(cell)) {
      row = cell = posY = posX = 0;
      if (this.canCellBeActive(row, cell)) {
        return {
          row,
          cell,
          posX: cell,
          posY,
        };
      }
    }

    let pos = this.gotoRight(row, cell, posY, posX);
    if (!pos) {
      let ff;
      while (!pos && ++posY < this.getDataLength() + (this._options.enableAddRow ? 1 : 0)) {
        ff = this.findFirstFocusableCell(posY);
        row = this.getParentRowSpanByCell(posY, ff.cell)?.start ?? posY;
        pos = {
          row,
          cell: ff.cell,
          posX: ff.cell,
          posY,
        };
      }
    }
    return pos;
  }

  /**
   * Moves the focus to the previous cell in the grid.
   *
   * @param {number} row - The row index.
   * @param {number} cell - The column index.
   * @param {number} posY - The current vertical position.
   * @param {number} posX - The current horizontal position.
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoPrev(
    row: number,
    cell: number,
    posY: number,
    posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    if (!isDefinedNumber(row) && !isDefinedNumber(cell)) {
      row = posY = this.getDataLengthIncludingAddNew() - 1;
      cell = posX = this.columns.length - 1;
      if (this.canCellBeActive(row, cell)) {
        return {
          row,
          cell,
          posX: cell,
          posY,
        };
      }
    }

    let pos = this.gotoLeft(row, cell, posY, posX);
    if (!pos) {
      let lf;
      while (!pos && --posY >= 0) {
        lf = this.findLastFocusableCell(posY);
        if (lf.cell > -1) {
          row = this.getParentRowSpanByCell(posY, lf.cell)?.start ?? posY;
          pos = {
            row,
            cell: lf.cell,
            posX: lf.cell,
            posY,
          };
        }
      }
    }
    return pos;
  }

  /**
   * Moves the focus to the first focusable cell in a row.
   *
   * @param {number} row - The row index.
   * @param {number} _cell - The column index (ignored).
   * @param {number} _posY - The current vertical position (ignored).
   * @param {number} _posX - The current horizontal position (ignored).
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoRowStart(
    row: number,
    _cell: number,
    _posY: number,
    _posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    const ff = this.findFirstFocusableCell(row);
    return {
      row: ff.row,
      cell: ff.cell,
      posX: ff.cell,
      posY: row,
    };
  }

  /**
   * Moves the focus to the last focusable cell in a row.
   *
   * @param {number} row - The row index.
   * @param {number} _cell - The column index (ignored).
   * @param {number} _posY - The current vertical position (ignored).
   * @param {number} _posX - The current horizontal position (ignored).
   * @returns {CellPosition | null} The new cell position, or null if not found.
   */
  protected gotoRowEnd(
    row: number,
    _cell: number,
    _posY: number,
    _posX: number
  ): { row: number; cell: number; posX: number; posY: number } | null {
    const lf = this.findLastFocusableCell(row);
    if (lf.cell === -1) {
      return null;
    }

    return {
      row: lf.row,
      cell: lf.cell,
      posX: lf.cell,
      posY: row,
    };
  }

  /** Switches the active cell one cell right skipping unselectable cells. Unline navigateNext, navigateRight stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateRight(): boolean | undefined {
    return this.navigate('right');
  }

  /** Switches the active cell one cell left skipping unselectable cells. Unline navigatePrev, navigateLeft stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateLeft(): boolean | undefined {
    return this.navigate('left');
  }

  /** Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateDown(): boolean | undefined {
    return this.navigate('down');
  }

  /** Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateUp(): boolean | undefined {
    return this.navigate('up');
  }

  /** Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigateNext(): boolean | undefined {
    return this.navigate('next');
  }

  /** Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigatePrev(): boolean | undefined {
    return this.navigate('prev');
  }

  /** Navigate to the start row in the grid */
  navigateRowStart(): boolean | undefined {
    return this.navigate('home');
  }

  /** Navigate to the end row in the grid */
  navigateRowEnd(): boolean | undefined {
    return this.navigate('end');
  }

  /** Navigate to coordinate 0,0 (top left home) */
  navigateTopStart(): boolean | undefined {
    this.unsetActiveCell();
    this.navigateToRow(0);
    return this.navigate('home');
  }

  /** Navigate to bottom row end (bottom right end) */
  navigateBottomEnd(): boolean | undefined {
    this.navigateBottom();
    return this.navigate('end');
  }

  /**
   * @param {string} dir Navigation direction.
   * @return {boolean} Whether navigation resulted in a change of active cell.
   */
  protected navigate(dir: 'up' | 'down' | 'left' | 'right' | 'prev' | 'next' | 'home' | 'end'): boolean | undefined {
    if (!this._options.enableCellNavigation) {
      return false;
    }

    if (!this.activeCellNode && dir !== 'prev' && dir !== 'next') {
      return false;
    }

    if (!this.getEditorLock()?.commitCurrentEdit()) {
      return true;
    }
    this.setFocus();
    this.unsetActiveCell();

    const tabbingDirections = {
      up: -1,
      down: 1,
      left: -1,
      right: 1,
      prev: -1,
      next: 1,
      home: -1,
      end: 1,
    };
    this.tabbingDirection = tabbingDirections[dir];

    const stepFunctions = {
      up: this.gotoUp,
      down: this.gotoDown,
      left: this.gotoLeft,
      right: this.gotoRight,
      prev: this.gotoPrev,
      next: this.gotoNext,
      home: this.gotoRowStart,
      end: this.gotoRowEnd,
    };
    const stepFn = stepFunctions[dir];
    const pos = stepFn.call(this, this.activeRow, this.activeCell, this.activePosY, this.activePosX);
    return this.navigateToPos(pos);
  }

  /**
   * Navigates to a specified cell position within the grid.
   * Ensures the cell is visible, sets it as active, and updates position tracking.
   *
   * @param {CellPosition | null} pos - The target cell position.
   * @returns {boolean} Whether navigation was successful.
   */
  protected navigateToPos(pos: CellPosition | null): boolean | undefined {
    if (pos) {
      const isAddNewRow = pos.row === this.getDataLength();

      if (!this.isPinnedRowIdx(pos.row)) {
        this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling);
      }
      this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell));
      this.activePosX = pos.posX;
      this.activePosY = pos.posY;
      return true;
    } else {
      this.setActiveCellInternal(this.getCellNode(this.activeRow, this.activeCell));
      return false;
    }
  }

  /**
  * Returns a DOM element containing a cell at a given row and cell.
  * @param row A row index.
  * @param cell A column index.
  * @returns {HTMLDivElement | null} The cell's DOM element, or null if not found.
  */
  getCellNode(row: number, cell: number): HTMLDivElement | null {
    if (this.rowsCache[row]) {
      this.ensureCellNodesInRowsCache(row);
      try {
        if (this.rowsCache[row].cellNodesByColumnIdx.length > cell) {
          return this.rowsCache[row].cellNodesByColumnIdx[cell] as HTMLDivElement | null;
        }
        return null;
      } /* v8 ignore next */ catch {
        return this.rowsCache[row].cellNodesByColumnIdx[cell] as HTMLDivElement | null;
      }
    }
    return null;
  }

  /**
   * Sets an active cell.
   * @param {number} row - A row index.
   * @param {number} cell - A column index.
   * @param {boolean} [optionEditMode] Option Edit Mode is Auto-Edit?
   * @param {boolean} [preClickModeOn] Pre-Click Mode is Enabled?
   * @param {boolean} [suppressActiveCellChangedEvent] Are we suppressing Active Cell Changed Event (defaults to false)
   */
  setActiveCell(
    row: number,
    cell: number,
    opt_editMode?: boolean,
    preClickModeOn?: boolean,
    suppressActiveCellChangedEvent?: boolean
  ): void {
    if (
      !this.initialized ||
      !this._options.enableCellNavigation ||
      row > this.getDataLength() ||
      row < 0 ||
      cell >= this.columns.length ||
      cell < 0
    ) {
      return;
    }

    this.scrollCellIntoView(row, cell, false);
    this.setActiveCellInternal(this.getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent);
  }

  /**
   * Sets an active cell.
   * @param {number} row - A row index.
   * @param {number} cell - A column index.
   * @param {boolean} [suppressScrollIntoView] - optionally suppress the ScrollIntoView that happens by default (defaults to false)
   */
  setActiveRow(row: number, cell?: number, suppressScrollIntoView?: boolean): void {
    cell ??= 0;

    if (!this.initialized || row > this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0) {
      return;
    }

    this.activeRow = row;
    if (!suppressScrollIntoView) {
      this.scrollCellIntoView(row, cell, false);
    }
  }

  /**
   * Returns true if you can click on a given cell and make it the active focus.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeActive(row: number, cell: number): boolean {
    if (
      !this._options.enableCellNavigation ||
      row >= this.getDataLengthIncludingAddNew() ||
      row < 0 ||
      cell >= this.columns.length ||
      cell < 0
    ) {
      return false;
    }

    if (!this.columns[cell] || this.columns[cell].hidden) {
      return false;
    }

    // cell not found in rows that are spanned (rowspan of 1 or more) are invalid
    // i.e.: if the 5th cell has rowspan that reaches the end of the grid, then the last cell that can be active is 5 (anything above 5 on same column is invalid)
    const spanRow = this.getParentRowSpanByCell(row, cell)?.start ?? row;
    if (spanRow !== row) {
      return false;
    }

    const rowMetadata = this.getItemMetadaWhenExists(row);
    if (rowMetadata?.focusable !== undefined) {
      return !!rowMetadata.focusable;
    }

    const columnMetadata = rowMetadata?.columns;
    if (columnMetadata?.[this.columns[cell].id]?.focusable !== undefined) {
      return !!columnMetadata[this.columns[cell].id].focusable;
    }
    if (columnMetadata?.[cell]?.focusable !== undefined) {
      return !!columnMetadata[cell].focusable;
    }

    return !!this.columns[cell].focusable;
  }

  /**
   * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeSelected(row: number, cell: number): boolean {
    if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0) {
      return false;
    }

    if (!this.columns[cell] || this.columns[cell].hidden) {
      return false;
    }

    const rowMetadata = this.getItemMetadaWhenExists(row);
    if (rowMetadata?.selectable !== undefined) {
      return !!rowMetadata.selectable;
    }

    const columnMetadata = rowMetadata?.columns && (rowMetadata.columns[this.columns[cell].id] || rowMetadata.columns[cell]);
    if (columnMetadata?.selectable !== undefined) {
      return !!columnMetadata.selectable;
    }

    return !!this.columns[cell].selectable;
  }

  /**
   * Accepts a row integer and a cell integer, scrolling the view to the row where row is its row index, and cell is its cell index. Optionally accepts a forceEdit boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.
   * Unlike setActiveCell, this scrolls the row into the viewport and sets the keyboard focus.
   * @param {Number} row A row index.
   * @param {Number} cell A column index.
   * @param {Boolean} [forceEdit] If true, will attempt to initiate the edit dialogue for the field in the specified cell.
   */
  gotoCell(row: number, cell: number, forceEdit?: boolean, e?: Event | SlickEvent_): void {
    if (this.initialized && this.canCellBeActive(row, cell) && this.getEditorLock()?.commitCurrentEdit()) {
      this.scrollCellIntoView(row, cell, false);

      const newCell = this.getCellNode(row, cell);

      // if selecting the 'add new' row, start editing right away
      const column = this.columns[cell];
      const suppressActiveCellChangedEvent = !!(
        this._options.editable &&
        column?.editor &&
        this._options.suppressActiveCellChangeOnEdit
      );
      this.setActiveCellInternal(
        newCell,
        forceEdit || row === this.getDataLength() || this._options.autoEdit,
        null,
        suppressActiveCellChangedEvent,
        e
      );

      // if no editor was created, set the focus back on the grid
      if (!this.currentEditor) {
        this.setFocus();
      }
    }
  }

  /**
   * Restores the original CSS properties for the container and its hidden
   * ancestors that were modified by cacheCssForHiddenInit.
   * This ensures that after initial measurements the DOM elements revert
   * to their original style settings.
   */
  restoreCssFromHiddenInit<P extends Partial<CSSStyleDeclarationWritable>>(): void {
    // finish handle display:none on container or container parents
    // - put values back the way they were
    let i = 0;
    if (this._hiddenParents) {
      this._hiddenParents.forEach((el) => {
        const old = this.oldProps[i++];
        Object.keys(this.cssShow).forEach((name) => {
          if (this.cssShow) {
            (el.style as unknown as P)[name as keyof P] = (old as any)[name];
          }
        });
      });
      this._hiddenParents.length = 0;
    }
  }

  /** Whether the row index belongs to a pinned row band. */
  protected isPinnedRowIdx(row: number): boolean {
    return this.dockingByRow.get(row)?.band !== undefined && this.dockingByRow.get(row)?.band !== 'center';
  }

  /**
   * Validate that a pinning change leaves at least one visible center column.
   * @param {Number|String} [columnId] column id
   * @param {Boolean} [forceAlert] tri-state flag to alert when pinning is invalid
   * @param {Array<Column>} [colums] optionally provide new columns to validate
   *  - if `undefined` it will do the condition check and never alert more than once
   *  - if `true` it will do the condition check and always alert even if it was called before
   *  - if `false` it will do the condition check but always skip the alert
   */
  validateColumnPinning(columnId?: number | string, forceAlert = false, columns: C[] = this.columns): boolean {
    const prospectiveColumns =
      columnId !== undefined
        ? columns.map((column) => (column?.id === columnId && !column.hidden ? { ...column, hidden: true } : column))
        : columns;
    return this.validatePinnedColumnIndexes(this.getPinnedColumnIndexes(this._options.pinning?.columns, prospectiveColumns), forceAlert, prospectiveColumns);
  }

  /**
   * The docking layout's content width is the natural sum of column widths and
   * is used for virtual-scroll/chrome coordinates. Rows additionally need a
   * rendered width so a right pin remains at the viewport edge when the grid
   * is wider than its unpinned center columns.
   */
  protected getDockingRenderedWidth(): number {
    const viewportWidth = this.getViewportInnerWidth() || this._viewportNode?.clientWidth || this._dockingHorizontalScroller?.clientWidth;
    return Math.max(this.dockingLayout.contentWidth, viewportWidth || this.viewportW);
  }

  /** Keep proxy-scrolled chrome and the canvas on the same logical track width. */
  protected getDockingChromeRootWidth(): number {
    return this.usesDockingChromeRegions() ? this.getDockingRenderedWidth() : this.headersWidthL;
  }

  /** Returns the rendered widths of the left, center, and right docking bands. */
  protected getDockingRenderedWidths(renderedWidth: number = this.getDockingRenderedWidth()): Record<ColumnDockingBand, number> {
    const useBaseWidths = this.usesStickyColumnTransformPath();
    const left = useBaseWidths ? this.dockingLayout.leftBaseWidth : this.dockingLayout.leftWidth;
    const right = useBaseWidths ? this.dockingLayout.rightBaseWidth : this.dockingLayout.rightWidth;
    return { left, center: Math.max(0, renderedWidth - left - right), right };
  }

  /** Applies the resolved docking-band widths to rendered rows and their cell regions. */
  protected applyDockingDimensionsToRows(): void {
    const renderedWidth = this.getDockingRenderedWidth();
    const { left: leftWidth, center: renderedCenterWidth, right: rightWidth } = this.getDockingRenderedWidths(renderedWidth);
    Object.values(this.rowsCache).forEach((cacheEntry) => {
      const row = cacheEntry.rowNode?.[0];
      if (!row?.classList.contains('slick-row-docked')) {
        return;
      }
      row.style.width = `${renderedWidth}px`;
      row.style.gridTemplateColumns = `${leftWidth}px ${renderedCenterWidth}px ${rightWidth}px`;
      const { left, center, right } = cacheEntry.cellRegions || {};
      if (left) {
        left.style.width = `${leftWidth}px`;
        left.classList.toggle('slick-pinned-left-cells-active', leftWidth > 0);
      }
      if (center) {
        center.style.width = `${renderedCenterWidth}px`;
      }
      if (right) {
        right.style.width = `${rightWidth}px`;
        right.classList.toggle('slick-pinned-right-cells-active', rightWidth > 0);
      }
      this.applyDockingScrollOffsetToRow(row, cacheEntry);
    });
  }

  /** Synchronizes a rendered row's cell-region offsets with the active horizontal scroll mode. */
  protected applyDockingScrollOffsetToRow(row: HTMLElement, cacheEntry: RowCaching): void {
    if (!row.classList.contains('slick-row-docked') || !cacheEntry.cellRegions) {
      return;
    }
    if (this.hasDockingHorizontalScroller()) {
      // The offset itself is inherited from the container; see syncDockingScrollOffsetVariable().
      // The proxy stylesheet applies the compensation; keep this path to custom-property
      // writes so horizontal scrolling does not force a layout per cached row.
      if (cacheEntry.cellRegions.left.style.transform) {
        cacheEntry.cellRegions.left.style.removeProperty('transform');
      }
      if (cacheEntry.cellRegions.right.style.transform) {
        cacheEntry.cellRegions.right.style.removeProperty('transform');
      }
      return;
    }
    const viewportWidth = this.getViewportInnerWidth() || this._viewportScrollContainerX?.clientWidth || this.viewportW;
    const isOverlayRow = row.parentElement === this._dockingOverlay;
    row.style.left = isOverlayRow ? `${-this.scrollLeft}px` : '';
    // Regular rows stay in the native scrolling canvas, so the left region can
    // use CSS sticky positioning without a per-scroll transform. Overlay rows
    // are outside that scroll container and still need the compensating shift.
    cacheEntry.cellRegions.left.style.transform = isOverlayRow ? `translateX(${this.scrollLeft}px)` : '';
    cacheEntry.cellRegions.right.style.transform = `translateX(${this.scrollLeft + viewportWidth - this.dockingLayout.contentWidth}px)`;
  }

  /** Updates row and column-chrome offsets when horizontal scrolling is handled natively. */
  protected applyDockingScrollOffsets(): void {
    if (this.hasDockingHorizontalScroller()) {
      return;
    }
    const hasRightDocking = this.dockingLayout.right.length > 0;
    Object.values(this.rowsCache).forEach((cacheEntry) => {
      const row = cacheEntry.rowNode?.[0];
      // Rows with only leading pinned columns use CSS sticky; only overlay rows and
      // right-docked regions need a per-scroll write.
      if (row && (row.parentElement === this._dockingOverlay || hasRightDocking)) {
        this.applyDockingScrollOffsetToRow(row, cacheEntry);
      }
    });
    this.applyDockingChromeScrollOffsets();
  }

  /**
   * Publish the horizontal scroll offset that the proxy-mode transforms consume.
   *
   * Every docked row region, sticky cell and pinned chrome element used to receive the same
   * value on every scroll event. Custom properties inherit, so one write on the container
   * reaches all of them.
   */
  protected syncDockingScrollOffsetVariable(scrollLeft: number = this.scrollLeft): void {
    this._container.style.setProperty('--slick-docking-scroll-left', `${scrollLeft}px`);
  }

  /** Update only elements whose proxy-mode transforms consume the horizontal scroll offset. */
  protected applyDockingProxyScrollOffsets(scrollLeft: number): void {
    const value = `${scrollLeft}px`;
    this.syncDockingScrollOffsetVariable(scrollLeft);

    Object.values(this.rowsCache).forEach((cacheEntry) => {
      const row = cacheEntry.rowNode?.[0];
      if (!row?.classList.contains('slick-row-docked') || !cacheEntry.cellRegions) {
        return;
      }
      this.applyDockingScrollOffsetToRow(row, cacheEntry);
      if (row.classList.contains('slick-row-full-width-group')) {
        const fullWidthGroupCell =
          cacheEntry.cellNodesByColumnIdx.find((cell) => cell?.classList.contains('slick-cell-full-width-group')) ||
          (row.querySelector(':scope > .slick-cell-full-width-group') as HTMLElement | null);
        fullWidthGroupCell?.style.setProperty('transform', `translate3d(${value}, 0, 0)`);
      }
    });

    for (const docking of [...this.dockingLayout.left, ...this.dockingLayout.right]) {
      // The header roots are translated by -scrollLeft together with the
      // canvas. Permanent pinned chrome must receive the matching positive
      // compositor offset or it will scroll away with the center columns.
      if (!docking.sticky) {
        this.dockingChromeByColumn.get(docking.index)?.forEach((element) => {
          element.style.transform = `translateX(${scrollLeft}px)`;
        });
      }
    }
  }

  /** Updates pinned and sticky header, header-row, and footer chrome offsets. */
  protected applyDockingChromeScrollOffsets(): void {
    if (this.hasDockingHorizontalScroller()) {
      return;
    }
    const viewportWidth = this._viewportScrollContainerX?.clientWidth || this.viewportW;
    for (const docking of [...this.dockingLayout.left, ...this.dockingLayout.right]) {
      const naturalOffset = docking.sticky
        ? this.dockingLayout.leftBaseWidth + docking.naturalOffset
        : docking.band === 'left'
          ? docking.offset
          : this.dockingLayout.contentWidth - this.dockingLayout.rightWidth + docking.offset;
      const dockedOffset =
        docking.band === 'left'
          ? this.scrollLeft + docking.offset
          : this.scrollLeft + viewportWidth - this.dockingLayout.rightWidth + docking.offset;
      this.dockingChromeByColumn
        .get(docking.index)
        ?.forEach((element) => (element.style.transform = `translateX(${dockedOffset - naturalOffset}px)`));
    }
  }

  /** Applies docking classes, widths, and transforms to the rendered column chrome. */
  protected applyDockingToColumnChrome(): void {
    if (!this.usesDockingChromeRegions()) {
      return;
    }
    this.syncDockingChromeRegions();
    this.dockingChromeByColumn.clear();
    // Chrome is clipped by the header scroller, not by the proxy, whose width can be
    // stale during a browser resize.
    const viewportWidth = this.getViewportInnerWidth() || this._headerScrollerL?.clientWidth || this._viewportScrollContainerX?.clientWidth || this.viewportW;
    const columnIndexOf = (element: HTMLElement) => /(?:^|\s)l(\d+)(?:\s|$)/.exec(element.className)?.[1] ?? '';
    const headersById = this.indexChromeElements(this._headerL, '.slick-header-column', (element) => element.dataset.id ?? '');
    const headerRowByIndex = this.indexChromeElements(this._headerRowL, '.slick-headerrow-column', columnIndexOf);
    const footerRowByIndex = this.indexChromeElements(this._footerRowL, '.slick-footerrow-column', columnIndexOf);
    const leftEdgeIndex = this.dockingLayout.left[this.dockingLayout.left.length - 1]?.index;
    const rightEdgeIndex = this.dockingLayout.right[0]?.index;
    const usesStickyPath = this.usesStickyColumnTransformPath();

    // Pass 1 (writes only): docking classes, the chrome cache and margin resets.
    const entries = this.columns.map((column, index) => {
      const docking = this.dockingByColumn.get(index);
      const band: ColumnDockingBand = docking?.band || 'center';
      const usesStickyTransform = usesStickyPath && !!column.sticky;
      const header = headersById.get(String(column.id));
      const elements = [header, headerRowByIndex.get(String(index)), footerRowByIndex.get(String(index))].filter(Boolean) as HTMLElement[];
      const isLeftEdge = !usesStickyTransform && band === 'left' && index === leftEdgeIndex;
      this.dockingChromeByColumn.set(index, elements);
      elements.forEach((element) => {
        element.classList.toggle('slick-column-pinned-left', !usesStickyTransform && band === 'left');
        element.classList.toggle('slick-column-pinned-right', !usesStickyTransform && band === 'right');
        element.classList.toggle('slick-docking-chrome-right', !usesStickyTransform && band === 'right' && !this._options.rtl);
        element.classList.toggle('slick-column-pinned-left-edge', isLeftEdge);
        element.classList.toggle('slick-column-pinned-right-edge', !usesStickyTransform && band === 'right' && index === rightEdgeIndex);
        if (!usesStickyTransform) {
          this.clearStickyColumnTransform(element, 'column');
          element.classList.toggle('slick-column-sticky', !!docking?.sticky);
        }
        if (element === header) {
          element.style.marginLeft = '';
          element.style.marginRight = '';
        }
      });
      return { column, index, docking, band, usesStickyTransform, header, elements, isLeftEdge };
    });

    // Pass 2 (reads only): measure after every class change and before any geometry write,
    // so the pass forces at most one layout instead of one per column.
    // A cell's padding and borders come from its classes, not from its column, so cells that
    // look alike share one measurement. Without this the pass called getComputedStyle() twice
    // per column, which dominated its cost on a wide grid.
    const horizontalBoxByClassName = new Map<string, number>();
    const horizontalBoxOf = (element: HTMLElement) => {
      const key = element.className;
      let box = horizontalBoxByClassName.get(key);
      if (box === undefined) {
        const style = getComputedStyle(element);
        box =
          parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        horizontalBoxByClassName.set(key, box);
      }
      return box;
    };

    const measurements = entries.map(({ header, elements, isLeftEdge }) => {
      const headerOuterWidth = header?.getBoundingClientRect().width || 0;
      const horizontalBoxes = new Map<HTMLElement, number>();
      elements.forEach((element) => {
        if (element !== header) {
          horizontalBoxes.set(element, horizontalBoxOf(element));
        }
      });
      let separatorWidth = 0;
      if (header && isLeftEdge) {
        const style = getComputedStyle(header);
        separatorWidth = parseFloat(this._options.rtl ? style.borderLeftWidth : style.borderRightWidth) || 0;
      }
      return { headerOuterWidth, horizontalBoxes, separatorWidth };
    });

    // Pass 3 (writes only): widths and placement.
    entries.forEach(({ column, index, docking, band, usesStickyTransform, header, elements }, position) => {
      const { headerOuterWidth, horizontalBoxes, separatorWidth } = measurements[position];
      elements.forEach((element) => {
        const isHeader = element === header;
        if (!isHeader) {
          // Header-row and footer cells get an explicit content-box width so their outer width
          // matches the header column; a pinned edge keeps the theme's border-box geometry.
          const targetOuterWidth = headerOuterWidth || column.width || 0;
          const isPinnedEdge =
            element.classList.contains('slick-column-pinned-left-edge') || element.classList.contains('slick-column-pinned-right-edge');
          element.style.boxSizing = isPinnedEdge ? 'border-box' : 'content-box';
          element.style.width = `${Math.max(0, isPinnedEdge ? targetOuterWidth : targetOuterWidth - (horizontalBoxes.get(element) || 0))}px`;
        }
        this.placeDockedChromeElement(element, isHeader, index, docking, band, usesStickyTransform, viewportWidth, separatorWidth);
      });
    });
  }

  /** Collects the chrome elements under a root, keyed by column id or index. */
  protected indexChromeElements(
    root: HTMLElement | undefined,
    selector: string,
    keyOf: (element: HTMLElement) => string
  ): Map<string, HTMLElement> {
    const elements = new Map<string, HTMLElement>();
    root?.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      const key = keyOf(element);
      if (key && !elements.has(key)) {
        elements.set(key, element);
      }
    });
    return elements;
  }

  /** Positions one header, header-row or footer element for its resolved docking band. */
  protected placeDockedChromeElement(
    element: HTMLElement,
    isHeader: boolean,
    index: number,
    docking: Pick<DockedColumn, 'band' | 'naturalOffset' | 'offset' | 'sticky' | 'width'> | undefined,
    band: ColumnDockingBand,
    usesStickyTransform: boolean,
    viewportWidth: number,
    separatorWidth: number
  ): void {
    if (usesStickyTransform) {
      element.style.removeProperty('--slick-docking-chrome-offset');
      element.style.position = isHeader ? '' : 'absolute';
      element.style.left = isHeader ? '' : `${this.dockingLayout.leftBaseWidth + (docking?.naturalOffset || 0)}px`;
      element.style.right = isHeader
        ? ''
        : `${this.dockingLayout.contentWidth - this.dockingLayout.leftBaseWidth - (docking?.naturalOffset || 0) - (docking?.width || 0)}px`;
      element.style.order = '0';
      element.style.transform = '';
      this.applyStickyColumnTransform(element, index, 'column');
      return;
    }
    if (!docking || band === 'center') {
      const centerOffset = this.usesStickyColumnTransformPath() && !this.columns[index]?.pinned ? docking?.naturalOffset || 0 : docking?.offset || 0;
      element.style.removeProperty('--slick-docking-chrome-offset');
      element.style.position = '';
      element.style.left = isHeader ? '' : `${this.dockingLayout.leftBaseWidth + centerOffset}px`;
      element.style.right = isHeader
        ? ''
        : `${this.dockingLayout.contentWidth - this.dockingLayout.leftBaseWidth - centerOffset - (docking?.width || 0)}px`;
      element.style.order = '0';
      element.style.transform = '';
      return;
    }

    // The display-contents left wrapper already supplies the grouped edge
    // offset; only cancel the translated root layer here.
    if (band === 'left') {
      element.style.position = isHeader ? 'relative' : 'absolute';
      element.style.left = isHeader ? '' : `${docking.offset}px`;
      element.style.right = 'auto';
      element.style.order = '0';
      if (isHeader && separatorWidth) {
        if (this._options.rtl) {
          element.style.marginLeft = `-${separatorWidth}px`;
        } else {
          element.style.marginRight = `-${separatorWidth}px`;
        }
      }
      element.style.setProperty('--slick-docking-chrome-offset', '0px');
      element.style.transform = 'translateX(0px)';
      return;
    }

    const isRightDockedChrome = !this._options.rtl;
    const naturalOffset = docking.sticky
      ? this.dockingLayout.leftBaseWidth + docking.naturalOffset
      : this.dockingLayout.contentWidth - this.dockingLayout.rightWidth + docking.offset;
    const dockedOffset = this.scrollLeft + viewportWidth - this.dockingLayout.rightWidth + docking.offset;

    // Right-docked chrome is placed at the visible viewport coordinate; its parent layer
    // is translated by -scrollLeft, so it stays at the right edge in band order.
    element.style.position = isRightDockedChrome ? 'absolute' : isHeader ? 'relative' : 'absolute';
    element.style.left =
      isHeader && !isRightDockedChrome ? '' : `${isRightDockedChrome ? this.getRightDockedChromeLeft(element, docking) : naturalOffset}px`;
    element.style.right = 'auto';
    element.style.order = docking.sticky ? '0' : '1';
    // The container is translated by -scrollLeft once per frame; the natural-to-docked
    // delta is kept separately so CSS can add the current scroll position.
    element.style.setProperty('--slick-docking-chrome-offset', `${isRightDockedChrome ? 0 : dockedOffset - naturalOffset - this.scrollLeft}px`);
    element.style.transform = isRightDockedChrome ? 'translateX(0px)' : `translateX(${dockedOffset - naturalOffset}px)`;
  }

  /** Move header/filter/footer cells to their current persistent docking bands. */
  protected syncDockingChromeRegions(): void {
    if (!this.usesDockingChromeRegions()) {
      return;
    }

    const syncRegionSet = (
      root: HTMLElement | undefined,
      regions: Record<ColumnDockingBand, HTMLDivElement> | undefined,
      selector: string,
      getColumnIndex: (element: HTMLElement) => number
    ) => {
      if (!root || !regions) {
        return;
      }

      Array.from(root.querySelectorAll(selector)).forEach((node) => {
        const element = node as HTMLElement;
        const columnIndex = getColumnIndex(element);
        if (columnIndex < 0 || columnIndex >= this.columns.length) {
          return;
        }
        const targetBand =
          this.usesStickyColumnTransformPath() && this.columns[columnIndex]?.sticky ? 'center' : this.getColumnDockingBand(columnIndex);
        const targetRegion = regions[targetBand];
        if (element.parentElement !== targetRegion) {
          targetRegion.appendChild(element);
        }
      });

      Object.values(regions).forEach((region) => {
        const elements = Array.from(region.children).filter((element) => element.matches(selector)) as HTMLElement[];
        elements.sort((a, b) => getColumnIndex(a) - getColumnIndex(b)).forEach((element) => region.appendChild(element));
      });
    };

    syncRegionSet(this._headerL, this.dockingHeaderRegions, '.slick-header-column', (element) =>
      this.getColumnIndex(element.dataset.id || '')
    );
    syncRegionSet(this._headerRowL, this.dockingHeaderRowRegions, '.slick-headerrow-column', (element) => {
      const match = element.className.match(/(?:^|\s)l(\d+)(?:\s|$)/);
      return match ? Number(match[1]) : -1;
    });
    syncRegionSet(this._footerRowL, this.dockingFooterRowRegions, '.slick-footerrow-column', (element) => {
      const match = element.className.match(/(?:^|\s)l(\d+)(?:\s|$)/);
      return match ? Number(match[1]) : -1;
    });
  }

  /**
   * Return the local CSS `left` coordinate that places a right-pinned chrome
   * cell at its visible viewport edge.
   */
  protected getRightDockedChromeLeft(element: HTMLElement, docking: Pick<ColumnDockingLayout['right'][number], 'offset'>): number {
    const chromeScroller = element.classList.contains('slick-headerrow-column')
      ? this._headerRowScrollerL
      : element.classList.contains('slick-footerrow-column')
        ? this._footerRowScrollerL
        : this._headerScrollerL;
    const directParent = element.parentElement as HTMLElement | null;
    const chromeContainer =
      directParent?.style.display === 'contents'
        ? element.classList.contains('slick-headerrow-column')
          ? this._headerRowL
          : element.classList.contains('slick-footerrow-column')
            ? this._footerRowL
            : this._headerL
        : directParent;
    if (!chromeScroller || !chromeContainer) {
      return (
        this.scrollLeft + (this._viewportScrollContainerX?.clientWidth || this.viewportW) - this.dockingLayout.rightWidth + docking.offset
      );
    }

    const scrollerRect = chromeScroller.getBoundingClientRect();
    // Chrome has no vertical scrollbar but the body does: right pins stop at the body's
    // visible edge, not the wider chrome edge.
    const dockingViewportWidth = this.getViewportInnerWidth() || this._viewportNode?.clientWidth || chromeScroller.clientWidth;
    // getBoundingClientRect() reports screen pixels, which a CSS scale on any ancestor
    // multiplies, while every other term here is a layout pixel. Convert the one measured
    // distance back to layout pixels; the factor is 1 for an unscaled grid.
    const scale = chromeScroller.offsetWidth ? scrollerRect.width / chromeScroller.offsetWidth : 1;
    // The chrome container itself is translated by -scrollLeft. Add it back
    // before converting the target position to the container's local `left`.
    const containerLeftInScroller =
      (chromeContainer.getBoundingClientRect().left - scrollerRect.left) / (scale || 1) + this.scrollLeft;
    const visibleRightStart = dockingViewportWidth - this.dockingLayout.rightWidth + docking.offset;
    return visibleRightStart - containerLeftInScroller;
  }

  /** Removes the temporary styles used while measuring automatic header height. */
  protected clearAutoHeaderHeightStyles(headers: HTMLDivElement[]): void {
    headers.forEach((header) => {
      header.style.removeProperty('--slick-auto-header-height');
      header.style.height = '';
    });
  }

  /** Applies the measured automatic header height to the supplied header elements. */
  protected setAutoHeaderHeightStyles(height: number, headers: HTMLDivElement[]): void {
    headers.forEach((header) => {
      header.style.setProperty('--slick-auto-header-height', `${height}px`);
      header.style.height = `${height}px`;
    });
  }

  /** Initializes the single-viewport layout and its optional docking scroller regions. */
  protected activateSingleViewportLayout(): void {
    this._headerScroller = [this._headerScrollerL];
    this._headers = [this._headerL];
    this._headerRowScroller = [this._headerRowScrollerL];
    this._headerRows = [this._headerRowL];
    this._topPanelScrollers = [this._topPanelScrollerL];
    this._topPanels = [this._topPanelL];
    this._viewport = [this._viewportNode];
    this._canvas = [this._canvasNode];
    // Ordinary grids keep the viewport as the horizontal scroll owner; the dedicated
    // scrollbar exists only once pinning/sticky docking is configured.
    if (this.hasConfiguredDocking()) {
      this.createDockingChromeRegions();
      this._container.classList.add('slick-docking-horizontal-scroll-proxy');
      this._dockingHorizontalScroller ??= Utils.createDomElement(
        'div',
        { className: 'slick-docking-horizontal-scroller', tabIndex: 0, ariaLabel: 'Horizontal grid scroll' },
        this._contentRoot
      );
      this._dockingHorizontalSpacer ??= Utils.createDomElement(
        'div',
        { className: 'slick-docking-horizontal-spacer' },
        this._dockingHorizontalScroller
      );
    }
    if (this._footerRowL) {
      this._footerRowScroller = [this._footerRowScrollerL];
      this._footerRow = [this._footerRowL];
    }
  }

  /** Remove the proxy scrollbar and docking wrappers when all docking is cleared. */
  protected deactivateSingleViewportLayout(): void {
    this._bindingEventService.unbindAll('docking-horizontal-scroll');
    this._dockingHorizontalScroller?.remove();
    this._dockingHorizontalScroller = undefined;
    this._dockingHorizontalSpacer = undefined;
    this._container.classList.remove('slick-docking-horizontal-scroll-proxy');

    if (this.dockingHeaderRegions) {
      this.resetDockingChromeRegionSet(this._headerL, 'slick-header-columns', 'left');
      this.dockingHeaderRegions = undefined;
    }
    if (this.dockingHeaderRowRegions) {
      this.resetDockingChromeRegionSet(this._headerRowL, 'slick-headerrow-columns', 'left');
      this.dockingHeaderRowRegions = undefined;
    }
    if (this.dockingFooterRowRegions && this._footerRowL) {
      this.resetDockingChromeRegionSet(this._footerRowL, 'slick-footerrow-columns', 'left');
      this.dockingFooterRowRegions = undefined;
    }
    this.setScroller();
    this.setOverflow();
  }

  /** Docking owns horizontal scroll through one dedicated scrollbar. */
  protected hasDockingHorizontalScroller(): boolean {
    return !!this._dockingHorizontalScroller;
  }

  /** Whether the grid needs the three-band chrome/row DOM. */
  protected hasConfiguredDocking(): boolean {
    return this.hasConfiguredColumnDocking() || this.hasConfiguredRowDocking();
  }

  /** Column docking is opt-in; ordinary grids retain the flat DOM. */
  protected hasConfiguredColumnDocking(): boolean {
    const configuredColumns = this._options.pinning?.columns;
    return !!(
      this.normalizeColumnPinningReferences(configuredColumns?.left, 'left', this.columns).length ||
      this.normalizeColumnPinningReferences(configuredColumns?.right, 'right', this.columns).length ||
      this.columns.some((column) => !!column && (column.pinned || column.sticky))
    );
  }

  /** Whether chrome currently uses persistent docking wrappers. */
  protected usesDockingChromeRegions(): boolean {
    return !!this.dockingHeaderRegions;
  }

  /** Create stable left/center/right descendants without changing chrome layout. */
  protected createDockingChromeRegions(): void {
    this.dockingHeaderRegions = this.createDockingChromeRegionSet(this._headerL, 'slick-header-columns');
    this.dockingHeaderRowRegions = this.createDockingChromeRegionSet(this._headerRowL, 'slick-headerrow-columns');
    if (this._footerRowL) {
      this.dockingFooterRowRegions = this.createDockingChromeRegionSet(this._footerRowL, 'slick-footerrow-columns');
    }
  }

  /** Clears a docking chrome region set and restores its requested side class. */
  protected resetDockingChromeRegionSet(
    root: HTMLDivElement,
    className: 'slick-header-columns' | 'slick-headerrow-columns' | 'slick-footerrow-columns',
    side: 'left' | 'right'
  ): void {
    this.notifyChromeCellsDestroy(root, className);
    Utils.emptyElement(root);
    root.classList.remove('slick-docking-chrome', `${className}-root`, `${className}-center`, `${className}-right`, `${className}-left`);
    root.classList.add(`${className}-${side}`);
    root.classList.add(className);
  }

  /** Creates the left, center, and right descendants used by a docking chrome root. */
  /**
   * Fires the matching `onBefore*CellDestroy` event for every chrome cell still present in a
   * header, header-row or footer root. Called by the region helpers right before they empty
   * the root, so the events fire on the initial build, on lazy docking activation and on
   * deactivation alike.
   */
  protected notifyChromeCellsDestroy(
    root: HTMLDivElement,
    className: 'slick-header-columns' | 'slick-headerrow-columns' | 'slick-footerrow-columns'
  ): void {
    const cellSelector =
      className === 'slick-header-columns'
        ? '.slick-header-column'
        : className === 'slick-headerrow-columns'
          ? '.slick-headerrow-column'
          : '.slick-footerrow-column';
    const destroyEvent =
      className === 'slick-header-columns'
        ? this.onBeforeHeaderCellDestroy
        : className === 'slick-headerrow-columns'
          ? this.onBeforeHeaderRowCellDestroy
          : this.onBeforeFooterRowCellDestroy;
    root.querySelectorAll<HTMLElement>(cellSelector).forEach((cell) => {
      const columnDef = Utils.storage.get(cell, 'column');
      if (columnDef) {
        this.trigger(destroyEvent, { node: cell, column: columnDef, grid: this });
      }
    });
  }

  protected createDockingChromeRegionSet(
    root: HTMLDivElement,
    className: 'slick-header-columns' | 'slick-headerrow-columns' | 'slick-footerrow-columns'
  ): Record<ColumnDockingBand, HTMLDivElement> {
    this.notifyChromeCellsDestroy(root, className);
    Utils.emptyElement(root);
    // Keep bands as direct root children so the legacy chrome selector contract remains usable.
    root.classList.remove(className, `${className}-left`, `${className}-right`);
    root.classList.add('slick-docking-chrome', `${className}-root`);
    const createRegion = (band: ColumnDockingBand) =>
      Utils.createDomElement(
        'div',
        {
          className: `${className} ${className}-${band}`,
          role: 'presentation',
          style: { display: 'contents' },
        },
        root
      );
    return { left: createRegion('left'), center: createRegion('center'), right: createRegion('right') };
  }

  /** Return the persistent chrome wrapper for a docking band. */
  protected getDockingChromeRegion(type: 'header' | 'headerRow' | 'footerRow', band: ColumnDockingBand): HTMLDivElement {
    const regions =
      type === 'header' ? this.dockingHeaderRegions : type === 'headerRow' ? this.dockingHeaderRowRegions : this.dockingFooterRowRegions;
    const fallback = type === 'header' ? this._headerL : type === 'headerRow' ? this._headerRowL : this._footerRowL;
    return regions?.[band] || fallback;
  }

  /** Whether row pinning or stickiness was configured. */
  protected hasConfiguredRowDocking(): boolean {
    const pinnedRows = this._options.pinning?.rows;
    const stickyRows = this._options.stickyRows;
    return !!(
      pinnedRows?.top?.length ||
      pinnedRows?.bottom?.length ||
      stickyRows?.top?.length ||
      stickyRows?.bottom?.length ||
      stickyRows?.both?.length
    );
  }

  /** Create the row overlay once for a configured row-docking grid. */
  protected ensureDockingOverlay(): HTMLDivElement {
    this._dockingOverlay ??= Utils.createDomElement('div', { className: 'slick-docking-overlay', role: 'presentation' }, this._contentRoot);
    if (this.initialized) {
      this.bindDockingOverlayEvents();
      if (this._options.enableMouseWheelScrollHandler && !this.dockingOverlayMouseWheelBound) {
        this.slickMouseWheelInstances.push(
          MouseWheel({
            element: this._dockingOverlay,
            onMouseWheel: this.handleMouseWheel.bind(this),
          })
        );
        this.dockingOverlayMouseWheelBound = true;
      }
    }
    return this._dockingOverlay;
  }

  /** Bind the overlay's cell interactions consistently with the canvas. */
  protected bindDockingOverlayEvents(): void {
    if (!this._dockingOverlay) {
      return;
    }
    if (this._bindingEventService.getBoundedEvents().some((event) => event.groupName === 'docking-overlay')) {
      return;
    }
    const events: Array<[string, EventListener]> = [
      ['keydown', this.handleKeyDown.bind(this) as EventListener],
      ['click', this.handleClick.bind(this) as EventListener],
      ['dblclick', this.handleDblClick.bind(this) as EventListener],
      ['contextmenu', this.handleContextMenu.bind(this) as EventListener],
      ['mouseover', this.handleCellMouseOver.bind(this) as EventListener],
      ['mouseout', this.handleCellMouseOut.bind(this) as EventListener],
    ];
    events.forEach(([eventName, listener]) =>
      this._bindingEventService.bind(this._dockingOverlay!, eventName, listener, {}, 'docking-overlay')
    );
  }

  /** Cancels the pending auto-scroll timer, if one is active. */
  protected clearAutoScrollTimer(): void {
    if (this._columnResizeAutoScrollTimer) {
      clearInterval(this._columnResizeAutoScrollTimer);
      this._columnResizeAutoScrollTimer = undefined;
    }
  }

  /** Clears cached DOM references that must not survive a grid teardown. */
  protected clearInternalDomCaches(): void {
    this.activeCellNode = null;
    this.rowsCache = {};
    this.postProcessedRows = {};
    this.postProcessedCleanupQueue.length = 0;
  }

  /** Returns the visible column indexes in the source column array. */
  protected getVisibleColumnIndexes(columns: C[] = this.columns): number[] {
    return columns.reduce<number[]>((indexes, column, index) => {
      if (column && !column.hidden) {
        indexes.push(index);
      }
      return indexes;
    }, []);
  }

  // General

  /** Triggers a SlickGrid event and returns its event-data wrapper. */
  protected trigger<ArgType = any>(evt: SlickEvent_, args?: ArgType, e?: Event | SlickEventData_): SlickEventData_<any> {
    const sed: SlickEventData_ = (e || new SlickEventData(e, args)) as SlickEventData_;
    const eventArgs = (args || {}) as ArgType & { grid: SlickGrid<TData, C, O> };
    eventArgs.grid = this;
    return evt.notify(eventArgs, sed, this);
  }

  /**
   * Applies the unified permanent column pinning option. Column references may
   * be numeric edge shorthands, ids, or zero-based indexes; left pinning wins
   * if a reference appears in both lists.
   */
  protected applyColumnPinningOptions(columns: C[]): void {
    const configuredColumns = this._options.pinning?.columns;

    if (configuredColumns !== undefined) {
      const leftIndexes = new Set(this.normalizeColumnPinningReferences(configuredColumns.left, 'left', columns));
      const rightIndexes = new Set(this.normalizeColumnPinningReferences(configuredColumns.right, 'right', columns));

      columns.forEach((column, index) => {
        if (!column) {
          return;
        }
        if (!this.pinningColumnsState.has(column.id)) {
          this.pinningColumnsState.set(column.id, column.pinned);
        }


        const isLeftPinned = leftIndexes.has(index);
        const isRightPinned = rightIndexes.has(index);
        column.pinned = isLeftPinned ? 'left' : isRightPinned ? 'right' : null;
      });
      return;
    }

    // If the unified option was removed, restore only the values it changed.
    columns.forEach((column) => {
      if (!column || !this.pinningColumnsState.has(column.id)) {
        return;
      }
      const originalPinned = this.pinningColumnsState.get(column.id) ?? null;
      // Multiple grids may intentionally share the same column definitions.
      // If an earlier grid already removed the declarative pin, do not restore
      // this grid's stale snapshot and re-pin the shared column on clear.
      column.pinned = column.pinned === null && originalPinned !== null ? null : originalPinned;
      this.pinningColumnsState.delete(column.id);
    });
  }

  /** Resolve pinning options or column flags into visible indexes by edge. */
  protected getPinnedColumnIndexes(configuredColumns?: PinnedColumns, columnDefinitions: C[] = this.columns): Map<number, DockingSide> {
    const pinnedIndexes = new Map<number, DockingSide>();
    const configured = configuredColumns ?? this._options.pinning?.columns;
    if (configured !== undefined) {
      const leftIndexes = this.normalizeColumnPinningReferences(configured.left, 'left', columnDefinitions);
      const rightIndexes = this.normalizeColumnPinningReferences(configured.right, 'right', columnDefinitions);
      leftIndexes.forEach((index) => {
        if (!columnDefinitions[index]?.hidden) {
          pinnedIndexes.set(index, 'left');
        }
      });
      rightIndexes.forEach((index) => {
        if (!columnDefinitions[index]?.hidden && !pinnedIndexes.has(index)) {
          pinnedIndexes.set(index, 'right');
        }
      });
      return pinnedIndexes;
    }

    columnDefinitions.forEach((column, index) => {

      if (!column?.hidden && (column.pinned === 'left' || column.pinned === 'right')) {
        pinnedIndexes.set(index, column.pinned);
      }
    });
    return pinnedIndexes;
  }

  /** Keep a scrollable center column and reject bands that consume the viewport. */
  protected validatePinnedColumnIndexes(pinnedIndexes: Map<number, DockingSide>, forceAlert = false, columns: C[] = this.columns): boolean {
    if (this._options.skipPinningValidation) {
      return true;
    }

    if (!this.validateColspanPinningSequence(pinnedIndexes, forceAlert, columns)) {
      return false;
    }

    const visibleIndexes = this.getVisibleColumnIndexes(columns);
    if (visibleIndexes.length && visibleIndexes.every((index) => pinnedIndexes.has(index))) {
      if ((forceAlert || !this._invalidPinningAlerted) && this._options.invalidColumnPinningPickerCallback) {
        this._options.invalidColumnPinningPickerCallback(this._options.invalidColumnPinningPickerMessage!);
        this._invalidPinningAlerted = true;
      }
      return false;
    }

    const widths = { left: 0, right: 0 };
    pinnedIndexes.forEach((side, index) => {
      const column = columns[index];
      if (!column || column.hidden) {
        return;
      }
      const { minWidth = 0, maxWidth = 0, width = this._options.defaultColumnWidth! } = column;
      let effectiveWidth = Math.max(width, minWidth);
      if (maxWidth > 0) {
        effectiveWidth = Math.min(effectiveWidth, maxWidth);
      }
      widths[side] += effectiveWidth;
    });

    const viewportWidth = this._viewportNode?.clientWidth || this.getViewportInnerWidth() || Utils.width(this._container) || 0;
    // Include the reserved scrollbar strip; clientWidth excludes it while the
    // legacy validation compared against the outer grid width.
    const scrollbarWidth = this.viewportHasVScroll ? this.scrollbarDimensions?.width || 0 : 0;
    const outerGridWidth = Utils.width(this._container) || 0;
    const availablePinningWidth = Math.max(viewportWidth + scrollbarWidth, outerGridWidth);
    if (viewportWidth > 0 && widths.left + widths.right > availablePinningWidth) {
      if ((forceAlert || !this._invalidPinningAlerted) && this._options.invalidColumnPinningWidthCallback) {
        this._options.invalidColumnPinningWidthCallback(this._options.invalidColumnPinningWidthMessage!);
        this._invalidPinningAlerted = true;
      }
      return false;
    }
    return true;
  }

  /**
   * Every row index whose metadata may declare a colspan. Falls back to the rendered rows
   * when the dataset does not expose a length, so a custom data provider is never asked for
   * rows it has not been told about.
   */
  protected rowMetadataIndexes(): number[] {
    if (!('getItemMetadata' in this.data)) {
      return [];
    }
    const length = this.getDataLength();
    if (!isDefinedNumber(length) || length <= 0) {
      return Object.keys(this.rowsCache).map(Number);
    }
    return Array.from({ length }, (_value, row) => row);
  }

  /** Reject only non-sequential pinning that would visually split a colspan. */
  protected validateColspanPinningSequence(
    pinnedIndexes: Map<number, DockingSide>,
    forceAlert = false,
    columns: C[] = this.columns
  ): boolean {
    const visibleIndexes = this.getVisibleColumnIndexes(columns);

    let previousBandOrder = 0;
    const isSequential = visibleIndexes.every((index) => {
      const band = pinnedIndexes.get(index) || 'center';
      const bandOrder = band === 'left' ? 0 : band === 'center' ? 1 : 2;
      if (bandOrder < previousBandOrder) {
        return false;
      }
      previousBandOrder = bandOrder;
      return true;
    });
    if (isSequential) {
      return true;
    }

    // Only a non-sequential request gets this far, which is rare and user-initiated, so the
    // scan covers every row rather than just the rendered ones: a colspan that a pinning
    // would split is a problem whether or not it happens to be on screen right now. The
    // search stops at the first one it finds.
    const hasCrossBandColspan = this.rowMetadataIndexes().some((row) => {
      const metadata = this.getItemMetadaWhenExists(row);
      if (!metadata?.columns || metadata.isGroup) {
        return false;
      }

      return Object.entries(metadata.columns).some(([columnRef, columnMetadata]) => {
        const columnIndex = Number(columnRef);
        const start = Number.isNaN(columnIndex) ? this.getColumnIndex(columnRef) : columnIndex;
        const span = columnMetadata?.colspan === '*' ? columns.length - start : Number(columnMetadata?.colspan || 1);
        if (!isDefinedNumber(start) || span <= 1) {
          return false;
        }
        const end = Math.min(columns.length - 1, start + span - 1);
        let firstBand: ColumnDockingBand | undefined;
        return visibleIndexes.some((index) => {
          if (index < start || index > end) {
            return false;
          }
          const band = pinnedIndexes.get(index) || 'center';
          if (!firstBand) {
            firstBand = band;
            return false;
          }
          return band !== firstBand;
        });
      });
    });

    if (!hasCrossBandColspan) {
      return true;
    }

    if ((forceAlert || !this._invalidPinningAlerted) && this._options.invalidColumnPinningPickerCallback) {
      this._options.invalidColumnPinningPickerCallback(this._options.invalidColumnPinningSequenceMessage!);
      this._invalidPinningAlerted = true;
    }
    return false;
  }

  /** Merge a partial pinning update before validating it. */
  protected getProspectivePinnedColumnIndexes(incomingColumns: PinnedColumns): Map<number, DockingSide> {
    const currentColumns = this._options.pinning?.columns;
    return this.getPinnedColumnIndexes({
      left: incomingColumns.left !== undefined ? incomingColumns.left : currentColumns?.left,
      right: incomingColumns.right !== undefined ? incomingColumns.right : currentColumns?.right,
    });
  }

  /**
   * Resolve column pinning references to raw column indexes. Numeric references are
   * indexes, never ids, and edge shorthands count visible columns only.
   */
  protected normalizeColumnPinningReferences(
    references: ColumnPinningReferences | undefined,
    side: DockingSide,
    columns: C[]
  ): number[] {
    if (Array.isArray(references)) {
      return references.flatMap((reference) => {
        if (typeof reference === 'number') {
          return Number.isInteger(reference) && reference >= 0 && reference < columns.length ? [reference] : [];
        }
        const index = columns.findIndex((column) => column && String(column.id) === reference);
        return index >= 0 ? [index] : [];
      });
    }
    if (typeof references !== 'number' || !Number.isInteger(references) || references < 0) {
      return [];
    }

    const visibleIndexes = columns.reduce<number[]>((indexes, column, index) => {
      if (column && !column.hidden) {
        indexes.push(index);
      }
      return indexes;
    }, []);
    if (!visibleIndexes.length) {
      return [];
    }

    const requestedCount = side === 'left' ? references + 1 : references;
    const count = Math.min(requestedCount, visibleIndexes.length);
    if (count === 0) {
      return [];
    }
    return side === 'left' ? visibleIndexes.slice(0, count) : visibleIndexes.slice(-count);
  }

  /** Rebuild the virtual-rendering coordinates from the already-resolved docking layout. */
  protected updateColumnPositionCaches(): void {
    // Pre-calculate cell boundaries.
    this.columnPosLeft = [];
    this.columnPosRight = [];
    for (let i = 0, ii = this.columns.length; i < ii; i++) {
      if (this.columns[i]) {
        const docked = this.dockingByColumn.get(i);
        if (!this.columns[i].hidden) {
          const offset = this.usesStickyColumnTransformPath() && !this.columns[i].pinned ? docked?.naturalOffset || 0 : docked?.offset || 0;
          this.columnPosLeft[i] = offset;
          this.columnPosRight[i] = offset + (this.columns[i].width || 0);
        }
      }
    }

    // Give hidden columns zero-width boundaries so span endpoints stay monotonic.
    for (let i = 0, ii = this.columns.length; i < ii; i++) {
      if (!this.columns[i] || !this.columns[i].hidden) {
        continue;
      }
      let previousVisible = i - 1;
      while (previousVisible >= 0 && this.columns[previousVisible]?.hidden) {
        previousVisible--;
      }
      let nextVisible = i + 1;
      while (nextVisible < ii && this.columns[nextVisible]?.hidden) {
        nextVisible++;
      }

      const previousBand = previousVisible >= 0 ? this.getColumnDockingBand(previousVisible) : undefined;
      const nextBand = nextVisible < ii ? this.getColumnDockingBand(nextVisible) : undefined;
      const band = previousBand ?? nextBand ?? 'center';
      const boundary =
        previousBand === band ? this.columnPosRight[previousVisible] : nextBand === band ? this.columnPosLeft[nextVisible] : 0;
      this.columnPosLeft[i] = boundary ?? 0;
      this.columnPosRight[i] = boundary ?? 0;
    }
  }

  /** Return a colspan endpoint when its endpoint column is hidden. */
  protected getColumnRangeRight(index: number, startIndex: number = index): number {
    if (!this.columns[index]?.hidden) {
      return this.columnPosRight[index] ?? 0;
    }
    const band = this.getColumnDockingBand(startIndex);
    let nextVisible = index + 1;
    while (nextVisible < this.columns.length && this.columns[nextVisible]?.hidden) {
      nextVisible++;
    }
    if (nextVisible < this.columns.length && this.getColumnDockingBand(nextVisible) === band) {
      return this.columnPosLeft[nextVisible] ?? 0;
    }
    let previousVisible = index - 1;
    while (previousVisible >= 0 && this.columns[previousVisible]?.hidden) {
      previousVisible--;
    }
    return previousVisible >= 0 && this.getColumnDockingBand(previousVisible) === band
      ? (this.columnPosRight[previousVisible] ?? 0)
      : (this.columnPosRight[index] ?? 0);
  }

  /**
   * Move already-rendered cells to their new docking region after a sticky column crosses
   * an edge; this keeps formatter output and editor state in place. Rows that predate the
   * first docked band have no region wrappers and are left to the normal render path.
   */
  protected updateRenderedCellDocking(): boolean {
    // Likewise, removing the final band needs the normal renderer to remove
    // the no-longer-needed region wrappers.
    if (!this.usesDockingRowRegions()) {
      return false;
    }

    for (const cacheEntry of Object.values(this.rowsCache)) {
      const rowNode = cacheEntry.rowNode?.[0];
      if (rowNode && !rowNode.classList.contains('slick-row-docked')) {
        return false;
      }
      if (Object.keys(cacheEntry.cellSpanFragments || {}).length) {
        return false;
      }
    }

    for (const cacheEntry of Object.values(this.rowsCache)) {
      const rowNode = cacheEntry.rowNode?.[0];
      if (!rowNode) {
        continue;
      }

      this.ensureCellNodesInRowsCache(+rowNode.dataset.row!);
      Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((columnIndex) => {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIndex)) {
          return;
        }
        const index = +columnIndex;
        const cellNode = cacheEntry.cellNodesByColumnIdx[index];
        const docking = this.dockingByColumn.get(index);
        const band = docking?.band || 'center';
        const isFullWidthGroup = rowNode.classList.contains('slick-row-full-width-group');
        const usesStickyTransform = !isFullWidthGroup && this.usesStickyColumnTransformPath() && !!this.columns[index]?.sticky;

        cellNode.classList.toggle('slick-cell-full-width-group', isFullWidthGroup);
        cellNode.classList.toggle('slick-cell-pinned-left', !usesStickyTransform && !isFullWidthGroup && band === 'left');
        cellNode.classList.toggle('slick-cell-pinned-right', !usesStickyTransform && !isFullWidthGroup && band === 'right');
        if (usesStickyTransform) {
          this.applyStickyColumnTransform(cellNode, index, 'cell');
        } else {
          this.clearStickyColumnTransform(cellNode, 'cell');
          cellNode.classList.toggle('slick-cell-sticky', !isFullWidthGroup && band !== 'center' && !!docking?.sticky);
        }

        const region = this.getRowDockingRegion(rowNode, index, cacheEntry.cellRegions);
        if (cellNode.parentElement !== region) {
          region.appendChild(cellNode);
        }
      });

      Object.values(cacheEntry.cellRegions || {}).forEach((region) => {
        const cells = Array.from(region.children) as HTMLElement[];
        cells.sort((a, b) => this.getCellFromNode(a) - this.getCellFromNode(b)).forEach((cell) => region.appendChild(cell));
      });
    }
    return true;
  }

  /** Apply one active sticky candidate without changing its DOM parent or box geometry. */
  protected applyStickyColumnTransform(element: HTMLElement, columnIndex: number, type: 'cell' | 'column'): void {
    const docking = this.dockingByColumn.get(columnIndex);
    const isActive = !!docking?.sticky && docking.band !== 'center';
    const leftEdgeIndex = this.dockingLayout.left[this.dockingLayout.left.length - 1]?.index;
    const rightEdgeIndex = this.dockingLayout.right[0]?.index;
    element.classList.toggle(`slick-${type}-pinned-left`, isActive && docking?.band === 'left');
    element.classList.toggle(`slick-${type}-pinned-right`, isActive && docking?.band === 'right');
    element.classList.toggle(`slick-${type}-sticky`, isActive);
    element.classList.toggle(`slick-${type}-sticky-left`, isActive && docking?.band === 'left');
    element.classList.toggle(`slick-${type}-sticky-right`, isActive && docking?.band === 'right');
    element.classList.toggle(`slick-${type}-sticky-left-edge`, isActive && docking?.band === 'left' && columnIndex === leftEdgeIndex);
    element.classList.toggle(`slick-${type}-sticky-right-edge`, isActive && docking?.band === 'right' && columnIndex === rightEdgeIndex);
    if (!isActive || !docking) {
      element.style.removeProperty('--slick-sticky-column-offset');
      return;
    }

    const offset =
      docking.band === 'left'
        ? docking.offset - this.dockingLayout.leftBaseWidth - docking.naturalOffset
        : docking.offset - this.dockingLayout.rightWidth - this.dockingLayout.leftBaseWidth - docking.naturalOffset;
    element.style.setProperty('--slick-sticky-column-offset', `${offset}px`);
  }

  /** Removes the transform applied to a column while it is temporarily sticky. */
  protected clearStickyColumnTransform(element: HTMLElement, type: 'cell' | 'column'): void {
    element.classList.remove(
      `slick-${type}-sticky`,
      `slick-${type}-sticky-left`,
      `slick-${type}-sticky-right`,
      `slick-${type}-sticky-left-edge`,
      `slick-${type}-sticky-right-edge`
    );
    element.style.removeProperty('--slick-sticky-column-offset');
  }

  /** Update only sticky candidates; all permanent-band and natural column geometry stays unchanged. */
  protected updateStickyColumnTransforms(): void {
    const stickyIndexes = this.columns.reduce<number[]>((indexes, column, index) => {
      if (!column.hidden && column.sticky) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    for (const cacheEntry of Object.values(this.rowsCache)) {
      const rowNode = cacheEntry.rowNode?.[0];
      if (!rowNode) {
        continue;
      }
      this.ensureCellNodesInRowsCache(+rowNode.dataset.row!);
      stickyIndexes.forEach((index) => {
        const cell = cacheEntry.cellNodesByColumnIdx[index];
        if (cell) {
          this.applyStickyColumnTransform(cell, index, 'cell');
        }

      });
    }
    stickyIndexes.forEach((index) =>
      this.dockingChromeByColumn.get(index)?.forEach((element) => this.applyStickyColumnTransform(element, index, 'column'))
    );

    const leftEdgeIndex = this.dockingLayout.left[this.dockingLayout.left.length - 1]?.index;
    const rightEdgeIndex = this.dockingLayout.right[0]?.index;
    this.columns.forEach((column, index) => {
      if (!column.pinned) {
        return;
      }
      this.dockingChromeByColumn.get(index)?.forEach((element) => {
        element.classList.toggle('slick-column-pinned-left-edge', column.pinned === 'left' && index === leftEdgeIndex);
        element.classList.toggle('slick-column-pinned-right-edge', column.pinned === 'right' && index === rightEdgeIndex);
      });
    });
  }

  /** Recomputes the resolved left and right column docking layout. */
  protected refreshDockingLayout(scrollLeft: number = this.scrollLeft, preserveUnchanged = false): boolean {
    this.dockingRowRegionsActive = this.hasConfiguredDocking();
    const previousRevision = this.dockingLayout.revision;
    this.dockingController.setOptions(this._options.docking);
    const nextLayout = this.dockingController.resolveColumns(
      this.columns,
      scrollLeft,
      // Sticky thresholds use the body viewport's visible width, which excludes the
      // vertical scrollbar gutter.
      this.getViewportInnerWidth() || this.viewportW || Utils.width(this._container) || 0,
      this._options.rtl ? 'right' : 'left'
    );
    if (preserveUnchanged && nextLayout.revision === previousRevision) {
      return false;
    }
    this.dockingLayout = nextLayout;
    this.dockingByColumn.clear();
    for (const entry of [...this.dockingLayout.left, ...this.dockingLayout.center, ...this.dockingLayout.right]) {
      this.dockingByColumn.set(entry.index, entry);
    }
    return this.dockingLayout.revision !== previousRevision;
  }

  /** Returns the resolved docking band for a column index. */
  protected getColumnDockingBand(columnIndex: number): ColumnDockingBand {
    return this.dockingByColumn.get(columnIndex)?.band || 'center';
  }

  /** Returns whether any visible column is currently docked. */
  protected hasDockedColumns(): boolean {
    return this.dockingLayout.left.length > 0 || this.dockingLayout.right.length > 0;
  }

  /** The single-viewport renderer exposes all three row regions. */
  protected usesDockingRowRegions(): boolean {
    return this.dockingRowRegionsActive;
  }

  /** Returns the stable identity used to track a rendered data row. */
  protected getRowIdentity(row: number): number | string {
    const item = this.getDataItem(row);
    const idProperty = this.getDataViewIdProperty();
    if (item && typeof item === 'object') {
      const id = (item as Record<string, unknown>)[idProperty];
      if (typeof id === 'number' || typeof id === 'string') {
        return id;
      }
    }
    return row;
  }

  /** Resolves a row identity to its current data index for docking calculations. */
  protected resolveDockingRowIndex(reference: RowReference): number | undefined {
    const isIdReference = typeof reference === 'object' && reference !== null;
    const cacheKey = isIdReference ? `id:${reference.id}` : reference;
    if (this.dockingRowIndexByReference.has(cacheKey)) {
      return this.dockingRowIndexByReference.get(cacheKey);
    }
    if (!isIdReference && typeof reference === 'number') {
      if (Number.isInteger(reference) && reference >= 0 && reference < this.getDataLength()) {
        this.dockingRowIndexByReference.set(cacheKey, reference);
        return reference;
      }
      return undefined;
    }
    const id = isIdReference ? reference.id : reference;
    const getRowById = (this.data as CustomDataView<TData> & { getRowById?: (id: number | string) => number | undefined }).getRowById;
    const dataViewRow = getRowById?.call(this.data, id);
    if (dataViewRow !== undefined) {
      this.dockingRowIndexByReference.set(cacheKey, dataViewRow);
      return dataViewRow;
    }
    const idProperty = this.getDataViewIdProperty();
    if (Array.isArray(this.data)) {
      const index = this.data.findIndex((item) => item && typeof item === 'object' && (item as Record<string, unknown>)[idProperty] === id);
      if (index >= 0) {
        this.dockingRowIndexByReference.set(cacheKey, index);
      }
      return index >= 0 ? index : undefined;
    }
    return undefined;
  }

  /** Resolves a list of row references to the row indexes the docking controller works with. */
  protected resolveDockingRowIndexes(references?: RowReference[]): number[] {
    return (references || []).map((reference) => this.resolveDockingRowIndex(reference)).filter(isDefinedNumber);
  }

  /** Returns the active DataView id property, falling back to `id`. */
  protected getDataViewIdProperty(): string {
    const dataView = this.data as CustomDataView<TData> & { getIdPropertyName?: () => string };
    return dataView.getIdPropertyName?.() || 'id';
  }

  /** Recomputes top, center, and bottom row docking for the current scroll position. */
  protected refreshRowDockingLayout(scrollTop: number = this.scrollTop, rebuildReferences = false): boolean {
    if (rebuildReferences) {
      this.dockingRowIndexByReference.clear();
    }
    const permanentRows: PinnedRows = {
      top: this.resolveDockingRowIndexes(this._options.pinning?.rows?.top),
      bottom: this.resolveDockingRowIndexes(this._options.pinning?.rows?.bottom),
    };
    const stickyRows: StickyRows = {
      top: this.resolveDockingRowIndexes(this._options.stickyRows?.top),
      bottom: this.resolveDockingRowIndexes(this._options.stickyRows?.bottom),
      both: this.resolveDockingRowIndexes(this._options.stickyRows?.both),
    };
    const references = [...permanentRows.top!, ...permanentRows.bottom!, ...stickyRows.top!, ...stickyRows.bottom!, ...stickyRows.both!] as number[];
    const rows = Array.from(new Set(references)).map(
      (index) => ({
        height: this.getRowHeight(index),
        id: this.getRowIdentity(index),
        index,
        top: this.getRowPosition(index),
      })
    );
    const previousRevision = this.rowDockingLayout.revision;
    this.rowDockingLayout = this.dockingController.resolveRows(
      rows,
      scrollTop + this.offset,
      this._viewportScrollContainerY?.clientHeight || this.viewportH,
      permanentRows,
      stickyRows
    );
    this.dockingByRow.clear();
    for (const entry of [...this.rowDockingLayout.top, ...this.rowDockingLayout.center, ...this.rowDockingLayout.bottom]) {
      this.dockingByRow.set(entry.index, entry);
    }
    const hasConfiguredRowDocking = this.hasConfiguredRowDocking();
    if (hasConfiguredRowDocking) {
      this.ensureDockingOverlay();
    }
    this.syncDockedRowContainers();
    if (!hasConfiguredRowDocking && this._dockingOverlay) {
      // Return any previously docked rows to the normal canvas first, then
      // remove the now-unused implementation layer. A grid without a row
      // docking feature should not expose a dormant overlay in its DOM.
      this._bindingEventService.unbindAll('docking-overlay');
      this._dockingOverlay.remove();
      this._dockingOverlay = undefined;
      this.dockingOverlayMouseWheelBound = false;
    }
    return this.rowDockingLayout.revision !== previousRevision;
  }

  /** Keep permanent/active docked rows outside the native scrolling canvas. */
  protected syncDockedRowContainers(): void {
    if (!this._dockingOverlay || !this._canvasNode) {
      return;
    }
    const layout = this.rowDockingLayout;
    const signature = `${layout.revision}:${layout.topHeight}:${layout.bottomHeight}:${this.scrollLeft}:${this._dockingOverlay.clientHeight}`;
    Object.entries(this.rowsCache).forEach(([rowId, cacheEntry]) => {
      const row = Number(rowId);
      const rowNode = cacheEntry.rowNode?.[0];
      if (!rowNode) {
        return;
      }
      const dockingBand = this.dockingByRow.get(row)?.band;
      const target = dockingBand && dockingBand !== 'center' ? this._dockingOverlay! : this._canvasNode;
      if (rowNode.parentElement !== target) {
        target.appendChild(rowNode);
      } else if (cacheEntry.dockingSyncSignature === signature) {
        return;
      }
      cacheEntry.dockingSyncSignature = signature;
      this.applyRowTopOffset(rowNode, row);
      this.applyDockingScrollOffsetToRow(rowNode, cacheEntry);
    });
  }

  /** Return visible columns currently docked at an edge, including active sticky columns. */
  getPinnedColumns(side?: DockingSide): C[] {
    const entries = side ? this.dockingLayout[side] : [...this.dockingLayout.left, ...this.dockingLayout.right];
    return entries.map((entry) => this.columns[entry.index]).filter(Boolean);
  }

  /** Permanently pin/unpin a column and rebuild the three-region row layout. */
  setColumnPinning(columnId: number | string, pinned: DockingSide | null): void {
    const column = this.getColumnById(columnId);
    if (!column || column.pinned === pinned) {
      return;
    }
    const columnIndex = this.getColumnIndex(column.id);
    if (!isDefinedNumber(columnIndex)) {
      return;
    }

    this._invalidPinningAlerted = false;
    const prospectivePinnedIndexes = this.getPinnedColumnIndexes();
    if (pinned) {
      prospectivePinnedIndexes.set(columnIndex, pinned);
    } else {
      prospectivePinnedIndexes.delete(columnIndex);
    }
    if (!this.validatePinnedColumnIndexes(prospectivePinnedIndexes, true)) {
      return;
    }
    column.pinned = pinned;

    // Keep the unified option authoritative when callers change a column
    // interactively (for example through the Header Menu).
    if (this._options.pinning?.columns !== undefined) {
      const left = this.normalizeColumnPinningReferences(this._options.pinning.columns.left, 'left', this.columns).filter(
        (index) => index !== columnIndex
      );
      const right = this.normalizeColumnPinningReferences(this._options.pinning.columns.right, 'right', this.columns).filter(
        (index) => index !== columnIndex
      );
      if (pinned === 'left') {
        left.push(columnIndex);
      } else if (pinned === 'right') {
        right.push(columnIndex);
      }
      this._options.pinning.columns = { left, right };
    }

    this.dockingController.reset();
    this.updateColumns();
  }

  /** Make a center column sticky at one or both edges, or disable its sticky policy. */
  setColumnStickiness(columnId: number | string, sticky: DockingSide | 'both' | boolean): void {
    const column = this.getColumnById(columnId);
    if (!column || column.sticky === sticky) {
      return;
    }
    column.sticky = sticky;
    this.dockingController.reset();
    this.updateColumns();
  }

  /** Returns an array of every data object, unless you're using DataView in which case it returns a DataView object. */
  getData<U extends CustomDataView<TData> | U[] = CustomDataView<TData>>(): U {
    return this.data as U;
  }

  /**
   * Returns a representative row height in pixels for converting a row-count budget (e.g.
   * `docking.minCenterRowCount`) into pixels. In variable row height mode this is the average
   * indexed row height; otherwise it is the configured `rowHeight`.
   */
  protected getEstimatedRowHeight(): number {
    if (this._options.enableVariableRowHeight && this.rowPositionIndexer && this.rowPositionIndexer.count > 0) {
      return this.rowPositionIndexer.top(this.rowPositionIndexer.count) / this.rowPositionIndexer.count;
    }
    return this._options.rowHeight!;
  }

  /** Height occupied by permanent top-pinned rows. */
  protected getTopPinnedRowsHeight(): number {
    return this.rowDockingLayout.top.filter((entry) => !entry.sticky).reduce((height, entry) => height + entry.height, 0);
  }

  /** Returns the rendered top position of a row after accounting for pinned rows. */
  protected getRenderedRowTop(row: number): number {
    return (
      this.getRowTop(row) +
      this.rowDockingLayout.top.reduce((offset, entry) => offset + (!entry.sticky && entry.index >= row ? entry.height : 0), 0) -
      this.rowDockingLayout.bottom.reduce((offset, entry) => offset + (!entry.sticky && entry.index < row ? entry.height : 0), 0)
    );
  }

  /**
   * Whether a row hosts a rowspan. A spanning cell may be outside the current
   * horizontal render range and therefore not be present in the row DOM yet, so
   * the row metadata is inspected as well; otherwise the row can keep a
   * translateY stacking context and a later-rendered span cell will paint
   * underneath hovered or odd rows. Only the host row needs this treatment (not
   * rows covered by a span), so only a rowspan that starts on this row counts.
   */
  protected isRowSpanHost(rowNode: HTMLElement, row: number): boolean {
    if (!this._options.enableCellRowSpan) {
      return false;
    }
    if (rowNode.querySelector('.slick-cell.rowspan')) {
      return true;
    }
    const rowMetadata = this.getItemMetadaWhenExists(row);
    return (
      !!rowMetadata?.columns &&
      this.columns.some((column, index) => {
        const columnMetadata = rowMetadata.columns?.[column.id] || (rowMetadata.columns as any)?.[index];
        return Number(columnMetadata?.rowspan || 1) > 1;
      })
    );
  }

  /** Keep RowSpan host rows top-positioned so their cells escape transformed sibling stacking contexts. */
  protected applyRowTopOffset(rowNode: HTMLElement, row: number): void {
    const rowDocking = this.dockingByRow.get(row);
    let top = this.getRenderedRowTop(row);
    if (rowDocking?.band === 'top') {
      top = rowDocking.offset;
    } else if (rowDocking?.band === 'bottom') {
      const viewportHeight = this._dockingOverlay?.clientHeight || this._viewportScrollContainerY?.clientHeight || this.viewportH;
      // Anchor the bottom band to the bottom of the viewport; enforceMinCenterRowBudget()
      // grows the container when the bands would leave too little room.
      const bottomStart = Math.max(this.rowDockingLayout.topHeight, viewportHeight - this.rowDockingLayout.bottomHeight);
      top = bottomStart + rowDocking.offset;
    }
    rowNode.classList.toggle('slick-row-pinned-top', rowDocking?.band === 'top');
    rowNode.classList.toggle('slick-row-pinned-bottom', rowDocking?.band === 'bottom');
    rowNode.classList.toggle(
      'slick-row-pinned-top-edge',
      rowDocking?.band === 'top' && this.rowDockingLayout.top[this.rowDockingLayout.top.length - 1]?.index === row
    );
    rowNode.classList.toggle(
      'slick-row-pinned-bottom-edge',
      rowDocking?.band === 'bottom' && this.rowDockingLayout.bottom[0]?.index === row
    );
    rowNode.classList.toggle('slick-row-sticky', !!rowDocking?.sticky);
    const isTransform = this._options.rowTopOffsetRenderType === 'transform';
    const cacheEntry = this.rowsCache[row];
    const hasRowSpan = cacheEntry?.rowSpanHost ?? this.isRowSpanHost(rowNode, row);
    if (cacheEntry) {
      cacheEntry.rowSpanHost = hasRowSpan;
    }
    // Docked rows live in the non-scrolling overlay, so their vertical
    // coordinate is constant for the duration of a scroll. The transform
    // preference remains available for normal rows and row-detail rendering.
    const useTransform = isTransform && !hasRowSpan;

    // Mark every rowspan host row so docked region wrappers let the spanning cell
    // extend over following rows and stay hit-testable.
    rowNode.classList.toggle('slick-rowspan', hasRowSpan);
    if (useTransform) {
      rowNode.style.top = '';
      // Keep the 2D translateY() syntax for row positioning: integrations inspect it.
      rowNode.style.transform = `translateY(${Math.round(top)}px)`;
    } else {
      rowNode.style.top = `${Math.round(top)}px`;
      rowNode.style.transform = '';
    }
  }

  /**
   * When permanent top/bottom pinned rows leave less than `docking.minCenterRowCount` rows for
   * the scrollable centre band, grow the container via `min-height` so both stay visible.
   */
  protected enforceMinCenterRowBudget(): void {
    if (this._options.autoHeight) {
      return;
    }
    const minCenterRowCount = Math.max(0, this._options.docking?.minCenterRowCount || 0);
    if (!minCenterRowCount || (!this.rowDockingLayout.top.length && !this.rowDockingLayout.bottom.length)) {
      return;
    }
    const permanentHeight = (entries: DockedRow[]): number =>
      entries.filter((entry) => !entry.sticky).reduce((height, entry) => height + entry.height, 0);
    const requiredCenterHeight =
      permanentHeight(this.rowDockingLayout.top) + permanentHeight(this.rowDockingLayout.bottom) + minCenterRowCount * this.getEstimatedRowHeight();
    const shortfall = requiredCenterHeight - this.viewportH;
    if (shortfall > 0) {
      this._container.style.minHeight = `${this._container.getBoundingClientRect().height + shortfall}px`;
      this.getViewportHeight();
    }
  }

  /**
   * Size the non-scrolling docked-row layer to the full canvas width.
   *
   * The layer itself receives the horizontal `-scrollLeft` transform used by
   * the dedicated scrollbar, so a viewport-width clipping box would expose a
   * blank strip at the trailing edge. Its viewport is the clipping boundary.
   */
  protected updateDockingOverlayDimensions(): void {
    if (!this._dockingOverlay || !this._viewportNode) {
      return;
    }
    this._dockingOverlay.style.top = `${this._viewportNode.offsetTop}px`;
    this._dockingOverlay.style.left = `${this._viewportNode.offsetLeft}px`;
    const overlayWidth = Math.max(this.canvasWidth, this.dockingLayout.contentWidth, this._viewportNode.clientWidth);
    this._dockingOverlay.style.width = `${overlayWidth}px`;
    this._dockingOverlay.style.height = `${this._viewportNode.clientHeight}px`;
    this.updateDockingOverlayClip();
  }

  /** Clip the translated row overlay without invalidating every grid descendant through an inherited CSS variable. */
  protected updateDockingOverlayClip(scrollLeft: number = this.scrollLeft): void {
    if (!this._dockingOverlay || !this._viewportNode) {
      return;
    }
    const viewportWidth = this._viewportNode.clientWidth;
    const overlayWidth = Math.max(this.canvasWidth, this.dockingLayout.contentWidth, viewportWidth);
    // Overlay-scrollbar platforms do not reserve a vertical gutter in
    // clientWidth. Adding a guessed inset here clips the rightmost pinned-row
    // cells and can paint a duplicate sliver beside the grid border.
    const rightInset = overlayWidth - scrollLeft - viewportWidth;
    this._dockingOverlay.style.clipPath = `inset(0 ${rightInset}px 0 ${scrollLeft}px)`;
  }

  /** Keep the single horizontal scrollbar aligned with the vertical body viewport. */
  protected updateDockingHorizontalScrollerDimensions(): void {
    if (!this._dockingHorizontalScroller || !this._dockingHorizontalSpacer || !this._viewportNode) {
      return;
    }
    const scrollbarHeight = this.getDockingScrollbarHeight();
    const viewportWidth = this._viewportNode.clientWidth;
    const contentWidth = this.dockingLayout.contentWidth || this.canvasWidth;
    const hasHorizontalOverflow = contentWidth > viewportWidth;
    this._dockingHorizontalScroller.style.width = `${viewportWidth}px`;
    this._dockingHorizontalScroller.style.height = hasHorizontalOverflow ? `${scrollbarHeight}px` : '0px';
    this._dockingHorizontalSpacer.style.width = `${Math.max(contentWidth, viewportWidth)}px`;
    this._container.style.setProperty('--slick-docking-viewport-width', `${this._viewportNode.clientWidth}px`);
    this.syncDockingScrollOffsetVariable();
    this._container.style.setProperty(
      '--slick-docking-right-offset',
      `${this._dockingHorizontalScroller.clientWidth - this.dockingLayout.contentWidth}px`
    );
    this._container.style.setProperty(
      '--slick-docking-row-right-offset',
      `${this._dockingHorizontalScroller.clientWidth - this.getDockingRenderedWidth()}px`
    );
  }

  /** Firefox/Linux may report zero for overlay scrollbar metrics. Keep the proxy track measurable. */
  protected getDockingScrollbarHeight(): number {
    return this.scrollbarDimensions
      ? this.scrollbarDimensions.height || DEFAULT_DOCKING_SCROLLBAR_HEIGHT
      : this.measureScrollbar().height || DEFAULT_DOCKING_SCROLLBAR_HEIGHT;
  }

  /** Returns the cell elements belonging to a row, including its docking regions. */
  protected getRowCellChildren(rowNode: HTMLElement): HTMLElement[] {
    const children = Array.from(rowNode.children) as HTMLElement[];
    // Row detail formatters can insert a non-cell sibling after the detail-toggle cell.
    // Only actual cells belong in cellNodesByColumnIdx; otherwise cache rebuilding tries
    // to parse a column index from classes such as `dynamic-cell-detail`.
    const cellChildren = (nodes: HTMLElement[]) =>
      nodes.filter((node) => node.classList.contains('slick-cell') && !node.classList.contains('slick-cell-colspan-part'));
    if (!rowNode.classList.contains('slick-row-docked')) {
      return cellChildren(children);
    }
    const regions = children.filter((node) => node.matches('.slick-pinned-left-cells, .slick-scrolling-cells, .slick-pinned-right-cells'));
    return [...cellChildren(children), ...cellChildren(regions.flatMap((region) => Array.from(region.children) as HTMLElement[]))];
  }

  /** Determines whether a group cell spans the remaining visible columns. */
  protected isFullWidthGroupCell(
    metadata: ItemMetadata | null | undefined,
    columnMetadata: ColumnMetadata | null,
    columnIdx: number,
    colspan: number
  ): boolean {
    const configuredColspan = columnMetadata?.colspan;
    return (
      !!metadata?.isGroup &&
      configuredColspan !== undefined &&
      (configuredColspan === '*' || Number(configuredColspan) >= this.columns.length - columnIdx) &&
      colspan >= this.columns.length - columnIdx
    );
  }

  /** Returns the row region that should contain a cell for its resolved docking band. */
  protected getRowDockingRegion(rowNode: HTMLElement, columnIdx: number, regions?: RowCaching['cellRegions']): HTMLElement {
    if (rowNode.classList.contains('slick-row-full-width-group') || (!regions && !rowNode.classList.contains('slick-row-docked'))) {
      return rowNode;
    }
    const docking = this.dockingByColumn.get(columnIdx);
    const band = this.usesStickyColumnTransformPath() && this.columns[columnIdx]?.sticky ? 'center' : docking?.band || 'center';
    if (regions) {
      return regions[band];
    }
    const selector =
      band === 'left' ? '.slick-pinned-left-cells' : band === 'right' ? '.slick-pinned-right-cells' : '.slick-scrolling-cells';
    return (rowNode.querySelector(`:scope > ${selector}`) as HTMLElement) || rowNode;
  }

  /** Toggles the active state of the rendered fragments for a spanning cell. */
  protected toggleCellSpanFragmentsActive(row: number, cell: number, active: boolean): void {
    this.rowsCache[row]?.cellSpanFragments?.[cell]?.forEach((fragment) => fragment.classList.toggle('active', active));
  }

  /** Splits a colspan into contiguous left, center, and right docking segments. */
  protected getColspanSegments(cell: number, colspan: number): Array<{ start: number; end: number; band: ColumnDockingBand }> {
    const segments: Array<{ start: number; end: number; band: ColumnDockingBand }> = [];
    const end = Math.min(this.columns.length - 1, cell + colspan - 1);

    for (let index = cell; index <= end; index++) {
      if (this.columns[index]?.hidden) {
        continue;
      }
      const band = this.getColumnDockingBand(index);
      const previous = segments[segments.length - 1];
      if (previous?.band === band) {
        previous.end = index;
      } else {
        segments.push({ start: index, end: index, band });
      }
    }
    return segments;
  }

  /** Appends the DOM fragments required to render a cell across docking segments. */
  protected appendColspanFragments(
    row: number,
    cell: number,
    host: HTMLElement,
    segments: Array<{ start: number; end: number; band: ColumnDockingBand }>,
    deferToRow: boolean
  ): void {
    host.classList.add('slick-cell-colspan-crossing-docking');
    (this.rowsCache[row].rowNode?.[0] || host.closest('.slick-row'))?.classList.add('slick-row-colspan-crossing-docking');
    const fragments = segments.slice(1).map((segment, index, allFragments) => {
      const fragment = host.cloneNode(false) as HTMLElement;
      fragment.style.width = '';
      fragment.classList.add('slick-cell-colspan-part');
      fragment.appendChild(this.createColspanContinuationContent(host));
      fragment.classList.toggle('slick-cell-colspan-end', index === allFragments.length - 1);
      fragment.classList.remove('slick-cell-pinned-left', 'slick-cell-pinned-right', 'slick-cell-sticky');
      if (segment.band !== 'center') {
        fragment.classList.add(`slick-cell-pinned-${segment.band}`);
        if (this.dockingByColumn.get(segment.start)?.sticky) {
          fragment.classList.add('slick-cell-sticky');
        }
      }
      fragment.setAttribute('aria-hidden', 'true');
      fragment.setAttribute('role', 'presentation');
      fragment.removeAttribute('aria-describedby');
      fragment.removeAttribute('aria-colindex');
      fragment.removeAttribute('aria-colspan');
      fragment.removeAttribute('aria-rowspan');
      fragment.removeAttribute('tabindex');
      return fragment;
    });

    this.rowsCache[row].cellSpanFragments[cell] = fragments;
    this.rowsCache[row].cellSpanSegments[cell] = segments;
    this.updateColspanFragmentGeometry(host, segments, fragments);
    fragments.forEach((fragment, index) => {
      if (deferToRow) {
        host.parentElement?.insertBefore(fragment, host);
      } else {
        this.getRowDockingRegion(host.closest('.slick-row') as HTMLElement, segments[index + 1].start).appendChild(fragment);
      }
    });
  }

  /**
   * Builds the offsettable copy of a span host's content that a continuation renders.
   * The copy is presentational: the host keeps the accessible role, the value and the
   * event wiring, so the clone is marked hidden from assistive technology.
   */
  protected createColspanContinuationContent(host: HTMLElement): HTMLElement {
    const content = document.createElement('div');
    content.className = 'slick-cell-colspan-part-content';
    content.setAttribute('aria-hidden', 'true');
    Array.from(host.childNodes).forEach((node) => content.appendChild(node.cloneNode(true)));
    return content;
  }

  /** Re-copies a span host's content into its continuations after the cell is re-rendered. */
  protected refreshColspanContinuations(row: number, cell: number): void {
    const cacheEntry = this.rowsCache[row];
    const fragments = cacheEntry?.cellSpanFragments?.[cell];
    const host = cacheEntry?.cellNodesByColumnIdx?.[cell];
    if (!fragments?.length || !host) {
      return;
    }
    fragments.forEach((fragment) => {
      fragment.querySelector(':scope > .slick-cell-colspan-part-content')?.remove();
      fragment.appendChild(this.createColspanContinuationContent(host));
    });
    const segments = cacheEntry.cellSpanSegments?.[cell];
    if (segments?.length) {
      this.updateColspanFragmentGeometry(host, segments, fragments);
    }
  }

  /** Recalculates the inline geometry of an already-rendered cross-band colspan. */
  protected updateColspanFragmentGeometry(
    host: HTMLElement,
    segments: Array<{ start: number; end: number; band: ColumnDockingBand }>,
    fragments: HTMLElement[]
  ): void {
    const widthOf = (segment: { start: number; end: number }) =>
      (this.columnPosRight[segment.end] ?? 0) - (this.columnPosLeft[segment.start] ?? 0);
    const spanWidth = segments.reduce((width, segment) => width + widthOf(segment), 0);

    // The host renders only the part of the span that belongs to its own band. The
    // remainder is drawn by the continuations, so the span no longer has to paint over
    // the band next to it to stay readable.
    host.style.width = `${widthOf(segments[0])}px`;
    host.style[this._options.rtl ? 'left' : 'right'] = 'auto';

    let consumedWidth = widthOf(segments[0]);
    fragments.forEach((fragment, index) => {
      const segment = segments[index + 1];
      if (!segment) {
        return;
      }

      // Shift the copied content left by everything the earlier bands already showed,
      // so the text reads continuously across the boundary instead of restarting.
      const content = fragment.querySelector<HTMLElement>(':scope > .slick-cell-colspan-part-content');
      if (content) {
        content.style.width = `${spanWidth}px`;
        content.style.marginInlineStart = `-${consumedWidth}px`;
      }
      consumedWidth += widthOf(segment);

      const bandWidth =
        segment.band === 'left'
          ? this.dockingLayout.leftWidth
          : segment.band === 'right'
            ? this.dockingLayout.rightWidth
            : this.getDockingRenderedWidths().center;
      const left = this.columnPosLeft[segment.start] ?? 0;
      const right = this.columnPosRight[segment.end] ?? left;
      if (this._options.rtl) {
        fragment.style.right = `${left}px`;
        fragment.style.left = `${Math.max(0, bandWidth - right)}px`;
      } else {
        fragment.style.left = `${left}px`;
        fragment.style.right = `${Math.max(0, bandWidth - right)}px`;
      }
    });
  }

  /** Refreshes geometry for all rendered colspans after column widths change. */
  protected updateRenderedColspanFragmentGeometry(): void {
    Object.entries(this.rowsCache).forEach(([rowId, cacheEntry]) => {
      if (!Object.keys(cacheEntry.cellSpanFragments).length) {
        return;
      }
      // Drain the row's render queue first, so the cell map is populated and the host can be
      // read from it rather than searched for in the row's DOM.
      this.ensureCellNodesInRowsCache(Number(rowId));
      Object.entries(cacheEntry.cellSpanFragments).forEach(([cellIndex, fragments]) => {
        const cell = Number(cellIndex);
        const segments = cacheEntry.cellSpanSegments[cell];
        if (!segments?.length || !fragments.length) {
          return;
        }

        const host = cacheEntry.cellNodesByColumnIdx[cell];
        if (host) {
          this.updateColspanFragmentGeometry(host, segments, fragments);
        }
      });
    });
  }

  /** Forward legacy chrome/body scroll offsets to the single docking scrollbar. */
  protected forwardDockingHorizontalScroll(source: HTMLElement | null | undefined): boolean {
    if (!this.hasDockingHorizontalScroller() || !source || source === this._viewportScrollContainerX) {
      return false;
    }

    const scrollLeft = source.scrollLeft;
    // RTL browsers represent horizontal offsets as negative values. Only an
    // actual origin offset should be ignored; rejecting all values <= 0
    // prevents RTL scrolling from reaching the single proxy scroll owner.
    if (scrollLeft === 0) {
      return false;
    }

    // The viewport and chrome containers are kept at scrollLeft 0 with their content translated by
    // the proxy position, so a native scroll on one of them (a browser focus reveal, an integration
    // scrolling `.slick-viewport`) is a delta from the current position, not an absolute offset.
    this.clearDockingNativeHorizontalScrollOffsets();
    this._viewportScrollContainerX.scrollLeft += scrollLeft;
    return true;
  }

  /** Reset inactive horizontal scroll containers in proxy mode. */
  protected clearDockingNativeHorizontalScrollOffsets(): void {
    if (!this.hasDockingHorizontalScroller()) {
      return;
    }

    const scrollOwner = this._viewportScrollContainerX;
    const sources = new Set<HTMLElement>([
      this._viewportNode,
      this._headerScrollerL,
      this._headerRowScrollerL,
      this._footerRowScrollerL,
      this._preHeaderPanelScroller,
      this._topHeaderPanelScroller,
    ]);
    sources.forEach((element) => {
      if (element && element !== scrollOwner && element.scrollLeft !== 0) {
        element.scrollLeft = 0;
      }
    });
  }

  /**
   * Queue a render for the next paint. Rendering missing centre cells synchronously from the
   * scroll handler can delay the already-updated header transform by a frame; sticky layout
   * resolution is queued the same way so both resolve in one paint cycle.
   */
  protected enqueueSingleViewportRender(): void {
    if (this.singleViewportRenderTimer !== undefined) {
      return;
    }

    const render = () => {
      this.singleViewportRenderTimer = undefined;
      this.render();
    };
    this.singleViewportRenderTimer = this.scheduleAnimationFrame(render);
  }

  /** Cancels a render scheduled for the single-viewport layout. */
  protected cancelSingleViewportRender(): void {
    this.cancelScheduledAnimationFrame(this.singleViewportRenderTimer);
    this.singleViewportRenderTimer = undefined;
  }

  /** Schedules a callback using animation frames with a timer fallback. */
  protected scheduleAnimationFrame(callback: FrameRequestCallback): number {
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }
    const timeoutId = setTimeout(() => {
      this.animationFrameTimeouts.delete(timeoutId);
      callback(Date.now());
    }, 16) as unknown as number;
    this.animationFrameTimeouts.add(timeoutId);
    return timeoutId;
  }

  /** Cancels a callback scheduled by scheduleAnimationFrame. */
  protected cancelScheduledAnimationFrame(frame?: number): void {
    if (frame !== undefined) {
      if (this.animationFrameTimeouts.delete(frame)) {
        clearTimeout(frame);
      } else {
        globalThis.cancelAnimationFrame?.(frame);
      }
    }
  }

  /** Whether the current column definitions contain scroll-activated sticky candidates. */
  protected hasStickyColumns(): boolean {
    return this.columns.some((column) => !column.hidden && !!column.sticky);
  }

  /**
   * The proxy scroller exposes its horizontal position as a CSS variable, so
   * LTR sticky candidates can stay in the center DOM and move on the
   * compositor. Native scrolling and RTL keep the established band transition
   * until their coordinate systems can use the same transform safely.
   */
  protected usesStickyColumnTransformPath(): boolean {
    return !!this._dockingHorizontalScroller && !this._options.rtl;
  }

  /**
   * Resolve sticky columns at most once per animation frame. The horizontal
   * scrollbar and compositor transforms remain immediate; only the relatively
   * expensive band transition is deferred.
   */
  protected enqueueStickyColumnLayout(): void {
    if (this.stickyColumnLayoutFrame !== undefined) {
      return;
    }

    const update = () => {
      this.stickyColumnLayoutFrame = undefined;
      if (!this.initialized) {
        return;
      }

      const dockingChanged = this.refreshDockingLayout(this.scrollLeft, true);
      if (!dockingChanged) {
        return;
      }

      if (this.usesStickyColumnTransformPath()) {
        // Sticky candidates keep their natural center-band geometry. Crossing
        // an edge therefore changes only compositor classes/variables; column
        // CSS rules, chrome sizing, and every row's grid tracks remain stable.
        this.updateStickyColumnTransforms();
        this.enqueueSingleViewportRender();
        return;
      }

      // The layout was just resolved above; only its virtual-cell coordinate
      // cache needs rebuilding. Calling updateColumnCaches() here would run a
      // second sticky resolver pass in the same animation frame.
      this.updateColumnPositionCaches();
      this.applyColumnWidths();
      this.applyDockingToColumnChrome();

      // A sticky transition moves a few columns between bands: re-home the rendered
      // cell nodes instead of re-rendering every visible row.
      if (this.updateRenderedCellDocking()) {
        // Region widths and the right-edge compensation change with the active sticky
        // band; the deferred virtual-cell pass fills any missing centre cell.
        this.applyDockingDimensionsToRows();
        this.enqueueSingleViewportRender();
        return;
      }

      // A transition from no docked columns to a docked layout has no row
      // regions to reuse. Keep the conservative full render for that uncommon
      // structural change.
      this.invalidateAllRows();
      this.cancelSingleViewportRender();
      this.lastRenderedScrollLeft = Number.NaN;
      this.render();
    };

    this.stickyColumnLayoutFrame = this.scheduleAnimationFrame(update);
  }

  // Interactivity

  /** Handles keyboard navigation and publishes the grid key-down event. */
  protected handleKeyDown(e: KeyboardEvent & { originalEvent: Event; target: HTMLElement }): void {
    const retval = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e);
    let handled: boolean | undefined | void = retval.isImmediatePropagationStopped();

    if (!handled && !e.shiftKey && !e.altKey) {
      // editor may specify an array of keys to bubble
      if (this._options.editable && this.currentEditor?.keyCaptureList) {
        if (this.currentEditor.keyCaptureList.indexOf(e.which) > -1) {
          return;
        }
      }
      if (e.ctrlKey && e.key === 'Home') {
        this.navigateTopStart();
      } else if (e.ctrlKey && e.key === 'End') {
        this.navigateBottomEnd();
      } else if (e.ctrlKey && e.key === 'ArrowUp') {
        this.navigateTop();
      } else if (e.ctrlKey && e.key === 'ArrowDown') {
        this.navigateBottom();
      } else if ((e.ctrlKey && e.key === 'ArrowLeft') || (!e.ctrlKey && e.key === 'Home')) {
        this.navigateRowStart();
      } else if ((e.ctrlKey && e.key === 'ArrowRight') || (!e.ctrlKey && e.key === 'End')) {
        this.navigateRowEnd();
      }
    }

    if (!handled) {
      if (e.key === 'Tab' && e.shiftKey && !e.ctrlKey && !e.altKey) {
        handled = this.navigatePrev();
      }

      if (!e.shiftKey && !e.altKey && !e.ctrlKey && !handled) {
        if (e.key === 'Escape') {
          if (!this.getEditorLock()?.isActive()) {
            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
          }
          this.cancelEditAndSetFocus();
        } else if (e.key === 'PageDown') {
          this.navigatePageDown();
          handled = true;
        } else if (e.key === 'PageUp') {
          this.navigatePageUp();
          handled = true;
        } else if (e.key === 'ArrowLeft') {
          handled = this.navigateLeft();
        } else if (e.key === 'ArrowRight') {
          handled = this.navigateRight();
        } else if (e.key === 'ArrowUp') {
          handled = this.navigateUp();
        } else if (e.key === 'ArrowDown') {
          handled = this.navigateDown();
        } else if (e.key === 'Tab') {
          handled = this.navigateNext();
        } else if (e.key === 'Enter') {
          if (this._options.editable) {
            if (this.currentEditor) {
              // adding new row
              if (this.activeRow === this.getDataLength()) {
                this.navigateDown();
              } else {
                this.commitEditAndSetFocus();
              }
            } else {
              if (this.getEditorLock()?.commitCurrentEdit()) {
                this.makeActiveCellEditable(undefined, undefined, e);
              }
            }
          }
          handled = true;
        } else if (e.key === 'F2' && this._options.editable && !this.currentEditor) {
          this.makeActiveCellEditable(undefined, undefined, e);
          handled = true;
        }
      }
    }

    const cell = this.getActiveCell();
    const isChar = /^[\p{L}\p{N}\p{P}\p{S}\s]$/u.test(e.key); // make sure it's a character being typed
    if (!handled && this._options.autoEditByKeypress && cell && isChar && this.isCellEditable(cell.row, cell.cell) && !this.currentEditor) {
      this.makeActiveCellEditable(undefined, false, e);
    }

    if (handled) {
      // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
      e.stopPropagation();
      e.preventDefault();
    }
  }

  /** Publishes the header-column mouse-over event for the column under the pointer. */
  protected handleHeaderMouseOver(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderMouseOver, { column, grid: this }, e);
    }
  }

  /** Publishes the header-column mouse-out event for the column under the pointer. */
  protected handleHeaderMouseOut(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderMouseOut, { column, grid: this }, e);
    }
  }

  /** Publishes the header-row mouse-over event for the column under the pointer. */
  protected handleHeaderRowMouseOver(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderRowMouseOver, { column, grid: this }, e);
    }
  }

  /** Publishes the header-row mouse-out event for the column under the pointer. */
  protected handleHeaderRowMouseOut(e: MouseEvent & { target: HTMLElement }): void {
    const column = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (column) {
      this.trigger(this.onHeaderRowMouseOut, { column, grid: this }, e);
    }
  }

  /** Return natural column coordinates for keyboard scrolling. */
  protected getNaturalColumnRange(firstCell: number, lastCell: number = firstCell): { left: number; right: number } {
    const first = this.dockingByColumn.get(firstCell);
    const last = this.dockingByColumn.get(lastCell);
    // Docking offsets for center columns are relative to the center band,
    // whereas internalScrollColumnIntoView() compares full-grid coordinates
    // that include the permanent left-pinned band.
    const leftBaseWidth = this.dockingLayout.leftBaseWidth;
    return {
      left: leftBaseWidth + (first?.naturalOffset ?? this.columnPosLeft[firstCell] ?? 0),
      right: leftBaseWidth + (last ? last.naturalOffset + last.width : (this.columnPosRight[lastCell] ?? 0)),
    };
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Grid: SlickGrid,
  });
}
