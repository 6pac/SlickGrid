import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, HybridSelectionModelOption } from '../../models';
import { SlickEvent, SlickEventData, SlickRange } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickHybridSelectionModel } from '../slick.hybridselectionmodel';

const columns: Column[] = [
  { id: 'firstName', field: 'firstName' },
  { id: 'lastName', field: 'lastName' },
  { id: 'age', field: 'age' },
];

const dataView = {
  getLength: vi.fn(() => 20),
  getPagingInfo: vi.fn(() => ({ pageSize: 0 })),
};

const editorLock = { isActive: vi.fn(() => false) };

const grid = {
  canCellBeActive: vi.fn(() => true),
  canCellBeSelected: vi.fn(() => true),
  getActiveCell: vi.fn(() => ({ row: 2, cell: 1 })),
  getCellFromEvent: vi.fn(() => ({ row: 2, cell: 1 })),
  getColumnIndex: vi.fn((id: string | number) => columns.findIndex((column) => column.id === id)),
  getColumns: vi.fn(() => columns),
  getData: vi.fn(() => dataView),
  getDataLength: vi.fn(() => 20),
  getEditorLock: vi.fn(() => editorLock),
  getOptions: vi.fn(() => ({ multiSelect: true })),
  getPluginByName: vi.fn(),
  getPubSubService: vi.fn(),
  getUID: () => 'selection-grid',
  getVisibleColumns: vi.fn(() => columns),
  getViewportRowCount: vi.fn(() => 10),
  hasDataView: vi.fn(() => true),
  registerPlugin: vi.fn(),
  scrollCellIntoView: vi.fn(),
  scrollRowIntoView: vi.fn(),
  setActiveCell: vi.fn(),
  unregisterPlugin: vi.fn(),
  onActiveCellChanged: new SlickEvent(),
  onClick: new SlickEvent(),
  onKeyDown: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickHybridSelectionModel', () => {
  let plugin: SlickHybridSelectionModel;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(grid.canCellBeActive).mockReturnValue(true);
    vi.mocked(grid.canCellBeSelected).mockReturnValue(true);
    vi.mocked(grid.getActiveCell).mockReturnValue({ row: 2, cell: 1 });
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    vi.mocked(grid.getColumnIndex).mockImplementation((id: string | number) => columns.findIndex((column) => column.id === id));
    vi.mocked(grid.getColumns).mockReturnValue(columns);
    vi.mocked(grid.getDataLength).mockReturnValue(20);
    vi.mocked(grid.getOptions).mockReturnValue({ multiSelect: true });
    vi.mocked(grid.getPluginByName).mockReturnValue(undefined);
    vi.mocked(grid.getVisibleColumns).mockReturnValue(columns);
    vi.mocked(grid.getViewportRowCount).mockReturnValue(10);
    vi.mocked(dataView.getLength).mockReturnValue(20);
    vi.mocked(dataView.getPagingInfo).mockReturnValue({ pageSize: 0 });
    editorLock.isActive.mockReturnValue(false);
    plugin = new SlickHybridSelectionModel();
  });

  afterEach(() => {
    plugin.destroy();
  });

  it('provides the current default options', () => {
    expect(plugin.getOptions()).toEqual({
      selectActiveCell: true,
      selectActiveRow: true,
      dragToSelect: false,
      showDragHandle: true,
      autoScrollWhenDrag: true,
      handleRowMoveManagerColumn: true,
      rowSelectColumnIds: [],
      rowSelectOverride: undefined,
      cellRangeSelector: undefined,
      selectionType: 'mixed',
    });
  });

  it('initializes a range selector and subscribes to grid events', () => {
    plugin.init(grid);

    expect(plugin.getCellRangeSelector()).toBeTruthy();
    expect(grid.registerPlugin).toHaveBeenCalledWith(plugin.getCellRangeSelector());
  });

  it('merges updated options after initialization', () => {
    plugin.init(grid);
    const options: Partial<HybridSelectionModelOption> = { selectActiveCell: false, enableMultiSelection: true };
    plugin.setOptions(options);

    expect(plugin.getOptions()).toEqual(expect.objectContaining(options));
    expect(plugin.getOptions().selectActiveRow).toBe(true);
  });

  it('sets the active selection mode from the selectionType option', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    expect(plugin.currentSelectionModeIsRow()).toBe(true);

    plugin.destroy();
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    expect(plugin.currentSelectionModeIsRow()).toBe(false);
  });

  it('uses row mode when the active cell is in a configured row-select column', () => {
    plugin = new SlickHybridSelectionModel({ rowSelectColumnIds: ['lastName'] });
    plugin.init(grid);

    expect(plugin.rowSelectionModelIsActive({ cell: 1, row: 3, grid })).toBe(true);
    expect(plugin.rowSelectionModelIsActive({ cell: 0, row: 3, grid })).toBe(false);
  });

  it('uses the row selection override when provided', () => {
    plugin = new SlickHybridSelectionModel({ rowSelectOverride: () => true });
    plugin.init(grid);

    expect(plugin.rowSelectionModelIsActive({ cell: 0, row: 1, grid })).toBe(true);
  });

  it('uses the row move handler column for row selection in mixed mode', () => {
    plugin.init(grid);
    vi.mocked(grid.getPluginByName).mockReturnValue({ isHandlerColumn: () => true } as never);

    expect(plugin.rowSelectionModelIsActive({ cell: 0, row: 1, grid })).toBe(true);
  });

  it('selects the active cell when the grid active cell changes in cell mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const selectedRangesChanged = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');

    grid.onActiveCellChanged.notify({ cell: 1, row: 4, grid }, new SlickEventData());

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(4, 1)]);
    expect(selectedRangesChanged).toHaveBeenCalledOnce();
  });

  it('selects the active row when the grid active cell changes in row mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);

    grid.onActiveCellChanged.notify({ cell: 1, row: 4, grid }, new SlickEventData());

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(4, 0, 4, columns.length - 1)]);
    expect(plugin.getSelectedRows()).toEqual([4]);
  });

  it('does not change selection for an undefined active cell in mixed mode', () => {
    plugin.init(grid);

    grid.onActiveCellChanged.notify({ cell: undefined as unknown as number, row: 4, grid }, new SlickEventData());

    expect(plugin.getSelectedRanges()).toEqual([]);
  });

  it('converts selected rows to ranges spanning the visible columns', () => {
    plugin.init(grid);

    plugin.setSelectedRows([1, 3]);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(1, 0, 1, 2), new SlickRange(3, 0, 3, 2)]);
    expect(plugin.getSelectedRows()).toEqual([1, 3]);
  });

  it('notifies selected-range listeners when the selection changes', () => {
    plugin.init(grid);
    const changed = vi.fn();
    plugin.onSelectedRangesChanged.subscribe((_event: SlickEventData, ranges: SlickRange[]) => changed(ranges));

    plugin.setSelectedRanges([new SlickRange(1, 1, 2, 2)], 'test-selection', 'cell');

    expect(changed).toHaveBeenCalledWith([new SlickRange(1, 1, 2, 2)]);
  });

  it('does not notify listeners when an unchanged range is set again', () => {
    plugin.init(grid);
    const changed = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');
    const range = new SlickRange(1, 1, 2, 2);
    plugin.setSelectedRanges([range]);

    plugin.setSelectedRanges([new SlickRange(1, 1, 2, 2)]);

    expect(changed).toHaveBeenCalledOnce();
  });

  it('filters invalid cell ranges before storing them', () => {
    plugin.init(grid);
    vi.mocked(grid.canCellBeSelected).mockImplementation((_row, cell) => cell !== 2);

    plugin.setSelectedRanges([new SlickRange(1, 0, 1, 1), new SlickRange(2, 1, 2, 2)]);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(1, 0, 1, 1)]);
  });

  it('refreshes row ranges to span the current visible columns', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRanges([new SlickRange(2, 0, 3, 1)]);
    vi.mocked(grid.getVisibleColumns).mockReturnValue(columns.slice(0, 2));

    plugin.refreshSelections();

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(2, 0, 3, 1)]);
  });

  it('refreshes row ranges when no columns are visible', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRows([2]);
    vi.mocked(grid.getVisibleColumns).mockReturnValue([]);

    plugin.refreshSelections();

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(2, 0, 2, -1)]);
  });

  it('toggles an individual cell range when Ctrl-clicking in multi-selection mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell', enableMultiSelection: true });
    plugin.init(grid);
    plugin.setSelectedRanges([new SlickRange(2, 1)]);
    const event = Object.assign(new SlickEventData(), { ctrlKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 2, cell: 1, grid }, event);

    expect(plugin.getSelectedRanges()).toEqual([]);
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('unregisters and destroys its range selector', () => {
    plugin.init(grid);
    const selector = plugin.getCellRangeSelector()!;
    const destroy = vi.spyOn(selector, 'destroy');

    plugin.destroy();

    expect(grid.unregisterPlugin).toHaveBeenCalledWith(selector);
    expect(destroy).toHaveBeenCalledOnce();
  });

  it('selects the entire grid with Ctrl+A in cell mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const event = Object.assign(new SlickEventData(), {
      ctrlKey: true,
      key: 'a',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(0, 0, 19, 2)]);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(event.stopPropagation).toHaveBeenCalledOnce();
  });

  it('extends a cell selection with Shift+ArrowDown and scrolls the new edge into view', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const event = Object.assign(new SlickEventData(), {
      key: 'ArrowDown',
      shiftKey: true,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(2, 1, 3, 1)]);
    expect(grid.scrollRowIntoView).toHaveBeenCalledWith(3);
    expect(grid.scrollCellIntoView).toHaveBeenCalledWith(3, 1);
    expect(event.preventDefault).toHaveBeenCalledOnce();
  });

  it('extends a selection by one page and clamps it to the last data row', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    vi.mocked(grid.getActiveCell).mockReturnValue({ row: 17, cell: 1 });
    const event = Object.assign(new SlickEventData(), {
      key: 'PageDown',
      shiftKey: true,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(17, 1, 19, 1)]);
    expect(grid.scrollRowIntoView).toHaveBeenCalledWith(19);
  });

  it('ignores unrelated keys and modified keys that are not supported', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const event = Object.assign(new SlickEventData(), { key: 'x', shiftKey: true, preventDefault: vi.fn() });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRanges()).toEqual([]);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('extends a row selection with Shift+ArrowDown', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRows([2]);
    const event = Object.assign(new SlickEventData(), {
      key: 'ArrowDown',
      which: 40,
      shiftKey: true,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRows()).toEqual([2, 3]);
    expect(grid.scrollRowIntoView).toHaveBeenCalledWith(3);
  });

  it('collapses an extended row selection when multi-select is disabled', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRows([2, 3]);
    vi.mocked(grid.getOptions).mockReturnValue({ multiSelect: false });
    const event = Object.assign(new SlickEventData(), {
      key: 'ArrowDown',
      which: 40,
      shiftKey: true,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    grid.onKeyDown.notify({ grid, row: 2, cell: 1 }, event);

    expect(plugin.getSelectedRows()).toEqual([4]);
  });

  it('adds and removes rows with Ctrl-click in row mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRows([2]);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 3, cell: 1 });
    const addEvent = Object.assign(new SlickEventData(), { ctrlKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 3, cell: 1, grid }, addEvent);

    expect(plugin.getSelectedRows()).toEqual([2, 3]);
    expect(grid.setActiveCell).toHaveBeenCalledWith(3, 1);

    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    const removeEvent = Object.assign(new SlickEventData(), { ctrlKey: true, stopImmediatePropagation: vi.fn() });
    grid.onClick.notify({ row: 2, cell: 1, grid }, removeEvent);

    expect(plugin.getSelectedRows()).toEqual([3]);
  });

  it('extends a row selection to the clicked row with Shift-click', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row' });
    plugin.init(grid);
    plugin.setSelectedRows([2]);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 4, cell: 1 });
    const event = Object.assign(new SlickEventData(), { shiftKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 4, cell: 1, grid }, event);

    expect(plugin.getSelectedRows().sort((a, b) => a - b)).toEqual([2, 3, 4]);
    expect(grid.setActiveCell).toHaveBeenCalledWith(4, 1);
  });

  it('extends a cell range to the clicked cell with Shift-click', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    vi.mocked(grid.getActiveCell).mockReturnValue({ row: 2, cell: 1 });
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 4, cell: 2 });
    const event = Object.assign(new SlickEventData(), { shiftKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 4, cell: 2, grid }, event);

    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(2, 1, 4, 2)]);
    expect(grid.setActiveCell).toHaveBeenCalledWith(4, 2, false, false, true);
  });

  it('splits a selected cell range when Ctrl-clicking a cell inside it', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell', enableMultiSelection: true });
    plugin.init(grid);
    plugin.setSelectedRanges([new SlickRange(1, 0, 3, 2)]);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    const event = Object.assign(new SlickEventData(), { ctrlKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 2, cell: 1, grid }, event);

    expect(plugin.getSelectedRanges()).toEqual([
      new SlickRange(1, 0, 1, 2),
      new SlickRange(3, 0, 3, 2),
      new SlickRange(2, 0, 2, 0),
      new SlickRange(2, 2, 2, 2),
    ]);
  });

  it('adds a separate range when Ctrl-clicking outside existing cell selections', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell', enableMultiSelection: true });
    plugin.init(grid);
    const existingRange = new SlickRange(0, 0, 0, 1);
    plugin.setSelectedRanges([existingRange]);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    const event = Object.assign(new SlickEventData(), { ctrlKey: true, stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 2, cell: 1, grid }, event);

    expect(plugin.getSelectedRanges()).toEqual([existingRange, new SlickRange(2, 1)]);
  });

  it('selects a range when the range selector completes a cell selection', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const range = new SlickRange(1, 0, 3, 2);

    plugin.getCellRangeSelector()!.onCellRangeSelected.notify({ range, selectionMode: 'SEL', allowAutoEdit: false });

    expect(plugin.getSelectedRanges()).toEqual([range]);
    expect(grid.setActiveCell).toHaveBeenCalledWith(1, 0, false, false, true);
  });

  it('ignores the range selector preview event in cell mode', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell' });
    plugin.init(grid);
    const range = new SlickRange(1, 0, 3, 2);

    const result = plugin.getCellRangeSelector()!.onCellRangeSelecting.notify({ range, selectionMode: '' }).getReturnValue();

    expect(result).toBe(false);
    expect(plugin.getSelectedRanges()).toEqual([]);
  });

  it('selects entire rows when the range selector completes a row selection', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row', dragToSelect: true });
    plugin.init(grid);
    const range = new SlickRange(2, 1, 4, 1);

    plugin.getCellRangeSelector()!.onCellRangeSelected.notify({ range, selectionMode: 'SEL', allowAutoEdit: false });

    expect(plugin.getSelectedRows()).toEqual([2, 3, 4]);
    expect(plugin.getSelectedRanges()).toEqual([new SlickRange(2, 0, 4, columns.length - 1)]);
  });

  it('preserves the selection from before a row drag when adding the dragged range', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row', dragToSelect: true, enableMultiSelection: true });
    plugin.init(grid);
    plugin.setSelectedRows([1]);
    const selector = plugin.getCellRangeSelector()!;

    selector.onBeforeCellRangeSelected.notify({ row: 2, cell: 1 });
    grid.onActiveCellChanged.notify({ cell: 1, row: 2, grid }, new SlickEventData());
    selector.onCellRangeSelected.notify({
      range: new SlickRange(3, 1, 3, 2),
      selectionMode: 'SEL',
      allowAutoEdit: false,
      addToSelection: true,
    });

    expect(plugin.getSelectedRows()).toEqual([1, 3]);
  });

  it('ignores row range selection when the grid does not allow multiple selection', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row', dragToSelect: true });
    plugin.init(grid);
    vi.mocked(grid.getOptions).mockReturnValue({ multiSelect: false });

    const result = plugin.getCellRangeSelector()!.onCellRangeSelected.notify({
      range: new SlickRange(2, 0, 3, 1),
      selectionMode: 'SEL',
      allowAutoEdit: false,
    }).getReturnValue();

    expect(result).toBe(false);
    expect(plugin.getSelectedRanges()).toEqual([]);
  });

  it('prevents range selection while an editor is active', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'cell', dragToSelect: true });
    plugin.init(grid);
    editorLock.isActive.mockReturnValue(true);
    const event = Object.assign(new SlickEventData(), { stopPropagation: vi.fn() });

    const result = plugin.getCellRangeSelector()!.onBeforeCellRangeSelected.notify({ row: 1, cell: 1 }, event).getReturnValue();

    expect(result).toBe(false);
    expect(event.stopPropagation).toHaveBeenCalledOnce();
  });

  it('prevents a row-range drag from starting on the row-move handler column', () => {
    plugin = new SlickHybridSelectionModel({ selectionType: 'row', dragToSelect: true });
    plugin.init(grid);
    vi.mocked(grid.getPluginByName).mockReturnValue({ isHandlerColumn: (cell: number) => cell === 0 } as never);
    const event = Object.assign(new SlickEventData(), { stopPropagation: vi.fn() });

    const result = plugin.getCellRangeSelector()!.onBeforeCellRangeSelected.notify({ row: 1, cell: 0 }, event).getReturnValue();

    expect(result).toBe(false);
    expect(event.stopPropagation).toHaveBeenCalledOnce();
    expect(grid.setActiveCell).not.toHaveBeenCalled();
  });
});
