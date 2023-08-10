"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:../slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:../slick.core.js"() {
    }
  });

  // src/plugins/slick.rowdetailview.js
  var require_slick_rowdetailview = __commonJS({
    "src/plugins/slick.rowdetailview.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickRowDetailView = void 0;
      var slick_core_1 = require_slick_core(), SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickRowDetailView = (
        /** @class */
        function() {
          function SlickRowDetailView2(options) {
            this.pluginName = "RowDetailView", this.onAsyncResponse = new SlickEvent(), this.onAsyncEndUpdate = new SlickEvent(), this.onAfterRowDetailToggle = new SlickEvent(), this.onBeforeRowDetailToggle = new SlickEvent(), this.onRowBackToViewportRange = new SlickEvent(), this.onRowOutOfViewportRange = new SlickEvent(), this._gridUid = "", this._dataViewIdProperty = "id", this._expandableOverride = null, this._lastRange = null, this._expandedRows = [], this._outsideRange = 5, this._visibleRenderedCellCount = 0, this._defaults = {
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
            }, this._keyPrefix = this._defaults.keyPrefix, this._gridRowBuffer = 0, this._rowIdsOutOfViewport = [], this._options = Utils.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler(), typeof this._options.expandableOverride == "function" && this.expandableOverride(this._options.expandableOverride);
          }
          return SlickRowDetailView2.prototype.init = function(grid) {
            var _this = this, _a, _b;
            if (!grid)
              throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
            this._grid = grid, this._gridUid = grid.getUID(), this._gridOptions = grid.getOptions() || {}, this._dataView = this._grid.getData(), this._keyPrefix = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.keyPrefix) !== null && _b !== void 0 ? _b : "_", this._gridRowBuffer = this._gridOptions.minRowBuffer, this._gridOptions.minRowBuffer = this._options.panelRows + 3, this._eventHandler.subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onScroll, this.handleScroll.bind(this)), this._options.collapseAllOnSort && (this._eventHandler.subscribe(this._grid.onSort, this.collapseAll.bind(this)), this._expandedRows = [], this._rowIdsOutOfViewport = []), this._eventHandler.subscribe(this._dataView.onRowCountChanged, function() {
              _this._grid.updateRowCount(), _this._grid.render();
            }), this._eventHandler.subscribe(this._dataView.onRowsChanged, function(_e, a) {
              _this._grid.invalidateRows(a.rows), _this._grid.render();
            }), this.subscribeToOnAsyncResponse(), this._eventHandler.subscribe(this._dataView.onSetItemsCalled, function() {
              var _a2, _b2;
              _this._dataViewIdProperty = (_b2 = (_a2 = _this._dataView) === null || _a2 === void 0 ? void 0 : _a2.getIdPropertyName()) !== null && _b2 !== void 0 ? _b2 : "id";
            }), this._options.useSimpleViewportCalc && this._eventHandler.subscribe(this._grid.onRendered, function(_e, args) {
              args != null && args.endRow && (_this._visibleRenderedCellCount = args.endRow - args.startRow);
            });
          }, SlickRowDetailView2.prototype.destroy = function() {
            this._eventHandler.unsubscribeAll(), this.onAsyncResponse.unsubscribe(), this.onAsyncEndUpdate.unsubscribe(), this.onAfterRowDetailToggle.unsubscribe(), this.onBeforeRowDetailToggle.unsubscribe(), this.onRowOutOfViewportRange.unsubscribe(), this.onRowBackToViewportRange.unsubscribe();
          }, SlickRowDetailView2.prototype.getOptions = function() {
            return this._options;
          }, SlickRowDetailView2.prototype.setOptions = function(options) {
            var _a;
            this._options = Utils.extend(!0, {}, this._options, options), !((_a = this._options) === null || _a === void 0) && _a.singleRowExpand && this.collapseAll();
          }, SlickRowDetailView2.prototype.arrayFindIndex = function(sourceArray, value) {
            if (Array.isArray(sourceArray)) {
              for (var i = 0; i < sourceArray.length; i++)
                if (sourceArray[i] === value)
                  return i;
            }
            return -1;
          }, SlickRowDetailView2.prototype.handleClick = function(e, args) {
            var dataContext = this._grid.getDataItem(args.row);
            if (this.checkExpandableOverride(args.row, dataContext, this._grid) && (this._options.useRowClick || this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.classList.contains(this._options.cssClass || ""))) {
              if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
                e.preventDefault(), e.stopImmediatePropagation();
                return;
              }
              this.onBeforeRowDetailToggle.notify({
                grid: this._grid,
                item: dataContext
              }, e, this), this.toggleRowSelection(args.row, dataContext), this.onAfterRowDetailToggle.notify({
                grid: this._grid,
                item: dataContext,
                expandedRows: this._expandedRows
              }, e, this), e.stopPropagation(), e.stopImmediatePropagation();
            }
          }, SlickRowDetailView2.prototype.handleScroll = function() {
            this._options.useSimpleViewportCalc ? this.calculateOutOfRangeViewsSimplerVersion() : this.calculateOutOfRangeViews();
          }, SlickRowDetailView2.prototype.calculateOutOfRangeViews = function() {
            var _this = this, scrollDir = "";
            if (this._grid) {
              var renderedRange_1 = this._grid.getRenderedRange();
              if (this._expandedRows.length > 0 && (scrollDir = "DOWN", this._lastRange)) {
                if (this._lastRange.top === renderedRange_1.top && this._lastRange.bottom === renderedRange_1.bottom)
                  return;
                (this._lastRange.top > renderedRange_1.top || // Or we are at very top but our bottom is increasing
                this._lastRange.top === 0 && renderedRange_1.top === 0 && this._lastRange.bottom > renderedRange_1.bottom) && (scrollDir = "UP");
              }
              this._expandedRows.forEach(function(row) {
                var _a, _b, rowIndex = (_b = (_a = _this._dataView) === null || _a === void 0 ? void 0 : _a.getRowById(row[_this._dataViewIdProperty])) !== null && _b !== void 0 ? _b : 0, rowPadding = row["".concat(_this._keyPrefix, "sizePadding")], rowOutOfRange = _this.arrayFindIndex(_this._rowIdsOutOfViewport, row[_this._dataViewIdProperty]) >= 0;
                scrollDir === "UP" ? (_this._options.saveDetailViewOnScroll && rowIndex >= renderedRange_1.bottom - _this._gridRowBuffer && _this.saveDetailView(row), rowOutOfRange && rowIndex - _this._outsideRange < renderedRange_1.top && rowIndex >= renderedRange_1.top ? _this.notifyBackToViewportWhenDomExist(row, row[_this._dataViewIdProperty]) : !rowOutOfRange && rowIndex + rowPadding > renderedRange_1.bottom && _this.notifyOutOfViewport(row, row[_this._dataViewIdProperty])) : scrollDir === "DOWN" && (_this._options.saveDetailViewOnScroll && rowIndex <= renderedRange_1.top + _this._gridRowBuffer && _this.saveDetailView(row), rowOutOfRange && rowIndex + rowPadding + _this._outsideRange > renderedRange_1.bottom && rowIndex < rowIndex + rowPadding ? _this.notifyBackToViewportWhenDomExist(row, row[_this._dataViewIdProperty]) : !rowOutOfRange && rowIndex < renderedRange_1.top && _this.notifyOutOfViewport(row, row[_this._dataViewIdProperty]));
              }), this._lastRange = renderedRange_1;
            }
          }, SlickRowDetailView2.prototype.calculateOutOfRangeViewsSimplerVersion = function() {
            var _this = this;
            if (this._grid) {
              var renderedRange_2 = this._grid.getRenderedRange();
              this._expandedRows.forEach(function(row) {
                var _a, rowIndex = (_a = _this._dataView.getRowById(row[_this._dataViewIdProperty])) !== null && _a !== void 0 ? _a : -1, isOutOfVisibility = _this.checkIsRowOutOfViewportRange(rowIndex, renderedRange_2);
                !isOutOfVisibility && _this.arrayFindIndex(_this._rowIdsOutOfViewport, row[_this._dataViewIdProperty]) >= 0 ? _this.notifyBackToViewportWhenDomExist(row, row[_this._dataViewIdProperty]) : isOutOfVisibility && _this.notifyOutOfViewport(row, row[_this._dataViewIdProperty]);
              });
            }
          }, SlickRowDetailView2.prototype.checkIsRowOutOfViewportRange = function(rowIndex, renderedRange) {
            return Math.abs(renderedRange.bottom - this._gridRowBuffer - rowIndex) > this._visibleRenderedCellCount * 2;
          }, SlickRowDetailView2.prototype.notifyOutOfViewport = function(item, rowId) {
            var rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
            this.onRowOutOfViewportRange.notify({
              grid: this._grid,
              item,
              rowId,
              rowIndex,
              expandedRows: this._expandedRows,
              rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, !0)
            }, null, this);
          }, SlickRowDetailView2.prototype.notifyBackToViewportWhenDomExist = function(item, rowId) {
            var _this = this, rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
            setTimeout(function() {
              document.querySelector(".".concat(_this._gridUid, " .cellDetailView_").concat(item[_this._dataViewIdProperty])) && _this.onRowBackToViewportRange.notify({
                grid: _this._grid,
                item,
                rowId,
                rowIndex,
                expandedRows: _this._expandedRows,
                rowIdsOutOfViewport: _this.syncOutOfViewportArray(rowId, !1)
              }, null, _this);
            }, 100);
          }, SlickRowDetailView2.prototype.syncOutOfViewportArray = function(rowId, isAdding) {
            var arrayRowIndex = this.arrayFindIndex(this._rowIdsOutOfViewport, rowId);
            return isAdding && arrayRowIndex < 0 ? this._rowIdsOutOfViewport.push(rowId) : !isAdding && arrayRowIndex >= 0 && this._rowIdsOutOfViewport.splice(arrayRowIndex, 1), this._rowIdsOutOfViewport;
          }, SlickRowDetailView2.prototype.toggleRowSelection = function(rowNumber, dataContext) {
            this.checkExpandableOverride(rowNumber, dataContext, this._grid) && (this._dataView.beginUpdate(), this.handleAccordionShowHide(dataContext), this._dataView.endUpdate());
          }, SlickRowDetailView2.prototype.collapseAll = function() {
            this._dataView.beginUpdate();
            for (var i = this._expandedRows.length - 1; i >= 0; i--)
              this.collapseDetailView(this._expandedRows[i], !0);
            this._dataView.endUpdate();
          }, SlickRowDetailView2.prototype.collapseDetailView = function(item, isMultipleCollapsing) {
            var _this = this;
            isMultipleCollapsing === void 0 && (isMultipleCollapsing = !1), isMultipleCollapsing || this._dataView.beginUpdate(), this._options.loadOnce && this.saveDetailView(item), item["".concat(this._keyPrefix, "collapsed")] = !0;
            for (var idx = 1; idx <= item["".concat(this._keyPrefix, "sizePadding")]; idx++)
              this._dataView.deleteItem(item[this._dataViewIdProperty] + "." + idx);
            item["".concat(this._keyPrefix, "sizePadding")] = 0, this._dataView.updateItem(item[this._dataViewIdProperty], item), this._expandedRows = this._expandedRows.filter(function(r) {
              return r[_this._dataViewIdProperty] !== item[_this._dataViewIdProperty];
            }), isMultipleCollapsing || this._dataView.endUpdate();
          }, SlickRowDetailView2.prototype.expandDetailView = function(item) {
            var _a, _b, _c;
            if (!((_a = this._options) === null || _a === void 0) && _a.singleRowExpand && this.collapseAll(), item["".concat(this._keyPrefix, "collapsed")] = !1, this._expandedRows.push(item), item["".concat(this._keyPrefix, "detailContent")] || (item["".concat(this._keyPrefix, "detailViewLoaded")] = !1), !item["".concat(this._keyPrefix, "detailViewLoaded")] || this._options.loadOnce !== !0)
              item["".concat(this._keyPrefix, "detailContent")] = (_c = (_b = this._options) === null || _b === void 0 ? void 0 : _b.preTemplate) === null || _c === void 0 ? void 0 : _c.call(_b, item);
            else {
              this.onAsyncResponse.notify({
                item,
                itemDetail: item,
                detailView: item["".concat(this._keyPrefix, "detailContent")]
              }, void 0, this), this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item);
              return;
            }
            this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item), this._options.process(item);
          }, SlickRowDetailView2.prototype.saveDetailView = function(item) {
            var view = document.querySelector(".".concat(this._gridUid, " .innerDetailView_").concat(item[this._dataViewIdProperty]));
            if (view) {
              var html = view.innerHTML;
              html !== void 0 && (item["".concat(this._keyPrefix, "detailContent")] = html);
            }
          }, SlickRowDetailView2.prototype.subscribeToOnAsyncResponse = function() {
            var _this = this;
            this.onAsyncResponse.subscribe(function(e, args) {
              var _a, _b;
              if (!args || !args.item && !args.itemDetail)
                throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
              var itemDetail = args.item || args.itemDetail;
              args.detailView ? itemDetail["".concat(_this._keyPrefix, "detailContent")] = args.detailView : itemDetail["".concat(_this._keyPrefix, "detailContent")] = (_b = (_a = _this._options) === null || _a === void 0 ? void 0 : _a.postTemplate) === null || _b === void 0 ? void 0 : _b.call(_a, itemDetail), itemDetail["".concat(_this._keyPrefix, "detailViewLoaded")] = !0, _this._dataView.updateItem(itemDetail[_this._dataViewIdProperty], itemDetail), _this.onAsyncEndUpdate.notify({
                grid: _this._grid,
                item: itemDetail,
                itemDetail
              }, e, _this);
            });
          }, SlickRowDetailView2.prototype.handleAccordionShowHide = function(item) {
            item && (item["".concat(this._keyPrefix, "collapsed")] ? this.expandDetailView(item) : this.collapseDetailView(item));
          }, SlickRowDetailView2.prototype.getPaddingItem = function(parent, offset) {
            var item = {};
            for (var prop in this._dataView)
              item[prop] = null;
            return item[this._dataViewIdProperty] = parent[this._dataViewIdProperty] + "." + offset, item["".concat(this._keyPrefix, "collapsed")] = !0, item["".concat(this._keyPrefix, "isPadding")] = !0, item["".concat(this._keyPrefix, "parent")] = parent, item["".concat(this._keyPrefix, "offset")] = offset, item;
          }, SlickRowDetailView2.prototype.applyTemplateNewLineHeight = function(item) {
            var _a, rowCount = this._options.panelRows, lineHeight = 13;
            item["".concat(this._keyPrefix, "sizePadding")] = Math.ceil(rowCount * 2 * lineHeight / this._gridOptions.rowHeight), item["".concat(this._keyPrefix, "height")] = item["".concat(this._keyPrefix, "sizePadding")] * this._gridOptions.rowHeight;
            for (var idxParent = (_a = this._dataView.getIdxById(item[this._dataViewIdProperty])) !== null && _a !== void 0 ? _a : 0, idx = 1; idx <= item["".concat(this._keyPrefix, "sizePadding")]; idx++)
              this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
          }, SlickRowDetailView2.prototype.getColumnDefinition = function() {
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
          }, SlickRowDetailView2.prototype.getExpandedRows = function() {
            return this._expandedRows;
          }, SlickRowDetailView2.prototype.detailSelectionFormatter = function(row, _cell, _val, _column, dataContext, grid) {
            if (this.checkExpandableOverride(row, dataContext, grid)) {
              if (dataContext["".concat(this._keyPrefix, "collapsed")] == null && (dataContext["".concat(this._keyPrefix, "collapsed")] = !0, dataContext["".concat(this._keyPrefix, "sizePadding")] = 0, dataContext["".concat(this._keyPrefix, "height")] = 0, dataContext["".concat(this._keyPrefix, "isPadding")] = !1, dataContext["".concat(this._keyPrefix, "parent")] = void 0, dataContext["".concat(this._keyPrefix, "offset")] = 0), !dataContext["".concat(this._keyPrefix, "isPadding")])
                if (dataContext["".concat(this._keyPrefix, "collapsed")]) {
                  var collapsedClasses = this._options.cssClass + " expand ";
                  return this._options.collapsedClass && (collapsedClasses += this._options.collapsedClass), '<div class="' + collapsedClasses + '"></div>';
                } else {
                  var html = [], rowHeight = this._gridOptions.rowHeight, outterHeight = dataContext["".concat(this._keyPrefix, "sizePadding")] * this._gridOptions.rowHeight;
                  this._options.maxRows !== void 0 && dataContext["".concat(this._keyPrefix, "sizePadding")] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, dataContext["".concat(this._keyPrefix, "sizePadding")] = this._options.maxRows);
                  var expandedClasses = this._options.cssClass + " collapse ";
                  return this._options.expandedClass && (expandedClasses += this._options.expandedClass), html.push('<div class="' + expandedClasses + '"></div></div>'), html.push('<div class="dynamic-cell-detail cellDetailView_'.concat(dataContext[this._dataViewIdProperty], '" ')), html.push('style="height: '.concat(outterHeight, "px;")), html.push("top: ".concat(rowHeight, 'px">')), html.push('<div class="detail-container detailViewContainer_'.concat(dataContext[this._dataViewIdProperty], '">')), html.push('<div class="innerDetailView_'.concat(dataContext[this._dataViewIdProperty], '">').concat(dataContext["".concat(this._keyPrefix, "detailContent")], "</div></div>")), html.join("");
                }
            } else
              return "";
            return "";
          }, SlickRowDetailView2.prototype.resizeDetailView = function(item) {
            var _a;
            if (item) {
              var mainContainer = document.querySelector(".".concat(this._gridUid, " .detailViewContainer_").concat(item[this._dataViewIdProperty])), cellItem = document.querySelector(".".concat(this._gridUid, " .cellDetailView_").concat(item[this._dataViewIdProperty])), inner = document.querySelector(".".concat(this._gridUid, " .innerDetailView_").concat(item[this._dataViewIdProperty]));
              if (!(!mainContainer || !cellItem || !inner)) {
                for (var idx = 1; idx <= item["".concat(this._keyPrefix, "sizePadding")]; idx++)
                  this._dataView.deleteItem("".concat(item[this._dataViewIdProperty], ".").concat(idx));
                var rowHeight = this._gridOptions.rowHeight, lineHeight = 13;
                mainContainer.style.minHeight = "";
                var itemHeight = mainContainer.scrollHeight, rowCount = Math.ceil(itemHeight / rowHeight);
                item["".concat(this._keyPrefix, "sizePadding")] = Math.ceil(rowCount * 2 * lineHeight / rowHeight), item["".concat(this._keyPrefix, "height")] = itemHeight;
                var outterHeight = item["".concat(this._keyPrefix, "sizePadding")] * rowHeight;
                this._options.maxRows !== void 0 && item["".concat(this._keyPrefix, "sizePadding")] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, item["".concat(this._keyPrefix, "sizePadding")] = this._options.maxRows), this._grid.getOptions().minRowBuffer < item["".concat(this._keyPrefix, "sizePadding")] && (this._grid.getOptions().minRowBuffer = item["".concat(this._keyPrefix, "sizePadding")] + 3), mainContainer.setAttribute("style", "min-height: " + item["".concat(this._keyPrefix, "height")] + "px"), cellItem && cellItem.setAttribute("style", "height: " + outterHeight + "px; top:" + rowHeight + "px");
                for (var idxParent = (_a = this._dataView.getIdxById(item[this._dataViewIdProperty])) !== null && _a !== void 0 ? _a : 0, idx = 1; idx <= item["".concat(this._keyPrefix, "sizePadding")]; idx++)
                  this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
                this.saveDetailView(item);
              }
            }
          }, SlickRowDetailView2.prototype.getFilterItem = function(item) {
            return item["".concat(this._keyPrefix, "isPadding")] && item["".concat(this._keyPrefix, "parent")] && (item = item["".concat(this._keyPrefix, "parent")]), item;
          }, SlickRowDetailView2.prototype.checkExpandableOverride = function(row, dataContext, grid) {
            return typeof this._expandableOverride == "function" ? this._expandableOverride(row, dataContext, grid) : !0;
          }, SlickRowDetailView2.prototype.expandableOverride = function(overrideFn) {
            this._expandableOverride = overrideFn;
          }, SlickRowDetailView2;
        }()
      );
      exports.SlickRowDetailView = SlickRowDetailView;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          Plugins: {
            RowDetailView: SlickRowDetailView
          }
        }
      });
    }
  });
  require_slick_rowdetailview();
})();
//# sourceMappingURL=slick.rowdetailview.js.map
