import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, DragRowMove } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickCrossGridRowMoveManager } from '../slick.crossgridrowmovemanager';

const columns: Column[] = [
  { id: 'move', field: 'move', behavior: 'selectAndMove' },
  { id: 'name', field: 'name' },
];

const sourceEditorLock = { cancelCurrentEdit: vi.fn(), isActive: vi.fn(() => false) };
const sourceCanvas = document.createElement('div');
const targetCanvas = document.createElement('div');
Object.defineProperty(targetCanvas, 'clientWidth', { configurable: true, value: 300 });

class GridMock {}

const createGrid = (canvas: HTMLElement, editorLock: typeof sourceEditorLock) => Object.assign(new GridMock(), {
  getCanvasNode: vi.fn(() => canvas),
  getCellFromEvent: vi.fn(() => ({ row: 2, cell: 0 })),
  getCellNode: vi.fn(() => null),
  getColumns: vi.fn(() => columns),
  getDataItem: vi.fn((row: number) => ({ id: row })),
  getDataLength: vi.fn(() => 12),
  getEditorLock: vi.fn(() => editorLock),
  getOptions: vi.fn(() => ({ multiSelect: true, rowHeight: 25 })),
  getPubSubService: vi.fn(),
  getSelectedRows: vi.fn(() => [4, 2]),
  setSelectedRows: vi.fn(),
  onDrag: new SlickEvent(),
  onDragEnd: new SlickEvent(),
  onDragInit: new SlickEvent(),
  onDragStart: new SlickEvent(),
}) as unknown as SlickGrid;

const targetEditorLock = { cancelCurrentEdit: vi.fn(), isActive: vi.fn(() => false) };
const sourceGrid = createGrid(sourceCanvas, sourceEditorLock);
const targetGrid = createGrid(targetCanvas, targetEditorLock);

const makeEventData = (pageY = 0) => {
  const nativeEvent = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(nativeEvent, 'pageY', { configurable: true, value: pageY });
  return Object.assign(new SlickEventData(nativeEvent), { stopImmediatePropagation: vi.fn() });
};

const makeDragData = (): DragRowMove & { fromGrid: SlickGrid; toGrid: SlickGrid } =>
  ({ canMove: false, selectedRows: [], insertBefore: -1 } as unknown as DragRowMove & { fromGrid: SlickGrid; toGrid: SlickGrid });

