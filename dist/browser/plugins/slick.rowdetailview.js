"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.rowdetailview.ts
  var SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickRowDetailView = class {
    /** Constructor of the Row Detail View Plugin which accepts optional options */
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "RowDetailView");
      __publicField(this, "onAsyncResponse", new SlickEvent("onAsyncResponse"));
      __publicField(this, "onAsyncEndUpdate", new SlickEvent("onAsyncEndUpdate"));
      __publicField(this, "onAfterRowDetailToggle", new SlickEvent("onAfterRowDetailToggle"));
      __publicField(this, "onBeforeRowDetailToggle", new SlickEvent("onBeforeRowDetailToggle"));
      __publicField(this, "onRowBackToViewportRange", new SlickEvent("onRowBackToViewportRange"));
      __publicField(this, "onRowOutOfViewportRange", new SlickEvent("onRowOutOfViewportRange"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_dataView");
      __publicField(this, "_dataViewIdProperty", "id");
      __publicField(this, "_expandableOverride", null);
      __publicField(this, "_lastRange", null);
      __publicField(this, "_expandedRows", []);
      __publicField(this, "_eventHandler");
      __publicField(this, "_outsideRange", 5);
      __publicField(this, "_visibleRenderedCellCount", 0);
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        columnId: "_detail_selector",
        cssClass: "detailView-toggle",
        expandedClass: void 0,
        collapsedClass: void 0,
        keyPrefix: "_",
        loadOnce: !1,
        collapseAllOnSort: !0,
        saveDetailViewOnScroll: !0,
        singleRowExpand: !1,
        useSimpleViewportCalc: !1,
        alwaysRenderColumn: !0,
        toolTip: "",
        width: 30,
        maxRows: void 0
      });
      __publicField(this, "_keyPrefix", this._defaults.keyPrefix);
      __publicField(this, "_gridRowBuffer", 0);
      __publicField(this, "_rowIdsOutOfViewport", []);
      this._options = Utils.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler(), typeof this._options.expandableOverride == "function" && this.expandableOverride(this._options.expandableOverride);
    }
    /**
     * Initialize the plugin, which requires user to pass the SlickGrid Grid object
     * @param grid: SlickGrid Grid object
     */
    init(grid) {
      var _a, _b;
      if (!grid)
        throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
      this._grid = grid, this._gridUid = grid.getUID(), this._gridOptions = grid.getOptions() || {}, this._dataView = this._grid.getData(), this._keyPrefix = (_b = (_a = this._options) == null ? void 0 : _a.keyPrefix) != null ? _b : "_", Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._gridRowBuffer = this._gridOptions.minRowBuffer || 0, this._gridOptions.minRowBuffer = this._options.panelRows + 3, this._eventHandler.subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onScroll, this.handleScroll.bind(this)), this._options.collapseAllOnSort && (this._eventHandler.subscribe(this._grid.onSort, this.collapseAll.bind(this)), this._expandedRows = [], this._rowIdsOutOfViewport = []), this._eventHandler.subscribe(this._dataView.onRowCountChanged, () => {
        this._grid.updateRowCount(), this._grid.render();
      }), this._eventHandler.subscribe(this._dataView.onRowsChanged, (_e, a) => {
        this._grid.invalidateRows(a.rows), this._grid.render();
      }), this.subscribeToOnAsyncResponse(), this._eventHandler.subscribe(this._dataView.onSetItemsCalled, () => {
        var _a2, _b2;
        this._dataViewIdProperty = (_b2 = (_a2 = this._dataView) == null ? void 0 : _a2.getIdPropertyName()) != null ? _b2 : "id";
      }), this._options.useSimpleViewportCalc && this._eventHandler.subscribe(this._grid.onRendered, (_e, args) => {
        args != null && args.endRow && (this._visibleRenderedCellCount = args.endRow - args.startRow);
      });
    }
    /** destroy the plugin and it's events */
    destroy() {
      this._eventHandler.unsubscribeAll(), this.onAsyncResponse.unsubscribe(), this.onAsyncEndUpdate.unsubscribe(), this.onAfterRowDetailToggle.unsubscribe(), this.onBeforeRowDetailToggle.unsubscribe(), this.onRowOutOfViewportRange.unsubscribe(), this.onRowBackToViewportRange.unsubscribe();
    }
    /** Get current plugin options */
    getOptions() {
      return this._options;
    }
    /** set or change some of the plugin options */
    setOptions(options) {
      var _a;
      this._options = Utils.extend(!0, {}, this._options, options), (_a = this._options) != null && _a.singleRowExpand && this.collapseAll();
    }
    /** Find a value in an array and return the index when (or -1 when not found) */
    arrayFindIndex(sourceArray, value) {
      if (Array.isArray(sourceArray)) {
        for (let i = 0; i < sourceArray.length; i++)
          if (sourceArray[i] === value)
            return i;
      }
      return -1;
    }
    /** Handle mouse click event */
    handleClick(e, args) {
      let dataContext = this._grid.getDataItem(args.row);
      if (this.checkExpandableOverride(args.row, dataContext, this._grid) && (this._options.useRowClick || this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.classList.contains(this._options.cssClass || ""))) {
        if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        if (this.onBeforeRowDetailToggle.notify({ grid: this._grid, item: dataContext }, e, this).getReturnValue() === !1)
          return;
        this.toggleRowSelection(args.row, dataContext), this.onAfterRowDetailToggle.notify({
          grid: this._grid,
          item: dataContext,
          expandedRows: this._expandedRows
        }, e, this), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    /** If we scroll save detail views that go out of cache range */
    handleScroll() {
      this._options.useSimpleViewportCalc ? this.calculateOutOfRangeViewsSimplerVersion() : this.calculateOutOfRangeViews();
    }
    /** Calculate when expanded rows become out of view range */
    calculateOutOfRangeViews() {
      let scrollDir = "";
      if (this._grid) {
        let renderedRange = this._grid.getRenderedRange();
        if (this._expandedRows.length > 0 && (scrollDir = "DOWN", this._lastRange)) {
          if (this._lastRange.top === renderedRange.top && this._lastRange.bottom === renderedRange.bottom)
            return;
          (this._lastRange.top > renderedRange.top || // Or we are at very top but our bottom is increasing
          this._lastRange.top === 0 && renderedRange.top === 0 && this._lastRange.bottom > renderedRange.bottom) && (scrollDir = "UP");
        }
        this._expandedRows.forEach((row) => {
          var _a, _b;
          let rowIndex = (_b = (_a = this._dataView) == null ? void 0 : _a.getRowById(row[this._dataViewIdProperty])) != null ? _b : 0, rowPadding = row[`${this._keyPrefix}sizePadding`], rowOutOfRange = this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0;
          scrollDir === "UP" ? (this._options.saveDetailViewOnScroll && rowIndex >= renderedRange.bottom - this._gridRowBuffer && this.saveDetailView(row), rowOutOfRange && rowIndex - this._outsideRange < renderedRange.top && rowIndex >= renderedRange.top ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : !rowOutOfRange && rowIndex + rowPadding > renderedRange.bottom && this.notifyOutOfViewport(row, row[this._dataViewIdProperty])) : scrollDir === "DOWN" && (this._options.saveDetailViewOnScroll && rowIndex <= renderedRange.top + this._gridRowBuffer && this.saveDetailView(row), rowOutOfRange && rowIndex + rowPadding + this._outsideRange > renderedRange.bottom && rowIndex < rowIndex + rowPadding ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : !rowOutOfRange && rowIndex < renderedRange.top && this.notifyOutOfViewport(row, row[this._dataViewIdProperty]));
        }), this._lastRange = renderedRange;
      }
    }
    /** This is an alternative & more simpler version of the Calculate when expanded rows become out of view range */
    calculateOutOfRangeViewsSimplerVersion() {
      if (this._grid) {
        let renderedRange = this._grid.getRenderedRange();
        this._expandedRows.forEach((row) => {
          var _a;
          let rowIndex = (_a = this._dataView.getRowById(row[this._dataViewIdProperty])) != null ? _a : -1, isOutOfVisibility = this.checkIsRowOutOfViewportRange(rowIndex, renderedRange);
          !isOutOfVisibility && this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0 ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : isOutOfVisibility && this.notifyOutOfViewport(row, row[this._dataViewIdProperty]);
        });
      }
    }
    /**
     * Check if the row became out of visible range (when user can't see it anymore)
     * @param rowIndex
     * @param renderedRange from SlickGrid
     */
    checkIsRowOutOfViewportRange(rowIndex, renderedRange) {
      return Math.abs(renderedRange.bottom - this._gridRowBuffer - rowIndex) > this._visibleRenderedCellCount * 2;
    }
    /** Send a notification, through "onRowOutOfViewportRange", that is out of the viewport range */
    notifyOutOfViewport(item, rowId) {
      let rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
      this.onRowOutOfViewportRange.notify({
        grid: this._grid,
        item,
        rowId,
        rowIndex,
        expandedRows: this._expandedRows,
        rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, !0)
      }, null, this);
    }
    /** Send a notification, through "onRowBackToViewportRange", that a row came back into the viewport visible range */
    notifyBackToViewportWhenDomExist(item, rowId) {
      let rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
      setTimeout(() => {
        document.querySelector(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`) && this.onRowBackToViewportRange.notify({
          grid: this._grid,
          item,
          rowId,
          rowIndex,
          expandedRows: this._expandedRows,
          rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, !1)
        }, null, this);
      }, 100);
    }
    /**
     * This function will sync the "out of viewport" array whenever necessary.
     * The sync can add a detail row (when necessary, no need to add again if it already exist) or delete a row from the array.
     * @param rowId: number
     * @param isAdding: are we adding or removing a row?
     */
    syncOutOfViewportArray(rowId, isAdding) {
      let arrayRowIndex = this.arrayFindIndex(this._rowIdsOutOfViewport, rowId);
      return isAdding && arrayRowIndex < 0 ? this._rowIdsOutOfViewport.push(rowId) : !isAdding && arrayRowIndex >= 0 && this._rowIdsOutOfViewport.splice(arrayRowIndex, 1), this._rowIdsOutOfViewport;
    }
    // Toggle between showing or hiding a row
    toggleRowSelection(rowNumber, dataContext) {
      this.checkExpandableOverride(rowNumber, dataContext, this._grid) && (this._dataView.beginUpdate(), this.handleAccordionShowHide(dataContext), this._dataView.endUpdate());
    }
    /** Collapse all of the open detail rows */
    collapseAll() {
      this._dataView.beginUpdate();
      for (let i = this._expandedRows.length - 1; i >= 0; i--)
        this.collapseDetailView(this._expandedRows[i], !0);
      this._dataView.endUpdate();
    }
    /** Collapse a detail row so that it is not longer open */
    collapseDetailView(item, isMultipleCollapsing = !1) {
      isMultipleCollapsing || this._dataView.beginUpdate(), this._options.loadOnce && this.saveDetailView(item), item[`${this._keyPrefix}collapsed`] = !0;
      for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
        this._dataView.deleteItem(item[this._dataViewIdProperty] + "." + idx);
      item[`${this._keyPrefix}sizePadding`] = 0, this._dataView.updateItem(item[this._dataViewIdProperty], item), this._expandedRows = this._expandedRows.filter((r) => r[this._dataViewIdProperty] !== item[this._dataViewIdProperty]), isMultipleCollapsing || this._dataView.endUpdate();
    }
    /** Expand a detail row by providing the dataview item that is to be expanded */
    expandDetailView(item) {
      var _a, _b, _c;
      if ((_a = this._options) != null && _a.singleRowExpand && this.collapseAll(), item[`${this._keyPrefix}collapsed`] = !1, this._expandedRows.push(item), item[`${this._keyPrefix}detailContent`] || (item[`${this._keyPrefix}detailViewLoaded`] = !1), !item[`${this._keyPrefix}detailViewLoaded`] || this._options.loadOnce !== !0)
        item[`${this._keyPrefix}detailContent`] = (_c = (_b = this._options) == null ? void 0 : _b.preTemplate) == null ? void 0 : _c.call(_b, item);
      else {
        this.onAsyncResponse.notify({
          item,
          itemDetail: item,
          detailView: item[`${this._keyPrefix}detailContent`]
        }, void 0, this), this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item);
        return;
      }
      this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item), this._options.process(item);
    }
    /** Saves the current state of the detail view */
    saveDetailView(item) {
      let view = document.querySelector(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);
      if (view) {
        let html = view.innerHTML;
        html !== void 0 && (item[`${this._keyPrefix}detailContent`] = html);
      }
    }
    /**
     * subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
     * the response has to be as "args.item" (or "args.itemDetail") with it's data back
     */
    subscribeToOnAsyncResponse() {
      this.onAsyncResponse.subscribe((e, args) => {
        var _a, _b;
        if (!args || !args.item && !args.itemDetail)
          throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
        let itemDetail = args.item || args.itemDetail;
        args.detailView ? itemDetail[`${this._keyPrefix}detailContent`] = args.detailView : itemDetail[`${this._keyPrefix}detailContent`] = (_b = (_a = this._options) == null ? void 0 : _a.postTemplate) == null ? void 0 : _b.call(_a, itemDetail), itemDetail[`${this._keyPrefix}detailViewLoaded`] = !0, this._dataView.updateItem(itemDetail[this._dataViewIdProperty], itemDetail), this.onAsyncEndUpdate.notify({
          grid: this._grid,
          item: itemDetail,
          itemDetail
        }, e, this);
      });
    }
    /** When row is getting toggled, we will handle the action of collapsing/expanding */
    handleAccordionShowHide(item) {
      item && (item[`${this._keyPrefix}collapsed`] ? this.expandDetailView(item) : this.collapseDetailView(item));
    }
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    /** Get the Row Detail padding (which are the rows dedicated to the detail panel) */
    getPaddingItem(parent, offset) {
      let item = {};
      for (let prop in this._dataView)
        item[prop] = null;
      return item[this._dataViewIdProperty] = parent[this._dataViewIdProperty] + "." + offset, item[`${this._keyPrefix}collapsed`] = !0, item[`${this._keyPrefix}isPadding`] = !0, item[`${this._keyPrefix}parent`] = parent, item[`${this._keyPrefix}offset`] = offset, item;
    }
    /** Create the detail ctr node. this belongs to the dev & can be custom-styled as per */
    applyTemplateNewLineHeight(item) {
      var _a;
      let rowCount = this._options.panelRows, lineHeight = 13;
      item[`${this._keyPrefix}sizePadding`] = Math.ceil(rowCount * 2 * lineHeight / this._gridOptions.rowHeight), item[`${this._keyPrefix}height`] = item[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight;
      let idxParent = (_a = this._dataView.getIdxById(item[this._dataViewIdProperty])) != null ? _a : 0;
      for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
        this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
    }
    /** Get the Column Definition of the first column dedicated to toggling the Row Detail View */
    getColumnDefinition() {
      return {
        id: this._options.columnId,
        name: "",
        toolTip: this._options.toolTip,
        field: "sel",
        width: this._options.width,
        resizable: !1,
        sortable: !1,
        alwaysRenderColumn: this._options.alwaysRenderColumn,
        cssClass: this._options.cssClass,
        formatter: this.detailSelectionFormatter.bind(this)
      };
    }
    /** Return the currently expanded rows */
    getExpandedRows() {
      return this._expandedRows;
    }
    /** The cell Formatter that shows the icon that will be used to toggle the Row Detail */
    detailSelectionFormatter(row, _cell, _val, _column, dataContext, grid) {
      if (this.checkExpandableOverride(row, dataContext, grid)) {
        if (dataContext[`${this._keyPrefix}collapsed`] === void 0 && (dataContext[`${this._keyPrefix}collapsed`] = !0, dataContext[`${this._keyPrefix}sizePadding`] = 0, dataContext[`${this._keyPrefix}height`] = 0, dataContext[`${this._keyPrefix}isPadding`] = !1, dataContext[`${this._keyPrefix}parent`] = void 0, dataContext[`${this._keyPrefix}offset`] = 0), !dataContext[`${this._keyPrefix}isPadding`])
          if (dataContext[`${this._keyPrefix}collapsed`]) {
            let collapsedClasses = this._options.cssClass + " expand ";
            return this._options.collapsedClass && (collapsedClasses += this._options.collapsedClass), Utils.createDomElement("div", { className: collapsedClasses });
          } else {
            let rowHeight = this._gridOptions.rowHeight, outterHeight = dataContext[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight;
            this._options.maxRows !== void 0 && dataContext[`${this._keyPrefix}sizePadding`] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, dataContext[`${this._keyPrefix}sizePadding`] = this._options.maxRows);
            let expandedClasses = this._options.cssClass + " collapse ";
            this._options.expandedClass && (expandedClasses += this._options.expandedClass);
            let cellDetailContainerElm = Utils.createDomElement("div", {
              className: `dynamic-cell-detail cellDetailView_${dataContext[this._dataViewIdProperty]}`,
              style: { height: `${outterHeight}px`, top: `${rowHeight}px` }
            }), innerContainerElm = Utils.createDomElement("div", { className: `detail-container detailViewContainer_${dataContext[this._dataViewIdProperty]}` }), innerDetailViewElm = Utils.createDomElement("div", { className: `innerDetailView_${dataContext[this._dataViewIdProperty]}` });
            return innerDetailViewElm.innerHTML = this._grid.sanitizeHtmlString(dataContext[`${this._keyPrefix}detailContent`]), innerContainerElm.appendChild(innerDetailViewElm), cellDetailContainerElm.appendChild(innerContainerElm), {
              html: Utils.createDomElement("div", { className: expandedClasses }),
              insertElementAfterTarget: cellDetailContainerElm
            };
          }
      } else
        return "";
      return "";
    }
    /** Resize the Row Detail View */
    resizeDetailView(item) {
      var _a;
      if (!item)
        return;
      let mainContainer = document.querySelector(`.${this._gridUid} .detailViewContainer_${item[this._dataViewIdProperty]}`), cellItem = document.querySelector(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`), inner = document.querySelector(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);
      if (!mainContainer || !cellItem || !inner)
        return;
      for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
        this._dataView.deleteItem(`${item[this._dataViewIdProperty]}.${idx}`);
      let rowHeight = this._gridOptions.rowHeight, lineHeight = 13;
      mainContainer.style.minHeight = "";
      let itemHeight = mainContainer.scrollHeight, rowCount = Math.ceil(itemHeight / rowHeight);
      item[`${this._keyPrefix}sizePadding`] = Math.ceil(rowCount * 2 * lineHeight / rowHeight), item[`${this._keyPrefix}height`] = itemHeight;
      let outterHeight = item[`${this._keyPrefix}sizePadding`] * rowHeight;
      this._options.maxRows !== void 0 && item[`${this._keyPrefix}sizePadding`] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, item[`${this._keyPrefix}sizePadding`] = this._options.maxRows), this._grid.getOptions().minRowBuffer < item[`${this._keyPrefix}sizePadding`] && (this._grid.getOptions().minRowBuffer = item[`${this._keyPrefix}sizePadding`] + 3), mainContainer.setAttribute("style", "min-height: " + item[`${this._keyPrefix}height`] + "px"), cellItem && cellItem.setAttribute("style", "height: " + outterHeight + "px; top:" + rowHeight + "px");
      let idxParent = (_a = this._dataView.getIdxById(item[this._dataViewIdProperty])) != null ? _a : 0;
      for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
        this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
      this.saveDetailView(item);
    }
    /** Takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on */
    getFilterItem(item) {
      return item[`${this._keyPrefix}isPadding`] && item[`${this._keyPrefix}parent`] && (item = item[`${this._keyPrefix}parent`]), item;
    }
    checkExpandableOverride(row, dataContext, grid) {
      return typeof this._expandableOverride == "function" ? this._expandableOverride(row, dataContext, grid) : !0;
    }
    /**
     * Method that user can pass to override the default behavior or making every row an expandable row.
     * In order word, user can choose which rows to be an available row detail (or not) by providing his own logic.
     * @param overrideFn: override function callback
     */
    expandableOverride(overrideFn) {
      this._expandableOverride = overrideFn;
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        RowDetailView: SlickRowDetailView
      }
    }
  });
})();
//# sourceMappingURL=slick.rowdetailview.js.map
