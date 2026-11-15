import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Column, PivotOption, PivotSpec } from '../../models';
import { SlickGrid } from '../../slick.grid';
import { SlickPivot } from '../slick.pivot';
import { SlickPivotDesigner } from '../slick.pivotdesigner';
import type { PivotDesignerOption } from '../slick.pivotdesigner';

const createRows = () => [
  { id: 1, region: 'East', country: 'China', orderDate: new Date(2023, 1, 5), amount: 100, units: 10 },
  { id: 2, region: 'East', country: 'China', orderDate: new Date(2024, 6, 15), amount: 300, units: 30 },
  { id: 3, region: 'East', country: 'Japan', orderDate: new Date(2023, 10, 1), amount: 50, units: 5 },
  { id: 4, region: 'West', country: 'France', orderDate: new Date(2024, 2, 20), amount: 200, units: 20 },
  { id: 5, region: 'West', country: 'Spain', orderDate: new Date(2023, 4, 9), amount: 80, units: 8 },
];

const columns: Column[] = [
  { id: 'region', name: 'Region', field: 'region' },
  { id: 'country', name: 'Country', field: 'country' },
  { id: 'orderDate', name: 'Order Date', field: 'orderDate' },
  { id: 'amount', name: 'Amount', field: 'amount' },
  { id: 'units', name: 'Units', field: 'units' },
];

/** An MS Access crosstab: a Row Heading, a Column Heading, a Value and a row total */
const crosstabSpec: Partial<PivotSpec> = {
  rows: ['region'],
  columns: ['orderDate.year'],
  values: [{ field: 'amount', aggregator: 'sum' }, { id: 'rowTotal', field: 'amount', aggregator: 'sum', totalsOnly: true, label: 'Total Of Amount' }],
};

