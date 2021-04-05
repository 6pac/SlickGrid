"use strict";
describe('Example - Header Menu', function () {
    var titles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
    beforeEach(function () {
        // create a console.log spy for later use
        cy.window().then(function (win) {
            cy.spy(win.console, "log");
        });
    });
    it('should display Example title', function () {
        cy.visit(Cypress.config('baseUrl') + "/examples/example-plugin-headermenu.html");
        cy.get('p').contains('This example demonstrates using the Slick.Plugins.HeaderMenu');
    });
    it('should have exact Column Titles in the grid', function () {
        cy.get('#myGrid')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(titles[index]); });
    });
    it('should open the Header Menu on the "Title" column and expect onBeforeMenuShow then onAfterMenuShow to show in the console log', function () {
        cy.get('#myGrid')
            .find('.slick-header-column')
            .first()
            .trigger('mouseover')
            .children('.slick-header-menubutton')
            .should('be.hidden')
            .invoke('show')
            .click();
        cy.window().then(function (win) {
            expect(win.console.log).to.have.callCount(2);
            expect(win.console.log).to.be.calledWith('Before the Header Menu is shown');
            expect(win.console.log).to.be.calledWith('After the Header Menu is shown');
        });
    });
    it('should open the Header Menu on the "Title" column and expect Sort & Hide commands to be disabled', function () {
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Sort Ascending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Sort Descending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Hide')
            .should('exist');
    });
    it("should be still be able to click on the Help button and expect an alert", function () {
        var alertStub = cy.stub();
        cy.on('window:alert', alertStub);
        cy.get('.slick-header-menuitem.bold')
            .find('.slick-header-menucontent.blue')
            .contains('Help')
            .click()
            .then(function () { return expect(alertStub.getCall(0)).to.be.calledWith('Command: help'); });
        cy.window().then(function (win) {
            expect(win.console.log).to.have.callCount(1);
            expect(win.console.log).to.be.calledWith('execute an action on Help');
        });
    });
    it('should hover over the "Duration" column and expect Sort commands to be enabled', function () {
        cy.get('#myGrid')
            .find('.slick-header-column:nth(1)')
            .trigger('mouseover')
            .children('.slick-header-menubutton')
            .should('be.hidden')
            .invoke('show')
            .click();
        cy.get('.slick-header-menuitem.slick-header-menuitem')
            .contains('Sort Ascending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem')
            .contains('Sort Descending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Hide')
            .should('exist');
    });
    it('should execute "Sort Ascending" command from the left opened menu', function () {
        cy.get('.slick-header-menu')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem')
            .contains('Sort Ascending')
            .click();
        cy.get('.slick-header-column:nth(1).slick-header-sortable.slick-header-column-sorted')
            .find('.slick-sort-indicator.slick-sort-indicator-asc')
            .should('exist');
        cy.get('#myGrid')
            .find('.slick-row .slick-cell:nth(1)')
            .contains('0 days');
    });
    it('should hover over "% Complete" and not expect to find the Help menu', function () {
        cy.get('#myGrid')
            .find('.slick-header-column:nth(2)')
            .trigger('mouseover')
            .children('.slick-header-menubutton')
            .should('be.hidden')
            .invoke('show')
            .click();
        cy.get('.slick-header-menu')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem')
            .contains('Help')
            .should('not.exist');
    });
    it('should execute "Sort Descending" command from the menu left open and expect 2 sort icons afterward', function () {
        cy.get('.slick-header-menu')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem')
            .contains('Sort Descending')
            .click();
        cy.get('.slick-header-column:nth(1).slick-header-sortable.slick-header-column-sorted')
            .find('.slick-sort-indicator.slick-sort-indicator-asc')
            .should('exist');
        cy.get('.slick-header-column:nth(2).slick-header-sortable.slick-header-column-sorted')
            .find('.slick-sort-indicator.slick-sort-indicator-desc')
            .should('exist');
        cy.get('#myGrid')
            .find('.slick-row .slick-cell:nth(1)')
            .contains('0 days');
        cy.get('#myGrid')
            .find('.slick-row .slick-cell:nth(2)')
            .each(function ($row) {
            expect(+$row.text()).to.be.greaterThan(60);
        });
    });
    it('should hover over the "Effort Driven" column and expect Sort & Hide commands to be disabled', function () {
        cy.get('#myGrid')
            .find('.slick-header-column:nth(5)')
            .trigger('mouseover')
            .children('.slick-header-menubutton')
            .should('be.hidden')
            .invoke('show')
            .click();
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Sort Ascending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Sort Descending')
            .should('exist');
        cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
            .contains('Hide')
            .should('exist');
    });
});
