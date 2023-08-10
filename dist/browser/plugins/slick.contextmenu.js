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

  // src/plugins/slick.contextmenu.js
  var require_slick_contextmenu = __commonJS({
    "src/plugins/slick.contextmenu.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickContextMenu = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, EventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickContextMenu = (
        /** @class */
        function() {
          function SlickContextMenu2(optionProperties) {
            this.pluginName = "ContextMenu", this.onAfterMenuShow = new SlickEvent(), this.onBeforeMenuShow = new SlickEvent(), this.onBeforeMenuClose = new SlickEvent(), this.onCommand = new SlickEvent(), this.onOptionSelected = new SlickEvent(), this._currentCell = -1, this._currentRow = -1, this._gridUid = "", this._handler = new EventHandler(), this._bindingEventService = new BindingEventService(), this._defaults = {
              autoAdjustDrop: !0,
              autoAlignSide: !0,
              autoAdjustDropOffset: -4,
              autoAlignSideOffset: 0,
              hideMenuOnScroll: !1,
              maxHeight: "none",
              width: "auto",
              optionShownOverColumnIds: [],
              commandShownOverColumnIds: []
            }, this._contextMenuProperties = Utils.extend({}, this._defaults, optionProperties);
          }
          return SlickContextMenu2.prototype.init = function(grid) {
            this._grid = grid, this._gridOptions = grid.getOptions(), this._gridUid = (grid == null ? void 0 : grid.getUID()) || "", this._handler.subscribe(this._grid.onContextMenu, this.handleOnContextMenu.bind(this)), this._contextMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
          }, SlickContextMenu2.prototype.setOptions = function(newOptions) {
            this._contextMenuProperties = Utils.extend({}, this._contextMenuProperties, newOptions), newOptions.commandShownOverColumnIds && (this._contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds), newOptions.optionShownOverColumnIds && (this._contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds);
          }, SlickContextMenu2.prototype.destroy = function() {
            var _a;
            this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), (_a = this._menuElm) === null || _a === void 0 || _a.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
          }, SlickContextMenu2.prototype.createMenu = function(evt) {
            var _a, _b, _c, _d, _e, _f, _g, _h, e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, targetEvent = (_b = (_a = e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, cell = this._grid.getCellFromEvent(e);
            this._currentCell = (_c = cell == null ? void 0 : cell.cell) !== null && _c !== void 0 ? _c : 0, this._currentRow = (_d = cell == null ? void 0 : cell.row) !== null && _d !== void 0 ? _d : 0;
            var columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), isColumnOptionAllowed = this.checkIsColumnAllowed((_e = this._contextMenuProperties.optionShownOverColumnIds) !== null && _e !== void 0 ? _e : [], columnDef.id), isColumnCommandAllowed = this.checkIsColumnAllowed((_f = this._contextMenuProperties.commandShownOverColumnIds) !== null && _f !== void 0 ? _f : [], columnDef.id), commandItems = this._contextMenuProperties.commandItems || [], optionItems = this._contextMenuProperties.optionItems || [];
            if (!(!columnDef || !isColumnCommandAllowed && !isColumnOptionAllowed || !commandItems.length && !optionItems.length) && (this.destroyMenu(e), this.onBeforeMenuShow.notify({
              cell: this._currentCell,
              row: this._currentRow,
              grid: this._grid
            }, e, this).getReturnValue() != !1)) {
              var maxHeight = isNaN(this._contextMenuProperties.maxHeight) ? this._contextMenuProperties.maxHeight : "".concat((_g = this._contextMenuProperties.maxHeight) !== null && _g !== void 0 ? _g : 0, "px"), width = isNaN(this._contextMenuProperties.width) ? this._contextMenuProperties.width : "".concat((_h = this._contextMenuProperties.maxWidth) !== null && _h !== void 0 ? _h : 0, "px");
              this._menuElm = document.createElement("div"), this._menuElm.className = "slick-context-menu ".concat(this._gridUid), this._menuElm.role = "menu", width && (this._menuElm.style.width = width), maxHeight && (this._menuElm.style.maxHeight = maxHeight), this._menuElm.style.top = "".concat(targetEvent.pageY, "px"), this._menuElm.style.left = "".concat(targetEvent.pageX, "px"), this._menuElm.style.display = "none";
              var closeButtonElm = document.createElement("button");
              closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-context-menu", closeButtonElm.ariaLabel = "Close";
              var spanCloseElm = document.createElement("span");
              if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !this._contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
                var optionMenuElm = document.createElement("div");
                optionMenuElm.className = "slick-context-menu-option-list", optionMenuElm.role = "menu", this._contextMenuProperties.hideCloseButton || (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(optionMenuElm), this.populateOptionItems(this._contextMenuProperties, optionMenuElm, optionItems, { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid });
              }
              if (!this._contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
                var commandMenuElm = document.createElement("div");
                commandMenuElm.className = "slick-context-menu-command-list", commandMenuElm.role = "menu", !this._contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || this._contextMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(commandMenuElm), this.populateCommandItems(this._contextMenuProperties, commandMenuElm, commandItems, { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid });
              }
              if (this._menuElm.style.display = "block", document.body.appendChild(this._menuElm), this.onAfterMenuShow.notify({
                cell: this._currentCell,
                row: this._currentRow,
                grid: this._grid
              }, e, this).getReturnValue() != !1)
                return this._menuElm;
            }
          }, SlickContextMenu2.prototype.handleCloseButtonClicked = function(e) {
            e.defaultPrevented || this.destroyMenu(e);
          }, SlickContextMenu2.prototype.destroyMenu = function(e, args) {
            var _a, _b, _c;
            if (this._menuElm = this._menuElm || document.querySelector(".slick-context-menu.".concat(this._gridUid)), !((_a = this._menuElm) === null || _a === void 0) && _a.remove) {
              if (this.onBeforeMenuClose.notify({
                cell: (_b = args == null ? void 0 : args.cell) !== null && _b !== void 0 ? _b : 0,
                row: (_c = args == null ? void 0 : args.row) !== null && _c !== void 0 ? _c : 0,
                grid: this._grid
              }, e, this).getReturnValue() == !1)
                return;
              this._menuElm.remove(), this._menuElm = null;
            }
          }, SlickContextMenu2.prototype.checkIsColumnAllowed = function(columnIds, columnId) {
            var isAllowedColumn = !1;
            if ((columnIds == null ? void 0 : columnIds.length) > 0)
              for (var o = 0, ln = columnIds.length; o < ln; o++)
                columnIds[o] === columnId && (isAllowedColumn = !0);
            else
              isAllowedColumn = !0;
            return isAllowedColumn;
          }, SlickContextMenu2.prototype.handleOnContextMenu = function(evt, args) {
            var _this = this, e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
            e.preventDefault();
            var cell = this._grid.getCellFromEvent(e);
            if (cell) {
              var columnDef = this._grid.getColumns()[cell.cell], dataContext = this._grid.getDataItem(cell.row);
              if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._contextMenuProperties.menuUsabilityOverride, args))
                return;
              this._menuElm = this.createMenu(e), this._menuElm && (this.repositionMenu(e), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "click", function(e2) {
                e2.defaultPrevented || _this.destroyMenu(e2, { cell: _this._currentCell, row: _this._currentRow });
              });
            }
          }, SlickContextMenu2.prototype.populateOptionItems = function(contextMenu, optionMenuElm, optionItems, args) {
            var _a, _b, _c;
            if (!(!args || !optionItems || !contextMenu)) {
              contextMenu != null && contextMenu.optionTitle && (this._optionTitleElm = document.createElement("div"), this._optionTitleElm.className = "title", this._optionTitleElm.textContent = contextMenu.optionTitle, optionMenuElm.appendChild(this._optionTitleElm));
              for (var i = 0, ln = optionItems.length; i < ln; i++) {
                var addClickListener = !0, item = optionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
                if (isItemVisible) {
                  Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
                  var liElm = document.createElement("div");
                  liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && (_a = liElm.classList).add.apply(_a, item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
                  var iconElm = document.createElement("div");
                  iconElm.role = "button", iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && (_b = iconElm.classList).add.apply(_b, item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(".concat(item.iconImage, ")"));
                  var textElm = document.createElement("span");
                  textElm.className = "slick-context-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && (_c = textElm.classList).add.apply(_c, item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemOptionClick.bind(this, item));
                }
              }
            }
          }, SlickContextMenu2.prototype.populateCommandItems = function(contextMenu, commandMenuElm, commandItems, args) {
            var _a, _b, _c;
            if (!(!args || !commandItems || !contextMenu)) {
              contextMenu != null && contextMenu.commandTitle && (this._commandTitleElm = document.createElement("div"), this._commandTitleElm.className = "title", this._commandTitleElm.textContent = contextMenu.commandTitle, commandMenuElm.appendChild(this._commandTitleElm));
              for (var i = 0, ln = commandItems.length; i < ln; i++) {
                var addClickListener = !0, item = commandItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
                if (isItemVisible) {
                  Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
                  var liElm = document.createElement("div");
                  liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && (_a = liElm.classList).add.apply(_a, item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
                  var iconElm = document.createElement("div");
                  iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && (_b = iconElm.classList).add.apply(_b, item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(".concat(item.iconImage, ")"));
                  var textElm = document.createElement("span");
                  textElm.className = "slick-context-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && (_c = textElm.classList).add.apply(_c, item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemCommandClick.bind(this, item));
                }
              }
            }
          }, SlickContextMenu2.prototype.handleMenuItemCommandClick = function(item, e) {
            if (!(!item || item.disabled || item.divider)) {
              var command = item.command || "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row), cellValue;
              if (Object.prototype.hasOwnProperty.call(dataContext, columnDef == null ? void 0 : columnDef.field) && (cellValue = dataContext[columnDef.field]), command !== null && command !== "") {
                var callbackArgs = {
                  cell,
                  row,
                  grid: this._grid,
                  command,
                  item,
                  column: columnDef,
                  dataContext,
                  value: cellValue
                };
                this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
              }
            }
          }, SlickContextMenu2.prototype.handleMenuItemOptionClick = function(item, e) {
            if (!(item.disabled || item.divider) && this._grid.getEditorLock().commitCurrentEdit()) {
              var option = item.option !== void 0 ? item.option : "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row);
              if (option !== void 0) {
                var callbackArgs = {
                  cell,
                  row,
                  grid: this._grid,
                  option,
                  item,
                  column: columnDef,
                  dataContext
                };
                this.onOptionSelected.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
              }
            }
          }, SlickContextMenu2.prototype.repositionMenu = function(e) {
            var _a, _b, _c, _d, _e;
            if (this._menuElm && e.target) {
              var targetEvent = (_b = (_a = e.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : e, parentElm = e.target.closest(".slick-cell"), parentOffset = parentElm && Utils.offset(parentElm), menuOffsetLeft = targetEvent.pageX, menuOffsetTop = parentElm ? (_c = parentOffset == null ? void 0 : parentOffset.top) !== null && _c !== void 0 ? _c : 0 : targetEvent.pageY, menuHeight = ((_d = this._menuElm) === null || _d === void 0 ? void 0 : _d.offsetHeight) || 0, menuWidth = ((_e = this._menuElm) === null || _e === void 0 ? void 0 : _e.offsetWidth) || this._contextMenuProperties.width || 0, rowHeight = this._gridOptions.rowHeight, dropOffset = this._contextMenuProperties.autoAdjustDropOffset, sideOffset = this._contextMenuProperties.autoAlignSideOffset;
              if (this._contextMenuProperties.autoAdjustDrop) {
                var spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight, dropPosition = spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom";
                dropPosition === "top" ? (this._menuElm.classList.remove("dropdown"), this._menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (this._menuElm.classList.remove("dropup"), this._menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
              }
              if (this._contextMenuProperties.autoAlignSide) {
                var gridPos = this._grid.getGridPosition(), dropSide = menuOffsetLeft + +menuWidth >= gridPos.width ? "left" : "right";
                dropSide === "left" ? (this._menuElm.classList.remove("dropright"), this._menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - +menuWidth - sideOffset) : (this._menuElm.classList.remove("dropleft"), this._menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
              }
              this._menuElm.style.top = "".concat(menuOffsetTop, "px"), this._menuElm.style.left = "".concat(menuOffsetLeft, "px");
            }
          }, SlickContextMenu2.prototype.runOverrideFunctionWhenExists = function(overrideFn, args) {
            return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
          }, SlickContextMenu2;
        }()
      );
      exports.SlickContextMenu = SlickContextMenu;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          Plugins: {
            ContextMenu: SlickContextMenu
          }
        }
      });
    }
  });
  require_slick_contextmenu();
})();
//# sourceMappingURL=slick.contextmenu.js.map
