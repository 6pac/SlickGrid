import type { AutoTooltipOption, Column, Plugin } from '../models/index';
import { Utils as Utils_ } from '../slick.core';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
 */
export class SlickAutoTooltips implements Plugin {
  // --
  // public API
  pluginName = 'AutoTooltips' as const;

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _options?: AutoTooltipOption
  protected _defaults: AutoTooltipOption = {
    enableForCells: true,
    enableForHeaderCells: false,
    maxToolTipLength: undefined,
    replaceExisting: true
  };

  /**
   * Constructor of the SlickGrid 3rd party plugin, it can optionally receive options
   * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
   * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
   * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
   * @param {boolean} [options.replaceExisting=null]       - Allow preventing custom tooltips from being overwritten by auto tooltips
   */
  constructor(options?: AutoTooltipOption) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  /**
   * Initialize plugin.
   */
  init(grid: SlickGrid) {
    this._grid = grid;
    if (this._options?.enableForCells) {
      this._grid.onMouseEnter.subscribe(this.handleMouseEnter.bind(this));
    }
    if (this._options?.enableForHeaderCells) {
      this._grid.onHeaderMouseEnter.subscribe(this.handleHeaderMouseEnter.bind(this));
    }
  }

  /**
   * Destroy plugin.
   */
  destroy() {
    if (this._options?.enableForCells) {
      this._grid.onMouseEnter.unsubscribe(this.handleMouseEnter.bind(this));
    }
    if (this._options?.enableForHeaderCells) {
      this._grid.onHeaderMouseEnter.unsubscribe(this.handleHeaderMouseEnter.bind(this));
    }
  }

  /**
   * Handle mouse entering grid cell to add/remove tooltip.
   * @param {MouseEvent} event - The event
   */
  protected handleMouseEnter(event: MouseEvent) {
    const cell = this._grid.getCellFromEvent(event);
    if (cell) {
      let node: HTMLElement | null = this._grid.getCellNode(cell.row, cell.cell);
      let text;
      if (this._options && node && (!node.title || this._options?.replaceExisting)) {
        if (node.clientWidth < node.scrollWidth) {
          text = node.textContent?.trim() ?? '';
          if (this._options?.maxToolTipLength && text.length > this._options?.maxToolTipLength) {
            text = text.substring(0, this._options.maxToolTipLength - 3) + '...';
          }
        } else {
          text = '';
        }
        node.title = text;
      }
      node = null;
    }
  }

  /**
   * Handle mouse entering header cell to add/remove tooltip.
   * @param {MouseEvent} event   - The event
   * @param {object} args.column - The column definition
   */
  protected handleHeaderMouseEnter(event: MouseEvent, args: { column: Column; }) {
    const column = args.column;
    let node: HTMLDivElement | null;
    const targetElm = (event.target as HTMLDivElement);

    if (targetElm) {
      node = targetElm.closest<HTMLDivElement>('.slick-header-column');
      if (node && !(column?.toolTip)) {
        node.title = (targetElm.clientWidth < node.clientWidth) ? column?.name ?? '' : '';
      }
    }
    node = null;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      AutoTooltips: SlickAutoTooltips
    }
  });
}
