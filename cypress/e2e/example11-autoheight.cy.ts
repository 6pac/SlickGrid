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

      // The container is sized from the two live roots. This catches the old
      // auto-height calculation which counted the header once in the viewport
      // and again when sizing the container.
      expect(Math.abs(container.clientHeight - headerRoot.offsetHeight - contentRoot.offsetHeight), 'auto-height root sizing').to.be.lessThan(3);
    });
  });
});
