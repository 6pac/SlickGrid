import { SlickEvent as SlickEvent_, SlickEventData as SlickEventData_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core';
import type { Column, DOMEvent, DragRowMove, FormatterResultObject, RowMoveManagerOption, UsabilityOverrideFn } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

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

export class SlickRowMoveManager {
  // --
  // public API
  pluginName = 'RowMoveManager' as const;
  onBeforeMoveRows = new SlickEvent<{ grid: SlickGrid; rows: number[]; insertBefore: number; }>();
  onMoveRows = new SlickEvent<{ grid: SlickGrid; rows: number[]; insertBefore: number; }>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _canvas!: HTMLElement;
  protected _dragging = false;
  protected _eventHandler: SlickEventHandler_;
  protected _usabilityOverride?: UsabilityOverrideFn;
  protected _options: RowMoveManagerOption;
  protected _defaults: RowMoveManagerOption = {
    columnId: '_move',
    cssClass: undefined,
    cancelEditOnDrag: false,
    disableRowSelection: false,
    hideRowMoveShadow: true,
    rowMoveShadowMarginTop: 0,
    rowMoveShadowMarginLeft: 0,
    rowMoveShadowOpacity: 0.95,
    rowMoveShadowScale: 0.75,
    singleRowMove: false,
    width: 40,
  };

  constructor(options: Partial<RowMoveManagerOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
    this._eventHandler = new SlickEventHandler();
  }


  init(grid: SlickGrid) {
    this._grid = grid;
    this._canvas = this._grid.getCanvasNode();

    // user could override the expandable icon logic from within the options or after instantiating the plugin
    if (typeof this._options?.usabilityOverride === 'function') {
      this.usabilityOverride(this._options.usabilityOverride);
    }

    this._eventHandler
      .subscribe(this._grid.onDragInit, this.handleDragInit.bind(this))
      .subscribe(this._grid.onDragStart, this.handleDragStart.bind(this))
      .subscribe(this._grid.onDrag, this.handleDrag.bind(this))
      .subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
  }

  destroy() {
    this._eventHandler.unsubscribeAll();
  }

  setOptions(newOptions: Partial<RowMoveManagerOption>) {
    this._options = Utils.extend({}, this._options, newOptions);
  }

  protected handleDragInit(e: SlickEventData_) {
    // prevent the grid from cancelling drag'n'drop by default
    e.stopImmediatePropagation();
  }

  protected handleDragStart(e: DOMEvent<HTMLDivElement>, dd: DragRowMove): boolean | void {
    const cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 };
    const currentRow = cell?.row;
    const dataContext = this._grid.getDataItem(currentRow);

    if (!this.checkUsabilityOverride(currentRow, dataContext, this._grid)) {
      return;
    }

    if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive()) {
      this._grid.getEditorLock().cancelCurrentEdit();
    }

    if (this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell)) {
      return false;
    }

    this._dragging = true;
    e.stopImmediatePropagation();

    // optionally create a shadow element of the row so that we can see all the time which row exactly we're dragging
    if (!this._options.hideRowMoveShadow) {
      const slickRowElm = this._grid.getCellNode(cell.row, cell.cell)?.closest<HTMLDivElement>('.slick-row');
      if (slickRowElm) {
        dd.clonedSlickRow = slickRowElm.cloneNode(true) as HTMLDivElement;
        dd.clonedSlickRow.classList.add('slick-reorder-shadow-row');
        dd.clonedSlickRow.style.display = 'none';
        dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + 'px';
        dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + 'px';
        dd.clonedSlickRow.style.opacity = `${this._options.rowMoveShadowOpacity || 0.95}`;
        dd.clonedSlickRow.style.transform = `scale(${this._options.rowMoveShadowScale || 0.75})`;
        this._canvas.appendChild(dd.clonedSlickRow);
      }
    }

    let selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
    if (selectedRows.length === 0 || !selectedRows.some(selectedRow => selectedRow === cell.row)) {
      selectedRows = [cell.row];
      if (!this._options.disableRowSelection) {
        this._grid.setSelectedRows(selectedRows);
      }
    }

    const rowHeight = this._grid.getOptions().rowHeight;

    dd.selectedRows = selectedRows;

    dd.selectionProxy = document.createElement('div');
    dd.selectionProxy.className = 'slick-reorder-proxy';
    dd.selectionProxy.style.display = 'none';
    dd.selectionProxy.style.position = 'absolute';
    dd.selectionProxy.style.zIndex = '99999';
    dd.selectionProxy.style.width = `${this._canvas.clientWidth}px`;
    dd.selectionProxy.style.height = `${rowHeight! * selectedRows.length}px`;
    this._canvas.appendChild(dd.selectionProxy);

    dd.guide = document.createElement('div');
    dd.guide.className = 'slick-reorder-guide';
    dd.guide.style.position = 'absolute';
    dd.guide.style.zIndex = '99999';
    dd.guide.style.width = `${this._canvas.clientWidth}px`;
    dd.guide.style.top = `-1000px`;
    this._canvas.appendChild(dd.guide);

    dd.insertBefore = -1;
  }

  protected handleDrag(evt: SlickEventData_, dd: DragRowMove): boolean | void {
    if (!this._dragging) {
      return;
    }

    evt.stopImmediatePropagation();
    const e = evt.getNativeEvent<MouseEvent | TouchEvent>();

    const targetEvent = (e as TouchEvent)?.touches?.[0] ?? e;
    const top = targetEvent.pageY - (Utils.offset(this._canvas)?.top ?? 0);
    dd.selectionProxy.style.top = `${top - 5}px`;
    dd.selectionProxy.style.display = 'block';

    // if the row move shadow is enabled, we'll also make it follow the mouse cursor
    if (dd.clonedSlickRow) {
      dd.clonedSlickRow.style.top = `${top - 6}px`;
      dd.clonedSlickRow.style.display = 'block';
    }

    const insertBefore = Math.max(0, Math.min(Math.round(top / this._grid.getOptions().rowHeight!), this._grid.getDataLength()));
    if (insertBefore !== dd.insertBefore) {
      const eventData = {
        grid: this._grid,
        rows: dd.selectedRows,
        insertBefore
      };

      if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === false) {
        dd.canMove = false;
      } else {
        dd.canMove = true;
      }

      // if there's a UsabilityOverride defined, we also need to verify that the condition is valid
      if (this._usabilityOverride && dd.canMove) {
        const insertBeforeDataContext = this._grid.getDataItem(insertBefore);
        dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._grid);
      }

      // if the new target is possible we'll display the dark blue bar (representin the acceptability) at the target position
      // else it won't show up (it will be off the screen)
      if (!dd.canMove) {
        dd.guide.style.top = '-1000px';
      } else {
        dd.guide.style.top = `${insertBefore * (this._grid.getOptions().rowHeight || 0)}px`;
      }

      dd.insertBefore = insertBefore;
    }
  }

  protected handleDragEnd(e: SlickEventData_, dd: DragRowMove) {
    if (!this._dragging) {
      return;
    }
    this._dragging = false;
    e.stopImmediatePropagation();

    dd.guide?.remove();
    dd.selectionProxy?.remove();
    dd.clonedSlickRow?.remove();

    if (dd.canMove) {
      const eventData = {
        grid: this._grid,
        rows: dd.selectedRows,
        insertBefore: dd.insertBefore
      };
      // TODO:  this._grid.remapCellCssClasses ?
      this.onMoveRows.notify(eventData);
    }
  }

  getColumnDefinition(): Column {
    const columnId = String(this._options?.columnId ?? this._defaults.columnId);

    return {
      id: columnId,
      name: '',
      field: 'move',
      behavior: 'selectAndMove',
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      resizable: false,
      selectable: false,
      width: this._options.width || 40,
      formatter: this.moveIconFormatter.bind(this)
    };
  }

  protected moveIconFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultObject | string {
    if (!this.checkUsabilityOverride(row, dataContext, grid)) {
      return '';
    } else {
      return { addClasses: `cell-reorder dnd ${this._options.cssClass || ''}`, text: '' };
    }
  }

  protected checkUsabilityOverride(row: number, dataContext: any, grid: SlickGrid) {
    if (typeof this._usabilityOverride === 'function') {
      return this._usabilityOverride(row, dataContext, grid);
    }
    return true;
  }

  /**
   * Method that user can pass to override the default behavior or making every row moveable.
   * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
   * @param overrideFn: override function callback
   */
  usabilityOverride(overrideFn: UsabilityOverrideFn) {
    this._usabilityOverride = overrideFn;
  }

  isHandlerColumn(columnIndex: number | string) {
    return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || '');
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      RowMoveManager: SlickRowMoveManager
    }
  });
}

