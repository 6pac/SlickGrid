/**
 * Regression test for off-viewport alwaysRenderColumn band routing.
 *
 * appendRowHtml has two cell-routing branches. The in-viewport branch routes by
 * column band (pinned-left region vs scrolling region). The
 * OFF-VIEWPORT branch — taken when a column has scrolled out past the LEFT edge —
 * appended alwaysRenderColumn cells to the pinned-left region unconditionally.
 * So an alwaysRenderColumn column sitting RIGHT of the pin rendered its
 * off-viewport cells into the clipped left region: mispositioned/invisible, and its
 * cellNodesByColumnIdx entry mapped to a node in the wrong pane (editors, plugins
 * and getCellNode all consume that mapping).
 *
 * The spec is SELF-HOSTING: the harness is served from this file via cy.intercept
 * (no page is added to examples/). It pins column 0, marks a middle scrollable
 * column alwaysRenderColumn, scrolls it off the left edge via the grid API, and
 * asserts the cell node remains in the scrolling region.
 */

const ARC_COL = 5; // the alwaysRenderColumn column index (right of the freeze)

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: alwaysRenderColumn band routing</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 700px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var COLS = 30, ROWS = 100, ARC = ${ARC_COL};
  var columns = [];
  for (var c = 0; c < COLS; c++) {
    columns.push({ id: 'c' + c, name: 'Col ' + c, field: 'c' + c, width: 100, alwaysRenderColumn: c === ARC });
  }
  var data = [];
  for (var r = 0; r < ROWS; r++) {
    var row = {};
    for (var k = 0; k < COLS; k++) { row['c' + k] = 'r' + r + 'c' + k; }
    data.push(row);
  }
  var grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    pinning: { columns: { left: 0 } }, // column 0 pinned-left; ARC stays in the scrolling band
    rowHeight: 25
  });
  window.grid = grid;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    // the CALLER scrolls and lets the async scroll handler settle before invoking
    // this (the grid's cached scrollLeft updates in the scroll handler, not
    // synchronously in scrollCellIntoView) — here we only assert
    var node = grid.getCellNode(80, ARC);
    check('alwaysRenderColumn cell renders on a freshly-scrolled-in row', !!node, node ? 'present' : 'missing');
    if (node) {
      var scrollingRegion = node.closest('.slick-scrolling-cells');
      check('off-viewport alwaysRenderColumn cell lives in the scrolling region (its own band)',
        !!scrollingRegion, 'region=' + (scrollingRegion ? scrollingRegion.className : 'none'));
    }

    // control: the pinned-left column (index 0) of the same fresh row stays LEFT
    var frozenNode = grid.getCellNode(80, 0);
    var pinnedRegion = frozenNode && frozenNode.closest('.slick-pinned-left-cells');
    check('control: pinned-left column cell stays in the pinned-left region',
      !!pinnedRegion,
      'region=' + (pinnedRegion ? pinnedRegion.className : 'none'));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - off-viewport alwaysRenderColumn cells must render in their own column band', { retries: 1 }, () => {
  it('should keep the always-rendered scrolling-band cell in its region when scrolled off-left', () => {
    cy.intercept('GET', '/quirk-always-render-column-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-always-render-column-harness.html`);
    cy.window().its('grid').should('exist');

    // TWO-STEP scroll, settling between steps. Step 1 scrolls far RIGHT on an
    // already-rendered row (the async scroll handler then updates the cached
    // horizontal range). Step 2 scrolls DOWN to row 80 — never rendered at load —
    // so it renders FRESH while column ARC sits off past the LEFT edge: exactly
    // the off-viewport append branch under test. (A single combined
    // scrollCellIntoView(80, 29) does NOT repro: it scrolls vertically first and
    // renders the fresh row synchronously while scrollLeft is still 0, routing
    // the cell in-viewport; cleanUpCells then deliberately never removes
    // alwaysRenderColumn cells, so that correct node persists.)
    cy.window().then((win: any) => {
      win.grid.scrollCellIntoView(0, 29);   // horizontal first, on a rendered row
    });
    cy.wait(200);                            // let the scroll handler re-render
    cy.window().then((win: any) => {
      win.grid.scrollCellIntoView(80, 29);  // now the fresh vertical render happens far-right
    });
    cy.wait(200);
    cy.window().then((win: any) => {
      win.grid.render();
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page band-routing self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
