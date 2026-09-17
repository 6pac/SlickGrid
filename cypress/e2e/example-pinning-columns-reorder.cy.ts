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
});
