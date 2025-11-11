import type { SlickCellRangeSelector } from '../plugins/slick.cellrangeselector.js';
import type { OnActiveCellChangedEventArgs, SelectionModel, SlickGrid } from '../index.js';

export declare type RowSelectOverride = (data: OnActiveCellChangedEventArgs, selectionModel: SelectionModel, grid: SlickGrid) => boolean;

export interface HybridSelectionModelOption {
  /** defaults to True, do we want to select the active cell? */
  selectActiveCell: boolean;

  /** defaults to True, do we want to select the active row? */
  selectActiveRow: boolean;

  /** cell range selector */
  cellRangeSelector?: SlickCellRangeSelector;

  /** Defaults to False, should we select when dragging? */
  dragToSelect: boolean;

  /** Defaults to True, should we auto-scroll when dragging a row */
  autoScrollWhenDrag: boolean;

  /** Row Selection on RowMoveManage column */
  handleRowMoveManagerColumn: boolean;

  /** Row Selection on these columns */
  rowSelectColumnIds: string[];

  /** function to toggle Row Selection Models */
  rowSelectOverride: RowSelectOverride | undefined;

  /** Defaults to 'mixed', use a specifc selection type */
  selectionType: 'cell' | 'row' | 'mixed';
}

export interface RowSelectionModelOption {
  /** Defaults to True, should we auto-scroll when dragging a row */
  autoScrollWhenDrag?: boolean;

  /** Defaults to False, should we select when dragging? */
  dragToSelect?: boolean;

  /** cell range selector */
  cellRangeSelector?: SlickCellRangeSelector;

  /** defaults to True, do we want to select the active row? */
  selectActiveRow?: boolean;
}
