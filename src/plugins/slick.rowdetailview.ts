import {
  SlickEvent as SlickEvent_,
  type SlickEventData,
  SlickEventHandler as SlickEventHandler_,
  Utils as Utils_
} from '../slick.core.js';
import type {
  Column,
  CustomDataView,
  FormatterResultWithHtml,
  GridOption,
  OnAfterRowDetailToggleArgs,
  OnBeforeRowDetailToggleArgs,
  OnRowBackToViewportRangeArgs,
  OnRowDetailAsyncEndUpdateArgs,
  OnRowDetailAsyncResponseArgs,
  OnRowOutOfViewportRangeArgs,
  OnScrollEventArgs,
  OnSetOptionsEventArgs,
  RowDetailViewOption,
  UsabilityOverrideFn
} from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

type RowId = number | string;
type RowHeightProvider = NonNullable<GridOption['rowHeightProvider']>;

/** The optional data provider methods the plugin uses when they exist (a SlickDataView has them all). */
type RowDetailDataProvider = CustomDataView & {
  getIdPropertyName?: () => string;
  getItemById?: (id: RowId) => any;
  getRowById?: (id: RowId) => number | undefined;
  updateItem?: (id: RowId, item: any) => void;
};

/** Height in pixels of one template line, as used by the `panelRows` sizing. */
const TEMPLATE_LINE_HEIGHT = 13;

/** State of one expanded row, kept by the plugin and keyed by the row id. */
interface ExpandedRowState {
  /** latest known data item of the row */
  item: any;
  /** extra height, in pixels, that the detail panel adds below the row cells */
  panelHeight: number;
  /** current detail content: an HTML string or an Element */
  content: unknown;
  /** content currently rendered in `panel` (used to re-render only on change) */
  renderedContent?: unknown;
  /** the detail panel element; it is kept while the row is expanded and moved into each new row node */
  panel?: HTMLDivElement;
}

