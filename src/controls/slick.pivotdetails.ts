import type { Column, GridOption, OnPivotCellDrillDownEventArgs, PivotField, PivotFieldType, PivotNumberFormat } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { SlickGrid as SlickGrid_ } from '../slick.grid.js';
import { PIVOT_VALUES_FIELD as PIVOT_VALUES_FIELD_ } from '../slick.pivotengine.js';
import type { SlickPivot } from '../plugins/slick.pivot.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const PIVOT_VALUES_FIELD = IIFE_ONLY ? Slick.PIVOT_VALUES_FIELD : PIVOT_VALUES_FIELD_;

/** The grid is resolved when the first dialog opens, so the scripts of an iife build can load in any order */
function getSlickGrid(): typeof SlickGrid_ {
  return IIFE_ONLY ? Slick.Grid : SlickGrid_;
}

/** Aggregators whose result is in the unit of the field, so a number format of their value suits the field itself */
const SAME_UNIT_AGGREGATORS = ['sum', 'avg', 'min', 'max', 'first', 'last', 'median'];

export interface PivotDetailsOption {
  /** Most source rows listed, defaults to 1,000 */
  maxRows: number;

  /** Ids of the fields shown as columns, in order, by default every field */
  fields?: string[];

  /** Columns of the details grid, in place of the ones made from the fields (their `field` reads the source rows) */
  columns?: Column[];

  /** Options of the details grid */
  gridOptions?: GridOption;

  /** Element the dialog is added to, defaults to the document body */
  container?: HTMLElement;

  /** Captions of the dialog */
  labels: {
    /** Caption of the close button, defaults to "Close" */
    close: string;

    /** Title of the dialog, by default "125 source rows — East › China / 2023" */
    title: (info: { count: number; countText: string; where: string; }) => string;

    /** Note shown when only the first `maxRows` rows are listed */
    truncated: (info: { shownText: string; countText: string; }) => string;
  };
}

/**
 * "Show Details" dialog of a pivot table: double-clicking a cell lists the source rows behind it in a
 * grid, in a modal dialog, like the details sheet of Excel. The columns are made from the pivot fields
 * (computed fields included) and formatted like the pivot; they can be sorted.
 *
 * @example
 * const details = new SlickPivotDetails(pivot);
 */
export class SlickPivotDetails {
  // --
  // public API

  /** Raised before the dialog opens for a cell, return `false` to keep it closed (to show the rows another way) */
  onBeforeShow = new SlickEvent<OnPivotCellDrillDownEventArgs>('onBeforeShow');

  /** Raised when the dialog was closed */
  onClose = new SlickEvent<{ details: SlickPivotDetails; }>('onClose');

  // --
  // protected props
  protected _options: PivotDetailsOption;
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _dialogElm?: HTMLDialogElement;
  protected _titleElm!: HTMLSpanElement;
  protected _noteElm!: HTMLDivElement;
  protected _gridElm!: HTMLDivElement;
  protected _grid?: SlickGrid_;
  protected _gridRtl = false;
  protected _items: any[] = [];
  protected _defaults: PivotDetailsOption = {
    maxRows: 1000,
    labels: {
      close: 'Close',
      title: ({ count, countText, where }) => `${countText} source ${count === 1 ? 'row' : 'rows'} — ${where}`,
      truncated: ({ shownText, countText }) => `Showing the first ${shownText} of ${countText} rows.`,
    },
  };

  constructor(protected readonly pivot: SlickPivot, options?: Partial<PivotDetailsOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
    if (options?.columns) {
      this._options.columns = options.columns;
    }
    if (options?.fields) {
      this._options.fields = options.fields;
    }
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();
    this._eventHandler.subscribe(this.pivot.onPivotCellDrillDown, (_e, args) => this.show(args));
  }

  /** Close the dialog, destroy its grid and remove it */
  destroy(): void {
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onBeforeShow.unsubscribe();
    this.onClose.unsubscribe();
    this._grid?.destroy();
    this._grid = undefined;
    this._dialogElm?.remove();
    this._dialogElm = undefined;
  }

  getOptions(): PivotDetailsOption {
    return this._options;
  }

