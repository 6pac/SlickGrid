"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/slick.grid.ts
  var BindingEventService = Slick.BindingEventService, ColAutosizeMode = Slick.ColAutosizeMode, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, GlobalEditorLock = Slick.GlobalEditorLock, GridAutosizeColsMode = Slick.GridAutosizeColsMode, keyCode = Slick.keyCode, preClickClassName = Slick.preClickClassName, SlickRange = Slick.Range, RowSelectionMode = Slick.RowSelectionMode, ValueFilterMode = Slick.ValueFilterMode, Utils = Slick.Utils, WidthEvalMode = Slick.WidthEvalMode, Draggable = Slick.Draggable, MouseWheel = Slick.MouseWheel, Resizable = Slick.Resizable;
  var SlickGrid = class {
    /**
     * Creates a new instance of the grid.
     * @class SlickGrid
     * @constructor
     * @param {Node} container - Container node to create the grid in.
     * @param {Array|Object} data - An array of objects for databinding.
     * @param {Array<C>} columns - An array of column definitions.
     * @param {Object} [options] - Grid this._options.
     **/
    constructor(container, data, columns, options, externalPubSub) {
      this.container = container;
      this.data = data;
      this.columns = columns;
      this.options = options;
      this.externalPubSub = externalPubSub;
      //////////////////////////////////////////////////////////////////////////////////////////////
      // Public API
      __publicField(this, "slickGridVersion", "5.6.1");
      /** optional grid state clientId */
      __publicField(this, "cid", "");
      // Events
      __publicField(this, "onActiveCellChanged");
      __publicField(this, "onActiveCellPositionChanged");
      __publicField(this, "onAddNewRow");
      __publicField(this, "onAutosizeColumns");
      __publicField(this, "onBeforeAppendCell");
      __publicField(this, "onBeforeCellEditorDestroy");
      __publicField(this, "onBeforeColumnsResize");
      __publicField(this, "onBeforeDestroy");
      __publicField(this, "onBeforeEditCell");
      __publicField(this, "onBeforeFooterRowCellDestroy");
      __publicField(this, "onBeforeHeaderCellDestroy");
      __publicField(this, "onBeforeHeaderRowCellDestroy");
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
        showPreHeaderPanel: !1,
        preHeaderPanelHeight: 25,
        showTopPanel: !1,
        topPanelHeight: 25,
        formatterFactory: null,
        editorFactory: null,
        cellFlashingCssClass: "flashing",
        selectedCellCssClass: "selected",
        multiSelect: !0,
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
        scrollRenderThrottling: 50,
        autosizeTextAvgToMWidthRatio: 0.75,
        viewportSwitchToScrollModeWidthPercent: void 0,
        viewportMinWidthPx: void 0,
        viewportMaxWidthPx: void 0,
        suppressCssChangesOnHiddenInit: !1,
        ffMaxSupportedCssHeight: 6e6,
        maxSupportedCssHeight: 1e9,
        sanitizer: void 0,
        // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
        logSanitizedHtml: !1,
        // log to console when sanitised - recommend true for testing of dev and production
        mixinDefaults: !0,
        shadowRoot: void 0
      });
      __publicField(this, "_columnDefaults", {
        name: "",
        resizable: !0,
        sortable: !1,
        minWidth: 30,
        maxWidth: void 0,
        rerenderOnResize: !1,
        headerCssClass: null,
        defaultSortAsc: !0,
        focusable: !0,
        selectable: !0,
        hidden: !1
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
      __publicField(this, "activeRow");
      __publicField(this, "activeCell");
      __publicField(this, "activeCellNode", null);
      __publicField(this, "currentEditor", null);
      __publicField(this, "serializedEditorValue");
      __publicField(this, "editController");
      __publicField(this, "rowsCache", {});
      __publicField(this, "renderedRows", 0);
      __publicField(this, "numVisibleRows", 0);
      __publicField(this, "prevScrollTop", 0);
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
      __publicField(this, "h_editorLoader", null);
      __publicField(this, "h_render", null);
      __publicField(this, "h_postrender", null);
      __publicField(this, "h_postrenderCleanup", null);
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
      this._pubSubService = externalPubSub, this.onActiveCellChanged = new SlickEvent("onActiveCellChanged", externalPubSub), this.onActiveCellPositionChanged = new SlickEvent("onActiveCellPositionChanged", externalPubSub), this.onAddNewRow = new SlickEvent("onAddNewRow", externalPubSub), this.onAutosizeColumns = new SlickEvent("onAutosizeColumns", externalPubSub), this.onBeforeAppendCell = new SlickEvent("onBeforeAppendCell", externalPubSub), this.onBeforeCellEditorDestroy = new SlickEvent("onBeforeCellEditorDestroy", externalPubSub), this.onBeforeColumnsResize = new SlickEvent("onBeforeColumnsResize", externalPubSub), this.onBeforeDestroy = new SlickEvent("onBeforeDestroy", externalPubSub), this.onBeforeEditCell = new SlickEvent("onBeforeEditCell", externalPubSub), this.onBeforeFooterRowCellDestroy = new SlickEvent("onBeforeFooterRowCellDestroy", externalPubSub), this.onBeforeHeaderCellDestroy = new SlickEvent("onBeforeHeaderCellDestroy", externalPubSub), this.onBeforeHeaderRowCellDestroy = new SlickEvent("onBeforeHeaderRowCellDestroy", externalPubSub), this.onBeforeSetColumns = new SlickEvent("onBeforeSetColumns", externalPubSub), this.onBeforeSort = new SlickEvent("onBeforeSort", externalPubSub), this.onBeforeUpdateColumns = new SlickEvent("onBeforeUpdateColumns", externalPubSub), this.onCellChange = new SlickEvent("onCellChange", externalPubSub), this.onCellCssStylesChanged = new SlickEvent("onCellCssStylesChanged", externalPubSub), this.onClick = new SlickEvent("onClick", externalPubSub), this.onColumnsReordered = new SlickEvent("onColumnsReordered", externalPubSub), this.onColumnsDrag = new SlickEvent("onColumnsDrag", externalPubSub), this.onColumnsResized = new SlickEvent("onColumnsResized", externalPubSub), this.onColumnsResizeDblClick = new SlickEvent("onColumnsResizeDblClick", externalPubSub), this.onCompositeEditorChange = new SlickEvent("onCompositeEditorChange", externalPubSub), this.onContextMenu = new SlickEvent("onContextMenu", externalPubSub), this.onDrag = new SlickEvent("onDrag", externalPubSub), this.onDblClick = new SlickEvent("onDblClick", externalPubSub), this.onDragInit = new SlickEvent("onDragInit", externalPubSub), this.onDragStart = new SlickEvent("onDragStart", externalPubSub), this.onDragEnd = new SlickEvent("onDragEnd", externalPubSub), this.onFooterClick = new SlickEvent("onFooterClick", externalPubSub), this.onFooterContextMenu = new SlickEvent("onFooterContextMenu", externalPubSub), this.onFooterRowCellRendered = new SlickEvent("onFooterRowCellRendered", externalPubSub), this.onHeaderCellRendered = new SlickEvent("onHeaderCellRendered", externalPubSub), this.onHeaderClick = new SlickEvent("onHeaderClick", externalPubSub), this.onHeaderContextMenu = new SlickEvent("onHeaderContextMenu", externalPubSub), this.onHeaderMouseEnter = new SlickEvent("onHeaderMouseEnter", externalPubSub), this.onHeaderMouseLeave = new SlickEvent("onHeaderMouseLeave", externalPubSub), this.onHeaderRowCellRendered = new SlickEvent("onHeaderRowCellRendered", externalPubSub), this.onHeaderRowMouseEnter = new SlickEvent("onHeaderRowMouseEnter", externalPubSub), this.onHeaderRowMouseLeave = new SlickEvent("onHeaderRowMouseLeave", externalPubSub), this.onKeyDown = new SlickEvent("onKeyDown", externalPubSub), this.onMouseEnter = new SlickEvent("onMouseEnter", externalPubSub), this.onMouseLeave = new SlickEvent("onMouseLeave", externalPubSub), this.onRendered = new SlickEvent("onRendered", externalPubSub), this.onScroll = new SlickEvent("onScroll", externalPubSub), this.onSelectedRowsChanged = new SlickEvent("onSelectedRowsChanged", externalPubSub), this.onSetOptions = new SlickEvent("onSetOptions", externalPubSub), this.onActivateChangedOptions = new SlickEvent("onActivateChangedOptions", externalPubSub), this.onSort = new SlickEvent("onSort", externalPubSub), this.onValidationError = new SlickEvent("onValidationError", externalPubSub), this.onViewportChanged = new SlickEvent("onViewportChanged", externalPubSub), this.initialize();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization
    /** Initializes the grid. */
    init() {
      this.finishInitialization();
    }
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
    initialize() {
      if (this.options.mixinDefaults ? (this.options || (this.options = {}), Utils.applyDefaults(this.options, this._defaults)) : this._options = Utils.extend(!0, {}, this._defaults, this.options), this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling), this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight(), this.validateAndEnforceOptions(), this._columnDefaults.width = this._options.defaultColumnWidth, this._options.suppressCssChangesOnHiddenInit || this.cacheCssForHiddenInit(), this.updateColumnProps(), this._options.enableColumnReorder && (!Sortable || !Sortable.create))
        throw new Error("SlickGrid requires Sortable.js module to be loaded");
      this.editController = {
        commitCurrentEdit: this.commitCurrentEdit.bind(this),
        cancelCurrentEdit: this.cancelCurrentEdit.bind(this)
      }, Utils.emptyElement(this._container), this._container.style.overflow = "hidden", this._container.style.outline = String(0), this._container.classList.add(this.uid), this._container.classList.add("ui-widget");
      let containerStyles = window.getComputedStyle(this._container);
      /relative|absolute|fixed/.test(containerStyles.position) || (this._container.style.position = "relative"), this._focusSink = Utils.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, this._container), this._paneHeaderL = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, this._container), this._paneHeaderR = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, this._container), this._paneTopL = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, this._container), this._paneTopR = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, this._container), this._paneBottomL = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, this._container), this._paneBottomR = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, this._container), this._options.createPreHeaderPanel && (this._preHeaderPanelScroller = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderL), this._preHeaderPanelScroller.appendChild(document.createElement("div")), this._preHeaderPanel = Utils.createDomElement("div", null, this._preHeaderPanelScroller), this._preHeaderPanelSpacer = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScroller), this._preHeaderPanelScrollerR = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderR), this._preHeaderPanelR = Utils.createDomElement("div", null, this._preHeaderPanelScrollerR), this._preHeaderPanelSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScrollerR), this._options.showPreHeaderPanel || (Utils.hide(this._preHeaderPanelScroller), Utils.hide(this._preHeaderPanelScrollerR))), this._headerScrollerL = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, this._paneHeaderL), this._headerScrollerR = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, this._paneHeaderR), this._headerScroller.push(this._headerScrollerL), this._headerScroller.push(this._headerScrollerR), this._headerL = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", style: { left: "-1000px" } }, this._headerScrollerL), this._headerR = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", style: { left: "-1000px" } }, this._headerScrollerR), this._headers = [this._headerL, this._headerR], this._headerRowScrollerL = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopL), this._headerRowScrollerR = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopR), this._headerRowScroller = [this._headerRowScrollerL, this._headerRowScrollerR], this._headerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerL), this._headerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerR), this._headerRowL = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, this._headerRowScrollerL), this._headerRowR = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, this._headerRowScrollerR), this._headerRows = [this._headerRowL, this._headerRowR], this._topPanelScrollerL = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopL), this._topPanelScrollerR = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopR), this._topPanelScrollers = [this._topPanelScrollerL, this._topPanelScrollerR], this._topPanelL = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerL), this._topPanelR = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerR), this._topPanels = [this._topPanelL, this._topPanelR], this._options.showColumnHeader || this._headerScroller.forEach((el) => {
        Utils.hide(el);
      }), this._options.showTopPanel || this._topPanelScrollers.forEach((scroller) => {
        Utils.hide(scroller);
      }), this._options.showHeaderRow || this._headerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      }), this._viewportTopL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, this._paneTopL), this._viewportTopR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, this._paneTopR), this._viewportBottomL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, this._paneBottomL), this._viewportBottomR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, this._paneBottomR), this._viewport = [this._viewportTopL, this._viewportTopR, this._viewportBottomL, this._viewportBottomR], this._options.viewportClass && this._viewport.forEach((view) => {
        view.classList.add(...(this._options.viewportClass || "").split(" "));
      }), this._activeViewportNode = this._viewportTopL, this._canvasTopL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, this._viewportTopL), this._canvasTopR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, this._viewportTopR), this._canvasBottomL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, this._viewportBottomL), this._canvasBottomR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, this._viewportBottomR), this._canvas = [this._canvasTopL, this._canvasTopR, this._canvasBottomL, this._canvasBottomR], this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar(), this._activeCanvasNode = this._canvasTopL, this._preHeaderPanelSpacer && Utils.width(this._preHeaderPanelSpacer, this.getCanvasWidth() + this.scrollbarDimensions.width), this._headers.forEach((el) => {
        Utils.width(el, this.getHeadersWidth());
      }), Utils.width(this._headerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), Utils.width(this._headerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._options.createFooterRow && (this._footerRowScrollerR = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopR), this._footerRowScrollerL = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopL), this._footerRowScroller = [this._footerRowScrollerL, this._footerRowScrollerR], this._footerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerL), Utils.width(this._footerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerR), Utils.width(this._footerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowL = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, this._footerRowScrollerL), this._footerRowR = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, this._footerRowScrollerR), this._footerRow = [this._footerRowL, this._footerRowR], this._options.showFooterRow || this._footerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      })), this._focusSink2 = this._focusSink.cloneNode(!0), this._container.appendChild(this._focusSink2), this._options.explicitInitialization || this.finishInitialization();
    }
    finishInitialization() {
      this.initialized || (this.initialized = !0, this.getViewportWidth(), this.getViewportHeight(), this.measureCellPaddingAndBorder(), this.disableSelection(this._headers), this._options.enableTextSelectionOnCells || this._viewport.forEach((view) => {
        this._bindingEventService.bind(view, "selectstart", (event) => {
          event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
        });
      }), this.setFrozenOptions(), this.setPaneVisibility(), this.setScroller(), this.setOverflow(), this.updateColumnCaches(), this.createColumnHeaders(), this.createColumnFooter(), this.setupColumnSort(), this.createCssRules(), this.resizeCanvas(), this.bindAncestorScrollEvents(), this._bindingEventService.bind(this._container, "resize", this.resizeCanvas.bind(this)), this._viewport.forEach((view) => {
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
      })), this._options.createPreHeaderPanel && this._bindingEventService.bind(this._preHeaderPanelScroller, "scroll", this.handlePreHeaderPanelScroll.bind(this)), this._bindingEventService.bind(this._focusSink, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(this._focusSink2, "keydown", this.handleKeyDown.bind(this)), this._canvas.forEach((element) => {
        this._bindingEventService.bind(element, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(element, "click", this.handleClick.bind(this)), this._bindingEventService.bind(element, "dblclick", this.handleDblClick.bind(this)), this._bindingEventService.bind(element, "contextmenu", this.handleContextMenu.bind(this)), this._bindingEventService.bind(element, "mouseover", this.handleCellMouseOver.bind(this)), this._bindingEventService.bind(element, "mouseout", this.handleCellMouseOut.bind(this));
      }), Draggable && (this.slickDraggableInstance = Draggable({
        containerElement: this._container,
        allowDragFrom: "div.slick-cell",
        // the slick cell parent must always contain `.dnd` and/or `.cell-reorder` class to be identified as draggable
        allowDragFromClosest: "div.slick-cell.dnd, div.slick-cell.cell-reorder",
        onDragInit: this.handleDragInit.bind(this),
        onDragStart: this.handleDragStart.bind(this),
        onDrag: this.handleDrag.bind(this),
        onDragEnd: this.handleDragEnd.bind(this)
      })), this._options.suppressCssChangesOnHiddenInit || this.restoreCssFromHiddenInit());
    }
    /** handles "display:none" on container or container parents, related to issue: https://github.com/6pac/SlickGrid/issues/568 */
    cacheCssForHiddenInit() {
      this._hiddenParents = Utils.parents(this._container, ":hidden");
      for (let el of this._hiddenParents) {
        let old = {};
        for (let name in this.cssShow)
          this.cssShow && (old[name] = el.style[name], el.style[name] = this.cssShow[name]);
        this.oldProps.push(old);
      }
    }
    restoreCssFromHiddenInit() {
      let i = 0;
      for (let el of this._hiddenParents) {
        let old = this.oldProps[i++];
        for (let name in this.cssShow)
          this.cssShow && (el.style[name] = old[name]);
      }
    }
    hasFrozenColumns() {
      return this._options.frozenColumn > -1;
    }
    /** Register an external Plugin */
    registerPlugin(plugin) {
      this.plugins.unshift(plugin), plugin.init(this);
    }
    /** Unregister (destroy) an external Plugin */
    unregisterPlugin(plugin) {
      var _a;
      for (let i = this.plugins.length; i >= 0; i--)
        if (this.plugins[i] === plugin) {
          (_a = this.plugins[i]) == null || _a.destroy(), this.plugins.splice(i, 1);
          break;
        }
    }
    /** Get a Plugin (addon) by its name */
    getPluginByName(name) {
      var _a;
      for (let i = this.plugins.length - 1; i >= 0; i--)
        if (((_a = this.plugins[i]) == null ? void 0 : _a.pluginName) === name)
          return this.plugins[i];
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
    getActiveViewportNode(e) {
      return this.setActiveViewportNode(e), this._activeViewportNode;
    }
    /** Sets an active viewport node */
    setActiveViewportNode(e) {
      return e instanceof SlickEventData && (e = e.getNativeEvent()), this._activeViewportNode = e == null ? void 0 : e.target.closest(".slick-viewport"), this._activeViewportNode;
    }
    _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
      if (!targetContainers)
        return;
      columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
      let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), isBottomSide = this.hasFrozenRows && rowIndex >= this.actualFrozenRow + (this._options.frozenBottom ? 0 : 1), isRightSide = this.hasFrozenColumns() && idx > this._options.frozenColumn;
      return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
    }
    measureScrollbar() {
      let className = "";
      this._viewport.forEach((v) => className += v.className);
      let outerdiv = Utils.createDomElement("div", { className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
        width: outerdiv.offsetWidth - outerdiv.clientWidth,
        height: outerdiv.offsetHeight - outerdiv.clientHeight
      };
      return innerdiv.remove(), outerdiv.remove(), dim;
    }
    /** Get the headers width in pixel */
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
    getHeadersWidthL() {
      var _a, _b;
      return this.headersWidthL = 0, this.columns.forEach((column, i) => {
        column.hidden || this._options.frozenColumn > -1 && i > this._options.frozenColumn || (this.headersWidthL += column.width || 0);
      }), this.hasFrozenColumns() ? this.headersWidthL += 1e3 : (this.headersWidthL += (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidthL;
    }
    getHeadersWidthR() {
      var _a, _b;
      return this.headersWidthR = 0, this.columns.forEach((column, i) => {
        column.hidden || this._options.frozenColumn > -1 && i > this._options.frozenColumn && (this.headersWidthR += column.width || 0);
      }), this.hasFrozenColumns() && (this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.getHeadersWidthL(), this.headersWidthR += (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0), this.headersWidthR;
    }
    /** Get the grid canvas width */
    getCanvasWidth() {
      var _a, _b;
      let availableWidth = this.viewportHasVScroll ? this.viewportW - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0) : this.viewportW, i = this.columns.length;
      for (this.canvasWidthL = this.canvasWidthR = 0; i--; )
        !this.columns[i] || this.columns[i].hidden || (this.hasFrozenColumns() && i > this._options.frozenColumn ? this.canvasWidthR += this.columns[i].width || 0 : this.canvasWidthL += this.columns[i].width || 0);
      let totalRowWidth = this.canvasWidthL + this.canvasWidthR;
      if (this._options.fullWidthRows) {
        let extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
        extraWidth > 0 && (totalRowWidth += extraWidth, this.hasFrozenColumns() ? this.canvasWidthR += extraWidth : this.canvasWidthL += extraWidth);
      }
      return totalRowWidth;
    }
    updateCanvasWidth(forceColumnWidthsUpdate) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      let oldCanvasWidth = this.canvasWidth, oldCanvasWidthL = this.canvasWidthL, oldCanvasWidthR = this.canvasWidthR;
      this.canvasWidth = this.getCanvasWidth();
      let widthChanged = this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;
      if (widthChanged || this.hasFrozenColumns() || this.hasFrozenRows)
        if (Utils.width(this._canvasTopL, this.canvasWidthL), this.getHeadersWidth(), Utils.width(this._headerL, this.headersWidthL), Utils.width(this._headerR, this.headersWidthR), this.hasFrozenColumns()) {
          let cWidth = Utils.width(this._container) || 0;
          if (cWidth > 0 && this.canvasWidthL > cWidth && this._options.throwWhenFrozenNotAllViewable)
            throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
          Utils.width(this._canvasTopR, this.canvasWidthR), Utils.width(this._paneHeaderL, this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "left", this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "width", this.viewportW - this.canvasWidthL), Utils.width(this._paneTopL, this.canvasWidthL), Utils.setStyleSize(this._paneTopR, "left", this.canvasWidthL), Utils.width(this._paneTopR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowScrollerL, this.canvasWidthL), Utils.width(this._headerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowL, this.canvasWidthL), Utils.width(this._headerRowR, this.canvasWidthR), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, this.canvasWidthL), Utils.width(this._footerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._footerRowL, this.canvasWidthL), Utils.width(this._footerRowR, this.canvasWidthR)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, this.canvasWidth), Utils.width(this._viewportTopL, this.canvasWidthL), Utils.width(this._viewportTopR, this.viewportW - this.canvasWidthL), this.hasFrozenRows && (Utils.width(this._paneBottomL, this.canvasWidthL), Utils.setStyleSize(this._paneBottomR, "left", this.canvasWidthL), Utils.width(this._viewportBottomL, this.canvasWidthL), Utils.width(this._viewportBottomR, this.viewportW - this.canvasWidthL), Utils.width(this._canvasBottomL, this.canvasWidthL), Utils.width(this._canvasBottomR, this.canvasWidthR));
        } else
          Utils.width(this._paneHeaderL, "100%"), Utils.width(this._paneTopL, "100%"), Utils.width(this._headerRowScrollerL, "100%"), Utils.width(this._headerRowL, this.canvasWidth), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, "100%"), Utils.width(this._footerRowL, this.canvasWidth)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, this.canvasWidth), Utils.width(this._viewportTopL, "100%"), this.hasFrozenRows && (Utils.width(this._viewportBottomL, "100%"), Utils.width(this._canvasBottomL, this.canvasWidthL));
      this.viewportHasHScroll = this.canvasWidth >= this.viewportW - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0), Utils.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.width) != null ? _d : 0)), Utils.width(this._headerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_f = (_e = this.scrollbarDimensions) == null ? void 0 : _e.width) != null ? _f : 0)), this._options.createFooterRow && (Utils.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_h = (_g = this.scrollbarDimensions) == null ? void 0 : _g.width) != null ? _h : 0)), Utils.width(this._footerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_j = (_i = this.scrollbarDimensions) == null ? void 0 : _i.width) != null ? _j : 0))), (widthChanged || forceColumnWidthsUpdate) && this.applyColumnWidths();
    }
    disableSelection(target) {
      target.forEach((el) => {
        el.setAttribute("unselectable", "on"), el.style.mozUserSelect = "none", this._bindingEventService.bind(el, "selectstart", () => !1);
      });
    }
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
    /** Get the displayed scrollbar dimensions */
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
    getPubSubService() {
      return this._pubSubService;
    }
    // TODO:  this is static.  need to handle page mutation.
    bindAncestorScrollEvents() {
      let elem = this.hasFrozenRows && !this._options.frozenBottom ? this._canvasBottomL : this._canvasTopL;
      for (; (elem = elem.parentNode) !== document.body && elem; )
        (elem === this._viewportTopL || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) && (this._boundAncestors.push(elem), this._bindingEventService.bind(elem, "scroll", this.handleActiveCellPositionChange.bind(this)));
    }
    unbindAncestorScrollEvents() {
      this._boundAncestors.forEach((ancestor) => {
        this._bindingEventService.unbindByEventName(ancestor, "scroll");
      }), this._boundAncestors = [];
    }
    /**
     * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
     * @param {Number|String} columnId Column id.
     * @param {String} [title] New column name.
     * @param {String} [toolTip] New column tooltip.
     */
    updateColumnHeader(columnId, title, toolTip) {
      if (!this.initialized)
        return;
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
    handleHeaderMouseHoverOn(e) {
      e == null || e.target.classList.add("ui-state-hover", "slick-state-hover");
    }
    handleHeaderMouseHoverOff(e) {
      e == null || e.target.classList.remove("ui-state-hover", "slick-state-hover");
    }
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
        let m = this.columns[i], headerTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, headerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerRowL : this._headerRowR : this._headerRowL, header = Utils.createDomElement("div", { id: `${this.uid + m.id}`, dataset: { id: String(m.id) }, className: "ui-state-default slick-state-default slick-header-column", title: m.toolTip || "" }, headerTarget), colNameElm = Utils.createDomElement("span", { className: "slick-column-name" }, header);
        this.applyHtmlCode(colNameElm, m.name), Utils.width(header, m.width - this.headerColumnWidthDiff);
        let classname = m.headerCssClass || null;
        if (classname && header.classList.add(...classname.split(" ")), classname = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseEnter.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseLeave.bind(this)), Utils.storage.put(header, "column", m), (this._options.enableColumnReorder || m.sortable) && (this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseHoverOn.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseHoverOff.bind(this))), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object)
          for (let key in m.headerCellAttrs)
            m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
        if (m.sortable && (header.classList.add("slick-header-sortable"), Utils.createDomElement("div", { className: `slick-sort-indicator ${this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : ""}` }, header), this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan && Utils.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), this.trigger(this.onHeaderCellRendered, {
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
              sortCols: this.sortColumns.map((col) => ({ columnId: this.columns[this.getColumnIndex(col.columnId)].id, sortCol: this.columns[this.getColumnIndex(col.columnId)], sortAsc: col.sortAsc }))
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
    currentPositionInHeader(id) {
      let currentPosition = 0;
      return this._headers.forEach((header) => {
        header.querySelectorAll(".slick-header-column").forEach((column, i) => {
          column.id === id && (currentPosition = i);
        });
      }), currentPosition;
    }
    remove(arr, elem) {
      let index = arr.lastIndexOf(elem);
      index > -1 && (arr.splice(index, 1), this.remove(arr, elem));
    }
    setupColumnReorder() {
      var _a, _b;
      (_a = this.sortableSideLeftInstance) == null || _a.destroy(), (_b = this.sortableSideRightInstance) == null || _b.destroy();
      let columnScrollTimer = null, scrollColumnsRight = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft + 10, scrollColumnsLeft = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft - 10, canDragScroll, sortableOptions = {
        animation: 50,
        direction: "horizontal",
        chosenClass: "slick-header-column-active",
        ghostClass: "slick-sortable-placeholder",
        draggable: ".slick-header-column",
        dragoverBubble: !1,
        revertClone: !0,
        scroll: !this.hasFrozenColumns(),
        // enable auto-scroll
        onStart: (e) => {
          canDragScroll = !this.hasFrozenColumns() || Utils.offset(e.item).left > Utils.offset(this._viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > this._container.clientWidth ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils.offset(this._viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsLeft, 100)) : (clearInterval(columnScrollTimer), columnScrollTimer = null);
        },
        onEnd: (e) => {
          var _a2, _b2, _c, _d, _e;
          clearInterval(columnScrollTimer), columnScrollTimer = null;
          let limit;
          if (!((_a2 = this.getEditorLock()) != null && _a2.commitCurrentEdit()))
            return;
          let reorderedIds = (_c = (_b2 = this.sortableSideLeftInstance) == null ? void 0 : _b2.toArray()) != null ? _c : [];
          reorderedIds = reorderedIds.concat((_e = (_d = this.sortableSideRightInstance) == null ? void 0 : _d.toArray()) != null ? _e : []);
          let reorderedColumns = [];
          for (let i = 0; i < reorderedIds.length; i++)
            reorderedColumns.push(this.columns[this.getColumnIndex(reorderedIds[i])]);
          this.setColumns(reorderedColumns), this.trigger(this.onColumnsReordered, { impactedColumns: this.getImpactedColumns(limit) }), e.stopPropagation(), this.setupColumnResize(), this.activeCellNode && this.setFocus();
        }
      };
      this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions), this.sortableSideRightInstance = Sortable.create(this._headerR, sortableOptions);
    }
    getHeaderChildren() {
      let a = Array.from(this._headers[0].children), b = Array.from(this._headers[1].children);
      return a.concat(b);
    }
    getImpactedColumns(limit) {
      let impactedColumns = [];
      if (limit)
        for (let i = limit.start; i <= limit.end; i++)
          impactedColumns.push(this.columns[i]);
      else
        impactedColumns = this.columns;
      return impactedColumns;
    }
    handleResizeableHandleDoubleClick(evt) {
      let triggeredByColumn = evt.target.parentElement.id.replace(this.uid, "");
      this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn });
    }
    setupColumnResize() {
      if (typeof Resizable == "undefined")
        throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
      let j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable = -1, frozenLeftColMaxWidth = 0, children = this.getHeaderChildren();
      for (let i = 0; i < children.length; i++)
        children[i].querySelectorAll(".slick-resizable-handle").forEach((handle) => handle.remove()), !(i >= this.columns.length || !this.columns[i] || this.columns[i].hidden) && this.columns[i].resizable && (firstResizable === void 0 && (firstResizable = i), lastResizable = i);
      if (firstResizable !== void 0)
        for (let i = 0; i < children.length; i++) {
          let colElm = children[i];
          if (i >= this.columns.length || !this.columns[i] || this.columns[i].hidden || i < firstResizable || this._options.forceFitColumns && i >= lastResizable)
            continue;
          let resizeableHandle = Utils.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
          this._bindingEventService.bind(resizeableHandle, "dblclick", this.handleResizeableHandleDoubleClick.bind(this)), this.slickResizableInstances.push(
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
                  pw >= this.columns.length || !this.columns[pw] || this.columns[pw].hidden || (this.columns[pw].previousWidth = children[pw].offsetWidth);
                if (this._options.forceFitColumns)
                  for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnRight = null), shrinkLeewayOnRight += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
                let shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
                for (j = 0; j <= i; j++)
                  c = this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
                shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
              },
              onResize: (e, resizeElms) => {
                var _a, _b;
                let targetEvent = e.touches ? e.changedTouches[0] : e;
                this.columnResizeDragging = !0;
                let actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = this.viewportHasVScroll ? this.viewportW - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0) : this.viewportW;
                if (d < 0) {
                  for (x = d, j = i; j >= 0; j--)
                    c = this.columns[j], c && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                  for (k = 0; k <= i; k++)
                    c = this.columns[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < this.columns.length; j++)
                      c = this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  else
                    for (j = i + 1; j < this.columns.length; j++)
                      c = this.columns[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < this.columns.length; j++)
                      c = this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                } else {
                  for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i; j >= 0; j--)
                    if (c = this.columns[j], !(!c || c.hidden) && c.resizable)
                      if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x)
                        x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth;
                      else {
                        let newWidth = (c.previousWidth || 0) + x, resizedCanvasWidthL = this.canvasWidthL + x;
                        this.hasFrozenColumns() && j <= this._options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - this._options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + this._options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                      }
                  for (k = 0; k <= i; k++)
                    c = this.columns[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  if (this._options.forceFitColumns)
                    for (x = -d, j = i + 1; j < this.columns.length; j++)
                      c = this.columns[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                  else
                    for (j = i + 1; j < this.columns.length; j++)
                      c = this.columns[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
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
                for (j = 0; j < this.columns.length; j++)
                  c = this.columns[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && this.invalidateAllRows());
                this.updateCanvasWidth(!0), this.render(), this.trigger(this.onColumnsResized, { triggeredByColumn }), setTimeout(() => {
                  this.columnResizeDragging = !1;
                }, 300);
              }
            })
          );
        }
    }
    getVBoxDelta(el) {
      let p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
      return p.forEach((val) => delta += Utils.toFloat(styles[val])), delta;
    }
    setFrozenOptions() {
      if (this._options.frozenColumn = this._options.frozenColumn >= 0 && this._options.frozenColumn < this.columns.length ? parseInt(this._options.frozenColumn, 10) : -1, this._options.frozenRow > -1) {
        this.hasFrozenRows = !0, this.frozenRowsHeight = this._options.frozenRow * this._options.rowHeight;
        let dataLength = this.getDataLength();
        this.actualFrozenRow = this._options.frozenBottom ? dataLength - this._options.frozenRow : this._options.frozenRow;
      } else
        this.hasFrozenRows = !1;
    }
    setPaneVisibility() {
      this.hasFrozenColumns() ? (Utils.show(this._paneHeaderR), Utils.show(this._paneTopR), this.hasFrozenRows ? (Utils.show(this._paneBottomL), Utils.show(this._paneBottomR)) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL))) : (Utils.hide(this._paneHeaderR), Utils.hide(this._paneTopR), Utils.hide(this._paneBottomR), this.hasFrozenRows ? Utils.show(this._paneBottomL) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL)));
    }
    setOverflow() {
      this._viewportTopL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportTopR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? this.hasFrozenRows ? "scroll" : "auto" : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "auto") : (this.hasFrozenRows, "auto"), this._options.viewportClass && (this._viewportTopL.classList.add(...this._options.viewportClass.split(" ")), this._viewportTopR.classList.add(...this._options.viewportClass.split(" ")), this._viewportBottomL.classList.add(...this._options.viewportClass.split(" ")), this._viewportBottomR.classList.add(...this._options.viewportClass.split(" ")));
    }
    setScroller() {
      this.hasFrozenColumns() ? (this._headerScrollContainer = this._headerScrollerR, this._headerRowScrollContainer = this._headerRowScrollerR, this._footerRowScrollContainer = this._footerRowScrollerR, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomR, this._viewportScrollContainerY = this._viewportTopR) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomR : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopR) : (this._headerScrollContainer = this._headerScrollerL, this._headerRowScrollContainer = this._headerRowScrollerL, this._footerRowScrollContainer = this._footerRowScrollerL, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomL, this._viewportScrollContainerY = this._viewportTopL) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomL : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopL);
    }
    measureCellPaddingAndBorder() {
      let h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = this._headers[0];
      this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0, this.cellWidthDiff = this.cellHeightDiff = 0;
      let el = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
      style.boxSizing !== "border-box" && (h.forEach((val) => this.headerColumnWidthDiff += Utils.toFloat(style[val])), v.forEach((val) => this.headerColumnHeightDiff += Utils.toFloat(style[val]))), el.remove();
      let r = Utils.createDomElement("div", { className: "slick-row" }, this._canvas[0]);
      el = Utils.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden" }, textContent: "-" }, r), style = getComputedStyle(el), style.boxSizing !== "border-box" && (h.forEach((val) => this.cellWidthDiff += Utils.toFloat(style[val])), v.forEach((val) => this.cellHeightDiff += Utils.toFloat(style[val]))), r.remove(), this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
    }
    createCssRules() {
      this._style = document.createElement("style"), this._style.nonce = this._options.nonce || "", (this._options.shadowRoot || document.head).appendChild(this._style);
      let rowHeight = this._options.rowHeight - this.cellHeightDiff, rules = [
        `.${this.uid} .slick-group-header-column { left: 1000px; }`,
        `.${this.uid} .slick-header-column { left: 1000px; }`,
        `.${this.uid} .slick-top-panel { height: ${this._options.topPanelHeight}px; }`,
        `.${this.uid} .slick-preheader-panel { height: ${this._options.preHeaderPanelHeight}px; }`,
        `.${this.uid} .slick-headerrow-columns { height: ${this._options.headerRowHeight}px; }`,
        `.${this.uid} .slick-footerrow-columns { height: ${this._options.footerRowHeight}px; }`,
        `.${this.uid} .slick-cell { height: ${rowHeight}px; }`,
        `.${this.uid} .slick-row { height: ${this._options.rowHeight}px; }`
      ], sheet = this._style.sheet;
      if (sheet) {
        for (let rule of rules)
          sheet.insertRule(rule);
        for (let i = 0; i < this.columns.length; i++)
          !this.columns[i] || this.columns[i].hidden || (sheet.insertRule(`.${this.uid} .l${i} { }`), sheet.insertRule(`.${this.uid} .r${i} { }`));
      } else
        this.createCssRulesAlternative(rules);
    }
    /** Create CSS rules via template in case the first approach with createElement('style') doesn't work */
    createCssRulesAlternative(rules) {
      let template = document.createElement("template");
      template.innerHTML = '<style type="text/css" rel="stylesheet" />', this._style = template.content.firstChild, (this._options.shadowRoot || document.head).appendChild(this._style);
      for (let i = 0; i < this.columns.length; i++)
        !this.columns[i] || this.columns[i].hidden || (rules.push(`.${this.uid} .l${i} { }`), rules.push(`.${this.uid} .r${i} { }`));
      this._style.styleSheet ? this._style.styleSheet.cssText = rules.join(" ") : this._style.appendChild(document.createTextNode(rules.join(" ")));
    }
    getColumnCssRules(idx) {
      var _a;
      let i;
      if (!this.stylesheet) {
        let sheets = (this._options.shadowRoot || document).styleSheets;
        for (this.options.devMode && typeof ((_a = this.options.devMode) == null ? void 0 : _a.ownerNodeIndex) == "number" && this.options.devMode.ownerNodeIndex >= 0 && (sheets[this.options.devMode.ownerNodeIndex].ownerNode = this._style), i = 0; i < sheets.length; i++)
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
    removeCssRules() {
      var _a;
      (_a = this._style) == null || _a.remove(), this.stylesheet = null;
    }
    /**
     * Destroy (dispose) of SlickGrid
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
      }), this._preHeaderPanelScroller && this._bindingEventService.unbindByEventName(this._preHeaderPanelScroller, "scroll"), this._bindingEventService.unbindByEventName(this._focusSink, "keydown"), this._bindingEventService.unbindByEventName(this._focusSink2, "keydown");
      let resizeHandles = this._container.querySelectorAll(".slick-resizable-handle");
      [].forEach.call(resizeHandles, (handle) => {
        this._bindingEventService.unbindByEventName(handle, "dblclick");
      });
      let headerColumns = this._container.querySelectorAll(".slick-header-column");
      [].forEach.call(headerColumns, (column) => {
        this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave"), this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave");
      }), Utils.emptyElement(this._container), this._container.classList.remove(this.uid), shouldDestroyAllElements && this.destroyAllElements();
    }
    /**
     * call destroy method, when exists, on all the instance(s) it found
     * @params instances - can be a single instance or a an array of instances
     */
    destroyAllInstances(inputInstances) {
      if (inputInstances) {
        let instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance;
        for (; Utils.isDefined(instance = instances.pop()); )
          instance && typeof instance.destroy == "function" && instance.destroy();
      }
      return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
    }
    destroyAllElements() {
      this._activeCanvasNode = null, this._activeViewportNode = null, this._boundAncestors = null, this._canvas = null, this._canvasTopL = null, this._canvasTopR = null, this._canvasBottomL = null, this._canvasBottomR = null, this._container = null, this._focusSink = null, this._focusSink2 = null, this._groupHeaders = null, this._groupHeadersL = null, this._groupHeadersR = null, this._headerL = null, this._headerR = null, this._headers = null, this._headerRows = null, this._headerRowL = null, this._headerRowR = null, this._headerRowSpacerL = null, this._headerRowSpacerR = null, this._headerRowScrollContainer = null, this._headerRowScroller = null, this._headerRowScrollerL = null, this._headerRowScrollerR = null, this._headerScrollContainer = null, this._headerScroller = null, this._headerScrollerL = null, this._headerScrollerR = null, this._hiddenParents = null, this._footerRow = null, this._footerRowL = null, this._footerRowR = null, this._footerRowSpacerL = null, this._footerRowSpacerR = null, this._footerRowScroller = null, this._footerRowScrollerL = null, this._footerRowScrollerR = null, this._footerRowScrollContainer = null, this._preHeaderPanel = null, this._preHeaderPanelR = null, this._preHeaderPanelScroller = null, this._preHeaderPanelScrollerR = null, this._preHeaderPanelSpacer = null, this._preHeaderPanelSpacerR = null, this._topPanels = null, this._topPanelScrollers = null, this._style = null, this._topPanelScrollerL = null, this._topPanelScrollerR = null, this._topPanelL = null, this._topPanelR = null, this._paneHeaderL = null, this._paneHeaderR = null, this._paneTopL = null, this._paneTopR = null, this._paneBottomL = null, this._paneBottomR = null, this._viewport = null, this._viewportTopL = null, this._viewportTopR = null, this._viewportBottomL = null, this._viewportBottomR = null, this._viewportScrollContainerX = null, this._viewportScrollContainerY = null;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Column Autosizing
    //////////////////////////////////////////////////////////////////////////////////////////////
    /** Proportionally resize a specific column by its name, index or Id */
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
    treatAsLocked(autoSize = {}) {
      var _a;
      return !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && ((_a = autoSize.widthPx) != null ? _a : 0) < 100;
    }
    /** Proportionately resizes all columns to fill available horizontal space. This does not take the cell contents into consideration. */
    autosizeColumns(autosizeMode, isInit) {
      this.cacheCssForHiddenInit(), this.internalAutosizeColumns(autosizeMode, isInit), this.restoreCssFromHiddenInit();
    }
    internalAutosizeColumns(autosizeMode, isInit) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
      if (autosizeMode = autosizeMode || this._options.autosizeColsMode, autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
        this.legacyAutosizeColumns();
        return;
      }
      if (autosizeMode === GridAutosizeColsMode.None)
        return;
      this.canvas = document.createElement("canvas"), (_a = this.canvas) != null && _a.getContext && (this.canvas_context = this.canvas.getContext("2d"));
      let gridCanvas = this.getCanvasNode(0, 0), viewportWidth = this.viewportHasVScroll ? this.viewportW - ((_c = (_b = this.scrollbarDimensions) == null ? void 0 : _b.width) != null ? _c : 0) : this.viewportW, i, c, colWidth, reRender = !1, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
      for (i = 0; i < this.columns.length; i++)
        c = this.columns[i], this.getColAutosizeWidth(c, i, gridCanvas, isInit || !1, i), totalLockedColWidth += ((_d = c.autoSize) == null ? void 0 : _d.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) && ((_e = c.autoSize) == null ? void 0 : _e.widthPx) || 0, totalMinWidth += ((_f = c.autoSize) == null ? void 0 : _f.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) ? ((_g = c.autoSize) == null ? void 0 : _g.widthPx) || 0 : c.minWidth || 0, totalWidth += ((_h = c.autoSize) == null ? void 0 : _h.widthPx) || 0, totalWidthLessSTR += (_i = c.autoSize) != null && _i.sizeToRemaining ? 0 : ((_j = c.autoSize) == null ? void 0 : _j.widthPx) || 0, strColsMinWidth += (_k = c.autoSize) != null && _k.sizeToRemaining && c.minWidth || 0;
      let strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
      if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
        let setWidth = totalWidth + ((_m = (_l = this.scrollbarDimensions) == null ? void 0 : _l.width) != null ? _m : 0);
        autosizeMode = GridAutosizeColsMode.IgnoreViewport, this._options.viewportMaxWidthPx && setWidth > this._options.viewportMaxWidthPx ? (setWidth = this._options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport) : this._options.viewportMinWidthPx && setWidth < this._options.viewportMinWidthPx && (setWidth = this._options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport), Utils.width(this._container, setWidth);
      }
      if (autosizeMode === GridAutosizeColsMode.FitColsToViewport)
        if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth)
          for (i = 0; i < this.columns.length; i++) {
            if (c = this.columns[i], !c || c.hidden)
              continue;
            let totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
            (_n = c.autoSize) != null && _n.sizeToRemaining ? colWidth = totalSTRViewportWidth * (((_o = c.autoSize) == null ? void 0 : _o.widthPx) || 0) / strColTotalGuideWidth : colWidth = ((_p = c.autoSize) == null ? void 0 : _p.widthPx) || 0, c.rerenderOnResize && (c.width || 0) !== colWidth && (reRender = !0), c.width = colWidth;
          }
        else if (this._options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * this._options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
          autosizeMode = GridAutosizeColsMode.IgnoreViewport;
        else {
          let unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
          for (i = 0; i < this.columns.length; i++)
            c = this.columns[i], !(!c || c.hidden) && (colWidth = c.width || 0, ((_q = c.autoSize) == null ? void 0 : _q.autosizeMode) !== ColAutosizeMode.Locked && !this.treatAsLocked(c.autoSize) && ((_r = c.autoSize) != null && _r.sizeToRemaining ? colWidth = c.minWidth || 0 : (colWidth = unallocatedViewportWidth / unallocatedColWidth * (((_s = c.autoSize) == null ? void 0 : _s.widthPx) || 0) - 1, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0), unallocatedColWidth -= ((_t = c.autoSize) == null ? void 0 : _t.widthPx) || 0, unallocatedViewportWidth -= colWidth)), this.treatAsLocked(c.autoSize) && (colWidth = ((_u = c.autoSize) == null ? void 0 : _u.widthPx) || 0, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0)), c.rerenderOnResize && c.width !== colWidth && (reRender = !0), c.width = colWidth);
        }
      if (autosizeMode === GridAutosizeColsMode.IgnoreViewport)
        for (i = 0; i < this.columns.length; i++)
          !this.columns[i] || this.columns[i].hidden || (colWidth = ((_v = this.columns[i].autoSize) == null ? void 0 : _v.widthPx) || 0, this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth && (reRender = !0), this.columns[i].width = colWidth);
      this.reRenderColumns(reRender);
    }
    LogColWidths() {
      let s = "Col Widths:";
      for (let i = 0; i < this.columns.length; i++)
        s += " " + (this.columns[i].hidden ? "H" : this.columns[i].width);
      console.log(s);
    }
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
    getColHeaderWidth(columnDef) {
      let width = 0, headerColElId = this.getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = `${headerColElId}_`, clone = headerColEl.cloneNode(!0);
      if (headerColEl)
        clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width = clone.offsetWidth, clone.parentNode.removeChild(clone);
      else {
        let header = this.getHeader(columnDef);
        headerColEl = Utils.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header);
        let colNameElm = Utils.createDomElement("span", { className: "slick-column-name" }, headerColEl);
        this.applyHtmlCode(colNameElm, columnDef.name), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", columnDef.headerCssClass && headerColEl.classList.add(...(columnDef.headerCssClass || "").split(" ")), width = headerColEl.offsetWidth, header.removeChild(headerColEl);
      }
      return width;
    }
    legacyAutosizeColumns() {
      var _a, _b;
      let i, c, shrinkLeeway = 0, total = 0, prevTotal = 0, widths = [], availWidth = this.viewportHasVScroll ? this.viewportW - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.width) != null ? _b : 0) : this.viewportW;
      for (i = 0; i < this.columns.length; i++)
        c = this.columns[i], !(!c || c.hidden) && (widths.push(c.width || 0), total += c.width || 0, c.resizable && (shrinkLeeway += (c.width || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth)));
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
    getVisibleColumns() {
      return this.columns.filter((c) => !c.hidden);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // General
    //////////////////////////////////////////////////////////////////////////////////////////////
    trigger(evt, args, e) {
      let event = e || new SlickEventData(e, args), eventArgs = args || {};
      return eventArgs.grid = this, evt.notify(eventArgs, event, this);
    }
    /** Get Editor lock */
    getEditorLock() {
      return this._options.editorLock;
    }
    /** Get Editor Controller */
    getEditController() {
      return this.editController;
    }
    /**
     * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
     * @param {String | Number} id A column id.
     */
    getColumnIndex(id) {
      return this.columnsById[id];
    }
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
    applyColumnWidths() {
      var _a;
      let x = 0, w = 0, rule;
      for (let i = 0; i < this.columns.length; i++)
        (_a = this.columns[i]) != null && _a.hidden || (w = this.columns[i].width || 0, rule = this.getColumnCssRules(i), rule.left.style.left = `${x}px`, rule.right.style.right = (this._options.frozenColumn !== -1 && i > this._options.frozenColumn ? this.canvasWidthR : this.canvasWidthL) - x - w + "px", this._options.frozenColumn !== i && (x += this.columns[i].width)), this._options.frozenColumn === i && (x = 0);
    }
    /**
     * Accepts a columnId string and an ascending boolean. Applies a sort glyph in either ascending or descending form to the header of the column. Note that this does not actually sort the column. It only adds the sort glyph to the header.
     * @param {String | Number} columnId
     * @param {Boolean} ascending
     */
    setSortColumn(columnId, ascending) {
      this.setSortColumns([{ columnId, sortAsc: ascending }]);
    }
    /**
     * Get column by index
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
     * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ]. When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array. Note that this does not actually sort the column. It only adds the sort glyph to the header
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
    /** Get sorted columns **/
    getSortColumns() {
      return this.sortColumns;
    }
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
        let caller = (_b = (_a = ne == null ? void 0 : ne.detail) == null ? void 0 : _a.caller) != null ? _b : "click", newSelectedAdditions = this.getSelectedRows().filter((i) => previousSelectedRows.indexOf(i) < 0), newSelectedDeletions = previousSelectedRows.filter((i) => this.getSelectedRows().indexOf(i) < 0);
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
    simpleArrayEquals(arr1, arr2) {
      return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
    }
    /** Returns an array of column definitions. */
    getColumns() {
      return this.columns;
    }
    updateColumnCaches() {
      this.columnPosLeft = [], this.columnPosRight = [];
      let x = 0;
      for (let i = 0, ii = this.columns.length; i < ii; i++)
        !this.columns[i] || this.columns[i].hidden || (this.columnPosLeft[i] = x, this.columnPosRight[i] = x + (this.columns[i].width || 0), this._options.frozenColumn === i ? x = 0 : x += this.columns[i].width || 0);
    }
    updateColumnProps() {
      this.columnsById = {};
      for (let i = 0; i < this.columns.length; i++) {
        let m = this.columns[i];
        m.width && (m.widthRequest = m.width), this.options.mixinDefaults ? (Utils.applyDefaults(m, this._columnDefaults), m.autoSize || (m.autoSize = {}), Utils.applyDefaults(m.autoSize, this._columnAutosizeDefaults)) : (m = this.columns[i] = Utils.extend({}, this._columnDefaults, m), m.autoSize = Utils.extend({}, this._columnAutosizeDefaults, m.autoSize)), this.columnsById[m.id] = i, m.minWidth && (m.width || 0) < m.minWidth && (m.width = m.minWidth), m.maxWidth && (m.width || 0) > m.maxWidth && (m.width = m.maxWidth);
      }
    }
    /**
     * Sets grid columns. Column headers will be recreated and all rendered rows will be removed. To rerender the grid (if necessary), call render().
     * @param {Column[]} columnDefinitions An array of column definitions.
     */
    setColumns(columnDefinitions) {
      this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns: columnDefinitions, grid: this }), this.columns = columnDefinitions, this.updateColumnsInternal();
    }
    updateColumns() {
      this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this }), this.updateColumnsInternal();
    }
    updateColumnsInternal() {
      var _a;
      this.updateColumnProps(), this.updateColumnCaches(), this.initialized && (this.setPaneVisibility(), this.setOverflow(), this.invalidateAllRows(), this.createColumnHeaders(), this.createColumnFooter(), this.removeCssRules(), this.createCssRules(), this.resizeCanvas(), this.updateCanvasWidth(), this.applyColumnHeaderWidths(), this.applyColumnWidths(), this.handleScroll(), (_a = this.getSelectionModel()) == null || _a.refreshSelections());
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
      this.prepareForOptionsChange(), this._options.enableAddRow !== newOptions.enableAddRow && this.invalidateRow(this.getDataLength()), newOptions.frozenColumn && (this.getViewports().forEach((vp) => vp.scrollLeft = 0), this.handleScroll());
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
    prepareForOptionsChange() {
      this.getEditorLock().commitCurrentEdit() && this.makeActiveCellNormal();
    }
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
    validateAndEnforceOptions() {
      this._options.autoHeight && (this._options.leaveSpaceForNewRows = !1), this._options.forceFitColumns && (this._options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit, console.log("forceFitColumns option is deprecated - use autosizeColsMode"));
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
    /** Get Grid Canvas Node DOM Element */
    getContainerNode() {
      return this._container;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering / Scrolling
    getRowTop(row) {
      return this._options.rowHeight * row - this.offset;
    }
    getRowFromPosition(y) {
      return Math.floor((y + this.offset) / this._options.rowHeight);
    }
    /**
     * Scroll to an Y position in the grid
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
    defaultFormatter(_row, _cell, value) {
      return Utils.isDefined(value) ? (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    }
    getFormatter(row, column) {
      var _a, _b, _c;
      let rowMetadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row), columnOverrides = (rowMetadata == null ? void 0 : rowMetadata.columns) && (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]);
      return (columnOverrides == null ? void 0 : columnOverrides.formatter) || (rowMetadata == null ? void 0 : rowMetadata.formatter) || column.formatter || ((_c = this._options.formatterFactory) == null ? void 0 : _c.getFormatter(column)) || this._options.defaultFormatter;
    }
    getEditor(row, cell) {
      var _a, _b, _c, _d, _e, _f;
      let column = this.columns[cell], rowMetadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row), columnMetadata = rowMetadata == null ? void 0 : rowMetadata.columns;
      return ((_c = columnMetadata == null ? void 0 : columnMetadata[column.id]) == null ? void 0 : _c.editor) !== void 0 ? columnMetadata[column.id].editor : ((_d = columnMetadata == null ? void 0 : columnMetadata[cell]) == null ? void 0 : _d.editor) !== void 0 ? columnMetadata[cell].editor : column.editor || ((_f = (_e = this._options) == null ? void 0 : _e.editorFactory) == null ? void 0 : _f.getEditor(column));
    }
    getDataItemValueForColumn(item, columnDef) {
      return this._options.dataItemColumnValueExtractor ? this._options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
    }
    appendRowHtml(divArrayL, divArrayR, row, range, dataLength) {
      var _a, _b;
      let d = this.getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (this.hasFrozenRows && row <= this._options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === this.activeRow && this._options.showCellSelection ? " active" : "") + (row % 2 === 1 ? " odd" : " even");
      d || (rowCss += " " + this._options.addNewRowCssClass);
      let metadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row);
      metadata != null && metadata.cssClasses && (rowCss += " " + metadata.cssClasses);
      let frozenRowOffset = this.getFrozenRowOffset(row), rowDiv = Utils.createDomElement("div", { className: `ui-widget-content ${rowCss}`, style: { top: `${this.getRowTop(row) - frozenRowOffset}px` } }), rowDivR;
      divArrayL.push(rowDiv), this.hasFrozenColumns() && (rowDivR = rowDiv.cloneNode(!0), divArrayR.push(rowDivR));
      let colspan, m;
      for (let i = 0, ii = this.columns.length; i < ii; i++)
        if (m = this.columns[i], !(!m || m.hidden)) {
          if (colspan = 1, metadata != null && metadata.columns) {
            let columnData = metadata.columns[m.id] || metadata.columns[i];
            colspan = (columnData == null ? void 0 : columnData.colspan) || 1, colspan === "*" && (colspan = ii - i);
          }
          if (this.columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
            if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx)
              break;
            this.hasFrozenColumns() && i > this._options.frozenColumn ? this.appendCellHtml(rowDivR, row, i, colspan, d) : this.appendCellHtml(rowDiv, row, i, colspan, d);
          } else
            (m.alwaysRenderColumn || this.hasFrozenColumns() && i <= this._options.frozenColumn) && this.appendCellHtml(rowDiv, row, i, colspan, d);
          colspan > 1 && (i += colspan - 1);
        }
    }
    appendCellHtml(divRow, row, cell, colspan, item) {
      var _a;
      let m = this.columns[cell], cellCss = "slick-cell l" + cell + " r" + Math.min(this.columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
      this.hasFrozenColumns() && cell <= this._options.frozenColumn && (cellCss += " frozen"), row === this.activeRow && cell === this.activeCell && this._options.showCellSelection && (cellCss += " active");
      for (let key in this.cellCssClasses)
        (_a = this.cellCssClasses[key][row]) != null && _a[m.id] && (cellCss += " " + this.cellCssClasses[key][row][m.id]);
      let value = null, formatterResult = "";
      item && (value = this.getDataItemValueForColumn(item, m), formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this), formatterResult == null && (formatterResult = ""));
      let appendCellResult = this.trigger(this.onBeforeAppendCell, { row, cell, value, dataContext: item }).getReturnValue(), addlCssClasses = typeof appendCellResult == "string" ? appendCellResult : "";
      formatterResult != null && formatterResult.addClasses && (addlCssClasses += (addlCssClasses ? " " : "") + formatterResult.addClasses);
      let toolTipText = formatterResult != null && formatterResult.toolTip ? `${formatterResult.toolTip}` : "", cellDiv = document.createElement("div");
      if (cellDiv.className = `${cellCss} ${addlCssClasses || ""}`.trim(), cellDiv.setAttribute("title", toolTipText), m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object)
        for (let key in m.cellAttrs)
          m.cellAttrs.hasOwnProperty(key) && cellDiv.setAttribute(key, m.cellAttrs[key]);
      if (item) {
        let cellResult = Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.html || formatterResult.text;
        this.applyHtmlCode(cellDiv, cellResult);
      }
      divRow.appendChild(cellDiv), formatterResult.insertElementAfterTarget && Utils.insertAfterElement(cellDiv, formatterResult.insertElementAfterTarget), this.rowsCache[row].cellRenderQueue.push(cell), this.rowsCache[row].cellColSpans[cell] = colspan;
    }
    cleanupRows(rangeToKeep) {
      for (let rowId in this.rowsCache)
        if (this.rowsCache) {
          let i = +rowId, removeFrozenRow = !0;
          this.hasFrozenRows && (this._options.frozenBottom && i >= this.actualFrozenRow || !this._options.frozenBottom && i <= this.actualFrozenRow) && (removeFrozenRow = !1), (i = parseInt(rowId, 10)) !== this.activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom) && removeFrozenRow && this.removeRowFromCache(i);
        }
      this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
    }
    /** Invalidate all grid rows and re-render the grid rows */
    invalidate() {
      this.updateRowCount(), this.invalidateAllRows(), this.render();
    }
    /** Invalidate all grid rows */
    invalidateAllRows() {
      this.currentEditor && this.makeActiveCellNormal();
      for (let row in this.rowsCache)
        this.rowsCache && this.removeRowFromCache(+row);
      this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
    }
    /**
     * Invalidate a specific set of row numbers
     * @param {Number[]} rows
     */
    invalidateRows(rows) {
      if (!rows || !rows.length)
        return;
      this.vScrollDir = 0;
      let rl = rows.length;
      for (let i = 0; i < rl; i++)
        this.currentEditor && this.activeRow === rows[i] && this.makeActiveCellNormal(), this.rowsCache[rows[i]] && this.removeRowFromCache(rows[i]);
      this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
    }
    /**
     * Invalidate a specific row number
     * @param {Number} row
     */
    invalidateRow(row) {
      !row && row !== 0 || this.invalidateRows([row]);
    }
    queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
      var _a;
      this.postProcessgroupId++;
      for (let columnIdx in postProcessedRow)
        postProcessedRow.hasOwnProperty(columnIdx) && this.postProcessedCleanupQueue.push({
          actionType: "C",
          groupId: this.postProcessgroupId,
          node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
          columnIdx: +columnIdx,
          rowIdx
        });
      cacheEntry.rowNode || (cacheEntry.rowNode = []), this.postProcessedCleanupQueue.push({
        actionType: "R",
        groupId: this.postProcessgroupId,
        node: cacheEntry.rowNode
      }), (_a = cacheEntry.rowNode) == null || _a.forEach((node) => node.remove());
    }
    queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
      this.postProcessedCleanupQueue.push({
        actionType: "C",
        groupId: this.postProcessgroupId,
        node: cellnode,
        columnIdx,
        rowIdx
      }), cellnode.remove();
    }
    removeRowFromCache(row) {
      var _a;
      let cacheEntry = this.rowsCache[row];
      !cacheEntry || !cacheEntry.rowNode || (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row] ? this.queuePostProcessedRowForCleanup(cacheEntry, this.postProcessedRows[row], row) : (_a = cacheEntry.rowNode) == null || _a.forEach((node) => {
        var _a2;
        return (_a2 = node.parentElement) == null ? void 0 : _a2.removeChild(node);
      }), delete this.rowsCache[row], delete this.postProcessedRows[row], this.renderedRows--, this.counter_rows_removed++);
    }
    /** Apply a Formatter Result to a Cell DOM Node */
    applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
      if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
        this.applyHtmlCode(cellNode, formatterResult);
        return;
      }
      let formatterVal = formatterResult.html || formatterResult.text;
      this.applyHtmlCode(cellNode, formatterVal), formatterResult.removeClasses && !suppressRemove && formatterResult.removeClasses.split(" ").forEach((c) => cellNode.classList.remove(c)), formatterResult.addClasses && formatterResult.addClasses.split(" ").forEach((c) => cellNode.classList.add(c)), formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
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
      for (let colIdx in cacheEntry.cellNodesByColumnIdx) {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx))
          continue;
        let columnIdx = +colIdx, m = this.columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
        row === this.activeRow && columnIdx === this.activeCell && this.currentEditor ? this.currentEditor.loadValue(d) : d ? (formatterResult = this.getFormatter(row, m)(row, columnIdx, this.getDataItemValueForColumn(d, m), m, d, this), this.applyFormatResultToCellNode(formatterResult, node)) : Utils.emptyElement(node);
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
      var _a, _b;
      let vh = this.getViewportHeight(), scrollbarHeight = (_b = (_a = this.getScrollbarDimensions()) == null ? void 0 : _a.height) != null ? _b : 0;
      return Math.floor((vh - scrollbarHeight) / this._options.rowHeight);
    }
    getViewportHeight() {
      var _a, _b;
      if ((!this._options.autoHeight || this._options.frozenColumn !== -1) && (this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight + this.getVBoxDelta(this._topPanelScrollers[0]) : 0, this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, this.footerRowH = this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0), this._options.autoHeight) {
        let fullHeight = this._paneHeaderL.offsetHeight;
        fullHeight += this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, fullHeight += this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0, fullHeight += this.getCanvasWidth() > this.viewportW && (_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0, this.viewportH = this._options.rowHeight * this.getDataLengthIncludingAddNew() + (this._options.frozenColumn === -1 ? fullHeight : 0);
      } else {
        let columnNamesH = this._options.showColumnHeader ? Utils.toFloat(Utils.height(this._headerScroller[0])) + this.getVBoxDelta(this._headerScroller[0]) : 0, preHeaderH = this._options.createPreHeaderPanel && this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight + this.getVBoxDelta(this._preHeaderPanelScroller) : 0, style = getComputedStyle(this._container);
        this.viewportH = Utils.toFloat(style.height) - Utils.toFloat(style.paddingTop) - Utils.toFloat(style.paddingBottom) - columnNamesH - this.topPanelH - this.headerRowH - this.footerRowH - preHeaderH;
      }
      return this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight), this.viewportH;
    }
    getViewportWidth() {
      return this.viewportW = parseFloat(Utils.innerSize(this._container, "width")) || this.options.devMode && this.options.devMode.containerClientWidth || 0, this.viewportW;
    }
    /** Execute a Resize of the Grid Canvas */
    resizeCanvas() {
      var _a, _b, _c, _d, _e, _f;
      if (!this.initialized)
        return;
      if (this.paneTopH = 0, this.paneBottomH = 0, this.viewportTopH = 0, this.viewportBottomH = 0, this.getViewportWidth(), this.getViewportHeight(), this.hasFrozenRows ? this._options.frozenBottom ? (this.paneTopH = this.viewportH - this.frozenRowsHeight - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0), this.paneBottomH = this.frozenRowsHeight + ((_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.height) != null ? _d : 0)) : (this.paneTopH = this.frozenRowsHeight, this.paneBottomH = this.viewportH - this.frozenRowsHeight) : this.paneTopH = this.viewportH, this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH, this.hasFrozenColumns() && this._options.autoHeight && (this.paneTopH += (_f = (_e = this.scrollbarDimensions) == null ? void 0 : _e.height) != null ? _f : 0), this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH, this._options.autoHeight) {
        if (this.hasFrozenColumns()) {
          let style = getComputedStyle(this._headerScrollerL);
          Utils.height(this._container, this.paneTopH + Utils.toFloat(style.height));
        }
        this._paneTopL.style.position = "relative";
      }
      Utils.setStyleSize(this._paneTopL, "top", Utils.height(this._paneHeaderL) || (this._options.showHeaderRow ? this._options.headerRowHeight : 0) + (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight : 0)), Utils.height(this._paneTopL, this.paneTopH);
      let paneBottomTop = this._paneTopL.offsetTop + this.paneTopH;
      this._options.autoHeight || Utils.height(this._viewportTopL, this.viewportTopH), this.hasFrozenColumns() ? (Utils.setStyleSize(this._paneTopR, "top", Utils.height(this._paneHeaderL)), Utils.height(this._paneTopR, this.paneTopH), Utils.height(this._viewportTopR, this.viewportTopH), this.hasFrozenRows && (Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomR, "top", paneBottomTop), Utils.height(this._paneBottomR, this.paneBottomH), Utils.height(this._viewportBottomR, this.paneBottomH))) : this.hasFrozenRows && (Utils.width(this._paneBottomL, "100%"), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop)), this.hasFrozenRows ? (Utils.height(this._viewportBottomL, this.paneBottomH), this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.frozenRowsHeight)) : (Utils.height(this._canvasTopL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasTopR, this.frozenRowsHeight))) : Utils.height(this._viewportTopR, this.viewportTopH), (!this.scrollbarDimensions || !this.scrollbarDimensions.width) && (this.scrollbarDimensions = this.measureScrollbar()), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && this.autosizeColumns(), this.updateRowCount(), this.handleScroll(), this.lastRenderedScrollLeft = -1, this.render();
    }
    /**
     * Update paging information status from the View
     * @param {PagingInfo} pagingInfo
     */
    updatePagingStatusFromView(pagingInfo) {
      this.pagingActive = pagingInfo.pageSize !== 0, this.pagingIsLastPage = pagingInfo.pageNum === pagingInfo.totalPages - 1;
    }
    /** Update the dataset row count */
    updateRowCount() {
      var _a, _b, _c, _d;
      if (!this.initialized)
        return;
      let dataLength = this.getDataLength(), dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = this.hasFrozenRows && !this._options.frozenBottom ? Utils.height(this._canvasBottomL) : Utils.height(this._canvasTopL);
      this.hasFrozenRows ? numberOfRows = this.getDataLength() - this._options.frozenRow : numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);
      let tempViewportH = Utils.height(this._viewportScrollContainerY), oldViewportHasVScroll = this.viewportHasVScroll;
      this.viewportHasVScroll = this._options.alwaysShowVerticalScroll || !this._options.autoHeight && numberOfRows * this._options.rowHeight > tempViewportH, this.makeActiveCellNormal();
      let r1 = dataLength - 1;
      for (let i in this.rowsCache)
        Number(i) > r1 && this.removeRowFromCache(+i);
      this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup(), this.activeCellNode && this.activeRow > r1 && this.resetActiveCell(), oldH = this.h, this._options.autoHeight ? this.h = this._options.rowHeight * numberOfRows : (this.th = Math.max(this._options.rowHeight * numberOfRows, tempViewportH - ((_b = (_a = this.scrollbarDimensions) == null ? void 0 : _a.height) != null ? _b : 0)), this.th < this.maxSupportedCssHeight ? (this.h = this.ph = this.th, this.n = 1, this.cj = 0) : (this.h = this.maxSupportedCssHeight, this.ph = this.h / 100, this.n = Math.floor(this.th / this.ph), this.cj = (this.th - this.h) / (this.n - 1))), (this.h !== oldH || this.enforceFrozenRowHeightRecalc) && (this.hasFrozenRows && !this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.h), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.h)) : (Utils.height(this._canvasTopL, this.h), Utils.height(this._canvasTopR, this.h)), this.scrollTop = this._viewportScrollContainerY.scrollTop, this.enforceFrozenRowHeightRecalc = !1);
      let oldScrollTopInRange = this.scrollTop + this.offset <= this.th - tempViewportH;
      this.th === 0 || this.scrollTop === 0 ? this.page = this.offset = 0 : oldScrollTopInRange ? this.scrollTo(this.scrollTop + this.offset) : this.scrollTo(this.th - tempViewportH + ((_d = (_c = this.scrollbarDimensions) == null ? void 0 : _c.height) != null ? _d : 0)), this.h !== oldH && this._options.autoHeight && this.resizeCanvas(), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll !== this.viewportHasVScroll && this.autosizeColumns(), this.updateCanvasWidth(!1);
    }
    /** @alias `getVisibleRange` */
    getViewport(viewportTop, viewportLeft) {
      return this.getVisibleRange(viewportTop, viewportLeft);
    }
    getVisibleRange(viewportTop, viewportLeft) {
      return viewportTop != null || (viewportTop = this.scrollTop), viewportLeft != null || (viewportLeft = this.scrollLeft), {
        top: this.getRowFromPosition(viewportTop),
        bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
        leftPx: viewportLeft,
        rightPx: viewportLeft + this.viewportW
      };
    }
    /** Get rendered range */
    getRenderedRange(viewportTop, viewportLeft) {
      let range = this.getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(this.viewportH / this._options.rowHeight), minBuffer = this._options.minRowBuffer;
      return this.vScrollDir === -1 ? (range.top -= buffer, range.bottom += minBuffer) : this.vScrollDir === 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(this.getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= this.viewportW, range.rightPx += this.viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(this.canvasWidth, range.rightPx), range;
    }
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
    cleanUpCells(range, row) {
      var _a, _b;
      if (this.hasFrozenRows && (this._options.frozenBottom && row > this.actualFrozenRow || row <= this.actualFrozenRow))
        return;
      let totalCellsRemoved = 0, cacheEntry = this.rowsCache[row], cellsToRemove = [];
      for (let cellNodeIdx in cacheEntry.cellNodesByColumnIdx) {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx))
          continue;
        let i = +cellNodeIdx;
        if (i <= this._options.frozenColumn || Array.isArray(this.columns) && this.columns[i] && this.columns[i].alwaysRenderColumn)
          continue;
        let colspan = cacheEntry.cellColSpans[i];
        (this.columnPosLeft[i] > range.rightPx || this.columnPosRight[Math.min(this.columns.length - 1, (i || 0) + colspan - 1)] < range.leftPx) && (row === this.activeRow && Number(i) === this.activeCell || cellsToRemove.push(i));
      }
      let cellToRemove, cellNode;
      for (; Utils.isDefined(cellToRemove = cellsToRemove.pop()); )
        cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], this._options.enableAsyncPostRenderCleanup && ((_a = this.postProcessedRows[row]) != null && _a[cellToRemove]) ? this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : (_b = cellNode.parentElement) == null || _b.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], this.postProcessedRows[row] && delete this.postProcessedRows[row][cellToRemove], totalCellsRemoved++;
    }
    cleanUpAndRenderCells(range) {
      var _a, _b, _c, _d;
      let cacheEntry, divRow = document.createElement("div"), processedRows = [], cellsAdded, totalCellsAdded = 0, colspan;
      for (let row = range.top, btm = range.bottom; row <= btm; row++) {
        if (cacheEntry = this.rowsCache[row], !cacheEntry)
          continue;
        this.ensureCellNodesInRowsCache(row), this.cleanUpCells(range, row), cellsAdded = 0;
        let metadata = (_c = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row)) != null ? _c : {};
        metadata = metadata == null ? void 0 : metadata.columns;
        let d = this.getDataItem(row);
        for (let i = 0, ii = this.columns.length; i < ii; i++) {
          if (!this.columns[i] || this.columns[i].hidden)
            continue;
          if (this.columnPosLeft[i] > range.rightPx)
            break;
          if (Utils.isDefined(colspan = cacheEntry.cellColSpans[i])) {
            i += colspan > 1 ? colspan - 1 : 0;
            continue;
          }
          if (colspan = 1, metadata) {
            let columnData = metadata[this.columns[i].id] || metadata[i];
            colspan = (_d = columnData == null ? void 0 : columnData.colspan) != null ? _d : 1, colspan === "*" && (colspan = ii - i);
          }
          let colspanNb = colspan;
          this.columnPosRight[Math.min(ii - 1, i + colspanNb - 1)] > range.leftPx && (this.appendCellHtml(divRow, row, i, colspanNb, d), cellsAdded++), i += colspanNb > 1 ? colspanNb - 1 : 0;
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
    renderRows(range) {
      var _a, _b, _c, _d;
      let divArrayL = [], divArrayR = [], rows = [], needToReselectCell = !1, dataLength = this.getDataLength();
      for (let i = range.top, ii = range.bottom; i <= ii; i++)
        this.rowsCache[i] || this.hasFrozenRows && this._options.frozenBottom && i === this.getDataLength() || (this.renderedRows++, rows.push(i), this.rowsCache[i] = {
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
        }, this.appendRowHtml(divArrayL, divArrayR, i, range, dataLength), this.activeCellNode && this.activeRow === i && (needToReselectCell = !0), this.counter_rows_rendered++);
      if (!rows.length)
        return;
      let x = document.createElement("div"), xRight = document.createElement("div");
      divArrayL.forEach((elm) => x.appendChild(elm)), divArrayR.forEach((elm) => xRight.appendChild(elm));
      for (let i = 0, ii = rows.length; i < ii; i++)
        this.hasFrozenRows && rows[i] >= this.actualFrozenRow ? this.hasFrozenColumns() ? (_a = this.rowsCache) != null && _a.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasBottomL.appendChild(x.firstChild), this._canvasBottomR.appendChild(xRight.firstChild)) : (_b = this.rowsCache) != null && _b.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasBottomL.appendChild(x.firstChild)) : this.hasFrozenColumns() ? (_c = this.rowsCache) != null && _c.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasTopL.appendChild(x.firstChild), this._canvasTopR.appendChild(xRight.firstChild)) : (_d = this.rowsCache) != null && _d.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasTopL.appendChild(x.firstChild));
      needToReselectCell && (this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell));
    }
    startPostProcessing() {
      this._options.enableAsyncPostRender && (clearTimeout(this.h_postrender), this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay));
    }
    startPostProcessingCleanup() {
      this._options.enableAsyncPostRenderCleanup && (clearTimeout(this.h_postrenderCleanup), this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay));
    }
    invalidatePostProcessingResults(row) {
      for (let columnIdx in this.postProcessedRows[row])
        this.postProcessedRows[row].hasOwnProperty(columnIdx) && (this.postProcessedRows[row][columnIdx] = "C");
      this.postProcessFromRow = Math.min(this.postProcessFromRow, row), this.postProcessToRow = Math.max(this.postProcessToRow, row), this.startPostProcessing();
    }
    updateRowPositions() {
      for (let row in this.rowsCache)
        if (this.rowsCache) {
          let rowNumber = row ? parseInt(row, 10) : 0;
          Utils.setStyleSize(this.rowsCache[rowNumber].rowNode[0], "top", this.getRowTop(rowNumber));
        }
    }
    /** (re)Render the grid */
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
      })), this.postProcessFromRow = visible.top, this.postProcessToRow = Math.min(this.getDataLengthIncludingAddNew() - 1, visible.bottom), this.startPostProcessing(), this.lastRenderedScrollTop = this.scrollTop, this.lastRenderedScrollLeft = this.scrollLeft, this.h_render = null, this.trigger(this.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: this });
    }
    handleHeaderRowScroll() {
      let scrollLeft = this._headerRowScrollContainer.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
    }
    handleFooterRowScroll() {
      let scrollLeft = this._footerRowScrollContainer.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
    }
    handlePreHeaderPanelScroll() {
      this.handleElementScroll(this._preHeaderPanelScroller);
    }
    handleElementScroll(element) {
      let scrollLeft = element.scrollLeft;
      scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
    }
    handleScroll() {
      return this.scrollTop = this._viewportScrollContainerY.scrollTop, this.scrollLeft = this._viewportScrollContainerX.scrollLeft, this._handleScroll(!1);
    }
    _handleScroll(isMouseWheel) {
      let maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight, maxScrollDistanceX = this._viewportScrollContainerY.scrollWidth - this._viewportScrollContainerY.clientWidth;
      maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), this.scrollTop > maxScrollDistanceY && (this.scrollTop = maxScrollDistanceY), this.scrollLeft > maxScrollDistanceX && (this.scrollLeft = maxScrollDistanceX);
      let vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop), hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);
      if (hScrollDist && (this.prevScrollLeft = this.scrollLeft, this._viewportScrollContainerX.scrollLeft = this.scrollLeft, this._headerScrollContainer.scrollLeft = this.scrollLeft, this._topPanelScrollers[0].scrollLeft = this.scrollLeft, this._options.createFooterRow && (this._footerRowScrollContainer.scrollLeft = this.scrollLeft), this._options.createPreHeaderPanel && (this.hasFrozenColumns() ? this._preHeaderPanelScrollerR.scrollLeft = this.scrollLeft : this._preHeaderPanelScroller.scrollLeft = this.scrollLeft), this.hasFrozenColumns() ? (this.hasFrozenRows && (this._viewportTopR.scrollLeft = this.scrollLeft), this._headerRowScrollerR.scrollLeft = this.scrollLeft) : (this.hasFrozenRows && (this._viewportTopL.scrollLeft = this.scrollLeft), this._headerRowScrollerL.scrollLeft = this.scrollLeft)), vScrollDist && !this._options.autoHeight)
        if (this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1, this.prevScrollTop = this.scrollTop, isMouseWheel && (this._viewportScrollContainerY.scrollTop = this.scrollTop), this.hasFrozenColumns() && (this.hasFrozenRows && !this._options.frozenBottom ? this._viewportBottomL.scrollTop = this.scrollTop : this._viewportTopL.scrollTop = this.scrollTop), vScrollDist < this.viewportH)
          this.scrollTo(this.scrollTop + this.offset);
        else {
          let oldOffset = this.offset;
          this.h === this.viewportH ? this.page = 0 : this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.th - this.viewportH) / (this.h - this.viewportH)) * (1 / this.ph))), this.offset = Math.round(this.page * this.cj), oldOffset !== this.offset && this.invalidateAllRows();
        }
      if (hScrollDist || vScrollDist) {
        let dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft), dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
        (dx > 20 || dy > 20) && (this._options.forceSyncScrolling || dy < this.viewportH && dx < this.viewportW ? this.render() : this.scrollThrottle.enqueue(), this.trigger(this.onViewportChanged, {}));
      }
      return this.trigger(this.onScroll, { scrollLeft: this.scrollLeft, scrollTop: this.scrollTop }), !!(hScrollDist || vScrollDist);
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
        blocked = !0, setTimeout(unblock, minPeriod_ms), action.call(this);
      }, unblock = () => {
        queued ? (dequeue(), blockAndExecute()) : blocked = !1;
      };
      return {
        enqueue: enqueue.bind(this),
        dequeue: dequeue.bind(this)
      };
    }
    asyncPostProcessRows() {
      let dataLength = this.getDataLength();
      for (; this.postProcessFromRow <= this.postProcessToRow; ) {
        let row = this.vScrollDir >= 0 ? this.postProcessFromRow++ : this.postProcessToRow--, cacheEntry = this.rowsCache[row];
        if (!(!cacheEntry || row >= dataLength)) {
          this.postProcessedRows[row] || (this.postProcessedRows[row] = {}), this.ensureCellNodesInRowsCache(row);
          for (let colIdx in cacheEntry.cellNodesByColumnIdx) {
            if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx))
              continue;
            let columnIdx = +colIdx, m = this.columns[columnIdx], processedStatus = this.postProcessedRows[row][columnIdx];
            if (m.asyncPostRender && processedStatus !== "R") {
              let node = cacheEntry.cellNodesByColumnIdx[columnIdx];
              node && m.asyncPostRender(node, row, this.getDataItem(row), m, processedStatus === "C"), this.postProcessedRows[row][columnIdx] = "R";
            }
          }
          this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
          return;
        }
      }
    }
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
        this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
      }
    }
    updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      let node, columnId, addedRowHash, removedRowHash;
      for (let row in this.rowsCache)
        if (this.rowsCache) {
          if (removedRowHash = removedHash == null ? void 0 : removedHash[row], addedRowHash = addedHash == null ? void 0 : addedHash[row], removedRowHash)
            for (columnId in removedRowHash)
              (!addedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
          if (addedRowHash)
            for (columnId in addedRowHash)
              (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
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
     * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 100 ms.
     */
    flashCell(row, cell, speed) {
      speed = speed || 250;
      let toggleCellClass = (cellNode, times) => {
        times < 1 || setTimeout(() => {
          times % 2 === 0 ? cellNode.classList.add(this._options.cellFlashingCssClass || "") : cellNode.classList.remove(this._options.cellFlashingCssClass || ""), toggleCellClass(cellNode, times - 1);
        }, speed);
      };
      if (this.rowsCache[row]) {
        let cellNode = this.getCellNode(row, cell);
        cellNode && toggleCellClass(cellNode, 5);
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Interactivity
    handleMouseWheel(e, _delta, deltaX, deltaY) {
      this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - deltaY * this._options.rowHeight), this.scrollLeft = this._viewportScrollContainerX.scrollLeft + deltaX * 10, this._handleScroll(!0) && e.preventDefault();
    }
    handleDragInit(e, dd) {
      let cell = this.getCellFromEvent(e);
      if (!cell || !this.cellExists(cell.row, cell.cell))
        return !1;
      let retval = this.trigger(this.onDragInit, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
    }
    handleDragStart(e, dd) {
      let cell = this.getCellFromEvent(e);
      if (!cell || !this.cellExists(cell.row, cell.cell))
        return !1;
      let retval = this.trigger(this.onDragStart, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
    }
    handleDrag(e, dd) {
      return this.trigger(this.onDrag, dd, e).getReturnValue();
    }
    handleDragEnd(e, dd) {
      this.trigger(this.onDragEnd, dd, e);
    }
    handleKeyDown(e) {
      var _a, _b, _c, _d;
      let handled = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e).isImmediatePropagationStopped();
      if (!handled && !e.shiftKey && !e.altKey) {
        if (this._options.editable && ((_a = this.currentEditor) != null && _a.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
          return;
        e.which === keyCode.HOME ? handled = e.ctrlKey ? this.navigateTop() : this.navigateRowStart() : e.which === keyCode.END && (handled = e.ctrlKey ? this.navigateBottom() : this.navigateRowEnd());
      }
      if (!handled)
        if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
          if (this._options.editable && ((_b = this.currentEditor) != null && _b.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
            return;
          if (e.which === keyCode.ESCAPE) {
            if (!((_c = this.getEditorLock()) != null && _c.isActive()))
              return;
            this.cancelEditAndSetFocus();
          } else
            e.which === keyCode.PAGE_DOWN ? (this.navigatePageDown(), handled = !0) : e.which === keyCode.PAGE_UP ? (this.navigatePageUp(), handled = !0) : e.which === keyCode.LEFT ? handled = this.navigateLeft() : e.which === keyCode.RIGHT ? handled = this.navigateRight() : e.which === keyCode.UP ? handled = this.navigateUp() : e.which === keyCode.DOWN ? handled = this.navigateDown() : e.which === keyCode.TAB ? handled = this.navigateNext() : e.which === keyCode.ENTER && (this._options.editable && (this.currentEditor ? this.activeRow === this.getDataLength() ? this.navigateDown() : this.commitEditAndSetFocus() : (_d = this.getEditorLock()) != null && _d.commitCurrentEdit() && this.makeActiveCellEditable(void 0, void 0, e)), handled = !0);
        } else
          e.which === keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = this.navigatePrev());
      if (handled) {
        e.stopPropagation(), e.preventDefault();
        try {
          e.originalEvent.keyCode = 0;
        } catch (error) {
        }
      }
    }
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
    handleContextMenu(e) {
      let cell = e.target.closest(".slick-cell");
      cell && (this.activeCellNode === cell && this.currentEditor !== null || this.trigger(this.onContextMenu, {}, e));
    }
    handleDblClick(e) {
      let cell = this.getCellFromEvent(e);
      !cell || this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell || (this.trigger(this.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && this._options.editable && this.gotoCell(cell.row, cell.cell, !0, e));
    }
    handleHeaderMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && this.trigger(this.onHeaderMouseEnter, {
        column: c,
        grid: this
      }, e);
    }
    handleHeaderMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && this.trigger(this.onHeaderMouseLeave, {
        column: c,
        grid: this
      }, e);
    }
    handleHeaderRowMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && this.trigger(this.onHeaderRowMouseEnter, {
        column: c,
        grid: this
      }, e);
    }
    handleHeaderRowMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && this.trigger(this.onHeaderRowMouseLeave, {
        column: c,
        grid: this
      }, e);
    }
    handleHeaderContextMenu(e) {
      let header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
      this.trigger(this.onHeaderContextMenu, { column }, e);
    }
    handleHeaderClick(e) {
      if (this.columnResizeDragging)
        return;
      let header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
      column && this.trigger(this.onHeaderClick, { column }, e);
    }
    handleFooterContextMenu(e) {
      let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      this.trigger(this.onFooterContextMenu, { column }, e);
    }
    handleFooterClick(e) {
      let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      this.trigger(this.onFooterClick, { column }, e);
    }
    handleCellMouseOver(e) {
      this.trigger(this.onMouseEnter, {}, e);
    }
    handleCellMouseOut(e) {
      this.trigger(this.onMouseLeave, {}, e);
    }
    cellExists(row, cell) {
      return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
    }
    /**
     * Returns a hash containing row and cell indexes. Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
     * @param x An x coordinate.
     * @param y A y coordinate.
     */
    getCellFromPoint(x, y) {
      let row = this.getRowFromPosition(y), cell = 0, w = 0;
      for (let i = 0; i < this.columns.length && w < x; i++)
        !this.columns[i] || this.columns[i].hidden || (w += this.columns[i].width, cell++);
      return cell < 0 && (cell = 0), { row, cell: cell - 1 };
    }
    getCellFromNode(cellNode) {
      let cls = /l\d+/.exec(cellNode.className);
      if (!cls)
        throw new Error(`SlickGrid getCellFromNode: cannot get cell - ${cellNode.className}`);
      return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
    }
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
    /**
     * Get frozen (pinned) row offset
     * @param {Number} row - grid row number
     */
    getFrozenRowOffset(row) {
      let offset = 0;
      return this.hasFrozenRows ? this._options.frozenBottom ? row >= this.actualFrozenRow ? this.h < this.viewportTopH ? offset = this.actualFrozenRow * this._options.rowHeight : offset = this.h : offset = 0 : row >= this.actualFrozenRow ? offset = this.frozenRowsHeight : offset = 0 : offset = 0, offset;
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
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Cell switching
    /**  Resets active cell. */
    resetActiveCell() {
      this.setActiveCellInternal(null, !1);
    }
    /** @alias `setFocus` */
    focus() {
      this.setFocus();
    }
    setFocus() {
      this.tabbingDirection === -1 ? this._focusSink.focus() : this._focusSink2.focus();
    }
    /** Scroll to a specific cell and make it into the view */
    scrollCellIntoView(row, cell, doPaging) {
      if (this.scrollRowIntoView(row, doPaging), cell <= this._options.frozenColumn)
        return;
      let colspan = this.getColspan(row, cell);
      this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
    }
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
    setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
      var _a, _b, _c, _d;
      if (Utils.isDefined(this.activeCellNode) && (this.makeActiveCellNormal(), this.activeCellNode.classList.remove("active"), (_b = (_a = this.rowsCache[this.activeRow]) == null ? void 0 : _a.rowNode) == null || _b.forEach((node) => node.classList.remove("active"))), this.activeCellNode = newCell, Utils.isDefined(this.activeCellNode)) {
        let activeCellOffset = Utils.offset(this.activeCellNode), rowOffset = Math.floor(Utils.offset(Utils.parents(this.activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils.parents(this.activeCellNode, ".grid-canvas-bottom").length;
        this.hasFrozenRows && isBottom && (rowOffset -= this._options.frozenBottom ? Utils.height(this._canvasTopL) : this.frozenRowsHeight);
        let cell = this.getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
        this.activeRow = cell.row, this.activeCell = this.activePosX = this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode), !Utils.isDefined(opt_editMode) && this._options.autoEditNewRow && (opt_editMode = this.activeRow === this.getDataLength() || this._options.autoEdit), this._options.showCellSelection && (this.activeCellNode.classList.add("active"), (_d = (_c = this.rowsCache[this.activeRow]) == null ? void 0 : _c.rowNode) == null || _d.forEach((node) => node.classList.add("active"))), this._options.editable && opt_editMode && this.isCellPotentiallyEditable(this.activeRow, this.activeCell) && (clearTimeout(this.h_editorLoader), this._options.asyncEditorLoading ? this.h_editorLoader = setTimeout(() => {
          this.makeActiveCellEditable(void 0, preClickModeOn, e);
        }, this._options.asyncEditorLoadDelay) : this.makeActiveCellEditable(void 0, preClickModeOn, e));
      } else
        this.activeRow = this.activeCell = null;
      suppressActiveCellChangedEvent || this.trigger(this.onActiveCellChanged, this.getActiveCell());
    }
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
    isCellPotentiallyEditable(row, cell) {
      let dataLength = this.getDataLength();
      return !(row < dataLength && !this.getDataItem(row) || this.columns[cell].cannotTriggerInsert && row >= dataLength || !this.columns[cell] || this.columns[cell].hidden || !this.getEditor(row, cell));
    }
    /**
     * Make the cell normal again (for example after destroying cell editor),
     * we can also optionally refocus on the current active cell (again possibly after closing cell editor)
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
    editActiveCell(editor, preClickModeOn, e) {
      this.makeActiveCellEditable(editor, preClickModeOn, e);
    }
    makeActiveCellEditable(editor, preClickModeOn, e) {
      var _a, _b, _c, _d, _e, _f;
      if (!this.activeCellNode)
        return;
      if (!this._options.editable)
        throw new Error("SlickGrid makeActiveCellEditable : should never get called when this._options.editable is false");
      if (clearTimeout(this.h_editorLoader), !this.isCellPotentiallyEditable(this.activeRow, this.activeCell))
        return;
      let columnDef = this.columns[this.activeCell], item = this.getDataItem(this.activeRow);
      if (this.trigger(this.onBeforeEditCell, { row: this.activeRow, cell: this.activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
        this.setFocus();
        return;
      }
      (_a = this.getEditorLock()) == null || _a.activate(this.editController), this.activeCellNode.classList.add("editable");
      let useEditor = editor || this.getEditor(this.activeRow, this.activeCell);
      !editor && !useEditor.suppressClearOnEdit && Utils.emptyElement(this.activeCellNode);
      let metadata = (_c = (_b = this.data) == null ? void 0 : _b.getItemMetadata) == null ? void 0 : _c.call(_b, this.activeRow);
      metadata = metadata == null ? void 0 : metadata.columns;
      let columnMetaData = metadata && (metadata[columnDef.id] || metadata[this.activeCell]);
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
      }), item && this.currentEditor && (this.currentEditor.loadValue(item), preClickModeOn && ((_d = this.currentEditor) != null && _d.preClick) && this.currentEditor.preClick()), this.serializedEditorValue = (_e = this.currentEditor) == null ? void 0 : _e.serializeValue(), (_f = this.currentEditor) != null && _f.position && this.handleActiveCellPositionChange();
    }
    commitEditAndSetFocus() {
      var _a;
      (_a = this.getEditorLock()) != null && _a.commitCurrentEdit() && (this.setFocus(), this._options.autoEdit && !this._options.autoCommitEdit && this.navigateDown());
    }
    cancelEditAndSetFocus() {
      var _a;
      (_a = this.getEditorLock()) != null && _a.cancelCurrentEdit() && this.setFocus();
    }
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
    handleActiveCellPositionChange() {
      if (this.activeCellNode && (this.trigger(this.onActiveCellPositionChanged, {}), this.currentEditor)) {
        let cellBox = this.getActiveCellPosition();
        this.currentEditor.show && this.currentEditor.hide && (cellBox.visible ? this.currentEditor.show() : this.currentEditor.hide()), this.currentEditor.position && this.currentEditor.position(cellBox);
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
    setTextSelection(selection) {
      if (window.getSelection && selection) {
        let target = window.getSelection();
        target && (target.removeAllRanges(), target.addRange(selection));
      }
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
    scrollPage(dir) {
      let deltaRows = dir * this.numVisibleRows, bottomOfTopmostFullyVisibleRow = this.scrollTop + this._options.rowHeight - 1;
      if (this.scrollTo((this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * this._options.rowHeight), this.render(), this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
        let row = this.activeRow + deltaRows, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
        row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
        let cell = 0, prevCell = null, prevActivePosX = this.activePosX;
        for (; cell <= this.activePosX; )
          this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
        prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
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
    navigateToRow(row) {
      let num_rows = this.getDataLength();
      if (!num_rows)
        return !0;
      if (row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), this.scrollCellIntoView(row, 0, !0), this._options.enableCellNavigation && Utils.isDefined(this.activeRow)) {
        let cell = 0, prevCell = null, prevActivePosX = this.activePosX;
        for (; cell <= this.activePosX; )
          this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
        prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
      }
      return !0;
    }
    getColspan(row, cell) {
      var _a, _b;
      let metadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row);
      if (!metadata || !metadata.columns)
        return 1;
      let columnData = metadata.columns[this.columns[cell].id] || metadata.columns[cell], colspan = columnData == null ? void 0 : columnData.colspan;
      return colspan === "*" ? colspan = this.columns.length - cell : colspan = colspan || 1, colspan;
    }
    findFirstFocusableCell(row) {
      let cell = 0;
      for (; cell < this.columns.length; ) {
        if (this.canCellBeActive(row, cell))
          return cell;
        cell += this.getColspan(row, cell);
      }
      return null;
    }
    findLastFocusableCell(row) {
      let cell = 0, lastFocusableCell = null;
      for (; cell < this.columns.length; )
        this.canCellBeActive(row, cell) && (lastFocusableCell = cell), cell += this.getColspan(row, cell);
      return lastFocusableCell;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gotoRight(row, cell, _posX) {
      if (cell >= this.columns.length)
        return null;
      do
        cell += this.getColspan(row, cell);
      while (cell < this.columns.length && !this.canCellBeActive(row, cell));
      return cell < this.columns.length ? {
        row,
        cell,
        posX: cell
      } : null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gotoLeft(row, cell, _posX) {
      if (cell <= 0)
        return null;
      let firstFocusableCell = this.findFirstFocusableCell(row);
      if (firstFocusableCell === null || firstFocusableCell >= cell)
        return null;
      let prev = {
        row,
        cell: firstFocusableCell,
        posX: firstFocusableCell
      }, pos;
      for (; ; ) {
        if (pos = this.gotoRight(prev.row, prev.cell, prev.posX), !pos)
          return null;
        if (pos.cell >= cell)
          return prev;
        prev = pos;
      }
    }
    gotoDown(row, cell, posX) {
      let prevCell, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      for (; ; ) {
        if (++row >= dataLengthIncludingAddNew)
          return null;
        for (prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += this.getColspan(row, cell);
        if (this.canCellBeActive(row, prevCell))
          return {
            row,
            cell: prevCell,
            posX
          };
      }
    }
    gotoUp(row, cell, posX) {
      let prevCell;
      for (; ; ) {
        if (--row < 0)
          return null;
        for (prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += this.getColspan(row, cell);
        if (this.canCellBeActive(row, prevCell))
          return {
            row,
            cell: prevCell,
            posX
          };
      }
    }
    gotoNext(row, cell, posX) {
      if (!Utils.isDefined(row) && !Utils.isDefined(cell) && (row = cell = posX = 0, this.canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell
        };
      let pos = this.gotoRight(row, cell, posX);
      if (pos)
        return pos;
      let firstFocusableCell = null, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      for (row === dataLengthIncludingAddNew - 1 && row--; ++row < dataLengthIncludingAddNew; )
        if (firstFocusableCell = this.findFirstFocusableCell(row), firstFocusableCell !== null)
          return {
            row,
            cell: firstFocusableCell,
            posX: firstFocusableCell
          };
      return null;
    }
    gotoPrev(row, cell, posX) {
      if (!Utils.isDefined(row) && !Utils.isDefined(cell) && (row = this.getDataLengthIncludingAddNew() - 1, cell = posX = this.columns.length - 1, this.canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell
        };
      let pos, lastSelectableCell;
      for (; !pos && (pos = this.gotoLeft(row, cell, posX), !pos); ) {
        if (--row < 0)
          return null;
        cell = 0, lastSelectableCell = this.findLastFocusableCell(row), lastSelectableCell !== null && (pos = {
          row,
          cell: lastSelectableCell,
          posX: lastSelectableCell
        });
      }
      return pos;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gotoRowStart(row, _cell, _posX) {
      let newCell = this.findFirstFocusableCell(row);
      return newCell === null ? null : {
        row,
        cell: newCell,
        posX: newCell
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gotoRowEnd(row, _cell, _posX) {
      let newCell = this.findLastFocusableCell(row);
      return newCell === null ? null : {
        row,
        cell: newCell,
        posX: newCell
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
      this.setFocus();
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
      }[dir].call(this, this.activeRow, this.activeCell, this.activePosX);
      if (pos) {
        if (this.hasFrozenRows && this._options.frozenBottom && pos.row === this.getDataLength())
          return;
        let isAddNewRow = pos.row === this.getDataLength();
        return (!this._options.frozenBottom && pos.row >= this.actualFrozenRow || this._options.frozenBottom && pos.row < this.actualFrozenRow) && this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling), this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell)), this.activePosX = pos.posX, !0;
      } else
        return this.setActiveCellInternal(this.getCellNode(this.activeRow, this.activeCell)), !1;
    }
    /**
     * Returns a DOM element containing a cell at a given row and cell.
     * @param row A row index.
     * @param cell A column index.
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
      if (!this.options.enableCellNavigation || row >= this.getDataLengthIncludingAddNew() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
        return !1;
      let rowMetadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row);
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
      var _a, _b;
      if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
        return !1;
      let rowMetadata = (_b = (_a = this.data) == null ? void 0 : _a.getItemMetadata) == null ? void 0 : _b.call(_a, row);
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
    //////////////////////////////////////////////////////////////////////////////////////////////
    // IEditor implementation for the editor lock
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
              self.options.editCommandHandler ? (self.makeActiveCellNormal(!0), self.options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), self.makeActiveCellNormal(!0));
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
    cancelCurrentEdit() {
      return this.makeActiveCellNormal(), !0;
    }
    rowsToRanges(rows) {
      let ranges = [], lastCell = this.columns.length - 1;
      for (let i = 0; i < rows.length; i++)
        ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
      return ranges;
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
    /** html sanitizer to avoid scripting attack */
    sanitizeHtmlString(dirtyHtml, suppressLogging) {
      if (!this._options.sanitizer || typeof dirtyHtml != "string")
        return dirtyHtml;
      let cleanHtml = this._options.sanitizer(dirtyHtml);
      return !suppressLogging && this._options.logSanitizedHtml && this.logMessageCount <= this.logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log(`sanitizer altered html: ${dirtyHtml} --> ${cleanHtml}`), this.logMessageCount === this.logMessageMaxCount && console.log(`sanitizer: silencing messages after first ${this.logMessageMaxCount}`), this.logMessageCount++), cleanHtml;
    }
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
 * SlickGrid v5.6.1
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */
//# sourceMappingURL=slick.grid.js.map
