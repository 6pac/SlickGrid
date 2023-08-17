"use strict";
(() => {
  // cypress/e2e/example-optimizing-updates.cy.ts
  describe("Example - Optimizing Updates", () => {
    let titles = ["#", "Severity", "Time", "Message"];
    beforeEach(() => {
      cy.window().then((win) => {
        cy.spy(win.console, "log");
      });
    }), it("should display Example Multi-grid Basic", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-optimizing-updates.html`), cy.get("h2").should("contain", "Demonstrates:"), cy.contains("This page demonstrates how the bulk update operations ");
    }), it("should have exact Column Titles in the grid", () => {
      cy.get("#myGrid").find(".slick-header-columns").children().each(($child, index) => expect($child.text()).to.eq(titles[index]));
    }), it("should show initial rows", () => {
      cy.get("#pager").find(".slick-pager-status").should("contain", "Showing all 300 rows");
    }), it("should update the rows on inefficient click", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-optimizing-updates.html`), cy.get("#myGrid").find(".slick-row").each(($child, index) => {
        let message = $child.find(".cell-message").text(), number = parseInt(message.substring(10));
        expect(number).to.be.lessThan(1e3);
      }), cy.get(".options-panel button").contains("inefficient").click(), cy.get("#myGrid").find(".slick-row").each(($child, index) => {
        let message = $child.find(".cell-message").text(), number = parseInt(message.substring(10));
        expect(number).to.be.greaterThan(9e4);
      });
    }), it("should update the rows on efficient click", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-optimizing-updates.html`), cy.get("#myGrid").find(".slick-row").each(($child, index) => {
        let message = $child.find(".cell-message").text(), number = parseInt(message.substring(10));
        expect(number).to.be.lessThan(1e3);
      }), cy.get(".options-panel button").contains("efficient").click(), cy.get("#myGrid").find(".slick-row").each(($child, index) => {
        let message = $child.find(".cell-message").text(), number = parseInt(message.substring(10));
        expect(number).to.be.greaterThan(9e4);
      });
    }), it("should need less time on efficient than inefficient", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-optimizing-updates.html`), cy.get("#duration").invoke("text", "").should("be.empty"), cy.get(".options-panel button").contains("(inefficient)").click(), cy.get("#duration").should("not.be.empty").then(($duration) => {
        let inEfficientTime = parseInt($duration.text());
        cy.get("#duration").invoke("text", "").should("be.empty"), cy.get(".options-panel button").contains("(efficient)").click(), cy.get("#duration").should("not.be.empty").then(($duration2) => {
          let efficientTime = parseInt($duration2.text());
          expect(efficientTime).to.be.lessThan(inEfficientTime / 2);
        });
      });
    });
  });
})();
//# sourceMappingURL=example-optimizing-updates.cy.js.map
