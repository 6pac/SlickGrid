/**
 * Regression test for bottom-pinned rows at maximum scroll.
 *
 * A bottom-pinned row is rendered in the overlay band that covers the bottom of the viewport.
 * Its slot must collapse to the end of the canvas (under the band) rather than the canvas being
 * shortened, otherwise the last scrolling row, or the add-new row, ends up under the band and
 * can never be reached. Grid A pins the last data row with no add-new row; Grid B pins it with
 * `enableAddRow`; Grid C pins a row in the middle.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: bottom-pinned reachability</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 600px; height: 250px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="gridC" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var N = 60;
  var columns = [
    { id: 'n', name: '#', field: 'n', width: 60 },
    { id: 'a', name: 'A', field: 'a', width: 200 },
    { id: 'b', name: 'B', field: 'b', width: 200 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < N; i++) { d.push({ id: i, n: i, a: 'a' + i, b: 'b' + i }); }
    return d;
  }
  function cols() { return columns.map(function (c) { return Object.assign({}, c); }); }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ pinning: { rows: { bottom: [N - 1] } } }, base));
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ enableAddRow: true, pinning: { rows: { bottom: [N - 1] } } }, base));
  var gridC = new Slick.Grid('#gridC', makeData(), cols(), Object.assign({ pinning: { rows: { bottom: [10] } } }, base));
  window.gridA = gridA; window.gridB = gridB; window.gridC = gridC;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    function rect(el) { return el ? el.getBoundingClientRect() : null; }
    function scrollToEnd(grid) {
      var vp = grid.getViewportNode();
      vp.scrollTop = vp.scrollHeight;
      grid.render();
    }
    function lastFlowRowVisible(label, grid, selector, row, pinnedRow) {
      var band = rect(document.querySelector(selector + ' .slick-docking-overlay .slick-row[data-row="' + pinnedRow + '"]'));
      var node = rect(document.querySelector(selector + ' .grid-canvas .slick-row[data-row="' + row + '"]'));
      var vp = rect(grid.getViewportNode());
      check(label + ': pinned row ' + pinnedRow + ' is in the bottom band', !!band && Math.abs(band.bottom - vp.bottom) < 1, band ? 'band ' + Math.round(band.top) + '-' + Math.round(band.bottom) + ' viewport bottom ' + Math.round(vp.bottom) : 'no band');
      check(label + ': row ' + row + ' is rendered', !!node);
      check(label + ': row ' + row + ' sits fully above the band', !!node && !!band && node.bottom <= band.top + 0.5 && node.top >= vp.top - 0.5,
        node && band ? 'row ' + Math.round(node.top) + '-' + Math.round(node.bottom) + ' band top ' + Math.round(band.top) : 'missing');
    }

    scrollToEnd(gridA);
    scrollToEnd(gridB);
    scrollToEnd(gridC);

    return new Promise(function (resolve) {
      setTimeout(function () {
        lastFlowRowVisible('A (last row pinned)', gridA, '#gridA', N - 2, N - 1);
        lastFlowRowVisible('B (last row pinned + add-new row)', gridB, '#gridB', N, N - 1);
        check('B: add-new row is the last canvas row', !!document.querySelector('#gridB .grid-canvas .slick-row[data-row="' + N + '"]'));
        lastFlowRowVisible('C (row 10 pinned)', gridC, '#gridC', N - 1, 10);
        var r9 = rect(document.querySelector('#gridC .grid-canvas .slick-row[data-row="9"]'));
        var r11 = rect(document.querySelector('#gridC .grid-canvas .slick-row[data-row="11"]'));
        gridC.scrollRowIntoView(9);
        gridC.render();
        r9 = rect(document.querySelector('#gridC .grid-canvas .slick-row[data-row="9"]'));
        r11 = rect(document.querySelector('#gridC .grid-canvas .slick-row[data-row="11"]'));
        check('C: row 11 follows row 9 directly (no gap for the pinned slot)', !!r9 && !!r11 && Math.abs(r11.top - r9.bottom) < 1,
          r9 && r11 ? 'row9 bottom ' + Math.round(r9.bottom) + ' row11 top ' + Math.round(r11.top) : 'missing');

        out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
        document.getElementById('checkResults').textContent = out.join('\\n');
        resolve(pass);
      }, 400);
    });
  };
</script>
</body>
</html>`;

describe('Quirk - bottom-pinned rows must keep every scrolling row reachable', { retries: 1 }, () => {
  it('should show the last scrolling row (and the add-new row) above the bottom band at maximum scroll', () => {
    cy.intercept('GET', '/quirk-pinning-bottom-reachability-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-bottom-reachability-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');
    cy.window().its('gridC').should('exist');

    cy.window().then((win: any) => {
      return win.runChecks().then((ok: boolean) => {
        const detail = win.document.getElementById('checkResults').textContent;
        expect(ok, `in-page bottom-pin self-checks:\n${detail}`).to.eq(true);
      });
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
