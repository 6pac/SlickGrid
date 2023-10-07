describe('Example - Spreadsheet with DataView and Cell Selection', { retries: 0 }, () => {
  const cellHeight = 25;
  const titles = [
    '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK'
  ];

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-spreadsheet-dataview.html`);
  });

  it('should have exact column titles on grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => {
        if (index < titles.length) {
          expect($child.text()).to.eq(titles[index]);
        }
      });
  });

  describe('no Pagination - showing all', () => {
    it('should click on cell B10 and ArrowUp 3 times and ArrowDown 1 time and expect cell selection B8-B10', () => {
      cy.getCell(10, 2, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_B10')
        .click();

      cy.get('@cell_B10')
        .type('{shift}{uparrow}{uparrow}{uparrow}{downarrow}');

      cy.get('.slick-cell.l2.r2.selected')
        .should('have.length', 3);

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":8,"fromCell":2,"toCell":2,"toRow":10}');
    });

    it('should click on cell D10 then PageDown 2 times w/selection D10-D46 ', () => {
      cy.getCell(10, 4, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_D10')
        .click();

      cy.get('@cell_D10')
        .type('{shift}{pagedown}{pagedown}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":46}');
    });

    it('should click on cell D10 then PageDown 3 times then PageUp 1 time w/selection D10-D46', () => {
      cy.getCell(10, 4, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_D10')
        .click();

      cy.get('@cell_D10')
        .type('{shift}{pagedown}{pagedown}{pagedown}{pageup}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":46}');
    });

    it('should click on cell E12 then End key w/selection E46-E99', () => {
      cy.getCell(46, 5, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_E46')
        .click();

      cy.get('@cell_E46')
        .type('{shift}{end}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":46,"fromCell":5,"toCell":5,"toRow":99}');
    });

    it('should click on cell C85 then End key w/selection C0-C85', () => {
      cy.getCell(85, 3, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_C85')
        .click();

      cy.get('@cell_C85')
        .type('{shift}{home}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":0,"fromCell":3,"toCell":3,"toRow":85}');
    });
  });

  describe('with Pagination', () => {
    it('should show Page of size 25', () => {
      cy.get('.slick-pager-settings .sgi-lightbulb').click();
      cy.get('[data-val="25"]').click();
    });

    it('should click on cell B14 then Shift+End w/selection B14-24', () => {
      cy.getCell(14, 2, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_B14')
        .click();

      cy.get('@cell_B14')
        .type('{shift}{end}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":14,"fromCell":2,"toCell":2,"toRow":24}');
    });

    it('should click on cell C19 then Shift+End w/selection C0-19', () => {
      cy.getCell(19, 2, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_C19')
        .click();

      cy.get('@cell_C19')
        .type('{shift}{home}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":0,"fromCell":2,"toCell":2,"toRow":19}');
    });

    it('should click on cell E3 then Shift+PageDown multiple times with current page selection starting at E3 w/selection E3-24', () => {
      cy.getCell(3, 5, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_E3')
        .click();

      cy.get('@cell_E3')
        .type('{shift}{pagedown}{pagedown}{pagedown}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":3,"fromCell":5,"toCell":5,"toRow":24}');
    });

    it('should change to 2nd page then click on cell D41 then Shift+PageUp multiple times with current page selection w/selection D25-41', () => {
      cy.get('.slick-pager .sgi-chevron-right').click();

      cy.getCell(15, 4, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
        .as('cell_D41')
        .click();

      cy.get('@cell_D41')
        .type('{shift}{pageup}{pageup}{pageup}');

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":0,"fromCell":4,"toCell":4,"toRow":15}');
    });
  });
});
