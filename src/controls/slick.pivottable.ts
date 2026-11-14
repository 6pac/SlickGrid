import type { GridOption, PivotOption, PivotResult } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { SlickGrid as SlickGrid_ } from '../slick.grid.js';
import { SlickPivot as SlickPivot_ } from '../plugins/slick.pivot.js';
import { type PivotDetailsOption, SlickPivotDetails as SlickPivotDetails_ } from './slick.pivotdetails.js';
import { type PivotPanelOption, SlickPivotPanel as SlickPivotPanel_ } from './slick.pivotpanel.js';
import { type PivotToolbarOption, SlickPivotToolbar as SlickPivotToolbar_ } from './slick.pivottoolbar.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/** The parts are resolved when the pivot table is created, so the scripts of an iife build can load in any order */
function getParts() {
  return IIFE_ONLY
    ? { SlickGrid: Slick.Grid, SlickPivot: Slick.Pivot, SlickPivotPanel: Slick.Controls.PivotPanel, SlickPivotToolbar: Slick.Controls.PivotToolbar, SlickPivotDetails: Slick.Controls.PivotDetails }
    : { SlickGrid: SlickGrid_, SlickPivot: SlickPivot_, SlickPivotPanel: SlickPivotPanel_, SlickPivotToolbar: SlickPivotToolbar_, SlickPivotDetails: SlickPivotDetails_ };
}

export interface PivotTableFieldListOption extends Partial<PivotPanelOption> {
  /** Show the field list when the pivot table is created, defaults to true */
  visible?: boolean;

  /** Side of the field list: `end` (the right in a left-to-right page) or `start`, defaults to `end` */
  position?: 'start' | 'end';

  /** Width of the field list, in pixels, defaults to 300 */
  width?: number;

  /** Narrowest width the field list can be resized to, in pixels, defaults to 240 */
  minWidth?: number;

  /** Widest width the field list can be resized to, in pixels, by default 60% of the pivot table */
  maxWidth?: number;

  /** Let users resize the field list by dragging its splitter or with its arrow keys, defaults to true */
  resizable?: boolean;

  /** Accessible name of the splitter, defaults to "Resize the field list" */
  resizeLabel?: string;
}

export interface PivotTableStatusBarOption {
  /** Text of the status bar, by default "5,000 of 5,000 source rows · 17 rows × 5 columns · computed in 15 ms" */
  formatter?: (info: { result: PivotResult; rowCount: number; columnCount: number; locale?: string | string[]; }) => string;

  /** Text shown while an asynchronous provider computes, defaults to "Calculating…" */
  loadingText?: string;
}

/** Options of the pivot table: the options of the pivot (fields, source, spec, …) and of each of its parts */
export interface PivotTableOption extends PivotOption {
  /** Options of the grid, merged with the ones the pivot needs (`SlickPivot.getGridOptions()`) */
  gridOptions?: GridOption;

  /** The toolbar above the grid, or `false` to leave it out */
  toolbar?: boolean | Partial<PivotToolbarOption>;

  /** The PivotTable Fields pane beside the grid, or `false` to leave it out */
  fieldList?: boolean | PivotTableFieldListOption;

  /** The dialog listing the source rows of a double-clicked cell, or `false` to leave it out (`onPivotCellDrillDown` is still raised) */
  details?: boolean | Partial<PivotDetailsOption>;

  /** The status bar below the grid, or `false` to leave it out */
  statusBar?: boolean | PivotTableStatusBarOption;
}

/**
 * Ready-made pivot table: the pivot grid with its toolbar, a resizable PivotTable Fields pane, a
 * status bar and the "Show Details" dialog, in one container. Each part is the plugin or control of
 * the same name, reachable from the pivot table for anything its options do not cover.
 *
 * The container needs a height: the grid takes the space left by the toolbar and the status bar.
 *
 * @example
 * const pivotTable = new SlickPivotTable('#pivotTable', { source: rows, fields, spec: { rows: ['Region'], columns: ['Year'], values: [{ field: 'Amount', aggregator: 'sum' }] } });
 */
