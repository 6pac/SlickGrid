import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GridOption, GridSize } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickResizer } from '../slick.resizer';

const gridUid = 'resizer-grid';

const grid = {
  autosizeColumns: vi.fn(),
  getContainerNode: vi.fn(),
  getOptions: vi.fn(),
  getPubSubService: vi.fn(),
  getUID: () => gridUid,
  resizeCanvas: vi.fn(),
} as unknown as SlickGrid;

describe('SlickResizer', () => {
  let resizer: SlickResizer;
  let page: HTMLDivElement;
  let gridElement: HTMLDivElement;
  let gridContainer: HTMLDivElement;
  let options: GridOption;
  let previousInnerHeight: number;
  let previousInnerWidth: number;

  beforeEach(() => {
    vi.clearAllMocks();
    previousInnerHeight = window.innerHeight;
    previousInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });

    page = document.createElement('div');
    Object.defineProperty(page, 'clientHeight', { configurable: true, value: 700 });
    Object.defineProperty(page, 'clientWidth', { configurable: true, value: 900 });
    gridContainer = document.createElement('div');
    gridContainerElementSetup();
    page.appendChild(gridContainer);
    document.body.appendChild(page);

    options = { enableAutoSizeColumns: false, autoHeight: false } as GridOption;
    vi.mocked(grid.getOptions).mockReturnValue(options);
    vi.mocked(grid.getContainerNode).mockReturnValue(gridElement);
    resizer = new SlickResizer({ container: page });
  });

  const gridContainerElementSetup = () => {
    gridElement = document.createElement('div');
    gridElement.className = gridUid;
    gridContainer.appendChild(gridElement);
  };

  afterEach(() => {
    resizer.destroy();
    document.body.innerHTML = '';
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: previousInnerHeight });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: previousInnerWidth });
  });

  it('exposes the Resizer plugin name and resize events', () => {
    expect(resizer.pluginName).toBe('Resizer');
    expect(resizer.onGridBeforeResize).toBeTruthy();
    expect(resizer.onGridAfterResize).toBeTruthy();
  });

  it('initializes against the grid and performs an initial resize', async () => {
    resizer.init(grid);
    await Promise.resolve();

    expect(grid.resizeCanvas).toHaveBeenCalled();
    expect(resizer.getLastResizeDimensions()).toEqual({ height: 780, width: 900 });
    expect(gridElement.style.height).toBe('780px');
    expect(gridElement.style.width).toBe('900px');
  });

  it('calculates size from the window, grid offset, and configured padding', () => {
    vi.spyOn(gridElement, 'getBoundingClientRect').mockReturnValue({
      top: 120,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    } as DOMRect);
    resizer = new SlickResizer({ container: page, bottomPadding: 30, rightPadding: 40 });
    resizer.init(grid);

    expect(resizer.calculateGridNewDimensions()).toEqual({ height: 650, width: 860 });
  });

  it('uses container dimensions when calculateAvailableSizeBy is set to container', () => {
    resizer = new SlickResizer({ container: page, calculateAvailableSizeBy: 'container', bottomPadding: 25, rightPadding: 15 });
    resizer.init(grid);

    expect(resizer.calculateGridNewDimensions()).toEqual({ height: 675, width: 885 });
  });

  it('applies the minimum and maximum height and width limits', () => {
    resizer = new SlickResizer({
      container: page,
      minHeight: 500,
      maxHeight: 600,
      minWidth: 500,
      maxWidth: 800,
    });
    resizer.init(grid);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 300 });
    Object.defineProperty(page, 'clientWidth', { configurable: true, value: 1000 });

    expect(resizer.calculateGridNewDimensions()).toEqual({ height: 500, width: 800 });
  });

  it('uses fixed dimensions supplied to the constructor', () => {
    resizer = new SlickResizer({ container: page }, { height: 330, width: 412 });
    resizer.init(grid);

    expect(resizer.calculateGridNewDimensions()).toEqual({ height: 330, width: 412 });
  });

  it('uses explicit dimensions passed to resizeGrid and fires the after-resize event', async () => {
    resizer.init(grid);
    const listener = vi.fn();
    resizer.onGridAfterResize.subscribe((_event: SlickEventData, args: { grid: SlickGrid; dimensions: GridSize }) => listener(args));

    const dimensions = await resizer.resizeGrid(0, { height: 420, width: 640 });

    expect(dimensions).toEqual({ height: 420, width: 640 });
    expect(resizer.getLastResizeDimensions()).toEqual(dimensions);
    expect(gridElement.style.height).toBe('420px');
    expect(gridElement.style.width).toBe('640px');
    expect(listener).toHaveBeenCalledWith({ grid, dimensions });
  });

  it('resizes the optional grid container with the grid width', async () => {
    resizer = new SlickResizer({ container: page, gridContainer });
    resizer.init(grid);

    await resizer.resizeGrid(0, { height: 400, width: 600 });

    expect(gridContainer.style.width).toBe('600px');
  });

  it('does not overwrite height when the grid uses autoHeight', async () => {
    options.autoHeight = true;
    resizer.init(grid);

    await resizer.resizeGrid(0, { height: 400, width: 600 });

    expect(gridElement.style.height).toBe('');
    expect(gridElement.style.width).toBe('600px');
  });

  it('calls autosizeColumns when enabled and the grid element is still in the document', async () => {
    options.enableAutoSizeColumns = true;
    resizer.init(grid);

    await resizer.resizeGrid(0, { height: 400, width: 600 });

    expect(grid.autosizeColumns).toHaveBeenCalled();
  });

  it('fires before and after resize events when the window is resized', async () => {
    resizer.init(grid);
    const beforeResize = vi.fn();
    const afterResize = vi.fn();
    resizer.onGridBeforeResize.subscribe((_event: SlickEventData, args: { grid: SlickGrid }) => beforeResize(args));
    resizer.onGridAfterResize.subscribe((_event: SlickEventData, args: { grid: SlickGrid; dimensions: GridSize }) => afterResize(args));

    window.dispatchEvent(new Event('resize'));
    await Promise.resolve();

    expect(beforeResize).toHaveBeenCalledWith({ grid });
    expect(afterResize).toHaveBeenCalledWith({ grid, dimensions: { height: 780, width: 900 } });
  });

  it('does not resize on window events while paused', () => {
    resizer.init(grid);
    const resize = vi.spyOn(resizer, 'resizeGrid');
    resizer.pauseResizer(true);

    window.dispatchEvent(new Event('resize'));

    expect(resize).not.toHaveBeenCalled();
  });

  it('unbinds the window resize listener when destroyed', () => {
    resizer.init(grid);
    const resize = vi.spyOn(resizer, 'resizeGrid');
    resizer.destroy();

    window.dispatchEvent(new Event('resize'));

    expect(resize).not.toHaveBeenCalled();
  });

  it('merges new options with the constructor options', () => {
    resizer.setOptions({ bottomPadding: 40, rightPadding: 12 });
    resizer.init(grid);

    expect(resizer.calculateGridNewDimensions()).toEqual({ height: 760, width: 888 });
  });

  it('schedules a delayed resize and resolves with the resulting dimensions', async () => {
    vi.useFakeTimers();
    resizer.init(grid);
    const resizePromise = resizer.resizeGrid(10, { height: 350, width: 500 });

    await vi.advanceTimersByTimeAsync(10);

    await expect(resizePromise).resolves.toEqual({ height: 350, width: 500 });
    vi.useRealTimers();
  });
});
