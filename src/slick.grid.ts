// @ts-ignore
import type SortableInstance from 'sortablejs';

import type {
  AutoSize,
  CellViewportRange,
  Column,
  ColumnSort,
  CssStyleHash,
  CSSStyleDeclarationWritable,
  CustomDataView,
  DOMEvent,
  DOMMouseOrTouchEvent,
  DragPosition,
  DragRowMove,
  Editor,
  EditController,
  Formatter,
  FormatterOverrideCallback,
  FormatterResultObject,
  GridOption as BaseGridOption,
  InteractionBase,
  ItemMetadata,
  MultiColumnSort,
  OnActiveCellChangedEventArgs,
  OnAddNewRowEventArgs,
  OnAutosizeColumnsEventArgs,
  OnBeforeUpdateColumnsEventArgs,
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
  OnColumnsDragEventArgs,
  OnColumnsReorderedEventArgs,
  OnColumnsResizedEventArgs,
  OnColumnsResizeDblClickEventArgs,
  OnCompositeEditorChangeEventArgs,
  OnClickEventArgs,
  OnDblClickEventArgs,
  OnFooterContextMenuEventArgs,
  OnFooterRowCellRenderedEventArgs,
  OnHeaderCellRenderedEventArgs,
  OnFooterClickEventArgs,
  OnHeaderClickEventArgs,
  OnHeaderContextMenuEventArgs,
  OnHeaderMouseEventArgs,
  OnHeaderRowCellRenderedEventArgs,
  OnKeyDownEventArgs,
  OnValidationErrorEventArgs,
  OnRenderedEventArgs,
  OnSelectedRowsChangedEventArgs,
  OnSetOptionsEventArgs,
  OnActivateChangedOptionsEventArgs,
  OnScrollEventArgs,
  PagingInfo,
  Plugin,
  RowInfo,
  SelectionModel,
  SingleColumnSort,
  SlickGridEventData,
  SlickGridModel,
} from './models/index';
import {
  BindingEventService as BindingEventService_,
  ColAutosizeMode as ColAutosizeMode_,
  GlobalEditorLock as GlobalEditorLock_,
  GridAutosizeColsMode as GridAutosizeColsMode_,
  keyCode as keyCode_,
  preClickClassName as preClickClassName_,
  RowSelectionMode as RowSelectionMode_,
  type SlickEditorLock,
  SlickEvent as SlickEvent_,
  SlickEventData as SlickEventData_,
  SlickRange as SlickRange_,
  Utils as Utils_,
  ValueFilterMode as ValueFilterMode_,
  WidthEvalMode as WidthEvalMode_,
} from './slick.core';
import { Draggable as Draggable_, MouseWheel as MouseWheel_, Resizable as Resizable_ } from './slick.interactions';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const ColAutosizeMode = IIFE_ONLY ? Slick.ColAutosizeMode : ColAutosizeMode_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventData = IIFE_ONLY ? Slick.EventData : SlickEventData_;
const GlobalEditorLock = IIFE_ONLY ? Slick.GlobalEditorLock : GlobalEditorLock_;
const GridAutosizeColsMode = IIFE_ONLY ? Slick.GridAutosizeColsMode : GridAutosizeColsMode_;
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const preClickClassName = IIFE_ONLY ? Slick.preClickClassName : preClickClassName_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const RowSelectionMode = IIFE_ONLY ? Slick.RowSelectionMode : RowSelectionMode_;
const ValueFilterMode = IIFE_ONLY ? Slick.ValueFilterMode : ValueFilterMode_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const WidthEvalMode = IIFE_ONLY ? Slick.WidthEvalMode : WidthEvalMode_;
const Draggable = IIFE_ONLY ? Slick.Draggable : Draggable_;
const MouseWheel = IIFE_ONLY ? Slick.MouseWheel : MouseWheel_;
const Resizable = IIFE_ONLY ? Slick.Resizable : Resizable_;

/**
 * @license
 * (c) 2009-present Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v5.1.0
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */

//////////////////////////////////////////////////////////////////////////////////////////////
// SlickGrid class implementation (available as SlickGrid)

interface RowCaching {
  rowNode: HTMLElement[] | null,
  cellColSpans: Array<number | '*'>;
  cellNodesByColumnIdx: HTMLElement[];
  cellRenderQueue: any[];
}

export class SlickGrid<TData = any, C extends Column<TData> = Column<TData>, O extends BaseGridOption<C> = BaseGridOption<C>> {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Public API
  slickGridVersion = '5.1.0';

  /** optional grid state clientId */
  cid = '';

  // Events
  onActiveCellChanged = new SlickEvent<OnActiveCellChangedEventArgs>();
  onActiveCellPositionChanged = new SlickEvent<SlickGridEventData>();
  onAddNewRow = new SlickEvent<OnAddNewRowEventArgs>();
  onAutosizeColumns = new SlickEvent<OnAutosizeColumnsEventArgs>();
  onBeforeAppendCell = new SlickEvent<OnBeforeAppendCellEventArgs>();
  onBeforeCellEditorDestroy = new SlickEvent<OnBeforeCellEditorDestroyEventArgs>();
  onBeforeColumnsResize = new SlickEvent<OnBeforeColumnsResizeEventArgs>();
  onBeforeDestroy = new SlickEvent<SlickGridEventData>();
  onBeforeEditCell = new SlickEvent<OnBeforeEditCellEventArgs>();
  onBeforeFooterRowCellDestroy = new SlickEvent<OnBeforeFooterRowCellDestroyEventArgs>();
  onBeforeHeaderCellDestroy = new SlickEvent<OnBeforeHeaderCellDestroyEventArgs>();
  onBeforeHeaderRowCellDestroy = new SlickEvent<OnBeforeHeaderRowCellDestroyEventArgs>();
  onBeforeSetColumns = new SlickEvent<OnBeforeSetColumnsEventArgs>();
  onBeforeSort = new SlickEvent<SingleColumnSort | MultiColumnSort>();
  onBeforeUpdateColumns = new SlickEvent<OnBeforeUpdateColumnsEventArgs>();
  onCellChange = new SlickEvent<OnCellChangeEventArgs>();
  onCellCssStylesChanged = new SlickEvent<OnCellCssStylesChangedEventArgs>();
  onClick = new SlickEvent<OnClickEventArgs>();
  onColumnsReordered = new SlickEvent<OnColumnsReorderedEventArgs>();
  onColumnsDrag = new SlickEvent<OnColumnsDragEventArgs>();
  onColumnsResized = new SlickEvent<OnColumnsResizedEventArgs>();
  onColumnsResizeDblClick = new SlickEvent<OnColumnsResizeDblClickEventArgs>();
  onCompositeEditorChange = new SlickEvent<OnCompositeEditorChangeEventArgs>();
  onContextMenu = new SlickEvent<SlickGridEventData>();
  onDrag = new SlickEvent<DragRowMove>();
  onDblClick = new SlickEvent<OnDblClickEventArgs>();
  onDragInit = new SlickEvent<DragRowMove>();
  onDragStart = new SlickEvent<DragRowMove>();
  onDragEnd = new SlickEvent<DragRowMove>();
  onFooterClick = new SlickEvent<OnFooterClickEventArgs>();
  onFooterContextMenu = new SlickEvent<OnFooterContextMenuEventArgs>();
  onFooterRowCellRendered = new SlickEvent<OnFooterRowCellRenderedEventArgs>();
  onHeaderCellRendered = new SlickEvent<OnHeaderCellRenderedEventArgs>();
  onHeaderClick = new SlickEvent<OnHeaderClickEventArgs>();
  onHeaderContextMenu = new SlickEvent<OnHeaderContextMenuEventArgs>();
  onHeaderMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>();
  onHeaderMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>();
  onHeaderRowCellRendered = new SlickEvent<OnHeaderRowCellRenderedEventArgs>();
  onHeaderRowMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>();
  onHeaderRowMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>();
  onKeyDown = new SlickEvent<OnKeyDownEventArgs>();
  onMouseEnter = new SlickEvent<OnHeaderMouseEventArgs>();
  onMouseLeave = new SlickEvent<OnHeaderMouseEventArgs>();
  onRendered = new SlickEvent<OnRenderedEventArgs>();
  onScroll = new SlickEvent<OnScrollEventArgs>();
  onSelectedRowsChanged = new SlickEvent<OnSelectedRowsChangedEventArgs>();
  onSetOptions = new SlickEvent<OnSetOptionsEventArgs>();
  onActivateChangedOptions = new SlickEvent<OnActivateChangedOptionsEventArgs>();
  onSort = new SlickEvent<SingleColumnSort | MultiColumnSort>();
  onValidationError = new SlickEvent<OnValidationErrorEventArgs>();
  onViewportChanged = new SlickEvent<SlickGridEventData>();

  // ---
  // protected variables

  // shared across all grids on the page
  protected scrollbarDimensions?: { height: number; width: number; };
  protected maxSupportedCssHeight!: number;  // browser's breaking point

  protected canvas: HTMLCanvasElement | null = null;
  protected canvas_context: CanvasRenderingContext2D | null = null;

  // settings
  protected _options!: O;
  protected _defaults: BaseGridOption = {
    alwaysShowVerticalScroll: false,
    alwaysAllowHorizontalScroll: false,
    explicitInitialization: false,
    rowHeight: 25,
    defaultColumnWidth: 80,
    enableAddRow: false,
    leaveSpaceForNewRows: false,
    editable: false,
    autoEdit: true,
    autoEditNewRow: true,
    autoCommitEdit: false,
    suppressActiveCellChangeOnEdit: false,
    enableCellNavigation: true,
    enableColumnReorder: true,
    asyncEditorLoading: false,
    asyncEditorLoadDelay: 100,
    forceFitColumns: false,
    enableAsyncPostRender: false,
    asyncPostRenderDelay: 50,
    enableAsyncPostRenderCleanup: false,
    asyncPostRenderCleanupDelay: 40,
    auto: false,
    editorLock: GlobalEditorLock,
    showColumnHeader: true,
    showHeaderRow: false,
    headerRowHeight: 25,
    createFooterRow: false,
    showFooterRow: false,
    footerRowHeight: 25,
    createPreHeaderPanel: false,
    showPreHeaderPanel: false,
    preHeaderPanelHeight: 25,
    showTopPanel: false,
    topPanelHeight: 25,
    formatterFactory: null,
    editorFactory: null,
    cellFlashingCssClass: 'flashing',
    selectedCellCssClass: 'selected',
    multiSelect: true,
    enableTextSelectionOnCells: false,
    dataItemColumnValueExtractor: null,
    frozenBottom: false,
    frozenColumn: -1,
    frozenRow: -1,
    frozenRightViewportMinWidth: 100,
    fullWidthRows: false,
    multiColumnSort: false,
    numberedMultiColumnSort: false,
    tristateMultiColumnSort: false,
    sortColNumberInSeparateSpan: false,
    defaultFormatter: this.defaultFormatter,
    forceSyncScrolling: false,
    addNewRowCssClass: 'new-row',
    preserveCopiedSelectionOnPaste: false,
    showCellSelection: true,
    viewportClass: undefined,
    minRowBuffer: 3,
    emulatePagingWhenScrolling: true, // when scrolling off bottom of viewport, place new row at top of viewport
    editorCellNavOnLRKeys: false,
    enableMouseWheelScrollHandler: true,
    doPaging: true,
    autosizeColsMode: GridAutosizeColsMode.LegacyOff,
    autosizeColPaddingPx: 4,
    scrollRenderThrottling: 50,
    autosizeTextAvgToMWidthRatio: 0.75,
    viewportSwitchToScrollModeWidthPercent: undefined,
    viewportMinWidthPx: undefined,
    viewportMaxWidthPx: undefined,
    suppressCssChangesOnHiddenInit: false,
    ffMaxSupportedCssHeight: 6000000,
    maxSupportedCssHeight: 1000000000,
    sanitizer: undefined,  // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
    logSanitizedHtml: false, // log to console when sanitised - recommend true for testing of dev and production
    mixinDefaults: true
  };

  protected _columnDefaults = {
    name: '',
    resizable: true,
    sortable: false,
    minWidth: 30,
    maxWidth: undefined,
    rerenderOnResize: false,
    headerCssClass: null,
    defaultSortAsc: true,
    focusable: true,
    selectable: true,
    hidden: false
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
    colDataTypeOf: undefined
  };

  // scroller
  protected th!: number;   // virtual height
  protected h!: number;    // real scrollable height
  protected ph!: number;   // page height
  protected n!: number;    // number of pages
  protected cj!: number;   // "jumpiness" coefficient

  protected page = 0;       // current page
  protected offset = 0;     // current page offset
  protected vScrollDir = 1;
  protected _bindingEventService = new BindingEventService();
  protected initialized = false;
  protected _container!: HTMLElement;
  protected uid = `slickgrid_${Math.round(1000000 * Math.random())}`;
  protected _focusSink!: HTMLDivElement;
  protected _focusSink2!: HTMLDivElement;
  protected _groupHeaders: HTMLDivElement[] = [];
  protected _headerScroller: HTMLDivElement[] = [];
  protected _headers: HTMLDivElement[] = [];
  protected _headerRows!: HTMLDivElement[];
  protected _headerRowScroller!: HTMLDivElement[];
  protected _headerRowSpacerL!: HTMLDivElement;
  protected _headerRowSpacerR!: HTMLDivElement;
  protected _footerRow!: HTMLDivElement[];
  protected _footerRowScroller!: HTMLDivElement[];
  protected _footerRowSpacerL!: HTMLDivElement;
  protected _footerRowSpacerR!: HTMLDivElement;
  protected _preHeaderPanel!: HTMLDivElement;
  protected _preHeaderPanelScroller!: HTMLDivElement;
  protected _preHeaderPanelSpacer!: HTMLDivElement;
  protected _preHeaderPanelR!: HTMLDivElement;
  protected _preHeaderPanelScrollerR!: HTMLDivElement;
  protected _preHeaderPanelSpacerR!: HTMLDivElement;
  protected _topPanelScrollers!: HTMLDivElement[];
  protected _topPanels!: HTMLDivElement[];
  protected _viewport!: HTMLDivElement[];
  protected _canvas!: HTMLDivElement[];
  protected _style: any;
  protected _boundAncestors: HTMLElement[] = [];
  protected stylesheet?: { cssRules: Array<{ selectorText: string; }>; rules: Array<{ selectorText: string; }>; } | null;
  protected columnCssRulesL?: Array<{ selectorText: string; }>;
  protected columnCssRulesR?: Array<{ selectorText: string; }>;
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
  protected hasFrozenRows = false;
  protected frozenRowsHeight = 0;
  protected actualFrozenRow = -1;
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
  protected activeRow!: number;
  protected activeCell!: number;
  protected activeCellNode: HTMLDivElement | null = null;
  protected currentEditor: Editor | null = null;
  protected serializedEditorValue: any;
  protected editController?: EditController;

  protected rowsCache: Array<RowCaching> = {} as any;
  protected renderedRows = 0;
  protected numVisibleRows = 0;
  protected prevScrollTop = 0;
  protected scrollTop = 0;
  protected lastRenderedScrollTop = 0;
  protected lastRenderedScrollLeft = 0;
  protected prevScrollLeft = 0;
  protected scrollLeft = 0;

  protected selectionModel?: SelectionModel;
  protected selectedRows: number[] = [];

  protected plugins: Plugin[] = [];
  protected cellCssClasses: CssStyleHash = {};

  protected columnsById: Record<string, number> = {};
  protected sortColumns: ColumnSort[] = [];
  protected columnPosLeft: number[] = [];
  protected columnPosRight: number[] = [];

  protected pagingActive = false;
  protected pagingIsLastPage = false;

  protected scrollThrottle!: { enqueue: () => void; dequeue: () => void; };

  // async call handles
  protected h_editorLoader: any = null;
  protected h_render = null;
  protected h_postrender: any = null;
  protected h_postrenderCleanup: any = null;
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

  protected _paneHeaderL!: HTMLDivElement;
  protected _paneHeaderR!: HTMLDivElement;
  protected _paneTopL!: HTMLDivElement;
  protected _paneTopR!: HTMLDivElement;
  protected _paneBottomL!: HTMLDivElement;
  protected _paneBottomR!: HTMLDivElement;
  protected _headerScrollerL!: HTMLDivElement;
  protected _headerScrollerR!: HTMLDivElement;
  protected _headerL!: HTMLDivElement;
  protected _headerR!: HTMLDivElement;
  protected _groupHeadersL!: HTMLDivElement;
  protected _groupHeadersR!: HTMLDivElement;
  protected _headerRowScrollerL!: HTMLDivElement;
  protected _headerRowScrollerR!: HTMLDivElement;
  protected _footerRowScrollerL!: HTMLDivElement;
  protected _footerRowScrollerR!: HTMLDivElement;
  protected _headerRowL!: HTMLDivElement;
  protected _headerRowR!: HTMLDivElement;
  protected _footerRowL!: HTMLDivElement;
  protected _footerRowR!: HTMLDivElement;
  protected _topPanelScrollerL!: HTMLDivElement;
  protected _topPanelScrollerR!: HTMLDivElement;
  protected _topPanelL!: HTMLDivElement;
  protected _topPanelR!: HTMLDivElement;
  protected _viewportTopL!: HTMLDivElement;
  protected _viewportTopR!: HTMLDivElement;
  protected _viewportBottomL!: HTMLDivElement;
  protected _viewportBottomR!: HTMLDivElement;
  protected _canvasTopL!: HTMLDivElement;
  protected _canvasTopR!: HTMLDivElement;
  protected _canvasBottomL!: HTMLDivElement;
  protected _canvasBottomR!: HTMLDivElement;
  protected _viewportScrollContainerX!: HTMLDivElement;
  protected _viewportScrollContainerY!: HTMLDivElement;
  protected _headerScrollContainer!: HTMLDivElement;
  protected _headerRowScrollContainer!: HTMLDivElement;
  protected _footerRowScrollContainer!: HTMLDivElement;

  // store css attributes if display:none is active in container or parent
  protected cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
  protected _hiddenParents: HTMLElement[] = [];
  protected oldProps: Array<Partial<CSSStyleDeclaration>> = [];
  protected enforceFrozenRowHeightRecalc = false;
  protected columnResizeDragging = false;
  protected slickDraggableInstance: InteractionBase | null = null;
  protected slickMouseWheelInstances: Array<InteractionBase> = [];
  protected slickResizableInstances: Array<InteractionBase> = [];
  protected sortableSideLeftInstance: SortableInstance;
  protected sortableSideRightInstance: SortableInstance;
  protected logMessageCount = 0;
  protected logMessageMaxCount = 30;

  /**
   * Creates a new instance of the grid.
   * @class SlickGrid
   * @constructor
   * @param {Node} container - Container node to create the grid in.
   * @param {Array|Object} data - An array of objects for databinding.
   * @param {Array<C>} columns - An array of column definitions.
   * @param {Object} [options] - Grid this._options.
   **/
  constructor(protected container: HTMLElement | string, protected data: CustomDataView<TData> | TData[], protected columns: C[], protected options: Partial<O>) {
    this.initialize();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Initialization

  /** Initializes the grid. */
  init() {
    this.finishInitialization();
  }

  protected initialize() {
    if (typeof this.container === 'string') {
      this._container = document.querySelector(this.container) as HTMLDivElement;
    } else {
      this._container = this.container;
    }

    if (!this._container) {
      throw new Error(`SlickGrid requires a valid container, ${this.container} does not exist in the DOM.`);
    }

    // calculate these only once and share between grid instances
    if (this.options.mixinDefaults) {
      if (!this.options) { this.options = {}; }
      Utils.applyDefaults(this.options, this._defaults);
    } else {
      this._options = Utils.extend<O>(true, {}, this._defaults, this.options);
    }
    this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling as number);
    this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight();
    this.validateAndEnforceOptions();
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
    this._container.style.overflow = 'hidden';
    this._container.style.outline = String(0);
    this._container.classList.add(this.uid);
    this._container.classList.add('ui-widget');

    const containerStyles = window.getComputedStyle(this._container);
    if (!(/relative|absolute|fixed/).test(containerStyles.position)) {
      this._container.style.position = 'relative';
    }

    this._focusSink = Utils.createDomElement('div', { tabIndex: 0, style: { position: 'fixed', width: '0px', height: '0px', top: '0px', left: '0px', outline: '0px' } }, this._container);

    // Containers used for scrolling frozen columns and rows
    this._paneHeaderL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-left', tabIndex: 0 }, this._container);
    this._paneHeaderR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-right', tabIndex: 0 }, this._container);
    this._paneTopL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-left', tabIndex: 0 }, this._container);
    this._paneTopR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-right', tabIndex: 0 }, this._container);
    this._paneBottomL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-left', tabIndex: 0 }, this._container);
    this._paneBottomR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-right', tabIndex: 0 }, this._container);

    if (this._options.createPreHeaderPanel) {
      this._preHeaderPanelScroller = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, this._paneHeaderL);
      this._preHeaderPanelScroller.appendChild(document.createElement('div'));
      this._preHeaderPanel = Utils.createDomElement('div', null, this._preHeaderPanelScroller);
      this._preHeaderPanelSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._preHeaderPanelScroller);

