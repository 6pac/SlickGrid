/**
 * Regression test for the updateRowPositions fragment bug.
 *
 * updateRowPositions() — which runs whenever the virtual-scroll paging offset
 * changes — repositioned only rowNode[0], the LEFT-pane fragment. With frozen
 * columns a row has one fragment per column pane, so after a paging-offset jump
 * the right-pane fragment kept its stale top and the two halves of the same row
 * drifted vertically apart across the freeze line. (It also used bare getRowTop()
 * where the render path uses getRowTop() - getFrozenRowOffset(); the fix reuses
 * the render-time formula for all fragments.)
 *
 * The spec is SELF-HOSTING: the repro harness is served from this file via
 * cy.intercept (no page is added to examples/). It forces paging (100k rows —
 * virtual height above the ~1M css cap), walks scrollTo finely across page
 * boundaries, and asserts every rendered row's left/right fragments agree on top.
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
    frozenColumn: 0,
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

  // compare left/right fragment tops for every rendered data-row; return worst pair
  function fragmentDivergence() {
    var canvases = document.querySelectorAll('#myGrid .grid-canvas');
    var left = canvases[0], right = canvases[1];
    var worst = { diff: 0, row: null, l: 0, r: 0, compared: 0 };
    left.querySelectorAll('.slick-row').forEach(function (lRow) {
      var r = lRow.dataset.row;
      var rRow = right.querySelector('.slick-row[data-row="' + r + '"]');
      if (!rRow) { return; }
      var lt = topOf(lRow), rt = topOf(rRow);
      worst.compared++;
      var d = Math.abs(lt - rt);
      if (d > worst.diff) { worst = { diff: d, row: r, l: lt, r: rt, compared: worst.compared }; }
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
    var worstEver = { diff: 0, row: null, l: 0, r: 0 };
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
    check('rows were compared across panes at the page boundaries', comparedTotal > 0, 'compared=' + comparedTotal);
    check('left/right fragments of every row agree on top after paging jumps (no drift)',
      worstEver.diff < 0.5,
      worstEver.row === null ? 'no divergence' : ('row ' + worstEver.row + ' L=' + worstEver.l + ' R=' + worstEver.r + ' diff=' + worstEver.diff));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - updateRowPositions must reposition every row fragment', { retries: 1 }, () => {
  it('should load the self-hosted paged frozen-column repro harness', () => {
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
