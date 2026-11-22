describe('Example - Pivot table with a crosstab designer', { retries: 1 }, () => {
  const designer = '#designer .slick-pivot-designer';
  const grid = '#myGrid';
  const designGrid = `${designer} .slick-pivot-designer-grid`;
  const control = (prop: string, index: number | 'new') => `${designGrid} [data-prop="${prop}"][data-index="${index}"]`;
  const fieldItem = (field: string) => `${designer} .slick-pivot-designer-field[data-field="${field}"]`;
  const cell = (row: number, column: number) => `${grid} .slick-row[data-row="${row}"] .slick-cell.l${column}`;

  function expectHeaderNames(names: string[]) {
    cy.get(`${grid} .slick-header-column .slick-column-name`).should(($names) => {
      expect(Array.from($names).map((name) => name.textContent)).to.deep.equal(names);
    });
  }

  function expectDesign(columns: string[][]) {
    cy.window().should((win: any) => {
      expect(win.designer.getColumns().map((column: any) => [column.field, column.total, column.crosstab, column.criteria ?? ''])).to.deep.equal(columns);
    });
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pivot-designer.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get(`${designer} .slick-pivot-designer-title`).should('have.text', 'Crosstab Designer');
  });

  it('should show the crosstab of the spec in the design grid, and its result like MS Access does', () => {
    cy.window().then((win: any) => {
      expect(win.grid.getPluginByName('PivotDesigner')).to.equal(win.designer);
      expect(win.grid.getData()).to.equal(win.pivot.rowModel);
    });
    expectDesign([
      ['Category', 'groupBy', 'row', ''],
      ['Product', 'groupBy', 'row', ''],
      ['OrderDate.quarter', 'groupBy', 'column', ''],
      ['Amount', 'sum', 'value', ''],
      ['Amount', 'sum', 'row', ''],
      ['OrderDate.year', 'where', 'none', '2024'],
    ]);
    cy.get(`${designGrid} .slick-pivot-designer-column-label`).should(($labels) => {
      expect(Array.from($labels).map((label) => label.textContent)).to.deep.equal(['Category', 'Product', 'Quarters (Order Date)', 'Amount', 'Amount', 'Years (Order Date)']);
    });
    cy.get(`${designGrid} tbody th`).should(($headers) => {
      expect(Array.from($headers).map((header) => header.textContent)).to.deep.equal(['Field:', 'Total:', 'Crosstab:', 'Sort:', 'Criteria:']);
    });
    cy.get(control('total', 3)).find('option:selected').should('have.text', 'Sum');
    cy.get(control('crosstab', 4)).find('option:selected').should('have.text', 'Row Heading');
    cy.get(`${designGrid} .slick-pivot-designer-tag`).should('have.text', 'Row total');
    cy.get(control('criteria', 5)).should('have.value', '2024');

    // tabular, the captions on every row, the row total after the Row Headings, no subtotals and no grand total row
    expectHeaderNames(['Category', 'Product', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    ['Bakery', 'Croissants', '$40,446', '$10,140', '$8,617', '$12,117', '$9,571'].forEach((text, c) => cy.get(cell(0, c)).should('have.text', text));
    cy.get(cell(1, 0)).should('have.text', 'Bakery');
    cy.get(`${grid} .slick-pivot-grand-total`).should('not.exist');
    cy.window().its('grid').invoke('getDataLength').should('eq', 13);
    cy.window().its('pivot').invoke('getResult').its('filteredRowCount').should('eq', 1522);
  });

  it('should add a column by double-clicking a field, and filter it with MS Access criteria kept in the spec', () => {
    cy.get(fieldItem('Region')).dblclick();
    expectHeaderNames(['Category', 'Product', 'Region', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    cy.get(control('criteria', 6)).type('"East" Or "West"{enter}');
    cy.window().its('pivot').invoke('getSpec').its('filters').should('deep.equal', [{ field: 'OrderDate.year', criteria: '2024' }, { field: 'Region', criteria: '"East" Or "West"' }]);
    cy.window().should((win: any) => {
      const regions = new Set(win.pivot.rowModel.getItems().map((row: any) => row.__pivot.node.path.Region));
      expect(Array.from(regions).sort()).to.deep.equal(['East', 'West']);
    });
    cy.get('[data-test="spec-json"]').should('contain', '"criteria": "\\"East\\" Or \\"West\\""');
  });

  it('should mark an invalid criteria and tell what is wrong, without applying it', () => {
    cy.get(control('criteria', 6)).clear().type('Between 1{enter}');
    cy.get(control('criteria', 6)).should('have.attr', 'aria-invalid');
    cy.get(`${designer} .slick-pivot-designer-status`).should('have.text', 'Region: invalid criteria: And is expected at the end');
    cy.window().its('pivot').invoke('getSpec').its('filters').its(1).should('deep.equal', { field: 'Region', criteria: '"East" Or "West"' });
    cy.get(control('criteria', 6)).clear().type('Like "[EN]*"{enter}');
    cy.get(control('criteria', 6)).should('not.have.attr', 'aria-invalid');
    cy.get(`${designer} .slick-pivot-designer-status`).should('not.be.visible');
    cy.window().should((win: any) => {
      const regions = new Set(win.pivot.rowModel.getItems().map((row: any) => row.__pivot.node.path.Region));
      expect(Array.from(regions).sort()).to.deep.equal(['East', 'North']);
    });
  });

  it('should keep every column valid when its Total or its Crosstab role changes', () => {
    // a Where column filters the rows without being shown
    cy.get(control('total', 6)).select('Where');
    cy.get(control('crosstab', 6)).should('be.disabled').find('option:selected').should('have.text', '(not shown)');
    expectHeaderNames(['Category', 'Product', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    // a Value aggregates
    cy.get(control('crosstab', 1)).select('Value');
    cy.get(control('total', 1)).find('option:selected').should('have.text', 'Count');
    cy.window().its('pivot').invoke('getSpec').its('rows').should('deep.equal', ['Category']);
    cy.get(control('crosstab', 1)).select('Row Heading');
    cy.get(control('total', 1)).select('Group By');
    cy.window().its('pivot').invoke('getSpec').its('rows').should('deep.equal', ['Category', 'Product']);
  });

  it('should sort a Row Heading, and move and remove the columns from their header', () => {
    cy.get(control('sort', 0)).select('Descending');
    cy.get(cell(0, 0)).should('have.text', 'Seafood');
    cy.get(`${designGrid} button[data-action="move-right"][data-index="0"]`).click();
    expectHeaderNames(['Product', 'Category', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    cy.focused().should('have.attr', 'data-action', 'move-right').and('have.attr', 'data-index', '1');
    cy.get(`${designGrid} button[data-action="remove"][data-index="1"]`).click();
    expectHeaderNames(['Product', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
  });

  it('should add a field dragged from the field list before the column it is dropped on', () => {
    cy.window().then((win: any) => {
      const dataTransfer = new win.DataTransfer();
      cy.get(fieldItem('Channel')).trigger('dragstart', { dataTransfer });
      cy.get(control('field', 1)).closest('td').trigger('dragover', { dataTransfer }).should('have.class', 'slick-pivot-designer-drop-target');
      cy.get(control('field', 1)).closest('td').trigger('drop', { dataTransfer });
      cy.get(fieldItem('Channel')).trigger('dragend', { dataTransfer });
    });
    expectHeaderNames(['Product', 'Channel', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    cy.get(`${designGrid} .slick-pivot-designer-drop-target`).should('not.exist');
  });

  it('should give the grid its own rows and columns back with Pivot Mode off, and show the crosstab again with it on', () => {
    cy.get(`${designer} .slick-pivot-mode-checkbox`).should('be.checked').uncheck();
    expectHeaderNames(['Region', 'Country', 'Channel', 'Salesperson', 'Category', 'Product', 'Order Id', 'Order Date', 'Units', 'Unit Price', 'Amount']);
    cy.window().its('grid').invoke('getDataLength').should('eq', 5000);
    cy.get(`${designer} .slick-pivot-designer-body`).should('have.attr', 'inert');
    cy.get(`${designer} .slick-pivot-mode-checkbox`).check();
    expectHeaderNames(['Product', 'Channel', 'Total Of Amount', 'Qtr1', 'Qtr2', 'Qtr3', 'Qtr4']);
    cy.get(`${designer} .slick-pivot-designer-body`).should('not.have.attr', 'inert');
  });
});
