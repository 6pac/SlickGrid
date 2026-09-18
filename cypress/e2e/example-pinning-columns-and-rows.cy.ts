describe('Example - Pinned Columns & Rows', { retries: 1 }, () => {
  const grid = '#myGrid';

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-rows.html`);
  });

  function assertHeaderBand(side: 'left' | 'center' | 'right', ids: string[]): void {
    cy.get(`${grid} .slick-header-column`).then(($headers) => {
      expect(
        Array.from($headers)
          .filter((header) => {
            const isLeft =
              header.classList.contains('slick-column-pinned-left') || !!header.closest('.slick-header-columns-left');
            const isRight =
              header.classList.contains('slick-column-pinned-right') || !!header.closest('.slick-header-columns-right');
            return side === 'left' ? isLeft : side === 'right' ? isRight : !isLeft && !isRight;
          })
          .map((header) => header.getAttribute('data-id')),
        `${side} header ids`
      ).to.deep.equal(ids);
    });
  }

  function assertPinnedRow(row: number, expected = { left: 3, center: 7, right: 1 }): void {
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"]`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas .slick-row[data-row="${row}"]`).should('not.exist');
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-pinned-left-cells .slick-cell`).should('have.length', expected.left);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-scrolling-cells .slick-cell`).should('have.length', expected.center);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-pinned-right-cells .slick-cell`).should('have.length', expected.right);
  }

  it('renders one viewport with all four pinning sides', () => {
    cy.get(`${grid} > .slick-pane`).should('have.length', 0);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-horizontal-scroller`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-overlay`).should('have.length', 1);

    assertHeaderBand('left', ['sel', 'title', 'duration']);
    assertHeaderBand('center', ['%', 'start', 'finish', 'effort-driven', 'title1', 'title2', 'title3']);
    assertHeaderBand('right', ['title4']);
  });

  it('routes top and bottom pinned rows to the docking overlay', () => {
    [0, 1, 49999].forEach((row) => assertPinnedRow(row));
    cy.get(`${grid} .grid-canvas .slick-row[data-row="2"]`).should('have.length', 1);

    assertPinnedRow(0);
  });

  it('keeps all four pinning sides after horizontal scrolling', () => {
    cy.get(`${grid} .slick-docking-horizontal-scroller`).scrollTo(300, 0, { ensureScrollable: false });

    assertHeaderBand('left', ['sel', 'title', 'duration']);
    assertHeaderBand('right', ['title4']);
    assertPinnedRow(0);
    assertPinnedRow(49999);
  });

  it('updates top, bottom, left, and right pinning together', () => {
    cy.get('#pinnedTopRows').clear().type('1');
    cy.get('#pinnedBottomRows').clear().type('2');
    cy.get('#pinnedLeftColumns').clear().type('1');
    cy.get('#pinnedRightColumns').clear().type('2');
    cy.get('#setPinning').click();

    assertHeaderBand('left', ['sel', 'title']);
    assertHeaderBand('center', ['duration', '%', 'start', 'finish', 'effort-driven', 'title1', 'title2']);
    assertHeaderBand('right', ['title3', 'title4']);
    assertPinnedRow(0, { left: 2, center: 7, right: 2 });
    assertPinnedRow(49998, { left: 2, center: 7, right: 2 });
    assertPinnedRow(49999, { left: 2, center: 7, right: 2 });
    cy.get(`${grid} .grid-canvas .slick-row[data-row="1"]`).should('have.length', 1);
  });

  it('selects the first ten rows across all docking regions', () => {
    cy.get('#btnSelectRows').click();
    cy.get(`${grid} .slick-cell.selected`).should('have.length', 10 * 11);
  });

  it('uses the single vertical scroller while preserving the bottom pinned row', () => {
    cy.get(`${grid} .slick-vertical-scroller`).scrollTo('bottom');
    cy.get(`${grid} .grid-canvas .slick-row[data-row="49998"]`).should('have.length', 1);
    assertPinnedRow(49999);
    cy.get(`${grid} .slick-docking-horizontal-scroller`).should('have.length', 1);
  });
});