/**
 * A plugin to add row detail panel
 * Original StackOverflow question & article making this possible (thanks to violet313)
 * https://stackoverflow.com/questions/10535164/can-slickgrids-row-height-be-dynamically-altered#29399927
 * http://violet313.org/slickgrids/#intro
 *
 * USAGE:
 * Add the slick.rowDetailView.(js|css) files and register the plugin with the grid.
 * An expanded row is a single grid row whose height grows by the detail panel height. The plugin turns on the grid's
 * `enableVariableRowHeight` and wraps its `rowHeightProvider`; the panel is rendered inside the row element, below the cells.
 * No item is inserted in, nor any property written to, the data: the plugin works with any data provider.
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
 *    panelRows:              Panel size in template lines (see `RowDetailViewOption.panelRows`)
 *    panelHeight:            Exact panel height in pixels (overrides panelRows)
 *    maxRows:                Caps the panel height at maxRows * rowHeight
 *    singleRowExpand:        Defaults to false, limit expanded row to 1 at a time.
 *    useRowClick:            Boolean flag, when True will open the row detail on a row click (from any column), default to False
 *    collapseAllOnSort:      (deprecated) Defaults to false, collapses all row detail views when the grid sorts
 *    saveDetailViewOnScroll: Defaults to true, which will save the row detail view in a cache when it leaves the rendered range
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
 *    isExpanded:           whether a row (item or id) is expanded
 *    getOptions:           get current plugin options
 *    resizeDetailView:     resize a row detail view to fit its content
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
 *        expanded:     Whether the row is about to be expanded
 *
 *    onAfterRowDetailToggle: Fired after the row detail gets toggled
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        expanded:     Whether the row is now expanded
 *        expandedRows: Array of the Expanded Rows
 *
 *    onRowOutOfViewportRange: Fired after an expanded row stops being rendered (user can't see the row anymore)
 *      Event args:
 *        grid:         Reference to the grid.
 *        item:         Item data context
 *        rowId:        Id of the Row object (datacontext) in the Grid
 *        rowIndex:     Index of the Row in the Grid
 *        expandedRows: Array of the Expanded Rows
 *        rowIdsOutOfViewport: Array of the Out of viewport Range Rows
 *
 *    onRowBackToViewportRange: Fired after an expanded row is rendered again, with its panel in the DOM
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
  onAsyncResponse = new SlickEvent<OnRowDetailAsyncResponseArgs>('onAsyncResponse');
  onAsyncEndUpdate = new SlickEvent<OnRowDetailAsyncEndUpdateArgs>('onAsyncEndUpdate');
  onAfterRowDetailToggle = new SlickEvent<OnAfterRowDetailToggleArgs>('onAfterRowDetailToggle');
  onBeforeRowDetailToggle = new SlickEvent<OnBeforeRowDetailToggleArgs>('onBeforeRowDetailToggle');
  onRowBackToViewportRange = new SlickEvent<OnRowBackToViewportRangeArgs>('onRowBackToViewportRange');
  onRowOutOfViewportRange = new SlickEvent<OnRowOutOfViewportRangeArgs>('onRowOutOfViewportRange');

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _gridOptions!: GridOption;
  protected _gridUid = '';
  protected _expandableOverride: UsabilityOverrideFn | null = null;
  protected _eventHandler: SlickEventHandler_;
  protected _options: RowDetailViewOption;
  protected _defaults = {
    columnId: '_detail_selector',
    cssClass: 'detailView-toggle',
    expandedClass: undefined,
    collapsedClass: undefined,
    loadOnce: false,
    collapseAllOnSort: false,
    reorderable: false,
    saveDetailViewOnScroll: true,
    singleRowExpand: false,
    alwaysRenderColumn: true,
    toolTip: '',
    width: 30,
    maxRows: undefined
  } as RowDetailViewOption;
  /** Expanded rows by id, in expansion order. */
  protected _expanded = new Map<RowId, ExpandedRowState>();
  /** Detail content saved by `saveDetailView` (and reused on re-expand with `loadOnce`); it outlives a collapse. */
  protected _savedContent = new Map<RowId, unknown>();
  protected _rowIdsOutOfViewport: RowId[] = [];
  protected _userRowHeightProvider?: GridOption['rowHeightProvider'];
  protected _gridIsDestroying = false;
  protected _lastScrollLeft?: number;
  protected _filterItemWarned = false;

  /** The `rowHeightProvider` given to the grid: the user's provider plus the panel height of the expanded rows. */
  protected _rowHeightProvider: RowHeightProvider = (grid, row, item) => {
    const baseHeight = this._userRowHeightProvider?.(grid, row, item);
    const state = this._expanded.size > 0 && item ? this._expanded.get(item[this.getIdPropertyName()]) : undefined;
    return state ? (baseHeight ?? this._gridOptions.rowHeight!) + state.panelHeight : baseHeight;
  };

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
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);

    // an expanded row is a single, taller row: the grid sizes it through our wrapped row height provider
    // (the options are set in place: with `explicitInitialization` the grid is usually not initialized yet)
    this._userRowHeightProvider = this._gridOptions.rowHeightProvider;
    this._gridOptions.rowHeightProvider = this._rowHeightProvider;
    if (this._gridOptions.enableVariableRowHeight) {
      this._grid.invalidateRowHeights();
    } else {
      this._gridOptions.enableVariableRowHeight = true;
      if (!this._gridOptions.explicitInitialization) {
        // an initialized grid must rebuild its cell CSS rule for the variable row height mode
        this._grid.setOptions({ enableVariableRowHeight: true });
      }
    }

    this._eventHandler
      .subscribe(this._grid.onClick, this.handleClick.bind(this))
      .subscribe(this._grid.onKeyDown, this.handleKeyDown.bind(this))
      .subscribe(this._grid.onScroll, this.handleScroll.bind(this))
      .subscribe(this._grid.onRendered, this.handleRendered.bind(this))
      .subscribe(this._grid.onSetOptions, this.handleSetOptions.bind(this))
      .subscribe(this._grid.onBeforeDestroy, () => { this._gridIsDestroying = true; });

    if (this._options.collapseAllOnSort) {
      this._eventHandler.subscribe(this._grid.onSort, this.collapseAll.bind(this));
    }

    // As before, a data provider exposing the DataView change events gets wired to the grid, since
    // existing apps rely on the plugin for it (any other provider is wired by the app, as with any grid).
    const data = this._grid.getData<RowDetailDataProvider & { onRowCountChanged?: SlickEvent_; onRowsChanged?: SlickEvent_<{ rows: number[]; }>; }>();
    if (typeof data?.onRowCountChanged?.subscribe === 'function' && typeof data?.onRowsChanged?.subscribe === 'function') {
      this._eventHandler.subscribe(data.onRowCountChanged!, () => {
        this._grid.updateRowCount();
        this._grid.render();
      });
      this._eventHandler.subscribe(data.onRowsChanged!, (_e, args) => {
        this._grid.invalidateRows(args.rows);
        this._grid.render();
      });
    }

    // subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
    this.subscribeToOnAsyncResponse();
  }

  /** destroy the plugin and it's events */
  destroy() {
    this._eventHandler.unsubscribeAll();
    const hadExpandedRows = this._expanded.size > 0;
    this._expanded.forEach((state) => state.panel?.remove());
    this._expanded.clear();
    this._savedContent.clear();
    this._rowIdsOutOfViewport = [];

    // hand the row heights back to the user's provider (variable row height stays enabled)
    if (this._gridOptions?.rowHeightProvider === this._rowHeightProvider) {
      this._gridOptions.rowHeightProvider = this._userRowHeightProvider;
      if (hadExpandedRows && !this._gridIsDestroying) {
        this._grid.invalidateRowHeights();
      }
    }

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

  /** A later `grid.setOptions({ rowHeightProvider })` replaces the provider we wrap, so wrap the new one. */
  protected handleSetOptions(_e: SlickEventData, args: OnSetOptionsEventArgs) {
    const provider = args?.optionsAfter?.rowHeightProvider;
    if (provider !== this._rowHeightProvider) {
      this._userRowHeightProvider = provider;
      this._gridOptions.rowHeightProvider = this._rowHeightProvider;
    }
  }

  /** Toggle the row detail with Enter or Space while the active cell is the row detail selector cell */
  protected handleKeyDown(e: SlickEventData, args: { row: number; cell: number; }) {
    if ((e.key !== 'Enter' && e.key !== ' ') || this._grid.getColumns()[args.cell]?.id !== this._options.columnId || this._grid.getEditorLock().isActive()) {
      return;
    }
    // the detail panels live in the grid rows, so the keys typed in their own inputs and buttons could reach this handler: leave those alone
    if (e.target?.closest?.('.slick-row-detail-container')) {
      return;
    }
    const toggle = this._grid.getCellNode(args.row, args.cell)?.querySelector<HTMLElement>('[data-row-detail-toggle]');
    if (toggle) {
      toggle.click();
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  /** Handle mouse click event */
  protected handleClick(e: SlickEventData, args: { row: number; cell: number; }) {
    const dataContext = this._grid.getDataItem(args.row);
    if (!this.checkExpandableOverride(args.row, dataContext, this._grid)) {
      return;
    }

    // clicking on a row select checkbox
    if (this._options.useRowClick || this._grid.getColumns()[args.cell]['id'] === this._options.columnId && (e.target as HTMLDivElement).classList.contains(this._options.cssClass || '')) {
      // if editing, try to commit
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      const expanding = !this.isExpanded(dataContext);

      // trigger an event before toggling
      // user could cancel the Row Detail opening when event is returning false
      if (this.onBeforeRowDetailToggle.notify({ grid: this._grid, item: dataContext, expanded: expanding }, e, this).getReturnValue() === false) {
        return;
      }

      this.toggleRowSelection(args.row, dataContext);

      // trigger an event after toggling
      this.onAfterRowDetailToggle.notify({
        grid: this._grid,
        item: dataContext,
        expanded: this.isExpanded(dataContext),
        expandedRows: this.getExpandedRows(),
      }, e, this);

      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  /** A horizontal scroll moves the viewport-anchored panels; a vertical scroll is handled by the render that follows it. */
  protected handleScroll(_e: SlickEventData, args: OnScrollEventArgs) {
    if (args?.scrollLeft !== this._lastScrollLeft) {
      this._lastScrollLeft = args?.scrollLeft;
      this._expanded.forEach((state) => {
        if (state.panel?.isConnected) {
          this.updatePanelPosition(state.panel);
        }
      });
    }
  }

  /** After each render, decorate the rendered expanded rows with their panel and report rows leaving or entering the rendered range. */
  protected handleRendered() {
    if (!this._grid || this._expanded.size === 0) {
      return;
    }
    // only the rendered rows can hold a panel: walk them rather than looking up every expanded id
    const idProperty = this.getIdPropertyName();
    const rowCache = this._grid.getRowCache?.() || {};
    const renderedIds = new Set<RowId>();
    for (const key of Object.keys(rowCache)) {
      const row = Number(key);
      const item = this._grid.getDataItem(row);
      const id = item?.[idProperty];
      const state = id !== undefined ? this._expanded.get(id) : undefined;
      const rowNode = rowCache[row]?.rowNode?.[0];
      if (!state || !rowNode) {
        continue;
      }
      renderedIds.add(id);
      state.item = item;
      this.mountPanel(state, id, rowNode, row);
      if (this._rowIdsOutOfViewport.includes(id)) {
        this.notifyViewportChange(this.onRowBackToViewportRange, item, id, row, false);
      }
    }

    this._expanded.forEach((state, id) => {
      if (!renderedIds.has(id) && !this._rowIdsOutOfViewport.includes(id)) {
        if (this._options.saveDetailViewOnScroll) {
          this.saveDetailView(state.item);
        }
        state.panel?.remove();
        this.notifyViewportChange(this.onRowOutOfViewportRange, state.item, id, this.getRowIndexById(id) ?? -1, true);
      }
    });
  }

  /** Notify a viewport range change, after syncing the "out of viewport" id list */
  protected notifyViewportChange(event: SlickEvent_<OnRowOutOfViewportRangeArgs | OnRowBackToViewportRangeArgs>, item: any, rowId: RowId, rowIndex: number, isOut: boolean) {
    const index = this._rowIdsOutOfViewport.indexOf(rowId);
    if (isOut && index < 0) {
      this._rowIdsOutOfViewport.push(rowId);
    } else if (!isOut && index >= 0) {
      this._rowIdsOutOfViewport.splice(index, 1);
    }
    event.notify({
      grid: this._grid,
      item,
      rowId,
      rowIndex,
      expandedRows: this.getExpandedRows(),
      rowIdsOutOfViewport: this._rowIdsOutOfViewport,
    }, null, this);
  }

  // Toggle between showing or hiding a row
  protected toggleRowSelection(rowNumber: number, dataContext: any) {
    if (!this.checkExpandableOverride(rowNumber, dataContext, this._grid)) {
      return;
    }
    this.handleAccordionShowHide(dataContext);
  }

  /** Collapse all of the open detail rows */
  collapseAll() {
    if (this._expanded.size === 0) {
      return;
    }
    const rows = this.getRenderedRowIndexes([...this._expanded.keys()]);
    for (const state of [...this._expanded.values()]) {
      this.collapseDetailView(state.item, true);
    }
    this.refreshRowHeights(rows);
  }

  /**
   * Collapse a detail row so that it is not longer open
   * @param item - the row item
   * @param isMultipleCollapsing - when true, the caller refreshes the row heights once for all the collapsed rows
   */
  collapseDetailView(item: any, isMultipleCollapsing = false) {
    const id = item?.[this.getIdPropertyName()];
    const state = this._expanded.get(id);
    if (!state) {
      return;
    }
    // Save the details on the collapse assuming onetime loading
    if (this._options.loadOnce) {
      this.saveDetailView(item);
    }
    const rows = isMultipleCollapsing ? [] : this.getRenderedRowIndexes([id]);
    state.panel?.remove();
    this._expanded.delete(id);
    this.syncOutOfViewport(id);

    if (!isMultipleCollapsing) {
      this.refreshRowHeights(rows);
    }
  }

  /** Expand a detail row by providing the data item that is to be expanded */
  expandDetailView(item: any) {
    const id = item?.[this.getIdPropertyName()];
    if (id === undefined || this._expanded.has(id)) {
      return;
    }
    const rows: number[] = [];
    if (this._options?.singleRowExpand && this._expanded.size > 0) {
      rows.push(...this.getRenderedRowIndexes([...this._expanded.keys()]));
      for (const state of [...this._expanded.values()]) {
        this.collapseDetailView(state.item, true);
      }
    }

    const state: ExpandedRowState = { item, panelHeight: this.getDefaultPanelHeight(), content: undefined };
    this._expanded.set(id, state);
    const row = this.getRowIndexById(id);
    if (row !== undefined) {
      rows.push(row);
    }

    const savedContent = this._savedContent.get(id);
    if (this._options.loadOnce && savedContent) {
      // reuse the view loaded (and saved) on a previous expand
      state.content = savedContent;
      this.refreshRowHeights(rows);
      this.onAsyncResponse.notify({ item, itemDetail: item, detailView: savedContent, grid: this._grid }, undefined, this);
      return;
    }

    // display pre-loading template, then start the async server call
    state.content = this._options?.preTemplate?.(item);
    this.refreshRowHeights(rows);
    this._options.process(item);
  }

  /** Whether the row of an item (or a row id) is currently expanded */
  isExpanded(itemOrId: any): boolean {
    const id = itemOrId !== null && typeof itemOrId === 'object' ? itemOrId[this.getIdPropertyName()] : itemOrId;
    return id !== undefined && this._expanded.has(id);
  }

  /** Saves the current state of the detail view */
  saveDetailView(item: any) {
    const id = item?.[this.getIdPropertyName()];
    const state = this._expanded.get(id);
    // the panel element outlives its row node, so it can be saved even while its row is not rendered
    if (state?.panel) {
      const html = state.panel.innerHTML;
      this._savedContent.set(id, html);
      // This snapshot already represents the mounted DOM. Remember it without
      // making the next render replace live inputs or their event listeners.
      state.content = html;
      state.renderedContent = html;
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
      const id = itemDetail[this.getIdPropertyName()];

      // If we just want to load in a view directly we can use detailView property to do so
      const content = args.detailView ? args.detailView : this._options?.postTemplate?.(itemDetail);
      if (this._options.loadOnce) {
        this._savedContent.set(id, content);
      }

      const state = this._expanded.get(id);
      if (state) {
        const data = this._grid.getData<RowDetailDataProvider>();
        const currentItem = data?.getItemById?.(id);
        state.item = itemDetail;
        state.content = content;
        if (currentItem && currentItem !== itemDetail && typeof data?.updateItem === 'function') {
          // a process returning a new item object replaces the row item, as it always did with the DataView
          data.updateItem(id, itemDetail);
        }
        if (state.panel) {
          this.renderPanelContent(state);
        }
      }

      // trigger an event once the post template is finished loading
      this.onAsyncEndUpdate.notify({
        grid: this._grid,
        item: itemDetail,
        itemDetail
      }, e, this);
    });
  }

  /** When row is getting toggled, we will handle the action of collapsing/expanding */
  protected handleAccordionShowHide(item: any) {
    if (item) {
      if (this.isExpanded(item)) {
        this.collapseDetailView(item);
      } else {
        this.expandDetailView(item);
      }
    }
  }

  /** Panel height from the options: `panelHeight`, or `panelRows` template lines rounded up to whole rows, capped by `maxRows` */
  protected getDefaultPanelHeight(): number {
    const rowHeight = this._gridOptions.rowHeight!;
    const height = this._options.panelHeight ?? Math.ceil((this._options.panelRows * 2 * TEMPLATE_LINE_HEIGHT) / rowHeight) * rowHeight;
    return this.limitPanelHeight(height);
  }

  /** Cap a panel height at `maxRows` grid rows */
  protected limitPanelHeight(height: number): number {
    const maxHeight = this._options.maxRows !== undefined ? this._options.maxRows * this._gridOptions.rowHeight! : Infinity;
    return Math.max(0, Math.min(height, maxHeight));
  }

  /** Get the Column Definition of the first column dedicated to toggling the Row Detail View */
  getColumnDefinition() {
    return {
      id: this._options.columnId,
      name: '',
      reorderable: this._options.reorderable,
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

  /** Return the items of the currently expanded rows, in expansion order */
  getExpandedRows(): any[] {
    return [...this._expanded.values()].map((state) => state.item);
  }

  /** The cell Formatter that shows the icon that will be used to toggle the Row Detail */
  protected detailSelectionFormatter(row: number, _cell: number, _val: any, _column: Column, dataContext: any, grid: SlickGrid): FormatterResultWithHtml | HTMLElement | '' {
    if (!this.checkExpandableOverride(row, dataContext, grid)) {
      return '';
    }
    if (!this.isExpanded(dataContext)) {
      let collapsedClasses = this._options.cssClass + ' expand ';
      if (this._options.collapsedClass) {
        collapsedClasses += this._options.collapsedClass;
      }
      return Utils.createDomElement('div', { className: collapsedClasses, role: 'button', ariaLabel: 'Expand row details', ariaExpanded: 'false', dataset: { rowDetailToggle: '' } });
    }

    let expandedClasses = this._options.cssClass + ' collapse ';
    if (this._options.expandedClass) {
      expandedClasses += this._options.expandedClass;
    }
    return {
      html: Utils.createDomElement('div', { className: expandedClasses, role: 'button', ariaLabel: 'Collapse row details', ariaExpanded: 'true', dataset: { rowDetailToggle: '' } }),
    };
  }

  /** Put the detail panel inside the (possibly re-created) row node, below its cells. */
  protected mountPanel(state: ExpandedRowState, id: RowId, rowNode: HTMLElement, row: number): void {
    if (!state.panel) {
      state.panel = this.createDetailViewElement(id);
    }
    const panel = state.panel;
    if (state.renderedContent !== state.content || !panel.hasChildNodes()) {
      this.renderPanelContent(state);
    }

    // the cells keep the base row height (see the grid's `--slick-row-extra-height` cell rule), the panel takes the rest
    const baseHeight = Math.max(0, this._grid.getRowHeight(row) - state.panelHeight);
    rowNode.classList.add('slick-row-detail-expanded');
    rowNode.style.setProperty('--slick-row-extra-height', `${state.panelHeight}px`);
    panel.style.top = `${baseHeight}px`;
    panel.style.height = `${state.panelHeight}px`;
    if (panel.parentElement !== rowNode) {
      rowNode.appendChild(panel); // moving the element keeps its live content, inputs and listeners
    }
    this.updatePanelPosition(panel);
  }

  /** Create a detail panel; `mountPanel` places and sizes it inside its row. */
  protected createDetailViewElement(id: RowId): HTMLDivElement {
    const panel = Utils.createDomElement('div', { className: `slick-row-detail-container row-detail-${id}`, role: 'region', ariaLabel: 'Row details' });
    // The panel lives inside the grid canvas: keep the keys typed in its inputs away from the grid keyboard navigation.
    panel.addEventListener('keydown', (e) => e.stopPropagation());
    return panel;
  }

  /** Keep a mounted panel within the visible viewport width, so a horizontal scroll neither hides it nor slides it under pinned columns. */
  protected updatePanelPosition(panel: HTMLDivElement): void {
    const viewport = this._grid.getViewportNode();
    const rowNode = panel.parentElement;
    if (viewport && rowNode) {
      const visibleLeft = viewport.getBoundingClientRect().left - rowNode.getBoundingClientRect().left;
      const canvasWidth = this._grid.getCanvases()?.[0]?.clientWidth || viewport.clientWidth;
      panel.style.left = `${Math.max(0, visibleLeft)}px`;
      panel.style.width = `${Math.min(viewport.clientWidth, canvasWidth)}px`;
    }
  }

  /** Render HTML or a supplied Element inside the detail panel. */
  protected renderPanelContent(state: ExpandedRowState): void {
    const panel = state.panel!;
    const content = state.content;
    if (content instanceof HTMLElement) {
      panel.replaceChildren(content);
    } else {
      panel.innerHTML = this._grid.sanitizeHtmlString((content as string) || '');
    }
    state.renderedContent = content;
  }

  /** Resize the Row Detail View to the height of its content (capped by `maxRows`) */
  resizeDetailView(item: any) {
    const id = item?.[this.getIdPropertyName()];
    const state = this._expanded.get(id);
    const panel = state?.panel;
    if (!state || !panel?.isConnected) {
      return;
    }

    // Measure the content independently of the panel's current height so it can also shrink.
    const scrollTop = panel.scrollTop;
    panel.style.height = 'auto';
    const contentHeight = panel.scrollHeight;
    panel.style.height = `${state.panelHeight}px`;

    const panelHeight = this.limitPanelHeight(contentHeight);
    if (panelHeight !== state.panelHeight) {
      state.panelHeight = panelHeight;
      this.refreshRowHeights(this.getRenderedRowIndexes([id]));
    }
    panel.scrollTop = scrollTop;

    // Lastly save the updated state
    this.saveDetailView(item);
  }

  /**
   * @deprecated The plugin no longer inserts padding rows in the data, so there is nothing to map: this returns the item unchanged.
   * Remove the call from your filter.
   */
  getFilterItem(item: any) {
    if (!this._filterItemWarned) {
      this._filterItemWarned = true;
      console.warn('[SlickGrid RowDetailView] getFilterItem() is deprecated and no longer needed: the row detail no longer inserts padding rows, so filters receive the real items only.');
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

  // --
  // data provider helpers (no DataView required)

  /** Id property of the data provider items, defaults to "id" */
  protected getIdPropertyName(): string {
    return this._grid?.getData<RowDetailDataProvider>()?.getIdPropertyName?.() || 'id';
  }

  /** Row index of an item id, using the provider's `getRowById` when it has one */
  protected getRowIndexById(id: RowId): number | undefined {
    const data = this._grid.getData<RowDetailDataProvider>();
    if (typeof data?.getRowById === 'function') {
      const row = data.getRowById(id);
      return row !== undefined && row >= 0 ? row : undefined;
    }
    const idProperty = this.getIdPropertyName();
    for (let row = 0, length = this._grid.getDataLength(); row < length; row++) {
      if (this._grid.getDataItem(row)?.[idProperty] === id) {
        return row;
      }
    }
    return undefined;
  }

  /** Row indexes of the given ids that are currently in the grid (filtered-out rows have no height to refresh) */
  protected getRenderedRowIndexes(ids: RowId[]): number[] {
    return ids.map((id) => this.getRowIndexById(id)).filter((row): row is number => row !== undefined);
  }

  /** Re-measure the rows whose expanded state or panel height changed */
  protected refreshRowHeights(rows: number[]): void {
    if (rows.length > 0) {
      this._grid.invalidateRowHeights(rows);
    }
  }

  /** Forget a collapsed row in the "out of viewport" list */
  protected syncOutOfViewport(id: RowId): void {
    const index = this._rowIdsOutOfViewport.indexOf(id);
    if (index >= 0) {
      this._rowIdsOutOfViewport.splice(index, 1);
    }
  }
}

// extend Slick namespace on window object when building as iife
/* v8 ignore next -- IIFE_ONLY is compiled as false in the unit-test build. */
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        RowDetailView: SlickRowDetailView
      }
    }
  });
}
