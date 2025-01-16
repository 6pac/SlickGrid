describe('Example - colspan & rowspan spanning many columns', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = ['Title', 'Revenue Growth', 'Pricing Policy', 'Policy Index', 'Expense Control', 'Excess Cash', 'Net Trade Cycle', 'Cost of Capital'];

  for (let i = 0; i < 30; i++) {
    fullTitles.push(`Mock${i}`);
  }

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-0032-row-span-many-columns.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + p').contains('This page demonstrates colspan & rowspan using DataView with item metadata.');
  });

  it('should have exact column titles', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  describe('spanning', () => {
    it('should expect first row to be regular rows without any spanning', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 0');

      for (let i = 0; i <= 7; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l${i}.r${i}`).should('exist');
      }
    });

    it('should expect 1st row second cell to span (rowspan) across 3 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 0');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.height()}`, 10)).to.gte(70)
        expect(parseInt(`${$el.height()}`, 10)).to.lte(72)
      });

      for (let i = 2; i <= 6; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(${i})`).contains(/\d+$/); // use regexp to make sure it's a number
      }
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l1.r1`).should('not.exist')
    });

    it('should expect 3rd row first cell to span (rowspan) across 3 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0).rowspan`).should('contain', 'Task 2');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l1.r1`).should('not.exist')
      for (let i = 2; i <= 5; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(${i})`).contains(/\d+$/);
      }
    });

    it('should expect 4th row to have 2 sections (blue, green) spanning across 3 rows (rowspan) and 2 columns (colspan)', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should('not.contain', 'Task 3');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r2`).should('exist').contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l3.r4`).should('exist').contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l5.r5`).should('exist').contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l6.r6`).should('exist').contains(/\d+$/);
    });

    it('should click on "Toggle blue cell colspan..." and expect colspan to widen from 1 column to 2 columns and from 5 rows to 3 rowspan', () => {
      cy.get('.slick-cell.l1.r2.rowspan').should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));

      cy.get('button#toggleSpans').click();
      cy.get('.slick-cell.l1.r2.rowspan').should('not.exist');
      cy.get('.slick-cell.l1.r1.rowspan').should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(121));
    });

    it('should expect Task 8 on 2nd column to have rowspan spanning 80 cells', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 8');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.height()}`, 10)).to.gte(1995)
        expect(parseInt(`${$el.height()}`, 10)).to.lte(1998)
      });
    });

    it('should scroll to the right and still expect spans without any extra texts', () => {
      cy.get('#myGrid')
        .find('.slick-viewport-top.slick-viewport-left')
        .scrollTo(400, 0)
        .wait(10);

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(1)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(2).rowspan`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(2).rowspan`).should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell.l3.r3`).should('not.exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell.l4.r4`).should('not.exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l3.r3`).should('not.exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l3.r3`).should('not.exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 6}px;"] > .slick-cell.l4.r4`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 6}px;"] > .slick-cell.l4.r4`).should('exist');
    });

    it('should scroll back to left and expect Task 8 to have 2 different spans (Revenue Grow: rowspan=80, Policy Index: rowspan=2000,colspan=2)', () => {
      cy.get('#myGrid')
        .find('.slick-viewport-top.slick-viewport-left')
        .scrollTo(0, 0)
        .wait(10);

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 8');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.height()}`, 10)).to.gte(1995)
        expect(parseInt(`${$el.height()}`, 10)).to.lte(1996)
      });
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(2)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell.l3.r4`).should('exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 9}px;"] > .slick-cell:nth(0)`).should('contain', 'Task 9');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 9}px;"] > .slick-cell.l1.r1`).should('not.exist'); // first rowspan
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 9}px;"] > .slick-cell.l3.r4`).should('not.exist'); // second rowspan
    });

    it('should scroll to row 85 and still expect "Revenue Growth" and "Policy Index" spans', () => {
      cy.get('input#nRow').type('{backspace}{backspace}{backspace}');
      cy.get('input#nRow').type('85');
      cy.get('button#scrollTo').click();
      cy.get('[data-row=85] > .slick-cell').should('have.length', 5);
      cy.get(`[data-row=85] > .slick-cell:nth(0)`).should('contain', 'Task 85');
      cy.get(`[data-row=85] > .slick-cell:nth(1)`).contains(/\d+$/);
      cy.get(`[data-row=85] > .slick-cell:nth(2)`).contains(/\d+$/);
      cy.get(`[data-row=85] > .slick-cell.l1.r1`).should('not.exist');

      cy.get('[data-row=88] > .slick-cell').should('have.length', 6); // only 1 rowspan left (yellowish)
      cy.get(`[data-row=88] > .slick-cell:nth(0)`).should('contain', 'Task 88');
      cy.get(`[data-row=88] > .slick-cell.l1.r1`).should('exist');
      cy.get(`[data-row=88] > .slick-cell.l2.r2`).should('exist');
      cy.get(`[data-row=88] > .slick-cell.l3.r4`).should('not.exist'); // second rowspan
      cy.get(`[data-row=88] > .slick-cell.l5.r5`).should('exist');
    });

    it('should scroll to the end of the grid and still expect "Start" column to span across 2 columns and rows until the end of the grid', () => {
      cy.get('input#nRow').type('{backspace}{backspace}{backspace}');
      cy.get('input#nRow').type('490');
      cy.get('button#scrollTo').click();

      cy.get('[data-row=481] > .slick-cell').should('have.length', 6);
      cy.get(`[data-row=481] > .slick-cell:nth(0)`).should('contain', 'Task 481');

      cy.get('[data-row=499] > .slick-cell').should('have.length', 6);
      cy.get(`[data-row=499] > .slick-cell:nth(0)`).should('contain', 'Task 499');
      cy.get(`[data-row=499] > .slick-cell.l1.r1`).should('exist');
      cy.get(`[data-row=499] > .slick-cell.l2.r2`).should('exist');
      cy.get(`[data-row=499] > .slick-cell.l3.r4`).should('not.exist'); // second rowspan
      cy.get(`[data-row=499] > .slick-cell.l5.r5`).should('exist');
    });
  });

  describe('basic key navigations', () => {
    it('should scroll back to top', () => {
      cy.get('input#nRow').type('{backspace}{backspace}{backspace}');
      cy.get('input#nRow').type('0');
      cy.get('button#scrollTo').click();
    });

    it('should start at Task 6 on PolicyIndex column, then type "Arrow Up" key and expect active cell to become the green section in the middle', () => {
      cy.get('[data-row=6] > .slick-cell:nth(2)').as('active_cell').click();
      cy.get('[data-row=6] .slick-cell.l3.r3.active').should('have.length', 1);
      cy.get('@active_cell').type('{uparrow}');
      cy.get('[data-row=3] .slick-cell.l3.r4.active').should('have.length', 1);
    });

    it('should start at Task 6 on PricingPolicy column, then type "Arrow Left" key and expect active cell to become the green section in the middle', () => {
      cy.get('[data-row=6] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=6] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{leftarrow}');
      cy.get('[data-row=3] .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 3 on PricingPolicy column, then type "Arrow Right" key and expect active cell to become the green section in the middle', () => {
      cy.get('[data-row=3] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=3] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}');
      cy.get('[data-row=3] .slick-cell.l3.r4.active').should('have.length', 1);
      cy.get('[data-row=3] .slick-cell.l3.r4.active').should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
    });

    it('should start at Task 2 on PricingPolicy column, then type "Arrow Left" key and expect active cell to become the dashed section beside Task 0-3 on RevenueGrowth column', () => {
      cy.get('[data-row=2] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{leftarrow}');
      cy.get('[data-row=0] .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "Arrow Left" key twice and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{leftarrow}{leftarrow}');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').contains('Task 2');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "Home" key and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{home}');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').contains('Task 2');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "End" key and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=2] .slick-cell.l7.r7.active').should('have.length', 1);
    });

    it('should start at RevenueGrowth column on first dashed cell, then type "Ctrl+End" then "Ctrl+Home" keys and expect active cell to go to bottom/top of grid on same column', () => {
      cy.get('[data-row=0] > .slick-cell:nth(1)').as('active_cell').click();
      cy.get('[data-row=0] .slick-cell.l1.r1.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{end}', { release: false });
      cy.get('[data-row=499] .slick-cell.l1.r1.active').should('have.length', 1);
      cy.get('[data-row=499] .slick-cell.l1.r1.active').type('{ctrl}{home}', { release: false });
      cy.get('[data-row=0] .slick-cell.l1.r1.active').should('have.length', 1);
      cy.get('[data-row=0] .slick-cell.l1.r1.active').should(($el) => expect(parseInt(`${$el.height()}`, 10)).to.eq(71));
      cy.get('[data-row=1] > .slick-cell.l1.r1').should('not.exist');
      cy.get('[data-row=2] > .slick-cell.l1.r1').should('not.exist');
    });

    it('should start at first row on PolicyIndex column, then type "Ctrl+End" keys and expect active cell to become yellowish section', () => {
      cy.get('[data-row=0] > .slick-cell:nth(3)').as('active_cell').click();
      cy.get('[data-row=0] .slick-cell.l3.r3.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{end}', { release: false });
      cy.get('[data-row=8] .slick-cell.l3.r4.active').should('have.length', 1);
    });

    it('should start at first row on ExpenseControl column, then type "Ctrl+End" keys and expect active cell to become the cell just above the yellowish section', () => {
      cy.get('[data-row=0] > .slick-cell:nth(4)').as('active_cell').click();
      cy.get('[data-row=0] .slick-cell.l4.r4.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{end}', { release: false });
      cy.get('[data-row=7] .slick-cell.l4.r4.active').should('have.length', 1);
    });
  });
});
