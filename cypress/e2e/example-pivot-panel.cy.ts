describe('Example - Pivot table with PivotTable Fields', { retries: 1 }, () => {
  const grid = '#myGrid';
  const panel = '#pivotPanel';
  const cell = (row: number, column: number) => `${grid} .slick-row[data-row="${row}"] .slick-cell.l${column}`;
  const areaList = (area: string) => `${panel} .slick-pivot-area-list[data-area="${area}"]`;
  const pill = (area: string, field: string) => `${areaList(area)} .slick-pivot-pill[data-field="${field}"]`;
  const fieldItem = (field: string) => `${panel} .slick-pivot-field[data-field="${field}"]`;

  function expectAreaFields(area: string, fields: string[]) {
    cy.get(areaList(area)).should(($list) => {
      expect(Array.from($list.find('.slick-pivot-pill')).map((elm) => elm.getAttribute('data-field'))).to.deep.equal(fields);
    });
  }

  function expectHeaderNames(names: string[]) {
    cy.get(`${grid} .slick-header-column .slick-column-name`).should(($names) => {
      expect(Array.from($names).map((name) => name.textContent)).to.deep.equal(names);
    });
  }

  /** Drag with pointer events (the panel uses them for the mouse, pens and touch screens alike) */
  function dragTo(sourceSelector: string, targetSelector: string, position: 'top' | 'bottom' = 'bottom') {
    cy.get(sourceSelector).then(($source) => {
      const source = $source[0].getBoundingClientRect();
      cy.get(targetSelector).then(($target) => {
        const target = $target[0].getBoundingClientRect();
        const x = target.left + Math.min(40, target.width / 2);
        const y = position === 'top' ? target.top + 4 : target.bottom - 6;
        const pointer = { eventConstructor: 'PointerEvent', pointerId: 1, button: 0 };
        cy.wrap($source).trigger('pointerdown', { ...pointer, clientX: source.left + 12, clientY: source.top + 6 });
        cy.document().trigger('pointermove', { ...pointer, clientX: source.left + 30, clientY: source.top + 20 });
        cy.document().trigger('pointermove', { ...pointer, clientX: x, clientY: y });
        cy.document().trigger('pointerup', { ...pointer, clientX: x, clientY: y });
      });
    });
  }

  /** Dispatch a real KeyboardEvent (with its modifier keys) from the application window */
  function pressKey(subject: Cypress.Chainable<JQuery<HTMLElement>>, key: string, init: KeyboardEventInit = {}) {
    subject.then(($elm) => {
      const win = $elm[0].ownerDocument.defaultView as any;
      $elm[0].dispatchEvent(new win.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
    });
  }

  function openPillMenu(area: string, field: string) {
    cy.get(`${pill(area, field)} .slick-pivot-pill-menu-button`).click();
    cy.get(`${panel} .slick-pivot-menu`).should('be.visible');
  }

  function clickMenuItem(label: string) {
    cy.get(`${panel} .slick-pivot-menu .slick-pivot-menu-item`).contains(label).click();
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pivot-panel.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get(`${panel} .slick-pivot-panel-title`).should('have.text', 'PivotTable Fields');
  });

  it('should list the fields, checking the ones used by the pivot', () => {
    cy.get(`${fieldItem('Region')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('Amount')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('Product')} .slick-pivot-field-checkbox`).should('not.be.checked');
    cy.get(`${panel} .slick-pivot-field-group`).then(($groups) => {
      expect(Array.from($groups).map((group) => group.textContent)).to.deep.equal(['Customer', 'Product', 'Order', 'Measures']);
    });
    expectAreaFields('filters', ['Channel']);
    expectAreaFields('columns', ['Year']);
    expectAreaFields('rows', ['Region', 'Country']);
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Sum of Amount');
    cy.get(`${pill('filters', 'Channel')} .slick-pivot-pill-summary`).should('have.text', '(All)');
  });

  it('should render the initial pivot in compact layout with the captions, subtotals and a pinned grand total row', () => {
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
    cy.get(`${grid} .slick-pivot-header-caption`).first().should('have.text', 'Sum of Amount');
    cy.get(`${grid} .slick-pivot-header-caption`).last().should('have.text', 'Year');
    cy.get(cell(0, 0)).should('contain', 'East').find('.slick-pivot-toggle').should('have.class', 'expanded');
    cy.get(`${grid} .slick-row[data-row="0"]`).should('have.class', 'slick-pivot-group');
    cy.get(cell(0, 1)).should('have.text', '$128,587');
    cy.get(cell(1, 0)).should('contain', 'China');
    cy.get(`${grid} .slick-pivot-grand-total`).should('have.class', 'slick-row-pinned-bottom');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l0`).should('contain', 'Grand Total');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '$1,647,338');
    cy.get('[data-test="pivot-status"]').should('contain', '5,000 of 5,000 source rows');
  });

  it('should collapse and expand a row group with its toggle', () => {
    cy.get(`${cell(0, 0)} .slick-pivot-toggle`).click();
    cy.get(`${cell(0, 0)} .slick-pivot-toggle`).should('have.class', 'collapsed');
    cy.get(cell(0, 1)).should('have.text', '$128,587');
    cy.get(cell(1, 0)).should('contain', 'North');
    cy.get(`${cell(0, 0)} .slick-pivot-toggle`).click();
    cy.get(cell(1, 0)).should('contain', 'China');
  });

  it('should show the pivot of the Excel sample of issue #1020 like Excel does', () => {
    cy.get('[data-test="dataset-select"]').select('excel');
    expectHeaderNames(['Row Labels', 'Apples', 'Bananas', 'Grand Total']);
    const expected = [['1', '1', '', '1'], ['2', '2', '', '2'], ['3', '', '3', '3'], ['4', '', '4', '4'], ['Grand Total', '3', '7', '10']];
    expected.forEach((row, r) => row.forEach((text, c) => cy.get(cell(r, c)).should('have.text', text)));
    expectAreaFields('rows', ['MyCol1']);
    expectAreaFields('columns', ['MyCol2']);
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Sum of MyCol1');
  });

  it('should add a text field to the rows, and a number field to the values, when checking them', () => {
    cy.get(`${fieldItem('MyCol4')} .slick-pivot-field-checkbox`).check();
    expectAreaFields('rows', ['MyCol1', 'MyCol4']);
    cy.get(`${fieldItem('MyCol3')} .slick-pivot-field-checkbox`).check();
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).then(($labels) => {
      expect(Array.from($labels).map((label) => label.textContent)).to.deep.equal(['Sum of MyCol1', 'Sum of MyCol3']);
    });
    // two values: the Σ Values pill shows up in the columns
    expectAreaFields('columns', ['MyCol2', '$values']);

    cy.get(`${fieldItem('MyCol3')} .slick-pivot-field-checkbox`).uncheck();
    cy.get(`${fieldItem('MyCol4')} .slick-pivot-field-checkbox`).uncheck();
    expectAreaFields('rows', ['MyCol1']);
    expectAreaFields('columns', ['MyCol2']);
  });

  it('should move a field from the rows to the columns by dragging it', () => {
    cy.get('[data-test="dataset-select"]').select('sales');
    dragTo(pill('rows', 'Country'), areaList('columns'));
    expectAreaFields('columns', ['Year', 'Country']);
    expectAreaFields('rows', ['Region']);
    cy.get(`${grid} .slick-pivot-header-caption`).last().should('have.text', 'Year / Country');
    cy.get(`${grid} .slick-pivot-header-group .slick-pivot-header-label`).contains('2023').should('exist');
    cy.get(`${grid} .slick-pivot-header-group .slick-pivot-column-toggle`).should('have.length.greaterThan', 0);
  });

  it('should collapse a column group into its subtotal column', () => {
    cy.window().then((win: any) => {
      const before = win.grid.getColumns().length;
      cy.get(`${grid} .slick-pivot-header-group .slick-pivot-column-toggle`).first().click();
      cy.window().its('grid').invoke('getColumns').should('have.length.lessThan', before);
      cy.get(`${grid} .slick-pivot-column-toggle.collapsed`).should('exist');
      cy.get(`${grid} .slick-pivot-column-toggle.collapsed`).first().click();
      cy.window().its('grid').invoke('getColumns').should('have.length', before);
    });
  });

  it('should move the field back to the rows with the pill menu', () => {
    openPillMenu('columns', 'Country');
    clickMenuItem('Move to Rows');
    expectAreaFields('columns', ['Year']);
    expectAreaFields('rows', ['Region', 'Country']);
  });

  it('should reorder and move pills with the keyboard', () => {
    pressKey(cy.get(pill('rows', 'Country')).focus(), 'ArrowUp', { altKey: true });
    expectAreaFields('rows', ['Country', 'Region']);
    cy.focused().should('have.attr', 'data-field', 'Country');
    cy.get(`${panel} .slick-pivot-live`).should('contain', 'Country moved to position 1 of 2');
    pressKey(cy.focused(), 'ArrowDown', { altKey: true });
    expectAreaFields('rows', ['Region', 'Country']);
    pressKey(cy.get(pill('rows', 'Region')).focus(), 'ArrowLeft', { altKey: true });
    expectAreaFields('columns', ['Year', 'Region']);
    cy.focused().should('have.attr', 'data-area', 'columns');
    pressKey(cy.focused(), 'ArrowRight', { altKey: true });
    expectAreaFields('rows', ['Country', 'Region']);
    pressKey(cy.focused(), 'ArrowUp', { altKey: true });
    expectAreaFields('rows', ['Region', 'Country']);
  });

  it('should open the pill menu with Enter and close it with Escape', () => {
    pressKey(cy.get(pill('rows', 'Region')).focus(), 'Enter');
    cy.get(`${panel} .slick-pivot-menu`).should('be.visible');
    cy.focused().should('have.text', 'Move Down');
    pressKey(cy.focused(), 'Escape');
    cy.get(`${panel} .slick-pivot-menu`).should('not.exist');
    cy.focused().should('have.attr', 'data-field', 'Region');
  });

  it('should remove a field by dragging it out of the areas', () => {
    dragTo(pill('filters', 'Channel'), grid);
    expectAreaFields('filters', []);
    cy.get(`${fieldItem('Channel')} .slick-pivot-field-checkbox`).should('not.be.checked');
  });

  it('should add a field to the filters by dragging it from the field list, then filter its items', () => {
    dragTo(fieldItem('Channel'), areaList('filters'));
    expectAreaFields('filters', ['Channel']);
    openPillMenu('filters', 'Channel');
    clickMenuItem('Filter…');
    cy.get(`${panel} .slick-pivot-filter-popup .slick-pivot-filter-item`).should('have.length', 4);
    cy.get(`${panel} .slick-pivot-filter-popup .slick-pivot-filter-item`).contains('Wholesale').click();
    cy.get(`${panel} .slick-pivot-filter-popup .slick-pivot-dialog-ok`).click();
    cy.get(`${pill('filters', 'Channel')} .slick-pivot-pill-summary`).should('have.text', '(Multiple Items)');
    cy.get('[data-test="pivot-status"]').should('contain', '3,373 of 5,000 source rows');

    openPillMenu('filters', 'Channel');
    clickMenuItem('Filter…');
    cy.get(`${panel} .slick-pivot-filter-popup .slick-pivot-filter-clear`).click();
    cy.get(`${pill('filters', 'Channel')} .slick-pivot-pill-summary`).should('have.text', '(All)');
    cy.get('[data-test="pivot-status"]').should('contain', '5,000 of 5,000 source rows');
  });

  it('should sort the rows by the value of a column when clicking its header, within each parent', () => {
    cy.get(`${grid} .slick-header-column`).contains('Grand Total').click();
    cy.window().then((win: any) => {
      const regions = win.pivot.getResult().rowTree.children;
      const totals = regions.map((region: any) => win.pivot.getResult().cells[region.key][win.pivot.getResult().columnTree.key][0]);
      expect(totals).to.deep.equal([...totals].sort((a: number, b: number) => a - b));
    });
    cy.get(cell(0, 0)).should('contain', 'East');
    cy.get(`${grid} .slick-header-column`).contains('Grand Total').click();
    cy.get(cell(0, 0)).should('contain', 'West');
    cy.get(`${grid} .slick-header-column`).contains('Row Labels').click();
    cy.get(cell(0, 0)).should('contain', 'East');
  });

  it('should change the summary of a value with the Value Field Settings', () => {
    openPillMenu('values', 'Amount');
    clickMenuItem('Value Field Settings…');
    cy.get(`${panel} .slick-pivot-value-name`).should('have.value', 'Sum of Amount');
    cy.get(`${panel} .slick-pivot-value-format`).find('option:selected').should('have.text', 'Custom');
    cy.get(`${panel} .slick-pivot-value-aggregator`).select('avg');
    cy.get(`${panel} .slick-pivot-value-name`).should('have.value', 'Average of Amount');
    cy.get(`${panel} .slick-pivot-value-show-as`).select('percentOfColumnTotal');
    cy.get(`${panel} .slick-pivot-dialog-ok`).click();
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Average of Amount');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '100%');

    openPillMenu('values', 'Amount');
    clickMenuItem('Value Field Settings…');
    cy.get(`${panel} .slick-pivot-value-aggregator`).select('sum');
    cy.get(`${panel} .slick-pivot-value-show-as`).select('No Calculation');
    cy.get(`${panel} .slick-pivot-value-format`).select('Number (1,234)');
    cy.get(`${panel} .slick-pivot-dialog-ok`).click();
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '1,647,338');
  });

  it('should switch to the tabular layout with bottom subtotals', () => {
    cy.get('[data-test="layout-select"]').select('tabular');
    expectHeaderNames(['Region', 'Country', '2023', '2024', '2025', 'Grand Total']);
    cy.get(cell(0, 0)).should('contain', 'East');
    cy.get(cell(0, 1)).should('contain', 'China');
    cy.get(cell(1, 0)).should('have.text', '');
    cy.get(`${grid} .slick-pivot-subtotal`).first().find('.slick-cell.l0').should('contain', 'East Total');
    cy.get('[data-test="subtotals-select"]').select('none');
    cy.get(`${grid} .slick-pivot-subtotal`).should('not.exist');
    cy.get('[data-test="layout-select"]').select('compact');
    cy.get('[data-test="subtotals-select"]').select('top');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
  });

  it('should drill down to the source rows of a cell on double-click', () => {
    cy.get(cell(1, 1)).dblclick();
    cy.get('#drillDialog').should('be.visible');
    cy.window().then((win: any) => {
      const item = win.grid.getDataItem(1);
      const columnKey = win.pivot.getColumnInfo(win.grid.getColumns()[1].id).columnKey;
      const expected = win.pivot.getEngine().getSourceRows(win.pivot.getSourceRows(), win.pivot.getSpec(), item.__pivot.key, columnKey).length;
      cy.get('[data-test="drill-title"]').should('contain', `${expected} source rows`).and('contain', 'East › China / 2023');
    });
    cy.get('[data-test="drill-close-btn"]').click();
    cy.get('#drillDialog').should('not.be.visible');
  });

  it('should defer the layout update until Update is pressed', () => {
    cy.get(`${panel} .slick-pivot-defer-checkbox`).check();
    cy.get(`${fieldItem('Category')} .slick-pivot-field-checkbox`).check();
    expectAreaFields('rows', ['Region', 'Country', 'Category']);
    cy.window().its('pivot').invoke('getSpec').its('rows').should('deep.equal', ['Region', 'Country']);
    cy.get(`${panel} .slick-pivot-update-button`).should('not.be.disabled').click();
    cy.window().its('pivot').invoke('getSpec').its('rows').should('deep.equal', ['Region', 'Country', 'Category']);
    cy.get(`${panel} .slick-pivot-update-button`).should('be.disabled');
    cy.get(`${panel} .slick-pivot-defer-checkbox`).uncheck();
    cy.get(`${fieldItem('Category')} .slick-pivot-field-checkbox`).uncheck();
    expectAreaFields('rows', ['Region', 'Country']);
  });

  it('should compute the same pivot with the (simulated) asynchronous server provider', () => {
    cy.get('[data-test="server-provider"]').check();
    cy.get(grid).should('have.class', 'slick-pivot-loading');
    cy.get(grid).should('not.have.class', 'slick-pivot-loading');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '1,647,338');
    cy.get('[data-test="server-provider"]').uncheck();
  });

  it('should save and restore the layout', () => {
    cy.get('[data-test="save-layout-btn"]').click();
    cy.get('[data-test="layout-select"]').select('outline');
    cy.window().its('pivot').invoke('getSpec').its('layout').should('eq', 'outline');
    cy.get('[data-test="restore-layout-btn"]').click();
    cy.window().its('pivot').invoke('getSpec').its('layout').should('eq', 'compact');
    cy.get('[data-test="layout-select"]').should('have.value', 'compact');
  });
});
