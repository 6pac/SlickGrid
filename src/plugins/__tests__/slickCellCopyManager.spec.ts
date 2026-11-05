import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent, SlickEventData, SlickRange } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { SlickCellCopyManager } from '../slick.cellcopymanager';

const selectionModel = {
  getSelectedRanges: vi.fn((): SlickRange[] => []),
};

const editorLock = {
  isActive: vi.fn(() => false),
};

const gridStub = {
  getColumns: vi.fn(() => [{ id: 'firstName' }, { id: 'lastName' }, { id: 'age' }]),
  getEditorLock: () => editorLock,
  getOptions: vi.fn(() => ({})),
  getPubSubService: vi.fn(),
  getSelectionModel: () => selectionModel,
  removeCellCssStyles: vi.fn(),
  setCellCssStyles: vi.fn(),
  onKeyDown: new SlickEvent(),
} as unknown as SlickGrid;

function notifyKeyDown(which: number, modifiers: { ctrlKey?: boolean; metaKey?: boolean } = {}) {
  const eventData = Object.assign(new SlickEventData(), { which, ...modifiers });
  gridStub.onKeyDown.notify({} as any, eventData);
  return eventData;
}

describe('SlickCellCopyManager', () => {
  let plugin: SlickCellCopyManager;

  beforeEach(() => {
    (gridStub as any).onKeyDown = new SlickEvent();
    selectionModel.getSelectedRanges.mockReset();
    editorLock.isActive.mockReset();
    editorLock.isActive.mockReturnValue(false);
    plugin = new SlickCellCopyManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates and initializes the plugin', () => {
    plugin.init(gridStub);

    expect(plugin.pluginName).toBe('CellCopyManager');
    expect(gridStub.getPubSubService).toHaveBeenCalled();
  });

  it('unsubscribes from key events when destroyed', () => {
    const unsubscribeSpy = vi.spyOn(gridStub.onKeyDown, 'unsubscribe');
    plugin.init(gridStub);

    plugin.destroy();

    expect(unsubscribeSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('marks selected cells and emits onCopyCells for Ctrl+C', () => {
    const ranges = [new SlickRange(1, 0, 2, 1)];
    selectionModel.getSelectedRanges.mockReturnValue(ranges);
    const copySpy = vi.fn();
    plugin.onCopyCells.subscribe(copySpy);
    plugin.init(gridStub);

    const eventData = notifyKeyDown(67, { ctrlKey: true });

    expect(eventData.defaultPrevented).toBe(true);
    expect(gridStub.setCellCssStyles).toHaveBeenCalledWith('copy-manager', {
      1: { firstName: 'copied', lastName: 'copied' },
      2: { firstName: 'copied', lastName: 'copied' },
    });
    expect(copySpy).toHaveBeenCalledWith(expect.any(SlickEventData), { ranges });
  });

  it('does not copy when there is no selected range', () => {
    const copySpy = vi.fn();
    plugin.onCopyCells.subscribe(copySpy);
    plugin.init(gridStub);

    const eventData = notifyKeyDown(67, { ctrlKey: true });

    expect(eventData.defaultPrevented).toBe(false);
    expect(gridStub.setCellCssStyles).not.toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
  });

  it('emits onPasteCells and clears the copy styling on Ctrl+V by default', () => {
    const copiedRanges = [new SlickRange(0, 0, 1, 1)];
    const pastedRanges = [new SlickRange(2, 1, 2, 2)];
    selectionModel.getSelectedRanges.mockReturnValue(copiedRanges);
    const pasteSpy = vi.fn();
    plugin.onPasteCells.subscribe(pasteSpy);
    plugin.init(gridStub);
    notifyKeyDown(67, { ctrlKey: true });
    selectionModel.getSelectedRanges.mockReturnValue(pastedRanges);

    const eventData = notifyKeyDown(86, { ctrlKey: true });

    expect(eventData.defaultPrevented).toBe(true);
    expect(pasteSpy).toHaveBeenCalledWith(expect.any(SlickEventData), { from: copiedRanges, to: pastedRanges });
    expect(gridStub.removeCellCssStyles).toHaveBeenCalledWith('copy-manager');
  });

  it('preserves the copy styling after paste when configured', () => {
    const copiedRanges = [new SlickRange(0, 0, 0, 0)];
    selectionModel.getSelectedRanges.mockReturnValue(copiedRanges);
    vi.spyOn(gridStub, 'getOptions').mockReturnValue({ preserveCopiedSelectionOnPaste: true });
    plugin.init(gridStub);
    notifyKeyDown(67, { metaKey: true });

    notifyKeyDown(86, { metaKey: true });

    expect(gridStub.removeCellCssStyles).not.toHaveBeenCalled();
  });

  it('clears and emits onCopyCancelled for Escape after copying', () => {
    const ranges = [new SlickRange(0, 1, 0, 2)];
    selectionModel.getSelectedRanges.mockReturnValue(ranges);
    const cancelSpy = vi.fn();
    plugin.onCopyCancelled.subscribe(cancelSpy);
    plugin.init(gridStub);
    notifyKeyDown(67, { ctrlKey: true });

    const eventData = notifyKeyDown(27);

    expect(eventData.defaultPrevented).toBe(true);
    expect(gridStub.removeCellCssStyles).toHaveBeenCalledWith('copy-manager');
    expect(cancelSpy).toHaveBeenCalledWith(expect.any(SlickEventData), { ranges });
  });

  it('ignores copy, paste, and cancel keys while an edit is active', () => {
    selectionModel.getSelectedRanges.mockReturnValue([new SlickRange(0, 0)]);
    editorLock.isActive.mockReturnValue(true);
    plugin.init(gridStub);

    notifyKeyDown(67, { ctrlKey: true });
    notifyKeyDown(86, { ctrlKey: true });
    notifyKeyDown(27);

    expect(gridStub.setCellCssStyles).not.toHaveBeenCalled();
    expect(gridStub.removeCellCssStyles).not.toHaveBeenCalled();
  });
});
