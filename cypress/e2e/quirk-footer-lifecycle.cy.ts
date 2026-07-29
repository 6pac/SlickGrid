/**
 * Regression tests for the footer-lifecycle bugs (triage Q5, Q19, Q27).
 *
 * Q5  — `showFooterRow: true` WITHOUT `createFooterRow` crashed at construction:
 *       getViewportHeight()'s footer term was gated on showFooterRow alone and
 *       dereferenced the undefined `_footerRowScroller[0]` (the header-row and
 *       top-header terms three lines away already use the create && show idiom).
 * Q27 — `getFooterRow()` without a footer threw a TypeError on the non-frozen
 *       `_footerRow[0]` path while the frozen path returned undefined — the same
 *       misuse failed two different ways. It now returns undefined consistently.
 * Q19 — createColumnHeaders() duplicated the footer destroy/create work that
 *       createColumnFooter() (always called right after) already does, so
 *       onFooterRowCellRendered fired TWICE per column on every setColumns, and
 *       the duplicate's right-side gating (hasFrozenColumns instead of existence)
 *       left stale right-footer cells after un-freezing.
 *
 * The repro page's in-page self-check exercises all three; this spec triggers it
 * and reads the verdict. Verified to FAIL on the pre-fix code and PASS with it.
 */
describe('Quirk footer lifecycle - Q5/Q19/Q27', { retries: 1 }, () => {
  it('should load the repro page (grid B constructing at all is part of the fix)', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-quirk-footer-lifecycle.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridC').should('exist');
  });

  it('should pass the footer-lifecycle self-checks (no crash, undefined contract, single event fire)', () => {
    cy.window().then((win: any) => {
      expect(win.runChecks(), 'in-page footer-lifecycle self-checks').to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