      this._preHeaderPanelScrollerR = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, this._paneHeaderR);
      this._preHeaderPanelR = Utils.createDomElement('div', null, this._preHeaderPanelScrollerR);
      this._preHeaderPanelSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._preHeaderPanelScrollerR);

      if (!this._options.showPreHeaderPanel) {
        Utils.hide(this._preHeaderPanelScroller);
        Utils.hide(this._preHeaderPanelScrollerR);
      }
    }

    // Append the header scroller containers
    this._headerScrollerL = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-left' }, this._paneHeaderL);
    this._headerScrollerR = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-right' }, this._paneHeaderR);

    // Cache the header scroller containers
    this._headerScroller.push(this._headerScrollerL);
    this._headerScroller.push(this._headerScrollerR);

    // Append the columnn containers to the headers
    this._headerL = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-left', style: { left: '-1000px' } }, this._headerScrollerL);
    this._headerR = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-right', style: { left: '-1000px' } }, this._headerScrollerR);

    // Cache the header columns
    this._headers = [this._headerL, this._headerR];

    this._headerRowScrollerL = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this._paneTopL);
    this._headerRowScrollerR = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this._paneTopR);

    this._headerRowScroller = [this._headerRowScrollerL, this._headerRowScrollerR];

    this._headerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._headerRowScrollerL);
    this._headerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._headerRowScrollerR);

    this._headerRowL = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-left' }, this._headerRowScrollerL);
    this._headerRowR = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-right' }, this._headerRowScrollerR);

    this._headerRows = [this._headerRowL, this._headerRowR];

    // Append the top panel scroller
    this._topPanelScrollerL = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this._paneTopL);
    this._topPanelScrollerR = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this._paneTopR);

    this._topPanelScrollers = [this._topPanelScrollerL, this._topPanelScrollerR];

    // Append the top panel
    this._topPanelL = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this._topPanelScrollerL);
    this._topPanelR = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this._topPanelScrollerR);

    this._topPanels = [this._topPanelL, this._topPanelR];

    if (!this._options.showColumnHeader) {
      this._headerScroller.forEach((el) => {
        Utils.hide(el);
      });
    }

    if (!this._options.showTopPanel) {
      this._topPanelScrollers.forEach((scroller) => {
        Utils.hide(scroller);
      })
    }

    if (!this._options.showHeaderRow) {
      this._headerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      })
    }

    // Append the viewport containers
    this._viewportTopL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-left', tabIndex: 0 }, this._paneTopL);
    this._viewportTopR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-right', tabIndex: 0 }, this._paneTopR);
    this._viewportBottomL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-left', tabIndex: 0 }, this._paneBottomL);
    this._viewportBottomR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-right', tabIndex: 0 }, this._paneBottomR);

    // Cache the viewports
    this._viewport = [this._viewportTopL, this._viewportTopR, this._viewportBottomL, this._viewportBottomR];
    if (this._options.viewportClass) {
      this._viewport.forEach((view) => {
        view.classList.add(...(this._options.viewportClass || '').split(' '));
      });
    }

    // Default the active viewport to the top left
    this._activeViewportNode = this._viewportTopL;

    // Append the canvas containers
    this._canvasTopL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-left', tabIndex: 0 }, this._viewportTopL);
    this._canvasTopR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-right', tabIndex: 0 }, this._viewportTopR);
    this._canvasBottomL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-left', tabIndex: 0 }, this._viewportBottomL);
    this._canvasBottomR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-right', tabIndex: 0 }, this._viewportBottomR);

    // Cache the canvases
    this._canvas = [this._canvasTopL, this._canvasTopR, this._canvasBottomL, this._canvasBottomR];

    this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar();

    // Default the active canvas to the top left
    this._activeCanvasNode = this._canvasTopL;

    // pre-header
    if (this._preHeaderPanelSpacer) {
      Utils.width(this._preHeaderPanelSpacer, this.getCanvasWidth() + this.scrollbarDimensions.width);
    }

    this._headers.forEach((el) => {
      Utils.width(el, this.getHeadersWidth());
    })

    Utils.width(this._headerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width);
    Utils.width(this._headerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width);

    // footer Row
    if (this._options.createFooterRow) {
      this._footerRowScrollerR = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this._paneTopR);
      this._footerRowScrollerL = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this._paneTopL);

      this._footerRowScroller = [this._footerRowScrollerL, this._footerRowScrollerR];

      this._footerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._footerRowScrollerL);
      Utils.width(this._footerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width);
      this._footerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this._footerRowScrollerR);
      Utils.width(this._footerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width);


      this._footerRowL = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-left' }, this._footerRowScrollerL);
      this._footerRowR = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-right' }, this._footerRowScrollerR);

      this._footerRow = [this._footerRowL, this._footerRowR];

      if (!this._options.showFooterRow) {
        this._footerRowScroller.forEach((scroller) => {
          Utils.hide(scroller);
        });
      }
    }

    this._focusSink2 = this._focusSink.cloneNode(true) as HTMLDivElement;
    this._container.appendChild(this._focusSink2);

    if (!this._options.explicitInitialization) {
      this.finishInitialization();
    }
  }

  protected finishInitialization() {
    if (!this.initialized) {
      this.initialized = true;

      this.getViewportWidth();
      this.getViewportHeight();

      // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
      // calculate the diff so we can set consistent sizes
      this.measureCellPaddingAndBorder();

      // for usability reasons, all text selection in SlickGrid is disabled
      // with the exception of input and textarea elements (selection must
      // be enabled there so that editors work as expected); note that
      // selection in grid cells (grid body) is already unavailable in
      // all browsers except IE
      this.disableSelection(this._headers); // disable all text selection in header (including input and textarea)

      if (!this._options.enableTextSelectionOnCells) {
        // disable text selection in grid cells except in input and textarea elements
        // (this is IE-specific, because selectstart event will only fire in IE)
        this._viewport.forEach((view) => {
          this._bindingEventService.bind(view, 'selectstart', (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
              return;
            }
          });
        })
      }

      this.setFrozenOptions();
      this.setPaneVisibility();
      this.setScroller();
      this.setOverflow();

      this.updateColumnCaches();
      this.createColumnHeaders();
      this.createColumnFooter();
      this.setupColumnSort();
      this.createCssRules();
      this.resizeCanvas();
      this.bindAncestorScrollEvents();

      this._bindingEventService.bind(this._container, 'resize', this.resizeCanvas.bind(this));
      this._viewport.forEach((view) => {
        this._bindingEventService.bind(view, 'scroll', this.handleScroll.bind(this));
      });

      if (this._options.enableMouseWheelScrollHandler) {
        this._viewport.forEach((view) => {
          this.slickMouseWheelInstances.push(MouseWheel({
            element: view,
            onMouseWheel: this.handleMouseWheel.bind(this)
          }));
        });
      }

      this._headerScroller.forEach((el) => {
        this._bindingEventService.bind(el, 'contextmenu', this.handleHeaderContextMenu.bind(this) as EventListener);
        this._bindingEventService.bind(el, 'click', this.handleHeaderClick.bind(this) as EventListener);
      });

      this._headerRowScroller.forEach((scroller) => {
        this._bindingEventService.bind(scroller, 'scroll', this.handleHeaderRowScroll.bind(this) as EventListener);
      });

      if (this._options.createFooterRow) {
        this._footerRow.forEach((footer) => {
          this._bindingEventService.bind(footer, 'contextmenu', this.handleFooterContextMenu.bind(this) as EventListener);
          this._bindingEventService.bind(footer, 'click', this.handleFooterClick.bind(this) as EventListener);
        });

        this._footerRowScroller.forEach((scroller) => {
          this._bindingEventService.bind(scroller, 'scroll', this.handleFooterRowScroll.bind(this) as EventListener);
        });
      }

      if (this._options.createPreHeaderPanel) {
        this._bindingEventService.bind(this._preHeaderPanelScroller, 'scroll', this.handlePreHeaderPanelScroll.bind(this) as EventListener);
      }

      this._bindingEventService.bind(this._focusSink, 'keydown', this.handleKeyDown.bind(this) as EventListener);
      this._bindingEventService.bind(this._focusSink2, 'keydown', this.handleKeyDown.bind(this) as EventListener);

      this._canvas.forEach((element) => {
        this._bindingEventService.bind(element, 'keydown', this.handleKeyDown.bind(this) as EventListener);
        this._bindingEventService.bind(element, 'click', this.handleClick.bind(this) as EventListener);
        this._bindingEventService.bind(element, 'dblclick', this.handleDblClick.bind(this) as EventListener);
        this._bindingEventService.bind(element, 'contextmenu', this.handleContextMenu.bind(this) as EventListener);
        this._bindingEventService.bind(element, 'mouseover', this.handleCellMouseOver.bind(this) as EventListener);
        this._bindingEventService.bind(element, 'mouseout', this.handleCellMouseOut.bind(this) as EventListener);
      });

      if (Draggable) {
        this.slickDraggableInstance = Draggable({
          containerElement: this._container,
          allowDragFrom: 'div.slick-cell',
          onDragInit: this.handleDragInit.bind(this),
          onDragStart: this.handleDragStart.bind(this),
          onDrag: this.handleDrag.bind(this),
          onDragEnd: this.handleDragEnd.bind(this)
        });
      }

      if (!this._options.suppressCssChangesOnHiddenInit) {
        this.restoreCssFromHiddenInit();
      }
    }
  }

  /** handles "display:none" on container or container parents, related to issue: https://github.com/6pac/SlickGrid/issues/568 */
  cacheCssForHiddenInit() {
    this._hiddenParents = Utils.parents(this._container, ':hidden') as HTMLElement[];
    for (const el of this._hiddenParents) {
      const old: Partial<CSSStyleDeclaration> = {};
      for (const name in this.cssShow) {
        old[name as any] = el.style[name as 'position' | 'visibility' | 'display'];
        el.style[name as any] = this.cssShow[name as 'position' | 'visibility' | 'display'];
      }
      this.oldProps.push(old);
    }
  }

  restoreCssFromHiddenInit() {
    // finish handle display:none on container or container parents
    // - put values back the way they were
    let i = 0;
    for (const el of this._hiddenParents) {
      const old = this.oldProps[i++];
      for (const name in this.cssShow) {
        el.style[name as CSSStyleDeclarationWritable] = (old as any)[name];
      }
    }
  }

  protected hasFrozenColumns() {
    return this._options.frozenColumn! > -1;
  }

  /** Register an external Plugin */
  registerPlugin<T extends Plugin>(plugin: T) {
    this.plugins.unshift(plugin);
    plugin.init(this as unknown as SlickGridModel);
  }

  /** Unregister (destroy) an external Plugin */
  unregisterPlugin(plugin: Plugin) {
    for (let i = this.plugins.length; i >= 0; i--) {
      if (this.plugins[i] === plugin) {
        this.plugins[i]?.destroy();
        this.plugins.splice(i, 1);
        break;
      }
    }
  }

  /** Get a Plugin (addon) by its name */
  getPluginByName<P extends Plugin | undefined = undefined>(name: string) {
    for (let i = this.plugins.length - 1; i >= 0; i--) {
      if (this.plugins[i]?.pluginName === name) {
        return this.plugins[i] as P;
      }
    }
    return undefined;
  }

  /**
   * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
   * @param {Object} selectionModel A SelectionModel.
   */
  setSelectionModel(model: SelectionModel) {
    if (this.selectionModel) {
      this.selectionModel.onSelectedRangesChanged.unsubscribe(this.handleSelectedRangesChanged.bind(this));
      if (this.selectionModel.destroy) {
        this.selectionModel.destroy();
      }
    }

    this.selectionModel = model;
    if (this.selectionModel) {
      this.selectionModel.init(this as unknown as SlickGridModel);
      this.selectionModel.onSelectedRangesChanged.subscribe(this.handleSelectedRangesChanged.bind(this));
    }
  }

  /** Returns the current SelectionModel. See here for more information about SelectionModels. */
  getSelectionModel() {
    return this.selectionModel;
  }

  /** Get Grid Canvas Node DOM Element */
  getCanvasNode(columnIdOrIdx?: number | string, rowIndex?: number) {
    return this._getContainerElement(this.getCanvases(), columnIdOrIdx, rowIndex) as HTMLDivElement;
  }

  /** Get the canvas DOM element */
  getActiveCanvasNode(e?: Event | SlickEventData_) {
    if (e === undefined) {
      return this._activeCanvasNode;
    }

    if (e instanceof SlickEventData) {
      e = e.getNativeEvent<Event>();
    }

    this._activeCanvasNode = (e as any)?.target.closest('.grid-canvas');
    return this._activeCanvasNode;
  }

  /** Get the canvas DOM element */
  getCanvases() {
    return this._canvas;
  }

  /** Get the Viewport DOM node element */
  getViewportNode(columnIdOrIdx?: number | string, rowIndex?: number) {
    return this._getContainerElement(this.getViewports(), columnIdOrIdx, rowIndex);
  }

  /** Get all the Viewport node elements */
  getViewports() {
    return this._viewport;
  }

  getActiveViewportNode(e: Event | SlickEventData_) {
    this.setActiveViewportNode(e);

    return this._activeViewportNode;
  }

  /** Sets an active viewport node */
  setActiveViewportNode(e: Event | SlickEventData_) {
    if (e instanceof SlickEventData) {
      e = e.getNativeEvent<Event>();
    }
    this._activeViewportNode = (e as any)?.target.closest('.slick-viewport');
    return this._activeViewportNode;
  }

  protected _getContainerElement(targetContainers: HTMLElement[], columnIdOrIdx?: number | string, rowIndex?: number) {
    if (!targetContainers) { return; }
    if (!columnIdOrIdx) { columnIdOrIdx = 0; }
    if (!rowIndex) { rowIndex = 0; }

    const idx = (typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx));

    const isBottomSide = this.hasFrozenRows && rowIndex >= this.actualFrozenRow + (this._options.frozenBottom ? 0 : 1);
    const isRightSide = this.hasFrozenColumns() && idx > this._options.frozenColumn!;

    return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
  }

  protected measureScrollbar() {
    let className = '';
    this._viewport.forEach(v => className += v.className);
    const outerdiv = Utils.createDomElement('div', { className, style: { position: 'absolute', top: '-10000px', left: '-10000px', overflow: 'auto', width: '100px', height: '100px' } }, document.body);
    const innerdiv = Utils.createDomElement('div', { style: { width: '200px', height: '200px', overflow: 'auto' } }, outerdiv);
    const dim = {
      width: outerdiv.offsetWidth - outerdiv.clientWidth,
      height: outerdiv.offsetHeight - outerdiv.clientHeight
    };
    innerdiv.remove();
    outerdiv.remove();
    return dim;
  }

  /** Get the headers width in pixel */
  getHeadersWidth() {
    this.headersWidth = this.headersWidthL = this.headersWidthR = 0;
    const includeScrollbar = !this._options.autoHeight;

    let i = 0;
    const ii = this.columns.length;
    for (i = 0; i < ii; i++) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      const width = this.columns[i].width;

      if ((this._options.frozenColumn!) > -1 && (i > this._options.frozenColumn!)) {
        this.headersWidthR += width || 0;
      } else {
        this.headersWidthL += width || 0;
      }
    }

    if (includeScrollbar) {
      if ((this._options.frozenColumn!) > -1 && (i > this._options.frozenColumn!)) {
        this.headersWidthR += this.scrollbarDimensions?.width ?? 0;
      } else {
        this.headersWidthL += this.scrollbarDimensions?.width ?? 0;
      }
    }

    if (this.hasFrozenColumns()) {
      this.headersWidthL = this.headersWidthL + 1000;

      this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.headersWidthL;
      this.headersWidthR += this.scrollbarDimensions?.width ?? 0;
    } else {
      this.headersWidthL += this.scrollbarDimensions?.width ?? 0;
      this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1000;
    }

    this.headersWidth = this.headersWidthL + this.headersWidthR;
    return Math.max(this.headersWidth, this.viewportW) + 1000;
  }

  protected getHeadersWidthL() {
    this.headersWidthL = 0;

    this.columns.forEach((column, i) => {
      if (column.hidden) return;

      if (!((this._options.frozenColumn!) > -1 && (i > this._options.frozenColumn!))) {
        this.headersWidthL += column.width || 0;
      }
    });

    if (this.hasFrozenColumns()) {
      this.headersWidthL += 1000;
    } else {
      this.headersWidthL += this.scrollbarDimensions?.width ?? 0;
      this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1000;
    }

    return this.headersWidthL;
  }

  protected getHeadersWidthR() {
    this.headersWidthR = 0;

    this.columns.forEach((column, i) => {
      if (column.hidden) return;
      if ((this._options.frozenColumn!) > -1 && (i > this._options.frozenColumn!)) {
        this.headersWidthR += column.width || 0;
      }
    });

    if (this.hasFrozenColumns()) {
      this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.getHeadersWidthL();
      this.headersWidthR += this.scrollbarDimensions?.width ?? 0;
    }

    return this.headersWidthR;
  }

  /** Get the grid canvas width */
  getCanvasWidth(): number {
    const availableWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;
    let i = this.columns.length;

    this.canvasWidthL = this.canvasWidthR = 0;

    while (i--) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      if (this.hasFrozenColumns() && (i > this._options.frozenColumn!)) {
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
        if (this.hasFrozenColumns()) {
          this.canvasWidthR += extraWidth;
        } else {
          this.canvasWidthL += extraWidth;
        }
      }
    }
    return totalRowWidth;
  }

  protected updateCanvasWidth(forceColumnWidthsUpdate?: boolean) {
    const oldCanvasWidth = this.canvasWidth;
    const oldCanvasWidthL = this.canvasWidthL;
    const oldCanvasWidthR = this.canvasWidthR;
    this.canvasWidth = this.getCanvasWidth();

    const widthChanged = this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;

    if (widthChanged || this.hasFrozenColumns() || this.hasFrozenRows) {
      Utils.width(this._canvasTopL, this.canvasWidthL);

      this.getHeadersWidth();

      Utils.width(this._headerL, this.headersWidthL);
      Utils.width(this._headerR, this.headersWidthR);

      if (this.hasFrozenColumns()) {
        const cWidth = Utils.width(this._container) || 0;
        if (cWidth > 0 && this.canvasWidthL > cWidth) {
          throw new Error('[SlickGrid] Frozen columns cannot be wider than the actual grid container width. '
            + 'Make sure to have less columns freezed or make your grid container wider');
        }
        Utils.width(this._canvasTopR, this.canvasWidthR);

        Utils.width(this._paneHeaderL, this.canvasWidthL);
        Utils.setStyleSize(this._paneHeaderR, 'left', this.canvasWidthL);
        Utils.setStyleSize(this._paneHeaderR, 'width', this.viewportW - this.canvasWidthL);

        Utils.width(this._paneTopL, this.canvasWidthL);
        Utils.setStyleSize(this._paneTopR, 'left', this.canvasWidthL);
        Utils.width(this._paneTopR, this.viewportW - this.canvasWidthL);

        Utils.width(this._headerRowScrollerL, this.canvasWidthL);
        Utils.width(this._headerRowScrollerR, this.viewportW - this.canvasWidthL);

        Utils.width(this._headerRowL, this.canvasWidthL);
        Utils.width(this._headerRowR, this.canvasWidthR);

        if (this._options.createFooterRow) {
          Utils.width(this._footerRowScrollerL, this.canvasWidthL);
          Utils.width(this._footerRowScrollerR, this.viewportW - this.canvasWidthL);

          Utils.width(this._footerRowL, this.canvasWidthL);
          Utils.width(this._footerRowR, this.canvasWidthR);
        }
        if (this._options.createPreHeaderPanel) {
          Utils.width(this._preHeaderPanel, this.canvasWidth);
        }
        Utils.width(this._viewportTopL, this.canvasWidthL);
        Utils.width(this._viewportTopR, this.viewportW - this.canvasWidthL);

        if (this.hasFrozenRows) {
          Utils.width(this._paneBottomL, this.canvasWidthL);
          Utils.setStyleSize(this._paneBottomR, 'left', this.canvasWidthL);

          Utils.width(this._viewportBottomL, this.canvasWidthL);
          Utils.width(this._viewportBottomR, this.viewportW - this.canvasWidthL);

          Utils.width(this._canvasBottomL, this.canvasWidthL);
          Utils.width(this._canvasBottomR, this.canvasWidthR);
        }
      } else {
        Utils.width(this._paneHeaderL, '100%');
        Utils.width(this._paneTopL, '100%');
        Utils.width(this._headerRowScrollerL, '100%');
        Utils.width(this._headerRowL, this.canvasWidth);

        if (this._options.createFooterRow) {
          Utils.width(this._footerRowScrollerL, '100%');
          Utils.width(this._footerRowL, this.canvasWidth);
        }

        if (this._options.createPreHeaderPanel) {
          Utils.width(this._preHeaderPanel, this.canvasWidth);
        }
        Utils.width(this._viewportTopL, '100%');

        if (this.hasFrozenRows) {
          Utils.width(this._viewportBottomL, '100%');
          Utils.width(this._canvasBottomL, this.canvasWidthL);
        }
      }
    }

    this.viewportHasHScroll = (this.canvasWidth >= this.viewportW - (this.scrollbarDimensions?.width ?? 0));

    Utils.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0));
    Utils.width(this._headerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0));

    if (this._options.createFooterRow) {
      Utils.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0));
      Utils.width(this._footerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0));
    }

    if (widthChanged || forceColumnWidthsUpdate) {
      this.applyColumnWidths();
    }
  }

  protected disableSelection(target: HTMLElement[]) {
    target.forEach((el) => {
      el.setAttribute('unselectable', 'on');
      (el.style as any).mozUserSelect = 'none';
      this._bindingEventService.bind(el, 'selectstart', () => false);
    });
  }

  protected getMaxSupportedCssHeight() {
    let supportedHeight = 1000000;
    // FF reports the height back but still renders blank after ~6M px
    //let testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
    const testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? this._options.ffMaxSupportedCssHeight : this._options.maxSupportedCssHeight;
    const div = Utils.createDomElement('div', { style: { display: 'hidden' } }, document.body);

    while (true) {
      const test = supportedHeight * 2;
      Utils.height(div, test);
      const height = Utils.height(div);

      if (test > testUpTo! || height !== test) {
        break;
      } else {
        supportedHeight = test;
      }
    }

    div.remove();
    return supportedHeight;
  }

  /** Get grid unique identifier */
  getUID() {
    return this.uid;
  }

  /** Get Header Column Width Difference in pixel */
  getHeaderColumnWidthDiff() {
    return this.headerColumnWidthDiff;
  }

  /** Get scrollbar dimensions */
  getScrollbarDimensions() {
    return this.scrollbarDimensions;
  }

  /** Get the displayed scrollbar dimensions */
  getDisplayedScrollbarDimensions() {
    return {
      width: this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0,
      height: this.viewportHasHScroll ? (this.scrollbarDimensions?.height ?? 0) : 0
    };
  }

  /** Get the absolute column minimum width */
  getAbsoluteColumnMinWidth(): number {
    return this.absoluteColumnMinWidth;
  }

  // TODO:  this is static.  need to handle page mutation.
  protected bindAncestorScrollEvents() {
    let elem: HTMLElement | null = (this.hasFrozenRows && !this._options.frozenBottom) ? this._canvasBottomL : this._canvasTopL;
    while ((elem = elem!.parentNode as HTMLElement) !== document.body && elem != null) {
      // bind to scroll containers only
      if (elem == this._viewportTopL || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) {
        this._boundAncestors.push(elem);
        this._bindingEventService.bind(elem, 'scroll', this.handleActiveCellPositionChange.bind(this));
      }
    }
  }

  protected unbindAncestorScrollEvents() {
    this._boundAncestors.forEach((ancestor) => {
      this._bindingEventService.unbindByEventName(ancestor, 'scroll');
    });
    this._boundAncestors = [];
  }

  /**
   * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
   * @param {Number|String} columnId Column id.
   * @param {String} [title] New column name.
   * @param {String} [toolTip] New column tooltip.
   */
  updateColumnHeader(columnId: number | string, title?: string, toolTip?: string) {
    if (!this.initialized) { return; }
    const idx = this.getColumnIndex(columnId);
    if (idx == null) {
      return;
    }

    const columnDef = this.columns[idx];
    const header: any = this.getColumnByIndex(idx);
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
        grid: this
      });

      header.setAttribute('title', toolTip || '');
      if (title !== undefined) {
        header.children[0].innerHTML = this.sanitizeHtmlString(title);
      }

      this.trigger(this.onHeaderCellRendered, {
        node: header,
        column: columnDef,
        grid: this
      });
    }
  }

  /**
   * Get the Header DOM element
   * @param {C} columnDef - column definition
   */
  getHeader(columnDef: C) {
    if (!columnDef) {
      return this.hasFrozenColumns() ? this._headers : this._headerL;
    }
    const idx = this.getColumnIndex(columnDef.id);
    return this.hasFrozenColumns() ? ((idx <= this._options.frozenColumn!) ? this._headerL : this._headerR) : this._headerL;
  }

  /**
   * Get a specific Header Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderColumn(columnIdOrIdx: number | string) {
    const idx = (typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx));
    const targetHeader = this.hasFrozenColumns() ? ((idx <= this._options.frozenColumn!) ? this._headerL : this._headerR) : this._headerL;
    const targetIndex = this.hasFrozenColumns() ? ((idx <= this._options.frozenColumn!) ? idx : idx - this._options.frozenColumn! - 1) : idx;

    return targetHeader.children[targetIndex] as HTMLDivElement;
  }

  /** Get the Header Row DOM element */
  getHeaderRow() {
    return this.hasFrozenColumns() ? this._headerRows : this._headerRows[0];
  }

  /** Get the Footer DOM element */
  getFooterRow() {
    return this.hasFrozenColumns() ? this._footerRow : this._footerRow[0];
  }

  /** @alias `getPreHeaderPanelLeft` */
  getPreHeaderPanel() {
    return this._preHeaderPanel;
  }

  /** Get the Pre-Header Panel Left DOM node element */
  getPreHeaderPanelLeft() {
    return this._preHeaderPanel;
  }

  /** Get the Pre-Header Panel Right DOM node element */
  getPreHeaderPanelRight() {
    return this._preHeaderPanelR;
  }

  /**
   * Get Header Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderRowColumn(columnIdOrIdx: number | string) {
    let idx = (typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx));
    let headerRowTarget: HTMLDivElement;

    if (this.hasFrozenColumns()) {
      if (idx <= this._options.frozenColumn!) {
        headerRowTarget = this._headerRowL;
      } else {
        headerRowTarget = this._headerRowR;
        idx -= this._options.frozenColumn! + 1;
      }
    } else {
      headerRowTarget = this._headerRowL;
    }

    return headerRowTarget.children[idx] as HTMLDivElement;
  }

  /**
   * Get the Footer Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getFooterRowColumn(columnIdOrIdx: number | string) {
    let idx = (typeof columnIdOrIdx === 'number' ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx));
    let footerRowTarget: HTMLDivElement;

    if (this.hasFrozenColumns()) {
      if (idx <= this._options.frozenColumn!) {
        footerRowTarget = this._footerRowL;
      } else {
        footerRowTarget = this._footerRowR;

        idx -= this._options.frozenColumn! + 1;
      }
    } else {
      footerRowTarget = this._footerRowL;
    }

    return footerRowTarget.children[idx] as HTMLDivElement;
  }

  protected createColumnFooter() {
    if (this._options.createFooterRow) {
      this._footerRow.forEach((footer) => {
        const columnElements = footer.querySelectorAll('.slick-footerrow-column');
        columnElements.forEach((column) => {
          const columnDef = Utils.storage.get(column, 'column');
          this.trigger(this.onBeforeFooterRowCellDestroy, {
            node: column,
            column: columnDef,
            grid: this
          });
        });
      });

      Utils.emptyElement(this._footerRowL);
      Utils.emptyElement(this._footerRowR);

      for (let i = 0; i < this.columns.length; i++) {
        const m = this.columns[i];
        if (!m || m.hidden) continue;

        const footerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, this.hasFrozenColumns() && (i > this._options.frozenColumn!) ? this._footerRowR : this._footerRowL);
        const className = this.hasFrozenColumns() && i <= this._options.frozenColumn! ? 'frozen' : null;
        if (className) {
          footerRowCell.classList.add(className);
        }

        Utils.storage.put(footerRowCell, 'column', m);

        this.trigger(this.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: this
        });
      }
    }
  }

  protected handleHeaderMouseHoverOn(e: Event | SlickEventData_) {
    (e as any)?.target.classList.add('ui-state-hover', 'slick-state-hover');
  }

  protected handleHeaderMouseHoverOff(e: Event | SlickEventData_) {
    (e as any)?.target.classList.remove('ui-state-hover', 'slick-state-hover');
  }

  protected createColumnHeaders() {
    this._headers.forEach((header) => {
      const columnElements = header.querySelectorAll('.slick-header-column')
      columnElements.forEach((column) => {
        const columnDef = Utils.storage.get(column, 'column');
        if (columnDef) {
          this.trigger(this.onBeforeHeaderCellDestroy, {
            node: column,
            column: columnDef,
            grid: this
          });
        }
      });
    })

    Utils.emptyElement(this._headerL);
    Utils.emptyElement(this._headerR);

    this.getHeadersWidth();

    Utils.width(this._headerL, this.headersWidthL);
    Utils.width(this._headerR, this.headersWidthR);

    this._headerRows.forEach((row) => {
      const columnElements = row.querySelectorAll('.slick-headerrow-column');
      columnElements.forEach((column) => {
        const columnDef = Utils.storage.get(column, 'column');
        if (columnDef) {
          this.trigger(this.onBeforeHeaderRowCellDestroy, {
            node: this,
            column: columnDef,
            grid: this
          });
        }
      });
    });

    Utils.emptyElement(this._headerRowL);
    Utils.emptyElement(this._headerRowR);

    if (this._options.createFooterRow) {
      const footerRowColumnElements = this._footerRowL.querySelectorAll('.slick-footerrow-column');
      footerRowColumnElements.forEach((column) => {
        const columnDef = Utils.storage.get(column, 'column');
        if (columnDef) {
          this.trigger(this.onBeforeFooterRowCellDestroy, {
            node: this,
            column: columnDef,
            grid: this
          });
        }
      });
      Utils.emptyElement(this._footerRowL);

      if (this.hasFrozenColumns()) {
        const footerRowColumnElements = this._footerRowR.querySelectorAll('.slick-footerrow-column');
        footerRowColumnElements.forEach((column) => {
          const columnDef = Utils.storage.get(column, 'column');
          if (columnDef) {
            this.trigger(this.onBeforeFooterRowCellDestroy, {
              node: this,
              column: columnDef,
              grid: this
            });
          }
        });
        Utils.emptyElement(this._footerRowR);
      }
    }

    for (let i = 0; i < this.columns.length; i++) {
      const m: C = this.columns[i];
      const headerTarget = this.hasFrozenColumns() ? ((i <= this._options.frozenColumn!) ? this._headerL : this._headerR) : this._headerL;
      const headerRowTarget = this.hasFrozenColumns() ? ((i <= this._options.frozenColumn!) ? this._headerRowL : this._headerRowR) : this._headerRowL;

      const header = Utils.createDomElement('div', { id: `${this.uid + m.id}`, dataset: { id: String(m.id) }, className: 'ui-state-default slick-state-default slick-header-column', title: m.toolTip || '' }, headerTarget);
      Utils.createDomElement('span', { className: 'slick-column-name', innerHTML: this.sanitizeHtmlString(m.name as string) }, header);
      Utils.width(header, m.width! - this.headerColumnWidthDiff);

      let classname = m.headerCssClass || null;
      if (classname) {
        header.classList.add(...classname.split(' '));
      }
      classname = this.hasFrozenColumns() && i <= this._options.frozenColumn! ? 'frozen' : null;
      if (classname) {
        header.classList.add(classname);
      }

      this._bindingEventService.bind(header, 'mouseenter', this.handleHeaderMouseEnter.bind(this) as EventListener);
      this._bindingEventService.bind(header, 'mouseleave', this.handleHeaderMouseLeave.bind(this) as EventListener);

      Utils.storage.put(header, 'column', m);

      if (this._options.enableColumnReorder || m.sortable) {
        this._bindingEventService.bind(header, 'mouseenter', this.handleHeaderMouseHoverOn.bind(this) as EventListener);
        this._bindingEventService.bind(header, 'mouseleave', this.handleHeaderMouseHoverOff.bind(this) as EventListener);
      }

      if (m.hasOwnProperty('headerCellAttrs') && m.headerCellAttrs instanceof Object) {
        for (const key in m.headerCellAttrs) {
          if (m.headerCellAttrs.hasOwnProperty(key)) {
            header.setAttribute(key, m.headerCellAttrs[key]);
          }
        }
      }

      if (m.sortable) {
        header.classList.add('slick-header-sortable');
        Utils.createDomElement('div', { className: `slick-sort-indicator ${this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? ' slick-sort-indicator-numbered' : ''}` }, header);
        if (this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan) {
          Utils.createDomElement('div', { className: 'slick-sort-indicator-numbered' }, header);
        }
      }

      this.trigger(this.onHeaderCellRendered, {
        node: header,
        column: m,
        grid: this
      });

      if (this._options.showHeaderRow) {
        const headerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-state-default slick-headerrow-column l${i} r${i}` }, headerRowTarget);
        const classname = this.hasFrozenColumns() && i <= this._options.frozenColumn! ? 'frozen' : null;
        if (classname) {
          headerRowCell.classList.add(classname);
        }

        this._bindingEventService.bind(headerRowCell, 'mouseenter', this.handleHeaderRowMouseEnter.bind(this) as EventListener);
        this._bindingEventService.bind(headerRowCell, 'mouseleave', this.handleHeaderRowMouseLeave.bind(this) as EventListener);

        Utils.storage.put(headerRowCell, 'column', m);

        this.trigger(this.onHeaderRowCellRendered, {
          node: headerRowCell,
          column: m,
          grid: this
        });
      }
      if (this._options.createFooterRow && this._options.showFooterRow) {
        const footerRowTarget = this.hasFrozenColumns() ? ((i <= this._options.frozenColumn!) ? this._footerRow[0] : this._footerRow[1]) : this._footerRow[0];
        const footerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, footerRowTarget);
        Utils.storage.put(footerRowCell, 'column', m)

        this.trigger(this.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: this
        });
      }
    }

    this.setSortColumns(this.sortColumns);
    this.setupColumnResize();
    if (this._options.enableColumnReorder) {
      if (typeof this._options.enableColumnReorder === 'function') {
        this._options.enableColumnReorder(this as unknown as SlickGridModel, this._headers, this.headerColumnWidthDiff, this.setColumns as any, this.setupColumnResize, this.columns, this.getColumnIndex, this.uid, this.trigger);
      } else {
        this.setupColumnReorder();
      }
    }
  }

  protected setupColumnSort() {
    this._headers.forEach((header) => {
      this._bindingEventService.bind(header, 'click', (e: any) => {
        if (this.columnResizeDragging) {
          return;
        }

        if (e.target.classList.contains('slick-resizable-handle')) {
          return;
        }

        const coll = e.target.closest('.slick-header-column');
        if (!coll) {
          return;
        }

        const column = Utils.storage.get(coll, 'column');
        if (column.sortable) {
          if (!this.getEditorLock()?.commitCurrentEdit()) {
            return;
          }

          const previousSortColumns = this.sortColumns.slice();
          let sortColumn: ColumnSort | null = null;
          let i = 0;
          for (; i < this.sortColumns.length; i++) {
            if (this.sortColumns[i].columnId == column.id) {
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
              previousSortColumns: previousSortColumns,
              columnId: (this.sortColumns.length > 0 ? column.id : null),
              sortCol: (this.sortColumns.length > 0 ? column : null),
              sortAsc: (this.sortColumns.length > 0 ? this.sortColumns[0].sortAsc : true)
            };
          } else {
            onSortArgs = {
              multiColumnSort: true,
              previousSortColumns: previousSortColumns,
              sortCols: this.sortColumns.map((col) => {
                return { columnId: this.columns[this.getColumnIndex(col.columnId)].id, sortCol: this.columns[this.getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
              })
            };
          }

          if (this.trigger(this.onBeforeSort, onSortArgs, e).getReturnValue() !== false) {
            this.setSortColumns(this.sortColumns);
            this.trigger(this.onSort, onSortArgs, e);
          }
        }
      });
    });
  }

  protected currentPositionInHeader(id: number | string) {
    let currentPosition = 0;
    this._headers.forEach((header) => {
      const columnElements = header.querySelectorAll('.slick-header-column')
      columnElements.forEach((column, i) => {
        if (column.id == id) {
          currentPosition = i;
        }
      });
    });

    return currentPosition;
  }

  protected remove(arr: any[], elem: HTMLElement) {
    const index = arr.lastIndexOf(elem);
    if (index > -1) {
      arr.splice(index, 1);
      this.remove(arr, elem);
    }
  }

  protected setupColumnReorder() {
    if (this.sortableSideLeftInstance) {
      this.sortableSideLeftInstance.destroy();
      this.sortableSideRightInstance.destroy();
    }

    let columnScrollTimer: any = null;

    const scrollColumnsRight = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft + 10;
    const scrollColumnsLeft = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft - 10;

    let canDragScroll;
    const sortableOptions = {
      animation: 50,
      direction: 'horizontal',
      chosenClass: 'slick-header-column-active',
      ghostClass: 'slick-sortable-placeholder',
      draggable: '.slick-header-column',
      dragoverBubble: false,
      revertClone: true,
      scroll: !this.hasFrozenColumns(), // enable auto-scroll
      onStart: (e: { item: any; originalEvent: MouseEvent; }) => {
        canDragScroll = !this.hasFrozenColumns() ||
          Utils.offset(e.item)!.left > Utils.offset(this._viewportScrollContainerX)!.left;

        if (canDragScroll && e.originalEvent.pageX > this._container.clientWidth) {
          if (!(columnScrollTimer)) {
            columnScrollTimer = setInterval(scrollColumnsRight, 100);
          }
        } else if (canDragScroll && e.originalEvent.pageX < Utils.offset(this._viewportScrollContainerX)!.left) {
          if (!(columnScrollTimer)) {
            columnScrollTimer = setInterval(scrollColumnsLeft, 100);
          }
        } else {
          clearInterval(columnScrollTimer);
          columnScrollTimer = null;
        }
      },
      onEnd: (e: MouseEvent & { item: any; originalEvent: MouseEvent; }) => {
        const cancel = false;
        clearInterval(columnScrollTimer);
        columnScrollTimer = null;
        let limit;

        if (cancel || !this.getEditorLock()?.commitCurrentEdit()) {
          return;
        }

        let reorderedIds = this.sortableSideLeftInstance?.toArray();
        reorderedIds = reorderedIds.concat(this.sortableSideRightInstance?.toArray());

        const reorderedColumns: C[] = [];
        for (let i = 0; i < reorderedIds.length; i++) {
          reorderedColumns.push(this.columns[this.getColumnIndex(reorderedIds[i])]);
        }
        this.setColumns(reorderedColumns);

        this.trigger(this.onColumnsReordered, { impactedColumns: this.getImpactedColumns(limit) });
        e.stopPropagation();
        this.setupColumnResize();
        if (this.activeCellNode) {
          this.setFocus(); // refocus on active cell
        }
      }
    };

    this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions);
    this.sortableSideRightInstance = Sortable.create(this._headerR, sortableOptions);
  }

  protected getHeaderChildren() {
    const a = Array.from(this._headers[0].children);
    const b = Array.from(this._headers[1].children);
    return a.concat(b) as HTMLElement[];
  }

  protected getImpactedColumns(limit?: { start: number; end: number; }) {
    let impactedColumns: C[] = [];

    if (limit) {
      for (let i = limit.start; i <= limit.end; i++) {
        impactedColumns.push(this.columns[i]);
      }
    } else {
      impactedColumns = this.columns;
    }

    return impactedColumns;
  }

  protected handleResizeableHandleDoubleClick(evt: MouseEvent & { target: HTMLDivElement; }) {
    const triggeredByColumn = evt.target.parentElement!.id.replace(this.uid, '');
    this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn: triggeredByColumn });
  }

  protected setupColumnResize() {
    if (typeof Resizable === 'undefined') {
      throw new Error(`Slick.Resizable is undefined, make sure to import "slick.interactions.js"`);
    }

    let j: number, k: number, c: C, pageX: number, minPageX: number, maxPageX: number, firstResizable: number | undefined, lastResizable = -1;
    let frozenLeftColMaxWidth = 0;

    const children: HTMLElement[] = this.getHeaderChildren();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const handles = child.querySelectorAll('.slick-resizable-handle');
      handles.forEach((handle) => handle.remove());

      if (i >= this.columns.length || !this.columns[i] || this.columns[i].hidden) {
        continue;
      }

      if (this.columns[i].resizable) {
        if (firstResizable === undefined) {
          firstResizable = i;
        }
        lastResizable = i;
      }
    }

    if (firstResizable === undefined) {
      return;
    }

    for (let i = 0; i < children.length; i++) {
      const colElm = children[i];

      if (i >= this.columns.length || !this.columns[i] || this.columns[i].hidden) {
        continue;
      }
      if (i < firstResizable || (this._options.forceFitColumns && i >= lastResizable)) {
        continue;
      }

      const resizeableHandle = Utils.createDomElement('div', { className: 'slick-resizable-handle', role: 'separator', ariaOrientation: 'horizontal' }, colElm);
      this._bindingEventService.bind(resizeableHandle, 'dblclick', this.handleResizeableHandleDoubleClick.bind(this) as EventListener);

      this.slickResizableInstances.push(
        Resizable({
          resizeableElement: colElm as HTMLElement,
          resizeableHandleElement: resizeableHandle,
          onResizeStart: (e: DOMMouseOrTouchEvent<HTMLDivElement>, resizeElms: { resizeableElement: HTMLElement; }): boolean | void => {
            const targetEvent = e.touches ? e.touches[0] : e;
            if (!this.getEditorLock()?.commitCurrentEdit()) {
              return false;
            }
            pageX = targetEvent.pageX;
            frozenLeftColMaxWidth = 0;
            resizeElms.resizeableElement.classList.add('slick-header-column-active');
            let shrinkLeewayOnRight: number | null = null;
            let stretchLeewayOnRight: number | null = null;
            // lock each column's width option to current width
            for (let pw = 0; pw < children.length; pw++) {
              if (pw >= this.columns.length || !this.columns[pw] || this.columns[pw].hidden) {
                continue;
              }
              this.columns[pw].previousWidth = children[pw].offsetWidth;
            }
            if (this._options.forceFitColumns) {
              shrinkLeewayOnRight = 0;
              stretchLeewayOnRight = 0;
              // colums on right affect maxPageX/minPageX
              for (j = i + 1; j < this.columns.length; j++) {
                c = this.columns[j];
                if (c && c.resizable && !c.hidden) {
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
              c = this.columns[j];
              if (c && c.resizable && !c.hidden) {
                if (stretchLeewayOnLeft !== null) {
                  if (c.maxWidth) {
                    stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0);
                  } else {
                    stretchLeewayOnLeft = null;
                  }
                }
                shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
              }
            }
            if (shrinkLeewayOnRight === null) {
              shrinkLeewayOnRight = 100000;
            }
            if (shrinkLeewayOnLeft === null) {
              shrinkLeewayOnLeft = 100000;
            }
            if (stretchLeewayOnRight === null) {
              stretchLeewayOnRight = 100000;
            }
            if (stretchLeewayOnLeft === null) {
              stretchLeewayOnLeft = 100000;
            }
            maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
            minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
          },
          onResize: (e: DOMMouseOrTouchEvent<HTMLDivElement>, resizeElms: { resizeableElement: HTMLElement; resizeableHandleElement: HTMLElement; }) => {
            const targetEvent = e.touches ? e.touches[0] : e;
            this.columnResizeDragging = true;
            let actualMinWidth;
            const d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX
            let x;
            let newCanvasWidthL = 0, newCanvasWidthR = 0;
            const viewportWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;

            if (d < 0) { // shrink column
              x = d;

              for (j = i; j >= 0; j--) {
                c = this.columns[j];
                if (c && c.resizable && !c.hidden) {
                  actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
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
                c = this.columns[k];
                if (!c || c.hidden) { continue; }

                if (this.hasFrozenColumns() && (k > this._options.frozenColumn!)) {
                  newCanvasWidthR += c.width || 0;
                } else {
                  newCanvasWidthL += c.width || 0;
                }
              }

              if (this._options.forceFitColumns) {
                x = -d;
                for (j = i + 1; j < this.columns.length; j++) {
                  c = this.columns[j];
                  if (!c || c.hidden) { continue; }
                  if (c.resizable) {
                    if (x && c.maxWidth && (c.maxWidth - (c.previousWidth || 0) < x)) {
                      x -= c.maxWidth - (c.previousWidth || 0);
                      c.width = c.maxWidth;
                    } else {
                      c.width = (c.previousWidth || 0) + x;
                      x = 0;
                    }

                    if (this.hasFrozenColumns() && (j > this._options.frozenColumn!)) {
                      newCanvasWidthR += c.width || 0;
                    } else {
                      newCanvasWidthL += c.width || 0;
                    }
                  }
                }
              } else {
                for (j = i + 1; j < this.columns.length; j++) {
                  c = this.columns[j];
                  if (!c || c.hidden) { continue; }

                  if (this.hasFrozenColumns() && (j > this._options.frozenColumn!)) {
                    newCanvasWidthR += c.width || 0;
                  } else {
                    newCanvasWidthL += c.width || 0;
                  }
                }
              }

              if (this._options.forceFitColumns) {
                x = -d;
                for (j = i + 1; j < this.columns.length; j++) {
                  c = this.columns[j];
                  if (!c || c.hidden) { continue; }
                  if (c.resizable) {
                    if (x && c.maxWidth && (c.maxWidth - (c.previousWidth || 0) < x)) {
                      x -= c.maxWidth - (c.previousWidth || 0);
                      c.width = c.maxWidth;
                    } else {
                      c.width = (c.previousWidth || 0) + x;
                      x = 0;
                    }
                  }
                }
              }
            } else { // stretch column
              x = d;

              newCanvasWidthL = 0;
              newCanvasWidthR = 0;

              for (j = i; j >= 0; j--) {
                c = this.columns[j];
                if (!c || c.hidden) { continue; }
                if (c.resizable) {
                  if (x && c.maxWidth && (c.maxWidth - (c.previousWidth || 0) < x)) {
                    x -= c.maxWidth - (c.previousWidth || 0);
                    c.width = c.maxWidth;
                  } else {
                    const newWidth = (c.previousWidth || 0) + x;
                    const resizedCanvasWidthL = this.canvasWidthL + x;

                    if (this.hasFrozenColumns() && (j <= this._options.frozenColumn!)) {
                      // if we're on the left frozen side, we need to make sure that our left section width never goes over the total viewport width
                      if (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < (viewportWidth - this._options.frozenRightViewportMinWidth!)) {
                        frozenLeftColMaxWidth = newWidth; // keep max column width ref, if we go over the limit this number will stop increasing
                      }
                      c.width = ((resizedCanvasWidthL + this._options.frozenRightViewportMinWidth!) > viewportWidth) ? frozenLeftColMaxWidth : newWidth;
                    } else {
                      c.width = newWidth;
                    }
                    x = 0;
                  }
                }
              }

              for (k = 0; k <= i; k++) {
                c = this.columns[k];
                if (!c || c.hidden) { continue; }

                if (this.hasFrozenColumns() && (k > this._options.frozenColumn!)) {
                  newCanvasWidthR += c.width || 0;
                } else {
                  newCanvasWidthL += c.width || 0;
                }
              }

              if (this._options.forceFitColumns) {
                x = -d;
                for (j = i + 1; j < this.columns.length; j++) {
                  c = this.columns[j];
                  if (!c || c.hidden) { continue; }
                  if (c.resizable) {
                    actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth);
                    if (x && (c.previousWidth || 0) + x < actualMinWidth) {
                      x += (c.previousWidth || 0) - actualMinWidth;
                      c.width = actualMinWidth;
                    } else {
                      c.width = (c.previousWidth || 0) + x;
                      x = 0;
                    }

                    if (this.hasFrozenColumns() && (j > this._options.frozenColumn!)) {
                      newCanvasWidthR += c.width || 0;
                    } else {
                      newCanvasWidthL += c.width || 0;
                    }
                  }
                }
              } else {
                for (j = i + 1; j < this.columns.length; j++) {
                  c = this.columns[j];
                  if (!c || c.hidden) { continue; }

                  if (this.hasFrozenColumns() && (j > this._options.frozenColumn!)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    newCanvasWidthR += c.width || 0;
                  } else {
                    newCanvasWidthL += c.width || 0;
                  }
                }
              }
            }

            if (this.hasFrozenColumns() && newCanvasWidthL !== this.canvasWidthL) {
              Utils.width(this._headerL, newCanvasWidthL + 1000);
              Utils.setStyleSize(this._paneHeaderR, 'left', newCanvasWidthL);
            }

            this.applyColumnHeaderWidths();
            if (this._options.syncColumnCellResize) {
              this.applyColumnWidths();
            }
            this.trigger(this.onColumnsDrag, {
              triggeredByColumn: resizeElms.resizeableElement,
              resizeHandle: resizeElms.resizeableHandleElement
            });
          },
          onResizeEnd: (_e: Event, resizeElms: { resizeableElement: HTMLElement; }) => {
            resizeElms.resizeableElement.classList.remove('slick-header-column-active');

            const triggeredByColumn = resizeElms.resizeableElement.id.replace(this.uid, '');
            if (this.trigger(this.onBeforeColumnsResize, { triggeredByColumn: triggeredByColumn }).getReturnValue() === true) {
              this.applyColumnHeaderWidths();
            }
            let newWidth;
            for (j = 0; j < this.columns.length; j++) {
              c = this.columns[j];
              if (!c || c.hidden) { continue; }
              newWidth = children[j].offsetWidth;

              if (c.previousWidth !== newWidth && c.rerenderOnResize) {
                this.invalidateAllRows();
              }
            }
            this.updateCanvasWidth(true);
            this.render();
            this.trigger(this.onColumnsResized, { triggeredByColumn: triggeredByColumn });
            setTimeout(() => { this.columnResizeDragging = false; }, 300);
          }
        })
      );
    }
  }

  protected getVBoxDelta(el: HTMLElement) {
    const p = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
    const styles = getComputedStyle(el);
    let delta = 0;
    p.forEach((val) => delta += Utils.toFloat(styles[val as any]));
    return delta;
  }

  protected setFrozenOptions() {
    this._options.frozenColumn = (this._options.frozenColumn! >= 0 && this._options.frozenColumn! < this.columns.length)
      ? parseInt(this._options.frozenColumn as unknown as string)
      : -1;

    if (this._options.frozenRow! > -1) {
      this.hasFrozenRows = true;
      this.frozenRowsHeight = (this._options.frozenRow!) * this._options.rowHeight!;
      const dataLength = this.getDataLength();

      this.actualFrozenRow = (this._options.frozenBottom)
        ? (dataLength - this._options.frozenRow!)
        : this._options.frozenRow!;
    } else {
      this.hasFrozenRows = false;
    }
  }

  protected setPaneVisibility() {
    if (this.hasFrozenColumns()) {
      Utils.show(this._paneHeaderR);
      Utils.show(this._paneTopR);

      if (this.hasFrozenRows) {
        Utils.show(this._paneBottomL);
        Utils.show(this._paneBottomR);
      } else {
        Utils.hide(this._paneBottomR);
        Utils.hide(this._paneBottomL);
      }
    } else {
      Utils.hide(this._paneHeaderR);
      Utils.hide(this._paneTopR);
      Utils.hide(this._paneBottomR);

      if (this.hasFrozenRows) {
        Utils.show(this._paneBottomL);
      } else {
        Utils.hide(this._paneBottomR);
        Utils.hide(this._paneBottomL);
      }
    }
  }

  protected setOverflow() {
    this._viewportTopL.style.overflowX = (this.hasFrozenColumns()) ? (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll') : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'hidden' : 'auto');
    this._viewportTopL.style.overflowY = (!this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll) ? 'scroll' : ((this.hasFrozenColumns()) ? (this.hasFrozenRows ? 'hidden' : 'hidden') : (this.hasFrozenRows ? 'scroll' : 'auto'));

    this._viewportTopR.style.overflowX = (this.hasFrozenColumns()) ? (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll') : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'hidden' : 'auto');
    this._viewportTopR.style.overflowY = this._options.alwaysShowVerticalScroll ? 'scroll' : ((this.hasFrozenColumns()) ? (this.hasFrozenRows ? 'scroll' : 'auto') : (this.hasFrozenRows ? 'scroll' : 'auto'));

    this._viewportBottomL.style.overflowX = (this.hasFrozenColumns()) ? (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'scroll' : 'auto') : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'auto' : 'auto');
    this._viewportBottomL.style.overflowY = (!this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll) ? 'scroll' : ((this.hasFrozenColumns()) ? (this.hasFrozenRows ? 'hidden' : 'hidden') : (this.hasFrozenRows ? 'scroll' : 'auto'));

    this._viewportBottomR.style.overflowX = (this.hasFrozenColumns()) ? (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'scroll' : 'auto') : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? 'auto' : 'auto');
    this._viewportBottomR.style.overflowY = this._options.alwaysShowVerticalScroll ? 'scroll' : ((this.hasFrozenColumns()) ? (this.hasFrozenRows ? 'auto' : 'auto') : (this.hasFrozenRows ? 'auto' : 'auto'));

    if (this._options.viewportClass) {
      this._viewportTopL.classList.add(...this._options.viewportClass.split(' '));
      this._viewportTopR.classList.add(...this._options.viewportClass.split(' '));
      this._viewportBottomL.classList.add(...this._options.viewportClass.split(' '));
      this._viewportBottomR.classList.add(...this._options.viewportClass.split(' '));
    }
  }

  protected setScroller() {
    if (this.hasFrozenColumns()) {
      this._headerScrollContainer = this._headerScrollerR;
      this._headerRowScrollContainer = this._headerRowScrollerR;
      this._footerRowScrollContainer = this._footerRowScrollerR;

      if (this.hasFrozenRows) {
        if (this._options.frozenBottom) {
          this._viewportScrollContainerX = this._viewportBottomR;
          this._viewportScrollContainerY = this._viewportTopR;
        } else {
          this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomR;
        }
      } else {
        this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopR;
      }
    } else {
      this._headerScrollContainer = this._headerScrollerL;
      this._headerRowScrollContainer = this._headerRowScrollerL;
      this._footerRowScrollContainer = this._footerRowScrollerL;

      if (this.hasFrozenRows) {
        if (this._options.frozenBottom) {
          this._viewportScrollContainerX = this._viewportBottomL;
          this._viewportScrollContainerY = this._viewportTopL;
        } else {
          this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomL;
        }
      } else {
        this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopL;
      }
    }
  }

  protected measureCellPaddingAndBorder() {
    const h = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
    const v = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
    const header = this._headers[0];

    this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0;
    this.cellWidthDiff = this.cellHeightDiff = 0;

    let el = Utils.createDomElement('div', { className: 'ui-state-default slick-state-default slick-header-column', style: { visibility: 'hidden' }, textContent: '-' }, header);
    let style = getComputedStyle(el);
    if (style.boxSizing !== 'border-box') {
      h.forEach((val) => this.headerColumnWidthDiff += Utils.toFloat(style[val as any]));
      v.forEach((val) => this.headerColumnHeightDiff += Utils.toFloat(style[val as any]));
    }
    el.remove();

    const r = Utils.createDomElement('div', { className: 'slick-row' }, this._canvas[0]);
    el = Utils.createDomElement('div', { className: 'slick-cell', id: '', style: { visibility: 'hidden' }, textContent: '-' }, r);
    style = getComputedStyle(el);
    if (style.boxSizing !== 'border-box') {
      h.forEach((val) => this.cellWidthDiff += Utils.toFloat(style[val as any]));
      v.forEach((val) => this.cellHeightDiff += Utils.toFloat(style[val as any]));
    }
    r.remove();

    this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
  }

  protected createCssRules() {
    const template = Utils.createDomElement('template', { innerHTML: '<style type="text/css" rel="stylesheet" />' });
    this._style = template.content.firstChild;
    document.head.appendChild(this._style);

    const rowHeight = (this._options.rowHeight! - this.cellHeightDiff);
    const rules = [
      `.${this.uid} .slick-group-header-column { left: 1000px; }`,
      `.${this.uid} .slick-header-column { left: 1000px; }`,
      `.${this.uid} .slick-top-panel { height: ${this._options.topPanelHeight}px; }`,
      `.${this.uid} .slick-preheader-panel { height: ${this._options.preHeaderPanelHeight}px; }`,
      `.${this.uid} .slick-headerrow-columns { height: ${this._options.headerRowHeight}px; }`,
      `.${this.uid} .slick-footerrow-columns { height: ${this._options.footerRowHeight}px; }`,
      `.${this.uid} .slick-cell { height: ${rowHeight}px; }`,
      `.${this.uid} .slick-row { height: ${this._options.rowHeight}px; }`
    ];

    for (let i = 0; i < this.columns.length; i++) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      rules.push(`.${this.uid} .l${i} { }`);
      rules.push(`.${this.uid} .r${i} { }`);
    }

    if (this._style.styleSheet) { // IE
      this._style.styleSheet.cssText = rules.join(' ');
    } else {
      this._style.appendChild(document.createTextNode(rules.join(' ')));
    }
  }

  protected getColumnCssRules(idx: number) {
    let i: number;
    if (!this.stylesheet) {
      const sheets: any = document.styleSheets;
      for (i = 0; i < sheets.length; i++) {
        if ((sheets[i].ownerNode || sheets[i].owningElement) == this._style) {
          this.stylesheet = sheets[i];
          break;
        }
      }

      if (!this.stylesheet) {
        throw new Error('SlickGrid Cannot find stylesheet.');
      }

      // find and cache column CSS rules
      this.columnCssRulesL = [];
      this.columnCssRulesR = [];
      const cssRules = (this.stylesheet.cssRules || this.stylesheet.rules);
      let matches, columnIdx;
      for (i = 0; i < cssRules.length; i++) {
        const selector = cssRules[i].selectorText;
        if (matches = /\.l\d+/.exec(selector)) {
          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
          this.columnCssRulesL[columnIdx] = cssRules[i];
        } else if (matches = /\.r\d+/.exec(selector)) {
          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
          this.columnCssRulesR[columnIdx] = cssRules[i];
        }
      }
    }

    return {
      left: this.columnCssRulesL![idx],
      right: this.columnCssRulesR![idx]
    };
  }

  protected removeCssRules() {
    this._style.remove();
    this.stylesheet = null;
  }

  /**
   * Destroy (dispose) of SlickGrid
   * @param {boolean} shouldDestroyAllElements - do we want to destroy (nullify) all DOM elements as well? This help in avoiding mem leaks
   */
  destroy(shouldDestroyAllElements?: boolean) {
    this._bindingEventService.unbindAll();
    this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance) as null;
    this.slickMouseWheelInstances = this.destroyAllInstances(this.slickMouseWheelInstances) as InteractionBase[];
    this.slickResizableInstances = this.destroyAllInstances(this.slickResizableInstances) as InteractionBase[];
    this.getEditorLock()?.cancelCurrentEdit();

    this.trigger(this.onBeforeDestroy, {});

    let i = this.plugins.length;
    while (i--) {
      this.unregisterPlugin(this.plugins[i]);
    }

    if (this._options.enableColumnReorder && typeof this.sortableSideLeftInstance?.destroy === 'function') {
      this.sortableSideLeftInstance.destroy();
      this.sortableSideRightInstance.destroy();
    }

    this.unbindAncestorScrollEvents();
    this._bindingEventService.unbindByEventName(this._container, 'resize');
    this.removeCssRules();

    this._canvas.forEach((element) => {
      this._bindingEventService.unbindByEventName(element, 'keydown');
      this._bindingEventService.unbindByEventName(element, 'click');
      this._bindingEventService.unbindByEventName(element, 'dblclick');
      this._bindingEventService.unbindByEventName(element, 'contextmenu');
      this._bindingEventService.unbindByEventName(element, 'mouseover');
      this._bindingEventService.unbindByEventName(element, 'mouseout');
    });
    this._viewport.forEach((view) => {
      this._bindingEventService.unbindByEventName(view, 'scroll');
    });

    this._headerScroller.forEach((el) => {
      this._bindingEventService.unbindByEventName(el, 'contextmenu');
      this._bindingEventService.unbindByEventName(el, 'click');
    });

    this._headerRowScroller.forEach((scroller) => {
      this._bindingEventService.unbindByEventName(scroller, 'scroll');
    });

    if (this._footerRow) {
      this._footerRow.forEach((footer) => {
        this._bindingEventService.unbindByEventName(footer, 'contextmenu')
        this._bindingEventService.unbindByEventName(footer, 'click');
      });
    }

    if (this._footerRowScroller) {
      this._footerRowScroller.forEach((scroller) => {
        this._bindingEventService.unbindByEventName(scroller, 'scroll');
      });
    }

    if (this._preHeaderPanelScroller) {
      this._bindingEventService.unbindByEventName(this._preHeaderPanelScroller, 'scroll');
    }

    this._bindingEventService.unbindByEventName(this._focusSink, 'keydown');
    this._bindingEventService.unbindByEventName(this._focusSink2, 'keydown');

    const resizeHandles = this._container.querySelectorAll('.slick-resizable-handle');
    [].forEach.call(resizeHandles, (handle) => {
      this._bindingEventService.unbindByEventName(handle, 'dblclick');
    });

    const headerColumns = this._container.querySelectorAll('.slick-header-column');
    [].forEach.call(headerColumns, (column) => {
      this._bindingEventService.unbindByEventName(column, 'mouseenter');
      this._bindingEventService.unbindByEventName(column, 'mouseleave');

      this._bindingEventService.unbindByEventName(column, 'mouseenter');
      this._bindingEventService.unbindByEventName(column, 'mouseleave');
    });

    Utils.emptyElement(this._container);
    this._container.classList.remove(this.uid);

    if (shouldDestroyAllElements) {
      this.destroyAllElements();
    }
  }

  /**
   * call destroy method, when exists, on all the instance(s) it found
   * @params instances - can be a single instance or a an array of instances
   */
  protected destroyAllInstances(inputInstances: null | InteractionBase | Array<InteractionBase>) {
    if (inputInstances) {
      const instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances];
      let instance: InteractionBase | undefined;
      while ((instance = instances.pop()) != null) {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      }
    }
    // reset instance(s)
    inputInstances = (Array.isArray(inputInstances) ? [] : null);
    return inputInstances;
  }

  protected destroyAllElements() {
    this._activeCanvasNode = null as any;
    this._activeViewportNode = null as any;
    this._boundAncestors = null as any;
    this._canvas = null as any;
    this._canvasTopL = null as any;
    this._canvasTopR = null as any;
    this._canvasBottomL = null as any;
    this._canvasBottomR = null as any;
    this._container = null as any;
    this._focusSink = null as any;
    this._focusSink2 = null as any;
    this._groupHeaders = null as any;
    this._groupHeadersL = null as any;
    this._groupHeadersR = null as any;
    this._headerL = null as any;
    this._headerR = null as any;
    this._headers = null as any;
    this._headerRows = null as any;
    this._headerRowL = null as any;
    this._headerRowR = null as any;
    this._headerRowSpacerL = null as any;
    this._headerRowSpacerR = null as any;
    this._headerRowScrollContainer = null as any;
    this._headerRowScroller = null as any;
    this._headerRowScrollerL = null as any;
    this._headerRowScrollerR = null as any;
    this._headerScrollContainer = null as any;
    this._headerScroller = null as any;
    this._headerScrollerL = null as any;
    this._headerScrollerR = null as any;
    this._hiddenParents = null as any;
    this._footerRow = null as any;
    this._footerRowL = null as any;
    this._footerRowR = null as any;
    this._footerRowSpacerL = null as any;
    this._footerRowSpacerR = null as any;
    this._footerRowScroller = null as any;
    this._footerRowScrollerL = null as any;
    this._footerRowScrollerR = null as any;
    this._footerRowScrollContainer = null as any;
    this._preHeaderPanel = null as any;
    this._preHeaderPanelR = null as any;
    this._preHeaderPanelScroller = null as any;
    this._preHeaderPanelScrollerR = null as any;
    this._preHeaderPanelSpacer = null as any;
    this._preHeaderPanelSpacerR = null as any;
    this._topPanels = null as any;
    this._topPanelScrollers = null as any;
    this._style = null as any;
    this._topPanelScrollerL = null as any;
    this._topPanelScrollerR = null as any;
    this._topPanelL = null as any;
    this._topPanelR = null as any;
    this._paneHeaderL = null as any;
    this._paneHeaderR = null as any;
    this._paneTopL = null as any;
    this._paneTopR = null as any;
    this._paneBottomL = null as any;
    this._paneBottomR = null as any;
    this._viewport = null as any;
    this._viewportTopL = null as any;
    this._viewportTopR = null as any;
    this._viewportBottomL = null as any;
    this._viewportBottomR = null as any;
    this._viewportScrollContainerX = null as any;
    this._viewportScrollContainerY = null as any;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Column Autosizing
  //////////////////////////////////////////////////////////////////////////////////////////////

  /** Proportionally resize a specific column by its name, index or Id */
  autosizeColumn(columnOrIndexOrId: number | string, isInit?: boolean) {
    let colDef: C | null = null;
    let colIndex = -1;
    if (typeof columnOrIndexOrId === 'number') {
      colDef = this.columns[columnOrIndexOrId];
      colIndex = columnOrIndexOrId;
    }
    else if (typeof columnOrIndexOrId === 'string') {
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

  protected treatAsLocked(autoSize: AutoSize = {}) {
    // treat as locked (don't resize) if small and header is the widest part
    return !autoSize.ignoreHeaderText
      && !autoSize.sizeToRemaining
      && (autoSize.contentSizePx === autoSize.headerWidthPx)
      && ((autoSize.widthPx ?? 0) < 100)
      ;
  }

  /** Proportionately resizes all columns to fill available horizontal space. This does not take the cell contents into consideration. */
  autosizeColumns(autosizeMode?: string, isInit?: boolean) {
    this.cacheCssForHiddenInit();
    this.internalAutosizeColumns(autosizeMode, isInit);
    this.restoreCssFromHiddenInit();
  }

  protected internalAutosizeColumns(autosizeMode?: string, isInit?: boolean) {
    //LogColWidths();
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
    const viewportWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;

    // iterate columns to get autosizes
    let i: number, c: C, colWidth: number, reRender = false, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
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
        //for (i = 0; i < columns.length; i++) { columns[i].width = columns[i].autoSize.widthPx; }
      }
      Utils.width(this._container, setWidth);
    }

    if (autosizeMode === GridAutosizeColsMode.FitColsToViewport) {
      if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
        // if addl space remains in the viewport and there are SizeToRemaining cols, just the SizeToRemaining cols expand proportionally to fill viewport
        for (i = 0; i < this.columns.length; i++) {
          c = this.columns[i];
          if (!c || c.hidden) continue;

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
          if (!c || c.hidden) continue;

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
        if (!this.columns[i] || this.columns[i].hidden) continue;

        colWidth = this.columns[i].autoSize?.widthPx || 0;
        if (this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth) {
          reRender = true;
        }
        this.columns[i].width = colWidth;
      }
    }

    this.reRenderColumns(reRender);
  }

  protected LogColWidths() {
    let s = 'Col Widths:';
    for (let i = 0; i < this.columns.length; i++) { s += ' ' + (this.columns[i].hidden ? 'H' : this.columns[i].width); }
    console.log(s);
  }

  protected getColAutosizeWidth(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number) {
    const autoSize = columnDef.autoSize as AutoSize;

    // set to width as default
    autoSize.widthPx = columnDef.width;
    if (autoSize.autosizeMode === ColAutosizeMode.Locked
      || autoSize.autosizeMode === ColAutosizeMode.Guide) {
      return;
    }

    const dl = this.getDataLength(); //getDataItem();
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

  protected getColContentSize(columnDef: C, colIndex: number, gridCanvas: HTMLElement, isInit: boolean, colArrayIndex: number) {
    const autoSize = columnDef.autoSize as AutoSize;
    let widthAdjustRatio = 1;

    // at this point, the autosizeMode is effectively 'Content', so proceed to get size

    // get header width, if we are taking notice of it
    let i: number;
    let tempVal: any, maxLen = 0;
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
      // if an array of values are specified, just pass them in instead of data
      maxColWidth = this.getColWidth(columnDef, gridCanvas, autoSize.colValueArray as any);
      return Math.max(autoSize.headerWidthPx, maxColWidth);
    }

    // select rows to evaluate using rowSelectionMode and rowSelectionCount
    const rowInfo = {} as RowInfo;
    rowInfo.colIndex = colIndex;
    rowInfo.rowCount = this.getDataLength();
    rowInfo.startIndex = 0;
    rowInfo.endIndex = rowInfo.rowCount - 1;
    rowInfo.valueArr = null;
    rowInfo.getRowVal = (i) => this.getDataItem(i)[columnDef.field as keyof TData];

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
          rowInfo.valueArr.push(v);
        }
      }
      rowInfo.startIndex = 0;
      rowInfo.endIndex = rowInfo.length - 1;
    }

    if (autoSize.valueFilterMode === ValueFilterMode.GetGreatestAndSub) {
      // get greatest abs value in data
      let maxVal, maxAbsVal = 0;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
        tempVal = rowInfo.getRowVal(i);
        if (Math.abs(tempVal) > maxAbsVal) { maxVal = tempVal; maxAbsVal = Math.abs(tempVal); }
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

  protected getColWidth(columnDef: C, gridCanvas: HTMLElement, rowInfo: RowInfo) {
    const rowEl = Utils.createDomElement('div', { className: 'slick-row ui-widget-content' }, gridCanvas);
    const cellEl = Utils.createDomElement('div', { className: 'slick-cell' }, rowEl);

    cellEl.style.position = 'absolute';
    cellEl.style.visibility = 'hidden';
    cellEl.style.textOverflow = 'initial';
    cellEl.style.whiteSpace = 'nowrap';

    let i: number, len: number, max = 0, maxText = '', formatterResult: string | FormatterResultObject, val: any;

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

      cellEl.innerHTML = maxText;
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

  protected getColHeaderWidth(columnDef: C) {
    let width = 0;
    //if (columnDef && (!columnDef.resizable || columnDef._autoCalcWidth === true)) return;
    const headerColElId = this.getUID() + columnDef.id;
    let headerColEl = document.getElementById(headerColElId) as HTMLElement;
    const dummyHeaderColElId = `${headerColElId}_`;
    const clone = headerColEl.cloneNode(true) as HTMLElement;
    if (headerColEl) {
      // headers have been created, use clone technique
      clone.id = dummyHeaderColElId;
      clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
      headerColEl.parentNode!.insertBefore(clone, headerColEl);
      width = clone.offsetWidth;
      clone.parentNode!.removeChild(clone);
    } else {
      // headers have not yet been created, create a new node
      const header = this.getHeader(columnDef) as HTMLElement;
      headerColEl = Utils.createDomElement('div', { id: dummyHeaderColElId, className: 'ui-state-default slick-state-default slick-header-column' }, header);
      Utils.createDomElement('span', { className: 'slick-column-name', innerHTML: this.sanitizeHtmlString(String(columnDef.name)) }, headerColEl);
      clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
      if (columnDef.headerCssClass) {
        headerColEl.classList.add(...(columnDef.headerCssClass || '').split(' '));
      }
      width = headerColEl.offsetWidth;
      header.removeChild(headerColEl);
    }
    return width;
  }

  protected legacyAutosizeColumns() {
    let i, c: C | undefined,
      shrinkLeeway = 0,
      total = 0,
      prevTotal = 0;
    const widths: number[] = [];
    const availWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;

    for (i = 0; i < this.columns.length; i++) {
      c = this.columns[i];
      if (!c || c.hidden) continue;
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
        if (!c || c.hidden) continue;
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
        if (!c || c.hidden) continue;
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
      if (!c || c.hidden) continue;

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

    this.trigger(this.onAutosizeColumns, { columns: this.columns });

    if (reRender) {
      this.invalidateAllRows();
      this.render();
    }
  }

  getVisibleColumns() {
    return this.columns.filter(c => !c.hidden);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // General
  //////////////////////////////////////////////////////////////////////////////////////////////

  protected trigger<ArgType = any>(evt: SlickEvent_, args?: ArgType, e?: Event | SlickEventData_) {
    const event: SlickEventData_ = (e || new SlickEventData(e, args)) as SlickEventData_;
    const eventArgs = (args || {}) as ArgType & { grid: SlickGrid<TData, C, O>; };
    eventArgs.grid = this;
    return evt.notify(eventArgs, event, this);
  }

  /** Get Editor lock */
  getEditorLock() {
    return this._options.editorLock as SlickEditorLock;
  }

  /** Get Editor Controller */
  getEditController() {
    return this.editController;
  }

  /**
   * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
   * @param {String | Number} id A column id.
   */
  getColumnIndex(id: number | string): number {
    return this.columnsById[id];
  }

  protected applyColumnHeaderWidths() {
    if (!this.initialized) {
      return;
    }

    let columnIndex = 0;
    const vc = this.getVisibleColumns();
    this._headers.forEach((header) => {
      for (let i = 0; i < header.children.length; i++, columnIndex++) {
        const h = header.children[i] as HTMLElement;
        const col = vc[columnIndex] || {};
        const width = (col.width || 0) - this.headerColumnWidthDiff;
        if (Utils.width(h) !== width) {
          Utils.width(h, width);
        }
      }
    });

    this.updateColumnCaches();
  }

  protected applyColumnWidths() {
    let x = 0, w = 0, rule: any;
    for (let i = 0; i < this.columns.length; i++) {
      if (!this.columns[i]?.hidden) {
        w = this.columns[i].width || 0;

        rule = this.getColumnCssRules(i);
        rule.left.style.left = `${x}px`;
        rule.right.style.right = (((this._options.frozenColumn !== -1 && i > this._options.frozenColumn!) ? this.canvasWidthR : this.canvasWidthL) - x - w) + 'px';

        // If this column is frozen, reset the css left value since the
        // column starts in a new viewport.
        if (this._options.frozenColumn !== i) {
          x += this.columns[i].width!;
        }
      }
      if (this._options.frozenColumn == i) {
        x = 0;
      }
    }
  }

  /**
   * Accepts a columnId string and an ascending boolean. Applies a sort glyph in either ascending or descending form to the header of the column. Note that this does not actually sort the column. It only adds the sort glyph to the header.
   * @param {String | Number} columnId
   * @param {Boolean} ascending
   */
  setSortColumn(columnId: number | string, ascending: boolean) {
    this.setSortColumns([{ columnId, sortAsc: ascending }]);
  }

  /**
   * Get column by index
   * @param {Number} id - column index
   * @returns
   */
  getColumnByIndex(id: number) {
    let result: HTMLElement | undefined;
    this._headers.every((header) => {
      const length = header.children.length;
      if (id < length) {
        result = header.children[id] as HTMLElement;
        return false;
      }
      id -= length;
      return true;
    });

    return result;
  }

  /**
   * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ]. When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array. Note that this does not actually sort the column. It only adds the sort glyph to the header
   * @param {ColumnSort[]} cols - column sort
   */
  setSortColumns(cols: ColumnSort[]) {
    this.sortColumns = cols;

    const numberCols = this._options.numberedMultiColumnSort && this.sortColumns.length > 1;
    this._headers.forEach((header) => {
      let indicators = header.querySelectorAll('.slick-header-column-sorted');
      indicators.forEach((indicator) => {
        indicator.classList.remove('slick-header-column-sorted');
      });

      indicators = header.querySelectorAll('.slick-sort-indicator');
      indicators.forEach((indicator) => {
        indicator.classList.remove('slick-sort-indicator-asc');
        indicator.classList.remove('slick-sort-indicator-desc');
      });
      indicators = header.querySelectorAll('.slick-sort-indicator-numbered');
      indicators.forEach((el) => {
        el.textContent = '';
      });
    });

    let i = 1;
    this.sortColumns.forEach((col) => {
      if (col.sortAsc == null) {
        col.sortAsc = true;
      }

      const columnIndex = this.getColumnIndex(col.columnId);
      if (columnIndex != null) {
        const column = this.getColumnByIndex(columnIndex);
        if (column) {
          column.classList.add('slick-header-column-sorted');
          let indicator = column.querySelector('.slick-sort-indicator') as HTMLElement;
          indicator.classList.add(col.sortAsc ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');

          if (numberCols) {
            indicator = column.querySelector('.slick-sort-indicator-numbered') as HTMLElement;
            indicator.textContent = String(i);
          }
        }
      }
      i++;
    });
  }

  /** Get sorted columns **/
  getSortColumns(): ColumnSort[] {
    return this.sortColumns;
  }

  protected handleSelectedRangesChanged(e: SlickEventData_, ranges: SlickRange_[]) {
    const ne = e.getNativeEvent<CustomEvent>();
    const previousSelectedRows = this.selectedRows.slice(0); // shallow copy previously selected rows for later comparison
    this.selectedRows = [];
    const hash: CssStyleHash = {};
    for (let i = 0; i < ranges.length; i++) {
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        if (!hash[j]) {  // prevent duplicates
          this.selectedRows.push(j);
          hash[j] = {};
        }
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
          if (this.canCellBeSelected(j, k)) {
            hash[j][this.columns[k].id] = this._options.selectedCellCssClass;
          }
        }
      }
    }

    this.setCellCssStyles(this._options.selectedCellCssClass || '', hash);

    if (this.simpleArrayEquals(previousSelectedRows, this.selectedRows)) {
      const caller = ne?.detail?.caller ?? 'click';
      const newSelectedAdditions = this.getSelectedRows().filter((i) => previousSelectedRows.indexOf(i) < 0);
      const newSelectedDeletions = previousSelectedRows.filter((i) => this.getSelectedRows().indexOf(i) < 0);

      this.trigger(this.onSelectedRowsChanged, {
        rows: this.getSelectedRows(),
        previousSelectedRows,
        caller,
        changedSelectedRows: newSelectedAdditions,
        changedUnselectedRows: newSelectedDeletions
      }, e);
    }
  }

  // compare 2 simple arrays (integers or strings only, do not use to compare object arrays)
  simpleArrayEquals(arr1: any[], arr2: any[]) {
    return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
  }

  /** Returns an array of column definitions. */
  getColumns() {
    return this.columns;
  }

  protected updateColumnCaches() {
    // Pre-calculate cell boundaries.
    this.columnPosLeft = [];
    this.columnPosRight = [];
    let x = 0;
    for (let i = 0, ii = this.columns.length; i < ii; i++) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      this.columnPosLeft[i] = x;
      this.columnPosRight[i] = x + (this.columns[i].width || 0);

      if (this._options.frozenColumn === i) {
        x = 0;
      } else {
        x += this.columns[i].width || 0;
      }
    }
  }

  protected updateColumnProps() {
    this.columnsById = {};
    for (let i = 0; i < this.columns.length; i++) {
      let m: C = this.columns[i];
      if (m.width) {
        m.widthRequest = m.width;
      }

      if (this.options.mixinDefaults) {
          Utils.applyDefaults(m, this._columnDefaults);
          if (!m.autoSize) { m.autoSize = {}; }
          Utils.applyDefaults(m.autoSize, this._columnAutosizeDefaults);
      } else {
        m = this.columns[i] = Utils.extend({}, this._columnDefaults, m);
        m.autoSize = Utils.extend({}, this._columnAutosizeDefaults, m.autoSize);
      }

      this.columnsById[m.id] = i;
      if (m.minWidth && ((m.width || 0) < m.minWidth)) {
        m.width = m.minWidth;
      }
      if (m.maxWidth && ((m.width || 0) > m.maxWidth)) {
        m.width = m.maxWidth;
      }
    }
  }

  /**
   * Sets grid columns. Column headers will be recreated and all rendered rows will be removed. To rerender the grid (if necessary), call render().
   * @param {Column[]} columnDefinitions An array of column definitions.
   */
  setColumns(columnDefinitions: C[]) {
    this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns: columnDefinitions, grid: this });
    this.columns = columnDefinitions;
    this.updateColumnsInternal();
  }

  protected updateColumns() {
    this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this });
    this.updateColumnsInternal();
  }

  protected updateColumnsInternal() {
    this.updateColumnProps();
    this.updateColumnCaches();

    if (this.initialized) {
      this.setPaneVisibility();
      this.setOverflow();

      this.invalidateAllRows();
      this.createColumnHeaders();
      this.createColumnFooter();
      this.removeCssRules();
      this.createCssRules();
      this.resizeCanvas();
      this.updateCanvasWidth();
      this.applyColumnHeaderWidths();
      this.applyColumnWidths();
      this.handleScroll();
      this.getSelectionModel()?.refreshSelections();
    }
  }

  /** Returns an object containing all of the Grid options set on the grid. See a list of Grid Options here.  */
  getOptions() {
    return this._options;
  }

  /**
   * Extends grid options with a given hash. If an there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.
   * @param {Object} options - an object with configuration options.
   * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
   * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
   * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
   */
  setOptions(args: Partial<O>, suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void {
    this.prepareForOptionsChange();

    if (this._options.enableAddRow !== args.enableAddRow) {
      this.invalidateRow(this.getDataLength());
    }

    const originalOptions = Utils.extend(true, {}, this._options);
    this._options = Utils.extend(this._options, args);
    this.trigger(this.onSetOptions, { optionsBefore: originalOptions, optionsAfter: this._options });

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

  protected prepareForOptionsChange() {
    if (!this.getEditorLock().commitCurrentEdit()) {
      return;
    }

    this.makeActiveCellNormal();
  }

  protected internal_setOptions(suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean) : void {
    if (this._options.showColumnHeader !== undefined) {
      this.setColumnHeaderVisibility(this._options.showColumnHeader);
    }
    this.validateAndEnforceOptions();
    this.setFrozenOptions();

    // when user changed frozen row option, we need to force a recalculation of each viewport heights
    if (this._options.frozenBottom !== undefined) {
      this.enforceFrozenRowHeightRecalc = true;
    }

    this._viewport.forEach((view) => {
      view.style.overflowY = this._options.autoHeight ? 'hidden' : 'auto';
    });
    if (!suppressRender) {
      this.render();
    }

    this.setScroller();
    if (!suppressSetOverflow) {
      this.setOverflow();
    }

    if (!suppressColumnSet) {
      this.setColumns(this.columns);
    }

    if (this._options.enableMouseWheelScrollHandler && this._viewport && (!this.slickMouseWheelInstances || this.slickMouseWheelInstances.length === 0)) {
      this._viewport.forEach((view) => {
        this.slickMouseWheelInstances.push(MouseWheel({
          element: view,
          onMouseWheel: this.handleMouseWheel.bind(this)
        }));
      });
    } else if (this._options.enableMouseWheelScrollHandler === false) {
      this.destroyAllInstances(this.slickMouseWheelInstances); // remove scroll handler when option is disable
    }
  }

  validateAndEnforceOptions(): void {
    if (this._options.autoHeight) {
      this._options.leaveSpaceForNewRows = false;
    }
    if (this._options.forceFitColumns) {
      this._options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit;
      console.log('forceFitColumns option is deprecated - use autosizeColsMode');
    }
  }

  /**
   * Sets a new source for databinding and removes all rendered rows. Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
   * @param {CustomDataView|Array<*>} newData New databinding source using a regular JavaScript array.. or a custom object exposing getItem(index) and getLength() functions.
   * @param {Number} [scrollToTop] If true, the grid will reset the vertical scroll position to the top of the grid.
   */
  setData(newData: CustomDataView<TData> | TData[], scrollToTop?: number) {
    this.data = newData;
    this.invalidateAllRows();
    this.updateRowCount();
    if (scrollToTop) {
      this.scrollTo(0);
    }
  }

  /** Returns an array of every data object, unless you're using DataView in which case it returns a DataView object. */
  getData<U extends CustomDataView<TData> | U[]>(): U {
    return this.data as U;
  }

  /** Returns the size of the databinding source. */
  getDataLength() {
    if ((this.data as CustomDataView<TData>).getLength) {
      return (this.data as CustomDataView<TData>).getLength();
    } else {
      return (this.data as TData[])?.length ?? 0;
    }
  }

  protected getDataLengthIncludingAddNew() {
    return this.getDataLength() + (!this._options.enableAddRow ? 0
      : (!this.pagingActive || this.pagingIsLastPage ? 1 : 0)
    );
  }

  /**
   * Returns the databinding item at a given position.
   * @param {Number} index Item row index.
   */
  getDataItem(i: number): TData {
    if ((this.data as CustomDataView).getItem) {
      return (this.data as CustomDataView<TData>).getItem(i) as TData;
    } else {
      return (this.data as TData[])[i] as TData;
    }
  }

  /** Get Top Panel DOM element */
  getTopPanel() {
    return this._topPanels[0];
  }

  /** Get Top Panels (left/right) DOM element */
  getTopPanels() {
    return this._topPanels;
  }

  /** Are we using a DataView? */
  hasDataView() {
    return !Array.isArray(this.data);
  }

  protected togglePanelVisibility(option: 'showTopPanel' | 'showHeaderRow' | 'showColumnHeader' | 'showFooterRow' | 'showPreHeaderPanel', container: HTMLElement | HTMLElement[], visible?: boolean, animate?: boolean) {
    const animated = (animate === false) ? false : true;

    if (this._options[option] !== visible) {
      this._options[option] = visible as boolean;
      if (visible) {
        if (animated) {
          Utils.slideDown(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils.show(container);
        this.resizeCanvas();
      } else {
        if (animated) {
          Utils.slideUp(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils.hide(container);
        this.resizeCanvas();
      }
    }
  }

  /**
   * Set the Top Panel Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if top panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setTopPanelVisibility(visible?: boolean, animate?: boolean) {
    this.togglePanelVisibility('showTopPanel', this._topPanelScrollers, visible, animate);
  }

  /**
   * Set the Header Row Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if header row panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setHeaderRowVisibility(visible?: boolean, animate?: boolean) {
    this.togglePanelVisibility('showHeaderRow', this._headerRowScroller, visible, animate);
  }

  /**
   * Set the Column Header Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if column header is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setColumnHeaderVisibility(visible?: boolean, animate?: boolean) {
    this.togglePanelVisibility('showColumnHeader', this._headerScroller, visible, animate);
  }

  /**
   * Set the Footer Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if footer row panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setFooterRowVisibility(visible?: boolean, animate?: boolean) {
    this.togglePanelVisibility('showFooterRow', this._footerRowScroller, visible, animate);
  }

  /**
   * Set the Pre-Header Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if pre-header panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setPreHeaderPanelVisibility(visible?: boolean, animate?: boolean) {
    this.togglePanelVisibility('showPreHeaderPanel', [this._preHeaderPanelScroller, this._preHeaderPanelScrollerR], visible, animate);
  }

  /** Get Grid Canvas Node DOM Element */
  getContainerNode() {
    return this._container;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Rendering / Scrolling

  protected getRowTop(row: number) {
    return this._options.rowHeight! * row - this.offset;
  }

  protected getRowFromPosition(y: number) {
    return Math.floor((y + this.offset) / this._options.rowHeight!);
  }

  /**
   * Scroll to an Y position in the grid
   * @param {Number} y
   */
  scrollTo(y: number) {
    y = Math.max(y, 0);
    y = Math.min(y, (this.th || 0) - (Utils.height(this._viewportScrollContainerY) as number) + ((this.viewportHasHScroll || this.hasFrozenColumns()) ? (this.scrollbarDimensions?.height ?? 0) : 0));

    const oldOffset = this.offset;
    this.offset = Math.round(this.page * (this.cj || 0));
    this.page = Math.min((this.n || 0) - 1, Math.floor(y / (this.ph || 0)));
    const newScrollTop = (y - this.offset) as number;

    if (this.offset !== oldOffset) {
      const range = this.getVisibleRange(newScrollTop);
      this.cleanupRows(range);
      this.updateRowPositions();
    }

    if (this.prevScrollTop !== newScrollTop) {
      this.vScrollDir = (this.prevScrollTop + oldOffset < newScrollTop + this.offset) ? 1 : -1;
      this.lastRenderedScrollTop = (this.scrollTop = this.prevScrollTop = newScrollTop);

      if (this.hasFrozenColumns()) {
        this._viewportTopL.scrollTop = newScrollTop;
      }

      if (this.hasFrozenRows) {
        this._viewportBottomL.scrollTop = this._viewportBottomR.scrollTop = newScrollTop;
      }

      if (this._viewportScrollContainerY) {
        this._viewportScrollContainerY.scrollTop = newScrollTop;
      }

      this.trigger(this.onViewportChanged, {});
    }
  }

  protected defaultFormatter(_row: number, _cell: number, value: any) {
    if (value == null) {
      return '';
    } else {
      return (value + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }

  protected getFormatter(row: number, column: C): Formatter {
    const rowMetadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);

    // look up by id, then index
    const columnOverrides = rowMetadata?.columns &&
      (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]);

    return ((columnOverrides?.formatter) ||
      (rowMetadata?.formatter) ||
      column.formatter ||
      (this._options.formatterFactory?.getFormatter(column)) ||
      this._options.defaultFormatter) as Formatter;
  }

  protected getEditor(row: number, cell: number): Editor | undefined {
    const column = this.columns[cell];
    const rowMetadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);
    const columnMetadata = rowMetadata?.columns;

    if (columnMetadata?.[column.id]?.editor !== undefined) {
      return columnMetadata[column.id].editor as Editor;
    }
    if (columnMetadata?.[cell]?.editor !== undefined) {
      return columnMetadata[cell].editor as Editor;
    }

    return (column.editor || (this._options?.editorFactory?.getEditor(column))) as Editor;
  }

  protected getDataItemValueForColumn(item: TData, columnDef: C) {
    if (this._options.dataItemColumnValueExtractor) {
      return this._options.dataItemColumnValueExtractor(item, columnDef) as TData;
    }
    return item[columnDef.field as keyof TData];
  }

  protected appendRowHtml(stringArrayL: string[], stringArrayR: string[], row: number, range: CellViewportRange, dataLength: number) {
    const d = this.getDataItem(row);
    const dataLoading = row < dataLength && !d;
    let rowCss = 'slick-row' +
      (this.hasFrozenRows && row <= this._options.frozenRow! ? ' frozen' : '') +
      (dataLoading ? ' loading' : '') +
      (row === this.activeRow && this._options.showCellSelection ? ' active' : '') +
      (row % 2 == 1 ? ' odd' : ' even');

    if (!d) {
      rowCss += ' ' + this._options.addNewRowCssClass;
    }

    const metadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);

    if (metadata?.cssClasses) {
      rowCss += ' ' + metadata.cssClasses;
    }

    const frozenRowOffset = this.getFrozenRowOffset(row);

    const rowHtml = `<div class="ui-widget-content ${rowCss}" style="top:${(this.getRowTop(row) - frozenRowOffset)}px">`;

    stringArrayL.push(rowHtml);

    if (this.hasFrozenColumns()) {
      stringArrayR.push(rowHtml);
    }

    let colspan: number | string, m: C;
    for (let i = 0, ii = this.columns.length; i < ii; i++) {
      m = this.columns[i];
      if (!m || m.hidden) continue;

      colspan = 1;
      if (metadata?.columns) {
        const columnData = metadata.columns[m.id] || metadata.columns[i];
        colspan = columnData?.colspan || 1;
        if (colspan === '*') {
          colspan = ii - i;
        }
      }

      // Do not render cells outside of the viewport.
      if (this.columnPosRight[Math.min(ii - 1, i + (colspan as number) - 1)] > range.leftPx) {
        if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx) {
          // All columns to the right are outside the range.
          break;
        }

        if (this.hasFrozenColumns() && (i > this._options.frozenColumn!)) {
          this.appendCellHtml(stringArrayR, row, i, (colspan as number), d);
        } else {
          this.appendCellHtml(stringArrayL, row, i, (colspan as number), d);
        }
      } else if (m.alwaysRenderColumn || (this.hasFrozenColumns() && i <= this._options.frozenColumn!)) {
        this.appendCellHtml(stringArrayL, row, i, (colspan as number), d);
      }

      if ((colspan as number) > 1) {
        i += ((colspan as number) - 1);
      }
    }

    stringArrayL.push('</div>');

    if (this.hasFrozenColumns()) {
      stringArrayR.push('</div>');
    }
  }

  protected appendCellHtml(stringArray: string[], row: number, cell: number, colspan: number, item: TData) {
    // stringArray: stringBuilder containing the HTML parts
    // row, cell: row and column index
    // colspan: HTML colspan
    // item: grid data for row

    const m = this.columns[cell];
    let cellCss = 'slick-cell l' + cell + ' r' + Math.min(this.columns.length - 1, cell + colspan - 1) + (m.cssClass ? ' ' + m.cssClass : '');

    if (this.hasFrozenColumns() && cell <= this._options.frozenColumn!) {
      cellCss += (' frozen');
    }

    if (row === this.activeRow && cell === this.activeCell && this._options.showCellSelection) {
      cellCss += (' active');
    }

    // TODO:  merge them together in the setter
    for (const key in this.cellCssClasses) {
      if (this.cellCssClasses[key][row]?.[m.id]) {
        cellCss += (' ' + this.cellCssClasses[key][row][m.id]);
      }
    }

    let value: any = null, formatterResult: FormatterResultObject | string = '';
    if (item) {
      value = this.getDataItemValueForColumn(item, m);
      formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this as unknown as SlickGridModel);
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
      addlCssClasses += (addlCssClasses ? ' ' : '') + (formatterResult as FormatterResultObject).addClasses;
    }
    const toolTip = (formatterResult as FormatterResultObject)?.toolTip ? "title='" + (formatterResult as FormatterResultObject).toolTip + "'" : '';

    let customAttrStr = '';
    if (m.hasOwnProperty('cellAttrs') && m.cellAttrs instanceof Object) {
      for (const key in m.cellAttrs) {
        if (m.cellAttrs.hasOwnProperty(key)) {
          customAttrStr += ` ${key}="${m.cellAttrs[key]}" `;
        }
      }
    }

    stringArray.push(`<div class="${cellCss + (addlCssClasses ? ' ' + addlCssClasses : '')}" ${toolTip + customAttrStr}>`);

    // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
    if (item) {
      stringArray.push((Object.prototype.toString.call(formatterResult) !== '[object Object]' ? formatterResult : (formatterResult as FormatterResultObject).text) as string);
    }

    stringArray.push('</div>');

    this.rowsCache[row].cellRenderQueue.push(cell);
    this.rowsCache[row].cellColSpans[cell] = colspan;
  }

  protected cleanupRows(rangeToKeep: { bottom: number; top: number; }) {
    for (const rowId in this.rowsCache) {
      let i = +rowId;
      let removeFrozenRow = true;

      if (this.hasFrozenRows
        && ((this._options.frozenBottom && (i as unknown as number) >= this.actualFrozenRow) // Frozen bottom rows
          || (!this._options.frozenBottom && (i as unknown as number) <= this.actualFrozenRow) // Frozen top rows
        )
      ) {
        removeFrozenRow = false;
      }

      if (((i = parseInt(rowId, 10)) !== this.activeRow)
        && (i < rangeToKeep.top || i > rangeToKeep.bottom)
        && (removeFrozenRow)
      ) {
        this.removeRowFromCache(i);
      }
    }
    if (this._options.enableAsyncPostRenderCleanup) { this.startPostProcessingCleanup(); }
  }

  /** Invalidate all grid rows and re-render the grid rows */
  invalidate() {
    this.updateRowCount();
    this.invalidateAllRows();
    this.render();
  }

  /** Invalidate all grid rows */
  invalidateAllRows() {
    if (this.currentEditor) {
      this.makeActiveCellNormal();
    }
    for (const row in this.rowsCache) {
      this.removeRowFromCache(+row);
    }
    if (this._options.enableAsyncPostRenderCleanup) { this.startPostProcessingCleanup(); }
  }

  /**
   * Invalidate a specific set of row numbers
   * @param {Number[]} rows
   */
  invalidateRows(rows: number[]) {
    if (!rows || !rows.length) {
      return;
    }
    this.vScrollDir = 0;
    const rl = rows.length;
    for (let i = 0; i < rl; i++) {
      if (this.currentEditor && this.activeRow === rows[i]) {
        this.makeActiveCellNormal();
      }
      if (this.rowsCache[rows[i]]) {
        this.removeRowFromCache(rows[i]);
      }
    }
    if (this._options.enableAsyncPostRenderCleanup) { this.startPostProcessingCleanup(); }
  }

  /**
   * Invalidate a specific row number
   * @param {Number} row
   */
  invalidateRow(row?: number) {
    if (!row && row !== 0) { return; }
    this.invalidateRows([row]);
  }

  protected queuePostProcessedRowForCleanup(cacheEntry: RowCaching, postProcessedRow: any, rowIdx: number) {
    this.postProcessgroupId++;

    // store and detach node for later async cleanup
    for (const columnIdx in postProcessedRow) {
      if (postProcessedRow.hasOwnProperty(columnIdx)) {
        this.postProcessedCleanupQueue.push({
          actionType: 'C',
          groupId: this.postProcessgroupId,
          node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
          columnIdx: +columnIdx,
          rowIdx
        });
      }
    }
    this.postProcessedCleanupQueue.push({
      actionType: 'R',
      groupId: this.postProcessgroupId,
      node: cacheEntry.rowNode as HTMLElement[]
    });
    cacheEntry.rowNode?.forEach((node) => node.remove());
  }

  protected queuePostProcessedCellForCleanup(cellnode: HTMLElement, columnIdx: number, rowIdx: number) {
    this.postProcessedCleanupQueue.push({
      actionType: 'C',
      groupId: this.postProcessgroupId,
      node: cellnode,
      columnIdx,
      rowIdx
    });
    cellnode.remove();
  }

  protected removeRowFromCache(row: number) {
    const cacheEntry = this.rowsCache[row];
    if (!cacheEntry) {
      return;
    }

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

  /** Apply a Formatter Result to a Cell DOM Node */
  applyFormatResultToCellNode(formatterResult: FormatterResultObject | string, cellNode: HTMLDivElement, suppressRemove?: boolean) {
    if (formatterResult === null || formatterResult === undefined) { formatterResult = ''; }
    if (Object.prototype.toString.call(formatterResult) !== '[object Object]') {
      cellNode.innerHTML = this.sanitizeHtmlString(formatterResult as string);
      return;
    }
    cellNode.innerHTML = this.sanitizeHtmlString((formatterResult as FormatterResultObject).text);
    if ((formatterResult as FormatterResultObject).removeClasses && !suppressRemove) {
      const classes = (formatterResult as FormatterResultObject).removeClasses!.split(' ');
      classes.forEach((c) => cellNode.classList.remove(c));
    }
    if ((formatterResult as FormatterResultObject).addClasses) {
      const classes = (formatterResult as FormatterResultObject).addClasses!.split(' ');
      classes.forEach((c) => cellNode.classList.add(c));
    }
    if ((formatterResult as FormatterResultObject).toolTip) {
      cellNode.setAttribute('title', (formatterResult as FormatterResultObject).toolTip!);
    }
  }

  /**
   * Update a specific cell by its row and column index
   * @param {Number} row - grid row number
   * @param {Number} cell - grid cell column number
   */
  updateCell(row: number, cell: number) {
    const cellNode = this.getCellNode(row, cell);
    if (!cellNode) {
      return;
    }

    const m = this.columns[cell], d = this.getDataItem(row);
    if (this.currentEditor && this.activeRow === row && this.activeCell === cell) {
      this.currentEditor.loadValue(d);
    } else {
      const formatterResult = d ? this.getFormatter(row, m)(row, cell, this.getDataItemValueForColumn(d, m), m, d, this as unknown as SlickGridModel) : '';
      this.applyFormatResultToCellNode(formatterResult, cellNode);
      this.invalidatePostProcessingResults(row);
    }
  }

  /**
   * Update a specific row by its row index
   * @param {Number} row - grid row number
   */
  updateRow(row: number) {
    const cacheEntry = this.rowsCache[row];
    if (!cacheEntry) {
      return;
    }

    this.ensureCellNodesInRowsCache(row);

    let formatterResult;
    const d = this.getDataItem(row);

    for (const colIdx in cacheEntry.cellNodesByColumnIdx) {
      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
        continue;
      }

      const columnIdx = +colIdx;
      const m = this.columns[columnIdx],

        node = cacheEntry.cellNodesByColumnIdx[columnIdx];

      if (row === this.activeRow && columnIdx === this.activeCell && this.currentEditor) {
        this.currentEditor.loadValue(d);
      } else if (d) {
        formatterResult = this.getFormatter(row, m)(row, columnIdx, this.getDataItemValueForColumn(d, m), m, d, this as unknown as SlickGridModel);
        this.applyFormatResultToCellNode(formatterResult, node as HTMLDivElement);
      } else {
        node.innerHTML = '';
      }
    }

    this.invalidatePostProcessingResults(row);
  }

  /**
   * Get the number of rows displayed in the viewport
   * Note that the row count is an approximation because it is a calculated value using this formula (viewport / rowHeight = rowCount),
   * the viewport must also be displayed for this calculation to work.
   * @return {Number} rowCount
   */
  getViewportRowCount() {
    const vh = this.getViewportHeight();
    const scrollbarHeight = this.getScrollbarDimensions()?.height ?? 0;
    return Math.floor((vh - scrollbarHeight) / this._options.rowHeight!);
  }

  getViewportHeight() {
    if (!this._options.autoHeight || this._options.frozenColumn !== -1) {
      this.topPanelH = (this._options.showTopPanel) ? this._options.topPanelHeight! + this.getVBoxDelta(this._topPanelScrollers[0]) : 0;
      this.headerRowH = (this._options.showHeaderRow) ? this._options.headerRowHeight! + this.getVBoxDelta(this._headerRowScroller[0]) : 0;
      this.footerRowH = (this._options.showFooterRow) ? this._options.footerRowHeight! + this.getVBoxDelta(this._footerRowScroller[0]) : 0;
    }

    if (this._options.autoHeight) {
      let fullHeight = this._paneHeaderL.offsetHeight;
      fullHeight += (this._options.showHeaderRow) ? this._options.headerRowHeight! + this.getVBoxDelta(this._headerRowScroller[0]) : 0;
      fullHeight += (this._options.showFooterRow) ? this._options.footerRowHeight! + this.getVBoxDelta(this._footerRowScroller[0]) : 0;
      fullHeight += (this.getCanvasWidth() > this.viewportW) ? (this.scrollbarDimensions?.height ?? 0) : 0;

      this.viewportH = this._options.rowHeight!
        * this.getDataLengthIncludingAddNew()
        + ((this._options.frozenColumn == -1) ? fullHeight : 0);
    } else {
      const columnNamesH = (this._options.showColumnHeader) ? Utils.toFloat(Utils.height(this._headerScroller[0]) as number) + this.getVBoxDelta(this._headerScroller[0]) : 0;
      const preHeaderH = (this._options.createPreHeaderPanel && this._options.showPreHeaderPanel) ? this._options.preHeaderPanelHeight! + this.getVBoxDelta(this._preHeaderPanelScroller) : 0;

      const style = getComputedStyle(this._container);
      this.viewportH = Utils.toFloat(style.height)
        - Utils.toFloat(style.paddingTop)
        - Utils.toFloat(style.paddingBottom)
        - columnNamesH
        - this.topPanelH
        - this.headerRowH
        - this.footerRowH
        - preHeaderH;
    }

    this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight!);
    return this.viewportH;
  }

  getViewportWidth() {
    this.viewportW = parseFloat(Utils.innerSize(this._container, 'width') as unknown as string);
    return this.viewportW;
  }

  /** Execute a Resize of the Grid Canvas */
  resizeCanvas() {
    if (!this.initialized) { return; }
    this.paneTopH = 0;
    this.paneBottomH = 0;
    this.viewportTopH = 0;
    this.viewportBottomH = 0;

    this.getViewportWidth();
    this.getViewportHeight();

    // Account for Frozen Rows
    if (this.hasFrozenRows) {
      if (this._options.frozenBottom) {
        this.paneTopH = this.viewportH - this.frozenRowsHeight - (this.scrollbarDimensions?.height ?? 0);
        this.paneBottomH = this.frozenRowsHeight + (this.scrollbarDimensions?.height ?? 0);
      } else {
        this.paneTopH = this.frozenRowsHeight;
        this.paneBottomH = this.viewportH - this.frozenRowsHeight;
      }
    } else {
      this.paneTopH = this.viewportH;
    }

    // The top pane includes the top panel and the header row
    this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH;

    if (this.hasFrozenColumns() && this._options.autoHeight) {
      this.paneTopH += (this.scrollbarDimensions?.height ?? 0);
    }

    // The top viewport does not contain the top panel or header row
    this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH;

    if (this._options.autoHeight) {
      if (this.hasFrozenColumns()) {
        const style = getComputedStyle(this._headerScrollerL);
        Utils.height(this._container, this.paneTopH + Utils.toFloat(style.height));
      }

      this._paneTopL.style.position = 'relative';
    }

    Utils.setStyleSize(this._paneTopL, 'top', Utils.height(this._paneHeaderL) || (this._options.showHeaderRow ? this._options.headerRowHeight! : 0) + (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight! : 0));
    Utils.height(this._paneTopL, this.paneTopH);

    const paneBottomTop = this._paneTopL.offsetTop + this.paneTopH;

    if (!this._options.autoHeight) {
      Utils.height(this._viewportTopL, this.viewportTopH);
    }

    if (this.hasFrozenColumns()) {
      Utils.setStyleSize(this._paneTopR, 'top', Utils.height(this._paneHeaderL) as number);
      Utils.height(this._paneTopR, this.paneTopH);
      Utils.height(this._viewportTopR, this.viewportTopH);

      if (this.hasFrozenRows) {
        Utils.setStyleSize(this._paneBottomL, 'top', paneBottomTop);
        Utils.height(this._paneBottomL, this.paneBottomH);
        Utils.setStyleSize(this._paneBottomR, 'top', paneBottomTop);
        Utils.height(this._paneBottomR, this.paneBottomH);
        Utils.height(this._viewportBottomR, this.paneBottomH);
      }
    } else {
      if (this.hasFrozenRows) {
        Utils.width(this._paneBottomL, '100%');
        Utils.height(this._paneBottomL, this.paneBottomH);
        Utils.setStyleSize(this._paneBottomL, 'top', paneBottomTop);
      }
    }

    if (this.hasFrozenRows) {
      Utils.height(this._viewportBottomL, this.paneBottomH);

      if (this._options.frozenBottom) {
        Utils.height(this._canvasBottomL, this.frozenRowsHeight);

        if (this.hasFrozenColumns()) {
          Utils.height(this._canvasBottomR, this.frozenRowsHeight);
        }
      } else {
        Utils.height(this._canvasTopL, this.frozenRowsHeight);

        if (this.hasFrozenColumns()) {
          Utils.height(this._canvasTopR, this.frozenRowsHeight);
        }
      }
    } else {
      Utils.height(this._viewportTopR, this.viewportTopH);
    }

    if (!this.scrollbarDimensions || !this.scrollbarDimensions.width) {
      this.scrollbarDimensions = this.measureScrollbar();
    }

    if (this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit) {
      this.autosizeColumns();
    }

    this.updateRowCount();
    this.handleScroll();
    // Since the width has changed, force the render() to reevaluate virtually rendered cells.
    this.lastRenderedScrollLeft = -1;
    this.render();
  }

  /**
   * Update paging information status from the View
   * @param {PagingInfo} pagingInfo
   */
  updatePagingStatusFromView(pagingInfo: PagingInfo) {
    this.pagingActive = (pagingInfo.pageSize !== 0);
    this.pagingIsLastPage = (pagingInfo.pageNum == pagingInfo.totalPages - 1);
  }

  /** Update the dataset row count */
  updateRowCount() {
    if (!this.initialized) { return; }

    const dataLength = this.getDataLength();
    const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
    let numberOfRows = 0;
    let oldH = ((this.hasFrozenRows && !this._options.frozenBottom) ? Utils.height(this._canvasBottomL) : Utils.height(this._canvasTopL)) as number;

    if (this.hasFrozenRows) {
      numberOfRows = this.getDataLength() - this._options.frozenRow!;
    } else {
      numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);
    }

    const tempViewportH = Utils.height(this._viewportScrollContainerY) as number;
    const oldViewportHasVScroll = this.viewportHasVScroll;
    // with autoHeight, we do not need to accommodate the vertical scroll bar
    this.viewportHasVScroll = this._options.alwaysShowVerticalScroll || !this._options.autoHeight && (numberOfRows * this._options.rowHeight! > tempViewportH);

    this.makeActiveCellNormal();

    // remove the rows that are now outside of the data range
    // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
    const r1 = dataLength - 1;
    for (const i in this.rowsCache) {
      if (Number(i) > r1) {
        this.removeRowFromCache(+i);
      }
    }
    if (this._options.enableAsyncPostRenderCleanup) {
      this.startPostProcessingCleanup();
    }

    if (this.activeCellNode && this.activeRow > r1) {
      this.resetActiveCell();
    }

    oldH = this.h;
    if (this._options.autoHeight) {
      this.h = this._options.rowHeight! * numberOfRows;
    } else {
      this.th = Math.max(this._options.rowHeight! * numberOfRows, tempViewportH - (this.scrollbarDimensions?.height ?? 0));
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

    if (this.h !== oldH || this.enforceFrozenRowHeightRecalc) {
      if (this.hasFrozenRows && !this._options.frozenBottom) {
        Utils.height(this._canvasBottomL, this.h);

        if (this.hasFrozenColumns()) {
          Utils.height(this._canvasBottomR, this.h);
        }
      } else {
        Utils.height(this._canvasTopL, this.h);
        Utils.height(this._canvasTopR, this.h);
      }

      this.scrollTop = this._viewportScrollContainerY.scrollTop;
      this.enforceFrozenRowHeightRecalc = false; // reset enforce flag
    }

    const oldScrollTopInRange = (this.scrollTop + this.offset <= this.th - tempViewportH);

    if (this.th == 0 || this.scrollTop == 0) {
      this.page = this.offset = 0;
    } else if (oldScrollTopInRange) {
      // maintain virtual position
      this.scrollTo(this.scrollTop + this.offset);
    } else {
      // scroll to bottom
      this.scrollTo(this.th - tempViewportH + (this.scrollbarDimensions?.height ?? 0));
    }

    if (this.h !== oldH && this._options.autoHeight) {
      this.resizeCanvas();
    }

    if (this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll !== this.viewportHasVScroll) {
      this.autosizeColumns();
    }
    this.updateCanvasWidth(false);
  }

  /** @alias `getVisibleRange` */
  getViewport(viewportTop?: number, viewportLeft?: number) {
    return this.getVisibleRange(viewportTop, viewportLeft);
  }

  getVisibleRange(viewportTop?: number, viewportLeft?: number) {
    if (viewportTop == null) {
      viewportTop = this.scrollTop;
    }
    if (viewportLeft == null) {
      viewportLeft = this.scrollLeft;
    }

    return {
      top: this.getRowFromPosition(viewportTop),
      bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
      leftPx: viewportLeft,
      rightPx: viewportLeft + this.viewportW
    };
  }

  /** Get rendered range */
  getRenderedRange(viewportTop?: number, viewportLeft?: number) {
    const range = this.getVisibleRange(viewportTop, viewportLeft);
    const buffer = Math.round(this.viewportH / this._options.rowHeight!);
    const minBuffer = this._options.minRowBuffer as number;

    if (this.vScrollDir == -1) {
      range.top -= buffer;
      range.bottom += minBuffer;
    } else if (this.vScrollDir == 1) {
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

  protected ensureCellNodesInRowsCache(row: number) {
    const cacheEntry = this.rowsCache[row];
    if (cacheEntry) {
      if (cacheEntry.cellRenderQueue.length) {
        const rowNode = cacheEntry.rowNode as HTMLElement[];
        let children = Array.from(rowNode[0].children) as HTMLElement[];
        if (rowNode.length > 1) {
          children = children.concat(Array.from(rowNode[1].children) as HTMLElement[]);
        }

        let i = children.length - 1;
        while (cacheEntry.cellRenderQueue.length) {
          const columnIdx = cacheEntry.cellRenderQueue.pop();
          (cacheEntry.cellNodesByColumnIdx as HTMLElement[])[columnIdx] = children[i--];
        }
      }
    }
  }

  protected cleanUpCells(range: CellViewportRange, row: number) {
    // Ignore frozen rows
    if (this.hasFrozenRows
      && ((this._options.frozenBottom && row > this.actualFrozenRow) // Frozen bottom rows
        || (row <= this.actualFrozenRow)                     // Frozen top rows
      )
    ) {
      return;
    }

    let totalCellsRemoved = 0;
    const cacheEntry = this.rowsCache[row];

    // Remove cells outside the range.
    const cellsToRemove: number[] = [];
    for (const cellNodeIdx in cacheEntry.cellNodesByColumnIdx) {
      // I really hate it when people mess with Array.prototype.
      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx)) {
        continue;
      }

      // This is a string, so it needs to be cast back to a number.
      const i = +cellNodeIdx;

      // Ignore frozen columns
      if (i <= this._options.frozenColumn!) {
        continue;
      }

      // Ignore alwaysRenderedColumns
      if (Array.isArray(this.columns) && this.columns[i] && this.columns[i].alwaysRenderColumn) {
        continue;
      }

      const colspan = cacheEntry.cellColSpans[i];
      if (this.columnPosLeft[i] > range.rightPx ||
        this.columnPosRight[Math.min(this.columns.length - 1, (i || 0) + (colspan as number) - 1)] < range.leftPx) {
        if (!(row == this.activeRow && Number(i) == this.activeCell)) {
          cellsToRemove.push((i as unknown as number));
        }
      }
    }

    let cellToRemove, cellNode;
    while ((cellToRemove = cellsToRemove.pop()) != null) {
      cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove];

      if (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row]?.[cellToRemove]) {
        this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row);
      } else {
        cellNode.parentElement?.removeChild(cellNode);
      }

      delete cacheEntry.cellColSpans[cellToRemove];
      delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
      if (this.postProcessedRows[row]) {
        delete this.postProcessedRows[row][cellToRemove];
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      totalCellsRemoved++;
    }
  }

  protected cleanUpAndRenderCells(range: CellViewportRange) {
    let cacheEntry;
    const stringArray: string[] = [];
    const processedRows: number[] = [];
    let cellsAdded: number;
    let totalCellsAdded = 0;
    let colspan;

    for (let row = range.top as number, btm = range.bottom as number; row <= btm; row++) {
      cacheEntry = this.rowsCache[row];
      if (!cacheEntry) {
        continue;
      }

      // cellRenderQueue populated in renderRows() needs to be cleared first
      this.ensureCellNodesInRowsCache(row);

      this.cleanUpCells(range, row);

      // Render missing cells.
      cellsAdded = 0;

      let metadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row) ?? {} as ItemMetadata;
      metadata = metadata?.columns as ItemMetadata;

      const d = this.getDataItem(row);

      // TODO:  shorten this loop (index? heuristics? binary search?)
      for (let i = 0, ii = this.columns.length; i < ii; i++) {
        if (!this.columns[i] || this.columns[i].hidden) continue;

        // Cells to the right are outside the range.
        if (this.columnPosLeft[i] > range.rightPx) {
          break;
        }

        // Already rendered.
        if ((colspan = cacheEntry.cellColSpans[i] as number) != null) {
          i += (colspan > 1 ? colspan - 1 : 0);
          continue;
        }

        colspan = 1;
        if (metadata) {
          const columnData = metadata[this.columns[i].id as keyof ItemMetadata] || (metadata as any)[i];
          colspan = columnData?.colspan ?? 1;
          if (colspan === '*') {
            colspan = ii - i;
          }
        }

        if (this.columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
          this.appendCellHtml(stringArray, row, i, colspan, d);
          cellsAdded++;
        }

        i += (colspan > 1 ? colspan - 1 : 0);
      }

      if (cellsAdded) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalCellsAdded += cellsAdded;
        processedRows.push(row);
      }
    }

    if (!stringArray.length) {
      return;
    }

    const x = Utils.createDomElement('div', { innerHTML: this.sanitizeHtmlString(stringArray.join('')) });
    let processedRow: number | null | undefined;
    let node: HTMLElement;
    while ((processedRow = processedRows.pop()) != null) {
      cacheEntry = this.rowsCache[processedRow];
      let columnIdx;
      while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
        node = x.lastChild as HTMLElement;

        if (this.hasFrozenColumns() && (columnIdx > this._options.frozenColumn!)) {
          cacheEntry.rowNode![1].appendChild(node);
        } else {
          cacheEntry.rowNode![0].appendChild(node);
        }
        cacheEntry.cellNodesByColumnIdx![columnIdx] = node;
      }
    }
  }

  protected renderRows(range: { top: number; bottom: number; leftPx: number; rightPx: number; }) {
    const stringArrayL: string[] = [];
    const stringArrayR: string[] = [];
    const rows: number[] = [];
    let needToReselectCell = false;
    const dataLength = this.getDataLength();

    for (let i = range.top as number, ii = range.bottom as number; i <= ii; i++) {
      if (this.rowsCache[i] || (this.hasFrozenRows && this._options.frozenBottom && i == this.getDataLength())) {
        continue;
      }
      this.renderedRows++;
      rows.push(i);

      // Create an entry right away so that appendRowHtml() can
      // start populating it.
      this.rowsCache[i] = {
        rowNode: null,

        // ColSpans of rendered cells (by column idx).
        // Can also be used for checking whether a cell has been rendered.
        cellColSpans: [],

        // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
        cellNodesByColumnIdx: [],

        // Column indices of cell nodes that have been rendered, but not yet indexed in
        // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
        // end of the row.
        cellRenderQueue: []
      };

      this.appendRowHtml(stringArrayL, stringArrayR, i, range, dataLength);
      if (this.activeCellNode && this.activeRow === i) {
        needToReselectCell = true;
      }
      this.counter_rows_rendered++;
    }

    if (!rows.length) { return; }

    const x = Utils.createDomElement('div', { innerHTML: this.sanitizeHtmlString(stringArrayL.join('')) });
    const xRight = Utils.createDomElement('div', { innerHTML: this.sanitizeHtmlString(stringArrayR.join('')) });

    for (let i = 0, ii = rows.length; i < ii; i++) {
      if ((this.hasFrozenRows) && (rows[i] >= this.actualFrozenRow)) {
        if (this.hasFrozenColumns()) {
          this.rowsCache[rows[i]].rowNode = [x.firstChild as HTMLElement, xRight.firstChild as HTMLElement];
          this._canvasBottomL.appendChild(x.firstChild as ChildNode);
          this._canvasBottomR.appendChild(xRight.firstChild as ChildNode);
        } else {
          this.rowsCache[rows[i]].rowNode = [x.firstChild as HTMLElement];
          this._canvasBottomL.appendChild(x.firstChild as ChildNode);
        }
      } else if (this.hasFrozenColumns()) {
        this.rowsCache[rows[i]].rowNode = [x.firstChild as HTMLElement, xRight.firstChild as HTMLElement];
        this._canvasTopL.appendChild(x.firstChild as ChildNode);
        this._canvasTopR.appendChild(xRight.firstChild as ChildNode);
      } else {
        this.rowsCache[rows[i]].rowNode = [x.firstChild as HTMLElement];
        this._canvasTopL.appendChild(x.firstChild as ChildNode);
      }
    }

    if (needToReselectCell) {
      this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell);
    }
  }

  protected startPostProcessing() {
    if (!this._options.enableAsyncPostRender) {
      return;
    }
    clearTimeout(this.h_postrender);
    this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
  }

  protected startPostProcessingCleanup() {
    if (!this._options.enableAsyncPostRenderCleanup) {
      return;
    }
    clearTimeout(this.h_postrenderCleanup);
    this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
  }

  protected invalidatePostProcessingResults(row: number) {
    // change status of columns to be re-rendered
    for (const columnIdx in this.postProcessedRows[row]) {
      if (this.postProcessedRows[row].hasOwnProperty(columnIdx)) {
        this.postProcessedRows[row][columnIdx] = 'C';
      }
    }
    this.postProcessFromRow = Math.min(this.postProcessFromRow as number, row);
    this.postProcessToRow = Math.max(this.postProcessToRow as number, row);
    this.startPostProcessing();
  }

  protected updateRowPositions() {
    for (const row in this.rowsCache) {
      const rowNumber = row ? parseInt(row) : 0;
      Utils.setStyleSize(this.rowsCache[rowNumber].rowNode![0], 'top', this.getRowTop(rowNumber));
    }
  }

  /** (re)Render the grid */
  render() {
    if (!this.initialized) { return; }

    this.scrollThrottle.dequeue();

    const visible = this.getVisibleRange();
    const rendered = this.getRenderedRange();

    // remove rows no longer in the viewport
    this.cleanupRows(rendered);

    // add new rows & missing cells in existing rows
    if (this.lastRenderedScrollLeft !== this.scrollLeft) {
      if (this.hasFrozenRows) {
        const renderedFrozenRows = Utils.extend(true, {}, rendered);

        if (this._options.frozenBottom) {
          renderedFrozenRows.top = this.actualFrozenRow;
          renderedFrozenRows.bottom = this.getDataLength();
        } else {
          renderedFrozenRows.top = 0;
          renderedFrozenRows.bottom = this._options.frozenRow;
        }
        this.cleanUpAndRenderCells(renderedFrozenRows);
      }
      this.cleanUpAndRenderCells(rendered);
    }

    // render missing rows
    this.renderRows(rendered);

    // Render frozen rows
    if (this.hasFrozenRows) {
      if (this._options.frozenBottom) {
        this.renderRows({
          top: this.actualFrozenRow, bottom: this.getDataLength() - 1, leftPx: rendered.leftPx, rightPx: rendered.rightPx
        });
      } else {
        this.renderRows({
          top: 0, bottom: this._options.frozenRow! - 1, leftPx: rendered.leftPx, rightPx: rendered.rightPx
        });
      }
    }

    this.postProcessFromRow = visible.top;
    this.postProcessToRow = Math.min(this.getDataLengthIncludingAddNew() - 1, visible.bottom);
    this.startPostProcessing();

    this.lastRenderedScrollTop = this.scrollTop;
    this.lastRenderedScrollLeft = this.scrollLeft;
    this.h_render = null;
    this.trigger(this.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: this });
  }

  protected handleHeaderRowScroll() {
    const scrollLeft = this._headerRowScrollContainer.scrollLeft;
    if (scrollLeft !== this._viewportScrollContainerX.scrollLeft) {
      this._viewportScrollContainerX.scrollLeft = scrollLeft;
    }
  }

  protected handleFooterRowScroll() {
    const scrollLeft = this._footerRowScrollContainer.scrollLeft;
    if (scrollLeft !== this._viewportScrollContainerX.scrollLeft) {
      this._viewportScrollContainerX.scrollLeft = scrollLeft;
    }
  }

  protected handlePreHeaderPanelScroll() {
    this.handleElementScroll(this._preHeaderPanelScroller);
  }

  protected handleElementScroll(element: HTMLElement) {
    const scrollLeft = element.scrollLeft;
    if (scrollLeft !== this._viewportScrollContainerX.scrollLeft) {
      this._viewportScrollContainerX.scrollLeft = scrollLeft;
    }
  }

  protected handleScroll() {
    this.scrollTop = this._viewportScrollContainerY.scrollTop;
    this.scrollLeft = this._viewportScrollContainerX.scrollLeft;
    return this._handleScroll(false);
  }

  protected _handleScroll(isMouseWheel: boolean) {
    let maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight;
    let maxScrollDistanceX = this._viewportScrollContainerY.scrollWidth - this._viewportScrollContainerY.clientWidth;

    // Protect against erroneous clientHeight/Width greater than scrollHeight/Width.
    // Sometimes seen in Chrome.
    maxScrollDistanceY = Math.max(0, maxScrollDistanceY);
    maxScrollDistanceX = Math.max(0, maxScrollDistanceX);

    // Ceiling the max scroll values
    if (this.scrollTop > maxScrollDistanceY) {
      this.scrollTop = maxScrollDistanceY;
    }
    if (this.scrollLeft > maxScrollDistanceX) {
      this.scrollLeft = maxScrollDistanceX;
    }

    const vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop);
    const hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);

    if (hScrollDist) {
      this.prevScrollLeft = this.scrollLeft;

      // adjust scroll position of all div containers when scrolling the grid
      this._viewportScrollContainerX.scrollLeft = this.scrollLeft;
      this._headerScrollContainer.scrollLeft = this.scrollLeft;
      this._topPanelScrollers[0].scrollLeft = this.scrollLeft;
      if (this._options.createFooterRow) {
        this._footerRowScrollContainer.scrollLeft = this.scrollLeft;
      }
      if (this._options.createPreHeaderPanel) {
        if (this.hasFrozenColumns()) {
          this._preHeaderPanelScrollerR.scrollLeft = this.scrollLeft;
        } else {
          this._preHeaderPanelScroller.scrollLeft = this.scrollLeft;
        }
      }

      if (this.hasFrozenColumns()) {
        if (this.hasFrozenRows) {
          this._viewportTopR.scrollLeft = this.scrollLeft;
        }
        this._headerRowScrollerR.scrollLeft = this.scrollLeft; // right header row scrolling with frozen grid
      } else {
        if (this.hasFrozenRows) {
          this._viewportTopL.scrollLeft = this.scrollLeft;
        }
        this._headerRowScrollerL.scrollLeft = this.scrollLeft; // left header row scrolling with regular grid
      }
    }

    // autoheight suppresses vertical scrolling, but editors can create a div larger than
    // the row vertical size, which can lead to a vertical scroll bar appearing temporarily
    // while the editor is displayed. this is not part of the grid scrolling, so we should ignore it
    if (vScrollDist && !this._options.autoHeight) {
      this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1;
      this.prevScrollTop = this.scrollTop;

      if (isMouseWheel) {
        this._viewportScrollContainerY.scrollTop = this.scrollTop;
      }

      if (this.hasFrozenColumns()) {
        if (this.hasFrozenRows && !this._options.frozenBottom) {
          this._viewportBottomL.scrollTop = this.scrollTop;
        } else {
          this._viewportTopL.scrollTop = this.scrollTop;
        }
      }

      // switch virtual pages if needed
      if (vScrollDist < this.viewportH) {
        this.scrollTo(this.scrollTop + this.offset);
      } else {
        const oldOffset = this.offset;
        if (this.h == this.viewportH) {
          this.page = 0;
        } else {
          this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.th - this.viewportH) / (this.h - this.viewportH)) * (1 / this.ph)));
        }
        this.offset = Math.round(this.page * this.cj);
        if (oldOffset !== this.offset) {
          this.invalidateAllRows();
        }
      }
    }

    if (hScrollDist || vScrollDist) {
      const dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft);
      const dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
      if (dx > 20 || dy > 20) {
        // if rendering is forced or scrolling is small enough to be "easy", just render
        if (this._options.forceSyncScrolling || (dy < this.viewportH && dx < this.viewportW)) {
          this.render();
        } else {
          // otherwise, perform "difficult" renders at a capped frequency
          this.scrollThrottle.enqueue();
        }

        this.trigger(this.onViewportChanged, {});
      }
    }

    this.trigger(this.onScroll, { scrollLeft: this.scrollLeft, scrollTop: this.scrollTop });

    if (hScrollDist || vScrollDist) { return true; }
    return false;
  }

  /**
   * limits the frequency at which the provided action is executed.
   * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
   * call dequeue to cancel any pending action.
   */
  protected actionThrottle(action: () => void, minPeriod_ms: number) {
    let blocked = false;
    let queued = false;

    const enqueue = () => {
      if (!blocked) {
        blockAndExecute();
      } else {
        queued = true;
      }
    }

    const dequeue = () => {
      queued = false;
    }

    const blockAndExecute = () => {
      blocked = true;
      setTimeout(unblock, minPeriod_ms);
      action.call(this);
    }

    const unblock = () => {
      if (queued) {
        dequeue();
        blockAndExecute();
      } else {
        blocked = false;
      }
    }

    return {
      enqueue: enqueue.bind(this),
      dequeue: dequeue.bind(this)
    };
  }

  protected asyncPostProcessRows() {
    const dataLength = this.getDataLength();
    while (this.postProcessFromRow <= this.postProcessToRow) {
      const row = (this.vScrollDir >= 0) ? this.postProcessFromRow++ : this.postProcessToRow--;
      const cacheEntry = this.rowsCache[row];
      if (!cacheEntry || row >= dataLength) {
        continue;
      }

      if (!this.postProcessedRows[row]) {
        this.postProcessedRows[row] = {};
      }

      this.ensureCellNodesInRowsCache(row);
      for (const colIdx in cacheEntry.cellNodesByColumnIdx) {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
          continue;
        }

        const columnIdx = +colIdx;

        const m = this.columns[columnIdx];
        const processedStatus = this.postProcessedRows[row][columnIdx]; // C=cleanup and re-render, R=rendered
        if (m.asyncPostRender && processedStatus !== 'R') {
          const node = cacheEntry.cellNodesByColumnIdx[columnIdx];
          if (node) {
            m.asyncPostRender(node, row, this.getDataItem(row), m, (processedStatus === 'C'));
          }
          this.postProcessedRows[row][columnIdx] = 'R';
        }
      }

      this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
      return;
    }
  }

  protected asyncPostProcessCleanupRows() {
    if (this.postProcessedCleanupQueue.length > 0) {
      const groupId = this.postProcessedCleanupQueue[0].groupId;

      // loop through all queue members with this groupID
      while (this.postProcessedCleanupQueue.length > 0 && this.postProcessedCleanupQueue[0].groupId == groupId) {
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

  protected updateCellCssStylesOnRenderedRows(addedHash?: CssStyleHash | null, removedHash?: CssStyleHash | null) {
    let node: HTMLElement | null, columnId: number | string, addedRowHash, removedRowHash;
    for (const row in this.rowsCache) {
      removedRowHash = removedHash?.[row];
      addedRowHash = addedHash?.[row];

      if (removedRowHash) {
        for (columnId in removedRowHash) {
          if (!addedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) {
            node = this.getCellNode(+row, this.getColumnIndex(columnId));
            if (node) {
              node.classList.remove(removedRowHash[columnId]);
            }
          }
        }
      }

      if (addedRowHash) {
        for (columnId in addedRowHash) {
          if (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) {
            node = this.getCellNode(+row, this.getColumnIndex(columnId));
            if (node) {
              node.classList.add(addedRowHash[columnId]);
            }
          }
        }
      }
    }
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
  addCellCssStyles(key: string, hash: CssStyleHash) {
    if (this.cellCssClasses[key]) {
      throw new Error(`SlickGrid addCellCssStyles: cell CSS hash with key "${key}" already exists.`);
    }

    this.cellCssClasses[key] = hash;
    this.updateCellCssStylesOnRenderedRows(hash, null);
    this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
  }

  /**
   * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
   * @param {String} key A string key.
   */
  removeCellCssStyles(key: string) {
    if (!this.cellCssClasses[key]) {
      return;
    }

    this.updateCellCssStylesOnRenderedRows(null, this.cellCssClasses[key]);
    delete this.cellCssClasses[key];
    this.trigger(this.onCellCssStylesChanged, { key, hash: null, grid: this });
  }

  /**
   * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash). key is name for this set of styles so you can reference it later - to modify it or remove it, for example. hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
   * Suppose you have a grid with columns:
   * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
   * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).
   * @param {String} key A string key. Will overwrite any data already associated with this key.
   * @param {Object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
   */
  setCellCssStyles(key: string, hash: CssStyleHash) {
    const prevHash = this.cellCssClasses[key];

    this.cellCssClasses[key] = hash;
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

  /**
   * Flashes the cell twice by toggling the CSS class 4 times.
   * @param {Number} row A row index.
   * @param {Number} cell A column index.
   * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 100 ms.
   */
  flashCell(row: number, cell: number, speed?: number) {
    speed = speed || 250;

    const toggleCellClass = (cellNode: HTMLElement, times: number) => {
      if (times < 1) {
        return;
      }

      setTimeout(() => {
        if (times % 2 == 0) {
          cellNode.classList.add(this._options.cellFlashingCssClass || '');
        } else {
          cellNode.classList.remove(this._options.cellFlashingCssClass || '');
        }
        toggleCellClass(cellNode, times - 1);
      }, speed);
    }

    if (this.rowsCache[row]) {
      const cellNode = this.getCellNode(row, cell);
      if (cellNode) {
        toggleCellClass(cellNode, 5);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Interactivity

  protected handleMouseWheel(e: MouseEvent, _delta: number, deltaX: number, deltaY: number) {
    this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - (deltaY * this._options.rowHeight!));
    this.scrollLeft = this._viewportScrollContainerX.scrollLeft + (deltaX * 10);
    const handled = this._handleScroll(true);
    if (handled) {
      e.preventDefault();
    }
  }

  protected handleDragInit(e: DragEvent, dd: DragPosition) {
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

  protected handleDragStart(e: DragEvent, dd: DragPosition) {
    const cell = this.getCellFromEvent(e);
    if (!cell || !this.cellExists(cell.row, cell.cell)) {
      return false;
    }

    const retval = this.trigger(this.onDragStart, dd, e);
    if (retval.isImmediatePropagationStopped()) {
      return retval.getReturnValue();
    }

    return false;
  }

  protected handleDrag(e: DragEvent, dd: DragPosition) {
    return this.trigger(this.onDrag, dd, e).getReturnValue();
  }

  protected handleDragEnd(e: DragEvent, dd: DragPosition) {
    this.trigger(this.onDragEnd, dd, e);
  }

  protected handleKeyDown(e: KeyboardEvent & { originalEvent: Event; }) {
    const retval = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e);
    let handled: boolean | undefined | void = retval.isImmediatePropagationStopped();

    if (!handled) {
      if (!e.shiftKey && !e.altKey) {
        if (this._options.editable && this.currentEditor?.keyCaptureList) {
          if (this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1) {
            return;
          }
        }
        if (e.which == keyCode.HOME) {
          handled = (e.ctrlKey) ? this.navigateTop() : this.navigateRowStart();
        } else if (e.which == keyCode.END) {
          handled = (e.ctrlKey) ? this.navigateBottom() : this.navigateRowEnd();
        }
      }
    }
    if (!handled) {
      if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
        // editor may specify an array of keys to bubble
        if (this._options.editable && this.currentEditor?.keyCaptureList) {
          if (this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1) {
            return;
          }
        }
        if (e.which == keyCode.ESCAPE) {
          if (!this.getEditorLock()?.isActive()) {
            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
          }
          this.cancelEditAndSetFocus();
        } else if (e.which == keyCode.PAGE_DOWN) {
          this.navigatePageDown();
          handled = true;
        } else if (e.which == keyCode.PAGE_UP) {
          this.navigatePageUp();
          handled = true;
        } else if (e.which == keyCode.LEFT) {
          handled = this.navigateLeft();
        } else if (e.which == keyCode.RIGHT) {
          handled = this.navigateRight();
        } else if (e.which == keyCode.UP) {
          handled = this.navigateUp();
        } else if (e.which == keyCode.DOWN) {
          handled = this.navigateDown();
        } else if (e.which == keyCode.TAB) {
          handled = this.navigateNext();
        } else if (e.which == keyCode.ENTER) {
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
        }
      } else if (e.which == keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey) {
        handled = this.navigatePrev();
      }
    }

    if (handled) {
      // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
      e.stopPropagation();
      e.preventDefault();
      try {
        (e as any).originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
      }
      // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
      // (hitting control key only, nothing else), "Shift" (maybe others)
      catch (error) { }
    }
  }

  protected handleClick(evt: DOMEvent<HTMLDivElement> | SlickEventData_) {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;

    if (!this.currentEditor) {
      // if this click resulted in some cell child node getting focus,
      // don't steal it back - keyboard events will still bubble up
      // IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
      if ((e as DOMEvent<HTMLDivElement>).target !== document.activeElement || (e as DOMEvent<HTMLDivElement>).target.classList.contains('slick-cell')) {
        const selection = this.getTextSelection(); //store text-selection and restore it after
        this.setFocus();
        this.setTextSelection(selection as Range);
      }
    }

    const cell = this.getCellFromEvent(e);
    if (!cell || (this.currentEditor !== null && this.activeRow == cell.row && this.activeCell == cell.cell)) {
      return;
    }

    evt = this.trigger(this.onClick, { row: cell.row, cell: cell.cell }, evt || e);
    if (evt.isImmediatePropagationStopped()) {
      return;
    }

    // this optimisation causes trouble - MLeibman #329
    //if ((activeCell !== cell.cell || activeRow !== cell.row) && canCellBeActive(cell.row, cell.cell)) {
    if (this.canCellBeActive(cell.row, cell.cell)) {
      if (!this.getEditorLock()?.isActive() || this.getEditorLock()?.commitCurrentEdit()) {
        this.scrollRowIntoView(cell.row, false);

        const preClickModeOn = ((e as DOMEvent<HTMLDivElement>).target?.className === preClickClassName);
        const column = this.columns[cell.cell];
        const suppressActiveCellChangedEvent = !!(this._options.editable && column?.editor && this._options.suppressActiveCellChangeOnEdit);
        this.setActiveCellInternal(this.getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, (e as DOMEvent<HTMLDivElement>));
      }
    }
  }

  protected handleContextMenu(e: Event & { target: HTMLElement; }) {
    const cell = e.target.closest('.slick-cell');
    if (!cell) {
      return;
    }

    // are we editing this cell?
    if (this.activeCellNode === cell && this.currentEditor !== null) {
      return;
    }

    this.trigger(this.onContextMenu, {}, e);
  }

  protected handleDblClick(e: MouseEvent) {
    const cell = this.getCellFromEvent(e);
    if (!cell || (this.currentEditor !== null && this.activeRow == cell.row && this.activeCell == cell.cell)) {
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

  protected handleHeaderMouseEnter(e: MouseEvent & { target: HTMLElement; }) {
    const c = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (!c) {
      return;
    }
    this.trigger(this.onHeaderMouseEnter, {
      column: c,
      grid: this
    }, e);
  }

  protected handleHeaderMouseLeave(e: MouseEvent & { target: HTMLElement; }) {
    const c = Utils.storage.get(e.target.closest('.slick-header-column'), 'column');
    if (!c) {
      return;
    }
    this.trigger(this.onHeaderMouseLeave, {
      column: c,
      grid: this
    }, e);
  }

  protected handleHeaderRowMouseEnter(e: MouseEvent & { target: HTMLElement; }) {
    const c = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (!c) {
      return;
    }
    this.trigger(this.onHeaderRowMouseEnter, {
      column: c,
      grid: this
    }, e);
  }

  protected handleHeaderRowMouseLeave(e: MouseEvent & { target: HTMLElement; }) {
    const c = Utils.storage.get(e.target.closest('.slick-headerrow-column'), 'column');
    if (!c) {
      return;
    }
    this.trigger(this.onHeaderRowMouseLeave, {
      column: c,
      grid: this
    }, e);
  }

  protected handleHeaderContextMenu(e: MouseEvent & { target: HTMLElement; }) {
    const header = e.target.closest('.slick-header-column');
    const column = header && Utils.storage.get(header, 'column');
    this.trigger(this.onHeaderContextMenu, { column }, e);
  }

  protected handleHeaderClick(e: MouseEvent & { target: HTMLElement; }) {
    if (this.columnResizeDragging) {
      return;
    }

    const header = e.target.closest('.slick-header-column');
    const column = header && Utils.storage.get(header, 'column');
    if (column) {
      this.trigger(this.onHeaderClick, { column }, e);
    }
  }

  protected handleFooterContextMenu(e: MouseEvent & { target: HTMLElement; }) {
    const footer = e.target.closest('.slick-footerrow-column');
    const column = footer && Utils.storage.get(footer, 'column');
    this.trigger(this.onFooterContextMenu, { column }, e);
  }

  protected handleFooterClick(e: MouseEvent & { target: HTMLElement; }) {
    const footer = e.target.closest('.slick-footerrow-column');
    const column = footer && Utils.storage.get(footer, 'column');
    this.trigger(this.onFooterClick, { column }, e);
  }

  protected handleCellMouseOver(e: MouseEvent & { target: HTMLElement; }) {
    this.trigger(this.onMouseEnter, {}, e);
  }

  protected handleCellMouseOut(e: MouseEvent & { target: HTMLElement; }) {
    this.trigger(this.onMouseLeave, {}, e);
  }

  protected cellExists(row: number, cell: number) {
    return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
  }

  /**
   * Returns a hash containing row and cell indexes. Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
   * @param x An x coordinate.
   * @param y A y coordinate.
   */
  getCellFromPoint(x: number, y: number) {
    const row = this.getRowFromPosition(y);
    let cell = 0;

    let w = 0;
    for (let i = 0; i < this.columns.length && w < x; i++) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      w += this.columns[i].width as number;
      cell++;
    }

    if (cell < 0) {
      cell = 0;
    }

    return { row, cell: (cell - 1) };
  }

  protected getCellFromNode(cellNode: HTMLElement) {
    // read column number from .l<columnNumber> CSS class
    const cls = /l\d+/.exec(cellNode.className);
    if (!cls) {
      throw new Error(`SlickGrid getCellFromNode: cannot get cell - ${cellNode.className}`);
    }
    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
  }

  protected getRowFromNode(rowNode: HTMLElement): number | null {
    for (const row in this.rowsCache) {
      for (const i in this.rowsCache[row].rowNode) {
        if (this.rowsCache[row].rowNode?.[+i] === rowNode) {
          return (row ? parseInt(row) : 0);
        }
      }
    }
    return null;
  }

  /**
   * Get frozen (pinned) row offset
   * @param {Number} row - grid row number
   */
  getFrozenRowOffset(row: number) {
    //let offset = ( hasFrozenRows ) ? ( this._options.frozenBottom ) ? ( row >= actualFrozenRow ) ? ( h < viewportTopH ) ? ( actualFrozenRow * this._options.rowHeight ) : h : 0 : ( row >= actualFrozenRow ) ? frozenRowsHeight : 0 : 0; // WTF?
    let offset = 0;
    if (this.hasFrozenRows) {
      if (this._options.frozenBottom) {
        if (row >= this.actualFrozenRow) {
          if (this.h < this.viewportTopH) {
            offset = (this.actualFrozenRow * this._options.rowHeight!);
          } else {
            offset = this.h;
          }
        } else {
          offset = 0;
        }
      }
      else {
        if (row >= this.actualFrozenRow) {
          offset = this.frozenRowsHeight;
        } else {
          offset = 0;
        }
      }
    } else {
      offset = 0;
    }

    return offset;
  }

  /**
   * Returns a hash containing row and cell indexes from a standard W3C event.
   * @param {*} event A standard W3C event.
   */
  getCellFromEvent(evt: Event | SlickEventData_) {
    const e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
    const targetEvent: any = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : e;

    const cellNode = (e as Event & { target: HTMLElement }).target.closest('.slick-cell');
    if (!cellNode) {
      return null;
    }

    let row = this.getRowFromNode(cellNode.parentNode as HTMLElement);

    if (this.hasFrozenRows) {
      let rowOffset = 0;
      const c = Utils.offset(Utils.parents(cellNode, '.grid-canvas')[0] as HTMLElement);
      const isBottom = Utils.parents(cellNode, '.grid-canvas-bottom').length;

      if (isBottom) {
        rowOffset = (this._options.frozenBottom) ? Utils.height(this._canvasTopL) as number : this.frozenRowsHeight;
      }

      row = this.getCellFromPoint(targetEvent.clientX - c!.left, targetEvent.clientY - c!.top + rowOffset + document.documentElement.scrollTop).row;
    }

    const cell = this.getCellFromNode(cellNode as HTMLElement);

    if (row == null || cell == null) {
      return null;
    } else {
      return { row, cell };
    }
  }

  /**
   * Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
   * @param {Number} row - A row number.
   * @param {Number} cell - A column number.
   */
  getCellNodeBox(row: number, cell: number) {
    if (!this.cellExists(row, cell)) {
      return null;
    }

    const frozenRowOffset = this.getFrozenRowOffset(row);

    const y1 = this.getRowTop(row) - frozenRowOffset;
    const y2 = y1 + this._options.rowHeight! - 1;
    let x1 = 0;
    for (let i = 0; i < cell; i++) {
      if (!this.columns[i] || this.columns[i].hidden) continue;

      x1 += (this.columns[i].width || 0);

      if (this._options.frozenColumn == i) {
        x1 = 0;
      }
    }
    const x2 = x1 + (this.columns[cell]?.width || 0);

    return {
      top: y1,
      left: x1,
      bottom: y2,
      right: x2
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Cell switching

  /**  Resets active cell. */
  resetActiveCell() {
    this.setActiveCellInternal(null, false);
  }

  /** @alias `setFocus` */
  focus() {
    this.setFocus();
  }

  protected setFocus() {
    if (this.tabbingDirection == -1) {
      this._focusSink.focus();
    } else {
      this._focusSink2.focus();
    }
  }

  /** Scroll to a specific cell and make it into the view */
  scrollCellIntoView(row: number, cell: number, doPaging?: boolean) {
    this.scrollRowIntoView(row, doPaging);

    if (cell <= this._options.frozenColumn!) {
      return;
    }

    const colspan = this.getColspan(row, cell);
    this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
  }

  protected internalScrollColumnIntoView(left: number, right: number) {
    const scrollRight = this.scrollLeft + (Utils.width(this._viewportScrollContainerX) as number) - (this.viewportHasVScroll ? (this.scrollbarDimensions?.width ?? 0) : 0);

    if (left < this.scrollLeft) {
      this._viewportScrollContainerX.scrollLeft = left;
      this.handleScroll();
      this.render();
    } else if (right > scrollRight) {
      this._viewportScrollContainerX.scrollLeft = Math.min(left, right - this._viewportScrollContainerX.clientWidth);
      this.handleScroll();
      this.render();
    }
  }

  /**
   * Scroll to a specific column and show it into the viewport
   * @param {Number} cell - cell column number
   */
  scrollColumnIntoView(cell: number) {
    this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell]);
  }

  protected setActiveCellInternal(newCell: HTMLDivElement | null, opt_editMode?: boolean | null, preClickModeOn?: boolean | null, suppressActiveCellChangedEvent?: boolean, e?: Event | SlickEvent_) {
    if (this.activeCellNode !== null) {
      this.makeActiveCellNormal();
      this.activeCellNode.classList.remove('active');
      this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.remove('active'));
    }

    // let activeCellChanged = (this.activeCellNode !== newCell);
    this.activeCellNode = newCell;

    if (this.activeCellNode != null) {
      const activeCellOffset = Utils.offset(this.activeCellNode);
      let rowOffset = Math.floor(Utils.offset(Utils.parents(this.activeCellNode, '.grid-canvas')[0] as HTMLElement)!.top);
      const isBottom = Utils.parents(this.activeCellNode, '.grid-canvas-bottom').length;

      if (this.hasFrozenRows && isBottom) {
        rowOffset -= (this._options.frozenBottom)
          ? Utils.height(this._canvasTopL) as number
          : this.frozenRowsHeight;
      }

      const cell = this.getCellFromPoint(activeCellOffset!.left, Math.ceil(activeCellOffset!.top) - rowOffset);
      this.activeRow = cell.row;
      this.activeCell = this.activePosX = this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode);

      if (opt_editMode == null && this._options.autoEditNewRow) {
        opt_editMode = (this.activeRow == this.getDataLength()) || this._options.autoEdit;
      }

      if (this._options.showCellSelection) {
        this.activeCellNode.classList.add('active');
        this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.add('active'));
      }

      if (this._options.editable && opt_editMode && this.isCellPotentiallyEditable(this.activeRow, this.activeCell)) {
        clearTimeout(this.h_editorLoader);

        if (this._options.asyncEditorLoading) {
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
    //if (activeCellChanged) {
    if (!suppressActiveCellChangedEvent) {
      this.trigger<OnActiveCellChangedEventArgs | null>(this.onActiveCellChanged, this.getActiveCell() as OnActiveCellChangedEventArgs);
    }
    //}
  }

  protected clearTextSelection() {
    if ((document as any).selection?.empty) {
      try {
        //IE fails here if selected element is not in dom
        (document as any).selection.empty();
      } catch (e) { }
    } else if (window.getSelection) {
      const sel = window.getSelection();
      if (sel?.removeAllRanges) {
        sel.removeAllRanges();
      }
    }
  }

  protected isCellPotentiallyEditable(row: number, cell: number) {
    const dataLength = this.getDataLength();
    // is the data for this row loaded?
    if (row < dataLength && !this.getDataItem(row)) {
      return false;
    }

    // are we in the Add New row? Can we create new from this cell?
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
   * @param {Boolean} [refocusActiveCell]
   */
  protected makeActiveCellNormal(refocusActiveCell = false) {
    if (!this.currentEditor) {
      return;
    }
    this.trigger(this.onBeforeCellEditorDestroy, { editor: this.currentEditor });
    this.currentEditor.destroy();
    this.currentEditor = null;

    if (this.activeCellNode) {
      const d = this.getDataItem(this.activeRow);
      this.activeCellNode.classList.remove('editable');
      this.activeCellNode.classList.remove('invalid');
      if (d) {
        const column = this.columns[this.activeCell];
        const formatter = this.getFormatter(this.activeRow, column);
        const formatterResult = formatter(this.activeRow, this.activeCell, this.getDataItemValueForColumn(d, column), column, d, this as unknown as SlickGridModel);
        this.applyFormatResultToCellNode(formatterResult, this.activeCellNode);
        this.invalidatePostProcessingResults(this.activeRow);
      }
      if (refocusActiveCell) {
        this.setFocus();
      }
    }

    // if there previously was text selected on a page (such as selected text in the edit cell just removed),
    // IE can't set focus to anything else correctly
    if (navigator.userAgent.toLowerCase().match(/msie/)) {
      this.clearTextSelection();
    }

    this.getEditorLock()?.deactivate(this.editController as EditController);
  }


  editActiveCell(editor: Editor, preClickModeOn?: boolean | null, e?: Event) {
    this.makeActiveCellEditable(editor, preClickModeOn, e);
  }

  protected makeActiveCellEditable(editor?: Editor, preClickModeOn?: boolean | null, e?: Event | SlickEvent_) {
    if (!this.activeCellNode) {
      return;
    }
    if (!this._options.editable) {
      throw new Error('SlickGrid makeActiveCellEditable : should never get called when this._options.editable is false');
    }

    // cancel pending async call if there is one
    clearTimeout(this.h_editorLoader);

    if (!this.isCellPotentiallyEditable(this.activeRow, this.activeCell)) {
      return;
    }

    const columnDef = this.columns[this.activeCell];
    const item = this.getDataItem(this.activeRow);

    if (this.trigger(this.onBeforeEditCell, { row: this.activeRow, cell: this.activeCell, item: item, column: columnDef, target: 'grid' }).getReturnValue() === false) {
      this.setFocus();
      return;
    }

    this.getEditorLock()?.activate(this.editController as EditController);
    this.activeCellNode.classList.add('editable');

    const useEditor: any = editor || this.getEditor(this.activeRow, this.activeCell);

    // don't clear the cell if a custom editor is passed through
    if (!editor && !useEditor.suppressClearOnEdit) {
      this.activeCellNode.innerHTML = '';
    }

    let metadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(this.activeRow);
    metadata = metadata?.columns as any;
    const columnMetaData = metadata && (metadata[columnDef.id as keyof ItemMetadata] || (metadata as any)[this.activeCell]);

    this.currentEditor = new useEditor({
      grid: this,
      gridPosition: this.absBox(this._container),
      position: this.absBox(this.activeCellNode),
      container: this.activeCellNode,
      column: columnDef,
      columnMetaData,
      item: item || {},
      event: e,
      commitChanges: this.commitEditAndSetFocus.bind(this),
      cancelChanges: this.cancelEditAndSetFocus.bind(this)
    });

    if (item && this.currentEditor) {
      this.currentEditor.loadValue(item);
      if (preClickModeOn && this.currentEditor?.preClick) {
        this.currentEditor.preClick();
      }
    }

    this.serializedEditorValue = this.currentEditor?.serializeValue();

    if (this.currentEditor?.position) {
      this.handleActiveCellPositionChange();
    }
  }

  protected commitEditAndSetFocus() {
    // if the commit fails, it would do so due to a validation error
    // if so, do not steal the focus from the editor
    if (this.getEditorLock()?.commitCurrentEdit()) {
      this.setFocus();
      if (this._options.autoEdit && !this._options.autoCommitEdit) {
        this.navigateDown();
      }
    }
  }

  protected cancelEditAndSetFocus() {
    if (this.getEditorLock()?.cancelCurrentEdit()) {
      this.setFocus();
    }
  }

  protected absBox(elem: HTMLElement) {
    const box = {
      top: elem.offsetTop,
      left: elem.offsetLeft,
      bottom: 0,
      right: 0,
      width: elem.offsetWidth,
      height: elem.offsetWidth,
      visible: true
    };
    box.bottom = box.top + box.height;
    box.right = box.left + box.width;

    // walk up the tree
    let offsetParent = elem.offsetParent;
    while ((elem = elem.parentNode as HTMLElement) !== document.body) {
      if (!elem || !elem.parentNode) {
        break;
      }

      const styles = getComputedStyle(elem);
      if (box.visible && elem.scrollHeight !== elem.offsetHeight && styles['overflowY'] !== 'visible') {
        box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
      }

      if (box.visible && elem.scrollWidth !== elem.offsetWidth && styles['overflowX'] !== 'visible') {
        box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
      }

      box.left -= elem.scrollLeft;
      box.top -= elem.scrollTop;

      if (elem === offsetParent) {
        box.left += elem.offsetLeft;
        box.top += elem.offsetTop;
        offsetParent = elem.offsetParent;
      }

      box.bottom = box.top + box.height;
      box.right = box.left + box.width;
    }

    return box;
  }

  /** Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. */
  getActiveCellPosition() {
    return this.absBox(this.activeCellNode as HTMLElement);
  }

  /** Get the Grid Position */
  getGridPosition() {
    return this.absBox(this._container);
  }

  protected handleActiveCellPositionChange() {
    if (!this.activeCellNode) {
      return;
    }

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

  /** Returns the active cell editor. If there is no actively edited cell, null is returned.   */
  getCellEditor() {
    return this.currentEditor;
  }

  /**
   * Returns an object representing the coordinates of the currently active cell:
   * @example	`{ row: activeRow, cell: activeCell }`
   */
  getActiveCell() {
    if (!this.activeCellNode) {
      return null;
    }
    return { row: this.activeRow, cell: this.activeCell };
  }

  /** Returns the DOM element containing the currently active cell. If no cell is active, null is returned. */
  getActiveCellNode() {
    return this.activeCellNode;
  }

  //This get/set methods are used for keeping text-selection. These don't consider IE because they don't loose text-selection.
  //Fix for firefox selection. See https://github.com/mleibman/SlickGrid/pull/746/files
  protected getTextSelection() {
    let textSelection: Range | null = null;
    if (window.getSelection) {
      const selection = window.getSelection();
      if ((selection?.rangeCount ?? 0) > 0) {
        textSelection = selection!.getRangeAt(0);
      }
    }
    return textSelection;
  }

  protected setTextSelection(selection: Range) {
    if (window.getSelection && selection) {
      const target = window.getSelection();
      if (target) {
        target.removeAllRanges();
        target.addRange(selection);
      }
    }
  }

  /**
   * Scroll to a specific row and make it into the view
   * @param {Number} row - grid row number
   * @param {Boolean} doPaging - scroll when pagination is enabled
   */
  scrollRowIntoView(row: number, doPaging?: boolean) {
    if (!this.hasFrozenRows ||
      (!this._options.frozenBottom && row > this.actualFrozenRow - 1) ||
      (this._options.frozenBottom && row < this.actualFrozenRow - 1)) {

      const viewportScrollH = Utils.height(this._viewportScrollContainerY) as number;

      // if frozen row on top
      // subtract number of frozen row
      const rowNumber = (this.hasFrozenRows && !this._options.frozenBottom ? row - this._options.frozenRow! : row);

      const rowAtTop = rowNumber * this._options.rowHeight!;
      const rowAtBottom = (rowNumber + 1) * this._options.rowHeight!
        - viewportScrollH
        + (this.viewportHasHScroll ? (this.scrollbarDimensions?.height ?? 0) : 0);

      // need to page down?
      if ((rowNumber + 1) * this._options.rowHeight! > this.scrollTop + viewportScrollH + this.offset) {
        this.scrollTo(doPaging ? rowAtTop : rowAtBottom);
        this.render();
      }
      // or page up?
      else if (rowNumber * this._options.rowHeight! < this.scrollTop + this.offset) {
        this.scrollTo(doPaging ? rowAtBottom : rowAtTop);
        this.render();
      }
    }
  }

  /**
   * Scroll to the top row and make it into the view
   * @param {Number} row - grid row number
   */
  scrollRowToTop(row: number) {
    this.scrollTo(row * this._options.rowHeight!);
    this.render();
  }

  protected scrollPage(dir: number) {
    const deltaRows = dir * this.numVisibleRows;
    /// First fully visible row crosses the line with
    /// y == bottomOfTopmostFullyVisibleRow
    const bottomOfTopmostFullyVisibleRow = this.scrollTop + this._options.rowHeight! - 1;
    this.scrollTo((this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * this._options.rowHeight!);
    this.render();

    if (this._options.enableCellNavigation && this.activeRow != null) {
      let row = this.activeRow + deltaRows;
      const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      if (row >= dataLengthIncludingAddNew) {
        row = dataLengthIncludingAddNew - 1;
      }
      if (row < 0) {
        row = 0;
      }

      let cell = 0;
      let prevCell: number | null = null;
      const prevActivePosX = this.activePosX;
      while (cell <= this.activePosX) {
        if (this.canCellBeActive(row, cell)) {
          prevCell = cell;
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
  }

  /** Navigate (scroll) by a page down */
  navigatePageDown() {
    this.scrollPage(1);
  }

  /** Navigate (scroll) by a page up */
  navigatePageUp() {
    this.scrollPage(-1);
  }

  /** Navigate to the top of the grid */
  navigateTop() {
    this.navigateToRow(0);
  }

  /** Navigate to the bottom of the grid */
  navigateBottom() {
    this.navigateToRow(this.getDataLength() - 1);
  }

  protected navigateToRow(row: number) {
    const num_rows = this.getDataLength();
    if (!num_rows) { return true; }

    if (row < 0) {
      row = 0;
    } else if (row >= num_rows) {
      row = num_rows - 1;
    }

    this.scrollCellIntoView(row, 0, true);
    if (this._options.enableCellNavigation && this.activeRow != null) {
      let cell = 0;
      let prevCell: number | null = null;
      const prevActivePosX = this.activePosX;
      while (cell <= this.activePosX) {
        if (this.canCellBeActive(row, cell)) {
          prevCell = cell;
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
    return true;
  }

  protected getColspan(row: number, cell: number): number {
    const metadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);
    if (!metadata || !metadata.columns) {
      return 1;
    }

    const columnData = metadata.columns[this.columns[cell].id] || metadata.columns[cell];
    let colspan = columnData?.colspan;
    if (colspan === '*') {
      colspan = this.columns.length - cell;
    } else {
      colspan = colspan || 1;
    }

    return colspan as number;
  }

  protected findFirstFocusableCell(row: number) {
    let cell = 0;
    while (cell < this.columns.length) {
      if (this.canCellBeActive(row, cell)) {
        return cell;
      }
      cell += this.getColspan(row, cell);
    }
    return null;
  }

  protected findLastFocusableCell(row: number) {
    let cell = 0;
    let lastFocusableCell: number | null = null;
    while (cell < this.columns.length) {
      if (this.canCellBeActive(row, cell)) {
        lastFocusableCell = cell;
      }
      cell += this.getColspan(row, cell);
    }
    return lastFocusableCell;
  }

  protected gotoRight(row: number, cell: number, _posX?: number) {
    if (cell >= this.columns.length) {
      return null;
    }

    do {
      cell += this.getColspan(row, cell);
    }
    while (cell < this.columns.length && !this.canCellBeActive(row, cell));

    if (cell < this.columns.length) {
      return {
        row,
        cell,
        posX: cell
      };
    }
    return null;
  }

  protected gotoLeft(row: number, cell: number, _posX?: number) {
    if (cell <= 0) {
      return null;
    }

    const firstFocusableCell = this.findFirstFocusableCell(row);
    if (firstFocusableCell === null || firstFocusableCell >= cell) {
      return null;
    }

    let prev = {
      row,
      cell: firstFocusableCell,
      posX: firstFocusableCell
    };
    let pos;
    while (true) {
      pos = this.gotoRight(prev.row, prev.cell, prev.posX);
      if (!pos) {
        return null;
      }
      if (pos.cell >= cell) {
        return prev;
      }
      prev = pos;
    }
  }

  protected gotoDown(row: number, cell: number, posX: number) {
    let prevCell;
    const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
    while (true) {
      if (++row >= dataLengthIncludingAddNew) {
        return null;
      }

      prevCell = cell = 0;
      while (cell <= posX) {
        prevCell = cell;
        cell += this.getColspan(row, cell);
      }

      if (this.canCellBeActive(row, prevCell)) {
        return {
          row,
          cell: prevCell,
          posX
        };
      }
    }
  }

  protected gotoUp(row: number, cell: number, posX: number) {
    let prevCell;
    while (true) {
      if (--row < 0) {
        return null;
      }

      prevCell = cell = 0;
      while (cell <= posX) {
        prevCell = cell;
        cell += this.getColspan(row, cell);
      }

      if (this.canCellBeActive(row, prevCell)) {
        return {
          row,
          cell: prevCell,
          posX
        };
      }
    }
  }

  protected gotoNext(row: number, cell: number, posX?: number) {
    if (row == null && cell == null) {
      row = cell = posX = 0;
      if (this.canCellBeActive(row, cell)) {
        return {
          row,
          cell,
          posX: cell
        };
      }
    }

    const pos = this.gotoRight(row, cell, posX);
    if (pos) {
      return pos;
    }

    let firstFocusableCell: number | null = null;
    const dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();

    // if at last row, cycle through columns rather than get stuck in the last one
    if (row === dataLengthIncludingAddNew - 1) { row--; }

    while (++row < dataLengthIncludingAddNew) {
      firstFocusableCell = this.findFirstFocusableCell(row);
      if (firstFocusableCell !== null) {
        return {
          row,
          cell: firstFocusableCell,
          posX: firstFocusableCell
        };
      }
    }
    return null;
  }

  protected gotoPrev(row: number, cell: number, posX?: number) {
    if (row == null && cell == null) {
      row = this.getDataLengthIncludingAddNew() - 1;
      cell = posX = this.columns.length - 1;
      if (this.canCellBeActive(row, cell)) {
        return {
          row,
          cell,
          posX: cell
        };
      }
    }

    let pos;
    let lastSelectableCell;
    while (!pos) {
      pos = this.gotoLeft(row, cell, posX);
      if (pos) {
        break;
      }
      if (--row < 0) {
        return null;
      }

      cell = 0;
      lastSelectableCell = this.findLastFocusableCell(row);
      if (lastSelectableCell !== null) {
        pos = {
          row,
          cell: lastSelectableCell,
          posX: lastSelectableCell
        };
      }
    }
    return pos;
  }

  protected gotoRowStart(row: number, _cell: number, _posX?: number) {
    const newCell = this.findFirstFocusableCell(row);
    if (newCell === null) return null;

    return {
      row,
      cell: newCell,
      posX: newCell
    };
  }

  protected gotoRowEnd(row: number, _cell: number, _posX?: number) {
    const newCell = this.findLastFocusableCell(row);
    if (newCell === null) return null;

    return {
      row,
      cell: newCell,
      posX: newCell
    };
  }

  /** Switches the active cell one cell right skipping unselectable cells. Unline navigateNext, navigateRight stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateRight() {
    return this.navigate('right');
  }

  /** Switches the active cell one cell left skipping unselectable cells. Unline navigatePrev, navigateLeft stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateLeft() {
    return this.navigate('left');
  }

  /** Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateDown() {
    return this.navigate('down');
  }

  /** Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateUp() {
    return this.navigate('up');
  }

  /** Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigateNext() {
    return this.navigate('next');
  }

  /** Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigatePrev() {
    return this.navigate('prev');
  }

  /** Navigate to the start row in the grid */
  navigateRowStart() {
    return this.navigate('home');
  }

  /** Navigate to the end row in the grid */
  navigateRowEnd() {
    return this.navigate('end');
  }

  /**
   * @param {string} dir Navigation direction.
   * @return {boolean} Whether navigation resulted in a change of active cell.
   */
  protected navigate(dir: 'up' | 'down' | 'left' | 'right' | 'prev' | 'next' | 'home' | 'end') {
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

    const tabbingDirections = {
      'up': -1,
      'down': 1,
      'left': -1,
      'right': 1,
      'prev': -1,
      'next': 1,
      'home': -1,
      'end': 1
    };
    this.tabbingDirection = tabbingDirections[dir];

    const stepFunctions = {
      'up': this.gotoUp,
      'down': this.gotoDown,
      'left': this.gotoLeft,
      'right': this.gotoRight,
      'prev': this.gotoPrev,
      'next': this.gotoNext,
      'home': this.gotoRowStart,
      'end': this.gotoRowEnd
    };
    const stepFn = stepFunctions[dir];
    const pos = stepFn.call(this, this.activeRow, this.activeCell, this.activePosX);
    if (pos) {
      if (this.hasFrozenRows && this._options.frozenBottom && pos.row == this.getDataLength()) {
        return;
      }

      const isAddNewRow = (pos.row == this.getDataLength());

      if ((!this._options.frozenBottom && pos.row >= this.actualFrozenRow)
        || (this._options.frozenBottom && pos.row < this.actualFrozenRow)
      ) {
        this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling);
      }
      this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell));
      this.activePosX = pos.posX;
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
   */
  getCellNode(row: number, cell: number): HTMLDivElement | null {
    if (this.rowsCache[row]) {
      this.ensureCellNodesInRowsCache(row);
      try {
        if (this.rowsCache[row].cellNodesByColumnIdx.length > cell) {
          return this.rowsCache[row].cellNodesByColumnIdx[cell] as HTMLDivElement | null;
        }
        else {
          return null;
        }
      } catch (e) {
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
  setActiveCell(row: number, cell: number, opt_editMode?: boolean, preClickModeOn?: boolean, suppressActiveCellChangedEvent?: boolean) {
    if (!this.initialized) { return; }
    if (row > this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0) {
      return;
    }

    if (!this._options.enableCellNavigation) {
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
  setActiveRow(row: number, cell?: number, suppressScrollIntoView?: boolean) {
    if (!this.initialized) { return; }
    if (row > this.getDataLength() || row < 0 || (cell ?? 0) >= this.columns.length || (cell ?? 0) < 0) {
      return;
    }

    this.activeRow = row;
    if (!suppressScrollIntoView) {
      this.scrollCellIntoView(row, cell || 0, false);
    }
  }

  /**
   * Returns true if you can click on a given cell and make it the active focus.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeActive(row: number, cell: number) {
    if (!this.options.enableCellNavigation || row >= this.getDataLengthIncludingAddNew() ||
      row < 0 || cell >= this.columns.length || cell < 0) {
      return false;
    }

    if (!this.columns[cell] || this.columns[cell].hidden) {
      return false;
    }

    const rowMetadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);
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

    return !!(this.columns[cell].focusable);
  }

  /**
   * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeSelected(row: number, cell: number) {
    if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0) {
      return false;
    }

    if (!this.columns[cell] || this.columns[cell].hidden) {
      return false;
    }

    const rowMetadata = (this.data as CustomDataView<TData>)?.getItemMetadata?.(row);
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
  gotoCell(row: number, cell: number, forceEdit?: boolean, e?: Event | SlickEvent_) {
    if (!this.initialized) { return; }
    if (!this.canCellBeActive(row, cell)) {
      return;
    }

    if (!this.getEditorLock()?.commitCurrentEdit()) {
      return;
    }

    this.scrollCellIntoView(row, cell, false);

    const newCell = this.getCellNode(row, cell);

    // if selecting the 'add new' row, start editing right away
    const column = this.columns[cell];
    const suppressActiveCellChangedEvent = !!(this._options.editable && column?.editor && this._options.suppressActiveCellChangeOnEdit);
    this.setActiveCellInternal(newCell, (forceEdit || (row === this.getDataLength()) || this._options.autoEdit), null, suppressActiveCellChangedEvent, e);

    // if no editor was created, set the focus back on the grid
    if (!this.currentEditor) {
      this.setFocus();
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////
  // IEditor implementation for the editor lock

  protected commitCurrentEdit() {
    const self = this as SlickGrid<TData, C, O>;
    const item = self.getDataItem(self.activeRow);
    const column = self.columns[self.activeCell];

    if (self.currentEditor) {
      if (self.currentEditor.isValueChanged()) {
        const validationResults = self.currentEditor.validate();

        if (validationResults.valid) {
          const row = self.activeRow;
          const cell = self.activeCell;
          const editor = self.currentEditor;
          const serializedValue = self.currentEditor.serializeValue();
          const prevSerializedValue = self.serializedEditorValue;

          if (self.activeRow < self.getDataLength()) {
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
                self.trigger(self.onCellChange, { command: 'undo', row, cell, item, column, });
              }
            };

            if (self.options.editCommandHandler) {
              self.makeActiveCellNormal(true);
              self.options.editCommandHandler(item, column, editCommand);
            } else {
              editCommand.execute();
              self.makeActiveCellNormal(true);
            }

          } else {
            const newItem = {};
            self.currentEditor.applyValue(newItem, self.currentEditor.serializeValue());
            self.makeActiveCellNormal(true);
            self.trigger(self.onAddNewRow, { item: newItem, column });
          }

          // check whether the lock has been re-acquired by event handlers
          return !self.getEditorLock()?.isActive();
        } else {
          // Re-add the CSS class to trigger transitions, if any.
          if (self.activeCellNode) {
            self.activeCellNode.classList.remove('invalid');
            Utils.width(self.activeCellNode);// force layout
            self.activeCellNode.classList.add('invalid');
          }

          self.trigger(self.onValidationError, {
            editor: self.currentEditor,
            cellNode: self.activeCellNode,
            validationResults: validationResults,
            row: self.activeRow,
            cell: self.activeCell,
            column
          });

          self.currentEditor.focus();
          return false;
        }
      }

      self.makeActiveCellNormal(true);
    }
    return true;
  }

  protected cancelCurrentEdit() {
    this.makeActiveCellNormal();
    return true;
  }

  protected rowsToRanges(rows: number[]) {
    const ranges: SlickRange_[] = [];
    const lastCell = this.columns.length - 1;
    for (let i = 0; i < rows.length; i++) {
      ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
    }
    return ranges;
  }

  /** Returns an array of row indices corresponding to the currently selected rows. */
  getSelectedRows() {
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
  setSelectedRows(rows: number[], caller?: string) {
    if (!this.selectionModel) {
      throw new Error('SlickGrid Selection model is not set');
    }
    if (this && this.getEditorLock && !this.getEditorLock()?.isActive()) {
      this.selectionModel.setSelectedRanges(this.rowsToRanges(rows), caller || 'SlickGrid.setSelectedRows');
    }
  }

  /** html sanitizer to avoid scripting attack */
  sanitizeHtmlString(dirtyHtml: string, suppressLogging?: boolean) {
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
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Grid: SlickGrid,
  });
}
