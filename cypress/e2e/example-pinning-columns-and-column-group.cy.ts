describe('Example - Pinned Columns & Column Group', { retries: 1 }, () => {
  const grid = '#myGrid';
  const preHeaderTitles = ['', 'Common Factor', 'Period', 'Analysis'];

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns-and-column-group.html`);
  });

  function assertHeaderBand(side: 'left' | 'center' | 'right', ids: string[]): void {
    cy.get(`${grid} .slick-header:not(.slick-preheader-panel) .slick-header-column`).then(($headers) => {
      expect(
        Array.from($headers)
          .filter((header) => {
            const isDockingRoot = !!header.closest('.slick-header-columns-root');
            const isLeft = header.classList.contains('slick-column-pinned-left') || (isDockingRoot && !!header.closest('.slick-header-columns-left'));
            const isRight = header.classList.contains('slick-column-pinned-right') || (isDockingRoot && !!header.closest('.slick-header-columns-right'));
            return side === 'left' ? isLeft : side === 'right' ? isRight : !isLeft && !isRight;
          })
          .map((header) => header.getAttribute('data-id')),
        `${side} header ids`
      ).to.deep.equal(ids);
    });
  }

  function assertGroupTitles(expected: string[] = preHeaderTitles): void {
    cy.get(`${grid} .slick-preheader-panel .slick-header-column .slick-column-name`).then(($groups) => {
      expect(Array.from($groups).map((group) => group.textContent?.trim())).to.deep.equal(expected);
    });
  }

  function assertDockedRow(row: number, left: number, center: number, right: number): void {
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"]`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-pinned-left-cells .slick-cell`).should('have.length', left);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-scrolling-cells .slick-cell`).should('have.length', center);
    cy.get(`${grid} .slick-docking-overlay .slick-row[data-row="${row}"] > .slick-pinned-right-cells .slick-cell`).should('have.length', right);
  }

  it('renders the grouped headers in a single docking layout', () => {
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.contains('Pinned columns with an extra header row grouping columns into categories');
    cy.get(`${grid} > .slick-pane`).should('have.length', 0);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(`${grid} .grid-canvas`).should('have.length', 1);
    cy.get(`${grid} .slick-docking-horizontal-scroller`).should('have.length', 1);

    assertGroupTitles();
    assertHeaderBand('left', ['sel', 'title', 'duration']);
    assertHeaderBand('center', ['start', 'finish', '%', 'effort-driven']);
    assertHeaderBand('right', []);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-pinned-left-cells .slick-cell`).should('have.length', 3);
  });

  it('keeps the group row and pinned columns aligned after horizontal scrolling', () => {
    cy.get(`${grid} .slick-docking-horizontal-scroller`).scrollTo(300, 0, { ensureScrollable: false });
    assertGroupTitles();
    assertHeaderBand('left', ['sel', 'title', 'duration']);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-pinned-left-cells .slick-cell`).should('have.length', 3);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).should('have.length', 4);
  });

  it('supports all four docking sides without splitting the live viewport', () => {
    cy.window().then((win: any) => {
      win.grid.setOptions({
        pinning: {
          columns: { left: 2, right: 1 },
          rows: { top: [0, 1], bottom: [49999] },
        },
      });
    });

    cy.get(`${grid} > .slick-pane`).should('have.length', 0);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    assertHeaderBand('left', ['sel', 'title', 'duration']);
    assertHeaderBand('center', ['start', 'finish', '%']);
    assertHeaderBand('right', ['effort-driven']);
    assertGroupTitles();
    assertDockedRow(0, 3, 3, 1);
    assertDockedRow(49999, 3, 3, 1);
  });

  it('removes and restores the configured pinned-column boundary', () => {
    cy.get('[data-test="remove-pinned-btn"]').click();
    assertHeaderBand('left', []);
    assertHeaderBand('center', ['sel', 'title', 'duration', 'start', 'finish', '%', 'effort-driven']);
    cy.get(`${grid} .slick-docking-horizontal-scroller`).should('not.exist');
    cy.get(`${grid}`).should('not.have.class', 'slick-docking-horizontal-scroll-proxy');

    cy.get('[data-test="set-pinned-btn"]').click();
    assertHeaderBand('left', ['sel', 'title', 'duration']);
    assertHeaderBand('center', ['start', 'finish', '%', 'effort-driven']);
    cy.get(`${grid} .slick-docking-horizontal-scroller`).should('have.length', 1);
    assertGroupTitles();
  });

  it('updates grouped headers while columns are hidden through the column picker', () => {
    cy.get(`${grid} .slick-preheader-panel .slick-header-column:nth-child(2)`).trigger('mouseover').trigger('contextmenu').invoke('show');
    cy.get('.slick-columnpicker .slick-columnpicker-list li:visible').contains('Period - Finish').click();
    cy.get('.slick-columnpicker button.close').click();

    assertGroupTitles();
    cy.get(`${grid} .slick-header:not(.slick-preheader-panel) .slick-header-column .slick-column-name`).then(($headers) => {
      expect(Array.from($headers).map((header) => header.textContent?.trim())).to.deep.equal(['#', 'Title', 'Duration', 'Start', '% Complete', 'Effort Driven']);
    });
  });

  it('scrolls to the last data row without creating a second viewport', () => {
    cy.get(`${grid} .slick-vertical-scroller`).scrollTo('bottom');
    cy.get(`${grid} .grid-canvas [data-row="49999"]`).should('contain', 'Task 49999');
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
  });
});
