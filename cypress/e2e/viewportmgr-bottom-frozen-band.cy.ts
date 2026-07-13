/**
 * DOM-shape characterization for the bottom-frozen row band (Phase 4, M14b of the
 * ViewportMgr refactor). With frozenRow AND frozenBottomRow both set, a third row of
 * panes materializes with `*-bottom-frozen` css classes — one per active column band.
 * At this stage only the DOM exists: geometry (M14c) and routing (M14d) have not
 * landed, so the classic top-frozen layout still renders all rows and these tests pin
 * exactly that staged state.
 *
 * Named to sort after the example-* specs (shared browser session).
 */

describe('bottom-frozen band DOM - frozenRow + frozenBottomRow at init (example-frozen-top-bottom-rows)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-top-bottom-rows.html`);
  });

  it('should build 8 panes: the classic six plus two bottom-frozen panes after them', () => {
    cy.get('#myGrid > .slick-pane').should('have.length', 8).then(($panes) => {
      expect($panes.eq(6)).to.have.class('slick-pane-bottom-frozen');
      expect($panes.eq(6)).to.have.class('slick-pane-left');
      expect($panes.eq(7)).to.have.class('slick-pane-bottom-frozen');
      expect($panes.eq(7)).to.have.class('slick-pane-right');
    });
    cy.get('#myGrid .slick-pane-right-frozen').should('have.length', 0);
  });

  it('should build the bottom-frozen viewports and canvases, correctly nested', () => {
    cy.get('#myGrid .slick-viewport').should('have.length', 6);
    cy.get('#myGrid .grid-canvas').should('have.length', 6);
    cy.get('#myGrid .slick-pane-bottom-frozen.slick-pane-left > .slick-viewport.slick-viewport-bottom-frozen.slick-viewport-left').should('have.length', 1);
    cy.get('#myGrid .slick-viewport-bottom-frozen.slick-viewport-left > .grid-canvas.grid-canvas-bottom-frozen.grid-canvas-left').should('have.length', 1);
  });

  it('should size and pin the band below the shrunk body pane (M14c geometry)', () => {
    // example options: frozenRow: 3, frozenBottomRow: 2, default rowHeight 25
    cy.get('#myGrid .slick-pane-bottom-frozen.slick-pane-left').then(($bf) => {
      const bf = $bf[0] as HTMLElement;
      expect(bf.offsetHeight, 'band height = frozenBottomRow * rowHeight').to.equal(2 * 25);

      cy.get('#myGrid .slick-pane-bottom.slick-pane-left').then(($body) => {
        const body = $body[0] as HTMLElement;
        expect(bf.offsetTop, 'band sits directly below the body pane')
          .to.be.closeTo(body.offsetTop + body.offsetHeight, 2);
      });
    });

    cy.get('#myGrid .slick-viewport-bottom-frozen.slick-viewport-left').then(($vp) => {
      expect(($vp[0] as HTMLElement).offsetHeight).to.equal(2 * 25);
    });
  });

  it('should keep classic top-frozen rendering at this stage (geometry and routing land later)', () => {
    // classic top-frozen layout: 3 frozen rows in the top-left canvas, body in bottom-left
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length', 3);
    cy.get('#myGrid .grid-canvas-bottom.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .grid-canvas-bottom-frozen .slick-row').should('have.length', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-cell').first().should('contain', 'Task 0');
  });
});

describe('bottom-frozen band DOM - runtime materialization on a classic grid', () => {
  it('should materialize the band when both freeze options are set at runtime', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
    cy.get('#myGrid > .slick-pane').should('have.length', 6);

    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenRow: 2, frozenBottomRow: 2 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 8);
    cy.get('#myGrid .slick-viewport').should('have.length', 6);
    cy.get('#myGrid .grid-canvas').should('have.length', 6);
  });

  it('should keep the band in the DOM but hidden when simultaneous mode is turned off', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenBottomRow: 0 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 8);
    cy.get('#myGrid .slick-pane-bottom-frozen.slick-pane-left').should('not.be.visible');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
  });
});
