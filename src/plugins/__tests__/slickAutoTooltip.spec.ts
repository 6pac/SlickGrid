import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SlickAutoTooltips } from "../slick.autotooltips.js";
import { AutoTooltipOption } from "../../models/autoTooltipOption.interface.js";
import { SlickEvent, SlickEventData } from "../../slick.core.js";
import { SlickGrid } from "../../slick.grid.js";
import { Column } from "../../models/column.interface.js";

const addonOptions: AutoTooltipOption = {
  enableForCells: true,
  enableForHeaderCells: true,
  maxToolTipLength: 20,
  replaceExisting: true,
};

const gridStub = {
  getCellNode: vi.fn(),
  getCellFromEvent: vi.fn(),
  getOptions: vi.fn(),
  registerPlugin: vi.fn(),
  onHeaderMouseEnter: new SlickEvent(),
  onMouseEnter: new SlickEvent(),
} as unknown as SlickGrid;

const mockColumns = [
  // The column definitions
  { name: "Short", field: "short", width: 100 },
  { name: "Medium", field: "medium", width: 100 },
  { name: "Long", field: "long", width: 100 },
  { name: "Mixed", field: "mixed", width: 100 },
  { name: "Long header creates tooltip", field: "header", width: 50 },
  {
    name: "Long header with predefined tooltip",
    field: "tooltipHeader",
    width: 50,
    toolTip: "Already have a tooltip!",
  },
] as Column[];

