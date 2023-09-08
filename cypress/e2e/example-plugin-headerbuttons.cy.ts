describe('Example - Header Button', () => {
  const titles = ['Resize me!', 'Hover me!', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-plugin-headerbuttons.html`);
    cy.get('p').contains('This example demonstrates using the Slick.Plugins.HeaderButtons plugin');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should go over the 3rd column "C" and expect to see negative number in red after clicking on the orange header button', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(2)')
      .should('contain', 'C');

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(2)')
      .find('.slick-header-button.sgi-lightbulb.color-orange')
      .should('exist')
      .click();

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(1);
      expect(win.console.log).to.be.calledWith(`execute a callback action to "toggle-highlight" on column C`);
    });

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($row, index) => {
        if (index > 10) {
          return; // check only the first 10 rows is enough
        }
        cy.wrap($row).children('.slick-cell:nth(2)')
          .each($cell => {
            const numberValue = $cell.text();
            const htmlValue = $cell.html();
            if (+numberValue < 0) {
              expect(htmlValue).to.eq(`<div style="color:red; font-weight:bold;">${numberValue}</div>`);
            } else {
              expect(htmlValue).to.eq(numberValue);
            }
          });
      });
  });

  it('should go over the 5th column "E" and not find the orange header button', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(4)')
      .should('contain', 'E');

    // column E should not have the icon
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(4)')
      .find('.slick-header-button')
      .should('not.exist');
  });

  it('should go over the last column "J" and expect to find the orange header button, however it should be unusable and number should not display as red', () => {
    cy.get('.slick-viewport-top.slick-viewport-left')
      .scrollTo('right')
      .wait(50);

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(9)')
      .should('contain', 'J');

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(9)')
      .find('.slick-header-button.sgi-lightbulb.color-orange')
      .should('exist')
      .click();

    cy.get('#myGrid')
      .find('.slick-row')
      .each(($row, index) => {
        if (index > 10) {
          return;
        }
        cy.wrap($row).children('.slick-cell:nth(9)')
          .each($cell => expect($cell.html()).to.eq($cell.text()));
      });
  });

  it('should resize 1st column and make it wider', () => {
    cy.get('.slick-viewport-top.slick-viewport-left')
      .scrollTo('left')
      .wait(50);

    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .should('contain', 'Resize me!');

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .find('.slick-header-button:nth(3)')
      .should('be.hidden');

    // Cypress does not yet support the .hover() method and because of that we need to manually resize the element
    // this is not ideal since it only resizes the cell not the entire column but it's enough to test the functionality
    cy.get('.slick-header-column:nth(0)')
      // resize the 1st column
      .each($elm => $elm.width(140))
      .find('.slick-resizable-handle')
      .should('be.visible')
      .invoke('show');

    cy.get('.slick-header-column:nth(0)')
      .should($el => expect(parseInt(`${$el.width()}`, 10)).to.eq(140));

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .find('.slick-header-button')
      .should('have.length', 4);
  });

  it('should click on first "Red Tag Day" header button and expect an alert with that text when clicked', (done) => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.on('window:alert', (text) => {
      expect(text).to.eq('command: Red Tag Day');
      done();
    });

    // header buttons are displayed in inverse mode by default,
    // so we need to start at the end
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .find('.slick-header-button:nth(3)')
      .click();
  });

  it('should click on second "Write a comment!" header button and expect an alert with that text when clicked', (done) => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.on('window:alert', (text) => {
      expect(text).to.eq('Write a comment!');
      done();
    });

    // header buttons are displayed in inverse mode by default
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(0)')
      .find('.slick-header-button:nth(2)')
      .click();
  });

  it('should go on the 2nd column "Hover me!" and expect the header button to appear only when doing hover over it', () => {
    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .should('contain', 'Hover me!');

    cy.get('.slick-header-columns')
      .children('.slick-header-column:nth(1)')
      .find('.slick-header-button.slick-header-button-hidden')
      .should('be.hidden')
      .should('have.css', 'width', '0px');

    // hover is not yet implemented in Cypress, so the following test won't work until then
    // cy.get('.slick-header-columns')
    //   .children('.slick-header-column:nth(1)')
    //   .trigger('mouseover')
    //   .hover()
    //   .find('.slick-header-button')
    //   .should('have.css', 'width', '15px');
  });
});
