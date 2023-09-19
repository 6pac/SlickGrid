describe('Example 0070 - Grid State using Local Storage', () => {
  const titles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example15-auto-resize.html`);
    cy.get('h2 + p').should('contain', 'Slick.Plugins.Resizer');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should have grid with size that is not 800 by 600px', () => {
    cy.get('#myGrid')
      .should($el => {
        expect(parseInt(`${$el.width()}`, 10)).to.greaterThan(900);
        expect(parseInt(`${$el.height()}`, 10)).not.to.eq(600);
      });
  });

  it('should resize the grid to 800 by 600px when clicking on "Fixed Dimension" button', () => {
    cy.get('[data-test="fixed-dimension"]')
      .click();

    cy.get('#myGrid')
      .should($el => {
        expect(parseInt(`${$el.width()}`, 10)).to.gte(797);
        expect(parseInt(`${$el.width()}`, 10)).to.lte(802);
        expect(parseInt(`${$el.height()}`, 10)).to.gte(598);
        expect(parseInt(`${$el.height()}`, 10)).to.lte(602);
      });
  });

  it('should auto-resize the grid when clicking on "auto-resize" button', () => {
    cy.get('[data-test="auto-resize"]')
      .click();

    cy.get('#myGrid')
      .should($el => {
        expect(parseInt(`${$el.width()}`, 10)).to.greaterThan(900);
        expect(parseInt(`${$el.height()}`, 10)).not.to.eq(600);
      });
  });

});