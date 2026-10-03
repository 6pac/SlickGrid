describe('Example - Grouping & Aggregators (ESM)', { retries: 1 }, () => {
  const GRID_ROW_HEIGHT = 28;
  const fullTitles = ['#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Cost', 'Effort-Driven'];
  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-grouping-esm.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('Grouping & Aggregator features');
  });

  it('should have exact column titles on 1st grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  describe('Column pinning tests', () => {
    const grid = '#myGrid';

    const applyPinning = (leftBoundary: number) => {
      cy.get('#pinnedLeftColumns').clear();
      cy.get('#pinnedLeftColumns').type(String(leftBoundary));
      cy.get('#setPinning').click();
    };

    const assertHeaderBand = (side: 'left' | 'center', titles: string[]) => {
      cy.get(`${grid} .slick-header-column`).then(($headers) => {
        const hasPinnedHeaders = Array.from($headers).some(
          (header) => header.classList.contains('slick-column-pinned-left') || header.classList.contains('slick-column-pinned-right')
        );
        const actual = Array.from($headers)
          .filter((header) => {
            const inLeftBand = !!header.closest('.slick-header-columns-left');
            const inCenterBand = !!header.closest('.slick-header-columns-center');
            const isPinnedLeft = header.classList.contains('slick-column-pinned-left');
            const isPinnedRight = header.classList.contains('slick-column-pinned-right');
            return side === 'left'
              ? hasPinnedHeaders ? isPinnedLeft : inLeftBand && !inCenterBand
              : hasPinnedHeaders ? !isPinnedLeft && !isPinnedRight : inCenterBand;
          })
          .map((header) => header.querySelector('.slick-column-name')?.textContent?.trim() || '');
        expect(actual, `${side} header titles`).to.deep.equal(titles);
      });
    };

    beforeEach(() => {
      cy.visit(`${Cypress.config('baseUrl')}/examples/example-grouping-esm.html`);
    });

    afterEach(() => {
      cy.get('[data-test="remove-pinned-btn"]').click();
      cy.reload();
    });

    it('should pin the first three columns from the inclusive left boundary input', () => {
      applyPinning(2);

      assertHeaderBand('left', ['#', 'Title', 'Duration']);
      assertHeaderBand('center', ['% Complete', 'Start', 'Finish', 'Cost', 'Effort-Driven']);
      cy.get(`${grid} .slick-docking-horizontal-scroller`).should('have.length', 1);

      // Row 0 is the full-width Duration group header; row 1 is the first data row.
      cy.get('[data-row=0].slick-row-full-width-group > .slick-cell-full-width-group').should('have.length', 1);
      cy.get('[data-row=1] > .slick-pinned-left-cells > .slick-cell').should('have.length', 3);
      cy.get('[data-row=1] > .slick-scrolling-cells > .slick-cell').should('have.length', 5);
      cy.get('[data-row=1] > .slick-pinned-left-cells > .slick-cell:nth(1)').should('contain', 'Task');
    });

    it('should remove pinning and restore the regular grouped grid layout', () => {
      applyPinning(2);
      cy.get('[data-test="remove-pinned-btn"]').click();

      assertHeaderBand('left', fullTitles.slice(0, 8));
      cy.get(`${grid} .slick-header-columns-center .slick-header-column`).should('not.exist');
      cy.get('[data-row=1] .slick-cell').should('have.length', 8);
      cy.get('[data-row=1] .slick-cell.l1.r1').should('contain', 'Task');
    });

    it('should update the pinned boundary when Apply is used again', () => {
      applyPinning(2);
      applyPinning(0);

      assertHeaderBand('left', ['#']);
      assertHeaderBand('center', ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Cost', 'Effort-Driven']);
      cy.get('[data-row=1] > .slick-pinned-left-cells > .slick-cell').should('have.length', 1);
      cy.get('[data-row=1] > .slick-scrolling-cells > .slick-cell').should('have.length', 7);
    });
  });

  describe('Grouping Tests', () => {
    it('should "Group by Duration & sort groups by value" then Collapse All and expect only group titles', () => {
      cy.get('[data-test="add-50k-rows-btn"]').click();
      cy.get('[data-test="group-duration-sort-value-btn"]').click();
      cy.get('[data-test="collapse-all-btn"]').click();

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  1');
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  2');
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  3');
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 4}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  4');
    });

    it('should click on Expand All columns and expect 1st row as grouping title and 2nd row as a regular row', () => {
      cy.get('[data-test="add-50k-rows-btn"]').click();
      cy.get('[data-test="group-duration-sort-value-btn"]').click();
      cy.get('[data-test="expand-all-btn"]').click();

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"] > .slick-cell:nth(1)`).should('contain', 'Task');
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"] > .slick-cell:nth(2)`).should('contain', '0');
    });

    it('should "Group by Duration then Effort-Driven" and expect 1st row to be expanded, 2nd row to be collapsed and 3rd row to have group totals', () => {
      cy.get('[data-test="group-duration-effort-btn"]').click();

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"].slick-group-level-1 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"].slick-group-level-1 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  True');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"].slick-group-totals.slick-group-level-0 .slick-cell:nth(2)`).should('contain', 'total: 0');
    });

    it('should "Group by Duration then Effort-Driven then Percent" and expect fist 2 rows to be expanded, 3rd row to be collapsed then 4th row to have group total', () => {
      cy.get('[data-test="group-duration-effort-percent-btn"]').click();

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"].slick-group-level-1 .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"].slick-group-level-2 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"].slick-group-level-2 .slick-group-title`).contains(/^% Complete: [0-9]/);

      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"].slick-group-totals.slick-group-level-2 .slick-cell:nth(3)`).contains(/^avg: [0-9]%$/);
      cy.get(`[style*="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"].slick-group-totals.slick-group-level-2`)
        .find('.slick-cell:nth(3)').contains('avg: ');
    });
  });
});
