/**
 * Characterization of the band ROUTING and PREDICATE semantics ahead of M19b
 * (facade column/row routing — FACADE-FEASIBILITY.md). These tests pin the
 * boundary-value behavior the 'one predicate per historical semantic' rule
 * protects: the inclusive `<= frozenColumn` / `<= frozenRow` comparisons, the
 * header-cells-take-'frozen'-left-band-only vs data-cells-left-OR-right split,
 * and cross-band element routing at the exact boundary indices.
 *
 * Named to sort after the example-* specs (shared browser session; see
 * viewportmgr-lazy-materialization.cy.ts).
 */

describe('band routing - left freeze + frozen rows (example-frozen-columns-and-rows: frozenColumn 2, frozenRow 5)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns-and-rows.html`);
  });

  it('should route getHeaderColumn across the freeze boundary: idx 2 -> left container, idx 3 -> right container', () => {
    cy.window().then((win: any) => {
      const left = win.grid.getHeaderColumn(2) as HTMLElement;
      const right = win.grid.getHeaderColumn(3) as HTMLElement;
      expect(left.parentElement!.classList.contains('slick-header-columns-left'), 'idx 2 in left band').to.be.true;
      expect(right.parentElement!.classList.contains('slick-header-columns-right'), 'idx 3 in main band').to.be.true;
    });
  });

  it('should route getHeaderRowColumn across the same boundary', () => {
    cy.window().then((win: any) => {
      const left = win.grid.getHeaderRowColumn(2) as HTMLElement;
      const right = win.grid.getHeaderRowColumn(3) as HTMLElement;
      expect(left.parentElement!.classList.contains('slick-headerrow-columns-left'), 'idx 2 in left band').to.be.true;
      expect(right.parentElement!.classList.contains('slick-headerrow-columns-right'), 'idx 3 in main band').to.be.true;
    });
  });

  it('should give header CELLS the frozen class only in the left band, inclusive of the boundary column', () => {
    cy.window().then((win: any) => {
      [0, 1, 2].forEach((i) => {
        expect((win.grid.getHeaderColumn(i) as HTMLElement).classList.contains('frozen'), `header ${i} frozen`).to.be.true;
      });
      expect((win.grid.getHeaderColumn(3) as HTMLElement).classList.contains('frozen'), 'header 3 not frozen').to.be.false;
    });
  });

  it('should mark every top-band row frozen AND exactly one bottom-canvas row (the row == frozenRow inclusive quirk)', () => {
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').then(($rows) => {
      expect($rows.length, '5 frozen-band rows rendered').to.eq(5);
      $rows.each((_, row) => expect(row.classList.contains('frozen'), 'top row frozen').to.be.true);
    });
    // row index 5 satisfies `row <= frozenRow` (inclusive) but renders in the
    // scrollable bottom canvas — the historical off-by-one, pinned deliberately
    cy.get('#myGrid .grid-canvas-bottom.grid-canvas-left .slick-row.frozen').should('have.length', 1);
  });

  it('should give data CELLS the frozen class in the left band only', () => {
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').first().find('.slick-cell.frozen').should('have.length', 3);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right .slick-row').first().find('.slick-cell.frozen').should('have.length', 0);
  });

  it('should span bands in getColumnByIndex and getHeaderChildren', () => {
    cy.window().then((win: any) => {
      const visibleCount = win.grid.getColumns().filter((c: any) => !c.hidden).length;
      expect(win.grid.getHeaderChildren().length, 'header children across all bands').to.eq(visibleCount);
      expect(win.grid.getColumnByIndex(2), 'idx 2 same element via both walks').to.eq(win.grid.getHeaderColumn(2));
      expect(win.grid.getColumnByIndex(3), 'idx 3 same element via both walks').to.eq(win.grid.getHeaderColumn(3));
    });
  });

  it('should never horizontally scroll for a left-frozen cell, inclusive of the boundary column', () => {
    cy.window().then((win: any) => {
      const scroller = win.document.querySelector('#myGrid .slick-pane-top.slick-pane-right .slick-viewport') as HTMLElement;
      expect(scroller.scrollLeft, 'starts unscrolled').to.eq(0);
      win.grid.scrollCellIntoView(8, 2); // boundary column: cell <= frozenColumn early-out
      expect(scroller.scrollLeft, 'boundary frozen cell does not scroll').to.eq(0);
    });
  });
});

describe('band routing - right-frozen band (example-frozen-right-columns: frozenRightColumn 2, no left freeze)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-right-columns.html`);
  });

  it('should route getHeaderColumn across the RF boundary: main stays in the left container, RF in the right-frozen container', () => {
    cy.window().then((win: any) => {
      const rfStart = win.grid.getFrozenRightStartIndex();
      const main = win.grid.getHeaderColumn(rfStart - 1) as HTMLElement;
      const rf = win.grid.getHeaderColumn(rfStart) as HTMLElement;
      expect(main.parentElement!.classList.contains('slick-header-columns-left'), 'main band hosts pre-boundary column').to.be.true;
      expect(rf.parentElement!.classList.contains('slick-header-columns-right-frozen'), 'RF band hosts boundary column').to.be.true;
    });
  });

  it('should NOT give RF header cells the frozen class (left-band-only semantic) while RF data cells DO get it', () => {
    cy.window().then((win: any) => {
      const rfStart = win.grid.getFrozenRightStartIndex();
      expect((win.grid.getHeaderColumn(rfStart) as HTMLElement).classList.contains('frozen'), 'RF header cell not frozen-classed').to.be.false;
    });
    cy.get('#myGrid .grid-canvas-right-frozen .slick-row').first().find('.slick-cell.frozen').should('have.length', 2);
    cy.get('#myGrid .grid-canvas-left .slick-row').first().find('.slick-cell.frozen').should('have.length', 0);
  });

  it('should never horizontally scroll for a right-frozen cell', () => {
    cy.window().then((win: any) => {
      const rfStart = win.grid.getFrozenRightStartIndex();
      const scroller = win.document.querySelector('#myGrid .slick-pane-top.slick-pane-left .slick-viewport') as HTMLElement;
      expect(scroller.scrollLeft, 'starts unscrolled').to.eq(0);
      win.grid.scrollCellIntoView(5, rfStart);
      expect(scroller.scrollLeft, 'RF cell does not scroll').to.eq(0);
    });
  });
});

describe('band routing - simultaneous top+bottom frozen rows (example-frozen-top-bottom-rows: frozenRow 3, frozenBottomRow 2)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-top-bottom-rows.html`);
  });

  it('should mark all top-band rows and all bottom-frozen-band rows frozen, plus exactly one body row (inclusive quirk)', () => {
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').then(($rows) => {
      expect($rows.length, '3 top-frozen rows').to.eq(3);
      $rows.each((_, row) => expect(row.classList.contains('frozen'), 'top row frozen').to.be.true);
    });
    cy.get('#myGrid .grid-canvas-bottom-frozen .slick-row').then(($rows) => {
      expect($rows.length, '2 bottom-frozen rows').to.eq(2);
      $rows.each((_, row) => expect(row.classList.contains('frozen'), 'bf row frozen').to.be.true);
    });
    // row index 3 passes `row <= frozenRow` (inclusive) but lives in the body canvas
    cy.get('#myGrid .grid-canvas-bottom.grid-canvas-left:not(.grid-canvas-bottom-frozen) .slick-row.frozen').should('have.length', 1);
  });
});
