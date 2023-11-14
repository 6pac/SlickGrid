import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_ } from '../slick.core';
import type { Column, DOMEvent, DragRowMove, CrossGridRowMoveManagerOption, FormatterResultWithText, UsabilityOverrideFn } from '../models/index';
import type { SlickGrid } from '../slick.grid';
/**
 * Row Move Manager options:
 *    cssClass:                 A CSS class to be added to the menu item container.
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
export declare class SlickCrossGridRowMoveManager {
    pluginName: "CrossGridRowMoveManager";
    onBeforeMoveRows: SlickEvent_<{
        rows: number[];
        insertBefore: number;
        fromGrid: SlickGrid;
        toGrid: SlickGrid;
    }>;
    onMoveRows: SlickEvent_<{
        rows: number[];
        insertBefore: number;
        fromGrid: SlickGrid;
        toGrid: SlickGrid;
    }>;
    protected _grid: SlickGrid;
    protected _canvas: HTMLElement;
    protected _dragging: boolean;
    protected _toGrid: SlickGrid;
    protected _toCanvas: HTMLElement;
    protected _usabilityOverride?: UsabilityOverrideFn;
    protected _eventHandler: SlickEventHandler_;
    protected _options: CrossGridRowMoveManagerOption;
    protected _defaults: CrossGridRowMoveManagerOption;
    constructor(options: Partial<CrossGridRowMoveManagerOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    setOptions(newOptions: CrossGridRowMoveManagerOption): void;
    protected handleDragInit(e: SlickEventData_): void;
    protected handleDragStart(e: DOMEvent<HTMLDivElement>, dd: DragRowMove & {
        fromGrid: SlickGrid;
        toGrid: SlickGrid;
    }): boolean | void;
    protected handleDrag(evt: SlickEventData_, dd: DragRowMove): boolean | void;
    protected handleDragEnd(e: SlickEventData_, dd: DragRowMove): void;
    getColumnDefinition(): Column;
    protected moveIconFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultWithText | string;
    protected checkUsabilityOverride(row: number, dataContext: any, grid: SlickGrid): boolean;
    /**
     * Method that user can pass to override the default behavior or making every row moveable.
     * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
     * @param overrideFn: override function callback
     */
    usabilityOverride(overrideFn: UsabilityOverrideFn): void;
    isHandlerColumn(columnIndex: number | string): boolean;
}
//# sourceMappingURL=slick.crossgridrowmovemanager.d.ts.map