describe('Example - Pinning Rows', { retries: 1 }, () => {
  const grid = '#myGrid';
  const fullTitles = ['#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven', 'Title1', 'Title2', 'Title3', 'Title4'];

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-rows.html`);
  });

  function assertPinnedRows(topRows: number[], bottomRows: number[]): void {
    const expectedRows = [...topRows, ...bottomRows];
    cy.get(`${grid} .slick-docking-overlay > .slick-row`).then(($rows) => {
      expect(
        Array.from($rows).map((row) => Number(row.getAttribute('data-row'))),
        'docked row indexes'
      ).to.deep.equal(expectedRows);
    });

    expectedRows.forEach((row) => {
      cy.get(`${grid} .grid-canvas > .slick-row[data-row="${row}"]`).should('not.exist');
    });
  }

  function assertRowValues(row: number, title: string, numberValue: string): void {
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-scrolling-cells .slick-cell`)
      .should('have.length', fullTitles.length)
      .eq(0)
      .should('contain', numberValue)
      .parent()
      .should('contain', title);
  }

  it('renders the expected headers in one docking viewport', () => {
    cy.get(`${grid} > .slick-pane`).should('have.length', 0);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-overlay`).should('have.length', 1);

    cy.get(`${grid} .slick-header-column .slick-column-name`).then(($headers) => {
      expect(Array.from($headers).map((header) => header.textContent?.trim())).to.deep.equal(fullTitles);
    });
  });

  it('places the configured top and bottom rows in the docking overlay', () => {
    assertPinnedRows([0, 1], [49999]);
    assertRowValues(0, 'Task 0', '0');
    assertRowValues(49999, 'Task 49999', '49999');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="2"]`).should('have.length', 1);
  });

  it('updates both pinned-row bands when the counts are changed', () => {
    cy.get('#pinnedTopRows').clear().type('7');
    cy.get('#pinnedBottomRows').clear().type('2');
    cy.get('#setRowPinning').click();

    assertPinnedRows([0, 1, 2, 3, 4, 5, 6], [49998, 49999]);
    assertRowValues(6, 'Task 6', '6');
    assertRowValues(49998, 'Task 49998', '49998');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="7"]`).should('have.length', 1);
  });

  it('supports removing bottom pinning without creating an add-row placeholder', () => {
    cy.get('#pinnedBottomRows').clear().type('0');
    cy.get('#setRowPinning').click();

    assertPinnedRows([0, 1], []);
    cy.get(`${grid} .slick-vertical-scroller`).scrollTo('bottom');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="49999"]`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="50000"]`).should('not.exist');
  });

  it('keeps the pinned rows selected together with the first ten data rows', () => {
    cy.get('#btnSelectRows').click();
    cy.get(`${grid} .slick-cell.selected`).should('have.length', 10 * fullTitles.length);
    assertPinnedRows([0, 1], [49999]);
  });

  it('uses one vertical scroller while preserving the bottom pinned row', () => {
    cy.get(`${grid} .slick-vertical-scroller`).scrollTo('bottom');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="49998"]`).should('have.length', 1);
    assertPinnedRows([0, 1], [49999]);
  });
});
