/// <reference types="cypress" />

describe('Example - Auto scroll when dragging', { retries: 1 }, () => {
  // NOTE:  everywhere there's a * 2 is because we have a top+bottom (frozen rows) containers even after Unfreeze Columns/Rows
  const cellWidth = 80;
  const cellHeight = 25;
  const gridWidth = 600;
  const gridHeight = 350;
  const scrollbarDimension = 17;

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
    cy.get('#myGrid2')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
  });

  function dragStart(parentClass, row, col) {
    return cy.get(`${parentClass || ''} [style="top:${row * 25}px"] > .slick-cell:nth(${col})`, )
      .as('dragStart')
      .click({ force: true })
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', cellWidth/3, cellHeight/3, { force: true });
  }

  function drag(addRow, addCell) {
    cy.get('@dragStart').trigger('mousemove', cellWidth * (addCell + 0.5) , cellHeight * (addRow + 0.5), { force: true })
  }

  function dragOutside(selector, position, ms, px) {
    var x = gridWidth / 2;
    var y = gridHeight / 2;
    if (position.toLowerCase().indexOf("left") > -1) {
      x = -px;
    } else if (position.toLowerCase().indexOf("right") > -1) {
      x = gridWidth - scrollbarDimension + 1 + (px || 0);
    }
    if (position.toLowerCase().indexOf("top") > -1) {
      y = -px;
    } else if (position.toLowerCase().indexOf("bottom") > -1) {
      y = gridHeight - scrollbarDimension + 1 + (px || 0);
    }
    cy.get(` ${selector || ''}`).trigger('mousemove', x, y, { force: true });
    if (ms) {
      cy.wait(ms);
    }
  }

  function dragEnd(selector) {
    cy.get(selector).trigger('mouseup', { force: true });
    cy.get(selector + ' .slick-range-decorator').should('not.be.exist');
  }

  function resetScroll(isFrozen) {
    const selector = '.slick-viewport' + (isFrozen ? ":last" : ":first")
    cy.get('#myGrid ' + selector).scrollTo(0, 0);
    cy.get('#myGrid2 ' + selector).scrollTo(0, 0);
  }

  it('should select border shown in cell selection model, and hidden in row selection model when dragging', { scrollBehavior: false }, function () {
    dragStart("#myGrid", 0, 1);
    cy.get('#myGrid .slick-range-decorator').should('be.exist').and('have.css', 'border-color').and('not.equal', 'none');
    drag(0, 5);
    dragEnd('#myGrid');
    cy.get('#myGrid .slick-cell.selected').should('have.length', 6);

    dragStart("#myGrid2", 0, 1);
    cy.get('#myGrid2 .slick-range-decorator').should('be.exist').and('have.css', 'border-style').and('equal', 'none');
    drag(5, 1);
    dragEnd('#myGrid2');

    cy.get('#myGrid2 .slick-row:nth-child(-n+6)')
      .children(':not(.cell-unselectable)')
      .each(($child) => expect($child.attr("class")).to.include('selected'));
  })

  it('should auto scroll take effect to display the selecting element when dragging', { scrollBehavior: false }, function () {
    dragStart("#myGrid", 0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollBefore => {
      dragOutside('#myGrid', 'right', 300, 100);
      cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollAfter => {
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        dragEnd('#myGrid');
      })
    })

    dragStart("#myGrid2", 0, 1);
    cy.get('#myGrid2 .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('#myGrid2', 'bottom', 300, 100);
      cy.get('#myGrid2 .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        dragEnd('#myGrid2');
        resetScroll();
      })
    })

    cy.get('#isAutoScroll').click();
    cy.get('#setOptions').click();

    dragStart("#myGrid", 0, 1);
    cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollBefore => {
      dragOutside('#myGrid', 'right', 300, 100);
      cy.get('#myGrid .slick-viewport:first').invoke('scrollLeft').then(scrollAfter => {
        expect(scrollBefore).to.be.equal(scrollAfter);
        dragEnd('#myGrid');
      })
    })

    dragStart("#myGrid2", 0, 1);
    cy.get('#myGrid2 .slick-viewport:first').invoke('scrollTop').then(scrollBefore => {
      dragOutside('#myGrid2', 'bottom', 300, 100);
      cy.get('#myGrid2 .slick-viewport:first').invoke('scrollTop').then(scrollAfter => {
        expect(scrollBefore).to.be.equal(scrollAfter);
        dragEnd('#myGrid2');
        resetScroll();
      })
    })
    cy.get('#setDefaultOption').click();
    cy.get('#isAutoScroll').should('have.value', 'on')
  })

  function getIntervalUntilRow16Displayed(selector, px) {
    dragStart(selector, 0, 1);
    return cy.get(selector + ' .slick-viewport:first').as('viewport').invoke('scrollTop').then(scrollBefore => {
      dragOutside(selector, 'bottom', 0, px);
      const start = performance.now();
      cy.get(selector + ' .slick-row:not(.slick-group) >.cell-unselectable')
        .contains('16', { timeout: 10000 }) // actually #15 will be selected
        .should('not.be.hidden');
      return cy.get('@viewport').invoke('scrollTop').then(scrollAfter => {
        dragEnd(selector);
        var interval = performance.now() - start;
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        return cy.wrap(interval);
      })
    })
  }

  function testInterval(px) {
    return getIntervalUntilRow16Displayed("#myGrid", px).then(intervalCell => {
      return getIntervalUntilRow16Displayed("#myGrid2", px).then(intervalRow => {
        return cy.wrap({
          cell: intervalCell,
          row: intervalRow
        })
      });
    });
  }

  it('should MIN interval take effect when auto scroll: 30ms -> 90ms', { scrollBehavior: false }, function () {
    // By default the MIN interval to show next cell is 30ms.
    testInterval(300).then(defaultInterval => {

      resetScroll();
      // Setting the interval to 90ms (3 times of the default).
      cy.get('#minIntervalToShowNextCell').type('{selectall}90'); // 30ms -> 90ms
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row by MIN interval, the used time should be 3 times slower than default.
      // Considering the threshold, 1.5 times slower than default is expected
      testInterval(300).then(newInterval => {

        // max scrolling speed is slower than before
        expect(newInterval.cell).to.be.greaterThan(1.5 * defaultInterval.cell);
        expect(newInterval.row).to.be.greaterThan(1.5 * defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#minIntervalToShowNextCell').should('have.value', '30');
        resetScroll();
      })
    })
  })

  it('should MAX interval take effect when auto scroll: 600ms -> 200ms', { scrollBehavior: false }, function () {
    // By default the MAX interval to show next cell is 600ms.
    testInterval(0).then(defaultInterval => {

      resetScroll();
      // Setting the interval to 200ms (1/3 of the default).
      cy.get('#maxIntervalToShowNextCell').type('{selectall}200'); // 600ms -> 200ms
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row by MAX interval, the used time should be 3 times faster than default.
      // Considering the threshold, 1.5 times faster than default is expected
      testInterval(0).then(newInterval => {

        // min scrolling speed is quicker than before
        expect(1.5 * newInterval.cell).to.be.lessThan(defaultInterval.cell);
        expect(1.5 * newInterval.row).to.be.lessThan(defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#maxIntervalToShowNextCell').should('have.value', '600');
        resetScroll();
      })
    })
  })

  it('should Delay per Px take effect when auto scroll: 5ms/px -> 50ms/px', { scrollBehavior: false }, function () {
    // By default the Delay per Px is 5ms/px.
    testInterval(scrollbarDimension).then(defaultInterval => {

      resetScroll();
      // Setting to 50ms/px (10 times of the default).
      cy.get('#accelerateInterval').type('{selectall}50'); // 5ms/px -> 50ms/px
      cy.get('#setOptions').click();

      // Ideally if we scrolling to same row, and set cursor to 17px, the new interval will be set to MIN interval (Math.max(30, 600 - 50 * 17) = 30ms),
      // and the used time should be around 17 times faster than default.
      // Considering the threshold, 5 times faster than default is expected
      testInterval(scrollbarDimension).then(newInterval => {

         // scrolling speed is quicker than before
        expect(5 * newInterval.cell).to.be.lessThan(defaultInterval.cell);
        expect(5 * newInterval.row).to.be.lessThan(defaultInterval.row);

        cy.get('#setDefaultOption').click();
        cy.get('#accelerateInterval').should('have.value', '5');
        resetScroll();
      })
    })
  })

  it('should have a frozen grid with 4 containers with 2 columns on the left and 3 rows on the top after click Set/Clear Frozen button', () => {
    cy.get('#myGrid [style="top:0px"]').should('have.length', 1);
    cy.get('#myGrid2 [style="top:0px"]').should('have.length', 1);

    cy.get('#toggleFrozen').click();

    cy.get('#myGrid [style="top:0px"]').should('have.length', 2 * 2);
    cy.get('#myGrid2 [style="top:0px"]').should('have.length', 2 * 2);
    cy.get('#myGrid .grid-canvas-left > [style="top:0px"]').children().should('have.length', 2 * 2);
    cy.get('#myGrid2 .grid-canvas-left > [style="top:0px"]').children().should('have.length', 2 * 2);
    cy.get('#myGrid .grid-canvas-top').children().should('have.length', 3 * 2);
    cy.get('#myGrid2 .grid-canvas-top').children().should('have.length', 3 * 2);
  });

  function dragInFrozen(selector, whichViewport, dragDirection, fromRow, fromCol, px) {
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
    dragStart(`${selector} .grid-canvas-${x}.grid-canvas-${y}`, fromRow, fromCol);
    return cy.get(`${selector} .slick-viewport-${x}.slick-viewport-${y}`).as('viewport').then($viewport => {
      const scrollTopBefore = $viewport.scrollTop();
      const scrollLeftBefore = $viewport.scrollLeft();
      dragOutside(`${selector} .slick-viewport-${x}.slick-viewport-${y}`, dragDirection, 300, px || 100);
      return cy.get('@viewport').then($viewportAfter => {
        dragEnd(selector);
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
    dragInFrozen('#myGrid', 'topLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });
    dragInFrozen('#myGrid2', 'topLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });

    // top right - to bottomRight
    dragInFrozen('#myGrid', 'topRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    dragInFrozen('#myGrid2', 'topRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    resetScroll(true);

    // bottom left - to bottomRight
    dragInFrozen('#myGrid', 'bottomLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });
    dragInFrozen('#myGrid2', 'bottomLeft', 'bottomRight', 0, 1).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
    });

    // bottom right - to bottomRight
    dragInFrozen('#myGrid', 'bottomRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    dragInFrozen('#myGrid2', 'bottomRight', 'bottomRight', 0, 0).then(result => {
      expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
    });
    resetScroll(true);
    cy.get('#myGrid .slick-viewport-bottom.slick-viewport-right').scrollTo(cellWidth*3, cellHeight*3);
    cy.get('#myGrid2 .slick-viewport-bottom.slick-viewport-right').scrollTo(cellWidth*3, cellHeight*3);

    // bottom right - to topLeft
    dragInFrozen('#myGrid', 'bottomRight', 'topLeft', 8, 4, 100).then(result => {
      expect(result.scrollTopBefore).to.be.greaterThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
    });
    dragInFrozen('#myGrid2', 'bottomRight', 'topLeft', 8, 4, 100).then(result => {
      expect(result.scrollTopBefore).to.be.greaterThan(result.scrollTopAfter);
      expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
    });
    resetScroll(true);
  });

  it('should have a frozen & grouping by Duration grid after click Set/Clear grouping by Duration button', { scrollBehavior: false }, () => {
    cy.get('#toggleGroup').trigger('click');
    cy.get('#myGrid [style="top:0px"]').should('have.length', 2 * 2);
    cy.get('#myGrid2 [style="top:0px"]').should('have.length', 2 * 2);
    cy.get('#myGrid .grid-canvas-top.grid-canvas-left').contains('Duration');
    cy.get('#myGrid2 .grid-canvas-top.grid-canvas-left').contains('Duration');
  });

  function testDragInGrouping(selector) {
    dragStart(selector + ' .grid-canvas-right.grid-canvas-bottom', 7, 0);
    cy.get(selector + ' .slick-viewport:last').as('viewport').invoke('scrollTop').then(scrollBefore => {
      dragOutside(selector, 'bottom', 400, 300);
      cy.get('@viewport').invoke('scrollTop').then(scrollAfter => {
        expect(scrollBefore).to.be.lessThan(scrollAfter);
        dragEnd(selector);
        cy.get(selector + ' [style="top:350px"].slick-group').should('not.be.hidden');;
      })
    })
  }

  it('should auto scroll to display the selecting element even unselectable cell exist in grouping grid', { scrollBehavior: false }, () => {
    testDragInGrouping('#myGrid');
    testDragInGrouping('#myGrid2');
  });

  it('should reset to default grid when click Set/Clear Frozen button and Set/Clear grouping button', () => {
    cy.get('#toggleFrozen').trigger('click');
    cy.get('#toggleGroup').trigger('click');
    cy.get('#myGrid [style="top:0px"]').should('have.length', 1);
    cy.get('#myGrid2 [style="top:0px"]').should('have.length', 1);
  });

});
