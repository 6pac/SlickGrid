import type { Column } from './column.interface.js';

/** The four areas of the pivot field list (Excel "PivotTable Fields") */
export type PivotArea = 'filters' | 'rows' | 'columns' | 'values';

/** Data type hint of a pivot field, used for default aggregation, sorting and formatting */
export type PivotFieldType = 'string' | 'number' | 'date' | 'boolean';

/** Report layout of the row labels (Excel "Report Layout") */
export type PivotLayout = 'compact' | 'outline' | 'tabular';

/** Where row subtotals are shown, or `none` to hide them */
export type PivotSubtotalsPosition = 'top' | 'bottom' | 'none';

/** Sort order of the items of a row or column field; `source` keeps the order in which items first appear in the data */
export type PivotSortDirection = 'asc' | 'desc' | 'source';

/** Built-in "Show Values As" calculations */
export type PivotShowAsType =
  | 'percentOfGrandTotal'
  | 'percentOfColumnTotal'
  | 'percentOfRowTotal'
  | 'percentOfParentRowTotal'
  | 'percentOfParentColumnTotal'
  | 'runningTotal'
  | 'differenceFromPrevious'
  | 'percentDifferenceFromPrevious'
  | 'rankAscending'
  | 'rankDescending';

/** Level of the automatic date hierarchy of a date field (Excel time grouping, Power Pivot date hierarchy) */
export type PivotDateLevel = 'year' | 'quarter' | 'month' | 'day';

/**
 * How a value typed into a pivot cell is spread over the source rows behind the cell (write-back), as the
 * allocation methods of Excel What-If analysis:
 * - `weighted`: every source value is scaled by the same factor, keeping their proportions
 *   (an equal split when the current total is 0)
 * - `equal`: every source row gets the same value
 * - `equalIncrement`: every source row changes by the same amount
 */
export type PivotAllocationMethod = 'weighted' | 'equal' | 'equalIncrement';

export interface PivotField<T = any> {
  /** Unique id of the field, used by the spec */
  id: string;

  /** Caption shown in the field list and the headers, defaults to the id */
  label?: string;

  /** Property name read from the source row, defaults to the id (ignored when a `getter` is provided) */
  field?: string;

  /** Derived (calculated) field, evaluated once per source row before aggregation */
  getter?: (row: T) => any;

  /** Data type hint; inferred from the data when undefined */
  type?: PivotFieldType;

  /**
   * Fixed, ordered list of items. Every item is shown even when it has no data (like the "Column Headings" property of an MS Access crosstab).
   * Items found in the data but missing from the list are shown after the predefined ones.
   */
  predefinedValues?: any[];

  /** Caption of an item, for example to look up a name from an id */
  itemFormatter?: (value: any) => string;

  /** Custom comparer of two item values, used when sorting the field items */
  comparer?: (a: any, b: any) => number;

  /** Areas into which the field may be placed, defaults to all of them */
  allowedAreas?: PivotArea[];

  /** Column template merged into the row label column of this field (outline & tabular layouts) */
  column?: Partial<Column>;

  /** Optional group shown in the field list, for example the name of a lookup table */
  group?: string;

  /**
   * Levels of the automatic date hierarchy of a date field, `false` to turn it off. Each level is a
   * field of its own whose id is the date field id followed by the level, for example `OrderDate.year`,
   * `OrderDate.quarter`, `OrderDate.month` and `OrderDate.day` (the default levels).
   */
  dateHierarchy?: PivotDateLevel[] | false;

  /** Set by the engine on the level fields of a date hierarchy: the date field and the level they derive from */
  dateLevel?: { field: string; level: PivotDateLevel; };

  /**
   * Write a value into a source row (write-back). By default the `field` property is set; a field with
   * a `getter` and no `setter` cannot be written.
   */
  setter?: (row: T, value: any) => void;
}

/** Context of a write-back allocation */
export interface PivotAllocationContext {
  /** How the new value is spread over the source rows */
  method: PivotAllocationMethod;

  /** Number of decimal places of the written values; the rounding residue goes to the largest one so that the total is kept */
  precision?: number;

  /** Source rows behind the cell */
  rows: any[];
}

/** Context provided to a pivot aggregator on every call to `accumulate` */
export interface PivotAggregatorContext {
  /** Id of the pivot field being aggregated */
  fieldId: string;

  /** Name of the source property of that field (the field id when the field is derived) */
  sourceField: string;

  /** Id of the pivot value being computed */
  valueId: string;
}

export interface PivotAggregator<S = any, R = any> {
  /** Unique id, referenced by `PivotValue.aggregator` */
  id: string;

