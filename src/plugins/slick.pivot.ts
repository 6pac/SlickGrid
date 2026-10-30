import type {
  Column,
  CustomDataView,
  ItemMetadata,
  OnPivotCellDrillDownEventArgs,
  OnPivotChangedEventArgs,
  OnPivotSpecChangedEventArgs,
  PivotColumnInfo,
  PivotField,
  PivotFieldItem,
  PivotFieldType,
  PivotHeaderNode,
  PivotNumberFormat,
  PivotOption,
  PivotRequest,
  PivotResult,
  PivotRowInfo,
  PivotRowType,
  PivotSource,
  PivotSpec,
  SlickPlugin,
} from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { PIVOT_VALUES_FIELD as PIVOT_VALUES_FIELD_, PivotEngine as PivotEngine_ } from '../slick.pivotengine.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const PivotEngine = IIFE_ONLY ? Slick.PivotEngine : PivotEngine_;
const PIVOT_VALUES_FIELD = IIFE_ONLY ? Slick.PIVOT_VALUES_FIELD : PIVOT_VALUES_FIELD_;

/** Id of the compact layout row label column */
const ROW_LABELS_COLUMN_ID = '__pivot_rows';

/** Header segment of a generated value column */
interface HeaderSegment {
  key: string;
  label: string;
  /** Key of the column node that the segment's toggle expands or collapses */
  nodeKey?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

/** Row label shown in one row header cell */
interface RowLabel {
  node: PivotHeaderNode;
  label: string;
  indent: number;
  toggle: boolean;
}

/** Pivot information of a generated column, with the plugin's own bookkeeping */
type InternalColumnInfo = PivotColumnInfo & {
  semanticKey: string;
  columnPath: Record<string, any>;
  leafSegment?: HeaderSegment;
};

/** Generated pivot row */
export interface PivotRowItem {
  id: string;
  __pivot: PivotRowInfo;
  __pivotLabels: Array<RowLabel | undefined>;
  [key: string]: any;
}

type ResolvedPivotOption = Required<Omit<PivotOption, 'spec' | 'source' | 'aggregators' | 'provider' | 'numberFormat' | 'columnLabelsCaption' | 'headerRowHeight'>> &
  Pick<PivotOption, 'spec' | 'source' | 'aggregators' | 'provider' | 'numberFormat' | 'columnLabelsCaption' | 'headerRowHeight'>;

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function joinClasses(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}

const SHOW_AS_PERCENT_TYPES = ['percentOfGrandTotal', 'percentOfColumnTotal', 'percentOfRowTotal', 'percentOfParentRowTotal', 'percentOfParentColumnTotal', 'percentDifferenceFromPrevious'];

/**
 * Pivot table plugin: renders the result of a pivot (rows, columns, values) in the grid, with
 * multi-level column headers, compact/outline/tabular row layouts, subtotals, grand totals,
 * expand & collapse, sorting and drill-down.
 *
 * The plugin owns the grid columns and data: create the grid with `pivot.rowModel` as its data
 * (and `SlickPivot.getGridOptions()` merged into its options) then register the plugin.
 *
 * @example
 * const pivot = new SlickPivot({ source: rows, fields, spec: { rows: ['Region'], columns: ['Year'], values: [{ field: 'Amount', aggregator: 'sum' }] } });
 * const grid = new SlickGrid('#grid', pivot.rowModel, [], SlickPivot.getGridOptions({ enableCellNavigation: true }));
 * grid.registerPlugin(pivot);
 */
export class SlickPivot implements SlickPlugin {
  // --
  // public API
  pluginName = 'Pivot' as const;

  /** Raised before the pivot is computed, return `false` to cancel */
  onBeforePivot = new SlickEvent<{ spec: PivotSpec; }>('onBeforePivot');

  /** Raised after a new result has been rendered */
  onPivotChanged = new SlickEvent<OnPivotChangedEventArgs>('onPivotChanged');

  /** Raised when the spec changes (from the API, the grid or the field list) */
  onSpecChanged = new SlickEvent<OnPivotSpecChangedEventArgs>('onSpecChanged');

  /** Raised when a value cell is double-clicked, with the source rows behind it */
  onPivotCellDrillDown = new SlickEvent<OnPivotCellDrillDownEventArgs>('onPivotCellDrillDown');

  /** Raised when the column tree was cut to respect `maxColumns` */
  onPivotTruncated = new SlickEvent<{ result: PivotResult; }>('onPivotTruncated');

  /** Raised when computing the pivot failed */
  onPivotError = new SlickEvent<{ error: any; }>('onPivotError');

  /** Raised when an asynchronous provider starts or finishes computing */
  onLoadingChanged = new SlickEvent<{ loading: boolean; }>('onLoadingChanged');

  /** Raised when a row or column group is expanded or collapsed */
  onGroupToggled = new SlickEvent<{ key: string; axis: 'rows' | 'columns'; collapsed: boolean; }>('onGroupToggled');

  /** Data provider to pass to the grid as its data */
  readonly rowModel: CustomDataView<PivotRowItem> & {
    getItems: () => PivotRowItem[];
    expandGroup: (key: string) => void;
    collapseGroup: (key: string) => void;
  };

  // --
  // protected props
  protected _grid?: SlickGrid;
  protected _engine: PivotEngine_;
  protected _options: ResolvedPivotOption;
  protected _spec: PivotSpec;
  protected _result?: PivotResult;
  protected _rows: PivotRowItem[] = [];
  protected _columns: Column[] = [];
  protected _columnInfo = new Map<string | number, InternalColumnInfo>();
  protected _rowNodeIndex = new Map<string, PivotHeaderNode>();
  protected _collapsedRows = new Set<string>();
  protected _collapsedColumns = new Set<string>();
  protected _userWidths = new Map<string, number>();
  protected _eventHandler: SlickEventHandler_;
  protected _bindingEventService: BindingEventService_;
  protected _sourceHandler: SlickEventHandler_;
  protected _refreshTimer?: ReturnType<typeof setTimeout>;
  protected _abortController?: AbortController;
  protected _loading = false;
  protected _scrollLeft = 0;
  protected _sortIndicator?: { semanticKey: string; sortAsc: boolean; };
  protected _headerRowHeight = 25;
  protected _defaults: ResolvedPivotOption = {
    fields: [],
    columnDefaults: {},
    rowHeaderColumn: {},
    rowLabelsCaption: 'Row Labels',
    grandTotalLabel: 'Grand Total',
    totalSuffix: ' Total',
    blankLabel: '(blank)',
    emptyCellText: '',
    showFieldCaptions: true,
    pinRowHeaders: true,
    pinGrandTotalRow: true,
    indentation: 15,
    enableRowCollapse: true,
    enableColumnCollapse: true,
    enableDrillDown: true,
    enableSorting: true,
    refreshDelay: 50,
  };

