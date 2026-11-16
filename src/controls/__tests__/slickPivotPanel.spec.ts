import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PivotArea, PivotField, PivotOption, PivotSpec } from '../../models';
import { SlickPivot } from '../../plugins/slick.pivot';
import { SlickPivotPanel } from '../slick.pivotpanel';
import type { PivotPanelOption } from '../slick.pivotpanel';

const createRows = () => [
  { id: 1, region: 'East', country: 'China', channel: 'Online', orderDate: new Date(2023, 1, 5), amount: 100, units: 10, active: true },
  { id: 2, region: 'East', country: 'China', channel: 'Retail', orderDate: new Date(2024, 6, 15), amount: 300, units: 30, active: false },
  { id: 3, region: 'East', country: 'Japan', channel: 'Online', orderDate: new Date(2023, 10, 1), amount: 50, units: 5, active: true },
  { id: 4, region: 'West', country: 'France', channel: 'Retail', orderDate: new Date(2024, 2, 20), amount: 200, units: 20, active: true },
  { id: 5, region: 'West', country: 'Spain', channel: 'Online', orderDate: new Date(2023, 4, 9), amount: 80, units: 8, active: false },
];

const fields: PivotField[] = [
  { id: 'region', label: 'Region', group: 'Customer' },
  { id: 'country', label: 'Country', group: 'Customer' },
  { id: 'channel', label: 'Channel', group: 'Customer', allowedAreas: ['filters', 'rows'] },
  { id: 'orderDate', label: 'Order Date', type: 'date', group: 'Order' },
  { id: 'amount', label: 'Amount', type: 'number', group: 'Measures' },
  { id: 'units', label: 'Units', type: 'number', group: 'Measures' },
  { id: 'active', label: 'Active' },
];

/** The layout of the PivotTable Fields example: two row fields, the years across, one value and a field in the Filters area */
const baseSpec: Partial<PivotSpec> = {
  rows: ['region', 'country'],
  columns: ['orderDate.year'],
  values: [{ field: 'amount', aggregator: 'sum' }],
  filters: [{ field: 'channel' }],
};

/** A layout without any date, to drop the date field on */
const noDateSpec: Partial<PivotSpec> = { rows: ['region'], columns: [], values: [{ field: 'amount', aggregator: 'sum' }] };

const DATE_LEVELS = ['orderDate.year', 'orderDate.quarter', 'orderDate.month'];

