const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css">
  <style>#myGrid { width: 800px; height: 400.1px; } #outer { height: 650px; overflow: auto; } #spacer { height: 1200px; }</style>
</head>
<body>
<div id="outer"><div id="myGrid"></div><div id="spacer"></div></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  window.mount = function(options) {
    if (window.grid) window.grid.destroy();
    var count = options.count || 500000;
    var data = { getLength: function() { return count; }, getItem: function(row) { return { id: row, value: 'Row ' + row }; } };
    var columns = Array.from({length: 30}, function(_, col) { return { id: 'c' + col, field: 'value', name: 'Column ' + col, width: 100 }; });
    window.grid = new Slick.Grid('#myGrid', data, columns, Object.assign({ rowHeight: 25, enableColumnReorder: false }, options));
    window.renders = 0;
    grid.onRendered.subscribe(function() { window.renders++; });
    window.viewport = document.querySelector('#myGrid .slick-viewport');
  };
  window.jump = function(top, left) {
    viewport.scrollTop = top;
    if (left !== undefined) grid._viewportScrollContainerX.scrollLeft = left;
    viewport.dispatchEvent(new Event('scroll'));
  };
  window.frame = function() { return new Promise(function(resolve) { requestAnimationFrame(resolve); }); };
  window.geometryErrors = function() {
    var errors = [];
    var rect = viewport.getBoundingClientRect();
    var first = grid.getRowFromPosition(viewport.scrollTop);
    var last = Math.min(grid.getDataLength() - 1, grid.getRowFromPosition(viewport.scrollTop + viewport.clientHeight - 1));
    for (var row = first; row <= last; row++) {
      var node = document.querySelector('#myGrid .slick-row[data-row="' + row + '"]');
      if (!node) { errors.push('missing row ' + row); continue; }
      var expectedTop = rect.top + viewport.clientTop + grid.getRowTop(row) - viewport.scrollTop;
      if (Math.abs(node.getBoundingClientRect().top - expectedTop) > 1) errors.push('row top ' + row);
      for (var col = 0; col < 30; col++) {
        var header = document.querySelector('#myGrid .slick-header-column[data-id="c' + col + '"]');
        var headerRect = header.getBoundingClientRect();
        if (headerRect.right <= rect.left || headerRect.left >= rect.right) continue;
        var cell = grid.getCellNode(row, col);
        if (!cell) { errors.push('missing cell ' + row + ':' + col); continue; }
        var cellRect = cell.getBoundingClientRect();
        if (Math.abs(cellRect.left - headerRect.left) > 1 || Math.abs(cellRect.width - headerRect.width) > 1) errors.push('column alignment ' + row + ':' + col);
        if (Math.abs(cellRect.top - expectedTop) > 1) errors.push('cell top ' + row + ':' + col);
        if (cell.textContent !== 'Row ' + row) errors.push('cell content ' + row + ':' + col);
      }
    }
    return errors;
  };
  mount({});
</script>
</body>
</html>`;

describe('PR 2852 - synchronous scrolling and cell rendering fast paths', () => {
  beforeEach(() => {
    cy.intercept('GET', '/scroll-performance-harness.html', { headers: { 'content-type': 'text/html' }, body: harnessHtml });
    cy.visit('/scroll-performance-harness.html');
    cy.window().its('grid').should('exist');
  });
  [50000, 500000].forEach((count) => {
    it(`renders large jumps and reversals synchronously with ${count} rows`, () => {
      cy.window().then((win: any) => {
        win.mount({ count });
        expect(win.grid.getOptions().scrollRenderThrottling).to.eq(0);
        for (const top of [2000, 12000, 6000, 1e9, 0]) {
          win.jump(top);
          expect(win.geometryErrors()).to.deep.eq([]);
        }
        expect(win.renders).to.eq(5);
      });
    });
  });
  it('retains opt-in timer throttling', () => {
    cy.window().then((win: any) => win.mount({ scrollRenderThrottling: 10 }));
    cy.clock(0, ['setTimeout', 'clearTimeout']);
    cy.window().then((win: any) => {
      win.jump(2000);
      win.jump(12000);
      expect(win.renders).to.eq(1);
    });
    cy.tick(10);
    cy.window().then((win: any) => {
      expect(win.renders).to.eq(2);
      expect(win.geometryErrors()).to.deep.eq([]);
    });
  });
  it('rebuilds the throttle when scrollRenderThrottling changes through setOptions', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ scrollRenderThrottling: 10 });
      win.renders = 0;
    });
    cy.clock(0, ['setTimeout', 'clearTimeout']);
    cy.window().then((win: any) => {
      win.jump(2000);
      win.jump(12000);
      expect(win.renders).to.eq(1);
    });
    // the queued jump must wait for the new 10 ms period, not the 0 ms period the grid was built with
    cy.tick(5);
    cy.window().then((win: any) => expect(win.renders).to.eq(1));
    cy.tick(5);
    cy.window().then((win: any) => {
      expect(win.renders).to.eq(2);
      expect(win.geometryErrors()).to.deep.eq([]);
    });
  });
  it('skips sanitizing plain text but preserves entity parsing and HTML sanitization', () => {
    cy.window().then((win: any) => {
      const sanitizer = cy.stub().callsFake((value: string) => value === '<b>unsafe</b>' ? '<em>safe</em>' : value);
      win.grid.setOptions({ enableHtmlRendering: true, sanitizer });
      sanitizer.resetHistory();
      const node = win.document.createElement('div');
      win.grid.applyHtmlCode(node, 'Task 123');
      expect(node.textContent).to.eq('Task 123');
      expect(sanitizer).not.to.have.been.called;
      win.grid.applyHtmlCode(node, 'A &amp; B');
      expect(node.textContent).to.eq('A & B');
      expect(sanitizer).to.have.been.calledWith('A &amp; B');
      win.grid.applyHtmlCode(node, '<b>unsafe</b>');
      expect(node.innerHTML).to.eq('<em>safe</em>');
    });
  });
  it('retains formatter classes after removing the per-cell event', () => {
    cy.window().then((win: any) => {
      expect(win.grid.onBeforeAppendCell).to.eq(undefined);
      const columns = win.grid.getColumns();
      columns[0].formatter = (_row: number, _cell: number, value: string) => ({ text: value, addClasses: 'custom-cell highlighted' });
      win.grid.setColumns(columns);
      expect(win.grid.getCellNode(0, 0).classList.contains('custom-cell')).to.eq(true);
      expect(win.grid.getCellNode(0, 0).textContent).to.eq('Row 0');
      expect(win.grid.getParentRowSpanByCell(0, 0)).to.eq(null);
    });
  });
});
