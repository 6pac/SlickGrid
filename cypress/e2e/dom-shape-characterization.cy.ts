/**
 * DOM-shape characterization test (Phase 0 baseline for the ViewportMgr refactor).
 *
 * Captures the EXACT pane/viewport/canvas DOM structure the grid builds today —
 * 6 panes, 4 viewports, 4 canvases, always created regardless of frozen options,
 * with visibility and row routing varying by freeze state — so that the Phase 1
 * refactor (building the same DOM through ViewportMgr) can prove it produces an
 * identical structure.
 *
 * Do NOT loosen these assertions to make a refactor pass; a failure here means the
 * DOM contract changed. Only update them when the contract change is deliberate
 * (e.g. Phase 3 lazy panes behind the opt-in option).
 */

const PANE_CLASSES = [
  ['slick-pane', 'slick-pane-header', 'slick-pane-left'],
  ['slick-pane', 'slick-pane-header', 'slick-pane-right'],
  ['slick-pane', 'slick-pane-top', 'slick-pane-left'],
  ['slick-pane', 'slick-pane-top', 'slick-pane-right'],
  ['slick-pane', 'slick-pane-bottom', 'slick-pane-left'],
  ['slick-pane', 'slick-pane-bottom', 'slick-pane-right'],
];

const SIDES = ['left', 'right'] as const;
const BANDS = ['top', 'bottom'] as const;

/** Asserts the canonical structure every grid builds today, frozen or not. */
function assertCanonicalShape() {
  // 6 panes as direct children of the container, in exact creation order
  cy.get('#myGrid > .slick-pane')
    .should('have.length', 6)
    .then(($panes) => {
      PANE_CLASSES.forEach((classes, i) => {
        classes.forEach((cls) => expect($panes.eq(i), `pane ${i} has .${cls}`).to.have.class(cls));
      });
    });

  // 4 viewports and 4 canvases, each nested in its matching pane/viewport
  cy.get('#myGrid .slick-viewport').should('have.length', 4);
  cy.get('#myGrid .grid-canvas').should('have.length', 4);
  BANDS.forEach((band) => {
    SIDES.forEach((side) => {
      cy.get(`#myGrid .slick-pane-${band}.slick-pane-${side} > .slick-viewport.slick-viewport-${band}.slick-viewport-${side}`)
        .should('have.length', 1);
      cy.get(`#myGrid .slick-viewport-${band}.slick-viewport-${side} > .grid-canvas.grid-canvas-${band}.grid-canvas-${side}`)
        .should('have.length', 1);
    });
  });

  // one header scroller + one header-columns container per side, in the header panes
  cy.get('#myGrid .slick-pane-header.slick-pane-left > .slick-header.slick-header-left').should('have.length', 1);
  cy.get('#myGrid .slick-pane-header.slick-pane-right > .slick-header.slick-header-right').should('have.length', 1);
  cy.get('#myGrid .slick-header-left > .slick-header-columns.slick-header-columns-left').should('have.length', 1);
  cy.get('#myGrid .slick-header-right > .slick-header-columns.slick-header-columns-right').should('have.length', 1);

  // header-row and top-panel scrollers live in the TOP panes, one per side,
  // created before the viewport (child order: headerrow, top-panel, viewport)
  SIDES.forEach((side) => {
    cy.get(`#myGrid .slick-pane-top.slick-pane-${side} > .slick-headerrow`).should('have.length', 1);
    cy.get(`#myGrid .slick-pane-top.slick-pane-${side} > .slick-top-panel-scroller`).should('have.length', 1);
  });
  cy.get('#myGrid .slick-pane-top.slick-pane-left').children().then(($children) => {
    const classNames = $children.toArray().map((el) => el.className);
    const idxHeaderRow = classNames.findIndex((c) => c.includes('slick-headerrow'));
    const idxTopPanel = classNames.findIndex((c) => c.includes('slick-top-panel-scroller'));
    const idxViewport = classNames.findIndex((c) => c.includes('slick-viewport'));
    expect(idxHeaderRow, 'headerrow before top-panel').to.be.lessThan(idxTopPanel);
    expect(idxTopPanel, 'top-panel before viewport').to.be.lessThan(idxViewport);
  });
}

/** Asserts which of the 6 panes are visible for a given freeze state. */
function assertPaneVisibility(visible: { headerR: boolean; topR: boolean; bottomL: boolean; bottomR: boolean; }) {
  cy.get('#myGrid .slick-pane-header.slick-pane-left').should('be.visible');
  cy.get('#myGrid .slick-pane-top.slick-pane-left').should('be.visible');
  cy.get('#myGrid .slick-pane-header.slick-pane-right').should(visible.headerR ? 'be.visible' : 'not.be.visible');
  cy.get('#myGrid .slick-pane-top.slick-pane-right').should(visible.topR ? 'be.visible' : 'not.be.visible');
  cy.get('#myGrid .slick-pane-bottom.slick-pane-left').should(visible.bottomL ? 'be.visible' : 'not.be.visible');
  cy.get('#myGrid .slick-pane-bottom.slick-pane-right').should(visible.bottomR ? 'be.visible' : 'not.be.visible');
}

