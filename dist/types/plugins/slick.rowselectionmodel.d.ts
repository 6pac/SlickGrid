import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_ } from '../slick.core';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector';
import type { CellRange, OnActiveCellChangedEventArgs, RowSelectionModelOption } from '../models/index';
import type { SlickGrid } from '../slick.grid';
export declare class SlickRowSelectionModel {
    pluginName: "RowSelectionModel";
    onSelectedRangesChanged: SlickEvent_<CellRange[]>;
    protected _grid: SlickGrid;
    protected _ranges: CellRange[];
    protected _eventHandler: SlickEventHandler_<any>;
    protected _inHandler: boolean;
    protected _selector?: SlickCellRangeSelector_;
    protected _isRowMoveManagerHandler: any;
    protected _options: RowSelectionModelOption;
    protected _defaults: RowSelectionModelOption;
    constructor(options?: Partial<RowSelectionModelOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected wrapHandler(handler: (...args: any) => void): (...args: any) => void;
    protected rangesToRows(ranges: CellRange[]): number[];
    protected rowsToRanges(rows: number[]): SlickRange_[];
    protected getRowsRange(from: number, to: number): number[];
    getSelectedRows(): number[];
    setSelectedRows(rows: number[]): void;
    setSelectedRanges(ranges: CellRange[], caller?: string): void;
    getSelectedRanges(): CellRange[];
    refreshSelections(): void;
    protected handleActiveCellChange(_e: SlickEventData_, args: OnActiveCellChangedEventArgs): void;
    protected handleKeyDown(e: KeyboardEvent): void;
    protected handleClick(e: MouseEvent): boolean | void;
    protected handleBeforeCellRangeSelected(e: SlickEventData_, cell: {
        row: number;
        cell: number;
    }): boolean | void;
    protected handleCellRangeSelected(_e: SlickEventData_, args: {
        range: CellRange;
    }): boolean | void;
}
//# sourceMappingURL=slick.rowselectionmodel.d.ts.map