  /**
   * Grid options required by the plugin (a pre-header panel for the column group headers),
   * merged into the given options
   */
  static getGridOptions<T extends Record<string, any>>(gridOptions?: T): T & { createPreHeaderPanel: boolean; showPreHeaderPanel: boolean; preHeaderPanelHeight: number; } {
    return { preHeaderPanelHeight: 25, ...gridOptions, createPreHeaderPanel: true, showPreHeaderPanel: true } as any;
  }

  constructor(options: PivotOption) {
    this._options = Utils.extend(true, {}, this._defaults, options);
    // arrays & functions must not be deep merged
    this._options.fields = options.fields ?? [];
    this._options.source = options.source;
    this._options.provider = options.provider;
    this._engine = new PivotEngine({ fields: this._options.fields, aggregators: options.aggregators });
    this._spec = this._engine.normalizeSpec(options.spec);
    this._eventHandler = new SlickEventHandler();
    this._sourceHandler = new SlickEventHandler();
    this._bindingEventService = new BindingEventService();

    this.rowModel = {
      getLength: () => this._rows.length,
      getItem: (index: number) => this._rows[index],
      getItems: () => this._rows,
      getItemMetadata: (index: number) => this.getItemMetadata(index),
      expandGroup: (key: string) => this.expandRow(key),
      collapseGroup: (key: string) => this.collapseRow(key),
    };

    this.watchSource(this._options.source);
    if (!this._options.provider) {
      // compute synchronously so that the row model and columns are ready before the grid is created
      this.computeLocally();
    }
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    grid.getContainerNode().classList.add('slick-pivot');
    this._headerRowHeight = this._options.headerRowHeight ?? grid.getOptions().preHeaderPanelHeight ?? 25;

    if (!grid.getPreHeaderPanel()) {
      console.warn('[SlickPivot] the column group headers need a pre-header panel, create the grid with "SlickPivot.getGridOptions()" (createPreHeaderPanel: true).');
    }

    this._eventHandler
      .subscribe(grid.onClick, this.handleClick.bind(this))
      .subscribe(grid.onKeyDown, this.handleKeyDown.bind(this))
      .subscribe(grid.onDblClick, this.handleDblClick.bind(this))
      .subscribe(grid.onSort, this.handleSort.bind(this))
      .subscribe(grid.onScroll, this.handleScroll.bind(this))
      .subscribe(grid.onColumnsResized, this.handleColumnsResized.bind(this))
      .subscribe(grid.onColumnsDrag, () => this.renderHeaderGroups())
      .subscribe(grid.onAfterUpdateColumns, () => this.renderHeaderGroups())
      .subscribe(grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this));

    const preHeaderPanel = grid.getPreHeaderPanel();
    if (preHeaderPanel) {
      this._bindingEventService.bind(preHeaderPanel, 'click', this.handlePreHeaderClick.bind(this) as EventListener);
    }

    if (this._result) {
      // the result was computed by the constructor, render it and let the subscribers know
      this.afterResult();
    } else {
      this.refresh();
    }
  }

  destroy() {
    clearTimeout(this._refreshTimer);
    this._abortController?.abort();
    this._eventHandler.unsubscribeAll();
    this._sourceHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onBeforePivot.unsubscribe();
    this.onPivotChanged.unsubscribe();
    this.onSpecChanged.unsubscribe();
    this.onPivotCellDrillDown.unsubscribe();
    this.onPivotTruncated.unsubscribe();
    this.onPivotError.unsubscribe();
    this.onLoadingChanged.unsubscribe();
    this.onGroupToggled.unsubscribe();
    if (this._grid) {
      this._grid.getContainerNode().classList.remove('slick-pivot', 'slick-pivot-loading');
      const preHeaderPanel = this._grid.getPreHeaderPanel();
      if (preHeaderPanel) {
        Utils.emptyElement(preHeaderPanel);
        preHeaderPanel.classList.remove('slick-pivot-header-groups');
      }
    }
  }

  /** The pivot engine (field and aggregator registries) */
  getEngine(): PivotEngine_ {
    return this._engine;
  }

  /** The grid the plugin is registered with */
  getGrid(): SlickGrid | undefined {
    return this._grid;
  }

  getOptions(): PivotOption {
    return this._options;
  }

  /** Change plugin options (captions, layout options, …) and re-render */
  setOptions(options: Partial<Omit<PivotOption, 'fields' | 'spec' | 'source'>>): Promise<void> {
    const { provider, aggregators, ...others } = options;
    Utils.extend(true, this._options, others);
    if ('provider' in options) {
      this._options.provider = provider;
    }
    if (aggregators) {
      Object.keys(aggregators).forEach((id) => this._engine.registerAggregator({ ...aggregators[id], id }));
    }
    return this.refresh();
  }

  /** Field definitions */
  getFields(): PivotField[] {
    return this._engine.getFields();
  }

  /** Replace the field definitions, removing the fields that no longer exist from the spec */
  setFields(fields: PivotField[]): Promise<void> {
    this._options.fields = fields;
    this._engine.setFields(fields);
    const known = new Set(fields.map((field) => field.id).concat(PIVOT_VALUES_FIELD));
    return this.setSpec({
      ...this._spec,
      rows: this._spec.rows.filter((id) => known.has(id)),
      columns: this._spec.columns.filter((id) => known.has(id)),
      values: this._spec.values.filter((value) => known.has(value.field)),
      filters: (this._spec.filters ?? []).filter((filter) => known.has(filter.field)),
      sort: (this._spec.sort ?? []).filter((sort) => known.has(sort.field)),
    });
  }

  /** Current (normalized) spec */
  getSpec(): PivotSpec {
    return this._spec;
  }

  /** Replace the spec and re-pivot */
  setSpec(spec: Partial<PivotSpec>): Promise<void> {
    const previousSpec = this._spec;
    this._spec = this._engine.normalizeSpec(spec);
    if (!this.isSameSort(previousSpec, this._spec)) {
      this._sortIndicator = undefined;
    }
    this.onSpecChanged.notify({ spec: this._spec, previousSpec });
    return this.refresh();
  }

  /** Merge some spec properties into the current spec and re-pivot */
  updateSpec(spec: Partial<PivotSpec>): Promise<void> {
    return this.setSpec({ ...this._spec, ...spec });
  }

  /**
   * Replace the fields, the source rows and/or the spec at once (for example to load another dataset),
   * forgetting the collapsed groups and the column widths, then re-pivot once
   */
  load(config: { fields?: PivotField[]; source?: PivotSource; spec?: Partial<PivotSpec>; }): Promise<void> {
    if (config.fields) {
      this._options.fields = config.fields;
      this._engine.setFields(config.fields);
    }
    if ('source' in config) {
      this._options.source = config.source;
      this.watchSource(config.source);
    }
    this._collapsedRows.clear();
    this._collapsedColumns.clear();
    this._userWidths.clear();
    return this.setSpec(config.spec ?? this._spec);
  }

  /** Source rows (array or DataView) */
  getSource(): PivotSource | undefined {
    return this._options.source;
  }

  /** Replace the source rows and re-pivot */
  setSource(source: PivotSource): Promise<void> {
    this._options.source = source;
    this.watchSource(source);
    return this.refresh();
  }

