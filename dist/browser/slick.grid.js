"use strict";
(() => {
  // src/slick.grid.js
  var BindingEventService = Slick.BindingEventService, ColAutosizeMode = Slick.ColAutosizeMode, SlickEvent = Slick.Event, EventData = Slick.EventData, GlobalEditorLock = Slick.GlobalEditorLock, GridAutosizeColsMode = Slick.GridAutosizeColsMode, Group = Slick.Group, GroupTotals = Slick.GroupTotals, keyCode = Slick.keyCode, preClickClassName = Slick.preClickClassName, SlickRange = Slick.Range, RowSelectionMode = Slick.RowSelectionMode, ValueFilterMode = Slick.ValueFilterMode, Utils = Slick.Utils, WidthEvalMode = Slick.WidthEvalMode, Draggable = Slick.Draggable, MouseWheel = Slick.MouseWheel, Resizable = Slick.Resizable, scrollbarDimensions, maxSupportedCssHeight;
  function SlickGrid(container, data, columns, options) {
    var defaults = {
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
      defaultFormatter,
      forceSyncScrolling: !1,
      addNewRowCssClass: "new-row",
      preserveCopiedSelectionOnPaste: !1,
      showCellSelection: !0,
      viewportClass: null,
      minRowBuffer: 3,
      emulatePagingWhenScrolling: !0,
      // when scrolling off bottom of viewport, place new row at top of viewport
      editorCellNavOnLRKeys: !1,
      enableMouseWheelScrollHandler: !0,
      doPaging: !0,
      autosizeColsMode: GridAutosizeColsMode.LegacyOff,
      autosizeColPaddingPx: 4,
      autosizeTextAvgToMWidthRatio: 0.75,
      viewportSwitchToScrollModeWidthPercent: void 0,
      viewportMinWidthPx: void 0,
      viewportMaxWidthPx: void 0,
      suppressCssChangesOnHiddenInit: !1,
      scrollDebounceDelay: -1,
      // add a scroll delay to avoid screen flickering, -1 to disable delay
      ffMaxSupportedCssHeight: 6e6,
      maxSupportedCssHeight: 1e9,
      sanitizer: void 0,
      // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
      logSanitizedHtml: !1
      // log to console when sanitised - recommend true for testing of dev and production
    }, columnDefaults = {
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
    }, columnAutosizeDefaults = {
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
    }, th, h, ph, n, cj, page = 0, offset = 0, vScrollDir = 1;
    let show = Utils.show, hide = Utils.hide;
    var _bindingEventService = new BindingEventService(), initialized = !1, _container, uid = "slickgrid_" + Math.round(1e6 * Math.random()), self = this, _focusSink, _focusSink2, _groupHeaders = [], _headerScroller = [], _headers = [], _headerRows, _headerRowScroller, _headerRowSpacerL, _headerRowSpacerR, _footerRow, _footerRowScroller, _footerRowSpacerL, _footerRowSpacerR, _preHeaderPanel, _preHeaderPanelScroller, _preHeaderPanelSpacer, _preHeaderPanelR, _preHeaderPanelScrollerR, _preHeaderPanelSpacerR, _topPanelScrollers, _topPanels, _viewport, _canvas, _style, _boundAncestors = [], stylesheet, columnCssRulesL, columnCssRulesR, viewportH, viewportW, canvasWidth, canvasWidthL, canvasWidthR, headersWidth, headersWidthL, headersWidthR, viewportHasHScroll, viewportHasVScroll, headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, cellWidthDiff = 0, cellHeightDiff = 0, absoluteColumnMinWidth, hasFrozenRows = !1, frozenRowsHeight = 0, actualFrozenRow = -1, paneTopH = 0, paneBottomH = 0, viewportTopH = 0, viewportBottomH = 0, topPanelH = 0, headerRowH = 0, footerRowH = 0, tabbingDirection = 1, _activeCanvasNode, _activeViewportNode, activePosX, activeRow, activeCell, activeCellNode = null, currentEditor = null, serializedEditorValue, editController, rowsCache = {}, renderedRows = 0, numVisibleRows = 0, prevScrollTop = 0, scrollTop = 0, lastRenderedScrollTop = 0, lastRenderedScrollLeft = 0, prevScrollLeft = 0, scrollLeft = 0, selectionModel, selectedRows = [], plugins = [], cellCssClasses = {}, columnsById = {}, sortColumns = [], columnPosLeft = [], columnPosRight = [], pagingActive = !1, pagingIsLastPage = !1, scrollThrottle = ActionThrottle(render, 50), h_editorLoader = null, h_render = null, h_postrender = null, h_postrenderCleanup = null, postProcessedRows = {}, postProcessToRow = null, postProcessFromRow = null, postProcessedCleanupQueue = [], postProcessgroupId = 0, counter_rows_rendered = 0, counter_rows_removed = 0, _paneHeaderL, _paneHeaderR, _paneTopL, _paneTopR, _paneBottomL, _paneBottomR, _headerScrollerL, _headerScrollerR, _headerL, _headerR, _groupHeadersL, _groupHeadersR, _headerRowScrollerL, _headerRowScrollerR, _footerRowScrollerL, _footerRowScrollerR, _headerRowL, _headerRowR, _footerRowL, _footerRowR, _topPanelScrollerL, _topPanelScrollerR, _topPanelL, _topPanelR, _viewportTopL, _viewportTopR, _viewportBottomL, _viewportBottomR, _canvasTopL, _canvasTopR, _canvasBottomL, _canvasBottomR, _viewportScrollContainerX, _viewportScrollContainerY, _headerScrollContainer, _headerRowScrollContainer, _footerRowScrollContainer, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, _hiddenParents, oldProps = [], enforceFrozenRowHeightRecalc = !1, columnResizeDragging = !1, slickDraggableInstance = null, slickMouseWheelInstances = [], slickResizableInstances = [], sortableSideLeftInstance, sortableSideRightInstance;
    function init() {
      if (typeof container == "string" ? _container = document.querySelector(container) : _container = container, !_container)
        throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
      if (maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight(), options = Utils.extend(!0, {}, defaults, options), validateAndEnforceOptions(), columnDefaults.width = options.defaultColumnWidth, options.suppressCssChangesOnHiddenInit || cacheCssForHiddenInit(), updateColumnProps(), options.enableColumnReorder && (!Sortable || !Sortable.create))
        throw new Error("SlickGrid requires Sortable.js module to be loaded");
      editController = {
        commitCurrentEdit,
        cancelCurrentEdit
      }, _container.replaceChildren(), _container.style.overflow = "hidden", _container.style.outline = 0, _container.classList.add(uid), _container.classList.add("ui-widget");
      let containerStyles = window.getComputedStyle(_container);
      /relative|absolute|fixed/.test(containerStyles.position) || (_container.style.position = "relative"), _focusSink = Utils.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, _container), _paneHeaderL = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, _container), _paneHeaderR = Utils.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, _container), _paneTopL = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, _container), _paneTopR = Utils.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, _container), _paneBottomL = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, _container), _paneBottomR = Utils.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, _container), options.createPreHeaderPanel && (_preHeaderPanelScroller = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, _paneHeaderL), _preHeaderPanelScroller.appendChild(document.createElement("div")), _preHeaderPanel = Utils.createDomElement("div", null, _preHeaderPanelScroller), _preHeaderPanelSpacer = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _preHeaderPanelScroller), _preHeaderPanelScrollerR = Utils.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, _paneHeaderR), _preHeaderPanelR = Utils.createDomElement("div", null, _preHeaderPanelScrollerR), _preHeaderPanelSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _preHeaderPanelScrollerR), options.showPreHeaderPanel || (hide(_preHeaderPanelScroller), hide(_preHeaderPanelScrollerR))), _headerScrollerL = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, _paneHeaderL), _headerScrollerR = Utils.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, _paneHeaderR), _headerScroller.push(_headerScrollerL), _headerScroller.push(_headerScrollerR), _headerL = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", style: { left: "-1000px" } }, _headerScrollerL), _headerR = Utils.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", style: { left: "-1000px" } }, _headerScrollerR), _headers = [_headerL, _headerR], _headerRowScrollerL = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, _paneTopL), _headerRowScrollerR = Utils.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, _paneTopR), _headerRowScroller = [_headerRowScrollerL, _headerRowScrollerR], _headerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _headerRowScrollerL), _headerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _headerRowScrollerR), _headerRowL = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, _headerRowScrollerL), _headerRowR = Utils.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, _headerRowScrollerR), _headerRows = [_headerRowL, _headerRowR], _topPanelScrollerL = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, _paneTopL), _topPanelScrollerR = Utils.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, _paneTopR), _topPanelScrollers = [_topPanelScrollerL, _topPanelScrollerR], _topPanelL = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, _topPanelScrollerL), _topPanelR = Utils.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, _topPanelScrollerR), _topPanels = [_topPanelL, _topPanelR], options.showColumnHeader || _headerScroller.forEach(function(el) {
        hide(el);
      }), options.showTopPanel || _topPanelScrollers.forEach(function(scroller) {
        hide(scroller);
      }), options.showHeaderRow || _headerRowScroller.forEach(function(scroller) {
        hide(scroller);
      }), _viewportTopL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, _paneTopL), _viewportTopR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, _paneTopR), _viewportBottomL = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, _paneBottomL), _viewportBottomR = Utils.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, _paneBottomR), _viewport = [_viewportTopL, _viewportTopR, _viewportBottomL, _viewportBottomR], options.viewportClass && _viewport.forEach(function(view) {
        view.classList.add(options.viewportClass);
      }), _activeViewportNode = _viewportTopL, _canvasTopL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, _viewportTopL), _canvasTopR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, _viewportTopR), _canvasBottomL = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, _viewportBottomL), _canvasBottomR = Utils.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, _viewportBottomR), _canvas = [_canvasTopL, _canvasTopR, _canvasBottomL, _canvasBottomR], scrollbarDimensions = scrollbarDimensions || measureScrollbar(), _activeCanvasNode = _canvasTopL, _preHeaderPanelSpacer && Utils.width(_preHeaderPanelSpacer, getCanvasWidth() + scrollbarDimensions.width), _headers.forEach(function(el) {
        Utils.width(el, getHeadersWidth());
      }), Utils.width(_headerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width), Utils.width(_headerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width), options.createFooterRow && (_footerRowScrollerR = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, _paneTopR), _footerRowScrollerL = Utils.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, _paneTopL), _footerRowScroller = [_footerRowScrollerL, _footerRowScrollerR], _footerRowSpacerL = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _footerRowScrollerL), Utils.width(_footerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width), _footerRowSpacerR = Utils.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _footerRowScrollerR), Utils.width(_footerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width), _footerRowL = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, _footerRowScrollerL), _footerRowR = Utils.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, _footerRowScrollerR), _footerRow = [_footerRowL, _footerRowR], options.showFooterRow || _footerRowScroller.forEach(function(scroller) {
        hide(scroller);
      })), _focusSink2 = _focusSink.cloneNode(!0), _container.append(_focusSink2), options.explicitInitialization || finishInitialization();
    }
    function finishInitialization() {
      initialized || (initialized = !0, getViewportWidth(), getViewportHeight(), measureCellPaddingAndBorder(), disableSelection(_headers), options.enableTextSelectionOnCells || _viewport.forEach(function(view) {
        _bindingEventService.bind(view, "selectstart.ui", function(event) {
          event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
        });
      }), setFrozenOptions(), setPaneVisibility(), setScroller(), setOverflow(), updateColumnCaches(), createColumnHeaders(), createColumnFooter(), setupColumnSort(), createCssRules(), resizeCanvas(), bindAncestorScrollEvents(), _bindingEventService.bind(_container, "resize.slickgrid", resizeCanvas), _viewport.forEach(function(view) {
        _bindingEventService.bind(view, "scroll", handleScroll);
      }), options.enableMouseWheelScrollHandler && _viewport.forEach(function(view) {
        slickMouseWheelInstances.push(MouseWheel({
          element: view,
          onMouseWheel: handleMouseWheel
        }));
      }), _headerScroller.forEach(function(el) {
        _bindingEventService.bind(el, "contextmenu", handleHeaderContextMenu), _bindingEventService.bind(el, "click", handleHeaderClick);
      }), _headerRowScroller.forEach(function(scroller) {
        _bindingEventService.bind(scroller, "scroll", handleHeaderRowScroll);
      }), options.createFooterRow && (_footerRow.forEach(function(footer) {
        _bindingEventService.bind(footer, "contextmenu", handleFooterContextMenu), _bindingEventService.bind(footer, "click", handleFooterClick);
      }), _footerRowScroller.forEach(function(scroller) {
        _bindingEventService.bind(scroller, "scroll", handleFooterRowScroll);
      })), options.createPreHeaderPanel && _bindingEventService.bind(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll), _bindingEventService.bind(_focusSink, "keydown", handleKeyDown), _bindingEventService.bind(_focusSink2, "keydown", handleKeyDown), _canvas.forEach(function(element) {
        _bindingEventService.bind(element, "keydown", handleKeyDown), _bindingEventService.bind(element, "click", handleClick), _bindingEventService.bind(element, "dblclick", handleDblClick), _bindingEventService.bind(element, "contextmenu", handleContextMenu), _bindingEventService.bind(element, "mouseover", handleCellMouseOver), _bindingEventService.bind(element, "mouseout", handleCellMouseOut);
      }), Draggable && (slickDraggableInstance = Draggable({
        containerElement: _container,
        allowDragFrom: "div.slick-cell",
        onDragInit: handleDragInit,
        onDragStart: handleDragStart,
        onDrag: handleDrag,
        onDragEnd: handleDragEnd
      })), options.suppressCssChangesOnHiddenInit || restoreCssFromHiddenInit());
    }
    function cacheCssForHiddenInit() {
      _hiddenParents = Utils.parents(_container, ":hidden");
      for (let el of _hiddenParents) {
        var old = {};
        for (let name in cssShow)
          old[name] = el.style[name], el.style[name] = cssShow[name];
        oldProps.push(old);
      }
    }
    function restoreCssFromHiddenInit() {
      let i2 = 0;
      for (let el of _hiddenParents) {
        var old = oldProps[i2++];
        for (let name in cssShow)
          el.style[name] = old[name];
      }
    }
    function hasFrozenColumns() {
      return options.frozenColumn > -1;
    }
    function registerPlugin(plugin) {
      plugins.unshift(plugin), plugin.init(self);
    }
    function unregisterPlugin(plugin) {
      for (var i2 = plugins.length; i2 >= 0; i2--)
        if (plugins[i2] === plugin) {
          plugins[i2].destroy && plugins[i2].destroy(), plugins.splice(i2, 1);
          break;
        }
    }
    function getPluginByName(name) {
      for (var i2 = plugins.length - 1; i2 >= 0; i2--)
        if (plugins[i2].pluginName === name)
          return plugins[i2];
    }
    function setSelectionModel(model) {
      selectionModel && (selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged), selectionModel.destroy && selectionModel.destroy()), selectionModel = model, selectionModel && (selectionModel.init(self), selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged));
    }
    function getSelectionModel() {
      return selectionModel;
    }
    function getCanvasNode(columnIdOrIdx, rowIndex) {
      return _getContainerElement(getCanvases(), columnIdOrIdx, rowIndex);
    }
    function getActiveCanvasNode(e) {
      return e === void 0 || (e instanceof EventData && (e = e.getNativeEvent()), _activeCanvasNode = e.target.closest(".grid-canvas")), _activeCanvasNode;
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
      return setActiveViewportNode(e), _activeViewportNode;
    }
    function setActiveViewportNode(e) {
      return e instanceof EventData && (e = e.getNativeEvent()), _activeViewportNode = e.target.closest(".slick-viewport"), _activeViewportNode;
    }
    function _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
      if (targetContainers) {
        columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
        var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), isBottomSide = hasFrozenRows && rowIndex >= actualFrozenRow + (options.frozenBottom ? 0 : 1), isRightSide = hasFrozenColumns() && idx > options.frozenColumn;
        return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
      }
    }
    function measureScrollbar() {
      var outerdiv = Utils.createDomElement("div", { className: _viewport.className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
        width: outerdiv.offsetWidth - outerdiv.clientWidth,
        height: outerdiv.offsetHeight - outerdiv.clientHeight
      };
      return innerdiv.remove(), outerdiv.remove(), dim;
    }
    function getHeadersWidth() {
      headersWidth = headersWidthL = headersWidthR = 0;
      for (var includeScrollbar = !options.autoHeight, i2 = 0, ii = columns.length; i2 < ii; i2++)
        if (!(!columns[i2] || columns[i2].hidden)) {
          var width = columns[i2].width;
          options.frozenColumn > -1 && i2 > options.frozenColumn ? headersWidthR += width : headersWidthL += width;
        }
      return includeScrollbar && (options.frozenColumn > -1 && i2 > options.frozenColumn ? headersWidthR += scrollbarDimensions.width : headersWidthL += scrollbarDimensions.width), hasFrozenColumns() ? (headersWidthL = headersWidthL + 1e3, headersWidthR = Math.max(headersWidthR, viewportW) + headersWidthL, headersWidthR += scrollbarDimensions.width) : (headersWidthL += scrollbarDimensions.width, headersWidthL = Math.max(headersWidthL, viewportW) + 1e3), headersWidth = headersWidthL + headersWidthR, Math.max(headersWidth, viewportW) + 1e3;
    }
    function getHeadersWidthL() {
      return headersWidthL = 0, columns.forEach(function(column, i2) {
        column.hidden || options.frozenColumn > -1 && i2 > options.frozenColumn || (headersWidthL += column.width);
      }), hasFrozenColumns() ? headersWidthL += 1e3 : (headersWidthL += scrollbarDimensions.width, headersWidthL = Math.max(headersWidthL, viewportW) + 1e3), headersWidthL;
    }
    function getHeadersWidthR() {
      return headersWidthR = 0, columns.forEach(function(column, i2) {
        column.hidden || options.frozenColumn > -1 && i2 > options.frozenColumn && (headersWidthR += column.width);
      }), hasFrozenColumns() && (headersWidthR = Math.max(headersWidthR, viewportW) + getHeadersWidthL(), headersWidthR += scrollbarDimensions.width), headersWidthR;
    }
    function getCanvasWidth() {
      var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW, i2 = columns.length;
      for (canvasWidthL = canvasWidthR = 0; i2--; )
        !columns[i2] || columns[i2].hidden || (hasFrozenColumns() && i2 > options.frozenColumn ? canvasWidthR += columns[i2].width : canvasWidthL += columns[i2].width);
      var totalRowWidth = canvasWidthL + canvasWidthR;
      if (options.fullWidthRows) {
        var extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
        extraWidth > 0 && (totalRowWidth += extraWidth, hasFrozenColumns() ? canvasWidthR += extraWidth : canvasWidthL += extraWidth);
      }
      return totalRowWidth;
    }
    function updateCanvasWidth(forceColumnWidthsUpdate) {
      var oldCanvasWidth = canvasWidth, oldCanvasWidthL = canvasWidthL, oldCanvasWidthR = canvasWidthR, widthChanged;
      if (canvasWidth = getCanvasWidth(), widthChanged = canvasWidth !== oldCanvasWidth || canvasWidthL !== oldCanvasWidthL || canvasWidthR !== oldCanvasWidthR, widthChanged || hasFrozenColumns() || hasFrozenRows)
        if (Utils.width(_canvasTopL, canvasWidthL), getHeadersWidth(), Utils.width(_headerL, headersWidthL), Utils.width(_headerR, headersWidthR), hasFrozenColumns()) {
          let cWidth = Utils.width(_container) || 0;
          if (cWidth > 0 && canvasWidthL > cWidth)
            throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
          Utils.width(_canvasTopR, canvasWidthR), Utils.width(_paneHeaderL, canvasWidthL), Utils.setStyleSize(_paneHeaderR, "left", canvasWidthL), Utils.setStyleSize(_paneHeaderR, "width", viewportW - canvasWidthL), Utils.width(_paneTopL, canvasWidthL), Utils.setStyleSize(_paneTopR, "left", canvasWidthL), Utils.width(_paneTopR, viewportW - canvasWidthL), Utils.width(_headerRowScrollerL, canvasWidthL), Utils.width(_headerRowScrollerR, viewportW - canvasWidthL), Utils.width(_headerRowL, canvasWidthL), Utils.width(_headerRowR, canvasWidthR), options.createFooterRow && (Utils.width(_footerRowScrollerL, canvasWidthL), Utils.width(_footerRowScrollerR, viewportW - canvasWidthL), Utils.width(_footerRowL, canvasWidthL), Utils.width(_footerRowR, canvasWidthR)), options.createPreHeaderPanel && Utils.width(_preHeaderPanel, canvasWidth), Utils.width(_viewportTopL, canvasWidthL), Utils.width(_viewportTopR, viewportW - canvasWidthL), hasFrozenRows && (Utils.width(_paneBottomL, canvasWidthL), Utils.setStyleSize(_paneBottomR, "left", canvasWidthL), Utils.width(_viewportBottomL, canvasWidthL), Utils.width(_viewportBottomR, viewportW - canvasWidthL), Utils.width(_canvasBottomL, canvasWidthL), Utils.width(_canvasBottomR, canvasWidthR));
        } else
          Utils.width(_paneHeaderL, "100%"), Utils.width(_paneTopL, "100%"), Utils.width(_headerRowScrollerL, "100%"), Utils.width(_headerRowL, canvasWidth), options.createFooterRow && (Utils.width(_footerRowScrollerL, "100%"), Utils.width(_footerRowL, canvasWidth)), options.createPreHeaderPanel && Utils.width(_preHeaderPanel, canvasWidth), Utils.width(_viewportTopL, "100%"), hasFrozenRows && (Utils.width(_viewportBottomL, "100%"), Utils.width(_canvasBottomL, canvasWidthL));
      viewportHasHScroll = canvasWidth >= viewportW - scrollbarDimensions.width, Utils.width(_headerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), Utils.width(_headerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), options.createFooterRow && (Utils.width(_footerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), Utils.width(_footerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0))), (widthChanged || forceColumnWidthsUpdate) && applyColumnWidths();
    }
    function disableSelection(target) {
      target.forEach(function(el) {
        el.setAttribute("unselectable", "on"), el.style.MozUserSelect = "none", _bindingEventService.bind(el, "selectstart.ui", function() {
          return !1;
        });
      });
    }
    function getMaxSupportedCssHeight() {
      let supportedHeight = 1e6, testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? options.ffMaxSupportedCssHeight : options.maxSupportedCssHeight, div = Utils.createDomElement("div", { style: { display: "hidden" } }, document.body);
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
    function bindAncestorScrollEvents() {
      for (var elem = hasFrozenRows && !options.frozenBottom ? _canvasBottomL : _canvasTopL; (elem = elem.parentNode) != document.body && elem != null; )
        (elem == _viewportTopL || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) && (_boundAncestors.push(elem), _bindingEventService.bind(elem, "scroll." + uid, handleActiveCellPositionChange));
    }
    function unbindAncestorScrollEvents() {
      _boundAncestors.forEach(function(ancestor) {
        _bindingEventService.unbindByEventName(ancestor, "scroll." + uid);
      }), _boundAncestors = [];
    }
    function updateColumnHeader(columnId, title, toolTip) {
      if (initialized) {
        var idx = getColumnIndex(columnId);
        if (idx != null) {
          var columnDef = columns[idx], header = getColumnByIndex(idx);
          header && (title !== void 0 && (columns[idx].name = title), toolTip !== void 0 && (columns[idx].toolTip = toolTip), trigger(self.onBeforeHeaderCellDestroy, {
            node: header,
            column: columnDef,
            grid: self
          }), header.setAttribute("title", toolTip || ""), title !== void 0 && (header.children[0].innerHTML = sanitizeHtmlString(title)), trigger(self.onHeaderCellRendered, {
            node: header,
            column: columnDef,
            grid: self
          }));
        }
      }
    }
    function getHeader(columnDef) {
      if (!columnDef)
        return hasFrozenColumns() ? _headers : _headerL;
      var idx = getColumnIndex(columnDef.id);
      return hasFrozenColumns() ? idx <= options.frozenColumn ? _headerL : _headerR : _headerL;
    }
    function getHeaderColumn(columnIdOrIdx) {
      var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), targetHeader = hasFrozenColumns() ? idx <= options.frozenColumn ? _headerL : _headerR : _headerL, targetIndex = hasFrozenColumns() ? idx <= options.frozenColumn ? idx : idx - options.frozenColumn - 1 : idx;
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
      var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), headerRowTarget;
      return hasFrozenColumns() ? idx <= options.frozenColumn ? headerRowTarget = _headerRowL : (headerRowTarget = _headerRowR, idx -= options.frozenColumn + 1) : headerRowTarget = _headerRowL, headerRowTarget.children[idx];
    }
    function getFooterRowColumn(columnIdOrIdx) {
      var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), footerRowTarget;
      return hasFrozenColumns() ? idx <= options.frozenColumn ? footerRowTarget = _footerRowL : (footerRowTarget = _footerRowR, idx -= options.frozenColumn + 1) : footerRowTarget = _footerRowL, footerRowTarget.children[idx];
    }
    function createColumnFooter() {
      if (options.createFooterRow) {
        _footerRow.forEach(function(footer) {
          footer.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
            let columnDef = Utils.storage.get(column, "column");
            trigger(self.onBeforeFooterRowCellDestroy, {
              node: column,
              column: columnDef,
              grid: self
            });
          });
        }), _footerRowL.replaceChildren(), _footerRowR.replaceChildren();
        for (var i2 = 0; i2 < columns.length; i2++) {
          var m = columns[i2];
          if (!m || m.hidden)
            continue;
          let footerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i2} r${i2}` }, hasFrozenColumns() && i2 > options.frozenColumn ? _footerRowR : _footerRowL), className = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null;
          className && footerRowCell.classList.add(className), Utils.storage.put(footerRowCell, "column", m), trigger(self.onFooterRowCellRendered, {
            node: footerRowCell,
            column: m,
            grid: self
          });
        }
      }
    }
    function handleHeaderMouseHoverOn(e) {
      e.target.classList.add("ui-state-hover", "slick-state-hover");
    }
    function handleHeaderMouseHoverOff(e) {
      e.target.classList.remove("ui-state-hover", "slick-state-hover");
    }
    function createColumnHeaders() {
      _headers.forEach(function(header) {
        header.querySelectorAll(".slick-header-column").forEach(function(column) {
          var columnDef = Utils.storage.get(column, "column");
          columnDef && trigger(self.onBeforeHeaderCellDestroy, {
            node: column,
            column: columnDef,
            grid: self
          });
        });
      }), _headerL.replaceChildren(), _headerR.replaceChildren(), getHeadersWidth(), Utils.width(_headerL, headersWidthL), Utils.width(_headerR, headersWidthR), _headerRows.forEach(function(row) {
        row.querySelectorAll(".slick-headerrow-column").forEach(function(column) {
          let columnDef = Utils.storage.get(column, "column");
          columnDef && trigger(self.onBeforeHeaderRowCellDestroy, {
            node: this,
            column: columnDef,
            grid: self
          });
        });
      }), _headerRowL.replaceChildren(), _headerRowR.replaceChildren(), options.createFooterRow && (_footerRowL.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
        var columnDef = Utils.storage.get(column, "column");
        columnDef && trigger(self.onBeforeFooterRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: self
        });
      }), _footerRowL.replaceChildren(), hasFrozenColumns() && (_footerRowR.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
        var columnDef = Utils.storage.get(column, "column");
        columnDef && trigger(self.onBeforeFooterRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: self
        });
      }), _footerRowR.replaceChildren()));
      for (var i2 = 0; i2 < columns.length; i2++) {
        let m = columns[i2], headerTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _headerL : _headerR : _headerL, headerRowTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _headerRowL : _headerRowR : _headerRowL, header = Utils.createDomElement("div", { id: `${uid + m.id}`, dataset: { id: m.id }, className: "ui-state-default slick-state-default slick-header-column", title: m.toolTip || "" }, headerTarget);
        Utils.createDomElement("span", { className: "slick-column-name", innerHTML: sanitizeHtmlString(m.name) }, header), Utils.width(header, m.width - headerColumnWidthDiff);
        let classname = m.headerCssClass || null;
        if (classname && header.classList.add(classname), classname = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), _bindingEventService.bind(header, "mouseenter", handleHeaderMouseEnter), _bindingEventService.bind(header, "mouseleave", handleHeaderMouseLeave), Utils.storage.put(header, "column", m), (options.enableColumnReorder || m.sortable) && (_bindingEventService.bind(header, "mouseenter", handleHeaderMouseHoverOn), _bindingEventService.bind(header, "mouseleave", handleHeaderMouseHoverOff)), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object)
          for (var key in m.headerCellAttrs)
            m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
        if (m.sortable && (header.classList.add("slick-header-sortable"), Utils.createDomElement("div", { className: `slick-sort-indicator ${options.numberedMultiColumnSort && !options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : ""}` }, header), options.numberedMultiColumnSort && options.sortColNumberInSeparateSpan && Utils.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), trigger(self.onHeaderCellRendered, {
          node: header,
          column: m,
          grid: self
        }), options.showHeaderRow) {
          let headerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-headerrow-column l${i2} r${i2}` }, headerRowTarget), classname2 = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null;
          classname2 && headerRowCell.classList.add(classname2), _bindingEventService.bind(headerRowCell, "mouseenter", handleHeaderRowMouseEnter), _bindingEventService.bind(headerRowCell, "mouseleave", handleHeaderRowMouseLeave), Utils.storage.put(headerRowCell, "column", m), trigger(self.onHeaderRowCellRendered, {
            node: headerRowCell,
            column: m,
            grid: self
          });
        }
        if (options.createFooterRow && options.showFooterRow) {
          let footerRowTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _footerRow[0] : _footerRow[1] : _footerRow[0], footerRowCell = Utils.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i2} r${i2}` }, footerRowTarget);
          Utils.storage.put(footerRowCell, "column", m), trigger(self.onFooterRowCellRendered, {
            node: footerRowCell,
            column: m,
            grid: self
          });
        }
      }
      setSortColumns(sortColumns), setupColumnResize(), options.enableColumnReorder && (typeof options.enableColumnReorder == "function" ? options.enableColumnReorder(self, _headers, headerColumnWidthDiff, setColumns, setupColumnResize, columns, getColumnIndex, uid, trigger) : setupColumnReorder());
    }
    function setupColumnSort() {
      _headers.forEach(function(header) {
        _bindingEventService.bind(header, "click", function(e) {
          if (!columnResizeDragging && !e.target.classList.contains("slick-resizable-handle")) {
            var coll = e.target.closest(".slick-header-column");
            if (coll) {
              var column = Utils.storage.get(coll, "column");
              if (column.sortable) {
                if (!getEditorLock().commitCurrentEdit())
                  return;
                for (var previousSortColumns = sortColumns.slice(), sortColumn = null, i2 = 0; i2 < sortColumns.length; i2++)
                  if (sortColumns[i2].columnId == column.id) {
                    sortColumn = sortColumns[i2], sortColumn.sortAsc = !sortColumn.sortAsc;
                    break;
                  }
                var hadSortCol = !!sortColumn;
                options.tristateMultiColumnSort ? (sortColumn || (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc }), hadSortCol && sortColumn.sortAsc && (sortColumns.splice(i2, 1), sortColumn = null), options.multiColumnSort || (sortColumns = []), sortColumn && (!hadSortCol || !options.multiColumnSort) && sortColumns.push(sortColumn)) : e.metaKey && options.multiColumnSort ? sortColumn && sortColumns.splice(i2, 1) : ((!e.shiftKey && !e.metaKey || !options.multiColumnSort) && (sortColumns = []), sortColumn ? sortColumns.length === 0 && sortColumns.push(sortColumn) : (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc }, sortColumns.push(sortColumn)));
                var onSortArgs;
                options.multiColumnSort ? onSortArgs = {
                  multiColumnSort: !0,
                  previousSortColumns,
                  sortCols: sortColumns.map(function(col) {
                    return { columnId: columns[getColumnIndex(col.columnId)].id, sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
                  })
                } : onSortArgs = {
                  multiColumnSort: !1,
                  previousSortColumns,
                  columnId: sortColumns.length > 0 ? column.id : null,
                  sortCol: sortColumns.length > 0 ? column : null,
                  sortAsc: sortColumns.length > 0 ? sortColumns[0].sortAsc : !0
                }, trigger(self.onBeforeSort, onSortArgs, e).getReturnValue() !== !1 && (setSortColumns(sortColumns), trigger(self.onSort, onSortArgs, e));
              }
            }
          }
        });
      });
    }
    function currentPositionInHeader(id) {
      let currentPosition = 0;
      return _headers.forEach(function(header) {
        header.querySelectorAll(".slick-header-column").forEach(function(column) {
          column.id == id && (currentPosition = i);
        });
      }), currentPosition;
    }
    function remove(arr, elem) {
      var index = arr.lastIndexOf(elem);
      index > -1 && (arr.splice(index, 1), remove(arr, elem));
    }
    function setupColumnReorder() {
      sortableSideLeftInstance && (sortableSideLeftInstance.destroy(), sortableSideRightInstance.destroy());
      var columnScrollTimer = null;
      function scrollColumnsRight() {
        _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft + 10;
      }
      function scrollColumnsLeft() {
        _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft - 10;
      }
      var canDragScroll, sortableOptions = {
        animation: 50,
        direction: "horizontal",
        chosenClass: "slick-header-column-active",
        ghostClass: "slick-sortable-placeholder",
        draggable: ".slick-header-column",
        dragoverBubble: !1,
        revertClone: !0,
        scroll: !hasFrozenColumns(),
        // enable auto-scroll
        onStart: function(e) {
          canDragScroll = !hasFrozenColumns() || Utils.offset(e.item).left > Utils.offset(_viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > _container.clientWidth ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils.offset(_viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsLeft, 100)) : (clearInterval(columnScrollTimer), columnScrollTimer = null);
        },
        onEnd: function(e) {
          var cancel = !1;
          clearInterval(columnScrollTimer), columnScrollTimer = null;
          var limit = null;
          if (!(cancel || !getEditorLock().commitCurrentEdit())) {
            var reorderedIds = sortableSideLeftInstance.toArray();
            reorderedIds = reorderedIds.concat(sortableSideRightInstance.toArray());
            for (var reorderedColumns = [], i2 = 0; i2 < reorderedIds.length; i2++)
              reorderedColumns.push(columns[getColumnIndex(reorderedIds[i2])]);
            setColumns(reorderedColumns), trigger(self.onColumnsReordered, { impactedColumns: getImpactedColumns(limit) }), e.stopPropagation(), setupColumnResize();
          }
        }
      };
      sortableSideLeftInstance = Sortable.create(_headerL, sortableOptions), sortableSideRightInstance = Sortable.create(_headerR, sortableOptions);
    }
    function getHeaderChildren() {
      let a = Array.from(_headers[0].children), b = Array.from(_headers[1].children);
      return a.concat(b);
    }
    function getImpactedColumns(limit) {
      var impactedColumns = [];
      if (limit)
        for (var i2 = limit.start; i2 <= limit.end; i2++)
          impactedColumns.push(columns[i2]);
      else
        impactedColumns = columns;
      return impactedColumns;
    }
    function handleResizeableHandleDoubleClick(evt) {
      let triggeredByColumn = evt.target.parentElement.id.replace(uid, "");
      trigger(self.onColumnsResizeDblClick, { triggeredByColumn });
    }
    function setupColumnResize() {
      if (typeof Resizable == "undefined")
        throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
      var j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable, frozenLeftColMaxWidth = 0;
      let children = getHeaderChildren();
      for (let i2 = 0; i2 < children.length; i2++)
        children[i2].querySelectorAll(".slick-resizable-handle").forEach(function(handle) {
          handle.remove();
        }), !(i2 >= columns.length || !columns[i2] || columns[i2].hidden) && columns[i2].resizable && (firstResizable === void 0 && (firstResizable = i2), lastResizable = i2);
      if (firstResizable !== void 0)
        for (let i2 = 0; i2 < children.length; i2++) {
          let colElm = children[i2];
          if (i2 >= columns.length || !columns[i2] || columns[i2].hidden || i2 < firstResizable || options.forceFitColumns && i2 >= lastResizable)
            continue;
          let resizeableHandle = Utils.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
          _bindingEventService.bind(resizeableHandle, "dblclick", handleResizeableHandleDoubleClick), slickResizableInstances.push(
            Resizable({
              resizeableElement: colElm,
              resizeableHandleElement: resizeableHandle,
              onResizeStart: function(e, resizeElms) {
                var targetEvent = e.touches ? e.touches[0] : e;
                if (!getEditorLock().commitCurrentEdit())
                  return !1;
                pageX = targetEvent.pageX, frozenLeftColMaxWidth = 0, resizeElms.resizeableElement.classList.add("slick-header-column-active");
                var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
                for (let pw = 0; pw < children.length; pw++)
                  pw >= columns.length || !columns[pw] || columns[pw].hidden || (columns[pw].previousWidth = children[pw].offsetWidth);
                if (options.forceFitColumns)
                  for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i2 + 1; j < columns.length; j++)
                    c = columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - c.previousWidth : stretchLeewayOnRight = null), shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth));
                var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
                for (j = 0; j <= i2; j++)
                  c = columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - c.previousWidth : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth));
                shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
              },
              onResize: function(e, resizeElms) {
                var targetEvent = e.touches ? e.touches[0] : e;
                columnResizeDragging = !0;
                var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
                if (d < 0) {
                  for (x = d, j = i2; j >= 0; j--)
                    c = columns[j], c && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth), x && c.previousWidth + x < actualMinWidth ? (x += c.previousWidth - actualMinWidth, c.width = actualMinWidth) : (c.width = c.previousWidth + x, x = 0));
                  for (k = 0; k <= i2; k++)
                    c = columns[k], !(!c || c.hidden) && (hasFrozenColumns() && k > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                  if (options.forceFitColumns)
                    for (x = -d, j = i2 + 1; j < columns.length; j++)
                      c = columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - c.previousWidth < x ? (x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth) : (c.width = c.previousWidth + x, x = 0), hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                  else
                    for (j = i2 + 1; j < columns.length; j++)
                      c = columns[j], !(!c || c.hidden) && (hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                  if (options.forceFitColumns)
                    for (x = -d, j = i2 + 1; j < columns.length; j++)
                      c = columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - c.previousWidth < x ? (x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth) : (c.width = c.previousWidth + x, x = 0));
                } else {
                  for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i2; j >= 0; j--)
                    if (c = columns[j], !(!c || c.hidden) && c.resizable)
                      if (x && c.maxWidth && c.maxWidth - c.previousWidth < x)
                        x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth;
                      else {
                        var newWidth = c.previousWidth + x, resizedCanvasWidthL = canvasWidthL + x;
                        hasFrozenColumns() && j <= options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                      }
                  for (k = 0; k <= i2; k++)
                    c = columns[k], !(!c || c.hidden) && (hasFrozenColumns() && k > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                  if (options.forceFitColumns)
                    for (x = -d, j = i2 + 1; j < columns.length; j++)
                      c = columns[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth), x && c.previousWidth + x < actualMinWidth ? (x += c.previousWidth - actualMinWidth, c.width = actualMinWidth) : (c.width = c.previousWidth + x, x = 0), hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                  else
                    for (j = i2 + 1; j < columns.length; j++)
                      c = columns[j], !(!c || c.hidden) && (hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                }
                hasFrozenColumns() && newCanvasWidthL != canvasWidthL && (Utils.width(_headerL, newCanvasWidthL + 1e3), Utils.setStyleSize(_paneHeaderR, "left", newCanvasWidthL)), applyColumnHeaderWidths(), options.syncColumnCellResize && applyColumnWidths(), trigger(self.onColumnsDrag, {
                  triggeredByColumn: resizeElms.resizeableElement,
                  resizeHandle: resizeElms.resizeableHandleElement
                });
              },
              onResizeEnd: function(e, resizeElms) {
                resizeElms.resizeableElement.classList.remove("slick-header-column-active");
                var triggeredByColumn = resizeElms.resizeableElement.id.replace(uid, "");
                trigger(self.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === !0 && applyColumnHeaderWidths();
                var newWidth;
                for (j = 0; j < columns.length; j++)
                  c = columns[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && invalidateAllRows());
                updateCanvasWidth(!0), render(), trigger(self.onColumnsResized, { triggeredByColumn }), setTimeout(function() {
                  columnResizeDragging = !1;
                }, 300);
              }
            })
          );
        }
    }
    function getVBoxDelta(el) {
      var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
      return p.forEach(function(val) {
        delta += Utils.toFloat(styles[val]);
      }), delta;
    }
    function setFrozenOptions() {
      if (options.frozenColumn = options.frozenColumn >= 0 && options.frozenColumn < columns.length ? parseInt(options.frozenColumn) : -1, options.frozenRow > -1) {
        hasFrozenRows = !0, frozenRowsHeight = options.frozenRow * options.rowHeight;
        var dataLength = getDataLength();
        actualFrozenRow = options.frozenBottom ? dataLength - options.frozenRow : options.frozenRow;
      } else
        hasFrozenRows = !1;
    }
    function setPaneVisibility() {
      hasFrozenColumns() ? (show(_paneHeaderR), show(_paneTopR), hasFrozenRows ? (show(_paneBottomL), show(_paneBottomR)) : (hide(_paneBottomR), hide(_paneBottomL))) : (hide(_paneHeaderR), hide(_paneTopR), hide(_paneBottomR), hasFrozenRows ? show(_paneBottomL) : (hide(_paneBottomR), hide(_paneBottomL)));
    }
    function setOverflow() {
      _viewportTopL.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "auto", _viewportTopL.style["overflow-y"] = !hasFrozenColumns() && options.alwaysShowVerticalScroll ? "scroll" : hasFrozenColumns() ? "hidden" : hasFrozenRows ? "scroll" : "auto", _viewportTopR.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "auto", _viewportTopR.style["overflow-y"] = options.alwaysShowVerticalScroll ? "scroll" : (hasFrozenColumns(), hasFrozenRows ? "scroll" : "auto"), _viewportBottomL.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (hasFrozenRows && !options.alwaysAllowHorizontalScroll, "auto"), _viewportBottomL.style["overflow-y"] = !hasFrozenColumns() && options.alwaysShowVerticalScroll ? "scroll" : hasFrozenColumns() ? "hidden" : hasFrozenRows ? "scroll" : "auto", _viewportBottomR.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (hasFrozenRows && !options.alwaysAllowHorizontalScroll, "auto"), _viewportBottomR.style["overflow-y"] = options.alwaysShowVerticalScroll ? "scroll" : (hasFrozenColumns(), "auto"), options.viewportClass && (_viewportTopL.classList.add(options.viewportClass), _viewportTopR.classList.add(options.viewportClass), _viewportBottomL.classList.add(options.viewportClass), _viewportBottomR.classList.add(options.viewportClass));
    }
    function setScroller() {
      hasFrozenColumns() ? (_headerScrollContainer = _headerScrollerR, _headerRowScrollContainer = _headerRowScrollerR, _footerRowScrollContainer = _footerRowScrollerR, hasFrozenRows ? options.frozenBottom ? (_viewportScrollContainerX = _viewportBottomR, _viewportScrollContainerY = _viewportTopR) : _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomR : _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopR) : (_headerScrollContainer = _headerScrollerL, _headerRowScrollContainer = _headerRowScrollerL, _footerRowScrollContainer = _footerRowScrollerL, hasFrozenRows ? options.frozenBottom ? (_viewportScrollContainerX = _viewportBottomL, _viewportScrollContainerY = _viewportTopL) : _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomL : _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopL);
    }
    function measureCellPaddingAndBorder() {
      let h2 = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = _headers[0];
      headerColumnWidthDiff = headerColumnHeightDiff = 0, cellWidthDiff = cellHeightDiff = 0;
      let el = Utils.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
      style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box" && (h2.forEach(function(val) {
        headerColumnWidthDiff += Utils.toFloat(style[val]);
      }), v.forEach(function(val) {
        headerColumnHeightDiff += Utils.toFloat(style[val]);
      })), el.remove();
      let r = Utils.createDomElement("div", { className: "slick-row" }, _canvas[0]);
      el = Utils.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden", textContent: "-" } }, r), style = getComputedStyle(el), style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box" && (h2.forEach(function(val) {
        cellWidthDiff += Utils.toFloat(style[val]);
      }), v.forEach(function(val) {
        cellHeightDiff += Utils.toFloat(style[val]);
      })), r.remove(), absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
    }
    function createCssRules() {
      _style = Utils.createDomElement("template", { innerHTML: '<style type="text/css" rel="stylesheet" />' }).content.firstChild, document.head.appendChild(_style);
      for (var rowHeight = options.rowHeight - cellHeightDiff, rules = [
        "." + uid + " .slick-group-header-column { left: 1000px; }",
        "." + uid + " .slick-header-column { left: 1000px; }",
        "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
        "." + uid + " .slick-preheader-panel { height:" + options.preHeaderPanelHeight + "px; }",
        "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
        "." + uid + " .slick-footerrow-columns { height:" + options.footerRowHeight + "px; }",
        "." + uid + " .slick-cell { height:" + rowHeight + "px; }",
        "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
      ], i2 = 0; i2 < columns.length; i2++)
        !columns[i2] || columns[i2].hidden || (rules.push("." + uid + " .l" + i2 + " { }"), rules.push("." + uid + " .r" + i2 + " { }"));
      _style.styleSheet ? _style.styleSheet.cssText = rules.join(" ") : _style.appendChild(document.createTextNode(rules.join(" ")));
    }
    function getColumnCssRules(idx) {
      var i2;
      if (!stylesheet) {
        var sheets = document.styleSheets;
        for (i2 = 0; i2 < sheets.length; i2++)
          if ((sheets[i2].ownerNode || sheets[i2].owningElement) == _style) {
            stylesheet = sheets[i2];
            break;
          }
        if (!stylesheet)
          throw new Error("SlickGrid Cannot find stylesheet.");
        columnCssRulesL = [], columnCssRulesR = [];
        var cssRules = stylesheet.cssRules || stylesheet.rules, matches, columnIdx;
        for (i2 = 0; i2 < cssRules.length; i2++) {
          var selector = cssRules[i2].selectorText;
          (matches = /\.l\d+/.exec(selector)) ? (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), columnCssRulesL[columnIdx] = cssRules[i2]) : (matches = /\.r\d+/.exec(selector)) && (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), columnCssRulesR[columnIdx] = cssRules[i2]);
        }
      }
      return {
        left: columnCssRulesL[idx],
        right: columnCssRulesR[idx]
      };
    }
    function removeCssRules() {
      _style.remove(), stylesheet = null;
    }
    function destroy(shouldDestroyAllElements) {
      _bindingEventService.unbindAll(), slickDraggableInstance = destroyAllInstances(slickDraggableInstance), slickMouseWheelInstances = destroyAllInstances(slickMouseWheelInstances), slickResizableInstances = destroyAllInstances(slickResizableInstances), getEditorLock().cancelCurrentEdit(), trigger(self.onBeforeDestroy, {});
      for (var i2 = plugins.length; i2--; )
        unregisterPlugin(plugins[i2]);
      options.enableColumnReorder && sortableSideLeftInstance && typeof sortableSideLeftInstance.destroy == "function" && (sortableSideLeftInstance.destroy(), sortableSideRightInstance.destroy()), unbindAncestorScrollEvents(), _bindingEventService.unbindByEventName(_container, "resize.slickgrid", resizeCanvas), removeCssRules(), _canvas.forEach(function(element) {
        _bindingEventService.unbindByEventName(element, "keydown", handleKeyDown), _bindingEventService.unbindByEventName(element, "click", handleClick), _bindingEventService.unbindByEventName(element, "dblclick", handleDblClick), _bindingEventService.unbindByEventName(element, "contextmenu", handleContextMenu), _bindingEventService.unbindByEventName(element, "mouseover", handleCellMouseOver), _bindingEventService.unbindByEventName(element, "mouseout", handleCellMouseOut);
      }), _viewport.forEach(function(view) {
        _bindingEventService.unbindByEventName(view, "scroll", handleScroll);
      }), _headerScroller.forEach(function(el) {
        _bindingEventService.unbindByEventName(el, "contextmenu", handleHeaderContextMenu), _bindingEventService.unbindByEventName(el, "click", handleHeaderClick);
      }), _headerRowScroller.forEach(function(scroller) {
        _bindingEventService.unbindByEventName(scroller, "scroll", handleHeaderRowScroll);
      }), _footerRow && _footerRow.forEach(function(footer) {
        _bindingEventService.unbindByEventName(footer, "contextmenu", handleFooterContextMenu), _bindingEventService.unbindByEventName(footer, "click", handleFooterClick);
      }), _footerRowScroller && _footerRowScroller.forEach(function(scroller) {
        _bindingEventService.unbindByEventName(scroller, "scroll", handleFooterRowScroll);
      }), _preHeaderPanelScroller && _bindingEventService.unbindByEventName(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll), _bindingEventService.unbindByEventName(_focusSink, "keydown", handleKeyDown), _bindingEventService.unbindByEventName(_focusSink2, "keydown", handleKeyDown);
      let resizeHandles = _container.querySelectorAll(".slick-resizable-handle");
      [].forEach.call(resizeHandles, function(handle) {
        _bindingEventService.unbindByEventName(handle, "dblclick", handleResizeableHandleDoubleClick);
      });
      let headerColumns = _container.querySelectorAll(".slick-header-column");
      [].forEach.call(headerColumns, function(column) {
        _bindingEventService.unbindByEventName(column, "mouseenter", handleHeaderMouseEnter), _bindingEventService.unbindByEventName(column, "mouseleave", handleHeaderMouseLeave), _bindingEventService.unbindByEventName(column, "mouseenter", handleHeaderMouseHoverOn), _bindingEventService.unbindByEventName(column, "mouseleave", handleHeaderMouseHoverOff);
      }), _container.replaceChildren(), _container.classList.remove(uid), shouldDestroyAllElements && destroyAllElements();
    }
    function destroyAllInstances(inputInstances) {
      if (inputInstances) {
        let instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance;
        for (; (instance = instances.pop()) != null; )
          instance && typeof instance.destroy == "function" && instance.destroy();
      }
      return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
    }
    function destroyAllElements() {
      _activeCanvasNode = null, _activeViewportNode = null, _boundAncestors = null, _canvas = null, _canvasTopL = null, _canvasTopR = null, _canvasBottomL = null, _canvasBottomR = null, _container = null, _focusSink = null, _focusSink2 = null, _groupHeaders = null, _groupHeadersL = null, _groupHeadersR = null, _headerL = null, _headerR = null, _headers = null, _headerRows = null, _headerRowL = null, _headerRowR = null, _headerRowSpacerL = null, _headerRowSpacerR = null, _headerRowScrollContainer = null, _headerRowScroller = null, _headerRowScrollerL = null, _headerRowScrollerR = null, _headerScrollContainer = null, _headerScroller = null, _headerScrollerL = null, _headerScrollerR = null, _hiddenParents = null, _footerRow = null, _footerRowL = null, _footerRowR = null, _footerRowSpacerL = null, _footerRowSpacerR = null, _footerRowScroller = null, _footerRowScrollerL = null, _footerRowScrollerR = null, _footerRowScrollContainer = null, _preHeaderPanel = null, _preHeaderPanelR = null, _preHeaderPanelScroller = null, _preHeaderPanelScrollerR = null, _preHeaderPanelSpacer = null, _preHeaderPanelSpacerR = null, _topPanels = null, _topPanelScrollers = null, _style = null, _topPanelScrollerL = null, _topPanelScrollerR = null, _topPanelL = null, _topPanelR = null, _paneHeaderL = null, _paneHeaderR = null, _paneTopL = null, _paneTopR = null, _paneBottomL = null, _paneBottomR = null, _viewport = null, _viewportTopL = null, _viewportTopR = null, _viewportBottomL = null, _viewportBottomR = null, _viewportScrollContainerX = null, _viewportScrollContainerY = null;
    }
    var canvas = null, canvas_context = null;
    function autosizeColumn(columnOrIndexOrId, isInit) {
      var colDef = null, colIndex = -1;
      if (typeof columnOrIndexOrId == "number")
        colDef = columns[columnOrIndexOrId], colIndex = columnOrIndexOrId;
      else if (typeof columnOrIndexOrId == "string")
        for (i = 0; i < columns.length; i++)
          columns[i].Id === columnOrIndexOrId && (colDef = columns[i], colIndex = i);
      if (!colDef)
        return;
      let gridCanvas = getCanvasNode(0, 0);
      getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit, colIndex);
    }
    function treatAsLocked(autoSize) {
      return !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && autoSize.widthPx < 100;
    }
    function autosizeColumns(autosizeMode, isInit) {
      var cssCache = { hiddenParents: null, oldPropArr: [] };
      cacheCssForHiddenInit(cssCache), internalAutosizeColumns(autosizeMode, isInit), restoreCssFromHiddenInit(cssCache);
    }
    function internalAutosizeColumns(autosizeMode, isInit) {
      if (autosizeMode = autosizeMode || options.autosizeColsMode, autosizeMode === GridAutosizeColsMode.LegacyForceFit || autosizeMode === GridAutosizeColsMode.LegacyOff) {
        legacyAutosizeColumns();
        return;
      }
      if (autosizeMode !== GridAutosizeColsMode.None) {
        canvas = document.createElement("canvas"), canvas && canvas.getContext && (canvas_context = canvas.getContext("2d"));
        var gridCanvas = getCanvasNode(0, 0), viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW, i2, c, colWidth, reRender, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
        for (i2 = 0; i2 < columns.length; i2++)
          c = columns[i2], getColAutosizeWidth(c, i2, gridCanvas, isInit, i2), totalLockedColWidth += c.autoSize.autosizeMode === ColAutosizeMode.Locked ? c.width : treatAsLocked(c.autoSize) ? c.autoSize.widthPx : 0, totalMinWidth += c.autoSize.autosizeMode === ColAutosizeMode.Locked ? c.width : treatAsLocked(c.autoSize) ? c.autoSize.widthPx : c.minWidth, totalWidth += c.autoSize.widthPx, totalWidthLessSTR += c.autoSize.sizeToRemaining ? 0 : c.autoSize.widthPx, strColsMinWidth += c.autoSize.sizeToRemaining && c.minWidth || 0;
        var strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
        if (autosizeMode === GridAutosizeColsMode.FitViewportToCols) {
          var setWidth = totalWidth + scrollbarDimensions.width;
          autosizeMode = GridAutosizeColsMode.IgnoreViewport, options.viewportMaxWidthPx && setWidth > options.viewportMaxWidthPx ? (setWidth = options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport) : options.viewportMinWidthPx && setWidth < options.viewportMinWidthPx && (setWidth = options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode.FitColsToViewport), Utils.width(_container, setWidth);
        }
        if (autosizeMode === GridAutosizeColsMode.FitColsToViewport)
          if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
            for (i2 = 0; i2 < columns.length; i2++)
              if (c = columns[i2], !(!c || c.hidden)) {
                var totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
                c.autoSize.sizeToRemaining ? colWidth = totalSTRViewportWidth * c.autoSize.widthPx / strColTotalGuideWidth : colWidth = c.autoSize.widthPx, c.rerenderOnResize && c.width != colWidth && (reRender = !0), c.width = colWidth;
              }
          } else if (options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
            autosizeMode = GridAutosizeColsMode.IgnoreViewport;
          else {
            var unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
            for (i2 = 0; i2 < columns.length; i2++)
              c = columns[i2], !(!c || c.hidden) && (colWidth = c.width, c.autoSize.autosizeMode !== ColAutosizeMode.Locked && !treatAsLocked(c.autoSize) && (c.autoSize.sizeToRemaining ? colWidth = c.minWidth : (colWidth = unallocatedViewportWidth / unallocatedColWidth * c.autoSize.widthPx - 1, colWidth < c.minWidth && (colWidth = c.minWidth), unallocatedColWidth -= c.autoSize.widthPx, unallocatedViewportWidth -= colWidth)), treatAsLocked(c.autoSize) && (colWidth = c.autoSize.widthPx, colWidth < c.minWidth && (colWidth = c.minWidth)), c.rerenderOnResize && c.width != colWidth && (reRender = !0), c.width = colWidth);
          }
        if (autosizeMode === GridAutosizeColsMode.IgnoreViewport)
          for (i2 = 0; i2 < columns.length; i2++)
            !columns[i2] || columns[i2].hidden || (colWidth = columns[i2].autoSize.widthPx, columns[i2].rerenderOnResize && columns[i2].width != colWidth && (reRender = !0), columns[i2].width = colWidth);
        reRenderColumns(reRender);
      }
    }
    function LogColWidths() {
      for (var s = "Col Widths:", i2 = 0; i2 < columns.length; i2++)
        s += " " + (columns[i2].hidden ? "H" : columns[i2].width);
      console.log(s);
    }
    function getColAutosizeWidth(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      var autoSize = columnDef.autoSize;
      if (autoSize.widthPx = columnDef.width, autoSize.autosizeMode === ColAutosizeMode.Locked || autoSize.autosizeMode === ColAutosizeMode.Guide)
        return;
      var dl = getDataLength();
      let isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);
      if (autoSize.autosizeMode === ColAutosizeMode.ContentIntelligent) {
        var colDataTypeOf = autoSize.colDataTypeOf, colDataItem;
        if (dl > 0) {
          var tempRow = getDataItem(0);
          tempRow && (colDataItem = tempRow[columnDef.field], isoDateRegExp.test(colDataItem) && (colDataItem = Date.parse(colDataItem)), colDataTypeOf = typeof colDataItem, colDataTypeOf === "object" && (colDataItem instanceof Date && (colDataTypeOf = "date"), typeof moment != "undefined" && colDataItem instanceof moment && (colDataTypeOf = "moment")));
        }
        colDataTypeOf === "boolean" && (autoSize.colValueArray = [!0, !1]), colDataTypeOf === "number" && (autoSize.valueFilterMode = ValueFilterMode.GetGreatestAndSub, autoSize.rowSelectionMode = RowSelectionMode.AllRows), colDataTypeOf === "string" && (autoSize.valueFilterMode = ValueFilterMode.GetLongestText, autoSize.rowSelectionMode = RowSelectionMode.AllRows, autoSize.allowAddlPercent = 5), colDataTypeOf === "date" && (autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]), colDataTypeOf === "moment" && typeof moment != "undefined" && (autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]);
      }
      var colWidth = autoSize.contentSizePx = getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);
      colWidth === 0 && (colWidth = autoSize.widthPx);
      var addlPercentMultiplier = autoSize.allowAddlPercent ? 1 + autoSize.allowAddlPercent / 100 : 1;
      colWidth = colWidth * addlPercentMultiplier + options.autosizeColPaddingPx, columnDef.minWidth && colWidth < columnDef.minWidth && (colWidth = columnDef.minWidth), columnDef.maxWidth && colWidth > columnDef.maxWidth && (colWidth = columnDef.maxWidth), (autoSize.autosizeMode === ColAutosizeMode.ContentExpandOnly || columnDef.editor && columnDef.editor.ControlFillsColumn) && colWidth < columnDef.width && (colWidth = columnDef.width), autoSize.widthPx = colWidth;
    }
    function getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
      var autoSize = columnDef.autoSize, widthAdjustRatio = 1, i2, ii, tempVal, maxLen = 0, maxColWidth = 0;
      if (autoSize.headerWidthPx = 0, autoSize.ignoreHeaderText || (autoSize.headerWidthPx = getColHeaderWidth(columnDef)), autoSize.headerWidthPx === 0 && (autoSize.headerWidthPx = columnDef.width ? columnDef.width : columnDef.maxWidth ? columnDef.maxWidth : columnDef.minWidth ? columnDef.minWidth : 20), autoSize.colValueArray)
        return maxColWidth = getColWidth(columnDef, gridCanvas, autoSize.colValueArray), Math.max(autoSize.headerWidthPx, maxColWidth);
      var rowInfo = {};
      rowInfo.colIndex = colIndex, rowInfo.rowCount = getDataLength(), rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.rowCount - 1, rowInfo.valueArr = null, rowInfo.getRowVal = function(i3) {
        return getDataItem(i3)[columnDef.field];
      };
      var rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : void 0) || autoSize.rowSelectionMode;
      if (rowSelectionMode === RowSelectionMode.FirstRow && (rowInfo.endIndex = 0), rowSelectionMode === RowSelectionMode.LastRow && (rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1), rowSelectionMode === RowSelectionMode.FirstNRows && (rowInfo.endIndex = Math.min(autoSize.rowSelectionCount, rowInfo.rowCount) - 1), autoSize.valueFilterMode === ValueFilterMode.DeDuplicate) {
        var rowsDict = {};
        for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
          rowsDict[rowInfo.getRowVal(i2)] = !0;
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
        var maxVal, maxAbsVal = 0;
        for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
          tempVal = rowInfo.getRowVal(i2), Math.abs(tempVal) > maxAbsVal && (maxVal = tempVal, maxAbsVal = Math.abs(tempVal));
        maxVal = "" + maxVal, maxVal = Array(maxVal.length + 1).join("9"), maxVal = +maxVal, rowInfo.valueArr = [maxVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      if (autoSize.valueFilterMode === ValueFilterMode.GetLongestTextAndSub) {
        for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
          tempVal = rowInfo.getRowVal(i2), (tempVal || "").length > maxLen && (maxLen = tempVal.length);
        tempVal = Array(maxLen + 1).join("m"), widthAdjustRatio = options.autosizeTextAvgToMWidthRatio, rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      if (autoSize.valueFilterMode === ValueFilterMode.GetLongestText) {
        maxLen = 0;
        var maxIndex = 0;
        for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
          tempVal = rowInfo.getRowVal(i2), (tempVal || "").length > maxLen && (maxLen = tempVal.length, maxIndex = i2);
        tempVal = rowInfo.getRowVal(maxIndex), rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
      }
      return rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1 && (autoSize.sizeToRemaining = !0), maxColWidth = getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio, Math.max(autoSize.headerWidthPx, maxColWidth);
    }
    function getColWidth(columnDef, gridCanvas, rowInfo) {
      let rowEl = Utils.createDomElement("div", { className: "slick-row ui-widget-content" }, gridCanvas), cellEl = Utils.createDomElement("div", { className: "slick-cell" }, rowEl);
      cellEl.style.position = "absolute", cellEl.style.visibility = "hidden", cellEl.style["text-overflow"] = "initial", cellEl.style["white-space"] = "nowrap";
      var i2, len, max = 0, text, maxText, formatterResult, maxWidth = 0, val, useCanvas = columnDef.autoSize.widthEvalMode === WidthEvalMode.TextOnly;
      if (columnDef.autoSize.widthEvalMode === WidthEvalMode.Auto) {
        var noFormatter = !columnDef.formatterOverride && !columnDef.formatter, formatterIsText = columnDef.formatterOverride && columnDef.formatterOverride.ReturnsTextOnly || !columnDef.formatterOverride && columnDef.formatter && columnDef.formatter.ReturnsTextOnly;
        useCanvas = noFormatter || formatterIsText;
      }
      if (canvas_context && useCanvas) {
        let style = getComputedStyle(cellEl);
        for (canvas_context.font = style["font-size"] + " " + style["font-family"], i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
          val = rowInfo.valueArr ? rowInfo.valueArr[i2] : rowInfo.getRowVal(i2), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : columnDef.formatter ? formatterResult = columnDef.formatter(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : formatterResult = "" + val, len = formatterResult ? canvas_context.measureText(formatterResult).width : 0, len > max && (max = len, maxText = formatterResult);
        return cellEl.innerHTML = maxText, len = cellEl.offsetWidth, rowEl.remove(), len;
      }
      for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        val = rowInfo.valueArr ? rowInfo.valueArr[i2] : rowInfo.getRowVal(i2), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : columnDef.formatter ? formatterResult = columnDef.formatter(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : formatterResult = "" + val, applyFormatResultToCellNode(formatterResult, cellEl), len = cellEl.offsetWidth, len > max && (max = len);
      return rowEl.remove(), max;
    }
    function getColHeaderWidth(columnDef) {
      var width = 0, headerColElId = getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = headerColElId + "_";
      if (headerColEl) {
        var clone = headerColEl.cloneNode(!0);
        clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width = clone.offsetWidth, clone.parentNode.removeChild(clone);
      } else {
        let header = getHeader(columnDef);
        headerColEl = Utils.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header), Utils.createDomElement("span", { className: "slick-column-name", innerHTML: sanitizeHtmlString(columnDef.name) }, headerColEl), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.classList.add(columnDef.headerCssClass || ""), width = headerColEl.offsetWidth, header.removeChild(headerColEl);
      }
      return width;
    }
    function legacyAutosizeColumns() {
      var i2, c, widths = [], shrinkLeeway = 0, total = 0, prevTotal, availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
      for (i2 = 0; i2 < columns.length; i2++)
        c = columns[i2], !(!c || c.hidden) && (widths.push(c.width), total += c.width, c.resizable && (shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth)));
      for (prevTotal = total; total > availWidth && shrinkLeeway; ) {
        var shrinkProportion = (total - availWidth) / shrinkLeeway;
        for (i2 = 0; i2 < columns.length && total > availWidth; i2++)
          if (c = columns[i2], !(!c || c.hidden)) {
            var width = widths[i2];
            if (!(!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth)) {
              var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth), shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
              shrinkSize = Math.min(shrinkSize, width - absMinWidth), total -= shrinkSize, shrinkLeeway -= shrinkSize, widths[i2] -= shrinkSize;
            }
          }
        if (prevTotal <= total)
          break;
        prevTotal = total;
      }
      for (prevTotal = total; total < availWidth; ) {
        var growProportion = availWidth / total;
        for (i2 = 0; i2 < columns.length && total < availWidth; i2++)
          if (c = columns[i2], !(!c || c.hidden)) {
            var currentWidth = widths[i2], growSize;
            !c.resizable || c.maxWidth <= currentWidth ? growSize = 0 : growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1e6) || 1, total += growSize, widths[i2] += total <= availWidth ? growSize : 0;
          }
        if (prevTotal >= total)
          break;
        prevTotal = total;
      }
      var reRender = !1;
      for (i2 = 0; i2 < columns.length; i2++)
        !c || c.hidden || (columns[i2].rerenderOnResize && columns[i2].width != widths[i2] && (reRender = !0), columns[i2].width = widths[i2]);
      reRenderColumns(reRender);
    }
    function reRenderColumns(reRender) {
      applyColumnHeaderWidths(), updateCanvasWidth(!0), trigger(self.onAutosizeColumns, { columns }), reRender && (invalidateAllRows(), render());
    }
    function getVisibleColumns() {
      return columns.filter((c) => !c.hidden);
    }
    function trigger(evt, args, e) {
      return e = e || new EventData(e, args), args = args || {}, args.grid = self, evt.notify(args, e, self);
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
    function applyColumnHeaderWidths() {
      if (!initialized)
        return;
      let columnIndex = 0, vc = getVisibleColumns();
      _headers.forEach(function(header) {
        for (let i2 = 0; i2 < header.children.length; i2++, columnIndex++) {
          let h2 = header.children[i2], width = ((vc[columnIndex] || {}).width || 0) - headerColumnWidthDiff;
          Utils.width(h2) !== width && Utils.width(h2, width);
        }
      }), updateColumnCaches();
    }
    function applyColumnWidths() {
      for (var x = 0, w, rule, i2 = 0; i2 < columns.length; i2++)
        columns[i2] && columns[i2].hidden || (w = columns[i2].width, rule = getColumnCssRules(i2), rule.left.style.left = x + "px", rule.right.style.right = (options.frozenColumn != -1 && i2 > options.frozenColumn ? canvasWidthR : canvasWidthL) - x - w + "px", options.frozenColumn != i2 && (x += columns[i2].width)), options.frozenColumn == i2 && (x = 0);
    }
    function setSortColumn(columnId, ascending) {
      setSortColumns([{ columnId, sortAsc: ascending }]);
    }
    function getColumnByIndex(id) {
      let result = null;
      return _headers.every(function(header) {
        let length = header.children.length;
        return id < length ? (result = header.children[id], !1) : (id -= length, !0);
      }), result;
    }
    function setSortColumns(cols) {
      sortColumns = cols;
      let numberCols = options.numberedMultiColumnSort && sortColumns.length > 1;
      _headers.forEach(function(header) {
        let indicators = header.querySelectorAll(".slick-header-column-sorted");
        indicators.forEach(function(indicator) {
          indicator.classList.remove("slick-header-column-sorted");
        }), indicators = header.querySelectorAll(".slick-sort-indicator"), indicators.forEach(function(indicator) {
          indicator.classList.remove("slick-sort-indicator-asc"), indicator.classList.remove("slick-sort-indicator-desc");
        }), indicators = header.querySelectorAll(".slick-sort-indicator-numbered"), indicators.forEach(function(el) {
          el.textContent = "";
        });
      });
      let i2 = 1;
      sortColumns.forEach(function(col) {
        col.sortAsc == null && (col.sortAsc = !0);
        let columnIndex = getColumnIndex(col.columnId);
        if (columnIndex != null) {
          let column = getColumnByIndex(columnIndex);
          if (column) {
            column.classList.add("slick-header-column-sorted");
            let indicator = column.querySelector(".slick-sort-indicator");
            indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc"), numberCols && (indicator = column.querySelector(".slick-sort-indicator-numbered"), indicator.textContent = i2);
          }
        }
        i2++;
      });
    }
    function getSortColumns() {
      return sortColumns;
    }
    function handleSelectedRangesChanged(e, ranges) {
      let ne = e.getNativeEvent();
      var previousSelectedRows = selectedRows.slice(0);
      selectedRows = [];
      for (var hash = {}, i2 = 0; i2 < ranges.length; i2++)
        for (var j = ranges[i2].fromRow; j <= ranges[i2].toRow; j++) {
          hash[j] || (selectedRows.push(j), hash[j] = {});
          for (var k = ranges[i2].fromCell; k <= ranges[i2].toCell; k++)
            canCellBeSelected(j, k) && (hash[j][columns[k].id] = options.selectedCellCssClass);
        }
      if (setCellCssStyles(options.selectedCellCssClass, hash), simpleArrayEquals(previousSelectedRows, selectedRows)) {
        var caller = ne && ne.detail && ne.detail.caller || "click", newSelectedAdditions = getSelectedRows().filter(function(i3) {
          return previousSelectedRows.indexOf(i3) < 0;
        }), newSelectedDeletions = previousSelectedRows.filter(function(i3) {
          return getSelectedRows().indexOf(i3) < 0;
        });
        trigger(self.onSelectedRowsChanged, {
          rows: getSelectedRows(),
          previousSelectedRows,
          caller,
          changedSelectedRows: newSelectedAdditions,
          changedUnselectedRows: newSelectedDeletions
        }, e);
      }
    }
    function simpleArrayEquals(arr1, arr2) {
      return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
    }
    function getColumns() {
      return columns;
    }
    function updateColumnCaches() {
      columnPosLeft = [], columnPosRight = [];
      for (var x = 0, i2 = 0, ii = columns.length; i2 < ii; i2++)
        !columns[i2] || columns[i2].hidden || (columnPosLeft[i2] = x, columnPosRight[i2] = x + columns[i2].width, options.frozenColumn == i2 ? x = 0 : x += columns[i2].width);
    }
    function updateColumnProps() {
      columnsById = {};
      for (var i2 = 0; i2 < columns.length; i2++) {
        columns[i2].width && (columns[i2].widthRequest = columns[i2].width);
        var m = columns[i2] = Utils.extend({}, columnDefaults, columns[i2]);
        m.autoSize = Utils.extend({}, columnAutosizeDefaults, m.autoSize), columnsById[m.id] = i2, m.minWidth && m.width < m.minWidth && (m.width = m.minWidth), m.maxWidth && m.width > m.maxWidth && (m.width = m.maxWidth);
      }
    }
    function setColumns(columnDefinitions) {
      trigger(self.onBeforeSetColumns, { previousColumns: columns, newColumns: columnDefinitions, grid: self }), columns = columnDefinitions, columns = columnDefinitions, updateColumnsInternal();
    }
    function updateColumns() {
      trigger(self.onBeforeUpdateColumns, { columns, grid: self }), updateColumnsInternal();
    }
    function updateColumnsInternal() {
      updateColumnProps(), updateColumnCaches(), initialized && (setPaneVisibility(), setOverflow(), invalidateAllRows(), createColumnHeaders(), createColumnFooter(), removeCssRules(), createCssRules(), resizeCanvas(), updateCanvasWidth(), applyColumnHeaderWidths(), applyColumnWidths(), handleScroll(), getSelectionModel() && getSelectionModel().refreshSelections && getSelectionModel().refreshSelections());
    }
    function getOptions() {
      return options;
    }
    function setOptions(args, suppressRender, suppressColumnSet, suppressSetOverflow) {
      if (getEditorLock().commitCurrentEdit()) {
        makeActiveCellNormal(), args.showColumnHeader !== void 0 && setColumnHeaderVisibility(args.showColumnHeader), options.enableAddRow !== args.enableAddRow && invalidateRow(getDataLength());
        var originalOptions = Utils.extend(!0, {}, options);
        options = Utils.extend(options, args), trigger(self.onSetOptions, { optionsBefore: originalOptions, optionsAfter: options }), validateAndEnforceOptions(), setFrozenOptions(), args.frozenBottom !== void 0 && (enforceFrozenRowHeightRecalc = !0), _viewport.forEach(function(view) {
          view.style["overflow-y"] = options.autoHeight ? "hidden" : "auto";
        }), suppressRender || render(), setScroller(), suppressSetOverflow || setOverflow(), suppressColumnSet || setColumns(columns), options.enableMouseWheelScrollHandler && _viewport && (!slickMouseWheelInstances || slickMouseWheelInstances.length === 0) ? _viewport.forEach(function(view) {
          slickMouseWheelInstances.push(MouseWheel({
            element: view,
            onMouseWheel: handleMouseWheel
          }));
        }) : options.enableMouseWheelScrollHandler === !1 && destroyAllInstances(slickMouseWheelInstances);
      }
    }
    function validateAndEnforceOptions() {
      options.autoHeight && (options.leaveSpaceForNewRows = !1), options.forceFitColumns && (options.autosizeColsMode = GridAutosizeColsMode.LegacyForceFit, console.log("forceFitColumns option is deprecated - use autosizeColsMode"));
    }
    function setData(newData, scrollToTop) {
      data = newData, invalidateAllRows(), updateRowCount(), scrollToTop && scrollTo(0);
    }
    function getData() {
      return data;
    }
    function getDataLength() {
      return data.getLength ? data.getLength() : data && data.length || 0;
    }
    function getDataLengthIncludingAddNew() {
      return getDataLength() + (options.enableAddRow && (!pagingActive || pagingIsLastPage) ? 1 : 0);
    }
    function getDataItem(i2) {
      return data.getItem ? data.getItem(i2) : data[i2];
    }
    function getTopPanel() {
      return _topPanels[0];
    }
    function getTopPanels() {
      return _topPanels;
    }
    function togglePanelVisibility(option, container2, visible, animate) {
      var animated = animate !== !1;
      if (options[option] != visible)
        if (options[option] = visible, visible) {
          if (animated) {
            Utils.slideDown(container2, resizeCanvas);
            return;
          }
          show(container2), resizeCanvas();
        } else {
          if (animated) {
            Utils.slideUp(container2, resizeCanvas);
            return;
          }
          hide(container2), resizeCanvas();
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
    function getRowTop(row) {
      return options.rowHeight * row - offset;
    }
    function getRowFromPosition(y) {
      return Math.floor((y + offset) / options.rowHeight);
    }
    function scrollTo(y) {
      y = Math.max(y, 0), y = Math.min(y, th - Utils.height(_viewportScrollContainerY) + (viewportHasHScroll || hasFrozenColumns() ? scrollbarDimensions.height : 0));
      var oldOffset = offset;
      page = Math.min(n - 1, Math.floor(y / ph)), offset = Math.round(page * cj);
      var newScrollTop = y - offset;
      if (offset != oldOffset) {
        var range = getVisibleRange(newScrollTop);
        cleanupRows(range), updateRowPositions();
      }
      prevScrollTop != newScrollTop && (vScrollDir = prevScrollTop + oldOffset < newScrollTop + offset ? 1 : -1, lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop, hasFrozenColumns() && (_viewportTopL.scrollTop = newScrollTop), hasFrozenRows && (_viewportBottomL.scrollTop = _viewportBottomR.scrollTop = newScrollTop), _viewportScrollContainerY.scrollTop = newScrollTop, trigger(self.onViewportChanged, {}));
    }
    function defaultFormatter(row, cell, value, columnDef, dataContext, grid) {
      return value == null ? "" : (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function getFormatter(row, column) {
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row), columnOverrides = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);
      return columnOverrides && columnOverrides.formatter || rowMetadata && rowMetadata.formatter || column.formatter || options.formatterFactory && options.formatterFactory.getFormatter(column) || options.defaultFormatter;
    }
    function getEditor(row, cell) {
      var column = columns[cell], rowMetadata = data.getItemMetadata && data.getItemMetadata(row), columnMetadata = rowMetadata && rowMetadata.columns;
      return columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== void 0 ? columnMetadata[column.id].editor : columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== void 0 ? columnMetadata[cell].editor : column.editor || options.editorFactory && options.editorFactory.getEditor(column);
    }
    function getDataItemValueForColumn(item, columnDef) {
      return options.dataItemColumnValueExtractor ? options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
    }
    function appendRowHtml(stringArrayL, stringArrayR, row, range, dataLength) {
      var d = getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (hasFrozenRows && row <= options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === activeRow && options.showCellSelection ? " active" : "") + (row % 2 == 1 ? " odd" : " even");
      d || (rowCss += " " + options.addNewRowCssClass);
      var metadata = data.getItemMetadata && data.getItemMetadata(row);
      metadata && metadata.cssClasses && (rowCss += " " + metadata.cssClasses);
      var frozenRowOffset = getFrozenRowOffset(row), rowHtml = `<div class="ui-widget-content ${rowCss}" style="top:${getRowTop(row) - frozenRowOffset}px">`;
      stringArrayL.push(rowHtml), hasFrozenColumns() && stringArrayR.push(rowHtml);
      for (var colspan, m, i2 = 0, ii = columns.length; i2 < ii; i2++)
        if (m = columns[i2], !(!m || m.hidden)) {
          if (colspan = 1, metadata && metadata.columns) {
            var columnData = metadata.columns[m.id] || metadata.columns[i2];
            colspan = columnData && columnData.colspan || 1, colspan === "*" && (colspan = ii - i2);
          }
          if (columnPosRight[Math.min(ii - 1, i2 + colspan - 1)] > range.leftPx) {
            if (!m.alwaysRenderColumn && columnPosLeft[i2] > range.rightPx)
              break;
            hasFrozenColumns() && i2 > options.frozenColumn ? appendCellHtml(stringArrayR, row, i2, colspan, d) : appendCellHtml(stringArrayL, row, i2, colspan, d);
          } else
            (m.alwaysRenderColumn || hasFrozenColumns() && i2 <= options.frozenColumn) && appendCellHtml(stringArrayL, row, i2, colspan, d);
          colspan > 1 && (i2 += colspan - 1);
        }
      stringArrayL.push("</div>"), hasFrozenColumns() && stringArrayR.push("</div>");
    }
    function appendCellHtml(stringArray, row, cell, colspan, item) {
      var m = columns[cell], cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
      hasFrozenColumns() && cell <= options.frozenColumn && (cellCss += " frozen"), row === activeRow && cell === activeCell && options.showCellSelection && (cellCss += " active");
      for (var key in cellCssClasses)
        cellCssClasses[key][row] && cellCssClasses[key][row][m.id] && (cellCss += " " + cellCssClasses[key][row][m.id]);
      var value = null, formatterResult = "";
      item && (value = getDataItemValueForColumn(item, m), formatterResult = getFormatter(row, m)(row, cell, value, m, item, self), formatterResult == null && (formatterResult = ""));
      var addlCssClasses = trigger(self.onBeforeAppendCell, { row, cell, value, dataContext: item }).getReturnValue() || "";
      addlCssClasses += formatterResult && formatterResult.addClasses ? (addlCssClasses ? " " : "") + formatterResult.addClasses : "";
      var toolTip = formatterResult && formatterResult.toolTip ? "title='" + formatterResult.toolTip + "'" : "", customAttrStr = "";
      if (m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object)
        for (var key in m.cellAttrs)
          m.cellAttrs.hasOwnProperty(key) && (customAttrStr += " " + key + '="' + m.cellAttrs[key] + '" ');
      stringArray.push(`<div class="${cellCss + (addlCssClasses ? " " + addlCssClasses : "")}" ${toolTip + customAttrStr}>`), item && stringArray.push(Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.text), stringArray.push("</div>"), rowsCache[row].cellRenderQueue.push(cell), rowsCache[row].cellColSpans[cell] = colspan;
    }
    function cleanupRows(rangeToKeep) {
      for (var i2 in rowsCache) {
        var removeFrozenRow = !0;
        hasFrozenRows && (options.frozenBottom && i2 >= actualFrozenRow || !options.frozenBottom && i2 <= actualFrozenRow) && (removeFrozenRow = !1), (i2 = parseInt(i2, 10)) !== activeRow && (i2 < rangeToKeep.top || i2 > rangeToKeep.bottom) && removeFrozenRow && removeRowFromCache(i2);
      }
      options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
    }
    function invalidate() {
      updateRowCount(), invalidateAllRows(), render();
    }
    function invalidateAllRows() {
      currentEditor && makeActiveCellNormal();
      for (var row in rowsCache)
        removeRowFromCache(row);
      options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
    }
    function queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
      postProcessgroupId++;
      for (var columnIdx in postProcessedRow)
        postProcessedRow.hasOwnProperty(columnIdx) && postProcessedCleanupQueue.push({
          actionType: "C",
          groupId: postProcessgroupId,
          node: cacheEntry.cellNodesByColumnIdx[columnIdx | 0],
          columnIdx: columnIdx | 0,
          rowIdx
        });
      postProcessedCleanupQueue.push({
        actionType: "R",
        groupId: postProcessgroupId,
        node: cacheEntry.rowNode
      }), cacheEntry.rowNode.forEach(function(node) {
        node.remove();
      });
    }
    function queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
      postProcessedCleanupQueue.push({
        actionType: "C",
        groupId: postProcessgroupId,
        node: cellnode,
        columnIdx,
        rowIdx
      }), cellnode.remove();
    }
    function removeRowFromCache(row) {
      var cacheEntry = rowsCache[row];
      cacheEntry && (options.enableAsyncPostRenderCleanup && postProcessedRows[row] ? queuePostProcessedRowForCleanup(cacheEntry, postProcessedRows[row], row) : cacheEntry.rowNode.forEach(function(node) {
        node.parentElement && node.parentElement.removeChild(node);
      }), delete rowsCache[row], delete postProcessedRows[row], renderedRows--, counter_rows_removed++);
    }
    function invalidateRows(rows) {
      var i2, rl;
      if (!(!rows || !rows.length)) {
        for (vScrollDir = 0, rl = rows.length, i2 = 0; i2 < rl; i2++)
          currentEditor && activeRow === rows[i2] && makeActiveCellNormal(), rowsCache[rows[i2]] && removeRowFromCache(rows[i2]);
        options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
      }
    }
    function invalidateRow(row) {
      !row && row !== 0 || invalidateRows([row]);
    }
    function applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
      if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
        cellNode.innerHTML = sanitizeHtmlString(formatterResult);
        return;
      }
      cellNode.innerHTML = sanitizeHtmlString(formatterResult.text), formatterResult.removeClasses && !suppressRemove && formatterResult.removeClasses.split(" ").forEach(function(c) {
        cellNode.classList.remove(c);
      }), formatterResult.addClasses && formatterResult.addClasses.split(" ").forEach(function(c) {
        cellNode.classList.add(c);
      }), formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
    }
    function updateCell(row, cell) {
      var cellNode = getCellNode(row, cell);
      if (cellNode) {
        var m = columns[cell], d = getDataItem(row);
        if (currentEditor && activeRow === row && activeCell === cell)
          currentEditor.loadValue(d);
        else {
          var formatterResult = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d, self) : "";
          applyFormatResultToCellNode(formatterResult, cellNode), invalidatePostProcessingResults(row);
        }
      }
    }
    function updateRow(row) {
      var cacheEntry = rowsCache[row];
      if (cacheEntry) {
        ensureCellNodesInRowsCache(row);
        var formatterResult, d = getDataItem(row);
        for (var columnIdx in cacheEntry.cellNodesByColumnIdx)
          if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
            columnIdx = columnIdx | 0;
            var m = columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
            row === activeRow && columnIdx === activeCell && currentEditor ? currentEditor.loadValue(d) : d ? (formatterResult = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d, self), applyFormatResultToCellNode(formatterResult, node)) : node.innerHTML = "";
          }
        invalidatePostProcessingResults(row);
      }
    }
    function getViewportHeight() {
      if ((!options.autoHeight || options.frozenColumn != -1) && (topPanelH = options.showTopPanel ? options.topPanelHeight + getVBoxDelta(_topPanelScrollers[0]) : 0, headerRowH = options.showHeaderRow ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0, footerRowH = options.showFooterRow ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0), options.autoHeight) {
        let fullHeight = _paneHeaderL.offsetHeight;
        fullHeight += options.showHeaderRow ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0, fullHeight += options.showFooterRow ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0, fullHeight += getCanvasWidth() > viewportW ? scrollbarDimensions.height : 0, viewportH = options.rowHeight * getDataLengthIncludingAddNew() + (options.frozenColumn == -1 ? fullHeight : 0);
      } else {
        let columnNamesH = options.showColumnHeader ? Utils.toFloat(Utils.height(_headerScroller[0])) + getVBoxDelta(_headerScroller[0]) : 0, preHeaderH = options.createPreHeaderPanel && options.showPreHeaderPanel ? options.preHeaderPanelHeight + getVBoxDelta(_preHeaderPanelScroller) : 0, style = getComputedStyle(_container);
        viewportH = Utils.toFloat(style.height) - Utils.toFloat(style.paddingTop) - Utils.toFloat(style.paddingBottom) - columnNamesH - topPanelH - headerRowH - footerRowH - preHeaderH;
      }
      return numVisibleRows = Math.ceil(viewportH / options.rowHeight), viewportH;
    }
    function getViewportWidth() {
      viewportW = parseFloat(Utils.innerSize(_container, "width"));
    }
    function resizeCanvas() {
      if (initialized) {
        if (paneTopH = 0, paneBottomH = 0, viewportTopH = 0, viewportBottomH = 0, getViewportWidth(), getViewportHeight(), hasFrozenRows ? options.frozenBottom ? (paneTopH = viewportH - frozenRowsHeight - scrollbarDimensions.height, paneBottomH = frozenRowsHeight + scrollbarDimensions.height) : (paneTopH = frozenRowsHeight, paneBottomH = viewportH - frozenRowsHeight) : paneTopH = viewportH, paneTopH += topPanelH + headerRowH + footerRowH, hasFrozenColumns() && options.autoHeight && (paneTopH += scrollbarDimensions.height), viewportTopH = paneTopH - topPanelH - headerRowH - footerRowH, options.autoHeight) {
          if (hasFrozenColumns()) {
            let style = getComputedStyle(_headerScrollerL);
            Utils.height(_container, paneTopH + Utils.toFloat(style.height));
          }
          _paneTopL.style.position = "relative";
        }
        Utils.setStyleSize(_paneTopL, "top", Utils.height(_paneHeaderL) || (options.showHeaderRow ? options.headerRowHeight : 0) + (options.showPreHeaderPanel ? options.preHeaderPanelHeight : 0)), Utils.height(_paneTopL, paneTopH);
        var paneBottomTop = _paneTopL.offsetTop + paneTopH;
        options.autoHeight || Utils.height(_viewportTopL, viewportTopH), hasFrozenColumns() ? (Utils.setStyleSize(_paneTopR, "top", Utils.height(_paneHeaderL)), Utils.height(_paneTopR, paneTopH), Utils.height(_viewportTopR, viewportTopH), hasFrozenRows && (Utils.setStyleSize(_paneBottomL, "top", paneBottomTop), Utils.height(_paneBottomL, paneBottomH), Utils.setStyleSize(_paneBottomR, "top", paneBottomTop), Utils.height(_paneBottomR, paneBottomH), Utils.height(_viewportBottomR, paneBottomH))) : hasFrozenRows && (Utils.width(_paneBottomL, "100%"), Utils.height(_paneBottomL, paneBottomH), Utils.setStyleSize(_paneBottomL, "top", paneBottomTop)), hasFrozenRows ? (Utils.height(_viewportBottomL, paneBottomH), options.frozenBottom ? (Utils.height(_canvasBottomL, frozenRowsHeight), hasFrozenColumns() && Utils.height(_canvasBottomR, frozenRowsHeight)) : (Utils.height(_canvasTopL, frozenRowsHeight), hasFrozenColumns() && Utils.height(_canvasTopR, frozenRowsHeight))) : Utils.height(_viewportTopR, viewportTopH), (!scrollbarDimensions || !scrollbarDimensions.width) && (scrollbarDimensions = measureScrollbar()), options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && autosizeColumns(), updateRowCount(), handleScroll(), lastRenderedScrollLeft = -1, render();
      }
    }
    function updatePagingStatusFromView(pagingInfo) {
      pagingActive = pagingInfo.pageSize !== 0, pagingIsLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
    }
    function updateRowCount() {
      if (initialized) {
        var dataLength = getDataLength(), dataLengthIncludingAddNew = getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = hasFrozenRows && !options.frozenBottom ? Utils.height(_canvasBottomL) : Utils.height(_canvasTopL);
        if (hasFrozenRows)
          var numberOfRows = getDataLength() - options.frozenRow;
        else
          var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
        var tempViewportH = Utils.height(_viewportScrollContainerY), oldViewportHasVScroll = viewportHasVScroll;
        viewportHasVScroll = options.alwaysShowVerticalScroll || !options.autoHeight && numberOfRows * options.rowHeight > tempViewportH, makeActiveCellNormal();
        var r1 = dataLength - 1;
        for (var i2 in rowsCache)
          i2 > r1 && removeRowFromCache(i2);
        options.enableAsyncPostRenderCleanup && startPostProcessingCleanup(), activeCellNode && activeRow > r1 && resetActiveCell();
        var oldH = h;
        options.autoHeight ? h = options.rowHeight * numberOfRows : (th = Math.max(options.rowHeight * numberOfRows, tempViewportH - scrollbarDimensions.height), th < maxSupportedCssHeight ? (h = ph = th, n = 1, cj = 0) : (h = maxSupportedCssHeight, ph = h / 100, n = Math.floor(th / ph), cj = (th - h) / (n - 1))), (h !== oldH || enforceFrozenRowHeightRecalc) && (hasFrozenRows && !options.frozenBottom ? (Utils.height(_canvasBottomL, h), hasFrozenColumns() && Utils.height(_canvasBottomR, h)) : (Utils.height(_canvasTopL, h), Utils.height(_canvasTopR, h)), scrollTop = _viewportScrollContainerY.scrollTop, enforceFrozenRowHeightRecalc = !1);
        var oldScrollTopInRange = scrollTop + offset <= th - tempViewportH;
        th == 0 || scrollTop == 0 ? page = offset = 0 : scrollTo(oldScrollTopInRange ? scrollTop + offset : th - tempViewportH + scrollbarDimensions.height), h != oldH && options.autoHeight && resizeCanvas(), options.autosizeColsMode === GridAutosizeColsMode.LegacyForceFit && oldViewportHasVScroll != viewportHasVScroll && autosizeColumns(), updateCanvasWidth(!1);
      }
    }
    function getVisibleRange(viewportTop, viewportLeft) {
      return viewportTop == null && (viewportTop = scrollTop), viewportLeft == null && (viewportLeft = scrollLeft), {
        top: getRowFromPosition(viewportTop),
        bottom: getRowFromPosition(viewportTop + viewportH) + 1,
        leftPx: viewportLeft,
        rightPx: viewportLeft + viewportW
      };
    }
    function getRenderedRange(viewportTop, viewportLeft) {
      var range = getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(viewportH / options.rowHeight), minBuffer = options.minRowBuffer;
      return vScrollDir == -1 ? (range.top -= buffer, range.bottom += minBuffer) : vScrollDir == 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= viewportW, range.rightPx += viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(canvasWidth, range.rightPx), range;
    }
    function ensureCellNodesInRowsCache(row) {
      let cacheEntry = rowsCache[row];
      if (cacheEntry && cacheEntry.cellRenderQueue.length) {
        let rowNode = cacheEntry.rowNode, children = Array.from(rowNode[0].children);
        rowNode.length > 1 && (children = children.concat(Array.from(rowNode[1].children)));
        let i2 = children.length - 1;
        for (; cacheEntry.cellRenderQueue.length; ) {
          let columnIdx = cacheEntry.cellRenderQueue.pop();
          cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i2--];
        }
      }
    }
    function cleanUpCells(range, row) {
      if (!(hasFrozenRows && (options.frozenBottom && row > actualFrozenRow || row <= actualFrozenRow))) {
        var totalCellsRemoved = 0, cacheEntry = rowsCache[row], cellsToRemove = [];
        for (var i2 in cacheEntry.cellNodesByColumnIdx)
          if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i2) && (i2 = i2 | 0, !(i2 <= options.frozenColumn) && !(Array.isArray(columns) && columns[i2] && columns[i2].alwaysRenderColumn))) {
            var colspan = cacheEntry.cellColSpans[i2];
            (columnPosLeft[i2] > range.rightPx || columnPosRight[Math.min(columns.length - 1, i2 + colspan - 1)] < range.leftPx) && (row == activeRow && i2 == activeCell || cellsToRemove.push(i2));
          }
        for (var cellToRemove, cellNode; (cellToRemove = cellsToRemove.pop()) != null; )
          cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], options.enableAsyncPostRenderCleanup && postProcessedRows[row] && postProcessedRows[row][cellToRemove] ? queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : cellNode.parentElement.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], postProcessedRows[row] && delete postProcessedRows[row][cellToRemove], totalCellsRemoved++;
      }
    }
    function cleanUpAndRenderCells(range) {
      for (var cacheEntry, stringArray = [], processedRows = [], cellsAdded, totalCellsAdded = 0, colspan, row = range.top, btm = range.bottom; row <= btm; row++)
        if (cacheEntry = rowsCache[row], !!cacheEntry) {
          ensureCellNodesInRowsCache(row), cleanUpCells(range, row), cellsAdded = 0;
          var metadata = data.getItemMetadata && data.getItemMetadata(row);
          metadata = metadata && metadata.columns;
          for (var d = getDataItem(row), i2 = 0, ii = columns.length; i2 < ii; i2++)
            if (!(!columns[i2] || columns[i2].hidden)) {
              if (columnPosLeft[i2] > range.rightPx)
                break;
              if ((colspan = cacheEntry.cellColSpans[i2]) != null) {
                i2 += colspan > 1 ? colspan - 1 : 0;
                continue;
              }
              if (colspan = 1, metadata) {
                var columnData = metadata[columns[i2].id] || metadata[i2];
                colspan = columnData && columnData.colspan || 1, colspan === "*" && (colspan = ii - i2);
              }
              columnPosRight[Math.min(ii - 1, i2 + colspan - 1)] > range.leftPx && (appendCellHtml(stringArray, row, i2, colspan, d), cellsAdded++), i2 += colspan > 1 ? colspan - 1 : 0;
            }
          cellsAdded && (totalCellsAdded += cellsAdded, processedRows.push(row));
        }
      if (stringArray.length)
        for (var x = Utils.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArray.join("")) }), processedRow, node; (processedRow = processedRows.pop()) != null; ) {
          cacheEntry = rowsCache[processedRow];
          for (var columnIdx; (columnIdx = cacheEntry.cellRenderQueue.pop()) != null; )
            node = x.lastChild, hasFrozenColumns() && columnIdx > options.frozenColumn ? cacheEntry.rowNode[1].appendChild(node) : cacheEntry.rowNode[0].appendChild(node), cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
        }
    }
    function renderRows(range) {
      for (var stringArrayL = [], stringArrayR = [], rows = [], needToReselectCell = !1, dataLength = getDataLength(), i2 = range.top, ii = range.bottom; i2 <= ii; i2++)
        rowsCache[i2] || hasFrozenRows && options.frozenBottom && i2 == getDataLength() || (renderedRows++, rows.push(i2), rowsCache[i2] = {
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
        }, appendRowHtml(stringArrayL, stringArrayR, i2, range, dataLength), activeCellNode && activeRow === i2 && (needToReselectCell = !0), counter_rows_rendered++);
      if (!rows.length)
        return;
      let x = Utils.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArrayL.join("")) }), xRight = Utils.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArrayR.join("")) });
      for (var i2 = 0, ii = rows.length; i2 < ii; i2++)
        hasFrozenRows && rows[i2] >= actualFrozenRow ? hasFrozenColumns() ? (rowsCache[rows[i2]].rowNode = [x.firstChild, xRight.firstChild], _canvasBottomL.appendChild(x.firstChild), _canvasBottomR.appendChild(xRight.firstChild)) : (rowsCache[rows[i2]].rowNode = [x.firstChild], _canvasBottomL.appendChild(x.firstChild)) : hasFrozenColumns() ? (rowsCache[rows[i2]].rowNode = [x.firstChild, xRight.firstChild], _canvasTopL.appendChild(x.firstChild), _canvasTopR.appendChild(xRight.firstChild)) : (rowsCache[rows[i2]].rowNode = [x.firstChild], _canvasTopL.appendChild(x.firstChild));
      needToReselectCell && (activeCellNode = getCellNode(activeRow, activeCell));
    }
    function startPostProcessing() {
      options.enableAsyncPostRender && (clearTimeout(h_postrender), h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay));
    }
    function startPostProcessingCleanup() {
      options.enableAsyncPostRenderCleanup && (clearTimeout(h_postrenderCleanup), h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay));
    }
    function invalidatePostProcessingResults(row) {
      for (var columnIdx in postProcessedRows[row])
        postProcessedRows[row].hasOwnProperty(columnIdx) && (postProcessedRows[row][columnIdx] = "C");
      postProcessFromRow = Math.min(postProcessFromRow, row), postProcessToRow = Math.max(postProcessToRow, row), startPostProcessing();
    }
    function updateRowPositions() {
      for (var row in rowsCache) {
        var rowNumber = row ? parseInt(row) : 0;
        Utils.setStyleSize("top", getRowTop(rowNumber));
      }
    }
    function render() {
      if (initialized) {
        scrollThrottle.dequeue();
        var visible = getVisibleRange(), rendered = getRenderedRange();
        if (cleanupRows(rendered), lastRenderedScrollLeft != scrollLeft) {
          if (hasFrozenRows) {
            var renderedFrozenRows = Utils.extend(!0, {}, rendered);
            options.frozenBottom ? (renderedFrozenRows.top = actualFrozenRow, renderedFrozenRows.bottom = getDataLength()) : (renderedFrozenRows.top = 0, renderedFrozenRows.bottom = options.frozenRow), cleanUpAndRenderCells(renderedFrozenRows);
          }
          cleanUpAndRenderCells(rendered);
        }
        renderRows(rendered), hasFrozenRows && (options.frozenBottom ? renderRows({
          top: actualFrozenRow,
          bottom: getDataLength() - 1,
          leftPx: rendered.leftPx,
          rightPx: rendered.rightPx
        }) : renderRows({
          top: 0,
          bottom: options.frozenRow - 1,
          leftPx: rendered.leftPx,
          rightPx: rendered.rightPx
        })), postProcessFromRow = visible.top, postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom), startPostProcessing(), lastRenderedScrollTop = scrollTop, lastRenderedScrollLeft = scrollLeft, h_render = null, trigger(self.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: self });
      }
    }
    function handleHeaderRowScroll() {
      var scrollLeft2 = _headerRowScrollContainer.scrollLeft;
      scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
    }
    function handleFooterRowScroll() {
      var scrollLeft2 = _footerRowScrollContainer.scrollLeft;
      scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
    }
    function handlePreHeaderPanelScroll() {
      handleElementScroll(_preHeaderPanelScroller);
    }
    function handleElementScroll(element) {
      var scrollLeft2 = element.scrollLeft;
      scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
    }
    function handleScroll() {
      return scrollTop = _viewportScrollContainerY.scrollTop, scrollLeft = _viewportScrollContainerX.scrollLeft, _handleScroll(!1);
    }
    function _handleScroll(isMouseWheel) {
      var maxScrollDistanceY = _viewportScrollContainerY.scrollHeight - _viewportScrollContainerY.clientHeight, maxScrollDistanceX = _viewportScrollContainerY.scrollWidth - _viewportScrollContainerY.clientWidth;
      maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), scrollTop > maxScrollDistanceY && (scrollTop = maxScrollDistanceY), scrollLeft > maxScrollDistanceX && (scrollLeft = maxScrollDistanceX);
      var vScrollDist = Math.abs(scrollTop - prevScrollTop), hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
      if (hScrollDist && (prevScrollLeft = scrollLeft, Utils.debounce(() => {
        _viewportScrollContainerX.scrollLeft = scrollLeft, _headerScrollContainer.scrollLeft = scrollLeft, _topPanelScrollers[0].scrollLeft = scrollLeft, options.createFooterRow && (_footerRowScrollContainer.scrollLeft = scrollLeft), options.createPreHeaderPanel && (hasFrozenColumns() ? _preHeaderPanelScrollerR.scrollLeft = scrollLeft : _preHeaderPanelScroller.scrollLeft = scrollLeft), hasFrozenColumns() ? (hasFrozenRows && (_viewportTopR.scrollLeft = scrollLeft), _headerRowScrollerR.scrollLeft = scrollLeft) : (hasFrozenRows && (_viewportTopL.scrollLeft = scrollLeft), _headerRowScrollerL.scrollLeft = scrollLeft);
      }, options.scrollDebounceDelay)()), vScrollDist && !options.autoHeight)
        if (vScrollDir = prevScrollTop < scrollTop ? 1 : -1, prevScrollTop = scrollTop, isMouseWheel && (_viewportScrollContainerY.scrollTop = scrollTop), hasFrozenColumns() && (hasFrozenRows && !options.frozenBottom ? _viewportBottomL.scrollTop = scrollTop : _viewportTopL.scrollTop = scrollTop), vScrollDist < viewportH)
          scrollTo(scrollTop + offset);
        else {
          var oldOffset = offset;
          h == viewportH ? page = 0 : page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph))), offset = Math.round(page * cj), oldOffset != offset && invalidateAllRows();
        }
      if (hScrollDist || vScrollDist) {
        var dx = Math.abs(lastRenderedScrollLeft - scrollLeft), dy = Math.abs(lastRenderedScrollTop - scrollTop);
        (dx > 20 || dy > 20) && (options.forceSyncScrolling || dy < viewportH && dx < viewportW ? render() : scrollThrottle.enqueue(), trigger(self.onViewportChanged, {}));
      }
      return trigger(self.onScroll, { scrollLeft, scrollTop }), !!(hScrollDist || vScrollDist);
    }
    function ActionThrottle(action, minPeriod_ms) {
      var blocked = !1, queued = !1;
      function enqueue() {
        blocked ? queued = !0 : blockAndExecute();
      }
      function dequeue() {
        queued = !1;
      }
      function blockAndExecute() {
        blocked = !0, setTimeout(unblock, minPeriod_ms), action();
      }
      function unblock() {
        queued ? (dequeue(), blockAndExecute()) : blocked = !1;
      }
      return {
        enqueue,
        dequeue
      };
    }
    function asyncPostProcessRows() {
      for (var dataLength = getDataLength(); postProcessFromRow <= postProcessToRow; ) {
        var row = vScrollDir >= 0 ? postProcessFromRow++ : postProcessToRow--, cacheEntry = rowsCache[row];
        if (!(!cacheEntry || row >= dataLength)) {
          postProcessedRows[row] || (postProcessedRows[row] = {}), ensureCellNodesInRowsCache(row);
          for (var columnIdx in cacheEntry.cellNodesByColumnIdx)
            if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
              columnIdx = columnIdx | 0;
              var m = columns[columnIdx], processedStatus = postProcessedRows[row][columnIdx];
              if (m.asyncPostRender && processedStatus !== "R") {
                var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
                node && m.asyncPostRender(node, row, getDataItem(row), m, processedStatus === "C"), postProcessedRows[row][columnIdx] = "R";
              }
            }
          h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
          return;
        }
      }
    }
    function asyncPostProcessCleanupRows() {
      if (postProcessedCleanupQueue.length > 0) {
        for (var groupId = postProcessedCleanupQueue[0].groupId; postProcessedCleanupQueue.length > 0 && postProcessedCleanupQueue[0].groupId == groupId; ) {
          var entry = postProcessedCleanupQueue.shift();
          if (entry.actionType == "R" && entry.node.forEach(function(node) {
            node.remove();
          }), entry.actionType == "C") {
            var column = columns[entry.columnIdx];
            column.asyncPostRenderCleanup && entry.node && column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
          }
        }
        h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
      }
    }
    function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      var node, columnId, addedRowHash, removedRowHash;
      for (var row in rowsCache) {
        if (removedRowHash = removedHash && removedHash[row], addedRowHash = addedHash && addedHash[row], removedRowHash)
          for (columnId in removedRowHash)
            (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) && (node = getCellNode(row, getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
        if (addedRowHash)
          for (columnId in addedRowHash)
            (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) && (node = getCellNode(row, getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
      }
    }
    function addCellCssStyles(key, hash) {
      if (cellCssClasses[key])
        throw new Error("SlickGrid addCellCssStyles: cell CSS hash with key '" + key + "' already exists.");
      cellCssClasses[key] = hash, updateCellCssStylesOnRenderedRows(hash, null), trigger(self.onCellCssStylesChanged, { key, hash, grid: self });
    }
    function removeCellCssStyles(key) {
      cellCssClasses[key] && (updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]), delete cellCssClasses[key], trigger(self.onCellCssStylesChanged, { key, hash: null, grid: self }));
    }
    function setCellCssStyles(key, hash) {
      let prevHash = cellCssClasses[key];
      cellCssClasses[key] = hash, updateCellCssStylesOnRenderedRows(hash, prevHash), trigger(self.onCellCssStylesChanged, { key, hash, grid: self });
    }
    function getCellCssStyles(key) {
      return cellCssClasses[key];
    }
    function flashCell(row, cell, speed) {
      speed = speed || 250;
      function toggleCellClass(cellNode, times) {
        times < 1 || setTimeout(function() {
          times % 2 == 0 ? cellNode.classList.add(options.cellFlashingCssClass) : cellNode.classList.remove(options.cellFlashingCssClass), toggleCellClass(cellNode, times - 1);
        }, speed);
      }
      if (rowsCache[row]) {
        let cellNode = getCellNode(row, cell);
        cellNode && toggleCellClass(cellNode, 5);
      }
    }
    function handleMouseWheel(e, delta, deltaX, deltaY) {
      scrollTop = Math.max(0, _viewportScrollContainerY.scrollTop - deltaY * options.rowHeight), scrollLeft = _viewportScrollContainerX.scrollLeft + deltaX * 10;
      var handled = _handleScroll(!0);
      handled && e.preventDefault();
    }
    function handleDragInit(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell))
        return !1;
      var retval = trigger(self.onDragInit, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
    }
    function handleDragStart(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell))
        return !1;
      var retval = trigger(self.onDragStart, dd, e);
      return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
    }
    function handleDrag(e, dd) {
      return trigger(self.onDrag, dd, e).getReturnValue();
    }
    function handleDragEnd(e, dd) {
      trigger(self.onDragEnd, dd, e);
    }
    function handleKeyDown(e) {
      var handled = trigger(self.onKeyDown, { row: activeRow, cell: activeCell }, e).isImmediatePropagationStopped();
      if (!handled && !e.shiftKey && !e.altKey) {
        if (options.editable && currentEditor && currentEditor.keyCaptureList && currentEditor.keyCaptureList.indexOf(e.which) > -1)
          return;
        e.which == keyCode.HOME ? handled = e.ctrlKey ? navigateTop() : navigateRowStart() : e.which == keyCode.END && (handled = e.ctrlKey ? navigateBottom() : navigateRowEnd());
      }
      if (!handled)
        if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
          if (options.editable && currentEditor && currentEditor.keyCaptureList && currentEditor.keyCaptureList.indexOf(e.which) > -1)
            return;
          if (e.which == keyCode.ESCAPE) {
            if (!getEditorLock().isActive())
              return;
            cancelEditAndSetFocus();
          } else
            e.which == keyCode.PAGE_DOWN ? (navigatePageDown(), handled = !0) : e.which == keyCode.PAGE_UP ? (navigatePageUp(), handled = !0) : e.which == keyCode.LEFT ? handled = navigateLeft() : e.which == keyCode.RIGHT ? handled = navigateRight() : e.which == keyCode.UP ? handled = navigateUp() : e.which == keyCode.DOWN ? handled = navigateDown() : e.which == keyCode.TAB ? handled = navigateNext() : e.which == keyCode.ENTER && (options.editable && (currentEditor ? activeRow === getDataLength() ? navigateDown() : commitEditAndSetFocus() : getEditorLock().commitCurrentEdit() && makeActiveCellEditable(void 0, void 0, e)), handled = !0);
        } else
          e.which == keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = navigatePrev());
      if (handled) {
        e.stopPropagation(), e.preventDefault();
        try {
          e.originalEvent.keyCode = 0;
        } catch (error) {
        }
      }
    }
    function handleClick(evt) {
      let e = evt;
      if (e instanceof EventData ? e = evt.getNativeEvent() : evt = void 0, !currentEditor && (e.target != document.activeElement || e.target.classList.contains("slick-cell"))) {
        var selection = getTextSelection();
        setFocus(), setTextSelection(selection);
      }
      var cell = getCellFromEvent(e);
      if (!(!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) && (evt = trigger(self.onClick, { row: cell.row, cell: cell.cell }, evt || e), !evt.isImmediatePropagationStopped() && canCellBeActive(cell.row, cell.cell) && (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()))) {
        scrollRowIntoView(cell.row, !1);
        var preClickModeOn = e.target && e.target.className === preClickClassName, column = columns[cell.cell], suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
        setActiveCellInternal(getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
      }
    }
    function handleContextMenu(e) {
      var cell = e.target.closest(".slick-cell");
      cell && (activeCellNode === cell && currentEditor !== null || trigger(self.onContextMenu, {}, e));
    }
    function handleDblClick(e) {
      var cell = getCellFromEvent(e);
      !cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell || (trigger(self.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && options.editable && gotoCell(cell.row, cell.cell, !0, e));
    }
    function handleHeaderMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && trigger(self.onHeaderMouseEnter, {
        column: c,
        grid: self
      }, e);
    }
    function handleHeaderMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-header-column"), "column");
      c && trigger(self.onHeaderMouseLeave, {
        column: c,
        grid: self
      }, e);
    }
    function handleHeaderRowMouseEnter(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && trigger(self.onHeaderRowMouseEnter, {
        column: c,
        grid: self
      }, e);
    }
    function handleHeaderRowMouseLeave(e) {
      let c = Utils.storage.get(e.target.closest(".slick-headerrow-column"), "column");
      c && trigger(self.onHeaderRowMouseLeave, {
        column: c,
        grid: self
      }, e);
    }
    function handleHeaderContextMenu(e) {
      var header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
      trigger(self.onHeaderContextMenu, { column }, e);
    }
    function handleHeaderClick(e) {
      if (!columnResizeDragging) {
        var header = e.target.closest(".slick-header-column"), column = header && Utils.storage.get(header, "column");
        column && trigger(self.onHeaderClick, { column }, e);
      }
    }
    function handleFooterContextMenu(e) {
      var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      trigger(self.onFooterContextMenu, { column }, e);
    }
    function handleFooterClick(e) {
      var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils.storage.get(footer, "column");
      trigger(self.onFooterClick, { column }, e);
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
      for (var row = getRowFromPosition(y), cell = 0, w = 0, i2 = 0; i2 < columns.length && w < x; i2++)
        !columns[i2] || columns[i2].hidden || (w += columns[i2].width, cell++);
      return cell < 0 && (cell = 0), { row, cell: cell - 1 };
    }
    function getCellFromNode(cellNode) {
      var cls = /l\d+/.exec(cellNode.className);
      if (!cls)
        throw new Error("SlickGrid getCellFromNode: cannot get cell - " + cellNode.className);
      return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
    }
    function getRowFromNode(rowNode) {
      for (var row in rowsCache)
        for (var i2 in rowsCache[row].rowNode)
          if (rowsCache[row].rowNode[i2] === rowNode)
            return row ? parseInt(row) : 0;
      return null;
    }
    function getFrozenRowOffset(row) {
      let offset2 = 0;
      return hasFrozenRows ? options.frozenBottom ? row >= actualFrozenRow ? h < viewportTopH ? offset2 = actualFrozenRow * options.rowHeight : offset2 = h : offset2 = 0 : row >= actualFrozenRow ? offset2 = frozenRowsHeight : offset2 = 0 : offset2 = 0, offset2;
    }
    function getCellFromEvent(e) {
      e instanceof EventData && (e = e.getNativeEvent());
      var targetEvent = e.touches ? e.touches[0] : e, row, cell, cellNode = e.target.closest(".slick-cell");
      if (!cellNode)
        return null;
      if (row = getRowFromNode(cellNode.parentNode), hasFrozenRows) {
        var c = Utils.offset(Utils.parents(cellNode, ".grid-canvas")[0]), rowOffset = 0, isBottom = Utils.parents(cellNode, ".grid-canvas-bottom").length;
        isBottom && (rowOffset = options.frozenBottom ? Utils.height(_canvasTopL) : frozenRowsHeight), row = getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
      }
      return cell = getCellFromNode(cellNode), row == null || cell == null ? null : {
        row,
        cell
      };
    }
    function getCellNodeBox(row, cell) {
      if (!cellExists(row, cell))
        return null;
      for (var frozenRowOffset = getFrozenRowOffset(row), y1 = getRowTop(row) - frozenRowOffset, y2 = y1 + options.rowHeight - 1, x1 = 0, i2 = 0; i2 < cell; i2++)
        !columns[i2] || columns[i2].hidden || (x1 += columns[i2].width, options.frozenColumn == i2 && (x1 = 0));
      var x2 = x1 + columns[cell].width;
      return {
        top: y1,
        left: x1,
        bottom: y2,
        right: x2
      };
    }
    function resetActiveCell() {
      setActiveCellInternal(null, !1);
    }
    function setFocus() {
      tabbingDirection == -1 ? _focusSink.focus() : _focusSink2.focus();
    }
    function scrollCellIntoView(row, cell, doPaging) {
      if (scrollRowIntoView(row, doPaging), !(cell <= options.frozenColumn)) {
        var colspan = getColspan(row, cell);
        internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
      }
    }
    function internalScrollColumnIntoView(left, right) {
      var scrollRight = scrollLeft + Utils.width(_viewportScrollContainerX) - (viewportHasVScroll ? scrollbarDimensions.width : 0);
      left < scrollLeft ? (_viewportScrollContainerX.scrollLeft = left, handleScroll(), render()) : right > scrollRight && (_viewportScrollContainerX.scrollLeft = Math.min(left, right - _viewportScrollContainerX.clientWidth), handleScroll(), render());
    }
    function scrollColumnIntoView(cell) {
      internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell]);
    }
    function setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
      activeCellNode !== null && (makeActiveCellNormal(), activeCellNode.classList.remove("active"), rowsCache[activeRow] && rowsCache[activeRow].rowNode.forEach(function(node) {
        node.classList.remove("active");
      }));
      var activeCellChanged = activeCellNode !== newCell;
      if (activeCellNode = newCell, activeCellNode != null) {
        var activeCellOffset = Utils.offset(activeCellNode), rowOffset = Math.floor(Utils.offset(Utils.parents(activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils.parents(activeCellNode, ".grid-canvas-bottom").length;
        hasFrozenRows && isBottom && (rowOffset -= options.frozenBottom ? Utils.height(_canvasTopL) : frozenRowsHeight);
        var cell = getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
        activeRow = cell.row, activeCell = activePosX = activeCell = activePosX = getCellFromNode(activeCellNode), opt_editMode == null && (opt_editMode = activeRow == getDataLength() || options.autoEdit), options.showCellSelection && (activeCellNode.classList.add("active"), rowsCache[activeRow] && rowsCache[activeRow].rowNode.forEach(function(node) {
          node.classList.add("active");
        })), options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell) && (clearTimeout(h_editorLoader), options.asyncEditorLoading ? h_editorLoader = setTimeout(function() {
          makeActiveCellEditable(void 0, preClickModeOn, e);
        }, options.asyncEditorLoadDelay) : makeActiveCellEditable(void 0, preClickModeOn, e));
      } else
        activeRow = activeCell = null;
      suppressActiveCellChangedEvent || trigger(self.onActiveCellChanged, getActiveCell());
    }
    function clearTextSelection() {
      if (document.selection && document.selection.empty)
        try {
          document.selection.empty();
        } catch (e) {
        }
      else if (window.getSelection) {
        var sel = window.getSelection();
        sel && sel.removeAllRanges && sel.removeAllRanges();
      }
    }
    function isCellPotentiallyEditable(row, cell) {
      var dataLength = getDataLength();
      return !(row < dataLength && !getDataItem(row) || columns[cell].cannotTriggerInsert && row >= dataLength || !columns[cell] || columns[cell].hidden || !getEditor(row, cell));
    }
    function makeActiveCellNormal() {
      if (currentEditor) {
        if (trigger(self.onBeforeCellEditorDestroy, { editor: currentEditor }), currentEditor.destroy(), currentEditor = null, activeCellNode) {
          var d = getDataItem(activeRow);
          if (activeCellNode.classList.remove("editable"), activeCellNode.classList.remove("invalid"), d) {
            var column = columns[activeCell], formatter = getFormatter(activeRow, column), formatterResult = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d, self);
            applyFormatResultToCellNode(formatterResult, activeCellNode), invalidatePostProcessingResults(activeRow);
          }
        }
        navigator.userAgent.toLowerCase().match(/msie/) && clearTextSelection(), getEditorLock().deactivate(editController);
      }
    }
    function makeActiveCellEditable(editor, preClickModeOn, e) {
      if (activeCellNode) {
        if (!options.editable)
          throw new Error("SlickGrid makeActiveCellEditable : should never get called when options.editable is false");
        if (clearTimeout(h_editorLoader), !!isCellPotentiallyEditable(activeRow, activeCell)) {
          var columnDef = columns[activeCell], item = getDataItem(activeRow);
          if (trigger(self.onBeforeEditCell, { row: activeRow, cell: activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
            setFocus();
            return;
          }
          getEditorLock().activate(editController), activeCellNode.classList.add("editable");
          var useEditor = editor || getEditor(activeRow, activeCell);
          !editor && !useEditor.suppressClearOnEdit && (activeCellNode.innerHTML = "");
          var metadata = data.getItemMetadata && data.getItemMetadata(activeRow);
          metadata = metadata && metadata.columns;
          var columnMetaData = metadata && (metadata[columnDef.id] || metadata[activeCell]);
          currentEditor = new useEditor({
            grid: self,
            gridPosition: absBox(_container),
            position: absBox(activeCellNode),
            container: activeCellNode,
            column: columnDef,
            columnMetaData,
            item: item || {},
            event: e,
            commitChanges: commitEditAndSetFocus,
            cancelChanges: cancelEditAndSetFocus
          }), item && (currentEditor.loadValue(item), preClickModeOn && currentEditor.preClick && currentEditor.preClick()), serializedEditorValue = currentEditor.serializeValue(), currentEditor.position && handleActiveCellPositionChange();
        }
      }
    }
    function commitEditAndSetFocus() {
      getEditorLock().commitCurrentEdit() && (setFocus(), options.autoEdit && !options.autoCommitEdit && navigateDown());
    }
    function cancelEditAndSetFocus() {
      getEditorLock().cancelCurrentEdit() && setFocus();
    }
    function absBox(elem) {
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
      for (var offsetParent = elem.offsetParent; (elem = elem.parentNode) != document.body && elem != null; ) {
        let styles = getComputedStyle(elem);
        box.visible && elem.scrollHeight != elem.offsetHeight && styles.overflowY != "visible" && (box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight), box.visible && elem.scrollWidth != elem.offsetWidth && styles.overflowX != "visible" && (box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth), box.left -= elem.scrollLeft, box.top -= elem.scrollTop, elem === offsetParent && (box.left += elem.offsetLeft, box.top += elem.offsetTop, offsetParent = elem.offsetParent), box.bottom = box.top + box.height, box.right = box.left + box.width;
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
      if (activeCellNode && (trigger(self.onActiveCellPositionChanged, {}), currentEditor)) {
        var cellBox = getActiveCellPosition();
        currentEditor.show && currentEditor.hide && (cellBox.visible ? currentEditor.show() : currentEditor.hide()), currentEditor.position && currentEditor.position(cellBox);
      }
    }
    function getCellEditor() {
      return currentEditor;
    }
    function getActiveCell() {
      return activeCellNode ? { row: activeRow, cell: activeCell } : null;
    }
    function getActiveCellNode() {
      return activeCellNode;
    }
    function getTextSelection() {
      var textSelection = null;
      if (window.getSelection) {
        var selection = window.getSelection();
        selection.rangeCount > 0 && (textSelection = selection.getRangeAt(0));
      }
      return textSelection;
    }
    function setTextSelection(selection) {
      if (window.getSelection && selection) {
        var target = window.getSelection();
        target.removeAllRanges(), target.addRange(selection);
      }
    }
    function scrollRowIntoView(row, doPaging) {
      if (!hasFrozenRows || !options.frozenBottom && row > actualFrozenRow - 1 || options.frozenBottom && row < actualFrozenRow - 1) {
        var viewportScrollH = Utils.height(_viewportScrollContainerY), rowNumber = hasFrozenRows && !options.frozenBottom ? row - options.frozenRow : row, rowAtTop = rowNumber * options.rowHeight, rowAtBottom = (rowNumber + 1) * options.rowHeight - viewportScrollH + (viewportHasHScroll ? scrollbarDimensions.height : 0);
        (rowNumber + 1) * options.rowHeight > scrollTop + viewportScrollH + offset ? (scrollTo(doPaging ? rowAtTop : rowAtBottom), render()) : rowNumber * options.rowHeight < scrollTop + offset && (scrollTo(doPaging ? rowAtBottom : rowAtTop), render());
      }
    }
    function scrollRowToTop(row) {
      scrollTo(row * options.rowHeight), render();
    }
    function scrollPage(dir) {
      var deltaRows = dir * numVisibleRows, bottomOfTopmostFullyVisibleRow = scrollTop + options.rowHeight - 1;
      if (scrollTo((getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * options.rowHeight), render(), options.enableCellNavigation && activeRow != null) {
        var row = activeRow + deltaRows, dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
        row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
        for (var cell = 0, prevCell = null, prevActivePosX = activePosX; cell <= activePosX; )
          canCellBeActive(row, cell) && (prevCell = cell), cell += getColspan(row, cell);
        prevCell !== null ? (setActiveCellInternal(getCellNode(row, prevCell)), activePosX = prevActivePosX) : resetActiveCell();
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
      navigateToRow(getDataLength() - 1);
    }
    function navigateToRow(row) {
      var num_rows = getDataLength();
      if (!num_rows)
        return !0;
      if (row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), scrollCellIntoView(row, 0, !0), options.enableCellNavigation && activeRow != null) {
        for (var cell = 0, prevCell = null, prevActivePosX = activePosX; cell <= activePosX; )
          canCellBeActive(row, cell) && (prevCell = cell), cell += getColspan(row, cell);
        prevCell !== null ? (setActiveCellInternal(getCellNode(row, prevCell)), activePosX = prevActivePosX) : resetActiveCell();
      }
      return !0;
    }
    function getColspan(row, cell) {
      var metadata = data.getItemMetadata && data.getItemMetadata(row);
      if (!metadata || !metadata.columns)
        return 1;
      var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell], colspan = columnData && columnData.colspan;
      return colspan === "*" ? colspan = columns.length - cell : colspan = colspan || 1, colspan;
    }
    function findFirstFocusableCell(row) {
      for (var cell = 0; cell < columns.length; ) {
        if (canCellBeActive(row, cell))
          return cell;
        cell += getColspan(row, cell);
      }
      return null;
    }
    function findLastFocusableCell(row) {
      for (var cell = 0, lastFocusableCell = null; cell < columns.length; )
        canCellBeActive(row, cell) && (lastFocusableCell = cell), cell += getColspan(row, cell);
      return lastFocusableCell;
    }
    function gotoRight(row, cell, posX) {
      if (cell >= columns.length)
        return null;
      do
        cell += getColspan(row, cell);
      while (cell < columns.length && !canCellBeActive(row, cell));
      return cell < columns.length ? {
        row,
        cell,
        posX: cell
      } : null;
    }
    function gotoLeft(row, cell, posX) {
      if (cell <= 0)
        return null;
      var firstFocusableCell = findFirstFocusableCell(row);
      if (firstFocusableCell === null || firstFocusableCell >= cell)
        return null;
      for (var prev = {
        row,
        cell: firstFocusableCell,
        posX: firstFocusableCell
      }, pos; ; ) {
        if (pos = gotoRight(prev.row, prev.cell, prev.posX), !pos)
          return null;
        if (pos.cell >= cell)
          return prev;
        prev = pos;
      }
    }
    function gotoDown(row, cell, posX) {
      for (var prevCell, dataLengthIncludingAddNew = getDataLengthIncludingAddNew(); ; ) {
        if (++row >= dataLengthIncludingAddNew)
          return null;
        for (prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += getColspan(row, cell);
        if (canCellBeActive(row, prevCell))
          return {
            row,
            cell: prevCell,
            posX
          };
      }
    }
    function gotoUp(row, cell, posX) {
      for (var prevCell; ; ) {
        if (--row < 0)
          return null;
        for (prevCell = cell = 0; cell <= posX; )
          prevCell = cell, cell += getColspan(row, cell);
        if (canCellBeActive(row, prevCell))
          return {
            row,
            cell: prevCell,
            posX
          };
      }
    }
    function gotoNext(row, cell, posX) {
      if (row == null && cell == null && (row = cell = posX = 0, canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell
        };
      var pos = gotoRight(row, cell, posX);
      if (pos)
        return pos;
      var firstFocusableCell = null, dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      for (row === dataLengthIncludingAddNew - 1 && row--; ++row < dataLengthIncludingAddNew; )
        if (firstFocusableCell = findFirstFocusableCell(row), firstFocusableCell !== null)
          return {
            row,
            cell: firstFocusableCell,
            posX: firstFocusableCell
          };
      return null;
    }
    function gotoPrev(row, cell, posX) {
      if (row == null && cell == null && (row = getDataLengthIncludingAddNew() - 1, cell = posX = columns.length - 1, canCellBeActive(row, cell)))
        return {
          row,
          cell,
          posX: cell
        };
      for (var pos, lastSelectableCell; !pos && (pos = gotoLeft(row, cell, posX), !pos); ) {
        if (--row < 0)
          return null;
        cell = 0, lastSelectableCell = findLastFocusableCell(row), lastSelectableCell !== null && (pos = {
          row,
          cell: lastSelectableCell,
          posX: lastSelectableCell
        });
      }
      return pos;
    }
    function gotoRowStart(row, cell, posX) {
      var newCell = findFirstFocusableCell(row);
      return newCell === null ? null : {
        row,
        cell: newCell,
        posX: newCell
      };
    }
    function gotoRowEnd(row, cell, posX) {
      var newCell = findLastFocusableCell(row);
      return newCell === null ? null : {
        row,
        cell: newCell,
        posX: newCell
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
    function navigate(dir) {
      if (!options.enableCellNavigation || !activeCellNode && dir != "prev" && dir != "next")
        return !1;
      if (!getEditorLock().commitCurrentEdit())
        return !0;
      setFocus();
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
      tabbingDirection = tabbingDirections[dir];
      var stepFunctions = {
        up: gotoUp,
        down: gotoDown,
        left: gotoLeft,
        right: gotoRight,
        prev: gotoPrev,
        next: gotoNext,
        home: gotoRowStart,
        end: gotoRowEnd
      }, stepFn = stepFunctions[dir], pos = stepFn(activeRow, activeCell, activePosX);
      if (pos) {
        if (hasFrozenRows && options.frozenBottom & pos.row == getDataLength())
          return;
        var isAddNewRow = pos.row == getDataLength();
        return (!options.frozenBottom && pos.row >= actualFrozenRow || options.frozenBottom && pos.row < actualFrozenRow) && scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && options.emulatePagingWhenScrolling), setActiveCellInternal(getCellNode(pos.row, pos.cell)), activePosX = pos.posX, !0;
      } else
        return setActiveCellInternal(getCellNode(activeRow, activeCell)), !1;
    }
    function getCellNode(row, cell) {
      if (rowsCache[row]) {
        ensureCellNodesInRowsCache(row);
        try {
          return rowsCache[row].cellNodesByColumnIdx.length > cell ? rowsCache[row].cellNodesByColumnIdx[cell] : null;
        } catch (e) {
          return rowsCache[row].cellNodesByColumnIdx[cell];
        }
      }
      return null;
    }
    function setActiveCell(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
      initialized && (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0 || options.enableCellNavigation && (scrollCellIntoView(row, cell, !1), setActiveCellInternal(getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent)));
    }
    function setActiveRow(row, cell, suppressScrollIntoView) {
      initialized && (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0 || (activeRow = row, suppressScrollIntoView || scrollCellIntoView(row, cell || 0, !1)));
    }
    function canCellBeActive(row, cell) {
      if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() || row < 0 || cell >= columns.length || cell < 0 || !columns[cell] || columns[cell].hidden)
        return !1;
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.focusable != "undefined")
        return !!rowMetadata.focusable;
      var columnMetadata = rowMetadata && rowMetadata.columns;
      return columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable != "undefined" ? !!columnMetadata[columns[cell].id].focusable : columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable != "undefined" ? !!columnMetadata[cell].focusable : !!columns[cell].focusable;
    }
    function canCellBeSelected(row, cell) {
      if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0 || !columns[cell] || columns[cell].hidden)
        return !1;
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.selectable != "undefined")
        return !!rowMetadata.selectable;
      var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
      return columnMetadata && typeof columnMetadata.selectable != "undefined" ? !!columnMetadata.selectable : !!columns[cell].selectable;
    }
    function gotoCell(row, cell, forceEdit, e) {
      if (initialized && canCellBeActive(row, cell) && getEditorLock().commitCurrentEdit()) {
        scrollCellIntoView(row, cell, !1);
        var newCell = getCellNode(row, cell), column = columns[cell], suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
        setActiveCellInternal(newCell, forceEdit || row === getDataLength() || options.autoEdit, null, suppressActiveCellChangedEvent, e), currentEditor || setFocus();
      }
    }
    function commitCurrentEdit() {
      var item = getDataItem(activeRow), column = columns[activeCell];
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
                execute: function() {
                  this.editor.applyValue(item, this.serializedValue), updateRow(this.row), trigger(self.onCellChange, {
                    command: "execute",
                    row: this.row,
                    cell: this.cell,
                    item,
                    column
                  });
                },
                undo: function() {
                  this.editor.applyValue(item, this.prevSerializedValue), updateRow(this.row), trigger(self.onCellChange, {
                    command: "undo",
                    row: this.row,
                    cell: this.cell,
                    item,
                    column
                  });
                }
              };
              options.editCommandHandler ? (makeActiveCellNormal(), options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), makeActiveCellNormal());
            } else {
              var newItem = {};
              currentEditor.applyValue(newItem, currentEditor.serializeValue()), makeActiveCellNormal(), trigger(self.onAddNewRow, { item: newItem, column });
            }
            return !getEditorLock().isActive();
          } else
            return activeCellNode.classList.remove("invalid"), Utils.width(activeCellNode), activeCellNode.classList.add("invalid"), trigger(self.onValidationError, {
              editor: currentEditor,
              cellNode: activeCellNode,
              validationResults,
              row: activeRow,
              cell: activeCell,
              column
            }), currentEditor.focus(), !1;
        }
        makeActiveCellNormal();
      }
      return !0;
    }
    function cancelCurrentEdit() {
      return makeActiveCellNormal(), !0;
    }
    function rowsToRanges(rows) {
      for (var ranges = [], lastCell = columns.length - 1, i2 = 0; i2 < rows.length; i2++)
        ranges.push(new SlickRange(rows[i2], 0, rows[i2], lastCell));
      return ranges;
    }
    function getSelectedRows() {
      if (!selectionModel)
        throw new Error("SlickGrid Selection model is not set");
      return selectedRows.slice(0);
    }
    function setSelectedRows(rows, caller) {
      if (!selectionModel)
        throw new Error("SlickGrid Selection model is not set");
      self && self.getEditorLock && !self.getEditorLock().isActive() && selectionModel.setSelectedRanges(rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
    }
    var logMessageCount = 0, logMessageMaxCount = 30;
    function sanitizeHtmlString(dirtyHtml, suppressLogging) {
      if (!options.sanitizer || typeof dirtyHtml != "string")
        return dirtyHtml;
      var cleanHtml = options.sanitizer(dirtyHtml);
      return !suppressLogging && options.logSanitizedHtml && logMessageCount <= logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log("sanitizer altered html: " + dirtyHtml + " --> " + cleanHtml), logMessageCount === logMessageMaxCount && console.log("sanitizer: silencing messages after first " + logMessageMaxCount), logMessageCount++), cleanHtml;
    }
    this.debug = function() {
      var s = "";
      s += `
