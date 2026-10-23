describe('Quirk - hidden columns in group totals rows', () => {
  for (const metadataKey of ['1', 'firstName']) {
    for (const renderPath of ['initial render', 'cell cleanup and render']) {
      it(`should preserve group titles but omit hidden totals cells with metadata key ${metadataKey} during ${renderPath}`, () => {
        cy.intercept('GET', '/quirk-hidden-group-totals.html', {
          headers: { 'content-type': 'text/html' },
          body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css">
  <style>#myGrid { width: 600px; height: 250px; }</style>
</head>
<body>
  <div id="myGrid"></div>
  <script src="/dist/browser/slick.core.js"></script>
  <script src="/dist/browser/slick.interactions.js"></script>
  <script src="/dist/browser/slick.grid.js"></script>
  <script>
    var columns = [
      { id: 'id', field: 'id', name: '#', width: 50 },
      { id: 'firstName', field: 'firstName', name: 'First Name', hidden: true },
      { id: 'lastName', field: 'lastName', name: 'Last Name', hidden: true },
      { id: 'age', field: 'age', name: 'Age', width: 100 }
    ];
    var items = [
      { id: 0, firstName: 'Group', lastName: '', age: 0 },
      { id: 1, firstName: 'Totals', lastName: '', age: 58 },
      { id: 2, firstName: 'Hidden', lastName: 'Name', age: 58 }
    ];
    var metadata = [
      { cssClasses: 'slick-group', isGroup: true, columns: { '${metadataKey}': { colspan: '*', formatter: function () { return 'Group A'; } } } },
      { cssClasses: 'slick-group-totals', isGroup: true },
      { columns: { '${metadataKey}': { formatter: function () { return 'Still hidden'; } } } }
    ];
    var data = {
      getItemMetadata: function (row) { return metadata[row]; },
      getLength: function () { return items.length; },
      getItem: function (row) { return items[row]; }
    };
    window.grid = new Slick.Grid('#myGrid', data, columns, { enableColumnReorder: false });
  </script>
</body>
</html>`,
        });
        cy.visit(`${Cypress.config('baseUrl')}/quirk-hidden-group-totals.html`);
        cy.window().then((win: any) => {
          const grid = win.grid;
          if (renderPath === 'cell cleanup and render') {
            const range = grid.getRenderedRange();
            // Evict the existing cells so the second path must recreate the title and totals.
            grid.cleanUpAndRenderCells({ ...range, leftPx: 10000, rightPx: 11000 });
            expect(win.document.querySelectorAll('#myGrid .slick-cell')).to.have.length(0);
            grid.cleanUpAndRenderCells(range);
          }

          const groupRow = win.document.querySelector('#myGrid [data-row="0"]');
          expect(groupRow.querySelector('.l1.r3')?.textContent).to.eq('Group A');
          expect(groupRow.querySelector('.l2')).to.eq(null);
          for (const row of [1, 2]) {
            const rowNode = win.document.querySelector(`#myGrid [data-row="${row}"]`);
            expect(rowNode.querySelector('.l1'), `row ${row}: hidden first name`).to.eq(null);
            expect(rowNode.querySelector('.l2'), `row ${row}: hidden last name`).to.eq(null);
            expect(rowNode.querySelector('.l3')?.textContent).to.eq('58');
            expect(rowNode.querySelectorAll('.slick-cell')).to.have.length(2);
          }
        });
      });
    }
  }
});
