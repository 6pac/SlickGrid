describe('Example AutoTooltips Plugin', () => {
  const GRID_ROW_HEIGHT = 25;
  const originalTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-autotooltips.html`);
    cy.get('ul > li').should('contain', 'AutoTooltips plugin');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(originalTitles[index]));
  });

  it('should resize "Start" date column and make it smaller than text length and hover over cell to see tooltip', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(3)')
      .should('contain', 'Start');

    cy.get('.slick-resizable-handle:nth(3)')
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', 'bottomRight');

    cy.get('.slick-header-column:nth(2)')
      .trigger('mousemove', 'bottomRight')
      .trigger('mouseup', 'bottomRight', { which: 1, force: true });

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l3.r3`).should('contain', '01/01/2009');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l3.r3`).trigger('mouseover');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l3.r3`).should('have.attr', 'title', '01/01/2009');

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell.l3.r3`).should('contain', '01/01/2009');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell.l3.r3`).trigger('mouseover');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell.l3.r3`).should('have.attr', 'title', '01/01/2009');
  });

  it('should hover over "Finish" cell to see tooltip', () => {
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).should('contain', '01/05/2009');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).trigger('mouseover');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).should('not.have.attr', 'title', '01/05/2009');

    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).should('contain', '01/05/2009');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).trigger('mouseover');
    cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell.l4.r4`).should('not.have.attr', 'title', '01/05/2009');
  });
});