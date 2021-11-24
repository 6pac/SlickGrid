/// <reference types="cypress" />

describe('Example - Frozen Columns & Rows', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
  const cellWidth = 80;
  const cellHeight = 25;
  const gridWidth = 600;
  const gridHeight = 350;

  const fullTitles = ['#', 'Title', 'Duration', '% Complete', 'Start', 'Finish', 'Cost', 'Effort Driven'];

  for (var i = 0; i < 30; i++) {
    fullTitles.push("Mock" + i);
  }

  it('should load Example', () => {
    cy.visit(`${Cypress.config('baseExampleUrl')}/example-auto-scroll-when-dragging.html`);
  });

  it('should have exact column titles on grid', () => {
    cy.get('#myGrid')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  function dragStart(row, col, canvasClass) {
    return cy.get(`${canvasClass || ''} [style="top:${row * 25}px"] > .slick-cell:nth(${col})`, )
      .as('dragStart')
      .click({force: true})
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', cellWidth/3, cellHeight/3);
  }

  function drag(addRow, addCell) {
    cy.get('@dragStart').trigger('mousemove', cellWidth * (addCell + 0.5) , cellHeight * (addRow + 0.5), { force: true })
  }

  function dragOutside(position, ms, px, selector) {
    var x = gridWidth / 2;
    var y = gridHeight / 2;
    if (position.toLowerCase().indexOf("left") > -1) {
      x = -px;
    } else if (position.toLowerCase().indexOf("right") > -1) {
      x = gridWidth + (px || 0);
    }
    if (position.toLowerCase().indexOf("top") > -1) {
      y = -px;
    } else if (position.toLowerCase().indexOf("bottom") > -1) {
      y = gridHeight + (px || 0);
    }
    cy.get(`#myGrid ${selector || ''}`).trigger('mousemove', x, y, {force: true});
    if (ms) {
      cy.wait(ms);
    }
  }

  function dragEnd() {
    return cy.get('#myGrid').trigger('mouseup', {force: true});
  }

  it('should decorator shown when dragging', { scrollBehavior: false }, function () {
    dragStart(0, 1);
    cy.get('.slick-range-decorator').should('be.exist');
    drag(0, 5);
    dragEnd();
    cy.get('.slick-range-decorator').should('not.be.exist');
    cy.get('.slick-cell.selected').should('have.length', 6);
  })

  it('should auto scroll take effect to display the selecting element when dragging', { scrollBehavior: false }, function () {
    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollBefore => {
      dragOutside('right', 300, 100);
      cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollAfter => {
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        dragEnd();
      })
    })

    cy.get('#isAutoScroll').click();
    cy.get('#setOptions').click();
    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollBefore => {
      dragOutside('right', 300, 100);
      cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollAfter => {
        expect(scrollBefore).to.be.equal(scrollAfter);
        dragEnd();
      })
    })

    cy.get('#setDefaultOption').click();
    cy.get('#isAutoScroll').should('have.value', 'on')
  })

  it('should MIN interval take effect when auto scroll: 30ms -> 90ms', { scrollBehavior: false }, function () {
    let defaultInterval = 0;
    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom', 0, 300);
      const defaultStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16') // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        defaultInterval = performance.now() - defaultStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
      })
    })

    cy.get('#minIntervalToShowNextCell').type('{selectall}90'); // 30ms -> 90ms
    cy.get('#setOptions').click();

    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom', 0, 300);
      const newStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16') // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        const newInterval = performance.now() - newStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        expect(newInterval).to.be.greaterThan(2 * defaultInterval); // max scrolling speed is slower than before
      })
    })

    cy.get('#setDefaultOption').click();
    cy.get('#minIntervalToShowNextCell').should('have.value', '30')
  })

  it('should MAX interval take effect when auto scroll: 600ms -> 200ms', { scrollBehavior: false }, function () {
    let defaultInterval = 0;
    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom');
      const defaultStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16', { timeout: 10000 }) // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        defaultInterval = performance.now() - defaultStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
      })
    })

    cy.get('#maxIntervalToShowNextCell').type('{selectall}200'); // 600ms -> 200ms
    cy.get('#setOptions').click();

    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom');
      const newStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16', { timeout: 10000 }) // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        const newInterval = performance.now() - newStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        expect(2 * newInterval).to.be.lessThan(defaultInterval, 1000); // min scrolling speed is quicker than before
      })
    })

    cy.get('#setDefaultOption').click();
    cy.get('#maxIntervalToShowNextCell').should('have.value', '600')
  })

  it('should Delay per Px take effect when auto scroll: 5ms/px -> 50ms/px', { scrollBehavior: false }, function () {
    let defaultInterval = 0;
    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom');
      const defaultStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16') // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        defaultInterval = performance.now() - defaultStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
      })
    })

    cy.get('#accelerateInterval').type('{selectall}50'); // 5ms/px -> 50ms/px
    cy.get('#setOptions').click();

    dragStart(0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom');
      const newStart = performance.now();
      cy.get('#myGrid .slick-viewport:first .slick-row > .slick-cell:first-child')
        .contains('16') // actually #15 will be selected
        .should('not.be.hidden');
      cy.get('#myGrid .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        dragEnd();
        const newInterval = performance.now() - newStart;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        expect(5 * newInterval).to.be.lessThan(defaultInterval, 1000); // scrolling speed is quicker than before
      })
    })

    cy.get('#setDefaultOption').click();
    cy.get('#accelerateInterval').should('have.value', '5')
  })

  it('should have a frozen grid with 4 containers with 2 columns on the left and 3 rows on the top after click Set/Clear Frozen button', () => {
    cy.get('[style="top:0px"]').should('have.length', 1);

    cy.get('#toggleFrozen').click();

    cy.get('[style="top:0px"]').should('have.length', 2 * 2);
    cy.get('.grid-canvas-left > [style="top:0px"]').children().should('have.length', 2 * 2);
    cy.get('.grid-canvas-top').children().should('have.length', 3 * 2);
  });

  function dragInFrozen(whichViewport, dragDirection, fromRow, fromCol, px) {
    let x;
    let y;
    if (whichViewport.toLowerCase().indexOf("left") > -1) {
      x = 'left'
    } else if (whichViewport.toLowerCase().indexOf("right") > -1) {
      x = 'right';
    }
    if (whichViewport.toLowerCase().indexOf("top") > -1) {
      y = 'top';
    } else if (whichViewport.toLowerCase().indexOf("bottom") > -1) {
      y = 'bottom';
    }
    dragStart(fromRow, fromCol, `.grid-canvas-${x}.grid-canvas-${y}`);
    return cy.get(`#myGrid .slick-viewport-${x}.slick-viewport-${y}`).as('viewport').then($viewport => {
      const scrollTopBefore = $viewport.scrollTop();
      const scrollLeftBefore = $viewport.scrollLeft();
      dragOutside(dragDirection, 300, px || 100, `.slick-viewport-${x}.slick-viewport-${y}`);
      return cy.get('@viewport').then($viewportAfter => {
        dragEnd();
        return cy.wrap({
          scrollTopBefore: scrollTopBefore,
          scrollLeftBefore: scrollLeftBefore,
          scrollTopAfter: $viewportAfter.scrollTop(),
          scrollLeftAfter: $viewportAfter.scrollLeft()
        })
      })
    })
  }

  it('should auto scroll to display the selecting element when dragging in frozen grid', { scrollBehavior: false }, () => {
    // top left - to bottomRight
    dragInFrozen('topLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });

    // top right - to bottomRight
    dragInFrozen('topRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });

    // bottom left - to bottomRight
    dragInFrozen('bottomLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });

    // bottom right - to bottomRight
    dragInFrozen('bottomRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });

    cy.get('#myGrid .slick-viewport-bottom.slick-viewport-right').scrollTo(cellWidth*3, cellHeight*3);

    // // bottom right - to topLeft
    dragInFrozen('bottomRight', 'topLeft', 8, 4, 100).then(result => {
      expect(result.scrollTopBefore).to.be.greaterThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
    });

    cy.get('#myGrid .slick-viewport-bottom.slick-viewport-right').scrollTo(0, 0);
  });

  it('should have a frozen & grouping by Duration grid after click Set/Clear grouping by Duration button', { scrollBehavior: false }, () => {
    cy.get('#toggleGroup').trigger('click');
    cy.get('[style="top:0px"]').should('have.length', 2 * 2);
    cy.get('.grid-canvas-top.grid-canvas-left').contains('Duration');
  });


  it('should auto scroll to display the selecting element even unselectable cell exist in grouping grid', { scrollBehavior: false }, () => {
    dragStart(7, 0, '.grid-canvas-right.grid-canvas-bottom');
    cy.get('#myGrid .slick-viewport:last').invoke('scrollTop').then(scrollBefore => {
      dragOutside('bottom', 400, 100);
      cy.get('#myGrid .slick-viewport:last').invoke('scrollTop').then(scrollAfter => {
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        dragEnd();
        cy.get('[style="top:350px"].slick-group').should('not.be.hidden');;
      })
    })
  });

  it('should reset to default grid when click Set/Clear Frozen button and Set/Clear grouping button', () => {
    cy.get('#toggleFrozen').trigger('click');
    cy.get('#toggleGroup').trigger('click');
    cy.get('[style="top:0px"]').should('have.length', 1);
  });

});
