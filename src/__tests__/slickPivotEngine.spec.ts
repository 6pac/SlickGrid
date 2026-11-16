import { describe, expect, it } from 'vitest';
import type { Aggregator, PivotAggregator, PivotAggregatorContext, PivotField, PivotFilter, PivotHeaderNode, PivotMeasureContext, PivotSpec } from '../models';
import { PIVOT_DATE_LEVELS, PIVOT_VALUES_FIELD, PivotAggregators, PivotEngine } from '../slick.pivotengine';

/** Key of the root (grand total) node of both header trees */
const ROOT = '[]';

interface SalesRow {
  region: string;
  country: string;
  year: number;
  quarter: string;
  amount: number | null;
  units: number;
  order: string;
}

const sales: SalesRow[] = [
  { region: 'East', country: 'China', year: 2023, quarter: 'Q1', amount: 100, units: 10, order: 'A' },
  { region: 'East', country: 'China', year: 2024, quarter: 'Q2', amount: 300, units: 30, order: 'A' },
  { region: 'East', country: 'Japan', year: 2023, quarter: 'Q2', amount: 50, units: 5, order: 'B' },
  { region: 'West', country: 'France', year: 2024, quarter: 'Q1', amount: 200, units: 20, order: 'A' },
  { region: 'West', country: 'Spain', year: 2023, quarter: 'Q1', amount: null, units: 8, order: 'C' },
];

const salesFields: PivotField[] = [
  { id: 'region', label: 'Region' },
  { id: 'country' },
  { id: 'year', type: 'number' },
  { id: 'quarter', predefinedValues: ['Q1', 'Q2', 'Q3', 'Q4'] },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'units', type: 'number' },
  { id: 'order' },
];

const builtInIds = ['sum', 'count', 'countNumbers', 'distinctCount', 'avg', 'max', 'min', 'product', 'stdDev', 'stdDevP', 'var', 'varP', 'median', 'first', 'last'];

/** Key of a header node from the item values of its path */
const key = (...values: any[]) => PivotEngine.getNodeKey(values);

/** Captions of a header tree, every group as `[label, children]` */
const labels = (node: PivotHeaderNode): any[] => node.children.map((child) => (child.children.length ? [child.label, labels(child)] : child.label));

