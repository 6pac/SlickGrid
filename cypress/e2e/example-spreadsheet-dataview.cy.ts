describe('Example - Spreadsheet with DataView and Cell Selection', { retries: 0 }, () => {
  const GRID_ROW_HEIGHT = 25;
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

  describe('no pagination - basic key navigations', () => {
    it('should start at D10, then type "Arrow Up" key and expect active cell to become D9', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{uparrow}');
      cy.get('[data-row=9] .slick-cell.l4.r4.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":9,"fromCell":4,"toCell":4,"toRow":9}');
    });

    it('should start at D10, then type "Arrow Down" key and expect active cell to become D11', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{downarrow}');
      cy.get('[data-row=11] .slick-cell.l4.r4.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":11,"fromCell":4,"toCell":4,"toRow":11}');
    });

    it('should start at D10, then type "Arrow Left" key and expect active cell to become C10', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{leftarrow}');
      cy.get('[data-row=10] .slick-cell.l3.r3.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":3,"toCell":3,"toRow":10}');
    });

    it('should start at D10, then type "Arrow Right" key and expect active cell to become E10', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{rightarrow}');
      cy.get('[data-row=10] .slick-cell.l5.r5.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":5,"toCell":5,"toRow":10}');
    });

    it('should start at D10, then type "Home" key and expect active cell to become CV10', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{end}');
      cy.get('[data-row=10] .slick-cell.l100.r100.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":100,"toCell":100,"toRow":10}');
    });

    it('should start at D10, then type "Home" key and expect active cell to become {A-1}10', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":10}');
      cy.get('[data-row=10] .slick-cell.l4.r4.selected').should('have.length', 1);

      cy.get('@cell_D10').type('{home}');
      cy.get('[data-row=10] .slick-cell.l0.r0.selected').should('have.length', 1);
      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":0,"toCell":0,"toRow":10}');
    });
  });

  describe('no Pagination - showing all', () => {
    it('should click on cell B10 and ArrowUp 3 times and ArrowDown 1 time and expect cell selection B8-B10', () => {
      cy.getCell(10, 2, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_B10')
        .click();

      cy.get('@cell_B10')
        .type('{shift}{uparrow}{uparrow}{uparrow}{downarrow}', { release: false });

      cy.get('.slick-cell.l2.r2.selected')
        .should('have.length', 3);

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":8,"fromCell":2,"toCell":2,"toRow":10}');
    });

    it('should click on cell D10 then PageDown 2 times w/selection D10-D46 ', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('@cell_D10')
        .type('{shift}{pagedown}{pagedown}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":46}');
    });

    it('should click on cell D10 then PageDown 3 times then PageUp 1 time w/selection D10-D46', () => {
      cy.getCell(10, 4, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_D10')
        .click();

      cy.get('@cell_D10')
        .type('{shift}{pagedown}{pagedown}{pagedown}{pageup}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":10,"fromCell":4,"toCell":4,"toRow":46}');
    });

    it('should click on cell E46 then Shift+End key with full row horizontal selection E46-CV46', () => {
      cy.getCell(46, 5, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_E46')
        .click();

      cy.get('@cell_E46')
        .type('{shift}{end}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":46,"fromCell":5,"toCell":100,"toRow":46}');
    });

    it('should click on cell CP54 then Ctrl+Shift+End keys with selection E46-CV99', () => {
      cy.getCell(54, 94, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CP54')
        .click();

      cy.get('@cell_CP54')
        .type('{ctrl}{shift}{end}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":54,"fromCell":94,"toCell":100,"toRow":99}');
    });

    it('should click on cell CP95 then Ctrl+Shift+Home keys with selection C0-CP95', () => {
      cy.getCell(95, 98, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CP95')
        .click();

      cy.get('@cell_CP95')
        .type('{ctrl}{shift}{home}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":0,"fromCell":0,"toCell":98,"toRow":95}');
    });

    it('should click on cell CR5 then Ctrl+Home keys and expect to scroll back to cell A0 without any selection range', () => {
      cy.getCell(5, 95, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CR95')
        .click();

      cy.get('@cell_CR95')
        .type('{ctrl}{home}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '');
    });

    it('should click on cell E10 then Shift+Home with selection A10-E10', () => {
      cy.getCell(10, 5, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_E10').click();

      cy.get('@cell_E10').type('{shift}{home}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":0,"toCell":5,"toRow":10}');
    });

    it('should click on cell E10 then Shift+End with selection E10-CV10', () => {
      cy.getCell(10, 5, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_E10').click();

      cy.get('@cell_E10').type('{shift}{end}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":5,"toCell":100,"toRow":10}');
    });

    it('should click on cell CN10 then Shift+Ctrl+ArrowLeft with selection A10-CN10', () => {
      cy.getCell(10, 92, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CN10').click();

      cy.get('@cell_CN10').type('{shift}{ctrl}{leftarrow}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":0,"toCell":92,"toRow":10}');
    });

    it('should click on cell CN10 then Shift+Ctrl+ArrowRight key with full row horizontal selection CN10-CV10', () => {
      cy.getCell(10, 92, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CN10').click();

      cy.get('@cell_CN10').type('{shift}{ctrl}{rightarrow}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":92,"toCell":100,"toRow":10}');
    });

    it('should click on cell CN10 then Shift+Ctrl+ArrowUp key with full column vertical top selection E0-CN10', () => {
      cy.getCell(10, 92, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CN10').click();

      cy.get('@cell_CN10').type('{shift}{ctrl}{uparrow}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":92,"toCell":92,"toRow":10}');
    });

    it('should click on cell CN10 then Shift+Ctrl+ArrowDown key with full column vertical bottom selection CN10-E99', () => {
      cy.getCell(10, 92, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CN10').click();

      cy.get('@cell_CN10').type('{shift}{ctrl}{downarrow}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":10,"fromCell":92,"toCell":92,"toRow":99}');
    });

    it('should click on cell CL91 then Ctrl+Shift+End keys with selection CL91-CV99', () => {
      cy.getCell(91, 90, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CL91').click();

      cy.get('@cell_CL91').type('{ctrl}{shift}{end}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":91,"fromCell":90,"toCell":100,"toRow":99}');
    });

    it('should click on cell CP91 again then Ctrl+A keys and expect to scroll select everything in the grid', () => {
      cy.getCell(91, 94, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_CP91').click();

      cy.get('@cell_CP91').type('{ctrl}{a}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":100,"toRow":99}');
    });

    it('should click on cell F92 then Ctrl+Home keys to navigate to 0,0 coordinates', () => {
      cy.getCell(92, 6, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT }).as('cell_F92').click();

      cy.get('@cell_F92').type('{ctrl}{home}', { release: false });

      cy.get('#selectionRange').should('have.text', '{"fromRow":0,"fromCell":0,"toCell":0,"toRow":0}');
    });
  });

  describe('with Pagination', () => {
    it('should show Page of size 25', () => {
      cy.get('.slick-pager-settings .sgi-lightbulb').click();
      cy.get('[data-val="25"]').click();
    });

    it('should click on cell B14 then Shift+End with selection B14-24', () => {
      cy.getCell(14, 2, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_B14')
        .click();

      cy.get('@cell_B14')
        .type('{shift}{end}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":14,"fromCell":2,"toCell":100,"toRow":14}');
    });

    it('should click on cell CS14 then Shift+Home with selection A14-CS14', () => {
      cy.getCell(14, 97, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CS14')
        .click();

      cy.get('@cell_CS14')
        .type('{shift}{home}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":14,"fromCell":0,"toCell":97,"toRow":14}');
    });

    it('should click on cell CN3 then Shift+PageDown multiple times with current page selection starting at E3 w/selection E3-24', () => {
      cy.getCell(3, 95, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CN3')
        .click();

      cy.get('@cell_CN3')
        .type('{shift}{pagedown}{pagedown}{pagedown}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":3,"fromCell":95,"toCell":95,"toRow":24}');
    });

    it('should change to 2nd page then click on cell CN41 then Shift+PageUp multiple times with current page selection w/selection D25-41', () => {
      cy.get('.slick-pager .sgi-chevron-right').click();

      cy.getCell(15, 92, '', { parentSelector: '#myGrid', rowHeight: GRID_ROW_HEIGHT })
        .as('cell_CN41')
        .click();

      cy.get('@cell_CN41')
        .type('{shift}{pageup}{pageup}{pageup}', { release: false });

      cy.get('#selectionRange')
        .should('have.text', '{"fromRow":0,"fromCell":92,"toCell":92,"toRow":15}');
    });
  });
});
