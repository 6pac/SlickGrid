describe('Example - Variable Row Height', { retries: 1 }, () => {
  // must mirror the example page provider: every 13th row 70px, every 5th row 32px, else 25px
  const hOf = (r: number) => (r % 13 === 0) ? 70 : (r % 5 === 0) ? 32 : 25;
  const topOf = (r: number) => {
    let t = 0;
    for (let i = 0; i < r; i++) { t += hOf(i); }
    return t;
  };

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-variable-row-height.html`);
    cy.get('h2').contains('Variable row height');
  });

  it('should render the first rows at prefix-sum positions with per-row inline heights', () => {
    for (const r of [0, 1, 2, 5, 13, 15]) {
      cy.get(`#myGrid .slick-row[data-row=${r}]`)
        .should('have.css', 'top', `${topOf(r)}px`)
        .and('have.css', 'height', `${hOf(r)}px`);
    }
  });

  it('should pass the in-page geometry self-checks', () => {
    cy.contains('button', 'Run geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should scroll row 5,000 to the top with consistent geometry', () => {
    cy.contains('button', 'Scroll row 5,000').click();
    // scrollRowToTop lands row 5,000 as the first visible row
    cy.window().then(win => {
      expect((win as any).grid.getViewport().top).to.eq(5000);
    });
    cy.get('#myGrid .slick-row[data-row=5000]').should('exist');
    cy.contains('button', 'Run geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should navigate with PageDown from the active cell', () => {
    cy.window().then(win => (win as any).grid.scrollRowToTop(0));
    cy.get('#myGrid .slick-row[data-row=1] > .slick-cell:nth(0)').as('active_cell').click();
    cy.get('@active_cell').type('{pagedown}');
    // a PageDown moves the active cell down by the grid's computed numVisibleRows
    cy.window().then(win => {
      const expectedRow = 1 + (win as any).grid.numVisibleRows;
      cy.get(`#myGrid .slick-row[data-row=${expectedRow}] > .slick-cell.active`).should('have.length', 1);
    });
  });

  it('should grow row 2 by 10px and reflow the following rows (invalidateRowHeights)', () => {
    cy.window().then(win => (win as any).grid.scrollRowToTop(0));
    cy.contains('button', 'Grow row 2').click();
    cy.get('#myGrid .slick-row[data-row=2]').should('have.css', 'height', `${hOf(2) + 10}px`);
    cy.get('#myGrid .slick-row[data-row=3]').should('have.css', 'top', `${topOf(3) + 10}px`);
    cy.contains('button', 'Run geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
