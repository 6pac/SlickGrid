import type {
  PivotArea,
  PivotDateLevel,
  PivotField,
  PivotFieldItem,
  PivotFieldType,
  PivotFilter,
  PivotNumberFormat,
  PivotShowAsType,
  PivotSpec,
  PivotValue,
} from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { PIVOT_VALUES_FIELD as PIVOT_VALUES_FIELD_, PivotEngine as PivotEngine_ } from '../slick.pivotengine.js';
import type { SlickPivot } from '../plugins/slick.pivot.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const PivotEngine = IIFE_ONLY ? Slick.PivotEngine : PivotEngine_;
const PIVOT_VALUES_FIELD = IIFE_ONLY ? Slick.PIVOT_VALUES_FIELD : PIVOT_VALUES_FIELD_;

const AREAS: PivotArea[] = ['filters', 'columns', 'rows', 'values'];

export interface PivotPanelNumberFormatOption {
  /** Unique id of the format */
  id: string;

  /** Caption shown in the Value Field Settings */
  label: string;

  /** Format, undefined for the default ("General") format */
  format?: PivotNumberFormat;
}

export interface PivotPanelOption {
  /** Title of the panel, defaults to "PivotTable Fields" */
  title: string;

  /** Placeholder of the field search box */
  searchPlaceholder: string;

  /** Captions of the four areas */
  areaTitles: Record<PivotArea, string>;

  /** Hint shown in an empty area */
  emptyAreaText: string;

  /** Hint shown above the four areas */
  areasHint: string;

  /** Caption of the pill positioning the value headers, defaults to "Σ Values" */
  valuesPillLabel: string;

  /** Show a close button in the panel header, raising `onClose`, defaults to false */
  showCloseButton: boolean;

  /** Show the "Defer layout update" checkbox, defaults to true */
  showDeferUpdate: boolean;

  /** Initial state of the "Defer layout update" checkbox, defaults to false */
  deferLayoutUpdate: boolean;

  /** Maximum number of items listed by a filter dropdown, defaults to 500 */
  maxFilterItems: number;

  /** Number formats offered by the Value Field Settings */
  numberFormats: PivotPanelNumberFormatOption[];

  /** "Show Values As" choices offered by the Value Field Settings */
  showAsOptions: Array<{ value: PivotShowAsType | ''; label: string; }>;

  /**
   * Aggregators listed under "Summarize Values By" in the menu of a value pill, by default
   * Sum, Count, Average, Max, Min and Distinct Count. Aggregators that do not apply to the
   * field are left out; every aggregator remains available in the Value Field Settings.
   */
  summarizeByAggregators: string[];

  /**
   * Levels added in place of a date field placed in the Rows or Columns area, like the time grouping of
   * Excel, by default years, quarters and months; `false` adds the date itself. The levels of a date
   * field are also listed below it in the field list.
   */
  autoDateGrouping: PivotDateLevel[] | false;

  /** Captions of the date levels in the field list */
  dateLevelLabels: Record<PivotDateLevel, string>;

  /** Aggregator given to a field dropped in the Values area, by default `sum` for numbers and `count` otherwise */
  defaultAggregator?: (field: PivotField, type: PivotFieldType) => string;

  /** Area of a field checked in the field list, by default Values for numbers and Rows otherwise */
  defaultArea?: (field: PivotField, type: PivotFieldType) => PivotArea;
}

/** Item displayed in one of the four areas */
interface AreaItem {
  area: PivotArea;
  field: string;
  label: string;
  valueIndex?: number;
}

interface MenuItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
  /** Radio item: shows a check mark when true */
  checked?: boolean;
  /** Labelled group of items */
  group?: MenuItem[];
}

interface DragState {
  source: HTMLElement;
  startX: number;
  startY: number;
  active: boolean;
  ghost?: HTMLElement;
  marker?: HTMLElement;
  target?: { area: PivotArea; index: number; } | null;
}

/**
 * PivotTable Fields panel, like the one of Excel: a searchable field list and four drop areas
 * (Filters, Columns, Rows and Values). Fields can be checked, dragged between the areas,
 * reordered, filtered and summarized; every drag action is also available from the pill menus
 * and from the keyboard.
 *
 * @example
 * const panel = new SlickPivotPanel(pivot, document.querySelector('#pivotPanel'));
 */
export class SlickPivotPanel {
  // --
  // public API

  /** Raised when the close button is clicked */
  onClose = new SlickEvent<{ panel: SlickPivotPanel; }>('onClose');

  /** Raised when the panel changes the spec (or stores a pending change when the layout update is deferred) */
  onPanelChange = new SlickEvent<{ spec: PivotSpec; deferred: boolean; }>('onPanelChange');

