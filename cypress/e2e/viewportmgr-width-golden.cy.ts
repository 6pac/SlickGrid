/**
 * Golden characterization of the per-band width arithmetic ahead of M19d (the
 * computeHeaderWidths/computeCanvasWidths relocation — FACADE-FEASIBILITY.md).
 * Assertions transcribe the getHeadersWidth/getCanvasWidth formulas from column
 * data at runtime, pinning the load-bearing quirks:
 * - the +1000 slack on the left/single header band (resize drag headroom)
 * - the RIGHT-FROZEN header band is a PLAIN column sum — no slack, no scrollbar
 * - headersWidthR is CUMULATIVE (includes the post-slack L) under a left freeze
 * - a plain grid still writes the R header container's width (it computes to 0)
 * - canvas widths are plain per-band sums (when fullWidthRows is off)
 *
 * Named to sort after the example-* specs (shared browser session).
 */

const styleWidth = (el: HTMLElement) => parseFloat(el.style.width);
const sumWidths = (cols: any[], from: number, to: number) =>
  cols.slice(from, to).filter((c: any) => c && !c.hidden).reduce((a: number, c: any) => a + (c.width || 0), 0);

describe('width golden values - left freeze + frozen rows (example-frozen-columns-and-rows: frozenColumn 2)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns-and-rows.html`);
  });

  it('should size the left header band to its column sum PLUS the historical 1000px slack', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const headerL = win.document.querySelector('#myGrid .slick-header-columns-left') as HTMLElement;
      expect(styleWidth(headerL), 'headersWidthL = sum(frozen cols) + 1000').to.eq(sumWidths(cols, 0, 3) + 1000);
    });
  });

  it('should size the main header band CUMULATIVELY (it includes the post-slack left width)', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const headerL = win.document.querySelector('#myGrid .slick-header-columns-left') as HTMLElement;
      const headerR = win.document.querySelector('#myGrid .slick-header-columns-right') as HTMLElement;
      // exact value involves max(sumR, viewportW); the cumulative property is the quirk:
      expect(styleWidth(headerR), 'headersWidthR includes headersWidthL').to.be.gte(styleWidth(headerL) + sumWidths(cols, 3, cols.length) - 1);
    });
  });

  it('should size the canvases to plain per-band column sums', () => {
    cy.window().then((win: any) => {
      if (win.grid.getOptions().fullWidthRows) { return; } // extra-width path not exercised here
      const cols = win.grid.getColumns();
      const canvasL = win.document.querySelector('#myGrid .grid-canvas-top.grid-canvas-left') as HTMLElement;
      const canvasR = win.document.querySelector('#myGrid .grid-canvas-top.grid-canvas-right') as HTMLElement;
      expect(styleWidth(canvasL), 'canvasWidthL = sum(frozen cols)').to.eq(sumWidths(cols, 0, 3));
      expect(styleWidth(canvasR), 'canvasWidthR = sum(scrollable cols)').to.eq(sumWidths(cols, 3, cols.length));
    });
  });
});

describe('width golden values - right-frozen band (example-frozen-right-columns: frozenRightColumn 2)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-right-columns.html`);
  });

  it('should size the right-frozen header band to a PLAIN column sum - no slack, no scrollbar', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const rfStart = win.grid.getFrozenRightStartIndex();
      const headerRF = win.document.querySelector('#myGrid .slick-header-columns-right-frozen') as HTMLElement;
      expect(styleWidth(headerRF), 'headersWidthRF = sum(rf cols) exactly').to.eq(sumWidths(cols, rfStart, cols.length));
    });
  });

  it('should size the right-frozen canvas to the same plain sum', () => {
    cy.window().then((win: any) => {
      if (win.grid.getOptions().fullWidthRows) { return; }
      const cols = win.grid.getColumns();
      const rfStart = win.grid.getFrozenRightStartIndex();
      const canvasRF = win.document.querySelector('#myGrid .grid-canvas-right-frozen') as HTMLElement;
      expect(styleWidth(canvasRF), 'canvasWidthRF = sum(rf cols)').to.eq(sumWidths(cols, rfStart, cols.length));
    });
  });

  it('should keep the single scrollable band on the +1000-slack formula', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const rfStart = win.grid.getFrozenRightStartIndex();
      const headerL = win.document.querySelector('#myGrid .slick-header-columns-left') as HTMLElement;
      // no left freeze: L = max(sum + scrollbar, viewportW) + 1000 - assert the floor
      expect(styleWidth(headerL), 'headersWidthL >= sum(main cols) + 1000').to.be.gte(sumWidths(cols, 0, rfStart) + 1000);
    });
  });
});

describe('width golden values - plain grid (example1-simple)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
  });

  it('should still write the RIGHT header container width in a plain grid - it computes to 0 (historical)', () => {
    cy.window().then((win: any) => {
      const headerR = win.document.querySelector('#myGrid .slick-header-columns-right') as HTMLElement;
      expect(headerR, 'hidden R container exists (always-built precedent)').to.exist;
      expect(headerR.style.width, 'width written as 0').to.eq('0px');
    });
  });

  it('should apply the +1000 slack to the single header band', () => {
    cy.window().then((win: any) => {
      const cols = win.grid.getColumns();
      const headerL = win.document.querySelector('#myGrid .slick-header-columns-left') as HTMLElement;
      expect(styleWidth(headerL), 'headersWidthL >= sum(all cols) + 1000').to.be.gte(sumWidths(cols, 0, cols.length) + 1000);
    });
  });
});