describe('PivotEngine', () => {
  describe('aggregators', () => {
    const rows = [{ g: 'a', v: 1 }, { g: 'a', v: 3 }, { g: 'a', v: '5' }, { g: 'a', v: null }, { g: 'b', v: 2 }];

    it('computes every built-in aggregator from the source rows, ignoring blanks and parsing numeric strings', () => {
      expect(PivotAggregators.builtIn.map((aggregator) => aggregator.id)).toEqual(builtInIds);
      expect(PivotAggregators.get('avg')?.label).toBe('Average');
      expect(PivotAggregators.get('nope')).toBeUndefined();

      const engine = new PivotEngine({ fields: [{ id: 'g' }, { id: 'v' }] });
      const result = engine.execute(rows, { rows: [], columns: [], values: builtInIds.map((aggregator) => ({ field: 'v', aggregator })) });
      const byId = Object.fromEntries(builtInIds.map((id, i) => [id, result.cells[ROOT][ROOT][i]]));

      expect(byId).toEqual({
        sum: 11,
        count: 4,
        countNumbers: 4,
        distinctCount: 4,
        avg: 2.75,
        max: 5,
        min: 1,
        product: 30,
        stdDev: expect.closeTo(Math.sqrt(8.75 / 3), 9),
        stdDevP: expect.closeTo(Math.sqrt(2.1875), 9),
        var: expect.closeTo(8.75 / 3, 9),
        varP: expect.closeTo(2.1875, 9),
        median: 2.5,
        first: 1,
        last: 2,
      });
      expect(result.values.slice(0, 2)).toEqual([
        { id: 'sum:v', label: 'Sum of v', field: 'v', aggregator: 'sum', hidden: false, showAs: undefined, resultType: 'number' },
        { id: 'count:v', label: 'Count of v', field: 'v', aggregator: 'count', hidden: false, showAs: undefined, resultType: 'number' },
      ]);
      expect(result.values.find((value) => value.id === 'max:v')?.resultType).toBe('same');
    });

    it('gives empty results to the aggregators that have nothing to aggregate', () => {
      const engine = new PivotEngine({ fields: [{ id: 'v' }] });
      const result = engine.execute([{ v: null }, { v: '' }], { rows: [], columns: [], values: builtInIds.map((aggregator) => ({ field: 'v', aggregator })) });
      const byId = Object.fromEntries(builtInIds.map((id, i) => [id, result.cells[ROOT][ROOT][i]]));
      expect(byId).toEqual({ sum: 0, count: 0, countNumbers: 0, distinctCount: 0, avg: null, max: null, min: null, product: null, stdDev: null, stdDevP: null, var: null, varP: null, median: null, first: null, last: null });
    });

    it('computes sum, count, average and distinct count per cell of the row and column fields', () => {
      const engine = new PivotEngine({ fields: salesFields });
      const result = engine.execute(sales, {
        rows: ['region'],
        columns: ['year'],
        values: [
          { field: 'amount', aggregator: 'sum' },
          { field: 'amount', aggregator: 'count' },
          { field: 'amount', aggregator: 'avg' },
          { field: 'order', aggregator: 'distinctCount' },
        ],
      });
      expect(result.values.map((value) => value.id)).toEqual(['sum:amount', 'count:amount', 'avg:amount', 'distinctCount:order']);
      expect(result.cells[key('East')]['[2023]']).toEqual([150, 2, 75, 2]);
      expect(result.cells[key('East')]['[2024]']).toEqual([300, 1, 300, 1]);
      expect(result.cells[key('West')]['[2024]']).toEqual([200, 1, 200, 1]);
      // Spain 2023 has a blank amount: it is counted in no aggregator but its order is
      expect(result.cells[key('West')]['[2023]'].slice(1)).toEqual([0, null, 1]);
    });

    it('registers custom aggregators, which receive the source row and the aggregation context', () => {
      const contexts: PivotAggregatorContext[] = [];
      const weightedDiscount: PivotAggregator<{ weighted: number; quantity: number; }, number | null> = {
        id: 'weightedDiscount',
        label: 'Weighted Avg',
        numericOnly: true,
        init: () => ({ weighted: 0, quantity: 0 }),
        accumulate: (state, discount, row, context) => {
          contexts.push(context);
          state.weighted += discount * row.quantity;
          state.quantity += row.quantity;
          return state;
        },
        result: (state) => (state.quantity ? state.weighted / state.quantity : null),
      };
      const engine = new PivotEngine({ fields: [{ id: 'discount', label: 'Discount' }, { id: 'quantity' }], aggregators: { weightedDiscount } });
      const result = engine.execute([{ discount: 0.1, quantity: 10 }, { discount: 0.3, quantity: 30 }], {
        rows: [],
        columns: [],
        values: [{ id: 'disc', field: 'discount', aggregator: 'weightedDiscount' }],
      });

      expect(result.cells[ROOT][ROOT][0]).toBeCloseTo(0.25, 10);
      expect(result.values[0]).toEqual(expect.objectContaining({ id: 'disc', label: 'Weighted Avg of Discount', aggregator: 'weightedDiscount' }));
      expect(contexts).toHaveLength(2);
      expect(contexts[0]).toEqual({ fieldId: 'discount', sourceField: 'discount', valueId: 'disc' });
      expect(engine.getAggregators().map((aggregator) => aggregator.id)).toEqual([...builtInIds, 'weightedDiscount']);
      expect(engine.getAggregator('weightedDiscount')?.label).toBe('Weighted Avg');

      // the id of the registry wins over the one of the definition
      engine.registerAggregator({ ...weightedDiscount, id: 'other' });
      expect(engine.getAggregator('other')?.label).toBe('Weighted Avg');
      expect(() => engine.execute([], { rows: [], columns: [], values: [{ field: 'discount', aggregator: 'nope' }] })).toThrow('[PivotEngine] unknown aggregator "nope"');
      expect(() => engine.execute([], { rows: ['nope'], columns: [], values: [] })).toThrow('[PivotEngine] unknown field "nope"');
    });

    it('wraps reducer functions and DataView aggregator classes', () => {
      class MaxLengthAggregator implements Aggregator {
        type = 'maxLength';
        max = 0;
        constructor(public field: string) {}
        init() {
          this.max = 0;
        }
        accumulate(item: any) {
          this.max = Math.max(this.max, String(item[this.field]).length);
        }
        storeResult(totals: any) {
          totals[this.type] = totals[this.type] || {};
          totals[this.type][this.field] = this.max;
        }
      }
      const aggregators = {
        ratioSum: PivotAggregators.fromReducer('ratioSum', 'Ratio Sum', (row: any, current: number | undefined) => (current || 0) + row.a / row.b, { numericOnly: true }),
        maxLength: PivotAggregators.fromDataViewAggregator('maxLength', 'Max Length', MaxLengthAggregator as any),
      };
      expect(aggregators.ratioSum).toEqual(expect.objectContaining({ id: 'ratioSum', label: 'Ratio Sum', numericOnly: true }));

      const engine = new PivotEngine({ fields: [{ id: 'a' }, { id: 's' }], aggregators });
      const rows = [{ a: 1, b: 2, s: 'ab' }, { a: 3, b: 4, s: 'abcd' }];
      const result = engine.execute(rows, { rows: [], columns: [], values: [{ field: 'a', aggregator: 'ratioSum' }, { field: 's', aggregator: 'maxLength' }] });
      expect(result.cells[ROOT][ROOT]).toEqual([1.25, 4]);

      // a DataView aggregator that saw no row has no result, and no cell exists without source rows
      expect(aggregators.maxLength.result(aggregators.maxLength.init())).toBeNull();
      const empty = engine.execute([], { rows: [], columns: [], values: [{ field: 's', aggregator: 'maxLength' }] });
      expect(empty.cells).toEqual({});
      expect(empty.rowTree.sourceRowCount).toBe(0);
    });
  });

  describe('filters', () => {
    const rows = [{ c: 'x', n: 1 }, { c: 'y', n: 2 }, { c: 'z', n: 3 }, { c: 'x', n: 4 }];
    const engine = new PivotEngine({ fields: [{ id: 'c' }, { id: 'n' }] });
    const run = (filters: PivotFilter[]) => engine.execute(rows, { rows: ['c'], columns: [], values: [{ field: 'n', aggregator: 'sum' }], filters });
    const items = (filters: PivotFilter[]) => run(filters).rowTree.children.map((node) => node.label);

    it('keeps the included items and removes the excluded ones', () => {
      const included = run([{ field: 'c', include: ['x'] }]);
      expect(included.sourceRowCount).toBe(4);
      expect(included.filteredRowCount).toBe(2);
      expect(included.rowTree.children.map((node) => node.label)).toEqual(['x']);
      expect(included.rowTree.sourceRowCount).toBe(2);
      expect(included.cells[ROOT][ROOT]).toEqual([5]);

      expect(items([{ field: 'c', exclude: ['x'] }])).toEqual(['y', 'z']);
      expect(items([{ field: 'c', include: ['x', 'z'], exclude: ['z'] }])).toEqual(['x']);
      expect(items([{ field: 'c', include: [] }])).toEqual([]);

      // an "(All)" entry and the filter of an unknown field keep every row
      expect(run([{ field: 'c' }, { field: 'unknown', include: ['x'] }]).filteredRowCount).toBe(4);
    });

    it('filters the items by caption and with a predicate', () => {
      expect(items([{ field: 'c', label: { operator: 'beginsWith', value: 'Y' } }])).toEqual(['y']);
      expect(items([{ field: 'c', label: { operator: 'notEquals', value: 'x' } }])).toEqual(['y', 'z']);
      expect(items([{ field: 'c', label: { operator: 'contains', value: '' } }])).toEqual(['x', 'y', 'z']);
      expect(items([{ field: 'n', predicate: (value: number) => value > 1 }])).toEqual(['x', 'y', 'z']);
      expect(run([{ field: 'n', predicate: (value: number, row: any) => value > 1 && row.c !== 'x' }]).filteredRowCount).toBe(2);
    });

    it('keeps the top or bottom N items ranked by the grand total of a value, over the rows the other filters kept', () => {
      expect(items([{ field: 'c', top: { count: 1, valueId: 'sum:n' } }])).toEqual(['x']);
      expect(items([{ field: 'c', top: { count: 2, valueId: 'sum:n' } }])).toEqual(['x', 'z']);
      expect(items([{ field: 'c', top: { count: 1, valueId: 'sum:n', direction: 'bottom' } }])).toEqual(['y']);
      expect(items([{ field: 'c', exclude: ['x'] }, { field: 'c', top: { count: 1, valueId: 'sum:n' } }])).toEqual(['z']);
      expect(run([{ field: 'c', top: { count: 0, valueId: 'sum:n' } }]).filteredRowCount).toBe(0);
      // the filter is ignored when the value does not exist
      expect(run([{ field: 'c', top: { count: 1, valueId: 'nope' } }]).filteredRowCount).toBe(4);
    });

    it('matches date items by their time and accepts their serialized form', () => {
      const dates = [{ d: new Date(2024, 0, 2), v: 1 }, { d: new Date(2024, 0, 2), v: 2 }, { d: new Date(2024, 0, 3), v: 4 }];
      const dateEngine = new PivotEngine({ fields: [{ id: 'd', type: 'date' }, { id: 'v' }] });
      const spec = (filters: PivotFilter[]): Partial<PivotSpec> => ({ rows: ['d'], columns: [], values: [{ field: 'v', aggregator: 'sum' }], filters });
      const serialized = JSON.parse(JSON.stringify(new Date(2024, 0, 2)));

      const result = dateEngine.execute(dates, spec([{ field: 'd', include: [serialized] }]));
      expect(result.rowTree.children).toHaveLength(1);
      expect(result.cells[result.rowTree.children[0].key][ROOT]).toEqual([3]);
      expect(dateEngine.execute(dates, spec([{ field: 'd', exclude: [new Date(2024, 0, 2)] }])).filteredRowCount).toBe(1);
    });
  });

  describe('subtotals and grand totals', () => {
    const engine = new PivotEngine({ fields: salesFields });

    it('builds the row and column header trees with their keys, paths and source row counts', () => {
      const result = engine.execute(sales, { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'amount', aggregator: 'sum' }] });

      expect(labels(result.rowTree)).toEqual([['East', ['China', 'Japan']], ['West', ['France', 'Spain']]]);
      expect(result.rowTree).toEqual(expect.objectContaining({ key: ROOT, field: undefined, label: 'Grand Total', level: 0, sourceRowCount: 5, parentKey: undefined, path: {} }));
      const east = result.rowTree.children[0];
      expect(east).toEqual(expect.objectContaining({ key: key('East'), field: 'region', value: 'East', label: 'East', level: 1, sourceRowCount: 3, parentKey: ROOT, path: { region: 'East' } }));
      expect(east.children[0]).toEqual(expect.objectContaining({ key: key('East', 'China'), field: 'country', value: 'China', level: 2, sourceRowCount: 2, parentKey: key('East'), path: { region: 'East', country: 'China' }, children: [] }));
      expect(result.columnTree.children.map((node) => [node.key, node.value, node.label, node.sourceRowCount])).toEqual([['[2023]', 2023, '2023', 3], ['[2024]', 2024, '2024', 2]]);
      expect(result).toEqual(expect.objectContaining({ sourceRowCount: 5, filteredRowCount: 5 }));
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(key('East', 'China')).toBe('["East","China"]');
    });

    it('accumulates every subtotal and grand total from the source rows, so averages and distinct counts are right at every level', () => {
      const result = engine.execute(sales, {
        rows: ['region', 'country'],
        columns: ['year'],
        values: [
          { id: 'sum', field: 'amount', aggregator: 'sum' },
          { id: 'avg', field: 'amount', aggregator: 'avg' },
          { id: 'orders', field: 'order', aggregator: 'distinctCount' },
          { id: 'count', field: 'amount', aggregator: 'count' },
        ],
      });
      const cell = (rowKey: string, columnKey: string) => result.cells[rowKey][columnKey];

      expect(cell(ROOT, ROOT)).toEqual([650, 162.5, 3, 4]);
      // the average of East is the average of its 3 amounts, not the mean of the averages of its countries (200 and 50)
      expect(cell(key('East'), ROOT)).toEqual([450, 150, 2, 3]);
      expect(cell(key('East', 'China'), ROOT)).toEqual([400, 200, 1, 2]);
      expect(cell(key('East', 'Japan'), ROOT)).toEqual([50, 50, 1, 1]);
      // order A is shared by both regions: the grand total distinct count is not the sum of the subtotals
      expect(cell(key('West'), ROOT)).toEqual([200, 200, 2, 1]);
      expect(cell(key('West', 'Spain'), ROOT).slice(1)).toEqual([null, 1, 0]);

      expect(cell(key('East'), '[2023]')).toEqual([150, 75, 2, 2]);
      expect(cell(key('East'), '[2024]')).toEqual([300, 300, 1, 1]);
      expect(cell(ROOT, '[2023]')).toEqual([150, 75, 3, 2]);
      expect(cell(ROOT, '[2024]')).toEqual([500, 250, 1, 2]);

      // a cell without any source row behind it does not exist
      expect(result.cells[key('West', 'Spain')]['[2024]']).toBeUndefined();
      expect(result.cellCounts![ROOT][ROOT]).toBe(5);
      expect(result.cellCounts![key('East')][ROOT]).toBe(3);
      expect(result.cellCounts![key('East')]['[2024]']).toBe(1);
    });

    it('computes the measures after aggregation, once per cell, from the other values of the cell', () => {
      const contexts: PivotMeasureContext[] = [];
      const result = engine.execute(sales, {
        rows: ['region'],
        columns: [],
        values: [
          { id: 'amount', field: 'amount', aggregator: 'sum' },
          { id: 'units', field: 'units', aggregator: 'sum', hidden: true },
        ],
        measures: [
          { id: 'perUnit', label: 'Per Unit', dependsOn: ['amount', 'units'], compute: (values, context) => { contexts.push(context); return values.amount / values.units; } },
          { id: 'double', label: 'Double', hidden: true, compute: (values) => values.perUnit * 2 },
        ],
      });

      expect(result.values.map((value) => ({ id: value.id, isMeasure: !!value.isMeasure, hidden: !!value.hidden }))).toEqual([
        { id: 'amount', isMeasure: false, hidden: false },
        { id: 'units', isMeasure: false, hidden: true },
        { id: 'perUnit', isMeasure: true, hidden: false },
        { id: 'double', isMeasure: true, hidden: true },
      ]);
      expect(result.values[2]).toEqual(expect.objectContaining({ label: 'Per Unit', resultType: 'number' }));
      expect(result.cells[ROOT][ROOT]).toEqual([650, 73, 650 / 73, (650 / 73) * 2]);
      expect(result.cells[key('East')][ROOT]).toEqual([450, 45, 10, 20]);
      expect(contexts).toContainEqual({ rowKey: key('East'), columnKey: ROOT, sourceRowCount: 3 });
    });

    it('shows every predefined item in its order, even without data, then the other items', () => {
      const result = engine.execute(sales, { rows: [], columns: ['quarter'], values: [{ field: 'amount', aggregator: 'sum' }] });
      expect(result.columnTree.children.map((node) => [node.label, node.sourceRowCount])).toEqual([['Q1', 3], ['Q2', 2], ['Q3', 0], ['Q4', 0]]);
      expect(result.cells[ROOT][key('Q3')]).toBeUndefined();

      const withExtra = engine.execute([...sales, { ...sales[0], quarter: 'Q0' }], { rows: ['quarter'], columns: [], values: [] });
      expect(withExtra.rowTree.children.map((node) => node.label)).toEqual(['Q1', 'Q2', 'Q3', 'Q4', 'Q0']);
      // an explicit sort order replaces the predefined one
      const sorted = engine.execute(sales, { rows: ['quarter'], columns: [], values: [], sort: [{ field: 'quarter', direction: 'desc' }] });
      expect(sorted.rowTree.children.map((node) => node.label)).toEqual(['Q4', 'Q3', 'Q2', 'Q1']);
    });

    it('sorts the items by caption, by a value within their parent, in source order or with a comparer', () => {
      const spec: Partial<PivotSpec> = { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'amount', aggregator: 'sum' }] };
      expect(labels(engine.execute(sales, { ...spec, sort: [{ field: 'region', direction: 'desc' }] }).rowTree)).toEqual([['West', ['France', 'Spain']], ['East', ['China', 'Japan']]]);

      const byValue = engine.execute(sales, { ...spec, sort: [{ field: 'country', by: { valueId: 'sum:amount' } }] });
      expect(labels(byValue.rowTree)).toEqual([['East', ['Japan', 'China']], ['West', ['Spain', 'France']]]);

      // by the value of one column, the items without a value last
      const byColumn = engine.execute(sales, { ...spec, sort: [{ field: 'country', direction: 'desc', by: { valueId: 'sum:amount', columnKey: '[2023]' } }] });
      expect(labels(byColumn.rowTree)).toEqual([['East', ['China', 'Japan']], ['West', ['Spain', 'France']]]);

      const sizes = [{ size: 'M' }, { size: 'S' }, { size: 'L' }, { size: 'S' }];
      const order = ['S', 'M', 'L'];
      const sizeEngine = new PivotEngine({ fields: [{ id: 'size', comparer: (a, b) => order.indexOf(a) - order.indexOf(b) }, { id: 'plain', field: 'size' }] });
      const sizeSpec: Partial<PivotSpec> = { rows: ['size'], columns: [], values: [] };
      expect(sizeEngine.execute(sizes, sizeSpec).rowTree.children.map((node) => node.label)).toEqual(['S', 'M', 'L']);
      expect(sizeEngine.execute(sizes, { ...sizeSpec, sort: [{ field: 'size', direction: 'desc' }] }).rowTree.children.map((node) => node.label)).toEqual(['L', 'M', 'S']);
      expect(sizeEngine.execute(sizes, { ...sizeSpec, sort: [{ field: 'size', direction: 'source' }] }).rowTree.children.map((node) => node.label)).toEqual(['M', 'S', 'L']);
      expect(sizeEngine.execute(sizes, { rows: ['plain'], columns: [], values: [] }).rowTree.children.map((node) => node.label)).toEqual(['L', 'M', 'S']);
    });

    it('keeps 1 and "1" apart, groups the blanks together and sorts numbers before text and blanks last', () => {
      const rows = [{ g: 'b' }, { g: '1' }, { g: 1 }, { g: null }, { g: '' }, { g: undefined }, { g: NaN }];
      const result = new PivotEngine({ fields: [{ id: 'g' }] }).execute(rows, { rows: ['g'], columns: [], values: [{ field: 'g', aggregator: 'count' }] });
      expect(result.rowTree.children.map((node) => node.label)).toEqual(['1', '1', 'b', '(blank)']);
      expect(result.rowTree.children.map((node) => node.key)).toEqual(['[1]', '["1"]', '["b"]', '["\\u0000blank"]']);
      expect(result.rowTree.children.map((node) => node.sourceRowCount)).toEqual([1, 1, 1, 4]);
      expect(result.rowTree.children[3].value).toBeNull();
      expect(result.cells[ROOT][ROOT]).toEqual([3]);

      const blankLabel = new PivotEngine({ fields: [{ id: 'g' }] }).execute(rows, { rows: ['g'], columns: [], values: [] }, { blankLabel: '(empty)', grandTotalLabel: 'All' });
      expect(blankLabel.rowTree.label).toBe('All');
      expect(blankLabel.rowTree.children[3].label).toBe('(empty)');
    });

    it('fills in the defaults of a spec, gives duplicate values unique ids and ignores the $values token', () => {
      const engineWithIds = new PivotEngine({ fields: [{ id: 'c', label: 'Column' }] });
      const normalized = engineWithIds.normalizeSpec({ values: [{ field: 'c', aggregator: 'count' }, { field: 'c', aggregator: 'count' }, { id: 'count:c', field: 'c', aggregator: 'count' }] });
      expect(normalized.values.map((value) => value.id)).toEqual(['count:c', 'count:c:2', 'count:c:3']);
      expect(normalized).toEqual(expect.objectContaining({ rows: [], columns: [], filters: [], measures: [], sort: [], layout: 'compact', subtotals: 'top', columnSubtotals: true, grandTotals: { rows: true, columns: true }, repeatItemLabels: false, maxColumns: 1000 }));
      expect(engineWithIds.normalizeSpec({ grandTotals: { rows: false, label: 'All' }, layout: 'tabular', subtotals: 'none', maxColumns: 20 })).toEqual(expect.objectContaining({ grandTotals: { rows: false, columns: true, label: 'All' }, layout: 'tabular', subtotals: 'none', maxColumns: 20 }));
      expect(engineWithIds.getValueLabel({ field: 'c', aggregator: 'count' })).toBe('Count of Column');
      expect(engineWithIds.getValueLabel({ field: 'c', aggregator: 'count', label: 'Orders' })).toBe('Orders');
      expect(engineWithIds.getDefaultValueId({ field: 'c', aggregator: 'avg' })).toBe('avg:c');

      const result = engine.execute(sales, { rows: ['region'], columns: [PIVOT_VALUES_FIELD, 'year'], values: [{ field: 'amount', aggregator: 'sum' }] });
      expect(result.columnTree.children.map((node) => node.label)).toEqual(['2023', '2024']);
      expect(engine.getFieldLabel(PIVOT_VALUES_FIELD)).toBe('Values');
      expect(result.cells[key('East')]['[2023]']).toEqual([150]);
    });

    it('cuts the column tree to respect maxColumns', () => {
      const rows = Array.from({ length: 30 }, (_value, i) => ({ c: `item ${i}`, v: i }));
      const result = new PivotEngine({ fields: [{ id: 'c' }, { id: 'v' }] }).execute(rows, { rows: [], columns: ['c'], values: [{ field: 'v', aggregator: 'sum' }, { field: 'v', aggregator: 'max' }], maxColumns: 10 });
      expect(result.columnTree.children).toHaveLength(5);
      expect(result.columnTree.children.map((node) => node.label)).toEqual(['item 0', 'item 1', 'item 2', 'item 3', 'item 4']);
      expect(result.truncated).toEqual({ columns: 60, maxColumns: 10 });
      expect(new PivotEngine({ fields: [{ id: 'c' }, { id: 'v' }] }).execute(rows, { rows: [], columns: ['c'], values: [{ field: 'v', aggregator: 'sum' }] }).truncated).toBeUndefined();
    });
  });

  describe('show values as', () => {
    const rows = [{ r: 'a', c: 'x', amount: 10, cost: 4 }, { r: 'a', c: 'y', amount: 30, cost: 6 }, { r: 'b', c: 'x', amount: 60, cost: 30 }];
    const engine = new PivotEngine({ fields: ['r', 'c', 'amount', 'cost'].map((id) => ({ id })) });
    const a = key('a');
    const b = key('b');
    const x = key('x');
    const y = key('y');

    it('shows the values as percentages of the grand, row, column and parent totals, keeping the aggregated values in rawCells', () => {
      const result = engine.execute(rows, {
        rows: ['r'],
        columns: ['c'],
        values: [
          { id: 'amount', field: 'amount', aggregator: 'sum' },
          { id: 'ofGrand', field: 'amount', aggregator: 'sum', showAs: 'percentOfGrandTotal' },
          { id: 'ofRow', field: 'amount', aggregator: 'sum', showAs: 'percentOfRowTotal' },
          { id: 'ofColumn', field: 'amount', aggregator: 'sum', showAs: { type: 'percentOfColumnTotal' } },
          { id: 'ofParentRow', field: 'amount', aggregator: 'sum', showAs: 'percentOfParentRowTotal' },
          { id: 'ofParentColumn', field: 'amount', aggregator: 'sum', showAs: 'percentOfParentColumnTotal' },
        ],
      });
      expect(result.values.map((value) => value.showAs)).toEqual([undefined, { type: 'percentOfGrandTotal' }, { type: 'percentOfRowTotal' }, { type: 'percentOfColumnTotal' }, { type: 'percentOfParentRowTotal' }, { type: 'percentOfParentColumnTotal' }]);

      expect(result.cells[a][x]).toEqual([10, 0.1, 0.25, 10 / 70, 10 / 70, 0.25]);
      expect(result.cells[b][x]).toEqual([60, 0.6, 1, 60 / 70, 60 / 70, 1]);
      expect(result.cells[a][ROOT]).toEqual([40, 0.4, 1, 0.4, 0.4, 1]);
      expect(result.cells[ROOT][x]).toEqual([70, 0.7, 0.7, 1, 1, 0.7]);
      expect(result.cells[ROOT][ROOT]).toEqual([100, 1, 1, 1, 1, 1]);
      expect(result.rawCells![a][x]).toEqual([10, 10, 10, 10, 10, 10]);
      expect(result.rawCells![ROOT][ROOT]).toEqual([100, 100, 100, 100, 100, 100]);
    });

    it('computes running totals, differences from the previous item and ranks along the rows or the columns', () => {
      const result = engine.execute(rows, {
        rows: ['r'],
        columns: ['c'],
        values: [
          { id: 'running', field: 'amount', aggregator: 'sum', showAs: 'runningTotal' },
          { id: 'runningAcross', field: 'amount', aggregator: 'sum', showAs: { type: 'runningTotal', axis: 'columns' } },
          { id: 'difference', field: 'amount', aggregator: 'sum', showAs: 'differenceFromPrevious' },
          { id: 'percentDifference', field: 'amount', aggregator: 'sum', showAs: { type: 'percentDifferenceFromPrevious', axis: 'columns' } },
          { id: 'rankUp', field: 'amount', aggregator: 'sum', showAs: 'rankAscending' },
          { id: 'rankDown', field: 'amount', aggregator: 'sum', showAs: 'rankDescending' },
        ],
      });

      // along the rows, the siblings of a cell are the rows of the same parent (a, b); along the columns, the columns (x, y)
      expect(result.cells[a][x]).toEqual([10, 10, null, null, 1, 2]);
      expect(result.cells[a][y]).toEqual([30, 40, null, 2, 1, 1]);
      expect(result.cells[b][x]).toEqual([70, 60, 50, null, 2, 1]);
      expect(result.cells[a][ROOT]).toEqual([40, 40, null, 40, 1, 2]);
      expect(result.cells[b][ROOT]).toEqual([100, 60, 20, 60, 2, 1]);
      // a total has no sibling along its own axis: it is shown as aggregated
      expect(result.cells[ROOT][x]).toEqual([70, 70, 70, null, 70, 70]);
      expect(result.cells[ROOT][y]).toEqual([30, 100, 30, (30 - 70) / 70, 30, 30]);
      expect(result.cells[ROOT][ROOT]).toEqual([100, 100, 100, 100, 100, 100]);
      expect(result.rawCells![b][ROOT]).toEqual([60, 60, 60, 60, 60, 60]);
    });

    it('combines a measure with the aggregated values, not the shown ones', () => {
      const result = engine.execute(rows, {
        rows: ['r'],
        columns: [],
        values: [{ id: 'amount', field: 'amount', aggregator: 'sum', showAs: 'percentOfGrandTotal' }, { id: 'cost', field: 'cost', aggregator: 'sum', hidden: true }],
        measures: [{ id: 'margin', label: 'Margin', compute: (values) => (values.amount - values.cost) / values.amount }],
      });
      expect(result.cells[a][ROOT]).toEqual([0.4, 10, 0.75]);
      expect(result.cells[ROOT][ROOT]).toEqual([1, 40, 0.6]);
    });
  });

  describe('date hierarchies', () => {
    const fields: PivotField[] = [
      { id: 'd', label: 'Date', type: 'date', group: 'Orders', allowedAreas: ['rows', 'columns'] },
      { id: 'n', dateHierarchy: ['year'] },
      { id: 'off', dateHierarchy: false },
      { id: 'amount' },
    ];
    const rows = [
      { d: new Date(2024, 10, 5), amount: 1 },
      { d: new Date(2023, 1, 20, 15, 30), amount: 2 },
      { d: new Date(2024, 0, 9), amount: 4 },
      { d: '2024-11-05T08:00:00', amount: 8 },
      { d: null, amount: 16 },
    ];

    it('derives the level fields of a date field without declaring them', () => {
      const engine = new PivotEngine({ fields, locale: 'en-US' });
      expect(PIVOT_DATE_LEVELS).toEqual(['year', 'quarter', 'month', 'day']);
      expect(PivotEngine.getDateLevelId('d', 'quarter')).toBe('d.quarter');
      expect(engine.getDateHierarchy('d').map((field) => field.id)).toEqual(['d.year', 'd.quarter', 'd.month', 'd.day']);
      expect(engine.getDateHierarchy('n').map((field) => field.id)).toEqual(['n.year']);
      expect(engine.getDateHierarchy('off')).toEqual([]);
      expect(engine.getDateHierarchy('unknown')).toEqual([]);
      expect(engine.getField('n.month')).toBeUndefined();
      expect(engine.getField('off.year')).toBeUndefined();
      expect(engine.getField('d.nope')).toBeUndefined();
      expect(engine.getField('d.month')).toEqual(expect.objectContaining({ id: 'd.month', label: 'Months (Date)', type: 'number', group: 'Orders', allowedAreas: ['rows', 'columns'], dateLevel: { field: 'd', level: 'month' } }));
      expect(engine.getField('d.day')?.type).toBe('date');
      expect(engine.getFieldLabel('d.quarter')).toBe('Quarters (Date)');
      // the level fields are not listed with the fields, and are forgotten with them
      expect(engine.getFields().map((field) => field.id)).toEqual(['d', 'n', 'off', 'amount']);
      engine.setFields([{ id: 'amount' }]);
      expect(engine.getField('d.year')).toBeUndefined();
    });

    it('groups the rows by year, quarter, month and day, captioned like Excel and sorted chronologically', () => {
      const engine = new PivotEngine({ fields, locale: 'en-US' });
      const result = engine.execute(rows, { rows: ['d.year', 'd.quarter', 'd.month'], columns: [], values: [{ field: 'amount', aggregator: 'sum' }] });
      expect(labels(result.rowTree)).toEqual([['2023', [['Qtr1', ['Feb']]]], ['2024', [['Qtr1', ['Jan']], ['Qtr4', ['Nov']]]], ['(blank)', [['(blank)', ['(blank)']]]]]);
      // the items are numbers, so that they sort chronologically
      expect(result.rowTree.children[1].children[1].children[0]).toEqual(expect.objectContaining({ value: 11, label: 'Nov', path: { 'd.year': 2024, 'd.quarter': 4, 'd.month': 11 } }));
      expect(result.cells[key(2024, 4, 11)][ROOT]).toEqual([9]);
      expect(result.cells[key(null, null, null)][ROOT]).toEqual([16]);

      // the string date and the date with a time fall on the same day
      const days = engine.getFieldItems(rows, 'd.day');
      expect(days.map((item) => [item.label, item.count])).toEqual([['2/20/2023', 1], ['1/9/2024', 1], ['11/5/2024', 2], ['(blank)', 1]]);
      expect(days[0].value).toEqual(new Date(2023, 1, 20));
      expect(engine.getFieldValue('d.year', rows[1])).toBe(2023);
      expect(engine.getFieldValue('d.quarter', { d: new Date(2024, 6, 1) })).toBe(3);
      expect(engine.getFieldValue('d.day', { d: 'not a date' })).toBeNull();
      expect(engine.formatItem('d.month', 3)).toBe('Mar');
      expect(engine.formatItem('d.quarter', 2)).toBe('Qtr2');
    });

    it('follows the locale of the month names and dates', () => {
      const engine = new PivotEngine({ fields, locale: 'fr-FR' });
      expect(engine.formatItem('d.month', 2)).toBe('févr.');
      engine.setLocale('de-DE');
      expect(engine.formatItem('d', new Date(2024, 10, 5))).toBe('5.11.2024');
    });
  });

  describe('write-back', () => {
    const fields: PivotField[] = [{ id: 'g' }, { id: 'v', type: 'number' }, { id: 'double', getter: (row: any) => row.v * 2 }];
    const spec = (aggregator: string): Partial<PivotSpec> => ({ rows: ['g'], columns: [], values: [{ field: 'v', aggregator }] });

    /** Allocate a new cell value over the given source values with the engine, returning the written values */
    const allocate = (aggregator: string, values: any[], target: any, options?: { method?: 'weighted' | 'equal' | 'equalIncrement'; precision?: number; }) => {
      const rows = values.map((v) => ({ g: 'a', v }));
      const engine = new PivotEngine({ fields });
      const changes = engine.allocate(rows, spec(aggregator), { rowKey: key('a'), columnKey: ROOT, valueId: `${aggregator}:v` }, target, options);
      engine.applyChanges(changes);
      return rows.map((row) => row.v);
    };

    it('spreads a new sum over the source rows with the weighted, equal and equalIncrement methods', () => {
      expect(allocate('sum', [10, 30, 60], 200)).toEqual([20, 60, 120]);
      expect(allocate('sum', [10, 30, 60], 200, { method: 'weighted' })).toEqual([20, 60, 120]);
      expect(allocate('sum', [10, 30, 60], 130, { method: 'equalIncrement' })).toEqual([20, 40, 70]);
      expect(allocate('sum', [10, 30, 60], 30, { method: 'equal' })).toEqual([10, 10, 10]);
      // an equal split when the current total is 0, blanks and numeric strings counted as numbers
      expect(allocate('sum', [0, 0, 0], 30)).toEqual([10, 10, 10]);
      expect(allocate('sum', ['10', null, 30], 80)).toEqual([20, 0, 60]);
      // no floating point noise without a precision
      expect(allocate('sum', [1, 2, 4], 7.7)).toEqual([1.1, 2.2, 4.4]);
    });

    it('rounds the written values to the precision, giving the residue to the largest one so that the total stays exact', () => {
      expect(allocate('sum', [1, 1, 1], 10, { precision: 0 })).toEqual([4, 3, 3]);
      expect(allocate('sum', [1, 1, 1], 100, { precision: 2 })).toEqual([33.34, 33.33, 33.33]);
      expect(allocate('sum', [10, 20, 30], 100, { precision: 0 })).toEqual([17, 33, 50]);
      const units = allocate('sum', [7, 11, 13, 17], 123, { precision: 0, method: 'equalIncrement' });
      expect(units.reduce((sum, v) => sum + v, 0)).toBe(123);
      expect(units.every((v) => Number.isInteger(v))).toBe(true);
      expect(Math.max(...units)).toBe(units[3]);
    });

    it('allocates averages, first and last values', () => {
      // blank values are not part of an average: they stay blank
      expect(allocate('avg', [10, '', 30], 40)).toEqual([20, '', 60]);
      expect(allocate('avg', [10, 30], 25, { method: 'equalIncrement' })).toEqual([15, 35]);
      expect(allocate('avg', [10, 30], 25, { method: 'equal' })).toEqual([25, 25]);
      expect(allocate('avg', [null, null], 8)).toEqual([8, 8]);
      expect(allocate('avg', [1, 1, 1], 10, { precision: 0 })).toEqual([10, 10, 10]);
      expect(allocate('first', ['', 5, 6], 9)).toEqual(['', 9, 6]);
      expect(allocate('last', [5, 6, null], 9)).toEqual([5, 9, null]);
      expect(allocate('last', [null, null], 9)).toEqual([null, 9]);
    });

    it('tells which values can be written back', () => {
      const engine = new PivotEngine({ fields: [...fields, { id: 'withSetter', getter: (row: any) => row.v, setter: (row: any, value: any) => (row.v = value) }] });
      expect(engine.canWriteBack({ field: 'v', aggregator: 'sum' })).toBe(true);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'avg' })).toBe(true);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'first' })).toBe(true);
      expect(engine.canWriteBack({ field: 'withSetter', aggregator: 'sum' })).toBe(true);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'max' })).toBe(false);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'count' })).toBe(false);
      expect(engine.canWriteBack({ field: 'double', aggregator: 'sum' })).toBe(false);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'sum', showAs: 'percentOfGrandTotal' })).toBe(false);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'sum', writeBack: false })).toBe(false);
      expect(engine.canWriteBack({ field: 'unknown', aggregator: 'sum' })).toBe(false);
      expect(engine.canWriteBack({ field: 'v', aggregator: 'nope' })).toBe(false);
    });

    it('returns the changes of the source rows behind the cell without applying them, skipping the rows that keep their value', () => {
      const rows = [{ g: 'a', v: 10 }, { g: 'a', v: 30 }, { g: 'b', v: 5 }];
      const engine = new PivotEngine({ fields });
      const changes = engine.allocate(rows, spec('sum'), { rowKey: key('a'), columnKey: ROOT, valueId: 'sum:v' }, 80);
      expect(changes).toEqual([{ row: rows[0], field: 'v', oldValue: 10, newValue: 20 }, { row: rows[1], field: 'v', oldValue: 30, newValue: 60 }]);
      expect(rows.map((row) => row.v)).toEqual([10, 30, 5]);

      // the value settings of the spec apply, the options win
      const withSettings: Partial<PivotSpec> = { rows: ['g'], columns: [], values: [{ field: 'v', aggregator: 'sum', writeBack: { method: 'equal', precision: 0 } }] };
      expect(engine.allocate(rows, withSettings, { rowKey: key('a'), columnKey: ROOT, valueId: 'sum:v' }, 41).map((change) => change.newValue)).toEqual([20, 21]);
      expect(engine.allocate(rows, withSettings, { rowKey: key('a'), columnKey: ROOT, valueId: 'sum:v' }, 80, { method: 'weighted' }).map((change) => change.newValue)).toEqual([20, 60]);

      expect(engine.allocate(rows, spec('sum'), { rowKey: key('a'), columnKey: ROOT, valueId: 'sum:v' }, 40)).toEqual([]);
      expect(engine.allocate(rows, spec('sum'), { rowKey: key('a'), columnKey: ROOT, valueId: 'sum:v' }, 40, { method: 'equal' })).toEqual([{ row: rows[0], field: 'v', oldValue: 10, newValue: 20 }, { row: rows[1], field: 'v', oldValue: 30, newValue: 20 }]);
      expect(engine.allocate(rows, spec('sum'), { rowKey: key('nope'), columnKey: ROOT, valueId: 'sum:v' }, 40)).toEqual([]);
      expect(engine.allocate(rows, spec('sum'), { rowKey: key('a'), columnKey: ROOT, valueId: 'nope' }, 40)).toEqual([]);
      expect(engine.allocate(rows, spec('max'), { rowKey: key('a'), columnKey: ROOT, valueId: 'max:v' }, 40)).toEqual([]);
    });

    it('applies and undoes the changes, writing derived fields through their setter', () => {
      const rows = [{ g: 'a', v: 1 }, { g: 'a', v: 3 }];
      const engine = new PivotEngine({ fields: [{ id: 'g' }, { id: 'double', getter: (row: any) => row.v * 2, setter: (row: any, value: number) => (row.v = value / 2) }, { id: 'readOnly', getter: (row: any) => row.v }] });
      const changes = engine.allocate(rows, { rows: [], columns: [], values: [{ field: 'double', aggregator: 'sum' }] }, { rowKey: ROOT, columnKey: ROOT, valueId: 'sum:double' }, 16);
      expect(changes).toEqual([{ row: rows[0], field: 'double', oldValue: 2, newValue: 4 }, { row: rows[1], field: 'double', oldValue: 6, newValue: 12 }]);

      engine.applyChanges(changes);
      expect(rows.map((row) => row.v)).toEqual([2, 6]);
      engine.applyChanges(changes, true);
      expect(rows.map((row) => row.v)).toEqual([1, 3]);

      engine.setFieldValue('g', rows[0], 'b');
      expect(rows[0].g).toBe('b');
      expect(() => engine.setFieldValue('readOnly', rows[0], 5)).toThrow('[PivotEngine] the field "readOnly" has a getter but no setter, it cannot be written');
      expect(() => engine.setFieldValue('unknown', rows[0], 5)).toThrow('[PivotEngine] unknown field "unknown"');
    });
  });

  describe('field items and source rows', () => {
    const engine = new PivotEngine({ fields: salesFields });

    it('lists the distinct items of a field with their captions and counts', () => {
      expect(engine.getFieldItems(sales, 'region')).toEqual([{ value: 'East', label: 'East', count: 3 }, { value: 'West', label: 'West', count: 2 }]);
      expect(engine.getFieldItems(sales, 'region', { search: ' we ' })).toEqual([{ value: 'West', label: 'West', count: 2 }]);
      expect(engine.getFieldItems(sales, 'country', { limit: 2 }).map((item) => item.label)).toEqual(['China', 'France']);
      expect(engine.getFieldItems(sales, 'quarter').map((item) => [item.label, item.count])).toEqual([['Q1', 3], ['Q2', 2], ['Q3', 0], ['Q4', 0]]);
      expect(engine.getFieldItems(sales, 'amount', { blankLabel: '(empty)' }).map((item) => [item.value, item.label, item.count])).toEqual([[50, '50', 1], [100, '100', 1], [200, '200', 1], [300, '300', 1], [null, '(empty)', 1]]);
      expect(() => engine.getFieldItems(sales, 'nope')).toThrow('[PivotEngine] unknown field "nope"');
    });

    it('returns the source rows behind a cell, after the spec filters', () => {
      const spec: Partial<PivotSpec> = { rows: ['region', 'country'], columns: ['year'], values: [{ field: 'amount', aggregator: 'sum' }] };
      expect(engine.getSourceRows(sales, spec, key('East', 'China'), '[2023]')).toEqual([sales[0]]);
      expect(engine.getSourceRows(sales, spec, key('East'), ROOT)).toEqual(sales.slice(0, 3));
      expect(engine.getSourceRows(sales, spec, ROOT, '[2024]')).toEqual([sales[1], sales[3]]);
      expect(engine.getSourceRows(sales, spec, ROOT, ROOT)).toEqual(sales);
      expect(engine.getSourceRows(sales, { ...spec, filters: [{ field: 'region', include: ['West'] }] }, ROOT, ROOT)).toEqual(sales.slice(3));
      expect(engine.getSourceRows(sales, spec, key('North'), ROOT)).toEqual([]);
    });

    it('reads field values, infers field types and formats the items', () => {
      const fields: PivotField[] = [
        { id: 'n' },
        { id: 'declared', field: 'n', type: 'string' },
        { id: 'customer', itemFormatter: (id) => ({ ALFKI: 'Alfreds Futterkiste' })[id as string] ?? `#${id}` },
        { id: 'when' },
        { id: 'flag' },
        { id: 'derived', getter: (row: any) => row.n * 10 },
        { id: 'renamed', field: 'n' },
      ];
      const typed = new PivotEngine({ fields });
      const rows = [{ n: 1, customer: 'ALFKI', when: new Date(2024, 0, 1), flag: true }, { n: null, customer: 'X', when: null, flag: false }, { n: 2, customer: null, when: new Date(2024, 1, 1), flag: true }];

      expect(typed.getFieldValue('n', rows[0])).toBe(1);
      expect(typed.getFieldValue('derived', rows[2])).toBe(20);
      expect(typed.getFieldValue('renamed', rows[2])).toBe(2);
      expect(typed.getFieldValue('n', undefined)).toBeUndefined();
      expect(() => typed.getFieldValue('nope', rows[0])).toThrow('[PivotEngine] unknown field "nope"');

      expect(typed.inferFieldType(rows, 'n')).toBe('number');
      expect(typed.inferFieldType(rows, 'declared')).toBe('string');
      expect(typed.inferFieldType(rows, 'customer')).toBe('string');
      expect(typed.inferFieldType(rows, 'when')).toBe('date');
      expect(typed.inferFieldType(rows, 'flag')).toBe('boolean');
      expect(typed.inferFieldType([{ n: 1 }, { n: 'two' }], 'n')).toBe('string');
      expect(typed.inferFieldType([], 'n')).toBe('string');

      expect(typed.formatItem('customer', 'ALFKI')).toBe('Alfreds Futterkiste');
      expect(typed.formatItem('customer', 'X')).toBe('#X');
      expect(typed.formatItem('customer', null)).toBe('(blank)');
      expect(typed.formatItem('customer', '', '(none)')).toBe('(none)');
      expect(typed.formatItem('n', 3)).toBe('3');
      expect(typed.formatItem('when', new Date(2024, 0, 15))).toBe(new Date(2024, 0, 15).toLocaleDateString());
      expect(typed.getFieldLabel('customer')).toBe('customer');
      expect(typed.getFieldLabel('unknown')).toBe('unknown');
    });
  });
});