  /** The grid listing the source rows (created when the dialog first opens) */
  getGrid(): SlickGrid_ | undefined {
    return this._grid;
  }

  /** Whether the dialog is open */
  isOpen(): boolean {
    return !!this._dialogElm?.open;
  }

  /** Open the dialog with the source rows of a cell (as given by `onPivotCellDrillDown`) */
  show(args: OnPivotCellDrillDownEventArgs): void {
    if (this.onBeforeShow.notify(args).getReturnValue() === false) {
      return;
    }
    const dialog = this._dialogElm ?? this.createDialog();
    const { labels, maxRows } = this._options;
    const locale = this.getLocale();
    const rows = args.rows.slice(0, maxRows);
    const fields = this._options.columns ? [] : this.getFields();
    const columns = this._options.columns ?? this.createColumns(fields, rows);
    const engine = this.pivot.getEngine();
    // computed fields have no property to read: the items hold the value of every field
    this._items = this._options.columns
      ? rows.slice()
      : rows.map((row) => fields.reduce((item, field) => {
        item[field.id] = engine.getFieldValue(field.id, row);
        return item;
      }, {} as Record<string, any>));

    const count = args.rows.length;
    this._titleElm.textContent = labels.title({ count, countText: count.toLocaleString(locale), where: this.describeCell(args) });
    this._noteElm.textContent = count > rows.length ? labels.truncated({ shownText: rows.length.toLocaleString(locale), countText: count.toLocaleString(locale) }) : '';

    const rtl = !!this.pivot.getGrid()?.getOptions().rtl;
    dialog.dir = rtl ? 'rtl' : 'ltr';
    if (!dialog.open) {
      dialog.showModal();
    }
    if (this._grid && this._gridRtl !== rtl) {
      // the reading direction of a grid is set when it is created
      this._grid.destroy();
      this._grid = undefined;
    }
    if (!this._grid) {
      const SlickGrid = getSlickGrid();
      this._gridRtl = rtl;
      this._grid = new SlickGrid(this._gridElm, this._items, columns, { enableCellNavigation: true, multiColumnSort: false, rtl, ...this._options.gridOptions });
      this._grid.onSort.subscribe((_e, sortArgs: any) => this.sortItems(sortArgs.sortCol ?? sortArgs.sortCols?.[0]?.sortCol, sortArgs.sortAsc ?? sortArgs.sortCols?.[0]?.sortAsc ?? true));
    } else {
      this._grid.setSortColumns([]);
      this._grid.setColumns(columns);
      this._grid.setData(this._items, true);
      this._grid.render();
    }
    this._grid.resizeCanvas();
  }

  /** Close the dialog */
  close(): void {
    if (this._dialogElm?.open) {
      this._dialogElm.close();
    }
  }

  // --
  // protected functions
  // -----------------

