/**
 * Regression test for horizontal cell virtualization of docked rows.
 *
 * Pinned rows live in the overlay and can be far outside the vertical render range (a pinned
 * last row on a long dataset). Their centre cells must still follow the horizontal render
 * range like every other row: new cells appear when scrolling right, and cells that left the
 * range are removed instead of accumulating.
 */

const COLS = 40;
const ROWS = 400;

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: docked row cell virtualization</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 600px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [];
  for (var c = 0; c < ${COLS}; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 100 });
  }
  var data = [];
  for (var i = 0; i < ${ROWS}; i++) {
    var item = { id: i };
    for (var k = 0; k < ${COLS}; k++) { item['c' + k] = i + ':' + k; }
    data.push(item);
  }
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 25,
    pinning: { rows: { top: [0], bottom: [${ROWS - 1}] } }
  });

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    function cellCount(row) {
      var node = document.querySelector('#myGrid .slick-row[data-row="' + row + '"]');
      return node ? node.querySelectorAll('.slick-cell').length : -1;
    }
    check('grid is scrolled right', grid.scrollLeft >= 3000, 'scrollLeft=' + grid.scrollLeft);
    check('top-pinned row has a cell for column 32 after scrolling right', !!grid.getCellNode(0, 32));
    check('bottom-pinned row (outside the vertical range) has a cell for column 32', !!grid.getCellNode(${ROWS - 1}, 32));
    check('scrolling row 5 has a cell for column 32 (control)', !!grid.getCellNode(5, 32));
    check('top-pinned row dropped its off-screen column 2 cell', !grid.getCellNode(0, 2));
    check('bottom-pinned row dropped its off-screen column 2 cell', !grid.getCellNode(${ROWS - 1}, 2));
    check('scrolling row 5 dropped its off-screen column 2 cell (control)', !grid.getCellNode(5, 2));
    check('top-pinned row cell count stays bounded', cellCount(0) > 0 && cellCount(0) < ${COLS}, 'cells=' + cellCount(0));
    check('bottom-pinned row cell count stays bounded', cellCount(${ROWS - 1}) > 0 && cellCount(${ROWS - 1}) < ${COLS}, 'cells=' + cellCount(${ROWS - 1}));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - docked rows virtualize their centre cells horizontally', { retries: 1 }, () => {
  it('should add and remove centre cells of pinned rows as the grid scrolls horizontally', () => {
    cy.intercept('GET', '/quirk-pinning-docked-row-cell-virtualization-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-docked-row-cell-virtualization-harness.html`);
    cy.window().its('grid').should('exist');

    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(1500, 0);
    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(3000, 0);
    cy.window().should((win: any) => {
      expect(win.grid.scrollLeft, 'scrollLeft applied').to.be.gte(3000);
    });

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page docked-row virtualization self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
