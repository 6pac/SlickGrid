/**
 * Regression test for cell cleanup in a bottom-pinned grid.
 *
 * Bottom-pinned rows use the docking overlay, but ordinary rows must continue
 * to remove off-screen cells during horizontal scrolling. The self-hosted
 * harness keeps the test independent of an example page.
 */

const COLS = 40;

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: bottom-pinned cell cleanup</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 700px; height: 360px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var COLS = ${COLS}, ROWS = 30;
  var columns = [];
  for (var c = 0; c < COLS; c++) {
    columns.push({ id: 'c' + c, name: 'Col ' + c, field: 'c' + c, width: 100 });
  }
  var data = [];
  for (var r = 0; r < ROWS; r++) {
    var row = {};
    for (var c2 = 0; c2 < COLS; c2++) { row['c' + c2] = 'r' + r + 'c' + c2; }
    data.push(row);
  }
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,   // keep the harness free of the SortableJS dependency
    pinning: { rows: { bottom: [28, 29] } },
    rowHeight: 25
  });

  // Measure a normal scrolling row; bottom-pinned rows are deliberately excluded.
  window.scrollableRowCells = function () {
    var el = document.querySelector('#myGrid .slick-row[data-row="3"]');
    return el ? el.querySelectorAll('.slick-cell').length : -1;
  };
  // drive horizontal scrolling through the grid API so real render + cleanUpCells
  // passes run (synthetic scrollLeft writes do not drive SlickGrid's scroll render)
  window.scrollRoundTrip = function () {
    for (var k = 0; k < 3; k++) {
      window.grid.scrollCellIntoView(3, COLS - 1); window.grid.render();
      window.grid.scrollCellIntoView(3, 0);        window.grid.render();
    }
  };
</script>
</body>
</html>`;

describe('Quirk - bottom-pinned grids must still clean up off-screen cells', { retries: 1 }, () => {
  it('should load the self-hosted repro harness with bottom-pinned rows', () => {
    cy.intercept('GET', '/quirk-pinning-bottom-cell-cleanup-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-bottom-cell-cleanup-harness.html`);
    cy.window().its('grid').should('exist');
    cy.window().then((win: any) => {
      expect(win.grid.getOptions().pinning.rows.bottom, 'bottom pinning active').to.deep.equal([28, 29]);
    });
  });

  it('should keep a scrollable row cell count bounded after horizontal scrolling', () => {
    cy.window().then((win: any) => {
      // baseline: only the visible columns (+buffer) are rendered
      const before = win.scrollableRowCells();
      expect(before, 'baseline cells rendered').to.be.greaterThan(0);
      expect(before, 'baseline is a virtualized subset, not every column').to.be.lessThan(COLS);

      win.scrollRoundTrip();
    });

    // allow the async cleanup to settle, then assert the count did not balloon:
    // with the bug, off-screen cells are never removed and the count climbs to
    // ~COLS; with the fix it stays near the visible-column count. Half of COLS is
    // a wide, stable threshold separating the two behaviors.
    cy.wait(100);
    cy.window().then((win: any) => {
      const after = win.scrollableRowCells();
      expect(after, `scrollable-row cells after scrolling (of ${COLS})`).to.be.greaterThan(0);
      expect(after, `scrollable-row cells after scrolling (of ${COLS})`).to.be.lessThan(COLS / 2);
    });
  });
});
