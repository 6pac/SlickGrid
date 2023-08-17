"use strict";
(() => {
  // cypress/e2e/example-colspan.cy.ts
  describe("Example - Column Span & Header Grouping", { retries: 1 }, () => {
    let fullTitles = ["Title", "Duration", "% Complete", "Start", "Finish", "Effort Driven"];
    for (let i = 0; i < 30; i++)
      fullTitles.push(`Mock${i}`);
    it("should display Example title", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-colspan.html`), cy.get("h2").contains("Demonstrates");
    }), it("should have exact column titles", () => {
      cy.get("#myGrid").find(".slick-header-columns").children().each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
    }), it("should expect 1st row to be 1 column spanned to the entire width", () => {
      cy.get(`[style="top:${25 * 0}px"] > .slick-cell:nth(0)`).should("contain", "Task 0"), cy.get(`[style="top:${25 * 0}px"] > .slick-cell:nth(1)`).should("not.exist");
    }), it("should expect 2nd row to be 4 columns and not be spanned", () => {
      cy.get(`[style="top:${25 * 1}px"] > .slick-cell:nth(0)`).should("contain", "Task 1"), cy.get(`[style="top:${25 * 1}px"] > .slick-cell:nth(1)`).should("contain", "5 days"), cy.get(`[style="top:${25 * 1}px"] > .slick-cell:nth(2)`).should("contain", "01/05/2009"), cy.get(`[style="top:${25 * 1}px"] > .slick-cell:nth(3)`).contains(/(true|false)/);
    }), it("should expect 3rd row to be 1 column spanned to the entire width", () => {
      cy.get(`[style="top:${25 * 2}px"] > .slick-cell:nth(0)`).should("contain", "Task 2"), cy.get(`[style="top:${25 * 2}px"] > .slick-cell:nth(1)`).should("not.exist");
    }), it("should expect 4th row to be 4 columns and not be spanned", () => {
      cy.get(`[style="top:${25 * 3}px"] > .slick-cell:nth(0)`).should("contain", "Task 3"), cy.get(`[style="top:${25 * 3}px"] > .slick-cell:nth(1)`).should("contain", "5 days"), cy.get(`[style="top:${25 * 3}px"] > .slick-cell:nth(2)`).should("contain", "01/05/2009"), cy.get(`[style="top:${25 * 3}px"] > .slick-cell:nth(3)`).contains(/(true|false)/);
    });
  });
})();
//# sourceMappingURL=example-colspan.cy.js.map
