/***
 * A control to add a Column Picker (right+click on any column header to reveal the column picker)
 * NOTE: this a simplified and updated version of slick.columnpicker.js
 *
 * USAGE:
 *
 * Add the slick.columnpicker.(js|css) files and register it with the grid.
 *
 * Available options, by defining a columnPicker object:
 *
 *  var options = {
 *    enableCellNavigation: true,
 *    columnPicker: {
 *      columnTitle: "Columns",                 // default to empty string
 *
 *      // the last 2 checkboxes titles
 *      hideForceFitButton: false,              // show/hide checkbox near the end "Force Fit Columns" (default:false)
 *      hideSyncResizeButton: false,            // show/hide checkbox near the end "Synchronous Resize" (default:false)
 *      forceFitTitle: "Force fit columns",     // default to "Force fit columns"
 *      headerColumnValueExtractor: "Extract the column label" // default to column.name
 *      syncResizeTitle: "Synchronous resize",  // default to "Synchronous resize"
 *    }
 *  };
 *
 * @class Slick.Controls.ColumnPicker
 * @constructor
 */

(function (window) {
  'use strict';
  function SlickColumnPicker(columns, grid, options) {
    var _grid = grid;
    var _options = options;
    var _gridUid = (grid && grid.getUID) ? grid.getUID() : '';
    var _columnTitleElm;
    var _listElm;
    var _menuElm;
    var columnCheckboxes;
    var onColumnsChanged = new Slick.Event();
    var _bindingEventService = new Slick.BindingEventService();

    var defaults = {
      fadeSpeed: 250,

      // the last 2 checkboxes titles
      hideForceFitButton: false,
      hideSyncResizeButton: false,
      forceFitTitle: "Force fit columns",
      syncResizeTitle: "Synchronous resize",
      headerColumnValueExtractor:
        function (columnDef) {
          return columnDef.name;
        }
    };

    function init(grid) {
      grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
      grid.onColumnsReordered.subscribe(updateColumnOrder);
      _options = Slick.Utils.extend({}, defaults, options);

      _menuElm = document.createElement('div');
      _menuElm.className = `slick-columnpicker ${_gridUid}`;
      _menuElm.style.display = 'none';
      document.body.appendChild(_menuElm);

      const buttonElm = document.createElement('button');
      buttonElm.type = 'button';
      buttonElm.className = 'close';
      buttonElm.dataset.dismiss = 'slick-columnpicker';
      buttonElm.ariaLabel = 'Close';

      const spanCloseElm = document.createElement('span');
      spanCloseElm.className = 'close';
      spanCloseElm.ariaHidden = 'true';
      spanCloseElm.innerHTML = '&times;';
      buttonElm.appendChild(spanCloseElm);
      _menuElm.appendChild(buttonElm);

      // user could pass a title on top of the columns list
      if (_options.columnPickerTitle || (_options.columnPicker && _options.columnPicker.columnTitle)) {
        var columnTitle = _options.columnPickerTitle || _options.columnPicker.columnTitle;
        _columnTitleElm = document.createElement('div');
        _columnTitleElm.className = 'slick-gridmenu-custom';
        _columnTitleElm.textContent = columnTitle;
        _menuElm.appendChild(_columnTitleElm);
      }

      _bindingEventService.bind(_menuElm, 'click', updateColumn);

      _listElm = document.createElement('span');
      _listElm.className = 'slick-columnpicker-list';

      // Hide the menu on outside click.
      _bindingEventService.bind(document.body, 'mousedown', handleBodyMouseDown);

      // destroy the picker if user leaves the page
      _bindingEventService.bind(document.body, 'beforeunload', destroy);
    }

    function destroy() {
      _grid.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu);
      _grid.onColumnsReordered.unsubscribe(updateColumnOrder);
      _bindingEventService.unbindAll();

      if (_listElm) {
        _listElm.remove();
      }
      if (_menuElm) {
        _menuElm.remove();
      }
    }

    function handleBodyMouseDown(e) {
      if ((_menuElm !== e.target && !(_menuElm && _menuElm.contains(e.target))) || e.target.className === 'close') {
        _menuElm.setAttribute('aria-expanded', 'false');
        _menuElm.style.display = 'none';
      }
    }

    function handleHeaderContextMenu(e) {
      e.preventDefault();
      Slick.Utils.emptyElement(_listElm);
      updateColumnOrder();
      columnCheckboxes = [];

      let columnId, columnLabel, excludeCssClass;
      for (var i = 0; i < columns.length; i++) {
        columnId = columns[i].id;
        excludeCssClass = columns[i].excludeFromColumnPicker ? "hidden" : "";

        const liElm = document.createElement('li');
        liElm.className = excludeCssClass;
        liElm.ariaLabel = columns[i] && columns[i].name;

        const checkboxElm = document.createElement('input');
        checkboxElm.type = 'checkbox';
        checkboxElm.id = `${_gridUid}colpicker-${columnId}`;
        checkboxElm.dataset.columnid = columns[i].id;
        liElm.appendChild(checkboxElm);

        columnCheckboxes.push(checkboxElm);

        if (_grid.getColumnIndex(columnId) != null && !columns[i].hidden) {
          checkboxElm.checked = true;
        }

        if (_options && _options.columnPicker && _options.columnPicker.headerColumnValueExtractor) {
          columnLabel = _options.columnPicker.headerColumnValueExtractor(columns[i], _options);
        } else {
          columnLabel = defaults.headerColumnValueExtractor(columns[i], _options);
        }

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}colpicker-${columnId}`;
        labelElm.innerHTML = columnLabel;
        liElm.appendChild(labelElm);
        _listElm.appendChild(liElm);
      }

      if (_options.columnPicker && (!_options.columnPicker.hideForceFitButton || !_options.columnPicker.hideSyncResizeButton)) {
        _listElm.appendChild(document.createElement('hr'));
      }

      if (!(_options.columnPicker && _options.columnPicker.hideForceFitButton)) {
        let forceFitTitle = (_options.columnPicker && _options.columnPicker.forceFitTitle) || _options.forceFitTitle;

        const liElm = document.createElement('li');
        liElm.ariaLabel = forceFitTitle;
        _listElm.appendChild(liElm);

        const forceFitCheckboxElm = document.createElement('input');
        forceFitCheckboxElm.type = 'checkbox';
        forceFitCheckboxElm.id = `${_gridUid}colpicker-forcefit`;
        forceFitCheckboxElm.dataset.option = 'autoresize';
        liElm.appendChild(forceFitCheckboxElm);

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}colpicker-forcefit`;
        labelElm.textContent = forceFitTitle;
        liElm.appendChild(labelElm);

        if (_grid.getOptions().forceFitColumns) {
          forceFitCheckboxElm.checked = true;
        }
      }

      if (!(_options.columnPicker && _options.columnPicker.hideSyncResizeButton)) {
        let syncResizeTitle = (_options.columnPicker && _options.columnPicker.syncResizeTitle) || _options.syncResizeTitle;

        const liElm = document.createElement('li');
        liElm.ariaLabel = syncResizeTitle;
        _listElm.appendChild(liElm);

        const syncResizeCheckboxElm = document.createElement('input');
        syncResizeCheckboxElm.type = 'checkbox';
        syncResizeCheckboxElm.id = `${_gridUid}colpicker-syncresize`;
        syncResizeCheckboxElm.dataset.option = 'syncresize';
        liElm.appendChild(syncResizeCheckboxElm);

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `${_gridUid}colpicker-syncresize`;
        labelElm.textContent = syncResizeTitle;
        liElm.appendChild(labelElm);

        if (_grid.getOptions().syncColumnCellResize) {
          syncResizeCheckboxElm.checked = true;
        }
      }

      repositionMenu(e);
    }

    function repositionMenu(event) {
      const targetEvent = event && event.touches && event.touches[0] || event;
      _menuElm.style.top = `${targetEvent.pageY - 10}px`;
      _menuElm.style.left = `${targetEvent.pageX - 10}px`;
      _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`;
      _menuElm.style.display = 'block';
      _menuElm.setAttribute('aria-expanded', 'true');
      _menuElm.appendChild(_listElm);
    }

    function updateColumnOrder() {
      // Because columns can be reordered, we have to update the `columns`
      // to reflect the new order, however we can't just take `grid.getColumns()`,
      // as it does not include columns currently hidden by the picker.
      // We create a new `columns` structure by leaving currently-hidden
      // columns in their original ordinal position and interleaving the results
      // of the current column sort.
      let current = _grid.getColumns().slice(0);
      let ordered = new Array(columns.length);
      for (let i = 0; i < ordered.length; i++) {
        if (_grid.getColumnIndex(columns[i].id) === undefined) {
          // If the column doesn't return a value from getColumnIndex,
          // it is hidden. Leave it in this position.
          ordered[i] = columns[i];
        } else {
          // Otherwise, grab the next visible column.
          ordered[i] = current.shift();
        }
      }
      columns = ordered;
    }

    /** Update the Titles of each sections (command, customTitle, ...) */
    function updateAllTitles(gridMenuOptions) {
      if (_columnTitleElm && _columnTitleElm.innerHTML) {
        _columnTitleElm.innerHTML = gridMenuOptions.columnTitle;
      }
    }

    function updateColumn(e) {
      if (e.target.dataset.option === 'autoresize') {
        // when calling setOptions, it will resize with ALL Columns (even the hidden ones)
        // we can avoid this problem by keeping a reference to the visibleColumns before setOptions and then setColumns after
        var previousVisibleColumns = getVisibleColumns();
        var isChecked = e.target.checked;
        _grid.setOptions({ forceFitColumns: isChecked });
        _grid.setColumns(previousVisibleColumns);
        return;
      }

      if (e.target.dataset.option === 'syncresize') {
        if (e.target.checked) {
          _grid.setOptions({ syncColumnCellResize: true });
        } else {
          _grid.setOptions({ syncColumnCellResize: false });
        }
        return;
      }

      if (e.target.type === 'checkbox') {
        const isChecked = e.target.checked;
        const columnId = e.target.dataset.columnid || '';
        let visibleColumns = [];
        columnCheckboxes.forEach((columnCheckbox, idx) => {
          if (columns[idx].hidden !== undefined) { columns[idx].hidden = !columnCheckbox.checked; }
          if (columnCheckbox.checked) {
            visibleColumns.push(columns[idx]);
          }
        });

        if (!visibleColumns.length) {
          e.target.checked = true;
          return;
        }

        _grid.setColumns(visibleColumns);
        onColumnsChanged.notify({ columnId: columnId, showing: isChecked, allColumns: columns, columns: visibleColumns, grid: _grid });
      }
    }

    function setColumnVisibiliy(idxOrId, show) {
      var idx = typeof idxOrId === 'number' ? idxOrId : getColumnIndexbyId(idxOrId);

      var sVisible = !!_grid.getColumnIndex(columns[idx].id);
      var visibleColumns = getVisibleColumns();
      var col = columns[idx];
      if (show) {
        col.hidden = false;
        visibleColumns.splice(idx, 0, col);
      } else {
        let newVisibleColumns = [];      
        for (let i = 0; i < visibleColumns.length; i++) {
          if (visibleColumns[i].id !== col.id) { newVisibleColumns.push(visibleColumns[i]); }
        }
        visibleColumns = newVisibleColumns;
      }
 
      _grid.setColumns(visibleColumns);
      onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: columns, columns: visibleColumns, grid: _grid });
     }

    function getAllColumns() {
      return columns;
    }

    function getColumnbyId(id) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === id) { return columns[i]; }
      }
      return null;
    }

    function getColumnIndexbyId(id) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === id) { return i; }
      }
      return -1;
    }

    /** visible columns, we can simply get them directly from the grid */
    function getVisibleColumns() {
      return _grid.getColumns();
    }

    init(_grid);

    return {
      "init": init,
      "getAllColumns": getAllColumns,
      "getColumnbyId": getColumnbyId,
      "getColumnIndexbyId": getColumnIndexbyId,
      "getVisibleColumns": getVisibleColumns,
      "destroy": destroy,
      "updateAllTitles": updateAllTitles,
      "onColumnsChanged": onColumnsChanged,
      "setColumnVisibiliy": setColumnVisibiliy
    };
  }

  // Slick.Controls.ColumnPicker
  Slick.Utils.extend(true, window, { Slick: { Controls: { ColumnPicker: SlickColumnPicker } } });
})(window);
