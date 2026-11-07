import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption, PivotField, PivotOption, PivotRequest, PivotResult, PivotSpec } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import { SlickDataView } from '../../slick.dataview';
import { Editors } from '../../slick.editors';
import type { SlickGrid } from '../../slick.grid';
import { PivotEngine } from '../../slick.pivotengine';
import { SlickPivot } from '../slick.pivot';

interface SalesRow {
  id: number;
  region: string;
  country: string;
  year: number;
  when: Date;
  amount: number;
  units: number;
}

const createRows = (): SalesRow[] => [
  { id: 1, region: 'East', country: 'China', year: 2023, when: new Date(2023, 1, 5), amount: 100, units: 10 },
  { id: 2, region: 'East', country: 'China', year: 2024, when: new Date(2024, 6, 15), amount: 300, units: 30 },
  { id: 3, region: 'East', country: 'Japan', year: 2023, when: new Date(2023, 10, 1), amount: 50, units: 5 },
  { id: 4, region: 'West', country: 'France', year: 2024, when: new Date(2024, 2, 20), amount: 200, units: 20 },
  { id: 5, region: 'West', country: 'Spain', year: 2023, when: new Date(2023, 4, 9), amount: 80, units: 8 },
];

const fields: PivotField[] = [
  { id: 'region', label: 'Region' },
  { id: 'country', label: 'Country' },
  { id: 'year', label: 'Year', type: 'number' },
  { id: 'when', label: 'When', type: 'date' },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'units', label: 'Units', type: 'number' },
  { id: 'amountK', label: 'Amount (K)', type: 'number', getter: (row: SalesRow) => row.amount / 1000 },
];

const baseSpec: Partial<PivotSpec> = { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'amount', aggregator: 'sum' }] };

const EAST = '["East"]';
const WEST = '["West"]';
const CHINA = '["East","China"]';
const ROOT = '[]';

interface MockGrid {
  grid: SlickGrid;
  container: HTMLDivElement;
  preHeaderPanel: HTMLDivElement;
  gridOptions: GridOption;
}

/** A grid double: the methods and events the plugin uses, the options merged like the grid merges its docking lists */
function createMockGrid(options: Partial<GridOption> = {}, containerWidth = 0): MockGrid {
  const container = document.createElement('div');
  const preHeaderScroller = document.createElement('div');
  const preHeaderPanel = document.createElement('div');
  preHeaderScroller.appendChild(preHeaderPanel);
  container.appendChild(preHeaderScroller);
  document.body.appendChild(container);
  Object.defineProperty(container, 'clientWidth', { configurable: true, value: containerWidth });
  const gridOptions = SlickPivot.getGridOptions({ editable: true, ...options }) as GridOption;
  let columns: Column[] = [];
  const list = (references?: any[]) => (references ? [...references] : []);
  const includes = (references: any, id: string | number) => Array.isArray(references) && references.includes(id);

  const grid = {
    getContainerNode: vi.fn(() => container),
    getPreHeaderPanel: vi.fn(() => preHeaderPanel),
    getOptions: vi.fn(() => gridOptions),
    setOptions: vi.fn((newOptions: Partial<GridOption>) => {
      const { pinning, stickyRows, ...others } = newOptions;
      Object.assign(gridOptions, others);
      if (pinning) {
        const current = gridOptions.pinning ?? {};
        gridOptions.pinning = {
          ...current,
          ...(pinning.columns ? { columns: { left: pinning.columns.left ?? current.columns?.left ?? [], right: pinning.columns.right ?? current.columns?.right ?? [] } } : {}),
          ...(pinning.rows ? { rows: { top: pinning.rows.top ? list(pinning.rows.top) : list(current.rows?.top), bottom: pinning.rows.bottom ? list(pinning.rows.bottom) : list(current.rows?.bottom) } } : {}),
        };
      }
      if (stickyRows) {
        gridOptions.stickyRows = { top: list(stickyRows.top), bottom: list(stickyRows.bottom), both: list(stickyRows.both) };
      }
    }),
    getColumns: vi.fn(() => {
      // the grid marks the pinned columns
      columns.forEach((column) => {
        column.pinned = includes(gridOptions.pinning?.columns?.left, column.id) ? 'left' : includes(gridOptions.pinning?.columns?.right, column.id) ? 'right' : null;
      });
      return columns;
    }),
    setColumns: vi.fn((newColumns: Column[]) => {
      columns = newColumns;
    }),
    setPreHeaderPanelVisibility: vi.fn(),
    resizeCanvas: vi.fn(),
    getHeadersWidth: vi.fn(() => 0),
    getHeaderColumn: vi.fn(() => undefined),
    invalidateAllRows: vi.fn(),
    updateRowCount: vi.fn(),
    render: vi.fn(),
    setSortColumns: vi.fn(),
    onClick: new SlickEvent(),
    onKeyDown: new SlickEvent(),
    onDblClick: new SlickEvent(),
    onSort: new SlickEvent(),
    onScroll: new SlickEvent(),
    onColumnsResized: new SlickEvent(),
    onColumnsDrag: new SlickEvent(),
    onAfterUpdateColumns: new SlickEvent(),
    onHeaderCellRendered: new SlickEvent(),
    onBeforeEditCell: new SlickEvent(),
    onCellChange: new SlickEvent(),
  } as unknown as SlickGrid;

  return { grid, container, preHeaderPanel, gridOptions };
}

