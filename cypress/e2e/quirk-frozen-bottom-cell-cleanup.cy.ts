/**
 * Regression test for the frozen-bottom cell-cleanup bug (triage Q1).
 *
 * In frozenBottom mode, cleanUpCells() exempted EVERY row from horizontal cell
 * cleanup — the top-band disjunct `(row <= actualFrozenRow)` was missing the
 * `!frozenBottom` qualifier that its sibling cleanupRows() has — so scrolling
 * horizontally back and forth accumulated cell DOM nodes on every row without
 * bound (a memory/DOM leak that degrades scroll performance).
 *
 * The repro page's in-page self-check scrolls a heavily-virtualized frozen-bottom
 * grid right and back and asserts a scrollable row's rendered cell count stays
 * bounded. FAILS on the unfixed code (count ≈ 40, "CHECKS FAILED") and PASSES with
 * the fix (count ≈ visible columns, "ALL CHECKS PASSED").
 */
describe('Quirk Q1 - frozen-bottom grids must still clean up off-screen cells', { retries: 1 }, () => {
  it('should load the repro grid with frozen bottom rows', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-quirk-q1-frozen-bottom-cell-cleanup.html`);
    cy.window().its('grid').should('exist');
    cy.window().then((win: any) => {
      expect(win.grid.getOptions().frozenBottom, 'frozenBottom active').to.eq(true);
    });
  });

  it('should keep off-screen cells cleaned after horizontal scrolling', () => {
    // call the in-page self-check directly (the on-page button is covered by the
    // deliberately-oversized 40-column header, so a real click isn't needed)
    cy.window().then((win: any) => {
      expect(win.runChecks(), 'in-page cell-cleanup self-checks').to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
