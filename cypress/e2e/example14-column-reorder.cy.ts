// Characterization tests for header column reordering (currently implemented with SortableJS).
// These specs pin down the observable behavior that must survive the SortableJS removal refactor:
// they are expected to pass identically before and after the drag engine is replaced.
describe('Example 14 - Column Header Reorder (characterization)', { retries: 1 }, () => {
  const initialTitles = ['Server', 'CPU0', 'CPU1', 'CPU2', 'CPU3'];
  const initialIds = ['server', 'cpu0', 'cpu1', 'cpu2', 'cpu3'];

  const expectHeaderTitles = (titles: string[]) => {
    cy.get('#myGrid .slick-header-columns-left')
      .children()
      .should('have.length', titles.length)
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  };

  const expectColumnIds = (ids: string[]) => {
    cy.window().then((win: any) => {
      expect(win.grid.getColumns().map((c: any) => c.id)).to.deep.eq(ids);
    });
  };

  const expectReorderCallCount = (count: number) => {
    cy.window().its('columnsReorderedCalls').should('have.length', count);
  };

  it('should load the example and have the expected initial column order', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example14-highlighting.html`);
    expectHeaderTitles(initialTitles);
    expectColumnIds(initialIds);

    // record every onColumnsReordered payload so specs can assert exactly when and with what the event fires
    cy.window().then((win: any) => {
      win.columnsReorderedCalls = [];
      win.grid.onColumnsReordered.subscribe((_e: any, args: any) => {
        win.columnsReorderedCalls.push({
          impactedColumnIds: args.impactedColumns.map((c: any) => c.id),
          previousColumnOrder: [...args.previousColumnOrder],
        });
      });
    });
  });

  it('should drag CPU0 onto CPU2 and reorder it after CPU2, firing onColumnsReordered with the correct payload', () => {
    cy.contains('#myGrid .slick-header-column', 'CPU2').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'CPU0').drag($target);
    });

    expectHeaderTitles(['Server', 'CPU1', 'CPU2', 'CPU0', 'CPU3']);
    expectColumnIds(['server', 'cpu1', 'cpu2', 'cpu0', 'cpu3']);

    // the data cells are re-rendered under the new column order
    cy.get('#myGrid .grid-canvas [style*="top: 0px;"] > .slick-cell.l0.r0').should('contain', 'Server 0');

    expectReorderCallCount(1);
    cy.window().then((win: any) => {
      const call = win.columnsReorderedCalls[0];
      expect(call.previousColumnOrder).to.deep.eq(initialIds);
      expect(call.impactedColumnIds).to.deep.eq(['server', 'cpu1', 'cpu2', 'cpu0', 'cpu3']);
    });
  });

  it('should drag CPU0 back onto CPU1 (leftward) and restore the initial column order', () => {
    cy.contains('#myGrid .slick-header-column', 'CPU1').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'CPU0').drag($target);
    });

    expectHeaderTitles(initialTitles);
    expectColumnIds(initialIds);

    expectReorderCallCount(2);
    cy.window().then((win: any) => {
      const call = win.columnsReorderedCalls[1];
      expect(call.previousColumnOrder).to.deep.eq(['server', 'cpu1', 'cpu2', 'cpu0', 'cpu3']);
      expect(call.impactedColumnIds).to.deep.eq(initialIds);
    });
  });

  it('should not reorder nor fire onColumnsReordered when a column is dropped onto itself', () => {
    cy.contains('#myGrid .slick-header-column', 'CPU0').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'CPU0').drag($target);
    });

    expectHeaderTitles(initialTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(2);
  });

  it('should not allow dragging the unorderable "Server" column', () => {
    cy.get('#myGrid .slick-header-column:nth(0)').should('have.class', 'unorderable');

    cy.contains('#myGrid .slick-header-column', 'CPU1').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'Server').drag($target);
    });

    expectHeaderTitles(initialTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(2);
  });

  it('should not allow dropping a column onto the unorderable "Server" column', () => {
    cy.contains('#myGrid .slick-header-column', 'Server').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'CPU1').drag($target);
    });

    expectHeaderTitles(initialTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(2);
  });

  it('should still allow resizing the unorderable "Server" column', () => {
    cy.get('#myGrid .slick-header-column:nth(0)').then(($header) => {
      const widthBefore = $header.outerWidth() as number;

      cy.get('#myGrid .slick-header-column:nth(0) .slick-resizable-handle').then(($handle) => {
        const rect = $handle[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        cy.wrap($handle)
          .trigger('mousedown', { which: 1, button: 0, clientX: startX, clientY: y, pageX: startX, pageY: y, force: true });
        cy.get('body')
          .trigger('mousemove', { clientX: startX + 40, clientY: y, pageX: startX + 40, pageY: y, force: true })
          .trigger('mousemove', { clientX: startX + 40, clientY: y, pageX: startX + 40, pageY: y, force: true })
          .trigger('mouseup', { clientX: startX + 40, clientY: y, pageX: startX + 40, pageY: y, force: true });
      });

      cy.get('#myGrid .slick-header-column:nth(0)').should(($headerAfter) => {
        expect($headerAfter.outerWidth()).to.be.greaterThan(widthBefore + 20);
      });
    });

    expectHeaderTitles(initialTitles);
    expectReorderCallCount(2);
  });

  // Characterizes the CORRECT behavior, which the current SortableJS implementation does NOT have:
  // today a hidden column is silently dropped from the grid after any reorder, because hidden columns
  // get no header element rendered and the SortableJS toArray() read-back therefore omits them.
  // The native reorder engine (PR 2 of the SortableJS removal) fixes this with column-map reconciliation.
  // Enable this test when that engine lands.
  it.skip('should keep hidden columns in the column set when reordering', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      cols[2].hidden = true; // hide "CPU1"
      win.grid.setColumns(cols);
    });

    cy.contains('#myGrid .slick-header-column', 'CPU2').then(($target) => {
      cy.contains('#myGrid .slick-header-column', 'CPU0').drag($target);
    });

    cy.window().then((win: any) => {
      const ids = win.grid.getColumns().map((c: any) => c.id);
      expect(ids).to.have.length(5);
      expect(ids).to.include('cpu1'); // the hidden column must not be lost
    });

    // restore for any subsequent spec
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const hiddenCol = cols.find((c: any) => c.id === 'cpu1');
      if (hiddenCol) { hiddenCol.hidden = false; }
      win.grid.setColumns(cols);
    });
  });
});
