/// <reference types="node" />
import { SlickEvent as SlickEvent_, SlickEventData, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_ } from '../slick.core';
import { SlickCellRangeDecorator as SlickCellRangeDecorator_ } from './slick.cellrangedecorator';
import type { CellRangeSelectorOption, DOMMouseOrTouchEvent, DragPosition, DragRange, GridOption, MouseOffsetViewport, OnScrollEventArgs, Plugin } from '../models/index';
import type { SlickGrid } from '../slick.grid';
export declare class SlickCellRangeSelector implements Plugin {
    pluginName: "CellRangeSelector";
    onBeforeCellRangeSelected: SlickEvent_<{
        row: number;
        cell: number;
    }>;
    onCellRangeSelected: SlickEvent_<{
        range: SlickRange_;
    }>;
    onCellRangeSelecting: SlickEvent_<{
        range: SlickRange_;
    }>;
    protected _grid: SlickGrid;
    protected _currentlySelectedRange: DragRange | null;
    protected _canvas: HTMLElement | null;
    protected _decorator: SlickCellRangeDecorator_;
    protected _gridOptions: GridOption;
    protected _activeCanvas: HTMLElement;
    protected _dragging: boolean;
    protected _handler: SlickEventHandler_<any>;
    protected _options: CellRangeSelectorOption;
    protected _defaults: CellRangeSelectorOption;
    protected _rowOffset: number;
    protected _columnOffset: number;
    protected _isRightCanvas: boolean;
    protected _isBottomCanvas: boolean;
    protected _activeViewport: HTMLElement;
    protected _autoScrollTimerId?: NodeJS.Timeout;
    protected _draggingMouseOffset: MouseOffsetViewport;
    protected _moveDistanceForOneCell: {
        x: number;
        y: number;
    };
    protected _xDelayForNextCell: number;
    protected _yDelayForNextCell: number;
    protected _viewportHeight: number;
    protected _viewportWidth: number;
    protected _isRowMoveRegistered: boolean;
    protected _scrollLeft: number;
    protected _scrollTop: number;
    constructor(options?: Partial<CellRangeSelectorOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    getCellDecorator(): SlickCellRangeDecorator_;
    protected handleScroll(_e: DOMMouseOrTouchEvent<HTMLDivElement>, args: OnScrollEventArgs): void;
    protected handleDragInit(e: Event): void;
    protected handleDragStart(e: DOMMouseOrTouchEvent<HTMLDivElement>, dd: DragPosition): HTMLDivElement | undefined;
    protected handleDrag(evt: SlickEventData, dd: DragPosition): void;
    protected getMouseOffsetViewport(e: MouseEvent | TouchEvent, dd: DragPosition): MouseOffsetViewport;
    protected handleDragOutsideViewport(): void;
    protected handleDragToNewPosition(xNeedUpdate: boolean, yNeedUpdate: boolean): void;
    protected stopIntervalTimer(): void;
    protected handleDragTo(e: {
        pageX: number;
        pageY: number;
    }, dd: DragPosition): void;
    protected hasRowMoveManager(): boolean;
    protected handleDragEnd(e: Event, dd: DragPosition): void;
    getCurrentRange(): DragRange | null;
}
//# sourceMappingURL=slick.cellrangeselector.d.ts.map