  protected createDialog(): HTMLDialogElement {
    const container = this._options.container ?? document.body;
    const dialog = Utils.createDomElement('dialog', { className: 'slick-pivot-details' }, container);
    const titleId = `slick-pivot-details-title-${Math.random().toString(36).slice(2, 8)}`;
    dialog.setAttribute('aria-labelledby', titleId);

    const header = Utils.createDomElement('div', { className: 'slick-pivot-details-header' }, dialog);
    this._titleElm = Utils.createDomElement('span', { className: 'slick-pivot-details-title', id: titleId }, header);
    const closeButton = Utils.createDomElement('button', { className: 'slick-pivot-details-close', type: 'button', textContent: this._options.labels.close }, header);
    this._noteElm = Utils.createDomElement('div', { className: 'slick-pivot-details-note' }, dialog);
    this._gridElm = Utils.createDomElement('div', { className: 'slick-pivot-details-grid slick-container' }, dialog);

    this._bindingEventService.bind(closeButton, 'click', () => this.close());
    this._bindingEventService.bind(dialog, 'close', () => this.onClose.notify({ details: this }));
    // a click on the backdrop (outside of the dialog box) closes it, like Escape
    this._bindingEventService.bind(dialog, 'click', ((e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) {
        this.close();
      }
    }) as EventListener);
    this._dialogElm = dialog;
    return dialog;
  }

  protected getLocale(): string | string[] | undefined {
    const options = this.pivot.getOptions();
    return options.locale ?? options.numberFormat?.locale;
  }

  protected getFields(): PivotField[] {
    const engine = this.pivot.getEngine();
    return this._options.fields
      ? this._options.fields.map((id) => engine.getField(id)).filter((field): field is PivotField => !!field)
      : engine.getFields();
  }

  /** "East › China / 2023": the items of the row and of the column of the cell */
  protected describeCell(args: OnPivotCellDrillDownEventArgs): string {
    const engine = this.pivot.getEngine();
    const options = this.pivot.getOptions();
    const describe = (path: Record<string, any>) => Object.keys(path)
      .filter((field) => field !== PIVOT_VALUES_FIELD)
      .map((field) => engine.formatItem(field, path[field], options.blankLabel))
      .join(' › ');
    return [describe(args.rowPath), describe(args.columnPath)].filter(Boolean).join(' / ') || this.pivot.getSpec().grandTotals?.label || options.grandTotalLabel || 'Grand Total';
  }

  protected createColumns(fields: PivotField[], rows: any[]): Column[] {
    const engine = this.pivot.getEngine();
    const sample = rows.slice(0, 50);
    return fields.map((field) => {
      const type = engine.inferFieldType(sample, field.id);
      const format = this.createValueFormatter(field, type);
      const name = engine.getFieldLabel(field.id);
      const longest = sample.reduce((width, row) => Math.max(width, format(engine.getFieldValue(field.id, row)).length), 0);
      return {
        id: field.id,
        name,
        field: field.id,
        sortable: true,
        // wide enough for the values and for the header with its sort indicator
        width: Math.min(260, Math.max(70, Math.round(Math.max(longest * 7.5, name.length * 7.5 + 18)) + 18)),
        cssClass: type === 'number' ? 'slick-pivot-details-number' : undefined,
        formatter: (_row: number, _cell: number, value: any) => escapeHtml(format(value)),
      } as Column;
    });
  }

  /** Numbers in the format of a value summarizing the field (for example a currency), dates and items like the pivot */
  protected createValueFormatter(field: PivotField, type: PivotFieldType): (value: any) => string {
    const engine = this.pivot.getEngine();
    if (type !== 'number') {
      return (value) => engine.formatItem(field.id, value, '');
    }
    const options = this.pivot.getOptions();
    const value = this.pivot.getSpec().values.find((item) => item.field === field.id && item.numberFormat && !item.showAs && SAME_UNIT_AGGREGATORS.includes(item.aggregator));
    // without the format of a value, numbers are shown as they are (years, codes and ids have no thousands separators)
    const { locale, ...format }: PivotNumberFormat = value
      ? { maximumFractionDigits: 2, ...options.numberFormat, ...value.numberFormat }
      : { maximumFractionDigits: 2, useGrouping: false, ...options.numberFormat };
    const numberFormat = new Intl.NumberFormat(locale ?? this.getLocale(), format);
    return (item) => (typeof item === 'number' && !Number.isNaN(item) ? numberFormat.format(item) : engine.formatItem(field.id, item, ''));
  }

  protected sortItems(column: Column | undefined, sortAsc: boolean): void {
    const field = column?.field as string | undefined;
    if (!field || !this._grid) {
      return;
    }
    const collator = new Intl.Collator(this.getLocale(), { numeric: true, sensitivity: 'base' });
    const isBlank = (value: any) => value === undefined || value === null || value === '';
    const direction = sortAsc ? 1 : -1;
    this._items.sort((a, b) => {
      const x = a[field];
      const y = b[field];
      // blanks stay last in both directions
      if (isBlank(x) || isBlank(y)) {
        return isBlank(x) === isBlank(y) ? 0 : isBlank(x) ? 1 : -1;
      }
      if ((typeof x === 'number' || x instanceof Date) && (typeof y === 'number' || y instanceof Date)) {
        return (+x - +y) * direction;
      }
      return collator.compare(String(x), String(y)) * direction;
    });
    this._grid.invalidate();
  }
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[char]!));
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.PivotDetails = SlickPivotDetails;
}
