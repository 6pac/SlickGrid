import type { PivotFieldType, PivotFilter, PivotSort, PivotSpec, PivotValue, SlickPlugin } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { PIVOT_VALUES_FIELD as PIVOT_VALUES_FIELD_, PivotEngine as PivotEngine_ } from '../slick.pivotengine.js';
import type { SlickGrid } from '../slick.grid.js';
import type { SlickPivot } from './slick.pivot.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const PivotEngine = IIFE_ONLY ? Slick.PivotEngine : PivotEngine_;
const PIVOT_VALUES_FIELD = IIFE_ONLY ? Slick.PIVOT_VALUES_FIELD : PIVOT_VALUES_FIELD_;

/** Crosstab role of a design column: Row Heading, Column Heading, Value or not shown */
export type PivotDesignerCrosstab = 'row' | 'column' | 'value' | 'none';

/** Column of the design grid, like a column of the MS Access query designer */
export interface PivotDesignColumn {
  /** Id of the field (or of a level of a date hierarchy) */
  field: string;

  /** `groupBy`, `where` or the id of an aggregator */
  total: string;

  /** Crosstab role */
  crosstab: PivotDesignerCrosstab;

  /** Sort of a Row or Column Heading */
  sort?: 'asc' | 'desc';

  /** MS Access style criteria (see `PivotFilter.criteria`) */
  criteria?: string;

  /** Value of the spec behind an aggregated column, which keeps its other settings (caption, number format, …) */
  value?: PivotValue;

  /** Filter of the spec behind the criteria, kept as it is while the criteria are not changed */
  filter?: PivotFilter;
}

export interface PivotDesignerLabels {
  title: string;
  fields: string;
  pivotMode: string;
  rows: { field: string; total: string; crosstab: string; sort: string; criteria: string; };
  addField: string;
  groupBy: string;
  where: string;
  /** Captions of the aggregators, like the Total row of MS Access; the other aggregators keep their own caption */
  totals: Record<string, string>;
  crosstab: Record<PivotDesignerCrosstab, string>;
  sort: { none: string; asc: string; desc: string; };
  rowTotal: string;
  moveLeft: string;
  moveRight: string;
  remove: string;
  /** Caption of a row total value, by default "Total Of Amount" */
  rowTotalValue: (fieldLabel: string) => string;
}

export interface PivotDesignerOption {
  /** Element (or selector) in which the designer is added, for example above the grid */
  container: HTMLElement | string;

  /** The pivot plugin, by default the one registered with the grid (register it first) */
  pivot?: SlickPivot;

  /**
   * Spec properties set when the designer is registered, so that the result looks like an MS Access crosstab (tabular,
   * every caption repeated, no subtotals and no grand total row), or `false` to keep the spec as it is
   */
  resultLayout?: Partial<PivotSpec> | false;

  /** Show the Pivot Mode switch, defaults to true (it is left out for a grid created with `pivot.rowModel` as its data) */
  showPivotModeToggle?: boolean;

  /** Show the list of the fields beside the design grid, defaults to true */
  showFieldList?: boolean;

  /** Ids of the aggregators offered in the Total row, in order, defaults to every aggregator (Sum, Avg, Min, Max, Count, StDev, Var, First, Last first) */
  totals?: string[];

  /** Captions */
  labels?: Partial<PivotDesignerLabels>;
}

const ACCESS_TOTALS = ['sum', 'avg', 'min', 'max', 'count', 'stdDev', 'var', 'first', 'last'];

/** A criteria literal: numbers as they are, dates between #, text quoted */
function formatCriteriaLiteral(value: any): string {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return typeof value === 'boolean' ? (value ? 'True' : 'False') : String(value);
  }
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return `#${(value as Date).toISOString().slice(0, 10)}#`;
  }
  return `"${String(value).replace(/"/g, '""')}"`;
}

