"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.cellmenu.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventData = Slick.EventData, EventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickCellMenu = class {
    constructor(optionProperties) {
      // --
      // public API
      __publicField(this, "pluginName", "CellMenu");
      __publicField(this, "onAfterMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuClose", new SlickEvent());
      __publicField(this, "onCommand", new SlickEvent());
      __publicField(this, "onOptionSelected", new SlickEvent());
      // --
      // protected props
      __publicField(this, "_cellMenuProperties");
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
        autoAdjustDropOffset: 0,
        autoAlignSideOffset: 0,
        hideMenuOnScroll: !0,
        maxHeight: "none",
        width: "auto"
      });
      this._cellMenuProperties = Utils.extend({}, this._defaults, optionProperties);
    }
    init(grid) {
      this._grid = grid, this._gridOptions = grid.getOptions(), this._gridUid = (grid == null ? void 0 : grid.getUID()) || "", this._handler.subscribe(this._grid.onClick, this.handleCellClick.bind(this)), this._cellMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
    }
    setOptions(newOptions) {
      this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, newOptions);
    }
    destroy() {
      var _a;
      this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), (_a = this._menuElm) == null || _a.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
    }
    createMenu(e) {
      var _a, _b, _c, _d;
      let cell = this._grid.getCellFromEvent(e);
      this._currentCell = (_a = cell == null ? void 0 : cell.cell) != null ? _a : 0, this._currentRow = (_b = cell == null ? void 0 : cell.row) != null ? _b : 0;
      let columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), commandItems = this._cellMenuProperties.commandItems || [], optionItems = this._cellMenuProperties.optionItems || [];
      if (!columnDef || !columnDef.cellMenu || !commandItems.length && !optionItems.length || (this.destroyMenu(), this.onBeforeMenuShow.notify({
        cell: this._currentCell,
        row: this._currentRow,
        grid: this._grid
      }, e, this).getReturnValue() == !1))
        return;
      let maxHeight = isNaN(this._cellMenuProperties.maxHeight) ? this._cellMenuProperties.maxHeight : `${(_c = this._cellMenuProperties.maxHeight) != null ? _c : 0}px`, width = isNaN(this._cellMenuProperties.width) ? this._cellMenuProperties.width : `${(_d = this._cellMenuProperties.maxWidth) != null ? _d : 0}px`;
      this._menuElm = document.createElement("div"), this._menuElm.className = `slick-cell-menu ${this._gridUid}`, this._menuElm.role = "menu", width && (this._menuElm.style.width = width), maxHeight && (this._menuElm.style.maxHeight = maxHeight), this._menuElm.style.top = `${e.pageY + 5}px`, this._menuElm.style.left = `${e.pageX}px`, this._menuElm.style.display = "none";
      let closeButtonElm = document.createElement("button");
      closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-cell-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !this._cellMenuProperties.hideOptionSection && optionItems.length > 0) {
        let optionMenuElm = document.createElement("div");
        optionMenuElm.className = "slick-cell-menu-option-list", optionMenuElm.role = "menu", this._cellMenuProperties.hideCloseButton || (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(optionMenuElm), this.populateOptionItems(
          this._cellMenuProperties,
          optionMenuElm,
          optionItems,
          { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid }
        );
      }
      if (!this._cellMenuProperties.hideCommandSection && commandItems.length > 0) {
        let commandMenuElm = document.createElement("div");
        commandMenuElm.className = "slick-cell-menu-command-list", commandMenuElm.role = "menu", !this._cellMenuProperties.hideCloseButton && (optionItems.length === 0 || this._cellMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), this._menuElm.appendChild(closeButtonElm)), this._menuElm.appendChild(commandMenuElm), this.populateCommandItems(
          this._cellMenuProperties,
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
      if (this._menuElm = this._menuElm || document.querySelector(`.slick-cell-menu.${this._gridUid}`), (_a = this._menuElm) != null && _a.remove) {
        if (this.onBeforeMenuClose.notify({
          cell: (_b = args == null ? void 0 : args.cell) != null ? _b : 0,
          row: (_c = args == null ? void 0 : args.row) != null ? _c : 0,
          grid: this._grid
        }, e, this).getReturnValue() == !1)
          return;
        this._menuElm.remove(), this._menuElm = null;
      }
    }
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    repositionMenu(e) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (this._menuElm && e.target) {
        let parentElm = e.target.closest(".slick-cell"), parentOffset = parentElm && Utils.offset(parentElm), menuOffsetLeft = parentElm ? (_a = parentOffset == null ? void 0 : parentOffset.left) != null ? _a : 0 : e.pageX, menuOffsetTop = parentElm ? (_b = parentOffset == null ? void 0 : parentOffset.top) != null ? _b : 0 : e.pageY, parentCellWidth = parentElm.offsetWidth || 0, menuHeight = (_d = (_c = this._menuElm) == null ? void 0 : _c.offsetHeight) != null ? _d : 0, menuWidth = (_g = (_f = (_e = this._menuElm) == null ? void 0 : _e.offsetWidth) != null ? _f : this._cellMenuProperties.width) != null ? _g : 0, rowHeight = this._gridOptions.rowHeight, dropOffset = +(this._cellMenuProperties.autoAdjustDropOffset || 0), sideOffset = +(this._cellMenuProperties.autoAlignSideOffset || 0);
        if (this._cellMenuProperties.autoAdjustDrop) {
          let spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
          (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (this._menuElm.classList.remove("dropdown"), this._menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (this._menuElm.classList.remove("dropup"), this._menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
        }
        if (this._cellMenuProperties.autoAlignSide) {
          let gridPos = this._grid.getGridPosition();
          (menuOffsetLeft + +menuWidth >= gridPos.width ? "left" : "right") === "left" ? (this._menuElm.classList.remove("dropright"), this._menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - (+menuWidth - parentCellWidth) - sideOffset) : (this._menuElm.classList.remove("dropleft"), this._menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
        }
        this._menuElm.style.top = `${menuOffsetTop}px`, this._menuElm.style.left = `${menuOffsetLeft}px`;
      }
    }
    handleCellClick(evt, args) {
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, cell = this._grid.getCellFromEvent(e);
      if (cell) {
        let dataContext = this._grid.getDataItem(cell.row), columnDef = this._grid.getColumns()[cell.cell];
        if (columnDef != null && columnDef.cellMenu && e.preventDefault(), this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, columnDef.cellMenu), args = args || {}, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._cellMenuProperties.menuUsabilityOverride, args))
          return;
        this._menuElm = this.createMenu(e), this._menuElm && (this.repositionMenu(e), this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this));
      }
    }
    handleBodyMouseDown(e) {
      var _a;
      this._menuElm != e.target && !((_a = this._menuElm) != null && _a.contains(e.target)) && (e.defaultPrevented || this.closeMenu(e, { cell: this._currentCell, row: this._currentRow, grid: this._grid }));
    }
    closeMenu(e, args) {
      var _a;
      if (this._menuElm) {
        if (this.onBeforeMenuClose.notify({
          cell: args == null ? void 0 : args.cell,
          row: args == null ? void 0 : args.row,
          grid: this._grid
        }, e, this).getReturnValue() == !1)
          return;
        (_a = this._menuElm) == null || _a.remove(), this._menuElm = null;
      }
    }
    /** Construct the Option Items section. */
    populateOptionItems(cellMenu, optionMenuElm, optionItems, args) {
      if (!(!args || !optionItems || !cellMenu)) {
        cellMenu != null && cellMenu.optionTitle && (this._optionTitleElm = document.createElement("div"), this._optionTitleElm.className = "title", this._optionTitleElm.textContent = cellMenu.optionTitle, optionMenuElm.appendChild(this._optionTitleElm));
        for (let i = 0, ln = optionItems.length; i < ln; i++) {
          let addClickListener = !0, item = optionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
          let iconElm = document.createElement("div");
          iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
          let textElm = document.createElement("span");
          textElm.className = "slick-cell-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemOptionClick.bind(this, item));
        }
      }
    }
    /** Construct the Command Items section. */
    populateCommandItems(cellMenu, commandMenuElm, commandItems, args) {
      if (!(!args || !commandItems || !cellMenu)) {
        cellMenu != null && cellMenu.commandTitle && (this._commandTitleElm = document.createElement("div"), this._commandTitleElm.className = "title", this._commandTitleElm.textContent = cellMenu.commandTitle, commandMenuElm.appendChild(this._commandTitleElm));
        for (let i = 0, ln = commandItems.length; i < ln; i++) {
          let addClickListener = !0, item = commandItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
          let liElm = document.createElement("div");
          liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
          let iconElm = document.createElement("div");
          iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
          let textElm = document.createElement("span");
          textElm.className = "slick-cell-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemCommandClick.bind(this, item));
        }
      }
    }
    handleMenuItemCommandClick(item, e) {
      if (!item || item.disabled || item.divider || item === "divider")
        return;
      let command = item.command || "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row);
      if (command !== null && command !== "") {
        let callbackArgs = {
          cell,
          row,
          grid: this._grid,
          command,
          item,
          column: columnDef,
          dataContext
        };
        this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.closeMenu(e, { cell, row, grid: this._grid });
      }
    }
    handleMenuItemOptionClick(item, e) {
      if (!item || item.disabled || item.divider || item === "divider" || !this._grid.getEditorLock().commitCurrentEdit())
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
        this.onOptionSelected.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.closeMenu(e, { cell, row, grid: this._grid });
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
        CellMenu: SlickCellMenu
      }
    }
  });
})();
//# sourceMappingURL=slick.cellmenu.js.map
