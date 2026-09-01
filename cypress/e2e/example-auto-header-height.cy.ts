describe('SlickGrid Auto Header Height', () => {
    beforeEach(() => {
        cy.visit(`${Cypress.config('baseUrl')}/examples/example-auto-header-height.html`);
        cy.get('#myGrid .slick-viewport', { timeout: 1000 }).should('be.visible');
    });

    describe('Basic Functionality', () => {
        it('should auto-size the header when autoHeaderHeight is enabled by default', () => {
            cy.get('#myGrid .slick-header-columns')
                .should(($el) => {
                    expect($el[0].offsetHeight).to.be.greaterThan(35);
                });
        });

        it('should shrink header height when autoHeaderHeight is disabled', () => {
            cy.get('#autoHeaderHeight').uncheck();
            cy.get('#setAutoHeaderHeight').click();

            cy.get('.slick-header-columns').should(($el) => {
                const height = $el[0].offsetHeight;
                expect(height).to.be.within(28, 34);
            });
        });

        it('should not clip multi-line header content when autoHeaderHeight is enabled', () => {
            cy.get('.slick-header-column .slick-column-name').first().should(($el) => {
                // Check that content is not clipped (scrollHeight <= clientHeight)
                const element = $el[0];
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                expect(scrollHeight).to.be.lte(clientHeight);
            });
        });

        it('should revert to expanded height when autoHeaderHeight is re-enabled', () => {
            cy.get('#autoHeaderHeight').uncheck();
            cy.get('#setAutoHeaderHeight').click();

            cy.get('.slick-header-columns').should(($el) => {
                expect($el[0].offsetHeight).to.be.within(28, 34);
            });

            cy.get('#autoHeaderHeight').check();
            cy.get('#setAutoHeaderHeight').click();

            // Verify header expanded again
            cy.get('.slick-header-columns').should(($el) => {
                const height = $el[0].offsetHeight;
                expect(height).to.be.greaterThan(35);
            });
        });
    });

    describe('Frozen Columns & Rows Support', () => {
        it('should equalize left and right header pane heights when frozen columns & rows exist', () => {
            cy.get('#frozenColumn').clear().type('2');
            cy.get('#setFrozenColumn').click();

            cy.get('#frozenRow').clear().type('5');
            cy.get('#setFrozenRow').click();

            cy.get('.slick-header-left .slick-header-columns').then(($left) => {
                cy.get('.slick-header-right .slick-header-columns').should(($right) => {
                    const leftHeight = $left[0].offsetHeight;
                    const rightHeight = $right[0].offsetHeight;

                    // Heights should be equal (within 1px tolerance)
                    expect(Math.abs(leftHeight - rightHeight)).to.be.lessThan(2);
                });
            });
        });

        it('should maintain correct header and container dimensions with frozen rows & columns', () => {
            cy.get('#frozenColumn').clear().type('2');
            cy.get('#setFrozenColumn').click();

            cy.get('#frozenRow').clear().type('5');
            cy.get('#setFrozenRow').click();

            cy.get('.slick-header-columns').should(($header) => {
                expect($header[0].offsetHeight).to.be.greaterThan(0);
            });

            cy.get('#myGrid').should(($grid) => {
                expect($grid[0].scrollHeight).to.be.lte($grid[0].clientHeight + 1);
            });
        });

        it('should not overflow container when frozen columns & rows are active', () => {
            cy.get('#frozenColumn').clear().type('2');
            cy.get('#setFrozenColumn').click();

            cy.get('#frozenRow').clear().type('5');
            cy.get('#setFrozenRow').click();

            cy.get('#myGrid').should(($grid) => {
                const containerHeight = $grid[0].clientHeight;
                const gridScrollHeight = $grid[0].scrollHeight;

                expect(gridScrollHeight).to.be.lte(containerHeight + 1);
            });
        });

        it('should maintain equal header heights after column resize with frozen columns & rows', () => {
            cy.get('#frozenColumn').clear().type('2');
            cy.get('#setFrozenColumn').click();

            cy.get('#frozenRow').clear().type('5');
            cy.get('#setFrozenRow').click();

            cy.get('.slick-header-right .slick-header-columns')
                .should('exist');

            cy.get('.slick-resizable-handle').first().trigger('mousedown', { which: 1 });
            cy.get('.slick-resizable-handle').first().trigger('mousemove', { clientX: 150, clientY: 0 });
            cy.get('.slick-resizable-handle').first().trigger('mouseup', { force: true });

            // Check that heights are still equal
            cy.get('.slick-header-left .slick-header-columns').then(($left) => {
                cy.get('.slick-header-right .slick-header-columns').should(($right) => {
                    const leftHeight = $left[0].offsetHeight;
                    const rightHeight = $right[0].offsetHeight;
                    expect(Math.abs(leftHeight - rightHeight)).to.be.lessThan(2);
                });
            });
        });
    });

    describe('Re-measure Triggers', () => {
        it('should recalculate header height on column resize end', () => {
            let initialHeight = 0;
            cy.get('.slick-header-columns').should(($el) => {
                initialHeight = $el[0].offsetHeight;
            }).then(() => {
                // "Duration Days" column is at index 2, its handle is at index 1 (since column 0 has no handle)
                cy.get('.slick-resizable-handle:nth(1)').then(($handle) => {
                    const rect = $handle[0].getBoundingClientRect();
                    const pageX = rect.left + window.scrollX;
                    const pageY = rect.top + window.scrollY;

                    cy.get('.slick-resizable-handle:nth(1)')
                        .trigger('mousedown', { which: 1, force: true, pageX, pageY })
                        .trigger('mousemove', { which: 1, force: true, pageX: pageX - 30, pageY })
                        .trigger('mouseup', { force: true });
                });

                cy.get('.slick-header-columns').should(($el) => {
                    const newHeight = $el[0].offsetHeight;
                    // The "Duration Days" column only has 2 words, so shrinking it doesn't force a 3rd line
                    // The height should remain the same as the initial 2-line layout
                    expect(newHeight).to.equal(initialHeight);
                });
            });
        });

        it('should recalculate header height when expanding a multi-line column to single line', () => {
            let initialHeight = 0;
            cy.get('.slick-header-columns').should(($el) => {
                initialHeight = $el[0].offsetHeight;
            }).then(() => {
                // "Duration Days" column is at index 2, its handle is at index 1 (since column 0 has no handle)
                cy.get('.slick-resizable-handle:nth(1)').then(($handle) => {
                    const rect = $handle[0].getBoundingClientRect();
                    const pageX = rect.left + window.scrollX;
                    const pageY = rect.top + window.scrollY;

                    cy.get('.slick-resizable-handle:nth(1)')
                        .trigger('mousedown', { which: 1, force: true, pageX, pageY })
                        .trigger('mousemove', { which: 1, force: true, pageX: pageX + 100, pageY })
                        .trigger('mouseup', { force: true });
                });

                cy.get('.slick-header-columns').should(($el) => {
                    const newHeight = $el[0].offsetHeight;
                    // Expanding the column should reduce from 2 lines to 1 line
                    expect(newHeight).to.be.lessThan(initialHeight);
                });
            });
        });
    });

    describe('Edge Cases and Validation', () => {
        it('should not clip multi-line headers after multiple toggles', () => {
            // Toggle multiple times
            for (let i = 0; i < 3; i++) {
                cy.get('#autoHeaderHeight').uncheck();
                cy.get('#setAutoHeaderHeight').click();

                cy.get('#autoHeaderHeight').check();
                cy.get('#setAutoHeaderHeight').click();
            }

            // Verify no clipping
            cy.get('.slick-header-column .slick-column-name').first().should(($el) => {
                const element = $el[0];
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                expect(scrollHeight).to.be.lte(clientHeight + 2);
            });
        });

        it('should maintain grid functionality with autoHeaderHeight enabled', () => {
            const cellSelector = '.slick-row:first-child .slick-cell:first-child';

            // Frozen panes can result in multiple matching cells.
            cy.get(cellSelector).first().click().should('have.class', 'active');

            // Scroll should still work.
            cy.get('.slick-viewport-bottom').eq(1).scrollTo('bottom');

            cy.get('.slick-viewport-bottom').eq(1).should(($el) => {
                expect($el[0].scrollTop).to.be.greaterThan(0);
            });
        });
    });
});
