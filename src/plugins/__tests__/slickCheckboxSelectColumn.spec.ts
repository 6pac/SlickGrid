import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickCheckboxSelectColumn } from '../slick.checkboxselectcolumn';

const dataViewStub = {
  getAllSelectedFilteredIds: vi.fn(() => []),
  getFilteredItems: vi.fn(() => []),
  getItemByIdx: vi.fn(),
  getItemCount: vi.fn(() => 0),
  getIdPropertyName: () => 'id',
  onPagingInfoChanged: new SlickEvent(),
  onSelectedRowIdsChanged: new SlickEvent(),
  setSelectedIds: vi.fn(),
};

const editorLock = {
  commitCurrentEdit: vi.fn(() => true),
  isActive: vi.fn(() => false),
};

const columns: Column[] = [
  { id: '_checkbox_selector', field: 'sel' },
  { id: 'firstName', field: 'firstName', name: 'First Name' },
  { id: 'lastName', field: 'lastName', name: 'Last Name' },
];

const gridStub = {
  getData: vi.fn(() => dataViewStub),
  getDataItem: vi.fn(),
  getDataLength: vi.fn(() => columns.length),
  getEditorLock: () => editorLock,
  getOptions: vi.fn(() => ({ multiSelect: true }) as GridOption),
  getSelectedRows: vi.fn(() => []),
  getColumns: vi.fn(() => columns),
  invalidateRow: vi.fn(),
  render: vi.fn(),
  setActiveCell: vi.fn(),
  setSelectedRows: vi.fn(),
  updateColumnHeader: vi.fn(),
  onAfterSetColumns: new SlickEvent(),
  onAfterUpdateColumns: new SlickEvent(),
  onClick: new SlickEvent(),
  onHeaderClick: new SlickEvent(),
  onHeaderRowCellRendered: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onSelectedRowsChanged: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickCheckboxSelectColumn', () => {
  let plugin: SlickCheckboxSelectColumn;

  beforeEach(() => {
    plugin = new SlickCheckboxSelectColumn();
    editorLock.commitCurrentEdit.mockReset();
    editorLock.commitCurrentEdit.mockReturnValue(true);
    editorLock.isActive.mockReset();
    editorLock.isActive.mockReturnValue(false);
    dataViewStub.getAllSelectedFilteredIds.mockReset();
    dataViewStub.getAllSelectedFilteredIds.mockReturnValue([]);
    dataViewStub.getFilteredItems.mockReset();
    dataViewStub.getFilteredItems.mockReturnValue([]);
  });

  afterEach(() => {
    plugin.destroy();
    vi.restoreAllMocks();
  });

  it('uses the current default options', () => {
    expect(plugin.getOptions()).toEqual({
      applySelectOnAllPages: false,
      columnId: '_checkbox_selector',
      cssClass: undefined,
      hideSelectAllCheckbox: false,
      name: '',
      toolTip: 'Select/Deselect All',
      width: 30,
      reorderable: false,
      hideInColumnTitleRow: false,
      hideInFilterHeaderRow: true,
    });
  });

  it('builds the selector column definition from its options', () => {
    plugin = new SlickCheckboxSelectColumn({ columnId: 'rowSelector', name: 'Choose rows', width: 36 });

    expect(plugin.getColumnDefinition()).toEqual(expect.objectContaining({
      id: 'rowSelector',
      field: 'sel',
      name: expect.any(DocumentFragment),
      toolTip: 'Select/Deselect All',
      width: 36,
      resizable: false,
      sortable: false,
      formatter: expect.any(Function),
    }));
  });

  it('gives selection checkboxes configurable accessible names', () => {
    plugin = new SlickCheckboxSelectColumn({ selectAllAriaLabel: 'Select all records', rowAriaLabel: 'Select record' });
    const column = plugin.getColumnDefinition();
    expect((column.name as DocumentFragment).querySelector('input')?.getAttribute('aria-label')).toBe('Select all records');
    const row = column.formatter!(2, 0, null, column as Column, {}, gridStub) as DocumentFragment;
    expect(row.querySelector('input')?.getAttribute('aria-label')).toBe('Select record');
  });

  it('shows the configured name without a header checkbox when the header checkbox is hidden', () => {
    plugin = new SlickCheckboxSelectColumn({ name: 'Selection', hideSelectAllCheckbox: true });

    expect(plugin.getColumnDefinition()).toEqual(expect.objectContaining({ name: 'Selection', toolTip: '' }));
  });

  it('updates or hides the column header when options change', () => {
    plugin.init(gridStub);
    const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

    plugin.setOptions({ name: 'Selection', hideInColumnTitleRow: true });
    expect(updateHeader).toHaveBeenCalledWith('_checkbox_selector', 'Selection', '');

    plugin.setOptions({ hideSelectAllCheckbox: true });
    expect(updateHeader).toHaveBeenLastCalledWith('_checkbox_selector', 'Selection', '');
  });

  it('renders the header checkbox again after the grid columns change', () => {
    plugin.init(gridStub);
    plugin.setOptions({ hideInColumnTitleRow: false });
    const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

    gridStub.onAfterSetColumns.notify({ newColumns: columns, grid: gridStub });
    gridStub.onAfterUpdateColumns.notify({ columns, grid: gridStub });

    expect(updateHeader).toHaveBeenCalledTimes(3);
  });

  it('selects selectable rows when the header checkbox is checked', () => {
    gridStub.getDataLength = vi.fn(() => 3) as any;
    gridStub.getDataItem = vi.fn((row: number) => row === 1 ? { __group: true } : { id: row }) as any;
    plugin.init(gridStub);
    const selectedRows = vi.spyOn(gridStub, 'setSelectedRows');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    gridStub.onHeaderClick.notify({ column: columns[0] } as any, Object.assign(new SlickEventData(), {
      target: checkbox,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    }));

    expect(selectedRows).toHaveBeenCalledWith([0, 2], 'click.selectAll');
  });

  it('selects all filtered DataView ids when applySelectOnAllPages is enabled', () => {
    dataViewStub.getFilteredItems.mockReturnValue([{ id: 'a' }, { id: 'b' }] as any);
    plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true });
    plugin.init(gridStub);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    gridStub.onHeaderClick.notify({ column: columns[0] } as any, Object.assign(new SlickEventData(), {
      target: checkbox,
      stopPropagation: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    }));

    expect(dataViewStub.setSelectedIds).toHaveBeenCalledWith(['a', 'b'], {
      isRowBeingAdded: true,
      shouldTriggerEvent: false,
      applyRowSelectionToGrid: false,
    });
  });

  it('adds and removes a selected row when the row checkbox is clicked', () => {
    gridStub.getDataItem = vi.fn(() => ({ id: 1 })) as any;
    gridStub.getSelectedRows = vi.fn(() => [0]) as any;
    plugin.init(gridStub);
    (plugin as any)._selectedRowsLookup = {};
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    const setActiveCell = vi.spyOn(gridStub, 'setActiveCell');
    const clickEvent = Object.assign(new SlickEventData(), {
      target: checkbox,
      stopPropagation: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    });

    gridStub.onClick.notify({ row: 2, cell: 0 } as any, clickEvent);

    expect(setRows).toHaveBeenCalledWith([0, 2], 'click.toggle');
    expect(setActiveCell).toHaveBeenCalledWith(2, 0);
  });

  it('does not toggle a row when the editor cannot commit', () => {
    editorLock.isActive.mockReturnValue(true);
    editorLock.commitCurrentEdit.mockReturnValue(false);
    plugin.init(gridStub);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    const clickEvent = Object.assign(new SlickEventData(), {
      target: checkbox,
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    });

    gridStub.onClick.notify({ row: 2, cell: 0 } as any, clickEvent);

    expect(setRows).not.toHaveBeenCalled();
    expect(clickEvent.preventDefault).toHaveBeenCalled();
  });

  it('does not toggle a row when selectableOverride rejects the item', () => {
    gridStub.getDataItem = vi.fn(() => ({ id: 1 })) as any;
    plugin = new SlickCheckboxSelectColumn({ selectableOverride: () => false });
    plugin.init(gridStub);
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    const setActiveCell = vi.spyOn(gridStub, 'setActiveCell');

    (plugin as any).toggleRowSelection(2);

    expect(setRows).not.toHaveBeenCalled();
    expect(setActiveCell).not.toHaveBeenCalled();
  });

  it('toggles the row when Space is pressed on the checkbox cell', () => {
    gridStub.getDataItem = vi.fn(() => ({ id: 1 })) as any;
    gridStub.getSelectedRows = vi.fn(() => []) as any;
    plugin.init(gridStub);
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    const event = Object.assign(new SlickEventData(), {
      which: 32,
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    });

    gridStub.onKeyDown.notify({ cell: 0, row: 1 } as any, event);

    expect(setRows).toHaveBeenCalledWith([1], 'click.toggle');
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('selects and deselects rows from the public selection methods', () => {
    plugin.init(gridStub);
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    gridStub.getSelectedRows = vi.fn(() => [1, 2]) as any;
    (plugin as any)._selectedRowsLookup = { 1: true, 2: true };

    plugin.selectRows([1, 2, 3]);
    plugin.deSelectRows([1, 2, 3]);

    expect(setRows).toHaveBeenNthCalledWith(1, [1, 2, 3], 'SlickCheckboxSelectColumn.selectRows');
    expect(setRows).toHaveBeenNthCalledWith(2, [], 'SlickCheckboxSelectColumn.deSelectRows');
  });

  it('removes rows rejected by selectableOverride when the selected rows change', () => {
    gridStub.getSelectedRows = vi.fn(() => [1]) as any;
    gridStub.getDataItem = vi.fn(() => ({ id: 1 })) as any;
    plugin = new SlickCheckboxSelectColumn({ selectableOverride: () => false });
    plugin.init(gridStub);
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');

    gridStub.onSelectedRowsChanged.notify({ rows: [1], previousSelectedRows: [] } as any);

    expect(gridStub.render).toHaveBeenCalled();
    expect(setRows).toHaveBeenCalledWith([], 'click.cleanup');
  });

  it('updates the header checkbox when DataView selection ids change', () => {
    gridStub.getData = vi.fn(() => dataViewStub) as any;
    gridStub.getDataLength = vi.fn(() => 2) as any;
    dataViewStub.getAllSelectedFilteredIds.mockReturnValue(['a', 'b'] as any);
    dataViewStub.getFilteredItems.mockReturnValue([{ id: 'a' }, { id: 'b' }] as any);
    plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true, hideInColumnTitleRow: false });
    plugin.init(gridStub);
    const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

    dataViewStub.onSelectedRowIdsChanged.notify({});

    expect(updateHeader).toHaveBeenCalledWith('_checkbox_selector', expect.any(DocumentFragment), 'Select/Deselect All');
  });

  describe('select all checkbox in the filter header row', () => {
    const renderHeaderRowCell = (column: Column = columns[0]) => {
      const node = document.createElement('div');
      node.textContent = 'previous content';
      gridStub.onHeaderRowCellRendered.notify({ node, column, grid: gridStub } as any);
      return node;
    };

    it('renders a labelled select all checkbox using the toolTip as the default accessible name', () => {
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);

      const node = renderHeaderRowCell();
      const container = node.querySelector<HTMLSpanElement>('#filter-checkbox-selectall-container')!;
      const input = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

      expect(node.textContent).toBe('');
      expect(container.getAttribute('aria-checked')).toBe('false');
      expect(input.id).toMatch(/^header-filter-selector\d+$/);
      expect(input.getAttribute('aria-label')).toBe('Select/Deselect All');
      expect(container.querySelector('label')?.htmlFor).toBe(input.id);
    });

    it('prefers selectAllAriaLabel over the toolTip for the accessible name', () => {
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false, selectAllAriaLabel: 'Select every record' });
      plugin.init(gridStub);

      expect(renderHeaderRowCell().querySelector('input')?.getAttribute('aria-label')).toBe('Select every record');
    });

    it('falls back to "Select all rows" when neither selectAllAriaLabel nor toolTip is set', () => {
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false, toolTip: '' });
      plugin.init(gridStub);

      expect(renderHeaderRowCell().querySelector('input')?.getAttribute('aria-label')).toBe('Select all rows');
    });

    it('leaves header row cells of other columns untouched', () => {
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);

      const node = renderHeaderRowCell(columns[1]);

      expect(node.textContent).toBe('previous content');
      expect(node.querySelector('input')).toBeNull();
    });

    it('does not subscribe to header row rendering by default', () => {
      plugin.init(gridStub);

      expect(renderHeaderRowCell().textContent).toBe('previous content');
    });

    it('selects all rows when the filter header row checkbox is clicked', () => {
      gridStub.getDataLength = vi.fn(() => 2) as any;
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');
      const input = renderHeaderRowCell().querySelector<HTMLInputElement>('input')!;

      input.click();

      expect(input.checked).toBe(true);
      expect(setRows).toHaveBeenCalledWith([0, 1], 'click.selectAll');
    });

    it('stops reacting to filter header row clicks after destroy', () => {
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');
      const input = renderHeaderRowCell().querySelector<HTMLInputElement>('input')!;

      plugin.destroy();
      input.click();

      expect(setRows).not.toHaveBeenCalled();
    });

    it('syncs the filter header row checkbox when the selected rows change', () => {
      gridStub.getDataLength = vi.fn(() => 2) as any;
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      gridStub.getSelectedRows = vi.fn(() => [0, 1]) as any;
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);
      const input = renderHeaderRowCell().querySelector<HTMLInputElement>('input')!;

      gridStub.onSelectedRowsChanged.notify({ rows: [0, 1], previousSelectedRows: [] } as any);
      expect(input.checked).toBe(true);

      gridStub.getSelectedRows = vi.fn(() => [0]) as any;
      gridStub.onSelectedRowsChanged.notify({ rows: [0], previousSelectedRows: [0, 1] } as any);
      expect(input.checked).toBe(false);
    });

    it('syncs the filter header row checkbox when DataView selected ids change', () => {
      dataViewStub.getAllSelectedFilteredIds.mockReturnValue(['a', 'b'] as any);
      dataViewStub.getFilteredItems.mockReturnValue([{ id: 'a' }, { id: 'b' }] as any);
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true, hideInFilterHeaderRow: false, hideInColumnTitleRow: true });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');
      const input = renderHeaderRowCell().querySelector<HTMLInputElement>('input')!;

      dataViewStub.onPagingInfoChanged.notify({} as any);

      expect(input.checked).toBe(true);
      expect(updateHeader).not.toHaveBeenCalled();
    });

    it('shows the container again and restores its checked state through setOptions', () => {
      gridStub.getDataLength = vi.fn(() => 1) as any;
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      gridStub.getSelectedRows = vi.fn(() => [0]) as any;
      plugin = new SlickCheckboxSelectColumn({ hideInFilterHeaderRow: false });
      plugin.init(gridStub);
      const node = renderHeaderRowCell();
      const container = node.querySelector<HTMLSpanElement>('#filter-checkbox-selectall-container')!;
      const input = container.querySelector<HTMLInputElement>('input')!;
      gridStub.onSelectedRowsChanged.notify({ rows: [0], previousSelectedRows: [] } as any);

      plugin.setOptions({ hideSelectAllCheckbox: true });
      expect(container.style.display).toBe('none');

      input.checked = false;
      plugin.setOptions({ hideSelectAllCheckbox: false });
      expect(container.style.display).toBe('flex');
      expect(input.checked).toBe(true);

      plugin.setOptions({ hideInFilterHeaderRow: true });
      expect(container.style.display).toBe('none');
    });

    it('tolerates setOptions showing the filter header row before any header row was rendered', () => {
      plugin.init(gridStub);

      expect(() => plugin.setOptions({ hideInFilterHeaderRow: false })).not.toThrow();
    });
  });

  describe('accessible names of the column checkboxes', () => {
    it('uses the toolTip as the select all name when no selectAllAriaLabel is given', () => {
      const column = plugin.getColumnDefinition();

      expect((column.name as DocumentFragment).querySelector('input')?.getAttribute('aria-label')).toBe('Select/Deselect All');
    });

    it('falls back to "Select all rows" when the toolTip is empty', () => {
      plugin = new SlickCheckboxSelectColumn({ toolTip: '' });
      const fragment = plugin.createCheckboxElement('my-id', true);
      const input = fragment.querySelector('input')!;

      expect(input.getAttribute('aria-label')).toBe('Select all rows');
      expect(input.id).toBe('my-id');
      expect(input.checked).toBe(true);
      expect(fragment.querySelector('label')?.htmlFor).toBe('my-id');
    });

    it('names each row checkbox by its 1-based row number when rowAriaLabel is not set', () => {
      const column = plugin.getColumnDefinition();
      const row = column.formatter!(2, 0, null, column as Column, { id: 2 }, gridStub) as DocumentFragment;

      expect(row.querySelector('input')?.getAttribute('aria-label')).toBe('Select row 3');
      expect(row.querySelector<HTMLInputElement>('input')?.checked).toBe(false);
    });

    it('renders the row checkbox as checked when the row is selected', () => {
      (plugin as any)._selectedRowsLookup = { 0: true };
      const column = plugin.getColumnDefinition();
      const row = column.formatter!(0, 0, null, column as Column, { id: 0 }, gridStub) as DocumentFragment;

      expect(row.querySelector<HTMLInputElement>('input')?.checked).toBe(true);
    });

    it('renders no checkbox for rows without data or rejected by selectableOverride', () => {
      plugin.selectableOverride((row) => row !== 1);
      const column = plugin.getColumnDefinition();

      expect(column.formatter!(0, 0, null, column as Column, null, gridStub)).toBeNull();
      expect(column.formatter!(1, 0, null, column as Column, { id: 1 }, gridStub)).toBeNull();
      expect(column.formatter!(2, 0, null, column as Column, { id: 2 }, gridStub)).toBeInstanceOf(DocumentFragment);
    });
  });

  it('keeps the menu exclusions given in the options', () => {
    plugin = new SlickCheckboxSelectColumn({ excludeFromColumnPicker: false, excludeFromGridMenu: false, excludeFromHeaderMenu: false, hideInColumnTitleRow: true, name: 'Pick' });

    expect(plugin.getColumnDefinition()).toEqual(expect.objectContaining({
      name: 'Pick',
      toolTip: '',
      excludeFromColumnPicker: false,
      excludeFromGridMenu: false,
      excludeFromHeaderMenu: false,
    }));
  });

  it('hides the header checkbox without a name when hideInColumnTitleRow is set without a name', () => {
    plugin.init(gridStub);
    const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

    plugin.setOptions({ hideInColumnTitleRow: true });

    expect(updateHeader).toHaveBeenCalledOnce();
    expect(updateHeader).toHaveBeenCalledWith('_checkbox_selector', '', '');
  });

  it('does not subscribe to header clicks when hideInColumnTitleRow is set', () => {
    gridStub.getDataLength = vi.fn(() => 1) as any;
    gridStub.getDataItem = vi.fn(() => ({ id: 0 })) as any;
    plugin = new SlickCheckboxSelectColumn({ hideInColumnTitleRow: true });
    plugin.init(gridStub);
    const setRows = vi.spyOn(gridStub, 'setSelectedRows');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    gridStub.onHeaderClick.notify({ column: columns[0] } as any, Object.assign(new SlickEventData(), { target: checkbox }));

    expect(setRows).not.toHaveBeenCalled();
  });

  describe('header click', () => {
    const notifyHeaderClick = (target: HTMLElement, column: Column = columns[0]) => {
      const event = Object.assign(new SlickEventData(), {
        target,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      });
      gridStub.onHeaderClick.notify({ column } as any, event);
      return event;
    };
    const createCheckbox = (checked: boolean) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = checked;
      return checkbox;
    };

    it('unselects every row when the header checkbox is unchecked', () => {
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      const event = notifyHeaderClick(createCheckbox(false));

      expect(setRows).toHaveBeenCalledWith([], 'click.unselectAll');
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('ignores clicks on other columns or on non checkbox targets', () => {
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      notifyHeaderClick(createCheckbox(true), columns[1]);
      notifyHeaderClick(document.createElement('span'));

      expect(setRows).not.toHaveBeenCalled();
    });

    it('does not change the selection when the editor cannot commit', () => {
      editorLock.isActive.mockReturnValue(true);
      editorLock.commitCurrentEdit.mockReturnValue(false);
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      const event = notifyHeaderClick(createCheckbox(true));

      expect(setRows).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('skips group totals and rows rejected by selectableOverride', () => {
      gridStub.getDataLength = vi.fn(() => 4) as any;
      gridStub.getDataItem = vi.fn((row: number) => row === 3 ? { __groupTotals: true } : { id: row }) as any;
      plugin = new SlickCheckboxSelectColumn({ selectableOverride: (_row, item) => item.id !== 1 });
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      notifyHeaderClick(createCheckbox(true));

      expect(setRows).toHaveBeenCalledWith([0, 2], 'click.selectAll');
    });

    it('unselects every filtered DataView id across pages, skipping rejected items', () => {
      dataViewStub.getFilteredItems.mockReturnValue([{ id: 'a' }, { id: 'b' }, { id: 'c' }] as any);
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true, selectableOverride: (_row, item) => item?.id !== 'b' });
      plugin.init(gridStub);

      notifyHeaderClick(createCheckbox(false));

      expect(dataViewStub.setSelectedIds).toHaveBeenCalledWith(['a', 'c'], {
        isRowBeingAdded: false,
        shouldTriggerEvent: false,
        applyRowSelectionToGrid: false,
      });
    });

    it('does not use the DataView when the grid data is a plain array', () => {
      gridStub.getData = vi.fn(() => []) as any;
      gridStub.getDataLength = vi.fn(() => 1) as any;
      gridStub.getDataItem = vi.fn(() => ({ id: 0 })) as any;
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true });
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      notifyHeaderClick(createCheckbox(true));
      dataViewStub.onSelectedRowIdsChanged.notify({});

      expect(setRows).toHaveBeenCalledWith([0], 'click.selectAll');
      expect(dataViewStub.setSelectedIds).not.toHaveBeenCalled();
      expect(dataViewStub.getAllSelectedFilteredIds).not.toHaveBeenCalled();
      gridStub.getData = vi.fn(() => dataViewStub) as any;
    });
  });

  describe('row toggling', () => {
    const clickRowCheckbox = (row: number, cell = 0) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      const event = Object.assign(new SlickEventData(), {
        target: checkbox,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      });
      gridStub.onClick.notify({ row, cell } as any, event);
      return event;
    };

    beforeEach(() => {
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      gridStub.getDataLength = vi.fn(() => 3) as any;
    });

    afterEach(() => {
      gridStub.getOptions = vi.fn(() => ({ multiSelect: true }) as GridOption) as any;
    });

    it('removes an already selected row in multi-select mode', () => {
      gridStub.getSelectedRows = vi.fn(() => [0, 2]) as any;
      plugin.init(gridStub);
      gridStub.onSelectedRowsChanged.notify({ rows: [0, 2], previousSelectedRows: [] } as any);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      const event = clickRowCheckbox(2);

      expect(setRows).toHaveBeenCalledWith([0], 'click.toggle');
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('selects only the clicked row in single-select mode, and clears it on a second click', () => {
      gridStub.getOptions = vi.fn(() => ({ multiSelect: false }) as GridOption) as any;
      gridStub.getSelectedRows = vi.fn(() => []) as any;
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      clickRowCheckbox(1);
      expect(setRows).toHaveBeenLastCalledWith([1], 'click.toggle');

      gridStub.getSelectedRows = vi.fn(() => [1]) as any;
      gridStub.onSelectedRowsChanged.notify({ rows: [1], previousSelectedRows: [] } as any);
      clickRowCheckbox(1);
      expect(setRows).toHaveBeenLastCalledWith([], 'click.toggle');
    });

    it('sets the active cell on the checkbox column even when it is not the first column', () => {
      const reordered: Column[] = [columns[1], columns[0], columns[2]];
      gridStub.getColumns = vi.fn(() => reordered) as any;
      gridStub.getSelectedRows = vi.fn(() => []) as any;
      plugin.init(gridStub);
      const setActiveCell = vi.spyOn(gridStub, 'setActiveCell');

      clickRowCheckbox(0, 1);

      expect(setActiveCell).toHaveBeenCalledWith(0, 1);
      gridStub.getColumns = vi.fn(() => columns) as any;
    });

    it('ignores clicks on other columns or targets that are not checkboxes', () => {
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      clickRowCheckbox(1, 1);
      gridStub.onClick.notify({ row: 1, cell: 0 } as any, Object.assign(new SlickEventData(), { target: document.createElement('div') }));

      expect(setRows).not.toHaveBeenCalled();
    });

    it('commits an active editor before toggling with the keyboard', () => {
      editorLock.isActive.mockReturnValue(true);
      gridStub.getSelectedRows = vi.fn(() => []) as any;
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');
      const event = Object.assign(new SlickEventData(), { which: 32, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });

      gridStub.onKeyDown.notify({ cell: 0, row: 2 } as any, event);

      expect(editorLock.commitCurrentEdit).toHaveBeenCalled();
      expect(setRows).toHaveBeenCalledWith([2], 'click.toggle');
    });

    it('does not toggle with Space when the editor cannot commit, but still swallows the key', () => {
      editorLock.isActive.mockReturnValue(true);
      editorLock.commitCurrentEdit.mockReturnValue(false);
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');
      const event = Object.assign(new SlickEventData(), { which: 32, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });

      gridStub.onKeyDown.notify({ cell: 0, row: 2 } as any, event);

      expect(setRows).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('ignores keys other than Space and Space on other columns', () => {
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');
      const enter = Object.assign(new SlickEventData(), { which: 13, preventDefault: vi.fn() });
      const space = Object.assign(new SlickEventData(), { which: 32, preventDefault: vi.fn() });

      gridStub.onKeyDown.notify({ cell: 0, row: 1 } as any, enter);
      gridStub.onKeyDown.notify({ cell: 1, row: 1 } as any, space);

      expect(setRows).not.toHaveBeenCalled();
      expect(enter.preventDefault).not.toHaveBeenCalled();
      expect(space.preventDefault).not.toHaveBeenCalled();
    });

    it('stops handling grid events after destroy', () => {
      plugin.init(gridStub);
      const setRows = vi.spyOn(gridStub, 'setSelectedRows');

      plugin.destroy();
      clickRowCheckbox(1);

      expect(setRows).not.toHaveBeenCalled();
    });
  });

  describe('selected rows changes', () => {
    it('invalidates newly selected and previously selected rows and checks the header when all rows are selected', () => {
      gridStub.getDataLength = vi.fn(() => 2) as any;
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      gridStub.getSelectedRows = vi.fn(() => [0]) as any;
      plugin.init(gridStub);
      const invalidateRow = vi.spyOn(gridStub, 'invalidateRow');
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      gridStub.onSelectedRowsChanged.notify({ rows: [0], previousSelectedRows: [] } as any);
      expect(invalidateRow).toHaveBeenCalledWith(0);
      const firstHeader = updateHeader.mock.lastCall![1] as DocumentFragment;
      expect(firstHeader.querySelector<HTMLInputElement>('input')?.checked).toBe(false);

      invalidateRow.mockClear();
      gridStub.getSelectedRows = vi.fn(() => [1, 0]) as any;
      gridStub.onSelectedRowsChanged.notify({ rows: [1, 0], previousSelectedRows: [0] } as any);
      expect(invalidateRow).toHaveBeenCalledWith(1);
      expect(invalidateRow).toHaveBeenCalledWith(0);
      const secondHeader = updateHeader.mock.lastCall![1] as DocumentFragment;
      expect(secondHeader.querySelector<HTMLInputElement>('input')?.checked).toBe(true);
    });

    it('counts rows rejected by selectableOverride as selected for the select all state', () => {
      gridStub.getDataLength = vi.fn(() => 3) as any;
      gridStub.getDataItem = vi.fn((row: number) => ({ id: row })) as any;
      gridStub.getSelectedRows = vi.fn(() => [0, 2]) as any;
      plugin = new SlickCheckboxSelectColumn({ selectableOverride: (_row, item) => item.id !== 1 });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      gridStub.onSelectedRowsChanged.notify({ rows: [0, 2], previousSelectedRows: [] } as any);

      const header = updateHeader.mock.lastCall![1] as DocumentFragment;
      expect(header.querySelector<HTMLInputElement>('input')?.checked).toBe(true);
    });

    it('does not render the header checkbox when hideSelectAllCheckbox is set', () => {
      gridStub.getSelectedRows = vi.fn(() => []) as any;
      plugin = new SlickCheckboxSelectColumn({ hideSelectAllCheckbox: true });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      gridStub.onSelectedRowsChanged.notify({ rows: [], previousSelectedRows: [] } as any);

      expect(updateHeader).not.toHaveBeenCalled();
      expect(gridStub.render).toHaveBeenCalled();
    });

    it('leaves the header to the DataView handler when applySelectOnAllPages is enabled', () => {
      gridStub.getSelectedRows = vi.fn(() => []) as any;
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      gridStub.onSelectedRowsChanged.notify({ rows: [], previousSelectedRows: [] } as any);

      expect(updateHeader).not.toHaveBeenCalled();
    });
  });

  describe('DataView selected ids changes', () => {
    it('counts visible items rejected by selectableOverride as selected', () => {
      const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'hidden' }];
      dataViewStub.getAllSelectedFilteredIds.mockReturnValue(['a', 'c'] as any);
      dataViewStub.getFilteredItems.mockReturnValue(items.slice(0, 3) as any);
      const getItemCount = vi.spyOn(dataViewStub, 'getItemCount').mockReturnValue(items.length);
      const getItemByIdx = vi.spyOn(dataViewStub, 'getItemByIdx').mockImplementation(((idx: number) => items[idx]) as any);
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true, selectableOverride: (_row, item) => item.id !== 'b' && item.id !== 'hidden' });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      dataViewStub.onSelectedRowIdsChanged.notify({});

      const header = updateHeader.mock.lastCall![1] as DocumentFragment;
      expect(header.querySelector<HTMLInputElement>('input')?.checked).toBe(true);
      expect(getItemByIdx).toHaveBeenCalledTimes(4);
      getItemCount.mockRestore();
      getItemByIdx.mockRestore();
    });

    it('unchecks the header when only some filtered items are selected', () => {
      dataViewStub.getAllSelectedFilteredIds.mockReturnValue(['a'] as any);
      dataViewStub.getFilteredItems.mockReturnValue([{ id: 'a' }, { id: 'b' }] as any);
      plugin = new SlickCheckboxSelectColumn({ applySelectOnAllPages: true, selectableOverride: () => true });
      plugin.init(gridStub);
      const updateHeader = vi.spyOn(gridStub, 'updateColumnHeader');

      dataViewStub.onSelectedRowIdsChanged.notify({});

      const header = updateHeader.mock.lastCall![1] as DocumentFragment;
      expect(header.querySelector<HTMLInputElement>('input')?.checked).toBe(false);
    });
  });
});
