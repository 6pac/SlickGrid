describe('Example - Checkbox Row Select', () => {
  const titles = ['', 'A', 'B', 'C', 'D', 'E'];
  const GRID_ROW_HEIGHT = 25;

  describe('Grid 1', () => {
    it('should display Example title', () => {
      cy.visit(`${Cypress.config('baseUrl')}/examples/example-checkbox-row-select.html`);
      cy.get('h2').contains('Demonstrates');
      cy.get('h2 + ul > li').first().contains('Checkbox row select column');
    });

    it('should have exact Column Titles in the grid', () => {
      cy.get('#myGrid')
        .find('.slick-header-columns')
        .children()
        .each(($child, index) => expect($child.text()).to.eq(titles[index]));
    });

    it('should be able to select 5th row of first grid by clicking "Select row 5" button', () => {
      cy.get('#selectRow5')
        .click();

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length', 1);

      // the entire row (all 6x cells) should be selected
      cy.get('#myGrid')
        .find('.slick-cell.selected')
        .should('have.length', 6);
    });

    it('should be able to select first 2 rows and now expect 3 rows selected', () => {
      cy.get(`.slick-row[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0) input[type=checkbox]`).click();
      cy.get(`.slick-row[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0) input[type=checkbox]`).click();

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length', 3);
    });

    it('should be able to unselect 5th row of first grid by clicking "Unselect row 5" button', () => {
      cy.get('#unselectRow5')
        .click();

      cy.get(`.slick-row[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(0) input[type=checkbox]`)
        .should('not.be.checked');

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length', 2);
    });

    it('should be able to unselect all rows by clicking "Unselect all rows" button', () => {
      cy.get('#unselectAllRows')
        .click();

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length', 0);
    });

    it('should be able select all rows by clicking on the Select All checkbox', () => {
      cy.get('#myGrid [data-id=_checkbox_selector]')
        .click();

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length.greaterThan', 10);
    });

    it('should be able to unselect all rows by clicking "Unselect all rows" button', () => {
      cy.get('#unselectAllRows')
        .click();

      cy.get('#myGrid')
        .find('.slick-cell-checkboxsel input:checked')
        .should('have.length', 0);
    });

    it('should be able to click on "toggle show/hide Select All" button and expect Select All checkbox to be toggled', () => {
      cy.get('#myGrid [data-id=_checkbox_selector] input[type=checkbox]')
        .should('exist');

      cy.get('[data-test="toggle-select-all"]')
        .click();

      cy.get('#myGrid [data-id=_checkbox_selector] input[type=checkbox]')
        .should('not.exist');

      cy.get('[data-test="toggle-select-all"]')
        .click();

      cy.get('#myGrid [data-id=_checkbox_selector] input[type=checkbox]')
        .should('exist');
    });
  });
});