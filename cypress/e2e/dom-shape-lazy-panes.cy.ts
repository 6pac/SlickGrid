/**
 * DOM-shape characterization for the lazyPanes opt-in (Phase 3 of the ViewportMgr
 * refactor). A grid built with `lazyPanes: true` and no frozen rows/columns must
 * create ONLY the top-left pane set — 2 panes (header-left, top-left), 1 viewport,
 * 1 canvas — instead of the historical 6/4/4 structure, while remaining fully
 * functional. Companion to dom-shape-characterization.cy.ts (the default mode).
 */

describe('DOM shape - lazyPanes single-pane build (example-lazy-panes)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-lazy-panes.html`);
  });

  it('should build only the header-left and top-left panes, in order', () => {
    cy.get('#myGrid > .slick-pane')
      .should('have.length', 2)
      .then(($panes) => {
        expect($panes.eq(0)).to.have.class('slick-pane-header');
        expect($panes.eq(0)).to.have.class('slick-pane-left');
        expect($panes.eq(1)).to.have.class('slick-pane-top');
        expect($panes.eq(1)).to.have.class('slick-pane-left');
      });
    cy.get('#myGrid .slick-pane-right').should('have.length', 0);
    cy.get('#myGrid .slick-pane-bottom').should('have.length', 0);
  });

  it('should build exactly one viewport and one canvas, correctly nested', () => {
    cy.get('#myGrid .slick-viewport').should('have.length', 1);
    cy.get('#myGrid .grid-canvas').should('have.length', 1);
    cy.get('#myGrid .slick-pane-top.slick-pane-left > .slick-viewport.slick-viewport-top.slick-viewport-left').should('have.length', 1);
    cy.get('#myGrid .slick-viewport-top.slick-viewport-left > .grid-canvas.grid-canvas-top.grid-canvas-left').should('have.length', 1);
  });

  it('should build only left-side header chrome', () => {
    cy.get('#myGrid .slick-header').should('have.length', 1);
    cy.get('#myGrid .slick-header-columns').should('have.length', 1);
    cy.get('#myGrid .slick-headerrow').should('have.length', 1);
    cy.get('#myGrid .slick-top-panel-scroller').should('have.length', 1);
  });

  it('should render header columns and rows normally', () => {
    cy.get('#myGrid .slick-header-columns .slick-header-column').should('have.length', 6);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .grid-canvas .slick-row .slick-cell').first().should('contain', 'Task 0');
  });

  it('should support basic navigation (click makes a cell active)', () => {
    cy.get('#myGrid .slick-row .slick-cell').first().click();
    cy.get('#myGrid .slick-cell.active').should('have.length', 1);
  });

  it('should scroll vertically and keep rendering rows', () => {
    cy.get('#myGrid .slick-viewport').scrollTo(0, 2000);
    cy.get('#myGrid .grid-canvas .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .slick-viewport').scrollTo(0, 0);
  });
});
