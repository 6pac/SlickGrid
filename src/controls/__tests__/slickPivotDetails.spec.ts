import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Column, OnPivotCellDrillDownEventArgs, PivotField, PivotOption, PivotSpec } from '../../models';
import { SlickPivot } from '../../plugins/slick.pivot';
import { PIVOT_VALUES_FIELD } from '../../slick.pivotengine';
import { SlickPivotDetails } from '../slick.pivotdetails';
import type { PivotDetailsOption } from '../slick.pivotdetails';

interface SalesRow {
  id: number;
  region: string;
  country: string;
  year: number;
  when: Date | null;
  amount: number;
  units: number | null;
  note: string;
}

const createRows = (): SalesRow[] => [
  { id: 1, region: 'East', country: 'China', year: 2023, when: new Date(2023, 1, 5), amount: 1234.5, units: 2.5, note: 'item 10' },
  { id: 2, region: 'East', country: 'China', year: 2023, when: null, amount: 300, units: null, note: 'item 2' },
  { id: 3, region: 'East', country: 'China', year: 2023, when: new Date(2023, 10, 1), amount: 50, units: 5, note: '<i>new</i>' },
];

const fields: PivotField[] = [
  { id: 'region', label: 'Region' },
  { id: 'country', label: 'Country' },
  { id: 'year', label: 'Year', type: 'number' },
  { id: 'when', label: 'When', type: 'date' },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'units', label: 'Units', type: 'number' },
  { id: 'note', label: 'Note' },
  { id: 'amountK', label: 'Amount (K)', type: 'number', getter: (row: SalesRow) => row.amount / 1000 },
];

const baseSpec: Partial<PivotSpec> = {
  rows: ['region', 'country'],
  columns: ['year'],
  values: [{ field: 'amount', aggregator: 'sum', numberFormat: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } }],
};

