describe('Example - Variable Row Height with Pinned Columns/Rows', { retries: 1 }, () => {
  // must mirror the example page: every 13th row 70px, every 5th row 32px, else 25px
  const hOf = (r: number) => (r % 13 === 0) ? 70 : (r % 5 === 0) ? 32 : 25;
  const sum = (from: number, to: number) => {  // [from, to)
    let t = 0;
    for (let r = from; r < to; r++) { t += hOf(r); }
    return t;
  };

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-variable-row-height-pinning.html`);
    cy.get('h2').contains('Variable row height + pinning');
  });

  it('should pass the in-page pinning geometry self-checks', () => {
    cy.contains('button', 'Run pinning geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should use one shared canvas while preserving the configured pinning', () => {
    cy.get('#gridA .grid-canvas').should('have.length', 1);
    cy.get('#gridB .grid-canvas').should('have.length', 1);
    cy.window().then(win => {
      const { gridA, gridB } = win as any;
      expect(gridA.getPinnedColumns('left')).to.have.length(2);
      expect(gridB.getPinnedColumns('left')).to.have.length(2);
      expect(gridB.getOptions().pinning.rows.top).to.have.length(3);
    });
  });

  it('should reflow Grid A when a row grows (invalidateRowHeights)', () => {
    cy.contains('button', 'A: grow row 2').click();
    // Grid A uses one canvas; row 3 shifts by the 10px added to row 2.
    cy.get('#gridA .grid-canvas').find('.slick-row[data-row=3]')
      .should('have.css', 'top', `${sum(0, 3) + 10}px`);
    cy.contains('button', 'Run pinning geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should resize Grid B when a pinned row grows (invalidateRowHeights)', () => {
    cy.contains('button', 'B: grow pinned row 0').click();
    cy.get('#gridB .slick-docking-overlay .slick-row[data-row=0]')
      .invoke('outerHeight')
      .should('be.closeTo', hOf(0) + 10, 1);
    cy.contains('button', 'Run pinning geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });

  it('should scroll both shared viewports to a far row while accounting for pinned rows', () => {
    cy.contains('button', 'Scroll both to row 300').click();
    cy.window().then(win => {
      const { gridA, gridB } = win as any;
      const pinnedTopHeight = gridB.getOptions().pinning.rows.top.reduce(
        (height: number, row: number) => height + gridB.getRowHeight(row),
        0
      );

      cy.get('#gridA .slick-vertical-scroller').should($viewport => {
        expect($viewport[0].scrollTop).to.be.closeTo(gridA.getRowTop(300), 2);
      });
      cy.get('#gridB .slick-vertical-scroller').should($viewport => {
        expect($viewport[0].scrollTop).to.be.closeTo(gridB.getRowTop(300) - pinnedTopHeight, 2);
      });
    });
    cy.contains('button', 'Run pinning geometry self-checks').click();
    cy.get('#checkResults').should('contain', 'ALL CHECKS PASSED');
  });
});
