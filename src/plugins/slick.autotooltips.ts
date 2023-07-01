import { Utils as Utils_ } from '../slick.core';

// for (iife) load Slick methods from global Slick object, or use imports for (cjs/esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

export interface AutoTooltipOption {
  /** Enable tooltip for grid cells */
  enableForCells?: boolean;
  /** Enable tooltip for header cells */
  enableForHeaderCells?: boolean;
  /** The maximum length for a tooltip */
  maxToolTipLength?: number;
  /** Replace existing tooltip text */
  replaceExisting?: boolean;
}

/**
 * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
 * @constructor
 * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
 * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
 * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
 */
export class SlickAutoTooltips {
  pluginName: 'AutoTooltips' = 'AutoTooltips' as const;
  protected _grid!: any;
  protected _options?: AutoTooltipOption
  protected _defaults: AutoTooltipOption = {
    enableForCells: true,
    enableForHeaderCells: false,
    maxToolTipLength: undefined,
    replaceExisting: true
  };

  /** Constructor of the SlickGrid 3rd party plugin, it can optionally receive options */
  constructor(options?: AutoTooltipOption) {
    this._options = options;
  }

  /**
   * Initialize plugin.
   */
  init(grid) {
    this._options = Utils.extend(true, {}, this._defaults, this._options);
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
  handleMouseEnter(event: MouseEvent) {
    const cell = this._grid.getCellFromEvent(event);
    if (cell) {
      let node: HTMLElement | null = this._grid.getCellNode(cell.row, cell.cell);
      let text;
      if (this._options && node && (!node.title || this._options?.replaceExisting)) {
        if (node.clientWidth < node.scrollWidth) {
          text = node.textContent?.trim() ?? '';
          if (this._options && (this._options.maxToolTipLength && text.length > this._options.maxToolTipLength)) {
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
  handleHeaderMouseEnter(event: MouseEvent, args: { column: any; }) {
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
