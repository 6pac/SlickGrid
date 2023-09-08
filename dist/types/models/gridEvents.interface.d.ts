import type { Column, CompositeEditorOption, CssStyleHash, Editor, EditorValidationResult, GridOption } from './index';
import type { SlickGrid } from '../slick.grid';
export interface SlickGridEventData {
    grid: SlickGrid;
}
export interface OnActiveCellChangedEventArgs extends SlickGridEventData {
    cell: number;
    row: number;
}
export interface OnAddNewRowEventArgs extends SlickGridEventData {
    item: any;
    column: Column;
}
export interface OnAutosizeColumnsEventArgs extends SlickGridEventData {
    columns: Column[];
}
export interface OnBeforeUpdateColumnsEventArgs extends SlickGridEventData {
    columns: Column[];
}
export interface OnBeforeAppendCellEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
    value: any;
    dataContext: any;
}
export interface OnBeforeCellEditorDestroyEventArgs extends SlickGridEventData {
    editor: Editor;
}
export interface OnBeforeColumnsResizeEventArgs extends SlickGridEventData {
    triggeredByColumn: string;
}
export interface OnBeforeEditCellEventArgs extends SlickGridEventData {
    row?: number;
    cell?: number;
    item: any;
    column: Column;
    target?: 'grid' | 'composite';
    compositeEditorOptions?: CompositeEditorOption;
}
export interface OnBeforeHeaderCellDestroyEventArgs extends SlickGridEventData {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeHeaderRowCellDestroyEventArgs extends SlickGridEventData {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeFooterRowCellDestroyEventArgs extends SlickGridEventData {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeSetColumnsEventArgs extends SlickGridEventData {
    previousColumns: Column[];
    newColumns: Column[];
}
export interface OnCellChangeEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
    item: any;
    column: Column;
}
export interface OnCellCssStylesChangedEventArgs extends SlickGridEventData {
    key: string;
    hash: CssStyleHash;
}
export interface OnColumnsDragEventArgs extends SlickGridEventData {
    triggeredByColumn: string;
    resizeHandle: HTMLDivElement;
}
export interface OnColumnsReorderedEventArgs extends SlickGridEventData {
    impactedColumns: Column[];
}
export interface OnColumnsResizedEventArgs extends SlickGridEventData {
    triggeredByColumn: string;
}
export interface OnColumnsResizeDblClickEventArgs extends SlickGridEventData {
    triggeredByColumn: string;
}
export interface OnCompositeEditorChangeEventArgs extends SlickGridEventData {
    row?: number;
    cell?: number;
    item: any;
    column: Column;
    formValues: any;
    editors: {
        [columnId: string]: Editor;
    };
    triggeredBy?: 'user' | 'system';
}
export interface OnClickEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
}
export interface OnDblClickEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
}
export interface OnFooterContextMenuEventArgs extends SlickGridEventData {
    column: Column;
}
export interface OnFooterRowCellRenderedEventArgs extends SlickGridEventData {
    node: HTMLDivElement;
    column: Column;
}
export interface OnHeaderCellRenderedEventArgs extends SlickGridEventData {
    node: HTMLDivElement;
    column: Column;
}
export interface OnFooterClickEventArgs extends SlickGridEventData {
    column: Column;
}
export interface OnHeaderClickEventArgs extends SlickGridEventData {
    column: Column;
}
export interface OnHeaderContextMenuEventArgs extends SlickGridEventData {
    column: Column;
}
export interface OnHeaderMouseEventArgs extends SlickGridEventData {
    column: Column;
}
export interface OnHeaderRowCellRenderedEventArgs extends SlickGridEventData {
    node: HTMLDivElement;
    column: Column;
}
export interface OnKeyDownEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
}
export interface OnValidationErrorEventArgs extends SlickGridEventData {
    row: number;
    cell: number;
    validationResults: EditorValidationResult;
    column: Column;
    editor: Editor;
    cellNode: HTMLDivElement;
}
export interface OnRenderedEventArgs extends SlickGridEventData {
    startRow: number;
    endRow: number;
}
export interface OnSelectedRowsChangedEventArgs extends SlickGridEventData {
    rows: number[];
    previousSelectedRows: number[];
    changedSelectedRows: number[];
    changedUnselectedRows: number[];
    caller: string;
}
export interface OnSetOptionsEventArgs extends SlickGridEventData {
    optionsBefore: GridOption;
    optionsAfter: GridOption;
}
export interface OnActivateChangedOptionsEventArgs extends SlickGridEventData {
    options: GridOption;
}
export interface OnScrollEventArgs extends SlickGridEventData {
    scrollLeft: number;
    scrollTop: number;
}
export interface OnDragEventArgs extends SlickGridEventData {
    count: number;
    deltaX: number;
    deltaY: number;
    offsetX: number;
    offsetY: number;
    originalX: number;
    originalY: number;
    available: HTMLDivElement | HTMLDivElement[];
    drag: HTMLDivElement;
    drop: HTMLDivElement | HTMLDivElement[];
    helper: HTMLDivElement;
    proxy: HTMLDivElement;
    target: HTMLDivElement;
    mode: string;
    row: number;
    rows: number[];
    startX: number;
    startY: number;
}
//# sourceMappingURL=gridEvents.interface.d.ts.map