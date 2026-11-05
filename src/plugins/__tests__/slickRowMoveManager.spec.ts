import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, DragRowMove, RowMoveManagerOption } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickRowMoveManager } from '../slick.rowmovemanager';

const columns: Column[] = [
  { id: 'move', field: 'move', behavior: 'selectAndMove' },
  { id: 'name', field: 'name' },
];

const editorLock = {
  cancelCurrentEdit: vi.fn(),
  isActive: vi.fn(() => false),
};

const canvas = document.createElement('div');
const row = document.createElement('div');
row.className = 'slick-row';
const cell = document.createElement('div');
row.appendChild(cell);
canvas.appendChild(row);

const grid = {
  getCanvasNode: vi.fn(() => canvas),
  getCellFromEvent: vi.fn(() => ({ row: 2, cell: 0 })),
  getCellNode: vi.fn(() => cell),
  getColumns: vi.fn(() => columns),
  getDataItem: vi.fn(() => ({ id: 2 })),
  getDataLength: vi.fn(() => 10),
  getEditorLock: vi.fn(() => editorLock),
  getOptions: vi.fn(() => ({ multiSelect: true, rowHeight: 25 })),
  getPubSubService: vi.fn(),
  getSelectedRows: vi.fn(() => [2]),
  setSelectedRows: vi.fn(),
  onDrag: new SlickEvent(),
  onDragEnd: new SlickEvent(),
  onDragInit: new SlickEvent(),
  onDragStart: new SlickEvent(),
} as unknown as SlickGrid;

const makeEventData = (nativeEvent = new MouseEvent('mousemove', { bubbles: true })) =>
  Object.assign(new SlickEventData(nativeEvent), {
    stopImmediatePropagation: vi.fn(),
  });

const makeDragData = (): DragRowMove => ({ canMove: false, selectedRows: [], insertBefore: -1 } as unknown as DragRowMove);

