/**
 * @license
 * (c) 2009-2016 Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v3.0.4
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */

import {
  BindingEventService as BindingEventService_,
  ColAutosizeMode as ColAutosizeMode_,
  Event as SlickEvent_,
  EventData as EventData_,
  GlobalEditorLock as GlobalEditorLock_,
  GridAutosizeColsMode as GridAutosizeColsMode_,
  Group as Group_,
  GroupTotals as GroupTotals_,
  keyCode as keyCode_,
  preClickClassName as preClickClassName_,
  Range as SlickRange_,
  RowSelectionMode as RowSelectionMode_,
  ValueFilterMode as ValueFilterMode_,
  TreeColumns as TreeColumns_,
  Utils as Utils_,
  WidthEvalMode as WidthEvalMode_,
} from './slick.core';
import { Draggable as Draggable_, MouseWheel as MouseWheel_, Resizable as Resizable_ } from './slick.interactions';

// for (iife) load Slick methods from global Slick object, or use imports for (cjs/esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const ColAutosizeMode = IIFE_ONLY ? Slick.ColAutosizeMode : ColAutosizeMode_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const EventData = IIFE_ONLY ? Slick.EventData : EventData_;
const GlobalEditorLock = IIFE_ONLY ? Slick.GlobalEditorLock : GlobalEditorLock_;
const GridAutosizeColsMode = IIFE_ONLY ? Slick.GridAutosizeColsMode : GridAutosizeColsMode_;
const Group = IIFE_ONLY ? Slick.Group : Group_;
const GroupTotals = IIFE_ONLY ? Slick.GroupTotals : GroupTotals_;
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const preClickClassName = IIFE_ONLY ? Slick.preClickClassName : preClickClassName_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const RowSelectionMode = IIFE_ONLY ? Slick.RowSelectionMode : RowSelectionMode_;
const ValueFilterMode = IIFE_ONLY ? Slick.ValueFilterMode : ValueFilterMode_;
const TreeColumns = IIFE_ONLY ? Slick.TreeColumns : TreeColumns_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const WidthEvalMode = IIFE_ONLY ? Slick.WidthEvalMode : WidthEvalMode_;
const Draggable = IIFE_ONLY ? Slick.Draggable : Draggable_;
const MouseWheel = IIFE_ONLY ? Slick.MouseWheel : MouseWheel_;
const Resizable = IIFE_ONLY ? Slick.Resizable : Resizable_;

// shared across all grids on the page
  var scrollbarDimensions;
  var maxSupportedCssHeight;  // browser's breaking point

  //////////////////////////////////////////////////////////////////////////////////////////////
  // SlickGrid class implementation (available as Slick.Grid)

  /**
   * Creates a new instance of the grid.
   * @class SlickGrid
   * @constructor
   * @param {Node}              container   Container node to create the grid in.
   * @param {Array,Object}      data        An array of objects for databinding.
   * @param {Array}             columns     An array of column definitions.
   * @param {Object}            options     Grid options.
   **/
