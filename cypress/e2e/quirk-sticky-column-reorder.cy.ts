/**
 * Regression test for column reordering while a sticky column is docked.
 *
 * On the sticky transform path a docked sticky column is listed in the resolved left band
 * although its header still lives in the centre header region. Mapping the resolved bands onto
 * the Sortable band arrays therefore produced an undefined slot and threw on drop. Reordering
 * two centre columns while a sticky column is docked must succeed and keep every other column
 * in place.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: sticky column reorder</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 520px; height: 260px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/node_modules/sortablejs/Sortable.min.js"></script>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [];
  for (var c = 0; c < 10; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 120, sticky: c === 2 ? 'both' : undefined });
  }
  var data = [];
  for (var i = 0; i < 30; i++) {
    var item = { id: i };
    for (var k = 0; k < 10; k++) { item['c' + k] = i + ':' + k; }
    data.push(item);
  }
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: true,
    rowHeight: 25
  });
  window.reorderCalls = 0;
  grid.onColumnsReordered.subscribe(function () { window.reorderCalls++; });
</script>
</body>
</html>`;

describe('Quirk - reordering columns while a sticky column is docked', { retries: 1 }, () => {
  const centerHeaders = '#myGrid .slick-header-columns-center';

  it('should reorder two centre columns without throwing and keep the sticky column docked', () => {
    cy.intercept('GET', '/quirk-sticky-column-reorder-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-sticky-column-reorder-harness.html`);
    cy.window().its('grid').should('exist');

    // scroll far enough that the sticky column c2 leaves its natural position and docks left
    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(500, 0);
    cy.get('#myGrid .slick-header-column[data-id="c2"]').should('have.class', 'slick-column-sticky');

    cy.contains(`${centerHeaders} .slick-header-column`, 'C7').then(($target) => {
      cy.contains(`${centerHeaders} .slick-header-column`, 'C6').drag($target);
    });

    cy.window().should((win: any) => {
      const ids = win.grid.getColumns().map((column: any) => column.id);
      expect(ids, 'column order after the drop').to.deep.equal(['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c7', 'c6', 'c8', 'c9']);
      expect(win.reorderCalls, 'onColumnsReordered calls').to.eq(1);
    });
    cy.get('#myGrid .slick-header-column[data-id="c2"]').should('have.class', 'slick-column-sticky');
  });
});
