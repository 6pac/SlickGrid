import { BindingEventService as BindingEventService_, Event as SlickEvent_, Utils as Utils_ } from '../slick.core';
import type { GridOption, GridSize, ResizerOption } from '../models/index';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

// define some constants, height/width are in pixels
const DATAGRID_MIN_HEIGHT = 180;
const DATAGRID_MIN_WIDTH = 300;
const DATAGRID_BOTTOM_PADDING = 20;

/***
 * A Resizer plugin that can be used to auto-resize a grid and/or resize with fixed dimensions.
 * When fixed height is defined, it will auto-resize only the width and vice versa with the width defined.
 * You can also choose to use the flag "enableAutoSizeColumns" if you want to the plugin to
 * automatically call the grid "autosizeColumns()" method after each resize.
 *
 * USAGE:
 *
 * Add the "slick.resizer.js" file and register it with the grid.
 *
 * You can specify certain options as arguments when instantiating the plugin like so:
 * var resizer = new Slick.Plugins.Resizer({
 *   container: '#gridContainer',
 *   rightPadding: 15,
 *   bottomPadding: 20,
 *   minHeight: 180,
 *   minWidth: 300,
 * });
 * grid.registerPlugin(resizer);
 *
 *
 * The plugin exposes the following events:
 *
 *    onGridAfterResize:  Fired after the grid got resized.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            grid:       Reference to the grid.
 *            dimensions: Resized grid dimensions used
 *
 *    onGridBeforeResize:   Fired before the grid gets resized.  You can customize the menu or dismiss it by returning false.
 *        Event args:
 *            grid:     Reference to the grid.
 *
 *
 * @param {Object} options available plugin options that can be passed in the constructor:
 *   container:      (REQUIRED) DOM element selector of the page container, basically what element in the page will be used to calculate the available space
 *   gridContainer:             DOM element selector of the grid container, optional but when provided it will be resized with same size as the grid (typically a container holding the grid and extra custom footer/pagination)
 *   applyResizeToContainer:    Defaults to false, do we want to apply the resized dimentions to the grid container as well?
 *   rightPadding:              Defaults to 0, right side padding to remove from the total dimension
 *   bottomPadding:             Defaults to 20, bottom padding to remove from the total dimension
 *   minHeight:                 Defaults to 180, minimum height of the grid
 *   minWidth:                  Defaults to 300, minimum width of the grid
 *   maxHeight:                 Maximum height of the grid
 *   maxWidth:                  Maximum width of the grid
 *   calculateAvailableSizeBy:  Defaults to "window", which DOM element ("container" or "window") are we using to calculate the available size for the grid?
 *
 * @class Slick.Plugins.Resizer
 */

export class SlickResizer {
  // --
  // public API
  pluginName = 'Resizer' as const;
  onGridAfterResize = new SlickEvent<{ grid: SlickGrid; dimensions: GridSize; }>();
  onGridBeforeResize = new SlickEvent<{ grid: SlickGrid; }>();

  // --
  // protected props
  protected _bindingEventService: BindingEventService_;
  protected _fixedHeight?: number | null;
  protected _fixedWidth?: number | null;
  protected _grid!: SlickGrid;
  protected _gridDomElm!: HTMLElement;
  protected _gridContainerElm!: HTMLElement;
  protected _pageContainerElm!: HTMLElement;
  protected _gridOptions!: GridOption;
  protected _gridUid = '';
  protected _lastDimensions?: GridSize;
  protected _resizePaused = false;
  protected _timer!: NodeJS.Timeout;
  protected _options: ResizerOption;
  protected _defaults: ResizerOption = {
    bottomPadding: 20,
    applyResizeToContainer: false,
    minHeight: 180,
    minWidth: 300,
    rightPadding: 0
  };

  constructor(options: Partial<ResizerOption>, fixedDimensions?: { height?: number; width?: number; }) {
    this._bindingEventService = new BindingEventService();
    this._options = Utils.extend(true, {}, this._defaults, options);
    if (fixedDimensions) {
      this._fixedHeight = fixedDimensions.height;
      this._fixedWidth = fixedDimensions.width;
    }
  }

