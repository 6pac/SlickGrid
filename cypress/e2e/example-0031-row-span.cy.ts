describe('Example - RowSpan', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];
  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-0031-row-span.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + p').contains('This page demonstrates rowspan using DataView with item metadata.');
  });

  it('should have exact column titles', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  describe('spanning', () => {
    it('should expect first 2 rows to be regular rows without any spanning', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 0');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(1)`).should('contain', '5 days');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(2)`).contains(/\d+$/); // use regexp to make sure it's a number

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 1');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(1)`).should('contain', '5 days');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(3)`).should('contain', '01/01/2009');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(5)`).contains(/(true|false)/);
    });

    it('should expect 3rd row first cell to span (rowspan) across 3 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0).rowspan`).should('contain', 'Task 2');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(1)`).should('contain', '5 days');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(3)`).should('contain', '01/01/2009');
    });

    it('should expect 3rd row "Start" column to span (colspan) across 2 columns', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(3)`).should('contain', '01/01/2009');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l3.r4`).should('exist');
    });

    it('should expect 4th row second cell to span (rowspan) across 5 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should('not.contain', 'Task 3');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(121));
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(1)`).should('not.contain', '5 days');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(3)`).should('not.contain', '01/01/2009');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(1)`).should('not.contain', '5 days');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell:nth(1)`).should('not.contain', '5 days');
    });

    it('should click on "Toggle blue cell colspan..." and expect colspan to widen from 1 column to 2 columns and from 5 rows to 3 rowspan', () => {
      cy.get('.slick-cell.l1.r1.rowspan').should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(121));

      cy.get('button#toggleSpans').click();
      cy.get('.slick-cell.l1.r1.rowspan').should('not.exist');
      cy.get('.slick-cell.l1.r2.rowspan').should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
    });

    it('should expect 5th row and 4th cell to have colspan of 2 and rowspan reaching the end of the grid', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(0).rowspan`).should('not.contain', 'Task 5');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(0).rowspan`).should('contain', '01/01/2009');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.gte(12000));
    });

    it('should scroll to row 100 and still expect "Start" column to span across 2 columns and rows until the end of the grid', () => {
      cy.get('button#scrollTo').click();
      cy.get('[data-row=100] > .slick-cell').should('have.length', 4);
      cy.get(`[data-row=100] > .slick-cell:nth(0)`).should('contain', 'Task 100');
      cy.get(`[data-row=100] > .slick-cell:nth(1)`).should('contain', '5 days');
      cy.get(`[data-row=100] > .slick-cell:nth(2)`).contains(/\d+$/); // use regexp to make sure it's a number
      cy.get(`[data-row=100] > .slick-cell:nth(3)`).should('not.contain', '01/01/2009');
      cy.get(`[data-row=100] > .slick-cell:nth(3)`).contains(/(true|false)/);
    });

    it('should scroll to the end of the grid and still expect "Start" column to span across 2 columns and rows until the end of the grid', () => {
      cy.get('input#nRow').type('{backspace}{backspace}{backspace}');
      cy.get('input#nRow').type('490');
      cy.get('button#scrollTo').click();

      cy.get('[data-row=481] > .slick-cell').should('have.length', 4);
      cy.get('[data-row=499] > .slick-cell').should('have.length', 4);
      cy.get(`[data-row=499] > .slick-cell:nth(0)`).should('contain', 'Task 499');
      cy.get(`[data-row=499] > .slick-cell:nth(1)`).should('contain', '5 days');
      cy.get(`[data-row=499] > .slick-cell:nth(2)`).contains(/\d+$/); // use regexp to make sure it's a number
      cy.get(`[data-row=499] > .slick-cell:nth(3)`).should('not.contain', '01/01/2009');
      cy.get(`[data-row=499] > .slick-cell:nth(3)`).contains(/(true|false)/);
    });
  });

  describe('basic key navigations', () => {
    it('should scroll back to top', () => {
      cy.get('input#nRow').type('{backspace}{backspace}{backspace}');
      cy.get('input#nRow').type('0');
      cy.get('button#scrollTo').click();
    });

    it('should start at Task 6 on %Complete column, then type "Arrow Up" key and expect active cell to become the blue section', () => {
      cy.get('[data-row=6] > .slick-cell:nth(2)').as('active_cell').click();
      cy.get('[data-row=6] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{uparrow}');
      cy.get('[data-row=3] .slick-cell.l1.r2.active').should('have.length', 1);
    });

    it('should start at Task 6 on %Complete column, then type "Arrow Right" key and expect active cell to become the yellowish section', () => {
      cy.get('[data-row=6] > .slick-cell:nth(2)').as('active_cell').click();
      cy.get('[data-row=6] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}');
      cy.get('[data-row=4] .slick-cell.l3.r4.active').should('have.length', 1);
      cy.get('[data-row=4] .slick-cell.l3.r4.active').should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.gte(12000));
    });

    it('should start at Task 2 on EffortDriven column, then type "Home" key and expect active cell to become Task 2 (white rowspan)', () => {
      cy.get('[data-row=2] > .slick-cell:nth(4)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l5.r5.active').should('have.length', 1);
      cy.get('@active_cell').type('{home}');
      cy.get('[data-row=2] .slick-cell.l0.r0.rowspan.active').should('have.length', 1);
      cy.get('[data-row=2] .slick-cell.l0.r0.rowspan.active').should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
    });

    it('should start at Task 2 cell, then type "Arrow Right" key twice and expect active cell to become Start cell that has colspan of 2', () => {
      cy.get('[data-row=2] > .slick-cell:nth(0)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}');
      cy.get('[data-row=2] .slick-cell.l3.r4.active').should('have.length', 1);
    });

    it('should start at Task 1 on %Complete column, then type "Ctrl+End" and "Ctrl+Home" keys and expect active cell to go to bottom of grid then top of grid on same column', () => {
      cy.get('[data-row=1] > .slick-cell:nth(2)').as('active_cell').click();
      cy.get('[data-row=1] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{end}', { release: false });
      cy.get('[data-row=499] .slick-cell.l2.r2.active').should('have.length', 1);

      cy.get('[data-row=499] .slick-cell.l2.r2.active').as('active_cell').click();
      cy.get('@active_cell').type('{ctrl}{home}', { release: false });
      cy.get('[data-row=0] .slick-cell.l2.r2.active').should('have.length', 1);
    });
  });
});
