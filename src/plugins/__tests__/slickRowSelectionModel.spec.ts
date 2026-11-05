import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Column, GridOption } from '../../models';
import { BasePubSub, SlickEditorLock, SlickEvent, SlickRange } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { SlickCellRangeSelector } from '../slick.cellrangeselector';
import { SlickRowSelectionModel } from '../slick.rowselectionmodel';

const GRID_UID = 'slickgrid_12345';

const addVanillaEventPropagation = function <T = any>(event: T, commandKey = '', keyName = '') {
  Object.defineProperty(event, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  Object.defineProperty(event, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  if (commandKey) {
    Object.defineProperty(event, commandKey, { writable: true, configurable: true, value: true });
  }
  if (keyName) {
    Object.defineProperty(event, 'key', { writable: true, configurable: true, value: keyName });
    const which = keyName === 'ArrowUp' ? 38 : keyName === 'ArrowDown' ? 40 : 0;
    Object.defineProperty(event, 'which', { writable: true, configurable: true, value: which });
  }
  return event;
};

const mockGridOptions = {
  frozenColumn: 1,
  frozenRow: -1,
  multiSelect: true,
} as GridOption;

const pubSubServiceStub = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  unsubscribeAll: vi.fn(),
} as BasePubSub;

const getEditorLockMock = {
  commitCurrentEdit: vi.fn(),
  isActive: vi.fn(),
} as unknown as SlickEditorLock;

const gridStub = {
  canCellBeActive: vi.fn(),
  getActiveCell: vi.fn(),
  getActiveCanvasNode: vi.fn(),
  getCanvasNode: vi.fn(),
  getCellFromEvent: vi.fn(),
  getCellFromPoint: vi.fn(),
  getCellNodeBox: vi.fn(),
  getColumns: vi.fn(),
  getVisibleColumns: vi.fn(),
  getColumnIndex: vi.fn(),
  getDataLength: vi.fn(),
  getPubSubService: () => pubSubServiceStub,
  getEditorLock: () => getEditorLockMock,
  getOptions: () => mockGridOptions,
  getPluginByName: vi.fn(),
  getUID: () => GRID_UID,
  focus: vi.fn(),
  registerPlugin: vi.fn(),
  setActiveCell: vi.fn(),
  scrollCellIntoView: vi.fn(),
  scrollRowIntoView: vi.fn(),
  unregisterPlugin: vi.fn(),
  onActiveCellChanged: new SlickEvent(),
  onClick: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onSelectedRangesChanged: new SlickEvent(),
  onBeforeCellRangeSelected: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickRowSelectionModel Plugin', () => {
  let plugin: SlickRowSelectionModel;
  const selector = () => (plugin as unknown as { _selector?: SlickCellRangeSelector })._selector;
  const mockColumns = [
    { id: 'firstName', field: 'firstName', name: 'First Name' },
    { id: 'lastName', field: 'lastName', name: 'Last Name' },
    { id: 'age', field: 'age', name: 'Age' },
  ] as Column[];
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
    plugin = new SlickRowSelectionModel();
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(gridStub, 'getVisibleColumns').mockReturnValue(mockColumns);
    vi.spyOn(gridStub, 'getColumnIndex').mockImplementation((columnId: string | number) =>
      typeof columnId === 'number' ? columnId : mockColumns.findIndex(column => column.id === columnId)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    plugin?.destroy();
    mockGridOptions.multiSelect = true;
    vi.spyOn(gridStub, 'getOptions').mockReturnValue(mockGridOptions);
  });

  it('should create the plugin', () => {
    expect(plugin).toBeTruthy();
  });

  it('should unsubscribe the plugin when calling destroy', () => {
    plugin.init(gridStub);
    const unsubscribeSpy = vi.spyOn((plugin as any)._eventHandler, 'unsubscribeAll');
    plugin.destroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should create the plugin and initialize it', () => {
    plugin.init(gridStub);

    expect(plugin.getOptions()).toEqual({
      autoScrollWhenDrag: true,
      cellRangeSelector: undefined,
      dragToSelect: false,
      selectActiveRow: true,
    });
  });

  it('should create the plugin and initialize it with just "selectActiveRow" option and still expect the same result', () => {
    plugin = new SlickRowSelectionModel({ selectActiveRow: false });
    plugin.init(gridStub);

    expect(plugin.getOptions()).toEqual({
      autoScrollWhenDrag: true,
      cellRangeSelector: undefined,
      dragToSelect: false,
      selectActiveRow: false,
    });
  });

  it('should create the plugin and initialize it with just "selectActiveRow" option and still expect the same result', () => {
    plugin = new SlickRowSelectionModel({ selectActiveRow: true });
    plugin.init(gridStub);

    expect(plugin.getOptions()).toEqual({
      autoScrollWhenDrag: true,
      cellRangeSelector: undefined,
      dragToSelect: false,
      selectActiveRow: true,
    });
  });

  it('should expect that "setSelectedRows" is being triggered when "refreshSelections" is called', () => {
    vi.spyOn(gridStub, 'getColumns').mockReturnValueOnce(mockColumns);
    plugin = new SlickRowSelectionModel({ selectActiveRow: false });
    plugin.init(gridStub);

    vi.spyOn(plugin, 'getSelectedRows').mockReturnValue([0, 1]);
    const setSelectedRowsSpy = vi.spyOn(plugin, 'setSelectedRows');
    plugin.refreshSelections();

    expect(setSelectedRowsSpy).toHaveBeenCalledWith([0, 1]);
  });

  it('should call "setSelectedRanges" when "setSelectedRows" is called', () => {
    vi.spyOn(gridStub, 'getColumns').mockReturnValueOnce(mockColumns);
    const setSelectedRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');

    plugin.init(gridStub);
    plugin.setSelectedRows([0, 2]);

    const expectedRanges = [
      { fromCell: 0, fromRow: 0, toCell: 2, toRow: 0 },
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
    ];
    expect(setSelectedRangeSpy).toHaveBeenCalledWith(expectedRanges, 'SlickRowSelectionModel.setSelectedRows');
    expect(plugin.getSelectedRanges()).toEqual(expectedRanges);
    expect(plugin.getSelectedRows()).toEqual([0, 2]);
  });

  it('should call "setSelectedRanges" with empty range input and not expect to "onSelectedRangesChanged" to be triggered', () => {
    const onSelectedRangeSpy = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');
    plugin.setSelectedRanges([]);
    expect(onSelectedRangeSpy).not.toHaveBeenCalled();
  });

  it('should call "setSelectedRanges" with valid ranges input and expect to "onSelectedRangesChanged" to be triggered', () => {
    const onSelectedRangeSpy = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');

    plugin.setSelectedRanges([new SlickRange(0, 0, 0, 2)]);

    expect(onSelectedRangeSpy).toHaveBeenCalledWith(
      [new SlickRange(0, 0, 0, 2)],
      expect.objectContaining({ event: expect.objectContaining({ detail: { caller: 'SlickRowSelectionModel.setSelectedRanges' } }) })
    );
  });

  it('should call "setSelectedRanges" with valid ranges input with a "caller" defined and expect to "onSelectedRangesChanged" to be triggered', () => {
    const caller = 'click.toggle';
    const onSelectedRangeSpy = vi.spyOn(plugin.onSelectedRangesChanged, 'notify');

    plugin.setSelectedRanges([new SlickRange(0, 0, 0, 2)], caller);

    expect(onSelectedRangeSpy).toHaveBeenCalledWith(
      [new SlickRange(0, 0, 0, 2)],
      expect.objectContaining({ event: expect.objectContaining({ detail: { caller } }) })
    );
  });

  it('should call "setSelectedRanges" with Slick Ranges when triggered by "onActiveCellChanged" and "selectActiveRow" is True', () => {
    vi.spyOn(gridStub, 'getColumns').mockReturnValueOnce(mockColumns);
    plugin = new SlickRowSelectionModel({ selectActiveRow: true });
    plugin.init(gridStub);
    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const mouseEvent = addVanillaEventPropagation(new Event('mouseenter'));
    gridStub.onActiveCellChanged.notify({ cell: 2, row: 3, grid: gridStub }, mouseEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([{ fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 }]);
  });

  it('should call "setSelectedRanges" with Slick Range with a Down direction when triggered by "onKeyDown" with key combo of Shift+ArrowDown and expect 4 ranges', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 3, row: 2 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(3, 2, 4, 3), new SlickRange(2, 1, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('keydown'), 'shiftKey', 'ArrowDown');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
      { fromCell: 0, fromRow: 5, toCell: 2, toRow: 5 },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range with an Up direction when triggered by "onKeyDown" with key combo of Shift+ArrowUp and expect 2 ranges', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('keydown'), 'shiftKey', 'ArrowUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range with an Up direction when triggered by "onKeyDown" with key combo of Shift+ArrowUp and expect only 1 range when getRowsRange Top is higher than Bottom', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 0 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(plugin, 'getSelectedRows').mockReturnValue([3, 3]);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('keydown'), 'shiftKey', 'ArrowUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 5, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([{ fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 }]);
  });

  it('should call "setSelectedRanges" with same Slick Range with an Up direction when triggered by "onKeyDown" with key combo of Shift+ArrowUp and expect 2 ranges even when "getSelectedRows" returns an empty array', () => {
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(plugin, 'getSelectedRows').mockReturnValue([]);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('keydown'), 'shiftKey', 'ArrowUp');
    gridStub.onKeyDown.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
    ]);
  });

  it('should not call "setSelectedRanges" when triggered by "onClick" and "canCellBeActive" returns false', () => {
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(false);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'ctrlKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).not.toHaveBeenCalled();
  });

  it('should not call "setSelectedRanges" when triggered by "onClick" and "multiSelect" grid option is false', () => {
    vi.spyOn(gridStub, 'getOptions').mockReturnValue({ ...mockGridOptions, multiSelect: false });
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'ctrlKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).not.toHaveBeenCalled();
  });

  it('should call "setSelectedRanges" with Slick Range when triggered by "onClick" with CtrlKey and expect 3 ranges', () => {
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'ctrlKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range when triggered by "onClick" with ShiftKey and expect 2 ranges and "setActiveCell" to be called', () => {
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'shiftKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setActiveCellSpy).toHaveBeenCalledWith(3, 2);
    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
    ]);
  });

  it('should call "setSelectedRanges" with Slick Range when triggered by "onClick" with ShiftKey and expect 4 ranges and "setActiveCell" to be called when cell row is not found in selection', () => {
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'shiftKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setActiveCellSpy).toHaveBeenCalledWith(1, 0);
    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 1, toCell: 2, toRow: 1 },
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
    ]);
  });

  it('should not call "setSelectedRanges" when triggered by "onClick" and cell row is not found in selection', () => {
    vi.spyOn(gridStub, 'canCellBeActive').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getDataLength').mockReturnValue(6);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    const mockRanges = [new SlickRange(2, 1, 4, 3), new SlickRange(3, 2, 4, 3)] as unknown as SlickRange[];
    plugin.init(gridStub);
    plugin.setSelectedRanges(mockRanges);

    const setSelectRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
    const keyDownEvent = addVanillaEventPropagation(new Event('click'), 'ctrlKey');
    gridStub.onClick.notify({ cell: 2, row: 3, grid: gridStub }, keyDownEvent, gridStub);

    expect(setSelectRangeSpy).toHaveBeenCalledWith([
      { fromCell: 0, fromRow: 2, toCell: 2, toRow: 2 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
      { fromCell: 0, fromRow: 3, toCell: 2, toRow: 3 },
      { fromCell: 0, fromRow: 4, toCell: 2, toRow: 4 },
      { fromCell: 0, fromRow: 1, toCell: 2, toRow: 1 },
    ]);
  });

  describe('with Selector', () => {
    beforeEach(() => {
      plugin.getOptions().dragToSelect = true;
    });

    afterEach(() => {
      vi.clearAllMocks();
      if (mockColumns[0]?.id === '_move') {
        mockColumns.shift();
      }
    });

    it('should call "setSelectedRanges" when "onCellRangeSelected" event is triggered', () => {
      const setSelectedRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onCellRangeSelected.notify({ range: new SlickRange(3, 2, 5, 4) }, scrollEvent, gridStub);

      expect(setSelectedRangeSpy).toHaveBeenCalledWith(
        [
          {
            fromCell: 0,
            fromRow: 3,
            toCell: 2,
            toRow: 5,
          },
        ],
        undefined,
        undefined
      );
    });

    it('should be able to manually create Row Selection and then call "setSelectedRanges" when "onCellRangeSelected" event is triggered', () => {
      vi.spyOn(gridStub, 'getColumns').mockReturnValueOnce(mockColumns);
      const setSelectedRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');

      plugin.getOptions().cellRangeSelector = new SlickCellRangeSelector({
        selectionCss: {
          border: 'none',
        } as CSSStyleDeclaration,
        autoScroll: true,
        minIntervalToShowNextCell: 30,
        maxIntervalToShowNextCell: 500,
        accelerateInterval: 5,
      });
      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onCellRangeSelected.notify({ range: new SlickRange(3, 2, 5, 4) }, scrollEvent, gridStub);

      expect(setSelectedRangeSpy).toHaveBeenCalledWith([{ fromCell: 0, fromRow: 3, toCell: 2, toRow: 5 }], undefined, undefined);
    });

    it('should call "setSelectedRanges" when "onCellRangeSelected" event is triggered', () => {
      const setSelectedRangeSpy = vi.spyOn(plugin, 'setSelectedRanges');
      mockGridOptions.multiSelect = false;

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onCellRangeSelected.notify({ range: new SlickRange(3, 2, 5, 4) }, scrollEvent, gridStub);

      expect(setSelectedRangeSpy).not.toHaveBeenCalled();
    });

    it('should call "setActiveCell" when "onBeforeCellRangeSelected" event is triggered', () => {
      const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
      mockGridOptions.multiSelect = false;

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onBeforeCellRangeSelected.notify({ row: 2, cell: 4 }, scrollEvent, gridStub);

      expect(setActiveCellSpy).toHaveBeenCalledWith(2, 4);
    });

    it('should NOT call "setActiveCell" when EditorLock isActive is returning True', () => {
      const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
      vi.spyOn(getEditorLockMock, 'isActive').mockReturnValue(true);
      mockGridOptions.multiSelect = false;

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onBeforeCellRangeSelected.notify({ row: 2, cell: 4 }, scrollEvent, gridStub);

      expect(setActiveCellSpy).not.toHaveBeenCalled();
    });

    it('should call "setActiveCell" when RowMoveManager is enabled and the column cell does NOT have any "behavior" defined', () => {
      const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
      vi.spyOn(getEditorLockMock, 'isActive').mockReturnValue(false);
      vi.spyOn(gridStub, 'getPluginByName').mockReturnValue({ isHandlerColumn: () => false } as any);
      mockGridOptions.multiSelect = false;

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onBeforeCellRangeSelected.notify({ row: 2, cell: 1 }, scrollEvent, gridStub);

      expect(setActiveCellSpy).toHaveBeenCalledWith(2, 1);
    });

    it('should NOT call "setActiveCell" when RowMoveManager is enabled and the column cell has a "behavior" defined as "selectAndMove"', () => {
      const setActiveCellSpy = vi.spyOn(gridStub, 'setActiveCell');
      vi.spyOn(getEditorLockMock, 'isActive').mockReturnValue(false);
      mockGridOptions.multiSelect = false;
      mockColumns.unshift({ id: '_move', field: '_move', behavior: 'selectAndMove' });
      vi.spyOn(gridStub, 'getPluginByName').mockReturnValue({ isHandlerColumn: (cell: number) => mockColumns[cell]?.behavior === 'selectAndMove' } as any);

      plugin.init(gridStub);
      const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
      selector()!.onBeforeCellRangeSelected.notify({ row: 2, cell: 0 }, scrollEvent, gridStub);

      expect(setActiveCellSpy).not.toHaveBeenCalled();
    });
  });
});
