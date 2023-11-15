"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.customtooltip.ts
  var SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickCustomTooltip = class {
    constructor(tooltipOptions) {
      this.tooltipOptions = tooltipOptions;
      // --
      // public API
      __publicField(this, "pluginName", "CustomTooltip");
      // --
      // protected props
      __publicField(this, "_cancellablePromise");
      __publicField(this, "_cellNodeElm");
      __publicField(this, "_dataView");
      __publicField(this, "_grid");
      __publicField(this, "_gridOptions");
      __publicField(this, "_tooltipElm");
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        className: "slick-custom-tooltip",
        offsetLeft: 0,
        offsetRight: 0,
        offsetTopBottom: 4,
        hideArrow: !1,
        tooltipTextMaxLength: 700,
        regularTooltipWhiteSpace: "pre-line",
        whiteSpace: "normal"
      });
      __publicField(this, "_eventHandler", new SlickEventHandler());
      __publicField(this, "_cellTooltipOptions");
    }
    /**
     * Initialize plugin.
     */
    init(grid) {
      this._grid = grid;
      let _data = (grid == null ? void 0 : grid.getData()) || [];
      this._dataView = Array.isArray(_data) ? null : _data, this._gridOptions = grid.getOptions() || {}, this._options = Utils.extend(!0, {}, this._defaults, this._gridOptions.customTooltip, this.tooltipOptions), this._eventHandler.subscribe(grid.onMouseEnter, this.handleOnMouseEnter.bind(this)).subscribe(grid.onHeaderMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, "slick-header-column")).subscribe(grid.onHeaderRowMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, "slick-headerrow-column")).subscribe(grid.onMouseLeave, () => this.hideTooltip()).subscribe(grid.onHeaderMouseLeave, () => this.hideTooltip()).subscribe(grid.onHeaderRowMouseLeave, () => this.hideTooltip());
    }
    /**
     * Destroy plugin.
     */
    destroy() {
      this.hideTooltip(), this._eventHandler.unsubscribeAll();
    }
    /** depending on the selector type, execute the necessary handler code */
    handleOnHeaderMouseEnterByType(e, args, selector) {
      this.hideTooltip();
      let cell = {
        row: -1,
        // negative row to avoid pulling any dataContext while rendering
        cell: this._grid.getColumns().findIndex((col) => {
          var _a;
          return ((_a = args == null ? void 0 : args.column) == null ? void 0 : _a.id) === col.id;
        })
      }, columnDef = args.column, item = {}, isHeaderRowType = selector === "slick-headerrow-column";
      if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = this._grid, args.type = isHeaderRowType ? "header-row" : "header", this._cellTooltipOptions = Utils.extend(!0, {}, this._options, columnDef.customTooltip), !(columnDef != null && columnDef.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args)) && columnDef && e.target) {
        this._cellNodeElm = e.target.closest(`.${selector}`);
        let formatter = isHeaderRowType ? this._cellTooltipOptions.headerRowFormatter : this._cellTooltipOptions.headerFormatter;
        if (this._cellTooltipOptions.useRegularTooltip || !formatter) {
          let formatterOrText = isHeaderRowType ? this._cellTooltipOptions.useRegularTooltip ? null : formatter : columnDef.name;
          this.renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
        } else
          this._cellNodeElm && typeof formatter == "function" && this.renderTooltipFormatter(formatter, cell, null, columnDef, item);
      }
    }
    /**
     * Handle mouse entering grid cell to show tooltip.
     * @param {jQuery.Event} e - The event
     */
    handleOnMouseEnter(e, args) {
      var _a, _b;
      if (this.hideTooltip(), this._grid && e) {
        let targetClassName = (_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.closest(".slick-cell")) == null ? void 0 : _b.className, cell = targetClassName && /l\d+/.exec(targetClassName || "") ? this._grid.getCellFromEvent(e) : null;
        if (cell) {
          let item = this._dataView ? this._dataView.getItem(cell.row) : this._grid.getDataItem(cell.row), columnDef = this._grid.getColumns()[cell.cell];
          if (this._cellNodeElm = this._grid.getCellNode(cell.row, cell.cell), this._cellTooltipOptions = Utils.extend(!0, {}, this._options, columnDef.customTooltip), item && columnDef) {
            if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = this._grid, args.type = "cell", columnDef != null && columnDef.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args))
              return;
            let value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
            if (this._cellTooltipOptions.useRegularTooltip || !this._cellTooltipOptions.formatter)
              this.renderRegularTooltip(columnDef.formatter, cell, value, columnDef, item);
            else if (typeof this._cellTooltipOptions.formatter == "function" && this.renderTooltipFormatter(this._cellTooltipOptions.formatter, cell, value, columnDef, item), typeof this._cellTooltipOptions.asyncProcess == "function") {
              let asyncProcess = this._cellTooltipOptions.asyncProcess(cell.row, cell.cell, value, columnDef, item, this._grid);
              if (!this._cellTooltipOptions.asyncPostFormatter)
                throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
              asyncProcess instanceof Promise && (this._cancellablePromise = this.cancellablePromise(asyncProcess), this._cancellablePromise.promise.then((asyncResult) => {
                this.asyncProcessCallback(asyncResult, cell, value, columnDef, item);
              }).catch(function(error) {
                if (!error.isPromiseCancelled)
                  throw error;
              }));
            }
          }
        }
      }
    }
    findFirstElementAttribute(inputElm, attributes) {
      if (inputElm) {
        let outputAttrData = null;
        return attributes.forEach((attribute) => {
          let attrData = inputElm.getAttribute(attribute);
          attrData && (outputAttrData = attrData);
        }), outputAttrData;
      }
      return null;
    }
    /**
     * Parse the cell formatter and assume it might be html
     * then create a temporary html element to easily retrieve the first [title=""] attribute text content
     * also clear the "title" attribute from the grid div text content so that it won't show also as a 2nd browser tooltip
     */
    renderRegularTooltip(formatterOrText, cell, value, columnDef, item) {
      let tmpDiv = document.createElement("div");
      this._grid.applyHtmlCode(tmpDiv, this.parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item));
      let tooltipText = columnDef.toolTip || "", tmpTitleElm;
      tooltipText || (this._cellNodeElm && this._cellNodeElm.clientWidth < this._cellNodeElm.scrollWidth && !this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? (tooltipText = (this._cellNodeElm.textContent || "").trim() || "", this._cellTooltipOptions.tooltipTextMaxLength && tooltipText.length > this._cellTooltipOptions.tooltipTextMaxLength && (tooltipText = tooltipText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..."), tmpTitleElm = this._cellNodeElm) : (this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? tmpTitleElm = tmpDiv.querySelector("[title], [data-slick-tooltip]") : (tmpTitleElm = this.findFirstElementAttribute(this._cellNodeElm, ["title", "data-slick-tooltip"]) ? this._cellNodeElm : tmpDiv.querySelector("[title], [data-slick-tooltip]"), (!tmpTitleElm || !this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"])) && this._cellNodeElm && (tmpTitleElm = this._cellNodeElm.querySelector("[title], [data-slick-tooltip]"))), (!tooltipText || typeof formatterOrText == "function" && this._cellTooltipOptions.useRegularTooltipFromFormatterOnly) && (tooltipText = this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"]) || ""))), tooltipText !== "" && this.renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText), this.swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
    }
    /**
    * swap and copy the "title" attribute into a new custom attribute then clear the "title" attribute
    * from the grid div text content so that it won't show also as a 2nd browser tooltip
    */
    swapAndClearTitleAttribute(inputTitleElm, tooltipText) {
      let titleElm = inputTitleElm || this._cellNodeElm && (this._cellNodeElm.hasAttribute("title") && this._cellNodeElm.getAttribute("title") ? this._cellNodeElm : this._cellNodeElm.querySelector("[title]"));
      titleElm && (titleElm.setAttribute("data-slick-tooltip", tooltipText || ""), titleElm.hasAttribute("title") && titleElm.setAttribute("title", ""));
    }
    asyncProcessCallback(asyncResult, cell, value, columnDef, dataContext) {
      this.hideTooltip();
      let itemWithAsyncData = Utils.extend(!0, {}, dataContext, { [this._cellTooltipOptions.asyncParamsPropName || "__params"]: asyncResult });
      this.renderTooltipFormatter(this._cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
    }
    cancellablePromise(inputPromise) {
      let hasCancelled = !1;
      return inputPromise instanceof Promise ? {
        promise: inputPromise.then(function(result) {
          if (hasCancelled)
            throw { isPromiseCancelled: !0 };
          return result;
        }),
        cancel: () => hasCancelled = !0
      } : inputPromise;
    }
    getHtmlElementOffset(element) {
      if (!element)
        return;
      let rect = element.getBoundingClientRect(), left = 0, top = 0, bottom = 0, right = 0;
      return rect.top !== void 0 && rect.left !== void 0 && (top = rect.top + window.pageYOffset, left = rect.left + window.pageXOffset, right = rect.right, bottom = rect.bottom), { top, left, bottom, right };
    }
    /**
     * hide (remove) tooltip from the DOM,
     * when using async process, it will also cancel any opened Promise/Observable that might still be opened/pending.
     */
    hideTooltip() {
      var _a, _b, _c;
      (_a = this._cancellablePromise) == null || _a.cancel();
      let prevTooltip = document.body.querySelector(`.${(_c = (_b = this._cellTooltipOptions) == null ? void 0 : _b.className) != null ? _c : this._defaults.className}.${this._grid.getUID()}`);
      prevTooltip == null || prevTooltip.remove();
    }
    /**
     * Reposition the Tooltip to be top-left position over the cell.
     * By default we use an "auto" mode which will allow to position the Tooltip to the best logical position in the window, also when we mention position, we are talking about the relative position against the grid cell.
     * We can assume that in 80% of the time the default position is top-right, the default is "auto" but we can also override it and use a specific position.
     * Most of the time positioning of the tooltip will be to the "top-right" of the cell is ok but if our column is completely on the right side then we'll want to change the position to "left" align.
     * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are hovering a cell at the top of the grid and there's no room to display it then we might need to reposition to "bottom" instead.
     */
    reposition(cell) {
      var _a, _b;
      if (this._tooltipElm) {
        this._cellNodeElm = this._cellNodeElm || this._grid.getCellNode(cell.row, cell.cell);
        let cellPosition = this.getHtmlElementOffset(this._cellNodeElm), cellContainerWidth = this._cellNodeElm.offsetWidth, calculatedTooltipHeight = this._tooltipElm.getBoundingClientRect().height, calculatedTooltipWidth = this._tooltipElm.getBoundingClientRect().width, calculatedBodyWidth = document.body.offsetWidth || window.innerWidth, newPositionTop = ((cellPosition == null ? void 0 : cellPosition.top) || 0) - this._tooltipElm.offsetHeight - ((_a = this._cellTooltipOptions.offsetTopBottom) != null ? _a : 0), newPositionLeft = ((cellPosition == null ? void 0 : cellPosition.left) || 0) - ((_b = this._cellTooltipOptions.offsetRight) != null ? _b : 0), position = this._cellTooltipOptions.position || "auto";
        position === "center" ? (newPositionLeft += cellContainerWidth / 2 - calculatedTooltipWidth / 2 + (this._cellTooltipOptions.offsetRight || 0), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-center-align")) : position === "right-align" || (position === "auto" || position !== "left-align") && newPositionLeft + calculatedTooltipWidth > calculatedBodyWidth ? (newPositionLeft -= calculatedTooltipWidth - cellContainerWidth - (this._cellTooltipOptions.offsetLeft || 0), this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.add("arrow-right-align")) : (this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-left-align")), position === "bottom" || position === "auto" && calculatedTooltipHeight > Utils.calculateAvailableSpace(this._cellNodeElm).top ? (newPositionTop = ((cellPosition == null ? void 0 : cellPosition.top) || 0) + (this._gridOptions.rowHeight || 0) + (this._cellTooltipOptions.offsetTopBottom || 0), this._tooltipElm.classList.remove("arrow-down"), this._tooltipElm.classList.add("arrow-up")) : (this._tooltipElm.classList.add("arrow-down"), this._tooltipElm.classList.remove("arrow-up")), this._tooltipElm.style.top = newPositionTop + "px", this._tooltipElm.style.left = newPositionLeft + "px";
      }
    }
    /**
     * Parse the Custom Formatter (when provided) or return directly the text when it is already a string.
     * We will also sanitize the text in both cases before returning it so that it can be used safely.
     */
    parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item) {
      if (typeof formatterOrText == "function") {
        let tooltipResult = formatterOrText(cell.row, cell.cell, value, columnDef, item, this._grid), formatterText = Object.prototype.toString.call(tooltipResult) !== "[object Object]" ? tooltipResult : tooltipResult.html || tooltipResult.text;
        return formatterText instanceof HTMLElement ? formatterText : this._grid.sanitizeHtmlString(formatterText);
      } else if (typeof formatterOrText == "string")
        return this._grid.sanitizeHtmlString(formatterOrText);
      return "";
    }
    renderTooltipFormatter(formatter, cell, value, columnDef, item, tooltipText, inputTitleElm) {
      var _a, _b, _c, _d, _e;
      this._tooltipElm = document.createElement("div"), this._tooltipElm.className = this._cellTooltipOptions.className || this._defaults.className, this._tooltipElm.classList.add(this._grid.getUID()), this._tooltipElm.classList.add("l" + cell.cell), this._tooltipElm.classList.add("r" + cell.cell);
      let outputText = tooltipText || this.parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || "";
      if (outputText instanceof HTMLElement) {
        let content = outputText.textContent || "";
        this._cellTooltipOptions.tooltipTextMaxLength && content.length > this._cellTooltipOptions.tooltipTextMaxLength && (outputText.textContent = content.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "...");
      } else
        outputText = this._cellTooltipOptions.tooltipTextMaxLength && outputText.length > this._cellTooltipOptions.tooltipTextMaxLength ? outputText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..." : outputText;
      let finalOutputText = "";
      !tooltipText || (_a = this._cellTooltipOptions) != null && _a.renderRegularTooltipAsHtml ? (outputText instanceof HTMLElement ? (this._grid.applyHtmlCode(this._tooltipElm, outputText), finalOutputText = this._grid.sanitizeHtmlString(outputText.textContent || "")) : (finalOutputText = this._grid.sanitizeHtmlString(outputText), this._tooltipElm.innerHTML = finalOutputText), this._tooltipElm.style.whiteSpace = (_c = (_b = this._cellTooltipOptions) == null ? void 0 : _b.whiteSpace) != null ? _c : this._defaults.whiteSpace) : (finalOutputText = (outputText instanceof HTMLElement ? outputText.textContent : outputText) || "", this._tooltipElm.textContent = finalOutputText, this._tooltipElm.style.whiteSpace = (_e = (_d = this._cellTooltipOptions) == null ? void 0 : _d.regularTooltipWhiteSpace) != null ? _e : this._defaults.regularTooltipWhiteSpace), this._cellTooltipOptions.maxHeight && (this._tooltipElm.style.maxHeight = this._cellTooltipOptions.maxHeight + "px"), this._cellTooltipOptions.maxWidth && (this._tooltipElm.style.maxWidth = this._cellTooltipOptions.maxWidth + "px"), finalOutputText && (document.body.appendChild(this._tooltipElm), this.reposition(cell), this._cellTooltipOptions.hideArrow || this._tooltipElm.classList.add("tooltip-arrow"), this.swapAndClearTitleAttribute(inputTitleElm, (outputText instanceof HTMLElement ? outputText.textContent : outputText) || ""));
    }
    /**
     * Method that user can pass to override the default behavior.
     * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
     * @param overrideFn: override function callback
     * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
     */
    runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    setOptions(newOptions) {
      this._options = Utils.extend({}, this._options, newOptions);
    }
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        CustomTooltip: SlickCustomTooltip
      }
    }
  });
})();
//# sourceMappingURL=slick.customtooltip.js.map
