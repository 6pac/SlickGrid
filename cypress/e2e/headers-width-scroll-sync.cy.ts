/**
 * Regression pin for getHeadersWidth() — the invariants that make header/body
 * horizontal scrolling work:
 *
 *   1. the header band's scroll range covers the body viewport's scroll range
 *      (header width acts as the scroll-range floor), and
 *   2. after scrolling fully right, the active horizontal scroll owner reaches
 *      its maximum (no clamping), and
 *   3. the last column's header stays pixel-aligned with its body cells there.
 *
 * Pinned across the three width regimes: plain grid, pinned columns (the
 * center band scrolls through the docking scroller), and autoHeight (no
 * vertical scrollbar, so no gutter term).
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
    #gridPlain, #gridPinned { width: 600px; height: 300px; }
    #gridAuto { width: 600px; }
  </style>
</head>
<body>
<div id="gridPlain"></div>
<div id="gridPinned"></div>
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
  function cloneColumns() {
    return columns.map(function (column) { return Object.assign({}, column); });
  }

  var gridPlain = new Slick.Grid('#gridPlain', makeData(30), cloneColumns(), baseOptions);
  var gridPinned = new Slick.Grid('#gridPinned', makeData(30), cloneColumns(),
    Object.assign({}, baseOptions, { pinning: { columns: { left: 1 } } }));
  var gridAuto = new Slick.Grid('#gridAuto', makeData(8), cloneColumns(),
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
      if (!container) {
        check(name + ': grid container exists', false, containerSel + ' not found');
        return Promise.resolve();
      }
      var headerScroller = container.querySelector(headerScrollerSel);
      // Docked grids keep the measurable width on the root; the nested
      // left/center/right regions use display: contents and report width 0.
      var headersDiv = container.querySelector('.slick-header-columns-root') || container.querySelector('.slick-header-columns');
      var viewport = container.querySelector(viewportSel);
      var dockingScroller = container.querySelector('.slick-docking-horizontal-scroller');
      var scrollOwner = dockingScroller || viewport;

      if (!headerScroller || !headersDiv || !viewport || !scrollOwner) {
        check(name + ': current single-viewport header/body elements exist', false,
          'header=' + !!headerScroller + ' columns=' + !!headersDiv + ' viewport=' + !!viewport + ' scrollOwner=' + !!scrollOwner);
        return Promise.resolve();
      }

      var headerRange = headersDiv.getBoundingClientRect().width - headerScroller.clientWidth;
      // The proxy-scrolled header root does not include the vertical scrollbar
      // strip in its width, while the body viewport's scroll range does. Add
      // that strip back when comparing the two ranges.
      if (dockingScroller) {
        headerRange += Math.max(0, headerScroller.clientWidth - viewport.clientWidth);
      }
      var bodyRange = viewport.scrollWidth - viewport.clientWidth;
      check(name + ': header scroll range covers body scroll range',
        headerRange >= bodyRange,
        'headerRange=' + Math.round(headerRange) + ' bodyRange=' + Math.round(bodyRange));

      scrollOwner.scrollLeft = 1000000;
      return settle().then(function () {
        var bodyScrollLeft = scrollOwner.scrollLeft;
        var bodyMaxScrollLeft = scrollOwner.scrollWidth - scrollOwner.clientWidth;
        check(name + ': horizontal scroll owner reaches the full right edge',
          Math.abs(bodyScrollLeft - bodyMaxScrollLeft) <= 1,
          'scrollLeft=' + bodyScrollLeft + ' max=' + bodyMaxScrollLeft);

        var lastHeader = container.querySelectorAll('.slick-header-column');
        lastHeader = lastHeader[lastHeader.length - 1];
        var lastCell = viewport.querySelector('.slick-row .slick-cell.l14.r14');
        if (!lastHeader || !lastCell) {
          check(name + ': last header and body cell exist', false,
            'header=' + !!lastHeader + ' cell=' + !!lastCell);
          return;
        }
        var dh = lastHeader.getBoundingClientRect().left;
        var dc = lastCell.getBoundingClientRect().left;
        check(name + ': last column header aligns with its body cells at full right scroll',
          Math.abs(dh - dc) <= 1,
          'headerLeft=' + dh.toFixed(1) + ' cellLeft=' + dc.toFixed(1));
      });
    }

    return checkGrid('plain', '#gridPlain', '.slick-header-left', '.slick-viewport')
      .then(function () {
        return checkGrid('pinned', '#gridPinned', '.slick-header-left', '.slick-viewport');
      })
      .then(function () {
        return checkGrid('autoHeight', '#gridAuto', '.slick-header-left', '.slick-viewport');
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
  it('should keep header scroll range and alignment across plain, pinned and autoHeight grids', () => {
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
