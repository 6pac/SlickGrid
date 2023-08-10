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

  // src/plugins/slick.checkboxselectcolumn.js
  var require_slick_checkboxselectcolumn = __commonJS({
    "src/plugins/slick.checkboxselectcolumn.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCheckboxSelectColumn = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickCheckboxSelectColumn = (
        /** @class */
        function() {
          function SlickCheckboxSelectColumn2(options) {
            this.pluginName = "CheckboxSelectColumn", this._isUsingDataView = !1, this._selectableOverride = null, this._handler = new SlickEventHandler(), this._selectedRowsLookup = {}, this._checkboxColumnCellIndex = null, this._defaults = {
              columnId: "_checkbox_selector",
              cssClass: void 0,
              hideSelectAllCheckbox: !1,
              toolTip: "Select/Deselect All",
              width: 30,
              applySelectOnAllPages: !1,
              hideInColumnTitleRow: !1,
              hideInFilterHeaderRow: !0
            }, this._isSelectAllChecked = !1, this._bindingEventService = new BindingEventService(), this._options = Utils.extend(!0, {}, this._defaults, options), this._selectAll_UID = this.createUID(), typeof this._options.selectableOverride == "function" && this.selectableOverride(this._options.selectableOverride);
          }
          return SlickCheckboxSelectColumn2.prototype.init = function(grid) {
            this._grid = grid, this._isUsingDataView = !Array.isArray(grid.getData()), this._isUsingDataView && (this._dataView = grid.getData()), this._handler.subscribe(this._grid.onSelectedRowsChanged, this.handleSelectedRowsChanged.bind(this)).subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onKeyDown, this.handleKeyDown.bind(this)), this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages && this._handler.subscribe(this._dataView.onSelectedRowIdsChanged, this.handleDataViewSelectedIdsChanged.bind(this)).subscribe(this._dataView.onPagingInfoChanged, this.handleDataViewSelectedIdsChanged.bind(this)), this._options.hideInFilterHeaderRow || this.addCheckboxToFilterHeaderRow(grid), this._options.hideInColumnTitleRow || this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this));
          }, SlickCheckboxSelectColumn2.prototype.destroy = function() {
            this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
          }, SlickCheckboxSelectColumn2.prototype.getOptions = function() {
            return this._options;
          }, SlickCheckboxSelectColumn2.prototype.setOptions = function(options) {
            var _a;
            if (this._options = Utils.extend(!0, {}, this._options, options), this._options.hideSelectAllCheckbox)
              this.hideSelectAllFromColumnHeaderTitleRow(), this.hideSelectAllFromColumnHeaderFilterRow();
            else if (this._options.hideInColumnTitleRow ? this.hideSelectAllFromColumnHeaderTitleRow() : (this.renderSelectAllCheckbox(this._isSelectAllChecked), this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this))), this._options.hideInFilterHeaderRow)
              this.hideSelectAllFromColumnHeaderFilterRow();
            else {
              var selectAllContainerElm = (_a = this._headerRowNode) === null || _a === void 0 ? void 0 : _a.querySelector("#filter-checkbox-selectall-container");
              if (selectAllContainerElm) {
                selectAllContainerElm.style.display = "flex";
                var selectAllInputElm = selectAllContainerElm.querySelector('input[type="checkbox"]');
                selectAllInputElm && (selectAllInputElm.checked = this._isSelectAllChecked);
              }
            }
          }, SlickCheckboxSelectColumn2.prototype.hideSelectAllFromColumnHeaderTitleRow = function() {
            this._grid.updateColumnHeader(this._options.columnId || "", "", "");
          }, SlickCheckboxSelectColumn2.prototype.hideSelectAllFromColumnHeaderFilterRow = function() {
            var _a, selectAllContainerElm = (_a = this._headerRowNode) === null || _a === void 0 ? void 0 : _a.querySelector("#filter-checkbox-selectall-container");
            selectAllContainerElm && (selectAllContainerElm.style.display = "none");
          }, SlickCheckboxSelectColumn2.prototype.handleSelectedRowsChanged = function() {
            var _a, _b, selectedRows = this._grid.getSelectedRows(), lookup = {}, row = 0, i = 0, k = 0, disabledCount = 0;
            if (typeof this._selectableOverride == "function")
              for (k = 0; k < this._grid.getDataLength(); k++) {
                var dataItem = this._grid.getDataItem(k);
                this.checkSelectableOverride(i, dataItem, this._grid) || disabledCount++;
              }
            var removeList = [];
            for (i = 0; i < selectedRows.length; i++) {
              row = selectedRows[i];
              var rowItem = this._grid.getDataItem(row);
              this.checkSelectableOverride(i, rowItem, this._grid) ? (lookup[row] = !0, lookup[row] !== this._selectedRowsLookup[row] && (this._grid.invalidateRow(row), delete this._selectedRowsLookup[row])) : removeList.push(row);
            }
            for (var selectedRow in this._selectedRowsLookup)
              this._grid.invalidateRow(+selectedRow);
            if (this._selectedRowsLookup = lookup, this._grid.render(), this._isSelectAllChecked = ((_a = selectedRows == null ? void 0 : selectedRows.length) !== null && _a !== void 0 ? _a : 0) + disabledCount >= this._grid.getDataLength(), (!this._isUsingDataView || !this._options.applySelectOnAllPages) && (!this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow)) {
              var selectAllElm = (_b = this._headerRowNode) === null || _b === void 0 ? void 0 : _b.querySelector("#header-filter-selector".concat(this._selectAll_UID));
              selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
            }
            if (removeList.length > 0) {
              for (i = 0; i < removeList.length; i++) {
                var remIdx = selectedRows.indexOf(removeList[i]);
                selectedRows.splice(remIdx, 1);
              }
              this._grid.setSelectedRows(selectedRows, "click.cleanup");
            }
          }, SlickCheckboxSelectColumn2.prototype.handleDataViewSelectedIdsChanged = function() {
            var _a, selectedIds = this._dataView.getAllSelectedFilteredIds(), filteredItems = this._dataView.getFilteredItems(), disabledCount = 0;
            if (typeof this._selectableOverride == "function" && selectedIds.length > 0)
              for (var _loop_1 = function(k2) {
                var dataItem = this_1._dataView.getItemByIdx(k2), idProperty = this_1._dataView.getIdPropertyName(), dataItemId = dataItem[idProperty], foundItemIdx = filteredItems.findIndex(function(item) {
                  return item[idProperty] === dataItemId;
                });
                foundItemIdx >= 0 && !this_1.checkSelectableOverride(k2, dataItem, this_1._grid) && disabledCount++;
              }, this_1 = this, k = 0; k < this._dataView.getItemCount(); k++)
                _loop_1(k);
            if (this._isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length, !this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow) {
              var selectAllElm = (_a = this._headerRowNode) === null || _a === void 0 ? void 0 : _a.querySelector("#header-filter-selector".concat(this._selectAll_UID));
              selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
            }
          }, SlickCheckboxSelectColumn2.prototype.handleKeyDown = function(e, args) {
            e.which == 32 && this._grid.getColumns()[args.cell].id === this._options.columnId && ((!this._grid.getEditorLock().isActive() || this._grid.getEditorLock().commitCurrentEdit()) && this.toggleRowSelection(args.row), e.preventDefault(), e.stopImmediatePropagation());
          }, SlickCheckboxSelectColumn2.prototype.handleClick = function(e, args) {
            if (this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.type === "checkbox") {
              if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
                e.preventDefault(), e.stopImmediatePropagation();
                return;
              }
              this.toggleRowSelection(args.row), e.stopPropagation(), e.stopImmediatePropagation();
            }
          }, SlickCheckboxSelectColumn2.prototype.toggleRowSelection = function(row) {
            var dataContext = this._grid.getDataItem(row);
            if (this.checkSelectableOverride(row, dataContext, this._grid)) {
              if (this._selectedRowsLookup[row]) {
                var newSelectedRows = this._grid.getSelectedRows().filter(function(n) {
                  return n !== row;
                });
                this._grid.setSelectedRows(newSelectedRows, "click.toggle");
              } else
                this._grid.setSelectedRows(this._grid.getSelectedRows().concat(row), "click.toggle");
              this._grid.setActiveCell(row, this.getCheckboxColumnCellIndex());
            }
          }, SlickCheckboxSelectColumn2.prototype.selectRows = function(rowArray) {
            for (var addRows = [], i = 0, l = rowArray.length; i < l; i++)
              this._selectedRowsLookup[rowArray[i]] || (addRows[addRows.length] = rowArray[i]);
            this._grid.setSelectedRows(this._grid.getSelectedRows().concat(addRows), "SlickCheckboxSelectColumn.selectRows");
          }, SlickCheckboxSelectColumn2.prototype.deSelectRows = function(rowArray) {
            for (var removeRows = [], i = 0, l = rowArray.length; i < l; i++)
              this._selectedRowsLookup[rowArray[i]] && (removeRows[removeRows.length] = rowArray[i]);
            this._grid.setSelectedRows(this._grid.getSelectedRows().filter(function(n) {
              return removeRows.indexOf(n) < 0;
            }), "SlickCheckboxSelectColumn.deSelectRows");
          }, SlickCheckboxSelectColumn2.prototype.handleHeaderClick = function(e, args) {
            if (args.column.id == this._options.columnId && e.target.type === "checkbox") {
              if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
                e.preventDefault(), e.stopImmediatePropagation();
                return;
              }
              var isAllSelected = e.target.checked, caller = isAllSelected ? "click.selectAll" : "click.unselectAll", rows = [];
              if (isAllSelected) {
                for (var i = 0; i < this._grid.getDataLength(); i++) {
                  var rowItem = this._grid.getDataItem(i);
                  !rowItem.__group && !rowItem.__groupTotals && this.checkSelectableOverride(i, rowItem, this._grid) && rows.push(i);
                }
                isAllSelected = !0;
              }
              if (this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages) {
                for (var ids = [], filteredItems = this._dataView.getFilteredItems(), j = 0; j < filteredItems.length; j++) {
                  var dataviewRowItem = filteredItems[j];
                  this.checkSelectableOverride(j, dataviewRowItem, this._grid) && ids.push(dataviewRowItem[this._dataView.getIdPropertyName()]);
                }
                this._dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
              }
              this._grid.setSelectedRows(rows, caller), e.stopPropagation(), e.stopImmediatePropagation();
            }
          }, SlickCheckboxSelectColumn2.prototype.getCheckboxColumnCellIndex = function() {
            if (this._checkboxColumnCellIndex === null) {
              this._checkboxColumnCellIndex = 0;
              for (var colArr = this._grid.getColumns(), i = 0; i < colArr.length; i++)
                colArr[i].id == this._options.columnId && (this._checkboxColumnCellIndex = i);
            }
            return this._checkboxColumnCellIndex;
          }, SlickCheckboxSelectColumn2.prototype.getColumnDefinition = function() {
            var _a, _b, _c;
            return {
              id: this._options.columnId,
              name: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : '<input id="header-selector'.concat(this._selectAll_UID, '" type="checkbox"><label for="header-selector').concat(this._selectAll_UID, '"></label>'),
              toolTip: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : this._options.toolTip,
              field: "sel",
              width: this._options.width,
              resizable: !1,
              sortable: !1,
              cssClass: this._options.cssClass,
              hideSelectAllCheckbox: this._options.hideSelectAllCheckbox,
              formatter: this.checkboxSelectionFormatter.bind(this),
              // exclude from all menus, defaults to true unless the option is provided differently by the user
              excludeFromColumnPicker: (_a = this._options.excludeFromColumnPicker) !== null && _a !== void 0 ? _a : !0,
              excludeFromGridMenu: (_b = this._options.excludeFromGridMenu) !== null && _b !== void 0 ? _b : !0,
              excludeFromHeaderMenu: (_c = this._options.excludeFromHeaderMenu) !== null && _c !== void 0 ? _c : !0
            };
          }, SlickCheckboxSelectColumn2.prototype.addCheckboxToFilterHeaderRow = function(grid) {
            var _this = this;
            this._handler.subscribe(grid.onHeaderRowCellRendered, function(_e, args) {
              if (args.column.field === "sel") {
                Utils.emptyElement(args.node);
                var spanElm = document.createElement("span");
                spanElm.id = "filter-checkbox-selectall-container";
                var inputElm = document.createElement("input");
                inputElm.type = "checkbox", inputElm.id = "header-filter-selector".concat(_this._selectAll_UID);
                var labelElm = document.createElement("label");
                labelElm.htmlFor = "header-filter-selector".concat(_this._selectAll_UID), spanElm.appendChild(inputElm), spanElm.appendChild(labelElm), args.node.appendChild(spanElm), _this._headerRowNode = args.node, _this._bindingEventService.bind(spanElm, "click", function(e) {
                  return _this.handleHeaderClick(e, args);
                });
              }
            });
          }, SlickCheckboxSelectColumn2.prototype.createUID = function() {
            return Math.round(1e7 * Math.random());
          }, SlickCheckboxSelectColumn2.prototype.checkboxSelectionFormatter = function(row, _cell, _val, _columnDef, dataContext, grid) {
            var UID = this.createUID() + row;
            return dataContext && this.checkSelectableOverride(row, dataContext, grid) ? this._selectedRowsLookup[row] ? '<input id="selector'.concat(UID, '" type="checkbox" checked="checked"><label for="selector').concat(UID, '"></label>') : '<input id="selector'.concat(UID, '" type="checkbox"><label for="selector').concat(UID, '"></label>') : null;
          }, SlickCheckboxSelectColumn2.prototype.checkSelectableOverride = function(row, dataContext, grid) {
            return typeof this._selectableOverride == "function" ? this._selectableOverride(row, dataContext, grid) : !0;
          }, SlickCheckboxSelectColumn2.prototype.renderSelectAllCheckbox = function(isSelectAllChecked) {
            isSelectAllChecked ? this._grid.updateColumnHeader(this._options.columnId || "", '<input id="header-selector'.concat(this._selectAll_UID, '" type="checkbox" checked="checked"><label for="header-selector').concat(this._selectAll_UID, '"></label>'), this._options.toolTip) : this._grid.updateColumnHeader(this._options.columnId || "", '<input id="header-selector'.concat(this._selectAll_UID, '" type="checkbox"><label for="header-selector').concat(this._selectAll_UID, '"></label>'), this._options.toolTip);
          }, SlickCheckboxSelectColumn2.prototype.selectableOverride = function(overrideFn) {
            this._selectableOverride = overrideFn;
          }, SlickCheckboxSelectColumn2;
        }()
      );
      exports.SlickCheckboxSelectColumn = SlickCheckboxSelectColumn;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          CheckboxSelectColumn: SlickCheckboxSelectColumn
        }
      });
    }
  });
  require_slick_checkboxselectcolumn();
})();
//# sourceMappingURL=slick.checkboxselectcolumn.js.map
