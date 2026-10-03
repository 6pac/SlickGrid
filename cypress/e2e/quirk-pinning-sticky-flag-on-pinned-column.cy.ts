/**
 * Regression test for a permanently pinned column that also carries `sticky`.
 *
 * The docking layout puts a `pinned` column in its permanent band whatever its `sticky` flag says,
 * so its header, filter cell and body cells must all render in that band and stay docked while the
 * grid scrolls, exactly like a pinned column without the flag. The flag alone must not route any
 * part of the column onto the sticky transform path. Covers the boundary form of `pinning.columns`,
 * the column-level `pinned` property, and pinning a sticky column at runtime.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: sticky flag on a pinned column</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> .g { width: 700px; height: 220px; } </style>
</head>
<body>
<div id="gridA" class="g"></div>
<div id="gridB" class="g"></div>
<div id="gridC" class="g"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var COLS = 24, ROWS = 12;
  function makeColumns(extra) {
    var c = [];
    for (var i = 0; i < COLS; i++) {
      c.push(Object.assign({ id: 'c' + i, name: 'C' + i, field: 'f' + i, width: 100 }, extra(i) || {}));
    }
    return c;
  }
  function makeData() {
    var d = [];
    for (var r = 0; r < ROWS; r++) {
      var item = { id: r };
      for (var i = 0; i < COLS; i++) { item['f' + i] = r + '.' + i; }
      d.push(item);
    }
    return d;
  }
  var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25, showHeaderRow: true, headerRowHeight: 30 };

  // A: boundary form; column 1 is inside the boundary and flagged sticky.
  var gridA = new Slick.Grid('#gridA', makeData(), makeColumns(function (i) { return i === 1 ? { sticky: true } : null; }),
    Object.assign({ pinning: { columns: { left: 1 } } }, base));
  // B: column-level pins only; column 1 is pinned and flagged sticky.
  var gridB = new Slick.Grid('#gridB', makeData(), makeColumns(function (i) {
    return i === 0 ? { pinned: 'left' } : i === 1 ? { pinned: 'left', sticky: true } : null;
  }), Object.assign({}, base));
  // C: a sticky centre column that is pinned at runtime.
  var gridC = new Slick.Grid('#gridC', makeData(), makeColumns(function (i) { return i === 1 ? { sticky: true } : null; }),
    Object.assign({ pinning: { columns: { left: 0 } } }, base));
  gridC.setColumnPinning('c1', 'left');
  window.gridA = gridA; window.gridB = gridB; window.gridC = gridC;

  function left(el, host) { return el ? Math.round(el.getBoundingClientRect().left - host.getBoundingClientRect().left) : null; }
  function scrollTo(grid, x) {
    var scroller = grid.getContainerNode().querySelector('.slick-docking-horizontal-scroller');
    scroller.scrollLeft = x;
    scroller.dispatchEvent(new Event('scroll'));
  }

  window.runChecks = function runChecks(name) {
    var grid = window[name];
    var host = grid.getContainerNode();
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + name + ': ' + label + (detail ? ' [' + detail + ']' : ''));
    }
    function parts(index) {
      var cell = host.querySelector('.slick-row[data-row="3"] .slick-cell.l' + index);
      return {
        header: left(grid.getHeaderColumn(index), host),
        filter: left(host.querySelector('.slick-headerrow-column.l' + index), host),
        cell: left(cell, host),
        region: cell && cell.parentElement ? cell.parentElement.className.split(' ')[0] : null,
        pinnedCell: !!cell && cell.classList.contains('slick-cell-pinned-left'),
        pinnedHeader: grid.getHeaderColumn(index).classList.contains('slick-column-pinned-left')
      };
    }
    var pinned = grid.getPinnedColumns('left').map(function (c) { return c.id; }).join(',');
    check('columns c0 and c1 are the left band', pinned === 'c0,c1', pinned);

    var before = parts(1);
    check('header, filter cell and body cell share one position before scrolling',
      before.header === 100 && before.filter === 100 && before.cell === 100,
      'header ' + before.header + ' filter ' + before.filter + ' cell ' + before.cell);
    check('the body cell renders in the pinned-left region', before.region === 'slick-pinned-left-cells', String(before.region));
    check('the body cell carries slick-cell-pinned-left', before.pinnedCell);
    check('the header carries slick-column-pinned-left', before.pinnedHeader);

    scrollTo(grid, 500);
    var after = parts(1);
    check('all three stay docked at 100 after scrolling 500px',
      after.header === 100 && after.filter === 100 && after.cell === 100,
      'header ' + after.header + ' filter ' + after.filter + ' cell ' + after.cell);
    var centre = parts(2);
    check('the first centre column has scrolled', centre.cell !== null && centre.cell < 0, 'cell ' + centre.cell);
    scrollTo(grid, 0);

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - sticky flag on a permanently pinned column', { retries: 1 }, () => {
  it('should keep a pinned column in its band, with its filter cell and body cells, whatever its sticky flag says', () => {
    cy.intercept('GET', '/quirk-pinning-sticky-flag-on-pinned-column-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-sticky-flag-on-pinned-column-harness.html`);
    cy.window().its('gridC').should('exist');
    cy.get('#gridA .slick-row').should('have.length.greaterThan', 3);

    ['gridA', 'gridB', 'gridC'].forEach((name) => {
      cy.window().then((win: any) => {
        const ok = win.runChecks(name);
        const detail = win.document.getElementById('checkResults').textContent;
        expect(ok, `in-page self-checks for ${name}:\n${detail}`).to.eq(true);
      });
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
