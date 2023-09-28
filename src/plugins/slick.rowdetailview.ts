import { SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core';
import type { Column, DOMEvent, FormatterResultObject, GridOption, OnAfterRowDetailToggleArgs, OnBeforeRowDetailToggleArgs, OnRowBackToViewportRangeArgs, OnRowDetailAsyncEndUpdateArgs, OnRowDetailAsyncResponseArgs, OnRowOutOfViewportRangeArgs, RowDetailViewOption, UsabilityOverrideFn } from '../models/index';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * A plugin to add row detail panel
 * Original StackOverflow question & article making this possible (thanks to violet313)
 * https://stackoverflow.com/questions/10535164/can-slickgrids-row-height-be-dynamically-altered#29399927
 * http://violet313.org/slickgrids/#intro
 *
 * USAGE:
 * Add the slick.rowDetailView.(js|css) files and register the plugin with the grid.
 *
 * AVAILABLE ROW DETAIL OPTIONS:
 *    cssClass:               A CSS class to be added to the row detail
 *    expandedClass:          Extra classes to be added to the expanded Toggle
 *    expandableOverride:     callback method that user can override the default behavior of making every row an expandable row (the logic to show or not the expandable icon).
 *    collapsedClass:         Extra classes to be added to the collapse Toggle
 *    loadOnce:               Defaults to false, when set to True it will load the data once and then reuse it.
 *    preTemplate:            Template that will be used before the async process (typically used to show a spinner/loading)
 *    postTemplate:           Template that will be loaded once the async function finishes
 *    process:                Async server function call
 *    panelRows:              Row count to use for the template panel
 *    singleRowExpand:        Defaults to false, limit expanded row to 1 at a time.
 *    useRowClick:            Boolean flag, when True will open the row detail on a row click (from any column), default to False
 *    keyPrefix:              Defaults to '_', prefix used for all the plugin metadata added to the item object (meta e.g.: padding, collapsed, parent)
 *    collapseAllOnSort:      Defaults to true, which will collapse all row detail views when user calls a sort. Unless user implements a sort to deal with padding
 *    saveDetailViewOnScroll: Defaults to true, which will save the row detail view in a cache when it detects that it will become out of the viewport buffer
 *    useSimpleViewportCalc:  Defaults to false, which will use simplified calculation of out or back of viewport visibility
 *
 * AVAILABLE PUBLIC METHODS:
 *    init:                 initiliaze the plugin
 *    expandableOverride:   callback method that user can override the default behavior of making every row an expandable row (the logic to show or not the expandable icon).
 *    destroy:              destroy the plugin and it's events
 *    collapseAll:          collapse all opened row detail panel
 *    collapseDetailView:   collapse a row by passing the item object (row detail)
 *    expandDetailView:     expand a row by passing the item object (row detail)
 *    getColumnDefinition:  get the column definitions
 *    getExpandedRows:      get all the expanded rows
 *    getFilterItem:        takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on
 *    getOptions:           get current plugin options
 *    resizeDetailView:     resize a row detail view, it will auto-calculate the number of rows it needs
 *    saveDetailView:       save a row detail view content by passing the row object
 *    setOptions:           set or change some of the plugin options
 *
 * THE PLUGIN EXPOSES THE FOLLOWING SLICK EVENTS:
 *    onAsyncResponse:  This event must be used with the "notify" by the end user once the Asynchronous Server call returns the item detail
 *      Event args:
 *        item:         Item detail returned from the async server call
 *        detailView:   An explicit view to use instead of template (Optional)
 *
 *    onAsyncEndUpdate: Fired when the async response finished
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onBeforeRowDetailToggle: Fired before the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *
 *    onAfterRowDetailToggle: Fired after the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        expandedRows: Array of the Expanded Rows
 *
 *    onRowOutOfViewportRange: Fired after a row becomes out of viewport range (user can't see the row anymore)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowId:        Id of the Row object (datacontext) in the Grid
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        rowIdsOutOfViewport: Array of the Out of viewport Range Rows
 *
 *    onRowBackToViewportRange: Fired after a row is back to viewport range (user can visually see the row detail)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowId:        Id of the Row object (datacontext) in the Grid
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        rowIdsOutOfViewport: Array of the Out of viewport Range Rows
 */
export class SlickRowDetailView {
  // --
  // public API
  pluginName = 'RowDetailView' as const;
  onAsyncResponse = new SlickEvent<OnRowDetailAsyncResponseArgs>();
  onAsyncEndUpdate = new SlickEvent<OnRowDetailAsyncEndUpdateArgs>();
  onAfterRowDetailToggle = new SlickEvent<OnAfterRowDetailToggleArgs>();
  onBeforeRowDetailToggle = new SlickEvent<OnBeforeRowDetailToggleArgs>();
  onRowBackToViewportRange = new SlickEvent<OnRowBackToViewportRangeArgs>();
  onRowOutOfViewportRange = new SlickEvent<OnRowOutOfViewportRangeArgs>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _gridOptions!: GridOption;
  protected _gridUid = '';
  protected _dataView!: SlickDataView;
  protected _dataViewIdProperty = 'id';
  protected _expandableOverride: UsabilityOverrideFn | null = null;
  protected _lastRange: { bottom: number; top: number; } | null = null;
  protected _expandedRows: any[] = [];
  protected _eventHandler: SlickEventHandler_;
  protected _outsideRange = 5;
  protected _visibleRenderedCellCount = 0;
  protected _options: RowDetailViewOption;
  protected _defaults = {
    columnId: '_detail_selector',
    cssClass: 'detailView-toggle',
    expandedClass: undefined,
    collapsedClass: undefined,
    keyPrefix: '_',
    loadOnce: false,
    collapseAllOnSort: true,
    saveDetailViewOnScroll: true,
    singleRowExpand: false,
    useSimpleViewportCalc: false,
    alwaysRenderColumn: true,
    toolTip: '',
    width: 30,
    maxRows: undefined
  } as RowDetailViewOption;
  protected _keyPrefix = this._defaults.keyPrefix;
  protected _gridRowBuffer = 0;
  protected _rowIdsOutOfViewport: Array<number | string> = [];

  /** Constructor of the Row Detail View Plugin which accepts optional options */
  constructor(options: RowDetailViewOption) {
    this._options = Utils.extend(true, {}, this._defaults, options);
    this._eventHandler = new SlickEventHandler();

    // user could override the expandable icon logic from within the options or after instantiating the plugin
    if (typeof this._options.expandableOverride === 'function') {
      this.expandableOverride(this._options.expandableOverride);
    }
  }

  /**
   * Initialize the plugin, which requires user to pass the SlickGrid Grid object
   * @param grid: SlickGrid Grid object
   */
  init(grid: SlickGrid) {
    if (!grid) {
      throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
    }
    this._grid = grid;
    this._gridUid = grid.getUID();
    this._gridOptions = grid.getOptions() || {};
    this._dataView = this._grid.getData<SlickDataView>();
    this._keyPrefix = this._options?.keyPrefix ?? '_';

    // Update the minRowBuffer so that the view doesn't disappear when it's at top of screen + the original default 3
    this._gridRowBuffer = this._gridOptions.minRowBuffer || 0;
    this._gridOptions.minRowBuffer = this._options.panelRows + 3;

    this._eventHandler
      .subscribe(this._grid.onClick, this.handleClick.bind(this))
      .subscribe(this._grid.onScroll, this.handleScroll.bind(this));

    // Sort will, by default, Collapse all of the open items (unless user implements his own onSort which deals with open row and padding)
    if (this._options.collapseAllOnSort) {
      this._eventHandler.subscribe(this._grid.onSort, this.collapseAll.bind(this));
      this._expandedRows = [];
      this._rowIdsOutOfViewport = [];
    }

    this._eventHandler.subscribe(this._dataView.onRowCountChanged, () => {
      this._grid.updateRowCount();
      this._grid.render();
    });

    this._eventHandler.subscribe(this._dataView.onRowsChanged, (_e, a) => {
      this._grid.invalidateRows(a.rows);
      this._grid.render();
    });

    // subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
    this.subscribeToOnAsyncResponse();

    // after data is set, let's get the DataView Id Property name used (defaults to "id")
    this._eventHandler.subscribe(this._dataView.onSetItemsCalled, () => {
      this._dataViewIdProperty = this._dataView?.getIdPropertyName() ?? 'id';
    });

    // if we use the alternative & simpler calculation of the out of viewport range
    // we will need to know how many rows are rendered on the screen and we need to wait for grid to be rendered
    // unfortunately there is no triggered event for knowing when grid is finished, so we use 250ms delay and it's typically more than enough
    if (this._options.useSimpleViewportCalc) {
      this._eventHandler.subscribe(this._grid.onRendered, (_e, args) => {
        if (args?.endRow) {
          this._visibleRenderedCellCount = args.endRow - args.startRow;
        }
      });
    }
  }

  /** destroy the plugin and it's events */
  destroy() {
    this._eventHandler.unsubscribeAll();
    this.onAsyncResponse.unsubscribe();
    this.onAsyncEndUpdate.unsubscribe();
    this.onAfterRowDetailToggle.unsubscribe();
    this.onBeforeRowDetailToggle.unsubscribe();
    this.onRowOutOfViewportRange.unsubscribe();
    this.onRowBackToViewportRange.unsubscribe();
  }

  /** Get current plugin options */
  getOptions() {
    return this._options;
  }

  /** set or change some of the plugin options */
  setOptions(options: Partial<RowDetailViewOption>) {
    this._options = Utils.extend(true, {}, this._options, options);
    if (this._options?.singleRowExpand) {
      this.collapseAll();
    }
  }

  /** Find a value in an array and return the index when (or -1 when not found) */
  protected arrayFindIndex(sourceArray: any[], value: any) {
    if (Array.isArray(sourceArray)) {
      for (let i = 0; i < sourceArray.length; i++) {
        if (sourceArray[i] === value) {
          return i;
        }
      }
    }
    return -1;
  }

  /** Handle mouse click event */
  protected handleClick(e: DOMEvent<HTMLDivElement>, args: { row: number; cell: number; }) {
    const dataContext = this._grid.getDataItem(args.row);
    if (!this.checkExpandableOverride(args.row, dataContext, this._grid)) {
      return;
    }

    // clicking on a row select checkbox
    if (this._options.useRowClick || this._grid.getColumns()[args.cell]['id'] === this._options.columnId && e.target.classList.contains(this._options.cssClass || '')) {
      // if editing, try to commit
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // trigger an event before toggling
      // user could cancel the Row Detail opening when event is returning false
      if (this.onBeforeRowDetailToggle.notify({ grid: this._grid, item: dataContext }, e, this).getReturnValue() === false) {
        return;
      }

      this.toggleRowSelection(args.row, dataContext);

      // trigger an event after toggling
      this.onAfterRowDetailToggle.notify({
        grid: this._grid,
        item: dataContext,
        expandedRows: this._expandedRows,
      }, e, this);

      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  /** If we scroll save detail views that go out of cache range */
  protected handleScroll() {
    if (this._options.useSimpleViewportCalc) {
      this.calculateOutOfRangeViewsSimplerVersion();
    } else {
      this.calculateOutOfRangeViews();
    }
  }

  /** Calculate when expanded rows become out of view range */
  protected calculateOutOfRangeViews() {
    let scrollDir = ''
    if (this._grid) {
      const renderedRange = this._grid.getRenderedRange();
      // Only check if we have expanded rows
      if (this._expandedRows.length > 0) {
        // Assume scroll direction is down by default.
        scrollDir = 'DOWN';
        if (this._lastRange) {
          // Some scrolling isn't anything as the range is the same
          if (this._lastRange.top === renderedRange.top && this._lastRange.bottom === renderedRange.bottom) {
            return;
          }

          // If our new top is smaller we are scrolling up
          if (this._lastRange.top > renderedRange.top ||
            // Or we are at very top but our bottom is increasing
            (this._lastRange.top === 0 && renderedRange.top === 0) && this._lastRange.bottom > renderedRange.bottom) {
            scrollDir = 'UP';
          }
        }
      }

      this._expandedRows.forEach((row) => {
        const rowIndex = this._dataView?.getRowById(row[this._dataViewIdProperty]) ?? 0;
        const rowPadding = row[`${this._keyPrefix}sizePadding`];
        const rowOutOfRange = this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0;

        if (scrollDir === 'UP') {
          // save the view when asked
          if (this._options.saveDetailViewOnScroll) {
            // If the bottom item within buffer range is an expanded row save it.
            if (rowIndex >= renderedRange.bottom - this._gridRowBuffer) {
              this.saveDetailView(row);
            }
          }

          // If the row expanded area is within the buffer notify that it is back in range
          if (rowOutOfRange && rowIndex - this._outsideRange < renderedRange.top && rowIndex >= renderedRange.top) {
            this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]);
          }

          // if our first expanded row is about to go off the bottom
          else if (!rowOutOfRange && (rowIndex + rowPadding) > renderedRange.bottom) {
            this.notifyOutOfViewport(row, row[this._dataViewIdProperty]);
          }
        }
        else if (scrollDir === 'DOWN') {
          // save the view when asked
          if (this._options.saveDetailViewOnScroll) {
            // If the top item within buffer range is an expanded row save it.
            if (rowIndex <= renderedRange.top + this._gridRowBuffer) {
              this.saveDetailView(row);
            }
          }

          // If row index is i higher than bottom with some added value (To ignore top rows off view) and is with view and was our of range
          if (rowOutOfRange && (rowIndex + rowPadding + this._outsideRange) > renderedRange.bottom && rowIndex < rowIndex + rowPadding) {
            this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]);
          }
          // if our row is outside top of and the buffering zone but not in the array of outOfVisable range notify it
          else if (!rowOutOfRange && rowIndex < renderedRange.top) {
            this.notifyOutOfViewport(row, row[this._dataViewIdProperty]);
          }
        }
      });
      this._lastRange = renderedRange;
    }
  }

  /** This is an alternative & more simpler version of the Calculate when expanded rows become out of view range */
  protected calculateOutOfRangeViewsSimplerVersion() {
    if (this._grid) {
      const renderedRange = this._grid.getRenderedRange();

      this._expandedRows.forEach((row) => {
        const rowIndex = this._dataView.getRowById(row[this._dataViewIdProperty]) ?? -1;
        const isOutOfVisibility = this.checkIsRowOutOfViewportRange(rowIndex, renderedRange);
        if (!isOutOfVisibility && this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0) {
          this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]);
        } else if (isOutOfVisibility) {
          this.notifyOutOfViewport(row, row[this._dataViewIdProperty]);
        }
      });
    }
  }

  /**
   * Check if the row became out of visible range (when user can't see it anymore)
   * @param rowIndex
   * @param renderedRange from SlickGrid
   */
  protected checkIsRowOutOfViewportRange(rowIndex: number, renderedRange: any) {
    if (Math.abs(renderedRange.bottom - this._gridRowBuffer - rowIndex) > this._visibleRenderedCellCount * 2) {
      return true;
    }
    return false;
  }

  /** Send a notification, through "onRowOutOfViewportRange", that is out of the viewport range */
  protected notifyOutOfViewport(item: any, rowId: number | string) {
    const rowIndex = (item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty])) as number;

    this.onRowOutOfViewportRange.notify({
      grid: this._grid,
      item,
      rowId,
      rowIndex,
      expandedRows: this._expandedRows,
      rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, true)
    }, null, this);
  }

  /** Send a notification, through "onRowBackToViewportRange", that a row came back into the viewport visible range */
  protected notifyBackToViewportWhenDomExist(item: any, rowId: number | string) {
    const rowIndex = (item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty])) as number;

    setTimeout(() => {
      // make sure View Row DOM Element really exist before notifying that it's a row that is visible again
      if (document.querySelector(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`)) {
        this.onRowBackToViewportRange.notify({
          grid: this._grid,
          item,
          rowId,
          rowIndex,
          expandedRows: this._expandedRows,
          rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, false)
        }, null, this);
      }
    }, 100);
  }

  /**
   * This function will sync the "out of viewport" array whenever necessary.
   * The sync can add a detail row (when necessary, no need to add again if it already exist) or delete a row from the array.
   * @param rowId: number
   * @param isAdding: are we adding or removing a row?
   */
  protected syncOutOfViewportArray(rowId: number | string, isAdding: boolean) {
    const arrayRowIndex = this.arrayFindIndex(this._rowIdsOutOfViewport, rowId);

    if (isAdding && arrayRowIndex < 0) {
      this._rowIdsOutOfViewport.push(rowId);
    } else if (!isAdding && arrayRowIndex >= 0) {
      this._rowIdsOutOfViewport.splice(arrayRowIndex, 1);
    }
    return this._rowIdsOutOfViewport;
  }

  // Toggle between showing or hiding a row
  protected toggleRowSelection(rowNumber: number, dataContext: any) {
    if (!this.checkExpandableOverride(rowNumber, dataContext, this._grid)) {
      return;
    }

    this._dataView.beginUpdate();
    this.handleAccordionShowHide(dataContext);
    this._dataView.endUpdate();
  }

  /** Collapse all of the open detail rows */
  collapseAll() {
    this._dataView.beginUpdate();
    for (let i = this._expandedRows.length - 1; i >= 0; i--) {
      this.collapseDetailView(this._expandedRows[i], true);
    }
    this._dataView.endUpdate();
  }

  /** Collapse a detail row so that it is not longer open */
  collapseDetailView(item: any, isMultipleCollapsing = false) {
    if (!isMultipleCollapsing) {
      this._dataView.beginUpdate();
    }
    // Save the details on the collapse assuming onetime loading
    if (this._options.loadOnce) {
      this.saveDetailView(item);
    }

    item[`${this._keyPrefix}collapsed`] = true;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++) {
      this._dataView.deleteItem(item[this._dataViewIdProperty] + '.' + idx);
    }
    item[`${this._keyPrefix}sizePadding`] = 0;
    this._dataView.updateItem(item[this._dataViewIdProperty], item);

    // Remove the item from the expandedRows
    this._expandedRows = this._expandedRows.filter((r) => {
      return r[this._dataViewIdProperty] !== item[this._dataViewIdProperty];
    });

    if (!isMultipleCollapsing) {
      this._dataView.endUpdate();
    }
  }

  /** Expand a detail row by providing the dataview item that is to be expanded */
  expandDetailView(item: any) {
    if (this._options?.singleRowExpand) {
      this.collapseAll();
    }

    item[`${this._keyPrefix}collapsed`] = false;
    this._expandedRows.push(item);

    // In the case something went wrong loading it the first time such a scroll of screen before loaded
    if (!item[`${this._keyPrefix}detailContent`]) item[`${this._keyPrefix}detailViewLoaded`] = false;

    // display pre-loading template
    if (!item[`${this._keyPrefix}detailViewLoaded`] || this._options.loadOnce !== true) {
      item[`${this._keyPrefix}detailContent`] = this._options?.preTemplate?.(item);
    } else {
      this.onAsyncResponse.notify({
        item,
        itemDetail: item,
        detailView: item[`${this._keyPrefix}detailContent`]
      }, undefined, this);
      this.applyTemplateNewLineHeight(item);
      this._dataView.updateItem(item[this._dataViewIdProperty], item);

      return;
    }

    this.applyTemplateNewLineHeight(item);
    this._dataView.updateItem(item[this._dataViewIdProperty], item);

    // async server call
    this._options.process(item);
  }

  /** Saves the current state of the detail view */
  saveDetailView(item: any) {
    const view = document.querySelector(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);
    if (view) {
      const html = view.innerHTML;
      if (html !== undefined) {
        item[`${this._keyPrefix}detailContent`] = html;
      }
    }
  }

  /**
   * subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
   * the response has to be as "args.item" (or "args.itemDetail") with it's data back
   */
  protected subscribeToOnAsyncResponse() {
    this.onAsyncResponse.subscribe((e, args) => {
      if (!args || (!args.item && !args.itemDetail)) {
        throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
      }

      // we accept item/itemDetail, just get the one which has data
      const itemDetail = args.item || args.itemDetail;

      // If we just want to load in a view directly we can use detailView property to do so
      if (args.detailView) {
        itemDetail[`${this._keyPrefix}detailContent`] = args.detailView;
      } else {
        itemDetail[`${this._keyPrefix}detailContent`] = this._options?.postTemplate?.(itemDetail);
      }

      itemDetail[`${this._keyPrefix}detailViewLoaded`] = true;
      this._dataView.updateItem(itemDetail[this._dataViewIdProperty], itemDetail);

      // trigger an event once the post template is finished loading
      this.onAsyncEndUpdate.notify({
        'grid': this._grid,
        'item': itemDetail,
        'itemDetail': itemDetail
      }, e, this);
    });
  }

  /** When row is getting toggled, we will handle the action of collapsing/expanding */
  protected handleAccordionShowHide(item: any) {
    if (item) {
      if (!item[`${this._keyPrefix}collapsed`]) {
        this.collapseDetailView(item);
      } else {
        this.expandDetailView(item);
      }
    }
  }

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  /** Get the Row Detail padding (which are the rows dedicated to the detail panel) */
  protected getPaddingItem(parent: any, offset: any) {
    const item: any = {};

    for (const prop in this._dataView) {
      item[prop] = null;
    }
    item[this._dataViewIdProperty] = parent[this._dataViewIdProperty] + '.' + offset;

    // additional hidden padding metadata fields
    item[`${this._keyPrefix}collapsed`] = true;
    item[`${this._keyPrefix}isPadding`] = true;
    item[`${this._keyPrefix}parent`] = parent;
    item[`${this._keyPrefix}offset`] = offset;

    return item;
  };

  /** Create the detail ctr node. this belongs to the dev & can be custom-styled as per */
  protected applyTemplateNewLineHeight(item: any) {
    // the height is calculated by the template row count (how many line of items does the template view have)
    const rowCount = this._options.panelRows;

    // calculate padding requirements based on detail-content..
    // ie. worst-case: create an invisible dom node now & find it's height.
    const lineHeight = 13; // we know cuz we wrote the custom css init ;)
    item[`${this._keyPrefix}sizePadding`] = Math.ceil(((rowCount * 2) * lineHeight) / this._gridOptions.rowHeight!);
    item[`${this._keyPrefix}height`] = (item[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight!);
    const idxParent = this._dataView.getIdxById(item[this._dataViewIdProperty]) ?? 0;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++) {
      this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
    }
  }

  /** Get the Column Definition of the first column dedicated to toggling the Row Detail View */
  getColumnDefinition() {
    return {
      id: this._options.columnId,
      name: '',
      toolTip: this._options.toolTip,
      field: 'sel',
      width: this._options.width,
      resizable: false,
      sortable: false,
      alwaysRenderColumn: this._options.alwaysRenderColumn,
      cssClass: this._options.cssClass,
      formatter: this.detailSelectionFormatter.bind(this)
    };
  }

  /** Return the currently expanded rows */
  getExpandedRows() {
    return this._expandedRows;
  }

  /** The cell Formatter that shows the icon that will be used to toggle the Row Detail */
  protected detailSelectionFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultObject | string {
    if (!this.checkExpandableOverride(row, dataContext, grid)) {
      return '';
    } else {
      if (dataContext[`${this._keyPrefix}collapsed`] == undefined) {
        dataContext[`${this._keyPrefix}collapsed`] = true;
        dataContext[`${this._keyPrefix}sizePadding`] = 0;     //the required number of pading rows
        dataContext[`${this._keyPrefix}height`] = 0;     //the actual height in pixels of the detail field
        dataContext[`${this._keyPrefix}isPadding`] = false;
        dataContext[`${this._keyPrefix}parent`] = undefined;
        dataContext[`${this._keyPrefix}offset`] = 0;
      }

      if (dataContext[`${this._keyPrefix}isPadding`]) {
        // render nothing
      }
      else if (dataContext[`${this._keyPrefix}collapsed`]) {
        let collapsedClasses = this._options.cssClass + ' expand ';
        if (this._options.collapsedClass) {
          collapsedClasses += this._options.collapsedClass;
        }
        return '<div class="' + collapsedClasses + '"></div>';
      }
      else {
        const html: string[] = [];
        const rowHeight = this._gridOptions.rowHeight;
        let outterHeight = dataContext[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight!;

        if (this._options.maxRows !== undefined && dataContext[`${this._keyPrefix}sizePadding`] > this._options.maxRows) {
          outterHeight = this._options.maxRows * rowHeight!;
          dataContext[`${this._keyPrefix}sizePadding`] = this._options.maxRows;
        }

        // V313HAX:
        // putting in an extra closing div after the closing toggle div and ommiting a
        // final closing div for the detail ctr div causes the slickgrid renderer to
        // insert our detail div as a new column ;) ~since it wraps whatever we provide
        // in a generic div column container. so our detail becomes a child directly of
        // the row not the cell. nice =)  ~no need to apply a css change to the parent
        // slick-cell to escape the cell overflow clipping.

        // sneaky extra </div> inserted here-----------------v
        let expandedClasses = this._options.cssClass + ' collapse ';
        if (this._options.expandedClass) {
          expandedClasses += this._options.expandedClass;
        }
        html.push('<div class="' + expandedClasses + '"></div></div>');

        html.push(`<div class="dynamic-cell-detail cellDetailView_${dataContext[this._dataViewIdProperty]}" `);   //apply custom css to detail
        html.push(`style="height: ${outterHeight}px;`); //set total height of padding
        html.push(`top: ${rowHeight}px">`);             //shift detail below 1st row
        html.push(`<div class="detail-container detailViewContainer_${dataContext[this._dataViewIdProperty]}">`); //sub ctr for custom styling
        html.push(`<div class="innerDetailView_${dataContext[this._dataViewIdProperty]}">${dataContext[`${this._keyPrefix}detailContent`]}</div></div>`);
        // omit a final closing detail container </div> that would come next

        return html.join('');
      }
    }
    return '';
  }

  /** Resize the Row Detail View */
  resizeDetailView(item: any) {
    if (!item) {
      return;
    }

    // Grad each of the DOM elements
    const mainContainer = document.querySelector<HTMLDivElement>(`.${this._gridUid} .detailViewContainer_${item[this._dataViewIdProperty]}`);
    const cellItem = document.querySelector<HTMLDivElement>(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`);
    const inner = document.querySelector<HTMLDivElement>(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);

    if (!mainContainer || !cellItem || !inner) {
      return;
    }

    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++) {
      this._dataView.deleteItem(`${item[this._dataViewIdProperty]}.${idx}`);
    }

    const rowHeight = this._gridOptions.rowHeight; // height of a row
    const lineHeight = 13; // we know cuz we wrote the custom css innit ;)

    // remove the height so we can calculate the height
    mainContainer.style.minHeight = '';

    // Get the scroll height for the main container so we know the actual size of the view
    const itemHeight = mainContainer.scrollHeight;

    // Now work out how many rows
    const rowCount = Math.ceil(itemHeight / rowHeight!);

    item[`${this._keyPrefix}sizePadding`] = Math.ceil(((rowCount * 2) * lineHeight) / rowHeight!);
    item[`${this._keyPrefix}height`] = itemHeight;

    let outterHeight = (item[`${this._keyPrefix}sizePadding`] * rowHeight!);
    if (this._options.maxRows !== undefined && item[`${this._keyPrefix}sizePadding`] > this._options.maxRows) {
      outterHeight = this._options.maxRows * rowHeight!;
      item[`${this._keyPrefix}sizePadding`] = this._options.maxRows;
    }

    // If the padding is now more than the original minRowBuff we need to increase it
    if (this._grid.getOptions().minRowBuffer! < item[`${this._keyPrefix}sizePadding`]) {
      // Update the minRowBuffer so that the view doesn't disappear when it's at top of screen + the original default 3
      this._grid.getOptions().minRowBuffer = item[`${this._keyPrefix}sizePadding`] + 3;
    }

    mainContainer.setAttribute('style', 'min-height: ' + item[`${this._keyPrefix}height`] + 'px');
    if (cellItem) cellItem.setAttribute('style', 'height: ' + outterHeight + 'px; top:' + rowHeight + 'px');

    const idxParent = this._dataView.getIdxById(item[this._dataViewIdProperty]) ?? 0;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++) {
      this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
    }

    // Lastly save the updated state
    this.saveDetailView(item);
  }

  /** Takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on */
  getFilterItem(item: any) {
    if (item[`${this._keyPrefix}isPadding`] && item[`${this._keyPrefix}parent`]) {
      item = item[`${this._keyPrefix}parent`];
    }
    return item;
  }

  protected checkExpandableOverride(row: number, dataContext: any, grid: SlickGrid) {
    if (typeof this._expandableOverride === 'function') {
      return this._expandableOverride(row, dataContext, grid);
    }
    return true;
  }

  /**
   * Method that user can pass to override the default behavior or making every row an expandable row.
   * In order word, user can choose which rows to be an available row detail (or not) by providing his own logic.
   * @param overrideFn: override function callback
   */
  expandableOverride(overrideFn: UsabilityOverrideFn) {
    this._expandableOverride = overrideFn;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        RowDetailView: SlickRowDetailView
      }
    }
  });
}

