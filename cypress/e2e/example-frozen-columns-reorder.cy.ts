import { createDragLikeEvent, pressPointer, releasePointer } from '../support/drag';

// Characterization tests for header column reordering on a frozen-columns grid (currently SortableJS).
// These specs pin down the observable behavior that must survive the SortableJS removal refactor:
// they are expected to pass identically before and after the drag engine is replaced.
describe('Example - Frozen Columns - Column Header Reorder (characterization)', { retries: 1 }, () => {
  const LEFT_HEADERS = '#myGrid .slick-header-columns-left';
  const RIGHT_HEADERS = '#myGrid .slick-header-columns-right';
  const RIGHT_VIEWPORT = '#myGrid .slick-viewport-top.slick-viewport-right';

  const initialLeftTitles = ['#', 'Title', 'Duration'];
  const initialRightTitles = ['% Complete', 'Start', 'Finish', 'Effort Driven', 'Title1', 'Title2', 'Title3', 'Title4'];
  const initialIds = ['sel', 'title', 'duration', '%', 'start', 'finish', 'effort-driven', 'title1', 'title2', 'title3', 'title4'];

  const expectHeaderTitles = (containerSelector: string, titles: string[]) => {
    cy.get(containerSelector)
      .children()
      .should('have.length', titles.length)
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  };

  const expectColumnIds = (ids: string[]) => {
    cy.window().then((win: any) => {
      expect(win.grid.getColumns().map((c: any) => c.id)).to.deep.eq(ids);
    });
  };

  const expectReorderCallCount = (count: number) => {
    cy.window().its('columnsReorderedCalls').should('have.length', count);
  };

  const getRightHeader = (win: any, title: string): HTMLElement => {
    const headers = Array.from(win.document.querySelectorAll(`${RIGHT_HEADERS} .slick-header-column`)) as HTMLElement[];
    return headers.find((el) => (el.textContent ?? '').includes(title)) as HTMLElement;
  };

  it('should load the example and have the expected initial column order on both sides of the frozen boundary', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns.html`);
    expectHeaderTitles(LEFT_HEADERS, initialLeftTitles);
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(initialIds);

    // record every onColumnsReordered payload so specs can assert exactly when and with what the event fires
    cy.window().then((win: any) => {
      win.columnsReorderedCalls = [];
      win.grid.onColumnsReordered.subscribe((_e: any, args: any) => {
        win.columnsReorderedCalls.push({
          impactedColumnIds: args.impactedColumns.map((c: any) => c.id),
          previousColumnOrder: [...args.previousColumnOrder],
        });
      });
    });
  });

  it('should reorder columns within the frozen (left) section', () => {
    cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Duration').then(($target) => {
      cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Title').drag($target);
    });

    expectHeaderTitles(LEFT_HEADERS, ['#', 'Duration', 'Title']);
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(['sel', 'duration', 'title', '%', 'start', 'finish', 'effort-driven', 'title1', 'title2', 'title3', 'title4']);

    expectReorderCallCount(1);
    cy.window().then((win: any) => {
      expect(win.columnsReorderedCalls[0].previousColumnOrder).to.deep.eq(initialIds);
    });

    // drag back (leftward) to restore the initial order
    cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Duration').then(($target) => {
      cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Title').drag($target);
    });
    expectHeaderTitles(LEFT_HEADERS, initialLeftTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(2);
  });

  it('should reorder columns within the non-frozen (right) section and re-render the data cells accordingly', () => {
    cy.get('#myGrid .grid-canvas-right [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', '01/01/2009'); // Start
    cy.get('#myGrid .grid-canvas-right [style*="top: 0px;"] > .slick-cell:nth(2)').should('contain', '01/05/2009'); // Finish

    cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Finish').then(($target) => {
      cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Start').drag($target);
    });

    expectHeaderTitles(RIGHT_HEADERS, ['% Complete', 'Finish', 'Start', 'Effort Driven', 'Title1', 'Title2', 'Title3', 'Title4']);
    expectHeaderTitles(LEFT_HEADERS, initialLeftTitles);
    expectColumnIds(['sel', 'title', 'duration', '%', 'finish', 'start', 'effort-driven', 'title1', 'title2', 'title3', 'title4']);

    cy.get('#myGrid .grid-canvas-right [style*="top: 0px;"] > .slick-cell:nth(1)').should('contain', '01/05/2009'); // Finish now first
    cy.get('#myGrid .grid-canvas-right [style*="top: 0px;"] > .slick-cell:nth(2)').should('contain', '01/01/2009'); // Start now second

    expectReorderCallCount(3);

    // drag back (leftward) to restore the initial order
    cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Finish').then(($target) => {
      cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Start').drag($target);
    });
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(4);
  });

  it('should NOT allow dragging a frozen (left) column into the non-frozen (right) section', () => {
    cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Start').then(($target) => {
      cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Duration').drag($target);
    });

    expectHeaderTitles(LEFT_HEADERS, initialLeftTitles);
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(4);
  });

  it('should NOT allow dragging a non-frozen (right) column into the frozen (left) section', () => {
    cy.contains(`${LEFT_HEADERS} .slick-header-column`, 'Title').then(($target) => {
      cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Start').drag($target);
    });

    expectHeaderTitles(LEFT_HEADERS, initialLeftTitles);
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(4);
  });

  it('should keep the horizontal scroll position after reordering columns in the scrolled right section', () => {
    cy.get(RIGHT_VIEWPORT).scrollTo(300, 0, { ensureScrollable: false });
    cy.wait(50);
    cy.get(RIGHT_VIEWPORT).should(($v) => expect($v[0].scrollLeft).to.be.closeTo(300, 2));

    cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Title3').then(($target) => {
      cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Title2').drag($target);
    });

    expectHeaderTitles(RIGHT_HEADERS, ['% Complete', 'Start', 'Finish', 'Effort Driven', 'Title1', 'Title3', 'Title2', 'Title4']);
    expectReorderCallCount(5);

    // without the scroll restore, setColumns() would reset the viewport back to x=0
    cy.get(RIGHT_VIEWPORT).should(($v) => expect($v[0].scrollLeft).to.be.closeTo(300, 2));

    // restore order and scroll position
    cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Title3').then(($target) => {
      cy.contains(`${RIGHT_HEADERS} .slick-header-column`, 'Title2').drag($target);
    });
    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectReorderCallCount(6);
    cy.get(RIGHT_VIEWPORT).scrollTo(0, 0, { ensureScrollable: false });
  });

  it('should auto-scroll the right viewport when a header drag starts beyond the right edge of the grid', () => {
    cy.get(RIGHT_VIEWPORT).scrollTo(0, 0, { ensureScrollable: false });
    cy.wait(50);
    cy.get(RIGHT_VIEWPORT).should(($v) => expect($v[0].scrollLeft).to.eq(0));

    // start a drag on "Finish" with the pointer already past the grid's right edge, then also fire a
    // document-level `drag` event at those coordinates (that is what a real browser does continuously
    // during a native drag, and what the future native reorder engine listens to for auto-scrolling)
    cy.window().then((win: any) => {
      const finishHeader = getRightHeader(win, 'Finish');
      expect(finishHeader).to.exist;
      const rect = finishHeader.getBoundingClientRect();
      const sy = rect.top + rect.height / 2;
      const dragX = (win.document.querySelector('#myGrid') as HTMLElement).clientWidth + 100;
      const dataTransfer = new DataTransfer();

      pressPointer(finishHeader, rect.left + rect.width / 2, sy);
      finishHeader.dispatchEvent(createDragLikeEvent('dragstart', dragX, sy, dataTransfer));
      win.document.dispatchEvent(createDragLikeEvent('drag', dragX, sy, dataTransfer));
    });

    cy.wait(250);
    cy.window().then((win: any) => {
      const finishHeader = getRightHeader(win, 'Finish');
      const sy = finishHeader.getBoundingClientRect().top;
      const dragX = (win.document.querySelector('#myGrid') as HTMLElement).clientWidth + 100;
      win.document.dispatchEvent(createDragLikeEvent('drag', dragX, sy, new DataTransfer()));
    });
    cy.wait(250);

    cy.get(RIGHT_VIEWPORT).should(($v) => expect($v[0].scrollLeft).to.be.greaterThan(10));

    // end the drag on the source itself: no reorder, and the auto-scroll must stop
    cy.window().then((win: any) => {
      const finishHeader = getRightHeader(win, 'Finish');
      const rect = finishHeader.getBoundingClientRect();
      const sy = rect.top + rect.height / 2;
      const dragX = (win.document.querySelector('#myGrid') as HTMLElement).clientWidth + 100;
      finishHeader.dispatchEvent(createDragLikeEvent('dragend', dragX, sy, new DataTransfer()));
      releasePointer(finishHeader, dragX, sy);
    });

    cy.get(RIGHT_VIEWPORT).then(($v) => {
      const scrollLeftAfterDrop = $v[0].scrollLeft;
      cy.wait(300);
      cy.get(RIGHT_VIEWPORT).should(($v2) => expect($v2[0].scrollLeft).to.eq(scrollLeftAfterDrop));
    });

    expectHeaderTitles(RIGHT_HEADERS, initialRightTitles);
    expectColumnIds(initialIds);
    expectReorderCallCount(6);

    cy.get(RIGHT_VIEWPORT).scrollTo(0, 0, { ensureScrollable: false });
  });
});
