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

  function getCell(row: number, column: number) {
    // Docked and virtualized rendering can briefly leave two matching cell
    // nodes during a row scroll. Choose the node that is actually topmost at
    // its center instead of relying on DOM order.
    return cy
      .window()
      .then((win: any) => win.grid.scrollCellIntoView(row, column))
      .then(() => cy.get(cell(row, column)).filter(':visible'))
      .then(($cells) => {
        const target =
          Array.from($cells).find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            const elementAtCenter = candidate.ownerDocument.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            return elementAtCenter === candidate || candidate.contains(elementAtCenter);
          }) || $cells[$cells.length - 1];

        return cy.wrap(target);
      });
  }

  function scrollRowIntoView(row: number): void {
    cy.window().then((win: any) => win.grid.scrollRowIntoView(row));
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
    getCell(5, 2).as('cell_B5').click({ force: true });
    cy.get('@cell_B5').type('{shift}{uparrow}{downarrow}{downarrow}{downarrow}{downarrow}', { release: false, force: true });

    cy.get(`${grid} .slick-cell.l2.r2.selected`).should('have.length', 4);
    cy.get('#selectionRange').should('have.text', '{"fromRow":5,"fromCell":2,"toCell":2,"toRow":8}');
  });

  it('selects a range from a top-pinned row through the scrolling rows', () => {
    getCell(5, 5).as('cell_E5').click({ force: true });
    cy.get('@cell_E5').type('{shift}{rightarrow}{pagedown}{pagedown}', { release: false, force: true });

    cy.get('#selectionRange').should('have.text', '{"fromRow":5,"fromCell":5,"toCell":6,"toRow":41}');
  });

  it('selects from a scrolled cell to the start of the sheet', () => {
    scrollRowIntoView(40);
    getCell(40, 6).as('cell_G40').click({ force: true });
    cy.get('@cell_G40').type('{shift}{ctrl}{home}', { release: false, force: true });

    cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":6,"toRow":40}');
  });

  it('selects from a scrolled cell to the end of the sheet', () => {
    scrollRowIntoView(40);
    getCell(40, 5).as('cell_F40').click({ force: true });
    cy.get('@cell_F40').type('{shift}{ctrl}{end}', { release: false, force: true });

    cy.get('#selectionRange').should('have.text', '{"fromRow":40,"fromCell":5,"toCell":100,"toRow":99}');
  });

  it('selects the complete sheet with Ctrl+A from a scrolled row', () => {
    scrollRowIntoView(95);
    getCell(95, 95).as('cell_CS95').click({ force: true });
    cy.get('@cell_CS95').type('{ctrl}{A}', { release: false, force: true });

    cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":100,"toRow":99}');
  });
});
