describe('Example - Variable Row Height with Cell Spans', { retries: 1 }, () => {
  // must mirror the example page: every 13th row 70px, every 5th row 32px, else 25px
  const hOf = (r: number) => (r % 13 === 0) ? 70 : (r % 5 === 0) ? 32 : 25;
  const topOf = (r: number) => {
    let t = 0;
    for (let i = 0; i < r; i++) { t += hOf(i); }
    return t;
  };
  const spanSum = (head: number, rowspan: number) => {
    let t = 0;
    for (let r = head; r < head + rowspan; r++) { t += hOf(r); }
    return t;
  };

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-variable-row-height-spans.html`);
    cy.get('h2').contains('Variable row height + cell spans');
  });

  it('should pass the in-page span geometry self-checks', () => {
    cy.contains('button', 'Run span geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should render the row-5 span head as tall as its two covered rows and skip the covered cell', () => {
    cy.window().then(win => (win as any).grid.scrollRowIntoView(0));
    cy.get('#myGrid .slick-row[data-row=5] > .slick-cell.l0')
      .invoke('outerHeight')
      .should('be.closeTo', spanSum(5, 2), 1);
    cy.get('#myGrid .slick-row[data-row=6] > .slick-cell.l0').should('not.exist');
  });

  it('should keep row tops on provider prefix sums with spans present', () => {
    for (const r of [0, 5, 6, 13, 15]) {
      cy.get(`#myGrid .slick-row[data-row=${r}]`).should('have.css', 'top', `${topOf(r)}px`);
    }
  });

  it('should grow a covered row and stretch its span head (invalidateRowHeights)', () => {
    cy.contains('button', 'Grow covered row 14').click();
    // the row-13 head (rowspan 3, covering 13/14/15) must grow by the same 10px as row 14
    cy.get('#myGrid .slick-row[data-row=13] > .slick-cell.l1')
      .invoke('outerHeight')
      .should('be.closeTo', spanSum(13, 3) + 10, 1);
    cy.contains('button', 'Run span geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should scroll a far span head to the top with consistent geometry', () => {
    cy.contains('button', 'Scroll far span').click();
    // scrollRowToTop lands row 299 as the first visible row (not merely into view at the bottom)
    cy.window().then(win => {
      expect((win as any).grid.getViewport().top).to.eq(299);
    });
    cy.get('#myGrid .slick-row[data-row=299] > .slick-cell.l0')
      .invoke('outerHeight')
      .should('be.closeTo', spanSum(299, 3), 1);
  });
});
