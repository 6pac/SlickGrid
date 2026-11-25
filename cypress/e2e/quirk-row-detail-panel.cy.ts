const panelHarness = (gridOptions = 'pinning: { rows: { bottom: [{ id: 0 }] } }', extraColumns = '') => `<!doctype html>
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
    preTemplate: function() { return '<input class="detail-input"><button class="detail-button">Click</button><div class="detail-note">Note</div>'; },
    process: function() { return Promise.resolve(); }
  });
  var grid = new Slick.Grid('#grid', dataView, [
    detail.getColumnDefinition(), { id: 'name', field: 'name', name: 'Name', width: 400, sortable: true }${extraColumns}
  ], { rowHeight: 25, enableColumnReorder: false, enableCellNavigation: true, ${gridOptions} });
  grid.registerPlugin(detail);
  dataView.setItems(Array.from({ length: 30 }, function(_, id) { return { id: id, name: 'Row ' + id }; }));
  detail.expandDetailView(dataView.getItemById(1));
  window.grid = grid; window.dataView = dataView; window.detail = detail;
</script></body></html>`;

// panelRows: 3 with rowHeight: 25 gives a panel of ceil(3 * 2 * 13 / 25) * 25 = 100px
const PANEL_HEIGHT = 100;

const visitHarness = (gridOptions?: string, extraColumns?: string) => {
  cy.intercept('GET', '/row-detail-panel-harness.html', {
    headers: { 'content-type': 'text/html' }, body: panelHarness(gridOptions, extraColumns),
  });
  cy.visit('/row-detail-panel-harness.html');
  cy.get('.slick-row-detail-container.row-detail-1 .detail-input').should('exist');
  cy.get('.slick-row-detail-container.row-detail-1').should(($panel) => {
    expect($panel).to.have.attr('class', 'slick-row-detail-container row-detail-1');
    // the panel is rendered inside its own (expanded) row, not in an overlay of the canvas
    expect($panel.parent()).to.have.class('slick-row');
    expect($panel.parent()).to.have.class('slick-row-detail-expanded');
    expect($panel.children()).to.have.length(3);
  });
};

const rowNode = (win: any, id: number | string) => win.grid.getRowCache()[win.dataView.getRowById(id)].rowNode[0];
const rowRect = (win: any, id: number | string) => rowNode(win, id).getBoundingClientRect();
const cellRect = (win: any, id: number | string) => rowNode(win, id).querySelector('.slick-cell').getBoundingClientRect();
const panelRect = (win: any, id: number | string) => win.document.querySelector(`.row-detail-${id}`).getBoundingClientRect();