describe('SlickPivot plugin', () => {
  const created: SlickPivot[] = [];

  /** Create a pivot of the sales rows, registered with a mocked grid */
  const createPivot = (options: Partial<PivotOption> = {}, gridOptions: Partial<GridOption> = {}, containerWidth = 0) => {
    const mock = createMockGrid(gridOptions, containerWidth);
    const pivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec, numberFormat: { locale: 'en-US' }, locale: 'en-US', ...options });
    pivot.init(mock.grid);
    created.push(pivot);
    return { pivot, ...mock };
  };

  /** Output of the formatter of a cell, as the grid renders it */
  const render = (pivot: SlickPivot, row: number, cell: number): any => {
    const column = pivot.getColumns()[cell];
    const item = pivot.rowModel.getItem(row);
    return column.formatter!(row, cell, item[column.field as string], column, item, pivot.getGrid()!);
  };

  const valueColumn = (pivot: SlickPivot, valueId: string, columnKey: string) =>
    pivot.getColumns().find((column) => pivot.getColumnInfo(column.id)?.valueId === valueId && pivot.getColumnInfo(column.id)?.columnKey === columnKey)!;

  const headerLabels = (preHeaderPanel: HTMLElement) =>
    Array.from(preHeaderPanel.querySelectorAll('.slick-pivot-header-row')).map((row) => Array.from(row.querySelectorAll('.slick-pivot-header-label')).map((label) => label.textContent));

  afterEach(() => {
    created.splice(0).forEach((pivot) => pivot.destroy());
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('adds the pre-header panel options needed by the column group headers to the grid options', () => {
    expect(SlickPivot.getGridOptions({ enableCellNavigation: true, preHeaderPanelHeight: 30 })).toEqual({ enableCellNavigation: true, preHeaderPanelHeight: 30, createPreHeaderPanel: true, showPreHeaderPanel: true });
    expect(SlickPivot.getGridOptions()).toEqual({ preHeaderPanelHeight: 25, createPreHeaderPanel: true, showPreHeaderPanel: true });
  });

  describe('compact layout', () => {
    it('generates one Row Labels column, a column per column item and the grand total column', () => {
      const { pivot, grid, container } = createPivot();

      expect(container.classList.contains('slick-pivot')).toBe(true);
      expect(pivot.getGrid()).toBe(grid);
      expect(pivot.getColumns().map((column) => [column.id, column.name])).toEqual([['__pivot_rows', 'Row Labels'], ['__pv_0', '2023'], ['__pv_1', '2024'], ['__pv_2', 'Grand Total']]);
      expect(grid.setColumns).toHaveBeenCalledWith(pivot.getColumns());
      expect(pivot.getColumns()[0]).toEqual(expect.objectContaining({ field: '__pivot_rows', sortable: true, reorderable: false, excludeFromColumnPicker: true, excludeFromGridMenu: true, cssClass: 'slick-pivot-row-header', headerCssClass: 'slick-pivot-row-header-title' }));
      expect(pivot.getColumns()[1]).toEqual(expect.objectContaining({ field: '__pv_0', width: 100, sortable: true, reorderable: false, cssClass: 'slick-pivot-value', headerCssClass: 'slick-pivot-value-title', columnGroup: undefined }));
      expect(pivot.getColumns()[3].cssClass).toBe('slick-pivot-value slick-pivot-total-column slick-pivot-grand-total-column');
      expect(pivot.getColumnInfo('__pivot_rows')).toEqual(expect.objectContaining({ type: 'rowHeader', groupPath: [] }));
      expect(pivot.getColumnInfo('__pv_0')).toEqual(expect.objectContaining({ type: 'value', columnKey: '[2023]', valueIndex: 0, valueId: 'sum:amount', isTotal: false, isGrandTotal: false, groupPath: [] }));
      expect(pivot.getColumnInfo('__pv_2')).toEqual(expect.objectContaining({ columnKey: ROOT, isTotal: true, isGrandTotal: true }));
      expect(pivot.getColumnInfo('nope')).toBeUndefined();
      expect(pivot.getValuesCaption()).toBe('Sum of Amount');
    });

    it('generates the group, leaf and grand total rows with their values and the item values of their row fields', () => {
      const { pivot } = createPivot();
      const rows = pivot.rowModel.getItems();

      expect(pivot.rowModel.getLength()).toBe(7);
      expect(rows.map((row) => row.id)).toEqual(['group:["East"]', 'leaf:["East","China"]', 'leaf:["East","Japan"]', 'group:["West"]', 'leaf:["West","France"]', 'leaf:["West","Spain"]', 'grandTotal:[]']);
      expect(rows.map((row) => row.__pivot_rows)).toEqual(['East', 'China', 'Japan', 'West', 'France', 'Spain', 'Grand Total']);
      expect(rows.map((row) => [row.__pv_0, row.__pv_1, row.__pv_2])).toEqual([[150, 300, 450], [100, 300, 400], [50, undefined, 50], [80, 200, 280], [undefined, 200, 200], [80, undefined, 80], [230, 500, 730]]);
      expect(pivot.rowModel.getItem(1)).toEqual(expect.objectContaining({ region: 'East', country: 'China' }));
      expect(pivot.rowModel.getItem(6)).not.toHaveProperty('region');
      expect(pivot.getRowInfo(0)).toEqual(expect.objectContaining({ type: 'group', key: EAST, level: 1, label: 'East', hasChildren: true, collapsed: false }));
      expect(pivot.getRowInfo(1)).toEqual(expect.objectContaining({ type: 'leaf', key: CHINA, level: 2, label: 'China', hasChildren: false }));
      expect(pivot.getRowInfo(6)).toEqual(expect.objectContaining({ type: 'grandTotal', key: ROOT, level: 0, label: 'Grand Total' }));
      expect(pivot.getRowInfo(7)).toBeUndefined();
      expect(pivot.rowModel.getItemMetadata(0)?.cssClasses).toBe('slick-pivot-row slick-pivot-group slick-pivot-level-1');
      expect(pivot.rowModel.getItemMetadata(1)?.cssClasses).toBe('slick-pivot-row slick-pivot-leaf slick-pivot-level-2');
      expect(pivot.rowModel.getItemMetadata(6)?.cssClasses).toBe('slick-pivot-row slick-pivot-grand-total slick-pivot-level-0');
      expect(pivot.rowModel.getItemMetadata(7)).toBeNull();
      expect(pivot.getResult()?.filteredRowCount).toBe(5);
    });

    it('formats the row labels with an indented toggle and the values with the number format', () => {
      const { pivot } = createPivot({ emptyCellText: '-' });

      const group: DocumentFragment = render(pivot, 0, 0);
      const toggle = group.querySelector<HTMLElement>('.slick-pivot-toggle')!;
      expect(toggle.className).toBe('slick-pivot-toggle slick-group-toggle expanded');
      expect(toggle.getAttribute('role')).toBe('button');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe('Collapse East');
      expect(toggle.dataset.key).toBe(EAST);
      expect(toggle.style.marginInlineStart).toBe('0px');
      expect(group.querySelector('.slick-pivot-label')?.textContent).toBe('East');

      const leaf: DocumentFragment = render(pivot, 1, 0);
      expect(leaf.querySelector('.slick-pivot-toggle')).toBeNull();
      expect(leaf.querySelector<HTMLElement>('.slick-pivot-toggle-spacer')?.style.marginInlineStart).toBe('15px');
      expect(leaf.querySelector('.slick-pivot-label')?.textContent).toBe('China');
      expect(render(pivot, 6, 0).querySelector('.slick-pivot-label')?.textContent).toBe('Grand Total');

      expect(render(pivot, 0, 1)).toBe('150');
      expect(render(pivot, 2, 2)).toBe('-');
      expect(pivot.formatValue(1234.567, 0)).toBe('1,234.57');
      expect(pivot.formatValue(null, 0)).toBe('-');
      expect(pivot.formatValue(NaN, 0)).toBe('-');
      expect(pivot.formatValue('text', 0)).toBe('text');
      expect(pivot.formatValue(new Date(2024, 0, 15), 0)).toBe(new Date(2024, 0, 15).toLocaleDateString());
    });

    it('merges the column templates into the generated columns and formats currencies and percentages', () => {
      const { pivot } = createPivot({
        columnDefaults: { width: 70, cssClass: 'num' },
        indentation: 20,
        spec: {
          ...baseSpec,
          values: [
            { id: 'amount', field: 'amount', aggregator: 'sum', numberFormat: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, column: { width: 120, headerCssClass: 'money' } },
            { id: 'share', field: 'amount', aggregator: 'sum', showAs: 'percentOfGrandTotal', label: 'Share' },
          ],
        },
      });
      const columns = pivot.getColumns();

      expect(columns.slice(1).map((column) => [column.name, column.columnGroup, column.width])).toEqual([
        ['Sum of Amount', '2023', 120],
        ['Share', '2023', 70],
        ['Sum of Amount', '2024', 120],
        ['Share', '2024', 70],
        ['Sum of Amount', 'Grand Total', 120],
        ['Share', 'Grand Total', 70],
      ]);
      expect(columns[1].cssClass).toBe('slick-pivot-value num');
      expect(columns[1].headerCssClass).toBe('slick-pivot-value-title money');
      expect(pivot.getColumnInfo('__pv_1')?.groupPath).toEqual([{ key: '[2023]', nodeKey: '[2023]', label: '2023', collapsible: false, collapsed: false }]);
      expect(pivot.formatValue(1234.5, 0)).toBe('$1,235');
      expect(pivot.formatValue(0.25, 1)).toBe('25%');
      expect(render(pivot, 1, 2)).toBe('13.7%');
      expect(pivot.getValuesCaption()).toBe('Values');
      expect(render(pivot, 1, 0).querySelector('.slick-pivot-toggle-spacer')?.style.marginInlineStart).toBe('20px');
    });

    it('uses the formatter of a column template in place of the value formatter', () => {
      const formatter = vi.fn(() => 'custom');
      const { pivot } = createPivot({ spec: { ...baseSpec, values: [{ field: 'amount', aggregator: 'sum', column: { formatter } }] } });
      expect(render(pivot, 0, 1)).toBe('custom');
      expect(formatter).toHaveBeenCalledWith(0, 1, 150, pivot.getColumns()[1], pivot.rowModel.getItem(0), pivot.getGrid());
    });

    it('draws the column group headers and the field captions in the pre-header panel', () => {
      const { pivot, grid, preHeaderPanel, gridOptions } = createPivot({ spec: { ...baseSpec, values: [{ field: 'amount', aggregator: 'sum' }, { field: 'units', aggregator: 'sum' }] } });

      expect(preHeaderPanel.classList.contains('slick-pivot-header-groups')).toBe(true);
      expect(headerLabels(preHeaderPanel)).toEqual([['Values', 'Year'], ['', '2023', '2024', 'Grand Total']]);
      expect(gridOptions.preHeaderPanelHeight).toBe(50);
      expect((preHeaderPanel.parentElement as HTMLElement).style.height).toBe('50px');
      expect(grid.setPreHeaderPanelVisibility).toHaveBeenCalledWith(true);
      expect(grid.resizeCanvas).toHaveBeenCalled();

      const groups = preHeaderPanel.querySelectorAll<HTMLElement>('.slick-pivot-header-row:last-child .slick-pivot-header-group');
      expect(groups[0].classList.contains('slick-pivot-header-corner')).toBe(true);
      expect(groups[0].classList.contains('slick-pivot-header-group-empty')).toBe(true);
      // the row label column is pinned, so its group cell is docked to the leading band
      expect(groups[0].classList.contains('slick-pivot-header-group-left')).toBe(true);
      expect(groups[0].classList.contains('slick-pivot-header-group-pinned')).toBe(true);
      // a group spans the columns of its item
      expect(groups[1].style.width).toBe('200px');
      expect(groups[1].dataset.firstColumn).toBe('__pv_0');
      expect(groups[1].dataset.lastColumn).toBe('__pv_1');
      expect(groups[1].title).toBe('2023');
      expect(groups[1].classList.contains('slick-pivot-header-group-docked')).toBe(false);
      expect(preHeaderPanel.querySelectorAll('.slick-pivot-header-row')[0].querySelector('.slick-pivot-header-caption')).toBeTruthy();

      // the caption of the column fields can be replaced, and the captions row left out
      pivot.setOptions({ columnLabelsCaption: 'Fiscal year' });
      expect(headerLabels(preHeaderPanel)[0]).toEqual(['Values', 'Fiscal year']);
      pivot.setOptions({ showFieldCaptions: false });
      expect(headerLabels(preHeaderPanel)).toEqual([['', '2023', '2024', 'Grand Total']]);
      expect(gridOptions.preHeaderPanelHeight).toBe(25);

      // the scroll position of the grid is passed to the panel
      grid.onScroll.notify({ scrollLeft: 120, scrollTop: 0, grid } as any);
      expect(preHeaderPanel.style.getPropertyValue('--slick-pivot-scroll-left')).toBe('120px');
    });

    it('hides the pre-header panel when there is nothing to draw in it', () => {
      const { grid, preHeaderPanel } = createPivot({ spec: { ...baseSpec, columns: [] } });
      expect(headerLabels(preHeaderPanel)).toEqual([]);
      expect(grid.setPreHeaderPanelVisibility).toHaveBeenCalledWith(false);
    });

    it('puts the subtotals below the groups with subtotals: "bottom", the grand total row on top on request, or leaves them out', () => {
      const { pivot } = createPivot({ spec: { ...baseSpec, subtotals: 'bottom', grandTotals: { rows: 'top' } } });
      const rows = pivot.rowModel.getItems();
      expect(rows.map((row) => [row.__pivot.type, row.__pivot_rows, row.__pv_2])).toEqual([
        ['grandTotal', 'Grand Total', 730],
        ['group', 'East', undefined],
        ['leaf', 'China', 400],
        ['leaf', 'Japan', 50],
        ['subtotal', 'East Total', 450],
        ['group', 'West', undefined],
        ['leaf', 'France', 200],
        ['leaf', 'Spain', 80],
        ['subtotal', 'West Total', 280],
      ]);
      expect(rows[4].id).toBe('subtotal:["East"]');
      expect(pivot.rowModel.getItemMetadata(4)?.cssClasses).toBe('slick-pivot-row slick-pivot-subtotal slick-pivot-level-1');

      pivot.setOptions({ totalSuffix: ' (all)', grandTotalLabel: 'Total' });
      expect(pivot.rowModel.getItem(4).__pivot_rows).toBe('East (all)');
      expect(pivot.rowModel.getItem(0).__pivot_rows).toBe('Total');
      expect(pivot.getColumns()[3].name).toBe('Total');

      pivot.updateSpec({ subtotals: 'none', grandTotals: { rows: false, columns: false } });
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_rows)).toEqual(['East', 'China', 'Japan', 'West', 'France', 'Spain']);
      expect(pivot.getColumns().map((column) => column.name)).toEqual(['Row Labels', '2023', '2024']);
    });

    it('shows a single row of values when there is no row field', () => {
      const { pivot } = createPivot({ spec: { ...baseSpec, rows: [] } });
      expect(pivot.getColumns().map((column) => column.name)).toEqual(['', '2023', '2024', 'Grand Total']);
      expect(pivot.getColumns()[0].sortable).toBe(false);
      expect(pivot.rowModel.getItems().map((row) => [row.__pivot.type, row.__pivot_rows, row.__pv_2])).toEqual([['grandTotal', 'Sum of Amount', 730]]);
    });
  });

  describe('outline and tabular layouts', () => {
    it('renders one column per row field in the outline layout, the group captions spanning the deeper columns', () => {
      const { pivot } = createPivot({ spec: { ...baseSpec, layout: 'outline' }, rowHeaderColumn: { cssClass: 'labels' } });

      expect(pivot.getColumns().slice(0, 2).map((column) => [column.id, column.name, column.cssClass])).toEqual([['__pivot_row_0', 'Region', 'slick-pivot-row-header labels'], ['__pivot_row_1', 'Country', 'slick-pivot-row-header labels']]);
      expect(pivot.getColumnInfo('__pivot_row_1')).toEqual(expect.objectContaining({ type: 'rowHeader', rowFieldIndex: 1 }));
      expect(pivot.rowModel.getItems().map((row) => [row.__pivot_row_0, row.__pivot_row_1, row.__pv_2])).toEqual([
        ['East', undefined, 450],
        [undefined, 'China', 400],
        [undefined, 'Japan', 50],
        ['West', undefined, 280],
        [undefined, 'France', 200],
        [undefined, 'Spain', 80],
        ['Grand Total', undefined, 730],
      ]);
      expect(pivot.rowModel.getItemMetadata(0)?.columns).toEqual({ 0: { colspan: 2 } });
      expect(pivot.rowModel.getItemMetadata(1)?.columns).toBeUndefined();
      expect(pivot.rowModel.getItemMetadata(6)?.columns).toEqual({ 0: { colspan: 2 } });

      // the toggle sits in the column of its field, the captions are not indented
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle')?.dataset.key).toBe(EAST);
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle')?.style.marginInlineStart).toBe('0px');
      expect(render(pivot, 1, 0)).toBe('');
      expect(render(pivot, 1, 1).querySelector('.slick-pivot-toggle-spacer')).toBeNull();
      expect(render(pivot, 1, 1).querySelector('.slick-pivot-label')?.textContent).toBe('China');

      pivot.updateSpec({ repeatItemLabels: true });
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_row_0)).toEqual(['East', 'East', 'East', 'West', 'West', 'West', 'Grand Total']);
      expect(render(pivot, 1, 0).querySelector('.slick-pivot-toggle')).toBeNull();
      expect(render(pivot, 1, 0).querySelector('.slick-pivot-label')?.textContent).toBe('East');

      // a collapsed group keeps its caption in its own column
      pivot.collapseRow(EAST);
      expect(pivot.rowModel.getItemMetadata(0)?.columns).toBeUndefined();
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_row_0)).toEqual(['East', 'West', 'West', 'West', 'Grand Total']);
    });

    it('renders the tabular layout with one row per inner item and the subtotals below each group', () => {
      const { pivot } = createPivot({ spec: { ...baseSpec, layout: 'tabular' } });

      expect(pivot.rowModel.getItems().map((row) => [row.__pivot_row_0, row.__pivot_row_1, row.__pivot.type, row.__pv_2])).toEqual([
        ['East', 'China', 'leaf', 400],
        [undefined, 'Japan', 'leaf', 50],
        ['East Total', undefined, 'subtotal', 450],
        ['West', 'France', 'leaf', 200],
        [undefined, 'Spain', 'leaf', 80],
        ['West Total', undefined, 'subtotal', 280],
        ['Grand Total', undefined, 'grandTotal', 730],
      ]);
      expect(pivot.rowModel.getItem(2).id).toBe('subtotal:["East"]');
      expect(pivot.rowModel.getItemMetadata(2)?.columns).toEqual({ 0: { colspan: 2 } });
      expect(pivot.rowModel.getItemMetadata(0)?.columns).toBeUndefined();
      // the group toggle is drawn on the first row of its group
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle')?.dataset.key).toBe(EAST);
      expect(render(pivot, 1, 0)).toBe('');
      expect(render(pivot, 2, 0).querySelector('.slick-pivot-label')?.textContent).toBe('East Total');

      pivot.updateSpec({ subtotals: 'none', repeatItemLabels: true });
      expect(pivot.rowModel.getItems().map((row) => [row.__pivot_row_0, row.__pivot_row_1])).toEqual([['East', 'China'], ['East', 'Japan'], ['West', 'France'], ['West', 'Spain'], ['Grand Total', undefined]]);

      pivot.collapseRow(WEST);
      expect(pivot.rowModel.getItems().map((row) => [row.__pivot_row_0, row.__pivot_row_1, row.__pv_2])).toEqual([['East', 'China', 400], ['East', 'Japan', 50], ['West', undefined, 280], ['Grand Total', undefined, 730]]);
    });
  });

  describe('expand and collapse', () => {
    it('collapses and expands the row groups from the API and the row model', () => {
      const { pivot, grid } = createPivot();
      const toggled = vi.fn();
      pivot.onGroupToggled.subscribe(toggled);
      vi.mocked(grid.invalidateAllRows).mockClear();

      pivot.collapseRow(EAST);
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_rows)).toEqual(['East', 'West', 'France', 'Spain', 'Grand Total']);
      expect(pivot.getRowInfo(0)).toEqual(expect.objectContaining({ type: 'group', collapsed: true }));
      expect(pivot.rowModel.getItem(0).__pv_2).toBe(450);
      expect(pivot.rowModel.getItemMetadata(0)?.cssClasses).toBe('slick-pivot-row slick-pivot-group slick-pivot-level-1 slick-pivot-collapsed');
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle')?.getAttribute('aria-label')).toBe('Expand East');
      expect(toggled).toHaveBeenCalledTimes(1);
      expect(toggled.mock.calls[0][1]).toEqual({ key: EAST, axis: 'rows', collapsed: true });
      expect(grid.invalidateAllRows).toHaveBeenCalledTimes(1);
      expect(grid.updateRowCount).toHaveBeenCalled();
      expect(grid.render).toHaveBeenCalled();

      // nothing happens when the state does not change
      pivot.collapseRow(EAST);
      expect(toggled).toHaveBeenCalledTimes(1);

      pivot.rowModel.expandGroup(EAST);
      expect(pivot.rowModel.getLength()).toBe(7);
      pivot.rowModel.collapseGroup(WEST);
      expect(pivot.rowModel.getLength()).toBe(5);
      pivot.toggleRow(WEST);
      expect(pivot.rowModel.getLength()).toBe(7);
      pivot.collapseAllRows();
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_rows)).toEqual(['East', 'West', 'Grand Total']);
      pivot.expandAllRows('region');
      expect(pivot.rowModel.getLength()).toBe(7);
      pivot.collapseAllRows('country');
      expect(pivot.rowModel.getLength()).toBe(7);

      // the collapsed state survives a new computation, and is forgotten with the group
      pivot.collapseRow(EAST);
      pivot.updateSpec({ columns: [] });
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      pivot.updateSpec({ filters: [{ field: 'region', exclude: ['East'] }] });
      expect(pivot.isRowCollapsed(EAST)).toBe(false);
    });

    it('toggles the row groups with the toggles and the keyboard', () => {
      const { pivot, grid } = createPivot();
      const toggle = render(pivot, 0, 0).querySelector('.slick-pivot-toggle') as HTMLElement;
      document.body.appendChild(toggle);
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      toggle.dispatchEvent(click);
      grid.onClick.notify({ row: 0, cell: 0, grid }, new SlickEventData(click));
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      expect(click.defaultPrevented).toBe(true);

      // a click elsewhere in the cell is not a toggle
      const other = new MouseEvent('click', { bubbles: true, cancelable: true });
      document.body.dispatchEvent(other);
      grid.onClick.notify({ row: 0, cell: 0, grid }, new SlickEventData(other));
      expect(pivot.isRowCollapsed(EAST)).toBe(true);

      const press = (key: string, row: number, cell = 0) => {
        const event = new KeyboardEvent('keydown', { key, cancelable: true });
        grid.onKeyDown.notify({ row, cell, grid }, new SlickEventData(event));
        return event.defaultPrevented;
      };
      expect(press(' ', 0)).toBe(true);
      expect(pivot.isRowCollapsed(EAST)).toBe(false);
      expect(press('-', 0)).toBe(true);
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      expect(press('+', 0)).toBe(true);
      expect(pivot.isRowCollapsed(EAST)).toBe(false);
      expect(press('Enter', 0)).toBe(true);
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      // other keys, leaves and value cells are left to the grid (East is collapsed: row 2 is France)
      expect(press('a', 0)).toBe(false);
      expect(press(' ', 2)).toBe(false);
      expect(press(' ', 0, 1)).toBe(false);
      expect(pivot.isRowCollapsed(EAST)).toBe(true);
      expect(pivot.rowModel.getLength()).toBe(5);
    });

    it('draws no toggle when the row groups cannot be collapsed', () => {
      const { pivot } = createPivot({ enableRowCollapse: false });
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle')).toBeNull();
      expect(render(pivot, 0, 0).querySelector('.slick-pivot-toggle-spacer')).toBeTruthy();
      pivot.collapseRow(EAST);
      expect(pivot.rowModel.getLength()).toBe(7);
    });

    it('collapses a column group into its subtotal column from the group header, the column header and the API', () => {
      const { pivot, grid, preHeaderPanel } = createPivot({ spec: { rows: ['region'], columns: ['year', 'country'], values: [{ field: 'amount', aggregator: 'sum' }] } });
      const toggled = vi.fn();
      pivot.onGroupToggled.subscribe(toggled);
      const names = () => pivot.getColumns().slice(1).map((column) => column.name);

      expect(names()).toEqual(['China', 'Japan', 'Spain', '2023 Total', 'China', 'France', '2024 Total', 'Grand Total']);
      expect(headerLabels(preHeaderPanel)).toEqual([['Sum of Amount', 'Year / Country'], ['', '2023', '', '2024', '', '']]);
      expect(pivot.getColumnInfo('__pv_3')).toEqual(expect.objectContaining({ columnKey: '[2023]', isTotal: true, isGrandTotal: false }));
      expect(pivot.rowModel.getItem(0).__pv_3).toBe(150);

      // the toggle of the 2023 group in the pre-header panel
      const groupToggle = preHeaderPanel.querySelector<HTMLElement>('.slick-pivot-column-toggle')!;
      expect(groupToggle.dataset.key).toBe('[2023]');
      expect(groupToggle.getAttribute('aria-label')).toBe('Collapse 2023');
      groupToggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(pivot.isColumnCollapsed('[2023]')).toBe(true);
      expect(names()).toEqual(['2023', 'China', 'France', '2024 Total', 'Grand Total']);
      expect(pivot.getColumnInfo('__pv_0')).toEqual(expect.objectContaining({ columnKey: '[2023]', isTotal: true }));
      expect(pivot.rowModel.getItem(0).__pv_0).toBe(150);
      expect(toggled.mock.calls[0][1]).toEqual({ key: '[2023]', axis: 'columns', collapsed: true });
      expect(grid.setColumns).toHaveBeenCalledTimes(2);

      // the collapsed group gets a toggle in its column header
      const headerCell = document.createElement('div');
      headerCell.innerHTML = '<span class="slick-column-name">2023</span>';
      grid.onHeaderCellRendered.notify({ node: headerCell, column: pivot.getColumns()[1], grid } as any);
      const headerToggle = headerCell.querySelector<HTMLElement>('.slick-column-name .slick-pivot-column-toggle')!;
      expect(headerToggle.className).toBe('slick-pivot-column-toggle slick-group-toggle collapsed');
      expect(headerToggle.getAttribute('aria-expanded')).toBe('false');
      headerToggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(pivot.isColumnCollapsed('[2023]')).toBe(false);
      expect(names()).toHaveLength(8);

      pivot.collapseAllColumns();
      expect(names()).toEqual(['2023', '2024', 'Grand Total']);
      pivot.expandAllColumns('year');
      expect(names()).toHaveLength(8);
      pivot.toggleColumn('[2024]');
      expect(names()).toEqual(['China', 'Japan', 'Spain', '2023 Total', '2024', 'Grand Total']);

      // without column subtotals and column collapsing
      pivot.updateSpec({ columnSubtotals: false });
      expect(names()).toEqual(['China', 'Japan', 'Spain', '2024', 'Grand Total']);
      pivot.setOptions({ enableColumnCollapse: false });
      expect(names()).toEqual(['China', 'Japan', 'Spain', 'China', 'France', 'Grand Total']);
      expect(preHeaderPanel.querySelector('.slick-pivot-column-toggle')).toBeNull();
    });
  });

  describe('write-back', () => {
    const writeBackSpec: Partial<PivotSpec> = {
      rows: ['region', 'country'],
      columns: ['year'],
      values: [
        { field: 'units', aggregator: 'sum', writeBack: { precision: 0 } },
        { field: 'amountK', aggregator: 'sum' },
        { field: 'amount', aggregator: 'sum', showAs: 'percentOfGrandTotal' },
        { field: 'amount', aggregator: 'max' },
        { field: 'amount', aggregator: 'avg', writeBack: false },
      ],
    };

    it('only lets the values that can be written back be edited', () => {
      const { pivot } = createPivot({ enableWriteBack: true, spec: writeBackSpec });

      expect(pivot.isValueEditable('sum:units')).toBe(true);
      // a derived field without a setter, a calculation, an aggregator that cannot allocate, a read-only value
      expect(pivot.isValueEditable('sum:amountK')).toBe(false);
      expect(pivot.isValueEditable('sum:amount')).toBe(false);
      expect(pivot.isValueEditable('max:amount')).toBe(false);
      expect(pivot.isValueEditable('avg:amount')).toBe(false);
      expect(pivot.isValueEditable('nope')).toBe(false);

      const units = valueColumn(pivot, 'sum:units', '[2023]');
      expect(units.editor).toBe(Editors.Float);
      expect(units.editorFixedDecimalPlaces).toBe(0);
      expect(units.cssClass).toContain('slick-pivot-editable');
      const amountK = valueColumn(pivot, 'sum:amountK', '[2023]');
      expect(amountK.editor).toBeUndefined();
      expect(amountK.cssClass).not.toContain('slick-pivot-editable');
      // the grand total cells can be edited too
      expect(valueColumn(pivot, 'sum:units', ROOT).editor).toBe(Editors.Float);

      const plain = createPivot({ spec: writeBackSpec });
      expect(plain.pivot.isValueEditable('sum:units')).toBe(false);
      expect(plain.pivot.getColumns().every((column) => !column.editor)).toBe(true);
    });

    it('uses the editor and the precision of the write-back settings', () => {
      const editor = vi.fn() as any;
      const { pivot } = createPivot({ enableWriteBack: true, writeBack: { editor, precision: 1 }, spec: { ...baseSpec, values: [{ field: 'amount', aggregator: 'sum' }, { field: 'units', aggregator: 'sum', numberFormat: { maximumFractionDigits: 3 }, writeBack: { method: 'equal' } }] } });
      const amount = valueColumn(pivot, 'sum:amount', ROOT);
      expect(amount.editor).toBe(editor);
      expect(amount.editorFixedDecimalPlaces).toBe(1);
      expect(valueColumn(pivot, 'sum:units', ROOT).editorFixedDecimalPlaces).toBe(1);

      const shown = createPivot({ enableWriteBack: true, spec: { ...baseSpec, values: [{ field: 'units', aggregator: 'sum', numberFormat: { maximumFractionDigits: 3 } }, { field: 'amount', aggregator: 'sum', column: { editorFixedDecimalPlaces: 4 } }] } });
      expect(valueColumn(shown.pivot, 'sum:units', ROOT).editorFixedDecimalPlaces).toBe(3);
      expect(valueColumn(shown.pivot, 'sum:amount', ROOT).editorFixedDecimalPlaces).toBe(4);
    });

    it('refuses to edit the read-only cells and the cells with nothing behind them', () => {
      const { pivot, grid } = createPivot({ enableWriteBack: true, spec: writeBackSpec, fields: [...fields.filter((field) => field.id !== 'year'), { id: 'year', type: 'number', predefinedValues: [2023, 2024, 2025] }] });
      const beforeEdit = (row: number, column: Column) => grid.onBeforeEditCell.notify({ row, cell: pivot.getColumns().indexOf(column), item: pivot.rowModel.getItem(row), column, grid } as any).getReturnValue();

      expect(beforeEdit(1, valueColumn(pivot, 'sum:units', '[2023]'))).toBeUndefined();
      expect(beforeEdit(6, valueColumn(pivot, 'sum:units', ROOT))).toBeUndefined();
      expect(beforeEdit(1, valueColumn(pivot, 'sum:amountK', '[2023]'))).toBe(false);
      expect(beforeEdit(1, valueColumn(pivot, 'max:amount', '[2023]'))).toBe(false);
      expect(beforeEdit(1, valueColumn(pivot, 'sum:amount', '[2023]'))).toBe(false);
      // no source row behind China 2025
      expect(beforeEdit(1, valueColumn(pivot, 'sum:units', '[2025]'))).toBe(false);
      expect(beforeEdit(0, pivot.getColumns()[0])).toBe(false);
      expect(beforeEdit(99, valueColumn(pivot, 'sum:units', '[2023]'))).toBe(false);
      // a column the plugin did not generate is the application's business
      expect(grid.onBeforeEditCell.notify({ row: 1, cell: 9, item: pivot.rowModel.getItem(1), column: { id: 'other', field: 'other' }, grid } as any).getReturnValue()).toBeUndefined();

      const plain = createPivot({ spec: writeBackSpec });
      expect(plain.grid.onBeforeEditCell.notify({ row: 1, cell: 2, item: plain.pivot.rowModel.getItem(1), column: valueColumn(plain.pivot, 'sum:amountK', '[2023]'), grid: plain.grid } as any).getReturnValue()).toBeUndefined();
    });

    it('writes a value typed into a cell back to the source rows behind it and raises onWriteBack with their changes', async () => {
      const rows = createRows();
      const { pivot } = createPivot({ enableWriteBack: true, source: rows, spec: writeBackSpec });
      const before = vi.fn();
      const after = vi.fn();
      pivot.onBeforeWriteBack.subscribe(before);
      pivot.onWriteBack.subscribe(after);
      const unitsAt = (rowKey: string, columnKey: string) => pivot.getResult()!.cells[rowKey][columnKey][0];
      const cell = { rowKey: CHINA, columnKey: ROOT, valueId: 'sum:units' };

      await expect(pivot.setCellValue(cell, 60)).resolves.toBe(true);
      expect(rows.map((row) => row.units)).toEqual([15, 45, 5, 20, 8]);
      const args = after.mock.calls[0][1];
      expect(args).toEqual({
        ...cell,
        oldValue: 40,
        newValue: 60,
        method: 'weighted',
        precision: 0,
        value: expect.objectContaining({ id: 'sum:units', field: 'units', aggregator: 'sum' }),
        changes: [{ row: rows[0], field: 'units', oldValue: 10, newValue: 15 }, { row: rows[1], field: 'units', oldValue: 30, newValue: 45 }],
      });
      expect(before.mock.calls[0][1]).toEqual(args);

      // the pivot was computed again: every total follows
      expect(unitsAt(CHINA, ROOT)).toBe(60);
      expect(unitsAt(CHINA, '[2023]')).toBe(15);
      expect(unitsAt(EAST, ROOT)).toBe(65);
      expect(unitsAt(ROOT, ROOT)).toBe(93);
      expect(pivot.rowModel.getItem(1)[valueColumn(pivot, 'sum:units', ROOT).field as string]).toBe(60);

      // whole units: a subtotal cell spreads over the rows of its group
      await expect(pivot.setCellValue({ rowKey: EAST, columnKey: '[2023]', valueId: 'sum:units' }, 25)).resolves.toBe(true);
      expect([rows[0].units, rows[2].units]).toEqual([19, 6]);
      expect(unitsAt(EAST, '[2023]')).toBe(25);

      // the changes can be undone
      await pivot.applyChanges(after.mock.calls[1][1].changes, true);
      expect([rows[0].units, rows[2].units]).toEqual([15, 5]);
      expect(unitsAt(EAST, '[2023]')).toBe(20);
      expect(after).toHaveBeenCalledTimes(2);
    });

    it('cancels the write-back when onBeforeWriteBack returns false, and when nothing can be written', async () => {
      const rows = createRows();
      const { pivot, grid } = createPivot({ enableWriteBack: true, source: rows, spec: writeBackSpec });
      const after = vi.fn();
      pivot.onWriteBack.subscribe(after);
      pivot.onBeforeWriteBack.subscribe((_e, args) => (args.newValue > 1000 ? false : undefined));
      vi.mocked(grid.invalidateAllRows).mockClear();

      await expect(pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'sum:units' }, 5000)).resolves.toBe(false);
      expect(rows.map((row) => row.units)).toEqual([10, 30, 5, 20, 8]);
      expect(after).not.toHaveBeenCalled();
      // the current value is shown again in place of the one typed into the cell
      expect(grid.invalidateAllRows).toHaveBeenCalledTimes(1);

      // read-only values, unknown cells and values, an unchanged total
      await expect(pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'sum:amountK' }, 1)).resolves.toBe(false);
      await expect(pivot.setCellValue({ rowKey: '["North"]', columnKey: ROOT, valueId: 'sum:units' }, 1)).resolves.toBe(false);
      await expect(pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'sum:units' }, 40)).resolves.toBe(false);
      await expect(pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'nope' }, 40)).resolves.toBe(false);
      expect(after).not.toHaveBeenCalled();
      expect(rows.map((row) => row.units)).toEqual([10, 30, 5, 20, 8]);

      const plain = createPivot({ source: rows, spec: writeBackSpec });
      await expect(plain.pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'sum:units' }, 60)).resolves.toBe(false);
    });

    it('writes back the value typed into a grid cell', async () => {
      const rows = createRows();
      const { pivot, grid } = createPivot({ enableWriteBack: true, source: rows, spec: writeBackSpec });
      const after = vi.fn();
      pivot.onWriteBack.subscribe(after);
      const column = valueColumn(pivot, 'sum:units', '[2024]');
      const item = pivot.rowModel.getItem(1);
      // the editor wrote the typed value into the item
      item[column.field as string] = 90;
      grid.onCellChange.notify({ row: 1, cell: pivot.getColumns().indexOf(column), item, column, grid } as any);

      await vi.waitFor(() => expect(after).toHaveBeenCalledTimes(1));
      expect(rows[1].units).toBe(90);
      expect(after.mock.calls[0][1]).toEqual(expect.objectContaining({ rowKey: CHINA, columnKey: '[2024]', valueId: 'sum:units', oldValue: 30, newValue: 90 }));

      // the cells of the other columns are not written back
      grid.onCellChange.notify({ row: 1, cell: 0, item: pivot.rowModel.getItem(1), column: pivot.getColumns()[0], grid } as any);
      await new Promise((resolve) => setTimeout(resolve));
      expect(after).toHaveBeenCalledTimes(1);
    });

    it('tells a DataView source which items changed and follows the changes of its items', async () => {
      vi.useFakeTimers();
      try {
        const dataView = new SlickDataView<SalesRow>({});
        dataView.setItems(createRows());
        const { pivot } = createPivot({ enableWriteBack: true, source: dataView, spec: writeBackSpec });
        const updateItem = vi.spyOn(dataView, 'updateItem');
        expect(pivot.getSource()).toBe(dataView);
        expect(pivot.getSourceRows()).toBe(dataView.getItems());

        await expect(pivot.setCellValue({ rowKey: CHINA, columnKey: ROOT, valueId: 'sum:units' }, 60)).resolves.toBe(true);
        expect(updateItem).toHaveBeenCalledTimes(2);
        expect(updateItem).toHaveBeenCalledWith(1, expect.objectContaining({ units: 15 }));
        expect(updateItem).toHaveBeenCalledWith(2, expect.objectContaining({ units: 45 }));
        expect(dataView.getItemById(2)?.units).toBe(45);

        // a change of the DataView items computes the pivot again after the refresh delay
        const changed = vi.fn();
        pivot.onPivotChanged.subscribe(changed);
        dataView.addItem({ id: 6, region: 'North', country: 'Norway', year: 2024, when: new Date(2024, 0, 1), amount: 10, units: 1 });
        expect(changed).not.toHaveBeenCalled();
        vi.advanceTimersByTime(50);
        expect(changed).toHaveBeenCalledTimes(1);
        expect(pivot.getResult()!.rowTree.children.map((node) => node.label)).toEqual(['East', 'North', 'West']);

        // an array source is only re-pivoted on request
        const rows = createRows();
        await pivot.setSource(rows);
        expect(pivot.getSourceRows()).toBe(rows);
        rows.push({ id: 7, region: 'South', country: 'Chile', year: 2024, when: new Date(2024, 0, 1), amount: 1, units: 1 });
        vi.advanceTimersByTime(50);
        expect(pivot.getResult()!.rowTree.children.map((node) => node.label)).toEqual(['East', 'West']);
        await pivot.refresh();
        expect(pivot.getResult()!.rowTree.children.map((node) => node.label)).toEqual(['East', 'South', 'West']);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('pinned and sticky rows', () => {
    it('resolves the generated rows by id for the grid docking', () => {
      const { pivot } = createPivot();

      expect(SlickPivot.getRowId('grandTotal')).toBe('grandTotal:[]');
      expect(SlickPivot.getRowId('group', ['East'])).toBe('group:["East"]');
      expect(SlickPivot.getRowId('leaf', ['East', 'China'])).toBe('leaf:["East","China"]');
      expect(SlickPivot.getRowId('subtotal', [2023])).toBe('subtotal:[2023]');
      expect(pivot.rowModel.getRowById('grandTotal:[]')).toBe(6);
      expect(pivot.rowModel.getRowById('group:["West"]')).toBe(3);
      expect(pivot.rowModel.getRowById('leaf:["East","China"]')).toBe(1);
      expect(pivot.rowModel.getRowById('nope')).toBeUndefined();

      pivot.collapseRow(EAST);
      expect(pivot.rowModel.getRowById('group:["West"]')).toBe(1);
      expect(pivot.rowModel.getRowById('leaf:["East","China"]')).toBeUndefined();

      // the ids survive a new computation
      pivot.updateSpec({ filters: [{ field: 'region', exclude: ['East'] }] });
      expect(pivot.rowModel.getRowById('group:["West"]')).toBe(0);
      expect(pivot.rowModel.getRowById('grandTotal:[]')).toBe(3);
    });

    it('sticks the grand total row to its edge by default, joining the sticky rows of the application', () => {
      const { pivot, grid, gridOptions } = createPivot({}, { stickyRows: { top: ['group:["East"]'] }, pinning: { rows: { top: [0] } } });

      expect(gridOptions.stickyRows).toEqual({ top: ['group:["East"]'], bottom: ['grandTotal:[]'], both: [] });
      expect(gridOptions.pinning?.rows).toEqual({ top: [0] });
      expect(grid.setOptions).toHaveBeenCalledWith({ stickyRows: { top: ['group:["East"]'], bottom: ['grandTotal:[]'], both: [] } }, true, true);
      vi.mocked(grid.setOptions).mockClear();

      // nothing is set again while nothing changes
      pivot.collapseRow(EAST);
      expect(grid.setOptions).not.toHaveBeenCalled();

      // a grand total row at the top sticks to the top
      pivot.updateSpec({ grandTotals: { rows: 'top' } });
      expect(gridOptions.stickyRows).toEqual({ top: ['group:["East"]', 'grandTotal:[]'], bottom: [], both: [] });

      // without a grand total row, nothing is docked
      pivot.updateSpec({ grandTotals: { rows: false } });
      expect(gridOptions.stickyRows).toEqual({ top: ['group:["East"]'], bottom: [], both: [] });
      expect(gridOptions.pinning?.rows).toEqual({ top: [0] });
    });

    it('pins the grand total row with pinGrandTotalRow: true and releases it when turned off', async () => {
      const { pivot, gridOptions } = createPivot({ pinGrandTotalRow: true }, { pinning: { rows: { bottom: [{ id: 'leaf:["West","Spain"]' }] } }, stickyRows: { both: ['group:["West"]'] } });

      expect(gridOptions.pinning?.rows).toEqual({ top: [], bottom: [{ id: 'leaf:["West","Spain"]' }, 'grandTotal:[]'] });
      expect(gridOptions.stickyRows).toEqual({ both: ['group:["West"]'] });

      await pivot.setOptions({ pinGrandTotalRow: 'sticky' });
      expect(gridOptions.pinning?.rows).toEqual({ top: [], bottom: [{ id: 'leaf:["West","Spain"]' }] });
      expect(gridOptions.stickyRows).toEqual({ top: [], bottom: ['grandTotal:[]'], both: ['group:["West"]'] });

      await pivot.setOptions({ pinGrandTotalRow: false });
      expect(gridOptions.pinning?.rows).toEqual({ top: [], bottom: [{ id: 'leaf:["West","Spain"]' }] });
      expect(gridOptions.stickyRows).toEqual({ top: [], bottom: [], both: ['group:["West"]'] });

      // a reference in the object form to the grand total row is the plugin's too
      gridOptions.pinning!.rows!.top = [{ id: 'grandTotal:[]' }, 1];
      await pivot.setOptions({ pinGrandTotalRow: true });
      expect(gridOptions.pinning?.rows).toEqual({ top: [1], bottom: [{ id: 'leaf:["West","Spain"]' }, 'grandTotal:[]'] });
    });

    it('does not dock the grand total row of a pivot without row fields, nor one that is the only row', () => {
      const alone = createPivot({ spec: { ...baseSpec, rows: [] } });
      expect(alone.gridOptions.stickyRows).toBeUndefined();
      expect(alone.gridOptions.pinning?.rows).toBeUndefined();

      const empty = createPivot({ pinGrandTotalRow: true, spec: { ...baseSpec, filters: [{ field: 'region', include: ['Nowhere'] }] } });
      expect(empty.pivot.rowModel.getLength()).toBe(1);
      expect(empty.gridOptions.pinning?.rows).toBeUndefined();
    });
  });

  describe('pinned and sticky columns', () => {
    it('pins the row label columns to the leading edge, and the grand total columns on request', async () => {
      const { pivot, gridOptions, preHeaderPanel } = createPivot();
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: [] });
      expect(preHeaderPanel.querySelector('.slick-pivot-header-group-right')).toBeNull();

      await pivot.setOptions({ pinGrandTotalColumns: true });
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: ['__pv_2'] });
      expect(preHeaderPanel.querySelector('.slick-pivot-header-group-right')).toBeTruthy();

      await pivot.updateSpec({ grandTotals: { columns: 'start' } });
      expect(pivot.getColumns().map((column) => column.name)).toEqual(['Row Labels', 'Grand Total', '2023', '2024']);
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows', '__pv_0'], right: [] });

      await pivot.updateSpec({ layout: 'outline' });
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_row_0', '__pivot_row_1', '__pv_0'], right: [] });

      await pivot.setOptions({ pinRowHeaders: false, pinGrandTotalColumns: false });
      expect(gridOptions.pinning?.columns).toEqual({ left: [], right: [] });
    });

    it('leaves the application pinning of a band it does not use alone, and the centre band room to scroll', () => {
      const { gridOptions } = createPivot({}, { pinning: { columns: { right: ['other'] } } });
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: ['other'] });

      // the pinned columns may not take more than the docking budget of the grid width
      const narrow = createPivot({ pinGrandTotalColumns: true }, {}, 300);
      expect(narrow.gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: [] });
      const wide = createPivot({ pinGrandTotalColumns: true }, {}, 1000);
      expect(wide.gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: ['__pv_2'] });

      // there must be a column left to scroll: without column items, only the grand total column remains
      const single = createPivot({ pinGrandTotalColumns: true }, {}, 1000);
      single.pivot.updateSpec({ filters: [{ field: 'region', include: ['Nowhere'] }] });
      expect(single.pivot.getColumns().map((column) => column.id)).toEqual(['__pivot_rows', '__pv_0']);
      expect(single.gridOptions.pinning?.columns).toEqual({ left: [], right: [] });
      single.pivot.updateSpec({ filters: [] });
      expect(single.gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: ['__pv_2'] });
    });

    it('makes the grand total columns sticky with pinGrandTotalColumns: "sticky"', async () => {
      const { pivot, gridOptions, preHeaderPanel } = createPivot({ pinGrandTotalColumns: 'sticky', spec: { ...baseSpec, values: [{ field: 'amount', aggregator: 'sum' }, { field: 'units', aggregator: 'sum' }] } });
      const sticky = () => pivot.getColumns().filter((column) => column.sticky).map((column) => [column.id, column.sticky]);

      expect(sticky()).toEqual([['__pv_4', 'right'], ['__pv_5', 'right']]);
      expect(gridOptions.pinning?.columns).toEqual({ left: ['__pivot_rows'], right: [] });
      expect(preHeaderPanel.querySelectorAll('.slick-pivot-header-group-sticky')).toHaveLength(2);

      await pivot.updateSpec({ grandTotals: { columns: 'start' } });
      expect(sticky()).toEqual([['__pv_0', 'left'], ['__pv_1', 'left']]);

      // without column fields the value columns are the grand totals: nothing to stick
      await pivot.updateSpec({ columns: [] });
      expect(sticky()).toEqual([]);
    });
  });

  describe('data providers', () => {
    const engine = new PivotEngine({ fields });

    it('sends a serializable request to the provider, renders its result and goes through it for the items, the drill-down and the write-back', async () => {
      const provider = {
        execute: vi.fn(async (_request: PivotRequest, context: { spec: PivotSpec; }) => engine.execute(createRows(), context.spec)),
        getItems: vi.fn(async () => [{ value: 'East', label: 'East', count: 3 }]),
        getSourceRows: vi.fn(async () => ['row']),
        writeBack: vi.fn(async () => undefined),
      };
      const loading = vi.fn();
      const { pivot, container } = createPivot({
        provider,
        enableWriteBack: true,
        spec: { ...baseSpec, filters: [{ field: 'region', predicate: () => true }], measures: [{ id: 'm', label: 'M', compute: () => 1, column: { width: 50 } }] },
      });
      pivot.onLoadingChanged.subscribe(loading);

      expect(pivot.isLoading()).toBe(true);
      expect(container.classList.contains('slick-pivot-loading')).toBe(true);
      expect(pivot.rowModel.getLength()).toBe(0);
      await vi.waitFor(() => expect(pivot.isLoading()).toBe(false));
      expect(container.classList.contains('slick-pivot-loading')).toBe(false);
      expect(loading.mock.calls.map((call) => call[1])).toEqual([{ loading: false }]);
      expect(pivot.rowModel.getLength()).toBe(7);
      expect(pivot.rowModel.getItem(6)[valueColumn(pivot, 'sum:amount', ROOT).field as string]).toBe(730);
      // the measure keeps its local template, although the request leaves it out
      expect(pivot.rowModel.getItem(6)[valueColumn(pivot, 'm', ROOT).field as string]).toBe(1);
      expect(valueColumn(pivot, 'm', ROOT).width).toBe(50);

      const [request, context] = provider.execute.mock.calls[0] as any;
      expect(context.signal).toBeInstanceOf(AbortSignal);
      expect(context.spec).toBe(pivot.getSpec());
      expect(request.spec.filters).toEqual([{ field: 'region' }]);
      expect(request.spec.measures).toEqual([{ id: 'm', label: 'M' }]);
      expect(request.fields.find((field: PivotField) => field.id === 'amountK')).toEqual({ id: 'amountK', label: 'Amount (K)', type: 'number' });
      expect(JSON.parse(JSON.stringify(request))).toEqual(request);

      // the level fields of the date hierarchies the spec uses tell the server how to derive them
      await pivot.updateSpec({ columns: ['when.year'] });
      const withDates = provider.execute.mock.calls[1][0];
      expect(withDates.fields.filter((field) => field.dateLevel)).toEqual([{ id: 'when.year', label: 'Years (When)', type: 'number', dateLevel: { field: 'when', level: 'year' } }]);
      expect(pivot.getColumns().slice(1).map((column) => column.columnGroup)).toEqual(['2023', '2023', '2024', '2024', 'Grand Total', 'Grand Total']);

      expect(await pivot.getFieldItems('region', 'ea')).toEqual([{ value: 'East', label: 'East', count: 3 }]);
      expect(provider.getItems).toHaveBeenCalledWith('region', expect.objectContaining({ search: 'ea' }));
      expect(await pivot.getCellSourceRows(EAST, ROOT)).toEqual(['row']);
      expect(provider.getSourceRows).toHaveBeenCalledWith(expect.objectContaining({ spec: expect.anything() }), EAST, ROOT);

      expect(pivot.isValueEditable('sum:amount')).toBe(true);
      await expect(pivot.setCellValue({ rowKey: EAST, columnKey: ROOT, valueId: 'sum:amount' }, 1)).resolves.toBe(true);
      expect(provider.writeBack).toHaveBeenCalledWith(expect.objectContaining({ spec: expect.anything() }), { rowKey: EAST, columnKey: ROOT, valueId: 'sum:amount', oldValue: 450, newValue: 1, method: 'weighted', precision: undefined });
      expect(provider.execute).toHaveBeenCalledTimes(3);
    });

    it('cannot write back or drill down through a provider that does not support it', async () => {
      const provider = { execute: vi.fn(async (request: PivotRequest) => engine.execute(createRows(), request.spec)) };
      const { pivot } = createPivot({ provider, enableWriteBack: true });
      await vi.waitFor(() => expect(pivot.isLoading()).toBe(false));
      expect(pivot.isValueEditable('sum:amount')).toBe(false);
      expect(await pivot.getCellSourceRows(EAST, ROOT)).toEqual([]);
      // the local engine lists the items
      expect(await pivot.getFieldItems('region')).toEqual([{ value: 'East', label: 'East', count: 3 }, { value: 'West', label: 'West', count: 2 }]);
    });

    it('aborts a superseded request and reports a failing provider', async () => {
      let calls = 0;
      const provider = {
        execute: vi.fn((request: PivotRequest, { signal }: { signal: AbortSignal; }) => new Promise<PivotResult>((resolve, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
          if (++calls > 1) {
            resolve(engine.execute(createRows(), request.spec));
          }
        })),
      };
      const error = vi.fn();
      const { pivot } = createPivot({ provider });
      pivot.onPivotError.subscribe(error);
      await pivot.refresh();

      expect(provider.execute).toHaveBeenCalledTimes(2);
      expect((provider.execute.mock.calls[0][1] as any).signal.aborted).toBe(true);
      expect(pivot.rowModel.getLength()).toBe(7);
      expect(error).not.toHaveBeenCalled();

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      await pivot.setOptions({ provider: { execute: () => Promise.reject(new Error('boom')) } });
      expect(error.mock.calls[0][1].error.message).toBe('boom');
      expect(pivot.isLoading()).toBe(false);
      expect(consoleError).toHaveBeenCalledWith('[SlickPivot] the pivot provider failed', expect.any(Error));

      // the write-back of the provider can fail too
      const failing = { execute: provider.execute, writeBack: () => Promise.reject(new Error('nope')) };
      await pivot.setOptions({ provider: failing, enableWriteBack: true });
      await expect(pivot.setCellValue({ rowKey: EAST, columnKey: ROOT, valueId: 'sum:amount' }, 1)).resolves.toBe(false);
      expect(error.mock.calls[1][1].error.message).toBe('nope');

      // back to the local engine
      await pivot.setOptions({ provider: undefined });
      expect(pivot.rowModel.getLength()).toBe(7);
    });
  });

  describe('spec, source and events', () => {
    it('raises onSpecChanged and onPivotChanged, and lets onBeforePivot cancel a computation', () => {
      const { pivot } = createPivot();
      const specChanged = vi.fn();
      const pivotChanged = vi.fn();
      pivot.onSpecChanged.subscribe(specChanged);
      pivot.onPivotChanged.subscribe(pivotChanged);

      pivot.updateSpec({ layout: 'outline' });
      expect(specChanged.mock.calls[0][1]).toEqual({ spec: expect.objectContaining({ layout: 'outline', rows: ['region', 'country'] }), previousSpec: expect.objectContaining({ layout: 'compact' }) });
      expect(pivotChanged.mock.calls[0][1]).toEqual({ spec: pivot.getSpec(), result: pivot.getResult() });
      expect(pivot.getSpec()).toEqual(expect.objectContaining({ layout: 'outline', subtotals: 'top', maxColumns: 1000 }));

      pivot.onBeforePivot.subscribe(() => false);
      pivot.setSpec({ rows: ['region'], columns: [], values: [] });
      expect(specChanged).toHaveBeenCalledTimes(2);
      expect(pivotChanged).toHaveBeenCalledTimes(1);
      expect(pivot.getSpec().rows).toEqual(['region']);
    });

    it('replaces the fields, dropping the ones the spec no longer knows, and loads another dataset', async () => {
      const { pivot } = createPivot({ spec: { ...baseSpec, filters: [{ field: 'country', exclude: ['Spain'] }], sort: [{ field: 'country', direction: 'desc' }, { field: 'region', direction: 'desc' }] } });
      pivot.collapseRow(EAST);
      pivot.getColumns()[1].width = 150;
      pivot.getGrid()!.onColumnsResized.notify({ triggeredByColumn: '__pv_0', grid: pivot.getGrid() } as any);

      await pivot.setFields([{ id: 'region' }, { id: 'when', type: 'date' }, { id: 'units', type: 'number' }, { id: 'amount', type: 'number' }]);
      expect(pivot.getFields().map((field) => field.id)).toEqual(['region', 'when', 'units', 'amount']);
      expect(pivot.getSpec()).toEqual(expect.objectContaining({ rows: ['region'], columns: [], filters: [], sort: [{ field: 'region', direction: 'desc' }] }));
      expect(pivot.getSpec().values).toEqual([expect.objectContaining({ field: 'amount' })]);
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_rows)).toEqual(['West', 'East', 'Grand Total']);
      // the level fields of a date hierarchy are known
      await pivot.updateSpec({ columns: ['when.year'] });
      await pivot.setFields([{ id: 'region' }, { id: 'when', type: 'date' }, { id: 'amount', type: 'number' }]);
      expect(pivot.getSpec().columns).toEqual(['when.year']);
      expect(pivot.inferFieldType('when')).toBe('date');
      expect(pivot.inferFieldType('region')).toBe('string');

      await pivot.load({ fields, source: createRows().slice(0, 3), spec: baseSpec });
      expect(pivot.isRowCollapsed(EAST)).toBe(false);
      expect(pivot.rowModel.getItems().map((row) => row.__pivot_rows)).toEqual(['East', 'China', 'Japan', 'Grand Total']);
      expect(pivot.getColumns()[1].width).toBe(100);
      expect(pivot.getOptions().fields).toBe(fields);
    });

    it('remembers the widths the user resized across the layouts', () => {
      const { pivot, grid } = createPivot();
      pivot.getColumns()[1].width = 150;
      pivot.getColumns()[0].width = 200;
      grid.onColumnsResized.notify({ triggeredByColumn: '__pv_0', grid } as any);

      pivot.updateSpec({ layout: 'outline', subtotals: 'bottom' });
      expect(valueColumn(pivot, 'sum:amount', '[2023]').width).toBe(150);
      expect(valueColumn(pivot, 'sum:amount', '[2024]').width).toBe(100);
      // the compact row labels column and the outline ones are different columns
      expect(pivot.getColumns()[0].width).not.toBe(200);
      pivot.updateSpec({ layout: 'compact' });
      expect(pivot.getColumns()[0].width).toBe(200);
      // another value under the same item is another column
      pivot.updateSpec({ values: [{ field: 'units', aggregator: 'sum' }, { field: 'amount', aggregator: 'sum' }] });
      expect(valueColumn(pivot, 'sum:amount', '[2023]').width).toBe(100);
    });

    it('reports a computation error and a truncated column tree', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { pivot } = createPivot();
      const error = vi.fn();
      const truncated = vi.fn();
      pivot.onPivotError.subscribe(error);
      pivot.onPivotTruncated.subscribe(truncated);

      pivot.updateSpec({ rows: ['nope'] });
      expect(error.mock.calls[0][1].error.message).toBe('[PivotEngine] unknown field "nope"');
      expect(consoleError).toHaveBeenCalled();
      // the previous result stays
      expect(pivot.rowModel.getLength()).toBe(7);

      pivot.updateSpec({ rows: ['region'], columns: ['country'], maxColumns: 2 });
      expect(truncated.mock.calls[0][1].result.truncated).toEqual({ columns: 4, maxColumns: 2 });
      expect(pivot.getColumns().map((column) => column.name)).toEqual(['Row Labels', 'China', 'France', 'Grand Total']);
    });

    it('sorts the rows from the column headers, by value or by caption', async () => {
      const { pivot, grid } = createPivot();
      const rowLabels = () => pivot.rowModel.getItems().map((row) => row.__pivot_rows);

      grid.onSort.notify({ sortCol: pivot.getColumns()[3], sortAsc: true, grid } as any);
      await vi.waitFor(() => expect(grid.setSortColumns).toHaveBeenCalledWith([{ columnId: '__pv_2', sortAsc: true }]));
      expect(pivot.getSpec().sort).toEqual([
        { field: 'region', direction: 'asc', by: { valueId: 'sum:amount', columnKey: ROOT } },
        { field: 'country', direction: 'asc', by: { valueId: 'sum:amount', columnKey: ROOT } },
      ]);
      expect(rowLabels()).toEqual(['West', 'Spain', 'France', 'East', 'Japan', 'China', 'Grand Total']);

      // the row labels header sorts the items by caption
      grid.onSort.notify({ sortCols: [{ sortCol: pivot.getColumns()[0], sortAsc: false }], grid } as any);
      await vi.waitFor(() => expect(grid.setSortColumns).toHaveBeenLastCalledWith([{ columnId: '__pivot_rows', sortAsc: false }]));
      expect(pivot.getSpec().sort).toEqual([{ field: 'region', direction: 'desc' }, { field: 'country', direction: 'desc' }]);
      expect(rowLabels()).toEqual(['West', 'Spain', 'France', 'East', 'Japan', 'China', 'Grand Total']);

      // the sort indicator follows the column of the same meaning after the columns are rebuilt
      await pivot.updateSpec({ columns: [] });
      expect(grid.setSortColumns).toHaveBeenLastCalledWith([{ columnId: '__pivot_rows', sortAsc: false }]);
      // a column the plugin does not know is ignored
      vi.mocked(grid.setSortColumns).mockClear();
      grid.onSort.notify({ sortCol: { id: 'other' }, sortAsc: true, grid } as any);
      await new Promise((resolve) => setTimeout(resolve));
      expect(grid.setSortColumns).not.toHaveBeenCalled();

      const unsortable = createPivot({ enableSorting: false });
      expect(unsortable.pivot.getColumns().every((column) => !column.sortable)).toBe(true);
    });

    it('drills down to the source rows of a cell on double-click', async () => {
      const rows = createRows();
      const { pivot, grid } = createPivot({ source: rows });
      const drill = vi.fn();
      pivot.onPivotCellDrillDown.subscribe(drill);

      grid.onDblClick.notify({ row: 1, cell: 1, grid } as any);
      await vi.waitFor(() => expect(drill).toHaveBeenCalledTimes(1));
      expect(drill.mock.calls[0][1]).toEqual({ rowKey: CHINA, columnKey: '[2023]', valueId: 'sum:amount', rowPath: { region: 'East', country: 'China' }, columnPath: { year: 2023 }, rows: [rows[0]] });

      // a row label cell drills into the row total
      grid.onDblClick.notify({ row: 0, cell: 0, grid } as any);
      await vi.waitFor(() => expect(drill).toHaveBeenCalledTimes(2));
      expect(drill.mock.calls[1][1]).toEqual(expect.objectContaining({ rowKey: EAST, columnKey: ROOT, valueId: undefined, rowPath: { region: 'East' }, columnPath: {}, rows: rows.slice(0, 3) }));

      await pivot.setOptions({ enableDrillDown: false });
      grid.onDblClick.notify({ row: 1, cell: 1, grid } as any);
      await new Promise((resolve) => setTimeout(resolve));
      expect(drill).toHaveBeenCalledTimes(2);
    });

    it('warns when the grid has no pre-header panel and when no editor is available', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const mock = createMockGrid();
      vi.mocked(mock.grid.getPreHeaderPanel).mockReturnValue(undefined as any);
      const pivot = new SlickPivot({ fields, source: createRows(), spec: baseSpec, enableWriteBack: true, columnDefaults: { editor: null as any } });
      created.push(pivot);
      pivot.init(mock.grid);
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('[SlickPivot] the column group headers need a pre-header panel'));
      expect(pivot.getColumns()[1].editor).toBe(Editors.Float);
    });

    it('cleans up the grid on destroy', () => {
      const { pivot, grid, container, preHeaderPanel } = createPivot();
      expect(preHeaderPanel.children.length).toBeGreaterThan(0);
      expect(grid.onClick.subscriberCount).toBe(1);

      pivot.destroy();
      created.pop();
      expect(container.classList.contains('slick-pivot')).toBe(false);
      expect(preHeaderPanel.children).toHaveLength(0);
      expect(preHeaderPanel.classList.contains('slick-pivot-header-groups')).toBe(false);
      expect(grid.onClick.subscriberCount).toBe(0);
      expect(grid.onCellChange.subscriberCount).toBe(0);
      expect(pivot.onPivotChanged.subscriberCount).toBe(0);
    });
  });
});
