describe('Example3 Editing', () => {
  const titles = ['Title', 'Description', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
  const GRID_ROW_HEIGHT = 28;

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example3-editing.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('adding basic keyboard navigation and editing');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should be able to edit "Description" by double-clicking on first row and expect no more editable cell', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).click();
    cy.get('.slick-large-editor-text').should('have.length', 0);

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).dblclick();
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .type('Something else');

    cy.get('.slick-large-editor-text')
      .contains('Save')
      .click();

    cy.get('.slick-large-editor-text').should('have.length', 0);
  });

  it('should click on "Auto-Edit ON" button', () => {
    cy.get('[data-test="auto-edit-on-btn"]')
      .click();
  });

  it('should be able to edit "Description" by clicking once on second row and expect next row to become editable after clicking "Save" button', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(1)`).click();
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .type('Second Row!');

    cy.get('.slick-large-editor-text')
      .contains('Save')
      .click();

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(1)`).should('contain', 'Second Row!');
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .invoke('val')
      .then(text => expect(text).to.eq('This is a sample task description.\n  It can be multiline'));
  });

  it('should click on "Auto-Commit ON" button', () => {
    cy.get('[data-test="auto-commit-on-btn"]')
      .click();
  });

  it('should be able to edit "Description" by clicking once on second row and expect next row and not expect next line to become editable', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).click();
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .type('Third Row Text');

    cy.get('.slick-large-editor-text')
      .contains('Save')
      .click();

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).should('contain', 'Third Row Text');
    cy.get('.slick-large-editor-text').should('have.length', 0);
  });

  it('should click on "Auto-Commit OFF" button', () => {
    cy.get('[data-test="auto-commit-off-btn"]')
      .click();
  });

  it('should be able to edit "Description" and expect once again that the next line will become editable', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).click();
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .type('Fourth Row');

    cy.get('.slick-large-editor-text')
      .contains('Save')
      .click();

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).should('contain', 'Fourth Row');
    cy.get('.slick-large-editor-text').should('have.length', 1);

    cy.get('.slick-large-editor-text textarea')
      .invoke('val')
      .then(text => expect(text).to.eq('This is a sample task description.\n  It can be multiline'));
  });
});
