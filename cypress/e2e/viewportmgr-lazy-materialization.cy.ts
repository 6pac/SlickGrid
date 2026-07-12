/**
 * Runtime materialization tests for the lazyPanes opt-in (Phase 3, ViewportMgr
 * refactor): enabling frozen rows/columns on a lazy single-pane grid must build
 * the missing panes on the fly at their canonical positions and wire their events.
 *
 * NOTE: this spec is deliberately named to sort AFTER the example-* specs, keeping
 * its freeze/unfreeze churn away from the timing-sensitive native-clipboard test in
 * example-excel-compatible-spreadsheet (testIsolation is false, so all specs share
 * one browser session).
 */

describe('DOM shape - lazyPanes dynamic materialization on runtime freeze', () => {
  it('should load the lazy example in its single-pane state', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-lazy-panes.html`);
    cy.get('#myGrid > .slick-pane').should('have.length', 2);
  });

  it('should materialize the full pane set when frozen columns are enabled at runtime', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenColumn: 1 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 6).then(($panes) => {
      // canonical sibling order must match the non-lazy build
      const expected = [
        ['slick-pane-header', 'slick-pane-left'],
        ['slick-pane-header', 'slick-pane-right'],
        ['slick-pane-top', 'slick-pane-left'],
        ['slick-pane-top', 'slick-pane-right'],
        ['slick-pane-bottom', 'slick-pane-left'],
        ['slick-pane-bottom', 'slick-pane-right'],
      ];
      expected.forEach((classes, i) => {
        classes.forEach((cls) => expect($panes.eq(i), `pane ${i} has .${cls}`).to.have.class(cls));
      });
    });
    cy.get('#myGrid .slick-viewport').should('have.length', 4);
    cy.get('#myGrid .grid-canvas').should('have.length', 4);
  });

  it('should split header columns and route rows into both top canvases', () => {
    cy.get('#myGrid .slick-pane-header.slick-pane-right').should('be.visible');
    cy.get('#myGrid .slick-header-columns-left .slick-header-column').should('have.length', 2);
    cy.get('#myGrid .slick-header-columns-right .slick-header-column').should('have.length', 4);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-cell').first().should('contain', 'Task 0');
  });

  it('should unfreeze again, hiding the right panes but keeping them in the DOM', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenColumn: -1 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 6);
    cy.get('#myGrid .slick-pane-header.slick-pane-right').should('not.be.visible');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right .slick-row').should('have.length', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .slick-header-columns-left .slick-header-column').should('have.length', 6);
  });

  it('should enable frozen rows on the already-materialized grid', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenRow: 3, frozenBottom: false });
    });

    cy.get('#myGrid .slick-pane-bottom.slick-pane-left').should('be.visible');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length', 3);
    cy.get('#myGrid .grid-canvas-bottom.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
  });

  it('should materialize directly from lazy state when frozen rows are enabled first', () => {
    // fresh page load back into lazy single-pane state
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-lazy-panes.html`);
    cy.get('#myGrid > .slick-pane').should('have.length', 2);

    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenRow: 2, frozenBottom: false });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 6);
    cy.get('#myGrid .slick-pane-bottom.slick-pane-left').should('be.visible');
    cy.get('#myGrid .slick-pane-header.slick-pane-right').should('not.be.visible');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length', 2);
    cy.get('#myGrid .grid-canvas-bottom.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
  });
});
