describe('Example - Context Menu & Cell Menu', () => {
  const fullTitles = ['#', 'Title', '% Complete', 'Start', 'Finish', 'Priority', 'Effort Driven', 'Action'];

  beforeEach(() => {
    // create a console.log spy for later use
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
  });

  it('should display Example Context Menu & Cell Menu', () => {
    cy.visit(`${Cypress.config('baseUrl')}/examples/example-plugin-contextmenu.html`);
    cy.get('h2').should('contain', 'Demonstrates:');
    cy.get('h2 span').should('contain', 'Slick.Plugins.ContextMenu / Slick.Plugins.CellMenu');
  });

  it('should have exact Column Titles in the grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  it('should have first row with "Task 0" and a Priority set to "Low" with the Action cell disabled and not clickable', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .contains('Low');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(6) .sgi-check')
      .should('exist');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7) .disabled')
      .contains('Action');

    cy.get('.slick-cell-menu')
      .should('not.exist');
  });

  it('should open the Context Menu and expect onBeforeMenuShow then onAfterMenuShow to show in the console log', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu-command-list')
      .should('exist');

    cy.get('.slick-context-menu-option-list')
      .should('not.exist');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Before the global Context Menu is shown');
      expect(win.console.log).to.be.calledWith('After the Context Menu is shown');
    });
  });

  it('should expect the Context Menu to not have the "Help" menu when there is Effort Driven set to True', () => {
    const commands = ['Copy Cell Value', 'Delete Row', '', 'Command (always disabled)', '', 'Export', 'Feedback'];

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu.dropright .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .each(($command, index) => {
        expect($command.text()).to.contain(commands[index]);
        expect($command.text()).not.include('Help');
      });
  });

  it('should expect the Context Menu to not have the "Help" menu when there is Effort Driven set to True', () => {
    const commands = ['Copy Cell Value', 'Delete Row', '', 'Command (always disabled)', '', 'Export', 'Feedback'];

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu.dropright .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .each(($command, index) => {
        expect($command.text()).to.contain(commands[index]);
        expect($command.text()).not.include('Help');
      });
  });

  it('should be able to click on the Context Menu (x) close button, on top right corner, to close the menu', () => {
    cy.get('.slick-context-menu.dropright')
      .should('exist');

    cy.get('.slick-context-menu button.close')
      .click();
  });

  it('should change "Task 0" Priority to "High" with Context Menu and expect the Action Menu to become clickable and usable', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu-command-list')
      .should('not.exist');

    cy.get('.slick-context-menu-option-list')
      .should('exist');

    cy.get('.slick-context-menu .slick-context-menu-option-list')
      .contains('High')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.dropleft')
      .should('exist');
  });

  it('should expect a "Command 2" to be disabled and not clickable (menu will remain open), in that same Action menu', () => {
    cy.get('.slick-cell-menu .slick-cell-menu-item.slick-cell-menu-item-disabled')
      .contains('Command 2')
      .click({ force: true });

    cy.get('.slick-cell-menu.dropleft')
      .should('exist');
  });

  it('should change the Effort Driven to "False" in that same Action and then expect the "Command 2" to be enabled and clickable', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-option-list')
      .find('.slick-cell-menu-item')
      .contains('False')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-item')
      .contains('Command 2')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command 2'));
  });

  it('should change the Effort Driven to "True" by using sub-options in that same Action and then expect the "Command 2" to be disabled and not clickable and "Delete Row" to not be shown', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-option-list')
      .find('.slick-cell-menu-item')
      .contains('Sub-Options')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-option-list').as('subMenuList');

    cy.get('@subMenuList')
      .find('.slick-menu-title')
      .contains('Set Effort Driven');

    cy.get('@subMenuList')
      .find('.slick-cell-menu-item')
      .contains('True')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-item.slick-cell-menu-item-disabled')
      .contains('Command 2');

    cy.get('.slick-cell-menu .slick-cell-menu-item')
      .contains('Delete Row')
      .should('not.exist');
  });

  it('should change the Effort Driven back to "False" by using sub-options in that same Action and then expect the "Command 2" to enabled and clickable and also show "Delete Row" command', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-option-list')
      .find('.slick-cell-menu-item')
      .contains('Sub-Options')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-option-list')
      .find('.slick-cell-menu-item')
      .contains('False')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-item')
      .contains('Delete Row')
      .should('exist');

    cy.get('.slick-cell-menu .slick-cell-menu-item')
      .contains('Command 2')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command 2'));
  });

  it('should expect the Context Menu now have the "Help" menu when Effort Driven is set to False', () => {
    const commands = ['Copy Cell Value', 'Delete Row', '', 'Help', 'Command (always disabled)', '', 'Export', 'Feedback'];

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(6)')
      .rightclick();

    cy.get('.slick-context-menu.dropleft .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(commands[index]));

    cy.get('.slick-context-menu button.close')
      .click();
  });

  it('should open the Cell Menu and expect onBeforeMenuShow then onAfterMenuShow to show in the console log', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.dropleft')
      .should('exist');

    cy.window().then((win) => {
      expect(win.console.log).to.have.callCount(2);
      expect(win.console.log).to.be.calledWith('Before the Cell Menu is shown');
      expect(win.console.log).to.be.calledWith('After the Cell Menu is shown');
    });
  });

  it('should be able to click on the Action Cell Menu (x) close button, on top right corner, to close the menu', () => {
    cy.get('.slick-cell-menu.dropleft')
      .should('exist');

    cy.get('.slick-cell-menu button.close')
      .click();

    cy.get('.slick-cell-menu.dropleft')
      .should('not.exist');
  });

  it('should be able to open Cell Menu and click on Export->Text sub-commands to see 1 cell menu + 1 sub-menu then clicking on Text should call alert action', () => {
    const subCommands = ['Text', 'Excel'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Export')
      .trigger('mouseover'); // mouseover or click should work

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands[index]));

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Text')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Exporting as Text'));
  });

  it('should be able to open Cell Menu and click on Export->Text and expect alert triggered with Text Export', () => {
    const subCommands1 = ['Text', 'Excel'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Text')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Exporting as Text'));
  });

  it('should be able to open Cell Menu and click on Export->Excel-> sub-commands to see 1 cell menu + 1 sub-menu then clicking on Text should call alert action', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Excel (csv)', 'Excel (xls)'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands1[index]));

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Excel')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-2 .slick-cell-menu-command-list').as('subMenuList2');

    cy.get('@subMenuList2')
      .find('.slick-menu-title')
      .contains('available formats');

    cy.get('@subMenuList2')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2[index]));

    cy.get('.slick-cell-menu.slick-menu-level-2 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Excel (xls)')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Exporting as Excel (xls)'));
  });

  it('should open Export->Excel sub-menu & open again Sub-Options on top and expect sub-menu to be recreated with that Sub-Options list instead of the Export->Excel list', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Excel (csv)', 'Excel (xls)'];
    const subOptions = ['True', 'False'];

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands1[index]));

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Excel')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-2 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2[index]));

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-option-list')
      .find('.slick-cell-menu-item')
      .contains('Sub-Options')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-option-list').as('optionSubList2');

    cy.get('@optionSubList2')
      .find('.slick-menu-title')
      .contains('Set Effort Driven');

    cy.get('@optionSubList2')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($option, index) => expect($option.text()).to.eq(subOptions[index]));
  });

  it('should open Export->Excel sub-menu then open Feedback->ContactUs sub-menus and expect previous Export menu to no longer exists', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Request update from supplier', '', 'Contact Us'];
    const subCommands2_1 = ['Email us', 'Chat with us', 'Book an appointment'];

    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.slick-menu-level-0 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-cell-menu.slick-menu-level-1 .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    // click different sub-menu
    cy.get('.slick-cell-menu.slick-menu-level-0')
      .find('.slick-cell-menu-item')
      .contains('Feedback')
      .should('exist')
      .trigger('mouseover'); // mouseover or click should work

    cy.get('.slick-submenu').should('have.length', 1);
    cy.get('.slick-cell-menu.slick-menu-level-1')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands2[index]));

    // click on Feedback->ContactUs
    cy.get('.slick-cell-menu.slick-menu-level-1.dropleft') // left align
      .find('.slick-cell-menu-item')
      .contains('Contact Us')
      .should('exist')
      .click();

    cy.get('.slick-submenu').should('have.length', 2);
    cy.get('.slick-cell-menu.slick-menu-level-2.dropright') // right align
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2_1[index]));

    cy.get('.slick-cell-menu.slick-menu-level-2');

    cy.get('.slick-cell-menu.slick-menu-level-2 .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item')
      .contains('Chat with us')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command: contact-chat'));
  });

  it('should click on the "Show Commands & Priority Options" button and see both list when opening Context Menu', () => {
    cy.get('button')
      .contains('Show Commands & Priority Options')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu .slick-context-menu-option-list')
      .should('exist')
      .contains('High');

    cy.get('.slick-context-menu-command-list')
      .find('.slick-context-menu-item.bold')
      .find('.slick-context-menu-content.red')
      .should('exist')
      .contains('Delete Row');

    cy.get('.slick-context-menu button.close')
      .click();
  });

  it('should click on the "Show Priority Options Only" button and see both list when opening Context Menu & selecting "Medium" option should be reflected in the grid cell and expect "Action" cell menu to be disabled', () => {
    cy.get('button')
      .contains('Show Priority Options Only')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu-command-list')
      .should('not.exist');

    cy.get('.slick-context-menu .slick-context-menu-option-list')
      .should('exist')
      .contains('Medium')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .contains('Medium');

    cy.get('.slick-row .slick-cell:nth(7)')
      .find('.cell-menu-dropdown.disabled')
      .should('exist');
  });

  it('should reopen Context Menu then select "High" option from sub-menu and expect "Action" cell menu to be reenabled', () => {
    const subOptions = ['Low', 'Medium', 'High'];

    cy.get('button')
      .contains('Show Priority Options Only')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-option-list')
      .find('.slick-context-menu-item')
      .contains('Sub-Options (demo)')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-option-list').as('subMenuList');

    cy.get('@subMenuList')
      .find('.slick-menu-title')
      .contains('Set Priority');

    cy.get('@subMenuList')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subOptions[index]));

    cy.get('@subMenuList')
      .find('.slick-context-menu-item')
      .contains('High')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .contains('High');

    cy.get('.slick-row .slick-cell:nth(7)')
      .find('.cell-menu-dropdown.disabled')
      .should('not.exist');
  });

  it('should click on the "Show Actions Commands & Effort Options" button and see both list when opening Action Cell Menu', () => {
    cy.get('button')
      .contains('Show Actions Commands & Effort Options')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-option-list')
      .should('exist')
      .contains('True');

    cy.get('.slick-cell-menu-command-list')
      .should('exist')
      .contains('Delete Row');

    cy.get('.slick-cell-menu button.close')
      .click();
  });

  it('should open the Action Cell Menu and expect the Effort Driven "null" option when this Effort is set to False', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu.dropleft')
      .should('exist');

    cy.get('.slick-cell-menu')
      .find('.slick-cell-menu-option-list')
      .find('.slick-cell-menu-content.italic')
      .contains('null');
  });

  it('should open the Action Cell Menu and not expect the Effort Driven "null" option when this Effort is set to True', () => {
    cy.get('.slick-cell-menu.dropleft')
      .should('exist');

    cy.get('.slick-cell-menu')
      .find('.slick-cell-menu-option-list')
      .contains('True')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu')
      .each($row => {
        expect($row.text()).not.include('null');
      });
  });

  it('should reset Effort Driven to False for the next test to include all commands', () => {
    cy.get('.slick-cell-menu')
      .find('.slick-cell-menu-option-list')
      .contains('False')
      .click();
  });

  it('should click on the "Show Action Commands Only" button and see both list when opening Cell Menu', () => {
    const commands = ['Command 1', 'Command 2', 'Delete Row', '', 'Help', 'Disabled Command', '', 'Export', 'Feedback'];

    cy.get('button')
      .contains('Show Action Commands Only')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-command-list')
      .should('exist')
      .find('.slick-cell-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(commands[index]));

    cy.get('.slick-cell-menu-option-list')
      .should('not.exist');

    cy.get('.slick-cell-menu button.close')
      .click();
  });

  it('should be able to delete first row by using the "Delete Row" command from the Context Menu', () => {
    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .contains('Task 0');

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu .slick-context-menu-command-list')
      .find('.slick-context-menu-item.bold')
      .find('.slick-context-menu-content.red')
      .should('exist')
      .contains('Delete Row')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .each($row => {
        expect($row.text()).not.include('Task 0');
      });
  });

  it('should be able to delete the 3rd row "Task 3" by using the "Delete Row" command from the Action Cell Menu', () => {
    cy.get('#myGrid')
      .find('.slick-row:nth(2) .slick-cell:nth(1)')
      .contains('Task 3');

    cy.get('#myGrid')
      .find('.slick-row:nth(2) .slick-cell:nth(7)')
      .contains('Action')
      .click({ force: true });

    cy.get('.slick-cell-menu .slick-cell-menu-command-list')
      .find('.slick-cell-menu-item.bold')
      .find('.slick-cell-menu-content.red')
      .should('exist')
      .contains('Delete Row')
      .click();

    cy.get('#myGrid')
      .find('.slick-row:nth(2) .slick-cell:nth(1)')
      .each($row => {
        expect($row.text()).not.include('Task 3');
      });
  });

  it('should check Context Menu "menuUsabilityOverride" condition and expect to not be able to open Context Menu from rows than are >= to Task 21', () => {
    cy.get('#myGrid')
      .find('.slick-row:nth(21) .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu .slick-context-menu-command-list')
      .should('not.exist');
  });

  it('should scroll back to top row and be able to open Context Menu', () => {
    cy.get('.slick-viewport-top.slick-viewport-left')
      .scrollTo('top')
      .wait(10);

    cy.get('#myGrid')
      .find('.slick-row:nth(1) .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu .slick-context-menu-command-list')
      .should('exist');

    cy.get('.slick-context-menu button.close')
      .click();
  });

  it('should be able to open Context Menu and click on Export->Text and expect alert triggered with Text Export', () => {
    const subCommands1 = ['Text', 'Excel'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Text')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Exporting as Text'));
  });

  it('should be able to open Context Menu and click on Export->Excel-> sub-commands to see 1 context menu + 1 sub-menu then clicking on Text should call alert action', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Excel (csv)', 'Excel (xls)'];
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(1)')
      .rightclick();

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Excel')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-2 .slick-context-menu-command-list').as('subMenuList2');

    cy.get('@subMenuList2')
      .find('.slick-menu-title')
      .contains('available formats');

    cy.get('@subMenuList2')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands2[index]));

    cy.get('.slick-context-menu.slick-menu-level-2 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Excel (xls)')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Exporting as Excel (xls)'));
  });

  it('should open Export->Excel sub-menu & open again Sub-Options on top and expect sub-menu to be recreated with that Sub-Options list instead of the Export->Excel list', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Excel (csv)', 'Excel (xls)'];
    const subOptions = ['Low', 'Medium', 'High'];

    cy.get('button')
      .contains('Show Commands & Priority Options')
      .click();

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(5)')
      .rightclick();

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Excel')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-2 .slick-context-menu-command-list')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands2[index]));

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-option-list')
      .find('.slick-context-menu-item')
      .contains('Sub-Options')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-option-list').as('optionSubList2');

    cy.get('@optionSubList2')
      .find('.slick-menu-title')
      .contains('Set Priority');

    cy.get('@optionSubList2')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($option, index) => expect($option.text()).to.contain(subOptions[index]));
  });

  it('should open Export->Excel context sub-menu then open Feedback->ContactUs sub-menus and expect previous Export menu to no longer exists', () => {
    const subCommands1 = ['Text', 'Excel'];
    const subCommands2 = ['Request update from supplier', '', 'Contact Us'];
    const subCommands2_1 = ['Email us', 'Chat with us', 'Book an appointment'];

    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('#myGrid')
      .find('.slick-row .slick-cell:nth(2)')
      .rightclick();

    cy.get('.slick-context-menu.slick-menu-level-0 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Export')
      .click();

    cy.get('.slick-context-menu.slick-menu-level-1 .slick-context-menu-command-list')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands1[index]));

    // click different sub-menu
    cy.get('.slick-context-menu.slick-menu-level-0')
      .find('.slick-context-menu-item')
      .contains('Feedback')
      .should('exist')
      .trigger('mouseover'); // mouseover or click should work

    cy.get('.slick-submenu').should('have.length', 1);
    cy.get('.slick-context-menu.slick-menu-level-1')
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.contain(subCommands2[index]));

    // click on Feedback->ContactUs
    cy.get('.slick-context-menu.slick-menu-level-1.dropright') // right align
      .find('.slick-context-menu-item')
      .contains('Contact Us')
      .should('exist')
      .click();

    cy.get('.slick-submenu').should('have.length', 2);
    cy.get('.slick-context-menu.slick-menu-level-2.dropleft') // left align
      .should('exist')
      .find('.slick-context-menu-item')
      .each(($command, index) => expect($command.text()).to.eq(subCommands2_1[index]));

    cy.get('.slick-context-menu.slick-menu-level-2');

    cy.get('.slick-context-menu.slick-menu-level-2 .slick-context-menu-command-list')
      .find('.slick-context-menu-item')
      .contains('Chat with us')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('Command: contact-chat'));

    cy.get('.slick-submenu').should('have.length', 0);
  });
});