describe('Row Detail panel inside a variable height row', () => {
  it('expands a row as a single taller row without inserting any item in the DataView', () => {
    visitHarness();
    cy.window().then((win: any) => {
      expect(win.dataView.getLength()).to.equal(30);
      expect(win.grid.getOptions().enableVariableRowHeight).to.equal(true);
      expect(win.grid.getRowHeight(win.dataView.getRowById(1))).to.equal(25 + PANEL_HEIGHT);
      expect(Object.keys(win.dataView.getItemById(1))).to.deep.equal(['id', 'name']);
    });
  });

  it('keeps the cells at the base row height with the panel right below them and the next row below the panel', () => {
    visitHarness();
    cy.window().then((win: any) => {
      expect(rowRect(win, 1).height).to.equal(25 + PANEL_HEIGHT);
      expect(Math.round(cellRect(win, 1).height)).to.equal(25);
      expect(Math.abs(panelRect(win, 1).top - cellRect(win, 1).bottom)).to.be.lessThan(1);
      expect(panelRect(win, 1).height).to.equal(PANEL_HEIGHT);
      expect(Math.abs(rowRect(win, 2).top - panelRect(win, 1).bottom)).to.be.lessThan(1);
    });
  });

  it('renders an async response supplied as a replacement DataView item', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const replacement = { ...win.dataView.getItemById(1), name: 'Loaded' };
      win.detail.onAsyncResponse.notify({ item: replacement, detailView: '<h4>Loaded detail</h4>' });
    });
    cy.get('.row-detail-1 h4').should('have.text', 'Loaded detail');
    cy.window().then((win: any) => {
      expect(win.detail.getExpandedRows()[0]).to.equal(win.dataView.getItemById(1));
      win.detail.collapseAll();
      expect(win.dataView.getLength()).to.equal(30);
      expect(win.grid.getRowHeight(win.dataView.getRowById(1))).to.equal(25);
    });
    cy.get('.slick-row-detail-container').should('not.exist');
    cy.get('.slick-row-detail-expanded').should('not.exist');
  });

  it('preserves input state and event listeners when the grid re-renders every row', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const input = win.document.querySelector('.detail-input');
      const button = win.document.querySelector('.detail-button');
      let clicks = 0;
      input.value = 'Keep this value';
      button.addEventListener('click', () => clicks++);
      win.detail.saveDetailView(win.dataView.getItemById(1));
      win.grid.invalidate();
      expect(win.document.querySelector('.detail-input')).to.equal(input);
      expect(input.value).to.equal('Keep this value');
      button.click();
      expect(clicks).to.equal(1);
    });
  });

  it('keeps the detail open, with its content, through a sort', () => {
    visitHarness('');
    cy.window().then((win: any) => {
      win.document.querySelector('.detail-input').value = 'still here';
      win.dataView.sort((a: any, b: any) => b.id - a.id);
    });
    cy.window().should((win: any) => {
      const row = win.dataView.getRowById(1);
      expect(row).to.equal(28);
      expect(win.dataView.getLength()).to.equal(30);
      expect(win.grid.getRowHeight(row)).to.equal(25 + PANEL_HEIGHT);
      expect(win.detail.isExpanded(1)).to.equal(true);
    });
    cy.window().then((win: any) => win.grid.scrollRowIntoView(28));
    cy.get('.row-detail-1 .detail-input').should('have.value', 'still here');
  });

  it('docks a pinned expanded row together with its panel', () => {
    visitHarness();
    cy.window().then((win: any) => {
      // the bottom-pinned row 0 shifts every row above it; the panel moves with its row
      expect(Math.abs(panelRect(win, 1).top - cellRect(win, 1).bottom)).to.be.lessThan(1);

      win.grid.setOptions({ pinning: { rows: { top: [{ id: 1 }] } } });
      win.grid.scrollTo(400);
      win.grid.render();
      const panel = win.document.querySelector('.row-detail-1');
      expect(panel.parentElement).to.equal(rowNode(win, 1));
      expect(rowNode(win, 1).parentElement.classList.contains('slick-docking-overlay')).to.equal(true);
      expect(rowRect(win, 1).height).to.equal(25 + PANEL_HEIGHT);
      // the pinned band's 1px edge border sits inside the (border-box) row, so its cells are 1px shorter
      expect(Math.abs(panelRect(win, 1).top - cellRect(win, 1).bottom)).to.be.at.most(1);
      expect(panelRect(win, 1).bottom).to.be.at.most(rowRect(win, 1).bottom);
    });
  });

  it('applies the panel line-height to every top-level element of the template', () => {
    visitHarness();
    cy.window().then((win: any) => {
      const panel = win.document.querySelector('.row-detail-1');
      expect(win.getComputedStyle(panel).lineHeight, 'panel line-height').to.equal('13px');
      expect(win.getComputedStyle(panel.querySelector('.detail-note')).lineHeight, 'last top-level element').to.equal('13px');
      expect(win.getComputedStyle(panel.querySelector('.detail-input')).verticalAlign, 'no vertical-align forced on a leading form control').to.equal('baseline');
    });
  });

  it('caps the panel height at maxRows', () => {
    visitHarness();
    cy.window().then((win: any) => {
      win.detail.setOptions({ maxRows: 2 });
      win.detail.expandDetailView(win.dataView.getItemById(5));
      expect(win.dataView.getLength()).to.equal(30);
      expect(panelRect(win, 5).height).to.equal(2 * 25);
      expect(rowRect(win, 5).height).to.equal(3 * 25);
      win.detail.collapseDetailView(win.dataView.getItemById(5));
      expect(rowRect(win, 5).height).to.equal(25);
    });
  });

  it('adds the panel below a row whose own height comes from a user rowHeightProvider', () => {
    visitHarness('enableVariableRowHeight: true, rowHeightProvider: function(g, row, item) { return item && item.id === 1 ? 60 : undefined; }');
    cy.window().then((win: any) => {
      expect(rowRect(win, 1).height).to.equal(60 + PANEL_HEIGHT);
      expect(Math.round(cellRect(win, 1).height)).to.equal(60);
      expect(Math.abs(panelRect(win, 1).top - cellRect(win, 1).bottom)).to.be.lessThan(1);
      expect(panelRect(win, 1).height).to.equal(PANEL_HEIGHT);
    });
  });

  it('keeps the panel within the viewport while scrolling horizontally with pinned columns', () => {
    visitHarness('pinning: { columns: { left: 1 } }', ', { id: "extra", field: "name", name: "Extra", width: 600 }');
    cy.window().then((win: any) => win.grid.scrollCellIntoView(1, 2));
    cy.window().should((win: any) => {
      const viewport = win.grid.getViewportNode().getBoundingClientRect();
      const panel = panelRect(win, 1);
      expect(Math.abs(panel.left - viewport.left)).to.be.lessThan(1);
      expect(panel.right).to.be.at.most(viewport.right + 1);
      // the cells of the expanded row keep the base height in the pinned and scrolling regions
      expect(Math.round(cellRect(win, 1).height)).to.equal(25);
    });
  });

  it('keeps the panel within the viewport while scrolling horizontally without pinning', () => {
    visitHarness('', ', { id: "extra", field: "name", name: "Extra", width: 600 }');
    cy.window().then((win: any) => win.grid.scrollCellIntoView(1, 2));
    cy.window().should((win: any) => {
      const viewport = win.grid.getViewportNode().getBoundingClientRect();
      expect(win.grid.getCanvases()[0].getBoundingClientRect().left).to.be.lessThan(viewport.left); // the canvas did scroll
      const panel = panelRect(win, 1);
      expect(Math.abs(panel.left - viewport.left)).to.be.lessThan(1);
      expect(panel.right).to.be.at.most(viewport.right + 1);
    });
  });

  it('navigates from the expanded row straight to the next row and keeps panel keys away from the grid', () => {
    visitHarness('');
    cy.window().then((win: any) => win.grid.setActiveCell(1, 1));
    cy.get('.slick-row[data-row="1"] .slick-cell.l1').should('have.class', 'active').trigger('keydown', { key: 'ArrowDown', which: 40 });
    cy.window().should((win: any) => expect(win.grid.getActiveCell()).to.deep.include({ row: 2, cell: 1 }));

    cy.window().then((win: any) => win.grid.setActiveCell(1, 1));
    cy.get('.row-detail-1 .detail-input').type('ab{leftarrow}{downarrow}c');
    cy.get('.row-detail-1 .detail-input').should('have.value', 'acb');
    cy.window().should((win: any) => expect(win.grid.getActiveCell()).to.deep.include({ row: 1, cell: 1 }));
  });
});
