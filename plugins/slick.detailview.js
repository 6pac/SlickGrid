(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "DetailSelectColumn": DetailSelectColumn
    }
  });


  function DetailSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_detail_selector",
      cssClass: null,
      toolTip: "Select/Deselect All",
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
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleSort(e, args) {
        $.each(_grid.getData().rows, function (i, r) {
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
            }
            else if (!forceHide) {
                item._collapsed = false;
                kookupDynamicContent(item);
                var idxParent = dataView.getIdxById(item.id);
                for (var idx = 1; idx <= item._sizePadding; idx++)
                    dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
            }
            dataView.updateItem(item.id, item);
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

        return item;
    }

    //////////////////////////////////////////////////////////////
    //create the detail ctr node. this belongs to the dev & can be custom-styled as per
    //////////////////////////////////////////////////////////////
    var kookupDynamicContent=function(item)
    {      
      // display row detail
      var templateRows = [
        '<div>',
        '<h4>' + item.title + '</h4>',
        '<div class="detail"><label>Duration:</label> <span>' + item.duration + '</span></div>',
        '<div class="detail"><label>% Complete:</label> <span>' + item.percentComplete + '</span></div>',
        '<div class="detail"><label>Start:</label> <span>' + item.start + '</span></div>',
        '<div class="detail"><label>Finish:</label> <span>' + item.finish + '</span></div>',
        '<div class="detail"><label>Effort Driven:</label> <span>' + item.effortDriven + '</span></div>',
        '</div>'
      ];
      
      // don't exactly know how to calculate this spacing, but using the row count seems to be around what we need
      var rowCount = templateRows.length - 2; // 2 rows are for the div container
      var height = rowCount * 2;

      // detail content
      item._detailContent = templateRows.join('');

      //calculate padding requirements based on detail-content..
      //ie. worst-case: create an invisible dom node now &find it's height.
      var lineHeight=13; //we know cuz we wrote the custom css innit ;)
      item._sizePadding=Math.ceil((height*lineHeight) / _grid.getOptions().rowHeight);
      item._height=(item._sizePadding * _grid.getOptions().rowHeight);
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

        if (dataContext._isPadding == true); //render nothing
        else if (dataContext._collapsed) return "<div class='detailView-toggle expand'></div>";
        else {
            var html = [];
            var rowHeight = _grid.getOptions().rowHeight;

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
            html.push("<div>", dataContext._detailContent, "</div>");  //sub ctr for custom styling
            //&omit a final closing detail container </div> that would come next

            return html.join("");
        }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);