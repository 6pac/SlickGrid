/**
 *
 * Draggable Grouping contributed by:  Muthukumar Selvarasu
 *  muthukumar{dot}se{at}gmail{dot}com
 *  github.com/muthukumarse/Slickgrid
 *
 * NOTES:
 *     This plugin provides the Draggable Grouping feature
 */

(function ($) {
  // Register namespace
  $.extend(true, window, {
    "Slick": {
      "DraggableGrouping": DraggableGrouping
    }
  });

  /**
   * DraggableGrouping plugin to show/hide tooltips when columns are too narrow to fit content.
   * @constructor
   * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
   * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
   * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
   */
  function DraggableGrouping(options) {
    var _grid;
    var _gridUid;
    var _gridColumns;
    var _dataView;
    var dropbox;
    var dropboxPlaceholder;
    var groupToggler;
    var _self = this;
    var _defaults = {
    };
    var onGroupChanged = new Slick.Event();

    /**
     * Initialize plugin.
     */
    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _gridUid = _grid.getUID();
      _gridColumns =  _grid.getColumns();
      _dataView = _grid.getData();
      
      dropbox = $(_grid.getPreHeaderPanel());
      dropbox.html("<div class='slick-placeholder'>Drop a column header here to group by the column</div><div class='slick-group-toggle-all expanded' style='display:none'></div>");

      dropboxPlaceholder = dropbox.find(".slick-placeholder");
      groupToggler = dropbox.find(".slick-group-toggle-all");
      setupColumnDropbox();


      _grid.onHeaderCellRendered.subscribe(function (e, args) {
        var column = args.column;
        var node = args.node;
        if (!$.isEmptyObject(column.grouping)) {
          var groupableIcon = "<span class='slick-column-groupable' />";
          $(node).append(groupableIcon);
        }
      })

      for (var i = 0; i < _gridColumns.length; i++) {
        var columnId = _gridColumns[i].field;
        _grid.updateColumnHeader(columnId);
      }

    }
    
    /**
     * Destroy plugin.
     */
    function destroy() {
    }
    

    function setColumns(col) {
      _gridColumns = col;
    }

    var emptyDropbox;

    function setupColumnDropbox() {
      dropbox.droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
        deactivate: function(event, ui) {
          dropbox.removeClass("slick-header-column-denied");
        },
        drop: function(event, ui) {
          handleGroupByDrop(this, ui.draggable);
        },
        over: function(event, ui) {
          var id = (ui.draggable).attr('id').replace(_gridUid, "");
          _gridColumns.forEach(function(e, i, a) {
            if (e.id == id) {
              if (e.grouping == null) {
                dropbox.addClass("slick-header-column-denied");
              }
            }
          });
        }
      });
      dropbox.sortable({
        items: "div.slick-dropped-grouping",
        cursor: "default",
        tolerance: "pointer",
        helper: "clone",
        update: function(event, ui) {
          var sortArray = $(this).sortable('toArray', {
              attribute: 'data-id'
            }),
            newGroupingOrder = [];
          for (var i = 0, l = sortArray.length; i < l; i++) {
            for (var a = 0, b = columnsGroupBy.length; a < b; a++) {
              if (columnsGroupBy[a].id == sortArray[i]) {
                newGroupingOrder.push(columnsGroupBy[a]);
                break;
              }
            }
          }
          columnsGroupBy = newGroupingOrder;
          updateGroupBy();
        }
      });
      emptyDropbox = dropbox.html();

      groupToggler.on('click', function(e) {
        if (this.classList.contains('collapsed')) {
          this.classList.remove('collapsed');
          this.classList.add('expanded');
          _dataView.expandAllGroups();
        } else {
          this.classList.add('collapsed');
          this.classList.remove('expanded');
          _dataView.collapseAllGroups();
        }
      });
    }

    var columnsGroupBy = [];
    var groupBySorters = [];

    function handleGroupByDrop(container, column) {
      var columnid = column.attr('id').replace(_gridUid, "");
      var columnAllowed = true;
      columnsGroupBy.forEach(function(e, i, a) {
        if (e.id == columnid) {
          columnAllowed = false;
        }
      });
      if (columnAllowed) {
        _gridColumns.forEach(function(e, i, a) {
          if (e.id == columnid) {
            if (e.grouping != null && !$.isEmptyObject(e.grouping)) {
              var entry = $("<div id='" + _gridUid + e.id + "_entry' data-id='" + e.id + "' class='slick-dropped-grouping'>");
              var span = $("<span class='slick-groupby-remove'></span>").text(column.text() + " ")
              span.appendTo(entry);
              $("</div>").appendTo(entry);
              entry.appendTo(container);
              addColumnGroupBy(e, column, container, entry);
              addGroupByRemoveClickHandler(e.id, container, column, entry);
            }
          }
        });
        groupToggler.css('display', 'block');
      }
    }

    function addColumnGroupBy(column) {
      columnsGroupBy.push(column);
      updateGroupBy();
    }

    function addGroupByRemoveClickHandler(id, container, column, entry) {
      var text = entry;
      $("#" + _gridUid + id + "_entry").on('click', function() {
        $(this).off('click');
        removeGroupBy(id, column, text);
      });
    }

    function setDroppedGroups(groupingInfo) {
      groupingInfos = (groupingInfo instanceof Array) ? groupingInfo : [groupingInfo];
      dropboxPlaceholder.hide()
      for (var i = 0; i < groupingInfos.length; i++) {
        var column = $(_grid.getHeaderRowColumn(groupingInfos[i]));
        handleGroupByDrop(dropbox, column);
      }
    }
    function clearDroppedGroups() {
      columnsGroupBy = [];
      updateGroupBy();
      onGroupChanged.notify({ groupColumns: []})
      dropbox.find(".slick-dropped-grouping").remove();
      groupToggler.css("display", "none");
      dropboxPlaceholder.show()
    }

    function removeFromArray(arr) {
      var what, a = arguments,
        L = a.length,
        ax;
      while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) != -1) {
          arr.splice(ax, 1);
        }
      }
      return arr;
    }

    function removeGroupBy(id, column, entry) {
      entry.remove();
      var groupby = [];
      _gridColumns.forEach(function(e, i, a) {
        groupby[e.id] = e;
      });
      removeFromArray(columnsGroupBy, groupby[id]);
      if(columnsGroupBy.length == 0){
        dropboxPlaceholder.show();
      }
      updateGroupBy();
    }

    function updateGroupBy() {
      if (columnsGroupBy.length == 0) {
        _dataView.setGrouping([]);
        return;
      }
      var groupingArray = [];
      columnsGroupBy.forEach(function(element, index, array) {
        groupingArray.push(element.grouping);
      });
      _dataView.setGrouping(groupingArray);
      /*
      collapseAllGroups();
      */
      onGroupChanged.notify({ groupColumns: groupingArray})
    }
    
    // Public API
    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "onGroupChanged": onGroupChanged,
      "setDroppedGroups": setDroppedGroups,
      "clearDroppedGroups": clearDroppedGroups
    });
  }
})(jQuery);