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
});