counter_rows_rendered:  ` + counter_rows_rendered, s += `
counter_rows_removed:  ` + counter_rows_removed, s += `
renderedRows:  ` + renderedRows, s += `
numVisibleRows:  ` + numVisibleRows, s += `
maxSupportedCssHeight:  ` + maxSupportedCssHeight, s += `
n(umber of pages):  ` + n, s += `
(current) page:  ` + page, s += `
page height (ph):  ` + ph, s += `
vScrollDir:  ` + vScrollDir, alert(s);
    }, Utils.extend(this, {
      slickGridVersion: "4.0.0",
      // Events
      onScroll: new SlickEvent(),
      onBeforeSort: new SlickEvent(),
      onSort: new SlickEvent(),
      onHeaderMouseEnter: new SlickEvent(),
      onHeaderMouseLeave: new SlickEvent(),
      onHeaderRowMouseEnter: new SlickEvent(),
      onHeaderRowMouseLeave: new SlickEvent(),
      onHeaderContextMenu: new SlickEvent(),
      onHeaderClick: new SlickEvent(),
      onHeaderCellRendered: new SlickEvent(),
      onBeforeHeaderCellDestroy: new SlickEvent(),
      onHeaderRowCellRendered: new SlickEvent(),
      onFooterRowCellRendered: new SlickEvent(),
      onFooterContextMenu: new SlickEvent(),
      onFooterClick: new SlickEvent(),
      onBeforeHeaderRowCellDestroy: new SlickEvent(),
      onBeforeFooterRowCellDestroy: new SlickEvent(),
      onMouseEnter: new SlickEvent(),
      onMouseLeave: new SlickEvent(),
      onClick: new SlickEvent(),
      onDblClick: new SlickEvent(),
      onContextMenu: new SlickEvent(),
      onKeyDown: new SlickEvent(),
      onAddNewRow: new SlickEvent(),
      onBeforeAppendCell: new SlickEvent(),
      onValidationError: new SlickEvent(),
      onViewportChanged: new SlickEvent(),
      onColumnsReordered: new SlickEvent(),
      onColumnsDrag: new SlickEvent(),
      onColumnsResized: new SlickEvent(),
      onColumnsResizeDblClick: new SlickEvent(),
      onBeforeColumnsResize: new SlickEvent(),
      onCellChange: new SlickEvent(),
      onCompositeEditorChange: new SlickEvent(),
      onBeforeEditCell: new SlickEvent(),
      onBeforeCellEditorDestroy: new SlickEvent(),
      onBeforeDestroy: new SlickEvent(),
      onActiveCellChanged: new SlickEvent(),
      onActiveCellPositionChanged: new SlickEvent(),
      onDragInit: new SlickEvent(),
      onDragStart: new SlickEvent(),
      onDrag: new SlickEvent(),
      onDragEnd: new SlickEvent(),
      onSelectedRowsChanged: new SlickEvent(),
      onCellCssStylesChanged: new SlickEvent(),
      onAutosizeColumns: new SlickEvent(),
      onBeforeSetColumns: new SlickEvent(),
      onBeforeUpdateColumns: new SlickEvent(),
      onRendered: new SlickEvent(),
      onSetOptions: new SlickEvent(),
      // Methods
      registerPlugin,
      unregisterPlugin,
      getPluginByName,
      getColumns,
      setColumns,
      updateColumns,
      getVisibleColumns,
      getColumnIndex,
      updateColumnHeader,
      setSortColumn,
      setSortColumns,
      getSortColumns,
      autosizeColumns,
      autosizeColumn,
      getOptions,
      setOptions,
      getData,
      getDataLength,
      getDataItem,
      setData,
      getSelectionModel,
      setSelectionModel,
      getSelectedRows,
      setSelectedRows,
      getContainerNode,
      updatePagingStatusFromView,
      applyFormatResultToCellNode,
      render,
      reRenderColumns,
      invalidate,
      invalidateRow,
      invalidateRows,
      invalidateAllRows,
      updateCell,
      updateRow,
      getViewport: getVisibleRange,
      getRenderedRange,
      resizeCanvas,
      updateRowCount,
      scrollRowIntoView,
      scrollRowToTop,
      scrollCellIntoView,
      scrollColumnIntoView,
      getCanvasNode,
      getUID,
      getHeaderColumnWidthDiff,
      getScrollbarDimensions,
      getHeadersWidth,
      getCanvasWidth,
      getCanvases,
      getActiveCanvasNode,
      getViewportNode,
      getViewports,
      getActiveViewportNode,
      setActiveViewportNode,
      focus: setFocus,
      scrollTo,
      cacheCssForHiddenInit,
      restoreCssFromHiddenInit,
      getCellFromPoint,
      getCellFromEvent,
      getActiveCell,
      setActiveCell,
      setActiveRow,
      getActiveCellNode,
      getActiveCellPosition,
      resetActiveCell,
      editActiveCell: makeActiveCellEditable,
      getCellEditor,
      getCellNode,
      getCellNodeBox,
      canCellBeSelected,
      canCellBeActive,
      navigatePrev,
      navigateNext,
      navigateUp,
      navigateDown,
      navigateLeft,
      navigateRight,
      navigatePageUp,
      navigatePageDown,
      navigateTop,
      navigateBottom,
      navigateRowStart,
      navigateRowEnd,
      gotoCell,
      getTopPanel,
      getTopPanels,
      setTopPanelVisibility,
      getPreHeaderPanel,
      getPreHeaderPanelLeft: getPreHeaderPanel,
      getPreHeaderPanelRight,
      setPreHeaderPanelVisibility,
      getHeader,
      getHeaderColumn,
      setHeaderRowVisibility,
      getHeaderRow,
      getHeaderRowColumn,
      setFooterRowVisibility,
      getFooterRow,
      getFooterRowColumn,
      getGridPosition,
      flashCell,
      addCellCssStyles,
      setCellCssStyles,
      removeCellCssStyles,
      getCellCssStyles,
      getFrozenRowOffset,
      setColumnHeaderVisibility,
      sanitizeHtmlString,
      getDisplayedScrollbarDimensions,
      getAbsoluteColumnMinWidth,
      init: finishInitialization,
      destroy,
      // IEditor implementation
      getEditorLock,
      getEditController
    }), init();
  }
  window.Slick && Utils.extend(Slick, {
    Grid: SlickGrid
  });
})();
/**
 * @license
 * (c) 2009-2016 Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v4.0.0
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */
