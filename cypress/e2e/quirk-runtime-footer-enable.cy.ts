/**
 * Regression test for enabling createFooterRow at runtime.
 *
 * Footer-row DOM was built only in the init path, and internal_setOptions never
 * created it — so `setOptions({ createFooterRow: true })` on a live grid flowed
 * into setColumns → createColumnFooter, which dereferenced the undefined
 * `_footerRowL` and threw, leaving the grid with a half-mutated options state.
 *
 * The grid now materializes the footer DOM lazily when the flag flips true
 * (mirroring the init construction and binding footer events on the live grid);
 * runtime disable hides the footer rather than destroying it, symmetric with
 * showFooterRow.
 *
 * The spec is SELF-HOSTING (harness served via cy.intercept; no example page).
 * The harness wraps the enabling setOptions in try/catch so the pre-fix
 * TypeError reports as a graceful check failure. Verified to FAIL pre-fix
 * (TypeError) and PASS with the fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: runtime footer enable</title>
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
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 200 },
    { id: 'b', name: 'B', field: 'b', width: 200 }
  ];
  var COLCOUNT = columns.length;
  var data = [];
  for (var i = 0; i < 20; i++) { data.push({ id: i, a: 'a' + i, b: 'b' + i }); }

  var grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 25
  });
  var footerRenderCount = 0;
  grid.onFooterRowCellRendered.subscribe(function () { footerRenderCount++; });
  window.grid = grid;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }
    function isVisible(el) { return !!el && el.offsetParent !== null && el.offsetHeight > 0; }

    var enableError = null;
    try {
      grid.setOptions({ createFooterRow: true, showFooterRow: true });
    } catch (e) { enableError = (e && e.message) || String(e); }
    check('setOptions({ createFooterRow: true }) on a live grid does not throw',
      enableError === null, enableError ? 'threw: ' + enableError : 'ok');

    if (enableError === null) {
      var scrollers = document.querySelectorAll('#myGrid .slick-footerrow');
      check('footer scrollers exist and are visible',
        scrollers.length === 2 && isVisible(scrollers[0]),
        'count=' + scrollers.length + ' visible=' + (scrollers.length ? isVisible(scrollers[0]) : '-'));

      var cells = document.querySelectorAll('#myGrid .slick-footerrow-column');
      check('one footer cell rendered per visible column', cells.length === COLCOUNT,
        'cells=' + cells.length + ' expected=' + COLCOUNT);

      check('onFooterRowCellRendered fired once per column', footerRenderCount === COLCOUNT,
        'fired=' + footerRenderCount + ' expected=' + COLCOUNT);

      var fr = grid.getFooterRow();
      check('getFooterRow() returns the footer element', !!fr, 'returned ' + fr);

      grid.setFooterRowVisibility(false);
      var hiddenNow = !isVisible(document.querySelector('#myGrid .slick-footerrow'));
      check('setFooterRowVisibility(false) hides the runtime-built footer', hiddenNow, 'hidden=' + hiddenNow);
    }

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - createFooterRow must be enableable at runtime', { retries: 1 }, () => {
  it('should build, populate, wire and toggle the footer when enabled after init', () => {
    cy.intercept('GET', '/quirk-runtime-footer-enable-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-runtime-footer-enable-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page runtime-footer self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
