/**
 * Regression test for row references and pinning removal.
 *
 * - `{ id }` references address rows by dataset id even when ids are numeric, and keep following
 *   the row after the DataView is re-sorted.
 * - Plain numbers stay row indexes.
 * - `setOptions({ pinning: null })` and `setOptions({ pinning: undefined })` both remove docking.
 * - The bottom band mirrors the top band: a docked sticky row sits inside (above) the permanent
 *   bottom row.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: row references</title>
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
  var N = 40;
  var columns = [
    { id: 'id', name: 'Id', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 200 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < N; i++) { d.push({ id: i, a: 'row-' + i }); }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };

  // Grid A: DataView with numeric ids; { id } references and an index reference.
  var dataViewA = new Slick.Data.DataView();
  dataViewA.setItems(makeData());
  var gridA = new Slick.Grid('#gridA', dataViewA, columns, Object.assign({
    pinning: { rows: { top: [{ id: 5 }], bottom: [{ id: 0 }] } }
  }, base));
  dataViewA.onRowsChanged.subscribe(function (e, args) { gridA.invalidateRows(args.rows); gridA.render(); });
  dataViewA.onRowCountChanged.subscribe(function () { gridA.updateRowCount(); gridA.render(); });

  // Grid B: permanent bottom row + sticky bottom row.
  var gridB = new Slick.Grid('#gridB', makeData(), columns.map(function (c) { return Object.assign({}, c); }), Object.assign({
    pinning: { rows: { bottom: [N - 1] } },
    stickyRows: { bottom: [20] }
  }, base));
  window.gridA = gridA; window.gridB = gridB; window.dataViewA = dataViewA;

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    function overlayRowText(sel, band) {
      var node = document.querySelector(sel + ' .slick-docking-overlay .slick-row.slick-row-pinned-' + band + ' .slick-cell.l1');
      return node ? node.textContent : null;
    }
    function rect(el) { return el ? el.getBoundingClientRect() : null; }

    // A: initial (unsorted) - id 5 is row 5, id 0 is row 0
    check('A: { id: 5 } pins row-5 at the top', overlayRowText('#gridA', 'top') === 'row-5', String(overlayRowText('#gridA', 'top')));
    check('A: { id: 0 } pins row-0 at the bottom', overlayRowText('#gridA', 'bottom') === 'row-0', String(overlayRowText('#gridA', 'bottom')));

    // A: sort descending - the same items must stay pinned although their indexes changed
    dataViewA.sort(function (x, y) { return y.id - x.id; }, true);
    gridA.invalidateAllRows();
    gridA.render();
    check('A: after a descending sort { id: 5 } still pins row-5', overlayRowText('#gridA', 'top') === 'row-5', String(overlayRowText('#gridA', 'top')));
    check('A: after a descending sort { id: 0 } still pins row-0', overlayRowText('#gridA', 'bottom') === 'row-0', String(overlayRowText('#gridA', 'bottom')));

    // A: a plain number is an index (row 0 is now id 39)
    gridA.setOptions({ pinning: { rows: { top: [0], bottom: [] } } });
    check('A: plain 0 pins the row at index 0 (row-39 after the sort)', overlayRowText('#gridA', 'top') === 'row-39', String(overlayRowText('#gridA', 'top')));

    // A: null and undefined both remove pinning
    gridA.setOptions({ pinning: null });
    check('A: pinning: null removes the overlay', !document.querySelector('#gridA .slick-docking-overlay'));
    check('A: pinning: null removes the proxy scroller', !document.querySelector('#gridA .slick-docking-horizontal-scroller'));
    check('A: pinning: null clears the option', gridA.getOptions().pinning === undefined, String(JSON.stringify(gridA.getOptions().pinning)));
    gridA.setOptions({ pinning: { rows: { top: [0] } } });
    check('A: re-enabling pinning creates the overlay again', !!document.querySelector('#gridA .slick-docking-overlay'));
    gridA.setOptions({ pinning: undefined });
    check('A: pinning: undefined removes the overlay', !document.querySelector('#gridA .slick-docking-overlay'));
    gridA.setOptions({ stickyRows: null });
    check('A: stickyRows: null is accepted', !!gridA.getOptions().stickyRows && gridA.getOptions().stickyRows.top.length === 0);

    // B: sticky bottom row (20, below the fold at scrollTop 0) sits inside the permanent bottom row
    var stickyRect = rect(document.querySelector('#gridB .slick-docking-overlay .slick-row[data-row="20"]'));
    var permanentRect = rect(document.querySelector('#gridB .slick-docking-overlay .slick-row[data-row="' + (N - 1) + '"]'));
    var vp = rect(gridB.getViewportNode());
    check('B: sticky row 20 is docked at the bottom', !!stickyRect);
    check('B: permanent last row is docked at the viewport edge', !!permanentRect && Math.abs(permanentRect.bottom - vp.bottom) < 1, permanentRect ? 'bottom ' + permanentRect.bottom + ' vp ' + vp.bottom : 'missing');
    check('B: sticky row sits above the permanent row', !!stickyRect && !!permanentRect && Math.abs(stickyRect.bottom - permanentRect.top) < 1,
      stickyRect && permanentRect ? 'sticky ' + Math.round(stickyRect.top) + '-' + Math.round(stickyRect.bottom) + ' permanent ' + Math.round(permanentRect.top) + '-' + Math.round(permanentRect.bottom) : 'missing');
    var edge = document.querySelector('#gridB .slick-docking-overlay .slick-row.slick-row-pinned-bottom-edge');
    check('B: the inner sticky row carries the bottom-edge class', !!edge && edge.dataset.row === '20', edge ? 'row ' + edge.dataset.row : 'none');

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - row references, pinning removal and bottom band order', { retries: 1 }, () => {
  it('should resolve { id } references, treat null like undefined, and stack sticky rows inside permanent ones', () => {
    cy.intercept('GET', '/quirk-pinning-row-references-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-row-references-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page row reference self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
