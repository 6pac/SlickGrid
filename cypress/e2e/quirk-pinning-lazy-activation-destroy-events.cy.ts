/**
 * Regression test for enabling pinning on an already initialized grid.
 *
 * Switching a plain grid to the docking layout rebuilds the header, header-row and footer
 * chrome. Plugins that attach content to those cells (Header Menu, Header Buttons, filters)
 * clean up on `onBeforeHeaderCellDestroy`, `onBeforeHeaderRowCellDestroy` and
 * `onBeforeFooterRowCellDestroy`, so every existing cell must be announced before the chrome
 * is emptied, and the rendered events must fire again for the rebuilt cells.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: lazy pinning activation destroy events</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 600px; height: 250px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [
    { id: 'a', name: 'A', field: 'a', width: 120 },
    { id: 'b', name: 'B', field: 'b', width: 120 },
    { id: 'c', name: 'C', field: 'c', width: 120 },
    { id: 'd', name: 'D', field: 'd', width: 120 }
  ];
  var data = [];
  for (var i = 0; i < 30; i++) { data.push({ id: i, a: 'a' + i, b: 'b' + i, c: 'c' + i, d: 'd' + i }); }
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    showHeaderRow: true,
    createFooterRow: true,
    showFooterRow: true
  });
  window.counts = { headerDestroy: 0, headerRowDestroy: 0, footerDestroy: 0, headerRendered: 0, headerRowRendered: 0, footerRendered: 0 };
  grid.onBeforeHeaderCellDestroy.subscribe(function (e, args) { if (args.column) { window.counts.headerDestroy++; } });
  grid.onBeforeHeaderRowCellDestroy.subscribe(function (e, args) { if (args.column) { window.counts.headerRowDestroy++; } });
  grid.onBeforeFooterRowCellDestroy.subscribe(function (e, args) { if (args.column) { window.counts.footerDestroy++; } });
  grid.onHeaderCellRendered.subscribe(function () { window.counts.headerRendered++; });
  grid.onHeaderRowCellRendered.subscribe(function () { window.counts.headerRowRendered++; });
  grid.onFooterRowCellRendered.subscribe(function () { window.counts.footerRendered++; });

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    var n = columns.length;
    window.counts = { headerDestroy: 0, headerRowDestroy: 0, footerDestroy: 0, headerRendered: 0, headerRowRendered: 0, footerRendered: 0 };

    grid.setOptions({ pinning: { columns: { left: 0 } } });
    var c = window.counts;
    check('header cells destroyed once each when pinning is enabled at runtime', c.headerDestroy === n, 'got ' + c.headerDestroy + ' expected ' + n);
    check('header-row cells destroyed once each', c.headerRowDestroy === n, 'got ' + c.headerRowDestroy + ' expected ' + n);
    check('footer cells destroyed once each', c.footerDestroy === n, 'got ' + c.footerDestroy + ' expected ' + n);
    check('header cells rendered again', c.headerRendered === n, 'got ' + c.headerRendered);
    check('header-row cells rendered again', c.headerRowRendered === n, 'got ' + c.headerRowRendered);
    check('footer cells rendered again', c.footerRendered === n, 'got ' + c.footerRendered);
    check('docking regions exist after activation', !!document.querySelector('#myGrid .slick-header-columns-center') && !!document.querySelector('#myGrid .slick-footerrow-columns-center'));
    check('pinned header is in the left region', !!document.querySelector('#myGrid .slick-header-columns-left .slick-header-column[data-id="a"]'));

    window.counts = { headerDestroy: 0, headerRowDestroy: 0, footerDestroy: 0, headerRendered: 0, headerRowRendered: 0, footerRendered: 0 };
    grid.setOptions({ pinning: undefined });
    c = window.counts;
    check('header cells destroyed once each when pinning is removed', c.headerDestroy === n, 'got ' + c.headerDestroy);
    check('footer cells destroyed once each when pinning is removed', c.footerDestroy === n, 'got ' + c.footerDestroy);
    check('docking regions removed after deactivation', !document.querySelector('#myGrid .slick-header-columns-center') && !document.querySelector('#myGrid .slick-docking-chrome'));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - enabling pinning at runtime must announce every chrome cell before rebuilding', { retries: 1 }, () => {
  it('should fire the header, header-row and footer destroy events once per column', () => {
    cy.intercept('GET', '/quirk-pinning-lazy-activation-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-lazy-activation-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page lazy-activation self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
