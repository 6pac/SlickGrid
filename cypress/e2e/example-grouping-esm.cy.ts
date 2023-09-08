describe('Example - Grouping & Aggregators (ESM)', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
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

  describe('Grouping Tests', () => {
    it('should "Group by Duration & sort groups by value" then Collapse All and expect only group titles', () => {
      cy.get('[data-test="add-50k-rows-btn"]').click();
      cy.get('[data-test="group-duration-sort-value-btn"]').click();
      cy.get('[data-test="collapse-all-btn"]').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  1');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  2');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  3');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  4');
    });

    it('should click on Expand All columns and expect 1st row as grouping title and 2nd row as a regular row', () => {
      cy.get('[data-test="add-50k-rows-btn"]').click();
      cy.get('[data-test="group-duration-sort-value-btn"]').click();
      cy.get('[data-test="expand-all-btn"]').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(1)`).should('contain', 'Task');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(2)`).should('contain', '0');
    });

    it('should "Group by Duration then Effort-Driven" and expect 1st row to be expanded, 2nd row to be collapsed and 3rd row to have group totals', () => {
      cy.get('[data-test="group-duration-effort-btn"]').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"].slick-group-level-1 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  True');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"].slick-group-totals.slick-group-level-0 .slick-cell:nth(2)`).should('contain', 'total: 0');
    });

    it('should "Group by Duration then Effort-Driven then Percent" and expect fist 2 rows to be expanded, 3rd row to be collapsed then 4th row to have group total', () => {
      cy.get('[data-test="group-duration-effort-percent-btn"]').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"].slick-group-level-2 .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"].slick-group-level-2 .slick-group-title`).contains(/^% Complete: [0-9]/);

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"].slick-group-totals.slick-group-level-2 .slick-cell:nth(3)`).contains(/^avg: [0-9]\%$/);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"].slick-group-totals.slick-group-level-2`)
        .find('.slick-cell:nth(3)').contains('avg: ');
    });
  });
});
