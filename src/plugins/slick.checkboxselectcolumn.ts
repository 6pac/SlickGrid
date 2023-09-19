import type { CheckboxSelectorOption, Column, DOMEvent, Plugin, SelectableOverrideCallback } from '../models/index';
import { BindingEventService as BindingEventService_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export class SlickCheckboxSelectColumn<T = any> implements Plugin {
  // --
  // public API
  pluginName = 'CheckboxSelectColumn' as const;

  // --
  // protected props
  protected _dataView!: SlickDataView<T>;
  protected _grid!: SlickGrid;
  protected _isUsingDataView = false;
  protected _selectableOverride: SelectableOverrideCallback<T> | null = null;
  protected _headerRowNode?: HTMLElement;
  protected _selectAll_UID: number;
  protected _handler = new SlickEventHandler();
  protected _selectedRowsLookup: any = {};
  protected _checkboxColumnCellIndex: number | null = null;
  protected _options: CheckboxSelectorOption;
  protected _defaults: CheckboxSelectorOption = {
    columnId: '_checkbox_selector',
    cssClass: undefined,
    hideSelectAllCheckbox: false,
    toolTip: 'Select/Deselect All',
    width: 30,
    applySelectOnAllPages: false, // defaults to false, when that is enabled the "Select All" will be applied to all pages (when using Pagination)
    hideInColumnTitleRow: false,
    hideInFilterHeaderRow: true
  };
  protected _isSelectAllChecked = false;
  protected _bindingEventService: BindingEventService_;

  constructor(options?: Partial<CheckboxSelectorOption>) {
    this._bindingEventService = new BindingEventService();
    this._options = Utils.extend(true, {}, this._defaults, options);
    this._selectAll_UID = this.createUID();

    // user could override the checkbox icon logic from within the options or after instantiating the plugin
    if (typeof this._options.selectableOverride === 'function') {
      this.selectableOverride(this._options.selectableOverride);
    }
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._isUsingDataView = !Array.isArray(grid.getData());
    if (this._isUsingDataView) {
      this._dataView = grid.getData();
    }
    this._handler
      .subscribe(this._grid.onSelectedRowsChanged, this.handleSelectedRowsChanged.bind(this))
      .subscribe(this._grid.onClick, this.handleClick.bind(this))
      .subscribe(this._grid.onKeyDown, this.handleKeyDown.bind(this));

    if (this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages) {
      this._handler
        .subscribe(this._dataView.onSelectedRowIdsChanged, this.handleDataViewSelectedIdsChanged.bind(this))
        .subscribe(this._dataView.onPagingInfoChanged, this.handleDataViewSelectedIdsChanged.bind(this))
    }

    if (!this._options.hideInFilterHeaderRow) {
      this.addCheckboxToFilterHeaderRow(grid);
    }
    if (!this._options.hideInColumnTitleRow) {
      this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this));
    }
  }

  destroy() {
    this._handler.unsubscribeAll();
    this._bindingEventService.unbindAll();
  }

  getOptions() {
    return this._options;
  }

  setOptions(options: Partial<CheckboxSelectorOption>) {
    this._options = Utils.extend(true, {}, this._options, options);

    if (this._options.hideSelectAllCheckbox) {
      this.hideSelectAllFromColumnHeaderTitleRow();
      this.hideSelectAllFromColumnHeaderFilterRow();
    } else {
      if (!this._options.hideInColumnTitleRow) {
        this.renderSelectAllCheckbox(this._isSelectAllChecked);
        this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this));
      } else {
        this.hideSelectAllFromColumnHeaderTitleRow();
      }

      if (!this._options.hideInFilterHeaderRow) {
        const selectAllContainerElm = this._headerRowNode?.querySelector<HTMLSpanElement>('#filter-checkbox-selectall-container');
        if (selectAllContainerElm) {
          selectAllContainerElm.style.display = 'flex';
          const selectAllInputElm = selectAllContainerElm.querySelector<HTMLInputElement>('input[type="checkbox"]');
          if (selectAllInputElm) {
            selectAllInputElm.checked = this._isSelectAllChecked;
          }
        }
      } else {
        this.hideSelectAllFromColumnHeaderFilterRow();
      }
    }
  }

  protected hideSelectAllFromColumnHeaderTitleRow() {
    this._grid.updateColumnHeader(this._options.columnId || '', '', '');
  }

  protected hideSelectAllFromColumnHeaderFilterRow() {
    const selectAllContainerElm = this._headerRowNode?.querySelector<HTMLSpanElement>('#filter-checkbox-selectall-container');
    if (selectAllContainerElm) {
      selectAllContainerElm.style.display = 'none';
    }
  }

  protected handleSelectedRowsChanged() {
    const selectedRows = this._grid.getSelectedRows();
    const lookup: any = {};
    let row = 0, i = 0, k = 0;
    let disabledCount = 0;
    if (typeof this._selectableOverride === 'function') {
      for (k = 0; k < this._grid.getDataLength(); k++) {
        // If we are allowed to select the row
        const dataItem = this._grid.getDataItem(k);
        if (!this.checkSelectableOverride(i, dataItem, this._grid)) {
          disabledCount++;
        }
      }
    }

    const removeList: number[] = [];
    for (i = 0; i < selectedRows.length; i++) {
      row = selectedRows[i];

      // If we are allowed to select the row
      const rowItem = this._grid.getDataItem(row);
      if (this.checkSelectableOverride(i, rowItem, this._grid)) {
        lookup[row] = true;
        if (lookup[row] !== this._selectedRowsLookup[row]) {
          this._grid.invalidateRow(row);
          delete this._selectedRowsLookup[row];
        }
      }
      else {
        removeList.push(row);
      }
    }
    for (const selectedRow in this._selectedRowsLookup) {
      this._grid.invalidateRow(+selectedRow);
    }
    this._selectedRowsLookup = lookup;
    this._grid.render();
    this._isSelectAllChecked = (selectedRows?.length ?? 0) + disabledCount >= this._grid.getDataLength();

    if (!this._isUsingDataView || !this._options.applySelectOnAllPages) {
      if (!this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox) {
        this.renderSelectAllCheckbox(this._isSelectAllChecked);
      }
      if (!this._options.hideInFilterHeaderRow) {
        const selectAllElm = this._headerRowNode?.querySelector<HTMLInputElement>(`#header-filter-selector${this._selectAll_UID}`);
        if (selectAllElm) {
          selectAllElm.checked = this._isSelectAllChecked;
        }
      }
    }

    // Remove items that shouln't of been selected in the first place (Got here Ctrl + click)
    if (removeList.length > 0) {
      for (i = 0; i < removeList.length; i++) {
        const remIdx = selectedRows.indexOf(removeList[i]);
        selectedRows.splice(remIdx, 1);
      }
      this._grid.setSelectedRows(selectedRows, 'click.cleanup');
    }
  }

  protected handleDataViewSelectedIdsChanged() {
    const selectedIds = this._dataView.getAllSelectedFilteredIds();
    const filteredItems = this._dataView.getFilteredItems();
    let disabledCount = 0;

    if (typeof this._selectableOverride === 'function' && selectedIds.length > 0) {
      for (let k = 0; k < this._dataView.getItemCount(); k++) {
        // If we are allowed to select the row
        const dataItem: T = this._dataView.getItemByIdx(k);
        const idProperty = this._dataView.getIdPropertyName();
        const dataItemId = dataItem[idProperty as keyof T];
        const foundItemIdx = filteredItems.findIndex(function (item) {
          return item[idProperty as keyof T] === dataItemId;
        });
        if (foundItemIdx >= 0 && !this.checkSelectableOverride(k, dataItem, this._grid)) {
          disabledCount++;
        }
      }
    }
    this._isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length;

    if (!this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox) {
      this.renderSelectAllCheckbox(this._isSelectAllChecked);
    }
    if (!this._options.hideInFilterHeaderRow) {
      const selectAllElm = this._headerRowNode?.querySelector<HTMLInputElement>(`#header-filter-selector${this._selectAll_UID}`);
      if (selectAllElm) {
        selectAllElm.checked = this._isSelectAllChecked;
      }
    }
  }

  protected handleKeyDown(e: KeyboardEvent, args: any) {
    if (e.which == 32) {
      if (this._grid.getColumns()[args.cell].id === this._options.columnId) {
        // if editing, try to commit
        if (!this._grid.getEditorLock().isActive() || this._grid.getEditorLock().commitCurrentEdit()) {
          this.toggleRowSelection(args.row);
        }
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  }

  protected handleClick(e: DOMEvent<HTMLInputElement>, args: { row: number; cell: number; }) {
    // clicking on a row select checkbox
    if (this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.type === 'checkbox') {
      // if editing, try to commit
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      this.toggleRowSelection(args.row);
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  protected toggleRowSelection(row: number) {
    const dataContext = this._grid.getDataItem(row);
    if (!this.checkSelectableOverride(row, dataContext, this._grid)) {
      return;
    }

    if (this._selectedRowsLookup[row]) {
      const newSelectedRows = this._grid.getSelectedRows().filter((n) => n !== row);
      this._grid.setSelectedRows(newSelectedRows, 'click.toggle');
    } else {
      this._grid.setSelectedRows(this._grid.getSelectedRows().concat(row), 'click.toggle');
    }
    this._grid.setActiveCell(row, this.getCheckboxColumnCellIndex());
  }

  selectRows(rowArray: number[]) {
    const addRows: number[] = [];
    for (let i = 0, l = rowArray.length; i < l; i++) {
      if (!this._selectedRowsLookup[rowArray[i]]) {
        addRows[addRows.length] = rowArray[i];
      }
    }
    this._grid.setSelectedRows(this._grid.getSelectedRows().concat(addRows), 'SlickCheckboxSelectColumn.selectRows');
  }

  deSelectRows(rowArray: number[]) {
    const removeRows: number[] = [];
    for (let i = 0, l = rowArray.length; i < l; i++) {
      if (this._selectedRowsLookup[rowArray[i]]) {
        removeRows[removeRows.length] = rowArray[i];
      }
    }

    this._grid.setSelectedRows(this._grid.getSelectedRows().filter((n) => removeRows.indexOf(n) < 0), 'SlickCheckboxSelectColumn.deSelectRows');
  }

  protected handleHeaderClick(e: DOMEvent<HTMLInputElement>, args: any) {
    if (args.column.id == this._options.columnId && e.target.type === 'checkbox') {
      // if editing, try to commit
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      let isAllSelected = e.target.checked;
      const caller = isAllSelected ? 'click.selectAll' : 'click.unselectAll';
      const rows: number[] = [];

      if (isAllSelected) {
        for (let i = 0; i < this._grid.getDataLength(); i++) {
          // Get the row and check it's a selectable row before pushing it onto the stack
          const rowItem = this._grid.getDataItem(i);
          if (!rowItem.__group && !rowItem.__groupTotals && this.checkSelectableOverride(i, rowItem, this._grid)) {
            rows.push(i);
          }
        }
        isAllSelected = true;
      }
      if (this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages) {
        const ids: Array<number | string> = [];
        const filteredItems = this._dataView.getFilteredItems();
        for (let j = 0; j < filteredItems.length; j++) {
          // Get the row and check it's a selectable ID (it could be in a different page) before pushing it onto the stack
          const dataviewRowItem: T = filteredItems[j];
          if (this.checkSelectableOverride(j, dataviewRowItem, this._grid)) {
            ids.push(dataviewRowItem[this._dataView.getIdPropertyName() as keyof T] as number | string);
          }
        }
        this._dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
      }
      this._grid.setSelectedRows(rows, caller);
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  protected getCheckboxColumnCellIndex() {
    if (this._checkboxColumnCellIndex === null) {
      this._checkboxColumnCellIndex = 0;
      const colArr = this._grid.getColumns();
      for (let i = 0; i < colArr.length; i++) {
        if (colArr[i].id == this._options.columnId) {
          this._checkboxColumnCellIndex = i;
        }
      }
    }
    return this._checkboxColumnCellIndex;
  }

  getColumnDefinition() {
    return {
      id: this._options.columnId,
      name: (this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow) ? '' : `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`,
      toolTip: (this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow) ? '' : this._options.toolTip,
      field: "sel",
      width: this._options.width,
      resizable: false,
      sortable: false,
      cssClass: this._options.cssClass,
      hideSelectAllCheckbox: this._options.hideSelectAllCheckbox,
      formatter: this.checkboxSelectionFormatter.bind(this),
      // exclude from all menus, defaults to true unless the option is provided differently by the user
      excludeFromColumnPicker: this._options.excludeFromColumnPicker ?? true,
      excludeFromGridMenu: this._options.excludeFromGridMenu ?? true,
      excludeFromHeaderMenu: this._options.excludeFromHeaderMenu ?? true,
    };
  }

  protected addCheckboxToFilterHeaderRow(grid: SlickGrid) {
    this._handler.subscribe(grid.onHeaderRowCellRendered, (_e: any, args: any) => {
      if (args.column.field === "sel") {
        Utils.emptyElement(args.node);
        const spanElm = document.createElement('span');
        spanElm.id = 'filter-checkbox-selectall-container';

        const inputElm = document.createElement('input');
        inputElm.type = 'checkbox';
        inputElm.id = `header-filter-selector${this._selectAll_UID}`;

        const labelElm = document.createElement('label');
        labelElm.htmlFor = `header-filter-selector${this._selectAll_UID}`;

        spanElm.appendChild(inputElm);
        spanElm.appendChild(labelElm);
        args.node.appendChild(spanElm);
        this._headerRowNode = args.node;

        this._bindingEventService.bind(spanElm, 'click', ((e: DOMEvent<HTMLInputElement>) => this.handleHeaderClick(e, args)) as EventListener);
      }
    });
  }

  protected createUID() {
    return Math.round(10000000 * Math.random());
  }

  protected checkboxSelectionFormatter(row: number, _cell: number, _val: any, _columnDef: Column, dataContext: any, grid: SlickGrid) {
    const UID = this.createUID() + row;

    if (dataContext) {
      if (!this.checkSelectableOverride(row, dataContext, grid)) {
        return null;
      } else {
        return this._selectedRowsLookup[row]
          ? `<input id="selector${UID}" type="checkbox" checked="checked"><label for="selector${UID}"></label>`
          : `<input id="selector${UID}" type="checkbox"><label for="selector${UID}"></label>`;
      }
    }
    return null;
  }

  protected checkSelectableOverride(row: number, dataContext: any, grid: SlickGrid) {
    if (typeof this._selectableOverride === 'function') {
      return this._selectableOverride(row, dataContext, grid);
    }
    return true;
  }

  protected renderSelectAllCheckbox(isSelectAllChecked?: boolean) {
    if (isSelectAllChecked) {
      this._grid.updateColumnHeader(this._options.columnId || '', `<input id="header-selector${this._selectAll_UID}" type="checkbox" checked="checked"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip);
    } else {
      this._grid.updateColumnHeader(this._options.columnId || '', `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip);
    }
  }

  /**
   * Method that user can pass to override the default behavior or making every row a selectable row.
   * In order word, user can choose which rows to be selectable or not by providing his own logic.
   * @param overrideFn: override function callback
   */
  selectableOverride(overrideFn: SelectableOverrideCallback<T>) {
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
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      CheckboxSelectColumn: SlickCheckboxSelectColumn
    }
  });
}