  // --
  // protected props
  protected _container: HTMLElement;
  protected _options: PivotPanelOption;
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _panelElm!: HTMLDivElement;
  protected _searchInput!: HTMLInputElement;
  protected _fieldListElm!: HTMLUListElement;
  protected _areaElms = new Map<PivotArea, HTMLUListElement>();
  protected _deferCheckbox?: HTMLInputElement;
  protected _updateButton?: HTMLButtonElement;
  protected _statusElm!: HTMLDivElement;
  protected _liveElm!: HTMLDivElement;
  protected _pending?: PivotSpec;
  protected _deferred: boolean;
  protected _drag?: DragState;
  protected _menuElm?: HTMLDivElement;
  protected _popupElm?: HTMLElement;
  protected _popupCleanup?: () => void;
  protected _focusAfterRender?: { area: PivotArea; index: number; } | { field: string; };
  protected _typeCache = new Map<string, PivotFieldType>();
  protected _defaults: PivotPanelOption = {
    title: 'PivotTable Fields',
    searchPlaceholder: 'Search fields',
    areaTitles: { filters: 'Filters', columns: 'Columns', rows: 'Rows', values: 'Values' },
    emptyAreaText: 'Drag fields here',
    areasHint: 'Drag fields between areas below:',
    valuesPillLabel: 'Σ Values',
    showCloseButton: false,
    showDeferUpdate: true,
    deferLayoutUpdate: false,
    maxFilterItems: 500,
    numberFormats: [
      { id: 'general', label: 'General' },
      { id: 'number0', label: 'Number (1,234)', format: { maximumFractionDigits: 0 } },
      { id: 'number2', label: 'Number (1,234.56)', format: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
      { id: 'percent', label: 'Percentage (12.34%)', format: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
      { id: 'currency', label: 'Currency ($1,234.56)', format: { style: 'currency', currency: 'USD' } },
    ],
    showAsOptions: [
      { value: '', label: 'No Calculation' },
      { value: 'percentOfGrandTotal', label: '% of Grand Total' },
      { value: 'percentOfColumnTotal', label: '% of Column Total' },
      { value: 'percentOfRowTotal', label: '% of Row Total' },
      { value: 'percentOfParentRowTotal', label: '% of Parent Row Total' },
      { value: 'percentOfParentColumnTotal', label: '% of Parent Column Total' },
      { value: 'differenceFromPrevious', label: 'Difference From (previous)' },
      { value: 'percentDifferenceFromPrevious', label: '% Difference From (previous)' },
      { value: 'runningTotal', label: 'Running Total' },
      { value: 'rankAscending', label: 'Rank Smallest to Largest' },
      { value: 'rankDescending', label: 'Rank Largest to Smallest' },
    ],
    summarizeByAggregators: ['sum', 'count', 'avg', 'max', 'min', 'distinctCount'],
    autoDateGrouping: ['year', 'quarter', 'month'],
    dateLevelLabels: { year: 'Years', quarter: 'Quarters', month: 'Months', day: 'Days' },
  };

  constructor(protected readonly pivot: SlickPivot, containerOrSelector: HTMLElement | string, options?: Partial<PivotPanelOption>) {
    const container = typeof containerOrSelector === 'string' ? document.querySelector<HTMLElement>(containerOrSelector) : containerOrSelector;
    if (!container) {
      throw new Error('[SlickPivotPanel] the panel container was not found.');
    }
    this._container = container;
    this._options = Utils.extend(true, {}, this._defaults, options);
    // a list replaces the default one: the deep merge is by index, so a shorter list would keep the end of the default one
    if (options?.numberFormats) {
      this._options.numberFormats = options.numberFormats;
    }
    if (options?.showAsOptions) {
      this._options.showAsOptions = options.showAsOptions;
    }
    if (options?.summarizeByAggregators) {
      this._options.summarizeByAggregators = options.summarizeByAggregators;
    }
    if (options?.autoDateGrouping) {
      this._options.autoDateGrouping = options.autoDateGrouping;
    }
    this._deferred = this._options.deferLayoutUpdate;
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();
    this.init();
  }

  protected init(): void {
    this.createSkeleton();
    this._eventHandler
      .subscribe(this.pivot.onSpecChanged, () => {
        if (!this._pending) {
          this.render();
        }
      })
      .subscribe(this.pivot.onPivotChanged, () => this.renderStatus())
      .subscribe(this.pivot.onLoadingChanged, (_e, args) => this._panelElm.classList.toggle('slick-pivot-panel-busy', args.loading));
    this.render();
  }

  /** Destroy the panel and empty its container */
  destroy(): void {
    this.cancelDrag();
    this.closeMenu();
    this.closePopup();
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onClose.unsubscribe();
    this.onPanelChange.unsubscribe();
    this._panelElm?.remove();
  }

  getOptions(): PivotPanelOption {
    return this._options;
  }

  /** Spec displayed by the panel: the pending one when the layout update is deferred */
  getSpec(): PivotSpec {
    return this._pending ?? this.pivot.getSpec();
  }

  /** Whether changes are deferred until `applyPendingChanges()` (the Update button) */
  isDeferred(): boolean {
    return this._deferred;
  }

  /** Defer (or stop deferring, which applies the pending changes) the layout updates */
  setDeferred(deferred: boolean): void {
    this._deferred = deferred;
    if (this._deferCheckbox) {
      this._deferCheckbox.checked = deferred;
    }
    if (!deferred) {
      this.applyPendingChanges();
    }
    this.renderFooter();
  }

  /** Apply the deferred changes */
  applyPendingChanges(): Promise<void> {
    const pending = this._pending;
    this._pending = undefined;
    this.renderFooter();
    return pending ? this.pivot.setSpec(pending) : Promise.resolve();
  }

  /** Re-render the field list and the areas */
  render(): void {
    this._typeCache.clear();
    this.renderFieldList();
    this.renderAreas();
    this.renderFooter();
    this.renderStatus();
    this.restoreFocus();
  }

  // --
  // spec operations (also used by the menus and the keyboard)
  // -----------------

  /** Items displayed in an area */
  getAreaItems(area: PivotArea, spec = this.getSpec()): AreaItem[] {
    const engine = this.pivot.getEngine();
    switch (area) {
      case 'filters':
        return this.getFilterAreaFields(spec).map((field) => ({ area, field, label: engine.getFieldLabel(field) }));
      case 'rows':
        return spec.rows.filter((field) => field !== PIVOT_VALUES_FIELD).map((field) => ({ area, field, label: engine.getFieldLabel(field) }));
      case 'columns':
        return this.getColumnTokens(spec).map((field) => ({ area, field, label: field === PIVOT_VALUES_FIELD ? this._options.valuesPillLabel : engine.getFieldLabel(field) }));
      case 'values':
        return spec.values.map((value, valueIndex) => ({ area, field: value.field, label: engine.getValueLabel(value), valueIndex }));
    }
  }

  /** Add a field to an area (at the end, or at an index) */
  addField(fieldId: string, area: PivotArea, index?: number): void {
    if (!this.canDrop(fieldId, area)) {
      return;
    }
    const spec = this.cloneSpec(this.getSpec());
    let focusIndex = index;
    if (area === 'values') {
      const value: PivotValue = { field: fieldId, aggregator: this.getDefaultAggregator(fieldId) };
      spec.values.splice(index ?? spec.values.length, 0, value);
      // let the engine give the new value a unique id
      spec.values = this.pivot.getEngine().normalizeSpec({ values: spec.values }).values;
    } else {
      // a date placed on the rows or the columns is grouped by its levels, like Excel does
      const grouping = this._options.autoDateGrouping;
      const levels = (area === 'rows' || area === 'columns') && grouping ? this.getDateLevels(fieldId).filter((level) => grouping.includes(level.dateLevel!.level)) : [];
      const ids = levels.length ? levels.map((level) => level.id) : [fieldId];
      ids.forEach((id, i) => {
        this.removeFieldFromAxes(spec, id, area !== 'filters');
        this.insertInArea(spec, area, id, index === undefined ? undefined : index + i);
      });
      if (index !== undefined) {
        focusIndex = index + ids.length - 1;
      }
    }
    this.commit(spec, { area, index: focusIndex ?? this.getAreaItems(area, spec).length - 1 }, `${this.pivot.getEngine().getFieldLabel(fieldId)} added to ${this._options.areaTitles[area]}`);
  }

  /** Move an item of an area to another position (in the same or another area) */
  moveItem(from: { area: PivotArea; index: number; }, to: { area: PivotArea; index: number; }): void {
    const spec = this.cloneSpec(this.getSpec());
    const item = this.getAreaItems(from.area, spec)[from.index];
    if (!item) {
      return;
    }
    if (item.field === PIVOT_VALUES_FIELD && to.area !== 'columns') {
      return;
    }
    if (from.area !== to.area && !this.canDrop(item.field, to.area)) {
      return;
    }

    if (from.area === to.area) {
      const tokens = this.getAreaTokens(spec, from.area);
      const [moved] = tokens.splice(from.index, 1);
      const index = Math.max(0, Math.min(to.index, tokens.length));
      tokens.splice(index, 0, moved);
      this.setAreaTokens(spec, from.area, tokens);
      this.commit(spec, { area: to.area, index }, `${item.label} moved to position ${index + 1} of ${tokens.length}`);
      return;
    }

    // remove from the source area
    let movedValue: PivotValue | undefined;
    if (from.area === 'values') {
      [movedValue] = spec.values.splice(from.index, 1);
    } else {
      this.removeFieldFromAxes(spec, item.field, to.area === 'values' || from.area === 'filters' ? true : false);
      if (from.area === 'filters' || to.area === 'values') {
        spec.filters = (spec.filters ?? []).filter((filter) => filter.field !== item.field);
      }
    }

    // add to the target area
    if (to.area === 'values') {
      spec.values.splice(to.index, 0, movedValue ?? { field: item.field, aggregator: this.getDefaultAggregator(item.field) });
      spec.values = this.pivot.getEngine().normalizeSpec({ values: spec.values }).values;
    } else {
      this.removeFieldFromAxes(spec, item.field, to.area !== 'filters');
      this.insertInArea(spec, to.area, item.field, to.index);
    }
    const index = Math.min(to.index, this.getAreaItems(to.area, spec).length - 1);
    this.commit(spec, { area: to.area, index }, `${this.pivot.getEngine().getFieldLabel(item.field)} moved to ${this._options.areaTitles[to.area]}, position ${index + 1}`);
  }

  /** Remove an item from an area */
  removeItem(area: PivotArea, index: number): void {
    const spec = this.cloneSpec(this.getSpec());
    const item = this.getAreaItems(area, spec)[index];
    if (!item || item.field === PIVOT_VALUES_FIELD) {
      return;
    }
    if (area === 'values') {
      spec.values.splice(index, 1);
    } else {
      this.removeFieldFromAxes(spec, item.field, true);
      spec.filters = (spec.filters ?? []).filter((filter) => filter.field !== item.field);
      spec.sort = (spec.sort ?? []).filter((sort) => sort.field !== item.field);
    }
    const remaining = this.getAreaItems(area, spec).length;
    this.commit(spec, remaining ? { area, index: Math.min(index, remaining - 1) } : { field: item.field }, `${item.label} removed from ${this._options.areaTitles[area]}`);
  }

  /** Remove a field, and the levels of its date hierarchy, from every area */
  removeField(fieldId: string): void {
    const spec = this.cloneSpec(this.getSpec());
    const ids = new Set([fieldId, ...this.getDateLevels(fieldId).map((level) => level.id)]);
    ids.forEach((id) => this.removeFieldFromAxes(spec, id, true));
    spec.values = spec.values.filter((value) => !ids.has(value.field));
    spec.filters = (spec.filters ?? []).filter((filter) => !ids.has(filter.field));
    spec.sort = (spec.sort ?? []).filter((sort) => !ids.has(sort.field));
    this.commit(spec, { field: fieldId }, `${this.pivot.getEngine().getFieldLabel(fieldId)} removed`);
  }

  /**
   * Replace a value (Value Field Settings). A value without an id gets its default id, and the
   * sorts and top filters that referred to the previous id follow it.
   */
  updateValue(index: number, value: PivotValue): void {
    const engine = this.pivot.getEngine();
    const spec = this.cloneSpec(this.getSpec());
    const previousId = spec.values[index]?.id;
    const usedIds = new Set(spec.values.filter((_value, i) => i !== index).map((other) => other.id));
    const baseId = value.id ?? engine.getDefaultValueId(value);
    let id = baseId;
    for (let suffix = 2; usedIds.has(id); suffix++) {
      id = `${baseId}:${suffix}`;
    }
    spec.values[index] = { ...value, id };
    if (previousId && previousId !== id) {
      spec.sort = spec.sort?.map((sort) => (sort.by?.valueId === previousId ? { ...sort, by: { ...sort.by, valueId: id } } : sort));
      spec.filters = spec.filters?.map((filter) => (filter.top?.valueId === previousId ? { ...filter, top: { ...filter.top, valueId: id } } : filter));
    }
    this.commit(spec, { area: 'values', index }, `${engine.getValueLabel(spec.values[index])} updated`);
  }

  /** Change the aggregator of a value; an automatic caption and id follow the new aggregator */
  setValueAggregator(index: number, aggregator: string): void {
    const value = this.getSpec().values[index];
    if (value && value.aggregator !== aggregator) {
      const label = value.label === this.pivot.getEngine().getValueLabel({ ...value, label: undefined }) ? undefined : value.label;
      this.updateValue(index, { ...value, aggregator, label, id: this.isAutomaticValueId(value) ? undefined : value.id });
    }
  }

  /** Replace (or remove, when undefined) the item filter of a field */
  setFieldFilter(fieldId: string, filter?: Omit<PivotFilter, 'field'>): void {
    const spec = this.cloneSpec(this.getSpec());
    const inFiltersArea = this.getFilterAreaFields(spec).includes(fieldId);
    const filters = spec.filters ?? [];
    const index = filters.findIndex((item) => item.field === fieldId && !item.top && !item.predicate && !item.label);
    const others = filters.filter((_item, i) => i !== index);
    const entry: PivotFilter | undefined = filter && (filter.include || filter.exclude) ? { field: fieldId, ...filter } : inFiltersArea ? { field: fieldId } : undefined;
    if (entry) {
      others.splice(index >= 0 ? index : others.length, 0, entry);
    }
    spec.filters = others;
    this.commit(spec, undefined, `${this.pivot.getEngine().getFieldLabel(fieldId)} filter ${entry?.include || entry?.exclude ? 'applied' : 'cleared'}`);
  }

  /** Sort the items of a row or column field by caption */
  setFieldSort(fieldId: string, direction: 'asc' | 'desc'): void {
    const spec = this.cloneSpec(this.getSpec());
    spec.sort = [...(spec.sort ?? []).filter((sort) => sort.field !== fieldId), { field: fieldId, direction }];
    this.commit(spec, undefined, `${this.pivot.getEngine().getFieldLabel(fieldId)} sorted ${direction === 'asc' ? 'A to Z' : 'Z to A'}`);
  }

  /** Whether a field may be placed in an area */
  canDrop(fieldId: string, area: PivotArea): boolean {
    if (fieldId === PIVOT_VALUES_FIELD) {
      return area === 'columns';
    }
    const field = this.pivot.getEngine().getField(fieldId);
    if (!field) {
      return false;
    }
    if (field.allowedAreas && !field.allowedAreas.includes(area)) {
      return false;
    }
    if (area === 'values') {
      const aggregators = this.getAggregatorChoices(fieldId);
      return aggregators.length > 0;
    }
    return true;
  }

  // --
  // protected spec helpers
  // -----------------

  protected cloneSpec(spec: PivotSpec): PivotSpec {
    return {
      ...spec,
      rows: [...spec.rows],
      columns: [...spec.columns],
      values: spec.values.map((value) => ({ ...value })),
      filters: [...(spec.filters ?? [])],
      sort: [...(spec.sort ?? [])],
    };
  }

  /** Fields shown in the Filters area: filtered fields that are neither row nor column fields */
  protected getFilterAreaFields(spec: PivotSpec): string[] {
    const axes = new Set([...spec.rows, ...spec.columns]);
    const fields: string[] = [];
    (spec.filters ?? []).forEach((filter) => {
      if (!axes.has(filter.field) && !fields.includes(filter.field) && !filter.predicate) {
        fields.push(filter.field);
      }
    });
    return fields;
  }

  /** Column tokens as displayed: the values pill only shows when there are 2 values or more */
  protected getColumnTokens(spec: PivotSpec): string[] {
    const tokens = spec.columns.filter((field) => field !== PIVOT_VALUES_FIELD);
    if (spec.values.length > 1) {
      const position = spec.columns.indexOf(PIVOT_VALUES_FIELD);
      tokens.splice(position >= 0 ? spec.columns.slice(0, position).filter((field) => field !== PIVOT_VALUES_FIELD).length : tokens.length, 0, PIVOT_VALUES_FIELD);
    }
    return tokens;
  }

  protected getAreaTokens(spec: PivotSpec, area: PivotArea): any[] {
    switch (area) {
      case 'filters':
        return this.getFilterAreaFields(spec);
      case 'rows':
        return spec.rows.filter((field) => field !== PIVOT_VALUES_FIELD);
      case 'columns':
        return this.getColumnTokens(spec);
      case 'values':
        return [...spec.values];
    }
  }

  protected setAreaTokens(spec: PivotSpec, area: PivotArea, tokens: any[]): void {
    switch (area) {
      case 'filters': {
        // keep the filters of the row & column fields, reorder the Filters area ones
        const filters = spec.filters ?? [];
        const areaFilters = tokens.flatMap((field: string) => filters.filter((filter) => filter.field === field));
        spec.filters = [...filters.filter((filter) => !tokens.includes(filter.field)), ...areaFilters];
        break;
      }
      case 'rows':
        spec.rows = tokens;
        break;
      case 'columns':
        if (spec.values.length > 1 || !spec.columns.includes(PIVOT_VALUES_FIELD)) {
          spec.columns = tokens;
        } else {
          // the hidden values token keeps its position
          const position = spec.columns.indexOf(PIVOT_VALUES_FIELD);
          spec.columns = [...tokens];
          spec.columns.splice(Math.min(position, spec.columns.length), 0, PIVOT_VALUES_FIELD);
        }
        break;
      case 'values':
        spec.values = tokens;
        break;
    }
  }

  /** Remove a field from the rows and columns, and optionally from the Filters area */
  protected removeFieldFromAxes(spec: PivotSpec, fieldId: string, removeFilterAreaEntry: boolean): void {
    const wasInFiltersArea = this.getFilterAreaFields(spec).includes(fieldId);
    spec.rows = spec.rows.filter((field) => field !== fieldId);
    spec.columns = spec.columns.filter((field) => field !== fieldId);
    if (removeFilterAreaEntry && wasInFiltersArea) {
      // an "(All)" entry only exists to show the field in the Filters area
      spec.filters = (spec.filters ?? []).filter((filter) => filter.field !== fieldId || !!(filter.include || filter.exclude));
    }
  }

  protected insertInArea(spec: PivotSpec, area: PivotArea, fieldId: string, index?: number): void {
    if (area === 'filters') {
      if (!(spec.filters ?? []).some((filter) => filter.field === fieldId)) {
        spec.filters = [...(spec.filters ?? []), { field: fieldId }];
      }
      const tokens = this.getFilterAreaFields(spec).filter((field) => field !== fieldId);
      tokens.splice(index ?? tokens.length, 0, fieldId);
      this.setAreaTokens(spec, 'filters', tokens);
      return;
    }
    const tokens = this.getAreaTokens(spec, area).filter((field: string) => field !== fieldId);
    tokens.splice(Math.min(index ?? tokens.length, tokens.length), 0, fieldId);
    this.setAreaTokens(spec, area, tokens);
  }

  protected getFieldType(fieldId: string): PivotFieldType {
    let type = this._typeCache.get(fieldId);
    if (!type) {
      type = this.pivot.inferFieldType(fieldId);
      this._typeCache.set(fieldId, type);
    }
    return type;
  }

  /** Level fields of the date hierarchy of a date field, empty for any other field */
  protected getDateLevels(fieldId: string): PivotField[] {
    const engine = this.pivot.getEngine();
    return engine.getField(fieldId)?.dateLevel || this.getFieldType(fieldId) !== 'date' ? [] : engine.getDateHierarchy(fieldId);
  }

  protected getAggregatorChoices(fieldId: string) {
    // the numbers of a date level (years, months) are items, not quantities
    const numeric = this.getFieldType(fieldId) === 'number' && !this.pivot.getEngine().getField(fieldId)?.dateLevel;
    return this.pivot.getEngine().getAggregators().filter((aggregator) => numeric || !aggregator.numericOnly);
  }

  /** Whether the id of a value is its default id (possibly made unique with a ":2" suffix) */
  protected isAutomaticValueId(value: PivotValue): boolean {
    const defaultId = this.pivot.getEngine().getDefaultValueId(value);
    return !value.id || value.id === defaultId || (value.id.startsWith(`${defaultId}:`) && /^\d+$/.test(value.id.slice(defaultId.length + 1)));
  }

  protected getDefaultAggregator(fieldId: string): string {
    const field = this.pivot.getEngine().getField(fieldId)!;
    const type = this.getFieldType(fieldId);
    return this._options.defaultAggregator?.(field, type) ?? (type === 'number' && !field.dateLevel ? 'sum' : 'count');
  }

  protected getDefaultArea(fieldId: string): PivotArea {
    const field = this.pivot.getEngine().getField(fieldId)!;
    const type = this.getFieldType(fieldId);
    const preferred = this._options.defaultArea?.(field, type) ?? (type === 'number' && !field.dateLevel ? 'values' : 'rows');
    if (this.canDrop(fieldId, preferred)) {
      return preferred;
    }
    return (['rows', 'columns', 'values', 'filters'] as PivotArea[]).find((area) => this.canDrop(fieldId, area)) ?? preferred;
  }

  protected isFieldUsed(fieldId: string, spec = this.getSpec(), withDateLevels = true): boolean {
    const used = spec.rows.includes(fieldId) || spec.columns.includes(fieldId) || spec.values.some((value) => value.field === fieldId) || this.getFilterAreaFields(spec).includes(fieldId);
    // a date field grouped by its levels is in use too
    return used || (withDateLevels && this.getDateLevels(fieldId).some((level) => this.isFieldUsed(level.id, spec, false)));
  }

  protected getItemFilter(fieldId: string, spec = this.getSpec()): PivotFilter | undefined {
    return (spec.filters ?? []).find((filter) => filter.field === fieldId && (filter.include || filter.exclude));
  }

  /** Apply (or store, when deferred) a new spec */
  protected commit(spec: PivotSpec, focus: { area: PivotArea; index: number; } | { field: string; } | undefined, announcement: string): void {
    this._focusAfterRender = focus;
    if (this._deferred) {
      this._pending = this.pivot.getEngine().normalizeSpec(spec);
      this.render();
    } else {
      this._pending = undefined;
      this.pivot.setSpec(spec);
      // the pivot raises onSpecChanged, which re-renders the panel
    }
    this.announce(announcement);
    this.onPanelChange.notify({ spec: this.getSpec(), deferred: this._deferred });
  }

  protected announce(message: string): void {
    if (this._liveElm) {
      this._liveElm.textContent = '';
      // let assistive technologies notice the change of text
      setTimeout(() => (this._liveElm.textContent = message), 20);
    }
  }

  // --
  // rendering
  // -----------------

  protected createSkeleton(): void {
    const options = this._options;
    this._panelElm = Utils.createDomElement('div', { className: 'slick-pivot-panel', role: 'region', ariaLabel: options.title }, this._container);

    const header = Utils.createDomElement('div', { className: 'slick-pivot-panel-header' }, this._panelElm);
    Utils.createDomElement('span', { className: 'slick-pivot-panel-title', textContent: options.title }, header);
    if (options.showCloseButton) {
      const closeButton = Utils.createDomElement('button', { className: 'slick-pivot-panel-close', type: 'button', ariaLabel: `Close ${options.title}`, textContent: '×' }, header);
      this._bindingEventService.bind(closeButton, 'click', () => this.onClose.notify({ panel: this }));
    }

    const search = Utils.createDomElement('div', { className: 'slick-pivot-panel-search' }, this._panelElm);
    this._searchInput = Utils.createDomElement('input', { className: 'slick-pivot-search-input', type: 'search', placeholder: options.searchPlaceholder, ariaLabel: options.searchPlaceholder }, search);
    this._bindingEventService.bind(this._searchInput, 'input', () => this.renderFieldList());

    this._fieldListElm = Utils.createDomElement('ul', { className: 'slick-pivot-field-list', ariaLabel: 'Fields' }, this._panelElm);
    Utils.createDomElement('div', { className: 'slick-pivot-areas-hint', textContent: options.areasHint }, this._panelElm);

    const areasElm = Utils.createDomElement('div', { className: 'slick-pivot-areas' }, this._panelElm);
    AREAS.forEach((area) => {
      const section = Utils.createDomElement('section', { className: `slick-pivot-area slick-pivot-area-${area}` }, areasElm);
      section.dataset.area = area;
      const titleId = `slick-pivot-${area}-title-${Math.random().toString(36).slice(2, 8)}`;
      const title = Utils.createDomElement('div', { className: 'slick-pivot-area-title', id: titleId }, section);
      Utils.createDomElement('span', { className: `slick-pivot-area-icon slick-pivot-area-icon-${area}`, ariaHidden: 'true' }, title);
      Utils.createDomElement('span', { textContent: options.areaTitles[area] }, title);
      const list = Utils.createDomElement('ul', { className: 'slick-pivot-area-list', role: 'listbox' }, section);
      list.setAttribute('aria-labelledby', titleId);
      list.dataset.area = area;
      this._areaElms.set(area, list);
    });

    const footer = Utils.createDomElement('div', { className: 'slick-pivot-panel-footer' }, this._panelElm);
    if (options.showDeferUpdate) {
      const label = Utils.createDomElement('label', { className: 'slick-pivot-defer' }, footer);
      this._deferCheckbox = Utils.createDomElement('input', { type: 'checkbox', className: 'slick-pivot-defer-checkbox', checked: this._deferred }, label);
      Utils.createDomElement('span', { textContent: 'Defer layout update' }, label);
      this._updateButton = Utils.createDomElement('button', { className: 'slick-pivot-update-button', type: 'button', textContent: 'Update' }, footer);
      this._bindingEventService.bind(this._deferCheckbox, 'change', () => this.setDeferred(this._deferCheckbox!.checked));
      this._bindingEventService.bind(this._updateButton, 'click', () => this.applyPendingChanges());
    }
    this._statusElm = Utils.createDomElement('div', { className: 'slick-pivot-panel-status' }, this._panelElm);
    this._liveElm = Utils.createDomElement('div', { className: 'slick-pivot-live', ariaLive: 'polite' }, this._panelElm);

    this._bindingEventService.bind(this._panelElm, 'pointerdown', this.handlePointerDown.bind(this) as EventListener);
    this._bindingEventService.bind(this._panelElm, 'click', this.handleClick.bind(this) as EventListener);
    this._bindingEventService.bind(this._panelElm, 'change', this.handleChange.bind(this) as EventListener);
    this._bindingEventService.bind(this._panelElm, 'keydown', this.handleKeyDown.bind(this) as EventListener);
  }

  protected renderFieldList(): void {
    const engine = this.pivot.getEngine();
    const spec = this.getSpec();
    const search = this._searchInput.value.trim().toLowerCase();
    const matches = (fieldId: string) => !search || engine.getFieldLabel(fieldId).toLowerCase().includes(search);
    const fields = engine.getFields().filter((field) => matches(field.id) || this.getDateLevels(field.id).some((level) => matches(level.id)));
    Utils.emptyElement(this._fieldListElm);
    let lastGroup: string | undefined;
    const renderItem = (field: PivotField, label: string, isDateLevel = false) => {
      const used = this.isFieldUsed(field.id, spec);
      const type = this.getFieldType(field.id);
      const item = Utils.createDomElement('li', { className: joinClasses('slick-pivot-field', isDateLevel && 'slick-pivot-field-level', used && 'slick-pivot-field-used') }, this._fieldListElm);
      item.dataset.field = field.id;
      const checkboxLabel = Utils.createDomElement('label', { className: 'slick-pivot-field-label' }, item);
      const checkbox = Utils.createDomElement('input', { type: 'checkbox', className: 'slick-pivot-field-checkbox', checked: used }, checkboxLabel);
      if (isDateLevel) {
        // the level alone on screen, the full caption ("Years (Order Date)") for assistive technologies
        checkbox.setAttribute('aria-label', engine.getFieldLabel(field.id));
      }
      Utils.createDomElement('span', { className: 'slick-pivot-field-name', textContent: label }, checkboxLabel);
      if (this.getItemFilter(field.id, spec)) {
        Utils.createDomElement('span', { className: 'slick-pivot-filtered-icon', title: 'Filtered', ariaLabel: 'Filtered' }, item);
      }
      if (!isDateLevel) {
        Utils.createDomElement('span', { className: `slick-pivot-field-type slick-pivot-field-type-${type}`, textContent: { number: '123', string: 'abc', date: 'date', boolean: 'y/n' }[type], ariaHidden: 'true' }, item);
      }
      Utils.createDomElement('button', { className: 'slick-pivot-field-menu-button', type: 'button', ariaLabel: `${engine.getFieldLabel(field.id)} options`, ariaHasPopup: 'menu', textContent: '⋮' }, item);
    };
    fields.forEach((field) => {
      if (field.group && field.group !== lastGroup) {
        Utils.createDomElement('li', { className: 'slick-pivot-field-group', textContent: field.group }, this._fieldListElm);
      }
      lastGroup = field.group;
      renderItem(field, engine.getFieldLabel(field.id));
      // the levels of a date hierarchy are listed below their date field
      this.getDateLevels(field.id)
        .filter((level) => matches(field.id) || matches(level.id))
        .forEach((level) => renderItem(level, this._options.dateLevelLabels[level.dateLevel!.level], true));
    });
    if (!fields.length) {
      Utils.createDomElement('li', { className: 'slick-pivot-field-empty', textContent: 'No matching fields' }, this._fieldListElm);
    }
  }

  protected renderAreas(): void {
    const spec = this.getSpec();
    AREAS.forEach((area) => {
      const list = this._areaElms.get(area)!;
      Utils.emptyElement(list);
      const items = this.getAreaItems(area, spec);
      if (!items.length) {
        Utils.createDomElement('li', { className: 'slick-pivot-area-empty', textContent: this._options.emptyAreaText, ariaHidden: 'true' }, list);
      }
      items.forEach((item, index) => {
        const isValuesPill = item.field === PIVOT_VALUES_FIELD;
        const pill = Utils.createDomElement('li', {
          className: joinClasses('slick-pivot-pill', isValuesPill && 'slick-pivot-pill-values', area === 'values' && spec.values[index]?.hidden && 'slick-pivot-pill-hidden'),
          role: 'option',
          tabIndex: 0,
          ariaLabel: `${item.label}, ${this._options.areaTitles[area]}, ${index + 1} of ${items.length}`,
        }, list);
        pill.dataset.area = area;
        pill.dataset.index = String(index);
        pill.dataset.field = item.field;
        Utils.createDomElement('span', { className: 'slick-pivot-pill-grip', ariaHidden: 'true' }, pill);
        Utils.createDomElement('span', { className: 'slick-pivot-pill-label', textContent: item.label, title: item.label }, pill);
        if (area === 'filters') {
          Utils.createDomElement('span', { className: 'slick-pivot-pill-summary', textContent: this.getFilterSummary(item.field, spec) }, pill);
        }
        if (area !== 'values' && !isValuesPill && this.getItemFilter(item.field, spec)) {
          Utils.createDomElement('span', { className: 'slick-pivot-filtered-icon', title: 'Filtered', ariaLabel: 'Filtered' }, pill);
        }
        Utils.createDomElement('button', { className: 'slick-pivot-pill-menu-button', type: 'button', tabIndex: -1, ariaLabel: `${item.label} options`, ariaHasPopup: 'menu', textContent: '▾' }, pill);
      });
    });
  }

  protected getFilterSummary(fieldId: string, spec: PivotSpec): string {
    const filter = this.getItemFilter(fieldId, spec);
    if (!filter) {
      return '(All)';
    }
    if (filter.include?.length === 1) {
      return this.pivot.getEngine().formatItem(fieldId, filter.include[0], this.pivot.getOptions().blankLabel);
    }
    return '(Multiple Items)';
  }

  protected renderFooter(): void {
    if (this._updateButton) {
      this._updateButton.disabled = !this._pending;
      this._updateButton.classList.toggle('slick-pivot-update-pending', !!this._pending);
    }
    this._panelElm.classList.toggle('slick-pivot-panel-deferred', this._deferred);
  }

  protected renderStatus(): void {
    const result = this.pivot.getResult();
    const messages: string[] = [];
    if (this._pending) {
      messages.push('Changes are pending, press Update to apply them.');
    }
    if (result?.truncated) {
      messages.push(`Only the first ${result.truncated.maxColumns} of ${result.truncated.columns} columns are shown. Filter the column fields or move them to the rows.`);
    }
    this._statusElm.textContent = messages.join(' ');
    this._statusElm.classList.toggle('slick-pivot-panel-status-visible', messages.length > 0);
  }

  protected restoreFocus(): void {
    const focus = this._focusAfterRender;
    this._focusAfterRender = undefined;
    if (!focus || !this._panelElm.contains(document.activeElement) && document.activeElement !== document.body) {
      return;
    }
    let target: HTMLElement | null = null;
    if ('area' in focus) {
      target = this._areaElms.get(focus.area)?.querySelector<HTMLElement>(`.slick-pivot-pill[data-index="${focus.index}"]`) ?? null;
    } else {
      target = this._fieldListElm.querySelector<HTMLElement>(`.slick-pivot-field[data-field="${CSS.escape(focus.field)}"] .slick-pivot-field-checkbox`);
    }
    target?.focus();
  }

  // --
  // events
  // -----------------

  protected getPillPosition(pill: HTMLElement): { area: PivotArea; index: number; } {
    return { area: pill.dataset.area as PivotArea, index: Number(pill.dataset.index) };
  }

  protected handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains('slick-pivot-field-checkbox')) {
      const fieldId = target.closest<HTMLElement>('.slick-pivot-field')!.dataset.field!;
      if (target.checked) {
        this.addField(fieldId, this.getDefaultArea(fieldId));
        this._focusAfterRender = { field: fieldId };
      } else {
        this.removeField(fieldId);
      }
    }
  }

