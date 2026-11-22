import type { PivotResult, SlickPlugin } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
import type { SlickPivot } from './slick.pivot.js';
import { type PivotDetailsOption, SlickPivotDetails as SlickPivotDetails_ } from '../controls/slick.pivotdetails.js';
import { type PivotPanelOption, SlickPivotPanel as SlickPivotPanel_ } from '../controls/slick.pivotpanel.js';
import { type PivotToolbarOption, SlickPivotToolbar as SlickPivotToolbar_ } from '../controls/slick.pivottoolbar.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/** The parts are resolved when the plugin is registered, so the scripts of an iife build can load in any order */
function getParts() {
  return IIFE_ONLY
    ? { SlickPivotPanel: Slick.Controls.PivotPanel, SlickPivotToolbar: Slick.Controls.PivotToolbar, SlickPivotDetails: Slick.Controls.PivotDetails }
    : { SlickPivotPanel: SlickPivotPanel_, SlickPivotToolbar: SlickPivotToolbar_, SlickPivotDetails: SlickPivotDetails_ };
}

export interface PivotStatusBarOption {
  /** Text of the status bar, by default "5,000 of 5,000 source rows · 17 rows × 5 columns · computed in 15 ms" */
  formatter?: (info: { result: PivotResult; rowCount: number; columnCount: number; locale?: string | string[]; }) => string;

  /** Text shown while an asynchronous provider computes, defaults to "Calculating…" */
  loadingText?: string;
}

export interface PivotFieldListOption {
  /**
   * Element (or selector) holding the grid, the application's own. The plugin adds the toolbar above the grid,
   * the PivotTable Fields pane beside it and the status bar below it, as children of this element and without
   * moving the grid. The grid (or the element holding it) must be the only other child of the container.
   */
  container: HTMLElement | string;

  /** The pivot plugin, by default the one registered with the grid (register it first) */
  pivot?: SlickPivot;

  /** Options of the PivotTable Fields pane (captions, number formats, …) */
  panel?: Partial<PivotPanelOption>;

  /** Show the PivotTable Fields pane when the plugin is registered, defaults to true */
  visible?: boolean;

  /** Side of the pane: `end` (the right in a left-to-right page) or `start`, defaults to `end` */
  position?: 'start' | 'end';

  /** Width of the pane, in pixels, defaults to 300 */
  width?: number;

  /** Narrowest width the pane can be resized to, in pixels, defaults to 240 */
  minWidth?: number;

  /** Widest width the pane can be resized to, in pixels, by default 60% of the container */
  maxWidth?: number;

  /** Let users resize the pane by dragging its splitter or with its arrow keys, defaults to true */
  resizable?: boolean;

  /** Accessible name of the splitter, defaults to "Resize the field list" */
  resizeLabel?: string;

  /** The toolbar above the grid, or `false` to leave it out */
  toolbar?: boolean | Partial<PivotToolbarOption>;

  /** The dialog listing the source rows of a double-clicked cell, or `false` to leave it out (`onPivotCellDrillDown` is still raised) */
  details?: boolean | Partial<PivotDetailsOption>;

  /** The status bar below the grid, or `false` to leave it out */
  statusBar?: boolean | PivotStatusBarOption;
}

type ResolvedFieldListOption = PivotFieldListOption & Required<Pick<PivotFieldListOption, 'visible' | 'position' | 'width' | 'minWidth' | 'resizable' | 'resizeLabel'>>;

/**
 * Excel style pivot UI, registered with the grid after the pivot plugin: the PivotTable Fields pane (with its Pivot
 * Mode switch) in a resizable sidebar, a toolbar, a status bar and the "Show Details" dialog, laid out around the
 * application's own grid in a container that holds it. Each part is the control of the same name, reachable from
 * the plugin for anything its options do not cover.
 *
 * @example
 * const grid = new SlickGrid('#myGrid', dataView, columns, SlickPivot.getGridOptions(gridOptions));
 * grid.registerPlugin(new SlickPivot({ spec }));
 * grid.registerPlugin(new SlickPivotFieldList({ container: '#gridAndPivot' }));
 */
export class SlickPivotFieldList implements SlickPlugin {
  // --
  // public API
  pluginName = 'PivotFieldList' as const;

  /** Raised when the PivotTable Fields pane was shown or hidden */
  onToggled = new SlickEvent<{ visible: boolean; }>('onToggled');

  /** Raised when the user resized the PivotTable Fields pane */
  onResized = new SlickEvent<{ width: number; }>('onResized');

