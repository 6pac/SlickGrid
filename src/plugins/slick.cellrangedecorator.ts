import type { CSSStyleDeclarationWritable, CellRange, CellRangeDecoratorOption, Plugin } from '../models/index';
import { Utils as Utils_ } from '../slick.core';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
export class SlickCellRangeDecorator implements Plugin {
  // --
  // public API
  pluginName = 'CellRangeDecorator' as const;

  // --
  // protected props
  protected _options: CellRangeDecoratorOption;
  protected _elem?: HTMLDivElement | null;
  protected _defaults = {
    selectionCssClass: 'slick-range-decorator',
    selectionCss: {
      zIndex: '9999',
      border: '2px dashed red'
    },
    offset: { top: -1, left: -1, height: -2, width: -2 }
  } as CellRangeDecoratorOption;

  constructor(protected readonly grid: SlickGrid, options?: Partial<CellRangeDecoratorOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  destroy() {
    this.hide();
  }

  init() { }

  hide() {
    this._elem?.remove();
    this._elem = null;
  }

  show(range: CellRange) {
    if (!this._elem) {
      this._elem = document.createElement('div')
      this._elem.className = this._options.selectionCssClass;
      Object.keys(this._options.selectionCss as CSSStyleDeclaration).forEach((cssStyleKey) => {
        this._elem!.style[cssStyleKey as CSSStyleDeclarationWritable] = this._options.selectionCss[cssStyleKey as CSSStyleDeclarationWritable];
      });
      this._elem.style.position = 'absolute';
      const canvasNode = this.grid.getActiveCanvasNode();
      if (canvasNode) {
        canvasNode.appendChild(this._elem);
      }
    }

    const from = this.grid.getCellNodeBox(range.fromRow, range.fromCell);
    const to = this.grid.getCellNodeBox(range.toRow, range.toCell);

    if (from && to && this._options?.offset) {
      this._elem.style.top = `${from.top + this._options.offset.top}px`;
      this._elem.style.left = `${from.left + this._options.offset.left}px`;
      this._elem.style.height = `${to.bottom - from.top + this._options.offset.height}px`;
      this._elem.style.width = `${to.right - from.left + this._options.offset.width}px`;
    }

    return this._elem;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      CellRangeDecorator: SlickCellRangeDecorator
    }
  });
}
