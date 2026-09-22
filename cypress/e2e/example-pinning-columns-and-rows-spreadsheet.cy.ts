describe('Example - Spreadsheet and Cell Selection', { retries: 0 }, () => {
  const grid = '#myGrid';
  const titles = [
    '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK'
  ];

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-rows-spreadsheet.html`);
  });

  function cell(row: number, column: number): string {
    return `${grid} [data-row="${row}"] .slick-cell.l${column}.r${column}`;
  }

  /**
   * Scrolls a cell into view and waits for the grid to stop re-rendering it.
   *
   * A programmatic scroll renders on the next frame, so a test that scrolls and then
   * immediately resolves an element can capture a node the very next render replaces.
   * Retrying until the resolved node is still the topmost one at its own centre is what
   * makes the following click reliable, rather than forcing past the actionability check.
   */
  function settledCell(row: number, column: number) {
    cy.window().then((win: any) => win.grid.scrollCellIntoView(row, column));
    cy.get(cell(row, column)).should(($cells) => {
      expect($cells, 'exactly one node for the cell').to.have.length(1);
      const element = $cells[0];
      const rect = element.getBoundingClientRect();
      const topmost = element.ownerDocument.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      expect(element === topmost || element.contains(topmost), 'the cell is the topmost element at its centre').to.eq(true);
    });
    return cy.get(cell(row, column));
  }

  function getCell(row: number, column: number) {
    return settledCell(row, column);
  }

  function scrollRowIntoView(row: number): void {
    // Seat the row at the top rather than flush against an edge: a cell on the exact
    // boundary makes the test runner scroll again to reveal it, which re-renders the row.
    cy.window().then((win: any) => win.grid.scrollRowToTop(row));
  }

  it('renders the spreadsheet with one viewport and the configured top/left docking bands', () => {
    cy.get(`${grid} > .slick-pane`).should('have.length', 0);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-overlay`).should('have.length', 1);

    cy.get(`${grid} .slick-header-column .slick-column-name`).then(($headers) => {
      expect(Array.from($headers).slice(0, titles.length).map((header) => header.textContent?.trim())).to.deep.equal(titles);
    });

    cy.get(`${grid} .slick-header-column`).then(($headers) => {
      const leftHeaderIds = new Set(
        Array.from($headers)
          .filter((header) => header.classList.contains('slick-column-pinned-left'))
          .map((header) => header.getAttribute('data-id'))
          .filter((id): id is string => !!id)
      );
      // `left: 3` is an inclusive visible-column boundary. The selector plus
      // the first three sheet columns are pinned; the numeric column id `3`
      // must not be treated as another matching reference.
      expect(leftHeaderIds.size).to.eq(4);
    });
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="0"]`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="6"]`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas .slick-row[data-row="7"]`).should('have.length', 1);
  });

  it('resolves numeric pinning boundaries against visible columns', () => {
    cy.window().then((win: any) => {
      // Hide sheet column B (raw index 2), then keep the same inclusive
      // boundary. The first four visible columns should remain pinned.
      win.grid.updateColumnById(1, { hidden: true }, true);
      win.grid.setOptions({ pinning: { columns: { left: 3 } } });
    });

    cy.get(`${grid} .slick-header-column.slick-column-pinned-left`).then(($headers) => {
      expect(
        new Set(Array.from($headers).map((header) => header.getAttribute('data-id')))
      ).to.deep.equal(new Set(['selector', '0', '2', '3']));
    });
  });

  it('selects a range across the top-pinned and scrolling rows', () => {
    getCell(5, 2).as('cell_B5').click();
    cy.get('@cell_B5').type('{shift}{uparrow}{downarrow}{downarrow}{downarrow}{downarrow}', { release: false, scrollBehavior: false });

    cy.get(`${grid} .slick-cell.l2.r2.selected`).should('have.length', 4);
    cy.get('#selectionRange').should('have.text', '{"fromRow":5,"fromCell":2,"toCell":2,"toRow":8}');
  });

  it('selects a range from a top-pinned row through the scrolling rows', () => {
    getCell(5, 5).as('cell_E5').click();
    cy.get('@cell_E5').type('{shift}{rightarrow}{pagedown}{pagedown}', { release: false, scrollBehavior: false });

    cy.get('#selectionRange').should('have.text', '{"fromRow":5,"fromCell":5,"toCell":6,"toRow":41}');
  });

  it('selects from a scrolled cell to the start of the sheet', () => {
    scrollRowIntoView(40);
    // The cell is already in view; letting the runner scroll again would re-render the row
    // underneath the element it just resolved.
    settledCell(40, 6).click({ scrollBehavior: false });
    cy.get(cell(40, 6)).type('{shift}{ctrl}{home}', { release: false, scrollBehavior: false });

    cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":6,"toRow":40}');
  });

  it('selects from a scrolled cell to the end of the sheet', () => {
    scrollRowIntoView(40);
    settledCell(40, 5).click({ scrollBehavior: false });
    cy.get(cell(40, 5)).type('{shift}{ctrl}{end}', { release: false, scrollBehavior: false });

    cy.get('#selectionRange').should('have.text', '{"fromRow":40,"fromCell":5,"toCell":100,"toRow":99}');
  });

  it('selects the complete sheet with Ctrl+A from a scrolled row', () => {
    scrollRowIntoView(95);
    getCell(95, 95).as('cell_CS95').click();
    cy.get('@cell_CS95').type('{ctrl}{A}', { release: false, scrollBehavior: false });

    cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":100,"toRow":99}');
  });
});