  // --
  // protected props
  protected _options: ResolvedFieldListOption;
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _grid?: SlickGrid;
  protected _pivot?: SlickPivot;
  protected _container?: HTMLElement;
  protected _previousDir?: string | null;
  protected _toolbarElm?: HTMLDivElement;
  protected _splitterElm?: HTMLDivElement;
  protected _paneElm?: HTMLDivElement;
  protected _statusElm?: HTMLDivElement;
  protected _panel?: SlickPivotPanel_;
  protected _toolbar?: SlickPivotToolbar_;
  protected _details?: SlickPivotDetails_;
  protected _visible = false;
  protected _width: number;
  protected _resizeObserver?: ResizeObserver;
  protected _resizeFrame?: number;
  protected _dragPointerId?: number;

  constructor(options: PivotFieldListOption) {
    this._options = { visible: true, position: 'end', width: 300, minWidth: 240, resizable: true, resizeLabel: 'Resize the field list', ...options };
    this._width = this._options.width;
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();
  }

  init(grid: SlickGrid): void {
    const options = this._options;
    const pivot = options.pivot ?? grid.getPluginByName<SlickPivot>('Pivot');
    if (!pivot) {
      throw new Error('[SlickPivotFieldList] no pivot plugin, register the SlickPivot plugin with the grid first (or give it in the "pivot" option).');
    }
    const container = typeof options.container === 'string' ? document.querySelector<HTMLElement>(options.container) : options.container;
    if (!container || !container.contains(grid.getContainerNode())) {
      throw new Error('[SlickPivotFieldList] the container was not found, or does not hold the grid.');
    }
    this._grid = grid;
    this._pivot = pivot;
    this._container = container;

    const { toolbar, details, statusBar } = options;
    const toolbarOptions: Partial<PivotToolbarOption> = typeof toolbar === 'object' ? { ...toolbar } : {};
    toolbarOptions.items ??= ['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo', 'fieldList'];
    // the pane can only be closed when the toolbar can open it again
    const canHide = toolbar !== false && toolbarOptions.items.includes('fieldList');
    this.createLayout(toolbar !== false, statusBar !== false, !!grid.getOptions().rtl);

    const { SlickPivotPanel, SlickPivotToolbar, SlickPivotDetails } = getParts();
    this._panel = new SlickPivotPanel(pivot, this._paneElm!, { showCloseButton: canHide, ...options.panel });
    this._panel.onClose.subscribe(() => {
      this.setVisible(false);
      this._toolbar?.getElement().querySelector<HTMLElement>('[data-item="fieldList"]')?.focus();
    });
    if (this._toolbarElm) {
      this._toolbar = new SlickPivotToolbar(pivot, this._toolbarElm, toolbarOptions);
      this._toolbar.onFieldListToggle.subscribe((_e, args) => this.setVisible(args.visible));
    }
    if (details !== false) {
      this._details = new SlickPivotDetails(pivot, typeof details === 'object' ? details : {});
    }
    if (this._statusElm) {
      this._eventHandler
        .subscribe(pivot.onPivotChanged, () => this.renderStatus())
        .subscribe(pivot.onLoadingChanged, () => this.renderStatus())
        .subscribe(pivot.onPivotModeChanged, () => this.renderStatus());
      this.renderStatus();
    }

    this.setVisible(options.visible, false);
    this.setWidth(this._width, false);
    if (typeof ResizeObserver !== 'undefined') {
      // the grid follows the size of its element: the container, the pane or the toolbar wrapping
      this._resizeObserver = new ResizeObserver(() => this.scheduleResize());
      this._resizeObserver.observe(grid.getContainerNode());
    }
  }

  /** Remove the toolbar, the pane, the status bar and the dialog, leaving the grid and the pivot plugin as they are */
  destroy(): void {
    if (this._resizeFrame !== undefined) {
      cancelAnimationFrame(this._resizeFrame);
    }
    this._resizeObserver?.disconnect();
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onToggled.unsubscribe();
    this.onResized.unsubscribe();
    this._details?.destroy();
    this._toolbar?.destroy();
    this._panel?.destroy();
    [this._toolbarElm, this._splitterElm, this._paneElm, this._statusElm].forEach((elm) => elm?.remove());
    const container = this._container;
    if (container) {
      container.classList.remove('slick-pivot-layout', 'slick-pivot-layout-fields-start', 'slick-pivot-layout-fields-end', 'slick-pivot-layout-resizing');
      if (this._previousDir !== undefined) {
        this._previousDir === null ? container.removeAttribute('dir') : container.setAttribute('dir', this._previousDir);
      }
    }
    this._container = undefined;
  }

