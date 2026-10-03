/**
 * Regression test for getCellFromPoint() on a docking grid.
 *
 * The point is canvas-relative (as CellRangeSelector supplies it). It must resolve through the
 * rendered layout, not the natural one: pinned columns sit at the viewport edges whatever the
 * horizontal scroll, pinned rows sit in the overlay bands whatever the vertical scroll, and
 * non-contiguous top pins shift every following scrolling row. The last check uses a row that is
 * not rendered at all, so the resolution cannot depend on DOM hit testing.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: pinning hit-testing geometry</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 520px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [];
  for (var c = 0; c < 12; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 110 });
  }
  var data = [];
  for (var i = 0; i < 200; i++) {
    var item = { id: i };
    for (var k = 0; k < 12; k++) { item['c' + k] = 'r' + i + 'c' + k; }
    data.push(item);
  }
  // left: 1 is an inclusive boundary, so columns 0 and 1 are pinned left; column 11 is pinned right.
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 25,
    pinning: { columns: { left: 1, right: 1 }, rows: { top: [0, 2], bottom: [199] } }
  });

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    function canvasPoint(node) {
      var canvasRect = grid.getCanvasNode().getBoundingClientRect();
      var r = node.getBoundingClientRect();
      return { x: r.left + 6 - canvasRect.left, y: r.top + 6 - canvasRect.top };
    }
    function expectCell(label, node, row, cell) {
      var p = canvasPoint(node);
      var got = grid.getCellFromPoint(p.x, p.y);
      check(label, got.row === row && got.cell === cell, 'got ' + JSON.stringify(got) + ' expected {row:' + row + ',cell:' + cell + '}');
    }

    check('grid is scrolled right', grid.scrollLeft >= 300, 'scrollLeft=' + grid.scrollLeft);
    check('grid is scrolled down', grid.getViewportNode().scrollTop >= 150, 'scrollTop=' + grid.getViewportNode().scrollTop);

    expectCell('pinned-left column 0 while scrolled right', grid.getCellNode(8, 0), 8, 0);
    expectCell('pinned-left column 1 while scrolled right', grid.getCellNode(8, 1), 8, 1);
    expectCell('pinned-right column while scrolled right', grid.getCellNode(8, 11), 8, 11);
    expectCell('top-pinned row 0 (in overlay)', grid.getCellNode(0, 5), 0, 5);
    expectCell('top-pinned row 2 (non-contiguous, in overlay)', grid.getCellNode(2, 5), 2, 5);
    expectCell('bottom-pinned row 199 (in overlay)', grid.getCellNode(199, 5), 199, 5);
    expectCell('scrolling row shifted by the non-contiguous pin', grid.getCellNode(9, 5), 9, 5);
    expectCell('pinned-left cell of a scrolling row', grid.getCellNode(9, 0), 9, 0);

    // a row that is not rendered: resolve purely from geometry
    var farRow = 120;
    check('row ' + farRow + ' is not rendered', !document.querySelector('#myGrid .slick-row[data-row="' + farRow + '"]'));
    var farY = grid.getRenderedRowTop(farRow) + 5;
    var farX = grid.dockingLayout.leftBaseWidth + grid.columnPosLeft[5] + 5;
    var far = grid.getCellFromPoint(farX, farY);
    check('unrendered scrolling row resolves from geometry', far.row === farRow && far.cell === 5, 'got ' + JSON.stringify(far));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - getCellFromPoint resolves through the rendered docking layout', { retries: 1 }, () => {
  it('should map canvas points to pinned columns, pinned rows and shifted scrolling rows', () => {
    cy.intercept('GET', '/quirk-pinning-hit-testing-geometry-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-hit-testing-geometry-harness.html`);
    cy.window().its('grid').should('exist');

    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(300, 0);
    cy.get('#myGrid .slick-vertical-scroller').scrollTo(0, 150);
    cy.window().should((win: any) => {
      expect(win.grid.scrollLeft, 'scrollLeft applied').to.be.gte(300);
    });

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page hit-testing self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
