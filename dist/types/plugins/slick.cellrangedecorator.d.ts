import type { CellRangeDecoratorOption, SlickPlugin } from '../models/index.js';
import { type SlickRange } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
export declare class SlickCellRangeDecorator implements SlickPlugin {
    protected readonly grid: SlickGrid;
    pluginName: "CellRangeDecorator";
    protected _options: CellRangeDecoratorOption;
    protected _elem?: HTMLDivElement | null;
    protected _defaults: CellRangeDecoratorOption;
    constructor(grid: SlickGrid, options?: Partial<CellRangeDecoratorOption>);
    destroy(): void;
    init(): void;
    hide(): void;
    show(range: SlickRange): HTMLDivElement;
}
//# sourceMappingURL=slick.cellrangedecorator.d.ts.map