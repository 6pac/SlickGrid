"use strict";
describe('Example - Grid Menu', function () {
    var fullTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
    beforeEach(function () {
        // create a console.log spy for later use
        cy.window().then(function (win) {
            cy.spy(win.console, "log");
        });
    });
    it('should display Example Multi-grid Basic', function () {
        cy.visit(Cypress.config("baseUrl") + "/examples/example-multi-grid-basic.html");
        cy.get('h2').should('contain', 'Demonstrates:');
        cy.contains('Two basic Grids with minimal configuration');
    });
    it('should have exact same Column Titles in both grids', function () {
        cy.get('#myGrid01')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(fullTitles[index]); });
        cy.get('#myGrid02')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(fullTitles[index]); });
    });
    it('should open the Grid Menu on 1st Grid and expect all Columns to be checked', function () {
        var gridUid = '';
        cy.get('#myGrid01')
            .find('button.slick-gridmenu-button')
            .click({ force: true });
        cy.get('#myGrid01')
            .should(function ($grid) {
            var classes = $grid.prop('className').split(' ');
            gridUid = classes.find(function (className) { return /slickgrid_.*/.test(className); });
            expect(gridUid).to.not.be.null;
        })
            .then(function () {
            cy.get(".slick-gridmenu." + gridUid)
                .find('.slick-gridmenu-list')
                .children('li')
                .each(function ($child, index) {
                if (index <= 5) {
                    var $input = $child.children('input');
                    var $label = $child.children('label');
                    expect($input.attr('checked')).to.eq('checked');
                    expect($label.text()).to.eq(fullTitles[index]);
                }
            });
        });
    });
    it('should then hide "Title" column from same 1st Grid and expect the column to be removed from 1st Grid', function () {
        var newColumnList = ['Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
        cy.get('#myGrid01')
            .get('.slick-gridmenu:visible')
            .find('.slick-gridmenu-list')
            .children('li:visible:nth(0)')
            .children('label')
            .should('contain', 'Title')
            .click({ force: true });
        cy.get('#myGrid01')
            .get('.slick-gridmenu:visible')
            .find('span.close')
            .click({ force: true });
        cy.get('#myGrid01')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(newColumnList[index]); });
    });
    it('should open the Grid Menu off 2nd Grid and expect all Columns to still be all checked', function () {
        var gridUid = '';
        cy.get('#myGrid02')
            .find('button.slick-gridmenu-button')
            .click({ force: true });
        cy.get('#myGrid02')
            .should(function ($grid) {
            var classes = $grid.prop('className').split(' ');
            gridUid = classes.find(function (className) { return /slickgrid_.*/.test(className); });
            expect(gridUid).to.not.be.null;
        })
            .then(function () {
            cy.get(".slick-gridmenu." + gridUid)
                .find('.slick-gridmenu-list')
                .children('li')
                .each(function ($child, index) {
                if (index <= 5) {
                    var $input = $child.children('input');
                    var $label = $child.children('label');
                    expect($input.attr('checked')).to.eq('checked');
                    expect($label.text()).to.eq(fullTitles[index]);
                }
            });
        });
    });
    it('should then hide "% Complete" column from this same 2nd Grid and expect the column to be removed from 2nd Grid', function () {
        var newColumnList = ['Title', 'Duration', 'Start', 'Finish', 'Effort Driven'];
        cy.get('#myGrid02')
            .get('.slick-gridmenu:visible')
            .find('.slick-gridmenu-list')
            .children('li:visible:nth(2)')
            .children('label')
            .should('contain', '% Complete')
            .click({ force: true });
        cy.get('#myGrid02')
            .get('.slick-gridmenu:visible')
            .find('span.close')
            .click({ force: true });
        cy.get('#myGrid02')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(newColumnList[index]); });
    });
    it('should go back to 1st Grid and open its Grid Menu and we expect this grid to stil have the "Title" column be hidden (unchecked)', function () {
        cy.get('#myGrid01')
            .find('button.slick-gridmenu-button')
            .click({ force: true });
        cy.get('.slick-gridmenu-list')
            .children('li')
            .each(function ($child, index) {
            if (index <= 5) {
                var $input = $child.children('input');
                var $label = $child.children('label');
                if ($label.text() === 'Title') {
                    expect($input.attr('checked')).to.eq(undefined);
                }
                else {
                    expect($input.attr('checked')).to.eq('checked');
                }
                expect($label.text()).to.eq(fullTitles[index]);
            }
        });
    });
    it('should hide "Start" column from 1st Grid and expect to have 2 hidden columns (Title, Start)', function () {
        var newColumnList = ['Duration', '% Complete', 'Finish', 'Effort Driven'];
        cy.get('#myGrid01')
            .get('.slick-gridmenu:visible')
            .find('.slick-gridmenu-list')
            .children('li:visible:nth(3)')
            .children('label')
            .should('contain', 'Start')
            .click({ force: true });
        cy.get('#myGrid01')
            .get('.slick-gridmenu:visible')
            .find('span.close')
            .click({ force: true });
        cy.get('#myGrid01')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(newColumnList[index]); });
    });
    it('should open Column Picker of 2nd Grid and show the "% Complete" column back to visible', function () {
        cy.get('#myGrid02')
            .find('.slick-header-column')
            .first()
            .trigger('mouseover')
            .trigger('contextmenu')
            .invoke('show');
        cy.get('.slick-columnpicker')
            .find('.slick-columnpicker-list')
            .children()
            .each(function ($child, index) {
            if (index <= 5) {
                expect($child.text()).to.eq(fullTitles[index]);
            }
        });
        cy.get('.slick-columnpicker')
            .find('.slick-columnpicker-list')
            .children('li:nth-child(3)')
            .children('label')
            .should('contain', '% Complete')
            .click();
        cy.get('#myGrid02')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) {
            if (index <= 5) {
                expect($child.text()).to.eq(fullTitles[index]);
            }
        });
        cy.get('#myGrid02')
            .get('.slick-columnpicker:visible')
            .find('span.close')
            .trigger('click')
            .click();
    });
    it('should open the Grid Menu on 2nd Grid and expect all Columns to be checked', function () {
        var gridUid = '';
        cy.get('#myGrid02')
            .find('button.slick-gridmenu-button')
            .click({ force: true });
        cy.get('#myGrid02')
            .should(function ($grid) {
            var classes = $grid.prop('className').split(' ');
            gridUid = classes.find(function (className) { return /slickgrid_.*/.test(className); });
            expect(gridUid).to.not.be.null;
        })
            .then(function () {
            cy.get(".slick-gridmenu." + gridUid)
                .find('.slick-gridmenu-list')
                .children('li')
                .each(function ($child, index) {
                if (index <= 5) {
                    var $input = $child.children('input');
                    var $label = $child.children('label');
                    expect($input.attr('checked')).to.eq('checked');
                    expect($label.text()).to.eq(fullTitles[index]);
                }
            });
        });
    });
    it('should still expect 1st Grid to be unchanged from previous state and still have only 4 columns shown', function () {
        var newColumnList = ['Duration', '% Complete', 'Finish', 'Effort Driven'];
        cy.get('#myGrid01')
            .find('.slick-header-columns')
            .children()
            .each(function ($child, index) { return expect($child.text()).to.eq(newColumnList[index]); });
    });
    it('should open the Grid Menu on 1st Grid and also expect to only have 4 columns checked (visible)', function () {
        var gridUid = '';
        cy.get('#myGrid01')
            .find('button.slick-gridmenu-button')
            .click({ force: true });
        cy.get('#myGrid01')
            .should(function ($grid) {
            var classes = $grid.prop('className').split(' ');
            gridUid = classes.find(function (className) { return /slickgrid_.*/.test(className); });
            expect(gridUid).to.not.be.null;
        })
            .then(function () {
            cy.get(".slick-gridmenu." + gridUid)
                .find('.slick-gridmenu-list')
                .children('li')
                .each(function ($child, index) {
                if (index <= 5) {
                    var $input = $child.children('input');
                    var $label = $child.children('label');
                    if ($label.text() === 'Title' || $label.text() === 'Start') {
                        expect($input.attr('checked')).to.eq(undefined);
                    }
                    else {
                        expect($input.attr('checked')).to.eq('checked');
                    }
                    expect($label.text()).to.eq(fullTitles[index]);
                }
            });
        });
        cy.get('#myGrid01')
            .get('.slick-gridmenu:visible')
            .find('span.close')
            .click({ force: true });
    });
});
