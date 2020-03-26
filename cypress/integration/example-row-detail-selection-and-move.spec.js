/// <reference types="Cypress" />

describe('Example - Row Detail/Row Move/Checkbox Selector Plugins', () => {
    const fullTitles = ['', '', '', '#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

    beforeEach(() => {
        // create a console.log spy for later use
        cy.window().then((win) => {
            cy.spy(win.console, "log");
        });
    });

    it('should display Example Row Detail/Row Move/Checkbox Selector Plugins', () => {
        cy.visit(`${Cypress.config('baseExampleUrl')}/example-row-detail-selection-and-move.html`);
        cy.get('h2').should('contain', 'Demonstrates:');
        cy.get('h3').should('contain', 'The following three Plugins used together');
    });

    it('should have exact Column Titles in the grid', () => {
        cy.get('#myGrid')
            .find('.slick-header-columns')
            .children()
            .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
    });

    it('should open the Row Detail of the 2nd row and expect to find some details', () => {
        cy.get('.slick-cell.detailView-toggle:nth(3)')
            .click()
            .wait(250);

        cy.get('.innerDetailView_3')
            .find('h2')
            .should('contain', 'Task 3');

        cy.get('input[id="assignee_3"]')
            .should('exist');

        cy.get('input[type="checkbox"]:checked')
            .should('have.length', 0);
    });

    it('should drag opened Row Detail to another position in the grid', () => {
        cy.get('[style="top:25px"] > .slick-cell.cell-reorder').as('moveIcon1');
        cy.get('[style="top:75px"] > .slick-cell.cell-reorder').as('moveIcon3');

        cy.get('@moveIcon3').should('have.length', 1);

        cy.get('@moveIcon3')
            .trigger('mousedown', { button: 0, force: true })
            .trigger('mousemove', 'bottomRight');

        cy.get('@moveIcon1')
            .trigger('mousemove', 'bottomRight')
            .trigger('mouseup', 'bottomRight', { force: true });

        cy.get('input[type="checkbox"]:checked')
            .should('have.length', 0);
    });

    it('should expect row got moved to another row index', () => {
        cy.get('.slick-viewport-top.slick-viewport-left')
            .scrollTo('top');

        cy.get('[style="top:0px"] > .slick-cell:nth(4)').should('contain', 'Task 0');
        cy.get('[style="top:25px"] > .slick-cell:nth(4)').should('contain', 'Task 1');
        cy.get('[style="top:50px"] > .slick-cell:nth(4)').should('contain', 'Task 3');
        cy.get('[style="top:75px"] > .slick-cell:nth(4)').should('contain', 'Task 2');
        cy.get('[style="top:100px"] > .slick-cell:nth(4)').should('contain', 'Task 4');

        cy.get('input[type="checkbox"]:checked')
            .should('have.length', 0);
    });
});
