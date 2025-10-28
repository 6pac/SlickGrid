describe('Example - Context Menu Plugin & Hybrid Selection Mode', () => {
  const titles = ['#', 'Title', '% Complete', 'Start', 'Finish', 'Priority', 'Effort Driven'];

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-plugin-hybridselectionmodel.html`);
    cy.get('h2').should('contain', 'Example - Context Menu Plugin & Hybrid Selection Mode');
  });

  it('should have exact column titles in first grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => {
        if (index > 0 && index < titles.length) {
          expect($child.text()).to.eq(titles[index]);
        }
      });
  });

  it('should click on Task 1 and be able to drag from bottom right corner to expand the cell selections to include 4 cells', () => {
    cy.get('#myGrid .slick-row[data-row="1"] .slick-cell.l1.r1').as('task1');
    cy.get('@task1').should('contain', 'Task 1');
    cy.get('@task1').click().should('have.class', 'selected');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 1);

    cy.get('@task1').find('.slick-drag-replace-handle').trigger('mousedown', { which: 1, force: true });

    cy.get('#myGrid .slick-row[data-row="2"] .slick-cell.l2.r2')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    cy.get('#myGrid .slick-cell.selected').should('have.length', 4);
  });

  it('should be able to expand the cell selections further to the right', () => {
    cy.get('#myGrid .slick-cell.selected').should('have.length', 4);
    cy.get('#myGrid .slick-row[data-row="2"] .slick-cell.l2.r2')
      .find('.slick-drag-replace-handle')
      .trigger('mousedown', { which: 1, force: true });

    cy.get('#myGrid .slick-row[data-row="2"] .slick-cell.l3.r3')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    cy.get('#myGrid .slick-cell.selected').should('have.length', 6);
  });

  it('should be able to expand the cell selections further to the bottom', () => {
    cy.get('#myGrid .slick-cell.selected').should('have.length', 6);
    cy.get('#myGrid .slick-row[data-row="2"] .slick-cell.l3.r3')
      .find('.slick-drag-replace-handle')
      .trigger('mousedown', { which: 1, force: true });

    cy.get('#myGrid .slick-row[data-row="3"] .slick-cell.l3.r3')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    cy.get('#myGrid .slick-cell.selected').should('have.length', 9);
  });

  it('should click on 1st column and then row 2 and 3, then expect the full (single) row to be selected', () => {
    cy.get('#myGrid .slick-row[data-row="1"] .slick-cell.l0.r0').as('task1');
    cy.get('@task1').should('contain', '1');
    cy.get('@task1').click().should('have.class', 'selected');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 7);

    // select another row
    cy.get('#myGrid .slick-row[data-row="2"] .slick-cell.l0.r0').as('task2');
    cy.get('@task2').should('contain', '2');
    cy.get('@task2').click().should('have.class', 'selected');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 7);
  });

  it('should be able to select 3 rows (from Task 4 to 6) when holding Shift key and clicking on the next 2 rows (again on same column index 0)', () => {
    cy.get('#myGrid .slick-row[data-row="4"] .slick-cell.l0.r0').as('task4');
    cy.get('@task4').should('contain', '4');
    cy.get('@task4').click().should('have.class', 'selected');

    cy.get('#myGrid .slick-row[data-row="6"] .slick-cell.l0.r0').click({ shiftKey: true }).should('have.class', 'selected');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 7 * 3);
  });
});
