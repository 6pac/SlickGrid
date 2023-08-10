"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.contextmenu.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, EventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickContextMenu = class {
    constructor(optionProperties) {
      // --
      // public API
      __publicField(this, "pluginName", "ContextMenu");
      __publicField(this, "onAfterMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuClose", new SlickEvent());
      __publicField(this, "onCommand", new SlickEvent());
      __publicField(this, "onOptionSelected", new SlickEvent());
      // --
      // protected props
      __publicField(this, "_contextMenuProperties");
      __publicField(this, "_currentCell", -1);
      __publicField(this, "_currentRow", -1);
      __publicField(this, "_grid");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_handler", new EventHandler());
      __publicField(this, "_commandTitleElm");
      __publicField(this, "_optionTitleElm");
      __publicField(this, "_menuElm");
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_defaults", {
        autoAdjustDrop: !0,
        // dropup/dropdown
        autoAlignSide: !0,
        // left/right
        autoAdjustDropOffset: -4,
        autoAlignSideOffset: 0,
        hideMenuOnScroll: !1,
        maxHeight: "none",
        width: "auto",
        optionShownOverColumnIds: [],
        commandShownOverColumnIds: []
      });
      this._contextMenuProperties = Utils.extend({}, this._defaults, optionProperties);
    }
    init(grid) {
      this._grid = grid, this._gridOptions = grid.getOptions(), this._gridUid = (grid == null ? void 0 : grid.getUID()) || "", this._handler.subscribe(this._grid.onContextMenu, this.handleOnContextMenu.bind(this)), this._contextMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
    }
    setOptions(newOptions) {
      this._contextMenuProperties = Utils.extend({}, this._contextMenuProperties, newOptions), newOptions.commandShownOverColumnIds && (this._contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds), newOptions.optionShownOverColumnIds && (this._contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds);
    }
    destroy() {
      var _a;
      this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), (_a = this._menuElm) == null || _a.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
    }
    createMenu(evt) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, targetEvent = (_b = (_a = e.touches) == null ? void 0 : _a[0]) != null ? _b : e, cell = this._grid.getCellFromEvent(e);
      this._currentCell = (_c = cell == null ? void 0 : cell.cell) != null ? _c : 0, this._currentRow = (_d = cell == null ? void 0 : cell.row) != null ? _d : 0;
      let columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), isColumnOptionAllowed = this.checkIsColumnAllowed((_e = this._contextMenuProperties.optionShownOverColumnIds) != null ? _e : [], columnDef.id), isColumnCommandAllowed = this.checkIsColumnAllowed((_f = this._contextMenuProperties.commandShownOverColumnIds) != null ? _f : [], columnDef.id), commandItems = this._contextMenuProperties.commandItems || [], optionItems = this._contextMenuProperties.optionItems || [];
      if (!columnDef || !isColumnCommandAllowed && !isColumnOptionAllowed || !commandItems.length && !optionItems.length || (this.destroyMenu(e), this.onBeforeMenuShow.notify({
        cell: this._currentCell,
        row: this._currentRow,
        grid: this._grid
      }, e, this).getReturnValue() == !1))
        return;
      let maxHeight = isNaN(this._contextMenuProperties.maxHeight) ? this._contextMenuProperties.maxHeight : `${(_g = this._contextMenuProperties.maxHeight) != null ? _g : 0}px`, width = isNaN(this._contextMenuProperties.width) ? this._contextMenuProperties.width : `${(_h = this._contextMenuProperties.maxWidth) != null ? _h : 0}px`;
      this._menuElm = document.createElement("div"), this._menuElm.className = `slick-context-menu ${this._gridUid}`, this._menuElm.role = "menu", width && (this._menuElm.style.width = width), maxHeight && (this._menuElm.style.maxHeight = maxHeight), this._menuElm.style.top = `${targetEvent.pageY}px`, this._menuElm.style.left = `${targetEvent.pageX}px`, this._menuElm.style.display = "none";
      let closeButtonElm = document.createElement("button");
      closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-context-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !this._contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
        let optionMenuElm = document.createElement("div");
        optionMenuElm.className = "slick-context-menu-option-list", optionMenuElm.role = "menu", this._contextMenuProperties.hideCloseButton || (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(optionMenuElm), this.populateOptionItems(
          this._contextMenuProperties,
          optionMenuElm,
          optionItems,
          { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid }
        );
      }
      if (!this._contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
        let commandMenuElm = document.createElement("div");
        commandMenuElm.className = "slick-context-menu-command-list", commandMenuElm.role = "menu", !this._contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || this._contextMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(commandMenuElm), this.populateCommandItems(
          this._contextMenuProperties,
          commandMenuElm,
          commandItems,
          { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid }
        );
      }
      if (this._menuElm.style.display = "block", document.body.appendChild(this._menuElm), this.onAfterMenuShow.notify({
        cell: this._currentCell,
        row: this._currentRow,
        grid: this._grid
      }, e, this).getReturnValue() != !1)
        return this._menuElm;
    }
    handleCloseButtonClicked(e) {
      e.defaultPrevented || this.destroyMenu(e);
    }
    destroyMenu(e, args) {
      var _a, _b, _c;
      if (this._menuElm = this._menuElm || document.querySelector(`.slick-context-menu.${this._gridUid}`), (_a = this._menuElm) != null && _a.remove) {
        if (this.onBeforeMenuClose.notify({
          cell: (_b = args == null ? void 0 : args.cell) != null ? _b : 0,
          row: (_c = args == null ? void 0 : args.row) != null ? _c : 0,
          grid: this._grid
        }, e, this).getReturnValue() == !1)
          return;
        this._menuElm.remove(), this._menuElm = null;
      }
    }
    checkIsColumnAllowed(columnIds, columnId) {
      let isAllowedColumn = !1;
      if ((columnIds == null ? void 0 : columnIds.length) > 0)
        for (let o = 0, ln = columnIds.length; o < ln; o++)
          columnIds[o] === columnId && (isAllowedColumn = !0);
      else
        isAllowedColumn = !0;
      return isAllowedColumn;
    }
    handleOnContextMenu(evt, args) {
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt;
      e.preventDefault();
      let cell = this._grid.getCellFromEvent(e);
      if (cell) {
        let columnDef = this._grid.getColumns()[cell.cell], dataContext = this._grid.getDataItem(cell.row);
        if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._contextMenuProperties.menuUsabilityOverride, args))
          return;
        this._menuElm = this.createMenu(e), this._menuElm && (this.repositionMenu(e), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "click", (e2) => {
          e2.defaultPrevented || this.destroyMenu(e2, { cell: this._currentCell, row: this._currentRow });
        });
      }
    }
    /** Construct the Option Items section. */
    populateOptionItems(contextMenu, optionMenuElm, optionItems, args) {
      if (!(!args || !optionItems || !contextMenu)) {
        contextMenu != null && contextMenu.optionTitle && (this._optionTitleElm = document.createElement("div"), this._optionTitleElm.className = "title", this._optionTitleElm.textContent = contextMenu.optionTitle, optionMenuElm.appendChild(this._optionTitleElm));
        for (let i = 0, ln = optionItems.length; i < ln; i++) {
          let addClickListener = !0, item = optionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
          let iconElm = document.createElement("div");
          iconElm.role = "button", iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
          let textElm = document.createElement("span");
          textElm.className = "slick-context-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemOptionClick.bind(this, item));
        }
      }
    }
    /** Construct the Command Items section. */
    populateCommandItems(contextMenu, commandMenuElm, commandItems, args) {
      if (!(!args || !commandItems || !contextMenu)) {
        contextMenu != null && contextMenu.commandTitle && (this._commandTitleElm = document.createElement("div"), this._commandTitleElm.className = "title", this._commandTitleElm.textContent = contextMenu.commandTitle, commandMenuElm.appendChild(this._commandTitleElm));
        for (let i = 0, ln = commandItems.length; i < ln; i++) {
          let addClickListener = !0, item = commandItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
          let iconElm = document.createElement("div");
          iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
          let textElm = document.createElement("span");
          textElm.className = "slick-context-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemCommandClick.bind(this, item));
        }
      }
    }
    handleMenuItemCommandClick(item, e) {
      if (!item || item.disabled || item.divider)
        return;
      let command = item.command || "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row), cellValue;
      if (Object.prototype.hasOwnProperty.call(dataContext, columnDef == null ? void 0 : columnDef.field) && (cellValue = dataContext[columnDef.field]), command !== null && command !== "") {
        let callbackArgs = {
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
    handleMenuItemOptionClick(item, e) {
      if (item.disabled || item.divider || !this._grid.getEditorLock().commitCurrentEdit())
        return;
      let option = item.option !== void 0 ? item.option : "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row);
      if (option !== void 0) {
        let callbackArgs = {
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
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    repositionMenu(e) {
      var _a, _b, _c, _d, _e;
      if (this._menuElm && e.target) {
        let targetEvent = (_b = (_a = e.touches) == null ? void 0 : _a[0]) != null ? _b : e, parentElm = e.target.closest(".slick-cell"), parentOffset = parentElm && Utils.offset(parentElm), menuOffsetLeft = targetEvent.pageX, menuOffsetTop = parentElm ? (_c = parentOffset == null ? void 0 : parentOffset.top) != null ? _c : 0 : targetEvent.pageY, menuHeight = ((_d = this._menuElm) == null ? void 0 : _d.offsetHeight) || 0, menuWidth = ((_e = this._menuElm) == null ? void 0 : _e.offsetWidth) || this._contextMenuProperties.width || 0, rowHeight = this._gridOptions.rowHeight, dropOffset = this._contextMenuProperties.autoAdjustDropOffset, sideOffset = this._contextMenuProperties.autoAlignSideOffset;
        if (this._contextMenuProperties.autoAdjustDrop) {
          let spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + (dropOffset || 0) - rowHeight, spaceTopRemaining = spaceTop - (dropOffset || 0) + rowHeight;
          (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (this._menuElm.classList.remove("dropdown"), this._menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - (dropOffset || 0)) : (this._menuElm.classList.remove("dropup"), this._menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + (dropOffset || 0));
        }
        if (this._contextMenuProperties.autoAlignSide) {
          let gridPos = this._grid.getGridPosition();
          (menuOffsetLeft + +menuWidth >= gridPos.width ? "left" : "right") === "left" ? (this._menuElm.classList.remove("dropright"), this._menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - +menuWidth - (sideOffset || 0)) : (this._menuElm.classList.remove("dropleft"), this._menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + (sideOffset || 0));
        }
        this._menuElm.style.top = `${menuOffsetTop}px`, this._menuElm.style.left = `${menuOffsetLeft}px`;
      }
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
  };
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        ContextMenu: SlickContextMenu
      }
    }
  });
})();
//# sourceMappingURL=slick.contextmenu.js.map
