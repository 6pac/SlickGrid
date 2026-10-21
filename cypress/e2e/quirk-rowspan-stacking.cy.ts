const rowspanHarness = `<!doctype html>
<html><head>
  <link rel="stylesheet" href="/dist/styles/css/slick.grid.css">
  <link rel="stylesheet" href="/dist/styles/css/slick-default-theme.css">
</head><body>
<div id="grid" style="width:600px;height:300px"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var data = Array.from({ length: 20 }, function(_, id) { return { id: id, title: 'Task ' + id, value: id * 10 }; });
  // row 1 hosts a 3-row span in the first column, so rows 2 and 3 are covered
  data.getItemMetadata = function(row) { return row === 1 ? { columns: { 0: { rowspan: 3 } } } : null; };
  var grid = new Slick.Grid('#grid', data, [
    { id: 'title', field: 'title', name: 'Title', width: 150 },
    { id: 'value', field: 'value', name: 'Value', width: 150 }
  ], { rowHeight: 25, enableCellRowSpan: true, enableColumnReorder: false });
  window.grid = grid;
</script></body></html>`;

describe('RowSpan stacking with transformed rows', () => {
  beforeEach(() => {
    cy.intercept('GET', '/rowspan-stacking-harness.html', { headers: { 'content-type': 'text/html' }, body: rowspanHarness });
    cy.visit('/rowspan-stacking-harness.html');
    cy.get('.slick-row[data-row="1"] .slick-cell.rowspan').should('exist');
  });

  it('keeps the host and covered rows top-positioned without a stacking context of their own', () => {
    cy.get('.slick-row[data-row="0"]').should(($row) => expect(($row[0] as HTMLElement).style.transform).to.match(/translateY/));
    for (const row of [1, 2, 3]) {
      cy.get(`.slick-row[data-row="${row}"]`).should(($row) => {
        const node = $row[0] as HTMLElement;
        expect(node.classList.contains('slick-rowspan')).to.equal(true);
        expect(node.style.top).to.equal(`${row * 25}px`);
        expect(node.style.transform).to.equal('');
        expect(getComputedStyle(node).zIndex).to.equal('auto');
      });
    }
  });

  it('paints the spanning cell above the covered rows rendered after its host', () => {
    cy.window().then((win: any) => {
      const span = win.document.querySelector('.slick-row[data-row="1"] .slick-cell.rowspan');
      const spanRect = span.getBoundingClientRect();
      expect(spanRect.height).to.be.greaterThan(50);
      // probe the part of the span that overlaps the covered rows 2 and 3
      for (const y of [spanRect.top + 25 + 10, spanRect.top + 50 + 10]) {
        const hit = win.document.elementFromPoint(spanRect.left + 20, y);
        expect(span.contains(hit), `element on top at y=${y}: ${hit && hit.className}`).to.equal(true);
      }
    });
  });
});
