/**
 * DOM-shape characterization for the single-viewport renderer.
 *
 * The grid no longer creates the legacy six-pane/four-viewport structure.
 * Every grid has one live viewport and one canvas. Configured pinning or
 * sticky docking adds stable left/center/right chrome and row regions; row
 * pinning additionally moves pinned rows into the docking overlay.
 */

interface DockingShapeOptions {
  hasDocking: boolean;
  hasRowDocking: boolean;
  topPinnedRows?: number[];
  bottomPinnedRows?: number[];
}

/** Asserts the canonical structure shared by ordinary and docked grids. */
function assertCanonicalShape({ hasDocking, hasRowDocking, topPinnedRows = [], bottomPinnedRows = [] }: DockingShapeOptions): void {
  cy.get('#myGrid > .slick-pane').should('have.length', 0);
  cy.get('#myGrid > .slick-header-root').should('have.length', 1);
  cy.get('#myGrid > .slick-content-root').should('have.length', 1);
  cy.get('#myGrid .slick-viewport').should('have.length', 1);
  cy.get('#myGrid .grid-canvas').should('have.length', 1);

  if (!hasDocking) {
    cy.get('#myGrid .slick-header-left > .slick-header-columns-left').should('have.length', 1);
    cy.get('#myGrid .slick-headerrow-columns-left').should('have.length', 1);
    cy.get('#myGrid .slick-header-columns-root').should('not.exist');
    cy.get('#myGrid .slick-docking-horizontal-scroller').should('not.exist');
    cy.get('#myGrid .slick-docking-overlay').should('not.exist');
    cy.get('#myGrid .slick-row-docked').should('have.length', 0);
    return;
  }

  // Docked chrome keeps one header/header-row collection and marks pinned
  // cells by side. Do not depend on the internal wrapper depth or whether an
  // empty center wrapper is materialized by the loaded bundle.
  cy.get('#myGrid .slick-header-columns').should('have.length.greaterThan', 0);
  cy.get('#myGrid .slick-headerrow-columns').should('have.length.greaterThan', 0);
  cy.get('#myGrid .slick-header-column').should('have.length.greaterThan', 0);
  cy.get('#myGrid .slick-docking-horizontal-scroller').should('have.length', 1);

  // Docked grids render each row with stable cell-region siblings.
  cy.get('#myGrid .slick-row-docked').should('have.length.greaterThan', 0);
  cy.get('#myGrid .slick-row-docked').first().then(($row) => {
    cy.wrap($row).children('.slick-pinned-left-cells').should('have.length', 1);
    cy.wrap($row).children('.slick-scrolling-cells').should('have.length', 1);
    cy.wrap($row).children('.slick-pinned-right-cells').should('have.length', 1);
  });

  if (!hasRowDocking) {
    cy.get('#myGrid .slick-docking-overlay').should('not.exist');
    return;
  }

  cy.get('#myGrid .slick-docking-overlay').should('have.length', 1);
  topPinnedRows.concat(bottomPinnedRows).forEach((row) => {
    cy.get(`#myGrid .slick-docking-overlay .slick-row[data-row="${row}"]`).should('have.length', 1);
    cy.get(`#myGrid .grid-canvas .slick-row[data-row="${row}"]`).should('not.exist');
  });
}

describe('DOM shape characterization - non-pinned grid (example1-simple)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
  });

  it('should build one viewport and one canvas without docking regions', () => {
    assertCanonicalShape({ hasDocking: false, hasRowDocking: false });
  });
});

describe('DOM shape characterization - pinned columns only (example-pinning-columns)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns.html`);
  });

  it('should build one viewport with docked chrome and row regions', () => {
    assertCanonicalShape({ hasDocking: true, hasRowDocking: false });
  });
});

describe('DOM shape characterization - pinned rows only (example-pinning-rows)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-rows.html`);
  });

  it('should route pinned rows to the docking overlay', () => {
    assertCanonicalShape({ hasDocking: true, hasRowDocking: true, topPinnedRows: [0, 1], bottomPinnedRows: [49999] });
  });
});

describe('DOM shape characterization - pinned columns and rows (example-pinning-columns-and-rows)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-rows.html`);
  });

  it('should route pinned rows through the same single-viewport docking layout', () => {
    assertCanonicalShape({ hasDocking: true, hasRowDocking: true, topPinnedRows: [0, 1], bottomPinnedRows: [49999] });
  });
});
