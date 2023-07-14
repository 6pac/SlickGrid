"use strict";
(() => {
  // src/plugins/slick.draggablegrouping.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function DraggableGrouping(options) {
    var _grid, _gridUid, _gridColumns, _dataView, _dropzoneElm, _droppableInstance, dropzonePlaceholder, groupToggler, _defaults = {}, onGroupChanged = new SlickEvent(), _bindingEventService = new BindingEventService(), _handler = new EventHandler(), _sortableLeftInstance, _sortableRightInstance;
    function init(grid) {
      options = Utils.extend(!0, {}, _defaults, options), _grid = grid, _gridUid = _grid.getUID(), _gridColumns = _grid.getColumns(), _dataView = _grid.getData(), _dropzoneElm = grid.getPreHeaderPanel(), _dropzoneElm.classList.add("slick-dropzone");
      var dropPlaceHolderText = options.dropPlaceHolderText || "Drop a column header here to group by the column";
      dropzonePlaceholder = document.createElement("div"), dropzonePlaceholder.className = "slick-placeholder", dropzonePlaceholder.textContent = dropPlaceHolderText, groupToggler = document.createElement("div"), groupToggler.className = "slick-group-toggle-all expanded", groupToggler.style.display = "none", _dropzoneElm.appendChild(dropzonePlaceholder), _dropzoneElm.appendChild(groupToggler), setupColumnDropbox(), _handler.subscribe(_grid.onHeaderCellRendered, function(e, args) {
        var column = args.column, node = args.node;
        if (!Utils.isEmptyObject(column.grouping) && node && (node.style.cursor = "pointer", options.groupIconCssClass || options.groupIconImage)) {
          let groupableIconElm = document.createElement("span");
          groupableIconElm.className = "slick-column-groupable", options.groupIconCssClass && groupableIconElm.classList.add(...options.groupIconCssClass.split(" ")), options.groupIconImage && (groupableIconElm.style.background = "url(" + options.groupIconImage + ") no-repeat center center"), node.appendChild(groupableIconElm);
        }
      });
      for (var i = 0; i < _gridColumns.length; i++) {
        var columnId = _gridColumns[i].field;
        _grid.updateColumnHeader(columnId);
      }
    }
    function setupColumnReorder(grid, headers, _headerColumnWidthDiff, setColumns, setupColumnResize, _columns, getColumnIndex, _uid, trigger) {
      let dropzoneElm = grid.getPreHeaderPanel();
      var sortableOptions = {
        animation: 50,
        // chosenClass: 'slick-header-column-active',
        ghostClass: "slick-sortable-placeholder",
        draggable: ".slick-header-column",
        dataIdAttr: "data-id",
        group: {
          name: "shared",
          pull: "clone",
          put: !1
        },
        revertClone: !0,
        // filter: function (_e, target) {
        //   // block column from being able to be dragged if it's already a grouped column
        //   // NOTE: need to disable for now since it also blocks the column reordering
        //   return columnsGroupBy.some(c => c.id === target.getAttribute('data-id'));
        // },
        onStart: function() {
          dropzoneElm.classList.add("slick-dropzone-hover"), dropzoneElm.classList.add("slick-dropzone-placeholder-hover");
          let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
          draggablePlaceholderElm.style.display = "inline-block", groupToggler.style.display = "none", dropzoneElm.querySelectorAll(".slick-dropped-grouping").forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "none");
        },
        onEnd: function(e) {
          let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
          dropzoneElm.classList.remove("slick-dropzone-hover"), draggablePlaceholderElm.classList.remove("slick-dropzone-placeholder-hover"), dropzonePlaceholder && (dropzonePlaceholder.style.display = "none"), draggablePlaceholderElm && draggablePlaceholderElm.parentElement && draggablePlaceholderElm.parentElement.classList.remove("slick-dropzone-placeholder-hover");
          let droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
          if (droppedGroupingElms.forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "inline-flex"), droppedGroupingElms.length && (draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "none"), groupToggler.style.display = "inline-block"), !grid.getEditorLock().commitCurrentEdit())
            return;
          let reorderedIds = _sortableLeftInstance && _sortableLeftInstance.toArray() || [];
          if (headers.length > 1) {
            let ids = _sortableRightInstance && _sortableRightInstance.toArray() || [];
            for (let id of ids)
              reorderedIds.push(id);
          }
          let finalReorderedColumns = [], reorderedColumns = grid.getColumns();
          for (let reorderedId of reorderedIds)
            finalReorderedColumns.push(reorderedColumns[getColumnIndex(reorderedId)]);
          setColumns(finalReorderedColumns), trigger(grid.onColumnsReordered, { grid }), e.stopPropagation(), setupColumnResize();
        }
      };
      return _sortableLeftInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-left`), sortableOptions), _sortableRightInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-right`), sortableOptions), {
        sortableLeftInstance: _sortableLeftInstance,
        sortableRightInstance: _sortableRightInstance
      };
    }
    function destroy() {
      _sortableLeftInstance && _sortableLeftInstance.el && _sortableLeftInstance.destroy(), _sortableRightInstance && _sortableRightInstance.el && _sortableRightInstance.destroy(), onGroupChanged.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), Utils.emptyElement(document.querySelector(`.${_gridUid} .slick-preheader-panel`));
    }
    function addDragOverDropzoneListeners() {
      let draggablePlaceholderElm = _dropzoneElm.querySelector(".slick-placeholder");
      draggablePlaceholderElm && (_bindingEventService.bind(draggablePlaceholderElm, "dragover", (e) => e.preventDefault), _bindingEventService.bind(draggablePlaceholderElm, "dragenter", () => _dropzoneElm.classList.add("slick-dropzone-hover")), _bindingEventService.bind(draggablePlaceholderElm, "dragleave", () => _dropzoneElm.classList.remove("slick-dropzone-hover")));
    }
    function setupColumnDropbox() {
      let dropzoneElm = _dropzoneElm;
      _droppableInstance = Sortable.create(dropzoneElm, {
        group: "shared",
        // chosenClass: 'slick-header-column-active',
        ghostClass: "slick-droppable-sortitem-hover",
        draggable: ".slick-dropped-grouping",
        dragoverBubble: !0,
        onAdd: (evt) => {
          let el = evt.item, elId = el.getAttribute("id");
          elId && elId.replace(_gridUid, "") && handleGroupByDrop(dropzoneElm, Sortable.utils.clone(evt.item)), evt.clone.style.opacity = ".5", el.parentNode && el.parentNode.removeChild(el);
        },
        onUpdate: () => {
          let sortArray = _droppableInstance && _droppableInstance.toArray() || [], newGroupingOrder = [];
          for (var i = 0, l = sortArray.length; i < l; i++)
            for (var a = 0, b = columnsGroupBy.length; a < b; a++)
              if (columnsGroupBy[a].id == sortArray[i]) {
                newGroupingOrder.push(columnsGroupBy[a]);
                break;
              }
          columnsGroupBy = newGroupingOrder, updateGroupBy("sort-group");
        }
      }), addDragOverDropzoneListeners(), groupToggler && _bindingEventService.bind(groupToggler, "click", (event) => {
        let target = event.target;
        toggleGroupToggler(target, target && target.classList.contains("expanded"));
      });
    }
    var columnsGroupBy = [];
    function handleGroupByDrop(containerElm, headerColumnElm) {
      let headerColDataId = headerColumnElm.getAttribute("data-id"), columnId = headerColDataId && headerColDataId.replace(_gridUid, ""), columnAllowed = !0;
      for (let colGroupBy of columnsGroupBy)
        colGroupBy.id === columnId && (columnAllowed = !1);
      if (columnAllowed) {
        for (let col of _gridColumns)
          if (col.id === columnId && col.grouping && !Utils.isEmptyObject(col.grouping)) {
            let columnNameElm = headerColumnElm.querySelector(".slick-column-name"), entryElm = document.createElement("div");
            entryElm.id = `${_gridUid}_${col.id}_entry`, entryElm.className = "slick-dropped-grouping", entryElm.dataset.id = `${col.id}`;
            let groupTextElm = document.createElement("div");
            groupTextElm.className = "slick-dropped-grouping-title", groupTextElm.style.display = "inline-flex", groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent, entryElm.appendChild(groupTextElm);
            let groupRemoveIconElm = document.createElement("div");
            groupRemoveIconElm.className = "slick-groupby-remove", options.deleteIconCssClass && groupRemoveIconElm.classList.add(...options.deleteIconCssClass.split(" ")), options.deleteIconImage && groupRemoveIconElm.classList.add(...options.deleteIconImage.split(" ")), options.deleteIconCssClass || groupRemoveIconElm.classList.add("slick-groupby-remove-icon"), !options.deleteIconCssClass && !options.deleteIconImage && groupRemoveIconElm.classList.add("slick-groupby-remove-image"), options && options.hideGroupSortIcons !== !0 && col.sortable && col.grouping && col.grouping.sortAsc === void 0 && (col.grouping.sortAsc = !0), entryElm.appendChild(groupRemoveIconElm), entryElm.appendChild(document.createElement("div")), containerElm.appendChild(entryElm), addColumnGroupBy(col), addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
          }
        groupToggler.style.display = "inline-block";
      }
    }
    function addColumnGroupBy(column) {
      columnsGroupBy.push(column), updateGroupBy("add-group");
    }
    function addGroupByRemoveClickHandler(id, groupRemoveIconElm, headerColumnElm, entry) {
      _bindingEventService.bind(groupRemoveIconElm, "click", () => {
        let boundedElms = _bindingEventService.boundedEvents.filter((boundedEvent) => boundedEvent.element === groupRemoveIconElm);
        for (let boundedEvent of boundedElms)
          _bindingEventService.unbind(boundedEvent.element, "click", boundedEvent.listener);
        removeGroupBy(id, headerColumnElm, entry);
      });
    }
    function setDroppedGroups(groupingInfo) {
      let groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
      dropzonePlaceholder.style.display = "none";
      for (let groupInfo of groupingInfos) {
        let columnElm = _grid.getHeaderColumn(groupInfo);
        handleGroupByDrop(_dropzoneElm, columnElm);
      }
    }
    function clearDroppedGroups() {
      columnsGroupBy = [], updateGroupBy("clear-all");
      let allDroppedGroupingElms = _dropzoneElm.querySelectorAll(".slick-dropped-grouping");
      groupToggler.style.display = "none";
      for (let groupElm of Array.from(allDroppedGroupingElms)) {
        let groupRemoveBtnElm = _dropzoneElm.querySelector(".slick-groupby-remove");
        groupRemoveBtnElm && groupRemoveBtnElm.remove(), groupElm && groupElm.remove();
      }
      dropzonePlaceholder.style.display = "inline-block";
    }
    function removeFromArray(arr) {
      for (var what, a = arguments, L = a.length, ax; L > 1 && arr.length; )
        for (what = a[--L]; (ax = arr.indexOf(what)) != -1; )
          arr.splice(ax, 1);
      return arr;
    }
    function removeGroupBy(id, _column, entry) {
      entry.remove();
      var groupby = [];
      _gridColumns.forEach(function(e) {
        groupby[e.id] = e;
      }), removeFromArray(columnsGroupBy, groupby[id]), columnsGroupBy.length === 0 && (dropzonePlaceholder.style = "block", groupToggler.style.display = "none"), updateGroupBy("remove-group");
    }
    function toggleGroupToggler(targetElm, collapsing = !0, shouldExecuteDataViewCommand = !0) {
      targetElm && (collapsing === !0 ? (targetElm.classList.add("collapsed"), targetElm.classList.remove("expanded"), shouldExecuteDataViewCommand && _dataView.collapseAllGroups()) : (targetElm.classList.remove("collapsed"), targetElm.classList.add("expanded"), shouldExecuteDataViewCommand && _dataView.expandAllGroups()));
    }
    function updateGroupBy(originator) {
      if (columnsGroupBy.length === 0) {
        _dataView.setGrouping([]), onGroupChanged.notify({ caller: originator, groupColumns: [] });
        return;
      }
      var groupingArray = [];
      columnsGroupBy.forEach(function(element) {
        groupingArray.push(element.grouping);
      }), _dataView.setGrouping(groupingArray), onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "DraggableGrouping",
      onGroupChanged,
      setDroppedGroups,
      clearDroppedGroups,
      getSetupColumnReorder: setupColumnReorder
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      DraggableGrouping
    }
  });
})();
//# sourceMappingURL=slick.draggablegrouping.js.map
