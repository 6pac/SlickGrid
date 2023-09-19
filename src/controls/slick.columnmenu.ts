import { BindingEventService as BindingEventService_, Event as SlickEvent_, Utils as Utils_ } from '../slick.core';
import type { Column, ColumnPickerOption, DOMMouseOrTouchEvent, GridOption, OnColumnsChangedArgs } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

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
 *  let options = {
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
 */

export class SlickColumnMenu {
  // --
  // public API
  onColumnsChanged = new SlickEvent<OnColumnsChangedArgs>();

  // --
  // protected props
  protected _gridUid: string;
  protected _columnTitleElm!: HTMLElement;
  protected _listElm!: HTMLElement;
  protected _menuElm!: HTMLElement;
  protected _columnCheckboxes: HTMLInputElement[] = [];
  protected _bindingEventService = new BindingEventService();
  protected _options: GridOption;
  protected _defaults: ColumnPickerOption = {
    fadeSpeed: 250,

    // the last 2 checkboxes titles
    hideForceFitButton: false,
    hideSyncResizeButton: false,
    forceFitTitle: 'Force fit columns',
    syncResizeTitle: 'Synchronous resize',
    headerColumnValueExtractor: (columnDef: Column) => columnDef.name || ''
  };

  constructor(protected columns: Column[], protected readonly grid: SlickGrid, options: GridOption) {
    this._gridUid = grid.getUID();
    this._options = Utils.extend({}, this._defaults, options);
    this.init(this.grid);
  }

  init(grid: SlickGrid) {
    grid.onHeaderContextMenu.subscribe(this.handleHeaderContextMenu.bind(this));
    grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this));

    this._menuElm = document.createElement('div');
    this._menuElm.className = `slick-columnpicker ${this._gridUid}`;
    this._menuElm.style.display = 'none';
    document.body.appendChild(this._menuElm);

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
    this._menuElm.appendChild(buttonElm);

    // user could pass a title on top of the columns list
    if (this._options.columnPickerTitle || (this._options.columnPicker?.columnTitle)) {
      const columnTitle = this._options.columnPickerTitle || this._options.columnPicker?.columnTitle;
      this._columnTitleElm = document.createElement('div');
      this._columnTitleElm.className = 'slick-gridmenu-custom';
      this._columnTitleElm.textContent = columnTitle || '';
      this._menuElm.appendChild(this._columnTitleElm);
    }

    this._bindingEventService.bind(this._menuElm, 'click', this.updateColumn.bind(this) as EventListener);

    this._listElm = document.createElement('span');
    this._listElm.className = 'slick-columnpicker-list';

    // Hide the menu on outside click.
    this._bindingEventService.bind(document.body, 'mousedown', this.handleBodyMouseDown.bind(this) as EventListener);

    // destroy the picker if user leaves the page
    this._bindingEventService.bind(document.body, 'beforeunload', this.destroy.bind(this));
  }

  destroy() {
    this.grid.onHeaderContextMenu.unsubscribe(this.handleHeaderContextMenu.bind(this));
    this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this));
    this._bindingEventService.unbindAll();
    this._listElm?.remove();
    this._menuElm?.remove();
  }

  handleBodyMouseDown(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    if ((this._menuElm !== e.target && !(this._menuElm && this._menuElm.contains(e.target))) || e.target.className === 'close') {
      this._menuElm.setAttribute('aria-expanded', 'false');
      this._menuElm.style.display = 'none';
    }
  }

  handleHeaderContextMenu(e: DOMMouseOrTouchEvent<HTMLDivElement>) {
    e.preventDefault();
    Utils.emptyElement(this._listElm);
    this.updateColumnOrder();
    this._columnCheckboxes = [];

    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id;
      excludeCssClass = this.columns[i].excludeFromColumnPicker ? "hidden" : "";

      const liElm = document.createElement('li');
      liElm.className = excludeCssClass;
      liElm.ariaLabel = this.columns[i]?.name || '';

      const checkboxElm = document.createElement('input');
      checkboxElm.type = 'checkbox';
      checkboxElm.id = `${this._gridUid}colpicker-${columnId}`;
      checkboxElm.dataset.columnid = String(this.columns[i].id);
      liElm.appendChild(checkboxElm);

      this._columnCheckboxes.push(checkboxElm);

      if (this.grid.getColumnIndex(columnId) != null && !this.columns[i].hidden) {
        checkboxElm.checked = true;
      }

      if (this._options?.columnPicker?.headerColumnValueExtractor) {
        columnLabel = this._options.columnPicker.headerColumnValueExtractor(this.columns[i], this._options);
      } else {
        columnLabel = this._defaults.headerColumnValueExtractor!(this.columns[i], this._options);
      }

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}colpicker-${columnId}`;
      labelElm.innerHTML = columnLabel;
      liElm.appendChild(labelElm);
      this._listElm.appendChild(liElm);
    }

    if (this._options.columnPicker && (!this._options.columnPicker.hideForceFitButton || !this._options.columnPicker.hideSyncResizeButton)) {
      this._listElm.appendChild(document.createElement('hr'));
    }

    if (!this._options.columnPicker?.hideForceFitButton) {
      const forceFitTitle = this._options.columnPicker?.forceFitTitle || this._options.forceFitTitle;

      const liElm = document.createElement('li');
      liElm.ariaLabel = forceFitTitle || '';
      this._listElm.appendChild(liElm);

      const forceFitCheckboxElm = document.createElement('input');
      forceFitCheckboxElm.type = 'checkbox';
      forceFitCheckboxElm.id = `${this._gridUid}colpicker-forcefit`;
      forceFitCheckboxElm.dataset.option = 'autoresize';
      liElm.appendChild(forceFitCheckboxElm);

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}colpicker-forcefit`;
      labelElm.textContent = forceFitTitle || '';
      liElm.appendChild(labelElm);

      if (this.grid.getOptions().forceFitColumns) {
        forceFitCheckboxElm.checked = true;
      }
    }

    if (!this._options.columnPicker?.hideSyncResizeButton) {
      const syncResizeTitle = this._options.columnPicker?.syncResizeTitle || this._options.syncResizeTitle;

      const liElm = document.createElement('li');
      liElm.ariaLabel = syncResizeTitle || '';
      this._listElm.appendChild(liElm);

      const syncResizeCheckboxElm = document.createElement('input');
      syncResizeCheckboxElm.type = 'checkbox';
      syncResizeCheckboxElm.id = `${this._gridUid}colpicker-syncresize`;
      syncResizeCheckboxElm.dataset.option = 'syncresize';
      liElm.appendChild(syncResizeCheckboxElm);

      const labelElm = document.createElement('label');
      labelElm.htmlFor = `${this._gridUid}colpicker-syncresize`;
      labelElm.textContent = syncResizeTitle || '';
      liElm.appendChild(labelElm);

      if (this.grid.getOptions().syncColumnCellResize) {
        syncResizeCheckboxElm.checked = true;
      }
    }

    this.repositionMenu(e);
  }

  repositionMenu(event: DOMMouseOrTouchEvent<HTMLDivElement>) {
    const targetEvent = event?.touches?.[0] || event;
    this._menuElm.style.top = `${targetEvent.pageY - 10}px`;
    this._menuElm.style.left = `${targetEvent.pageX - 10}px`;
    this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`;
    this._menuElm.style.display = 'block';
    this._menuElm.setAttribute('aria-expanded', 'true');
    this._menuElm.appendChild(this._listElm);
  }

  updateColumnOrder() {
    // Because columns can be reordered, we have to update the `columns`
    // to reflect the new order, however we can't just take `grid.getColumns()`,
    // as it does not include columns currently hidden by the picker.
    // We create a new `columns` structure by leaving currently-hidden
    // columns in their original ordinal position and interleaving the results
    // of the current column sort.
    const current = this.grid.getColumns().slice(0);
    const ordered = new Array(this.columns.length);
    for (let i = 0; i < ordered.length; i++) {
      if (this.grid.getColumnIndex(this.columns[i].id) === undefined) {
        // If the column doesn't return a value from getColumnIndex,
        // it is hidden. Leave it in this position.
        ordered[i] = this.columns[i];
      } else {
        // Otherwise, grab the next visible column.
        ordered[i] = current.shift();
      }
    }
    this.columns = ordered;
  }

  /** Update the Titles of each sections (command, customTitle, ...) */
  updateAllTitles(pickerOptions: { columnTitle: string; }) {
    if (this._columnTitleElm?.innerHTML) {
      this._columnTitleElm.innerHTML = pickerOptions.columnTitle;
    }
  }

  updateColumn(e: DOMMouseOrTouchEvent<HTMLInputElement>) {
    if (e.target.dataset.option === 'autoresize') {
      // when calling setOptions, it will resize with ALL Columns (even the hidden ones)
      // we can avoid this problem by keeping a reference to the visibleColumns before setOptions and then setColumns after
      const previousVisibleColumns = this.getVisibleColumns();
      const isChecked = e.target.checked;
      this.grid.setOptions({ forceFitColumns: isChecked });
      this.grid.setColumns(previousVisibleColumns);
      return;
    }

    if (e.target.dataset.option === 'syncresize') {
      if (e.target.checked) {
        this.grid.setOptions({ syncColumnCellResize: true });
      } else {
        this.grid.setOptions({ syncColumnCellResize: false });
      }
      return;
    }

    if (e.target.type === 'checkbox') {
      const isChecked = e.target.checked;
      const columnId = e.target.dataset.columnid || '';
      const visibleColumns: Column[] = [];
      this._columnCheckboxes.forEach((columnCheckbox, idx) => {
        if (this.columns[idx].hidden !== undefined) { this.columns[idx].hidden = !columnCheckbox.checked; }
        if (columnCheckbox.checked) {
          visibleColumns.push(this.columns[idx]);
        }
      });

      if (!visibleColumns.length) {
        e.target.checked = true;
        return;
      }

      this.grid.setColumns(visibleColumns);
      this.onColumnsChanged.notify({ columnId: columnId, showing: isChecked, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
    }
  }

  setColumnVisibiliy(idxOrId: number | string, show: boolean) {
    const idx = typeof idxOrId === 'number' ? idxOrId : this.getColumnIndexbyId(idxOrId);
    let visibleColumns: Column[] = this.getVisibleColumns();
    const col = this.columns[idx];
    if (show) {
      col.hidden = false;
      visibleColumns.splice(idx, 0, col);
    } else {
      const newVisibleColumns: Column[] = [];
      for (let i = 0; i < visibleColumns.length; i++) {
        if (visibleColumns[i].id !== col.id) { newVisibleColumns.push(visibleColumns[i]); }
      }
      visibleColumns = newVisibleColumns;
    }

    this.grid.setColumns(visibleColumns);
    this.onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
  }

  getAllColumns() {
    return this.columns;
  }

  getColumnbyId(id: number | string) {
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].id === id) { return this.columns[i]; }
    }
    return null;
  }

  getColumnIndexbyId(id: number | string) {
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].id === id) { return i; }
    }
    return -1;
  }

  /** visible columns, we can simply get them directly from the grid */
  getVisibleColumns() {
    return this.grid.getColumns();
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.ColumnPicker = SlickColumnMenu;
}
