describe('Example - Row Detail/Row Move/Checkbox Selector Plugins', () => {
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = ['', '#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  it('should display Example Row Detail/Row Move/Checkbox Selector Plugins', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example16-row-detail.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.get('li').should('contain', 'RowDetailView Plugin');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should open the 1st Row Detail of the 2nd row and expect to find some details', () => {
    cy.get('.slick-cell.detailView-toggle:nth(1)')
      .click()
      .wait(50);

    cy.get('.slick-cell + .dynamic-cell-detail .detailViewContainer_1')
      .find('h4')
      .should('contain', 'Task 1');

    cy.get('input[id="assignee_1"]')
      .should('exist');

    cy.get('input[type="checkbox"]:checked')
      .should('have.length', 0);
  });

  it('should open the 2nd Row Detail of the 4th row and expect to find some details', () => {
    cy.get(`.slick-row[style="top: ${GRID_ROW_HEIGHT * 10}px;"] .slick-cell:nth(1)`)
      .click()
      .wait(50);

    cy.get('.slick-cell + .dynamic-cell-detail .detailViewContainer_3')
      .find('h4')
      .should('contain', 'Task 3');

    cy.get('input[id="assignee_3"]')
      .should('exist');

    cy.get('input[type="checkbox"]:checked')
      .should('have.length', 0);
  });

  it('should be able to collapse all row details', () => {
    cy.get('.dynamic-cell-detail').should('have.length', 2);
    cy.get('[data-test="collapse-all-btn"]').click();
    cy.get('.dynamic-cell-detail').should('have.length', 0);
  });

  it('should open the Task 3 Row Detail and still expect same detail', () => {
    cy.get(`.slick-row[style="top: ${GRID_ROW_HEIGHT * 3}px;"] .slick-cell:nth(1)`)
      .click()
      .wait(50);

    cy.get('.dynamic-cell-detail').should('have.length', 1);

    cy.get('.slick-cell + .dynamic-cell-detail .innerDetailView_3')
      .find('h4')
      .should('contain', 'Task 3');

    cy.get('input[id="assignee_3"]')
      .should('exist');
  });

  it('should click on "click me" and expect an Alert to show the Help text', () => {
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Assignee is');
    });

    cy.contains('Click Me')
      .click();
  });
});
