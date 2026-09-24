describe('Quirk - docked elements never exist without the proxy scroll owner', () => {
  // The grid has one horizontal scroll path: the proxy scrollbar, which positions pinned
  // rows and chrome. Nothing may be rendered as docked unless that scroll owner exists.
  //
  // Note what this does NOT claim. Configured docking and the proxy scrollbar are not
  // always in step: setOptions() with suppressColumnSet skips the lazy creation in
  // setColumns(), leaving pinning configured and resolved into bands with no scrollbar.
  // Nothing is rendered as docked in that state - no docked rows, and an empty chrome
  // map - which is what makes the single scroll path safe.
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
    ['configured with the column reset suppressed', (grid) => {
      grid.setOptions({ pinning: null });
      grid.setOptions({ pinning: { columns: { left: 2 } } }, false, true);
    }],
  ];

  const expectNothingDockedWithoutTheScroller = (win: any, label: string) => {
    const grid = win.grid;
    if (grid.hasDockingHorizontalScroller()) {
      return;
    }
    expect(win.document.querySelectorAll('.slick-row-docked').length, `${label}: no docked rows`).to.eq(0);
    expect(win.document.querySelectorAll('.slick-header-column.slick-column-pinned-left').length, `${label}: no pinned headers`).to.eq(0);
    expect(win.document.querySelectorAll('.slick-header-column.slick-column-pinned-right').length, `${label}: no pinned headers`).to.eq(0);

    // The chrome map is a lookup cache and may still hold elements from an earlier
    // docking; what matters is that no band entry resolves to one, because that pairing
    // is what a scroll would have had to reposition.
    const bands = [...grid.dockingLayout.left, ...grid.dockingLayout.right];
    const dockedChrome = bands.reduce((total: number, entry: any) => total + (grid.dockingChromeByColumn?.get(entry.index)?.length || 0), 0);
    expect(dockedChrome, `${label}: no band resolves to chrome that would need repositioning`).to.eq(0);
  };

  ['example-pinning-columns-and-rows', 'example1-simple'].forEach((page) => {
    it(`holds through every docking change on ${page}`, () => {
      cy.visit(`${Cypress.config('baseUrl')}/examples/${page}.html`);
      cy.get('#myGrid .slick-header-column').should('exist');

      states.forEach(([label, apply]) => {
        cy.window().then((win: any) => {
          apply(win.grid);
        });
        cy.window().should((win: any) => expectNothingDockedWithoutTheScroller(win, label));
      });
    });
  });

  it('keeps holding while the grid is scrolled with pinning configured but not applied', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example1-simple.html`);
    cy.get('#myGrid .slick-header-column').should('exist');

    cy.window().then((win: any) => {
      win.grid.setOptions({ pinning: { columns: { left: 2 } } }, false, true);
      const viewport = win.document.querySelector('#myGrid .slick-viewport') as HTMLElement;
      viewport.scrollLeft = 250;
      viewport.dispatchEvent(new win.Event('scroll'));
    });
    cy.window().should((win: any) => {
      expect(win.grid.hasConfiguredDocking(), 'pinning is configured').to.eq(true);
      expect(win.grid.hasDockingHorizontalScroller(), 'but no scroll owner was created').to.eq(false);
      expectNothingDockedWithoutTheScroller(win, 'scrolled while half-configured');
    });

    // The column reset is what applies it, and it brings the scroll owner with it.
    cy.window().then((win: any) => win.grid.setColumns(win.grid.getColumns()));
    cy.window().should((win: any) => {
      expect(win.grid.hasDockingHorizontalScroller(), 'setColumns creates the scroll owner').to.eq(true);
      expect(win.document.querySelectorAll('.slick-row-docked').length, 'and rows dock').to.be.greaterThan(0);
    });
  });
});
