import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_ } from '../slick.core.js';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector.js';
import type { CustomDataView, HybridSelectionModelOption, OnActiveCellChangedEventArgs, SelectionModel } from '../models/index.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickCrossGridRowMoveManager as SlickCrossGridRowMoveManager_ } from './slick.crossgridrowmovemanager.js';
import type { SlickRowMoveManager as SlickRowMoveManager_ } from './slick.rowmovemanager.js';
import type { SlickGrid } from '../slick.grid.js';
export declare class SlickHybridSelectionModel implements SelectionModel {
    pluginName: "HybridSelectionModel";
    onSelectedRangesChanged: SlickEvent_<SlickRange_[]>;
    protected _cachedPageRowCount: number;
    protected _dataView?: CustomDataView | SlickDataView;
    protected _eventHandler: SlickEventHandler_;
    protected _grid: SlickGrid;
    protected _prevSelectedRow?: number;
    protected _prevKeyDown: string;
    protected _ranges: SlickRange_[];
    protected _selector: SlickCellRangeSelector_;
    protected _isRowMoveManagerHandler: any;
    protected _activeSelectionIsRow: boolean;
    protected _options?: HybridSelectionModelOption;
    protected _defaults: HybridSelectionModelOption;
    constructor(options?: HybridSelectionModelOption);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected removeInvalidRanges(ranges: SlickRange_[]): SlickRange_[];
    protected rangesAreEqual(range1: SlickRange_[], range2: SlickRange_[]): boolean;
    protected rangesToRows(ranges: SlickRange_[]): number[];
    protected rowsToRanges(rows: number[]): SlickRange_[];
    protected getRowsRange(from: number, to: number): number[];
    getCellRangeSelector(): SlickCellRangeSelector_ | undefined;
    getSelectedRanges(): SlickRange_[];
    getSelectedRows(): number[];
    setSelectedRows(rows: number[]): void;
    /** Provide a way to force a recalculation of page row count (for example on grid resize) */
    resetPageRowCount(): void;
    setSelectedRanges(ranges: SlickRange_[], caller?: string, selectionMode?: string): void;
    currentSelectionModeIsRow(): boolean;
    refreshSelections(): void;
    getRowMoveManagerPlugin(): SlickRowMoveManager_ | SlickCrossGridRowMoveManager_ | undefined;
    rowSelectionModelIsActive(data: OnActiveCellChangedEventArgs): boolean;
    protected handleActiveCellChange(_e: SlickEventData_, args: OnActiveCellChangedEventArgs): void;
    protected isKeyAllowed(key: string, isShiftKeyPressed?: boolean): boolean;
    protected handleKeyDown(e: SlickEventData_): void;
    protected handleClick(e: SlickEventData_): boolean | void;
    protected handleBeforeCellRangeSelected(e: SlickEventData_, cell: {
        row: number;
        cell: number;
    }): boolean | void;
    protected handleCellRangeSelected(_e: SlickEventData_, args: {
        range: SlickRange_;
        selectionMode: string;
        allowAutoEdit?: boolean;
        caller: 'onCellRangeSelecting' | 'onCellRangeSelected';
    }): boolean;
}
//# sourceMappingURL=slick.hybridselectionmodel.d.ts.map