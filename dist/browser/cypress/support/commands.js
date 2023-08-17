"use strict";
(() => {
  // cypress/support/commands.ts
  Cypress.Commands.add("convertPosition", (viewport = "topLeft") => cy.wrap((void 0)(viewport)));
  Cypress.Commands.add("getCell", (row, col, viewport = "topLeft", { parentSelector = "", rowHeight = 25 } = {}) => {
    let position = (void 0)(viewport), canvasSelectorX = position.x ? `.grid-canvas-${position.x}` : "", canvasSelectorY = position.y ? `.grid-canvas-${position.y}` : "";
    return cy.get(`${parentSelector} ${canvasSelectorX}${canvasSelectorY} [style="top:${row * rowHeight}px"] > .slick-cell:nth(${col})`);
  });
  var LOCAL_STORAGE_MEMORY = {};
  Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach((key) => {
      LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
  });
  Cypress.Commands.add("restoreLocalStorage", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
      localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
  });
})();
//# sourceMappingURL=commands.js.map
