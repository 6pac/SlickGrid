/**
 * Regression tests for four autosize measurement faults in `slick.grid.ts`:
 *
 * 1. `autosizeColumn()` computed `autoSize.widthPx` but never applied it, so the column kept its width.
 * 2. `ValueFilterMode.DeDuplicate` set `rowInfo.endIndex = rowInfo.length - 1`. `RowInfo.length` is never
 *    assigned, so the bound was `NaN`, the measuring loop never ran and the column sized to its header.
 * 3. After a value filter reduced the rows to a short value list, `getColWidth()` called the formatter
 *    with `getDataItem(i)`, where `i` is the position in that list and not the source row. A formatter
 *    that reads other fields of its row was measured against row 0.
 * 4. `ContentIntelligent` re-derived the data type from row 0 even when `autoSize.colDataTypeOf` was set,
 *    so a user-supplied type was only honoured on an empty grid.
 *
 * The spec is SELF-HOSTING: the harness page is served from this file via cy.intercept (nothing is
 * added to examples/). Header names are deliberately short so a failed measurement cannot hide behind
 * `headerWidthPx`. Each test FAILS on the unfixed code and PASSES with the fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: autosize measurement</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 900px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var LONG_ROW = 7;
  var data = [];
  for (var i = 0; i < 20; i++) {
    data.push({
      id: i,
      wide: i === LONG_ROW ? 'a considerably longer value that needs a wide column' : 'short',
      dup: i === LONG_ROW ? 'the one long value hidden among many duplicates' : 'dup',
      code: i === LONG_ROW ? 'ABCDEFGH' : 'AB',
      suffix: i === LONG_ROW ? 'with a long suffix read from the same row' : '',
      amount: i === 0 ? '' : String(i * 1111)
    });
  }

  function suffixFormatter(row, cell, value, columnDef, dataContext) {
    return value + ' ' + dataContext.suffix;
  }

  function buildColumns() {
    return [
      { id: 'wide', name: 'W', field: 'wide', width: 40 },
      { id: 'dup', name: 'D', field: 'dup', width: 40, autoSize: {
        autosizeMode: Slick.ColAutosizeMode.Content,
        rowSelectionMode: Slick.RowSelectionMode.AllRows,
        valueFilterMode: Slick.ValueFilterMode.DeDuplicate
      } },
      { id: 'code', name: 'C', field: 'code', width: 40, formatter: suffixFormatter },
      { id: 'amount', name: 'A', field: 'amount', width: 40, autoSize: { colDataTypeOf: 'number' } }
    ];
  }

  window.grid = new Slick.Grid('#myGrid', data, buildColumns(), {
    enableCellNavigation: true,
    enableColumnReorder: false,
    autosizeColsMode: Slick.GridAutosizeColsMode.IgnoreViewport
  });

  function colById(id) {
    return window.grid.getColumns().filter(function (c) { return c.id === id; })[0];
  }

  window.autosizeOneColumn = function () {
    window.grid.setColumns(buildColumns());
    var before = colById('wide').width;
    window.grid.autosizeColumn('wide');
    var col = colById('wide');
    var headerEl = document.getElementById(window.grid.getUID() + 'wide');
    return {
      before: before,
      widthPx: Math.round(col.autoSize.widthPx),
      width: Math.round(col.width),
      headerWidth: headerEl ? headerEl.offsetWidth : -1
    };
  };

  window.autosizeAllColumns = function () {
    window.grid.setColumns(buildColumns());
    window.grid.autosizeColumns();
    var result = {};
    window.grid.getColumns().forEach(function (c) {
      result[c.id] = {
        contentSizePx: Math.round(c.autoSize.contentSizePx),
        headerWidthPx: Math.round(c.autoSize.headerWidthPx),
        valueFilterMode: c.autoSize.valueFilterMode
      };
    });
    return result;
  };
</script>
</body>
</html>`;

function visitHarness() {
  cy.intercept('GET', '/quirk-autosize-measurement-harness.html', {
    headers: { 'content-type': 'text/html' },
    body: harnessHtml,
  });
  cy.visit(`${Cypress.config('baseUrl')}/quirk-autosize-measurement-harness.html`);
  cy.window().its('grid').should('exist');
}

describe('Quirk - autosize measurement', { retries: 1 }, () => {
  it('autosizeColumn() should apply the width it computes', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const r = win.autosizeOneColumn();
      expect(r.before, 'column starts narrow').to.eq(40);
      expect(r.widthPx, 'a wide content width was computed').to.be.greaterThan(200);
      expect(r.width, 'column width takes the computed width').to.eq(r.widthPx);
      expect(r.headerWidth, 'header is re-rendered at the new width').to.be.greaterThan(200);
    });
  });

  it('DeDuplicate should measure the unique values', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const dup = win.autosizeAllColumns().dup;
      expect(dup.headerWidthPx, 'header is narrow').to.be.lessThan(60);
      expect(dup.contentSizePx, 'the long unique value is measured').to.be.greaterThan(200);
    });
  });

  it('the formatter should receive the source row of the value being measured', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const code = win.autosizeAllColumns().code;
      expect(code.valueFilterMode, 'string column reduces to its longest value').to.eq(win.Slick.ValueFilterMode.GetLongestText);
      // row 0 has an empty suffix, so measuring against row 0 gives only "ABCDEFGH " (~70px)
      expect(code.contentSizePx, 'the suffix from the longest value row is measured').to.be.greaterThan(200);
    });
  });

  it('ContentIntelligent should use autoSize.colDataTypeOf instead of guessing from row 0', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const amount = win.autosizeAllColumns().amount;
      // row 0 holds an empty string, so guessing from row 0 picks the string strategy (GetLongestText)
      expect(amount.valueFilterMode, 'number strategy from the supplied type').to.eq(win.Slick.ValueFilterMode.GetGreatestAndSub);
    });
  });
});