describe('SlickRowMoveManager', () => {
  let plugin: SlickRowMoveManager;

  beforeEach(() => {
    vi.clearAllMocks();
    editorLock.isActive.mockReturnValue(false);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 0 });
    vi.mocked(grid.getSelectedRows).mockReturnValue([2]);
    vi.mocked(grid.getColumns).mockReturnValue(columns);
    plugin = new SlickRowMoveManager({});
  });

  afterEach(() => {
    plugin.destroy();
    canvas.replaceChildren(row);
    row.replaceChildren(cell);
  });

  it('provides default options through its generated column definition', () => {
    const definition = plugin.getColumnDefinition();

    expect(definition).toEqual(expect.objectContaining({
      id: '_move',
      field: 'move',
      behavior: 'selectAndMove',
      width: 40,
      reorderable: false,
      selectable: false,
      resizable: false,
      formatter: expect.any(Function),
    }));
  });

  it('merges custom options into the generated column definition', () => {
    plugin = new SlickRowMoveManager({ columnId: 'row-drag', width: 32, reorderable: true, cssClass: 'drag-icon' });

    expect(plugin.getColumnDefinition()).toEqual(expect.objectContaining({
      id: 'row-drag',
      width: 32,
      reorderable: true,
    }));
    expect(plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], {}, grid)).toEqual({
      addClasses: 'cell-reorder dnd ',
      html: expect.objectContaining({ className: 'drag-icon' }),
    });
  });

  it('hides the move icon when the usability override rejects the row', () => {
    plugin = new SlickRowMoveManager({ usabilityOverride: () => false });
    plugin.init(grid);

    expect(plugin.getColumnDefinition().formatter!(2, 0, null, columns[0], { id: 2 }, grid)).toBe('');
  });

  it('changes options and supports setting a usability override after construction', () => {
    plugin.setOptions({ columnId: 'reorder', width: 48 });
    plugin.usabilityOverride(() => false);

    expect(plugin.getColumnDefinition().id).toBe('reorder');
    expect(plugin.getColumnDefinition().width).toBe(48);
    expect(plugin.getColumnDefinition().formatter!(2, 0, null, columns[0], {}, grid)).toBe('');
  });

  it('identifies the row move handler column by its behavior', () => {
    plugin.init(grid);

    expect(plugin.isHandlerColumn(0)).toBe(true);
    expect(plugin.isHandlerColumn(1)).toBe(false);
  });

  it('stops propagation at drag initialization', () => {
    plugin.init(grid);
    const event = makeEventData();

    grid.onDragInit.notify(makeDragData(), event);

    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  });

  it('ignores drag start when the pointer is not on the handler column', () => {
    plugin.init(grid);
    vi.mocked(grid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    const event = makeEventData();
    const dd = makeDragData();

    const result = grid.onDragStart.notify(dd, event).getReturnValue();

    expect(result).toBe(false);
    expect(dd.selectionProxy).toBeUndefined();
  });

  it('selects the dragged row and creates the proxy and guide on drag start', () => {
    plugin.init(grid);
    const event = makeEventData();
    const dd = makeDragData();

    grid.onDragStart.notify(dd, event);

    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
    expect(grid.setSelectedRows).not.toHaveBeenCalled();
    expect(dd.selectedRows).toEqual([2]);
    expect(dd.selectionProxy?.className).toBe('slick-reorder-proxy');
    expect(dd.guide?.className).toBe('slick-reorder-guide');
  });

  it('selects the dragged row when it is not already selected', () => {
    vi.mocked(grid.getSelectedRows).mockReturnValue([1]);
    plugin.init(grid);

    grid.onDragStart.notify(makeDragData(), makeEventData());

    expect(grid.setSelectedRows).toHaveBeenCalledWith([2]);
  });

  it('cancels the current edit when cancelEditOnDrag is enabled', () => {
    plugin = new SlickRowMoveManager({ cancelEditOnDrag: true });
    plugin.init(grid);
    editorLock.isActive.mockReturnValue(true);
    const event = makeEventData();
    const result = grid.onDragStart.notify(makeDragData(), event).getReturnValue();

    expect(editorLock.cancelCurrentEdit).toHaveBeenCalledOnce();
    expect(result).toBe(false);
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });

  it('moves the selection proxy and positions the guide during dragging', () => {
    plugin.init(grid);
    const startData = makeDragData();
    grid.onDragStart.notify(startData, makeEventData());
    const event = makeEventData();
    Object.defineProperty(event.getNativeEvent<MouseEvent>(), 'pageY', { configurable: true, value: 62 });
    const beforeMove = vi.fn();
    plugin.onBeforeMoveRows.subscribe((_e: SlickEventData, args: { grid: SlickGrid; rows: number[]; insertBefore: number }) => beforeMove(args));

    grid.onDrag.notify(startData, event);

    expect(startData.selectionProxy?.style.top).toBe('57px');
    expect(startData.selectionProxy?.style.display).toBe('block');
    expect(startData.insertBefore).toBe(2);
    expect(startData.canMove).toBe(true);
    expect(startData.guide?.style.top).toBe('50px');
    expect(beforeMove).toHaveBeenCalledWith({ grid, rows: [2], insertBefore: 2 });
  });

  it('hides the guide when the before-move event rejects the move', () => {
    plugin.init(grid);
    const startData = makeDragData();
    grid.onDragStart.notify(startData, makeEventData());
    plugin.onBeforeMoveRows.subscribe(() => false);
    const event = makeEventData();
    Object.defineProperty(event.getNativeEvent<MouseEvent>(), 'pageY', { configurable: true, value: 62 });

    grid.onDrag.notify(startData, event);

    expect(startData.canMove).toBe(false);
    expect(startData.guide?.style.top).toBe('-1000px');
  });

  it('cleans up drag elements and publishes the completed move', () => {
    plugin.init(grid);
    const startData = makeDragData();
    grid.onDragStart.notify(startData, makeEventData());
    startData.canMove = true;
    startData.insertBefore = 4;
    const moved = vi.fn();
    plugin.onMoveRows.subscribe((_e: SlickEventData, args: { grid: SlickGrid; rows: number[]; insertBefore: number }) => moved(args));
    const event = makeEventData();

    grid.onDragEnd.notify(startData, event);

    expect(moved).toHaveBeenCalledWith({ grid, rows: [2], insertBefore: 4 });
    expect(startData.selectionProxy?.isConnected).toBe(false);
    expect(startData.guide?.isConnected).toBe(false);
    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  });

  it('does not publish a move when the drag was rejected', () => {
    plugin.init(grid);
    const startData = makeDragData();
    grid.onDragStart.notify(startData, makeEventData());
    startData.canMove = false;
    const moved = vi.fn();
    plugin.onMoveRows.subscribe((_e: SlickEventData, args: { grid: SlickGrid; rows: number[]; insertBefore: number }) => moved(args));

    grid.onDragEnd.notify(startData, makeEventData());

    expect(moved).not.toHaveBeenCalled();
  });

  it('unsubscribes from grid drag events when destroyed', () => {
    plugin.init(grid);
    plugin.destroy();
    const event = makeEventData();

    grid.onDragInit.notify(makeDragData(), event);

    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });
});
