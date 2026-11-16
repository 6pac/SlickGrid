describe('Example - Pivoting (SlickPivot plugin)', { retries: 1 }, () => {
  const grid = '#myGrid';

  /** Text displayed by a cell, computed with the column formatter like the grid does */
  function getDisplayedText(win: any, row: number, cell: number): string {
    const slickGrid = win.grid;
    const column = slickGrid.getColumns()[cell];
    const item = slickGrid.getDataItem(row);
    const value = item[column.field];
    const output = column.formatter ? column.formatter(row, cell, value, column, item, slickGrid) : value;
    if (output !== null && typeof output === 'object') {
      return output.text !== undefined ? output.text : output.textContent;
    }
    return output === undefined || output === null ? '' : String(output);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pivot.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('multi column pivoting with the SlickPivot plugin');
  });

  it('should render one group header row with the "All" totals first, then the age blocks in their predefined order', () => {
    cy.get(`${grid} .slick-pivot-header-row`).should('have.length', 1);
    cy.get(`${grid} .slick-pivot-header-group .slick-pivot-header-label`).then(($labels) => {
      expect(Array.from($labels).map((label) => label.textContent)).to.deep.equal(['', 'All', 'D', 'C', 'B', 'A']);
    });
  });

  it('should have the same column headers as the original hand-written pivot', () => {
    cy.fixture('example-pivot-golden.json').then((golden) => {
      cy.get(`${grid} .slick-header-column .slick-column-name`).then(($names) => {
        expect(Array.from($names).map((name) => name.textContent)).to.deep.equal(golden.headers.map((header: string[]) => header[1]));
      });
      cy.window().then((win: any) => {
        const groups = win.grid.getColumns().map((column: any) => win.pivot.getColumnInfo(column.id).groupPath.map((segment: any) => segment.label).join('/'));
        expect(groups).to.deep.equal(golden.headers.map((header: string[]) => header[0]));
      });
    });
  });

  it('should display exactly the same cells as the original hand-written pivot', () => {
    cy.fixture('example-pivot-golden.json').then((golden) => {
      cy.window().then((win: any) => {
        expect(win.grid.getDataLength()).to.eq(golden.rows.length);
        golden.rows.forEach((row: string[], r: number) => {
          row.forEach((text: string, c: number) => expect(getDisplayedText(win, r, c), `row ${r}, column ${c}`).to.eq(text));
        });
      });
    });
  });

  it('should render the cells with the tag colors of the custom formatter', () => {
    cy.get(`${grid} .slick-row[data-row="0"] .slick-cell.l0`).should('contain', 'OC1');
    cy.get(`${grid} .slick-row[data-row="0"] .slick-cell.l2`).should('have.text', '64').and('have.class', 'OC1');
    cy.get(`${grid} .slick-row[data-row="6"] .slick-cell.l3`).should('have.text', '4053').and('have.class', 'ON');
    cy.get(`${grid} .slick-row[data-row="7"] .slick-cell.l1`).should('have.text', '418');
  });

  it('should not show any expand/collapse toggle since row collapsing is disabled', () => {
    cy.get(`${grid} .slick-pivot-toggle`).should('not.exist');
  });
});
