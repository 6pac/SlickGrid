import type { Column } from './column.interface.js';
import type { SlickGrid } from '../slick.grid.js';
export interface MenuCallbackArgs<T = any> {
    /** Cell or column index */
    cell?: number;
    /** Row index */
    row?: number;
    /** Reference to the grid. */
    grid: SlickGrid;
    /** Cell Column definition */
    column: Column<T>;
    /** Cell Data Context(data object) */
    dataContext?: T;
}
//# sourceMappingURL=menuCallbackArgs.interface.d.ts.map