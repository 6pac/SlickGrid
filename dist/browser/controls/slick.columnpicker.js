"use strict";
(() => {
  // src/controls/slick.columnpicker.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils;
  function SlickColumnPicker(columns, grid, options) {
    var _grid = grid, _options = options, _gridUid = grid && grid.getUID ? grid.getUID() : "", _columnTitleElm, _listElm, _menuElm, columnCheckboxes, onColumnsChanged = new SlickEvent(), _bindingEventService = new BindingEventService(), defaults = {
      fadeSpeed: 250,
      // the last 2 checkboxes titles
      hideForceFitButton: !1,
      hideSyncResizeButton: !1,
      forceFitTitle: "Force fit columns",
      syncResizeTitle: "Synchronous resize",
      headerColumnValueExtractor: function(columnDef) {
        return columnDef.name;
      }
    };
    function init(grid2) {
      grid2.onHeaderContextMenu.subscribe(handleHeaderContextMenu), grid2.onColumnsReordered.subscribe(updateColumnOrder), _options = Utils.extend({}, defaults, options), _menuElm = document.createElement("div"), _menuElm.className = `slick-columnpicker ${_gridUid}`, _menuElm.style.display = "none", document.body.appendChild(_menuElm);
      let buttonElm = document.createElement("button");
      buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-columnpicker", buttonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), _menuElm.appendChild(buttonElm), _options.columnPickerTitle || _options.columnPicker && _options.columnPicker.columnTitle) {
        var columnTitle = _options.columnPickerTitle || _options.columnPicker.columnTitle;
        _columnTitleElm = document.createElement("div"), _columnTitleElm.className = "slick-gridmenu-custom", _columnTitleElm.textContent = columnTitle, _menuElm.appendChild(_columnTitleElm);
      }
      _bindingEventService.bind(_menuElm, "click", updateColumn), _listElm = document.createElement("span"), _listElm.className = "slick-columnpicker-list", _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown), _bindingEventService.bind(document.body, "beforeunload", destroy);
    }
    function destroy() {
      _grid.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu), _grid.onColumnsReordered.unsubscribe(updateColumnOrder), _bindingEventService.unbindAll(), _listElm && _listElm.remove(), _menuElm && _menuElm.remove();
    }
    function handleBodyMouseDown(e) {
      (_menuElm !== e.target && !(_menuElm && _menuElm.contains(e.target)) || e.target.className === "close") && (_menuElm.setAttribute("aria-expanded", "false"), _menuElm.style.display = "none");
    }
    function handleHeaderContextMenu(e) {
      e.preventDefault(), Utils.emptyElement(_listElm), updateColumnOrder(), columnCheckboxes = [];
      let columnId, columnLabel, excludeCssClass;
      for (var i = 0; i < columns.length; i++) {
        columnId = columns[i].id, excludeCssClass = columns[i].excludeFromColumnPicker ? "hidden" : "";
        let liElm = document.createElement("li");
        liElm.className = excludeCssClass, liElm.ariaLabel = columns[i] && columns[i].name;
        let checkboxElm = document.createElement("input");
        checkboxElm.type = "checkbox", checkboxElm.id = `${_gridUid}colpicker-${columnId}`, checkboxElm.dataset.columnid = columns[i].id, liElm.appendChild(checkboxElm), columnCheckboxes.push(checkboxElm), _grid.getColumnIndex(columnId) != null && !columns[i].hidden && (checkboxElm.checked = !0), _options && _options.columnPicker && _options.columnPicker.headerColumnValueExtractor ? columnLabel = _options.columnPicker.headerColumnValueExtractor(columns[i], _options) : columnLabel = defaults.headerColumnValueExtractor(columns[i], _options);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}colpicker-${columnId}`, labelElm.innerHTML = columnLabel, liElm.appendChild(labelElm), _listElm.appendChild(liElm);
      }
      if (_options.columnPicker && (!_options.columnPicker.hideForceFitButton || !_options.columnPicker.hideSyncResizeButton) && _listElm.appendChild(document.createElement("hr")), !(_options.columnPicker && _options.columnPicker.hideForceFitButton)) {
        let forceFitTitle = _options.columnPicker && _options.columnPicker.forceFitTitle || _options.forceFitTitle, liElm = document.createElement("li");
        liElm.ariaLabel = forceFitTitle, _listElm.appendChild(liElm);
        let forceFitCheckboxElm = document.createElement("input");
        forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${_gridUid}colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), _grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
      }
      if (!(_options.columnPicker && _options.columnPicker.hideSyncResizeButton)) {
        let syncResizeTitle = _options.columnPicker && _options.columnPicker.syncResizeTitle || _options.syncResizeTitle, liElm = document.createElement("li");
        liElm.ariaLabel = syncResizeTitle, _listElm.appendChild(liElm);
        let syncResizeCheckboxElm = document.createElement("input");
        syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${_gridUid}colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${_gridUid}colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), _grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
      }
      repositionMenu(e);
    }
    function repositionMenu(event) {
      let targetEvent = event && event.touches && event.touches[0] || event;
      _menuElm.style.top = `${targetEvent.pageY - 10}px`, _menuElm.style.left = `${targetEvent.pageX - 10}px`, _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`, _menuElm.style.display = "block", _menuElm.setAttribute("aria-expanded", "true"), _menuElm.appendChild(_listElm);
    }
    function updateColumnOrder() {
      let current = _grid.getColumns().slice(0), ordered = new Array(columns.length);
      for (let i = 0; i < ordered.length; i++)
        _grid.getColumnIndex(columns[i].id) === void 0 ? ordered[i] = columns[i] : ordered[i] = current.shift();
      columns = ordered;
    }
    function updateAllTitles(gridMenuOptions) {
      _columnTitleElm && _columnTitleElm.innerHTML && (_columnTitleElm.innerHTML = gridMenuOptions.columnTitle);
    }
    function updateColumn(e) {
      if (e.target.dataset.option === "autoresize") {
        var previousVisibleColumns = getVisibleColumns(), isChecked = e.target.checked;
        _grid.setOptions({ forceFitColumns: isChecked }), _grid.setColumns(previousVisibleColumns);
        return;
      }
      if (e.target.dataset.option === "syncresize") {
        e.target.checked ? _grid.setOptions({ syncColumnCellResize: !0 }) : _grid.setOptions({ syncColumnCellResize: !1 });
        return;
      }
      if (e.target.type === "checkbox") {
        let isChecked2 = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
        if (columnCheckboxes.forEach((columnCheckbox, idx) => {
          columns[idx].hidden !== void 0 && (columns[idx].hidden = !columnCheckbox.checked), columnCheckbox.checked && visibleColumns.push(columns[idx]);
        }), !visibleColumns.length) {
          e.target.checked = !0;
          return;
        }
        _grid.setColumns(visibleColumns), onColumnsChanged.notify({ columnId, showing: isChecked2, allColumns: columns, columns: visibleColumns, grid: _grid });
      }
    }
    function setColumnVisibiliy(idxOrId, show) {
      var idx = typeof idxOrId == "number" ? idxOrId : getColumnIndexbyId(idxOrId), sVisible = !!_grid.getColumnIndex(columns[idx].id), visibleColumns = getVisibleColumns(), col = columns[idx];
      if (show)
        col.hidden = !1, visibleColumns.splice(idx, 0, col);
      else {
        let newVisibleColumns = [];
        for (let i = 0; i < visibleColumns.length; i++)
          visibleColumns[i].id !== col.id && newVisibleColumns.push(visibleColumns[i]);
        visibleColumns = newVisibleColumns;
      }
      _grid.setColumns(visibleColumns), onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: columns, columns: visibleColumns, grid: _grid });
    }
    function getAllColumns() {
      return columns;
    }
    function getColumnbyId(id) {
      for (let i = 0; i < columns.length; i++)
        if (columns[i].id === id)
          return columns[i];
      return null;
    }
    function getColumnIndexbyId(id) {
      for (let i = 0; i < columns.length; i++)
        if (columns[i].id === id)
          return i;
      return -1;
    }
    function getVisibleColumns() {
      return _grid.getColumns();
    }
    return init(_grid), {
      init,
      getAllColumns,
      getColumnbyId,
      getColumnIndexbyId,
      getVisibleColumns,
      destroy,
      updateAllTitles,
      onColumnsChanged,
      setColumnVisibiliy
    };
  }
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.ColumnPicker = SlickColumnPicker);
})();