  /** Source rows as an array */
  getSourceRows(): any[] {
    const source = this._options.source;
    if (!source) {
      return [];
    }
    return Array.isArray(source) ? source : source.getItems();
  }

  /** Latest pivot result */
  getResult(): PivotResult | undefined {
    return this._result;
  }

  /** Generated grid columns */
  getColumns(): Column[] {
    return this._columns;
  }

  /** Pivot information of a generated column */
  getColumnInfo(columnId: string | number): PivotColumnInfo | undefined {
    return this._columnInfo.get(columnId);
  }

  /** Pivot information of a generated row */
  getRowInfo(rowIndex: number): PivotRowInfo | undefined {
    return this._rows[rowIndex]?.__pivot;
  }

  /** Whether an asynchronous provider is computing */
  isLoading(): boolean {
    return this._loading;
  }

  /** Caption of the values, for example "Sum of Amount" (or "Values" when there are several) */
  getValuesCaption(): string {
    const visible = (this._result?.values ?? []).filter((value) => !value.hidden);
    return visible.length === 1 ? visible[0].label : visible.length ? 'Values' : '';
  }

  /** Infer the type of a field from the source rows */
  inferFieldType(fieldId: string): PivotFieldType {
    return this._engine.inferFieldType(this.getSourceRows(), fieldId);
  }

  /** Distinct items of a field (for filter lists) */
  async getFieldItems(fieldId: string, search?: string): Promise<PivotFieldItem[]> {
    if (this._options.provider?.getItems) {
      const controller = new AbortController();
      return this._options.provider.getItems(fieldId, { signal: controller.signal, search });
    }
    return this._engine.getFieldItems(this.getSourceRows(), fieldId, { search, blankLabel: this._options.blankLabel });
  }

  /** Source rows behind a cell */
  async getCellSourceRows(rowKey: string, columnKey: string): Promise<any[]> {
    if (this._options.provider) {
      return this._options.provider.getSourceRows ? this._options.provider.getSourceRows(this.createRequest(), rowKey, columnKey) : [];
    }
    return this._engine.getSourceRows(this.getSourceRows(), this._spec, rowKey, columnKey);
  }

  /** Serializable request describing the current pivot, as sent to a data provider */
  createRequest(): PivotRequest {
    const spec = this._spec;
    return {
      spec: {
        ...spec,
        values: spec.values.map(({ column: _column, ...value }) => value),
        filters: (spec.filters ?? []).map(({ predicate: _predicate, ...filter }) => filter),
        measures: (spec.measures ?? []).map(({ compute: _compute, column: _column, ...measure }) => measure) as any,
      },
      fields: this._engine.getFields().map(({ getter: _getter, itemFormatter: _itemFormatter, comparer: _comparer, column: _column, ...field }) => field),
    };
  }

  /** Re-compute the pivot (from the source rows or the provider) and re-render the grid */
  async refresh(): Promise<void> {
    clearTimeout(this._refreshTimer);
    this._refreshTimer = undefined;
    if (this.onBeforePivot.notify({ spec: this._spec }).getReturnValue() === false) {
      return;
    }

    const provider = this._options.provider;
    if (!provider) {
      this.computeLocally();
      if (this._result) {
        this.afterResult();
      }
      return;
    }

    this._abortController?.abort();
    const controller = new AbortController();
    this._abortController = controller;
    this.setLoading(true);
    try {
      const result = await provider.execute(this.createRequest(), { signal: controller.signal, spec: this._spec });
      if (!controller.signal.aborted) {
        this.applyResult(result);
        this.afterResult();
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('[SlickPivot] the pivot provider failed', error);
        this.onPivotError.notify({ error });
      }
    } finally {
      if (this._abortController === controller) {
        this._abortController = undefined;
        this.setLoading(false);
      }
    }
  }

  // --
  // expand & collapse
  // -----------------

  /** Whether a row group is collapsed */
  isRowCollapsed(key: string): boolean {
    return this._collapsedRows.has(key);
  }

  /** Expand a row group */
  expandRow(key: string): void {
    this.setRowCollapsed(key, false);
  }

  /** Collapse a row group */
  collapseRow(key: string): void {
    this.setRowCollapsed(key, true);
  }

  /** Expand or collapse a row group */
  toggleRow(key: string): void {
    this.setRowCollapsed(key, !this._collapsedRows.has(key));
  }

  /** Expand every row group, or the groups of one row field */
  expandAllRows(fieldId?: string): void {
    this.setAllCollapsed('rows', false, fieldId);
  }

  /** Collapse every row group, or the groups of one row field */
  collapseAllRows(fieldId?: string): void {
    this.setAllCollapsed('rows', true, fieldId);
  }

  /** Whether a column group is collapsed */
  isColumnCollapsed(key: string): boolean {
    return this._collapsedColumns.has(key);
  }

  /** Expand or collapse a column group */
  toggleColumn(key: string): void {
    this.setColumnCollapsed(key, !this._collapsedColumns.has(key));
  }

  /** Expand every column group, or the groups of one column field */
  expandAllColumns(fieldId?: string): void {
    this.setAllCollapsed('columns', false, fieldId);
  }

  /** Collapse every column group, or the groups of one column field */
  collapseAllColumns(fieldId?: string): void {
    this.setAllCollapsed('columns', true, fieldId);
  }

  // --
  // protected functions
  // -----------------

  protected watchSource(source?: PivotSource): void {
    this._sourceHandler.unsubscribeAll();
    const dataView = source as any;
    if (dataView && !Array.isArray(dataView)) {
      if (dataView.onRowsOrCountChanged) {
        this._sourceHandler.subscribe(dataView.onRowsOrCountChanged, () => this.scheduleRefresh());
      }
      if (dataView.onSetItemsCalled) {
        this._sourceHandler.subscribe(dataView.onSetItemsCalled, () => this.scheduleRefresh());
      }
    }
  }

  protected scheduleRefresh(): void {
    clearTimeout(this._refreshTimer);
    this._refreshTimer = setTimeout(() => this.refresh(), this._options.refreshDelay);
  }

  protected computeLocally(): void {
    try {
      const result = this._engine.execute(this.getSourceRows(), this._spec, { blankLabel: this._options.blankLabel, grandTotalLabel: this._options.grandTotalLabel });
      this.applyResult(result);
    } catch (error) {
      console.error('[SlickPivot] the pivot could not be computed', error);
      this.onPivotError.notify({ error });
    }
  }

  protected applyResult(result: PivotResult): void {
    this._result = result;
    this._rowNodeIndex.clear();
    const indexNode = (node: PivotHeaderNode) => {
      this._rowNodeIndex.set(node.key, node);
      node.children.forEach(indexNode);
    };
    indexNode(result.rowTree);
    this.pruneCollapsedKeys();
    this.buildColumns();
    this.buildRows();
  }

  protected afterResult(): void {
    if (this._grid) {
      this.updateGrid(true);
    }
    if (this._result?.truncated) {
      this.onPivotTruncated.notify({ result: this._result });
    }
    this.onPivotChanged.notify({ spec: this._spec, result: this._result! });
  }

