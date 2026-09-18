describe('Example - Sticky Financial Report', { retries: 1 }, () => {
  const grid = '#myGrid';
  const scrollOwner = `${grid} .slick-horizontal-scroller`;
  const row = (index: number) => `${grid} .slick-row[data-row="${index}"]`;
  const cell = (rowIndex: number, columnIndex: number) => `${row(rowIndex)} .slick-cell.l${columnIndex}.r${columnIndex}`;

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-sticky-financial-report.html`);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
  });

  it('displays the financial report title and all report columns', () => {
    cy.get('h2').should('contain', 'Example - Sticky Financial Report');
    cy.get(`${grid} .slick-header-column`).should('have.length', 18);
    cy.get(`${grid} .slick-header-column`).then(($headers) => {
      const ids = [...$headers].map((header) => header.getAttribute('data-id'));
      expect(ids).to.deep.equal([
        'account', 'jan', 'feb', 'mar', 'q1', 'apr', 'may', 'jun', 'q2',
        'jul', 'aug', 'sep', 'q3', 'oct', 'nov', 'dec', 'q4', 'ytd'
      ]);
    });
  });

  it('renders the configured sticky columns at the initial viewport', () => {
    cy.get(`${grid} .slick-header-column[data-id="account"]`).should('have.class', 'financial-account-header');
    for (const columnId of ['q1', 'q2', 'q3', 'q4', 'ytd']) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`).should('have.class', 'financial-sticky-candidate-header');
    }
    cy.get(`${row(0)} .slick-cell.financial-sticky-candidate`).should('have.length.at.least', 5);
    cy.get(`${row(0)} .slick-cell.financial-account-column`).should('exist');
  });

  it('keeps the quarter and YTD headers sticky at the far right', () => {
    cy.get(scrollOwner).scrollTo('right');

    for (const [columnId, columnIndex] of [['q3', 12], ['q4', 16], ['ytd', 17]] as const) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`).should('have.class', 'slick-column-sticky');
      cy.get(cell(0, columnIndex)).should('have.class', 'slick-cell-sticky');
    }

    cy.get(`${row(0)} .slick-cell-sticky-right-edge`).should(($cell) => {
      expect(getComputedStyle($cell[0], '::after').boxShadow).not.to.equal('none');
    });
  });

  it('keeps center cells visible when sticky columns occupy the trailing edge', () => {
    cy.get(scrollOwner).scrollTo(167, 0, { ensureScrollable: false });

    cy.get(cell(0, 12)).should('have.class', 'slick-cell-pinned-right');
    cy.get(cell(0, 9)).should(($cell) => {
      const cellElement = $cell[0] as HTMLElement;
      const rect = cellElement.getBoundingClientRect();
      const elementAtCenter = cellElement.ownerDocument.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      expect(elementAtCenter?.closest('.slick-cell')).to.equal(cellElement);
    });

    for (const [columnId, columnIndex] of [
      ['jul', 9], ['q2', 8], ['q3', 12], ['q4', 16], ['ytd', 17]
    ] as const) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`).then(($header) => {
        cy.get(cell(0, columnIndex)).then(($cell) => {
          const headerLeft = $header[0].getBoundingClientRect().left;
          const cellLeft = $cell[0].getBoundingClientRect().left;
          expect(Math.abs(headerLeft - cellLeft), `${columnId}: header=${headerLeft}, cell=${cellLeft}`).to.be.lessThan(1);
        });
      });
    }
  });

  it('moves two-sided sticky columns between the nearest edge while scrolling horizontally', () => {
    cy.get(scrollOwner).scrollTo(0, 0, { ensureScrollable: false });
    for (const columnId of ['q2', 'q3', 'q4', 'ytd']) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`)
        .should('have.class', 'slick-column-sticky')
        .and('have.class', 'slick-column-pinned-right');
    }

    cy.get(scrollOwner).scrollTo('50%', 0);
    for (const columnId of ['account', 'q1']) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`)
        .should('have.class', 'slick-column-sticky')
        .and('have.class', 'slick-column-pinned-left');
    }
    for (const columnId of ['q3', 'q4', 'ytd']) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`)
        .should('have.class', 'slick-column-sticky')
        .and('have.class', 'slick-column-pinned-right');
    }

    cy.get(scrollOwner).scrollTo('right');
    for (const columnId of ['account', 'q1', 'q2']) {
      cy.get(`${grid} .slick-header-column[data-id="${columnId}"]`)
        .should('have.class', 'slick-column-sticky')
        .and('have.class', 'slick-column-pinned-left');
    }
  });

  it('continues resizing a sticky column through multiple pointer moves', () => {
    cy.get(scrollOwner).scrollTo(0, 0, { ensureScrollable: false });
    cy.get(`${grid} .slick-header-column[data-id="q2"] .slick-resizable-handle`)
      .should('exist')
      .then(($handle) => {
        const header = $handle.closest('.slick-header-column')[0] as HTMLElement;
        const initialWidth = header.getBoundingClientRect().width;
        cy.wrap($handle).trigger('mousedown', { which: 1, pageX: 100, clientX: 100, force: true });
        cy.get('body').trigger('mousemove', { which: 1, pageX: 125, clientX: 125, force: true });
        cy.get('body').trigger('mousemove', { which: 1, pageX: 150, clientX: 150, force: true });
        cy.get('body').trigger('mouseup', { which: 1, pageX: 150, clientX: 150, force: true });
        cy.get(`${grid} .slick-header-column[data-id="q2"]`).should(($updatedHeader) => {
          expect($updatedHeader[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
        });
      });
  });

  it('resizes a sticky column docked at the leading edge', () => {
    cy.get(scrollOwner).scrollTo('right');
    cy.get(`${grid} .slick-header-column[data-id="account"]`)
      .should('have.class', 'slick-column-sticky')
      .and('have.class', 'slick-column-pinned-left')
      .find('.slick-resizable-handle')
      .then(($handle) => {
        const header = $handle.closest('.slick-header-column')[0] as HTMLElement;
        const initialWidth = header.getBoundingClientRect().width;
        cy.wrap($handle).trigger('mousedown', { which: 1, pageX: 100, clientX: 100, force: true });
        cy.get('body').trigger('mousemove', { which: 1, pageX: 125, clientX: 125, force: true });
        cy.get('body').trigger('mousemove', { which: 1, pageX: 150, clientX: 150, force: true });
        cy.get('body').trigger('mouseup', { which: 1, pageX: 150, clientX: 150, force: true });
        cy.get(`${grid} .slick-header-column[data-id="account"]`).should(($updatedHeader) => {
          expect($updatedHeader[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
        });
      });
  });

  it('scrolls to the natural position before activating a sticky column with ArrowRight', () => {
    cy.get(scrollOwner).scrollTo(0, 0, { ensureScrollable: false });
    cy.get(`${grid} .slick-header-column[data-id="q2"]`)
      .should('have.class', 'slick-column-sticky')
      .and('have.class', 'slick-column-pinned-right');
    cy.get(cell(0, 7)).should('exist').click({ force: true });
    cy.get(scrollOwner).invoke('prop', 'scrollLeft').then((beforeScroll) => {
      cy.get(cell(0, 7)).type('{rightarrow}', { force: true });
      cy.get(cell(0, 8)).should('have.class', 'active');
      cy.get(scrollOwner).should(($scroller) => {
        expect(Math.abs(($scroller[0] as HTMLElement).scrollLeft - Number(beforeScroll))).to.be.greaterThan(0);
      });
    });
  });

  it('keeps sticky summary rows keyboard-addressable after scrolling to the report totals', () => {
    cy.get(scrollOwner).scrollTo('right');
    cy.get(`${grid} .slick-vertical-scroller`).scrollTo('bottom');
    cy.get(row(20)).should('exist');
    cy.get(cell(20, 0)).click().type('{downarrow}');
    cy.get(`${row(21)} .slick-cell.active`).should('exist');
  });

  it('docks all three summary rows to the bottom after they have been seen', () => {
    const viewport = `${grid} .slick-vertical-scroller`;
    cy.get(viewport).scrollTo('bottom');
    for (const rowIndex of [20, 21, 22]) {
      cy.get(row(rowIndex)).should('exist');
    }
    cy.get(viewport).scrollTo(0, 220);
    for (const rowIndex of [20, 21, 22]) {
      cy.get(row(rowIndex)).should('have.class', 'slick-row-sticky').and('have.class', 'slick-row-pinned-bottom');
    }
  });

  it('toggles the subtitle without destroying the sticky grid', () => {
    cy.get('[data-test="toggle-subtitle"]').click();
    cy.get(`${grid} .slick-header-column[data-id="account"]`).should('exist');
    cy.get('[data-test="toggle-subtitle"]').click();
    cy.get(`${grid} .slick-header-column[data-id="ytd"]`).should('exist');
  });
});
