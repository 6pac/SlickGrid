import type {
  Aggregator,
  PivotAggregator,
  PivotAggregatorContext,
  PivotField,
  PivotFieldItem,
  PivotFieldType,
  PivotFilter,
  PivotHeaderNode,
  PivotResult,
  PivotResultValue,
  PivotShowAs,
  PivotSort,
  PivotSpec,
  PivotValue,
} from './models/index.js';

/** Token used in `PivotSpec.columns` to position the value headers among the column fields */
export const PIVOT_VALUES_FIELD = '$values';

/** Key of a blank item (null, undefined, empty string or NaN) */
const BLANK_KEY = '\u0000blank';

type NormalizedKey = string | number | boolean;

/** Node of a header tree while it is being built */
interface BuilderNode {
  value: any;
  normalized: NormalizedKey;
  tokens: NormalizedKey[];
  key: string;
  level: number;
  fieldId?: string;
  children: Map<NormalizedKey, BuilderNode>;
  count: number;
  firstIndex: number;
  parent?: BuilderNode;
  cells?: Map<BuilderNode, CellState>;
}

interface CellState {
  count: number;
  states: any[];
}

interface ValueDefinition {
  value: PivotValue & { id: string; };
  aggregator: PivotAggregator;
  getter: (row: any) => any;
  context: PivotAggregatorContext;
}

export interface PivotExecuteOptions {
  /** Caption of blank items, defaults to "(blank)" */
  blankLabel?: string;

  /** Caption of the grand total nodes, defaults to "Grand Total" */
  grandTotalLabel?: string;
}

export interface PivotEngineOption {
  /** Field definitions */
  fields?: PivotField[];

  /** Custom aggregators keyed by id, added to (or replacing) the built-in ones */
  aggregators?: Record<string, PivotAggregator>;
}

// --
// helpers
// -----------------

/** Whether a value is a Date, including one created in another window or frame */
function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]';
}

function isBlank(value: any): boolean {
  return value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value));
}

function toNumber(value: any): number | null {
  if (typeof value === 'number') {
    return isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return isFinite(num) ? num : null;
  }
  return null;
}

/** Comparable form of a min/max candidate: numbers, numeric strings and dates */
function toComparable(value: any): number | null {
  if (isDate(value)) {
    const time = value.getTime();
    return isNaN(time) ? null : time;
  }
  return toNumber(value);
}

/**
 * Normalizes an item value into a Map key: blanks share one key, dates are keyed by their time
 * and numbers stay numbers, so that `1` and `"1"` remain two different items.
 */
function normalizeKey(value: any): NormalizedKey {
  if (isBlank(value)) {
    return BLANK_KEY;
  }
  if (isDate(value)) {
    const time = value.getTime();
    return isNaN(time) ? BLANK_KEY : `\u0000d:${time}`;
  }
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  return String(value);
}

