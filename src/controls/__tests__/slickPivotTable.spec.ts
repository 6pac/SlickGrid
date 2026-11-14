import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PivotField, PivotResult, PivotSpec } from '../../models';
import { SlickPivot } from '../../plugins/slick.pivot';
import { SlickGrid } from '../../slick.grid';
import { PivotEngine } from '../../slick.pivotengine';
import { SlickPivotDetails } from '../slick.pivotdetails';
import { SlickPivotPanel } from '../slick.pivotpanel';
import { SlickPivotTable } from '../slick.pivottable';
import type { PivotTableOption } from '../slick.pivottable';
import { SlickPivotToolbar } from '../slick.pivottoolbar';

const createRows = () => [
  { id: 1, region: 'East', country: 'China', year: 2023, units: 10 },
  { id: 2, region: 'East', country: 'China', year: 2024, units: 30 },
  { id: 3, region: 'East', country: 'Japan', year: 2023, units: 5 },
  { id: 4, region: 'West', country: 'France', year: 2024, units: 20 },
];

const fields: PivotField[] = [
  { id: 'region', label: 'Region' },
  { id: 'country', label: 'Country' },
  { id: 'year', label: 'Year', type: 'number' },
  { id: 'units', label: 'Units', type: 'number' },
];

const baseSpec: Partial<PivotSpec> = { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'units', aggregator: 'sum' }] };

