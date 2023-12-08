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
      __publicField(this, "onAfterMenuShow", new SlickEvent("onAfterMenuShow"));
      __publicField(this, "onBeforeMenuShow", new SlickEvent("onBeforeMenuShow"));
      __publicField(this, "onBeforeMenuClose", new SlickEvent("onBeforeMenuClose"));
      __publicField(this, "onCommand", new SlickEvent("onCommand"));
      __publicField(this, "onOptionSelected", new SlickEvent("onOptionSelected"));
      // --
      // protected props
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_cellMenuProperties");
      __publicField(this, "_currentCell", -1);
      __publicField(this, "_currentRow", -1);
      __publicField(this, "_grid");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_handler", new EventHandler());
      __publicField(this, "_commandTitleElm");
      __publicField(this, "_optionTitleElm");
      __publicField(this, "_lastMenuTypeClicked", "");
      __publicField(this, "_menuElm");
      __publicField(this, "_subMenuParentId", "");
      __publicField(this, "_defaults", {
        autoAdjustDrop: !0,
        // dropup/dropdown
        autoAlignSide: !0,
        // left/right
        autoAdjustDropOffset: 0,
        autoAlignSideOffset: 0,
        hideMenuOnScroll: !0,
        maxHeight: "none",
        width: "auto",
        subMenuOpenByEvent: "mouseover"
      });
      this._cellMenuProperties = Utils.extend({}, this._defaults, optionProperties);
    }
    init(grid) {
      this._grid = grid, this._gridOptions = grid.getOptions(), Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._gridUid = (grid == null ? void 0 : grid.getUID()) || "", this._handler.subscribe(this._grid.onClick, this.handleCellClick.bind(this)), this._cellMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.closeMenu.bind(this));
    }
    setOptions(newOptions) {
      this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, newOptions);
    }
    destroy() {
      var _a;
      this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), (_a = this._menuElm) == null || _a.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
    }
    createParentMenu(e) {
      var _a, _b;
      let cell = this._grid.getCellFromEvent(e);
      this._currentCell = (_a = cell == null ? void 0 : cell.cell) != null ? _a : 0, this._currentRow = (_b = cell == null ? void 0 : cell.row) != null ? _b : 0;
      let columnDef = this._grid.getColumns()[this._currentCell], commandItems = this._cellMenuProperties.commandItems || [], optionItems = this._cellMenuProperties.optionItems || [];
      if (!(!columnDef || !columnDef.cellMenu || !commandItems.length && !optionItems.length) && (this.closeMenu(), this.onBeforeMenuShow.notify({
        cell: this._currentCell,
        row: this._currentRow,
        grid: this._grid
      }, e, this).getReturnValue() !== !1 && (this._menuElm = this.createMenu(commandItems, optionItems), this._menuElm.style.top = `${e.pageY + 5}px`, this._menuElm.style.left = `${e.pageX}px`, this._menuElm.style.display = "block", document.body.appendChild(this._menuElm), this.onAfterMenuShow.notify({
        cell: this._currentCell,
        row: this._currentRow,
        grid: this._grid
      }, e, this).getReturnValue() !== !1)))
        return this._menuElm;
    }
    /**
     * Create parent menu or sub-menu(s), a parent menu will start at level 0 while sub-menu(s) will be incremented
     * @param commandItems - array of optional commands or dividers
     * @param optionItems - array of optional options or dividers
     * @param level - menu level
     * @param item - command, option or divider
     * @returns menu DOM element
     */
    createMenu(commandItems, optionItems, level = 0, item) {
      var _a, _b;
      let columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), maxHeight = isNaN(this._cellMenuProperties.maxHeight) ? this._cellMenuProperties.maxHeight : `${(_a = this._cellMenuProperties.maxHeight) != null ? _a : 0}px`, width = isNaN(this._cellMenuProperties.width) ? this._cellMenuProperties.width : `${(_b = this._cellMenuProperties.maxWidth) != null ? _b : 0}px`, subMenuCommand = item == null ? void 0 : item.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
      subMenuId && (this._subMenuParentId = subMenuId), level > 1 && (subMenuId = this._subMenuParentId);
      let menuClasses = `slick-cell-menu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-cell-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
      if (bodyMenuElm) {
        if (bodyMenuElm.dataset.subMenuParent === subMenuId)
          return bodyMenuElm;
        this.destroySubMenus();
      }
      let menuElm = document.createElement("div");
      menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.ariaLabel = level > 1 ? "SubMenu" : "Cell Menu", menuElm.role = "menu", width && (menuElm.style.width = width), maxHeight && (menuElm.style.maxHeight = maxHeight), menuElm.style.display = "none";
      let closeButtonElm = null;
      if (level === 0) {
        closeButtonElm = document.createElement("button"), closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-cell-menu", closeButtonElm.ariaLabel = "Close";
        let spanCloseElm = document.createElement("span");
        spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", closeButtonElm.appendChild(spanCloseElm);
      }
      if (!this._cellMenuProperties.hideOptionSection && optionItems.length > 0) {
        let optionMenuElm = document.createElement("div");
        optionMenuElm.className = "slick-cell-menu-option-list", optionMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, optionMenuElm), closeButtonElm && !this._cellMenuProperties.hideCloseButton && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(optionMenuElm), this.populateCommandOrOptionItems(
          "option",
          this._cellMenuProperties,
          optionMenuElm,
          optionItems,
          { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
        );
      }
      if (!this._cellMenuProperties.hideCommandSection && commandItems.length > 0) {
        let commandMenuElm = document.createElement("div");
        commandMenuElm.className = "slick-cell-menu-command-list", commandMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, commandMenuElm), closeButtonElm && !this._cellMenuProperties.hideCloseButton && (optionItems.length === 0 || this._cellMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(commandMenuElm), this.populateCommandOrOptionItems(
          "command",
          this._cellMenuProperties,
          commandMenuElm,
          commandItems,
          { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
        );
      }
      return level++, menuElm;
    }
    addSubMenuTitleWhenExists(item, commandOrOptionMenu) {
      if (item !== "divider" && (item != null && item.subMenuTitle)) {
        let subMenuTitleElm = document.createElement("div");
        subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
        let subMenuTitleClass = item.subMenuTitleCssClass;
        subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandOrOptionMenu.appendChild(subMenuTitleElm);
      }
    }
    handleCloseButtonClicked(e) {
      e.defaultPrevented || this.closeMenu(e);
    }
    /** Close and destroy Cell Menu */
    closeMenu(e, args) {
      var _a, _b;
      if (this._menuElm) {
        if (this.onBeforeMenuClose.notify({
          cell: (_a = args == null ? void 0 : args.cell) != null ? _a : 0,
          row: (_b = args == null ? void 0 : args.row) != null ? _b : 0,
          grid: this._grid
        }, e, this).getReturnValue() === !1)
          return;
        this._menuElm.remove(), this._menuElm = null;
      }
      this.destroySubMenus();
    }
    /** Destroy all parent menus and any sub-menus */
    destroyAllMenus() {
      this.destroySubMenus(), this._bindingEventService.unbindAll("parent-menu"), document.querySelectorAll(`.slick-cell-menu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
    }
    /** Close and destroy all previously opened sub-menus */
    destroySubMenus() {
      this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
    }
    repositionSubMenu(item, type, level, e) {
      (e.target.classList.contains("slick-cell") || this._lastMenuTypeClicked !== type) && this.destroySubMenus();
      let subMenuElm = this.createMenu((item == null ? void 0 : item.commandItems) || [], (item == null ? void 0 : item.optionItems) || [], level + 1, item);
      subMenuElm.style.display = "block", document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
    }
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    repositionMenu(e, menuElm) {
      var _a, _b, _c, _d, _e, _f, _g;
      let isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-cell-menu-item") : e.target.closest(".slick-cell");
      if (menuElm && parentElm) {
        let parentOffset = Utils.offset(parentElm), menuOffsetLeft = parentElm ? (_a = parentOffset == null ? void 0 : parentOffset.left) != null ? _a : 0 : (_b = e == null ? void 0 : e.pageX) != null ? _b : 0, menuOffsetTop = parentElm ? (_c = parentOffset == null ? void 0 : parentOffset.top) != null ? _c : 0 : (_d = e == null ? void 0 : e.pageY) != null ? _d : 0, parentCellWidth = (parentElm == null ? void 0 : parentElm.offsetWidth) || 0, menuHeight = (_e = menuElm == null ? void 0 : menuElm.offsetHeight) != null ? _e : 0, menuWidth = Number((_g = (_f = menuElm == null ? void 0 : menuElm.offsetWidth) != null ? _f : this._cellMenuProperties.width) != null ? _g : 0), rowHeight = this._gridOptions.rowHeight, dropOffset = Number(this._cellMenuProperties.autoAdjustDropOffset || 0), sideOffset = Number(this._cellMenuProperties.autoAlignSideOffset || 0);
        if (this._cellMenuProperties.autoAdjustDrop) {
          let spaceBottom = Utils.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
          (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (menuElm.classList.remove("dropdown"), menuElm.classList.add("dropup"), isSubMenu ? menuOffsetTop -= menuHeight - dropOffset - parentElm.clientHeight : menuOffsetTop -= menuHeight - dropOffset) : (menuElm.classList.remove("dropup"), menuElm.classList.add("dropdown"), isSubMenu ? menuOffsetTop += dropOffset : menuOffsetTop += rowHeight + dropOffset);
        }
        if (this._cellMenuProperties.autoAlignSide) {
          let gridPos = this._grid.getGridPosition(), subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
          isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
          let browserWidth = document.documentElement.clientWidth;
          (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), isSubMenu ? menuOffsetLeft -= menuWidth - sideOffset : menuOffsetLeft -= menuWidth - parentCellWidth - sideOffset) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu ? menuOffsetLeft += sideOffset + parentElm.offsetWidth : menuOffsetLeft += sideOffset);
        }
        menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`;
      }
    }
    getGridUidSelector() {
      let gridUid = this._grid.getUID() || "";
      return gridUid ? `.${gridUid}` : "";
    }
    handleCellClick(evt, args) {
      this.destroyAllMenus();
      let e = evt instanceof SlickEventData ? evt.getNativeEvent() : evt, cell = this._grid.getCellFromEvent(e);
      if (cell) {
        let dataContext = this._grid.getDataItem(cell.row), columnDef = this._grid.getColumns()[cell.cell];
        if (columnDef != null && columnDef.cellMenu && e.preventDefault(), this._cellMenuProperties = Utils.extend({}, this._cellMenuProperties, columnDef.cellMenu), args = args || {}, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._cellMenuProperties.menuUsabilityOverride, args))
          return;
        this._menuElm = this.createParentMenu(e), this._menuElm && (this.repositionMenu(e, this._menuElm), this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this));
      }
    }
    /** When users click outside the Cell Menu, we will typically close the Cell Menu (and any sub-menus) */
    handleBodyMouseDown(e) {
      var _a;
      let isMenuClicked = !1;
      (_a = this._menuElm) != null && _a.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
        subElm.contains(e.target) && (isMenuClicked = !0);
      }), this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this.closeMenu(e, { cell: this._currentCell, row: this._currentRow, grid: this._grid });
    }
    /** Build the Command Items section. */
    populateCommandOrOptionItems(itemType, cellMenu, commandOrOptionMenuElm, commandOrOptionItems, args) {
      if (!args || !commandOrOptionItems || !cellMenu)
        return;
      let level = (args == null ? void 0 : args.level) || 0, isSubMenu = level > 0;
      cellMenu != null && cellMenu[`${itemType}Title`] && !isSubMenu && (this[`_${itemType}TitleElm`] = document.createElement("div"), this[`_${itemType}TitleElm`].className = "slick-menu-title", this[`_${itemType}TitleElm`].textContent = cellMenu[`${itemType}Title`], commandOrOptionMenuElm.appendChild(this[`_${itemType}TitleElm`]));
      for (let i = 0, ln = commandOrOptionItems.length; i < ln; i++) {
        let addClickListener = !0, item = commandOrOptionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
        let iconElm = document.createElement("div");
        iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
        let textElm = document.createElement("span");
        if (textElm.className = "slick-cell-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandOrOptionMenuElm.appendChild(liElm), addClickListener) {
          let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
          this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item, itemType, level), void 0, eventGroup);
        }
        if (this._cellMenuProperties.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(liElm, "mouseover", (e) => {
          item.commandItems || item.optionItems ? (this.repositionSubMenu(item, itemType, level, e), this._lastMenuTypeClicked = itemType) : isSubMenu || this.destroySubMenus();
        }), item.commandItems || item.optionItems) {
          let chevronElm = document.createElement("span");
          chevronElm.className = "sub-item-chevron", this._cellMenuProperties.subItemChevronClass ? chevronElm.classList.add(...this._cellMenuProperties.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", liElm.classList.add("slick-submenu-item"), liElm.appendChild(chevronElm);
          continue;
        }
      }
    }
    handleMenuItemClick(item, type, level = 0, e) {
      if ((item == null ? void 0 : item[type]) !== void 0 && item !== "divider" && !item.disabled && !item.divider && this._currentCell !== void 0 && this._currentRow !== void 0) {
        if (type === "option" && !this._grid.getEditorLock().commitCurrentEdit())
          return;
        let optionOrCommand = item[type] !== void 0 ? item[type] : "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row);
        if (optionOrCommand !== void 0 && !item[`${type}Items`]) {
          let callbackArgs = {
            cell,
            row,
            grid: this._grid,
            [type]: optionOrCommand,
            item,
            column: columnDef,
            dataContext
          };
          this[type === "command" ? "onCommand" : "onOptionSelected"].notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.closeMenu(e, { cell, row, grid: this._grid });
        } else
          item.commandItems || item.optionItems ? this.repositionSubMenu(item, type, level, e) : this.destroySubMenus();
        this._lastMenuTypeClicked = type;
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
