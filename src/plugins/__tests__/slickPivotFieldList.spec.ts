import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption, PivotField, PivotOption, PivotResult, PivotSpec } from '../../models';
import { SlickPivotDetails } from '../../controls/slick.pivotdetails';
import { SlickPivotPanel } from '../../controls/slick.pivotpanel';
import { SlickPivotToolbar } from '../../controls/slick.pivottoolbar';
import { SlickGrid } from '../../slick.grid';
import { PivotEngine } from '../../slick.pivotengine';
import { SlickPivot } from '../slick.pivot';
import { SlickPivotFieldList } from '../slick.pivotfieldlist';
import type { PivotFieldListOption } from '../slick.pivotfieldlist';
import { SlickRowSelectionModel } from '../slick.rowselectionmodel';

const createRows = () => [
  { id: 1, region: 'East', country: 'China', year: 2023, units: 10 },
  { id: 2, region: 'East', country: 'China', year: 2024, units: 30 },
  { id: 3, region: 'East', country: 'Japan', year: 2023, units: 5 },
  { id: 4, region: 'West', country: 'France', year: 2024, units: 20 },
];

const columns: Column[] = [
  { id: 'region', name: 'Region', field: 'region' },
  { id: 'country', name: 'Country', field: 'country' },
  { id: 'year', name: 'Year', field: 'year' },
  { id: 'units', name: 'Units', field: 'units' },
];

const fields: PivotField[] = [{ id: 'year', type: 'number' }, { id: 'units', type: 'number' }];

const baseSpec: Partial<PivotSpec> = { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'units', aggregator: 'sum' }] };

