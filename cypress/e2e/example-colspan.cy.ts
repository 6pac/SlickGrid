import { createMouseLikeEvent } from '../support/drag';

describe('Example - Column Span & Header Grouping', { retries: 1 }, () => {
  const fullPreTitles = ['Common Factor', 'Period', 'Analysis'];
  const fullTitles = ['Title', 'Duration', 'Start', 'Finish', '% Complete', 'Effort Driven'];

  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-colspan.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('column span');
  });

  it('should have exact Column Pre-Header & Column Header Titles in the grid', () => {
    cy.get('.slick-header-columns:nth(0)')
      .children('.slick-header-column')
      .each(($child, index) => expect($child.text()).to.eq(fullPreTitles[index]));

    cy.get('.slick-header-columns:nth(1)')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should expect 1st row to be 1 column spanned to the entire width', () => {
    cy.get('[data-row=0] > .slick-cell:nth(0)').should('contain', 'Task 0');
    cy.get('[data-row=0] > .slick-cell.l0.r5').should('exist');
    cy.get('[data-row=0] > .slick-cell:nth(1)').should('not.exist');
  });

  it('should expect 2nd row to be 4 columns and not be spanned', () => {
    cy.get('[data-row=1] > .slick-cell:nth(0)').should('contain', 'Task 1');
    cy.get('[data-row=1] > .slick-cell.l0.r0').should('exist');
    cy.get('[data-row=1] > .slick-cell:nth(1)').should('contain', '5 days');
    cy.get('[data-row=1] > .slick-cell:nth(1).l1.r3').should('exist');
    cy.get('[data-row=1] > .slick-cell:nth(2)').contains(/\d+$/);
    cy.get('[data-row=1] > .slick-cell:nth(3)').contains(/(true|false)/);
  });

  it('should expect 3rd row to be 1 column spanned to the entire width', () => {
    cy.get('[data-row=2] > .slick-cell:nth(0)').should('contain', 'Task 2');
    cy.get('[data-row=2] > .slick-cell.l0.r5').should('exist');
    cy.get('[data-row=2] > .slick-cell:nth(1)').should('not.exist');
  });

  it('should expect 4th row to contain the Duration colspan followed by the analysis columns', () => {
    cy.get('[data-row=3] > .slick-cell:nth(0)').should('contain', 'Task 3');
    cy.get('[data-row=3] > .slick-cell:nth(1)').should('contain', '5 days');
    cy.get('[data-row=3] > .slick-cell:nth(2)').contains(/\d+$/);
    cy.get('[data-row=3] > .slick-cell:nth(3)').contains(/(true|false)/);
  });

  it('should hide Finish while keeping it in getColumns and preserve the original colspan indexes', () => {
    cy.get('[data-test="hide-finish-column"]').click();
    cy.get('#myGrid .slick-header-columns-left > .slick-header-column').should('have.length', 5);
    cy.get('[data-row=1] > .slick-cell.l1.r3').should('contain', '5 days');
    cy.get('[data-row=1] > .slick-cell.l4.r4').contains(/\d+$/);
    cy.get('[data-row=1] > .slick-cell.l5.r5').contains(/(true|false)/);
    cy.get('[data-test="hide-finish-column"]').click();
  });

  it('should spread Duration colspan across hidden columns when enabled', () => {
    cy.get('[data-test="hide-finish-column"]').click();
    cy.get('[data-test="spread-colspan-button"]').click();
    cy.get('[data-row=1] > .slick-cell.l1.r4').should('contain', '5 days');
    cy.get('[data-test="spread-colspan-button"]').click();
    cy.get('[data-test="hide-finish-column"]').click();
  });

  describe('Basic Key Navigations', () => {
    const colspanCellSelector = (row: number) => row % 2 === 0 ? '.slick-cell.l0.r5' : '.slick-cell.l1.r3';

    const getPageRow = (pageCount: number) => cy.window().then((win) => {
      const grid = (win as any).grid;
      return 1 + pageCount * grid.numVisibleRows;
    });

    it('should move one computed page down from Task 1 and preserve the target row colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}');
      getPageRow(1).then((expectedRow) => {
        cy.get(`[data-row=${expectedRow}] > ${colspanCellSelector(expectedRow)}.active`).should('have.length', 1);
      });
    });

    it('should move two computed pages down from Task 1 and preserve the target row colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}');
      getPageRow(2).then((expectedRow) => {
        cy.get(`[data-row=${expectedRow}] > ${colspanCellSelector(expectedRow)}.active`).should('have.length', 1);
      });
    });

    it('should move two computed pages up and return to Task 1', () => {
      getPageRow(2).then((startRow) => {
        cy.get(`[data-row=${startRow}] > ${colspanCellSelector(startRow)}`).as('active_cell').click();
      });
      cy.get('@active_cell').type('{pageup}{pageup}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 2 on Duration colspan 5 days and type "PageDown" key 2x times and "PageUp" twice and be back to Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pageup}{pageup}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 2 on Duration colspan 5 days and type "PageDown" key 2x times and "PageUp" 3x times and be on Task 0 with full colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pageup}{pageup}{pageup}');
      cy.get('[data-row=0] > .slick-cell.l0.r5.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key once and be on Task 2 with full colspan', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}');
      cy.get('[data-row=2] > .slick-cell.l0.r5.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key 2x times and be on Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}{downarrow}');
      cy.get('[data-row=3] > .slick-cell.l1.r3.active').should('have.length', 1);
    });

    it('should start at Task 1 on Duration colspan 5 days and type "ArrowDown" key 2x times, then "ArrowUp" key 2x times and be back on Task 1 with colspan of 3', () => {
      cy.get('[data-row=1] > .slick-cell.l1.r3').as('active_cell').click();
      cy.get('@active_cell').type('{downarrow}{downarrow}{uparrow}{uparrow}');
      cy.get('[data-row=1] > .slick-cell.l1.r3.active').should('have.length', 1);
    });
  });

  describe('Pinned colspan rendering', () => {
    const hostSelector =
      '[data-row=1] > .slick-pinned-left-cells > .slick-cell-colspan-crossing-docking:not(.slick-cell-colspan-part)';
    const fragmentSelector = '[data-row=1] > .slick-scrolling-cells > .slick-cell-colspan-part';

    const applyPinning = () => {
      cy.get('#pinnedLeftColumns').clear().type('1');
      cy.get('#setPinning').click();
    };

    it('should render a colspan continuation across a pinned-column boundary', () => {
      cy.reload();
      applyPinning();

      cy.get(hostSelector)
        .should('exist')
        .then(($host) => {
          const host = $host[0].getBoundingClientRect();
          const leftRegion = $host[0].parentElement!.getBoundingClientRect();
          expect(host.right).to.be.greaterThan(leftRegion.right);
        });
      cy.get(fragmentSelector).should('have.length', 1);
    });

    it('should apply and clear the selection class on the colspan fragment together with its host', () => {
      cy.reload();
      applyPinning();

      cy.get(fragmentSelector).click({ force: true });
      cy.get(hostSelector).should('have.class', 'selected');
      cy.get(fragmentSelector).should('have.class', 'selected');

      cy.get('[data-row=3] > .slick-scrolling-cells > .slick-cell.l4').click({ force: true });
      cy.get(hostSelector).should('not.have.class', 'selected');
      cy.get(fragmentSelector).should('not.have.class', 'selected');
    });

    it('should keep the active colspan background continuous after resizing Start', () => {
      cy.reload();
      applyPinning();

      cy.get(fragmentSelector).click({ force: true });
      cy.get(hostSelector).should('have.class', 'active');
      cy.get(fragmentSelector).should('have.class', 'active').then(($fragment) => {
        const fragment = $fragment[0];
        const initialWidth = fragment.getBoundingClientRect().width;
        const fragmentActiveStyle = getComputedStyle(fragment, '::after');
        expect(getComputedStyle(fragment).boxShadow).to.eq('none');
        expect(fragmentActiveStyle.borderLeftStyle).to.eq('none');
        expect(fragmentActiveStyle.borderRightStyle).to.eq('solid');

        cy.get(hostSelector).should(($host) => {
          const hostActiveStyle = getComputedStyle($host[0], '::after');
          expect(getComputedStyle($host[0]).boxShadow).to.eq('none');
          expect(hostActiveStyle.borderLeftStyle).to.eq('solid');
          expect(hostActiveStyle.borderRightStyle).to.eq('solid');
        });

        cy.window().then((win) => {
          const grid = (win as any).grid;
          const header = grid.getHeaderColumn('start') as HTMLElement;
          const handle = header.querySelector('.slick-resizable-handle') as HTMLElement;
          const handleRect = handle.getBoundingClientRect();
          const startX = handleRect.left + handleRect.width / 2;
          const y = handleRect.top + handleRect.height / 2;
          const targetX = startX + 150;

          handle.dispatchEvent(createMouseLikeEvent(win, 'mousedown', startX, y));
          win.document.body.dispatchEvent(createMouseLikeEvent(win, 'mousemove', targetX, y));
          win.document.body.dispatchEvent(createMouseLikeEvent(win, 'mouseup', targetX, y, 0));
        });

        cy.get(hostSelector).should('have.class', 'active');
        cy.get(fragmentSelector)
          .should('have.class', 'active')
          .should(($resizedFragment) => {
            expect($resizedFragment[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth + 100);
          });
      });
    });
  });
});
