describe('Example - Draggable Grouping', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = ['#', 'Title', 'Duration', 'Start', 'Finish', 'Cost', 'Effort-Driven'];
  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-draggable-grouping.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('Draggable Grouping feature');
  });

  it('should have exact column titles on both grids', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));

    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should have 6x draggable icons', () => {
    cy.get('.slick-column-groupable')
      .should('have.length', 6);

    cy.get('.slick-column-groupable.sgi-drag-vertical')
      .should('have.length', 6);
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

    it('should show 1 column title (Duration) shown in the pre-header section', () => {
      cy.get('.slick-dropped-grouping:nth(0) div').contains('Duration');
    });

    it('should "Group by Duration then Effort-Driven" and expect 1st row to be expanded, 2nd row to be expanded and 3rd row to be a regular row', () => {
      cy.get('[data-test="group-duration-effort-btn"]').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).should('contain', 'Task');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(2)`).should('contain', '0');
    });

    it('should show 2 column titles (Duration, Effort-Driven) shown in the pre-header section', () => {
      cy.get('.slick-dropped-grouping:nth(0) div').contains('Duration');
      cy.get('.slick-dropped-grouping:nth(1) div').contains('Effort-Driven');
    });

    it('should be able to drag and swap pre-header grouped column titles (Effort-Driven, Duration)', () => {
      cy.get('.slick-dropped-grouping:nth(0) div')
        .contains('Duration')
        .drag('.slick-dropped-grouping:nth(1) div');

      cy.get('.slick-dropped-grouping:nth(0) div').contains('Effort-Driven');
      cy.get('.slick-dropped-grouping:nth(1) div').contains('Duration');
    });

    it('should expect the grouping to be swapped as well in the grid', () => {
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"].slick-group-level-0 > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  False');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"].slick-group-level-1 .slick-group-title`).should('contain', 'Duration:  0');

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).should('contain', 'Task');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(2)`).should('contain', '0');
    });

    it('should use the preheader Toggle All button and expect all groups to now be collapsed', () => {
      cy.get('.slick-preheader-panel .slick-group-toggle-all').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  False');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  True');
    });

    it('should expand all rows with "Expand All" and expect all the Groups to be expanded and the Toogle All icon to be collapsed', () => {
      cy.get('#myGrid')
        .find('.slick-row .slick-cell:nth(1)')
        .rightclick({ force: true });

      cy.get('[data-test="expand-all-btn"]')
        .click();

      cy.get('#myGrid')
        .find('.slick-group-toggle.collapsed')
        .should('have.length', 0);

      cy.get('#myGrid')
        .find('.slick-group-toggle.expanded')
        .should(($rows) => expect($rows).to.have.length.greaterThan(0));

      cy.get('.slick-group-toggle-all.expanded')
        .should('exist');
    });

    it('should collapse all rows with "Collapse All" and expect all the Groups to be collapsed and the Toogle All icon to be collapsed', () => {
      cy.get('#myGrid')
        .find('.slick-row .slick-cell:nth(1)')
        .rightclick({ force: true });

      cy.get('[data-test="collapse-all-btn"]')
        .click();

      cy.get('#myGrid')
        .find('.slick-group-toggle.expanded')
        .should('have.length', 0);

      cy.get('#myGrid')
        .find('.slick-group-toggle.collapsed')
        .should(($rows) => expect($rows).to.have.length.greaterThan(0));

      cy.get('.slick-group-toggle-all.collapsed')
        .should('exist');
    });

    it('should use the preheader Toggle All button and expect all groups to now be expanded', () => {
      cy.get('.slick-preheader-panel .slick-group-toggle-all').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.expanded`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  False');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:  0');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.expanded`)
        .should('have.css', 'marginLeft').and('eq', `0px`);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) .slick-group-toggle.expanded`)
        .should('have.css', 'marginLeft').and('eq', `15px`);
    });

    it('should use the preheader Toggle All button again and expect all groups to now be collapsed', () => {
      cy.get('.slick-preheader-panel .slick-group-toggle-all').click();

      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  False');
      cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Effort-Driven:  True');
    });

    it('should clear all groups with "Clear all Grouping" and expect all the Groups to be collapsed and the Toogle All icon to be collapsed', () => {
      cy.get('#myGrid')
        .find('.slick-row .slick-cell:nth(1)')
        .rightclick({ force: true });

      cy.get('[data-test="clear-grouping-btn"]')
        .click();

      cy.get('#myGrid')
        .find('.slick-group-toggle-all')
        .should('be.hidden');

      cy.get('#myGrid')
        .find('.slick-placeholder')
        .should('be.visible')
        .should('have.text', 'Drop a column header here to group by the column :)');
    });

    it('should add 500 items and expect 500 of 500 items displayed', () => {
      cy.get('[data-test="add-500-rows-btn"]')
        .click();

      cy.get('.slick-pager-status')
        .contains('Showing all 500 rows');
    });
  });

  describe('Pagination', () => {
    it('should be able to destroy pager (pagination)', () => {
      cy.get('.slick-pager')
        .should('exist');

      cy.get('[data-test="destroy-pager"]')
        .click();

      cy.get('.slick-pager')
        .should('not.exist');
    });
  });
});
