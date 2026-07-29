/**
 * Regression tests for the footer-lifecycle bugs.
 *
 * 1 — `showFooterRow: true` WITHOUT `createFooterRow` crashed at construction:
 *     getViewportHeight()'s footer term was gated on showFooterRow alone and
 *     dereferenced the undefined `_footerRowScroller[0]` (the header-row and
 *     top-header terms three lines away already use the create && show idiom).
 * 2 — `getFooterRow()` without a footer threw a TypeError on the non-frozen
 *     `_footerRow[0]` path while the frozen path returned undefined — the same
 *     misuse failed two different ways. It now returns undefined consistently.
 * 3 — createColumnHeaders() duplicated the footer destroy/create work that
 *     createColumnFooter() (always called right after) already does, so
 *     onFooterRowCellRendered fired TWICE per column on every setColumns, and
 *     the duplicate's right-side gating (hasFrozenColumns instead of existence)
 *     left stale right-footer cells after un-freezing.
 *
 * The spec is SELF-HOSTING: the three-grid repro harness is served from this file
 * via cy.intercept (no page is added to examples/). Its in-page self-check covers
 * all three bugs. Verified to FAIL on the pre-fix code and PASS with it.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: footer lifecycle</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 150px; } </style>
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
  var columns = [];
  for (var c = 0; c < 6; c++) { columns.push({ id: 'c' + c, name: 'Col ' + c, field: 'c' + c, width: 100 }); }
  var data = [];
  for (var r = 0; r < 20; r++) { var row = {}; for (var k = 0; k < 6; k++) { row['c' + k] = 'r' + r + 'c' + k; } data.push(row); }
  var COLCOUNT = columns.length;
  var base = { enableCellNavigation: true, enableColumnReorder: false };
  function cols() { return columns.map(function (x) { return Object.assign({}, x); }); }

  // Grid A: no footer at all — for the getFooterRow() contract
  var gridA = new Slick.Grid('#gridA', data, cols(), Object.assign({}, base));

  // Grid B: showFooterRow WITHOUT createFooterRow — construction must not throw
  var gridB, gridBError = null;
  try {
    gridB = new Slick.Grid('#gridB', data, cols(), Object.assign({ showFooterRow: true }, base));
  } catch (e) { gridBError = (e && e.message) || String(e); }

  // Grid C: full footer — count onFooterRowCellRendered fires per setColumns
  var gridC = new Slick.Grid('#gridC', data, cols(), Object.assign({ createFooterRow: true, showFooterRow: true }, base));
  var footerRenderCount = 0;
  gridC.onFooterRowCellRendered.subscribe(function () { footerRenderCount++; });

  window.gridA = gridA; window.gridB = gridB; window.gridC = gridC;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    check('showFooterRow without createFooterRow does not crash construction',
      gridBError === null && !!gridB, gridBError ? ('threw: ' + gridBError) : 'constructed');

    var q2ok, q2detail;
    try { var fr = gridA.getFooterRow(); q2ok = (fr === undefined); q2detail = 'returned ' + fr; }
    catch (e) { q2ok = false; q2detail = 'threw: ' + ((e && e.message) || e); }
    check('getFooterRow() without createFooterRow returns undefined (no throw)', q2ok, q2detail);

    footerRenderCount = 0;
    gridC.setColumns(gridC.getColumns());
    check('onFooterRowCellRendered fires once per column on setColumns',
      footerRenderCount === COLCOUNT, 'fired=' + footerRenderCount + ' expected=' + COLCOUNT);

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - footer lifecycle (construction crash / getFooterRow contract / double event)', { retries: 1 }, () => {
  it('should load the self-hosted repro harness', () => {
    cy.intercept('GET', '/quirk-footer-lifecycle-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-footer-lifecycle-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridC').should('exist');
  });

  it('should pass the footer-lifecycle self-checks (no crash, undefined contract, single event fire)', () => {
    cy.window().then((win: any) => {
      expect(win.runChecks(), 'in-page footer-lifecycle self-checks').to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
