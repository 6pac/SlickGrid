describe('Example - colspan & rowspan spanning many columns', { retries: 0 }, () => {
  const GRID_ROW_HEIGHT = 25;
  const fullTitles = [
    'Title',
    'Revenue Growth', 'Pricing Policy', 'Policy Index', 'Expense Control', 'Excess Cash', 'Net Trade Cycle', 'Cost of Capital',
    'Revenue Growth', 'Pricing Policy', 'Policy Index', 'Expense Control', 'Excess Cash', 'Net Trade Cycle', 'Cost of Capital',
    'Revenue Growth', 'Pricing Policy', 'Policy Index', 'Expense Control', 'Excess Cash', 'Net Trade Cycle', 'Cost of Capital'
  ];

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

  it('should drag Title column to swap with 2nd column "Revenue Growth" in the grid and expect rowspan to stay at same position with Task 0 to spread instead', () => {
    const expectedTitles = ['Revenue Growth', 'Title', 'Pricing Policy'];

    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l0.r0.rowspan`).should(($el) =>
      expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
    );

    cy.get('.slick-header-columns').children('.slick-header-column:nth(0)').contains('Title').drag('.slick-header-column:nth(1)');
    cy.get('.slick-header-column:nth(0)').contains('Revenue Growth');
    cy.get('.slick-header-column:nth(1)').contains('Title');

    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l1.r1`).should('contain', 'Task 0');
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l1.r1`).should('not.exist');
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r1`).should('contain', 'Task 3');

    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l1.r1.rowspan`).should(($el) =>
      expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
    );

    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => {
        if (index < expectedTitles.length) {
          expect($child.text()).to.eq(expectedTitles[index]);
        }
      });
  });

  it('should drag back Title column to reswap with 2nd column "Revenue Growth" in the grid and expect rowspan to stay at same position with Revenue Growth to now spread', () => {
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l1.r1.rowspan`).should(($el) =>
      expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
    );
    cy.get('.slick-header-columns').children('.slick-header-column:nth(0)').contains('Revenue Growth').drag('.slick-header-column:nth(1)');
    cy.get('.slick-header-column:nth(0)').contains('Title');
    cy.get('.slick-header-column:nth(1)').contains('Revenue Growth');

    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 0');
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 1');
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 2');
    cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l0.r0`).should('not.exist');

    const expectedTitles = ['Title', 'Revenue Growth', 'Pricing Policy'];
    cy.get('.slick-header-columns')
      .children()
      .each(($child, index) => {
        if (index < expectedTitles.length) {
          expect($child.text()).to.eq(expectedTitles[index]);
        }
      });
  });

  describe('spanning', () => {
    it('should expect first row to be regular rows without any spanning', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 0');

      for (let i = 2; i <= 6; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l${i}.r${i}`).should('exist');
      }
    });

    it('should expect 1st row, second cell to span (rowspan) across 3 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 0');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3);
      });

      for (let i = 2; i < 14; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(${i})`).contains(/\d+$/); // use regexp to make sure it's a number
      }
    });

    it('should expect 3rd row first cell to span (rowspan) across 3 rows', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l0.r0.rowspan`).should('contain', 'Task 2');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell.l0.r0.rowspan`).should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
      );

      for (let i = 2; i <= 5; i++) {
        cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(${i})`).contains(/\d+$/);
      }
    });

    it('should expect 4th row to have 2 sections (blue, green) spanning across 3 rows (rowspan) and 2 columns (colspan)', () => {
      // blue rowspan section
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r1.rowspan`).should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 5)
      );
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l2.r2`)
        .should('exist')
        .contains(/\d+$/);

      // green colspan/rowspan section
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l3.r7`)
        .should('exist')
        .contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l8.r8`)
        .should('exist')
        .contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l9.r9`)
        .should('exist')
        .contains(/\d+$/);
    });

    it('should click on "Toggle blue cell colspan..." and expect colspan to widen from 1 column to 2 columns and from 5 rows to 3 rowspan', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r1.rowspan`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r1.rowspan`).should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 5)
      );

      cy.get('[data-test="toggleSpans"]').click();
      cy.get('.slick-cell.l1.r1.rowspan').should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell.l1.r2.rowspan`).should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
      );
    });

    it('should expect Task 8 on 2nd column to have rowspan spanning 80 cells', () => {
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 8');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 80);
      });
    });

    it('should scroll to the right and still expect spans without any extra texts', () => {
      cy.get('.slick-viewport-top.slick-viewport-left').scrollTo(400, 0).wait(10);

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(1)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(0).rowspan`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(1).rowspan`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(1).rowspan`).should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
      );

      // next rows are regular cells
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell.l3.r3`).should('not.exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell.l4.r4`).should('not.exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l3.r3`).should('not.exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l3.r3`).should('not.exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 6}px;"] > .slick-cell.l4.r4`).should('exist');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 6}px;"] > .slick-cell.l4.r4`).should('exist');
    });

    it('should scroll back to left and expect Task 8 to have 2 different spans (Revenue Grow: rowspan=80, Policy Index: rowspan=2000,colspan=2)', () => {
      cy.get('.slick-viewport-top.slick-viewport-left').scrollTo(0, 0).wait(10);

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 8');
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1).rowspan`).should(($el) => {
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 80);
      });
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(1)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell:nth(2)`).contains(/\d+$/);
      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 8}px;"] > .slick-cell.l3.r4`).should('exist');

      cy.get(`[style*="top: ${GRID_ROW_HEIGHT * 9}px;"] > .slick-cell.l0.r0`).should('contain', 'Task 9');
    });

    it('should scroll to row 85 and still expect 3 spans in the screen, "Revenue Growth" and "Policy Index" spans', () => {
      cy.get('[data-test="clearScrollTo"]').click();
      cy.get('[data-test="nbrows"]').type('{backspace}85');
      cy.get('[data-test="scrollToBtn"]').click();

      // left dashed rowspan "Revenue Growth"
      cy.get(`[data-row=85] > .slick-cell.l0.r0`).should('contain', 'Task 85');
      cy.get(`[data-row=85] > .slick-cell.l2.r2`).contains(/\d+$/);

      // rowspan middle (yellowish) "Policy Index"
      cy.get(`[data-row=88] > .slick-cell.l0.r0`).should('contain', 'Task 88');
      cy.get(`[data-row=88] > .slick-cell.l1.r1`).should('exist');
    });

    it('should scroll to the end of the grid and still expect "PolicyIndex" column to span across 2 columns and rows until the end of the grid', () => {
      cy.get('[data-test="clearScrollTo"]').click();
      cy.get('[data-test="nbrows"]').type('{backspace}490');
      cy.get('[data-test="scrollToBtn"]').click();

      cy.get(`[data-row=485] > .slick-cell.l0.r0`).should('contain', 'Task 485');

      cy.get(`[data-row=499] > .slick-cell.l0.r0`).should('contain', 'Task 499');
      cy.get(`[data-row=499] > .slick-cell.l1.r1`).should('exist');
      cy.get(`[data-row=499] > .slick-cell.l2.r2`).should('exist');
      cy.get(`[data-row=499] > .slick-cell.l5.r5`).should('exist');
    });

    it('should load 5K data and expect 8.3 rowspan row height to increase/decrease when data changes from 500 to 5K back to 500', () => {
      cy.get('[data-row=8] .slick-cell.l3.r4').should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * (500 - 8))
      );

      cy.get('[data-test="add-5k-rows-btn"]').click();
      cy.get('[data-row=8] .slick-cell.l3.r4').should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * (5000 - 8))
      );

      cy.get('[data-test="add-500-rows-btn"]').click();
      cy.get('[data-row=8] .slick-cell.l3.r4').should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * (500 - 8))
      );
    });
  });

  describe('Basic Key Navigations', () => {
    it('should scroll back to top', () => {
      cy.get('[data-test="clearScrollTo"]').click();
      cy.get('[data-test="nbrows"]').type('0');
      cy.get('[data-test="scrollToBtn"]').click();
    });

    it('should start at Task 6 on PolicyIndex column, then type "Arrow Up" key and expect active cell to become the green section in the middle', () => {
      cy.get('[data-row=6] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=6] > .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{uparrow}');
      cy.get('[data-row=3] > .slick-cell.l1.r2.active').should('have.length', 1);
    });

    it('should start at Task 6 on PricingPolicy column, then type "Arrow Left" key and expect active cell to become the green section in the middle', () => {
      cy.get('[data-row=6] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=6] > .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('[data-test="toggleSpans"]').click();
      cy.get('@active_cell').type('{leftarrow}');
      cy.get('[data-row=3] .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 5 on Task 5 column, then type "Arrow Right" key 3x times and expect active cell to become the wide green section in the middle', () => {
      cy.get('[data-row=5] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=5] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}{rightarrow}');
      cy.get('[data-row=5] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('[data-row=5] .slick-cell.l2.r2.active').type('{rightarrow}');
      cy.get('[data-row=3] .slick-cell.l3.r7.active').should(($el) =>
        expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3)
      );
    });

    it('should start at Task 2 on PricingPolicy column, then type "Arrow Left" key and expect active cell to become the dashed section beside Task 0-3 on RevenueGrowth column', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=2] > .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{leftarrow}');
      cy.get('[data-row=0] > .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "Arrow Left" key twice and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=2] > .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{leftarrow}{leftarrow}');
      cy.get('[data-row=2] > .slick-cell.l0.r0.active').contains('Task 2');
      cy.get('[data-row=2] > .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "Home" key and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{home}');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').contains('Task 2');
      cy.get('[data-row=2] .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 2 on PricingPolicy column, then type "End" key and expect active cell to become Task 2 cell', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=2] .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=2] .slick-cell.l21.r21.active').should('have.length', 1);
    });

    it('should start at RevenueGrowth column on first dashed cell, then type "Ctrl+End" then "Ctrl+Home" keys and expect active cell to go to bottom/top of grid on same column', () => {
      cy.get('[data-row=0] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l2.r2.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{end}', { release: false });
      cy.get('[data-row=499] > .slick-cell.l21.r21.active').should('have.length', 1);
      cy.get('[data-row=499] > .slick-cell.l21.r21.active').type('{ctrl}{home}', { release: false });
      cy.get('[data-row=0] .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('[data-row=0] .slick-cell.l1.r1').should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 3));
    });

    it('should start at first row on PolicyIndex column, then type "Ctrl+DownArrow" keys and expect active cell to become yellowish section', () => {
      cy.get('[data-row=0] > .slick-cell.l3.r3').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l3.r3.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{downarrow}', { release: false });
      cy.get('[data-row=8] > .slick-cell.l3.r4.active').should('have.length', 1);
    });

    it('should start at first row on ExpenseControl column, then type "Ctrl+DownArrow" keys and expect active cell to become the cell just above the yellowish section', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('have.length', 1);
      cy.get('@active_cell').type('{ctrl}{downarrow}', { release: false });
      cy.get('[data-row=7] .slick-cell.l4.r4.active').should('have.length', 1);
    });

    it('should start at Task 13, type "End" key and expect active cell to be the last span cell', () => {
      cy.get('[data-row=13] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=13] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=13] > .slick-cell.l21.r21.active').should('have.length', 1);
    });

    it('should go to Task 13 last cell, type "Home" key and expect active cell to become Task 13', () => {
      cy.get('[data-row=13] > .slick-cell.l21.r21').as('active_cell').click();
      cy.get('[data-row=13] > .slick-cell.l21.r21.active').should('have.length', 1);
      cy.get('@active_cell').type('{home}');
      cy.get('[data-row=13] > .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 15, type "End" key and expect active cell to be on the last orange span cell', () => {
      cy.get('[data-row=15] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=15] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=15] > .slick-cell.l18.r21.active').should('have.length', 1);
      cy.get('[data-row=15] > .slick-cell.l18.r21.active').type('{home}');
    });

    it('should start at Task 17, type "End" key and expect active cell to be on the last orange span cell', () => {
      cy.get('[data-row=17] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=17] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=15] > .slick-cell.l18.r21.active').should('have.length', 1);
      cy.get('[data-row=15] > .slick-cell.l18.r21.active').type('{home}');
    });

    it('should start at Task 5, type "ArrowRight" key 3x times and expect active cell to be at cell 3.3', () => {
      cy.get('[data-row=15] > .slick-cell.l0.r0').type('{ctrl}{uparrow}');
      cy.get('[data-row=5] > .slick-cell.l0.r0').contains('Task 5').as('active_cell').click();
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}');
      cy.get('[data-row=3] > .slick-cell.l3.r7.active').should('have.length', 1);
    });

    it('should start at Task 5, type "ArrowRight" key 4x times and expect active cell to be at cell 5.8', () => {
      cy.get('[data-row=5] > .slick-cell.l0.r0').contains('Task 5').as('active_cell').click();
      cy.get('[data-row=5] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}');
      cy.get('[data-row=5] > .slick-cell.l8.r8.active').should('have.length', 1);
    });

    it('should start at Task 5, type "ArrowRight" key 4x times, then "ArrowLeft" 4x times and be back at Task 5', () => {
      cy.get('[data-row=5] > .slick-cell.l0.r0').contains('Task 5').as('active_cell').click();
      cy.get('[data-row=5] > .slick-cell.l0.r0.active').should('have.length', 1);
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}');
      cy.get('[data-row=5] > .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at Task 2 on Pricing Policy column and type "PageDown" key 3x times and be on Task 59 on same column', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pagedown}');
      cy.get('[data-row=59] > .slick-cell.l2.r2.active').should('have.length', 1);
    });

    it('should start at Task 59 on Pricing Policy column and type "PageUp" key 3x times and be back to Task 2 on same column', () => {
      cy.get('[data-row=59] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}{pageup}{pageup}');
      cy.get('[data-row=2] > .slick-cell.l2.r2.active').should('have.length', 1);
    });

    it('should start at Task 0 on Policy Index column and type "PageDown" key 2x times but expect active cell to stay on initial cell but still scroll down around Task 40', () => {
      cy.get('[data-row=0] > .slick-cell.l3.r3').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}');
      cy.get('[data-row=0] > .slick-cell.l3.r3.active').should('have.length', 1);
      cy.get('[data-row=40]').should('be.visible');
    });

    it('should start at Task 1 on Excess Cash column and type "PageDown" key 4x times and be on Task 77 on same column', () => {
      cy.get('[data-row=0] > .slick-cell.l3.r3.active').type('{ctrl}{uparrow}');
      cy.get('[data-row=1] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pagedown}{pagedown}');
      cy.get('[data-row=77] > .slick-cell.l5.r5.active').should('have.length', 1);
    });

    it('should start at Task 77 on Excess Cash column and type "PageDown" key 4x times and be on Task 105 on same column', () => {
      cy.get('[data-row=77] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}');
      cy.get('[data-row=105] > .slick-cell.l5.r5.active').should('have.length', 1);
    });

    it('should start at Task 105 on Excess Cash column and type "PageUp" key once and be on Task 85 on same column', () => {
      cy.get('[data-row=105] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}');
      cy.get('[data-row=85] > .slick-cell.l5.r5.active').should('have.length', 1);
    });

    it('should start at Task 85 on Excess Cash column and type "PageUp" key once and be on Task 66 on same column', () => {
      cy.get('[data-row=85] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}');
      cy.get('[data-row=66] > .slick-cell.l5.r5.active').should('have.length', 1);
    });

    it('should start at Task 66 on Excess Cash column and type "PageUp" key 3x times and be on Task 9 on same column', () => {
      cy.get('[data-row=66] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}{pageup}{pageup}');
      cy.get('[data-row=9] > .slick-cell.l5.r5.active').should('have.length', 1).type('{pageup}');
    });

    it('should start at Task 0 on Revenue Growth column and type "PageDown" key once and be on Task 88 on same column', () => {
      cy.get('[data-row=0] > .slick-cell.l1.r1').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}');
      cy.get('[data-row=88] > .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 88 on Revenue Growth column and type "PageUp" key once and be on Task 8 on same column', () => {
      cy.get('[data-row=88] > .slick-cell.l1.r1').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}');
      cy.get('[data-row=8] > .slick-cell.l1.r1.active').should('have.length', 1);
    });

    it('should start at Task 9 on Excess Cash column and type "PageUp" key once and be on Task 0 on same column', () => {
      cy.get('[data-row=9] > .slick-cell.l5.r5').as('active_cell').click();
      cy.get('@active_cell').type('{pageup}');
      cy.get('[data-row=0] > .slick-cell.l5.r5.active').should('have.length', 1);
    });

    it('should start at Task 9 on Excess Cash column and type "PageDown" key 26x times and be on last Task 499 on same column', () => {
      cy.get('[data-row=9] > .slick-cell.l5.r5').as('active_cell').click();
      let command = '';
      for (let i = 1; i <= 26; i++) {
        command += '{pagedown}';
      }
      cy.get('@active_cell').type(command);
      cy.get('[data-row=499] > .slick-cell.l5.r5.active').should('have.length', 1);
    });
  });
});
