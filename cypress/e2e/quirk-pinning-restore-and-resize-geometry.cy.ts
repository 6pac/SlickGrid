/**
 * Regression tests for pinned-band geometry, in both reading directions.
 *
 * - Removing and restoring permanent pinning while a sticky column is docked keeps every body
 *   cell aligned with its header. Without the fix the leading pinned cell collapsed to a few
 *   pixels, because its column rule was sized from the layout band width rather than the
 *   rendered one.
 * - Dragging a column's resize handle on a pinned grid whose canvas width does not change keeps
 *   the filter cell, the footer cell, the body cells and the row's band template at the column's
 *   new width during the drag. Without the fix they stayed at the old widths until mouseup.
 *
 * Reported from Slickgrid-Universal (ghiscoding/slickgrid-universal#2782, commits c4112428 and
 * a490c253). The harness is served from this file via cy.intercept.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: pinning restore and resize geometry</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 700px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var params = new URLSearchParams(location.search);
  var resizeMode = params.get('mode') === 'resize';
  var rtl = params.get('rtl') === '1';
  if (rtl) { document.getElementById('myGrid').setAttribute('dir', 'rtl'); }
  var colCount = resizeMode ? 5 : 12;
  var colWidth = resizeMode ? 80 : 100;
  var columns = [];
  for (var c = 0; c < colCount; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'f' + c, width: colWidth, minWidth: 30, sticky: (!resizeMode && c === 2) ? true : undefined });
  }
  var data = [];
  for (var r = 0; r < 30; r++) {
    var item = { id: r };
    for (var k = 0; k < colCount; k++) { item['f' + k] = 'r' + r + 'c' + k; }
    data.push(item);
  }
  var pinning = { columns: { left: ['c0'], right: ['c' + (colCount - 1)] } };
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rtl: rtl,
    showHeaderRow: resizeMode,
    headerRowHeight: 30,
    createFooterRow: resizeMode,
    showFooterRow: resizeMode,
    footerRowHeight: 25,
    pinning: pinning
  });

  function headerOf(id) { return document.getElementById(window.grid.getUID() + id); }

  window.misalignedCells = function () {
    var out = [];
    window.grid.getColumns().forEach(function (col, i) {
      var cell = document.querySelector('#myGrid .slick-row[data-row="1"] .slick-cell.l' + i);
      var header = headerOf(col.id);
      if (!cell || !header) { out.push(col.id + ' missing'); return; }
      var cb = cell.getBoundingClientRect(), hb = header.getBoundingClientRect();
      if (Math.abs(cb.left - hb.left) > 1.5 || Math.abs(cb.right - hb.right) > 1.5) {
        out.push(col.id + ' cell ' + Math.round(cb.left) + '..' + Math.round(cb.right) + ' header ' + Math.round(hb.left) + '..' + Math.round(hb.right));
      }
    });
    return out;
  };

  window.scrollProxy = function (amount) {
    document.querySelector('#myGrid .slick-docking-horizontal-scroller').scrollLeft = rtl ? -amount : amount;
  };
  window.stickyDocked = function () { return headerOf('c2').classList.contains('slick-column-sticky'); };
  window.clearPinning = function () { window.grid.setOptions({ pinning: null }); };
  window.restorePinning = function () { window.grid.setOptions({ pinning: pinning }); };

  window.wrongWidths = function () {
    var out = [];
    var widths = window.grid.getColumns().map(function (col) { return col.width; });
    widths.forEach(function (w, i) {
      [['filter', '.slick-headerrow-column.l' + i], ['footer', '.slick-footerrow-column.l' + i], ['cell', '.slick-row[data-row="1"] .slick-cell.l' + i]].forEach(function (p) {
        var el = document.querySelector('#myGrid ' + p[1]);
        if (!el) { out.push('c' + i + ' ' + p[0] + ' missing'); }
        else if (Math.abs(el.offsetWidth - w) > 1.5) { out.push('c' + i + ' ' + p[0] + ' ' + el.offsetWidth + ' vs ' + w); }
      });
    });
    var centre = widths.slice(1, -1).reduce(function (a, b) { return a + b; }, 0);
    var row = document.querySelector('#myGrid .slick-row[data-row="1"]');
    var tracks = row.style.gridTemplateColumns.split(' ').map(parseFloat);
    if (tracks[0] !== widths[0] || tracks[2] !== widths[widths.length - 1] || tracks[1] < centre) {
      out.push('row bands ' + row.style.gridTemplateColumns + ' for widths ' + widths.join(','));
    }
    return out;
  };

  var drag = {};
  function mouse(type, target, dx) {
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: drag.x + dx, clientY: drag.y, button: 0 }));
  }
  window.dragStart = function (colId) {
    var handle = headerOf(colId).querySelector('.slick-resizable-handle');
    var b = handle.getBoundingClientRect();
    drag.x = b.left + b.width / 2; drag.y = b.top + b.height / 2;
    mouse('mousedown', handle, 0);
  };
  window.dragMove = function (dx) { mouse('mousemove', document.body, dx); };
  window.dragEnd = function (dx) { mouse('mouseup', document.body, dx); };
</script>
</body>
</html>`;

const visit = (query: string) => {
  cy.intercept('GET', '/quirk-pinning-restore-and-resize-geometry-harness.html*', {
    headers: { 'content-type': 'text/html' },
    body: harnessHtml,
  });
  cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-restore-and-resize-geometry-harness.html?${query}`);
  cy.window().its('grid').should('exist');
};

describe('Quirk - pinned band geometry after restoring pinning and while resizing', () => {
  [false, true].forEach((rtl) => {
    const dir = rtl ? 'rtl' : 'ltr';

    it(`keeps cells aligned with their headers after pinning is removed and restored with a docked sticky (${dir})`, () => {
      visit(`mode=restore&rtl=${rtl ? 1 : 0}`);
      cy.window().then((win: any) => win.scrollProxy(400));
      cy.window().should((win: any) => {
        expect(win.stickyDocked(), 'precondition: the sticky column is docked').to.eq(true);
        expect(win.misalignedCells(), 'precondition: aligned before the change').to.deep.eq([]);
      });
      cy.window().then((win: any) => win.clearPinning());
      cy.window().then((win: any) => win.restorePinning());
      cy.window().should((win: any) => {
        expect(win.stickyDocked(), 'the sticky column is still docked').to.eq(true);
        expect(win.misalignedCells(), 'cells aligned with headers after restore').to.deep.eq([]);
      });
    });

    ['c0', 'c1'].forEach((colId) => {
      it(`keeps filter, footer, cells and row bands at the new width while dragging ${colId}'s resize handle (${dir})`, () => {
        visit(`mode=resize&rtl=${rtl ? 1 : 0}`);
        const shrink = rtl ? 20 : -20;
        cy.window().then((win: any) => {
          expect(win.wrongWidths(), 'precondition: consistent before the drag').to.deep.eq([]);
          win.dragStart(colId);
          win.dragMove(shrink);
        });
        cy.window().should((win: any) => {
          expect(win.grid.getColumns().find((c: any) => c.id === colId).width, 'the drag changed the width').to.eq(60);
          expect(win.wrongWidths(), 'geometry follows the drag').to.deep.eq([]);
        });
        cy.window().then((win: any) => win.dragEnd(shrink));
        cy.window().should((win: any) => {
          expect(win.wrongWidths(), 'geometry after the drop').to.deep.eq([]);
        });
      });
    });
  });
});
