import { SlickEvent as SlickEvent_, SlickEventData, SlickEventHandler as SlickEventHandler_, SlickRange as SlickRange_, Utils as Utils_ } from '../slick.core';
import { Draggable as Draggable_ } from '../slick.interactions';
import { SlickCellRangeDecorator as SlickCellRangeDecorator_ } from './slick.cellrangedecorator';
import type { CellRangeSelectorOption, DOMMouseOrTouchEvent, DragPosition, DragRange, GridOption, MouseOffsetViewport, OnScrollEventArgs, Plugin } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const SlickRange = IIFE_ONLY ? Slick.Range : SlickRange_;
const Draggable = IIFE_ONLY ? Slick.Draggable : Draggable_;
const SlickCellRangeDecorator = IIFE_ONLY ? Slick.CellRangeDecorator : SlickCellRangeDecorator_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export class SlickCellRangeSelector implements Plugin {
  // --
  // public API
  pluginName = 'CellRangeSelector' as const;
  onBeforeCellRangeSelected = new SlickEvent<{ row: number; cell: number; }>();
  onCellRangeSelected = new SlickEvent<{ range: SlickRange_; }>();
  onCellRangeSelecting = new SlickEvent<{ range: SlickRange_; }>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _currentlySelectedRange: DragRange | null = null;
  protected _canvas: HTMLElement | null = null;
  protected _decorator!: SlickCellRangeDecorator_;
  protected _gridOptions!: GridOption;
  protected _activeCanvas!: HTMLElement;
  protected _dragging = false;
  protected _handler = new SlickEventHandler();
  protected _options: CellRangeSelectorOption;
  protected _defaults = {
    autoScroll: true,
    minIntervalToShowNextCell: 30,
    maxIntervalToShowNextCell: 600, // better to a multiple of minIntervalToShowNextCell
    accelerateInterval: 5,          // increase 5ms when cursor 1px outside the viewport.
    selectionCss: {
      border: '2px dashed blue'
    }
  } as CellRangeSelectorOption;

  // Frozen row & column variables
  protected _rowOffset = 0;
  protected _columnOffset = 0;
  protected _isRightCanvas = false;
  protected _isBottomCanvas = false;

  // autoScroll related constiables
  protected _activeViewport!: HTMLElement;
  protected _autoScrollTimerId?: NodeJS.Timeout;
  protected _draggingMouseOffset!: MouseOffsetViewport;
  protected _moveDistanceForOneCell!: { x: number; y: number; };
  protected _xDelayForNextCell = 0;
  protected _yDelayForNextCell = 0;
  protected _viewportHeight = 0;
  protected _viewportWidth = 0;
  protected _isRowMoveRegistered = false;

  // Scrollings
  protected _scrollLeft = 0;
  protected _scrollTop = 0;

  constructor(options?: Partial<CellRangeSelectorOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  init(grid: SlickGrid) {
    if (Draggable === undefined) {
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    }

    this._decorator = this._options.cellDecorator || new SlickCellRangeDecorator(grid, this._options);
    this._grid = grid;
    this._canvas = this._grid.getCanvasNode();
    this._gridOptions = this._grid.getOptions();
    this._handler
      .subscribe(this._grid.onScroll, this.handleScroll.bind(this))
      .subscribe(this._grid.onDragInit, this.handleDragInit.bind(this))
      .subscribe(this._grid.onDragStart, this.handleDragStart.bind(this))
      .subscribe(this._grid.onDrag, this.handleDrag.bind(this))
      .subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
  }

  destroy() {
    this._handler.unsubscribeAll();
    this._activeCanvas = null as any;
    this._activeViewport = null as any;
    this._canvas = null;
    this._decorator?.destroy();
  }

  getCellDecorator() {
    return this._decorator;
  }

  protected handleScroll(_e: DOMMouseOrTouchEvent<HTMLDivElement>, args: OnScrollEventArgs) {
    this._scrollTop = args.scrollTop;
    this._scrollLeft = args.scrollLeft;
  }

  protected handleDragInit(e: Event) {
    // Set the active canvas node because the decorator needs to append its
    // box to the correct canvas
    this._activeCanvas = this._grid.getActiveCanvasNode(e);
    this._activeViewport = this._grid.getActiveViewportNode(e);

    const scrollbarDimensions = this._grid.getDisplayedScrollbarDimensions()
    this._viewportWidth = this._activeViewport.offsetWidth - scrollbarDimensions.width;
    this._viewportHeight = this._activeViewport.offsetHeight - scrollbarDimensions.height;

    this._moveDistanceForOneCell = {
      x: this._grid.getAbsoluteColumnMinWidth() / 2,
      y: this._grid.getOptions().rowHeight! / 2
    }
    this._isRowMoveRegistered = this.hasRowMoveManager();

    this._rowOffset = 0;
    this._columnOffset = 0;
    this._isBottomCanvas = this._activeCanvas.classList.contains('grid-canvas-bottom');

    if (this._gridOptions.frozenRow! > -1 && this._isBottomCanvas) {
      const canvasSelector = `.${this._grid.getUID()} .grid-canvas-${this._gridOptions.frozenBottom ? 'bottom' : 'top'}`;
      const canvasElm = document.querySelector(canvasSelector);
      if (canvasElm) {
        this._rowOffset = canvasElm.clientHeight || 0;
      }
    }

    this._isRightCanvas = this._activeCanvas.classList.contains('grid-canvas-right');

    if (this._gridOptions.frozenColumn! > -1 && this._isRightCanvas) {
      const canvasLeftElm = document.querySelector(`.${this._grid.getUID()} .grid-canvas-left`);
      if (canvasLeftElm) {
        this._columnOffset = canvasLeftElm.clientWidth || 0;
      }
    }

    // prevent the grid from cancelling drag'n'drop by default
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  protected handleDragStart(e: DOMMouseOrTouchEvent<HTMLDivElement>, dd: DragPosition) {
    const cell = this._grid.getCellFromEvent(e);
    if (cell && this.onBeforeCellRangeSelected.notify(cell).getReturnValue() !== false && this._grid.canCellBeSelected(cell.row, cell.cell)) {
      this._dragging = true;
      e.stopImmediatePropagation();
    }
    if (!this._dragging) {
      return;
    }

    this._grid.focus();

    const canvasOffset = Utils.offset(this._canvas);

    let startX = dd.startX - (canvasOffset?.left ?? 0);
    if (this._gridOptions.frozenColumn! >= 0 && this._isRightCanvas) {
      startX += this._scrollLeft;
    }

    let startY = dd.startY - (canvasOffset?.top ?? 0);
    if (this._gridOptions.frozenRow! >= 0 && this._isBottomCanvas) {
      startY += this._scrollTop;
    }

    const start = this._grid.getCellFromPoint(startX, startY);

    dd.range = { start: start, end: {} };
    this._currentlySelectedRange = dd.range;
    return this._decorator.show(new SlickRange(start.row, start.cell));
  }

  protected handleDrag(evt: SlickEventData, dd: DragPosition) {
    if (!this._dragging && !this._isRowMoveRegistered) {
      return;
    }
    if (!this._isRowMoveRegistered) {
      evt.stopImmediatePropagation();
    }

    const e = evt.getNativeEvent<MouseEvent>();
    if (this._options.autoScroll) {
      this._draggingMouseOffset = this.getMouseOffsetViewport(e, dd);
      if (this._draggingMouseOffset.isOutsideViewport) {
        return this.handleDragOutsideViewport();
      }
    }
    this.stopIntervalTimer();
    this.handleDragTo(e, dd);
  }

  protected getMouseOffsetViewport(e: MouseEvent | TouchEvent, dd: DragPosition): MouseOffsetViewport {
    const targetEvent: MouseEvent | Touch = (e as TouchEvent)?.touches?.[0] ?? e;
    const viewportLeft = this._activeViewport.scrollLeft;
    const viewportTop = this._activeViewport.scrollTop;
    const viewportRight = viewportLeft + this._viewportWidth;
    const viewportBottom = viewportTop + this._viewportHeight;

    const viewportOffset = Utils.offset(this._activeViewport);
    const viewportOffsetLeft = viewportOffset?.left ?? 0;
    const viewportOffsetTop = viewportOffset?.top ?? 0;
    const viewportOffsetRight = viewportOffsetLeft + this._viewportWidth;
    const viewportOffsetBottom = viewportOffsetTop + this._viewportHeight;

    const result = {
      e: e,
      dd: dd,
      viewport: {
        left: viewportLeft,
        top: viewportTop,
        right: viewportRight,
        bottom: viewportBottom,
        offset: {
          left: viewportOffsetLeft,
          top: viewportOffsetTop,
          right: viewportOffsetRight,
          bottom: viewportOffsetBottom
        }
      },
      // Consider the viewport as the origin, the `offset` is based on the coordinate system:
      // the cursor is on the viewport's left/bottom when it is less than 0, and on the right/top when greater than 0.
      offset: {
        x: 0,
        y: 0
      },
      isOutsideViewport: false
    }
    // ... horizontal
    if (targetEvent.pageX < viewportOffsetLeft) {
      result.offset.x = targetEvent.pageX - viewportOffsetLeft;
    } else if (targetEvent.pageX > viewportOffsetRight) {
      result.offset.x = targetEvent.pageX - viewportOffsetRight;
    }
    // ... vertical
    if (targetEvent.pageY < viewportOffsetTop) {
      result.offset.y = viewportOffsetTop - targetEvent.pageY;
    } else if (targetEvent.pageY > viewportOffsetBottom) {
      result.offset.y = viewportOffsetBottom - targetEvent.pageY;
    }
    result.isOutsideViewport = !!result.offset.x || !!result.offset.y;
    return result;
  }

  protected handleDragOutsideViewport() {
    this._xDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.x) * this._options.accelerateInterval;
    this._yDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.y) * this._options.accelerateInterval;
    // only one timer is created to handle the case that cursor outside the viewport
    if (!this._autoScrollTimerId) {
      let xTotalDelay = 0;
      let yTotalDelay = 0;
      this._autoScrollTimerId = setInterval(() => {
        let xNeedUpdate = false;
        let yNeedUpdate = false;
        // ... horizontal
        if (this._draggingMouseOffset.offset.x) {
          xTotalDelay += this._options.minIntervalToShowNextCell;
          xNeedUpdate = xTotalDelay >= this._xDelayForNextCell;
        } else {
          xTotalDelay = 0;
        }
        // ... vertical
        if (this._draggingMouseOffset.offset.y) {
          yTotalDelay += this._options.minIntervalToShowNextCell;
          yNeedUpdate = yTotalDelay >= this._yDelayForNextCell;
        } else {
          yTotalDelay = 0;
        }
        if (xNeedUpdate || yNeedUpdate) {
          if (xNeedUpdate) {
            xTotalDelay = 0;
          }
          if (yNeedUpdate) {
            yTotalDelay = 0;
          }
          this.handleDragToNewPosition(xNeedUpdate, yNeedUpdate);
        }
      }, this._options.minIntervalToShowNextCell);
    }
  }

  protected handleDragToNewPosition(xNeedUpdate: boolean, yNeedUpdate: boolean) {
    let pageX = this._draggingMouseOffset.e.pageX;
    let pageY = this._draggingMouseOffset.e.pageY;
    const mouseOffsetX = this._draggingMouseOffset.offset.x;
    const mouseOffsetY = this._draggingMouseOffset.offset.y;
    const viewportOffset = this._draggingMouseOffset.viewport.offset;
    // ... horizontal
    if (xNeedUpdate && mouseOffsetX) {
      if (mouseOffsetX > 0) {
        pageX = viewportOffset.right + this._moveDistanceForOneCell.x;
      } else {
        pageX = viewportOffset.left - this._moveDistanceForOneCell.x;
      }
    }
    // ... vertical
    if (yNeedUpdate && mouseOffsetY) {
      if (mouseOffsetY > 0) {
        pageY = viewportOffset.top - this._moveDistanceForOneCell.y;
      } else {
        pageY = viewportOffset.bottom + this._moveDistanceForOneCell.y;
      }
    }
    this.handleDragTo({ pageX, pageY }, this._draggingMouseOffset.dd);
  }

  protected stopIntervalTimer() {
    if (this._autoScrollTimerId) {
      clearInterval(this._autoScrollTimerId);
      this._autoScrollTimerId = undefined;
    }
  }

  protected handleDragTo(e: { pageX: number; pageY: number; }, dd: DragPosition) {
    const targetEvent: MouseEvent | Touch = (e as unknown as TouchEvent)?.touches?.[0] ?? e;
    const canvasOffset = Utils.offset(this._activeCanvas);
    const end = this._grid.getCellFromPoint(
      targetEvent.pageX - (canvasOffset?.left ?? 0) + this._columnOffset,
      targetEvent.pageY - (canvasOffset?.top ?? 0) + this._rowOffset
    );

    // ... frozen column(s),
    if (this._gridOptions.frozenColumn! >= 0 && (!this._isRightCanvas && (end.cell > this._gridOptions.frozenColumn!)) || (this._isRightCanvas && (end.cell <= this._gridOptions.frozenColumn!))) {
      return;
    }

    // ... or frozen row(s)
    if (this._gridOptions.frozenRow! >= 0 && (!this._isBottomCanvas && (end.row >= this._gridOptions.frozenRow!)) || (this._isBottomCanvas && (end.row < this._gridOptions.frozenRow!))) {
      return;
    }

    // scrolling the viewport to display the target `end` cell if it is not fully displayed
    if (this._options.autoScroll && this._draggingMouseOffset) {
      const endCellBox = this._grid.getCellNodeBox(end.row, end.cell);
      if (!endCellBox) {
        return;
      }
      const viewport = this._draggingMouseOffset.viewport;
      if (endCellBox.left < viewport.left || endCellBox.right > viewport.right
        || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) {
        this._grid.scrollCellIntoView(end.row, end.cell);
      }
    }

    // ... or regular grid (without any frozen options)
    if (!this._grid.canCellBeSelected(end.row, end.cell)) {
      return;
    }

    if (dd?.range) {
      dd.range.end = end;

      const range = new SlickRange(dd.range.start.row ?? 0, dd.range.start.cell ?? 0, end.row, end.cell);
      this._decorator.show(range);
      this.onCellRangeSelecting.notify({
        range: range
      });
    }
  }

  protected hasRowMoveManager() {
    return !!(this._grid.getPluginByName('RowMoveManager') || this._grid.getPluginByName('CrossGridRowMoveManager'));
  }

  protected handleDragEnd(e: Event, dd: DragPosition) {
    if (!this._dragging) {
      return;
    }

    this._dragging = false;
    e.stopImmediatePropagation();

    this.stopIntervalTimer();
    this._decorator.hide();
    this.onCellRangeSelected.notify({
      range: new SlickRange(
        dd.range.start.row ?? 0,
        dd.range.start.cell ?? 0,
        dd.range.end.row,
        dd.range.end.cell
      )
    });
  }

  getCurrentRange() {
    return this._currentlySelectedRange;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    CellRangeSelector: SlickCellRangeSelector
  });
}
