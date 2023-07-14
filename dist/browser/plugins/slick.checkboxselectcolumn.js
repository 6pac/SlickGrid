"use strict";
(() => {
  // src/plugins/slick.checkboxselectcolumn.js
  var BindingEventService = Slick.BindingEventService, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function CheckboxSelectColumn(options) {
    let _dataView, _grid, _isUsingDataView = !1, _selectableOverride = null, _headerRowNode, _selectAll_UID = createUID(), _handler = new EventHandler(), _selectedRowsLookup = {}, _defaults = {
      columnId: "_checkbox_selector",
      cssClass: null,
      hideSelectAllCheckbox: !1,
      toolTip: "Select/Deselect All",
      width: 30,
      applySelectOnAllPages: !1,
      // defaults to false, when that is enabled the "Select All" will be applied to all pages (when using Pagination)
      hideInColumnTitleRow: !1,
      hideInFilterHeaderRow: !0
    }, _isSelectAllChecked = !1, _bindingEventService = new BindingEventService(), _options = Utils.extend(!0, {}, _defaults, options);
    typeof _options.selectableOverride == "function" && selectableOverride(_options.selectableOverride);
    function init(grid) {
      _grid = grid, _isUsingDataView = !Array.isArray(grid.getData()), _isUsingDataView && (_dataView = grid.getData()), _handler.subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged).subscribe(_grid.onClick, handleClick).subscribe(_grid.onKeyDown, handleKeyDown), _isUsingDataView && _dataView && _options.applySelectOnAllPages && _handler.subscribe(_dataView.onSelectedRowIdsChanged, handleDataViewSelectedIdsChanged).subscribe(_dataView.onPagingInfoChanged, handleDataViewSelectedIdsChanged), _options.hideInFilterHeaderRow || addCheckboxToFilterHeaderRow(grid), _options.hideInColumnTitleRow || _handler.subscribe(_grid.onHeaderClick, handleHeaderClick);
    }
    function destroy() {
      _handler.unsubscribeAll(), _bindingEventService.unbindAll();
    }
    function getOptions() {
      return _options;
    }
    function setOptions(options2) {
      if (_options = Utils.extend(!0, {}, _options, options2), _options.hideSelectAllCheckbox)
        hideSelectAllFromColumnHeaderTitleRow(), hideSelectAllFromColumnHeaderFilterRow();
      else if (_options.hideInColumnTitleRow ? hideSelectAllFromColumnHeaderTitleRow() : (renderSelectAllCheckbox(_isSelectAllChecked), _handler.subscribe(_grid.onHeaderClick, handleHeaderClick)), _options.hideInFilterHeaderRow)
        hideSelectAllFromColumnHeaderFilterRow();
      else {
        let selectAllContainerElm = _headerRowNode.querySelector("#filter-checkbox-selectall-container");
        if (selectAllContainerElm) {
          selectAllContainerElm.style.display = "flex";
          let selectAllInputElm = selectAllContainerElm.querySelector('input[type="checkbox"]');
          selectAllInputElm && (selectAllInputElm.checked = _isSelectAllChecked);
        }
      }
    }
    function hideSelectAllFromColumnHeaderTitleRow() {
      _grid.updateColumnHeader(_options.columnId, "", "");
    }
    function hideSelectAllFromColumnHeaderFilterRow() {
      let selectAllContainerElm = _headerRowNode && _headerRowNode.querySelector("#filter-checkbox-selectall-container");
      selectAllContainerElm && (selectAllContainerElm.style.display = "none");
    }
    function handleSelectedRowsChanged() {
      let selectedRows = _grid.getSelectedRows(), lookup = {}, row, i, k, disabledCount = 0;
      if (typeof _selectableOverride == "function")
        for (k = 0; k < _grid.getDataLength(); k++) {
          let dataItem = _grid.getDataItem(k);
          checkSelectableOverride(i, dataItem, _grid) || disabledCount++;
        }
      let removeList = [];
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        let rowItem = _grid.getDataItem(row);
        checkSelectableOverride(i, rowItem, _grid) ? (lookup[row] = !0, lookup[row] !== _selectedRowsLookup[row] && (_grid.invalidateRow(row), delete _selectedRowsLookup[row])) : removeList.push(row);
      }
      for (i in _selectedRowsLookup)
        _grid.invalidateRow(i);
      if (_selectedRowsLookup = lookup, _grid.render(), _isSelectAllChecked = selectedRows && selectedRows.length + disabledCount >= _grid.getDataLength(), (!_isUsingDataView || !_options.applySelectOnAllPages) && (!_options.hideInColumnTitleRow && !_options.hideSelectAllCheckbox && renderSelectAllCheckbox(_isSelectAllChecked), !_options.hideInFilterHeaderRow)) {
        let selectAllElm = _headerRowNode && _headerRowNode.querySelector(`#header-filter-selector${_selectAll_UID}`);
        selectAllElm && (selectAllElm.checked = _isSelectAllChecked);
      }
      if (removeList.length > 0) {
        for (i = 0; i < removeList.length; i++) {
          let remIdx = selectedRows.indexOf(removeList[i]);
          selectedRows.splice(remIdx, 1);
        }
        _grid.setSelectedRows(selectedRows, "click.cleanup");
      }
    }
    function handleDataViewSelectedIdsChanged() {
      let selectedIds = _dataView.getAllSelectedFilteredIds(), filteredItems = _dataView.getFilteredItems(), disabledCount = 0;
      if (typeof _selectableOverride == "function" && selectedIds.length > 0)
        for (let k = 0; k < _dataView.getItemCount(); k++) {
          let dataItem = _dataView.getItemByIdx(k), idProperty = _dataView.getIdPropertyName(), dataItemId = dataItem[idProperty];
          filteredItems.findIndex(function(item) {
            return item[idProperty] === dataItemId;
          }) >= 0 && !checkSelectableOverride(k, dataItem, _grid) && disabledCount++;
        }
      if (_isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length, !_options.hideInColumnTitleRow && !_options.hideSelectAllCheckbox && renderSelectAllCheckbox(_isSelectAllChecked), !_options.hideInFilterHeaderRow) {
        let selectAllElm = _headerRowNode && _headerRowNode.querySelector(`#header-filter-selector${_selectAll_UID}`);
        selectAllElm && (selectAllElm.checked = _isSelectAllChecked);
      }
    }
    function handleKeyDown(e, args) {
      e.which == 32 && _grid.getColumns()[args.cell].id === _options.columnId && ((!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) && toggleRowSelection(args.row), e.preventDefault(), e.stopImmediatePropagation());
    }
    function handleClick(e, args) {
      if (_grid.getColumns()[args.cell].id === _options.columnId && e.target.type === "checkbox") {
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        toggleRowSelection(args.row), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    function toggleRowSelection(row) {
      let dataContext = _grid.getDataItem(row);
      if (checkSelectableOverride(row, dataContext, _grid)) {
        if (_selectedRowsLookup[row]) {
          let newSelectedRows = _grid.getSelectedRows().filter((n) => n !== row);
          _grid.setSelectedRows(newSelectedRows, "click.toggle");
        } else
          _grid.setSelectedRows(_grid.getSelectedRows().concat(row), "click.toggle");
        _grid.setActiveCell(row, getCheckboxColumnCellIndex());
      }
    }
    function selectRows(rowArray) {
      let i, l = rowArray.length, addRows = [];
      for (i = 0; i < l; i++)
        _selectedRowsLookup[rowArray[i]] || (addRows[addRows.length] = rowArray[i]);
      _grid.setSelectedRows(_grid.getSelectedRows().concat(addRows), "SlickCheckboxSelectColumn.selectRows");
    }
    function deSelectRows(rowArray) {
      let i, l = rowArray.length, removeRows = [];
      for (i = 0; i < l; i++)
        _selectedRowsLookup[rowArray[i]] && (removeRows[removeRows.length] = rowArray[i]);
      _grid.setSelectedRows(_grid.getSelectedRows().filter((n) => removeRows.indexOf(n) < 0), "SlickCheckboxSelectColumn.deSelectRows");
    }
    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && e.target.type === "checkbox") {
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault(), e.stopImmediatePropagation();
          return;
        }
        let isAllSelected = e.target.checked, caller = isAllSelected ? "click.selectAll" : "click.unselectAll", rows = [];
        if (isAllSelected) {
          for (let i = 0; i < _grid.getDataLength(); i++) {
            let rowItem = _grid.getDataItem(i);
            !rowItem.__group && !rowItem.__groupTotals && checkSelectableOverride(i, rowItem, _grid) && rows.push(i);
          }
          isAllSelected = !0;
        }
        if (_isUsingDataView && _dataView && _options.applySelectOnAllPages) {
          let ids = [], filteredItems = _dataView.getFilteredItems();
          for (let j = 0; j < filteredItems.length; j++) {
            let dataviewRowItem = filteredItems[j];
            checkSelectableOverride(j, dataviewRowItem, _grid) && ids.push(dataviewRowItem[_dataView.getIdPropertyName()]);
          }
          _dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
        }
        _grid.setSelectedRows(rows, caller), e.stopPropagation(), e.stopImmediatePropagation();
      }
    }
    let _checkboxColumnCellIndex = null;
    function getCheckboxColumnCellIndex() {
      if (_checkboxColumnCellIndex === null) {
        _checkboxColumnCellIndex = 0;
        let colArr = _grid.getColumns();
        for (let i = 0; i < colArr.length; i++)
          colArr[i].id == _options.columnId && (_checkboxColumnCellIndex = i);
      }
      return _checkboxColumnCellIndex;
    }
    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: _options.hideSelectAllCheckbox || _options.hideInColumnTitleRow ? "" : "<input id='header-selector" + _selectAll_UID + "' type='checkbox'><label for='header-selector" + _selectAll_UID + "'></label>",
        toolTip: _options.hideSelectAllCheckbox || _options.hideInColumnTitleRow ? "" : _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: !1,
        sortable: !1,
        cssClass: _options.cssClass,
        hideSelectAllCheckbox: _options.hideSelectAllCheckbox,
        formatter: checkboxSelectionFormatter,
        // exclude from all menus, defaults to true unless the option is provided differently by the user
        excludeFromColumnPicker: typeof _options.excludeFromColumnPicker != "undefined" ? _options.excludeFromColumnPicker : !0,
        excludeFromGridMenu: typeof _options.excludeFromGridMenu != "undefined" ? _options.excludeFromGridMenu : !0,
        excludeFromHeaderMenu: typeof _options.excludeFromHeaderMenu != "undefined" ? _options.excludeFromHeaderMenu : !0
      };
    }
    function addCheckboxToFilterHeaderRow(grid) {
      _handler.subscribe(grid.onHeaderRowCellRendered, function(e, args) {
        if (args.column.field === "sel") {
          Utils.emptyElement(args.node);
          let spanElm = document.createElement("span");
          spanElm.id = "filter-checkbox-selectall-container";
          let inputElm = document.createElement("input");
          inputElm.type = "checkbox", inputElm.id = `header-filter-selector${_selectAll_UID}`;
          let labelElm = document.createElement("label");
          labelElm.htmlFor = `header-filter-selector${_selectAll_UID}`, spanElm.appendChild(inputElm), spanElm.appendChild(labelElm), args.node.appendChild(spanElm), _headerRowNode = args.node, _bindingEventService.bind(spanElm, "click", (e2) => handleHeaderClick(e2, args));
        }
      });
    }
    function createUID() {
      return Math.round(1e7 * Math.random());
    }
    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext, grid) {
      let UID = createUID() + row;
      return dataContext && checkSelectableOverride(row, dataContext, grid) ? _selectedRowsLookup[row] ? "<input id='selector" + UID + "' type='checkbox' checked='checked'><label for='selector" + UID + "'></label>" : "<input id='selector" + UID + "' type='checkbox'><label for='selector" + UID + "'></label>" : null;
    }
    function checkSelectableOverride(row, dataContext, grid) {
      return typeof _selectableOverride == "function" ? _selectableOverride(row, dataContext, grid) : !0;
    }
    function renderSelectAllCheckbox(isSelectAllChecked) {
      isSelectAllChecked ? _grid.updateColumnHeader(_options.columnId, "<input id='header-selector" + _selectAll_UID + "' type='checkbox' checked='checked'><label for='header-selector" + _selectAll_UID + "'></label>", _options.toolTip) : _grid.updateColumnHeader(_options.columnId, "<input id='header-selector" + _selectAll_UID + "' type='checkbox'><label for='header-selector" + _selectAll_UID + "'></label>", _options.toolTip);
    }
    function selectableOverride(overrideFn) {
      _selectableOverride = overrideFn;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "CheckboxSelectColumn",
      deSelectRows,
      selectRows,
      getColumnDefinition,
      getOptions,
      selectableOverride,
      setOptions
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      CheckboxSelectColumn
    }
  });
})();
//# sourceMappingURL=slick.checkboxselectcolumn.js.map