export class SlickPivotTable {
  // --
  // public API

  /** Raised when the field list was shown or hidden */
  onFieldListToggled = new SlickEvent<{ visible: boolean; }>('onFieldListToggled');

  /** Raised when the user resized the field list */
  onFieldListResized = new SlickEvent<{ width: number; }>('onFieldListResized');

  // --
  // protected props
  protected _container: HTMLElement;
  protected _options: PivotTableOption;
  protected _fieldListOptions: PivotTableFieldListOption & Required<Pick<PivotTableFieldListOption, 'visible' | 'position' | 'width' | 'minWidth' | 'resizable' | 'resizeLabel'>>;
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _rootElm!: HTMLDivElement;
  protected _bodyElm!: HTMLDivElement;
  protected _gridElm!: HTMLDivElement;
  protected _splitterElm?: HTMLDivElement;
  protected _fieldListElm?: HTMLDivElement;
  protected _statusElm?: HTMLDivElement;
  protected _grid: SlickGrid_;
  protected _pivot: SlickPivot_;
  protected _fieldList?: SlickPivotPanel_;
  protected _toolbar?: SlickPivotToolbar_;
  protected _details?: SlickPivotDetails_;
  protected _fieldListVisible = false;
  protected _fieldListWidth: number;
  protected _resizeObserver?: ResizeObserver;
  protected _resizeFrame?: number;
  protected _dragPointerId?: number;

  constructor(containerOrSelector: HTMLElement | string, options: PivotTableOption) {
    const container = typeof containerOrSelector === 'string' ? document.querySelector<HTMLElement>(containerOrSelector) : containerOrSelector;
    if (!container) {
      throw new Error('[SlickPivotTable] the pivot table container was not found.');
    }
    this._container = container;
    this._options = options;
    const { gridOptions, toolbar, fieldList, details, statusBar, ...pivotOptions } = options;
    // the other field list options are the ones of the PivotTable Fields pane
    const panelOptions: Partial<PivotPanelOption> & PivotTableFieldListOption = { ...(typeof fieldList === 'object' ? fieldList : {}) };
    (['visible', 'position', 'width', 'minWidth', 'maxWidth', 'resizable', 'resizeLabel'] as const).forEach((key) => delete panelOptions[key]);
    this._fieldListOptions = { visible: true, position: 'end', width: 300, minWidth: 240, resizable: true, resizeLabel: 'Resize the field list', ...(typeof fieldList === 'object' ? fieldList : {}) };
    this._fieldListWidth = this._fieldListOptions.width;
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();

    const toolbarOptions: Partial<PivotToolbarOption> = typeof toolbar === 'object' ? { ...toolbar } : {};
    if (fieldList !== false && !toolbarOptions.items) {
      toolbarOptions.items = ['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo', 'fieldList'];
    }
    // the field list can only be closed when the toolbar can open it again
    const canHideFieldList = toolbar !== false && !!toolbarOptions.items?.includes('fieldList');
    this.createLayout(toolbar !== false, fieldList !== false, statusBar !== false, !!gridOptions?.rtl);

    const { SlickGrid, SlickPivot, SlickPivotPanel, SlickPivotToolbar, SlickPivotDetails } = getParts();
    this._pivot = new SlickPivot(pivotOptions);
    this._grid = new SlickGrid(this._gridElm, this._pivot.rowModel, this._pivot.getColumns(), SlickPivot.getGridOptions({ enableCellNavigation: true, ...gridOptions }));
    this._grid.registerPlugin(this._pivot);

    if (this._fieldListElm) {
      this._fieldList = new SlickPivotPanel(this._pivot, this._fieldListElm, { showCloseButton: canHideFieldList, ...panelOptions });
      this._fieldList.onClose.subscribe(() => {
        this.setFieldListVisible(false);
        this._toolbar?.getElement().querySelector<HTMLElement>('[data-item="fieldList"]')?.focus();
      });
    }
    if (toolbar !== false) {
      this._toolbar = new SlickPivotToolbar(this._pivot, this._rootElm.querySelector<HTMLElement>('.slick-pivot-table-toolbar')!, toolbarOptions);
      this._toolbar.onFieldListToggle.subscribe((_e, args) => this.setFieldListVisible(args.visible));
    }
    if (details !== false) {
      this._details = new SlickPivotDetails(this._pivot, typeof details === 'object' ? details : {});
    }
    if (this._statusElm) {
      this._eventHandler
        .subscribe(this._pivot.onPivotChanged, () => this.renderStatus())
        .subscribe(this._pivot.onLoadingChanged, () => this.renderStatus());
      this.renderStatus();
    }

    this.setFieldListVisible(!!this._fieldListElm && this._fieldListOptions.visible, false);
    this.setFieldListWidth(this._fieldListWidth, false);
    if (typeof ResizeObserver !== 'undefined') {
      // the grid follows the size of its element: the pivot table, the field list or the toolbar wrapping
      this._resizeObserver = new ResizeObserver(() => this.scheduleResize());
      this._resizeObserver.observe(this._gridElm);
    }
  }