describe('SlickCrossGridRowMoveManager', () => {
  let plugin: SlickCrossGridRowMoveManager;

  beforeEach(() => {
    vi.clearAllMocks();
    sourceEditorLock.isActive.mockReturnValue(false);
    targetEditorLock.isActive.mockReturnValue(false);
    vi.mocked(sourceGrid.getCellFromEvent).mockReturnValue({ row: 2, cell: 0 });
    vi.mocked(sourceGrid.getSelectedRows).mockReturnValue([4, 2]);
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid });
  });

  afterEach(() => {
    plugin.destroy();
    sourceCanvas.replaceChildren();
    targetCanvas.replaceChildren();
  });

  it('defines a row-move column using its configured id and width', () => {
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid, columnId: 'transfer', width: 36, cssClass: 'move-icon' });

    expect(plugin.getColumnDefinition()).toEqual(expect.objectContaining({
      id: 'transfer',
      field: 'move',
      behavior: 'selectAndMove',
      width: 36,
      selectable: false,
      resizable: false,
    }));
    expect(plugin.getColumnDefinition().formatter!(1, 0, null, columns[0], {}, sourceGrid)).toEqual({
      addClasses: 'cell-reorder dnd move-icon',
      text: '',
    });
  });

  it('hides the move affordance when the usability override rejects the row', () => {
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid, usabilityOverride: () => false });
    plugin.init(sourceGrid);

    expect(plugin.getColumnDefinition().formatter!(1, 0, null, columns[0], {}, sourceGrid)).toBe('');
  });

  it('stops propagation on drag initialization', () => {
    plugin.init(sourceGrid);
    const event = makeEventData();

    sourceGrid.onDragInit.notify(makeDragData(), event);

    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  });

  it('rejects a drag that did not start on the row-move column', () => {
    vi.mocked(sourceGrid.getCellFromEvent).mockReturnValue({ row: 2, cell: 1 });
    plugin.init(sourceGrid);
    const dd = makeDragData();

    const result = sourceGrid.onDragStart.notify(dd, makeEventData()).getReturnValue();

    expect(result).toBe(false);
    expect(dd.selectionProxy).toBeUndefined();
  });

  it('starts a drag using the source grid selection and creates proxy elements in the target canvas', () => {
    plugin.init(sourceGrid);
    const dd = makeDragData();
    const event = makeEventData();

    sourceGrid.onDragStart.notify(dd, event);

    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
    expect(dd.fromGrid).toBe(sourceGrid);
    expect(dd.toGrid).toBe(targetGrid);
    expect(dd.selectedRows).toEqual([2, 4]);
    expect(dd.selectionProxy?.parentElement).toBe(targetCanvas);
    expect(dd.selectionProxy?.style.width).toBe('300px');
    expect(dd.selectionProxy?.style.height).toBe('50px');
    expect(dd.guide?.parentElement).toBe(targetCanvas);
  });

  it('selects the dragged source row when it is not part of the current selection', () => {
    vi.mocked(sourceGrid.getSelectedRows).mockReturnValue([1]);
    plugin.init(sourceGrid);

    sourceGrid.onDragStart.notify(makeDragData(), makeEventData());

    expect(sourceGrid.setSelectedRows).toHaveBeenCalledWith([2]);
  });

  it('honors singleRowMove and disableRowSelection options', () => {
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid, singleRowMove: true, disableRowSelection: true });
    plugin.init(sourceGrid);
    const dd = makeDragData();

    sourceGrid.onDragStart.notify(dd, makeEventData());

    expect(dd.selectedRows).toEqual([2]);
    expect(sourceGrid.setSelectedRows).not.toHaveBeenCalled();
    expect(dd.selectionProxy?.style.height).toBe('25px');
  });

  it('cancels an active source-grid edit when configured', () => {
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid, cancelEditOnDrag: true });
    plugin.init(sourceGrid);
    sourceEditorLock.isActive.mockReturnValue(true);
    const event = makeEventData();
    const result = sourceGrid.onDragStart.notify(makeDragData(), event).getReturnValue();

    expect(sourceEditorLock.cancelCurrentEdit).toHaveBeenCalledOnce();
    expect(result).toBe(false);
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });

  it('uses target grid geometry and emits before-move data with both grids', () => {
    plugin.init(sourceGrid);
    const dd = makeDragData();
    sourceGrid.onDragStart.notify(dd, makeEventData());
    const beforeMove = vi.fn();
    plugin.onBeforeMoveRows.subscribe((_event: SlickEventData, args: { fromGrid: SlickGrid; toGrid: SlickGrid; rows: number[]; insertBefore: number }) => beforeMove(args));

    sourceGrid.onDrag.notify(dd, makeEventData(62));

    expect(dd.insertBefore).toBe(2);
    expect(dd.canMove).toBe(true);
    expect(dd.selectionProxy?.style.top).toBe('57px');
    expect(dd.guide?.style.top).toBe('50px');
    expect(beforeMove).toHaveBeenCalledWith({ fromGrid: sourceGrid, toGrid: targetGrid, rows: [2, 4], insertBefore: 2 });
  });

  it('rejects a destination when the before-move listener returns false', () => {
    plugin.init(sourceGrid);
    const dd = makeDragData();
    sourceGrid.onDragStart.notify(dd, makeEventData());
    plugin.onBeforeMoveRows.subscribe(() => false);

    sourceGrid.onDrag.notify(dd, makeEventData(62));

    expect(dd.canMove).toBe(false);
    expect(dd.guide?.style.top).toBe('-1000px');
  });

  it('checks the usability override against the destination row and grid', () => {
    const override = vi.fn(() => true);
    plugin = new SlickCrossGridRowMoveManager({ toGrid: targetGrid, usabilityOverride: override });
    plugin.init(sourceGrid);
    const dd = makeDragData();
    sourceGrid.onDragStart.notify(dd, makeEventData());

    sourceGrid.onDrag.notify(dd, makeEventData(62));

    expect(override).toHaveBeenLastCalledWith(2, { id: 2 }, targetGrid);
    expect(dd.canMove).toBe(true);
  });

  it('publishes the cross-grid move and removes target drag elements on drag end', () => {
    plugin.init(sourceGrid);
    const dd = makeDragData();
    sourceGrid.onDragStart.notify(dd, makeEventData());
    dd.canMove = true;
    dd.insertBefore = 5;
    const moved = vi.fn();
    plugin.onMoveRows.subscribe((_event: SlickEventData, args: { fromGrid: SlickGrid; toGrid: SlickGrid; rows: number[]; insertBefore: number }) => moved(args));
    const event = makeEventData();

    sourceGrid.onDragEnd.notify(dd, event);

    expect(moved).toHaveBeenCalledWith({ fromGrid: sourceGrid, toGrid: targetGrid, rows: [2, 4], insertBefore: 5 });
    expect(dd.selectionProxy?.isConnected).toBe(false);
    expect(dd.guide?.isConnected).toBe(false);
    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
  });

  it('does not publish a move when the destination is rejected', () => {
    plugin.init(sourceGrid);
    const dd = makeDragData();
    sourceGrid.onDragStart.notify(dd, makeEventData());
    dd.canMove = false;
    const moved = vi.fn();
    plugin.onMoveRows.subscribe((_event: SlickEventData, args: { fromGrid: SlickGrid; toGrid: SlickGrid; rows: number[]; insertBefore: number }) => moved(args));

    sourceGrid.onDragEnd.notify(dd, makeEventData());

    expect(moved).not.toHaveBeenCalled();
  });

  it('unsubscribes from source grid events when destroyed', () => {
    plugin.init(sourceGrid);
    plugin.destroy();
    const event = makeEventData();

    sourceGrid.onDragInit.notify(makeDragData(), event);

    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
  });
});