/** Asserts which canvases receive row elements for a given freeze state. */
function assertRowRouting(populated: { topL: boolean; topR: boolean; bottomL: boolean; bottomR: boolean; }) {
  const expectRows = (band: string, side: string, hasRows: boolean) => {
    cy.get(`#myGrid .grid-canvas-${band}.grid-canvas-${side} .slick-row`)
      .should(hasRows ? 'have.length.greaterThan' : 'have.length', 0);
  };
  expectRows('top', 'left', populated.topL);
  expectRows('top', 'right', populated.topR);
  expectRows('bottom', 'left', populated.bottomL);
  expectRows('bottom', 'right', populated.bottomR);
}

describe('DOM shape characterization - non-frozen grid (example1-simple)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
  });

  it('should build the canonical 6-pane / 4-viewport / 4-canvas structure', () => {
    assertCanonicalShape();
  });

  it('should show only the left header and top-left panes', () => {
    assertPaneVisibility({ headerR: false, topR: false, bottomL: false, bottomR: false });
  });

  it('should render all rows into the top-left canvas only', () => {
    assertRowRouting({ topL: true, topR: false, bottomL: false, bottomR: false });
  });

  it('should stamp band-truth markers: left elements are the live main/body band, right panes unmarked (M18a)', () => {
    cy.get('#myGrid .slick-pane-top.slick-pane-left')
      .should('have.attr', 'data-colband', 'main')
      .and('have.attr', 'data-rowband', 'body');
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left')
      .should('have.attr', 'data-colband', 'main')
      .and('have.attr', 'data-rowband', 'body');
    cy.get('#myGrid .slick-pane-header.slick-pane-left').should('have.attr', 'data-rowband', 'header');
    cy.get('#myGrid .slick-pane-header.slick-pane-right').should('not.have.attr', 'data-colband');
    cy.get('#myGrid .slick-pane-bottom.slick-pane-left').should('not.have.attr', 'data-rowband');
    // the live body canvas is uniquely selectable without mode logic
    cy.get('#myGrid .grid-canvas[data-colband="main"][data-rowband="body"]').should('have.length', 1);
  });
});

describe('DOM shape characterization - frozen columns only (example-frozen-columns)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns.html`);
  });

  it('should build the canonical 6-pane / 4-viewport / 4-canvas structure', () => {
    assertCanonicalShape();
  });

  it('should show header and top panes on both sides, bottom panes hidden', () => {
    assertPaneVisibility({ headerR: true, topR: true, bottomL: false, bottomR: false });
  });

  it('should render rows into the two top canvases only', () => {
    assertRowRouting({ topL: true, topR: true, bottomL: false, bottomR: false });
  });
});

describe('DOM shape characterization - frozen rows only, frozenBottom (example-frozen-rows)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-rows.html`);
  });

  it('should build the canonical 6-pane / 4-viewport / 4-canvas structure', () => {
    assertCanonicalShape();
  });

  it('should show left panes only, including the bottom-left pane', () => {
    assertPaneVisibility({ headerR: false, topR: false, bottomL: true, bottomR: false });
  });

  it('should render rows into the two left canvases only', () => {
    assertRowRouting({ topL: true, topR: false, bottomL: true, bottomR: false });
  });
});

describe('DOM shape characterization - frozen columns and rows (example-frozen-columns-and-rows)', () => {
  it('should load the example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns-and-rows.html`);
  });

  it('should build the canonical 6-pane / 4-viewport / 4-canvas structure', () => {
    assertCanonicalShape();
  });

  it('should show all six panes', () => {
    assertPaneVisibility({ headerR: true, topR: true, bottomL: true, bottomR: true });
  });

  it('should render rows into all four canvases', () => {
    assertRowRouting({ topL: true, topR: true, bottomL: true, bottomR: true });
  });

  it('should stamp band-truth markers per role in the frozen-both configuration (M18a)', () => {
    cy.get('#myGrid .slick-pane-top.slick-pane-left')
      .should('have.attr', 'data-colband', 'left')
      .and('have.attr', 'data-rowband', 'top-frozen');
    cy.get('#myGrid .slick-pane-top.slick-pane-right')
      .should('have.attr', 'data-colband', 'main')
      .and('have.attr', 'data-rowband', 'top-frozen');
    cy.get('#myGrid .slick-pane-bottom.slick-pane-right')
      .should('have.attr', 'data-colband', 'main')
      .and('have.attr', 'data-rowband', 'body');
    // exactly one live main/body canvas, mode-independently
    cy.get('#myGrid .grid-canvas[data-colband="main"][data-rowband="body"]').should('have.length', 1);
  });
});
