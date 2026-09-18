import { getScrollDistanceWhenDragOutsideGrid } from '../support/drag';

describe('Example - Auto scroll when dragging', { retries: 1 }, () => {
  const cellWidth = 80;
  const cellHeight = 25;
  const scrollbarDimension = 17;

  const fullTitles = ['#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Cost', 'Effort Driven'];

  for (let i = 0; i < 30; i++) {
    fullTitles.push('Mock' + i);
  }

  function ensurePinningEnabled() {
    cy.get('#myGrid').then(($grid) => {
      if (!$grid.find('.slick-header-column.slick-column-pinned-left').length) {
        cy.get('#togglePinning').click();
      }
    });
  }

  function ensureGroupingEnabled() {
    cy.get('#myGrid').then(($grid) => {
      if (!$grid.find('.slick-group').length) {
        cy.get('#toggleGroup').click();
      }
    });
  }

  function clearPinning() {
    cy.get('#myGrid').then(($grid) => {
      if ($grid.find('.slick-header-column.slick-column-pinned-left').length) {
        cy.get('#togglePinning').click();
      }
    });
  }

  function clearGrouping() {
    cy.get('#myGrid').then(($grid) => {
      if ($grid.find('.slick-group').length) {
        cy.get('#toggleGroup').click();
      }
    });
  }

  beforeEach(() => {
    // add a serve mode to avoid adding the GitHub Stars link since that can slowdown Cypress considerably
    // because it keeps waiting for it to load, we also preserve the cookie for all other tests
    cy.setCookie('serve-mode', 'cypress');

    // create a console.log spy for later use
    cy.window().then((win) => cy.spy(win.console, 'log'));
  });

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-auto-scroll-when-dragging.html`);
  });

  it('should have exact column titles on grid', () => {
    [ '#myGrid', '#myGrid2' ].forEach((selector) => {
      cy.get(`${selector} .slick-header-column .slick-column-name`).then(($headers) => {
        expect([...$headers].map((header) => header.textContent?.trim())).to.deep.equal(fullTitles);
      });
    });
  });

  it('should select border shown in cell selection model, and hidden in row selection model when dragging', { scrollBehavior: false }, function () {
    cy.getNthCell(0, 1, '', { parentSelector: '#myGrid', rowHeight: cellHeight })
      .as('cell1')
      .dragStart();

    cy.get('#myGrid .slick-range-decorator').should('be.exist').and('have.css', 'border-color').and('not.equal', 'none');
    cy.get('@cell1')
      .dragCell(0, 5)
      .dragEnd('#myGrid');
    cy.get('#myGrid .slick-range-decorator').should('not.be.exist');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 6);

    cy.getNthCell(0, 1, '', { parentSelector: '#myGrid2', rowHeight: cellHeight })
      .as('cell2')
      .dragStart();
    cy.get('#myGrid2 .slick-range-decorator').should('be.exist').and('have.css', 'border-style').and('equal', 'none');
    cy.get('@cell2')
      .dragCell(5, 1)
      .dragEnd('#myGrid2');
    cy.get('#myGrid2 .slick-range-decorator').should('not.be.exist');
    // Row selection applies `selected` to every selectable cell in each selected
    // row, so the cell count is the number of selected rows multiplied by the
    // number of selectable columns. Assert the selected row identities instead.
    cy.get('#myGrid2 .slick-row[data-row]').then(($rows) => {
      const selectedRows = [...$rows]
        .filter((row) => row.querySelector('.slick-cell.selected'))
        .map((row) => row.getAttribute('data-row'));
      expect(selectedRows).to.have.length(6);
      expect(selectedRows).to.include.members(['0', '1', '2', '3', '4', '5']);
    });
  });

  function testScroll() {
    return getScrollDistanceWhenDragOutsideGrid('#myGrid', 'topLeft', 'right', 0, 1).then((cellScrollDistance: any) => {
      return getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'topLeft', 'bottom', 0, 1).then((rowScrollDistance: any) => {
        return cy.wrap({
          cell: {
            scrollBefore: cellScrollDistance.scrollLeftBefore,
            scrollAfter: cellScrollDistance.scrollLeftAfter
          },
          row: {
            scrollBefore: rowScrollDistance.scrollTopBefore,
            scrollAfter: rowScrollDistance.scrollTopAfter
          }
        });
      });
    });
  }

  it('should auto scroll take effect to display the selecting element when dragging', { scrollBehavior: false }, function () {
    testScroll().then((scrollDistance: any) => {
      expect(scrollDistance.cell.scrollBefore).to.be.lessThan(scrollDistance.cell.scrollAfter);
      expect(scrollDistance.row.scrollBefore).to.be.lessThan(scrollDistance.row.scrollAfter);
    });

    cy.get('#isAutoScroll').click();
    cy.get('#setOptions').click();

    testScroll().then((scrollDistance: any) => {
      expect(scrollDistance.cell.scrollBefore).to.be.equal(scrollDistance.cell.scrollAfter);
      expect(scrollDistance.row.scrollBefore).to.be.equal(scrollDistance.row.scrollAfter);
    });

    cy.get('#setDefaultOption').click();
    cy.get('#isAutoScroll').should('have.value', 'on');
  });

  function getIntervalUntilRow16Displayed(selector: string, px: number) {
    const viewportSelector = `${selector} .slick-vertical-scroller`;
    cy.getNthCell(0, 1, '', { parentSelector: selector, rowHeight: cellHeight })
      .dragStart();
    return cy.get(viewportSelector).invoke('scrollTop').then((scrollBefore: any) => {
      return cy.dragOutside('bottom', 0, px, { parentSelector: selector, rowHeight: cellHeight }).then(() => {
        const start = performance.now();
        return cy.get(viewportSelector).should($viewport => {
          expect($viewport[0].scrollTop).to.be.greaterThan(scrollBefore);
        }).then(() => cy.get(viewportSelector).invoke('scrollTop')).then((scrollAfter: any) => {
          return cy.dragEnd(selector).then(() => {
            const interval = performance.now() - start;
            expect(scrollBefore).to.be.lessThan(scrollAfter);
            cy.get(viewportSelector).scrollTo(0, 0, { ensureScrollable: false });
            return cy.wrap(interval);
          });
        });
      });
    });
  }

  function testInterval(px: number) {
    return getIntervalUntilRow16Displayed('#myGrid', px).then((intervalCell: any) => {
      return getIntervalUntilRow16Displayed('#myGrid2', px).then((intervalRow: any) => {
        return cy.wrap({
          cell: intervalCell,
          row: intervalRow
        });
      });
    });
  }

  it('should MIN interval take effect when auto scroll: 30ms -> 90ms', { scrollBehavior: false }, function () {
    // By default the MIN interval to show next cell is 30ms.
    testInterval(300).then(defaultInterval => {

      // Setting the interval to 90ms (3 times of the default).
      cy.get('#minIntervalToShowNextCell').type('{selectall}90'); // 30ms -> 90ms
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row by MIN interval, the used time should be 3 times slower than default.
      // Considering the threshold, 1.5 times slower than default is expected
      testInterval(300).then(newInterval => {

        // max scrolling speed is slower than before
        expect(newInterval.cell).to.be.greaterThan(1.5 * defaultInterval.cell);
        expect(newInterval.row).to.be.greaterThan(1.5 * defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#minIntervalToShowNextCell').should('have.value', '30');
      });
    });
  });

  it.skip('should MAX interval take effect when auto scroll: 600ms -> 200ms', { scrollBehavior: false }, function () {
    // By default the MAX interval to show next cell is 600ms.
    testInterval(0).then(defaultInterval => {

      // Setting the interval to 200ms (1/3 of the default).
      cy.get('#maxIntervalToShowNextCell').type('{selectall}200'); // 600ms -> 200ms
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row by MAX interval, the used time should be 3 times faster than default.
      // Considering the threshold, 1.5 times faster than default is expected
      testInterval(0).then(newInterval => {

        // min scrolling speed is quicker than before
        expect(1.5 * newInterval.cell).to.be.lessThan(defaultInterval.cell);
        expect(1.5 * newInterval.row).to.be.lessThan(defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#maxIntervalToShowNextCell').should('have.value', '600');
      });
    });
  });

  it('should Delay per Px take effect when auto scroll: 5ms/px -> 50ms/px', { scrollBehavior: false }, function () {
    const allowedDiff = 0.5;

    // By default the Delay per Px is 5ms/px.
    testInterval(scrollbarDimension).then(defaultInterval => {

      // Setting to 50ms/px (10 times of the default).
      cy.get('#accelerateInterval').type('{selectall}50'); // 5ms/px -> 50ms/px
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row, and set cursor to 17px, the new interval will be set to MIN interval (Math.max(30, 600 - 50 * 17) = 30ms),
      // and the used time should be around 17 times faster than default.
      // Considering the threshold, 5 times faster than default is expected
      testInterval(scrollbarDimension).then(newInterval => {

        // scrolling speed is quicker than before
        expect((5 - allowedDiff) * newInterval.cell).to.be.lessThan(defaultInterval.cell);
        expect((5 - allowedDiff) * newInterval.row).to.be.lessThan(defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#accelerateInterval').should('have.value', '5');
      });
    });
  });

  it('should pin columns and rows after clicking Set/Clear Pinning', () => {
    [ '#myGrid', '#myGrid2' ].forEach((selector) => {
      cy.get(`${selector} .slick-docking-overlay`).should('exist');
      cy.get(`${selector} .slick-docking-overlay .slick-row[data-row="0"]`).should('not.exist');
    });

    cy.get('#togglePinning').click();

    [ '#myGrid', '#myGrid2' ].forEach((selector) => {
      cy.get(`${selector} .slick-docking-overlay`).should('exist');
      cy.get(`${selector} .slick-docking-overlay .slick-row[data-row="0"]`).should('exist');
      cy.get(`${selector} .slick-header-column.slick-column-pinned-left`).should('have.length', 2);
    });
  });

  function resetScrollInPinned() {
    [ '#myGrid', '#myGrid2' ].forEach((selector) => {
      cy.get(`${selector} .slick-horizontal-scroller`).scrollTo(0, 0, { ensureScrollable: false });
      cy.get(`${selector} .slick-vertical-scroller`).scrollTo(0, 0, { ensureScrollable: false });
    });
  }

  it('should auto scroll to display the selecting element when dragging in pinned grid', { scrollBehavior: false }, () => {
    ensurePinningEnabled();

    // top left - to bottomRight
    getScrollDistanceWhenDragOutsideGrid('#myGrid', 'topLeft', 'bottomRight', 0, 1).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'topLeft', 'bottomRight', 0, 1).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });

    // The unified docking canvas has no separate top-right pane. Start from
    // Duration (the first selectable center column), not column 0, which is
    // the non-selectable pinned row-number cell.
    // top right - to bottomRight
    getScrollDistanceWhenDragOutsideGrid('#myGrid', 'topRight', 'bottomRight', 0, 2).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'topRight', 'bottomRight', 0, 2).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    resetScrollInPinned();

    // bottom left - to bottomRight
    getScrollDistanceWhenDragOutsideGrid('#myGrid', 'bottomLeft', 'bottomRight', 0, 1).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'bottomLeft', 'bottomRight', 0, 1).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    resetScrollInPinned();

    // bottom right - to bottomRight
    getScrollDistanceWhenDragOutsideGrid('#myGrid', 'bottomRight', 'bottomRight', 0, 2).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'bottomRight', 'bottomRight', 0, 2).then((result: any) => {
      expect(result.scrollTopBefore).to.be.lte(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    resetScrollInPinned();
    cy.get('#myGrid .slick-horizontal-scroller').scrollTo(cellWidth * 3, 0);
    cy.get('#myGrid .slick-vertical-scroller').scrollTo(0, cellHeight * 3);
    cy.get('#myGrid2 .slick-horizontal-scroller').scrollTo(cellWidth * 3, 0);
    cy.get('#myGrid2 .slick-vertical-scroller').scrollTo(0, cellHeight * 3);

    // bottom right - to topLeft
    getScrollDistanceWhenDragOutsideGrid('#myGrid', 'bottomRight', 'topLeft', 8, 4, 100).then((result: any) => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
    });
    getScrollDistanceWhenDragOutsideGrid('#myGrid2', 'bottomRight', 'topLeft', 8, 4, 100).then((result: any) => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
    });
    resetScrollInPinned();
  });

  it('should have a pinned & grouping by Duration grid after click Set/Clear grouping by Duration button', { scrollBehavior: false }, () => {
    ensurePinningEnabled();
    ensureGroupingEnabled();
    cy.get('#myGrid .slick-group').contains('Duration');
    cy.get('#myGrid2 .slick-group').contains('Duration');
  });

  function testDragInGrouping(selector: string) {
    // In the old bottom-right layout, nth column 0 resolved past the pinned
    // control column. The unified canvas exposes that non-selectable control
    // column as index 0, so use Duration (index 2) in a data row instead.
    cy.getNthCell(7, 2, 'bottomRight', { parentSelector: selector, rowHeight: cellHeight })
      .dragStart();
    return cy.get(selector + ' .slick-vertical-scroller').as('viewport').invoke('scrollTop').then(scrollBefore => {
      return cy.dragOutside('bottom', 400, 300, { parentSelector: selector, rowHeight: cellHeight }).then(() => {
        return cy.get('@viewport').invoke('scrollTop').then(scrollAfter => {
          expect(scrollBefore).to.be.lessThan(scrollAfter);
          return cy.dragEnd(selector).then(() => {
            cy.get(selector + ' .slick-group:visible').should('exist');
          });
        });
      });
    });
  }

  it('should auto scroll to display the selecting element even unselectable cell exist in grouping grid', { scrollBehavior: false }, () => {
    testDragInGrouping('#myGrid');
    testDragInGrouping('#myGrid2');
  });

  it('should reset to default grid when clearing pinning and grouping', () => {
    clearPinning();
    clearGrouping();
    cy.get('#myGrid .slick-docking-overlay .slick-row').should('not.exist');
    cy.get('#myGrid2 .slick-docking-overlay .slick-row').should('not.exist');
    cy.get('#myGrid .slick-header-column.slick-column-pinned-left').should('not.exist');
    cy.get('#myGrid2 .slick-header-column.slick-column-pinned-left').should('not.exist');
  });

  describe('Pinned Columns', () => {
    it('should set 3 pinned columns in first grid', () => {
      cy.get('#pinned-column-boundary').clear().type('3');
      cy.get('[data-test="set-pinned-columns-btn"]').click();

      cy.get('#myGrid .slick-header-column.slick-column-pinned-left').should('have.length', 4);
      cy.get('#myGrid .slick-header-column:not(.slick-column-pinned-left)').should('have.length', 34);
    });

    it('should reject a pinned-column boundary wider than the available grid', () => {
      const stub = cy.stub();
      cy.on('window:alert', stub);
      cy.get('#pinned-column-boundary').clear().type('12');
      cy.get('[data-test="set-pinned-columns-btn"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(
            '[SlickGrid] Cannot pin these columns because they exceed the available grid width.'
          );

          // it should still have previous pinning
          cy.get('#myGrid .slick-header-column.slick-column-pinned-left').should('have.length', 4);
          cy.get('#myGrid .slick-header-column:not(.slick-column-pinned-left)').should('have.length', 34);
        });
    });
  });
});
