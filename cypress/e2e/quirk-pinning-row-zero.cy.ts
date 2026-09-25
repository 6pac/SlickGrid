/**
 * Regression test for empty row-pinning configurations.
 *
 * Empty pinning arrays must not create an empty docking band or materialize the
 * docking overlay. The two-grid harness is served through cy.intercept so both
 * an empty top configuration and an empty bottom configuration are covered.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: empty row pinning</title>
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

  // Empty top pinning — must behave exactly like an ordinary grid.
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ pinning: { rows: { top: [] } } }, base));
  // Empty bottom pinning — same behavior.
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ pinning: { rows: { bottom: [] } } }, base));
  window.gridA = gridA; window.gridB = gridB;

  function isVisible(el) {
    return !!el && el.offsetParent !== null && el.offsetHeight > 0;
  }
  function stateOf(container) {
    var canvasRows = document.querySelectorAll(container + ' .grid-canvas .slick-row').length;
    var overlay = document.querySelector(container + ' .slick-docking-overlay');
    return { canvasRows: canvasRows, overlayVisible: isVisible(overlay) };
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    var a = stateOf('#gridA');
    check('A (empty top pinning): rows remain in the live canvas', a.canvasRows > 0, 'rows=' + a.canvasRows);
    check('A (empty top pinning): no docking overlay is shown', !a.overlayVisible, 'visible=' + a.overlayVisible);

    var b = stateOf('#gridB');
    check('B (empty bottom pinning): rows remain in the live canvas', b.canvasRows > 0, 'rows=' + b.canvasRows);
    check('B (empty bottom pinning): no docking overlay is shown', !b.overlayVisible, 'visible=' + b.overlayVisible);

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - empty row pinning must mean no docking', { retries: 1 }, () => {
  it('should behave exactly like an ordinary grid in both empty variants', () => {
    cy.intercept('GET', '/quirk-pinning-row-zero-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-row-zero-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page empty pinning self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
