const overlayHarness = `<!doctype html>
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
    detail.getColumnDefinition(), { id: 'name', field: 'name', name: 'Name', width: 400 }
  ], { rowHeight: 25, enableColumnReorder: false, pinning: { rows: { bottom: [{ id: 0 }] } } });
  grid.registerPlugin(detail);
  dataView.setItems(Array.from({ length: 30 }, function(_, id) { return { id: id, name: 'Row ' + id }; }));
  detail.expandDetailView(dataView.getItemById(1));
  window.grid = grid; window.dataView = dataView; window.detail = detail;
</script></body></html>`;

describe('Row Detail overlay lifecycle', () => {
  beforeEach(() => {
    cy.intercept('GET', '/row-detail-overlay-harness.html', {
      headers: { 'content-type': 'text/html' }, body: overlayHarness,
    });
    cy.visit('/row-detail-overlay-harness.html');
    cy.get('.cellDetailView_1 .detail-input').should('exist');
  });

  it('renders an async response supplied as a replacement DataView item', () => {
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

  it('aligns details with rows shifted by pinning and with a pinned parent after scrolling', () => {
    const checkPosition = (win: any) => {
      const row = win.grid.getRowCache()[win.dataView.getRowById(1)].rowNode[0];
      const panel = win.document.querySelector('.cellDetailView_1');
      expect(Math.abs(panel.getBoundingClientRect().top - row.getBoundingClientRect().bottom)).to.be.lessThan(1);
    };
    cy.window().then((win: any) => {
      checkPosition(win);
      win.grid.setOptions({ pinning: { rows: { top: [{ id: 1 }] } } });
      win.grid.scrollTo(400);
      win.grid.render();
      checkPosition(win);
    });
  });
});
