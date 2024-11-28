import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
export interface OnGroupExpandedEventArgs {
    level: number;
    groupingKey: string | number | null;
}
export interface OnGroupCollapsedEventArgs {
    level: number;
    groupingKey: string | number | null;
}
export interface OnRowCountChangedEventArgs {
    previous: number;
    current: number;
    itemCount: number;
    dataView: SlickDataView;
    callingOnRowsChanged: boolean;
}
export interface OnRowsChangedEventArgs {
    rows: number[];
    itemCount: number;
    dataView: SlickDataView;
    calledOnRowCountChanged: boolean;
}
export interface OnRowsOrCountChangedEventArgs {
    rowsDiff: number[];
    previousRowCount: number;
    currentRowCount: number;
    itemCount: number;
    rowCountChanged: boolean;
    rowsChanged: boolean;
    dataView: SlickDataView;
}
export interface OnSelectedRowIdsChangedEventArgs {
    grid?: SlickGrid;
    added?: boolean;
    filteredIds: Array<string | number>;
    selectedRowIds: Array<string | number>;
    ids: Array<string | number>;
    rows: number[];
    dataView: SlickDataView;
}
export interface OnSetItemsCalledEventArgs {
    idProperty: string;
    itemCount: number;
}
//# sourceMappingURL=dataViewEvents.interface.d.ts.map