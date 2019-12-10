/// <reference types="Cypress" />

describe('Example - Context Menu & Cell Menu', () => {
  const fullTitles = ['#', 'Title', '% Complete', 'Start', 'Finish', 'Priority', 'Effort Driven', 'Action'];

  it('should display Example Grid Menu', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example-plugin-contextmenu.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.contains('Slick.Plugins.ContextMenu - Context Menu (global from any columns right+click)');
    cy.contains('Slick.Plugins.CellMenu - Cell Menu (from a single cell click)');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should have first row with "Task 0" and a Priority set to "Low" with the Action cell disabled and not clickable', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains("Task 0");

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .contains("Low");

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(6) img')
      .invoke('attr', 'src')
      .then(src => {
        expect(src).to.contain('tick.png')
      });

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7) .disabled')
      .contains("Action");

    cy.get('.slick-cell-menu')
      .should('not.exist')
  });

  it('should change "Task 0" Priority to "High" and expect the Action to become clickable and usable', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains("Task 0");

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu .slick-context-menu-option-list')
      .contains("High")
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains("Action")
      .click();

    cy.get('.slick-cell-menu')
      .should('exist');
  });

  it('should expect a "Command 2" to be disabled and not clickable (menu will remain open), in that same Action menu', () => {
    cy.get('.slick-cell-menu .slick-cell-menu-item.slick-cell-menu-item-disabled')
      .contains("Command 2")
      .click();

    cy.get('.slick-cell-menu')
      .should('exist');
  });

  it('should change the Effort Driven to "False" in that same Action and then expect the "Command 2" to enabled and clickable', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('.slick-cell-menu .slick-cell-menu-option-list')
      .find(".slick-cell-menu-item")
      .contains("False")
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains("Action")
      .click();


    cy.get('.slick-cell-menu .slick-cell-menu-item')
      .contains("Command 2")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Command 2')
      })
  });
});