  /** Caption used in the "Summarize by" list and in default value captions ("Sum" → "Sum of Amount") */
  label: string;

  /** Create the initial state of one cell */
  init: () => S;

  /** Add one source row to the state, returning the new state */
  accumulate: (state: S, value: any, row: any, context: PivotAggregatorContext) => S;

  /** Compute the cell result from the state */
  result: (state: S) => R;

  /** When true, the field list only offers this aggregator for numeric fields */
  numericOnly?: boolean;

  /** Hint of the result type, `number` by default; used to choose the default formatting */
  resultType?: PivotFieldType | 'same';

  /**
   * Write-back: return the new source values (one per source row behind the cell) that give the cell
   * the `target` result. Values aggregated by an aggregator without `allocate` cannot be edited.
   * The built-in `sum`, `avg`, `first` and `last` aggregators allocate.
   */
  allocate?: (target: any, values: any[], context: PivotAllocationContext) => any[];
}

/** Number formatting of a value, passed to `Intl.NumberFormat` */
export type PivotNumberFormat = Intl.NumberFormatOptions & {
  /** Locale(s) passed to `Intl.NumberFormat`, defaults to the browser locale */
  locale?: string | string[];
};

export interface PivotShowAs {
  /** Calculation to apply */
  type: PivotShowAsType;

  /** Axis along which running totals, differences and ranks are computed, defaults to `rows` */
  axis?: 'rows' | 'columns';
}

export interface PivotValue {
  /** Stable id of the value, defaults to `${aggregator}:${field}` */
  id?: string;

  /** Id of the pivot field to aggregate */
  field: string;

  /** Built-in aggregator id (`sum`, `count`, `distinctCount`, …) or the id of a custom aggregator */
  aggregator: string;

  /** Caption of the value, defaults to "Sum of Amount" */
  label?: string;

  /** Excel "Show Values As" calculation */
  showAs?: PivotShowAsType | PivotShowAs;

  /** Number format of the value cells (ignored when the column template provides a formatter) */
  numberFormat?: PivotNumberFormat;

  /** Column template merged into every generated column of this value (formatter, cssClass, width, editor, …) */
  column?: Partial<Column>;

  /** Computed but not displayed, for example an input of a measure */
  hidden?: boolean;

  /** Write-back settings of this value, overriding the plugin `writeBack` option; `false` makes the value read-only */
  writeBack?: false | Pick<PivotWriteBackOption, 'method' | 'precision'>;
}

/** Write-back settings: how values typed into pivot cells are written into the source rows */
export interface PivotWriteBackOption {
  /** How a new value is spread over the source rows behind the cell, defaults to `weighted` */
  method?: PivotAllocationMethod;

  /** Number of decimal places of the written values (for example 0 for quantities), not rounded by default */
  precision?: number;

  /** Editor of the value cells, defaults to `Editors.Float` */
  editor?: Column['editor'];

  /**
   * Number of write-backs that `undo()` (Ctrl+Z) can take back, defaults to 100; 0 keeps no history.
   * Only the source rows of an array or a DataView can be restored: a provider writes the data itself.
   */
  undoLimit?: number;
}

/** Change of one source row made by a write-back */
export interface PivotWriteBackChange {
  /** The source row */
  row: any;

  /** Id of the field that was written */
  field: string;

  /** Value of the field before the write-back */
  oldValue: any;

  /** Value written into the field */
  newValue: any;
}

/** A value typed into a pivot cell */
export interface PivotCellEdit {
  /** Key of the row header node of the cell */
  rowKey: string;

  /** Key of the column header node of the cell */
  columnKey: string;

  /** Id of the edited value */
  valueId: string;

  /** Value of the cell before the edit */
  oldValue: any;

  /** Value typed into the cell */
  newValue: any;

  /** How the new value is spread over the source rows */
  method: PivotAllocationMethod;

  /** Number of decimal places of the written values */
  precision?: number;
}

/** Measure calculated after aggregation, once per cell, from the other values of the same cell (Power Pivot measure) */
export interface PivotMeasure {
  /** Unique id of the measure */
  id: string;

  /** Caption of the measure */
  label: string;

  /** Ids of the values (or other measures) used by `compute`, which may be hidden values */
  dependsOn?: string[];

  /** Calculation, receiving the results of the cell keyed by value id */
  compute: (values: Record<string, any>, context: PivotMeasureContext) => any;

  /** Number format of the measure cells */
  numberFormat?: PivotNumberFormat;

  /** Column template merged into every generated column of this measure */
  column?: Partial<Column>;

  /** Computed but not displayed */
  hidden?: boolean;
}