  protected setLoading(loading: boolean): void {
    this._loading = loading;
    this._grid?.getContainerNode().classList.toggle('slick-pivot-loading', loading);
    this.onLoadingChanged.notify({ loading });
  }

  protected isSameSort(a: PivotSpec, b: PivotSpec): boolean {
    return JSON.stringify(a.sort ?? []) === JSON.stringify(b.sort ?? []);
  }

  /** Forget the collapsed groups that no longer exist */
  protected pruneCollapsedKeys(): void {
    if (!this._result) {
      return;
    }
    const keep = (set: Set<string>, root: PivotHeaderNode) => {
      if (!set.size) {
        return;
      }
      const keys = new Set<string>();
      const visit = (node: PivotHeaderNode) => {
        keys.add(node.key);
        node.children.forEach(visit);
      };
      visit(root);
      Array.from(set).forEach((key) => !keys.has(key) && set.delete(key));
    };
    keep(this._collapsedRows, this._result.rowTree);
    keep(this._collapsedColumns, this._result.columnTree);
  }

  protected setRowCollapsed(key: string, collapsed: boolean): void {
    if (this._collapsedRows.has(key) === collapsed) {
      return;
    }
    collapsed ? this._collapsedRows.add(key) : this._collapsedRows.delete(key);
    this.buildRows();
    this.updateGrid(false);
    this.onGroupToggled.notify({ key, axis: 'rows', collapsed });
  }

  protected setColumnCollapsed(key: string, collapsed: boolean): void {
    if (this._collapsedColumns.has(key) === collapsed) {
      return;
    }
    collapsed ? this._collapsedColumns.add(key) : this._collapsedColumns.delete(key);
    this.buildColumns();
    this.buildRows();
    this.updateGrid(true);
    this.onGroupToggled.notify({ key, axis: 'columns', collapsed });
  }

  protected setAllCollapsed(axis: 'rows' | 'columns', collapsed: boolean, fieldId?: string): void {
    if (!this._result) {
      return;
    }
    const set = axis === 'rows' ? this._collapsedRows : this._collapsedColumns;
    const visit = (node: PivotHeaderNode) => {
      if (node.level > 0 && node.children.length && (!fieldId || node.field === fieldId)) {
        collapsed ? set.add(node.key) : set.delete(node.key);
      }
      node.children.forEach(visit);
    };
    visit(axis === 'rows' ? this._result.rowTree : this._result.columnTree);
    if (axis === 'columns') {
      this.buildColumns();
    }
    this.buildRows();
    this.updateGrid(axis === 'columns');
  }

  protected getRowFieldIds(): string[] {
    return this._spec.rows.filter((id) => id !== PIVOT_VALUES_FIELD);
  }

  protected getColumnFieldIds(): string[] {
    return this._spec.columns.filter((id) => id !== PIVOT_VALUES_FIELD);
  }

  protected getVisibleValueIndexes(): number[] {
    return (this._result?.values ?? []).map((value, index) => (value.hidden ? -1 : index)).filter((index) => index >= 0);
  }

  // --
  // columns
  // -----------------

  protected estimateTextWidth(text: string): number {
    return Math.ceil(text.length * 7.2);
  }

  protected buildColumns(): void {
    const result = this._result!;
    const spec = this._spec;
    const options = this._options;
    const columns: Column[] = [];
    this._columnInfo.clear();

    // 1. row label column(s)
    const rowFieldIds = this.getRowFieldIds();
    const rowLabelWidths = this.estimateRowLabelWidths(result.rowTree, rowFieldIds.length);
    const addRowHeaderColumn = (id: string, name: string, semanticKey: string, rowFieldIndex: number | undefined, template: Partial<Column> | undefined, estimatedWidth: number) => {
      const column: Column = {
        width: Math.min(360, Math.max(90, estimatedWidth)),
        ...options.rowHeaderColumn,
        ...template,
        id,
        field: id,
        name,
        sortable: options.enableSorting && rowFieldIds.length > 0,
        reorderable: false,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        cssClass: joinClasses('slick-pivot-row-header', options.rowHeaderColumn.cssClass, template?.cssClass),
        headerCssClass: joinClasses('slick-pivot-row-header-title', options.rowHeaderColumn.headerCssClass, template?.headerCssClass),
        formatter: this.rowHeaderFormatter.bind(this),
      };
      const userWidth = this._userWidths.get(semanticKey);
      if (userWidth) {
        column.width = userWidth;
      }
      columns.push(column);
      this._columnInfo.set(id, { type: 'rowHeader', rowFieldIndex, groupPath: [], semanticKey, columnPath: {} });
    };

    if (spec.layout === 'compact' || rowFieldIds.length === 0) {
      const name = rowFieldIds.length ? options.rowLabelsCaption : '';
      const captionWidth = options.showFieldCaptions ? this.estimateTextWidth(this.getValuesCaption()) + 14 : 0;
      addRowHeaderColumn(ROW_LABELS_COLUMN_ID, name, 'rows', undefined, undefined, Math.max(rowLabelWidths[0] ?? 0, this.estimateTextWidth(name) + 30, captionWidth));
    } else {
      rowFieldIds.forEach((fieldId, index) => {
        const name = this._engine.getFieldLabel(fieldId);
        addRowHeaderColumn(`__pivot_row_${index}`, name, `row:${fieldId}`, index, this._engine.getField(fieldId)?.column, Math.max(rowLabelWidths[index] ?? 0, this.estimateTextWidth(name) + 30));
      });
    }

    // 2. value columns
    const valueColumns = this.buildValueColumns(result);
    const grandTotalColumns = this.buildGrandTotalColumns(result);
    const grandTotalsAtStart = spec.grandTotals?.columns === 'start';
    const orderedValueColumns = grandTotalsAtStart ? [...grandTotalColumns, ...valueColumns] : [...valueColumns, ...grandTotalColumns];
    orderedValueColumns.forEach((leaf, index) => this.addValueColumn(columns, leaf, index));

    this._columns = columns;
  }

  /** Estimated width of the row label columns, from the captions (compact layout: one entry) */
  protected estimateRowLabelWidths(root: PivotHeaderNode, rowFieldCount: number): number[] {
    const compact = this._spec.layout === 'compact' || rowFieldCount === 0;
    const widths: number[] = [];
    const visit = (node: PivotHeaderNode) => {
      if (node.level > 0) {
        const index = compact ? 0 : node.level - 1;
        const extra = compact ? (node.level - 1) * this._options.indentation + 26 : 26;
        const label = node.children.length && (this._spec.subtotals === 'bottom' || this._spec.layout === 'tabular') ? `${node.label}${this._options.totalSuffix}` : node.label;
        widths[index] = Math.max(widths[index] ?? 0, this.estimateTextWidth(label) + extra);
      }
      node.children.forEach(visit);
    };
    visit(root);
    widths[0] = Math.max(widths[0] ?? 0, this.estimateTextWidth(this._options.grandTotalLabel) + 20);
    return widths;
  }

