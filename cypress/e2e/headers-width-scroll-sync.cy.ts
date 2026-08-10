/**
 * Regression pin for getHeadersWidth() — the invariants that make header/body
 * horizontal scrolling work:
 *
 *   1. the header band's scroll range covers the body viewport's scroll range
 *      (header width acts as the scroll-range floor), and
 *   2. after scrolling the body fully right, the header scroller lands on the
 *      same scrollLeft (no clamping), and
 *   3. the last column's header stays pixel-aligned with its body cells there.
 *
 * Pinned across the three width regimes: plain grid, frozen columns (the right
 * band scrolls), and autoHeight (no vertical scrollbar, so no gutter term).
 * This spec is expected to pass BEFORE and AFTER any getHeadersWidth change —
 * it exists so refactors of the width formula (e.g. the removal of the
 * historical duplicate scrollbar addition) cannot silently break scroll sync.
 *
 * SELF-HOSTING: harness served via cy.intercept; no example page involved.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: headers width scroll sync</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style>
    #gridPlain, #gridFrozen { width: 600px; height: 300px; }
    #gridAuto { width: 600px; }
  </style>
</head>
<body>
<div id="gridPlain"></div>
<div id="gridFrozen"></div>
<div id="gridAuto"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [];
  for (var c = 0; c < 15; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 100 });
  }
  function makeData(count) {
    var d = [];
    for (var i = 0; i < count; i++) {
      var row = { id: i };
      for (var c = 0; c < 15; c++) { row['c' + c] = 'r' + i + 'c' + c; }
      d.push(row);
    }
    return d;
  }
  var baseOptions = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };

  var gridPlain = new Slick.Grid('#gridPlain', makeData(30), columns, baseOptions);
  var gridFrozen = new Slick.Grid('#gridFrozen', makeData(30), columns,
    Object.assign({}, baseOptions, { frozenColumn: 1 }));
  var gridAuto = new Slick.Grid('#gridAuto', makeData(8), columns,
    Object.assign({}, baseOptions, { autoHeight: true }));
  window.grid = gridPlain;

  function settle() {
    return new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { setTimeout(resolve, 60); });
      });
    });
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    function checkGrid(name, containerSel, headerScrollerSel, viewportSel) {
      var container = document.querySelector(containerSel);
      var headerScroller = container.querySelector(headerScrollerSel);
      var headersDiv = headerScroller.querySelector('.slick-header-columns');
      var viewport = container.querySelector(viewportSel);

      var headerRange = headersDiv.getBoundingClientRect().width - headerScroller.clientWidth;
      var bodyRange = viewport.scrollWidth - viewport.clientWidth;
      check(name + ': header scroll range covers body scroll range',
        headerRange >= bodyRange,
        'headerRange=' + Math.round(headerRange) + ' bodyRange=' + Math.round(bodyRange));

      viewport.scrollLeft = 1000000;
      return settle().then(function () {
        check(name + ': header scroller reaches the body scrollLeft at full right scroll',
          headerScroller.scrollLeft === viewport.scrollLeft,
          'header=' + headerScroller.scrollLeft + ' body=' + viewport.scrollLeft);

        var lastHeader = headerScroller.querySelectorAll('.slick-header-column');
        lastHeader = lastHeader[lastHeader.length - 1];
        var lastCell = viewport.querySelector('.slick-row .slick-cell.l14.r14');
        var dh = lastHeader.getBoundingClientRect().left;
        var dc = lastCell.getBoundingClientRect().left;
        check(name + ': last column header aligns with its body cells at full right scroll',
          Math.abs(dh - dc) <= 1,
          'headerLeft=' + dh.toFixed(1) + ' cellLeft=' + dc.toFixed(1));
      });
    }

    return checkGrid('plain', '#gridPlain', '.slick-header-left', '.slick-viewport-top.slick-viewport-left')
      .then(function () {
        return checkGrid('frozen', '#gridFrozen', '.slick-header-right', '.slick-viewport-top.slick-viewport-right');
      })
      .then(function () {
        return checkGrid('autoHeight', '#gridAuto', '.slick-header-left', '.slick-viewport-top.slick-viewport-left');
      })
      .then(function () {
        out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
        document.getElementById('checkResults').textContent = out.join('\\n');
        return pass;
      });
  };
</script>
</body>
</html>`;

describe('getHeadersWidth - header/body horizontal scroll sync pin', { retries: 1 }, () => {
  it('should keep header scroll range, sync and alignment across plain, frozen and autoHeight grids', () => {
    cy.intercept('GET', '/headers-width-scroll-sync-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/headers-width-scroll-sync-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => win.runChecks()).then((ok) => {
      cy.get('#checkResults').invoke('text').then((detail) => {
        expect(ok, `in-page headers-width self-checks:\n${detail}`).to.eq(true);
      });
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
