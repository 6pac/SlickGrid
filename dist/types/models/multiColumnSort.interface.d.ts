import type { ColumnSort } from './index';
import type { SlickGrid } from '../slick.grid';
export interface MultiColumnSort {
    /** SlickGrid grid object */
    grid: SlickGrid;
    /** is it a multi-column sort? */
    multiColumnSort: true;
    /** Array of Columns to be sorted */
    sortCols: ColumnSort[];
    /** previous sort columns before calling onSort */
    previousSortColumns?: ColumnSort[];
}
//# sourceMappingURL=multiColumnSort.interface.d.ts.map