"use strict";
(() => {
  // src/plugins/slick.cellrangeselector.js
  var SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, SlickRange = Slick.Range, Draggable = Slick.Draggable, CellRangeDecorator = Slick.CellRangeDecorator, Utils = Slick.Utils;
  function CellRangeSelector(options) {
    var _grid, _currentlySelectedRange, _canvas, _gridOptions, _activeCanvas, _dragging, _decorator, _self = this, _handler = new EventHandler(), _defaults = {
      autoScroll: !0,
      minIntervalToShowNextCell: 30,
      maxIntervalToShowNextCell: 600,
      // better to a multiple of minIntervalToShowNextCell
      accelerateInterval: 5,
      // increase 5ms when cursor 1px outside the viewport.
      selectionCss: {
        border: "2px dashed blue"
      }
    }, _rowOffset, _columnOffset, _isRightCanvas, _isBottomCanvas, _activeViewport, _viewportWidth, _viewportHeight, _draggingMouseOffset, _moveDistanceForOneCell, _autoScrollTimerId, _xDelayForNextCell, _yDelayForNextCell, _isRowMoveRegistered = !1, _scrollTop = 0, _scrollLeft = 0;
    function init(grid) {
      if (typeof Draggable == "undefined")
        throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
      options = Utils.extend(!0, {}, _defaults, options), _decorator = options.cellDecorator || new CellRangeDecorator(grid, options), _grid = grid, _canvas = _grid.getCanvasNode(), _gridOptions = _grid.getOptions(), _handler.subscribe(_grid.onScroll, handleScroll).subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
    }
    function destroy() {
      _handler.unsubscribeAll(), _activeCanvas = null, _activeViewport = null, _canvas = null, _decorator && _decorator.destroy && _decorator.destroy();
    }
    function getCellDecorator() {
      return _decorator;
    }
    function handleScroll(e, args) {
      _scrollTop = args.scrollTop, _scrollLeft = args.scrollLeft;
    }
    function handleDragInit(e) {
      _activeCanvas = _grid.getActiveCanvasNode(e), _activeViewport = _grid.getActiveViewportNode(e);
      var scrollbarDimensions = _grid.getDisplayedScrollbarDimensions();
      if (_viewportWidth = _activeViewport.offsetWidth - scrollbarDimensions.width, _viewportHeight = _activeViewport.offsetHeight - scrollbarDimensions.height, _moveDistanceForOneCell = {
        x: _grid.getAbsoluteColumnMinWidth() / 2,
        y: _grid.getOptions().rowHeight / 2
      }, _isRowMoveRegistered = hasRowMoveManager(), _rowOffset = 0, _columnOffset = 0, _isBottomCanvas = _activeCanvas.classList.contains("grid-canvas-bottom"), _gridOptions.frozenRow > -1 && _isBottomCanvas) {
        let canvasSelector = `.${_grid.getUID()} .grid-canvas-${_gridOptions.frozenBottom ? "bottom" : "top"}`, canvasElm = document.querySelector(canvasSelector);
        canvasElm && (_rowOffset = canvasElm.clientHeight || 0);
      }
      if (_isRightCanvas = _activeCanvas.classList.contains("grid-canvas-right"), _gridOptions.frozenColumn > -1 && _isRightCanvas) {
        let canvasLeftElm = document.querySelector(`.${_grid.getUID()} .grid-canvas-left`);
        canvasLeftElm && (_columnOffset = canvasLeftElm.clientWidth || 0);
      }
      e.stopImmediatePropagation(), e.preventDefault();
    }
    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);
      if (_self.onBeforeCellRangeSelected.notify(cell) !== !1 && _grid.canCellBeSelected(cell.row, cell.cell) && (_dragging = !0, e.stopImmediatePropagation()), !_dragging)
        return;
      _grid.focus();
      let canvasOffset = Utils.offset(_canvas), startX = dd.startX - (canvasOffset.left || 0);
      _gridOptions.frozenColumn >= 0 && _isRightCanvas && (startX += _scrollLeft);
      let startY = dd.startY - (canvasOffset.top || 0);
      _gridOptions.frozenRow >= 0 && _isBottomCanvas && (startY += _scrollTop);
      var start = _grid.getCellFromPoint(startX, startY);
      return dd.range = { start, end: {} }, _currentlySelectedRange = dd.range, _decorator.show(new SlickRange(start.row, start.cell));
    }
    function handleDrag(evt, dd) {
      if (!_dragging && !_isRowMoveRegistered)
        return;
      _isRowMoveRegistered || evt.stopImmediatePropagation();
      let e = evt.getNativeEvent();
      if (options.autoScroll && (_draggingMouseOffset = getMouseOffsetViewport(e, dd), _draggingMouseOffset.isOutsideViewport))
        return handleDragOutsideViewport();
      stopIntervalTimer(), handleDragTo(e, dd);
    }
    function getMouseOffsetViewport(e, dd) {
      var targetEvent = e.touches ? e.touches[0] : e, viewportLeft = _activeViewport.scrollLeft, viewportTop = _activeViewport.scrollTop, viewportRight = viewportLeft + _viewportWidth, viewportBottom = viewportTop + _viewportHeight, viewportOffset = Utils.offset(_activeViewport), viewportOffsetLeft = viewportOffset.left || 0, viewportOffsetTop = viewportOffset.top || 0, viewportOffsetRight = viewportOffsetLeft + _viewportWidth, viewportOffsetBottom = viewportOffsetTop + _viewportHeight, result = {
        e,
        dd,
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
        isOutsideViewport: !1
      };
      return targetEvent.pageX < viewportOffsetLeft ? result.offset.x = targetEvent.pageX - viewportOffsetLeft : targetEvent.pageX > viewportOffsetRight && (result.offset.x = targetEvent.pageX - viewportOffsetRight), targetEvent.pageY < viewportOffsetTop ? result.offset.y = viewportOffsetTop - targetEvent.pageY : targetEvent.pageY > viewportOffsetBottom && (result.offset.y = viewportOffsetBottom - targetEvent.pageY), result.isOutsideViewport = !!result.offset.x || !!result.offset.y, result;
    }
    function handleDragOutsideViewport() {
      if (_xDelayForNextCell = options.maxIntervalToShowNextCell - Math.abs(_draggingMouseOffset.offset.x) * options.accelerateInterval, _yDelayForNextCell = options.maxIntervalToShowNextCell - Math.abs(_draggingMouseOffset.offset.y) * options.accelerateInterval, !_autoScrollTimerId) {
        var xTotalDelay = 0, yTotalDelay = 0;
        _autoScrollTimerId = setInterval(function() {
          var xNeedUpdate = !1, yNeedUpdate = !1;
          _draggingMouseOffset.offset.x ? (xTotalDelay += options.minIntervalToShowNextCell, xNeedUpdate = xTotalDelay >= _xDelayForNextCell) : xTotalDelay = 0, _draggingMouseOffset.offset.y ? (yTotalDelay += options.minIntervalToShowNextCell, yNeedUpdate = yTotalDelay >= _yDelayForNextCell) : yTotalDelay = 0, (xNeedUpdate || yNeedUpdate) && (xNeedUpdate && (xTotalDelay = 0), yNeedUpdate && (yTotalDelay = 0), handleDragToNewPosition(xNeedUpdate, yNeedUpdate));
        }, options.minIntervalToShowNextCell);
      }
    }
    function handleDragToNewPosition(xNeedUpdate, yNeedUpdate) {
      var pageX = _draggingMouseOffset.e.pageX, pageY = _draggingMouseOffset.e.pageY, mouseOffsetX = _draggingMouseOffset.offset.x, mouseOffsetY = _draggingMouseOffset.offset.y, viewportOffset = _draggingMouseOffset.viewport.offset;
      xNeedUpdate && mouseOffsetX && (mouseOffsetX > 0 ? pageX = viewportOffset.right + _moveDistanceForOneCell.x : pageX = viewportOffset.left - _moveDistanceForOneCell.x), yNeedUpdate && mouseOffsetY && (mouseOffsetY > 0 ? pageY = viewportOffset.top - _moveDistanceForOneCell.y : pageY = viewportOffset.bottom + _moveDistanceForOneCell.y), handleDragTo({
        pageX,
        pageY
      }, _draggingMouseOffset.dd);
    }
    function stopIntervalTimer() {
      clearInterval(_autoScrollTimerId), _autoScrollTimerId = null;
    }
    function handleDragTo(e, dd) {
      let targetEvent = e.touches ? e.touches[0] : e, canvasOffset = Utils.offset(_activeCanvas), end = _grid.getCellFromPoint(
        targetEvent.pageX - (canvasOffset && canvasOffset.left || 0) + _columnOffset,
        targetEvent.pageY - (canvasOffset && canvasOffset.top || 0) + _rowOffset
      );
      if (!(_gridOptions.frozenColumn >= 0 && !_isRightCanvas && end.cell > _gridOptions.frozenColumn || _isRightCanvas && end.cell <= _gridOptions.frozenColumn) && !(_gridOptions.frozenRow >= 0 && !_isBottomCanvas && end.row >= _gridOptions.frozenRow || _isBottomCanvas && end.row < _gridOptions.frozenRow)) {
        if (options.autoScroll && _draggingMouseOffset) {
          var endCellBox = _grid.getCellNodeBox(end.row, end.cell);
          if (!endCellBox)
            return;
          var viewport = _draggingMouseOffset.viewport;
          (endCellBox.left < viewport.left || endCellBox.right > viewport.right || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) && _grid.scrollCellIntoView(end.row, end.cell);
        }
        if (_grid.canCellBeSelected(end.row, end.cell) && dd && dd.range) {
          dd.range.end = end;
          var range = new SlickRange(dd.range.start.row, dd.range.start.cell, end.row, end.cell);
          _decorator.show(range), _self.onCellRangeSelecting.notify({
            range
          });
        }
      }
    }
    function hasRowMoveManager() {
      return !!(_grid.getPluginByName("RowMoveManager") || _grid.getPluginByName("CrossGridRowMoveManager"));
    }
    function handleDragEnd(e, dd) {
      _dragging && (_dragging = !1, e.stopImmediatePropagation(), stopIntervalTimer(), _decorator.hide(), _self.onCellRangeSelected.notify({
        range: new SlickRange(
          dd.range.start.row,
          dd.range.start.cell,
          dd.range.end.row,
          dd.range.end.cell
        )
      }));
    }
    function getCurrentRange() {
      return _currentlySelectedRange;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "CellRangeSelector",
      getCellDecorator,
      getCurrentRange,
      onBeforeCellRangeSelected: new SlickEvent(),
      onCellRangeSelected: new SlickEvent(),
      onCellRangeSelecting: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(Slick, {
    CellRangeSelector
  });
})();
