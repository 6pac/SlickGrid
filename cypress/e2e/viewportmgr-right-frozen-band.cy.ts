/**
 * DOM-shape characterization for the right-frozen column band (Phase 4, M13b of the
 * ViewportMgr refactor). At this stage the band's DOM materializes (with NEW
 * `*-right-frozen` css classes; the historical "right" elements keep their names and
 * become the scrollable middle band), but geometry and render routing land in later
 * milestones — so cells still render in the classic canvases, and these tests pin
 * exactly that staged state.
 *
 * Named to sort after the example-* specs (shared browser session; see
 * viewportmgr-lazy-materialization.cy.ts).
 */

describe('right-frozen band DOM - frozenRightColumn at init (example-frozen-right-columns)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-right-columns.html`);
  });

  it('should build 9 panes: the classic six in canonical order plus three right-frozen panes after them', () => {
    cy.get('#myGrid > .slick-pane').should('have.length', 9).then(($panes) => {
      const expected = [
        ['slick-pane-header', 'slick-pane-left'],
        ['slick-pane-header', 'slick-pane-right'],
        ['slick-pane-top', 'slick-pane-left'],
        ['slick-pane-top', 'slick-pane-right'],
        ['slick-pane-bottom', 'slick-pane-left'],
        ['slick-pane-bottom', 'slick-pane-right'],
        ['slick-pane-header', 'slick-pane-right-frozen'],
        ['slick-pane-top', 'slick-pane-right-frozen'],
        ['slick-pane-bottom', 'slick-pane-right-frozen'],
      ];
      expected.forEach((classes, i) => {
        classes.forEach((cls) => expect($panes.eq(i), `pane ${i} has .${cls}`).to.have.class(cls));
      });
    });
  });

  it('should build 6 viewports and 6 canvases with the right-frozen ones correctly nested', () => {
    cy.get('#myGrid .slick-viewport').should('have.length', 6);
    cy.get('#myGrid .grid-canvas').should('have.length', 6);
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen > .slick-viewport.slick-viewport-top.slick-viewport-right-frozen').should('have.length', 1);
    cy.get('#myGrid .slick-viewport-top.slick-viewport-right-frozen > .grid-canvas.grid-canvas-top.grid-canvas-right-frozen').should('have.length', 1);
    cy.get('#myGrid .slick-pane-bottom.slick-pane-right-frozen > .slick-viewport-bottom.slick-viewport-right-frozen > .grid-canvas-bottom.grid-canvas-right-frozen').should('have.length', 1);
  });

  it('should build right-frozen header chrome', () => {
    cy.get('#myGrid .slick-pane-header.slick-pane-right-frozen > .slick-header.slick-header-right-frozen').should('have.length', 1);
    cy.get('#myGrid .slick-header-right-frozen > .slick-header-columns.slick-header-columns-right-frozen').should('have.length', 1);
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen > .slick-headerrow').should('have.length', 1);
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen > .slick-top-panel-scroller').should('have.length', 1);
  });

  it('should stamp right-frozen band markers, with the middle band as main (M18a)', () => {
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen')
      .should('have.attr', 'data-colband', 'right-frozen')
      .and('have.attr', 'data-rowband', 'body');
    cy.get('#myGrid .slick-pane-top.slick-pane-left').should('have.attr', 'data-colband', 'main');
    cy.get('#myGrid .grid-canvas[data-colband="right-frozen"]').should('have.length', 1);
  });

  it('should show the right-frozen header and top panes, and hide its bottom pane (no frozen rows)', () => {
    cy.get('#myGrid .slick-pane-header.slick-pane-right-frozen').should('be.visible');
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen').should('exist');
    cy.get('#myGrid .slick-pane-bottom.slick-pane-right-frozen').should('not.be.visible');
  });

  it('should size the band and pin it to the right edge (M13c geometry)', () => {
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen').then(($pane) => {
      const pane = $pane[0] as HTMLElement;
      const container = pane.parentElement as HTMLElement;
      expect(pane.offsetWidth, 'RF pane has real width').to.be.greaterThan(0);
      expect(pane.offsetLeft + pane.offsetWidth, 'RF pane pinned at the right edge')
        .to.be.closeTo(container.clientWidth, 3);
    });

    // the scrollable middle band shrinks by the RF band width
    cy.get('#myGrid .slick-pane-top.slick-pane-left').then(($mid) => {
      cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen').then(($rf) => {
        const mid = $mid[0] as HTMLElement;
        const rf = $rf[0] as HTMLElement;
        const container = mid.parentElement as HTMLElement;
        expect(mid.offsetWidth + rf.offsetWidth, 'middle + RF widths fill the container')
          .to.be.closeTo(container.clientWidth, 3);
      });
    });

    // RF viewport and canvas carry the band width
    cy.get('#myGrid .slick-viewport-top.slick-viewport-right-frozen').then(($vp) => {
      expect(($vp[0] as HTMLElement).offsetWidth).to.be.greaterThan(0);
    });
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen').then(($c) => {
      expect(($c[0] as HTMLElement).offsetWidth).to.be.greaterThan(0);
    });
  });

  it('should route the last two header columns into the right-frozen header (M13d routing)', () => {
    cy.get('#myGrid .slick-header-columns-left .slick-header-column').should('have.length', 4);
    cy.get('#myGrid .slick-header-columns-right-frozen .slick-header-column').should('have.length', 2);
    cy.get('#myGrid .slick-header-columns-right-frozen .slick-header-column').first().should('contain', 'Finish');
  });

  it('should render row fragments in the right-frozen canvas with band-local cell positions', () => {
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').should('have.length.greaterThan', 0);

    // each RF row fragment carries exactly the two right-frozen cells
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').first().find('.slick-cell')
      .should('have.length', 2);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').first().find('.slick-cell').first()
      .should('contain', '01/05/2009')
      .and('have.class', 'frozen');

    // middle rows carry the remaining four cells, starting with Task 0
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').first().find('.slick-cell')
      .should('have.length', 4);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-cell').first().should('contain', 'Task 0');

    // band-local coordinates: the first RF cell sits at the band origin, not at its
    // global column offset
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').first().find('.slick-cell').first()
      .then(($cell) => {
        expect(($cell[0] as HTMLElement).offsetLeft, 'RF cell rebased to band-local x').to.equal(0);
      });
  });
});