describe('SlickPivotDetails', () => {
  const created: Array<{ destroy: () => void; }> = [];
  let pivot: SlickPivot;
  let details: SlickPivotDetails;
  let rows: SalesRow[];

  beforeAll(() => {
    // jsdom has the dialog element but not its modal behavior
    const proto = HTMLDialogElement.prototype as any;
    if (typeof proto.showModal !== 'function') {
      proto.showModal = function () {
        this.setAttribute('open', '');
      };
    }
    if (typeof proto.close !== 'function') {
      proto.close = function () {
        if (this.hasAttribute('open')) {
          this.removeAttribute('open');
          this.dispatchEvent(new Event('close'));
        }
      };
    }
  });

  /** Create a pivot (it needs no grid) and its details dialog */
  const createDetails = (options?: Partial<PivotDetailsOption>, pivotOptions: Partial<PivotOption> = {}) => {
    rows = createRows();
    pivot = new SlickPivot({ fields, source: rows, spec: baseSpec, locale: 'en-US', numberFormat: { locale: 'en-US' }, ...pivotOptions });
    details = new SlickPivotDetails(pivot, options);
    created.push(details, pivot);
    return details;
  };

  /** Double-click a cell: the plugin raises onPivotCellDrillDown with its source rows */
  const drillDown = (args: Partial<OnPivotCellDrillDownEventArgs> = {}) => {
    pivot.onPivotCellDrillDown.notify({ rowKey: '["East","China"]', columnKey: '[2023]', rowPath: { region: 'East', country: 'China' }, columnPath: { year: 2023 }, rows, ...args });
  };

  const dialog = () => document.querySelector<HTMLDialogElement>('dialog.slick-pivot-details')!;
  const title = () => dialog().querySelector('.slick-pivot-details-title')!.textContent;
  const note = () => dialog().querySelector('.slick-pivot-details-note')!.textContent;
  const grid = () => details.getGrid()!;
  const columnNames = () => grid().getColumns().map((column) => column.name);
  /** Text of a cell, as its formatter renders it */
  const cellText = (row: number, columnId: string) => {
    const columns = grid().getColumns();
    const cell = columns.findIndex((column) => column.id === columnId);
    const item = grid().getDataItem(row);
    return columns[cell].formatter!(row, cell, item[columns[cell].field as string], columns[cell], item, grid());
  };
  const columnValues = (columnId: string) => Array.from({ length: grid().getDataLength() }, (_v, row) => grid().getDataItem(row)[columnId]);
  const sortBy = (columnId: string, sortAsc: boolean) => {
    const sortCol = grid().getColumns().find((column) => column.id === columnId);
    grid().onSort.notify({ sortCol, sortAsc, multiColumnSort: false, grid: grid() } as any);
  };

  afterEach(() => {
    created.splice(0).forEach((instance) => instance.destroy());
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('opens a modal dialog listing the source rows of a double-clicked cell', () => {
    createDetails();
    expect(dialog()).toBeNull();
    expect(details.isOpen()).toBe(false);

    drillDown();
    expect(details.isOpen()).toBe(true);
    expect(dialog().parentElement).toBe(document.body);
    expect(dialog().getAttribute('aria-labelledby')).toBe(dialog().querySelector('.slick-pivot-details-title')!.id);
    expect(title()).toBe('3 source rows — East › China / 2023');
    expect(note()).toBe('');
    expect(grid().getDataLength()).toBe(3);
    expect(details.getOptions().maxRows).toBe(1000);
  });

  it('makes one sortable column per field, computed fields included, formatted like the pivot', () => {
    createDetails();
    drillDown();
    expect(columnNames()).toEqual(['Region', 'Country', 'Year', 'When', 'Amount', 'Units', 'Note', 'Amount (K)']);
    expect(grid().getColumns().every((column) => column.sortable)).toBe(true);
    expect(grid().getColumns().find((column) => column.id === 'amount')!.cssClass).toBe('slick-pivot-details-number');
    expect(grid().getColumns().find((column) => column.id === 'note')!.cssClass).toBeUndefined();

    // the computed field holds its value
    expect(grid().getDataItem(0).amountK).toBe(1.2345);
    // a number in the format of a value summarizing the field, the others as they are, with up to 2 decimals
    expect(cellText(0, 'amount')).toBe('$1,235');
    expect(cellText(0, 'units')).toBe('2.5');
    expect(cellText(0, 'amountK')).toBe('1.23');
    expect(cellText(0, 'year')).toBe('2023');
    // dates like the pivot, blanks empty, text escaped
    expect(cellText(0, 'when')).toBe(new Date(2023, 1, 5).toLocaleDateString('en-US'));
    expect(cellText(1, 'when')).toBe('');
    expect(cellText(1, 'units')).toBe('');
    expect(cellText(2, 'note')).toBe('&lt;i&gt;new&lt;/i&gt;');
  });

  it('ignores the number format of a value that does not keep the unit of its field', () => {
    createDetails(undefined, { spec: { ...baseSpec, values: [{ field: 'amount', aggregator: 'count', numberFormat: { style: 'percent' } }, { field: 'units', aggregator: 'sum', numberFormat: { minimumFractionDigits: 3 }, showAs: { type: 'percentOfGrandTotal' } }] } });
    drillDown();
    expect(cellText(0, 'amount')).toBe('1234.5');
    expect(cellText(0, 'units')).toBe('2.5');
  });

  it('describes the cell with its row and column items, or as the grand total', () => {
    createDetails(undefined, { grandTotalLabel: 'Total' });
    drillDown({ rows: rows.slice(0, 1), rowPath: {}, columnPath: { [PIVOT_VALUES_FIELD]: 'sum:amount' } });
    expect(title()).toBe('1 source row — Total');
    drillDown({ rowPath: { region: 'East' }, columnPath: {} });
    expect(title()).toBe('3 source rows — East');
  });

  it('uses the caption of the grand totals of the spec when it has one', () => {
    createDetails(undefined, { spec: { ...baseSpec, grandTotals: { label: 'Overall' } } });
    drillDown({ rowPath: {}, columnPath: {} });
    expect(title()).toBe('3 source rows — Overall');
  });

  it('lists at most maxRows rows, with a note, and translates its captions', () => {
    createDetails({
      maxRows: 2,
      labels: {
        close: 'Fermer',
        title: ({ countText, where }) => `${countText} lignes : ${where}`,
        truncated: ({ shownText, countText }) => `${shownText} sur ${countText}`,
      },
    });
    drillDown();
    expect(grid().getDataLength()).toBe(2);
    expect(title()).toBe('3 lignes : East › China / 2023');
    expect(note()).toBe('2 sur 3');
    expect(dialog().querySelector('.slick-pivot-details-close')!.textContent).toBe('Fermer');
  });

  it('shows the fields it is given, in their order, or the columns it is given', () => {
    createDetails({ fields: ['amount', 'nope', 'region'] });
    drillDown();
    expect(columnNames()).toEqual(['Amount', 'Region']);

    created.splice(0).forEach((instance) => instance.destroy());
    const columns: Column[] = [{ id: 'note', name: 'Comment', field: 'note' }];
    createDetails({ columns, gridOptions: { rowHeight: 30 } });
    drillDown();
    expect(grid().getColumns().map((column) => column.name)).toEqual(['Comment']);
    expect(grid().getOptions().rowHeight).toBe(30);
    // the items are the source rows themselves
    expect(grid().getDataItem(0)).toBe(rows[0]);
  });

  it('stays closed when onBeforeShow returns false', () => {
    createDetails();
    details.onBeforeShow.subscribe((_e, args) => (args.rows.length > 2 ? false : undefined));
    drillDown();
    expect(details.isOpen()).toBe(false);
    drillDown({ rows: rows.slice(0, 2) });
    expect(details.isOpen()).toBe(true);
  });

  it('sorts the rows by a column, numbers and dates by value, text in natural order, blanks last', () => {
    createDetails();
    drillDown();
    sortBy('amount', true);
    expect(columnValues('amount')).toEqual([50, 300, 1234.5]);
    sortBy('amount', false);
    expect(columnValues('amount')).toEqual([1234.5, 300, 50]);
    sortBy('units', false);
    expect(columnValues('units')).toEqual([5, 2.5, null]);
    sortBy('units', true);
    expect(columnValues('units')).toEqual([2.5, 5, null]);
    sortBy('when', false);
    expect(columnValues('when').map((date: Date | null) => date?.getMonth() ?? null)).toEqual([10, 1, null]);
    // "item 2" before "item 10"
    sortBy('note', true);
    expect(columnValues('note')).toEqual(['<i>new</i>', 'item 2', 'item 10']);
    sortBy('note', false);
    expect(columnValues('note')).toEqual(['item 10', 'item 2', '<i>new</i>']);
    // a sort without a column is ignored
    grid().onSort.notify({ sortCols: [], grid: grid() } as any);
    expect(columnValues('note')).toEqual(['item 10', 'item 2', '<i>new</i>']);
  });

  it('closes with its Close button or a click on the backdrop, raising onClose', () => {
    createDetails();
    const closed = vi.fn();
    details.onClose.subscribe(closed);
    drillDown();
    dialog().querySelector<HTMLButtonElement>('.slick-pivot-details-close')!.click();
    expect(details.isOpen()).toBe(false);
    expect(closed).toHaveBeenCalledTimes(1);
    details.close();
    expect(closed).toHaveBeenCalledTimes(1);

    drillDown();
    vi.spyOn(dialog(), 'getBoundingClientRect').mockReturnValue({ left: 100, right: 500, top: 100, bottom: 400 } as DOMRect);
    // a click in the dialog box keeps it open
    dialog().dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 200, clientY: 200 }));
    dialog().querySelector('.slick-pivot-details-title')!.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));
    expect(details.isOpen()).toBe(true);
    dialog().dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));
    expect(details.isOpen()).toBe(false);
    expect(closed).toHaveBeenCalledTimes(2);
  });

  it('keeps its grid for the next cell, and creates it again when the pivot grid reads from right to left', () => {
    createDetails();
    drillDown();
    const first = grid();
    sortBy('amount', true);
    details.close();
    drillDown({ rows: rows.slice(1) });
    expect(grid()).toBe(first);
    expect(grid().getDataLength()).toBe(2);
    expect(grid().getSortColumns()).toEqual([]);
    expect(dialog().dir).toBe('ltr');

    vi.spyOn(pivot, 'getGrid').mockReturnValue({ getOptions: () => ({ rtl: true }) } as any);
    drillDown();
    expect(dialog().dir).toBe('rtl');
    expect(grid()).not.toBe(first);
    expect(grid().getOptions().rtl).toBe(true);
  });

  it('adds the dialog to the container it is given', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    createDetails({ container });
    drillDown();
    expect(dialog().parentElement).toBe(container);
  });

  it('removes its dialog and stops listening to the pivot when destroyed', () => {
    createDetails();
    drillDown();
    const shown = vi.fn();
    details.onBeforeShow.subscribe(shown);
    details.destroy();
    expect(dialog()).toBeNull();
    expect(details.getGrid()).toBeUndefined();
    drillDown();
    expect(shown).not.toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });
});
