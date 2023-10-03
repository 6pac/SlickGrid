import { SlickEvent as SlickEvent_ } from '../slick.core';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector';
import type { CellRange, OnActiveCellChangedEventArgs } from '../models/index';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';
export interface CellSelectionModelOption {
    selectActiveCell: boolean;
    cellRangeSelector?: SlickCellRangeSelector_;
}
export declare class SlickCellSelectionModel {
    pluginName: "CellSelectionModel";
    onSelectedRangesChanged: SlickEvent_<CellRange[]>;
    protected _dataView?: SlickDataView;
    protected _grid: SlickGrid;
    protected _prevSelectedRow?: number;
    protected _prevKeyDown: string;
    protected _ranges: CellRange[];
    protected _selector: SlickCellRangeSelector_;
    protected _options?: CellSelectionModelOption;
    protected _defaults: CellSelectionModelOption;
    constructor(options?: {
        selectActiveCell: boolean;
        cellRangeSelector: SlickCellRangeSelector_;
    });
    init(grid: SlickGrid): void;
    destroy(): void;
    protected removeInvalidRanges(ranges: CellRange[]): CellRange[];
    protected rangesAreEqual(range1: CellRange[], range2: CellRange[]): boolean;
    setSelectedRanges(ranges: CellRange[], caller?: string): void;
    getSelectedRanges(): CellRange[];
    refreshSelections(): void;
    protected handleBeforeCellRangeSelected(e: Event): boolean | void;
    protected handleCellRangeSelected(_e: any, args: {
        range: CellRange;
    }): void;
    protected handleActiveCellChange(_e: Event, args: OnActiveCellChangedEventArgs): void;
    protected isKeyAllowed(key: string): boolean;
    protected handleKeyDown(e: KeyboardEvent): void;
}
//# sourceMappingURL=slick.cellselectionmodel.d.ts.map