describe('SlickPivotDesigner', () => {
  let grids: SlickGrid[] = [];
  let container: HTMLDivElement;
  let grid: SlickGrid;
  let pivot: SlickPivot;
  let designer: SlickPivotDesigner;
  let element: HTMLElement;

  /** The application's grid, the pivot and the designer registered with it */
  const createDesigner = (options: Partial<PivotDesignerOption> = {}, spec: Partial<PivotSpec> = crosstabSpec, pivotOptions: Partial<PivotOption> = {}) => {
    container = document.createElement('div');
    container.id = 'designer';
    const gridElm = document.createElement('div');
    document.body.append(container, gridElm);
    grid = new SlickGrid(gridElm, createRows(), columns.map((column) => ({ ...column })), SlickPivot.getGridOptions({ enableCellNavigation: true }));
    grids.push(grid);
    pivot = new SlickPivot({ spec, locale: 'en-US', ...pivotOptions });
    grid.registerPlugin(pivot);
    designer = new SlickPivotDesigner({ container, ...options });
    grid.registerPlugin(designer);
    element = container.querySelector<HTMLElement>('.slick-pivot-designer')!;
    return designer;
  };

  const table = () => element.querySelector<HTMLTableElement>('.slick-pivot-designer-grid')!;
  const control = <T extends HTMLElement = HTMLSelectElement>(prop: string, index: number | 'new') => table().querySelector<T>(`[data-prop="${prop}"][data-index="${index}"]`)!;
  const choose = (prop: string, index: number | 'new', value: string) => {
    const target = control<HTMLSelectElement | HTMLInputElement>(prop, index);
    target.value = value;
    target.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const options = (prop: string, index: number | 'new') => Array.from(control(prop, index).options).map((option) => option.textContent);
  const design = () => designer.getColumns().map((column) => [column.field, column.total, column.crosstab, column.sort ?? '', column.criteria ?? '']);
  const headerLabels = () => Array.from(table().querySelectorAll('.slick-pivot-designer-column-label')).map((label) => label.textContent);
  const fieldItems = () => Array.from(element.querySelectorAll<HTMLElement>('.slick-pivot-designer-field')).map((item) => item.dataset.field);
  const fieldItem = (id: string) => element.querySelector<HTMLElement>(`.slick-pivot-designer-field[data-field="${id}"]`)!;
  const actionButton = (action: string, index: number) => table().querySelector<HTMLButtonElement>(`button[data-action="${action}"][data-index="${index}"]`)!;
  const pressKey = (target: HTMLElement, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event.defaultPrevented;
  };
  const dragEvent = (type: string, target: HTMLElement, data?: string) => {
    const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
    const store: Record<string, string> = data ? { 'text/plain': data } : {};
    Object.defineProperty(event, 'dataTransfer', { value: { setData: (format: string, value: string) => (store[format] = value), getData: (format: string) => store[format] ?? '', effectAllowed: '', dropEffect: '' } });
    target.dispatchEvent(event);
    return event;
  };

  afterEach(() => {
    grids.forEach((item) => item.destroy());
    grids = [];
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('needs a pivot plugin and a container', () => {
    const gridElm = document.createElement('div');
    document.body.appendChild(gridElm);
    grid = new SlickGrid(gridElm, createRows(), columns, SlickPivot.getGridOptions());
    grids.push(grid);
    expect(() => grid.registerPlugin(new SlickPivotDesigner({ container: document.body }))).toThrow('[SlickPivotDesigner] no pivot plugin, register the SlickPivot plugin with the grid first');
    grid.registerPlugin(new SlickPivot({ spec: crosstabSpec }));
    expect(() => grid.registerPlugin(new SlickPivotDesigner({ container: '#nowhere' }))).toThrow('[SlickPivotDesigner] the designer container was not found.');
  });

  it('shows the design grid of the spec: Row Headings, Column Headings, Values, row totals and Where columns', () => {
    createDesigner({}, { ...crosstabSpec, filters: [{ field: 'country', criteria: 'Not "Spain"' }, { field: 'region', exclude: ['North'] }], sort: [{ field: 'region', direction: 'desc' }] });
    expect(designer.pluginName).toBe('PivotDesigner');
    expect(grid.getPluginByName('PivotDesigner')).toBe(designer);
    expect(designer.getPivot()).toBe(pivot);
    expect(designer.getElement()).toBe(element);
    expect(element.getAttribute('role')).toBe('region');
    expect(element.getAttribute('aria-label')).toBe('Crosstab Designer');
    expect(element.querySelector('.slick-pivot-designer-title')!.textContent).toBe('Crosstab Designer');

    expect(design()).toEqual([
      ['region', 'groupBy', 'row', 'desc', '<> "North"'],
      ['orderDate.year', 'groupBy', 'column', '', ''],
      ['amount', 'sum', 'value', '', ''],
      ['amount', 'sum', 'row', '', ''],
      ['country', 'where', 'none', '', 'Not "Spain"'],
    ]);
    expect(headerLabels()).toEqual(['Region', 'Years (Order Date)', 'Amount', 'Amount', 'Country']);
    expect(Array.from(table().querySelectorAll('tbody th')).map((th) => th.textContent)).toEqual(['Field:', 'Total:', 'Crosstab:', 'Sort:', 'Criteria:']);
    // a Row Heading with an aggregate is a row total
    expect(table().querySelectorAll('.slick-pivot-designer-column-header')[3].querySelector('.slick-pivot-designer-tag')!.textContent).toBe('Row total');
    expect(control('total', 0).getAttribute('aria-label')).toBe('Total of Region');
    expect(control<HTMLInputElement>('criteria', 0).value).toBe('<> "North"');
    expect(options('total', 0)).toEqual(['Group By', 'Min', 'Max', 'Count', 'First', 'Last', 'Count Numbers', 'Distinct Count', 'Where']);
    expect(options('total', 2).slice(0, 10)).toEqual(['Group By', 'Sum', 'Avg', 'Min', 'Max', 'Count', 'StDev', 'Var', 'First', 'Last']);
    expect(options('crosstab', 0)).toEqual(['Row Heading', 'Column Heading', 'Value', '(not shown)']);
    expect(options('sort', 0)).toEqual(['(not sorted)', 'Ascending', 'Descending']);
    // the Where columns are not shown, the aggregates are neither sorted nor filtered
    expect(control('crosstab', 4).disabled).toBe(true);
    expect([control('sort', 2).disabled, control<HTMLInputElement>('criteria', 2).disabled]).toEqual([true, true]);
    expect(options('field', 'new')[0]).toBe('(add a field)');

    // a date field is followed by the levels of its hierarchy, the other fields are not
    expect(fieldItems()).toEqual(['region', 'country', 'orderDate', 'orderDate.year', 'orderDate.quarter', 'orderDate.month', 'orderDate.day', 'amount', 'units']);
    expect(fieldItem('orderDate.year').classList.contains('slick-pivot-designer-field-level')).toBe(true);
    expect(fieldItem('region').classList.contains('slick-pivot-designer-field-used')).toBe(true);
    expect(fieldItem('units').classList.contains('slick-pivot-designer-field-used')).toBe(false);
  });

  it('gives the result the look of an MS Access crosstab when registered, unless resultLayout is false', () => {
    createDesigner();
    const spec = pivot.getSpec();
    expect([spec.layout, spec.subtotals, spec.columnSubtotals, spec.repeatItemLabels]).toEqual(['tabular', 'none', false, true]);
    expect(spec.grandTotals).toEqual(expect.objectContaining({ rows: false, columns: 'start', values: ['rowTotal'] }));
    expect(grid.getColumns().map((column) => column.name)).toEqual(['Region', 'Total Of Amount', '2023', '2024']);

    grids.forEach((item) => item.destroy());
    grids = [];
    document.body.innerHTML = '';
    createDesigner({ resultLayout: false }, { rows: ['region'], columns: ['orderDate.year'], values: [{ field: 'amount', aggregator: 'sum' }] });
    expect(pivot.getSpec().layout).toBe('compact');
    expect(pivot.getSpec().grandTotals).toEqual({ rows: true, columns: true });
  });

  it('adds a column for a field from the new column, the field list or the API, with a Total and a Crosstab role that suit it', async () => {
    createDesigner({}, { rows: [], columns: [], values: [] });
    expect(design()).toEqual([]);
    control('field', 'new').focus();
    choose('field', 'new', 'region');
    expect(design()).toEqual([['region', 'groupBy', 'row', '', '']]);
    expect(pivot.getSpec().rows).toEqual(['region']);
    // the focus stays on the new column, to add the next field
    expect(document.activeElement).toBe(control('field', 'new'));

    fieldItem('amount').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(design()[1]).toEqual(['amount', 'sum', 'value', '', '']);
    expect(pivot.getSpec().values).toEqual([expect.objectContaining({ field: 'amount', aggregator: 'sum' })]);

    // a level of a date hierarchy is grouped, its numbers being items
    await designer.addColumn('orderDate.year', 1);
    expect(design()[1]).toEqual(['orderDate.year', 'groupBy', 'row', '', '']);
    expect(pivot.getSpec().rows).toEqual(['region', 'orderDate.year']);
    choose('field', 'new', '');
    expect(designer.getColumns()).toHaveLength(3);
  });

  it('moves through the field list with the keyboard, adding the active field with Enter or Space', async () => {
    createDesigner({}, { rows: [], columns: [], values: [] });
    fieldItem('region').click();
    expect(fieldItem('region').getAttribute('aria-selected')).toBe('true');
    expect(pressKey(fieldItem('region'), 'ArrowDown')).toBe(true);
    expect(document.activeElement).toBe(fieldItem('country'));
    pressKey(fieldItem('country'), 'End');
    expect(document.activeElement).toBe(fieldItem('units'));
    pressKey(fieldItem('units'), 'ArrowUp');
    pressKey(fieldItem('amount'), 'Home');
    expect([fieldItem('region').tabIndex, fieldItem('amount').tabIndex]).toEqual([0, -1]);
    expect(pressKey(fieldItem('region'), 'Enter')).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(fieldItem('region')));
    pressKey(fieldItem('region'), 'ArrowDown');
    pressKey(fieldItem('country'), ' ');
    expect(design().map((column) => column[0])).toEqual(['region', 'country']);
    expect(pressKey(fieldItem('country'), 'a')).toBe(false);
  });

  it('keeps every column valid, like MS Access, when its Total or its Crosstab role changes', () => {
    createDesigner({}, { rows: ['region', 'country'], columns: ['orderDate.year'], values: [{ field: 'amount', aggregator: 'sum' }] });
    // a Where column filters without being shown
    choose('total', 1, 'where');
    expect(design()[1]).toEqual(['country', 'where', 'none', '', '']);
    expect(pivot.getSpec().rows).toEqual(['region']);
    choose('total', 1, 'groupBy');
    expect(design()[1]).toEqual(['country', 'groupBy', 'row', '', '']);

    // a Column Heading groups its items, a Value aggregates them
    choose('crosstab', 3, 'column');
    expect(design()[3]).toEqual(['amount', 'groupBy', 'column', '', '']);
    choose('crosstab', 3, 'value');
    expect(design()[3]).toEqual(['amount', 'sum', 'value', '', '']);
    choose('total', 3, 'avg');
    expect(pivot.getSpec().values).toEqual([expect.objectContaining({ field: 'amount', aggregator: 'avg' })]);
    choose('total', 2, 'count');
    expect(design()[2]).toEqual(['orderDate.year', 'count', 'value', '', '']);
    choose('crosstab', 2, 'column');
    expect(design()[2]).toEqual(['orderDate.year', 'groupBy', 'column', '', '']);

    // a field changed to one of another type keeps an aggregate that suits it
    choose('field', 3, 'country');
    expect(design()[3]).toEqual(['country', 'count', 'value', '', '']);
    choose('crosstab', 3, 'none');
    expect(pivot.getSpec().values).toEqual([]);
    choose('total', 3, 'where');
    choose('crosstab', 3, 'row');
    expect(design()[3]).toEqual(['country', 'groupBy', 'row', '', '']);
  });

  it('makes a row total of a Row Heading with an aggregate, shown after the Row Headings', () => {
    createDesigner({}, { rows: ['region'], columns: ['orderDate.year'], values: [{ field: 'amount', aggregator: 'sum' }] });
    expect(pivot.getSpec().grandTotals!.columns).toBe(false);
    choose('field', 'new', 'units');
    choose('crosstab', 3, 'row');
    const spec = pivot.getSpec();
    expect(spec.values[1]).toEqual({ id: 'sum:units', field: 'units', aggregator: 'sum', totalsOnly: true, label: 'Total Of Units' });
    expect(spec.grandTotals).toEqual(expect.objectContaining({ columns: 'start', values: ['sum:units'] }));
    expect(grid.getColumns().map((column) => column.name)).toEqual(['Region', 'Total Of Units', '2023', '2024']);
    // back to a Value: no row total, no grand total column
    choose('crosstab', 3, 'value');
    expect(pivot.getSpec().values[1].totalsOnly).toBeUndefined();
    expect(pivot.getSpec().grandTotals!.columns).toBe(false);
  });

  it('filters the source rows with the criteria of the Group By and Where columns, telling when a criteria is not valid', () => {
    createDesigner();
    const status = () => element.querySelector('.slick-pivot-designer-status')!.textContent;
    choose('criteria', 0, '"East" Or "West"');
    expect(pivot.getSpec().filters).toEqual([{ field: 'region', criteria: '"East" Or "West"' }]);
    choose('field', 'new', 'country');
    choose('total', 4, 'where');
    choose('criteria', 4, 'Like "[cj]*"');
    expect(pivot.getSpec().filters).toEqual([{ field: 'region', criteria: '"East" Or "West"' }, { field: 'country', criteria: 'Like "[cj]*"' }]);
    expect(pivot.getResult()!.filteredRowCount).toBe(3);

    // an invalid criteria is marked and not applied
    const input = control<HTMLInputElement>('criteria', 4);
    input.value = 'Between 1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.getAttribute('aria-invalid')).toBe('');
    expect(input.title).toBe('invalid criteria: And is expected at the end');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(status()).toBe('Country: invalid criteria: And is expected at the end');
    expect(pivot.getSpec().filters).toHaveLength(2);
    input.value = 'Japan';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(status()).toBe('');
    expect(pivot.getSpec().filters![1]).toEqual({ field: 'country', criteria: 'Japan' });
    choose('criteria', 4, '');
    expect(pivot.getSpec().filters).toEqual([{ field: 'region', criteria: '"East" Or "West"' }]);
  });

  it('sorts the Row and Column Headings', () => {
    createDesigner();
    choose('sort', 0, 'desc');
    expect(pivot.getSpec().sort).toEqual([{ field: 'region', direction: 'desc' }]);
    choose('sort', 1, 'asc');
    expect(pivot.getSpec().sort).toEqual([{ field: 'region', direction: 'desc' }, { field: 'orderDate.year', direction: 'asc' }]);
    choose('sort', 0, '');
    expect(pivot.getSpec().sort).toEqual([{ field: 'orderDate.year', direction: 'asc' }]);
  });

  it('moves and removes columns with the buttons of their header, the focus following the column', () => {
    createDesigner();
    expect([actionButton('move-left', 0).disabled, actionButton('move-right', 3).disabled]).toEqual([true, true]);
    expect(actionButton('remove', 0).getAttribute('aria-label')).toBe('Remove Region');
    actionButton('move-right', 0).click();
    expect(design().map((column) => column[0])).toEqual(['orderDate.year', 'region', 'amount', 'amount']);
    expect(document.activeElement).toBe(actionButton('move-right', 1));
    actionButton('move-left', 1).click();
    expect(design().map((column) => column[0])).toEqual(['region', 'orderDate.year', 'amount', 'amount']);
    // at the edge, the focus goes to the other move button
    expect(document.activeElement).toBe(actionButton('move-right', 0));

    actionButton('remove', 3).click();
    expect(pivot.getSpec().values).toHaveLength(1);
    expect(document.activeElement).toBe(actionButton('remove', 2));
    [2, 1, 0].forEach((index) => actionButton('remove', index).click());
    expect(designer.getColumns()).toEqual([]);
    expect(document.activeElement).toBe(control('field', 'new'));
    designer.moveColumn(0, 1);
  });

  it('adds a field dragged from the field list before the column it is dropped on', () => {
    createDesigner();
    const target = control('total', 1).closest('td')!;
    dragEvent('dragstart', fieldItem('units'));
    expect(dragEvent('dragover', target).defaultPrevented).toBe(true);
    expect(target.classList.contains('slick-pivot-designer-drop-target')).toBe(true);
    dragEvent('dragleave', target);
    expect(target.classList.contains('slick-pivot-designer-drop-target')).toBe(false);
    dragEvent('drop', target);
    expect(design().map((column) => column[0])).toEqual(['region', 'units', 'orderDate.year', 'amount', 'amount']);

    // on the new column, at the end; a drag that is not a field is ignored
    const newCell = control('field', 'new').closest('td')!;
    dragEvent('dragstart', fieldItem('country'));
    dragEvent('drop', newCell);
    expect(design().map((column) => column[0])).toEqual(['region', 'units', 'orderDate.year', 'amount', 'amount', 'country']);
    dragEvent('dragend', fieldItem('country'));
    expect(dragEvent('dragover', newCell).defaultPrevented).toBe(false);
    dragEvent('drop', newCell, 'nothing');
    expect(designer.getColumns()).toHaveLength(6);
  });

  it('follows the spec changed elsewhere, and keeps its own columns while they give the spec', async () => {
    createDesigner();
    actionButton('move-right', 0).click();
    expect(design().map((column) => column[0])).toEqual(['orderDate.year', 'region', 'amount', 'amount']);
    // a change the design columns do not show (the layout) keeps their order
    await pivot.updateSpec({ layout: 'outline' });
    expect(design().map((column) => column[0])).toEqual(['orderDate.year', 'region', 'amount', 'amount']);
    await pivot.setSpec({ rows: ['country'], columns: [], values: [{ field: 'units', aggregator: 'max' }] });
    expect(design()).toEqual([['country', 'groupBy', 'row', '', ''], ['units', 'max', 'value', '', '']]);
  });

  it('writes the item filters of the spec as criteria, keeping them as they are until the criteria are changed', () => {
    const predicate = () => true;
    createDesigner({}, {
      ...crosstabSpec,
      filters: [
        { field: 'region', include: ['East', null] },
        { field: 'country', label: { operator: 'contains', value: 'a*' } },
        { field: 'units', predicate },
      ],
      sort: [{ field: 'region', by: { valueId: 'sum:amount' } }],
    });
    expect(design().map((column) => column[4])).toEqual(['"East" Or Is Null', '', '', '', 'Like "*a[*]*"']);
    // changing another column keeps the item filter, the predicate and the sort by value
    choose('sort', 1, 'desc');
    const spec = pivot.getSpec();
    expect(spec.filters).toEqual([{ field: 'region', include: ['East', null] }, { field: 'country', label: { operator: 'contains', value: 'a*' } }, { field: 'units', predicate }]);
    expect(spec.sort).toEqual([{ field: 'orderDate.year', direction: 'desc' }, { field: 'region', by: { valueId: 'sum:amount' } }]);
    choose('criteria', 0, '"West"');
    expect(pivot.getSpec().filters![0]).toEqual({ field: 'region', criteria: '"West"' });
  });

  it('writes any spec filter as MS Access criteria', () => {
    const criteria = SlickPivotDesigner.getFilterCriteria;
    expect(criteria({ field: 'a', criteria: ' > 1 ' })).toBe('> 1');
    expect(criteria({ field: 'a', include: [1, 2] })).toBe('In (1, 2)');
    expect(criteria({ field: 'a', include: [] })).toBe('False');
    expect(criteria({ field: 'a', include: [true, new Date(Date.UTC(2024, 0, 31))] })).toBe('In (True, #2024-01-31#)');
    expect(criteria({ field: 'a', exclude: ['x'] })).toBe('<> "x"');
    expect(criteria({ field: 'a', exclude: ['say "hi"', 'b', ''] })).toBe('Not In ("say ""hi""", "b") And Is Not Null');
    expect(criteria({ field: 'a', exclude: [null] })).toBe('Is Not Null');
    expect(criteria({ field: 'a', label: { operator: 'equals', value: 'x' } })).toBe('"x"');
    expect(criteria({ field: 'a', label: { operator: 'notEquals', value: 'x' } })).toBe('<> "x"');
    expect(criteria({ field: 'a', label: { operator: 'notContains', value: 'x' } })).toBe('Not Like "*x*"');
    expect(criteria({ field: 'a', label: { operator: 'beginsWith', value: 'x?' } })).toBe('Like "x[?]*"');
    expect(criteria({ field: 'a', label: { operator: 'endsWith', value: 'x' } })).toBe('Like "*x"');
    expect(criteria({ field: 'a', include: [1], criteria: '< 5' })).toBe('(< 5) And (1)');
    expect(criteria({ field: 'a', top: { count: 3, valueId: 'v' } })).toBe('');
  });

  it('turns Pivot Mode off and on from its switch, its body being inert while it is off', async () => {
    createDesigner();
    const checkbox = element.querySelector<HTMLInputElement>('.slick-pivot-mode-checkbox')!;
    expect(checkbox.getAttribute('role')).toBe('switch');
    expect(checkbox.checked).toBe(true);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(pivot.isPivotMode()).toBe(false);
    expect(grid.getColumns().map((column) => column.id)).toEqual(['region', 'country', 'orderDate', 'amount', 'units']);
    expect(element.classList.contains('slick-pivot-designer-off')).toBe(true);
    expect(element.querySelector('.slick-pivot-designer-body')!.hasAttribute('inert')).toBe(true);
    await pivot.setPivotMode(true);
    expect(checkbox.checked).toBe(true);
    expect(element.querySelector('.slick-pivot-designer-body')!.hasAttribute('inert')).toBe(false);
  });

  it('takes its captions and its aggregators from its options, and can leave out the switch and the field list', () => {
    createDesigner({
      showPivotModeToggle: false,
      showFieldList: false,
      totals: ['sum', 'max', 'unknown'],
      labels: { title: 'Kreuztabelle', groupBy: 'Gruppierung', totals: { sum: 'Summe' }, rowTotalValue: (label) => `Gesamt ${label}` },
    });
    expect(element.querySelector('.slick-pivot-designer-title')!.textContent).toBe('Kreuztabelle');
    expect(element.querySelector('.slick-pivot-mode')).toBeNull();
    expect(element.querySelector('.slick-pivot-designer-fields')).toBeNull();
    expect(options('total', 2)).toEqual(['Gruppierung', 'Summe', 'Max', 'Where']);
    // an aggregator of the spec that is not offered is still listed for its column
    designer.setColumns([{ field: 'amount', total: 'median', crosstab: 'value' }, { field: 'units', total: 'sum', crosstab: 'row' }]);
    expect(options('total', 0)).toEqual(['Gruppierung', 'Summe', 'Max', 'Median', 'Where']);
    expect(pivot.getSpec().values[1].label).toBe('Gesamt Units');
  });

  it('raises onDesignChanged with the columns and the spec, and ignores a column it does not have', async () => {
    createDesigner();
    const changed = vi.fn();
    designer.onDesignChanged.subscribe((_e, args) => changed(args.columns.length, args.spec.rows));
    await designer.removeColumn(1);
    expect(changed).toHaveBeenCalledWith(3, ['region']);
    await designer.updateColumn(9, { total: 'sum' });
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('removes its element when unregistered, leaving the grid and the pivot plugin as they are', () => {
    createDesigner();
    grid.unregisterPlugin(designer);
    expect(container.children).toHaveLength(0);
    expect(grid.getPluginByName('Pivot')).toBe(pivot);
    expect(grid.getData()).toBe(pivot.rowModel);
    designer.render();
    expect(designer.getElement()).toBeUndefined();
  });
});
