describe('Example 0070 - Grid State using Local Storage', () => {
  const originalTitles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-0070-plugin-state.html`);
    cy.get('h2 + p').should('contain', 'Slick.State');

    cy.clearLocalStorage();
    cy.get('[data-test="clear-storage"]').click();
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(originalTitles[index]));
  });

  it('should sort ascending column "D"', () => {
    cy.get('.slick-header-columns .slick-header-column:nth(3)')
      .click({ force: true });

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .find('.slick-sort-indicator.slick-sort-indicator-asc')
      .should('be.visible');
  });

  it('should drag column "A" to be after column "C" in the grid', () => {
    const expectedTitles = ['A', 'C', 'D', 'B', 'E', 'F', 'G', 'H', 'I', 'J'];

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .contains('B')
      .drag('.slick-header-column:nth(3)');

    cy.get('.slick-header-column:nth(3)').contains('B');

    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(expectedTitles[index]));
  });

  it('should resize 1st column and make it wider', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .should('contain', 'C');

    cy.get('.slick-resizable-handle:nth(1)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', 'bottomRight');

    cy.get('.slick-header-column:nth(2)')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    cy.get('.slick-header-column:nth(1)')
      .should(($el) => {
        const expectedWidth = 170; // calculate with a calculated width including a (+/-)5px precision
        expect($el.width()).greaterThan(expectedWidth - 5);
        expect($el.width()).lessThan(expectedWidth + 5);
      });
  });

  it('should reload the page', () => {
    cy.reload().wait(50);
  });

  it('should reload page and expect same columns orders, 2nd column wider and 3rd column sorted ascending', () => {
    const expectedTitles = ['A', 'C', 'D', 'B', 'E', 'F', 'G', 'H', 'I', 'J'];

    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(expectedTitles[index]));

    cy.get('.slick-header-column:nth(1)')
      .should(($el) => {
        const expectedWidth = 170; // calculate with a calculated width including a (+/-)5px precision
        expect($el.width()).greaterThan(expectedWidth - 5);
        expect($el.width()).lessThan(expectedWidth + 5);
      });

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(2)')
      .find('.slick-sort-indicator.slick-sort-indicator-asc')
      .should('be.visible');
  });

  it('should clear local storage & reload the page', () => {
    cy.clearLocalStorage();
    cy.get('[data-test="clear-storage"]').click();

    cy.reload().wait(50);
  });

  it('should expect grid to be reset to default', () => {
    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(originalTitles[index]));

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(2)')
      .find('.slick-sort-indicator.slick-sort-indicator-asc')
      .should('not.exist');
  });
});