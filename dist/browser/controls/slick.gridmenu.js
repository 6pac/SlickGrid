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

  // src/controls/slick.gridmenu.js
  var require_slick_gridmenu = __commonJS({
    "src/controls/slick.gridmenu.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickGridMenu = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils, SlickGridMenu = (
        /** @class */
        function() {
          function SlickGridMenu2(columns, grid, gridOptions) {
            var _this = this;
            this.columns = columns, this.grid = grid, this.onAfterMenuShow = new SlickEvent(), this.onBeforeMenuShow = new SlickEvent(), this.onMenuClose = new SlickEvent(), this.onCommand = new SlickEvent(), this.onColumnsChanged = new SlickEvent(), this._isMenuOpen = !1, this._gridMenuOptions = null, this._headerElm = null, this._columnCheckboxes = [], this._defaults = {
              showButton: !0,
              hideForceFitButton: !1,
              hideSyncResizeButton: !1,
              forceFitTitle: "Force fit columns",
              marginBottom: 15,
              menuWidth: 18,
              contentMinWidth: 0,
              resizeOnShowHeaderRow: !1,
              syncResizeTitle: "Synchronous resize",
              useClickToRepositionMenu: !0,
              headerColumnValueExtractor: function(columnDef) {
                return columnDef.name;
              }
            }, this._gridUid = grid.getUID(), this._gridOptions = gridOptions, this._gridMenuOptions = Utils.extend({}, gridOptions.gridMenu), this._bindingEventService = new BindingEventService(), grid.onSetOptions.subscribe(function(_e, args) {
              if (args && args.optionsBefore && args.optionsAfter) {
                var switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
                (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && _this.recreateGridMenu();
              }
            }), this.init(this.grid);
          }
          return SlickGridMenu2.prototype.init = function(grid) {
            this._gridOptions = grid.getOptions(), this.createGridMenu(), grid.onBeforeDestroy.subscribe(this.destroy.bind(this));
          }, SlickGridMenu2.prototype.setOptions = function(newOptions) {
            this._gridMenuOptions = Utils.extend({}, this._gridMenuOptions, newOptions);
          }, SlickGridMenu2.prototype.createGridMenu = function() {
            var _a, _b, _c, _d, _f, _g, gridMenuWidth = ((_b = this._gridMenuOptions) === null || _b === void 0 ? void 0 : _b.menuWidth) || this._defaults.menuWidth;
            this._gridOptions && this._gridOptions.hasOwnProperty("frozenColumn") && this._gridOptions.frozenColumn >= 0 ? this._headerElm = document.querySelector(".".concat(this._gridUid, " .slick-header-right")) : this._headerElm = document.querySelector(".".concat(this._gridUid, " .slick-header-left")), this._headerElm.style.width = "calc(100% - ".concat(gridMenuWidth, "px)");
            var enableResizeHeaderRow = ((_c = this._gridMenuOptions) === null || _c === void 0 ? void 0 : _c.resizeOnShowHeaderRow) != null ? this._gridMenuOptions.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow;
            if (enableResizeHeaderRow && this._gridOptions.showHeaderRow) {
              var headerRow = document.querySelector(".".concat(this._gridUid, ".slick-headerrow"));
              headerRow && (headerRow.style.width = "calc(100% - ".concat(gridMenuWidth, "px)"));
            }
            var showButton = ((_d = this._gridMenuOptions) === null || _d === void 0 ? void 0 : _d.showButton) !== void 0 ? this._gridMenuOptions.showButton : this._defaults.showButton;
            if (showButton) {
              if (this._buttonElm = document.createElement("button"), this._buttonElm.className = "slick-gridmenu-button", this._buttonElm.ariaLabel = "Grid Menu", !((_f = this._gridMenuOptions) === null || _f === void 0) && _f.iconCssClass)
                (_a = this._buttonElm.classList).add.apply(_a, this._gridMenuOptions.iconCssClass.split(" "));
              else {
                var iconImageElm = document.createElement("img");
                iconImageElm.src = !((_g = this._gridMenuOptions) === null || _g === void 0) && _g.iconImage ? this._gridMenuOptions.iconImage : "../images/drag-handle.png", this._buttonElm.appendChild(iconImageElm);
              }
              this._headerElm.parentElement.insertBefore(this._buttonElm, this._headerElm.parentElement.firstChild), this._bindingEventService.bind(this._buttonElm, "click", this.showGridMenu.bind(this));
            }
            this._menuElm = document.createElement("div"), this._menuElm.className = "slick-gridmenu ".concat(this._gridUid), this._menuElm.style.display = "none", document.body.appendChild(this._menuElm);
            var buttonElm = document.createElement("button");
            buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-gridmenu", buttonElm.ariaLabel = "Close";
            var spanCloseElm = document.createElement("span");
            spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), this._menuElm.appendChild(buttonElm), this._customMenuElm = document.createElement("div"), this._customMenuElm.className = "slick-gridmenu-custom", this._customMenuElm.role = "menu", this._menuElm.appendChild(this._customMenuElm), this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm), this.populateColumnPicker(), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
          }, SlickGridMenu2.prototype.destroy = function() {
            var _a;
            this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onColumnsChanged.unsubscribe(), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this.grid.onBeforeDestroy.unsubscribe(), this.grid.onSetOptions.unsubscribe(), this._bindingEventService.unbindAll(), (_a = this._menuElm) === null || _a === void 0 || _a.remove(), this.deleteMenu();
          }, SlickGridMenu2.prototype.deleteMenu = function() {
            var _a, _b;
            this._bindingEventService.unbindAll();
            var gridMenuElm = document.querySelector("div.slick-gridmenu.".concat(this._gridUid));
            gridMenuElm && (gridMenuElm.style.display = "none"), this._headerElm && (this._headerElm.style.width = "100%"), (_a = this._buttonElm) === null || _a === void 0 || _a.remove(), (_b = this._menuElm) === null || _b === void 0 || _b.remove();
          }, SlickGridMenu2.prototype.populateCustomMenus = function(gridMenuOptions, customMenuElm) {
            var _a, _b, _c, _d;
            if (!(!gridMenuOptions || !gridMenuOptions.customItems)) {
              !((_d = this._gridMenuOptions) === null || _d === void 0) && _d.customTitle && (this._customTitleElm = document.createElement("div"), this._customTitleElm.className = "title", this._customTitleElm.innerHTML = this._gridMenuOptions.customTitle, customMenuElm.appendChild(this._customTitleElm));
              for (var i = 0, ln = gridMenuOptions.customItems.length; i < ln; i++) {
                var addClickListener = !0, item = gridMenuOptions.customItems[i], callbackArgs = {
                  grid: this.grid,
                  menu: this._menuElm,
                  columns: this.columns,
                  visibleColumns: this.getVisibleColumns()
                }, isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
                if (isItemVisible) {
                  Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
                  var liElm = document.createElement("div");
                  liElm.className = "slick-gridmenu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-gridmenu-item-divider"), addClickListener = !1), item.disabled && liElm.classList.add("slick-gridmenu-item-disabled"), item.hidden && liElm.classList.add("slick-gridmenu-item-hidden"), item.cssClass && (_a = liElm.classList).add.apply(_a, item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
                  var iconElm = document.createElement("div");
                  iconElm.className = "slick-gridmenu-icon", liElm.appendChild(iconElm), item.iconCssClass && (_b = iconElm.classList).add.apply(_b, item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(".concat(item.iconImage, ")"));
                  var textElm = document.createElement("span");
                  textElm.className = "slick-gridmenu-content", textElm.innerHTML = item.title || "", liElm.appendChild(textElm), item.textCssClass && (_c = textElm.classList).add.apply(_c, item.textCssClass.split(" ")), customMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item));
                }
              }
            }
          }, SlickGridMenu2.prototype.populateColumnPicker = function() {
            var _a;
            this.grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), !((_a = this._gridMenuOptions) === null || _a === void 0) && _a.columnTitle && (this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "title", this._columnTitleElm.innerHTML = this._gridMenuOptions.columnTitle, this._menuElm.appendChild(this._columnTitleElm)), this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-gridmenu-list", this._listElm.role = "menu";
          }, SlickGridMenu2.prototype.recreateGridMenu = function() {
            this.deleteMenu(), this.init(this.grid);
          }, SlickGridMenu2.prototype.showGridMenu = function(e) {
            var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, targetEvent = e.touches ? e.touches[0] : e;
            e.preventDefault(), Utils.emptyElement(this._listElm), Utils.emptyElement(this._customMenuElm), this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm), this.updateColumnOrder(), this._columnCheckboxes = [];
            var callbackArgs = {
              grid: this.grid,
              menu: this._menuElm,
              allColumns: this.columns,
              visibleColumns: this.getVisibleColumns()
            };
            if (!(this._gridMenuOptions && !this.runOverrideFunctionWhenExists(this._gridMenuOptions.menuUsabilityOverride, callbackArgs)) && !(typeof e.stopPropagation == "function" && this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() == !1)) {
              for (var columnId, columnLabel, excludeCssClass, i = 0; i < this.columns.length; i++) {
                columnId = this.columns[i].id, excludeCssClass = this.columns[i].excludeFromGridMenu ? "hidden" : "";
                var liElm = document.createElement("li");
                liElm.className = excludeCssClass, liElm.ariaLabel = ((_a = this.columns[i]) === null || _a === void 0 ? void 0 : _a.name) || "";
                var checkboxElm = document.createElement("input");
                checkboxElm.type = "checkbox", checkboxElm.id = "".concat(this._gridUid, "-gridmenu-colpicker-").concat(columnId), checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), this.grid.getColumnIndex(this.columns[i].id) != null && !this.columns[i].hidden && (checkboxElm.checked = !0), this._columnCheckboxes.push(checkboxElm), !((_b = this._gridMenuOptions) === null || _b === void 0) && _b.headerColumnValueExtractor ? columnLabel = this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions) : columnLabel = this._defaults.headerColumnValueExtractor(this.columns[i]);
                var labelElm = document.createElement("label");
                labelElm.htmlFor = "".concat(this._gridUid, "-gridmenu-colpicker-").concat(columnId), labelElm.innerHTML = columnLabel || "", liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
              }
              if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !(!((_c = this._gridMenuOptions) === null || _c === void 0) && _c.hideForceFitButton)) {
                var forceFitTitle = ((_d = this._gridMenuOptions) === null || _d === void 0 ? void 0 : _d.forceFitTitle) || this._defaults.forceFitTitle, liElm = document.createElement("li");
                liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", this._listElm.appendChild(liElm);
                var forceFitCheckboxElm = document.createElement("input");
                forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = "".concat(this._gridUid, "-gridmenu-colpicker-forcefit"), forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
                var labelElm = document.createElement("label");
                labelElm.htmlFor = "".concat(this._gridUid, "-gridmenu-colpicker-forcefit"), labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
              }
              if (!(!((_f = this._gridMenuOptions) === null || _f === void 0) && _f.hideSyncResizeButton)) {
                var syncResizeTitle = ((_g = this._gridMenuOptions) === null || _g === void 0 ? void 0 : _g.syncResizeTitle) || this._defaults.syncResizeTitle, liElm = document.createElement("li");
                liElm.ariaLabel = syncResizeTitle, this._listElm.appendChild(liElm);
                var syncResizeCheckboxElm = document.createElement("input");
                syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = "".concat(this._gridUid, "-gridmenu-colpicker-syncresize"), syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
                var labelElm = document.createElement("label");
                labelElm.htmlFor = "".concat(this._gridUid, "-gridmenu-colpicker-syncresize"), labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
              }
              var buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
              buttonElm || (buttonElm = e.target.parentElement), this._menuElm.style.display = "block", this._menuElm.style.opacity = "0";
              var menuIconOffset = Utils.offset(buttonElm), menuWidth = this._menuElm.offsetWidth, useClickToRepositionMenu = ((_h = this._gridMenuOptions) === null || _h === void 0 ? void 0 : _h.useClickToRepositionMenu) !== void 0 ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu, contentMinWidth = !((_j = this._gridMenuOptions) === null || _j === void 0) && _j.contentMinWidth ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, nextPositionTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, nextPositionLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10, menuMarginBottom = ((_k = this._gridMenuOptions) === null || _k === void 0 ? void 0 : _k.marginBottom) !== void 0 ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom;
              this._menuElm.style.top = "".concat(nextPositionTop + 10, "px"), this._menuElm.style.left = "".concat(nextPositionLeft - currentMenuWidth + 10, "px"), contentMinWidth > 0 && (this._menuElm.style.minWidth = "".concat(contentMinWidth, "px")), ((_l = this._gridMenuOptions) === null || _l === void 0 ? void 0 : _l.height) !== void 0 ? this._menuElm.style.height = "".concat(this._gridMenuOptions.height, "px") : this._menuElm.style.maxHeight = "".concat(window.innerHeight - targetEvent.clientY - menuMarginBottom, "px"), this._menuElm.style.display = "block", this._menuElm.style.opacity = "1", this._menuElm.appendChild(this._listElm), this._isMenuOpen = !0, typeof e.stopPropagation == "function" && this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue() == !1;
            }
          }, SlickGridMenu2.prototype.handleBodyMouseDown = function(event) {
            var _a;
            (this._menuElm !== event.target && !(!((_a = this._menuElm) === null || _a === void 0) && _a.contains(event.target)) && this._isMenuOpen || event.target.className === "close") && this.hideMenu(event);
          }, SlickGridMenu2.prototype.handleMenuItemClick = function(item, e) {
            var _a, command = item.command || "";
            if (!(item.disabled || item.divider || item === "divider")) {
              if (command != null && command != "") {
                var callbackArgs = {
                  grid: this.grid,
                  command,
                  item,
                  allColumns: this.columns,
                  visibleColumns: this.getVisibleColumns()
                };
                this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
              }
              var leaveOpen = !!(!((_a = this._gridMenuOptions) === null || _a === void 0) && _a.leaveOpen);
              !leaveOpen && !e.defaultPrevented && this.hideMenu(e), e.preventDefault(), e.stopPropagation();
            }
          }, SlickGridMenu2.prototype.hideMenu = function(e) {
            if (this._menuElm) {
              Utils.hide(this._menuElm), this._isMenuOpen = !1;
              var callbackArgs = {
                grid: this.grid,
                menu: this._menuElm,
                allColumns: this.columns,
                visibleColumns: this.getVisibleColumns()
              };
              if (this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() == !1)
                return;
            }
          }, SlickGridMenu2.prototype.updateAllTitles = function(gridMenuOptions) {
            var _a, _b;
            !((_a = this._customTitleElm) === null || _a === void 0) && _a.innerHTML && (this._customTitleElm.innerHTML = gridMenuOptions.customTitle || ""), !((_b = this._columnTitleElm) === null || _b === void 0) && _b.innerHTML && (this._columnTitleElm.innerHTML = gridMenuOptions.columnTitle || "");
          }, SlickGridMenu2.prototype.updateColumnOrder = function() {
            for (var current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length), i = 0; i < ordered.length; i++)
              this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
            this.columns = ordered;
          }, SlickGridMenu2.prototype.updateColumn = function(e) {
            var _this = this;
            if (e.target.dataset.option === "autoresize") {
              var previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked;
              this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
              return;
            }
            if (e.target.dataset.option === "syncresize") {
              this.grid.setOptions({ syncColumnCellResize: !!e.target.checked });
              return;
            }
            if (e.target.type === "checkbox") {
              var isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns_1 = [];
              if (this._columnCheckboxes.forEach(function(columnCheckbox, idx) {
                columnCheckbox.checked && (_this.columns[idx].hidden && (_this.columns[idx].hidden = !1), visibleColumns_1.push(_this.columns[idx]));
              }), !visibleColumns_1.length) {
                e.target.checked = !0;
                return;
              }
              var callbackArgs = {
                columnId,
                showing: isChecked,
                grid: this.grid,
                allColumns: this.columns,
                columns: visibleColumns_1,
                visibleColumns: this.getVisibleColumns()
              };
              this.grid.setColumns(visibleColumns_1), this.onColumnsChanged.notify(callbackArgs, e, this);
            }
          }, SlickGridMenu2.prototype.getAllColumns = function() {
            return this.columns;
          }, SlickGridMenu2.prototype.getVisibleColumns = function() {
            return this.grid.getColumns();
          }, SlickGridMenu2.prototype.runOverrideFunctionWhenExists = function(overrideFn, args) {
            return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
          }, SlickGridMenu2;
        }()
      );
      exports.SlickGridMenu = SlickGridMenu;
      window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.GridMenu = SlickGridMenu);
    }
  });
  require_slick_gridmenu();
})();
//# sourceMappingURL=slick.gridmenu.js.map
