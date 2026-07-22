describe('Example - Variable Row Height with Frozen Columns/Rows', { retries: 1 }, () => {
  // must mirror the example page: every 13th row 70px, every 5th row 32px, else 25px
  const hOf = (r: number) => (r % 13 === 0) ? 70 : (r % 5 === 0) ? 32 : 25;
  const sum = (from: number, to: number) => {  // [from, to)
    let t = 0;
    for (let r = from; r < to; r++) { t += hOf(r); }
    return t;
  };

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-variable-row-height-frozen.html`);
    cy.get('h2').contains('Variable row height + frozen panes');
  });

  it('should pass the in-page frozen geometry self-checks', () => {
    cy.contains('button', 'Run frozen geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should size grid B frozen pane to the sum of its frozen row heights', () => {
    // rows 0..2 = 70 + 25 + 25 = 120
    cy.get('#gridB .grid-canvas').first().invoke('css', 'height').then(h => {
      expect(parseFloat(`${h}`)).to.be.closeTo(sum(0, 3), 1);
    });
  });

  it('should reflow both column panes when a grid A row grows (invalidateRowHeights)', () => {
    cy.contains('button', 'A: grow row 2').click();
    // row 3 shifts down by the 10px added to row 2, in BOTH column panes
    cy.get('#gridA .grid-canvas').eq(0).find('.slick-row[data-row=3]')
      .should('have.css', 'top', `${sum(0, 3) + 10}px`);
    cy.get('#gridA .grid-canvas').eq(1).find('.slick-row[data-row=3]')
      .should('have.css', 'top', `${sum(0, 3) + 10}px`);
    cy.contains('button', 'Run frozen geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should resize grid B frozen pane when a frozen row grows (invalidateRowHeights)', () => {
    cy.contains('button', 'B: grow frozen row 0').click();
    cy.get('#gridB .grid-canvas').first().invoke('css', 'height').then(h => {
      expect(parseFloat(`${h}`)).to.be.closeTo(sum(0, 3) + 10, 1);
    });
    cy.contains('button', 'Run frozen geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should scroll both panes to a far row (top) keeping pane agreement', () => {
    cy.contains('button', 'Scroll both to row 300').click();
    // scrollRowToTop lands row 300 as the first visible row in both grids' scrolling panes
    cy.window().then(win => {
      expect((win as any).gridA.getViewport().top).to.eq(300);
      expect((win as any).gridB.getViewport().top).to.eq(300);
    });
    cy.contains('button', 'Run frozen geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
