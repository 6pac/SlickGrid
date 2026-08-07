/**
 * Contract test for CellExternalCopyManager's Clipboard-API transport.
 *
 * Copy serializes the selected ranges in memory and writes the tab/CRLF text
 * with navigator.clipboard.writeText; paste reads with navigator.clipboard
 * .readText and decodes the text directly. There is no decoy textarea and no
 * delay option. clipboardWriteOverride / clipboardReadOverride replace the
 * transport (e.g. non-secure contexts); when the Clipboard API is missing and
 * no override is set, the failure surfaces as a console error, never a throw.
 *
 * The spec is SELF-HOSTING (harness served via cy.intercept; no example page)
 * and stubs navigator.clipboard for determinism — the same pattern
 * slickgrid-universal uses in its unit tests. The stub also captures the exact
 * serialized text, which real-clipboard tests cannot assert. The end-to-end
 * path through the REAL clipboard (realPress Ctrl+C / Ctrl+V in Electron) is
 * covered by example-excel-compatible-spreadsheet.cy.ts.
 *
 * Grid A pastes through column editors (editor.applyValue); grid B has no
 * editors, covering the raw field-assignment path plus both override hooks.
 * Each test visits the harness itself so retries always start from a fresh
 * page. ?noclip=1 removes the stub to simulate an unavailable Clipboard API.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: Clipboard API copy manager</title>
  <link rel="stylesheet" href="/dist/styles/css/slick-alpine-theme.css"/>
  <style> #myGrid, #gridOv { width: 700px; height: 300px; } </style>
</head>
<body>
<div id="myGrid"></div>
<div id="gridOv"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script src="/dist/browser/plugins/slick.cellrangedecorator.js"></script>
<script src="/dist/browser/plugins/slick.cellrangeselector.js"></script>
<script src="/dist/browser/plugins/slick.cellselectionmodel.js"></script>
<script src="/dist/browser/plugins/slick.cellexternalcopymanager.js"></script>
<script src="/dist/browser/slick.editors.js"></script>
<script>
  var clipStore = { text: null, writes: 0, reads: 0 };
  window.clipStore = clipStore;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: function (t) { clipStore.text = t; clipStore.writes++; return Promise.resolve(); },
      readText: function () { clipStore.reads++; return Promise.resolve(clipStore.text); }
    }
  });
  if (location.search.indexOf('noclip') >= 0) {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  }

  window.clipErrors = 0;
  var origConsoleError = console.error;
  console.error = function () {
    if (String(arguments[0]).indexOf('Unable to read/write to clipboard') === 0) { window.clipErrors++; }
    return origConsoleError.apply(console, arguments);
  };

  var columns = [
    { id: 'id', name: '#', field: 'id', width: 60 },
    { id: 'a', name: 'A', field: 'a', width: 120, editor: Slick.Editors.Text },
    { id: 'b', name: 'B', field: 'b', width: 120, editor: Slick.Editors.Text },
    { id: 'c', name: 'C', field: 'c', width: 120, editor: Slick.Editors.Text }
  ];
  var data = [];
  for (var i = 0; i < 30; i++) {
    data.push({ id: i, a: 'A' + i, b: 'B' + i, c: 'C' + i });
  }
  var grid = new Slick.Grid('#myGrid', data, columns, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    editable: true,
    autoEdit: false,
    rowHeight: 25
  });
  grid.setSelectionModel(new Slick.CellSelectionModel());
  grid.registerPlugin(new Slick.CellExternalCopyManager({ includeHeaderWhenCopying: false }));
  window.grid = grid;
  window.getData = function () { return data; };
  window.pasteEvents = 0;
  window.copyCancelledEvents = 0;
  grid.getPluginByName('CellExternalCopyManager').onPasteCells.subscribe(function () { window.pasteEvents++; });
  grid.getPluginByName('CellExternalCopyManager').onCopyCancelled.subscribe(function () { window.copyCancelledEvents++; });

  var ovStore = { text: null, writes: 0, reads: 0 };
  window.ovStore = ovStore;
  var columnsOv = [
    { id: 'id', name: '#', field: 'id', width: 60 },
    { id: 'a', name: 'A', field: 'a', width: 120 },
    { id: 'b', name: 'B', field: 'b', width: 120 },
    { id: 'c', name: 'C', field: 'c', width: 120 }
  ];
  var dataOv = [];
  for (var k = 0; k < 10; k++) {
    dataOv.push({ id: k, a: 'OA' + k, b: 'OB' + k, c: 'OC' + k });
  }
  var gridOv = new Slick.Grid('#gridOv', dataOv, columnsOv, {
    enableCellNavigation: true,
    enableColumnReorder: false,
    rowHeight: 25
  });
  gridOv.setSelectionModel(new Slick.CellSelectionModel());
  gridOv.registerPlugin(new Slick.CellExternalCopyManager({
    includeHeaderWhenCopying: false,
    clipboardWriteOverride: function (t) { ovStore.text = t; ovStore.writes++; },
    clipboardReadOverride: function () { ovStore.reads++; return ovStore.text; }
  }));
  window.gridOv = gridOv;
  window.getDataOv = function () { return dataOv; };

  window.selectRange = function (g, r1, c1, r2, c2) {
    g.setActiveCell(r1, c1);
    g.getSelectionModel().setSelectedRanges([new Slick.Range(r1, c1, r2, c2)]);
  };
  window.pressKey = function (g, key, mods) {
    var node = g.getActiveCellNode() || g.getContainerNode();
    node.dispatchEvent(new KeyboardEvent('keydown', {
      key: key, bubbles: true, cancelable: true,
      ctrlKey: !!(mods && mods.ctrlKey), shiftKey: !!(mods && mods.shiftKey)
    }));
  };
</script>
</body>
</html>`;

describe('CellExternalCopyManager - Clipboard API transport', { retries: 1 }, () => {
  const visitHarness = (query = '') => {
    cy.intercept('GET', '/clipboard-api-harness.html*', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/clipboard-api-harness.html${query}`);
    cy.window().its('grid').should('exist');
  };
  const cellSelector = (gridId: string, row: number, cellClass: string) =>
    `#${gridId} .slick-row[data-row="${row}"] .slick-cell.${cellClass}`;

  it('should copy the selected range through navigator.clipboard.writeText and cancel highlight on Escape', () => {
    visitHarness();
    cy.window().then((win: any) => {
      win.selectRange(win.grid, 1, 1, 2, 2);
      win.pressKey(win.grid, 'c', { ctrlKey: true });
    });
    cy.window().its('clipStore.text', { timeout: 4000 })
      .should('eq', 'A1\tB1\r\nA2\tB2\r\n');
    cy.window().its('clipStore.writes').should('eq', 1);
    cy.get('#myGrid .slick-cell.copied').should('have.length', 4);
    cy.window().then((win: any) => {
      expect(win.document.querySelectorAll('textarea').length, 'no decoy textarea in the DOM').to.eq(0);
      win.pressKey(win.grid, 'Escape');
    });
    cy.get('#myGrid .slick-cell.copied').should('have.length', 0);
    cy.window().its('copyCancelledEvents').should('eq', 1);
  });

  it('should paste clipboard text read from navigator.clipboard.readText into the grid', () => {
    visitHarness();
    cy.window().then((win: any) => {
      win.clipStore.text = 'X\tY\r\nZ\tW\r\n';
      win.selectRange(win.grid, 5, 1, 5, 1);
      win.pressKey(win.grid, 'v', { ctrlKey: true });
    });
    cy.get(cellSelector('myGrid', 5, 'l1'), { timeout: 4000 }).should('have.text', 'X');
    cy.get(cellSelector('myGrid', 5, 'l2')).should('have.text', 'Y');
    cy.get(cellSelector('myGrid', 6, 'l1')).should('have.text', 'Z');
    cy.get(cellSelector('myGrid', 6, 'l2')).should('have.text', 'W');
    cy.window().then((win: any) => {
      expect(win.clipStore.reads, 'one readText call').to.eq(1);
      expect(win.getData()[5].a, 'underlying data updated').to.eq('X');
      expect(win.getData()[6].b, 'underlying data updated').to.eq('W');
      expect(win.pasteEvents, 'onPasteCells notified').to.eq(1);
      expect(win.document.querySelectorAll('textarea').length, 'no decoy textarea in the DOM').to.eq(0);
    });
  });

  it('should route copy and paste through the override hooks without touching navigator.clipboard', () => {
    visitHarness();
    cy.window().then((win: any) => {
      win.selectRange(win.gridOv, 0, 1, 0, 2);
      win.pressKey(win.gridOv, 'c', { ctrlKey: true });
    });
    cy.window().its('ovStore.text', { timeout: 4000 }).should('eq', 'OA0\tOB0\r\n');
    cy.window().then((win: any) => {
      win.ovStore.text = 'P\tQ\r\n';
      win.selectRange(win.gridOv, 2, 1, 2, 1);
      win.pressKey(win.gridOv, 'v', { ctrlKey: true });
    });
    cy.get(cellSelector('gridOv', 2, 'l1'), { timeout: 4000 }).should('have.text', 'P');
    cy.get(cellSelector('gridOv', 2, 'l2')).should('have.text', 'Q');
    cy.window().then((win: any) => {
      expect(win.ovStore.writes, 'override write used').to.eq(1);
      expect(win.ovStore.reads, 'override read used').to.eq(1);
      expect(win.getDataOv()[2].a, 'raw field assignment (no editor)').to.eq('P');
      expect(win.clipStore.writes, 'navigator.clipboard.writeText never called').to.eq(0);
      expect(win.clipStore.reads, 'navigator.clipboard.readText never called').to.eq(0);
    });
  });

  it('should surface an unavailable Clipboard API as a console error, not a throw', () => {
    visitHarness('?noclip=1');
    cy.window().then((win: any) => {
      win.selectRange(win.grid, 1, 1, 1, 1);
      win.pressKey(win.grid, 'c', { ctrlKey: true });
    });
    cy.window().its('clipErrors', { timeout: 4000 }).should('eq', 1);
    cy.window().then((win: any) => {
      win.pressKey(win.grid, 'v', { ctrlKey: true });
    });
    cy.window().its('clipErrors', { timeout: 4000 }).should('eq', 2);
    cy.window().then((win: any) => {
      expect(win.grid.getActiveCell(), 'grid still responsive after failures').to.deep.include({ row: 1, cell: 1 });
      expect(win.getData()[1].a, 'no paste happened').to.eq('A1');
    });
  });
});
