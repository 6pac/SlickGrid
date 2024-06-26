describe('Example - Optimizing Updates', () => {
  const titles = ['#', 'Severity', 'Time', 'Message'];

  it('should display Example Multi-grid Basic', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-optimizing-updates.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.contains('This page demonstrates how the bulk update operations ');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should show initial rows', () => {
    cy.get('#pager')
      .find('.slick-pager-status')
      .should('contain', 'Showing all 300 rows');
  });

  it('should update the rows on inefficient click', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-optimizing-updates.html`);

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($child) => {
        const message = $child.find('.cell-message').text();
        const number = parseInt(message.substring('Log Entry '.length));
        expect(number).to.be.lessThan(1000);
      });

    cy.get('.options-panel button')
      .contains('inefficient')
      .click();

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($child) => {
        const message = $child.find('.cell-message').text();
        const number = parseInt(message.substring('Log Entry '.length));
        expect(number).to.be.greaterThan(90000);
      });
  });

  it('should update the rows on efficient click', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-optimizing-updates.html`);

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($child) => {
        const message = $child.find('.cell-message').text();
        const number = parseInt(message.substring('Log Entry '.length));
        expect(number).to.be.lessThan(1000);
      });

    cy.get('.options-panel button')
      .contains('efficient')
      .click();

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($child) => {
        const message = $child.find('.cell-message').text();
        const number = parseInt(message.substring('Log Entry '.length));
        expect(number).to.be.greaterThan(90000);
      });
  });

  it('should need less time on efficient than inefficient', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-optimizing-updates.html`);

    cy.get('#duration').invoke('text', '').should('be.empty');
    cy.get('.options-panel button')
      .contains('(inefficient)')
      .click();
    cy.get('#duration').should('not.be.empty').then($duration => {
      const inEfficientTime = parseInt($duration.text());

      cy.get('#duration').invoke('text', '').should('be.empty');
      cy.get('.options-panel button')
        .contains('(efficient)')
        .click();
      cy.get('#duration').should('not.be.empty').then($duration2 => {
        const efficientTime = parseInt($duration2.text());
        expect(efficientTime).to.be.lessThan(inEfficientTime / 2);
      });
    });
  });
});