export interface PivotMeasureContext {
  /** Key of the row header node of the cell */
  rowKey: string;

  /** Key of the column header node of the cell */
  columnKey: string;

  /** Number of source rows aggregated into the cell */
  sourceRowCount: number;
}

/** Label filter conditions */
export type PivotLabelFilterOperator = 'equals' | 'notEquals' | 'contains' | 'notContains' | 'beginsWith' | 'endsWith';

export interface PivotFilter {
  /** Id of the field to filter */
  field: string;

  /** Keep only these items */
  include?: any[];

  /** Remove these items */
  exclude?: any[];

  /** Keep items whose caption matches the condition (case insensitive) */
  label?: { operator: PivotLabelFilterOperator; value: string; };

  /** Keep the top (or bottom) N items of the field, ranked by the grand total of a value */
  top?: { count: number; valueId: string; direction?: 'top' | 'bottom'; };

  /** Arbitrary filter (like the "Where" criteria of an MS Access query); not serializable */
  predicate?: (value: any, row: any) => boolean;
}

export interface PivotSort {
  /** Id of the row or column field to sort */
  field: string;

  /** Sort direction, defaults to `asc` */
  direction?: PivotSortDirection;

  /** Sort the items by a value instead of by their caption (row fields only) */
  by?: {
    /** Id of the value to sort by */
    valueId: string;

    /** Key of the column node holding the value, defaults to the grand total column */
    columnKey?: string;
  };
}

export interface PivotGrandTotals {
  /** Show the grand total row, `true` meaning at the bottom (default) */
  rows?: boolean | 'top' | 'bottom';

  /** Show the grand total columns, `true` meaning at the end (default) */
  columns?: boolean | 'start' | 'end';

  /** Ids of the values shown in the grand total columns, defaults to all visible values */
  values?: string[];

  /** Caption of the grand totals, defaults to "Grand Total" */
  label?: string;
}

export interface PivotSpec {
  /** Ids of the row fields, outermost first */
  rows: string[];

  /** Ids of the column fields, outermost first. Include `$values` to choose where the value headers are nested (defaults to last) */
  columns: string[];

  /** Values to aggregate */
  values: PivotValue[];

  /** Pre-aggregation filters */
  filters?: PivotFilter[];

  /** Calculations evaluated after aggregation */
  measures?: PivotMeasure[];

  /** Sort orders of the row and column fields, ascending by caption by default */
  sort?: PivotSort[];

  /** Report layout, defaults to `compact` */
  layout?: PivotLayout;

  /** Row subtotals position, defaults to `top` */
  subtotals?: PivotSubtotalsPosition;

  /** Show a subtotal column for every outer column field item, defaults to true */
  columnSubtotals?: boolean;

  /** Grand totals, both shown by default */
  grandTotals?: PivotGrandTotals;

  /** Repeat the item captions on every row (outline & tabular layouts), defaults to false */
  repeatItemLabels?: boolean;

  /** Maximum number of generated value columns, defaults to 1000 */
  maxColumns?: number;
}

/** Node of the row or column header tree */
export interface PivotHeaderNode {
  /** Stable key of the node, unique within its tree (the root key is `[]`) */
  key: string;

  /** Id of the field of this level, undefined for the root (grand total) node */
  field?: string;

  /** Item value of this node */
  value?: any;

  /** Caption of the node */
  label: string;

  /** Depth of the node, the root being 0 */
  level: number;

  /** Child nodes, in display order */
  children: PivotHeaderNode[];

  /** Number of (filtered) source rows below this node */
  sourceRowCount: number;

  /** Key of the parent node, undefined for the root */
  parentKey?: string;

  /** Item values of the node and its ancestors, keyed by field id */
  path: Record<string, any>;
}

/** Description of one computed value (or measure) of the result */
export interface PivotResultValue {
  /** Value id */
  id: string;

  /** Caption */
  label: string;

  /** Field id (undefined for measures) */
  field?: string;

  /** Aggregator id (undefined for measures) */
  aggregator?: string;

  /** Whether this is a measure */
  isMeasure?: boolean;

  /** Whether the value is hidden */
  hidden?: boolean;

  /** Show Values As calculation of the value */
  showAs?: PivotShowAs;

  /** Result type hint */
  resultType?: PivotFieldType | 'same';
}

export interface PivotResult {
  /** Root of the row header tree (the grand total row) */
  rowTree: PivotHeaderNode;

  /** Root of the column header tree (the grand total column) */
  columnTree: PivotHeaderNode;

  /** Values and measures, in cell order */
  values: PivotResultValue[];

