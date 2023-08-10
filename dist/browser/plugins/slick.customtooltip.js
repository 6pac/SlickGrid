"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:../slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:../slick.core.js"() {
    }
  });

  // src/plugins/slick.customtooltip.js
  var require_slick_customtooltip = __commonJS({
    "src/plugins/slick.customtooltip.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.CustomTooltip = void 0;
      var slick_core_1 = require_slick_core(), SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, CustomTooltip = (
        /** @class */
        function() {
          function CustomTooltip2(tooltipOptions) {
            this.tooltipOptions = tooltipOptions, this.pluginName = "CustomTooltip", this._defaults = {
              className: "slick-custom-tooltip",
              offsetLeft: 0,
              offsetRight: 0,
              offsetTopBottom: 4,
              hideArrow: !1,
              tooltipTextMaxLength: 700,
              regularTooltipWhiteSpace: "pre-line",
              whiteSpace: "normal"
            }, this._eventHandler = new SlickEventHandler();
          }
          return CustomTooltip2.prototype.init = function(grid) {
            var _this = this;
            this._grid = grid;
            var _data = (grid == null ? void 0 : grid.getData()) || [];
            this._dataView = Array.isArray(_data) ? null : _data, this._gridOptions = grid.getOptions() || {}, this._options = Utils.extend(!0, {}, this._defaults, this._gridOptions.customTooltip, this.tooltipOptions), this._eventHandler.subscribe(grid.onMouseEnter, this.handleOnMouseEnter.bind(this)).subscribe(grid.onHeaderMouseEnter, function(e, args) {
              return _this.handleOnHeaderMouseEnterByType(e, args, "slick-header-column");
            }).subscribe(grid.onHeaderRowMouseEnter, function(e, args) {
              return _this.handleOnHeaderMouseEnterByType(e, args, "slick-headerrow-column");
            }).subscribe(grid.onMouseLeave, function() {
              return _this.hideTooltip();
            }).subscribe(grid.onHeaderMouseLeave, function() {
              return _this.hideTooltip();
            }).subscribe(grid.onHeaderRowMouseLeave, function() {
              return _this.hideTooltip();
            });
          }, CustomTooltip2.prototype.destroy = function() {
            this.hideTooltip(), this._eventHandler.unsubscribeAll();
          }, CustomTooltip2.prototype.handleOnHeaderMouseEnterByType = function(e, args, selector) {
            this.hideTooltip();
            var cell = {
              row: -1,
              cell: this._grid.getColumns().findIndex(function(col) {
                var _a;
                return ((_a = args == null ? void 0 : args.column) === null || _a === void 0 ? void 0 : _a.id) === col.id;
              })
            }, columnDef = args.column, item = {}, isHeaderRowType = selector === "slick-headerrow-column";
            if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = this._grid, args.type = isHeaderRowType ? "header-row" : "header", this._cellTooltipOptions = Utils.extend(!0, {}, this._options, columnDef.customTooltip), !(columnDef != null && columnDef.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args)) && columnDef && e.target) {
              this._cellNodeElm = e.target.closest(".".concat(selector));
              var formatter = isHeaderRowType ? this._cellTooltipOptions.headerRowFormatter : this._cellTooltipOptions.headerFormatter;
              if (this._cellTooltipOptions.useRegularTooltip || !formatter) {
                var formatterOrText = isHeaderRowType ? this._cellTooltipOptions.useRegularTooltip ? null : formatter : columnDef.name;
                this.renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
              } else
                this._cellNodeElm && typeof formatter == "function" && this.renderTooltipFormatter(formatter, cell, null, columnDef, item);
            }
          }, CustomTooltip2.prototype.handleOnMouseEnter = function(e, args) {
            var _this = this, _a, _b;
            if (this.hideTooltip(), this._grid && e) {
              var targetClassName = (_b = (_a = event == null ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.closest(".slick-cell")) === null || _b === void 0 ? void 0 : _b.className, cell_1 = targetClassName && /l\d+/.exec(targetClassName || "") ? this._grid.getCellFromEvent(e) : null;
              if (cell_1) {
                var item_1 = this._dataView ? this._dataView.getItem(cell_1.row) : this._grid.getDataItem(cell_1.row), columnDef_1 = this._grid.getColumns()[cell_1.cell];
                if (this._cellNodeElm = this._grid.getCellNode(cell_1.row, cell_1.cell), this._cellTooltipOptions = Utils.extend(!0, {}, this._options, columnDef_1.customTooltip), item_1 && columnDef_1) {
                  if (args = args || {}, args.cell = cell_1.cell, args.row = cell_1.row, args.columnDef = columnDef_1, args.dataContext = item_1, args.grid = this._grid, args.type = "cell", columnDef_1 != null && columnDef_1.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args))
                    return;
                  var value_1 = item_1.hasOwnProperty(columnDef_1.field) ? item_1[columnDef_1.field] : null;
                  if (this._cellTooltipOptions.useRegularTooltip || !this._cellTooltipOptions.formatter)
                    this.renderRegularTooltip(columnDef_1.formatter, cell_1, value_1, columnDef_1, item_1);
                  else if (typeof this._cellTooltipOptions.formatter == "function" && this.renderTooltipFormatter(this._cellTooltipOptions.formatter, cell_1, value_1, columnDef_1, item_1), typeof this._cellTooltipOptions.asyncProcess == "function") {
                    var asyncProcess = this._cellTooltipOptions.asyncProcess(cell_1.row, cell_1.cell, value_1, columnDef_1, item_1, this._grid);
                    if (!this._cellTooltipOptions.asyncPostFormatter)
                      throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
                    asyncProcess instanceof Promise && (this._cancellablePromise = this.cancellablePromise(asyncProcess), this._cancellablePromise.promise.then(function(asyncResult) {
                      _this.asyncProcessCallback(asyncResult, cell_1, value_1, columnDef_1, item_1);
                    }).catch(function(error) {
                      if (!error.isPromiseCancelled)
                        throw error;
                    }));
                  }
                }
              }
            }
          }, CustomTooltip2.prototype.findFirstElementAttribute = function(inputElm, attributes) {
            if (inputElm) {
              var outputAttrData_1 = null;
              return attributes.forEach(function(attribute) {
                var attrData = inputElm.getAttribute(attribute);
                attrData && (outputAttrData_1 = attrData);
              }), outputAttrData_1;
            }
            return null;
          }, CustomTooltip2.prototype.renderRegularTooltip = function(formatterOrText, cell, value, columnDef, item) {
            var tmpDiv = document.createElement("div");
            tmpDiv.innerHTML = this.parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item);
            var tooltipText = columnDef.toolTip || "", tmpTitleElm;
            tooltipText || (this._cellNodeElm && this._cellNodeElm.clientWidth < this._cellNodeElm.scrollWidth && !this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? (tooltipText = (this._cellNodeElm.textContent || "").trim() || "", this._cellTooltipOptions.tooltipTextMaxLength && tooltipText.length > this._cellTooltipOptions.tooltipTextMaxLength && (tooltipText = tooltipText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..."), tmpTitleElm = this._cellNodeElm) : (this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? tmpTitleElm = tmpDiv.querySelector("[title], [data-slick-tooltip]") : (tmpTitleElm = this.findFirstElementAttribute(this._cellNodeElm, ["title", "data-slick-tooltip"]) ? this._cellNodeElm : tmpDiv.querySelector("[title], [data-slick-tooltip]"), (!tmpTitleElm || !this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"])) && this._cellNodeElm && (tmpTitleElm = this._cellNodeElm.querySelector("[title], [data-slick-tooltip]"))), (!tooltipText || typeof formatterOrText == "function" && this._cellTooltipOptions.useRegularTooltipFromFormatterOnly) && (tooltipText = this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"]) || ""))), tooltipText !== "" && this.renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText), this.swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
          }, CustomTooltip2.prototype.swapAndClearTitleAttribute = function(inputTitleElm, tooltipText) {
            var titleElm = inputTitleElm || this._cellNodeElm && (this._cellNodeElm.hasAttribute("title") && this._cellNodeElm.getAttribute("title") ? this._cellNodeElm : this._cellNodeElm.querySelector("[title]"));
            titleElm && (titleElm.setAttribute("data-slick-tooltip", tooltipText || ""), titleElm.hasAttribute("title") && titleElm.setAttribute("title", ""));
          }, CustomTooltip2.prototype.asyncProcessCallback = function(asyncResult, cell, value, columnDef, dataContext) {
            var _a;
            this.hideTooltip();
            var itemWithAsyncData = Utils.extend(!0, {}, dataContext, (_a = {}, _a[this._cellTooltipOptions.asyncParamsPropName || "__params"] = asyncResult, _a));
            this.renderTooltipFormatter(this._cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
          }, CustomTooltip2.prototype.cancellablePromise = function(inputPromise) {
            var hasCancelled = !1;
            return inputPromise instanceof Promise ? {
              promise: inputPromise.then(function(result) {
                if (hasCancelled)
                  throw { isPromiseCancelled: !0 };
                return result;
              }),
              cancel: function() {
                return hasCancelled = !0;
              }
            } : inputPromise;
          }, CustomTooltip2.prototype.getHtmlElementOffset = function(element) {
            if (element) {
              var rect = element.getBoundingClientRect(), left = 0, top = 0, bottom = 0, right = 0;
              return rect.top !== void 0 && rect.left !== void 0 && (top = rect.top + window.pageYOffset, left = rect.left + window.pageXOffset, right = rect.right, bottom = rect.bottom), { top, left, bottom, right };
            }
          }, CustomTooltip2.prototype.hideTooltip = function() {
            var _a, _b, _c;
            (_a = this._cancellablePromise) === null || _a === void 0 || _a.cancel();
            var prevTooltip = document.body.querySelector(".".concat((_c = (_b = this._cellTooltipOptions) === null || _b === void 0 ? void 0 : _b.className) !== null && _c !== void 0 ? _c : this._defaults.className, ".").concat(this._grid.getUID()));
            prevTooltip == null || prevTooltip.remove();
          }, CustomTooltip2.prototype.reposition = function(cell) {
            var _a, _b;
            if (this._tooltipElm) {
              this._cellNodeElm = this._cellNodeElm || this._grid.getCellNode(cell.row, cell.cell);
              var cellPosition = this.getHtmlElementOffset(this._cellNodeElm), cellContainerWidth = this._cellNodeElm.offsetWidth, calculatedTooltipHeight = this._tooltipElm.getBoundingClientRect().height, calculatedTooltipWidth = this._tooltipElm.getBoundingClientRect().width, calculatedBodyWidth = document.body.offsetWidth || window.innerWidth, newPositionTop = ((cellPosition == null ? void 0 : cellPosition.top) || 0) - this._tooltipElm.offsetHeight - ((_a = this._cellTooltipOptions.offsetTopBottom) !== null && _a !== void 0 ? _a : 0), newPositionLeft = ((cellPosition == null ? void 0 : cellPosition.left) || 0) - ((_b = this._cellTooltipOptions.offsetRight) !== null && _b !== void 0 ? _b : 0), position = this._cellTooltipOptions.position || "auto";
              position === "center" ? (newPositionLeft += cellContainerWidth / 2 - calculatedTooltipWidth / 2 + (this._cellTooltipOptions.offsetRight || 0), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-center-align")) : position === "right-align" || (position === "auto" || position !== "left-align") && newPositionLeft + calculatedTooltipWidth > calculatedBodyWidth ? (newPositionLeft -= calculatedTooltipWidth - cellContainerWidth - (this._cellTooltipOptions.offsetLeft || 0), this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.add("arrow-right-align")) : (this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-left-align")), position === "bottom" || position === "auto" && calculatedTooltipHeight > Utils.calculateAvailableSpace(this._cellNodeElm).top ? (newPositionTop = ((cellPosition == null ? void 0 : cellPosition.top) || 0) + (this._gridOptions.rowHeight || 0) + (this._cellTooltipOptions.offsetTopBottom || 0), this._tooltipElm.classList.remove("arrow-down"), this._tooltipElm.classList.add("arrow-up")) : (this._tooltipElm.classList.add("arrow-down"), this._tooltipElm.classList.remove("arrow-up")), this._tooltipElm.style.top = newPositionTop + "px", this._tooltipElm.style.left = newPositionLeft + "px";
            }
          }, CustomTooltip2.prototype.parseFormatterAndSanitize = function(formatterOrText, cell, value, columnDef, item) {
            if (typeof formatterOrText == "function") {
              var tooltipText = formatterOrText(cell.row, cell.cell, value, columnDef, item, this._grid), formatterText = typeof tooltipText == "object" && (tooltipText != null && tooltipText.text) ? tooltipText.text : typeof tooltipText == "string" ? tooltipText : "";
              return this._grid.sanitizeHtmlString(formatterText);
            } else if (typeof formatterOrText == "string")
              return this._grid.sanitizeHtmlString(formatterOrText);
            return "";
          }, CustomTooltip2.prototype.renderTooltipFormatter = function(formatter, cell, value, columnDef, item, tooltipText, inputTitleElm) {
            var _a, _b, _c, _d, _e;
            this._tooltipElm = document.createElement("div"), this._tooltipElm.className = this._cellTooltipOptions.className || this._defaults.className, this._tooltipElm.classList.add(this._grid.getUID()), this._tooltipElm.classList.add("l" + cell.cell), this._tooltipElm.classList.add("r" + cell.cell);
            var outputText = tooltipText || this.parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || "";
            outputText = this._cellTooltipOptions.tooltipTextMaxLength && outputText.length > this._cellTooltipOptions.tooltipTextMaxLength ? outputText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..." : outputText;
            var finalOutputText = "";
            !tooltipText || !((_a = this._cellTooltipOptions) === null || _a === void 0) && _a.renderRegularTooltipAsHtml ? (finalOutputText = this._grid.sanitizeHtmlString(outputText), this._tooltipElm.innerHTML = finalOutputText, this._tooltipElm.style.whiteSpace = (_c = (_b = this._cellTooltipOptions) === null || _b === void 0 ? void 0 : _b.whiteSpace) !== null && _c !== void 0 ? _c : this._defaults.whiteSpace) : (finalOutputText = outputText || "", this._tooltipElm.textContent = finalOutputText, this._tooltipElm.style.whiteSpace = (_e = (_d = this._cellTooltipOptions) === null || _d === void 0 ? void 0 : _d.regularTooltipWhiteSpace) !== null && _e !== void 0 ? _e : this._defaults.regularTooltipWhiteSpace), this._cellTooltipOptions.maxHeight && (this._tooltipElm.style.maxHeight = this._cellTooltipOptions.maxHeight + "px"), this._cellTooltipOptions.maxWidth && (this._tooltipElm.style.maxWidth = this._cellTooltipOptions.maxWidth + "px"), finalOutputText && (document.body.appendChild(this._tooltipElm), this.reposition(cell), this._cellTooltipOptions.hideArrow || this._tooltipElm.classList.add("tooltip-arrow"), this.swapAndClearTitleAttribute(inputTitleElm, outputText));
          }, CustomTooltip2.prototype.runOverrideFunctionWhenExists = function(overrideFn, args) {
            return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
          }, CustomTooltip2.prototype.setOptions = function(newOptions) {
            this._options = Utils.extend({}, this._options, newOptions);
          }, CustomTooltip2;
        }()
      );
      exports.CustomTooltip = CustomTooltip;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          Plugins: {
            CustomTooltip
          }
        }
      });
    }
  });
  require_slick_customtooltip();
})();
//# sourceMappingURL=slick.customtooltip.js.map
