import { SlickEvent as SlickEvent_, type SlickEventData, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_ } from '../slick.core.js';
import { SlickCellRangeDecorator as SlickCellRangeDecorator_ } from './slick.cellrangedecorator.js';
import type { CellRangeSelectorOption, DragPosition, DragRange, DragRowMove, GridOption, MouseOffsetViewport, OnScrollEventArgs, SlickPlugin } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
export declare class SlickCellRangeSelector implements SlickPlugin {
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
    protected _handler: SlickEventHandler_;
    protected _options: CellRangeSelectorOption;
    protected _defaults: CellRangeSelectorOption;
    protected _rowOffset: number;
    protected _columnOffset: number;
    protected _isRightCanvas: boolean;
    protected _isBottomCanvas: boolean;
    protected _activeViewport: HTMLElement;
    protected _autoScrollTimerId?: number;
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
    protected handleScroll(_e: SlickEventData, args: OnScrollEventArgs): void;
    protected handleDragInit(e: SlickEventData): void;
    protected handleDragStart(e: SlickEventData, dd: DragRowMove): HTMLDivElement | undefined;
    protected handleDrag(evt: SlickEventData, dd: DragRowMove): void;
    protected getMouseOffsetViewport(e: MouseEvent | TouchEvent, dd: DragRowMove): MouseOffsetViewport;
    protected handleDragOutsideViewport(): void;
    protected handleDragToNewPosition(xNeedUpdate: boolean, yNeedUpdate: boolean): void;
    protected stopIntervalTimer(): void;
    protected handleDragTo(e: {
        pageX: number;
        pageY: number;
    }, dd: DragPosition): void;
    protected hasRowMoveManager(): boolean;
    protected handleDragEnd(e: SlickEventData, dd: DragPosition): void;
    getCurrentRange(): DragRange | null;
}
//# sourceMappingURL=slick.cellrangeselector.d.ts.map