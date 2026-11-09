import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PivotField, PivotOption, PivotSpec } from '../../models';
import { SlickPivot } from '../../plugins/slick.pivot';
import { SlickPivotToolbar } from '../slick.pivottoolbar';
import type { PivotToolbarOption } from '../slick.pivottoolbar';

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

describe('SlickPivotToolbar', () => {
  const created: Array<{ destroy: () => void; }> = [];
  let container: HTMLDivElement;
  let pivot: SlickPivot;
  let toolbar: SlickPivotToolbar;

  /** Create a pivot (it needs no grid) and its toolbar */
  const createToolbar = (options?: Partial<PivotToolbarOption>, pivotOptions: Partial<PivotOption> = {}) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    pivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec, locale: 'en-US', ...pivotOptions });
    toolbar = new SlickPivotToolbar(pivot, container, options);
    created.push(toolbar, pivot);
    return toolbar;
  };

  const item = <T extends HTMLElement = HTMLElement>(id: string) => container.querySelector<T>(`[data-item="${id}"]`)!;
  const select = (id: string) => item(id).querySelector<HTMLSelectElement>('select')!;
  const choose = (id: string, value: string) => {
    select(id).value = value;
    select(id).dispatchEvent(new Event('change', { bubbles: true }));
  };
  const button = (id: string) => item<HTMLButtonElement>(id);

  afterEach(() => {
    created.splice(0).forEach((instance) => instance.destroy());
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('throws when its container cannot be found', () => {
    pivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec });
    created.push(pivot);
    expect(() => new SlickPivotToolbar(pivot, '#nowhere')).toThrow('[SlickPivotToolbar] the toolbar container was not found.');
  });

  it('renders the default items, in order, in a labelled group', () => {
    createToolbar();
    const element = toolbar.getElement();
    expect(element.parentElement).toBe(container);
    expect(element.getAttribute('role')).toBe('group');
    expect(element.getAttribute('aria-label')).toBe('PivotTable options');
    expect(Array.from(element.querySelectorAll<HTMLElement>('[data-item]')).map((elm) => elm.dataset.item)).toEqual(['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo']);
    expect(item('layout').querySelector('.slick-pivot-toolbar-label')!.textContent).toBe('Report Layout');
    expect(Array.from(select('layout').options).map((option) => [option.value, option.textContent])).toEqual([['compact', 'Compact'], ['outline', 'Outline'], ['tabular', 'Tabular']]);
    expect(Array.from(select('grandTotals').options).map((option) => option.textContent)).toEqual(['Row and Column', 'Row Only', 'Column Only', 'Off']);
    expect(button('undo').title).toBe('Undo (Ctrl+Z)');
    expect(button('redo').getAttribute('aria-keyshortcuts')).toBe('Control+Y');
    expect(toolbar.getOptions().items).toHaveLength(7);
  });

  it('replaces the default items and captions with the given ones, accepting a selector', () => {
    container = document.createElement('div');
    container.id = 'pivotToolbar';
    document.body.appendChild(container);
    pivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec });
    toolbar = new SlickPivotToolbar(pivot, '#pivotToolbar', { items: ['grandTotals', 'fieldList'], labels: { grandTotals: 'Totaux', fieldList: 'Champs' } as any });
    created.push(toolbar, pivot);
    expect(Array.from(container.querySelectorAll<HTMLElement>('[data-item]')).map((elm) => elm.dataset.item)).toEqual(['grandTotals', 'fieldList']);
    expect(item('grandTotals').textContent).toContain('Totaux');
    expect(button('fieldList').textContent).toBe('Champs');
    // the captions that were not given keep their defaults
    expect(toolbar.getOptions().labels.layout).toBe('Report Layout');
  });

  it('shows the layout, subtotals and grand totals of the spec, and follows it however it changes', async () => {
    createToolbar();
    expect([select('layout').value, select('subtotals').value, select('grandTotals').value]).toEqual(['compact', 'top', 'both']);
    await pivot.updateSpec({ layout: 'tabular', subtotals: 'none', grandTotals: { rows: false, columns: true } });
    expect([select('layout').value, select('subtotals').value, select('grandTotals').value]).toEqual(['tabular', 'none', 'columns']);
  });

  it('changes the layout and the subtotals of the spec', () => {
    createToolbar();
    choose('layout', 'outline');
    expect(pivot.getSpec().layout).toBe('outline');
    choose('subtotals', 'bottom');
    expect(pivot.getSpec().subtotals).toBe('bottom');
  });

  it('turns the grand totals on and off, keeping the position of the ones that stay shown', () => {
    createToolbar(undefined, { spec: { ...baseSpec, grandTotals: { rows: 'top', columns: 'start', label: 'Total' } } });
    choose('grandTotals', 'columns');
    expect(pivot.getSpec().grandTotals).toEqual(expect.objectContaining({ rows: false, columns: 'start', label: 'Total' }));
    choose('grandTotals', 'none');
    expect(pivot.getSpec().grandTotals).toEqual(expect.objectContaining({ rows: false, columns: false }));
    choose('grandTotals', 'rows');
    expect(pivot.getSpec().grandTotals).toEqual(expect.objectContaining({ rows: true, columns: false }));
    choose('grandTotals', 'both');
    expect(pivot.getSpec().grandTotals).toEqual(expect.objectContaining({ rows: true, columns: true }));
  });

  it('maps grand totals to the choices of the dropdown', () => {
    expect(SlickPivotToolbar.getGrandTotalsChoice({})).toBe('both');
    expect(SlickPivotToolbar.getGrandTotalsChoice({ rows: 'bottom', columns: false })).toBe('rows');
    expect(SlickPivotToolbar.getGrandTotalsChoice({ rows: false, columns: 'end' })).toBe('columns');
    expect(SlickPivotToolbar.getGrandTotalsChoice({ rows: false, columns: false })).toBe('none');
  });

  it('expands and collapses every row and column group', () => {
    createToolbar();
    const spies = (['expandAllRows', 'expandAllColumns', 'collapseAllRows', 'collapseAllColumns'] as const).map((method) => vi.spyOn(pivot, method));
    button('collapseAll').click();
    expect(spies.map((spy) => spy.mock.calls.length)).toEqual([0, 0, 1, 1]);
    expect(pivot.isRowCollapsed('["East"]')).toBe(true);
    button('expandAll').click();
    expect(spies.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1, 1]);
    expect(pivot.isRowCollapsed('["East"]')).toBe(false);
  });

  it('shows Undo and Redo while write-back is on, enabled when there is something to undo or redo', async () => {
    createToolbar();
    expect([button('undo').hidden, button('redo').hidden]).toEqual([true, true]);
    await pivot.setOptions({ enableWriteBack: true });
    expect([button('undo').hidden, button('undo').disabled, button('redo').disabled]).toEqual([false, true, true]);

    await pivot.setCellValue({ rowKey: '["East","China"]', columnKey: '[]', valueId: 'sum:units' }, 80);
    expect([button('undo').disabled, button('redo').disabled]).toEqual([false, true]);

    const undo = vi.spyOn(pivot, 'undo');
    button('undo').click();
    expect(undo).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(button('redo').disabled).toBe(false));
    expect(button('undo').disabled).toBe(true);

    const redo = vi.spyOn(pivot, 'redo');
    button('redo').click();
    expect(redo).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(button('undo').disabled).toBe(false));

    await pivot.setOptions({ enableWriteBack: false });
    expect(button('undo').hidden).toBe(true);
  });

  it('raises onFieldListToggle from its Field List button, which shows whether the field list is visible', () => {
    createToolbar({ items: ['fieldList'] });
    const toggled = vi.fn();
    toolbar.onFieldListToggle.subscribe((_e, args) => toggled(args.visible));
    expect(button('fieldList').getAttribute('aria-pressed')).toBe('true');

    button('fieldList').click();
    expect(toggled).toHaveBeenLastCalledWith(false);
    // the application decides: the button only changes when told
    expect(button('fieldList').getAttribute('aria-pressed')).toBe('true');
    toolbar.setFieldListVisible(false);
    expect(button('fieldList').getAttribute('aria-pressed')).toBe('false');
    button('fieldList').click();
    expect(toggled).toHaveBeenLastCalledWith(true);
  });

  it('stops following the pivot and removes its element when destroyed', async () => {
    createToolbar();
    const element = toolbar.getElement();
    const render = vi.spyOn(toolbar, 'render');
    toolbar.destroy();
    expect(element.isConnected).toBe(false);
    await pivot.updateSpec({ layout: 'outline' });
    expect(render).not.toHaveBeenCalled();
  });
});
