/**
 * Regression test for native scrolls on the header-row container of a docking grid.
 *
 * With the docking horizontal scrollbar, the header, header-row, footer and viewport containers
 * are kept at scrollLeft 0 and their content is translated by the proxy position. When the
 * browser scrolls one of those containers natively (for example to reveal a focused filter
 * input), the value it reports is relative to the current position. Forwarding it as an
 * absolute position jumped the whole grid back towards the left edge.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: chrome scroll forwarding</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid { width: 600px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var columns = [];
  for (var c = 0; c < 30; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 100 });
  }
  var data = [];
  for (var i = 0; i < 50; i++) {
    var item = { id: i };
    for (var k = 0; k < 30; k++) { item['c' + k] = i + ':' + k; }
    data.push(item);
  }
  window.grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    showHeaderRow: true,
    rowHeight: 25,
    pinning: { columns: { left: 0 } }
  });
</script>
</body>
</html>`;

describe('Quirk - native chrome scrolls are forwarded as deltas in proxy mode', { retries: 1 }, () => {
  it('should add a header-row scroll to the current proxy position instead of replacing it', () => {
    cy.intercept('GET', '/quirk-pinning-chrome-scroll-forwarding-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-pinning-chrome-scroll-forwarding-harness.html`);
    cy.window().its('grid').should('exist');

    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(400, 0);
    cy.window().should((win: any) => {
      expect(win.grid.scrollLeft, 'proxy position').to.be.closeTo(400, 2);
    });

    // simulate the browser revealing something inside the header-row container
    cy.get('#myGrid .slick-headerrow').then(($headerRow) => {
      $headerRow[0].scrollLeft = 60;
    });

    cy.window().should((win: any) => {
      expect(win.grid.scrollLeft, 'proxy position after a native header-row scroll').to.be.closeTo(460, 2);
      expect(win.document.querySelector('#myGrid .slick-headerrow').scrollLeft, 'header-row container reset').to.eq(0);
    });
    cy.get('#myGrid .slick-horizontal-scroller').should(($scroller) => {
      expect($scroller[0].scrollLeft).to.be.closeTo(460, 2);
    });
  });
});
