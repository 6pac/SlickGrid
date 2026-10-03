/**
 * Regression test for unresolved pinned and sticky row references.
 *
 * A row reference whose id is not in the data stays unresolved. Its lookup is cached like a
 * resolved one, so scrolling does not search the data again; invalidating rows clears the cache,
 * and the reference resolves once its row exists. Covers a plain array (a string id and an
 * explicit `{ id }` reference) and a DataView (`getRowById()`).
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: unresolved row references</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 600px; height: 250px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script src="/dist/browser/slick.dataview.js"></script>
<script>
  var N = 100000;
  var columns = [
    { id: 'id', name: 'Id', field: 'id', width: 120 },
    { id: 'a', name: 'A', field: 'a', width: 200 }
  ];
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };

  // Grid A: a plain array; neither referenced id exists yet.
  var data = [];
  for (var i = 0; i < N; i++) { data.push({ id: i, a: 'row-' + i }); }
  var scans = 0;
  data.findIndex = function () { scans++; return Array.prototype.findIndex.apply(this, arguments); };
  var gridA = new Slick.Grid('#gridA', data, columns, Object.assign({
    pinning: { rows: { top: ['pending-row'], bottom: [{ id: 'pending-too' }] } }
  }, base));

  // Grid B: a DataView; the referenced id does not exist yet.
  var dataViewB = new Slick.Data.DataView();
  var items = [];
  for (var j = 0; j < 1000; j++) { items.push({ id: j, a: 'row-' + j }); }
  dataViewB.setItems(items);
  var lookups = 0;
  var getRowById = dataViewB.getRowById;
  dataViewB.getRowById = function () { lookups++; return getRowById.apply(this, arguments); };
  var gridB = new Slick.Grid('#gridB', dataViewB, columns.map(function (c) { return Object.assign({}, c); }), Object.assign({
    pinning: { rows: { top: [{ id: 5000 }] } }
  }, base));
  dataViewB.onRowsChanged.subscribe(function (e, args) { gridB.invalidateRows(args.rows); gridB.render(); });
  dataViewB.onRowCountChanged.subscribe(function () { gridB.updateRowCount(); gridB.render(); });
  window.gridA = gridA; window.gridB = gridB;

  function scroll(grid, steps) {
    var viewport = grid.getViewportNode();
    for (var s = 1; s <= steps; s++) {
      viewport.scrollTop = s * 50;
      viewport.dispatchEvent(new Event('scroll'));
    }
  }
  function pinnedText(sel, band) {
    var node = document.querySelector(sel + ' .slick-docking-overlay .slick-row.slick-row-pinned-' + band + ' .slick-cell.l1');
    return node ? node.textContent : null;
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }

    scans = 0;
    scroll(gridA, 60);
    check('A: 60 vertical scroll steps do not search the array for the missing ids', scans === 0, scans + ' scans');
    check('A: nothing is pinned while the ids are missing', pinnedText('#gridA', 'top') === null && pinnedText('#gridA', 'bottom') === null);

    data[2].id = 'pending-row';
    scans = 0;
    gridA.invalidateRows([2]);
    gridA.render();
    check('A: invalidating a row looks the references up again', scans >= 1 && scans <= 4, scans + ' scans');
    check('A: the string id now pins its row at the top', pinnedText('#gridA', 'top') === 'row-2', String(pinnedText('#gridA', 'top')));

    data[7].id = 'pending-too';
    gridA.invalidateAllRows();
    gridA.render();
    check('A: the { id } reference now pins its row at the bottom', pinnedText('#gridA', 'bottom') === 'row-7', String(pinnedText('#gridA', 'bottom')));
    scans = 0;
    scroll(gridA, 20);
    check('A: further scrolling does not search the array', scans === 0, scans + ' scans');

    lookups = 0;
    scroll(gridB, 60);
    check('B: 60 vertical scroll steps do not ask the DataView for the missing id', lookups === 0, lookups + ' lookups');
    check('B: nothing is pinned while the id is missing', pinnedText('#gridB', 'top') === null);
    dataViewB.addItem({ id: 5000, a: 'late' });
    check('B: the row is pinned once the DataView has it', pinnedText('#gridB', 'top') === 'late', String(pinnedText('#gridB', 'top')));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - unresolved pinned and sticky row references', { retries: 1 }, () => {
  it('should cache an unresolved reference until rows are invalidated, then resolve it', () => {
    cy.intercept('GET', '/quirk-pinning-unresolved-row-references-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-unresolved-row-references-harness.html`);
    cy.window().its('gridB').should('exist');
    cy.get('#gridA .slick-row').should('have.length.greaterThan', 3);

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page unresolved-reference self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