export function SlickGrid(container, data, columns, options) {
    // settings
    var defaults = {
      alwaysShowVerticalScroll: false,
      alwaysAllowHorizontalScroll: false,
      explicitInitialization: false,
      rowHeight: 25,
      defaultColumnWidth: 80,
      enableAddRow: false,
      leaveSpaceForNewRows: false,
      editable: false,
      autoEdit: true,
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
      auto
        : false,
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
      cellFlashingCssClass: "flashing",
      selectedCellCssClass: "selected",
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
      defaultFormatter: defaultFormatter,
      forceSyncScrolling: false,
      addNewRowCssClass: "new-row",
      preserveCopiedSelectionOnPaste: false,
      showCellSelection: true,
      viewportClass: null,
      minRowBuffer: 3,
      emulatePagingWhenScrolling: true, // when scrolling off bottom of viewport, place new row at top of viewport
      editorCellNavOnLRKeys: false,
      enableMouseWheelScrollHandler: true,
      doPaging: true,
      autosizeColsMode: GridAutosizeColsMode.LegacyOff,
      autosizeColPaddingPx: 4,
      autosizeTextAvgToMWidthRatio: 0.75,
      viewportSwitchToScrollModeWidthPercent: undefined,
      viewportMinWidthPx: undefined,
      viewportMaxWidthPx: undefined,
      suppressCssChangesOnHiddenInit: false,
      scrollDebounceDelay: -1, // add a scroll delay to avoid screen flickering, -1 to disable delay
      ffMaxSupportedCssHeight: 6000000,
      maxSupportedCssHeight: 1000000000,
      sanitizer: undefined,  // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
      logSanitizedHtml: false // log to console when sanitised - recommend true for testing of dev and production
    };

    var columnDefaults = {
      name: "",
      resizable: true,
      sortable: false,
      minWidth: 30,
      maxWidth: undefined,
      rerenderOnResize: false,
      headerCssClass: null,
      defaultSortAsc: true,
      focusable: true,
      selectable: true,
    };

    var columnAutosizeDefaults = {
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
    var th;   // virtual height
    var h;    // real scrollable height
    var ph;   // page height
    var n;    // number of pages
    var cj;   // "jumpiness" coefficient

    var page = 0;       // current page
    var offset = 0;     // current page offset
    var vScrollDir = 1;

    // private
  const show = Utils.show;
  const hide = Utils.hide;

  var _bindingEventService = new BindingEventService();
    var initialized = false;
    var _container;
    var uid = "slickgrid_" + Math.round(1000000 * Math.random());
    var self = this;
    var _focusSink, _focusSink2;
    var _groupHeaders = [];
    var _headerScroller = [];
    var _headers = [];
    var _headerRows, _headerRowScroller, _headerRowSpacerL, _headerRowSpacerR;
    var _footerRow, _footerRowScroller, _footerRowSpacerL, _footerRowSpacerR;
    var _preHeaderPanel, _preHeaderPanelScroller, _preHeaderPanelSpacer;
    var _preHeaderPanelR, _preHeaderPanelScrollerR, _preHeaderPanelSpacerR;
    var _topPanelScrollers;
    var _topPanels;
    var _viewport;
    var _canvas;
    var _style;
    var _boundAncestors = [];
    var treeColumns;
    var stylesheet, columnCssRulesL, columnCssRulesR;
    var viewportH, viewportW;
    var canvasWidth, canvasWidthL, canvasWidthR;
    var headersWidth, headersWidthL, headersWidthR;
    var viewportHasHScroll, viewportHasVScroll;
    var headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, // border+padding
        cellWidthDiff = 0, cellHeightDiff = 0;
    var absoluteColumnMinWidth;
    var hasFrozenRows = false;
    var frozenRowsHeight = 0;
    var actualFrozenRow = -1;
    var paneTopH = 0;
    var paneBottomH = 0;
    var viewportTopH = 0;
    var viewportBottomH = 0;
    var topPanelH = 0;
    var headerRowH = 0;
    var footerRowH = 0;

    var tabbingDirection = 1;
    var _activeCanvasNode;
    var _activeViewportNode;
    var activePosX;
    var activeRow, activeCell;
    var activeCellNode = null;
    var currentEditor = null;
    var serializedEditorValue;
    var editController;

    var rowsCache = {};
    var renderedRows = 0;
    var numVisibleRows = 0;
    var prevScrollTop = 0;
    var scrollTop = 0;
    var lastRenderedScrollTop = 0;
    var lastRenderedScrollLeft = 0;
    var prevScrollLeft = 0;
    var scrollLeft = 0;

    var selectionModel;
    var selectedRows = [];

    var plugins = [];
    var cellCssClasses = {};

    var columnsById = {};
    var sortColumns = [];
    var columnPosLeft = [];
    var columnPosRight = [];

    var pagingActive = false;
    var pagingIsLastPage = false;

    var scrollThrottle = ActionThrottle(render, 50);

    // async call handles
    var h_editorLoader = null;
    var h_render = null;
    var h_postrender = null;
    var h_postrenderCleanup = null;
    var postProcessedRows = {};
    var postProcessToRow = null;
    var postProcessFromRow = null;
    var postProcessedCleanupQueue = [];
    var postProcessgroupId = 0;

    // perf counters
    var counter_rows_rendered = 0;
    var counter_rows_removed = 0;

    var _paneHeaderL;
    var _paneHeaderR;
    var _paneTopL;
    var _paneTopR;
    var _paneBottomL;
    var _paneBottomR;

    var _headerScrollerL;
    var _headerScrollerR;

    var _headerL;
    var _headerR;

    var _groupHeadersL;
    var _groupHeadersR;

    var _headerRowScrollerL;
    var _headerRowScrollerR;

    var _footerRowScrollerL;
    var _footerRowScrollerR;

    var _headerRowL;
    var _headerRowR;

    var _footerRowL;
    var _footerRowR;

    var _topPanelScrollerL;
    var _topPanelScrollerR;

    var _topPanelL;
    var _topPanelR;

    var _viewportTopL;
    var _viewportTopR;
    var _viewportBottomL;
    var _viewportBottomR;

    var _canvasTopL;
    var _canvasTopR;
    var _canvasBottomL;
    var _canvasBottomR;

    var _viewportScrollContainerX;
    var _viewportScrollContainerY;
    var _headerScrollContainer;
    var _headerRowScrollContainer;
    var _footerRowScrollContainer;

    // store css attributes if display:none is active in container or parent
    var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
    var _hiddenParents;
    var oldProps = [];
    var columnResizeDragging = false;
    var slickDraggableInstance = null;
    var slickMouseWheelInstances = [];
    var slickResizableInstances = [];
    var sortableSideLeftInstance;
    var sortableSideRightInstance;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization

    function init() {
      if (typeof container === "string") {
        _container = document.querySelector(container);
      } else {
        _container = container;
      }

      if (!_container) {
        throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
      }

      // calculate these only once and share between grid instances
      maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
      options = Utils.extend(true, {}, defaults, options);
      validateAndEnforceOptions();
      columnDefaults.width = options.defaultColumnWidth;

      if (!options.suppressCssChangesOnHiddenInit) { cacheCssForHiddenInit(); }

      treeColumns = new TreeColumns(columns);
      columns = treeColumns.extractColumns();

      updateColumnProps();

      // validate loaded JavaScript modules against requested options
      if (options.enableColumnReorder && (!Sortable || !Sortable.create)) {
        throw new Error("SlickGrid requires Sortable.js module to be loaded");
      }

      editController = {
        "commitCurrentEdit": commitCurrentEdit,
        "cancelCurrentEdit": cancelCurrentEdit
      };

      _container.replaceChildren();
      _container.style.overflow = "hidden";
      _container.style.outline = 0;
      _container.classList.add(uid);
      _container.classList.add("ui-widget");

      const containerStyles = window.getComputedStyle(_container);
      if (!(/relative|absolute|fixed/).test(containerStyles.position)) {
        _container.style.position = "relative";
      }

      _focusSink = Utils.createDomElement('div', { tabIndex: 0, style: { position: 'fixed', width: '0px', height: '0px', top: '0px', left: '0px', outline: '0px' } }, _container);

      // Containers used for scrolling frozen columns and rows
      _paneHeaderL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-left', tabIndex: 0 }, _container);
      _paneHeaderR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-right', tabIndex: 0 }, _container);
      _paneTopL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-left', tabIndex: 0 }, _container);
      _paneTopR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-right', tabIndex: 0 }, _container);
      _paneBottomL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-left', tabIndex: 0 }, _container);
      _paneBottomR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-right', tabIndex: 0 }, _container);

      if (options.createPreHeaderPanel) {
        _preHeaderPanelScroller = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default', style: { overflow: 'hidden', position: 'relative' } }, _paneHeaderL);
        _preHeaderPanelScroller.appendChild(document.createElement('div'));
        _preHeaderPanel = Utils.createDomElement('div', null, _preHeaderPanelScroller);
        _preHeaderPanelSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _preHeaderPanelScroller);

        _preHeaderPanelScrollerR = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default', style: { overflow: 'hidden', position: 'relative' } }, _paneHeaderR);
        _preHeaderPanelR = Utils.createDomElement('div', null, _preHeaderPanelScrollerR);
        _preHeaderPanelSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _preHeaderPanelScrollerR);

        if (!options.showPreHeaderPanel) {
          hide(_preHeaderPanelScroller);
          hide(_preHeaderPanelScrollerR);
        }
      }

      // Append the header scroller containers
      _headerScrollerL = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-header-left' }, _paneHeaderL);
      _headerScrollerR = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-header-right' }, _paneHeaderR);

      // Cache the header scroller containers
      _headerScroller.push(_headerScrollerL);
      _headerScroller.push(_headerScrollerR);

      if (treeColumns.hasDepth()) {
        _groupHeadersL = [];
        _groupHeadersR = [];
        for (var index = 0; index < treeColumns.getDepth() - 1; index++) {
          _groupHeadersL[index] = Utils.createDomElement('div', { className: 'slick-group-header-columns slick-group-header-columns-left', style: { left: '-1000px' } }, _headerScrollerL);
          _groupHeadersR[index] = Utils.createDomElement('div', { className: 'slick-group-header-columns slick-group-header-columns-right', style: { left: '-1000px' } }, _headerScrollerR);
        }
        _groupHeaders = [_groupHeadersL, _groupHeadersR];
      }

      // Append the columnn containers to the headers
      _headerL = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-left', style: { left: '-1000px' } }, _headerScrollerL);
      _headerR = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-right', style: { left: '-1000px' } }, _headerScrollerR);

      // Cache the header columns
      _headers = [_headerL, _headerR];

      _headerRowScrollerL = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default' }, _paneTopL);
      _headerRowScrollerR = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default' }, _paneTopR);

      _headerRowScroller = [_headerRowScrollerL, _headerRowScrollerR];

      _headerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _headerRowScrollerL);
      _headerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _headerRowScrollerR);

      _headerRowL = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-left' }, _headerRowScrollerL);
      _headerRowR = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-right' }, _headerRowScrollerR);

      _headerRows = [_headerRowL, _headerRowR];

      // Append the top panel scroller
      _topPanelScrollerL = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default' }, _paneTopL);
      _topPanelScrollerR = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default' }, _paneTopR);

      _topPanelScrollers = [_topPanelScrollerL, _topPanelScrollerR];

      // Append the top panel
      _topPanelL = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, _topPanelScrollerL);
      _topPanelR = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, _topPanelScrollerR);

      _topPanels = [_topPanelL, _topPanelR];

      if (!options.showColumnHeader) {
        _headerScroller.forEach(function (el) {
          hide(el);
        });
      }

      if (!options.showTopPanel) {
        _topPanelScrollers.forEach(function (scroller) {
          hide(scroller);
        })
      }

      if (!options.showHeaderRow) {
        _headerRowScroller.forEach(function (scroller) {
          hide(scroller);
        })
      }

      // Append the viewport containers
      _viewportTopL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-left', tabIndex: 0 }, _paneTopL);
      _viewportTopR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-right', tabIndex: 0 }, _paneTopR);
      _viewportBottomL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-left', tabIndex: 0 }, _paneBottomL);
      _viewportBottomR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-right', tabIndex: 0 }, _paneBottomR);

      // Cache the viewports
      _viewport = [_viewportTopL, _viewportTopR, _viewportBottomL, _viewportBottomR];
      if (options.viewportClass) {
        _viewport.forEach(function (view) {
          view.classList.add(options.viewportClass);
        });
      }

      // Default the active viewport to the top left
      _activeViewportNode = _viewportTopL;

      // Append the canvas containers
      _canvasTopL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-left', tabIndex: 0 }, _viewportTopL);
      _canvasTopR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-right', tabIndex: 0 }, _viewportTopR);
      _canvasBottomL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-left', tabIndex: 0 }, _viewportBottomL);
      _canvasBottomR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-right', tabIndex: 0 }, _viewportBottomR);

      // Cache the canvases
      _canvas = [_canvasTopL, _canvasTopR, _canvasBottomL, _canvasBottomR];

      scrollbarDimensions = scrollbarDimensions || measureScrollbar();

      // Default the active canvas to the top left
      _activeCanvasNode = _canvasTopL;

      // pre-header
      if (_preHeaderPanelSpacer) {
        Utils.width(_preHeaderPanelSpacer, getCanvasWidth() + scrollbarDimensions.width);
      }

      _headers.forEach(function (el) {
        Utils.width(el, getHeadersWidth());
      })

      Utils.width(_headerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width);
      Utils.width(_headerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width);

      // footer Row
      if (options.createFooterRow) {
        _footerRowScrollerR = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default' }, _paneTopR);
        _footerRowScrollerL = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default' }, _paneTopL);

        _footerRowScroller = [_footerRowScrollerL, _footerRowScrollerR];

        _footerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _footerRowScrollerL);
        Utils.width(_footerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width);
        _footerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, _footerRowScrollerR);
        Utils.width(_footerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width);


        _footerRowL = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-left' }, _footerRowScrollerL);
        _footerRowR = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-right' }, _footerRowScrollerR);

        _footerRow = [_footerRowL, _footerRowR];

        if (!options.showFooterRow) {
          _footerRowScroller.forEach(function (scroller) {
            hide(scroller);
          });
        }
      }

      _focusSink2 = _focusSink.cloneNode(true);
      _container.append(_focusSink2);

      if (!options.explicitInitialization) {
        finishInitialization();
      }
    }

    function finishInitialization() {
      if (!initialized) {
        initialized = true;

        getViewportWidth();
        getViewportHeight();

        // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
        // calculate the diff so we can set consistent sizes
        measureCellPaddingAndBorder();

        // for usability reasons, all text selection in SlickGrid is disabled
        // with the exception of input and textarea elements (selection must
        // be enabled there so that editors work as expected); note that
        // selection in grid cells (grid body) is already unavailable in
        // all browsers except IE
        disableSelection(_headers); // disable all text selection in header (including input and textarea)

        if (!options.enableTextSelectionOnCells) {
          // disable text selection in grid cells except in input and textarea elements
          // (this is IE-specific, because selectstart event will only fire in IE)
          _viewport.forEach(function (view) {
            _bindingEventService.bind(view, "selectstart.ui", function (event) {
              if(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
              {
                return;
              }
            });
          })
        }

        setFrozenOptions();
        setPaneVisibility();
        setScroller();
        setOverflow();

        updateColumnCaches();
        createColumnHeaders();
        createColumnGroupHeaders();
        createColumnFooter();
        setupColumnSort();
        createCssRules();
        resizeCanvas();
        bindAncestorScrollEvents();

        _bindingEventService.bind(_container, "resize.slickgrid", resizeCanvas);
        _viewport.forEach(function (view) {
          _bindingEventService.bind(view, "scroll", handleScroll);
        });

        if (options.enableMouseWheelScrollHandler) {
          _viewport.forEach(function (view) {
            slickMouseWheelInstances.push(MouseWheel({
              element: view,
              onMouseWheel: handleMouseWheel
            }));
          });
        }

        _headerScroller.forEach(function (el) {
          _bindingEventService.bind(el, "contextmenu", handleHeaderContextMenu);
          _bindingEventService.bind(el, "click", handleHeaderClick);
        });

        _headerRowScroller.forEach(function (scroller) {
          _bindingEventService.bind(scroller, "scroll", handleHeaderRowScroll);
        });

        if (options.createFooterRow) {
          _footerRow.forEach(function (footer) {
            _bindingEventService.bind(footer, "contextmenu", handleFooterContextMenu)
            _bindingEventService.bind(footer, "click", handleFooterClick);
          });

          _footerRowScroller.forEach(function (scroller) {
            _bindingEventService.bind(scroller, "scroll", handleFooterRowScroll);
          });
        }

        if (options.createPreHeaderPanel) {
          _bindingEventService.bind(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll);
        }

        _bindingEventService.bind(_focusSink, "keydown", handleKeyDown);
        _bindingEventService.bind(_focusSink2, "keydown", handleKeyDown);

        _canvas.forEach(function (element) {
          _bindingEventService.bind(element, "keydown", handleKeyDown);
          _bindingEventService.bind(element, "click", handleClick);
          _bindingEventService.bind(element, "dblclick", handleDblClick);
          _bindingEventService.bind(element, "contextmenu", handleContextMenu);
          _bindingEventService.bind(element, "mouseover", handleCellMouseOver);
          _bindingEventService.bind(element, "mouseout", handleCellMouseOut);
        });

        if (Draggable) {
          slickDraggableInstance = Draggable({
            containerElement: _container,
            allowDragFrom: 'div.slick-cell',
            onDragInit: handleDragInit,
            onDragStart: handleDragStart,
            onDrag: handleDrag,
            onDragEnd: handleDragEnd
          });
        }

        if (!options.suppressCssChangesOnHiddenInit) {
          restoreCssFromHiddenInit();
        }
      }
    }

    function cacheCssForHiddenInit() {
      // handle display:none on container or container parents
      _hiddenParents = Utils.parents(_container, ":hidden");
      for (const el of _hiddenParents) {
        var old = {};
        for ( const name in cssShow ) {
          old[ name ] = el.style[ name ];
          el.style[ name ] = cssShow[ name ];
        }
        oldProps.push(old);
      }
    }

    function restoreCssFromHiddenInit() {
      // finish handle display:none on container or container parents
      // - put values back the way they were
      let i = 0;
      for (const el of _hiddenParents) {
        var old = oldProps[i++];
        for (const name in cssShow) {
          el.style[name] = old[name];
        }
      }
    }

    function hasFrozenColumns() {
      return options.frozenColumn > -1;
    }

    function registerPlugin(plugin) {
      plugins.unshift(plugin);
      plugin.init(self);
    }

    function unregisterPlugin(plugin) {
      for (var i = plugins.length; i >= 0; i--) {
        if (plugins[i] === plugin) {
          if (plugins[i].destroy) {
            plugins[i].destroy();
          }
          plugins.splice(i, 1);
          break;
        }
      }
    }

    function getPluginByName(name) {
      for (var i = plugins.length-1; i >= 0; i--) {
        if (plugins[i].pluginName === name) {
          return plugins[i];
        }
      }
      return undefined;
    }

    function setSelectionModel(model) {
      if (selectionModel) {
        selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
        if (selectionModel.destroy) {
          selectionModel.destroy();
        }
      }

      selectionModel = model;
      if (selectionModel) {
        selectionModel.init(self);
        selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
      }
    }

    function getSelectionModel() {
      return selectionModel;
    }

    function getCanvasNode(columnIdOrIdx, rowIndex) {
      return _getContainerElement(getCanvases(), columnIdOrIdx, rowIndex);
    }

    function getActiveCanvasNode(e) {

      if (e === undefined) {
        return _activeCanvasNode;
      }

      if (e instanceof EventData) {
        e = e.getNativeEvent();
      }

      _activeCanvasNode = e.target.closest('.grid-canvas');
      return _activeCanvasNode;
    }

    function getCanvases() {
      return _canvas;
    }

    function getViewportNode(columnIdOrIdx, rowIndex) {
      return _getContainerElement(getViewports(), columnIdOrIdx, rowIndex);
    }

    function getViewports() {
      return _viewport;
    }

    function getActiveViewportNode(e) {
      setActiveViewportNode(e);

      return _activeViewportNode;
    }

    function setActiveViewportNode(e) {
      if (e instanceof EventData) {
        e = e.getNativeEvent();
      }
      _activeViewportNode = e.target.closest('.slick-viewport');
      return _activeViewportNode;
    }

    function _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
      if (!targetContainers) { return }
      if (!columnIdOrIdx) { columnIdOrIdx = 0; }
      if (!rowIndex) { rowIndex = 0; }

      var idx = (typeof columnIdOrIdx === "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx));

      var isBottomSide = hasFrozenRows && rowIndex >= actualFrozenRow + (options.frozenBottom ? 0 : 1);
      var isRightSide = hasFrozenColumns() && idx > options.frozenColumn;

      return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
    }

    function measureScrollbar() {
      var outerdiv = Utils.createDomElement('div', { className: _viewport.className, style: { position: 'absolute', top: '-10000px', left: '-10000px', overflow: 'auto', width: '100px', height: '100px' } }, document.body);
      var innerdiv = Utils.createDomElement('div', { style: { width: '200px', height: '200px', overflow: 'auto' } }, outerdiv);
      var dim = {
        width: outerdiv.offsetWidth - outerdiv.clientWidth,
        height: outerdiv.offsetHeight - outerdiv.clientHeight
      };
      innerdiv.remove();
      outerdiv.remove();
      return dim;
    }

    function getHeadersWidth() {
      headersWidth = headersWidthL = headersWidthR = 0;
      var includeScrollbar = !options.autoHeight;

      for (var i = 0, ii = columns.length; i < ii; i++) {
        var width = columns[ i ].width;

        if (( options.frozenColumn ) > -1 && ( i > options.frozenColumn )) {
          headersWidthR += width;
        } else {
          headersWidthL += width;
        }
      }

      if (includeScrollbar) {
        if (( options.frozenColumn ) > -1 && ( i > options.frozenColumn )) {
          headersWidthR += scrollbarDimensions.width;
        } else {
          headersWidthL += scrollbarDimensions.width;
        }
      }

      if (hasFrozenColumns()) {
        headersWidthL = headersWidthL + 1000;

        headersWidthR = Math.max(headersWidthR, viewportW) + headersWidthL;
        headersWidthR += scrollbarDimensions.width;
      } else {
        headersWidthL += scrollbarDimensions.width;
        headersWidthL = Math.max(headersWidthL, viewportW) + 1000;
      }

      headersWidth = headersWidthL + headersWidthR;
      return Math.max(headersWidth, viewportW) + 1000;
    }

    function getHeadersWidthL() {
      headersWidthL =0;

      columns.forEach(function(column, i) {
        if (!((options.frozenColumn) > -1 && (i > options.frozenColumn))) {
          headersWidthL += column.width;
        }
      });

      if (hasFrozenColumns()) {
        headersWidthL += 1000;
      } else {
        headersWidthL += scrollbarDimensions.width;
        headersWidthL = Math.max(headersWidthL, viewportW) + 1000;
      }

      return headersWidthL;
    }

    function getHeadersWidthR() {
      headersWidthR =0;

      columns.forEach(function(column, i) {
        if ((options.frozenColumn) > -1 && (i > options.frozenColumn)) {
          headersWidthR += column.width;
        }
      });

      if (hasFrozenColumns()) {
        headersWidthR = Math.max(headersWidthR, viewportW) + getHeadersWidthL();
        headersWidthR += scrollbarDimensions.width;
      }

      return headersWidthR;
    }

    function getCanvasWidth() {
      var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
      var i = columns.length;

      canvasWidthL = canvasWidthR = 0;

      while (i--) {
        if (hasFrozenColumns() && (i > options.frozenColumn)) {
          canvasWidthR += columns[i].width;
        } else {
          canvasWidthL += columns[i].width;
        }
      }
      var totalRowWidth = canvasWidthL + canvasWidthR;
      if (options.fullWidthRows) {
        var extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
        if (extraWidth > 0) {
          totalRowWidth += extraWidth;
          if (hasFrozenColumns()) {
            canvasWidthR += extraWidth;
          } else {
            canvasWidthL += extraWidth;
          }
        }
      }
      return totalRowWidth;
    }

    function updateCanvasWidth(forceColumnWidthsUpdate) {
      var oldCanvasWidth = canvasWidth;
      var oldCanvasWidthL = canvasWidthL;
      var oldCanvasWidthR = canvasWidthR;
      var widthChanged;
      canvasWidth = getCanvasWidth();

      widthChanged = canvasWidth !== oldCanvasWidth || canvasWidthL !== oldCanvasWidthL || canvasWidthR !== oldCanvasWidthR;

      if (widthChanged || hasFrozenColumns() || hasFrozenRows) {
        Utils.width(_canvasTopL, canvasWidthL);

        getHeadersWidth();

        Utils.width(_headerL, headersWidthL);
        Utils.width(_headerR, headersWidthR);

        if (hasFrozenColumns()) {
          const cWidth = Utils.width(_container) || 0;
          if (cWidth > 0 && canvasWidthL > cWidth) {
            throw new Error('[SlickGrid] Frozen columns cannot be wider than the actual grid container width. '
              + 'Make sure to have less columns freezed or make your grid container wider');
          }
          Utils.width(_canvasTopR, canvasWidthR);

          Utils.width(_paneHeaderL, canvasWidthL);
          Utils.setStyleSize(_paneHeaderR, 'left', canvasWidthL);
          Utils.setStyleSize(_paneHeaderR, 'width', viewportW - canvasWidthL);

          Utils.width(_paneTopL, canvasWidthL);
          Utils.setStyleSize(_paneTopR, 'left', canvasWidthL);
          Utils.width(_paneTopR, viewportW - canvasWidthL);

          Utils.width(_headerRowScrollerL, canvasWidthL);
          Utils.width(_headerRowScrollerR, viewportW - canvasWidthL);

          Utils.width(_headerRowL, canvasWidthL);
          Utils.width(_headerRowR, canvasWidthR);

          if (options.createFooterRow) {
            Utils.width(_footerRowScrollerL, canvasWidthL);
            Utils.width(_footerRowScrollerR, viewportW - canvasWidthL);

            Utils.width(_footerRowL, canvasWidthL);
            Utils.width(_footerRowR, canvasWidthR);
          }
          if (options.createPreHeaderPanel) {
            Utils.width(_preHeaderPanel, canvasWidth);
          }
          Utils.width(_viewportTopL, canvasWidthL);
          Utils.width(_viewportTopR, viewportW - canvasWidthL);

          if (hasFrozenRows) {
            Utils.width(_paneBottomL, canvasWidthL);
            Utils.setStyleSize(_paneBottomR, "left", canvasWidthL);

            Utils.width(_viewportBottomL, canvasWidthL);
            Utils.width(_viewportBottomR, viewportW - canvasWidthL);

            Utils.width(_canvasBottomL, canvasWidthL);
            Utils.width(_canvasBottomR, canvasWidthR);
          }
        } else {
          Utils.width(_paneHeaderL, '100%');
          Utils.width(_paneTopL, '100%');
          Utils.width(_headerRowScrollerL, '100%');
          Utils.width(_headerRowL, canvasWidth);

          if (options.createFooterRow) {
            Utils.width(_footerRowScrollerL, '100%');
            Utils.width(_footerRowL, canvasWidth);
          }

          if (options.createPreHeaderPanel) {
            Utils.width(_preHeaderPanel, canvasWidth);
          }
          Utils.width(_viewportTopL, '100%');

          if (hasFrozenRows) {
            Utils.width(_viewportBottomL, '100%');
            Utils.width(_canvasBottomL, canvasWidthL);
          }
        }
      }

      viewportHasHScroll = (canvasWidth >= viewportW - scrollbarDimensions.width);

      Utils.width(_headerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
      Utils.width(_headerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));

      if (options.createFooterRow) {
        Utils.width(_footerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
        Utils.width(_footerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
      }

      if (widthChanged || forceColumnWidthsUpdate) {
        applyColumnWidths();
      }
    }

    function disableSelection(target) {
      target.forEach(function (el) {
        el.setAttribute("unselectable", "on")
        el.style.MozUserSelect = "none";
        _bindingEventService.bind(el, "selectstart.ui", function () {
          return false;
        });
      });
    }

    function getMaxSupportedCssHeight() {
      let supportedHeight = 1000000;
      // FF reports the height back but still renders blank after ~6M px
      //var testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
      const testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? options.ffMaxSupportedCssHeight : options.maxSupportedCssHeight;
      const div = Utils.createDomElement('div', { style: { display: 'hidden' } }, document.body);

      while (true) {
        const test = supportedHeight * 2;
        Utils.height(div, test);
        const height = Utils.height(div);

        if (test > testUpTo || height !== test) {
          break;
        } else {
          supportedHeight = test;
        }
      }

      div.remove();
      return supportedHeight;
    }

    function getUID() {
      return uid;
    }

    function getHeaderColumnWidthDiff() {
      return headerColumnWidthDiff;
    }

    function getScrollbarDimensions() {
      return scrollbarDimensions;
    }

    function getDisplayedScrollbarDimensions() {
      return {
        width: viewportHasVScroll ? scrollbarDimensions.width : 0,
        height: viewportHasHScroll ? scrollbarDimensions.height : 0
      };
    }

    function getAbsoluteColumnMinWidth() {
      return absoluteColumnMinWidth;
    }

    // TODO:  this is static.  need to handle page mutation.
    function bindAncestorScrollEvents() {
      var elem = (hasFrozenRows && !options.frozenBottom) ? _canvasBottomL : _canvasTopL;
      while ((elem = elem.parentNode) != document.body && elem != null) {
        // bind to scroll containers only
        if (elem == _viewportTopL || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) {
          _boundAncestors.push(elem);
          _bindingEventService.bind(elem, "scroll." + uid, handleActiveCellPositionChange);
        }
      }
    }

    function unbindAncestorScrollEvents() {
      _boundAncestors.forEach(function (ancestor) {
        _bindingEventService.unbindByEventName(ancestor, "scroll." + uid);
      });
      _boundAncestors = [];
    }

    function updateColumnHeader(columnId, title, toolTip) {
      if (!initialized) { return; }
      var idx = getColumnIndex(columnId);
      if (idx == null) {
        return;
      }

      var columnDef = columns[idx];
      var header = getColumnByIndex(idx);
      if (header) {
        if (title !== undefined) {
          columns[idx].name = title;
        }
        if (toolTip !== undefined) {
          columns[idx].toolTip = toolTip;
        }

        trigger(self.onBeforeHeaderCellDestroy, {
          "node": header,
          "column": columnDef,
          "grid": self
        });

        header.setAttribute("title", toolTip || "");
        if (title !== undefined) {
          header.children[0].innerHTML = sanitizeHtmlString(title);
        }

        trigger(self.onHeaderCellRendered, {
          "node": header,
          "column": columnDef,
          "grid": self
        });
      }
    }

    function getHeader(columnDef) {
      if (!columnDef) {
        return hasFrozenColumns() ? _headers : _headerL;
      }
      var idx = getColumnIndex(columnDef.id);
      return hasFrozenColumns() ? ((idx <= options.frozenColumn) ? _headerL : _headerR) : _headerL;
    }

    function getHeaderColumn(columnIdOrIdx) {
      var idx = (typeof columnIdOrIdx === "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx));
      var targetHeader = hasFrozenColumns() ? ((idx <= options.frozenColumn) ? _headerL : _headerR) : _headerL;
      var targetIndex = hasFrozenColumns() ? ((idx <= options.frozenColumn) ? idx : idx - options.frozenColumn - 1) : idx;

      return targetHeader.children[targetIndex];
    }

    function getHeaderRow() {
      return hasFrozenColumns() ? _headerRows : _headerRows[0];
    }

    function getFooterRow() {
      return hasFrozenColumns() ? _footerRow : _footerRow[0];
    }

    function getPreHeaderPanel() {
      return _preHeaderPanel;
    }

    function getPreHeaderPanelRight() {
      return _preHeaderPanelR;
    }

    function getHeaderRowColumn(columnIdOrIdx) {
      var idx = (typeof columnIdOrIdx === "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx));

      var headerRowTarget;

      if (hasFrozenColumns()) {
        if (idx <= options.frozenColumn) {
          headerRowTarget = _headerRowL;
        } else {
          headerRowTarget = _headerRowR;
          idx -= options.frozenColumn + 1;
        }
      } else {
        headerRowTarget = _headerRowL;
      }

      return headerRowTarget.children[idx];
    }

    function getFooterRowColumn(columnIdOrIdx) {
      var idx = (typeof columnIdOrIdx === "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx));

      var footerRowTarget;

      if (hasFrozenColumns()) {
        if (idx <= options.frozenColumn) {
          footerRowTarget = _footerRowL;
        } else {
          footerRowTarget = _footerRowR;

          idx -= options.frozenColumn + 1;
        }
      } else {
        footerRowTarget = _footerRowL;
      }

      return footerRowTarget.children[idx];
    }

    function createColumnFooter() {
      if (options.createFooterRow) {
        _footerRow.forEach(function (footer) {
          const columnElements = footer.querySelectorAll(".slick-footerrow-column");
          columnElements.forEach(function (column) {
            const columnDef = Utils.storage.get(column, "column");
            trigger(self.onBeforeFooterRowCellDestroy, {
              "node": column,
              "column": columnDef,
              "grid": self
            });
        });
        });

        _footerRowL.replaceChildren();
        _footerRowR.replaceChildren();

        for (var i = 0; i < columns.length; i++) {
          var m = columns[i];
          const footerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-footerrow-column l${i} r${i}` }, hasFrozenColumns() && (i > options.frozenColumn) ? _footerRowR : _footerRowL);
          const className = hasFrozenColumns() && i <= options.frozenColumn? 'frozen': null;
          if (className) {
            footerRowCell.classList.add(className);
          }

          Utils.storage.put(footerRowCell, "column", m);

          trigger(self.onFooterRowCellRendered, {
            "node": footerRowCell,
            "column": m,
            "grid": self
          });
        }
      }
    }

    function createColumnGroupHeaders() {
      var columnsLength = 0;
      var frozenColumnsValid = false;

      if (!treeColumns.hasDepth()) {
        return;
      }

      for (var index = 0; index < _groupHeadersL.length; index++) {
        _groupHeadersL[index].replaceChildren();
        _groupHeadersR[index].replaceChildren();

        var groupColumns = treeColumns.getColumnsInDepth(index);

        for (var indexGroup in groupColumns) {
          var m = groupColumns[indexGroup];

          columnsLength += m.extractColumns().length;

          if (hasFrozenColumns() && index === 0 && (columnsLength - 1) === options.frozenColumn) {
            frozenColumnsValid = true;
          }

          const el = Utils.createDomElement('div',
            { id: `${uid + m.id}`, className: 'ui-state-default slick-group-header-column', title: m.toolTip || '' },
            hasFrozenColumns() && (columnsLength - 1) > options.frozenColumn ? _groupHeadersR[index] : _groupHeadersL[index]
          );
          Utils.createDomElement('span', { className: 'slick-column-name', innerHTML: sanitizeHtmlString(m.name) }, el);
          el.classList.add(m.headerCssClass || "")
          el.classList.add(hasFrozenColumns() && (columnsLength - 1) > options.frozenColumn ? 'frozen' : '');
          Utils.storage.put(el, "column", m);
        }

        if (hasFrozenColumns() && index === 0 && !frozenColumnsValid) {
          _groupHeadersL[index].replaceChildren();
          _groupHeadersR[index].replaceChildren();
          alert("All columns of group should to be grouped!");
          break;
        }
      }

      applyColumnGroupHeaderWidths();
    }

    function handleHeaderMouseHoverOn(e) {
      e.target.classList.add("ui-state-hover");
    }

    function handleHeaderMouseHoverOff(e) {
      e.target.classList.remove("ui-state-hover");
    }

    function createColumnHeaders() {

      _headers.forEach(function (header) {
        const columnElements = header.querySelectorAll(".slick-header-column")
        columnElements.forEach(function (column) {
          var columnDef = Utils.storage.get(column, "column");
          if (columnDef) {
            trigger(self.onBeforeHeaderCellDestroy, {
              "node": column,
              "column": columnDef,
              "grid": self
            });
          }
        });
      })

      _headerL.replaceChildren();
      _headerR.replaceChildren();

      getHeadersWidth();

      Utils.width(_headerL, headersWidthL);
      Utils.width(_headerR, headersWidthR);

      _headerRows.forEach(function (row) {
        const columnElements = row.querySelectorAll(".slick-headerrow-column");
        columnElements.forEach(function (column) {
          const columnDef = Utils.storage.get(column, "column");
          if (columnDef) {
            trigger(self.onBeforeHeaderRowCellDestroy, {
              "node": this,
              "column": columnDef,
              "grid": self
            });
          }
        });
      });

      _headerRowL.replaceChildren();
      _headerRowR.replaceChildren();

      if (options.createFooterRow) {
        const footerRowColumnElements = _footerRowL.querySelectorAll(".slick-footerrow-column");
        footerRowColumnElements.forEach(function (column) {
          var columnDef = Utils.storage.get(column, "column");
          if (columnDef) {
            trigger(self.onBeforeFooterRowCellDestroy, {
              "node": this,
              "column": columnDef,
              "grid": self
            });
          }
        });
        _footerRowL.replaceChildren();

        if (hasFrozenColumns()) {
          const footerRowColumnElements = _footerRowR.querySelectorAll(".slick-footerrow-column");
          footerRowColumnElements.forEach(function (column) {
            var columnDef = Utils.storage.get(column, "column");
            if (columnDef) {
              trigger(self.onBeforeFooterRowCellDestroy, {
                "node": this,
                "column": columnDef,
                "grid": self
              });
            }
          });
          _footerRowR.replaceChildren();
        }
      }

      for (var i = 0; i < columns.length; i++) {
        const m = columns[i];
        const headerTarget = hasFrozenColumns() ? ((i <= options.frozenColumn) ? _headerL : _headerR) : _headerL;
        const headerRowTarget = hasFrozenColumns() ? ((i <= options.frozenColumn) ? _headerRowL : _headerRowR) : _headerRowL;

        const header = Utils.createDomElement('div', { id: `${uid + m.id}`, dataset: { id: m.id }, className: 'ui-state-default slick-header-column', title: m.toolTip || '' }, headerTarget);
        Utils.createDomElement('span', { className: 'slick-column-name', innerHTML: sanitizeHtmlString(m.name) }, header);
        Utils.width(header, m.width - headerColumnWidthDiff);

        let classname = m.headerCssClass || null;
        if (classname) {
          header.classList.add(classname);
        }
        classname = hasFrozenColumns() && i <= options.frozenColumn ? 'frozen' : null;
        if (classname) {
          header.classList.add(classname);
        }

        _bindingEventService.bind(header, "mouseenter", handleHeaderMouseEnter);
        _bindingEventService.bind(header, "mouseleave", handleHeaderMouseLeave);

        Utils.storage.put(header, "column", m);

        if (options.enableColumnReorder || m.sortable) {
          _bindingEventService.bind(header, "mouseenter", handleHeaderMouseHoverOn);
          _bindingEventService.bind(header, "mouseleave", handleHeaderMouseHoverOff);
        }

        if(m.hasOwnProperty('headerCellAttrs') && m.headerCellAttrs instanceof Object) {
          for (var key in m.headerCellAttrs) {
            if (m.headerCellAttrs.hasOwnProperty(key)) {
              header.setAttribute(key, m.headerCellAttrs[key]);
            }
          }
        }

        if (m.sortable) {
          header.classList.add("slick-header-sortable");
          Utils.createDomElement('div', { className: `slick-sort-indicator ${options.numberedMultiColumnSort && !options.sortColNumberInSeparateSpan ? ' slick-sort-indicator-numbered' : ''}` }, header);
          if (options.numberedMultiColumnSort && options.sortColNumberInSeparateSpan) {
            Utils.createDomElement('div', { className: 'slick-sort-indicator-numbered' }, header);
           }
        }

        trigger(self.onHeaderCellRendered, {
          "node": header,
          "column": m,
          "grid": self
        });

        if (options.showHeaderRow) {
          const headerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-headerrow-column l${i} r${i}` }, headerRowTarget);
          const classname = hasFrozenColumns() && i <= options.frozenColumn? 'frozen' : null;
          if (classname) {
            headerRowCell.classList.add(classname);
          }

          _bindingEventService.bind(headerRowCell, "mouseenter", handleHeaderRowMouseEnter);
          _bindingEventService.bind(headerRowCell, "mouseleave", handleHeaderRowMouseLeave);

          Utils.storage.put(headerRowCell, "column", m);

          trigger(self.onHeaderRowCellRendered, {
            "node": headerRowCell,
            "column": m,
            "grid": self
          });
        }
        if (options.createFooterRow && options.showFooterRow) {
          const footerRowTarget = hasFrozenColumns() ? ((i <= options.frozenColumn) ? _footerRow[0] : _footerRow[1]) : _footerRow[0];
          const footerRowCell = Utils.createDomElement('div', { className: `ui-state-default slick-footerrow-column l${i} r${i}` }, footerRowTarget);
          Utils.storage.put(footerRowCell, "column", m)

          trigger(self.onFooterRowCellRendered, {
            "node": footerRowCell,
            "column": m,
            "grid": self
          });
        }
      }

      setSortColumns(sortColumns);
      setupColumnResize();
      if (options.enableColumnReorder) {
        if (typeof options.enableColumnReorder == 'function') {
          options.enableColumnReorder(self, _headers, headerColumnWidthDiff, setColumns, setupColumnResize, columns, getColumnIndex, uid, trigger);
        } else {
          setupColumnReorder();
        }
      }
    }

    function setupColumnSort() {
      _headers.forEach(function (header) {
        _bindingEventService.bind(header, "click", function (e) {
          if (columnResizeDragging) {
            return;
          }

          if (e.target.classList.contains("slick-resizable-handle")) {
            return;
          }

          var coll = e.target.closest(".slick-header-column");
          if (!coll) {
            return;
          }

          var column = Utils.storage.get(coll, "column");
          if (column.sortable) {
            if (!getEditorLock().commitCurrentEdit()) {
              return;
            }

            var previousSortColumns = sortColumns.slice();
            var sortColumn = null;
            var i = 0;
            for (; i < sortColumns.length; i++) {
              if (sortColumns[i].columnId == column.id) {
                sortColumn = sortColumns[i];
                sortColumn.sortAsc = !sortColumn.sortAsc;
                break;
              }
            }
            var hadSortCol = !!sortColumn;

            if (options.tristateMultiColumnSort) {
                if (!sortColumn) {
                  sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc };
                }
                if (hadSortCol && sortColumn.sortAsc) {
                  // three state: remove sort rather than go back to ASC
                  sortColumns.splice(i, 1);
                  sortColumn = null;
                }
                if (!options.multiColumnSort) {
                  sortColumns = [];
                }
                if (sortColumn && (!hadSortCol || !options.multiColumnSort)) {
                  sortColumns.push(sortColumn);
                }
            } else {
                // legacy behaviour
                if (e.metaKey && options.multiColumnSort) {
                  if (sortColumn) {
                    sortColumns.splice(i, 1);
                  }
                } else {
                  if ((!e.shiftKey && !e.metaKey) || !options.multiColumnSort) {
                    sortColumns = [];
                  }

                  if (!sortColumn) {
                    sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc };
                    sortColumns.push(sortColumn);
                  } else if (sortColumns.length === 0) {
                    sortColumns.push(sortColumn);
                  }
                }
            }

            var onSortArgs;
            if (!options.multiColumnSort) {
              onSortArgs = {
                multiColumnSort: false,
                previousSortColumns: previousSortColumns,
                columnId: (sortColumns.length > 0 ? column.id : null),
                sortCol: (sortColumns.length > 0 ? column : null),
                sortAsc: (sortColumns.length > 0 ? sortColumns[0].sortAsc : true)
              };
            } else {
              onSortArgs = {
                multiColumnSort: true,
                previousSortColumns: previousSortColumns,
                sortCols: sortColumns.map(function(col) {
                  return {columnId: columns[getColumnIndex(col.columnId)].id, sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
                })
              };
            }

            if (trigger(self.onBeforeSort, onSortArgs, e).getReturnValue() !== false) {
              setSortColumns(sortColumns);
              trigger(self.onSort, onSortArgs, e);
            }
          }
        });
      });
    }

    function currentPositionInHeader(id) {
      let currentPosition = 0;
      _headers.forEach(function (header) {
        const columnElements = header.querySelectorAll(".slick-header-column")
        columnElements.forEach(function (column) {
          if(column.id == id) {
            currentPosition = i;
          }
        });
      });

      return currentPosition;
    }

    function limitPositionInGroup(idColumn) {
      var groupColumnOfPreviousPosition,
        startLimit = 0,
        endLimit = 0;

      treeColumns
        .getColumnsInDepth(_groupHeadersL.length - 1)
        .some(function (groupColumn) {
          startLimit = endLimit;
          endLimit += groupColumn.columns.length;

          groupColumn.columns.some(function (column) {
            if (column.id === idColumn) {
              groupColumnOfPreviousPosition = groupColumn;
            }
            return groupColumnOfPreviousPosition;
          });

          return groupColumnOfPreviousPosition;
        });

      endLimit--;

      return {
        start: startLimit,
        end: endLimit,
        group: groupColumnOfPreviousPosition
      };
    }

    function remove(arr, elem) {
      var index = arr.lastIndexOf(elem);
      if (index > -1) {
        arr.splice(index, 1);
        remove(arr, elem);
      }
    }

    function columnPositionValidInGroup(item) {
      var currentPosition = currentPositionInHeader(item.id);
      var limit = limitPositionInGroup(Utils.storage.get(item, "column").id);
      var positionValid = limit.start <= currentPosition && currentPosition <= limit.end;

      return {
        limit: limit,
        valid: positionValid,
        message: positionValid ? '' : 'Column "'.concat(item.textContent, '" can be reordered only within the "', limit.group.name, '" group!')
      };
    }

    function setupColumnReorder() {
      if (sortableSideLeftInstance) {
        sortableSideLeftInstance.destroy();
        sortableSideRightInstance.destroy();
      }

      var columnScrollTimer = null;

      function scrollColumnsRight() {
        _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft + 10;
      }

      function scrollColumnsLeft() {
        _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft - 10;
      }

      var canDragScroll;
      var sortableOptions = {
        animation: 50,
        direction: 'horizontal',
        chosenClass: 'slick-header-column-active',
        ghostClass: 'slick-sortable-placeholder',
        draggable: '.slick-header-column',
        dragoverBubble: false,
        revertClone: true,
        scroll: !hasFrozenColumns(), // enable auto-scroll
        onStart: function (e) {
          canDragScroll = !hasFrozenColumns() ||
            Utils.offset(e.item).left > Utils.offset(_viewportScrollContainerX).left;

          if (canDragScroll && e.originalEvent.pageX > _container.clientWidth) {
            if (!(columnScrollTimer)) {
              columnScrollTimer = setInterval(scrollColumnsRight, 100);
            }
          } else if (canDragScroll && e.originalEvent.pageX < Utils.offset(_viewportScrollContainerX).left) {
            if (!(columnScrollTimer)) {
              columnScrollTimer = setInterval(scrollColumnsLeft, 100);
            }
          } else {
            clearInterval(columnScrollTimer);
            columnScrollTimer = null;
          }
        },
        onEnd: function (e) {
          var cancel = false;
          clearInterval(columnScrollTimer);
          columnScrollTimer = null;
          var limit = null;

          if (treeColumns.hasDepth()) {
            var validPositionInGroup = columnPositionValidInGroup(e.item);
            limit = validPositionInGroup.limit;

            cancel = !validPositionInGroup.valid;

            if (cancel) {
              alert(validPositionInGroup.message);
            }
          }

          if (cancel || !getEditorLock().commitCurrentEdit()) {
            return;
          }

          var reorderedIds = sortableSideLeftInstance.toArray();
          reorderedIds = reorderedIds.concat(sortableSideRightInstance.toArray());

          var reorderedColumns = [];
          for (var i = 0; i < reorderedIds.length; i++) {
            reorderedColumns.push(columns[getColumnIndex(reorderedIds[i])]);
          }
          setColumns(reorderedColumns);

          trigger(self.onColumnsReordered, { impactedColumns : getImpactedColumns( limit ) });
          e.stopPropagation();
          setupColumnResize();
        }
      };

      sortableSideLeftInstance = Sortable.create(_headerL, sortableOptions);
      sortableSideRightInstance = Sortable.create(_headerR, sortableOptions);
    }

    function getHeaderChildren() {
      const a = Array.from(_headers[0].children);
      const b = Array.from(_headers[1].children);
      return a.concat(b);
    }

    function getImpactedColumns(limit) {
      var impactedColumns = [];

      if (limit) {
        for (var i = limit.start; i <= limit.end; i++) {
          impactedColumns.push(columns[i]);
        }
      } else {
        impactedColumns = columns;
      }

      return impactedColumns;
    }

    function handleResizeableHandleDoubleClick(evt) {
      const triggeredByColumn = evt.target.parentElement.id.replace(uid, "");
      trigger(self.onColumnsResizeDblClick, { triggeredByColumn: triggeredByColumn });
    }

    function setupColumnResize() {
      if (typeof Resizable === "undefined") {
        throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
      }

      var j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable;
      var frozenLeftColMaxWidth = 0;

      const children = getHeaderChildren();
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const handles = child.querySelectorAll(".slick-resizable-handle");
        handles.forEach(function (handle) {
          handle.remove();
        });

        if (i >= columns.length) {
          return;
        }

        if (columns[i].resizable) {
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

        if (i >= columns.length) { continue; }
        if (i < firstResizable || (options.forceFitColumns && i >= lastResizable)) {
          continue;
        }

        Utils.createDomElement('div', { className: 'slick-header-border-right' }, colElm);
        const resizeableHandle = Utils.createDomElement('div', { className: 'slick-resizable-handle', role: 'separator', ariaOrientation: 'horizontal' }, colElm);
        _bindingEventService.bind(resizeableHandle, "dblclick", handleResizeableHandleDoubleClick);

        slickResizableInstances.push(
          Resizable({
            resizeableElement: colElm,
            resizeableHandleElement: resizeableHandle,
            onResizeStart: function (e, resizeElms) {
              var targetEvent = e.touches ? e.touches[0] : e;
              if (!getEditorLock().commitCurrentEdit()) {
                return false;
              }
              pageX = targetEvent.pageX;
              frozenLeftColMaxWidth = 0;
              resizeElms.resizeableElement.classList.add("slick-header-column-active");
              var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
              // lock each column's width option to current width
              for (let pw = 0; pw < children.length; pw++) {
                if (pw >= columns.length) {
                  continue;
                }
                columns[pw].previousWidth = children[pw].offsetWidth;
              }
              if (options.forceFitColumns) {
                shrinkLeewayOnRight = 0;
                stretchLeewayOnRight = 0;
                // colums on right affect maxPageX/minPageX
                for (j = i + 1; j < columns.length; j++) {
                  c = columns[j];
                  if (c.resizable) {
                    if (stretchLeewayOnRight !== null) {
                      if (c.maxWidth) {
                        stretchLeewayOnRight += c.maxWidth - c.previousWidth;
                      } else {
                        stretchLeewayOnRight = null;
                      }
                    }
                    shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                  }
                }
              }
              var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
              for (j = 0; j <= i; j++) {
                // columns on left only affect minPageX
                c = columns[j];
                if (c.resizable) {
                  if (stretchLeewayOnLeft !== null) {
                    if (c.maxWidth) {
                      stretchLeewayOnLeft += c.maxWidth - c.previousWidth;
                    } else {
                      stretchLeewayOnLeft = null;
                    }
                  }
                  shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
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
            onResize: function (e, resizeElms) {
              var targetEvent = e.touches ? e.touches[0] : e;
              columnResizeDragging = true;
              var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x;
              var newCanvasWidthL = 0, newCanvasWidthR = 0;
              var viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

              if (d < 0) { // shrink column
                x = d;

                for (j = i; j >= 0; j--) {
                  c = columns[j];
                  if (c.resizable) {
                    actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                    if (x && c.previousWidth + x < actualMinWidth) {
                      x += c.previousWidth - actualMinWidth;
                      c.width = actualMinWidth;
                    } else {
                      c.width = c.previousWidth + x;
                      x = 0;
                    }
                  }
                }

                for (k = 0; k <= i; k++) {
                  c = columns[k];

                  if (hasFrozenColumns() && (k > options.frozenColumn)) {
                    newCanvasWidthR += c.width;
                  } else {
                    newCanvasWidthL += c.width;
                  }
                }

                if (options.forceFitColumns) {
                  x = -d;
                  for (j = i + 1; j < columns.length; j++) {
                    c = columns[j];
                    if (c.resizable) {
                      if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                        x -= c.maxWidth - c.previousWidth;
                        c.width = c.maxWidth;
                      } else {
                        c.width = c.previousWidth + x;
                        x = 0;
                      }

                      if (hasFrozenColumns() && (j > options.frozenColumn)) {
                        newCanvasWidthR += c.width;
                      } else {
                        newCanvasWidthL += c.width;
                      }
                    }
                  }
                } else {
                  for (j = i + 1; j < columns.length; j++) {
                    c = columns[j];

                    if (hasFrozenColumns() && (j > options.frozenColumn)) {
                      newCanvasWidthR += c.width;
                    } else {
                      newCanvasWidthL += c.width;
                    }
                  }
                }

                if (options.forceFitColumns) {
                  x = -d;
                  for (j = i + 1; j < columns.length; j++) {
                    c = columns[j];
                    if (c.resizable) {
                      if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                        x -= c.maxWidth - c.previousWidth;
                        c.width = c.maxWidth;
                      } else {
                        c.width = c.previousWidth + x;
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
                  c = columns[j];
                  if (c.resizable) {
                    if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                      x -= c.maxWidth - c.previousWidth;
                      c.width = c.maxWidth;
                    } else {
                      var newWidth = c.previousWidth + x;
                      var resizedCanvasWidthL = canvasWidthL + x;

                      if (hasFrozenColumns() && (j <= options.frozenColumn)) {
                        // if we're on the left frozen side, we need to make sure that our left section width never goes over the total viewport width
                        if (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < (viewportWidth - options.frozenRightViewportMinWidth)) {
                          frozenLeftColMaxWidth = newWidth; // keep max column width ref, if we go over the limit this number will stop increasing
                        }
                        c.width = ((resizedCanvasWidthL + options.frozenRightViewportMinWidth) > viewportWidth) ? frozenLeftColMaxWidth : newWidth;
                      } else {
                        c.width = newWidth;
                      }
                      x = 0;
                    }
                  }
                }

                for (k = 0; k <= i; k++) {
                  c = columns[k];

                  if (hasFrozenColumns() && (k > options.frozenColumn)) {
                    newCanvasWidthR += c.width;
                  } else {
                    newCanvasWidthL += c.width;
                  }
                }

                if (options.forceFitColumns) {
                  x = -d;
                  for (j = i + 1; j < columns.length; j++) {
                    c = columns[j];
                    if (c.resizable) {
                      actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                      if (x && c.previousWidth + x < actualMinWidth) {
                        x += c.previousWidth - actualMinWidth;
                        c.width = actualMinWidth;
                      } else {
                        c.width = c.previousWidth + x;
                        x = 0;
                      }

                      if (hasFrozenColumns() && (j > options.frozenColumn)) {
                        newCanvasWidthR += c.width;
                      } else {
                        newCanvasWidthL += c.width;
                      }
                    }
                  }
                } else {
                  for (j = i + 1; j < columns.length; j++) {
                    c = columns[j];

                    if (hasFrozenColumns() && (j > options.frozenColumn)) {
                      newCanvasWidthR += c.width;
                    } else {
                      newCanvasWidthL += c.width;
                    }
                  }
                }
              }

              if (hasFrozenColumns() && newCanvasWidthL != canvasWidthL) {
                Utils.width(_headerL, newCanvasWidthL + 1000);
                Utils.setStyleSize(_paneHeaderR, 'left', newCanvasWidthL);
              }

              applyColumnHeaderWidths();
              applyColumnGroupHeaderWidths();
              if (options.syncColumnCellResize) {
                applyColumnWidths();
              }
              trigger(self.onColumnsDrag, {
                triggeredByColumn: resizeElms.resizeableElement,
                resizeHandle: resizeElms.resizeableHandleElement
              });
            },
            onResizeEnd: function (e, resizeElms) {
              resizeElms.resizeableElement.classList.remove("slick-header-column-active");

              var triggeredByColumn = resizeElms.resizeableElement.id.replace(uid, "");
              if (trigger(self.onBeforeColumnsResize, { triggeredByColumn: triggeredByColumn }).getReturnValue() === true) {
                applyColumnHeaderWidths();
                applyColumnGroupHeaderWidths();
              }
              var newWidth;
              for (j = 0; j < columns.length; j++) {
                c = columns[j];
                newWidth = children[j].offsetWidth;

                if (c.previousWidth !== newWidth && c.rerenderOnResize) {
                  invalidateAllRows();
                }
              }
              updateCanvasWidth(true);
              render();
              trigger(self.onColumnsResized, { triggeredByColumn: triggeredByColumn });
              setTimeout(function () { columnResizeDragging = false; }, 300);
            }
          })
        );
      }
    }

    function getVBoxDelta(el) {
      var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
      var styles = getComputedStyle(el);

      var delta = 0;
      p.forEach(function (val) {
        delta += Utils.toFloat(styles[val]);
      });
      return delta;
    }

    function setFrozenOptions() {
      options.frozenColumn = (options.frozenColumn >= 0 && options.frozenColumn < columns.length)
        ? parseInt(options.frozenColumn)
        : -1;

      if (options.frozenRow > -1) {
        hasFrozenRows = true;
        frozenRowsHeight = ( options.frozenRow ) * options.rowHeight;

        var dataLength = getDataLength();

        actualFrozenRow = ( options.frozenBottom )
          ? ( dataLength - options.frozenRow )
          : options.frozenRow;
      } else {
        hasFrozenRows = false;
      }
    }

    function setPaneVisibility() {
      if (hasFrozenColumns()) {
        show(_paneHeaderR);
        show(_paneTopR);

        if (hasFrozenRows) {
          show(_paneBottomL);
          show(_paneBottomR);
        } else {
          hide(_paneBottomR);
          hide(_paneBottomL);
        }
      } else {
        hide(_paneHeaderR);
        hide(_paneTopR);
        hide(_paneBottomR);

        if (hasFrozenRows) {
          show(_paneBottomL);
        } else {
          hide(_paneBottomR);
          hide(_paneBottomL);
        }
      }
    }

    function setOverflow() {
      _viewportTopL.style['overflow-x'] = ( hasFrozenColumns() ) ? ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll' ) : ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'hidden' : 'auto' );
      _viewportTopL.style['overflow-y'] = (!hasFrozenColumns() && options.alwaysShowVerticalScroll) ? "scroll" : (( hasFrozenColumns() ) ? ( hasFrozenRows ? 'hidden' : 'hidden' ) : ( hasFrozenRows ? 'scroll' : 'auto' ));

      _viewportTopR.style['overflow-x'] = ( hasFrozenColumns() ) ? ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll' ) : ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'hidden' : 'auto' );
      _viewportTopR.style['overflow-y'] = options.alwaysShowVerticalScroll ? "scroll" : (( hasFrozenColumns() ) ? ( hasFrozenRows ? 'scroll' : 'auto'   ) : ( hasFrozenRows ? 'scroll' : 'auto' ));

      _viewportBottomL.style['overflow-x'] = ( hasFrozenColumns() ) ? ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'scroll' : 'auto'   ): ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'auto' : 'auto' );
      _viewportBottomL.style['overflow-y'] = (!hasFrozenColumns() && options.alwaysShowVerticalScroll) ? "scroll" : (( hasFrozenColumns() ) ? ( hasFrozenRows ? 'hidden' : 'hidden' ): ( hasFrozenRows ? 'scroll' : 'auto' ));

      _viewportBottomR.style['overflow-x'] = ( hasFrozenColumns() ) ? ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'scroll' : 'auto' ) : ( hasFrozenRows && !options.alwaysAllowHorizontalScroll ? 'auto' : 'auto' );
      _viewportBottomR.style['overflow-y'] = options.alwaysShowVerticalScroll ? "scroll" : (( hasFrozenColumns() ) ? ( hasFrozenRows ? 'auto' : 'auto'   ) : ( hasFrozenRows ? 'auto' : 'auto' ));

      if (options.viewportClass) {
        _viewportTopL.classList.add(options.viewportClass);
        _viewportTopR.classList.add(options.viewportClass);
        _viewportBottomL.classList.add(options.viewportClass);
        _viewportBottomR.classList.add(options.viewportClass);
      }
    }

    function setScroller() {
      if (hasFrozenColumns()) {
        _headerScrollContainer = _headerScrollerR;
        _headerRowScrollContainer = _headerRowScrollerR;
        _footerRowScrollContainer = _footerRowScrollerR;

        if (hasFrozenRows) {
          if (options.frozenBottom) {
            _viewportScrollContainerX = _viewportBottomR;
            _viewportScrollContainerY = _viewportTopR;
          } else {
            _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomR;
          }
        } else {
          _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopR;
        }
      } else {
        _headerScrollContainer = _headerScrollerL;
        _headerRowScrollContainer = _headerRowScrollerL;
        _footerRowScrollContainer = _footerRowScrollerL;

        if (hasFrozenRows) {
          if (options.frozenBottom) {
            _viewportScrollContainerX = _viewportBottomL;
            _viewportScrollContainerY = _viewportTopL;
          } else {
            _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomL;
          }
        } else {
          _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopL;
        }
      }
    }

    function measureCellPaddingAndBorder() {
      const h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
      const v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
      const header = _headers[0];

      headerColumnWidthDiff = headerColumnHeightDiff = 0;
      cellWidthDiff = cellHeightDiff = 0;

      let el = Utils.createDomElement('div', { className: 'ui-state-default slick-header-column', style: { visibility: 'hidden' }, textContent: '-' }, header);
      let style = getComputedStyle(el);
      if (style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box") {
        h.forEach(function (val) {
          headerColumnWidthDiff += Utils.toFloat(style[val]);
        });
        v.forEach(function (val) {
          headerColumnHeightDiff += Utils.toFloat(style[val]);
        })
      }
      el.remove();

      const r = Utils.createDomElement('div', { className: 'slick-row' }, _canvas[0]);
      el = Utils.createDomElement('div', { className: 'slick-cell', id: '', style: { visibility: 'hidden', textContent: '-' } }, r);
      style = getComputedStyle(el);
      if (style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box") {
        h.forEach(function (val) {
          cellWidthDiff += Utils.toFloat(style[val]);
        });
        v.forEach(function (val) {
          cellHeightDiff += Utils.toFloat(style[val]);
        });
      }
      r.remove();

      absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
    }

    function createCssRules() {
      const template = Utils.createDomElement('template', { innerHTML: '<style type="text/css" rel="stylesheet" />' });
      _style = template.content.firstChild;
      document.head.appendChild(_style);

      var rowHeight = (options.rowHeight - cellHeightDiff);
      var rules = [
        "." + uid + " .slick-group-header-column { left: 1000px; }",
        "." + uid + " .slick-header-column { left: 1000px; }",
        "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
        "." + uid + " .slick-preheader-panel { height:" + options.preHeaderPanelHeight + "px; }",
        "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
        "." + uid + " .slick-footerrow-columns { height:" + options.footerRowHeight + "px; }",
        "." + uid + " .slick-cell { height:" + rowHeight + "px; }",
        "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
      ];

      for (var i = 0; i < columns.length; i++) {
        rules.push("." + uid + " .l" + i + " { }");
        rules.push("." + uid + " .r" + i + " { }");
      }

      if (_style.styleSheet) { // IE
        _style.styleSheet.cssText = rules.join(" ");
      } else {
        _style.appendChild(document.createTextNode(rules.join(" ")));
      }
    }

    function getColumnCssRules(idx) {
      var i;
      if (!stylesheet) {
        var sheets = document.styleSheets;
        for (i = 0; i < sheets.length; i++) {
          if ((sheets[i].ownerNode || sheets[i].owningElement) == _style) {
            stylesheet = sheets[i];
            break;
          }
        }

        if (!stylesheet) {
          throw new Error("SlickGrid Cannot find stylesheet.");
        }

        // find and cache column CSS rules
        columnCssRulesL = [];
        columnCssRulesR = [];
        var cssRules = (stylesheet.cssRules || stylesheet.rules);
        var matches, columnIdx;
        for (i = 0; i < cssRules.length; i++) {
          var selector = cssRules[i].selectorText;
          if (matches = /\.l\d+/.exec(selector)) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesL[columnIdx] = cssRules[i];
          } else if (matches = /\.r\d+/.exec(selector)) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesR[columnIdx] = cssRules[i];
          }
        }
      }

      return {
        "left": columnCssRulesL[idx],
        "right": columnCssRulesR[idx]
      };
    }

    function removeCssRules() {
      _style.remove();
      stylesheet = null;
    }

    function destroy(shouldDestroyAllElements) {
      _bindingEventService.unbindAll();
      slickDraggableInstance = destroyAllInstances(slickDraggableInstance);
      slickMouseWheelInstances = destroyAllInstances(slickMouseWheelInstances);
      slickResizableInstances = destroyAllInstances(slickResizableInstances);
      getEditorLock().cancelCurrentEdit();

      trigger(self.onBeforeDestroy, {});

      var i = plugins.length;
      while(i--) {
        unregisterPlugin(plugins[i]);
      }

      if (options.enableColumnReorder && sortableSideLeftInstance && typeof sortableSideLeftInstance.destroy === 'function') {
        sortableSideLeftInstance.destroy();
        sortableSideRightInstance.destroy();
      }

      unbindAncestorScrollEvents();
      _bindingEventService.unbindByEventName(_container, "resize.slickgrid", resizeCanvas);
      removeCssRules();

      _canvas.forEach(function (element) {
        _bindingEventService.unbindByEventName(element, "keydown", handleKeyDown);
        _bindingEventService.unbindByEventName(element, "click", handleClick);
        _bindingEventService.unbindByEventName(element, "dblclick", handleDblClick);
        _bindingEventService.unbindByEventName(element, "contextmenu", handleContextMenu);
        _bindingEventService.unbindByEventName(element, "mouseover", handleCellMouseOver);
        _bindingEventService.unbindByEventName(element, "mouseout", handleCellMouseOut);
      });
      _viewport.forEach(function (view) {
        _bindingEventService.unbindByEventName(view, "scroll", handleScroll);
      });

      _headerScroller.forEach(function (el) {
        _bindingEventService.unbindByEventName(el, "contextmenu", handleHeaderContextMenu);
        _bindingEventService.unbindByEventName(el, "click", handleHeaderClick);
      });

      _headerRowScroller.forEach(function (scroller) {
        _bindingEventService.unbindByEventName(scroller, "scroll", handleHeaderRowScroll);
      });

      if (_footerRow) {
        _footerRow.forEach(function (footer) {
          _bindingEventService.unbindByEventName(footer, "contextmenu", handleFooterContextMenu)
          _bindingEventService.unbindByEventName(footer, "click", handleFooterClick);
        });
      }

      if (_footerRowScroller) {
        _footerRowScroller.forEach(function (scroller) {
          _bindingEventService.unbindByEventName(scroller, "scroll", handleFooterRowScroll);
        });
      }

      if (_preHeaderPanelScroller) {
        _bindingEventService.unbindByEventName(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll);
      }

      _bindingEventService.unbindByEventName(_focusSink, "keydown", handleKeyDown);
      _bindingEventService.unbindByEventName(_focusSink2, "keydown", handleKeyDown);

      const resizeHandles = _container.querySelectorAll(".slick-resizable-handle");
      [].forEach.call(resizeHandles, function (handle) {
        _bindingEventService.unbindByEventName(handle, "dblclick", handleResizeableHandleDoubleClick);
      });

      const headerColumns = _container.querySelectorAll(".slick-header-column");
      [].forEach.call(headerColumns, function (column) {
        _bindingEventService.unbindByEventName(column, "mouseenter", handleHeaderMouseEnter);
        _bindingEventService.unbindByEventName(column, "mouseleave", handleHeaderMouseLeave);

        _bindingEventService.unbindByEventName(column, 'mouseenter', handleHeaderMouseHoverOn);
        _bindingEventService.unbindByEventName(column, 'mouseleave', handleHeaderMouseHoverOff);
      });

      _container.replaceChildren();
      _container.classList.remove(uid);

      if (shouldDestroyAllElements) {
        destroyAllElements();
      }
    }

    /**
     * call destroy method, when exists, on all the instance(s) it found
     * @params instances - can be a single instance or a an array of instances
     */
    function destroyAllInstances(inputInstances) {
      if (inputInstances) {
        const instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances];
        let instance;
        while ((instance = instances.pop()) != null) {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        }
      }
      // reset instance(s)
      inputInstances = Array.isArray(inputInstances) ? [] : null;
      return inputInstances;
    }

    function destroyAllElements() {
      _activeCanvasNode = null;
      _activeViewportNode = null;
      _boundAncestors = null;
      _canvas = null;
      _canvasTopL = null;
      _canvasTopR = null;
      _canvasBottomL = null;
      _canvasBottomR = null;
      _container = null;
      _focusSink = null;
      _focusSink2 = null;
      _groupHeaders = null;
      _groupHeadersL = null;
      _groupHeadersR = null;
      _headerL = null;
      _headerR = null;
      _headers = null;
      _headerRows = null;
      _headerRowL = null;
      _headerRowR = null;
      _headerRowSpacerL = null;
      _headerRowSpacerR = null;
      _headerRowScrollContainer = null;
      _headerRowScroller = null;
      _headerRowScrollerL = null;
      _headerRowScrollerR = null;
      _headerScrollContainer = null;
      _headerScroller = null;
      _headerScrollerL = null;
      _headerScrollerR = null;
      _hiddenParents = null;
      _footerRow = null;
      _footerRowL = null;
      _footerRowR = null;
      _footerRowSpacerL = null;
      _footerRowSpacerR = null;
      _footerRowScroller = null;
      _footerRowScrollerL = null;
      _footerRowScrollerR = null;
      _footerRowScrollContainer = null;
      _preHeaderPanel = null;
      _preHeaderPanelR = null;
      _preHeaderPanelScroller = null;
      _preHeaderPanelScrollerR = null;
      _preHeaderPanelSpacer = null;
      _preHeaderPanelSpacerR = null;
      _topPanels = null;
      _topPanelScrollers = null;
      _style = null;
      _topPanelScrollerL = null;
      _topPanelScrollerR = null;
      _topPanelL = null;
      _topPanelR = null;
      _paneHeaderL = null;
      _paneHeaderR = null;
      _paneTopL = null;
      _paneTopR = null;
      _paneBottomL = null;
      _paneBottomR = null;
      _viewport = null;
      _viewportTopL = null;
      _viewportTopR = null;
      _viewportBottomL = null;
      _viewportBottomR = null;
      _viewportScrollContainerX = null;
      _viewportScrollContainerY = null;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Column Autosizing
    //////////////////////////////////////////////////////////////////////////////////////////////

    var canvas = null;
    var canvas_context = null;

    function autosizeColumn(columnOrIndexOrId, isInit) {
      var colDef = null;
      var colIndex = -1;
      if (typeof columnOrIndexOrId === 'number') {
        colDef = columns[columnOrIndexOrId];
        colIndex = columnOrIndexOrId;
      }
      else if (typeof columnOrIndexOrId === 'string') {
        for (i = 0; i < columns.length; i++) {
          if (columns[i].Id === columnOrIndexOrId) { colDef = columns[i]; colIndex = i; }
        }
      }
      if (!colDef) {
        return;
      }
      const gridCanvas = getCanvasNode(0, 0);
      getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit, colIndex);
    }

    function treatAsLocked(autoSize) {
      // treat as locked (don't resize) if small and header is the widest part
      return !autoSize.ignoreHeaderText
        && !autoSize.sizeToRemaining
        && (autoSize.contentSizePx === autoSize.headerWidthPx)
        && autoSize.widthPx < 100
        ;
    }

    function autosizeColumns(autosizeMode, isInit) {
      var cssCache = { hiddenParents: null, oldPropArr: [] };
      cacheCssForHiddenInit(cssCache);
      internalAutosizeColumns(autosizeMode, isInit);
      restoreCssFromHiddenInit(cssCache);
    }

    function internalAutosizeColumns(autosizeMode, isInit) {
      //LogColWidths();

      autosizeMode =  autosizeMode || options.autosizeColsMode;
      if (autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
        legacyAutosizeColumns();
        return;
      }

      if (autosizeMode === GridAutosizeColsMode.None) {
        return;
      }

      // test for brower canvas support, canvas_context!=null if supported
      canvas = document.createElement("canvas");
      if (canvas && canvas.getContext) { canvas_context = canvas.getContext("2d"); }

      // pass in the grid canvas
      var gridCanvas = getCanvasNode(0, 0);
      var viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

      // iterate columns to get autosizes
      var i, c, colWidth, reRender, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
      for (i = 0; i < columns.length; i++) {
        c = columns[i];
        getColAutosizeWidth(c, i, gridCanvas, isInit, i);
        totalLockedColWidth += (c.autoSize.autosizeMode === ColAutosizeMode.Locked ? c.width : (treatAsLocked(c.autoSize) ? c.autoSize.widthPx : 0));
        totalMinWidth += (c.autoSize.autosizeMode === ColAutosizeMode.Locked ? c.width : (treatAsLocked(c.autoSize) ? c.autoSize.widthPx : c.minWidth));
        totalWidth += c.autoSize.widthPx;
        totalWidthLessSTR += (c.autoSize.sizeToRemaining ? 0 : c.autoSize.widthPx);
        strColsMinWidth += (c.autoSize.sizeToRemaining ? c.minWidth || 0 : 0);
      }
      var strColTotalGuideWidth = totalWidth - totalWidthLessSTR;

      if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
        // - if viewport with is outside MinViewportWidthPx and MaxViewportWidthPx, then the viewport is set to
        //   MinViewportWidthPx or MaxViewportWidthPx and the FitColsToViewport algorithm is used
        // - viewport is resized to fit columns
        var setWidth = totalWidth + scrollbarDimensions.width;
        autosizeMode = GridAutosizeColsMode.IgnoreViewport;

        if (options.viewportMaxWidthPx && setWidth > options.viewportMaxWidthPx) {
          setWidth = options.viewportMaxWidthPx;
          autosizeMode = GridAutosizeColsMode.FitColsToViewport;
        } else if (options.viewportMinWidthPx && setWidth < options.viewportMinWidthPx) {
          setWidth = options.viewportMinWidthPx;
          autosizeMode = GridAutosizeColsMode.FitColsToViewport;
        } else {
          // falling back to IgnoreViewport will size the columns as-is, with render checking
          //for (i = 0; i < columns.length; i++) { columns[i].width = columns[i].autoSize.widthPx; }
        }
        Utils.width(_container, setWidth);
      }

      if (autosizeMode === GridAutosizeColsMode.FitColsToViewport) {
        if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
          // if addl space remains in the viewport and there are SizeToRemaining cols, just the SizeToRemaining cols expand proportionally to fill viewport
          for (i = 0; i < columns.length; i++) {
            c = columns[i];
            var totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
            if (c.autoSize.sizeToRemaining) {
              colWidth = totalSTRViewportWidth * c.autoSize.widthPx / strColTotalGuideWidth;
            } else {
              colWidth = c.autoSize.widthPx;
            }
            if (c.rerenderOnResize && c.width != colWidth) {
              reRender = true;
            }
            c.width = colWidth;
          }
        } else if ((options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * options.viewportSwitchToScrollModeWidthPercent / 100)
          || (totalMinWidth > viewportWidth)) {
          // if the total columns width is wider than the viewport by switchToScrollModeWidthPercent, switch to IgnoreViewport mode
          autosizeMode = GridAutosizeColsMode.IgnoreViewport;
        } else {
          // otherwise (ie. no SizeToRemaining cols or viewport smaller than columns) all cols other than 'Locked' scale in proportion to fill viewport
          // and SizeToRemaining get minWidth
          var unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth;
          var unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
          for (i = 0; i < columns.length; i++) {
            c = columns[i];
            colWidth = c.width;
            if (c.autoSize.autosizeMode !== ColAutosizeMode.Locked && !treatAsLocked(c.autoSize)) {
              if (c.autoSize.sizeToRemaining) {
                colWidth = c.minWidth;
              } else {
                // size width proportionally to free space (we know we have enough room due to the earlier calculations)
                colWidth = unallocatedViewportWidth / unallocatedColWidth * c.autoSize.widthPx - 1;
                if (colWidth < c.minWidth) {
                  colWidth = c.minWidth;
                }

                // remove the just allocated widths from the allocation pool
                unallocatedColWidth -= c.autoSize.widthPx;
                unallocatedViewportWidth -= colWidth;
              }
            }
            if (treatAsLocked(c.autoSize)) {
              colWidth = c.autoSize.widthPx;
              if (colWidth < c.minWidth) {
                colWidth = c.minWidth;
              }
            }
            if (c.rerenderOnResize && c.width != colWidth) {
              reRender = true;
            }
            c.width = colWidth;
          }
        }
      }

      if (autosizeMode === GridAutosizeColsMode.IgnoreViewport) {
        // just size columns as-is
        for (i = 0; i < columns.length; i++) {
          colWidth = columns[i].autoSize.widthPx;
          if (columns[i].rerenderOnResize && columns[i].width != colWidth) {
            reRender = true;
          }
          columns[i].width = colWidth;
        }
      }

      reRenderColumns(reRender);
    }

    function getColAutosizeWidth(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      var autoSize = columnDef.autoSize;

      // set to width as default
      autoSize.widthPx = columnDef.width;
      if (autoSize.autosizeMode === ColAutosizeMode.Locked
        || autoSize.autosizeMode === ColAutosizeMode.Guide) {
        return;
      }

      var dl = getDataLength(); //getDataItem();
      const isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);

      // ContentIntelligent takes settings from column data type
      if (autoSize.autosizeMode === ColAutosizeMode.ContentIntelligent) {
        // default to column colDataTypeOf (can be used if initially there are no data rows)
        var colDataTypeOf = autoSize.colDataTypeOf;
        var colDataItem;
        if (dl > 0) {
          var tempRow = getDataItem(0);
          if (tempRow) {
            colDataItem = tempRow[columnDef.field];

            // check for dates in hiding
            if (isoDateRegExp.test(colDataItem)) { colDataItem = Date.parse(colDataItem); }

            colDataTypeOf = typeof colDataItem;
            if (colDataTypeOf === 'object') {
              if (colDataItem instanceof Date) { colDataTypeOf = "date"; }
              if (typeof moment!=='undefined' && colDataItem instanceof moment) { colDataTypeOf = "moment"; }
            }
          }
        }
        if (colDataTypeOf === 'boolean') {
          autoSize.colValueArray = [ true, false ];
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
          autoSize.colValueArray = [ new Date(2009, 8, 30, 12, 20, 20) ]; // Sep 30th 2009, 12:20:20 AM
        }
        if (colDataTypeOf === 'moment' && typeof moment!=='undefined') {
          autoSize.colValueArray = [ moment([2009, 8, 30, 12, 20, 20]) ]; // Sep 30th 2009, 12:20:20 AM
        }
      }

      // at this point, the autosizeMode is effectively 'Content', so proceed to get size
      var colWidth = autoSize.contentSizePx = getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);

      if (colWidth === 0) { colWidth = autoSize.widthPx; }

      var addlPercentMultiplier = (autoSize.allowAddlPercent ? (1 + autoSize.allowAddlPercent/100) : 1);
      colWidth = colWidth * addlPercentMultiplier + options.autosizeColPaddingPx;
      if (columnDef.minWidth && colWidth < columnDef.minWidth) { colWidth = columnDef.minWidth; }
      if (columnDef.maxWidth && colWidth > columnDef.maxWidth) { colWidth = columnDef.maxWidth; }

      if (autoSize.autosizeMode === ColAutosizeMode.ContentExpandOnly || (columnDef.editor && columnDef.editor.ControlFillsColumn)) {
        // only use content width if it's wider than the default column width (this is used for dropdowns and other fixed width controls)
        if (colWidth < columnDef.width) { colWidth = columnDef.width; }
      }
      autoSize.widthPx = colWidth;
    }

    function getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      var autoSize = columnDef.autoSize;
      var widthAdjustRatio = 1;

      // at this point, the autosizeMode is effectively 'Content', so proceed to get size

      // get header width, if we are taking notice of it
      var i, ii;
      var tempVal, maxLen = 0;
      var maxColWidth = 0;
      autoSize.headerWidthPx = 0;
      if (!autoSize.ignoreHeaderText) {
        autoSize.headerWidthPx = getColHeaderWidth(columnDef);
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
        maxColWidth = getColWidth(columnDef, gridCanvas, autoSize.colValueArray);
        return Math.max(autoSize.headerWidthPx, maxColWidth);
      }

      // select rows to evaluate using rowSelectionMode and rowSelectionCount
      var rowInfo = { };
      rowInfo.colIndex = colIndex;
      rowInfo.rowCount = getDataLength();
      rowInfo.startIndex = 0;
      rowInfo.endIndex = rowInfo.rowCount-1;
      rowInfo.valueArr = null;
      rowInfo.getRowVal = function (i) { return getDataItem(i)[columnDef.field]; };

      var rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : undefined) || autoSize.rowSelectionMode;

      if (rowSelectionMode === RowSelectionMode.FirstRow) { rowInfo.endIndex = 0; }
      if (rowSelectionMode === RowSelectionMode.LastRow) { rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1; }
      if (rowSelectionMode === RowSelectionMode.FirstNRows) { rowInfo.endIndex = Math.min(autoSize.rowSelectionCount, rowInfo.rowCount) - 1; }

      // now use valueFilterMode to further filter selected rows
      if (autoSize.valueFilterMode === ValueFilterMode.DeDuplicate) {
        var rowsDict = {};
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
          rowsDict[rowInfo.getRowVal(i)] = true;
        }
        if (Object.keys) {
          rowInfo.valueArr = Object.keys(rowsDict);
        } else {
          rowInfo.valueArr = [];
          for (var v in rowsDict) rowInfo.valueArr.push(v);
        }
        rowInfo.startIndex = 0;
        rowInfo.endIndex = rowInfo.length - 1;
      }

      if (autoSize.valueFilterMode === ValueFilterMode.GetGreatestAndSub) {
        // get greatest abs value in data
        var maxVal, maxAbsVal = 0;
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
          tempVal = rowInfo.getRowVal(i);
          if (Math.abs(tempVal) > maxAbsVal) { maxVal = tempVal; maxAbsVal = Math.abs(tempVal); }
        }
        // now substitute a '9' for all characters (to get widest width) and convert back to a number
        maxVal = '' + maxVal;
        maxVal = Array(maxVal.length + 1).join("9");
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
        tempVal = Array(maxLen + 1).join("m");
        widthAdjustRatio = options.autosizeTextAvgToMWidthRatio;

        rowInfo.maxLen = maxLen;
        rowInfo.valueArr = [tempVal];
        rowInfo.startIndex = rowInfo.endIndex = 0;
      }

      if (autoSize.valueFilterMode === ValueFilterMode.GetLongestText) {
        // get greatest abs value in data
        maxLen = 0; var maxIndex = 0;
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
      maxColWidth = getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio;
      return Math.max(autoSize.headerWidthPx, maxColWidth);
    }

    function getColWidth(columnDef, gridCanvas, rowInfo) {
      const rowEl = Utils.createDomElement('div', { className: 'slick-row ui-widget-content' }, gridCanvas);
      const cellEl = Utils.createDomElement('div', { className: 'slick-cell' }, rowEl);

      cellEl.style["position"] = "absolute";
      cellEl.style["visibility"] = "hidden";
      cellEl.style["text-overflow"] = "initial";
      cellEl.style["white-space"] = "nowrap";

      var i, len, max = 0, text, maxText, formatterResult, maxWidth = 0, val;

      // get mode - if text only display, use canvas otherwise html element
      var useCanvas = (columnDef.autoSize.widthEvalMode === WidthEvalMode.TextOnly);

      if (columnDef.autoSize.widthEvalMode === WidthEvalMode.Auto) {
        var noFormatter = !columnDef.formatterOverride && !columnDef.formatter;
        var formatterIsText = (columnDef.formatterOverride && columnDef.formatterOverride.ReturnsTextOnly)
          || (!columnDef.formatterOverride && columnDef.formatter && columnDef.formatter.ReturnsTextOnly);
        useCanvas = noFormatter || formatterIsText;
      }

         // use canvas - very fast, but text-only
      if (canvas_context && useCanvas) {
        const style = getComputedStyle(cellEl);
        canvas_context.font = style["font-size"] + " " + style["font-family"];
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++) {
              // row is either an array or values or a single value
          val = (rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i));
          if (columnDef.formatterOverride) {
            // use formatterOverride as first preference
            formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, getDataItem(i), self);
          } else if (columnDef.formatter) {
            // otherwise, use formatter
            formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, getDataItem(i), self);
          } else {
            // otherwise, use plain text
            formatterResult = '' + val;
          }
          len = formatterResult ? canvas_context.measureText(formatterResult).width : 0;
          if (len > max) { max = len; maxText = formatterResult; }
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
          formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, getDataItem(i), self);
        } else if (columnDef.formatter) {
          // otherwise, use formatter
          formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, getDataItem(i), self);
        } else {
          // otherwise, use plain text
          formatterResult = '' + val;
        }
        applyFormatResultToCellNode(formatterResult, cellEl);
        len = cellEl.offsetWidth;
        if (len > max) { max = len; }
      }

        rowEl.remove();
        return max;
    }

    function getColHeaderWidth(columnDef) {
      var width = 0;
      //if (columnDef && (!columnDef.resizable || columnDef._autoCalcWidth === true)) return;
      var headerColElId = getUID() + columnDef.id;
      var headerColEl = document.getElementById(headerColElId);
      var dummyHeaderColElId = headerColElId + "_";
      if (headerColEl) {
        // headers have been created, use clone technique
        var clone = headerColEl.cloneNode(true);
        clone.id = dummyHeaderColElId;
        clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
        headerColEl.parentNode.insertBefore(clone, headerColEl);
        width = clone.offsetWidth;
        clone.parentNode.removeChild(clone);
      } else {
        // headers have not yet been created, create a new node
        let header = getHeader(columnDef);
        headerColEl = Utils.createDomElement('div', { id: dummyHeaderColElId, className: 'ui-state-default slick-header-column', }, header);
        Utils.createDomElement('span', { className: 'slick-column-name', innerHTML: sanitizeHtmlString(columnDef.name) }, headerColEl);
        clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
        headerColEl.classList.add(columnDef.headerCssClass || '');
        width = headerColEl.offsetWidth;
        header.removeChild(headerColEl);
      }
      return width;
    }

    function legacyAutosizeColumns() {
      var i, c,
          widths = [],
          shrinkLeeway = 0,
          total = 0,
          prevTotal,
          availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

      for (i = 0; i < columns.length; i++) {
        c = columns[i];
        widths.push(c.width);
        total += c.width;
        if (c.resizable) {
          shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
        }
      }

      // shrink
      prevTotal = total;
      while (total > availWidth && shrinkLeeway) {
        var shrinkProportion = (total - availWidth) / shrinkLeeway;
        for (i = 0; i < columns.length && total > availWidth; i++) {
          c = columns[i];
          var width = widths[i];
          if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
            continue;
          }
          var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
          var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
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
        var growProportion = availWidth / total;
        for (i = 0; i < columns.length && total < availWidth; i++) {
          c = columns[i];
          var currentWidth = widths[i];
          var growSize;

          if (!c.resizable || c.maxWidth <= currentWidth) {
            growSize = 0;
          } else {
            growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, (c.maxWidth - currentWidth) || 1000000) || 1;
          }
          total += growSize;
          widths[i] += (total <= availWidth ? growSize : 0);
        }
        if (prevTotal >= total) {  // avoid infinite loop
          break;
        }
        prevTotal = total;
      }

      var reRender = false;
      for (i = 0; i < columns.length; i++) {
        if (columns[i].rerenderOnResize && columns[i].width != widths[i]) {
          reRender = true;
        }
        columns[i].width = widths[i];
      }

      reRenderColumns(reRender);
    }

    function reRenderColumns(reRender) {
      applyColumnHeaderWidths();
      applyColumnGroupHeaderWidths();
      updateCanvasWidth(true);

      trigger(self.onAutosizeColumns, { "columns": columns});

      if (reRender) {
        invalidateAllRows();
        render();
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // General
    //////////////////////////////////////////////////////////////////////////////////////////////

    function trigger(evt, args, e) {
      e = e || new EventData(e, args);
      args = args || {};
      args.grid = self;
      return evt.notify(args, e, self);
    }

    function getEditorLock() {
      return options.editorLock;
    }

    function getEditController() {
      return editController;
    }

    function getColumnIndex(id) {
      return columnsById[id];
    }

    function applyColumnGroupHeaderWidths() {
      if (!treeColumns.hasDepth()) {
        return;
      }

      for (var depth = _groupHeadersL.length - 1; depth >= 0; depth--) {
        var groupColumns = treeColumns.getColumnsInDepth(depth);

        const groupHeaders = [_groupHeadersL[depth], _groupHeadersR[depth]];
        groupHeaders.forEach(function (groupHeader) {
          var currentColumnIndex = 0;

          Utils.width(groupHeader, i === 0 ? getHeadersWidthL() : getHeadersWidthR());

          groupHeader.children.forEach(function (groupHeaderColumn) {
            var m = Utils.storage.get(groupHeaderColumn, "column");

            m.width = 0;

            m.columns.forEach(function() {
              const headerColumn = groupHeader.nextElementSibling.children[currentColumnIndex++];
              m.width += headerColumn.offsetWidth;
            });

            Utils.width(groupHeaderColumn, m.width - headerColumnWidthDiff);
          });
        });
      }
    }

    function applyColumnHeaderWidths() {
      if (!initialized) {
        return;
      }

      let columnIndex = 0;
      _headers.forEach(function (header) {
        for (let i = 0; i < header.children.length; i++, columnIndex++) {
          const h = header.children[i];
          const col = columns[columnIndex] || {};
          const width = (col.width || 0) - headerColumnWidthDiff;
          if (Utils.width(h) !== width) {
            Utils.width(h, width);
          }
        }
      });

      updateColumnCaches();
    }

    function applyColumnWidths() {
      var x = 0, w, rule;
      for (var i = 0; i < columns.length; i++) {
        w = columns[i].width;

        rule = getColumnCssRules(i);
        rule.left.style.left = x + "px";
        rule.right.style.right = (((options.frozenColumn != -1 && i > options.frozenColumn) ? canvasWidthR : canvasWidthL) - x - w) + "px";

        // If this column is frozen, reset the css left value since the
        // column starts in a new viewport.
        if (options.frozenColumn == i) {
          x = 0;
        } else {
          x += columns[i].width;
        }
      }
    }

    function setSortColumn(columnId, ascending) {
      setSortColumns([{ columnId: columnId, sortAsc: ascending}]);
    }

    function getColumnByIndex(id) {
      let result = null;
      _headers.every(function (header) {
        const length = header.children.length;
        if (id < length) {
          result = header.children[id];
          return false;
        }
        id -= length;
        return true;
      });

      return result;
    }

    function setSortColumns(cols) {
      sortColumns = cols;

      const numberCols = options.numberedMultiColumnSort && sortColumns.length > 1;
      _headers.forEach(function (header) {
        let indicators = header.querySelectorAll(".slick-header-column-sorted");
        indicators.forEach(function (indicator) {
          indicator.classList.remove("slick-header-column-sorted");
        });

        indicators = header.querySelectorAll(".slick-sort-indicator");
        indicators.forEach(function (indicator) {
          indicator.classList.remove("slick-sort-indicator-asc");
          indicator.classList.remove("slick-sort-indicator-desc");
        });
        indicators = header.querySelectorAll(".slick-sort-indicator-numbered");
        indicators.forEach(function (el) {
          el.textContent = "";
        });
      });

      let i = 1;
      sortColumns.forEach(function (col) {
        if (col.sortAsc == null) {
          col.sortAsc = true;
        }

        const columnIndex = getColumnIndex(col.columnId);
        if (columnIndex != null) {
          const column = getColumnByIndex(columnIndex);
          if (column) {
            column.classList.add("slick-header-column-sorted");
            let indicator = column.querySelector(".slick-sort-indicator");
            indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");

            if (numberCols) {
              indicator = column.querySelector(".slick-sort-indicator-numbered");
              indicator.textContent = i;
            }
          }
        }
        i++;
      });
    }

    function getSortColumns() {
      return sortColumns;
    }

    function handleSelectedRangesChanged(e, ranges) {
      const ne = e.getNativeEvent();
      var previousSelectedRows = selectedRows.slice(0); // shallow copy previously selected rows for later comparison
      selectedRows = [];
      var hash = {};
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          if (!hash[j]) {  // prevent duplicates
            selectedRows.push(j);
            hash[j] = {};
          }
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
            if (canCellBeSelected(j, k)) {
              hash[j][columns[k].id] = options.selectedCellCssClass;
            }
          }
        }
      }

      setCellCssStyles(options.selectedCellCssClass, hash);

      if (simpleArrayEquals(previousSelectedRows, selectedRows)) {
        var caller = ne && ne.detail && ne.detail.caller || 'click';
        var newSelectedAdditions = getSelectedRows().filter(function(i) { return previousSelectedRows.indexOf(i) < 0 });
        var newSelectedDeletions = previousSelectedRows.filter(function(i) { return getSelectedRows().indexOf(i) < 0 });

        trigger(self.onSelectedRowsChanged, {
          rows: getSelectedRows(),
          previousSelectedRows: previousSelectedRows,
          caller : caller,
          changedSelectedRows: newSelectedAdditions,
          changedUnselectedRows: newSelectedDeletions
        }, e);
      }
    }

    // compare 2 simple arrays (integers or strings only, do not use to compare object arrays)
    function simpleArrayEquals(arr1, arr2) {
      return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
    }

    function getColumns() {
      return columns;
    }

    function updateColumnCaches() {
      // Pre-calculate cell boundaries.
      columnPosLeft = [];
      columnPosRight = [];
      var x = 0;
      for (var i = 0, ii = columns.length; i < ii; i++) {
        columnPosLeft[i] = x;
        columnPosRight[i] = x + columns[i].width;

        if (options.frozenColumn == i) {
          x = 0;
        } else {
          x += columns[i].width;
        }
      }
    }

    function updateColumnProps() {
      columnsById = {};
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].width) { columns[i].widthRequest = columns[i].width; }

        var m = columns[i] = Utils.extend({}, columnDefaults, columns[i]);
        m.autoSize = Utils.extend({}, columnAutosizeDefaults, m.autoSize);

        columnsById[m.id] = i;
        if (m.minWidth && m.width < m.minWidth) {
          m.width = m.minWidth;
        }
        if (m.maxWidth && m.width > m.maxWidth) {
          m.width = m.maxWidth;
        }
      }
    }

    function setColumns(columnDefinitions) {
      trigger(self.onBeforeSetColumns, { previousColumns: columns, newColumns: columnDefinitions, grid: self });

      var _treeColumns = new TreeColumns(columnDefinitions);
      if (_treeColumns.hasDepth()) {
        treeColumns = _treeColumns;
        columns = treeColumns.extractColumns();
      } else {
        columns = columnDefinitions;
      }

      updateColumnProps();
      updateColumnCaches();

      if (initialized) {
        setPaneVisibility();
        setOverflow();

        invalidateAllRows();
        createColumnHeaders();
        createColumnGroupHeaders();
        createColumnFooter();
        removeCssRules();
        createCssRules();
        resizeCanvas();
        updateCanvasWidth();
        applyColumnHeaderWidths();
        applyColumnWidths();
        handleScroll();
        if (getSelectionModel() && getSelectionModel().refreshSelections) {
          getSelectionModel().refreshSelections();
        }
      }
    }

    function getOptions() {
      return options;
    }

    function setOptions(args, suppressRender, suppressColumnSet, suppressSetOverflow) {
      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }

      makeActiveCellNormal();

      if (args.showColumnHeader !== undefined) {
        setColumnHeaderVisibility(args.showColumnHeader);
      }

      if (options.enableAddRow !== args.enableAddRow) {
        invalidateRow(getDataLength());
      }

      var originalOptions = Utils.extend(true, {}, options);
      options = Utils.extend(options, args);
      trigger(self.onSetOptions, { "optionsBefore": originalOptions, "optionsAfter": options });

      validateAndEnforceOptions();
      setFrozenOptions();

      _viewport.forEach(function (view) {
        view.style["overflow-y"] = options.autoHeight ? "hidden" : "auto";
      });
      if (!suppressRender) {
        render();
      }

      setScroller();
      if (!suppressSetOverflow) {
        setOverflow();
      }

      if (!suppressColumnSet) {
        setColumns(treeColumns.extractColumns());
      }

      if (options.enableMouseWheelScrollHandler && _viewport && (!slickMouseWheelInstances || slickMouseWheelInstances.length === 0)) {
        _viewport.forEach(function (view) {
          slickMouseWheelInstances.push(MouseWheel({
            element: view,
            onMouseWheel: handleMouseWheel
          }));
        });
      } else if (options.enableMouseWheelScrollHandler === false) {
        destroyAllInstances(slickMouseWheelInstances); // remove scroll handler when option is disable
      }
    }

    function validateAndEnforceOptions() {
      if (options.autoHeight) {
        options.leaveSpaceForNewRows = false;
      }
      if (options.forceFitColumns) {
        options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit;
        console.log("forceFitColumns option is deprecated - use autosizeColsMode");
      }
    }

    function setData(newData, scrollToTop) {
      data = newData;
      invalidateAllRows();
      updateRowCount();
      if (scrollToTop) {
        scrollTo(0);
      }
    }

    function getData() {
      return data;
    }

    function getDataLength() {
      if (data.getLength) {
        return data.getLength();
      } else {
        return data && data.length || 0;
      }
    }

    function getDataLengthIncludingAddNew() {
      return getDataLength() + (!options.enableAddRow ? 0
        : (!pagingActive || pagingIsLastPage ? 1 : 0)
      );
    }

    function getDataItem(i) {
      if (data.getItem) {
        return data.getItem(i);
      } else {
        return data[i];
      }
    }

    function getTopPanel() {
      return _topPanels[0];
    }

    function getTopPanels() {
      return _topPanels;
    }

    function togglePanelVisibility(option, container, visible, animate) {
      var animated = (animate === false) ? false : true;

      if (options[option] != visible) {
        options[option] = visible;
        if (visible) {
          if (animated) {
            Utils.slideDown(container, resizeCanvas);
              return;
          }
          show(container);
          resizeCanvas();
        } else {
          if (animated) {
            Utils.slideUp(container, resizeCanvas);
            return;
          }
          hide(container);
          resizeCanvas();
        }
      }
    }

    function setTopPanelVisibility(visible, animate) {
      togglePanelVisibility("showTopPanel", _topPanelScrollers, visible, animate);
    }

    function setHeaderRowVisibility(visible, animate) {
      togglePanelVisibility("showHeaderRow", _headerRowScroller, visible, animate);
    }

    function setColumnHeaderVisibility(visible, animate) {
      togglePanelVisibility("showColumnHeader", _headerScroller, visible, animate);
    }

    function setFooterRowVisibility(visible, animate) {
      togglePanelVisibility("showFooterRow", _footerRowScroller, visible, animate);
    }

    function setPreHeaderPanelVisibility(visible, animate) {
      togglePanelVisibility("showPreHeaderPanel", [_preHeaderPanelScroller, _preHeaderPanelScrollerR], visible, animate);
    }

    function getContainerNode() {
      return _container;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering / Scrolling

    function getRowTop(row) {
      return options.rowHeight * row - offset;
    }

    function getRowFromPosition(y) {
      return Math.floor((y + offset) / options.rowHeight);
    }

    function scrollTo(y) {
      y = Math.max(y, 0);
      y = Math.min(y, th - Utils.height(_viewportScrollContainerY) + ((viewportHasHScroll || hasFrozenColumns()) ? scrollbarDimensions.height : 0));

      var oldOffset = offset;

      page = Math.min(n - 1, Math.floor(y / ph));
      offset = Math.round(page * cj);
      var newScrollTop = y - offset;

      if (offset != oldOffset) {
        var range = getVisibleRange(newScrollTop);
        cleanupRows(range);
        updateRowPositions();
      }

      if (prevScrollTop != newScrollTop) {
        vScrollDir = (prevScrollTop + oldOffset < newScrollTop + offset) ? 1 : -1;
        lastRenderedScrollTop = ( scrollTop = prevScrollTop = newScrollTop );

        if (hasFrozenColumns()) {
          _viewportTopL.scrollTop = newScrollTop;
        }

        if (hasFrozenRows) {
          _viewportBottomL.scrollTop = _viewportBottomR.scrollTop = newScrollTop;
        }

        _viewportScrollContainerY.scrollTop = newScrollTop;

        trigger(self.onViewportChanged, {});
      }
    }

    function defaultFormatter(row, cell, value, columnDef, dataContext, grid) {
      if (value == null) {
        return "";
      } else {
        return (value + "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      }
    }

    function getFormatter(row, column) {
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);

      // look up by id, then index
      var columnOverrides = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);

      return (columnOverrides && columnOverrides.formatter) ||
          (rowMetadata && rowMetadata.formatter) ||
          column.formatter ||
          (options.formatterFactory && options.formatterFactory.getFormatter(column)) ||
          options.defaultFormatter;
    }

    function getEditor(row, cell) {
      var column = columns[cell];
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      var columnMetadata = rowMetadata && rowMetadata.columns;

      if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
        return columnMetadata[column.id].editor;
      }
      if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
        return columnMetadata[cell].editor;
      }

      return column.editor || (options.editorFactory && options.editorFactory.getEditor(column));
    }

    function getDataItemValueForColumn(item, columnDef) {
      if (options.dataItemColumnValueExtractor) {
        return options.dataItemColumnValueExtractor(item, columnDef);
      }
      return item[columnDef.field];
    }

    function appendRowHtml(stringArrayL, stringArrayR, row, range, dataLength) {
      var d = getDataItem(row);
      var dataLoading = row < dataLength && !d;
      var rowCss = "slick-row" +
          (hasFrozenRows && row <= options.frozenRow? ' frozen': '') +
          (dataLoading ? " loading" : "") +
          (row === activeRow && options.showCellSelection ? " active" : "") +
          (row % 2 == 1 ? " odd" : " even");

      if (!d) {
        rowCss += " " + options.addNewRowCssClass;
      }

      var metadata = data.getItemMetadata && data.getItemMetadata(row);

      if (metadata && metadata.cssClasses) {
        rowCss += " " + metadata.cssClasses;
      }

      var frozenRowOffset = getFrozenRowOffset(row);

      var rowHtml = `<div class="ui-widget-content ${rowCss}" style="top:${(getRowTop(row) - frozenRowOffset)}px">`;

      stringArrayL.push(rowHtml);

      if (hasFrozenColumns()) {
        stringArrayR.push(rowHtml);
      }

      var colspan, m;
      for (var i = 0, ii = columns.length; i < ii; i++) {
        m = columns[i];
        colspan = 1;
        if (metadata && metadata.columns) {
          var columnData = metadata.columns[m.id] || metadata.columns[i];
          colspan = (columnData && columnData.colspan) || 1;
          if (colspan === "*") {
            colspan = ii - i;
          }
        }

        // Do not render cells outside of the viewport.
        if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
          if (!m.alwaysRenderColumn && columnPosLeft[i] > range.rightPx) {
            // All columns to the right are outside the range.
            break;
          }

          if (hasFrozenColumns() && ( i > options.frozenColumn )) {
            appendCellHtml(stringArrayR, row, i, colspan, d);
          } else {
            appendCellHtml(stringArrayL, row, i, colspan, d);
          }
        } else if (m.alwaysRenderColumn || (hasFrozenColumns() && i <= options.frozenColumn)) {
          appendCellHtml(stringArrayL, row, i, colspan, d);
        }

        if (colspan > 1) {
          i += (colspan - 1);
        }
      }

      stringArrayL.push("</div>");

      if (hasFrozenColumns()) {
        stringArrayR.push("</div>");
      }
    }

    function appendCellHtml(stringArray, row, cell, colspan, item) {
      // stringArray: stringBuilder containing the HTML parts
      // row, cell: row and column index
      // colspan: HTML colspan
      // item: grid data for row

      var m = columns[cell];
      var cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");

      if (hasFrozenColumns() && cell <= options.frozenColumn) {
        cellCss += (" frozen");
      }

      if (row === activeRow && cell === activeCell && options.showCellSelection) {
        cellCss += (" active");
      }

      // TODO:  merge them together in the setter
      for (var key in cellCssClasses) {
        if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
          cellCss += (" " + cellCssClasses[key][row][m.id]);
        }
      }

      var value = null, formatterResult = '';
      if (item) {
        value = getDataItemValueForColumn(item, m);
        formatterResult =  getFormatter(row, m)(row, cell, value, m, item, self);
        if (formatterResult === null || formatterResult === undefined) {
          formatterResult = '';
        }
      }

      // get addl css class names from object type formatter return and from string type return of onBeforeAppendCell
      const evt = trigger(self.onBeforeAppendCell, { row: row, cell: cell, value: value, dataContext: item });
      var addlCssClasses = evt.getReturnValue() || '';
      addlCssClasses += (formatterResult && formatterResult.addClasses ? (addlCssClasses ? ' ' : '') + formatterResult.addClasses : '');
      var toolTip = formatterResult && formatterResult.toolTip ? "title='" + formatterResult.toolTip + "'" : '';

      var customAttrStr = '';
      if (m.hasOwnProperty('cellAttrs') && m.cellAttrs instanceof Object) {
        for (var key in m.cellAttrs) {
          if (m.cellAttrs.hasOwnProperty(key)) {
            customAttrStr += ' ' + key + '="' + m.cellAttrs[key] + '" ';
          }
        }
      }

      stringArray.push(`<div class="${cellCss + (addlCssClasses ? ' ' + addlCssClasses : '')}" ${toolTip + customAttrStr}>`);

      // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
      if (item) {
        stringArray.push(Object.prototype.toString.call(formatterResult)  !== '[object Object]' ? formatterResult : formatterResult.text);
      }

      stringArray.push("</div>");

      rowsCache[row].cellRenderQueue.push(cell);
      rowsCache[row].cellColSpans[cell] = colspan;
    }


    function cleanupRows(rangeToKeep) {
      for (var i in rowsCache) {
        var removeFrozenRow = true;

        if (hasFrozenRows
          && ( ( options.frozenBottom && i >= actualFrozenRow ) // Frozen bottom rows
            || ( !options.frozenBottom && i <= actualFrozenRow ) // Frozen top rows
            )
          ) {
          removeFrozenRow = false;
        }

        if (( ( i = parseInt(i, 10)) !== activeRow )
          && ( i < rangeToKeep.top || i > rangeToKeep.bottom )
          && ( removeFrozenRow )
          ) {
          removeRowFromCache(i);
        }
      }
      if (options.enableAsyncPostRenderCleanup) { startPostProcessingCleanup(); }
    }

    function invalidate() {
      updateRowCount();
      invalidateAllRows();
      render();
    }

    function invalidateAllRows() {
      if (currentEditor) {
        makeActiveCellNormal();
      }
      for (var row in rowsCache) {
        removeRowFromCache(row);
      }
      if (options.enableAsyncPostRenderCleanup) { startPostProcessingCleanup(); }
    }

    function queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
      postProcessgroupId++;

      // store and detach node for later async cleanup
      for (var columnIdx in postProcessedRow) {
        if (postProcessedRow.hasOwnProperty(columnIdx)) {
          postProcessedCleanupQueue.push({
            actionType: 'C',
            groupId: postProcessgroupId,
            node: cacheEntry.cellNodesByColumnIdx[ columnIdx | 0],
            columnIdx: columnIdx | 0,
            rowIdx: rowIdx
          });
        }
      }
      postProcessedCleanupQueue.push({
        actionType: 'R',
        groupId: postProcessgroupId,
        node: cacheEntry.rowNode
      });
      cacheEntry.rowNode.forEach(function (node) {
        node.remove();
      });
    }

    function queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
      postProcessedCleanupQueue.push({
        actionType: 'C',
        groupId: postProcessgroupId,
        node: cellnode,
        columnIdx: columnIdx,
        rowIdx: rowIdx
      });
      cellnode.remove();
    }

    function removeRowFromCache(row) {
      var cacheEntry = rowsCache[row];
      if (!cacheEntry) {
        return;
      }

      if (options.enableAsyncPostRenderCleanup && postProcessedRows[row]) {
        queuePostProcessedRowForCleanup(cacheEntry, postProcessedRows[row], row);
      } else {
        cacheEntry.rowNode.forEach(function (node) {
          if (node.parentElement) {
            node.parentElement.removeChild(node);
          }
        });
      }

      delete rowsCache[row];
      delete postProcessedRows[row];
      renderedRows--;
      counter_rows_removed++;
    }

    function invalidateRows(rows) {
      var i, rl;
      if (!rows || !rows.length) {
        return;
      }
      vScrollDir = 0;
      rl = rows.length;
      for (i = 0;  i < rl; i++) {
        if (currentEditor && activeRow === rows[i]) {
          makeActiveCellNormal();
        }
        if (rowsCache[rows[i]]) {
          removeRowFromCache(rows[i]);
        }
      }
      if (options.enableAsyncPostRenderCleanup) { startPostProcessingCleanup(); }
    }

    function invalidateRow(row) {
      if (!row && row !== 0) { return; }
      invalidateRows([row]);
    }

    function applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
        if (formatterResult === null || formatterResult === undefined) { formatterResult = ''; }
        if (Object.prototype.toString.call(formatterResult)  !== '[object Object]') {
          cellNode.innerHTML = sanitizeHtmlString(formatterResult);
          return;
        }
        cellNode.innerHTML = sanitizeHtmlString(formatterResult.text);
        if (formatterResult.removeClasses && !suppressRemove) {
          const classes = formatterResult.removeClasses.split(" ");
          classes.forEach(function (c) {
            cellNode.classList.remove(c);
          });
        }
        if (formatterResult.addClasses) {
          const classes = formatterResult.addClasses.split(" ");
          classes.forEach(function (c) {
            cellNode.classList.add(c);
          });
        }
        if (formatterResult.toolTip) {
          cellNode.setAttribute("title", formatterResult.toolTip);
        }
    }

    function updateCell(row, cell) {
      var cellNode = getCellNode(row, cell);
      if (!cellNode) {
        return;
      }

      var m = columns[cell], d = getDataItem(row);
      if (currentEditor && activeRow === row && activeCell === cell) {
        currentEditor.loadValue(d);
      } else {
        var formatterResult =  d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d, self) : "";
        applyFormatResultToCellNode(formatterResult, cellNode);
        invalidatePostProcessingResults(row);
      }
    }

    function updateRow(row) {
      var cacheEntry = rowsCache[row];
      if (!cacheEntry) {
        return;
      }

      ensureCellNodesInRowsCache(row);

      var formatterResult, d = getDataItem(row);

      for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
          continue;
        }

        columnIdx = columnIdx | 0;
        var m = columns[columnIdx],
            node = cacheEntry.cellNodesByColumnIdx[columnIdx];

        if (row === activeRow && columnIdx === activeCell && currentEditor) {
          currentEditor.loadValue(d);
        } else if (d) {
          formatterResult =  getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d, self);
          applyFormatResultToCellNode(formatterResult, node);
        } else {
          node.innerHTML = "";
        }
      }

      invalidatePostProcessingResults(row);
    }

    function getViewportHeight() {
      if (!options.autoHeight || options.frozenColumn != -1) {
        topPanelH = (options.showTopPanel) ? options.topPanelHeight + getVBoxDelta(_topPanelScrollers[0]) : 0;
        headerRowH = ( options.showHeaderRow ) ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0;
        footerRowH = ( options.showFooterRow ) ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0;
      }

      if (options.autoHeight) {
        let fullHeight = _paneHeaderL.offsetHeight;
        fullHeight += ( options.showHeaderRow ) ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0;
        fullHeight += ( options.showFooterRow ) ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0;
        fullHeight += (getCanvasWidth() > viewportW) ? scrollbarDimensions.height : 0;

        viewportH = options.rowHeight
          * getDataLengthIncludingAddNew()
          + ( ( options.frozenColumn == -1 ) ? fullHeight : 0 );
      } else {
        const columnNamesH = (options.showColumnHeader) ? Utils.toFloat(Utils.height(_headerScroller[0])) + getVBoxDelta(_headerScroller[0]) : 0;
        const preHeaderH = (options.createPreHeaderPanel && options.showPreHeaderPanel) ? options.preHeaderPanelHeight + getVBoxDelta(_preHeaderPanelScroller) : 0;

        const style = getComputedStyle(_container);
        viewportH = Utils.toFloat(style.height)
          - Utils.toFloat(style.paddingTop)
          - Utils.toFloat(style.paddingBottom)
          - columnNamesH
          - topPanelH
          - headerRowH
          - footerRowH
          - preHeaderH;
      }

      numVisibleRows = Math.ceil(viewportH / options.rowHeight);
      return viewportH;
    }

    function getViewportWidth() {
      viewportW = parseFloat(Utils.innerSize(_container, 'width'));
    }

    function resizeCanvas() {
      if (!initialized) { return; }
      paneTopH = 0;
      paneBottomH = 0;
      viewportTopH = 0;
      viewportBottomH = 0;

      getViewportWidth();
      getViewportHeight();

      // Account for Frozen Rows
      if (hasFrozenRows) {
        if (options.frozenBottom) {
          paneTopH = viewportH - frozenRowsHeight - scrollbarDimensions.height;
          paneBottomH = frozenRowsHeight + scrollbarDimensions.height;
        } else {
          paneTopH = frozenRowsHeight;
          paneBottomH = viewportH - frozenRowsHeight;
        }
      } else {
        paneTopH = viewportH;
      }

      // The top pane includes the top panel and the header row
      paneTopH += topPanelH + headerRowH + footerRowH;

      if (hasFrozenColumns() && options.autoHeight) {
        paneTopH += scrollbarDimensions.height;
      }

      // The top viewport does not contain the top panel or header row
      viewportTopH = paneTopH - topPanelH - headerRowH - footerRowH;

      if (options.autoHeight) {
        if (hasFrozenColumns()) {
          const style = getComputedStyle(_headerScrollerL);
          Utils.height(_container, paneTopH + Utils.toFloat(style.height));
        }

        _paneTopL.style.position = "relative";
      }

      Utils.setStyleSize(_paneTopL, "top", Utils.height(_paneHeaderL) || (options.showHeaderRow ? options.headerRowHeight : 0) + (options.showPreHeaderPanel ? options.preHeaderPanelHeight : 0));
      Utils.height(_paneTopL, paneTopH);

      var paneBottomTop = _paneTopL.offsetTop + paneTopH;

      if (!options.autoHeight) {
        Utils.height(_viewportTopL, viewportTopH);
      }

      if (hasFrozenColumns()) {
        Utils.setStyleSize(_paneTopR, "top", Utils.height(_paneHeaderL));
        Utils.height(_paneTopR, paneTopH);

        Utils.height(_viewportTopR, viewportTopH);

        if (hasFrozenRows) {
          Utils.setStyleSize(_paneBottomL, "top", paneBottomTop);
          Utils.height(_paneBottomL, paneBottomH);

          Utils.setStyleSize(_paneBottomR, "top", paneBottomTop);
          Utils.height(_paneBottomR, paneBottomH);

          Utils.height(_viewportBottomR, paneBottomH);
        }
      } else {
        if (hasFrozenRows) {
          Utils.width(_paneBottomL, "100%");
          Utils.height(_paneBottomL, paneBottomH);
          Utils.setStyleSize(_paneBottomL, "top", paneBottomTop);
        }
      }

      if (hasFrozenRows) {
        Utils.height(_viewportBottomL, paneBottomH);

        if (options.frozenBottom) {
          Utils.height(_canvasBottomL, frozenRowsHeight);

          if (hasFrozenColumns()) {
            Utils.height(_canvasBottomR, frozenRowsHeight);
          }
        } else {
          Utils.height(_canvasTopL, frozenRowsHeight);

          if (hasFrozenColumns()) {
            Utils.height(_canvasTopR, frozenRowsHeight);
          }
        }
      } else {
        Utils.height(_viewportTopR, viewportTopH);
      }

      if (!scrollbarDimensions || !scrollbarDimensions.width) {
        scrollbarDimensions = measureScrollbar();
      }

      if (options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit) {
        autosizeColumns();
      }

      updateRowCount();
      handleScroll();
      // Since the width has changed, force the render() to reevaluate virtually rendered cells.
      lastRenderedScrollLeft = -1;
      render();
    }

    function updatePagingStatusFromView(pagingInfo) {
      pagingActive = (pagingInfo.pageSize !== 0);
      pagingIsLastPage = (pagingInfo.pageNum == pagingInfo.totalPages - 1);
    }

    function updateRowCount() {
      if (!initialized) { return; }

      var dataLength = getDataLength();
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      var numberOfRows = 0;
      var oldH = (hasFrozenRows && !options.frozenBottom) ? Utils.height(_canvasBottomL) : Utils.height(_canvasTopL);

      if (hasFrozenRows ) {
        var numberOfRows = getDataLength() - options.frozenRow;
      } else {
        var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
      }

      var tempViewportH = Utils.height(_viewportScrollContainerY);
      var oldViewportHasVScroll = viewportHasVScroll;
      // with autoHeight, we do not need to accommodate the vertical scroll bar
      viewportHasVScroll = options.alwaysShowVerticalScroll || !options.autoHeight && (numberOfRows * options.rowHeight > tempViewportH);

      makeActiveCellNormal();

      // remove the rows that are now outside of the data range
      // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
      var r1 = dataLength - 1;
      for (var i in rowsCache) {
        if (i > r1) {
          removeRowFromCache(i);
        }
      }
      if (options.enableAsyncPostRenderCleanup) {
        startPostProcessingCleanup();
      }

      if (activeCellNode && activeRow > r1) {
        resetActiveCell();
      }

      var oldH = h;
      if (options.autoHeight) {
        h =  options.rowHeight * numberOfRows;
      } else {
        th = Math.max(options.rowHeight * numberOfRows, tempViewportH - scrollbarDimensions.height);
        if (th < maxSupportedCssHeight) {
          // just one page
          h = ph = th;
          n = 1;
          cj = 0;
        } else {
          // break into pages
          h = maxSupportedCssHeight;
          ph = h / 100;
          n = Math.floor(th / ph);
          cj = (th - h) / (n - 1);
        }
      }

      if (h !== oldH) {
        if (hasFrozenRows && !options.frozenBottom) {
          Utils.height(_canvasBottomL, h);

          if (hasFrozenColumns()) {
            Utils.height(_canvasBottomR, h);
          }
        } else {
          Utils.height(_canvasTopL, h);
          Utils.height(_canvasTopR, h);
        }

        scrollTop = _viewportScrollContainerY.scrollTop;
      }

      var oldScrollTopInRange = (scrollTop + offset <= th - tempViewportH);

      if (th == 0 || scrollTop == 0) {
        page = offset = 0;
      } else if (oldScrollTopInRange) {
        // maintain virtual position
        scrollTo(scrollTop + offset);
      } else {
        // scroll to bottom
        scrollTo(th - tempViewportH + scrollbarDimensions.height);
      }

      if (h != oldH && options.autoHeight) {
        resizeCanvas();
      }

      if (options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll != viewportHasVScroll) {
        autosizeColumns();
      }
      updateCanvasWidth(false);
    }

    function getVisibleRange(viewportTop, viewportLeft) {
      if (viewportTop == null) {
        viewportTop = scrollTop;
      }
      if (viewportLeft == null) {
        viewportLeft = scrollLeft;
      }

      return {
        top: getRowFromPosition(viewportTop),
        bottom: getRowFromPosition(viewportTop + viewportH) + 1,
        leftPx: viewportLeft,
        rightPx: viewportLeft + viewportW
      };
    }

    function getRenderedRange(viewportTop, viewportLeft) {
      var range = getVisibleRange(viewportTop, viewportLeft);
      var buffer = Math.round(viewportH / options.rowHeight);
      var minBuffer = options.minRowBuffer;

      if (vScrollDir == -1) {
        range.top -= buffer;
        range.bottom += minBuffer;
      } else if (vScrollDir == 1) {
        range.top -= minBuffer;
        range.bottom += buffer;
      } else {
        range.top -= minBuffer;
        range.bottom += minBuffer;
      }

      range.top = Math.max(0, range.top);
      range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom);

      range.leftPx -= viewportW;
      range.rightPx += viewportW;

      range.leftPx = Math.max(0, range.leftPx);
      range.rightPx = Math.min(canvasWidth, range.rightPx);

      return range;
    }

    function ensureCellNodesInRowsCache(row) {
      const cacheEntry = rowsCache[row];
      if (cacheEntry) {
        if (cacheEntry.cellRenderQueue.length) {
          const rowNode = cacheEntry.rowNode;
          let children = Array.from(rowNode[0].children);
          if (rowNode.length > 1) {
            children = children.concat(Array.from(rowNode[1].children));
          }

          let i = children.length - 1;
          while (cacheEntry.cellRenderQueue.length) {
            const columnIdx = cacheEntry.cellRenderQueue.pop();
            cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i--];
          }
        }
      }
    }

    function cleanUpCells(range, row) {
      // Ignore frozen rows
      if (hasFrozenRows
        && ( ( options.frozenBottom && row > actualFrozenRow ) // Frozen bottom rows
          || ( row <= actualFrozenRow )                     // Frozen top rows
          )
        ) {
        return;
      }

      var totalCellsRemoved = 0;
      var cacheEntry = rowsCache[row];

      // Remove cells outside the range.
      var cellsToRemove = [];
      for (var i in cacheEntry.cellNodesByColumnIdx) {
        // I really hate it when people mess with Array.prototype.
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i)) {
          continue;
        }

        // This is a string, so it needs to be cast back to a number.
        i = i | 0;

        // Ignore frozen columns
        if (i <= options.frozenColumn) {
          continue;
        }

        // Ignore alwaysRenderedColumns
        if (Array.isArray(columns) && columns[i] && columns[i].alwaysRenderColumn){
          continue;
        }

        var colspan = cacheEntry.cellColSpans[i];
        if (columnPosLeft[i] > range.rightPx ||
          columnPosRight[Math.min(columns.length - 1, i + colspan - 1)] < range.leftPx) {
          if (!(row == activeRow && i == activeCell)) {
            cellsToRemove.push(i);
          }
        }
      }

      var cellToRemove, cellNode;
      while ((cellToRemove = cellsToRemove.pop()) != null) {
        cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove];

        if (options.enableAsyncPostRenderCleanup && postProcessedRows[row] && postProcessedRows[row][cellToRemove]) {
          queuePostProcessedCellForCleanup(cellNode, cellToRemove, row);
        } else {
          cellNode.parentElement.removeChild(cellNode);
        }

        delete cacheEntry.cellColSpans[cellToRemove];
        delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
        if (postProcessedRows[row]) {
          delete postProcessedRows[row][cellToRemove];
        }
        totalCellsRemoved++;
      }
    }

    function cleanUpAndRenderCells(range) {
      var cacheEntry;
      var stringArray = [];
      var processedRows = [];
      var cellsAdded;
      var totalCellsAdded = 0;
      var colspan;

      for (var row = range.top, btm = range.bottom; row <= btm; row++) {
        cacheEntry = rowsCache[row];
        if (!cacheEntry) {
          continue;
        }

        // cellRenderQueue populated in renderRows() needs to be cleared first
        ensureCellNodesInRowsCache(row);

        cleanUpCells(range, row);

        // Render missing cells.
        cellsAdded = 0;

        var metadata = data.getItemMetadata && data.getItemMetadata(row);
        metadata = metadata && metadata.columns;

        var d = getDataItem(row);

        // TODO:  shorten this loop (index? heuristics? binary search?)
        for (var i = 0, ii = columns.length; i < ii; i++) {
          // Cells to the right are outside the range.
          if (columnPosLeft[i] > range.rightPx) {
            break;
          }

          // Already rendered.
          if ((colspan = cacheEntry.cellColSpans[i]) != null) {
            i += (colspan > 1 ? colspan - 1 : 0);
            continue;
          }

          colspan = 1;
          if (metadata) {
            var columnData = metadata[columns[i].id] || metadata[i];
            colspan = (columnData && columnData.colspan) || 1;
            if (colspan === "*") {
              colspan = ii - i;
            }
          }

          if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
            appendCellHtml(stringArray, row, i, colspan, d);
            cellsAdded++;
          }

          i += (colspan > 1 ? colspan - 1 : 0);
        }

        if (cellsAdded) {
          totalCellsAdded += cellsAdded;
          processedRows.push(row);
        }
      }

      if (!stringArray.length) {
        return;
      }

      var x = Utils.createDomElement('div', { innerHTML: sanitizeHtmlString(stringArray.join('')) });
      var processedRow;
      var node;
      while ((processedRow = processedRows.pop()) != null) {
        cacheEntry = rowsCache[processedRow];
        var columnIdx;
        while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
          node = x.lastChild;

          if (hasFrozenColumns() && (columnIdx > options.frozenColumn)) {
            cacheEntry.rowNode[1].appendChild(node);
          } else {
            cacheEntry.rowNode[0].appendChild(node);
          }
          cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
        }
      }
    }

    function renderRows(range) {
      var stringArrayL = [],
        stringArrayR = [],
        rows = [],
        needToReselectCell = false,
        dataLength = getDataLength();

      for (var i = range.top, ii = range.bottom; i <= ii; i++) {
        if (rowsCache[i] || ( hasFrozenRows && options.frozenBottom && i == getDataLength() )) {
          continue;
        }
        renderedRows++;
        rows.push(i);

        // Create an entry right away so that appendRowHtml() can
        // start populating it.
        rowsCache[i] = {
          "rowNode": null,

          // ColSpans of rendered cells (by column idx).
          // Can also be used for checking whether a cell has been rendered.
          "cellColSpans": [],

          // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
          "cellNodesByColumnIdx": [],

          // Column indices of cell nodes that have been rendered, but not yet indexed in
          // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
          // end of the row.
          "cellRenderQueue": []
        };

        appendRowHtml(stringArrayL, stringArrayR, i, range, dataLength);
        if (activeCellNode && activeRow === i) {
          needToReselectCell = true;
        }
        counter_rows_rendered++;
      }

      if (!rows.length) { return; }

      let x = Utils.createDomElement('div', { innerHTML: sanitizeHtmlString(stringArrayL.join('')) });
      let xRight = Utils.createDomElement('div', { innerHTML: sanitizeHtmlString(stringArrayR.join('')) });

      for (var i = 0, ii = rows.length; i < ii; i++) {
        if (( hasFrozenRows ) && ( rows[i] >= actualFrozenRow )) {
            if (hasFrozenColumns()) {
                rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild];
                _canvasBottomL.appendChild(x.firstChild);
                _canvasBottomR.appendChild(xRight.firstChild);
            } else {
                rowsCache[rows[i]].rowNode = [x.firstChild];
                _canvasBottomL.appendChild(x.firstChild);
            }
        } else if (hasFrozenColumns()) {
            rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild];
            _canvasTopL.appendChild(x.firstChild);
            _canvasTopR.appendChild(xRight.firstChild);
        } else {
            rowsCache[rows[i]].rowNode = [x.firstChild];
            _canvasTopL.appendChild(x.firstChild);
        }
      }

      if (needToReselectCell) {
        activeCellNode = getCellNode(activeRow, activeCell);
      }
    }

    function startPostProcessing() {
      if (!options.enableAsyncPostRender) {
        return;
      }
      clearTimeout(h_postrender);
      h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
    }

    function startPostProcessingCleanup() {
      if (!options.enableAsyncPostRenderCleanup) {
        return;
      }
      clearTimeout(h_postrenderCleanup);
      h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
    }

    function invalidatePostProcessingResults(row) {
      // change status of columns to be re-rendered
      for (var columnIdx in postProcessedRows[row]) {
        if (postProcessedRows[row].hasOwnProperty(columnIdx)) {
          postProcessedRows[row][columnIdx] = 'C';
        }
      }
      postProcessFromRow = Math.min(postProcessFromRow, row);
      postProcessToRow = Math.max(postProcessToRow, row);
      startPostProcessing();
    }

    function updateRowPositions() {
      for (var row in rowsCache) {
        var rowNumber = row ? parseInt(row) : 0;
        Utils.setStyleSize("top", getRowTop(rowNumber));
      }
    }

    function render() {
      if (!initialized) { return; }

      scrollThrottle.dequeue();

      var visible = getVisibleRange();
      var rendered = getRenderedRange();

      // remove rows no longer in the viewport
      cleanupRows(rendered);

      // add new rows & missing cells in existing rows
      if (lastRenderedScrollLeft != scrollLeft) {
        if (hasFrozenRows) {
          var renderedFrozenRows = Utils.extend(true, {}, rendered);

          if (options.frozenBottom) {
            renderedFrozenRows.top = actualFrozenRow;
            renderedFrozenRows.bottom = getDataLength();
          } else {
            renderedFrozenRows.top = 0;
            renderedFrozenRows.bottom = options.frozenRow;
          }
          cleanUpAndRenderCells(renderedFrozenRows);
        }
        cleanUpAndRenderCells(rendered);
      }

      // render missing rows
      renderRows(rendered);

      // Render frozen rows
      if (hasFrozenRows) {
        if (options.frozenBottom) {
          renderRows({
            top: actualFrozenRow, bottom: getDataLength() - 1, leftPx: rendered.leftPx, rightPx: rendered.rightPx
          });
        } else {
          renderRows({
            top: 0, bottom: options.frozenRow - 1, leftPx: rendered.leftPx, rightPx: rendered.rightPx
          });
        }
      }

      postProcessFromRow = visible.top;
      postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom);
      startPostProcessing();

      lastRenderedScrollTop = scrollTop;
      lastRenderedScrollLeft = scrollLeft;
      h_render = null;
      trigger(self.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: self });
    }

    function handleHeaderRowScroll() {
      var scrollLeft = _headerRowScrollContainer.scrollLeft;
      if (scrollLeft != _viewportScrollContainerX.scrollLeft) {
        _viewportScrollContainerX.scrollLeft = scrollLeft;
      }
    }

    function handleFooterRowScroll() {
      var scrollLeft = _footerRowScrollContainer.scrollLeft;
      if (scrollLeft != _viewportScrollContainerX.scrollLeft) {
        _viewportScrollContainerX.scrollLeft = scrollLeft;
      }
    }

    function handlePreHeaderPanelScroll() {
      handleElementScroll(_preHeaderPanelScroller);
    }

    function handleElementScroll(element) {
      var scrollLeft = element.scrollLeft;
      if (scrollLeft != _viewportScrollContainerX.scrollLeft) {
        _viewportScrollContainerX.scrollLeft = scrollLeft;
      }
    }

    function handleScroll() {
      scrollTop = _viewportScrollContainerY.scrollTop;
      scrollLeft = _viewportScrollContainerX.scrollLeft;
      return _handleScroll(false);
    }

    function _handleScroll(isMouseWheel) {
      var maxScrollDistanceY = _viewportScrollContainerY.scrollHeight - _viewportScrollContainerY.clientHeight;
      var maxScrollDistanceX = _viewportScrollContainerY.scrollWidth - _viewportScrollContainerY.clientWidth;

      // Protect against erroneous clientHeight/Width greater than scrollHeight/Width.
      // Sometimes seen in Chrome.
      maxScrollDistanceY = Math.max(0, maxScrollDistanceY);
      maxScrollDistanceX = Math.max(0, maxScrollDistanceX);

      // Ceiling the max scroll values
      if (scrollTop > maxScrollDistanceY) {
        scrollTop = maxScrollDistanceY;
      }
      if (scrollLeft > maxScrollDistanceX) {
        scrollLeft = maxScrollDistanceX;
      }

      var vScrollDist = Math.abs(scrollTop - prevScrollTop);
      var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);

      if (hScrollDist) {
        prevScrollLeft = scrollLeft;

        // adjust scroll position of all div containers when scrolling the grid
        // user can optionally provide "scrollDebounceDelay" grid option if flickering are a problem
        Utils.debounce(() => {
          _viewportScrollContainerX.scrollLeft = scrollLeft;
          _headerScrollContainer.scrollLeft = scrollLeft;
          _topPanelScrollers[0].scrollLeft = scrollLeft;
          if (options.createFooterRow) {
            _footerRowScrollContainer.scrollLeft = scrollLeft;
          }
          if (options.createPreHeaderPanel) {
            if (hasFrozenColumns()) {
              _preHeaderPanelScrollerR.scrollLeft = scrollLeft;
            } else {
              _preHeaderPanelScroller.scrollLeft = scrollLeft;
            }
          }

          if (hasFrozenColumns()) {
            if (hasFrozenRows) {
              _viewportTopR.scrollLeft = scrollLeft;
            }
            _headerRowScrollerR.scrollLeft = scrollLeft; // right header row scrolling with frozen grid
          } else {
            if (hasFrozenRows) {
              _viewportTopL.scrollLeft = scrollLeft;
            }
            _headerRowScrollerL.scrollLeft = scrollLeft; // left header row scrolling with regular grid
          }
        }, options.scrollDebounceDelay)();
      }

      // autoheight suppresses vertical scrolling, but editors can create a div larger than
      // the row vertical size, which can lead to a vertical scroll bar appearing temporarily
      // while the editor is displayed. this is not part of the grid scrolling, so we should ignore it
      if (vScrollDist && !options.autoHeight) {
        vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
        prevScrollTop = scrollTop;

        if (isMouseWheel) {
          _viewportScrollContainerY.scrollTop = scrollTop;
        }

        if (hasFrozenColumns()) {
          if (hasFrozenRows && !options.frozenBottom) {
            _viewportBottomL.scrollTop = scrollTop;
          } else {
            _viewportTopL.scrollTop = scrollTop;
          }
        }

        // switch virtual pages if needed
        if (vScrollDist < viewportH) {
          scrollTo(scrollTop + offset);
        } else {
          var oldOffset = offset;
          if (h == viewportH) {
            page = 0;
          } else {
            page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
          }
          offset = Math.round(page * cj);
          if (oldOffset != offset) {
            invalidateAllRows();
          }
        }
      }

      if (hScrollDist || vScrollDist) {
        var dx = Math.abs(lastRenderedScrollLeft - scrollLeft);
        var dy = Math.abs(lastRenderedScrollTop - scrollTop);
        if (dx > 20 || dy > 20) {
          // if rendering is forced or scrolling is small enough to be "easy", just render
          if (options.forceSyncScrolling || (dy < viewportH && dx < viewportW)) {
            render();
          } else {
            // otherwise, perform "difficult" renders at a capped frequency
            scrollThrottle.enqueue();
          }

          trigger(self.onViewportChanged, {});
        }
      }

      trigger(self.onScroll, {scrollLeft: scrollLeft, scrollTop: scrollTop});

      if (hScrollDist || vScrollDist) { return true; }
      return false;
    }

    /*
    limits the frequency at which the provided action is executed.
    call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
    call dequeue to cancel any pending action.
    */
    function ActionThrottle(action, minPeriod_ms) {
      var blocked = false;
      var queued = false;

      function enqueue() {
        if (!blocked) {
          blockAndExecute();
        } else {
          queued = true;
        }
      }

      function dequeue() {
        queued = false;
      }

      function blockAndExecute() {
        blocked = true;
        setTimeout(unblock, minPeriod_ms);
        action();
      }

      function unblock() {
        if (queued) {
          dequeue();
          blockAndExecute();
        } else {
          blocked = false;
        }
      }

      return {
        enqueue: enqueue,
        dequeue: dequeue
      };
    }

    function asyncPostProcessRows() {
      var dataLength = getDataLength();
      while (postProcessFromRow <= postProcessToRow) {
        var row = (vScrollDir >= 0) ? postProcessFromRow++ : postProcessToRow--;
        var cacheEntry = rowsCache[row];
        if (!cacheEntry || row >= dataLength) {
          continue;
        }

        if (!postProcessedRows[row]) {
          postProcessedRows[row] = {};
        }

        ensureCellNodesInRowsCache(row);
        for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
          if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
            continue;
          }

          columnIdx = columnIdx | 0;

          var m = columns[columnIdx];
          var processedStatus = postProcessedRows[row][columnIdx]; // C=cleanup and re-render, R=rendered
          if (m.asyncPostRender && processedStatus !== 'R') {
            var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
            if (node) {
              m.asyncPostRender(node, row, getDataItem(row), m, (processedStatus === 'C'));
            }
            postProcessedRows[row][columnIdx] = 'R';
          }
        }

        h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
        return;
      }
    }

    function asyncPostProcessCleanupRows() {
      if (postProcessedCleanupQueue.length > 0) {
        var groupId = postProcessedCleanupQueue[0].groupId;

        // loop through all queue members with this groupID
        while (postProcessedCleanupQueue.length > 0 && postProcessedCleanupQueue[0].groupId == groupId) {
          var entry = postProcessedCleanupQueue.shift();
          if (entry.actionType == 'R') {
            entry.node.forEach(function (node) {
              node.remove();
            });
          }
          if (entry.actionType == 'C') {
            var column = columns[entry.columnIdx];
            if (column.asyncPostRenderCleanup && entry.node) {
              // cleanup must also remove element
              column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
            }
          }
        }

        // call this function again after the specified delay
        h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
      }
    }

    function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      var node, columnId, addedRowHash, removedRowHash;
      for (var row in rowsCache) {
        removedRowHash = removedHash && removedHash[row];
        addedRowHash = addedHash && addedHash[row];

        if (removedRowHash) {
          for (columnId in removedRowHash) {
            if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
              node = getCellNode(row, getColumnIndex(columnId));
              if (node) {
                node.classList.remove(removedRowHash[columnId]);
              }
            }
          }
        }

        if (addedRowHash) {
          for (columnId in addedRowHash) {
            if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
              node = getCellNode(row, getColumnIndex(columnId));
              if (node) {
                node.classList.add(addedRowHash[columnId]);
              }
            }
          }
        }
      }
    }

    function addCellCssStyles(key, hash) {
      if (cellCssClasses[key]) {
        throw new Error("SlickGrid addCellCssStyles: cell CSS hash with key '" + key + "' already exists.");
      }

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, null);

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash, "grid": self });
    }

    function removeCellCssStyles(key) {
      if (!cellCssClasses[key]) {
        return;
      }

      updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
      delete cellCssClasses[key];

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": null, "grid": self });
    }

    function setCellCssStyles(key, hash) {
      const prevHash = cellCssClasses[key];

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, prevHash);

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash, "grid": self });
    }

    function getCellCssStyles(key) {
      return cellCssClasses[key];
    }

    function flashCell(row, cell, speed) {
      speed = speed || 250;

      function toggleCellClass(cellNode, times) {
        if (times < 1) {
          return;
        }

        setTimeout(function () {
          if (times % 2 == 0) {
            cellNode.classList.add(options.cellFlashingCssClass);
          } else {
            cellNode.classList.remove(options.cellFlashingCssClass);
          }
          toggleCellClass(cellNode, times - 1);
        }, speed);
      }

      if (rowsCache[row]) {
        const cellNode = getCellNode(row, cell);
        if(cellNode)
          toggleCellClass(cellNode, 5);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Interactivity

    function handleMouseWheel(e, delta, deltaX, deltaY) {
      scrollTop = Math.max(0, _viewportScrollContainerY.scrollTop - (deltaY * options.rowHeight));
      scrollLeft = _viewportScrollContainerX.scrollLeft + (deltaX * 10);
      var handled = _handleScroll(true);
      if (handled) e.preventDefault();
    }

    function handleDragInit(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      var retval = trigger(self.onDragInit, dd, e);
      if (retval.isImmediatePropagationStopped()) {
        return retval.getReturnValue();
      }

      // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
      // cancel out of it
      return false;
    }

    function handleDragStart(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      var retval = trigger(self.onDragStart, dd, e);
      if (retval.isImmediatePropagationStopped()) {
        return retval.getReturnValue();
      }

      return false;
    }

    function handleDrag(e, dd) {
      return trigger(self.onDrag, dd, e).getReturnValue();
    }

    function handleDragEnd(e, dd) {
      trigger(self.onDragEnd, dd, e);
    }

    function handleKeyDown(e) {
      const retval = trigger(self.onKeyDown, {row: activeRow, cell: activeCell}, e);
      var handled = retval.isImmediatePropagationStopped();

      if (!handled) {
         if (!e.shiftKey && !e.altKey) {
            if (options.editable && currentEditor && currentEditor.keyCaptureList) {
               if (currentEditor.keyCaptureList.indexOf(e.which) > -1) {
                  return;
               }
            }
            if (e.which == keyCode.HOME) {
               handled = (e.ctrlKey) ? navigateTop() : navigateRowStart();
            } else if (e.which == keyCode.END) {
               handled = (e.ctrlKey) ? navigateBottom() : navigateRowEnd();
            }
         }
      }
      if (!handled) {
        if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
          // editor may specify an array of keys to bubble
          if (options.editable && currentEditor && currentEditor.keyCaptureList) {
            if (currentEditor.keyCaptureList.indexOf( e.which ) > -1) {
                return;
            }
          }
          if (e.which == keyCode.ESCAPE) {
            if (!getEditorLock().isActive()) {
              return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
            }
            cancelEditAndSetFocus();
          } else if (e.which == keyCode.PAGE_DOWN) {
            navigatePageDown();
            handled = true;
          } else if (e.which == keyCode.PAGE_UP) {
            navigatePageUp();
            handled = true;
          } else if (e.which == keyCode.LEFT) {
            handled = navigateLeft();
          } else if (e.which == keyCode.RIGHT) {
            handled = navigateRight();
          } else if (e.which == keyCode.UP) {
            handled = navigateUp();
          } else if (e.which == keyCode.DOWN) {
            handled = navigateDown();
          } else if (e.which == keyCode.TAB) {
            handled = navigateNext();
          } else if (e.which == keyCode.ENTER) {
            if (options.editable) {
              if (currentEditor) {
                // adding new row
                if (activeRow === getDataLength()) {
                  navigateDown();
                } else {
                  commitEditAndSetFocus();
                }
              } else {
                if (getEditorLock().commitCurrentEdit()) {
                  makeActiveCellEditable(undefined, undefined, e);
                }
              }
            }
            handled = true;
          }
        } else if (e.which == keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey) {
          handled = navigatePrev();
        }
      }

      if (handled) {
        // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
        e.stopPropagation();
        e.preventDefault();
        try {
          e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
        }
        // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
        // (hitting control key only, nothing else), "Shift" (maybe others)
        catch (error) { }
      }
    }

    function handleClick(evt) {

      let e = evt;
      if (e instanceof EventData) {
        e = evt.getNativeEvent();
      } else {
        evt = undefined;
      }

      if (!currentEditor) {
        // if this click resulted in some cell child node getting focus,
        // don't steal it back - keyboard events will still bubble up
        // IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
        if (e.target != document.activeElement || e.target.classList.contains("slick-cell")) {
          var selection = getTextSelection(); //store text-selection and restore it after
          setFocus();
          setTextSelection(selection);
        }
      }

      var cell = getCellFromEvent(e);
      if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
        return;
      }

      evt = trigger(self.onClick, {row: cell.row, cell: cell.cell}, evt || e);
      if (evt.isImmediatePropagationStopped()) {
        return;
      }

      // this optimisation causes trouble - MLeibman #329
      //if ((activeCell != cell.cell || activeRow != cell.row) && canCellBeActive(cell.row, cell.cell)) {
      if (canCellBeActive(cell.row, cell.cell)) {
        if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
          scrollRowIntoView(cell.row, false);

          var preClickModeOn = (e.target && e.target.className === preClickClassName);
          var column = columns[cell.cell];
          var suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
          setActiveCellInternal(getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
        }
      }
    }

    function handleContextMenu(e) {
      var cell = e.target.closest(".slick-cell");
      if (!cell) {
        return;
      }

      // are we editing this cell?
      if (activeCellNode === cell && currentEditor !== null) {
        return;
      }

      trigger(self.onContextMenu, {}, e);
    }

    function handleDblClick(e) {
      var cell = getCellFromEvent(e);
      if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
        return;
      }

      trigger(self.onDblClick, {row: cell.row, cell: cell.cell}, e);
      if (e.defaultPrevented) {
        return;
      }

      if (options.editable) {
        gotoCell(cell.row, cell.cell, true, e);
      }
    }

    function handleHeaderMouseEnter(e) {
      const c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      if (!c) {
        return;
      }
      trigger(self.onHeaderMouseEnter, {
        "column": c,
        "grid": self
      }, e);
    }

    function handleHeaderMouseLeave(e) {
      const c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      if (!c) {
        return;
      }
      trigger(self.onHeaderMouseLeave, {
        "column": c,
        "grid": self
      }, e);
    }

    function handleHeaderRowMouseEnter(e) {
      const c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      if (!c) {
        return;
      }
      trigger(self.onHeaderRowMouseEnter, {
        "column": c,
        "grid": self
      }, e);
    }

    function handleHeaderRowMouseLeave(e) {
      const c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      if (!c) {
        return;
      }
      trigger(self.onHeaderRowMouseLeave, {
        "column": c,
        "grid": self
      }, e);
    }

    function handleHeaderContextMenu(e) {
      var header = e.target.closest(".slick-header-column");
      var column = header && Utils.storage.get(header, "column");
      trigger(self.onHeaderContextMenu, {column: column}, e);
    }

    function handleHeaderClick(e) {
      if (columnResizeDragging) {
        return;
      }

      var header = e.target.closest(".slick-header-column");
      var column = header && Utils.storage.get(header, "column");
      if (column) {
        trigger(self.onHeaderClick, {column: column}, e);
      }
    }

    function handleFooterContextMenu(e) {
      var footer = e.target.closest(".slick-footerrow-column");
      var column = footer && Utils.storage.get(footer, "column");
      trigger(self.onFooterContextMenu, {column: column}, e);
    }

    function handleFooterClick(e) {
      var footer = e.target.closest(".slick-footerrow-column");
      var column = footer && Utils.storage.get(footer, "column");
      trigger(self.onFooterClick, {column: column}, e);
    }

    function handleCellMouseOver(e) {
      trigger(self.onMouseEnter, {}, e);
    }

    function handleCellMouseOut(e) {
      trigger(self.onMouseLeave, {}, e);
    }

    function cellExists(row, cell) {
      return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
    }

    function getCellFromPoint(x, y) {
      var row = getRowFromPosition(y);
      var cell = 0;

      var w = 0;
      for (var i = 0; i < columns.length && w < x; i++) {
        w += columns[i].width;
        cell++;
      }

      if (cell < 0) {
        cell = 0;
      }

      return {row: row, cell: cell - 1};
    }

    function getCellFromNode(cellNode) {
      // read column number from .l<columnNumber> CSS class
      var cls = /l\d+/.exec(cellNode.className);
      if (!cls) {
        throw new Error("SlickGrid getCellFromNode: cannot get cell - " + cellNode.className);
      }
      return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
    }

    function getRowFromNode(rowNode) {
      for (var row in rowsCache) {
        for (var i in rowsCache[row].rowNode) {
          if (rowsCache[row].rowNode[i] === rowNode) {
            return (row ? parseInt(row) : 0);
          }
        }
      }
      return null;
    }

    function getFrozenRowOffset(row) {
      //var offset = ( hasFrozenRows ) ? ( options.frozenBottom ) ? ( row >= actualFrozenRow ) ? ( h < viewportTopH ) ? ( actualFrozenRow * options.rowHeight ) : h : 0 : ( row >= actualFrozenRow ) ? frozenRowsHeight : 0 : 0; // WTF?
      let offset = 0;
      if (hasFrozenRows) {
        if (options.frozenBottom) {
          if (row >= actualFrozenRow) {
            if (h < viewportTopH) {
              offset = (actualFrozenRow * options.rowHeight);
            } else {
              offset = h;
            }
          }
          else {
            offset = 0;
          }
        }
        else {
          if (row >= actualFrozenRow) {
            offset = frozenRowsHeight;
          } else {
            offset = 0;
          }
        }
      }
      else {
        offset = 0;
      }

      return offset;
    }

    function getCellFromEvent(e) {
      if (e instanceof EventData) {
        e = e.getNativeEvent();
      }

      var targetEvent = e.touches ? e.touches[0] : e;
      var row, cell;

      var cellNode = e.target.closest(".slick-cell");
      if (!cellNode) {
        return null;
      }

      row = getRowFromNode(cellNode.parentNode);

      if (hasFrozenRows) {
        var c = Utils.offset(Utils.parents(cellNode, '.grid-canvas')[0]);

        var rowOffset = 0;
        var isBottom = Utils.parents(cellNode, '.grid-canvas-bottom').length;

        if (isBottom) {
          rowOffset = (options.frozenBottom) ? Utils.height(_canvasTopL) : frozenRowsHeight;
        }

        row = getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
      }

      cell = getCellFromNode(cellNode);

      if (row == null || cell == null) {
        return null;
      } else {
        return {
          "row": row,
          "cell": cell
        };
      }
    }

    function getCellNodeBox(row, cell) {
      if (!cellExists(row, cell)) {
        return null;
      }

      var frozenRowOffset = getFrozenRowOffset(row);

      var y1 = getRowTop(row) - frozenRowOffset;
      var y2 = y1 + options.rowHeight - 1;
      var x1 = 0;
      for (var i = 0; i < cell; i++) {
        x1 += columns[i].width;

        if (options.frozenColumn == i) {
          x1 = 0;
        }
      }
      var x2 = x1 + columns[cell].width;

      return {
        top: y1,
        left: x1,
        bottom: y2,
        right: x2
      };
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Cell switching

    function resetActiveCell() {
      setActiveCellInternal(null, false);
    }

    function setFocus() {
      if (tabbingDirection == -1) {
        _focusSink.focus();
      } else {
        _focusSink2.focus();
      }
    }

    function scrollCellIntoView(row, cell, doPaging) {
      scrollRowIntoView(row, doPaging);

      if (cell <= options.frozenColumn) {
        return;
      }

      var colspan = getColspan(row, cell);
      internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
    }

    function internalScrollColumnIntoView(left, right) {
      var scrollRight = scrollLeft + Utils.width(_viewportScrollContainerX) - (viewportHasVScroll ? scrollbarDimensions.width : 0);

      if (left < scrollLeft) {
        _viewportScrollContainerX.scrollLeft = left;
        handleScroll();
        render();
      } else if (right > scrollRight) {
        _viewportScrollContainerX.scrollLeft = Math.min(left, right - _viewportScrollContainerX.clientWidth);
        handleScroll();
        render();
      }
    }

    function scrollColumnIntoView(cell) {
      internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell]);
    }

    function setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
      if (activeCellNode !== null) {
        makeActiveCellNormal();
        activeCellNode.classList.remove("active");
        if (rowsCache[activeRow]) {
          rowsCache[activeRow].rowNode.forEach(function (node) {
            node.classList.remove("active");
          });
        }
      }

      var activeCellChanged = (activeCellNode !== newCell);
      activeCellNode = newCell;

      if (activeCellNode != null) {
        var activeCellOffset = Utils.offset(activeCellNode);

        var rowOffset = Math.floor(Utils.offset(Utils.parents(activeCellNode, '.grid-canvas')[0]).top);
        var isBottom = Utils.parents(activeCellNode, '.grid-canvas-bottom').length;

        if (hasFrozenRows && isBottom) {
          rowOffset -= ( options.frozenBottom )
            ? Utils.height(_canvasTopL)
            : frozenRowsHeight;
        }

        var cell = getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);

        activeRow = cell.row;
        activeCell = activePosX = activeCell = activePosX = getCellFromNode(activeCellNode);

        if (opt_editMode == null) {
          opt_editMode = (activeRow == getDataLength()) || options.autoEdit;
        }

        if (options.showCellSelection) {
          activeCellNode.classList.add("active");
          if (rowsCache[activeRow]) {
            rowsCache[activeRow].rowNode.forEach(function (node) {
              node.classList.add("active");
            });
          }
        }

        if (options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
          clearTimeout(h_editorLoader);

          if (options.asyncEditorLoading) {
            h_editorLoader = setTimeout(function () {
              makeActiveCellEditable(undefined, preClickModeOn, e);
            }, options.asyncEditorLoadDelay);
          } else {
            makeActiveCellEditable(undefined, preClickModeOn, e);
          }
        }
      } else {
        activeRow = activeCell = null;
      }

      // this optimisation causes trouble - MLeibman #329
      //if (activeCellChanged) {
      if (!suppressActiveCellChangedEvent) {
        trigger(self.onActiveCellChanged, getActiveCell());
      }
      //}
    }

    function clearTextSelection() {
      if (document.selection && document.selection.empty) {
        try {
          //IE fails here if selected element is not in dom
          document.selection.empty();
        } catch (e) { }
      } else if (window.getSelection) {
        var sel = window.getSelection();
        if (sel && sel.removeAllRanges) {
          sel.removeAllRanges();
        }
      }
    }

    function isCellPotentiallyEditable(row, cell) {
      var dataLength = getDataLength();
      // is the data for this row loaded?
      if (row < dataLength && !getDataItem(row)) {
        return false;
      }

      // are we in the Add New row?  can we create new from this cell?
      if (columns[cell].cannotTriggerInsert && row >= dataLength) {
        return false;
      }

      // does this cell have an editor?
      if (!getEditor(row, cell)) {
        return false;
      }

      return true;
    }

    function makeActiveCellNormal() {
      if (!currentEditor) {
        return;
      }
      trigger(self.onBeforeCellEditorDestroy, {editor: currentEditor});
      currentEditor.destroy();
      currentEditor = null;

      if (activeCellNode) {
        var d = getDataItem(activeRow);
        activeCellNode.classList.remove("editable");
        activeCellNode.classList.remove("invalid");
        if (d) {
          var column = columns[activeCell];
          var formatter = getFormatter(activeRow, column);
          var formatterResult =  formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d, self);
          applyFormatResultToCellNode(formatterResult, activeCellNode);
          invalidatePostProcessingResults(activeRow);
        }
      }

      // if there previously was text selected on a page (such as selected text in the edit cell just removed),
      // IE can't set focus to anything else correctly
      if (navigator.userAgent.toLowerCase().match(/msie/)) {
        clearTextSelection();
      }

      getEditorLock().deactivate(editController);
    }

    function makeActiveCellEditable(editor, preClickModeOn, e) {
      if (!activeCellNode) {
        return;
      }
      if (!options.editable) {
        throw new Error("SlickGrid makeActiveCellEditable : should never get called when options.editable is false");
      }

      // cancel pending async call if there is one
      clearTimeout(h_editorLoader);

      if (!isCellPotentiallyEditable(activeRow, activeCell)) {
        return;
      }

      var columnDef = columns[activeCell];
      var item = getDataItem(activeRow);

      if (trigger(self.onBeforeEditCell, {row: activeRow, cell: activeCell, item: item, column: columnDef, target: 'grid' }).getReturnValue() === false) {
        setFocus();
        return;
      }

      getEditorLock().activate(editController);
      activeCellNode.classList.add("editable");

      var useEditor = editor || getEditor(activeRow, activeCell);

      // don't clear the cell if a custom editor is passed through
      if (!editor && !useEditor.suppressClearOnEdit) {
        activeCellNode.innerHTML = "";
      }

      var metadata = data.getItemMetadata && data.getItemMetadata(activeRow);
      metadata = metadata && metadata.columns;
      var columnMetaData = metadata && ( metadata[columnDef.id] || metadata[activeCell] );

      currentEditor = new useEditor({
        grid: self,
        gridPosition: absBox(_container),
        position: absBox(activeCellNode),
        container: activeCellNode,
        column: columnDef,
        columnMetaData: columnMetaData,
        item: item || {},
        event: e,
        commitChanges: commitEditAndSetFocus,
        cancelChanges: cancelEditAndSetFocus
      });

      if (item) {
        currentEditor.loadValue(item);
        if (preClickModeOn && currentEditor.preClick) {
          currentEditor.preClick();
        }
      }

      serializedEditorValue = currentEditor.serializeValue();

      if (currentEditor.position) {
        handleActiveCellPositionChange();
      }
    }

    function commitEditAndSetFocus() {
      // if the commit fails, it would do so due to a validation error
      // if so, do not steal the focus from the editor
      if (getEditorLock().commitCurrentEdit()) {
        setFocus();
        if (options.autoEdit && !options.autoCommitEdit) {
          navigateDown();
        }
      }
    }

    function cancelEditAndSetFocus() {
      if (getEditorLock().cancelCurrentEdit()) {
        setFocus();
      }
    }

    function absBox(elem) {
      var box = {
        top: elem.offsetTop,
        left: elem.offsetLeft,
        bottom: 0,
        right: 0,
        width:  elem.offsetWidth,
        height: elem.offsetWidth,
        visible: true
      };
      box.bottom = box.top + box.height;
      box.right = box.left + box.width;

      // walk up the tree
      var offsetParent = elem.offsetParent;
      while ((elem = elem.parentNode) != document.body) {
        if (elem == null) {
          break;
        }

        const styles = getComputedStyle(elem);
        if (box.visible && elem.scrollHeight != elem.offsetHeight && styles["overflowY"] != "visible") {
          box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
        }

        if (box.visible && elem.scrollWidth != elem.offsetWidth && styles["overflowX"] != "visible") {
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

    function getActiveCellPosition() {
      return absBox(activeCellNode);
    }

    function getGridPosition() {
      return absBox(_container);
    }

    function handleActiveCellPositionChange() {
      if (!activeCellNode) {
        return;
      }

      trigger(self.onActiveCellPositionChanged, {});

      if (currentEditor) {
        var cellBox = getActiveCellPosition();
        if (currentEditor.show && currentEditor.hide) {
          if (!cellBox.visible) {
            currentEditor.hide();
          } else {
            currentEditor.show();
          }
        }

        if (currentEditor.position) {
          currentEditor.position(cellBox);
        }
      }
    }

    function getCellEditor() {
      return currentEditor;
    }

    function getActiveCell() {
      if (!activeCellNode) {
        return null;
      } else {
        return {row: activeRow, cell: activeCell};
      }
    }

    function getActiveCellNode() {
      return activeCellNode;
    }

    //This get/set methods are used for keeping text-selection. These don't consider IE because they don't loose text-selection.
    //Fix for firefox selection. See https://github.com/mleibman/SlickGrid/pull/746/files
    function getTextSelection(){
      var textSelection = null;
      if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
          textSelection = selection.getRangeAt(0);
        }
      }
      return textSelection;
    }

    function setTextSelection(selection){
      if (window.getSelection && selection) {
        var target = window.getSelection();
        target.removeAllRanges();
        target.addRange(selection);
      }
    }

    function scrollRowIntoView(row, doPaging) {
	    if (!hasFrozenRows ||
	  	  ( !options.frozenBottom && row > actualFrozenRow - 1 ) ||
	  	  ( options.frozenBottom && row < actualFrozenRow - 1 ) ) {

        var viewportScrollH = Utils.height(_viewportScrollContainerY);

	      // if frozen row on top
	      // subtract number of frozen row
	      var rowNumber = ( hasFrozenRows && !options.frozenBottom ? row - options.frozenRow : row );

	      var rowAtTop = rowNumber * options.rowHeight;
	      var rowAtBottom = (rowNumber + 1) * options.rowHeight
	        - viewportScrollH
	        + (viewportHasHScroll ? scrollbarDimensions.height : 0);

	      // need to page down?
	      if ((rowNumber + 1) * options.rowHeight > scrollTop + viewportScrollH + offset) {
	        scrollTo(doPaging ? rowAtTop : rowAtBottom);
	        render();
	      }
	      // or page up?
	      else if (rowNumber * options.rowHeight < scrollTop + offset) {
	        scrollTo(doPaging ? rowAtBottom : rowAtTop);
	        render();
	      }
	    }
    }

    function scrollRowToTop(row) {
      scrollTo(row * options.rowHeight);
      render();
    }

    function scrollPage(dir) {
      var deltaRows = dir * numVisibleRows;
        /// First fully visible row crosses the line with
        /// y == bottomOfTopmostFullyVisibleRow
      var bottomOfTopmostFullyVisibleRow = scrollTop + options.rowHeight - 1;
      scrollTo((getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * options.rowHeight);
      render();

      if (options.enableCellNavigation && activeRow != null) {
        var row = activeRow + deltaRows;
        var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
        if (row >= dataLengthIncludingAddNew) {
          row = dataLengthIncludingAddNew - 1;
        }
        if (row < 0) {
          row = 0;
        }

        var cell = 0, prevCell = null;
        var prevActivePosX = activePosX;
        while (cell <= activePosX) {
          if (canCellBeActive(row, cell)) {
            prevCell = cell;
          }
          cell += getColspan(row, cell);
        }

        if (prevCell !== null) {
          setActiveCellInternal(getCellNode(row, prevCell));
          activePosX = prevActivePosX;
        } else {
          resetActiveCell();
        }
      }
    }

    function navigatePageDown() {
      scrollPage(1);
    }

    function navigatePageUp() {
       scrollPage(-1);
    }

    function navigateTop() {
       navigateToRow(0);
    }

    function navigateBottom() {
       navigateToRow(getDataLength()-1);
    }

    function navigateToRow(row) {
      var num_rows = getDataLength();
      if (!num_rows) { return true; }

      if (row < 0) {
        row = 0;
      } else if (row >= num_rows) {
        row = num_rows - 1;
      }

       scrollCellIntoView(row, 0, true);
       if (options.enableCellNavigation && activeRow != null) {
         var cell = 0, prevCell = null;
         var prevActivePosX = activePosX;
         while (cell <= activePosX) {
           if (canCellBeActive(row, cell)) {
             prevCell = cell;
           }
           cell += getColspan(row, cell);
         }

         if (prevCell !== null) {
           setActiveCellInternal(getCellNode(row, prevCell));
           activePosX = prevActivePosX;
         } else {
           resetActiveCell();
         }
       }
       return true;
    }

    function getColspan(row, cell) {
      var metadata = data.getItemMetadata && data.getItemMetadata(row);
      if (!metadata || !metadata.columns) {
        return 1;
      }

      var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
      var colspan = (columnData && columnData.colspan);
      if (colspan === "*") {
        colspan = columns.length - cell;
      } else {
        colspan = colspan || 1;
      }

      return colspan;
    }

    function findFirstFocusableCell(row) {
      var cell = 0;
      while (cell < columns.length) {
        if (canCellBeActive(row, cell)) {
          return cell;
        }
        cell += getColspan(row, cell);
      }
      return null;
    }

    function findLastFocusableCell(row) {
      var cell = 0;
      var lastFocusableCell = null;
      while (cell < columns.length) {
        if (canCellBeActive(row, cell)) {
          lastFocusableCell = cell;
        }
        cell += getColspan(row, cell);
      }
      return lastFocusableCell;
    }

    function gotoRight(row, cell, posX) {
      if (cell >= columns.length) {
        return null;
      }

      do {
        cell += getColspan(row, cell);
      }
      while (cell < columns.length && !canCellBeActive(row, cell));

      if (cell < columns.length) {
        return {
          "row": row,
          "cell": cell,
          "posX": cell
        };
      }
      return null;
    }

    function gotoLeft(row, cell, posX) {
      if (cell <= 0) {
        return null;
      }

      var firstFocusableCell = findFirstFocusableCell(row);
      if (firstFocusableCell === null || firstFocusableCell >= cell) {
        return null;
      }

      var prev = {
        "row": row,
        "cell": firstFocusableCell,
        "posX": firstFocusableCell
      };
      var pos;
      while (true) {
        pos = gotoRight(prev.row, prev.cell, prev.posX);
        if (!pos) {
          return null;
        }
        if (pos.cell >= cell) {
          return prev;
        }
        prev = pos;
      }
    }

    function gotoDown(row, cell, posX) {
      var prevCell;
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      while (true) {
        if (++row >= dataLengthIncludingAddNew) {
          return null;
        }

        prevCell = cell = 0;
        while (cell <= posX) {
          prevCell = cell;
          cell += getColspan(row, cell);
        }

        if (canCellBeActive(row, prevCell)) {
          return {
            "row": row,
            "cell": prevCell,
            "posX": posX
          };
        }
      }
    }

    function gotoUp(row, cell, posX) {
      var prevCell;
      while (true) {
        if (--row < 0) {
          return null;
        }

        prevCell = cell = 0;
        while (cell <= posX) {
          prevCell = cell;
          cell += getColspan(row, cell);
        }

        if (canCellBeActive(row, prevCell)) {
          return {
            "row": row,
            "cell": prevCell,
            "posX": posX
          };
        }
      }
    }

    function gotoNext(row, cell, posX) {
      if (row == null && cell == null) {
        row = cell = posX = 0;
        if (canCellBeActive(row, cell)) {
          return {
            "row": row,
            "cell": cell,
            "posX": cell
          };
        }
      }

      var pos = gotoRight(row, cell, posX);
      if (pos) {
        return pos;
      }

      var firstFocusableCell = null;
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();

      // if at last row, cycle through columns rather than get stuck in the last one
      if (row === dataLengthIncludingAddNew - 1) { row--; }

      while (++row < dataLengthIncludingAddNew) {
        firstFocusableCell = findFirstFocusableCell(row);
        if (firstFocusableCell !== null) {
          return {
            "row": row,
            "cell": firstFocusableCell,
            "posX": firstFocusableCell
          };
        }
      }
      return null;
    }

    function gotoPrev(row, cell, posX) {
      if (row == null && cell == null) {
        row = getDataLengthIncludingAddNew() - 1;
        cell = posX = columns.length - 1;
        if (canCellBeActive(row, cell)) {
          return {
            "row": row,
            "cell": cell,
            "posX": cell
          };
        }
      }

      var pos;
      var lastSelectableCell;
      while (!pos) {
        pos = gotoLeft(row, cell, posX);
        if (pos) {
          break;
        }
        if (--row < 0) {
          return null;
        }

        cell = 0;
        lastSelectableCell = findLastFocusableCell(row);
        if (lastSelectableCell !== null) {
          pos = {
            "row": row,
            "cell": lastSelectableCell,
            "posX": lastSelectableCell
          };
        }
      }
      return pos;
    }

    function gotoRowStart(row, cell, posX) {
       var newCell = findFirstFocusableCell(row);
       if (newCell === null) return null;

       return {
          "row": row,
          "cell": newCell,
          "posX": newCell
       };
    }

    function gotoRowEnd(row, cell, posX) {
       var newCell = findLastFocusableCell(row);
       if (newCell === null) return null;

       return {
          "row": row,
          "cell": newCell,
          "posX": newCell
       };
    }

    function navigateRight() {
      return navigate("right");
    }

    function navigateLeft() {
      return navigate("left");
    }

    function navigateDown() {
      return navigate("down");
    }

    function navigateUp() {
      return navigate("up");
    }

    function navigateNext() {
      return navigate("next");
    }

    function navigatePrev() {
       return navigate("prev");
    }

    function navigateRowStart() {
       return navigate("home");
    }

    function navigateRowEnd() {
       return navigate("end");
    }

    /**
     * @param {string} dir Navigation direction.
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    function navigate(dir) {
      if (!options.enableCellNavigation) {
        return false;
      }

      if (!activeCellNode && dir != "prev" && dir != "next") {
        return false;
      }

      if (!getEditorLock().commitCurrentEdit()) {
        return true;
      }
      setFocus();

      var tabbingDirections = {
        "up": -1,
        "down": 1,
        "left": -1,
        "right": 1,
        "prev": -1,
        "next": 1,
        "home": -1,
        "end": 1
      };
      tabbingDirection = tabbingDirections[dir];

      var stepFunctions = {
        "up": gotoUp,
        "down": gotoDown,
        "left": gotoLeft,
        "right": gotoRight,
        "prev": gotoPrev,
        "next": gotoNext,
        "home": gotoRowStart,
        "end": gotoRowEnd
      };
      var stepFn = stepFunctions[dir];
      var pos = stepFn(activeRow, activeCell, activePosX);
      if (pos) {
        if (hasFrozenRows && options.frozenBottom & pos.row == getDataLength()) {
          return;
        }

        var isAddNewRow = (pos.row == getDataLength());

        if (( !options.frozenBottom && pos.row >= actualFrozenRow )
          || ( options.frozenBottom && pos.row < actualFrozenRow )
          ) {
          scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && options.emulatePagingWhenScrolling);
        }
        setActiveCellInternal(getCellNode(pos.row, pos.cell));
        activePosX = pos.posX;
        return true;
      } else {
        setActiveCellInternal(getCellNode(activeRow, activeCell));
        return false;
      }
    }

    function getCellNode(row, cell) {
      if (rowsCache[row]) {
        ensureCellNodesInRowsCache(row);
        try {
          if (rowsCache[row].cellNodesByColumnIdx.length > cell) {
            return rowsCache[row].cellNodesByColumnIdx[cell];
          }
          else {
            return null;
          }
        } catch (e) {
          return rowsCache[row].cellNodesByColumnIdx[cell];
        }
      }
      return null;
    }

    function setActiveCell(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
      if (!initialized) { return; }
      if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
        return;
      }

      if (!options.enableCellNavigation) {
        return;
      }

      scrollCellIntoView(row, cell, false);
      setActiveCellInternal(getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent);
    }

    function setActiveRow(row, cell, suppressScrollIntoView) {
      if (!initialized) { return; }
      if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
        return;
      }

      activeRow = row;
      if (!suppressScrollIntoView) {
        scrollCellIntoView(row, cell || 0, false);
      }
    }

    function canCellBeActive(row, cell) {
      if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() ||
          row < 0 || cell >= columns.length || cell < 0) {
        return false;
      }

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.focusable !== "undefined") {
        return !!rowMetadata.focusable;
      }

      var columnMetadata = rowMetadata && rowMetadata.columns;
      if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable !== "undefined") {
        return !!columnMetadata[columns[cell].id].focusable;
      }
      if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable !== "undefined") {
        return !!columnMetadata[cell].focusable;
      }

      return !!columns[cell].focusable;
    }

    function canCellBeSelected(row, cell) {
      if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
        return false;
      }

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.selectable !== "undefined") {
        return !!rowMetadata.selectable;
      }

      var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
      if (columnMetadata && typeof columnMetadata.selectable !== "undefined") {
        return !!columnMetadata.selectable;
      }

      return !!columns[cell].selectable;
    }

    function gotoCell(row, cell, forceEdit, e) {
      if (!initialized) { return; }
      if (!canCellBeActive(row, cell)) {
        return;
      }

      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }

      scrollCellIntoView(row, cell, false);

      var newCell = getCellNode(row, cell);

      // if selecting the 'add new' row, start editing right away
      var column = columns[cell];
      var suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
      setActiveCellInternal(newCell, (forceEdit || (row === getDataLength()) || options.autoEdit), null, suppressActiveCellChangedEvent, e);

      // if no editor was created, set the focus back on the grid
      if (!currentEditor) {
        setFocus();
      }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // IEditor implementation for the editor lock

    function commitCurrentEdit() {
      var item = getDataItem(activeRow);
      var column = columns[activeCell];

      if (currentEditor) {
        if (currentEditor.isValueChanged()) {
          var validationResults = currentEditor.validate();

          if (validationResults.valid) {
            if (activeRow < getDataLength()) {
              var editCommand = {
                row: activeRow,
                cell: activeCell,
                editor: currentEditor,
                serializedValue: currentEditor.serializeValue(),
                prevSerializedValue: serializedEditorValue,
                execute: function () {
                  this.editor.applyValue(item, this.serializedValue);
                  updateRow(this.row);
                  trigger(self.onCellChange, {
                    command: 'execute',
                    row: this.row,
                    cell: this.cell,
                    item: item,
                    column: column
                  });
                },
                undo: function () {
                  this.editor.applyValue(item, this.prevSerializedValue);
                  updateRow(this.row);
                  trigger(self.onCellChange, {
                    command: 'undo',
                    row: this.row,
                    cell: this.cell,
                    item: item,
                    column: column
                  });
                }
              };

              if (options.editCommandHandler) {
                makeActiveCellNormal();
                options.editCommandHandler(item, column, editCommand);
              } else {
                editCommand.execute();
                makeActiveCellNormal();
              }

            } else {
              var newItem = {};
              currentEditor.applyValue(newItem, currentEditor.serializeValue());
              makeActiveCellNormal();
              trigger(self.onAddNewRow, {item: newItem, column: column});
            }

            // check whether the lock has been re-acquired by event handlers
            return !getEditorLock().isActive();
          } else {
            // Re-add the CSS class to trigger transitions, if any.
            activeCellNode.classList.remove("invalid");
            Utils.width(activeCellNode);// force layout
            activeCellNode.classList.add("invalid");

            trigger(self.onValidationError, {
              editor: currentEditor,
              cellNode: activeCellNode,
              validationResults: validationResults,
              row: activeRow,
              cell: activeCell,
              column: column
            });

            currentEditor.focus();
            return false;
          }
        }

        makeActiveCellNormal();
      }
      return true;
    }

    function cancelCurrentEdit() {
      makeActiveCellNormal();
      return true;
    }

    function rowsToRanges(rows) {
      var ranges = [];
      var lastCell = columns.length - 1;
      for (var i = 0; i < rows.length; i++) {
        ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
      }
      return ranges;
    }

    function getSelectedRows() {
      if (!selectionModel) {
        throw new Error("SlickGrid Selection model is not set");
      }
      return selectedRows.slice(0);
    }

    function setSelectedRows(rows, caller) {
      if (!selectionModel) {
        throw new Error("SlickGrid Selection model is not set");
      }
      if (self && self.getEditorLock && !self.getEditorLock().isActive()) {
        selectionModel.setSelectedRanges(rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
      }
    }

    /** html sanitizer to avoid scripting attack */
    var logMessageCount = 0;
    var logMessageMaxCount = 30;

    function sanitizeHtmlString(dirtyHtml, suppressLogging) {
      if (!options.sanitizer || typeof dirtyHtml !== 'string') {
        return dirtyHtml;
      }

      var cleanHtml = options.sanitizer(dirtyHtml);

      if (!suppressLogging && options.logSanitizedHtml && logMessageCount <= logMessageMaxCount && cleanHtml !== dirtyHtml) {
        console.log("sanitizer altered html: " + dirtyHtml + " --> " + cleanHtml);
        if (logMessageCount === logMessageMaxCount) {
          console.log("sanitizer: silencing messages after first " + logMessageMaxCount);
        }
        logMessageCount++;
      }
      return cleanHtml;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Debug

    this.debug = function () {
      var s = "";

      s += ("\n" + "counter_rows_rendered:  " + counter_rows_rendered);
      s += ("\n" + "counter_rows_removed:  " + counter_rows_removed);
      s += ("\n" + "renderedRows:  " + renderedRows);
      s += ("\n" + "numVisibleRows:  " + numVisibleRows);
      s += ("\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight);
      s += ("\n" + "n(umber of pages):  " + n);
      s += ("\n" + "(current) page:  " + page);
      s += ("\n" + "page height (ph):  " + ph);
      s += ("\n" + "vScrollDir:  " + vScrollDir);

      alert(s);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Public API

  Utils.extend(this, {
      "slickGridVersion": "3.0.4",

      // Events
    "onScroll": new SlickEvent(),
    "onBeforeSort": new SlickEvent(),
    "onSort": new SlickEvent(),
    "onHeaderMouseEnter": new SlickEvent(),
    "onHeaderMouseLeave": new SlickEvent(),
    "onHeaderRowMouseEnter": new SlickEvent(),
    "onHeaderRowMouseLeave": new SlickEvent(),
    "onHeaderContextMenu": new SlickEvent(),
    "onHeaderClick": new SlickEvent(),
    "onHeaderCellRendered": new SlickEvent(),
    "onBeforeHeaderCellDestroy": new SlickEvent(),
    "onHeaderRowCellRendered": new SlickEvent(),
    "onFooterRowCellRendered": new SlickEvent(),
    "onFooterContextMenu": new SlickEvent(),
    "onFooterClick": new SlickEvent(),
    "onBeforeHeaderRowCellDestroy": new SlickEvent(),
    "onBeforeFooterRowCellDestroy": new SlickEvent(),
    "onMouseEnter": new SlickEvent(),
    "onMouseLeave": new SlickEvent(),
    "onClick": new SlickEvent(),
    "onDblClick": new SlickEvent(),
    "onContextMenu": new SlickEvent(),
    "onKeyDown": new SlickEvent(),
    "onAddNewRow": new SlickEvent(),
    "onBeforeAppendCell": new SlickEvent(),
    "onValidationError": new SlickEvent(),
    "onViewportChanged": new SlickEvent(),
    "onColumnsReordered": new SlickEvent(),
    "onColumnsDrag": new SlickEvent(),
    "onColumnsResized": new SlickEvent(),
    "onColumnsResizeDblClick": new SlickEvent(),
    "onBeforeColumnsResize": new SlickEvent(),
    "onCellChange": new SlickEvent(),
    "onCompositeEditorChange": new SlickEvent(),
    "onBeforeEditCell": new SlickEvent(),
    "onBeforeCellEditorDestroy": new SlickEvent(),
    "onBeforeDestroy": new SlickEvent(),
    "onActiveCellChanged": new SlickEvent(),
    "onActiveCellPositionChanged": new SlickEvent(),
    "onDragInit": new SlickEvent(),
    "onDragStart": new SlickEvent(),
    "onDrag": new SlickEvent(),
    "onDragEnd": new SlickEvent(),
    "onSelectedRowsChanged": new SlickEvent(),
    "onCellCssStylesChanged": new SlickEvent(),
    "onAutosizeColumns": new SlickEvent(),
    "onBeforeSetColumns": new SlickEvent(),
    "onRendered": new SlickEvent(),
    "onSetOptions": new SlickEvent(),

      // Methods
      "registerPlugin": registerPlugin,
      "unregisterPlugin": unregisterPlugin,
      "getPluginByName": getPluginByName,
      "getColumns": getColumns,
      "setColumns": setColumns,
      "getColumnIndex": getColumnIndex,
      "updateColumnHeader": updateColumnHeader,
      "setSortColumn": setSortColumn,
      "setSortColumns": setSortColumns,
      "getSortColumns": getSortColumns,
      "autosizeColumns": autosizeColumns,
      "autosizeColumn": autosizeColumn,
      "getOptions": getOptions,
      "setOptions": setOptions,
      "getData": getData,
      "getDataLength": getDataLength,
      "getDataItem": getDataItem,
      "setData": setData,
      "getSelectionModel": getSelectionModel,
      "setSelectionModel": setSelectionModel,
      "getSelectedRows": getSelectedRows,
      "setSelectedRows": setSelectedRows,
      "getContainerNode": getContainerNode,
      "updatePagingStatusFromView": updatePagingStatusFromView,
      "applyFormatResultToCellNode": applyFormatResultToCellNode,

      "render": render,
      "reRenderColumns": reRenderColumns,
      "invalidate": invalidate,
      "invalidateRow": invalidateRow,
      "invalidateRows": invalidateRows,
      "invalidateAllRows": invalidateAllRows,
      "updateCell": updateCell,
      "updateRow": updateRow,
      "getViewport": getVisibleRange,
      "getRenderedRange": getRenderedRange,
      "resizeCanvas": resizeCanvas,
      "updateRowCount": updateRowCount,
      "scrollRowIntoView": scrollRowIntoView,
      "scrollRowToTop": scrollRowToTop,
      "scrollCellIntoView": scrollCellIntoView,
      "scrollColumnIntoView": scrollColumnIntoView,
      "getCanvasNode": getCanvasNode,
      "getUID": getUID,
      "getHeaderColumnWidthDiff": getHeaderColumnWidthDiff,
      "getScrollbarDimensions": getScrollbarDimensions,
      "getHeadersWidth": getHeadersWidth,
      "getCanvasWidth": getCanvasWidth,
      "getCanvases": getCanvases,
      "getActiveCanvasNode": getActiveCanvasNode,
      "getViewportNode": getViewportNode,
      "getViewports": getViewports,
      "getActiveViewportNode": getActiveViewportNode,
      "setActiveViewportNode": setActiveViewportNode,
      "focus": setFocus,
      "scrollTo": scrollTo,
      "cacheCssForHiddenInit": cacheCssForHiddenInit,
      "restoreCssFromHiddenInit": restoreCssFromHiddenInit,

      "getCellFromPoint": getCellFromPoint,
      "getCellFromEvent": getCellFromEvent,
      "getActiveCell": getActiveCell,
      "setActiveCell": setActiveCell,
      "setActiveRow": setActiveRow,
      "getActiveCellNode": getActiveCellNode,
      "getActiveCellPosition": getActiveCellPosition,
      "resetActiveCell": resetActiveCell,
      "editActiveCell": makeActiveCellEditable,
      "getCellEditor": getCellEditor,
      "getCellNode": getCellNode,
      "getCellNodeBox": getCellNodeBox,
      "canCellBeSelected": canCellBeSelected,
      "canCellBeActive": canCellBeActive,
      "navigatePrev": navigatePrev,
      "navigateNext": navigateNext,
      "navigateUp": navigateUp,
      "navigateDown": navigateDown,
      "navigateLeft": navigateLeft,
      "navigateRight": navigateRight,
      "navigatePageUp": navigatePageUp,
      "navigatePageDown": navigatePageDown,
      "navigateTop": navigateTop,
      "navigateBottom": navigateBottom,
      "navigateRowStart": navigateRowStart,
      "navigateRowEnd": navigateRowEnd,
      "gotoCell": gotoCell,
      "getTopPanel": getTopPanel,
      "getTopPanels": getTopPanels,
      "setTopPanelVisibility": setTopPanelVisibility,
      "getPreHeaderPanel": getPreHeaderPanel,
      "getPreHeaderPanelLeft": getPreHeaderPanel,
      "getPreHeaderPanelRight": getPreHeaderPanelRight,
      "setPreHeaderPanelVisibility": setPreHeaderPanelVisibility,
      "getHeader": getHeader,
      "getHeaderColumn": getHeaderColumn,
      "setHeaderRowVisibility": setHeaderRowVisibility,
      "getHeaderRow": getHeaderRow,
      "getHeaderRowColumn": getHeaderRowColumn,
      "setFooterRowVisibility": setFooterRowVisibility,
      "getFooterRow": getFooterRow,
      "getFooterRowColumn": getFooterRowColumn,
      "getGridPosition": getGridPosition,
      "flashCell": flashCell,
      "addCellCssStyles": addCellCssStyles,
      "setCellCssStyles": setCellCssStyles,
      "removeCellCssStyles": removeCellCssStyles,
      "getCellCssStyles": getCellCssStyles,
      "getFrozenRowOffset": getFrozenRowOffset,
      "setColumnHeaderVisibility": setColumnHeaderVisibility,
      "sanitizeHtmlString": sanitizeHtmlString,
      "getDisplayedScrollbarDimensions": getDisplayedScrollbarDimensions,
      "getAbsoluteColumnMinWidth": getAbsoluteColumnMinWidth,

      "init": finishInitialization,
      "destroy": destroy,

      // IEditor implementation
      "getEditorLock": getEditorLock,
      "getEditController": getEditController
    });

    init();
  }

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Grid: SlickGrid,
  });
}
