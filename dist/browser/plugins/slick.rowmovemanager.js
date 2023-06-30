"use strict";
(() => {
  // src/plugins/slick.rowmovemanager.js
  var SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function RowMoveManager(options) {
    var _grid, _canvas, _dragging, _self = this, _usabilityOverride = null, _handler = new EventHandler(), _defaults = {
      columnId: "_move",
      cssClass: null,
      cancelEditOnDrag: !1,
      disableRowSelection: !1,
      hideRowMoveShadow: !0,
      rowMoveShadowMarginTop: 0,
      rowMoveShadowMarginLeft: 0,
      rowMoveShadowOpacity: 0.95,
      rowMoveShadowScale: 0.75,
      singleRowMove: !1,
      width: 40
    };
    options && typeof options.usabilityOverride == "function" && usabilityOverride(options.usabilityOverride);
    function init(grid) {
      options = Utils.extend(!0, {}, _defaults, options), _grid = grid, _canvas = _grid.getCanvasNode(), _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
    }
    function destroy() {
      _handler.unsubscribeAll();
    }
    function setOptions(newOptions) {
      options = Utils.extend({}, options, newOptions);
    }
    function handleDragInit(e) {
      e.stopImmediatePropagation();
    }
    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e), currentRow = cell && cell.row, dataContext = _grid.getDataItem(currentRow);
      if (checkUsabilityOverride(currentRow, dataContext, _grid)) {
        if (options.cancelEditOnDrag && _grid.getEditorLock().isActive() && _grid.getEditorLock().cancelCurrentEdit(), _grid.getEditorLock().isActive() || !isHandlerColumn(cell.cell))
          return !1;
        if (_dragging = !0, e.stopImmediatePropagation(), !options.hideRowMoveShadow) {
          let cellNodeElm = _grid.getCellNode(cell.row, cell.cell), slickRowElm = cellNodeElm && cellNodeElm.closest(".slick-row");
          slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${options.rowMoveShadowScale || 0.75})`, _canvas.appendChild(dd.clonedSlickRow));
        }
        var selectedRows = options.singleRowMove ? [cell.row] : _grid.getSelectedRows();
        (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], options.disableRowSelection || _grid.setSelectedRows(selectedRows));
        var rowHeight = _grid.getOptions().rowHeight;
        dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${_canvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, _canvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${_canvas.clientWidth}px`, dd.guide.style.top = "-1000px", _canvas.appendChild(dd.guide), dd.insertBefore = -1;
      }
    }
    function handleDrag(evt, dd) {
      if (!_dragging)
        return;
      evt.stopImmediatePropagation();
      let e = evt.getNativeEvent();
      var targetEvent = e.touches ? e.touches[0] : e;
      let top = targetEvent.pageY - (Utils.offset(_canvas).top || 0);
      dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
      var insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
      if (insertBefore !== dd.insertBefore) {
        var eventData = {
          grid: _grid,
          rows: dd.selectedRows,
          insertBefore
        };
        if (_self.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, _usabilityOverride && dd.canMove) {
          var insertBeforeDataContext = _grid.getDataItem(insertBefore);
          dd.canMove = checkUsabilityOverride(insertBefore, insertBeforeDataContext, _grid);
        }
        dd.canMove ? dd.guide.style.top = `${insertBefore * (_grid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
      }
    }
    function handleDragEnd(e, dd) {
      if (_dragging && (_dragging = !1, e.stopImmediatePropagation(), dd.guide.remove(), dd.selectionProxy.remove(), dd.clonedSlickRow && (dd.clonedSlickRow.remove(), dd.clonedSlickRow = null), dd.canMove)) {
        var eventData = {
          grid: _grid,
          rows: dd.selectedRows,
          insertBefore: dd.insertBefore
        };
        _self.onMoveRows.notify(eventData);
      }
    }
    function getColumnDefinition() {
      return {
        id: options.columnId || "_move",
        name: "",
        field: "move",
        width: options.width || 40,
        behavior: "selectAndMove",
        selectable: !1,
        resizable: !1,
        // cssClass: options.cssClass,
        formatter: moveIconFormatter
      };
    }
    function moveIconFormatter(row, cell, value, columnDef, dataContext, grid) {
      return checkUsabilityOverride(row, dataContext, grid) ? { addClasses: "cell-reorder dnd " + options.cssClass || "", text: "" } : null;
    }
    function checkUsabilityOverride(row, dataContext, grid) {
      return typeof _usabilityOverride == "function" ? _usabilityOverride(row, dataContext, grid) : !0;
    }
    function usabilityOverride(overrideFn) {
      _usabilityOverride = overrideFn;
    }
    function isHandlerColumn(columnIndex) {
      return /move|selectAndMove/.test(_grid.getColumns()[columnIndex].behavior);
    }
    Utils.extend(this, {
      onBeforeMoveRows: new SlickEvent(),
      onMoveRows: new SlickEvent(),
      init,
      destroy,
      getColumnDefinition,
      setOptions,
      usabilityOverride,
      isHandlerColumn,
      pluginName: "RowMoveManager"
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      RowMoveManager
    }
  });
})();
