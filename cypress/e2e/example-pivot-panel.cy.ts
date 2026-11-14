describe('Example - Pivot table with PivotTable Fields', { retries: 1 }, () => {
  const pivotTable = '#pivotTable .slick-pivot-table';
  const grid = `${pivotTable} .slick-pivot-table-grid`;
  const panel = `${pivotTable} .slick-pivot-table-fields`;
  const status = `${pivotTable} .slick-pivot-table-status`;
  const toolbarItem = (item: string) => `${pivotTable} .slick-pivot-toolbar [data-item="${item}"]`;
  const details = 'dialog.slick-pivot-details';
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

  /** The group header cells of the pinned and sticky columns are drawn exactly above the header cells of their columns */
  function expectDockedGroupsAligned() {
    cy.window().should((win: any) => {
      const cells = Array.from<HTMLElement>(win.document.querySelectorAll(`${grid} .slick-pivot-header-group-docked`));
      expect(cells.length).to.be.greaterThan(0);
      cells.forEach((cell) => {
        const first = win.grid.getHeaderColumn(cell.dataset.firstColumn).getBoundingClientRect();
        const last = win.grid.getHeaderColumn(cell.dataset.lastColumn).getBoundingClientRect();
        const rect = cell.getBoundingClientRect();
        expect(Math.abs(rect.left - Math.min(first.left, last.left)), `left of "${cell.textContent}"`).to.be.lessThan(1.5);
        expect(Math.abs(rect.right - Math.max(first.right, last.right)), `right of "${cell.textContent}"`).to.be.lessThan(1.5);
      });
    });
  }

  /** Every column whose header is in view has its cell rendered in a row */
  function expectVisibleCellsRendered(row = 1) {
    cy.window().should((win: any) => {
      const viewport = win.document.querySelector(`${grid} .slick-viewport`).getBoundingClientRect();
      const inView = (elm: Element) => {
        const rect = elm.getBoundingClientRect();
        return rect.right > viewport.left + 2 && rect.left < viewport.right - 2;
      };
      const columns = win.grid.getColumns();
      const headerIds = Array.from<HTMLElement>(win.document.querySelectorAll(`${grid} .slick-header-column`)).filter(inView).map((header) => header.dataset.id);
      const cellIds = Array.from<HTMLElement>(win.document.querySelectorAll(`${grid} .slick-row[data-row="${row}"] .slick-cell`)).filter(inView).map((cell) => columns[Number(/\bl(\d+)\b/.exec(cell.className)![1])].id);
      expect(headerIds.length).to.be.greaterThan(2);
      expect(headerIds.filter((id) => !cellIds.includes(id))).to.deep.equal([]);
    });
  }

  function scrollHorizontally(fraction: number) {
    cy.get(`${grid} .slick-horizontal-scroller`).then(($scroller) => {
      const scroller = $scroller[0];
      const direction = scroller.closest('.slick-rtl') ? -1 : 1;
      scroller.scrollLeft = direction * Math.round((scroller.scrollWidth - scroller.clientWidth) * fraction);
    });
  }

  // a test failing with the details dialog open would leave the page behind it out of reach
  afterEach(() => {
    cy.window().then((win: any) => win.pivotTable?.getDetails()?.close());
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pivot-panel.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get(`${panel} .slick-pivot-panel-title`).should('have.text', 'PivotTable Fields');
  });

  it('should build the pivot table from its parts: a toolbar, the grid, the field list and a status bar', () => {
    cy.get(`${pivotTable} > *`).then(($parts) => {
      expect(Array.from($parts).map((part) => part.className)).to.deep.equal(['slick-pivot-table-toolbar', 'slick-pivot-table-body slick-pivot-table-fields-end', 'slick-pivot-table-status']);
    });
    cy.get(`${pivotTable} .slick-pivot-toolbar`).should('have.attr', 'role', 'group').and('have.attr', 'aria-label', 'PivotTable options');
    cy.get(`${pivotTable} .slick-pivot-toolbar [data-item]`).should(($items) => {
      expect(Array.from($items).map((item) => item.getAttribute('data-item'))).to.deep.equal(['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo', 'fieldList']);
    });
    cy.get(`${toolbarItem('layout')} select`).should('have.value', 'compact');
    cy.get(`${toolbarItem('subtotals')} select`).should('have.value', 'top');
    cy.get(`${toolbarItem('grandTotals')} select`).should('have.value', 'both');
    // Undo and Redo are only shown while values can be edited
    cy.get(toolbarItem('undo')).should('not.be.visible');
    cy.get(toolbarItem('fieldList')).should('have.attr', 'aria-pressed', 'true');
    // the field list can be closed because the toolbar can open it again
    cy.get(`${panel} .slick-pivot-panel-close`).should('exist');
  });

  it('should list the fields, checking the ones used by the pivot', () => {
    cy.get(`${fieldItem('Region')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('Amount')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('Product')} .slick-pivot-field-checkbox`).should('not.be.checked');
    cy.get(`${panel} .slick-pivot-field-group`).then(($groups) => {
      expect(Array.from($groups).map((group) => group.textContent)).to.deep.equal(['Customer', 'Product', 'Order', 'Measures']);
    });
    expectAreaFields('filters', ['Channel']);
    expectAreaFields('columns', ['OrderDate.year']);
    expectAreaFields('rows', ['Region', 'Country']);
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Sum of Amount');
    cy.get(`${pill('filters', 'Channel')} .slick-pivot-pill-summary`).should('have.text', '(All)');
  });

  it('should render the initial pivot in compact layout with the captions, subtotals and a sticky grand total row', () => {
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
    cy.get(`${grid} .slick-pivot-header-caption`).first().should('have.text', 'Sum of Amount');
    cy.get(`${grid} .slick-pivot-header-caption`).last().should('have.text', 'Years (Order Date)');
    cy.get(cell(0, 0)).should('contain', 'East').find('.slick-pivot-toggle').should('have.class', 'expanded');
    cy.get(`${grid} .slick-row[data-row="0"]`).should('have.class', 'slick-pivot-group');
    cy.get(cell(0, 1)).should('have.text', '$128,587');
    cy.get(cell(1, 0)).should('contain', 'China');
    // a short pivot shows its sticky grand total right below its last row
    cy.window().then((win: any) => expect(win.grid.getOptions().stickyRows.bottom).to.deep.equal(['grandTotal:[]']));
    cy.get(`${grid} .slick-pivot-grand-total`).should('not.have.class', 'slick-row-pinned-bottom');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l0`).should('contain', 'Grand Total');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '$1,647,338');
    cy.get(status).should('contain', '5,000 of 5,000 source rows');
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
    expectAreaFields('columns', ['OrderDate.year', 'Country']);
    expectAreaFields('rows', ['Region']);
    cy.get(`${grid} .slick-pivot-header-caption`).last().should('have.text', 'Years (Order Date) / Country');
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
    expectAreaFields('columns', ['OrderDate.year']);
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
    expectAreaFields('columns', ['OrderDate.year', 'Region']);
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
    cy.get(status).should('contain', '3,373 of 5,000 source rows');

    openPillMenu('filters', 'Channel');
    clickMenuItem('Filter…');
    cy.get(`${panel} .slick-pivot-filter-popup .slick-pivot-filter-clear`).click();
    cy.get(`${pill('filters', 'Channel')} .slick-pivot-pill-summary`).should('have.text', '(All)');
    cy.get(status).should('contain', '5,000 of 5,000 source rows');
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

  it('should change the summary of a value from the "Summarize Values By" items of its pill menu', () => {
    const radioItems = `${panel} .slick-pivot-menu [role="menuitemradio"]`;
    openPillMenu('values', 'Amount');
    cy.get(`${panel} .slick-pivot-menu [role="group"] .slick-pivot-menu-heading`).should('have.text', 'Summarize Values By');
    cy.get(radioItems).should(($items) => {
      expect(Array.from($items).map((item) => item.textContent)).to.deep.equal(['Sum', 'Count', 'Average', 'Max', 'Min', 'Distinct Count']);
    });
    cy.get(`${radioItems}[aria-checked="true"]`).should('have.text', 'Sum');
    cy.get(radioItems).contains('Count').click();
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Count of Amount');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '5,000');

    openPillMenu('values', 'Amount');
    cy.get(`${radioItems}[aria-checked="true"]`).should('have.text', 'Count');
    cy.get(radioItems).contains('Sum').click();
    cy.get(`${areaList('values')} .slick-pivot-pill-label`).should('have.text', 'Sum of Amount');
    cy.get(`${grid} .slick-pivot-grand-total .slick-cell.l4`).should('have.text', '1,647,338');
  });

  it('should switch to the tabular layout with bottom subtotals', () => {
    cy.get(`${toolbarItem('layout')} select`).select('tabular');
    expectHeaderNames(['Region', 'Country', '2023', '2024', '2025', 'Grand Total']);
    cy.get(cell(0, 0)).should('contain', 'East');
    cy.get(cell(0, 1)).should('contain', 'China');
    cy.get(cell(1, 0)).should('have.text', '');
    cy.get(`${grid} .slick-pivot-subtotal`).first().find('.slick-cell.l0').should('contain', 'East Total');
    cy.get(`${toolbarItem('subtotals')} select`).select('none');
    cy.get(`${grid} .slick-pivot-subtotal`).should('not.exist');
    cy.get(`${toolbarItem('layout')} select`).select('compact');
    cy.get(`${toolbarItem('subtotals')} select`).select('top');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
  });

  it('should list the source rows of a double-clicked cell in a sortable details dialog', () => {
    cy.get(cell(1, 1)).dblclick();
    cy.get(details).should('be.visible').and('have.attr', 'open');
    cy.focused().should('have.class', 'slick-pivot-details-close');
    cy.window().then((win: any) => {
      const item = win.grid.getDataItem(1);
      const columnKey = win.pivot.getColumnInfo(win.grid.getColumns()[1].id).columnKey;
      const expected = win.pivot.getEngine().getSourceRows(win.pivot.getSourceRows(), win.pivot.getSpec(), item.__pivot.key, columnKey).length;
      cy.get(`${details} .slick-pivot-details-title`).should('have.text', `${expected} source rows — East › China / 2023`);
      cy.wrap(win.pivotTable.getDetails().getGrid().getDataLength()).should('eq', expected);
    });
    // one column per field, the computed Amount included
    cy.get(`${details} .slick-header-column .slick-column-name`).should(($names) => {
      expect(Array.from($names).map((name) => name.textContent)).to.deep.equal(['Region', 'Country', 'Channel', 'Salesperson', 'Category', 'Product', 'Order Id', 'Order Date', 'Units', 'Unit Price', 'Discount', 'Amount']);
    });
    cy.get(`${details} .slick-row[data-row="0"] .slick-cell.l0`).should('have.text', 'East');
    // Amount is in the number format of Sum of Amount (whole numbers since the Value Field Settings test), Unit Price keeps its decimals
    cy.window().then((win: any) => win.pivotTable.getDetails().getGrid().scrollCellIntoView(0, 11));
    cy.get(`${details} .slick-row[data-row="0"] .slick-cell.l11`).invoke('text').should('match', /^[\d,]+$/);
    cy.get(`${details} .slick-row[data-row="0"] .slick-cell.l9`).invoke('text').should('match', /^\d+\.\d{1,2}$/);

    // sort by Units, largest first
    cy.get(`${details} .slick-header-column`).contains('Units').click().click();
    cy.window().should((win: any) => {
      const detailsGrid = win.pivotTable.getDetails().getGrid();
      const units = Array.from({ length: detailsGrid.getDataLength() }, (_v, i) => detailsGrid.getDataItem(i).Units);
      expect(units).to.deep.equal([...units].sort((a, b) => b - a));
    });

    cy.get(`${details} .slick-pivot-details-close`).click();
    cy.get(details).should('not.be.visible');

    // a click on the backdrop closes it too
    cy.get(cell(0, 4)).dblclick();
    cy.get(`${details} .slick-pivot-details-title`).should('contain', 'East');
    cy.get(details).then(($dialog) => {
      const win = $dialog[0].ownerDocument.defaultView as any;
      $dialog[0].dispatchEvent(new win.MouseEvent('click', { bubbles: true, clientX: 2, clientY: 2 }));
    });
    cy.get(details).should('not.be.visible');
  });

  it('should change the grand totals, and expand or collapse every group, from the toolbar', () => {
    cy.get(`${toolbarItem('grandTotals')} select`).select('rows');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025']);
    cy.get(`${grid} .slick-pivot-grand-total`).should('exist');
    cy.get(`${toolbarItem('grandTotals')} select`).select('columns');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
    cy.get(`${grid} .slick-pivot-grand-total`).should('not.exist');
    cy.get(`${toolbarItem('grandTotals')} select`).select('none');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025']);
    cy.get(`${toolbarItem('grandTotals')} select`).select('both');
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);

    cy.get(toolbarItem('collapseAll')).click();
    cy.window().its('grid').invoke('getDataLength').should('eq', 5);
    cy.get(toolbarItem('expandAll')).click();
    cy.window().its('grid').invoke('getDataLength').should('eq', 17);

    // the toolbar follows a spec changed another way
    cy.window().then((win: any) => win.pivot.updateSpec({ layout: 'outline' }));
    cy.get(`${toolbarItem('layout')} select`).should('have.value', 'outline');
    cy.window().then((win: any) => win.pivot.updateSpec({ layout: 'compact' }));
  });

  it('should hide and show the field list, the grid taking the space', () => {
    cy.get(grid).invoke('width').then((width) => {
      cy.get(toolbarItem('fieldList')).click();
      cy.get(panel).should('not.be.visible');
      cy.get(toolbarItem('fieldList')).should('have.attr', 'aria-pressed', 'false');
      cy.get(grid).invoke('width').should('be.greaterThan', Number(width) + 200);
      cy.get(`${grid} .slick-viewport`).invoke('width').should('be.greaterThan', Number(width) + 200);

      cy.get(toolbarItem('fieldList')).click();
      cy.get(panel).should('be.visible');
      // the close button of the field list hides it and gives the focus to the toolbar button
      cy.get(`${panel} .slick-pivot-panel-close`).click();
      cy.get(panel).should('not.be.visible');
      cy.focused().should('have.attr', 'data-item', 'fieldList');
      cy.get(toolbarItem('fieldList')).click();
      cy.get(grid).invoke('width').should('eq', width);
    });
  });

  it('should resize the field list by dragging its splitter or with its keyboard', () => {
    const splitter = `${pivotTable} .slick-pivot-table-splitter`;
    cy.get(splitter).should('have.attr', 'role', 'separator').and('have.attr', 'aria-valuenow', '300').and('have.attr', 'aria-valuemin', '240');
    cy.get(splitter).then(($splitter) => {
      const rect = $splitter[0].getBoundingClientRect();
      const pointer = { eventConstructor: 'PointerEvent', pointerId: 1, button: 0, clientY: rect.top + 40 };
      const x = rect.left + rect.width / 2;
      cy.wrap($splitter).trigger('pointerdown', { ...pointer, clientX: x });
      cy.wrap($splitter).trigger('pointermove', { ...pointer, clientX: x - 60 });
      cy.wrap($splitter).trigger('pointerup', { ...pointer, clientX: x - 60 });
    });
    cy.get(splitter).should('have.attr', 'aria-valuenow', '360');
    cy.get(panel).invoke('outerWidth').should('eq', 360);

    // the arrows move the splitter the way they point
    pressKey(cy.get(splitter).focus(), 'ArrowRight');
    cy.get(splitter).should('have.attr', 'aria-valuenow', '344');
    pressKey(cy.get(splitter), 'ArrowLeft', { shiftKey: true });
    cy.get(splitter).should('have.attr', 'aria-valuenow', '408');
    pressKey(cy.get(splitter), 'Home');
    cy.get(splitter).should('have.attr', 'aria-valuenow', '240');
    pressKey(cy.get(splitter), 'End');
    cy.get(splitter).invoke('attr', 'aria-valuemax').then((max) => cy.get(splitter).should('have.attr', 'aria-valuenow', max));
    cy.window().then((win: any) => win.pivotTable.setFieldListWidth(300));
    cy.get(panel).invoke('outerWidth').should('eq', 300);
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
    cy.get(`${toolbarItem('layout')} select`).select('outline');
    cy.window().its('pivot').invoke('getSpec').its('layout').should('eq', 'outline');
    cy.get('[data-test="restore-layout-btn"]').click();
    cy.window().its('pivot').invoke('getSpec').its('layout').should('eq', 'compact');
    cy.get(`${toolbarItem('layout')} select`).should('have.value', 'compact');
  });

  it('should group a date field by years, quarters and months when checking it, listing its levels below it', () => {
    // the date field is in use while one of its levels is: the years are the column field
    cy.get(`${fieldItem('OrderDate')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('OrderDate.year')} .slick-pivot-field-checkbox`).should('be.checked');
    cy.get(`${fieldItem('OrderDate')} .slick-pivot-field-checkbox`).uncheck();
    expectAreaFields('columns', []);

    cy.get(`${fieldItem('OrderDate')} .slick-pivot-field-checkbox`).check();
    expectAreaFields('rows', ['Region', 'Country', 'OrderDate.year', 'OrderDate.quarter', 'OrderDate.month']);
    cy.get(fieldItem('OrderDate.year')).should('have.class', 'slick-pivot-field-level').find('.slick-pivot-field-name').should('have.text', 'Years');
    cy.get(`${fieldItem('OrderDate.month')} .slick-pivot-field-checkbox`).should('be.checked').and('have.attr', 'aria-label', 'Months (Order Date)');
    cy.get(`${fieldItem('OrderDate.day')} .slick-pivot-field-checkbox`).should('not.be.checked');
    cy.get(`${pill('rows', 'OrderDate.year')} .slick-pivot-pill-label`).should('have.text', 'Years (Order Date)');
    cy.get(cell(2, 0)).should('contain', '2023');
    cy.get(cell(3, 0)).should('contain', 'Qtr1');
    cy.get(cell(4, 0)).should('contain', 'Jan');

    // a level on its own
    cy.get(`${fieldItem('OrderDate.day')} .slick-pivot-field-checkbox`).check();
    expectAreaFields('rows', ['Region', 'Country', 'OrderDate.year', 'OrderDate.quarter', 'OrderDate.month', 'OrderDate.day']);

    // unchecking the date field removes every level
    cy.get(`${fieldItem('OrderDate')} .slick-pivot-field-checkbox`).uncheck();
    expectAreaFields('rows', ['Region', 'Country']);

    // a level can be dragged on its own
    dragTo(fieldItem('OrderDate.year'), areaList('columns'));
    expectAreaFields('columns', ['OrderDate.year']);
    expectHeaderNames(['Row Labels', '2023', '2024', '2025', 'Grand Total']);
  });

  it('should write a value typed into a cell back to its source rows, update every total, and undo it', () => {
    cy.get('[data-test="write-back"]').check();
    cy.get(`${areaList('values')} .slick-pivot-pill`).should('have.length', 2);
    cy.get(`${grid} .slick-pivot-editable`).should('exist');

    cy.window().then((win: any) => {
      const value = (row: number, column: number) => win.grid.getDataItem(row)[win.grid.getColumns()[column].field];
      const grandTotalRow = () => win.grid.getDataLength() - 1;
      // China 2023 units, East 2023 units and the grand total of the units
      const before = { china: value(1, 2), east: value(0, 2), grand: value(grandTotalRow(), 8) };

      // Amount is computed, so it cannot be edited
      win.grid.setActiveCell(1, 1);
      win.grid.editActiveCell();
      expect(win.grid.getCellEditor()).to.eq(null);

      win.grid.setActiveCell(1, 2);
      win.grid.editActiveCell();
      cy.get(`${grid} .slick-cell.active input`).clear().type('1000{enter}');
      cy.get(cell(1, 2)).should('have.text', '1,000');
      cy.get(toolbarItem('undo')).should('be.visible').and('not.be.disabled');
      cy.get(toolbarItem('redo')).should('be.disabled');
      cy.window().should(() => {
        expect(value(0, 2)).to.eq(before.east - before.china + 1000);
        expect(value(grandTotalRow(), 8)).to.eq(before.grand - before.china + 1000);
        const rows = win.pivot.getEngine().getSourceRows(win.pivot.getSourceRows(), win.pivot.getSpec(), '["East","China"]', '[2023]');
        expect(rows.every((row: any) => Number.isInteger(row.Units)), 'whole units').to.eq(true);
      });

      cy.get(toolbarItem('undo')).click();
      cy.get(cell(1, 2)).should('have.text', before.china.toLocaleString('en-US'));
      cy.get(toolbarItem('undo')).should('be.disabled');

      // Redo applies the very same values again, Ctrl+Z (on the grid) takes them back
      cy.get(toolbarItem('redo')).click();
      cy.get(cell(1, 2)).should('have.text', '1,000');
      pressKey(cy.get(cell(1, 2)), 'z', { ctrlKey: true });
      cy.get(cell(1, 2)).should('have.text', before.china.toLocaleString('en-US'));
      pressKey(cy.get(cell(1, 2)), 'y', { ctrlKey: true });
      cy.get(cell(1, 2)).should('have.text', '1,000');
      cy.window().then(() => win.pivot.undo());
      cy.get(cell(1, 2)).should('have.text', before.china.toLocaleString('en-US'));
      cy.window().should(() => expect(value(grandTotalRow(), 8)).to.eq(before.grand));
    });
  });

  it('should pin or stick the grand totals, the column group headers following the docked columns', () => {
    cy.get('[data-test="grand-total-row-docking"]').select('pinned');
    cy.get(`${grid} .slick-pivot-grand-total`).should('have.class', 'slick-row-pinned-bottom');
    cy.get('[data-test="grand-total-row-docking"]').select('sticky');
    cy.get(`${grid} .slick-pivot-grand-total`).should('not.have.class', 'slick-row-pinned-bottom');

    cy.get('[data-test="grand-total-column-docking"]').select('pinned');
    cy.window().its('grid').invoke('getOptions').its('pinning.columns.right').should('have.length', 2);
    cy.get(`${grid} .slick-pivot-header-group-right`).contains('Grand Total').should('exist');
    expectDockedGroupsAligned();
    scrollHorizontally(1);
    expectDockedGroupsAligned();

    cy.get('[data-test="grand-total-column-docking"]').select('sticky');
    cy.window().its('grid').invoke('getOptions').its('pinning.columns.right').should('have.length', 0);
    cy.window().its('grid').invoke('getColumns').then((columns: any[]) => {
      expect(columns.filter((column) => column.sticky).map((column) => column.sticky)).to.deep.equal(['right', 'right']);
    });
    scrollHorizontally(0.5);
    expectDockedGroupsAligned();
    cy.get('[data-test="grand-total-column-docking"]').select('none');
    cy.get(`${grid} .slick-pivot-header-group-sticky`).should('not.exist');
  });

  it('should mirror the pivot in a right-to-left grid, rendering the visible cells of a wide pivot wherever it is scrolled', () => {
    cy.get('[data-test="rtl"]').check();
    cy.get(grid).should('have.class', 'slick-rtl');
    cy.get(pivotTable).should('have.attr', 'dir', 'rtl');
    // the field list is at the end of the line, which is on the left
    cy.get(panel).then(($panel) => cy.get(grid).should(($grid) => expect($panel[0].getBoundingClientRect().right).to.be.lessThan($grid[0].getBoundingClientRect().left)));
    cy.window().then((win: any) => win.pivot.updateSpec({ columns: ['OrderDate.year', 'OrderDate.quarter'] }));
    cy.window().its('grid').invoke('getColumns').should('have.length.greaterThan', 30);

    // the row labels are pinned at the leading edge, which is the right one
    cy.window().should((win: any) => {
      const gridRect = win.document.querySelector(grid).getBoundingClientRect();
      const rowLabels = win.grid.getHeaderColumn('__pivot_rows').getBoundingClientRect();
      expect(gridRect.right - rowLabels.right).to.be.lessThan(gridRect.width / 3);
    });
    expectDockedGroupsAligned();
    expectVisibleCellsRendered();
    scrollHorizontally(0.5);
    expectVisibleCellsRendered();
    expectDockedGroupsAligned();
    scrollHorizontally(1);
    expectVisibleCellsRendered();
    // the indentation of the compact layout starts from the right
    cy.get(`${cell(1, 0)} .slick-pivot-toggle-spacer, ${cell(1, 0)} .slick-pivot-toggle`).first().should('have.attr', 'style').and('contain', 'margin-inline-start: 15px');

    cy.get('[data-test="rtl"]').uncheck();
    cy.get(grid).should('not.have.class', 'slick-rtl');
    cy.get(pivotTable).should('have.attr', 'dir', 'ltr');
  });
});