  /** Destroy the grid, the pivot and every part, and remove the pivot table from its container */
  destroy(): void {
    if (this._resizeFrame !== undefined) {
      cancelAnimationFrame(this._resizeFrame);
    }
    this._resizeObserver?.disconnect();
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onFieldListToggled.unsubscribe();
    this.onFieldListResized.unsubscribe();
    this._details?.destroy();
    this._toolbar?.destroy();
    this._fieldList?.destroy();
    // destroying the grid destroys the plugins registered with it, the pivot included
    this._grid.destroy();
    this._rootElm.remove();
  }

  getOptions(): PivotTableOption {
    return this._options;
  }

  /** The pivot table element */
  getElement(): HTMLDivElement {
    return this._rootElm;
  }

  /** The grid showing the pivot */
  getGrid(): SlickGrid_ {
    return this._grid;
  }

  /** The pivot plugin: spec, fields, source rows, events, … */
  getPivot(): SlickPivot_ {
    return this._pivot;
  }

  /** The PivotTable Fields pane, unless `fieldList` is false */
  getFieldList(): SlickPivotPanel_ | undefined {
    return this._fieldList;
  }

  /** The toolbar, unless `toolbar` is false */
  getToolbar(): SlickPivotToolbar_ | undefined {
    return this._toolbar;
  }

  /** The details dialog, unless `details` is false */
  getDetails(): SlickPivotDetails_ | undefined {
    return this._details;
  }

  /** Whether the field list is shown */
  isFieldListVisible(): boolean {
    return this._fieldListVisible;
  }

  /** Show or hide the field list */
  setFieldListVisible(visible: boolean, notify = true): void {
    if (!this._fieldListElm || !this._splitterElm) {
      return;
    }
    const changed = visible !== this._fieldListVisible;
    this._fieldListVisible = visible;
    this._fieldListElm.hidden = !visible;
    this._splitterElm.hidden = !visible || !this._fieldListOptions.resizable;
    this._toolbar?.setFieldListVisible(visible);
    if (visible) {
      // the widest width depends on the width of the pivot table, which may have changed while hidden
      this.setFieldListWidth(this._fieldListWidth, false);
    }
    if (changed && notify) {
      this.onFieldListToggled.notify({ visible });
    }
  }

  /** Show the field list if hidden, hide it if shown */
  toggleFieldList(): void {
    this.setFieldListVisible(!this._fieldListVisible);
  }

  /** Width of the field list, in pixels */
  getFieldListWidth(): number {
    return this._fieldListWidth;
  }

