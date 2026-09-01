describe('SlickGrid Auto Header Height - Autosize', () => {

  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-auto-header-height-autosize.html`);
    cy.get('#myGrid .slick-viewport', { timeout: 1000 }).should('be.visible');
  });

  describe('Header Content', () => {

    it('should render plain text headers', () => {
      cy.get('.slick-header-column').eq(1).find('.slick-column-name')
        .should('contain.text', 'Customer');
    });

    it('should render HTML string headers without clipping', () => {
      cy.get('.slick-header-column').eq(1).should(($header) => {
        const element = $header[0] as HTMLElement;

        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });

      cy.get('.slick-header-column').eq(1).find('.slick-column-name strong')
        .should('contain.text', 'Information');
    });

    it('should render DOM element headers without clipping', () => {
      cy.get('.slick-header-column').eq(3).should(($header) => {
        const element = $header[0] as HTMLElement;

        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });

      cy.get('.slick-header-column').eq(3).find('.slick-column-name strong')
        .should('contain.text', 'Information');
    });

    it('should not clip any rendered header content', () => {
      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

  });

  describe('Auto Header Height', () => {

    it('should expand the header when autoHeaderHeight is enabled', () => {
      cy.get('#autoHeaderHeight').should('be.checked');

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(35);
      });
    });

    it('should return to the normal header height when disabled', () => {
      let expandedHeight = 0;

      cy.get('.slick-header-columns').then(($header) => {
        expandedHeight = $header[0].offsetHeight;
      });

      cy.get('#autoHeaderHeight').uncheck();
      cy.get('#applyOptions').click();

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.lessThan(expandedHeight);
      });
    });

    it('should restore the expanded header when re-enabled', () => {
      cy.get('#autoHeaderHeight').uncheck();
      cy.get('#applyOptions').click();

      let normalHeight = 0;

      cy.get('.slick-header-columns').then(($header) => {
        normalHeight = $header[0].offsetHeight;
      });

      cy.get('#autoHeaderHeight').check();
      cy.get('#applyOptions').click();

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(normalHeight);
      });
    });

    it('should not clip headers after toggling autoHeaderHeight repeatedly', () => {
      for (let i = 0; i < 3; i++) {
        cy.get('#autoHeaderHeight').uncheck();
        cy.get('#applyOptions').click();

        cy.get('#autoHeaderHeight').check();
        cy.get('#applyOptions').click();
      }

      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

  });

  describe('IgnoreViewport Autosizing', () => {

    it('should apply IgnoreViewport autosizing', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#applyOptions').click();

      cy.get('.slick-header-column').should('have.length', 5);

      cy.get('.slick-header-column').each(($header) => {
        expect($header.outerWidth()).to.be.greaterThan(0);
      });
    });

    it('should recalculate header height after IgnoreViewport autosizes columns', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#applyOptions').click();

      // The important requirement is that header content remains fully visible
      // after autosizing changes the column widths and triggers header measurement.
      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(0);
      });
    });

  });

  describe('ignoreHeaderText', () => {

    it('should initially ignore header text during autosizing', () => {
      cy.get('#ignoreHeaderText').should('be.checked');
    });

    it('should remain valid when header text is ignored during autosizing', () => {
      cy.get('#ignoreHeaderText').check();
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#applyOptions').click();

      cy.get('.slick-header-column').eq(4).should(($header) => {
        const element = $header[0] as HTMLElement;

        expect(element.offsetWidth).to.be.greaterThan(0);
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

    it('should maintain valid header measurement when ignoreHeaderText is enabled', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#ignoreHeaderText').check();
      cy.get('#applyOptions').click();

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(0);
      });

      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

  });

  describe('Column Autosizing', () => {

    it('should maintain valid header height after autosizing columns', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#applyOptions').click();

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(0);
      });

      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

    it('should remain functional after autosizing', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#applyOptions').click();

      cy.get('.slick-row:first-child .slick-cell:first-child').first().click()
        .should('have.class', 'active');

      cy.get('.slick-viewport').first().scrollTo('bottom');

      cy.get('.slick-viewport').first().should(($viewport) => {
        expect($viewport[0].scrollTop).to.be.greaterThan(0);
      });
    });

  });

  describe('LegacyForceFit', () => {

    it('should not cause recursive rendering with autoHeaderHeight enabled', () => {
      cy.get('#autosizeMode').select('LegacyForceFit');
      cy.get('#applyOptions').click();

      cy.get('#myGrid').should('be.visible');

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(0);
      });
      cy.get('.slick-row').should('exist');
    });

    it('should respond to container resize in LegacyForceFit without clipping or recursion', () => {
      cy.get('#autosizeMode').select('LegacyForceFit');
      cy.get('#applyOptions').click();

      cy.get('#gridWidth').invoke('val', 800).trigger('input');

      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;

        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });

      cy.get('.slick-header-columns').should(($header) => {
        expect($header[0].offsetHeight).to.be.greaterThan(0);
      });
      cy.get('.slick-row').should('exist');
    });
  });

  describe('Combined Header Content and Autosizing', () => {

    it('should support HTML and DOM headers with IgnoreViewport', () => {
      cy.get('#autosizeMode').select('IgnoreViewport');
      cy.get('#ignoreHeaderText').check();
      cy.get('#applyOptions').click();

      // HTML header.
      cy.get('.slick-header-column').eq(1).find('.slick-column-name strong')
        .should('contain.text', 'Information');

      // DOM header.
      cy.get('.slick-header-column').eq(3).find('.slick-column-name strong')
        .should('contain.text', 'Information');

      // Every header must still fit its content.
      cy.get('.slick-header-column').each(($header) => {
        const element = $header[0] as HTMLElement;
        expect(element.scrollHeight).to.be.lte(element.clientHeight + 1);
      });
    });

  });

});