describe("AutoTooltip Plugin", () => {
  let plugin: SlickAutoTooltips;

  beforeEach(() => {
    plugin = new SlickAutoTooltips(addonOptions);
  });

  it("should create the plugin", () => {
    expect(plugin).toBeTruthy();
  });

  it("should use default options when instantiating the plugin without passing any arguments", () => {
    plugin.init(gridStub);

    expect(plugin.options).toEqual({
      enableForCells: true,
      enableForHeaderCells: true,
      maxToolTipLength: 20,
      replaceExisting: true,
    });
  });

  describe("plugins - autotooltips - header", () => {
    beforeEach(() => {
      plugin.init(gridStub);
    });

    afterEach(() => {
      plugin.destroy();
    });

    it("should expect title is empty when header column has enough width", () => {
      const mockNodeElm = document.createElement("div");
      mockNodeElm.title = "";
      mockNodeElm.textContent = "some text";
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 150,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 100,
      });

      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        new SlickEventData(),
      );

      expect(mockNodeElm.title).toBe("");
    });

    it("title is present when header column is cut off", () => {
      const mockNodeElm = document.createElement("div");
      mockNodeElm.title = "";
      mockNodeElm.textContent = "some text";
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 150,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 100,
      });

      const eventData = new SlickEventData();
      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        new SlickEventData(),
      );
      gridStub.onHeaderMouseEnter.notify(
        { column: mockColumns[4], grid: gridStub },
        eventData,
      );

      expect(mockNodeElm.title).toBe("");
    });
  });

  describe("plugins - autotooltips - max tooltip", () => {
    beforeEach(() => {
      plugin.init(gridStub);
    });

    afterEach(() => {
      plugin.destroy();
    });

    it("title is empty when cell text has enough room", () => {
      const mockNodeElm = document.createElement("div");
      mockNodeElm.title = "";
      mockNodeElm.textContent = "some text";
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 150,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 100,
      });

      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        new SlickEventData(),
      );

      expect(mockNodeElm.title).toBe("");
    });

    it("title is present when cell text is cut off", () => {
      const mockNodeElm = document.createElement("div");
      mockNodeElm.title = "";
      mockNodeElm.textContent = "my super very long text";
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 140,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 175,
      });

      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        new SlickEventData(),
      );

      expect(mockNodeElm.title).toBe("my super very lon...");
    });

    it("title is empty when header column has enough width", () => {
      const mockNodeElm = document.createElement("div");
      const mockHeaderElm = document.createElement("div");
      const mockHeaderColElm = document.createElement("div");
      mockHeaderColElm.className = "slick-header-column";
      mockHeaderElm.title = "";
      mockHeaderElm.textContent = "my super very long text";
      mockNodeElm.appendChild(mockHeaderElm);
      mockHeaderElm.appendChild(mockHeaderColElm);
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 175,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 50,
      });

      const eventData = new SlickEventData();
      Object.defineProperty(eventData, "target", {
        writable: true,
        configurable: true,
        value: mockNodeElm,
      });
      gridStub.onHeaderMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        eventData,
      );

      expect(mockNodeElm.title).toBe("");
    });

    it("title is present when header column is cut off", () => {
      const mockNodeElm = document.createElement("div");
      const mockHeaderElm = document.createElement("div");
      const mockHeaderColElm = document.createElement("div");
      mockNodeElm.className = "slick-header-column";
      mockHeaderColElm.className = "slick-column-name";
      mockHeaderElm.title = "";
      mockHeaderElm.textContent = "short text";
      mockNodeElm.appendChild(mockHeaderElm);
      mockHeaderElm.appendChild(mockHeaderColElm);
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 144,
      });
      Object.defineProperty(mockHeaderColElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 130,
      });

      const eventData = new SlickEventData();
      Object.defineProperty(eventData, "target", {
        writable: true,
        configurable: true,
        value: mockHeaderColElm,
      });
      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        eventData,
      );
      gridStub.onHeaderMouseEnter.notify(
        { column: mockColumns[4], grid: gridStub },
        eventData,
      );

      expect(mockNodeElm.title).toBe("Long header creates tooltip");
    });

    it("title is not overridden when header column has pre-defined tooltip", () => {
      const mockNodeElm = document.createElement("div");
      const mockHeaderElm = document.createElement("div");
      const mockHeaderColElm = document.createElement("div");
      mockNodeElm.className = "slick-header-column";
      mockHeaderColElm.className = "slick-column-name";
      mockHeaderElm.title = "";
      mockHeaderElm.textContent = "short text";
      mockNodeElm.appendChild(mockHeaderElm);
      mockHeaderElm.appendChild(mockHeaderColElm);
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 144,
      });
      Object.defineProperty(mockHeaderColElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 130,
      });

      const eventData = new SlickEventData();
      Object.defineProperty(eventData, "target", {
        writable: true,
        configurable: true,
        value: mockHeaderColElm,
      });
      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        eventData,
      );
      gridStub.onHeaderMouseEnter.notify(
        { column: mockColumns[5], grid: gridStub },
        eventData,
      );

      expect(mockNodeElm.title).toBe("");
    });

    it("title is present and truncated when cell text is cut off and too long", () => {
      const mockNodeElm = document.createElement("div");
      const mockHeaderElm = document.createElement("div");
      const mockHeaderColElm = document.createElement("div");
      mockHeaderColElm.className = "slick-header-column";
      mockHeaderElm.title = "";
      mockHeaderElm.textContent = "Long header creates tooltip";
      mockNodeElm.appendChild(mockHeaderElm);
      mockHeaderElm.appendChild(mockHeaderColElm);
      vi.spyOn(gridStub, "getCellFromEvent").mockReturnValue({
        row: 1,
        cell: 2,
      });
      vi.spyOn(gridStub, "getCellNode").mockReturnValue(mockNodeElm);
      Object.defineProperty(mockNodeElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 140,
      });
      Object.defineProperty(mockNodeElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 175,
      });
      Object.defineProperty(mockHeaderColElm, "clientWidth", {
        writable: true,
        configurable: true,
        value: 50,
      });
      Object.defineProperty(mockHeaderColElm, "scrollWidth", {
        writable: true,
        configurable: true,
        value: 175,
      });

      const eventData = new SlickEventData();
      Object.defineProperty(eventData, "target", {
        writable: true,
        configurable: true,
        value: mockNodeElm,
      });
      gridStub.onMouseEnter.notify(
        { column: mockColumns[0], grid: gridStub },
        eventData,
      );
      gridStub.onHeaderMouseEnter.notify(
        { column: mockColumns[4], grid: gridStub },
        eventData,
      );

      expect(mockNodeElm.title).toBe("Long header creat...");
      expect(mockHeaderElm.title).toBe("");
    });
  });
});
