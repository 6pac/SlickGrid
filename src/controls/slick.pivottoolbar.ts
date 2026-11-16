import type { PivotGrandTotals, PivotLayout, PivotSubtotalsPosition } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import type { SlickPivot } from '../plugins/slick.pivot.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/** Item of the pivot toolbar */
export type PivotToolbarItem = 'layout' | 'subtotals' | 'grandTotals' | 'expandAll' | 'collapseAll' | 'undo' | 'redo' | 'fieldList';

/** Choice of the Grand Totals dropdown: which grand totals are shown */
export type PivotToolbarGrandTotals = 'both' | 'rows' | 'columns' | 'none';

export interface PivotToolbarOption {
  /**
   * Items of the toolbar, in order, by default the layout, subtotals and grand totals dropdowns, the
   * Expand All and Collapse All buttons, and Undo and Redo (shown while `enableWriteBack` is on).
   * `fieldList` is a toggle button raising `onFieldListToggle`, for an application that can hide its field list.
   */
  items: PivotToolbarItem[];

  /** Accessible name of the toolbar, defaults to "PivotTable options" */
  ariaLabel: string;

  /** Captions of the items */
  labels: {
    layout: string;
    layouts: Record<PivotLayout, string>;
    subtotals: string;
    subtotalPositions: Record<PivotSubtotalsPosition, string>;
    grandTotals: string;
    grandTotalChoices: Record<PivotToolbarGrandTotals, string>;
    expandAll: string;
    collapseAll: string;
    undo: string;
    redo: string;
    fieldList: string;
  };
}

/**
 * Toolbar of a pivot table, like the PivotTable Design ribbon of Excel: report layout, subtotals and
 * grand totals dropdowns, Expand All / Collapse All, and Undo / Redo of the write-backs. It follows the
 * spec of the pivot, whichever way it changes.
 *
 * @example
 * const toolbar = new SlickPivotToolbar(pivot, document.querySelector('#pivotToolbar'));
 */
export class SlickPivotToolbar {
  // --
  // public API

  /** Raised when the field list toggle button is pressed, with the visibility it asks for */
  onFieldListToggle = new SlickEvent<{ visible: boolean; }>('onFieldListToggle');

  // --
  // protected props
  protected _container: HTMLElement;
  protected _options: PivotToolbarOption;
  protected _bindingEventService: BindingEventService_;
  protected _eventHandler: SlickEventHandler_;
  protected _toolbarElm!: HTMLDivElement;
  protected _itemElms = new Map<PivotToolbarItem, HTMLElement>();
  protected _fieldListVisible = true;
  protected _defaults: PivotToolbarOption = {
    items: ['layout', 'subtotals', 'grandTotals', 'expandAll', 'collapseAll', 'undo', 'redo'],
    ariaLabel: 'PivotTable options',
    labels: {
      layout: 'Report Layout',
      layouts: { compact: 'Compact', outline: 'Outline', tabular: 'Tabular' },
      subtotals: 'Subtotals',
      subtotalPositions: { top: 'At Top of Group', bottom: 'At Bottom of Group', none: 'Do Not Show' },
      grandTotals: 'Grand Totals',
      grandTotalChoices: { both: 'Row and Column', rows: 'Row Only', columns: 'Column Only', none: 'Off' },
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      undo: 'Undo',
      redo: 'Redo',
      fieldList: 'Field List',
    },
  };

  constructor(protected readonly pivot: SlickPivot, containerOrSelector: HTMLElement | string, options?: Partial<PivotToolbarOption>) {
    const container = typeof containerOrSelector === 'string' ? document.querySelector<HTMLElement>(containerOrSelector) : containerOrSelector;
    if (!container) {
      throw new Error('[SlickPivotToolbar] the toolbar container was not found.');
    }
    this._container = container;
    this._options = Utils.extend(true, {}, this._defaults, options);
    if (options?.items) {
      this._options.items = options.items;
    }
    this._bindingEventService = new BindingEventService();
    this._eventHandler = new SlickEventHandler();
    this.createToolbar();
    this._eventHandler
      .subscribe(this.pivot.onSpecChanged, () => this.render())
      // `setOptions()` re-pivots, which shows or hides Undo and Redo when the write-back is turned on or off
      .subscribe(this.pivot.onPivotChanged, () => this.render())
      .subscribe(this.pivot.onHistoryChanged, () => this.render());
    this.render();
  }

  /** Destroy the toolbar and remove it from its container */
  destroy(): void {
    this._eventHandler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    this.onFieldListToggle.unsubscribe();
    this._toolbarElm?.remove();
  }

  getOptions(): PivotToolbarOption {
    return this._options;
  }

  /** The toolbar element */
  getElement(): HTMLDivElement {
    return this._toolbarElm;
  }

  /** Show the field list toggle button as pressed or not */
  setFieldListVisible(visible: boolean): void {
    this._fieldListVisible = visible;
    this.render();
  }

