describe('Example - Excel-compatible spreadsheet and Cell Selection', { retries: 0 }, () => {
  const cellHeight = 25;

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-excel-compatible-spreadsheet.html`);
  });

  it('should click on cell B2, copy value, ArrowDown, paste value, ArrowRight, and expect to be in column C', () => {
    cy.getCell(2, 2, '', { parentSelector: '#myGrid', rowHeight: cellHeight })
      .as('cell_B2')
      .click();

    cy.get('.slick-cell.active')
      .realPress(['Control', 'C']);

    cy.get('.slick-cell.active')
      .type('{downarrow}');

    cy.get('.slick-cell.active')
      .realPress(['Control', 'V']);

    cy.get('.slick-cell.active')
      .type('{rightarrow}');

    cy.get('#myGrid .slick-cell.l3.r3.selected')
      .should('have.length', 1);

    cy.getCell(3, 2, '', { parentSelector: '#myGrid', rowHeight: cellHeight })
      .should('have.text', '3');
  });

  describe('Basic Key Navigations', () => {
    it('should start at B1 and type "PageDown" key once and be on B12', () => {
      cy.get('#myGrid [data-row=0] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}');
      cy.get('#myGrid [data-row=11] > .slick-cell.l2.r2.active').should('have.length', 1);
    });

    it('should start at B12 and type "PageDown" key 2x times and "PageUp" once be on B23', () => {
      cy.get('#myGrid [data-row=11] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pageup}');
      cy.get('#myGrid [data-row=22] > .slick-cell.l2.r2.active').should('have.length', 1);
    });

    it('should start at B23 and type "PageDown" 2x times then "Ctrl+Home" and be on 0,0', () => {
      cy.get('#myGrid [data-row=22] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{ctrl}{home}');
      cy.get('#myGrid [data-row=0] > .slick-cell.l0.r0.active').should('have.length', 1);
    });

    it('should start at B1 and type "PageDown" key 3x times and then "Ctrl+UpArrow" and be on B1', () => {
      cy.get('#myGrid [data-row=0] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{pagedown}{pagedown}{pagedown}{ctrl}{uparrow}');
      cy.get('#myGrid [data-row=0] > .slick-cell.l2.r2.active').should('have.length', 1);
    });

    it('should start at 0,0 and type "Ctrl+End" on bottom right at Z99', () => {
      cy.get('#myGrid [data-row=0] > .slick-cell.l2.r2').as('active_cell').click();
      cy.get('@active_cell').type('{ctrl}{end}');
      cy.get('#myGrid [data-row=99] > .slick-cell.l26.r26.active').should('have.length', 1);
    });
  });
});
