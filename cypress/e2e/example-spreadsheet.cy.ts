describe('Example - Spreadsheet and Cell Selection', { retries: 0 }, () => {
  const cellHeight = 25;
  const titles = [
    '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK'
  ];

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-spreadsheet.html`);
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

  it('should click on cell E46 then Shift+End key with full row horizontal selection E46-CV46', () => {
    cy.getCell(46, 5, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .as('cell_E46')
      .click();

    cy.get('@cell_E46')
      .type('{shift}{end}');

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":46,"fromCell":5,"toCell":100,"toRow":46}');
  });

  it('should click on cell CP54 then Ctrl+Shift+End keys with selection E46-CV99', () => {
    cy.getCell(54, 94, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .as('cell_CP54')
      .click();

    cy.get('@cell_CP54')
      .type('{ctrl}{shift}{end}');

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":54,"fromCell":94,"toCell":100,"toRow":99}');
  });

  it('should click on cell CP95 then Ctrl+Shift+Home keys with selection C0-CP95', () => {
    cy.getCell(95, 98, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .as('cell_CP95')
      .click();

    cy.get('@cell_CP95')
      .type('{ctrl}{shift}{home}');

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":0,"fromCell":0,"toCell":98,"toRow":95}');
  });

  it('should click on cell CR5 then Ctrl+Home keys and expect to scroll back to cell A0 without any selection range', () => {
    cy.getCell(5, 95, '', { parentSelector: "#myGrid", rowHeight: cellHeight })
      .as('cell_CR95')
      .click();

    cy.get('@cell_CR95')
      .type('{ctrl}{home}');

    cy.get('#selectionRange')
      .should('have.text', '');
  });
});
