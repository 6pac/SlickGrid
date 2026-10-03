/**
 * Regression test for grid API contracts that the pinning rewrite must keep.
 *
 * - applyHtmlCode(target, value, { emptyTarget, skipEmptyReassignment })
 * - setXxxVisibility(visible, animate) honours animate: false synchronously
 * - setColumns() validates pinning before mutating its input or firing events, and returns
 *   whether the columns were applied
 * - onHeaderKeyDown receives { event, column }
 * - the internal event trigger is `trigger`, not `triggerEvent`
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: grid API contracts</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 600px; height: 250px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="scratch"></div>
<div id="checkResults" style="white-space:pre; font-family:monospace;"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [
    { id: 'a', name: 'A', field: 'a', width: 150 },
    { id: 'b', name: 'B', field: 'b', width: 150 },
    { id: 'c', name: 'C', field: 'c', width: 150 }
  ];
  var data = [];
  for (var i = 0; i < 20; i++) { data.push({ id: i, a: 'a' + i, b: 'b' + i, c: 'c' + i }); }
  window.pickerMessages = [];
  window.grid = new Slick.Grid('#myGrid', data, columns.map(function (c) { return Object.assign({}, c); }), {
    enableCellNavigation: true,
    enableColumnReorder: false,
    showHeaderRow: false,
    invalidColumnPinningPickerCallback: function (msg) { window.pickerMessages.push(msg); },
    invalidColumnPinningWidthCallback: function (msg) { window.pickerMessages.push(msg); }
  });

  window.runChecks = function runChecks() {
    var out = [], pass = true;
    function check(label, ok, detail) {
      pass = pass && ok;
      out.push((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' [' + detail + ']' : ''));
    }
    var scratch = document.getElementById('scratch');

    // applyHtmlCode
    scratch.innerHTML = '<span>old</span>';
    var extra = document.createElement('b'); extra.textContent = 'new';
    grid.applyHtmlCode(scratch, extra, { emptyTarget: false });
    check('applyHtmlCode keeps existing children with emptyTarget: false', scratch.childNodes.length === 2 && scratch.textContent === 'oldnew', scratch.innerHTML);
    var extra2 = document.createElement('i'); extra2.textContent = 'only';
    grid.applyHtmlCode(scratch, extra2);
    check('applyHtmlCode empties the target by default', scratch.childNodes.length === 1 && scratch.textContent === 'only', scratch.innerHTML);
    scratch.innerHTML = '';
    grid.applyHtmlCode(scratch, undefined);
    check('applyHtmlCode skips an empty reassignment by default', scratch.innerHTML === '', scratch.innerHTML);
    grid.applyHtmlCode(scratch, '<em>html</em>');
    check('applyHtmlCode renders html strings', !!scratch.querySelector('em'), scratch.innerHTML);
    grid.applyHtmlCode(scratch, 42);
    check('applyHtmlCode writes numbers as text', scratch.textContent === '42', scratch.innerHTML);

    // trigger name
    check('grid exposes trigger and not triggerEvent', typeof grid.trigger === 'function' && typeof grid.triggerEvent === 'undefined');
    check('validateAndEnforceOptions is callable', typeof grid.validateAndEnforceOptions === 'function');

    // visibility with animate: false
    grid.setHeaderRowVisibility(true, false);
    var headerRow = document.querySelector('#myGrid .slick-headerrow');
    check('setHeaderRowVisibility(true, false) shows the header row synchronously', !!headerRow && getComputedStyle(headerRow).display !== 'none' && grid.getOptions().showHeaderRow === true);
    grid.setHeaderRowVisibility(false, false);
    check('setHeaderRowVisibility(false, false) hides it synchronously', getComputedStyle(headerRow).display === 'none' && grid.getOptions().showHeaderRow === false);

    // setColumns validation before mutation
    var beforeEvents = 0;
    grid.onBeforeSetColumns.subscribe(function () { beforeEvents++; });
    var allPinned = columns.map(function (c) { return Object.assign({}, c, { pinned: 'left' }); });
    var previousIds = grid.getColumns().map(function (c) { return c.id; }).join(',');
    var result = grid.setColumns(allPinned);
    check('setColumns returns false when every column would be pinned', result === false, String(result));
    check('rejected setColumns fires no onBeforeSetColumns', beforeEvents === 0, String(beforeEvents));
    check('rejected setColumns leaves the input untouched', allPinned.every(function (c) { return c.pinned === 'left'; }));
    check('rejected setColumns keeps the current columns', grid.getColumns().map(function (c) { return c.id; }).join(',') === previousIds);
    check('the pinning callback was invoked', window.pickerMessages.length > 0, String(window.pickerMessages.length));
    var valid = columns.map(function (c) { return Object.assign({}, c); });
    result = grid.setColumns(valid);
    check('setColumns returns true for a valid column set', result === true && beforeEvents === 1, String(result) + ' events=' + beforeEvents);

    // onHeaderKeyDown args
    var keyArgs = null;
    grid.onHeaderKeyDown.subscribe(function (e, args) { keyArgs = args; });
    var header = document.querySelector('#myGrid .slick-header-column[data-id="b"]');
    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    check('onHeaderKeyDown provides the column and the keyboard event', !!keyArgs && keyArgs.column && keyArgs.column.id === 'b' && keyArgs.event && keyArgs.event.type === 'keydown', keyArgs ? JSON.stringify({ column: keyArgs.column && keyArgs.column.id, event: keyArgs.event && keyArgs.event.type }) : 'no args');

    out.push(pass ? '\\nALL CHECKS PASSED' : '\\nCHECKS FAILED');
    document.getElementById('checkResults').textContent = out.join('\\n');
    return pass;
  };
</script>
</body>
</html>`;

describe('Quirk - grid API contracts', { retries: 1 }, () => {
  it('should keep applyHtmlCode options, animate params, setColumns validation and header key events', () => {
    cy.intercept('GET', '/quirk-grid-api-contracts-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-grid-api-contracts-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => {
      const ok = win.runChecks();
      const detail = win.document.getElementById('checkResults').textContent;
      expect(ok, `in-page API contract self-checks:\n${detail}`).to.eq(true);
    });
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
