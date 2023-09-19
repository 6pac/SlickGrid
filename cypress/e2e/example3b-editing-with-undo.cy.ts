describe('Example3 Editing', () => {
  const titles = ['Title', 'Description', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
  const GRID_ROW_HEIGHT = 25;

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example3b-editing-with-undo.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('Using "editCommandHandler" option to intercept edit commands and implement undo support');
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
    cy.get('[data-test="auto-edit-on-btn"]').click();
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

  it('should click on Cancel button of next editor', () => {
    cy.get('.slick-btn-default#cancel').click();
    cy.get('.slick-large-editor-text textarea').should('not.exist');
  });

  it('should undo last edit and expect the description to be opened as well when clicking the associated last undo with editor button', () => {
    cy.get('[data-test=undo-open-editor-btn]').click();
    cy.get('.slick-large-editor-text').should('have.length', 1);
    cy.get('.slick-large-editor-text textarea')
      .invoke('val')
      .then(text => expect(text).to.eq('This is a sample task description.\n  It can be multiline'));
  });

  it('should click on Cancel button of next editor', () => {
    cy.get('.slick-btn-default#cancel').click();
    cy.get('.slick-large-editor-text textarea').should('not.exist');
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

  it('should change Task 4 description and then click on Cancel button of next editor', () => {
    cy.get('.slick-large-editor-text textarea')
      .type('Fifth Row');

    cy.get('.slick-large-editor-text')
      .contains('Save')
      .click();

    cy.get('.slick-btn-default#cancel').click();
    cy.get('.slick-large-editor-text textarea').should('not.exist');
  });

  it('should expect Task 0,3,4 to have descriptions other than original text', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0)`).should('contain', 'Task 0');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(0)`).should('contain', 'Task 3');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(0)`).should('contain', 'Task 4');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).should('not.contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).should('not.contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(1)`).should('not.contain', 'This is a sample');
  });

  it('should click undo edits twice and expect Task 3-4 to be undoned but Task 0 to still be changed', () => {
    cy.get('[data-test=undo-open-editor-btn]')
      .click()
      .click();

    cy.get('.slick-large-editor-text').should('have.length', 1);
    cy.get('.slick-large-editor-text textarea')
      .invoke('val')
      .then(text => expect(text).to.eq('This is a sample task description.\n  It can be multiline'));
  });

  it('should cancel any opened textarea editor', () => {
    cy.get('.slick-btn-default#cancel').click();
    cy.get('.slick-large-editor-text textarea').should('not.exist');
  });

  it('should expect Task 3-4 to have descriptions other than original text', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0)`).should('contain', 'Task 0');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(0)`).should('contain', 'Task 3');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(0)`).should('contain', 'Task 4');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).should('not.contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).should('contain', 'Something else');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 4}px"] > .slick-cell:nth(1)`).should('contain', 'This is a sample');
  });
});
