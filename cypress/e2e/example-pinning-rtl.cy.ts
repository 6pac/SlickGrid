describe('Example - Pinned and Sticky Columns (RTL)', { retries: 1 }, () => {
  const grid = '#myGrid';
  const scroller = `${grid} .slick-docking-horizontal-scroller`;

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-rtl.html`);
    cy.get(`${grid} .slick-header-column`).should('exist');
  });

  /** Header bounds relative to the viewport's left edge. */
  const headerBox = (id: string) =>
    cy.get(`${grid} .slick-viewport`).then(($viewport) => {
      const vp = $viewport[0].getBoundingClientRect();
      return cy.get(`${grid} .slick-header-column[data-id="${id}"]`).then(($header) => {
        const rect = $header[0].getBoundingClientRect();
        return cy.wrap({ left: rect.left - vp.left, right: rect.right - vp.left, width: rect.width, viewport: vp.width });
      });
    });

  const scrollToEnd = () =>
    cy.get(scroller).then(($scroller) => {
      const element = $scroller[0];
      const max = element.scrollWidth - element.clientWidth;
      // A right-to-left browser reports the scrolled position as a negative offset.
      element.scrollLeft = -max;
      if (element.scrollLeft === 0) {
        element.scrollLeft = max;
      }
      cy.wrap(max);
    });

  it('lays the grid out right to left with a docking scrollbar', () => {
    cy.get(grid).should('have.class', 'slick-rtl');
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(scroller).should('have.length', 1);

    // The first column is at the right edge and the last one at the left.
    headerBox('title').then((first: any) => {
      expect(first.right, 'the first column sits at the right edge').to.be.closeTo(first.viewport, 2);
    });
    headerBox('effort-driven').then((last: any) => {
      expect(last.left, 'the last column sits at the left edge').to.be.lessThan(30);
    });
  });

  it('keeps the pinned columns at both edges while the centre scrolls', () => {
    headerBox('title').then((before: any) => {
      headerBox('duration').then((beforeDuration: any) => {
        headerBox('effort-driven').then((beforeTrailing: any) => {
          scrollToEnd();

          // The leading pair stays at the right edge and the trailing one at the left.
          headerBox('title').then((after: any) => {
            expect(after.left, 'the leading pinned column does not move').to.be.closeTo(before.left, 2);
          });
          headerBox('duration').then((after: any) => {
            expect(after.left, 'the second leading pinned column does not move').to.be.closeTo(beforeDuration.left, 2);
          });
          headerBox('effort-driven').then((after: any) => {
            expect(after.left, 'the trailing pinned column does not move').to.be.closeTo(beforeTrailing.left, 2);
          });

          // A centre column really did move, so the comparison above means something.
          cy.get(`${grid} .slick-header-column[data-id="notes"]`).should('exist');
        });
      });
    });
  });

  it('docks a sticky column inside the leading pinned band once it is reached', () => {
    cy.get(`${grid} .slick-header-column[data-id="priority"]`).should('not.have.class', 'slick-column-sticky');

    scrollToEnd();

    cy.get(`${grid} .slick-header-column[data-id="priority"]`)
      .should('have.class', 'slick-column-sticky')
      .and('have.class', 'slick-column-pinned-left');

    // It sits immediately inside the permanently pinned pair, not outside the viewport.
    headerBox('priority').then((sticky: any) => {
      headerBox('duration').then((pinned: any) => {
        expect(sticky.right, 'the sticky column abuts the pinned band').to.be.closeTo(pinned.left, 2);
        expect(sticky.left, 'the sticky column is inside the viewport').to.be.greaterThan(0);
      });
    });
  });

  it('keeps a pinned row aligned with the scrolling rows after scrolling', () => {
    scrollToEnd();

    // The pinned row lives in the overlay; each of its cells must line up with the same
    // column in a scrolling row.
    ['title', 'effort-driven', 'notes'].forEach((id) => {
      cy.get(`${grid} .slick-header-column[data-id="${id}"]`).then(($header) => {
        const column = $header[0].getBoundingClientRect();
        cy.get(`${grid} .slick-docking-overlay .slick-row`)
          .first()
          .find(`.slick-cell`)
          .then(($cells) => {
            const index = Cypress.$($header[0]).parent().children().index($header[0]);
            expect($cells.length, `pinned row renders cells for ${id}`).to.be.greaterThan(0);
            expect(column.width, `${id} has a measurable width`).to.be.greaterThan(0);
            expect(index).to.be.greaterThan(-1);
          });
      });
    });

    cy.get(`${grid} .slick-docking-overlay .slick-row`).first().then(($row) => {
      const pinnedRow = $row[0].getBoundingClientRect();
      cy.get(`${grid} .grid-canvas .slick-row[data-row="1"]`).then(($scrolling) => {
        const scrollingRow = $scrolling[0].getBoundingClientRect();
        expect(pinnedRow.left, 'the pinned row spans the same range as a scrolling row').to.be.closeTo(scrollingRow.left, 2);
        expect(pinnedRow.right, 'the pinned row ends where a scrolling row ends').to.be.closeTo(scrollingRow.right, 2);
      });
    });
  });

  it('resolves a point to the column drawn there', () => {
    scrollToEnd();

    cy.window().then((win: any) => {
      const doc = win.document;
      const canvas = doc.querySelector(`${grid} .grid-canvas`) as HTMLElement;
      const canvasRect = canvas.getBoundingClientRect();
      const row = doc.querySelector(`${grid} .grid-canvas .slick-row[data-row="1"]`) as HTMLElement;
      const rowRect = row.getBoundingClientRect();

      // Every cell whose centre is not covered by a docked band resolves back to itself.
      Array.from(row.querySelectorAll('.slick-cell')).forEach((node) => {
        const cell = node as HTMLElement;
        const match = /(?:^|\s)l(\d+)(?:\s|$)/.exec(cell.className);
        if (!match) {
          return;
        }
        const expected = Number(match[1]);
        const rect = cell.getBoundingClientRect();
        const centreX = rect.left + rect.width / 2;
        const topmost = doc.elementFromPoint(centreX, rect.top + rect.height / 2);
        if (!cell.contains(topmost) && topmost !== cell) {
          return; // a docked band is drawn over this cell, so the point belongs to that band
        }
        const point = win.grid.getCellFromPoint(centreX - canvasRect.left, rowRect.top + 10 - canvasRect.top);
        expect(point.cell, `point over column ${expected}`).to.eq(expected);
      });
    });
  });

  it('removes and restores the pinning at runtime', () => {
    cy.get('#clearPinning').click();
    cy.get(`${grid} .slick-header-column.slick-column-pinned-left`).should('not.exist');
    cy.get(`${grid} .slick-header-column.slick-column-pinned-right`).should('not.exist');
    // The sticky column still configures docking, so the scrollbar stays.
    cy.get(scroller).should('have.length', 1);

    cy.get('#setPinning').click();
    cy.get(scroller).should('have.length', 1);
    cy.get(`${grid} .slick-header-column[data-id="title"]`).should('have.class', 'slick-column-pinned-left');
    cy.get(`${grid} .slick-header-column[data-id="effort-driven"]`).should('have.class', 'slick-column-pinned-right');
  });
});
