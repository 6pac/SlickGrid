/**
 * Regression test for the clipboard paste-delay race.
 *
 * CellExternalCopyManager pasted by focusing a hidden decoy textarea and reading
 * it back after a FIXED setTimeout (CLIPBOARD_PASTE_DELAY, default 100ms). Under
 * machine load the timeout could fire before the browser delivered the paste into
 * the textarea — silently losing or truncating the paste. This was the mechanism
 * behind long-standing intermittent failures of the excel-spreadsheet spec.
 *
 * The fix decodes on the decoy's 'input' event (which fires once the pasted value
 * is populated) and keeps the timeout only as a fallback.
 *
 * The spec is SELF-HOSTING: the repro harness is served from this file via
 * cy.intercept (no page is added to examples/). Determinism trick: the harness
 * sets clipboardPasteDelay to 6000ms. With the event-driven decode the paste
 * completes ~immediately; on the fixed-delay code nothing happens until the 6s
 * fallback. Asserting the pasted value within a 2.5s window therefore FAILS on
 * the pre-fix code and PASSES with the fix — no reliance on machine-load timing.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: clipboard paste delay</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 700px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script src="/dist/browser/plugins/slick.cellrangedecorator.js"></script>
<script src="/dist/browser/plugins/slick.cellrangeselector.js"></script>
<script src="/dist/browser/plugins/slick.cellselectionmodel.js"></script>
<script src="/dist/browser/plugins/slick.cellexternalcopymanager.js"></script>
<script src="/dist/browser/slick.editors.js"></script>
<script>
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 60 },
    { id: 'a', name: 'A', field: 'a', width: 120, editor: Slick.Editors.Text },
    { id: 'b', name: 'B', field: 'b', width: 120, editor: Slick.Editors.Text },
    { id: 'c', name: 'C', field: 'c', width: 120, editor: Slick.Editors.Text }
  ];
  var data = [];
  for (var i = 0; i < 30; i++) {
    data.push({ id: i, a: 'A' + i, b: 'B' + i, c: 'C' + i });
  }
  var grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    editable: true,
    autoEdit: false,
    rowHeight: 25
  });
  grid.setSelectionModel(new Slick.CellSelectionModel());
  grid.registerPlugin(new Slick.CellExternalCopyManager({
    includeHeaderWhenCopying: false,
    clipboardPasteDelay: 6000    // fixed-delay path takes 6s; the event-driven fix ignores it
  }));
  window.grid = grid;
  window.getData = function () { return data; };
</script>
</body>
</html>`;

describe('Quirk - clipboard paste must decode on delivery, not on a fixed delay', { retries: 1 }, () => {
  const cellSelector = (row: number, cellClass: string) => `#myGrid .slick-row[data-row="${row}"] .slick-cell.${cellClass}`;

  // visit + paste live in ONE test so a retry re-visits and gets a FRESH page:
  // otherwise a failed first attempt's pending 6s fallback timer eventually
  // decodes its paste into the persistent page, and the retried attempt would
  // see that late-landed value and pass spuriously on unfixed code.
  it('should paste a copied cell promptly even with a huge clipboardPasteDelay', () => {
    cy.intercept('GET', '/quirk-clipboard-paste-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-clipboard-paste-harness.html`);
    cy.window().its('grid').should('exist');

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