describe('right-frozen band - keyboard navigation across the band boundary (M13e)', () => {
  it('should cross middle→right-frozen and back with arrow keys, without horizontal scrolling', () => {
    // fresh load to reset scroll/active state
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-right-columns.html`);

    // activate the last middle-band cell (Start) on the first row
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').first().find('.slick-cell').last().click();
    cy.get('#myGrid .slick-cell.active').should('have.length', 1);

    // ArrowRight crosses into the first right-frozen column (Finish) — this also
    // exercises the RF canvas's keydown wiring and pane-index cell lookup
    cy.get('#myGrid .slick-cell.active').type('{rightarrow}');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-cell.active')
      .should('have.length', 1)
      .and('contain', '01/05/2009');

    // entering the band must not horizontally scroll the middle viewport
    cy.get('#myGrid .slick-viewport-top.slick-viewport-left').then(($vp) => {
      expect(($vp[0] as HTMLElement).scrollLeft, 'middle band did not scroll').to.equal(0);
    });

    // ArrowLeft returns to the middle band
    cy.get('#myGrid .slick-cell.active').type('{leftarrow}');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-cell.active').should('have.length', 1);
  });
});

describe('right-frozen band DOM - runtime materialization on a classic grid', () => {
  it('should load the plain example and materialize the band via setOptions', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
    cy.get('#myGrid > .slick-pane').should('have.length', 6);

    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenRightColumn: 1 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 9);
    cy.get('#myGrid .slick-viewport').should('have.length', 6);
    cy.get('#myGrid .grid-canvas').should('have.length', 6);
    cy.get('#myGrid .slick-pane-header.slick-pane-right-frozen').should('be.visible');

    // routing follows the runtime toggle: 5 middle headers + 1 right-frozen header
    cy.get('#myGrid .slick-header-columns-left .slick-header-column').should('have.length', 5);
    cy.get('#myGrid .slick-header-columns-right-frozen .slick-header-column').should('have.length', 1);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').should('have.length.greaterThan', 0);
  });

  it('should hide the band again when the right freeze is turned off, restoring classic routing', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({ frozenRightColumn: 0 });
    });

    cy.get('#myGrid > .slick-pane').should('have.length', 9);
    cy.get('#myGrid .slick-pane-header.slick-pane-right-frozen').should('not.be.visible');
    cy.get('#myGrid .slick-pane-top.slick-pane-right-frozen').should('not.be.visible');
    cy.get('#myGrid .slick-header-columns-left .slick-header-column').should('have.length', 6);
    cy.get('#myGrid .slick-header-columns-right-frozen .slick-header-column').should('have.length', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-right-frozen .slick-row').should('have.length', 0);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left .slick-row').should('have.length.greaterThan', 0);
  });
});
