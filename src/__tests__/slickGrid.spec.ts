import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import type { Column, CustomDataView, EditCommand, Editor, FormatterResultWithHtml, FormatterResultWithText, GridOption, SelectionModel } from '../models';
import { SlickGrid } from '../slick.grid';
import { SlickDataView } from '../slick.dataview';
import { CheckboxEditor, LongTextEditor, TextEditor as InputEditor } from '../slick.editors';
import { SlickEvent, SlickEventData, SlickGlobalEditorLock, SlickRange, Utils } from '../slick.core';
import type { BasePubSub } from '../slick.core';
import { SlickHybridSelectionModel } from '../plugins/slick.hybridselectionmodel';

// Subclass for protected method coverage
class TestGrid extends SlickGrid<any, Column> {
  public callRecalculateHeaderHeightWithoutLeftHeader() {
    const headerScrollerL = this._headerScrollerL;
    (this as any)._headerScrollerL = undefined;
    this.recalculateHeaderHeight();
    this._headerScrollerL = headerScrollerL;
  }
  public callRecalculateHeaderHeight() {
    this.recalculateHeaderHeight();
  }
  public callGetFormatter(row: number, column: Column) {
    return this.getFormatter(row, column);
  }
  public callRowsToRanges(rows: number[], compactRows = false) {
    return this.rowsToRanges(rows, compactRows);
  }
  public callAppendSelectedCellHtml(row: number, cell: number) {
    const divRow = document.createElement('div');
    this.selectedRanges = [new SlickRange(row, cell)];
    this.appendCellHtml(divRow, row, cell, 1, 1, null, this.getDataItem(row));
    return divRow.firstElementChild as HTMLDivElement;
  }
  public setCurrentEditorNull() {
    (this as any).currentEditor = null;
  }
  public callActionThrottle(action: () => void, minPeriodMs: number) {
    return this.actionThrottle(action, minPeriodMs);
  }
  public callForwardDockingHorizontalScroll(source: HTMLElement | null | undefined) {
    return this.forwardDockingHorizontalScroll(source);
  }
}

vi.mock('../../formatters/formatterUtilities.js');
vi.useFakeTimers();

const pubSubServiceStub = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  unsubscribeAll: vi.fn(),
} as BasePubSub;

class SlickCellSelectionModelMock {
  pluginName = 'CellSelectionModel';
  onSelectedRangesChanged = new SlickEvent<SlickRange[]>('onSelectedRangesChanged');
  getOptions() { return {}; }
  constructor() {}
  init() {}
  destroy() {}
}

const DEFAULT_COLUMN_HEIGHT = 25;
const DEFAULT_COLUMN_WIDTH = 80;
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