/** MS Access style criteria of a spec filter, empty when the filter cannot be written as criteria (a predicate or a top N) */
function getFilterCriteria(filter: PivotFilter): string {
  const parts: string[] = [];
  const isBlank = (value: any) => value === null || value === undefined || value === '';
  const list = (values: any[], negate: boolean) => {
    const items = values.filter((value) => !isBlank(value));
    const blank = items.length < values.length;
    const terms: string[] = [];
    if (items.length) {
      const inList = items.length === 1 ? formatCriteriaLiteral(items[0]) : `In (${items.map(formatCriteriaLiteral).join(', ')})`;
      terms.push(negate ? (items.length === 1 ? `<> ${inList}` : `Not ${inList}`) : inList);
    }
    if (blank) {
      terms.push(negate ? 'Is Not Null' : 'Is Null');
    }
    return terms.join(negate ? ' And ' : ' Or ');
  };
  if (filter.criteria?.trim()) {
    parts.push(filter.criteria.trim());
  }
  if (filter.include) {
    parts.push(filter.include.length ? list(filter.include, false) : 'False');
  }
  if (filter.exclude?.length) {
    parts.push(list(filter.exclude, true));
  }
  if (filter.label) {
    const text = filter.label.value.replace(/[*?#[]/g, '[$&]');
    parts.push({
      equals: formatCriteriaLiteral(filter.label.value),
      notEquals: `<> ${formatCriteriaLiteral(filter.label.value)}`,
      contains: `Like ${formatCriteriaLiteral(`*${text}*`)}`,
      notContains: `Not Like ${formatCriteriaLiteral(`*${text}*`)}`,
      beginsWith: `Like ${formatCriteriaLiteral(`${text}*`)}`,
      endsWith: `Like ${formatCriteriaLiteral(`*${text}`)}`,
    }[filter.label.operator]);
  }
  return parts.length > 1 ? parts.map((part) => `(${part})`).join(' And ') : parts[0] ?? '';
}

/**
 * MS Access style crosstab designer, registered with the grid after the pivot plugin: a design grid with one
 * column per field and a Field, Total, Crosstab, Sort and Criteria row, like the query designer of MS Access,
 * and the list of the fields. Row Headings with Group By are the rows of the pivot, Column Headings the columns
 * and Values the values; a Row Heading with an aggregate is a row total, Where columns and criteria filter the
 * source rows. Every change is applied to the spec of the pivot, and the designer follows the spec however it
 * changes.
 *
 * @example
 * const grid = new SlickGrid('#myGrid', dataView, columns, SlickPivot.getGridOptions(gridOptions));
 * grid.registerPlugin(new SlickPivot({ spec }));
 * grid.registerPlugin(new SlickPivotDesigner({ container: '#designer' }));
 */
export class SlickPivotDesigner implements SlickPlugin {
  // --
  // public API
  pluginName = 'PivotDesigner' as const;

  /** MS Access style criteria of a spec filter (its item, label or criteria filter), empty for a predicate or a top N */
  static getFilterCriteria = getFilterCriteria;

  /** Raised when the designer changed the spec */
  onDesignChanged = new SlickEvent<{ columns: PivotDesignColumn[]; spec: PivotSpec; }>('onDesignChanged');

  // --
  // protected props
  protected _options: PivotDesignerOption & { labels: PivotDesignerLabels; };
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _grid?: SlickGrid;
  protected _pivot?: SlickPivot;
  protected _designerElm?: HTMLDivElement;
  protected _bodyElm?: HTMLDivElement;
  protected _fieldListElm?: HTMLUListElement;
  protected _tableElm?: HTMLTableElement;
  protected _statusElm?: HTMLDivElement;
  protected _pivotModeCheckbox?: HTMLInputElement;
  protected _columns: PivotDesignColumn[] = [];
  protected _activeField?: string;
  protected _dragField?: string;
  protected _message = '';
  protected _typeCache = new Map<string, PivotFieldType>();
  protected _defaultLabels: PivotDesignerLabels = {
    title: 'Crosstab Designer',
    fields: 'Fields',
    pivotMode: 'Pivot Mode',
    rows: { field: 'Field:', total: 'Total:', crosstab: 'Crosstab:', sort: 'Sort:', criteria: 'Criteria:' },
    addField: '(add a field)',
    groupBy: 'Group By',
    where: 'Where',
    totals: { sum: 'Sum', avg: 'Avg', min: 'Min', max: 'Max', count: 'Count', stdDev: 'StDev', var: 'Var', first: 'First', last: 'Last' },
    crosstab: { row: 'Row Heading', column: 'Column Heading', value: 'Value', none: '(not shown)' },
    sort: { none: '(not sorted)', asc: 'Ascending', desc: 'Descending' },
    rowTotal: 'Row total',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    remove: 'Remove',
    rowTotalValue: (fieldLabel) => `Total Of ${fieldLabel}`,
  };

  constructor(options: PivotDesignerOption) {
    this._options = {
      resultLayout: { layout: 'tabular', subtotals: 'none', columnSubtotals: false, repeatItemLabels: true, grandTotals: { rows: false } },
      showPivotModeToggle: true,
      showFieldList: true,
      ...options,
      labels: Utils.extend(true, {}, this._defaultLabels, options.labels),
    };
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();
  }

  init(grid: SlickGrid): void {
    const pivot = this._options.pivot ?? grid.getPluginByName<SlickPivot>('Pivot');
    if (!pivot) {
      throw new Error('[SlickPivotDesigner] no pivot plugin, register the SlickPivot plugin with the grid first (or give it in the "pivot" option).');
    }
    const container = typeof this._options.container === 'string' ? document.querySelector<HTMLElement>(this._options.container) : this._options.container;
    if (!container) {
      throw new Error('[SlickPivotDesigner] the designer container was not found.');
    }
    this._grid = grid;
    this._pivot = pivot;
    this.createDesigner(container);
    this._eventHandler
      .subscribe(pivot.onSpecChanged, () => this.followSpec())
      .subscribe(pivot.onPivotModeChanged, () => this.render());
    this._columns = this.readSpec(pivot.getSpec());
    const { resultLayout } = this._options;
    if (resultLayout) {
      // the result looks like an MS Access crosstab: the layout, and the row totals as the only grand total columns
      const design = this.buildSpec();
      pivot.updateSpec({ ...resultLayout, ...design, grandTotals: { ...design.grandTotals, ...resultLayout.grandTotals } });
    }
    this.render();
  }

  /** Remove the designer from its container, leaving the grid and the pivot plugin as they are */
  destroy(): void {
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onDesignChanged.unsubscribe();
    this._designerElm?.remove();
    this._designerElm = undefined;
  }

  getOptions(): PivotDesignerOption {
    return this._options;
  }

  /** The designer element */
  getElement(): HTMLDivElement | undefined {
    return this._designerElm;
  }

  /** The pivot plugin */
  getPivot(): SlickPivot | undefined {
    return this._pivot;
  }

  /** Columns of the design grid */
  getColumns(): PivotDesignColumn[] {
    return this._columns.map((column) => ({ ...column }));
  }

  /** Replace the columns of the design grid and apply them to the spec */
  setColumns(columns: PivotDesignColumn[]): Promise<void> {
    this._columns = columns.map((column) => ({ ...column }));
    return this.apply();
  }

  /** Add a column for a field (at the end, or at an index), with a Total and a Crosstab role that suit the field */
  addColumn(fieldId: string, index = this._columns.length): Promise<void> {
    const numeric = this.isNumeric(fieldId);
    const column: PivotDesignColumn = numeric ? { field: fieldId, total: 'sum', crosstab: 'value' } : { field: fieldId, total: 'groupBy', crosstab: 'row' };
    this._columns.splice(Math.max(0, Math.min(index, this._columns.length)), 0, column);
    return this.apply();
  }

  /** Remove a column of the design grid */
  removeColumn(index: number): Promise<void> {
    this._columns.splice(index, 1);
    return this.apply();
  }

  /** Move a column of the design grid to another index */
  moveColumn(from: number, to: number): Promise<void> {
    if (to < 0 || to >= this._columns.length || from === to) {
      return Promise.resolve();
    }
    const [column] = this._columns.splice(from, 1);
    this._columns.splice(to, 0, column);
    return this.apply();
  }

  /**
   * Change a property of a column, keeping the column valid like MS Access does: a Where column is not shown, a
   * Column Heading groups its items, a Value aggregates them
   */
  updateColumn(index: number, changes: Partial<PivotDesignColumn>): Promise<void> {
    const column = this._columns[index];
    if (!column) {
      return Promise.resolve();
    }
    const previous = { ...column };
    Object.assign(column, changes);
    if ('field' in changes && changes.field !== previous.field) {
      column.value = undefined;
      column.filter = undefined;
      if (!this.getTotals(column.field).includes(column.total) && column.total !== 'groupBy' && column.total !== 'where') {
        column.total = this.getDefaultAggregator(column.field);
      }
    }
    if ('criteria' in changes && changes.criteria !== previous.criteria) {
      column.filter = undefined;
    }
    if ('total' in changes && changes.total !== previous.total) {
      if (column.total === 'where') {
        column.crosstab = 'none';
        column.sort = undefined;
      } else if (column.total === 'groupBy') {
        column.crosstab = column.crosstab === 'value' || previous.total === 'where' ? 'row' : column.crosstab;
      } else {
        column.crosstab = column.crosstab === 'column' || previous.total === 'where' ? 'value' : column.crosstab;
        column.criteria = undefined;
        column.filter = undefined;
        column.sort = undefined;
      }
    }
    if ('crosstab' in changes && changes.crosstab !== previous.crosstab) {
      if (column.crosstab === 'column' && column.total !== 'groupBy') {
        column.total = 'groupBy';
      } else if (column.crosstab === 'value' && (column.total === 'groupBy' || column.total === 'where')) {
        column.total = this.getDefaultAggregator(column.field);
        column.criteria = undefined;
        column.filter = undefined;
        column.sort = undefined;
      } else if (column.crosstab !== 'none' && column.total === 'where') {
        column.total = 'groupBy';
      }
    }
    return this.apply();
  }

  /** Re-render the designer */
  render(): void {
    if (!this._designerElm || !this._pivot) {
      return;
    }
    this._typeCache.clear();
    const pivotMode = this._pivot.isPivotMode();
    if (this._pivotModeCheckbox) {
      this._pivotModeCheckbox.checked = pivotMode;
    }
    this._designerElm.classList.toggle('slick-pivot-designer-off', !pivotMode);
    this._bodyElm!.toggleAttribute('inert', !pivotMode);
    const focus = this.getFocusedControl();
    this.renderFieldList();
    this.renderTable();
    this.renderStatus();
    this.restoreFocus(focus);
  }

  // --
  // spec <-> design columns
  // -----------------

  /** Design columns of a spec: the Row Headings, the Column Headings, the Values and the Where columns of the other filters */
  readSpec(spec: PivotSpec): PivotDesignColumn[] {
    const filters = (spec.filters ?? []).filter((filter) => getFilterCriteria(filter));
    const sortOf = (field: string) => {
      const sort = (spec.sort ?? []).find((item) => item.field === field && !item.by);
      return sort && sort.direction !== 'source' ? sort.direction ?? 'asc' : undefined;
    };
    const used = new Set<PivotFilter>();
    const withFilter = (column: PivotDesignColumn): PivotDesignColumn => {
      const filter = filters.find((item) => item.field === column.field && !used.has(item));
      if (filter) {
        used.add(filter);
        column.filter = filter;
        column.criteria = getFilterCriteria(filter);
      }
      return column;
    };
    const columns: PivotDesignColumn[] = [
      ...spec.rows.filter((field) => field !== PIVOT_VALUES_FIELD).map((field) => withFilter({ field, total: 'groupBy', crosstab: 'row', sort: sortOf(field) })),
      ...spec.columns.filter((field) => field !== PIVOT_VALUES_FIELD).map((field) => withFilter({ field, total: 'groupBy', crosstab: 'column', sort: sortOf(field) })),
      ...spec.values.map((value): PivotDesignColumn => ({ field: value.field, total: value.aggregator, crosstab: value.totalsOnly ? 'row' : value.hidden ? 'none' : 'value', value })),
    ];
    filters.filter((filter) => !used.has(filter)).forEach((filter) => columns.push({ field: filter.field, total: 'where', crosstab: 'none', criteria: getFilterCriteria(filter), filter }));
    return columns;
  }

  /** Spec of the design columns, the filters and sorts that the designer cannot show (predicates, top N, sorts by value) being kept */
  buildSpec(spec: PivotSpec = this._pivot!.getSpec()): Pick<PivotSpec, 'rows' | 'columns' | 'values' | 'filters' | 'sort' | 'grandTotals'> {
    const engine = this._pivot!.getEngine();
    const rows: string[] = [];
    const columns: string[] = [];
    const values: PivotValue[] = [];
    const filters: PivotFilter[] = [];
    const sort: PivotSort[] = [];
    const addFilter = (column: PivotDesignColumn) => {
      const criteria = column.criteria?.trim();
      if (column.filter && getFilterCriteria(column.filter) === criteria) {
        filters.push(column.filter);
      } else if (criteria && this.isValidCriteria(criteria)) {
        filters.push({ field: column.field, criteria });
      }
    };
    this._columns.forEach((column) => {
      if (!engine.getField(column.field)) {
        return;
      }
      if (column.total === 'where') {
        addFilter(column);
      } else if (column.total === 'groupBy') {
        if (column.crosstab === 'row' || column.crosstab === 'column') {
          (column.crosstab === 'row' ? rows : columns).push(column.field);
          if (column.sort) {
            sort.push({ field: column.field, direction: column.sort });
          }
        }
        addFilter(column);
      } else if (column.crosstab === 'value' || column.crosstab === 'row') {
        const totalsOnly = column.crosstab === 'row';
        const same = column.value && column.value.field === column.field && column.value.aggregator === column.total && !!column.value.totalsOnly === totalsOnly;
        const value: PivotValue = same ? { ...column.value! } : { field: column.field, aggregator: column.total };
        if (totalsOnly) {
          value.totalsOnly = true;
          value.label ??= this._options.labels.rowTotalValue(engine.getFieldLabel(column.field));
        } else {
          delete value.totalsOnly;
        }
        values.push(value);
      }
    });
    const valuesIndex = spec.columns.indexOf(PIVOT_VALUES_FIELD);
    if (valuesIndex >= 0) {
      columns.splice(Math.min(valuesIndex, columns.length), 0, PIVOT_VALUES_FIELD);
    }
    const normalizedValues = engine.normalizeSpec({ values }).values;
    const rowTotals = normalizedValues.filter((value) => value.totalsOnly).map((value) => value.id!);
    // the filters and sorts the designer does not show stay as they are
    (spec.filters ?? []).filter((filter) => !getFilterCriteria(filter)).forEach((filter) => filters.push(filter));
    (spec.sort ?? []).filter((item) => item.by).forEach((item) => sort.push(item));
    return {
      rows,
      columns,
      values: normalizedValues,
      filters,
      sort,
      // like MS Access, the row totals are the only grand total columns, after the Row Headings
      grandTotals: { ...spec.grandTotals, columns: rowTotals.length ? (spec.grandTotals?.columns === 'end' ? 'end' : 'start') : false, values: rowTotals.length ? rowTotals : undefined },
    };
  }

  // --
  // protected functions
  // -----------------

  protected apply(): Promise<void> {
    const pivot = this._pivot;
    if (!pivot) {
      return Promise.resolve();
    }
    this.render();
    const spec = this.buildSpec();
    const done = pivot.updateSpec(spec);
    this.onDesignChanged.notify({ columns: this.getColumns(), spec: pivot.getSpec() });
    return done;
  }

  /** Rebuild the design columns from a spec changed elsewhere (the API, a saved layout, …), keeping them when they give that spec */
  protected followSpec(): void {
    const spec = this._pivot!.getSpec();
    if (this.getSpecKey(spec) !== this.getSpecKey({ ...spec, ...this.buildSpec(spec) })) {
      this._columns = this.readSpec(spec);
    }
    this.render();
  }

  /** What the designer shows of a spec */
  protected getSpecKey(spec: PivotSpec): string {
    const grandTotals = spec.grandTotals ?? {};
    return JSON.stringify({
      rows: spec.rows,
      columns: spec.columns.filter((field) => field !== PIVOT_VALUES_FIELD),
      values: spec.values.map((value) => [value.id, value.field, value.aggregator, !!value.totalsOnly, !!value.hidden]),
      filters: (spec.filters ?? []).map((filter) => [filter.field, getFilterCriteria(filter)]),
      sort: (spec.sort ?? []).filter((item) => !item.by).map((item) => [item.field, item.direction ?? 'asc']),
      rowTotals: spec.values.some((value) => value.totalsOnly) ? [grandTotals.columns !== false, grandTotals.values] : [],
    });
  }

  protected isValidCriteria(criteria: string): boolean {
    try {
      PivotEngine.parseCriteria(criteria);
      return true;
    } catch {
      return false;
    }
  }

  protected getFieldType(fieldId: string): PivotFieldType {
    if (!this._typeCache.has(fieldId)) {
      this._typeCache.set(fieldId, this._pivot!.inferFieldType(fieldId));
    }
    return this._typeCache.get(fieldId)!;
  }

  /** Whether the items of a field are quantities: the numbers of a date level (years, months) are not */
  protected isNumeric(fieldId: string): boolean {
    return this.getFieldType(fieldId) === 'number' && !this._pivot!.getEngine().getField(fieldId)?.dateLevel;
  }

  protected getDefaultAggregator(fieldId: string): string {
    return this.isNumeric(fieldId) ? 'sum' : 'count';
  }

  /** Aggregators offered for a field: the ones that suit its type, MS Access ones first */
  protected getTotals(fieldId: string): string[] {
    const engine = this._pivot!.getEngine();
    const numeric = this.isNumeric(fieldId);
    const ids = this._options.totals ?? [...ACCESS_TOTALS, ...engine.getAggregators().map((aggregator) => aggregator.id).filter((id) => !ACCESS_TOTALS.includes(id))];
    return ids.filter((id) => {
      const aggregator = engine.getAggregator(id);
      return !!aggregator && (numeric || !aggregator.numericOnly);
    });
  }

  /** Fields offered in the Field row and in the field list: every field, a date field followed by the levels of its hierarchy */
  protected getFieldIds(): string[] {
    const engine = this._pivot!.getEngine();
    return engine.getFields().flatMap((field) => {
      const levels = this.getFieldType(field.id) === 'date' ? engine.getDateHierarchy(field.id) : [];
      return [field.id, ...levels.map((level) => level.id)];
    });
  }

  protected createDesigner(container: HTMLElement): void {
    const { labels } = this._options;
    this._designerElm = Utils.createDomElement('div', { className: 'slick-pivot-designer', role: 'region', ariaLabel: labels.title }, container);
    const header = Utils.createDomElement('div', { className: 'slick-pivot-designer-header' }, this._designerElm);
    Utils.createDomElement('span', { className: 'slick-pivot-designer-title', textContent: labels.title }, header);
    if (this._options.showPivotModeToggle && this._pivot!.canTogglePivotMode()) {
      const label = Utils.createDomElement('label', { className: 'slick-pivot-mode' }, header);
      const checkbox = Utils.createDomElement('input', { type: 'checkbox', className: 'slick-pivot-mode-checkbox', role: 'switch' }, label);
      Utils.createDomElement('span', { className: 'slick-pivot-mode-label', textContent: labels.pivotMode }, label);
      this._bindingEventService.bind(checkbox, 'change', () => this._pivot!.setPivotMode(checkbox.checked));
      this._pivotModeCheckbox = checkbox;
    }

    this._bodyElm = Utils.createDomElement('div', { className: 'slick-pivot-designer-body' }, this._designerElm);
    if (this._options.showFieldList) {
      const fieldsElm = Utils.createDomElement('div', { className: 'slick-pivot-designer-fields' }, this._bodyElm);
      const titleId = `slick-pivot-designer-fields-${Math.random().toString(36).slice(2, 8)}`;
      Utils.createDomElement('div', { className: 'slick-pivot-designer-fields-title', id: titleId, textContent: labels.fields }, fieldsElm);
      this._fieldListElm = Utils.createDomElement('ul', { className: 'slick-pivot-designer-field-list', role: 'listbox' }, fieldsElm);
      this._fieldListElm.setAttribute('aria-labelledby', titleId);
      this._bindingEventService.bind(this._fieldListElm, 'dblclick', this.handleFieldListDblClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._fieldListElm, 'keydown', this.handleFieldListKeyDown.bind(this) as EventListener);
      this._bindingEventService.bind(this._fieldListElm, 'click', this.handleFieldListClick.bind(this) as EventListener);
      this._bindingEventService.bind(this._fieldListElm, 'dragstart', this.handleDragStart.bind(this) as EventListener);
      this._bindingEventService.bind(this._fieldListElm, 'dragend', () => this.endDrag());
    }
    const scroller = Utils.createDomElement('div', { className: 'slick-pivot-designer-grid-scroller' }, this._bodyElm);
    this._tableElm = Utils.createDomElement('table', { className: 'slick-pivot-designer-grid', ariaLabel: labels.title }, scroller);
    this._bindingEventService.bind(this._tableElm, 'change', this.handleChange.bind(this) as EventListener);
    this._bindingEventService.bind(this._tableElm, 'input', this.handleInput.bind(this) as EventListener);
    this._bindingEventService.bind(this._tableElm, 'click', this.handleClick.bind(this) as EventListener);
    this._bindingEventService.bind(this._tableElm, 'dragover', this.handleDragOver.bind(this) as EventListener);
    this._bindingEventService.bind(this._tableElm, 'dragleave', this.handleDragLeave.bind(this) as EventListener);
    this._bindingEventService.bind(this._tableElm, 'drop', this.handleDrop.bind(this) as EventListener);
    this._statusElm = Utils.createDomElement('div', { className: 'slick-pivot-designer-status', role: 'status' }, this._designerElm);
  }

  protected renderFieldList(): void {
    const listElm = this._fieldListElm;
    if (!listElm) {
      return;
    }
    const engine = this._pivot!.getEngine();
    const fieldIds = this.getFieldIds();
    if (!this._activeField || !fieldIds.includes(this._activeField)) {
      this._activeField = fieldIds[0];
    }
    const used = new Set(this._columns.map((column) => column.field));
    Utils.emptyElement(listElm);
    fieldIds.forEach((fieldId) => {
      const level = !engine.getFields().some((field) => field.id === fieldId);
      const item = Utils.createDomElement('li', {
        className: `slick-pivot-designer-field${level ? ' slick-pivot-designer-field-level' : ''}${used.has(fieldId) ? ' slick-pivot-designer-field-used' : ''}`,
        role: 'option',
        tabIndex: fieldId === this._activeField ? 0 : -1,
        textContent: engine.getFieldLabel(fieldId),
        draggable: true,
        ariaSelected: String(fieldId === this._activeField),
      }, listElm);
      item.dataset.field = fieldId;
    });
  }

  protected renderTable(): void {
    const table = this._tableElm!;
    const { labels } = this._options;
    const engine = this._pivot!.getEngine();
    Utils.emptyElement(table);
    const fieldIds = this.getFieldIds();

    const head = Utils.createDomElement('thead', {}, table);
    const headRow = Utils.createDomElement('tr', {}, head);
    Utils.createDomElement('td', { className: 'slick-pivot-designer-corner' }, headRow);
    this._columns.forEach((column, index) => {
      const fieldLabel = engine.getFieldLabel(column.field);
      const th = Utils.createDomElement('th', { className: 'slick-pivot-designer-column-header', scope: 'col' }, headRow);
      th.dataset.index = String(index);
      Utils.createDomElement('span', { className: 'slick-pivot-designer-column-label', textContent: fieldLabel }, th);
      if (column.crosstab === 'row' && column.total !== 'groupBy' && column.total !== 'where') {
        Utils.createDomElement('span', { className: 'slick-pivot-designer-tag', textContent: labels.rowTotal }, th);
      }
      const actions = Utils.createDomElement('span', { className: 'slick-pivot-designer-column-actions' }, th);
      const button = (action: string, text: string, label: string, disabled: boolean) => {
        const elm = Utils.createDomElement('button', { type: 'button', className: `slick-pivot-designer-${action}`, textContent: text, ariaLabel: `${label} ${fieldLabel}`, title: label, disabled }, actions);
        elm.dataset.action = action;
        elm.dataset.index = String(index);
      };
      button('move-left', '‹', labels.moveLeft, index === 0);
      button('move-right', '›', labels.moveRight, index === this._columns.length - 1);
      button('remove', '×', labels.remove, false);
    });
    Utils.createDomElement('td', { className: 'slick-pivot-designer-column-header slick-pivot-designer-new' }, headRow);

    const body = Utils.createDomElement('tbody', {}, table);
    const addRow = (prop: keyof PivotDesignerLabels['rows'], renderCell: (cell: HTMLTableCellElement, column: PivotDesignColumn, index: number) => void, renderNew?: (cell: HTMLTableCellElement) => void) => {
      const row = Utils.createDomElement('tr', { className: `slick-pivot-designer-row slick-pivot-designer-row-${prop}` }, body);
      Utils.createDomElement('th', { scope: 'row', textContent: labels.rows[prop] }, row);
      this._columns.forEach((column, index) => {
        const cell = Utils.createDomElement('td', {}, row);
        cell.dataset.index = String(index);
        renderCell(cell, column, index);
      });
      const newCell = Utils.createDomElement('td', { className: 'slick-pivot-designer-new' }, row);
      renderNew?.(newCell);
    };
    const ariaLabel = (prop: keyof PivotDesignerLabels['rows'], column?: PivotDesignColumn) => `${labels.rows[prop].replace(/:\s*$/, '')} ${column ? `of ${engine.getFieldLabel(column.field)}` : ''}`.trim();
    const select = (cell: HTMLElement, prop: string, index: number | 'new', choices: Array<[string, string]>, value: string, label: string, disabled = false) => {
      const elm = Utils.createDomElement('select', { className: `slick-pivot-designer-select slick-pivot-designer-select-${prop}`, ariaLabel: label, disabled }, cell);
      elm.dataset.prop = prop;
      elm.dataset.index = String(index);
      choices.forEach(([choice, text]) => Utils.createDomElement('option', { value: choice, textContent: text, selected: choice === value }, elm));
      return elm;
    };
    const fieldChoices = fieldIds.map((id): [string, string] => [id, engine.getFieldLabel(id)]);

    addRow('field', (cell, column, index) => {
      const choices = fieldIds.includes(column.field) ? fieldChoices : [[column.field, column.field] as [string, string], ...fieldChoices];
      select(cell, 'field', index, choices, column.field, ariaLabel('field', column));
    }, (cell) => select(cell, 'field', 'new', [['', labels.addField], ...fieldChoices], '', labels.addField));

    addRow('total', (cell, column, index) => {
      const totals = this.getTotals(column.field);
      if (column.total !== 'groupBy' && column.total !== 'where' && !totals.includes(column.total)) {
        totals.push(column.total);
      }
      const choices: Array<[string, string]> = [
        ['groupBy', labels.groupBy],
        ...totals.map((id): [string, string] => [id, labels.totals[id] ?? engine.getAggregator(id)?.label ?? id]),
        ['where', labels.where],
      ];
      select(cell, 'total', index, choices, column.total, ariaLabel('total', column));
    });

    addRow('crosstab', (cell, column, index) => {
      const choices = (['row', 'column', 'value', 'none'] as PivotDesignerCrosstab[]).map((role): [string, string] => [role, labels.crosstab[role]]);
      select(cell, 'crosstab', index, choices, column.crosstab, ariaLabel('crosstab', column), column.total === 'where');
    });

    addRow('sort', (cell, column, index) => {
      const sortable = column.total === 'groupBy' && (column.crosstab === 'row' || column.crosstab === 'column');
      select(cell, 'sort', index, [['', labels.sort.none], ['asc', labels.sort.asc], ['desc', labels.sort.desc]], sortable ? column.sort ?? '' : '', ariaLabel('sort', column), !sortable);
    });

    addRow('criteria', (cell, column, index) => {
      const filtering = column.total === 'groupBy' || column.total === 'where';
      const input = Utils.createDomElement('input', { type: 'text', className: 'slick-pivot-designer-criteria', ariaLabel: ariaLabel('criteria', column), value: filtering ? column.criteria ?? '' : '', disabled: !filtering, spellcheck: false }, cell);
      input.dataset.prop = 'criteria';
      input.dataset.index = String(index);
      this.validateCriteria(input);
    });
  }

  protected renderStatus(): void {
    if (this._statusElm) {
      this._statusElm.textContent = this._message;
    }
  }

  /** Mark invalid criteria, telling what is wrong in the title of the input */
  protected validateCriteria(input: HTMLInputElement): boolean {
    const criteria = input.value.trim();
    let error = '';
    if (criteria) {
      try {
        PivotEngine.parseCriteria(criteria);
      } catch (e: any) {
        error = String(e.message).replace(/^\[PivotEngine\] /, '');
      }
    }
    input.toggleAttribute('aria-invalid', !!error);
    input.title = error;
    return !error;
  }

  protected getFocusedControl(): { prop: string; index: string; } | undefined {
    const active = document.activeElement as HTMLElement | null;
    if (active && this._tableElm?.contains(active)) {
      return { prop: active.dataset.prop ?? active.dataset.action ?? '', index: active.dataset.index ?? '' };
    }
    return undefined;
  }

  protected restoreFocus(focus?: { prop: string; index: string; }): void {
    if (!focus || !this._tableElm) {
      return;
    }
    const target = this._tableElm.querySelector<HTMLElement>(`[data-prop="${focus.prop}"][data-index="${focus.index}"], [data-action="${focus.prop}"][data-index="${focus.index}"]`)
      ?? this._tableElm.querySelector<HTMLElement>(`[data-prop="${focus.prop}"][data-index="${Math.max(0, this._columns.length - 1)}"]`)
      ?? this._tableElm.querySelector<HTMLElement>('[data-prop="field"][data-index="new"]');
    target?.focus();
  }

  /** Index of the column whose cell an event is on (the number of columns for the new column) */
  protected getEventColumnIndex(e: Event): number | undefined {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('td, th');
    if (!cell || !this._tableElm?.contains(cell)) {
      return undefined;
    }
    if (cell.classList.contains('slick-pivot-designer-new')) {
      return this._columns.length;
    }
    return cell.dataset.index !== undefined ? Number(cell.dataset.index) : undefined;
  }

  protected handleChange(e: Event): void {
    const target = e.target as HTMLSelectElement | HTMLInputElement;
    const prop = target.dataset.prop;
    if (!prop) {
      return;
    }
    if (target.dataset.index === 'new') {
      if (target.value) {
        this._message = '';
        this.addColumn(target.value);
      }
      return;
    }
    const index = Number(target.dataset.index);
    if (prop === 'criteria') {
      const criteria = target.value.trim();
      if (!this.validateCriteria(target as HTMLInputElement)) {
        this._message = `${this.getColumnCaption(index)}: ${target.title}`;
        this._columns[index].criteria = criteria;
        this._columns[index].filter = undefined;
        this.renderStatus();
        return;
      }
      this._message = '';
      this.updateColumn(index, { criteria: criteria || undefined });
    } else if (prop === 'sort') {
      this.updateColumn(index, { sort: (target.value || undefined) as PivotDesignColumn['sort'] });
    } else {
      this.updateColumn(index, { [prop]: target.value });
    }
  }

  protected handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.dataset.prop === 'criteria') {
      this.validateCriteria(target);
    }
  }

  protected handleClick(e: MouseEvent): void {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!button) {
      return;
    }
    const index = Number(button.dataset.index);
    const action = button.dataset.action!;
    if (action === 'remove') {
      this.removeColumn(index);
      // the focus goes to the next column, or to the new column after the last one
      const next = this._tableElm!.querySelector<HTMLElement>(`[data-action="remove"][data-index="${Math.min(index, this._columns.length - 1)}"]`);
      (next ?? this._tableElm!.querySelector<HTMLElement>('[data-prop="field"][data-index="new"]'))?.focus();
    } else {
      const to = index + (action === 'move-left' ? -1 : 1);
      this.moveColumn(index, to);
      // the focus follows the column, on the other button once it reached an edge
      const buttons = Array.from(this._tableElm!.querySelectorAll<HTMLButtonElement>(`button[data-index="${to}"]`));
      (buttons.find((elm) => elm.dataset.action === action && !elm.disabled) ?? buttons.find((elm) => elm.dataset.action !== 'remove' && !elm.disabled))?.focus();
    }
  }

  protected getColumnCaption(index: number): string {
    const column = this._columns[index];
    return column ? this._pivot!.getEngine().getFieldLabel(column.field) : '';
  }

  // --
  // field list
  // -----------------

  protected setActiveField(fieldId: string, focus = true): void {
    this._activeField = fieldId;
    this._fieldListElm?.querySelectorAll<HTMLElement>('.slick-pivot-designer-field').forEach((item) => {
      const active = item.dataset.field === fieldId;
      item.tabIndex = active ? 0 : -1;
      item.setAttribute('aria-selected', String(active));
      if (active && focus) {
        item.focus();
      }
    });
  }

  protected handleFieldListClick(e: MouseEvent): void {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.slick-pivot-designer-field');
    if (item) {
      this.setActiveField(item.dataset.field!);
    }
  }

  /** Double-clicking a field adds a column for it, like in the table of the MS Access query designer */
  protected handleFieldListDblClick(e: MouseEvent): void {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.slick-pivot-designer-field');
    if (item) {
      this.addColumn(item.dataset.field!);
    }
  }

  /** Up and Down (Home and End) move through the fields, Enter or Space adds a column for the active one */
  protected handleFieldListKeyDown(e: KeyboardEvent): void {
    const fieldIds = this.getFieldIds();
    const index = fieldIds.indexOf(this._activeField ?? '');
    let next: number | undefined;
    if (e.key === 'ArrowDown') {
      next = Math.min(fieldIds.length - 1, index + 1);
    } else if (e.key === 'ArrowUp') {
      next = Math.max(0, index - 1);
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = fieldIds.length - 1;
    } else if ((e.key === 'Enter' || e.key === ' ') && this._activeField) {
      e.preventDefault();
      this.addColumn(this._activeField).then(() => this.setActiveField(this._activeField!));
      return;
    }
    if (next !== undefined && fieldIds[next]) {
      e.preventDefault();
      this.setActiveField(fieldIds[next]);
    }
  }

  // --
  // drag & drop of the fields onto the design grid
  // -----------------

  protected handleDragStart(e: DragEvent): void {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.slick-pivot-designer-field');
    if (!item) {
      return;
    }
    this._dragField = item.dataset.field;
    e.dataTransfer?.setData('text/plain', item.dataset.field!);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'copy';
    }
  }

  protected handleDragOver(e: DragEvent): void {
    const index = this.getEventColumnIndex(e);
    if (!this._dragField || index === undefined) {
      return;
    }
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    this.markDropTarget(index);
  }

  protected handleDragLeave(e: DragEvent): void {
    if (!this._tableElm?.contains(e.relatedTarget as Node | null)) {
      this.markDropTarget(undefined);
    }
  }

  /** A field dropped on a column is inserted before it, one dropped on the new column is added at the end */
  protected handleDrop(e: DragEvent): void {
    const index = this.getEventColumnIndex(e);
    const fieldId = this._dragField ?? e.dataTransfer?.getData('text/plain');
    this.endDrag();
    if (index !== undefined && fieldId && this._pivot!.getEngine().getField(fieldId)) {
      e.preventDefault();
      this.addColumn(fieldId, index);
    }
  }

  protected markDropTarget(index?: number): void {
    this._tableElm?.querySelectorAll<HTMLElement>('td, th').forEach((cell) => {
      const cellIndex = cell.classList.contains('slick-pivot-designer-new') ? this._columns.length : cell.dataset.index !== undefined ? Number(cell.dataset.index) : undefined;
      cell.classList.toggle('slick-pivot-designer-drop-target', index !== undefined && cellIndex === index);
    });
  }

  protected endDrag(): void {
    this._dragField = undefined;
    this.markDropTarget(undefined);
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.PivotDesigner = SlickPivotDesigner;
}