  /** Displayed cells: `cells[rowKey][columnKey][valueIndex]` (after any "Show Values As" calculation) */
  cells: Record<string, Record<string, any[]>>;

  /** Aggregated cells before the "Show Values As" calculations, only set when a value uses one */
  rawCells?: Record<string, Record<string, any[]>>;

  /** Number of source rows per cell: `cellCounts[rowKey][columnKey]` */
  cellCounts?: Record<string, Record<string, number>>;

  /** Number of source rows before filtering */
  sourceRowCount: number;

  /** Number of source rows after filtering */
  filteredRowCount: number;

  /** Set when the column tree was cut to respect `maxColumns` */
  truncated?: { columns: number; maxColumns: number; };

  /** Time taken to compute the result, in milliseconds */
  duration?: number;
}

/** Distinct item of a field, used by the filter dropdowns */
export interface PivotFieldItem {
  /** Raw item value (null for blanks) */
  value: any;

  /** Item caption */
  label: string;

  /** Number of source rows holding the item */
  count: number;
}

/** Serializable pivot request sent to a data provider */
export interface PivotRequest {
  /** Spec without its functions (predicates, measures compute) */
  spec: PivotSpec;

  /** Field descriptions without their functions, including the level fields of the date hierarchies used by the spec (see `PivotField.dateLevel`) */
  fields: Array<Omit<PivotField, 'getter' | 'setter' | 'itemFormatter' | 'comparer'>>;
}

export interface PivotExecuteContext {
  /** Aborted when a newer request supersedes this one */
  signal: AbortSignal;

  /** The full spec, including its functions */
  spec: PivotSpec;
}

/** Custom (for example server-side) source of pivot results */
export interface PivotDataProvider {
  /** Compute the pivot result */
  execute: (request: PivotRequest, context: PivotExecuteContext) => Promise<PivotResult> | PivotResult;

  /** Distinct items of a field, used by the filter dropdowns */
  getItems?: (fieldId: string, context: { signal: AbortSignal; search?: string; }) => Promise<PivotFieldItem[]> | PivotFieldItem[];

  /** Source rows behind a cell, used by drill-down */
  getSourceRows?: (request: PivotRequest, rowKey: string, columnKey: string) => Promise<any[]> | any[];

  /** Write a value typed into a cell back to the data (write-back); the pivot is refreshed once it resolves */
  writeBack?: (request: PivotRequest, edit: PivotCellEdit) => Promise<void> | void;
}

/** Source rows of the pivot: an array or any object exposing `getItems()` (such as a DataView) */
export type PivotSource<T = any> = T[] | { getItems: () => T[]; };

export interface PivotOption {
  /** Field definitions */
  fields: PivotField[];

  /** Initial pivot spec */
  spec?: Partial<PivotSpec>;

  /** Source rows (array or DataView); a DataView is watched and re-pivoted when its items change */
  source?: PivotSource;

  /** Custom aggregators, keyed by id, added to the built-in ones */
  aggregators?: Record<string, PivotAggregator>;

  /** Custom data provider, replacing the local engine */
  provider?: PivotDataProvider;

  /** Template merged into every generated value column (width, cssClass, …) */
  columnDefaults?: Partial<Column>;

  /** Template merged into the row label column(s) */
  rowHeaderColumn?: Partial<Column>;

  /** Caption of the compact layout row label column, defaults to "Row Labels" */
  rowLabelsCaption?: string;

  /** Caption shown above the column fields when field captions are shown, defaults to the field captions */
  columnLabelsCaption?: string;

  /** Caption of the grand totals, defaults to "Grand Total" */
  grandTotalLabel?: string;

  /** Suffix of subtotal captions, defaults to " Total" */
  totalSuffix?: string;

  /** Caption of blank items, defaults to "(blank)" */
  blankLabel?: string;

  /** Text of empty cells, defaults to an empty string */
  emptyCellText?: string;

  /** Default number format of numeric values */
  numberFormat?: PivotNumberFormat;

  /** Locale of the month names and dates of the field items, and default locale of the number formats; defaults to the browser locale */
  locale?: string | string[];

  /** Show a caption row above the column headers ("Sum of Amount | Quarter"), defaults to true */
  showFieldCaptions?: boolean;

  /** Height of each column group header row, defaults to the grid `preHeaderPanelHeight` or 25 */
  headerRowHeight?: number;

  /** Pin the row label columns to the leading edge (the left, or the right in a right-to-left grid), defaults to true */
  pinRowHeaders?: boolean;

