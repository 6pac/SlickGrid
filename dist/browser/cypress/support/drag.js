(() => {
  // cypress/support/drag.ts
  Cypress.Commands.add("dragStart", { prevSubject: !0 }, (subject, { cellWidth = 80, cellHeight = 25 } = {}) => cy.wrap(subject).click({ force: !0 }).trigger("mousedown", { which: 1 }).trigger("mousemove", cellWidth / 3, cellHeight / 3));
  Cypress.Commands.add("dragCell", { prevSubject: !0 }, (subject, addRow, addCell, { cellWidth = 80, cellHeight = 25 } = {}) => cy.wrap(subject).trigger("mousemove", cellWidth * (addCell + 0.5), cellHeight * (addRow + 0.5), { force: !0 }));
  Cypress.Commands.add("dragOutside", (viewport = "topLeft", ms = 0, px = 0, { parentSelector = 'div[class^="slickgrid_"]', scrollbarDimension = 17 } = {}) => {
    let $parent = cy.$$(parentSelector), gridWidth = $parent.width(), gridHeight = $parent.height(), x = gridWidth / 2, y = gridHeight / 2, position = (void 0)(viewport);
    position.x === "left" ? x = -px : position.x === "right" && (x = gridWidth - scrollbarDimension + 3 + px), position.y === "top" ? y = -px : position.y === "bottom" && (y = gridHeight - scrollbarDimension + 3 + px), cy.get(parentSelector).trigger("mousemove", x, y, { force: !0 }), ms && cy.wait(ms);
  });
  Cypress.Commands.add("dragEnd", { prevSubject: "optional" }, (subject, gridSelector = 'div[class^="slickgrid_"]') => {
    cy.get(gridSelector).trigger("mouseup", { force: !0 });
  });
  function getScrollDistanceWhenDragOutsideGrid(selector, viewport, dragDirection, fromRow, fromCol, px = 100) {
    return cy.convertPosition(viewport).then((_viewportPosition) => {
      let viewportSelector = `${selector} .slick-viewport-${_viewportPosition.x}.slick-viewport-${_viewportPosition.y}`;
      return cy.getCell(fromRow, fromCol, viewport, { parentSelector: selector }).dragStart(), cy.get(viewportSelector).then(($viewport) => {
        let scrollTopBefore = $viewport.scrollTop(), scrollLeftBefore = $viewport.scrollLeft();
        return cy.dragOutside(dragDirection, 300, px, { parentSelector: selector }), cy.get(viewportSelector).then(($viewportAfter) => {
          cy.dragEnd(selector);
          let scrollTopAfter = $viewportAfter.scrollTop(), scrollLeftAfter = $viewportAfter.scrollLeft();
          return cy.get(viewportSelector).scrollTo(0, 0, { ensureScrollable: !1 }), cy.wrap({
            scrollTopBefore,
            scrollLeftBefore,
            scrollTopAfter,
            scrollLeftAfter
          });
        });
      });
    });
  }
})();
//# sourceMappingURL=drag.js.map
