"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.checkboxselectcolumn.ts
  var BindingEventService = Slick.BindingEventService, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickCheckboxSelectColumn = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "CheckboxSelectColumn");
      // --
      // protected props
      __publicField(this, "_dataView");
      __publicField(this, "_grid");
      __publicField(this, "_isUsingDataView", !1);
      __publicField(this, "_selectableOverride", null);
      __publicField(this, "_headerRowNode");
      __publicField(this, "_selectAll_UID");
      __publicField(this, "_handler", new SlickEventHandler());
      __publicField(this, "_selectedRowsLookup", {});
      __publicField(this, "_checkboxColumnCellIndex", null);
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        columnId: "_checkbox_selector",
        cssClass: void 0,
        hideSelectAllCheckbox: !1,
        toolTip: "Select/Deselect All",
        width: 30,
        applySelectOnAllPages: !1,
        // defaults to false, when that is enabled the "Select All" will be applied to all pages (when using Pagination)
        hideInColumnTitleRow: !1,
        hideInFilterHeaderRow: !0
      });
      __publicField(this, "_isSelectAllChecked", !1);
      __publicField(this, "_bindingEventService");
      this._bindingEventService = new BindingEventService(), this._options = Utils.extend(!0, {}, this._defaults, options), this._selectAll_UID = this.createUID(), typeof this._options.selectableOverride == "function" && this.selectableOverride(this._options.selectableOverride);
    }
    init(grid) {
      this._grid = grid, this._isUsingDataView = !Array.isArray(grid.getData()), this._isUsingDataView && (this._dataView = grid.getData()), this._handler.subscribe(this._grid.onSelectedRowsChanged, this.handleSelectedRowsChanged.bind(this)).subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onKeyDown, this.handleKeyDown.bind(this)), this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages && this._handler.subscribe(this._dataView.onSelectedRowIdsChanged, this.handleDataViewSelectedIdsChanged.bind(this)).subscribe(this._dataView.onPagingInfoChanged, this.handleDataViewSelectedIdsChanged.bind(this)), this._options.hideInFilterHeaderRow || this.addCheckboxToFilterHeaderRow(grid), this._options.hideInColumnTitleRow || this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this));
    }
    destroy() {
      this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
    }
    getOptions() {
      return this._options;
    }
    setOptions(options) {
      var _a;
      if (this._options = Utils.extend(!0, {}, this._options, options), this._options.hideSelectAllCheckbox)
        this.hideSelectAllFromColumnHeaderTitleRow(), this.hideSelectAllFromColumnHeaderFilterRow();
      else if (this._options.hideInColumnTitleRow ? this.hideSelectAllFromColumnHeaderTitleRow() : (this.renderSelectAllCheckbox(this._isSelectAllChecked), this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this))), this._options.hideInFilterHeaderRow)
        this.hideSelectAllFromColumnHeaderFilterRow();
      else {
        let selectAllContainerElm = (_a = this._headerRowNode) == null ? void 0 : _a.querySelector("#filter-checkbox-selectall-container");
        if (selectAllContainerElm) {
          selectAllContainerElm.style.display = "flex";
          let selectAllInputElm = selectAllContainerElm.querySelector('input[type="checkbox"]');
          selectAllInputElm && (selectAllInputElm.checked = this._isSelectAllChecked);
        }
      }
    }
    hideSelectAllFromColumnHeaderTitleRow() {
      this._grid.updateColumnHeader(this._options.columnId || "", "", "");
    }
    hideSelectAllFromColumnHeaderFilterRow() {
      var _a;
      let selectAllContainerElm = (_a = this._headerRowNode) == null ? void 0 : _a.querySelector("#filter-checkbox-selectall-container");
      selectAllContainerElm && (selectAllContainerElm.style.display = "none");
    }
    handleSelectedRowsChanged() {
      var _a, _b;
      let selectedRows = this._grid.getSelectedRows(), lookup = {}, row = 0, i = 0, k = 0, disabledCount = 0;
      if (typeof this._selectableOverride == "function")
        for (k = 0; k < this._grid.getDataLength(); k++) {
          let dataItem = this._grid.getDataItem(k);
          this.checkSelectableOverride(i, dataItem, this._grid) || disabledCount++;
        }
      let removeList = [];
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        let rowItem = this._grid.getDataItem(row);
        this.checkSelectableOverride(i, rowItem, this._grid) ? (lookup[row] = !0, lookup[row] !== this._selectedRowsLookup[row] && (this._grid.invalidateRow(row), delete this._selectedRowsLookup[row])) : removeList.push(row);
      }
      for (let selectedRow in this._selectedRowsLookup)
        this._grid.invalidateRow(+selectedRow);
      if (this._selectedRowsLookup = lookup, this._grid.render(), this._isSelectAllChecked = ((_a = selectedRows == null ? void 0 : selectedRows.length) != null ? _a : 0) + disabledCount >= this._grid.getDataLength(), (!this._isUsingDataView || !this._options.applySelectOnAllPages) && (!this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow)) {
        let selectAllElm = (_b = this._headerRowNode) == null ? void 0 : _b.querySelector(`#header-filter-selector${this._selectAll_UID}`);
        selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
      }
      if (removeList.length > 0) {
        for (i = 0; i < removeList.length; i++) {
          let remIdx = selectedRows.indexOf(removeList[i]);
          selectedRows.splice(remIdx, 1);
        }
        this._grid.setSelectedRows(selectedRows, "click.cleanup");
      }
    }
    handleDataViewSelectedIdsChanged() {
      var _a;
      let selectedIds = this._dataView.getAllSelectedFilteredIds(), filteredItems = this._dataView.getFilteredItems(), disabledCount = 0;
      if (typeof this._selectableOverride == "function" && selectedIds.length > 0)
        for (let k = 0; k < this._dataView.getItemCount(); k++) {
          let dataItem = this._dataView.getItemByIdx(k), idProperty = this._dataView.getIdPropertyName(), dataItemId = dataItem[idProperty];
          filteredItems.findIndex(function(item) {
            return item[idProperty] === dataItemId;
          }) >= 0 && !this.checkSelectableOverride(k, dataItem, this._grid) && disabledCount++;
        }
      if (this._isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length, !this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow) {
        let selectAllElm = (_a = this._headerRowNode) == null ? void 0 : _a.querySelector(`#header-filter-selector${this._selectAll_UID}`);
        selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
      }
    }
    handleKeyDown(e, args) {
      e.which === 32 && this._grid.getColumns()[args.cell].id === this._options.columnId && ((!this._grid.getEditorLock().isActive() || this._grid.getEditorLock().commitCurrentEdit()) && this.toggleRowSelection(args.row), e.preventDefault(), e.stopImmediatePropagation());
    }
    handleClick(e, args) {
      if (this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.type === "checkbox") {
        if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        this.toggleRowSelection(args.row), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    toggleRowSelection(row) {
      let dataContext = this._grid.getDataItem(row);
      if (this.checkSelectableOverride(row, dataContext, this._grid)) {
        if (this._selectedRowsLookup[row]) {
          let newSelectedRows = this._grid.getSelectedRows().filter((n) => n !== row);
          this._grid.setSelectedRows(newSelectedRows, "click.toggle");
        } else
          this._grid.setSelectedRows(this._grid.getSelectedRows().concat(row), "click.toggle");
        this._grid.setActiveCell(row, this.getCheckboxColumnCellIndex());
      }
    }
    selectRows(rowArray) {
      let addRows = [];
      for (let i = 0, l = rowArray.length; i < l; i++)
        this._selectedRowsLookup[rowArray[i]] || (addRows[addRows.length] = rowArray[i]);
      this._grid.setSelectedRows(this._grid.getSelectedRows().concat(addRows), "SlickCheckboxSelectColumn.selectRows");
    }
    deSelectRows(rowArray) {
      let removeRows = [];
      for (let i = 0, l = rowArray.length; i < l; i++)
        this._selectedRowsLookup[rowArray[i]] && (removeRows[removeRows.length] = rowArray[i]);
      this._grid.setSelectedRows(this._grid.getSelectedRows().filter((n) => removeRows.indexOf(n) < 0), "SlickCheckboxSelectColumn.deSelectRows");
    }
    handleHeaderClick(e, args) {
      if (args.column.id === this._options.columnId && e.target.type === "checkbox") {
        if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        let isAllSelected = e.target.checked, caller = isAllSelected ? "click.selectAll" : "click.unselectAll", rows = [];
        if (isAllSelected) {
          for (let i = 0; i < this._grid.getDataLength(); i++) {
            let rowItem = this._grid.getDataItem(i);
            !rowItem.__group && !rowItem.__groupTotals && this.checkSelectableOverride(i, rowItem, this._grid) && rows.push(i);
          }
          isAllSelected = !0;
        }
        if (this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages) {
          let ids = [], filteredItems = this._dataView.getFilteredItems();
          for (let j = 0; j < filteredItems.length; j++) {
            let dataviewRowItem = filteredItems[j];
            this.checkSelectableOverride(j, dataviewRowItem, this._grid) && ids.push(dataviewRowItem[this._dataView.getIdPropertyName()]);
          }
          this._dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
        }
        this._grid.setSelectedRows(rows, caller), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    getCheckboxColumnCellIndex() {
      if (this._checkboxColumnCellIndex === null) {
        this._checkboxColumnCellIndex = 0;
        let colArr = this._grid.getColumns();
        for (let i = 0; i < colArr.length; i++)
          colArr[i].id === this._options.columnId && (this._checkboxColumnCellIndex = i);
      }
      return this._checkboxColumnCellIndex;
    }
    getColumnDefinition() {
      var _a, _b, _c;
      return {
        id: this._options.columnId,
        name: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`,
        toolTip: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : this._options.toolTip,
        field: "sel",
        width: this._options.width,
        resizable: !1,
        sortable: !1,
        cssClass: this._options.cssClass,
        hideSelectAllCheckbox: this._options.hideSelectAllCheckbox,
        formatter: this.checkboxSelectionFormatter.bind(this),
        // exclude from all menus, defaults to true unless the option is provided differently by the user
        excludeFromColumnPicker: (_a = this._options.excludeFromColumnPicker) != null ? _a : !0,
        excludeFromGridMenu: (_b = this._options.excludeFromGridMenu) != null ? _b : !0,
        excludeFromHeaderMenu: (_c = this._options.excludeFromHeaderMenu) != null ? _c : !0
      };
    }
    addCheckboxToFilterHeaderRow(grid) {
      this._handler.subscribe(grid.onHeaderRowCellRendered, (_e, args) => {
        if (args.column.field === "sel") {
          Utils.emptyElement(args.node);
          let spanElm = document.createElement("span");
          spanElm.id = "filter-checkbox-selectall-container";
          let inputElm = document.createElement("input");
          inputElm.type = "checkbox", inputElm.id = `header-filter-selector${this._selectAll_UID}`;
          let labelElm = document.createElement("label");
          labelElm.htmlFor = `header-filter-selector${this._selectAll_UID}`, spanElm.appendChild(inputElm), spanElm.appendChild(labelElm), args.node.appendChild(spanElm), this._headerRowNode = args.node, this._bindingEventService.bind(spanElm, "click", (e) => this.handleHeaderClick(e, args));
        }
      });
    }
    createUID() {
      return Math.round(1e7 * Math.random());
    }
    checkboxSelectionFormatter(row, _cell, _val, _columnDef, dataContext, grid) {
      let UID = this.createUID() + row;
      return dataContext && this.checkSelectableOverride(row, dataContext, grid) ? this._selectedRowsLookup[row] ? `<input id="selector${UID}" type="checkbox" checked="checked"><label for="selector${UID}"></label>` : `<input id="selector${UID}" type="checkbox"><label for="selector${UID}"></label>` : null;
    }
    checkSelectableOverride(row, dataContext, grid) {
      return typeof this._selectableOverride == "function" ? this._selectableOverride(row, dataContext, grid) : !0;
    }
    renderSelectAllCheckbox(isSelectAllChecked) {
      isSelectAllChecked ? this._grid.updateColumnHeader(this._options.columnId || "", `<input id="header-selector${this._selectAll_UID}" type="checkbox" checked="checked"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip) : this._grid.updateColumnHeader(this._options.columnId || "", `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip);
    }
    /**
     * Method that user can pass to override the default behavior or making every row a selectable row.
     * In order word, user can choose which rows to be selectable or not by providing his own logic.
     * @param overrideFn: override function callback
     */
    selectableOverride(overrideFn) {
      this._selectableOverride = overrideFn;
    }
    // Utils.extend(this, {
    //     "init": init,
    //     "destroy": destroy,
    //     "deSelectRows": deSelectRows,
    //     "selectRows": selectRows,
    //     "getColumnDefinition": getColumnDefinition,
    //     "getOptions": getOptions,
    //     "selectableOverride": selectableOverride,
    //     "setOptions": setOptions,
    //   });
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CheckboxSelectColumn: SlickCheckboxSelectColumn
    }
  });
})();
//# sourceMappingURL=slick.checkboxselectcolumn.js.map
