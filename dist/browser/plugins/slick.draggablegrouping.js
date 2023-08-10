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

  // src/plugins/slick.draggablegrouping.js
  var require_slick_draggablegrouping = __commonJS({
    "src/plugins/slick.draggablegrouping.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickDraggableGrouping = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickDraggableGrouping = (
        /** @class */
        function() {
          function SlickDraggableGrouping2(options) {
            this.pluginName = "DraggableGrouping", this.onGroupChanged = new SlickEvent(), this._gridUid = "", this._gridColumns = [], this._defaults = {
              dropPlaceHolderText: "Drop a column header here to group by the column",
              hideGroupSortIcons: !1,
              hideToggleAllButton: !1,
              toggleAllButtonText: "",
              toggleAllPlaceholderText: "Toggle all Groups"
            }, this._bindingEventService = new BindingEventService(), this._handler = new SlickEventHandler(), this._columnsGroupBy = [], this._options = Utils.extend(!0, {}, this._defaults, options);
          }
          return SlickDraggableGrouping2.prototype.init = function(grid) {
            var _this = this;
            this._grid = grid, this._gridUid = this._grid.getUID(), this._gridColumns = this._grid.getColumns(), this._dataView = this._grid.getData(), this._dropzoneElm = this._grid.getPreHeaderPanel(), this._dropzoneElm.classList.add("slick-dropzone");
            var dropPlaceHolderText = this._options.dropPlaceHolderText || "Drop a column header here to group by the column";
            this._dropzonePlaceholder = document.createElement("div"), this._dropzonePlaceholder.className = "slick-placeholder", this._dropzonePlaceholder.textContent = dropPlaceHolderText, this._groupToggler = document.createElement("div"), this._groupToggler.className = "slick-group-toggle-all expanded", this._groupToggler.style.display = "none", this._dropzoneElm.appendChild(this._dropzonePlaceholder), this._dropzoneElm.appendChild(this._groupToggler), this.setupColumnDropbox(), this._handler.subscribe(this._grid.onHeaderCellRendered, function(_e, args) {
              var _a, column = args.column, node = args.node;
              if (!Utils.isEmptyObject(column.grouping) && node && (node.style.cursor = "pointer", _this._options.groupIconCssClass || _this._options.groupIconImage)) {
                var groupableIconElm = document.createElement("span");
                groupableIconElm.className = "slick-column-groupable", _this._options.groupIconCssClass && (_a = groupableIconElm.classList).add.apply(_a, _this._options.groupIconCssClass.split(" ")), _this._options.groupIconImage && (groupableIconElm.style.background = "url(".concat(_this._options.groupIconImage, ") no-repeat center center")), node.appendChild(groupableIconElm);
              }
            });
            for (var i = 0; i < this._gridColumns.length; i++) {
              var columnId = this._gridColumns[i].field;
              this._grid.updateColumnHeader(columnId);
            }
          }, SlickDraggableGrouping2.prototype.getSetupColumnReorder = function(grid, headers, _headerColumnWidthDiff, setColumns, setupColumnResize, _columns, getColumnIndex, _uid, trigger) {
            var _this = this;
            this.destroySortableInstances();
            var dropzoneElm = grid.getPreHeaderPanel(), groupTogglerElm = dropzoneElm.querySelector(".slick-group-toggle-all"), sortableOptions = {
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
              onStart: function() {
                dropzoneElm.classList.add("slick-dropzone-hover"), dropzoneElm.classList.add("slick-dropzone-placeholder-hover");
                var draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
                draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "inline-block");
                var droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
                droppedGroupingElms.forEach(function(droppedGroupingElm) {
                  return droppedGroupingElm.style.display = "none";
                }), groupTogglerElm && (groupTogglerElm.style.display = "none");
              },
              onEnd: function(e) {
                var _a, _b, _c, _d, _f, draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
                dropzoneElm.classList.remove("slick-dropzone-hover"), draggablePlaceholderElm == null || draggablePlaceholderElm.classList.remove("slick-dropzone-placeholder-hover"), _this._dropzonePlaceholder && (_this._dropzonePlaceholder.style.display = "none"), draggablePlaceholderElm && ((_a = draggablePlaceholderElm.parentElement) === null || _a === void 0 || _a.classList.remove("slick-dropzone-placeholder-hover"));
                var droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
                if (droppedGroupingElms.length && (droppedGroupingElms.forEach(function(droppedGroupingElm) {
                  return droppedGroupingElm.style.display = "inline-flex";
                }), draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "none"), groupTogglerElm && (groupTogglerElm.style.display = "inline-block")), !!grid.getEditorLock().commitCurrentEdit()) {
                  var reorderedIds = (_c = (_b = _this._sortableLeftInstance) === null || _b === void 0 ? void 0 : _b.toArray()) !== null && _c !== void 0 ? _c : [];
                  if (headers.length > 1)
                    for (var ids = (_f = (_d = _this._sortableRightInstance) === null || _d === void 0 ? void 0 : _d.toArray()) !== null && _f !== void 0 ? _f : [], _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                      var id = ids_1[_i];
                      reorderedIds.push(id);
                    }
                  for (var finalReorderedColumns = [], reorderedColumns = grid.getColumns(), _g = 0, reorderedIds_1 = reorderedIds; _g < reorderedIds_1.length; _g++) {
                    var reorderedId = reorderedIds_1[_g];
                    finalReorderedColumns.push(reorderedColumns[getColumnIndex.call(grid, reorderedId)]);
                  }
                  setColumns.call(grid, finalReorderedColumns), trigger.call(grid, grid.onColumnsReordered, { grid }), e.stopPropagation(), setupColumnResize.call(grid);
                }
              }
            };
            return this._sortableLeftInstance = Sortable.create(document.querySelector(".".concat(grid.getUID(), " .slick-header-columns.slick-header-columns-left")), sortableOptions), this._sortableRightInstance = Sortable.create(document.querySelector(".".concat(grid.getUID(), " .slick-header-columns.slick-header-columns-right")), sortableOptions), {
              sortableLeftInstance: this._sortableLeftInstance,
              sortableRightInstance: this._sortableRightInstance
            };
          }, SlickDraggableGrouping2.prototype.destroy = function() {
            this.destroySortableInstances(), this.onGroupChanged.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), Utils.emptyElement(document.querySelector(".".concat(this._gridUid, " .slick-preheader-panel")));
          }, SlickDraggableGrouping2.prototype.destroySortableInstances = function() {
            var _a, _b, _c, _d;
            !((_a = this._sortableLeftInstance) === null || _a === void 0) && _a.el && ((_b = this._sortableLeftInstance) === null || _b === void 0 || _b.destroy()), !((_c = this._sortableRightInstance) === null || _c === void 0) && _c.el && ((_d = this._sortableRightInstance) === null || _d === void 0 || _d.destroy());
          }, SlickDraggableGrouping2.prototype.addDragOverDropzoneListeners = function() {
            var _this = this, draggablePlaceholderElm = this._dropzoneElm.querySelector(".slick-placeholder");
            draggablePlaceholderElm && this._dropzoneElm && (this._bindingEventService.bind(draggablePlaceholderElm, "dragover", function(e) {
              return e.preventDefault();
            }), this._bindingEventService.bind(draggablePlaceholderElm, "dragenter", function() {
              return _this._dropzoneElm.classList.add("slick-dropzone-hover");
            }), this._bindingEventService.bind(draggablePlaceholderElm, "dragleave", function() {
              return _this._dropzoneElm.classList.remove("slick-dropzone-hover");
            }));
          }, SlickDraggableGrouping2.prototype.setupColumnDropbox = function() {
            var _this = this, dropzoneElm = this._dropzoneElm;
            this._droppableInstance = Sortable.create(dropzoneElm, {
              group: "shared",
              // chosenClass: 'slick-header-column-active',
              ghostClass: "slick-droppable-sortitem-hover",
              draggable: ".slick-dropped-grouping",
              dragoverBubble: !0,
              onAdd: function(evt) {
                var _a, el = evt.item, elId = el.getAttribute("id");
                elId != null && elId.replace(_this._gridUid, "") && _this.handleGroupByDrop(dropzoneElm, Sortable.utils.clone(evt.item)), evt.clone.style.opacity = ".5", (_a = el.parentNode) === null || _a === void 0 || _a.removeChild(el);
              },
              onUpdate: function() {
                for (var _a, _b, sortArray = (_b = (_a = _this._droppableInstance) === null || _a === void 0 ? void 0 : _a.toArray()) !== null && _b !== void 0 ? _b : [], newGroupingOrder = [], i = 0, l = sortArray.length; i < l; i++)
                  for (var a = 0, b = _this._columnsGroupBy.length; a < b; a++)
                    if (_this._columnsGroupBy[a].id == sortArray[i]) {
                      newGroupingOrder.push(_this._columnsGroupBy[a]);
                      break;
                    }
                _this._columnsGroupBy = newGroupingOrder, _this.updateGroupBy("sort-group");
              }
            }), this.addDragOverDropzoneListeners(), this._groupToggler && this._bindingEventService.bind(this._groupToggler, "click", function(event) {
              var target = event.target;
              _this.toggleGroupToggler(target, target == null ? void 0 : target.classList.contains("expanded"));
            });
          }, SlickDraggableGrouping2.prototype.handleGroupByDrop = function(containerElm, headerColumnElm) {
            for (var _a, _b, _c, _d, headerColDataId = headerColumnElm.getAttribute("data-id"), columnId = headerColDataId == null ? void 0 : headerColDataId.replace(this._gridUid, ""), columnAllowed = !0, _i = 0, _f = this._columnsGroupBy; _i < _f.length; _i++) {
              var colGroupBy = _f[_i];
              colGroupBy.id === columnId && (columnAllowed = !1);
            }
            if (columnAllowed) {
              for (var _g = 0, _h = this._gridColumns; _g < _h.length; _g++) {
                var col = _h[_g];
                if (col.id === columnId && col.grouping && !Utils.isEmptyObject(col.grouping)) {
                  var columnNameElm = headerColumnElm.querySelector(".slick-column-name"), entryElm = document.createElement("div");
                  entryElm.id = "".concat(this._gridUid, "_").concat(col.id, "_entry"), entryElm.className = "slick-dropped-grouping", entryElm.dataset.id = "".concat(col.id);
                  var groupTextElm = document.createElement("div");
                  groupTextElm.className = "slick-dropped-grouping-title", groupTextElm.style.display = "inline-flex", groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent, entryElm.appendChild(groupTextElm);
                  var groupRemoveIconElm = document.createElement("div");
                  groupRemoveIconElm.className = "slick-groupby-remove", this._options.deleteIconCssClass && (_a = groupRemoveIconElm.classList).add.apply(_a, this._options.deleteIconCssClass.split(" ")), this._options.deleteIconImage && (_b = groupRemoveIconElm.classList).add.apply(_b, this._options.deleteIconImage.split(" ")), this._options.deleteIconCssClass || groupRemoveIconElm.classList.add("slick-groupby-remove-icon"), !this._options.deleteIconCssClass && !this._options.deleteIconImage && groupRemoveIconElm.classList.add("slick-groupby-remove-image"), ((_c = this._options) === null || _c === void 0 ? void 0 : _c.hideGroupSortIcons) !== !0 && col.sortable && ((_d = col.grouping) === null || _d === void 0 ? void 0 : _d.sortAsc) === void 0 && (col.grouping.sortAsc = !0), entryElm.appendChild(groupRemoveIconElm), entryElm.appendChild(document.createElement("div")), containerElm.appendChild(entryElm), this.addColumnGroupBy(col), this.addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
                }
              }
              this._groupToggler && this._columnsGroupBy.length > 0 && (this._groupToggler.style.display = "inline-block");
            }
          }, SlickDraggableGrouping2.prototype.addColumnGroupBy = function(column) {
            this._columnsGroupBy.push(column), this.updateGroupBy("add-group");
          }, SlickDraggableGrouping2.prototype.addGroupByRemoveClickHandler = function(id, groupRemoveIconElm, headerColumnElm, entry) {
            var _this = this;
            this._bindingEventService.bind(groupRemoveIconElm, "click", function() {
              for (var boundedElms = _this._bindingEventService.getBoundedEvents().filter(function(boundedEvent2) {
                return boundedEvent2.element === groupRemoveIconElm;
              }), _i = 0, boundedElms_1 = boundedElms; _i < boundedElms_1.length; _i++) {
                var boundedEvent = boundedElms_1[_i];
                _this._bindingEventService.unbind(boundedEvent.element, "click", boundedEvent.listener);
              }
              _this.removeGroupBy(id, headerColumnElm, entry);
            });
          }, SlickDraggableGrouping2.prototype.setDroppedGroups = function(groupingInfo) {
            var groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
            this._dropzonePlaceholder.style.display = "none";
            for (var _i = 0, groupingInfos_1 = groupingInfos; _i < groupingInfos_1.length; _i++) {
              var groupInfo = groupingInfos_1[_i], columnElm = this._grid.getHeaderColumn(groupInfo);
              this.handleGroupByDrop(this._dropzoneElm, columnElm);
            }
          }, SlickDraggableGrouping2.prototype.clearDroppedGroups = function() {
            this._columnsGroupBy = [], this.updateGroupBy("clear-all");
            for (var allDroppedGroupingElms = this._dropzoneElm.querySelectorAll(".slick-dropped-grouping"), _i = 0, _a = Array.from(allDroppedGroupingElms); _i < _a.length; _i++) {
              var groupElm = _a[_i], groupRemoveBtnElm = this._dropzoneElm.querySelector(".slick-groupby-remove");
              groupRemoveBtnElm == null || groupRemoveBtnElm.remove(), groupElm == null || groupElm.remove();
            }
            this._dropzonePlaceholder.style.display = "inline-block", this._groupToggler && (this._groupToggler.style.display = "none");
          }, SlickDraggableGrouping2.prototype.removeFromArray = function(arrayToModify, itemToRemove) {
            if (Array.isArray(arrayToModify)) {
              var itemIdx = arrayToModify.findIndex(function(a) {
                return a.id === itemToRemove.id;
              });
              itemIdx >= 0 && arrayToModify.splice(itemIdx, 1);
            }
            return arrayToModify;
          }, SlickDraggableGrouping2.prototype.removeGroupBy = function(id, _hdrColumnElm, entry) {
            entry.remove();
            var groupby = [];
            this._gridColumns.forEach(function(col) {
              return groupby[col.id] = col;
            }), this.removeFromArray(this._columnsGroupBy, groupby[id]), this._columnsGroupBy.length === 0 && (this._dropzonePlaceholder.style.display = "block", this._groupToggler && (this._groupToggler.style.display = "none")), this.updateGroupBy("remove-group");
          }, SlickDraggableGrouping2.prototype.toggleGroupToggler = function(targetElm, collapsing, shouldExecuteDataViewCommand) {
            collapsing === void 0 && (collapsing = !0), shouldExecuteDataViewCommand === void 0 && (shouldExecuteDataViewCommand = !0), targetElm && (collapsing === !0 ? (targetElm.classList.add("collapsed"), targetElm.classList.remove("expanded"), shouldExecuteDataViewCommand && this._dataView.collapseAllGroups()) : (targetElm.classList.remove("collapsed"), targetElm.classList.add("expanded"), shouldExecuteDataViewCommand && this._dataView.expandAllGroups()));
          }, SlickDraggableGrouping2.prototype.updateGroupBy = function(originator) {
            if (this._columnsGroupBy.length === 0) {
              this._dataView.setGrouping([]), this.onGroupChanged.notify({ caller: originator, groupColumns: [] });
              return;
            }
            var groupingArray = [];
            this._columnsGroupBy.forEach(function(element) {
              return groupingArray.push(element.grouping);
            }), this._dataView.setGrouping(groupingArray), this.onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
          }, SlickDraggableGrouping2;
        }()
      );
      exports.SlickDraggableGrouping = SlickDraggableGrouping;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          DraggableGrouping: SlickDraggableGrouping
        }
      });
    }
  });
  require_slick_draggablegrouping();
})();
//# sourceMappingURL=slick.draggablegrouping.js.map
