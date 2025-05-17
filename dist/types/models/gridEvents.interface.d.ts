import type { Column, CompositeEditorOption, CssStyleHash, Editor, EditorValidationResult, GridOption } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface SlickGridArg {
    grid: SlickGrid;
}
export interface OnActiveCellChangedEventArgs extends SlickGridArg {
    cell: number;
    row: number;
}
export interface OnAddNewRowEventArgs extends SlickGridArg {
    item: any;
    column: Column;
}
export interface OnAfterSetColumnsEventArgs extends SlickGridArg {
    newColumns: Column[];
}
export interface OnAutosizeColumnsEventArgs extends SlickGridArg {
    columns: Column[];
}
export interface OnBeforeUpdateColumnsEventArgs extends SlickGridArg {
    columns: Column[];
}
export interface OnBeforeAppendCellEventArgs extends SlickGridArg {
    row: number;
    cell: number;
    value: any;
    dataContext: any;
}
export interface OnBeforeCellEditorDestroyEventArgs extends SlickGridArg {
    editor: Editor;
}
export interface OnBeforeColumnsResizeEventArgs extends SlickGridArg {
    triggeredByColumn: string;
}
export interface OnBeforeEditCellEventArgs extends SlickGridArg {
    row?: number;
    cell?: number;
    item: any;
    column: Column;
    target?: 'grid' | 'composite';
    compositeEditorOptions?: CompositeEditorOption;
}
export interface OnBeforeHeaderCellDestroyEventArgs extends SlickGridArg {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeHeaderRowCellDestroyEventArgs extends SlickGridArg {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeFooterRowCellDestroyEventArgs extends SlickGridArg {
    node: HTMLElement;
    column: Column;
}
export interface OnBeforeSetColumnsEventArgs extends SlickGridArg {
    previousColumns: Column[];
    newColumns: Column[];
}
export interface OnCellChangeEventArgs extends SlickGridArg {
    row: number;
    cell: number;
    item: any;
    column: Column;
}
export interface OnCellCssStylesChangedEventArgs extends SlickGridArg {
    key: string;
    hash: CssStyleHash;
}
export interface OnColumnsDragEventArgs extends SlickGridArg {
    triggeredByColumn: string;
    resizeHandle: HTMLDivElement;
}
export interface OnColumnsReorderedEventArgs extends SlickGridArg {
    impactedColumns: Column[];
}
export interface OnColumnsResizedEventArgs extends SlickGridArg {
    triggeredByColumn: string;
}
export interface OnColumnsResizeDblClickEventArgs extends SlickGridArg {
    triggeredByColumn: string;
}
export interface OnCompositeEditorChangeEventArgs extends SlickGridArg {
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
export interface OnClickEventArgs extends SlickGridArg {
    row: number;
    cell: number;
}
export interface OnDblClickEventArgs extends SlickGridArg {
    row: number;
    cell: number;
}
export interface OnFooterContextMenuEventArgs extends SlickGridArg {
    column: Column;
}
export interface OnFooterRowCellRenderedEventArgs extends SlickGridArg {
    node: HTMLDivElement;
    column: Column;
}
export interface OnHeaderCellRenderedEventArgs extends SlickGridArg {
    node: HTMLDivElement;
    column: Column;
}
export interface OnFooterClickEventArgs extends SlickGridArg {
    column: Column;
}
export interface OnHeaderClickEventArgs extends SlickGridArg {
    column: Column;
}
export interface OnHeaderContextMenuEventArgs extends SlickGridArg {
    column: Column;
}
export interface OnHeaderMouseEventArgs extends SlickGridArg {
    column: Column;
}
export interface OnHeaderRowCellRenderedEventArgs extends SlickGridArg {
    node: HTMLDivElement;
    column: Column;
}
export interface OnPreHeaderClickEventArgs extends SlickGridArg {
    node: HTMLElement;
}
export interface OnPreHeaderContextMenuEventArgs extends SlickGridArg {
    node: HTMLElement;
}
export interface OnKeyDownEventArgs extends SlickGridArg {
    row: number;
    cell: number;
}
export interface OnValidationErrorEventArgs extends SlickGridArg {
    row: number;
    cell: number;
    validationResults: EditorValidationResult;
    column: Column;
    editor: Editor;
    cellNode: HTMLDivElement;
}
export interface OnRenderedEventArgs extends SlickGridArg {
    startRow: number;
    endRow: number;
}
export interface OnSelectedRowsChangedEventArgs extends SlickGridArg {
    rows: number[];
    previousSelectedRows: number[];
    changedSelectedRows: number[];
    changedUnselectedRows: number[];
    caller: string;
}
export interface OnSetOptionsEventArgs extends SlickGridArg {
    optionsBefore: GridOption;
    optionsAfter: GridOption;
}
export interface OnActivateChangedOptionsEventArgs extends SlickGridArg {
    options: GridOption;
}
export interface OnScrollEventArgs extends SlickGridArg {
    scrollLeft: number;
    scrollTop: number;
    cell: number;
    row: number;
}
export interface OnDragEventArgs extends SlickGridArg {
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