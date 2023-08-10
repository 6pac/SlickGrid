"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:./slick.core.js"() {
    }
  });

  // import-ns:./slick.interactions.js
  var require_slick_interactions = __commonJS({
    "import-ns:./slick.interactions.js"() {
    }
  });

  // src/slick.grid.js
  var require_slick_grid = __commonJS({
    "src/slick.grid.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickGrid = void 0;
      var slick_core_1 = require_slick_core(), slick_interactions_1 = require_slick_interactions(), BindingEventService = Slick.BindingEventService, ColAutosizeMode = Slick.ColAutosizeMode, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, GlobalEditorLock = Slick.GlobalEditorLock, GridAutosizeColsMode = Slick.GridAutosizeColsMode, keyCode = Slick.keyCode, preClickClassName = Slick.preClickClassName, SlickRange = Slick.Range, RowSelectionMode = Slick.RowSelectionMode, ValueFilterMode = Slick.ValueFilterMode, Utils = Slick.Utils, WidthEvalMode = Slick.WidthEvalMode, Draggable = Slick.Draggable, MouseWheel = Slick.MouseWheel, Resizable = Slick.Resizable, SlickGrid = (
        /** @class */
        function() {
          function SlickGrid2(container, data, columns, options) {
            this.container = container, this.data = data, this.columns = columns, this.options = options, this.slickGridVersion = "4.0.1", this.cid = "", this.onActiveCellChanged = new SlickEvent(), this.onActiveCellPositionChanged = new SlickEvent(), this.onAddNewRow = new SlickEvent(), this.onAutosizeColumns = new SlickEvent(), this.onBeforeAppendCell = new SlickEvent(), this.onBeforeCellEditorDestroy = new SlickEvent(), this.onBeforeColumnsResize = new SlickEvent(), this.onBeforeDestroy = new SlickEvent(), this.onBeforeEditCell = new SlickEvent(), this.onBeforeFooterRowCellDestroy = new SlickEvent(), this.onBeforeHeaderCellDestroy = new SlickEvent(), this.onBeforeHeaderRowCellDestroy = new SlickEvent(), this.onBeforeSetColumns = new SlickEvent(), this.onBeforeSort = new SlickEvent(), this.onBeforeUpdateColumns = new SlickEvent(), this.onCellChange = new SlickEvent(), this.onCellCssStylesChanged = new SlickEvent(), this.onClick = new SlickEvent(), this.onColumnsReordered = new SlickEvent(), this.onColumnsDrag = new SlickEvent(), this.onColumnsResized = new SlickEvent(), this.onColumnsResizeDblClick = new SlickEvent(), this.onCompositeEditorChange = new SlickEvent(), this.onContextMenu = new SlickEvent(), this.onDrag = new SlickEvent(), this.onDblClick = new SlickEvent(), this.onDragInit = new SlickEvent(), this.onDragStart = new SlickEvent(), this.onDragEnd = new SlickEvent(), this.onFooterClick = new SlickEvent(), this.onFooterContextMenu = new SlickEvent(), this.onFooterRowCellRendered = new SlickEvent(), this.onHeaderCellRendered = new SlickEvent(), this.onHeaderClick = new SlickEvent(), this.onHeaderContextMenu = new SlickEvent(), this.onHeaderMouseEnter = new SlickEvent(), this.onHeaderMouseLeave = new SlickEvent(), this.onHeaderRowCellRendered = new SlickEvent(), this.onHeaderRowMouseEnter = new SlickEvent(), this.onHeaderRowMouseLeave = new SlickEvent(), this.onKeyDown = new SlickEvent(), this.onMouseEnter = new SlickEvent(), this.onMouseLeave = new SlickEvent(), this.onRendered = new SlickEvent(), this.onScroll = new SlickEvent(), this.onSelectedRowsChanged = new SlickEvent(), this.onSetOptions = new SlickEvent(), this.OnActivateChangedOptions = new SlickEvent(), this.onSort = new SlickEvent(), this.onValidationError = new SlickEvent(), this.onViewportChanged = new SlickEvent(), this.canvas = null, this.canvas_context = null, this._defaults = {
              alwaysShowVerticalScroll: !1,
              alwaysAllowHorizontalScroll: !1,
              explicitInitialization: !1,
              rowHeight: 25,
              defaultColumnWidth: 80,
              enableAddRow: !1,
              leaveSpaceForNewRows: !1,
              editable: !1,
              autoEdit: !0,
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
              logSanitizedHtml: !1,
              mixinDefaults: !1
            }, this._columnDefaults = {
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
            }, this._columnAutosizeDefaults = {
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
            }, this.page = 0, this.offset = 0, this.vScrollDir = 1, this._bindingEventService = new BindingEventService(), this.initialized = !1, this.uid = "slickgrid_".concat(Math.round(1e6 * Math.random())), this._groupHeaders = [], this._headerScroller = [], this._headers = [], this._boundAncestors = [], this.viewportH = 0, this.viewportW = 0, this.canvasWidth = 0, this.canvasWidthL = 0, this.canvasWidthR = 0, this.headersWidth = 0, this.headersWidthL = 0, this.headersWidthR = 0, this.viewportHasHScroll = !1, this.viewportHasVScroll = !1, this.headerColumnWidthDiff = 0, this.headerColumnHeightDiff = 0, this.cellWidthDiff = 0, this.cellHeightDiff = 0, this.hasFrozenRows = !1, this.frozenRowsHeight = 0, this.actualFrozenRow = -1, this.paneTopH = 0, this.paneBottomH = 0, this.viewportTopH = 0, this.viewportBottomH = 0, this.topPanelH = 0, this.headerRowH = 0, this.footerRowH = 0, this.tabbingDirection = 1, this.activeCellNode = null, this.currentEditor = null, this.rowsCache = {}, this.renderedRows = 0, this.numVisibleRows = 0, this.prevScrollTop = 0, this.scrollTop = 0, this.lastRenderedScrollTop = 0, this.lastRenderedScrollLeft = 0, this.prevScrollLeft = 0, this.scrollLeft = 0, this.selectedRows = [], this.plugins = [], this.cellCssClasses = {}, this.columnsById = {}, this.sortColumns = [], this.columnPosLeft = [], this.columnPosRight = [], this.pagingActive = !1, this.pagingIsLastPage = !1, this.h_editorLoader = null, this.h_render = null, this.h_postrender = null, this.h_postrenderCleanup = null, this.postProcessedRows = {}, this.postProcessToRow = null, this.postProcessFromRow = null, this.postProcessedCleanupQueue = [], this.postProcessgroupId = 0, this.counter_rows_rendered = 0, this.counter_rows_removed = 0, this.cssShow = { position: "absolute", visibility: "hidden", display: "block" }, this._hiddenParents = [], this.oldProps = [], this.enforceFrozenRowHeightRecalc = !1, this.columnResizeDragging = !1, this.slickDraggableInstance = null, this.slickMouseWheelInstances = [], this.slickResizableInstances = [], this.logMessageCount = 0, this.logMessageMaxCount = 30, this.initialize();
          }
          return SlickGrid2.prototype.init = function() {
            this.finishInitialization();
          }, SlickGrid2.prototype.initialize = function() {
            var _this = this;
            if (typeof this.container == "string" ? this._container = document.querySelector(this.container) : this._container = this.container, !this._container)
              throw new Error("SlickGrid requires a valid container, ".concat(this.container, " does not exist in the DOM."));
            if (this.options.mixinDefaults ? (this.options || (this.options = {}), this._options = Utils.applyDefaults(this.options, this._defaults)) : this._options = Utils.extend(!0, {}, this._defaults, this.options), this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling), this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight(), this.validateAndEnforceOptions(), this._columnDefaults.width = this._options.defaultColumnWidth, this._options.suppressCssChangesOnHiddenInit || this.cacheCssForHiddenInit(), this.updateColumnProps(), this._options.enableColumnReorder && (!Sortable || !Sortable.create))
              throw new Error("SlickGrid requires Sortable.js module to be loaded");
            this.editController = {
              commitCurrentEdit: this.commitCurrentEdit.bind(this),
              cancelCurrentEdit: this.cancelCurrentEdit.bind(this)
            }, Utils.emptyElement(this._container), this._container.style.overflow = "hidden", this._container.style.outline = String(0), this._container.classList.add(this.uid), this._container.classList.add("ui-widget");
            var containerStyles = window.getComputedStyle(this._container);
            /relative|absolute|fixed/.test(containerStyles.position) || (this._container.style.position = "relative"), this._focusSink = Utils.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, this._container), this._paneHeaderL = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, this._container), this._paneHeaderR = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, this._container), this._paneTopL = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, this._container), this._paneTopR = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, this._container), this._paneBottomL = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, this._container), this._paneBottomR = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, this._container), this._options.createPreHeaderPanel && (this._preHeaderPanelScroller = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderL), this._preHeaderPanelScroller.appendChild(document.createElement("div")), this._preHeaderPanel = Utils.createDomElement("div", null, this._preHeaderPanelScroller), this._preHeaderPanelSpacer = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScroller), this._preHeaderPanelScrollerR = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderR), this._preHeaderPanelR = Utils.createDomElement("div", null, this._preHeaderPanelScrollerR), this._preHeaderPanelSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScrollerR), this._options.showPreHeaderPanel || (Utils.hide(this._preHeaderPanelScroller), Utils.hide(this._preHeaderPanelScrollerR))), this._headerScrollerL = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, this._paneHeaderL), this._headerScrollerR = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, this._paneHeaderR), this._headerScroller.push(this._headerScrollerL), this._headerScroller.push(this._headerScrollerR), this._headerL = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", style: { left: "-1000px" } }, this._headerScrollerL), this._headerR = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", style: { left: "-1000px" } }, this._headerScrollerR), this._headers = [this._headerL, this._headerR], this._headerRowScrollerL = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopL), this._headerRowScrollerR = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopR), this._headerRowScroller = [this._headerRowScrollerL, this._headerRowScrollerR], this._headerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerL), this._headerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerR), this._headerRowL = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, this._headerRowScrollerL), this._headerRowR = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, this._headerRowScrollerR), this._headerRows = [this._headerRowL, this._headerRowR], this._topPanelScrollerL = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopL), this._topPanelScrollerR = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopR), this._topPanelScrollers = [this._topPanelScrollerL, this._topPanelScrollerR], this._topPanelL = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerL), this._topPanelR = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerR), this._topPanels = [this._topPanelL, this._topPanelR], this._options.showColumnHeader || this._headerScroller.forEach(function(el) {
              Utils.hide(el);
            }), this._options.showTopPanel || this._topPanelScrollers.forEach(function(scroller) {
              Utils.hide(scroller);
            }), this._options.showHeaderRow || this._headerRowScroller.forEach(function(scroller) {
              Utils.hide(scroller);
            }), this._viewportTopL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, this._paneTopL), this._viewportTopR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, this._paneTopR), this._viewportBottomL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, this._paneBottomL), this._viewportBottomR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, this._paneBottomR), this._viewport = [this._viewportTopL, this._viewportTopR, this._viewportBottomL, this._viewportBottomR], this._options.viewportClass && this._viewport.forEach(function(view) {
              var _a;
              (_a = view.classList).add.apply(_a, (_this._options.viewportClass || "").split(" "));
            }), this._activeViewportNode = this._viewportTopL, this._canvasTopL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, this._viewportTopL), this._canvasTopR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, this._viewportTopR), this._canvasBottomL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, this._viewportBottomL), this._canvasBottomR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, this._viewportBottomR), this._canvas = [this._canvasTopL, this._canvasTopR, this._canvasBottomL, this._canvasBottomR], this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar(), this._activeCanvasNode = this._canvasTopL, this._preHeaderPanelSpacer && Utils.width(this._preHeaderPanelSpacer, this.getCanvasWidth() + this.scrollbarDimensions.width), this._headers.forEach(function(el) {
              Utils.width(el, _this.getHeadersWidth());
            }), Utils.width(this._headerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), Utils.width(this._headerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._options.createFooterRow && (this._footerRowScrollerR = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopR), this._footerRowScrollerL = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopL), this._footerRowScroller = [this._footerRowScrollerL, this._footerRowScrollerR], this._footerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerL), Utils.width(this._footerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerR), Utils.width(this._footerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowL = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, this._footerRowScrollerL), this._footerRowR = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, this._footerRowScrollerR), this._footerRow = [this._footerRowL, this._footerRowR], this._options.showFooterRow || this._footerRowScroller.forEach(function(scroller) {
              Utils.hide(scroller);
            })), this._focusSink2 = this._focusSink.cloneNode(!0), this._container.appendChild(this._focusSink2), this._options.explicitInitialization || this.finishInitialization();
          }, SlickGrid2.prototype.finishInitialization = function() {
            var _this = this;
            this.initialized || (this.initialized = !0, this.getViewportWidth(), this.getViewportHeight(), this.measureCellPaddingAndBorder(), this.disableSelection(this._headers), this._options.enableTextSelectionOnCells || this._viewport.forEach(function(view) {
              _this._bindingEventService.bind(view, "selectstart", function(event) {
                event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
              });
            }), this.setFrozenOptions(), this.setPaneVisibility(), this.setScroller(), this.setOverflow(), this.updateColumnCaches(), this.createColumnHeaders(), this.createColumnFooter(), this.setupColumnSort(), this.createCssRules(), this.resizeCanvas(), this.bindAncestorScrollEvents(), this._bindingEventService.bind(this._container, "resize", this.resizeCanvas.bind(this)), this._viewport.forEach(function(view) {
              _this._bindingEventService.bind(view, "scroll", _this.handleScroll.bind(_this));
            }), this._options.enableMouseWheelScrollHandler && this._viewport.forEach(function(view) {
              _this.slickMouseWheelInstances.push(MouseWheel({
                element: view,
                onMouseWheel: _this.handleMouseWheel.bind(_this)
              }));
            }), this._headerScroller.forEach(function(el) {
              _this._bindingEventService.bind(el, "contextmenu", _this.handleHeaderContextMenu.bind(_this)), _this._bindingEventService.bind(el, "click", _this.handleHeaderClick.bind(_this));
            }), this._headerRowScroller.forEach(function(scroller) {
              _this._bindingEventService.bind(scroller, "scroll", _this.handleHeaderRowScroll.bind(_this));
            }), this._options.createFooterRow && (this._footerRow.forEach(function(footer) {
              _this._bindingEventService.bind(footer, "contextmenu", _this.handleFooterContextMenu.bind(_this)), _this._bindingEventService.bind(footer, "click", _this.handleFooterClick.bind(_this));
            }), this._footerRowScroller.forEach(function(scroller) {
              _this._bindingEventService.bind(scroller, "scroll", _this.handleFooterRowScroll.bind(_this));
            })), this._options.createPreHeaderPanel && this._bindingEventService.bind(this._preHeaderPanelScroller, "scroll", this.handlePreHeaderPanelScroll.bind(this)), this._bindingEventService.bind(this._focusSink, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(this._focusSink2, "keydown", this.handleKeyDown.bind(this)), this._canvas.forEach(function(element) {
              _this._bindingEventService.bind(element, "keydown", _this.handleKeyDown.bind(_this)), _this._bindingEventService.bind(element, "click", _this.handleClick.bind(_this)), _this._bindingEventService.bind(element, "dblclick", _this.handleDblClick.bind(_this)), _this._bindingEventService.bind(element, "contextmenu", _this.handleContextMenu.bind(_this)), _this._bindingEventService.bind(element, "mouseover", _this.handleCellMouseOver.bind(_this)), _this._bindingEventService.bind(element, "mouseout", _this.handleCellMouseOut.bind(_this));
            }), Draggable && (this.slickDraggableInstance = Draggable({
              containerElement: this._container,
              allowDragFrom: "div.slick-cell",
              onDragInit: this.handleDragInit.bind(this),
              onDragStart: this.handleDragStart.bind(this),
              onDrag: this.handleDrag.bind(this),
              onDragEnd: this.handleDragEnd.bind(this)
            })), this._options.suppressCssChangesOnHiddenInit || this.restoreCssFromHiddenInit());
          }, SlickGrid2.prototype.cacheCssForHiddenInit = function() {
            this._hiddenParents = Utils.parents(this._container, ":hidden");
            for (var _i = 0, _a = this._hiddenParents; _i < _a.length; _i++) {
              var el = _a[_i], old = {};
              for (var name_1 in this.cssShow)
                old[name_1] = el.style[name_1], el.style[name_1] = this.cssShow[name_1];
              this.oldProps.push(old);
            }
          }, SlickGrid2.prototype.restoreCssFromHiddenInit = function() {
            for (var i = 0, _i = 0, _a = this._hiddenParents; _i < _a.length; _i++) {
              var el = _a[_i], old = this.oldProps[i++];
              for (var name_2 in this.cssShow)
                el.style[name_2] = old[name_2];
            }
          }, SlickGrid2.prototype.hasFrozenColumns = function() {
            return this._options.frozenColumn > -1;
          }, SlickGrid2.prototype.registerPlugin = function(plugin) {
            this.plugins.unshift(plugin), plugin.init(this);
          }, SlickGrid2.prototype.unregisterPlugin = function(plugin) {
            for (var _a, i = this.plugins.length; i >= 0; i--)
              if (this.plugins[i] === plugin) {
                (_a = this.plugins[i]) === null || _a === void 0 || _a.destroy(), this.plugins.splice(i, 1);
                break;
              }
          }, SlickGrid2.prototype.getPluginByName = function(name) {
            for (var _a, i = this.plugins.length - 1; i >= 0; i--)
              if (((_a = this.plugins[i]) === null || _a === void 0 ? void 0 : _a.pluginName) === name)
                return this.plugins[i];
          }, SlickGrid2.prototype.setSelectionModel = function(model) {
            this.selectionModel && (this.selectionModel.onSelectedRangesChanged.unsubscribe(this.handleSelectedRangesChanged.bind(this)), this.selectionModel.destroy && this.selectionModel.destroy()), this.selectionModel = model, this.selectionModel && (this.selectionModel.init(this), this.selectionModel.onSelectedRangesChanged.subscribe(this.handleSelectedRangesChanged.bind(this)));
          }, SlickGrid2.prototype.getSelectionModel = function() {
            return this.selectionModel;
          }, SlickGrid2.prototype.getCanvasNode = function(columnIdOrIdx, rowIndex) {
            return this._getContainerElement(this.getCanvases(), columnIdOrIdx, rowIndex);
          }, SlickGrid2.prototype.getActiveCanvasNode = function(e) {
            return e === void 0 ? this._activeCanvasNode : (e instanceof SlickEventData && (e = e.getNativeEvent()), this._activeCanvasNode = e == null ? void 0 : e.target.closest(".grid-canvas"), this._activeCanvasNode);
          }, SlickGrid2.prototype.getCanvases = function() {
            return this._canvas;
          }, SlickGrid2.prototype.getViewportNode = function(columnIdOrIdx, rowIndex) {
            return this._getContainerElement(this.getViewports(), columnIdOrIdx, rowIndex);
          }, SlickGrid2.prototype.getViewports = function() {
            return this._viewport;
          }, SlickGrid2.prototype.getActiveViewportNode = function(e) {
            return this.setActiveViewportNode(e), this._activeViewportNode;
          }, SlickGrid2.prototype.setActiveViewportNode = function(e) {
            return e instanceof SlickEventData && (e = e.getNativeEvent()), this._activeViewportNode = e == null ? void 0 : e.target.closest(".slick-viewport"), this._activeViewportNode;
          }, SlickGrid2.prototype._getContainerElement = function(targetContainers, columnIdOrIdx, rowIndex) {
            if (targetContainers) {
              columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
              var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), isBottomSide = this.hasFrozenRows && rowIndex >= this.actualFrozenRow + (this._options.frozenBottom ? 0 : 1), isRightSide = this.hasFrozenColumns() && idx > this._options.frozenColumn;
              return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
            }
          }, SlickGrid2.prototype.measureScrollbar = function() {
            var className = "";
            this._viewport.forEach(function(v) {
              return className += v.className;
            });
            var outerdiv = Utils.createDomElement("div", { className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
              width: outerdiv.offsetWidth - outerdiv.clientWidth,
              height: outerdiv.offsetHeight - outerdiv.clientHeight
            };
            return innerdiv.remove(), outerdiv.remove(), dim;
          }, SlickGrid2.prototype.getHeadersWidth = function() {
            var _a, _b, _c, _d, _f, _g, _h, _j;
            this.headersWidth = this.headersWidthL = this.headersWidthR = 0;
            var includeScrollbar = !this._options.autoHeight, i = 0, ii = this.columns.length;
            for (i = 0; i < ii; i++)
              if (!(!this.columns[i] || this.columns[i].hidden)) {
                var width = this.columns[i].width;
                this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += width || 0 : this.headersWidthL += width || 0;
              }
            return includeScrollbar && (this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0 : this.headersWidthL += (_d = (_c = this.scrollbarDimensions) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0), this.hasFrozenColumns() ? (this.headersWidthL = this.headersWidthL + 1e3, this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.headersWidthL, this.headersWidthR += (_g = (_f = this.scrollbarDimensions) === null || _f === void 0 ? void 0 : _f.width) !== null && _g !== void 0 ? _g : 0) : (this.headersWidthL += (_j = (_h = this.scrollbarDimensions) === null || _h === void 0 ? void 0 : _h.width) !== null && _j !== void 0 ? _j : 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidth = this.headersWidthL + this.headersWidthR, Math.max(this.headersWidth, this.viewportW) + 1e3;
          }, SlickGrid2.prototype.getHeadersWidthL = function() {
            var _this = this, _a, _b;
            return this.headersWidthL = 0, this.columns.forEach(function(column, i) {
              column.hidden || _this._options.frozenColumn > -1 && i > _this._options.frozenColumn || (_this.headersWidthL += column.width || 0);
            }), this.hasFrozenColumns() ? this.headersWidthL += 1e3 : (this.headersWidthL += (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidthL;
          }, SlickGrid2.prototype.getHeadersWidthR = function() {
            var _this = this, _a, _b;
            return this.headersWidthR = 0, this.columns.forEach(function(column, i) {
              column.hidden || _this._options.frozenColumn > -1 && i > _this._options.frozenColumn && (_this.headersWidthR += column.width || 0);
            }), this.hasFrozenColumns() && (this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.getHeadersWidthL(), this.headersWidthR += (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0), this.headersWidthR;
          }, SlickGrid2.prototype.getCanvasWidth = function() {
            var _a, _b, availableWidth = this.viewportHasVScroll ? this.viewportW - ((_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) : this.viewportW, i = this.columns.length;
            for (this.canvasWidthL = this.canvasWidthR = 0; i--; )
              !this.columns[i] || this.columns[i].hidden || (this.hasFrozenColumns() && i > this._options.frozenColumn ? this.canvasWidthR += this.columns[i].width || 0 : this.canvasWidthL += this.columns[i].width || 0);
            var totalRowWidth = this.canvasWidthL + this.canvasWidthR;
            if (this._options.fullWidthRows) {
              var extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
              extraWidth > 0 && (totalRowWidth += extraWidth, this.hasFrozenColumns() ? this.canvasWidthR += extraWidth : this.canvasWidthL += extraWidth);
            }
            return totalRowWidth;
          }, SlickGrid2.prototype.updateCanvasWidth = function(forceColumnWidthsUpdate) {
            var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, oldCanvasWidth = this.canvasWidth, oldCanvasWidthL = this.canvasWidthL, oldCanvasWidthR = this.canvasWidthR;
            this.canvasWidth = this.getCanvasWidth();
            var widthChanged = this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;
            if (widthChanged || this.hasFrozenColumns() || this.hasFrozenRows)
              if (Utils.width(this._canvasTopL, this.canvasWidthL), this.getHeadersWidth(), Utils.width(this._headerL, this.headersWidthL), Utils.width(this._headerR, this.headersWidthR), this.hasFrozenColumns()) {
                var cWidth = Utils.width(this._container) || 0;
                if (cWidth > 0 && this.canvasWidthL > cWidth)
                  throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
                Utils.width(this._canvasTopR, this.canvasWidthR), Utils.width(this._paneHeaderL, this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "left", this.canvasWidthL), Utils.setStyleSize(this._paneHeaderR, "width", this.viewportW - this.canvasWidthL), Utils.width(this._paneTopL, this.canvasWidthL), Utils.setStyleSize(this._paneTopR, "left", this.canvasWidthL), Utils.width(this._paneTopR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowScrollerL, this.canvasWidthL), Utils.width(this._headerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._headerRowL, this.canvasWidthL), Utils.width(this._headerRowR, this.canvasWidthR), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, this.canvasWidthL), Utils.width(this._footerRowScrollerR, this.viewportW - this.canvasWidthL), Utils.width(this._footerRowL, this.canvasWidthL), Utils.width(this._footerRowR, this.canvasWidthR)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, this.canvasWidth), Utils.width(this._viewportTopL, this.canvasWidthL), Utils.width(this._viewportTopR, this.viewportW - this.canvasWidthL), this.hasFrozenRows && (Utils.width(this._paneBottomL, this.canvasWidthL), Utils.setStyleSize(this._paneBottomR, "left", this.canvasWidthL), Utils.width(this._viewportBottomL, this.canvasWidthL), Utils.width(this._viewportBottomR, this.viewportW - this.canvasWidthL), Utils.width(this._canvasBottomL, this.canvasWidthL), Utils.width(this._canvasBottomR, this.canvasWidthR));
              } else
                Utils.width(this._paneHeaderL, "100%"), Utils.width(this._paneTopL, "100%"), Utils.width(this._headerRowScrollerL, "100%"), Utils.width(this._headerRowL, this.canvasWidth), this._options.createFooterRow && (Utils.width(this._footerRowScrollerL, "100%"), Utils.width(this._footerRowL, this.canvasWidth)), this._options.createPreHeaderPanel && Utils.width(this._preHeaderPanel, this.canvasWidth), Utils.width(this._viewportTopL, "100%"), this.hasFrozenRows && (Utils.width(this._viewportBottomL, "100%"), Utils.width(this._canvasBottomL, this.canvasWidthL));
            this.viewportHasHScroll = this.canvasWidth >= this.viewportW - ((_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0), Utils.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_d = (_c = this.scrollbarDimensions) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0)), Utils.width(this._headerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_g = (_f = this.scrollbarDimensions) === null || _f === void 0 ? void 0 : _f.width) !== null && _g !== void 0 ? _g : 0)), this._options.createFooterRow && (Utils.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll && (_j = (_h = this.scrollbarDimensions) === null || _h === void 0 ? void 0 : _h.width) !== null && _j !== void 0 ? _j : 0)), Utils.width(this._footerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll && (_l = (_k = this.scrollbarDimensions) === null || _k === void 0 ? void 0 : _k.width) !== null && _l !== void 0 ? _l : 0))), (widthChanged || forceColumnWidthsUpdate) && this.applyColumnWidths();
          }, SlickGrid2.prototype.disableSelection = function(target) {
            var _this = this;
            target.forEach(function(el) {
              el.setAttribute("unselectable", "on"), el.style.mozUserSelect = "none", _this._bindingEventService.bind(el, "selectstart", function() {
                return !1;
              });
            });
          }, SlickGrid2.prototype.getMaxSupportedCssHeight = function() {
            for (var supportedHeight = 1e6, testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? this._options.ffMaxSupportedCssHeight : this._options.maxSupportedCssHeight, div = Utils.createDomElement("div", { style: { display: "hidden" } }, document.body); ; ) {
              var test = supportedHeight * 2;
              Utils.height(div, test);
              var height = Utils.height(div);
              if (test > testUpTo || height !== test)
                break;
              supportedHeight = test;
            }
            return div.remove(), supportedHeight;
          }, SlickGrid2.prototype.getUID = function() {
            return this.uid;
          }, SlickGrid2.prototype.getHeaderColumnWidthDiff = function() {
            return this.headerColumnWidthDiff;
          }, SlickGrid2.prototype.getScrollbarDimensions = function() {
            return this.scrollbarDimensions;
          }, SlickGrid2.prototype.getDisplayedScrollbarDimensions = function() {
            var _a, _b, _c, _d;
            return {
              width: this.viewportHasVScroll && (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0,
              height: this.viewportHasHScroll && (_d = (_c = this.scrollbarDimensions) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0
            };
          }, SlickGrid2.prototype.getAbsoluteColumnMinWidth = function() {
            return this.absoluteColumnMinWidth;
          }, SlickGrid2.prototype.bindAncestorScrollEvents = function() {
            for (var elem = this.hasFrozenRows && !this._options.frozenBottom ? this._canvasBottomL : this._canvasTopL; (elem = elem.parentNode) !== document.body && elem != null; )
              (elem == this._viewportTopL || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) && (this._boundAncestors.push(elem), this._bindingEventService.bind(elem, "scroll", this.handleActiveCellPositionChange.bind(this)));
          }, SlickGrid2.prototype.unbindAncestorScrollEvents = function() {
            var _this = this;
            this._boundAncestors.forEach(function(ancestor) {
              _this._bindingEventService.unbindByEventName(ancestor, "scroll");
            }), this._boundAncestors = [];
          }, SlickGrid2.prototype.updateColumnHeader = function(columnId, title, toolTip) {
            if (this.initialized) {
              var idx = this.getColumnIndex(columnId);
              if (idx != null) {
                var columnDef = this.columns[idx], header = this.getColumnByIndex(idx);
                header && (title !== void 0 && (this.columns[idx].name = title), toolTip !== void 0 && (this.columns[idx].toolTip = toolTip), this.trigger(this.onBeforeHeaderCellDestroy, {
                  node: header,
                  column: columnDef,
                  grid: this
                }), header.setAttribute("title", toolTip || ""), title !== void 0 && (header.children[0].innerHTML = this.sanitizeHtmlString(title)), this.trigger(this.onHeaderCellRendered, {
                  node: header,
                  column: columnDef,
                  grid: this
                }));
              }
            }
          }, SlickGrid2.prototype.getHeader = function(columnDef) {
            if (!columnDef)
              return this.hasFrozenColumns() ? this._headers : this._headerL;
            var idx = this.getColumnIndex(columnDef.id);
            return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL;
          }, SlickGrid2.prototype.getHeaderColumn = function(columnIdOrIdx) {
            var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), targetHeader = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, targetIndex = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? idx : idx - this._options.frozenColumn - 1 : idx;
            return targetHeader.children[targetIndex];
          }, SlickGrid2.prototype.getHeaderRow = function() {
            return this.hasFrozenColumns() ? this._headerRows : this._headerRows[0];
          }, SlickGrid2.prototype.getFooterRow = function() {
            return this.hasFrozenColumns() ? this._footerRow : this._footerRow[0];
          }, SlickGrid2.prototype.getPreHeaderPanel = function() {
            return this._preHeaderPanel;
          }, SlickGrid2.prototype.getPreHeaderPanelLeft = function() {
            return this._preHeaderPanel;
          }, SlickGrid2.prototype.getPreHeaderPanelRight = function() {
            return this._preHeaderPanelR;
          }, SlickGrid2.prototype.getHeaderRowColumn = function(columnIdOrIdx) {
            var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), headerRowTarget;
            return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? headerRowTarget = this._headerRowL : (headerRowTarget = this._headerRowR, idx -= this._options.frozenColumn + 1) : headerRowTarget = this._headerRowL, headerRowTarget.children[idx];
          }, SlickGrid2.prototype.getFooterRowColumn = function(columnIdOrIdx) {
            var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), footerRowTarget;
            return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? footerRowTarget = this._footerRowL : (footerRowTarget = this._footerRowR, idx -= this._options.frozenColumn + 1) : footerRowTarget = this._footerRowL, footerRowTarget.children[idx];
          }, SlickGrid2.prototype.createColumnFooter = function() {
            var _this = this;
            if (this._options.createFooterRow) {
              this._footerRow.forEach(function(footer) {
                var columnElements = footer.querySelectorAll(".slick-footerrow-column");
                columnElements.forEach(function(column) {
                  var columnDef = Utils.storage.get(column, "column");
                  _this.trigger(_this.onBeforeFooterRowCellDestroy, {
                    node: column,
                    column: columnDef,
                    grid: _this
                  });
                });
              }), Utils.emptyElement(this._footerRowL), Utils.emptyElement(this._footerRowR);
              for (var i = 0; i < this.columns.length; i++) {
                var m = this.columns[i];
                if (!(!m || m.hidden)) {
                  var footerRowCell = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-footerrow-column l".concat(i, " r").concat(i) }, this.hasFrozenColumns() && i > this._options.frozenColumn ? this._footerRowR : this._footerRowL), className = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
                  className && footerRowCell.classList.add(className), Utils.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
                    node: footerRowCell,
                    column: m,
                    grid: this
                  });
                }
              }
            }
          }, SlickGrid2.prototype.handleHeaderMouseHoverOn = function(e) {
            e == null || e.target.classList.add("ui-state-hover", "slick-state-hover");
          }, SlickGrid2.prototype.handleHeaderMouseHoverOff = function(e) {
            e == null || e.target.classList.remove("ui-state-hover", "slick-state-hover");
          }, SlickGrid2.prototype.createColumnHeaders = function() {
            var _a, _this = this;
            if (this._headers.forEach(function(header2) {
              var columnElements = header2.querySelectorAll(".slick-header-column");
              columnElements.forEach(function(column) {
                var columnDef = Utils.storage.get(column, "column");
                columnDef && _this.trigger(_this.onBeforeHeaderCellDestroy, {
                  node: column,
                  column: columnDef,
                  grid: _this
                });
              });
            }), Utils.emptyElement(this._headerL), Utils.emptyElement(this._headerR), this.getHeadersWidth(), Utils.width(this._headerL, this.headersWidthL), Utils.width(this._headerR, this.headersWidthR), this._headerRows.forEach(function(row) {
              var columnElements = row.querySelectorAll(".slick-headerrow-column");
              columnElements.forEach(function(column) {
                var columnDef = Utils.storage.get(column, "column");
                columnDef && _this.trigger(_this.onBeforeHeaderRowCellDestroy, {
                  node: _this,
                  column: columnDef,
                  grid: _this
                });
              });
            }), Utils.emptyElement(this._headerRowL), Utils.emptyElement(this._headerRowR), this._options.createFooterRow) {
              var footerRowColumnElements = this._footerRowL.querySelectorAll(".slick-footerrow-column");
              if (footerRowColumnElements.forEach(function(column) {
                var columnDef = Utils.storage.get(column, "column");
                columnDef && _this.trigger(_this.onBeforeFooterRowCellDestroy, {
                  node: _this,
                  column: columnDef,
                  grid: _this
                });
              }), Utils.emptyElement(this._footerRowL), this.hasFrozenColumns()) {
                var footerRowColumnElements_1 = this._footerRowR.querySelectorAll(".slick-footerrow-column");
                footerRowColumnElements_1.forEach(function(column) {
                  var columnDef = Utils.storage.get(column, "column");
                  columnDef && _this.trigger(_this.onBeforeFooterRowCellDestroy, {
                    node: _this,
                    column: columnDef,
                    grid: _this
                  });
                }), Utils.emptyElement(this._footerRowR);
              }
            }
            for (var i = 0; i < this.columns.length; i++) {
              var m = this.columns[i], headerTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, headerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerRowL : this._headerRowR : this._headerRowL, header = Utils.createDomElement("div", { id: "".concat(this.uid + m.id), dataset: { id: String(m.id) }, className: "ui-state-default slick-state-default slick-header-column", title: m.toolTip || "" }, headerTarget);
              Utils.createDomElement("span", { className: "slick-column-name", innerHTML: this.sanitizeHtmlString(m.name) }, header), Utils.width(header, m.width - this.headerColumnWidthDiff);
              var classname = m.headerCssClass || null;
              if (classname && (_a = header.classList).add.apply(_a, classname.split(" ")), classname = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseEnter.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseLeave.bind(this)), Utils.storage.put(header, "column", m), (this._options.enableColumnReorder || m.sortable) && (this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseHoverOn.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseHoverOff.bind(this))), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object)
                for (var key in m.headerCellAttrs)
                  m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
              if (m.sortable && (header.classList.add("slick-header-sortable"), Utils.createDomElement("div", { className: "slick-sort-indicator ".concat(this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : "") }, header), this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan && Utils.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), this.trigger(this.onHeaderCellRendered, {
                node: header,
                column: m,
                grid: this
              }), this._options.showHeaderRow) {
                var headerRowCell = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-headerrow-column l".concat(i, " r").concat(i) }, headerRowTarget), classname_1 = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
                classname_1 && headerRowCell.classList.add(classname_1), this._bindingEventService.bind(headerRowCell, "mouseenter", this.handleHeaderRowMouseEnter.bind(this)), this._bindingEventService.bind(headerRowCell, "mouseleave", this.handleHeaderRowMouseLeave.bind(this)), Utils.storage.put(headerRowCell, "column", m), this.trigger(this.onHeaderRowCellRendered, {
                  node: headerRowCell,
                  column: m,
                  grid: this
                });
              }
              if (this._options.createFooterRow && this._options.showFooterRow) {
                var footerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._footerRow[0] : this._footerRow[1] : this._footerRow[0], footerRowCell = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-footerrow-column l".concat(i, " r").concat(i) }, footerRowTarget);
                Utils.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
                  node: footerRowCell,
                  column: m,
                  grid: this
                });
              }
            }
            this.setSortColumns(this.sortColumns), this.setupColumnResize(), this._options.enableColumnReorder && (typeof this._options.enableColumnReorder == "function" ? this._options.enableColumnReorder(this, this._headers, this.headerColumnWidthDiff, this.setColumns, this.setupColumnResize, this.columns, this.getColumnIndex, this.uid, this.trigger) : this.setupColumnReorder());
          }, SlickGrid2.prototype.setupColumnSort = function() {
            var _this = this;
            this._headers.forEach(function(header) {
              _this._bindingEventService.bind(header, "click", function(e) {
                if (!_this.columnResizeDragging && !e.target.classList.contains("slick-resizable-handle")) {
                  var coll = e.target.closest(".slick-header-column");
                  if (coll) {
                    var column = Utils.storage.get(coll, "column");
                    if (column.sortable) {
                      if (!_this.getEditorLock().commitCurrentEdit())
                        return;
                      for (var previousSortColumns = _this.sortColumns.slice(), sortColumn = null, i = 0; i < _this.sortColumns.length; i++)
                        if (_this.sortColumns[i].columnId == column.id) {
                          sortColumn = _this.sortColumns[i], sortColumn.sortAsc = !sortColumn.sortAsc;
                          break;
                        }
                      var hadSortCol = !!sortColumn;
                      _this._options.tristateMultiColumnSort ? (sortColumn || (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }), hadSortCol && sortColumn.sortAsc && (_this.sortColumns.splice(i, 1), sortColumn = null), _this._options.multiColumnSort || (_this.sortColumns = []), sortColumn && (!hadSortCol || !_this._options.multiColumnSort) && _this.sortColumns.push(sortColumn)) : e.metaKey && _this._options.multiColumnSort ? sortColumn && _this.sortColumns.splice(i, 1) : ((!e.shiftKey && !e.metaKey || !_this._options.multiColumnSort) && (_this.sortColumns = []), sortColumn ? _this.sortColumns.length === 0 && _this.sortColumns.push(sortColumn) : (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }, _this.sortColumns.push(sortColumn)));
                      var onSortArgs = void 0;
                      _this._options.multiColumnSort ? onSortArgs = {
                        multiColumnSort: !0,
                        previousSortColumns,
                        sortCols: _this.sortColumns.map(function(col) {
                          return { columnId: _this.columns[_this.getColumnIndex(col.columnId)].id, sortCol: _this.columns[_this.getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
                        })
                      } : onSortArgs = {
                        multiColumnSort: !1,
                        previousSortColumns,
                        columnId: _this.sortColumns.length > 0 ? column.id : null,
                        sortCol: _this.sortColumns.length > 0 ? column : null,
                        sortAsc: _this.sortColumns.length > 0 ? _this.sortColumns[0].sortAsc : !0
                      }, _this.trigger(_this.onBeforeSort, onSortArgs, e).getReturnValue() !== !1 && (_this.setSortColumns(_this.sortColumns), _this.trigger(_this.onSort, onSortArgs, e));
                    }
                  }
                }
              });
            });
          }, SlickGrid2.prototype.currentPositionInHeader = function(id) {
            var currentPosition = 0;
            return this._headers.forEach(function(header) {
              var columnElements = header.querySelectorAll(".slick-header-column");
              columnElements.forEach(function(column, i) {
                column.id == id && (currentPosition = i);
              });
            }), currentPosition;
          }, SlickGrid2.prototype.remove = function(arr, elem) {
            var index = arr.lastIndexOf(elem);
            index > -1 && (arr.splice(index, 1), this.remove(arr, elem));
          }, SlickGrid2.prototype.setupColumnReorder = function() {
            var _this = this;
            this.sortableSideLeftInstance && (this.sortableSideLeftInstance.destroy(), this.sortableSideRightInstance.destroy());
            var columnScrollTimer = null, scrollColumnsRight = function() {
              return _this._viewportScrollContainerX.scrollLeft = _this._viewportScrollContainerX.scrollLeft + 10;
            }, scrollColumnsLeft = function() {
              return _this._viewportScrollContainerX.scrollLeft = _this._viewportScrollContainerX.scrollLeft - 10;
            }, canDragScroll, sortableOptions = {
              animation: 50,
              direction: "horizontal",
              chosenClass: "slick-header-column-active",
              ghostClass: "slick-sortable-placeholder",
              draggable: ".slick-header-column",
              dragoverBubble: !1,
              revertClone: !0,
              scroll: !this.hasFrozenColumns(),
              onStart: function(e) {
                canDragScroll = !_this.hasFrozenColumns() || Utils.offset(e.item).left > Utils.offset(_this._viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > _this._container.clientWidth ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils.offset(_this._viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsLeft, 100)) : (clearInterval(columnScrollTimer), columnScrollTimer = null);
              },
              onEnd: function(e) {
                var _a, _b, cancel = !1;
                clearInterval(columnScrollTimer), columnScrollTimer = null;
                var limit;
                if (!(cancel || !_this.getEditorLock().commitCurrentEdit())) {
                  var reorderedIds = (_a = _this.sortableSideLeftInstance) === null || _a === void 0 ? void 0 : _a.toArray();
                  reorderedIds = reorderedIds.concat((_b = _this.sortableSideRightInstance) === null || _b === void 0 ? void 0 : _b.toArray());
                  for (var reorderedColumns = [], i = 0; i < reorderedIds.length; i++)
                    reorderedColumns.push(_this.columns[_this.getColumnIndex(reorderedIds[i])]);
                  _this.setColumns(reorderedColumns), _this.trigger(_this.onColumnsReordered, { impactedColumns: _this.getImpactedColumns(limit) }), e.stopPropagation(), _this.setupColumnResize();
                }
              }
            };
            this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions), this.sortableSideRightInstance = Sortable.create(this._headerR, sortableOptions);
          }, SlickGrid2.prototype.getHeaderChildren = function() {
            var a = Array.from(this._headers[0].children), b = Array.from(this._headers[1].children);
            return a.concat(b);
          }, SlickGrid2.prototype.getImpactedColumns = function(limit) {
            var impactedColumns = [];
            if (limit)
              for (var i = limit.start; i <= limit.end; i++)
                impactedColumns.push(this.columns[i]);
            else
              impactedColumns = this.columns;
            return impactedColumns;
          }, SlickGrid2.prototype.handleResizeableHandleDoubleClick = function(evt) {
            var triggeredByColumn = evt.target.parentElement.id.replace(this.uid, "");
            this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn });
          }, SlickGrid2.prototype.setupColumnResize = function() {
            var _this = this;
            if (typeof Resizable == "undefined")
              throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
            for (var j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable = -1, frozenLeftColMaxWidth = 0, children = this.getHeaderChildren(), i = 0; i < children.length; i++) {
              var child = children[i], handles = child.querySelectorAll(".slick-resizable-handle");
              handles.forEach(function(handle) {
                return handle.remove();
              }), !(i >= this.columns.length || !this.columns[i] || this.columns[i].hidden) && this.columns[i].resizable && (firstResizable === void 0 && (firstResizable = i), lastResizable = i);
            }
            if (firstResizable !== void 0)
              for (var _loop_1 = function(i2) {
                var colElm = children[i2];
                if (i2 >= this_1.columns.length || !this_1.columns[i2] || this_1.columns[i2].hidden || i2 < firstResizable || this_1._options.forceFitColumns && i2 >= lastResizable)
                  return "continue";
                var resizeableHandle = Utils.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
                this_1._bindingEventService.bind(resizeableHandle, "dblclick", this_1.handleResizeableHandleDoubleClick.bind(this_1)), this_1.slickResizableInstances.push(Resizable({
                  resizeableElement: colElm,
                  resizeableHandleElement: resizeableHandle,
                  onResizeStart: function(e, resizeElms) {
                    var targetEvent = e.touches ? e.touches[0] : e;
                    if (!_this.getEditorLock().commitCurrentEdit())
                      return !1;
                    pageX = targetEvent.pageX, frozenLeftColMaxWidth = 0, resizeElms.resizeableElement.classList.add("slick-header-column-active");
                    for (var shrinkLeewayOnRight = null, stretchLeewayOnRight = null, pw = 0; pw < children.length; pw++)
                      pw >= _this.columns.length || !_this.columns[pw] || _this.columns[pw].hidden || (_this.columns[pw].previousWidth = children[pw].offsetWidth);
                    if (_this._options.forceFitColumns)
                      for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i2 + 1; j < _this.columns.length; j++)
                        c = _this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnRight = null), shrinkLeewayOnRight += (c.previousWidth || 0) - Math.max(c.minWidth || 0, _this.absoluteColumnMinWidth));
                    var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
                    for (j = 0; j <= i2; j++)
                      c = _this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, _this.absoluteColumnMinWidth));
                    shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
                  },
                  onResize: function(e, resizeElms) {
                    var _a, _b, targetEvent = e.touches ? e.touches[0] : e;
                    _this.columnResizeDragging = !0;
                    var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = _this.viewportHasVScroll ? _this.viewportW - ((_b = (_a = _this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) : _this.viewportW;
                    if (d < 0) {
                      for (x = d, j = i2; j >= 0; j--)
                        c = _this.columns[j], c && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, _this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                      for (k = 0; k <= i2; k++)
                        c = _this.columns[k], !(!c || c.hidden) && (_this.hasFrozenColumns() && k > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                      if (_this._options.forceFitColumns)
                        for (x = -d, j = i2 + 1; j < _this.columns.length; j++)
                          c = _this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), _this.hasFrozenColumns() && j > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                      else
                        for (j = i2 + 1; j < _this.columns.length; j++)
                          c = _this.columns[j], !(!c || c.hidden) && (_this.hasFrozenColumns() && j > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                      if (_this._options.forceFitColumns)
                        for (x = -d, j = i2 + 1; j < _this.columns.length; j++)
                          c = _this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                    } else {
                      for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i2; j >= 0; j--)
                        if (c = _this.columns[j], !(!c || c.hidden) && c.resizable)
                          if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x)
                            x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth;
                          else {
                            var newWidth = (c.previousWidth || 0) + x, resizedCanvasWidthL = _this.canvasWidthL + x;
                            _this.hasFrozenColumns() && j <= _this._options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - _this._options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + _this._options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                          }
                      for (k = 0; k <= i2; k++)
                        c = _this.columns[k], !(!c || c.hidden) && (_this.hasFrozenColumns() && k > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                      if (_this._options.forceFitColumns)
                        for (x = -d, j = i2 + 1; j < _this.columns.length; j++)
                          c = _this.columns[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, _this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), _this.hasFrozenColumns() && j > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                      else
                        for (j = i2 + 1; j < _this.columns.length; j++)
                          c = _this.columns[j], !(!c || c.hidden) && (_this.hasFrozenColumns() && j > _this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                    }
                    _this.hasFrozenColumns() && newCanvasWidthL !== _this.canvasWidthL && (Utils.width(_this._headerL, newCanvasWidthL + 1e3), Utils.setStyleSize(_this._paneHeaderR, "left", newCanvasWidthL)), _this.applyColumnHeaderWidths(), _this._options.syncColumnCellResize && _this.applyColumnWidths(), _this.trigger(_this.onColumnsDrag, {
                      triggeredByColumn: resizeElms.resizeableElement,
                      resizeHandle: resizeElms.resizeableHandleElement
                    });
                  },
                  onResizeEnd: function(_e, resizeElms) {
                    resizeElms.resizeableElement.classList.remove("slick-header-column-active");
                    var triggeredByColumn = resizeElms.resizeableElement.id.replace(_this.uid, "");
                    _this.trigger(_this.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === !0 && _this.applyColumnHeaderWidths();
                    var newWidth;
                    for (j = 0; j < _this.columns.length; j++)
                      c = _this.columns[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && _this.invalidateAllRows());
                    _this.updateCanvasWidth(!0), _this.render(), _this.trigger(_this.onColumnsResized, { triggeredByColumn }), setTimeout(function() {
                      _this.columnResizeDragging = !1;
                    }, 300);
                  }
                }));
              }, this_1 = this, i = 0; i < children.length; i++)
                _loop_1(i);
          }, SlickGrid2.prototype.getVBoxDelta = function(el) {
            var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
            return p.forEach(function(val) {
              return delta += Utils.toFloat(styles[val]);
            }), delta;
          }, SlickGrid2.prototype.setFrozenOptions = function() {
            if (this._options.frozenColumn = this._options.frozenColumn >= 0 && this._options.frozenColumn < this.columns.length ? parseInt(this._options.frozenColumn) : -1, this._options.frozenRow > -1) {
              this.hasFrozenRows = !0, this.frozenRowsHeight = this._options.frozenRow * this._options.rowHeight;
              var dataLength = this.getDataLength();
              this.actualFrozenRow = this._options.frozenBottom ? dataLength - this._options.frozenRow : this._options.frozenRow;
            } else
              this.hasFrozenRows = !1;
          }, SlickGrid2.prototype.setPaneVisibility = function() {
            this.hasFrozenColumns() ? (Utils.show(this._paneHeaderR), Utils.show(this._paneTopR), this.hasFrozenRows ? (Utils.show(this._paneBottomL), Utils.show(this._paneBottomR)) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL))) : (Utils.hide(this._paneHeaderR), Utils.hide(this._paneTopR), Utils.hide(this._paneBottomR), this.hasFrozenRows ? Utils.show(this._paneBottomL) : (Utils.hide(this._paneBottomR), Utils.hide(this._paneBottomL)));
          }, SlickGrid2.prototype.setOverflow = function() {
            var _a, _b, _c, _d;
            this._viewportTopL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportTopR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? this.hasFrozenRows ? "scroll" : "auto" : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "auto") : (this.hasFrozenRows, "auto"), this._options.viewportClass && ((_a = this._viewportTopL.classList).add.apply(_a, this._options.viewportClass.split(" ")), (_b = this._viewportTopR.classList).add.apply(_b, this._options.viewportClass.split(" ")), (_c = this._viewportBottomL.classList).add.apply(_c, this._options.viewportClass.split(" ")), (_d = this._viewportBottomR.classList).add.apply(_d, this._options.viewportClass.split(" ")));
          }, SlickGrid2.prototype.setScroller = function() {
            this.hasFrozenColumns() ? (this._headerScrollContainer = this._headerScrollerR, this._headerRowScrollContainer = this._headerRowScrollerR, this._footerRowScrollContainer = this._footerRowScrollerR, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomR, this._viewportScrollContainerY = this._viewportTopR) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomR : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopR) : (this._headerScrollContainer = this._headerScrollerL, this._headerRowScrollContainer = this._headerRowScrollerL, this._footerRowScrollContainer = this._footerRowScrollerL, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomL, this._viewportScrollContainerY = this._viewportTopL) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomL : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopL);
          }, SlickGrid2.prototype.measureCellPaddingAndBorder = function() {
            var _this = this, h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = this._headers[0];
            this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0, this.cellWidthDiff = this.cellHeightDiff = 0;
            var el = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
            style.boxSizing !== "border-box" && (h.forEach(function(val) {
              return _this.headerColumnWidthDiff += Utils.toFloat(style[val]);
            }), v.forEach(function(val) {
              return _this.headerColumnHeightDiff += Utils.toFloat(style[val]);
            })), el.remove();
            var r = Utils.createDomElement("div", { className: "slick-row" }, this._canvas[0]);
            el = Utils.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden" }, textContent: "-" }, r), style = getComputedStyle(el), style.boxSizing !== "border-box" && (h.forEach(function(val) {
              return _this.cellWidthDiff += Utils.toFloat(style[val]);
            }), v.forEach(function(val) {
              return _this.cellHeightDiff += Utils.toFloat(style[val]);
            })), r.remove(), this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
          }, SlickGrid2.prototype.createCssRules = function() {
            var template = Utils.createDomElement("template", { innerHTML: '<style type="text/css" rel="stylesheet" />' });
            this._style = template.content.firstChild, document.head.appendChild(this._style);
            for (var rowHeight = this._options.rowHeight - this.cellHeightDiff, rules = [
              ".".concat(this.uid, " .slick-group-header-column { left: 1000px; }"),
              ".".concat(this.uid, " .slick-header-column { left: 1000px; }"),
              ".".concat(this.uid, " .slick-top-panel { height: ").concat(this._options.topPanelHeight, "px; }"),
              ".".concat(this.uid, " .slick-preheader-panel { height: ").concat(this._options.preHeaderPanelHeight, "px; }"),
              ".".concat(this.uid, " .slick-headerrow-columns { height: ").concat(this._options.headerRowHeight, "px; }"),
              ".".concat(this.uid, " .slick-footerrow-columns { height: ").concat(this._options.footerRowHeight, "px; }"),
              ".".concat(this.uid, " .slick-cell { height: ").concat(rowHeight, "px; }"),
              ".".concat(this.uid, " .slick-row { height: ").concat(this._options.rowHeight, "px; }")
            ], i = 0; i < this.columns.length; i++)
              !this.columns[i] || this.columns[i].hidden || (rules.push(".".concat(this.uid, " .l").concat(i, " { }")), rules.push(".".concat(this.uid, " .r").concat(i, " { }")));
            this._style.styleSheet ? this._style.styleSheet.cssText = rules.join(" ") : this._style.appendChild(document.createTextNode(rules.join(" ")));
          }, SlickGrid2.prototype.getColumnCssRules = function(idx) {
            var i;
            if (!this.stylesheet) {
              var sheets = document.styleSheets;
              for (i = 0; i < sheets.length; i++)
                if ((sheets[i].ownerNode || sheets[i].owningElement) == this._style) {
                  this.stylesheet = sheets[i];
                  break;
                }
              if (!this.stylesheet)
                throw new Error("SlickGrid Cannot find stylesheet.");
              this.columnCssRulesL = [], this.columnCssRulesR = [];
              var cssRules = this.stylesheet.cssRules || this.stylesheet.rules, matches = void 0, columnIdx = void 0;
              for (i = 0; i < cssRules.length; i++) {
                var selector = cssRules[i].selectorText;
                (matches = /\.l\d+/.exec(selector)) ? (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesL[columnIdx] = cssRules[i]) : (matches = /\.r\d+/.exec(selector)) && (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesR[columnIdx] = cssRules[i]);
              }
            }
            return {
              left: this.columnCssRulesL[idx],
              right: this.columnCssRulesR[idx]
            };
          }, SlickGrid2.prototype.removeCssRules = function() {
            this._style.remove(), this.stylesheet = null;
          }, SlickGrid2.prototype.destroy = function(shouldDestroyAllElements) {
            var _this = this, _a;
            this._bindingEventService.unbindAll(), this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance), this.slickMouseWheelInstances = this.destroyAllInstances(this.slickMouseWheelInstances), this.slickResizableInstances = this.destroyAllInstances(this.slickResizableInstances), this.getEditorLock().cancelCurrentEdit(), this.trigger(this.onBeforeDestroy, {});
            for (var i = this.plugins.length; i--; )
              this.unregisterPlugin(this.plugins[i]);
            this._options.enableColumnReorder && typeof ((_a = this.sortableSideLeftInstance) === null || _a === void 0 ? void 0 : _a.destroy) == "function" && (this.sortableSideLeftInstance.destroy(), this.sortableSideRightInstance.destroy()), this.unbindAncestorScrollEvents(), this._bindingEventService.unbindByEventName(this._container, "resize"), this.removeCssRules(), this._canvas.forEach(function(element) {
              _this._bindingEventService.unbindByEventName(element, "keydown"), _this._bindingEventService.unbindByEventName(element, "click"), _this._bindingEventService.unbindByEventName(element, "dblclick"), _this._bindingEventService.unbindByEventName(element, "contextmenu"), _this._bindingEventService.unbindByEventName(element, "mouseover"), _this._bindingEventService.unbindByEventName(element, "mouseout");
            }), this._viewport.forEach(function(view) {
              _this._bindingEventService.unbindByEventName(view, "scroll");
            }), this._headerScroller.forEach(function(el) {
              _this._bindingEventService.unbindByEventName(el, "contextmenu"), _this._bindingEventService.unbindByEventName(el, "click");
            }), this._headerRowScroller.forEach(function(scroller) {
              _this._bindingEventService.unbindByEventName(scroller, "scroll");
            }), this._footerRow && this._footerRow.forEach(function(footer) {
              _this._bindingEventService.unbindByEventName(footer, "contextmenu"), _this._bindingEventService.unbindByEventName(footer, "click");
            }), this._footerRowScroller && this._footerRowScroller.forEach(function(scroller) {
              _this._bindingEventService.unbindByEventName(scroller, "scroll");
            }), this._preHeaderPanelScroller && this._bindingEventService.unbindByEventName(this._preHeaderPanelScroller, "scroll"), this._bindingEventService.unbindByEventName(this._focusSink, "keydown"), this._bindingEventService.unbindByEventName(this._focusSink2, "keydown");
            var resizeHandles = this._container.querySelectorAll(".slick-resizable-handle");
            [].forEach.call(resizeHandles, function(handle) {
              _this._bindingEventService.unbindByEventName(handle, "dblclick");
            });
            var headerColumns = this._container.querySelectorAll(".slick-header-column");
            [].forEach.call(headerColumns, function(column) {
              _this._bindingEventService.unbindByEventName(column, "mouseenter"), _this._bindingEventService.unbindByEventName(column, "mouseleave"), _this._bindingEventService.unbindByEventName(column, "mouseenter"), _this._bindingEventService.unbindByEventName(column, "mouseleave");
            }), Utils.emptyElement(this._container), this._container.classList.remove(this.uid), shouldDestroyAllElements && this.destroyAllElements();
          }, SlickGrid2.prototype.destroyAllInstances = function(inputInstances) {
            if (inputInstances)
              for (var instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance = void 0; (instance = instances.pop()) != null; )
                instance && typeof instance.destroy == "function" && instance.destroy();
            return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
          }, SlickGrid2.prototype.destroyAllElements = function() {
            this._activeCanvasNode = null, this._activeViewportNode = null, this._boundAncestors = null, this._canvas = null, this._canvasTopL = null, this._canvasTopR = null, this._canvasBottomL = null, this._canvasBottomR = null, this._container = null, this._focusSink = null, this._focusSink2 = null, this._groupHeaders = null, this._groupHeadersL = null, this._groupHeadersR = null, this._headerL = null, this._headerR = null, this._headers = null, this._headerRows = null, this._headerRowL = null, this._headerRowR = null, this._headerRowSpacerL = null, this._headerRowSpacerR = null, this._headerRowScrollContainer = null, this._headerRowScroller = null, this._headerRowScrollerL = null, this._headerRowScrollerR = null, this._headerScrollContainer = null, this._headerScroller = null, this._headerScrollerL = null, this._headerScrollerR = null, this._hiddenParents = null, this._footerRow = null, this._footerRowL = null, this._footerRowR = null, this._footerRowSpacerL = null, this._footerRowSpacerR = null, this._footerRowScroller = null, this._footerRowScrollerL = null, this._footerRowScrollerR = null, this._footerRowScrollContainer = null, this._preHeaderPanel = null, this._preHeaderPanelR = null, this._preHeaderPanelScroller = null, this._preHeaderPanelScrollerR = null, this._preHeaderPanelSpacer = null, this._preHeaderPanelSpacerR = null, this._topPanels = null, this._topPanelScrollers = null, this._style = null, this._topPanelScrollerL = null, this._topPanelScrollerR = null, this._topPanelL = null, this._topPanelR = null, this._paneHeaderL = null, this._paneHeaderR = null, this._paneTopL = null, this._paneTopR = null, this._paneBottomL = null, this._paneBottomR = null, this._viewport = null, this._viewportTopL = null, this._viewportTopR = null, this._viewportBottomL = null, this._viewportBottomR = null, this._viewportScrollContainerX = null, this._viewportScrollContainerY = null;
          }, SlickGrid2.prototype.autosizeColumn = function(columnOrIndexOrId, isInit) {
            var colDef = null, colIndex = -1;
            if (typeof columnOrIndexOrId == "number")
              colDef = this.columns[columnOrIndexOrId], colIndex = columnOrIndexOrId;
            else if (typeof columnOrIndexOrId == "string")
              for (var i = 0; i < this.columns.length; i++)
                this.columns[i].id === columnOrIndexOrId && (colDef = this.columns[i], colIndex = i);
            if (colDef) {
              var gridCanvas = this.getCanvasNode(0, 0);
              this.getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit || !1, colIndex);
            }
          }, SlickGrid2.prototype.treatAsLocked = function(autoSize) {
            var _a;
            return autoSize === void 0 && (autoSize = {}), !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && ((_a = autoSize.widthPx) !== null && _a !== void 0 ? _a : 0) < 100;
          }, SlickGrid2.prototype.autosizeColumns = function(autosizeMode, isInit) {
            this.cacheCssForHiddenInit(), this.internalAutosizeColumns(autosizeMode, isInit), this.restoreCssFromHiddenInit();
          }, SlickGrid2.prototype.internalAutosizeColumns = function(autosizeMode, isInit) {
            var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            if (autosizeMode = autosizeMode || this._options.autosizeColsMode, autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
              this.legacyAutosizeColumns();
              return;
            }
            if (autosizeMode !== GridAutosizeColsMode.None) {
              this.canvas = document.createElement("canvas"), !((_a = this.canvas) === null || _a === void 0) && _a.getContext && (this.canvas_context = this.canvas.getContext("2d"));
              var gridCanvas = this.getCanvasNode(0, 0), viewportWidth = this.viewportHasVScroll ? this.viewportW - ((_c = (_b = this.scrollbarDimensions) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0) : this.viewportW, i, c, colWidth, reRender = !1, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
              for (i = 0; i < this.columns.length; i++)
                c = this.columns[i], this.getColAutosizeWidth(c, i, gridCanvas, isInit || !1, i), totalLockedColWidth += ((_d = c.autoSize) === null || _d === void 0 ? void 0 : _d.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) && ((_f = c.autoSize) === null || _f === void 0 ? void 0 : _f.widthPx) || 0, totalMinWidth += ((_g = c.autoSize) === null || _g === void 0 ? void 0 : _g.autosizeMode) === ColAutosizeMode.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) ? ((_h = c.autoSize) === null || _h === void 0 ? void 0 : _h.widthPx) || 0 : c.minWidth || 0, totalWidth += ((_j = c.autoSize) === null || _j === void 0 ? void 0 : _j.widthPx) || 0, totalWidthLessSTR += !((_k = c.autoSize) === null || _k === void 0) && _k.sizeToRemaining ? 0 : ((_l = c.autoSize) === null || _l === void 0 ? void 0 : _l.widthPx) || 0, strColsMinWidth += !((_m = c.autoSize) === null || _m === void 0) && _m.sizeToRemaining && c.minWidth || 0;
              var strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
              if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
                var setWidth = totalWidth + ((_p = (_o = this.scrollbarDimensions) === null || _o === void 0 ? void 0 : _o.width) !== null && _p !== void 0 ? _p : 0);
                autosizeMode = GridAutosizeColsMode.IgnoreViewport, this._options.viewportMaxWidthPx && setWidth > this._options.viewportMaxWidthPx ? (setWidth = this._options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport) : this._options.viewportMinWidthPx && setWidth < this._options.viewportMinWidthPx && (setWidth = this._options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport), Utils.width(this._container, setWidth);
              }
              if (autosizeMode === GridAutosizeColsMode.FitColsToViewport)
                if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
                  for (i = 0; i < this.columns.length; i++)
                    if (c = this.columns[i], !(!c || c.hidden)) {
                      var totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
                      !((_q = c.autoSize) === null || _q === void 0) && _q.sizeToRemaining ? colWidth = totalSTRViewportWidth * (((_r = c.autoSize) === null || _r === void 0 ? void 0 : _r.widthPx) || 0) / strColTotalGuideWidth : colWidth = ((_s = c.autoSize) === null || _s === void 0 ? void 0 : _s.widthPx) || 0, c.rerenderOnResize && (c.width || 0) !== colWidth && (reRender = !0), c.width = colWidth;
                    }
                } else if (this._options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * this._options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
                  autosizeMode = GridAutosizeColsMode.IgnoreViewport;
                else {
                  var unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
                  for (i = 0; i < this.columns.length; i++)
                    c = this.columns[i], !(!c || c.hidden) && (colWidth = c.width || 0, ((_t = c.autoSize) === null || _t === void 0 ? void 0 : _t.autosizeMode) !== ColAutosizeMode.Locked && !this.treatAsLocked(c.autoSize) && (!((_u = c.autoSize) === null || _u === void 0) && _u.sizeToRemaining ? colWidth = c.minWidth || 0 : (colWidth = unallocatedViewportWidth / unallocatedColWidth * (((_v = c.autoSize) === null || _v === void 0 ? void 0 : _v.widthPx) || 0) - 1, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0), unallocatedColWidth -= ((_w = c.autoSize) === null || _w === void 0 ? void 0 : _w.widthPx) || 0, unallocatedViewportWidth -= colWidth)), this.treatAsLocked(c.autoSize) && (colWidth = ((_x = c.autoSize) === null || _x === void 0 ? void 0 : _x.widthPx) || 0, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0)), c.rerenderOnResize && c.width !== colWidth && (reRender = !0), c.width = colWidth);
                }
              if (autosizeMode === GridAutosizeColsMode.IgnoreViewport)
                for (i = 0; i < this.columns.length; i++)
                  !this.columns[i] || this.columns[i].hidden || (colWidth = ((_y = this.columns[i].autoSize) === null || _y === void 0 ? void 0 : _y.widthPx) || 0, this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth && (reRender = !0), this.columns[i].width = colWidth);
              this.reRenderColumns(reRender);
            }
          }, SlickGrid2.prototype.LogColWidths = function() {
            for (var s = "Col Widths:", i = 0; i < this.columns.length; i++)
              s += " " + (this.columns[i].hidden ? "H" : this.columns[i].width);
            console.log(s);
          }, SlickGrid2.prototype.getColAutosizeWidth = function(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
            var _a, autoSize = columnDef.autoSize;
            if (autoSize.widthPx = columnDef.width, !(autoSize.autosizeMode === ColAutosizeMode.Locked || autoSize.autosizeMode === ColAutosizeMode.Guide)) {
              var dl = this.getDataLength(), isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);
              if (autoSize.autosizeMode === ColAutosizeMode.ContentIntelligent) {
                var colDataTypeOf = autoSize.colDataTypeOf, colDataItem = void 0;
                if (dl > 0) {
                  var tempRow = this.getDataItem(0);
                  tempRow && (colDataItem = tempRow[columnDef.field], isoDateRegExp.test(colDataItem) && (colDataItem = Date.parse(colDataItem)), colDataTypeOf = typeof colDataItem, colDataTypeOf === "object" && (colDataItem instanceof Date && (colDataTypeOf = "date"), typeof moment != "undefined" && colDataItem instanceof moment && (colDataTypeOf = "moment")));
                }
                colDataTypeOf === "boolean" && (autoSize.colValueArray = [!0, !1]), colDataTypeOf === "number" && (autoSize.valueFilterMode = ValueFilterMode.GetGreatestAndSub, autoSize.rowSelectionMode = RowSelectionMode.AllRows), colDataTypeOf === "string" && (autoSize.valueFilterMode = ValueFilterMode.GetLongestText, autoSize.rowSelectionMode = RowSelectionMode.AllRows, autoSize.allowAddlPercent = 5), colDataTypeOf === "date" && (autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]), colDataTypeOf === "moment" && typeof moment != "undefined" && (autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]);
              }
              var colWidth = autoSize.contentSizePx = this.getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);
              colWidth === 0 && (colWidth = autoSize.widthPx || 0);
              var addlPercentMultiplier = autoSize.allowAddlPercent ? 1 + autoSize.allowAddlPercent / 100 : 1;
              colWidth = colWidth * addlPercentMultiplier + (this._options.autosizeColPaddingPx || 0), columnDef.minWidth && colWidth < columnDef.minWidth && (colWidth = columnDef.minWidth), columnDef.maxWidth && colWidth > columnDef.maxWidth && (colWidth = columnDef.maxWidth), (autoSize.autosizeMode === ColAutosizeMode.ContentExpandOnly || !((_a = columnDef == null ? void 0 : columnDef.editor) === null || _a === void 0) && _a.ControlFillsColumn) && colWidth < (columnDef.width || 0) && (colWidth = columnDef.width || 0), autoSize.widthPx = colWidth;
            }
          }, SlickGrid2.prototype.getColContentSize = function(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
            var _this = this, autoSize = columnDef.autoSize, widthAdjustRatio = 1, i, tempVal, maxLen = 0, maxColWidth = 0;
            if (autoSize.headerWidthPx = 0, autoSize.ignoreHeaderText || (autoSize.headerWidthPx = this.getColHeaderWidth(columnDef)), autoSize.headerWidthPx === 0 && (autoSize.headerWidthPx = columnDef.width ? columnDef.width : columnDef.maxWidth ? columnDef.maxWidth : columnDef.minWidth ? columnDef.minWidth : 20), autoSize.colValueArray)
              return maxColWidth = this.getColWidth(columnDef, gridCanvas, autoSize.colValueArray), Math.max(autoSize.headerWidthPx, maxColWidth);
            var rowInfo = {};
            rowInfo.colIndex = colIndex, rowInfo.rowCount = this.getDataLength(), rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.rowCount - 1, rowInfo.valueArr = null, rowInfo.getRowVal = function(i2) {
              return _this.getDataItem(i2)[columnDef.field];
            };
            var rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : void 0) || autoSize.rowSelectionMode;
            if (rowSelectionMode === RowSelectionMode.FirstRow && (rowInfo.endIndex = 0), rowSelectionMode === RowSelectionMode.LastRow && (rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1), rowSelectionMode === RowSelectionMode.FirstNRows && (rowInfo.endIndex = Math.min(autoSize.rowSelectionCount || 0, rowInfo.rowCount) - 1), autoSize.valueFilterMode === ValueFilterMode.DeDuplicate) {
              var rowsDict = {};
              for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
                rowsDict[rowInfo.getRowVal(i)] = !0;
              if (Object.keys)
                rowInfo.valueArr = Object.keys(rowsDict);
              else {
                rowInfo.valueArr = [];
                for (var v in rowsDict)
                  rowInfo.valueArr.push(v);
              }
              rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.length - 1;
            }
            if (autoSize.valueFilterMode === ValueFilterMode.GetGreatestAndSub) {
              var maxVal = void 0, maxAbsVal = 0;
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
              var maxIndex = 0;
              for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
                tempVal = rowInfo.getRowVal(i), (tempVal || "").length > maxLen && (maxLen = tempVal.length, maxIndex = i);
              tempVal = rowInfo.getRowVal(maxIndex), rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
            }
            return rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1 && (autoSize.sizeToRemaining = !0), maxColWidth = this.getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio, Math.max(autoSize.headerWidthPx, maxColWidth);
          }, SlickGrid2.prototype.getColWidth = function(columnDef, gridCanvas, rowInfo) {
            var _a, _b, _c, rowEl = Utils.createDomElement("div", { className: "slick-row ui-widget-content" }, gridCanvas), cellEl = Utils.createDomElement("div", { className: "slick-cell" }, rowEl);
            cellEl.style.position = "absolute", cellEl.style.visibility = "hidden", cellEl.style.textOverflow = "initial", cellEl.style.whiteSpace = "nowrap";
            var i, len, max = 0, maxText = "", formatterResult, val, useCanvas = columnDef.autoSize.widthEvalMode === WidthEvalMode.TextOnly;
            if (((_a = columnDef.autoSize) === null || _a === void 0 ? void 0 : _a.widthEvalMode) === WidthEvalMode.Auto) {
              var noFormatter = !columnDef.formatterOverride && !columnDef.formatter, formatterIsText = ((_b = columnDef == null ? void 0 : columnDef.formatterOverride) === null || _b === void 0 ? void 0 : _b.ReturnsTextOnly) || !columnDef.formatterOverride && ((_c = columnDef.formatter) === null || _c === void 0 ? void 0 : _c.ReturnsTextOnly);
              useCanvas = noFormatter || formatterIsText;
            }
            if (this.canvas_context && useCanvas) {
              var style = getComputedStyle(cellEl);
              for (this.canvas_context.font = style.fontSize + " " + style.fontFamily, i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
                val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, len = formatterResult ? this.canvas_context.measureText(formatterResult).width : 0, len > max && (max = len, maxText = formatterResult);
              return cellEl.innerHTML = maxText, len = cellEl.offsetWidth, rowEl.remove(), len;
            }
            for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
              val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, this.applyFormatResultToCellNode(formatterResult, cellEl), len = cellEl.offsetWidth, len > max && (max = len);
            return rowEl.remove(), max;
          }, SlickGrid2.prototype.getColHeaderWidth = function(columnDef) {
            var _a, width = 0, headerColElId = this.getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = "".concat(headerColElId, "_"), clone = headerColEl.cloneNode(!0);
            if (headerColEl)
              clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width = clone.offsetWidth, clone.parentNode.removeChild(clone);
            else {
              var header = this.getHeader(columnDef);
              headerColEl = Utils.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header), Utils.createDomElement("span", { className: "slick-column-name", innerHTML: this.sanitizeHtmlString(String(columnDef.name)) }, headerColEl), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", columnDef.headerCssClass && (_a = headerColEl.classList).add.apply(_a, (columnDef.headerCssClass || "").split(" ")), width = headerColEl.offsetWidth, header.removeChild(headerColEl);
            }
            return width;
          }, SlickGrid2.prototype.legacyAutosizeColumns = function() {
            var _a, _b, i, c, shrinkLeeway = 0, total = 0, prevTotal = 0, widths = [], availWidth = this.viewportHasVScroll ? this.viewportW - ((_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) : this.viewportW;
            for (i = 0; i < this.columns.length; i++)
              c = this.columns[i], !(!c || c.hidden) && (widths.push(c.width || 0), total += c.width || 0, c.resizable && (shrinkLeeway += (c.width || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth)));
            for (prevTotal = total; total > availWidth && shrinkLeeway; ) {
              var shrinkProportion = (total - availWidth) / shrinkLeeway;
              for (i = 0; i < this.columns.length && total > availWidth; i++)
                if (c = this.columns[i], !(!c || c.hidden)) {
                  var width = widths[i];
                  if (!(!c.resizable || width <= c.minWidth || width <= this.absoluteColumnMinWidth)) {
                    var absMinWidth = Math.max(c.minWidth, this.absoluteColumnMinWidth), shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
                    shrinkSize = Math.min(shrinkSize, width - absMinWidth), total -= shrinkSize, shrinkLeeway -= shrinkSize, widths[i] -= shrinkSize;
                  }
                }
              if (prevTotal <= total)
                break;
              prevTotal = total;
            }
            for (prevTotal = total; total < availWidth; ) {
              var growProportion = availWidth / total;
              for (i = 0; i < this.columns.length && total < availWidth; i++)
                if (c = this.columns[i], !(!c || c.hidden)) {
                  var currentWidth = widths[i], growSize = void 0;
                  !c.resizable || c.maxWidth <= currentWidth ? growSize = 0 : growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1e6) || 1, total += growSize, widths[i] += total <= availWidth ? growSize : 0;
                }
              if (prevTotal >= total)
                break;
              prevTotal = total;
            }
            var reRender = !1;
            for (i = 0; i < this.columns.length; i++)
              !c || c.hidden || (this.columns[i].rerenderOnResize && this.columns[i].width !== widths[i] && (reRender = !0), this.columns[i].width = widths[i]);
            this.reRenderColumns(reRender);
          }, SlickGrid2.prototype.reRenderColumns = function(reRender) {
            this.applyColumnHeaderWidths(), this.updateCanvasWidth(!0), this.trigger(this.onAutosizeColumns, { columns: this.columns }), reRender && (this.invalidateAllRows(), this.render());
          }, SlickGrid2.prototype.getVisibleColumns = function() {
            return this.columns.filter(function(c) {
              return !c.hidden;
            });
          }, SlickGrid2.prototype.trigger = function(evt, args2, e) {
            var event = e || new SlickEventData(e, args2), eventArgs = args2 || {};
            return eventArgs.grid = this, evt.notify(eventArgs, event, this);
          }, SlickGrid2.prototype.getEditorLock = function() {
            return this._options.editorLock;
          }, SlickGrid2.prototype.getEditController = function() {
            return this.editController;
          }, SlickGrid2.prototype.getColumnIndex = function(id) {
            return this.columnsById[id];
          }, SlickGrid2.prototype.applyColumnHeaderWidths = function() {
            var _this = this;
            if (this.initialized) {
              var columnIndex = 0, vc = this.getVisibleColumns();
              this._headers.forEach(function(header) {
                for (var i = 0; i < header.children.length; i++, columnIndex++) {
                  var h = header.children[i], col = vc[columnIndex] || {}, width = (col.width || 0) - _this.headerColumnWidthDiff;
                  Utils.width(h) !== width && Utils.width(h, width);
                }
              }), this.updateColumnCaches();
            }
          }, SlickGrid2.prototype.applyColumnWidths = function() {
            for (var _a, x = 0, w = 0, rule, i = 0; i < this.columns.length; i++)
              !((_a = this.columns[i]) === null || _a === void 0) && _a.hidden || (w = this.columns[i].width || 0, rule = this.getColumnCssRules(i), rule.left.style.left = "".concat(x, "px"), rule.right.style.right = (this._options.frozenColumn !== -1 && i > this._options.frozenColumn ? this.canvasWidthR : this.canvasWidthL) - x - w + "px", this._options.frozenColumn !== i && (x += this.columns[i].width)), this._options.frozenColumn == i && (x = 0);
          }, SlickGrid2.prototype.setSortColumn = function(columnId, ascending) {
            this.setSortColumns([{ columnId, sortAsc: ascending }]);
          }, SlickGrid2.prototype.getColumnByIndex = function(id) {
            var result;
            return this._headers.every(function(header) {
              var length = header.children.length;
              return id < length ? (result = header.children[id], !1) : (id -= length, !0);
            }), result;
          }, SlickGrid2.prototype.setSortColumns = function(cols) {
            var _this = this;
            this.sortColumns = cols;
            var numberCols = this._options.numberedMultiColumnSort && this.sortColumns.length > 1;
            this._headers.forEach(function(header) {
              var indicators = header.querySelectorAll(".slick-header-column-sorted");
              indicators.forEach(function(indicator) {
                indicator.classList.remove("slick-header-column-sorted");
              }), indicators = header.querySelectorAll(".slick-sort-indicator"), indicators.forEach(function(indicator) {
                indicator.classList.remove("slick-sort-indicator-asc"), indicator.classList.remove("slick-sort-indicator-desc");
              }), indicators = header.querySelectorAll(".slick-sort-indicator-numbered"), indicators.forEach(function(el) {
                el.textContent = "";
              });
            });
            var i = 1;
            this.sortColumns.forEach(function(col) {
              col.sortAsc == null && (col.sortAsc = !0);
              var columnIndex = _this.getColumnIndex(col.columnId);
              if (columnIndex != null) {
                var column = _this.getColumnByIndex(columnIndex);
                if (column) {
                  column.classList.add("slick-header-column-sorted");
                  var indicator = column.querySelector(".slick-sort-indicator");
                  indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc"), numberCols && (indicator = column.querySelector(".slick-sort-indicator-numbered"), indicator.textContent = String(i));
                }
              }
              i++;
            });
          }, SlickGrid2.prototype.getSortColumns = function() {
            return this.sortColumns;
          }, SlickGrid2.prototype.handleSelectedRangesChanged = function(e, ranges) {
            var _this = this, _a, _b, ne = e.getNativeEvent(), previousSelectedRows = this.selectedRows.slice(0);
            this.selectedRows = [];
            for (var hash = {}, i = 0; i < ranges.length; i++)
              for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                hash[j] || (this.selectedRows.push(j), hash[j] = {});
                for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
                  this.canCellBeSelected(j, k) && (hash[j][this.columns[k].id] = this._options.selectedCellCssClass);
              }
            if (this.setCellCssStyles(this._options.selectedCellCssClass || "", hash), this.simpleArrayEquals(previousSelectedRows, this.selectedRows)) {
              var caller = (_b = (_a = ne == null ? void 0 : ne.detail) === null || _a === void 0 ? void 0 : _a.caller) !== null && _b !== void 0 ? _b : "click", newSelectedAdditions = this.getSelectedRows().filter(function(i2) {
                return previousSelectedRows.indexOf(i2) < 0;
              }), newSelectedDeletions = previousSelectedRows.filter(function(i2) {
                return _this.getSelectedRows().indexOf(i2) < 0;
              });
              this.trigger(this.onSelectedRowsChanged, {
                rows: this.getSelectedRows(),
                previousSelectedRows,
                caller,
                changedSelectedRows: newSelectedAdditions,
                changedUnselectedRows: newSelectedDeletions
              }, e);
            }
          }, SlickGrid2.prototype.simpleArrayEquals = function(arr1, arr2) {
            return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
          }, SlickGrid2.prototype.getColumns = function() {
            return this.columns;
          }, SlickGrid2.prototype.updateColumnCaches = function() {
            this.columnPosLeft = [], this.columnPosRight = [];
            for (var x = 0, i = 0, ii = this.columns.length; i < ii; i++)
              !this.columns[i] || this.columns[i].hidden || (this.columnPosLeft[i] = x, this.columnPosRight[i] = x + (this.columns[i].width || 0), this._options.frozenColumn === i ? x = 0 : x += this.columns[i].width || 0);
          }, SlickGrid2.prototype.updateColumnProps = function() {
            this.columnsById = {};
            for (var i = 0; i < this.columns.length; i++) {
              var m = this.columns[i];
              m.width && (m.widthRequest = m.width), this.options.mixinDefaults ? (Utils.applyDefaults(m, this._columnDefaults), m.autoSize || (m.autoSize = {}), Utils.applyDefaults(m.autoSize, this._columnAutosizeDefaults)) : (m = this.columns[i] = Utils.extend({}, this._columnDefaults, m), m.autoSize = Utils.extend({}, this._columnAutosizeDefaults, m.autoSize)), this.columnsById[m.id] = i, m.minWidth && (m.width || 0) < m.minWidth && (m.width = m.minWidth), m.maxWidth && (m.width || 0) > m.maxWidth && (m.width = m.maxWidth);
            }
          }, SlickGrid2.prototype.setColumns = function(columnDefinitions) {
            this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns: columnDefinitions, grid: this }), this.columns = columnDefinitions, this.updateColumnsInternal();
          }, SlickGrid2.prototype.updateColumns = function() {
            this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this }), this.updateColumnsInternal();
          }, SlickGrid2.prototype.updateColumnsInternal = function() {
            var _a;
            this.updateColumnProps(), this.updateColumnCaches(), this.initialized && (this.setPaneVisibility(), this.setOverflow(), this.invalidateAllRows(), this.createColumnHeaders(), this.createColumnFooter(), this.removeCssRules(), this.createCssRules(), this.resizeCanvas(), this.updateCanvasWidth(), this.applyColumnHeaderWidths(), this.applyColumnWidths(), this.handleScroll(), (_a = this.getSelectionModel()) === null || _a === void 0 || _a.refreshSelections());
          }, SlickGrid2.prototype.getOptions = function() {
            return this._options;
          }, SlickGrid2.prototype.setOptions = function(args2, suppressRender, suppressColumnSet, suppressSetOverflow) {
            prepareForOptionsChange();
            var originalOptions = Utils.extend(!0, {}, this._options);
            this._options = Utils.extend(this._options, args2), this.trigger(this.onSetOptions, { optionsBefore: originalOptions, optionsAfter: this._options }), internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
          }, SlickGrid2.prototype.activateChangedOptions = function(suppressRender, suppressColumnSet, suppressSetOverflow) {
            prepareForOptionsChange(), this.trigger(this.onActivateChangedOptions, { options: this._options }), internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
          }, SlickGrid2.prototype.prepareForOptionsChange = function() {
            this.getEditorLock().commitCurrentEdit() && (this.makeActiveCellNormal(), this.invalidateRow(this.getDataLength()));
          }, SlickGrid2.prototype.internal_setOptions = function(suppressRender, suppressColumnSet, suppressSetOverflow) {
            var _this = this;
            args.showColumnHeader !== void 0 && this.setColumnHeaderVisibility(args.showColumnHeader), this.validateAndEnforceOptions(), this.setFrozenOptions(), args.frozenBottom !== void 0 && (this.enforceFrozenRowHeightRecalc = !0), this._viewport.forEach(function(view) {
              view.style.overflowY = _this._options.autoHeight ? "hidden" : "auto";
            }), suppressRender || this.render(), this.setScroller(), suppressSetOverflow || this.setOverflow(), suppressColumnSet || this.setColumns(this.columns), this._options.enableMouseWheelScrollHandler && this._viewport && (!this.slickMouseWheelInstances || this.slickMouseWheelInstances.length === 0) ? this._viewport.forEach(function(view) {
              _this.slickMouseWheelInstances.push(MouseWheel({
                element: view,
                onMouseWheel: _this.handleMouseWheel.bind(_this)
              }));
            }) : this._options.enableMouseWheelScrollHandler === !1 && this.destroyAllInstances(this.slickMouseWheelInstances);
          }, SlickGrid2.prototype.validateAndEnforceOptions = function() {
            this._options.autoHeight && (this._options.leaveSpaceForNewRows = !1), this._options.forceFitColumns && (this._options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit, console.log("forceFitColumns option is deprecated - use autosizeColsMode"));
          }, SlickGrid2.prototype.setData = function(newData, scrollToTop) {
            this.data = newData, this.invalidateAllRows(), this.updateRowCount(), scrollToTop && this.scrollTo(0);
          }, SlickGrid2.prototype.getData = function() {
            return this.data;
          }, SlickGrid2.prototype.getDataLength = function() {
            var _a, _b;
            return this.data.getLength ? this.data.getLength() : (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
          }, SlickGrid2.prototype.getDataLengthIncludingAddNew = function() {
            return this.getDataLength() + (this._options.enableAddRow && (!this.pagingActive || this.pagingIsLastPage) ? 1 : 0);
          }, SlickGrid2.prototype.getDataItem = function(i) {
            return this.data.getItem ? this.data.getItem(i) : this.data[i];
          }, SlickGrid2.prototype.getTopPanel = function() {
            return this._topPanels[0];
          }, SlickGrid2.prototype.getTopPanels = function() {
            return this._topPanels;
          }, SlickGrid2.prototype.togglePanelVisibility = function(option, container, visible, animate) {
            var animated = animate !== !1;
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
          }, SlickGrid2.prototype.setTopPanelVisibility = function(visible, animate) {
            this.togglePanelVisibility("showTopPanel", this._topPanelScrollers, visible, animate);
          }, SlickGrid2.prototype.setHeaderRowVisibility = function(visible, animate) {
            this.togglePanelVisibility("showHeaderRow", this._headerRowScroller, visible, animate);
          }, SlickGrid2.prototype.setColumnHeaderVisibility = function(visible, animate) {
            this.togglePanelVisibility("showColumnHeader", this._headerScroller, visible, animate);
          }, SlickGrid2.prototype.setFooterRowVisibility = function(visible, animate) {
            this.togglePanelVisibility("showFooterRow", this._footerRowScroller, visible, animate);
          }, SlickGrid2.prototype.setPreHeaderPanelVisibility = function(visible, animate) {
            this.togglePanelVisibility("showPreHeaderPanel", [this._preHeaderPanelScroller, this._preHeaderPanelScrollerR], visible, animate);
          }, SlickGrid2.prototype.getContainerNode = function() {
            return this._container;
          }, SlickGrid2.prototype.getRowTop = function(row) {
            return this._options.rowHeight * row - this.offset;
          }, SlickGrid2.prototype.getRowFromPosition = function(y) {
            return Math.floor((y + this.offset) / this._options.rowHeight);
          }, SlickGrid2.prototype.scrollTo = function(y) {
            var _a, _b;
            y = Math.max(y, 0), y = Math.min(y, (this.th || 0) - Utils.height(this._viewportScrollContainerY) + ((this.viewportHasHScroll || this.hasFrozenColumns()) && (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0));
            var oldOffset = this.offset;
            this.offset = Math.round(this.page * (this.cj || 0)), this.page = Math.min((this.n || 0) - 1, Math.floor(y / (this.ph || 0)));
            var newScrollTop = y - this.offset;
            if (this.offset !== oldOffset) {
              var range = this.getVisibleRange(newScrollTop);
              this.cleanupRows(range), this.updateRowPositions();
            }
            this.prevScrollTop !== newScrollTop && (this.vScrollDir = this.prevScrollTop + oldOffset < newScrollTop + this.offset ? 1 : -1, this.lastRenderedScrollTop = this.scrollTop = this.prevScrollTop = newScrollTop, this.hasFrozenColumns() && (this._viewportTopL.scrollTop = newScrollTop), this.hasFrozenRows && (this._viewportBottomL.scrollTop = this._viewportBottomR.scrollTop = newScrollTop), this._viewportScrollContainerY && (this._viewportScrollContainerY.scrollTop = newScrollTop), this.trigger(this.onViewportChanged, {}));
          }, SlickGrid2.prototype.defaultFormatter = function(_row, _cell, value) {
            return value == null ? "" : (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          }, SlickGrid2.prototype.getFormatter = function(row, column) {
            var _a, _b, _c, rowMetadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row), columnOverrides = (rowMetadata == null ? void 0 : rowMetadata.columns) && (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]);
            return (columnOverrides == null ? void 0 : columnOverrides.formatter) || (rowMetadata == null ? void 0 : rowMetadata.formatter) || column.formatter || ((_c = this._options.formatterFactory) === null || _c === void 0 ? void 0 : _c.getFormatter(column)) || this._options.defaultFormatter;
          }, SlickGrid2.prototype.getEditor = function(row, cell) {
            var _a, _b, _c, _d, _f, _g, column = this.columns[cell], rowMetadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row), columnMetadata = rowMetadata == null ? void 0 : rowMetadata.columns;
            return ((_c = columnMetadata == null ? void 0 : columnMetadata[column.id]) === null || _c === void 0 ? void 0 : _c.editor) !== void 0 ? columnMetadata[column.id].editor : ((_d = columnMetadata == null ? void 0 : columnMetadata[cell]) === null || _d === void 0 ? void 0 : _d.editor) !== void 0 ? columnMetadata[cell].editor : column.editor || ((_g = (_f = this._options) === null || _f === void 0 ? void 0 : _f.editorFactory) === null || _g === void 0 ? void 0 : _g.getEditor(column));
          }, SlickGrid2.prototype.getDataItemValueForColumn = function(item, columnDef) {
            return this._options.dataItemColumnValueExtractor ? this._options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
          }, SlickGrid2.prototype.appendRowHtml = function(stringArrayL, stringArrayR, row, range, dataLength) {
            var _a, _b, d = this.getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (this.hasFrozenRows && row <= this._options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === this.activeRow && this._options.showCellSelection ? " active" : "") + (row % 2 == 1 ? " odd" : " even");
            d || (rowCss += " " + this._options.addNewRowCssClass);
            var metadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row);
            metadata != null && metadata.cssClasses && (rowCss += " " + metadata.cssClasses);
            var frozenRowOffset = this.getFrozenRowOffset(row), rowHtml = '<div class="ui-widget-content '.concat(rowCss, '" style="top:').concat(this.getRowTop(row) - frozenRowOffset, 'px">');
            stringArrayL.push(rowHtml), this.hasFrozenColumns() && stringArrayR.push(rowHtml);
            for (var colspan, m, i = 0, ii = this.columns.length; i < ii; i++)
              if (m = this.columns[i], !(!m || m.hidden)) {
                if (colspan = 1, metadata != null && metadata.columns) {
                  var columnData = metadata.columns[m.id] || metadata.columns[i];
                  colspan = (columnData == null ? void 0 : columnData.colspan) || 1, colspan === "*" && (colspan = ii - i);
                }
                if (this.columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
                  if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx)
                    break;
                  this.hasFrozenColumns() && i > this._options.frozenColumn ? this.appendCellHtml(stringArrayR, row, i, colspan, d) : this.appendCellHtml(stringArrayL, row, i, colspan, d);
                } else
                  (m.alwaysRenderColumn || this.hasFrozenColumns() && i <= this._options.frozenColumn) && this.appendCellHtml(stringArrayL, row, i, colspan, d);
                colspan > 1 && (i += colspan - 1);
              }
            stringArrayL.push("</div>"), this.hasFrozenColumns() && stringArrayR.push("</div>");
          }, SlickGrid2.prototype.appendCellHtml = function(stringArray, row, cell, colspan, item) {
            var _a, m = this.columns[cell], cellCss = "slick-cell l" + cell + " r" + Math.min(this.columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
            this.hasFrozenColumns() && cell <= this._options.frozenColumn && (cellCss += " frozen"), row === this.activeRow && cell === this.activeCell && this._options.showCellSelection && (cellCss += " active");
            for (var key in this.cellCssClasses)
              !((_a = this.cellCssClasses[key][row]) === null || _a === void 0) && _a[m.id] && (cellCss += " " + this.cellCssClasses[key][row][m.id]);
            var value = null, formatterResult = "";
            item && (value = this.getDataItemValueForColumn(item, m), formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this), formatterResult == null && (formatterResult = ""));
            var evt = this.trigger(this.onBeforeAppendCell, { row, cell, value, dataContext: item }), appendCellResult = evt.getReturnValue(), addlCssClasses = typeof appendCellResult == "string" ? appendCellResult : "";
            formatterResult != null && formatterResult.addClasses && (addlCssClasses += (addlCssClasses ? " " : "") + formatterResult.addClasses);
            var toolTip = formatterResult != null && formatterResult.toolTip ? "title='" + formatterResult.toolTip + "'" : "", customAttrStr = "";
            if (m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object)
              for (var key in m.cellAttrs)
                m.cellAttrs.hasOwnProperty(key) && (customAttrStr += " ".concat(key, '="').concat(m.cellAttrs[key], '" '));
            stringArray.push('<div class="'.concat(cellCss + (addlCssClasses ? " " + addlCssClasses : ""), '" ').concat(toolTip + customAttrStr, ">")), item && stringArray.push(Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.text), stringArray.push("</div>"), this.rowsCache[row].cellRenderQueue.push(cell), this.rowsCache[row].cellColSpans[cell] = colspan;
          }, SlickGrid2.prototype.cleanupRows = function(rangeToKeep) {
            for (var rowId in this.rowsCache) {
              var i = +rowId, removeFrozenRow = !0;
              this.hasFrozenRows && (this._options.frozenBottom && i >= this.actualFrozenRow || !this._options.frozenBottom && i <= this.actualFrozenRow) && (removeFrozenRow = !1), (i = parseInt(rowId, 10)) !== this.activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom) && removeFrozenRow && this.removeRowFromCache(i);
            }
            this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
          }, SlickGrid2.prototype.invalidate = function() {
            this.updateRowCount(), this.invalidateAllRows(), this.render();
          }, SlickGrid2.prototype.invalidateAllRows = function() {
            this.currentEditor && this.makeActiveCellNormal();
            for (var row in this.rowsCache)
              this.removeRowFromCache(+row);
            this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
          }, SlickGrid2.prototype.invalidateRows = function(rows) {
            if (!(!rows || !rows.length)) {
              this.vScrollDir = 0;
              for (var rl = rows.length, i = 0; i < rl; i++)
                this.currentEditor && this.activeRow === rows[i] && this.makeActiveCellNormal(), this.rowsCache[rows[i]] && this.removeRowFromCache(rows[i]);
              this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
            }
          }, SlickGrid2.prototype.invalidateRow = function(row) {
            !row && row !== 0 || this.invalidateRows([row]);
          }, SlickGrid2.prototype.queuePostProcessedRowForCleanup = function(cacheEntry, postProcessedRow, rowIdx) {
            var _a;
            this.postProcessgroupId++;
            for (var columnIdx in postProcessedRow)
              postProcessedRow.hasOwnProperty(columnIdx) && this.postProcessedCleanupQueue.push({
                actionType: "C",
                groupId: this.postProcessgroupId,
                node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
                columnIdx: +columnIdx,
                rowIdx
              });
            this.postProcessedCleanupQueue.push({
              actionType: "R",
              groupId: this.postProcessgroupId,
              node: cacheEntry.rowNode
            }), (_a = cacheEntry.rowNode) === null || _a === void 0 || _a.forEach(function(node) {
              return node.remove();
            });
          }, SlickGrid2.prototype.queuePostProcessedCellForCleanup = function(cellnode, columnIdx, rowIdx) {
            this.postProcessedCleanupQueue.push({
              actionType: "C",
              groupId: this.postProcessgroupId,
              node: cellnode,
              columnIdx,
              rowIdx
            }), cellnode.remove();
          }, SlickGrid2.prototype.removeRowFromCache = function(row) {
            var _a, cacheEntry = this.rowsCache[row];
            cacheEntry && (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row] ? this.queuePostProcessedRowForCleanup(cacheEntry, this.postProcessedRows[row], row) : (_a = cacheEntry.rowNode) === null || _a === void 0 || _a.forEach(function(node) {
              var _a2;
              return (_a2 = node.parentElement) === null || _a2 === void 0 ? void 0 : _a2.removeChild(node);
            }), delete this.rowsCache[row], delete this.postProcessedRows[row], this.renderedRows--, this.counter_rows_removed++);
          }, SlickGrid2.prototype.applyFormatResultToCellNode = function(formatterResult, cellNode, suppressRemove) {
            if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
              cellNode.innerHTML = this.sanitizeHtmlString(formatterResult);
              return;
            }
            if (cellNode.innerHTML = this.sanitizeHtmlString(formatterResult.text), formatterResult.removeClasses && !suppressRemove) {
              var classes = formatterResult.removeClasses.split(" ");
              classes.forEach(function(c) {
                return cellNode.classList.remove(c);
              });
            }
            if (formatterResult.addClasses) {
              var classes = formatterResult.addClasses.split(" ");
              classes.forEach(function(c) {
                return cellNode.classList.add(c);
              });
            }
            formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
          }, SlickGrid2.prototype.updateCell = function(row, cell) {
            var cellNode = this.getCellNode(row, cell);
            if (cellNode) {
              var m = this.columns[cell], d = this.getDataItem(row);
              if (this.currentEditor && this.activeRow === row && this.activeCell === cell)
                this.currentEditor.loadValue(d);
              else {
                var formatterResult = d ? this.getFormatter(row, m)(row, cell, this.getDataItemValueForColumn(d, m), m, d, this) : "";
                this.applyFormatResultToCellNode(formatterResult, cellNode), this.invalidatePostProcessingResults(row);
              }
            }
          }, SlickGrid2.prototype.updateRow = function(row) {
            var cacheEntry = this.rowsCache[row];
            if (cacheEntry) {
              this.ensureCellNodesInRowsCache(row);
              var formatterResult, d = this.getDataItem(row);
              for (var colIdx in cacheEntry.cellNodesByColumnIdx)
                if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
                  var columnIdx = +colIdx, m = this.columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
                  row === this.activeRow && columnIdx === this.activeCell && this.currentEditor ? this.currentEditor.loadValue(d) : d ? (formatterResult = this.getFormatter(row, m)(row, columnIdx, this.getDataItemValueForColumn(d, m), m, d, this), this.applyFormatResultToCellNode(formatterResult, node)) : node.innerHTML = "";
                }
              this.invalidatePostProcessingResults(row);
            }
          }, SlickGrid2.prototype.getViewportHeight = function() {
            var _a, _b;
            if ((!this._options.autoHeight || this._options.frozenColumn !== -1) && (this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight + this.getVBoxDelta(this._topPanelScrollers[0]) : 0, this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, this.footerRowH = this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0), this._options.autoHeight) {
              var fullHeight = this._paneHeaderL.offsetHeight;
              fullHeight += this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, fullHeight += this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0, fullHeight += this.getCanvasWidth() > this.viewportW && (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0, this.viewportH = this._options.rowHeight * this.getDataLengthIncludingAddNew() + (this._options.frozenColumn == -1 ? fullHeight : 0);
            } else {
              var columnNamesH = this._options.showColumnHeader ? Utils.toFloat(Utils.height(this._headerScroller[0])) + this.getVBoxDelta(this._headerScroller[0]) : 0, preHeaderH = this._options.createPreHeaderPanel && this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight + this.getVBoxDelta(this._preHeaderPanelScroller) : 0, style = getComputedStyle(this._container);
              this.viewportH = Utils.toFloat(style.height) - Utils.toFloat(style.paddingTop) - Utils.toFloat(style.paddingBottom) - columnNamesH - this.topPanelH - this.headerRowH - this.footerRowH - preHeaderH;
            }
            return this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight), this.viewportH;
          }, SlickGrid2.prototype.getViewportWidth = function() {
            return this.viewportW = parseFloat(Utils.innerSize(this._container, "width")), this.viewportW;
          }, SlickGrid2.prototype.resizeCanvas = function() {
            var _a, _b, _c, _d, _f, _g;
            if (this.initialized) {
              if (this.paneTopH = 0, this.paneBottomH = 0, this.viewportTopH = 0, this.viewportBottomH = 0, this.getViewportWidth(), this.getViewportHeight(), this.hasFrozenRows ? this._options.frozenBottom ? (this.paneTopH = this.viewportH - this.frozenRowsHeight - ((_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0), this.paneBottomH = this.frozenRowsHeight + ((_d = (_c = this.scrollbarDimensions) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0)) : (this.paneTopH = this.frozenRowsHeight, this.paneBottomH = this.viewportH - this.frozenRowsHeight) : this.paneTopH = this.viewportH, this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH, this.hasFrozenColumns() && this._options.autoHeight && (this.paneTopH += (_g = (_f = this.scrollbarDimensions) === null || _f === void 0 ? void 0 : _f.height) !== null && _g !== void 0 ? _g : 0), this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH, this._options.autoHeight) {
                if (this.hasFrozenColumns()) {
                  var style = getComputedStyle(this._headerScrollerL);
                  Utils.height(this._container, this.paneTopH + Utils.toFloat(style.height));
                }
                this._paneTopL.style.position = "relative";
              }
              Utils.setStyleSize(this._paneTopL, "top", Utils.height(this._paneHeaderL) || (this._options.showHeaderRow ? this._options.headerRowHeight : 0) + (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight : 0)), Utils.height(this._paneTopL, this.paneTopH);
              var paneBottomTop = this._paneTopL.offsetTop + this.paneTopH;
              this._options.autoHeight || Utils.height(this._viewportTopL, this.viewportTopH), this.hasFrozenColumns() ? (Utils.setStyleSize(this._paneTopR, "top", Utils.height(this._paneHeaderL)), Utils.height(this._paneTopR, this.paneTopH), Utils.height(this._viewportTopR, this.viewportTopH), this.hasFrozenRows && (Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomR, "top", paneBottomTop), Utils.height(this._paneBottomR, this.paneBottomH), Utils.height(this._viewportBottomR, this.paneBottomH))) : this.hasFrozenRows && (Utils.width(this._paneBottomL, "100%"), Utils.height(this._paneBottomL, this.paneBottomH), Utils.setStyleSize(this._paneBottomL, "top", paneBottomTop)), this.hasFrozenRows ? (Utils.height(this._viewportBottomL, this.paneBottomH), this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.frozenRowsHeight)) : (Utils.height(this._canvasTopL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils.height(this._canvasTopR, this.frozenRowsHeight))) : Utils.height(this._viewportTopR, this.viewportTopH), (!this.scrollbarDimensions || !this.scrollbarDimensions.width) && (this.scrollbarDimensions = this.measureScrollbar()), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && this.autosizeColumns(), this.updateRowCount(), this.handleScroll(), this.lastRenderedScrollLeft = -1, this.render();
            }
          }, SlickGrid2.prototype.updatePagingStatusFromView = function(pagingInfo) {
            this.pagingActive = pagingInfo.pageSize !== 0, this.pagingIsLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
          }, SlickGrid2.prototype.updateRowCount = function() {
            var _a, _b, _c, _d;
            if (this.initialized) {
              var dataLength = this.getDataLength(), dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = this.hasFrozenRows && !this._options.frozenBottom ? Utils.height(this._canvasBottomL) : Utils.height(this._canvasTopL);
              this.hasFrozenRows ? numberOfRows = this.getDataLength() - this._options.frozenRow : numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);
              var tempViewportH = Utils.height(this._viewportScrollContainerY), oldViewportHasVScroll = this.viewportHasVScroll;
              this.viewportHasVScroll = this._options.alwaysShowVerticalScroll || !this._options.autoHeight && numberOfRows * this._options.rowHeight > tempViewportH, this.makeActiveCellNormal();
              var r1 = dataLength - 1;
              for (var i in this.rowsCache)
                Number(i) > r1 && this.removeRowFromCache(+i);
              this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup(), this.activeCellNode && this.activeRow > r1 && this.resetActiveCell(), oldH = this.h, this._options.autoHeight ? this.h = this._options.rowHeight * numberOfRows : (this.th = Math.max(this._options.rowHeight * numberOfRows, tempViewportH - ((_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0)), this.th < this.maxSupportedCssHeight ? (this.h = this.ph = this.th, this.n = 1, this.cj = 0) : (this.h = this.maxSupportedCssHeight, this.ph = this.h / 100, this.n = Math.floor(this.th / this.ph), this.cj = (this.th - this.h) / (this.n - 1))), (this.h !== oldH || this.enforceFrozenRowHeightRecalc) && (this.hasFrozenRows && !this._options.frozenBottom ? (Utils.height(this._canvasBottomL, this.h), this.hasFrozenColumns() && Utils.height(this._canvasBottomR, this.h)) : (Utils.height(this._canvasTopL, this.h), Utils.height(this._canvasTopR, this.h)), this.scrollTop = this._viewportScrollContainerY.scrollTop, this.enforceFrozenRowHeightRecalc = !1);
              var oldScrollTopInRange = this.scrollTop + this.offset <= this.th - tempViewportH;
              this.th == 0 || this.scrollTop == 0 ? this.page = this.offset = 0 : oldScrollTopInRange ? this.scrollTo(this.scrollTop + this.offset) : this.scrollTo(this.th - tempViewportH + ((_d = (_c = this.scrollbarDimensions) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0)), this.h !== oldH && this._options.autoHeight && this.resizeCanvas(), this._options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll !== this.viewportHasVScroll && this.autosizeColumns(), this.updateCanvasWidth(!1);
            }
          }, SlickGrid2.prototype.getViewport = function(viewportTop, viewportLeft) {
            return this.getVisibleRange(viewportTop, viewportLeft);
          }, SlickGrid2.prototype.getVisibleRange = function(viewportTop, viewportLeft) {
            return viewportTop == null && (viewportTop = this.scrollTop), viewportLeft == null && (viewportLeft = this.scrollLeft), {
              top: this.getRowFromPosition(viewportTop),
              bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
              leftPx: viewportLeft,
              rightPx: viewportLeft + this.viewportW
            };
          }, SlickGrid2.prototype.getRenderedRange = function(viewportTop, viewportLeft) {
            var range = this.getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(this.viewportH / this._options.rowHeight), minBuffer = this._options.minRowBuffer;
            return this.vScrollDir == -1 ? (range.top -= buffer, range.bottom += minBuffer) : this.vScrollDir == 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(this.getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= this.viewportW, range.rightPx += this.viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(this.canvasWidth, range.rightPx), range;
          }, SlickGrid2.prototype.ensureCellNodesInRowsCache = function(row) {
            var cacheEntry = this.rowsCache[row];
            if (cacheEntry && cacheEntry.cellRenderQueue.length) {
              var rowNode = cacheEntry.rowNode, children = Array.from(rowNode[0].children);
              rowNode.length > 1 && (children = children.concat(Array.from(rowNode[1].children)));
              for (var i = children.length - 1; cacheEntry.cellRenderQueue.length; ) {
                var columnIdx = cacheEntry.cellRenderQueue.pop();
                cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i--];
              }
            }
          }, SlickGrid2.prototype.cleanUpCells = function(range, row) {
            var _a, _b;
            if (!(this.hasFrozenRows && (this._options.frozenBottom && row > this.actualFrozenRow || row <= this.actualFrozenRow))) {
              var totalCellsRemoved = 0, cacheEntry = this.rowsCache[row], cellsToRemove = [];
              for (var cellNodeIdx in cacheEntry.cellNodesByColumnIdx)
                if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx)) {
                  var i = +cellNodeIdx;
                  if (!(i <= this._options.frozenColumn) && !(Array.isArray(this.columns) && this.columns[i] && this.columns[i].alwaysRenderColumn)) {
                    var colspan = cacheEntry.cellColSpans[i];
                    (this.columnPosLeft[i] > range.rightPx || this.columnPosRight[Math.min(this.columns.length - 1, (i || 0) + colspan - 1)] < range.leftPx) && (row == this.activeRow && Number(i) == this.activeCell || cellsToRemove.push(i));
                  }
                }
              for (var cellToRemove, cellNode; (cellToRemove = cellsToRemove.pop()) != null; )
                cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], this._options.enableAsyncPostRenderCleanup && (!((_a = this.postProcessedRows[row]) === null || _a === void 0) && _a[cellToRemove]) ? this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : (_b = cellNode.parentElement) === null || _b === void 0 || _b.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], this.postProcessedRows[row] && delete this.postProcessedRows[row][cellToRemove], totalCellsRemoved++;
            }
          }, SlickGrid2.prototype.cleanUpAndRenderCells = function(range) {
            for (var _a, _b, _c, _d, cacheEntry, stringArray = [], processedRows = [], cellsAdded, totalCellsAdded = 0, colspan, row = range.top, btm = range.bottom; row <= btm; row++)
              if (cacheEntry = this.rowsCache[row], !!cacheEntry) {
                this.ensureCellNodesInRowsCache(row), this.cleanUpCells(range, row), cellsAdded = 0;
                var metadata = (_c = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row)) !== null && _c !== void 0 ? _c : {};
                metadata = metadata == null ? void 0 : metadata.columns;
                for (var d = this.getDataItem(row), i = 0, ii = this.columns.length; i < ii; i++)
                  if (!(!this.columns[i] || this.columns[i].hidden)) {
                    if (this.columnPosLeft[i] > range.rightPx)
                      break;
                    if ((colspan = cacheEntry.cellColSpans[i]) != null) {
                      i += colspan > 1 ? colspan - 1 : 0;
                      continue;
                    }
                    if (colspan = 1, metadata) {
                      var columnData = metadata[this.columns[i].id] || metadata[i];
                      colspan = (_d = columnData == null ? void 0 : columnData.colspan) !== null && _d !== void 0 ? _d : 1, colspan === "*" && (colspan = ii - i);
                    }
                    this.columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx && (this.appendCellHtml(stringArray, row, i, colspan, d), cellsAdded++), i += colspan > 1 ? colspan - 1 : 0;
                  }
                cellsAdded && (totalCellsAdded += cellsAdded, processedRows.push(row));
              }
            if (stringArray.length)
              for (var x = Utils.createDomElement("div", { innerHTML: this.sanitizeHtmlString(stringArray.join("")) }), processedRow, node; (processedRow = processedRows.pop()) != null; ) {
                cacheEntry = this.rowsCache[processedRow];
                for (var columnIdx = void 0; (columnIdx = cacheEntry.cellRenderQueue.pop()) != null; )
                  node = x.lastChild, this.hasFrozenColumns() && columnIdx > this._options.frozenColumn ? cacheEntry.rowNode[1].appendChild(node) : cacheEntry.rowNode[0].appendChild(node), cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
              }
          }, SlickGrid2.prototype.renderRows = function(range) {
            for (var stringArrayL = [], stringArrayR = [], rows = [], needToReselectCell = !1, dataLength = this.getDataLength(), i = range.top, ii = range.bottom; i <= ii; i++)
              this.rowsCache[i] || this.hasFrozenRows && this._options.frozenBottom && i == this.getDataLength() || (this.renderedRows++, rows.push(i), this.rowsCache[i] = {
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
              }, this.appendRowHtml(stringArrayL, stringArrayR, i, range, dataLength), this.activeCellNode && this.activeRow === i && (needToReselectCell = !0), this.counter_rows_rendered++);
            if (rows.length) {
              for (var x = Utils.createDomElement("div", { innerHTML: this.sanitizeHtmlString(stringArrayL.join("")) }), xRight = Utils.createDomElement("div", { innerHTML: this.sanitizeHtmlString(stringArrayR.join("")) }), i = 0, ii = rows.length; i < ii; i++)
                this.hasFrozenRows && rows[i] >= this.actualFrozenRow ? this.hasFrozenColumns() ? (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasBottomL.appendChild(x.firstChild), this._canvasBottomR.appendChild(xRight.firstChild)) : (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasBottomL.appendChild(x.firstChild)) : this.hasFrozenColumns() ? (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasTopL.appendChild(x.firstChild), this._canvasTopR.appendChild(xRight.firstChild)) : (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasTopL.appendChild(x.firstChild));
              needToReselectCell && (this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell));
            }
          }, SlickGrid2.prototype.startPostProcessing = function() {
            this._options.enableAsyncPostRender && (clearTimeout(this.h_postrender), this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay));
          }, SlickGrid2.prototype.startPostProcessingCleanup = function() {
            this._options.enableAsyncPostRenderCleanup && (clearTimeout(this.h_postrenderCleanup), this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay));
          }, SlickGrid2.prototype.invalidatePostProcessingResults = function(row) {
            for (var columnIdx in this.postProcessedRows[row])
              this.postProcessedRows[row].hasOwnProperty(columnIdx) && (this.postProcessedRows[row][columnIdx] = "C");
            this.postProcessFromRow = Math.min(this.postProcessFromRow, row), this.postProcessToRow = Math.max(this.postProcessToRow, row), this.startPostProcessing();
          }, SlickGrid2.prototype.updateRowPositions = function() {
            for (var row in this.rowsCache) {
              var rowNumber = row ? parseInt(row) : 0;
              Utils.setStyleSize(this.rowsCache[rowNumber].rowNode[0], "top", this.getRowTop(rowNumber));
            }
          }, SlickGrid2.prototype.render = function() {
            if (this.initialized) {
              this.scrollThrottle.dequeue();
              var visible = this.getVisibleRange(), rendered = this.getRenderedRange();
              if (this.cleanupRows(rendered), this.lastRenderedScrollLeft !== this.scrollLeft) {
                if (this.hasFrozenRows) {
                  var renderedFrozenRows = Utils.extend(!0, {}, rendered);
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
          }, SlickGrid2.prototype.handleHeaderRowScroll = function() {
            var scrollLeft = this._headerRowScrollContainer.scrollLeft;
            scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
          }, SlickGrid2.prototype.handleFooterRowScroll = function() {
            var scrollLeft = this._footerRowScrollContainer.scrollLeft;
            scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
          }, SlickGrid2.prototype.handlePreHeaderPanelScroll = function() {
            this.handleElementScroll(this._preHeaderPanelScroller);
          }, SlickGrid2.prototype.handleElementScroll = function(element) {
            var scrollLeft = element.scrollLeft;
            scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
          }, SlickGrid2.prototype.handleScroll = function() {
            return this.scrollTop = this._viewportScrollContainerY.scrollTop, this.scrollLeft = this._viewportScrollContainerX.scrollLeft, this._handleScroll(!1);
          }, SlickGrid2.prototype._handleScroll = function(isMouseWheel) {
            var maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight, maxScrollDistanceX = this._viewportScrollContainerY.scrollWidth - this._viewportScrollContainerY.clientWidth;
            maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), this.scrollTop > maxScrollDistanceY && (this.scrollTop = maxScrollDistanceY), this.scrollLeft > maxScrollDistanceX && (this.scrollLeft = maxScrollDistanceX);
            var vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop), hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);
            if (hScrollDist && (this.prevScrollLeft = this.scrollLeft, this._viewportScrollContainerX.scrollLeft = this.scrollLeft, this._headerScrollContainer.scrollLeft = this.scrollLeft, this._topPanelScrollers[0].scrollLeft = this.scrollLeft, this._options.createFooterRow && (this._footerRowScrollContainer.scrollLeft = this.scrollLeft), this._options.createPreHeaderPanel && (this.hasFrozenColumns() ? this._preHeaderPanelScrollerR.scrollLeft = this.scrollLeft : this._preHeaderPanelScroller.scrollLeft = this.scrollLeft), this.hasFrozenColumns() ? (this.hasFrozenRows && (this._viewportTopR.scrollLeft = this.scrollLeft), this._headerRowScrollerR.scrollLeft = this.scrollLeft) : (this.hasFrozenRows && (this._viewportTopL.scrollLeft = this.scrollLeft), this._headerRowScrollerL.scrollLeft = this.scrollLeft)), vScrollDist && !this._options.autoHeight)
              if (this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1, this.prevScrollTop = this.scrollTop, isMouseWheel && (this._viewportScrollContainerY.scrollTop = this.scrollTop), this.hasFrozenColumns() && (this.hasFrozenRows && !this._options.frozenBottom ? this._viewportBottomL.scrollTop = this.scrollTop : this._viewportTopL.scrollTop = this.scrollTop), vScrollDist < this.viewportH)
                this.scrollTo(this.scrollTop + this.offset);
              else {
                var oldOffset = this.offset;
                this.h == this.viewportH ? this.page = 0 : this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.th - this.viewportH) / (this.h - this.viewportH)) * (1 / this.ph))), this.offset = Math.round(this.page * this.cj), oldOffset !== this.offset && this.invalidateAllRows();
              }
            if (hScrollDist || vScrollDist) {
              var dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft), dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
              (dx > 20 || dy > 20) && (this._options.forceSyncScrolling || dy < this.viewportH && dx < this.viewportW ? this.render() : this.scrollThrottle.enqueue(), this.trigger(this.onViewportChanged, {}));
            }
            return this.trigger(this.onScroll, { scrollLeft: this.scrollLeft, scrollTop: this.scrollTop }), !!(hScrollDist || vScrollDist);
          }, SlickGrid2.prototype.actionThrottle = function(action, minPeriod_ms) {
            var _this = this, blocked = !1, queued = !1, enqueue = function() {
              blocked ? queued = !0 : blockAndExecute();
            }, dequeue = function() {
              queued = !1;
            }, blockAndExecute = function() {
              blocked = !0, setTimeout(unblock, minPeriod_ms), action.call(_this);
            }, unblock = function() {
              queued ? (dequeue(), blockAndExecute()) : blocked = !1;
            };
            return {
              enqueue: enqueue.bind(this),
              dequeue: dequeue.bind(this)
            };
          }, SlickGrid2.prototype.asyncPostProcessRows = function() {
            for (var dataLength = this.getDataLength(); this.postProcessFromRow <= this.postProcessToRow; ) {
              var row = this.vScrollDir >= 0 ? this.postProcessFromRow++ : this.postProcessToRow--, cacheEntry = this.rowsCache[row];
              if (!(!cacheEntry || row >= dataLength)) {
                this.postProcessedRows[row] || (this.postProcessedRows[row] = {}), this.ensureCellNodesInRowsCache(row);
                for (var colIdx in cacheEntry.cellNodesByColumnIdx)
                  if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx)) {
                    var columnIdx = +colIdx, m = this.columns[columnIdx], processedStatus = this.postProcessedRows[row][columnIdx];
                    if (m.asyncPostRender && processedStatus !== "R") {
                      var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
                      node && m.asyncPostRender(node, row, this.getDataItem(row), m, processedStatus === "C"), this.postProcessedRows[row][columnIdx] = "R";
                    }
                  }
                this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
                return;
              }
            }
          }, SlickGrid2.prototype.asyncPostProcessCleanupRows = function() {
            if (this.postProcessedCleanupQueue.length > 0) {
              for (var groupId = this.postProcessedCleanupQueue[0].groupId; this.postProcessedCleanupQueue.length > 0 && this.postProcessedCleanupQueue[0].groupId == groupId; ) {
                var entry = this.postProcessedCleanupQueue.shift();
                if ((entry == null ? void 0 : entry.actionType) === "R" && entry.node.forEach(function(node) {
                  node.remove();
                }), (entry == null ? void 0 : entry.actionType) === "C") {
                  var column = this.columns[entry.columnIdx];
                  column.asyncPostRenderCleanup && entry.node && column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
                }
              }
              this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
            }
          }, SlickGrid2.prototype.updateCellCssStylesOnRenderedRows = function(addedHash, removedHash) {
            var node, columnId, addedRowHash, removedRowHash;
            for (var row in this.rowsCache) {
              if (removedRowHash = removedHash == null ? void 0 : removedHash[row], addedRowHash = addedHash == null ? void 0 : addedHash[row], removedRowHash)
                for (columnId in removedRowHash)
                  (!addedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
              if (addedRowHash)
                for (columnId in addedRowHash)
                  (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
            }
          }, SlickGrid2.prototype.addCellCssStyles = function(key, hash) {
            if (this.cellCssClasses[key])
              throw new Error('SlickGrid addCellCssStyles: cell CSS hash with key "'.concat(key, '" already exists.'));
            this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, null), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
          }, SlickGrid2.prototype.removeCellCssStyles = function(key) {
            this.cellCssClasses[key] && (this.updateCellCssStylesOnRenderedRows(null, this.cellCssClasses[key]), delete this.cellCssClasses[key], this.trigger(this.onCellCssStylesChanged, { key, hash: null, grid: this }));
          }, SlickGrid2.prototype.setCellCssStyles = function(key, hash) {
            var prevHash = this.cellCssClasses[key];
            this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, prevHash), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
          }, SlickGrid2.prototype.getCellCssStyles = function(key) {
            return this.cellCssClasses[key];
          }, SlickGrid2.prototype.flashCell = function(row, cell, speed) {
            var _this = this;
            speed = speed || 250;
            var toggleCellClass = function(cellNode2, times) {
              times < 1 || setTimeout(function() {
                times % 2 == 0 ? cellNode2.classList.add(_this._options.cellFlashingCssClass || "") : cellNode2.classList.remove(_this._options.cellFlashingCssClass || ""), toggleCellClass(cellNode2, times - 1);
              }, speed);
            };
            if (this.rowsCache[row]) {
              var cellNode = this.getCellNode(row, cell);
              cellNode && toggleCellClass(cellNode, 5);
            }
          }, SlickGrid2.prototype.handleMouseWheel = function(e, _delta, deltaX, deltaY) {
            this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - deltaY * this._options.rowHeight), this.scrollLeft = this._viewportScrollContainerX.scrollLeft + deltaX * 10;
            var handled = this._handleScroll(!0);
            handled && e.preventDefault();
          }, SlickGrid2.prototype.handleDragInit = function(e, dd) {
            var cell = this.getCellFromEvent(e);
            if (!cell || !this.cellExists(cell.row, cell.cell))
              return !1;
            var retval = this.trigger(this.onDragInit, dd, e);
            return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
          }, SlickGrid2.prototype.handleDragStart = function(e, dd) {
            var cell = this.getCellFromEvent(e);
            if (!cell || !this.cellExists(cell.row, cell.cell))
              return !1;
            var retval = this.trigger(this.onDragStart, dd, e);
            return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
          }, SlickGrid2.prototype.handleDrag = function(e, dd) {
            return this.trigger(this.onDrag, dd, e).getReturnValue();
          }, SlickGrid2.prototype.handleDragEnd = function(e, dd) {
            this.trigger(this.onDragEnd, dd, e);
          }, SlickGrid2.prototype.handleKeyDown = function(e) {
            var _a, _b, retval = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e), handled = retval.isImmediatePropagationStopped();
            if (!handled && !e.shiftKey && !e.altKey) {
              if (this._options.editable && (!((_a = this.currentEditor) === null || _a === void 0) && _a.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
                return;
              e.which == keyCode.HOME ? handled = e.ctrlKey ? this.navigateTop() : this.navigateRowStart() : e.which == keyCode.END && (handled = e.ctrlKey ? this.navigateBottom() : this.navigateRowEnd());
            }
            if (!handled)
              if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
                if (this._options.editable && (!((_b = this.currentEditor) === null || _b === void 0) && _b.keyCaptureList) && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
                  return;
                if (e.which == keyCode.ESCAPE) {
                  if (!this.getEditorLock().isActive())
                    return;
                  this.cancelEditAndSetFocus();
                } else
                  e.which == keyCode.PAGE_DOWN ? (this.navigatePageDown(), handled = !0) : e.which == keyCode.PAGE_UP ? (this.navigatePageUp(), handled = !0) : e.which == keyCode.LEFT ? handled = this.navigateLeft() : e.which == keyCode.RIGHT ? handled = this.navigateRight() : e.which == keyCode.UP ? handled = this.navigateUp() : e.which == keyCode.DOWN ? handled = this.navigateDown() : e.which == keyCode.TAB ? handled = this.navigateNext() : e.which == keyCode.ENTER && (this._options.editable && (this.currentEditor ? this.activeRow === this.getDataLength() ? this.navigateDown() : this.commitEditAndSetFocus() : this.getEditorLock().commitCurrentEdit() && this.makeActiveCellEditable(void 0, void 0, e)), handled = !0);
              } else
                e.which == keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = this.navigatePrev());
            if (handled) {
              e.stopPropagation(), e.preventDefault();
              try {
                e.originalEvent.keyCode = 0;
              } catch (error) {
              }
            }
          }, SlickGrid2.prototype.handleClick = function(evt) {
            var _a, e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
            if (!this.currentEditor && (e.target !== document.activeElement || e.target.classList.contains("slick-cell"))) {
              var selection = this.getTextSelection();
              this.setFocus(), this.setTextSelection(selection);
            }
            var cell = this.getCellFromEvent(e);
            if (!(!cell || this.currentEditor !== null && this.activeRow == cell.row && this.activeCell == cell.cell) && (evt = this.trigger(this.onClick, { row: cell.row, cell: cell.cell }, evt || e), !evt.isImmediatePropagationStopped() && this.canCellBeActive(cell.row, cell.cell) && (!this.getEditorLock().isActive() || this.getEditorLock().commitCurrentEdit()))) {
              this.scrollRowIntoView(cell.row, !1);
              var preClickModeOn = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.className) === preClickClassName, column = this.columns[cell.cell], suppressActiveCellChangedEvent = !!(this._options.editable && (column != null && column.editor) && this._options.suppressActiveCellChangeOnEdit);
              this.setActiveCellInternal(this.getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
            }
          }, SlickGrid2.prototype.handleContextMenu = function(e) {
            var cell = e.target.closest(".slick-cell");
            cell && (this.activeCellNode === cell && this.currentEditor !== null || this.trigger(this.onContextMenu, {}, e));
          }, SlickGrid2.prototype.handleDblClick = function(e) {
            var cell = this.getCellFromEvent(e);
            !cell || this.currentEditor !== null && this.activeRow == cell.row && this.activeCell == cell.cell || (this.trigger(this.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && this._options.editable && this.gotoCell(cell.row, cell.cell, !0, e));
          }, SlickGrid2.prototype.handleHeaderMouseEnter = function(e) {
            var c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
            c && this.trigger(this.onHeaderMouseEnter, {
              column: c,
              grid: this
            }, e);
          }, SlickGrid2.prototype.handleHeaderMouseLeave = function(e) {
            var c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
            c && this.trigger(this.onHeaderMouseLeave, {
              column: c,
              grid: this
            }, e);
          }, SlickGrid2.prototype.handleHeaderRowMouseEnter = function(e) {
            var c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
            c && this.trigger(this.onHeaderRowMouseEnter, {
              column: c,
              grid: this
            }, e);
          }, SlickGrid2.prototype.handleHeaderRowMouseLeave = function(e) {
            var c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
            c && this.trigger(this.onHeaderRowMouseLeave, {
              column: c,
              grid: this
            }, e);
          }, SlickGrid2.prototype.handleHeaderContextMenu = function(e) {
            var header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
            this.trigger(this.onHeaderContextMenu, { column }, e);
          }, SlickGrid2.prototype.handleHeaderClick = function(e) {
            if (!this.columnResizeDragging) {
              var header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
              column && this.trigger(this.onHeaderClick, { column }, e);
            }
          }, SlickGrid2.prototype.handleFooterContextMenu = function(e) {
            var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
            this.trigger(this.onFooterContextMenu, { column }, e);
          }, SlickGrid2.prototype.handleFooterClick = function(e) {
            var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
            this.trigger(this.onFooterClick, { column }, e);
          }, SlickGrid2.prototype.handleCellMouseOver = function(e) {
            this.trigger(this.onMouseEnter, {}, e);
          }, SlickGrid2.prototype.handleCellMouseOut = function(e) {
            this.trigger(this.onMouseLeave, {}, e);
          }, SlickGrid2.prototype.cellExists = function(row, cell) {
            return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
          }, SlickGrid2.prototype.getCellFromPoint = function(x, y) {
            for (var row = this.getRowFromPosition(y), cell = 0, w = 0, i = 0; i < this.columns.length && w < x; i++)
              !this.columns[i] || this.columns[i].hidden || (w += this.columns[i].width, cell++);
            return cell < 0 && (cell = 0), { row, cell: cell - 1 };
          }, SlickGrid2.prototype.getCellFromNode = function(cellNode) {
            var cls = /l\d+/.exec(cellNode.className);
            if (!cls)
              throw new Error("SlickGrid getCellFromNode: cannot get cell - ".concat(cellNode.className));
            return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
          }, SlickGrid2.prototype.getRowFromNode = function(rowNode) {
            var _a;
            for (var row in this.rowsCache)
              for (var i in this.rowsCache[row].rowNode)
                if (((_a = this.rowsCache[row].rowNode) === null || _a === void 0 ? void 0 : _a[+i]) === rowNode)
                  return row ? parseInt(row) : 0;
            return null;
          }, SlickGrid2.prototype.getFrozenRowOffset = function(row) {
            var offset = 0;
            return this.hasFrozenRows ? this._options.frozenBottom ? row >= this.actualFrozenRow ? this.h < this.viewportTopH ? offset = this.actualFrozenRow * this._options.rowHeight : offset = this.h : offset = 0 : row >= this.actualFrozenRow ? offset = this.frozenRowsHeight : offset = 0 : offset = 0, offset;
          }, SlickGrid2.prototype.getCellFromEvent = function(evt) {
            var e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, targetEvent = e.touches ? e.touches[0] : e, cellNode = e.target.closest(".slick-cell");
            if (!cellNode)
              return null;
            var row = this.getRowFromNode(cellNode.parentNode);
            if (this.hasFrozenRows) {
              var rowOffset = 0, c = Utils.offset(Utils.parents(cellNode, ".grid-canvas")[0]), isBottom = Utils.parents(cellNode, ".grid-canvas-bottom").length;
              isBottom && (rowOffset = this._options.frozenBottom ? Utils.height(this._canvasTopL) : this.frozenRowsHeight), row = this.getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
            }
            var cell = this.getCellFromNode(cellNode);
            return row == null || cell == null ? null : { row, cell };
          }, SlickGrid2.prototype.getCellNodeBox = function(row, cell) {
            var _a;
            if (!this.cellExists(row, cell))
              return null;
            for (var frozenRowOffset = this.getFrozenRowOffset(row), y1 = this.getRowTop(row) - frozenRowOffset, y2 = y1 + this._options.rowHeight - 1, x1 = 0, i = 0; i < cell; i++)
              !this.columns[i] || this.columns[i].hidden || (x1 += this.columns[i].width || 0, this._options.frozenColumn == i && (x1 = 0));
            var x2 = x1 + (((_a = this.columns[cell]) === null || _a === void 0 ? void 0 : _a.width) || 0);
            return {
              top: y1,
              left: x1,
              bottom: y2,
              right: x2
            };
          }, SlickGrid2.prototype.resetActiveCell = function() {
            this.setActiveCellInternal(null, !1);
          }, SlickGrid2.prototype.focus = function() {
            this.setFocus();
          }, SlickGrid2.prototype.setFocus = function() {
            this.tabbingDirection == -1 ? this._focusSink.focus() : this._focusSink2.focus();
          }, SlickGrid2.prototype.scrollCellIntoView = function(row, cell, doPaging) {
            if (this.scrollRowIntoView(row, doPaging), !(cell <= this._options.frozenColumn)) {
              var colspan = this.getColspan(row, cell);
              this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
            }
          }, SlickGrid2.prototype.internalScrollColumnIntoView = function(left, right) {
            var _a, _b, scrollRight = this.scrollLeft + Utils.width(this._viewportScrollContainerX) - (this.viewportHasVScroll && (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0);
            left < this.scrollLeft ? (this._viewportScrollContainerX.scrollLeft = left, this.handleScroll(), this.render()) : right > scrollRight && (this._viewportScrollContainerX.scrollLeft = Math.min(left, right - this._viewportScrollContainerX.clientWidth), this.handleScroll(), this.render());
          }, SlickGrid2.prototype.scrollColumnIntoView = function(cell) {
            this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell]);
          }, SlickGrid2.prototype.setActiveCellInternal = function(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
            var _this = this, _a, _b, _c, _d;
            if (this.activeCellNode !== null && (this.makeActiveCellNormal(), this.activeCellNode.classList.remove("active"), (_b = (_a = this.rowsCache[this.activeRow]) === null || _a === void 0 ? void 0 : _a.rowNode) === null || _b === void 0 || _b.forEach(function(node) {
              return node.classList.remove("active");
            })), this.activeCellNode = newCell, this.activeCellNode != null) {
              var activeCellOffset = Utils.offset(this.activeCellNode), rowOffset = Math.floor(Utils.offset(Utils.parents(this.activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils.parents(this.activeCellNode, ".grid-canvas-bottom").length;
              this.hasFrozenRows && isBottom && (rowOffset -= this._options.frozenBottom ? Utils.height(this._canvasTopL) : this.frozenRowsHeight);
              var cell = this.getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
              this.activeRow = cell.row, this.activeCell = this.activePosX = this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode), opt_editMode == null && (opt_editMode = this.activeRow == this.getDataLength() || this._options.autoEdit), this._options.showCellSelection && (this.activeCellNode.classList.add("active"), (_d = (_c = this.rowsCache[this.activeRow]) === null || _c === void 0 ? void 0 : _c.rowNode) === null || _d === void 0 || _d.forEach(function(node) {
                return node.classList.add("active");
              })), this._options.editable && opt_editMode && this.isCellPotentiallyEditable(this.activeRow, this.activeCell) && (clearTimeout(this.h_editorLoader), this._options.asyncEditorLoading ? this.h_editorLoader = setTimeout(function() {
                _this.makeActiveCellEditable(void 0, preClickModeOn, e);
              }, this._options.asyncEditorLoadDelay) : this.makeActiveCellEditable(void 0, preClickModeOn, e));
            } else
              this.activeRow = this.activeCell = null;
            suppressActiveCellChangedEvent || this.trigger(this.onActiveCellChanged, this.getActiveCell());
          }, SlickGrid2.prototype.clearTextSelection = function() {
            var _a;
            if (!((_a = document.selection) === null || _a === void 0) && _a.empty)
              try {
                document.selection.empty();
              } catch (e) {
              }
            else if (window.getSelection) {
              var sel = window.getSelection();
              sel != null && sel.removeAllRanges && sel.removeAllRanges();
            }
          }, SlickGrid2.prototype.isCellPotentiallyEditable = function(row, cell) {
            var dataLength = this.getDataLength();
            return !(row < dataLength && !this.getDataItem(row) || this.columns[cell].cannotTriggerInsert && row >= dataLength || !this.columns[cell] || this.columns[cell].hidden || !this.getEditor(row, cell));
          }, SlickGrid2.prototype.makeActiveCellNormal = function() {
            if (this.currentEditor) {
              if (this.trigger(this.onBeforeCellEditorDestroy, { editor: this.currentEditor }), this.currentEditor.destroy(), this.currentEditor = null, this.activeCellNode) {
                var d = this.getDataItem(this.activeRow);
                if (this.activeCellNode.classList.remove("editable"), this.activeCellNode.classList.remove("invalid"), d) {
                  var column = this.columns[this.activeCell], formatter = this.getFormatter(this.activeRow, column), formatterResult = formatter(this.activeRow, this.activeCell, this.getDataItemValueForColumn(d, column), column, d, this);
                  this.applyFormatResultToCellNode(formatterResult, this.activeCellNode), this.invalidatePostProcessingResults(this.activeRow);
                }
              }
              navigator.userAgent.toLowerCase().match(/msie/) && this.clearTextSelection(), this.getEditorLock().deactivate(this.editController);
            }
          }, SlickGrid2.prototype.editActiveCell = function(editor, preClickModeOn, e) {
            this.makeActiveCellEditable(editor, preClickModeOn, e);
          }, SlickGrid2.prototype.makeActiveCellEditable = function(editor, preClickModeOn, e) {
            var _a, _b, _c, _d, _f;
            if (this.activeCellNode) {
              if (!this._options.editable)
                throw new Error("SlickGrid makeActiveCellEditable : should never get called when this._options.editable is false");
              if (clearTimeout(this.h_editorLoader), !!this.isCellPotentiallyEditable(this.activeRow, this.activeCell)) {
                var columnDef = this.columns[this.activeCell], item = this.getDataItem(this.activeRow);
                if (this.trigger(this.onBeforeEditCell, { row: this.activeRow, cell: this.activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
                  this.setFocus();
                  return;
                }
                this.getEditorLock().activate(this.editController), this.activeCellNode.classList.add("editable");
                var useEditor = editor || this.getEditor(this.activeRow, this.activeCell);
                !editor && !useEditor.suppressClearOnEdit && (this.activeCellNode.innerHTML = "");
                var metadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, this.activeRow);
                metadata = metadata == null ? void 0 : metadata.columns;
                var columnMetaData = metadata && (metadata[columnDef.id] || metadata[this.activeCell]);
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
                }), item && this.currentEditor && (this.currentEditor.loadValue(item), preClickModeOn && (!((_c = this.currentEditor) === null || _c === void 0) && _c.preClick) && this.currentEditor.preClick()), this.serializedEditorValue = (_d = this.currentEditor) === null || _d === void 0 ? void 0 : _d.serializeValue(), !((_f = this.currentEditor) === null || _f === void 0) && _f.position && this.handleActiveCellPositionChange();
              }
            }
          }, SlickGrid2.prototype.commitEditAndSetFocus = function() {
            this.getEditorLock().commitCurrentEdit() && (this.setFocus(), this._options.autoEdit && !this._options.autoCommitEdit && this.navigateDown());
          }, SlickGrid2.prototype.cancelEditAndSetFocus = function() {
            this.getEditorLock().cancelCurrentEdit() && this.setFocus();
          }, SlickGrid2.prototype.absBox = function(elem) {
            var box = {
              top: elem.offsetTop,
              left: elem.offsetLeft,
              bottom: 0,
              right: 0,
              width: elem.offsetWidth,
              height: elem.offsetWidth,
              visible: !0
            };
            box.bottom = box.top + box.height, box.right = box.left + box.width;
            for (var offsetParent = elem.offsetParent; (elem = elem.parentNode) !== document.body && !(!elem || !elem.parentNode); ) {
              var styles = getComputedStyle(elem);
              box.visible && elem.scrollHeight !== elem.offsetHeight && styles.overflowY !== "visible" && (box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight), box.visible && elem.scrollWidth !== elem.offsetWidth && styles.overflowX !== "visible" && (box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth), box.left -= elem.scrollLeft, box.top -= elem.scrollTop, elem === offsetParent && (box.left += elem.offsetLeft, box.top += elem.offsetTop, offsetParent = elem.offsetParent), box.bottom = box.top + box.height, box.right = box.left + box.width;
            }
            return box;
          }, SlickGrid2.prototype.getActiveCellPosition = function() {
            return this.absBox(this.activeCellNode);
          }, SlickGrid2.prototype.getGridPosition = function() {
            return this.absBox(this._container);
          }, SlickGrid2.prototype.handleActiveCellPositionChange = function() {
            if (this.activeCellNode && (this.trigger(this.onActiveCellPositionChanged, {}), this.currentEditor)) {
              var cellBox = this.getActiveCellPosition();
              this.currentEditor.show && this.currentEditor.hide && (cellBox.visible ? this.currentEditor.show() : this.currentEditor.hide()), this.currentEditor.position && this.currentEditor.position(cellBox);
            }
          }, SlickGrid2.prototype.getCellEditor = function() {
            return this.currentEditor;
          }, SlickGrid2.prototype.getActiveCell = function() {
            return this.activeCellNode ? { row: this.activeRow, cell: this.activeCell } : null;
          }, SlickGrid2.prototype.getActiveCellNode = function() {
            return this.activeCellNode;
          }, SlickGrid2.prototype.getTextSelection = function() {
            var _a, textSelection = null;
            if (window.getSelection) {
              var selection = window.getSelection();
              ((_a = selection == null ? void 0 : selection.rangeCount) !== null && _a !== void 0 ? _a : 0) > 0 && (textSelection = selection.getRangeAt(0));
            }
            return textSelection;
          }, SlickGrid2.prototype.setTextSelection = function(selection) {
            if (window.getSelection && selection) {
              var target = window.getSelection();
              target && (target.removeAllRanges(), target.addRange(selection));
            }
          }, SlickGrid2.prototype.scrollRowIntoView = function(row, doPaging) {
            var _a, _b;
            if (!this.hasFrozenRows || !this._options.frozenBottom && row > this.actualFrozenRow - 1 || this._options.frozenBottom && row < this.actualFrozenRow - 1) {
              var viewportScrollH = Utils.height(this._viewportScrollContainerY), rowNumber = this.hasFrozenRows && !this._options.frozenBottom ? row - this._options.frozenRow : row, rowAtTop = rowNumber * this._options.rowHeight, rowAtBottom = (rowNumber + 1) * this._options.rowHeight - viewportScrollH + (this.viewportHasHScroll && (_b = (_a = this.scrollbarDimensions) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0);
              (rowNumber + 1) * this._options.rowHeight > this.scrollTop + viewportScrollH + this.offset ? (this.scrollTo(doPaging ? rowAtTop : rowAtBottom), this.render()) : rowNumber * this._options.rowHeight < this.scrollTop + this.offset && (this.scrollTo(doPaging ? rowAtBottom : rowAtTop), this.render());
            }
          }, SlickGrid2.prototype.scrollRowToTop = function(row) {
            this.scrollTo(row * this._options.rowHeight), this.render();
          }, SlickGrid2.prototype.scrollPage = function(dir) {
            var deltaRows = dir * this.numVisibleRows, bottomOfTopmostFullyVisibleRow = this.scrollTop + this._options.rowHeight - 1;
            if (this.scrollTo((this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * this._options.rowHeight), this.render(), this._options.enableCellNavigation && this.activeRow != null) {
              var row = this.activeRow + deltaRows, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
              row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
              for (var cell = 0, prevCell = null, prevActivePosX = this.activePosX; cell <= this.activePosX; )
                this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
              prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
            }
          }, SlickGrid2.prototype.navigatePageDown = function() {
            this.scrollPage(1);
          }, SlickGrid2.prototype.navigatePageUp = function() {
            this.scrollPage(-1);
          }, SlickGrid2.prototype.navigateTop = function() {
            this.navigateToRow(0);
          }, SlickGrid2.prototype.navigateBottom = function() {
            this.navigateToRow(this.getDataLength() - 1);
          }, SlickGrid2.prototype.navigateToRow = function(row) {
            var num_rows = this.getDataLength();
            if (!num_rows)
              return !0;
            if (row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), this.scrollCellIntoView(row, 0, !0), this._options.enableCellNavigation && this.activeRow != null) {
              for (var cell = 0, prevCell = null, prevActivePosX = this.activePosX; cell <= this.activePosX; )
                this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
              prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
            }
            return !0;
          }, SlickGrid2.prototype.getColspan = function(row, cell) {
            var _a, _b, metadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row);
            if (!metadata || !metadata.columns)
              return 1;
            var columnData = metadata.columns[this.columns[cell].id] || metadata.columns[cell], colspan = columnData == null ? void 0 : columnData.colspan;
            return colspan === "*" ? colspan = this.columns.length - cell : colspan = colspan || 1, colspan;
          }, SlickGrid2.prototype.findFirstFocusableCell = function(row) {
            for (var cell = 0; cell < this.columns.length; ) {
              if (this.canCellBeActive(row, cell))
                return cell;
              cell += this.getColspan(row, cell);
            }
            return null;
          }, SlickGrid2.prototype.findLastFocusableCell = function(row) {
            for (var cell = 0, lastFocusableCell = null; cell < this.columns.length; )
              this.canCellBeActive(row, cell) && (lastFocusableCell = cell), cell += this.getColspan(row, cell);
            return lastFocusableCell;
          }, SlickGrid2.prototype.gotoRight = function(row, cell, _posX) {
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
          }, SlickGrid2.prototype.gotoLeft = function(row, cell, _posX) {
            if (cell <= 0)
              return null;
            var firstFocusableCell = this.findFirstFocusableCell(row);
            if (firstFocusableCell === null || firstFocusableCell >= cell)
              return null;
            for (var prev = {
              row,
              cell: firstFocusableCell,
              posX: firstFocusableCell
            }, pos; ; ) {
              if (pos = this.gotoRight(prev.row, prev.cell, prev.posX), !pos)
                return null;
              if (pos.cell >= cell)
                return prev;
              prev = pos;
            }
          }, SlickGrid2.prototype.gotoDown = function(row, cell, posX) {
            for (var prevCell, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew(); ; ) {
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
          }, SlickGrid2.prototype.gotoUp = function(row, cell, posX) {
            for (var prevCell; ; ) {
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
          }, SlickGrid2.prototype.gotoNext = function(row, cell, posX) {
            if (row == null && cell == null && (row = cell = posX = 0, this.canCellBeActive(row, cell)))
              return {
                row,
                cell,
                posX: cell
              };
            var pos = this.gotoRight(row, cell, posX);
            if (pos)
              return pos;
            var firstFocusableCell = null, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
            for (row === dataLengthIncludingAddNew - 1 && row--; ++row < dataLengthIncludingAddNew; )
              if (firstFocusableCell = this.findFirstFocusableCell(row), firstFocusableCell !== null)
                return {
                  row,
                  cell: firstFocusableCell,
                  posX: firstFocusableCell
                };
            return null;
          }, SlickGrid2.prototype.gotoPrev = function(row, cell, posX) {
            if (row == null && cell == null && (row = this.getDataLengthIncludingAddNew() - 1, cell = posX = this.columns.length - 1, this.canCellBeActive(row, cell)))
              return {
                row,
                cell,
                posX: cell
              };
            for (var pos, lastSelectableCell; !pos && (pos = this.gotoLeft(row, cell, posX), !pos); ) {
              if (--row < 0)
                return null;
              cell = 0, lastSelectableCell = this.findLastFocusableCell(row), lastSelectableCell !== null && (pos = {
                row,
                cell: lastSelectableCell,
                posX: lastSelectableCell
              });
            }
            return pos;
          }, SlickGrid2.prototype.gotoRowStart = function(row, _cell, _posX) {
            var newCell = this.findFirstFocusableCell(row);
            return newCell === null ? null : {
              row,
              cell: newCell,
              posX: newCell
            };
          }, SlickGrid2.prototype.gotoRowEnd = function(row, _cell, _posX) {
            var newCell = this.findLastFocusableCell(row);
            return newCell === null ? null : {
              row,
              cell: newCell,
              posX: newCell
            };
          }, SlickGrid2.prototype.navigateRight = function() {
            return this.navigate("right");
          }, SlickGrid2.prototype.navigateLeft = function() {
            return this.navigate("left");
          }, SlickGrid2.prototype.navigateDown = function() {
            return this.navigate("down");
          }, SlickGrid2.prototype.navigateUp = function() {
            return this.navigate("up");
          }, SlickGrid2.prototype.navigateNext = function() {
            return this.navigate("next");
          }, SlickGrid2.prototype.navigatePrev = function() {
            return this.navigate("prev");
          }, SlickGrid2.prototype.navigateRowStart = function() {
            return this.navigate("home");
          }, SlickGrid2.prototype.navigateRowEnd = function() {
            return this.navigate("end");
          }, SlickGrid2.prototype.navigate = function(dir) {
            if (!this._options.enableCellNavigation || !this.activeCellNode && dir !== "prev" && dir !== "next")
              return !1;
            if (!this.getEditorLock().commitCurrentEdit())
              return !0;
            this.setFocus();
            var tabbingDirections = {
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
            var stepFunctions = {
              up: this.gotoUp,
              down: this.gotoDown,
              left: this.gotoLeft,
              right: this.gotoRight,
              prev: this.gotoPrev,
              next: this.gotoNext,
              home: this.gotoRowStart,
              end: this.gotoRowEnd
            }, stepFn = stepFunctions[dir], pos = stepFn.call(this, this.activeRow, this.activeCell, this.activePosX);
            if (pos) {
              if (this.hasFrozenRows && this._options.frozenBottom && pos.row == this.getDataLength())
                return;
              var isAddNewRow = pos.row == this.getDataLength();
              return (!this._options.frozenBottom && pos.row >= this.actualFrozenRow || this._options.frozenBottom && pos.row < this.actualFrozenRow) && this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling), this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell)), this.activePosX = pos.posX, !0;
            } else
              return this.setActiveCellInternal(this.getCellNode(this.activeRow, this.activeCell)), !1;
          }, SlickGrid2.prototype.getCellNode = function(row, cell) {
            if (this.rowsCache[row]) {
              this.ensureCellNodesInRowsCache(row);
              try {
                return this.rowsCache[row].cellNodesByColumnIdx.length > cell ? this.rowsCache[row].cellNodesByColumnIdx[cell] : null;
              } catch (e) {
                return this.rowsCache[row].cellNodesByColumnIdx[cell];
              }
            }
            return null;
          }, SlickGrid2.prototype.setActiveCell = function(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
            this.initialized && (row > this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || this._options.enableCellNavigation && (this.scrollCellIntoView(row, cell, !1), this.setActiveCellInternal(this.getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent)));
          }, SlickGrid2.prototype.setActiveRow = function(row, cell, suppressScrollIntoView) {
            this.initialized && (row > this.getDataLength() || row < 0 || (cell != null ? cell : 0) >= this.columns.length || (cell != null ? cell : 0) < 0 || (this.activeRow = row, suppressScrollIntoView || this.scrollCellIntoView(row, cell || 0, !1)));
          }, SlickGrid2.prototype.canCellBeActive = function(row, cell) {
            var _a, _b, _c, _d;
            if (!this.options.enableCellNavigation || row >= this.getDataLengthIncludingAddNew() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
              return !1;
            var rowMetadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row);
            if ((rowMetadata == null ? void 0 : rowMetadata.focusable) !== void 0)
              return !!rowMetadata.focusable;
            var columnMetadata = rowMetadata == null ? void 0 : rowMetadata.columns;
            return ((_c = columnMetadata == null ? void 0 : columnMetadata[this.columns[cell].id]) === null || _c === void 0 ? void 0 : _c.focusable) !== void 0 ? !!columnMetadata[this.columns[cell].id].focusable : ((_d = columnMetadata == null ? void 0 : columnMetadata[cell]) === null || _d === void 0 ? void 0 : _d.focusable) !== void 0 ? !!columnMetadata[cell].focusable : !!this.columns[cell].focusable;
          }, SlickGrid2.prototype.canCellBeSelected = function(row, cell) {
            var _a, _b;
            if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
              return !1;
            var rowMetadata = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.getItemMetadata) === null || _b === void 0 ? void 0 : _b.call(_a, row);
            if ((rowMetadata == null ? void 0 : rowMetadata.selectable) !== void 0)
              return !!rowMetadata.selectable;
            var columnMetadata = (rowMetadata == null ? void 0 : rowMetadata.columns) && (rowMetadata.columns[this.columns[cell].id] || rowMetadata.columns[cell]);
            return (columnMetadata == null ? void 0 : columnMetadata.selectable) !== void 0 ? !!columnMetadata.selectable : !!this.columns[cell].selectable;
          }, SlickGrid2.prototype.gotoCell = function(row, cell, forceEdit, e) {
            if (this.initialized && this.canCellBeActive(row, cell) && this.getEditorLock().commitCurrentEdit()) {
              this.scrollCellIntoView(row, cell, !1);
              var newCell = this.getCellNode(row, cell), column = this.columns[cell], suppressActiveCellChangedEvent = !!(this._options.editable && (column != null && column.editor) && this._options.suppressActiveCellChangeOnEdit);
              this.setActiveCellInternal(newCell, forceEdit || row === this.getDataLength() || this._options.autoEdit, null, suppressActiveCellChangedEvent, e), this.currentEditor || this.setFocus();
            }
          }, SlickGrid2.prototype.commitCurrentEdit = function() {
            var self = this, item = self.getDataItem(self.activeRow), column = self.columns[self.activeCell];
            if (self.currentEditor) {
              if (self.currentEditor.isValueChanged()) {
                var validationResults = self.currentEditor.validate();
                if (validationResults.valid) {
                  var row_1 = self.activeRow, cell_1 = self.activeCell, editor_1 = self.currentEditor, serializedValue_1 = self.currentEditor.serializeValue(), prevSerializedValue_1 = self.serializedEditorValue;
                  if (self.activeRow < self.getDataLength()) {
                    var editCommand = {
                      row: row_1,
                      cell: cell_1,
                      editor: editor_1,
                      serializedValue: serializedValue_1,
                      prevSerializedValue: prevSerializedValue_1,
                      execute: function() {
                        editor_1.applyValue(item, serializedValue_1), self.updateRow(row_1), self.trigger(self.onCellChange, { command: "execute", row: row_1, cell: cell_1, item, column });
                      },
                      undo: function() {
                        editor_1.applyValue(item, prevSerializedValue_1), self.updateRow(row_1), self.trigger(self.onCellChange, { command: "undo", row: row_1, cell: cell_1, item, column });
                      }
                    };
                    self.options.editCommandHandler ? (self.makeActiveCellNormal(), self.options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), self.makeActiveCellNormal());
                  } else {
                    var newItem = {};
                    self.currentEditor.applyValue(newItem, self.currentEditor.serializeValue()), self.makeActiveCellNormal(), self.trigger(self.onAddNewRow, { item: newItem, column });
                  }
                  return !self.getEditorLock().isActive();
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
              self.makeActiveCellNormal();
            }
            return !0;
          }, SlickGrid2.prototype.cancelCurrentEdit = function() {
            return this.makeActiveCellNormal(), !0;
          }, SlickGrid2.prototype.rowsToRanges = function(rows) {
            for (var ranges = [], lastCell = this.columns.length - 1, i = 0; i < rows.length; i++)
              ranges.push(new SlickRange(rows[i], 0, rows[i], lastCell));
            return ranges;
          }, SlickGrid2.prototype.getSelectedRows = function() {
            if (!this.selectionModel)
              throw new Error("SlickGrid Selection model is not set");
            return this.selectedRows.slice(0);
          }, SlickGrid2.prototype.setSelectedRows = function(rows, caller) {
            if (!this.selectionModel)
              throw new Error("SlickGrid Selection model is not set");
            this && this.getEditorLock && !this.getEditorLock().isActive() && this.selectionModel.setSelectedRanges(this.rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
          }, SlickGrid2.prototype.sanitizeHtmlString = function(dirtyHtml, suppressLogging) {
            if (!this._options.sanitizer || typeof dirtyHtml != "string")
              return dirtyHtml;
            var cleanHtml = this._options.sanitizer(dirtyHtml);
            return !suppressLogging && this._options.logSanitizedHtml && this.logMessageCount <= this.logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log("sanitizer altered html: ".concat(dirtyHtml, " --> ").concat(cleanHtml)), this.logMessageCount === this.logMessageMaxCount && console.log("sanitizer: silencing messages after first ".concat(this.logMessageMaxCount)), this.logMessageCount++), cleanHtml;
          }, SlickGrid2;
        }()
      );
      exports.SlickGrid = SlickGrid;
      window.Slick && Utils.extend(Slick, {
        Grid: SlickGrid
      });
    }
  });
  require_slick_grid();
})();
//# sourceMappingURL=slick.grid.js.map
