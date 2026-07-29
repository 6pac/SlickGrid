/**
 * Regression test for the frozen-bottom hit-testing bug (triage Q29).
 *
 * getCellFromEvent()/setActiveCellInternal() computed the bottom-canvas row offset
 * from a LIVE measurement of the top canvas (`Utils.height(_canvasTopL)`) in
 * frozenBottom mode, while the render path places bottom-canvas rows using
 * getFrozenRowOffset(). The two diverge whenever the dataset is shorter than the
 * viewport, because updateRowCount floors the body canvas height at the viewport
 * height — so clicking the frozen bottom row resolved to a row ~viewport/rowHeight
 * rows away. Both call sites now use getFrozenRowOffset(actualFrozenRow), the same
 * offset the render path used to place the row.
 *
 * The repro page synthesizes clicks at real cell rects and asserts getCellFromEvent
 * resolves the correct rows (frozen-bottom target + top-freeze control). Verified
 * to FAIL pre-fix and PASS post-fix.
 */
describe('Quirk Q29 - frozen-bottom hit testing must use the render offset', { retries: 1 }, () => {
  it('should load the two repro grids', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-quirk-q29-frozen-bottom-hit-testing.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');
  });

  it('should resolve clicked rows correctly in frozen-bottom and top-freeze grids', () => {
    cy.window().then((win: any) => {
      expect(win.runChecks(), 'in-page hit-testing self-checks').to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
