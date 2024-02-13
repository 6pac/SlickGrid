describe('Example - Real-Time Trading Platform', () => {
  const titles = ['Currency', 'Symbol', 'Market', 'Company', 'Type', 'Change', 'Price', 'Qty', 'Amount', 'Price History', 'Execution Timestamp'];
  const GRID_ROW_HEIGHT = 28;

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-trading-esm.html`);
    cy.get('h2').contains('Demonstrates');
    cy.get('h2 + ul > li').first().contains('High Frequency Update - Realtime Trading Platform');
  });

  it('should have exact column titles on 1st grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should check first 5 rows and expect certain data', () => {
    for (let i = 0; i < 5; i++) {
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(0)`).contains(/AUD|CAD|USD$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(4)`).contains(/Buy|Sell$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(5)`).contains(/\$\(?[0-9\.]*\)?/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(6)`).contains(/\$[0-9\.]*/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(7)`).contains(/\d$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(8)`).contains(/\$[0-9\.]*/);
    }
  });

  it('should find multiple green & pink backgrounds to show gains & losses when in real-time mode', () => {
    cy.get('#refreshRateSlider').invoke('val', 5).trigger('change');

    cy.get('.changed-gain').should('have.length.gt', 2);
    cy.get('.changed-loss').should('have.length.gt', 2);
  });

  it('should NOT find any green neither pink backgrounds when in real-time is stopped', () => {
    cy.get('#highlightDuration').type('{backspace}');
    cy.get('#btnStopSimulation').click();

    cy.wait(5);
    cy.get('.changed-gain').should('have.length', 0);
    cy.get('.changed-loss').should('have.length', 0);
    cy.wait(1);
    cy.get('.changed-gain').should('have.length', 0);
    cy.get('.changed-loss').should('have.length', 0);
  });

  it('should Group by "Currency" and expect 3 groups with Totals when collapsed', () => {
    cy.get('[data-test="group-currency-btn"]').click();
    cy.get('[data-test="collapse-all-btn"]').click();

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 0}px;"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Currency: AUD');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 1}px;"] > .slick-cell:nth(8)`).contains(/\$[0-9\,\.]*/);

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 2}px;"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Currency: CAD');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 3}px;"] > .slick-cell:nth(8)`).contains(/\$[0-9\,\.]*/);

    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(0) .slick-group-toggle.collapsed`).should('have.length', 1);
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 4}px;"] > .slick-cell:nth(0) .slick-group-title`).should('contain', 'Currency: USD');
    cy.get(`[style="top: ${GRID_ROW_HEIGHT * 5}px;"] > .slick-cell:nth(8)`).contains(/\$[0-9\,\.]*/);
  });

  it('should clear Grouping and expect regular trading row from non specific currency', () => {
    cy.get('[data-test="clear-grouping-btn"]').click();

    for (let i = 0; i < 5; i++) {
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(0)`).contains(/AUD|CAD|USD$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(4)`).contains(/Buy|Sell$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(5)`).contains(/\$\(?[0-9\.]*\)?/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(6)`).contains(/\$[0-9\.]*/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(7)`).contains(/\d$/);
      cy.get(`[style="top: ${GRID_ROW_HEIGHT * i}px;"] > .slick-cell:nth(8)`).contains(/\$[0-9\.]*/);
    }
  });
});
