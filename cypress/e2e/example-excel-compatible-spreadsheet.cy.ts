describe('Example - Excel-compatible spreadsheet and Cell Selection', { retries: 0 }, () => {
  const cellHeight = 25;

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-excel-compatible-spreadsheet.html`);
  });

  it('should click on cell B2, copy value, ArrowDown, paste value, ArrowRight, and expect to be in column C', () => {
    cy.getCell(2, 2, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .as('cell_B2')
      .click();

    cy.get(".slick-cell.active")
      .realPress(["Control", "C"]);

    cy.get(".slick-cell.active")
      .type('{downarrow}');

    cy.get(".slick-cell.active")
      .realPress(["Control", "V"]);

    cy.get(".slick-cell.active")
      .type('{rightarrow}');

    cy.get('#myGrid .slick-cell.l3.r3.selected')
      .should('have.length', 1);

    cy.getCell(3, 2, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .should('have.text', '3');
  });
});
