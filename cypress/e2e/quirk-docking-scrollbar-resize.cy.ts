describe('Quirk - the proxy scrollbar never paints over the last row', () => {
  // The proxy track is a sibling of the viewport, so the viewport must give up its height
  // when the track appears. A column-resize drag changes the content width without going
  // through setColumns(), which is the path that used to be the only one recomputing it.
  const grid = '#myGrid';

  const measure = (win: any) => {
    const viewport = win.document.querySelector(`${grid} .slick-viewport`) as HTMLElement;
    const scroller = win.document.querySelector(`${grid} .slick-docking-horizontal-scroller`) as HTMLElement;
    const vp = viewport.getBoundingClientRect();
    const hs = scroller.getBoundingClientRect();
    return { viewportHeight: vp.height, viewportBottom: vp.bottom, trackHeight: hs.height, trackTop: hs.top };
  };

  const mouse = (win: any, type: string, x: number, y: number, buttons = 1) =>
    new win.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, buttons, view: win });

  it('yields viewport height when a resize drag brings the track in, and takes it back', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-rows.html`);
    cy.get(`${grid} .slick-header-column`).should('exist');

    // Start with no horizontal overflow, so the track has no height.
    cy.window().then((win: any) => {
      const columns = win.grid.getColumns();
      columns.forEach((column: any) => (column.width = 40));
      win.grid.setColumns(columns);
    });

    let narrowHeight = 0;
    cy.window().should((win: any) => {
      const state = measure(win);
      expect(state.trackHeight, 'no track while the content fits').to.eq(0);
      narrowHeight = state.viewportHeight;
    });

    // Drag a header handle until the content is wider than the viewport.
    cy.window().then((win: any) => {
      const columns = win.grid.getColumns();
      const header = win.grid.getHeaderColumn(columns.find((column: any) => !column.pinned).id) as HTMLElement;
      const handle = header.querySelector('.slick-resizable-handle') as HTMLElement;
      const rect = handle.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      handle.dispatchEvent(mouse(win, 'mousedown', startX, y));
      win.document.body.dispatchEvent(mouse(win, 'mousemove', startX + 600, y));
      win.__midDrag = measure(win);
      win.document.body.dispatchEvent(mouse(win, 'mouseup', startX + 600, y, 0));
    });

    cy.window().should((win: any) => {
      // Mid-drag, not only once the drag ends: the artefact was visible while dragging.
      expect(win.__midDrag.trackHeight, 'the track appears during the drag').to.be.greaterThan(0);
      expect(win.__midDrag.trackTop, 'and sits below the viewport, not over the last row').to.be.at.least(
        win.__midDrag.viewportBottom - 0.5
      );
      expect(win.__midDrag.viewportHeight, 'the viewport gave up the track height').to.be.lessThan(narrowHeight);

      const after = measure(win);
      expect(after.trackTop, 'still flush after mouseup').to.be.at.least(after.viewportBottom - 0.5);
    });

    // Narrowing again returns the height to the viewport.
    cy.window().then((win: any) => {
      const columns = win.grid.getColumns();
      columns.forEach((column: any) => (column.width = 40));
      win.grid.setColumns(columns);
    });
    cy.window().should((win: any) => {
      const state = measure(win);
      expect(state.trackHeight, 'the track goes when the content fits again').to.eq(0);
      expect(state.viewportHeight, 'and the viewport takes its height back').to.be.closeTo(narrowHeight, 0.5);
    });
  });
});