  protected handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const pillButton = target.closest<HTMLElement>('.slick-pivot-pill-menu-button');
    if (pillButton) {
      this.openPillMenu(pillButton.closest<HTMLElement>('.slick-pivot-pill')!, pillButton);
      return;
    }
    const fieldButton = target.closest<HTMLElement>('.slick-pivot-field-menu-button');
    if (fieldButton) {
      this.openFieldMenu(fieldButton.closest<HTMLElement>('.slick-pivot-field')!.dataset.field!, fieldButton);
    }
  }

  protected handleKeyDown(e: KeyboardEvent): void {
    const pill = (e.target as HTMLElement).closest<HTMLElement>('.slick-pivot-pill');
    if (!pill || e.target !== pill) {
      return;
    }
    const { area, index } = this.getPillPosition(pill);
    const count = this.getAreaItems(area).length;
    const areaIndex = AREAS.indexOf(area);
    let handled = true;
    if (e.altKey && e.key === 'ArrowUp') {
      index > 0 && this.moveItem({ area, index }, { area, index: index - 1 });
    } else if (e.altKey && e.key === 'ArrowDown') {
      index < count - 1 && this.moveItem({ area, index }, { area, index: index + 1 });
    } else if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const step = e.key === 'ArrowLeft' ? -1 : 1;
      for (let i = areaIndex + step; i >= 0 && i < AREAS.length; i += step) {
        if (this.canDrop(pill.dataset.field!, AREAS[i])) {
          this.moveItem({ area, index }, { area: AREAS[i], index: this.getAreaItems(AREAS[i]).length });
          break;
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const sibling = (e.key === 'ArrowUp' ? pill.previousElementSibling : pill.nextElementSibling) as HTMLElement | null;
      sibling?.classList.contains('slick-pivot-pill') && sibling.focus();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      this.removeItem(area, index);
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      this.openPillMenu(pill, pill.querySelector<HTMLElement>('.slick-pivot-pill-menu-button') ?? pill);
    } else {
      handled = false;
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // --
  // drag & drop (pointer events, so it works the same with a mouse, a pen or a touch screen)
  // -----------------

  protected handlePointerDown(e: PointerEvent): void {
    const target = e.target as HTMLElement;
    if (e.button !== 0 || target.closest('button, input, select, textarea')) {
      return;
    }
    const source = target.closest<HTMLElement>('.slick-pivot-pill, .slick-pivot-field');
    if (!source) {
      return;
    }
    this._drag = { source, startX: e.clientX, startY: e.clientY, active: false };
    this._bindingEventService.bind(document, 'pointermove', this.handlePointerMove as EventListener, undefined, 'pivot-drag');
    this._bindingEventService.bind(document, 'pointerup', this.handlePointerUp as EventListener, undefined, 'pivot-drag');
    this._bindingEventService.bind(document, 'pointercancel', this.cancelDragHandler as EventListener, undefined, 'pivot-drag');
    this._bindingEventService.bind(document, 'keydown', this.handleDragKeyDown as EventListener, undefined, 'pivot-drag');
  }

  protected handlePointerMove = (e: PointerEvent): void => {
    const drag = this._drag;
    if (!drag) {
      return;
    }
    if (!drag.active) {
      if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) < 5) {
        return;
      }
      this.startDrag(drag);
    }
    e.preventDefault();
    drag.ghost!.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 6}px)`;
    this.updateDropTarget(drag, e.clientX, e.clientY);
  };

  protected handlePointerUp = (e: PointerEvent): void => {
    const drag = this._drag;
    if (!drag) {
      return;
    }
    if (drag.active) {
      this.updateDropTarget(drag, e.clientX, e.clientY);
      const target = drag.target;
      const fieldId = drag.source.dataset.field!;
      const isPill = drag.source.classList.contains('slick-pivot-pill');
      this.endDrag();
      if (target) {
        if (isPill) {
          const from = this.getPillPosition(drag.source);
          // the target index was computed without the dragged pill
          this.moveItem(from, target);
        } else {
          this.addField(fieldId, target.area, target.index);
        }
      } else if (target === null && isPill) {
        // dropped outside of the areas: remove it, like Excel
        const from = this.getPillPosition(drag.source);
        this.removeItem(from.area, from.index);
      }
    } else {
      this.endDrag();
    }
  };

  protected cancelDragHandler = (): void => this.cancelDrag();

  protected handleDragKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.cancelDrag();
    }
  };

  protected startDrag(drag: DragState): void {
    drag.active = true;
    const label = drag.source.querySelector('.slick-pivot-pill-label, .slick-pivot-field-name')?.textContent ?? '';
    drag.ghost = Utils.createDomElement('div', { className: 'slick-pivot-drag-ghost', textContent: label }, document.body);
    drag.marker = Utils.createDomElement('li', { className: 'slick-pivot-drop-marker', ariaHidden: 'true' });
    drag.source.classList.add('slick-pivot-dragging');
    this._panelElm.classList.add('slick-pivot-panel-dragging');
    document.body.classList.add('slick-pivot-body-dragging');
    AREAS.forEach((area) => this._areaElms.get(area)!.parentElement!.classList.toggle('slick-pivot-area-disallowed', !this.canDrop(drag.source.dataset.field!, area)));
  }

  /** Find the area and index under the pointer; `null` means outside of every area and of the field list */
  protected updateDropTarget(drag: DragState, x: number, y: number): void {
    const element = document.elementFromPoint(x, y) as HTMLElement | null;
    const areaElm = element?.closest<HTMLElement>('.slick-pivot-area');
    this._areaElms.forEach((list) => list.parentElement!.classList.remove('slick-pivot-area-over'));
    drag.marker!.remove();

    if (!areaElm || !this._panelElm.contains(areaElm)) {
      const overPanel = !!element && this._panelElm.contains(element) && !element.closest('.slick-pivot-field-list');
      drag.target = overPanel ? undefined : null;
      return;
    }
    const area = areaElm.dataset.area as PivotArea;
    if (!this.canDrop(drag.source.dataset.field!, area)) {
      drag.target = undefined;
      return;
    }
    const list = this._areaElms.get(area)!;
    const pills = Array.from(list.querySelectorAll<HTMLElement>('.slick-pivot-pill')).filter((pill) => pill !== drag.source);
    let index = pills.findIndex((pill) => {
      const rect = pill.getBoundingClientRect();
      return y < rect.top + rect.height / 2;
    });
    if (index < 0) {
      index = pills.length;
    }
    list.insertBefore(drag.marker!, pills[index] ?? null);
    areaElm.classList.add('slick-pivot-area-over');
    drag.target = { area, index };
  }

  protected endDrag(): void {
    const drag = this._drag;
    this._drag = undefined;
    this._bindingEventService.unbindAll('pivot-drag');
    if (drag) {
      drag.ghost?.remove();
      drag.marker?.remove();
      drag.source.classList.remove('slick-pivot-dragging');
    }
    this._panelElm.classList.remove('slick-pivot-panel-dragging');
    document.body.classList.remove('slick-pivot-body-dragging');
    this._areaElms.forEach((list) => list.parentElement!.classList.remove('slick-pivot-area-over', 'slick-pivot-area-disallowed'));
  }

  protected cancelDrag(): void {
    if (this._drag) {
      this.endDrag();
    }
  }

  // --
  // menus
  // -----------------

  protected openFieldMenu(fieldId: string, anchor: HTMLElement): void {
    const titles = this._options.areaTitles;
    this.openMenu(anchor, AREAS.map((area) => ({
      label: `Add to ${titles[area]}`,
      disabled: !this.canDrop(fieldId, area) || (area !== 'values' && this.getAreaItems(area).some((item) => item.field === fieldId)),
      action: () => this.addField(fieldId, area),
    })));
  }

  protected openPillMenu(pill: HTMLElement, anchor: HTMLElement): void {
    const { area, index } = this.getPillPosition(pill);
    const fieldId = pill.dataset.field!;
    const count = this.getAreaItems(area).length;
    const titles = this._options.areaTitles;
    const isValuesPill = fieldId === PIVOT_VALUES_FIELD;
    const items: MenuItem[] = [
      { label: 'Move Up', disabled: index === 0, action: () => this.moveItem({ area, index }, { area, index: index - 1 }) },
      { label: 'Move Down', disabled: index >= count - 1, action: () => this.moveItem({ area, index }, { area, index: index + 1 }) },
      { label: 'Move to Beginning', disabled: index === 0, action: () => this.moveItem({ area, index }, { area, index: 0 }) },
      { label: 'Move to End', disabled: index >= count - 1, action: () => this.moveItem({ area, index }, { area, index: count - 1 }) },
    ];
    if (!isValuesPill) {
      items.push({ label: '', separator: true });
      AREAS.filter((other) => other !== area).forEach((other) => {
        items.push({ label: `Move to ${titles[other]}`, disabled: !this.canDrop(fieldId, other), action: () => this.moveItem({ area, index }, { area: other, index: this.getAreaItems(other).length }) });
      });
      items.push({ label: '', separator: true }, { label: 'Remove Field', action: () => this.removeItem(area, index) });
      items.push({ label: '', separator: true });
      if (area === 'values') {
        items.push({ label: 'Summarize Values By', group: this.getSummarizeByItems(index) });
        items.push({ label: '', separator: true }, { label: 'Value Field Settings…', action: () => this.openValueSettings(index, pill) });
      } else {
        items.push({ label: 'Filter…', action: () => this.openFilterPopup(fieldId, pill) });
        if (area !== 'filters') {
          items.push({ label: 'Sort A to Z', action: () => this.setFieldSort(fieldId, 'asc') });
          items.push({ label: 'Sort Z to A', action: () => this.setFieldSort(fieldId, 'desc') });
        }
      }
    }
    this.openMenu(anchor, items, pill);
  }

  /** Radio items of the "Summarize Values By" group of a value pill, the current aggregator checked */
  protected getSummarizeByItems(index: number): MenuItem[] {
    const value = this.getSpec().values[index];
    const choices = this.getAggregatorChoices(value.field);
    const listed = this._options.summarizeByAggregators
      .map((id) => choices.find((aggregator) => aggregator.id === id))
      .filter((aggregator) => !!aggregator);
    if (!listed.some((aggregator) => aggregator.id === value.aggregator)) {
      // an aggregator chosen in the Value Field Settings is listed too, checked
      const current = choices.find((aggregator) => aggregator.id === value.aggregator);
      current && listed.push(current);
    }
    return listed.map((aggregator) => ({ label: aggregator.label, checked: aggregator.id === value.aggregator, action: () => this.setValueAggregator(index, aggregator.id) }));
  }

  protected openMenu(anchor: HTMLElement, items: MenuItem[], focusReturn: HTMLElement = anchor): void {
    this.closeMenu();
    this.closePopup();
    const menu = Utils.createDomElement('div', { className: 'slick-pivot-menu', role: 'menu' }, this._panelElm);
    const renderItem = (item: MenuItem, parent: HTMLElement) => {
      if (item.separator) {
        Utils.createDomElement('div', { className: 'slick-pivot-menu-separator', role: 'separator' }, parent);
        return;
      }
      if (item.group) {
        const headingId = `slick-pivot-menu-group-${Math.random().toString(36).slice(2, 8)}`;
        const group = Utils.createDomElement('div', { className: 'slick-pivot-menu-group', role: 'group' }, parent);
        group.setAttribute('aria-labelledby', headingId);
        Utils.createDomElement('div', { className: 'slick-pivot-menu-heading', id: headingId, textContent: item.label }, group);
        item.group.forEach((child) => renderItem(child, group));
        return;
      }
      const isRadio = item.checked !== undefined;
      const button = Utils.createDomElement('button', { className: 'slick-pivot-menu-item', type: 'button', role: isRadio ? 'menuitemradio' : 'menuitem', textContent: item.label, disabled: !!item.disabled, tabIndex: -1 }, parent);
      if (isRadio) {
        button.setAttribute('aria-checked', String(item.checked));
      }
      button.addEventListener('click', () => {
        this.closeMenu();
        item.action?.();
      });
    };
    items.forEach((item) => renderItem(item, menu));
    this.positionFloating(menu, anchor);
    this._menuElm = menu;

    const buttons = () => Array.from(menu.querySelectorAll<HTMLButtonElement>('.slick-pivot-menu-item:not(:disabled)'));
    menu.addEventListener('keydown', (e) => {
      const list = buttons();
      const current = list.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const step = e.key === 'ArrowDown' ? 1 : -1;
        list[(current + step + list.length) % list.length]?.focus();
      } else if (e.key === 'Home') {
        list[0]?.focus();
      } else if (e.key === 'End') {
        list[list.length - 1]?.focus();
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        this.closeMenu();
        focusReturn.focus();
      } else {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    });
    buttons()[0]?.focus();
    this.bindOutsideClose(menu, () => this.closeMenu());
  }

  protected closeMenu(): void {
    this._menuElm?.remove();
    this._menuElm = undefined;
  }

  protected closePopup(): void {
    this._popupCleanup?.();
    this._popupCleanup = undefined;
    this._popupElm?.remove();
    this._popupElm = undefined;
  }

  protected bindOutsideClose(element: HTMLElement, close: () => void): void {
    const onPointerDown = (e: PointerEvent) => {
      if (!element.contains(e.target as Node)) {
        document.removeEventListener('pointerdown', onPointerDown, true);
        close();
      }
    };
    // wait for the click that opened it to finish
    setTimeout(() => document.addEventListener('pointerdown', onPointerDown, true));
    const previousCleanup = this._popupCleanup;
    this._popupCleanup = () => {
      previousCleanup?.();
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }

  protected positionFloating(element: HTMLElement, anchor: HTMLElement): void {
    const panelRect = this._panelElm.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    // open above the anchor when it does not fit below and there is more room above
    const spaceBelow = panelRect.bottom - anchorRect.bottom;
    const spaceAbove = anchorRect.top - panelRect.top;
    const top = element.offsetHeight > spaceBelow && spaceAbove > spaceBelow
      ? Math.max(0, anchorRect.top - panelRect.top - element.offsetHeight - 2)
      : anchorRect.bottom - panelRect.top + 2;
    element.style.top = `${top + this._panelElm.scrollTop}px`;
    const left = Math.max(4, Math.min(anchorRect.left - panelRect.left, panelRect.width - element.offsetWidth - 4));
    element.style.left = `${left}px`;
  }

  // --
  // value field settings & filter popups
  // -----------------

  protected openValueSettings(index: number, focusReturn: HTMLElement): void {
    this.closePopup();
    const engine = this.pivot.getEngine();
    const value = this.getSpec().values[index];
    if (!value) {
      return;
    }
    const titleId = `slick-pivot-dialog-title-${Math.random().toString(36).slice(2, 8)}`;
    const backdrop = Utils.createDomElement('div', { className: 'slick-pivot-dialog-backdrop' }, this._panelElm);
    const dialog = Utils.createDomElement('div', { className: 'slick-pivot-dialog slick-pivot-value-settings', role: 'dialog' }, backdrop);
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', titleId);
    Utils.createDomElement('div', { className: 'slick-pivot-dialog-title', id: titleId, textContent: 'Value Field Settings' }, dialog);
    Utils.createDomElement('div', { className: 'slick-pivot-dialog-source', textContent: `Source: ${engine.getFieldLabel(value.field)}` }, dialog);

    const field = (labelText: string, control: HTMLElement) => {
      const wrapper = Utils.createDomElement('label', { className: 'slick-pivot-dialog-field' }, dialog);
      Utils.createDomElement('span', { textContent: labelText }, wrapper);
      wrapper.appendChild(control);
      return control;
    };
    const autoLabel = (aggregator: string) => engine.getValueLabel({ field: value.field, aggregator });
    const nameInput = field('Custom Name', Utils.createDomElement('input', { type: 'text', className: 'slick-pivot-value-name', value: value.label ?? autoLabel(value.aggregator) })) as HTMLInputElement;
    const aggregatorSelect = field('Summarize value field by', Utils.createDomElement('select', { className: 'slick-pivot-value-aggregator' })) as HTMLSelectElement;
    this.getAggregatorChoices(value.field).forEach((aggregator) => Utils.createDomElement('option', { value: aggregator.id, textContent: aggregator.label, selected: aggregator.id === value.aggregator }, aggregatorSelect));
    const showAsSelect = field('Show values as', Utils.createDomElement('select', { className: 'slick-pivot-value-show-as' })) as HTMLSelectElement;
    const currentShowAs = typeof value.showAs === 'string' ? value.showAs : value.showAs?.type ?? '';
    this._options.showAsOptions.forEach((option) => Utils.createDomElement('option', { value: option.value, textContent: option.label, selected: option.value === currentShowAs }, showAsSelect));
    const formatSelect = field('Number format', Utils.createDomElement('select', { className: 'slick-pivot-value-format' })) as HTMLSelectElement;
    const currentFormat = JSON.stringify(value.numberFormat ?? null);
    const numberFormats = [...this._options.numberFormats];
    if (!numberFormats.some((option) => JSON.stringify(option.format ?? null) === currentFormat)) {
      // keep a format set by code, which the list does not offer
      numberFormats.push({ id: '__current', label: 'Custom', format: value.numberFormat });
    }
    numberFormats.forEach((option) => Utils.createDomElement('option', { value: option.id, textContent: option.label, selected: JSON.stringify(option.format ?? null) === currentFormat }, formatSelect));

    // keep the automatic caption in sync with the aggregator until the user types a custom one
    let previousAuto = autoLabel(value.aggregator);
    aggregatorSelect.addEventListener('change', () => {
      if (nameInput.value === previousAuto) {
        nameInput.value = autoLabel(aggregatorSelect.value);
      }
      previousAuto = autoLabel(aggregatorSelect.value);
    });

    const buttons = Utils.createDomElement('div', { className: 'slick-pivot-dialog-buttons' }, dialog);
    const okButton = Utils.createDomElement('button', { type: 'button', className: 'slick-pivot-dialog-ok', textContent: 'OK' }, buttons);
    const cancelButton = Utils.createDomElement('button', { type: 'button', className: 'slick-pivot-dialog-cancel', textContent: 'Cancel' }, buttons);

    const close = () => {
      this.closePopup();
      focusReturn.isConnected ? focusReturn.focus() : this._areaElms.get('values')?.querySelector<HTMLElement>(`.slick-pivot-pill[data-index="${index}"]`)?.focus();
    };
    const apply = () => {
      const aggregator = aggregatorSelect.value;
      const name = nameInput.value.trim();
      const format = numberFormats.find((option) => option.id === formatSelect.value)?.format;
      const updated: PivotValue = { ...value, aggregator, label: name && name !== autoLabel(aggregator) ? name : undefined, showAs: (showAsSelect.value || undefined) as PivotShowAsType | undefined, numberFormat: format };
      if (this.isAutomaticValueId(value)) {
        // follow the aggregator in the default id
        updated.id = undefined;
      }
      this.closePopup();
      this.updateValue(index, updated);
    };
    okButton.addEventListener('click', apply);
    cancelButton.addEventListener('click', close);
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      } else if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
        e.preventDefault();
        apply();
      } else if (e.key === 'Tab') {
        // keep the focus inside of the dialog
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>('input, select, button'));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    this._popupElm = backdrop;
    nameInput.focus();
    nameInput.select();
  }

  protected async openFilterPopup(fieldId: string, anchor: HTMLElement): Promise<void> {
    this.closePopup();
    const engine = this.pivot.getEngine();
    const label = engine.getFieldLabel(fieldId);
    const titleId = `slick-pivot-filter-title-${Math.random().toString(36).slice(2, 8)}`;
    const popup = Utils.createDomElement('div', { className: 'slick-pivot-filter-popup', role: 'dialog' }, this._panelElm);
    popup.setAttribute('aria-labelledby', titleId);
    Utils.createDomElement('div', { className: 'slick-pivot-dialog-title', id: titleId, textContent: `Filter ${label}` }, popup);
    const searchInput = Utils.createDomElement('input', { type: 'search', className: 'slick-pivot-filter-search', placeholder: 'Search', ariaLabel: `Search ${label} items` }, popup);
    const listElm = Utils.createDomElement('ul', { className: 'slick-pivot-filter-list', ariaLabel: `${label} items` }, popup);
    const noteElm = Utils.createDomElement('div', { className: 'slick-pivot-filter-note' }, popup);
    const buttons = Utils.createDomElement('div', { className: 'slick-pivot-dialog-buttons' }, popup);
    const okButton = Utils.createDomElement('button', { type: 'button', className: 'slick-pivot-dialog-ok', textContent: 'OK' }, buttons);
    const clearButton = Utils.createDomElement('button', { type: 'button', className: 'slick-pivot-filter-clear', textContent: 'Clear Filter' }, buttons);
    const cancelButton = Utils.createDomElement('button', { type: 'button', className: 'slick-pivot-dialog-cancel', textContent: 'Cancel' }, buttons);
    this._popupElm = popup;
    this.positionFloating(popup, anchor);
    this.bindOutsideClose(popup, () => this.closePopup());

    const items: PivotFieldItem[] = await this.pivot.getFieldItems(fieldId);
    if (this._popupElm !== popup) {
      return;
    }
    const filter = this.getItemFilter(fieldId);
    const keyOf = (value: any) => PivotEngine.getNodeKey([value]);
    const include = filter?.include ? new Set(filter.include.map(keyOf)) : undefined;
    const exclude = filter?.exclude ? new Set(filter.exclude.map(keyOf)) : undefined;
    const checked = new Map<string, boolean>(items.map((item) => {
      const key = keyOf(item.value);
      return [key, include ? include.has(key) : !exclude?.has(key)];
    }));

    const renderItems = () => {
      Utils.emptyElement(listElm);
      const search = searchInput.value.trim().toLowerCase();
      const visible = items.filter((item) => !search || item.label.toLowerCase().includes(search));
      const shown = visible.slice(0, this._options.maxFilterItems);
      const allLabel = Utils.createDomElement('label', { className: 'slick-pivot-filter-item slick-pivot-filter-all' }, Utils.createDomElement('li', {}, listElm));
      const allChecked = shown.every((item) => checked.get(keyOf(item.value)));
      const allCheckbox = Utils.createDomElement('input', { type: 'checkbox', checked: allChecked }, allLabel);
      allCheckbox.indeterminate = !allChecked && shown.some((item) => checked.get(keyOf(item.value)));
      Utils.createDomElement('span', { textContent: search ? '(Select All Search Results)' : '(Select All)' }, allLabel);
      allCheckbox.addEventListener('change', () => {
        shown.forEach((item) => checked.set(keyOf(item.value), allCheckbox.checked));
        renderItems();
      });
      shown.forEach((item) => {
        const itemLabel = Utils.createDomElement('label', { className: 'slick-pivot-filter-item' }, Utils.createDomElement('li', {}, listElm));
        const checkbox = Utils.createDomElement('input', { type: 'checkbox', checked: !!checked.get(keyOf(item.value)) }, itemLabel);
        checkbox.dataset.key = keyOf(item.value);
        Utils.createDomElement('span', { textContent: item.label }, itemLabel);
        Utils.createDomElement('span', { className: 'slick-pivot-filter-count', textContent: String(item.count) }, itemLabel);
        checkbox.addEventListener('change', () => {
          checked.set(keyOf(item.value), checkbox.checked);
          const all = shown.every((shownItem) => checked.get(keyOf(shownItem.value)));
          allCheckbox.checked = all;
          allCheckbox.indeterminate = !all && shown.some((shownItem) => checked.get(keyOf(shownItem.value)));
        });
      });
      noteElm.textContent = visible.length > shown.length ? `Showing ${shown.length} of ${visible.length} items, search to narrow the list.` : '';
    };
    renderItems();
    searchInput.addEventListener('input', renderItems);

    const close = () => {
      this.closePopup();
      anchor.isConnected && anchor.focus();
    };
    okButton.addEventListener('click', () => {
      const selected = items.filter((item) => checked.get(keyOf(item.value))).map((item) => item.value);
      const unselected = items.filter((item) => !checked.get(keyOf(item.value))).map((item) => item.value);
      this.closePopup();
      if (!unselected.length) {
        this.setFieldFilter(fieldId);
      } else if (unselected.length <= selected.length) {
        this.setFieldFilter(fieldId, { exclude: unselected });
      } else {
        this.setFieldFilter(fieldId, { include: selected });
      }
    });
    clearButton.addEventListener('click', () => {
      this.closePopup();
      this.setFieldFilter(fieldId);
    });
    cancelButton.addEventListener('click', close);
    popup.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    });
    searchInput.focus();
  }
}

function joinClasses(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.PivotPanel = SlickPivotPanel;
}