describe('SlickPivotTable', () => {
  const created: SlickPivotTable[] = [];
  let container: HTMLDivElement;
  let pivotTable: SlickPivotTable;

  const createPivotTable = (options: Partial<PivotTableOption> = {}) => {
    container = document.createElement('div');
    container.id = 'pivotTable';
    document.body.appendChild(container);
    pivotTable = new SlickPivotTable(container, { fields, source: createRows(), spec: baseSpec, locale: 'en-US', ...options });
    created.push(pivotTable);
    return pivotTable;
  };

  const root = () => pivotTable.getElement();
  const part = (className: string) => root().querySelector<HTMLElement>(`.${className}`);
  const toolbarItem = (item: string) => root().querySelector<HTMLButtonElement>(`.slick-pivot-toolbar [data-item="${item}"]`);
  const splitter = () => part('slick-pivot-table-splitter')!;
  const fieldList = () => part('slick-pivot-table-fields')!;
  const status = () => part('slick-pivot-table-status')!;
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
    created.splice(0).forEach((instance) => instance.destroy());
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('throws when its container cannot be found', () => {
    expect(() => new SlickPivotTable('#nowhere', { fields, source: createRows(), spec: baseSpec })).toThrow('[SlickPivotTable] the pivot table container was not found.');
  });

  it('builds the toolbar, the grid with the pivot, the field list and the status bar in its container', () => {
    createPivotTable({ gridOptions: { rowHeight: 30 } });
    expect(root().parentElement).toBe(container);
    expect(root().dir).toBe('ltr');
    expect(Array.from(root().children).map((child) => child.className)).toEqual(['slick-pivot-table-toolbar', 'slick-pivot-table-body slick-pivot-table-fields-end', 'slick-pivot-table-status']);
    const [gridElm, splitterElm, fieldListElm] = Array.from(part('slick-pivot-table-body')!.children);
    expect(gridElm.classList.contains('slick-pivot-table-grid')).toBe(true);
    expect(gridElm.classList.contains('slick-pivot')).toBe(true);
    expect(gridElm).toBe(pivotTable.getGrid().getContainerNode());
    expect([splitterElm.className, fieldListElm.className]).toEqual(['slick-pivot-table-splitter', 'slick-pivot-table-fields']);

    expect(pivotTable.getGrid()).toBeInstanceOf(SlickGrid);
    expect(pivotTable.getPivot()).toBeInstanceOf(SlickPivot);
    expect(pivotTable.getFieldList()).toBeInstanceOf(SlickPivotPanel);
    expect(pivotTable.getToolbar()).toBeInstanceOf(SlickPivotToolbar);
    expect(pivotTable.getDetails()).toBeInstanceOf(SlickPivotDetails);
    expect(pivotTable.getOptions().gridOptions).toEqual({ rowHeight: 30 });

    // the grid options are merged with the ones the pivot needs
    const gridOptions = pivotTable.getGrid().getOptions();
    expect([gridOptions.rowHeight, gridOptions.enableCellNavigation, gridOptions.createPreHeaderPanel, gridOptions.showPreHeaderPanel]).toEqual([30, true, true, true]);
    expect(pivotTable.getGrid().getPluginByName('Pivot')).toBe(pivotTable.getPivot());
    expect(pivotTable.getPivot().getSpec().rows).toEqual(['region', 'country']);
    expect(pivotTable.getGrid().getDataLength()).toBe(pivotTable.getPivot().rowModel.getLength());

    // the toolbar can show the field list again, so the field list can be closed
    expect(toolbarItem('fieldList')).toBeTruthy();
    expect(fieldList().querySelector('.slick-pivot-panel-close')).toBeTruthy();
    expect(pivotTable.isFieldListVisible()).toBe(true);
  });

  it('passes the options of each part to it', () => {
    createPivotTable({
      toolbar: { items: ['layout'] },
      fieldList: { title: 'Fields', position: 'start', width: 280 },
      details: { maxRows: 10 },
    });
    expect(Array.from(root().querySelectorAll<HTMLElement>('.slick-pivot-toolbar [data-item]')).map((item) => item.dataset.item)).toEqual(['layout']);
    expect(pivotTable.getFieldList()!.getOptions().title).toBe('Fields');
    // without the toolbar button, closing the field list would hide it for good
    expect(fieldList().querySelector('.slick-pivot-panel-close')).toBeNull();
    expect(part('slick-pivot-table-body')!.classList.contains('slick-pivot-table-fields-start')).toBe(true);
    expect(fieldList().style.width).toBe('280px');
    expect(pivotTable.getDetails()!.getOptions().maxRows).toBe(10);
  });

  it('leaves out the parts set to false', () => {
    createPivotTable({ toolbar: false, fieldList: false, details: false, statusBar: false });
    expect(Array.from(root().children).map((child) => child.className)).toEqual(['slick-pivot-table-body slick-pivot-table-fields-end']);
    expect(part('slick-pivot-table-splitter')).toBeNull();
    expect([pivotTable.getToolbar(), pivotTable.getFieldList(), pivotTable.getDetails()]).toEqual([undefined, undefined, undefined]);
    expect(pivotTable.isFieldListVisible()).toBe(false);
    pivotTable.setFieldListVisible(true);
    pivotTable.setFieldListWidth(500);
    expect(pivotTable.isFieldListVisible()).toBe(false);
    expect(pivotTable.getFieldListWidth()).toBe(300);

    created.splice(0).forEach((instance) => instance.destroy());
    createPivotTable({ fieldList: false });
    // no field list: no Field List button
    expect(toolbarItem('fieldList')).toBeNull();
    expect(toolbarItem('layout')).toBeTruthy();
  });

  it('hides and shows the field list from the toolbar, its close button or the API', () => {
    createPivotTable();
    const toggled = vi.fn();
    pivotTable.onFieldListToggled.subscribe((_e, args) => toggled(args.visible));

    toolbarItem('fieldList')!.click();
    expect(pivotTable.isFieldListVisible()).toBe(false);
    expect([fieldList().hidden, splitter().hidden]).toEqual([true, true]);
    expect(toolbarItem('fieldList')!.getAttribute('aria-pressed')).toBe('false');
    expect(toggled).toHaveBeenLastCalledWith(false);

    toolbarItem('fieldList')!.click();
    expect([pivotTable.isFieldListVisible(), fieldList().hidden, splitter().hidden]).toEqual([true, false, false]);
    expect(toggled).toHaveBeenLastCalledWith(true);

    // the close button hides it and gives the focus to the toolbar button that shows it again
    fieldList().querySelector<HTMLButtonElement>('.slick-pivot-panel-close')!.click();
    expect(pivotTable.isFieldListVisible()).toBe(false);
    expect(document.activeElement).toBe(toolbarItem('fieldList'));

    pivotTable.toggleFieldList();
    expect(pivotTable.isFieldListVisible()).toBe(true);
    pivotTable.setFieldListVisible(true);
    expect(toggled).toHaveBeenCalledTimes(4);
  });

  it('starts with the field list hidden when asked to', () => {
    createPivotTable({ fieldList: { visible: false } });
    expect(pivotTable.isFieldListVisible()).toBe(false);
    expect(fieldList().hidden).toBe(true);
    expect(toolbarItem('fieldList')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('resizes the field list within its narrowest and widest widths', () => {
    createPivotTable({ fieldList: { minWidth: 200, maxWidth: 500 } });
    const resized = vi.fn();
    pivotTable.onFieldListResized.subscribe((_e, args) => resized(args.width));
    expect(pivotTable.getFieldListWidth()).toBe(300);
    expect([splitter().getAttribute('aria-valuemin'), splitter().getAttribute('aria-valuemax'), splitter().getAttribute('aria-valuenow')]).toEqual(['200', '500', '300']);
    expect(splitter().getAttribute('role')).toBe('separator');
    expect(splitter().getAttribute('aria-orientation')).toBe('vertical');
    expect(splitter().getAttribute('aria-controls')).toBe(fieldList().id);
    expect(splitter().getAttribute('aria-label')).toBe('Resize the field list');

    pivotTable.setFieldListWidth(420.4);
    expect([pivotTable.getFieldListWidth(), fieldList().style.width]).toEqual([420, '420px']);
    pivotTable.setFieldListWidth(50);
    expect(pivotTable.getFieldListWidth()).toBe(200);
    pivotTable.setFieldListWidth(900, false);
    expect(pivotTable.getFieldListWidth()).toBe(500);
    expect(resized.mock.calls.map((call) => call[0])).toEqual([420, 200]);
  });

  it('is at most 60% of the pivot table wide, unless told otherwise', () => {
    createPivotTable();
    Object.defineProperty(part('slick-pivot-table-body')!, 'clientWidth', { configurable: true, value: 1000 });
    pivotTable.setFieldListWidth(900);
    expect(pivotTable.getFieldListWidth()).toBe(600);
    expect(splitter().getAttribute('aria-valuemax')).toBe('600');
  });

  it('moves its splitter with the arrow keys the way they point, Home and End giving the narrowest and widest widths', () => {
    createPivotTable({ fieldList: { maxWidth: 500 } });
    // the field list is on the right of the splitter
    mockRect(splitter(), 692, 8);
    mockRect(fieldList(), 700, 300);
    expect(pressKey(splitter(), 'ArrowLeft')).toBe(true);
    expect(pivotTable.getFieldListWidth()).toBe(316);
    pressKey(splitter(), 'ArrowLeft', { shiftKey: true });
    expect(pivotTable.getFieldListWidth()).toBe(380);
    pressKey(splitter(), 'ArrowRight');
    expect(pivotTable.getFieldListWidth()).toBe(364);
    pressKey(splitter(), 'Home');
    expect(pivotTable.getFieldListWidth()).toBe(240);
    pressKey(splitter(), 'End');
    expect(pivotTable.getFieldListWidth()).toBe(500);
    expect(pressKey(splitter(), 'Enter')).toBe(false);

    // on the left of the splitter (at the start, or at the end of a right-to-left line), the arrows work the other way
    mockRect(fieldList(), 0, 300);
    mockRect(splitter(), 300, 8);
    pressKey(splitter(), 'ArrowLeft');
    expect(pivotTable.getFieldListWidth()).toBe(484);
  });

  it('resizes the field list by dragging its splitter', () => {
    createPivotTable();
    const resized = vi.fn();
    pivotTable.onFieldListResized.subscribe((_e, args) => resized(args.width));
    mockRect(splitter(), 692, 8);
    mockRect(fieldList(), 700, 300);

    // only the main button drags, and only the pointer that started the drag moves the splitter
    pointer('pointerdown', 696, { button: 2 });
    pointer('pointermove', 600);
    expect(pivotTable.getFieldListWidth()).toBe(300);

    pointer('pointerdown', 696);
    expect(root().classList.contains('slick-pivot-table-resizing')).toBe(true);
    pointer('pointermove', 600, { pointerId: 2 } as any);
    expect(pivotTable.getFieldListWidth()).toBe(300);
    pointer('pointermove', 596);
    // the pointer stays over the middle of the splitter: 1000 - 596 - 4
    expect(pivotTable.getFieldListWidth()).toBe(400);
    expect(resized).not.toHaveBeenCalled();
    pointer('pointerup', 596);
    expect(root().classList.contains('slick-pivot-table-resizing')).toBe(false);
    expect(resized).toHaveBeenCalledWith(400);
    pointer('pointerup', 596);
    expect(resized).toHaveBeenCalledTimes(1);

    // a field list on the left grows to the right
    mockRect(fieldList(), 0, 400);
    mockRect(splitter(), 400, 8);
    pointer('pointerdown', 404);
    pointer('pointermove', 354);
    pointer('pointercancel', 354);
    expect(pivotTable.getFieldListWidth()).toBe(350);
  });

  it('cannot be resized when resizable is false', () => {
    createPivotTable({ fieldList: { resizable: false } });
    expect(splitter().hidden).toBe(true);
    pointer('pointerdown', 696);
    expect(root().classList.contains('slick-pivot-table-resizing')).toBe(false);
  });

  it('shows the counts of the pivot in its status bar, or what its formatter returns', async () => {
    createPivotTable();
    expect(status().textContent).toMatch(/^4 of 4 source rows · \d+ rows × \d+ columns · computed in \d+ ms$/);
    await pivotTable.getPivot().setSpec({ ...baseSpec, filters: [{ field: 'region', include: ['West'] }] });
    expect(status().textContent).toContain('1 of 4 source rows');

    created.splice(0).forEach((instance) => instance.destroy());
    const formatter = vi.fn((info: { result: PivotResult; rowCount: number; columnCount: number; }) => `${info.result.filteredRowCount} rows, ${info.rowCount} lines`);
    createPivotTable({ statusBar: { formatter } });
    expect(status().textContent).toBe(`4 rows, ${pivotTable.getGrid().getDataLength()} lines`);
    expect(formatter).toHaveBeenCalledWith(expect.objectContaining({ columnCount: pivotTable.getGrid().getColumns().length, locale: 'en-US' }));
  });

  it('formats the counts without the parts a result leaves out', () => {
    const result = { sourceRowCount: 12345, filteredRowCount: 1234, duration: 7.6 } as PivotResult;
    expect(SlickPivotTable.formatStatus({ result, rowCount: 1000, columnCount: 3, locale: 'en-US' })).toBe('1,234 of 12,345 source rows · 1,000 rows × 3 columns · computed in 8 ms');
    expect(SlickPivotTable.formatStatus({ result: {} as PivotResult, rowCount: 2, columnCount: 3 })).toBe('2 rows × 3 columns');
  });

  it('tells in its status bar that an asynchronous provider is computing', async () => {
    let finish!: () => void;
    const engine = new PivotEngine({ fields });
    const provider = {
      execute: vi.fn((request: any) => new Promise<PivotResult>((resolve) => {
        finish = () => resolve(engine.execute(createRows(), request.spec));
      })),
    };
    createPivotTable({ provider, statusBar: { loadingText: 'Wait…' } });
    await vi.waitFor(() => expect(status().textContent).toBe('Wait…'));
    expect(status().classList.contains('slick-pivot-table-status-loading')).toBe(true);
    finish();
    await vi.waitFor(() => expect(status().textContent).toContain('4 of 4 source rows'));
    expect(status().classList.contains('slick-pivot-table-status-loading')).toBe(false);
  });

  it('mirrors the whole pivot table in a right-to-left grid', () => {
    createPivotTable({ gridOptions: { rtl: true } });
    expect(root().dir).toBe('rtl');
    expect(pivotTable.getGrid().getOptions().rtl).toBe(true);
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

    createPivotTable();
    expect(observe).toHaveBeenCalledWith(part('slick-pivot-table-grid'));
    const resizeCanvas = vi.spyOn(pivotTable.getGrid(), 'resizeCanvas');
    // several changes in a frame resize the grid once
    notify();
    notify();
    expect(frames).toHaveLength(1);
    frames[0](0);
    expect(resizeCanvas).toHaveBeenCalledTimes(1);
    pivotTable.resizeCanvas();
    expect(resizeCanvas).toHaveBeenCalledTimes(2);

    notify();
    pivotTable.destroy();
    created.splice(0);
    expect(cancelFrame).toHaveBeenCalledWith(2);
    expect(disconnect).toHaveBeenCalled();
  });

  it('destroys the grid, the pivot and every part, and removes its element', () => {
    createPivotTable();
    const element = root();
    const destroyed = [
      vi.spyOn(pivotTable.getGrid(), 'destroy'),
      vi.spyOn(pivotTable.getPivot(), 'destroy'),
      vi.spyOn(pivotTable.getFieldList()!, 'destroy'),
      vi.spyOn(pivotTable.getToolbar()!, 'destroy'),
      vi.spyOn(pivotTable.getDetails()!, 'destroy'),
    ];
    pivotTable.destroy();
    created.splice(0);
    expect(destroyed.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1, 1, 1]);
    expect(element.isConnected).toBe(false);
    expect(container.children).toHaveLength(0);
  });
});