  /** Leaves of the column header tree, combined with the values */
  protected buildValueColumns(result: PivotResult): Array<{ node: PivotHeaderNode; valueIndex: number; segments: HeaderSegment[]; isTotal: boolean; isGrandTotal: boolean; }> {
    const spec = this._spec;
    const columnFieldCount = this.getColumnFieldIds().length;
    const visibleValues = this.getVisibleValueIndexes();
    const showValueLevel = visibleValues.length > 1;
    const valuesPosition = spec.columns.indexOf(PIVOT_VALUES_FIELD) >= 0
      ? spec.columns.slice(0, spec.columns.indexOf(PIVOT_VALUES_FIELD)).filter((id) => id !== PIVOT_VALUES_FIELD).length
      : columnFieldCount;
    const leaves: Array<{ node: PivotHeaderNode; valueIndex: number; segments: HeaderSegment[]; isTotal: boolean; isGrandTotal: boolean; }> = [];

    if (!columnFieldCount) {
      // no column field: one column per value, which are the grand total columns
      return [];
    }

    const valueSegment = (node: PivotHeaderNode, valueIndex: number): HeaderSegment => ({ key: `${node.key}|v${valueIndex}`, label: result.values[valueIndex].label });
    const pushLeaves = (node: PivotHeaderNode, segments: HeaderSegment[], valueIndex: number | undefined, isTotal: boolean) => {
      if (valueIndex !== undefined) {
        leaves.push({ node, valueIndex, segments, isTotal, isGrandTotal: false });
      } else if (showValueLevel) {
        visibleValues.forEach((index) => leaves.push({ node, valueIndex: index, segments: [...segments, valueSegment(node, index)], isTotal, isGrandTotal: false }));
      } else if (visibleValues.length) {
        leaves.push({ node, valueIndex: visibleValues[0], segments, isTotal, isGrandTotal: false });
      }
    };

    const visit = (node: PivotHeaderNode, segments: HeaderSegment[], valueIndex: number | undefined) => {
      // insert the value level at its position among the column fields
      if (showValueLevel && valueIndex === undefined && node.level === valuesPosition && node.level < columnFieldCount) {
        visibleValues.forEach((index) => visit(node, [...segments, valueSegment(node, index)], index));
        return;
      }
      const suffix = valueIndex !== undefined ? `|v${valueIndex}` : '';
      node.children.forEach((child) => {
        const collapsible = this._options.enableColumnCollapse && child.children.length > 0;
        const collapsed = collapsible && this._collapsedColumns.has(child.key);
        const childSegment: HeaderSegment = { key: `${child.key}${suffix}`, nodeKey: child.key, label: child.label, collapsible, collapsed };
        if (collapsed) {
          pushLeaves(child, [...segments, childSegment], valueIndex, true);
        } else if (child.children.length) {
          visit(child, [...segments, childSegment], valueIndex);
          if (spec.columnSubtotals) {
            pushLeaves(child, [...segments, { key: `${child.key}${suffix}|total`, label: `${child.label}${this._options.totalSuffix}` }], valueIndex, true);
          }
        } else {
          pushLeaves(child, [...segments, childSegment], valueIndex, false);
        }
      });
    };
    visit(result.columnTree, [], undefined);
    return leaves;
  }

  protected buildGrandTotalColumns(result: PivotResult): Array<{ node: PivotHeaderNode; valueIndex: number; segments: HeaderSegment[]; isTotal: boolean; isGrandTotal: boolean; }> {
    const spec = this._spec;
    const hasColumnFields = this.getColumnFieldIds().length > 0;
    if (hasColumnFields && spec.grandTotals?.columns === false) {
      return [];
    }
    const root = result.columnTree;
    let visibleValues = this.getVisibleValueIndexes();
    if (hasColumnFields && spec.grandTotals?.values?.length) {
      const allowed = new Set(spec.grandTotals.values);
      visibleValues = visibleValues.filter((index) => allowed.has(result.values[index].id));
    }
    const grandTotalSegment: HeaderSegment = { key: `${root.key}|grandtotal`, label: hasColumnFields ? (spec.grandTotals?.label ?? this._options.grandTotalLabel) : '' };
    return visibleValues.map((valueIndex) => {
      const valueSegment: HeaderSegment = { key: `${root.key}|v${valueIndex}`, label: result.values[valueIndex].label };
      let segments: HeaderSegment[];
      if (!hasColumnFields) {
        segments = [valueSegment];
      } else {
        segments = visibleValues.length > 1 ? [grandTotalSegment, valueSegment] : [grandTotalSegment];
      }
      return { node: root, valueIndex, segments, isTotal: true, isGrandTotal: true };
    });
  }

  protected addValueColumn(columns: Column[], leaf: { node: PivotHeaderNode; valueIndex: number; segments: HeaderSegment[]; isTotal: boolean; isGrandTotal: boolean; }, index: number): void {
    const options = this._options;
    const resultValue = this._result!.values[leaf.valueIndex];
    const template = resultValue.isMeasure
      ? (this._spec.measures ?? []).find((measure) => measure.id === resultValue.id)?.column
      : this._spec.values.find((value) => value.id === resultValue.id)?.column;
    const id = `__pv_${index}`;
    const semanticKey = `${leaf.segments.map((segment) => segment.key).join('/')}|${resultValue.id}`;
    const groupPath = leaf.segments.slice(0, -1);
    const lastSegment = leaf.segments[leaf.segments.length - 1];
    const column: Column = {
      width: 100,
      ...options.columnDefaults,
      ...template,
      id,
      field: id,
      name: lastSegment?.label ?? '',
      columnGroup: groupPath.map((segment) => segment.label).join(' › ') || undefined,
      sortable: options.enableSorting && this.getRowFieldIds().length > 0,
      reorderable: false,
      cssClass: joinClasses('slick-pivot-value', leaf.isTotal && 'slick-pivot-total-column', leaf.isGrandTotal && 'slick-pivot-grand-total-column', options.columnDefaults.cssClass, template?.cssClass),
      headerCssClass: joinClasses('slick-pivot-value-title', leaf.isTotal && 'slick-pivot-total-title', options.columnDefaults.headerCssClass, template?.headerCssClass),
      formatter: template?.formatter ?? options.columnDefaults.formatter ?? this.valueFormatter.bind(this),
    };
    const userWidth = this._userWidths.get(semanticKey);
    if (userWidth) {
      column.width = userWidth;
    }
    columns.push(column);
    this._columnInfo.set(id, {
      type: 'value',
      columnKey: leaf.node.key,
      valueIndex: leaf.valueIndex,
      valueId: resultValue.id,
      isTotal: leaf.isTotal,
      isGrandTotal: leaf.isGrandTotal,
      groupPath,
      semanticKey,
      columnPath: leaf.node.path,
      leafSegment: lastSegment,
    });
  }

  // --
  // rows
  // -----------------

