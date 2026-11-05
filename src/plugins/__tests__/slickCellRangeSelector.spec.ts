import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragRowMove, GridOption, MouseOffsetViewport } from '../../models/index.js';
import { SlickEvent } from '../../slick.core.js';
import type { BasePubSub } from '../../slick.core.js';
import type { SlickGrid } from '../../slick.grid.js';
import { SlickCellRangeSelector } from '../slick.cellrangeselector.js';

vi.useFakeTimers();

const GRID_UID = 'slickgrid_12345';

type CellRangeSelectorTestHooks = {
  getMouseOffsetViewport: (event: MouseEvent | TouchEvent, drag: DragRowMove) => MouseOffsetViewport;
};

const getTestHooks = (selector: SlickCellRangeSelector) => selector as unknown as CellRangeSelectorTestHooks;

const setViewportSize = (viewport: HTMLElement) => {
  Object.defineProperties(viewport, {
    offsetHeight: { configurable: true, value: 500 },
    offsetWidth: { configurable: true, value: 500 },
    clientHeight: { configurable: true, value: 500 },
    clientWidth: { configurable: true, value: 500 },
  });
};

const addVanillaEventPropagation = function <T = any>(event: T) {
  Object.defineProperty(event, 'isPropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  Object.defineProperty(event, 'isImmediatePropagationStopped', { writable: true, configurable: true, value: vi.fn() });
  return event;
};

const mockGridOptions = {
  rowHeight: 30,
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
};

const gridStub = {
  canCellBeSelected: vi.fn(),
  getAbsoluteColumnMinWidth: vi.fn(),
  getActiveCell: vi.fn(),
  getActiveCanvasNode: vi.fn(),
  getActiveViewportNode: vi.fn(),
  getCanvasNode: vi.fn(),
  getCellFromEvent: vi.fn(),
  getCellFromPoint: vi.fn(),
  getCellNodeBox: vi.fn(),
  getDisplayedScrollbarDimensions: vi.fn(),
  getPubSubService: () => pubSubServiceStub,
  getEditorLock: () => getEditorLockMock,
  getOptions: () => mockGridOptions,
  getPluginByName: vi.fn(() => undefined),
  getSelectionModel: vi.fn(() => undefined),
  getUID: () => GRID_UID,
  focus: vi.fn(),
  scrollCellIntoView: vi.fn(),
  onDragInit: new SlickEvent(),
  onDragStart: new SlickEvent(),
  onDrag: new SlickEvent(),
  onDragEnd: new SlickEvent(),
  onScroll: new SlickEvent(),
} as unknown as SlickGrid;

describe('CellRangeSelector Plugin', () => {
  let plugin: SlickCellRangeSelector;
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

  beforeEach(() => {
    plugin = new SlickCellRangeSelector();
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub, 'getCellNodeBox').mockReturnValue({ left: 0, right: 10, top: 0, bottom: 10 });
    vi.spyOn(gridStub.getEditorLock(), 'isActive').mockReturnValue(false);
    vi.spyOn(gridStub.getEditorLock(), 'commitCurrentEdit').mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    plugin?.destroy();
    mockGridOptions.rowHeight = 30;
  });

  it('should create the plugin', () => {
    expect(plugin).toBeTruthy();
    expect(plugin.getSelectionMode()).toBeTruthy();
  });

  it('should destroy the plugin when calling destroy', () => {
    plugin.init(gridStub);
    const hideSpy = vi.spyOn(plugin.getCellDecorator(), 'hide');
    plugin.destroy();
    expect(hideSpy).toHaveBeenCalledOnce();
  });

  it('should create the plugin and initialize it', () => {
    plugin.init(gridStub);

    expect(plugin.getCellDecorator()).toBeTruthy();
  });

  it('should use the full viewport height when dragging in a docked grid', () => {
    const widget = document.createElement('div');
    widget.className = `slick-widget ${GRID_UID}`;
    const viewport = document.createElement('div');
    viewport.className = 'slick-viewport';
    const canvas = document.createElement('div');
    canvas.className = 'grid-canvas grid-canvas-bottom grid-canvas-left';
    const dockingScroller = document.createElement('div');
    dockingScroller.className = 'slick-docking-horizontal-scroller';
    viewport.appendChild(canvas);
    widget.append(viewport, dockingScroller);
    document.body.appendChild(widget);
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 321 },
      clientWidth: { configurable: true, value: 654 },
    });

    vi.spyOn(gridStub, 'getCanvasNode').mockReturnValue(canvas);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(canvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(viewport);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 17, width: 17 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(40);

    plugin.init(gridStub);
    gridStub.onDragInit.notify({ matchClassTag: '' } as any, addVanillaEventPropagation(new Event('dragInit')), gridStub);

    expect((plugin as any)._viewportWidth).toBe(654);
    expect((plugin as any)._viewportHeight).toBe(321);
    widget.remove();
  });

  it('should use the grid scroll event offset when calculating the active viewport bounds', () => {
    const viewport = document.createElement('div');
    Object.defineProperties(viewport, {
      scrollLeft: { configurable: true, value: 0 },
      scrollTop: { configurable: true, value: 0 },
    });
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue({ left: 20, top: 30, right: 120, bottom: 80 } as DOMRect);
    (plugin as any)._activeViewport = viewport;
    (plugin as any)._viewportWidth = 100;
    (plugin as any)._viewportHeight = 50;
    plugin.init(gridStub);

    gridStub.onScroll.notify({ scrollHeight: 1000, scrollTop: 40, scrollLeft: 60, grid: gridStub } as any, addVanillaEventPropagation(new Event('scroll')), gridStub);

    const result = getTestHooks(plugin).getMouseOffsetViewport({ pageX: 70, pageY: 50 } as MouseEvent, {} as DragRowMove);

    expect(result.viewport).toEqual({
      left: 60,
      top: 40,
      right: 160,
      bottom: 90,
      offset: { left: 20, top: 30, right: 120, bottom: 80 },
    });
  });

  it('should handle drag but return without executing anything when item cannot be dragged and cell cannot be selected', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(false);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    plugin.init(gridStub);
    const decoratorHideSpy = vi.spyOn(plugin.getCellDecorator(), 'hide');
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    const dragEventEnd = addVanillaEventPropagation(new Event('dragEnd'));
    gridStub.onDragEnd.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEventEnd,
      gridStub
    );

    expect(focusSpy).not.toHaveBeenCalled();
    expect(decoratorHideSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).not.toHaveBeenCalled();
  });

  it('should handle drag in bottom left canvas', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ cell: 2, row: 3 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const scrollSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const initEvent = new Event('dragInit');
    const propagationSpy = vi.spyOn(initEvent, 'stopImmediatePropagation');

    plugin.init(gridStub);
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(initEvent);
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    Object.defineProperty(dragEvent, 'pageX', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(dragEvent, 'pageY', { writable: true, configurable: true, value: 0 });
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } });
    expect(scrollSpy).toHaveBeenCalledWith(5, 4);
    expect(propagationSpy).toHaveBeenCalled();
  });

  it('should handle drag in bottom right canvas with decorator showing dragging range', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const onBeforeCellSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    plugin.init(gridStub);
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    (dragEvent as any).pageX = -2;
    (dragEvent as any).pageY = -156;
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalledWith(
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3,
      },
      false
    );
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
  });

  it('should handle drag end in bottom right canvas with "onCellRangeSelected" published', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const onBeforeCellRangeSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const onCellRangeSpy = vi.spyOn(plugin.onCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    plugin.init(gridStub);
    const decoratorHideSpy = vi.spyOn(plugin.getCellDecorator(), 'hide');
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEventEnd = addVanillaEventPropagation(new Event('dragEnd'));
    gridStub.onDragEnd.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEventEnd,
      gridStub
    );

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellRangeSpy).toHaveBeenCalled();
    expect(onCellRangeSpy).toHaveBeenCalledWith({
      range: {
        fromCell: 2,
        fromRow: 3,
        toCell: 4,
        toRow: 5,
      },
      allowAutoEdit: false,
      selectionMode: 'SEL',
    });
    expect(decoratorHideSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalledWith(
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3,
      },
      false
    );
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
  });

  it('should handle drag and return when "canCellBeSelected" returns False', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValueOnce(true).mockReturnValueOnce(false);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub, 'getCellNodeBox').mockReturnValue({ right: 2, bottom: 3, left: 4, top: 5 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const onBeforeCellRangeSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const onCellRangeSpy = vi.spyOn(plugin.onCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const scrollSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');

    plugin.init(gridStub);
    const decoratorHideSpy = vi.spyOn(plugin.getCellDecorator(), 'hide');
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellRangeSpy).toHaveBeenCalled();
    expect(onCellRangeSpy).not.toHaveBeenCalled();
    expect(decoratorHideSpy).not.toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalledWith(
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3,
      },
      false
    );
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
    expect(scrollSpy).toHaveBeenCalledWith(5, 4);
    expect(onCellRangeSelectingSpy).not.toHaveBeenCalled();
  });

  it('should handle drag and cell range selection to be changed when "canCellBeSelected" returns True', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValueOnce(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub, 'getCellNodeBox').mockReturnValue({ right: 2, bottom: 3, left: 4, top: 5 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const onBeforeCellRangeSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const onCellRangeSpy = vi.spyOn(plugin.onCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const scrollSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');

    plugin.init(gridStub);
    const decoratorHideSpy = vi.spyOn(plugin.getCellDecorator(), 'hide');
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellRangeSpy).toHaveBeenCalled();
    expect(onCellRangeSpy).not.toHaveBeenCalled();
    expect(decoratorHideSpy).not.toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalledWith(
      {
        fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3,
      },
      false
    );
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } });
    expect(scrollSpy).toHaveBeenCalledWith(5, 4);
    expect(onCellRangeSelectingSpy).toHaveBeenCalledWith({
      range: {
        fromCell: 2,
        fromRow: 3,
        toCell: 4,
        toRow: 5,
      },
      allowAutoEdit: false,
      selectionMode: '',
    });
  });

  it('should handle drag and cell range selection to be changed and should call normalRangeOppositeCellFromCopy() when "canCellBeSelected" has a previous selected range', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const onCellRangeSelectedSpy = vi.spyOn(plugin.onCellRangeSelected, 'notify');

    plugin.init(gridStub);

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any, dragEventStart, gridStub);

    // dragEnd assigns to `_previousSelectedRange` var
    gridStub.onDragEnd.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 }, matchClassTag: 'dragReplaceHandle' }, grid: gridStub } as any,
      addVanillaEventPropagation(new Event('dragEnd')),
      gridStub
    );
    vi.advanceTimersByTime(7);

    // start dragging
    gridStub.onDragStart.notify(
      { offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any,
      addVanillaEventPropagation(new Event('dragStart')),
      gridStub
    );
    gridStub.onDragEnd.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 }, matchClassTag: 'dragReplaceHandle' }, grid: gridStub } as any,
      addVanillaEventPropagation(new Event('dragEnd')),
      gridStub
    );

    expect(onCellRangeSelectedSpy).toHaveBeenCalledWith({
      range: { fromCell: 2, fromRow: 3, toCell: 4, toRow: 5 },
      selectionMode: 'REP',
      allowAutoEdit: false,
    });
  });

  it('should handle drag and expect the decorator to NOT call the "show" method and return (pinned row) with canvas bottom right', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 0 });
    const onBeforeCellRangeSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    plugin.init(gridStub);
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    // expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellRangeSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).not.toHaveBeenCalledWith({
      fromCell: 2,
        fromRow: 3,
        toCell: 2,
        toRow: 3, // from handleDrag
    });
    // expect(decoratorShowSpy).toHaveBeenCalledWith({
    //   fromCell: 4, fromRow: 0, toCell: 4, toRow: 0, // from handleDragStart
    //   contains: expect.any(Function), toString: expect.any(Function), isSingleCell: expect.any(Function), isSingleRow: expect.any(Function),
    // });
  });

  it('should handle drag and expect the decorator to NOT call the "show" method and return (pinned column) with canvas top right', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-right';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 0 });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const onBeforeCellRangeSpy = vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    plugin.init(gridStub);
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(onBeforeCellRangeSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ fromCell: 2, fromRow: 3, toCell: 2, toRow: 3 }), false);
    expect(decoratorShowSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({ fromCell: 2, fromRow: 0, toCell: 4, toRow: 3 }), false);
  });

  it('should call onDrag and handle drag outside the viewport when drag is detected as outside the viewport', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(getTestHooks(plugin), 'getMouseOffsetViewport').mockReturnValue({
      e: new MouseEvent('dragstart'),
      dd: { startX: 5, startY: 15, range: { start: { row: 2, cell: 22 }, end: { row: 5, cell: 22 } }, matchClassTag: '' },
      viewport: { left: 23, top: 24, right: 25, bottom: 26, offset: { left: 27, top: 28, right: 29, bottom: 30 } },
      offset: { x: 0, y: 0 },
      isOutsideViewport: true,
    });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const getCellFromPointSpy = vi.spyOn(gridStub, 'getCellFromPoint');
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');
    const stopIntervalSpy = vi.spyOn(plugin, 'stopIntervalTimer');

    plugin.init(gridStub);
    (plugin as any)._options.minIntervalToShowNextCell = 5;
    (plugin as any)._options.maxIntervalToShowNextCell = 6;
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
    vi.advanceTimersByTime(7);
    expect(getCellFromPointSpy).not.toHaveBeenCalled();
    expect(onCellRangeSelectingSpy).not.toHaveBeenCalled();

    // calling dragEnd without a range should still call the stopIntervalTimer() which simulate auto-dragging outside the viewport
    const dragEventEnd = addVanillaEventPropagation(new Event('dragEnd'));
    gridStub.onDragEnd.notify({ startX: 3, startY: 4, grid: gridStub } as any, dragEventEnd, gridStub);
    expect(stopIntervalSpy).toHaveBeenCalled();
  });

  it('should call onDrag and handle drag outside the viewport and expect drag to be moved to a new position', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(getTestHooks(plugin), 'getMouseOffsetViewport').mockReturnValue({
      e: new MouseEvent('dragstart'),
      dd: { startX: 5, startY: 15, range: { start: { row: 2, cell: 22 }, end: { row: 5, cell: 22 } }, matchClassTag: '' },
      viewport: { left: 23, top: 24, right: 25, bottom: 26, offset: { left: 27, top: 28, right: 29, bottom: 30 } },
      offset: { x: 1, y: 1 },
      isOutsideViewport: true,
    });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const getCellFromPointSpy = vi.spyOn(gridStub, 'getCellFromPoint');
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');

    plugin.init(gridStub);
    (plugin as any)._options.minIntervalToShowNextCell = 5;
    (plugin as any)._options.maxIntervalToShowNextCell = 6;
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
    vi.advanceTimersByTime(7);
    expect(getCellFromPointSpy).toHaveBeenCalledWith(52.5, 13);

    expect(onCellRangeSelectingSpy).toHaveBeenCalledWith({
      allowAutoEdit: false,
      range: {
        fromCell: 4,
        fromRow: 2,
        toCell: 22,
        toRow: 5,
      },
      selectionMode: '',
    });
  });

  it('should call normalRangeOppositeCellFromCopy() when onDrag has a previous selected range', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');

    plugin.init(gridStub);

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any, dragEventStart, gridStub);

    // dragEnd assigns to `_previousSelectedRange` var
    gridStub.onDragEnd.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      addVanillaEventPropagation(new Event('dragEnd')),
      gridStub
    );

    // start dragging
    gridStub.onDragStart.notify(
      { offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle' } as any,
      addVanillaEventPropagation(new Event('dragStart')),
      gridStub
    );

    // then simulate a drag selection grow, will call `normalRangeOppositeCellFromCopy()`
    const dragToEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, matchClassTag: 'dragReplaceHandle', range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragToEvent,
      gridStub
    );

    expect(onCellRangeSelectingSpy).toHaveBeenCalledWith({
      range: { fromCell: 2, fromRow: 3, toCell: 4, toRow: 5 },
      selectionMode: '',
      allowAutoEdit: false,
    });
  });

  it('should call onDrag and handle drag outside the viewport with negative offset and expect drag to be moved to a new position', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValueOnce(true);
    vi.spyOn(getTestHooks(plugin), 'getMouseOffsetViewport').mockReturnValue({
      e: new MouseEvent('dragstart'),
      dd: { startX: 5, startY: 15, range: { start: { row: 2, cell: 22 }, end: { row: 5, cell: 22 } }, matchClassTag: '' },
      viewport: { left: 23, top: 24, right: 25, bottom: 26, offset: { left: 27, top: 28, right: 29, bottom: 30 } },
      offset: { x: -2, y: -4 },
      isOutsideViewport: true,
    });
    const focusSpy = vi.spyOn(gridStub, 'focus');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);
    const getCellFromPointSpy = vi.spyOn(gridStub, 'getCellFromPoint');
    const onCellRangeSelectingSpy = vi.spyOn(plugin.onCellRangeSelecting, 'notify');

    plugin.init(gridStub);
    (plugin as any)._options.minIntervalToShowNextCell = 5;
    (plugin as any)._options.maxIntervalToShowNextCell = 6;
    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const dragEventInit = addVanillaEventPropagation(new Event('dragInit'));
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: {} });
    vi.advanceTimersByTime(7);
    expect(getCellFromPointSpy).toHaveBeenCalledWith(3.5, 45);

    expect(onCellRangeSelectingSpy).toHaveBeenCalledWith({
      allowAutoEdit: false,
      range: {
        fromCell: 4,
        fromRow: 2,
        toCell: 22,
        toRow: 5,
      },
      selectionMode: '',
    });
  });

  it('should stop propagation when the editor is on the current cell', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 2, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub.getEditorLock(), 'isActive').mockReturnValue(true);
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const scrollSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ row: 3, cell: 2 });
    plugin.init(gridStub);

    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const initEvent = new Event('dragInit');
    const propagationSpy = vi.spyOn(initEvent, 'stopImmediatePropagation');
    const dragEventInit = addVanillaEventPropagation(initEvent);
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    Object.defineProperty(dragEvent, 'pageX', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(dragEvent, 'pageY', { writable: true, configurable: true, value: 0 });
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } });
    expect(scrollSpy).toHaveBeenCalledWith(5, 4);
    expect(propagationSpy).toHaveBeenCalled();
  });

  it('should stop propagation if the editor is not on the current cell', () => {
    const divCanvas = document.createElement('div');
    const divViewport = document.createElement('div');
    divViewport.className = 'slick-viewport';
    setViewportSize(divViewport);
    divCanvas.className = 'grid-canvas-bottom grid-canvas-left';
    divViewport.appendChild(divCanvas);
    vi.spyOn(gridStub, 'getActiveViewportNode').mockReturnValue(divViewport);
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divCanvas);
    vi.spyOn(gridStub, 'getDisplayedScrollbarDimensions').mockReturnValue({ height: 200, width: 155 });
    vi.spyOn(gridStub, 'getAbsoluteColumnMinWidth').mockReturnValue(47);
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 3, row: 3 });
    vi.spyOn(gridStub, 'canCellBeSelected').mockReturnValue(true);
    vi.spyOn(gridStub, 'getCellFromPoint').mockReturnValue({ cell: 4, row: 5 });
    vi.spyOn(gridStub.getEditorLock(), 'isActive').mockReturnValue(true);
    const focusSpy = vi.spyOn(gridStub, 'focus');
    const scrollSpy = vi.spyOn(gridStub, 'scrollCellIntoView');
    vi.spyOn(plugin.onBeforeCellRangeSelected, 'notify').mockReturnValue({
      getReturnValue: () => true,
    } as any);

    vi.spyOn(gridStub, 'getActiveCell').mockReturnValue({ row: 3, cell: 2 });
    plugin.init(gridStub);

    const decoratorShowSpy = vi.spyOn(plugin.getCellDecorator(), 'show');

    const scrollEvent = addVanillaEventPropagation(new Event('scroll'));
    gridStub.onScroll.notify({ scrollTop: 10, scrollLeft: 15, grid: gridStub } as any, scrollEvent, gridStub);

    const initEvent = new Event('dragInit');
    const propagationSpy = vi.spyOn(initEvent, 'stopImmediatePropagation');
    const dragEventInit = addVanillaEventPropagation(initEvent);
    gridStub.onDragInit.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventInit, gridStub);

    const dragEventStart = addVanillaEventPropagation(new Event('dragStart'));
    gridStub.onDragStart.notify({ offsetX: 6, offsetY: 7, row: 1, startX: 3, startY: 4 } as any, dragEventStart, gridStub);

    const dragEvent = addVanillaEventPropagation(new Event('drag'));
    Object.defineProperty(dragEvent, 'pageX', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(dragEvent, 'pageY', { writable: true, configurable: true, value: 0 });
    gridStub.onDrag.notify(
      { startX: 3, startY: 4, range: { start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } }, grid: gridStub } as any,
      dragEvent,
      gridStub
    );

    expect(focusSpy).toHaveBeenCalled();
    expect(decoratorShowSpy).toHaveBeenCalled();
    expect(plugin.getCurrentRange()).toEqual({ start: { cell: 2, row: 3 }, end: { cell: 4, row: 5 } });
    expect(scrollSpy).toHaveBeenCalledWith(5, 4);
    expect(propagationSpy).toHaveBeenCalled();
  });
});
