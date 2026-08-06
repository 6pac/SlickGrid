/**
 * Regression test for the frozen-bottom hit-testing bug.
 *
 * getCellFromEvent()/setActiveCellInternal() computed the bottom-canvas row offset
 * from a LIVE measurement of the top canvas (`Utils.height(_canvasTopL)`) in
 * frozenBottom mode, while the render path places bottom-canvas rows using
 * getFrozenRowOffset(). The two diverge whenever the dataset is shorter than the
 * viewport, because updateRowCount floors the body canvas height at the viewport
 * height — so clicking the frozen bottom row resolved to a row ~viewport/rowHeight
 * rows away. Both call sites now use getFrozenRowOffset(actualFrozenRow), the same
 * offset the render path used to place the row.
 *
 * The spec is SELF-HOSTING: the two-grid repro harness (frozen-bottom target +
 * top-freeze control) is served from this file via cy.intercept (no page is added
 * to examples/). It synthesizes clicks at real cell rects and asserts
 * getCellFromEvent resolves the correct rows. Verified to FAIL pre-fix and PASS
 * post-fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: frozen-bottom hit testing</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 500px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var ROWS = 8;
  var columns = [
    { id: 'id', name: '#', field: 'id', width: 80 },
    { id: 'a', name: 'A', field: 'a', width: 200 },
    { id: 'b', name: 'B', field: 'b', width: 200 }
  ];
  function makeData() {
    var d = [];
    for (var i = 0; i < ROWS; i++) { d.push({ id: i, a: 'a' + i, b: 'b' + i }); }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25 };
  function cols() { return columns.map(function (c) { return Object.assign({}, c); }); }

  // Grid A: 1 frozen BOTTOM row -> actualFrozenRow = 7; row 7 renders in the bottom canvas
  var gridA = new Slick.Grid('#gridA', makeData(), cols(), Object.assign({ frozenRow: 1, frozenBottom: true }, base));
  // Grid B (control): 1 frozen TOP row -> rows 1..7 render in the bottom canvas
  var gridB = new Slick.Grid('#gridB', makeData(), cols(), Object.assign({ frozenRow: 1 }, base));
  window.gridA = gridA; window.gridB = gridB;

  // synthesize the event getCellFromEvent expects, aimed at the center of a cell
  function hitTest(grid, container, row, cell) {
    var cellEl = document.querySelector(container + ' .slick-row[data-row="' + row + '"] .slick-cell.l' + cell);
    if (!cellEl) { return { error: 'cell node not found for row ' + row }; }
    var r = cellEl.getBoundingClientRect();
    var evt = { target: cellEl, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    return { got: grid.getCellFromEvent(evt) };
  }

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? '  [' + detail + ']' : ''));
      if (!ok) { pass = false; }
    }

    var a = hitTest(gridA, '#gridA', 7, 1);
    check('frozenBottom: click on frozen bottom row resolves to its own row',
      !a.error && !!a.got && a.got.row === 7,
      a.error || ('got row ' + (a.got && a.got.row) + ' expected 7'));

    var a2 = hitTest(gridA, '#gridA', 3, 1);
    check('frozenBottom: click on body row resolves correctly',
      !a2.error && !!a2.got && a2.got.row === 3,
      a2.error || ('got row ' + (a2.got && a2.got.row) + ' expected 3'));

    var b = hitTest(gridB, '#gridB', 4, 1);
    check('top freeze (control): click on scrollable row resolves correctly',
      !b.error && !!b.got && b.got.row === 4,
      b.error || ('got row ' + (b.got && b.got.row) + ' expected 4'));

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - frozen-bottom hit testing must use the render offset', { retries: 1 }, () => {
  it('should load the self-hosted two-grid repro harness', () => {
    cy.intercept('GET', '/quirk-frozen-bottom-hit-testing-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-frozen-bottom-hit-testing-harness.html`);
    cy.window().its('gridA').should('exist');
    cy.window().its('gridB').should('exist');
  });

  it('should resolve clicked rows correctly in frozen-bottom and top-freeze grids', () => {
    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page hit-testing self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