  getOptions(): PivotFieldListOption {
    return this._options;
  }

  /** The container holding the grid and the parts of the plugin */
  getContainer(): HTMLElement | undefined {
    return this._container;
  }

  /** The grid the plugin is registered with */
  getGrid(): SlickGrid | undefined {
    return this._grid;
  }

  /** The pivot plugin */
  getPivot(): SlickPivot | undefined {
    return this._pivot;
  }

  /** The PivotTable Fields pane */
  getPanel(): SlickPivotPanel_ | undefined {
    return this._panel;
  }

  /** The toolbar, unless `toolbar` is false */
  getToolbar(): SlickPivotToolbar_ | undefined {
    return this._toolbar;
  }

  /** The details dialog, unless `details` is false */
  getDetails(): SlickPivotDetails_ | undefined {
    return this._details;
  }

  /** Whether the PivotTable Fields pane is shown */
  isVisible(): boolean {
    return this._visible;
  }

  /** Show or hide the PivotTable Fields pane */
  setVisible(visible: boolean, notify = true): void {
    if (!this._paneElm || !this._splitterElm) {
      return;
    }
    const changed = visible !== this._visible;
    this._visible = visible;
    this._paneElm.hidden = !visible;
    this._splitterElm.hidden = !visible || !this._options.resizable;
    this._toolbar?.setFieldListVisible(visible);
    if (visible) {
      // the widest width depends on the width of the container, which may have changed while hidden
      this.setWidth(this._width, false);
    }
    if (changed && notify) {
      this.onToggled.notify({ visible });
    }
  }

  /** Show the PivotTable Fields pane if hidden, hide it if shown */
  toggle(): void {
    this.setVisible(!this._visible);
  }

  /** Width of the PivotTable Fields pane, in pixels */
  getWidth(): number {
    return this._width;
  }

  /** Resize the PivotTable Fields pane, within its narrowest and widest widths */
  setWidth(width: number, notify = true): void {
    if (!this._paneElm || !this._splitterElm) {
      return;
    }
    const { minWidth } = this._options;
    const maxWidth = this.getMaxWidth();
    this._width = Math.round(Math.min(maxWidth, Math.max(minWidth, width)));
    this._paneElm.style.width = `${this._width}px`;
    this._splitterElm.setAttribute('aria-valuemin', String(minWidth));
    this._splitterElm.setAttribute('aria-valuemax', String(maxWidth));
    this._splitterElm.setAttribute('aria-valuenow', String(this._width));
    if (notify) {
      this.onResized.notify({ width: this._width });
    }
  }

