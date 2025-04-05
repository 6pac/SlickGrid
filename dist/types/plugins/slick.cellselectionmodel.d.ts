import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickRange as SlickRange_ } from '../slick.core.js';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector.js';
import type { CustomDataView, OnActiveCellChangedEventArgs } from '../models/index.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
export interface CellSelectionModelOption {
    selectActiveCell: boolean;
    cellRangeSelector?: SlickCellRangeSelector_;
}
export declare class SlickCellSelectionModel {
    pluginName: "CellSelectionModel";
    onSelectedRangesChanged: SlickEvent_<SlickRange_[]>;
    protected _cachedPageRowCount: number;
    protected _dataView?: CustomDataView | SlickDataView;
    protected _grid: SlickGrid;
    protected _prevSelectedRow?: number;
    protected _prevKeyDown: string;
    protected _ranges: SlickRange_[];
    protected _selector: SlickCellRangeSelector_;
    protected _options?: CellSelectionModelOption;
    protected _defaults: CellSelectionModelOption;
    constructor(options?: {
        selectActiveCell: boolean;
        cellRangeSelector: SlickCellRangeSelector_;
    });
    init(grid: SlickGrid): void;
    destroy(): void;
    protected removeInvalidRanges(ranges: SlickRange_[]): SlickRange_[];
    protected rangesAreEqual(range1: SlickRange_[], range2: SlickRange_[]): boolean;
    /** Provide a way to force a recalculation of page row count (for example on grid resize) */
    resetPageRowCount(): void;
    setSelectedRanges(ranges: SlickRange_[], caller?: string): void;
    getSelectedRanges(): SlickRange_[];
    refreshSelections(): void;
    protected handleBeforeCellRangeSelected(e: SlickEventData_): boolean | void;
    protected handleCellRangeSelected(_e: SlickEventData_, args: {
        range: SlickRange_;
    }): void;
    protected handleActiveCellChange(_e: SlickEventData_, args: OnActiveCellChangedEventArgs): void;
    protected isKeyAllowed(key: string, isShiftKeyPressed?: boolean): boolean;
    protected handleKeyDown(e: SlickEventData_): void;
}
//# sourceMappingURL=slick.cellselectionmodel.d.ts.map