  /** Update the items from the spec, the history and the options of the pivot */
  render(): void {
    const spec = this.pivot.getSpec();
    this.setSelectValue('layout', spec.layout ?? 'compact');
    this.setSelectValue('subtotals', spec.subtotals ?? 'top');
    this.setSelectValue('grandTotals', SlickPivotToolbar.getGrandTotalsChoice(spec.grandTotals ?? {}));
    const writeBack = !!this.pivot.getOptions().enableWriteBack;
    (['undo', 'redo'] as const).forEach((item) => {
      const button = this._itemElms.get(item) as HTMLButtonElement | undefined;
      if (button) {
        button.hidden = !writeBack;
        button.disabled = item === 'undo' ? !this.pivot.canUndo() : !this.pivot.canRedo();
      }
    });
    this._itemElms.get('fieldList')?.setAttribute('aria-pressed', String(this._fieldListVisible));
  }

  /** The Grand Totals choice matching the grand totals of a spec */
  static getGrandTotalsChoice(grandTotals: PivotGrandTotals): PivotToolbarGrandTotals {
    const rows = grandTotals.rows !== false;
    const columns = grandTotals.columns !== false;
    return rows && columns ? 'both' : rows ? 'rows' : columns ? 'columns' : 'none';
  }

  // --
  // protected functions
  // -----------------

  protected createToolbar(): void {
    const { labels } = this._options;
    // a group rather than a toolbar: the dropdowns keep their arrow keys, so every item is reached with Tab
    this._toolbarElm = Utils.createDomElement('div', { className: 'slick-pivot-toolbar', role: 'group', ariaLabel: this._options.ariaLabel }, this._container);

    this._options.items.forEach((item) => {
      switch (item) {
        case 'layout':
          this.addSelect(item, labels.layout, labels.layouts, (layout) => this.pivot.updateSpec({ layout: layout as PivotLayout }));
          break;
        case 'subtotals':
          this.addSelect(item, labels.subtotals, labels.subtotalPositions, (subtotals) => this.pivot.updateSpec({ subtotals: subtotals as PivotSubtotalsPosition }));
          break;
        case 'grandTotals':
          this.addSelect(item, labels.grandTotals, labels.grandTotalChoices, (choice) => {
            // a grand total that stays shown keeps its position (top, bottom, start or end)
            const current = this.pivot.getSpec().grandTotals ?? {};
            const rows = choice === 'both' || choice === 'rows';
            const columns = choice === 'both' || choice === 'columns';
            this.pivot.updateSpec({ grandTotals: { ...current, rows: rows ? current.rows || true : false, columns: columns ? current.columns || true : false } });
          });
          break;
        case 'expandAll':
          this.addButton(item, labels.expandAll, () => {
            this.pivot.expandAllRows();
            this.pivot.expandAllColumns();
          });
          break;
        case 'collapseAll':
          this.addButton(item, labels.collapseAll, () => {
            this.pivot.collapseAllRows();
            this.pivot.collapseAllColumns();
          });
          break;
        case 'undo':
          this.addButton(item, labels.undo, () => this.pivot.undo(), 'Ctrl+Z');
          break;
        case 'redo':
          this.addButton(item, labels.redo, () => this.pivot.redo(), 'Ctrl+Y');
          break;
        case 'fieldList':
          this.addButton(item, labels.fieldList, () => this.onFieldListToggle.notify({ visible: !this._fieldListVisible }));
          break;
      }
    });
  }

  protected addSelect(item: PivotToolbarItem, label: string, choices: Record<string, string>, onChange: (value: string) => void): void {
    const labelElm = Utils.createDomElement('label', { className: `slick-pivot-toolbar-item slick-pivot-toolbar-${item}` }, this._toolbarElm);
    labelElm.dataset.item = item;
    Utils.createDomElement('span', { className: 'slick-pivot-toolbar-label', textContent: label }, labelElm);
    const select = Utils.createDomElement('select', { className: 'slick-pivot-toolbar-select' }, labelElm);
    Object.keys(choices).forEach((value) => Utils.createDomElement('option', { value, textContent: choices[value] }, select));
    this._bindingEventService.bind(select, 'change', () => onChange(select.value));
    this._itemElms.set(item, select);
  }

  protected addButton(item: PivotToolbarItem, label: string, onClick: () => void, shortcut?: string): void {
    const button = Utils.createDomElement('button', { className: `slick-pivot-toolbar-item slick-pivot-toolbar-button slick-pivot-toolbar-${item}`, type: 'button', textContent: label }, this._toolbarElm);
    button.dataset.item = item;
    if (shortcut) {
      button.title = `${label} (${shortcut})`;
      button.setAttribute('aria-keyshortcuts', shortcut.replace('Ctrl', 'Control'));
    }
    this._bindingEventService.bind(button, 'click', onClick);
    this._itemElms.set(item, button);
  }

  protected setSelectValue(item: PivotToolbarItem, value: string): void {
    const select = this._itemElms.get(item) as HTMLSelectElement | undefined;
    if (select && select.value !== value) {
      select.value = value;
    }
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Controls = window.Slick.Controls || {};
  window.Slick.Controls.PivotToolbar = SlickPivotToolbar;
}
