import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BasePubSub, SlickEvent, SlickRange } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { SlickCellRangeSelector } from '../slick.cellrangeselector';
import { SlickCellSelectionModel } from '../slick.cellselectionmodel';
import { GridOption } from '../../models';

const GRID_UID = 'slickgrid_12345';
const NB_ITEMS = 200;
const CALCULATED_PAGE_ROW_COUNT = 23; // pageRowCount with our mocked sizes is 23 => ((600 - 17) / 25)

const addVanillaEventPropagation = function <T = any>(event: T, commandKeys: string[] = [], keyName = '') {
  Object.defineProperty(event, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  Object.defineProperty(event, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  if (commandKeys.length) {
    for (const commandKey of commandKeys) {
      Object.defineProperty(event, commandKey, { writable: true, configurable: true, value: true });
    }
  }
  if (keyName) {
    Object.defineProperty(event, 'key', { writable: true, configurable: true, value: keyName });
  }
  return event;
};

const expectSelectionCall = (spy: { mock: { calls: unknown[][] } }, ranges: unknown[]) => {
  const normalize = (value: any[]) => value.map((range) => ({
      fromCell: range.fromCell,
      fromRow: range.fromRow,
      toCell: range.toCell,
      toRow: range.toRow,
    }));
  expect(normalize(spy.mock.calls.at(-1)?.[0] as any[]).slice(-ranges.length)).toEqual(normalize(ranges));
};

const mockGridOptions = {
  frozenColumn: 1,
  frozenRow: -1,
  rowHeight: 25,
} as GridOption;

const getEditorLockMock = {
  commitCurrentEdit: vi.fn(),
  isActive: vi.fn(),
};

const dataViewStub = {
  getLength: () => NB_ITEMS,
  getPagingInfo: () => ({ pageSize: 0 }),
};

const mockColumns = [
  { id: 'firstName', field: 'firstName' },
  { id: 'lastName', field: 'lastName' },
  { id: 'age', field: 'age' },
];

const pubSubServiceStub = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  unsubscribeAll: vi.fn(),
} as BasePubSub;

const gridStub = {
  canCellBeSelected: vi.fn(() => true),
  getActiveCell: vi.fn(),
  getActiveCanvasNode: vi.fn(),
  getCanvasNode: vi.fn(),
  getCellFromEvent: vi.fn(),
  getCellFromPoint: vi.fn(),
  getCellNodeBox: vi.fn(),
  getPubSubService: () => pubSubServiceStub,
  getColumns: () => mockColumns,
  getData: () => dataViewStub,
  getDataLength: vi.fn(() => NB_ITEMS),
  getEditorLock: () => getEditorLockMock,
  getOptions: () => mockGridOptions,
  getUID: () => GRID_UID,
  getViewportRowCount: () => 23,
  getScrollbarDimensions: () => ({ height: 17, width: 17 }),
  getViewportNode: vi.fn(),
  hasDataView: () => true,
  focus: vi.fn(),
  registerPlugin: vi.fn(),
  setActiveCell: vi.fn(),
  scrollCellIntoView: vi.fn(),
  scrollRowIntoView: vi.fn(),
  unregisterPlugin: vi.fn(),
  onActiveCellChanged: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onCellRangeSelected: new SlickEvent(),
  onBeforeCellRangeSelected: new SlickEvent(),
} as unknown as SlickGrid;

describe('CellSelectionModel Plugin', () => {
  let plugin: SlickCellSelectionModel;
  const selector = () => (plugin as unknown as { _selector: SlickCellRangeSelector })._selector;
  const gridContainerElm = document.createElement('div');
  gridContainerElm.className = GRID_UID;
  const viewportElm = document.createElement('div');
  viewportElm.className = 'slick-viewport';
  const canvasTL = document.createElement('div');
  canvasTL.className = 'grid-canvas grid-canvas-top grid-canvas-left';
  const canvasTR = document.createElement('div');
  canvasTR.className = 'grid-canvas grid-canvas-top grid-canvas-right';
  const canvasBL = document.createElement('div');
  canvasBL.className = 'grid-canvas grid-canvas-bottom grid-canvas-left';
  const canvasBR = document.createElement('div');
  canvasBR.className = 'grid-canvas grid-canvas-bottom grid-canvas-right';
  viewportElm.appendChild(canvasTL);
  viewportElm.appendChild(canvasTR);
  viewportElm.appendChild(canvasBL);
  viewportElm.appendChild(canvasBR);
  gridContainerElm.appendChild(viewportElm);
  document.body.appendChild(gridContainerElm);
  Object.defineProperty(canvasTL, 'clientHeight', { writable: true, configurable: true, value: 12 });
  Object.defineProperty(canvasTR, 'clientHeight', { writable: true, configurable: true, value: 14 });
  Object.defineProperty(canvasTL, 'clientWidth', { writable: true, configurable: true, value: 32 });
  Object.defineProperty(canvasTR, 'clientWidth', { writable: true, configurable: true, value: 33 });
  vi.spyOn(gridStub, 'getCanvasNode').mockReturnValue(canvasTL);

  beforeEach(() => {
    for (const event of [gridStub.onActiveCellChanged, gridStub.onKeyDown]) {
      (event as unknown as { _handlers: unknown[] })._handlers.length = 0;
    }
    plugin = new SlickCellSelectionModel();
    vi.spyOn(gridStub, 'getViewportNode').mockReturnValue(viewportElm);
    Object.defineProperty(viewportElm, 'clientHeight', { writable: true, configurable: true, value: 600 });
  });

  afterEach(() => {
    vi.clearAllMocks();
    if ((plugin as unknown as { _grid?: SlickGrid })._grid) {
      plugin.destroy();
    }
  });

  it('should create the plugin', () => {
    expect(plugin).toBeTruthy();
    expect(selector()).toBeTruthy();
  });

  it('should unregister and destroy its selector when calling destroy', () => {
    plugin.init(gridStub);
    const unregisterSpy = vi.spyOn(gridStub, 'unregisterPlugin');
    const selectorDestroySpy = vi.spyOn(selector(), 'destroy');
    plugin.destroy();
    expect(unregisterSpy).toHaveBeenCalledWith(selector());
    expect(selectorDestroySpy).toHaveBeenCalled();
  });

  it('should create the plugin and initialize it', () => {
    const registerSpy = vi.spyOn(gridStub, 'registerPlugin');

    plugin.init(gridStub);

    expect(selector()).toBeTruthy();
    expect(plugin.getOptions()).toEqual({ selectActiveCell: true });
    expect(registerSpy).toHaveBeenCalledWith(selector());
  });

  it('should create the plugin and initialize it with just "selectActiveCell" option and still expect the same result', () => {
    const registerSpy = vi.spyOn(gridStub, 'registerPlugin');

    plugin.setOptions({ selectActiveCell: false });
    plugin.init(gridStub);

    expect(selector()).toBeTruthy();
    expect(plugin.getOptions()).toEqual({ selectActiveCell: false });
    expect(registerSpy).toHaveBeenCalledWith(selector());
  });

  it('should create the plugin and initialize it with just "selectActiveCell" option and still expect the same result', () => {
    const registerSpy = vi.spyOn(gridStub, 'registerPlugin');

    const mockCellRangeSelector = new SlickCellRangeSelector({ selectionCss: { border: '2px solid black' } as CSSStyleDeclaration });
    (plugin as unknown as { _selector: SlickCellRangeSelector })._selector = mockCellRangeSelector;
    plugin.setOptions({ selectActiveCell: true });
    plugin.init(gridStub);

    expect(selector()).toBeTruthy();
    expect(plugin.getOptions()).toEqual({ selectActiveCell: true });
    expect(registerSpy).toHaveBeenCalledWith(selector());
  });

  it('should expect that "setSelectedRanges" is being triggered when "refreshSelections" is called', () => {
    const registerSpy = vi.spyOn(gridStub, 'registerPlugin');

    plugin.setOptions({ selectActiveCell: false });
    plugin.init(gridStub);

    vi.spyOn(plugin, 'getSelectedRanges').mockReturnValue([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectedRangesSpy = vi.spyOn(plugin, 'setSelectedRanges');
    plugin.refreshSelections();

    expect(selector()).toBeTruthy();
    expect(registerSpy).toHaveBeenCalledWith(selector());
    expectSelectionCall(setSelectedRangesSpy, [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ]);
  });

  it('should return False when onBeforeCellRangeSelected is called, getEditorLock returns False and the current cell is the active cell (within editor)', () => {
    const mouseEvent = addVanillaEventPropagation(new MouseEvent('mouseenter'));
    vi.spyOn(gridStub.getEditorLock(), 'isActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    const stopPropSpy = vi.spyOn(mouseEvent, 'stopPropagation');

    plugin.init(gridStub);
    const output = selector().onBeforeCellRangeSelected.notify({ cell: 2, row: 3 }, mouseEvent, gridStub).getReturnValue();

    expect(output).toBeFalsy();
    expect(stopPropSpy).toHaveBeenCalled();
  });

  it('should call "setSelectedRanges" when "onCellRangeSelected"', () => {
    const mouseEvent = addVanillaEventPropagation(new MouseEvent('mouseenter'));
    vi.spyOn(gridStub.getEditorLock(), 'isActive').mockReturnValue(true);
    const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');

    plugin.init(gridStub);
    selector().onCellRangeSelected.notify(
      { range: { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true } as unknown as SlickRange, allowAutoEdit: false, selectionMode: 'SEL' },
      mouseEvent,
      gridStub
    );

    expect(setActiveCellSpy).toHaveBeenCalledWith(2, 1, false, false, true);
    expectSelectionCall(setSelectRangeSpy, [{ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true }]);
  });

  it('should call "setSelectedRanges" with Slick Ranges when triggered by "onActiveCellChanged" and "selectActiveCell" is True', () => {
    plugin.setOptions({ selectActiveCell: true });
    plugin.init(gridStub);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const mouseEvent = addVanillaEventPropagation(new MouseEvent('mouseenter'));
    gridStub.onActiveCellChanged.notify({ cell: 2, row: 3, grid: gridStub }, mouseEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, [
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3,
      },
    ]);
  });

  it('should call "setSelectedRanges" with empty array when triggered by "onActiveCellChanged" and "selectActiveCell" is False', () => {
    plugin.setOptions({ selectActiveCell: false });
    plugin.init(gridStub);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const mouseEvent = addVanillaEventPropagation(new MouseEvent('mouseenter'));
    gridStub.onActiveCellChanged.notify({ cell: 2, row: 3, grid: gridStub }, mouseEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, []);
  });

  it('should call "setSelectedRanges" with Slick Range with a Left direction when triggered by "onKeyDown" with key combo of Shift+ArrowLeft', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    const mockRanges = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'ArrowLeft');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, [
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 4,
      },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range with a Right direction when triggered by "onKeyDown" with key combo of Shift+ArrowRight', () => {
    // let's test this one without a DataView (aka SlickGrid only)
    vi.spyOn(gridStub, 'hasDataView').mockReturnValueOnce(false);
    vi.spyOn(gridStub, 'getDataLength').mockReturnValueOnce(NB_ITEMS);
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'ArrowRight');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, [
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 4,
        toRow: 4,
      },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range with an Up direction when triggered by "onKeyDown" with key combo of Shift+ArrowUp', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'ArrowUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, [
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 3,
        toRow: 3,
      },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range with a Down direction when triggered by "onKeyDown" with key combo of Shift+ArrowDown', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'ArrowDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expectSelectionCall(setSelectRangeSpy, [
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 3,
        toRow: 5,
      },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range and expect with "canCellBeSelected" returning True', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollRowSpy = vi.spyOn(gridStub, 'scrollRowIntoView');
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    const onSelectedRangeSpy = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'ArrowDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 5, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(5, 3);
    expect(scrollRowSpy).toHaveBeenCalledWith(5);
    const notification = onSelectedRangeSpy.mock.lastCall?.[1] as { event?: CustomEvent };
    expect(notification.event?.detail.caller).toBe('SlickCellSelectionModel.setSelectedRanges');
  });

  it('should call "setSelectedRanges" with Slick Range from current position to a calculated size of a page down when using Shift+PageDown key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 3;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.resetPageRowCount();
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'PageDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: notifyingRowNumber + CALCULATED_PAGE_ROW_COUNT, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(notifyingRowNumber + CALCULATED_PAGE_ROW_COUNT, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to the last row index when using Shift+PageDown key combo but there is less rows than an actual page left to display', () => {
    const notifyingRowNumber = NB_ITEMS - 10; // will be less than a page size (row count)
    const lastRowIndex = NB_ITEMS - 1;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'PageDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: lastRowIndex, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(lastRowIndex, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to a calculated size of a page up when using Shift+PageUp key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const CALCULATED_PAGE_ROW_COUNT = 23;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'PageUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: notifyingRowNumber - CALCULATED_PAGE_ROW_COUNT, toCell: 3, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(notifyingRowNumber - CALCULATED_PAGE_ROW_COUNT, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to the first row index when using Shift+PageUp key combo but there is less rows than an actual page left to display', () => {
    const notifyingRowNumber = 10; // will be less than a page size (row count)
    const firstRowIndex = 0;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'PageUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: firstRowIndex, toCell: 3, toRow: notifyingRowNumber, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(firstRowIndex, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to row index 0 horizontally when using Shift+Home key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const expectedRowZeroIdx = 0;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'Home');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: expectedRowZeroIdx, fromRow: notifyingRowNumber, toCell: 2, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(100, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to row index 0 horizontally when using Shift+Ctrl+ArrowLeft key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const expectedRowZeroIdx = 0;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'ArrowLeft');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: expectedRowZeroIdx, fromRow: notifyingRowNumber, toCell: 2, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(100, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to same row last cell index horizontally when using Shift+End key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const columnsLn = mockColumns.length;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['shiftKey'], 'End');
    gridStub.onKeyDown.notify({ cell: 1, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: columnsLn - 1, fromRow: notifyingRowNumber, toCell: 2, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(100, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to same row last cell index horizontally when using Shift+Ctrl+ArrowRight key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const columnsLn = mockColumns.length;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'ArrowRight');
    gridStub.onKeyDown.notify({ cell: 1, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: columnsLn - 1, fromRow: notifyingRowNumber, toCell: 2, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(100, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to grid top on same column when using Ctrl+Shift+ArrowUp key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'ArrowUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: 0, toCell: 3, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(100, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to grid bottom on same column when using Ctrl+Shift+ArrowDown key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'ArrowDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: 100, toCell: 3, toRow: NB_ITEMS - 1, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(NB_ITEMS - 1, 3);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to cell,row index 0 when using Ctrl+Shift+Home key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const expectedRowZeroIdx = 0;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'Home');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 0, fromRow: expectedRowZeroIdx, toCell: 2, toRow: 100, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(expectedRowZeroIdx, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to last row index when using Ctrl+Shift+End key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const expectedLastRowIdx = NB_ITEMS - 1;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey', 'shiftKey'], 'End');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: expect.any(Function) } as unknown as SlickRange,
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 2, toRow: expectedLastRowIdx, contains: () => true },
    ];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).toHaveBeenCalledWith(expectedLastRowIdx, 2);
  });

  it('should call "setSelectedRanges" with Slick Range from current position to row index 0 horizontally when using Ctrl+A key combo when triggered by "onKeyDown"', () => {
    const notifyingRowNumber = 100;
    const expectedRowZeroIdx = 0;
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: notifyingRowNumber });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const scrollCellSpy = vi.spyOn(gridStub, 'scrollCellIntoView');

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 99, toCell: 3, toRow: 120, contains: () => true },
      { fromCell: 2, fromRow: notifyingRowNumber, toCell: 3, toRow: 120, contains: () => true },
    ] as unknown as SlickRange[]);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new KeyboardEvent('keydown'), ['ctrlKey'], 'a');
    gridStub.onKeyDown.notify({ cell: 2, row: 101, grid: gridStub }, keyDownEvent, gridStub);

    const expectedRangeCalled = [{ fromCell: expectedRowZeroIdx, fromRow: expectedRowZeroIdx, toCell: 2, toRow: NB_ITEMS - 1 }];
    expectSelectionCall(setSelectRangeSpy, expectedRangeCalled);
    expect(scrollCellSpy).not.toHaveBeenCalled();
  });

  it('should call "rangesAreEqual" and expect True when both ranges are equal', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });

    plugin.init(gridStub);
    const output = (plugin as any).rangesAreEqual(
      [new SlickRange(2, 1, 4, 3)],
      [new SlickRange(2, 1, 4, 3)]
    );

    expect(output).toBe(true);
  });

  it('should call "rangesAreEqual" and expect False when both ranges are not equal', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });

    plugin.init(gridStub);
    const output = (plugin as any).rangesAreEqual(
      [new SlickRange(2, 1, 4, 3)],
      [new SlickRange(3, 2, 4, 3)]
    );

    expect(output).toBe(false);
  });

  it('should return an empty range array when calling "canCellBeSelected" return false on all ranges', () => {
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(false);

    plugin.init(gridStub);
    plugin.setSelectedRanges([
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[]);
    const output = (plugin as any).removeInvalidRanges([new SlickRange(2, 1, 4, 3)]);

    expect(output).toEqual([]);
  });

  it('should return an same range array when calling "canCellBeSelected" return true for all ranges', () => {
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    const mockRanges = [
      { fromCell: 1, fromRow: 2, toCell: 3, toRow: 4, contains: () => true },
      { fromCell: 2, fromRow: 3, toCell: 3, toRow: 4, contains: () => true },
    ] as unknown as SlickRange[];

    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);
    const output = (plugin as any).removeInvalidRanges([new SlickRange(2, 1, 4, 3)]);

    expectSelectionCall({ mock: { calls: [[output]] } }, [mockRanges[0]]);
    expect(plugin.getSelectedRanges()).toEqual(mockRanges);
  });
});