  setOptions(newOptions: Partial<ResizerOption>) {
    this._options = Utils.extend(true, {}, this._defaults, this._options, newOptions);
  }

  init(grid: SlickGrid) {
    this.setOptions(this._options);
    this._grid = grid;
    this._gridOptions = this._grid.getOptions();
    this._gridUid = this._grid.getUID();
    this._gridDomElm = this._grid.getContainerNode();
    this._pageContainerElm = typeof this._options.container === 'string'
      ? document.querySelector(this._options.container) as HTMLElement
      : this._options.container as HTMLElement;

    if (this._options.gridContainer) {
      this._gridContainerElm = this._options.gridContainer as HTMLElement;
    }

    if (this._gridOptions) {
      this.bindAutoResizeDataGrid();
    }
  }

  /** Bind an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
  * Options: we could also provide a % factor to resize on each height/width independently
  */
  bindAutoResizeDataGrid(newSizes?: GridSize) {
    const gridElmOffset = Utils.offset(this._gridDomElm);

    // if we can't find the grid to resize, return without binding anything
    if (this._gridDomElm !== undefined || gridElmOffset !== undefined) {
      // -- 1st resize the datagrid size at first load (we need this because the .on event is not triggered on first load)
      // -- also we add a slight delay (in ms) so that we resize after the grid render is done
      this.resizeGrid(0, newSizes, null);

      // -- 2nd bind a trigger on the Window DOM element, so that it happens also when resizing after first load
      // -- bind auto-resize to Window object only if it exist
      this._bindingEventService.bind(window, 'resize', (event) => {
        this.onGridBeforeResize.notify({ grid: this._grid }, event, this);

        // unless the resizer is paused, let's go and resize the grid
        if (!this._resizePaused) {
          // for some yet unknown reason, calling the resize twice removes any stuttering/flickering
          // when changing the height and makes it much smoother experience
          this.resizeGrid(0, newSizes, event);
          this.resizeGrid(0, newSizes, event);
        }
      });
    }
  }

