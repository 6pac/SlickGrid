/***
 * A plugin to add row detail panel
 * Original StackOverflow question & article making this possible (thanks to violet313)
 * https://stackoverflow.com/questions/10535164/can-slickgrids-row-height-be-dynamically-altered#29399927
 * http://violet313.org/slickgrids/#intro
 *
 *
 * USAGE:
 *
 * Add the slick.rowDetailView.(js|css) files and register the plugin with the grid.
 *
 * AVAILABLE ROW DETAIL OPTIONS:
 *    cssClass:               A CSS class to be added to the row detail
 *    expandedClass:          Extra classes to be added to the expanded Toggle
 *    collapsedClass:         Extra classes to be added to the collapse Toggle
 *    loadOnce:               Defaults to false, when set to True it will load the data once and then reuse it.
 *    preTemplate:            Template that will be used before the async process (typically used to show a spinner/loading)
 *    postTemplate:           Template that will be loaded once the async function finishes
 *    process:                Async server function call
 *    panelRows:              Row count to use for the template panel
 *    useRowClick:            Boolean flag, when True will open the row detail on a row click (from any column), default to False
 *    keyPrefix:              Defaults to '_', prefix used for all the plugin metadata added to the item object (meta e.g.: padding, collapsed, parent)
 *    collapseAllOnSort:      Defaults to true, which will collapse all row detail views when user calls a sort. Unless user implements a sort to deal with padding
 *    saveDetailViewOnScroll: Defaults to true, which will save the row detail view in a cache when it detects that it will become out of the viewport buffer
 *
 * AVAILABLE PUBLIC OPTIONS:
 *    init:                 initiliaze the plugin
 *    destroy:              destroy the plugin and it's events
 *    collapseAll:          collapse all opened row detail panel
 *    getColumnDefinition:  get the column definitions
 *    getOptions:           get current plugin options
 *    setOptions:           set or change some of the plugin options
 *
 * THE PLUGIN EXPOSES THE FOLLOWING SLICK EVENTS:
 *    onAsyncResponse:  This event must be used with the "notify" by the end user once the Asynchronous Server call returns the item detail
 *      Event args:
 *        item:         Item detail returned from the async server call
 *        detailView:   An explicit view to use instead of template (Optional)
 *
 *    onAsyncEndUpdate: Fired when the async response finished
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onBeforeRowDetailToggle: Fired before the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onAfterRowDetailToggle: Fired after the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        expandedRows: Array of the Expanded Rows
 *
 *    onRowOutOfVisibleRange: Fired after a row becomes out of visible range (user can't see the row anymore)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        outOfVisibleRangeRows: Array of the Out of Visible Range Rows
 *
 *    onRowBackToVisibleRange: Fired after the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        outOfVisibleRangeRows: Array of the Out of Visible Range Rows
 */
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "RowDetailView": RowDetailView
      }
    }
  });

  function RowDetailView(options) {
    var _grid;
    var _gridOptions;
    var _gridUid;
    var _self = this;
    var _expandedRows = [];
    var _handler = new Slick.EventHandler();
    var _defaults = {
      columnId: '_detail_selector',
      cssClass: 'detailView-toggle',
      expandedClass: null,
      collapsedClass: null,
      keyPrefix: '_',
      loadOnce: false,
      collapseAllOnSort: true,
      saveDetailViewOnScroll: true,
      toolTip: '',
      width: 30
    };
    var _keyPrefix = _defaults.keyPrefix;
    var _gridRowBuffer = 0;
    var _outOfVisibleRangeRows = [];
    var _visibleRenderedCellCount = 0;
    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      if (!grid) {
        throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
      }
      _grid = grid;
      _gridUid = grid.getUID();
      _gridOptions = grid.getOptions() || {};
      _dataView = _grid.getData();
      _keyPrefix = _options && _options.keyPrefix || '_';

      // Update the minRowBuffer so that the view doesn't disappear when it's at top of screen + the original default 3
      _grid.getOptions().minRowBuffer = _options.panelRows + 3;

      _handler
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onScroll, handleScroll);

      // Sort will, by default, Collapse all of the open items (unless user implements his own onSort which deals with open row and padding)
      if (_options.collapseAllOnSort) {
        _handler.subscribe(_grid.onSort, collapseAll);
        _expandedRows = [];
        _outOfVisibleRangeRows = [];
      }

      _grid.getData().onRowCountChanged.subscribe(function () {
        _grid.updateRowCount();
        _grid.render();
      });

      _grid.getData().onRowsChanged.subscribe(function (e, a) {
        _grid.invalidateRows(a.rows);
        _grid.render();
      });

      // subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
      subscribeToOnAsyncResponse();

      setTimeout(calculateVisibleRenderedCount, 250);
      $(window).on('resize', calculateVisibleRenderedCount);
    }

    function destroy() {
      _handler.unsubscribeAll();
      _self.onAsyncResponse.unsubscribe();
      _self.onAsyncEndUpdate.unsubscribe();
      _self.onAfterRowDetailToggle.unsubscribe();
      _self.onBeforeRowDetailToggle.unsubscribe();
      _self.onRowOutOfVisibleRange.unsubscribe();
      _self.onRowBackToVisibleRange.unsubscribe();
      $(window).off('resize');
    }

    function getOptions() {
      return _options;
    }

    function setOptions(options) {
      _options = $.extend(true, {}, _options, options);
    }

    function arrayFindIndex(sourceArray, value) {
      if (sourceArray) {
        for (var i = 0; i < sourceArray.length; i++) {
          if (sourceArray[i] === value) {
            return i;
          }
        }
      }
      return -1;
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_options.useRowClick || _grid.getColumns()[args.cell].id === _options.columnId && $(e.target).hasClass(_options.cssClass)) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        var item = _dataView.getItem(args.row);

        // trigger an event before toggling
        _self.onBeforeRowDetailToggle.notify({
          'grid': _grid,
          'item': item
        }, e, _self);

        toggleRowSelection(item);

        // trigger an event after toggling
        _self.onAfterRowDetailToggle.notify({
          'grid': _grid,
          'item': item,
          'expandedRows': _expandedRows,
        }, e, _self);

        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    // If we scroll save detail views that go out of cache range
    function handleScroll(e, args) {
      calculateOutOfRangeViews();
      if (_options.saveDetailViewOnScroll) {
        // handleOnScrollSaveDetailView();
      }
    }

    function calculateVisibleRenderedCount() {
      var renderedRange = _grid.getRenderedRange() || {};
      _visibleRenderedCellCount = renderedRange.bottom - renderedRange.top - _gridRowBuffer;
	    return _visibleRenderedCellCount;
    }

    function calculateOutOfRangeViews() {
      if (_grid) {
        var renderedRange = _grid.getRenderedRange();

        _expandedRows.forEach((row) => {
          var rowIndex = _dataView.getRowById(row.id);
          var isOutOfVisibility = checkIsRowOutOfVisibleRange(rowIndex, renderedRange);

          if (!isOutOfVisibility && arrayFindIndex(_outOfVisibleRangeRows, rowIndex) >= 0) {
            notifyBackToVisibleWhenDomExist(row, rowIndex);
          } else if (isOutOfVisibility) {
            notifyOutOfVisibility(row, rowIndex);

            // save the view when asked
            if (_options.saveDetailViewOnScroll) {
              saveDetailView(row);
            }
          }
        });
      }
    }

    /** Check if the row became out of visible range (when user can't see it anymore) */
    function checkIsRowOutOfVisibleRange(rowIndex, renderedRange) {
  	  if (Math.abs(renderedRange.bottom - _gridRowBuffer - rowIndex) > _visibleRenderedCellCount * 2) {
        return true;
      }
      return false;
    }

    function notifyOutOfVisibility(item, rowIndex) {
      _self.onRowOutOfVisibleRange.notify({
        'grid': _grid,
        'item': item,
        'rowIndex': rowIndex,
        'expandedRows': _expandedRows,
        'outOfVisibleRangeRows': updateOutOfVisibleArrayWhenNecessary(rowIndex, true)
      }, null, _self);
    }

    function notifyBackToVisibleWhenDomExist(item, rowIndex) {
      var rowIndex = item.rowIndex || _dataView.getRowById(item.id);
      setTimeout(function() {
        // make sure View Row DOM Element really exist before notifying that it's a row that is visible again
        if (document.querySelector('.cellDetailView_' + item.id).length) {
          _self.onRowBackToVisibleRange.notify({
            'grid': _grid,
            'item': item,
            'rowIndex': rowIndex,
            'expandedRows': _expandedRows,
            'outOfVisibleRangeRows': updateOutOfVisibleArrayWhenNecessary(rowIndex, false)
          }, null, _self);
        }
      }, 100);
    }

    function updateOutOfVisibleArrayWhenNecessary(rowIndex, isAdding) {
      var arrayRowIndex = arrayFindIndex(_outOfVisibleRangeRows, rowIndex);

      if (isAdding && arrayRowIndex < 0) {
        _outOfVisibleRangeRows.push(rowIndex);
      } else if (!isAdding && arrayRowIndex >= 0) {
        _outOfVisibleRangeRows.splice(arrayRowIndex, 1);
      }
      return _outOfVisibleRangeRows;
    }

    function handleOnScrollSaveDetailView() {
      var range = _grid.getRenderedRange();
      var start = (range.top > 0 ? range.top : 0);
      var end = (range.bottom > _dataView.getLength() ? range.bottom : _dataView.getLength());

      // Get the item at the top of the view
      var topMostItem = _dataView.getItemByIdx(start);

      // Check it is a parent item
      if (topMostItem && topMostItem[_keyPrefix + 'parent'] == undefined) {
        // This is a standard row as we have no parent.
        var nextItem = _dataView.getItemByIdx(start + 1);
        if (nextItem !== undefined && nextItem[_keyPrefix + 'parent'] !== undefined) {
          // This is likely the expanded Detail Row View
          // Check for safety
          if (nextItem[_keyPrefix + 'parent'] == topMostItem) {
            saveDetailView(topMostItem);
          }
        }
      }

      // Find the bottom most item that is likely to go off screen
      var bottomMostItem = _dataView.getItemByIdx(end - 1);

      // If we are a detailView and we are about to go out of cache view
      if (bottomMostItem && bottomMostItem[_keyPrefix + 'parent'] !== undefined) {
        saveDetailView(bottomMostItem[_keyPrefix + 'parent']);
      }
    }

    // Toggle between showing and hiding a row
    function toggleRowSelection(row) {
      _dataView.beginUpdate();
      handleAccordionShowHide(row);
      _dataView.endUpdate();
    }

    // Collapse all of the open items
    function collapseAll() {
      _dataView.beginUpdate();
      for (var i = _expandedRows.length - 1; i >= 0; i--) {
        collapseItem(_expandedRows[i], true);
      }
      _dataView.endUpdate();
    }

    // Colapse an Item so it is not longer seen
    function collapseItem(item, multipleCollapse) {
      if (!multipleCollapse) {
        _dataView.beginUpdate();
      }
      // Save the details on the collapse assuming onetime loading
      if (_options.loadOnce) {
        saveDetailView(item);
      }

      item[_keyPrefix + 'collapsed'] = true;
      for (var idx = 1; idx <= item[_keyPrefix + 'sizePadding']; idx++) {
        _dataView.deleteItem(item.id + "." + idx);
      }
      item[_keyPrefix + 'sizePadding'] = 0;
      _dataView.updateItem(item.id, item);

      // Remove the item from the expandedRows
      _expandedRows = _expandedRows.filter(function (r) {
        return r.id !== item.id;
      });

      if (!multipleCollapse) {
        _dataView.endUpdate();
      }
    }

    // Expand a row given the dataview item that is to be expanded
    function expandItem(item) {
      item[_keyPrefix + 'collapsed'] = false;
      _expandedRows.push(item);

      // In the case something went wrong loading it the first time such a scroll of screen before loaded
      if (!item[_keyPrefix + 'detailContent']) item[_keyPrefix + 'detailViewLoaded'] = false;

      // display pre-loading template
      if (!item[_keyPrefix + 'detailViewLoaded'] || _options.loadOnce !== true) {
        item[_keyPrefix + 'detailContent'] = _options.preTemplate(item);
      } else {
        _self.onAsyncResponse.notify({
          'item': item,
          'itemDetail': item,
          'detailView': item[_keyPrefix + 'detailContent']
        }, undefined, this);
        applyTemplateNewLineHeight(item);
        _dataView.updateItem(item.id, item);

        return;
      }

      applyTemplateNewLineHeight(item);
      _dataView.updateItem(item.id, item);

      // async server call
      _options.process(item);
    }

    // Saves the current state of the detail view
    function saveDetailView(item) {
      var view = $('.' + _gridUid + ' .innerDetailView_' + item.id);
      if (view) {
        var html = $('.' + _gridUid + ' .innerDetailView_' + item.id).html();
        if (html !== undefined) {
          item[_keyPrefix + 'detailContent'] = html;
        }
      }
    }

    /**
     * subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
     * the response has to be as "args.item" (or "args.itemDetail") with it's data back
     */
    function subscribeToOnAsyncResponse() {
      _self.onAsyncResponse.subscribe(function (e, args) {
        if (!args || (!args.item && !args.itemDetail)) {
          throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.'
        }

        // we accept item/itemDetail, just get the one which has data
        var itemDetail = args.item || args.itemDetail;

        // If we just want to load in a view directly we can use detailView property to do so
        if (args.detailView) {
          itemDetail[_keyPrefix + 'detailContent'] = args.detailView;
        } else {
          itemDetail[_keyPrefix + 'detailContent'] = _options.postTemplate(itemDetail);
        }

        itemDetail[_keyPrefix + 'detailViewLoaded'] = true;
        _dataView.updateItem(itemDetail.id, itemDetail);

        // trigger an event once the post template is finished loading
        _self.onAsyncEndUpdate.notify({
          'grid': _grid,
          'item': itemDetail,
          'itemDetail': itemDetail
        }, e, _self);
      });
    }

    function handleAccordionShowHide(item) {
      if (item) {
        if (!item[_keyPrefix + 'collapsed']) {
          collapseItem(item);
        } else {
          expandItem(item);
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    var getPaddingItem = function (parent, offset) {
      var item = {};

      for (var prop in _grid.getData()) {
        item[prop] = null;
      }
      item.id = parent.id + '.' + offset;

      // additional hidden padding metadata fields
      item[_keyPrefix + 'collapsed'] = true;
      item[_keyPrefix + 'isPadding'] = true;
      item[_keyPrefix + 'parent'] = parent;
      item[_keyPrefix + 'offset'] = offset;

      return item;
    }

    //////////////////////////////////////////////////////////////
    // create the detail ctr node. this belongs to the dev & can be custom-styled as per
    //////////////////////////////////////////////////////////////
    function applyTemplateNewLineHeight(item) {
      // the height is calculated by the template row count (how many line of items does the template view have)
      var rowCount = _options.panelRows;

      // calculate padding requirements based on detail-content..
      // ie. worst-case: create an invisible dom node now & find it's height.
      var lineHeight = 13; // we know cuz we wrote the custom css init ;)
      item[_keyPrefix + 'sizePadding'] = Math.ceil(((rowCount * 2) * lineHeight) / _gridOptions.rowHeight);
      item[_keyPrefix + 'height'] = (item[_keyPrefix + 'sizePadding'] * _gridOptions.rowHeight);
      var idxParent = _dataView.getIdxById(item.id);
      for (var idx = 1; idx <= item[_keyPrefix + 'sizePadding']; idx++) {
        _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
      }
    }


    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: '',
        toolTip: _options.toolTip,
        field: 'sel',
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: detailSelectionFormatter
      };
    }

    function detailSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext[_keyPrefix + 'collapsed'] == undefined) {
        dataContext[_keyPrefix + 'collapsed'] = true,
        dataContext[_keyPrefix + 'sizePadding'] = 0,     //the required number of pading rows
        dataContext[_keyPrefix + 'height'] = 0,     //the actual height in pixels of the detail field
        dataContext[_keyPrefix + 'isPadding'] = false,
        dataContext[_keyPrefix + 'parent'] = undefined,
        dataContext[_keyPrefix + 'offset'] = 0
      }

      if (dataContext[_keyPrefix + 'isPadding'] == true) {
        //render nothing
      } else if (dataContext[_keyPrefix + 'collapsed']) {
		    var collapsedClasses = _options.cssClass + ' expand ';
		    if (_options.collapsedClass) {
          collapsedClasses += _options.collapsedClass;
        }
		    return '<div class="' + collapsedClasses + '"></div>';
      } else {
        var html = [];
        var rowHeight = _gridOptions.rowHeight;

        //V313HAX:
        //putting in an extra closing div after the closing toggle div and ommiting a
        //final closing div for the detail ctr div causes the slickgrid renderer to
        //insert our detail div as a new column ;) ~since it wraps whatever we provide
        //in a generic div column container. so our detail becomes a child directly of
        //the row not the cell. nice =)  ~no need to apply a css change to the parent
        //slick-cell to escape the cell overflow clipping.

        //sneaky extra </div> inserted here-----------------v
        var expandedClasses = _options.cssClass + ' collapse ';
        if (_options.expandedClass) expandedClasses += _options.expandedClass;
        html.push('<div class="' + expandedClasses + '"></div></div>');

        html.push('<div class="dynamic-cell-detail cellDetailView_', dataContext.id, '" ');   //apply custom css to detail
        html.push('style="height:', dataContext[_keyPrefix + 'height'], 'px;'); //set total height of padding
        html.push('top:', rowHeight, 'px">');             //shift detail below 1st row
        html.push('<div class="detail-container detailViewContainer_', dataContext.id, '" style="max-height:' + (dataContext._height - rowHeight + 5) + 'px">'); //sub ctr for custom styling
        html.push('<div class="innerDetailView_', dataContext.id, '">', dataContext[_keyPrefix + 'detailContent'], '</div></div>');
        // &omit a final closing detail container </div> that would come next

        return html.join('');
      }
      return null;
    }

    function resizeDetailView(item) {
      if (!item) {
        return;
      }

      // Grad each of the DOM elements
      var mainContainer = document.querySelector('.' + _gridUid + ' .detailViewContainer_' + item.id);
      var cellItem = document.querySelector('.' + _gridUid + ' .cellDetailView_' + item.id);
      var inner = document.querySelector('.' + _gridUid + ' .innerDetailView_' + item.id);

      if (!mainContainer || !cellItem || !inner) {
        return;
      }

      for (var idx = 1; idx <= item[_keyPrefix + 'sizePadding']; idx++) {
        _dataView.deleteItem(item.id + '.' + idx);
      }

      var rowHeight = _gridOptions.rowHeight; // height of a row
      var lineHeight = 13; // we know cuz we wrote the custom css innit ;)

      // Get the scroll height for the main container so we know the actual size of the view
      var itemHeight = mainContainer.scrollHeight;

      // Now work out how many rows
      var rowCount = Math.ceil(itemHeight / rowHeight) + 1;

      item[_keyPrefix + 'sizePadding'] = Math.ceil(((rowCount * 2) * lineHeight) / rowHeight);
      item[_keyPrefix + 'height'] = (item[_keyPrefix + 'sizePadding'] * rowHeight);

      // If the padding is now more than the original minRowBuff we need to increase it
      if (_grid.getOptions().minRowBuffer < item[_keyPrefix + 'sizePadding']) {
        // Update the minRowBuffer so that the view doesn't disappear when it's at top of screen + the original default 3
        _grid.getOptions().minRowBuffer = item[_keyPrefix + 'sizePadding'] + 3;
      }

      mainContainer.setAttribute('style', 'max-height: ' + item[_keyPrefix + 'height'] + 'px');
      if (cellItem) cellItem.setAttribute('style', 'height: ' + item[_keyPrefix + 'height'] + 'px; top:' + rowHeight + 'px');

      var idxParent = _dataView.getIdxById(item.id);
      for (var idx = 1; idx <= item[_keyPrefix + 'sizePadding']; idx++) {
        _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
      }

	    // Lastly save the updated state
      saveDetailView(item);
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "collapseAll": collapseAll,
      "collapseItem": collapseItem,
      "getColumnDefinition": getColumnDefinition,
      "getOptions": getOptions,
      "setOptions": setOptions,
      "onAsyncResponse": new Slick.Event(),
      "onAsyncEndUpdate": new Slick.Event(),
      "onAfterRowDetailToggle": new Slick.Event(),
      "onBeforeRowDetailToggle": new Slick.Event(),
      "onRowOutOfVisibleRange": new Slick.Event(),
      "onRowBackToVisibleRange": new Slick.Event(),
      "resizeDetailView": resizeDetailView
    });
  }
})(jQuery);
