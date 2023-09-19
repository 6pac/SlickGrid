describe('Example - Checkbox Header Row', () => {
  const titles = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let selectedIdsCount = 0;

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-checkbox-header-row.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('Using a fixed header row to implement column-level filters with Checkbox Selector');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should select a single row and display new and previous selected rows in the console (previous should be empty)', () => {
    cy.get('.slick-row:nth(3) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('3');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: ');
      expect(win.console.log).to.be.calledWith('Selected Rows: 3');
    });
  });

  it('should select a second row and display new and previous selected rows in the console (previous should be empty)', () => {
    cy.get('.slick-row:nth(6) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('3,7');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 3');
      expect(win.console.log).to.be.calledWith('Selected Rows: 3,7');
    });
  });

  it('should unselect first row and display previous and new selected rows', () => {
    cy.get('.slick-cell-checkboxsel.selected:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains('7');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 3,7');
      expect(win.console.log).to.be.calledWith('Selected Rows: 7');
    });
  });

  it('should click on Select All and display previous and new selected rows', () => {
    const expectedRows = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149';

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains(expectedRows);

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 7');
      expect(win.console.log).to.be.calledWith(`Selected Rows: ${expectedRows}`);
    });
  });

  it('should click on Select All again and expect no new selected rows', () => {
    const expectedPreviousRows = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149';

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
    .invoke('text').then((text => {
        expect(text.trim()).to.eq('')
    }));

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith(`Previously Selected Rows: ${expectedPreviousRows}`);
      expect(win.console.log).to.be.calledWith('Selected Rows: ');
    });
  });

  it('should display "Showing page 1 of 6" text after changing Pagination to 25 items per page', () => {
    cy.get('.sgi-lightbulb')
      .click();

    cy.get('.slick-pager-settings-expanded')
      .should('be.visible');

    cy.get('.slick-pager-settings-expanded')
      .contains('25')
      .click();

    cy.get('.slick-pager-status')
      .contains('Showing page 1 of 6');
  });

  it('should change row selection across multiple pages, first page should have 2 selected', () => {
    cy.get('[data-test="set-dynamic-rows"]').click();

    // Row index 3, 5 and 21 (last one will be on 2nd page)
    cy.get('input[type="checkbox"]:checked').should('have.length', 2); // 2x in current page and 1x in next page
    cy.get('[style="top:75px"] > .slick-cell:nth(0) input[type="checkbox"]').should('be.checked');
    cy.get('[style="top:125px"] > .slick-cell:nth(0) input[type="checkbox"]').should('be.checked');
  });

  it('should go to next page and expect 1 row selected in that second page', () => {
    cy.get('.sgi-chevron-right')
      .click();

    cy.get('input[type="checkbox"]:checked').should('have.length', 1); // only 1x row in page 2
    cy.get('[style="top:100px"] > .slick-cell:nth(0) input[type="checkbox"]').should('be.checked');
  });

  it('should click on "Select All" checkbox and expect all rows selected in current page', () => {
    const expectedRows = '1,3,5,7,9,11,13,15,17,19,21,23';

    // go back to 1st page
    cy.get('.sgi-chevron-left')
      .click();

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#selectedRows')
      .contains(expectedRows);

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(4);
      expect(win.console.log).to.be.calledWith('Previously Selected Rows: 3,5'); // from previous test
      expect(win.console.log).to.be.calledWith(`Selected Rows: ${expectedRows}`);
    });
  });

  it('should go to next page and still expect all rows selected in current page', () => {
    cy.get('.sgi-chevron-right')
      .click();

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);
  });

  it('should go to last page and still expect all rows selected in current page', () => {
    cy.get('.sgi-chevron-end')
      .click();

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 6 of 6');

    cy.get('#selectedRows')
      .should('contain', '0,2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107');
  });

  it('should uncheck first checkbox and expect the "Select All" button to be unchecked', () => {
    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('be.checked');

    cy.get('.slick-row:nth(0) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('not.be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 10);

    cy.get('#selectedRows')
      .should('contain', '2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,135,137,139,141,143,145,147,149,151,153,155,157');
  });

  it('should go back to first page and still expect all rows selected in current page', () => {
    cy.get('.sgi-chevron-start')
      .click();

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('not.be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 1 of 6');

    cy.get('#selectedRows')
      .should('contain', '1,3,5,7,9,11,13,15,17,19,21,23');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,135,137,139,141,143,145,147,149,151,153,155,157');
  });

  it('should go back to last page then re-select the first row and expect "Select All" to be checked', () => {
    cy.get('.sgi-chevron-end')
      .click();

    cy.get('.slick-row:nth(0) .slick-cell:nth(0) input[type=checkbox]')
      .click({ force: true });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('be.checked');

    cy.get('.slick-cell-checkboxsel input:checked')
      .should('have.length', 11);

    cy.get('.slick-pager-status')
      .contains('Showing page 6 of 6');

    cy.get('#selectedRows')
      .should('contain', '0,2,4,6,8,10,12,14,16,18,20,22,24');

    cy.get('#selectedIds')
      .should('contain', '9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107');
  });

  it('should have lower count of selected Ids after filtering data', () => {
    let prevSelectedIdsCount = 0;
    let newSelectedIdsCount = 0;
    let prevSelectedRowsCount = 0;
    let newSelectedRowsCount = 0;

    cy.get('#idsCount')
      .then($elm => {
        console.log($elm)
        prevSelectedIdsCount = +$elm[0].textContent;
        expect(prevSelectedIdsCount).to.be.greaterThan(0);
      });

    cy.get('#rowsCount')
      .then($elm => {
        console.log($elm)
        prevSelectedRowsCount = +$elm[0].textContent;
        expect(prevSelectedRowsCount).to.be.greaterThan(0);
        expect(prevSelectedIdsCount).not.to.be.eq(prevSelectedRowsCount);
      });

    cy.get('.slick-pager-status')
      .should('not.contain', 'Showing page 1 of 1');

    cy.get('#myGrid')
      .find('.slick-headerrow-column.l1.r1')
      .find('input')
      .type('5');

    cy.get('#idsCount')
      .then($elm => {
        newSelectedIdsCount = +$elm[0].textContent;
        expect(newSelectedIdsCount).to.be.lessThan(prevSelectedIdsCount);
      });

    cy.get('#rowsCount')
      .then($elm => {
        newSelectedRowsCount = +$elm[0].textContent;
      });

    cy.get('.slick-pager-status')
      .then($elm => {
        const pagerInfo = $elm[0].textContent;
        if (pagerInfo === 'Showing page 1 of 1') {
          expect(newSelectedIdsCount).to.be.eq(newSelectedRowsCount);
        }
      });
  });

  it('should clear all filters and expect 75 rows to be selected', () => {
    cy.get('[data-test="clear-filters"]').click();

    cy.get('.slick-headerrow-column')
      .children()
      .each(($child) => expect($child.text()).to.eq(''));

    cy.get('#idsCount')
      .then($elm => {
        const newSelectedIdsCount = +$elm[0].textContent;
        expect(newSelectedIdsCount).to.be.eq(75);
      });
  });

  it('should clear all filters & clear all row selections', () => {
    cy.get('[data-test="clear-filters"]').click();

    cy.get('.slick-headerrow-column')
      .children()
      .each(($child) => expect($child.text()).to.eq(''));

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#rowsCount')
      .then($elm => {
        const newSelectedRowsCount = +$elm[0].textContent;
        expect(newSelectedRowsCount).to.be.eq(0);
      });

    cy.get('#idsCount')
      .then($elm => {
        selectedIdsCount = +$elm[0].textContent;
        expect(selectedIdsCount).to.be.eq(0);
      });
  });

  it('should filter data with text having "5" to show on a single page and then click on "Select All" checkbox', () => {
    cy.get('#myGrid')
      .find('.slick-headerrow-column.l1.r1')
      .find('input')
      .type('5');

    cy.get('.slick-pager-status')
      .should('contain', 'Showing page 1 of 1');

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .click({ force: true });

    cy.get('#idsCount')
      .then($elm => {
        selectedIdsCount = +$elm[0].textContent;
        expect(selectedIdsCount).to.be.greaterThan(0);
      });
  });

  it('should remove filter and not expect "Select All" checkbox to be selected but still expect same selected Ids', () => {
    let newSelectedIdsCount = 0;
    cy.get('[data-test="clear-filters"]').click();

    cy.get('.slick-headerrow-column')
      .children()
      .each(($child) => expect($child.text()).to.eq(''));

    cy.get('#idsCount')
      .then($elm => {
        newSelectedIdsCount = +$elm[0].textContent;
        expect(newSelectedIdsCount).to.be.eq(selectedIdsCount);
      });

    cy.get('#rowsCount')
      .then($elm => {
        const newSelectedRowsCount = +$elm[0].textContent;
        expect(newSelectedRowsCount).not.to.be.eq(newSelectedIdsCount);
      });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('not.be.checked');
  });

  it('should sort and expect same selected Ids as previous test', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .click();

    cy.get('#idsCount')
      .then($elm => {
        expect(+$elm[0].textContent).to.be.eq(selectedIdsCount);
      });
  });

  it('should revert back to the same filter as before and still expect the same selected Ids to be selected again', () => {
    cy.get('#myGrid')
      .find('.slick-headerrow-column.l1.r1')
      .find('input')
      .type('5');

    cy.get('.slick-pager-status')
      .should('contain', 'Showing page 1 of 1');

    cy.get('#idsCount')
      .then($elm => {
        selectedIdsCount = +$elm[0].textContent;
        expect(selectedIdsCount).to.be.greaterThan(0);
      });

    cy.get('#filter-checkbox-selectall-container input[type=checkbox]')
      .should('be.checked');
  });
});