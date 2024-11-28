import type { AutoTooltipOption, Column, SlickPlugin } from '../models/index.js';
import { type SlickEventData } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
 */
export declare class SlickAutoTooltips implements SlickPlugin {
    pluginName: "AutoTooltips";
    protected _grid: SlickGrid;
    protected _options?: AutoTooltipOption;
    protected _defaults: AutoTooltipOption;
    /**
     * Constructor of the SlickGrid 3rd party plugin, it can optionally receive options
     * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
     * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
     * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
     * @param {boolean} [options.replaceExisting=null]       - Allow preventing custom tooltips from being overwritten by auto tooltips
     */
    constructor(options?: AutoTooltipOption);
    /**
     * Initialize plugin.
     */
    init(grid: SlickGrid): void;
    /**
     * Destroy plugin.
     */
    destroy(): void;
    /**
     * Handle mouse entering grid cell to add/remove tooltip.
     * @param {SlickEventData} event - The event
     */
    protected handleMouseEnter(event: SlickEventData): void;
    /**
     * Handle mouse entering header cell to add/remove tooltip.
     * @param {SlickEventData} event   - The event
     * @param {object} args.column - The column definition
     */
    protected handleHeaderMouseEnter(event: SlickEventData, args: {
        column: Column;
    }): void;
}
//# sourceMappingURL=slick.autotooltips.d.ts.map