  /**
   * Dock the grand total row at the bottom (or the top, see `grandTotals.rows`): `true` pins it there,
   * `'sticky'` docks it only while it would otherwise be scrolled out of view, so that a short pivot
   * shows it right below its last row. Defaults to `'sticky'`.
   */
  pinGrandTotalRow?: boolean | 'sticky';

  /**
   * Dock the grand total columns at the trailing edge (or the leading edge when `grandTotals.columns` is
   * `'start'`): `true` pins them, `'sticky'` docks them only while they would otherwise be scrolled out
   * of view. Defaults to false.
   */
  pinGrandTotalColumns?: boolean | 'sticky';

  /** Indentation of each compact layout level, in pixels, defaults to 15 */
  indentation?: number;

  /** Allow row groups to be expanded & collapsed, defaults to true */
  enableRowCollapse?: boolean;

  /** Allow column groups to be collapsed into their subtotal, defaults to true */
  enableColumnCollapse?: boolean;

  /** Raise `onPivotCellDrillDown` when a value cell is double-clicked, defaults to true */
  enableDrillDown?: boolean;

  /** Sort rows by clicking the column headers, defaults to true */
  enableSorting?: boolean;

  /** Delay before re-pivoting after the source data changed, in milliseconds, defaults to 50 */
  refreshDelay?: number;

  /**
   * Let users type a new value into a value cell and write it back to the source rows behind the cell
   * (the grid also needs `editable: true`), defaults to false. Only values whose aggregator allocates
   * (`sum`, `avg`, `first`, `last` or a custom one), whose field can be written and that are not shown
   * as a calculation can be edited; with a provider, the provider needs `writeBack`.
   */
  enableWriteBack?: boolean;

  /** Write-back settings: allocation method, precision and editor */
  writeBack?: PivotWriteBackOption;
}

/** Information attached to every generated pivot column */
export interface PivotColumnInfo {
  /** Kind of column */
  type: 'rowHeader' | 'value';

  /** Index of the row field shown by a row label column (outline & tabular layouts) */
  rowFieldIndex?: number;

  /** Key of the column header node of a value column */
  columnKey?: string;

  /** Index of the value in `PivotResult.values` */
  valueIndex?: number;

  /** Value id */
  valueId?: string;

  /** Whether the column shows a column subtotal or grand total */
  isTotal?: boolean;

  /** Whether the column shows the grand total */
  isGrandTotal?: boolean;

  /** Group captions above the column header, outermost first */
  groupPath: Array<{ key: string; label: string; collapsible?: boolean; collapsed?: boolean; }>;
}

/** Kind of generated pivot row */
export type PivotRowType = 'leaf' | 'group' | 'subtotal' | 'grandTotal';

/** Information attached to every generated pivot row (under the `__pivot` property) */
export interface PivotRowInfo {
  /** Kind of row */
  type: PivotRowType;

  /** Key of the row header node */
  key: string;

  /** Depth of the row header node */
  level: number;

  /** Caption of the row */
  label: string;

  /** Whether the node has children */
  hasChildren: boolean;

  /** Whether the node is collapsed */
  collapsed: boolean;

  /** The row header node */
  node: PivotHeaderNode;
}

export interface OnPivotChangedEventArgs {
  /** Current spec */
  spec: PivotSpec;

  /** New result */
  result: PivotResult;
}

export interface OnPivotSpecChangedEventArgs {
  /** New spec */
  spec: PivotSpec;

  /** Previous spec */
  previousSpec: PivotSpec;
}

export interface OnPivotCellDrillDownEventArgs {
  /** Key of the row header node */
  rowKey: string;

  /** Key of the column header node */
  columnKey: string;

  /** Id of the value that was double-clicked */
  valueId?: string;

  /** Item values of the row node and its ancestors */
  rowPath: Record<string, any>;

  /** Item values of the column node and its ancestors */
  columnPath: Record<string, any>;

  /** Source rows behind the cell */
  rows: any[];
}

export interface OnPivotWriteBackEventArgs extends PivotCellEdit {
  /** The edited value */
  value: PivotValue;

  /**
   * Changes of the source rows (empty with a provider, which writes the data itself). After an undo, they go
   * from the edited values back to the previous ones, so `newValue` is always what the source row now holds.
   */
  changes: PivotWriteBackChange[];

  /** What wrote the values: a cell edit, `undo()` or `redo()` (`onBeforeWriteBack` is only raised for edits) */
  source: 'edit' | 'undo' | 'redo';
}

export interface OnPivotHistoryChangedEventArgs {
  /** Whether `undo()` has a write-back to take back */
  canUndo: boolean;

  /** Whether `redo()` has a write-back to apply again */
  canRedo: boolean;
}
