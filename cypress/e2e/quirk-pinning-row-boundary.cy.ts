/**
 * Regression test for pinned-row boundary canonicalization.
 *
 * The row-band boundary was compared differently at six sites, and they
 * contradicted each other and the render split (rows >= actualFrozenRow go to the
 * bottom canvas):
 * - row rendering and cache cleanup must agree on which rows are permanently
 *   pinned and therefore must remain in the docking overlay/cache;
 * - canvas lookup must still resolve the first scrollable row in the single
 *   viewport;
 * - scrollRowIntoView must allow the last center row to be revealed when rows
 *   are pinned to the bottom edge.
 *
 * All sites now route through two predicates that match the render split:
 * isBottomBandRow and isPinnedRowIdx now derive from the unified pinning state.
 *
 * The spec is SELF-HOSTING (harness served via cy.intercept; no example page).
 * Each check pins one drifted site. Verified to FAIL pre-fix on every drifted
 * site and PASS with the fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: frozen-row boundary</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 300px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var ROWS = 1000, FR = 3;
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 200 },
    { id: 'b', name: 'B', field: 'b', width: 200 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < ROWS; i++) { d.push({ id: i, a: 'a' + i, b: 'b' + i }); }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };
  function cols() { return columns.map(function (c) { return Object.assign({}, c); }); }

  // Grid A: 3 permanently pinned TOP rows; first scrollable row = 3
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ pinning: { rows: { top: [0, 1, 2] } } }, base));
  // Grid B: 3 permanently pinned BOTTOM rows; last scrollable row = 996
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ pinning: { rows: { bottom: [997, 998, 999] } } }, base));
  window.gridA = gridA; window.gridB = gridB;

  function pinnedRows(container, className) {
    var out = [];
    document.querySelectorAll(container + ' .slick-row.' + className).forEach(function (r) { out.push(parseInt(r.dataset.row, 10)); });
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }
    function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

    // 1. Current docking classes identify exactly the configured pinned rows.
    var aClassed = pinnedRows('#gridA', 'slick-row-pinned-top');
    check('A(top): pinned class on exactly rows 0..' + (FR - 1), eq(aClassed, [0, 1, 2]), 'classed=' + JSON.stringify(aClassed));
    var bClassed = pinnedRows('#gridB', 'slick-row-pinned-bottom');
    check('B(bottom): pinned class on exactly rows 997..999', eq(bClassed, [997, 998, 999]), 'classed=' + JSON.stringify(bClassed));

    // 2. getCanvasNode pane agreement: the canvas returned for the first
    //    scrollable row must be the canvas that CONTAINS that row's DOM
    var apiCanvas = gridA.getCanvasNode(0, FR);
    var domRow = document.querySelector('#gridA .slick-row[data-row="' + FR + '"]');
    var domCanvas = domRow && domRow.closest('.grid-canvas');
    check('A(top): getCanvasNode(0, ' + FR + ') returns the canvas containing row ' + FR,
      !!apiCanvas && !!domCanvas && apiCanvas === domCanvas,
      'api=' + (apiCanvas && apiCanvas.className) + ' dom=' + (domCanvas && domCanvas.className));

    // 3. B(bottom): scrollRowIntoView must scroll the LAST scrollable row (996)
    gridB.scrollRowIntoView(996);
    var vpTop = gridB.getViewport().top;
    check('B(bottom): scrollRowIntoView(996) scrolls (viewport.top > 0)', vpTop > 0, 'viewport.top=' + vpTop);

    // 4. A(top): the first scrollable row must be EVICTABLE - scroll far away and
    //    confirm row FR leaves the row cache (frozen rows 0..2 stay)
    gridA.scrollRowIntoView(600);
    gridA.render();
    var cache = gridA.getRowCache();
    check('A(top): first scrollable row ' + FR + ' evicted after far scroll', !cache[FR], 'cached=' + !!cache[FR]);
    check('A(top): frozen row 0 stays cached after far scroll', !!cache[0], 'cached=' + !!cache[0]);

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - frozen-row boundary must be consistent across all comparison sites', { retries: 1 }, () => {
  it('should agree on the boundary across css classing, pane lookup, scrolling and cache eviction', () => {
    cy.intercept('GET', '/quirk-frozen-row-boundary-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-frozen-row-boundary-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page boundary self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