  /** Resize the grid to its element, for a container whose size changed while a ResizeObserver is not available */
  resizeCanvas(): void {
    this._grid?.resizeCanvas();
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

  // --
  // protected functions
  // -----------------

  /** Add the parts to the container, which lays them out around the grid (its other child) */
  protected createLayout(toolbar: boolean, statusBar: boolean, rtl: boolean): void {
    const container = this._container!;
    container.classList.add('slick-pivot-layout', `slick-pivot-layout-fields-${this._options.position}`);
    if (rtl !== (getComputedStyle(container).direction === 'rtl')) {
      // the pane goes to the end of the reading direction of the grid
      this._previousDir = container.getAttribute('dir');
      container.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    }
    if (toolbar) {
      this._toolbarElm = Utils.createDomElement('div', { className: 'slick-pivot-layout-part slick-pivot-layout-toolbar' }, container);
    }
    const paneId = `slick-pivot-fields-${Math.random().toString(36).slice(2, 8)}`;
    this._splitterElm = Utils.createDomElement('div', { className: 'slick-pivot-layout-part slick-pivot-layout-splitter', role: 'separator', tabIndex: 0, ariaLabel: this._options.resizeLabel }, container);
    this._splitterElm.setAttribute('aria-orientation', 'vertical');
    this._splitterElm.setAttribute('aria-controls', paneId);
    this._paneElm = Utils.createDomElement('div', { className: 'slick-pivot-layout-part slick-pivot-layout-fields', id: paneId }, container);
    this._bindingEventService.bind(this._splitterElm, 'pointerdown', this.handleSplitterPointerDown.bind(this) as EventListener);
    this._bindingEventService.bind(this._splitterElm, 'pointermove', this.handleSplitterPointerMove.bind(this) as EventListener);
    this._bindingEventService.bind(this._splitterElm, 'pointerup', this.handleSplitterPointerUp.bind(this) as EventListener);
    this._bindingEventService.bind(this._splitterElm, 'pointercancel', this.handleSplitterPointerUp.bind(this) as EventListener);
    this._bindingEventService.bind(this._splitterElm, 'keydown', this.handleSplitterKeyDown.bind(this) as EventListener);
    if (statusBar) {
      this._statusElm = Utils.createDomElement('div', { className: 'slick-pivot-layout-part slick-pivot-layout-status' }, container);
    }
  }

  protected getMaxWidth(): number {
    const { minWidth, maxWidth } = this._options;
    const containerWidth = this._container?.clientWidth ?? 0;
    return Math.max(minWidth, maxWidth ?? (containerWidth ? Math.round(containerWidth * 0.6) : Number.MAX_SAFE_INTEGER));
  }

  /** Whether the pane is drawn to the right of the splitter (it depends on its position and on the reading direction) */
  protected isPaneOnTheRight(): boolean {
    return this._paneElm!.getBoundingClientRect().left >= this._splitterElm!.getBoundingClientRect().left;
  }

  protected scheduleResize(): void {
    if (this._resizeFrame === undefined) {
      this._resizeFrame = requestAnimationFrame(() => {
        this._resizeFrame = undefined;
        this._grid?.resizeCanvas();
      });
    }
  }

  /** The status bar tells about the pivot, so it is hidden while Pivot Mode is off */
  protected renderStatus(): void {
    const statusElm = this._statusElm;
    const pivot = this._pivot;
    if (!statusElm || !pivot || !this._grid) {
      return;
    }
    const statusBar: PivotStatusBarOption = typeof this._options.statusBar === 'object' ? this._options.statusBar : {};
    const pivotOptions = pivot.getOptions();
    const locale = pivotOptions.locale ?? pivotOptions.numberFormat?.locale;
    const result = pivot.getResult();
    statusElm.hidden = !pivot.isPivotMode();
    statusElm.classList.toggle('slick-pivot-layout-status-loading', pivot.isLoading());
    if (pivot.isLoading()) {
      statusElm.textContent = statusBar.loadingText ?? 'Calculating…';
    } else if (result && pivot.isPivotMode()) {
      const info = { result, rowCount: this._grid.getDataLength(), columnCount: this._grid.getColumns().length, locale };
      statusElm.textContent = (statusBar.formatter ?? SlickPivotFieldList.formatStatus)(info);
    }
  }

  protected handleSplitterPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || !this._options.resizable) {
      return;
    }
    e.preventDefault();
    this._dragPointerId = e.pointerId;
    this._splitterElm!.setPointerCapture?.(e.pointerId);
    this._container!.classList.add('slick-pivot-layout-resizing');
  }

  protected handleSplitterPointerMove(e: PointerEvent): void {
    if (this._dragPointerId !== e.pointerId) {
      return;
    }
    const rect = this._paneElm!.getBoundingClientRect();
    const splitterWidth = this._splitterElm!.getBoundingClientRect().width;
    // the pointer stays over the middle of the splitter
    const width = this.isPaneOnTheRight() ? rect.right - e.clientX - splitterWidth / 2 : e.clientX - rect.left - splitterWidth / 2;
    this.setWidth(width, false);
  }

  protected handleSplitterPointerUp(e: PointerEvent): void {
    if (this._dragPointerId !== e.pointerId) {
      return;
    }
    this._dragPointerId = undefined;
    this._splitterElm!.releasePointerCapture?.(e.pointerId);
    this._container!.classList.remove('slick-pivot-layout-resizing');
    this.onResized.notify({ width: this._width });
  }

  /** The arrow keys move the splitter the way they point (Shift for bigger steps), Home and End make the pane narrowest and widest */
  protected handleSplitterKeyDown(e: KeyboardEvent): void {
    const step = e.shiftKey ? 64 : 16;
    let width: number | undefined;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const towardsPane = (e.key === 'ArrowRight') === this.isPaneOnTheRight();
      width = this._width + (towardsPane ? -step : step);
    } else if (e.key === 'Home') {
      width = this._options.minWidth;
    } else if (e.key === 'End') {
      width = this.getMaxWidth();
    }
    if (width !== undefined) {
      e.preventDefault();
      this.setWidth(width);
    }
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.PivotFieldList = SlickPivotFieldList;
}
