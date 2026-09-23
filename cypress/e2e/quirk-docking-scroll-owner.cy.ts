describe('Quirk - docking owns the horizontal scrollbar whenever it is configured', () => {
  // The grid has one horizontal scroll path: the proxy scrollbar. That is only safe while
  // configured docking and the proxy scrollbar are introduced and removed together, so a
  // docked row can never exist without the scroll owner that positions it.
  const states: Array<[string, (grid: any) => void]> = [
    ['as loaded', () => undefined],
    ['pinning added', (grid) => grid.setOptions({ pinning: { columns: { left: 2 } } })],
    ['pinning removed', (grid) => grid.setOptions({ pinning: null })],
    ['pinning re-added', (grid) => grid.setOptions({ pinning: { columns: { left: 1, right: 1 } } })],
    ['sticky only', (grid) => {
      grid.setOptions({ pinning: null });
      const columns = grid.getColumns();
      columns[1].sticky = true;
      grid.setColumns(columns);
    }],
  ];

  ['example-pinning-columns-and-rows', 'example1-simple'].forEach((page) => {
    it(`holds through every docking change on ${page}`, () => {
      cy.visit(`${Cypress.config('baseUrl')}/examples/${page}.html`);
      cy.get('#myGrid .slick-header-column').should('exist');

      states.forEach(([label, apply]) => {
        cy.window().then((win: any) => {
          apply(win.grid);
        });
        cy.window().should((win: any) => {
          const grid = win.grid;
          const configured = grid.hasConfiguredDocking();
          expect(grid.hasDockingHorizontalScroller(), `${label}: scroller matches configured docking`).to.eq(configured);
          if (!configured) {
            expect(win.document.querySelectorAll('.slick-row-docked').length, `${label}: no docked rows without docking`).to.eq(0);
          }
        });
      });
    });
  });
});
