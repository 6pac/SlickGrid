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
});
