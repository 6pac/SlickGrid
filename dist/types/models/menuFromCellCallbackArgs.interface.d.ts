import type { Column } from './column.interface.js';
import type { SlickGrid } from '../slick.grid.js';
export interface MenuFromCellCallbackArgs {
    /** Grid cell/column index */
    cell: number;
    /** Grid row index */
    row: number;
    /** Reference to the grid. */
    grid: SlickGrid;
}
export interface MenuFromCellWithColumnCallbackArgs<T = any> extends MenuFromCellCallbackArgs {
    /** Cell Column definition */
    column?: Column<T>;
}
//# sourceMappingURL=menuFromCellCallbackArgs.interface.d.ts.map