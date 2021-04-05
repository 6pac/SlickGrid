"use strict";
describe('Example - Optimizing Updates', function () {
    var titles = ['#', 'Severity', 'Time', 'Message'];
    beforeEach(function () {
        // create a console.log spy for later use
        cy.window().then(function (win) {
            cy.spy(win.console, "log");
        });
    });
    it('should display Example Multi-grid Basic', function () {
        cy.visit(Cypress.config('baseUrl') + "/examples/example-optimizing-updates.html");
        cy.get('.options-panel > b').should('contain', 'Description:');
        cy.contains('This page demonstrates how the bulk update operations ');
    });
    it('should have exact Column Titles in the grid', function () {
        cy.get('#myGrid')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(titles[index]); });
    });
    it('should show initial rows', function () {
        cy.get('#pager')
            .find('.slick-pager-status')
            .should('contain', 'Showing all 300 rows');
    });
    it('should update the rows on inefficient click', function () {
        cy.visit(Cypress.config('baseUrl') + "/examples/example-optimizing-updates.html");
        cy.get('#myGrid')
            .find('.slick-row')
            .each(function ($child, index) {
            var message = $child.find('.cell-message').text();
            var number = parseInt(message.substring("Log Entry ".length));
            expect(number).to.be.lessThan(1000);
        });
        cy.get('.options-panel button')
            .contains('inefficient')
            .click();
        cy.get('#myGrid')
            .find('.slick-row')
            .each(function ($child, index) {
            var message = $child.find('.cell-message').text();
            var number = parseInt(message.substring("Log Entry ".length));
            expect(number).to.be.greaterThan(90000);
        });
    });
    it('should update the rows on efficient click', function () {
        cy.visit(Cypress.config('baseUrl') + "/examples/example-optimizing-updates.html");
        cy.get('#myGrid')
            .find('.slick-row')
            .each(function ($child, index) {
            var message = $child.find('.cell-message').text();
            var number = parseInt(message.substring("Log Entry ".length));
            expect(number).to.be.lessThan(1000);
        });
        cy.get('.options-panel button')
            .contains('efficient')
            .click();
        cy.get('#myGrid')
            .find('.slick-row')
            .each(function ($child, index) {
            var message = $child.find('.cell-message').text();
            var number = parseInt(message.substring("Log Entry ".length));
            expect(number).to.be.greaterThan(90000);
        });
    });
    it('should need less time on efficient than inefficient', function () {
        cy.visit(Cypress.config('baseUrl') + "/examples/example-optimizing-updates.html");
        cy.get('#duration').invoke('text', '').should('be.empty');
        cy.get('.options-panel button')
            .contains('(inefficient)')
            .click();
        cy.get('#duration').should('not.be.empty').then(function ($duration) {
            var inEfficientTime = parseInt($duration.text());
            cy.get('#duration').invoke('text', '').should('be.empty');
            cy.get('.options-panel button')
                .contains('(efficient)')
                .click();
            cy.get('#duration').should('not.be.empty').then(function ($duration2) {
                var efficientTime = parseInt($duration2.text());
                expect(efficientTime).to.be.lessThan(inEfficientTime / 2);
            });
        });
    });
});