describe('SlickPivotFieldList', () => {
  let grids: SlickGrid[] = [];
  let container: HTMLDivElement;
  let gridElm: HTMLDivElement;
  let grid: SlickGrid;
  let pivot: SlickPivot;
  let fieldList: SlickPivotFieldList;

  /** The application's grid, in its container, with the pivot and the field list registered with it */
  const createFieldList = (options: Partial<PivotFieldListOption> = {}, pivotOptions: Partial<PivotOption> = {}, gridOptions: GridOption = {}) => {
    container = document.createElement('div');
    container.id = 'gridAndPivot';
    gridElm = document.createElement('div');
    gridElm.className = 'slick-container';
    container.appendChild(gridElm);
    document.body.appendChild(container);
    grid = new SlickGrid(gridElm, createRows(), columns.map((column) => ({ ...column })), SlickPivot.getGridOptions({ enableCellNavigation: true, ...gridOptions }));
    grids.push(grid);
    pivot = new SlickPivot({ fields, spec: baseSpec, locale: 'en-US', ...pivotOptions });
    grid.registerPlugin(pivot);
    fieldList = new SlickPivotFieldList({ container, ...options });
    grid.registerPlugin(fieldList);
    return fieldList;
  };

  const part = (name: string) => container.querySelector<HTMLElement>(`:scope > .slick-pivot-layout-${name}`);
  const toolbarItem = (item: string) => container.querySelector<HTMLButtonElement>(`.slick-pivot-toolbar [data-item="${item}"]`);
  const splitter = () => part('splitter')!;
  const pane = () => part('fields')!;
  const status = () => part('status')!;
  const pressKey = (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event.defaultPrevented;
  };
  const pointer = (type: string, clientX: number, init: PointerEventInit = {}) => {
    // jsdom has no PointerEvent: a MouseEvent with a pointer id does
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, button: 0, ...init });
    Object.defineProperty(event, 'pointerId', { value: (init as any).pointerId ?? 1 });
    splitter().dispatchEvent(event);
    return event;
  };
  const mockRect = (element: HTMLElement, left: number, width: number) =>
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ left, right: left + width, width, top: 0, bottom: 400, height: 400 } as DOMRect);

  afterEach(() => {
    grids.forEach((item) => item.destroy());
    grids = [];
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('needs a pivot plugin and a container that holds the grid', () => {
    container = document.createElement('div');
    gridElm = document.createElement('div');
    container.appendChild(gridElm);
    document.body.appendChild(container);
    grid = new SlickGrid(gridElm, createRows(), columns, SlickPivot.getGridOptions());
    grids.push(grid);
    expect(() => grid.registerPlugin(new SlickPivotFieldList({ container }))).toThrow('[SlickPivotFieldList] no pivot plugin, register the SlickPivot plugin with the grid first');
    grid.registerPlugin(new SlickPivot({ fields, spec: baseSpec }));
    expect(() => grid.registerPlugin(new SlickPivotFieldList({ container: '#nowhere' }))).toThrow('[SlickPivotFieldList] the container was not found, or does not hold the grid.');
    const elsewhere = document.createElement('div');
    document.body.appendChild(elsewhere);
    expect(() => grid.registerPlugin(new SlickPivotFieldList({ container: elsewhere }))).toThrow('does not hold the grid');
  });

  it('adds the toolbar, the splitter, the PivotTable Fields pane and the status bar around the grid, without moving it', () => {
    createFieldList();
    expect(Array.from(container.children)).toEqual([gridElm, part('toolbar'), part('splitter'), part('fields'), part('status')]);
    expect(Array.from(container.querySelectorAll(':scope > .slick-pivot-layout-part'))).toHaveLength(4);
    expect(gridElm.classList.contains('slick-pivot')).toBe(true);
    expect(container.classList.contains('slick-pivot-layout')).toBe(true);
    expect(container.classList.contains('slick-pivot-layout-fields-end')).toBe(true);
    expect(container.hasAttribute('dir')).toBe(false);

    expect(fieldList.pluginName).toBe('PivotFieldList');
    expect(grid.getPluginByName('PivotFieldList')).toBe(fieldList);
    expect([fieldList.getGrid(), fieldList.getPivot(), fieldList.getContainer()]).toEqual([grid, pivot, container]);
    expect(fieldList.getPanel()).toBeInstanceOf(SlickPivotPanel);
    expect(fieldList.getToolbar()).toBeInstanceOf(SlickPivotToolbar);
    expect(fieldList.getDetails()).toBeInstanceOf(SlickPivotDetails);
    expect(fieldList.getOptions().container).toBe(container);

    // the fields are made from the columns of the grid, and the pivot shows in it
    expect(pane().querySelector('.slick-pivot-field[data-field="region"] .slick-pivot-field-name')!.textContent).toBe('Region');
    expect(grid.getData()).toBe(pivot.rowModel);
    // the toolbar can show the pane again, so the pane can be closed
    expect(Array.from(container.querySelectorAll<HTMLElement>('.slick-pivot-toolbar [data-item]')).map((item) => item.dataset.item)).toEqual(['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo', 'fieldList']);
    expect(pane().querySelector('.slick-pivot-panel-close')).toBeTruthy();
    expect(pane().querySelector('.slick-pivot-mode-checkbox')).toBeTruthy();
    expect(fieldList.isVisible()).toBe(true);
  });

  it('finds its container from a selector, and uses the pivot given to it', () => {
    container = document.createElement('div');
    container.id = 'gridAndPivot';
    gridElm = document.createElement('div');
    container.appendChild(gridElm);
    document.body.appendChild(container);
    grid = new SlickGrid(gridElm, createRows(), columns, SlickPivot.getGridOptions());
    grids.push(grid);
    pivot = new SlickPivot({ fields, spec: baseSpec });
    grid.registerPlugin(pivot);
    vi.spyOn(grid, 'getPluginByName');
    fieldList = new SlickPivotFieldList({ container: '#gridAndPivot', pivot });
    grid.registerPlugin(fieldList);
    expect(grid.getPluginByName).not.toHaveBeenCalled();
    expect(fieldList.getContainer()).toBe(container);
  });

  it('passes the options of each part to it', () => {
    createFieldList({ toolbar: { items: ['layout'] }, panel: { title: 'Fields' }, position: 'start', width: 280, details: { maxRows: 10 } });
    expect(Array.from(container.querySelectorAll<HTMLElement>('.slick-pivot-toolbar [data-item]')).map((item) => item.dataset.item)).toEqual(['layout']);
    expect(fieldList.getPanel()!.getOptions().title).toBe('Fields');
    // without the toolbar button, closing the pane would hide it for good
    expect(pane().querySelector('.slick-pivot-panel-close')).toBeNull();
    expect(container.classList.contains('slick-pivot-layout-fields-start')).toBe(true);
    expect(pane().style.width).toBe('280px');
    expect(fieldList.getDetails()!.getOptions().maxRows).toBe(10);
  });

  it('leaves out the parts set to false', () => {
    createFieldList({ toolbar: false, details: false, statusBar: false });
    expect(Array.from(container.querySelectorAll(':scope > .slick-pivot-layout-part')).map((child) => child.classList[1])).toEqual(['slick-pivot-layout-splitter', 'slick-pivot-layout-fields']);
    expect([fieldList.getToolbar(), fieldList.getDetails()]).toEqual([undefined, undefined]);
    expect(pane().querySelector('.slick-pivot-panel-close')).toBeNull();
  });

  it('hides and shows the pane from the toolbar, its close button or the API', () => {
    createFieldList();
    const toggled = vi.fn();
    fieldList.onToggled.subscribe((_e, args) => toggled(args.visible));

    toolbarItem('fieldList')!.click();
    expect(fieldList.isVisible()).toBe(false);
    expect([pane().hidden, splitter().hidden]).toEqual([true, true]);
    expect(toolbarItem('fieldList')!.getAttribute('aria-pressed')).toBe('false');
    expect(toggled).toHaveBeenLastCalledWith(false);

    toolbarItem('fieldList')!.click();
    expect([fieldList.isVisible(), pane().hidden, splitter().hidden]).toEqual([true, false, false]);
    expect(toggled).toHaveBeenLastCalledWith(true);

    // the close button hides it and gives the focus to the toolbar button that shows it again
    pane().querySelector<HTMLButtonElement>('.slick-pivot-panel-close')!.click();
    expect(fieldList.isVisible()).toBe(false);
    expect(document.activeElement).toBe(toolbarItem('fieldList'));

    fieldList.toggle();
    expect(fieldList.isVisible()).toBe(true);
    fieldList.setVisible(true);
    expect(toggled).toHaveBeenCalledTimes(4);
  });

  it('starts with the pane hidden when asked to', () => {
    createFieldList({ visible: false });
    expect(fieldList.isVisible()).toBe(false);
    expect(pane().hidden).toBe(true);
    expect(toolbarItem('fieldList')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('resizes the pane within its narrowest and widest widths', () => {
    createFieldList({ minWidth: 200, maxWidth: 500 });
    const resized = vi.fn();
    fieldList.onResized.subscribe((_e, args) => resized(args.width));
    expect(fieldList.getWidth()).toBe(300);
    expect([splitter().getAttribute('aria-valuemin'), splitter().getAttribute('aria-valuemax'), splitter().getAttribute('aria-valuenow')]).toEqual(['200', '500', '300']);
    expect(splitter().getAttribute('role')).toBe('separator');
    expect(splitter().getAttribute('aria-orientation')).toBe('vertical');
    expect(splitter().getAttribute('aria-controls')).toBe(pane().id);
    expect(splitter().getAttribute('aria-label')).toBe('Resize the field list');

    fieldList.setWidth(420.4);
    expect([fieldList.getWidth(), pane().style.width]).toEqual([420, '420px']);
    fieldList.setWidth(50);
    expect(fieldList.getWidth()).toBe(200);
    fieldList.setWidth(900, false);
    expect(fieldList.getWidth()).toBe(500);
    expect(resized.mock.calls.map((call) => call[0])).toEqual([420, 200]);
  });

  it('is at most 60% of the container wide, unless told otherwise', () => {
    createFieldList();
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 1000 });
    fieldList.setWidth(900);
    expect(fieldList.getWidth()).toBe(600);
    expect(splitter().getAttribute('aria-valuemax')).toBe('600');
  });

  it('moves its splitter with the arrow keys the way they point, Home and End giving the narrowest and widest widths', () => {
    createFieldList({ maxWidth: 500 });
    // the pane is on the right of the splitter
    mockRect(splitter(), 692, 8);
    mockRect(pane(), 700, 300);
    expect(pressKey(splitter(), 'ArrowLeft')).toBe(true);
    expect(fieldList.getWidth()).toBe(316);
    pressKey(splitter(), 'ArrowLeft', { shiftKey: true });
    expect(fieldList.getWidth()).toBe(380);
    pressKey(splitter(), 'ArrowRight');
    expect(fieldList.getWidth()).toBe(364);
    pressKey(splitter(), 'Home');
    expect(fieldList.getWidth()).toBe(240);
    pressKey(splitter(), 'End');
    expect(fieldList.getWidth()).toBe(500);
    expect(pressKey(splitter(), 'Enter')).toBe(false);

    // on the left of the splitter (at the start, or at the end of a right-to-left line), the arrows work the other way
    mockRect(pane(), 0, 300);
    mockRect(splitter(), 300, 8);
    pressKey(splitter(), 'ArrowLeft');
    expect(fieldList.getWidth()).toBe(484);
  });

  it('resizes the pane by dragging its splitter', () => {
    createFieldList();
    const resized = vi.fn();
    fieldList.onResized.subscribe((_e, args) => resized(args.width));
    mockRect(splitter(), 692, 8);
    mockRect(pane(), 700, 300);

    // only the main button drags, and only the pointer that started the drag moves the splitter
    pointer('pointerdown', 696, { button: 2 });
    pointer('pointermove', 600);
    expect(fieldList.getWidth()).toBe(300);

    pointer('pointerdown', 696);
    expect(container.classList.contains('slick-pivot-layout-resizing')).toBe(true);
    pointer('pointermove', 600, { pointerId: 2 } as any);
    expect(fieldList.getWidth()).toBe(300);
    pointer('pointermove', 596);
    // the pointer stays over the middle of the splitter: 1000 - 596 - 4
    expect(fieldList.getWidth()).toBe(400);
    expect(resized).not.toHaveBeenCalled();
    pointer('pointerup', 596);
    expect(container.classList.contains('slick-pivot-layout-resizing')).toBe(false);
    expect(resized).toHaveBeenCalledWith(400);
    pointer('pointerup', 596);
    expect(resized).toHaveBeenCalledTimes(1);

    // a pane on the left grows to the right
    mockRect(pane(), 0, 400);
    mockRect(splitter(), 400, 8);
    pointer('pointerdown', 404);
    pointer('pointermove', 354);
    pointer('pointercancel', 354);
    expect(fieldList.getWidth()).toBe(350);
  });

  it('cannot be resized when resizable is false', () => {
    createFieldList({ resizable: false });
    expect(splitter().hidden).toBe(true);
    pointer('pointerdown', 696);
    expect(container.classList.contains('slick-pivot-layout-resizing')).toBe(false);
  });

  it('shows the counts of the pivot in its status bar, or what its formatter returns', async () => {
    createFieldList();
    expect(status().textContent).toMatch(/^4 of 4 source rows · \d+ rows × \d+ columns · computed in \d+ ms$/);
    await pivot.setSpec({ ...baseSpec, filters: [{ field: 'region', include: ['West'] }] });
    expect(status().textContent).toContain('1 of 4 source rows');

    grids.forEach((item) => item.destroy());
    grids = [];
    const formatter = vi.fn((info: { result: PivotResult; rowCount: number; columnCount: number; }) => `${info.result.filteredRowCount} rows, ${info.rowCount} lines`);
    createFieldList({ statusBar: { formatter } });
    expect(status().textContent).toBe(`4 rows, ${grid.getDataLength()} lines`);
    expect(formatter).toHaveBeenCalledWith(expect.objectContaining({ columnCount: grid.getColumns().length, locale: 'en-US' }));
  });

  it('formats the counts without the parts a result leaves out', () => {
    const result = { sourceRowCount: 12345, filteredRowCount: 1234, duration: 7.6 } as PivotResult;
    expect(SlickPivotFieldList.formatStatus({ result, rowCount: 1000, columnCount: 3, locale: 'en-US' })).toBe('1,234 of 12,345 source rows · 1,000 rows × 3 columns · computed in 8 ms');
    expect(SlickPivotFieldList.formatStatus({ result: {} as PivotResult, rowCount: 2, columnCount: 3 })).toBe('2 rows × 3 columns');
  });

  it('tells in its status bar that an asynchronous provider is computing', async () => {
    let finish!: () => void;
    const engine = new PivotEngine({ fields: [{ id: 'region' }, { id: 'country' }, { id: 'year', type: 'number' }, { id: 'units', type: 'number' }] });
    const provider = {
      execute: vi.fn((request: any) => new Promise<PivotResult>((resolve) => {
        finish = () => resolve(engine.execute(createRows(), request.spec));
      })),
    };
    createFieldList({ statusBar: { loadingText: 'Wait…' } }, { provider });
    await vi.waitFor(() => expect(status().textContent).toBe('Wait…'));
    expect(status().classList.contains('slick-pivot-layout-status-loading')).toBe(true);
    finish();
    await vi.waitFor(() => expect(status().textContent).toContain('4 of 4 source rows'));
    expect(status().classList.contains('slick-pivot-layout-status-loading')).toBe(false);
  });

  it('turns Pivot Mode off and on from its pane, the grid showing its own rows and columns in between', async () => {
    createFieldList();
    const checkbox = pane().querySelector<HTMLInputElement>('.slick-pivot-mode-checkbox')!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(pivot.isPivotMode()).toBe(false);
    expect(grid.getColumns().map((column) => column.id)).toEqual(['region', 'country', 'year', 'units']);
    expect(grid.getDataLength()).toBe(4);
    // the status bar tells about the pivot, and the toolbar acts on it
    expect(status().hidden).toBe(true);
    expect(container.querySelector<HTMLSelectElement>('.slick-pivot-toolbar [data-item="layout"] select')!.disabled).toBe(true);
    expect(toolbarItem('fieldList')!.disabled).toBe(false);

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(pivot.isPivotMode()).toBe(true);
    expect(grid.getData()).toBe(pivot.rowModel);
    expect(status().hidden).toBe(false);
    expect(status().textContent).toContain('4 of 4 source rows');
  });

  it('clears the selection of the grid when Pivot Mode changes, a row of the pivot not being a source row', async () => {
    createFieldList();
    grid.setSelectionModel(new SlickRowSelectionModel());
    grid.setSelectedRows([1, 2]);
    expect(grid.getSelectedRows()).toEqual([1, 2]);
    await pivot.setPivotMode(false);
    expect(grid.getSelectedRows()).toEqual([]);
    grid.setSelectedRows([3]);
    await pivot.setPivotMode(true);
    expect(grid.getSelectedRows()).toEqual([]);
    expect(grid.getData()).toBe(pivot.rowModel);
  });

  it('puts the pane at the end of a right-to-left grid, and gives the container its reading direction back', () => {
    createFieldList({}, {}, { rtl: true });
    expect(container.getAttribute('dir')).toBe('rtl');
    grid.unregisterPlugin(fieldList);
    expect(container.hasAttribute('dir')).toBe(false);

    grids.forEach((item) => item.destroy());
    grids = [];
    document.body.innerHTML = '';
    // a container that already reads from right to left keeps its own direction
    document.body.setAttribute('dir', 'rtl');
    try {
      createFieldList({}, {}, { rtl: true });
      expect(container.hasAttribute('dir')).toBe(false);
    } finally {
      document.body.removeAttribute('dir');
    }
  });

  it('resizes the grid when its element changes size', () => {
    let notify!: () => void;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) {
        notify = callback;
      }

      observe = observe;
      disconnect = disconnect;
    });
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    const cancelFrame = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);

    createFieldList();
    expect(observe).toHaveBeenCalledWith(gridElm);
    const resizeCanvas = vi.spyOn(grid, 'resizeCanvas');
    // several changes in a frame resize the grid once
    notify();
    notify();
    expect(frames).toHaveLength(1);
    frames[0](0);
    expect(resizeCanvas).toHaveBeenCalledTimes(1);
    fieldList.resizeCanvas();
    expect(resizeCanvas).toHaveBeenCalledTimes(2);

    notify();
    grid.unregisterPlugin(fieldList);
    expect(cancelFrame).toHaveBeenCalledWith(2);
    expect(disconnect).toHaveBeenCalled();
  });

  it('removes its parts when unregistered, leaving the grid and the pivot plugin as they are', () => {
    createFieldList();
    const destroyed = [vi.spyOn(fieldList.getPanel()!, 'destroy'), vi.spyOn(fieldList.getToolbar()!, 'destroy'), vi.spyOn(fieldList.getDetails()!, 'destroy')];
    const gridDestroy = vi.spyOn(grid, 'destroy');
    const pivotDestroy = vi.spyOn(pivot, 'destroy');
    grid.unregisterPlugin(fieldList);
    expect(destroyed.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1]);
    expect([gridDestroy, pivotDestroy].map((spy) => spy.mock.calls.length)).toEqual([0, 0]);
    expect(Array.from(container.children)).toEqual([gridElm]);
    expect(container.className).toBe('');
    expect(grid.getPluginByName('Pivot')).toBe(pivot);
    expect(grid.getData()).toBe(pivot.rowModel);
    fieldList.destroy();
  });
});