describe('SlickPivotPanel', () => {
  const created: Array<{ destroy: () => void; }> = [];
  let container: HTMLDivElement;
  let pivot: SlickPivot;
  let panel: SlickPivotPanel;
  let element: HTMLElement;

  /** Create a pivot of the sales rows (it needs no grid) and its PivotTable Fields pane */
  const createPanel = (options?: Partial<PivotPanelOption>, spec: Partial<PivotSpec> = baseSpec, pivotOptions: Partial<PivotOption> = {}) => {
    container = document.createElement('div');
    container.id = 'pivotPanel';
    document.body.appendChild(container);
    pivot = new SlickPivot({ fields, source: createRows(), spec, locale: 'en-US', ...pivotOptions });
    panel = new SlickPivotPanel(pivot, container, options);
    element = container.querySelector<HTMLElement>('.slick-pivot-panel')!;
    created.push(panel, pivot);
    return panel;
  };

  const fieldItem = (id: string) => element.querySelector<HTMLElement>(`.slick-pivot-field[data-field="${id}"]`)!;
  const fieldCheckbox = (id: string) => fieldItem(id).querySelector<HTMLInputElement>('.slick-pivot-field-checkbox')!;
  const listedFields = () => Array.from(element.querySelectorAll<HTMLElement>('.slick-pivot-field')).map((item) => item.dataset.field);
  const checkedFields = () => Array.from(element.querySelectorAll<HTMLInputElement>('.slick-pivot-field-checkbox')).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.closest<HTMLElement>('.slick-pivot-field')!.dataset.field);
  const areaList = (area: PivotArea) => element.querySelector<HTMLElement>(`.slick-pivot-area-list[data-area="${area}"]`)!;
  const areaSection = (area: PivotArea) => element.querySelector<HTMLElement>(`.slick-pivot-area[data-area="${area}"]`)!;
  const pills = (area: PivotArea) => Array.from(areaList(area).querySelectorAll<HTMLElement>('.slick-pivot-pill'));
  const areaFields = (area: PivotArea) => pills(area).map((pill) => pill.dataset.field);
  const pillLabels = (area: PivotArea) => pills(area).map((pill) => pill.querySelector('.slick-pivot-pill-label')!.textContent);
  const pill = (area: PivotArea, field: string) => pills(area).find((item) => item.dataset.field === field)!;
  const search = (text: string) => {
    const input = element.querySelector<HTMLInputElement>('.slick-pivot-search-input')!;
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const menu = () => element.querySelector<HTMLElement>('.slick-pivot-menu');
  const menuItems = () => Array.from(element.querySelectorAll<HTMLButtonElement>('.slick-pivot-menu .slick-pivot-menu-item'));
  const menuItem = (label: string) => menuItems().find((item) => item.textContent === label)!;
  const openPillMenu = (area: PivotArea, field: string) => pill(area, field).querySelector<HTMLElement>('.slick-pivot-pill-menu-button')!.click();
  const pressKey = (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event.defaultPrevented;
  };
  const selectOption = (select: HTMLSelectElement, value: string) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };

  /** Drag an element of the pane with pointer events; `over` is the element found under the pointer */
  const startDrag = (source: HTMLElement, over: Element | null, y = 60) => {
    (document as any).elementFromPoint = vi.fn(() => over);
    source.dispatchEvent(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 10, bubbles: true }));
    // a move below the threshold is not a drag yet
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 12, clientY: 11, bubbles: true, cancelable: true }));
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: y, bubbles: true, cancelable: true }));
  };
  const drop = (y = 60) => document.dispatchEvent(new PointerEvent('pointerup', { clientX: 40, clientY: y, bubbles: true }));
  const dragTo = (source: HTMLElement, over: Element | null, y = 60) => {
    startDrag(source, over, y);
    drop(y);
  };

  afterEach(() => {
    created.splice(0).forEach((item) => item.destroy());
    delete (document as any).elementFromPoint;
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('field list', () => {
    it('lists the fields by group with their type, checks the ones the pivot uses and lists the levels of a date field below it', () => {
      createPanel();

      expect(element.getAttribute('role')).toBe('region');
      expect(element.getAttribute('aria-label')).toBe('PivotTable Fields');
      expect(element.querySelector('.slick-pivot-panel-title')?.textContent).toBe('PivotTable Fields');
      expect(element.querySelector<HTMLInputElement>('.slick-pivot-search-input')?.placeholder).toBe('Search fields');
      expect(listedFields()).toEqual(['region', 'country', 'channel', 'orderDate', 'orderDate.year', 'orderDate.quarter', 'orderDate.month', 'orderDate.day', 'amount', 'units', 'active']);
      expect(Array.from(element.querySelectorAll('.slick-pivot-field-group')).map((group) => group.textContent)).toEqual(['Customer', 'Order', 'Measures']);
      expect(fieldItem('region').querySelector('.slick-pivot-field-name')?.textContent).toBe('Region');

      // the date field is in use while one of its levels is
      expect(checkedFields()).toEqual(['region', 'country', 'channel', 'orderDate', 'orderDate.year', 'amount']);
      expect(fieldItem('region').classList.contains('slick-pivot-field-used')).toBe(true);
      expect(fieldItem('units').classList.contains('slick-pivot-field-used')).toBe(false);

      const typeOf = (id: string) => fieldItem(id).querySelector('.slick-pivot-field-type')?.textContent;
      expect(['region', 'orderDate', 'amount', 'active'].map(typeOf)).toEqual(['abc', 'date', '123', 'y/n']);
      expect(fieldItem('amount').querySelector('.slick-pivot-field-type')?.classList.contains('slick-pivot-field-type-number')).toBe(true);
      expect(fieldItem('region').querySelector('.slick-pivot-field-menu-button')?.getAttribute('aria-label')).toBe('Region options');

      // a level shows its own caption, and its full one to assistive technologies
      const levels = ['orderDate.year', 'orderDate.quarter', 'orderDate.month', 'orderDate.day'].map(fieldItem);
      expect(levels.map((level) => level.querySelector('.slick-pivot-field-name')?.textContent)).toEqual(['Years', 'Quarters', 'Months', 'Days']);
      expect(levels.every((level) => level.classList.contains('slick-pivot-field-level'))).toBe(true);
      expect(levels.every((level) => !level.querySelector('.slick-pivot-field-type'))).toBe(true);
      expect(fieldCheckbox('orderDate.month').getAttribute('aria-label')).toBe('Months (Order Date)');
      expect(fieldItem('orderDate').classList.contains('slick-pivot-field-level')).toBe(false);
      expect(fieldCheckbox('orderDate').hasAttribute('aria-label')).toBe(false);
    });

    it('filters the field list by caption with the search box', () => {
      createPanel();

      search('coun');
      expect(listedFields()).toEqual(['country']);
      search('  AMOUNT ');
      expect(listedFields()).toEqual(['amount']);
      // a date field is listed with the levels that match
      search('quarter');
      expect(listedFields()).toEqual(['orderDate', 'orderDate.quarter']);
      search('order d');
      expect(listedFields()).toEqual(['orderDate', 'orderDate.year', 'orderDate.quarter', 'orderDate.month', 'orderDate.day']);
      // the captions are searched, not the ids
      search('orderDate');
      expect(listedFields()).toEqual([]);
      expect(element.querySelector('.slick-pivot-field-empty')?.textContent).toBe('No matching fields');
      // the search stays while the layout changes
      search('unit');
      fieldCheckbox('units').click();
      expect(listedFields()).toEqual(['units']);
      expect(fieldCheckbox('units').checked).toBe(true);
      search('');
      expect(listedFields()).toHaveLength(11);
      expect(element.querySelector('.slick-pivot-field-empty')).toBeNull();
    });

    it('adds a field to its default area when it is checked and removes it from every area when it is unchecked', () => {
      createPanel(undefined, { ...baseSpec, sort: [{ field: 'country', direction: 'desc' }], filters: [{ field: 'channel' }, { field: 'country', exclude: ['Spain'] }] });
      const changed = vi.fn();
      panel.onPanelChange.subscribe(changed);

      // a number goes to the values, summed
      fieldCheckbox('units').click();
      expect(pivot.getSpec().values).toEqual([expect.objectContaining({ id: 'sum:amount' }), { field: 'units', aggregator: 'sum', id: 'sum:units' }]);
      expect(pillLabels('values')).toEqual(['Sum of Amount', 'Sum of Units']);
      expect(fieldCheckbox('units').checked).toBe(true);
      expect(changed).toHaveBeenCalledTimes(1);
      expect(changed.mock.calls[0][1]).toEqual({ spec: pivot.getSpec(), deferred: false });

      // any other field goes to the rows
      fieldCheckbox('active').click();
      expect(areaFields('rows')).toEqual(['region', 'country', 'active']);

      fieldCheckbox('country').click();
      expect(areaFields('rows')).toEqual(['region', 'active']);
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
      expect(pivot.getSpec().sort).toEqual([]);
      expect(fieldCheckbox('country').checked).toBe(false);

      // unchecking a value field removes every value of it, a date field every level of it
      panel.addField('units', 'values');
      expect(areaFields('values')).toEqual(['amount', 'units', 'units']);
      fieldCheckbox('units').click();
      expect(areaFields('values')).toEqual(['amount']);
      fieldCheckbox('orderDate').click();
      expect(areaFields('columns')).toEqual([]);
      expect(checkedFields()).toEqual(['region', 'channel', 'amount', 'active']);
      // the pivot follows
      expect(pivot.getResult()?.rowTree.children.map((node) => node.label)).toEqual(['East', 'West']);
    });

    it('adds a field to an area from its menu, where the areas it may not go to are disabled', () => {
      createPanel();

      fieldItem('units').querySelector<HTMLElement>('.slick-pivot-field-menu-button')!.click();
      expect(menu()?.getAttribute('role')).toBe('menu');
      expect(menuItems().map((item) => [item.textContent, item.disabled])).toEqual([['Add to Filters', false], ['Add to Columns', false], ['Add to Rows', false], ['Add to Values', false]]);
      expect(document.activeElement).toBe(menuItems()[0]);
      menuItem('Add to Columns').click();
      expect(menu()).toBeNull();
      expect(areaFields('columns')).toEqual(['orderDate.year', 'units']);

      // already in the rows; a field can be summarized more than once
      fieldItem('region').querySelector<HTMLElement>('.slick-pivot-field-menu-button')!.click();
      expect(menuItems().map((item) => item.disabled)).toEqual([false, false, true, false]);
      // not allowed in the columns nor the values, already in the filters
      fieldItem('channel').querySelector<HTMLElement>('.slick-pivot-field-menu-button')!.click();
      expect(menuItems().map((item) => item.disabled)).toEqual([true, true, false, true]);
      expect(element.querySelectorAll('.slick-pivot-menu')).toHaveLength(1);
    });

    it('uses the default area and aggregator of the options', () => {
      createPanel({ defaultArea: (_field, type) => (type === 'number' ? 'columns' : 'filters'), defaultAggregator: (field) => (field.id === 'units' ? 'avg' : 'max') });

      fieldCheckbox('units').click();
      expect(areaFields('columns')).toEqual(['orderDate.year', 'units']);
      fieldCheckbox('active').click();
      expect(areaFields('filters')).toEqual(['channel', 'active']);
      panel.addField('units', 'values');
      panel.addField('country', 'values');
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['sum:amount', 'avg:units', 'max:country']);
    });
  });

  describe('areas', () => {
    it('shows the fields of the four areas as pills', () => {
      createPanel();

      expect(Array.from(element.querySelectorAll('.slick-pivot-area')).map((section) => [(section as HTMLElement).dataset.area, section.querySelector('.slick-pivot-area-title')?.textContent])).toEqual([['filters', 'Filters'], ['columns', 'Columns'], ['rows', 'Rows'], ['values', 'Values']]);
      expect(element.querySelector('.slick-pivot-areas-hint')?.textContent).toBe('Drag fields between areas below:');
      expect(areaList('rows').getAttribute('role')).toBe('listbox');
      expect(areaList('rows').getAttribute('aria-labelledby')).toBe(areaSection('rows').querySelector('.slick-pivot-area-title')?.id);

      expect(areaFields('filters')).toEqual(['channel']);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      expect(areaFields('rows')).toEqual(['region', 'country']);
      expect(areaFields('values')).toEqual(['amount']);
      expect(pillLabels('columns')).toEqual(['Years (Order Date)']);
      expect(pillLabels('values')).toEqual(['Sum of Amount']);

      const region = pill('rows', 'region');
      expect(region.getAttribute('role')).toBe('option');
      expect(region.getAttribute('tabindex')).toBe('0');
      expect(region.getAttribute('aria-label')).toBe('Region, Rows, 1 of 2');
      expect(region.dataset).toEqual(expect.objectContaining({ area: 'rows', index: '0', field: 'region' }));
      expect(pill('rows', 'country').dataset.index).toBe('1');
      expect(region.querySelector('.slick-pivot-pill-menu-button')?.getAttribute('aria-label')).toBe('Region options');
      expect(panel.getAreaItems('values')).toEqual([{ area: 'values', field: 'amount', label: 'Sum of Amount', valueIndex: 0 }]);
      expect(panel.getAreaItems('rows')).toEqual([{ area: 'rows', field: 'region', label: 'Region' }, { area: 'rows', field: 'country', label: 'Country' }]);

      // an empty area shows a hint
      panel.removeItem('filters', 0);
      expect(areaFields('filters')).toEqual([]);
      expect(areaList('filters').querySelector('.slick-pivot-area-empty')?.textContent).toBe('Drag fields here');
      expect(areaList('rows').querySelector('.slick-pivot-area-empty')).toBeNull();
    });

    it('summarizes the item filter of the fields in the Filters area and marks the filtered fields', () => {
      createPanel();
      const summary = () => pill('filters', 'channel').querySelector('.slick-pivot-pill-summary')?.textContent;

      expect(summary()).toBe('(All)');
      expect(pill('filters', 'channel').querySelector('.slick-pivot-filtered-icon')).toBeNull();

      panel.setFieldFilter('channel', { include: ['Online'] });
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel', include: ['Online'] }]);
      expect(summary()).toBe('Online');
      expect(pill('filters', 'channel').querySelector('.slick-pivot-filtered-icon')).toBeTruthy();
      expect(fieldItem('channel').querySelector('.slick-pivot-filtered-icon')).toBeTruthy();
      expect(pivot.getResult()?.filteredRowCount).toBe(3);

      panel.setFieldFilter('channel', { include: ['Online', 'Retail'] });
      expect(summary()).toBe('(Multiple Items)');
      panel.setFieldFilter('channel', { exclude: ['Retail'] });
      expect(summary()).toBe('(Multiple Items)');

      // without items the field stays in the Filters area, showing everything
      panel.setFieldFilter('channel');
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
      expect(summary()).toBe('(All)');

      // the filter of a row field stays with it, out of the Filters area
      panel.setFieldFilter('region', { include: ['East'] });
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }, { field: 'region', include: ['East'] }]);
      expect(areaFields('filters')).toEqual(['channel']);
      expect(pill('rows', 'region').querySelector('.slick-pivot-filtered-icon')).toBeTruthy();
      expect(pill('rows', 'country').querySelector('.slick-pivot-filtered-icon')).toBeNull();
      panel.setFieldFilter('region');
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
    });

    it('shows the values pill in the columns once there are several values, and keeps its position', () => {
      createPanel();
      expect(areaFields('columns')).toEqual(['orderDate.year']);

      panel.addField('units', 'values');
      expect(areaFields('columns')).toEqual(['orderDate.year', '$values']);
      expect(pill('columns', '$values').classList.contains('slick-pivot-pill-values')).toBe(true);
      expect(pillLabels('columns')).toEqual(['Years (Order Date)', 'Σ Values']);
      expect(pivot.getSpec().columns).toEqual(['orderDate.year']);

      // it only moves within the columns, and cannot be removed
      panel.moveItem({ area: 'columns', index: 1 }, { area: 'columns', index: 0 });
      expect(pivot.getSpec().columns).toEqual(['$values', 'orderDate.year']);
      panel.moveItem({ area: 'columns', index: 0 }, { area: 'rows', index: 0 });
      panel.removeItem('columns', 0);
      expect(pivot.getSpec().columns).toEqual(['$values', 'orderDate.year']);
      expect(panel.canDrop('$values', 'columns')).toBe(true);
      expect(panel.canDrop('$values', 'rows')).toBe(false);

      // with a single value the pill is hidden, the token keeps its place
      panel.removeItem('values', 1);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      panel.addField('country', 'columns');
      expect(areaFields('columns')).toEqual(['orderDate.year', 'country']);
      expect(pivot.getSpec().columns).toEqual(['$values', 'orderDate.year', 'country']);

      // a hidden value is marked
      pivot.updateSpec({ values: [{ field: 'amount', aggregator: 'sum' }, { field: 'units', aggregator: 'sum', hidden: true }] });
      expect(pills('values').map((item) => item.classList.contains('slick-pivot-pill-hidden'))).toEqual([false, true]);
    });

    it('moves a field between the Filters, Columns, Rows and Values areas and within an area', () => {
      createPanel();

      panel.moveItem({ area: 'rows', index: 1 }, { area: 'columns', index: 0 });
      expect(areaFields('rows')).toEqual(['region']);
      expect(areaFields('columns')).toEqual(['country', 'orderDate.year']);
      expect(pivot.getSpec()).toEqual(expect.objectContaining({ rows: ['region'], columns: ['country', 'orderDate.year'] }));

      panel.moveItem({ area: 'columns', index: 0 }, { area: 'filters', index: 0 });
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      expect(areaFields('filters')).toEqual(['country', 'channel']);
      expect(pivot.getSpec().filters).toEqual([{ field: 'country' }, { field: 'channel' }]);

      // a text field dropped in the values is counted
      panel.moveItem({ area: 'filters', index: 0 }, { area: 'values', index: 0 });
      expect(areaFields('filters')).toEqual(['channel']);
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
      expect(pillLabels('values')).toEqual(['Count of Country', 'Sum of Amount']);
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['count:country', 'sum:amount']);

      panel.moveItem({ area: 'values', index: 0 }, { area: 'rows', index: 0 });
      expect(areaFields('values')).toEqual(['amount']);
      expect(areaFields('rows')).toEqual(['country', 'region']);

      panel.moveItem({ area: 'rows', index: 0 }, { area: 'rows', index: 1 });
      expect(areaFields('rows')).toEqual(['region', 'country']);
      panel.moveItem({ area: 'rows', index: 1 }, { area: 'rows', index: 99 });
      expect(areaFields('rows')).toEqual(['region', 'country']);

      // the values keep their settings when they are reordered
      panel.addField('units', 'values', 0);
      expect(areaFields('values')).toEqual(['units', 'amount']);
      panel.moveItem({ area: 'values', index: 1 }, { area: 'values', index: 0 });
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['sum:amount', 'sum:units']);

      // the filter of a field follows it to the rows, and is dropped in the values
      panel.setFieldFilter('channel', { include: ['Online'] });
      panel.moveItem({ area: 'filters', index: 0 }, { area: 'rows', index: 2 });
      expect(areaFields('rows')).toEqual(['region', 'country', 'channel']);
      expect(pivot.getSpec().filters).toEqual([]);
      expect(areaFields('filters')).toEqual([]);

      // nothing happens for an item that does not exist
      panel.moveItem({ area: 'filters', index: 5 }, { area: 'rows', index: 0 });
      panel.removeItem('filters', 5);
      expect(areaFields('rows')).toEqual(['region', 'country', 'channel']);
    });

    it('keeps a field out of the areas it is not allowed in', () => {
      createPanel();

      expect(panel.canDrop('channel', 'filters')).toBe(true);
      expect(panel.canDrop('channel', 'rows')).toBe(true);
      expect(panel.canDrop('channel', 'columns')).toBe(false);
      expect(panel.canDrop('channel', 'values')).toBe(false);
      expect(panel.canDrop('unknown', 'rows')).toBe(false);
      // the levels of a date field follow its allowed areas
      expect(panel.canDrop('orderDate.year', 'values')).toBe(true);

      panel.moveItem({ area: 'filters', index: 0 }, { area: 'columns', index: 0 });
      panel.addField('channel', 'values');
      panel.addField('unknown', 'rows');
      expect(areaFields('filters')).toEqual(['channel']);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      expect(areaFields('values')).toEqual(['amount']);
      expect(areaFields('rows')).toEqual(['region', 'country']);
    });

    it('removes a field from an area with its filter and its sort order', () => {
      createPanel(undefined, { ...baseSpec, sort: [{ field: 'region', direction: 'desc' }], filters: [{ field: 'channel' }, { field: 'region', include: ['East'] }] });

      panel.removeItem('rows', 0);
      expect(areaFields('rows')).toEqual(['country']);
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
      expect(pivot.getSpec().sort).toEqual([]);
      panel.removeItem('values', 0);
      expect(areaFields('values')).toEqual([]);
      panel.removeField('country');
      expect(areaFields('rows')).toEqual([]);
      expect(pivot.getSpec()).toEqual(expect.objectContaining({ rows: [], columns: ['orderDate.year'], values: [], filters: [{ field: 'channel' }] }));
    });

    it('announces the changes to assistive technologies', () => {
      vi.useFakeTimers();
      createPanel();
      const live = element.querySelector('.slick-pivot-live')!;
      const announced = (action: () => void) => {
        action();
        expect(live.textContent).toBe('');
        vi.advanceTimersByTime(20);
        return live.textContent;
      };

      expect(live.getAttribute('aria-live')).toBe('polite');
      expect(announced(() => panel.addField('units', 'values'))).toBe('Units added to Values');
      expect(announced(() => panel.moveItem({ area: 'rows', index: 1 }, { area: 'columns', index: 0 }))).toBe('Country moved to Columns, position 1');
      expect(announced(() => panel.moveItem({ area: 'columns', index: 0 }, { area: 'columns', index: 1 }))).toBe('Country moved to position 2 of 3');
      expect(announced(() => panel.removeItem('columns', 1))).toBe('Country removed from Columns');
      expect(announced(() => panel.removeField('units'))).toBe('Units removed');
      expect(announced(() => panel.setFieldSort('region', 'desc'))).toBe('Region sorted Z to A');
      expect(announced(() => panel.setFieldFilter('region', { exclude: ['West'] }))).toBe('Region filter applied');
      expect(announced(() => panel.setFieldFilter('region'))).toBe('Region filter cleared');
      expect(announced(() => panel.setValueAggregator(0, 'avg'))).toBe('Average of Amount updated');
    });
  });

  describe('pill menu and keyboard', () => {
    it('moves, removes and sorts a field from the menu of its pill', () => {
      createPanel();

      openPillMenu('rows', 'country');
      expect(menuItems().map((item) => item.textContent)).toEqual(['Move Up', 'Move Down', 'Move to Beginning', 'Move to End', 'Move to Filters', 'Move to Columns', 'Move to Values', 'Remove Field', 'Filter…', 'Sort A to Z', 'Sort Z to A']);
      // the last pill of its area cannot move down
      expect(menuItems().filter((item) => item.disabled).map((item) => item.textContent)).toEqual(['Move Down', 'Move to End']);
      expect(menuItems().every((item) => item.getAttribute('role') === 'menuitem')).toBe(true);
      expect(menu()?.querySelectorAll('.slick-pivot-menu-separator')).toHaveLength(3);
      expect(document.activeElement).toBe(menuItem('Move Up'));

      menuItem('Move to Columns').click();
      expect(menu()).toBeNull();
      expect(areaFields('rows')).toEqual(['region']);
      expect(areaFields('columns')).toEqual(['orderDate.year', 'country']);

      openPillMenu('columns', 'country');
      menuItem('Move to Beginning').click();
      expect(areaFields('columns')).toEqual(['country', 'orderDate.year']);
      openPillMenu('columns', 'country');
      menuItem('Move Down').click();
      expect(areaFields('columns')).toEqual(['orderDate.year', 'country']);
      openPillMenu('columns', 'country');
      menuItem('Move Up').click();
      openPillMenu('columns', 'country');
      menuItem('Move to End').click();
      expect(areaFields('columns')).toEqual(['orderDate.year', 'country']);

      openPillMenu('columns', 'country');
      menuItem('Sort Z to A').click();
      expect(pivot.getSpec().sort).toEqual([{ field: 'country', direction: 'desc' }]);
      expect(pivot.getResult()?.columnTree.children[0].children.map((node) => node.label)).toEqual(['Spain', 'Japan', 'China']);
      openPillMenu('columns', 'country');
      menuItem('Sort A to Z').click();
      expect(pivot.getSpec().sort).toEqual([{ field: 'country', direction: 'asc' }]);

      openPillMenu('columns', 'country');
      menuItem('Remove Field').click();
      expect(areaFields('columns')).toEqual(['orderDate.year']);

      // a field of the Filters area is not sorted, and only moves where it is allowed
      openPillMenu('filters', 'channel');
      expect(menuItems().map((item) => item.textContent)).toEqual(['Move Up', 'Move Down', 'Move to Beginning', 'Move to End', 'Move to Columns', 'Move to Rows', 'Move to Values', 'Remove Field', 'Filter…']);
      expect(menuItems().filter((item) => item.disabled).map((item) => item.textContent)).toEqual(['Move Up', 'Move Down', 'Move to Beginning', 'Move to End', 'Move to Columns', 'Move to Values']);
      menuItem('Move to Rows').click();
      expect(areaFields('rows')).toEqual(['region', 'channel']);

      // the values pill only moves
      panel.addField('units', 'values');
      openPillMenu('columns', '$values');
      expect(menuItems().map((item) => item.textContent)).toEqual(['Move Up', 'Move Down', 'Move to Beginning', 'Move to End']);
    });

    it('moves the focus through the menu with the keyboard and gives it back to the pill', () => {
      createPanel();
      const region = pill('rows', 'region');
      region.focus();

      expect(pressKey(region, 'Enter')).toBe(true);
      expect(menu()).toBeTruthy();
      // the first pill cannot move up: the first enabled item is focused
      expect(document.activeElement?.textContent).toBe('Move Down');
      pressKey(document.activeElement as HTMLElement, 'ArrowDown');
      expect(document.activeElement?.textContent).toBe('Move to End');
      pressKey(document.activeElement as HTMLElement, 'ArrowUp');
      pressKey(document.activeElement as HTMLElement, 'ArrowUp');
      expect(document.activeElement?.textContent).toBe('Sort Z to A');
      pressKey(document.activeElement as HTMLElement, 'Home');
      expect(document.activeElement?.textContent).toBe('Move Down');
      pressKey(document.activeElement as HTMLElement, 'End');
      expect(document.activeElement?.textContent).toBe('Sort Z to A');
      expect(pressKey(document.activeElement as HTMLElement, 'Escape')).toBe(true);
      expect(menu()).toBeNull();
      expect(document.activeElement).toBe(region);

      // the menu also opens with Space, the context menu key and Shift+F10, and closes with Tab
      [[' ', {}], ['ContextMenu', {}], ['F10', { shiftKey: true }]].forEach(([key, init]) => {
        expect(pressKey(region, key as string, init as KeyboardEventInit)).toBe(true);
        expect(menu()).toBeTruthy();
        pressKey(document.activeElement as HTMLElement, 'Tab');
        expect(menu()).toBeNull();
      });

      // a click outside of the menu closes it
      vi.useFakeTimers();
      openPillMenu('rows', 'region');
      vi.runAllTimers();
      menu()!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(menu()).toBeTruthy();
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(menu()).toBeNull();
    });

    it('reorders, moves and removes the focused pill with the keyboard', () => {
      createPanel();
      const focused = () => (document.activeElement as HTMLElement).dataset;

      pill('rows', 'region').focus();
      expect(pressKey(pill('rows', 'region'), 'ArrowDown', { altKey: true })).toBe(true);
      expect(areaFields('rows')).toEqual(['country', 'region']);
      // the focus follows the pill
      expect(focused()).toEqual(expect.objectContaining({ area: 'rows', index: '1', field: 'region' }));
      pressKey(pill('rows', 'region'), 'ArrowDown', { altKey: true });
      expect(areaFields('rows')).toEqual(['country', 'region']);
      pressKey(pill('rows', 'region'), 'ArrowUp', { altKey: true });
      expect(areaFields('rows')).toEqual(['region', 'country']);
      pressKey(pill('rows', 'region'), 'ArrowUp', { altKey: true });
      expect(areaFields('rows')).toEqual(['region', 'country']);

      // Alt+Left and Alt+Right move the pill to the previous and the next area
      pressKey(pill('rows', 'region'), 'ArrowLeft', { altKey: true });
      expect(areaFields('columns')).toEqual(['orderDate.year', 'region']);
      expect(focused()).toEqual(expect.objectContaining({ area: 'columns', index: '1', field: 'region' }));
      pressKey(pill('columns', 'region'), 'ArrowRight', { altKey: true });
      expect(areaFields('rows')).toEqual(['country', 'region']);
      // the areas a field is not allowed in are skipped
      pressKey(pill('filters', 'channel'), 'ArrowRight', { altKey: true });
      expect(areaFields('filters')).toEqual([]);
      expect(areaFields('rows')).toEqual(['country', 'region', 'channel']);
      pressKey(pill('rows', 'channel'), 'ArrowRight', { altKey: true });
      expect(areaFields('rows')).toEqual(['country', 'region', 'channel']);
      pressKey(pill('rows', 'channel'), 'ArrowLeft', { altKey: true });
      expect(areaFields('filters')).toEqual(['channel']);

      // the arrow keys move the focus
      pill('rows', 'country').focus();
      expect(pressKey(pill('rows', 'country'), 'ArrowDown')).toBe(true);
      expect(focused().field).toBe('region');
      pressKey(pill('rows', 'region'), 'ArrowDown');
      expect(focused().field).toBe('region');
      pressKey(pill('rows', 'region'), 'ArrowUp');
      expect(focused().field).toBe('country');

      expect(pressKey(pill('rows', 'country'), 'Delete')).toBe(true);
      expect(areaFields('rows')).toEqual(['region']);
      pressKey(pill('rows', 'region'), 'Backspace');
      expect(areaFields('rows')).toEqual([]);

      // other keys, and the keys pressed on the menu button of a pill, are not handled
      expect(pressKey(pill('columns', 'orderDate.year'), 'a')).toBe(false);
      expect(pressKey(pill('columns', 'orderDate.year').querySelector<HTMLElement>('.slick-pivot-pill-menu-button')!, 'Delete')).toBe(false);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
    });
  });

  describe('dragging', () => {
    it('adds a field dragged from the list to the area it is dropped on', () => {
      createPanel();
      const units = fieldItem('units').querySelector<HTMLElement>('.slick-pivot-field-name')!;

      startDrag(units, areaSection('values'));
      // while dragging: a ghost follows the pointer and a marker shows where the field will go
      const ghost = document.body.querySelector<HTMLElement>('.slick-pivot-drag-ghost')!;
      expect(ghost.textContent).toBe('Units');
      expect(ghost.style.transform).toBe('translate(50px, 66px)');
      expect(element.classList.contains('slick-pivot-panel-dragging')).toBe(true);
      expect(document.body.classList.contains('slick-pivot-body-dragging')).toBe(true);
      expect(fieldItem('units').classList.contains('slick-pivot-dragging')).toBe(true);
      expect(areaSection('values').classList.contains('slick-pivot-area-over')).toBe(true);
      expect(areaList('values').lastElementChild?.classList.contains('slick-pivot-drop-marker')).toBe(true);

      drop();
      expect(pillLabels('values')).toEqual(['Sum of Amount', 'Sum of Units']);
      expect(document.body.querySelector('.slick-pivot-drag-ghost')).toBeNull();
      expect(element.querySelector('.slick-pivot-drop-marker')).toBeNull();
      expect(element.classList.contains('slick-pivot-panel-dragging')).toBe(false);
      expect(document.body.classList.contains('slick-pivot-body-dragging')).toBe(false);
      expect(areaSection('values').classList.contains('slick-pivot-area-over')).toBe(false);

      // dropped above the pill the pointer is over
      vi.spyOn(pill('rows', 'region'), 'getBoundingClientRect').mockReturnValue({ top: 100, height: 20 } as DOMRect);
      vi.spyOn(pill('rows', 'country'), 'getBoundingClientRect').mockReturnValue({ top: 120, height: 20 } as DOMRect);
      dragTo(fieldItem('active').querySelector<HTMLElement>('.slick-pivot-field-name')!, areaList('rows'), 125);
      expect(areaFields('rows')).toEqual(['region', 'active', 'country']);
    });

    it('moves a pill dragged to another area or position, and removes one dropped outside of the areas', () => {
      createPanel();

      dragTo(pill('rows', 'country').querySelector<HTMLElement>('.slick-pivot-pill-label')!, areaSection('columns'));
      expect(areaFields('rows')).toEqual(['region']);
      expect(areaFields('columns')).toEqual(['orderDate.year', 'country']);

      // within its area: the position is counted without the dragged pill
      vi.spyOn(pill('columns', 'orderDate.year'), 'getBoundingClientRect').mockReturnValue({ top: 100, height: 20 } as DOMRect);
      dragTo(pill('columns', 'country'), areaList('columns'), 105);
      expect(areaFields('columns')).toEqual(['country', 'orderDate.year']);

      // over the pane but not over an area: nothing happens
      dragTo(pill('columns', 'country'), element.querySelector('.slick-pivot-panel-title'));
      expect(areaFields('columns')).toEqual(['country', 'orderDate.year']);

      // out of the areas, or back on the field list: the field is removed, like Excel does
      dragTo(pill('columns', 'country'), document.body);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      dragTo(pill('rows', 'region'), fieldItem('amount'));
      expect(areaFields('rows')).toEqual([]);
      dragTo(pill('values', 'amount'), null);
      expect(areaFields('values')).toEqual([]);
      // a field of the list dropped outside of the areas is left alone
      dragTo(fieldItem('units'), document.body);
      expect(areaFields('values')).toEqual([]);
    });

    it('does not drop a field on an area it is not allowed in, and cancels the drag with Escape', () => {
      createPanel();
      const channel = pill('filters', 'channel');

      startDrag(channel, areaSection('columns'));
      expect(['filters', 'columns', 'rows', 'values'].map((area) => areaSection(area as PivotArea).classList.contains('slick-pivot-area-disallowed'))).toEqual([false, true, false, true]);
      expect(areaSection('columns').classList.contains('slick-pivot-area-over')).toBe(false);
      drop();
      expect(areaFields('filters')).toEqual(['channel']);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      expect(areaSection('columns').classList.contains('slick-pivot-area-disallowed')).toBe(false);

      startDrag(pill('rows', 'country'), areaSection('columns'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(document.body.querySelector('.slick-pivot-drag-ghost')).toBeNull();
      drop();
      expect(areaFields('rows')).toEqual(['region', 'country']);

      // a press without a move, on a button or with another mouse button is not a drag
      (document as any).elementFromPoint = vi.fn(() => areaSection('columns'));
      pill('rows', 'country').dispatchEvent(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 10, bubbles: true }));
      drop();
      pill('rows', 'country').dispatchEvent(new PointerEvent('pointerdown', { button: 2, clientX: 10, clientY: 10, bubbles: true }));
      document.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 60, bubbles: true }));
      drop();
      startDrag(pill('rows', 'country').querySelector<HTMLElement>('.slick-pivot-pill-menu-button')!, areaSection('columns'));
      drop();
      startDrag(fieldCheckbox('units'), areaSection('columns'));
      drop();
      expect(areaFields('rows')).toEqual(['region', 'country']);
      expect(areaFields('columns')).toEqual(['orderDate.year']);
      expect(document.body.querySelector('.slick-pivot-drag-ghost')).toBeNull();
    });
  });

  describe('date grouping', () => {
    it('groups a date dropped on the rows by its years, quarters and months (autoDateGrouping)', () => {
      createPanel(undefined, noDateSpec);
      expect(panel.getOptions().autoDateGrouping).toEqual(['year', 'quarter', 'month']);
      expect(checkedFields()).toEqual(['region', 'amount']);

      dragTo(fieldItem('orderDate').querySelector<HTMLElement>('.slick-pivot-field-name')!, areaSection('rows'));
      expect(areaFields('rows')).toEqual(['region', ...DATE_LEVELS]);
      expect(pivot.getSpec().rows).toEqual(['region', ...DATE_LEVELS]);
      expect(pillLabels('rows')).toEqual(['Region', 'Years (Order Date)', 'Quarters (Order Date)', 'Months (Order Date)']);
      // the date field and the levels in use are checked
      expect(checkedFields()).toEqual(['region', 'orderDate', ...DATE_LEVELS, 'amount']);
      expect(fieldCheckbox('orderDate.day').checked).toBe(false);

      // the pivot is grouped like Excel does
      const east = pivot.getResult()!.rowTree.children[0];
      expect(east.children.map((year) => year.label)).toEqual(['2023', '2024']);
      expect(east.children[0].children.map((quarter) => [quarter.label, quarter.children.map((month) => month.label)])).toEqual([['Qtr1', ['Feb']], ['Qtr4', ['Nov']]]);

      // unchecking the date field removes every level
      fieldCheckbox('orderDate').click();
      expect(areaFields('rows')).toEqual(['region']);
      // checking it adds it to the rows, grouped too
      fieldCheckbox('orderDate').click();
      expect(areaFields('rows')).toEqual(['region', ...DATE_LEVELS]);
    });

    it('places the levels where the date is dropped, on the rows or the columns', () => {
      createPanel(undefined, noDateSpec);

      panel.addField('orderDate', 'rows', 0);
      expect(areaFields('rows')).toEqual([...DATE_LEVELS, 'region']);
      // dropped on the columns, the levels leave the rows
      panel.addField('orderDate', 'columns');
      expect(areaFields('rows')).toEqual(['region']);
      expect(areaFields('columns')).toEqual(DATE_LEVELS);

      // a level can be placed on its own
      panel.addField('orderDate.day', 'rows');
      expect(areaFields('rows')).toEqual(['region', 'orderDate.day']);
      expect(pillLabels('rows')).toEqual(['Region', 'Days (Order Date)']);
      panel.removeField('orderDate');
      expect(areaFields('rows')).toEqual(['region']);
      expect(areaFields('columns')).toEqual([]);

      // the date itself is filtered and counted
      panel.addField('orderDate', 'filters');
      panel.addField('orderDate', 'values');
      panel.addField('orderDate.year', 'values');
      expect(areaFields('filters')).toEqual(['orderDate']);
      expect(pillLabels('values')).toEqual(['Sum of Amount', 'Count of Order Date', 'Count of Years (Order Date)']);
      expect(pivot.getSpec().filters).toEqual([{ field: 'orderDate' }]);
    });

    it('groups by the levels of the autoDateGrouping option, or adds the date itself when it is off', () => {
      createPanel({ autoDateGrouping: ['year'] }, noDateSpec);
      expect(panel.getOptions().autoDateGrouping).toEqual(['year']);
      panel.addField('orderDate', 'rows');
      expect(areaFields('rows')).toEqual(['region', 'orderDate.year']);

      createPanel({ autoDateGrouping: ['month', 'year'] }, noDateSpec);
      panel.addField('orderDate', 'columns');
      // in the order of the hierarchy
      expect(areaFields('columns')).toEqual(['orderDate.year', 'orderDate.month']);

      createPanel({ autoDateGrouping: false }, noDateSpec);
      panel.addField('orderDate', 'rows');
      expect(areaFields('rows')).toEqual(['region', 'orderDate']);
      expect(pillLabels('rows')).toEqual(['Region', 'Order Date']);
      // the levels are still listed, to be added on their own
      expect(listedFields()).toContain('orderDate.quarter');
      expect(checkedFields()).toEqual(['region', 'orderDate', 'amount']);
    });

    it('follows the date hierarchy of the field and the captions of the options', () => {
      const dateFields: PivotField[] = [
        { id: 'region' },
        { id: 'shipped', label: 'Shipped', type: 'date', field: 'orderDate', dateHierarchy: ['year', 'month'] },
        { id: 'plain', label: 'Plain', type: 'date', field: 'orderDate', dateHierarchy: false },
        { id: 'inferred', field: 'orderDate' },
      ];
      createPanel({ dateLevelLabels: { year: 'Année', quarter: 'Trimestre', month: 'Mois', day: 'Jour' } }, { rows: [], columns: [], values: [] }, { fields: dateFields });

      // the type of a date field is inferred from the rows when it is not declared
      expect(listedFields()).toEqual(['region', 'shipped', 'shipped.year', 'shipped.month', 'plain', 'inferred', 'inferred.year', 'inferred.quarter', 'inferred.month', 'inferred.day']);
      expect(fieldItem('shipped.year').querySelector('.slick-pivot-field-name')?.textContent).toBe('Année');
      expect(fieldItem('inferred').querySelector('.slick-pivot-field-type')?.textContent).toBe('date');

      panel.addField('shipped', 'rows');
      panel.addField('plain', 'rows');
      expect(areaFields('rows')).toEqual(['shipped.year', 'shipped.month', 'plain']);
    });
  });

  describe('values', () => {
    it('summarizes a value by another aggregator, its automatic caption and id following', () => {
      createPanel(undefined, {
        ...baseSpec,
        sort: [{ field: 'region', direction: 'desc', by: { valueId: 'sum:amount' } }],
        filters: [{ field: 'country', top: { count: 2, valueId: 'sum:amount' } }],
      });
      const changed = vi.fn();
      panel.onPanelChange.subscribe(changed);

      panel.setValueAggregator(0, 'sum');
      expect(changed).not.toHaveBeenCalled();

      panel.setValueAggregator(0, 'avg');
      expect(pivot.getSpec().values).toEqual([{ field: 'amount', aggregator: 'avg', id: 'avg:amount', label: undefined }]);
      expect(pillLabels('values')).toEqual(['Average of Amount']);
      // the sort orders and the top filters that used the value follow its id
      expect(pivot.getSpec().sort).toEqual([{ field: 'region', direction: 'desc', by: { valueId: 'avg:amount' } }]);
      expect(pivot.getSpec().filters).toEqual([{ field: 'country', top: { count: 2, valueId: 'avg:amount' } }]);

      // a custom caption and a custom id are kept
      pivot.updateSpec({ values: [{ id: 'sales', field: 'amount', aggregator: 'sum', label: 'Sales' }, { field: 'amount', aggregator: 'max', label: 'Max of Amount' }] });
      panel.setValueAggregator(0, 'min');
      panel.setValueAggregator(1, 'min');
      expect(pivot.getSpec().values).toEqual([{ id: 'sales', field: 'amount', aggregator: 'min', label: 'Sales' }, { id: 'min:amount', field: 'amount', aggregator: 'min', label: undefined }]);
      expect(pillLabels('values')).toEqual(['Sales', 'Min of Amount']);

      // an id already in use gets a suffix
      panel.addField('amount', 'values');
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['sales', 'min:amount', 'sum:amount']);
      panel.setValueAggregator(2, 'min');
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['sales', 'min:amount', 'min:amount:2']);
      panel.setValueAggregator(5, 'sum');
      expect(pivot.getSpec().values).toHaveLength(3);
    });

    it('lists the common aggregators under "Summarize Values By" in the menu of a value pill', () => {
      createPanel();

      openPillMenu('values', 'amount');
      expect(menu()?.querySelector('.slick-pivot-menu-heading')?.textContent).toBe('Summarize Values By');
      const group = menu()!.querySelector('.slick-pivot-menu-group')!;
      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-labelledby')).toBe(group.querySelector('.slick-pivot-menu-heading')?.id);
      const radios = () => Array.from(menu()!.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
      expect(radios().map((item) => [item.textContent, item.getAttribute('aria-checked')])).toEqual([['Sum', 'true'], ['Count', 'false'], ['Average', 'false'], ['Max', 'false'], ['Min', 'false'], ['Distinct Count', 'false']]);
      expect(menuItems().map((item) => item.textContent)).toEqual(['Move Up', 'Move Down', 'Move to Beginning', 'Move to End', 'Move to Filters', 'Move to Columns', 'Move to Rows', 'Remove Field', 'Sum', 'Count', 'Average', 'Max', 'Min', 'Distinct Count', 'Value Field Settings…']);

      menuItem('Count').click();
      expect(pivot.getSpec().values[0]).toEqual(expect.objectContaining({ aggregator: 'count', id: 'count:amount' }));
      expect(pillLabels('values')).toEqual(['Count of Amount']);

      // an aggregator chosen elsewhere is listed too, checked; the numeric ones are left out for a text field
      panel.setValueAggregator(0, 'median');
      panel.addField('country', 'values');
      openPillMenu('values', 'amount');
      expect(radios().map((item) => item.textContent)).toEqual(['Sum', 'Count', 'Average', 'Max', 'Min', 'Distinct Count', 'Median']);
      expect(radios().filter((item) => item.getAttribute('aria-checked') === 'true').map((item) => item.textContent)).toEqual(['Median']);
      openPillMenu('values', 'country');
      expect(radios().map((item) => [item.textContent, item.getAttribute('aria-checked')])).toEqual([['Count', 'true'], ['Max', 'false'], ['Min', 'false'], ['Distinct Count', 'false']]);
    });

    it('lists the aggregators of the summarizeByAggregators option', () => {
      createPanel({ summarizeByAggregators: ['avg', 'sum'] });
      expect(panel.getOptions().summarizeByAggregators).toEqual(['avg', 'sum']);
      openPillMenu('values', 'amount');
      expect(Array.from(menu()!.querySelectorAll('[role="menuitemradio"]')).map((item) => item.textContent)).toEqual(['Average', 'Sum']);
    });

    it('changes the name, the summary, the calculation and the number format of a value in the Value Field Settings', () => {
      createPanel();
      const dialog = () => element.querySelector<HTMLElement>('.slick-pivot-value-settings');
      const control = <T extends HTMLElement>(selector: string) => dialog()!.querySelector<T>(selector)!;
      const openSettings = () => {
        openPillMenu('values', 'amount');
        menuItem('Value Field Settings…').click();
      };

      openSettings();
      expect(dialog()?.getAttribute('role')).toBe('dialog');
      expect(dialog()?.getAttribute('aria-modal')).toBe('true');
      expect(dialog()?.getAttribute('aria-labelledby')).toBe(dialog()?.querySelector('.slick-pivot-dialog-title')?.id);
      expect(dialog()?.querySelector('.slick-pivot-dialog-title')?.textContent).toBe('Value Field Settings');
      expect(dialog()?.querySelector('.slick-pivot-dialog-source')?.textContent).toBe('Source: Amount');
      const nameInput = control<HTMLInputElement>('.slick-pivot-value-name');
      expect(nameInput.value).toBe('Sum of Amount');
      expect(document.activeElement).toBe(nameInput);
      expect(control<HTMLSelectElement>('.slick-pivot-value-aggregator').value).toBe('sum');
      expect(control<HTMLSelectElement>('.slick-pivot-value-aggregator').options).toHaveLength(15);
      expect(control<HTMLSelectElement>('.slick-pivot-value-show-as').value).toBe('');
      expect(Array.from(control<HTMLSelectElement>('.slick-pivot-value-format').options).map((option) => option.value)).toEqual(['general', 'number0', 'number2', 'percent', 'currency']);
      expect(control<HTMLSelectElement>('.slick-pivot-value-format').value).toBe('general');

      // the automatic name follows the aggregator
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-aggregator'), 'max');
      expect(nameInput.value).toBe('Max of Amount');
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-show-as'), 'percentOfRowTotal');
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-format'), 'currency');
      control<HTMLButtonElement>('.slick-pivot-dialog-ok').click();
      expect(dialog()).toBeNull();
      expect(pivot.getSpec().values).toEqual([{ field: 'amount', aggregator: 'max', id: 'max:amount', label: undefined, showAs: 'percentOfRowTotal', numberFormat: { style: 'currency', currency: 'USD' } }]);
      expect(pillLabels('values')).toEqual(['Max of Amount']);

      // a custom name is kept, Enter applies
      openSettings();
      expect(control<HTMLSelectElement>('.slick-pivot-value-show-as').value).toBe('percentOfRowTotal');
      expect(control<HTMLSelectElement>('.slick-pivot-value-format').value).toBe('currency');
      control<HTMLInputElement>('.slick-pivot-value-name').value = ' Top sale ';
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-aggregator'), 'min');
      expect(control<HTMLInputElement>('.slick-pivot-value-name').value).toBe(' Top sale ');
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-show-as'), '');
      expect(pressKey(control<HTMLInputElement>('.slick-pivot-value-name'), 'Enter')).toBe(true);
      expect(dialog()).toBeNull();
      expect(pivot.getSpec().values).toEqual([{ field: 'amount', aggregator: 'min', id: 'min:amount', label: 'Top sale', showAs: undefined, numberFormat: { style: 'currency', currency: 'USD' } }]);

      // Cancel and Escape leave the value as it is, the focus goes back to the pill
      openSettings();
      selectOption(control<HTMLSelectElement>('.slick-pivot-value-aggregator'), 'sum');
      control<HTMLButtonElement>('.slick-pivot-dialog-cancel').click();
      expect(dialog()).toBeNull();
      expect(document.activeElement).toBe(pill('values', 'amount'));
      openSettings();
      pressKey(control<HTMLInputElement>('.slick-pivot-value-name'), 'Escape');
      expect(dialog()).toBeNull();
      expect(pivot.getSpec().values[0].aggregator).toBe('min');

      // the focus stays inside of the dialog
      openSettings();
      const focusables = Array.from(dialog()!.querySelectorAll<HTMLElement>('input, select, button'));
      focusables[focusables.length - 1].focus();
      expect(pressKey(focusables[focusables.length - 1], 'Tab')).toBe(true);
      expect(document.activeElement).toBe(focusables[0]);
      expect(pressKey(focusables[0], 'Tab', { shiftKey: true })).toBe(true);
      expect(document.activeElement).toBe(focusables[focusables.length - 1]);
      // between the first and the last control, Tab is left to the browser
      focusables[1].focus();
      expect(pressKey(focusables[1], 'Tab')).toBe(false);
      expect(document.activeElement).toBe(focusables[1]);
    });

    it('keeps a number format set by code and offers the formats and calculations of the options', () => {
      createPanel(
        { numberFormats: [{ id: 'plain', label: 'Plain' }, { id: 'euro', label: 'Euro', format: { style: 'currency', currency: 'EUR' } }], showAsOptions: [{ value: '', label: 'None' }, { value: 'runningTotal', label: 'Running' }] },
        { ...baseSpec, values: [{ id: 'amount', field: 'amount', aggregator: 'sum', numberFormat: { maximumFractionDigits: 1 }, showAs: { type: 'runningTotal', axis: 'columns' } }] }
      );
      expect(panel.getOptions().numberFormats).toHaveLength(2);
      expect(panel.getOptions().showAsOptions).toHaveLength(2);

      openPillMenu('values', 'amount');
      menuItem('Value Field Settings…').click();
      const dialog = element.querySelector<HTMLElement>('.slick-pivot-value-settings')!;
      const format = dialog.querySelector<HTMLSelectElement>('.slick-pivot-value-format')!;
      expect(Array.from(format.options).map((option) => [option.value, option.textContent])).toEqual([['plain', 'Plain'], ['euro', 'Euro'], ['__current', 'Custom']]);
      expect(format.value).toBe('__current');
      expect(Array.from(dialog.querySelector<HTMLSelectElement>('.slick-pivot-value-show-as')!.options).map((option) => option.textContent)).toEqual(['None', 'Running']);
      expect(dialog.querySelector<HTMLSelectElement>('.slick-pivot-value-show-as')!.value).toBe('runningTotal');

      dialog.querySelector<HTMLButtonElement>('.slick-pivot-dialog-ok')!.click();
      // the format of the code and the custom id are kept
      expect(pivot.getSpec().values).toEqual([{ id: 'amount', field: 'amount', aggregator: 'sum', label: undefined, numberFormat: { maximumFractionDigits: 1 }, showAs: 'runningTotal' }]);
    });
  });

  describe('item filter', () => {
    const popup = () => element.querySelector<HTMLElement>('.slick-pivot-filter-popup');
    const filterItems = () => Array.from(popup()!.querySelectorAll<HTMLLabelElement>('.slick-pivot-filter-item:not(.slick-pivot-filter-all)'));
    const itemCheckbox = (label: string) => filterItems().find((item) => item.querySelector('span')?.textContent === label)!.querySelector<HTMLInputElement>('input')!;
    const selectAll = () => popup()!.querySelector<HTMLInputElement>('.slick-pivot-filter-all input')!;
    const openFilter = async (area: PivotArea, field: string, count: number) => {
      openPillMenu(area, field);
      menuItem('Filter…').click();
      await vi.waitFor(() => expect(filterItems()).toHaveLength(count));
    };

    it('lists the items of a field with their row counts and filters the unchecked ones out', async () => {
      createPanel();

      await openFilter('rows', 'region', 2);
      expect(popup()?.getAttribute('role')).toBe('dialog');
      expect(popup()?.querySelector('.slick-pivot-dialog-title')?.textContent).toBe('Filter Region');
      expect(filterItems().map((item) => [item.querySelector('span')?.textContent, item.querySelector('.slick-pivot-filter-count')?.textContent, item.querySelector('input')?.checked])).toEqual([['East', '3', true], ['West', '2', true]]);
      expect(popup()?.querySelector('.slick-pivot-filter-all span')?.textContent).toBe('(Select All)');
      expect(selectAll().checked).toBe(true);
      expect(document.activeElement).toBe(popup()?.querySelector('.slick-pivot-filter-search'));

      itemCheckbox('West').click();
      expect(selectAll().checked).toBe(false);
      expect(selectAll().indeterminate).toBe(true);
      popup()!.querySelector<HTMLButtonElement>('.slick-pivot-dialog-ok')!.click();
      expect(popup()).toBeNull();
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }, { field: 'region', exclude: ['West'] }]);
      expect(pivot.getResult()?.rowTree.children.map((node) => node.label)).toEqual(['East']);
      expect(pill('rows', 'region').querySelector('.slick-pivot-filtered-icon')).toBeTruthy();

      // the popup shows the current filter; checking everything clears it
      await openFilter('rows', 'region', 2);
      expect(filterItems().map((item) => item.querySelector('input')?.checked)).toEqual([true, false]);
      selectAll().click();
      expect(filterItems().map((item) => item.querySelector('input')?.checked)).toEqual([true, true]);
      popup()!.querySelector<HTMLButtonElement>('.slick-pivot-dialog-ok')!.click();
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
    });

    it('searches the items, keeps the few checked ones as an include list and clears the filter', async () => {
      createPanel();

      await openFilter('rows', 'country', 4);
      const searchInput = popup()!.querySelector<HTMLInputElement>('.slick-pivot-filter-search')!;
      searchInput.value = 'an';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      expect(filterItems().map((item) => item.querySelector('span')?.textContent)).toEqual(['France', 'Japan']);
      expect(popup()?.querySelector('.slick-pivot-filter-all span')?.textContent).toBe('(Select All Search Results)');
      // unchecking the search results
      selectAll().click();
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      expect(filterItems().map((item) => item.querySelector('input')?.checked)).toEqual([true, false, false, true]);
      itemCheckbox('Spain').click();
      itemCheckbox('Japan').click();
      itemCheckbox('Japan').click();
      popup()!.querySelector<HTMLButtonElement>('.slick-pivot-dialog-ok')!.click();
      // fewer items are kept than removed: they are listed
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }, { field: 'country', include: ['China'] }]);

      await openFilter('rows', 'country', 4);
      expect(filterItems().map((item) => item.querySelector('input')?.checked)).toEqual([true, false, false, false]);
      popup()!.querySelector<HTMLButtonElement>('.slick-pivot-filter-clear')!.click();
      expect(popup()).toBeNull();
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);

      // Cancel and Escape change nothing
      await openFilter('rows', 'country', 4);
      itemCheckbox('China').click();
      popup()!.querySelector<HTMLButtonElement>('.slick-pivot-dialog-cancel')!.click();
      expect(popup()).toBeNull();
      await openFilter('rows', 'country', 4);
      pressKey(popup()!.querySelector<HTMLElement>('.slick-pivot-filter-search')!, 'Escape');
      expect(popup()).toBeNull();
      expect(pivot.getSpec().filters).toEqual([{ field: 'channel' }]);
    });

    it('limits the listed items to maxFilterItems', async () => {
      createPanel({ maxFilterItems: 3 });
      await openFilter('rows', 'country', 3);
      expect(popup()?.querySelector('.slick-pivot-filter-note')?.textContent).toBe('Showing 3 of 4 items, search to narrow the list.');
      // a popup replaces the previous one
      openPillMenu('rows', 'region');
      menuItem('Filter…').click();
      await vi.waitFor(() => expect(filterItems()).toHaveLength(2));
      expect(element.querySelectorAll('.slick-pivot-filter-popup')).toHaveLength(1);
      expect(popup()?.querySelector('.slick-pivot-filter-note')?.textContent).toBe('');
    });
  });

  describe('deferred layout update', () => {
    it('keeps the changes pending until Update is pressed', () => {
      createPanel();
      const changed = vi.fn();
      panel.onPanelChange.subscribe(changed);
      const deferCheckbox = element.querySelector<HTMLInputElement>('.slick-pivot-defer-checkbox')!;
      const updateButton = element.querySelector<HTMLButtonElement>('.slick-pivot-update-button')!;
      const status = element.querySelector<HTMLElement>('.slick-pivot-panel-status')!;

      expect(panel.isDeferred()).toBe(false);
      expect(deferCheckbox.checked).toBe(false);
      expect(updateButton.disabled).toBe(true);
      expect(status.textContent).toBe('');

      deferCheckbox.click();
      expect(panel.isDeferred()).toBe(true);
      expect(element.classList.contains('slick-pivot-panel-deferred')).toBe(true);

      panel.addField('units', 'values');
      fieldCheckbox('country').click();
      // the pane shows the pending layout, the pivot keeps its own
      expect(pillLabels('values')).toEqual(['Sum of Amount', 'Sum of Units']);
      expect(areaFields('rows')).toEqual(['region']);
      expect(panel.getSpec().values).toHaveLength(2);
      expect(pivot.getSpec().values).toHaveLength(1);
      expect(pivot.getSpec().rows).toEqual(['region', 'country']);
      expect(changed).toHaveBeenCalledTimes(2);
      expect(changed.mock.calls[0][1]).toEqual({ spec: expect.objectContaining({ values: [expect.anything(), expect.anything()] }), deferred: true });
      expect(updateButton.disabled).toBe(false);
      expect(updateButton.classList.contains('slick-pivot-update-pending')).toBe(true);
      expect(status.textContent).toBe('Changes are pending, press Update to apply them.');
      expect(status.classList.contains('slick-pivot-panel-status-visible')).toBe(true);

      // a change of the pivot made elsewhere does not replace the pending layout
      pivot.updateSpec({ layout: 'outline' });
      expect(areaFields('rows')).toEqual(['region']);

      updateButton.click();
      expect(pivot.getSpec().values.map((value) => value.id)).toEqual(['sum:amount', 'sum:units']);
      expect(pivot.getSpec().rows).toEqual(['region']);
      expect(updateButton.disabled).toBe(true);
      expect(status.textContent).toBe('');
      expect(panel.getSpec()).toBe(pivot.getSpec());

      // turning the option off applies what is pending
      panel.addField('country', 'rows');
      expect(pivot.getSpec().rows).toEqual(['region']);
      deferCheckbox.click();
      expect(panel.isDeferred()).toBe(false);
      expect(pivot.getSpec().rows).toEqual(['region', 'country']);
      expect(element.classList.contains('slick-pivot-panel-deferred')).toBe(false);
    });

    it('starts deferred with deferLayoutUpdate, and has no checkbox without showDeferUpdate', async () => {
      createPanel({ deferLayoutUpdate: true });
      expect(panel.isDeferred()).toBe(true);
      expect(element.querySelector<HTMLInputElement>('.slick-pivot-defer-checkbox')?.checked).toBe(true);
      panel.removeItem('rows', 1);
      expect(pivot.getSpec().rows).toEqual(['region', 'country']);
      await panel.applyPendingChanges();
      expect(pivot.getSpec().rows).toEqual(['region']);
      await panel.applyPendingChanges();
      expect(pivot.getSpec().rows).toEqual(['region']);

      createPanel({ showDeferUpdate: false });
      expect(element.querySelector('.slick-pivot-defer-checkbox')).toBeNull();
      expect(element.querySelector('.slick-pivot-update-button')).toBeNull();
      panel.setDeferred(true);
      panel.removeItem('rows', 1);
      expect(pivot.getSpec().rows).toEqual(['region', 'country']);
      panel.setDeferred(false);
      expect(pivot.getSpec().rows).toEqual(['region']);
    });
  });

  describe('options and lifecycle', () => {
    it('follows the pivot: its spec, its loading state and a truncated result', () => {
      createPanel();
      const status = element.querySelector<HTMLElement>('.slick-pivot-panel-status')!;

      pivot.updateSpec({ rows: ['country'] });
      expect(areaFields('rows')).toEqual(['country']);
      expect(checkedFields()).not.toContain('region');

      pivot.onLoadingChanged.notify({ loading: true });
      expect(element.classList.contains('slick-pivot-panel-busy')).toBe(true);
      pivot.onLoadingChanged.notify({ loading: false });
      expect(element.classList.contains('slick-pivot-panel-busy')).toBe(false);

      pivot.updateSpec({ columns: ['country'], rows: [], maxColumns: 2 });
      expect(status.textContent).toBe('Only the first 2 of 4 columns are shown. Filter the column fields or move them to the rows.');
      expect(status.classList.contains('slick-pivot-panel-status-visible')).toBe(true);
      pivot.updateSpec({ maxColumns: 100 });
      expect(status.textContent).toBe('');
      expect(status.classList.contains('slick-pivot-panel-status-visible')).toBe(false);
    });

    it('uses the captions of the options and raises onClose from its close button', () => {
      createPanel({ title: 'Champs', searchPlaceholder: 'Chercher', areaTitles: { rows: 'Lignes' } as any, emptyAreaText: 'Déposer ici', areasHint: 'Zones', valuesPillLabel: 'Valeurs', showCloseButton: true }, { ...noDateSpec, values: [{ field: 'amount', aggregator: 'sum' }, { field: 'units', aggregator: 'sum' }] });
      const closed = vi.fn();
      panel.onClose.subscribe(closed);

      expect(element.getAttribute('aria-label')).toBe('Champs');
      expect(element.querySelector('.slick-pivot-panel-title')?.textContent).toBe('Champs');
      expect(element.querySelector<HTMLInputElement>('.slick-pivot-search-input')?.placeholder).toBe('Chercher');
      expect(Array.from(element.querySelectorAll('.slick-pivot-area-title')).map((title) => title.textContent)).toEqual(['Filters', 'Columns', 'Lignes', 'Values']);
      expect(areaList('filters').querySelector('.slick-pivot-area-empty')?.textContent).toBe('Déposer ici');
      expect(element.querySelector('.slick-pivot-areas-hint')?.textContent).toBe('Zones');
      expect(pillLabels('columns')).toEqual(['Valeurs']);
      expect(pill('rows', 'region').getAttribute('aria-label')).toBe('Region, Lignes, 1 of 1');

      const closeButton = element.querySelector<HTMLButtonElement>('.slick-pivot-panel-close')!;
      expect(closeButton.getAttribute('aria-label')).toBe('Close Champs');
      closeButton.click();
      expect(closed).toHaveBeenCalledTimes(1);
      expect(closed.mock.calls[0][1]).toEqual({ panel });

      createPanel();
      expect(element.querySelector('.slick-pivot-panel-close')).toBeNull();
    });

    it('renders into the container of a selector and throws when there is none', () => {
      const host = document.createElement('div');
      host.id = 'fieldsPane';
      document.body.appendChild(host);
      const selectorPivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec });
      const selectorPanel = new SlickPivotPanel(selectorPivot, '#fieldsPane');
      created.push(selectorPanel, selectorPivot);

      expect(host.querySelector('.slick-pivot-panel')).toBeTruthy();
      expect(() => new SlickPivotPanel(selectorPivot, '#nowhere')).toThrow('[SlickPivotPanel] the panel container was not found.');
    });

    it('empties its container and releases the pivot on destroy', () => {
      createPanel();
      openPillMenu('rows', 'region');
      startDrag(pill('rows', 'country'), areaSection('columns'));
      expect(pivot.onSpecChanged.subscriberCount).toBe(1);

      panel.destroy();
      expect(container.querySelector('.slick-pivot-panel')).toBeNull();
      expect(document.body.querySelector('.slick-pivot-drag-ghost')).toBeNull();
      expect(document.body.classList.contains('slick-pivot-body-dragging')).toBe(false);
      expect(pivot.onSpecChanged.subscriberCount).toBe(0);
      expect(pivot.onPivotChanged.subscriberCount).toBe(0);
      expect(pivot.onLoadingChanged.subscriberCount).toBe(0);
      expect(panel.onPanelChange.subscriberCount).toBe(0);
      // the pivot goes on without the pane
      pivot.updateSpec({ rows: ['country'] });
      expect(pivot.getSpec().rows).toEqual(['country']);
    });
  });
});
