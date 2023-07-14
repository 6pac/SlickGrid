"use strict";
(() => {
  // src/plugins/slick.rowdetailview.js
  var SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function RowDetailView(options) {
    var _grid, _gridOptions, _gridUid, _dataView, _dataViewIdProperty = "id", _expandableOverride = null, _self = this, _lastRange = null, _expandedRows = [], _handler = new EventHandler(), _outsideRange = 5, _visibleRenderedCellCount = 0, _defaults = {
      columnId: "_detail_selector",
      cssClass: "detailView-toggle",
      expandedClass: null,
      collapsedClass: null,
      keyPrefix: "_",
      loadOnce: !1,
      collapseAllOnSort: !0,
      saveDetailViewOnScroll: !0,
      singleRowExpand: !1,
      useSimpleViewportCalc: !1,
      alwaysRenderColumn: !0,
      toolTip: "",
      width: 30,
      maxRows: null
    }, _keyPrefix = _defaults.keyPrefix, _gridRowBuffer = 0, _rowIdsOutOfViewport = [], _options = Utils.extend(!0, {}, _defaults, options);
    typeof _options.expandableOverride == "function" && expandableOverride(_options.expandableOverride);
    function init(grid) {
      if (!grid)
        throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
      _grid = grid, _gridUid = grid.getUID(), _gridOptions = grid.getOptions() || {}, _dataView = _grid.getData(), _keyPrefix = _options && _options.keyPrefix || "_", _gridRowBuffer = _grid.getOptions().minRowBuffer, _grid.getOptions().minRowBuffer = _options.panelRows + 3, _handler.subscribe(_grid.onClick, handleClick).subscribe(_grid.onScroll, handleScroll), _options.collapseAllOnSort && (_handler.subscribe(_grid.onSort, collapseAll), _expandedRows = [], _rowIdsOutOfViewport = []), _handler.subscribe(_grid.getData().onRowCountChanged, function() {
        _grid.updateRowCount(), _grid.render();
      }), _handler.subscribe(_grid.getData().onRowsChanged, function(e, a) {
        _grid.invalidateRows(a.rows), _grid.render();
      }), subscribeToOnAsyncResponse(), _handler.subscribe(_dataView.onSetItemsCalled, function() {
        _dataViewIdProperty = _dataView && _dataView.getIdPropertyName() || "id";
      }), _options.useSimpleViewportCalc && _handler.subscribe(_grid.onRendered, function(e, args) {
        args && args.endRow && (_visibleRenderedCellCount = args.endRow - args.startRow);
      });
    }
    function destroy() {
      _handler.unsubscribeAll(), _self.onAsyncResponse.unsubscribe(), _self.onAsyncEndUpdate.unsubscribe(), _self.onAfterRowDetailToggle.unsubscribe(), _self.onBeforeRowDetailToggle.unsubscribe(), _self.onRowOutOfViewportRange.unsubscribe(), _self.onRowBackToViewportRange.unsubscribe();
    }
    function getOptions() {
      return _options;
    }
    function setOptions(options2) {
      _options = Utils.extend(!0, {}, _options, options2), _options && _options.singleRowExpand && collapseAll();
    }
    function arrayFindIndex(sourceArray, value) {
      if (sourceArray) {
        for (var i = 0; i < sourceArray.length; i++)
          if (sourceArray[i] === value)
            return i;
      }
      return -1;
    }
    function handleClick(e, args) {
      var dataContext = _grid.getDataItem(args.row);
      if (checkExpandableOverride(args.row, dataContext, _grid) && (_options.useRowClick || _grid.getColumns()[args.cell].id === _options.columnId && e.target.classList.contains(_options.cssClass || ""))) {
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        _self.onBeforeRowDetailToggle.notify({
          grid: _grid,
          item: dataContext
        }, e, _self), toggleRowSelection(args.row, dataContext), _self.onAfterRowDetailToggle.notify({
          grid: _grid,
          item: dataContext,
          expandedRows: _expandedRows
        }, e, _self), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    function handleScroll() {
      _options.useSimpleViewportCalc ? calculateOutOfRangeViewsSimplerVersion() : calculateOutOfRangeViews();
    }
    function calculateOutOfRangeViews() {
      if (_grid) {
        var renderedRange = _grid.getRenderedRange();
        if (_expandedRows.length > 0) {
          var scrollDir = "DOWN";
          if (_lastRange) {
            if (_lastRange.top === renderedRange.top && _lastRange.bottom === renderedRange.bottom)
              return;
            (_lastRange.top > renderedRange.top || // Or we are at very top but our bottom is increasing
            _lastRange.top === 0 && renderedRange.top === 0 && _lastRange.bottom > renderedRange.bottom) && (scrollDir = "UP");
          }
        }
        _expandedRows.forEach(function(row) {
          var rowIndex = _dataView.getRowById(row[_dataViewIdProperty]), rowPadding = row[_keyPrefix + "sizePadding"], rowOutOfRange = arrayFindIndex(_rowIdsOutOfViewport, row[_dataViewIdProperty]) >= 0;
          scrollDir === "UP" ? (_options.saveDetailViewOnScroll && rowIndex >= renderedRange.bottom - _gridRowBuffer && saveDetailView(row), rowOutOfRange && rowIndex - _outsideRange < renderedRange.top && rowIndex >= renderedRange.top ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : !rowOutOfRange && rowIndex + rowPadding > renderedRange.bottom && notifyOutOfViewport(row, row[_dataViewIdProperty])) : scrollDir === "DOWN" && (_options.saveDetailViewOnScroll && rowIndex <= renderedRange.top + _gridRowBuffer && saveDetailView(row), rowOutOfRange && rowIndex + rowPadding + _outsideRange > renderedRange.bottom && rowIndex < rowIndex + rowPadding ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : !rowOutOfRange && rowIndex < renderedRange.top && notifyOutOfViewport(row, row[_dataViewIdProperty]));
        }), _lastRange = renderedRange;
      }
    }
    function calculateOutOfRangeViewsSimplerVersion() {
      if (_grid) {
        var renderedRange = _grid.getRenderedRange();
        _expandedRows.forEach(function(row) {
          var rowIndex = _dataView.getRowById(row[_dataViewIdProperty]), isOutOfVisibility = checkIsRowOutOfViewportRange(rowIndex, renderedRange);
          !isOutOfVisibility && arrayFindIndex(_rowIdsOutOfViewport, row[_dataViewIdProperty]) >= 0 ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : isOutOfVisibility && notifyOutOfViewport(row, row[_dataViewIdProperty]);
        });
      }
    }
    function checkIsRowOutOfViewportRange(rowIndex, renderedRange) {
      return Math.abs(renderedRange.bottom - _gridRowBuffer - rowIndex) > _visibleRenderedCellCount * 2;
    }
    function notifyOutOfViewport(item, rowId) {
      var rowIndex = item.rowIndex || _dataView.getRowById(item[_dataViewIdProperty]);
      _self.onRowOutOfViewportRange.notify({
        grid: _grid,
        item,
        rowId,
        rowIndex,
        expandedRows: _expandedRows,
        rowIdsOutOfViewport: syncOutOfViewportArray(rowId, !0)
      }, null, _self);
    }
    function notifyBackToViewportWhenDomExist(item, rowId) {
      var rowIndex = item.rowIndex || _dataView.getRowById(item[_dataViewIdProperty]);
      setTimeout(function() {
        document.querySelector(`.${_gridUid} .cellDetailView_${item[_dataViewIdProperty]}`) && _self.onRowBackToViewportRange.notify({
          grid: _grid,
          item,
          rowId,
          rowIndex,
          expandedRows: _expandedRows,
          rowIdsOutOfViewport: syncOutOfViewportArray(rowId, !1)
        }, null, _self);
      }, 100);
    }
    function syncOutOfViewportArray(rowId, isAdding) {
      var arrayRowIndex = arrayFindIndex(_rowIdsOutOfViewport, rowId);
      return isAdding && arrayRowIndex < 0 ? _rowIdsOutOfViewport.push(rowId) : !isAdding && arrayRowIndex >= 0 && _rowIdsOutOfViewport.splice(arrayRowIndex, 1), _rowIdsOutOfViewport;
    }
    function toggleRowSelection(rowNumber, dataContext) {
      checkExpandableOverride(rowNumber, dataContext, _grid) && (_dataView.beginUpdate(), handleAccordionShowHide(dataContext), _dataView.endUpdate());
    }
    function collapseAll() {
      _dataView.beginUpdate();
      for (var i = _expandedRows.length - 1; i >= 0; i--)
        collapseDetailView(_expandedRows[i], !0);
      _dataView.endUpdate();
    }
    function collapseDetailView(item, isMultipleCollapsing) {
      isMultipleCollapsing || _dataView.beginUpdate(), _options.loadOnce && saveDetailView(item), item[_keyPrefix + "collapsed"] = !0;
      for (var idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
        _dataView.deleteItem(item[_dataViewIdProperty] + "." + idx);
      item[_keyPrefix + "sizePadding"] = 0, _dataView.updateItem(item[_dataViewIdProperty], item), _expandedRows = _expandedRows.filter(function(r) {
        return r[_dataViewIdProperty] !== item[_dataViewIdProperty];
      }), isMultipleCollapsing || _dataView.endUpdate();
    }
    function expandDetailView(item) {
      if (_options && _options.singleRowExpand && collapseAll(), item[_keyPrefix + "collapsed"] = !1, _expandedRows.push(item), item[_keyPrefix + "detailContent"] || (item[_keyPrefix + "detailViewLoaded"] = !1), !item[_keyPrefix + "detailViewLoaded"] || _options.loadOnce !== !0)
        item[_keyPrefix + "detailContent"] = _options.preTemplate(item);
      else {
        _self.onAsyncResponse.notify({
          item,
          itemDetail: item,
          detailView: item[_keyPrefix + "detailContent"]
        }, void 0, this), applyTemplateNewLineHeight(item), _dataView.updateItem(item[_dataViewIdProperty], item);
        return;
      }
      applyTemplateNewLineHeight(item), _dataView.updateItem(item[_dataViewIdProperty], item), _options.process(item);
    }
    function saveDetailView(item) {
      let view = document.querySelector(`.${_gridUid} .innerDetailView_${item[_dataViewIdProperty]}`);
      if (view) {
        let html = view.innerHTML;
        html !== void 0 && (item[`${_keyPrefix}detailContent`] = html);
      }
    }
    function subscribeToOnAsyncResponse() {
      _self.onAsyncResponse.subscribe(function(e, args) {
        if (!args || !args.item && !args.itemDetail)
          throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
        var itemDetail = args.item || args.itemDetail;
        args.detailView ? itemDetail[_keyPrefix + "detailContent"] = args.detailView : itemDetail[_keyPrefix + "detailContent"] = _options.postTemplate(itemDetail), itemDetail[_keyPrefix + "detailViewLoaded"] = !0, _dataView.updateItem(itemDetail[_dataViewIdProperty], itemDetail), _self.onAsyncEndUpdate.notify({
          grid: _grid,
          item: itemDetail,
          itemDetail
        }, e, _self);
      });
    }
    function handleAccordionShowHide(item) {
      item && (item[_keyPrefix + "collapsed"] ? expandDetailView(item) : collapseDetailView(item));
    }
    var getPaddingItem = function(parent, offset) {
      var item = {};
      for (var prop in _grid.getData())
        item[prop] = null;
      return item[_dataViewIdProperty] = parent[_dataViewIdProperty] + "." + offset, item[_keyPrefix + "collapsed"] = !0, item[_keyPrefix + "isPadding"] = !0, item[_keyPrefix + "parent"] = parent, item[_keyPrefix + "offset"] = offset, item;
    };
    function applyTemplateNewLineHeight(item) {
      var rowCount = _options.panelRows, lineHeight = 13;
      item[_keyPrefix + "sizePadding"] = Math.ceil(rowCount * 2 * lineHeight / _gridOptions.rowHeight), item[_keyPrefix + "height"] = item[_keyPrefix + "sizePadding"] * _gridOptions.rowHeight;
      for (var idxParent = _dataView.getIdxById(item[_dataViewIdProperty]), idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
        _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
    }
    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: !1,
        sortable: !1,
        alwaysRenderColumn: _options.alwaysRenderColumn,
        cssClass: _options.cssClass,
        formatter: detailSelectionFormatter
      };
    }
    function getExpandedRows() {
      return _expandedRows;
    }
    function detailSelectionFormatter(row, cell, value, columnDef, dataContext, grid) {
      if (checkExpandableOverride(row, dataContext, grid)) {
        if (dataContext[_keyPrefix + "collapsed"] == null && (dataContext[_keyPrefix + "collapsed"] = !0, dataContext[_keyPrefix + "sizePadding"] = 0, dataContext[_keyPrefix + "height"] = 0, dataContext[_keyPrefix + "isPadding"] = !1, dataContext[_keyPrefix + "parent"] = void 0, dataContext[_keyPrefix + "offset"] = 0), !dataContext[_keyPrefix + "isPadding"])
          if (dataContext[_keyPrefix + "collapsed"]) {
            var collapsedClasses = _options.cssClass + " expand ";
            return _options.collapsedClass && (collapsedClasses += _options.collapsedClass), '<div class="' + collapsedClasses + '"></div>';
          } else {
            var html = [], rowHeight = _gridOptions.rowHeight, outterHeight = dataContext[_keyPrefix + "sizePadding"] * _gridOptions.rowHeight;
            _options.maxRows !== null && dataContext[_keyPrefix + "sizePadding"] > _options.maxRows && (outterHeight = _options.maxRows * rowHeight, dataContext[_keyPrefix + "sizePadding"] = _options.maxRows);
            var expandedClasses = _options.cssClass + " collapse ";
            return _options.expandedClass && (expandedClasses += _options.expandedClass), html.push('<div class="' + expandedClasses + '"></div></div>'), html.push('<div class="dynamic-cell-detail cellDetailView_', dataContext[_dataViewIdProperty], '" '), html.push('style="height:', outterHeight, "px;"), html.push("top:", rowHeight, 'px">'), html.push('<div class="detail-container detailViewContainer_', dataContext[_dataViewIdProperty], '">'), html.push('<div class="innerDetailView_', dataContext[_dataViewIdProperty], '">', dataContext[_keyPrefix + "detailContent"], "</div></div>"), html.join("");
          }
      } else
        return null;
      return null;
    }
    function resizeDetailView(item) {
      if (item) {
        var mainContainer = document.querySelector("." + _gridUid + " .detailViewContainer_" + item[_dataViewIdProperty]), cellItem = document.querySelector("." + _gridUid + " .cellDetailView_" + item[_dataViewIdProperty]), inner = document.querySelector("." + _gridUid + " .innerDetailView_" + item[_dataViewIdProperty]);
        if (!(!mainContainer || !cellItem || !inner)) {
          for (var idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
            _dataView.deleteItem(item[_dataViewIdProperty] + "." + idx);
          var rowHeight = _gridOptions.rowHeight, lineHeight = 13;
          mainContainer.style.minHeight = null;
          var itemHeight = mainContainer.scrollHeight, rowCount = Math.ceil(itemHeight / rowHeight);
          item[_keyPrefix + "sizePadding"] = Math.ceil(rowCount * 2 * lineHeight / rowHeight), item[_keyPrefix + "height"] = itemHeight;
          var outterHeight = item[_keyPrefix + "sizePadding"] * rowHeight;
          _options.maxRows !== null && item[_keyPrefix + "sizePadding"] > _options.maxRows && (outterHeight = _options.maxRows * rowHeight, item[_keyPrefix + "sizePadding"] = _options.maxRows), _grid.getOptions().minRowBuffer < item[_keyPrefix + "sizePadding"] && (_grid.getOptions().minRowBuffer = item[_keyPrefix + "sizePadding"] + 3), mainContainer.setAttribute("style", "min-height: " + item[_keyPrefix + "height"] + "px"), cellItem && cellItem.setAttribute("style", "height: " + outterHeight + "px; top:" + rowHeight + "px");
          for (var idxParent = _dataView.getIdxById(item[_dataViewIdProperty]), idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
            _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
          saveDetailView(item);
        }
      }
    }
    function getFilterItem(item) {
      return item[_keyPrefix + "isPadding"] && item[_keyPrefix + "parent"] && (item = item[_keyPrefix + "parent"]), item;
    }
    function checkExpandableOverride(row, dataContext, grid) {
      return typeof _expandableOverride == "function" ? _expandableOverride(row, dataContext, grid) : !0;
    }
    function expandableOverride(overrideFn) {
      _expandableOverride = overrideFn;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "RowDetailView",
      collapseAll,
      collapseDetailView,
      expandDetailView,
      expandableOverride,
      getColumnDefinition,
      getExpandedRows,
      getFilterItem,
      getOptions,
      resizeDetailView,
      saveDetailView,
      setOptions,
      // events
      onAsyncResponse: new SlickEvent(),
      onAsyncEndUpdate: new SlickEvent(),
      onAfterRowDetailToggle: new SlickEvent(),
      onBeforeRowDetailToggle: new SlickEvent(),
      onRowOutOfViewportRange: new SlickEvent(),
      onRowBackToViewportRange: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        RowDetailView
      }
    }
  });
})();
//# sourceMappingURL=slick.rowdetailview.js.map
