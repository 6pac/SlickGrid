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

  it('keeps a row detail open while Space is typed in one of its inputs', () => {
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').click();
    cy.window().then((win) => (win as any).grid.setActiveCell(1, 0));
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').should('have.class', 'active');
    cy.get('.slick-row-detail-container input').first().type(' ok');
    cy.get('.slick-row-detail-container').should('have.length', 1);
    cy.get('.slick-row-detail-container input').first().invoke('val').should('match', / ok$/);

    // collapse it again (the expanded row is rendered anew, so always look the selector cell up by its row)
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').click();
    cy.get('.slick-row-detail-container').should('not.exist');
  });

  it('collapses row details from the selector cell with the keyboard', () => {
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').click();
    cy.get('.slick-row-detail-container').should('have.length', 1);
    cy.window().then((win) => (win as any).grid.setActiveCell(1, 0));
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').should('have.class', 'active')
      .trigger('keydown', { key: ' ', which: 32 });
    cy.get('.slick-row-detail-container').should('not.exist');
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle').find('[data-row-detail-toggle]')
      .should('have.attr', 'aria-expanded', 'false');
  });

  it('should open the 1st Row Detail of the 2nd row and expect to find some details', () => {
    cy.get('.slick-row[data-row="1"] .slick-cell.detailView-toggle')
      .click()
      .wait(50);

        cy.get('.slick-row-detail-container.row-detail-1')
      .find('h4')
      .should('contain', 'Task 1');

    cy.get('input[id="assignee_1"]')
      .should('exist');

    cy.get('input[type="checkbox"]:checked')
      .should('have.length', 0);
  });

  it('should open the 2nd Row Detail of the 4th row and expect to find some details', () => {
    cy.get(`.slick-row[style*="transform: translateY(${GRID_ROW_HEIGHT * 10}px);"] .slick-cell:nth(1)`)
      .click()
      .wait(50);

        cy.get('.slick-row-detail-container.row-detail-3')
      .find('h4')
      .should('contain', 'Task 3');

    cy.get('input[id="assignee_3"]')
      .should('exist');

    cy.get('input[type="checkbox"]:checked')
      .should('have.length', 0);
  });

  it('should be able to collapse all row details', () => {
    cy.get('.slick-row-detail-container').should('have.length', 2);
    cy.get('[data-test="collapse-all-btn"]').click();
    cy.get('.slick-row-detail-container').should('have.length', 0);
  });

  it('should open the Task 3 Row Detail and still expect same detail', () => {
    // the click above scrolled the grid; the plugin no longer enlarges minRowBuffer, so Task 3 is not rendered up there
    cy.window().then((win: any) => win.grid.scrollRowToTop(0));
    cy.get(`.slick-row[style*="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"] .slick-cell:nth(1)`)
      .click()
      .wait(50);

    cy.get('.slick-row-detail-container').should('have.length', 1);

        cy.get('.slick-row-detail-container.row-detail-3')
      .find('h4')
      .should('contain', 'Task 3');

    cy.get('input[id="assignee_3"]')
      .should('exist');
  });

  it('keeps the row detail open, as a single row, while sorting and filtering', () => {
    cy.window().then((win: any) => {
      expect(win.dataView.getLength()).to.equal(5000);
      win.dataView.sort((a: any, b: any) => b.num - a.num);
      expect(win.dataView.getRowById(3)).to.equal(4996);
      win.grid.scrollRowToTop(4990);
    });
    cy.get('.slick-row-detail-container.row-detail-3 h4').should('contain', 'Task 3');

    cy.window().then((win: any) => {
      win.dataView.sort((a: any, b: any) => a.num - b.num);
      win.grid.scrollRowToTop(0);
    });
    cy.get('.slick-headerrow-column.l2 input').type('Task 3');
    cy.window().should((win: any) => expect(win.dataView.getLength()).to.equal(1111));
    cy.get('.slick-row-detail-container.row-detail-3 h4').should('contain', 'Task 3');
    cy.get('.slick-headerrow-column.l2 input').clear();
    cy.window().should((win: any) => expect(win.dataView.getLength()).to.equal(5000));
  });

  it('moves the active cell from the expanded row straight to the next row', () => {
    cy.window().then((win: any) => win.grid.setActiveCell(3, 2));
    cy.get('.slick-row[data-row="3"] .slick-cell.l2').should('have.class', 'active').trigger('keydown', { key: 'ArrowDown', which: 40 });
    cy.window().should((win: any) => expect(win.grid.getActiveCell()).to.deep.include({ row: 4, cell: 2 }));
  });

  it('should click on "click me" and expect an Alert to show the Help text', () => {
    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    cy.contains('Click Me').click();
    cy.get('@alertStub').should('have.been.calledWithMatch', 'Assignee is');
  });
});
