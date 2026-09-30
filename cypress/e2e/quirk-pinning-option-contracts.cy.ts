/**
 * Regression tests for the contracts of the column-pinning option.
 *
 * - Pins are rejected when they would leave the centre band no width at all; a 1px band is the
 *   narrowest that is accepted.
 * - A rejected `setColumns()` leaves the saved pinning state untouched, so clearing the option
 *   later restores a column's own `pinned` flag.
 * - `setColumnPinning()` records the column's id, so the pin follows the column through a
 *   reorder and can be removed afterwards.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: pinning option contracts</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
</head>
<body>
<div id="hosts"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  function makeColumns(n, w, extra) {
    var c = [];
    for (var i = 0; i < n; i++) {
      c.push(Object.assign({ id: 'c' + i, name: 'C' + i, field: 'c' + i, width: w }, extra ? extra(i) || {} : {}));
    }
    return c;
  }
  function makeData(columns, rows) {
    var d = [];
    for (var r = 0; r < rows; r++) {
      var item = { id: r };
      columns.forEach(function (c) { item[c.field] = r + '.' + c.field; });
      d.push(item);
    }
    return d;
  }
  function makeGrid(id, width, columns, options) {
    var old = document.getElementById(id);
    if (old) { old.remove(); }
    var host = document.createElement('div');
    host.id = id;
    host.style.cssText = 'width:' + width + 'px;height:220px;position:relative;';
    document.getElementById('hosts').appendChild(host);
    var base = { enableCellNavigation: true, enableColumnReorder: false, rowHeight: 25,
      invalidColumnPinningWidthCallback: function () {}, invalidColumnPinningPickerCallback: function () {} };
    return new Slick.Grid(host, makeData(columns, 30), columns, Object.assign(base, options));
  }
  function pinnedIds(grid, side) {
    return grid.getPinnedColumns(side).map(function (c) { return c.id; }).sort().join(',');
  }
  function edgeGap(host, selector) {
    var vr = host.querySelector('.slick-viewport').getBoundingClientRect();
    var els = host.querySelectorAll(selector);
    if (!els.length) { return null; }
    var gap = Infinity;
    for (var i = 0; i < els.length; i++) { gap = Math.min(gap, vr.right - els[i].getBoundingClientRect().right); }
    return Math.round(gap * 100) / 100;
  }

  window.runChecks = function runChecks(name) {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + name + ': ' + label + (detail ? ' [' + detail + ']' : ''));
    }

    if (name === 'centreWidth') {
      var rejections = [];
      var full = makeGrid('g1', 600, makeColumns(6, 100, function (i) { return i === 0 ? { width: 300, pinned: 'left' } : i === 5 ? { width: 300 } : null; }),
        { invalidColumnPinningWidthCallback: function () { rejections.push('width'); } });
      full.setColumnPinning('c5', 'right');
      check('pins that leave the centre band no width are rejected', rejections.length === 1, rejections.join(',') || 'accepted');
      check('the rejected column stays unpinned', pinnedIds(full, 'right') === '', pinnedIds(full, 'right'));
      var narrow = makeGrid('g1b', 600, makeColumns(6, 100, function (i) { return i === 0 ? { width: 300, pinned: 'left' } : i === 5 ? { width: 299 } : null; }),
        { invalidColumnPinningWidthCallback: function () { rejections.push('narrow'); } });
      narrow.setColumnPinning('c5', 'right');
      check('a 1px centre band is still accepted', pinnedIds(narrow, 'right') === 'c5' && rejections.indexOf('narrow') < 0, rejections.join(','));
      full.destroy();
      narrow.destroy();
    }

    if (name === 'rejectedSetColumns') {
      var grid = makeGrid('g2', 600, makeColumns(6, 100), { pinning: { columns: { left: 1 } } });
      // The rejected request carries a flag of its own on n0; that flag belongs to the request only.
      var wide = makeColumns(6, 100, function (i) { return i === 0 ? { width: 400, pinned: 'right' } : i === 1 ? { width: 400 } : null; })
        .map(function (c) { c.id = 'n' + c.id.slice(1); return c; });
      var accepted = grid.setColumns(wide);
      check('columns whose pins exceed the width are rejected', accepted === false && grid.getColumns()[0].id === 'c0', grid.getColumns()[0].id);
      var fresh = makeColumns(6, 100).map(function (c) { c.id = 'n' + c.id.slice(1); return c; });
      grid.setOptions({ pinning: { columns: { left: 0 } } });
      grid.setColumns(fresh);
      check('the real n0 is pinned by the option', pinnedIds(grid, 'left') === 'n0', pinnedIds(grid, 'left'));
      grid.setOptions({ pinning: undefined });
      check('clearing the option leaves n0 unpinned: the rejected request left no trace', grid.getColumns()[0].pinned === null && pinnedIds(grid, 'right') === '', String(grid.getColumns()[0].pinned));
      grid.destroy();
    }

    if (name === 'pinFollowsColumn') {
      var g3 = makeGrid('g3', 900, makeColumns(8, 100), { pinning: { columns: { left: 1 } } });
      g3.setColumnPinning('c5', 'left');
      check('c0, c1 and c5 are pinned', pinnedIds(g3, 'left') === 'c0,c1,c5', pinnedIds(g3, 'left'));
      g3.setColumns(g3.getColumns().slice().reverse());
      check('the same columns stay pinned after a reorder', pinnedIds(g3, 'left') === 'c0,c1,c5', pinnedIds(g3, 'left'));
      g3.setColumnPinning('c5', null);
      check('the interactive pin can be removed after the reorder', pinnedIds(g3, 'left') === 'c0,c1', pinnedIds(g3, 'left'));
      g3.destroy();
    }

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - pinning option contracts', { retries: 1 }, () => {
  const run = (name: string) => {
    cy.intercept('GET', '/quirk-pinning-option-contracts-harness.html', { headers: { 'content-type': 'text/html' }, body: harnessHtml });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-option-contracts-harness.html`);
    cy.window().its('Slick').should('exist');
    cy.window().then((win: any) => {
      const ok = win.runChecks(name);
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page self-checks (${name}):\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  };

  it('rejects pins that leave the centre band no width', () => run('centreWidth'));
  it('leaves the saved pinning state untouched when setColumns() is rejected', () => run('rejectedSetColumns'));
  it('keeps an interactive pin on its column through a reorder and can remove it', () => run('pinFollowsColumn'));
});
