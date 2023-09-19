describe('Example - Column Span & Header Grouping', { retries: 1 }, () => {
    // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
    const GRID_ROW_HEIGHT = 25;
    const fullTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
    for (let i = 0; i < 30; i++) {
        fullTitles.push(`Mock${i}`);
    }

    it('should display Example title', () => {
        cy.visit(`${Cypress.config('baseUrl')}/examples/example-colspan.html`);
        cy.get('h2').contains('Demonstrates');
    });

    it('should have exact column titles', () => {
        cy.get('#myGrid')
            .find('.slick-header-columns')
            .children()
            .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
    });

    it('should expect 1st row to be 1 column spanned to the entire width', () => {
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(0)`).should('contain', 'Task 0');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 0}px"] > .slick-cell:nth(1)`).should('not.exist');
    });

    it('should expect 2nd row to be 4 columns and not be spanned', () => {
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(0)`).should('contain', 'Task 1');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(1)`).should('contain', '5 days');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(2)`).should('contain', '01/05/2009');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 1}px"] > .slick-cell:nth(3)`).contains(/(true|false)/);
    });

    it('should expect 3rd row to be 1 column spanned to the entire width', () => {
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(0)`).should('contain', 'Task 2');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 2}px"] > .slick-cell:nth(1)`).should('not.exist');
    });

    it('should expect 4th row to be 4 columns and not be spanned', () => {
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(0)`).should('contain', 'Task 3');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(1)`).should('contain', '5 days');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(2)`).should('contain', '01/05/2009');
        cy.get(`[style="top:${GRID_ROW_HEIGHT * 3}px"] > .slick-cell:nth(3)`).contains(/(true|false)/);
    });
});
