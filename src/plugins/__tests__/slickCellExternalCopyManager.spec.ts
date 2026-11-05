import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SlickDataView } from '../../slick.dataview';
import { Column, EditCommand, ExcelCopyBufferOption, GridOption, SelectionModel } from '../../models';
import { BasePubSub, SlickEvent, SlickEventData, SlickRange } from '../../slick.core';
import { SlickGrid } from '../../slick.grid';
import { SlickCellExternalCopyManager } from '../slick.cellexternalcopymanager';

const pubSubServiceStub = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  unsubscribeAll: vi.fn(),
} as BasePubSub;

const mockGetSelectionModel = {
  getSelectedRanges: vi.fn(),
  setSelectedRanges: vi.fn(),
  getSelectedRows: vi.fn(),
  setSelectedRows: vi.fn(),
  onSelectedRangesChanged: new SlickEvent(),
};
const returnValueStub = vi.fn();

const dataViewStub = {
  destroy: vi.fn(),
  addItem: vi.fn(),
  getItem: vi.fn(),
  getItems: vi.fn(),
  getItemCount: vi.fn(),
  setItems: vi.fn(),
} as unknown as SlickDataView;

const gridStub = {
  destroy: vi.fn(),
  getActiveCell: vi.fn(),
  getActiveCellNode: vi.fn(),
  getColumns: vi.fn().mockReturnValue([
    { id: 'firstName', field: 'firstName', name: 'First Name' },
    { id: 'lastName', field: 'lastName', name: 'Last Name' },
  ] as Column[]),
  getColumnByIdx: vi.fn(),
  getData: () => dataViewStub,
  getDataItem: vi.fn(),
  getDataLength: vi.fn(),
  hasDataView: () => true,
  getPubSubService: () => pubSubServiceStub,
  getEditorLock: () => ({
    isActive: () => false,
  }),
  getOptions: vi.fn(),
  focus: vi.fn(),
  getSelectionModel: () => mockGetSelectionModel,
  registerPlugin: vi.fn(),
  removeCellCssStyles: vi.fn(),
  setCellCssStyles: vi.fn(),
  setData: vi.fn(),
  setSelectionModel: vi.fn(),
  updateCell: vi.fn(),
  render: vi.fn(),
  triggerEvent: vi.fn().mockReturnValue({ getReturnValue: returnValueStub }),
  onCellChange: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onValidationError: new SlickEvent(),
} as unknown as SlickGrid;

const mockTextEditor = {
  constructor: vi.fn(),
  init: vi.fn(),
  destroy: vi.fn(),
  applyValue: vi.fn(),
  loadValue: vi.fn(),
  serializeValue: vi.fn(),
  validate: vi.fn().mockReturnValue({ valid: true, msg: null }),
};

class MockTextEditor {
  constructor() {
    return mockTextEditor as any;
  }
}

const Editors = {
  text: MockTextEditor,
};

