describe('SlickGrid Auto Header Height', () => {
    const headerSelector = '#myGrid .slick-header-left';
    const durationResizeHandleSelector = `${headerSelector} .slick-header-column[data-id="duration"] .slick-resizable-handle`;

    const applyPinning = () => {
        cy.get('#pinnedColumn').clear().type('2');
        cy.get('#setPinnedColumn').click();
        cy.get('#pinnedRow').clear().type('5');
        cy.get('#setPinnedRow').click();
    };

    beforeEach(() => {
        cy.visit(`${Cypress.config('baseUrl')}/examples/example-auto-header-height.html`);
        cy.get('#myGrid .slick-viewport', { timeout: 1000 }).should('be.visible');
    });

    describe('Basic Functionality', () => {
        it('should auto-size the header when autoHeaderHeight is enabled by default', () => {
            cy.get(headerSelector)
                .should(($el) => {
                    expect($el[0].offsetHeight).to.be.greaterThan(35);
                });
        });

        it('should shrink header height when autoHeaderHeight is disabled', () => {
            cy.get('#autoHeaderHeight').uncheck();
            cy.get('#setAutoHeaderHeight').click();

            cy.get(headerSelector).should(($el) => {
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

            cy.get(headerSelector).should(($el) => {
                expect($el[0].offsetHeight).to.be.within(28, 34);
            });

            cy.get('#autoHeaderHeight').check();
            cy.get('#setAutoHeaderHeight').click();

            // Verify header expanded again
            cy.get(headerSelector).should(($el) => {
                const height = $el[0].offsetHeight;
                expect(height).to.be.greaterThan(35);
            });
        });
    });

    describe('Pinned Columns & Rows Support', () => {
        it('should keep all header columns at the same height when pinning is active', () => {
            applyPinning();

            cy.get(`${headerSelector} .slick-header-column`).should(($headers) => {
                const heights = [...$headers].map((header) => header.getBoundingClientRect().height);
                expect(Math.max(...heights) - Math.min(...heights)).to.be.lessThan(2);
            });
        });

        it('should maintain correct header and container dimensions with pinned rows and columns', () => {
            applyPinning();

            cy.get(headerSelector).should(($header) => {
                expect($header[0].offsetHeight).to.be.greaterThan(0);
            });
            cy.get('#myGrid .slick-docking-overlay').should('exist');
            cy.get('#myGrid .slick-docking-horizontal-scroller').should('exist');
            cy.get('#myGrid').should(($grid) => {
                expect($grid[0].scrollHeight).to.be.lte($grid[0].clientHeight + 1);
            });
        });

        it('should not overflow container when pinned columns & rows are active', () => {
            applyPinning();

            cy.get(headerSelector).should(($header) => {
                expect($header[0].offsetHeight).to.be.greaterThan(0);
            });
            cy.get('#myGrid').should(($grid) => {
                expect($grid[0].scrollHeight).to.be.lte($grid[0].clientHeight + 1);
            });
        });

        it('should keep the pinned overlay inside the viewport, which clips its overflow', () => {
            applyPinning();

            cy.get('#myGrid .slick-viewport').then(($viewport) => {
                const viewport = $viewport[0] as HTMLElement;
                const viewportRect = viewport.getBoundingClientRect();
                cy.get('#myGrid .slick-docking-overlay').should(($overlay) => {
                    const overlay = $overlay[0] as HTMLElement;
                    const overlayRect = overlay.getBoundingClientRect();
                    // The overlay is a sticky layer inside the scrollport, so the native
                    // scrollbar paints above the pinned rows and spans the pinned sections.
                    expect(overlay.parentElement, 'the overlay lives inside the viewport').to.eq(viewport);
                    expect(getComputedStyle(overlay).position).to.eq('sticky');
                    expect(overlayRect.left).to.be.closeTo(viewportRect.left, 1);
                    expect(overlayRect.top).to.be.closeTo(viewportRect.top, 1);
                    // It takes no layout height of its own, and the viewport, not a clip-path,
                    // is the visible overflow boundary.
                    expect(overlayRect.height, 'the overlay adds no layout height').to.eq(0);
                    expect(overlay.style.clipPath, 'no clip-path is needed').to.eq('');
                    expect(getComputedStyle(viewport).overflowX, 'the viewport clips the overflow').to.eq('hidden');
                });
                // The pinned rows themselves start at the top of the viewport.
                cy.get('#myGrid .slick-docking-overlay .slick-row').first().should(($row) => {
                    expect($row[0].getBoundingClientRect().top).to.be.closeTo(viewportRect.top, 1);
                });
            });
        });

        it('should maintain equal header heights after column resize with pinned columns and rows', () => {
            applyPinning();

            cy.get(durationResizeHandleSelector).then(($handle) => {
                const rect = $handle[0].getBoundingClientRect();
                const pageX = rect.left + window.scrollX;
                const pageY = rect.top + window.scrollY;
                cy.wrap($handle)
                    .trigger('mousedown', { which: 1, pageX, pageY })
                    .trigger('mousemove', { which: 1, pageX: pageX + 30, pageY })
                    .trigger('mouseup');
            });

            cy.get(`${headerSelector} .slick-header-column`).should(($headers) => {
                const heights = [...$headers].map((header) => header.getBoundingClientRect().height);
                expect(Math.max(...heights) - Math.min(...heights)).to.be.lessThan(2);
                });
        });
    });

    describe('Re-measure Triggers', () => {
        it('should recalculate header height on column resize end', () => {
            let initialHeight = 0;
            cy.get(headerSelector).should(($el) => {
                initialHeight = $el[0].offsetHeight;
            }).then(() => {
                cy.get(durationResizeHandleSelector).then(($handle) => {
                    const rect = $handle[0].getBoundingClientRect();
                    const pageX = rect.left + window.scrollX;
                    const pageY = rect.top + window.scrollY;

                    cy.wrap($handle)
                        .trigger('mousedown', { which: 1, force: true, pageX, pageY })
                        .trigger('mousemove', { which: 1, force: true, pageX: pageX - 30, pageY })
                        .trigger('mouseup', { force: true });
                });

                cy.get(headerSelector).should(($el) => {
                    const newHeight = $el[0].offsetHeight;
                    // The "Duration Days" column only has 2 words, so shrinking it doesn't force a 3rd line
                    // The height should remain the same as the initial 2-line layout
                    expect(newHeight).to.equal(initialHeight);
                });
            });
        });

        it('should recalculate header height when expanding a multi-line column to single line', () => {
            let initialHeight = 0;
            cy.get(headerSelector).should(($el) => {
                initialHeight = $el[0].offsetHeight;
            }).then(() => {
                cy.get(durationResizeHandleSelector).then(($handle) => {
                    const rect = $handle[0].getBoundingClientRect();
                    const pageX = rect.left + window.scrollX;
                    const pageY = rect.top + window.scrollY;

                    cy.wrap($handle)
                        .trigger('mousedown', { which: 1, force: true, pageX, pageY })
                        .trigger('mousemove', { which: 1, force: true, pageX: pageX + 100, pageY })
                        .trigger('mouseup', { force: true });
                });

                cy.get(headerSelector).should(($el) => {
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

            cy.get(cellSelector).first().click().should('have.class', 'active');

            // Scroll should still work.
            cy.get('#myGrid .slick-viewport').scrollTo('bottom');

            cy.get('#myGrid .slick-viewport').should(($el) => {
                expect($el[0].scrollTop).to.be.greaterThan(0);
            });
        });
    });
});
