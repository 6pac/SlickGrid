  /***
   * A plugin to add row detail panel
   *
   * USAGE:
   *
   * Add the slick.rowDetailView.(js|css) files and register the plugin with the grid.
   *
   * Available row detail options:
   *    cssClass:         A CSS class to be added to the row detail
   *    preTemplate:      Template used before the async template
   *    postTemplate:     Template that will be loaded once the async function finishes
   *    panelRows: row count of the template lines 
   */
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "RowDetailView": RowDetailView
    }
  });


  function RowDetailView(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_detail_selector",
      cssClass: null,
      toolTip: "",
      width: 30
    };

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _dataView = _grid.getData();

      _handler
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onSort, handleSort);
      _grid.getData().onRowCountChanged.subscribe (function () { _grid.updateRowCount(); _grid.render(); });
      _grid.getData().onRowsChanged.subscribe (function (e, a) { _grid.invalidateRows(a.rows); _grid.render(); });
	   
	   // TODO: Remove/Update once we have someway of updating core.getRenderedRange
       _grid.getRenderedRange = getRenderedRange;
    }

    function destroy() {
      _handler.unsubscribeAll();
      _self.onAsyncResponse.unsubscribe();
    }
	
    //////////////////////////////////////////////////////////////
    //TODO: Make this not override the core functionality!
    // This is a clone of the slick.core.getRenderedRange Only change is adding _options.panelRows
    //////////////////////////////////////////////////////////////
    function getRenderedRange(viewportTop, viewportLeft) {
        var range = getVisibleRange(viewportTop, viewportLeft);
        var buffer = Math.round(viewportH / options.rowHeight);
        var minBuffer = 3 + _options.panelRows; // Changed line

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
	
    function handleSort(e, args) {		
      var rows = _grid.getData().getItems();		
      $.each(rows, function (i, r) {
          HandleAccordionShowHide(r, true);
      });
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).hasClass("detailView-toggle")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        var item = _dataView.getItem(args.row);

        toggleRowSelection(item);
        
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function toggleRowSelection(row) {

        _grid.getData().beginUpdate();

        HandleAccordionShowHide(row, false);

        _grid.getData().endUpdate();
    }

    function HandleAccordionShowHide(item, forceHide) {
        var dataView = _grid.getData();

        if (item) {
            if (!item._collapsed) {
                item._collapsed = true;
                for (var idx = 1; idx <= item._sizePadding; idx++)
                    dataView.deleteItem(item.id + "." + idx);
                item._sizePadding = 0;
                dataView.updateItem(item.id, item);
            }
            else if (!forceHide) {
              item._collapsed = false;

			  // display pre-loading template only if view has not been loaded before and we are not only loading it once
              if (!item._detailViewLoaded || _options.loadOnce != true)
              {
                  item._detailContent = _options.preTemplate(item);
              }
              else
              {
				  // If we are only loading it the once and we have loaded it before just notify to update the view
                  _self.onAsyncResponse.notify({
                      "itemDetail": item,
                      "detailView": item._detailContent
                  }, undefined, this);
                  applyTemplateNewLineHeight(dataView, item);
                  dataView.updateItem(item.id, item);

                  return;
              }
			  
              // display pre-loading template
              item._detailContent = _options.preTemplate(item);
              applyTemplateNewLineHeight(dataView, item);              
              dataView.updateItem(item.id, item);

              // subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
              // the response has to be as "args.itemDetail" with it's data back
              _self.onAsyncResponse.subscribe(function (e, args) {
                if(!args || !args.itemDetail) {
                  throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.itemDetail" property.'
                }
                
				// If we just want to load in a view directly we can use detailView property to do so
                if (args.detailView)
                {
                    item._detailContent = args.detailView;                            
                }
                else
                {
                    item._detailContent = _options.postTemplate(args.itemDetail);
                }
				
                item._detailViewLoaded = true;
				
                var idxParent = dataView.getIdxById(args.itemDetail.id);
                dataView.updateItem(args.itemDetail.id, args.itemDetail);
              });

              // async server call
              _options.process(item);
            }
        }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    var getPaddingItem=function(parent , offset)
    {
        var item={};

        for (var prop in _grid.getData()) item[prop]=null;
        item.id=parent.id+"."+offset;

        //additional hidden padding metadata fields
        item._collapsed=     true;
        item._isPadding=     true;
		item._parent = parent;
        item._offset = offset;

        return item;
    }

    //////////////////////////////////////////////////////////////
    //create the detail ctr node. this belongs to the dev & can be custom-styled as per
    //////////////////////////////////////////////////////////////
    function applyTemplateNewLineHeight(dataView, item) {
      // the height seems to be calculated by the template row count (how many line of items does the template have)
      var rowCount = _options.panelRows;

      //calculate padding requirements based on detail-content..
      //ie. worst-case: create an invisible dom node now &find it's height.
      var lineHeight=13; //we know cuz we wrote the custom css innit ;)
      item._sizePadding=Math.ceil(((rowCount * 2)*lineHeight) / _grid.getOptions().rowHeight);
      item._height=(item._sizePadding * _grid.getOptions().rowHeight);

      var idxParent = dataView.getIdxById(item.id);
      for (var idx = 1; idx <= item._sizePadding; idx++) {
        dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
      }
    }


    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: detailSelectionFormatter
      };
    }

    function detailSelectionFormatter(row, cell, value, columnDef, dataContext) {

        if (dataContext._collapsed == undefined)
        {
            dataContext._collapsed = true,
            dataContext._sizePadding = 0,     //the required number of pading rows
            dataContext._height = 0,     //the actual height in pixels of the detail field
            dataContext._isPadding = false,
            dataContext._parent = undefined,
            dataContext._offset = 0
        }

        if (dataContext._isPadding == true) {
          //render nothing
        } else if (dataContext._collapsed) {
          return "<div class='detailView-toggle expand'></div>";
        }else {
            var html = [];
            var rowHeight = _grid.getOptions().rowHeight;
            var bottomMargin = 5;

            //V313HAX:
            //putting in an extra closing div after the closing toggle div and ommiting a
            //final closing div for the detail ctr div causes the slickgrid renderer to
            //insert our detail div as a new column ;) ~since it wraps whatever we provide
            //in a generic div column container. so our detail becomes a child directly of
            //the row not the cell. nice =)  ~no need to apply a css change to the parent
            //slick-cell to escape the cell overflow clipping.

            //sneaky extra </div> inserted here-----------------v
            html.push("<div class='detailView-toggle collapse'></div></div>");

            html.push("<div class='dynamic-cell-detail' ");   //apply custom css to detail
            html.push("style='height:", dataContext._height, "px;"); //set total height of padding
            html.push("top:", rowHeight, "px'>");             //shift detail below 1st row
            html.push("<div class='detail-container' style='max-height:" + (dataContext._height - rowHeight + bottomMargin) + "px'>", dataContext._detailContent, "</div>");  //sub ctr for custom styling
            //&omit a final closing detail container </div> that would come next

            return html.join("");
        }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "onAsyncResponse": new Slick.Event(),
      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);