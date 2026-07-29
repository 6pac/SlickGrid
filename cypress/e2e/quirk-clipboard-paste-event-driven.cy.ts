/**
 * Regression test for the clipboard paste-delay race (triage Q30).
 *
 * CellExternalCopyManager pasted by focusing a hidden decoy textarea and reading
 * it back after a FIXED setTimeout (CLIPBOARD_PASTE_DELAY, default 100ms). Under
 * machine load the timeout could fire before the browser delivered the paste into
 * the textarea — silently losing or truncating the paste. This was the mechanism
 * behind the long-standing intermittent failures of the excel-spreadsheet spec.
 *
 * The fix decodes on the decoy's 'input' event (which fires once the pasted value
 * is populated) and keeps the timeout only as a fallback.
 *
 * Determinism trick: the repro page sets clipboardPasteDelay to 6000ms. With the
 * event-driven decode the paste completes ~immediately; on the fixed-delay code
 * nothing happens until the 6s fallback. Asserting the pasted value within a 2.5s
 * window therefore FAILS on the pre-fix code and PASSES with the fix — no reliance
 * on machine-load timing.
 */
describe('Quirk Q30 - clipboard paste must decode on delivery, not on a fixed delay', { retries: 1 }, () => {
  const cellSelector = (row: number, cellClass: string) => `#myGrid .slick-row[data-row="${row}"] .slick-cell.${cellClass}`;

  it('should load the repro grid', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-quirk-q30-clipboard-paste-delay.html`);
    cy.window().its('grid').should('exist');
  });

  it('should paste a copied cell promptly even with a huge clipboardPasteDelay', () => {
    // copy A2 ("A2"), move down, paste into A3
    cy.get(cellSelector(2, 'l1')).click();
    cy.get('.slick-cell.active').realPress(['Control', 'C']);
    cy.get('.slick-cell.active').type('{downarrow}');
    cy.get('.slick-cell.active').realPress(['Control', 'V']);

    // event-driven decode lands the value ~immediately; the pre-fix fixed-delay
    // path would leave the cell unchanged until the 6s fallback, so this 2.5s
    // window separates the two behaviors deterministically
    cy.get(cellSelector(3, 'l1'), { timeout: 2500 }).should('have.text', 'A2');
    cy.window().then((win: any) => {
      expect(win.getData()[3].a, 'underlying data updated').to.eq('A2');
    });
  });
});
