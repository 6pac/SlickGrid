describe('Example - Pivot crosstab, lookups and measures', { retries: 1 }, () => {
  const ROOT = '[]';

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pivot-crosstab.html`);
    cy.get('h2').contains('Demonstrates');
  });

  describe('MS Access style crosstab', () => {
    it('should show the row headings, the "Total" row total in front and the four quarters', () => {
      cy.get('#crosstabGrid .slick-header-column .slick-column-name').should(($names) => {
        expect(Array.from($names).map((name) => name.textContent)).to.deep.equal(['Product Name', 'Customer', 'OrderYear', 'Total', 'Qtr 1', 'Qtr 2', 'Qtr 3', 'Qtr 4']);
      });
    });

    it('should repeat the row headings on every row and only show the year of the "Where" filter', () => {
      cy.get('#crosstabGrid .slick-row .slick-cell.l2').each(($cell) => expect($cell.text()).to.eq('1997'));
      cy.get('#crosstabGrid .slick-row[data-row="1"] .slick-cell.l0').invoke('text').should('not.be.empty');
      cy.get('[data-test="year-select"]').select('1998');
      cy.get('#crosstabGrid .slick-row .slick-cell.l2').each(($cell) => expect($cell.text()).to.eq('1998'));
      cy.get('[data-test="year-select"]').select('1997');
    });

    it('should have a row total equal to the sum of the quarters on every row', () => {
      cy.window().then((win: any) => {
        const pivot = win.crosstab;
        const columns = pivot.getColumns().map((column: any) => ({ id: column.id, info: pivot.getColumnInfo(column.id) })).filter((column: any) => column.info.type === 'value');
        const total = columns.find((column: any) => column.info.isGrandTotal);
        const quarters = columns.filter((column: any) => !column.info.isGrandTotal);
        expect(quarters).to.have.length(4);
        pivot.rowModel.getItems().forEach((item: any) => {
          const sum = quarters.reduce((acc: number, column: any) => acc + (item[column.id] ?? 0), 0);
          expect(sum).to.be.closeTo(item[total.id], 0.001);
        });
      });
    });
  });

  describe('lookups, distinct count, custom aggregator and measures', () => {
    it('should count the distinct orders at every level, so the grand total is not the sum of the categories', () => {
      cy.window().then((win: any) => {
        const result = win.measures.getResult();
        const ordersIndex = result.values.findIndex((value: any) => value.id === 'orders');
        const distinctOrders = new Set(win.orderDetails.map((row: any) => row.OrderID)).size;
        expect(result.cells[ROOT][ROOT][ordersIndex]).to.eq(distinctOrders);
        const sumOfCategories = result.rowTree.children.reduce((acc: number, node: any) => acc + result.cells[node.key][ROOT][ordersIndex], 0);
        expect(sumOfCategories).to.be.greaterThan(distinctOrders);
      });
    });

    it('should compute the measures from the aggregated values of each cell', () => {
      cy.window().then((win: any) => {
        const result = win.measures.getResult();
        const index = (id: string) => result.values.findIndex((value: any) => value.id === id);
        const root = result.cells[ROOT][ROOT];
        expect(root[index('margin')]).to.be.closeTo((root[index('amount')] - root[index('cost')]) / root[index('amount')], 1e-9);
        expect(root[index('avgOrder')]).to.be.closeTo(root[index('amount')] / root[index('orders')], 1e-9);
        // "% of parent row total": the categories add up to 100%
        const shares = result.rowTree.children.map((node: any) => result.cells[node.key][ROOT][index('share')]);
        expect(shares.reduce((acc: number, share: number) => acc + share, 0)).to.be.closeTo(1, 1e-9);
        // the hidden value is computed but has no column
        expect(win.measures.getColumns().some((column: any) => win.measures.getColumnInfo(column.id).valueId === 'cost')).to.eq(false);
      });
    });

    it('should show the categories collapsed, and expand one of them', () => {
      cy.get('#measuresGrid .slick-row[data-row="0"] .slick-cell.l0').should('contain', 'Beverages').find('.slick-pivot-toggle').should('have.class', 'collapsed').click();
      cy.get('#measuresGrid .slick-row[data-row="1"] .slick-cell.l0').should('contain', 'Chai');
      cy.get('#measuresGrid .slick-pivot-grand-total .slick-cell.l0').should('contain', 'Grand Total');
    });
  });

  describe('PivotEngine', () => {
    let win: any;

    before(() => {
      cy.window().then((w: any) => (win = w));
    });

    const execute = (rows: any[], fields: any[], spec: any, options?: any) => new win.Slick.PivotEngine({ fields, ...options }).execute(rows, spec);

    it('should compute every built-in aggregator, ignoring blanks and parsing numeric strings', () => {
      const rows = [{ g: 'a', v: 1 }, { g: 'a', v: 3 }, { g: 'a', v: '5' }, { g: 'a', v: null }, { g: 'b', v: 2 }];
      const aggregators = ['sum', 'count', 'countNumbers', 'distinctCount', 'avg', 'min', 'max', 'product', 'stdDev', 'stdDevP', 'var', 'varP', 'median', 'first', 'last'];
      const result = execute(rows, [{ id: 'g' }, { id: 'v' }], { rows: [], columns: [], values: aggregators.map((aggregator) => ({ field: 'v', aggregator })) });
      const root = result.cells[ROOT][ROOT];
      const byId = Object.fromEntries(aggregators.map((id, i) => [id, root[i]]));
      expect(byId.sum).to.eq(11);
      expect(byId.count).to.eq(4);
      expect(byId.countNumbers).to.eq(4);
      expect(byId.distinctCount).to.eq(4);
      expect(byId.avg).to.eq(2.75);
      expect(byId.min).to.eq(1);
      expect(byId.max).to.eq(5);
      expect(byId.product).to.eq(30);
      expect(byId.var).to.be.closeTo(8.75 / 3, 1e-9);
      expect(byId.varP).to.be.closeTo(2.1875, 1e-9);
      expect(byId.stdDev).to.be.closeTo(Math.sqrt(8.75 / 3), 1e-9);
      expect(byId.stdDevP).to.be.closeTo(Math.sqrt(2.1875), 1e-9);
      expect(byId.median).to.eq(2.5);
      expect(byId.first).to.eq(1);
      expect(byId.last).to.eq(2);
      expect(result.values.map((value: any) => value.label).slice(0, 2)).to.deep.equal(['Sum of v', 'Count of v']);
    });

    it('should keep 1 and "1" apart, group the blanks together and sort numbers before text and blanks last', () => {
      const rows = [{ g: '1' }, { g: 1 }, { g: null }, { g: '' }, { g: undefined }];
      const result = execute(rows, [{ id: 'g' }], { rows: ['g'], columns: [], values: [{ field: 'g', aggregator: 'count' }] });
      expect(result.rowTree.children.map((node: any) => node.label)).to.deep.equal(['1', '1', '(blank)']);
      expect(result.rowTree.children.map((node: any) => node.key)).to.deep.equal(['[1]', '["1"]', '["\\u0000blank"]']);
      expect(result.rowTree.children.map((node: any) => node.sourceRowCount)).to.deep.equal([1, 1, 3]);
      expect(win.Slick.PivotEngine.getNodeKey([1])).to.eq('[1]');
    });

    it('should show every predefined item in its order, even without data, then the other items', () => {
      const rows = [{ q: 'Q3', v: 1 }, { q: 'Q1', v: 2 }, { q: 'Q5', v: 3 }];
      const result = execute(rows, [{ id: 'q', predefinedValues: ['Q1', 'Q2', 'Q3', 'Q4'] }, { id: 'v' }], { rows: [], columns: ['q'], values: [{ field: 'v', aggregator: 'sum' }] });
      expect(result.columnTree.children.map((node: any) => node.label)).to.deep.equal(['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
      expect(result.columnTree.children[1].sourceRowCount).to.eq(0);
      expect(result.cells[ROOT][result.columnTree.children[1].key]).to.eq(undefined);
    });

    it('should apply item, label, predicate and top N filters', () => {
      const rows = [{ c: 'x', n: 1 }, { c: 'y', n: 2 }, { c: 'z', n: 3 }, { c: 'x', n: 4 }];
      const fields = [{ id: 'c' }, { id: 'n' }];
      const run = (filters: any[]) => execute(rows, fields, { rows: ['c'], columns: [], values: [{ field: 'n', aggregator: 'sum' }], filters }).filteredRowCount;
      expect(run([{ field: 'c', include: ['x'] }])).to.eq(2);
      expect(run([{ field: 'c', exclude: ['x'] }])).to.eq(2);
      expect(run([{ field: 'c', label: { operator: 'beginsWith', value: 'Y' } }])).to.eq(1);
      expect(run([{ field: 'n', predicate: (value: number) => value > 1 }])).to.eq(3);
      expect(run([{ field: 'c', top: { count: 1, valueId: 'sum:n' } }])).to.eq(2);
      expect(run([{ field: 'c', top: { count: 1, valueId: 'sum:n', direction: 'bottom' } }])).to.eq(1);
      expect(run([{ field: 'c' }])).to.eq(4);
    });

    it('should match dates by day and accept the serialized (string) form of date filter items', () => {
      const rows = [{ d: new Date(2024, 0, 2), v: 1 }, { d: new Date(2024, 0, 2), v: 2 }, { d: new Date(2024, 0, 3), v: 4 }];
      const fields = [{ id: 'd', type: 'date' }, { id: 'v' }];
      const result = execute(rows, fields, { rows: ['d'], columns: [], values: [{ field: 'v', aggregator: 'sum' }], filters: [{ field: 'd', include: [JSON.parse(JSON.stringify(new Date(2024, 0, 2)))] }] });
      expect(result.rowTree.children).to.have.length(1);
      expect(result.cells[result.rowTree.children[0].key][ROOT][0]).to.eq(3);
    });

    it('should accumulate subtotals from the source rows, so a distinct count is right at every level', () => {
      const rows = [{ r: 'a', o: 1 }, { r: 'a', o: 2 }, { r: 'b', o: 2 }, { r: 'b', o: 3 }];
      const result = execute(rows, [{ id: 'r' }, { id: 'o' }], { rows: ['r'], columns: [], values: [{ field: 'o', aggregator: 'distinctCount' }] });
      expect(result.rowTree.children.map((node: any) => result.cells[node.key][ROOT][0])).to.deep.equal([2, 2]);
      expect(result.cells[ROOT][ROOT][0]).to.eq(3);
    });

    it('should sort the items by a value within their parent', () => {
      const rows = [{ p: 'x', r: 'a', v: 1 }, { p: 'x', r: 'b', v: 9 }, { p: 'y', r: 'c', v: 5 }, { p: 'y', r: 'd', v: 2 }];
      const sort = ['p', 'r'].map((field) => ({ field, direction: 'desc', by: { valueId: 'sum:v' } }));
      const result = execute(rows, [{ id: 'p' }, { id: 'r' }, { id: 'v' }], { rows: ['p', 'r'], columns: [], values: [{ field: 'v', aggregator: 'sum' }], sort });
      expect(result.rowTree.children.map((node: any) => node.label)).to.deep.equal(['x', 'y']);
      expect(result.rowTree.children[0].children.map((node: any) => node.label)).to.deep.equal(['b', 'a']);
      expect(result.rowTree.children[1].children.map((node: any) => node.label)).to.deep.equal(['c', 'd']);
      const byLabel = execute(rows, [{ id: 'p' }, { id: 'r' }, { id: 'v' }], { rows: ['p'], columns: [], values: [], sort: [{ field: 'p', direction: 'desc' }] });
      expect(byLabel.rowTree.children.map((node: any) => node.label)).to.deep.equal(['y', 'x']);
    });

    it('should compute measures after aggregation and the "Show Values As" calculations', () => {
      const rows = [{ r: 'a', c: 'x', amount: 10, cost: 4 }, { r: 'a', c: 'y', amount: 30, cost: 6 }, { r: 'b', c: 'x', amount: 60, cost: 30 }];
      const fields = ['r', 'c', 'amount', 'cost'].map((id) => ({ id }));
      const result = execute(rows, fields, {
        rows: ['r'],
        columns: ['c'],
        values: [
          { id: 'amount', field: 'amount', aggregator: 'sum' },
          { id: 'cost', field: 'cost', aggregator: 'sum', hidden: true },
          { id: 'share', field: 'amount', aggregator: 'sum', showAs: 'percentOfGrandTotal' },
          { id: 'ofRow', field: 'amount', aggregator: 'sum', showAs: 'percentOfRowTotal' },
          { id: 'running', field: 'amount', aggregator: 'sum', showAs: 'runningTotal' },
          { id: 'rank', field: 'amount', aggregator: 'sum', showAs: 'rankDescending' },
        ],
        measures: [{ id: 'margin', label: 'Margin', compute: (v: any) => (v.amount - v.cost) / v.amount }],
      });
      const [a, b] = result.rowTree.children;
      const [x] = result.columnTree.children;
      const index = (id: string) => result.values.findIndex((value: any) => value.id === id);
      expect(result.cells[ROOT][ROOT][index('margin')]).to.be.closeTo(0.6, 1e-9);
      expect(result.cells[a.key][ROOT][index('margin')]).to.be.closeTo(0.75, 1e-9);
      expect(result.cells[a.key][x.key][index('share')]).to.be.closeTo(0.1, 1e-9);
      expect(result.cells[a.key][x.key][index('ofRow')]).to.be.closeTo(0.25, 1e-9);
      expect(result.cells[a.key][ROOT][index('running')]).to.eq(40);
      expect(result.cells[b.key][ROOT][index('running')]).to.eq(100);
      expect(result.cells[a.key][ROOT][index('rank')]).to.eq(2);
      expect(result.cells[b.key][ROOT][index('rank')]).to.eq(1);
      expect(result.rawCells[b.key][ROOT][index('rank')]).to.eq(60);
      expect(result.values[index('cost')].hidden).to.eq(true);
    });

    it('should cut the column tree to respect maxColumns', () => {
      const rows = Array.from({ length: 30 }, (_v, i) => ({ c: `item ${i}`, v: i }));
      const result = execute(rows, [{ id: 'c' }, { id: 'v' }], { rows: [], columns: ['c'], values: [{ field: 'v', aggregator: 'sum' }, { field: 'v', aggregator: 'max' }], maxColumns: 10 });
      expect(result.columnTree.children).to.have.length(5);
      expect(result.truncated).to.deep.equal({ columns: 60, maxColumns: 10 });
    });

    it('should wrap reducer functions and DataView aggregator classes', () => {
      const { PivotAggregators } = win.Slick;
      class MaxLengthAggregator {
        field: string;
        type = 'maxLength';
        max = 0;
        constructor(field: string) {
          this.field = field;
        }
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
        ratioSum: PivotAggregators.fromReducer('ratioSum', 'Ratio Sum', (row: any, current: number | undefined) => (current || 0) + row.a / row.b),
        maxLength: PivotAggregators.fromDataViewAggregator('maxLength', 'Max Length', MaxLengthAggregator),
      };
      const rows = [{ a: 1, b: 2, s: 'ab' }, { a: 3, b: 4, s: 'abcd' }];
      const result = execute(rows, [{ id: 'a' }, { id: 's' }], { rows: [], columns: [], values: [{ field: 'a', aggregator: 'ratioSum' }, { field: 's', aggregator: 'maxLength' }] }, { aggregators });
      expect(result.cells[ROOT][ROOT]).to.deep.equal([1.25, 4]);
    });

    it('should return the source rows behind a cell and give duplicate values unique ids', () => {
      const rows = [{ r: 'a', c: 'x' }, { r: 'a', c: 'y' }, { r: 'b', c: 'x' }];
      const engine = new win.Slick.PivotEngine({ fields: [{ id: 'r' }, { id: 'c', label: 'Column' }] });
      const spec = { rows: ['r'], columns: ['c'], values: [{ field: 'c', aggregator: 'count' }, { field: 'c', aggregator: 'count' }] };
      expect(engine.getSourceRows(rows, spec, '["a"]', '["x"]')).to.deep.equal([rows[0]]);
      expect(engine.getSourceRows(rows, spec, ROOT, '["x"]')).to.have.length(2);
      expect(engine.normalizeSpec(spec).values.map((value: any) => value.id)).to.deep.equal(['count:c', 'count:c:2']);
      expect(engine.getValueLabel(spec.values[0])).to.eq('Count of Column');
      expect(engine.getFieldItems(rows, 'r')).to.deep.equal([{ value: 'a', label: 'a', count: 2 }, { value: 'b', label: 'b', count: 1 }]);
      expect(engine.inferFieldType([{ n: 1 }, { n: 2 }].map((row) => ({ r: row.n })), 'r')).to.eq('number');
    });
  });
});