describe('CellExternalCopyManager', () => {
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockReturnValue();
  const lastNameElm = document.createElement('div');
  lastNameElm.textContent = 'Last Name';
  const mockEventCallback = () => {};
  const mockColumns = [
    { id: 'firstName', field: 'firstName', name: 'First Name', editor: Editors.text },
    { id: 'lastName', field: 'lastName', name: lastNameElm },
    { id: 'age', field: 'age', name: 'Age', editor: Editors.text },
  ] as Column[];
  let plugin: SlickCellExternalCopyManager;
  const gridOptionsMock = {
    editable: true,
    enableCheckboxSelector: true,
    excelCopyBufferOptions: {
      onExtensionRegistered: vi.fn(),
      onCopyCells: mockEventCallback,
      onCopyCancelled: mockEventCallback,
      onPasteCells: mockEventCallback,
    },
  } as GridOption;

  beforeEach(() => {
    plugin = new SlickCellExternalCopyManager({});
  });

  function initPlugin(options: ExcelCopyBufferOption = {}) {
    plugin = new SlickCellExternalCopyManager(options);
    plugin.init(gridStub);
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the plugin', () => {
    expect(plugin).toBeTruthy();
  });

  describe('registered addon', () => {
    beforeEach(() => {
      vi.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: {
          readText: vi.fn(() => Promise.resolve('')),
          writeText: vi.fn(() => Promise.resolve()),
        },
        writable: true,
      });
    });

    afterEach(() => {
      plugin.destroy();
      vi.clearAllMocks();
    });

    it('should throw an error initializing the plugin without a selection model', () =>
      new Promise((done: any) => {
        vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(null as any);
        try {
          plugin.init(gridStub);
        } catch (error: any) {
          expect(error.message).toBe(
            'Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())'
          );
          done();
        }
      }));

    it('should focus on the grid after "onSelectedRangesChanged" is triggered', () => {
      vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);
      const gridFocusSpy = vi.spyOn(gridStub, 'focus');

      plugin.init(gridStub);
      const eventData = { ...new SlickEventData(), preventDefault: vi.fn() } as unknown as SlickEventData;
      mockGetSelectionModel.onSelectedRangesChanged.notify([new SlickRange(0, 0, 0, 0)], eventData, gridStub);

      expect(gridFocusSpy).toHaveBeenCalled();
    });

    it('should remove CSS styling when "clearCopySelection" is called', () => {
      const removeStyleSpy = vi.spyOn(gridStub, 'removeCellCssStyles');
      plugin.init(gridStub);
      plugin.clearCopySelection();
      expect(removeStyleSpy).toHaveBeenCalledWith('copy-manager');
    });

    it('should use the custom header extractor when copying selected cells', async () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const clipboardWriteOverride = vi.fn();
      plugin = new SlickCellExternalCopyManager({
        includeHeaderWhenCopying: true,
        headerColumnValueExtractor: () => 'Full Name',
        clipboardWriteOverride,
        clearCopySelectionDelay: 1,
      });
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(columns);
      vi.spyOn(gridStub, 'getDataItem').mockReturnValue({ firstName: 'John' });
      vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);
      vi.spyOn(mockGetSelectionModel, 'getSelectedRanges').mockReturnValue([new SlickRange(0, 0, 0, 0)]);
      plugin.init(gridStub);

      gridStub.onKeyDown.notify({} as any, new SlickEventData(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })), gridStub);
      await vi.waitFor(() => expect(clipboardWriteOverride).toHaveBeenCalledWith('Full Name\r\nJohn\r\n'));

      plugin.clearCopySelection();
    });

    describe('keyDown handler', () => {
      beforeEach(() => {
        vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);
        mockGetSelectionModel.getSelectedRanges.mockReset();
        mockGetSelectionModel.setSelectedRanges.mockReset();
        vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
        vi.spyOn(gridStub, 'getDataLength').mockReturnValue(2);
        vi.spyOn(gridStub, 'getData').mockReturnValue([
          { firstName: 'John', lastName: 'Doe', age: 30 },
          { firstName: 'Jane', lastName: 'Doe' },
        ] as any[]);
        vi.spyOn(gridStub, 'getDataItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' }).mockReturnValueOnce({ firstName: 'Jane', lastName: 'Doe' });
        vi.spyOn(gridStub, 'hasDataView').mockReturnValue(false);
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('should Copy & Paste then clear selections', () =>
        new Promise((done: any) => {
          const mockOnCopyCancelled = vi.fn();
          const mockOnCopyInit = vi.fn();
          const mockOnCopyCells = vi.fn();
          const mockOnCopySuccess = vi.fn();

          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges').mockReturnValue([new SlickRange(0, 1, 2, 2)]);

          initPlugin({
            clearCopySelectionDelay: 1,
            includeHeaderWhenCopying: true,
            onCopyInit: mockOnCopyInit,
            onCopySuccess: mockOnCopySuccess,
          });
          plugin.onCopyCancelled.subscribe(mockOnCopyCancelled);
          plugin.onCopyCells.subscribe(mockOnCopyCells);
          const clearSpy = vi.spyOn(plugin, 'clearCopySelection');

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const keyDownEscEvent = new Event('keydown');
          Object.defineProperty(keyDownEscEvent, 'key', { writable: true, configurable: true, value: 'Escape' });
          Object.defineProperty(keyDownEscEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownEscEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownEscEvent, gridStub);

          expect(clearSpy).toHaveBeenCalled();
          expect(mockOnCopyInit).toHaveBeenCalled();
          expect(mockOnCopyCancelled).toHaveBeenCalledWith(expect.any(Object), { ranges: [new SlickRange(0, 1, 2, 2)] });
          expect(mockOnCopyCells).toHaveBeenCalledWith(expect.any(Object), { ranges: expect.any(Array) });

          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell');
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(clearSpy).toHaveBeenCalled();
            done();
          });
        }));

      it('should Copy, Paste and run Execute clip command', () =>
        new Promise((done: any) => {
          let clipCommand: EditCommand;
          const clipboardCommandHandler = (cmd: EditCommand) => {
            clipCommand = cmd;
            cmd.execute();
          };
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 1, 2)])
            .mockReturnValueOnce(null as any);
          initPlugin({ clearCopySelectionDelay: 1, includeHeaderWhenCopying: true, clipboardCommandHandler });

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
          const onCellChangeSpy = vi.spyOn(gridStub.onCellChange, 'notify');
          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce('Doe\tserialized output');
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(updateCellSpy).toHaveBeenCalledWith(1, 1);
            expect(updateCellSpy).toHaveBeenCalledWith(1, 0);
            expect(onCellChangeSpy).toHaveBeenCalledWith({
              row: 1,
              cell: 0,
              item: { firstName: 'John', lastName: 'serialized output' },
              grid: gridStub,
              column: {},
            });
            const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
            clipCommand.undo();
            expect(getDataItemSpy).toHaveBeenCalled();
            done();
          });
        }));

      it('should paste clipboard text at the active cell', () =>
        new Promise((done: any) => {
          let clipCommand: EditCommand;
          const clipboardCommandHandler = (cmd: EditCommand) => {
            clipCommand = cmd;
            cmd.execute();
          };

          initPlugin({ clearCopySelectionDelay: 1, includeHeaderWhenCopying: true, clipboardCommandHandler });
          const selectionModel = gridStub.getSelectionModel() as SelectionModel;
          vi.spyOn(selectionModel, 'getSelectedRanges').mockReturnValue([]);

          const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
          const onCellChangeSpy = vi.spyOn(gridStub.onCellChange, 'notify');
          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });
          vi.spyOn(gridStub, 'getColumns').mockReturnValue([{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[]);
          const keyDownCtrlPasteEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce('Smith');
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(updateCellSpy).toHaveBeenCalledWith(1, 0);
            expect(onCellChangeSpy).toHaveBeenCalledWith({ row: 1, cell: 0, item: { firstName: 'Smith', lastName: 'Doe' }, grid: gridStub, column: {} });

            const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
            const updateCell2Spy = vi.spyOn(gridStub, 'updateCell');
            clipCommand.undo();
            expect(getDataItemSpy).toHaveBeenCalled();
            expect(updateCell2Spy).toHaveBeenCalled();
            expect(onCellChangeSpy).toHaveBeenCalled();
            done();
          });
        }));

      it('should paste CRLF clipboard rows without creating phantom blank rows', () =>
        new Promise((done: any) => {
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges').mockReturnValueOnce(null as any);
          vi.spyOn(gridStub, 'getDataLength').mockReturnValue(3);
          vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 1, row: 0 });
          vi.spyOn(gridStub, 'getDataItem')
            .mockReturnValueOnce({ firstName: 'John', lastName: 'Doe' })
            .mockReturnValueOnce({ firstName: 'Jane', lastName: 'Smith' });

          initPlugin({ clearCopySelectionDelay: 1 });

          const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
          const keyDownCtrlPasteEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });

          (navigator.clipboard.readText as Mock).mockResolvedValueOnce('Alpha\r\nBeta');
          gridStub.onKeyDown.notify({ cell: 1, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(updateCellSpy).toHaveBeenCalledTimes(2);
            expect(updateCellSpy).toHaveBeenNthCalledWith(1, 0, 1);
            expect(updateCellSpy).toHaveBeenNthCalledWith(2, 1, 1);
            done();
          });
        }));

      it('should Copy, Paste but not execute run clipCommandHandler when defined', () =>
        new Promise((done: any) => {
          const mockClipboardCommandHandler = vi.fn();
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 2, 2)])
            .mockReturnValueOnce(null as any);

          initPlugin({
            clearCopySelectionDelay: 1,
            includeHeaderWhenCopying: true,
            clipboardCommandHandler: mockClipboardCommandHandler,
          });

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce(`Doe\tserialized output`);
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(mockClipboardCommandHandler).toHaveBeenCalled();
            done();
          });
        }));

      it('should Copy, Paste without completing it because it does not know where to paste it', () =>
        new Promise((done: any) => {
          const mockClipboardCommandHandler = vi.fn();
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 2, 2)])
            .mockReturnValueOnce(null as any);

          initPlugin({
            clearCopySelectionDelay: 1,
            includeHeaderWhenCopying: true,
            clipboardCommandHandler: mockClipboardCommandHandler,
          });

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue(null);
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce(`Doe\tserialized output`);
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(mockClipboardCommandHandler).not.toHaveBeenCalled();
            done();
          });
        }));

      it('should Copy, Paste and run Execute clip command', () =>
        new Promise((done: any) => {
          let nextAddNewRowId = 0;
          const mockNewRowCreator = vi.fn((count: number) => {
            for (let i = 0; i < count; i++) {
              gridStub.getData<any[]>().push({
                id: nextAddNewRowId--,
              });
            }
          });
          const mockOnPasteCells = vi.fn();
          const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 2, 2)])
            .mockReturnValueOnce(null as any);

          let clipCommand: EditCommand;
          const clipboardCommandHandler = (cmd: EditCommand) => {
            clipCommand = cmd;
            cmd.execute();
          };
          initPlugin({
            clearCopySelectionDelay: 1,
            includeHeaderWhenCopying: true,
            clipboardCommandHandler,
            newRowCreator: mockNewRowCreator,
          });
          plugin.onPasteCells.subscribe(mockOnPasteCells);

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 3 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce(`Doe\tserialized output`);
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(mockNewRowCreator).toHaveBeenCalled();
            expect(getDataItemSpy).toHaveBeenCalled();

            clipCommand.undo();

            expect(mockOnPasteCells).toHaveBeenCalledWith(expect.any(SlickEventData), { ranges: [new SlickRange(2, 0, 3, 0)] });
            done();
          });
        }));

      it('should copy selection but skip hidden column and then use window.clipboard when exist and Paste is performed', () =>
        new Promise((done: any) => {
          let clipCommand: EditCommand;
          const clipboardCommandHandler = (cmd: EditCommand) => {
            clipCommand = cmd;
            cmd.execute();
          };
          const mockColumns = [
            { id: 'firstName', field: 'firstName', name: 'First Name', editor: Editors.text },
            { id: 'lastName', field: 'lastName', name: lastNameElm, hidden: true },
            { id: 'age', field: 'age', name: 'Age', editor: Editors.text },
            { id: 'gender', field: 'gender', name: 'Gender' },
          ] as Column[];
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 1, 2)])
            .mockReturnValueOnce(null as any);
          initPlugin({ clearCopySelectionDelay: 1, includeHeaderWhenCopying: true, clipboardCommandHandler });

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlCopyEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
          const onCellChangeSpy = vi.spyOn(gridStub.onCellChange, 'notify');
          const getActiveCellSpy = vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce(`Doe\tserialized output`);
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(getActiveCellSpy).toHaveBeenCalled();
            expect(updateCellSpy).toHaveBeenCalledWith(1, 0);
            expect(updateCellSpy).not.toHaveBeenCalledWith(1, 1);
            expect(onCellChangeSpy).toHaveBeenCalledWith({ row: 1, cell: 2, item: { firstName: 'John', lastName: 'Doe' }, grid: gridStub, column: {} });
            const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
            clipCommand.undo();
            expect(getDataItemSpy).toHaveBeenCalled();
            done();
          });
        }));

      it('should not throw when pasting multiple rows with a hidden column that inflates destW across row iterations', () =>
        new Promise((done: any) => {
          // Paste 2 rows x 2 cells into a 3-column grid where column[1] is hidden.
          // destW starts at 2. On row y=0, the hidden col at destx=1 inflates destW to 3.
          // On row y=1 the loop starts with destW=3, hits hidden col again (destW→4),
          // then destx=3 → columns[3] === undefined → break is hit.
          //
          // y=0:
          // | x | destx | column    | hidden | action                   |
          // |---|-------|-----------|--------|--------------------------|
          // | 0 |   0   | firstName |        | paste "John"             |
          // | 1 |   1   | lastName  |  true  | destW++ (2→3), xOffset++ |
          // | 2 |   2   | age       |        | paste "30"               |
          //
          // y=1 (destW is now 3, not reset between rows):
          // | x | destx | column    | hidden | action                           |
          // |---|-------|-----------|--------|----------------------------------|
          // | 0 |   0   | firstName |        | paste "Jane"                     |
          // | 1 |   1   | lastName  |  true  | destW++ (3→4), xOffset++         |
          // | 2 |   2   | age       |        | paste "25"                       |
          // | 3 |   3   | (none)    |        | columns[3] === undefined → break |
          const hiddenColsMockColumns = [
            { id: 'firstName', field: 'firstName', name: 'First Name' },
            { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(hiddenColsMockColumns);
          vi.spyOn(gridStub, 'getDataLength').mockReturnValue(3);
          vi.spyOn(gridStub, 'getDataItem').mockReturnValue({ firstName: 'John', age: 30 });
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges').mockReturnValueOnce(null as any);

          const clipboardCommandHandler = (cmd: any) => cmd.execute();
          const setSelectedRangesSpy = vi.spyOn(mockGetSelectionModel, 'setSelectedRanges');
          vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);

          initPlugin({ clearCopySelectionDelay: 1, clipboardCommandHandler });

          vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 0 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });

          // 2 rows x 2 visible cells; the hidden col between them inflates destW each row, pushing destx out of bounds on row 2
          (navigator.clipboard.readText as Mock).mockResolvedValueOnce('John\t30\r\nJane\t25');
          expect(() => gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub)).not.toThrow();

          setTimeout(() => {
            // 2 rows pasted, visible columns are 0 (firstName) and 2 (age)
            expect(setSelectedRangesSpy).toHaveBeenCalledWith([new SlickRange(0, 0, 1, 2)]);
            done();
          });
        }));

      it('should set correct bRange toCell (lastDestX) when hidden column sits between pasted columns on execute', () =>
        new Promise((done: any) => {
          const hiddenColsMockColumns = [
            { id: 'firstName', field: 'firstName', name: 'First Name' },
            { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
            { id: 'age', field: 'age', name: 'Age' },
            { id: 'gender', field: 'gender', name: 'Gender' },
          ] as Column[];
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(hiddenColsMockColumns);
          vi.spyOn(gridStub, 'getDataLength').mockReturnValue(2);
          vi.spyOn(gridStub, 'getDataItem').mockReturnValue({ firstName: 'John', age: 30 });
          vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);
          vi.spyOn(mockGetSelectionModel, 'getSelectedRanges').mockReturnValueOnce(null as any);

          const clipboardCommandHandler = (cmd: any) => cmd.execute();
          const setSelectedRangesSpy = vi.spyOn(mockGetSelectionModel, 'setSelectedRanges');
          vi.spyOn(gridStub, 'getSelectionModel').mockReturnValue(mockGetSelectionModel as any);

          initPlugin({ clearCopySelectionDelay: 1, clipboardCommandHandler });

          vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 0 });
          const keyDownCtrlPasteEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
          Object.defineProperty(keyDownCtrlPasteEvent, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });

          (navigator.clipboard.readText as Mock).mockResolvedValueOnce('John\t30');
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(setSelectedRangesSpy).toHaveBeenCalledWith([new SlickRange(0, 0, 0, 2)]);
            done();
          });
        }));

      it('should show a console error when navigator.clipboard fails', () =>
        new Promise((done: any) => {
          const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();
          const mockColumns = [
            { id: 'firstName', field: 'firstName', name: 'First Name', editor: Editors.text },
            { id: 'lastName', field: 'lastName', name: lastNameElm, hidden: true },
            { id: 'age', field: 'age', name: 'Age', editor: Editors.text },
            { id: 'gender', field: 'gender', name: 'Gender' },
          ] as Column[];
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          vi.spyOn(gridStub.getSelectionModel() as SelectionModel, 'getSelectedRanges')
            .mockReturnValueOnce([new SlickRange(0, 1, 1, 2)])
            .mockReturnValueOnce(null as any);
          initPlugin({ clearCopySelectionDelay: 1, includeHeaderWhenCopying: true });

          const keyDownCtrlCopyEvent = new Event('keydown');
          Object.defineProperty(keyDownCtrlCopyEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlCopyEvent, 'key', { writable: true, configurable: true, value: 'c' });
          (navigator.clipboard.writeText as Mock).mockRejectedValueOnce('clipboard error');
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlCopyEvent, gridStub);

          const keyDownCtrlPasteEvent = new Event('keydown');
          vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
          Object.defineProperty(keyDownCtrlPasteEvent, 'ctrlKey', { writable: true, configurable: true, value: true });
          Object.defineProperty(keyDownCtrlPasteEvent, 'key', { writable: true, configurable: true, value: 'v' });
          (navigator.clipboard.readText as Mock).mockRejectedValueOnce('clipboard error');
          gridStub.onKeyDown.notify({ cell: 0, row: 0, grid: gridStub }, keyDownCtrlPasteEvent, gridStub);

          setTimeout(() => {
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            expect(consoleSpy).toHaveBeenCalledWith(
              'Unable to read/write to clipboard. Please check your browser settings or permissions. Error: clipboard error'
            );
            done();
          });
        }));

      it('should restore individual cell values on undo for multi-cell paste (oneCellToMultiple)', () => {
        initPlugin({});

        const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
        const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
        getDataItemSpy
          .mockReturnValueOnce({ firstName: 'John', lastName: 'Doe' })
          .mockReturnValueOnce({ firstName: 'Jane', lastName: 'Smith' })
          .mockReturnValueOnce({ firstName: 'Bob', lastName: 'Johnson' });

        vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
        vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });

        // Manually construct the clip command to test undo behavior
        const clipCommand2 = {
          isClipboardCommand: true,
          destH: 3,
          destW: 1,
          h: 1,
          w: 1,
          maxDestY: 10,
          maxDestX: 10,
          oldValues: [[{ firstName: 'John', lastName: 'Doe' }], [{ firstName: 'Jane', lastName: 'Smith' }], [{ firstName: 'Bob', lastName: 'Johnson' }]],
          setDataItemValueForColumn: (dt: any, col: Column, value: any) => {
            dt[col.field] = value;
          },
          execute: () => {},
        } as any;

        clipCommand2.undo = function () {
          const columns = gridStub.getColumns();
          for (let y = 0; y < clipCommand2.destH; y++) {
            let xOffset = 0;
            for (let x = 0; x < clipCommand2.destW; x++) {
              const desty = 1 + y;
              const destx = 0 + x;
              const column = columns[destx];

              if (column.hidden) {
                xOffset++;
                continue;
              }

              if (desty < clipCommand2.maxDestY && destx < clipCommand2.maxDestX) {
                const dt = gridStub.getDataItem(desty);
                clipCommand2.setDataItemValueForColumn(dt, column, clipCommand2.oldValues[y][x - xOffset]);
                gridStub.updateCell(desty, destx);
              }
            }
          }
        };

        // Execute undo
        clipCommand2.undo();

        // Verify each cell was restored with its individual old value, not all with oldValues[0][0]
        expect(updateCellSpy).toHaveBeenCalledWith(1, 0);
        expect(updateCellSpy).toHaveBeenCalledWith(2, 0);
        expect(updateCellSpy).toHaveBeenCalledWith(3, 0);
      });

      it('should restore individual cell values on undo for multi-cell paste with hidden columns', () => {
        const hiddenColsMockColumns = [
          { id: 'firstName', field: 'firstName', name: 'First Name' },
          { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
          { id: 'age', field: 'age', name: 'Age' },
        ] as Column[];

        initPlugin({});

        const updateCellSpy = vi.spyOn(gridStub, 'updateCell');
        const getDataItemSpy = vi.spyOn(gridStub, 'getDataItem');
        getDataItemSpy.mockReturnValueOnce({ firstName: 'John', age: 30 }).mockReturnValueOnce({ firstName: 'Jane', age: 25 });

        vi.spyOn(gridStub, 'getColumns').mockReturnValue(hiddenColsMockColumns);
        vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 0, row: 1 });

        // Manually construct the clip command with hidden column to test xOffset tracking in undo
        const clipCommand2 = {
          isClipboardCommand: true,
          destH: 2,
          destW: 3, // 3 because: col0 (firstName) + col1 (hidden) + col2 (age)
          h: 1,
          w: 1,
          maxDestY: 10,
          maxDestX: 10,
          // oldValues[y][x-xOffset]: oldValues should have 2 items per row (for visible cols 0 and 2)
          oldValues: [
            [
              { firstName: 'John', age: 30 },
              { firstName: 'John', age: 30 },
            ],
            [
              { firstName: 'Jane', age: 25 },
              { firstName: 'Jane', age: 25 },
            ],
          ],
          setDataItemValueForColumn: (dt: any, col: Column, value: any) => {
            dt[col.field] = value;
          },
          execute: () => {},
        } as any;

        clipCommand2.undo = function () {
          const columns = gridStub.getColumns();
          for (let y = 0; y < clipCommand2.destH; y++) {
            let xOffset = 0;
            for (let x = 0; x < clipCommand2.destW; x++) {
              const desty = 1 + y;
              const destx = 0 + x;
              const column = columns[destx];

              if (column.hidden) {
                xOffset++;
                continue;
              }

              if (desty < clipCommand2.maxDestY && destx < clipCommand2.maxDestX) {
                const dt = gridStub.getDataItem(desty);
                clipCommand2.setDataItemValueForColumn(dt, column, clipCommand2.oldValues[y][x - xOffset]);
                gridStub.updateCell(desty, destx);
              }
            }
          }
        };

        // Execute undo with hidden column handling
        clipCommand2.undo();

        // Verify cells were updated (hidden column should be skipped, xOffset properly tracked)
        expect(updateCellSpy).toHaveBeenCalledWith(1, 0);
        expect(updateCellSpy).toHaveBeenCalledWith(1, 2);
        expect(updateCellSpy).toHaveBeenCalledWith(2, 0);
        expect(updateCellSpy).toHaveBeenCalledWith(2, 2);
      });
    });
  });
});