  protected buildRows(): void {
    const result = this._result;
    if (!result) {
      this._rows = [];
      return;
    }
    const spec = this._spec;
    const options = this._options;
    const rowFieldIds = this.getRowFieldIds();
    const rowFieldCount = rowFieldIds.length;
    const layout = rowFieldCount === 0 ? 'compact' : spec.layout;
    const subtotals = layout === 'tabular' && spec.subtotals === 'top' ? 'bottom' : spec.subtotals;
    const rows: PivotRowItem[] = [];
    const valueColumns = this._columns.filter((column) => this._columnInfo.get(column.id)?.type === 'value').map((column) => ({ id: column.id, info: this._columnInfo.get(column.id)! }));
    const labelSlot = (node: PivotHeaderNode) => (layout === 'compact' ? 0 : node.level - 1);

    const createItem = (node: PivotHeaderNode, type: PivotRowType, label: string, withValues: boolean): PivotRowItem => {
      const collapsed = this._collapsedRows.has(node.key);
      const item: PivotRowItem = {
        id: `${type}:${node.key}`,
        __pivot: { type, key: node.key, level: node.level, label, hasChildren: node.children.length > 0, collapsed, node },
        __pivotLabels: [],
        ...node.path,
      };
      if (withValues) {
        const rowCells = result.cells[node.key];
        valueColumns.forEach(({ id, info }) => (item[id] = rowCells?.[info.columnKey!]?.[info.valueIndex!]));
      }
      return item;
    };
    const setLabel = (item: PivotRowItem, node: PivotHeaderNode, label: string, toggle: boolean) => {
      const slot = labelSlot(node);
      item.__pivotLabels[slot] = { node, label, indent: layout === 'compact' ? node.level - 1 : 0, toggle };
      item[layout === 'compact' ? ROW_LABELS_COLUMN_ID : `__pivot_row_${slot}`] = label;
    };

    if (rowFieldCount === 0) {
      const item = createItem(result.rowTree, 'grandTotal', this.getValuesCaption() || options.grandTotalLabel, true);
      setLabel(item, { ...result.rowTree, level: 1 }, item.__pivot.label, false);
      rows.push(item);
      this._rows = rows;
      return;
    }

    // ancestors whose caption has not been printed yet (outline & tabular layouts)
    let pending: PivotHeaderNode[] = [];
    const printPending = (item: PivotRowItem) => {
      pending.forEach((ancestor) => setLabel(item, ancestor, ancestor.label, ancestor.children.length > 0 && options.enableRowCollapse));
      pending = [];
    };
    const repeatLabels = (item: PivotRowItem, node: PivotHeaderNode) => {
      if (spec.repeatItemLabels && layout !== 'compact') {
        let parent = node.parentKey === undefined ? undefined : this._rowNodeIndex.get(node.parentKey);
        while (parent && parent.level > 0) {
          if (!item.__pivotLabels[labelSlot(parent)]) {
            setLabel(item, parent, parent.label, false);
          }
          parent = parent.parentKey === undefined ? undefined : this._rowNodeIndex.get(parent.parentKey);
        }
      }
    };

    const visit = (parent: PivotHeaderNode) => {
      parent.children.forEach((node) => {
        const hasChildren = node.children.length > 0;
        const collapsed = hasChildren && options.enableRowCollapse && this._collapsedRows.has(node.key);
        if (!hasChildren || collapsed) {
          const item = createItem(node, hasChildren ? 'group' : 'leaf', node.label, true);
          if (layout !== 'compact') {
            printPending(item);
            repeatLabels(item, node);
          }
          setLabel(item, node, node.label, hasChildren && options.enableRowCollapse);
          rows.push(item);
          return;
        }

        if (layout === 'tabular') {
          pending.push(node);
        } else {
          const item = createItem(node, 'group', node.label, subtotals === 'top');
          if (layout === 'outline') {
            repeatLabels(item, node);
          }
          setLabel(item, node, node.label, options.enableRowCollapse);
          rows.push(item);
        }

        visit(node);

        if (subtotals === 'bottom') {
          const label = `${node.label}${options.totalSuffix}`;
          const item = createItem(node, 'subtotal', label, true);
          setLabel(item, node, label, false);
          rows.push(item);
        }
        pending = pending.filter((ancestor) => ancestor !== node);
      });
    };
    visit(result.rowTree);

    const grandTotalRows = spec.grandTotals?.rows;
    if (grandTotalRows !== false) {
      const label = spec.grandTotals?.label ?? options.grandTotalLabel;
      const item = createItem(result.rowTree, 'grandTotal', label, true);
      setLabel(item, { ...result.rowTree, level: 1 }, label, false);
      grandTotalRows === 'top' ? rows.unshift(item) : rows.push(item);
    }
    this._rows = rows;
  }

  protected getItemMetadata(index: number): ItemMetadata | null {
    const item = this._rows[index];
    if (!item) {
      return null;
    }
    const info = item.__pivot;
    const layout = this.getRowFieldIds().length === 0 ? 'compact' : this._spec.layout;
    const metadata: ItemMetadata = {
      cssClasses: joinClasses('slick-pivot-row', `slick-pivot-${info.type === 'grandTotal' ? 'grand-total' : info.type}`, `slick-pivot-level-${info.level}`, info.collapsed && 'slick-pivot-collapsed'),
    };
    if (layout !== 'compact') {
      // a total caption (or an outline group caption) spans the deeper row label columns
      const rowFieldCount = this.getRowFieldIds().length;
      const spanned = info.type === 'subtotal' || info.type === 'grandTotal' || (layout === 'outline' && info.type === 'group' && !info.collapsed);
      if (spanned) {
        const slot = info.type === 'grandTotal' ? 0 : info.level - 1;
        if (rowFieldCount - slot > 1) {
          metadata.columns = { [slot]: { colspan: rowFieldCount - slot } };
        }
      }
    }
    return metadata;
  }

  // --
  // formatters
  // -----------------

  protected rowHeaderFormatter(_row: number, _cell: number, _value: any, column: Column, item: PivotRowItem): DocumentFragment | string {
    const info = this._columnInfo.get(column.id);
    const slot = info?.rowFieldIndex ?? 0;
    const label = item?.__pivotLabels?.[slot];
    if (!label) {
      return '';
    }
    const fragment = document.createDocumentFragment();
    const indent = label.indent * this._options.indentation;
    if (label.toggle) {
      const collapsed = this._collapsedRows.has(label.node.key);
      const toggle = Utils.createDomElement('span', {
        className: `slick-pivot-toggle slick-group-toggle ${collapsed ? 'collapsed' : 'expanded'}`,
        role: 'button',
        ariaExpanded: String(!collapsed),
        ariaLabel: `${collapsed ? 'Expand' : 'Collapse'} ${label.label}`,
        style: { marginLeft: `${indent}px` },
      });
      toggle.dataset.key = label.node.key;
      fragment.appendChild(toggle);
    } else if (this._spec.layout === 'compact' || !this.getRowFieldIds().length) {
      // keep the compact layout captions aligned with the ones that have a toggle
      fragment.appendChild(Utils.createDomElement('span', { className: 'slick-pivot-toggle-spacer', style: { marginLeft: `${indent}px` } }));
    }
    fragment.appendChild(Utils.createDomElement('span', { className: 'slick-pivot-label', textContent: label.label }));
    return fragment;
  }

