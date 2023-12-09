describe('Example 1 - Basic Grid', () => {
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  it('should display Example 1 with Basic Basic', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.contains('basic grid with minimal configuration');
  });

  it('should have exact Column Titles in grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should resize all columns and make them wider', () => {
    // resize EffortDriven column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(5)')
      .should('contain', 'Effort Driven');

    cy.get('.slick-resizable-handle:nth(5)')
      .trigger('mousedown', { which: 1, force: true, pageX: 500, pageY: 25 })
      .trigger('mousemove', { which: 1, force: true, pageX: 600, pageY: 25 })
      .trigger('mouseup', { force: true });

    // resize Finish column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(4)')
      .should('contain', 'Finish');

    cy.get('.slick-resizable-handle:nth(4)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', 'bottomRight');

    cy.get('.slick-header-column:nth(5)')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    // resize Start column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .should('contain', 'Start');

    cy.get('.slick-resizable-handle:nth(3)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', 'bottomRight');

    cy.get('.slick-header-column:nth(5)')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    // resize %Complete column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(2)')
      .should('contain', '% Complete');

    cy.get('.slick-resizable-handle:nth(2)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', 'bottomRight');

    cy.get('.slick-header-column:nth(4)')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    // resize Duration column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .should('contain', 'Duration');

    cy.get('.slick-resizable-handle:nth(1)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { which: 1, force: true, pageX: 250, pageY: 25 })
      .trigger('mouseup', { force: true });

    // resize Title column
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .should('contain', 'Title');

    cy.get('.slick-resizable-handle:nth(0)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { which: 1, force: true, pageX: 80, pageY: 25 })
      .trigger('mouseup', { force: true });
  });

  it('should scroll horizontally completely to the right and expect all cell to be rendered', () => {
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l1`).should('contain', '5 days');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l2`).contains(/[0-9]*/);

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 15}px;"] > .slick-cell.l1`).should('contain', '5 days');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 15}px;"] > .slick-cell.l2`).contains(/[0-9]*/);

    // scroll to right
    cy.get('.slick-viewport-top.slick-viewport-left')
      .scrollTo('100%', '0%', { duration: 1500 });

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l3`).should('contain', '01/01/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l4`).should('contain', '01/05/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l2`).contains(/[true|false]*/);

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 15}px;"] > .slick-cell.l3`).should('contain', '01/01/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 15}px;"] > .slick-cell.l4`).should('contain', '01/05/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 15}px;"] > .slick-cell.l2`).contains(/[true|false]*/);
  });

  it('should scroll vertically to the middle of the grid and expect all cell to be rendered', () => {
    // scroll to right
    cy.get('.slick-viewport-top.slick-viewport-left')
      .scrollTo('100%', '40%', { duration: 1500 });

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 195}px;"] > .slick-cell.l3`).should('contain', '01/01/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 195}px;"] > .slick-cell.l4`).should('contain', '01/05/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 195}px;"] > .slick-cell.l2`).contains(/[true|false]*/);

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 210}px;"] > .slick-cell.l3`).should('contain', '01/01/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 210}px;"] > .slick-cell.l4`).should('contain', '01/05/2009');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 210}px;"] > .slick-cell.l2`).contains(/[true|false]*/);
  });
});
