describe('Example - Spreadsheet and Cell Selection', { retries: 0 }, () => {
  const GRID_ROW_HEIGHT = 25;
  const titles = [
    '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK'
  ];

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-frozen-columns-and-rows-spreadsheet.html`);
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

  it('should click on cell B5 (top left canvas) and ArrowUp 1 times and ArrowDown 3 time and expect cell selection B5-B8 (from top left canvas to bottom left canvas', () => {
    cy.get(`.grid-canvas-top.grid-canvas-left .slick-row[style="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l2.r2`)
      .as('cell_B5')
      .click();

    cy.get('@cell_B5')
      .type('{shift}{uparrow}{downarrow}{downarrow}{downarrow}{downarrow}', { release: false });

    cy.get('.slick-cell.l2.r2.selected')
      .should('have.length', 4);

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":5,"fromCell":2,"toCell":2,"toRow":8}');
  });

  it('should click on cell E5 (top right canvas) then PageDown 2 times w/selection E5-F41 (bottom right canvas', () => {
    cy.get(`.grid-canvas-top.grid-canvas-right .slick-row[style="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell.l5.r5`)
      .as('cell_E5')
      .click();

    cy.get('@cell_E5')
      .type('{shift}{rightarrow}{pagedown}{pagedown}', { release: false });

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":5,"fromCell":5,"toCell":6,"toRow":41}');
  });

  it('should click on cell F40 then Shift+Ctrl+Home and expect selection A0-F40', () => {
    cy.get(`.grid-canvas-bottom.grid-canvas-right .slick-row[style="top: ${GRID_ROW_HEIGHT * 33}px;"] > .slick-cell.l6.r6`)
      .as('cell_F40')
      .click();

    cy.get('@cell_F40')
      .type('{shift}{ctrl}{home}', { release: false });

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":0,"fromCell":0,"toCell":6,"toRow":40}');
  });

  it('should click on cell F40 then Shift+Ctrl+End and expect selection of F40-CV98', () => {
    cy.get(`.grid-canvas-bottom.grid-canvas-right .slick-row[style="top: ${GRID_ROW_HEIGHT * 33}px;"] > .slick-cell.l5.r5`)
      .as('cell_F40')
      .click();

    cy.get('@cell_F40')
      .type('{shift}{ctrl}{end}', { release: false });

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":40,"fromCell":5,"toCell":100,"toRow":99}');
  });

  it('should click on cell CS95 then Ctrl+A and expect selection of A0-CV98', () => {
    cy.get(`.grid-canvas-bottom.grid-canvas-right .slick-row[style="top: ${GRID_ROW_HEIGHT * 89}px;"] > .slick-cell.l95.r95`)
      .as('cell_CS95')
      .click();

    cy.get('@cell_CS95')
      .type('{ctrl}{A}', { release: false });

    cy.get('#selectionRange')
      .should('have.text', '{"fromRow":0,"fromCell":0,"toCell":100,"toRow":99}');
  });
});
