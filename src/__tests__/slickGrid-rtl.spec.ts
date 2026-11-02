import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption } from '../models';
import { SlickGrid } from '../slick.grid';
import { SlickEventData } from '../slick.core';

vi.useFakeTimers();

const DEFAULT_GRID_HEIGHT = 600;
const DEFAULT_GRID_WIDTH = 800;
const gridId = 'grid1';
const gridUid = 'slickgrid_124343';
const containerId = 'demo-container';

const template = `<div id="${containerId}" style="height: ${DEFAULT_GRID_HEIGHT}px; width: ${DEFAULT_GRID_WIDTH}px; overflow: hidden; display: block;">
    <div id="slickGridContainer-${gridId}" class="grid-pane" style="width: 100%;">
      <div id="${gridId}" class="${gridUid}" style="width: 100%"></div>
    </div>
  </div>`;

describe('SlickGrid RTL (Right-to-Left)', () => {
  let container: HTMLElement;
  let grid: SlickGrid<any, Column>;
  const items = [
    { id: 0, name: 'Item 0', value: 10 },
    { id: 1, name: 'Item 1', value: 20 },
    { id: 2, name: 'Item 2', value: 30 },
  ];
  const columns = [
    { id: 'id', field: 'id', name: 'ID', width: 60, resizable: true },
    { id: 'name', field: 'name', name: 'Name', width: 100, resizable: true },
    { id: 'value', field: 'value', name: 'Value', width: 80, resizable: true },
  ] as Column[];
  let defaultOptions: GridOption;

  beforeEach(() => {
    defaultOptions = {
      enableCellNavigation: true,
      columnResizingDelay: 1,
      scrollRenderThrottling: 1,
      errorCallback: vi.fn(),
    };
    container = document.createElement('div');
    container.id = gridId;
    container.innerHTML = template;
    container.style.height = `${DEFAULT_GRID_HEIGHT}px`;
    container.style.width = `${DEFAULT_GRID_WIDTH}px`;
    document.body.appendChild(container);
    Object.defineProperty(container, 'height', { writable: true, configurable: true, value: DEFAULT_GRID_HEIGHT });
    Object.defineProperty(container, 'clientHeight', { writable: true, configurable: true, value: DEFAULT_GRID_HEIGHT });
    Object.defineProperty(container, 'clientWidth', { writable: true, configurable: true, value: DEFAULT_GRID_WIDTH });
  });

  afterEach(() => {
    document.body.textContent = '';
    grid?.destroy(true);
  });

  describe('RTL Option', () => {
    it('should have rtl option set to false by default', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, defaultOptions);
      expect(grid.getOptions().rtl).toBe(false);
    });

    it('should ignore a change from LTR to RTL after grid creation', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, defaultOptions);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      grid.setOptions({ rtl: true, enableCellNavigation: false });

      expect(grid.getOptions().rtl).toBe(false);
      expect(grid.getOptions().enableCellNavigation).toBe(false);
      expect(gridContainer.classList.contains('slick-rtl')).toBe(false);
      expect(gridContainer.getAttribute('dir')).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('[SlickGrid] the "rtl" option is only applied when the grid is created; the change was ignored.');
      warnSpy.mockRestore();
    });

    it('should ignore a change from RTL to LTR after grid creation', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      grid.setOptions({ rtl: false });

      expect(grid.getOptions().rtl).toBe(true);
      expect(gridContainer.classList.contains('slick-rtl')).toBe(true);
      expect(gridContainer.getAttribute('dir')).toBe('rtl');
      expect(warnSpy).toHaveBeenCalledWith('[SlickGrid] the "rtl" option is only applied when the grid is created; the change was ignored.');
      warnSpy.mockRestore();
    });

    it('should enable RTL mode when rtl option is set to true', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });
      expect(grid.getOptions().rtl).toBe(true);
    });

    it('should apply RTL class and dir attribute on grid container', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });

      expect(gridContainer.classList.contains('slick-rtl')).toBe(true);
      expect(gridContainer.getAttribute('dir')).toBe('rtl');
    });

    it('should not apply RTL class or dir in LTR mode', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: false });

      expect(gridContainer.classList.contains('slick-rtl')).toBe(false);
      expect(gridContainer.getAttribute('dir')).toBeNull();
    });
  });

  describe('Visible Range in RTL', () => {
    it('should calculate leftPx/rightPx with RTL negative scrollLeft convention', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });

      const anyGrid = grid as any;
      anyGrid.canvasWidth = 2000;
      anyGrid.viewportW = 800;

      const range = grid.getVisibleRange(0, -200);

      expect(range.leftPx).toBe(600);
      expect(range.rightPx).toBe(1400);
      expect(range.rightPx).toBeGreaterThan(range.leftPx);
    });
  });

  describe('Column Resizing in RTL', () => {
    it('should handle RTL mode with resizable columns', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true, editable: true });
      expect(grid.getOptions().rtl).toBe(true);
    });
  });

  describe('applyColumnWidths with RTL', () => {
    it('should apply column widths in RTL mode', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });
      expect(grid.getOptions().rtl).toBe(true);
    });

    it('should apply column widths in LTR mode', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: false });
      expect(grid.getOptions().rtl).toBe(false);
    });
  });

  describe('Resize constraints with RTL', () => {
    it('should calculate resize constraints correctly in RTL mode', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true, editable: true });
      expect(grid.getOptions().rtl).toBe(true);
    });

    it('should calculate resize constraints correctly in LTR mode', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: false, editable: true });
      expect(grid.getOptions().rtl).toBe(false);
    });
  });

  describe('Mixed RTL Features', () => {
    it('should support RTL with pinned columns', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true, pinning: { columns: { left: 0 } } });
      expect(grid.getOptions().rtl).toBe(true);
      expect(grid.getOptions().pinning?.columns?.left).toBe(0);
    });

    it('should support RTL with sorting', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });
      expect(grid.getOptions().rtl).toBe(true);
    });

    it('should support RTL with filtering', () => {
      const gridContainer = document.getElementById(gridId) as HTMLElement;
      grid = new SlickGrid<any, Column>(gridContainer, items, columns, { ...defaultOptions, rtl: true });
      expect(grid.getOptions().rtl).toBe(true);
    });
  });

  describe('Column Resizing', () => {
    const columns = [
      { id: 'id', field: 'id', name: 'Id', hidden: true },
      { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true, width: 77, previousWidth: 20, rerenderOnResize: true },
      { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true, minWidth: 35, maxWidth: 78 },
      { id: 'age', field: 'age', name: 'Age', sortable: true, minWidth: 82, width: 86, maxWidth: 88 },
      { id: 'gender', field: 'gender', name: 'Gender', sortable: true },
    ] as Column[];
    const data = [
      { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
      { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
    ];

    it('should resize 2nd column that has a "width" defined using default sizing grid options', () => {
      grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false, rtl: true });
      grid.init();

      const sedOnBeforeResize = new SlickEventData();
      sedOnBeforeResize.addReturnValue(true);
      vi.spyOn(grid.onBeforeColumnsResize, 'notify').mockReturnValue(sedOnBeforeResize);
      const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
      const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
      const columnElms = container.querySelectorAll('.slick-header-column');
      const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

      const cMouseDownEvent = new CustomEvent('mousedown');
      const bodyMouseMoveEvent = new CustomEvent('mousemove');
      const bodyMouseUpEvent = new CustomEvent('mouseup');
      Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
      Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 9 });
      Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
      Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: -22 });
      Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

      // start resizing
      resizeHandleElm.dispatchEvent(cMouseDownEvent);
      container.dispatchEvent(cMouseDownEvent);
      document.body.dispatchEvent(bodyMouseMoveEvent);
      expect(columnElms[1].classList.contains('slick-header-column-active')).toBeTruthy();
      expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[1], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

      // header click won't get through
      const onHeaderClickSpy = vi.spyOn(grid.onHeaderClick, 'notify');
      container.querySelector('.slick-header')!.dispatchEvent(new CustomEvent('click'));
      expect(onHeaderClickSpy).not.toHaveBeenCalled();

      // end resizing
      document.body.dispatchEvent(bodyMouseUpEvent);

      vi.advanceTimersByTime(10);

      expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
      expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
      expect(columns[0].width).toBe(80);
      expect(columns[1].width).toBe(0);
      expect(columns[2].width).toBe(65);
      expect(columns[3].width).toBe(86);
      expect(columns[4].width).toBe(80);
    });

    it('should not schedule resize auto-scroll timer in RTL when dragging outside viewport', () => {
      grid = new SlickGrid<any, Column>(container, data, columns, {
        ...defaultOptions,
        forceFitColumns: false,
        rtl: true,
        autoScrollOnColumnResize: true,
      });
      grid.init();

      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
      const columnElms = container.querySelectorAll('.slick-header-column');
      const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

      const cMouseDownEvent = new CustomEvent('mousedown');
      const bodyMouseMoveEvent = new CustomEvent('mousemove');
      Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
      Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 9 });
      Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
      // Simulate dragging outside the viewport edge.
      Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: -200 });
      Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });
      Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 0 });

      resizeHandleElm.dispatchEvent(cMouseDownEvent);
      container.dispatchEvent(cMouseDownEvent);
      document.body.dispatchEvent(bodyMouseMoveEvent);
      vi.advanceTimersByTime(120);

      expect(setIntervalSpy).not.toHaveBeenCalled();
      expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();
      setIntervalSpy.mockRestore();
    });
  });
});
