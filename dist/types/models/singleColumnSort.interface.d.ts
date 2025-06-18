import type { ColumnSort } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface SingleColumnSort extends ColumnSort {
    /** SlickGrid grid object */
    grid?: SlickGrid;
    /** is it a multi-column sort? */
    multiColumnSort?: false;
    /** previous sort columns before calling onSort */
    previousSortColumns?: ColumnSort[];
}
//# sourceMappingURL=singleColumnSort.interface.d.ts.map