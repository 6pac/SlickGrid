/**
 * Regression test for horizontal cell virtualization of wide right-to-left grids.
 *
 * A right-to-left grid lays its columns out from the right edge and keeps the browser's native,
 * negative scrollLeft. The visible column range must be measured from that edge by the distance
 * scrolled; otherwise a grid whose canvas is wider than about three viewports renders the far
 * end of the canvas and leaves the columns in view blank, even before it is scrolled.
 */

const COLS = 30;
const ROWS = 200;
const ROW = 1;

const harnessHtml = `<!doctype html>
<html lang="en" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>Harness: wide right-to-left grid</title>
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
  for (var c = 0; c < ${COLS}; c++) {
    columns.push({ id: 'c' + c, name: 'C' + c, field: 'c' + c, width: 100 });
  }
  var data = [];
  for (var i = 0; i < ${ROWS}; i++) {
    var item = { id: i };
    for (var k = 0; k < ${COLS}; k++) { item['c' + k] = i + ':' + k; }
    data.push(item);
  }
  window.createGrid = function createGrid(extraOptions) {
    window.grid = new Slick.Grid('#myGrid', data, columns, Object.assign({
      enableCellNavigation: true,
      enableColumnReorder: false,
      rowHeight: 25,
      rtl: true
    }, extraOptions));
  };
</script>
</body>
</html>`;

describe('Quirk - wide right-to-left grids render the columns in view', { retries: 1 }, () => {
  const grid = '#myGrid';

  const scenarios: Array<[string, Record<string, unknown>]> = [
    ['without pinning', {}],
    ['with a pinned column', { pinning: { columns: { left: 1 } } }],
  ];

  /** The element that owns the horizontal scroll: the docking scrollbar when there is one. */
  const scroller = (win: any): HTMLElement =>
    win.document.querySelector(`${grid} .slick-docking-horizontal-scroller`) || win.document.querySelector(`${grid} .slick-viewport`);

  const expectColumnsInViewRendered = (label: string) =>
    cy.window().should((win: any) => {
      const doc = win.document;
      const viewport = doc.querySelector(`${grid} .slick-viewport`).getBoundingClientRect();
      const blank: string[] = [];
      const misplaced: string[] = [];
      let inView = 0;

      Array.from(doc.querySelectorAll(`${grid} .slick-header-column`)).forEach((node) => {
        const header = node as HTMLElement;
        const headerRect = header.getBoundingClientRect();
        if (headerRect.right <= viewport.left + 1 || headerRect.left >= viewport.right - 1) {
          return; // scrolled out of view
        }
        inView++;
        const id = header.getAttribute('data-id') as string;
        const cell = win.grid.getCellNode(ROW, win.grid.getColumnIndex(id));
        if (!cell) {
          blank.push(id);
          return;
        }
        const cellRect = cell.getBoundingClientRect();
        if (Math.abs(cellRect.left - headerRect.left) > 2 || Math.abs(cellRect.right - headerRect.right) > 2) {
          misplaced.push(id);
        }
      });

      expect(inView, `${label}: several columns are in view`).to.be.greaterThan(3);
      expect(blank, `${label}: columns in view without a rendered cell`).to.deep.eq([]);
      expect(misplaced, `${label}: cells not lined up with their header`).to.deep.eq([]);
    });

  /** Scrolls a fraction of the way across; a right-to-left browser reports the position as a negative offset. */
  const scrollAcross = (fraction: number) => {
    cy.window().then((win: any) => {
      const element = scroller(win);
      const max = element.scrollWidth - element.clientWidth;
      element.scrollLeft = -Math.round(max * fraction);
    });
    cy.window().should((win: any) => {
      const element = scroller(win);
      const expected = Math.round((element.scrollWidth - element.clientWidth) * fraction);
      expect(Math.abs(element.scrollLeft), 'the scrollbar moved').to.be.closeTo(expected, 1);
      expect(Math.abs(win.grid.scrollLeft), 'the grid follows the scrollbar').to.be.closeTo(expected, 1);
    });
  };

  scenarios.forEach(([name, options]) => {
    it(`renders a cell for every column in view at the start, middle and end of the scroll ${name}`, () => {
      cy.intercept('GET', '/quirk-rtl-wide-grid-harness.html', {
        headers: { 'content-type': 'text/html' },
        body: harnessHtml,
      });
      cy.visit(`${Cypress.config('baseUrl')}/quirk-rtl-wide-grid-harness.html`);
      cy.window().its('createGrid').should('exist');
      cy.window().then((win: any) => win.createGrid(options));
      cy.get(`${grid} .slick-header-column`).should('have.length', COLS);

      // The bug only shows once the canvas is wider than about three viewports.
      cy.window().should((win: any) => {
        const viewport = win.document.querySelector(`${grid} .slick-viewport`);
        expect(win.grid.getCanvasWidth(), 'the canvas is much wider than the viewport').to.be.greaterThan(3 * viewport.clientWidth);
      });

      expectColumnsInViewRendered('at the start');

      scrollAcross(0.5);
      expectColumnsInViewRendered('in the middle');

      scrollAcross(1);
      expectColumnsInViewRendered('at the end');
    });
  });
});