  /** Resize the field list, within its narrowest and widest widths */
  setFieldListWidth(width: number, notify = true): void {
    if (!this._fieldListElm || !this._splitterElm) {
      return;
    }
    const { minWidth } = this._fieldListOptions;
    const maxWidth = this.getMaxFieldListWidth();
    this._fieldListWidth = Math.round(Math.min(maxWidth, Math.max(minWidth, width)));
    this._fieldListElm.style.width = `${this._fieldListWidth}px`;
    this._splitterElm.setAttribute('aria-valuemin', String(minWidth));
    this._splitterElm.setAttribute('aria-valuemax', String(maxWidth));
    this._splitterElm.setAttribute('aria-valuenow', String(this._fieldListWidth));
    if (notify) {
      this.onFieldListResized.notify({ width: this._fieldListWidth });
    }
  }

  /** Resize the grid to its element, for a pivot table whose size changed while a ResizeObserver is not available */
  resizeCanvas(): void {
    this._grid.resizeCanvas();
  }

  // --
  // protected functions
  // -----------------

  protected createLayout(toolbar: boolean, fieldList: boolean, statusBar: boolean, rtl: boolean): void {
    this._rootElm = Utils.createDomElement('div', { className: 'slick-pivot-table', dir: rtl ? 'rtl' : 'ltr' }, this._container);
    if (toolbar) {
      Utils.createDomElement('div', { className: 'slick-pivot-table-toolbar' }, this._rootElm);
    }
    this._bodyElm = Utils.createDomElement('div', { className: `slick-pivot-table-body slick-pivot-table-fields-${this._fieldListOptions.position}` }, this._rootElm);
    this._gridElm = Utils.createDomElement('div', { className: 'slick-pivot-table-grid slick-container' }, this._bodyElm);

    if (fieldList) {
      const fieldListId = `slick-pivot-table-fields-${Math.random().toString(36).slice(2, 8)}`;
      this._splitterElm = Utils.createDomElement('div', { className: 'slick-pivot-table-splitter', role: 'separator', tabIndex: 0, ariaLabel: this._fieldListOptions.resizeLabel }, this._bodyElm);
      this._splitterElm.setAttribute('aria-orientation', 'vertical');
      this._splitterElm.setAttribute('aria-controls', fieldListId);
      this._fieldListElm = Utils.createDomElement('div', { className: 'slick-pivot-table-fields', id: fieldListId }, this._bodyElm);
      this._bindingEventService.bind(this._splitterElm, 'pointerdown', this.handleSplitterPointerDown.bind(this) as EventListener);
      this._bindingEventService.bind(this._splitterElm, 'pointermove', this.handleSplitterPointerMove.bind(this) as EventListener);
      this._bindingEventService.bind(this._splitterElm, 'pointerup', this.handleSplitterPointerUp.bind(this) as EventListener);
      this._bindingEventService.bind(this._splitterElm, 'pointercancel', this.handleSplitterPointerUp.bind(this) as EventListener);
      this._bindingEventService.bind(this._splitterElm, 'keydown', this.handleSplitterKeyDown.bind(this) as EventListener);
    }
    if (statusBar) {
      this._statusElm = Utils.createDomElement('div', { className: 'slick-pivot-table-status' }, this._rootElm);
    }
  }

  protected getMaxFieldListWidth(): number {
    const { minWidth, maxWidth } = this._fieldListOptions;
    const bodyWidth = this._bodyElm.clientWidth;
    return Math.max(minWidth, maxWidth ?? (bodyWidth ? Math.round(bodyWidth * 0.6) : Number.MAX_SAFE_INTEGER));
  }

  /** Whether the field list is drawn to the right of the splitter (it depends on its position and on the reading direction) */
  protected isFieldListOnTheRight(): boolean {
    return this._fieldListElm!.getBoundingClientRect().left >= this._splitterElm!.getBoundingClientRect().left;
  }

