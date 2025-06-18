describe('Example - Row Grouping Titles', () => {
  const fullPreTitles = ['', 'Common Factor', 'Period', 'Analysis'];
  const fullTitles = ['#', 'Title', 'Duration', 'Start', 'Finish', '% Complete', 'Effort Driven'];

  it('should display Example Frozen Columns & Column Group', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns-and-column-group.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.contains('Frozen columns with extra header row grouping columns into categories');
  });

  it('should have exact Column Pre-Header & Column Header Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns:nth(0)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitles[index]));

    cy.get('#myGrid')
      .find('.slick-header-columns:nth(1)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should have a frozen grid on page load with 3 columns on the left and 4 columns on the right', () => {
    cy.get('div.slick-row[style*="top: 0px;"]').should('have.length', 2);
    cy.get('.grid-canvas-left > [style*="top: 0px;"]').children().should('have.length', 3);
    cy.get('.grid-canvas-right > [style*="top: 0px;"]').children().should('have.length', 4);

    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(0)').should('contain', '0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', 'Task 0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(2)').should('contain', '5 days');

    cy.get('.grid-canvas-right > [style*="top: 0px;"] > .slick-cell:nth(0)').should('contain', '01/01/2009');
    cy.get('.grid-canvas-right > [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', '01/05/2009');
  });

  it('should have exact Column Pre-Header & Column Header Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns:nth(0)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitles[index]));

    cy.get('#myGrid')
      .find('.slick-header-columns:nth(1)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should click on the "Remove Frozen Columns" button to switch to a regular grid without frozen columns and expect 7 columns on the left container', () => {
    cy.get('[data-test="remove-frozen-btn"]')
      .contains('Remove Frozen Columns')
      .click({ force: true });

    cy.get('div.slick-row[style*="top: 0px;"]').should('have.length', 1);
    cy.get('.grid-canvas-left > [style*="top: 0px;"]').children().should('have.length', 7);

    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(0)').should('contain', '0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', 'Task 0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(2)').should('contain', '5 days');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(3)').should('contain', '01/01/2009');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(4)').should('contain', '01/05/2009');
  });

  it('should have exact Column Pre-Header & Column Header Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns:nth(0)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitles[index]));

    cy.get('#myGrid')
      .find('.slick-header-columns:nth(1)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should click on the "Set 3 Frozen Columns" button to switch frozen columns grid and expect 3 frozen columns on the left and 4 columns on the right', () => {
    cy.get('[data-test="set-frozen-btn"]')
      .contains('Set 3 Frozen Columns')
      .click({ force: true });

    cy.get('div.slick-row[style*="top: 0px;"]').should('have.length', 2);
    cy.get('.grid-canvas-left > [style*="top: 0px;"]').children().should('have.length', 3);
    cy.get('.grid-canvas-right > [style*="top: 0px;"]').children().should('have.length', 4);

    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(0)').should('contain', '0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', 'Task 0');
    cy.get('.grid-canvas-left > [style*="top: 0px;"] > .slick-cell:nth(2)').should('contain', '5 days');

    cy.get('.grid-canvas-right > [style*="top: 0px;"] > .slick-cell:nth(0)').should('contain', '01/01/2009');
    cy.get('.grid-canvas-right > [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', '01/05/2009');
  });

  it('should have exact Column Pre-Header & Column Header Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns:nth(0)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitles[index]));

    cy.get('#myGrid')
      .find('.slick-header-columns:nth(1)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should be able to call column picker from the pre-header', () => {
    const fullPreTitlesWithoutId = ['Common Factor', 'Period', 'Period', 'Analysis'];
    const fullTitlesWithoutId = ['Title', 'Duration', 'Start', 'Finish', '% Complete', 'Effort Driven'];
    const fullTitlesWithGroup = ['#', 'Common Factor - Title', 'Common Factor - Duration', 'Period - Start', 'Period - Finish', 'Analysis - % Complete', 'Analysis - Effort Driven'];

    cy.get('#myGrid')
      .find('.slick-preheader-panel .slick-header-column:nth(1)')
      .trigger('mouseover')
      .trigger('contextmenu')
      .invoke('show');

    cy.get('.slick-columnpicker')
      .find('.slick-columnpicker-list')
      .children()
      .each(($child, index) => {
        if (index <= 6) {
          expect($child.text()).to.eq(fullTitlesWithGroup[index]);
        }
      });

    cy.get('.slick-columnpicker')
      .find('.slick-columnpicker-list')
      .children('li:nth-child(1)')
      .children('label')
      .should('contain', '#')
      .click();

    cy.get('.slick-columnpicker > button.close > .close').click();

    cy.get('#myGrid')
      .find('.slick-preheader-panel .slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitlesWithoutId[index]));

    cy.get('#myGrid')
      .find('.slick-header:not(.slick-preheader-panel) .slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitlesWithoutId[index]));
  });

  it('should scroll to the bottom of the grid and expect last row to contain Task 49999', () => {
    cy.get('#myGrid')
      .find('.slick-viewport-top.slick-viewport-right')
      .scrollTo('bottom')
      .wait(10);

    cy.get(`#myGrid [data-row="49999"] > .slick-cell:nth(0)`)
      .should('have.text', 'Task 49999');
  });
});
