const overlayHarness = (gridOptions = 'pinning: { rows: { bottom: [{ id: 0 }] } }', extraColumns = '') => `<!doctype html>
<html><head>
  <link rel="stylesheet" href="/dist/styles/css/slick.grid.css">
  <link rel="stylesheet" href="/dist/styles/css/slick-default-theme.css">
  <link rel="stylesheet" href="/dist/styles/css/slick.rowdetailview.css">
</head><body>
<div id="grid" style="width:600px;height:240px"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script src="/dist/browser/slick.dataview.js"></script>
<script src="/dist/browser/plugins/slick.rowdetailview.js"></script>
<script>
  var dataView = new Slick.Data.DataView();
  var detail = new Slick.Plugins.RowDetailView({
    panelRows: 3,
    preTemplate: function() { return '<input class="detail-input"><button class="detail-button">Click</button>'; },
    process: function() { return Promise.resolve(); }
  });
  var grid = new Slick.Grid('#grid', dataView, [
    detail.getColumnDefinition(), { id: 'name', field: 'name', name: 'Name', width: 400 }${extraColumns}
  ], { rowHeight: 25, enableColumnReorder: false, ${gridOptions} });
  grid.registerPlugin(detail);
  dataView.setItems(Array.from({ length: 30 }, function(_, id) { return { id: id, name: 'Row ' + id }; }));
  detail.expandDetailView(dataView.getItemById(1));
  window.grid = grid; window.dataView = dataView; window.detail = detail;
</script></body></html>`;

// panelRows: 3 with rowHeight: 25 reserves ceil(3 * 2 * 13 / 25) = 4 padding rows below the parent
const PADDING_ROWS = 4;

const visitHarness = (gridOptions?: string, extraColumns?: string) => {
  cy.intercept('GET', '/row-detail-overlay-harness.html', {
    headers: { 'content-type': 'text/html' }, body: overlayHarness(gridOptions, extraColumns),
  });
  cy.visit('/row-detail-overlay-harness.html');
  cy.get('.cellDetailView_1 .detail-input').should('exist');
};

const rowRect = (win: any, id: number | string) => win.grid.getRowCache()[win.dataView.getRowById(id)].rowNode[0].getBoundingClientRect();
const panelRect = (win: any, id: number | string) => win.document.querySelector(`.cellDetailView_${id}`).getBoundingClientRect();

describe('Row Detail overlay lifecycle', () => {
  it('renders an async response supplied as a replacement DataView item', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const replacement = { ...win.dataView.getItemById(1), name: 'Loaded' };
      win.detail.onAsyncResponse.notify({ item: replacement, detailView: '<h4>Loaded detail</h4>' });
    });
    cy.get('.cellDetailView_1 h4').should('have.text', 'Loaded detail');
    cy.window().then((win: any) => {
      expect(win.detail.getExpandedRows()[0]).to.equal(win.dataView.getItemById(1));
      win.detail.collapseAll();
      expect(win.dataView.getLength()).to.equal(30);
    });
    cy.get('.dynamic-cell-detail').should('not.exist');
  });

  it('preserves input state and event listeners when saving a mounted detail', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const input = win.document.querySelector('.detail-input');
      const button = win.document.querySelector('.detail-button');
      let clicks = 0;
      input.value = 'Keep this value';
      button.addEventListener('click', () => clicks++);
      win.detail.saveDetailView(win.dataView.getItemById(1));
      win.grid.render();
      expect(win.document.querySelector('.detail-input')).to.equal(input);
      expect(input.value).to.equal('Keep this value');
      button.click();
      expect(clicks).to.equal(1);
    });
  });

  it('places the panel over its padding rows, also when the parent is pinned', () => {
    visitHarness();
    cy.window().then((win: any) => {
      // the bottom-pinned row 0 shifts every row above it; the panel follows the padding rows
      expect(Math.abs(panelRect(win, 1).top - rowRect(win, 1).bottom)).to.be.lessThan(1);
      expect(Math.abs(panelRect(win, 1).top - rowRect(win, '1.1').top)).to.be.lessThan(1);
      expect(panelRect(win, 1).height).to.equal(PADDING_ROWS * 25);

      // a pinned parent sits in the band while its padding rows stay in the scrolling area
      win.grid.setOptions({ pinning: { rows: { top: [{ id: 1 }] } } });
      win.grid.scrollTo(0);
      win.grid.render();
      expect(Math.abs(panelRect(win, 1).top - rowRect(win, '1.1').top)).to.be.lessThan(1);
      expect(panelRect(win, 1).top).to.be.at.least(rowRect(win, 1).bottom - 1);

      // the panel leaves with its padding rows instead of staying under the band over other rows
      win.grid.scrollTo(400);
      win.grid.render();
      expect(win.document.querySelector('.cellDetailView_1')).to.equal(null);
      win.grid.scrollTo(0);
      win.grid.render();
      expect(Math.abs(panelRect(win, 1).top - rowRect(win, '1.1').top)).to.be.lessThan(1);
    });
  });

  it('caps the padding rows at maxRows before they are inserted', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const baseLength = win.dataView.getLength(); // 30 items plus the padding rows of row 1
      win.detail.setOptions({ maxRows: 2 });
      win.dataView.beginUpdate(); // a toggle click expands inside a DataView batch
      win.detail.expandDetailView(win.dataView.getItemById(5));
      win.dataView.endUpdate();
      expect(win.dataView.getItemById(5)._sizePadding).to.equal(2);
      expect(win.dataView.getLength()).to.equal(baseLength + 2);
      expect(panelRect(win, 5).height).to.equal(2 * 25);
      win.detail.collapseDetailView(win.dataView.getItemById(5));
      expect(win.dataView.getLength()).to.equal(baseLength);
      expect(win.dataView.getItemById('5.3')).to.equal(undefined);
    });
  });

  it('sizes the panel from the padding rows under variable row heights', () => {
    visitHarness('enableVariableRowHeight: true, rowHeightProvider: function(g, row, item) { return item && item.id === 1 ? 60 : undefined; }');
    cy.window().then((win: any) => {
      expect(rowRect(win, 1).height).to.equal(60);
      expect(Math.abs(panelRect(win, 1).top - rowRect(win, 1).bottom)).to.be.lessThan(1);
      expect(panelRect(win, 1).height).to.equal(PADDING_ROWS * 25);
    });
  });

  it('keeps the panel within the viewport while scrolling horizontally with pinned columns', () => {
    visitHarness('pinning: { columns: { left: 1 } }', ', { id: "extra", field: "name", name: "Extra", width: 600 }');
    cy.window().then((win: any) => win.grid.scrollCellIntoView(1, 2));
    cy.window().should((win: any) => {
      const viewport = win.grid.getViewportNode().getBoundingClientRect();
      expect(win.grid.getCanvases()[0].getBoundingClientRect().left).to.be.lessThan(viewport.left); // the canvas did scroll
      const panel = panelRect(win, 1);
      expect(Math.abs(panel.left - viewport.left)).to.be.lessThan(1);
      expect(panel.right).to.be.at.most(viewport.right + 1);
    });
  });
});