function compareNatural(a: any, b: any): number {
  const aBlank = isBlank(a);
  const bBlank = isBlank(b);
  if (aBlank || bBlank) {
    return aBlank === bBlank ? 0 : aBlank ? 1 : -1;
  }
  if (isDate(a) || isDate(b)) {
    return (toComparable(a) ?? 0) - (toComparable(b) ?? 0);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'number' || typeof b === 'number') {
    // numbers sort before text
    return typeof a === 'number' ? -1 : 1;
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? 1 : -1;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function compareNullableNumbers(a: any, b: any, direction: number): number {
  const aNull = a === null || a === undefined || (typeof a === 'number' && isNaN(a));
  const bNull = b === null || b === undefined || (typeof b === 'number' && isNaN(b));
  if (aNull || bNull) {
    // empty values always go last, whatever the direction
    return aNull === bNull ? 0 : aNull ? 1 : -1;
  }
  return compareNatural(a, b) * direction;
}

function getNow(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// --
// built-in aggregators
// -----------------

function createWelfordAggregator(id: string, label: string, compute: (n: number, m2: number) => number | null): PivotAggregator<{ n: number; mean: number; m2: number; }> {
  return {
    id,
    label,
    numericOnly: true,
    init: () => ({ n: 0, mean: 0, m2: 0 }),
    accumulate: (state, value) => {
      const num = toNumber(value);
      if (num !== null) {
        state.n++;
        const delta = num - state.mean;
        state.mean += delta / state.n;
        state.m2 += delta * (num - state.mean);
      }
      return state;
    },
    result: (state) => compute(state.n, state.m2),
  };
}

const builtInAggregators: PivotAggregator[] = [
  {
    id: 'sum',
    label: 'Sum',
    numericOnly: true,
    init: () => ({ sum: 0 }),
    accumulate: (state: { sum: number; }, value: any) => {
      const num = toNumber(value);
      if (num !== null) {
        state.sum += num;
      }
      return state;
    },
    result: (state: { sum: number; }) => state.sum,
  },
  {
    id: 'count',
    label: 'Count',
    init: () => 0,
    accumulate: (count: number, value: any) => (isBlank(value) ? count : count + 1),
    result: (count: number) => count,
  },
  {
    id: 'countNumbers',
    label: 'Count Numbers',
    init: () => 0,
    accumulate: (count: number, value: any) => (toNumber(value) === null ? count : count + 1),
    result: (count: number) => count,
  },
  {
    id: 'distinctCount',
    label: 'Distinct Count',
    init: () => new Set<NormalizedKey>(),
    accumulate: (set: Set<NormalizedKey>, value: any) => {
      if (!isBlank(value)) {
        set.add(normalizeKey(value));
      }
      return set;
    },
    result: (set: Set<NormalizedKey>) => set.size,
  },
  {
    id: 'avg',
    label: 'Average',
    numericOnly: true,
    init: () => ({ sum: 0, n: 0 }),
    accumulate: (state: { sum: number; n: number; }, value: any) => {
      const num = toNumber(value);
      if (num !== null) {
        state.sum += num;
        state.n++;
      }
      return state;
    },
    result: (state: { sum: number; n: number; }) => (state.n ? state.sum / state.n : null),
  },
  {
    id: 'max',
    label: 'Max',
    resultType: 'same',
    init: () => ({ value: null, comparable: null }),
    accumulate: (state: { value: any; comparable: number | null; }, value: any) => {
      const comparable = toComparable(value);
      if (comparable !== null && (state.comparable === null || comparable > state.comparable)) {
        state.comparable = comparable;
        state.value = isDate(value) ? value : comparable;
      }
      return state;
    },
    result: (state: { value: any; }) => state.value,
  },
  {
    id: 'min',
    label: 'Min',
    resultType: 'same',
    init: () => ({ value: null, comparable: null }),
    accumulate: (state: { value: any; comparable: number | null; }, value: any) => {
      const comparable = toComparable(value);
      if (comparable !== null && (state.comparable === null || comparable < state.comparable)) {
        state.comparable = comparable;
        state.value = isDate(value) ? value : comparable;
      }
      return state;
    },
    result: (state: { value: any; }) => state.value,
  },
  {
    id: 'product',
    label: 'Product',
    numericOnly: true,
    init: () => ({ product: 1, n: 0 }),
    accumulate: (state: { product: number; n: number; }, value: any) => {
      const num = toNumber(value);
      if (num !== null) {
        state.product *= num;
        state.n++;
      }
      return state;
    },
    result: (state: { product: number; n: number; }) => (state.n ? state.product : null),
  },
  createWelfordAggregator('stdDev', 'StdDev', (n, m2) => (n > 1 ? Math.sqrt(m2 / (n - 1)) : null)),
  createWelfordAggregator('stdDevP', 'StdDevP', (n, m2) => (n > 0 ? Math.sqrt(m2 / n) : null)),
  createWelfordAggregator('var', 'Var', (n, m2) => (n > 1 ? m2 / (n - 1) : null)),
  createWelfordAggregator('varP', 'VarP', (n, m2) => (n > 0 ? m2 / n : null)),
  {
    id: 'median',
    label: 'Median',
    numericOnly: true,
    init: () => [] as number[],
    accumulate: (list: number[], value: any) => {
      const num = toNumber(value);
      if (num !== null) {
        list.push(num);
      }
      return list;
    },
    result: (list: number[]) => {
      if (!list.length) {
        return null;
      }
      const sorted = list.slice().sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    },
  },
  {
    id: 'first',
    label: 'First',
    resultType: 'same',
    init: () => ({ found: false, value: null }),
    accumulate: (state: { found: boolean; value: any; }, value: any) => {
      if (!state.found && !isBlank(value)) {
        state.found = true;
        state.value = value;
      }
      return state;
    },
    result: (state: { value: any; }) => state.value,
  },
  {
    id: 'last',
    label: 'Last',
    resultType: 'same',
    init: () => ({ value: null }),
    accumulate: (state: { value: any; }, value: any) => {
      if (!isBlank(value)) {
        state.value = value;
      }
      return state;
    },
    result: (state: { value: any; }) => state.value,
  },
];

/** Built-in pivot aggregators and adapters for custom aggregation functions */
export const PivotAggregators = {
  /** All built-in aggregators, in the order shown by the field list */
  builtIn: builtInAggregators,

  /** Get a built-in aggregator by id */
  get(id: string): PivotAggregator | undefined {
    return builtInAggregators.find((aggregator) => aggregator.id === id);
  },

  /**
   * Wrap a reducer function, as used by the original pivot example, into a pivot aggregator.
   * The reducer receives the source row, the current cell value and the source property of the value field,
   * and returns the new cell value.
   */
  fromReducer<R = any>(
    id: string,
    label: string,
    reducer: (row: any, currentValue: R | undefined, sourceField: string) => R,
    options?: Partial<Pick<PivotAggregator, 'numericOnly' | 'resultType'>>
  ): PivotAggregator<{ value: R | undefined; }, R | undefined> {
    return {
      id,
      label,
      ...options,
      init: () => ({ value: undefined }),
      accumulate: (state, _value, row, context) => {
        state.value = reducer(row, state.value, context.sourceField);
        return state;
      },
      result: (state) => state.value,
    };
  },

  /**
   * Wrap a DataView aggregator class (such as `Aggregators.Sum` or a custom one) into a pivot aggregator.
   * DataView aggregators read the source property directly, so they cannot aggregate derived fields.
   */
  fromDataViewAggregator(
    id: string,
    label: string,
    AggregatorClass: new (field: number | string) => Aggregator,
    options?: Partial<Pick<PivotAggregator, 'numericOnly' | 'resultType'>>
  ): PivotAggregator<{ rows: any[]; field?: string; }> {
    return {
      id,
      label,
      ...options,
      init: () => ({ rows: [] }),
      accumulate: (state, _value, row, context) => {
        state.field = context.sourceField;
        state.rows.push(row);
        return state;
      },
      result: (state) => {
        if (!state.rows.length || state.field === undefined) {
          return null;
        }
        const aggregator = new AggregatorClass(state.field);
        aggregator.init();
        state.rows.forEach((row) => aggregator.accumulate?.(row));
        const totals: any = { group: { rows: state.rows } };
        aggregator.storeResult(totals);
        return totals[aggregator.type]?.[state.field] ?? null;
      },
    };
  },
};

/**
 * Pivot engine: turns source rows and a pivot spec into row and column header trees with
 * aggregated cells, subtotals and grand totals. It has no DOM dependency, so it can also run
 * on a server (Node.js) or in a Web Worker.
 *
 * Every cell, including subtotal and grand total cells, is accumulated directly from the source
 * rows, so non-additive aggregators (distinct count, median, average, …) are correct at every level.
 */
export class PivotEngine {
  protected _fields = new Map<string, PivotField>();
  protected _aggregators = new Map<string, PivotAggregator>();

  constructor(options?: PivotEngineOption) {
    builtInAggregators.forEach((aggregator) => this._aggregators.set(aggregator.id, aggregator));
    if (options?.aggregators) {
      Object.keys(options.aggregators).forEach((id) => this.registerAggregator({ ...options.aggregators![id], id }));
    }
    this.setFields(options?.fields ?? []);
  }

  // --
  // fields & aggregators
  // -----------------

  /** Replace the field definitions */
  setFields(fields: PivotField[]): void {
    this._fields.clear();
    fields.forEach((field) => this._fields.set(field.id, field));
  }

  /** Get all field definitions */
  getFields(): PivotField[] {
    return Array.from(this._fields.values());
  }

  /** Get a field definition by id */
  getField(fieldId: string): PivotField | undefined {
    return this._fields.get(fieldId);
  }

  /** Caption of a field */
  getFieldLabel(fieldId: string): string {
    if (fieldId === PIVOT_VALUES_FIELD) {
      return 'Values';
    }
    const field = this._fields.get(fieldId);
    return field?.label ?? fieldId;
  }

  /** Add (or replace) an aggregator */
  registerAggregator(aggregator: PivotAggregator): void {
    this._aggregators.set(aggregator.id, aggregator);
  }

  /** Get an aggregator by id */
  getAggregator(id: string): PivotAggregator | undefined {
    return this._aggregators.get(id);
  }

  /** Get all aggregators, built-in ones first */
  getAggregators(): PivotAggregator[] {
    return Array.from(this._aggregators.values());
  }

  /** Read the value of a field from a source row */
  getFieldValue(fieldId: string, row: any): any {
    return this.createGetter(this.requireField(fieldId))(row);
  }

  /** Infer the type of a field from the first non-blank values of the source rows (unless the field declares it) */
  inferFieldType(rows: any[], fieldId: string): PivotFieldType {
    const field = this.requireField(fieldId);
    if (field.type) {
      return field.type;
    }
    const getter = this.createGetter(field);
    let inferred: PivotFieldType | undefined;
    for (let i = 0, checked = 0; i < rows.length && checked < 50; i++) {
      const value = getter(rows[i]);
      if (isBlank(value)) {
        continue;
      }
      checked++;
      const type: PivotFieldType = isDate(value) ? 'date' : typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';
      if (inferred && inferred !== type) {
        return 'string';
      }
      inferred = type;
    }
    return inferred ?? 'string';
  }

  /** Caption of a field item */
  formatItem(fieldId: string, value: any, blankLabel = '(blank)'): string {
    if (isBlank(value)) {
      return blankLabel;
    }
    const field = this._fields.get(fieldId);
    if (field?.itemFormatter) {
      return String(field.itemFormatter(value) ?? '');
    }
    if (isDate(value)) {
      return value.toLocaleDateString();
    }
    return String(value);
  }

  /** Default caption of a value, for example "Sum of Amount" */
  getValueLabel(value: PivotValue): string {
    if (value.label) {
      return value.label;
    }
    const aggregator = this._aggregators.get(value.aggregator);
    return `${aggregator?.label ?? value.aggregator} of ${this.getFieldLabel(value.field)}`;
  }

  /** Default value id, for example "sum:Amount" */
  getDefaultValueId(value: Pick<PivotValue, 'aggregator' | 'field'>): string {
    return `${value.aggregator}:${value.field}`;
  }

  /** Fill in the defaults of a spec and give every value a unique id */
  normalizeSpec(spec?: Partial<PivotSpec>): PivotSpec {
    const usedIds = new Set<string>();
    const values = (spec?.values ?? []).map((value) => {
      let id = value.id ?? this.getDefaultValueId(value);
      if (usedIds.has(id)) {
        let suffix = 2;
        while (usedIds.has(`${id}:${suffix}`)) {
          suffix++;
        }
        id = `${id}:${suffix}`;
      }
      usedIds.add(id);
      return { ...value, id };
    });

    return {
      rows: [...(spec?.rows ?? [])],
      columns: [...(spec?.columns ?? [])],
      values,
      filters: [...(spec?.filters ?? [])],
      measures: [...(spec?.measures ?? [])],
      sort: [...(spec?.sort ?? [])],
      layout: spec?.layout ?? 'compact',
      subtotals: spec?.subtotals ?? 'top',
      columnSubtotals: spec?.columnSubtotals ?? true,
      grandTotals: { rows: true, columns: true, ...spec?.grandTotals },
      repeatItemLabels: !!spec?.repeatItemLabels,
      maxColumns: spec?.maxColumns ?? 1000,
    };
  }

  /** Build the key of a header node from the item values of its path (outermost first) */
  static getNodeKey(values: any[]): string {
    return JSON.stringify(values.map((value) => normalizeKey(value)));
  }

  // --
  // execution
  // -----------------

  /** Compute the pivot result of the source rows */
  execute(rows: any[], inputSpec: Partial<PivotSpec>, options: PivotExecuteOptions = {}): PivotResult {
    const startTime = getNow();
    const spec = this.normalizeSpec(inputSpec);
    const blankLabel = options.blankLabel ?? '(blank)';
    const grandTotalLabel = options.grandTotalLabel ?? spec.grandTotals?.label ?? 'Grand Total';

    const rowFields = spec.rows.filter((id) => id !== PIVOT_VALUES_FIELD).map((id) => this.requireField(id));
    const columnFields = spec.columns.filter((id) => id !== PIVOT_VALUES_FIELD).map((id) => this.requireField(id));
    const rowGetters = rowFields.map((field) => this.createGetter(field));
    const columnGetters = columnFields.map((field) => this.createGetter(field));
    const valueDefs = this.createValueDefinitions(spec);

    const filteredRows = this.applyFilters(rows, spec, valueDefs, blankLabel);

    const rowRoot = this.createBuilderNode(undefined, BLANK_KEY, [], 0, undefined, -1);
    const columnRoot = this.createBuilderNode(undefined, BLANK_KEY, [], 0, undefined, -1);
    const rowNodes: BuilderNode[] = new Array(rowFields.length + 1);
    const columnNodes: BuilderNode[] = new Array(columnFields.length + 1);
    const rawValues: any[] = new Array(valueDefs.length);
    rowNodes[0] = rowRoot;
    columnNodes[0] = columnRoot;

    for (let r = 0; r < filteredRows.length; r++) {
      const row = filteredRows[r];
      this.walkPath(rowRoot, rowFields, rowGetters, row, r, rowNodes);
      this.walkPath(columnRoot, columnFields, columnGetters, row, r, columnNodes);
      for (let v = 0; v < valueDefs.length; v++) {
        rawValues[v] = valueDefs[v].getter(row);
      }

      for (let i = 0; i < rowNodes.length; i++) {
        const rowNode = rowNodes[i];
        if (!rowNode.cells) {
          rowNode.cells = new Map();
        }
        for (let j = 0; j < columnNodes.length; j++) {
          const columnNode = columnNodes[j];
          let cell = rowNode.cells.get(columnNode);
          if (!cell) {
            cell = { count: 0, states: valueDefs.map((def) => def.aggregator.init()) };
            rowNode.cells.set(columnNode, cell);
          }
          cell.count++;
          for (let v = 0; v < valueDefs.length; v++) {
            const def = valueDefs[v];
            cell.states[v] = def.aggregator.accumulate(cell.states[v], rawValues[v], row, def.context);
          }
        }
      }
    }

    this.addPredefinedItems(rowRoot, rowFields);
    this.addPredefinedItems(columnRoot, columnFields);

    // result values: spec values first, then measures
    const resultValues: PivotResultValue[] = valueDefs.map((def) => ({
      id: def.value.id,
      label: this.getValueLabel(def.value),
      field: def.value.field,
      aggregator: def.value.aggregator,
      hidden: !!def.value.hidden,
      showAs: this.normalizeShowAs(def.value.showAs),
      resultType: def.aggregator.resultType ?? 'number',
    }));
    (spec.measures ?? []).forEach((measure) => resultValues.push({ id: measure.id, label: measure.label, isMeasure: true, hidden: !!measure.hidden, resultType: 'number' }));

    const cells: Record<string, Record<string, any[]>> = {};
    const cellCounts: Record<string, Record<string, number>> = {};
    this.collectCells(rowRoot, valueDefs, spec, cells, cellCounts);

    const rowTree = this.toHeaderNode(rowRoot, blankLabel, grandTotalLabel, undefined, {});
    const columnTree = this.toHeaderNode(columnRoot, blankLabel, grandTotalLabel, undefined, {});

    const result: PivotResult = {
      rowTree,
      columnTree,
      values: resultValues,
      cells,
      cellCounts,
      sourceRowCount: rows.length,
      filteredRowCount: filteredRows.length,
    };

    this.sortTree(result, rowTree, rowFields, spec, 'rows');
    this.sortTree(result, columnTree, columnFields, spec, 'columns');
    this.truncateColumns(result, spec);
    this.applyShowAs(result);
    result.duration = getNow() - startTime;
    return result;
  }

  /** Distinct items of a field with their captions and row counts, sorted like the field items */
  getFieldItems(rows: any[], fieldId: string, options?: { search?: string; blankLabel?: string; limit?: number; }): PivotFieldItem[] {
    const field = this.requireField(fieldId);
    const getter = this.createGetter(field);
    const blankLabel = options?.blankLabel ?? '(blank)';
    const map = new Map<NormalizedKey, PivotFieldItem & { firstIndex: number; }>();
    for (let i = 0; i < rows.length; i++) {
      const value = getter(rows[i]);
      const normalized = normalizeKey(value);
      const item = map.get(normalized);
      if (item) {
        item.count++;
      } else {
        map.set(normalized, { value: isBlank(value) ? null : value, label: '', count: 1, firstIndex: i });
      }
    }
    (field.predefinedValues ?? []).forEach((value, index) => {
      const normalized = normalizeKey(value);
      if (!map.has(normalized)) {
        map.set(normalized, { value, label: '', count: 0, firstIndex: rows.length + index });
      }
    });

    const search = options?.search?.trim().toLowerCase();
    let items = Array.from(map.values()).map((item) => ({ ...item, label: this.formatItem(fieldId, item.value, blankLabel) }));
    if (search) {
      items = items.filter((item) => item.label.toLowerCase().includes(search));
    }
    const comparer = this.createItemComparer(field, undefined);
    items.sort((a, b) => comparer(a.value, b.value, a.firstIndex, b.firstIndex));
    if (options?.limit !== undefined && items.length > options.limit) {
      items = items.slice(0, options.limit);
    }
    return items.map(({ value, label, count }) => ({ value, label, count }));
  }

  /** Source rows behind a cell (drill-down), after applying the spec filters */
  getSourceRows(rows: any[], inputSpec: Partial<PivotSpec>, rowKey: string, columnKey: string): any[] {
    const spec = this.normalizeSpec(inputSpec);
    const valueDefs = this.createValueDefinitions(spec);
    const filteredRows = this.applyFilters(rows, spec, valueDefs, '(blank)');
    const rowTokens = JSON.parse(rowKey) as NormalizedKey[];
    const columnTokens = JSON.parse(columnKey) as NormalizedKey[];
    const rowGetters = spec.rows.filter((id) => id !== PIVOT_VALUES_FIELD).slice(0, rowTokens.length).map((id) => this.createGetter(this.requireField(id)));
    const columnGetters = spec.columns.filter((id) => id !== PIVOT_VALUES_FIELD).slice(0, columnTokens.length).map((id) => this.createGetter(this.requireField(id)));

    return filteredRows.filter((row) =>
      rowGetters.every((getter, i) => normalizeKey(getter(row)) === rowTokens[i]) && columnGetters.every((getter, i) => normalizeKey(getter(row)) === columnTokens[i])
    );
  }

  // --
  // protected functions
  // -----------------

  protected requireField(fieldId: string): PivotField {
    const field = this._fields.get(fieldId);
    if (!field) {
      throw new Error(`[PivotEngine] unknown field "${fieldId}"`);
    }
    return field;
  }

  protected createGetter(field: PivotField): (row: any) => any {
    if (field.getter) {
      return field.getter;
    }
    const property = field.field ?? field.id;
    return (row: any) => row?.[property];
  }

  protected createValueDefinitions(spec: PivotSpec): ValueDefinition[] {
    return spec.values.map((value) => {
      const aggregator = this._aggregators.get(value.aggregator);
      if (!aggregator) {
        throw new Error(`[PivotEngine] unknown aggregator "${value.aggregator}"`);
      }
      const field = this.requireField(value.field);
      return {
        value: value as PivotValue & { id: string; },
        aggregator,
        getter: this.createGetter(field),
        context: { fieldId: field.id, sourceField: field.getter ? field.id : (field.field ?? field.id), valueId: value.id! },
      };
    });
  }

  protected normalizeShowAs(showAs?: PivotValue['showAs']): PivotShowAs | undefined {
    if (!showAs) {
      return undefined;
    }
    return typeof showAs === 'string' ? { type: showAs } : showAs;
  }

  protected coerceFilterValue(field: PivotField, value: any): any {
    if (field.type === 'date' && !isDate(value) && !isBlank(value)) {
      return new Date(value);
    }
    return value;
  }

  protected applyFilters(rows: any[], spec: PivotSpec, valueDefs: ValueDefinition[], blankLabel: string): any[] {
    const filters = (spec.filters ?? []).filter((filter) => this._fields.has(filter.field));
    if (!filters.length) {
      return rows;
    }

    const rowFilters = filters.filter((filter) => filter.include || filter.exclude || filter.label || filter.predicate).map((filter) => this.createRowFilter(filter, blankLabel));
    let filteredRows = rowFilters.length ? rows.filter((row) => rowFilters.every((test) => test(row))) : rows;

    // top/bottom N filters rank the items by the grand total of a value, over the rows kept so far
    filters.filter((filter) => filter.top).forEach((filter) => {
      const def = valueDefs.find((valueDef) => valueDef.value.id === filter.top!.valueId);
      if (!def) {
        return;
      }
      const getter = this.createGetter(this.requireField(filter.field));
      const states = new Map<NormalizedKey, any>();
      filteredRows.forEach((row) => {
        const key = normalizeKey(getter(row));
        const state = states.has(key) ? states.get(key) : def.aggregator.init();
        states.set(key, def.aggregator.accumulate(state, def.getter(row), row, def.context));
      });
      const direction = filter.top!.direction === 'bottom' ? 1 : -1;
      const ranked = Array.from(states.entries())
        .map(([key, state]) => ({ key, result: def.aggregator.result(state) }))
        .sort((a, b) => compareNullableNumbers(a.result, b.result, direction));
      const kept = new Set(ranked.slice(0, Math.max(0, filter.top!.count)).map((item) => item.key));
      filteredRows = filteredRows.filter((row) => kept.has(normalizeKey(getter(row))));
    });

    return filteredRows;
  }

  protected createRowFilter(filter: PivotFilter, blankLabel: string): (row: any) => boolean {
    const field = this.requireField(filter.field);
    const getter = this.createGetter(field);
    const include = filter.include ? new Set(filter.include.map((value) => normalizeKey(this.coerceFilterValue(field, value)))) : undefined;
    const exclude = filter.exclude ? new Set(filter.exclude.map((value) => normalizeKey(this.coerceFilterValue(field, value)))) : undefined;
    const labelFilter = filter.label;
    const search = labelFilter?.value?.toLowerCase() ?? '';

    return (row: any) => {
      const value = getter(row);
      if (include || exclude) {
        const key = normalizeKey(value);
        if ((include && !include.has(key)) || exclude?.has(key)) {
          return false;
        }
      }
      if (labelFilter) {
        const label = this.formatItem(field.id, value, blankLabel).toLowerCase();
        const matched = {
          equals: () => label === search,
          notEquals: () => label !== search,
          contains: () => label.includes(search),
          notContains: () => !label.includes(search),
          beginsWith: () => label.startsWith(search),
          endsWith: () => label.endsWith(search),
        }[labelFilter.operator]?.() ?? true;
        if (!matched) {
          return false;
        }
      }
      return filter.predicate ? !!filter.predicate(value, row) : true;
    };
  }

  protected createBuilderNode(value: any, normalized: NormalizedKey, tokens: NormalizedKey[], level: number, fieldId: string | undefined, firstIndex: number, parent?: BuilderNode): BuilderNode {
    return { value, normalized, tokens, key: JSON.stringify(tokens), level, fieldId, children: new Map(), count: 0, firstIndex, parent };
  }

  /** Find or create the nodes of one row path, filling `nodes` (index 0 is the root) */
  protected walkPath(root: BuilderNode, fields: PivotField[], getters: Array<(row: any) => any>, row: any, rowIndex: number, nodes: BuilderNode[]): void {
    let node = root;
    root.count++;
    for (let i = 0; i < fields.length; i++) {
      const value = getters[i](row);
      const normalized = normalizeKey(value);
      let child = node.children.get(normalized);
      if (!child) {
        child = this.createBuilderNode(isBlank(value) ? null : value, normalized, node.tokens.concat(normalized), i + 1, fields[i].id, rowIndex, node);
        node.children.set(normalized, child);
      }
      child.count++;
      nodes[i + 1] = child;
      node = child;
    }
  }

  /** Add the predefined items of every level, under every parent, so they show even without data */
  protected addPredefinedItems(root: BuilderNode, fields: PivotField[]): void {
    let parents = [root];
    fields.forEach((field, i) => {
      if (field.predefinedValues?.length) {
        parents.forEach((parent) => {
          field.predefinedValues!.forEach((value) => {
            const normalized = normalizeKey(value);
            if (!parent.children.has(normalized)) {
              parent.children.set(normalized, this.createBuilderNode(value, normalized, parent.tokens.concat(normalized), i + 1, field.id, Number.MAX_SAFE_INTEGER, parent));
            }
          });
        });
      }
      parents = parents.flatMap((parent) => Array.from(parent.children.values()));
    });
  }

  protected collectCells(rowRoot: BuilderNode, valueDefs: ValueDefinition[], spec: PivotSpec, cells: Record<string, Record<string, any[]>>, cellCounts: Record<string, Record<string, number>>): void {
    const measures = spec.measures ?? [];
    const visit = (rowNode: BuilderNode) => {
      if (rowNode.cells) {
        const rowCells: Record<string, any[]> = {};
        const rowCounts: Record<string, number> = {};
        rowNode.cells.forEach((cell, columnNode) => {
          const values = cell.states.map((state, v) => valueDefs[v].aggregator.result(state));
          if (measures.length) {
            const byId: Record<string, any> = {};
            valueDefs.forEach((def, v) => (byId[def.value.id] = values[v]));
            measures.forEach((measure) => {
              const result = measure.compute(byId, { rowKey: rowNode.key, columnKey: columnNode.key, sourceRowCount: cell.count });
              byId[measure.id] = result;
              values.push(result);
            });
          }
          rowCells[columnNode.key] = values;
          rowCounts[columnNode.key] = cell.count;
        });
        cells[rowNode.key] = rowCells;
        cellCounts[rowNode.key] = rowCounts;
        rowNode.cells = undefined;
      }
      rowNode.children.forEach((child) => visit(child));
    };
    visit(rowRoot);
  }

  protected toHeaderNode(builder: BuilderNode, blankLabel: string, grandTotalLabel: string, parentKey: string | undefined, parentPath: Record<string, any>): PivotHeaderNode {
    const path = builder.fieldId ? { ...parentPath, [builder.fieldId]: builder.value } : parentPath;
    const node: PivotHeaderNode = {
      key: builder.key,
      field: builder.fieldId,
      value: builder.value,
      label: builder.fieldId ? this.formatItem(builder.fieldId, builder.value, blankLabel) : grandTotalLabel,
      level: builder.level,
      children: [],
      sourceRowCount: builder.count,
      parentKey,
      path,
    };
    (node as any).__firstIndex = builder.firstIndex;
    builder.children.forEach((child) => node.children.push(this.toHeaderNode(child, blankLabel, grandTotalLabel, node.key, path)));
    return node;
  }

  protected createItemComparer(field: PivotField, sort: PivotSort | undefined): (a: any, b: any, aIndex: number, bIndex: number) => number {
    const direction = sort?.direction === 'desc' ? -1 : 1;
    if (sort?.direction === 'source') {
      return (_a, _b, aIndex, bIndex) => aIndex - bIndex;
    }
    const predefined = field.predefinedValues?.length && !sort ? new Map(field.predefinedValues.map((value, index) => [normalizeKey(value), index])) : undefined;
    return (a, b, aIndex, bIndex) => {
      if (predefined) {
        const aPos = predefined.get(normalizeKey(a)) ?? Number.MAX_SAFE_INTEGER;
        const bPos = predefined.get(normalizeKey(b)) ?? Number.MAX_SAFE_INTEGER;
        if (aPos !== bPos) {
          return aPos - bPos;
        }
      }
      const aBlank = isBlank(a);
      const bBlank = isBlank(b);
      if (aBlank || bBlank) {
        return aBlank === bBlank ? 0 : aBlank ? 1 : -1;
      }
      const result = field.comparer ? field.comparer(a, b) : compareNatural(a, b);
      return result === 0 ? aIndex - bIndex : result * direction;
    };
  }

  protected sortTree(result: PivotResult, root: PivotHeaderNode, fields: PivotField[], spec: PivotSpec, axis: 'rows' | 'columns'): void {
    const comparers = fields.map((field) => {
      const sort = spec.sort?.find((item) => item.field === field.id);
      if (sort?.by && axis === 'rows') {
        const valueIndex = result.values.findIndex((value) => value.id === sort.by!.valueId);
        const columnKey = sort.by.columnKey ?? result.columnTree.key;
        const direction = sort.direction === 'desc' ? -1 : 1;
        return (a: PivotHeaderNode, b: PivotHeaderNode) => {
          const aValue = valueIndex >= 0 ? result.cells[a.key]?.[columnKey]?.[valueIndex] : null;
          const bValue = valueIndex >= 0 ? result.cells[b.key]?.[columnKey]?.[valueIndex] : null;
          return compareNullableNumbers(aValue, bValue, direction) || (a as any).__firstIndex - (b as any).__firstIndex;
        };
      }
      const itemComparer = this.createItemComparer(field, sort);
      return (a: PivotHeaderNode, b: PivotHeaderNode) => itemComparer(a.value, b.value, (a as any).__firstIndex, (b as any).__firstIndex);
    });

    const visit = (node: PivotHeaderNode) => {
      if (node.children.length) {
        node.children.sort(comparers[node.level]);
        node.children.forEach(visit);
      }
      delete (node as any).__firstIndex;
    };
    visit(root);
  }

  /** Cut the column tree when the number of generated value columns would exceed `maxColumns` */
  protected truncateColumns(result: PivotResult, spec: PivotSpec): void {
    const maxColumns = spec.maxColumns ?? 1000;
    const visibleValueCount = Math.max(1, result.values.filter((value) => !value.hidden).length);
    const maxLeaves = Math.max(1, Math.floor(maxColumns / visibleValueCount));

    let leafCount = 0;
    const countLeaves = (node: PivotHeaderNode): number => (node.children.length ? node.children.reduce((sum, child) => sum + countLeaves(child), 0) : 1);
    const totalLeaves = result.columnTree.children.length ? countLeaves(result.columnTree) : 0;
    if (totalLeaves <= maxLeaves) {
      return;
    }

    const prune = (node: PivotHeaderNode): boolean => {
      if (!node.children.length) {
        leafCount++;
        return leafCount <= maxLeaves;
      }
      node.children = node.children.filter((child) => prune(child));
      return node.children.length > 0;
    };
    prune(result.columnTree);
    result.truncated = { columns: totalLeaves * visibleValueCount, maxColumns };
  }

  /** Replace the values that have a "Show Values As" calculation, keeping the aggregated ones in `rawCells` */
  protected applyShowAs(result: PivotResult): void {
    const showAsIndexes = result.values.map((value, index) => (value.showAs ? index : -1)).filter((index) => index >= 0);
    if (!showAsIndexes.length) {
      return;
    }

    const rawCells = result.cells;
    const shownCells: Record<string, Record<string, any[]>> = {};
    Object.keys(rawCells).forEach((rowKey) => {
      shownCells[rowKey] = {};
      Object.keys(rawCells[rowKey]).forEach((columnKey) => (shownCells[rowKey][columnKey] = rawCells[rowKey][columnKey].slice()));
    });

    const rowNodes = this.flattenTree(result.rowTree);
    const columnNodes = this.flattenTree(result.columnTree);
    const rowByKey = new Map(rowNodes.map((node) => [node.key, node]));
    const columnByKey = new Map(columnNodes.map((node) => [node.key, node]));
    const rootRowKey = result.rowTree.key;
    const rootColumnKey = result.columnTree.key;
    const raw = (rowKey: string | undefined, columnKey: string | undefined, index: number) => (rowKey === undefined || columnKey === undefined ? undefined : rawCells[rowKey]?.[columnKey]?.[index]);
    const ratio = (value: any, total: any) => {
      const num = toNumber(value);
      const den = toNumber(total);
      return num === null || den === null || den === 0 ? null : num / den;
    };
    const setShown = (rowKey: string, columnKey: string, index: number, value: any) => {
      if (shownCells[rowKey]?.[columnKey]) {
        shownCells[rowKey][columnKey][index] = value;
      }
    };

    showAsIndexes.forEach((index) => {
      const showAs = result.values[index].showAs!;
      switch (showAs.type) {
        case 'percentOfGrandTotal':
        case 'percentOfColumnTotal':
        case 'percentOfRowTotal':
        case 'percentOfParentRowTotal':
        case 'percentOfParentColumnTotal':
          Object.keys(rawCells).forEach((rowKey) => {
            Object.keys(rawCells[rowKey]).forEach((columnKey) => {
              const value = raw(rowKey, columnKey, index);
              let total: any;
              if (showAs.type === 'percentOfGrandTotal') {
                total = raw(rootRowKey, rootColumnKey, index);
              } else if (showAs.type === 'percentOfColumnTotal') {
                total = raw(rootRowKey, columnKey, index);
              } else if (showAs.type === 'percentOfRowTotal') {
                total = raw(rowKey, rootColumnKey, index);
              } else if (showAs.type === 'percentOfParentRowTotal') {
                const parentKey = rowByKey.get(rowKey)?.parentKey;
                total = parentKey === undefined ? value : raw(parentKey, columnKey, index);
              } else {
                const parentKey = columnByKey.get(columnKey)?.parentKey;
                total = parentKey === undefined ? value : raw(rowKey, parentKey, index);
              }
              setShown(rowKey, columnKey, index, ratio(value, total));
            });
          });
          break;

        default: {
          // sibling based calculations, along the rows (default) or along the columns
          const alongRows = (showAs.axis ?? 'rows') === 'rows';
          const parents = alongRows ? rowNodes : columnNodes;
          const others = alongRows ? columnNodes : rowNodes;
          parents.filter((parent) => parent.children.length).forEach((parent) => {
            others.forEach((other) => {
              const siblings = parent.children.map((child) => {
                const rowKey = alongRows ? child.key : other.key;
                const columnKey = alongRows ? other.key : child.key;
                return { rowKey, columnKey, value: toNumber(raw(rowKey, columnKey, index)) };
              });
              if (showAs.type === 'runningTotal') {
                let running = 0;
                siblings.forEach((sibling) => {
                  running += sibling.value ?? 0;
                  setShown(sibling.rowKey, sibling.columnKey, index, sibling.value === null ? null : running);
                });
              } else if (showAs.type === 'differenceFromPrevious' || showAs.type === 'percentDifferenceFromPrevious') {
                siblings.forEach((sibling, i) => {
                  const previous = i > 0 ? siblings[i - 1].value : null;
                  let shown: number | null = null;
                  if (sibling.value !== null && previous !== null) {
                    shown = showAs.type === 'differenceFromPrevious' ? sibling.value - previous : previous === 0 ? null : (sibling.value - previous) / previous;
                  }
                  setShown(sibling.rowKey, sibling.columnKey, index, shown);
                });
              } else if (showAs.type === 'rankAscending' || showAs.type === 'rankDescending') {
                const direction = showAs.type === 'rankAscending' ? 1 : -1;
                const ranked = siblings.filter((sibling) => sibling.value !== null).sort((a, b) => (a.value! - b.value!) * direction);
                siblings.forEach((sibling) => {
                  setShown(sibling.rowKey, sibling.columnKey, index, sibling.value === null ? null : ranked.findIndex((item) => item.value === sibling.value) + 1);
                });
              }
            });
          });
          break;
        }
      }
    });

    result.rawCells = rawCells;
    result.cells = shownCells;
  }

  protected flattenTree(root: PivotHeaderNode): PivotHeaderNode[] {
    const nodes: PivotHeaderNode[] = [];
    const visit = (node: PivotHeaderNode) => {
      nodes.push(node);
      node.children.forEach(visit);
    };
    visit(root);
    return nodes;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.PivotEngine = PivotEngine;
  window.Slick.PivotAggregators = PivotAggregators;
  window.Slick.PIVOT_VALUES_FIELD = PIVOT_VALUES_FIELD;
}
