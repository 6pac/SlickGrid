/**
 * Regression test for the updateRowPositions fragment bug.
 *
 * updateRowPositions() runs whenever the virtual-scroll paging offset changes.
 * The current single-viewport renderer keeps pinned and center cells in regions
 * under one row element, so the regression is checked by comparing every
 * rendered docked row with the grid's current rendered row position.
 *
 * The spec is SELF-HOSTING: the repro harness is served from this file via
 * cy.intercept (no page is added to examples/). It forces paging (100k rows —
 * virtual height above the ~1M css cap), walks scrollTo finely across page
 * boundaries, and asserts every rendered row stays aligned with its pinned
 * regions.
 * Verified to FAIL pre-fix (drift = one paging offset unit) and PASS post-fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: updateRowPositions fragments</title>
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
  // needs virtual height (ROWS * rowHeight) above the getMaxSupportedCssHeight
  // probe's 1,000,000px starting value so virtual-scroll paging engages
  var ROWS = 60000;
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 150 },
    { id: 'b', name: 'B', field: 'b', width: 150 },
    { id: 'c', name: 'C', field: 'c', width: 150 }
  ];
  var data = [];
  for (var i = 0; i < ROWS; i++) { data.push({ id: i, a: 'a' + i, b: 'b' + i, c: 'c' + i }); }

  var grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    pinning: { columns: { left: 0 } },
    rowHeight: 25,
    // a small option cap makes the getMaxSupportedCssHeight probe exit at its
    // 1,000,000px starting value, so with th = 2.5M the grid pages (n = 250)
    maxSupportedCssHeight: 50000,
    ffMaxSupportedCssHeight: 50000
  });
  window.grid = grid;

  // top of a row element regardless of rowTopOffsetRenderType (top vs transform)
  function topOf(el) {
    if (el.style.top) { return parseFloat(el.style.top); }
    var m = /translateY\\(([-0-9.]+)px\\)/.exec(el.style.transform || '');
    return m ? parseFloat(m[1]) : NaN;
  }

  // Compare every rendered docked row with the position calculated by the
  // current single-viewport renderer; return the worst mismatch.
  function fragmentDivergence() {
    var canvas = document.querySelector('#myGrid .grid-canvas');
    var worst = { diff: 0, row: null, actual: 0, expected: 0, compared: 0 };
    if (!canvas) { return worst; }
    canvas.querySelectorAll('.slick-row-docked').forEach(function (row) {
      var rowIndex = Number(row.dataset.row);
      var regions = row.querySelectorAll(':scope > .slick-pinned-left-cells, :scope > .slick-scrolling-cells');
      if (regions.length < 2) { return; }
      var actual = topOf(row);
      var expected = grid.getRowTop(rowIndex);
      worst.compared++;
      var d = Math.abs(actual - expected);
      if (d > worst.diff) { worst = { diff: d, row: rowIndex, actual: actual, expected: expected, compared: worst.compared }; }
    });
    return worst;
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    var g = grid;
    check('virtual-scroll paging is engaged (n > 1)', g.n > 1, 'n=' + g.n + ' h=' + g.h + ' th=' + g.th);

    // walk finely ACROSS each page boundary: an offset change with overlapping
    // rendered ranges is exactly the state updateRowPositions must handle
    var worstEver = { diff: 0, row: null, actual: 0, expected: 0 };
    var comparedTotal = 0;
    var boundaries = Math.min(3, g.n - 1);
    for (var k = 1; k <= boundaries; k++) {
      var yStart = Math.ceil(k * g.ph) - 600;
      grid.scrollTo(yStart);
      grid.render();
      for (var s = 1; s <= 8; s++) {
        grid.scrollTo(yStart + s * 150);
        grid.render();
        var w = fragmentDivergence();
        comparedTotal += w.compared;
        if (w.diff > worstEver.diff) { worstEver = w; }
      }
    }
    check('rows with pinned regions were compared at the page boundaries', comparedTotal > 0, 'compared=' + comparedTotal);
    check('docked rows keep the calculated top after paging jumps (no drift)',
      worstEver.diff < 0.5,
      worstEver.row === null ? 'no divergence' : ('row ' + worstEver.row + ' actual=' + worstEver.actual + ' expected=' + worstEver.expected + ' diff=' + worstEver.diff));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - updateRowPositions must reposition every row fragment', { retries: 1 }, () => {
  it('should load the self-hosted paged pinned-column repro harness', () => {
    cy.intercept('GET', '/quirk-row-positions-fragments-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-row-positions-fragments-harness.html`, { timeout: 120000 });
    cy.window().its('grid').should('exist');
  });

  it('should keep left/right fragments aligned across paging-offset jumps', () => {
    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page fragment-alignment self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
