describe('Example - colspan/rowspan - Employees Timesheets', { retries: 1 }, () => {
  const GRID_ROW_HEIGHT = 30;
  const fullTitles = [
    "Employee ID", "Employee Name", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
    "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
  ];

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-0031-row-span-employees.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + p').contains('This sample demonstrates the Grid component with the row spanning feature.');
  });

  it('should have exact column titles', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should expect 1st column to be frozen (frozen)', () => {
    cy.get('.grid-canvas-left .slick-cell.frozen').should('have.length', 10);
    cy.get('.grid-canvas-right .slick-cell:not(.frozen)').should('have.length.above', 60);
  });

  describe('Spanning', () => {
    it('should expect "Davolio", "Check Mail", and "Development" to all have rowspan of 2 in morning hours', () => {
      cy.get(`[data-row=0] > .slick-cell.l1.r1.rowspan`).should('contain', 'Davolio');
      cy.get(`[data-row=0] > .slick-cell.l1.r1.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

      cy.get(`[data-row=2] > .slick-cell.l2.r4.rowspan`).should('contain', 'Check Mail');
      cy.get(`[data-row=2] > .slick-cell.l2.r4.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

      cy.get(`[data-row=8] > .slick-cell.l7.r9.rowspan`).should('contain', 'Development');
      cy.get(`[data-row=8] > .slick-cell.l7.r9.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));
    });

    it('should expect "Lunch Break" to span over 3 columns and over all rows', () => {
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should('contain', 'Lunch Break');
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 10));
    });

    it('should expect a large "Development" section that spans over multiple columns & rows in the afternoon', () => {
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should('contain', 'Development');
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 5));
    });
  });

  describe('Basic Key Navigations', () => {
    it('should start at Employee 10001, then type "End" key and expect to be in "Team Meeting" between 4:30-5:00pm', () => {
      cy.get('[data-row=0] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l0.r0.active').should('contain', '10001');
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=0] > .slick-cell.l17.r18.active').should('contain', 'Team Meeting');
    });

    it('should start at Employee 10002, then type "End" key and also expect to be in "Team Meeting" between 4:30-5:00pm', () => {
      cy.get('[data-row=1] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=1] > .slick-cell.l0.r0.active').should('contain', '10002');
      cy.get('@active_cell').type('{end}');
      cy.get('[data-row=0] > .slick-cell.l17.r18.active').should('contain', 'Team Meeting');
    });

    it('should start at Employee 10004, then type "ArrowRight" key twice and expect to be in "Check Mail" between 9:00-10:30am', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{rightarrow}{rightarrow}');
      cy.get('[data-row=2] > .slick-cell.l2.r4.active').should('contain', 'Check Mail');
    });

    it('should start at Employee 10004, then type "ArrowRight" key 4x times and expect to be in "Testing" between 11:00-1:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}');
      cy.get('[data-row=3] > .slick-cell.l6.r9.active').should('contain', 'Testing');
    });

    it('should start at Employee 10004, then type "ArrowRight" key 5x times and expect to be in "Lunch Break"', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}');
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, then type "ArrowRight" key 6x times and expect to be in "Development" between 2:30-3:30pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}');
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan.active`).should('contain', 'Development');
    });

    // then rollback by going backward
    it('should be on Employee 10004 row at previous "Development" cell, then type "ArrowLeft" key once and expect to be in "Lunch Break"', () => {
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).as('active_cell').click();
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should('contain', 'Development');
      cy.get('@active_cell').type('{leftarrow}');
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan.active`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "ArrowLeft" key once and expect to be in "Conference" between 4:00-5:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).should('contain', 'Team Meeting');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).type('{leftarrow}');
      cy.get(`[data-row=3] > .slick-cell.l16.r17.active`).should('contain', 'Conference');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "ArrowLeft" key 3x times and expect to be back to "Development" between 2:30-3:30pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).should('contain', 'Team Meeting');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).type('{leftarrow}{leftarrow}{leftarrow}');
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan.active`).should('contain', 'Development');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "ArrowLeft" key 4x times and expect to be back to "Lunch Break"', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).as('active_cell').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}');
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan.active`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "ArrowLeft" key 5x times and expect to be back to "Testing" between 11:00-1:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).as('active_cell').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}');
      cy.get(`[data-row=3] > .slick-cell.l6.r9.active`).should('contain', 'Testing');
    });

    // going down
    it('should start at 10am "Team Meeting, then type "ArrowDown" key once and expect to be in "Support" between 9:30-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}');
      cy.get(`[data-row=1] > .slick-cell.l3.r5.active`).should('contain', 'Support');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key twice and expect to be in "Check Email" between 9:00-10:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}');
      cy.get(`[data-row=2] > .slick-cell.l2.r4.active`).should('contain', 'Check Mail');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 3x times and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}');
      cy.get(`[data-row=4] > .slick-cell.l2.r5.active`).should('contain', 'Task Assign');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times and expect to be in "Support" between 10:00-11:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}{downarrow}');
      cy.get(`[data-row=5] > .slick-cell.l4.r6.active`).should('contain', 'Support');
    });

    // going up from inverse
    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" once and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}{downarrow}{uparrow}');
      cy.get(`[data-row=4] > .slick-cell.l2.r5.active`).should('contain', 'Task Assign');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 2x times and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}{downarrow}{uparrow}{uparrow}');
      cy.get(`[data-row=2] > .slick-cell.l2.r4.active`).should('contain', 'Check Mail');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 3x times and expect to be in "Support" between 10:00-11:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}{downarrow}{uparrow}{uparrow}{uparrow}');
      cy.get(`[data-row=1] > .slick-cell.l3.r5.active`).should('contain', 'Support');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 4x times and expect to be back to same "Team Meeting"', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('@active_cell').type('{downarrow}{downarrow}{downarrow}{downarrow}{uparrow}{uparrow}{uparrow}{uparrow}');
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
    });
  });

  describe('Grid Navigate Functions', () => {
    it('should start at Employee 10004, then type "Navigate Right" twice and expect to be in "Check Mail" between 9:00-10:30am', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-test="goto-next"]')
        .click()
        .click();
      cy.get('[data-row=2] > .slick-cell.l2.r4.active').should('contain', 'Check Mail');
    });

    it('should start at Employee 10004, then type "Navigate Right" 4x times and expect to be in "Testing" between 11:00-1:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('[data-test="goto-next"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-row=3] > .slick-cell.l6.r9.active').should('contain', 'Testing');
    });

    it('should start at Employee 10004, then type "Navigate Right" 5x times and expect to be in "Lunch Break"', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('[data-test="goto-next"]')
        .click()
        .click()
        .click()
        .click()
        .click();
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, then type "Navigate Right" 6x times and expect to be in "Development" between 2:30-3:30pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('[data-test="goto-next"]')
        .click()
        .click()
        .click()
        .click()
        .click()
        .click();
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan.active`).should('contain', 'Development');
    });

    // then rollback by going backward
    it('should be on Employee 10004 row at previous "Development" cell, then type "Navigate Left" once and expect to be in "Lunch Break"', () => {
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).as('active_cell').click();
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should('contain', 'Development');
      cy.get('[data-test="goto-prev"]').click();
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan.active`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "Navigate Left" once and expect to be in "Conference" between 4:00-5:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).should('contain', 'Team Meeting');
      cy.get('[data-test="goto-prev"]').click();
      cy.get(`[data-row=3] > .slick-cell.l16.r17.active`).should('contain', 'Conference');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "Navigate Left" 3x times and expect to be back to "Development" between 2:30-3:30pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).should('contain', 'Team Meeting');
      cy.get('[data-test="goto-prev"]')
        .click()
        .click()
        .click();
      cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan.active`).should('contain', 'Development');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "Navigate Left" 4x times and expect to be back to "Lunch Break"', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).as('active_cell').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-prev"]')
        .click()
        .click()
        .click()
        .click();
      cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan.active`).should('contain', 'Lunch Break');
    });

    it('should start at Employee 10004, type "End" and be at "Team Meeting" at 5pm, then type "Navigate Left" 5x times and expect to be back to "Testing" between 11:00-1:00pm', () => {
      cy.get('[data-row=3] > .slick-cell.l0.r0').as('active_cell').click();
      cy.get('[data-row=3] > .slick-cell.l0.r0.active').should('contain', '10004');
      cy.get('@active_cell').type('{end}');
      cy.get(`[data-row=3] > .slick-cell.l18.r18.active`).as('active_cell').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-prev"]')
        .click()
        .click()
        .click()
        .click()
        .click();
      cy.get(`[data-row=3] > .slick-cell.l6.r9.active`).should('contain', 'Testing');
    });

    // going down
    it('should start at 10am "Team Meeting, then type "ArrowDown" key once and expect to be in "Support" between 9:30-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click();
      cy.get(`[data-row=1] > .slick-cell.l3.r5.active`).should('contain', 'Support');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key twice and expect to be in "Check Email" between 9:00-10:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click();
      cy.get(`[data-row=2] > .slick-cell.l2.r4.active`).should('contain', 'Check Mail');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 3x times and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click();
      cy.get(`[data-row=4] > .slick-cell.l2.r5.active`).should('contain', 'Task Assign');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times and expect to be in "Support" between 10:00-11:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click()
        .click();
      cy.get(`[data-row=5] > .slick-cell.l4.r6.active`).should('contain', 'Support');
    });

    // going up from inverse
    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" once and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-test="goto-up"]')
        .click();
      cy.get(`[data-row=4] > .slick-cell.l2.r5.active`).should('contain', 'Task Assign');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 2x times and expect to be in "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-test="goto-up"]')
        .click()
        .click();
      cy.get(`[data-row=2] > .slick-cell.l2.r4.active`).should('contain', 'Check Mail');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 3x times and expect to be in "Support" between 10:00-11:30am', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-test="goto-up"]')
        .click()
        .click()
        .click();
      cy.get(`[data-row=1] > .slick-cell.l3.r5.active`).should('contain', 'Support');
    });

    it('should start at 10am "Team Meeting, then type "ArrowDown" key 4x times, then "ArrowUp" 4x times and expect to be back to same "Team Meeting"', () => {
      cy.get('[data-row=0] > .slick-cell.l4.r4').as('active_cell').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
      cy.get('[data-test="goto-down"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-test="goto-up"]')
        .click()
        .click()
        .click()
        .click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active').should('contain', 'Team Meeting');
    });
  });

  describe('Grid Editing', () => {
    it('should toggle editing', () => {
      cy.get('#isEditable').contains('false');
      cy.get('[data-row=0] > .slick-cell.l4.r4').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active .editor-text').should('not.exist');

      cy.get('[data-test=toggle-editing]').click();
      cy.get('#isEditable').contains('true');

      cy.get('[data-row=0] > .slick-cell.l4.r4').click();
      cy.get('[data-row=0] > .slick-cell.l4.r4.active.editable .editor-text').should('exist');
      cy.get('[data-row=0] > .slick-cell.l4.r4.active.editable .editor-text').type('Team Meeting.xyz{enter}');
    });

    // going down
    it('should have changed active cell to "Support" between 9:30-11:00am', () => {
      cy.get('[data-row=1] > .slick-cell.l3.r5.active.editable .editor-text')
        .invoke('val')
        .then(text => expect(text).to.eq('Support'));
      cy.get('[data-row=1] > .slick-cell.l3.r5.active.editable .editor-text').type('Support.xyz{enter}');
    });

    it('should have changed active cell to "Check Email" between 9:00-10:30am', () => {
      cy.get('[data-row=2] > .slick-cell.l2.r4.active.editable .editor-text')
        .invoke('val')
        .then(text => expect(text).to.eq('Check Mail'));
      cy.get('[data-row=2] > .slick-cell.l2.r4.active.editable .editor-text').type('Check Mail.xyz{enter}');
    });

    it('should have changed active cell to "Task Assign" between 9:00-11:00am', () => {
      cy.get('[data-row=4] > .slick-cell.l2.r5.active.editable .editor-text')
        .invoke('val')
        .then(text => expect(text).to.eq('Task Assign'));
      cy.get('[data-row=4] > .slick-cell.l2.r5.active.editable .editor-text').type('Task Assign.xyz{enter}');
    });

    it('should have changed active cell to "Support" between 10:00-11:30am', () => {
      cy.get('[data-row=5] > .slick-cell.l4.r6.active.editable .editor-text')
        .invoke('val')
        .then(text => expect(text).to.eq('Support'));
      cy.get('[data-row=5] > .slick-cell.l4.r6.active.editable .editor-text').type('Support.xyz{enter}');
    });

    it('should have changed active cell to "Testing" and cancel editing when typing "Escape" key', () => {
      cy.get('[data-row=6] > .slick-cell.l4.r4.active.editable .editor-text')
        .invoke('val')
        .then(text => expect(text).to.eq('Testing'));
      cy.get('[data-row=6] > .slick-cell.l4.r4.active.editable .editor-text').type('{esc}');
      cy.get('[data-row=6] > .slick-cell.l4.r4.active.editable .editor-text').should('not.exist');
    });
  });

  describe('Rowspan Remapping', () => {
    describe('hide EmployeeID', () => {
      it('should hide EmployeeID', () => {
        cy.get('[data-test="toggle-employee-id"]').click();
      });

      it('should expect EmployeeID to follow columns at index 0 column index', () => {
        cy.get(`[data-row=0] > .slick-cell.l0.r0.rowspan`).should('contain', 'Davolio');
        cy.get(`[data-row=0] > .slick-cell.l0.r0.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

        cy.get(`[data-row=2] > .slick-cell.l1.r3.rowspan`).should('contain', 'Check Mail');
        cy.get(`[data-row=2] > .slick-cell.l1.r3.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

        cy.get(`[data-row=8] > .slick-cell.l6.r8.rowspan`).should('contain', 'Development');
        cy.get(`[data-row=8] > .slick-cell.l6.r8.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));
      });

      it('should expect "Lunch Break" to be moved to the left by 1 index less', () => {
        cy.get(`[data-row=0] > .slick-cell.l9.r11.rowspan`).should('contain', 'Lunch Break');
        cy.get(`[data-row=0] > .slick-cell.l9.r11.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 10));
      });

      it('should expect "Development" to be moved to the left by 1 index less', () => {
        cy.get(`[data-row=1] > .slick-cell.l12.r13.rowspan`).should('contain', 'Development');
        cy.get(`[data-row=1] > .slick-cell.l12.r13.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 5));
      });
    });

    describe('show EmployeeID', () => {
      it('should show EmployeeID', () => {
        cy.get('[data-test="toggle-employee-id"]').click();
      });

      it('should expect EmployeeID to follow columns at index 1 column index', () => {
        cy.get(`[data-row=0] > .slick-cell.l1.r1.rowspan`).should('contain', 'Davolio');
        cy.get(`[data-row=0] > .slick-cell.l1.r1.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

        cy.get(`[data-row=2] > .slick-cell.l2.r4.rowspan`).should('contain', 'Check Mail');
        cy.get(`[data-row=2] > .slick-cell.l2.r4.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));

        cy.get(`[data-row=8] > .slick-cell.l7.r9.rowspan`).should('contain', 'Development');
        cy.get(`[data-row=8] > .slick-cell.l7.r9.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 2));
      });

      it('should expect "Lunch Break" to be moved to the right by 1 index less', () => {
        cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should('contain', 'Lunch Break');
        cy.get(`[data-row=0] > .slick-cell.l10.r12.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 10));
      });

      it('should expect "Development" to be moved to the right by 1 index less and a large "Development" section that spans over multiple columns & rows in the afternoon', () => {
        cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should('contain', 'Development');
        cy.get(`[data-row=1] > .slick-cell.l13.r14.rowspan`).should(($el) => expect(parseInt(`${$el.outerHeight()}`, 10)).to.eq(GRID_ROW_HEIGHT * 5));
      });
    });
  });
});
