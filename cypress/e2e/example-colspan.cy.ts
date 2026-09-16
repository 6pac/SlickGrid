describe('Example - Column Span & Header Grouping', { retries: 1 }, () => {
  const fullTitles = ['Title', 'Duration', 'Start', 'Finish', '% Complete', 'Effort Driven'];
  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-colspan.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('column span');
  });

  it('should have exact column titles', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should expect 1st row to be 1 column spanned to the entire width', () => {
    cy.get('[data-row=0] > .slick-cell:nth(0)').should('contain', 'Task 0');
    cy.get('[data-row=0] > .slick-cell.l0.r5').should('exist');
    cy.get('[data-row=0] > .slick-cell:nth(1)').should('not.exist');
  });

  it('should expect 2nd row to be 4 columns and not be spanned', () => {
    cy.get('[data-row=1] > .slick-cell:nth(0)').should('contain', 'Task 1');
    cy.get('[data-row=1] > .slick-cell.l0.r0').should('exist');
    cy.get('[data-row=1] > .slick-cell:nth(1)').should('contain', '5 days');
    cy.get('[data-row=1] > .slick-cell:nth(1).l1.r3').should('exist');
    cy.get('[data-row=1] > .slick-cell:nth(2)').contains(/\d+$/);
    cy.get('[data-row=1] > .slick-cell:nth(3)').contains(/(true|false)/);
  });

  it('should expect 3rd row to be 1 column spanned to the entire width', () => {
    cy.get('[data-row=2] > .slick-cell:nth(0)').should('contain', 'Task 2');
    cy.get('[data-row=2] > .slick-cell.l0.r5').should('exist');
    cy.get('[data-row=2] > .slick-cell:nth(1)').should('not.exist');
  });

  it('should expect 4th row to contain the Duration colspan followed by the analysis columns', () => {
    cy.get('[data-row=3] > .slick-cell:nth(0)').should('contain', 'Task 3');
    cy.get('[data-row=3] > .slick-cell:nth(1)').should('contain', '5 days');
    cy.get('[data-row=3] > .slick-cell:nth(2)').contains(/\d+$/);
    cy.get('[data-row=3] > .slick-cell:nth(3)').contains(/(true|false)/);
  });

  it('should hide Finish while keeping it in getColumns and preserve the original colspan indexes', () => {
    cy.get('[data-test="hide-finish-column"]').click();
    cy.get('#myGrid .slick-header-column').should('have.length', 5);
    cy.get('[data-row=1] > .slick-cell.l1.r3').should('contain', '5 days');
    cy.get('[data-row=1] > .slick-cell.l4.r4').contains(/\d+$/);
    cy.get('[data-row=1] > .slick-cell.l5.r5').contains(/(true|false)/);
    cy.get('[data-test="hide-finish-column"]').click();
  });

  it('should spread Duration colspan across hidden columns when enabled', () => {
    cy.get('[data-test="hide-finish-column"]').click();
    cy.get('[data-test="spread-colspan-button"]').click();
    cy.get('[data-row=1] > .slick-cell.l1.r4').should('contain', '5 days');
    cy.get('[data-test="spread-colspan-button"]').click();
    cy.get('[data-test="hide-finish-column"]').click();
  });

  describe('Basic Key Navigations', () => {
    it('should start at Task 1 on Duration colspan 5 days and type "PageDown" key once and be on Task 20 with full colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}');
      cy.get('[data-row=20] > .slick-cell.l0.r5.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "PageDown" key 2x times and be on Task 39 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}');
      cy.get('[data-row=39] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 39 on Duration colspan 5 days and type "PageUp" key 2x times and be on Task 1 with full colspan', () => {
      cy.get('[data-row=39] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}{pageup}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 2 on Duration colspan 5 days and type "PageDown" key 2x times and "PageUp" twice and be back to Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pageup}{pageup}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 2 on Duration colspan 5 days and type "PageDown" key 2x times and "PageUp" 3x times and be on Task 0 with full colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pageup}{pageup}{pageup}');
      cy.get('[data-row=0] > .slick-cell.l0.r5.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key once and be on Task 2 with full colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}');
      cy.get('[data-row=2] > .slick-cell.l0.r5.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key 2x times and be on Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}{downarrow}');
      cy.get('[data-row=3] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key 2x times, then "ArrowUp" key 2x times and be back on Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}{downarrow}{uparrow}{uparrow}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });
  });
});
