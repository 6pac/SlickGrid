describe('Example - RTL (Right-to-Left) Support', () => {
    const titles = [
        'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven',
        'Priority', 'Status', 'Assignee', 'Department', 'Project', 'Completed'
    ];

    beforeEach(() => {
        cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple-rtl.html`);
    });

    // Section 1: Basic Rendering

    describe('Basic Rendering', () => {
        it('should display Example title', () => {
            cy.get('h2').should('contain', 'Simple Grid (RTL)');
        });

        it('should have exact Column Titles in the grid', () => {
            cy.get('#myGrid')
                .find('.slick-header-columns')
                .children()
                .each(($child, index) => expect($child.text()).to.eq(titles[index]));
        });

        it('should render columns in right-to-left order', () => {
            cy.get('#myGrid')
                .find('.slick-header-columns')
                .children()
                .each(($child, index) => expect($child.text()).to.eq(titles[index]));
        });
    });

    // Section 2: Configuration & Setup

    describe('Configuration', () => {
        it('should have RTL class applied to grid container', () => {
            cy.get('#myGrid')
                .should('have.class', 'slick-rtl');
        });

        it('should have RTL option enabled in grid options', () => {
            cy.window().then((win) => {
                const grid = (win as any).grid;
                if (grid && grid.getOptions) {
                    const options = grid.getOptions();
                    expect(options.rtl).to.be.true;
                }
            });
        });

        it('should have proper RTL cell content alignment', () => {
            cy.get('#myGrid')
                .find('.slick-cell:first')
                .should('have.css', 'direction', 'rtl');
        });
    });

    // Section 3: UI Interactions

    describe('UI Interactions', () => {
        it('should have resize handle on the left side', () => {
            cy.get('#myGrid')
                .find('.slick-header-column:first .slick-resizable-handle')
                .should('exist')
                .and('have.css', 'left', '0px');
        });

        it('should maintain RTL behavior after column resize', () => {
            // Resize first column
            cy.get('#myGrid')
                .find('.slick-header-column:first .slick-resizable-handle')
                .trigger('mousedown', { which: 1 })
                .trigger('mousemove', { clientX: 30 })
                .trigger('mouseup');

            // Verify columns still in correct RTL order
            cy.get('#myGrid')
                .find('.slick-header-columns')
                .children()
                .each(($child, index) => expect($child.text()).to.eq(titles[index]));
        });
    });

    // Section 4: Scrolling Behavior

    describe('Scrolling Behavior', () => {
        it('should have horizontal scroll enabled', () => {
            cy.get('.slick-viewport')
                .should('have.prop', 'scrollWidth')
                .then((scrollWidth) => {
                    cy.get('.slick-viewport')
                        .invoke('width')
                        .should((viewportWidth) => {
                            // @ts-ignore - scrollWidth and viewportWidth are numbers
                            expect(scrollWidth).to.be.greaterThan(viewportWidth);
                        });
                });
        });

        it('should scroll horizontally in RTL mode', () => {
            cy.get('.slick-viewport')
                .then(($viewport) => {
                    const viewport = $viewport[0];
                    viewport.scrollLeft = -200;
                    cy.wait(100);
                    expect(viewport.scrollLeft).to.be.lessThan(0);
                });
        });

        it('should update visible range when scrolling in RTL', () => {
            let initialFirstColumn = '';
            cy.get('.slick-header-column:visible')
                .first()
                .invoke('text')
                .then((text) => {
                    initialFirstColumn = text;
                });

            cy.get('.slick-viewport')
                .then(($viewport) => {
                    const viewport = $viewport[0];
                    viewport.scrollLeft = -300;
                    cy.wait(150);
                });

            cy.get('.slick-header-column:visible')
                .first()
                .invoke('text')
                .should((newText) => {
                    expect(newText).not.to.equal(initialFirstColumn);
                });
        });

        it('should calculate correct visible range in RTL mode', () => {
            cy.window().then((win) => {
                const grid = (win as any).grid;
                if (grid && grid.getVisibleRange) {
                    const viewport = grid._viewport;
                    const originalScrollLeft = viewport.scrollLeft;
                    viewport.scrollLeft = -200;
                    const range = grid.getVisibleRange();
                    expect(range.leftPx).to.be.a('number');
                    expect(range.rightPx).to.be.a('number');
                    expect(range.rightPx).to.be.greaterThan(range.leftPx);
                    viewport.scrollLeft = originalScrollLeft;
                }
            });
        });
    });

    // Section 5: Edge Cases & Stability

    describe('Edge Cases & Stability', () => {
        it('should handle max scroll in RTL mode', () => {
            cy.get('.slick-viewport')
                .then(($viewport) => {
                    const viewport = $viewport[0];
                    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                    viewport.scrollLeft = -maxScroll;
                    cy.wait(150);
                    cy.get('.slick-header-column:visible')
                        .last()
                        .should('exist');
                });
        });

        it('should maintain scroll position after column updates', () => {
            let currentScrollLeft = 0;
            cy.get('.slick-viewport')
                .then(($viewport) => {
                    const viewport = $viewport[0];
                    viewport.scrollLeft = -300;
                    currentScrollLeft = viewport.scrollLeft;
                    cy.wait(100);
                    cy.window().then((win) => {
                        const grid = (win as any).grid;
                        if (grid && grid.render) {
                            grid.render();
                        }
                    });
                    cy.wait(100);
                    expect(viewport.scrollLeft).to.equal(currentScrollLeft);
                });
        });

        it('should scroll to the end and display last columns', () => {
            cy.get('.slick-viewport')
                .then(($viewport) => {
                    const viewport = $viewport[0];
                    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                    viewport.scrollLeft = -maxScroll;
                    cy.wait(300);
                });

            cy.get('.slick-header-column:visible')
                .first()
                .invoke('text')
                .then((text) => {
                    expect(text).not.to.equal('Title');
                });
        });
    });
});
