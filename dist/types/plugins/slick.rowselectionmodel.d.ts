import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_ } from '../slick.core.js';
import { SlickCellRangeSelector as SlickCellRangeSelector_ } from './slick.cellrangeselector.js';
import type { OnActiveCellChangedEventArgs, RowSelectionModelOption } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
export declare class SlickRowSelectionModel {
    pluginName: "RowSelectionModel";
    onSelectedRangesChanged: SlickEvent_<SlickRange_[]>;
    protected _grid: SlickGrid;
    protected _ranges: SlickRange_[];
    protected _eventHandler: SlickEventHandler_;
    protected _inHandler: boolean;
    protected _selector?: SlickCellRangeSelector_;
    protected _isRowMoveManagerHandler: any;
    protected _options: RowSelectionModelOption;
    protected _defaults: RowSelectionModelOption;
    constructor(options?: Partial<RowSelectionModelOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    protected wrapHandler(handler: (...args: any) => void): (...args: any) => void;
    protected rangesToRows(ranges: SlickRange_[]): number[];
    protected rowsToRanges(rows: number[]): SlickRange_[];
    protected getRowsRange(from: number, to: number): number[];
    getSelectedRows(): number[];
    setSelectedRows(rows: number[]): void;
    setSelectedRanges(ranges: SlickRange_[], caller?: string): void;
    getSelectedRanges(): SlickRange_[];
    refreshSelections(): void;
    protected handleActiveCellChange(_e: SlickEventData_, args: OnActiveCellChangedEventArgs): void;
    protected handleKeyDown(e: KeyboardEvent): void;
    protected handleClick(e: MouseEvent): boolean | void;
    protected handleBeforeCellRangeSelected(e: SlickEventData_, cell: {
        row: number;
        cell: number;
    }): boolean | void;
    protected handleCellRangeSelected(_e: SlickEventData_, args: {
        range: SlickRange_;
    }): boolean | void;
}
//# sourceMappingURL=slick.rowselectionmodel.d.ts.map