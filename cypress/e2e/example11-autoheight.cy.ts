describe('Example 11 - AutoHeight', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example11-autoheight.html`);
  });

  it('does not leave an empty header-sized band below the last row', () => {
    cy.get('#container .slick-row[data-row="99"]').should('be.visible');
    cy.get('#container').then(($container) => {
      const container = $container[0];
      const headerRoot = container.querySelector('.slick-header-root') as HTMLElement;
      const contentRoot = container.querySelector('.slick-content-root') as HTMLElement;
      const topHeader = container.querySelector('.slick-topheader-panel') as HTMLElement;

      // The container is sized from the two live roots. This catches the old
      // auto-height calculation which counted the header once in the viewport
      // and again when sizing the container.
      expect(Math.abs(container.clientHeight - topHeader.offsetHeight - headerRoot.offsetHeight - contentRoot.offsetHeight), 'auto-height root sizing').to.be.lessThan(3);
    });
  });

  it('keeps all header layers stacked and visible while the page scrolls', () => {
    cy.scrollTo(0, 1000);
    cy.get('#container').should(($container) => {
      const container = $container[0];
      const top = container.querySelector('.slick-topheader-panel') as HTMLElement;
      const header = container.querySelector('.slick-header-root') as HTMLElement;
      const filter = container.querySelector('.slick-headerrow') as HTMLElement;
      const topRect = top.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const filterRect = filter.getBoundingClientRect();
      expect(topRect.top).to.be.closeTo(20, 1);
      expect(headerRect.top).to.be.closeTo(topRect.bottom, 1);
      expect(filterRect.top).to.be.closeTo(headerRect.bottom, 1);
      const column = header.querySelector('.slick-header-column') as HTMLElement;
      const rect = column.getBoundingClientRect();
      expect(column.ownerDocument.elementFromPoint(rect.left + 10, rect.top + rect.height / 2)?.closest('.slick-header-column')).to.eq(column);
    });

    cy.window().then((win) => {
      const grid = (win as any).grid;
      grid.setOptions({ autoHeight: true });
      grid.resizeCanvas();
    });
    cy.get('#container').should('not.have.class', 'slick-auto-height-sticky-header');
    cy.get('#container .slick-header-root').should(($header) => {
      expect($header[0].getBoundingClientRect().bottom).to.be.lessThan(0);
    });
  });
});
