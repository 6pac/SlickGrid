/**
 * Regression test for `destroy(true)`.
 *
 * With `shouldDestroyAllElements` the grid must drop every DOM reference it holds so an
 * application that keeps the grid instance after destroying it does not retain the detached
 * tree. The references are cleared by content (elements, arrays of elements, records of
 * elements), so this harness checks a sample of single, array and record fields plus a
 * docking grid whose overlay/proxy fields only exist when pinning is configured.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: destroy element references</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 600px; height: 200px; } </style>
</head>
<body>
<div id="gridPlain" class="g"></div>
<div id="gridPinned" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [
    { id: 'a', name: 'A', field: 'a', width: 120 },
    { id: 'b', name: 'B', field: 'b', width: 120 },
    { id: 'c', name: 'C', field: 'c', width: 120 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < 20; i++) { d.push({ id: i, a: 'a' + i, b: 'b' + i, c: 'c' + i }); }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, showHeaderRow: true, createFooterRow: true, showFooterRow: true };
  var gridPlain = new Slick.Grid('#gridPlain', makeData(), columns.map(function (c) { return Object.assign({}, c); }), base);
  var gridPinned = new Slick.Grid('#gridPinned', makeData(), columns.map(function (c) { return Object.assign({}, c); }),
    Object.assign({ pinning: { columns: { left: 0 }, rows: { top: [0] } } }, base));
  window.gridPlain = gridPlain; window.gridPinned = gridPinned;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    var single = ['_container', '_headerL', '_headerRoot', '_contentRoot', '_viewportNode', '_canvasNode', '_focusSink', '_style'];
    var arrays = ['_headers', '_viewport', '_canvas', '_headerRowScroller', '_footerRowScroller'];
    var pinnedOnly = ['_dockingOverlay', '_dockingHorizontalScroller', 'dockingHeaderRegions'];

    [['plain', gridPlain], ['pinned', gridPinned]].forEach(function (entry) {
      var name = entry[0], grid = entry[1];
      single.concat(arrays).forEach(function (field) {
        check(name + ': ' + field + ' is set before destroy', grid[field] !== null && grid[field] !== undefined);
      });
      if (name === 'pinned') {
        pinnedOnly.forEach(function (field) {
          check(name + ': ' + field + ' is set before destroy', grid[field] !== null && grid[field] !== undefined);
        });
      }
      grid.destroy(true);
      single.concat(arrays).forEach(function (field) {
        check(name + ': ' + field + ' is null after destroy(true)', grid[field] === null, String(grid[field] && grid[field].constructor && grid[field].constructor.name));
      });
      if (name === 'pinned') {
        pinnedOnly.forEach(function (field) {
          check(name + ': ' + field + ' is null after destroy(true)', grid[field] === null);
        });
        check(name + ': dockingChromeByColumn is empty after destroy(true)', grid.dockingChromeByColumn && grid.dockingChromeByColumn.size === 0);
      }
      check(name + ': container was emptied', document.querySelector('#grid' + (name === 'plain' ? 'Plain' : 'Pinned')).children.length === 0);
    });

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - destroy(true) must drop every DOM reference', { retries: 1 }, () => {
  it('should null element fields on plain and pinned grids', () => {
    cy.intercept('GET', '/quirk-destroy-element-references-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-destroy-element-references-harness.html`);
    cy.window().its('gridPlain').should('exist');
    cy.window().its('gridPinned').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page destroy self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
