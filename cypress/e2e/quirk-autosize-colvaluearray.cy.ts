/**
 * Regression test for issue #934: autosize ignored `autoSize.colValueArray`.
 *
 * `getColContentSize()` handed the bare `colValueArray` to `getColWidth()` cast as `any`, but
 * `getColWidth()` measures by walking `rowInfo.startIndex`..`rowInfo.endIndex`. On a bare array
 * both bounds are `undefined`, `undefined <= undefined` is false, so the measuring loop never ran
 * and the column was sized to an empty cell (~8px).
 *
 * This is not only a user-supplied path: under the default `ColAutosizeMode.ContentIntelligent`,
 * the grid sets `colValueArray` itself for boolean, date and moment columns, so autosize silently
 * failed to measure content for all three types.
 *
 * The spec is SELF-HOSTING: the harness page is served from this file via cy.intercept (nothing is
 * added to examples/). It asserts on `column.autoSize.contentSizePx`, which is the value
 * `getColContentSize()` returns - the measurement itself, isolated from the width-distribution that
 * happens afterwards. FAILS on the unfixed code (date column measures ~8px) and PASSES with the fix
 * (~427px).
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: autosize colValueArray</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 800px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var data = [];
  for (var i = 0; i < 20; i++) {
    data.push({
      id: i,
      text: 'Task ' + i,
      when: new Date(2009, 8, 30, 12, 20, 20),  // typeof 'object' + instanceof Date -> colValueArray
      flag: (i % 2 === 0)                       // typeof 'boolean'                  -> colValueArray
    });
  }

  // deliberately SHORT header names: getColContentSize() returns max(headerWidthPx, measured), so a
  // wide header would mask a failed measurement.
  var columns = [
    { id: 'text', name: 'T', field: 'text', width: 80 },
    { id: 'when', name: 'W', field: 'when', width: 80 },
    { id: 'flag', name: 'F', field: 'flag', width: 80 }
  ];

  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,       // keep the harness free of the SortableJS dependency
    autosizeColsMode: Slick.GridAutosizeColsMode.IgnoreViewport
  });

  window.measureColumns = function () {
    var cols = window.grid.getColumns();
    cols.forEach(function (c) {
      c.width = 80;
      c.autoSize = { autosizeMode: Slick.ColAutosizeMode.ContentIntelligent };
    });
    window.grid.setColumns(cols);
    window.grid.autosizeColumns();

    var result = {};
    window.grid.getColumns().forEach(function (c) {
      result[c.id] = {
        contentSizePx: Math.round(c.autoSize.contentSizePx),
        headerWidthPx: Math.round(c.autoSize.headerWidthPx),
        usedValueArray: !!c.autoSize.colValueArray
      };
    });
    return result;
  };
</script>
</body>
</html>`;

describe('Quirk - autosize must measure autoSize.colValueArray', { retries: 1 }, () => {
  it('should measure date and boolean columns instead of sizing them to an empty cell', () => {
    cy.intercept('GET', '/quirk-autosize-colvaluearray-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-autosize-colvaluearray-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => {
      const measured = win.measureColumns();

      // preconditions: the two columns really do go through the colValueArray path, and their
      // headers are small enough that a failed measurement cannot hide behind headerWidthPx
      expect(measured.when.usedValueArray, 'date column uses colValueArray').to.eq(true);
      expect(measured.flag.usedValueArray, 'boolean column uses colValueArray').to.eq(true);
      expect(measured.when.headerWidthPx, 'date header is narrow').to.be.lessThan(60);

      // control: a plain string column does not use colValueArray and must keep measuring correctly
      expect(measured.text.usedValueArray, 'string column does not use colValueArray').to.eq(false);
      expect(measured.text.contentSizePx, 'string column still measured').to.be.greaterThan(30);

      // The bug measured ~8px (an empty cell) for both, so `max(headerWidthPx, measured)` collapsed
      // to exactly headerWidthPx. Beating one's own header width is therefore the precise signal
      // that the content was measured at all.
      expect(measured.when.contentSizePx, 'date content beats its header width').to.be.greaterThan(measured.when.headerWidthPx);
      expect(measured.flag.contentSizePx, 'boolean content beats its header width').to.be.greaterThan(measured.flag.headerWidthPx);

      // ...and a stringified Date is long, so this also holds in absolute terms with a wide margin
      expect(measured.when.contentSizePx, 'date column content measured').to.be.greaterThan(200);
    });
  });
});
