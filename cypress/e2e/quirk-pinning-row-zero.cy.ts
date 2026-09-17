/**
 * Regression test for the frozenRow: 0 degenerate configuration.
 *
 * frozenRow is a COUNT, but setFrozenOptions gated on `frozenRow > -1`, so
 * frozenRow: 0 activated the full frozen-row machinery around an EMPTY band:
 * hasFrozenRows true, split panes shown (a visible empty band strip), and — since
 * actualFrozenRow computed to 0 — every row routed to the BOTTOM canvas in top
 * mode. With frozenBottom: true, actualFrozenRow = dataLength and the whole body
 * rendered in the top canvas while bottom-mode offset math measured it.
 *
 * The fix clamps at the source: `frozenRow > 0`. Zero frozen rows IS no freeze.
 *
 * The spec is SELF-HOSTING: the two-grid harness (frozenRow: 0 top variant +
 * frozenRow: 0 with frozenBottom) is served from this file via cy.intercept (no
 * page is added to examples/). It asserts both grids behave exactly like unfrozen
 * grids: all rows in the top canvas, no bottom pane visible. Verified to FAIL
 * pre-fix (grid A renders every row in the bottom canvas; both show the bottom
 * pane) and PASS with the fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: frozenRow zero clamp</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 220px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 200 },
    { id: 'b', name: 'B', field: 'b', width: 200 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < 12; i++) { d.push({ id: i, a: 'a' + i, b: 'b' + i }); }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };
  function cols() { return columns.map(function (c) { return Object.assign({}, c); }); }

  // Grid A: frozenRow: 0 (top variant) — must behave exactly like an unfrozen grid
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ frozenRow: 0 }, base));
  // Grid B: frozenRow: 0 + frozenBottom: true — same
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ frozenRow: 0, frozenBottom: true }, base));
  window.gridA = gridA; window.gridB = gridB;

  function isVisible(el) {
    return !!el && el.offsetParent !== null && el.offsetHeight > 0;
  }
  function stateOf(container) {
    var topRows = document.querySelectorAll(container + ' .grid-canvas-top .slick-row').length;
    var bottomRows = document.querySelectorAll(container + ' .grid-canvas-bottom .slick-row').length;
    var bottomPane = document.querySelector(container + ' .slick-pane-bottom');
    return { topRows: topRows, bottomRows: bottomRows, bottomPaneVisible: isVisible(bottomPane) };
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    var a = stateOf('#gridA');
    check('A (frozenRow: 0): rows render in the top canvas, none in the bottom',
      a.topRows > 0 && a.bottomRows === 0, 'top=' + a.topRows + ' bottom=' + a.bottomRows);
    check('A (frozenRow: 0): no bottom pane is shown', !a.bottomPaneVisible, 'visible=' + a.bottomPaneVisible);

    var b = stateOf('#gridB');
    check('B (frozenRow: 0 + frozenBottom): rows render in the top canvas, none in the bottom',
      b.topRows > 0 && b.bottomRows === 0, 'top=' + b.topRows + ' bottom=' + b.bottomRows);
    check('B (frozenRow: 0 + frozenBottom): no bottom pane is shown', !b.bottomPaneVisible, 'visible=' + b.bottomPaneVisible);

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - frozenRow: 0 must mean no freeze', { retries: 1 }, () => {
  it('should behave exactly like an unfrozen grid in both frozenRow: 0 variants', () => {
    cy.intercept('GET', '/quirk-frozen-row-zero-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-frozen-row-zero-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page frozenRow: 0 self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
