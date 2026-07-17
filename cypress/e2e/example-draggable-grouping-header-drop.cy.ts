// Characterization test for dragging a column HEADER into the grouping dropzone (currently SortableJS
// cross-list drag with `group: { name: 'shared', pull: 'clone', put: false }` on the headers and
// `group: 'shared'` on the dropzone). This is the behavior the SortableJS removal refactor must
// reproduce in the SlickDraggableGrouping plugin, and it must pass identically before and after.
describe('Example - Draggable Grouping - drop a header into the dropzone (characterization)', { retries: 1 }, () => {
  const GRID_ROW_HEIGHT = 25;

  it('should load the example and clear the initial grouping', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-draggable-grouping.html`);
    cy.get('[data-test="clear-grouping-btn"]').click();

    cy.get('#myGrid .slick-placeholder')
      .should('be.visible')
      .should('have.text', 'Drop a column header here to group by the column :)');
    cy.get('.slick-dropped-grouping').should('have.length', 0);
  });

  it('should drag the "Duration" column header into the dropzone and group by Duration', () => {
    cy.get('#myGrid .slick-dropzone').first().then(($dropzone) => {
      cy.contains('#myGrid .slick-header-column', 'Duration').drag($dropzone);
    });

    // a grouping pill is created in the pre-header dropzone
    cy.get('.slick-dropped-grouping').should('have.length', 1);
    cy.get('.slick-dropped-grouping:nth(0) div').contains('Duration');
    cy.get('#myGrid .slick-placeholder').should('not.be.visible');

    // the header itself is not consumed by the drag (SortableJS pulls a clone)
    cy.contains('#myGrid .slick-header-column', 'Duration').should('exist');

    // and the grid data is actually grouped by Duration
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Duration:');
  });

  it('should clear the grouping again and expect the pill to be removed', () => {
    cy.get('[data-test="clear-grouping-btn"]').click();
    cy.get('.slick-dropped-grouping').should('have.length', 0);
    cy.get('#myGrid .slick-placeholder').should('be.visible');
  });
});
