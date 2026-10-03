/**
 * Regression test for bottom-pinned row hit testing.
 *
 * Pinned rows live in the docking overlay, so hit testing and active-cell
 * tracking must use the rendered row's logical data attribute rather than infer
 * an index from the center canvas's natural offset.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: bottom-pinned hit testing</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 500px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var ROWS = 8;
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

  // Grid A: row 7 is permanently pinned to the bottom overlay.
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ pinning: { rows: { bottom: [7] } } }, base));
  // Grid B (control): row 0 is permanently pinned to the top overlay.
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ pinning: { rows: { top: [0] } } }, base));
  window.gridA = gridA; window.gridB = gridB;

  // synthesize the event getCellFromEvent expects, aimed at the center of a cell
  function hitTest(grid, container, row, cell) {
    var cellEl = document.querySelector(container + ' .slick-row[data-row="' + row + '"] .slick-cell.l' + cell);
    if (!cellEl) { return { error: 'cell node not found for row ' + row }; }
    var r = cellEl.getBoundingClientRect();
    var evt = { target: cellEl, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    return { got: grid.getCellFromEvent(evt) };
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    var a = hitTest(gridA, '#gridA', 7, 1);
    check('bottom pinning: click on pinned bottom row resolves to its own row',
      !a.error && !!a.got && a.got.row === 7,
      a.error || ('got row ' + (a.got && a.got.row) + ' expected 7'));

    var a2 = hitTest(gridA, '#gridA', 3, 1);
    check('bottom pinning: click on body row resolves correctly',
      !a2.error && !!a2.got && a2.got.row === 3,
      a2.error || ('got row ' + (a2.got && a2.got.row) + ' expected 3'));

    var b = hitTest(gridB, '#gridB', 4, 1);
    check('top pinning (control): click on scrollable row resolves correctly',
      !b.error && !!b.got && b.got.row === 4,
      b.error || ('got row ' + (b.got && b.got.row) + ' expected 4'));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - pinned-row hit testing uses the rendered row', { retries: 1 }, () => {
  it('should load the self-hosted two-grid repro harness', () => {
    cy.intercept('GET', '/quirk-pinning-bottom-hit-testing-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-bottom-hit-testing-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');
  });

  it('should resolve clicked rows correctly in bottom- and top-pinned grids', () => {
    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page hit-testing self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
