/// <reference types="cypress" />

describe('Example - Checkbox Header Row', () => {
  const titles = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example-checkbox-header-row.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('Using a fixed header row to implement column-level filters with Checkbox Selector');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should select a single row and display new and previous selected rows in the console (previous should be empty)', () => {
    cy.get('.slick-row:nth(3) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('3');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: ');
      expect(win.console.log).to.be.calledWith('Selected Rows: 3');
    });
  });

  it('should select a second row and display new and previous selected rows in the console (previous should be empty)', () => {
    cy.get('.slick-row:nth(6) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('3,7');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 3');
      expect(win.console.log).to.be.calledWith('Selected Rows: 3,7');
    });
  });

  it('should unselect first row and display previous and new selected rows', () => {
    cy.get('.slick-cell-checkboxsel.selected:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('7');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 3,7');
      expect(win.console.log).to.be.calledWith('Selected Rows: 7');
    });
  });

  it('should click on Select All and display previous and new selected rows', () => {
    const expectedRows = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99';

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains(expectedRows);

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 7');
      expect(win.console.log).to.be.calledWith(`Selected Rows: ${expectedRows}`);
    });
  });

  it('should click on Select All again and expect no new selected rows', () => {
    const expectedPreviousRows = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99';

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .invoke('text').then((text => {
        expect(text.trim()).to.eq('')
      }));

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith(`Previously Selected Rows: ${expectedPreviousRows}`);
      expect(win.console.log).to.be.calledWith('Selected Rows: ');
    });
  });

  it('Should display "Showing page 1 of 4" text after changing Pagination to 25 items per page', () => {
    cy.get('.ui-icon-lightbulb')
      .click();

    cy.get('.slick-pager-settings-expanded')
      .should('be.visible');

    cy.get('.slick-pager-settings-expanded')
      .contains('25')
      .click();

    cy.get('.slick-pager-status')
      .contains('Showing page 1 of 4');
  });

  it('should click on "Select All" checkbox and expect all rows selected in current page', () => {
    const expectedRows = '1,3,5,7,9,11,13,15,17,19,21,23';

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains(expectedRows);

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: ');
      expect(win.console.log).to.be.calledWith(`Selected Rows: ${expectedRows}`);
    });
  });

  it('should go to next page and still expect all rows selected in current page', () => {
    cy.get('.ui-icon-seek-next')
      .click();

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);
  });

  it('should go to last page and still expect all rows selected in current page', () => {
    cy.get('.ui-icon-seek-end')
      .click();

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 4 of 4');

    cy.get('#selectedRows')
      .should('contain', '0,2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107');
  });

  it('should uncheck first checkbox and expect the "Select All" button to be unchecked', () => {
    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('be.checked');

    cy.get('.slick-row:nth(0) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('not.be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 10);

    cy.get('#selectedRows')
      .should('contain', '2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,85,87,89,91,93,95,97,99,101,103,105,107');
  });

  it('should go back to first page and still expect all rows selected in current page', () => {
    cy.get('.ui-icon-seek-first')
      .click();

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('not.be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 1 of 4');

    cy.get('#selectedRows')
      .should('contain', '1,3,5,7,9,11,13,15,17,19,21,23');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,85,87,89,91,93,95,97,99,101,103,105,107');
  });

  it('should go back to last page then re-select the first row and expect "Select All" to be checked', () => {
    cy.get('.ui-icon-seek-end')
      .click();

    cy.get('.slick-row:nth(0) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 4 of 4');

    cy.get('#selectedRows')
      .should('contain', '0,2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107');
  });
});