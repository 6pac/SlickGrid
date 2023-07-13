import type { Column } from './column.interface';

export interface ColumnSort {
  /** Column Id to be sorted */
  columnId: string | number;

  /** Are we sorting Ascending? */
  sortAsc: boolean;

  /** Column to be sorted */
  sortCol?: Column;
}
