"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.draggablegrouping.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickDraggableGrouping = class {
    /**
     * @param options {Object} Options:
     *    deleteIconCssClass:  an extra CSS class to add to the delete button (default undefined), if deleteIconCssClass && deleteIconImage undefined then slick-groupby-remove-image class will be added
     *    deleteIconImage:     a url to the delete button image (default undefined)
     *    groupIconCssClass:   an extra CSS class to add to the grouping field hint  (default undefined)
     *    groupIconImage:      a url to the grouping field hint image (default undefined)
     *    dropPlaceHolderText:      option to specify set own placeholder note text
     */
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "DraggableGrouping");
      __publicField(this, "onGroupChanged", new SlickEvent("onGroupChanged"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_gridColumns", []);
      __publicField(this, "_dataView");
      __publicField(this, "_dropzoneElm");
      __publicField(this, "_droppableInstance");
      __publicField(this, "_dropzonePlaceholder");
      __publicField(this, "_groupToggler");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        dropPlaceHolderText: "Drop a column header here to group by the column",
        hideGroupSortIcons: !1,
        hideToggleAllButton: !1,
        toggleAllButtonText: "",
        toggleAllPlaceholderText: "Toggle all Groups"
      });
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_handler", new SlickEventHandler());
      __publicField(this, "_sortableLeftInstance");
      __publicField(this, "_sortableRightInstance");
      __publicField(this, "_columnsGroupBy", []);
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    /**
     * Initialize plugin.
     */
    init(grid) {
      this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._gridUid = this._grid.getUID(), this._gridColumns = this._grid.getColumns(), this._dataView = this._grid.getData(), this._dropzoneElm = this._grid.getPreHeaderPanel(), this._dropzoneElm.classList.add("slick-dropzone");
      let dropPlaceHolderText = this._options.dropPlaceHolderText || "Drop a column header here to group by the column";
      this._dropzonePlaceholder = document.createElement("div"), this._dropzonePlaceholder.className = "slick-placeholder", this._dropzonePlaceholder.textContent = dropPlaceHolderText, this._groupToggler = document.createElement("div"), this._groupToggler.className = "slick-group-toggle-all expanded", this._groupToggler.style.display = "none", this._dropzoneElm.appendChild(this._dropzonePlaceholder), this._dropzoneElm.appendChild(this._groupToggler), this.setupColumnDropbox(), this._handler.subscribe(this._grid.onHeaderCellRendered, (_e, args) => {
        let column = args.column, node = args.node;
        if (!Utils.isEmptyObject(column.grouping) && node && (node.style.cursor = "pointer", this._options.groupIconCssClass || this._options.groupIconImage)) {
          let groupableIconElm = document.createElement("span");
          groupableIconElm.className = "slick-column-groupable", this._options.groupIconCssClass && groupableIconElm.classList.add(...this._options.groupIconCssClass.split(" ")), this._options.groupIconImage && (groupableIconElm.style.background = `url(${this._options.groupIconImage}) no-repeat center center`), node.appendChild(groupableIconElm);
        }
      });
      for (let i = 0; i < this._gridColumns.length; i++) {
        let columnId = this._gridColumns[i].field;
        this._grid.updateColumnHeader(columnId);
      }
    }
    /**
     * Setup the column reordering
     * NOTE: this function is a standalone function and is called externally and does not have access to `this` instance
     * @param grid - slick grid object
     * @param headers - slick grid column header elements
     * @param _headerColumnWidthDiff - header column width difference
     * @param setColumns - callback to reassign columns
     * @param setupColumnResize - callback to setup the column resize
     * @param columns - columns array
     * @param getColumnIndex - callback to find index of a column
     * @param uid - grid UID
     * @param trigger - callback to execute when triggering a column grouping
     */
    getSetupColumnReorder(grid, headers, _headerColumnWidthDiff, setColumns, setupColumnResize, _columns, getColumnIndex, _uid, trigger) {
      this.destroySortableInstances();
      let dropzoneElm = grid.getPreHeaderPanel(), groupTogglerElm = dropzoneElm.querySelector(".slick-group-toggle-all"), sortableOptions = {
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
        //   return this.columnsGroupBy.some(c => c.id === target.getAttribute('data-id'));
        // },
        onStart: () => {
          dropzoneElm.classList.add("slick-dropzone-hover"), dropzoneElm.classList.add("slick-dropzone-placeholder-hover");
          let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
          draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "inline-block"), dropzoneElm.querySelectorAll(".slick-dropped-grouping").forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "none"), groupTogglerElm && (groupTogglerElm.style.display = "none");
        },
        onEnd: (e) => {
          var _a, _b, _c, _d, _e;
          let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
          dropzoneElm.classList.remove("slick-dropzone-hover"), draggablePlaceholderElm == null || draggablePlaceholderElm.classList.remove("slick-dropzone-placeholder-hover"), this._dropzonePlaceholder && (this._dropzonePlaceholder.style.display = "none"), draggablePlaceholderElm && ((_a = draggablePlaceholderElm.parentElement) == null || _a.classList.remove("slick-dropzone-placeholder-hover"));
          let droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
          if (droppedGroupingElms.length && (droppedGroupingElms.forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "inline-flex"), draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "none"), groupTogglerElm && (groupTogglerElm.style.display = "inline-block")), !grid.getEditorLock().commitCurrentEdit())
            return;
          let reorderedIds = (_c = (_b = this._sortableLeftInstance) == null ? void 0 : _b.toArray()) != null ? _c : [];
          if (headers.length > 1) {
            let ids = (_e = (_d = this._sortableRightInstance) == null ? void 0 : _d.toArray()) != null ? _e : [];
            for (let id of ids)
              reorderedIds.push(id);
          }
          let finalReorderedColumns = [], reorderedColumns = grid.getColumns();
          for (let reorderedId of reorderedIds)
            finalReorderedColumns.push(reorderedColumns[getColumnIndex.call(grid, reorderedId)]);
          setColumns.call(grid, finalReorderedColumns), trigger.call(grid, grid.onColumnsReordered, { grid }), e.stopPropagation(), setupColumnResize.call(grid);
        }
      };
      return this._sortableLeftInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-left`), sortableOptions), this._sortableRightInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-right`), sortableOptions), {
        sortableLeftInstance: this._sortableLeftInstance,
        sortableRightInstance: this._sortableRightInstance
      };
    }
    /**
     * Destroy plugin.
     */
    destroy() {
      var _a, _b;
      this.destroySortableInstances(), (_a = this._droppableInstance) != null && _a.el && ((_b = this._droppableInstance) == null || _b.destroy()), this.onGroupChanged.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), Utils.emptyElement(document.querySelector(`.${this._gridUid} .slick-preheader-panel`));
    }
    destroySortableInstances() {
      var _a, _b, _c, _d;
      (_a = this._sortableLeftInstance) != null && _a.el && ((_b = this._sortableLeftInstance) == null || _b.destroy()), (_c = this._sortableRightInstance) != null && _c.el && ((_d = this._sortableRightInstance) == null || _d.destroy());
    }
    addDragOverDropzoneListeners() {
      let draggablePlaceholderElm = this._dropzoneElm.querySelector(".slick-placeholder");
      draggablePlaceholderElm && this._dropzoneElm && (this._bindingEventService.bind(draggablePlaceholderElm, "dragover", (e) => e.preventDefault()), this._bindingEventService.bind(draggablePlaceholderElm, "dragenter", () => this._dropzoneElm.classList.add("slick-dropzone-hover")), this._bindingEventService.bind(draggablePlaceholderElm, "dragleave", () => this._dropzoneElm.classList.remove("slick-dropzone-hover")));
    }
    setupColumnDropbox() {
      let dropzoneElm = this._dropzoneElm;
      this._droppableInstance = Sortable.create(dropzoneElm, {
        group: "shared",
        // chosenClass: 'slick-header-column-active',
        ghostClass: "slick-droppable-sortitem-hover",
        draggable: ".slick-dropped-grouping",
        dragoverBubble: !0,
        onAdd: (evt) => {
          var _a;
          let el = evt.item, elId = el.getAttribute("id");
          elId != null && elId.replace(this._gridUid, "") && this.handleGroupByDrop(dropzoneElm, Sortable.utils.clone(evt.item)), evt.clone.style.opacity = ".5", (_a = el.parentNode) == null || _a.removeChild(el);
        },
        onUpdate: () => {
          var _a, _b;
          let sortArray = (_b = (_a = this._droppableInstance) == null ? void 0 : _a.toArray()) != null ? _b : [], newGroupingOrder = [];
          for (let i = 0, l = sortArray.length; i < l; i++)
            for (let a = 0, b = this._columnsGroupBy.length; a < b; a++)
              if (this._columnsGroupBy[a].id === sortArray[i]) {
                newGroupingOrder.push(this._columnsGroupBy[a]);
                break;
              }
          this._columnsGroupBy = newGroupingOrder, this.updateGroupBy("sort-group");
        }
      }), this.addDragOverDropzoneListeners(), this._groupToggler && this._bindingEventService.bind(this._groupToggler, "click", (event) => {
        let target = event.target;
        this.toggleGroupToggler(target, target == null ? void 0 : target.classList.contains("expanded"));
      });
    }
    handleGroupByDrop(containerElm, headerColumnElm) {
      var _a, _b;
      let headerColDataId = headerColumnElm.getAttribute("data-id"), columnId = headerColDataId == null ? void 0 : headerColDataId.replace(this._gridUid, ""), columnAllowed = !0;
      for (let colGroupBy of this._columnsGroupBy)
        colGroupBy.id === columnId && (columnAllowed = !1);
      if (columnAllowed) {
        for (let col of this._gridColumns)
          if (col.id === columnId && col.grouping && !Utils.isEmptyObject(col.grouping)) {
            let columnNameElm = headerColumnElm.querySelector(".slick-column-name"), entryElm = document.createElement("div");
            entryElm.id = `${this._gridUid}_${col.id}_entry`, entryElm.className = "slick-dropped-grouping", entryElm.dataset.id = `${col.id}`;
            let groupTextElm = document.createElement("div");
            groupTextElm.className = "slick-dropped-grouping-title", groupTextElm.style.display = "inline-flex", groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent, entryElm.appendChild(groupTextElm);
            let groupRemoveIconElm = document.createElement("div");
            groupRemoveIconElm.className = "slick-groupby-remove", this._options.deleteIconCssClass && groupRemoveIconElm.classList.add(...this._options.deleteIconCssClass.split(" ")), this._options.deleteIconImage && groupRemoveIconElm.classList.add(...this._options.deleteIconImage.split(" ")), this._options.deleteIconCssClass || groupRemoveIconElm.classList.add("slick-groupby-remove-icon"), !this._options.deleteIconCssClass && !this._options.deleteIconImage && groupRemoveIconElm.classList.add("slick-groupby-remove-image"), ((_a = this._options) == null ? void 0 : _a.hideGroupSortIcons) !== !0 && col.sortable && ((_b = col.grouping) == null ? void 0 : _b.sortAsc) === void 0 && (col.grouping.sortAsc = !0), entryElm.appendChild(groupRemoveIconElm), entryElm.appendChild(document.createElement("div")), containerElm.appendChild(entryElm), this.addColumnGroupBy(col), this.addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
          }
        this._groupToggler && this._columnsGroupBy.length > 0 && (this._groupToggler.style.display = "inline-block");
      }
    }
    addColumnGroupBy(column) {
      this._columnsGroupBy.push(column), this.updateGroupBy("add-group");
    }
    addGroupByRemoveClickHandler(id, groupRemoveIconElm, headerColumnElm, entry) {
      this._bindingEventService.bind(groupRemoveIconElm, "click", () => {
        let boundedElms = this._bindingEventService.getBoundedEvents().filter((boundedEvent) => boundedEvent.element === groupRemoveIconElm);
        for (let boundedEvent of boundedElms)
          this._bindingEventService.unbind(boundedEvent.element, "click", boundedEvent.listener);
        this.removeGroupBy(id, headerColumnElm, entry);
      });
    }
    setDroppedGroups(groupingInfo) {
      let groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
      this._dropzonePlaceholder.style.display = "none";
      for (let groupInfo of groupingInfos) {
        let columnElm = this._grid.getHeaderColumn(groupInfo);
        this.handleGroupByDrop(this._dropzoneElm, columnElm);
      }
    }
    clearDroppedGroups() {
      this._columnsGroupBy = [], this.updateGroupBy("clear-all");
      let allDroppedGroupingElms = this._dropzoneElm.querySelectorAll(".slick-dropped-grouping");
      for (let groupElm of Array.from(allDroppedGroupingElms)) {
        let groupRemoveBtnElm = this._dropzoneElm.querySelector(".slick-groupby-remove");
        groupRemoveBtnElm == null || groupRemoveBtnElm.remove(), groupElm == null || groupElm.remove();
      }
      this._dropzonePlaceholder.style.display = "inline-block", this._groupToggler && (this._groupToggler.style.display = "none");
    }
    removeFromArray(arrayToModify, itemToRemove) {
      if (Array.isArray(arrayToModify)) {
        let itemIdx = arrayToModify.findIndex((a) => a.id === itemToRemove.id);
        itemIdx >= 0 && arrayToModify.splice(itemIdx, 1);
      }
      return arrayToModify;
    }
    removeGroupBy(id, _hdrColumnElm, entry) {
      entry.remove();
      let groupby = [];
      this._gridColumns.forEach((col) => groupby[col.id] = col), this.removeFromArray(this._columnsGroupBy, groupby[id]), this._columnsGroupBy.length === 0 && (this._dropzonePlaceholder.style.display = "block", this._groupToggler && (this._groupToggler.style.display = "none")), this.updateGroupBy("remove-group");
    }
    toggleGroupToggler(targetElm, collapsing = !0, shouldExecuteDataViewCommand = !0) {
      targetElm && (collapsing === !0 ? (targetElm.classList.add("collapsed"), targetElm.classList.remove("expanded"), shouldExecuteDataViewCommand && this._dataView.collapseAllGroups()) : (targetElm.classList.remove("collapsed"), targetElm.classList.add("expanded"), shouldExecuteDataViewCommand && this._dataView.expandAllGroups()));
    }
    updateGroupBy(originator) {
      if (this._columnsGroupBy.length === 0) {
        this._dataView.setGrouping([]), this.onGroupChanged.notify({ caller: originator, groupColumns: [] });
        return;
      }
      let groupingArray = [];
      this._columnsGroupBy.forEach((element) => groupingArray.push(element.grouping)), this._dataView.setGrouping(groupingArray), this.onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      DraggableGrouping: SlickDraggableGrouping
    }
  });
})();
//# sourceMappingURL=slick.draggablegrouping.js.map