describe('SlickGrid core file', () => {
  let container: HTMLElement;
  let grid: SlickGrid;
  let defaultOptions: GridOption;
  let skipGridDestroy = false;

  beforeEach(() => {
    SlickGlobalEditorLock.cancelCurrentEdit();
    defaultOptions = {
      enableCellNavigation: true,
      columnResizingDelay: 1,
      scrollRenderThrottling: 1,
      asyncEditorLoadDelay: 1,
      asyncPostRenderDelay: 1,
      asyncPostRenderCleanupDelay: 2,
      errorCallback: vi.fn(),
    };
    container = document.createElement('div');
    container.id = 'myGrid';
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
    if (!skipGridDestroy) {
      grid?.destroy(true);
    }
    skipGridDestroy = false;
    vi.restoreAllMocks();
  });

  it('should be able to instantiate SlickGrid without DataView', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual([]);
    expect(grid.getCanvases()).toBeTruthy();
    expect(grid.getCanvasNode()).toBeTruthy();
    expect(grid.getActiveCanvasNode()).toBeTruthy();
    expect(grid.getContainerNode()).toEqual(container);
    expect(grid.getGridPosition()).toBeTruthy();
  });

  it('should be able to instantiate SlickGrid without DataView and always show vertical scroll', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, { ...defaultOptions, alwaysShowVerticalScroll: true });
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual([]);
    expect(grid.getCanvases()).toBeTruthy();
    expect(grid.getCanvasNode()).toBeTruthy();
    expect(grid.getActiveCanvasNode()).toBeTruthy();
    expect(grid.getContainerNode()).toEqual(container);
    expect(grid.getGridPosition()).toBeTruthy();
  });

  it('should keep the viewport as the horizontal scroll element when docking is not configured', () => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name', width: 300 },
      { id: 'lastName', field: 'lastName', name: 'Last Name', width: 300 },
      { id: 'age', field: 'age', name: 'Age', width: 300 },
    ] as Column[];
    grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John', lastName: 'Doe', age: 30 }], columns, defaultOptions);

    const viewport = container.querySelector('.slick-viewport-top.slick-viewport-left');

    expect(viewport).toBeTruthy();
    expect((grid as any)._viewportScrollContainerX).toBe(viewport);
    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeNull();
    expect(viewport?.classList.contains('slick-horizontal-scroller')).toBe(true);
    expect(viewport?.classList.contains('slick-vertical-scroller')).toBe(true);
  });

  it('should ignore non-cell row-detail siblings when rebuilding the row cell cache', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John' }], columns, defaultOptions);

    const rowNode = document.createElement('div');
    rowNode.className = 'slick-row';
    const cellNode = Utils.createDomElement('div', { className: 'slick-cell l0 r0' });
    const detailNode = Utils.createDomElement('div', { className: 'slick-row-detail-container row-detail-32' });
    rowNode.append(cellNode, detailNode);

    const cacheEntry = {
      rowNode: [rowNode],
      cellRenderQueue: [0],
      cellNodesByColumnIdx: {},
    };
    (grid as any).rowsCache[0] = cacheEntry;

    expect(() => (grid as any).ensureCellNodesInRowsCache(0)).not.toThrow();
    expect(cacheEntry.cellNodesByColumnIdx).toEqual({ 0: cellNode });
    expect(cacheEntry.cellRenderQueue).toHaveLength(0);
  });

  it('should handle ancestor scrolling after the grid container is moved', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const oldScrollContainer = document.createElement('div');
    const newScrollContainer = document.createElement('div');
    document.body.append(oldScrollContainer, newScrollContainer);
    oldScrollContainer.appendChild(container);

    grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'Avery' }], columns, defaultOptions);
    grid.init();
    grid.setActiveCell(0, 0);
    const positionChangedSpy = vi.spyOn(grid.onActiveCellPositionChanged, 'notify');

    oldScrollContainer.dispatchEvent(new Event('scroll', { bubbles: false }));
    expect(positionChangedSpy).toHaveBeenCalledTimes(1);

    positionChangedSpy.mockClear();
    newScrollContainer.appendChild(container);
    oldScrollContainer.dispatchEvent(new Event('scroll', { bubbles: false }));
    newScrollContainer.dispatchEvent(new Event('scroll', { bubbles: false }));

    expect(positionChangedSpy).toHaveBeenCalledTimes(1);
  });

  it('should not forward a zero horizontal scroll offset from a docking source', () => {
    const dockingColumns = [
      { id: 'firstName', field: 'firstName', name: 'First Name', width: 300 },
      { id: 'lastName', field: 'lastName', name: 'Last Name', width: 300 },
    ] as Column[];
    grid = new TestGrid(container, [{ id: 0, firstName: 'John', lastName: 'Doe' }], dockingColumns, {
      ...defaultOptions,
      pinning: { columns: { left: 0 } },
    });
    grid.init();

    const source = (grid as any)._headerScrollerL as HTMLElement;
    expect((grid as TestGrid).callForwardDockingHorizontalScroll(source)).toBe(false);
  });

  it('should queue throttled actions and clear the throttle after the queued action completes', () => {
    grid = new TestGrid(container, [], [{ id: 'firstName', field: 'firstName', name: 'First Name' }], defaultOptions);
    const action = vi.fn();
    const throttled = (grid as TestGrid).callActionThrottle(action, 10);

    throttled.enqueue();
    throttled.enqueue();
    expect(action).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(action).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(10);
    throttled.enqueue();
    expect(action).toHaveBeenCalledTimes(3);
  });

  describe('large vertical scroll jumps', () => {
    it.each([
      [0, 10],
      [10, 0],
      [10, 25],
    ])('should replace a pending %i ms throttle with a %i ms throttle', (initialPeriod, newPeriod) => {
      grid = new SlickGrid<any, Column>(container, [], [], { ...defaultOptions, scrollRenderThrottling: initialPeriod });
      const renderSpy = vi.spyOn(grid, 'render');
      const oldThrottle = (grid as any).scrollThrottle;
      oldThrottle.enqueue();
      oldThrottle.enqueue();
      grid.setOptions({ scrollRenderThrottling: newPeriod });
      renderSpy.mockClear();

      const throttle = (grid as any).scrollThrottle;
      expect(throttle).not.toBe(oldThrottle);
      throttle.enqueue();
      throttle.enqueue();
      expect(renderSpy).toHaveBeenCalledTimes(1);
      if (newPeriod > 0) {
        vi.advanceTimersByTime(newPeriod - 1);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1);
      } else {
        vi.advanceTimersByTime(0);
      }
      expect(renderSpy).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(50);
      expect(renderSpy).toHaveBeenCalledTimes(2);

      grid.setOptions({ scrollRenderThrottling: newPeriod });
      expect((grid as any).scrollThrottle).toBe(throttle);
    });

    const jumpScroll = (scrollRenderThrottling?: number) => {
      const items = Array.from({ length: 50000 }, (_, id) => ({ id, firstName: `Name ${id}` }));
      const options = { ...defaultOptions, scrollRenderThrottling };
      grid = new SlickGrid<any, Column>(container, items, [{ id: 'firstName', field: 'firstName', name: 'First Name' }], options);
      const viewport = container.querySelector('.slick-viewport') as HTMLDivElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 50000 * DEFAULT_COLUMN_HEIGHT });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 500 });
      (grid as any).viewportH = 500;
      const renderSpy = vi.spyOn(grid, 'render');
      const enqueueSpy = vi.spyOn((grid as any).scrollThrottle, 'enqueue');
      [100000, 300000].forEach((scrollTop) => {
        viewport.scrollTop = scrollTop;
        viewport.dispatchEvent(new Event('scroll'));
      });
      return { renderSpy, enqueueSpy };
    };

    it('should render every large jump synchronously by default', () => {
      const { renderSpy, enqueueSpy } = jumpScroll();
      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(enqueueSpy).not.toHaveBeenCalled();
    });

    it('should throttle large jumps when "scrollRenderThrottling" is greater than 0', () => {
      const { renderSpy, enqueueSpy } = jumpScroll(10);
      expect(renderSpy).not.toHaveBeenCalled();
      expect(enqueueSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('should be able to instantiate SlickGrid with an external PubSub Service', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions, pubSubServiceStub);
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual([]);
    expect(grid.getPubSubService()).toEqual(pubSubServiceStub);
  });

  it('should not display a console warning when body zoom level is different than 100% in low-risk config', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockReturnValue();

    document.body.style.zoom = '90%';
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions, pubSubServiceStub);
    grid.init();

    expect(grid).toBeTruthy();
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('[Slickgrid] Zoom level other than 100%'));
  });

  it('should not display a console warning when body zoom level is 100%', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockReturnValue();

    document.body.style.zoom = '100%';
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions, pubSubServiceStub);
    grid.init();

    expect(grid).toBeTruthy();
    expect(consoleWarnSpy).not.toHaveBeenCalledWith('[Slickgrid] Zoom level other than 100% is not supported');
  });

  it('should not display a console warning when body zoom is not defined', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockReturnValue();

    document.body.style.zoom = '';
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions, pubSubServiceStub);
    grid.init();

    expect(grid).toBeTruthy();
    expect(consoleWarnSpy).not.toHaveBeenCalledWith('[Slickgrid] Zoom level other than 100% is not supported');
  });

  it('should be able to set a nonce in grid option and expect it to be applied to the style element', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, { ...defaultOptions, alwaysShowVerticalScroll: true, nonce: 'test-nonce' });
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual([]);

    const styleElm = document.head.querySelector('style') as HTMLStyleElement | null;
    expect(styleElm).toBeTruthy();
    expect(styleElm?.nonce).toBe('test-nonce');
    expect(styleElm?.getAttribute('nonce')).toBe('test-nonce');
  });

  it.each([false, true])('should keep RowSpan hosts and covered rows in the same stacking context (pinned=%s)', (pinned) => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name' },
      { id: 'lastName', field: 'lastName', name: 'Last Name' },
    ] as Column[];
    const data = [
      { id: 0, firstName: 'Jane', lastName: 'Doe' },
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Alice', lastName: 'Jones' },
    ];
    const dataView = new SlickDataView({
      globalItemMetadataProvider: { getRowMetadata: (_item, row) => (row === 0 ? { columns: { 1: { rowspan: 2 } } } : undefined) },
    });
    dataView.setItems(data);
    grid = new SlickGrid<any, Column>(
      '#myGrid',
      dataView,
      columns,
      { ...defaultOptions, enableCellRowSpan: true, pinning: pinned ? { columns: { left: 0 } } : undefined },
      pubSubServiceStub
    );
    grid.init();

    const spanRow = container.querySelector<HTMLElement>('.slick-row[data-row="0"]')!;
    const coveredRow = container.querySelector<HTMLElement>('.slick-row[data-row="1"]')!;
    const regularRow = container.querySelector<HTMLElement>('.slick-row[data-row="2"]')!;
    expect(spanRow.style.top).toBe('0px');
    expect(spanRow.style.transform).toBe('');
    expect(spanRow.classList).toContain('slick-rowspan');
    expect(coveredRow.style.top).toBe(`${grid.getOptions().rowHeight}px`);
    expect(coveredRow.style.transform).toBe('');
    expect(coveredRow.classList).toContain('slick-rowspan');
    expect(regularRow.style.top).toBe('');
    expect(regularRow.style.transform).toBe(`translateY(${grid.getOptions().rowHeight! * 2}px)`);
    expect(regularRow.classList).not.toContain('slick-rowspan');
    const spanCell = spanRow.querySelector<HTMLElement>('.slick-cell.rowspan')!;
    expect(spanCell).toBeTruthy();
    expect(grid.getCellFromEvent({ target: spanCell } as unknown as Event)).toEqual({ row: 0, cell: 1 });
  });

  it('should be able to instantiate SlickGrid and get columns', () => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name', headerCssClass: 'header-class', headerCellAttrs: { 'some-attr': 3 } },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');

    expect(grid).toBeTruthy();
    expect(colHeaderElms.length).toBe(1);
    expect(colHeaderElms[0].classList.contains('header-class')).toBeTruthy();
    expect(colHeaderElms[0].getAttribute('some-attr')).toBe('3');
    expect(grid.getOptions().addNewRowCssClass).toBe('new-class');
    expect(grid.getData()).toEqual([]);
    expect(grid.getColumns()).toEqual(columns);
    expect(grid.getColumnIndex('firstName')).toBe(0);
    expect(grid.getColumnById('firstName')).toEqual(columns[0]);
    expect(grid.getColumnById('unknown')).toBeNull();
    expect(grid.getColumnByIndex(0)).toEqual(container.querySelector('div.slick-header-column[data-id="firstName"]'));

    const columnsMock = [
      { id: 'firstName', field: 'firstName', name: 'First Name' },
      { id: 'lastName', field: 'lastName', name: 'Last Name' },
      { id: 'age', field: 'age', name: 'Age' },
    ] as Column[];
    grid.setColumns(columnsMock);

    expect(grid.getColumns()).toEqual(columnsMock);
    expect(grid.getColumnIndex('age')).toBe(2);
    expect(grid.getColumnIndex('invalid')).toBeUndefined();
    expect(grid.getColumnByIndex(-1)).toEqual(undefined);
    expect(grid.getColumnByIndex(99)).toEqual(undefined);
  });

  it('should be able to update column properties by its id', () => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name', headerCssClass: 'header-class', headerCellAttrs: { 'some-attr': 3 } },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    const updateColumnSpy = vi.spyOn(grid, 'updateColumns');

    expect(grid).toBeTruthy();
    expect(grid.getColumnById('firstName')).toEqual(columns[0]);
    expect(grid.getColumnById('unknown')).toBeNull();

    grid.updateColumnById('firstName', { hidden: true, width: 222 });

    expect(grid.getColumnById('firstName')).toEqual({ ...columns[0], hidden: true, width: 222 });
    expect(updateColumnSpy).not.toHaveBeenCalled();

    grid.updateColumnById('firstName', { hidden: false, width: 333 }, true);

    expect(grid.getColumnById('firstName')).toEqual({ ...columns[0], hidden: false, width: 333 });
    expect(updateColumnSpy).toHaveBeenCalled();
  });

  it('should treat inherited property names as ordinary column IDs', () => {
    const specialColumns = [
      { id: '__proto__', field: 'proto', name: 'Proto' },
      { id: 'constructor', field: 'ctor', name: 'Constructor' },
      { id: 'toString', field: 'string', name: 'To String' },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], specialColumns, defaultOptions);
    grid.init();

    expect(grid.getColumnIndex('__proto__')).toBe(0);
    expect(grid.getColumnIndex('constructor')).toBe(1);
    expect(grid.getColumnIndex('toString')).toBe(2);
    expect(grid.getColumnById('__proto__')).toBe(specialColumns[0]);
    expect(grid.getColumnById('constructor')).toBe(specialColumns[1]);
    expect(grid.getColumnById('toString')).toBe(specialColumns[2]);
    expect(Object.getPrototypeOf((grid as any).columnsById)).toBeNull();
    expect(Object.getPrototypeOf((grid as any).visibleColumnsById)).toBeNull();
  });

  it('should call setColumns() and wait a cycle before updating the column headers', async () => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name', headerCssClass: 'header-class', headerCellAttrs: { 'some-attr': 3 } },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');
    const onAfterSetColumnsSpy = vi.spyOn(grid.onAfterSetColumns, 'notify');

    expect(grid).toBeTruthy();
    expect(colHeaderElms.length).toBe(1);
    expect(grid.getColumns()).toEqual(columns);

    const columnsMock = [
      { id: 'firstName', field: 'firstName', name: 'First Name' },
      { id: 'lastName', field: 'lastName', name: 'Last Name' },
      { id: 'age', field: 'age', name: 'Age' },
    ] as Column[];
    grid.setColumns(columnsMock, true);
    await Promise.resolve();

    expect(grid.getColumns()).toEqual(columnsMock);
    expect(onAfterSetColumnsSpy).toHaveBeenCalled();
  });

  it('should be able to instantiate SlickGrid and set headerCssClass and expect it in column header', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', headerCssClass: 'header-class  other-class' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');

    expect(colHeaderElms.length).toBe(1);
    expect(colHeaderElms[0].classList.contains('header-class')).toBeTruthy();
  });

  it('should be able to instantiate SlickGrid and set headerCellAttrs and expect it in column header', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', headerCellAttrs: { 'some-attr': 3 } }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');

    expect(colHeaderElms.length).toBe(1);
    expect(colHeaderElms[0].getAttribute('some-attr')).toBe('3');
  });

  it('should expect "slick-header-sortable" when column is sortable', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', sortable: true }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, { ...defaultOptions, enableColumnReorder: () => true });
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');

    expect(colHeaderElms.length).toBe(1);
    expect(colHeaderElms[0].classList.contains('slick-header-sortable')).toBeTruthy();
  });

  it('should expect "slick-header-sortable" when column is sortable', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', sortable: true }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();
    grid.setOptions({ addNewRowCssClass: 'new-class' });
    const colHeaderElms = container.querySelectorAll('.slick-header-columns .slick-header-column');

    expect(colHeaderElms.length).toBe(1);
    expect(colHeaderElms[0].classList.contains('slick-header-sortable')).toBeTruthy();
  });

  it('should be able to instantiate SlickGrid without data and later add data with "setData()"', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual([]);

    const scrollToSpy = vi.spyOn(grid, 'scrollTo');
    grid.setData(
      [
        { id: 0, firstName: 'John' },
        { id: 1, firstName: 'Jane' },
      ],
      true
    );

    expect(grid.getDataLength()).toBe(2);
    expect(scrollToSpy).toHaveBeenCalledWith(0);
  });

  it('should be able to instantiate SlickGrid without DataView', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    const dim = grid.getScrollbarDimensions();
    const dim2 = grid.getDisplayedScrollbarDimensions();

    expect(grid).toBeTruthy();
    expect(dim).toEqual({ height: 0, width: 0 });
    expect(dim2).toEqual({ height: 0, width: 0 });
  });

  it('should be able to instantiate SlickGrid and invalidate some rows', () => {
    const columns = [
      {
        id: 'firstName',
        field: 'firstName',
        name: 'First Name',
        alwaysRenderColumn: true,
        cellAttrs: { 'cell-attr': 22 },
        formatter: (r, c, val) => ({
          text: val,
          addClasses: 'text-bold',
          toolTip: 'cell tooltip',
          insertElementAfterTarget: container.querySelector('.slick-header') as HTMLDivElement,
        }),
      },
    ] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
    const invalidSpy = vi.spyOn(grid, 'invalidateAllRows');
    const renderSpy = vi.spyOn(grid, 'render');
    const updateSpy = vi.spyOn(grid, 'updateRowCount');

    grid.setData(data);
    grid.invalidate();
    const cellElms = container.querySelectorAll('.slick-cell.l0.r0');

    expect(cellElms[0].getAttribute('cell-attr')).toBe('22');
    expect(cellElms[0].getAttribute('title')).toBe('cell tooltip');
    expect(cellElms[0].classList.contains('text-bold')).toBeTruthy();
    expect(invalidSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalled();
  });

  it('should be able to disable column reorderable', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', reorderable: false }] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
    const headerElms = container.querySelectorAll('.slick-header-column');

    expect(headerElms[0].classList.contains('unorderable')).toBeTruthy();
  });

  it('should be able to edit when editable grid option is enabled and invalidate some rows', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', editor: InputEditor }] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>('#myGrid', [], columns, {
      ...defaultOptions,
      editable: true,
      enableAsyncPostRenderCleanup: true,
      asyncPostRenderCleanupDelay: 0,
    });
    grid.setData(data);
    grid.render();
    grid.setActiveCell(0, 0);
    grid.editActiveCell(undefined, true);
    expect(grid.getCellEditor()).toBeTruthy();

    const onBeforeSpy = vi.spyOn(grid.onBeforeCellEditorDestroy, 'notify');
    grid.invalidateAllRows();

    expect(onBeforeSpy).toHaveBeenCalled();
  });

  it('should be able to edit when editable grid option is enabled and invalidate all rows', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', editor: InputEditor }] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>('#myGrid', [], columns, { ...defaultOptions, editable: true });
    grid.setData(data);
    grid.render();
    grid.setActiveCell(0, 0);
    grid.editActiveCell(InputEditor as any, true);

    const onBeforeSpy = vi.spyOn(grid.onBeforeCellEditorDestroy, 'notify');
    grid.invalidateRows([0, 1]);

    expect(onBeforeSpy).toHaveBeenCalled();
  });

  it('should be add rowspan metadata, invalidate all rowspan and expect cells/rows intersect', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', editor: InputEditor }] as Column[];
    const metadata: any = {
      0: { columns: { 0: { colspan: 2, rowspan: 2 } } },
    };
    const customDV = { getItemMetadata: (row: number) => metadata[row], getLength: () => 2, getItem: () => undefined } as unknown as CustomDataView;
    grid = new SlickGrid<any, Column>('#myGrid', customDV, columns, { ...defaultOptions, editable: true, enableCellRowSpan: true, spreadHiddenColspan: true });
    grid.setActiveCell(0, 0);
    grid.editActiveCell(InputEditor as any, true);

    vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1);
    vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(3).mockReturnValueOnce(3);
    vi.spyOn(grid, 'getRowSpanColumnIntersects').mockReturnValueOnce([0, 3]);
    vi.spyOn(grid, 'getParentRowSpanByCell').mockReturnValueOnce({ start: 0, end: 3, range: '0:3' });
    grid.remapAllColumnsRowSpan();
    grid.invalidateRows([0, 1]);

    expect(grid.getRowSpanIntersect(0)).toBe(1);
    expect(grid.getRowSpanColumnIntersects(0)).toEqual([0, 3]);
    expect(grid.canCellBeActive(0, 0)).toBe(true);
    expect(grid.canCellBeActive(1, 0)).toBe(false);

    customDV.getLength = () => 0;
    const resetActiveCellSpy = vi.spyOn(grid, 'resetActiveCell');
    grid.invalidateRow(0);
    grid.updateRowCount();
    expect(resetActiveCellSpy).toHaveBeenCalled();

    grid.invalidateRows([0, 1, 2]);
    grid.render();
    expect(grid.getParentRowSpanByCell(1, 1)).toEqual({ end: 1, range: '0:1', start: 0 });

    const pr = grid.findSpanStartingCell(0, 2);
    grid.setActiveCell(0, 0);
    grid.navigateRowStart();
    expect(pr).toEqual({ cell: 2, row: 0 });
  });

  it('should throw when trying to edit cell when editable grid option is disabled', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.setData(data);
    grid.setActiveRow(0, 0);
    grid.setActiveCell(0, 0);
    expect(() => grid.editActiveCell(new InputEditor({ container: document.createElement('div'), column: columns[0], grid } as any), true)).toThrow(
      'SlickGrid makeActiveCellEditable : should never get called when grid options.editable is false'
    );
    grid.invalidateRows([0, 1]);
  });

  it('should return void when calling invalidateRows without valid arguments', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const data = [
      { id: 0, firstName: 'John' },
      { id: 1, firstName: 'Jane' },
    ];

    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.setData(data);

    expect(grid.invalidateRows(false as any)).toBeFalsy();
  });

  it('should be able to instantiate SlickGrid with a DataView', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const dv = new SlickDataView({});
    grid = new SlickGrid<any, Column>(container, dv, columns, defaultOptions);
    grid.init();

    expect(grid).toBeTruthy();
    expect(grid.getData()).toEqual(dv);
    expect(dv.getItems()).toEqual([]);
    expect(grid.getUID()).toMatch(/slickgrid_\d*$/);
  });

  it('should be able to add CSS classes to all Viewports', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const gridOptions = { ...defaultOptions, enableCellNavigation: true, viewportClass: 'vp-class1   vp-class2' } as GridOption;
    grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
    grid.init();
    const vpElms = container.querySelectorAll('.slick-viewport');

    expect(grid).toBeTruthy();
    expect(vpElms.length).toBe(1);
    expect(grid.getViewport()).toBeTruthy();
    expect(grid.getViewports().length).toBe(1);
    expect(grid.getViewportRowCount()).toBe(24);
    expect(vpElms[0].classList.contains('slick-viewport')).toBeTruthy();
    expect(vpElms[0].classList.contains('vp-class1')).toBeTruthy();
    expect(vpElms[0].classList.contains('vp-class1')).toBeTruthy();
    expect(vpElms[0].classList.contains('vp-class2')).toBeTruthy();
    expect(grid.getViewports().length).toBe(1);
  });

  it('should be able to set column minWidth', () => {
    const minWidth = 85; // make it greater than default 80 to see it changed
    const columns = [
      {
        id: 'firstName',
        field: 'firstName',
        name: 'First Name',
        minWidth,
        headerCssClass: 'header-class',
        headerCellAttrs: { 'some-attr': 3 },
      },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();

    expect(columns[0].width).toBe(minWidth);
  });

  it('should be able to set column maxWidth', () => {
    const maxWidth = 65; // make it lower than default 80 to see it changed
    const columns = [
      {
        id: 'firstName',
        field: 'firstName',
        name: 'First Name',
        maxWidth,
        headerCssClass: 'header-class',
        headerCellAttrs: { 'some-attr': 3 },
      },
    ] as Column[];
    grid = new SlickGrid<any, Column>('#myGrid', [], columns, defaultOptions);
    grid.init();

    expect(columns[0].width).toBe(maxWidth);
  });

  it('should throw when no container provided', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const dv = new SlickDataView({});
    grid = null as any;

    expect(() => new SlickGrid<any, Column>(null as any, dv, columns, defaultOptions)).toThrow('SlickGrid requires a valid container');
  });

  describe('Row Selections', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const data = [
      { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
      { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
    ];

    describe('Cell selection drag handle', () => {
      it.each([
        { showDragHandle: undefined, expectedClass: false, expectedHandle: true, label: 'default' },
        { showDragHandle: true, expectedClass: false, expectedHandle: true, label: 'true' },
        { showDragHandle: 'hover' as const, expectedClass: true, expectedHandle: true, label: 'hover' },
        { showDragHandle: false, expectedClass: false, expectedHandle: false, label: 'false' },
      ])('should support the $label showDragHandle mode', ({ showDragHandle, expectedClass, expectedHandle }) => {
        const modelOptions = showDragHandle === undefined ? { selectionType: 'cell' as const } : { selectionType: 'cell' as const, showDragHandle };
        const selectionModel = new SlickHybridSelectionModel(modelOptions);
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, showCellSelection: true });
        grid.setSelectionModel(selectionModel);
        grid.render();

        selectionModel.setSelectedRanges([new SlickRange(0, 0, 1, 0)]);

        const dragHandle = container.querySelector('.slick-drag-replace-handle');
        expect(!!dragHandle).toBe(expectedHandle);
        expect(dragHandle ? dragHandle.classList.contains('slick-drag-replace-handle-hover') : false).toBe(expectedClass);
      });
    });

    describe('setSelectedRows() method', () => {
      it('should throw when calling setSelectedRows() without a selection model', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);

        expect(() => grid.setSelectedRows([0, 1])).toThrow('SlickGrid Selection model is not set');
      });

      it('should call SlickHybridSelectionModel.setSelectedRanges() when editor lock isActive() is define and is returning false', () => {
        const hybridSelectionModel = new SlickHybridSelectionModel();
        const setRangeSpy = vi.spyOn(hybridSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(hybridSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.setSelectedRows([1]);
        grid.invalidateRow(0);
        grid.invalidateRow(1);
        grid.render();
        grid.setSelectedRows([0, 1]);
        const firstRowItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l0.r0') as HTMLDivElement;
        const secondRowItemCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l0.r0') as HTMLDivElement;

        expect(setRangeSpy).toHaveBeenCalledWith(
          [
            { fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 },
            { fromCell: 0, fromRow: 1, toCell: 0, toRow: 1 },
          ],
          'SlickGrid.setSelectedRows'
        );
        expect(firstRowItemCell.classList.contains('selected')).toBeTruthy();
        expect(secondRowItemCell.classList.contains('selected')).toBeTruthy();
      });

      it('should call SlickHybridSelectionModel.setSelectedRanges() when editor lock isActive() is define and is returning false', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.setSelectedRows([1]);
        grid.invalidateRow(0);
        grid.invalidateRow(1);
        grid.render();
        grid.setSelectedRows([0, 1]);
        const firstRowItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l0.r0') as HTMLDivElement;
        const secondRowItemCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l0.r0') as HTMLDivElement;

        expect(setRangeSpy).toHaveBeenCalledWith(
          [
            { fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 },
            { fromCell: 0, fromRow: 1, toCell: 0, toRow: 1 },
          ],
          'SlickGrid.setSelectedRows'
        );
        expect(firstRowItemCell.classList.contains('selected')).toBeTruthy();
        expect(secondRowItemCell.classList.contains('selected')).toBeTruthy();
      });

      it('should compact contiguous row ranges when Select All is clicked', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.setSelectedRows([0, 1], 'click.selectAll');

        expect(setRangeSpy).toHaveBeenCalledWith([new SlickRange(0, 0, 1, 0)], 'click.selectAll');
      });

      it('should compact non-contiguous ascending rows and allow an empty selection', () => {
        grid = new TestGrid(container, data, columns, defaultOptions);

        expect((grid as TestGrid).callRowsToRanges([0, 2], true)).toEqual([new SlickRange(0, 0, 0, 0), new SlickRange(2, 0, 2, 0)]);
        expect((grid as TestGrid).callRowsToRanges([], true)).toEqual([]);
      });

      it('should retain legacy selection order when Select All receives non-ascending rows', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.setSelectedRows([2, 1], 'click.selectAll');

        expect(grid.getSelectedRows()).toEqual([1, 2]);
      });

      it('should select rows when the last column is hidden', () => {
        const columnsWithHiddenLastColumn = [
          { id: 'firstName', field: 'firstName', name: 'First Name' },
          { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
        ] as Column[];
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });

        grid = new SlickGrid<any, Column>(container, data, columnsWithHiddenLastColumn, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        grid.setSelectedRows([1]);

        expect(rowSelectionModel.getSelectedRanges()).toEqual([{ fromCell: 0, fromRow: 1, toCell: 0, toRow: 1 }]);
        expect(grid.getSelectedRows()).toEqual([1]);
      });

      it('should add selected CSS when rendering a selected cell without a CSS hash', () => {
        grid = new TestGrid(container, data, columns, defaultOptions);

        const cell = (grid as TestGrid).callAppendSelectedCellHtml(1, 0);

        expect(cell.classList.contains('selected')).toBeTruthy();
      });

      it('should add selected CSS alongside an existing cell CSS hash', () => {
        grid = new TestGrid(container, data, columns, defaultOptions);
        grid.setCellCssStyles('highlight', { 1: { firstName: 'highlight' } });

        const cell = (grid as TestGrid).callAppendSelectedCellHtml(1, 0);

        expect(cell.classList).toContain('highlight');
        expect(cell.classList).toContain('selected');
      });

      it('should call SlickHybridSelectionModel.onDragReplaceCells() when selection mode is REP and range is expanding', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        const invalidateSpy = vi.spyOn(grid, 'invalidate');
        const onDragReplaceSpy = vi.spyOn(grid.onDragReplaceCells, 'notify');

        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.render();
        grid.setSelectedRows([0]);
        const firstRowItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l0.r0') as HTMLDivElement;

        expect(setRangeSpy).toHaveBeenCalledWith([{ fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 }], 'SlickGrid.setSelectedRows');
        expect(firstRowItemCell.classList.contains('selected')).toBeTruthy();

        const slickRange = new SlickRange(1, 2, 3, 4);
        const prevSelectedRange = new SlickRange(0, 0, 0, 0);
        const selectedRange = new SlickRange(1, 2, 3, 4);
        rowSelectionModel.setSelectedRanges([slickRange], 'SlickHybridSelectionModel.setSelectedRanges', 'REP');
        expect(onDragReplaceSpy).toHaveBeenCalledWith({ grid, prevSelectedRange, selectedRange }, expect.anything(), grid);
        expect(invalidateSpy).toHaveBeenCalled();
      });

      it('should not trigger drag replace when more than one selected range changes', () => {
        const cellSelectionModel = new SlickHybridSelectionModel({ selectionType: 'cell' });
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(cellSelectionModel);
        const onDragReplaceSpy = vi.spyOn(grid.onDragReplaceCells, 'notify');
        const handleSelectedRangesChanged = (grid as any).handleSelectedRangesChanged.bind(grid);

        handleSelectedRangesChanged(new SlickEventData(new CustomEvent('click')), [new SlickRange(0, 0), new SlickRange(1, 0)]);
        handleSelectedRangesChanged(new SlickEventData(new CustomEvent('click', { detail: { selectionMode: 'REP' } })), [
          new SlickRange(0, 0, 1, 0),
          new SlickRange(1, 0, 2, 0),
        ]);

        expect(onDragReplaceSpy).not.toHaveBeenCalled();
      });

      it('should compare the final cell coordinate during a REP selection update', () => {
        const cellSelectionModel = new SlickHybridSelectionModel({ selectionType: 'cell' });
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(cellSelectionModel);
        const onDragReplaceSpy = vi.spyOn(grid.onDragReplaceCells, 'notify');
        const handleSelectedRangesChanged = (grid as any).handleSelectedRangesChanged.bind(grid);
        const previousRange = new SlickRange(0, 0, 1, 2);
        const selectedRange = new SlickRange(0, 0, 1, 1);

        handleSelectedRangesChanged(new SlickEventData(new CustomEvent('click')), [previousRange]);
        handleSelectedRangesChanged(new SlickEventData(new CustomEvent('click', { detail: { selectionMode: 'REP' } })), [selectedRange]);

        expect(onDragReplaceSpy).not.toHaveBeenCalled();
      });

      it('should call onSelectedRowsChanged() with Hybrid Selection Mode and addDragHandle', () => {
        const rowSelectionModel = new SlickHybridSelectionModel();
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        const onSelectedRowChangeSpy = vi.spyOn(grid.onSelectedRowsChanged, 'notify');

        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(false);

        grid.render();
        grid.setSelectedRows([0]);
        const firstRowItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l0.r0') as HTMLDivElement;

        expect(setRangeSpy).toHaveBeenCalledWith([{ fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 }], 'SlickGrid.setSelectedRows');
        expect(firstRowItemCell.classList.contains('selected')).toBeTruthy();

        const slickRange = new SlickRange(1, 2, 3, 4);
        rowSelectionModel.setSelectedRanges([slickRange], 'SlickHybridSelectionModel.setSelectedRanges', 'REP');
        expect(onSelectedRowChangeSpy).toHaveBeenCalledWith(
          {
            grid,
            caller: 'SlickGrid.setSelectedRows',
            changedSelectedRows: [0],
            changedUnselectedRows: [],
            previousSelectedRows: [],
            rows: [0],
          },
          expect.anything(),
          grid
        );
      });

      it('should not call SlickHybridSelectionModel.setSelectedRanges() when editor lock isActive() is define and is returning true', () => {
        const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(hybridSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(hybridSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(true);

        grid.setSelectedRows([0, 1]);
        grid.render();

        expect(setRangeSpy).not.toHaveBeenCalled();
      });

      it('should not call SlickHybridSelectionModel.setSelectedRanges() when editor lock isActive() is define and is returning true', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');

        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.setSelectionModel(rowSelectionModel);
        vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValueOnce(true);

        grid.setSelectedRows([0, 1]);
        grid.render();

        expect(setRangeSpy).not.toHaveBeenCalled();
      });

      it('should not call SlickHybridSelectionModel.setSelectedRanges() when editor lock is undefined', () => {
        const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(hybridSelectionModel, 'setSelectedRanges');
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, editorLock: undefined });
        grid.setSelectionModel(hybridSelectionModel);

        vi.spyOn(grid, 'getEditorLock').mockReturnValue(undefined as any);
        grid.setSelectedRows([0, 1]);
        grid.render();

        expect(grid.getEditorLock()).toBeUndefined();
        expect(setRangeSpy).not.toHaveBeenCalledWith(
          [
            { fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 },
            { fromCell: 0, fromRow: 1, toCell: 0, toRow: 1 },
          ],
          'SlickGrid.setSelectedRows'
        );
      });

      it('should not call SlickHybridSelectionModel.setSelectedRanges() when editor lock is undefined', () => {
        const rowSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
        const setRangeSpy = vi.spyOn(rowSelectionModel, 'setSelectedRanges');
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, editorLock: undefined });
        grid.setSelectionModel(rowSelectionModel);

        vi.spyOn(grid, 'getEditorLock').mockReturnValue(undefined as any);
        grid.setSelectedRows([0, 1]);
        grid.render();

        expect(grid.getEditorLock()).toBeUndefined();
        expect(setRangeSpy).not.toHaveBeenCalledWith(
          [
            { fromCell: 0, fromRow: 0, toCell: 0, toRow: 0 },
            { fromCell: 0, fromRow: 1, toCell: 0, toRow: 1 },
          ],
          'SlickGrid.setSelectedRows'
        );
      });
    });
  });

  describe('Pre-Header Panel', () => {
    it('should create a preheader panel when enabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const gridOptions = {
        ...defaultOptions,
        enableCellNavigation: true,
        preHeaderPanelHeight: 30,
        showPreHeaderPanel: true,
        createPreHeaderPanel: true,
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      const preheaderElm = container.querySelector('.slick-preheader-panel');
      const preheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-preheader-panel');

      expect(grid).toBeTruthy();
      expect(preheaderElm).toBeTruthy();
      expect(preheaderElm?.querySelectorAll('div').length).toBe(3);
      expect(preheaderElms[0].style.display).not.toBe('none');
      expect(preheaderElms.length).toBe(1);
      expect(grid.getPreHeaderPanel()).toBeTruthy();
      expect(grid.getPreHeaderPanel()).toEqual(grid.getPreHeaderPanelLeft());
      expect(grid.getPreHeaderPanelRight()).toEqual(grid.getPreHeaderPanel());
    });

    it('should hide column headers div when "showPreHeaderPanel" is disabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const gridOptions = {
        ...defaultOptions,
        enableCellNavigation: true,
        preHeaderPanelHeight: 30,
        showPreHeaderPanel: false,
        createPreHeaderPanel: true,
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      let preheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-preheader-panel');

      expect(grid).toBeTruthy();
      expect(preheaderElms).toBeTruthy();
      expect(preheaderElms[0].style.display).toBe('none');

      grid.setPreHeaderPanelVisibility(true);
      preheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-preheader-panel');
      expect(preheaderElms[0].style.display).not.toBe('none');

      grid.setPreHeaderPanelVisibility(false);
      preheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-preheader-panel');
      expect(preheaderElms[0].style.display).toBe('none');
    });
  });

  describe('Top-Header Panel', () => {
    it('should keep a draggable grouping dropzone fixed during horizontal scrolling', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, {
        ...defaultOptions,
        pinning: { columns: { left: ['firstName'] } },
        topHeaderPanelHeight: 30,
        showTopHeaderPanel: true,
        createTopHeaderPanel: true,
      });
      grid.init();

      const topheaderElm = grid.getTopHeaderPanel();
      topheaderElm.classList.add('slick-dropzone');
      grid.scrollToX(25);

      expect(topheaderElm.style.transform).toBe('');
    });

    it('should create a topheader panel when enabled', () => {
      const paneHeight = 25;
      const topHeaderPanelHeight = 30;
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const gridOptions = {
        ...defaultOptions,
        enableCellNavigation: true,
        topHeaderPanelHeight,
        showTopHeaderPanel: true,
        createTopHeaderPanel: true,
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      const topheaderElm = container.querySelector('.slick-topheader-panel');
      const topheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-topheader-panel');

      expect(grid).toBeTruthy();
      expect(topheaderElm).toBeTruthy();
      expect(topheaderElm?.querySelectorAll('div').length).toBe(3);
      expect(topheaderElms[0].style.display).not.toBe('none');
      expect(grid.getTopHeaderPanel()).toBeTruthy();
      expect(grid.getTopHeaderPanel()).toEqual(grid.getTopHeaderPanel());

      const paneHeader = container.querySelector<HTMLDivElement>('.slick-header-root');
      vi.spyOn(paneHeader!, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0, height: paneHeight } as DOMRect);

      // calling resize should add top offset of pane + topHeader
      grid.resizeCanvas();

      const paneTopLeftElm = container.querySelector('.slick-content-root') as HTMLDivElement;

      expect(paneTopLeftElm.style.top).toBe(`${paneHeight + topHeaderPanelHeight}px`);
    });

    it('should hide column headers div when "showTopHeaderPanel" is disabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const gridOptions = {
        ...defaultOptions,
        enableCellNavigation: true,
        topHeaderPanelHeight: 30,
        showTopHeaderPanel: false,
        createTopHeaderPanel: true,
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      let topheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-topheader-panel');

      expect(grid).toBeTruthy();
      expect(topheaderElms).toBeTruthy();
      expect(topheaderElms[0].style.display).toBe('none');

      grid.setTopHeaderPanelVisibility(true);
      topheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-topheader-panel');
      expect(topheaderElms[0].style.display).not.toBe('none');

      grid.setTopHeaderPanelVisibility(false);
      topheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-topheader-panel');
      expect(topheaderElms[0].style.display).toBe('none');
    });

    it('should hide column headers div when "showTopHeaderPanel" is disabled and always show vertical scroll', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      const gridOptions = {
        ...defaultOptions,
        alwaysShowVerticalScroll: true,
        enableCellNavigation: true,
        topHeaderPanelHeight: 30,
        showTopHeaderPanel: false,
        createTopHeaderPanel: true,
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      const topheaderElms = container.querySelectorAll<HTMLDivElement>('.slick-topheader-panel');
      const vpTopLeft = container.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;

      expect(grid).toBeTruthy();
      expect(topheaderElms).toBeTruthy();
      expect(topheaderElms[0].style.display).toBe('none');
      expect(vpTopLeft.style.overflowY).toBe('scroll');
    });
  });

  describe('Headers', () => {
    it('should show column headers div by default', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      grid.init();
      const headerElm = container.querySelector('.slick-header') as HTMLDivElement;

      expect(grid.getHeaderRow()).toBeTruthy();
      expect(grid.getHeaderRowColumn('firstName')).toBeUndefined();
      expect(grid).toBeTruthy();
      expect(headerElm).toBeTruthy();
      expect(headerElm.style.display).not.toBe('none');
    });

    it('should hide column headers div when "showColumnHeader" is disabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showColumnHeader: false });
      grid.init();
      let headerElms = container.querySelectorAll<HTMLDivElement>('.slick-header');

      expect(grid).toBeTruthy();
      expect(headerElms).toBeTruthy();
      expect(headerElms[0].style.display).toBe('none');
      expect(headerElms.length).toBe(1);

      grid.setColumnHeaderVisibility(true);
      headerElms = container.querySelectorAll<HTMLDivElement>('.slick-header');
      expect(headerElms[0].style.display).not.toBe('none');
      expect(headerElms.length).toBe(1);

      grid.setColumnHeaderVisibility(false);
      headerElms = container.querySelectorAll<HTMLDivElement>('.slick-header');
      expect(headerElms[0].style.display).toBe('none');
      expect(headerElms.length).toBe(1);
    });
  });

  describe('Footer', () => {
    it('should show footer when "showFooterRow" is enabled', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, createFooterRow: true, showFooterRow: true });
      grid.init();
      const headerElm = container.querySelector('.slick-footerrow') as HTMLDivElement;
      const footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');

      expect(headerElm).toBeTruthy();
      expect(headerElm.style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should hide/show column headers div when "showFooterRow" is disabled with pinning and expect footer row column exists', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', colspan: 3 },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];
      const gridOptions = {
        ...defaultOptions,
        createFooterRow: true,
        showFooterRow: false,
        pinning: { columns: { left: 0 }, rows: { top: [0] } },
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, data, columns, gridOptions);
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const onBeforeFooterRowCellDestroySpy = vi.spyOn(grid.onBeforeFooterRowCellDestroy, 'notify');

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setActiveCell(2, 1);
      grid.setFooterRowVisibility(true);
      grid.updateColumns(); // this will trigger onBeforeFooterRowCellDestroySpy

      vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(-1);
      grid.updateRowCount();

      expect(onBeforeFooterRowCellDestroySpy).toHaveBeenCalledTimes(2); // because we have 2x columns
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should define colspan and rowspan then expect to cleanup rendered cells when SlickDataView and cell metadata are defined', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', colspan: 2, rowspan: 2 },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
        { id: 'age', field: 'age', name: 'Age' },
        { id: 'gender', field: 'gender', name: 'gender' },
        { id: 'scholarity', field: 'scholarity', name: 'scholarity', colspan: '*' },
        { id: 'bornCity', field: 'bornCity', name: 'bornCity' },
      ] as Column[];
      const gridOptions = { ...defaultOptions, enableCellRowSpan: true, createFooterRow: true, showFooterRow: false, minRowBuffer: 10 } as GridOption;
      const data: any[] = [];
      for (let i = 0; i < 1000; i++) {
        data.push({ id: i, firstName: 'John', lastName: 'Doe', age: 30 });
      }
      const dv = new SlickDataView({});
      dv.setItems(data);
      grid = new SlickGrid<any, Column>(container, dv, columns, gridOptions);
      vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1); // add a rowspan mandatory row to always render
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const onBeforeFooterRowCellDestroySpy = vi.spyOn(grid.onBeforeFooterRowCellDestroy, 'notify');
      vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 200, rightPx: 12, bottom: 230, top: 12 });
      vi.spyOn(dv, 'getItemMetadata').mockReturnValue({
        cssClasses: 'text-bold',
        focusable: true,
        formatter: (_r: number, _c: number, val: any) => val,
        columns: { 0: { colspan: '*' } },
      });

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setActiveCell(200, 1);
      grid.updateCell(344, 5);
      vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1); // add a rowspan mandatory row to always render
      vi.spyOn(grid, 'getParentRowSpanByCell').mockReturnValue(null).mockReturnValueOnce({ start: 0, end: 1, range: '0:1' }); // add a rowspan mandatory row to always render
      grid.setFooterRowVisibility(true);
      grid.updateColumns(); // this will trigger onBeforeFooterRowCellDestroySpy

      vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(data.length + 1); // add 1 more to force a full rowspan cache remap
      const remapRowspanSpy = vi.spyOn(grid, 'remapAllColumnsRowSpan');
      grid.updateRowCount();

      expect(remapRowspanSpy).toHaveBeenCalled();
      expect(onBeforeFooterRowCellDestroySpy).toHaveBeenCalled();
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should define colspan as number only and rowspan then expect to cleanup rendered cells when SlickDataView and cell metadata are defined', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', colspan: 2, rowspan: 2 },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
        { id: 'age', field: 'age', name: 'Age' },
        { id: 'gender', field: 'gender', name: 'gender', colspan: 3 },
        { id: 'scholarity', field: 'scholarity', name: 'scholarity' },
        { id: 'bornCity', field: 'bornCity', name: 'bornCity' },
      ] as Column[];
      const gridOptions = {
        ...defaultOptions,
        enableCellRowSpan: true,
        createFooterRow: true,
        showFooterRow: false,
        minRowBuffer: 10,
        spreadHiddenColspan: true,
      } as GridOption;
      const data: any[] = [];
      for (let i = 0; i < 1000; i++) {
        data.push({ id: i, firstName: 'John', lastName: 'Doe', age: 30 });
      }
      const dv = new SlickDataView({});
      dv.setItems(data);
      grid = new SlickGrid<any, Column>(container, dv, columns, gridOptions);
      vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1); // add a rowspan mandatory row to always render
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const onBeforeFooterRowCellDestroySpy = vi.spyOn(grid.onBeforeFooterRowCellDestroy, 'notify');
      vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 200, rightPx: 12, bottom: 230, top: 12 });
      vi.spyOn(dv, 'getItemMetadata').mockReturnValue({
        cssClasses: 'text-bold',
        focusable: true,
        formatter: (_r: number, _c: number, val: any) => val,
        columns: { 0: { colspan: 3 } },
      });

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setActiveCell(200, 1);
      grid.updateCell(344, 5);
      vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1); // add a rowspan mandatory row to always render
      vi.spyOn(grid, 'getParentRowSpanByCell').mockReturnValue(null).mockReturnValueOnce({ start: 0, end: 1, range: '0:1' }); // add a rowspan mandatory row to always render
      grid.setFooterRowVisibility(true);
      grid.updateColumns(); // this will trigger onBeforeFooterRowCellDestroySpy

      vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(data.length + 1); // add 1 more to force a full rowspan cache remap
      const remapRowspanSpy = vi.spyOn(grid, 'remapAllColumnsRowSpan');
      grid.updateRowCount();

      expect(remapRowspanSpy).toHaveBeenCalled();
      expect(onBeforeFooterRowCellDestroySpy).toHaveBeenCalled();
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should define colspan and rowspan but get a warning when enableCellRowSpan is disabled', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockReturnValue();
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      const metadata = { 0: { columns: { 0: { colspan: 2, rowspan: 2 } } } };
      const gridOptions = { ...defaultOptions, enableCellRowSpan: false, minRowBuffer: 10 } as GridOption;
      const data: any[] = [];
      for (let i = 0; i < 2; i++) {
        data.push({ id: i, firstName: 'John', lastName: 'Doe', age: 30 });
      }
      const dv = new SlickDataView({});
      vi.spyOn(dv, 'getItemMetadata').mockReturnValue(metadata[0]);
      dv.setItems(data);
      grid = new SlickGrid<any, Column>(container, dv, columns, gridOptions);
      grid.init();

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[SlickGrid] Cell "rowspan" is an opt-in grid option because of its small perf hit'));
    });

    it('should define colspan with hidden column in between and expect it be included when "spreadHiddenColspan" is enabled', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
        { id: 'age', field: 'age', name: 'Age' },
        { id: 'gender', field: 'gender', name: 'Gender' },
      ] as Column[];
      const metadata = { 0: { columns: { 0: { colspan: 2 } } } };
      const gridOptions = { ...defaultOptions, minRowBuffer: 10, spreadHiddenColspan: true } as GridOption;
      const data: any[] = [];
      for (let i = 0; i < 2; i++) {
        data.push({ id: i, firstName: 'John', lastName: 'Doe', age: 30 });
      }
      const dv = new SlickDataView({});
      vi.spyOn(dv, 'getItemMetadata').mockReturnValue(metadata[0]);
      dv.setItems(data);
      grid = new SlickGrid<any, Column>(container, dv, columns, gridOptions);
      grid.init();

      const cells = container.querySelectorAll<HTMLDivElement>('.slick-row:nth-child(1) .slick-cell');

      expect(cells[0].className.includes('l0 r2')).toBeTruthy();
      expect(cells[1].className.includes('l3 r3')).toBeTruthy();
    });

    it('should hide/show column headers div when "showFooterRow" is disabled and expect some row cache to be cleaned up', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', colspan: 3 },
        { id: 'lastName', field: 'lastName', name: 'Last Name', colspan: 2 },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];
      const gridOptions = { ...defaultOptions, createFooterRow: true, showFooterRow: false } as GridOption;
      grid = new SlickGrid<any, Column>(container, data, columns, gridOptions);
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const onBeforeFooterRowCellDestroySpy = vi.spyOn(grid.onBeforeFooterRowCellDestroy, 'notify');
      const onBeforeRemoveCachedRowSpy = vi.spyOn(grid.onBeforeRemoveCachedRow, 'notify');
      vi.spyOn(grid, 'getRenderedRange').mockReturnValue({
        bottom: 1,
        leftPx: 0,
        rightPx: -1,
        top: 0,
      });

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setActiveCell(2, 1);
      grid.setFooterRowVisibility(true);
      grid.updateColumns(); // this will trigger onBeforeFooterRowCellDestroySpy

      vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(-1);
      grid.updateRowCount();

      expect(grid.getRowCache()).toEqual({});
      expect(onBeforeRemoveCachedRowSpy).toHaveBeenCalledTimes(4);
      expect(onBeforeFooterRowCellDestroySpy).toHaveBeenCalledTimes(2); // because we have 2x columns
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should hide/show column headers div when "showFooterRow" is disabled with bottom pinning and expect footer row column exists', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];
      const gridOptions = {
        ...defaultOptions,
        createFooterRow: true,
        showFooterRow: false,
        pinning: { columns: { left: 0 }, rows: { bottom: [1] } },
      } as GridOption;
      grid = new SlickGrid<any, Column>(container, data, columns, gridOptions);
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const onBeforeFooterRowCellDestroySpy = vi.spyOn(grid.onBeforeFooterRowCellDestroy, 'notify');

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setFooterRowVisibility(true);
      grid.updateColumns(); // this will trigger onBeforeFooterRowCellDestroySpy

      expect(onBeforeFooterRowCellDestroySpy).toHaveBeenCalledTimes(2); // because we have 2x columns
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should hide column headers div when "showFooterRow" is disabled and expect undefined footer row column', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      const gridOptions = { ...defaultOptions, createFooterRow: true, showFooterRow: false, pinning: { columns: { left: 1 } } } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');

      expect(grid.getFooterRow()).toBeTruthy();
      expect(footerElms).toBeTruthy();
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setFooterRowVisibility(true);
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn(2)).toBeNull();

      grid.setFooterRowVisibility(false);
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');
    });

    it('should hide column headers div when "showFooterRow" is disabled and return undefined footer row column', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      const gridOptions = { ...defaultOptions, createFooterRow: false, showFooterRow: false, pinning: { columns: { left: 1 } } } as GridOption;
      grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
      grid.init();
      const footerElm = container.querySelector<HTMLDivElement>('.slick-footerrow');

      expect(grid.getFooterRow()).toBeFalsy();
      expect(footerElm).toBeFalsy();
      expect(grid.getFooterRowColumn('firstName')).toBeUndefined();
    });

    it('should lazily create footer row when "createFooterRow" is enabled at runtime', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, {
        ...defaultOptions,
        createFooterRow: false,
        showFooterRow: true,
      });
      grid.init();

      const onFooterRowCellRenderedSpy = vi.spyOn(grid.onFooterRowCellRendered, 'notify');

      expect(grid.getFooterRow()).toBeFalsy();
      expect(container.querySelector('.slick-footerrow')).toBeFalsy();

      expect(() => grid.setOptions({ createFooterRow: true, showFooterRow: true })).not.toThrow();

      let footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms).toBeTruthy();
      expect(footerElms.length).toBe(1);
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRow()).toBeTruthy();
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
      expect(onFooterRowCellRenderedSpy).toHaveBeenCalledTimes(2);

      grid.setFooterRowVisibility(false);
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setOptions({ createFooterRow: false });
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setOptions({ createFooterRow: true, showFooterRow: true });
      footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      expect(footerElms[0].style.display).toBe('none');
      expect(footerElms[0].style.display).toBe('none');

      grid.setFooterRowVisibility(false);
      grid.setFooterRowVisibility(true);
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
    });

    it('should show footer when "showFooterRow" is enabled but not return any row when columns to the right are outside the range', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, createFooterRow: true, showFooterRow: true });
      vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 0, rightPx: -1, bottom: 230, top: 12 });

      grid.init();
      grid.render();
      const headerElm = container.querySelector('.slick-footerrow') as HTMLDivElement;
      const footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');
      const firstItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l0.r0') as HTMLDivElement;

      expect(firstItemCell).toBeFalsy();
      expect(headerElm).toBeTruthy();
      expect(headerElm.style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });

    it('should show footer when "showFooterRow" is enabled with pinned column', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', alwaysRenderColumn: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John', lastName: 'Doe' }], columns, {
        ...defaultOptions,
        createFooterRow: true,
        showFooterRow: true,
      });
      vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 200, rightPx: 12, bottom: 230, top: 12 });
      grid.init();
      grid.render();
      const headerElm = container.querySelector('.slick-footerrow') as HTMLDivElement;
      const footerElms = container.querySelectorAll<HTMLDivElement>('.slick-footerrow');

      expect(headerElm).toBeTruthy();
      expect(headerElm.style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(footerElms[0].style.display).not.toBe('none');
      expect(grid.getFooterRowColumn('firstName')).toEqual(footerElms[0].querySelector('.slick-footerrow-column'));
    });
  });

  describe('Top Panel', () => {
    it('should show top panel div when "showTopPanel" is enabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showTopPanel: true });
      grid.init();
      const topPanelElms = container.querySelectorAll<HTMLDivElement>('.slick-top-panel');
      const topPanelScrollerElms = container.querySelectorAll<HTMLDivElement>('.slick-top-panel-scroller');

      expect(grid.getTopPanel()).toEqual(topPanelElms[0]);
      expect(grid.getTopPanels()).toEqual([topPanelElms[0]]);
      expect(topPanelScrollerElms.length).toBe(1);
      expect(topPanelScrollerElms[0].style.display).not.toBe('none');
    });

    it('should hide top panel div when "showTopPanel" is disabled', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showTopPanel: false });
      grid.init();
      let topPanelElms = container.querySelectorAll<HTMLDivElement>('.slick-top-panel-scroller');

      expect(topPanelElms).toBeTruthy();
      expect(topPanelElms[0].style.display).toBe('none');

      grid.setTopPanelVisibility(true);
      topPanelElms = container.querySelectorAll<HTMLDivElement>('.slick-top-panel-scroller');
      expect(topPanelElms[0].style.display).not.toBe('none');

      grid.setTopPanelVisibility(false);
      topPanelElms = container.querySelectorAll<HTMLDivElement>('.slick-top-panel-scroller');
      expect(topPanelElms[0].style.display).toBe('none');
    });
  });

  describe('Header Row', () => {
    it('should show top panel div when "showHeaderRow" is enabled', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showHeaderRow: true, pinning: { columns: { left: 0 } } });
      grid.init();
      const headerElms = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');
      const firstNameColHeader = grid.getHeaderRowColumn('firstName');

      expect(grid).toBeTruthy();
      expect(headerElms.length).toBe(1);
      expect(headerElms[0].style.display).not.toBe('none');
      expect(firstNameColHeader).toEqual(headerElms[0].querySelector('.slick-headerrow-column'));

      // recreate column headers
      grid.updateColumns();

      expect(headerElms.length).toBe(1);
      expect(headerElms[0].style.display).not.toBe('none');
      expect(firstNameColHeader).toEqual(headerElms[0].querySelector('.slick-headerrow-column'));
    });

    it('should notify before destroying existing header row cells when recreating headers', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
      grid = new SlickGrid<any>(container, [], columns, { ...defaultOptions, showHeaderRow: true });
      grid.init();

      const headerRowCell = grid.getHeaderRowColumn('firstName');
      const destroySpy = vi.spyOn(grid.onBeforeHeaderRowCellDestroy, 'notify');

      (grid as any).createColumnHeaders();

      expect(destroySpy).toHaveBeenCalledWith({ node: headerRowCell, column: columns[0], grid }, expect.anything(), grid);
    });

    it('should hide top panel div when "showHeaderRow" is disabled', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showHeaderRow: false, pinning: { columns: { left: 1 } } });
      grid.init();
      let headerElm = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');

      expect(grid).toBeTruthy();
      expect(headerElm).toBeTruthy();
      expect(headerElm[0].style.display).toBe('none');
      expect(headerElm.length).toBe(1);

      grid.setHeaderRowVisibility(true);
      headerElm = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');
      expect(headerElm[0].style.display).not.toBe('none');
      expect(grid.getHeaderRowColumn('firstName')).toBeNull();

      grid.setHeaderRowVisibility(false);
      headerElm = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');
      expect(headerElm[0].style.display).toBe('none');
    });

    it('should hide top panel div when "showHeaderRow" is disabled and return undefined header row column', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, showHeaderRow: false, pinning: { columns: { left: 1 } } });
      grid.init();
      let headerElm = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');

      expect(grid).toBeTruthy();
      expect(headerElm).toBeTruthy();
      expect(headerElm[0].style.display).toBe('none');

      grid.setHeaderRowVisibility(true);
      headerElm = container.querySelectorAll<HTMLDivElement>('.slick-headerrow');
      expect(headerElm[0].style.display).not.toBe('none');
      expect(grid.getHeaderRowColumn(2)).toBeNull();
    });
  });

  describe('applyFormatResultToCellNode() method', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    const dv = new SlickDataView({});
    const cellNodeElm = document.createElement('div');
    cellNodeElm.className = 'slick-cell';

    it('should expect cell target to be empty string when formatter result is null', () => {
      const formatterResult = null as any;

      grid = new SlickGrid<any, Column>('#myGrid', dv, columns, defaultOptions);
      grid.applyFormatResultToCellNode(formatterResult, cellNodeElm);

      expect(cellNodeElm.outerHTML).toBe('<div class="slick-cell"></div>');
    });

    it('should be able to apply HTMLElement returned by a Formatter to a HTMLElement target', () => {
      const spanElm = document.createElement('span');
      spanElm.textContent = 'some content';
      const formatterResult = spanElm;

      grid = new SlickGrid<any, Column>('#myGrid', dv, columns, defaultOptions);
      grid.applyFormatResultToCellNode(formatterResult, cellNodeElm);

      expect(cellNodeElm.outerHTML).toBe('<div class="slick-cell"><span>some content</span></div>');
    });

    it('should be able to apply column header tooltip', () => {
      const tooltipColumns = [{ id: 'firstName', field: 'firstName', name: 'First Name', toolTip: 'header tooltip' }] as Column[];

      grid = new SlickGrid<any, Column>('#myGrid', dv, tooltipColumns, defaultOptions);
      const columnElms = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');

      expect(columnElms[0].title).toBe('header tooltip');
    });

    it('should be able to apply cell text, CSS classes and tooltip when Formatter is returnbing FormatterResultWithText', () => {
      const formatterResult = { addClasses: 'some-class', toolTip: 'some tooltip', text: 'some content' } as FormatterResultWithText;

      grid = new SlickGrid<any, Column>('#myGrid', dv, columns, defaultOptions);
      grid.applyFormatResultToCellNode(formatterResult, cellNodeElm);

      expect(cellNodeElm.outerHTML).toBe('<div class="slick-cell some-class" title="some tooltip">some content</div>');
    });

    it('should be able to apply text, CSS classes and tooltip when Formatter is returnbing FormatterResultWithHtml', () => {
      const divElm = document.createElement('div');
      const spanElm = document.createElement('span');
      spanElm.textContent = 'some content';
      divElm.appendChild(spanElm);
      const formatterResult = { addClasses: 'some-class', toolTip: 'some tooltip', html: divElm } as FormatterResultWithHtml;

      grid = new SlickGrid<any, Column>('#myGrid', dv, columns, defaultOptions);
      grid.applyFormatResultToCellNode(formatterResult, cellNodeElm);

      expect(cellNodeElm.outerHTML).toBe('<div class="slick-cell some-class" title="some tooltip"><div><span>some content</span></div></div>');
    });

    it('should be able to apply text, CSS classes and removed CSS classes when Formatter is returnbing FormatterResultWithText', () => {
      const formatterResult = {
        addClasses: 'some-class',
        removeClasses: 'slick-cell',
        toolTip: 'some tooltip',
        text: 'some content',
      } as FormatterResultWithText;

      grid = new SlickGrid<any, Column>('#myGrid', dv, columns, defaultOptions);
      grid.applyFormatResultToCellNode(formatterResult, cellNodeElm);

      expect(cellNodeElm.outerHTML).toBe('<div class="some-class" title="some tooltip">some content</div>');
    });
  });

  describe('dataItemColumnValueExtractor', () => {
    it('should use dataItemColumnValueExtractor when provided to retrieve value to show in grid cell', () => {
      const columns = [
        { id: 'title', name: 'Name', field: 'name', asyncPostRender: (node: Node) => (node.textContent = 'Item ' + Math.random()) },
        { id: 'field1', name: 'Field1', field: 'values', fieldIdx: 0 },
        { id: 'field2', name: 'Field2', field: 'values', fieldIdx: 1 },
        { id: 'field3', name: 'Field3', field: 'values', fieldIdx: 2 },
      ];
      const gridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        rowHeight: 2500,
        dataItemColumnValueExtractor: (item, column: any) => {
          const values = item[column.field];
          if (column.fieldIdx !== undefined) {
            return values?.[column.fieldIdx];
          } else {
            return values;
          }
        },
        enableAsyncPostRenderCleanup: true,
        asyncPostRenderDelay: 1,
        asyncPostRenderCleanupDelay: 1,
      } as GridOption;
      const data: any[] = [];
      for (let i = 0; i < 500; i++) {
        data[i] = {
          name: 'Item ' + i,
          values: [i + 8, i + 9, i + 11],
        };
      }

      grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, ...gridOptions });
      grid.init;
      grid.render();

      // below is simply testing scrollTo() with different offset
      const secondItemCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
      expect(secondItemCell.textContent).toBe('8');

      const onViewportChangedSpy = vi.spyOn(grid.onViewportChanged, 'notify');
      const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;
      vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0, height: 223 } as DOMRect);
      Object.defineProperty(viewportTopLeft, 'scrollTop', { writable: true, value: 3000 });
      Object.defineProperty(viewportTopLeft, 'scrollLeft', { writable: true, value: 88 });
      Object.defineProperty(viewportTopLeft, 'scrollHeight', { writable: true, value: 440 });
      Object.defineProperty(viewportTopLeft, 'scrollWidth', { writable: true, value: 459 });
      Object.defineProperty(viewportTopLeft, 'clientHeight', { writable: true, value: 223 });
      Object.defineProperty(viewportTopLeft, 'clientWidth', { writable: true, value: 128 });
      grid.updateRowCount();
      grid.scrollCellIntoView(3000, 2);
      grid.scrollCellIntoView(30, 2);
      grid.scrollTo(52);

      expect(onViewportChangedSpy).toHaveBeenCalled();
    });
  });

  describe('getItemMetadata', () => {
    it('should expect slick-row to be taking full width when getItemMetadata() is returning cssClasses & colpan: *', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ] as Column[];
      const gridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        rowHeight: 2500,
      } as GridOption;
      const mockItems = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 0, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];

      const dv = new SlickDataView({});
      vi.spyOn(dv, 'getItemMetadata').mockReturnValue({
        cssClasses: 'text-bold',
        focusable: true,
        formatter: (_row: number, _col: number, val: any) => val,
        columns: { 0: { colspan: '*' } },
      });
      grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, ...gridOptions });
      dv.addItems(mockItems);
      grid.init;
      grid.render();

      const firstRowElm = container.querySelector('.slick-row');
      const firstCellElm = firstRowElm?.querySelector('.slick-cell');

      expect(firstRowElm?.classList.contains('text-bold')).toBeTruthy();
      expect(firstCellElm?.classList.contains('l0')).toBeTruthy();
      expect(firstCellElm?.classList.contains(`r${columns.length - 1}`)).toBeTruthy();
    });

    it('should not render hidden column cells in group totals rows but still render group title cell defined by column metadata', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', hidden: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
        { id: 'age', field: 'age', name: 'Age' },
      ] as Column[];
      const items = [
        { id: 0, firstName: 'Group', lastName: '', age: 0 },
        { id: 1, firstName: 'Totals', lastName: '', age: 58 },
      ];
      const metadata = [
        { cssClasses: 'slick-group', isGroup: true, columns: { 0: { colspan: '*', formatter: () => 'Group A' } } },
        { cssClasses: 'slick-group-totals', isGroup: true },
      ];
      const customDV = { getItemMetadata: (row: number) => metadata[row], getLength: () => items.length, getItem: (row: number) => items[row] };

      grid = new SlickGrid<any, Column>(container, customDV as any, columns, defaultOptions);
      grid.init();
      const assertCells = () => {
        const groupRowElm = container.querySelector('[data-row="0"]')!;
        const totalsRowElm = container.querySelector('[data-row="1"]')!;
        expect(groupRowElm.querySelector('.l0')?.textContent).toBe('Group A');
        expect(groupRowElm.querySelector('.l1')).toBeNull();
        expect(totalsRowElm.querySelector('.l0')).toBeNull();
        expect(totalsRowElm.querySelector('.l1')).toBeNull();
        expect(totalsRowElm.querySelector('.l2')).toBeTruthy();
      };

      assertCells();
      (grid as any).cleanUpAndRenderCells(grid.getRenderedRange());
      assertCells();
    });
  });

  describe('highlightRow() method', () => {
    const columns = [
      { id: 'firstName', field: 'firstName', name: 'First Name' },
      { id: 'lastName', field: 'lastName', name: 'Last Name' },
      { id: 'age', field: 'age', name: 'Age' },
    ] as Column[];
    const dv = new SlickDataView({});

    it('should call the method and expect the highlight to happen for a certain duration', () => {
      const mockItems = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 0, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];

      grid = new SlickGrid<any, Column>(container, dv, columns, defaultOptions);
      dv.addItems(mockItems);
      grid.init();
      grid.render();

      grid.highlightRow(0, 10);
      expect(grid).toBeTruthy();
      expect(grid.getDataLength()).toBe(2);
      expect(grid.getHeader(columns[0])).toBeInstanceOf(HTMLDivElement);
      expect(grid.getHeaderColumn(columns[0].id)).toBeInstanceOf(HTMLDivElement);

      let slickRowElms = container.querySelectorAll<HTMLDivElement>('.slick-row');
      expect(slickRowElms.length).toBe(2);
      expect(slickRowElms[0].classList.contains('highlight-animate')).toBeTruthy(); // only 1st row is highlighted
      expect(slickRowElms[1].classList.contains('highlight-animate')).toBeFalsy();

      vi.runAllTimers(); // fast-forward timer

      slickRowElms = container.querySelectorAll<HTMLDivElement>('.slick-row');
      expect(slickRowElms.length).toBe(2);
      expect(slickRowElms[0].classList.contains('highlight-animate')).toBeFalsy();
      expect(slickRowElms[1].classList.contains('highlight-animate')).toBeFalsy();
    });

    it('should return the correct header column by id when a hidden column precedes it', () => {
      const columns = [
        { id: 'a', field: 'a', name: 'A', hidden: true },
        { id: 'b', field: 'b', name: 'B' },
        { id: 'c', field: 'c', name: 'C' },
      ] as Column[];
      const rows = [{ id: 0, a: 'x', b: 'y', c: 'z' }];

      grid = new SlickGrid<any, Column>(container, rows, columns, defaultOptions);
      grid.init();

      const headerElm = grid.getHeaderColumn('b');

      expect(headerElm).toBeInstanceOf(HTMLDivElement);
      expect(headerElm.dataset.id).toBe('b');
    });

    it('should return undefined from getHeaderColumn fallback when target column is hidden', () => {
      const columns = [
        { id: 'a', field: 'a', name: 'A', hidden: true },
        { id: 'b', field: 'b', name: 'B' },
      ] as Column[];
      const rows = [{ id: 0, a: 'x', b: 'y' }];

      grid = new SlickGrid<any, Column>(container, rows, columns, defaultOptions);
      grid.init();

      expect(grid.getHeaderColumn(0)).toBeUndefined();
    });
  });

  describe('flashCell() method', () => {
    it('should flash cell 2 times', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const items = [
        { id: 0, name: 'Avery', age: 44 },
        { id: 1, name: 'Bob', age: 20 },
        { id: 2, name: 'Rachel', age: 46 },
      ];

      grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
      grid.flashCell(1, 1, 10);

      let secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;
      expect(secondItemAgeCell.textContent).toBe('20');
      expect(secondItemAgeCell.classList.contains('flashing')).toBeFalsy();

      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(10);

        secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;
        if (i % 2) {
          expect(secondItemAgeCell.classList.contains('flashing')).toBeTruthy();
        } else {
          expect(secondItemAgeCell.classList.contains('flashing')).toBeFalsy();
        }
      }
    });
  });

  describe('plugins', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];

    it('should be able to register SlickHybridSelectionModel plugin', () => {
      const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      grid.setSelectionModel(hybridSelectionModel);
      hybridSelectionModel.init(grid);

      grid.registerPlugin(hybridSelectionModel);
      let loadedPlugin = grid.getPluginByName<SlickHybridSelectionModel>('HybridSelectionModel');
      const selectionModel = grid.getSelectionModel();
      expect(loadedPlugin).toBeTruthy();
      expect(selectionModel).toBeTruthy();

      grid.unregisterPlugin(loadedPlugin as SlickHybridSelectionModel);
      loadedPlugin = grid.getPluginByName<SlickHybridSelectionModel>('HybridSelectionModel');
      expect(loadedPlugin).toBeFalsy();

      const p = grid.getPluginByName('HybridSelectionModel');
      expect(p).toBeFalsy();
    });

    it('should be able to register SlickHybridSelectionModel plugin', () => {
      const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      grid.setSelectionModel(hybridSelectionModel);
      hybridSelectionModel.init(grid);

      grid.registerPlugin(hybridSelectionModel);
      let loadedPlugin = grid.getPluginByName<SlickHybridSelectionModel>('HybridSelectionModel');
      const selectionModel = grid.getSelectionModel();
      expect(loadedPlugin).toBeTruthy();
      expect(selectionModel).toBeTruthy();

      grid.unregisterPlugin(loadedPlugin as SlickHybridSelectionModel);
      loadedPlugin = grid.getPluginByName<SlickHybridSelectionModel>('HybridSelectionModel');
      expect(loadedPlugin).toBeFalsy();

      const p = grid.getPluginByName('HybridSelectionModel');
      expect(p).toBeFalsy();
    });

    it('should clear previous selection model when calling setSelectionModel(SlickHybridSelectionModel) with a different model', () => {
      const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
      const rowSelectSpy = vi.spyOn(hybridSelectionModel, 'destroy');
      const cellSelectionModel = new SlickCellSelectionModelMock();

      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      grid.setSelectionModel(hybridSelectionModel);
      grid.setSelectionModel(cellSelectionModel as unknown as SelectionModel);

      expect(rowSelectSpy).toHaveBeenCalled();
    });

    it('should clear previous selection model when calling setSelectionModel(SlickHybridSelectionModel) with a different model', () => {
      const hybridSelectionModel = new SlickHybridSelectionModel({ selectionType: 'row' });
      const rowSelectSpy = vi.spyOn(hybridSelectionModel, 'destroy');
      const cellSelectionModel = new SlickCellSelectionModelMock();

      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      grid.setSelectionModel(hybridSelectionModel);
      grid.setSelectionModel(cellSelectionModel as unknown as SelectionModel);

      expect(rowSelectSpy).toHaveBeenCalled();
    });

    it('should change border color for darkMode', () => {
      const cellSelectionModel = new SlickHybridSelectionModel({ selectionType: 'cell' });

      grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
      cellSelectionModel.init(grid);

      expect((cellSelectionModel.getCellRangeSelector() as any)?._options.selectionCss.border).toBe('2px solid gray');

      grid.setSelectionModel(undefined as any);
      expect(grid.getSelectionModel()).toBeUndefined();
    });
  });

  describe('Node Getters', () => {
    const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];

    describe('getActiveCanvasNode() function', () => {
      it('should return the active canvas when calling the method when the Event does not include any target', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        (grid as any)._activeCanvasNode = undefined;
        const mockEvent = new CustomEvent('click');
        const result = grid.getActiveCanvasNode(mockEvent);

        expect(result).toBe(container.querySelector('.grid-canvas'));
      });

      it('should return closest grid canvas when calling the method when the Event includes grid canvas', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const mockEvent = new MouseEvent('click');
        const gridCanvasElm = container.querySelector('.grid-canvas');
        Object.defineProperty(mockEvent, 'target', { writable: true, configurable: true, value: gridCanvasElm });
        const result = grid.getActiveCanvasNode(mockEvent);

        expect(result).toEqual(gridCanvasElm);
      });

      it('should return grid canvas when event is null', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const result = grid.getActiveCanvasNode();

        expect(result).toEqual(container.querySelector('.grid-canvas'));
      });

      it('should return native event from SlickEventData when it is an instance of it', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const mockEvent = new MouseEvent('click');
        const gridCanvasElm = container.querySelector('.grid-canvas');
        Object.defineProperty(mockEvent, 'target', { writable: true, configurable: true, value: gridCanvasElm });
        const ed = new SlickEventData(mockEvent);
        const result = grid.getActiveCanvasNode(ed);

        expect(result).toEqual(gridCanvasElm);
      });
    });

    describe('getActiveViewportNode() function', () => {
      it('should return the active viewport when calling the method when the Event does not include any target', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        (grid as any)._activeViewportNode = undefined;
        const mockEvent = new CustomEvent('click');
        const result = grid.getActiveViewportNode(mockEvent);

        expect(result).toBe(grid.getViewports()[0]);
      });

      it('should return closest grid canvas when calling the method when the Event includes grid canvas', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const mockEvent = new MouseEvent('click');
        const viewportElm = container.querySelector('.slick-viewport');
        Object.defineProperty(mockEvent, 'target', { writable: true, configurable: true, value: viewportElm });
        const result = grid.getActiveViewportNode(mockEvent);

        expect(result).toEqual(viewportElm);
      });

      it('should return native event from SlickEventData when it is an instance of it', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const mockEvent = new MouseEvent('click');
        const viewportElm = container.querySelector('.slick-viewport');
        Object.defineProperty(mockEvent, 'target', { writable: true, configurable: true, value: viewportElm });
        const ed = new SlickEventData(mockEvent);
        const result = grid.getActiveViewportNode(ed);

        expect(result).toEqual(viewportElm);
      });

      it('should call getCellNode() and return null when dataset is empty', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const result = grid.getCellNode(0, 3);

        expect(result).toBeNull();
      });

      it('should call getCellNode() and return null trying to retrieve cell higher than what is in the dataset', () => {
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const result = grid.getCellNode(0, 3);

        expect(result).toBeNull();
      });
    });

    describe('getViewportNode() function', () => {
      it('should return the single viewport element while accepting legacy pane arguments', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const result = grid.getViewportNode('firstName', 3);

        expect(result).toBeTruthy();
        expect(result).toEqual(container.querySelector('.slick-viewport'));
      });
    });

    it('should apply sticky docking chrome and preserve a hidden range endpoint', () => {
      const dockingColumns = [
        { id: 'a', field: 'a', name: 'A', width: 80 },
        { id: 'b', field: 'b', name: 'B', width: 80 },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [{ id: 0, a: 'a0', b: 'b0' }], dockingColumns, {
        ...defaultOptions,
        pinning: { columns: { right: ['b'] } },
      });
      grid.init();

      const internals = grid as any;
      const rightDocking = internals.dockingLayout.right[0];
      rightDocking.sticky = true;
      const rightHeader = container.querySelector<HTMLElement>('.slick-header-column[data-id="b"]');

      internals.applyDockingToColumnChrome();
      expect(rightHeader?.classList.contains('slick-column-sticky')).toBe(true);

      internals.columns[0].hidden = true;
      internals.dockingByColumn = new Map([[1, { band: 'right' }]]);
      internals.columnPosRight = [77, 160];
      expect(internals.getColumnRangeRight(0, 0)).toBe(77);
    });

    it('should offset non-header sticky chrome elements using the right-edge calculation', () => {
      const stickyColumns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', width: 80, sticky: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', width: 80 },
      ] as Column[];
      grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John', lastName: 'Doe' }], stickyColumns, {
        ...defaultOptions,
        showHeaderRow: true,
      });
      grid.init();

      const headerRowCell = container.querySelector<HTMLElement>('.slick-headerrow-column.l0');

      expect(headerRowCell?.style.position).toBe('absolute');
      expect(headerRowCell?.style.right).toMatch(/^-?\d+(\.\d+)?px$/);
    });

    it('should merge row-only pinning without creating a columns option', () => {
      grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John' }], columns, defaultOptions);
      grid.init();

      grid.setOptions({ pinning: { rows: { top: [0] } } });

      expect(grid.getOptions().pinning).toEqual({ rows: { top: [0], bottom: [] } });
    });

    describe('getCellNodeBox() function', () => {
      it('should return null when no data is empty', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', hidden: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'age' },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);

        expect(grid.getCellNodeBox(0, 0)).toBeNull();
      });

      it('should return cell node box dimension for first cell (top/left) when data is found in the grid', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name' },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'age', hidden: true },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        expect(grid.getCellNodeBox(0, 0)).toEqual({
          left: 0,
          top: 0,
          bottom: expect.any(Number),
          right: expect.any(Number),
        });
      });

      it('should return cell node box dimension for other cell when data is found in the grid', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name' },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'age', hidden: true },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        expect(grid.getCellNodeBox(1, 1)).toEqual({
          left: 80, // default column width
          top: DEFAULT_COLUMN_HEIGHT, // default column height
          bottom: expect.any(Number),
          right: expect.any(Number),
        });
      });

      it('should return cell node box dimension for other cell but expect to skip hidden cells from calculation', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', hidden: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'age' },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        expect(grid.getCellNodeBox(1, 1)).toEqual({
          left: 0, // 0 because 1st cell is hidden
          top: DEFAULT_COLUMN_HEIGHT, // default column height
          bottom: expect.any(Number),
          right: expect.any(Number),
        });
      });
    });

    describe('Grid Dimensions', () => {
      it('should get 2 rows of cell height when rowspan is set to 2 when calling getCellHeight()', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', alwaysRenderColumn: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John', lastName: 'Doe' }], columns, defaultOptions);
        vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 200, rightPx: 12, bottom: 230, top: 12 });
        const cellHeight = grid.getCellHeight(0, 2);

        expect(cellHeight).toBe(50);
      });

      it('should return default column width when column is not wider than grid and fullWidthRows is disabled with mixinDefaults is enabled', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, mixinDefaults: true });
        grid.activateChangedOptions();
        const result = grid.getCanvasWidth();

        expect(result).toBe(80);
        expect(grid.getAbsoluteColumnMinWidth()).toBe(0);
        expect(grid.getHeaderColumnWidthDiff()).toBe(0);
      });

      it('should not call onBeforeCellEditorDestroy when mixinDefaults is enabled and commitCurrentEdit is returning false', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, editable: true, mixinDefaults: true });
        const onBeforeCellEditorDestroySpy = vi.spyOn(grid.onBeforeCellEditorDestroy, 'notify');
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);
        grid.activateChangedOptions();
        const result = grid.getCanvasWidth();

        expect(result).toBe(80);
        expect(grid.getAbsoluteColumnMinWidth()).toBe(0);
        expect(grid.getHeaderColumnWidthDiff()).toBe(0);
        expect(onBeforeCellEditorDestroySpy).not.toHaveBeenCalled();
      });

      it('should return default full grid width when column is not wider than grid but fullWidthRows is enabled', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, fullWidthRows: true });
        const result = grid.getCanvasWidth();

        expect(result).toBe(DEFAULT_GRID_WIDTH);
      });

      it('should return original grid width of 800px', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, fullWidthRows: true });
        const result = grid.getCanvasWidth();

        expect(result).toBe(DEFAULT_GRID_WIDTH);
      });

      it('should remove Grid Menu width from the last header when scrollbar width is collapsed and columns are wider than canvas', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', width: 800 },
          { id: 'lastName', field: 'lastName', name: 'Last Name', width: 800 },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          gridMenu: { menuWidth: 18 },
        });
        grid.init();

        const headerElms = container.querySelectorAll<HTMLElement>('.slick-header-columns .slick-header-column');
        const firstHeaderWidth = parseFloat(headerElms[0].style.width || '0');
        const lastHeaderWidth = parseFloat(headerElms[1].style.width || '0');

        expect(firstHeaderWidth).toBe(800);
        expect(lastHeaderWidth).toBe(800);
        expect(firstHeaderWidth - lastHeaderWidth).toBe(0);
      });

      it('should only remove last column compensation from header width when scrollbar width is visible', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', width: 80 },
          { id: 'lastName', field: 'lastName', name: 'Last Name', width: 80 },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          gridMenu: { menuWidth: 18 },
        });
        grid.init();

        (grid as any).scrollbarDimensions = { width: 12, height: 12 };
        (grid as any).createColumnHeaders();
        (grid as any).applyColumnHeaderWidths();

        const headerElms = container.querySelectorAll<HTMLElement>('.slick-header-columns .slick-header-column');
        const firstHeaderWidth = parseFloat(headerElms[0].style.width || '0');
        const lastHeaderWidth = parseFloat(headerElms[1].style.width || '0');

        expect(firstHeaderWidth).toBe(80);
        expect(lastHeaderWidth).toBe(80);
        expect(firstHeaderWidth - lastHeaderWidth).toBe(0);
      });

      it('should use default Grid Menu width fallback when scrollbar width is collapsed and menu width is undefined and columns are wider than canvas', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', width: 800 },
          { id: 'lastName', field: 'lastName', name: 'Last Name', width: 800 },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          gridMenu: {},
        });
        grid.init();

        (grid as any).scrollbarDimensions = { width: 0, height: 12 };
        (grid as any).createColumnHeaders();
        (grid as any).applyColumnHeaderWidths();

        const headerElms = container.querySelectorAll<HTMLElement>('.slick-header-columns .slick-header-column');
        const firstHeaderWidth = parseFloat(headerElms[0].style.width || '0');
        const lastHeaderWidth = parseFloat(headerElms[1].style.width || '0');

        expect(firstHeaderWidth).toBe(800);
        expect(lastHeaderWidth).toBe(800);
        expect(firstHeaderWidth - lastHeaderWidth).toBe(0);
      });

      it('should define rowspan and test mandatory rows are always rendered', () => {
        const metadata: any = {
          0: { columns: { 0: { colspan: 2, rowspan: 28 } } },
        };
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', colspan: 2, rowspan: 2 },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'Age' },
          { id: 'gender', field: 'gender', name: 'gender' },
          { id: 'scholarity', field: 'scholarity', name: 'scholarity', colspan: '*' },
          { id: 'bornCity', field: 'bornCity', name: 'bornCity' },
        ] as Column[];
        const gridOptions = { ...defaultOptions, enableCellRowSpan: true, createFooterRow: true, showFooterRow: false, minRowBuffer: 10 } as GridOption;
        const data: any[] = [];
        for (let i = 0; i < 1000; i++) {
          data.push({ id: i, firstName: 'John', lastName: 'Doe', age: 30 });
        }
        const dv = new SlickDataView({ globalItemMetadataProvider: { getRowMetadata: (row) => metadata[row] } });
        dv.setItems(data);
        grid = new SlickGrid<any, Column>(container, dv, columns, gridOptions);
        vi.spyOn(grid, 'getRowSpanIntersect') // add a rowspan mandatory row to always render
          .mockReturnValue(2);
        const getDataSpy = vi.spyOn(grid, 'getDataItem');

        grid.init();
        vi.spyOn(grid, 'getRenderedRange').mockReturnValue({ leftPx: 200, rightPx: 12, bottom: 80, top: 42 });
        vi.spyOn(dv, 'getItemMetadata').mockReturnValue({
          cssClasses: 'text-bold',
          focusable: true,
          formatter: (_row: number, _col: number, val: any) => val,
          columns: { 0: { colspan: '2:30' } },
        });

        grid.scrollCellIntoView(200, 0);
        vi.spyOn(grid, 'getRowSpanIntersect').mockReturnValueOnce(1); // add a rowspan mandatory row to always render
        vi.spyOn(grid, 'getRowSpanColumnIntersects').mockReturnValue([2, 3]);
        vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(data.length + 1); // add 1 more to force a full rowspan cache remap
        const remapRowspanSpy = vi.spyOn(grid, 'remapAllColumnsRowSpan');
        grid.updateRowCount();

        const slickCells = document.querySelectorAll<HTMLDivElement>('.slick-cell');
        const slickCell0 = document.querySelector('.slick-cell.l0.r0') as HTMLDivElement;

        expect(remapRowspanSpy).toHaveBeenCalled();
        expect(slickCell0).toBeTruthy();
        expect(slickCells.length).toBe(48);
        expect(getDataSpy).toHaveBeenCalledTimes(32);
      });

      describe('getViewportHeight() method', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', alwaysRenderColumn: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'Age' },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
          { id: 2, firstName: 'Bob', lastName: 'Smith', age: 48 },
          { id: 3, firstName: 'Arnold', lastName: 'Smith', age: 37 },
        ];

        it('should return full viewport height by data size when "autoHeight" is enabled', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, autoHeight: true });
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_COLUMN_HEIGHT * data.length);
        });
        it('should reserve one row height when autoHeight has no rows', () => {
          grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, autoHeight: true });
          grid.init();
          expect(grid.getViewportHeight()).toBe(0);
        });

        it('should return full viewport height by data size when "autoHeight" is enabled and has column pinning', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, autoHeight: true, pinning: { columns: { left: 1 } } });
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_COLUMN_HEIGHT * data.length);
        });

        it('should return full viewport height by data size + headerRow & preHeader when they are enabled with "autoHeight"', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, {
            ...defaultOptions,
            autoHeight: true,
            forceFitColumns: true,
            showHeaderRow: true,
            headerRowHeight: 50,
            createPreHeaderPanel: true,
            showPreHeaderPanel: true,
            preHeaderPanelHeight: 44,
          });
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_COLUMN_HEIGHT * data.length);
          expect(grid.getCanvasWidth()).toBeGreaterThanOrEqual(799);
          expect(grid.getCanvasWidth()).toBeLessThanOrEqual(801);
        });

        it('should return full viewport height by data size + headerRow & footerRow when they are enabled with "autoHeight"', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, {
            ...defaultOptions,
            autoHeight: true,
            forceFitColumns: true,
            headerRowHeight: 50,
            showHeaderRow: true,
            footerRowHeight: 40,
            createFooterRow: true,
            showFooterRow: true,
          });
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_COLUMN_HEIGHT * data.length);
          expect(grid.getCanvasWidth()).toBeGreaterThanOrEqual(799);
          expect(grid.getCanvasWidth()).toBeLessThanOrEqual(801);
        });

        it('should return original grid height when calling method', () => {
          const data = [
            { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
            { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
            { id: 2, firstName: 'Bob', lastName: 'Smith', age: 48 },
            { id: 3, firstName: 'Arnold', lastName: 'Smith', age: 37 },
          ];
          grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_GRID_HEIGHT);
        });

        it('should return original grid height minus headerRow & footerRow heights when calling method', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, {
            ...defaultOptions,
            headerRowHeight: 50,
            showHeaderRow: true,
            footerRowHeight: 40,
            createFooterRow: true,
            showFooterRow: true,
          });
          grid.init();

          expect(grid.getViewportHeight()).toBe(DEFAULT_GRID_HEIGHT - 50 - 40);
        });
      });
    });

    describe('updateColumnHeader() method', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];

      it('should be able to change Header text content and title tooltip', () => {
        grid = new SlickGrid<any, Column>(container, [], [...columns], defaultOptions);
        const onBeforeHeaderSpy = vi.spyOn(grid.onBeforeHeaderCellDestroy, 'notify');
        const onHeaderCellRenderSpy = vi.spyOn(grid.onHeaderCellRendered, 'notify');
        let column2Elm = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');
        expect(column2Elm[1].textContent).toBe('Last Name');

        grid.updateColumnHeader('lastName', 'Middle Name', 'middle name tooltip');

        column2Elm = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');
        expect(column2Elm[1].textContent).toBe('Middle Name');
        expect(column2Elm[1].title).toBe('middle name tooltip');
        expect(onBeforeHeaderSpy).toHaveBeenCalled();
        expect(onHeaderCellRenderSpy).toHaveBeenCalled();
      });

      it('should not be able to change Header text content when enabling "explicitInitialization" and we called updateColumnHeader() and init() was not called', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, explicitInitialization: true });

        grid.updateColumnHeader('lastName', 'Middle Name', 'middle name tooltip');

        const column2Elm = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');
        expect(column2Elm.length).toBe(0);
      });

      it('should not be able to change any Header text content when column provided is invalid', () => {
        grid = new SlickGrid<any, Column>(container, [], [...columns], defaultOptions);
        let column2Elm = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');
        expect(column2Elm[1].textContent).toBe('Last Name');

        grid.updateColumnHeader('unknown', 'Middle Name', 'middle name tooltip');

        column2Elm = container.querySelectorAll<HTMLDivElement>('.slick-header-columns .slick-header-column');
        expect(column2Elm[0].textContent).toBe('First Name');
        expect(column2Elm[1].textContent).toBe('Last Name');
      });
    });

    describe('reRenderColumns() method', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];

      it('should force grid render when calling method with true argument provided', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const invalidateSpy = vi.spyOn(grid, 'invalidateAllRows');
        const renderSpy = vi.spyOn(grid, 'render');

        grid.reRenderColumns(true);

        expect(invalidateSpy).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalled();
      });

      it('should recalculate automatic header height after column widths are rerendered', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, autoHeaderHeight: true });
        const recalculateSpy = vi.spyOn(grid as any, 'recalculateHeaderHeight');

        grid.reRenderColumns();

        expect(recalculateSpy).toHaveBeenCalled();
      });
    });

    describe('automatic header height', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
      ] as Column[];

      it('should ignore recalculation before the left header pane is created', () => {
        grid = new TestGrid(container, [], columns, defaultOptions);

        expect(() => (grid as TestGrid).callRecalculateHeaderHeightWithoutLeftHeader()).not.toThrow();
      });

      it('should remove automatic header-height styles when disabled with setOptions', () => {
        grid = new TestGrid(container, [], columns, { ...defaultOptions, autoHeaderHeight: true, pinning: { columns: { left: 0 } } });
        const headers = [...container.querySelectorAll<HTMLDivElement>('.slick-header')];
        headers.forEach((header, index) => {
          vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ height: 42 + index } as DOMRect);
        });

        (grid as TestGrid).callRecalculateHeaderHeight();
        grid.setOptions({ autoHeaderHeight: false });

        headers.forEach((header) => {
          expect(header.classList).not.toContain('slick-header-auto-height');
          expect(header.style.getPropertyValue('--slick-auto-header-height')).toBe('');
          expect(header.style.height).toBe('');
        });
      });

      it('should recalculate automatic header height after updating columns', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, autoHeaderHeight: true });
        const recalculateSpy = vi.spyOn(grid as any, 'recalculateHeaderHeight');

        grid.updateColumns();

        expect(recalculateSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Editors', () => {
      const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name', editor: LongTextEditor }] as Column[];
      let items: Array<{ id: number; name: string; age: number; active?: boolean }> = [];

      beforeEach(() => {
        items = [
          { id: 0, name: 'Avery', age: 44 },
          { id: 1, name: 'Bob', age: 20 },
          { id: 2, name: 'Rachel', age: 46 },
          { id: 3, name: 'Jane', age: 24 },
          { id: 4, name: 'John', age: 20 },
          { id: 5, name: 'Arnold', age: 50 },
          { id: 6, name: 'Carole', age: 40 },
          { id: 7, name: 'Jason', age: 48 },
          { id: 8, name: 'Julie', age: 42 },
          { id: 9, name: 'Aaron', age: 23 },
          { id: 10, name: 'Ariane', age: 43 },
        ];
      });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('should expect editor when calling getEditController()', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);

        const result = grid.getEditController();

        expect(result).toBeTruthy();
      });

      it('should expect the grid container to have aria attributes set', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);

        expect(grid).toBeTruthy();
        expect(grid.getContainerNode().getAttribute('role')).toBe('grid');
        expect(grid.getContainerNode().getAttribute('aria-colcount')).toBe('1');
        expect(grid.getContainerNode().getAttribute('aria-rowcount')).toBe('11');
      });

      it('should expect the header structure to have required ARIA rowgroup/row roles', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true });

        const headerColumnElm = container.querySelector('[role="columnheader"]') as HTMLDivElement;
        expect(headerColumnElm).toBeTruthy();
        expect(headerColumnElm.parentElement!.classList.contains('slick-header-columns')).toBe(true);
        expect(headerColumnElm.parentElement!.getAttribute('role')).toBe('row');
        expect(headerColumnElm.parentElement!.parentElement!.getAttribute('role')).toBe('rowgroup');

        const headerRowCellElm = container.querySelector('.slick-headerrow-column') as HTMLDivElement;
        expect(headerRowCellElm).toBeTruthy();
        expect(headerRowCellElm.getAttribute('role')).toBe('gridcell');
        expect(headerRowCellElm.parentElement!.getAttribute('role')).toBe('row');
        expect(headerRowCellElm.parentElement!.parentElement!.getAttribute('role')).toBe('rowgroup');
      });

      it('should place focus sinks in the grid container and keep them focusable without aria-hidden', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);

        const focusSink = (grid as any)._focusSink as HTMLDivElement;
        const focusSink2 = (grid as any)._focusSink2 as HTMLDivElement;

        expect(focusSink).toBeTruthy();
        expect(focusSink2).toBeTruthy();
        expect(container.contains(focusSink)).toBe(true);
        expect(container.contains(focusSink2)).toBe(true);
        expect(focusSink.parentElement).toBe(container);
        expect(focusSink2.parentElement).toBe(container);
        expect(focusSink.tabIndex).toBe(0);
        expect(focusSink2.tabIndex).toBe(0);
        expect(focusSink.getAttribute('aria-hidden')).toBeNull();
        expect(focusSink2.getAttribute('aria-hidden')).toBeNull();

        focusSink.focus();
        expect(document.activeElement).toBe(focusSink);
      });

      it('should remove external focus sinks when grid is destroyed', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);

        const focusSink = (grid as any)._focusSink as HTMLDivElement;
        const focusSink2 = (grid as any)._focusSink2 as HTMLDivElement;

        expect(document.body.contains(focusSink)).toBe(true);
        expect(document.body.contains(focusSink2)).toBe(true);

        grid.destroy(true);

        expect(focusSink.isConnected).toBe(false);
        expect(focusSink2.isConnected).toBe(false);
      });

      it('should ignore invalidation after the grid has been destroyed', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);
        grid.init();

        grid.destroy(true);

        expect(() => grid.invalidate()).not.toThrow();
        expect(() => grid.updateRowCount()).not.toThrow();
      });

      it('should ignore a queued ancestor-scroll event after destroy(true)', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, defaultOptions);
        grid.init();

        // Exercise the listener guard while the listener is still attached;
        // destroy(true) subsequently clears the retained DOM references.
        (grid as any).initialized = false;
        expect(() => document.dispatchEvent(new Event('scroll', { bubbles: true }))).not.toThrow();
        (grid as any).initialized = true;
        grid.destroy(true);

        expect(() => document.dispatchEvent(new Event('scroll', { bubbles: true }))).not.toThrow();
      });

      it('should return undefined editor when getDataItem() did not find any associated cell item', () => {
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
        vi.spyOn(grid, 'getDataItem').mockReturnValue(null);
        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);

        const result = grid.getCellEditor();

        expect(result).toBeFalsy();
      });

      it('should return undefined editor when trying to add a new row item and "cannotTriggerInsert" is set', () => {
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', cannotTriggerInsert: true, editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true, autoEditNewRow: false });
        const onBeforeEditCellSpy = vi.spyOn(grid.onBeforeEditCell, 'notify');
        grid.setActiveCell(0, 1);
        vi.spyOn(grid, 'getDataLength').mockReturnValue(0); // trick grid to think it's a new item
        grid.editActiveCell(InputEditor as any, true);

        expect(onBeforeEditCellSpy).not.toHaveBeenCalled();
      });

      it('should return undefined editor when onBeforeEditCell returns false', () => {
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', cannotTriggerInsert: true, editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true, autoEditNewRow: false });
        const sed = new SlickEventData();
        vi.spyOn(sed, 'getReturnValue').mockReturnValue(false);
        vi.spyOn(grid.onBeforeEditCell, 'notify').mockReturnValue(sed);
        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);
        const result = grid.getCellEditor();

        expect(result).toBeFalsy();
      });

      it('should do nothing when trying to commit unchanged Age field Editor', () => {
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);
        const editor = grid.getCellEditor();
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        vi.spyOn(editor!, 'isValueChanged').mockReturnValue(false); // unchanged value

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(onCellChangeSpy).not.toHaveBeenCalled();
        expect(result).toBeTruthy();
      });

      it('should commit Name field Editor via an Editor defined as ItemMetadata by column id & asyncEditorLoading enabled and expect it to call execute() command and triggering onCellChange() notify', () => {
        Object.defineProperty(document, 'selection', { writable: true, value: { empty: () => {} } });
        const newValue = 33;
        const columns = [
          { id: 'name', field: 'name', name: 'Name', colspan: '*' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        const dv = new SlickDataView();
        dv.setItems(items);
        grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true, asyncEditorLoading: true });
        vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns: { age: { colspan: '*', editor: InputEditor } } } as any);
        grid.setActiveCell(0, 1);

        vi.advanceTimersByTime(2);
        const activeCellNode = container.querySelector('.slick-cell.editable.l1.r1');
        grid.editActiveCell(InputEditor as any, true);

        const editor = grid.getCellEditor();
        const updateRowSpy = vi.spyOn(grid, 'updateRow');
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValueOnce(newValue);
        expect(activeCellNode).toBeTruthy();

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(updateRowSpy).toHaveBeenCalledWith(0);
        expect(onCellChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({ command: 'execute', row: 0, cell: 1, item: { id: 0, name: 'Avery', age: newValue }, column: columns[1] }),
          expect.anything(),
          grid
        );
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();
      });

      it('should commit Name field Editor via an Editor defined as ItemMetadata by column id & asyncEditorLoading enabled and expect it to call execute() command and triggering onCellChange() notify', () => {
        (navigator as any).__defineGetter__('userAgent', () => 'Firefox');
        const newValue = 33;
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', colspan: '2', editor: InputEditor },
        ] as Column[];
        const dv = new SlickDataView();
        dv.setItems(items);
        grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true, asyncEditorLoading: true });
        vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns: { 1: { editor: InputEditor } } as any });
        grid.setActiveCell(0, 1);

        vi.advanceTimersByTime(2);
        const activeCellNode = container.querySelector('.slick-cell.editable.l1.r1');
        grid.editActiveCell(InputEditor as any, true);

        const editor = grid.getCellEditor();
        const updateRowSpy = vi.spyOn(grid, 'updateRow');
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValueOnce(newValue);
        expect(activeCellNode).toBeTruthy();

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(updateRowSpy).toHaveBeenCalledWith(0);
        expect(onCellChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({ command: 'execute', row: 0, cell: 1, item: { id: 0, name: 'Avery', age: newValue }, column: columns[1] }),
          expect.anything(),
          grid
        );
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();
      });

      it('should commit Age field Editor by calling execute() command and triggering onCellChange() notify', () => {
        const newValue = 33;
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: LongTextEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
        const onPositionSpy = vi.spyOn(grid.onActiveCellPositionChanged, 'notify');
        grid.setActiveCell(0, 1);
        grid.editActiveCell(LongTextEditor as any, true);
        const editor = grid.getCellEditor();
        const updateRowSpy = vi.spyOn(grid, 'updateRow');
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValue(newValue);

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(onPositionSpy).toHaveBeenCalled();
        expect(editor).toBeTruthy();
        expect(updateRowSpy).toHaveBeenCalledWith(0);
        expect(onCellChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({ command: 'execute', row: 0, cell: 1, item: { id: 0, name: 'Avery', age: newValue }, column: columns[1] }),
          expect.anything(),
          grid
        );
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();

        // test hide editor when editor is already opened but we start scrolling
        vi.spyOn(grid, 'getActiveCellPosition').mockReturnValue({ visible: false } as any);
        const canvasBottom = container.querySelector('.slick-viewport-left');
        grid.setActiveCell(0, 1);
        grid.editActiveCell(LongTextEditor as any, true);
        const hideEditorSpy = vi.spyOn(grid.getCellEditor()!, 'hide');
        canvasBottom?.dispatchEvent(new Event('scroll'));
        expect(hideEditorSpy).toHaveBeenCalled();
      });

      it('should commit Active field Editor by calling execute() command with preClick and triggering onCellChange() notify', () => {
        const newValue = false;
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: CheckboxEditor },
          { id: 'active', field: 'active', name: 'Active', type: 'boolean' },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
        grid.setActiveCell(0, 1, true);
        const editor = grid.getCellEditor();
        const updateRowSpy = vi.spyOn(grid, 'updateRow');
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        const preClickSpy = vi.spyOn(CheckboxEditor.prototype, 'preClick');
        vi.spyOn(editor!, 'serializeValue').mockReturnValueOnce(newValue);
        grid.editActiveCell(CheckboxEditor as any, true);

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(preClickSpy).toHaveBeenCalled();
        expect(editor).toBeTruthy();
        expect(updateRowSpy).toHaveBeenCalledWith(0);
        expect(onCellChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ command: 'execute', row: 0, cell: 1 }), expect.anything(), grid);
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();
      });

      it('should commit & rollback Age field Editor by calling execute() & undo() commands from a custom EditCommandHandler and triggering onCellChange() notify', () => {
        const newValue = 33;
        const editQueue: Array<{ item: any; column: Column; editCommand: EditCommand }> = [];
        const undoLastEdit = () => {
          const lastEditCommand = editQueue.pop()?.editCommand;
          if (lastEditCommand && grid.getEditorLock().cancelCurrentEdit()) {
            lastEditCommand.undo();
            grid.invalidate();
          }
        };
        const editCommandHandler = (item: any, column: Column, editCommand: EditCommand) => {
          if (editCommand.prevSerializedValue !== editCommand.serializedValue) {
            editQueue.push({ item, column, editCommand });
            grid.invalidate();
            editCommand.execute();
          }
        };
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];

        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true, editCommandHandler });
        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);
        const editor = grid.getCellEditor();
        const updateRowSpy = vi.spyOn(grid, 'updateRow');
        const onCellChangeSpy = vi.spyOn(grid.onCellChange, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValueOnce(newValue);

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(updateRowSpy).toHaveBeenCalledWith(0);
        expect(onCellChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({ command: 'execute', row: 0, cell: 1, item: { id: 0, name: 'Avery', age: newValue }, column: columns[1] }),
          expect.anything(),
          grid
        );
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();

        undoLastEdit();

        expect(onCellChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({ command: 'undo', row: 0, cell: 1, item: { id: 0, name: 'Avery', age: '44' }, column: columns[1] }),
          expect.anything(),
          grid
        );
      });

      it('should commit Age field Editor by applying new values and triggering onAddNewRow() notify', () => {
        const newValue = 77;
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, enableAddRow: true, editable: true });

        grid.setActiveCell(1, 1);
        grid.editActiveCell(InputEditor as any, true);
        const editor = grid.getCellEditor();
        vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(0); // trick grid to think it's a new item
        const onAddNewRowSpy = vi.spyOn(grid.onAddNewRow, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValue(newValue);

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(onAddNewRowSpy).toHaveBeenCalledWith(expect.objectContaining({ item: { age: newValue }, column: columns[1] }), expect.anything(), grid);
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();
      });

      it('should commit Age field Editor by applying new values and triggering onAddNewRow() notify with autoHeight enabled and expect different viewport height', () => {
        const newValue = 77;
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, {
          ...defaultOptions,
          autoHeight: true,
          enableCellNavigation: true,
          enableAddRow: true,
          editable: true,
        });
        const prevHeight = grid.getViewportHeight();
        grid.onAddNewRow.subscribe((e, args) => {
          grid.setData([...(grid.getData() as any[]), args.item]);
        });

        grid.setActiveCell(1, 1);
        grid.editActiveCell(InputEditor as any, true);
        const editor = grid.getCellEditor();
        vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(0); // trick grid to think it's a new item
        const onAddNewRowSpy = vi.spyOn(grid.onAddNewRow, 'notify');
        vi.spyOn(editor!, 'serializeValue').mockReturnValue(newValue);

        const result = grid.getEditController()?.commitCurrentEdit();
        const newHeight = grid.getViewportHeight();

        expect(editor).toBeTruthy();
        expect(onAddNewRowSpy).toHaveBeenCalledWith(expect.objectContaining({ item: { age: newValue }, column: columns[1] }), expect.anything(), grid);
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeTruthy();
        expect(prevHeight).not.toEqual(newHeight);
      });

      it('should not commit Age field Editor returns invalid result, expect triggering onValidationError() notify', () => {
        const invalidResult = { valid: false, msg: 'invalid value' };
        const columns = [
          { id: 'name', field: 'name', name: 'Name' },
          { id: 'age', field: 'age', name: 'Age', type: 'number', editor: InputEditor },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);
        const editor = grid.getCellEditor();
        const onValidationErrorSpy = vi.spyOn(grid.onValidationError, 'notify');
        vi.spyOn(editor!, 'validate').mockReturnValue(invalidResult);
        const activeCellNode = container.querySelector('.slick-cell.editable.l1.r1');

        const result = grid.getEditController()?.commitCurrentEdit();

        expect(editor).toBeTruthy();
        expect(onValidationErrorSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            editor,
            cellNode: activeCellNode,
            validationResults: invalidResult,
            row: 0,
            cell: 1,
            column: columns[1],
          }),
          expect.anything(),
          grid
        );
        expect(grid.getEditController()).toBeTruthy();
        expect(result).toBeFalsy();
      });
    });

    describe('Column Reorder', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];

      /** Helper: dispatch a dragstart event on a column element (bubbles to parent handler) */
      const fireDragStart = (el: HTMLElement) => {
        const evt = new Event('dragstart', { bubbles: true, cancelable: true }) as DragEvent;
        Object.defineProperty(evt, 'dataTransfer', { value: { effectAllowed: '', setDragImage: vi.fn() } });
        Object.defineProperty(evt, 'offsetX', { value: 10 });
        Object.defineProperty(evt, 'offsetY', { value: 5 });
        el.dispatchEvent(evt);
        return evt;
      };

      /** Helper: dispatch a dragend event on a column element */
      const fireDragEnd = (el: HTMLElement) => {
        const evt = new Event('dragend', { bubbles: true, cancelable: true }) as DragEvent;
        el.dispatchEvent(evt);
        return evt;
      };

      /** Helper: find a header column by its data-id attribute */
      const findCol = (parent: HTMLElement, id: string) => parent.querySelector<HTMLElement>(`[data-id="${id}"]`)!;

      const dispatchDocumentDrag = (pageX: number, clientX = pageX, clientY = 10) => {
        const event = new Event('drag');
        Object.defineProperties(event, {
          pageX: { value: pageX },
          clientX: { value: clientX },
          clientY: { value: clientY },
        });
        document.dispatchEvent(event);
      };

      it('should reorder column to the left when current column pageX is lower than viewport left position', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as any;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0 } as DOMRect);

        fireDragStart(findCol(headerL, 'firstName'));

        // simulate reorder: age moved before lastName → [firstName, age, lastName]
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'lastName'));

        dispatchDocumentDrag(20); // pageX < viewportLeft → scroll left
        expect(viewportTopLeft.scrollLeft).toBe(0);

        vi.advanceTimersByTime(30);
        expect(viewportTopLeft.scrollLeft).toBe(-10);

        fireDragEnd(findCol(headerL, 'firstName'));
        expect(onColumnsReorderedSpy).toHaveBeenCalled();
      });

      it('should reorder column to the right when current column pageX is greater than container width', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as any;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0 } as DOMRect);

        fireDragStart(findCol(headerL, 'firstName'));

        // simulate reorder: age moved before lastName → [firstName, age, lastName]
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'lastName'));

        dispatchDocumentDrag(DEFAULT_GRID_WIDTH + 11); // pageX > containerRight → scroll right
        expect(viewportTopLeft.scrollLeft).toBe(0);

        vi.advanceTimersByTime(30);
        expect(viewportTopLeft.scrollLeft).toBe(10);

        fireDragEnd(findCol(headerL, 'firstName'));
        expect(onColumnsReorderedSpy).toHaveBeenCalled();
      });

      it('should not trigger "onColumnsReordered" neither reorder column when column order is the same', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');

        fireDragStart(findCol(headerL, 'firstName'));
        // no DOM manipulation → same order as original

        fireDragEnd(findCol(headerL, 'firstName'));
        expect(onColumnsReorderedSpy).not.toHaveBeenCalled();
      });

      it('should ignore dragend when dragstart did not initialize reorder state', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');
        const initialOrder = grid.getColumns().map((col) => col.id);

        // Trigger dragend directly so onDragEnd runs with undefined columnMap.
        fireDragEnd(findCol(headerL, 'firstName'));

        expect(onColumnsReorderedSpy).not.toHaveBeenCalled();
        expect(grid.getColumns().map((col) => col.id)).toEqual(initialOrder);
      });

      it('should stop auto-scroll when cursor moves back into safe zone during drag', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0 } as DOMRect);

        fireDragStart(findCol(headerL, 'firstName'));

        // first drag beyond container right → starts scroll timer
        const docDragEvt = new Event('drag') as DragEvent;
        Object.defineProperty(docDragEvt, 'pageX', { writable: true, value: DEFAULT_GRID_WIDTH + 11 });
        Object.defineProperty(docDragEvt, 'clientX', { writable: true, value: DEFAULT_GRID_WIDTH + 11 });
        Object.defineProperty(docDragEvt, 'clientY', { writable: true, value: 10 });
        document.dispatchEvent(docDragEvt);
        vi.advanceTimersByTime(30);
        expect(viewportTopLeft.scrollLeft).toBe(10);

        // move cursor back into safe zone → timer stops
        const docDragSafe = new Event('drag') as DragEvent;
        Object.defineProperty(docDragSafe, 'pageX', { writable: true, value: DEFAULT_GRID_WIDTH / 2 });
        Object.defineProperty(docDragSafe, 'clientX', { writable: true, value: DEFAULT_GRID_WIDTH / 2 });
        Object.defineProperty(docDragSafe, 'clientY', { writable: true, value: 10 });
        document.dispatchEvent(docDragSafe);

        viewportTopLeft.scrollLeft = 0;
        vi.advanceTimersByTime(30);
        expect(viewportTopLeft.scrollLeft).toBe(0); // no more auto-scrolling

        fireDragEnd(findCol(headerL, 'firstName'));
      });

      it('should try reordering column but stay at same scroll position when grid has frozen columns', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, pinning: { columns: { left: 0 } } });
        grid.setActiveCell(0, 1);
        // pinning: { columns: { left: 0 } } → headerL has [firstName], headerR has [lastName, age]
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0 } as DOMRect);

        // drag the frozen left column (canAutoScroll = false → no scroll)
        const frozenColEl = headerL.querySelector<HTMLElement>('.slick-header-column')!;
        fireDragStart(frozenColEl);

        const docDragEvt = new Event('drag') as DragEvent;
        Object.defineProperty(docDragEvt, 'pageX', { writable: true, value: DEFAULT_GRID_WIDTH + 11 });
        Object.defineProperty(docDragEvt, 'clientX', { writable: true, value: DEFAULT_GRID_WIDTH + 11 });
        Object.defineProperty(docDragEvt, 'clientY', { writable: true, value: 10 });
        document.dispatchEvent(docDragEvt);
        vi.advanceTimersByTime(30);
        expect(viewportTopLeft.scrollLeft).toBe(0); // frozen left column cannot trigger scroll

        fireDragEnd(frozenColEl);
        expect(onColumnsReorderedSpy).not.toHaveBeenCalled(); // same order
      });

      it('should not allow column reordering when Editor Lock commitCurrentEdit() is failing', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, pinning: { columns: { left: 0 } } });
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');

        const frozenColEl = headerL.querySelector<HTMLElement>('.slick-header-column')!;
        fireDragStart(frozenColEl);
        fireDragEnd(frozenColEl);
        expect(onColumnsReorderedSpy).not.toHaveBeenCalled();
      });

      it('should preserve hidden columns at their original indices when reordering visible columns', () => {
        const columnsWithHidden = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
          { id: 'middleName', field: 'middleName', name: 'Middle Name', sortable: true, hidden: true },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columnsWithHidden, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;
        const onColumnsReorderedSpy = vi.spyOn(grid.onColumnsReordered, 'notify');

        fireDragStart(findCol(headerL, 'firstName'));
        // Simulate: lastName moved before firstName → [lastName, firstName, age]
        headerL.insertBefore(findCol(headerL, 'lastName'), findCol(headerL, 'firstName'));
        fireDragEnd(findCol(headerL, 'lastName'));

        const finalColumns = grid.getColumns();
        // Expected: lastName, firstName, middleName (hidden stays at index 2), age
        expect(finalColumns[0].id).toBe('lastName');
        expect(finalColumns[1].id).toBe('firstName');
        expect(finalColumns[2].id).toBe('middleName'); // hidden column stays at original position
        expect(finalColumns[2].hidden).toBe(true);
        expect(finalColumns[3].id).toBe('age');
        expect(onColumnsReorderedSpy).toHaveBeenCalled();
      });

      it('should preserve multiple hidden columns at their original indices when reordering', () => {
        const columnsWithMultipleHidden = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'middleName', field: 'middleName', name: 'Middle Name', sortable: true, hidden: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
          { id: 'suffix', field: 'suffix', name: 'Suffix', sortable: true, hidden: true },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columnsWithMultipleHidden, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;

        fireDragStart(findCol(headerL, 'firstName'));
        // Simulate: ['age', 'firstName', 'lastName'] — move age before firstName
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'firstName'));
        fireDragEnd(findCol(headerL, 'age'));

        const finalColumns = grid.getColumns();
        // Expected: age, middleName(hidden at idx 1), firstName, suffix(hidden at idx 3), lastName
        expect(finalColumns[0].id).toBe('age');
        expect(finalColumns[1].id).toBe('middleName');
        expect(finalColumns[1].hidden).toBe(true);
        expect(finalColumns[2].id).toBe('firstName');
        expect(finalColumns[3].id).toBe('suffix');
        expect(finalColumns[3].hidden).toBe(true);
        expect(finalColumns[4].id).toBe('lastName');
      });

      it('should handle reordering when hidden column is at the beginning', () => {
        const columnsWithHiddenFirst = [
          { id: 'id', field: 'id', name: 'ID', sortable: true, hidden: true },
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columnsWithHiddenFirst, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;

        fireDragStart(findCol(headerL, 'firstName'));
        // Simulate: ['lastName', 'age', 'firstName']
        headerL.insertBefore(findCol(headerL, 'lastName'), findCol(headerL, 'firstName'));
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'firstName'));
        fireDragEnd(findCol(headerL, 'lastName'));

        const finalColumns = grid.getColumns();
        // Expected: id(hidden at idx 0), lastName, age, firstName
        expect(finalColumns[0].id).toBe('id');
        expect(finalColumns[0].hidden).toBe(true);
        expect(finalColumns[1].id).toBe('lastName');
        expect(finalColumns[2].id).toBe('age');
        expect(finalColumns[3].id).toBe('firstName');
      });

      it('should handle reordering when hidden column is at the end', () => {
        const columnsWithHiddenLast = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
          { id: 'metadata', field: 'metadata', name: 'Metadata', sortable: true, hidden: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columnsWithHiddenLast, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;

        fireDragStart(findCol(headerL, 'firstName'));
        // Simulate: ['age', 'firstName', 'lastName']
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'firstName'));
        fireDragEnd(findCol(headerL, 'age'));

        const finalColumns = grid.getColumns();
        // Expected: age, firstName, lastName, metadata(hidden at idx 3)
        expect(finalColumns[0].id).toBe('age');
        expect(finalColumns[1].id).toBe('firstName');
        expect(finalColumns[2].id).toBe('lastName');
        expect(finalColumns[3].id).toBe('metadata');
        expect(finalColumns[3].hidden).toBe(true);
      });

      it('should preserve non-reorderable visible columns at their original index while reordering others', () => {
        const columnsWithFixedMiddle = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true, reorderable: false },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columnsWithFixedMiddle, defaultOptions);
        const headerL = document.querySelector<HTMLElement>('.slick-header-columns.slick-header-columns-left')!;

        fireDragStart(findCol(headerL, 'firstName'));
        // Simulate visible draggable order: [age, firstName] while fixed lastName stays excluded from draggable list
        headerL.insertBefore(findCol(headerL, 'age'), findCol(headerL, 'firstName'));
        fireDragEnd(findCol(headerL, 'age'));

        const finalColumns = grid.getColumns();
        expect(finalColumns[0].id).toBe('age');
        expect(finalColumns[1].id).toBe('lastName');
        expect(finalColumns[1].reorderable).toBe(false);
        expect(finalColumns[2].id).toBe('firstName');
      });
    });

    describe('Drag & Drop (Draggable)', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        {
          id: 'lastName',
          field: 'lastName',
          name: 'Last Name',
          sortable: true,
          asyncPostRender: (node) => (node.textContent = String(Math.random())),
          asyncPostRenderCleanup: (node) => (node.textContent = ''),
        },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];
      for (let i = 0; i < 500; i++) {
        data[i] = {
          id: i,
          firstName: i % 2 ? 'John' : 'Jane',
          lastName: 'Doe',
          age: Math.random(),
        };
      }

      it('should not drag when cell is not in found in the grid', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify');
        const slickCellElm = Utils.createDomElement('div', { className: 'slick-cell l0' });
        const cMouseDownEvent = new CustomEvent('mousedown');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        container.dispatchEvent(cMouseDownEvent);

        expect(onDragInitSpy).not.toHaveBeenCalled();
      });

      it('should prevent modifier-key drags by default', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
        });
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        const cMouseDownEvent = new MouseEvent('mousedown', { bubbles: true, ctrlKey: true });
        slickCellElm.dispatchEvent(cMouseDownEvent);

        expect(onDragInitSpy).not.toHaveBeenCalled();
      });

      it('should not drag when event has cancelled bubbling (immediatePropagationStopped)', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        const cMouseDownEvent = new CustomEvent('mousedown');
        const sedMouseDown = new SlickEventData();
        sedMouseDown.addReturnValue(false);
        sedMouseDown.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedMouseDown);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        bodyMouseMoveEvent.stopImmediatePropagation(); // simulate bubbling stop from dragInit
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: slickCellElm });
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).not.toHaveBeenCalled();
        expect(onDragSpy).not.toHaveBeenCalled();
        expect(onDragEndSpy).not.toHaveBeenCalled();
      });

      it('should not execute any events after onDragInit when it returns false', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        const cMouseDownEvent = new CustomEvent('mousedown');
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify');
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: slickCellElm });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent1);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).not.toHaveBeenCalled();
        expect(onDragSpy).not.toHaveBeenCalled();
        expect(onDragEndSpy).not.toHaveBeenCalled();
      });

      it('should not execute onDragStart or any other events when onDragStart event has cancelled bubbling (immediatePropagationStopped)', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        const cMouseDownEvent = new CustomEvent('mousedown');
        const sedDragInit = new SlickEventData();
        const sedDragStart = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragStart.addReturnValue(false);
        sedDragInit.stopImmediatePropagation();
        sedDragStart.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify').mockReturnValue(sedDragStart);
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: slickCellElm });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent1);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();
      });

      it('should not execute onDragStart when cell has an Editor but commitCurrentEdit() returns false', () => {
        columns[1].editor = InputEditor;
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, editable: true });
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);

        const cMouseDownEvent = new CustomEvent('mousedown');
        const sedDragInit = new SlickEventData();
        const sedDragStart = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragStart.addReturnValue(false);
        sedDragInit.stopImmediatePropagation();
        sedDragStart.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: slickCellElm });

        grid.setActiveCell(0, 1);
        grid.editActiveCell(InputEditor as any, true);
        container.dispatchEvent(cMouseDownEvent);

        document.body.dispatchEvent(bodyMouseMoveEvent1);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();
      });

      it('should drag from a cell and execute all onDrag events when a slick-cell is dragged and its event is stopped', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        const sedDragInit = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragInit.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 20 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientY', { writable: true, value: 18 });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();
      });

      it('should drag from a cell and execute all onDrag events then cleanup async renderer when a slick-cell is dragged and its event is stopped', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          rowHeight: 2200,
          enableAsyncPostRender: true,
          enableAsyncPostRenderCleanup: true,
        });
        const onViewportChangedSpy = vi.spyOn(grid.onViewportChanged, 'notify');
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0, height: 223 } as DOMRect);
        Object.defineProperty(viewportTopLeft, 'scrollTop', { writable: true, value: 3000 });
        Object.defineProperty(viewportTopLeft, 'scrollLeft', { writable: true, value: 88 });
        Object.defineProperty(viewportTopLeft, 'scrollHeight', { writable: true, value: 440 });
        Object.defineProperty(viewportTopLeft, 'scrollWidth', { writable: true, value: 459 });
        Object.defineProperty(viewportTopLeft, 'clientHeight', { writable: true, value: 223 });
        Object.defineProperty(viewportTopLeft, 'clientWidth', { writable: true, value: 128 });

        const sedDragInit = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragInit.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 20 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientY', { writable: true, value: 18 });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        window.dispatchEvent(bodyMouseUpEvent);
        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();

        grid.scrollRowIntoView(30);
        expect((document.querySelector('.slick-row.odd') as HTMLDivElement).style.transform).toMatch(/^translateY\([0-9]*px\)$/gi);
        grid.setActiveRow(30);
        grid.scrollTo(33);
        vi.advanceTimersByTime(10);

        vi.spyOn(grid, 'getCellNode').mockReturnValueOnce(document.createElement('div'));
        grid.updateCell(30, 1);
        grid.invalidateRows([31]);
        grid.scrollTo(2);
        vi.advanceTimersByTime(12);

        expect(onViewportChangedSpy).toHaveBeenCalled();
      });

      it('should update row transforms when scrolling', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          rowHeight: 2200,
          enableAsyncPostRender: true,
          enableAsyncPostRenderCleanup: true,
        });
        const onViewportChangedSpy = vi.spyOn(grid.onViewportChanged, 'notify');
        const viewportTopLeft = document.querySelector('.slick-viewport-top.slick-viewport-left') as HTMLDivElement;
        vi.spyOn(viewportTopLeft, 'getBoundingClientRect').mockReturnValue({ left: 25, top: 10, right: 0, bottom: 0, height: 223 } as DOMRect);
        Object.defineProperty(viewportTopLeft, 'scrollTop', { writable: true, value: 3000 });
        Object.defineProperty(viewportTopLeft, 'scrollLeft', { writable: true, value: 88 });
        Object.defineProperty(viewportTopLeft, 'scrollHeight', { writable: true, value: 440 });
        Object.defineProperty(viewportTopLeft, 'scrollWidth', { writable: true, value: 459 });
        Object.defineProperty(viewportTopLeft, 'clientHeight', { writable: true, value: 223 });
        Object.defineProperty(viewportTopLeft, 'clientWidth', { writable: true, value: 128 });

        const sedDragInit = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragInit.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: slickCellElm });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 20 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientY', { writable: true, value: 18 });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        window.dispatchEvent(bodyMouseUpEvent);
        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();

        grid.scrollRowIntoView(30);
        expect((document.querySelector('.slick-row.odd') as HTMLDivElement).style.transform).toMatch(/^translateY\([0-9]*px\)$/gi);
        grid.setActiveRow(30);
        grid.scrollTo(33);
        vi.advanceTimersByTime(10);

        grid.updateCell(0, 1);
        grid.invalidateRows([31]);
        grid.scrollTo(2);
        vi.advanceTimersByTime(12);

        expect(onViewportChangedSpy).toHaveBeenCalled();
      });

      it('should drag from a cell and execute all onDrag events except onDragStart when mousemove event target is not a slick-cell', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);

        const sedDragInit = new SlickEventData();
        sedDragInit.addReturnValue(true);
        sedDragInit.stopImmediatePropagation();
        const onDragInitSpy = vi.spyOn(grid.onDragInit, 'notify').mockReturnValue(sedDragInit);
        const onDragStartSpy = vi.spyOn(grid.onDragStart, 'notify');
        const onDragSpy = vi.spyOn(grid.onDrag, 'notify');
        const onDragEndSpy = vi.spyOn(grid.onDragEnd, 'notify');
        const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
        slickCellElm.classList.add('dnd', 'cell-reorder');

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(cMouseDownEvent, 'target', { writable: true, value: slickCellElm });
        // Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: null });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 20 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientY', { writable: true, value: 18 });

        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        window.dispatchEvent(bodyMouseUpEvent);

        expect(onDragInitSpy).toHaveBeenCalled();
        expect(onDragStartSpy).not.toHaveBeenCalled();
        expect(onDragSpy).toHaveBeenCalled();
        expect(onDragEndSpy).toHaveBeenCalled();
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

      it('should resize should not go through when column has an editor', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false });
        // grid.init();

        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 9 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: -22 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        // document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
      });

      it('should resize 2nd column that has a "width" defined using default sizing grid options', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, autoHeaderHeight: true, forceFitColumns: false });
        grid.init();
        const commitCurrentEditSpy = vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValue(true);

        const recalculateSpy = vi.spyOn(grid as any, 'recalculateHeaderHeight');
        const sedOnBeforeResize = new SlickEventData();
        sedOnBeforeResize.addReturnValue(true);
        vi.spyOn(grid.onBeforeColumnsResize, 'notify').mockReturnValue(sedOnBeforeResize);
        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 9, clientY: 12 });
        const bodyMouseMoveEvent = new MouseEvent('mousemove', { clientX: -22, clientY: 13 });
        const bodyMouseUpEvent = new MouseEvent('mouseup');

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
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
        expect(recalculateSpy).toHaveBeenCalledTimes(1);
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(65);
        expect(columns[3].width).toBe(86);
        expect(columns[4].width).toBe(80);
        commitCurrentEditSpy.mockRestore();
      });

      it('should resize 3rd column that has a "minWidth" defined using default sizing grid options', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false, syncColumnCellResize: true });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

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
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);

        vi.advanceTimersByTime(10);

        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(59);
        expect(columns[3].width).toBe(88);
        expect(columns[4].width).toBe(80);
      });

      it('should resize 3rd column that has a "minWidth" defined using default sizing grid options with a pinned column', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
          pinning: { columns: { left: 0 } },
          syncColumnCellResize: true,
        });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const invalidateRowSpy = vi.spyOn(grid, 'invalidateAllRows');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(columnElms[0], 'offsetWidth', { writable: true, value: 40 });
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 9 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: -22 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        Object.defineProperty(columnElms[0], 'offsetWidth', { writable: true, value: 38 });
        document.body.dispatchEvent(bodyMouseUpEvent);

        vi.advanceTimersByTime(10);

        expect(invalidateRowSpy).toHaveBeenCalled();
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(40); // go over freezing column limit, assign offsetWidth found from column element
        expect(columns[2].width).toBe(59 - 40);
        expect(columns[3].width).toBe(88);
        expect(columns[4].width).toBe(80);
      });

      it('should resize 3rd column that has a "minWidth" with a pinned column that is greater than available columns', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
          pinning: { columns: { left: 0, right: 5 } },
          syncColumnCellResize: true,
        });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

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
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);

        vi.advanceTimersByTime(10);

        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(59);
        expect(columns[3].width).toBe(88);
        expect(columns[4].width).toBe(80);
      });

      it('should resize 2nd column with forceFitColumns option enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseMoveEvent2 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent2, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent1);
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 75 });
        document.body.dispatchEvent(bodyMouseMoveEvent2);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[1], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(133);
        expect(columns[4].width).toBe(198);
      });

      it('should resize 2nd column with forceFitColumns and column pinning enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true, pinning: { columns: { left: 1 } } });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseMoveEvent2 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 70 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent2, 'pageX', { writable: true, value: 72 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent1);
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 75 });
        document.body.dispatchEvent(bodyMouseMoveEvent2);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[1], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(76);
        expect(columns[3].width).toBe(131);
        expect(columns[4].width).toBe(198);
      });

      it('should resize 2nd column without forceFitColumns option', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent1 = new CustomEvent('mousemove');
        const bodyMouseMoveEvent2 = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent1, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent2, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(bodyMouseMoveEvent1, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent1);
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 75 });
        document.body.dispatchEvent(bodyMouseMoveEvent2);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[1], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(88);
        expect(columns[4].width).toBeGreaterThanOrEqual(550);
        expect(columns[4].width).toBeLessThanOrEqual(552);
      });

      it('should resize 2nd column with forceFitColumns option enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[1].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[1], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[1].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'lastName', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(73);
        expect(columns[3].width).toBe(88);
        expect(columns[4].width).toBe(244);
      });

      it('should resize 3rd column with forceFitColumns option enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(132);
        expect(columns[4].width).toBe(199);
      });

      it('should resize 3rd column with forceFitColumns option enabled with a pinned column', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true, pinning: { columns: { left: 0 } } });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(132);
        expect(columns[4].width).toBe(199);
      });

      it('should resize 3rd column without forceFitColumns option but with a pinned column', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false, pinning: { columns: { left: 0 } } });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[2].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: columnElms[2], resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(columnElms[2].classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: 'age', grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(132);
        expect(columns[4].width).toBeGreaterThanOrEqual(550);
      });

      it('should resize 4th column with forceFitColumns option enabled and a column with maxWidth and a pinned column', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true, pinning: { columns: { left: 0 } } });
        grid.init();
        grid.autosizeColumns();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const onColumnsResizedSpy = vi.spyOn(grid.onColumnsResized, 'notify');
        const columnElms = container.querySelectorAll('.slick-header-column');
        const column3 = columnElms[3 - 1]; // -1 because hidden column is removed from DOM
        const resizeHandleElm = column3.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(columnElms[1], 'offsetWidth', { writable: true, value: 74 });
        Object.defineProperty(columnElms[2], 'offsetWidth', { writable: true, value: 133 });
        Object.defineProperty(columnElms[3], 'offsetWidth', { writable: true, value: 198 });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 79 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 78 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        // start resizing
        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect(column3.classList.contains('slick-header-column-active')).toBeTruthy();
        expect(onColumnsDragSpy).toHaveBeenCalledWith({ triggeredByColumn: column3, resizeHandle: resizeHandleElm, grid }, expect.anything(), grid);

        // end resizing
        document.body.dispatchEvent(bodyMouseUpEvent);
        expect(column3.classList.contains('slick-header-column-active')).toBeFalsy();
        expect(onColumnsResizedSpy).toHaveBeenCalledWith({ triggeredByColumn: columns[3].id, grid }, expect.anything(), grid);
        expect(columns[0].width).toBe(80);
        expect(columns[1].width).toBe(0);
        expect(columns[2].width).toBe(74);
        expect(columns[3].width).toBe(132);
        expect(columns[4].width).toBe(199);
      });

      it('should auto-scroll while resizing the last visible column when option is enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false });
        grid.init();

        const scrollToXSpy = vi.spyOn(grid, 'scrollToX');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const lastColumnElm = columnElms[3];
        const resizeHandleElm = lastColumnElm.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        document.body.dispatchEvent(bodyMouseUpEvent);

        expect(scrollToXSpy).toHaveBeenCalledWith(400);
      });

      it('should not auto-scroll while resizing the last visible column when option is disabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
          autoScrollOnColumnResize: false,
        });
        grid.init();

        const scrollToXSpy = vi.spyOn(grid, 'scrollToX');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const lastColumnElm = columnElms[3];
        const resizeHandleElm = lastColumnElm.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();
        document.body.dispatchEvent(bodyMouseUpEvent);

        expect(scrollToXSpy).not.toHaveBeenCalledWith(400);
      });

      it('should auto-scroll while resizing the last visible column when column pinning is enabled', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
        });
        grid.init();

        const scrollToXSpy = vi.spyOn(grid, 'scrollToX');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const lastColumnElm = columnElms[3];
        const resizeHandleElm = lastColumnElm.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });

        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);
        document.body.dispatchEvent(bodyMouseUpEvent);

        expect(scrollToXSpy).toHaveBeenCalledWith(400);
      });

      it('should use autoScrollResizeRightDelay when resize continues from browser right edge', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
        });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const lastColumnElm = columnElms[3];
        const resizeHandleElm = lastColumnElm.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        const bodyMouseUpEvent = new CustomEvent('mouseup');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(cMouseDownEvent, 'clientX', { writable: true, value: 120 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', {
          writable: true,
          value: (window.innerWidth || document.documentElement.clientWidth || 1024) - 1,
        });

        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);

        // Resize and reorder auto-scroll share the same 30ms interval.
        vi.advanceTimersByTime(90);
        expect(onColumnsDragSpy.mock.calls.length).toBe(4);

        vi.advanceTimersByTime(40);
        expect(onColumnsDragSpy.mock.calls.length).toBe(5);

        document.body.dispatchEvent(bodyMouseUpEvent);
      });

      it('should clear any existing resize auto-scroll timer when setting up column resize and when clearing all timers', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false });
        grid.init();

        const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
        const timerId = setInterval(() => {}, 1000);
        (grid as any)._columnResizeAutoScrollTimer = timerId;

        (grid as any).setupColumnResize();
        expect(clearIntervalSpy).toHaveBeenCalledWith(timerId);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();

        const timerId2 = setInterval(() => {}, 1000);
        (grid as any)._columnResizeAutoScrollTimer = timerId2;
        (grid as any).clearAllTimers();
        expect(clearIntervalSpy).toHaveBeenCalledWith(timerId2);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();

        clearIntervalSpy.mockRestore();
      });

      it('should stop resize auto-scroll when its offset becomes zero or the pointer returns inside the viewport', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
        });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const lastColumnElm = columnElms[3];
        const resizeHandleElm = lastColumnElm.querySelector('.slick-resizable-handle') as HTMLDivElement;

        const downEvt = new CustomEvent('mousedown');
        Object.defineProperty(downEvt, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(downEvt, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(downEvt, 'clientX', { writable: true, value: 100 });

        const moveRightEdgeEvt = new CustomEvent('mousemove');
        Object.defineProperty(moveRightEdgeEvt, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(moveRightEdgeEvt, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(moveRightEdgeEvt, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(moveRightEdgeEvt, 'clientX', {
          writable: true,
          value: (window.innerWidth || document.documentElement.clientWidth || 1024) - 1,
        });

        const moveLeftEdgeEvt = new CustomEvent('mousemove');
        Object.defineProperty(moveLeftEdgeEvt, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(moveLeftEdgeEvt, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(moveLeftEdgeEvt, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(moveLeftEdgeEvt, 'clientX', { writable: true, value: 1 });

        const moveZeroOffsetEvt = new CustomEvent('mousemove');
        Object.defineProperty(moveZeroOffsetEvt, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(moveZeroOffsetEvt, 'pageX', { writable: true, value: 0 });
        Object.defineProperty(moveZeroOffsetEvt, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(moveZeroOffsetEvt, 'clientX', { writable: true, value: 200 });

        const moveInsideEvt = new CustomEvent('mousemove');
        Object.defineProperty(moveInsideEvt, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(moveInsideEvt, 'pageX', { writable: true, value: 140 });
        Object.defineProperty(moveInsideEvt, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(moveInsideEvt, 'clientX', { writable: true, value: 200 });

        const upEvt = new CustomEvent('mouseup');

        resizeHandleElm.dispatchEvent(downEvt);
        container.dispatchEvent(downEvt);
        document.body.dispatchEvent(moveRightEdgeEvt);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeDefined();

        document.body.dispatchEvent(moveZeroOffsetEvt);
        const dragCountBeforeIdleTick = onColumnsDragSpy.mock.calls.length;
        expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();
        vi.advanceTimersByTime(30);
        expect(onColumnsDragSpy.mock.calls.length).toBe(dragCountBeforeIdleTick);

        document.body.dispatchEvent(moveRightEdgeEvt);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeDefined();
        document.body.dispatchEvent(moveInsideEvt);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeUndefined();

        document.body.dispatchEvent(moveLeftEdgeEvt);
        expect((grid as any)._columnResizeAutoScrollTimer).toBeDefined();

        document.body.dispatchEvent(upEvt);
      });

      it('should clamp resizing to the viewport edge before auto-scroll continues at the shared rate', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          forceFitColumns: false,
          autoScrollOnColumnResize: true,
        });
        grid.init();

        const onColumnsDragSpy = vi.spyOn(grid.onColumnsDrag, 'notify');
        const viewportX = (grid as any)._viewportScrollContainerX as HTMLDivElement;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 1200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 800 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        const columnElms = container.querySelectorAll('.slick-header-column');
        const resizeHandleElm = columnElms[0].querySelector('.slick-resizable-handle') as HTMLDivElement;

        const cMouseDownEvent = new CustomEvent('mousedown');
        const bodyMouseMoveEvent = new CustomEvent('mousemove');
        Object.defineProperty(bodyMouseMoveEvent, 'target', { writable: true, value: resizeHandleElm });
        Object.defineProperty(cMouseDownEvent, 'pageX', { writable: true, value: 80 });
        Object.defineProperty(cMouseDownEvent, 'pageY', { writable: true, value: 12 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageX', { writable: true, value: 1000 });
        Object.defineProperty(bodyMouseMoveEvent, 'pageY', { writable: true, value: 13 });
        Object.defineProperty(bodyMouseMoveEvent, 'clientX', { writable: true, value: 400 });

        resizeHandleElm.dispatchEvent(cMouseDownEvent);
        container.dispatchEvent(cMouseDownEvent);
        document.body.dispatchEvent(bodyMouseMoveEvent);

        expect(columns[1].width).toBe(720);
        expect(onColumnsDragSpy).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(30);
        expect(columns[1].width).toBe(730);
        expect(onColumnsDragSpy).toHaveBeenCalledTimes(2);
        document.body.dispatchEvent(new CustomEvent('mouseup'));
      });

      it('should trigger onViewportChanged and return true when resizing last column and only horizontal scroll occurs', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: false });
        grid.init();

        // Simulate state for the branch: _isResizingColumn && hScrollDist && !vScrollDist
        (grid as any)._isResizingColumn = true;
        (grid as any).lastRenderedScrollLeft = 0;
        (grid as any).lastRenderedScrollTop = 0;
        (grid as any).prevScrollTop = 0;
        (grid as any).scrollTop = 0;

        // Ensure scroll bounds allow scrollLeft = 100
        (grid as any).canvasWidth = 200;
        if (!(grid as any)._viewportScrollContainerX) {
          (grid as any)._viewportScrollContainerX = document.createElement('div');
        }
        const viewportX = (grid as any)._viewportScrollContainerX;
        Object.defineProperty(viewportX, 'scrollWidth', { configurable: true, writable: true, value: 200 });
        Object.defineProperty(viewportX, 'clientWidth', { configurable: true, writable: true, value: 50 });
        Object.defineProperty(viewportX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

        // Set the scroll state right before invoking the scroll handler.
        (grid as any).prevScrollLeft = 0;
        (grid as any).scrollLeft = 0;
        (grid as any).viewportW = 50;
        viewportX.scrollLeft = 100;

        // Stub scrollToX to avoid side effects
        vi.spyOn(grid as any, 'scrollToX').mockImplementation(() => {});

        const onViewportChangedSpy = vi.spyOn(grid, 'triggerEvent');

        const scrollEvent = new Event('scroll');
        (grid as any).handleScroll(scrollEvent);

        // Should update lastRenderedScrollLeft, trigger onViewportChanged
        expect((grid as any).lastRenderedScrollLeft).toBe(100);
        expect(onViewportChangedSpy).toHaveBeenCalledWith(grid.onViewportChanged, expect.anything());
      });

      it('should expect the last column to never be resizable', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, forceFitColumns: true });
        grid.init();

        const columnElms = container.querySelectorAll('.slick-header-column');
        const column4 = columnElms[4 - 1]; // -1 because hidden column is removed from DOM
        const resizeHandleElm = column4.querySelector('.slick-resizable-handle') as HTMLDivElement;

        expect(resizeHandleElm).toBeNull();
      });
    });

    describe('Sorting', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];

      it('should find a single sort icons to sorted column when calling setSortColumn() with a single column to sort ascending', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        grid.setSortColumn('firstName', true);

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(1);
        expect(sortDescIndicators.length).toBe(0);
        expect(grid.getSortColumns()).toEqual([{ columnId: 'firstName', sortAsc: true }]);
      });

      it('should not trigger onBeforeSort when clicking on column resize handle', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: false });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(0);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators.length).toBe(0);
        expect(grid.getSortColumns()).toEqual([{ columnId: 'firstName', sortAsc: false }]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]') as HTMLDivElement;
        const firstResizeHandleElm = firstNameHeaderColumnElm.querySelector('.slick-resizable-handle');
        const click = new CustomEvent('click');
        Object.defineProperty(click, 'target', { writable: true, value: firstResizeHandleElm });
        firstColHeaderElm?.dispatchEvent(click);

        expect(onBeforeSortSpy).not.toHaveBeenCalled();
      });

      it('should not trigger onBeforeSort when clicking on slick-header-columns div', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: false });
        const headerColumns = container.querySelectorAll<HTMLDivElement>('.slick-header-columns');
        headerColumns?.forEach((elm) => {
          elm.querySelector('.slick-header-column')?.classList.add('slick-header-column-sorted');
        });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(0);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators.length).toBe(0);
        expect(grid.getSortColumns()).toEqual([{ columnId: 'firstName', sortAsc: false }]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        expect(onBeforeSortSpy).not.toHaveBeenCalled();
      });

      it('should not trigger onBeforeSort when an open editor commit fails', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: false });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(0);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators.length).toBe(0);
        expect(grid.getSortColumns()).toEqual([{ columnId: 'firstName', sortAsc: false }]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click2 = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        expect(onBeforeSortSpy).not.toHaveBeenCalled();
      });

      it('should find a single sorted icons when calling setSortColumn() with a single col being sorted when multiSort is disabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: false });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        let sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(0);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators.length).toBe(0);
        expect(grid.getSortColumns()).toEqual([{ columnId: 'firstName', sortAsc: false }]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        expect(sortAscIndicators.length).toBe(0); // same because closest .slick-header-column not found

        const click2 = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        // clicking on firstName with legacy behavior
        expect(onBeforeSortSpy).toHaveBeenCalledTimes(1);
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: false,
            sortAsc: true,
            columnId: 'firstName',
            previousSortColumns: [{ columnId: 'firstName', sortAsc: true }],
            sortCol: columns[0],
          },
          click2,
          grid
        );
      });

      it('should find multiple sorted icons when calling setSortColumn() with 2 columns being sorted when multiSort is enabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: true, numberedMultiColumnSort: true });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }, { columnId: 'lastName', sortAsc: true }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        let sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(1);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators[0]?.classList.contains('slick-sort-indicator-desc')).toBeTruthy();
        expect(sortNumberedIndicators[0]?.textContent).toBe('1');
        expect(sortNumberedIndicators[1]?.classList.contains('slick-sort-indicator-asc')).toBeTruthy();
        expect(sortNumberedIndicators[1]?.textContent).toBe('2');
        expect(grid.getSortColumns()).toEqual([
          { columnId: 'firstName', sortAsc: false },
          { columnId: 'lastName', sortAsc: true },
        ]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        expect(sortAscIndicators.length).toBe(1); // same because closest .slick-header-column not found

        const click2 = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        // clicking on firstName with legacy behavior
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: true,
            previousSortColumns: [
              { columnId: 'firstName', sortAsc: true },
              { columnId: 'lastName', sortAsc: true },
            ],
            sortCols: [{ columnId: 'firstName', sortAsc: true, sortCol: columns[0] }],
          },
          click2,
          grid
        );
      });

      it('should find multiple sorted icons numbered icons when calling setSortColumn() with 2 columns being sorted when multiSort and tristateMultiColumnSort are enabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          multiColumnSort: true,
          numberedMultiColumnSort: true,
          tristateMultiColumnSort: true,
        });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }, { columnId: 'lastName', sortAsc: true }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        let sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(1);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortNumberedIndicators[0]?.classList.contains('slick-sort-indicator-desc')).toBeTruthy();
        expect(sortNumberedIndicators[0]?.textContent).toBe('1');
        expect(sortNumberedIndicators[1]?.classList.contains('slick-sort-indicator-asc')).toBeTruthy();
        expect(sortNumberedIndicators[1]?.textContent).toBe('2');
        expect(grid.getSortColumns()).toEqual([
          { columnId: 'firstName', sortAsc: false },
          { columnId: 'lastName', sortAsc: true },
        ]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        expect(sortAscIndicators.length).toBe(1); // same because closest .slick-header-column not found

        const click2 = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        // only left with lastName since firstName is now sorted ascending because of tristate
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: true,
            previousSortColumns: [
              { columnId: 'firstName', sortAsc: true },
              { columnId: 'lastName', sortAsc: true },
            ],
            sortCols: [{ columnId: 'lastName', sortAsc: true, sortCol: columns[1] }],
          },
          click2,
          grid
        );
      });

      it('should find multiple sorted icons with separate numbered icons when calling setSortColumn() with 2 columns being sorted when multiSort, tristateMultiColumnSort and sortColNumberInSeparateSpan are enabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          multiColumnSort: true,
          numberedMultiColumnSort: true,
          tristateMultiColumnSort: true,
          sortColNumberInSeparateSpan: true,
        });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }, { columnId: 'lastName', sortAsc: true }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        let sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        const sortDescIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-desc');
        const sortIndicators = container.querySelectorAll('.slick-sort-indicator');
        const sortNumberedIndicators = container.querySelectorAll('.slick-sort-indicator-numbered');
        const sortedColElms = container.querySelectorAll('.slick-sort-indicator.slick-header-column-sorted');

        expect(sortIndicators.length).toBe(columns.length);
        expect(sortAscIndicators.length).toBe(1);
        expect(sortDescIndicators.length).toBe(1);
        expect(sortedColElms.length).toBe(0);
        expect(sortIndicators[0]?.classList.contains('slick-sort-indicator-desc')).toBeTruthy();
        expect(sortNumberedIndicators[0]?.textContent).toBe('1');
        expect(sortIndicators[1]?.classList.contains('slick-sort-indicator-asc')).toBeTruthy();
        expect(sortNumberedIndicators[1]?.textContent).toBe('2');
        expect(grid.getSortColumns()).toEqual([
          { columnId: 'firstName', sortAsc: false },
          { columnId: 'lastName', sortAsc: true },
        ]);

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        sortAscIndicators = container.querySelectorAll('.slick-sort-indicator.slick-sort-indicator-asc');
        expect(sortAscIndicators.length).toBe(1); // same because closest .slick-header-column not found

        const click2 = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        // only left with lastName since firstName is now sorted ascending because of tristate
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: true,
            previousSortColumns: [
              { columnId: 'firstName', sortAsc: true },
              { columnId: 'lastName', sortAsc: true },
            ],
            sortCols: [{ columnId: 'lastName', sortAsc: true, sortCol: columns[1] }],
          },
          click2,
          grid
        );
      });

      it('should remove current sort when the sorting is triggered and tristateMultiColumnSort is enabled but multiColumnSort is disabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          multiColumnSort: false,
          numberedMultiColumnSort: true,
          tristateMultiColumnSort: true,
        });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }, { columnId: 'lastName', sortAsc: true }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const colClick = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(colClick, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(colClick);

        // only left with lastName since firstName is now sorted ascending because of tristate
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: false,
            previousSortColumns: [
              { columnId: 'firstName', sortAsc: true },
              { columnId: 'lastName', sortAsc: true },
            ],
            columnId: null,
            sortAsc: true,
            sortCol: null,
          },
          colClick,
          grid
        );
      });

      it('should sort by firstName when no previous sort exist and we triggered with tristateMultiColumnSort enabled but multiColumnSort is disabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          multiColumnSort: false,
          numberedMultiColumnSort: true,
          tristateMultiColumnSort: true,
        });
        grid.setSortColumns([]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        const colClick = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(colClick, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(colClick);

        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: false,
            previousSortColumns: [],
            columnId: 'firstName',
            sortAsc: true,
            sortCol: columns[0],
          },
          colClick,
          grid
        );
      });

      it('should sort by firstName when no previous sort exist and we triggered with tristateMultiColumnSort & multiColumnSort both disabled', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, {
          ...defaultOptions,
          multiColumnSort: false,
          numberedMultiColumnSort: true,
          tristateMultiColumnSort: false,
        });
        grid.setSortColumns([]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');

        const firstColHeaderElm = container.querySelector('.slick-header-columns');
        const click = new CustomEvent('click');
        firstColHeaderElm?.dispatchEvent(click);

        const colClick = new CustomEvent('click');
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(colClick, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(colClick);

        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: false,
            previousSortColumns: [],
            columnId: 'firstName',
            sortAsc: true,
            sortCol: columns[0],
          },
          colClick,
          grid
        );
      });

      it('should remove all sorting when multiSort is enabled and we clicked column with a metaKey (Ctrl/Win)', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, multiColumnSort: true });
        grid.setSortColumns([{ columnId: 'firstName', sortAsc: false }]);
        const onBeforeSortSpy = vi.spyOn(grid.onBeforeSort, 'notify');
        const firstColHeaderElm = container.querySelector('.slick-header-columns');

        const click2 = new CustomEvent('click');
        Object.defineProperty(click2, 'metaKey', { writable: true, value: true });
        const firstNameHeaderColumnElm = container.querySelector('.slick-header-column[data-id=firstName]');
        Object.defineProperty(click2, 'target', { writable: true, value: firstNameHeaderColumnElm });
        firstColHeaderElm?.dispatchEvent(click2);

        // clicking on firstName with legacy behavior
        expect(onBeforeSortSpy).toHaveBeenCalledTimes(1);
        expect(onBeforeSortSpy).toHaveBeenCalledWith(
          {
            grid,
            multiColumnSort: true,
            previousSortColumns: [{ columnId: 'firstName', sortAsc: true }],
            sortCols: [],
          },
          click2,
          grid
        );
      });
    });

    describe('Scrolling', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];

      it('should scroll when calling scrollCellIntoView() with lower position than pinned column', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, pinning: { columns: { left: 0 } } });
        grid.init();
        const renderSpy = vi.spyOn(grid, 'render');
        grid.scrollCellIntoView(1, 1, true);

        expect(renderSpy).toHaveBeenCalledTimes(3);
      });

      it('should scroll a center column that is obscured by left pinning', () => {
        const pinnedColumns = Array.from({ length: 5 }, (_value, index) => ({
          id: `column${index}`,
          field: `column${index}`,
          name: `Column ${index}`,
          width: 80,
        })) as Column[];
        const pinnedData = [{ id: 0, column0: '0', column1: '1', column2: '2', column3: '3', column4: '4' }];
        grid = new SlickGrid<any, Column>(container, pinnedData, pinnedColumns, {
          ...defaultOptions,
          pinning: { columns: { left: 0, right: [] } },
        });

        const horizontalScroller = container.querySelector('.slick-docking-horizontal-scroller') as HTMLDivElement;
        Object.defineProperties(horizontalScroller, {
          clientWidth: { configurable: true, value: 300 },
          scrollWidth: { configurable: true, value: 400 },
        });
        vi.spyOn(horizontalScroller, 'getBoundingClientRect').mockReturnValue({ width: 300 } as DOMRect);

        grid.scrollCellIntoView(0, 3);

        expect(horizontalScroller.scrollLeft).toBeGreaterThan(0);
      });

      it('should reveal the natural position of a sticky column currently docked at the right edge', () => {
        grid = new SlickGrid<any, Column>(container, [{ id: 0, firstName: 'John', lastName: 'Doe', age: 30 }], columns, {
          ...defaultOptions,
          pinning: { columns: { left: 0, right: [] } },
        });
        grid.init();

        const internals = grid as any;
        internals.dockingByColumn.set(1, { band: 'right', sticky: true, naturalOffset: 80, width: 80 });
        const scrollSpy = vi.spyOn(internals, 'internalScrollColumnIntoView').mockImplementation(() => undefined);

        grid.scrollCellIntoView(0, 1);

        expect(scrollSpy).toHaveBeenCalled();
      });

      it('should find the first column intersecting the horizontal render range', () => {
        const wideColumns = Array.from({ length: 100 }, (_, index) => ({
          id: `column${index}`,
          field: `column${index}`,
          name: `Column ${index}`,
          width: 80,
        })) as Column[];
        grid = new SlickGrid<any, Column>(container, [{}], wideColumns, defaultOptions);

        expect((grid as any).getFirstColumnIndexAtOrAfter(0)).toBe(0);
        expect((grid as any).getFirstColumnIndexAtOrAfter(800)).toBe(10);
        expect((grid as any).getFirstColumnIndexAtOrAfter(8000)).toBe(100);
      });

      it('should scroll when calling scrollCellIntoView() with row having colspan returned from DataView getItemMetadata()', () => {
        const columnsCopy = [...columns];
        columnsCopy[1].colspan = '*';
        columnsCopy[2].colspan = '1';
        const dv = new SlickDataView();
        dv.setItems(data);
        grid = new SlickGrid<any, Column>(container, dv, columns, {
          ...defaultOptions,
          pinning: { columns: { left: 0 } },
          enableMouseWheelScrollHandler: true,
        });
        vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns: { lastName: { colspan: '*' } } } as any);
        const renderSpy = vi.spyOn(grid, 'render');
        grid.scrollCellIntoView(1, 1, true);
        grid.scrollCellIntoView(1, 2, true);

        expect(renderSpy).toHaveBeenCalledTimes(6);
      });

      it('should call scrollColumnIntoView() and expect left scroll to become 80 which is default column width', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, pinning: { columns: { left: 0 } } });
        let viewportElm = container.querySelector('.slick-docking-horizontal-scroller') as HTMLDivElement;
        Object.defineProperty(viewportElm, 'scrollLeft', { writable: true, value: 20 });
        Object.defineProperty(viewportElm, 'scrollWidth', { writable: true, value: 10 });
        viewportElm.dispatchEvent(new CustomEvent('scroll'));
        const renderSpy = vi.spyOn(grid, 'render');
        grid.scrollColumnIntoView(2);
        viewportElm = container.querySelector('.slick-docking-horizontal-scroller') as HTMLDivElement;

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(viewportElm.scrollLeft).toBe(10);
      });

      it('should call scrollColumnIntoView() and expect left scroll to be lower than scrollLeft and become 0', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, pinning: { columns: { left: 0 } } });
        let viewportElm = container.querySelector('.slick-docking-horizontal-scroller') as HTMLDivElement;
        Object.defineProperty(viewportElm, 'scrollLeft', { writable: true, value: 10 });
        Object.defineProperty(viewportElm, 'scrollWidth', { writable: true, value: 20 });
        viewportElm.dispatchEvent(new CustomEvent('scroll'));
        const renderSpy = vi.spyOn(grid, 'render');
        grid.scrollColumnIntoView(1);
        viewportElm = container.querySelector('.slick-docking-horizontal-scroller') as HTMLDivElement;

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(viewportElm.scrollLeft).toBe(0);
      });
    });

    describe('Navigation', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
      ];

      it('should scroll to defined row position when calling scrollRowToTop()', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.init();
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const renderSpy = vi.spyOn(grid, 'render');

        grid.scrollRowToTop(2);

        expect(scrollToSpy).toHaveBeenCalledWith(2 * DEFAULT_COLUMN_HEIGHT); // default rowHeight: 25
        expect(renderSpy).toHaveBeenCalled();
      });

      it('should scroll to computed row position when calling scrollRowToTop() in variable row height mode', () => {
        const rowHeights = [25, 40, 30];
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          enableVariableRowHeight: true,
          rowHeight: 25,
          rowHeightProvider: (_grid, row) => rowHeights[row],
        });
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const renderSpy = vi.spyOn(grid, 'render');

        grid.scrollRowToTop(2);

        // top of row 2 is 25 + 40
        expect(scrollToSpy).toHaveBeenCalledWith(65);
        expect(renderSpy).toHaveBeenCalled();
      });

      it('should keep page-boundary mapping stable with variable row height enabled', () => {
        const manyRows = Array.from({ length: 700 }, (_, i) => ({ id: i, firstName: `name-${i}`, lastName: 'L', age: i }));
        const variableRowHeightProvider = (_grid: SlickGrid, row: number) => 2200 + (row % 3) * 200;

        grid = new SlickGrid<any, Column>(container, manyRows, columns, {
          ...defaultOptions,
          enableVariableRowHeight: true,
          rowHeight: 2200,
          rowHeightProvider: variableRowHeightProvider,
        });

        const testGrid = grid as any;
        const lastPage = testGrid.n - 1;

        expect(testGrid.n).toBeGreaterThan(3);
        expect(testGrid.getPageOffset(0)).toBe(0);
        expect(testGrid.getPageOffset(1)).toBe(0);
        expect(testGrid.getPageOffset(lastPage)).toBe(Math.max(0, testGrid.th - testGrid.h));

        expect(testGrid.getPageFromLargeScrollDelta(testGrid.ph - 1)).toBe(0);
        expect(testGrid.getPageFromLargeScrollDelta(testGrid.h - testGrid.ph)).toBe(lastPage);

        const row0Height = grid.getRowHeight(0);
        const row1Height = grid.getRowHeight(1);
        const row2Height = grid.getRowHeight(2);
        expect(testGrid.getRowPosition(3)).toBe(row0Height + row1Height + row2Height);
      });

      it('should cover legacy and interior branch paths in virtual page mapping helpers', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, rowHeight: 25 });
        const testGrid = grid as any;

        // getPageOffset(): legacy mapping when page count is tiny (n <= 3)
        testGrid.n = 3;
        testGrid.th = 1000;
        testGrid.h = 500;
        testGrid.cj = 123;
        expect(testGrid.getPageOffset(1)).toBe(123);

        // getPageOffset(): legacy fallback when computed lastOffset is non-positive
        testGrid.n = 5;
        testGrid.th = 400;
        testGrid.h = 500;
        testGrid.cj = 47;
        expect(testGrid.getPageOffset(1)).toBe(47);

        // getPageFromLargeScrollDelta(): no-interior-pages legacy page selection path
        testGrid.n = 3;
        testGrid.ph = 100;
        testGrid.h = 500;
        testGrid.viewportH = 50;
        expect(testGrid.getPageFromLargeScrollDelta(150)).toBe(1);

        // getPageFromLargeScrollDelta(): interior-page scale-factor path
        testGrid.n = 6;
        testGrid.ph = 100;
        testGrid.h = 500;
        testGrid.th = 1200;
        testGrid.viewportH = 50;
        expect(testGrid.getPageFromLargeScrollDelta(250)).toBe(4);
      });

      it('should do page up when calling scrollRowIntoView() and we are further than row index that we want to scroll to', () => {
        grid = new SlickGrid<any, Column>(container, data, columns, defaultOptions);
        grid.init();
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const renderSpy = vi.spyOn(grid, 'render');

        grid.scrollRowToTop(2);
        grid.updatePagingStatusFromView({ pageNum: 0, pageSize: 10, totalPages: 2 });
        grid.scrollRowIntoView(1, true);

        expect(scrollToSpy).toHaveBeenCalledWith(2 * DEFAULT_COLUMN_HEIGHT); // default rowHeight: 25
        expect(renderSpy).toHaveBeenCalled();
      });

      it('should allow scrolling to the last scrollable row when bottom pinning is enabled', () => {
        const manyRows = Array.from({ length: 1000 }, (_, i) => ({ id: i, firstName: `name-${i}`, lastName: 'L', age: i }));
        grid = new SlickGrid<any, Column>(container, manyRows, columns, { ...defaultOptions, pinning: { rows: { top: [0, 1, 2], bottom: [997, 998, 999] } } });
        grid.init();
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');

        grid.scrollRowIntoView(996);

        expect(scrollToSpy).toHaveBeenCalled();
        expect((scrollToSpy.mock.calls[0][0] as number) > 0).toBe(true);
      });

      it('should render inline row height and rebuild index when row heights are invalidated', () => {
        const oneColumn = [{ id: 'firstName', field: 'firstName', name: 'First Name', sortable: true }] as Column[];
        const providerHeights = [25, 40];
        const rowHeightProvider = vi.fn((_grid: SlickGrid, row: number) => providerHeights[row]);
        grid = new SlickGrid<any, Column>(
          container,
          [
            { id: 0, firstName: 'John' },
            { id: 1, firstName: 'Jane' },
          ],
          oneColumn,
          {
            ...defaultOptions,
            enableVariableRowHeight: true,
            rowHeight: 25,
            rowHeightProvider,
          }
        );

        expect(grid.getRowHeight(0)).toBe(25);
        expect(grid.getRowHeight(1)).toBe(40);

        const row0 = container.querySelector('.slick-row[data-row="0"]') as HTMLDivElement;
        const row1 = container.querySelector('.slick-row[data-row="1"]') as HTMLDivElement;
        expect(row0.style.height).toBe('');
        expect(row1.style.height).toBe('40px');

        rowHeightProvider.mockClear();
        providerHeights[1] = 70;
        const invalidateSpy = vi.spyOn(grid, 'invalidate');
        grid.invalidateRowHeights();
        grid.updateRowCount();

        expect(invalidateSpy).toHaveBeenCalled();
        expect(rowHeightProvider).toHaveBeenCalled();
        expect(grid.getRowHeight(1)).toBe(70);
      });

      it('should rebuild row height index when rowHeightProvider is changed via setOptions()', () => {
        const providerA = vi.fn((_grid: SlickGrid, row: number) => [25, 40][row]);
        const providerB = vi.fn((_grid: SlickGrid, row: number) => [25, 80][row]);
        grid = new SlickGrid<any, Column>(
          container,
          [
            { id: 0, firstName: 'John' },
            { id: 1, firstName: 'Jane' },
          ],
          [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[],
          {
            ...defaultOptions,
            enableVariableRowHeight: true,
            rowHeight: 25,
            rowHeightProvider: providerA,
          }
        );

        expect(grid.getRowHeight(1)).toBe(40);

        providerB.mockClear();
        grid.setOptions({ rowHeightProvider: providerB });
        grid.updateRowCount();

        expect(providerB).toHaveBeenCalled();
        expect(grid.getRowHeight(1)).toBe(80);
      });

      it('should support metadata-only variable row height mode via default rowHeightProvider', () => {
        const dv = new SlickDataView({
          globalItemMetadataProvider: {
            getRowMetadata: (_item, row) => ({ height: [25, 65][row ?? 0] }),
          },
        });
        dv.setItems([
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ]);

        grid = new SlickGrid<any, Column>(container, dv, [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[], {
          ...defaultOptions,
          enableVariableRowHeight: true,
          rowHeight: 25,
        });

        expect(grid.getRowHeight(0)).toBe(25);
        expect(grid.getRowHeight(1)).toBe(65);

        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        grid.scrollRowToTop(1);
        expect(scrollToSpy).toHaveBeenCalledWith(25);
      });

      it('should use default rowHeight when custom rowHeightProvider returns undefined even if metadata defines height', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        const customProvider = vi.fn(() => undefined);

        grid = new SlickGrid<any, Column>(container, data, [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[], {
          ...defaultOptions,
          enableVariableRowHeight: true,
          rowHeight: 25,
          rowHeightProvider: customProvider,
        });

        expect(grid.getRowHeight(1)).toBe(25);
        expect(customProvider).toHaveBeenCalled();
      });

      it('should do nothing when trying to navigateTop when the dataset is empty', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        grid.navigateTop();

        expect(scrollCellSpy).not.toHaveBeenCalled();
      });

      it('should scroll when calling to navigateTop with dataset', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveRow(0, 0);
        grid.navigateTop();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, true);
        expect(resetCellSpy).toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll when calling to navigateBottom with dataset', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        grid.setActiveRow(0, 0);
        grid.navigateBottom();

        expect(scrollCellSpy).toHaveBeenCalledWith(data.length - 1, 0, true);
        expect(scrollToSpy).toHaveBeenCalledWith(DEFAULT_COLUMN_HEIGHT);
        expect(resetCellSpy).toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll when calling to navigateBottom with dataset and rowspan', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true, enableCellRowSpan: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const setActiveRowSpy = vi.spyOn(grid, 'setActiveRow');
        grid.setActiveRow(0, 0);
        grid.navigateBottom();

        expect(scrollCellSpy).toHaveBeenCalledWith(data.length - 1, 0, true);
        expect(scrollToSpy).toHaveBeenCalledWith(DEFAULT_COLUMN_HEIGHT);
        expect(resetCellSpy).toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
        expect(setActiveRowSpy).toHaveBeenCalled();
      });

      it('should navigate to left then bottom and expect active cell to change with previous cell position that was activated by the left navigation', () => {
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const canCellActiveSpy = vi.spyOn(grid, 'canCellBeActive');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        grid.setActiveCell(0, 1);
        grid.navigateLeft();
        grid.navigateBottom();

        expect(scrollCellSpy).toHaveBeenCalledWith(data.length - 1, 0, true);
        expect(scrollToSpy).toHaveBeenCalledWith(DEFAULT_COLUMN_HEIGHT);
        expect(canCellActiveSpy).toHaveBeenCalledTimes(3);
        expect(resetCellSpy).not.toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to the right but jump over hidden column, from active cell 0 to 2', () => {
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
          { id: 2, firstName: 'Bob', lastName: 'Smith', age: 22 },
          { id: 3, firstName: 'David', lastName: 'Smith', age: 24 },
        ];
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true, hidden: true },
          { id: 'age', field: 'age', name: 'Age', sortable: true },
          { id: 'gender', field: 'gender', name: 'Aender', sortable: true },
        ] as Column[];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const canCellActiveSpy = vi.spyOn(grid, 'canCellBeActive');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        grid.setActiveCell(0, 0);
        grid.navigateRight();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, true);
        expect(scrollToSpy).toHaveBeenCalledWith(DEFAULT_COLUMN_HEIGHT);
        expect(canCellActiveSpy).toHaveBeenCalled();
        expect(resetCellSpy).not.toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should add rowspan, then navigate to all possible sides', () => {
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ];
        const metadata: any = {
          0: { columns: { 0: { colspan: 2, rowspan: 2 } } },
          3: { columns: { 1: { colspan: 2, rowspan: 3 } } },
        };
        const customDV = {
          getItemMetadata: (row: number) => metadata[row],
          getLength: () => data.length,
          getItem: (index: number) => data[index],
        } as CustomDataView;
        grid = new SlickGrid<any, Column>('#myGrid', customDV, columns, { ...defaultOptions, editable: true, enableCellRowSpan: true });
        grid.setActiveCell(0, 1);
        grid.navigateBottomEnd();
        grid.navigatePrev();

        grid.setActiveCell(0, 3);
        grid.navigateUp();
        grid.navigateBottomEnd();
        expect(grid.navigateNext()).toBe(false);
        expect(grid.navigatePrev()).toBe(true);
        expect(grid.navigatePrev()).toBe(true);
        expect(grid.navigateRowStart()).toBe(true);
        expect(grid.navigateRowEnd()).toBe(true);
        expect(grid.navigateNext()).toBe(true);
        expect(grid.navigateNext()).toBe(true);
        expect(grid.navigateDown()).toBe(false);
      });

      it('should navigate to left then page down and expect active cell to change with previous cell position that was activated by the left navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const resetCellSpy = vi.spyOn(grid, 'resetActiveCell');
        const canCellActiveSpy = vi.spyOn(grid, 'canCellBeActive');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        grid.setActiveCell(0, 1);
        grid.navigateLeft();
        grid.navigatePageDown();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, true);
        expect(scrollToSpy).toHaveBeenCalledWith(DEFAULT_COLUMN_HEIGHT);
        expect(canCellActiveSpy).toHaveBeenCalledTimes(3);
        expect(resetCellSpy).not.toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll when calling to navigatePageDown with dataset', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const renderSpy = vi.spyOn(grid, 'render');
        grid.setActiveRow(0, 0);
        grid.navigatePageDown();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(scrollToSpy).toHaveBeenCalledWith(600);
        expect(renderSpy).toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll when calling to navigatePageUp with dataset', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        const scrollToSpy = vi.spyOn(grid, 'scrollTo');
        const renderSpy = vi.spyOn(grid, 'render');
        grid.setActiveRow(0, 0);
        grid.navigatePageUp();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(scrollToSpy).toHaveBeenCalledWith(-600);
        expect(renderSpy).toHaveBeenCalled();
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should return false when trying to scroll to left but enableCellNavigation is disabled', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: false });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        const result = grid.navigateLeft();

        expect(result).toBe(false);
        expect(grid.getActiveCellNode()).toBeFalsy();
        expect(scrollCellSpy).not.toHaveBeenCalled();
        expect(onActiveCellSpy).not.toHaveBeenCalled();
      });

      it('should try to scroll to left but return false cell is already at column index 0 and cannot go further', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        const result = grid.navigateLeft();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll to left but return false when calling navigateLeft but cannot find first focusable cell', () => {
        const data = [{ id: 0, firstName: 'John' }];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'canCellBeActive').mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        grid.setActiveCell(0, 2);
        grid.navigateLeft();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll to left and return true when calling navigateLeft with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 1);
        const result = grid.navigateLeft();

        expect(result).toBe(true);
        expect(grid.getGridPosition()).toMatchObject({ left: 0 });
        expect(grid.getActiveCellPosition()).toMatchObject({ left: 0 });
        expect(grid.getActiveCellNode()).toBeTruthy();
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, true);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll to left and return true but stay at same cell column when calling navigateLeft with an active editor', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);
        grid.setActiveCell(0, 1);
        const result = grid.navigateLeft();

        expect(result).toBe(true);
      });

      it('should scroll to right but return false when calling navigateRight but cannot go further', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 2);
        const result = grid.navigateRight();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll to right and return true when calling navigateRight with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 1);
        grid.navigateRight();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, true);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate left but return false when calling navigateLeft and nothing is available on the left & right with bottom row pinning', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          enableCellNavigation: true,
          pinning: { rows: { top: [0, 1], bottom: [2] } },
        });
        grid.init();
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(2, 1);
        // @ts-ignore
        vi.spyOn(grid, 'gotoRight').mockReturnValueOnce(null);
        const result = grid.navigateLeft();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(2, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate left but return false when calling navigateLeft and nothing is available on the left & right with row pinning', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true, pinning: { rows: { top: [0, 1] } } });
        grid.init();
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(2, 1);
        // @ts-ignore
        vi.spyOn(grid, 'gotoRight').mockReturnValueOnce(null);
        const result = grid.navigateLeft();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(2, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate left and return true when calling navigateLeft and only right is available', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, {
          ...defaultOptions,
          enableCellNavigation: true,
          pinning: { rows: { top: [0, 1], bottom: [2] } },
        });
        grid.init();
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(2, 1);
        // @ts-ignore
        vi.spyOn(grid, 'gotoRight').mockReturnValueOnce({ cell: 0, posX: 0, row: 1 });
        const result = grid.navigateLeft();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(2, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll up but return false when calling navigateUp but cannot go further', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        const result = grid.navigateUp();
        grid.focus();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll to right and return true when calling navigateUp with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        const result = grid.navigateUp();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should scroll down but return false when calling navigateDown but cannot go further', () => {
        const data = [{ id: 0, firstName: 'John' }];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        const result = grid.navigateDown();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to previous cell but return false when calling navigatePrev but cannot go further', () => {
        const data = [{ id: 0, firstName: 'John' }];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        const result = grid.navigatePrev();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to previous cell and return true when calling navigatePrev but scroll to 0,0 when providing out of bound cell', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, -1);
        const result = grid.navigatePrev();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 2, true);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to previous cell and return true when calling navigatePrev with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        const result = grid.navigatePrev();

        expect(result).toBe(true);
        expect(grid.getActiveCellPosition()).toMatchObject({ left: 0 });
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to previous cell and return false when calling navigatePrev with invalid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        vi.spyOn(grid, 'canCellBeActive').mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        grid.navigatePrev();

        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to next but decrease row count when calling navigateNext and cell is detected as out of bound', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 2);
        grid.navigateNext();

        expect(scrollCellSpy).toHaveBeenCalledWith(1, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to next but return false when calling navigateNext and cannot find any first focusable cell', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        vi.spyOn(grid, 'canCellBeActive').mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(1, 2);
        grid.navigateNext();

        expect(scrollCellSpy).toHaveBeenCalledWith(1, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to next cell and return true when calling navigateNext but cannot go further it will find next focusable cell nonetheless', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 2);
        const result = grid.navigateNext();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to next cell and return true when calling navigateNext but scroll to 0,0 when providing out of bound cell', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 3);
        const result = grid.navigateNext();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, true);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to next cell and return true when calling navigateNext with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        const result = grid.navigateNext();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to first row start but return false when calling navigateRowStart but cannot go further', () => {
        const data = [{ id: 0, firstName: 'John' }];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        vi.spyOn(grid, 'canCellBeActive').mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        grid.setActiveCell(0, 0);
        grid.navigateRowStart();

        expect(scrollCellSpy).toHaveBeenCalledWith(0, 0, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to first row start and return true when calling navigateRowStart with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        const result = grid.navigateRowStart();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to end of row but return false when calling navigateRowEnd but cannot go further', () => {
        const data = [{ id: 0, firstName: 'John' }];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'canCellBeActive').mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        grid.setActiveCell(0, 2);
        const result = grid.navigateRowEnd();

        expect(result).toBe(false);
        expect(scrollCellSpy).toHaveBeenCalledWith(0, 2, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });

      it('should navigate to end of row and return true when calling navigateRowEnd with valid navigation', () => {
        const data = [
          { id: 0, firstName: 'John' },
          { id: 1, firstName: 'Jane' },
          { id: 2, firstName: 'Bob' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
        const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
        const onActiveCellSpy = vi.spyOn(grid.onActiveCellChanged, 'notify');
        vi.spyOn(grid, 'getCellFromPoint').mockReturnValueOnce({ row: 1, cell: 1 });
        grid.setActiveCell(1, 1);
        const result = grid.navigateRowEnd();

        expect(result).toBe(true);
        expect(scrollCellSpy).toHaveBeenCalledWith(1, 1, false);
        expect(onActiveCellSpy).toHaveBeenCalled();
      });
    });

    describe('CSS Styles', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      let items: Array<{ id: number; name: string; age: number }> = [];
      let hash: any = {};

      beforeEach(() => {
        items = [
          { id: 0, name: 'Avery', age: 44 },
          { id: 1, name: 'Bob', age: 20 },
          { id: 2, name: 'Rachel', age: 46 },
          { id: 3, name: 'Jane', age: 24 },
          { id: 4, name: 'John', age: 20 },
          { id: 5, name: 'Arnold', age: 50 },
          { id: 6, name: 'Carole', age: 40 },
          { id: 7, name: 'Jason', age: 48 },
          { id: 8, name: 'Julie', age: 42 },
          { id: 9, name: 'Aaron', age: 23 },
          { id: 10, name: 'Ariane', age: 43 },
        ];
        hash = {};
        for (const item of items) {
          if (item.age >= 30) {
            hash[item.id] = { age: 'highlight' };
          }
        }
      });

      it('should throw when trying to add already existing hash', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });

        grid.setCellCssStyles('age_greater30_highlight', hash);
        expect(() => grid.addCellCssStyles('age_greater30_highlight', hash)).toThrow(
          'SlickGrid addCellCssStyles: cell CSS hash with key "age_greater30_highlight" already exists.'
        );
      });

      it('should support CSS style keys that match Object prototype properties', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
        const hash = { 0: { age: 'highlight' } };

        grid.addCellCssStyles('__proto__', hash);
        grid.addCellCssStyles('constructor', hash);
        grid.addCellCssStyles('toString', hash);

        expect(grid.getCellCssStyles('__proto__')).toBe(hash);
        expect(grid.getCellCssStyles('constructor')).toBe(hash);
        expect(grid.getCellCssStyles('toString')).toBe(hash);
        expect((Object.prototype as any).polluted).toBeUndefined();
      });

      it('should exit early when trying to remove CSS Style key that does not exist in hash', () => {
        const hashCopy = { ...hash };
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });

        grid.setCellCssStyles('age_greater30_highlight', hash);
        grid.removeCellCssStyles('something_else');

        expect(hash).toEqual(hashCopy);
      });

      it('should addCellCssStyles/removeCellCssStyles with CSS style hashes and expect onCellCssStylesChanged event to be triggered and styling applied to cells', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
        const onCellStyleSpy = vi.spyOn(grid.onCellCssStylesChanged, 'notify');

        // 1. add CSS Cell Style
        grid.addCellCssStyles('age_greater30_highlight', hash);
        grid.render();

        let firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
        let secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

        expect(onCellStyleSpy).toHaveBeenNthCalledWith(1, { key: 'age_greater30_highlight', hash, grid }, expect.anything(), grid);
        expect(firstItemAgeCell.textContent).toBe('44');
        expect(firstItemAgeCell.classList.contains('highlight')).toBeTruthy();
        expect(secondItemAgeCell.textContent).toBe('20');
        expect(secondItemAgeCell.classList.contains('highlight')).toBeFalsy();

        // 2. then remove CSS Cell Style
        grid.removeCellCssStyles('age_greater30_highlight');

        firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
        secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

        expect(onCellStyleSpy).toHaveBeenLastCalledWith({ key: 'age_greater30_highlight', hash: null, grid }, expect.anything(), grid);
        expect(onCellStyleSpy).toHaveBeenCalledWith({ key: 'age_greater30_highlight', hash, grid }, expect.anything(), grid);
        expect(firstItemAgeCell.textContent).toBe('44');
        expect(firstItemAgeCell.classList.contains('highlight')).toBeFalsy();
        expect(secondItemAgeCell.textContent).toBe('20');
        expect(secondItemAgeCell.classList.contains('highlight')).toBeFalsy();
      });

      it('should apply and remove space-separated CSS classes on rendered cells', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
        grid.render();

        const ageCell = grid.getCellNode(0, 1)!;
        const multiClassHash = { 0: { age: 'highlight important' } };

        expect(() => grid.addCellCssStyles('multi_class_style', multiClassHash)).not.toThrow();
        expect(ageCell.classList.contains('highlight')).toBe(true);
        expect(ageCell.classList.contains('important')).toBe(true);

        expect(() => grid.removeCellCssStyles('multi_class_style')).not.toThrow();
        expect(ageCell.classList.contains('highlight')).toBe(false);
        expect(ageCell.classList.contains('important')).toBe(false);
      });

      it('should merge keyed CSS style overlays before creating a cell', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
        grid.addCellCssStyles('primary', { 0: { age: 'primary-highlight' } });
        grid.addCellCssStyles('secondary', { 0: { age: 'secondary-highlight' } });

        const initialRow = document.createElement('div');
        (grid as any).appendCellHtml(initialRow, 0, 1, 1, 1, null, items[0]);
        expect(initialRow.firstElementChild?.classList.contains('primary-highlight')).toBe(true);
        expect(initialRow.firstElementChild?.classList.contains('secondary-highlight')).toBe(true);

        grid.setCellCssStyles('primary', { 0: { age: 'replacement-highlight' } });
        grid.removeCellCssStyles('secondary');

        const updatedRow = document.createElement('div');
        (grid as any).appendCellHtml(updatedRow, 0, 1, 1, 1, null, items[0]);
        expect(updatedRow.firstElementChild?.classList.contains('primary-highlight')).toBe(false);
        expect(updatedRow.firstElementChild?.classList.contains('secondary-highlight')).toBe(false);
        expect(updatedRow.firstElementChild?.classList.contains('replacement-highlight')).toBe(true);
      });

      it('should remove multiple cell CSS styles by key', () => {
        grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
        const onCellStyleSpy = vi.spyOn(grid.onCellCssStylesChanged, 'notify');

        // 1. add CSS Cell Style
        grid.addCellCssStyles('age_greater30_highlight', hash);
        const toBeDeletedHash = { age: 'to-be-deleted-highlight' };
        grid.addCellCssStyles('the_deletion_target', { 0: toBeDeletedHash, 1: toBeDeletedHash });
        grid.addCellCssStyles('also_the_deletion_target', { 0: toBeDeletedHash, 1: toBeDeletedHash });
        grid.render();

        let firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
        let secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

        expect(onCellStyleSpy).toHaveBeenNthCalledWith(1, { key: 'age_greater30_highlight', hash, grid }, expect.anything(), grid);
        expect(firstItemAgeCell.textContent).toBe('44');
        expect(firstItemAgeCell.classList.contains('highlight')).toBeTruthy();
        expect(firstItemAgeCell.classList.contains('to-be-deleted-highlight')).toBeTruthy();
        expect(secondItemAgeCell.textContent).toBe('20');
        expect(secondItemAgeCell.classList.contains('highlight')).toBeFalsy();
        expect(secondItemAgeCell.classList.contains('to-be-deleted-highlight')).toBeTruthy();

        // 2. then remove CSS Cell Style
        grid.removeCellCssStyles('the_deletion_target');
        grid.removeCellCssStyles('also_the_deletion_target');

        firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
        secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

        expect(firstItemAgeCell.textContent).toBe('44');
        expect(firstItemAgeCell.classList.contains('highlight')).toBeTruthy();
        expect(firstItemAgeCell.classList.contains('to-be-deleted-highlight')).toBeFalsy();
        expect(secondItemAgeCell.textContent).toBe('20');
        expect(secondItemAgeCell.classList.contains('highlight')).toBeFalsy();
        expect(secondItemAgeCell.classList.contains('to-be-deleted-highlight')).toBeFalsy();
      });


      it('should trigger onHeaderKeyDown and sortCallback on Enter/Space', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
          { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe' },
          { id: 1, firstName: 'Jane', lastName: 'Smith' },
        ];
        grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableColumnReorder: true });
        grid.init();
        const header = container.querySelector('.slick-header-column');
        // Mock Utils.storage.get to return a column
        const origStorage = (globalThis as any).Utils?.storage?.get;
        (globalThis as any).Utils = (globalThis as any).Utils || {};
        (globalThis as any).Utils.storage = { get: () => columns[0] };
        // Spy on onHeaderKeyDown and onSort
        const onHeaderKeyDownSpy = vi.spyOn(grid.onHeaderKeyDown, 'notify');
        const onSortSpy = vi.spyOn(grid.onSort, 'notify');
        // Simulate keydown Enter
        const eventEnter = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }) as any;
        Object.defineProperty(eventEnter, 'target', { value: header });
        header?.dispatchEvent(eventEnter);
        // Simulate keydown Space
        const eventSpace = new window.KeyboardEvent('keydown', { key: ' ', bubbles: true }) as any;
        Object.defineProperty(eventSpace, 'target', { value: header });
        header?.dispatchEvent(eventSpace);
        expect(onHeaderKeyDownSpy).toHaveBeenCalled();
        expect(onSortSpy).toHaveBeenCalled();
        // Restore original
        if (origStorage) {
          (globalThis as any).Utils.storage.get = origStorage;
        }
      });

      it('should return cell CSS styles for a given key', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        grid = new SlickGrid<any, Column>(container, [], columns, defaultOptions);
        (grid as any).cellCssClasses = { testKey: { 0: { firstName: 'highlight' } } };
        const result = grid.getCellCssStyles('testKey');
        expect(result).toEqual({ 0: { firstName: 'highlight' } });
      });

      it('should bind container keydown when enableFiltering is true', () => {
        const columns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
        const gridOptions = { ...defaultOptions, enableFiltering: true };
        grid = new SlickGrid<any, Column>(container, [], columns, gridOptions);
        grid.init();
        // If no error, the code path is covered. Optionally, check event listeners count.
        expect(grid).toBeTruthy();
      });
    });

    describe('Slick Cell', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name' },
        { id: 'lastName', field: 'lastName', name: 'Last Name' },
        { id: 'age', field: 'age', name: 'Age' },
        { id: 'gender', field: 'gender', name: 'Gender', hidden: true },
      ] as Column[];
      const data = [
        { id: 0, firstName: 'John', lastName: 'Doe', age: 30, gender: 'male' },
        { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28, gender: 'female' },
        { id: 2, firstName: 'Bob', lastName: 'Smith', age: 48, gender: 'male' },
        { id: 3, firstName: 'Arnold', lastName: 'Smith', age: 37, gender: 'male' },
      ];

      describe('absBox() method', () => {
        it('should expect abs box to be visible with unchanged abs box properties', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          grid.setActiveCell(0, 1);
          const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
          const gridContainer = grid['_container'];

          // Cell is inside grid
          slickCellElm.getBoundingClientRect = vi.fn(() => ({ top: 10, left: 10, bottom: 30, right: 30, width: 20, height: 20 }) as DOMRect);
          gridContainer.getBoundingClientRect = vi.fn(() => ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }) as DOMRect);

          const result = grid.getActiveCellPosition();
          expect(result).toEqual({
            top: 10,
            left: 10,
            bottom: 30,
            right: 30,
            width: 20,
            height: 20,
            visible: true,
          });
        });

        it('should expect abs box to not be visible when top position is lower than grid container', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          grid.setActiveCell(0, 1);
          const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
          const gridContainer = grid['_container'];

          // Cell is above grid
          slickCellElm.getBoundingClientRect = vi.fn(() => ({ top: -50, left: 10, bottom: -30, right: 30, width: 20, height: 20 }) as DOMRect);
          gridContainer.getBoundingClientRect = vi.fn(() => ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }) as DOMRect);

          const result = grid.getActiveCellPosition();
          expect(result).toEqual({
            top: -50,
            left: 10,
            bottom: -30,
            right: 30,
            width: 20,
            height: 20,
            visible: false,
          });
        });

        it('should expect abs box to not be visible when left position is lower than grid container', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          grid.setActiveCell(0, 1);
          const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
          const gridContainer = grid['_container'];

          // Cell is left of grid
          slickCellElm.getBoundingClientRect = vi.fn(() => ({ top: 10, left: -50, bottom: 30, right: -30, width: 20, height: 20 }) as DOMRect);
          gridContainer.getBoundingClientRect = vi.fn(() => ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }) as DOMRect);

          const result = grid.getActiveCellPosition();
          expect(result).toEqual({
            top: 10,
            left: -50,
            bottom: 30,
            right: -30,
            width: 20,
            height: 20,
            visible: false,
          });
        });

        it('should expect abs box to not be visible when left position is lower than grid container and also increase left/top position when offsetParent is same as slick-row element', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          grid.setActiveCell(0, 1);
          const slickCellElm = container.querySelector('.slick-cell.l1.r1') as HTMLDivElement;
          const gridContainer = grid['_container'];

          // Cell is left of grid, with offsetParent logic
          slickCellElm.getBoundingClientRect = vi.fn(() => ({ top: 10, left: -60, bottom: 30, right: -40, width: 20, height: 20 }) as DOMRect);
          gridContainer.getBoundingClientRect = vi.fn(() => ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }) as DOMRect);

          const result = grid.getActiveCellPosition();
          expect(result).toEqual({
            top: 10,
            left: -60,
            bottom: 30,
            right: -40,
            width: 20,
            height: 20,
            visible: false,
          });
        });
      });

      describe('getCellFromPoint() method', () => {
        const columns = [
          { id: 'firstName', field: 'firstName', name: 'First Name' },
          { id: 'middleName', field: 'middleName', name: 'Middle Name' },
          { id: 'lastName', field: 'lastName', name: 'Last Name' },
          { id: 'age', field: 'age', name: 'Age' },
          { id: 'gender', field: 'gender', name: 'Gender' },
          { id: 'doorNumber', field: 'doorNumber', name: 'Door Number', hidden: true },
          { id: 'streetName', field: 'streetName', name: 'Street Name', hidden: true },
        ] as Column[];
        const data = [
          { id: 0, firstName: 'John', lastName: 'Doe', age: 30, gender: 'male' },
          { id: 1, firstName: 'Jane', lastName: 'Doe', age: 28, gender: 'female' },
          { id: 2, firstName: 'Bob', lastName: 'Smith', age: 48, gender: 'male' },
          { id: 3, firstName: 'Arnold', lastName: 'Smith', age: 37, gender: 'male' },
        ];

        it('should return correct row/cell when providing x,y coordinates', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          const result1 = grid.getCellFromPoint(0, 0);
          const result2 = grid.getCellFromPoint(0, DEFAULT_COLUMN_HEIGHT + 5);
          const result3 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH + 5, 0);
          const result4 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH + 5, DEFAULT_COLUMN_HEIGHT + 5);
          const result5 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH * 2 + 5, DEFAULT_COLUMN_HEIGHT * 2 + 5);
          const result6 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH * 3 + 5, DEFAULT_COLUMN_HEIGHT * 3 + 5);
          const result7 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH * 4 + 5, DEFAULT_COLUMN_HEIGHT * 4 + 5);

          expect(result1).toEqual({ cell: 0, row: 0 });
          expect(result2).toEqual({ cell: 0, row: 1 });
          expect(result3).toEqual({ cell: 1, row: 0 });
          expect(result4).toEqual({ cell: 1, row: 1 });
          expect(result5).toEqual({ cell: 2, row: 2 });
          expect(result6).toEqual({ cell: 3, row: 3 });
          expect(result7).toEqual({ cell: 4, row: 4 });
        });

        it('should return negative row/cell when x,y coordinates is outside the grid canvas', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          const result1 = grid.getCellFromPoint(0, -999);
          const result2 = grid.getCellFromPoint(-777, 0);
          const result3 = grid.getCellFromPoint(-(DEFAULT_COLUMN_WIDTH + 5), -(DEFAULT_COLUMN_HEIGHT + 5));
          const result4 = grid.getCellFromPoint(-(DEFAULT_COLUMN_WIDTH * 2 + 5), -(DEFAULT_COLUMN_HEIGHT * 2 + 5));
          const result5 = grid.getCellFromPoint(-(DEFAULT_COLUMN_WIDTH * 3 + 5), -(DEFAULT_COLUMN_HEIGHT * 3 + 5));

          expect(result1).toEqual({ cell: 0, row: -1 });
          expect(result2).toEqual({ cell: -1, row: 0 });
          expect(result3).toEqual({ cell: -1, row: -1 });
          expect(result4).toEqual({ cell: -1, row: -1 });
          expect(result5).toEqual({ cell: -1, row: -1 });
        });

        it('should skip hidden columns and return last visible column cell when x coordinate falls beyond visible canvas', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          const result1 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH * 5 + 5, DEFAULT_COLUMN_HEIGHT * 5 + 5);
          const result2 = grid.getCellFromPoint(DEFAULT_COLUMN_WIDTH * 6 + 5, DEFAULT_COLUMN_HEIGHT * 6 + 5);

          expect(result1).toEqual({ cell: 4, row: 5 });
          expect(result2).toEqual({ cell: 4, row: 6 });
        });
      });

      describe('getCellFromEvent() method', () => {
        it('should throw when cell node is not found in the grid', () => {
          const slickCell = Utils.createDomElement('div', { className: 'slick-cell' });
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: slickCell });

          expect(() => grid.getCellFromEvent(event)).toThrow('SlickGrid getCellFromNode: cannot get cell - slick-cell');
        });

        it('should return null if either the native event or passed in event is not set', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          expect(grid.getCellFromEvent(null as any)).toBeNull();
          expect(grid.getCellFromEvent(new SlickEventData(null))).toBeNull();
        });

        it('should return null when clicked cell is not a slick-cell closest ancestor', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(1)');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[0] });
          const result = grid.getCellFromEvent(event);

          expect(result).toBeNull();
        });

        it('should return null when a row node is not present in the row cache', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });

          expect((grid as any).getRowFromNode(document.createElement('div'))).toBeNull();
        });

        it('should return { row:0, cell:0 } when clicked cell is first cell top left a native Event', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(1) .slick-cell');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[0] });
          const result = grid.getCellFromEvent(event);

          expect(result).toEqual({ row: 0, cell: 0 });
        });

        it('should return { row:0, cell:0 } when clicked cell is first cell top left and is provided as a SlickEventData', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(1) .slick-cell');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[0] });
          const sed = new SlickEventData(event);
          const result = grid.getCellFromEvent(sed);

          expect(result).toEqual({ row: 0, cell: 0 });
        });

        it('should return { row:1, cell:1 } when clicked cell is second cell of second row', () => {
          grid = new SlickGrid<any, Column>(container, data, columns, { ...defaultOptions, enableCellNavigation: true });
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          const result = grid.getCellFromEvent(event);

          expect(result).toEqual({ row: 1, cell: 1 });
        });
      });
    });

    describe('Sanitizer', () => {
      const columns = [
        { id: 'firstName', field: 'firstName', name: 'First Name', sortable: true },
        { id: 'lastName', field: 'lastName', name: 'Last Name', sortable: true },
        { id: 'age', field: 'age', name: 'Age', sortable: true },
      ] as Column[];

      it('should use sanitizer when provided in grid options and expect <script> to be removed', () => {
        const sanitizer = (dirtyHtml: string) =>
          typeof dirtyHtml === 'string'
            ? dirtyHtml.replace(
                /(\b)(on[a-z]+)(\s*)=|javascript:([^>]*)[^>]*|(<\s*)(\/*)script([<>]*).*(<\s*)(\/*)script(>*)|(&lt;)(\/*)(script|script defer)(.*)(&gt;|&gt;">)/gi,
                ''
              )
            : dirtyHtml;
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, sanitizer });

        const dirtyHtml = '<div class="some-class"><script>alert("hello world")</script></div>';
        const cleanHtml = '<div class="some-class"></div>';

        expect(grid.sanitizeHtmlString(dirtyHtml)).toBe(cleanHtml);
      });

      it('should return same input string when no sanitizer provided', () => {
        grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, sanitizer: undefined });

        const dirtyHtml = '<div class="some-class"><script>alert("hello world")</script></div>';

        expect(grid.sanitizeHtmlString(dirtyHtml)).toBe(dirtyHtml);
      });
    });

    describe('Update UI', () => {
      describe('updateCell() method', () => {
        it('should change an item property then call updateCell() and expect it to be updated in the UI with Formatter result', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            {
              id: 'age',
              field: 'age',
              name: 'Age',
              formatter: (_row: number, _cell: number, val: any) => (val > 20 ? `<strong>${val}</strong>` : null),
            } as any,
          ];
          const items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const getDataItemSpy = vi.spyOn(grid, 'getDataItem');
          items[1].age = 25;
          grid.updateCell(1, 1);

          const secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

          expect(getDataItemSpy).toHaveBeenCalledTimes(1);
          expect(secondItemAgeCell.innerHTML).toBe('<strong>25</strong>');
        });

        it('should change an item property then call updateCell() on a cell that does not exist and expect it to be an empty string cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            {
              id: 'age',
              field: 'age',
              name: 'Age',
              formatter: (_row: number, _cell: number, val: any) => (val > 20 ? `<strong>${val}</strong>` : null),
            } as any,
          ];
          const items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          vi.spyOn(grid, 'getCellNode').mockReturnValueOnce(document.createElement('div'));
          const getDataItemSpy = vi.spyOn(grid, 'getDataItem').mockReturnValueOnce(null);
          items[1].age = 25;
          grid.updateCell(3, 3);

          const secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

          expect(getDataItemSpy).toHaveBeenCalledTimes(1);
          expect(secondItemAgeCell.innerHTML).toBe('');
        });

        it('should change an item value via asyncPostRenderer then call updateCell() and expect it to be updated in the UI with Formatter result', () => {
          const newValue = '25';
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', asyncPostRender: (node) => (node.textContent = newValue) },
          ] as Column[];
          const items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
          ];
          const gridOptions = {
            ...defaultOptions,
            enableCellNavigation: true,
            enableAsyncPostRender: true,
            enableAsyncPostRenderCleanup: true,
            asyncPostRenderDelay: 1,
            asyncPostRenderCleanupDelay: 1,
          };
          grid = new SlickGrid<any, Column>(container, items, columns, gridOptions);
          let firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
          expect(firstItemAgeCell.innerHTML).toBe('44');

          const getDataItemSpy = vi.spyOn(grid, 'getDataItem');
          grid.updateCell(0, 1);
          grid.invalidateRows([0]);
          vi.advanceTimersByTime(1);

          firstItemAgeCell = container.querySelector('.slick-row:nth-child(1) .slick-cell.l1.r1') as HTMLDivElement;
          expect(getDataItemSpy).toHaveBeenCalledTimes(2);
          expect(firstItemAgeCell.innerHTML).toBe('25');
        });

        it('should change an item from an Editor then call updateCell() and expect it call the editor loadValue() method', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          const items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          const currentEditor = grid.getCellEditor() as Editor;
          const editorSpy = vi.spyOn(currentEditor, 'loadValue');

          grid.updateCell(0, 1);

          expect(editorSpy).toHaveBeenCalledWith({ id: 0, name: 'Avery', age: 44 });
        });

        it('should call navigateDown() when calling save() on default editor', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          const items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const navigateDownSpy = vi.spyOn(grid, 'navigateDown');
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          grid.getEditorLock().commitCurrentEdit();

          expect(navigateDownSpy).not.toHaveBeenCalled();
        });

      });

      describe('updateRow() method', () => {
        let items: Array<{ id: number; name: string; age: number }> = [];

        beforeEach(() => {
          items = [
            { id: 0, name: 'Avery', age: 44 },
            { id: 1, name: 'Bob', age: 20 },
            { id: 2, name: 'Rachel', age: 46 },
            { id: 3, name: 'Jane', age: 24 },
            { id: 4, name: 'John', age: 20 },
            { id: 5, name: 'Arnold', age: 50 },
            { id: 6, name: 'Carole', age: 40 },
            { id: 7, name: 'Jason', age: 48 },
            { id: 8, name: 'Julie', age: 42 },
            { id: 9, name: 'Aaron', age: 23 },
            { id: 10, name: 'Ariane', age: 43 },
          ];
        });

        it('should call the method but expect nothing to happen when row number is invalid', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', formatter: (_row: number, _cell: number, val: any) => `<strong>${val}</strong>` },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const getDataItemSpy = vi.spyOn(grid, 'getDataItem');
          grid.updateRow(999);

          expect(getDataItemSpy).not.toHaveBeenCalled();
        });

        it('should call the method but expect it to empty the cell node when getDataItem() returns no item', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const getDataItemSpy = vi.spyOn(grid, 'getDataItem').mockReturnValueOnce(null);
          items[1].age = 25;
          grid.updateRow(1);

          const secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

          expect(getDataItemSpy).toHaveBeenCalledTimes(1);
          expect(secondItemAgeCell.innerHTML).toBe('');
        });

        it('should change an item property then call updateRow() and expect it to be updated in the UI with Formatter result', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', formatter: (_row: number, _cell: number, val: any) => `<strong>${val}</strong>` },
          ];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const getDataItemSpy = vi.spyOn(grid, 'getDataItem');
          items[1].age = 25;
          grid.updateRow(1);

          const secondItemAgeCell = container.querySelector('.slick-row:nth-child(2) .slick-cell.l1.r1') as HTMLDivElement;

          expect(getDataItemSpy).toHaveBeenCalledTimes(1);
          expect(secondItemAgeCell.innerHTML).toBe('<strong>25</strong>');
        });

        it('should change an item from an Editor then call updateRow() and expect it call the editor loadValue() method', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          const currentEditor = grid.getCellEditor() as Editor;
          const editorSpy = vi.spyOn(currentEditor, 'loadValue');

          grid.updateRow(0);

          expect(editorSpy).toHaveBeenCalledWith({ id: 0, name: 'Avery', age: 44 });
        });
      });
    });

    describe('Activate Cell/Row methods', () => {
      let items: Array<{ id: number; name: string; age: number }> = [];

      beforeEach(() => {
        items = [
          { id: 0, name: 'Avery', age: 44 },
          { id: 1, name: 'Bob', age: 20 },
          { id: 2, name: 'Rachel', age: 46 },
          { id: 3, name: 'Jane', age: 24 },
          { id: 4, name: 'John', age: 20 },
          { id: 5, name: 'Arnold', age: 50 },
          { id: 6, name: 'Carole', age: 40 },
          { id: 7, name: 'Jason', age: 48 },
          { id: 8, name: 'Julie', age: 42 },
          { id: 9, name: 'Aaron', age: 23 },
          { id: 10, name: 'Ariane', age: 43 },
        ];
      });

      describe('setActiveRow() method', () => {
        it('should do nothing when row to activate is greater than data length or cell is greater than available column length', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollViewSpy = vi.spyOn(grid, 'scrollCellIntoView');
          grid.setActiveRow(99, 1);
          grid.setActiveRow(1, 99);

          expect(scrollViewSpy).not.toHaveBeenCalled();
        });

        it('should do nothing when row or cell is a negative number', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollViewSpy = vi.spyOn(grid, 'scrollCellIntoView');
          grid.setActiveRow(-1, 1);
          grid.setActiveRow(1, -1);

          expect(scrollViewSpy).not.toHaveBeenCalled();
        });

        it('should do nothing when row to activate is greater than data length', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollViewSpy = vi.spyOn(grid, 'scrollCellIntoView');
          grid.setActiveRow(1, 1);

          expect(scrollViewSpy).toHaveBeenCalledWith(1, 1, false);
        });
      });

      describe('gotoCell() method', () => {
        it('should restore focus when gotoCell does not create an editor', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const setFocusSpy = vi.spyOn(grid, 'setFocus');
          grid.gotoCell(0, 0);

          expect(setFocusSpy).toHaveBeenCalled();
        });

        it('should call gotoCell() and expect it to scroll to the cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
          grid.gotoCell(0, 1);

          expect(scrollCellSpy).toHaveBeenCalledWith(0, 1, false);
        });

        it('should call gotoCell() with invalid cell and expect to NOT scroll to the cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
          grid.gotoCell(99, 1);

          expect(scrollCellSpy).not.toHaveBeenCalled();
        });

        it('should call gotoCell() with commitCurrentEdit() returning false and expect to NOT scroll to the cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];

          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollCellSpy = vi.spyOn(grid, 'scrollCellIntoView');
          vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(false);
          grid.gotoCell(0, 1);

          expect(scrollCellSpy).not.toHaveBeenCalled();
        });
      });

      describe('canCellBeActive() method', () => {
        it('should return false when no items provided', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(false);
        });

        it('should return false when column is hidden', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', hidden: true }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when cell is assign with default props', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(true);
        });

        it('should return false when column has column focusable assigned as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', focusable: false }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column focusable as true', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ focusable: true });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(true);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column focusable as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ focusable: false });
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column focusable as true', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns } as any);
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(true);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column focusable as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', focusable: false }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns: { name: { focusable: false } } } as any);
          const result = grid.canCellBeActive(0, 0);

          expect(result).toBe(false);
        });
      });

      describe('canCellBeSelected() method', () => {
        it('should return false when no items provided', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          grid = new SlickGrid<any, Column>(container, [], columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(false);
        });

        it('should return false when column is hidden', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', hidden: true }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when cell is assign with default props', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(true);
        });

        it('should return false when column has column selectable assigned as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', selectable: false }] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column selectable as true', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ selectable: true });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(true);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column selectable as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ selectable: false });
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(false);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column selectable as true', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name' }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns } as any);
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(true);
        });

        it('should return true when using DataView with a getItemMetadata() method available returning column selectable as false', () => {
          const columns = [{ id: 'name', field: 'name', name: 'Name', selectable: false }] as Column[];
          const dv = new SlickDataView();
          dv.setItems(items);
          grid = new SlickGrid<any, Column>(container, dv, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(dv, 'getItemMetadata').mockReturnValue({ columns } as any);
          const result = grid.canCellBeSelected(0, 0);

          expect(result).toBe(false);
        });
      });
    });

    describe('Grid Events', () => {
      let items: Array<{ id: number; name: string; age: number }> = [];

      beforeEach(() => {
        items = [
          { id: 0, name: 'Avery', age: 44 },
          { id: 1, name: 'Bob', age: 20 },
          { id: 2, name: 'Rachel', age: 46 },
          { id: 3, name: 'Jane', age: 24 },
          { id: 4, name: 'John', age: 20 },
          { id: 5, name: 'Arnold', age: 50 },
          { id: 6, name: 'Carole', age: 40 },
          { id: 7, name: 'Jason', age: 48 },
          { id: 8, name: 'Julie', age: 42 },
          { id: 9, name: 'Aaron', age: 23 },
          { id: 10, name: 'Ariane', age: 43 },
        ];
      });

      describe('Cell Click', () => {
        test('double-click event triggered on header resize handle should call "onColumnsResizeDblClick" notify', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onColumnsResizeDblClickSpy = vi.spyOn(grid.onColumnsResizeDblClick, 'notify');
          const columnElms = container.querySelectorAll('.slick-header-column');
          const resizeHandleElm = columnElms[0].querySelector('.slick-resizable-handle') as HTMLDivElement;

          const dblClickEvent = new Event('dblclick');
          resizeHandleElm.dispatchEvent(dblClickEvent);

          expect(onColumnsResizeDblClickSpy).toHaveBeenCalledWith({ triggeredByColumn: columns[0].id, grid }, expect.anything(), grid);
        });

        it('should not scroll or do anything when getCellFromEvent() returns null', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(grid, 'getCellFromEvent').mockReturnValue(null);
          const scrollViewSpy = vi.spyOn(grid, 'scrollRowIntoView');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2)');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(scrollViewSpy).not.toHaveBeenCalled();
        });

        it('should continue handling a cell click after its default action is prevented', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const scrollViewSpy = vi.spyOn(grid, 'scrollRowIntoView');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new MouseEvent('click', { bubbles: true, cancelable: true });
          event.preventDefault();
          secondRowSlickCells[1].dispatchEvent(event);

          expect(scrollViewSpy).toHaveBeenCalledWith(1, false);
        });

        it('should scroll to cell when clicking on cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onClickSpy = vi.spyOn(grid.onClick, 'notify');
          const scrollViewSpy = vi.spyOn(grid, 'scrollRowIntoView');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(scrollViewSpy).toHaveBeenCalledWith(1, false);
          expect(onClickSpy).toHaveBeenCalled();
        });

        it('should scroll to cell when clicking on cell and expect window.getSelection to call removeAllRanges() and addRange() which is a hack to keep text selection on IE/Firefox', () => {
          const addRangeMock = vi.fn();
          const removeRangeMock = vi.fn();
          vi.spyOn(window, 'getSelection')
            .mockReturnValueOnce({ rangeCount: 2, getRangeAt: () => items[1].name } as any)
            .mockReturnValueOnce({ removeAllRanges: removeRangeMock, addRange: addRangeMock } as any);

          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onClickSpy = vi.spyOn(grid.onClick, 'notify');
          const scrollViewSpy = vi.spyOn(grid, 'scrollRowIntoView');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(removeRangeMock).toHaveBeenCalled();
          expect(addRangeMock).toHaveBeenCalledWith(items[1].name);
          expect(scrollViewSpy).toHaveBeenCalledWith(1, false);
          expect(onClickSpy).toHaveBeenCalled();
        });
      });

      describe('Cell Double-Click', () => {
        it('should goto cell or do anything when getCellFromEvent() returns null', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(grid, 'getCellFromEvent').mockReturnValue(null);
          const gotoCellSpy = vi.spyOn(grid, 'gotoCell');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2)');
          const event = new CustomEvent('dblclick');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(gotoCellSpy).not.toHaveBeenCalled();
        });

        it('should goto cell or do anything when event default is prevented', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const gotoCellSpy = vi.spyOn(grid, 'gotoCell');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('dblclick');
          Object.defineProperty(event, 'defaultPrevented', { writable: true, value: true });
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(gotoCellSpy).not.toHaveBeenCalled();
        });

        it('should scroll to cell when clicking on cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const gotoCellSpy = vi.spyOn(grid, 'gotoCell');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('dblclick');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(gotoCellSpy).toHaveBeenCalled();
        });
      });

      describe('Cell Context Menu', () => {
        it('should trigger onContextMenu event when trigger from viewport even if we cannot find closest slick-cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onContextMenuSpy = vi.spyOn(grid.onContextMenu, 'notify');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2)');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[0] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onContextMenuSpy).toHaveBeenCalled();
        });

        it('should not trigger onContextMenu event when current cell is active and is editable', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          grid.setActiveCell(1, 1);
          const onContextMenuSpy = vi.spyOn(grid.onContextMenu, 'notify');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'defaultPrevented', { writable: true, value: true });
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onContextMenuSpy).not.toHaveBeenCalled();
        });

        it('should trigger onContextMenu event when current cell is not active and not editable', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onContextMenuSpy = vi.spyOn(grid.onContextMenu, 'notify');
          const secondRowSlickCells = container.querySelectorAll('.slick-row:nth-child(2) .slick-cell');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'target', { writable: true, value: secondRowSlickCells[1] });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onContextMenuSpy).toHaveBeenCalled();
        });
      });

      describe('Cell Mouse Events', () => {
        it('should trigger onMouseEnter notify when hovering a cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onMouseEnterSpy = vi.spyOn(grid.onMouseEnter, 'notify');
          container.querySelector('.slick-cell')!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

          expect(onMouseEnterSpy).toHaveBeenCalled();
        });

        it('should trigger onHeaderMouseLeave notify when leaving the hovering of a cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onMouseLeaveSpy = vi.spyOn(grid.onMouseLeave, 'notify');
          container.querySelector('.grid-canvas-left')!.dispatchEvent(new CustomEvent('mouseout'));

          expect(onMouseLeaveSpy).toHaveBeenCalled();
        });
      });

      describe('Pre-Header Click', () => {
        it('should trigger onPreHeaderClick notify when not column resizing', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            enableCellNavigation: true,
            editable: true,
            createPreHeaderPanel: true,
            showPreHeaderPanel: true,
          });
          vi.spyOn(grid, 'getCellFromEvent').mockReturnValue(null);
          const onPreHeaderClickSpy = vi.spyOn(grid.onPreHeaderClick, 'notify');
          const preHeaderElms = container.querySelectorAll('.slick-preheader-panel');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: preHeaderElms[0] });
          preHeaderElms[0].dispatchEvent(event);

          expect(onPreHeaderClickSpy).toHaveBeenCalledWith({ node: preHeaderElms[0], grid }, expect.anything(), grid);
        });
      });

      describe('Pre-Header Context Menu', () => {
        it('should trigger onHeaderClick notify grid context menu event is triggered', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            enableCellNavigation: true,
            editable: true,
            createPreHeaderPanel: true,
            showPreHeaderPanel: true,
          });
          const onContextSpy = vi.spyOn(grid.onPreHeaderContextMenu, 'notify');
          const preHeaderElms = container.querySelectorAll('.slick-preheader-panel');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'target', { writable: true, value: preHeaderElms[0] });
          preHeaderElms[0].dispatchEvent(event);

          expect(onContextSpy).toHaveBeenCalledWith({ node: preHeaderElms[0], grid }, expect.anything(), grid);
        });
      });

      describe('Header Events', () => {
        it('should trigger onHeaderClick notify when not column resizing', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(grid, 'getCellFromEvent').mockReturnValue(null);
          const onHeaderClickSpy = vi.spyOn(grid.onHeaderClick, 'notify');
          const headerColumns = container.querySelectorAll('.slick-header-column');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: headerColumns[0] });
          container.querySelector('.slick-header.slick-header-left')!.dispatchEvent(event);

          expect(onHeaderClickSpy).toHaveBeenCalledWith({ column: columns[0], grid }, expect.anything(), grid);
        });
      });

      describe('Header Context Menu', () => {
        it('should trigger onHeaderClick notify grid context menu event is triggered', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onContextSpy = vi.spyOn(grid.onHeaderContextMenu, 'notify');
          const headerColumns = container.querySelectorAll('.slick-header-column');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'target', { writable: true, value: headerColumns[0] });
          container.querySelector('.slick-header.slick-header-left')!.dispatchEvent(event);

          expect(onContextSpy).toHaveBeenCalledWith({ column: columns[0], grid }, expect.anything(), grid);
        });
      });

      describe('Header Mouse Events', () => {
        it('should trigger onHeaderMouseEnter notify when hovering a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseEnterSpy = vi.spyOn(grid.onHeaderMouseEnter, 'notify');
          container.querySelector('.slick-header-column')!.dispatchEvent(new CustomEvent('mouseenter'));

          expect(onHeaderMouseEnterSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderMouseEnter notify when hovering a header when "slick-header-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseEnterSpy = vi.spyOn(grid.onHeaderMouseEnter, 'notify');
          const headerRowElm = container.querySelector('.slick-header-column');
          headerRowElm!.classList.remove('slick-header-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseenter'));

          expect(onHeaderMouseEnterSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderMouseOver notify when hovering a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseOverSpy = vi.spyOn(grid.onHeaderMouseOver, 'notify');
          container.querySelector('.slick-header-column')!.dispatchEvent(new CustomEvent('mouseover'));

          expect(onHeaderMouseOverSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderMouseOver notify when hovering a header when "slick-header-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseOverSpy = vi.spyOn(grid.onHeaderMouseOver, 'notify');
          const headerRowElm = container.querySelector('.slick-header-column');
          headerRowElm!.classList.remove('slick-header-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseover'));

          expect(onHeaderMouseOverSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderMouseLeave notify when leaving the hovering of a header when "slick-header-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseLeaveSpy = vi.spyOn(grid.onHeaderMouseLeave, 'notify');
          container.querySelector('.slick-header-column')!.dispatchEvent(new CustomEvent('mouseleave'));

          expect(onHeaderMouseLeaveSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderMouseLeave notify when leaving the hovering of a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseLeaveSpy = vi.spyOn(grid.onHeaderMouseLeave, 'notify');
          const headerRowElm = container.querySelector('.slick-header-column');
          headerRowElm!.classList.remove('slick-header-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseleave'));

          expect(onHeaderMouseLeaveSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderMouseOut notify when leaving the hovering of a header when "slick-header-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseOutSpy = vi.spyOn(grid.onHeaderMouseOut, 'notify');
          container.querySelector('.slick-header-column')!.dispatchEvent(new CustomEvent('mouseout'));

          expect(onHeaderMouseOutSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderMouseOut notify when leaving the hovering of a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true });
          const onHeaderMouseOutSpy = vi.spyOn(grid.onHeaderMouseOut, 'notify');
          const headerRowElm = container.querySelector('.slick-header-column');
          headerRowElm!.classList.remove('slick-header-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseout'));

          expect(onHeaderMouseOutSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderRowMouseEnter notify when hovering a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseEnterSpy = vi.spyOn(grid.onHeaderRowMouseEnter, 'notify');
          container.querySelector('.slick-headerrow-column')!.dispatchEvent(new CustomEvent('mouseenter'));

          expect(onHeaderRowMouseEnterSpy).toHaveBeenCalled();
        });

        it('should trigger onHeaderRowMouseOver notify when hovering a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseOverSpy = vi.spyOn(grid.onHeaderRowMouseOver, 'notify');
          container.querySelector('.slick-headerrow-column')!.dispatchEvent(new CustomEvent('mouseover'));

          expect(onHeaderRowMouseOverSpy).toHaveBeenCalled();
        });

        it('should update the shared horizontal scroller when scrolling in headerRow DOM element', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            pinning: { columns: { left: 0 } },
            showHeaderRow: true,
            enableCellNavigation: true,
          });
          const headerRowElm = container.querySelector('.slick-headerrow') as HTMLDivElement;
          Object.defineProperty(headerRowElm, 'scrollLeft', { writable: true, value: 25 });

          headerRowElm.dispatchEvent(new CustomEvent('scroll'));

          expect((grid as any)._dockingHorizontalScroller.scrollLeft).toBe(25);
        });

        it('should update the shared horizontal scroller when scrolling in footerRow DOM element', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            pinning: { columns: { left: 0 } },
            createFooterRow: true,
            showFooterRow: true,
            enableCellNavigation: true,
          });
          const footerRowElm = container.querySelector('.slick-footerrow') as HTMLDivElement;
          Object.defineProperty(footerRowElm, 'scrollLeft', { writable: true, value: 25 });

          footerRowElm.dispatchEvent(new CustomEvent('scroll'));

          expect((grid as any)._dockingHorizontalScroller.scrollLeft).toBe(25);
        });

        it('should update the shared horizontal scroller when scrolling in preHeader DOM element', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            pinning: { columns: { left: 0 } },
            createPreHeaderPanel: true,
            preHeaderPanelHeight: 44,
            showPreHeaderPanel: true,
            enableCellNavigation: true,
          });
          const preheaderElm = container.querySelector('.slick-preheader-panel') as HTMLDivElement;
          Object.defineProperty(preheaderElm, 'scrollLeft', { writable: true, value: 25 });

          preheaderElm.dispatchEvent(new CustomEvent('scroll'));

          expect((grid as any)._dockingHorizontalScroller.scrollLeft).toBe(25);

          // when enableTextSelectionOnCells isn't enabled and trigger IE related code
          const selectStartEvent = new CustomEvent('selectstart');
          const eventStartSpy = vi.spyOn(selectStartEvent, 'preventDefault');
          Object.defineProperty(selectStartEvent, 'target', { writable: true, value: document.createElement('TextArea') });
          grid.getViewportNode()!.dispatchEvent(selectStartEvent);

          expect(eventStartSpy).not.toHaveBeenCalled();
        });

        it('should update the shared horizontal scroller when scrolling in topHeader DOM element', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            pinning: { columns: { left: 0 } },
            createTopHeaderPanel: true,
            topHeaderPanelHeight: 44,
            showTopHeaderPanel: true,
            enableCellNavigation: true,
          });
          const topheaderElm = container.querySelector('.slick-topheader-panel') as HTMLDivElement;
          Object.defineProperty(topheaderElm, 'scrollLeft', { writable: true, value: 25 });

          topheaderElm.dispatchEvent(new CustomEvent('scroll'));

          expect((grid as any)._dockingHorizontalScroller.scrollLeft).toBe(25);

          // when enableTextSelectionOnCells isn't enabled and trigger IE related code
          const selectStartEvent = new CustomEvent('selectstart');
          const eventStartSpy = vi.spyOn(selectStartEvent, 'preventDefault');
          Object.defineProperty(selectStartEvent, 'target', { writable: true, value: null });
          grid.getViewportNode()!.dispatchEvent(selectStartEvent);

          expect(eventStartSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderRowMouseEnter notify when hovering a header when "slick-headerrow-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseEnterSpy = vi.spyOn(grid.onHeaderRowMouseEnter, 'notify');
          const headerRowElm = container.querySelector('.slick-headerrow-column');
          headerRowElm!.classList.remove('slick-headerrow-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseenter'));

          expect(onHeaderRowMouseEnterSpy).not.toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderRowMouseOver notify when hovering a header when "slick-headerrow-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseOverSpy = vi.spyOn(grid.onHeaderRowMouseOver, 'notify');
          const headerRowElm = container.querySelector('.slick-headerrow-column');
          headerRowElm!.classList.remove('slick-headerrow-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseover'));

          expect(onHeaderRowMouseOverSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderRowMouseLeave notify when leaving the hovering of a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseLeaveSpy = vi.spyOn(grid.onHeaderRowMouseLeave, 'notify');
          container.querySelector('.slick-headerrow-column')!.dispatchEvent(new CustomEvent('mouseleave'));

          expect(onHeaderRowMouseLeaveSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderRowMouseLeave notify when leaving the hovering of a header when "slick-headerrow-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseLeaveSpy = vi.spyOn(grid.onHeaderRowMouseLeave, 'notify');
          const headerRowElm = container.querySelector('.slick-headerrow-column');
          headerRowElm!.classList.remove('slick-headerrow-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseleave'));

          expect(onHeaderRowMouseLeaveSpy).not.toHaveBeenCalled();
        });

        it('should trigger onHeaderRowMouseOut notify when leaving the hovering of a header', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseOutSpy = vi.spyOn(grid.onHeaderRowMouseOut, 'notify');
          container.querySelector('.slick-headerrow-column')!.dispatchEvent(new CustomEvent('mouseout'));

          expect(onHeaderRowMouseOutSpy).toHaveBeenCalled();
        });

        it('should NOT trigger onHeaderRowMouseOut notify when leaving the hovering of a header when "slick-headerrow-column" class is not found', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, showHeaderRow: true, enableCellNavigation: true });
          const onHeaderRowMouseOutSpy = vi.spyOn(grid.onHeaderRowMouseOut, 'notify');
          const headerRowElm = container.querySelector('.slick-headerrow-column');
          headerRowElm!.classList.remove('slick-headerrow-column');
          headerRowElm!.dispatchEvent(new CustomEvent('mouseout'));

          expect(onHeaderRowMouseOutSpy).not.toHaveBeenCalled();
        });
      });

      describe('Footer Click', () => {
        it('should trigger onFooterClick notify when not column resizing', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, createFooterRow: true, enableCellNavigation: true });
          const onFooterClickSpy = vi.spyOn(grid.onFooterClick, 'notify');
          const FooterColumns = container.querySelectorAll('.slick-footerrow-column');
          const event = new CustomEvent('click');
          Object.defineProperty(event, 'target', { writable: true, value: FooterColumns[0] });
          container.querySelector('.slick-footerrow-columns.slick-footerrow-columns-left')!.dispatchEvent(event);

          expect(onFooterClickSpy).toHaveBeenCalledWith({ column: columns[0], grid }, expect.anything(), grid);
        });
      });

      describe('Footer Context Menu', () => {
        it('should trigger onFooterClick notify grid context menu event is triggered', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age' },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, createFooterRow: true, enableCellNavigation: true });
          const onContextSpy = vi.spyOn(grid.onFooterContextMenu, 'notify');
          const footerColumns = container.querySelectorAll('.slick-footerrow-column');
          const event = new CustomEvent('contextmenu');
          Object.defineProperty(event, 'target', { writable: true, value: footerColumns[0] });
          container.querySelector('.slick-footerrow-columns.slick-footerrow-columns-left')!.dispatchEvent(event);

          expect(onContextSpy).toHaveBeenCalledWith({ column: columns[0], grid }, expect.anything(), grid);
        });
      });

      describe('Keydown Events', () => {
        it('should call navigateRowStart() when triggering Home key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateRowStartSpy = vi.spyOn(grid, 'navigateRowStart');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'Home' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: false });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateRowStartSpy).toHaveBeenCalled();
        });

        it('should call navigateRowStart() when triggering Ctrl+ArrowLeft key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateRowStartSpy = vi.spyOn(grid, 'navigateRowStart');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowLeft' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateRowStartSpy).toHaveBeenCalled();
        });

        it('should call navigateTopStart() when triggering Ctrl+Home key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateTopStartSpy = vi.spyOn(grid, 'navigateTopStart');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'Home' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateTopStartSpy).toHaveBeenCalled();
        });

        it('should call navigateTop() when triggering Ctrl+ArrowUp key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateTopSpy = vi.spyOn(grid, 'navigateTop');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowUp' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateTopSpy).toHaveBeenCalled();
        });

        it('should call navigateBottomEnd() when triggering Ctrl+End key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateBottomEndSpy = vi.spyOn(grid, 'navigateBottomEnd');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'End' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateBottomEndSpy).toHaveBeenCalled();
        });

        it('should call navigateRowEnd() when triggering End key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateRowEndSpy = vi.spyOn(grid, 'navigateRowEnd');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'End' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateRowEndSpy).toHaveBeenCalled();
        });

        it('should call navigateRowEnd() when triggering Ctrl+ArrowRight key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateRowEndSpy = vi.spyOn(grid, 'navigateRowEnd');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowRight' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateRowEndSpy).toHaveBeenCalled();
        });

        it('should call navigateBottom() when triggering Ctrl+ArrowDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateBottomSpy = vi.spyOn(grid, 'navigateBottom');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowDown' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateBottomSpy).toHaveBeenCalled();
        });

        it('should call navigateTop() when triggering Ctrl+ArrowUp key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateTopSpy = vi.spyOn(grid, 'navigateTop');
          const unsetActiveCellSpy = vi.spyOn(grid, 'unsetActiveCell');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowUp' });
          Object.defineProperty(event, 'ctrlKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateTopSpy).toHaveBeenCalled();
          expect(unsetActiveCellSpy).toHaveBeenCalled();
        });

        it('should call navigatePageDown() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigatePageDownSpy = vi.spyOn(grid, 'navigatePageDown');
          const unsetActiveCellSpy = vi.spyOn(grid, 'unsetActiveCell');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'PageDown' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigatePageDownSpy).toHaveBeenCalled();
          expect(unsetActiveCellSpy).toHaveBeenCalled();
        });

        it('should call navigatePageUp() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigatePageUpSpy = vi.spyOn(grid, 'navigatePageUp');
          const unsetActiveCellSpy = vi.spyOn(grid, 'unsetActiveCell');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'PageUp' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigatePageUpSpy).toHaveBeenCalled();
          expect(unsetActiveCellSpy).toHaveBeenCalled();
        });

        it('should call navigateLeft() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateLeftSpy = vi.spyOn(grid, 'navigateLeft');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowLeft' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateLeftSpy).toHaveBeenCalled();
        });

        it('should call navigateRight() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateRightSpy = vi.spyOn(grid, 'navigateRight');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowRight' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateRightSpy).toHaveBeenCalled();
        });

        it('should call navigateUp() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateUpSpy = vi.spyOn(grid, 'navigateUp');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowUp' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateUpSpy).toHaveBeenCalled();
        });

        it('should call navigateDown() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateDownSpy = vi.spyOn(grid, 'navigateDown');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'ArrowDown' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateDownSpy).toHaveBeenCalled();
        });

        it('should call navigateNext() when triggering PageDown key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigateNextSpy = vi.spyOn(grid, 'navigateNext');
          const unsetActiveCellSpy = vi.spyOn(grid, 'unsetActiveCell');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'Tab' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigateNextSpy).toHaveBeenCalled();
          expect(unsetActiveCellSpy).toHaveBeenCalled();
        });


        it('should call navigatePrev() when triggering Enter key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const navigatePrevSpy = vi.spyOn(grid, 'navigatePrev');
          const unsetActiveCellSpy = vi.spyOn(grid, 'unsetActiveCell');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'Tab' });
          Object.defineProperty(event, 'shiftKey', { writable: true, value: true });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(navigatePrevSpy).toHaveBeenCalled();
          expect(unsetActiveCellSpy).toHaveBeenCalled();
        });


        it('should do nothing when triggering Escape key without any editor to cancel', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          const cancelEditSpy = vi.spyOn(grid.getEditorLock(), 'cancelCurrentEdit');
          Object.defineProperty(event, 'key', { writable: true, value: 'Escape' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(cancelEditSpy).not.toHaveBeenCalled();
        });

        it('should open the editor in the active cell if F2 is pressed', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            enableCellNavigation: true,
            editable: true,
            autoEdit: false,
          });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          const activateEditorSpy = vi.spyOn(grid.getEditorLock(), 'activate');
          Object.defineProperty(event, 'key', { writable: true, value: 'F2' });
          grid.setActiveCell(0, 1, false);
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(activateEditorSpy).toHaveBeenCalled();
        });


        it('should cancel opened editor when triggering Escape key and editor is active', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          vi.spyOn(grid.getEditorLock(), 'isActive').mockReturnValue(true);
          const cancelEditSpy = vi.spyOn(grid.getEditorLock(), 'cancelCurrentEdit');
          Object.defineProperty(event, 'key', { writable: true, value: 'Escape' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(cancelEditSpy).toHaveBeenCalled();
        });

        it('should call navigateDown() when triggering Enter key', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'Enter' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
        });

        it('should commit editor & set focus to next down cell when triggering Enter key with an active Editor', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          vi.spyOn(grid.getEditorLock(), 'commitCurrentEdit').mockReturnValueOnce(true);
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
          Object.defineProperty(event, 'key', { writable: true, value: 'Enter' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(stopPropagationSpy).toHaveBeenCalled();
        });

        it('should navigateDown() when triggering Enter key with an active Editor that is considered a new row', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          vi.spyOn(grid, 'getDataLength').mockReturnValueOnce(0);
          const navigateDownSpy = vi.spyOn(grid, 'navigateDown');
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
          Object.defineProperty(event, 'key', { writable: true, value: 'Enter' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(stopPropagationSpy).toHaveBeenCalled();
          expect(navigateDownSpy).toHaveBeenCalled();
        });

        it('should do nothing when active Editor has multiple keyCaptureList and event is triggered is part of that list', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, { ...defaultOptions, enableCellNavigation: true, editable: true });
          grid.setActiveCell(0, 1);
          grid.editActiveCell(InputEditor as any, true);
          (InputEditor.prototype as any).keyCaptureList = [1, 2, 3];
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
          Object.defineProperty(event, 'which', { writable: true, value: 2 });
          Object.defineProperty(event, 'key', { writable: true, value: 'Enter' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(stopPropagationSpy).not.toHaveBeenCalled();
        });

        it('should open editor when "autoEditByKeypress" is enabled and we start typing a character on an active cell', () => {
          const columns = [
            { id: 'name', field: 'name', name: 'Name' },
            { id: 'age', field: 'age', name: 'Age', editor: InputEditor },
          ] as Column[];
          grid = new SlickGrid<any, Column>(container, items, columns, {
            ...defaultOptions,
            enableCellNavigation: true,
            editable: true,
            autoEdit: false,
            autoEditByKeypress: true,
          });
          const activeCell = { row: 0, cell: 1 };
          grid.setActiveCell(activeCell.row, activeCell.cell);
          vi.spyOn(grid, 'getActiveCell').mockReturnValue(activeCell);
          vi.spyOn(grid, 'getCellNode').mockReturnValue(document.createElement('div'));
          const onKeyDownSpy = vi.spyOn(grid.onKeyDown, 'notify');
          const event = new CustomEvent('keydown');
          Object.defineProperty(event, 'key', { writable: true, value: 'C' });
          container.querySelector('.grid-canvas-left')!.dispatchEvent(event);

          expect(onKeyDownSpy).toHaveBeenCalled();
          expect(grid.getCellEditor()).toBeTruthy();
        });
      });
    });
  });
});
