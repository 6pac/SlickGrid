import { type SlickEventData, SlickGroup as SlickGroup_, keyCode as keyCode_, Utils as Utils_ } from './slick.core.js';
import type { Column, GroupItemMetadataProviderOption, GroupingFormatterItem, ItemMetadata, SlickPlugin } from './models/index.js';
import type { SlickGrid } from './slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const SlickGroup = IIFE_ONLY ? Slick.Group : SlickGroup_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
 * This metadata overrides the default behavior and formatting of those rows so that they appear and function
 * correctly when processed by the grid.
 *
 * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
 * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
 *
 * @class GroupItemMetadataProvider
 * @module Data
 * @namespace Slick.Data
 * @constructor
 * @param inputOptions
 */
export class SlickGroupItemMetadataProvider implements SlickPlugin {
  pluginName = 'GroupItemMetadataProvider' as const;

  protected _grid!: SlickGrid;
  protected _options: GroupItemMetadataProviderOption;
  protected _defaults: GroupItemMetadataProviderOption = {
    checkboxSelect: false,
    checkboxSelectCssClass: 'slick-group-select-checkbox',
    checkboxSelectPlugin: null,
    groupCssClass: 'slick-group',
    groupTitleCssClass: 'slick-group-title',
    totalsCssClass: 'slick-group-totals',
    groupFocusable: true,
    totalsFocusable: false,
    toggleCssClass: 'slick-group-toggle',
    toggleExpandedCssClass: 'expanded',
    toggleCollapsedCssClass: 'collapsed',
    enableExpandCollapse: true,
    groupFormatter: this.defaultGroupCellFormatter.bind(this),
    totalsFormatter: this.defaultTotalsCellFormatter.bind(this),
    includeHeaderTotals: false
  };

  constructor(inputOptions?: GroupItemMetadataProviderOption) {
    this._options = Utils.extend<GroupItemMetadataProviderOption>(true, {}, this._defaults, inputOptions);
  }

  /** Getter of SlickGrid DataView object */
  protected get dataView(): any {
    return this._grid?.getData?.() ?? {} as any;
  }

  getOptions() {
    return this._options;
  }

  setOptions(inputOptions: GroupItemMetadataProviderOption) {
    Utils.extend(true, this._options, inputOptions);
  }

  protected defaultGroupCellFormatter(_row: number, _cell: number, _value: any, _columnDef: Column, item: any) {
    if (!this._options.enableExpandCollapse) {
      return item.title;
    }

    const indentation = `${item.level * 15}px`;
    const toggleClass = item.collapsed ? this._options.toggleCollapsedCssClass : this._options.toggleExpandedCssClass;

    // use a DocumentFragment to avoid creating an extra div container
    const containerElm = document.createDocumentFragment();

    // 1. optional row checkbox span to select the entire group rows
    if (this._options.checkboxSelect) {
      containerElm.appendChild(Utils.createDomElement('span', { className: `${this._options.checkboxSelectCssClass} ${item.selectChecked ? 'checked' : 'unchecked'}` }));
    }

    // 2. group toggle span
    containerElm.appendChild(Utils.createDomElement('span', {
      className: `${this._options.toggleCssClass} ${toggleClass}`,
      ariaExpanded: String(!item.collapsed),
      style: { marginLeft: indentation }
    }));

    // 3. group title span
    const groupTitleElm = Utils.createDomElement('span', { className: this._options.groupTitleCssClass || '' });
    groupTitleElm.setAttribute('level', item.level);
    (item.title instanceof HTMLElement)
      ? groupTitleElm.appendChild(item.title)
      : this._grid.applyHtmlCode(groupTitleElm, item.title ?? '');
    containerElm.appendChild(groupTitleElm);

    return containerElm;
  }

  protected defaultTotalsCellFormatter(_row: number, _cell: number, _value: any, columnDef: Column, item: any, grid: SlickGrid) {
    return (columnDef?.groupTotalsFormatter?.(item, columnDef, grid)) ?? '';
  }


  init(grid: SlickGrid) {
    this._grid = grid;
    this._grid.onClick.subscribe(this.handleGridClick.bind(this));
    this._grid.onKeyDown.subscribe(this.handleGridKeyDown.bind(this));
  }

  destroy() {
    if (this._grid) {
      this._grid.onClick.unsubscribe(this.handleGridClick.bind(this));
      this._grid.onKeyDown.unsubscribe(this.handleGridKeyDown.bind(this));
    }
  }

  protected handleGridClick(e: SlickEventData, args: { row: number; cell: number; grid: SlickGrid; }) {
    const target = e.target as HTMLElement;
    const item = this._grid.getDataItem(args.row);
    if (item && item instanceof SlickGroup && target.classList.contains(this._options.toggleCssClass || '')) {
      this.handleDataViewExpandOrCollapse(item);
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    if (item && item instanceof SlickGroup && target.classList.contains(this._options.checkboxSelectCssClass || '')) {
      item.selectChecked = !item.selectChecked;
      target.classList.remove((item.selectChecked ? 'unchecked' : 'checked'));
      target.classList.add((item.selectChecked ? 'checked' : 'unchecked'));
      // get rowIndexes array
      const rowIndexes = this.dataView.mapItemsToRows(item.rows);
      if (item.selectChecked) {
        this._options.checkboxSelectPlugin.selectRows(rowIndexes);
      } else {
        this._options.checkboxSelectPlugin.deSelectRows(rowIndexes);
      }
    }
  }

  // TODO:  add -/+ handling
  protected handleGridKeyDown(e: SlickEventData) {
    if (this._options.enableExpandCollapse && (e.which === keyCode.SPACE)) {
      const activeCell = this._grid.getActiveCell();
      if (activeCell) {
        const item = this._grid.getDataItem(activeCell.row);
        if (item && item instanceof SlickGroup) {
          this.handleDataViewExpandOrCollapse(item);
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }
    }
  }

  protected handleDataViewExpandOrCollapse(item: any) {
    const range = this._grid.getRenderedRange();
    this.dataView.setRefreshHints({
      ignoreDiffsBefore: range.top,
      ignoreDiffsAfter: range.bottom + 1
    });

    if (item.collapsed) {
      this.dataView.expandGroup(item.groupingKey);
    } else {
      this.dataView.collapseGroup(item.groupingKey);
    }
  }

  getGroupRowMetadata(item: GroupingFormatterItem, _row?: number, _cell?: number): ItemMetadata {
    const groupLevel = item?.level;
    return {
      selectable: false,
      focusable: this._options.groupFocusable,
      cssClasses: `${this._options.groupCssClass} slick-group-level-${groupLevel}`,
      formatter: (this._options.includeHeaderTotals && this._options.totalsFormatter) || undefined,
      columns: {
        0: {
          colspan: this._options.includeHeaderTotals ? '1' : '*',
          formatter: this._options.groupFormatter,
          editor: null
        }
      }
    };
  }

  getTotalsRowMetadata(item: { group: GroupingFormatterItem }, _row?: number, _cell?: number): ItemMetadata | null {
    const groupLevel = item?.group?.level;
    return {
      selectable: false,
      focusable: this._options.totalsFocusable,
      cssClasses: `${this._options.totalsCssClass} slick-group-level-${groupLevel}`,
      formatter: this._options.totalsFormatter,
      editor: null
    };
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  window.Slick.Data = window.Slick.Data || {};
  window.Slick.Data.GroupItemMetadataProvider = SlickGroupItemMetadataProvider;
}
