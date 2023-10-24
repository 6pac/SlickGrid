describe('Example - Header Menu', () => {
  const titles = ['Title', 'Duration', '% Complete', 'Start', 'Finish', 'Effort Driven'];

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-plugin-headermenu.html`);
    cy.get('p').contains('This example demonstrates using the Slick.Plugins.HeaderMenu');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should open the Header Menu on the "Title" column and expect onBeforeMenuShow then onAfterMenuShow to show in the console log', () => {
    cy.get('#myGrid')
      .find('.slick-header-column')
      .first()
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Before the Header Menu is shown');
      expect(win.console.log).to.be.calledWith('After the Header Menu is shown');
    });
  });

  it('should open the Header Menu on the "Title" column and expect Sort & Hide commands to be disabled', () => {
    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Sort Ascending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Sort Descending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Hide')
      .should('exist');
  });

  it(`should be still be able to click on the Help button and expect an alert`, () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('.slick-header-menuitem.bold')
      .find('.slick-header-menucontent.blue')
      .contains('Help')
      .click()
      .then(() => expect(alertStub.getCall(0)).to.be.calledWith('Command: help'));

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(1);
      expect(win.console.log).to.be.calledWith('execute an action on Help');
    });
  });

  it('should hover over the "Duration" column and expect Sort commands to be enabled', () => {
    cy.get('#myGrid')
      .find('.slick-header-column:nth(1)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Sort Ascending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Sort Descending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Hide')
      .should('exist');
  });

  it('should execute "Sort Ascending" command from the left opened menu', () => {
    cy.get('.slick-header-menu')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Sort Ascending')
      .click();

    cy.get('.slick-header-column:nth(1).slick-header-sortable.slick-header-column-sorted')
      .find('.slick-sort-indicator.slick-sort-indicator-asc')
      .should('exist');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('0 days');
  });

  it('should hover over "% Complete" and not expect to find the Help menu', () => {
    cy.get('#myGrid')
      .find('.slick-header-column:nth(2)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.get('.slick-header-menu')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Help')
      .should('not.exist');
  });

  it('should execute "Sort Descending" command from the menu left open and expect 2 sort icons afterward', () => {
    cy.get('.slick-header-menu')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Sort Descending')
      .click();

    cy.get('.slick-header-column:nth(1).slick-header-sortable.slick-header-column-sorted')
      .find('.slick-sort-indicator.slick-sort-indicator-asc')
      .should('exist');

    cy.get('.slick-header-column:nth(2).slick-header-sortable.slick-header-column-sorted')
      .find('.slick-sort-indicator.slick-sort-indicator-desc')
      .should('exist');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('0 days');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(2)')
      .each($row => {
        expect(+$row.text()).to.be.greaterThan(60);
      });
  });

  it('should hover over the "Effort Driven" column and expect Sort & Hide commands to be disabled', () => {
    cy.get('#myGrid')
      .find('.slick-header-column:nth(5)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .should('be.hidden')
      .invoke('show')
      .click();

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Sort Ascending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Sort Descending')
      .should('exist');

    cy.get('.slick-header-menuitem.slick-header-menuitem-disabled')
      .contains('Hide')
      .should('exist');
  });

  it('should open Freeze/Pinning sub-menu with 2 options expect it to be aligned to left then trigger alert when command is clicked', () => {
    const subCommands = ['Freeze Columns', 'Unfreeze all Columns'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('.slick-header-menuitem.slick-header-menuitem')
      .contains('Freeze/Pinning')
      .should('exist')
      .click();

    cy.get('.slick-header-menu.slick-menu-level-1.dropleft')
      .should('exist')
      .find('.slick-header-menuitem')
      .each(($command, index) => expect($command.text()).to.eq(subCommands[index]));

    cy.get('.slick-header-menu.slick-menu-level-1')
      .find('.slick-header-menuitem')
      .contains('Freeze Columns')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command: freeze-columns'));
  });

  it('should open Freeze/Pinning sub-menu and expect 2 options, then open Feedback->ContactUs sub-menus and expect previous Freeze menu to no longer exists', () => {
    const subCommands1 = ['Freeze Columns', 'Unfreeze all Columns'];
    const subCommands2 = ['Column is great', 'Column is not useful', '', 'Contact Us'];
    const subCommands2_1 = ['Email us', 'Chat with us', 'Book an appointment'];

    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-header-column:nth(5)')
      .trigger('mouseover')
      .children('.slick-header-menubutton')
      .invoke('show')
      .click();

    cy.get('.slick-header-menu.slick-menu-level-0')
      .find('.slick-header-menuitem.slick-header-menuitem')
      .contains('Freeze/Pinning')
      .should('exist')
      .click();

    cy.get('.slick-submenu').should('have.length', 1);
    cy.get('.slick-header-menu.slick-menu-level-1.dropleft') // left align
      .should('exist')
      .find('.slick-header-menuitem')
      .each(($command, index) => expect($command.text()).to.eq(subCommands1[index]));

    // click different sub-menu
    cy.get('.slick-header-menu.slick-menu-level-0')
      .find('.slick-header-menuitem.slick-header-menuitem')
      .contains('Feedback')
      .should('exist')
      .trigger('mouseover'); // mouseover or click should work

    cy.get('.slick-submenu').should('have.length', 1);
    cy.get('.slick-header-menu.slick-menu-level-1')
      .should('exist')
      .find('.slick-header-menuitem')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2[index]));

    // click on Feedback->ContactUs
    cy.get('.slick-header-menu.slick-menu-level-1.dropleft') // left align
      .find('.slick-header-menuitem.slick-header-menuitem')
      .contains('Contact Us')
      .should('exist')
      .click();

    cy.get('.slick-submenu').should('have.length', 2);
    cy.get('.slick-header-menu.slick-menu-level-2.dropright') // right align
      .should('exist')
      .find('.slick-header-menuitem')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2_1[index]));

    cy.get('.slick-header-menu.slick-menu-level-2')
      .find('.slick-header-menuitem')
      .contains('Chat with us')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command: contact-chat'));

    cy.get('.slick-submenu').should('have.length', 0);
  });
});
