"use strict";
(() => {
  // cypress/e2e/example-auto-scroll-when-dragging.cy.ts
  describe("Example - Auto scroll when dragging", { retries: 1 }, () => {
    let fullTitles = ["#", "Title", "Duration", "% Complete", "Start", "Finish", "Cost", "Effort Driven"];
    for (var i = 0; i < 30; i++)
      fullTitles.push("Mock" + i);
    it("should load Example", () => {
      cy.visit(`${Cypress.config("baseExampleUrl")}/example-auto-scroll-when-dragging.html`);
    }), it("should have exact column titles on grid", () => {
      cy.get("#myGrid").find(".slick-header-columns").children().each(($child, index) => expect($child.text()).to.eq(fullTitles[index])), cy.get("#myGrid2").find(".slick-header-columns").children().each(($child, index) => expect($child.text()).to.eq(fullTitles[index]));
    }), it("should select border shown in cell selection model, and hidden in row selection model when dragging", { scrollBehavior: !1 }, function() {
      cy.getCell(0, 1, "", { parentSelector: "#myGrid", rowHeight: 25 }).as("cell1").dragStart(), cy.get("#myGrid .slick-range-decorator").should("be.exist").and("have.css", "border-color").and("not.equal", "none"), cy.get("@cell1").dragCell(0, 5).dragEnd("#myGrid"), cy.get("#myGrid .slick-range-decorator").should("not.be.exist"), cy.get("#myGrid .slick-cell.selected").should("have.length", 6), cy.getCell(0, 1, "", { parentSelector: "#myGrid2", rowHeight: 25 }).as("cell2").dragStart(), cy.get("#myGrid2 .slick-range-decorator").should("be.exist").and("have.css", "border-style").and("equal", "none"), cy.get("@cell2").dragCell(5, 1).dragEnd("#myGrid2"), cy.get("#myGrid2 .slick-range-decorator").should("not.be.exist"), cy.get("#myGrid2 .slick-row:nth-child(-n+6)").children(":not(.cell-unselectable)").each(($child) => expect($child.attr("class")).to.include("selected"));
    });
    function testScroll() {
      return (void 0)("#myGrid", "topLeft", "right", 0, 1).then((cellScrollDistance) => (void 0)("#myGrid2", "topLeft", "bottom", 0, 1).then((rowScrollDistance) => cy.wrap({
        cell: {
          scrollBefore: cellScrollDistance.scrollLeftBefore,
          scrollAfter: cellScrollDistance.scrollLeftAfter
        },
        row: {
          scrollBefore: rowScrollDistance.scrollTopBefore,
          scrollAfter: rowScrollDistance.scrollTopAfter
        }
      })));
    }
    it("should auto scroll take effect to display the selecting element when dragging", { scrollBehavior: !1 }, function() {
      testScroll().then((scrollDistance) => {
        expect(scrollDistance.cell.scrollBefore).to.be.lessThan(scrollDistance.cell.scrollAfter), expect(scrollDistance.row.scrollBefore).to.be.lessThan(scrollDistance.row.scrollAfter);
      }), cy.get("#isAutoScroll").click(), cy.get("#setOptions").click(), testScroll().then((scrollDistance) => {
        expect(scrollDistance.cell.scrollBefore).to.be.equal(scrollDistance.cell.scrollAfter), expect(scrollDistance.row.scrollBefore).to.be.equal(scrollDistance.row.scrollAfter);
      }), cy.get("#setDefaultOption").click(), cy.get("#isAutoScroll").should("have.value", "on");
    });
    function getIntervalUntilRow16Displayed(selector, px) {
      let viewportSelector = selector + " .slick-viewport:first";
      return cy.getCell(0, 1, "", { parentSelector: selector, rowHeight: 25 }).dragStart(), cy.get(viewportSelector).invoke("scrollTop").then((scrollBefore) => {
        cy.dragOutside("bottom", 0, px, { parentSelector: selector, rowHeight: 25 });
        let start = performance.now();
        return cy.get(selector + " .slick-row:not(.slick-group) >.cell-unselectable").contains("16", { timeout: 1e4 }).should("not.be.hidden"), cy.get(viewportSelector).invoke("scrollTop").then((scrollAfter) => {
          cy.dragEnd(selector);
          var interval = performance.now() - start;
          return expect(scrollBefore).to.be.lessThan(scrollAfter), cy.get(viewportSelector).scrollTo(0, 0, { ensureScrollable: !1 }), cy.wrap(interval);
        });
      });
    }
    function testInterval(px) {
      return getIntervalUntilRow16Displayed("#myGrid", px).then((intervalCell) => getIntervalUntilRow16Displayed("#myGrid2", px).then((intervalRow) => cy.wrap({
        cell: intervalCell,
        row: intervalRow
      })));
    }
    it("should MIN interval take effect when auto scroll: 30ms -> 90ms", { scrollBehavior: !1 }, function() {
      testInterval(300).then((defaultInterval) => {
        cy.get("#minIntervalToShowNextCell").type("{selectall}90"), cy.get("#setOptions").click(), testInterval(300).then((newInterval) => {
          expect(newInterval.cell).to.be.greaterThan(1.5 * defaultInterval.cell), expect(newInterval.row).to.be.greaterThan(1.5 * defaultInterval.row), cy.get("#setDefaultOption").click(), cy.get("#minIntervalToShowNextCell").should("have.value", "30");
        });
      });
    }), it.skip("should MAX interval take effect when auto scroll: 600ms -> 200ms", { scrollBehavior: !1 }, function() {
      testInterval(0).then((defaultInterval) => {
        cy.get("#maxIntervalToShowNextCell").type("{selectall}200"), cy.get("#setOptions").click(), testInterval(0).then((newInterval) => {
          expect(1.5 * newInterval.cell).to.be.lessThan(defaultInterval.cell), expect(1.5 * newInterval.row).to.be.lessThan(defaultInterval.row), cy.get("#setDefaultOption").click(), cy.get("#maxIntervalToShowNextCell").should("have.value", "600");
        });
      });
    }), it("should Delay per Px take effect when auto scroll: 5ms/px -> 50ms/px", { scrollBehavior: !1 }, function() {
      testInterval(17).then((defaultInterval) => {
        cy.get("#accelerateInterval").type("{selectall}50"), cy.get("#setOptions").click(), testInterval(17).then((newInterval) => {
          expect((5 - 0.5) * newInterval.cell).to.be.lessThan(defaultInterval.cell), expect((5 - 0.5) * newInterval.row).to.be.lessThan(defaultInterval.row), cy.get("#setDefaultOption").click(), cy.get("#accelerateInterval").should("have.value", "5");
        });
      });
    }), it("should have a frozen grid with 4 containers with 2 columns on the left and 3 rows on the top after click Set/Clear Frozen button", () => {
      cy.get('#myGrid [style="top:0px"]').should("have.length", 1), cy.get('#myGrid2 [style="top:0px"]').should("have.length", 1), cy.get("#toggleFrozen").click(), cy.get('#myGrid [style="top:0px"]').should("have.length", 2 * 2), cy.get('#myGrid2 [style="top:0px"]').should("have.length", 2 * 2), cy.get('#myGrid .grid-canvas-left > [style="top:0px"]').children().should("have.length", 2 * 2), cy.get('#myGrid2 .grid-canvas-left > [style="top:0px"]').children().should("have.length", 2 * 2), cy.get("#myGrid .grid-canvas-top").children().should("have.length", 3 * 2), cy.get("#myGrid2 .grid-canvas-top").children().should("have.length", 3 * 2);
    });
    function resetScrollInFrozen() {
      cy.get("#myGrid .slick-viewport:last").scrollTo(0, 0), cy.get("#myGrid2 .slick-viewport:last").scrollTo(0, 0);
    }
    it("should auto scroll to display the selecting element when dragging in frozen grid", { scrollBehavior: !1 }, () => {
      (void 0)("#myGrid", "topLeft", "bottomRight", 0, 1).then((result) => {
        expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
      }), (void 0)("#myGrid2", "topLeft", "bottomRight", 0, 1).then((result) => {
        expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
      }), (void 0)("#myGrid", "topRight", "bottomRight", 0, 0).then((result) => {
        expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
      }), (void 0)("#myGrid2", "topRight", "bottomRight", 0, 0).then((result) => {
        expect(result.scrollTopBefore).to.be.equal(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
      }), resetScrollInFrozen(), (void 0)("#myGrid", "bottomLeft", "bottomRight", 0, 1).then((result) => {
        expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
      }), (void 0)("#myGrid2", "bottomLeft", "bottomRight", 0, 1).then((result) => {
        expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.equal(result.scrollLeftAfter);
      }), resetScrollInFrozen(), (void 0)("#myGrid", "bottomRight", "bottomRight", 0, 0).then((result) => {
        expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
      }), (void 0)("#myGrid2", "bottomRight", "bottomRight", 0, 0).then((result) => {
        expect(result.scrollTopBefore).to.be.lessThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.lessThan(result.scrollLeftAfter);
      }), resetScrollInFrozen(), cy.get("#myGrid .slick-viewport-bottom.slick-viewport-right").scrollTo(80 * 3, 25 * 3), cy.get("#myGrid2 .slick-viewport-bottom.slick-viewport-right").scrollTo(80 * 3, 25 * 3), (void 0)("#myGrid", "bottomRight", "topLeft", 8, 4, 100).then((result) => {
        expect(result.scrollTopBefore).to.be.greaterThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
      }), (void 0)("#myGrid2", "bottomRight", "topLeft", 8, 4, 100).then((result) => {
        expect(result.scrollTopBefore).to.be.greaterThan(result.scrollTopAfter), expect(result.scrollLeftBefore).to.be.greaterThan(result.scrollLeftAfter);
      }), resetScrollInFrozen();
    }), it("should have a frozen & grouping by Duration grid after click Set/Clear grouping by Duration button", { scrollBehavior: !1 }, () => {
      cy.get("#toggleGroup").trigger("click"), cy.get('#myGrid [style="top:0px"]').should("have.length", 2 * 2), cy.get('#myGrid2 [style="top:0px"]').should("have.length", 2 * 2), cy.get("#myGrid .grid-canvas-top.grid-canvas-left").contains("Duration"), cy.get("#myGrid2 .grid-canvas-top.grid-canvas-left").contains("Duration");
    });
    function testDragInGrouping(selector) {
      cy.getCell(7, 0, "bottomRight", { parentSelector: selector, rowHeight: 25 }).dragStart(), cy.get(selector + " .slick-viewport:last").as("viewport").invoke("scrollTop").then((scrollBefore) => {
        cy.dragOutside("bottom", 400, 300, { parentSelector: selector, rowHeight: 25 }), cy.get("@viewport").invoke("scrollTop").then((scrollAfter) => {
          expect(scrollBefore).to.be.lessThan(scrollAfter), cy.dragEnd(selector), cy.get(selector + ' [style="top:350px"].slick-group').should("not.be.hidden");
        });
      });
    }
    it("should auto scroll to display the selecting element even unselectable cell exist in grouping grid", { scrollBehavior: !1 }, () => {
      testDragInGrouping("#myGrid"), testDragInGrouping("#myGrid2");
    }), it("should reset to default grid when click Set/Clear Frozen button and Set/Clear grouping button", () => {
      cy.get("#toggleFrozen").trigger("click"), cy.get("#toggleGroup").trigger("click"), cy.get('#myGrid [style="top:0px"]').should("have.length", 1), cy.get('#myGrid2 [style="top:0px"]').should("have.length", 1);
    });
  });
})();
//# sourceMappingURL=example-auto-scroll-when-dragging.cy.js.map
