"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value);

  // src/slick.grid.ts
  var BindingEventService = Slick.BindingEventService, ColAutosizeMode = Slick.ColAutosizeMode, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, GlobalEditorLock = Slick.GlobalEditorLock, GridAutosizeColsMode = Slick.GridAutosizeColsMode, keyCode = Slick.keyCode, preClickClassName = Slick.preClickClassName, SlickRange = Slick.Range, RowSelectionMode = Slick.RowSelectionMode, ValueFilterMode = Slick.ValueFilterMode, Utils = Slick.Utils, WidthEvalMode = Slick.WidthEvalMode, Draggable = Slick.Draggable, MouseWheel = Slick.MouseWheel, Resizable = Slick.Resizable;
  var SlickGrid = class {
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
    constructor(container, data, columns, options, externalPubSub) {
      this.container = container;
      this.data = data;
      this.columns = columns;
      this.externalPubSub = externalPubSub;
      //////////////////////////////////////////////////////////////////////////////////////////////
      // Public API
      __publicField(this, "slickGridVersion", "5.15.5");
      /** optional grid state clientId */
      __publicField(this, "cid", "");
      // Events
      __publicField(this, "onActiveCellChanged");
      __publicField(this, "onActiveCellPositionChanged");
      __publicField(this, "onAddNewRow");
      __publicField(this, "onAfterSetColumns");
      __publicField(this, "onAutosizeColumns");
      __publicField(this, "onBeforeAppendCell");
      __publicField(this, "onBeforeCellEditorDestroy");
      __publicField(this, "onBeforeColumnsResize");
      __publicField(this, "onBeforeDestroy");
      __publicField(this, "onBeforeEditCell");
      __publicField(this, "onBeforeFooterRowCellDestroy");
      __publicField(this, "onBeforeHeaderCellDestroy");
      __publicField(this, "onBeforeHeaderRowCellDestroy");
      __publicField(this, "onBeforeRemoveCachedRow");
      __publicField(this, "onBeforeSetColumns");
      __publicField(this, "onBeforeSort");
      __publicField(this, "onBeforeUpdateColumns");
      __publicField(this, "onCellChange");
      __publicField(this, "onCellCssStylesChanged");
      __publicField(this, "onClick");
      __publicField(this, "onColumnsReordered");
      __publicField(this, "onColumnsDrag");
      __publicField(this, "onColumnsResized");
      __publicField(this, "onColumnsResizeDblClick");
      __publicField(this, "onCompositeEditorChange");
      __publicField(this, "onContextMenu");
      __publicField(this, "onDrag");
      __publicField(this, "onDblClick");
      __publicField(this, "onDragInit");
      __publicField(this, "onDragStart");
      __publicField(this, "onDragEnd");
      __publicField(this, "onFooterClick");
      __publicField(this, "onFooterContextMenu");
      __publicField(this, "onFooterRowCellRendered");
      __publicField(this, "onHeaderCellRendered");
      __publicField(this, "onHeaderClick");
      __publicField(this, "onHeaderContextMenu");
      __publicField(this, "onHeaderMouseEnter");
      __publicField(this, "onHeaderMouseLeave");
      __publicField(this, "onHeaderRowCellRendered");
      __publicField(this, "onHeaderRowMouseEnter");
      __publicField(this, "onHeaderRowMouseLeave");
      __publicField(this, "onPreHeaderContextMenu");
      __publicField(this, "onPreHeaderClick");
      __publicField(this, "onKeyDown");
      __publicField(this, "onMouseEnter");
      __publicField(this, "onMouseLeave");
      __publicField(this, "onRendered");
      __publicField(this, "onScroll");
      __publicField(this, "onSelectedRowsChanged");
      __publicField(this, "onSetOptions");
      __publicField(this, "onActivateChangedOptions");
      __publicField(this, "onSort");
      __publicField(this, "onValidationError");
      __publicField(this, "onViewportChanged");
      // ---
      // protected variables
      // shared across all grids on the page
      __publicField(this, "scrollbarDimensions");
      __publicField(this, "maxSupportedCssHeight");
      // browser's breaking point
      __publicField(this, "canvas", null);
      __publicField(this, "canvas_context", null);
      // settings
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        alwaysShowVerticalScroll: !1,
        alwaysAllowHorizontalScroll: !1,
        explicitInitialization: !1,
        rowHeight: 25,
        defaultColumnWidth: 80,
        enableHtmlRendering: !0,
        enableAddRow: !1,
        leaveSpaceForNewRows: !1,
        editable: !1,
        autoEdit: !0,
        autoEditNewRow: !0,
        autoCommitEdit: !1,
        suppressActiveCellChangeOnEdit: !1,
        enableCellNavigation: !0,
        enableColumnReorder: !0,
        unorderableColumnCssClass: "unorderable",
        asyncEditorLoading: !1,
        asyncEditorLoadDelay: 100,
        forceFitColumns: !1,
        enableAsyncPostRender: !1,
        asyncPostRenderDelay: 50,
        enableAsyncPostRenderCleanup: !1,
        asyncPostRenderCleanupDelay: 40,
        auto: !1,
        nonce: "",
        editorLock: GlobalEditorLock,
        showColumnHeader: !0,
        showHeaderRow: !1,
        headerRowHeight: 25,
        createFooterRow: !1,
        showFooterRow: !1,
        footerRowHeight: 25,
        createPreHeaderPanel: !1,
        createTopHeaderPanel: !1,
        showPreHeaderPanel: !1,
        showTopHeaderPanel: !1,
        preHeaderPanelHeight: 25,
        showTopPanel: !1,
        topPanelHeight: 25,
        preHeaderPanelWidth: "auto",
        // mostly useful for Draggable Grouping dropzone to take full width
        topHeaderPanelHeight: 25,
        topHeaderPanelWidth: "auto",
        // mostly useful for Draggable Grouping dropzone to take full width
        formatterFactory: null,
        editorFactory: null,
        cellFlashingCssClass: "flashing",
        rowHighlightCssClass: "highlight-animate",
        rowHighlightDuration: 400,
        selectedCellCssClass: "selected",
        multiSelect: !0,
        enableCellRowSpan: !1,
        enableTextSelectionOnCells: !1,
        dataItemColumnValueExtractor: null,
        frozenBottom: !1,
        frozenColumn: -1,
        frozenRow: -1,
        frozenRightViewportMinWidth: 100,
        throwWhenFrozenNotAllViewable: !1,
        fullWidthRows: !1,
        multiColumnSort: !1,
        numberedMultiColumnSort: !1,
        tristateMultiColumnSort: !1,
        sortColNumberInSeparateSpan: !1,
        defaultFormatter: this.defaultFormatter,
        forceSyncScrolling: !1,
        addNewRowCssClass: "new-row",
        preserveCopiedSelectionOnPaste: !1,
        preventDragFromKeys: ["ctrlKey", "metaKey"],
        showCellSelection: !0,
        viewportClass: void 0,
        minRowBuffer: 3,
        emulatePagingWhenScrolling: !0,
        // when scrolling off bottom of viewport, place new row at top of viewport
        editorCellNavOnLRKeys: !1,
        enableMouseWheelScrollHandler: !0,
        doPaging: !0,
        autosizeColsMode: GridAutosizeColsMode.LegacyOff,
        autosizeColPaddingPx: 4,
        rowTopOffsetRenderType: "top",
        scrollRenderThrottling: 10,
        autosizeTextAvgToMWidthRatio: 0.75,
        viewportSwitchToScrollModeWidthPercent: void 0,
        viewportMinWidthPx: void 0,
        viewportMaxWidthPx: void 0,
        suppressCssChangesOnHiddenInit: !1,
        ffMaxSupportedCssHeight: 6e6,
        maxSupportedCssHeight: 1e9,
        maxPartialRowSpanRemap: 5e3,
        sanitizer: void 0,
        // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
        logSanitizedHtml: !1,
        // log to console when sanitised - recommend true for testing of dev and production
        mixinDefaults: !0,
        shadowRoot: void 0
      });
      __publicField(this, "_columnDefaults", {
        name: "",
        headerCssClass: null,
        defaultSortAsc: !0,
        focusable: !0,
        hidden: !1,
        minWidth: 30,
        maxWidth: void 0,
        rerenderOnResize: !1,
        reorderable: !0,
        resizable: !0,
        sortable: !1,
        selectable: !0
      });
      __publicField(this, "_columnAutosizeDefaults", {
        ignoreHeaderText: !1,
        colValueArray: void 0,
        allowAddlPercent: void 0,
        formatterOverride: void 0,
        autosizeMode: ColAutosizeMode.ContentIntelligent,
        rowSelectionModeOnInit: void 0,
        rowSelectionMode: RowSelectionMode.FirstNRows,
        rowSelectionCount: 100,
        valueFilterMode: ValueFilterMode.None,
        widthEvalMode: WidthEvalMode.Auto,
        sizeToRemaining: void 0,
        widthPx: void 0,
        contentSizePx: 0,
        headerWidthPx: 0,
        colDataTypeOf: void 0
      });
      __publicField(this, "_columnResizeTimer");
      __publicField(this, "_executionBlockTimer");
      __publicField(this, "_flashCellTimer");
      __publicField(this, "_highlightRowTimer");
      // scroller
      __publicField(this, "th");
      // virtual height
      __publicField(this, "h");
      // real scrollable height
      __publicField(this, "ph");
      // page height
      __publicField(this, "n");
      // number of pages
      __publicField(this, "cj");
      // "jumpiness" coefficient
      __publicField(this, "page", 0);
      // current page
      __publicField(this, "offset", 0);
      // current page offset
      __publicField(this, "vScrollDir", 1);
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "initialized", !1);
      __publicField(this, "_container");
      __publicField(this, "uid", `slickgrid_${Math.round(1e6 * Math.random())}`);
      __publicField(this, "_focusSink");
      __publicField(this, "_focusSink2");
      __publicField(this, "_groupHeaders", []);
      __publicField(this, "_headerScroller", []);
      __publicField(this, "_headers", []);
      __publicField(this, "_headerRows");
      __publicField(this, "_headerRowScroller");
      __publicField(this, "_headerRowSpacerL");
      __publicField(this, "_headerRowSpacerR");
      __publicField(this, "_footerRow");
      __publicField(this, "_footerRowScroller");
      __publicField(this, "_footerRowSpacerL");
      __publicField(this, "_footerRowSpacerR");
      __publicField(this, "_preHeaderPanel");
      __publicField(this, "_preHeaderPanelScroller");
      __publicField(this, "_preHeaderPanelSpacer");
      __publicField(this, "_preHeaderPanelR");
      __publicField(this, "_preHeaderPanelScrollerR");
      __publicField(this, "_preHeaderPanelSpacerR");
      __publicField(this, "_topHeaderPanel");
      __publicField(this, "_topHeaderPanelScroller");
      __publicField(this, "_topHeaderPanelSpacer");
      __publicField(this, "_topPanelScrollers");
      __publicField(this, "_topPanels");
      __publicField(this, "_viewport");
      __publicField(this, "_canvas");
      __publicField(this, "_style");
      __publicField(this, "_boundAncestors", []);
      __publicField(this, "stylesheet");
      __publicField(this, "columnCssRulesL");
      __publicField(this, "columnCssRulesR");
      __publicField(this, "viewportH", 0);
      __publicField(this, "viewportW", 0);
      __publicField(this, "canvasWidth", 0);
      __publicField(this, "canvasWidthL", 0);
      __publicField(this, "canvasWidthR", 0);
      __publicField(this, "headersWidth", 0);
      __publicField(this, "headersWidthL", 0);
      __publicField(this, "headersWidthR", 0);
      __publicField(this, "viewportHasHScroll", !1);
      __publicField(this, "viewportHasVScroll", !1);
      __publicField(this, "headerColumnWidthDiff", 0);
      __publicField(this, "headerColumnHeightDiff", 0);
      // border+padding
      __publicField(this, "cellWidthDiff", 0);
      __publicField(this, "cellHeightDiff", 0);
      __publicField(this, "absoluteColumnMinWidth");
      __publicField(this, "hasFrozenRows", !1);
      __publicField(this, "frozenRowsHeight", 0);
      __publicField(this, "actualFrozenRow", -1);
      __publicField(this, "paneTopH", 0);
      __publicField(this, "paneBottomH", 0);
      __publicField(this, "viewportTopH", 0);
      __publicField(this, "viewportBottomH", 0);
      __publicField(this, "topPanelH", 0);
      __publicField(this, "headerRowH", 0);
      __publicField(this, "footerRowH", 0);
      __publicField(this, "tabbingDirection", 1);
      __publicField(this, "_activeCanvasNode");
      __publicField(this, "_activeViewportNode");
      __publicField(this, "activePosX");
      __publicField(this, "activePosY");
      __publicField(this, "activeRow");
      __publicField(this, "activeCell");
      __publicField(this, "activeCellNode", null);
      __publicField(this, "currentEditor", null);
      __publicField(this, "serializedEditorValue");
      __publicField(this, "editController");
      __publicField(this, "_prevDataLength", 0);
      __publicField(this, "_prevInvalidatedRowsCount", 0);
      __publicField(this, "_rowSpanIsCached", !1);
      __publicField(this, "_colsWithRowSpanCache", {});
      __publicField(this, "rowsCache", {});
      __publicField(this, "renderedRows", 0);
      __publicField(this, "numVisibleRows", 0);
      __publicField(this, "prevScrollTop", 0);
      __publicField(this, "scrollHeight", 0);
      __publicField(this, "scrollTop", 0);
      __publicField(this, "lastRenderedScrollTop", 0);
      __publicField(this, "lastRenderedScrollLeft", 0);
      __publicField(this, "prevScrollLeft", 0);
      __publicField(this, "scrollLeft", 0);
      __publicField(this, "selectionModel");
      __publicField(this, "selectedRows", []);
      __publicField(this, "plugins", []);
      __publicField(this, "cellCssClasses", {});
      __publicField(this, "columnsById", {});
      __publicField(this, "sortColumns", []);
      __publicField(this, "columnPosLeft", []);
      __publicField(this, "columnPosRight", []);
      __publicField(this, "pagingActive", !1);
      __publicField(this, "pagingIsLastPage", !1);
      __publicField(this, "scrollThrottle");
      // async call handles
      __publicField(this, "h_editorLoader");
      __publicField(this, "h_postrender");
      __publicField(this, "h_postrenderCleanup");
      __publicField(this, "postProcessedRows", {});
      __publicField(this, "postProcessToRow", null);
      __publicField(this, "postProcessFromRow", null);
      __publicField(this, "postProcessedCleanupQueue", []);
      __publicField(this, "postProcessgroupId", 0);
      // perf counters
      __publicField(this, "counter_rows_rendered", 0);
      __publicField(this, "counter_rows_removed", 0);
      __publicField(this, "_paneHeaderL");
      __publicField(this, "_paneHeaderR");
      __publicField(this, "_paneTopL");
      __publicField(this, "_paneTopR");
      __publicField(this, "_paneBottomL");
      __publicField(this, "_paneBottomR");
      __publicField(this, "_headerScrollerL");
      __publicField(this, "_headerScrollerR");
      __publicField(this, "_headerL");
      __publicField(this, "_headerR");
      __publicField(this, "_groupHeadersL");
      __publicField(this, "_groupHeadersR");
      __publicField(this, "_headerRowScrollerL");
      __publicField(this, "_headerRowScrollerR");
      __publicField(this, "_footerRowScrollerL");
      __publicField(this, "_footerRowScrollerR");
      __publicField(this, "_headerRowL");
      __publicField(this, "_headerRowR");
      __publicField(this, "_footerRowL");
      __publicField(this, "_footerRowR");
      __publicField(this, "_topPanelScrollerL");
      __publicField(this, "_topPanelScrollerR");
      __publicField(this, "_topPanelL");
      __publicField(this, "_topPanelR");
      __publicField(this, "_viewportTopL");
      __publicField(this, "_viewportTopR");
      __publicField(this, "_viewportBottomL");
      __publicField(this, "_viewportBottomR");
      __publicField(this, "_canvasTopL");
      __publicField(this, "_canvasTopR");
      __publicField(this, "_canvasBottomL");
      __publicField(this, "_canvasBottomR");
      __publicField(this, "_viewportScrollContainerX");
      __publicField(this, "_viewportScrollContainerY");
      __publicField(this, "_headerScrollContainer");
      __publicField(this, "_headerRowScrollContainer");
      __publicField(this, "_footerRowScrollContainer");
      // store css attributes if display:none is active in container or parent
      __publicField(this, "cssShow", { position: "absolute", visibility: "hidden", display: "block" });
      __publicField(this, "_hiddenParents", []);
      __publicField(this, "oldProps", []);
      __publicField(this, "enforceFrozenRowHeightRecalc", !1);
      __publicField(this, "columnResizeDragging", !1);
      __publicField(this, "slickDraggableInstance", null);
      __publicField(this, "slickMouseWheelInstances", []);
      __publicField(this, "slickResizableInstances", []);
      __publicField(this, "sortableSideLeftInstance");
      __publicField(this, "sortableSideRightInstance");
      __publicField(this, "logMessageCount", 0);
      __publicField(this, "logMessageMaxCount", 30);
      __publicField(this, "_pubSubService");
      if (this._container = typeof this.container == "string" ? document.querySelector(this.container) : this.container, !this._container)
        throw new Error(`SlickGrid requires a valid container, ${this.container} does not exist in the DOM.`);
      this._pubSubService = externalPubSub, this.onActiveCellChanged = new SlickEvent("onActiveCellChanged", externalPubSub), this.onActiveCellPositionChanged = new SlickEvent("onActiveCellPositionChanged", externalPubSub), this.onAddNewRow = new SlickEvent("onAddNewRow", externalPubSub), this.onAfterSetColumns = new SlickEvent("onAfterSetColumns", externalPubSub), this.onAutosizeColumns = new SlickEvent("onAutosizeColumns", externalPubSub), this.onBeforeAppendCell = new SlickEvent("onBeforeAppendCell", externalPubSub), this.onBeforeCellEditorDestroy = new SlickEvent("onBeforeCellEditorDestroy", externalPubSub), this.onBeforeColumnsResize = new SlickEvent("onBeforeColumnsResize", externalPubSub), this.onBeforeDestroy = new SlickEvent("onBeforeDestroy", externalPubSub), this.onBeforeEditCell = new SlickEvent("onBeforeEditCell", externalPubSub), this.onBeforeFooterRowCellDestroy = new SlickEvent("onBeforeFooterRowCellDestroy", externalPubSub), this.onBeforeHeaderCellDestroy = new SlickEvent("onBeforeHeaderCellDestroy", externalPubSub), this.onBeforeHeaderRowCellDestroy = new SlickEvent("onBeforeHeaderRowCellDestroy", externalPubSub), this.onBeforeRemoveCachedRow = new SlickEvent("onRowRemovedFromCache", externalPubSub), this.onBeforeSetColumns = new SlickEvent("onBeforeSetColumns", externalPubSub), this.onBeforeSort = new SlickEvent("onBeforeSort", externalPubSub), this.onBeforeUpdateColumns = new SlickEvent("onBeforeUpdateColumns", externalPubSub), this.onCellChange = new SlickEvent("onCellChange", externalPubSub), this.onCellCssStylesChanged = new SlickEvent("onCellCssStylesChanged", externalPubSub), this.onClick = new SlickEvent("onClick", externalPubSub), this.onColumnsReordered = new SlickEvent("onColumnsReordered", externalPubSub), this.onColumnsDrag = new SlickEvent("onColumnsDrag", externalPubSub), this.onColumnsResized = new SlickEvent("onColumnsResized", externalPubSub), this.onColumnsResizeDblClick = new SlickEvent("onColumnsResizeDblClick", externalPubSub), this.onCompositeEditorChange = new SlickEvent("onCompositeEditorChange", externalPubSub), this.onContextMenu = new SlickEvent("onContextMenu", externalPubSub), this.onDrag = new SlickEvent("onDrag", externalPubSub), this.onDblClick = new SlickEvent("onDblClick", externalPubSub), this.onDragInit = new SlickEvent("onDragInit", externalPubSub), this.onDragStart = new SlickEvent("onDragStart", externalPubSub), this.onDragEnd = new SlickEvent("onDragEnd", externalPubSub), this.onFooterClick = new SlickEvent("onFooterClick", externalPubSub), this.onFooterContextMenu = new SlickEvent("onFooterContextMenu", externalPubSub), this.onFooterRowCellRendered = new SlickEvent("onFooterRowCellRendered", externalPubSub), this.onHeaderCellRendered = new SlickEvent("onHeaderCellRendered", externalPubSub), this.onHeaderClick = new SlickEvent("onHeaderClick", externalPubSub), this.onHeaderContextMenu = new SlickEvent("onHeaderContextMenu", externalPubSub), this.onHeaderMouseEnter = new SlickEvent("onHeaderMouseEnter", externalPubSub), this.onHeaderMouseLeave = new SlickEvent("onHeaderMouseLeave", externalPubSub), this.onHeaderRowCellRendered = new SlickEvent("onHeaderRowCellRendered", externalPubSub), this.onHeaderRowMouseEnter = new SlickEvent("onHeaderRowMouseEnter", externalPubSub), this.onHeaderRowMouseLeave = new SlickEvent("onHeaderRowMouseLeave", externalPubSub), this.onPreHeaderClick = new SlickEvent("onPreHeaderClick", externalPubSub), this.onPreHeaderContextMenu = new SlickEvent("onPreHeaderContextMenu", externalPubSub), this.onKeyDown = new SlickEvent("onKeyDown", externalPubSub), this.onMouseEnter = new SlickEvent("onMouseEnter", externalPubSub), this.onMouseLeave = new SlickEvent("onMouseLeave", externalPubSub), this.onRendered = new SlickEvent("onRendered", externalPubSub), this.onScroll = new SlickEvent("onScroll", externalPubSub), this.onSelectedRowsChanged = new SlickEvent("onSelectedRowsChanged", externalPubSub), this.onSetOptions = new SlickEvent("onSetOptions", externalPubSub), this.onActivateChangedOptions = new SlickEvent("onActivateChangedOptions", externalPubSub), this.onSort = new SlickEvent("onSort", externalPubSub), this.onValidationError = new SlickEvent("onValidationError", externalPubSub), this.onViewportChanged = new SlickEvent("onViewportChanged", externalPubSub), this.initialize(options);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Grid and Dom Initialisation
    //////////////////////////////////////////////////////////////////////////////////////////////
    /** Initializes the grid. */
    init() {
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
    initialize(options) {
      if (options != null && options.mixinDefaults ? (this._options || (this._options = options), Utils.applyDefaults(this._options, this._defaults)) : this._options = Utils.extend(!0, {}, this._defaults, options), this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling), this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight(), this.validateAndEnforceOptions(), this._columnDefaults.width = this._options.defaultColumnWidth, this._options.suppressCssChangesOnHiddenInit || this.cacheCssForHiddenInit(), this.updateColumnProps(), this._options.enableColumnReorder && (!Sortable || !Sortable.create))
        throw new Error("SlickGrid requires Sortable.js module to be loaded");
      this.editController = {
        commitCurrentEdit: this.commitCurrentEdit.bind(this),
        cancelCurrentEdit: this.cancelCurrentEdit.bind(this)
      }, Utils.emptyElement(this._container), this._container.style.outline = String(0), this._container.classList.add(this.uid), this._container.classList.add("ui-widget"), this._container.setAttribute("role", "grid");
      let containerStyles = window.getComputedStyle(this._container);
      /relative|absolute|fixed/.test(containerStyles.position) || (this._container.style.position = "relative"), this._focusSink = Utils.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, this._container), this._options.createTopHeaderPanel && (this._topHeaderPanelScroller = Utils.createDomElement("div", { className: "slick-topheader-panel slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._container), this._topHeaderPanelScroller.appendChild(document.createElement("div")), this._topHeaderPanel = Utils.createDomElement("div", null, this._topHeaderPanelScroller), this._topHeaderPanelSpacer = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._topHeaderPanelScroller), this._options.showTopHeaderPanel || Utils.hide(this._topHeaderPanelScroller)), this._paneHeaderL = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, this._container), this._paneHeaderR = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, this._container), this._paneTopL = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, this._container), this._paneTopR = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, this._container), this._paneBottomL = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, this._container), this._paneBottomR = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, this._container), this._options.createPreHeaderPanel && (this._preHeaderPanelScroller = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderL), this._preHeaderPanelScroller.appendChild(document.createElement("div")), this._preHeaderPanel = Utils.createDomElement("div", null, this._preHeaderPanelScroller), this._preHeaderPanelSpacer = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScroller), this._preHeaderPanelScrollerR = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderR), this._preHeaderPanelR = Utils.createDomElement("div", null, this._preHeaderPanelScrollerR), this._preHeaderPanelSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScrollerR), this._options.showPreHeaderPanel || (Utils.hide(this._preHeaderPanelScroller), Utils.hide(this._preHeaderPanelScrollerR))), this._headerScrollerL = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, this._paneHeaderL), this._headerScrollerR = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, this._paneHeaderR), this._headerScroller.push(this._headerScrollerL), this._headerScroller.push(this._headerScrollerR), this._headerL = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", role: "row", style: { left: "-1000px" } }, this._headerScrollerL), this._headerR = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", role: "row", style: { left: "-1000px" } }, this._headerScrollerR), this._headers = [this._headerL, this._headerR], this._headerRowScrollerL = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopL), this._headerRowScrollerR = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopR), this._headerRowScroller = [this._headerRowScrollerL, this._headerRowScrollerR], this._headerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerL), this._headerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerR), this._headerRowL = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, this._headerRowScrollerL), this._headerRowR = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, this._headerRowScrollerR), this._headerRows = [this._headerRowL, this._headerRowR], this._topPanelScrollerL = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopL), this._topPanelScrollerR = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopR), this._topPanelScrollers = [this._topPanelScrollerL, this._topPanelScrollerR], this._topPanelL = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerL), this._topPanelR = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerR), this._topPanels = [this._topPanelL, this._topPanelR], this._options.showColumnHeader || this._headerScroller.forEach((el) => {
        Utils.hide(el);
      }), this._options.showTopPanel || this._topPanelScrollers.forEach((scroller) => {
        Utils.hide(scroller);
      }), this._options.showHeaderRow || this._headerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      }), this._viewportTopL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, this._paneTopL), this._viewportTopR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, this._paneTopR), this._viewportBottomL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, this._paneBottomL), this._viewportBottomR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, this._paneBottomR), this._viewport = [this._viewportTopL, this._viewportTopR, this._viewportBottomL, this._viewportBottomR], this._options.viewportClass && this._viewport.forEach((view) => {
        view.classList.add(...Utils.classNameToList(this._options.viewportClass));
      }), this._activeViewportNode = this._viewportTopL, this._canvasTopL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, this._viewportTopL), this._canvasTopR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, this._viewportTopR), this._canvasBottomL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, this._viewportBottomL), this._canvasBottomR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, this._viewportBottomR), this._canvas = [this._canvasTopL, this._canvasTopR, this._canvasBottomL, this._canvasBottomR], this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar();
      let canvasWithScrollbarWidth = this.getCanvasWidth() + this.scrollbarDimensions.width;
      this._activeCanvasNode = this._canvasTopL, this._topHeaderPanelSpacer && Utils.width(this._topHeaderPanelSpacer, canvasWithScrollbarWidth), this._preHeaderPanelSpacer && Utils.width(this._preHeaderPanelSpacer, canvasWithScrollbarWidth), this._headers.forEach((el) => {
        Utils.width(el, this.getHeadersWidth());
      }), Utils.width(this._headerRowSpacerL, canvasWithScrollbarWidth), Utils.width(this._headerRowSpacerR, canvasWithScrollbarWidth), this._options.createFooterRow && (this._footerRowScrollerR = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopR), this._footerRowScrollerL = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopL), this._footerRowScroller = [this._footerRowScrollerL, this._footerRowScrollerR], this._footerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerL), Utils.width(this._footerRowSpacerL, canvasWithScrollbarWidth), this._footerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerR), Utils.width(this._footerRowSpacerR, canvasWithScrollbarWidth), this._footerRowL = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, this._footerRowScrollerL), this._footerRowR = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, this._footerRowScrollerR), this._footerRow = [this._footerRowL, this._footerRowR], this._options.showFooterRow || this._footerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      })), this._focusSink2 = this._focusSink.cloneNode(!0), this._container.appendChild(this._focusSink2), this._options.explicitInitialization || this.finishInitialization();
    }
    /**
     * Completes grid initialisation by calculating viewport dimensions, measuring cell padding and border differences,
     * disabling text selection (except on editable inputs), setting frozen options and pane visibility,
     * updating column caches, creating column headers and footers, setting up column sorting,
     * creating CSS rules, binding ancestor scroll events, and binding various event handlers
     * (e.g. for scrolling, mouse, keyboard, drag-and-drop).
     * It also starts up any asynchronous post–render processing if enabled.
     */
    finishInitialization() {
      this.initialized || (this.initialized = !0, this.getViewportWidth(), this.getViewportHeight(), this.measureCellPaddingAndBorder(), this.disableSelection(this._headers), this._options.enableTextSelectionOnCells || this._viewport.forEach((view) => {
        this._bindingEventService.bind(view, "selectstart", (event) => {
          event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
        });
      }), this.setFrozenOptions(), this.setPaneFrozenClasses(), this.setPaneVisibility(), this.setScroller(), this.setOverflow(), this.updateColumnCaches(), this.createColumnHeaders(), this.createColumnFooter(), this.setupColumnSort(), this.createCssRules(), this.resizeCanvas(), this.bindAncestorScrollEvents(), this._bindingEventService.bind(this._container, "resize", this.resizeCanvas.bind(this)), this._viewport.forEach((view) => {
        this._bindingEventService.bind(view, "scroll", this.handleScroll.bind(this));
      }), this._options.enableMouseWheelScrollHandler && this._viewport.forEach((view) => {
        this.slickMouseWheelInstances.push(MouseWheel({
          element: view,
          onMouseWheel: this.handleMouseWheel.bind(this)
        }));
      }), this._headerScroller.forEach((el) => {
        this._bindingEventService.bind(el, "contextmenu", this.handleHeaderContextMenu.bind(this)), this._bindingEventService.bind(el, "click", this.handleHeaderClick.bind(this));
      }), this._headerRowScroller.forEach((scroller) => {
        this._bindingEventService.bind(scroller, "scroll", this.handleHeaderRowScroll.bind(this));
      }), this._options.createFooterRow && (this._footerRow.forEach((footer) => {
        this._bindingEventService.bind(footer, "contextmenu", this.handleFooterContextMenu.bind(this)), this._bindingEventService.bind(footer, "click", this.handleFooterClick.bind(this));
      }), this._footerRowScroller.forEach((scroller) => {
        this._bindingEventService.bind(scroller, "scroll", this.handleFooterRowScroll.bind(this));
      })), this._options.createTopHeaderPanel && this._bindingEventService.bind(this._topHeaderPanelScroller, "scroll", this.handleTopHeaderPanelScroll.bind(this)), this._options.createPreHeaderPanel && (this._bindingEventService.bind(this._preHeaderPanelScroller, "scroll", this.handlePreHeaderPanelScroll.bind(this)), this._bindingEventService.bind(this._preHeaderPanelScroller, "contextmenu", this.handlePreHeaderContextMenu.bind(this)), this._bindingEventService.bind(this._preHeaderPanelScrollerR, "contextmenu", this.handlePreHeaderContextMenu.bind(this)), this._bindingEventService.bind(this._preHeaderPanelScroller, "click", this.handlePreHeaderClick.bind(this)), this._bindingEventService.bind(this._preHeaderPanelScrollerR, "click", this.handlePreHeaderClick.bind(this))), this._bindingEventService.bind(this._focusSink, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(this._focusSink2, "keydown", this.handleKeyDown.bind(this)), this._canvas.forEach((element) => {
        this._bindingEventService.bind(element, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(element, "click", this.handleClick.bind(this)), this._bindingEventService.bind(element, "dblclick", this.handleDblClick.bind(this)), this._bindingEventService.bind(element, "contextmenu", this.handleContextMenu.bind(this)), this._bindingEventService.bind(element, "mouseover", this.handleCellMouseOver.bind(this)), this._bindingEventService.bind(element, "mouseout", this.handleCellMouseOut.bind(this));
      }), Draggable && (this.slickDraggableInstance = Draggable({
        containerElement: this._container,
        allowDragFrom: "div.slick-cell",
        // the slick cell parent must always contain `.dnd` and/or `.cell-reorder` class to be identified as draggable
        allowDragFromClosest: "div.slick-cell.dnd, div.slick-cell.cell-reorder",
        preventDragFromKeys: this._options.preventDragFromKeys,
        onDragInit: this.handleDragInit.bind(this),
        onDragStart: this.handleDragStart.bind(this),
        onDrag: this.handleDrag.bind(this),
        onDragEnd: this.handleDragEnd.bind(this)
      })), this._options.suppressCssChangesOnHiddenInit || this.restoreCssFromHiddenInit());
    }
    /**
     * Finds all container ancestors/parents (including the grid container itself) that are hidden (i.e. have display:none)
     * and temporarily applies visible CSS properties (absolute positioning, hidden visibility, block display)
     * so that dimensions can be measured correctly.
     * It stores the original CSS properties in an internal array for later restoration.
     *
     * Related to issue: https://github.com/6pac/SlickGrid/issues/568 */
    cacheCssForHiddenInit() {
      this._hiddenParents = Utils.parents(this._container, ":hidden"), this.oldProps = [], this._hiddenParents.forEach((el) => {
        let old = {};
        Object.keys(this.cssShow).forEach((name) => {
          this.cssShow && (old[name] = el.style[name], el.style[name] = this.cssShow[name]);
        }), this.oldProps.push(old);
      });
    }
    /**
     * Restores the original CSS properties for the container and its hidden
     * ancestors that were modified by cacheCssForHiddenInit.
     * This ensures that after initial measurements the DOM elements revert
     * to their original style settings.
     */
    restoreCssFromHiddenInit() {
      let i = 0;
      this._hiddenParents && (this._hiddenParents.forEach((el) => {
        let old = this.oldProps[i++];
        Object.keys(this.cssShow).forEach((name) => {
          this.cssShow && (el.style[name] = old[name]);
        });
      }), this._hiddenParents = []);
    }
    /**
     * Registers an external plugin to the grid’s internal plugin list.
     * Once added, it immediately initialises the plugin by calling its init()
     * method with the grid instance.
     * @param {T} plugin - The plugin instance to be registered.
     */
    registerPlugin(plugin) {
      this.plugins.unshift(plugin), plugin.init(this);
    }
    /**
     * Unregister (destroy) an external Plugin.
     * Searches for the specified plugin in the grid’s plugin list.
     * When found, it calls the plugin’s destroy() method and removes the plugin from the list,
     * thereby unregistering it from the grid.
     * @param {T} plugin - The plugin instance to be registered.
     */
    unregisterPlugin(plugin) {
      var _a;
      for (let i = this.plugins.length; i >= 0; i--)
        if (this.plugins[i] === plugin) {
          (_a = this.plugins[i]) == null || _a.destroy(), this.plugins.splice(i, 1);
          break;
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
    destroy(shouldDestroyAllElements) {
      var _a, _b, _c, _d;
      this._bindingEventService.unbindAll(), this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance), this.slickMouseWheelInstances = this.destroyAllInstances(this.slickMouseWheelInstances), this.slickResizableInstances = this.destroyAllInstances(this.slickResizableInstances), (_a = this.getEditorLock()) == null || _a.cancelCurrentEdit(), this.trigger(this.onBeforeDestroy, {});
      let i = this.plugins.length;
      for (; i--; )
        this.unregisterPlugin(this.plugins[i]);
      this._options.enableColumnReorder && typeof ((_b = this.sortableSideLeftInstance) == null ? void 0 : _b.destroy) == "function" && ((_c = this.sortableSideLeftInstance) == null || _c.destroy(), (_d = this.sortableSideRightInstance) == null || _d.destroy()), this.unbindAncestorScrollEvents(), this._bindingEventService.unbindByEventName(this._container, "resize"), this.removeCssRules(), this._canvas.forEach((element) => {
        this._bindingEventService.unbindByEventName(element, "keydown"), this._bindingEventService.unbindByEventName(element, "click"), this._bindingEventService.unbindByEventName(element, "dblclick"), this._bindingEventService.unbindByEventName(element, "contextmenu"), this._bindingEventService.unbindByEventName(element, "mouseover"), this._bindingEventService.unbindByEventName(element, "mouseout");
      }), this._viewport.forEach((view) => {
        this._bindingEventService.unbindByEventName(view, "scroll");
      }), this._headerScroller.forEach((el) => {
        this._bindingEventService.unbindByEventName(el, "contextmenu"), this._bindingEventService.unbindByEventName(el, "click");
      }), this._headerRowScroller.forEach((scroller) => {
        this._bindingEventService.unbindByEventName(scroller, "scroll");
      }), this._footerRow && this._footerRow.forEach((footer) => {
        this._bindingEventService.unbindByEventName(footer, "contextmenu"), this._bindingEventService.unbindByEventName(footer, "click");
      }), this._footerRowScroller && this._footerRowScroller.forEach((scroller) => {
        this._bindingEventService.unbindByEventName(scroller, "scroll");
      }), this._preHeaderPanelScroller && this._bindingEventService.unbindByEventName(this._preHeaderPanelScroller, "scroll"), this._topHeaderPanelScroller && this._bindingEventService.unbindByEventName(this._topHeaderPanelScroller, "scroll"), this._bindingEventService.unbindByEventName(this._focusSink, "keydown"), this._bindingEventService.unbindByEventName(this._focusSink2, "keydown");
      let resizeHandles = this._container.querySelectorAll(".slick-resizable-handle");
      [].forEach.call(resizeHandles, (handle) => {
        this._bindingEventService.unbindByEventName(handle, "dblclick");
      });
      let headerColumns = this._container.querySelectorAll(".slick-header-column");
      [].forEach.call(headerColumns, (column) => {
        this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave"), this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave");
      }), Utils.emptyElement(this._container), this._container.classList.remove(this.uid), this.clearAllTimers(), shouldDestroyAllElements && this.destroyAllElements();
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
    destroyAllInstances(inputInstances) {
      if (inputInstances) {
        let instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance;
        for (; Utils.isDefined(instance = instances.pop()); )
          instance && typeof instance.destroy == "function" && instance.destroy();
      }
      return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
    }
    /**
     * Sets all internal references to DOM elements
     * (e.g. canvas containers, headers, viewports, focus sinks, etc.)
     * to null so that they can be garbage collected.
     */
    destroyAllElements() {
      this._activeCanvasNode = null, this._activeViewportNode = null, this._boundAncestors = null, this._canvas = null, this._canvasTopL = null, this._canvasTopR = null, this._canvasBottomL = null, this._canvasBottomR = null, this._container = null, this._focusSink = null, this._focusSink2 = null, this._groupHeaders = null, this._groupHeadersL = null, this._groupHeadersR = null, this._headerL = null, this._headerR = null, this._headers = null, this._headerRows = null, this._headerRowL = null, this._headerRowR = null, this._headerRowSpacerL = null, this._headerRowSpacerR = null, this._headerRowScrollContainer = null, this._headerRowScroller = null, this._headerRowScrollerL = null, this._headerRowScrollerR = null, this._headerScrollContainer = null, this._headerScroller = null, this._headerScrollerL = null, this._headerScrollerR = null, this._hiddenParents = null, this._footerRow = null, this._footerRowL = null, this._footerRowR = null, this._footerRowSpacerL = null, this._footerRowSpacerR = null, this._footerRowScroller = null, this._footerRowScrollerL = null, this._footerRowScrollerR = null, this._footerRowScrollContainer = null, this._preHeaderPanel = null, this._preHeaderPanelR = null, this._preHeaderPanelScroller = null, this._preHeaderPanelScrollerR = null, this._preHeaderPanelSpacer = null, this._preHeaderPanelSpacerR = null, this._topPanels = null, this._topPanelScrollers = null, this._style = null, this._topPanelScrollerL = null, this._topPanelScrollerR = null, this._topPanelL = null, this._topPanelR = null, this._paneHeaderL = null, this._paneHeaderR = null, this._paneTopL = null, this._paneTopR = null, this._paneBottomL = null, this._paneBottomR = null, this._viewport = null, this._viewportTopL = null, this._viewportTopR = null, this._viewportBottomL = null, this._viewportBottomR = null, this._viewportScrollContainerX = null, this._viewportScrollContainerY = null;
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
    setOptions(newOptions, suppressRender, suppressColumnSet, suppressSetOverflow) {
      this.prepareForOptionsChange(), this._options.enableAddRow !== newOptions.enableAddRow && this.invalidateRow(this.getDataLength()), newOptions.frozenColumn !== void 0 && newOptions.frozenColumn >= 0 && (this.getViewports().forEach((vp) => vp.scrollLeft = 0), this.handleScroll());
      let originalOptions = Utils.extend(!0, {}, this._options);
      this._options = Utils.extend(this._options, newOptions), this.trigger(this.onSetOptions, { optionsBefore: originalOptions, optionsAfter: this._options }), this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
    }
    /**
     * If option.mixinDefaults is true then external code maintains a reference to the options object. In this case there is no need
     * to call setOptions() - changes can be made directly to the object. However setOptions() also performs some recalibration of the
     * grid in reaction to changed options. activateChangedOptions call the same recalibration routines as setOptions() would have.
     * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
     * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
     * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
     */
    activateChangedOptions(suppressRender, suppressColumnSet, suppressSetOverflow) {
      this.prepareForOptionsChange(), this.invalidateRow(this.getDataLength()), this.trigger(this.onActivateChangedOptions, { options: this._options }), this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
    }
    /**
     * Attempts to commit any active cell edit via the editor lock; if successful, calls makeActiveCellNormal to exit edit mode.
     *
     * @returns {void} - Does not return a value.
     */
    prepareForOptionsChange() {
      this.getEditorLock().commitCurrentEdit() && this.makeActiveCellNormal();
    }
    /**
     * Depending on new options, sets column header visibility, validates options, sets frozen options,
     * forces viewport height recalculation if needed, updates viewport overflow, re-renders the grid (unless suppressed),
     * sets the scroller elements, and reinitialises mouse wheel scrolling as needed.
     *
     * @param {boolean} [suppressRender] - If `true`, prevents the grid from re-rendering.
     * @param {boolean} [suppressColumnSet] - If `true`, prevents the columns from being reset.
     * @param {boolean} [suppressSetOverflow] - If `true`, prevents updating the viewport overflow setting.
     */
    internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow) {
      this._options.showColumnHeader !== void 0 && this.setColumnHeaderVisibility(this._options.showColumnHeader), this.validateAndEnforceOptions(), this.setFrozenOptions(), this._options.frozenBottom !== void 0 && (this.enforceFrozenRowHeightRecalc = !0), this._viewport.forEach((view) => {
        view.style.overflowY = this._options.autoHeight ? "hidden" : "auto";
      }), suppressRender || this.render(), this.setScroller(), suppressSetOverflow || this.setOverflow(), suppressColumnSet || this.setColumns(this.columns), this._options.enableMouseWheelScrollHandler && this._viewport && (!this.slickMouseWheelInstances || this.slickMouseWheelInstances.length === 0) ? this._viewport.forEach((view) => {
        this.slickMouseWheelInstances.push(MouseWheel({
          element: view,
          onMouseWheel: this.handleMouseWheel.bind(this)
        }));
      }) : this._options.enableMouseWheelScrollHandler === !1 && this.destroyAllInstances(this.slickMouseWheelInstances);
    }
    /**
     *
     * Ensures consistency in option setting, by thastIF autoHeight IS enabled, leaveSpaceForNewRows is set to FALSE.
     * And, if forceFitColumns is True, then autosizeColsMode is set to LegacyForceFit.
     */
    validateAndEnforceOptions() {
      this._options.autoHeight && (this._options.leaveSpaceForNewRows = !1), this._options.forceFitColumns && (this._options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit);
    }
    /**
     * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
     * @param {Object} selectionModel A SelectionModel.
     */
    setSelectionModel(model) {
      this.selectionModel && (this.selectionModel.onSelectedRangesChanged.unsubscribe(this.handleSelectedRangesChanged.bind(this)), this.selectionModel.destroy && this.selectionModel.destroy()), this.selectionModel = model, this.selectionModel && (this.selectionModel.init(this), this.selectionModel.onSelectedRangesChanged.subscribe(this.handleSelectedRangesChanged.bind(this)));
    }
    /** Returns the current SelectionModel. See here for more information about SelectionModels. */
    getSelectionModel() {
      return this.selectionModel;
    }
    /** add/remove frozen class to left headers/footer when defined */
    setPaneFrozenClasses() {
      let classAction = this.hasFrozenColumns() ? "add" : "remove";
      for (let elm of [this._paneHeaderL, this._paneTopL, this._paneBottomL])
        elm.classList[classAction]("frozen");
    }
    //////////////////////////////////////////////////////////////////////
    // End Grid and DOM Initialisation
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    // Column Management, Headers and Footers
    //////////////////////////////////////////////////////////////////////
    // Returns a boolean indicating whether the grid is configured with frozen columns.
    hasFrozenColumns() {
      return this._options.frozenColumn > -1;
    }
    /**
     * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
     * @param {Number|String} columnId Column id.
     * @param {string | HTMLElement | DocumentFragment} [title] New column name.
     * @param {String} [toolTip] New column tooltip.
     */
    updateColumnHeader(columnId, title, toolTip) {
      if (this.initialized) {
        let idx = this.getColumnIndex(columnId);
        if (!Utils.isDefined(idx))
          return;
        let columnDef = this.columns[idx], header = this.getColumnByIndex(idx);
        header && (title !== void 0 && (this.columns[idx].name = title), toolTip !== void 0 && (this.columns[idx].toolTip = toolTip), this.trigger(this.onBeforeHeaderCellDestroy, {
          node: header,
          column: columnDef,
          grid: this
        }), header.setAttribute("title", toolTip || ""), title !== void 0 && this.applyHtmlCode(header.children[0], title), this.trigger(this.onHeaderCellRendered, {
          node: header,
          column: columnDef,
          grid: this
        }));
      }
    }
    /**
     * Get the Header DOM element
     * @param {C} columnDef - column definition
     */
    getHeader(columnDef) {
      if (!columnDef)
        return this.hasFrozenColumns() ? this._headers : this._headerL;
      let idx = this.getColumnIndex(columnDef.id);
      return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL;
    }
    /**
     * Get a specific Header Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getHeaderColumn(columnIdOrIdx) {
      let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), targetHeader = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, targetIndex = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? idx : idx - this._options.frozenColumn - 1 : idx;
      return targetHeader.children[targetIndex];
    }
    /** Get the Header Row DOM element */
    getHeaderRow() {
      return this.hasFrozenColumns() ? this._headerRows : this._headerRows[0];
    }
    /** Get the Footer DOM element */
    getFooterRow() {
      return this.hasFrozenColumns() ? this._footerRow : this._footerRow[0];
    }
    /**
     * Get Header Row Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getHeaderRowColumn(columnIdOrIdx) {
      let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), headerRowTarget;
      return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? headerRowTarget = this._headerRowL : (headerRowTarget = this._headerRowR, idx -= this._options.frozenColumn + 1) : headerRowTarget = this._headerRowL, headerRowTarget.children[idx];
    }
    /**
     * Get the Footer Row Column DOM element by its column Id or index
     * @param {Number|String} columnIdOrIdx - column Id or index
     */
    getFooterRowColumn(columnIdOrIdx) {
      let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), footerRowTarget;
      return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? footerRowTarget = this._footerRowL : (footerRowTarget = this._footerRowR, idx -= this._options.frozenColumn + 1) : footerRowTarget = this._footerRowL, footerRowTarget.children[idx];
    }
    /**
     * If footer rows are enabled, clears existing footer cells then iterates over all columns.
     * For each visible column, it creates a footer cell element (adding “frozen” classes if needed),
     * stores the column definition in the element’s storage, and triggers the onFooterRowCellRendered event.
     */
    createColumnFooter() {
      if (this._options.createFooterRow) {
        this._footerRow.forEach((footer) => {
          footer.querySelectorAll(".slick-footerrow-column").forEach((column) => {
            let columnDef = Utils.storage.get(column, "column");
            this.trigger(this.onBeforeFooterRowCellDestroy, {
              node: column,
              column: columnDef,
              grid: this
            });
          });
        }), Utils.emptyElement(this._footerRowL), Utils.emptyElement(this._footerRowR);
        for (let i = 0; i < this.columns.length; i++) {
          let m = this.columns[i];
          if (!m || m.hidden)
            continue;
          let footerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, this.hasFrozenColumns() && i > this._options.frozenColumn ? this._footerRowR : this._footerRowL), className = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
          className && footerRowCell.classList.add(className), Utils.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
            node: footerRowCell,
            column: m,
            grid: this
          });
        }
      }
    }
    /**
     * For each header container, binds a click event that—
     *    if the clicked header is sortable and no column resizing is in progress—
     *      --> toggles the sort direction (or adds/removes the column in a multi–column sort),
     *      --> triggers onBeforeSort
     *      --> and if not cancelled, updates the sort columns and triggers onSort.
     */
    setupColumnSort() {
      this._headers.forEach((header) => {
        this._bindingEventService.bind(header, "click", (e) => {
          var _a;
          if (this.columnResizeDragging || e.target.classList.contains("slick-resizable-handle"))
            return;
          let coll = e.target.closest(".slick-header-column");
          if (!coll)
            return;
          let column = Utils.storage.get(coll, "column");
          if (column.sortable) {
            if (!((_a = this.getEditorLock()) != null && _a.commitCurrentEdit()))
              return;
            let previousSortColumns = this.sortColumns.slice(), sortColumn = null, i = 0;
            for (; i < this.sortColumns.length; i++)
              if (this.sortColumns[i].columnId === column.id) {
                sortColumn = this.sortColumns[i], sortColumn.sortAsc = !sortColumn.sortAsc;
                break;
              }
            let hadSortCol = !!sortColumn;
            this._options.tristateMultiColumnSort ? (sortColumn || (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }), hadSortCol && sortColumn.sortAsc && (this.sortColumns.splice(i, 1), sortColumn = null), this._options.multiColumnSort || (this.sortColumns = []), sortColumn && (!hadSortCol || !this._options.multiColumnSort) && this.sortColumns.push(sortColumn)) : e.metaKey && this._options.multiColumnSort ? sortColumn && this.sortColumns.splice(i, 1) : ((!e.shiftKey && !e.metaKey || !this._options.multiColumnSort) && (this.sortColumns = []), sortColumn ? this.sortColumns.length === 0 && this.sortColumns.push(sortColumn) : (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }, this.sortColumns.push(sortColumn)));
            let onSortArgs;
            this._options.multiColumnSort ? onSortArgs = {
              multiColumnSort: !0,
              previousSortColumns,
              sortCols: this.sortColumns.map((col) => {
                let tempCol = this.columns[this.getColumnIndex(col.columnId)];
                return !tempCol || tempCol.hidden ? null : { columnId: tempCol.id, sortCol: tempCol, sortAsc: col.sortAsc };
              }).filter((el) => el)
            } : onSortArgs = {
              multiColumnSort: !1,
              previousSortColumns,
              columnId: this.sortColumns.length > 0 ? column.id : null,
              sortCol: this.sortColumns.length > 0 ? column : null,
              sortAsc: this.sortColumns.length > 0 ? this.sortColumns[0].sortAsc : !0
            }, this.trigger(this.onBeforeSort, onSortArgs, e).getReturnValue() !== !1 && (this.setSortColumns(this.sortColumns), this.trigger(this.onSort, onSortArgs, e));
          }
        });
      });
    }
    /**
     * Clears any existing header cells and header row cells, recalculates header widths,
     * then iterates over each visible column to create header cell elements
     * (and header row cells if enabled) with appropriate content, CSS classes, event bindings,
     * and sort indicator elements. Also triggers before–destroy and rendered events as needed.
     */
    createColumnHeaders() {
      this._headers.forEach((header) => {
        header.querySelectorAll(".slick-header-column").forEach((column) => {
          let columnDef = Utils.storage.get(column, "column");
          columnDef && this.trigger(this.onBeforeHeaderCellDestroy, {
            node: column,
            column: columnDef,
            grid: this
          });
        });
      }), Utils.emptyElement(this._headerL), Utils.emptyElement(this._headerR), this.getHeadersWidth(), Utils.width(this._headerL, this.headersWidthL), Utils.width(this._headerR, this.headersWidthR), this._headerRows.forEach((row) => {
        row.querySelectorAll(".slick-headerrow-column").forEach((column) => {
          let columnDef = Utils.storage.get(column, "column");
          columnDef && this.trigger(this.onBeforeHeaderRowCellDestroy, {
            node: this,
            column: columnDef,
            grid: this
          });
        });
      }), Utils.emptyElement(this._headerRowL), Utils.emptyElement(this._headerRowR), this._options.createFooterRow && (this._footerRowL.querySelectorAll(".slick-footerrow-column").forEach((column) => {
        let columnDef = Utils.storage.get(column, "column");
        columnDef && this.trigger(this.onBeforeFooterRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: this
        });
      }), Utils.emptyElement(this._footerRowL), this.hasFrozenColumns() && (this._footerRowR.querySelectorAll(".slick-footerrow-column").forEach((column) => {
        let columnDef = Utils.storage.get(column, "column");
        columnDef && this.trigger(this.onBeforeFooterRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: this
        });
      }), Utils.emptyElement(this._footerRowR)));
      for (let i = 0; i < this.columns.length; i++) {
        let m = this.columns[i];
        if (m.hidden)
          continue;
        let headerTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, headerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerRowL : this._headerRowR : this._headerRowL, header = Utils.createDomElement("div", { id: `${this.uid + m.id}`, dataset: { id: String(m.id) }, role: "columnheader", className: "ui-state-default slick-state-default slick-header-column" }, headerTarget);
        m.toolTip && (header.title = m.toolTip), m.reorderable || header.classList.add(this._options.unorderableColumnCssClass);
        let colNameElm = Utils.createDomElement("span", { className: "slick-column-name" }, header);
        this.applyHtmlCode(colNameElm, m.name), Utils.width(header, m.width - this.headerColumnWidthDiff);
        let classname = m.headerCssClass || null;
        if (classname && header.classList.add(...Utils.classNameToList(classname)), classname = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseEnter.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseLeave.bind(this)), Utils.storage.put(header, "column", m), (this._options.enableColumnReorder || m.sortable) && (this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseHoverOn.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseHoverOff.bind(this))), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object && Object.keys(m.headerCellAttrs).forEach((key) => {
          m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
        }), m.sortable && (header.classList.add("slick-header-sortable"), Utils.createDomElement("div", { className: `slick-sort-indicator ${this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : ""}` }, header), this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan && Utils.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), this.trigger(this.onHeaderCellRendered, {
          node: header,
          column: m,
          grid: this
        }), this._options.showHeaderRow) {
          let headerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-headerrow-column l${i} r${i}` }, headerRowTarget), frozenClasses = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
          frozenClasses && headerRowCell.classList.add(frozenClasses), this._bindingEventService.bind(headerRowCell, "mouseenter", this.handleHeaderRowMouseEnter.bind(this)), this._bindingEventService.bind(headerRowCell, "mouseleave", this.handleHeaderRowMouseLeave.bind(this)), Utils.storage.put(headerRowCell, "column", m), this.trigger(this.onHeaderRowCellRendered, {
            node: headerRowCell,
            column: m,
            grid: this
          });
        }
        if (this._options.createFooterRow && this._options.showFooterRow) {
          let footerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._footerRow[0] : this._footerRow[1] : this._footerRow[0], footerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, footerRowTarget);
          Utils.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
            node: footerRowCell,
            column: m,
            grid: this
          });
        }
      }
      this.setSortColumns(this.sortColumns), this.setupColumnResize(), this._options.enableColumnReorder && (typeof this._options.enableColumnReorder == "function" ? this._options.enableColumnReorder(this, this._headers, this.headerColumnWidthDiff, this.setColumns, this.setupColumnResize, this.columns, this.getColumnIndex, this.uid, this.trigger) : this.setupColumnReorder());
    }
    /**
     * Destroys any existing sortable instances and creates new ones on the left and right header
     * containers using the Sortable library. Configures options including animation,
     * drag handle selectors, auto-scroll, and callbacks (onStart, onEnd) that
     * update the column order, set columns, trigger onColumnsReordered, and reapply column resizing.
     */
    setupColumnReorder() {
      var _a, _b;
      (_a = this.sortableSideLeftInstance) == null || _a.destroy(), (_b = this.sortableSideRightInstance) == null || _b.destroy();
      let columnScrollTimer = null, scrollColumnsRight = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft + 10, scrollColumnsLeft = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft - 10, canDragScroll = !1, sortableOptions = {
        animation: 50,
        direction: "horizontal",
        chosenClass: "slick-header-column-active",
        ghostClass: "slick-sortable-placeholder",
        draggable: ".slick-header-column",
        dragoverBubble: !1,
        revertClone: !0,
        scroll: !this.hasFrozenColumns(),
        // enable auto-scroll
        // lock unorderable columns by using a combo of filter + onMove
        filter: `.${this._options.unorderableColumnCssClass}`,
        onMove: (event) => !event.related.classList.contains(this._options.unorderableColumnCssClass),
        onStart: (e) => {
          e.item.classList.add("slick-header-column-active"), canDragScroll = !this.hasFrozenColumns() || Utils.offset(e.item).left > Utils.offset(this._viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > this._container.clientWidth ? columnScrollTimer || (columnScrollTimer = window.setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils.offset(this._viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = window.setInterval(scrollColumnsLeft, 100)) : (window.clearInterval(columnScrollTimer), columnScrollTimer = null);
        },
        onEnd: (e) => {
          var _a2, _b2, _c, _d, _e;
          if (e.item.classList.remove("slick-header-column-active"), window.clearInterval(columnScrollTimer), columnScrollTimer = null, !((_a2 = this.getEditorLock()) != null && _a2.commitCurrentEdit()))
            return;
          let reorderedIds = (_c = (_b2 = this.sortableSideLeftInstance) == null ? void 0 : _b2.toArray()) != null ? _c : [];
          reorderedIds = reorderedIds.concat((_e = (_d = this.sortableSideRightInstance) == null ? void 0 : _d.toArray()) != null ? _e : []);
          let reorderedColumns = [];
          for (let i = 0; i < reorderedIds.length; i++)
            reorderedColumns.push(this.columns[this.getColumnIndex(reorderedIds[i])]);
          this.setColumns(reorderedColumns), this.trigger(this.onColumnsReordered, { impactedColumns: this.columns }), e.stopPropagation(), this.setupColumnResize(), this.activeCellNode && this.setFocus();
        }
      };
      this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions), this.sortableSideRightInstance = Sortable.create(this._headerR, sortableOptions);
    }
    /**
     * Returns a concatenated array containing the children (header column elements) from both the left and right header containers.
     * @returns {HTMLElement[]} - An array of header column elements.
     */
    getHeaderChildren() {
      let a = Array.from(this._headers[0].children), b = Array.from(this._headers[1].children);
      return a.concat(b);
    }
    /**
     * When a resizable handle is double–clicked, extracts the column identifier from the parent element’s id
     * (by removing the grid uid) and triggers the onColumnsResizeDblClick event with that identifier.
     * @param {MouseEvent & { target: HTMLDivElement }} evt - The double-click event on the resizable handle.
     */
    handleResizeableDoubleClick(evt) {
      let triggeredByColumn = evt.target.parentElement.id.replace(this.uid, "");
      this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn });
    }
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
    setupColumnResize() {
      if (typeof Resizable == "undefined")
        throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
      let j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable = -1, frozenLeftColMaxWidth = 0, children = this.getHeaderChildren(), vc = this.getVisibleColumns();
      for (let i = 0; i < children.length; i++)
        children[i].querySelectorAll(".slick-resizable-handle").forEach((handle) => handle.remove()), !(i >= vc.length || !vc[i]) && vc[i].resizable && (firstResizable === void 0 && (firstResizable = i), lastResizable = i);
      if (firstResizable !== void 0)
        for (let i = 0; i < children.length; i++) {
          let colElm = children[i];
          if (i >= vc.length || !vc[i] || i < firstResizable || this._options.forceFitColumns && i >= lastResizable)
            continue;
          let resizeableHandle = Utils.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
          this._bindingEventService.bind(resizeableHandle, "dblclick", this.handleResizeableDoubleClick.bind(this)), this.slickResizableInstances.push(
            Resizable({
              resizeableElement: colElm,
              resizeableHandleElement: resizeableHandle,
              onResizeStart: (e, resizeElms) => {
                var _a;
                let targetEvent = e.touches ? e.changedTouches[0] : e;
                if (!((_a = this.getEditorLock()) != null && _a.commitCurrentEdit()))
                  return !1;
                pageX = targetEvent.pageX, frozenLeftColMaxWidth = 0, resizeElms.resizeableElement.classList.add("slick-header-column-active");
                let shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
                for (let pw = 0; pw < children.length; pw++)
                  pw >= vc.length || !vc[pw] || (vc[pw].previousWidth = children[pw].offsetWidth);
                if (this._options.forceFitColumns)
                  for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i + 1; j < vc.length; j++)
                    c = vc[j], c != null && c.resizable && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnRight = null), shrinkLeewayOnRight += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
                let shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
                for (j = 0; j <= i; j++)
                  c = vc[j], c != null && c.resizable && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
                shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
              },
              onResize: (e, resizeElms) => {
                let targetEvent = e.touches ? e.changedTouches[0] : e;
                this.columnResizeDragging = !0;
                let actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = this.getViewportInnerWidth();
                if (d < 0) {
                  for (x = d, j = i; j >= 0; j--)
                    c = vc[j], c != null && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                  for (k = 0; k <= i; k++)
                    c = vc[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < vc.length; j++)
                      c = vc[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  else
                    for (j = i + 1; j < vc.length; j++)
                      c = vc[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < vc.length; j++)
                      c = vc[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                } else {
                  for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i; j >= 0; j--)
                    if (c = vc[j], !(!c || c.hidden) && c.resizable)
                      if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x)
                        x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth;
                      else {
                        let newWidth = (c.previousWidth || 0) + x, resizedCanvasWidthL = this.canvasWidthL + x;
                        this.hasFrozenColumns() && j <= this._options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - this._options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + this._options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                      }
                  for (k = 0; k <= i; k++)
                    c = vc[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < vc.length; j++)
                      c = vc[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  else
                    for (j = i + 1; j < vc.length; j++)
                      c = vc[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                }
                this.hasFrozenColumns() && newCanvasWidthL !== this.canvasWidthL && (Utils.width(this._headerL, newCanvasWidthL + 1e3), Utils.setStyleSize(this._paneHeaderR, "left", newCanvasWidthL)), this.applyColumnHeaderWidths(), this._options.syncColumnCellResize && this.applyColumnWidths(), this.trigger(this.onColumnsDrag, {
                  triggeredByColumn: resizeElms.resizeableElement,
                  resizeHandle: resizeElms.resizeableHandleElement
                });
              },
              onResizeEnd: (_e, resizeElms) => {
                resizeElms.resizeableElement.classList.remove("slick-header-column-active");
                let triggeredByColumn = resizeElms.resizeableElement.id.replace(this.uid, "");
                this.trigger(this.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === !0 && this.applyColumnHeaderWidths();
                let newWidth;
                for (j = 0; j < vc.length; j++)
                  c = vc[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && this.invalidateAllRows());
                this.updateCanvasWidth(!0), this.render(), this.trigger(this.onColumnsResized, { triggeredByColumn }), window.clearTimeout(this._columnResizeTimer), this._columnResizeTimer = window.setTimeout(() => {
                  this.columnResizeDragging = !1;
                }, 300);
              }
            })
          );
        }
    }
    /**
     * Validates and sets the frozenColumn option (ensuring it is within valid bounds, or setting it to –1)
     * and, if a frozenRow is specified (greater than –1), sets the grid’s frozen–row flags,
     * computes the frozenRowsHeight (based on rowHeight), and determines the actual frozen row index
     * depending on whether frozenBottom is enabled.
     */
    setFrozenOptions() {
      if (this._options.frozenColumn = this._options.frozenColumn >= 0 && this._options.frozenColumn < this.columns.length ? parseInt(this._options.frozenColumn, 10) : -1, this._options.frozenRow > -1) {
        this.hasFrozenRows = !0, this.frozenRowsHeight = this._options.frozenRow * this._options.rowHeight;
        let dataLength = this.getDataLength();
        this.actualFrozenRow = this._options.frozenBottom ? dataLength - this._options.frozenRow : this._options.frozenRow;
      } else
        this.hasFrozenRows = !1;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Column Management - Autosizing
    //////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Proportionally resize a specific column by its name, index or Id
     *
     * Resizes based on its content, but determines the column definition from the provided identifier or index.
     * Then, obtains a grid canvas and calls getColAutosizeWidth to compute and update the column’s width.
     */
    autosizeColumn(columnOrIndexOrId, isInit) {
      let colDef = null, colIndex = -1;
      if (typeof columnOrIndexOrId == "number")
        colDef = this.columns[columnOrIndexOrId], colIndex = columnOrIndexOrId;
      else if (typeof columnOrIndexOrId == "string")
        for (let i = 0; i < this.columns.length; i++)
          this.columns[i].id === columnOrIndexOrId && (colDef = this.columns[i], colIndex = i);
      if (!colDef)
        return;
      let gridCanvas = this.getCanvasNode(0, 0);
      this.getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit || !1, colIndex);
    }
    /**
     * Returns true if the column should be treated as locked (i.e. not resized) based on autosize settings.
     * The decision is based on whether header text is not ignored, sizeToRemaining is false,
     * content size equals header width, and the current width is less than 100 pixels.
     *
     * @param {AutoSize} [autoSize={}] - The autosize configuration for the column.
     * @returns {boolean} - Returns `true` if the column should be treated as locked, otherwise `false`.
     */
    treatAsLocked(autoSize = {}) {
      var _a;
      return !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && ((_a = autoSize.widthPx) != null ? _a : 0) < 100;
    }
    /** Proportionately resizes all columns to fill available horizontal space.
     * This does not take the cell contents into consideration.
     *
     * It does this by temporarily caching CSS for hidden containers, calling the internal autosizing logic
     * (internalAutosizeColumns) with the autosize mode and initialisation flag,
     * then restores the original CSS.
     */
    autosizeColumns(autosizeMode, isInit) {
      var _a;
      let checkHiddenParents = !((_a = this._hiddenParents) != null && _a.length);
      checkHiddenParents && this.cacheCssForHiddenInit(), this.internalAutosizeColumns(autosizeMode, isInit), checkHiddenParents && this.restoreCssFromHiddenInit();
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
    internalAutosizeColumns(autosizeMode, isInit) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
      if (autosizeMode = autosizeMode || this._options.autosizeColsMode, autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
        this.legacyAutosizeColumns();
        return;
      }
      if (autosizeMode === GridAutosizeColsMode.None)
        return;
      this.canvas = document.createElement("canvas"), (_a = this.canvas) != null && _a.getContext && (this.canvas_context = this.canvas.getContext("2d"));
      let gridCanvas = this.getCanvasNode(0, 0), viewportWidth = this.getViewportInnerWidth(), i, c, colWidth, reRender = !1, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
      for (i = 0; i < this.columns.length; i++)
        c = this.columns[i], this.getColAutosizeWidth(c, i, gridCanvas, isInit || !1, i), totalLockedColWidth += ((_b = c.autoSize) == null ? void 0 : _b.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) && ((_c = c.autoSize) == null ? void 0 : _c.widthPx) || 0, totalMinWidth += ((_d = c.autoSize) == null ? void 0 : _d.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) ? ((_e = c.autoSize) == null ? void 0 : _e.widthPx) || 0 : c.minWidth || 0, totalWidth += ((_f = c.autoSize) == null ? void 0 : _f.widthPx) || 0, totalWidthLessSTR += (_g = c.autoSize) != null && _g.sizeToRemaining ? 0 : ((_h = c.autoSize) == null ? void 0 : _h.widthPx) || 0, strColsMinWidth += (_i = c.autoSize) != null && _i.sizeToRemaining && c.minWidth || 0;
      let strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
      if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
        let setWidth = totalWidth + ((_k = (_j = this.scrollbarDimensions) == null ? void 0 : _j.width) != null ? _k : 0);
        autosizeMode = GridAutosizeColsMode.IgnoreViewport, this._options.viewportMaxWidthPx && setWidth > this._options.viewportMaxWidthPx ? (setWidth = this._options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport) : this._options.viewportMinWidthPx && setWidth < this._options.viewportMinWidthPx && (setWidth = this._options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport), Utils.width(this._container, setWidth);
      }
      if (autosizeMode === GridAutosizeColsMode.FitColsToViewport)
        if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth)
          for (i = 0; i < this.columns.length; i++) {
            if (c = this.columns[i], !c || c.hidden)
              continue;
            let totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
            (_l = c.autoSize) != null && _l.sizeToRemaining ? colWidth = totalSTRViewportWidth * (((_m = c.autoSize) == null ? void 0 : _m.widthPx) || 0) / strColTotalGuideWidth : colWidth = ((_n = c.autoSize) == null ? void 0 : _n.widthPx) || 0, c.rerenderOnResize && (c.width || 0) !== colWidth && (reRender = !0), c.width = colWidth;
          }
        else if (this._options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * this._options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
          autosizeMode = GridAutosizeColsMode.IgnoreViewport;
        else {
          let unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
          for (i = 0; i < this.columns.length; i++)
            c = this.columns[i], !(!c || c.hidden) && (colWidth = c.width || 0, ((_o = c.autoSize) == null ? void 0 : _o.autosizeMode) !== ColAutosizeMode.Locked && !this.treatAsLocked(c.autoSize) && ((_p = c.autoSize) != null && _p.sizeToRemaining ? colWidth = c.minWidth || 0 : (colWidth = unallocatedViewportWidth / unallocatedColWidth * (((_q = c.autoSize) == null ? void 0 : _q.widthPx) || 0) - 1, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0), unallocatedColWidth -= ((_r = c.autoSize) == null ? void 0 : _r.widthPx) || 0, unallocatedViewportWidth -= colWidth)), this.treatAsLocked(c.autoSize) && (colWidth = ((_s = c.autoSize) == null ? void 0 : _s.widthPx) || 0, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0)), c.rerenderOnResize && c.width !== colWidth && (reRender = !0), c.width = colWidth);
        }
      if (autosizeMode === GridAutosizeColsMode.IgnoreViewport)
        for (i = 0; i < this.columns.length; i++)
          !this.columns[i] || this.columns[i].hidden || (colWidth = ((_t = this.columns[i].autoSize) == null ? void 0 : _t.widthPx) || 0, this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth && (reRender = !0), this.columns[i].width = colWidth);
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
    getColAutosizeWidth(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      var _a;
      let autoSize = columnDef.autoSize;
      if (autoSize.widthPx = columnDef.width, autoSize.autosizeMode === ColAutosizeMode.Locked || autoSize.autosizeMode === ColAutosizeMode.Guide)
        return;
      let dl = this.getDataLength(), isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);
      if (autoSize.autosizeMode === ColAutosizeMode.ContentIntelligent) {
        let colDataTypeOf = autoSize.colDataTypeOf, colDataItem;
        if (dl > 0) {
          let tempRow = this.getDataItem(0);
          tempRow && (colDataItem = tempRow[columnDef.field], isoDateRegExp.test(colDataItem) && (colDataItem = Date.parse(colDataItem)), colDataTypeOf = typeof colDataItem, colDataTypeOf === "object" && (colDataItem instanceof Date && (colDataTypeOf = "date"), typeof moment != "undefined" && colDataItem instanceof moment && (colDataTypeOf = "moment")));
        }
        colDataTypeOf === "boolean" && (autoSize.colValueArray = [!0, !1]), colDataTypeOf === "number" && (autoSize.valueFilterMode = ValueFilterMode.GetGreatestAndSub, autoSize.rowSelectionMode = RowSelectionMode.AllRows), colDataTypeOf === "string" && (autoSize.valueFilterMode = ValueFilterMode.GetLongestText, autoSize.rowSelectionMode = RowSelectionMode.AllRows, autoSize.allowAddlPercent = 5), colDataTypeOf === "date" && (autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]), colDataTypeOf === "moment" && typeof moment != "undefined" && (autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]);
      }
      let colWidth = autoSize.contentSizePx = this.getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);
      colWidth === 0 && (colWidth = autoSize.widthPx || 0);
      let addlPercentMultiplier = autoSize.allowAddlPercent ? 1 + autoSize.allowAddlPercent / 100 : 1;
      colWidth = colWidth * addlPercentMultiplier + (this._options.autosizeColPaddingPx || 0), columnDef.minWidth && colWidth < columnDef.minWidth && (colWidth = columnDef.minWidth), columnDef.maxWidth && colWidth > columnDef.maxWidth && (colWidth = columnDef.maxWidth), (autoSize.autosizeMode === ColAutosizeMode.ContentExpandOnly || (_a = columnDef == null ? void 0 : columnDef.editor) != null && _a.ControlFillsColumn) && colWidth < (columnDef.width || 0) && (colWidth = columnDef.width || 0), autoSize.widthPx = colWidth;
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
    getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      let autoSize = columnDef.autoSize, widthAdjustRatio = 1, i, tempVal, maxLen = 0, maxColWidth = 0;
      if (autoSize.headerWidthPx = 0, autoSize.ignoreHeaderText || (autoSize.headerWidthPx = this.getColHeaderWidth(columnDef)), autoSize.headerWidthPx === 0 && (autoSize.headerWidthPx = columnDef.width ? columnDef.width : columnDef.maxWidth ? columnDef.maxWidth : columnDef.minWidth ? columnDef.minWidth : 20), autoSize.colValueArray)
        return maxColWidth = this.getColWidth(columnDef, gridCanvas, autoSize.colValueArray), Math.max(autoSize.headerWidthPx, maxColWidth);
      let rowInfo = {};
      rowInfo.colIndex = colIndex, rowInfo.rowCount = this.getDataLength(), rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.rowCount - 1, rowInfo.valueArr = null, rowInfo.getRowVal = (j) => this.getDataItem(j)[columnDef.field];
      let rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : void 0) || autoSize.rowSelectionMode;
      if (rowSelectionMode === RowSelectionMode.FirstRow && (rowInfo.endIndex = 0), rowSelectionMode === RowSelectionMode.LastRow && (rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1), rowSelectionMode === RowSelectionMode.FirstNRows && (rowInfo.endIndex = Math.min(autoSize.rowSelectionCount || 0, rowInfo.rowCount) - 1), autoSize.valueFilterMode === ValueFilterMode.DeDuplicate) {
        let rowsDict = {};
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
          rowsDict[rowInfo.getRowVal(i)] = !0;
        if (Object.keys)
          rowInfo.valueArr = Object.keys(rowsDict);
        else {
          rowInfo.valueArr = [];
          for (let v in rowsDict)
            rowsDict && rowInfo.valueArr.push(v);
        }
        rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.length - 1;
      }
      if (autoSize.valueFilterMode === ValueFilterMode.GetGreatestAndSub) {
        let maxVal, maxAbsVal = 0;
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
          tempVal = rowInfo.getRowVal(i), Math.abs(tempVal) > maxAbsVal && (maxVal = tempVal, maxAbsVal = Math.abs(tempVal));
        maxVal = "" + maxVal, maxVal = Array(maxVal.length + 1).join("9"), maxVal = +maxVal, rowInfo.valueArr = [maxVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      if (autoSize.valueFilterMode === ValueFilterMode.GetLongestTextAndSub) {
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
          tempVal = rowInfo.getRowVal(i), (tempVal || "").length > maxLen && (maxLen = tempVal.length);
        tempVal = Array(maxLen + 1).join("m"), widthAdjustRatio = this._options.autosizeTextAvgToMWidthRatio || 0, rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      if (autoSize.valueFilterMode === ValueFilterMode.GetLongestText) {
        maxLen = 0;
        let maxIndex = 0;
        for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
          tempVal = rowInfo.getRowVal(i), (tempVal || "").length > maxLen && (maxLen = tempVal.length, maxIndex = i);
        tempVal = rowInfo.getRowVal(maxIndex), rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      return rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1 && (autoSize.sizeToRemaining = !0), maxColWidth = this.getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio, Math.max(autoSize.headerWidthPx, maxColWidth);
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
    getColWidth(columnDef, gridCanvas, rowInfo) {
      var _a, _b, _c;
      let rowEl = Utils.createDomElement("div", { className: "slick-row ui-widget-content" }, gridCanvas), cellEl = Utils.createDomElement("div", { className: "slick-cell" }, rowEl);
      cellEl.style.position = "absolute", cellEl.style.visibility = "hidden", cellEl.style.textOverflow = "initial", cellEl.style.whiteSpace = "nowrap";
      let i, len, max = 0, maxText = "", formatterResult, val, useCanvas = columnDef.autoSize.widthEvalMode === WidthEvalMode.TextOnly;
      if (((_a = columnDef.autoSize) == null ? void 0 : _a.widthEvalMode) === WidthEvalMode.Auto) {
        let noFormatter = !columnDef.formatterOverride && !columnDef.formatter, formatterIsText = ((_b = columnDef == null ? void 0 : columnDef.formatterOverride) == null ? void 0 : _b.ReturnsTextOnly) || !columnDef.formatterOverride && ((_c = columnDef.formatter) == null ? void 0 : _c.ReturnsTextOnly);
        useCanvas = noFormatter || formatterIsText;
      }
      if (this.canvas_context && useCanvas) {
        let style = getComputedStyle(cellEl);
        for (this.canvas_context.font = style.fontSize + " " + style.fontFamily, i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
          val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, len = formatterResult ? this.canvas_context.measureText(formatterResult).width : 0, len > max && (max = len, maxText = formatterResult);
        return cellEl.textContent = maxText, len = cellEl.offsetWidth, rowEl.remove(), len;
      }
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, this.applyFormatResultToCellNode(formatterResult, cellEl), len = cellEl.offsetWidth, len > max && (max = len);
      return rowEl.remove(), max;
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
    getColHeaderWidth(columnDef) {
      let width = 0, headerColElId = this.getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = `${headerColElId}_`, clone = headerColEl.cloneNode(!0);
      if (headerColEl)
        clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width = clone.offsetWidth, clone.parentNode.removeChild(clone);
      else {
        let header = this.getHeader(columnDef);
        headerColEl = Utils.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header);
        let colNameElm = Utils.createDomElement("span", { className: "slick-column-name" }, headerColEl);
        this.applyHtmlCode(colNameElm, columnDef.name), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", columnDef.headerCssClass && headerColEl.classList.add(...Utils.classNameToList(columnDef.headerCssClass)), width = headerColEl.offsetWidth, header.removeChild(headerColEl);
      }
      return width;
    }
    /**
     * Iterates over all columns to collect current widths (skipping hidden ones), calculates total width
     * and available shrink leeway, then enters a “shrink” loop if the total width exceeds the available
     * viewport width and a “grow” loop if below. Finally, it applies the computed widths to the columns
     * and calls reRenderColumns (with a flag if any width changed) to update the grid.
     */
    legacyAutosizeColumns() {
      let i, c, shrinkLeeway = 0, total = 0, prevTotal = 0, widths = [], availWidth = this.getViewportInnerWidth();
      for (i = 0; i < this.columns.length; i++) {
        if (c = this.columns[i], !c || c.hidden) {
          widths.push(0);
          continue;
        }
        widths.push(c.width || 0), total += c.width || 0, c.resizable && (shrinkLeeway += (c.width || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
      }
      for (prevTotal = total; total > availWidth && shrinkLeeway; ) {
        let shrinkProportion = (total - availWidth) / shrinkLeeway;
        for (i = 0; i < this.columns.length && total > availWidth; i++) {
          if (c = this.columns[i], !c || c.hidden)
            continue;
          let width = widths[i];
          if (!c.resizable || width <= c.minWidth || width <= this.absoluteColumnMinWidth)
            continue;
          let absMinWidth = Math.max(c.minWidth, this.absoluteColumnMinWidth), shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
          shrinkSize = Math.min(shrinkSize, width - absMinWidth), total -= shrinkSize, shrinkLeeway -= shrinkSize, widths[i] -= shrinkSize;
        }
        if (prevTotal <= total)
          break;
        prevTotal = total;
      }
      for (prevTotal = total; total < availWidth; ) {
        let growProportion = availWidth / total;
        for (i = 0; i < this.columns.length && total < availWidth; i++) {
          if (c = this.columns[i], !c || c.hidden)
            continue;
          let currentWidth = widths[i], growSize;
          !c.resizable || c.maxWidth <= currentWidth ? growSize = 0 : growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1e6) || 1, total += growSize, widths[i] += total <= availWidth ? growSize : 0;
        }
        if (prevTotal >= total)
          break;
        prevTotal = total;
      }
      let reRender = !1;
      for (i = 0; i < this.columns.length; i++)
        !c || c.hidden || (this.columns[i].rerenderOnResize && this.columns[i].width !== widths[i] && (reRender = !0), this.columns[i].width = widths[i]);
      this.reRenderColumns(reRender);
    }
    /**
     * Apply Columns Widths in the UI and optionally invalidate & re-render the columns when specified
     * @param {Boolean} shouldReRender - should we invalidate and re-render the grid?
     */
    reRenderColumns(reRender) {
      this.applyColumnHeaderWidths(), this.updateCanvasWidth(!0), this.trigger(this.onAutosizeColumns, { columns: this.columns }), reRender && (this.invalidateAllRows(), this.render());
    }
    /**
     * Returns an array of column definitions filtered to exclude any that are marked as hidden.
     *
     * @returns
     */
    getVisibleColumns() {
      return this.columns.filter((c) => !c.hidden);
    }
    /**
     * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
     * @param {String | Number} id A column id.
     */
    getColumnIndex(id) {
      return this.columnsById[id];
    }
    /**
     * Iterates over the header elements (from both left and right headers) and updates each header’s width based on the
     * corresponding visible column’s width minus a computed adjustment (headerColumnWidthDiff).
     * Finally, it updates the internal column caches.
     *
     * @returns
     */
    applyColumnHeaderWidths() {
      if (!this.initialized)
        return;
      let columnIndex = 0, vc = this.getVisibleColumns();
      this._headers.forEach((header) => {
        for (let i = 0; i < header.children.length; i++, columnIndex++) {
          let h = header.children[i], width = ((vc[columnIndex] || {}).width || 0) - this.headerColumnWidthDiff;
          Utils.width(h) !== width && Utils.width(h, width);
        }
      }), this.updateColumnCaches();
    }
    /**
     * Iterates over all columns (skipping hidden ones) and, for each, retrieves the associated CSS rules
     * (using getColumnCssRules). It then sets the left and right CSS properties so that the columns align
     * correctly within the grid canvas. It also updates the cumulative offset for non–frozen columns.
     */
    applyColumnWidths() {
      var _a;
      let x = 0, w = 0, rule;
      for (let i = 0; i < this.columns.length; i++)
        (_a = this.columns[i]) != null && _a.hidden || (w = this.columns[i].width || 0, rule = this.getColumnCssRules(i), rule.left.style.left = `${x}px`, rule.right.style.right = (this._options.frozenColumn !== -1 && i > this._options.frozenColumn ? this.canvasWidthR : this.canvasWidthL) - x - w + "px", this._options.frozenColumn !== i && (x += this.columns[i].width)), this._options.frozenColumn === i && (x = 0);
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
    setSortColumn(columnId, ascending) {
      this.setSortColumns([{ columnId, sortAsc: ascending }]);
    }
    /**
     * Get column by index - iterates over header containers and returns the header column
     * element corresponding to the given index.
     *
     * @param {Number} id - column index
     * @returns
     */
    getColumnByIndex(id) {
      let result;
      return this._headers.every((header) => {
        let length = header.children.length;
        return id < length ? (result = header.children[id], !1) : (id -= length, !0);
      }), result;
    }
    /**
     * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ] to
     * define the grid's sort order. When called, this will apply a sort glyph in either ascending
     * or descending form to the header of each column specified in the array.
     * Note that this does not actually sort the column. It only adds the sort glyph to the header.
     *
     * @param {ColumnSort[]} cols - column sort
     */
    setSortColumns(cols) {
      this.sortColumns = cols;
      let numberCols = this._options.numberedMultiColumnSort && this.sortColumns.length > 1;
      this._headers.forEach((header) => {
        let indicators = header.querySelectorAll(".slick-header-column-sorted");
        indicators.forEach((indicator) => {
          indicator.classList.remove("slick-header-column-sorted");
        }), indicators = header.querySelectorAll(".slick-sort-indicator"), indicators.forEach((indicator) => {
          indicator.classList.remove("slick-sort-indicator-asc"), indicator.classList.remove("slick-sort-indicator-desc");
        }), indicators = header.querySelectorAll(".slick-sort-indicator-numbered"), indicators.forEach((el) => {
          el.textContent = "";
        });
      });
      let i = 1;
      this.sortColumns.forEach((col) => {
        Utils.isDefined(col.sortAsc) || (col.sortAsc = !0);
        let columnIndex = this.getColumnIndex(col.columnId);
        if (Utils.isDefined(columnIndex)) {
          let column = this.getColumnByIndex(columnIndex);
          if (column) {
            column.classList.add("slick-header-column-sorted");
            let indicator = column.querySelector(".slick-sort-indicator");
            indicator == null || indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc"), numberCols && (indicator = column.querySelector(".slick-sort-indicator-numbered"), indicator && (indicator.textContent = String(i)));
          }
        }
        i++;
      });
    }
    /** Returns the current array of column definitions. */
    getColumns() {
      return this.columns;
    }
    /** Get sorted columns representing the current sorting state of the grid **/
    getSortColumns() {
      return this.sortColumns;
    }
    /**
     * Iterates over all columns to compute and store their left and right boundaries
     * (based on cumulative widths). Resets the offset when a frozen column is encountered.
     */
    updateColumnCaches() {
      this.columnPosLeft = [], this.columnPosRight = [];
      let x = 0;
      for (let i = 0, ii = this.columns.length; i < ii; i++)
        !this.columns[i] || this.columns[i].hidden || (this.columnPosLeft[i] = x, this.columnPosRight[i] = x + (this.columns[i].width || 0), this._options.frozenColumn === i ? x = 0 : x += this.columns[i].width || 0);
    }
    /**
     * Iterates over each column to (a) save its original width as widthRequest,
     * (b) apply default properties (using mixinDefaults if set) to both the column
     * and its autoSize property, (c) update the columnsById mapping, and (d) adjust
     * the width if it is less than minWidth or greater than maxWidth.
     */
    updateColumnProps() {
      this.columnsById = {};
      for (let i = 0; i < this.columns.length; i++) {
        let m = this.columns[i];
        m.width && (m.widthRequest = m.width), this._options.mixinDefaults ? (Utils.applyDefaults(m, this._columnDefaults), m.autoSize || (m.autoSize = {}), Utils.applyDefaults(m.autoSize, this._columnAutosizeDefaults)) : (m = this.columns[i] = Utils.extend({}, this._columnDefaults, m), m.autoSize = Utils.extend({}, this._columnAutosizeDefaults, m.autoSize)), this.columnsById[m.id] = i, m.minWidth && (m.width || 0) < m.minWidth && (m.width = m.minWidth), m.maxWidth && (m.width || 0) > m.maxWidth && (m.width = m.maxWidth);
      }
    }
    /**
     * Sets grid columns. Column headers will be recreated and all rendered rows will be removed.
     * To rerender the grid (if necessary), call render().
     * @param {Column[]} columnDefinitions An array of column definitions.
     */
    setColumns(columnDefinitions) {
      this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns: columnDefinitions, grid: this }), this.columns = columnDefinitions, this.updateColumnsInternal(), this.trigger(this.onAfterSetColumns, { newColumns: columnDefinitions, grid: this });
    }
    /** Update columns for when a hidden property has changed but the column list itself has not changed. */
    updateColumns() {
      this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this }), this.updateColumnsInternal();
    }
    /**
     * Triggers onBeforeUpdateColumns and calls updateColumnsInternal to update column properties,
     * caches, header/footer elements, CSS rules, canvas dimensions, and selections without changing the column array.
     */
    updateColumnsInternal() {
      var _a;
      this.updateColumnProps(), this.updateColumnCaches(), this.initialized && (this.setPaneFrozenClasses(), this.setPaneVisibility(), this.setOverflow(), this.invalidateAllRows(), this.createColumnHeaders(), this.createColumnFooter(), this.removeCssRules(), this.createCssRules(), this.resizeCanvas(), this.updateCanvasWidth(), this.applyColumnHeaderWidths(), this.applyColumnWidths(), this.handleScroll(), (_a = this.getSelectionModel()) == null || _a.refreshSelections());
    }
    /////////////////////////////////////////////////////////////////////
    /// End Column Management
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /// Data Management and Editing
    /////////////////////////////////////////////////////////////////////
    /** Get Editor lock */
    getEditorLock() {
      return this._options.editorLock;
    }
    /** Get Editor Controller */
    getEditController() {
      return this.editController;
    }
    /**
     * Sets a new source for databinding and removes all rendered rows. Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
     * @param {CustomDataView|Array<*>} newData New databinding source using a regular JavaScript array.. or a custom object exposing getItem(index) and getLength() functions.
     * @param {Number} [scrollToTop] If true, the grid will reset the vertical scroll position to the top of the grid.
     */
    setData(newData, scrollToTop) {
      this.data = newData, this.invalidateAllRows(), this.updateRowCount(), scrollToTop && this.scrollTo(0);
    }
    /** Returns an array of every data object, unless you're using DataView in which case it returns a DataView object. */
    getData() {
      return this.data;
    }
    /** Returns the size of the databinding source. */
    getDataLength() {
      var _a, _b;
      return this.data.getLength ? this.data.getLength() : (_b = (_a = this.data) == null ? void 0 : _a.length) != null ? _b : 0;
    }
    /**
     * Returns the number of data items plus an extra row if enableAddRow is true and paging conditions allow.
     *
     * @returns
     */
    getDataLengthIncludingAddNew() {
      return this.getDataLength() + (this._options.enableAddRow && (!this.pagingActive || this.pagingIsLastPage) ? 1 : 0);
    }
    /**
     * Returns the databinding item at a given position.
     * @param {Number} index Item row index.
     */
    getDataItem(i) {
      return this.data.getItem ? this.data.getItem(i) : this.data[i];
    }
    /**  Are we using a DataView? */
    hasDataView() {
      return !Array.isArray(this.data);
    }
    /**
     * Returns item metadata by a row index when it exists
     * @param {Number} row
     * @returns {ItemMetadata | null}
     */
    getItemMetadaWhenExists(row) {
      return "getItemMetadata" in this.data ? this.data.getItemMetadata(row) : null;
    }
    /**
     * Determines the proper formatter for a given cell by checking row metadata for column overrides,
     * then falling back to the column’s formatter, a formatter from the formatterFactory, or the default formatter.
     *
     * @param {number} row - The row index of the cell.
     * @param {C} column - The column definition containing formatting options.
     * @returns {Formatter} - The resolved formatter function for the specified cell.
     */
    getFormatter(row, column) {
      var _a, _b, _c;
      let rowMetadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row), columnOverrides = (rowMetadata == null ? void 0 : rowMetadata.columns) && (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]);
      return (columnOverrides == null ? void 0 : columnOverrides.formatter) || (rowMetadata == null ? void 0 : rowMetadata.formatter) || column.formatter || ((_c = this._options.formatterFactory) == null ? void 0 : _c.getFormatter(column)) || this._options.defaultFormatter;
    }
    /**
     * Retrieves the editor (or editor constructor) for the specified cell by first checking for an override
     * in row metadata and then falling back to the column’s editor or an editor from the editorFactory.
     *
     * @param {number} row - The row index of the cell.
     * @param {number} cell - The column index of the cell.
     * @returns {Editor | EditorConstructor | null | undefined} - The editor instance or constructor if available, otherwise `null` or `undefined`.
     */
    getEditor(row, cell) {
      var _a, _b, _c, _d;
      let column = this.columns[cell], rowMetadata = this.getItemMetadaWhenExists(row), columnMetadata = rowMetadata == null ? void 0 : rowMetadata.columns;
      return ((_a = columnMetadata == null ? void 0 : columnMetadata[column.id]) == null ? void 0 : _a.editor) !== void 0 ? columnMetadata[column.id].editor : ((_b = columnMetadata == null ? void 0 : columnMetadata[cell]) == null ? void 0 : _b.editor) !== void 0 ? columnMetadata[cell].editor : column.editor || ((_d = (_c = this._options) == null ? void 0 : _c.editorFactory) == null ? void 0 : _d.getEditor(column));
    }
    /**
     * Returns the value for the specified column from a given data item. If a dataItemColumnValueExtractor
     * is provided in options, it is used; otherwise, the property named by the column’s field is returned.
     *
     * @param {TData} item - The data item containing the requested value.
     * @param {C} columnDef - The column definition containing the field key.
     * @returns {*} - The extracted value from the data item based on the column definition.
     */
    getDataItemValueForColumn(item, columnDef) {
      return this._options.dataItemColumnValueExtractor ? this._options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Data Management and Editing - Cell Switchers
    ////////////////////////////////////////////////////////////////////
    /** Resets active cell by making cell normal and other internal reset. */
    resetActiveCell() {
      this.setActiveCellInternal(null, !1);
    }
    /** Clear active cell by making cell normal & removing "active" CSS class. */
    unsetActiveCell() {
      var _a, _b;
      Utils.isDefined(this.activeCellNode) && (this.makeActiveCellNormal(), this.activeCellNode.classList.remove("active"), (_b = (_a = this.rowsCache[this.activeRow]) == null ? void 0 : _a.rowNode) == null || _b.forEach((node) => node.classList.remove("active")));
    }
    /** @alias `setFocus` */
    focus() {
      this.setFocus();
    }
    // Sets focus to one of the hidden focus sink elements based on the current tabbing direction.
    setFocus() {
      this.tabbingDirection === -1 ? this._focusSink.focus() : this._focusSink2.focus();
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
    setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
      var _a, _b;
      if (this.unsetActiveCell(), this.activeCellNode = newCell, Utils.isDefined(this.activeCellNode)) {
        let activeCellOffset = Utils.offset(this.activeCellNode), rowOffset = Math.floor(Utils.offset(Utils.parents(this.activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils.parents(this.activeCellNode, ".grid-canvas-bottom").length;
        this.hasFrozenRows && isBottom && (rowOffset -= this._options.frozenBottom ? Utils.height(this._canvasTopL) : this.frozenRowsHeight);
        let cell = this.getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
        this.activeRow = cell.row, this.activePosY = cell.row, this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode), !Utils.isDefined(opt_editMode) && this._options.autoEditNewRow && (opt_editMode = this.activeRow === this.getDataLength() || this._options.autoEdit), this._options.showCellSelection && (document.querySelectorAll(".slick-cell.active").forEach((node) => node.classList.remove("active")), this.activeCellNode.classList.add("active"), (_b = (_a = this.rowsCache[this.activeRow]) == null ? void 0 : _a.rowNode) == null || _b.forEach((node) => node.classList.add("active"))), this._options.editable && opt_editMode && this.isCellPotentiallyEditable(this.activeRow, this.activeCell) && (this._options.asyncEditorLoading ? (window.clearTimeout(this.h_editorLoader), this.h_editorLoader = window.setTimeout(() => {
          this.makeActiveCellEditable(void 0, preClickModeOn, e);
        }, this._options.asyncEditorLoadDelay)) : this.makeActiveCellEditable(void 0, preClickModeOn, e));
      } else
        this.activeRow = this.activeCell = null;
      suppressActiveCellChangedEvent || this.trigger(this.onActiveCellChanged, this.getActiveCell());
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
    isCellPotentiallyEditable(row, cell) {
      let dataLength = this.getDataLength();
      return !(row < dataLength && !this.getDataItem(row) || this.columns[cell].cannotTriggerInsert && row >= dataLength || !this.columns[cell] || this.columns[cell].hidden || !this.getEditor(row, cell));
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
    makeActiveCellNormal(refocusActiveCell = !1) {
      var _a;
      if (this.currentEditor) {
        if (this.trigger(this.onBeforeCellEditorDestroy, { editor: this.currentEditor }), this.currentEditor.destroy(), this.currentEditor = null, this.activeCellNode) {
          let d = this.getDataItem(this.activeRow);
          if (this.activeCellNode.classList.remove("editable"), this.activeCellNode.classList.remove("invalid"), d) {
            let column = this.columns[this.activeCell], formatterResult = this.getFormatter(this.activeRow, column)(this.activeRow, this.activeCell, this.getDataItemValueForColumn(d, column), column, d, this);
            this.applyFormatResultToCellNode(formatterResult, this.activeCellNode), this.invalidatePostProcessingResults(this.activeRow);
          }
          refocusActiveCell && this.setFocus();
        }
        navigator.userAgent.toLowerCase().match(/msie/) && this.clearTextSelection(), (_a = this.getEditorLock()) == null || _a.deactivate(this.editController);
      }
    }
    /**
     * A public method that starts editing on the active cell by calling
     * makeActiveCellEditable with the provided editor, pre–click flag, and event.
     */
    editActiveCell(editor, preClickModeOn, e) {
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
    makeActiveCellEditable(editor, preClickModeOn, e) {
      var _a, _b, _c, _d;
      if (!this.activeCellNode)
        return;
      if (!this._options.editable)
        throw new Error("SlickGrid makeActiveCellEditable : should never get called when this._options.editable is false");
      if (window.clearTimeout(this.h_editorLoader), !this.isCellPotentiallyEditable(this.activeRow, this.activeCell))
        return;
      let columnDef = this.columns[this.activeCell], item = this.getDataItem(this.activeRow);
      if (this.trigger(this.onBeforeEditCell, { row: this.activeRow, cell: this.activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
        this.setFocus();
        return;
      }
      (_a = this.getEditorLock()) == null || _a.activate(this.editController), this.activeCellNode.classList.add("editable");
      let useEditor = editor || this.getEditor(this.activeRow, this.activeCell);
      if (!useEditor || typeof useEditor != "function")
        return;
      !editor && !useEditor.suppressClearOnEdit && Utils.emptyElement(this.activeCellNode);
      let metadata = this.getItemMetadaWhenExists(this.activeRow);
      metadata = metadata == null ? void 0 : metadata.columns;
      let columnMetaData = metadata && (metadata[columnDef.id] || metadata[this.activeCell]), editorArgs = {
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
      };
      this.currentEditor = new useEditor(editorArgs), item && this.currentEditor && (this.currentEditor.loadValue(item), preClickModeOn && ((_b = this.currentEditor) != null && _b.preClick) && this.currentEditor.preClick()), this.serializedEditorValue = (_c = this.currentEditor) == null ? void 0 : _c.serializeValue(), (_d = this.currentEditor) != null && _d.position && this.handleActiveCellPositionChange();
    }
    /**
     * Commits the current edit and sets focus back to the grid.
     * If the commit fails due to validation, the focus remains in the editor.
     */
    commitEditAndSetFocus() {
      var _a;
      (_a = this.getEditorLock()) != null && _a.commitCurrentEdit() && (this.setFocus(), this._options.autoEdit && !this._options.autoCommitEdit && this.navigateDown());
    }
    /**
     * Cancels the current edit and restores focus to the grid.
     */
    cancelEditAndSetFocus() {
      var _a;
      (_a = this.getEditorLock()) != null && _a.cancelCurrentEdit() && this.setFocus();
    }
    // IEditor implementation for the editor lock
    /**
     * Commits the current edit, validating and applying changes if necessary.
     * If validation fails, an error is triggered and focus remains in the editor.
     *
     * @returns {boolean} Whether the edit was successfully committed.
     */
    commitCurrentEdit() {
      var _a;
      let self = this, item = self.getDataItem(self.activeRow), column = self.columns[self.activeCell];
      if (self.currentEditor) {
        if (self.currentEditor.isValueChanged()) {
          let validationResults = self.currentEditor.validate();
          if (validationResults.valid) {
            let row = self.activeRow, cell = self.activeCell, editor = self.currentEditor, serializedValue = self.currentEditor.serializeValue(), prevSerializedValue = self.serializedEditorValue;
            if (self.activeRow < self.getDataLength()) {
              let editCommand = {
                row,
                cell,
                editor,
                serializedValue,
                prevSerializedValue,
                execute: () => {
                  editor.applyValue(item, serializedValue), self.updateRow(row), self.trigger(self.onCellChange, { command: "execute", row, cell, item, column });
                },
                undo: () => {
                  editor.applyValue(item, prevSerializedValue), self.updateRow(row), self.trigger(self.onCellChange, { command: "undo", row, cell, item, column });
                }
              };
              self._options.editCommandHandler ? (self.makeActiveCellNormal(!0), self._options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), self.makeActiveCellNormal(!0));
            } else {
              let newItem = {};
              self.currentEditor.applyValue(newItem, self.currentEditor.serializeValue()), self.makeActiveCellNormal(!0), self.trigger(self.onAddNewRow, { item: newItem, column });
            }
            return !((_a = self.getEditorLock()) != null && _a.isActive());
          } else
            return self.activeCellNode && (self.activeCellNode.classList.remove("invalid"), Utils.width(self.activeCellNode), self.activeCellNode.classList.add("invalid")), self.trigger(self.onValidationError, {
              editor: self.currentEditor,
              cellNode: self.activeCellNode,
              validationResults,
              row: self.activeRow,
              cell: self.activeCell,
              column
            }), self.currentEditor.focus(), !1;
        }
        self.makeActiveCellNormal(!0);
      }
      return !0;
    }
    /**
     * Cancels the current edit and restores the cell to normal mode.
     *
     * @returns {boolean} Always returns true.
     */
    cancelCurrentEdit() {
      return this.makeActiveCellNormal(), !0;
    }
    /** Returns an array of row indices corresponding to the currently selected rows. */
    getSelectedRows() {
      if (!this.selectionModel)
        throw new Error("SlickGrid Selection model is not set");
      return this.selectedRows.slice(0);
    }
    /**
     * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
     * @param {Array<number>} rowsArray - an array of row numbers.
     * @param {String} [caller] - an optional string to identify who called the method
     */
    setSelectedRows(rows, caller) {
      var _a;
      if (!this.selectionModel)
        throw new Error("SlickGrid Selection model is not set");
      this && this.getEditorLock && !((_a = this.getEditorLock()) != null && _a.isActive()) && this.selectionModel.setSelectedRanges(this.rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
    }
    ///////////////////////////////////////////////////////////////////////////
    // Event Handling and Interactivity
    /////////////////////////////////////////////////////////////////////////
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
    trigger(evt, args, e) {
      let event = e || new SlickEventData(e, args), eventArgs = args || {};
      return eventArgs.grid = this, evt.notify(eventArgs, event, this);
    }
    /**
     * Handles the mouseout event for a cell.
     * Triggers the `onMouseLeave` event.
     *
     * @param {MouseEvent & { target: HTMLElement }} e - The mouse event.
     */
    handleCellMouseOut(e) {
      this.trigger(this.onMouseLeave, {}, e);
    }
    /**
     * Handles mouse hover over a header cell.
     * Adds CSS classes to indicate a hover state.
     *
     * @param {Event | SlickEventData_} e - The mouse event.
     */
    handleHeaderMouseHoverOn(e) {
      e == null || e.target.classList.add("ui-state-hover", "slick-state-hover");
    }
    /**
     * Handles mouse hover off a header cell.
     * Removes CSS classes indicating a hover state.
     *
     * @param {Event | SlickEventData_} e - The mouse event.
     */
    handleHeaderMouseHoverOff(e) {
      e == null || e.target.classList.remove("ui-state-hover", "slick-state-hover");
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
    handleSelectedRangesChanged(e, ranges) {
      var _a, _b;
      let ne = e.getNativeEvent(), previousSelectedRows = this.selectedRows.slice(0);
      this.selectedRows = [];
      let hash = {};
      for (let i = 0; i < ranges.length; i++)
        for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] || (this.selectedRows.push(j), hash[j] = {});
          for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
            this.canCellBeSelected(j, k) && (hash[j][this.columns[k].id] = this._options.selectedCellCssClass);
        }
      if (this.setCellCssStyles(this._options.selectedCellCssClass || "", hash), this.simpleArrayEquals(previousSelectedRows, this.selectedRows)) {
        let caller = (_b = (_a = ne == null ? void 0 : ne.detail) == null ? void 0 : _a.caller) != null ? _b : "click", selectedRowsSet = new Set(this.getSelectedRows()), previousSelectedRowsSet = new Set(previousSelectedRows), newSelectedAdditions = Array.from(selectedRowsSet).filter((i) => !previousSelectedRowsSet.has(i)), newSelectedDeletions = Array.from(previousSelectedRowsSet).filter((i) => !selectedRowsSet.has(i));
        this.trigger(this.onSelectedRowsChanged, {
          rows: this.getSelectedRows(),
          previousSelectedRows,
          caller,
          changedSelectedRows: newSelectedAdditions,
          changedUnselectedRows: newSelectedDeletions
        }, e);
      }
    }
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
    handleMouseWheel(e, _delta, deltaX, deltaY) {
      this.scrollHeight = this._viewportScrollContainerY.scrollHeight, e.shiftKey ? this.scrollLeft = this._viewportScrollContainerX.scrollLeft + deltaX * 10 : (this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - deltaY * this._options.rowHeight), this.scrollLeft = this._viewportScrollContainerX.scrollLeft + deltaX * 10), this._handleScroll("mousewheel") && e.stopPropagation();
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
    handleDragInit(e, dd) {
      let cell = this.getCellFromEvent(e);
      if (!cell || !this.cellExists(cell.row, cell.cell))
        return !1;
      let retval = this.trigger(this.onDragInit, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
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
    handleDragStart(e, dd) {
      let cell = this.getCellFromEvent(e);
      if (!cell || !this.cellExists(cell.row, cell.cell))
        return !1;
      let retval = this.trigger(this.onDragStart, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
    }
    // Triggers the onDrag event with the current drag position and event, and returns the event’s return value.
    handleDrag(e, dd) {
      return this.trigger(this.onDrag, dd, e).getReturnValue();
    }
    // Called when a drag operation completes; it triggers the onDragEnd event with the current drag position and event.
    handleDragEnd(e, dd) {
      this.trigger(this.onDragEnd, dd, e);
    }
    /**
     * Handles keydown events for grid navigation and editing.
     * It triggers the `onKeyDown` event and, based on the key pressed (such as HOME, END, arrow keys, PAGE_UP/DOWN, TAB, ENTER, ESC),
     * calls the appropriate navigation or editing method. If the key event is handled,
     * it stops propagation and prevents the default browser behaviour.
     *
     * @param {KeyboardEvent & { originalEvent: Event; }} e - The keydown event, with the original event attached.
     */
    handleKeyDown(e) {
      var _a, _b, _c, _d;
      let handled = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e).isImmediatePropagationStopped();
      if (!handled && !e.shiftKey && !e.altKey) {
        if (this._options.editable && ((_a = this.currentEditor) != null && _a.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(e.which) > -1)
          return;
        e.ctrlKey && e.key === "Home" ? this.navigateTopStart() : e.ctrlKey && e.key === "End" ? this.navigateBottomEnd() : e.ctrlKey && e.key === "ArrowUp" ? this.navigateTop() : e.ctrlKey && e.key === "ArrowDown" ? this.navigateBottom() : e.ctrlKey && e.key === "ArrowLeft" || !e.ctrlKey && e.key === "Home" ? this.navigateRowStart() : (e.ctrlKey && e.key === "ArrowRight" || !e.ctrlKey && e.key === "End") && this.navigateRowEnd();
      }
      if (!handled)
        if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
          if (this._options.editable && ((_b = this.currentEditor) != null && _b.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(e.which) > -1)
            return;
          if (e.which === keyCode.ESCAPE) {
            if (!((_c = this.getEditorLock()) != null && _c.isActive()))
              return;
            this.cancelEditAndSetFocus();
          } else e.which === keyCode.PAGE_DOWN ? (this.navigatePageDown(), handled = !0) : e.which === keyCode.PAGE_UP ? (this.navigatePageUp(), handled = !0) : e.which === keyCode.LEFT ? handled = this.navigateLeft() : e.which === keyCode.RIGHT ? handled = this.navigateRight() : e.which === keyCode.UP ? handled = this.navigateUp() : e.which === keyCode.DOWN ? handled = this.navigateDown() : e.which === keyCode.TAB ? handled = this.navigateNext() : e.which === keyCode.ENTER && (this._options.editable && (this.currentEditor ? this.activeRow === this.getDataLength() ? this.navigateDown() : this.commitEditAndSetFocus() : (_d = this.getEditorLock()) != null && _d.commitCurrentEdit() && this.makeActiveCellEditable(void 0, void 0, e)), handled = !0);
        } else e.which === keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = this.navigatePrev());
      if (handled) {
        e.stopPropagation(), e.preventDefault();
        try {
          e.originalEvent.keyCode = 0;
        } catch (error) {
        }
      }
    }
    /**
     * Handles a click event on the grid. It logs the event (for debugging), ensures focus is restored if necessary,
     * triggers the onClick event, and if the clicked cell is selectable and not already active, scrolls it into view
     * and activates it.
     *
     * @param {DOMEvent<HTMLDivElement> | SlickEventData_} evt - The click event, either a native DOM event or a Slick event.
     */
    handleClick(evt) {
      var _a, _b, _c;
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
      if (!this.currentEditor && (e.target !== document.activeElement || e.target.classList.contains("slick-cell"))) {
        let selection = this.getTextSelection();
        this.setFocus(), this.setTextSelection(selection);
      }
      let cell = this.getCellFromEvent(e);
      if (!(!cell || this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell) && (evt = this.trigger(this.onClick, { row: cell.row, cell: cell.cell }, evt || e), !evt.isImmediatePropagationStopped() && this.canCellBeActive(cell.row, cell.cell) && (!((_a = this.getEditorLock()) != null && _a.isActive()) || (_b = this.getEditorLock()) != null && _b.commitCurrentEdit()))) {
        this.scrollRowIntoView(cell.row, !1);
        let preClickModeOn = ((_c = e.target) == null ? void 0 : _c.className) === preClickClassName, column = this.columns[cell.cell], suppressActiveCellChangedEvent = !!(this._options.editable && (column != null && column.editor) && this._options.suppressActiveCellChangeOnEdit);
        this.setActiveCellInternal(this.getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
      }
    }
    /**
     * Retrieves the cell DOM element from the event target.
     * If the cell exists and is not currently being edited, triggers the onContextMenu event.
     */
    handleContextMenu(e) {
      let cell = e.target.closest(".slick-cell");
      cell && (this.activeCellNode === cell && this.currentEditor !== null || this.trigger(this.onContextMenu, {}, e));
    }
    /**
     * Retrieves the cell from the event and triggers the onDblClick event.
     * If the event is not prevented and the grid is editable,
     * it initiates cell editing by calling gotoCell with edit mode enabled.
     */
    handleDblClick(e) {
      let cell = this.getCellFromEvent(e);
      !cell || this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell || (this.trigger(this.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && this._options.editable && this.gotoCell(cell.row, cell.cell, !0, e));
    }
    /**
     * When the mouse enters a header column element, retrieves the column definition from the element’s
     * stored data and triggers the onHeaderMouseEnter event with the column and grid reference.
     */
    handleHeaderMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && this.trigger(this.onHeaderMouseEnter, {
        column: c,
        grid: this
      }, e);
    }
    /**
     * Similar to handleHeaderMouseEnter, but triggers the onHeaderMouseLeave event
     * when the mouse leaves a header column element.
     */
    handleHeaderMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && this.trigger(this.onHeaderMouseLeave, {
        column: c,
        grid: this
      }, e);
    }
    /**
     * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseEnter event.
     */
    handleHeaderRowMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && this.trigger(this.onHeaderRowMouseEnter, {
        column: c,
        grid: this
      }, e);
    }
    /**
     * Retrieves the column from the header row cell element and triggers the onHeaderRowMouseLeave event.
     */
    handleHeaderRowMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && this.trigger(this.onHeaderRowMouseLeave, {
        column: c,
        grid: this
      }, e);
    }
    /**
     * Retrieves the header column element and its associated column definition,
     * then triggers the onHeaderContextMenu event with the column data.
     */
    handleHeaderContextMenu(e) {
      let header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
      this.trigger(this.onHeaderContextMenu, { column }, e);
    }
    /**
     * If not in the middle of a column resize, retrieves the header column element and its column definition, then triggers the onHeaderClick event.
     */
    handleHeaderClick(e) {
      if (!this.columnResizeDragging) {
        let header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
        column && this.trigger(this.onHeaderClick, { column }, e);
      }
    }
    /**
     * Triggers the onPreHeaderContextMenu event with the event target (typically the pre–header panel).
     */
    handlePreHeaderContextMenu(e) {
      this.trigger(this.onPreHeaderContextMenu, { node: e.target }, e);
    }
    /**
     * If not resizing columns, triggers the onPreHeaderClick event with the event target.
     */
    handlePreHeaderClick(e) {
      this.columnResizeDragging || this.trigger(this.onPreHeaderClick, { node: e.target }, e);
    }
    /**
     * Retrieves the footer cell element and its column definition, then triggers the onFooterContextMenu event.
     */
    handleFooterContextMenu(e) {
      let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      this.trigger(this.onFooterContextMenu, { column }, e);
    }
    /**
     * Retrieves the footer cell element and its column definition, then triggers the onFooterClick event.
     */
    handleFooterClick(e) {
      let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      this.trigger(this.onFooterClick, { column }, e);
    }
    /**
     * Triggers the onMouseEnter event when the mouse pointer enters a cell element.
     */
    handleCellMouseOver(e) {
      this.trigger(this.onMouseEnter, {}, e);
    }
    /**
     * Handles the change in the position of the active cell.
     * Triggers the `onActiveCellPositionChanged` event and adjusts the editor visibility and positioning.
     */
    handleActiveCellPositionChange() {
      if (this.activeCellNode && (this.trigger(this.onActiveCellPositionChanged, {}), this.currentEditor)) {
        let cellBox = this.getActiveCellPosition();
        this.currentEditor.show && this.currentEditor.hide && (cellBox.visible ? this.currentEditor.show() : this.currentEditor.hide()), this.currentEditor.position && this.currentEditor.position(cellBox);
      }
    }
    /**
     * limits the frequency at which the provided action is executed.
     * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
     * call dequeue to cancel any pending action.
     */
    actionThrottle(action, minPeriod_ms) {
      let blocked = !1, queued = !1, enqueue = () => {
        blocked ? queued = !0 : blockAndExecute();
      }, dequeue = () => {
        queued = !1;
      }, blockAndExecute = () => {
        blocked = !0, window.clearTimeout(this._executionBlockTimer), this._executionBlockTimer = window.setTimeout(unblock, minPeriod_ms), action.call(this);
      }, unblock = () => {
        queued ? (dequeue(), blockAndExecute()) : blocked = !1;
      };
      return {
        enqueue: enqueue.bind(this),
        dequeue: dequeue.bind(this)
      };
    }
    /**
     * Returns a hash containing row and cell indexes from a standard W3C event.
     * @param {*} event A standard W3C event.
     */
    getCellFromEvent(evt) {
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, targetEvent = e.touches ? e.touches[0] : e, cellNode = e.target.closest(".slick-cell");
      if (!cellNode)
        return null;
      let row = this.getRowFromNode(cellNode.parentNode);
      if (this.hasFrozenRows) {
        let rowOffset = 0, c = Utils.offset(Utils.parents(cellNode, ".grid-canvas")[0]);
        Utils.parents(cellNode, ".grid-canvas-bottom").length && (rowOffset = this._options.frozenBottom ? Utils.height(this._canvasTopL) : this.frozenRowsHeight), row = this.getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
      }
      let cell = this.getCellFromNode(cellNode);
      return !Utils.isDefined(row) || !Utils.isDefined(cell) ? null : { row, cell };
    }
    /////////////////////////////////////////////////////////////////////
    // End Event Management and Interactivity
    ///////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    // Rendering and Layout Management
    ///////////////////////////////////////////////////////////////////
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
    applyHtmlCode(target, val, options) {
      if (target)
        if (val instanceof HTMLElement || val instanceof DocumentFragment)
          (options == null ? void 0 : options.emptyTarget) !== !1 && Utils.emptyElement(target), target.appendChild(val);
        else {
          if ((options == null ? void 0 : options.skipEmptyReassignment) !== !1 && !Utils.isDefined(val) && !target.innerHTML)
            return;
          let sanitizedText = val;
          typeof sanitizedText == "number" || typeof sanitizedText == "boolean" ? target.textContent = sanitizedText : (sanitizedText = this.sanitizeHtmlString(val), this._options.enableHtmlRendering && sanitizedText ? target.innerHTML = sanitizedText : target.textContent = sanitizedText);
        }
    }
    /** Get Grid Canvas Node DOM Element */
    getCanvasNode(columnIdOrIdx, rowIndex) {
      return this._getContainerElement(this.getCanvases(), columnIdOrIdx, rowIndex);
    }
    /** Get the canvas DOM element */
    getActiveCanvasNode(e) {
      return e === void 0 ? this._activeCanvasNode : (e instanceof SlickEventData && (e = e.getNativeEvent()), this._activeCanvasNode = e == null ? void 0 : e.target.closest(".grid-canvas"), this._activeCanvasNode);
    }
    /** Get the canvas DOM element */
    getCanvases() {
      return this._canvas;
    }
    /** Get the Viewport DOM node element */
    getViewportNode(columnIdOrIdx, rowIndex) {
      return this._getContainerElement(this.getViewports(), columnIdOrIdx, rowIndex);
    }
    /** Get all the Viewport node elements */
    getViewports() {
      return this._viewport;
    }
    /**
     * Calls setActiveViewportNode (using the provided event) to set the active viewport,
     * then returns the active viewport DOM element.
     *
     * @param e
     * @returns
     */
    getActiveViewportNode(e) {
      return this.setActiveViewportNode(e), this._activeViewportNode;
    }
    /**
     * Sets an active viewport node
     *
     * @param {number | string} [columnIdOrIdx] - The column identifier or index.
     * @param {number} [rowIndex] - The row index.
     * @returns {HTMLElement} The corresponding viewport element.
     */
    setActiveViewportNode(e) {
      return e instanceof SlickEventData && (e = e.getNativeEvent()), this._activeViewportNode = e == null ? void 0 : e.target.closest(".slick-viewport"), this._activeViewportNode;
    }
    /** Get the headers width in pixel
     *
     * Iterates over all columns to accumulate the widths for the left and right header sections,
     * adds scrollbar width if needed, and adjusts for frozen columns.
     * Returns the computed overall header width in pixels.
    */
    getHeadersWidth() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      this.headersWidth = this.headersWidthL = this.headersWidthR = 0;
      let includeScrollbar = !this._options.autoHeight, i = 0, ii = this.columns.length;
      for (i = 0; i < ii; i++) {
        if (!this.columns[i] || this.columns[i].hidden)
          continue;
        let width = this.columns[i].width;
        this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += width || 0 : this.headersWidthL += width || 0;
      }
      return includeScrollbar && (this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0 : this.headersWidthL += (_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.width) != null ? _d : 0), this.hasFrozenColumns() ? (this.headersWidthL = this.headersWidthL + 1e3, this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.headersWidthL, this.headersWidthR += (_f = (_e = this.scrollbarDimensions) == null ? void 0 : _e.width) != null ? _f : 0) : (this.headersWidthL += (_h = (_g = this.scrollbarDimensions) == null ? void 0 : _g.width) != null ? _h : 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidth = this.headersWidthL + this.headersWidthR, Math.max(this.headersWidth, this.viewportW) + 1e3;
    }
    /** Get the grid canvas width
     *
     * Computes the available width (considering vertical scrollbar if present),
     * then iterates over the columns (left vs. right based on frozen columns) to sum their widths.
     * If full–width rows are enabled, extra width is added. Returns the total calculated width.
    */
    getCanvasWidth() {
      let availableWidth = this.getViewportInnerWidth(), i = this.columns.length;
      for (this.canvasWidthL = this.canvasWidthR = 0; i--; )
        !this.columns[i] || this.columns[i].hidden || (this.hasFrozenColumns() && i > this._options.frozenColumn ? this.canvasWidthR += this.columns[i].width || 0 : this.canvasWidthL += this.columns[i].width || 0);
      let totalRowWidth = this.canvasWidthL + this.canvasWidthR;
      if (this._options.fullWidthRows) {
        let extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
        extraWidth > 0 && (totalRowWidth += extraWidth, this.hasFrozenColumns() ? this.canvasWidthR += extraWidth : this.canvasWidthL += extraWidth);
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
    updateCanvasWidth(forceColumnWidthsUpdate) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      let oldCanvasWidth = this.canvasWidth, oldCanvasWidthL = this.canvasWidthL, oldCanvasWidthR = this.canvasWidthR;
      this.canvasWidth = this.getCanvasWidth(), this._options.createTopHeaderPanel && Utils.width(this._topHeaderPanel, (_a = this._options.topHeaderPanelWidth) != null ? _a : this.canvasWidth);
      let widthChanged = this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;
      if (widthChanged || this.hasFrozenColumns() || this.hasFrozenRows)
        if (Utils.width(this._canvasTopL, this.canvasWidthL), this.getHeadersWidth(), Utils.width(this._headerL, this.headersWidthL), Utils.width(this._headerR, this.headersWidthR), this.hasFrozenColumns()) {
          let cWidth = Utils.width(this._container) || 0;
          if (cWidth > 0 && this.canvasWidthL > cWidth && this._options.throwWhenFrozenNotAllViewable)
            throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
          Utils.width(this._canvasTopR, this.canvasWidthR), Utils.width(this._paneHeaderL, this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "left", this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "width", this.viewportW - this.canvasWidthL), Utils.width(this._paneTopL, this.canvasWidthL), Utils.setStyleSize(this._paneTopR, "left", this.canvasWidthL), Utils.width(this._paneTopR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowScrollerL, this.canvasWidthL), Utils.width(this._headerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowL, this.canvasWidthL), Utils.width(this._headerRowR, this.canvasWidthR), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, this.canvasWidthL), Utils.width(this._footerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._footerRowL, this.canvasWidthL), Utils.width(this._footerRowR, this.canvasWidthR)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, (_b = this._options.preHeaderPanelWidth) != null ? _b : this.canvasWidth), Utils.width(this._viewportTopL, this.canvasWidthL), Utils.width(this._viewportTopR, this.viewportW - this.canvasWidthL), this.hasFrozenRows && (Utils.width(this._paneBottomL, this.canvasWidthL), Utils.setStyleSize(this._paneBottomR, "left", this.canvasWidthL), Utils.width(this._viewportBottomL, this.canvasWidthL), Utils.width(this._viewportBottomR, this.viewportW - this.canvasWidthL), Utils.width(this._canvasBottomL, this.canvasWidthL), Utils.width(this._canvasBottomR, this.canvasWidthR));
        } else
          Utils.width(this._paneHeaderL, "100%"), Utils.width(this._paneTopL, "100%"), Utils.width(this._headerRowScrollerL, "100%"), Utils.width(this._headerRowL, this.canvasWidth), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, "100%"), Utils.width(this._footerRowL, this.canvasWidth)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, (_c = this._options.preHeaderPanelWidth) != null ? _c : this.canvasWidth), Utils.width(this._viewportTopL, "100%"), this.hasFrozenRows && (Utils.width(this._viewportBottomL, "100%"), Utils.width(this._canvasBottomL, this.canvasWidthL));
      this.viewportHasHScroll = this.canvasWidth >= this.viewportW - ((_e = (_d = this.scrollbarDimensions) == null ? void 0 : _d.width) != null ? _e : 0), Utils.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_g = (_f = this.scrollbarDimensions) == null ? void 0 : _f.width) != null ? _g : 0)), Utils.width(this._headerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_i = (_h = this.scrollbarDimensions) == null ? void 0 : _h.width) != null ? _i : 0)), this._options.createFooterRow && (Utils.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_k = (_j = this.scrollbarDimensions) == null ? void 0 : _j.width) != null ? _k : 0)), Utils.width(this._footerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_m = (_l = this.scrollbarDimensions) == null ? void 0 : _l.width) != null ? _m : 0))), (widthChanged || forceColumnWidthsUpdate) && this.applyColumnWidths();
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
    /** Get the Top-Header Panel DOM node element */
    getTopHeaderPanel() {
      return this._topHeaderPanel;
    }
    /**
     * Based on whether frozen columns (and/or rows) are enabled, shows or hides the right–side header
     * and top panes as well as the bottom panes. If no frozen columns exist, hides right–side panes;
     * otherwise, conditionally shows or hides the bottom panes depending on whether frozen rows exist.
     */
    setPaneVisibility() {
      this.hasFrozenColumns() ? (Utils.show(this._paneHeaderR), Utils.show(this._paneTopR), this.hasFrozenRows ? (Utils.show(this._paneBottomL), Utils.show(this._paneBottomR)) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL))) : (Utils.hide(this._paneHeaderR), Utils.hide(this._paneTopR), Utils.hide(this._paneBottomR), this.hasFrozenRows ? Utils.show(this._paneBottomL) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL)));
    }
    /**
     * Sets the CSS overflowX and overflowY styles for all four viewport elements
     * (top–left, top–right, bottom–left, bottom–right) based on the grid’s frozen columns/rows status
     * and options such as alwaysAllowHorizontalScroll and alwaysShowVerticalScroll.
     * If a viewportClass is specified in options, the class is added to each viewport.
     */
    setOverflow() {
      if (this._viewportTopL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportTopR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? this.hasFrozenRows ? "scroll" : "auto" : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "auto") : (this.hasFrozenRows, "auto"), this._options.viewportClass) {
        let viewportClassList = Utils.classNameToList(this._options.viewportClass);
        this._viewportTopL.classList.add(...viewportClassList), this._viewportTopR.classList.add(...viewportClassList), this._viewportBottomL.classList.add(...viewportClassList), this._viewportBottomR.classList.add(...viewportClassList);
      }
    }
    /**
     * Creates a <style> element (using a provided nonce if available) and appends it to the shadowRoot (or document head).
     * Inserts rules that set heights for panels, header rows, footer rows, and cells based on grid options.
     * It also loops through each column (if not hidden) to add empty rules for left and right column classes.
     * If the stylesheet cannot be accessed via the modern API, it falls back to createCssRulesAlternative.
     */
    createCssRules() {
      this._style = document.createElement("style"), this._style.nonce = this._options.nonce || "", (this._options.shadowRoot || document.head).appendChild(this._style);
      let rowHeight = this._options.rowHeight - this.cellHeightDiff, rules = [
        `.${this.uid} .slick-group-header-column { left: 1000px; }`,
        `.${this.uid} .slick-header-column { left: 1000px; }`,
        `.${this.uid} .slick-top-panel { height: ${this._options.topPanelHeight}px; }`,
        `.${this.uid} .slick-preheader-panel { height: ${this._options.preHeaderPanelHeight}px; }`,
        `.${this.uid} .slick-topheader-panel { height: ${this._options.topHeaderPanelHeight}px; }`,
        `.${this.uid} .slick-headerrow-columns { height: ${this._options.headerRowHeight}px; }`,
        `.${this.uid} .slick-footerrow-columns { height: ${this._options.footerRowHeight}px; }`,
        `.${this.uid} .slick-cell { height: ${rowHeight}px; }`,
        `.${this.uid} .slick-row { height: ${this._options.rowHeight}px; }`
      ], sheet = this._style.sheet;
      if (sheet) {
        rules.forEach((rule) => {
          sheet.insertRule(rule);
        });
        for (let i = 0; i < this.columns.length; i++)
          !this.columns[i] || this.columns[i].hidden || (sheet.insertRule(`.${this.uid} .l${i} { }`), sheet.insertRule(`.${this.uid} .r${i} { }`));
      } else
        this.createCssRulesAlternative(rules);
    }
    /** Create CSS rules via template in case the first approach with createElement('style') doesn't work.
     *
     * In cases where the standard method of inserting CSS rules fails (as may occur in some environments),
     * this function creates a <style> element using a template, appends it to the document, and then adds
     * the provided CSS rules as a concatenated text node.
     * Also appends rules for each visible column for left and right classes.
     */
    createCssRulesAlternative(rules) {
      let template = document.createElement("template");
      template.innerHTML = '<style type="text/css" rel="stylesheet" />', this._style = template.content.firstChild, (this._options.shadowRoot || document.head).appendChild(this._style);
      for (let i = 0; i < this.columns.length; i++)
        !this.columns[i] || this.columns[i].hidden || (rules.push(`.${this.uid} .l${i} { }`), rules.push(`.${this.uid} .r${i} { }`));
      this._style.styleSheet ? this._style.styleSheet.cssText = rules.join(" ") : this._style.appendChild(document.createTextNode(rules.join(" ")));
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
    getColumnCssRules(idx) {
      var _a;
      let i;
      if (!this.stylesheet) {
        let sheets = (this._options.shadowRoot || document).styleSheets;
        for (this._options.devMode && typeof ((_a = this._options.devMode) == null ? void 0 : _a.ownerNodeIndex) == "number" && this._options.devMode.ownerNodeIndex >= 0 && (sheets[this._options.devMode.ownerNodeIndex].ownerNode = this._style), i = 0; i < sheets.length; i++)
          if ((sheets[i].ownerNode || sheets[i].owningElement) === this._style) {
            this.stylesheet = sheets[i];
            break;
          }
        if (!this.stylesheet)
          throw new Error("SlickGrid Cannot find stylesheet.");
        this.columnCssRulesL = [], this.columnCssRulesR = [];
        let cssRules = this.stylesheet.cssRules || this.stylesheet.rules, matches, columnIdx;
        for (i = 0; i < cssRules.length; i++) {
          let selector = cssRules[i].selectorText;
          (matches = /\.l\d+/.exec(selector)) ? (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesL[columnIdx] = cssRules[i]) : (matches = /\.r\d+/.exec(selector)) && (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesR[columnIdx] = cssRules[i]);
        }
      }
      return {
        left: this.columnCssRulesL[idx],
        right: this.columnCssRulesR[idx]
      };
    }
    /**
     * Removes the dynamically created <style> element (if it exists) from the DOM and
     * clears the cached stylesheet reference.
     */
    removeCssRules() {
      var _a;
      (_a = this._style) == null || _a.remove(), this.stylesheet = null;
    }
    /** Get Top Panel DOM element */
    getTopPanel() {
      return this._topPanels[0];
    }
    /** Get Top Panels (left/right) DOM element */
    getTopPanels() {
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
    togglePanelVisibility(option, container, visible, animate) {
      let animated = animate !== !1;
      if (this._options[option] !== visible)
        if (this._options[option] = visible, visible) {
          if (animated) {
            Utils.slideDown(container, this.resizeCanvas.bind(this));
            return;
          }
          Utils.show(container), this.resizeCanvas();
        } else {
          if (animated) {
            Utils.slideUp(container, this.resizeCanvas.bind(this));
            return;
          }
          Utils.hide(container), this.resizeCanvas();
        }
    }
    /**
     * Set the Top Panel Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if top panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setTopPanelVisibility(visible, animate) {
      this.togglePanelVisibility("showTopPanel", this._topPanelScrollers, visible, animate);
    }
    /**
     * Set the Header Row Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if header row panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setHeaderRowVisibility(visible, animate) {
      this.togglePanelVisibility("showHeaderRow", this._headerRowScroller, visible, animate);
    }
    /**
     * Set the Column Header Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if column header is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setColumnHeaderVisibility(visible, animate) {
      this.togglePanelVisibility("showColumnHeader", this._headerScroller, visible, animate);
    }
    /**
     * Set the Footer Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if footer row panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setFooterRowVisibility(visible, animate) {
      this.togglePanelVisibility("showFooterRow", this._footerRowScroller, visible, animate);
    }
    /**
     * Set the Pre-Header Visibility and optionally enable/disable animation (enabled by default)
     * @param {Boolean} [visible] - optionally set if pre-header panel is visible or not
     * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
     */
    setPreHeaderPanelVisibility(visible, animate) {
      this.togglePanelVisibility("showPreHeaderPanel", [this._preHeaderPanelScroller, this._preHeaderPanelScrollerR], visible, animate);
    }
    /**
     * Set the Top-Header Visibility
     * @param {Boolean} [visible] - optionally set if top-header panel is visible or not
     */
    setTopHeaderPanelVisibility(visible) {
      this.togglePanelVisibility("showTopHeaderPanel", this._topHeaderPanelScroller, visible);
    }
    /**
     * Retrieves the height of a row.
     *
     * @returns {number} The row height defined in the grid options.
     */
    getRowHeight() {
      return this._options.rowHeight;
    }
    /**
     * Returns the top pixel position for a given row, based on the row height and current vertical offset.
     *
     * @param {number} row - The row index.
     * @returns {number} The pixel position of the top of the row.
     */
    getRowTop(row) {
      return Math.round(this._options.rowHeight * row - this.offset);
    }
    /**
     * Returns the bottom pixel position for a given row, based on the row height and current vertical offset.
     *
     * @param {number} row - The row index.
     * @returns {number} The pixel position of the bottom of the row.
     */
    getRowBottom(row) {
      return this.getRowTop(row) + this._options.rowHeight;
    }
    /**
     * Computes the row index corresponding to a given vertical pixel position (taking the current offset into account).
     *
     * @param {number} y - The vertical position in pixels.
     * @returns {number} The calculated row index.
     */
    getRowFromPosition(y) {
      return Math.floor((y + this.offset) / this._options.rowHeight);
    }
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
    appendRowHtml(divArrayL, divArrayR, row, range, dataLength) {
      let d = this.getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (this.hasFrozenRows && row <= this._options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === this.activeRow && this._options.showCellSelection ? " active" : "") + (row % 2 === 1 ? " odd" : " even");
      d || (rowCss += ` ${this._options.addNewRowCssClass}`);
      let metadata = this.getItemMetadaWhenExists(row);
      metadata != null && metadata.cssClasses && (rowCss += ` ${metadata.cssClasses}`);
      let rowDiv = Utils.createDomElement("div", {
        className: `ui-widget-content ${rowCss}`,
        role: "row",
        dataset: { row: `${row}` }
      }), frozenRowOffset = this.getFrozenRowOffset(row), topOffset = this.getRowTop(row) - frozenRowOffset;
      this._options.rowTopOffsetRenderType === "transform" ? rowDiv.style.transform = `translateY(${topOffset}px)` : rowDiv.style.top = `${topOffset}px`;
      let rowDivR;
      divArrayL.push(rowDiv), this.hasFrozenColumns() && (rowDivR = rowDiv.cloneNode(!0), divArrayR.push(rowDivR));
      let columnCount = this.columns.length, columnData, colspan, rowspan, m, isRenderCell = !0;
      for (let i = 0, ii = columnCount; i < ii; i++) {
        if (isRenderCell = !0, m = this.columns[i], !m || m.hidden)
          continue;
        colspan = 1, rowspan = 1, columnData = null, metadata != null && metadata.columns && (columnData = metadata.columns[m.id] || metadata.columns[i], colspan = (columnData == null ? void 0 : columnData.colspan) || 1, rowspan = (columnData == null ? void 0 : columnData.rowspan) || 1, colspan === "*" && (colspan = ii - i), rowspan > dataLength - row && (rowspan = dataLength - row)), !this._options.enableCellRowSpan && rowspan > 1 && console.warn('[SlickGrid] Cell "rowspan" is an opt-in grid option because of its small perf hit, you must enable it via the "enableCellRowSpan" grid option.');
        let ncolspan = colspan;
        if (!this.getParentRowSpanByCell(row, i)) {
          if (this.columnPosRight[Math.min(ii - 1, i + ncolspan - 1)] > range.leftPx) {
            if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx && (isRenderCell = !1), isRenderCell) {
              let targetedRowDiv = this.hasFrozenColumns() && i > this._options.frozenColumn ? rowDivR : rowDiv;
              this.appendCellHtml(targetedRowDiv, row, i, ncolspan, rowspan, columnData, d);
            }
          } else (m.alwaysRenderColumn || this.hasFrozenColumns() && i <= this._options.frozenColumn) && this.appendCellHtml(rowDiv, row, i, ncolspan, rowspan, columnData, d);
          ncolspan > 1 && (i += ncolspan - 1);
        }
      }
    }
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
    appendCellHtml(divRow, row, cell, colspan, rowspan, columnMetadata, item) {
      let m = this.columns[cell], cellCss = `slick-cell l${cell} r${Math.min(this.columns.length - 1, cell + colspan - 1)}` + (m.cssClass ? ` ${m.cssClass}` : "") + (rowspan > 1 ? " rowspan" : "") + (columnMetadata != null && columnMetadata.cssClass ? ` ${columnMetadata.cssClass}` : "");
      this.hasFrozenColumns() && cell <= this._options.frozenColumn && (cellCss += " frozen"), row === this.activeRow && cell === this.activeCell && this._options.showCellSelection && (cellCss += " active"), Object.keys(this.cellCssClasses).forEach((key) => {
        var _a;
        (_a = this.cellCssClasses[key][row]) != null && _a[m.id] && (cellCss += ` ${this.cellCssClasses[key][row][m.id]}`);
      });
      let value = null, formatterResult = "";
      item && (value = this.getDataItemValueForColumn(item, m), formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this), formatterResult == null && (formatterResult = ""));
      let appendCellResult = this.trigger(this.onBeforeAppendCell, { row, cell, value, dataContext: item }).getReturnValue(), addlCssClasses = typeof appendCellResult == "string" ? appendCellResult : "";
      formatterResult != null && formatterResult.addClasses && (addlCssClasses += Utils.classNameToList((addlCssClasses ? " " : "") + formatterResult.addClasses).join(" "));
      let toolTipText = formatterResult != null && formatterResult.toolTip ? `${formatterResult.toolTip}` : "", cellDiv = Utils.createDomElement("div", {
        className: Utils.classNameToList(`${cellCss} ${addlCssClasses || ""}`).join(" "),
        role: "gridcell",
        tabIndex: -1
      });
      cellDiv.setAttribute("aria-describedby", this.uid + m.id), toolTipText && cellDiv.setAttribute("title", toolTipText);
      let cellHeight = this.getCellHeight(row, rowspan);
      if (rowspan > 1 && cellHeight !== this._options.rowHeight - this.cellHeightDiff && (cellDiv.style.height = `${cellHeight || 0}px`), m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object && Object.keys(m.cellAttrs).forEach((key) => {
        m.cellAttrs.hasOwnProperty(key) && cellDiv.setAttribute(key, m.cellAttrs[key]);
      }), item) {
        let cellResult = Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.html || formatterResult.text;
        this.applyHtmlCode(cellDiv, cellResult);
      }
      divRow.appendChild(cellDiv), formatterResult.insertElementAfterTarget && Utils.insertAfterElement(cellDiv, formatterResult.insertElementAfterTarget), this.rowsCache[row].cellRenderQueue.push(cell), this.rowsCache[row].cellColSpans[cell] = colspan;
    }
    /**
     * Iterates over keys in the rowsCache and, for each row that is not the active row and falls
     * outside the provided visible range (and is not a frozen row), calls removeRowFromCache to remove
     * its DOM elements. If asynchronous post–render cleanup is enabled, it triggers that process afterward.
     *
     * @param {{ bottom: number; top: number; }} rangeToKeep - The range of rows to keep.
     */
    cleanupRows(rangeToKeep) {
      let mandatoryRows = /* @__PURE__ */ new Set();
      if (this._options.enableCellRowSpan)
        for (let i = rangeToKeep.top, ln = rangeToKeep.bottom; i <= ln; i++) {
          let parentRowSpan = this.getRowSpanIntersect(i);
          parentRowSpan !== null && mandatoryRows.add(parentRowSpan);
        }
      Object.keys(this.rowsCache).forEach((rowId) => {
        if (this.rowsCache) {
          let i = +rowId, removeFrozenRow = !0;
          this.hasFrozenRows && (this._options.frozenBottom && i >= this.actualFrozenRow || !this._options.frozenBottom && i <= this.actualFrozenRow) && (removeFrozenRow = !1), (i = parseInt(rowId, 10)) !== this.activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom) && removeFrozenRow && !mandatoryRows.has(i) && this.removeRowFromCache(i);
        }
      }), this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
    }
    /** Invalidate all grid rows and re-render the visible grid rows */
    invalidate() {
      this.updateRowCount(), this.invalidateAllRows(), this.render();
    }
    /** Invalidate all grid rows */
    invalidateAllRows() {
      this.currentEditor && this.makeActiveCellNormal(), typeof this.rowsCache == "object" && Object.keys(this.rowsCache).forEach((row) => {
        this.rowsCache && this.removeRowFromCache(+row);
      }), this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
    }
    /**
     * Invalidate a specific set of row numbers
     * @param {Number[]} rows
     */
    invalidateRows(rows) {
      if (!rows || !rows.length)
        return;
      let row;
      this.vScrollDir = 0;
      let rl = rows.length, invalidatedRows = /* @__PURE__ */ new Set(), requiredRemapRows = /* @__PURE__ */ new Set(), isRowSpanFullRemap = rows.length > this._options.maxPartialRowSpanRemap || rows.length === this.getDataLength() || this._prevInvalidatedRowsCount + rows.length === this.getDataLength();
      for (let i = 0; i < rl; i++)
        if (row = rows[i], this.currentEditor && this.activeRow === row && this.makeActiveCellNormal(), this.rowsCache[row] && this.removeRowFromCache(row), this._options.enableCellRowSpan && !isRowSpanFullRemap) {
          invalidatedRows.add(row);
          let parentRowSpan = this.getRowSpanIntersect(row);
          parentRowSpan !== null && invalidatedRows.add(parentRowSpan);
        }
      if (this._options.enableCellRowSpan && !isRowSpanFullRemap) {
        for (let ir of Array.from(invalidatedRows)) {
          let colIdxs = this.getRowSpanColumnIntersects(ir);
          for (let cidx of colIdxs) {
            let prs = this.getParentRowSpanByCell(ir, cidx);
            prs && this._colsWithRowSpanCache[cidx] && (this._colsWithRowSpanCache[cidx].delete(prs.range), requiredRemapRows.add(prs.range.split(":").map(Number)[0]));
          }
        }
        for (let row2 of Array.from(requiredRemapRows))
          this.remapRowSpanMetadataByRow(row2);
      }
      this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup(), this._prevInvalidatedRowsCount = rows.length;
    }
    /**
     * Invalidate a specific row number
     * @param {Number} row
     */
    invalidateRow(row) {
      if (row >= 0) {
        let rows = [row];
        if (this._options.enableCellRowSpan) {
          let intersectedRow = this.getRowSpanIntersect(row);
          intersectedRow !== null && rows.push(intersectedRow);
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
    removeRowFromCache(row) {
      var _a;
      let cacheEntry = this.rowsCache[row];
      cacheEntry != null && cacheEntry.rowNode && (this.trigger(this.onBeforeRemoveCachedRow, { row }), this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row] ? this.queuePostProcessedRowForCleanup(cacheEntry, this.postProcessedRows[row], row) : (_a = cacheEntry.rowNode) == null || _a.forEach((node) => {
        var _a2;
        return (_a2 = node.parentElement) == null ? void 0 : _a2.removeChild(node);
      }), delete this.rowsCache[row], delete this.postProcessedRows[row], this.renderedRows--, this.counter_rows_removed++);
    }
    /**
     * Update a specific cell by its row and column index
     * @param {Number} row - grid row number
     * @param {Number} cell - grid cell column number
     */
    updateCell(row, cell) {
      let cellNode = this.getCellNode(row, cell);
      if (!cellNode)
        return;
      let m = this.columns[cell], d = this.getDataItem(row);
      if (this.currentEditor && this.activeRow === row && this.activeCell === cell)
        this.currentEditor.loadValue(d);
      else {
        let formatterResult = d ? this.getFormatter(row, m)(row, cell, this.getDataItemValueForColumn(d, m), m, d, this) : "";
        this.applyFormatResultToCellNode(formatterResult, cellNode), this.invalidatePostProcessingResults(row);
      }
    }
    /**
     * Update a specific row by its row index
     * @param {Number} row - grid row number
     */
    updateRow(row) {
      let cacheEntry = this.rowsCache[row];
      if (!cacheEntry)
        return;
      this.ensureCellNodesInRowsCache(row);
      let formatterResult, d = this.getDataItem(row);
      Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((colIdx) => {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx))
          return;
        let columnIdx = +colIdx, m = this.columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
        row === this.activeRow && columnIdx === this.activeCell && this.currentEditor ? this.currentEditor.loadValue(d) : d ? (formatterResult = this.getFormatter(row, m)(row, columnIdx, this.getDataItemValueForColumn(d, m), m, d, this), this.applyFormatResultToCellNode(formatterResult, node)) : Utils.emptyElement(node);
      }), this.invalidatePostProcessingResults(row);
    }
    /**
     * Get the number of rows displayed in the viewport
     * Note that the row count is an approximation because it is a calculated value using this formula (viewport / rowHeight = rowCount),
     * the viewport must also be displayed for this calculation to work.
     * @return {Number} rowCount
     */
    getViewportRowCount() {
      var _a, _b;
      let vh = this.getViewportHeight(), scrollbarHeight = (_b = (_a = this.getScrollbarDimensions()) == null ? void 0 : _a.height) != null ? _b : 0;
      return Math.floor((vh - scrollbarHeight) / this._options.rowHeight);
    }
    /**
     * Calculates the vertical height available for displaying grid rows. In auto–height mode it sums panel heights
     * (header, footer, top panel) plus the total row height; otherwise, it subtracts header, footer, pre–header,
     * top–header heights and container paddings from the container’s computed height. It also computes and stores
     * the number of visible rows.
     */
    getViewportHeight() {
      var _a, _b;
      if ((!this._options.autoHeight || this._options.frozenColumn !== -1) && (this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight + this.getVBoxDelta(this._topPanelScrollers[0]) : 0, this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, this.footerRowH = this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0), this._options.autoHeight) {
        let fullHeight = this._paneHeaderL.offsetHeight;
        fullHeight += this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight + this.getVBoxDelta(this._preHeaderPanelScroller) : 0, fullHeight += this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, fullHeight += this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0, fullHeight += this.getCanvasWidth() > this.viewportW && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0, this.viewportH = this._options.rowHeight * this.getDataLengthIncludingAddNew() + (this._options.frozenColumn === -1 ? fullHeight : 0);
      } else {
        let style = getComputedStyle(this._container), containerBoxH = style.boxSizing !== "content-box" ? this.getVBoxDelta(this._container) : 0, topHeaderH = this._options.createTopHeaderPanel && this._options.showTopHeaderPanel ? this._options.topHeaderPanelHeight + this.getVBoxDelta(this._topHeaderPanelScroller) : 0, preHeaderH = this._options.createPreHeaderPanel && this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight + this.getVBoxDelta(this._preHeaderPanelScroller) : 0, columnNamesH = this._options.showColumnHeader ? Utils.toFloat(Utils.height(this._headerScroller[0])) : 0;
        this.viewportH = Utils.toFloat(style.height) - Utils.toFloat(style.paddingTop) - Utils.toFloat(style.paddingBottom) - this.topPanelH - topHeaderH - preHeaderH - this.headerRowH - columnNamesH - this.footerRowH - containerBoxH;
      }
      return this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight), this.viewportH;
    }
    /** returns the available viewport inner width, that is the viewport width minus the scrollbar when shown */
    getViewportInnerWidth() {
      var _a;
      return this.viewportHasVScroll ? this.viewportW - (((_a = this.scrollbarDimensions) == null ? void 0 : _a.width) || 0) : this.viewportW;
    }
    /**
     * Returns the width of the grid’s viewport by measuring the inner width of the grid container (using a utility function).
     * It falls back to a devMode–specified width if necessary.
     */
    getViewportWidth() {
      return this.viewportW = parseFloat(Utils.innerSize(this._container, "width")) || this._options.devMode && this._options.devMode.containerClientWidth || 0, this.viewportW;
    }
    /** Execute a Resize of the Grid Canvas.
     *
     * Recalculates the grid’s canvas, pane, and viewport dimensions based on the current container size,
     * frozen rows/columns settings, and auto–height configuration. It then applies these dimensions to various DOM elements
     * (panes, viewports, canvases) and updates the scrollbar dimensions.
     * Finally, it updates the row count, handles scrolling, and forces a re–render.
     */
    resizeCanvas() {
      var _a, _b, _c, _d, _e, _f;
      if (!this.initialized)
        return;
      if (this.paneTopH = 0, this.paneBottomH = 0, this.viewportTopH = 0, this.viewportBottomH = 0, this.getViewportWidth(), this.getViewportHeight(), this.hasFrozenRows ? this._options.frozenBottom ? (this.paneTopH = this.viewportH - this.frozenRowsHeight - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0), this.paneBottomH = this.frozenRowsHeight + ((_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.height) != null ? _d : 0)) : (this.paneTopH = this.frozenRowsHeight, this.paneBottomH = this.viewportH - this.frozenRowsHeight) : this.paneTopH = this.viewportH, this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH, this.hasFrozenColumns() && this._options.autoHeight && (this.paneTopH += (_f = (_e = this.scrollbarDimensions) == null ? void 0 : _e.height) != null ? _f : 0), this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH, this._options.autoHeight) {
        if (this.hasFrozenColumns()) {
          let fullHeight = this.paneTopH + this._headerScrollerL.offsetHeight;
          fullHeight += this.getVBoxDelta(this._container), this._options.showPreHeaderPanel && (fullHeight += this._options.preHeaderPanelHeight), Utils.height(this._container, fullHeight);
        }
        this._paneTopL.style.position = "relative";
      }
      let topHeightOffset = Utils.height(this._paneHeaderL);
      topHeightOffset ? topHeightOffset += this._options.showTopHeaderPanel ? this._options.topHeaderPanelHeight : 0 : topHeightOffset = (this._options.showHeaderRow ? this._options.headerRowHeight : 0) + (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight : 0), Utils.setStyleSize(this._paneTopL, "top", topHeightOffset || topHeightOffset), Utils.height(this._paneTopL, this.paneTopH);
      let paneBottomTop = this._paneTopL.offsetTop + this.paneTopH;
      if (this._options.autoHeight || Utils.height(this._viewportTopL, this.viewportTopH), this.hasFrozenColumns()) {
        let topHeightOffset2 = Utils.height(this._paneHeaderL);
        topHeightOffset2 && (topHeightOffset2 += this._options.showTopHeaderPanel ? this._options.topHeaderPanelHeight : 0), Utils.setStyleSize(this._paneTopR, "top", topHeightOffset2), Utils.height(this._paneTopR, this.paneTopH), Utils.height(this._viewportTopR, this.viewportTopH), this.hasFrozenRows && (Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomR, "top", paneBottomTop), Utils.height(this._paneBottomR, this.paneBottomH), Utils.height(this._viewportBottomR, this.paneBottomH));
      } else
        this.hasFrozenRows && (Utils.width(this._paneBottomL, "100%"), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop));
      this.hasFrozenRows ? (Utils.height(this._viewportBottomL, this.paneBottomH), this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.frozenRowsHeight)) : (Utils.height(this._canvasTopL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasTopR, this.frozenRowsHeight))) : Utils.height(this._viewportTopR, this.viewportTopH), (!this.scrollbarDimensions || !this.scrollbarDimensions.width) && (this.scrollbarDimensions = this.measureScrollbar()), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && this.autosizeColumns(), this.updateRowCount(), this.handleScroll(), this.lastRenderedScrollLeft = -1, this.render();
    }
    /** Update the dataset row count */
    updateRowCount() {
      var _a, _b, _c, _d;
      if (!this.initialized)
        return;
      let dataLength = this.getDataLength();
      dataLength > 0 && dataLength !== this._prevDataLength && (this._rowSpanIsCached = !1), this._options.enableCellRowSpan && !this._rowSpanIsCached && this.remapAllColumnsRowSpan(), this._prevDataLength = dataLength;
      let dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = this.hasFrozenRows && !this._options.frozenBottom ? Utils.height(this._canvasBottomL) : Utils.height(this._canvasTopL);
      this.hasFrozenRows ? numberOfRows = this.getDataLength() - this._options.frozenRow : numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);
      let tempViewportH = Utils.height(this._viewportScrollContainerY), oldViewportHasVScroll = this.viewportHasVScroll;
      this.viewportHasVScroll = this._options.alwaysShowVerticalScroll || !this._options.autoHeight && numberOfRows * this._options.rowHeight > tempViewportH, this.makeActiveCellNormal();
      let r1 = dataLength - 1;
      typeof this.rowsCache == "object" && Object.keys(this.rowsCache).forEach((row) => {
        let cachedRow = +row;
        cachedRow > r1 && this.removeRowFromCache(cachedRow);
      }), this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup(), this.activeCellNode && this.activeRow > r1 && this.resetActiveCell(), oldH = this.h, this._options.autoHeight ? this.h = this._options.rowHeight * numberOfRows : (this.th = Math.max(this._options.rowHeight * numberOfRows, tempViewportH - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0)), this.th < this.maxSupportedCssHeight ? (this.h = this.ph = this.th, this.n = 1, this.cj = 0) : (this.h = this.maxSupportedCssHeight, this.ph = this.h / 100, this.n = Math.floor(this.th / this.ph), this.cj = (this.th - this.h) / (this.n - 1))), (this.h !== oldH || this.enforceFrozenRowHeightRecalc) && (this.hasFrozenRows && !this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.h), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.h)) : (Utils.height(this._canvasTopL, this.h), Utils.height(this._canvasTopR, this.h)), this.scrollTop = this._viewportScrollContainerY.scrollTop, this.scrollHeight = this._viewportScrollContainerY.scrollHeight, this.enforceFrozenRowHeightRecalc = !1);
      let oldScrollTopInRange = this.scrollTop + this.offset <= this.th - tempViewportH;
      this.th === 0 || this.scrollTop === 0 ? this.page = this.offset = 0 : oldScrollTopInRange ? this.scrollTo(this.scrollTop + this.offset) : this.scrollTo(this.th - tempViewportH + ((_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.height) != null ? _d : 0)), this.h !== oldH && this._options.autoHeight && this.resizeCanvas(), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll !== this.viewportHasVScroll && this.autosizeColumns(), this.updateCanvasWidth(!1);
    }
    /** @alias `getVisibleRange` */
    getViewport(viewportTop, viewportLeft) {
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
    getVisibleRange(viewportTop, viewportLeft) {
      return viewportTop != null || (viewportTop = this.scrollTop), viewportLeft != null || (viewportLeft = this.scrollLeft), {
        top: this.getRowFromPosition(viewportTop),
        bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
        leftPx: viewportLeft,
        rightPx: viewportLeft + this.viewportW
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
    getRenderedRange(viewportTop, viewportLeft) {
      let range = this.getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(this.viewportH / this._options.rowHeight), minBuffer = this._options.minRowBuffer;
      return this.vScrollDir === -1 ? (range.top -= buffer, range.bottom += minBuffer) : this.vScrollDir === 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(this.getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= this.viewportW, range.rightPx += this.viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(this.canvasWidth, range.rightPx), range;
    }
    /**
     * Returns the rows cache that are currently rendered in the DOM,
     * the cache includes certain properties like the row div element, cell rendered queue and the row colspan when defined.
     */
    getRowCache() {
      return this.rowsCache;
    }
    /**
     * Ensures that the row’s cache entry contains all cell DOM nodes by transferring nodes
     * from the cellRenderQueue into the cellNodesByColumnIdx array. This is used to guarantee
     * that each cell is indexed properly for later updates.
     *
     * @param {number} row - The row index to ensure cell nodes exist for.
     */
    ensureCellNodesInRowsCache(row) {
      var _a;
      let cacheEntry = this.rowsCache[row];
      if (cacheEntry != null && cacheEntry.cellRenderQueue.length && ((_a = cacheEntry.rowNode) != null && _a.length)) {
        let rowNode = cacheEntry.rowNode, children = Array.from(rowNode[0].children);
        rowNode.length > 1 && (children = children.concat(Array.from(rowNode[1].children)));
        let i = children.length - 1;
        for (; cacheEntry.cellRenderQueue.length; ) {
          let columnIdx = cacheEntry.cellRenderQueue.pop();
          cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i--];
        }
      }
    }
    /**
     * For the specified row and a given horizontal visible range, iterates over the cached cell nodes and
     * removes those cells that fall completely outside the visible range (except for frozen or always–rendered cells).
     * Cells are either removed immediately or queued for asynchronous cleanup if enabled.
     * @param {CellViewportRange} range - The visible cell viewport range.
     * @param {number} row - The row index to clean up.
     */
    cleanUpCells(range, row) {
      var _a, _b;
      if (this.hasFrozenRows && (this._options.frozenBottom && row > this.actualFrozenRow || row <= this.actualFrozenRow))
        return;
      let totalCellsRemoved = 0, cacheEntry = this.rowsCache[row], cellsToRemove = [];
      Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((cellNodeIdx) => {
        var _a2;
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx))
          return;
        let i = +cellNodeIdx;
        if (i <= this._options.frozenColumn || Array.isArray(this.columns) && ((_a2 = this.columns[i]) != null && _a2.alwaysRenderColumn))
          return;
        let colspan = cacheEntry.cellColSpans[i];
        (this.columnPosLeft[i] > range.rightPx || this.columnPosRight[Math.min(this.columns.length - 1, (i || 0) + colspan - 1)] < range.leftPx) && (row === this.activeRow && Number(i) === this.activeCell || cellsToRemove.push(i));
      });
      let cellToRemove, cellNode;
      for (; Utils.isDefined(cellToRemove = cellsToRemove.pop()); )
        cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], this._options.enableAsyncPostRenderCleanup && ((_a = this.postProcessedRows[row]) != null && _a[cellToRemove]) ? this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : (_b = cellNode.parentElement) == null || _b.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], this.postProcessedRows[row] && delete this.postProcessedRows[row][cellToRemove], totalCellsRemoved++;
    }
    /**
     * Iterates over each row in the provided rendered range. For each row, ensures cell nodes exist,
     * calls cleanUpCells to remove outdated cells, and then renders any missing cells (by calling appendCellHtml)
     * for columns that are now within the viewport. Finally, processes the row’s cellRenderQueue to attach rendered
     * cells to the correct row containers (handling frozen columns), and reselects the active cell if needed.
     */
    cleanUpAndRenderCells(range) {
      var _a;
      let cacheEntry, divRow = document.createElement("div"), processedRows = [], cellsAdded, totalCellsAdded = 0, colspan, columnData, columnCount = this.columns.length;
      for (let row = range.top, btm = range.bottom; row <= btm; row++) {
        if (cacheEntry = this.rowsCache[row], !cacheEntry)
          continue;
        this.ensureCellNodesInRowsCache(row), (!this._options.enableCellRowSpan || this.getRowSpanIntersect(row) === null) && this.cleanUpCells(range, row), cellsAdded = 0;
        let metadata = this.getItemMetadaWhenExists(row);
        metadata = metadata == null ? void 0 : metadata.columns;
        let d = this.getDataItem(row);
        for (let i = 0, ii = columnCount; i < ii; i++) {
          if (!this.columns[i] || this.columns[i].hidden)
            continue;
          if (this.columnPosLeft[i] > range.rightPx)
            break;
          if (Utils.isDefined(colspan = cacheEntry.cellColSpans[i])) {
            i += colspan > 1 ? colspan - 1 : 0;
            continue;
          }
          colspan = 1, columnData = null, metadata && (columnData = metadata[this.columns[i].id] || metadata[i], colspan = (_a = columnData == null ? void 0 : columnData.colspan) != null ? _a : 1, colspan === "*" && (colspan = ii - i));
          let ncolspan = colspan;
          if (!this.getParentRowSpanByCell(row, i)) {
            if (this.columnPosRight[Math.min(ii - 1, i + ncolspan - 1)] > range.leftPx) {
              let rowspan = this.getRowspan(row, i);
              this.appendCellHtml(divRow, row, i, ncolspan, rowspan, columnData, d), cellsAdded++;
            }
            i += ncolspan > 1 ? ncolspan - 1 : 0;
          }
        }
        cellsAdded && (totalCellsAdded += cellsAdded, processedRows.push(row));
      }
      if (!divRow.children.length)
        return;
      let processedRow, node;
      for (; Utils.isDefined(processedRow = processedRows.pop()); ) {
        cacheEntry = this.rowsCache[processedRow];
        let columnIdx;
        for (; Utils.isDefined(columnIdx = cacheEntry.cellRenderQueue.pop()); )
          node = divRow.lastChild, node && (this.hasFrozenColumns() && columnIdx > this._options.frozenColumn ? cacheEntry.rowNode[1].appendChild(node) : cacheEntry.rowNode[0].appendChild(node), cacheEntry.cellNodesByColumnIdx[columnIdx] = node);
      }
    }
    /**
     * Iterates over the row indices in the given rendered range and, for each row not yet in the cache,
     * creates a new cache entry and calls appendRowHtml to build the row’s cell content. Once built,
     * the row is appended to the appropriate canvas element (top or bottom, left or right depending on frozen settings).
     * If the active cell is rendered, it reselects it.
     *
     * @param {{ top: number; bottom: number; leftPx: number; rightPx: number; }} range - The range of rows to render.
     */
    renderRows(range) {
      var _a, _b, _c, _d;
      let divArrayL = [], divArrayR = [], rows = [], needToReselectCell = !1, dataLength = this.getDataLength(), mustRenderRows = /* @__PURE__ */ new Set(), renderingRows = /* @__PURE__ */ new Set();
      for (let i = range.top, ii = range.bottom; i <= ii; i++)
        if (!(this.rowsCache[i] || this.hasFrozenRows && this._options.frozenBottom && i === this.getDataLength())) {
          if (this.renderedRows++, rows.push(i), renderingRows.add(i), this.rowsCache[i] = this.createEmptyCachingRow(), this._options.enableCellRowSpan) {
            let parentRowSpan = this.getRowSpanIntersect(i);
            parentRowSpan !== null && renderingRows.add(parentRowSpan);
          }
          this.appendRowHtml(divArrayL, divArrayR, i, range, dataLength), mustRenderRows.add(i), this.activeCellNode && this.activeRow === i && (needToReselectCell = !0), this.counter_rows_rendered++;
        }
      let mandatorySpanRows = this.setDifference(renderingRows, mustRenderRows);
      if (mandatorySpanRows.size > 0 && mandatorySpanRows.forEach((r) => {
        this.removeRowFromCache(r), rows.push(r), this.rowsCache[r] = this.createEmptyCachingRow(), this.appendRowHtml(divArrayL, divArrayR, r, range, dataLength);
      }), rows.length) {
        let x = document.createElement("div"), xRight = document.createElement("div");
        divArrayL.forEach((elm) => x.appendChild(elm)), divArrayR.forEach((elm) => xRight.appendChild(elm));
        for (let i = 0, ii = rows.length; i < ii; i++)
          this.hasFrozenRows && rows[i] >= this.actualFrozenRow ? this.hasFrozenColumns() ? (_a = this.rowsCache) != null && _a.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasBottomL.appendChild(x.firstChild), this._canvasBottomR.appendChild(xRight.firstChild)) : (_b = this.rowsCache) != null && _b.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasBottomL.appendChild(x.firstChild)) : this.hasFrozenColumns() ? (_c = this.rowsCache) != null && _c.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasTopL.appendChild(x.firstChild), this._canvasTopR.appendChild(xRight.firstChild)) : (_d = this.rowsCache) != null && _d.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasTopL.appendChild(x.firstChild));
        needToReselectCell && (this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell));
      }
    }
    /**
     * Iterates over each row in the rowsCache and updates the top position of the row’s DOM element
     * using the getRowTop calculation. Depending on the grid option, it either uses CSS transform
     * or sets the top property directly.
     */
    updateRowPositions() {
      for (let row in this.rowsCache)
        if (this.rowsCache) {
          let rowNumber = row ? parseInt(row, 10) : 0, rowNode = this.rowsCache[rowNumber].rowNode[0];
          this._options.rowTopOffsetRenderType === "transform" ? rowNode.style.transform = `translateY(${this.getRowTop(rowNumber)}px)` : rowNode.style.top = `${this.getRowTop(rowNumber)}px`;
        }
    }
    /**
     * (re)Render the grid
     *
     * Main rendering method that first dequeues any pending scroll throttling, then obtains the visible and rendered ranges.
     * It removes rows no longer visible, calls cleanUpAndRenderCells and renderRows to render missing cells and new rows,
     * and, if frozen rows are present, renders them separately. It then sets post–processing boundaries, starts post–processing,
     * updates scroll positions, and triggers the onRendered event.
     */
    render() {
      if (!this.initialized)
        return;
      this.scrollThrottle.dequeue();
      let visible = this.getVisibleRange(), rendered = this.getRenderedRange();
      if (this.cleanupRows(rendered), this.lastRenderedScrollLeft !== this.scrollLeft) {
        if (this.hasFrozenRows) {
          let renderedFrozenRows = Utils.extend(!0, {}, rendered);
          this._options.frozenBottom ? (renderedFrozenRows.top = this.actualFrozenRow, renderedFrozenRows.bottom = this.getDataLength()) : (renderedFrozenRows.top = 0, renderedFrozenRows.bottom = this._options.frozenRow), this.cleanUpAndRenderCells(renderedFrozenRows);
        }
        this.cleanUpAndRenderCells(rendered);
      }
      this.renderRows(rendered), this.hasFrozenRows && (this._options.frozenBottom ? this.renderRows({
        top: this.actualFrozenRow,
        bottom: this.getDataLength() - 1,
        leftPx: rendered.leftPx,
        rightPx: rendered.rightPx
      }) : this.renderRows({
        top: 0,
        bottom: this._options.frozenRow - 1,
        leftPx: rendered.leftPx,
        rightPx: rendered.rightPx
      })), this.postProcessFromRow = visible.top, this.postProcessToRow = Math.min(this.getDataLengthIncludingAddNew() - 1, visible.bottom), this.startPostProcessing(), this.lastRenderedScrollTop = this.scrollTop, this.lastRenderedScrollLeft = this.scrollLeft, this.trigger(this.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: this });
    }
    /**
     * Get frozen (pinned) row offset
     *
     * Returns the vertical pixel offset to apply for frozen rows.
     * Depending on whether frozen rows are pinned at the bottom or top and based on grid height,
     * it returns either a fixed frozen rows height or a calculated offset.
     *
     * @param {Number} row - grid row number
     */
    getFrozenRowOffset(row) {
      let offset = 0;
      return this.hasFrozenRows ? this._options.frozenBottom ? row >= this.actualFrozenRow ? this.h < this.viewportTopH ? offset = this.actualFrozenRow * this._options.rowHeight : offset = this.h : offset = 0 : row >= this.actualFrozenRow ? offset = this.frozenRowsHeight : offset = 0 : offset = 0, offset;
    }
    ////////////////////////////////////////////////////////
    // End Rendering and Layout Management
    //////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    // Scrolling and Virtualisation
    /////////////////////////////////////////////////////
    // TODO:  this is static.  need to handle page mutation.
    /**
     * Traverses up from a specific canvas element and binds a scroll event handler
     * (to update active cell positions) on each ancestor element that is scrollable.
     * Also stores these ancestors for later unbinding.
     */
    bindAncestorScrollEvents() {
      let elem = this.hasFrozenRows && !this._options.frozenBottom ? this._canvasBottomL : this._canvasTopL;
      for (; (elem = elem.parentNode) !== document.body && elem; )
        (elem === this._viewportTopL || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) && (this._boundAncestors.push(elem), this._bindingEventService.bind(elem, "scroll", this.handleActiveCellPositionChange.bind(this)));
    }
    /**
     * Iterates through the stored ancestor elements (in _boundAncestors)
     * and unbinds any scroll events previously attached, then clears the stored array.
     */
    unbindAncestorScrollEvents() {
      this._boundAncestors.forEach((ancestor) => {
        this._bindingEventService.unbindByEventName(ancestor, "scroll");
      }), this._boundAncestors = [];
    }
    /**
     * Chooses which viewport container(s) will serve as the scroll container for horizontal and vertical scrolling.
     * The selection depends on whether the grid has frozen columns and/or frozen rows and whether frozenBottom is set.
     */
    setScroller() {
      this.hasFrozenColumns() ? (this._headerScrollContainer = this._headerScrollerR, this._headerRowScrollContainer = this._headerRowScrollerR, this._footerRowScrollContainer = this._footerRowScrollerR, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomR, this._viewportScrollContainerY = this._viewportTopR) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomR : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopR) : (this._headerScrollContainer = this._headerScrollerL, this._headerRowScrollContainer = this._headerRowScrollerL, this._footerRowScrollContainer = this._footerRowScrollerL, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomL, this._viewportScrollContainerY = this._viewportTopL) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomL : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopL);
    }
    /**
     * Scroll to a Y position in the grid (clamped to valid bounds)
     *
     * Updates internal offsets, recalculates the visible range, cleans up rows outside the viewport,
     * updates row positions, and triggers the onViewportChanged event.
     *
     * @param {Number} y
     */
    scrollTo(y) {
      var _a, _b;
      y = Math.max(y, 0), y = Math.min(y, (this.th || 0) - Utils.height(this._viewportScrollContainerY) + ((this.viewportHasHScroll || this.hasFrozenColumns()) && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0));
      let oldOffset = this.offset;
      this.offset = Math.round(this.page * (this.cj || 0)), this.page = Math.min((this.n || 0) - 1, Math.floor(y / (this.ph || 0)));
      let newScrollTop = y - this.offset;
      if (this.offset !== oldOffset) {
        let range = this.getVisibleRange(newScrollTop);
        this.cleanupRows(range), this.updateRowPositions();
      }
      this.prevScrollTop !== newScrollTop && (this.vScrollDir = this.prevScrollTop + oldOffset < newScrollTop + this.offset ? 1 : -1, this.lastRenderedScrollTop = this.scrollTop = this.prevScrollTop = newScrollTop, this.hasFrozenColumns() && (this._viewportTopL.scrollTop = newScrollTop), this.hasFrozenRows && (this._viewportBottomL.scrollTop = this._viewportBottomR.scrollTop = newScrollTop), this._viewportScrollContainerY && (this._viewportScrollContainerY.scrollTop = newScrollTop), this.trigger(this.onViewportChanged, {}));
    }
    // When the header row scroller is scrolled, ensures that the viewport’s horizontal scroll position is updated to match it.
    handleHeaderRowScroll() {
      let scrollLeft = this._headerRowScrollContainer.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
    }
    // When the footer row scroller is scrolled, updates the viewport’s horizontal scroll position to match it.
    handleFooterRowScroll() {
      let scrollLeft = this._footerRowScrollContainer.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
    }
    /** Invokes handleElementScroll for the pre–header panel scroller to synchronize its
     * horizontal scroll position with the main viewport.
     */
    handlePreHeaderPanelScroll() {
      this.handleElementScroll(this._preHeaderPanelScroller);
    }
    /**
     * Invokes handleElementScroll for the top–header panel scroller to synchronize its horizontal
     * scroll position with the main viewport.
     */
    handleTopHeaderPanelScroll() {
      this.handleElementScroll(this._topHeaderPanelScroller);
    }
    /**
     * Given a DOM element, checks its scrollLeft value and, if it differs from the viewport scroll
     * container’s scrollLeft, updates the latter to match.
     *
     * @param {HTMLElement} element - The element whose scroll position needs to be synced.
     */
    handleElementScroll(element) {
      let scrollLeft = element.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
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
    handleScroll(e) {
      return this.scrollHeight = this._viewportScrollContainerY.scrollHeight, this.scrollTop = this._viewportScrollContainerY.scrollTop, this.scrollLeft = this._viewportScrollContainerX.scrollLeft, this._handleScroll(e ? "scroll" : "system");
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
    _handleScroll(eventType = "system") {
      let maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight, maxScrollDistanceX = this._viewportScrollContainerY.scrollWidth - this._viewportScrollContainerY.clientWidth;
      maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), this.scrollTop > maxScrollDistanceY && (this.scrollTop = maxScrollDistanceY, this.scrollHeight = maxScrollDistanceY), this.scrollLeft > maxScrollDistanceX && (this.scrollLeft = maxScrollDistanceX);
      let vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop), hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);
      if (hScrollDist && (this.prevScrollLeft = this.scrollLeft, this._viewportScrollContainerX.scrollLeft = this.scrollLeft, this._headerScrollContainer.scrollLeft = this.scrollLeft, this._topPanelScrollers[0].scrollLeft = this.scrollLeft, this._options.createFooterRow && (this._footerRowScrollContainer.scrollLeft = this.scrollLeft), this._options.createPreHeaderPanel && (this.hasFrozenColumns() ? this._preHeaderPanelScrollerR.scrollLeft = this.scrollLeft : this._preHeaderPanelScroller.scrollLeft = this.scrollLeft), this._options.createTopHeaderPanel && (this._topHeaderPanelScroller.scrollLeft = this.scrollLeft), this.hasFrozenColumns() ? (this.hasFrozenRows && (this._viewportTopR.scrollLeft = this.scrollLeft), this._headerRowScrollerR.scrollLeft = this.scrollLeft) : (this.hasFrozenRows && (this._viewportTopL.scrollLeft = this.scrollLeft), this._headerRowScrollerL.scrollLeft = this.scrollLeft)), vScrollDist && !this._options.autoHeight)
        if (this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1, this.prevScrollTop = this.scrollTop, eventType === "mousewheel" && (this._viewportScrollContainerY.scrollTop = this.scrollTop), this.hasFrozenColumns() && (this.hasFrozenRows && !this._options.frozenBottom ? this._viewportBottomL.scrollTop = this.scrollTop : this._viewportTopL.scrollTop = this.scrollTop), vScrollDist < this.viewportH)
          this.scrollTo(this.scrollTop + this.offset);
        else {
          let oldOffset = this.offset;
          this.h === this.viewportH ? this.page = 0 : this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.th - this.viewportH) / (this.h - this.viewportH)) * (1 / this.ph))), this.offset = Math.round(this.page * this.cj), oldOffset !== this.offset && this.invalidateAllRows();
        }
      if (hScrollDist || vScrollDist) {
        let dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft), dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
        (dx > 20 || dy > 20) && (this._options.forceSyncScrolling || dy < this.viewportH && dx < this.viewportW ? this.render() : this.scrollThrottle.enqueue(), this.trigger(this.onViewportChanged, {}));
      }
      return this.trigger(this.onScroll, {
        triggeredBy: eventType,
        scrollHeight: this.scrollHeight,
        scrollLeft: this.scrollLeft,
        scrollTop: this.scrollTop
      }), !!(hScrollDist || vScrollDist);
    }
    /** Scroll to a specific cell and make it into the view
     *
     * First calls scrollRowIntoView for the row. If the cell is not in a frozen column,
     * calculates the cell’s colspan and then calls internalScrollColumnIntoView with the
     * cell’s left and right boundaries.
     */
    scrollCellIntoView(row, cell, doPaging) {
      if (this.scrollRowIntoView(row, doPaging), cell <= this._options.frozenColumn)
        return;
      let colspan = this.getColspan(row, cell);
      this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
    }
    /**
     * Checks if the given left/right pixel boundaries are outside the current
     * horizontal scroll position of the viewport container.
     * If so, adjusts scrollLeft appropriately and triggers a re–render.
     *
     * @param left
     * @param right
     */
    internalScrollColumnIntoView(left, right) {
      var _a, _b;
      let scrollRight = this.scrollLeft + Utils.width(this._viewportScrollContainerX) - (this.viewportHasVScroll && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0);
      left < this.scrollLeft ? (this._viewportScrollContainerX.scrollLeft = left, this.handleScroll(), this.render()) : right > scrollRight && (this._viewportScrollContainerX.scrollLeft = Math.min(left, right - this._viewportScrollContainerX.clientWidth), this.handleScroll(), this.render());
    }
    /**
     * Scroll to a specific column and show it into the viewport
     * @param {Number} cell - cell column number
     */
    scrollColumnIntoView(cell) {
      this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell]);
    }
    /**
     * Update paging information status from the View
     * @param {PagingInfo} pagingInfo
     */
    updatePagingStatusFromView(pagingInfo) {
      this.pagingActive = pagingInfo.pageSize !== 0, this.pagingIsLastPage = pagingInfo.pageNum === pagingInfo.totalPages - 1;
    }
    /**
     * from a row number, return any column indexes that intersected with the grid row including the cell
     * @param {Number} row - grid row index
     */
    getRowSpanColumnIntersects(row) {
      return this.getRowSpanIntersection(row, "columns");
    }
    /**
     * from a row number, verify if the rowspan is intersecting and return it when found,
     * otherwise return `null` when nothing is found or when the rowspan feature is disabled.
     * @param {Number} row - grid row index
     */
    getRowSpanIntersect(row) {
      return this.getRowSpanIntersection(row);
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
    getRowSpanIntersection(row, outputType) {
      let columnIntersects = [], rowStartIntersect = null;
      for (let col = 0, cln = this.columns.length; col < cln; col++) {
        let rmeta = this._colsWithRowSpanCache[col];
        if (rmeta)
          for (let range of Array.from(rmeta)) {
            let [start, end] = range.split(":").map(Number);
            if (row >= start && row <= end)
              if (outputType === "columns")
                columnIntersects.push(col);
              else {
                rowStartIntersect = start;
                break;
              }
          }
      }
      return outputType === "columns" ? columnIntersects : rowStartIntersect;
    }
    /**
     * Returns the parent rowspan details when child cell are spanned from a rowspan or `null` when it's not spanned.
     * By default it will exclude the parent cell that holds the rowspan, and return `null`, that initiated the rowspan unless the 3rd argument is disabled.
     * The exclusion is helpful to find out when we're dealing with a child cell of a rowspan
     * @param {Number} row - grid row index
     * @param {Number} cell - grid cell/column index
     * @param {Boolean} [excludeParentRow] - should we exclude the parent who initiated the rowspan in the search (defaults to true)?
     */
    getParentRowSpanByCell(row, cell, excludeParentRow = !0) {
      let spanDetail = null, rowspanRange = this._colsWithRowSpanCache[cell] || /* @__PURE__ */ new Set();
      for (let range of Array.from(rowspanRange)) {
        let [start, end] = range.split(":").map(Number);
        if ((excludeParentRow ? row > start : row >= start) && row <= end) {
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
    remapAllColumnsRowSpan() {
      let ln = this.getDataLength();
      if (ln > 0) {
        this._colsWithRowSpanCache = {};
        for (let row = 0; row < ln; row++)
          this.remapRowSpanMetadataByRow(row);
        this._rowSpanIsCached = !0;
      }
    }
    /**
     * Remaps row span metadata for a given row by iterating through its column metadata.
     * Calls `remapRowSpanMetadata` for each column to update row span information.
     *
     * @param {number} row - The row index for which to remap row span metadata.
     */
    remapRowSpanMetadataByRow(row) {
      let colMeta = this.getItemMetadaWhenExists(row);
      colMeta != null && colMeta.columns && Object.keys(colMeta.columns).forEach((col) => {
        let colIdx = +col, columnMeta = colMeta.columns[colIdx], colspan = +((columnMeta == null ? void 0 : columnMeta.colspan) || 1), rowspan = +((columnMeta == null ? void 0 : columnMeta.rowspan) || 1);
        this.remapRowSpanMetadata(row, colIdx, colspan, rowspan);
      });
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
    remapRowSpanMetadata(row, cell, colspan, rowspan) {
      var _a, _b, _c, _d, _e;
      if (rowspan > 1) {
        let rspan = `${row}:${row + rowspan - 1}`;
        if ((_b = (_a = this._colsWithRowSpanCache)[cell]) != null || (_a[cell] = /* @__PURE__ */ new Set()), this._colsWithRowSpanCache[cell].add(rspan), colspan > 1)
          for (let i = 1; i < colspan; i++)
            (_e = (_c = this._colsWithRowSpanCache)[_d = cell + i]) != null || (_c[_d] = /* @__PURE__ */ new Set()), this._colsWithRowSpanCache[cell + i].add(rspan);
      }
    }
    /**
     * Creates an empty row caching object to store metadata about rendered row elements.
     * Used to optimize cell rendering and access within the grid.
     */
    createEmptyCachingRow() {
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
        cellRenderQueue: []
      };
    }
    /**
     * Scroll to a specific row and make it into the view
     * @param {Number} row - grid row number
     * @param {Boolean} doPaging - scroll when pagination is enabled
     */
    scrollRowIntoView(row, doPaging) {
      var _a, _b;
      if (!this.hasFrozenRows || !this._options.frozenBottom && row > this.actualFrozenRow - 1 || this._options.frozenBottom && row < this.actualFrozenRow - 1) {
        let viewportScrollH = Utils.height(this._viewportScrollContainerY), rowNumber = this.hasFrozenRows && !this._options.frozenBottom ? row - this._options.frozenRow : row, rowAtTop = rowNumber * this._options.rowHeight, rowAtBottom = (rowNumber + 1) * this._options.rowHeight - viewportScrollH + (this.viewportHasHScroll && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0);
        (rowNumber + 1) * this._options.rowHeight > this.scrollTop + viewportScrollH + this.offset ? (this.scrollTo(doPaging ? rowAtTop : rowAtBottom), this.render()) : rowNumber * this._options.rowHeight < this.scrollTop + this.offset && (this.scrollTo(doPaging ? rowAtBottom : rowAtTop), this.render());
      }
    }
    /**
     * Scroll to the top row and make it into the view
     * @param {Number} row - grid row number
     */
    scrollRowToTop(row) {
      this.scrollTo(row * this._options.rowHeight), this.render();
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
    scrollPage(dir) {
      let deltaRows = dir * this.numVisibleRows, bottomOfTopmostFullyVisibleRow = this.scrollTop + this._options.rowHeight - 1;
      if (this.scrollTo((this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * this._options.rowHeight), this.render(), this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
        let row = this.activeRow + deltaRows, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
        row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
        let pos = dir === 1 ? this.gotoDown(row - 1 || 0, this.activeCell, this.activePosY, this.activePosX) : this.gotoUp(row + 1, this.activeCell, this.activePosY, this.activePosX);
        this.navigateToPos(pos);
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
      this.unsetActiveCell(), this.navigateToRow(0);
    }
    /** Navigate to the bottom of the grid */
    navigateBottom() {
      var _a, _b;
      let row = this.getDataLength() - 1, tmpRow = (_b = (_a = this.getParentRowSpanByCell(row, this.activeCell)) == null ? void 0 : _a.start) != null ? _b : row;
      do
        if (this._options.enableCellRowSpan && this.setActiveRow(tmpRow), this.navigateToRow(tmpRow) && this.activeCell === this.activePosX || !Utils.isDefined(this.activeCell))
          break;
      while (--tmpRow > 0);
    }
    /**
     * Navigates to a specified row, ensuring it is visible and selecting an active cell if applicable.
     * Adjusts the scroll position and updates the active cell based on cell navigation rules.
     *
     * @param {number} row - The row index to navigate to.
     * @returns {boolean} Whether the navigation was successful.
     */
    navigateToRow(row) {
      let num_rows = this.getDataLength();
      if (!num_rows)
        return !1;
      row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), this.scrollCellIntoView(row, 0, !0);
      let isValidMove = !Utils.isDefined(this.activeCell) || !Utils.isDefined(this.activeRow);
      if (this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
        let cell = 0, prevCell = null, prevActivePosX = this.activePosX;
        for (; cell <= this.activePosX; )
          this.canCellBeActive(row, cell) && (prevCell = cell, (!Utils.isDefined(this.activeCell) || cell === this.activeCell) && (isValidMove = !0)), cell += this.getColspan(row, cell);
        prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
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
    getColspan(row, cell) {
      let metadata = this.getItemMetadaWhenExists(row);
      if (!metadata || !metadata.columns)
        return 1;
      cell >= this.columns.length && (cell = this.columns.length - 1);
      let columnData = metadata.columns[this.columns[cell].id] || metadata.columns[cell], colspan = columnData == null ? void 0 : columnData.colspan;
      return colspan === "*" ? colspan = this.columns.length - cell : colspan = colspan || 1, colspan;
    }
    /////////////////////////////////////////////////////////
    // End Scrolling and Virtualisation
    ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    // Cell and Row Post-Processing and CSS Styling
    ///////////////////////////////////////////////////////
    /**
     * Increments an internal group id and, for each column in the provided postProcessedRow object,
     * queues a cleanup action (action type 'C') for that cell. It also queues a cleanup action for the
     * entire row (action type 'R') and removes all row nodes from the DOM.
     *
     * @param {RowCaching} cacheEntry - The cache entry for the row.
     * @param {any} postProcessedRow - The object containing post-processed row data.
     * @param {number} rowIdx - The index of the row being processed.
     */
    queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
      var _a;
      this.postProcessgroupId++, typeof postProcessedRow == "object" && Object.keys(postProcessedRow).forEach((columnIdx) => {
        postProcessedRow.hasOwnProperty(columnIdx) && this.postProcessedCleanupQueue.push({
          actionType: "C",
          groupId: this.postProcessgroupId,
          node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
          columnIdx: +columnIdx,
          rowIdx
        });
      }), cacheEntry.rowNode || (cacheEntry.rowNode = []), this.postProcessedCleanupQueue.push({
        actionType: "R",
        groupId: this.postProcessgroupId,
        node: cacheEntry.rowNode
      }), (_a = cacheEntry.rowNode) == null || _a.forEach((node) => node.remove());
    }
    /**
     * Queues a cleanup action (action type 'C') for the provided cell DOM element and
     * immediately removes the cell element from the DOM.
     *
     * @param {HTMLElement} cellnode - The DOM element representing the cell.
     * @param {number} columnIdx - The column index of the cell.
     * @param {number} rowIdx - The row index of the cell.
     */
    queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
      this.postProcessedCleanupQueue.push({
        actionType: "C",
        groupId: this.postProcessgroupId,
        node: cellnode,
        columnIdx,
        rowIdx
      }), cellnode.remove();
    }
    /** Apply a Formatter Result to a Cell DOM Node
     *
     * If the formatter result is not an object, it is applied directly as HTML/text;
     * otherwise, it extracts the content (from a property such as “html” or “text”) and applies it.
     * Additionally, it conditionally removes or adds CSS classes and sets a tooltip on the cell.
     */
    applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
      if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
        this.applyHtmlCode(cellNode, formatterResult);
        return;
      }
      let formatterVal = formatterResult.html || formatterResult.text;
      this.applyHtmlCode(cellNode, formatterVal), formatterResult.removeClasses && !suppressRemove && cellNode.classList.remove(...Utils.classNameToList(formatterResult.removeClasses)), formatterResult.addClasses && cellNode.classList.add(...Utils.classNameToList(formatterResult.addClasses)), formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
    }
    /**
     * If asynchronous post–rendering is enabled, clears any existing post–render timer and sets a new timeout
     * to call asyncPostProcessRows after the configured delay.
     *
     * @returns {void}
     */
    startPostProcessing() {
      this._options.enableAsyncPostRender && (window.clearTimeout(this.h_postrender), this.h_postrender = window.setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay));
    }
    /**
     * If asynchronous post–render cleanup is enabled, clears any existing cleanup timer and
     * sets a new timeout to call asyncPostProcessCleanupRows after the configured delay.
     *
     * @returns {void}
     */
    startPostProcessingCleanup() {
      this._options.enableAsyncPostRenderCleanup && (window.clearTimeout(this.h_postrenderCleanup), this.h_postrenderCleanup = window.setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay));
    }
    /**
     * For the specified row, if post–processed results exist, sets each column’s status to “C” (indicating cleanup is needed),
     * adjusts the postProcessFromRow and postProcessToRow boundaries, and starts the post–processing timer.
     *
     * @param {number} row - The index of the row to invalidate.
     */
    invalidatePostProcessingResults(row) {
      typeof this.postProcessedRows[row] == "object" && Object.keys(this.postProcessedRows[row]).forEach((columnIdx) => {
        this.postProcessedRows[row].hasOwnProperty(columnIdx) && (this.postProcessedRows[row][columnIdx] = "C");
      }), this.postProcessFromRow = Math.min(this.postProcessFromRow, row), this.postProcessToRow = Math.max(this.postProcessToRow, row), this.startPostProcessing();
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
    asyncPostProcessRows() {
      let dataLength = this.getDataLength();
      for (; this.postProcessFromRow <= this.postProcessToRow; ) {
        let row = this.vScrollDir >= 0 ? this.postProcessFromRow++ : this.postProcessToRow--, cacheEntry = this.rowsCache[row];
        if (!(!cacheEntry || row >= dataLength)) {
          this.postProcessedRows[row] || (this.postProcessedRows[row] = {}), this.ensureCellNodesInRowsCache(row), Object.keys(cacheEntry.cellNodesByColumnIdx).forEach((colIdx) => {
            if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
              let columnIdx = +colIdx, m = this.columns[columnIdx], processedStatus = this.postProcessedRows[row][columnIdx];
              if (m.asyncPostRender && processedStatus !== "R") {
                let node = cacheEntry.cellNodesByColumnIdx[columnIdx];
                node && m.asyncPostRender(node, row, this.getDataItem(row), m, processedStatus === "C"), this.postProcessedRows[row][columnIdx] = "R";
              }
            }
          }), this.h_postrender = window.setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
          return;
        }
      }
    }
    /**
     * Checks if there are cleanup queue entries; if so, it retrieves the group id from the first entry and processes
     * (removes) all entries in the queue with that group id. For each entry, if the action type is “R”,
     * it removes all nodes in the array; if “C”, it calls the asyncPostRenderCleanup callback on the
     * corresponding column. It then schedules another cleanup cycle using the configured delay.
     */
    asyncPostProcessCleanupRows() {
      if (this.postProcessedCleanupQueue.length > 0) {
        let groupId = this.postProcessedCleanupQueue[0].groupId;
        for (; this.postProcessedCleanupQueue.length > 0 && this.postProcessedCleanupQueue[0].groupId === groupId; ) {
          let entry = this.postProcessedCleanupQueue.shift();
          if ((entry == null ? void 0 : entry.actionType) === "R" && entry.node.forEach((node) => {
            node.remove();
          }), (entry == null ? void 0 : entry.actionType) === "C") {
            let column = this.columns[entry.columnIdx];
            column.asyncPostRenderCleanup && entry.node && column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
          }
        }
        this.h_postrenderCleanup = window.setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
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
    updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      let node, addedRowHash, removedRowHash;
      typeof this.rowsCache == "object" && Object.keys(this.rowsCache).forEach((row) => {
        this.rowsCache && (removedRowHash = removedHash == null ? void 0 : removedHash[row], addedRowHash = addedHash == null ? void 0 : addedHash[row], removedRowHash && Object.keys(removedRowHash).forEach((columnId) => {
          (!addedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
        }), addedRowHash && Object.keys(addedRowHash).forEach((columnId) => {
          (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
        }));
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
    addCellCssStyles(key, hash) {
      if (this.cellCssClasses[key])
        throw new Error(`SlickGrid addCellCssStyles: cell CSS hash with key "${key}" already exists.`);
      this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, null), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
    }
    /**
     * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
     * @param {String} key A string key.
     */
    removeCellCssStyles(key) {
      this.cellCssClasses[key] && (this.updateCellCssStylesOnRenderedRows(null, this.cellCssClasses[key]), delete this.cellCssClasses[key], this.trigger(this.onCellCssStylesChanged, { key, hash: null, grid: this }));
    }
    /**
     * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash). key is name for this set of styles so you can reference it later - to modify it or remove it, for example. hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
     * Suppose you have a grid with columns:
     * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
     * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).
     * @param {String} key A string key. Will overwrite any data already associated with this key.
     * @param {Object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
     */
    setCellCssStyles(key, hash) {
      let prevHash = this.cellCssClasses[key];
      this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, prevHash), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
    }
    /**
     * Accepts a key name, returns the group of CSS styles defined under that name. See setCellCssStyles for more info.
     * @param {String} key A string.
     */
    getCellCssStyles(key) {
      return this.cellCssClasses[key];
    }
    /**
     * Flashes the cell twice by toggling the CSS class 4 times.
     * @param {Number} row A row index.
     * @param {Number} cell A column index.
     * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 250 ms.
     */
    flashCell(row, cell, speed = 250) {
      let toggleCellClass = (cellNode, times) => {
        times < 1 || (window.clearTimeout(this._flashCellTimer), this._flashCellTimer = window.setTimeout(() => {
          times % 2 === 0 ? cellNode.classList.add(this._options.cellFlashingCssClass || "") : cellNode.classList.remove(this._options.cellFlashingCssClass || ""), toggleCellClass(cellNode, times - 1);
        }, speed));
      };
      if (this.rowsCache[row]) {
        let cellNode = this.getCellNode(row, cell);
        cellNode && toggleCellClass(cellNode, 5);
      }
    }
    /**
     * Highlight a row for a certain duration (ms) of time.
     * @param {Number} row - grid row number
     * @param {Number} [duration] - duration (ms), defaults to 400ms
     */
    highlightRow(row, duration) {
      let rowCache = this.rowsCache[row];
      duration || (duration = this._options.rowHighlightDuration), Array.isArray(rowCache == null ? void 0 : rowCache.rowNode) && this._options.rowHighlightCssClass && (rowCache.rowNode.forEach((node) => node.classList.add(...Utils.classNameToList(this._options.rowHighlightCssClass))), window.clearTimeout(this._highlightRowTimer), this._highlightRowTimer = window.setTimeout(() => {
        var _a;
        (_a = rowCache.rowNode) == null || _a.forEach((node) => node.classList.remove(...Utils.classNameToList(this._options.rowHighlightCssClass)));
      }, duration));
    }
    ////////////////////////////////////////////////////////////////////////
    // End Post-processing and CSS
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    // Shared Utilities and Accessors
    ////////////////////////////////////////////////////////////////////////
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
    _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
      if (!targetContainers)
        return;
      columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
      let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), isBottomSide = this.hasFrozenRows && rowIndex >= this.actualFrozenRow + (this._options.frozenBottom ? 0 : 1), isRightSide = this.hasFrozenColumns() && idx > this._options.frozenColumn;
      return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
    }
    /**
     * Dynamically creates temporary DOM elements to measure the difference between offsetWidth/Height
     * and clientWidth/Height, thereby computing the scrollbar width and height. After measuring, it
     * removes the temporary elements and returns the dimensions.
     *
     * @returns {{ width: number; height: number }} The computed scrollbar dimensions.
     */
    measureScrollbar() {
      let className = "";
      this._viewport.forEach((v) => className += v.className);
      let outerdiv = Utils.createDomElement("div", { className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
        width: outerdiv.offsetWidth - outerdiv.clientWidth,
        height: outerdiv.offsetHeight - outerdiv.clientHeight
      };
      return innerdiv.remove(), outerdiv.remove(), dim;
    }
    /**
     * Dynamically doubles a test height on a temporary element until the element no longer accepts the height
     * (or exceeds a browser-specific maximum). Returns the highest supported CSS height in pixels.
     *
     * @returns {number} The highest supported CSS height in pixels.
     */
    getMaxSupportedCssHeight() {
      let supportedHeight = 1e6, testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? this._options.ffMaxSupportedCssHeight : this._options.maxSupportedCssHeight, div = Utils.createDomElement("div", { style: { display: "hidden" } }, document.body);
      for (; ; ) {
        let test = supportedHeight * 2;
        Utils.height(div, test);
        let height = Utils.height(div);
        if (test > testUpTo || height !== test)
          break;
        supportedHeight = test;
      }
      return div.remove(), supportedHeight;
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
    /**
     * Returns an object with width and height of scrollbars currently displayed in the viewport (zero if not visible).
     */
    getDisplayedScrollbarDimensions() {
      var _a, _b, _c, _d;
      return {
        width: this.viewportHasVScroll && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0,
        height: this.viewportHasHScroll && (_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.height) != null ? _d : 0
      };
    }
    /** Get the absolute column minimum width */
    getAbsoluteColumnMinWidth() {
      return this.absoluteColumnMinWidth;
    }
    /**
     * Calculates the vertical box sizes (the sum of top/bottom borders and paddings)
     * for a given element by reading its computed style.
     * @param el
     * @returns number
     */
    getVBoxDelta(el) {
      let p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
      return p.forEach((val) => delta += Utils.toFloat(styles[val])), delta;
    }
    /**
     * Creates temporary elements in the header and a grid cell to calculate the extra width
     * and height added by borders and padding (when box-sizing is not “border-box”).
     * Sets internal properties (headerColumnWidthDiff, headerColumnHeightDiff, cellWidthDiff, cellHeightDiff)
     * and computes the absoluteColumnMinWidth as the maximum of the header and cell width differences.
     *
     */
    measureCellPaddingAndBorder() {
      let h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = this._headers[0];
      this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0, this.cellWidthDiff = this.cellHeightDiff = 0;
      let el = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
      style.boxSizing !== "border-box" && (h.forEach((val) => this.headerColumnWidthDiff += Utils.toFloat(style[val])), v.forEach((val) => this.headerColumnHeightDiff += Utils.toFloat(style[val]))), el.remove();
      let r = Utils.createDomElement("div", { className: "slick-row" }, this._canvas[0]);
      el = Utils.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden" }, textContent: "-" }, r), style = getComputedStyle(el), style.boxSizing !== "border-box" && (h.forEach((val) => this.cellWidthDiff += Utils.toFloat(style[val])), v.forEach((val) => this.cellHeightDiff += Utils.toFloat(style[val]))), r.remove(), this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
    }
    /** Clear all highlight timers that might have been left opened */
    clearAllTimers() {
      window.clearTimeout(this._columnResizeTimer), window.clearTimeout(this._executionBlockTimer), window.clearTimeout(this._flashCellTimer), window.clearTimeout(this._highlightRowTimer), window.clearTimeout(this.h_editorLoader);
    }
    /** Logs a string to the console listing each column’s width (or “H” if hidden) for debugging purposes. */
    LogColWidths() {
      let s = "Col Widths:";
      for (let i = 0; i < this.columns.length; i++)
        s += " " + (this.columns[i].hidden ? "H" : this.columns[i].width);
      console.log(s);
    }
    // compare 2 simple arrays (integers or strings only, do not use to compare object arrays)
    simpleArrayEquals(arr1, arr2) {
      return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
    }
    /**
     * Converts a value to a string and escapes HTML characters (&, <, >). Returns an empty string if the value is not defined.
     */
    defaultFormatter(_row, _cell, value) {
      return Utils.isDefined(value) ? (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    }
    /** Returns false if the specified row or cell index is out of bounds or if the column is hidden; otherwise returns true. */
    cellExists(row, cell) {
      return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
    }
    /** Reads the CSS class (of the form “l<number>”) from the given cell DOM node to extract and return the column index. Throws an error if not found. */
    getCellFromNode(cellNode) {
      let cls = /l\d+/.exec(cellNode.className);
      if (!cls)
        throw new Error(`SlickGrid getCellFromNode: cannot get cell - ${cellNode.className}`);
      return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
    }
    /** Iterates through the rows cache to find which row’s DOM element matches the given node and returns its row index; returns null if not found. */
    getRowFromNode(rowNode) {
      var _a;
      for (let row in this.rowsCache)
        if (this.rowsCache) {
          for (let i in this.rowsCache[row].rowNode)
            if (((_a = this.rowsCache[row].rowNode) == null ? void 0 : _a[+i]) === rowNode)
              return row ? parseInt(row, 10) : 0;
        }
      return null;
    }
    /** Clears the current text selection using IE’s document.selection.empty (if available) or window.getSelection to remove all ranges. */
    clearTextSelection() {
      var _a;
      if ((_a = document.selection) != null && _a.empty)
        try {
          document.selection.empty();
        } catch (e) {
        }
      else if (window.getSelection) {
        let sel = window.getSelection();
        sel != null && sel.removeAllRanges && sel.removeAllRanges();
      }
    }
    /**
     * For each provided element in target, sets the “unselectable” attribute, disables Mozilla’s user selection style,
     * and binds a “selectstart” event that always returns false, thus disabling text selection.
     *
     * @param target
     */
    disableSelection(target) {
      target.forEach((el) => {
        el.setAttribute("unselectable", "on"), el.style.mozUserSelect = "none", this._bindingEventService.bind(el, "selectstart", () => !1);
      });
    }
    /** Get the displayed scrollbar dimensions */
    getPubSubService() {
      return this._pubSubService;
    }
    /**
     * Returns row and cell indexes by providing x,y coordinates.
     * Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
     * @param x An x coordinate.
     * @param y A y coordinate.
     */
    getCellFromPoint(x, y) {
      let row = this.getRowFromPosition(y), cell = 0, w = 0;
      for (let i = 0; i < this.columns.length && w <= x; i++)
        this.columns[i] && (w += this.columns[i].width, cell++);
      return cell -= 1, row < -1 && (row = -1), { row, cell };
    }
    /** Get a Plugin (addon) by its name */
    getPluginByName(name) {
      var _a;
      for (let i = this.plugins.length - 1; i >= 0; i--)
        if (((_a = this.plugins[i]) == null ? void 0 : _a.pluginName) === name)
          return this.plugins[i];
    }
    /** Get Grid Canvas Node DOM Element */
    getContainerNode() {
      return this._container;
    }
    /**
     * Computes the height of a cell, taking into account row span if applicable.
     *
     * @param {number} row - The row index of the cell.
     * @param {number} rowspan - The number of rows the cell spans.
     * @returns {number} The computed cell height in pixels.
     */
    getCellHeight(row, rowspan) {
      let cellHeight = this._options.rowHeight || 0;
      if (rowspan > 1) {
        let rowSpanBottomIdx = row + rowspan - 1;
        cellHeight = this.getRowBottom(rowSpanBottomIdx) - this.getRowTop(row);
      } else {
        let rowHeight = this.getRowHeight();
        rowHeight !== cellHeight - this.cellHeightDiff && (cellHeight = rowHeight);
      }
      return cellHeight -= this.cellHeightDiff, Math.ceil(cellHeight);
    }
    /**
     * Computes the difference between two sets, returning elements that exist in `a` but not in `b`.
     * This serves as a polyfill for `Set.prototype.difference()` introduced in ES2024.
     *
     * @param {Set<number>} a - The base set from which elements will be removed.
     * @param {Set<number>} b - The set containing elements to be excluded from `a`.
     * @returns {Set<number>} A new set containing elements present in `a` but not in `b`.
     */
    setDifference(a, b) {
      return new Set(Array.from(a).filter((item) => !b.has(item)));
    }
    /**
     * Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
     * @param {Number} row - A row number.
     * @param {Number} cell - A column number.
     */
    getCellNodeBox(row, cell) {
      var _a;
      if (!this.cellExists(row, cell))
        return null;
      let frozenRowOffset = this.getFrozenRowOffset(row), y1 = this.getRowTop(row) - frozenRowOffset, y2 = y1 + this._options.rowHeight - 1, x1 = 0;
      for (let i = 0; i < cell; i++)
        !this.columns[i] || this.columns[i].hidden || (x1 += this.columns[i].width || 0, this._options.frozenColumn === i && (x1 = 0));
      let x2 = x1 + (((_a = this.columns[cell]) == null ? void 0 : _a.width) || 0);
      return {
        top: y1,
        left: x1,
        bottom: y2,
        right: x2
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
    absBox(elem) {
      let box = {
        top: elem.offsetTop,
        left: elem.offsetLeft,
        bottom: 0,
        right: 0,
        width: elem.offsetWidth,
        height: elem.offsetWidth,
        visible: !0
      };
      box.bottom = box.top + box.height, box.right = box.left + box.width;
      let offsetParent = elem.offsetParent;
      for (; (elem = elem.parentNode) !== document.body && !(!elem || !elem.parentNode); ) {
        let styles = getComputedStyle(elem);
        box.visible && elem.scrollHeight !== elem.offsetHeight && styles.overflowY !== "visible" && (box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight), box.visible && elem.scrollWidth !== elem.offsetWidth && styles.overflowX !== "visible" && (box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth), box.left -= elem.scrollLeft, box.top -= elem.scrollTop, elem === offsetParent && (box.left += elem.offsetLeft, box.top += elem.offsetTop, offsetParent = elem.offsetParent), box.bottom = box.top + box.height, box.right = box.left + box.width;
      }
      return box;
    }
    /** Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. */
    getActiveCellPosition() {
      return this.absBox(this.activeCellNode);
    }
    /** Get the Grid Position */
    getGridPosition() {
      return this.absBox(this._container);
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
      return this.activeCellNode ? { row: this.activeRow, cell: this.activeCell } : null;
    }
    /** Returns the DOM element containing the currently active cell. If no cell is active, null is returned. */
    getActiveCellNode() {
      return this.activeCellNode;
    }
    // This get/set methods are used for keeping text-selection. These don't consider IE because they don't loose text-selection.
    // Fix for firefox selection. See https://github.com/mleibman/SlickGrid/pull/746/files
    getTextSelection() {
      var _a;
      let textSelection = null;
      if (window.getSelection) {
        let selection = window.getSelection();
        ((_a = selection == null ? void 0 : selection.rangeCount) != null ? _a : 0) > 0 && (textSelection = selection.getRangeAt(0));
      }
      return textSelection;
    }
    /**
     * Sets the text selection to the specified range within the document.
     * Clears any existing selections before applying the new range.
     *
     * @param {Range} selection - The text range to be selected.
     */
    setTextSelection(selection) {
      if (window.getSelection && selection) {
        let target = window.getSelection();
        target && (target.removeAllRanges(), target.addRange(selection));
      }
    }
    /** html sanitizer to avoid scripting attack */
    sanitizeHtmlString(dirtyHtml, suppressLogging) {
      if (!this._options.sanitizer || typeof dirtyHtml != "string")
        return dirtyHtml;
      let cleanHtml = this._options.sanitizer(dirtyHtml);
      return !suppressLogging && this._options.logSanitizedHtml && this.logMessageCount <= this.logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log(`sanitizer altered html: ${dirtyHtml} --> ${cleanHtml}`), this.logMessageCount === this.logMessageMaxCount && console.log(`sanitizer: silencing messages after first ${this.logMessageMaxCount}`), this.logMessageCount++), cleanHtml;
    }
    ///////////////////////////////////////////////////////////////
    // End Shared Utilities and Accessors
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // Navigation Helpers
    ///////////////////////////////////////////////////////////////
    /**
     * Retrieves the rowspan value for a specific cell in a row.
     *
     * @param {number} row - The row index.
     * @param {number} cell - The column index.
     * @returns {number} The number of rows the cell spans.
     */
    getRowspan(row, cell) {
      let rowspan = 1, metadata = this.getItemMetadaWhenExists(row);
      return metadata != null && metadata.columns && Object.keys(metadata.columns).forEach((col) => {
        let colIdx = Number(col);
        if (colIdx === cell) {
          let columnMeta = metadata.columns[colIdx];
          rowspan = Number((columnMeta == null ? void 0 : columnMeta.rowspan) || 1);
        }
      }), rowspan;
    }
    /**
     * Finds the nearest focusable row in the specified direction.
     *
     * @param {number} row - The current row index.
     * @param {number} cell - The column index.
     * @param {'up' | 'down'} dir - The direction to search for a focusable row.
     * @returns {number} The index of the focusable row.
     */
    findFocusableRow(row, cell, dir) {
      let r = row, rowRange = this._colsWithRowSpanCache[cell] || /* @__PURE__ */ new Set(), found = !1;
      return Array.from(rowRange).forEach((rrange) => {
        let [start, end] = rrange.split(":").map(Number);
        !found && row >= start && row <= end && (r = dir === "up" ? start : end, this.canCellBeActive(r, cell) && (found = !0));
      }), r < 0 && (r = 0), r;
    }
    /**
     * Finds the first focusable cell in a given row.
     *
     * @param {number} row - The row index.
     * @returns {{ cell: number; row: number; }} The first focusable cell and its row.
     */
    findFirstFocusableCell(row) {
      let cell = 0, focusableRow = row, ff = -1;
      for (; cell < this.columns.length; ) {
        let prs = this.getParentRowSpanByCell(row, cell);
        if (focusableRow = prs !== null && prs.start !== row ? prs.start : row, this.canCellBeActive(focusableRow, cell)) {
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
    findLastFocusableCell(row) {
      let cell = 0, focusableRow = row, lf = -1;
      for (; cell < this.columns.length; ) {
        let prs = this.getParentRowSpanByCell(row, cell);
        focusableRow = prs !== null && prs.start !== row ? prs.start : row, this.canCellBeActive(focusableRow, cell) && (lf = cell), cell += this.getColspan(focusableRow, cell);
      }
      return { cell: lf, row: focusableRow };
    }
    /**
     * Converts an array of row indices into a range format.
     *
     * @param {number[]} rows - The row indices.
     * @returns {SlickRange_[]} An array of ranges covering the specified rows.
     */
    rowsToRanges(rows) {
      let ranges = [], lastCell = this.columns.length - 1;
      for (let i = 0; i < rows.length; i++)
        ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
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
    findSpanStartingCell(row, cell) {
      let prs = this.getParentRowSpanByCell(row, cell), focusableRow = prs !== null && prs.start !== row ? prs.start : row, fc = 0, prevCell = 0;
      for (; fc < this.columns.length; ) {
        if (fc += this.getColspan(focusableRow, fc), fc > cell)
          return fc = prevCell, { cell: fc, row: focusableRow };
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
    gotoRight(_row, cell, posY, _posX) {
      if (cell >= this.columns.length)
        return null;
      let fc = cell + 1, fr = posY;
      do {
        let sc = this.findSpanStartingCell(posY, fc);
        if (fr = sc.row, fc = sc.cell, this.canCellBeActive(fr, fc) && fc > cell)
          break;
        fc += this.getColspan(fr, sc.cell);
      } while (fc < this.columns.length);
      return fc < this.columns.length ? {
        row: fr,
        cell: fc,
        posX: fc,
        posY
      } : null;
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
    gotoLeft(row, cell, posY, _posX) {
      if (cell <= 0)
        return null;
      let ff = this.findFirstFocusableCell(row);
      if (ff.cell === null || ff.cell >= cell)
        return null;
      let pos, prev = {
        row,
        cell: ff.cell,
        posX: ff.cell,
        posY
      };
      for (; ; ) {
        if (pos = this.gotoRight(prev.row, prev.cell, prev.posY, prev.posX), !pos)
          return null;
        if (pos.cell >= cell) {
          let nextRow = this.findFocusableRow(posY, prev.cell, "up");
          return nextRow !== prev.row && (prev.row = nextRow), prev;
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
    gotoDown(row, cell, _posY, posX) {
      let prevCell, ub = this.getDataLengthIncludingAddNew();
      do
        for (row += this.getRowspan(row, posX), prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += this.getColspan(row, cell);
      while (row <= ub && !this.canCellBeActive(row, prevCell));
      return row <= ub ? {
        row,
        cell: prevCell,
        posX,
        posY: row
      } : null;
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
    gotoUp(row, cell, _posY, posX) {
      let prevCell;
      if (row <= 0)
        return null;
      do
        for (row = this.findFocusableRow(row - 1, posX, "up"), prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += this.getColspan(row, cell);
      while (row >= 0 && !this.canCellBeActive(row, prevCell));
      return cell <= this.columns.length ? {
        row,
        cell: prevCell,
        posX,
        posY: row
      } : null;
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
    gotoNext(row, cell, posY, posX) {
      var _a, _b;
      if (!Utils.isDefined(row) && !Utils.isDefined(cell) && (row = cell = posY = posX = 0, this.canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell,
          posY
        };
      let pos = this.gotoRight(row, cell, posY, posX);
      if (!pos) {
        let ff;
        for (; !pos && ++posY < this.getDataLength() + (this._options.enableAddRow ? 1 : 0); )
          ff = this.findFirstFocusableCell(posY), ff.cell !== null && (row = (_b = (_a = this.getParentRowSpanByCell(posY, ff.cell)) == null ? void 0 : _a.start) != null ? _b : posY, pos = {
            row,
            cell: ff.cell,
            posX: ff.cell,
            posY
          });
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
    gotoPrev(row, cell, posY, posX) {
      var _a, _b;
      if (!Utils.isDefined(row) && !Utils.isDefined(cell) && (row = posY = this.getDataLengthIncludingAddNew() - 1, cell = posX = this.columns.length - 1, this.canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell,
          posY
        };
      let pos = this.gotoLeft(row, cell, posY, posX);
      if (!pos) {
        let lf;
        for (; !pos && --posY >= 0; )
          lf = this.findLastFocusableCell(posY), lf.cell > -1 && (row = (_b = (_a = this.getParentRowSpanByCell(posY, lf.cell)) == null ? void 0 : _a.start) != null ? _b : posY, pos = {
            row,
            cell: lf.cell,
            posX: lf.cell,
            posY
          });
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
    gotoRowStart(row, _cell, _posY, _posX) {
      let ff = this.findFirstFocusableCell(row);
      return ff.cell === null ? null : {
        row: ff.row,
        cell: ff.cell,
        posX: ff.cell,
        posY: row
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
    gotoRowEnd(row, _cell, _posY, _posX) {
      let lf = this.findLastFocusableCell(row);
      return lf.cell === -1 ? null : {
        row: lf.row,
        cell: lf.cell,
        posX: lf.cell,
        posY: row
      };
    }
    /** Switches the active cell one cell right skipping unselectable cells. Unline navigateNext, navigateRight stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not. */
    navigateRight() {
      return this.navigate("right");
    }
    /** Switches the active cell one cell left skipping unselectable cells. Unline navigatePrev, navigateLeft stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not. */
    navigateLeft() {
      return this.navigate("left");
    }
    /** Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
    navigateDown() {
      return this.navigate("down");
    }
    /** Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
    navigateUp() {
      return this.navigate("up");
    }
    /** Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not. */
    navigateNext() {
      return this.navigate("next");
    }
    /** Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not. */
    navigatePrev() {
      return this.navigate("prev");
    }
    /** Navigate to the start row in the grid */
    navigateRowStart() {
      return this.navigate("home");
    }
    /** Navigate to the end row in the grid */
    navigateRowEnd() {
      return this.navigate("end");
    }
    /** Navigate to coordinate 0,0 (top left home) */
    navigateTopStart() {
      return this.navigateToRow(0), this.navigate("home");
    }
    /** Navigate to bottom row end (bottom right end) */
    navigateBottomEnd() {
      return this.navigateBottom(), this.navigate("end");
    }
    /**
     * @param {string} dir Navigation direction.
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    navigate(dir) {
      var _a;
      if (!this._options.enableCellNavigation || !this.activeCellNode && dir !== "prev" && dir !== "next")
        return !1;
      if (!((_a = this.getEditorLock()) != null && _a.commitCurrentEdit()))
        return !0;
      this.setFocus(), this.unsetActiveCell();
      let tabbingDirections = {
        up: -1,
        down: 1,
        left: -1,
        right: 1,
        prev: -1,
        next: 1,
        home: -1,
        end: 1
      };
      this.tabbingDirection = tabbingDirections[dir];
      let pos = {
        up: this.gotoUp,
        down: this.gotoDown,
        left: this.gotoLeft,
        right: this.gotoRight,
        prev: this.gotoPrev,
        next: this.gotoNext,
        home: this.gotoRowStart,
        end: this.gotoRowEnd
      }[dir].call(this, this.activeRow, this.activeCell, this.activePosY, this.activePosX);
      return this.navigateToPos(pos);
    }
    /**
     * Navigates to a specified cell position within the grid.
     * Ensures the cell is visible, sets it as active, and updates position tracking.
     *
     * @param {CellPosition | null} pos - The target cell position.
     * @returns {boolean} Whether navigation was successful.
     */
    navigateToPos(pos) {
      if (pos) {
        if (this.hasFrozenRows && this._options.frozenBottom && pos.row === this.getDataLength())
          return;
        let isAddNewRow = pos.row === this.getDataLength();
        return (!this._options.frozenBottom && pos.row >= this.actualFrozenRow || this._options.frozenBottom && pos.row < this.actualFrozenRow) && this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling), this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell)), this.activePosX = pos.posX, this.activePosY = pos.posY, !0;
      } else
        return this.setActiveCellInternal(this.getCellNode(this.activeRow, this.activeCell)), !1;
    }
    /**
     * Returns a DOM element containing a cell at a given row and cell.
     * @param row A row index.
     * @param cell A column index.
     * @returns {HTMLDivElement | null} The cell's DOM element, or null if not found.
     */
    getCellNode(row, cell) {
      if (this.rowsCache[row]) {
        this.ensureCellNodesInRowsCache(row);
        try {
          return this.rowsCache[row].cellNodesByColumnIdx.length > cell ? this.rowsCache[row].cellNodesByColumnIdx[cell] : null;
        } catch (e) {
          return this.rowsCache[row].cellNodesByColumnIdx[cell];
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
    setActiveCell(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
      this.initialized && (row > this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || this._options.enableCellNavigation && (this.scrollCellIntoView(row, cell, !1), this.setActiveCellInternal(this.getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent)));
    }
    /**
     * Sets an active cell.
     * @param {number} row - A row index.
     * @param {number} cell - A column index.
     * @param {boolean} [suppressScrollIntoView] - optionally suppress the ScrollIntoView that happens by default (defaults to false)
     */
    setActiveRow(row, cell, suppressScrollIntoView) {
      this.initialized && (row > this.getDataLength() || row < 0 || (cell != null ? cell : 0) >= this.columns.length || (cell != null ? cell : 0) < 0 || (this.activeRow = row, suppressScrollIntoView || this.scrollCellIntoView(row, cell || 0, !1)));
    }
    /**
     * Returns true if you can click on a given cell and make it the active focus.
     * @param {number} row A row index.
     * @param {number} col A column index.
     */
    canCellBeActive(row, cell) {
      var _a, _b, _c, _d;
      if (!this._options.enableCellNavigation || row >= this.getDataLengthIncludingAddNew() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden || ((_b = (_a = this.getParentRowSpanByCell(row, cell)) == null ? void 0 : _a.start) != null ? _b : row) !== row)
        return !1;
      let rowMetadata = this.getItemMetadaWhenExists(row);
      if ((rowMetadata == null ? void 0 : rowMetadata.focusable) !== void 0)
        return !!rowMetadata.focusable;
      let columnMetadata = rowMetadata == null ? void 0 : rowMetadata.columns;
      return ((_c = columnMetadata == null ? void 0 : columnMetadata[this.columns[cell].id]) == null ? void 0 : _c.focusable) !== void 0 ? !!columnMetadata[this.columns[cell].id].focusable : ((_d = columnMetadata == null ? void 0 : columnMetadata[cell]) == null ? void 0 : _d.focusable) !== void 0 ? !!columnMetadata[cell].focusable : !!this.columns[cell].focusable;
    }
    /**
     * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
     * @param {number} row A row index.
     * @param {number} col A column index.
     */
    canCellBeSelected(row, cell) {
      if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
        return !1;
      let rowMetadata = this.getItemMetadaWhenExists(row);
      if ((rowMetadata == null ? void 0 : rowMetadata.selectable) !== void 0)
        return !!rowMetadata.selectable;
      let columnMetadata = (rowMetadata == null ? void 0 : rowMetadata.columns) && (rowMetadata.columns[this.columns[cell].id] || rowMetadata.columns[cell]);
      return (columnMetadata == null ? void 0 : columnMetadata.selectable) !== void 0 ? !!columnMetadata.selectable : !!this.columns[cell].selectable;
    }
    /**
     * Accepts a row integer and a cell integer, scrolling the view to the row where row is its row index, and cell is its cell index. Optionally accepts a forceEdit boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.
     * Unlike setActiveCell, this scrolls the row into the viewport and sets the keyboard focus.
     * @param {Number} row A row index.
     * @param {Number} cell A column index.
     * @param {Boolean} [forceEdit] If true, will attempt to initiate the edit dialogue for the field in the specified cell.
     */
    gotoCell(row, cell, forceEdit, e) {
      var _a;
      if (!this.initialized || !this.canCellBeActive(row, cell) || !((_a = this.getEditorLock()) != null && _a.commitCurrentEdit()))
        return;
      this.scrollCellIntoView(row, cell, !1);
      let newCell = this.getCellNode(row, cell), column = this.columns[cell], suppressActiveCellChangedEvent = !!(this._options.editable && (column != null && column.editor) && this._options.suppressActiveCellChangeOnEdit);
      this.setActiveCellInternal(newCell, forceEdit || row === this.getDataLength() || this._options.autoEdit, null, suppressActiveCellChangedEvent, e), this.currentEditor || this.setFocus();
    }
    /////////////////////////////////////////////////////////////////////////////////
    // End Shared Utilities and Navigation Helpers
    ///////////////////////////////////////////////////////////////////////////////
  };
  window.Slick && Utils.extend(Slick, {
    Grid: SlickGrid
  });
})();
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
//# sourceMappingURL=slick.grid.js.map