  protected scheduleResize(): void {
    if (this._resizeFrame === undefined) {
      this._resizeFrame = requestAnimationFrame(() => {
        this._resizeFrame = undefined;
        this._grid.resizeCanvas();
      });
    }
  }

  protected renderStatus(): void {
    const statusElm = this._statusElm;
    const result = this._pivot.getResult();
    if (!statusElm) {
      return;
    }
    const statusBar: PivotTableStatusBarOption = typeof this._options.statusBar === 'object' ? this._options.statusBar : {};
    const pivotOptions = this._pivot.getOptions();
    const locale = pivotOptions.locale ?? pivotOptions.numberFormat?.locale;
    statusElm.classList.toggle('slick-pivot-table-status-loading', this._pivot.isLoading());
    if (this._pivot.isLoading()) {
      statusElm.textContent = statusBar.loadingText ?? 'Calculating…';
    } else if (result) {
      const info = { result, rowCount: this._grid.getDataLength(), columnCount: this._grid.getColumns().length, locale };
      statusElm.textContent = (statusBar.formatter ?? SlickPivotTable.formatStatus)(info);
    }
  }

  /** Default text of the status bar */
  static formatStatus(info: { result: PivotResult; rowCount: number; columnCount: number; locale?: string | string[]; }): string {
    const { result, rowCount, columnCount, locale } = info;
    const format = (count: number) => count.toLocaleString(locale);
    const parts: string[] = [];
    if (typeof result.sourceRowCount === 'number' && typeof result.filteredRowCount === 'number') {
      parts.push(`${format(result.filteredRowCount)} of ${format(result.sourceRowCount)} source rows`);
    }
    parts.push(`${format(rowCount)} rows × ${format(columnCount)} columns`);
    if (typeof result.duration === 'number') {
      parts.push(`computed in ${format(Math.round(result.duration))} ms`);
    }
    return parts.join(' · ');
  }

  protected handleSplitterPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || !this._fieldListOptions.resizable) {
      return;
    }
    e.preventDefault();
    this._dragPointerId = e.pointerId;
    this._splitterElm!.setPointerCapture?.(e.pointerId);
    this._rootElm.classList.add('slick-pivot-table-resizing');
  }

  protected handleSplitterPointerMove(e: PointerEvent): void {
    if (this._dragPointerId !== e.pointerId) {
      return;
    }
    const rect = this._fieldListElm!.getBoundingClientRect();
    const splitterWidth = this._splitterElm!.getBoundingClientRect().width;
    // the pointer stays over the middle of the splitter
    const width = this.isFieldListOnTheRight() ? rect.right - e.clientX - splitterWidth / 2 : e.clientX - rect.left - splitterWidth / 2;
    this.setFieldListWidth(width, false);
  }

  protected handleSplitterPointerUp(e: PointerEvent): void {
    if (this._dragPointerId !== e.pointerId) {
      return;
    }
    this._dragPointerId = undefined;
    this._splitterElm!.releasePointerCapture?.(e.pointerId);
    this._rootElm.classList.remove('slick-pivot-table-resizing');
    this.onFieldListResized.notify({ width: this._fieldListWidth });
  }

  /** The arrow keys move the splitter the way they point (Shift for bigger steps), Home and End make the field list narrowest and widest */
  protected handleSplitterKeyDown(e: KeyboardEvent): void {
    const step = e.shiftKey ? 64 : 16;
    let width: number | undefined;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const towardsFieldList = (e.key === 'ArrowRight') === this.isFieldListOnTheRight();
      width = this._fieldListWidth + (towardsFieldList ? -step : step);
    } else if (e.key === 'Home') {
      width = this._fieldListOptions.minWidth;
    } else if (e.key === 'End') {
      width = this.getMaxFieldListWidth();
    }
    if (width !== undefined) {
      e.preventDefault();
      this.setFieldListWidth(width);
    }
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.PivotTable = SlickPivotTable;
}