  /**
   * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
   */
  calculateGridNewDimensions(): GridSize | null {
    const gridElmOffset = Utils.offset(this._gridDomElm);

    if (!window || this._pageContainerElm === undefined || this._gridDomElm === undefined || gridElmOffset === undefined) {
      return null;
    }

    // calculate bottom padding
    const bottomPadding = (this._options?.bottomPadding !== undefined) ? this._options.bottomPadding : DATAGRID_BOTTOM_PADDING;

    let gridHeight = 0;
    let gridOffsetTop = 0;

    // which DOM element are we using to calculate the available size for the grid?
    // defaults to "window"
    if (this._options.calculateAvailableSizeBy === 'container') {
      // uses the container's height to calculate grid height without any top offset
      gridHeight = Utils.innerSize(this._pageContainerElm, 'height') || 0;
    } else {
      // uses the browser's window height with its top offset to calculate grid height
      gridHeight = window.innerHeight || 0;
      gridOffsetTop = (gridElmOffset !== undefined) ? gridElmOffset.top : 0;
    }

    const availableHeight = gridHeight - gridOffsetTop - bottomPadding;
    const availableWidth = Utils.innerSize(this._pageContainerElm, 'width') || window.innerWidth || 0;
    const maxHeight = this._options?.maxHeight || undefined;
    const minHeight = (this._options?.minHeight !== undefined) ? this._options.minHeight : DATAGRID_MIN_HEIGHT;
    const maxWidth = this._options?.maxWidth || undefined;
    const minWidth = (this._options?.minWidth !== undefined) ? this._options.minWidth : DATAGRID_MIN_WIDTH;

    let newHeight = availableHeight;
    let newWidth = (this._options?.rightPadding) ? availableWidth - this._options.rightPadding : availableWidth;

    // optionally (when defined), make sure that grid height & width are within their thresholds
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
    }
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }
    if (maxWidth && newWidth > maxWidth) {
      newWidth = maxWidth;
    }

    // return the new dimensions unless a fixed height/width was defined
    return {
      height: this._fixedHeight || newHeight,
      width: this._fixedWidth || newWidth
    };
  }

  /** Destroy function when element is destroyed */
  destroy() {
    this.onGridBeforeResize.unsubscribe();
    this.onGridAfterResize.unsubscribe();
    this._bindingEventService.unbindAll();
  }

  /**
  * Return the last resize dimensions used by the service
  * @return {object} last dimensions (height: number, width: number)
  */
  getLastResizeDimensions() {
    return this._lastDimensions;
  }

  /**
   * Provide the possibility to pause the resizer for some time, until user decides to re-enabled it later if he wish to.
   * @param {boolean} isResizePaused are we pausing the resizer?
   */
  pauseResizer(isResizePaused: boolean) {
    this._resizePaused = isResizePaused;
  }

  /**
   * Resize the datagrid to fit the browser height & width.
   * @param {number} [delay] to wait before resizing, defaults to 0 (in milliseconds)
   * @param {object} [newSizes] can optionally be passed (height: number, width: number)
   * @param {object} [event] that triggered the resize, defaults to null
   * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
   */
  resizeGrid(delay?: number, newSizes?: GridSize, event?: Event | null): Promise<GridSize | undefined> | void {
    // because of the javascript async nature, we might want to delay the resize a little bit
    const resizeDelay = delay || 0;

    // return a Promise when supported by the browser
    if (typeof Promise === 'function') {
      return new Promise((resolve) => {
        if (resizeDelay > 0) {
          clearTimeout(this._timer);
          this._timer = setTimeout(() => {
            resolve(this.resizeGridCallback(newSizes, event));
          }, resizeDelay);
        } else {
          resolve(this.resizeGridCallback(newSizes, event));
        }
      });
    } else {
      // OR no return when Promise isn't supported
      if (resizeDelay > 0) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.resizeGridCallback(newSizes, event);
        }, resizeDelay);
      } else {
        this.resizeGridCallback(newSizes, event);
      }
    }
  }

  protected resizeGridCallback(newSizes?: GridSize, event?: Event | null) {
    const lastDimensions = this.resizeGridWithDimensions(newSizes) as GridSize;
    this.onGridAfterResize.notify({ grid: this._grid, dimensions: lastDimensions }, event, this);
    return lastDimensions;
  }

  protected resizeGridWithDimensions(newSizes?: GridSize): GridSize | undefined {
    // calculate the available sizes with minimum height defined as a varant
    const availableDimensions = this.calculateGridNewDimensions();

    if ((newSizes || availableDimensions) && this._gridDomElm) {
      try {
        // get the new sizes, if new sizes are passed (not 0), we will use them else use available space
        // basically if user passes 1 of the dimension, let say he passes just the height,
        // we will use the height as a fixed height but the width will be resized by it's available space
        const newHeight = (newSizes?.height) ? newSizes.height : availableDimensions?.height;
        const newWidth = (newSizes?.width) ? newSizes.width : availableDimensions?.width;

        // apply these new height/width to the datagrid
        if (!this._gridOptions.autoHeight) {
          this._gridDomElm.style.height = `${newHeight}px`;
        }
        this._gridDomElm.style.width = `${newWidth}px`;
        if (this._gridContainerElm) {
          this._gridContainerElm.style.width = `${newWidth}px`;
        }

        // resize the slickgrid canvas on all browser
        if (this._grid?.resizeCanvas) {
          this._grid.resizeCanvas();
        }

        // also call the grid auto-size columns so that it takes available when going bigger
        if (this._gridOptions?.enableAutoSizeColumns && this._grid.autosizeColumns) {
          // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree) to avoid SlickGrid error "missing stylesheet"
          if (this._gridUid && document.querySelector(`.${this._gridUid}`)) {
            this._grid.autosizeColumns();
          }
        }

        // keep last resized dimensions & resolve them to the Promise
        this._lastDimensions = {
          height: newHeight,
          width: newWidth
        };
      } catch (e) {
        this.destroy();
      }
    }

    return this._lastDimensions;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        Resizer: SlickResizer
      }
    }
  });
}

