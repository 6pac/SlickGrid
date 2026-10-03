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

  it('paints a docked sticky cell opaque on every row, hiding the cells beneath it', () => {
    scrollToEnd();
    cy.get(`${grid} .slick-header-column[data-id="priority"]`).should('have.class', 'slick-column-sticky');

    // The theme stripes only odd rows, so an even row has no colour of its own for the sticky
    // cell to inherit; that is where the cells scrolling beneath it showed through. This is not
    // specific to right-to-left grids, which is simply where no example colour masked it.
    [3, 4].forEach((row) => {
      cy.get(`${grid} .grid-canvas .slick-row[data-row="${row}"] .slick-cell-sticky`).should(($cell) => {
        const background = getComputedStyle($cell[0]).backgroundColor;
        expect(background, `row ${row} sticky cell background`).not.to.eq('rgba(0, 0, 0, 0)');
        expect(background, `row ${row} sticky cell background`).not.to.eq('transparent');
      });
    });
  });

  it('draws every band separator on the side that faces the scrolling columns', () => {
    // A separator is an inset shadow: a negative offset draws it on the right edge and a
    // positive one on the left. The leading band is at the right edge here, so its separator
    // belongs on its left, facing the scrolling columns, and the trailing band's on its right.
    const expectFacingCentre = (separators: string[]) =>
      cy.window().then((win: any) => {
        const doc = win.document;
        const viewport = doc.querySelector(`${grid} .slick-viewport`).getBoundingClientRect();
        const middle = viewport.left + viewport.width / 2;
        const misplaced: string[] = [];
        separators.forEach((separator) => {
          const [selector, pseudo] = separator.split('::');
          const elements = Array.from(doc.querySelectorAll(`${grid} ${selector}`)) as HTMLElement[];
          expect(elements.length, `${selector} is rendered`).to.be.greaterThan(0);
          elements.forEach((element) => {
            const offset = /\)\s*(-?[\d.]+)px/.exec(getComputedStyle(element, pseudo && `::${pseudo}`).boxShadow);
            const rect = element.getBoundingClientRect();
            const facesLeft = rect.left + rect.width / 2 > middle;
            if (!offset || Number(offset[1]) > 0 !== facesLeft) {
              misplaced.push(`${separator} ${element.getAttribute('data-id') || element.className.split(' ').slice(0, 2).join('.')}`);
            }
          });
        });
        expect(Array.from(new Set(misplaced)), 'separators missing or on the outer side of their cell').to.deep.eq([]);
      });

    expectFacingCentre([
      '.slick-column-pinned-left-edge',
      '.slick-column-pinned-right-edge',
      '.slick-pinned-left-cells-active > .slick-cell:last-child:not(.slick-cell-colspan-crossing-docking)::after',
      '.slick-pinned-right-cells-active > .slick-cell:first-child:not(.slick-cell-colspan-crossing-docking)::after',
    ]);

    // Once the sticky column docks, it draws its own separator further in, in the header as well
    // as in the body, and the pinned pair keeps its separator.
    scrollToEnd();
    cy.get(`${grid} .slick-header-column[data-id="priority"]`).should('have.class', 'slick-column-sticky');
    expectFacingCentre(['.slick-column-pinned-left-edge', '.slick-column-sticky-left-edge', '.slick-cell-sticky-left-edge::after']);
  });

  it('draws the same separators in the header as in the body', () => {
    // Where each separator line is drawn: an inset shadow with a positive offset is a line on
    // the element's left edge, and one with a negative offset a line on its right edge.
    const separatorLines = (elements: HTMLElement[], pseudo?: string) =>
      elements
        .map((element) => {
          const offset = Number(/\)\s*(-?[\d.]+)px/.exec(getComputedStyle(element, pseudo).boxShadow)?.[1] || 0);
          const rect = element.getBoundingClientRect();
          return offset > 0 ? rect.left : offset < 0 ? rect.right : undefined;
        })
        .filter((x): x is number => x !== undefined)
        .sort((a, b) => a - b);

    const expectHeaderMatchesBody = (state: string) =>
      cy.window().then((win: any) => {
        const doc = win.document;
        const header = separatorLines(Array.from(doc.querySelectorAll(`${grid} .slick-header-column`)));
        const body = separatorLines(Array.from(doc.querySelectorAll(`${grid} .grid-canvas .slick-row[data-row="1"] .slick-cell`)), '::after');
        expect(body.length, `${state}: the body draws separators`).to.be.greaterThan(0);
        expect(header.length, `${state}: the header draws as many separators as the body`).to.eq(body.length);
        header.forEach((x, i) => expect(x, `${state}: header separator ${i + 1} lines up with the body`).to.be.closeTo(body[i], 2));
      });

    expectHeaderMatchesBody('before scrolling');

    // The sticky column docks inside the pinned pair: the body shows both edges, so the header must too.
    scrollToEnd();
    cy.get(`${grid} .slick-header-column[data-id="priority"]`).should('have.class', 'slick-column-sticky');
    expectHeaderMatchesBody('with the sticky column docked');
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

  it('draws a colspan crossing the pinned boundary as one cell', () => {
    // Row 2 carries a colspan of 3 starting at the first column, which is pinned, so the
    // span is split into a host and one continuation on either side of the boundary.
    const host = `${grid} .slick-row[data-row="2"] > .slick-pinned-left-cells > .slick-cell-colspan-crossing-docking:not(.slick-cell-colspan-part)`;
    const part = `${grid} .slick-row[data-row="2"] > .slick-scrolling-cells > .slick-cell-colspan-part`;

    cy.get(host).should('have.length', 1);
    cy.get(part).should('have.length', 1);

    // The leading band is the right edge, so the continuation is drawn to the LEFT of the
    // host and the two meet exactly.
    cy.get(host).then(($host) => {
      const hostRect = $host[0].getBoundingClientRect();
      cy.get(part).then(($part) => {
        const partRect = $part[0].getBoundingClientRect();
        expect(partRect.right, 'the continuation meets the host at the pinned edge').to.be.closeTo(hostRect.left, 1.5);
        expect(partRect.left, 'and extends further into the scrolling band').to.be.lessThan(hostRect.left);
      });
    });

    // The shared edge is the continuation's in a right-to-left grid, because a cell's
    // separator is drawn on its right in both directions.
    cy.get(host).should('not.have.class', 'slick-cell-colspan-shared-edge');
    cy.get(part).should('have.class', 'slick-cell-colspan-shared-edge');

    // The continuation carries a copy of the host's content, so the text reads as one cell.
    cy.get(host).then(($host) => {
      cy.get(part).find('.slick-cell-colspan-part-content').should(($content) => {
        expect($content[0].textContent).to.eq($host[0].textContent);
      });
    });

    // Clicking either half reports the same single cell.
    cy.window().then((win: any) => {
      win.__clicks = [];
      win.grid.onClick.subscribe((_e: any, args: any) => win.__clicks.push({ row: args.row, cell: args.cell }));
    });
    cy.get(part).click({ scrollBehavior: false });
    cy.get(host).click({ scrollBehavior: false });
    cy.window().should((win: any) => {
      expect(win.__clicks).to.have.length(2);
      expect(win.__clicks[0]).to.deep.eq({ row: 2, cell: 0 });
      expect(win.__clicks[1]).to.deep.eq({ row: 2, cell: 0 });
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
