import { SlickEvent as SlickEvent_, type SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { Column, DragRowMove, FormatterResultWithHtml, RowMoveManagerOption, UsabilityOverrideFn } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * Row Move Manager options:
 *    containerCssClass:        A CSS class to be added to the cell container.
 *    cssClass:                 A CSS class to be added to the div of the cell formatter.
 *    columnId:                 Column definition id (defaults to "_move")
 *    cancelEditOnDrag:         Do we want to cancel any Editing while dragging a row (defaults to false)
 *    disableRowSelection:      Do we want to disable the row selection? (defaults to false)
 *    hideRowMoveShadow:        Do we want to hide the row move shadow clone? (defaults to true)
 *    rowMoveShadowMarginTop:   When row move shadow is shown, optional margin-top (defaults to 0)
 *    rowMoveShadowMarginLeft:  When row move shadow is shown, optional margin-left (defaults to 0)
 *    rowMoveShadowOpacity:     When row move shadow is shown, what is its opacity? (defaults to 0.95)
 *    rowMoveShadowScale:       When row move shadow is shown, what is its size scale? (default to 0.75)
 *    singleRowMove:            Do we want a single row move? Setting this to false means that it's a multple row move (defaults to false)
 *    width:                    Width of the column
 *    usabilityOverride:        Callback method that user can override the default behavior of the row being moveable or not
 *
 */
export declare class SlickRowMoveManager {
    pluginName: "RowMoveManager";
    onBeforeMoveRows: SlickEvent_<{
        grid: SlickGrid;
        rows: number[];
        insertBefore: number;
    }>;
    onMoveRows: SlickEvent_<{
        grid: SlickGrid;
        rows: number[];
        insertBefore: number;
    }>;
    protected _grid: SlickGrid;
    protected _canvas: HTMLElement;
    protected _dragging: boolean;
    protected _eventHandler: SlickEventHandler_;
    protected _usabilityOverride?: UsabilityOverrideFn;
    protected _options: RowMoveManagerOption;
    protected _defaults: RowMoveManagerOption;
    constructor(options: Partial<RowMoveManagerOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    setOptions(newOptions: Partial<RowMoveManagerOption>): void;
    protected handleDragInit(e: SlickEventData_): void;
    protected handleDragStart(e: SlickEventData_, dd: DragRowMove): boolean | void;
    protected handleDrag(evt: SlickEventData_, dd: DragRowMove): boolean | void;
    protected handleDragEnd(e: SlickEventData_, dd: DragRowMove): void;
    getColumnDefinition(): Column;
    protected moveIconFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultWithHtml | string;
    protected checkUsabilityOverride(row: number, dataContext: any, grid: SlickGrid): boolean;
    /**
     * Method that user can pass to override the default behavior or making every row moveable.
     * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
     * @param overrideFn: override function callback
     */
    usabilityOverride(overrideFn: UsabilityOverrideFn): void;
    isHandlerColumn(columnIndex: number | string): boolean;
}
//# sourceMappingURL=slick.rowmovemanager.d.ts.map