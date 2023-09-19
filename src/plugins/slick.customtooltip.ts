import type { CancellablePromiseWrapper, Column, CustomTooltipOption, DOMEvent, Formatter, GridOption } from '../models/index';
import { SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * A plugin to add Custom Tooltip when hovering a cell, it subscribes to the cell "onMouseEnter" and "onMouseLeave" events.
 * The "customTooltip" is defined in the Column Definition OR Grid Options (the first found will have priority over the second)
 *
 * USAGE:
 *
 * Add the slick.customTooltip.(js|css) files and register it with the grid.
 *
 * To specify a tooltip when hovering a cell, extend the column definition like so:
 * const customTooltipPlugin = new Slick.Plugins.CustomTooltip(columns, grid options);
 *
 * Available plugin options (same options are available in both column definition and/or grid options)
 *
 * Example 1  - via Column Definition
 *  const columns = [
 *    {
 *      id: "action", name: "Action", field: "action", formatter: fakeButtonFormatter,
 *      customTooltip: {
 *        formatter: tooltipTaskFormatter,
 *        usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *      }
 *    }
 *  ];
 *
 *  OR Example 2 - via Grid Options (for all columns), NOTE: the column definition tooltip options will win over the options defined in the grid options
 *  const gridOptions = {
 *    enableCellNavigation: true,
 *    customTooltip: {
 *      formatter: tooltipTaskFormatter,
 *      usabilityOverride: (args) => !!(args.dataContext.id % 2) // show it only every second row
 *    },
 *  };
 *
 * Available options that can be defined from either a column definition or in grid options (column definition options as precendence)
 *   asyncParamsPropName:                 defaults to "__params", optionally change the property name that will be used to merge the data returned by the async method into the `dataContext` object
 *   asyncProcess:                        Async Post method returning a Promise, it must return an object with 1 or more properties. internally the data that will automatically be merged into the `dataContext` object under the `__params` property so that you can use it in your `asyncPostFormatter` formatter.
 *   asyncPostFormatter:                  Formatter to execute once the async process is completed, to displayed the actual text result (used when dealing with an Async API to get data to display later in the tooltip)
 *   hideArrow:                           defaults to False, should we hide the tooltip pointer arrow?
 *   className:                           defaults to "slick-custom-tooltip"
 *   formatter:                           Formatter to execute for displaying the data that will show in the tooltip. NOTE: when using `asyncProcess`, this formatter will be executed first and prior to the actual async process.
 *   headerFormatter:                     Formatter to execute when custom tooltip is over a header column
 *   headerRowFormatter:                  Formatter to execute when custom tooltip is over a heade row column (e.g. filter)
 *   maxHeight:                           optional maximum height number (in pixel) of the tooltip container
 *   maxWidth:                            optional maximum width number (in pixel) of the tooltip container
 *   offsetLeft:                          defaults to 0, optional left offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   offsetRight:                         defaults to 0, optional right offset, it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   offsetTopBottom:                     defaults to 4, optional top or bottom offset (depending on which side it shows), it must be a positive/negative number (in pixel) that will be added to the offset position calculation of the tooltip container.
 *   position:                            defaults to "auto" (available options: 'auto' | 'top' | 'bottom' | 'left-align' | 'right-align'), allows to align the tooltip to the best logical position in the window, by default it will show on top left but if it calculates that it doesn't have enough space it will use bottom (same goes for each side align)
 *   regularTooltipWhiteSpace:            defaults to `pre-line`, optionally change the style `white-space` when displaying regular text tooltip. NOTE: when using a formatter it will use the `whiteSpace` setting instead
 *   whiteSpace:                          defaults to `normal`, optionally change the style `white-space` when displaying tooltip with formatter (tooltip or regular formatter)
 *   useRegularTooltip:                   defaults to False, when set to True it will try parse through the regular cell formatter and try to find a `title` attribute to show as a regular tooltip (also note: this has precedence over customTooltip formatter defined)
 *   useRegularTooltipFromFormatterOnly:  defaults to False, optionally force to retrieve the `title` from the Formatter result instead of the cell itself.
 *                                            for example, when used in combo with the AutoTooltip plugin we might want to force the tooltip to read the `title` attribute from the formatter result first instead of the cell itself,
 *                                            make the cell as a 2nd read, in other words check the formatter prior to the cell which the AutoTooltip might have filled.
 *   renderRegularTooltipAsHtml:          defaults to false, regular "title" tooltip won't be rendered as html unless specified via this flag (also "\r\n" will be replaced by <br>)
 *   tooltipTextMaxLength:                defaults to 700 (characters), when defined the text will be truncated to the max length characters provided
 *   usabilityOverride:                   callback method that user can override the default behavior of showing the tooltip. If it returns False, then the tooltip won't show
 *
 * @param options {Object} Custom Tooltip Options
 * @class Slick.Plugins.CustomTooltip
 * @constructor
 */

type CellType = 'slick-cell' | 'slick-header-column' | 'slick-headerrow-column';

/**
 * CustomTooltip plugin to show/hide tooltips when columns are too narrow to fit content.
 * @constructor
 * @param {boolean} [options.className="slick-custom-tooltip"]  - custom tooltip class name
 * @param {boolean} [options.offsetTop=5]                       - tooltip offset from the top
 */
export class CustomTooltip {
  // --
  // public API
  pluginName = 'CustomTooltip' as const;

  // --
  // protected props
  protected _cancellablePromise?: CancellablePromiseWrapper;
  protected _cellNodeElm?: HTMLDivElement;
  protected _dataView?: SlickDataView | null;
  protected _grid!: SlickGrid;
  protected _gridOptions!: GridOption
  protected _tooltipElm?: HTMLDivElement;
  protected _options!: CustomTooltipOption;
  protected _defaults: CustomTooltipOption = {
    className: 'slick-custom-tooltip',
    offsetLeft: 0,
    offsetRight: 0,
    offsetTopBottom: 4,
    hideArrow: false,
    tooltipTextMaxLength: 700,
    regularTooltipWhiteSpace: 'pre-line',
    whiteSpace: 'normal',
  };
  protected _eventHandler = new SlickEventHandler();
  protected _cellTooltipOptions!: CustomTooltipOption;

  constructor(protected readonly tooltipOptions: Partial<CustomTooltipOption>) { }

  /**
   * Initialize plugin.
   */
  init(grid: SlickGrid) {
    this._grid = grid;
    const _data = grid?.getData() || [];
    this._dataView = Array.isArray(_data) ? null : _data as SlickDataView;
    this._gridOptions = (grid.getOptions() || {}) as GridOption;
    this._options = Utils.extend(true, {}, this._defaults, this._gridOptions.customTooltip, this.tooltipOptions);
    this._eventHandler
      .subscribe(grid.onMouseEnter, this.handleOnMouseEnter.bind(this))
      .subscribe(grid.onHeaderMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, 'slick-header-column'))
      .subscribe(grid.onHeaderRowMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, 'slick-headerrow-column'))
      .subscribe(grid.onMouseLeave, () => this.hideTooltip())
      .subscribe(grid.onHeaderMouseLeave, () => this.hideTooltip())
      .subscribe(grid.onHeaderRowMouseLeave, () => this.hideTooltip());
  }

  /**
   * Destroy plugin.
   */
  destroy() {
    this.hideTooltip();
    this._eventHandler.unsubscribeAll();
  }

  /** depending on the selector type, execute the necessary handler code */
  protected handleOnHeaderMouseEnterByType(e: DOMEvent<HTMLDivElement>, args: any, selector: CellType) {
    // before doing anything, let's remove any previous tooltip before
    // and cancel any opened Promise/Observable when using async
    this.hideTooltip();

    const cell = {
      row: -1, // negative row to avoid pulling any dataContext while rendering
      cell: this._grid.getColumns().findIndex((col) => args?.column?.id === col.id)
    };
    const columnDef = args.column;
    const item = {};
    const isHeaderRowType = selector === 'slick-headerrow-column';

    // run the override function (when defined), if the result is false it won't go further
    args = args || {};
    args.cell = cell.cell;
    args.row = cell.row;
    args.columnDef = columnDef;
    args.dataContext = item;
    args.grid = this._grid;
    args.type = isHeaderRowType ? 'header-row' : 'header';

    this._cellTooltipOptions = Utils.extend(true, {}, this._options, columnDef.customTooltip);
    if ((columnDef?.disableTooltip) || !this.runOverrideFunctionWhenExists<typeof args>(this._cellTooltipOptions.usabilityOverride, args)) {
      return;
    }

    if (columnDef && e.target) {
      this._cellNodeElm = (e.target as HTMLDivElement).closest(`.${selector}`) as HTMLDivElement;
      const formatter = isHeaderRowType ? this._cellTooltipOptions.headerRowFormatter : this._cellTooltipOptions.headerFormatter;

      if (this._cellTooltipOptions.useRegularTooltip || !formatter) {
        const formatterOrText = !isHeaderRowType ? columnDef.name : this._cellTooltipOptions.useRegularTooltip ? null : formatter;
        this.renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
      } else if (this._cellNodeElm && typeof formatter === 'function') {
        this.renderTooltipFormatter(formatter, cell, null, columnDef, item);
      }
    }
  }

  /**
   * Handle mouse entering grid cell to show tooltip.
   * @param {jQuery.Event} e - The event
   */
  protected handleOnMouseEnter(e: DOMEvent<HTMLDivElement>, args: any) {
    // before doing anything, let's remove any previous tooltip before
    // and cancel any opened Promise/Observable when using async
    this.hideTooltip();

    if (this._grid && e) {
      // get cell only when it's possible (ie, Composite Editor will not be able to get cell and so it will never show any tooltip)
      const targetClassName = (event?.target as HTMLDivElement)?.closest('.slick-cell')?.className;
      const cell = (targetClassName && /l\d+/.exec(targetClassName || '')) ? this._grid.getCellFromEvent(e) : null;

      if (cell) {
        const item = this._dataView ? this._dataView.getItem(cell.row) : this._grid.getDataItem(cell.row);
        const columnDef = this._grid.getColumns()[cell.cell];
        this._cellNodeElm = this._grid.getCellNode(cell.row, cell.cell) as HTMLDivElement;
        this._cellTooltipOptions = Utils.extend(true, {}, this._options, columnDef.customTooltip);

        if (item && columnDef) {
          // run the override function (when defined), if the result is false it won't go further
          args = args || {};
          args.cell = cell.cell;
          args.row = cell.row;
          args.columnDef = columnDef;
          args.dataContext = item;
          args.grid = this._grid;
          args.type = 'cell';
          if ((columnDef?.disableTooltip) || !this.runOverrideFunctionWhenExists<typeof args>(this._cellTooltipOptions.usabilityOverride, args)) {
            return;
          }

          const value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;

          if (this._cellTooltipOptions.useRegularTooltip || !this._cellTooltipOptions.formatter) {
            this.renderRegularTooltip(columnDef.formatter, cell, value, columnDef, item);
          } else {
            if (typeof this._cellTooltipOptions.formatter === 'function') {
              this.renderTooltipFormatter(this._cellTooltipOptions.formatter, cell, value, columnDef, item);
            }
            if (typeof this._cellTooltipOptions.asyncProcess === 'function') {
              const asyncProcess = this._cellTooltipOptions.asyncProcess(cell.row, cell.cell, value, columnDef, item, this._grid);
              if (!this._cellTooltipOptions.asyncPostFormatter) {
                throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
              }

              if (asyncProcess instanceof Promise) {
                // create a new cancellable promise which will resolve, unless it's cancelled, with the udpated `dataContext` object that includes the `this._this._params`
                this._cancellablePromise = this.cancellablePromise(asyncProcess);
                this._cancellablePromise.promise
                  .then((asyncResult) => {
                    this.asyncProcessCallback(asyncResult, cell, value, columnDef, item)
                  })
                  .catch(function (error) {
                    // we will throw back any errors, unless it's a cancelled promise which in that case will be disregarded (thrown by the promise wrapper cancel() call)
                    if (!(error.isPromiseCancelled)) {
                      throw error;
                    }
                  });
              }
            }
          }
        }
      }
    }
  }

  protected findFirstElementAttribute(inputElm: Element | null | undefined, attributes: string[]): string | null {
    if (inputElm) {
      let outputAttrData: string | null = null;
      attributes.forEach((attribute) => {
        const attrData = inputElm.getAttribute(attribute);
        if (attrData) {
          outputAttrData = attrData;
        }
      });
      return outputAttrData;
    }
    return null;
  }

  /**
   * Parse the cell formatter and assume it might be html
   * then create a temporary html element to easily retrieve the first [title=""] attribute text content
   * also clear the "title" attribute from the grid div text content so that it won't show also as a 2nd browser tooltip
   */
  protected renderRegularTooltip(formatterOrText: Formatter | string | undefined, cell: { row: number; cell: number; }, value: any, columnDef: Column, item: any) {
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = this.parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item);
    let tooltipText = columnDef.toolTip || '';
    let tmpTitleElm;

    if (!tooltipText) {
      if ((this._cellNodeElm && (this._cellNodeElm.clientWidth < this._cellNodeElm.scrollWidth)) && !this._cellTooltipOptions.useRegularTooltipFromFormatterOnly) {
        tooltipText = (this._cellNodeElm.textContent || '').trim() || '';
        if (this._cellTooltipOptions.tooltipTextMaxLength && (tooltipText.length > this._cellTooltipOptions.tooltipTextMaxLength)) {
          tooltipText = tooltipText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + '...';
        }
        tmpTitleElm = this._cellNodeElm;
      } else {
        if (this._cellTooltipOptions.useRegularTooltipFromFormatterOnly) {
          tmpTitleElm = tmpDiv.querySelector('[title], [data-slick-tooltip]');
        } else {
          tmpTitleElm = this.findFirstElementAttribute(this._cellNodeElm, ['title', 'data-slick-tooltip']) ? this._cellNodeElm : tmpDiv.querySelector('[title], [data-slick-tooltip]');
          if ((!tmpTitleElm || !this.findFirstElementAttribute(tmpTitleElm, ['title', 'data-slick-tooltip'])) && this._cellNodeElm) {
            tmpTitleElm = this._cellNodeElm.querySelector('[title], [data-slick-tooltip]');
          }
        }
        if (!tooltipText || (typeof formatterOrText === 'function' && this._cellTooltipOptions.useRegularTooltipFromFormatterOnly)) {
          tooltipText = this.findFirstElementAttribute(tmpTitleElm, ['title', 'data-slick-tooltip']) || '';
        }
      }
    }

    if (tooltipText !== '') {
      this.renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText);
    }

    // also clear any "title" attribute to avoid showing a 2nd browser tooltip
    this.swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
  }

  /**
 * swap and copy the "title" attribute into a new custom attribute then clear the "title" attribute
 * from the grid div text content so that it won't show also as a 2nd browser tooltip
 */
  protected swapAndClearTitleAttribute(inputTitleElm?: Element | null, tooltipText?: string) {
    // the title attribute might be directly on the slick-cell container element (when formatter returns a result object)
    // OR in a child element (most commonly as a custom formatter)
    const titleElm = inputTitleElm || (this._cellNodeElm && ((this._cellNodeElm.hasAttribute('title') && this._cellNodeElm.getAttribute('title')) ? this._cellNodeElm : this._cellNodeElm.querySelector('[title]')));

    // flip tooltip text from `title` to `data-slick-tooltip`
    if (titleElm) {
      titleElm.setAttribute('data-slick-tooltip', tooltipText || '');
      if (titleElm.hasAttribute('title')) {
        titleElm.setAttribute('title', '');
      }
    }
  }

  protected asyncProcessCallback(asyncResult: any, cell: { row: number, cell: number }, value: any, columnDef: Column, dataContext: any) {
    this.hideTooltip();
    const itemWithAsyncData = Utils.extend(true, {}, dataContext, { [this._cellTooltipOptions.asyncParamsPropName || '__params']: asyncResult });
    this.renderTooltipFormatter(this._cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
  }

  protected cancellablePromise<T = any>(inputPromise: Promise<T>): CancellablePromiseWrapper<T> {
    let hasCancelled = false;

    if (inputPromise instanceof Promise) {
      return {
        promise: inputPromise.then(function (result) {
          if (hasCancelled) {
            throw { isPromiseCancelled: true };
          }
          return result;
        }),
        cancel: () => hasCancelled = true
      };
    }
    return inputPromise;
  }

  protected getHtmlElementOffset(element?: HTMLElement | null) {
    if (!element) {
      return undefined;
    }
    const rect = element.getBoundingClientRect();
    let left = 0;
    let top = 0;
    let bottom = 0;
    let right = 0;

    if (rect.top !== undefined && rect.left !== undefined) {
      top = rect.top + window.pageYOffset;
      left = rect.left + window.pageXOffset;
      right = rect.right;
      bottom = rect.bottom;
    }
    return { top: top, left: left, bottom: bottom, right: right };
  }

  /**
   * hide (remove) tooltip from the DOM,
   * when using async process, it will also cancel any opened Promise/Observable that might still be opened/pending.
   */
  hideTooltip() {
    this._cancellablePromise?.cancel();
    const prevTooltip = document.body.querySelector(`.${this._cellTooltipOptions?.className ?? this._defaults.className}.${this._grid.getUID()}`);
    prevTooltip?.remove();
  }

  /**
   * Reposition the Tooltip to be top-left position over the cell.
   * By default we use an "auto" mode which will allow to position the Tooltip to the best logical position in the window, also when we mention position, we are talking about the relative position against the grid cell.
   * We can assume that in 80% of the time the default position is top-right, the default is "auto" but we can also override it and use a specific position.
   * Most of the time positioning of the tooltip will be to the "top-right" of the cell is ok but if our column is completely on the right side then we'll want to change the position to "left" align.
   * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are hovering a cell at the top of the grid and there's no room to display it then we might need to reposition to "bottom" instead.
   */
  protected reposition(cell: { row: number; cell: number; }) {
    if (this._tooltipElm) {
      this._cellNodeElm = (this._cellNodeElm || this._grid.getCellNode(cell.row, cell.cell)) as HTMLDivElement;
      const cellPosition = this.getHtmlElementOffset(this._cellNodeElm);
      const cellContainerWidth = this._cellNodeElm.offsetWidth;
      const calculatedTooltipHeight = this._tooltipElm.getBoundingClientRect().height;
      const calculatedTooltipWidth = this._tooltipElm.getBoundingClientRect().width;
      const calculatedBodyWidth = document.body.offsetWidth || window.innerWidth;

      // first calculate the default (top/left) position
      let newPositionTop = (cellPosition?.top || 0) - this._tooltipElm.offsetHeight - (this._cellTooltipOptions.offsetTopBottom ?? 0);
      let newPositionLeft = (cellPosition?.left || 0) - (this._cellTooltipOptions.offsetRight ?? 0);

      // user could explicitely use a "left-align" arrow position, (when user knows his column is completely on the right in the grid)
      // or when using "auto" and we detect not enough available space then we'll position to the "left" of the cell
      const position = this._cellTooltipOptions.position || 'auto';
      if (position === 'center') {
        newPositionLeft += (cellContainerWidth / 2) - (calculatedTooltipWidth / 2) + (this._cellTooltipOptions.offsetRight || 0);
        this._tooltipElm.classList.remove('arrow-left-align');
        this._tooltipElm.classList.remove('arrow-right-align');
        this._tooltipElm.classList.add('arrow-center-align');

      } else if (position === 'right-align' || ((position === 'auto' || position !== 'left-align') && (newPositionLeft + calculatedTooltipWidth) > calculatedBodyWidth)) {
        newPositionLeft -= (calculatedTooltipWidth - cellContainerWidth - (this._cellTooltipOptions.offsetLeft || 0));
        this._tooltipElm.classList.remove('arrow-center-align');
        this._tooltipElm.classList.remove('arrow-left-align');
        this._tooltipElm.classList.add('arrow-right-align');
      } else {
        this._tooltipElm.classList.remove('arrow-center-align');
        this._tooltipElm.classList.remove('arrow-right-align');
        this._tooltipElm.classList.add('arrow-left-align');
      }

      // do the same calculation/reposition with top/bottom (default is top of the cell or in other word starting from the cell going down)
      if (position === 'bottom' || (position === 'auto' && calculatedTooltipHeight > Utils.calculateAvailableSpace(this._cellNodeElm).top)) {
        newPositionTop = (cellPosition?.top || 0) + (this._gridOptions.rowHeight || 0) + (this._cellTooltipOptions.offsetTopBottom || 0);
        this._tooltipElm.classList.remove('arrow-down');
        this._tooltipElm.classList.add('arrow-up');
      } else {
        this._tooltipElm.classList.add('arrow-down');
        this._tooltipElm.classList.remove('arrow-up');
      }

      // reposition the tooltip over the cell (90% of the time this will end up using a position on the "right" of the cell)
      this._tooltipElm.style.top = newPositionTop + 'px';
      this._tooltipElm.style.left = newPositionLeft + 'px';
    }
  }

  /**
   * Parse the Custom Formatter (when provided) or return directly the text when it is already a string.
   * We will also sanitize the text in both cases before returning it so that it can be used safely.
   */
  protected parseFormatterAndSanitize(formatterOrText: Formatter | string | undefined, cell: { row: number; cell: number; }, value: any, columnDef: Column, item: unknown): string {
    if (typeof formatterOrText === 'function') {
      const tooltipText = formatterOrText(cell.row, cell.cell, value, columnDef, item, this._grid);
      const formatterText = (typeof tooltipText === 'object' && tooltipText?.text) ? tooltipText.text : (typeof tooltipText === 'string' ? tooltipText : '');
      return this._grid.sanitizeHtmlString(formatterText);
    } else if (typeof formatterOrText === 'string') {
      return this._grid.sanitizeHtmlString(formatterOrText);
    }
    return '';
  }


  protected renderTooltipFormatter(formatter: Formatter | string | undefined, cell: { row: number; cell: number; }, value: any, columnDef: Column, item: unknown, tooltipText?: string, inputTitleElm?: Element | null) {
    // create the tooltip DOM element with the text returned by the Formatter
    this._tooltipElm = document.createElement('div');
    this._tooltipElm.className = (this._cellTooltipOptions.className || this._defaults.className) as string;
    this._tooltipElm.classList.add(this._grid.getUID());
    this._tooltipElm.classList.add('l' + cell.cell);
    this._tooltipElm.classList.add('r' + cell.cell);
    let outputText = tooltipText || this.parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || '';
    outputText = (this._cellTooltipOptions.tooltipTextMaxLength && outputText.length > this._cellTooltipOptions.tooltipTextMaxLength) ? outputText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + '...' : outputText;

    let finalOutputText = '';
    if (!tooltipText || (this._cellTooltipOptions?.renderRegularTooltipAsHtml)) {
      finalOutputText = this._grid.sanitizeHtmlString(outputText);
      this._tooltipElm.innerHTML = finalOutputText;
      this._tooltipElm.style.whiteSpace = this._cellTooltipOptions?.whiteSpace ?? this._defaults.whiteSpace as string;
    } else {
      finalOutputText = outputText || '';
      this._tooltipElm.textContent = finalOutputText;
      this._tooltipElm.style.whiteSpace = this._cellTooltipOptions?.regularTooltipWhiteSpace ?? this._defaults.regularTooltipWhiteSpace as string; // use `pre` so that sequences of white space are collapsed. Lines are broken at newline characters
    }

    // optional max height/width of the tooltip container
    if (this._cellTooltipOptions.maxHeight) {
      this._tooltipElm.style.maxHeight = this._cellTooltipOptions.maxHeight + 'px';
    }
    if (this._cellTooltipOptions.maxWidth) {
      this._tooltipElm.style.maxWidth = this._cellTooltipOptions.maxWidth + 'px';
    }

    // when do have text to show, then append the new tooltip to the html body & reposition the tooltip
    if (finalOutputText) {
      document.body.appendChild(this._tooltipElm);

      // reposition the tooltip on top of the cell that triggered the mouse over event
      this.reposition(cell);

      // user could optionally hide the tooltip arrow (we can simply update the CSS variables, that's the only way we have to update CSS pseudo)
      if (!this._cellTooltipOptions.hideArrow) {
        this._tooltipElm.classList.add('tooltip-arrow');
      }

      // also clear any "title" attribute to avoid showing a 2nd browser tooltip
      this.swapAndClearTitleAttribute(inputTitleElm, outputText);
    }
  }

  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean {
    if (typeof overrideFn === 'function') {
      return overrideFn.call(this, args);
    }
    return true;
  }

  setOptions(newOptions: Partial<CustomTooltipOption>) {
    this._options = Utils.extend({}, this._options, newOptions);
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        CustomTooltip
      }
    }
  });
}