  protected getNumberFormat(valueIndex: number): PivotNumberFormat | undefined {
    const resultValue = this._result?.values[valueIndex];
    if (!resultValue) {
      return undefined;
    }
    const own = resultValue.isMeasure
      ? (this._spec.measures ?? []).find((measure) => measure.id === resultValue.id)?.numberFormat
      : this._spec.values.find((value) => value.id === resultValue.id)?.numberFormat;
    // the plugin format is the base (for example its locale) of every value format
    const base = this._options.numberFormat;
    if (resultValue.showAs && SHOW_AS_PERCENT_TYPES.includes(resultValue.showAs.type) && own?.style !== 'percent') {
      // a percentage calculation is shown as a percentage, whatever the format of the aggregated value
      return { locale: own?.locale ?? base?.locale, style: 'percent', maximumFractionDigits: 2 };
    }
    return own ? { ...base, ...own } : base;
  }

  /** Format a value the way the default value formatter does */
  formatValue(value: any, valueIndex: number): string {
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return this._options.emptyCellText;
    }
    if (typeof value === 'number') {
      const { locale, ...format } = this.getNumberFormat(valueIndex) ?? {};
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 2, ...format }).format(value);
    }
    if (Object.prototype.toString.call(value) === '[object Date]') {
      return value.toLocaleDateString();
    }
    return String(value);
  }

  protected valueFormatter(_row: number, _cell: number, value: any, column: Column): string {
    const info = this._columnInfo.get(column.id);
    return escapeHtml(this.formatValue(value, info?.valueIndex ?? 0));
  }

  // --
  // grid rendering
  // -----------------

  protected updateGrid(columnsChanged: boolean): void {
    const grid = this._grid;
    if (!grid) {
      return;
    }
    if (columnsChanged) {
      // pin before setting the columns, so that the grid lays out the pinned columns while applying them
      this.applyPinning('columns');
      grid.setColumns(this._columns);
    }
    grid.invalidateAllRows();
    grid.updateRowCount();
    this.applyPinning('rows');
    grid.render();
    if (columnsChanged) {
      this.renderHeaderGroups();
      this.applySortIndicator();
    }
  }

  protected applyPinning(target: 'columns' | 'rows'): void {
    const grid = this._grid!;
    const options = this._options;
    const current = grid.getOptions().pinning ?? {};
    if (target === 'columns' && options.pinRowHeaders) {
      // pin by column ids, which the grid ignores while the previous layout's columns are still shown
      const rowHeaderIds = this._columns.filter((column) => this._columnInfo.get(column.id)?.type === 'rowHeader').map((column) => column.id as string);
      const left = rowHeaderIds.length && this._columns.length > rowHeaderIds.length ? rowHeaderIds : [];
      if (JSON.stringify(current.columns?.left ?? []) !== JSON.stringify(left)) {
        grid.setOptions({ pinning: { columns: { left } } }, true, true);
      }
    }
    if (target === 'rows' && options.pinGrandTotalRow) {
      const grandTotalIndex = this._rows.findIndex((row) => row.__pivot.type === 'grandTotal');
      const showsTree = this.getRowFieldIds().length > 0 && grandTotalIndex >= 0 && this._rows.length > 1;
      const top = showsTree && grandTotalIndex === 0 ? [0] : [];
      const bottom = showsTree && grandTotalIndex > 0 ? [grandTotalIndex] : [];
      if (JSON.stringify(current.rows?.top ?? []) !== JSON.stringify(top) || JSON.stringify(current.rows?.bottom ?? []) !== JSON.stringify(bottom)) {
        grid.setOptions({ pinning: { rows: { top, bottom } } }, true, true);
      }
    }
  }

  protected applySortIndicator(): void {
    const grid = this._grid;
    if (!grid) {
      return;
    }
    const indicator = this._sortIndicator;
    const column = indicator ? this._columns.find((col) => this._columnInfo.get(col.id)?.semanticKey === indicator.semanticKey) : undefined;
    grid.setSortColumns(column ? [{ columnId: column.id, sortAsc: indicator!.sortAsc }] : []);
  }

  /** Render the column group header rows inside the grid pre-header panel */
  protected renderHeaderGroups(): void {
    const grid = this._grid;
    const panel = grid?.getPreHeaderPanel();
    if (!grid || !panel || !this._result) {
      return;
    }
    const options = this._options;
    const columns = grid.getColumns().filter((column) => !column.hidden);
    const infos = columns.map((column) => this._columnInfo.get(column.id));
    const groupLevels = infos.reduce((max, info) => Math.max(max, info?.groupPath.length ?? 0), 0);
    const hasValueColumns = infos.some((info) => info?.type === 'value');
    const captionRow = options.showFieldCaptions && hasValueColumns && this.getColumnFieldIds().length > 0;
    const rowCount = groupLevels + (captionRow ? 1 : 0);
    const scroller = panel.parentElement as HTMLElement | null;

    Utils.emptyElement(panel);
    panel.classList.add('slick-pivot-header-groups');
    if (!rowCount) {
      grid.setPreHeaderPanelVisibility(false);
      return;
    }

    const rowHeight = this._headerRowHeight;
    const height = rowHeight * rowCount;
    const gridOptions = grid.getOptions();
    if (!gridOptions.showPreHeaderPanel || gridOptions.preHeaderPanelHeight !== height) {
      // the options object is live, so the viewport height calculation picks up the new height
      gridOptions.preHeaderPanelHeight = height;
      if (scroller) {
        scroller.style.height = `${height}px`;
      }
      grid.setPreHeaderPanelVisibility(true);
      grid.resizeCanvas();
    }

    const pinnedLeft = this.getPinnedLeftCount(columns);
    const totalWidth = columns.reduce((sum, column) => sum + (column.width ?? 0), 0);
    panel.style.width = `${Math.max(totalWidth, grid.getHeadersWidth())}px`;
    panel.style.setProperty('--slick-pivot-scroll-left', `${this._scrollLeft}px`);
    const columnFieldsCaption = options.columnLabelsCaption ?? this.getColumnFieldIds().map((id) => this._engine.getFieldLabel(id)).join(' / ');

    for (let r = 0; r < rowCount; r++) {
      const rowElm = Utils.createDomElement('div', { className: 'slick-pivot-header-row', style: { height: `${rowHeight}px` } }, panel);
      let current: { key: string; elm: HTMLElement; width: number; } | undefined;
      columns.forEach((column, c) => {
        const info = infos[c];
        let segment: HeaderSegment;
        if (info?.type !== 'value') {
          segment = { key: '__rowheaders', label: captionRow && r === 0 ? this.getValuesCaption() : '' };
        } else if (captionRow && r === 0) {
          segment = { key: '__caption', label: columnFieldsCaption };
        } else {
          const level = r - (captionRow ? 1 : 0);
          segment = info.groupPath[level] ?? { key: `__empty_${column.id}`, label: '' };
        }
        const pinned = c < pinnedLeft;
        const key = `${segment.key}${pinned ? '|pinned' : ''}`;
        const width = column.width ?? 0;
        if (current && current.key === key) {
          current.width += width;
          current.elm.style.width = `${current.width}px`;
          return;
        }
        const elm = Utils.createDomElement('div', {
          className: joinClasses(
            'slick-pivot-header-group',
            info?.type !== 'value' && 'slick-pivot-header-corner',
            captionRow && r === 0 && 'slick-pivot-header-caption',
            pinned && 'slick-pivot-header-group-pinned',
            !segment.label && 'slick-pivot-header-group-empty'
          ),
          style: { width: `${width}px` },
          title: segment.label,
        }, rowElm);
        if (segment.collapsible) {
          const toggle = Utils.createDomElement('span', {
            className: `slick-pivot-column-toggle slick-group-toggle ${segment.collapsed ? 'collapsed' : 'expanded'}`,
            role: 'button',
            ariaExpanded: String(!segment.collapsed),
            ariaLabel: `${segment.collapsed ? 'Expand' : 'Collapse'} ${segment.label}`,
          }, elm);
          toggle.dataset.key = segment.nodeKey;
        }
        Utils.createDomElement('span', { className: 'slick-pivot-header-label', textContent: segment.label }, elm);
        current = { key, elm, width };
      });
    }
  }

  protected getPinnedLeftCount(columns: Column[]): number {
    const left = this._grid?.getOptions().pinning?.columns?.left;
    if (typeof left === 'number') {
      return left + 1;
    }
    if (Array.isArray(left)) {
      return columns.filter((column, index) => left.includes(column.id as any) || left.includes(index as any)).length;
    }
    return 0;
  }

  // --
  // grid events
  // -----------------

  protected handleScroll(_e: any, args: { scrollLeft: number; }): void {
    if (args.scrollLeft !== this._scrollLeft) {
      this._scrollLeft = args.scrollLeft;
      this._grid?.getPreHeaderPanel()?.style.setProperty('--slick-pivot-scroll-left', `${this._scrollLeft}px`);
    }
  }

  protected handleColumnsResized(): void {
    this._grid?.getColumns().forEach((column) => {
      const info = this._columnInfo.get(column.id);
      if (info && column.width) {
        this._userWidths.set(info.semanticKey, column.width);
      }
    });
    this.renderHeaderGroups();
  }

  protected handleHeaderCellRendered(_e: any, args: { node: HTMLElement; column: Column; }): void {
    const segment = this._columnInfo.get(args.column.id)?.leafSegment;
    if (segment?.collapsible) {
      const nameElm = args.node.querySelector('.slick-column-name') ?? args.node;
      const toggle = Utils.createDomElement('span', {
        className: `slick-pivot-column-toggle slick-group-toggle ${segment.collapsed ? 'collapsed' : 'expanded'}`,
        role: 'button',
        ariaExpanded: String(!segment.collapsed),
        ariaLabel: `${segment.collapsed ? 'Expand' : 'Collapse'} ${segment.label}`,
      });
      toggle.dataset.key = segment.nodeKey;
      nameElm.insertBefore(toggle, nameElm.firstChild);
      // a plain listener goes away with the header cell, which the grid re-creates on every column change
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleColumn(toggle.dataset.key!);
      });
    }
  }

  protected handlePreHeaderClick(e: MouseEvent): void {
    const toggle = (e.target as HTMLElement).closest<HTMLElement>('.slick-pivot-column-toggle');
    if (toggle?.dataset.key) {
      e.stopPropagation();
      this.toggleColumn(toggle.dataset.key);
    }
  }

  protected handleClick(e: any, _args: { row: number; cell: number; }): void {
    const target = (e.target as HTMLElement)?.closest?.<HTMLElement>('.slick-pivot-toggle');
    if (target?.dataset.key) {
      this.toggleRow(target.dataset.key);
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }

  protected handleKeyDown(e: any, args: { row: number; cell: number; }): void {
    const key = e.key ?? e.getNativeEvent?.()?.key;
    if (key !== ' ' && key !== '+' && key !== '-' && key !== 'Enter') {
      return;
    }
    const item = this._rows[args.row];
    const column = this._grid?.getColumns()[args.cell];
    const info = column ? this._columnInfo.get(column.id) : undefined;
    if (!item || info?.type !== 'rowHeader') {
      return;
    }
    const label = item.__pivotLabels[info.rowFieldIndex ?? 0];
    if (!label?.toggle) {
      return;
    }
    if (key === '+') {
      this.expandRow(label.node.key);
    } else if (key === '-') {
      this.collapseRow(label.node.key);
    } else {
      this.toggleRow(label.node.key);
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  protected async handleDblClick(_e: any, args: { row: number; cell: number; }): Promise<void> {
    if (!this._options.enableDrillDown || !this._result) {
      return;
    }
    const item = this._rows[args.row];
    const column = this._grid?.getColumns()[args.cell];
    const info = column ? this._columnInfo.get(column.id) : undefined;
    if (!item || !info) {
      return;
    }
    const columnKey = info.type === 'value' ? info.columnKey! : this._result.columnTree.key;
    const rows = await this.getCellSourceRows(item.__pivot.key, columnKey);
    this.onPivotCellDrillDown.notify({
      rowKey: item.__pivot.key,
      columnKey,
      valueId: info.valueId,
      rowPath: item.__pivot.node.path,
      columnPath: info.columnPath,
      rows,
    });
  }

  protected handleSort(_e: any, args: any): void {
    const sortCol: Column | undefined = args.sortCol ?? args.sortCols?.[0]?.sortCol;
    const sortAsc: boolean = args.sortAsc ?? args.sortCols?.[0]?.sortAsc ?? true;
    const info = sortCol ? this._columnInfo.get(sortCol.id) : undefined;
    if (!info) {
      return;
    }
    const direction = sortAsc ? 'asc' : 'desc';
    const rowFieldIds = this.getRowFieldIds();
    let sort = (this._spec.sort ?? []).filter((item) => !rowFieldIds.includes(item.field));
    if (info.type === 'rowHeader') {
      const fields = info.rowFieldIndex === undefined ? rowFieldIds : [rowFieldIds[info.rowFieldIndex]];
      const others = info.rowFieldIndex === undefined ? [] : (this._spec.sort ?? []).filter((item) => rowFieldIds.includes(item.field) && item.field !== fields[0] && !item.by);
      sort = [...sort, ...others, ...fields.map((field) => ({ field, direction: direction as 'asc' | 'desc' }))];
    } else {
      sort = [...sort, ...rowFieldIds.map((field) => ({ field, direction: direction as 'asc' | 'desc', by: { valueId: info.valueId!, columnKey: info.columnKey } }))];
    }
    const semanticKey = info.semanticKey;
    this.setSpec({ ...this._spec, sort }).then(() => {
      this._sortIndicator = { semanticKey, sortAsc };
      this.applySortIndicator();
    });
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Pivot = SlickPivot;
}
