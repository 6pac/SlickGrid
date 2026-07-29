/**
 * Regression test for the updateRowPositions fragment bug (triage Q20).
 *
 * updateRowPositions() — which runs whenever the virtual-scroll paging offset
 * changes — repositioned only rowNode[0], the LEFT-pane fragment. With frozen
 * columns a row has one fragment per column pane, so after a paging-offset jump
 * the right-pane fragment kept its stale top and the two halves of the same row
 * drifted vertically apart across the freeze line. (It also used bare getRowTop()
 * where the render path uses getRowTop() - getFrozenRowOffset(); the fix reuses
 * the render-time formula for all fragments.)
 *
 * The repro page forces paging (small maxSupportedCssHeight) on a frozen-column
 * grid, sweeps scrollTo across page boundaries, and asserts every rendered row's
 * left/right fragments agree on top. Verified to FAIL pre-fix and PASS post-fix.
 */
describe('Quirk Q20 - updateRowPositions must reposition every row fragment', { retries: 1 }, () => {
  it('should load the paged frozen-column repro grid', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-quirk-q20-row-positions-fragments.html`);
    cy.window().its('grid').should('exist');
  });

  it('should keep left/right fragments aligned across paging-offset jumps', () => {
    cy.window().then((win: any) => {
      expect(win.runChecks(), 'in-page fragment-alignment self-checks').to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
