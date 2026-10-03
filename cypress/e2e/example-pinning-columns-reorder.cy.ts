import { createDragLikeEvent, createMouseLikeEvent, pressPointer, releasePointer } from '../support/drag';

// Characterization tests for column reordering on the persistent docking layout.
describe('Example - Pinning Columns - Column Header Reorder', { retries: 1 }, () => {
  const grid = '#myGrid';
  const leftHeaders = `${grid} .slick-header-columns-root > .slick-header-columns-left`;
  const centerHeaders = `${grid} .slick-header-columns-root > .slick-header-columns-center`;
  const horizontalScroller = `${grid} .slick-docking-horizontal-scroller`;
  const initialLeftTitles = ['#', 'Title', 'Duration'];
  const initialCenterTitles = ['% Complete', 'Start', 'Finish', 'Effort Driven', 'Title1', 'Title2', 'Title3', 'Title4'];
  const initialIds = ['sel', 'title', 'duration', '%', 'start', 'finish', 'effort-driven', 'title1', 'title2', 'title3', 'title4'];

  const expectHeaderTitles = (selector: string, titles: string[]) => {
    cy.get(selector)
      .find('.slick-header-column')
      .should('have.length', titles.length)
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  };

  const expectColumnIds = (ids: string[]) => {
    cy.window().then((win: any) => {
      expect(win.grid.getColumns().map((column: any) => column.id)).to.deep.equal(ids);
    });
  };

  const expectReorderCallCount = (count: number) => {
    cy.window().its('columnsReorderedCalls').should('have.length', count);
  };

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-pinning-columns.html`);
    cy.get(`${grid} .slick-viewport`).should('have.length', 1);
    cy.get(`${grid} > .slick-pane`).should('have.length', 0);

    cy.window().then((win: any) => {
      win.columnsReorderedCalls = [];
      win.grid.onColumnsReordered.subscribe((_e: any, args: any) => {
        win.columnsReorderedCalls.push({
          impactedColumnIds: args.impactedColumns.map((column: any) => column.id),
          previousColumnOrder: [...args.previousColumnOrder],
        });
      });
    });
  });

  it('renders the expected left pinned and center header bands', () => {
    expectHeaderTitles(leftHeaders, initialLeftTitles);
    expectHeaderTitles(centerHeaders, initialCenterTitles);
    expectColumnIds(initialIds);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-pinned-left-cells .slick-cell`).should('have.length', 3);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).should('have.length', 8);
  });

  it('reorders columns within the left pinned band', () => {
    cy.contains(`${leftHeaders} .slick-header-column`, 'Duration').then(($target) => {
      cy.contains(`${leftHeaders} .slick-header-column`, 'Title').drag($target);
    });

    expectHeaderTitles(leftHeaders, ['#', 'Duration', 'Title']);
    expectHeaderTitles(centerHeaders, initialCenterTitles);
    expectColumnIds(['sel', 'duration', 'title', '%', 'start', 'finish', 'effort-driven', 'title1', 'title2', 'title3', 'title4']);
    expectReorderCallCount(1);
  });

  it('reorders columns within the center band and updates the row cells', () => {
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).eq(1).should('contain', '01/01/2009');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).eq(2).should('contain', '01/05/2009');

    cy.contains(`${centerHeaders} .slick-header-column`, 'Finish').then(($target) => {
      cy.contains(`${centerHeaders} .slick-header-column`, 'Start').drag($target);
    });

    expectHeaderTitles(centerHeaders, ['% Complete', 'Finish', 'Start', 'Effort Driven', 'Title1', 'Title2', 'Title3', 'Title4']);
    expectHeaderTitles(leftHeaders, initialLeftTitles);
    expectColumnIds(['sel', 'title', 'duration', '%', 'finish', 'start', 'effort-driven', 'title1', 'title2', 'title3', 'title4']);
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).eq(1).should('contain', '01/05/2009');
    cy.get(`${grid} .grid-canvas > .slick-row[data-row="0"] > .slick-scrolling-cells .slick-cell`).eq(2).should('contain', '01/01/2009');
    expectReorderCallCount(1);
  });

  it('does not move a column across the pinned boundary', () => {
    cy.contains(`${centerHeaders} .slick-header-column`, 'Start').then(($target) => {
      cy.contains(`${leftHeaders} .slick-header-column`, 'Duration').drag($target);
    });
    cy.contains(`${leftHeaders} .slick-header-column`, 'Title').then(($target) => {
      cy.contains(`${centerHeaders} .slick-header-column`, 'Start').drag($target);
    });

    expectHeaderTitles(leftHeaders, initialLeftTitles);
    expectHeaderTitles(centerHeaders, initialCenterTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(0);
  });

  it('keeps the shared horizontal scroll position after center-band reordering', () => {
    cy.get(horizontalScroller).scrollTo(300, 0, { ensureScrollable: false });
    cy.get(horizontalScroller).should(($scroller) => expect($scroller[0].scrollLeft).to.be.closeTo(300, 2));

    cy.contains(`${centerHeaders} .slick-header-column`, 'Title3').then(($target) => {
      cy.contains(`${centerHeaders} .slick-header-column`, 'Title2').drag($target);
    });

    expectHeaderTitles(centerHeaders, ['% Complete', 'Start', 'Finish', 'Effort Driven', 'Title1', 'Title3', 'Title2', 'Title4']);
    cy.get(horizontalScroller).should(($scroller) => expect($scroller[0].scrollLeft).to.be.closeTo(300, 2));
    expectReorderCallCount(1);
  });

  it('follows a centre column that is resized past the right edge of the grid', () => {
    const headerSelector = `${centerHeaders} .slick-header-column:nth-child(2)`; // Start
    let originalWidth = 0;

    cy.window().then((win: any) => {
      const doc = win.document;
      const header = doc.querySelector(headerSelector) as HTMLElement;
      const handle = header.querySelector('.slick-resizable-handle') as HTMLElement;
      const scroller = doc.querySelector(horizontalScroller) as HTMLElement;
      const rect = handle.getBoundingClientRect();
      originalWidth = win.grid.getColumns().find((column: any) => column.id === 'start').width;

      // Drag well past the right edge: the width is clamped there and the auto-scroll
      // interval keeps widening the column from that point.
      handle.dispatchEvent(createMouseLikeEvent(win, 'mousedown', rect.left + rect.width / 2, rect.top + rect.height / 2));
      doc.body.dispatchEvent(
        createMouseLikeEvent(win, 'mousemove', scroller.getBoundingClientRect().right + 800, rect.top + rect.height / 2)
      );
    });

    cy.wait(400);

    // The grid scrolls to follow the column, so its trailing edge stays at the viewport
    // edge instead of running off screen.
    cy.get(horizontalScroller).should(($scroller) => expect($scroller[0].scrollLeft).to.be.greaterThan(0));
    cy.window().then((win: any) => {
      const header = win.document.querySelector(headerSelector) as HTMLElement;
      const scroller = win.document.querySelector(horizontalScroller) as HTMLElement;
      expect(header.getBoundingClientRect().width, 'the column kept growing').to.be.greaterThan(200);
      expect(header.getBoundingClientRect().right, 'the resize edge stays in view').to.be.closeTo(
        scroller.getBoundingClientRect().right,
        3
      );
    });

    // Releasing the pointer stops the auto-scroll.
    cy.window().then((win: any) => {
      win.document.body.dispatchEvent(createMouseLikeEvent(win, 'mouseup', 0, 0, 0));
    });
    cy.get(horizontalScroller).then(($scroller) => {
      const settled = $scroller[0].scrollLeft;
      cy.wait(200);
      cy.get(horizontalScroller).should(($again) => expect($again[0].scrollLeft).to.eq(settled));
    });

    // restore the column so the following specs see the original layout
    cy.window().then((win: any) => {
      const columns = win.grid.getColumns();
      columns.find((column: any) => column.id === 'start').width = originalWidth;
      win.grid.setColumns(columns);
      win.grid.scrollToX(0);
    });
  });

  it('auto-scrolls the center band when a header drag moves past the right edge of the grid', () => {
    const getCenterHeader = (win: any, title: string): HTMLElement => {
      const headers = Array.from(win.document.querySelectorAll(`${centerHeaders} .slick-header-column`)) as HTMLElement[];
      return headers.find((element) => (element.textContent ?? '').includes(title)) as HTMLElement;
    };
    cy.get(horizontalScroller).should(($scroller) => expect($scroller[0].scrollLeft).to.eq(0));

    // start the drag inside the grid, then move past its right edge through document-level drag events
    cy.window().then((win: any) => {
      const finishHeader = getCenterHeader(win, 'Finish');
      expect(finishHeader).to.exist;
      const rect = finishHeader.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      pressPointer(finishHeader, startX, startY);
      finishHeader.dispatchEvent(createDragLikeEvent('dragstart', startX, startY, new DataTransfer()));
    });

    // SortableJS dispatches its start callback on the next macrotask; yield so the grid can bind
    // its document-level auto-scroll listeners before the pointer moves outside
    cy.wait(50);
    cy.window().then((win: any) => {
      const finishHeader = getCenterHeader(win, 'Finish');
      const rect = finishHeader.getBoundingClientRect();
      const gridRect = (win.document.querySelector(grid) as HTMLElement).getBoundingClientRect();
      const dragY = rect.top + rect.height / 2;
      const dragX = gridRect.right + 100;
      win.document.dispatchEvent(createDragLikeEvent('drag', dragX, dragY, new DataTransfer()));
      win.document.dispatchEvent(createMouseLikeEvent(win, 'mousemove', dragX, dragY));
    });
    cy.wait(250);

    // back inside the grid the auto-scroll stops and the position holds
    cy.window().then((win: any) => {
      const finishHeader = getCenterHeader(win, 'Finish');
      const rect = finishHeader.getBoundingClientRect();
      const scrollerRect = (win.document.querySelector(horizontalScroller) as HTMLElement).getBoundingClientRect();
      const dragY = rect.top + rect.height / 2;
      const safeX = scrollerRect.left + scrollerRect.width / 2;
      win.document.dispatchEvent(createDragLikeEvent('drag', safeX, dragY, new DataTransfer()));
      win.document.dispatchEvent(createMouseLikeEvent(win, 'mousemove', safeX, dragY));
    });
    cy.get(horizontalScroller).then(($scroller) => {
      expect($scroller[0].scrollLeft).to.be.greaterThan(10);
      const scrollLeftAfterSafeZone = $scroller[0].scrollLeft;
      cy.wait(250);
      cy.get(horizontalScroller).should(($again) => expect($again[0].scrollLeft).to.eq(scrollLeftAfterSafeZone));
    });

    // ending the drag on the source itself reorders nothing and leaves the auto-scroll stopped
    cy.window().then((win: any) => {
      const finishHeader = getCenterHeader(win, 'Finish');
      const rect = finishHeader.getBoundingClientRect();
      const dropY = rect.top + rect.height / 2;
      const safeX = rect.left + rect.width / 2;
      finishHeader.dispatchEvent(createDragLikeEvent('dragend', safeX, dropY, new DataTransfer()));
      releasePointer(finishHeader, safeX, dropY);
    });
    expectHeaderTitles(centerHeaders, initialCenterTitles);
    expectReorderCallCount(0);
  });
});
