"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/controls/slick.gridmenu.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils, SlickGridMenu = class {
    constructor(columns, grid, gridOptions) {
      this.columns = columns;
      this.grid = grid;
      // --
      // public API
      __publicField(this, "onAfterMenuShow", new SlickEvent("onAfterMenuShow"));
      __publicField(this, "onBeforeMenuShow", new SlickEvent("onBeforeMenuShow"));
      __publicField(this, "onMenuClose", new SlickEvent("onMenuClose"));
      __publicField(this, "onCommand", new SlickEvent("onCommand"));
      __publicField(this, "onColumnsChanged", new SlickEvent("onColumnsChanged"));
      // --
      // protected props
      __publicField(this, "_bindingEventService");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid");
      __publicField(this, "_isMenuOpen", !1);
      __publicField(this, "_columnCheckboxes", []);
      __publicField(this, "_columnTitleElm");
      __publicField(this, "_commandTitleElm");
      __publicField(this, "_commandListElm");
      __publicField(this, "_headerElm", null);
      __publicField(this, "_listElm");
      __publicField(this, "_buttonElm");
      __publicField(this, "_menuElm");
      __publicField(this, "_subMenuParentId", "");
      __publicField(this, "_gridMenuOptions", null);
      __publicField(this, "_defaults", {
        showButton: !0,
        hideForceFitButton: !1,
        hideSyncResizeButton: !1,
        forceFitTitle: "Force fit columns",
        marginBottom: 15,
        menuWidth: 18,
        contentMinWidth: 0,
        resizeOnShowHeaderRow: !1,
        subMenuOpenByEvent: "mouseover",
        syncResizeTitle: "Synchronous resize",
        useClickToRepositionMenu: !0,
        headerColumnValueExtractor: (columnDef) => columnDef.name instanceof HTMLElement ? columnDef.name.innerHTML : columnDef.name || ""
      });
      this._gridUid = grid.getUID(), this._gridOptions = gridOptions, this._gridMenuOptions = Utils.extend({}, this._defaults, gridOptions.gridMenu), this._bindingEventService = new BindingEventService(), grid.onSetOptions.subscribe((_e, args) => {
        if (args && args.optionsBefore && args.optionsAfter) {
          let switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
          (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && this.recreateGridMenu();
        }
      }), this.init(this.grid);
    }
    init(grid) {
      var _a, _b;
      this._gridOptions = grid.getOptions(), Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this.createGridMenu(), ((_a = this._gridMenuOptions) != null && _a.customItems || (_b = this._gridMenuOptions) != null && _b.customTitle) && console.warn('[SlickGrid] Grid Menu "customItems" and "customTitle" were deprecated to align with other Menu plugins, please use "commandItems" and "commandTitle" instead.'), grid.onBeforeDestroy.subscribe(this.destroy.bind(this));
    }
    setOptions(newOptions) {
      this._gridMenuOptions = Utils.extend({}, this._gridMenuOptions, newOptions);
    }
    createGridMenu() {
      var _a, _b, _c, _d, _e;
      let gridMenuWidth = ((_a = this._gridMenuOptions) == null ? void 0 : _a.menuWidth) || this._defaults.menuWidth;
      if (this._gridOptions && this._gridOptions.hasOwnProperty("frozenColumn") && this._gridOptions.frozenColumn >= 0 ? this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-right`) : this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-left`), this._headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`, (Utils.isDefined((_b = this._gridMenuOptions) == null ? void 0 : _b.resizeOnShowHeaderRow) ? this._gridMenuOptions.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow) && this._gridOptions.showHeaderRow) {
        let headerRow = document.querySelector(`.${this._gridUid}.slick-headerrow`);
        headerRow && (headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`);
      }
      if (((_c = this._gridMenuOptions) == null ? void 0 : _c.showButton) !== void 0 ? this._gridMenuOptions.showButton : this._defaults.showButton) {
        if (this._buttonElm = document.createElement("button"), this._buttonElm.className = "slick-gridmenu-button", this._buttonElm.ariaLabel = "Grid Menu", (_d = this._gridMenuOptions) != null && _d.iconCssClass)
          this._buttonElm.classList.add(...this._gridMenuOptions.iconCssClass.split(" "));
        else {
          let iconImageElm = document.createElement("img");
          iconImageElm.src = (_e = this._gridMenuOptions) != null && _e.iconImage ? this._gridMenuOptions.iconImage : "../images/drag-handle.png", this._buttonElm.appendChild(iconImageElm);
        }
        this._headerElm.parentElement.insertBefore(this._buttonElm, this._headerElm.parentElement.firstChild), this._bindingEventService.bind(this._buttonElm, "click", this.showGridMenu.bind(this));
      }
      this._menuElm = this.createMenu(0), this.populateColumnPicker(), document.body.appendChild(this._menuElm), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
    }
    /** Create the menu or sub-menu(s) but without the column picker which is a separate single process */
    createMenu(level = 0, item) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      let maxHeight = isNaN((_a = this._gridMenuOptions) == null ? void 0 : _a.maxHeight) ? (_b = this._gridMenuOptions) == null ? void 0 : _b.maxHeight : `${(_d = (_c = this._gridMenuOptions) == null ? void 0 : _c.maxHeight) != null ? _d : 0}px`, width = isNaN((_e = this._gridMenuOptions) == null ? void 0 : _e.width) ? (_f = this._gridMenuOptions) == null ? void 0 : _f.width : `${(_h = (_g = this._gridMenuOptions) == null ? void 0 : _g.maxWidth) != null ? _h : 0}px`, subMenuCommand = item == null ? void 0 : item.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
      subMenuId && (this._subMenuParentId = subMenuId), level > 1 && (subMenuId = this._subMenuParentId);
      let menuClasses = `slick-gridmenu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-gridmenu.slick-menu-level-${level}${this.getGridUidSelector()}`);
      if (bodyMenuElm) {
        if (bodyMenuElm.dataset.subMenuParent === subMenuId)
          return bodyMenuElm;
        this.destroySubMenus();
      }
      let menuElm = document.createElement("div");
      menuElm.role = "menu", menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.ariaLabel = level > 1 ? "SubMenu" : "Grid Menu", width && (menuElm.style.width = width), maxHeight && (menuElm.style.maxHeight = maxHeight), menuElm.style.display = "none";
      let closeButtonElm = null;
      if (level === 0) {
        closeButtonElm = document.createElement("button"), closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-gridmenu", closeButtonElm.ariaLabel = "Close";
        let spanCloseElm = document.createElement("span");
        spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", closeButtonElm.appendChild(spanCloseElm), menuElm.appendChild(closeButtonElm);
      }
      this._commandListElm = document.createElement("div"), this._commandListElm.className = `slick-gridmenu-custom slick-gridmenu-command-list slick-menu-level-${level}`, this._commandListElm.role = "menu", menuElm.appendChild(this._commandListElm);
      let commandItems = (_n = (_m = (_k = (_i = item == null ? void 0 : item.commandItems) != null ? _i : item == null ? void 0 : item.customItems) != null ? _k : (_j = this._gridMenuOptions) == null ? void 0 : _j.commandItems) != null ? _m : (_l = this._gridMenuOptions) == null ? void 0 : _l.customItems) != null ? _n : [];
      return commandItems.length > 0 && item && level > 0 && this.addSubMenuTitleWhenExists(item, this._commandListElm), this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level }), level++, menuElm;
    }
    /** Destroy the plugin by unsubscribing every events & also delete the menu DOM elements */
    destroy() {
      var _a;
      this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onColumnsChanged.unsubscribe(), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this.grid.onBeforeDestroy.unsubscribe(), this.grid.onSetOptions.unsubscribe(), this._bindingEventService.unbindAll(), (_a = this._menuElm) == null || _a.remove(), this.deleteMenu();
    }
    /** Delete the menu DOM element but without unsubscribing any events */
    deleteMenu() {
      var _a, _b;
      this._bindingEventService.unbindAll();
      let gridMenuElm = document.querySelector(`div.slick-gridmenu.${this._gridUid}`);
      gridMenuElm && (gridMenuElm.style.display = "none"), this._headerElm && (this._headerElm.style.width = "100%"), (_a = this._buttonElm) == null || _a.remove(), (_b = this._menuElm) == null || _b.remove();
    }
    /** Close and destroy all previously opened sub-menus */
    destroySubMenus() {
      this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
    }
    /** Construct the custom command menu items. */
    populateCommandsMenu(commandItems, commandListElm, args) {
      var _a, _b, _c, _d;
      let level = (args == null ? void 0 : args.level) || 0, isSubMenu = level > 0;
      !isSubMenu && ((_a = this._gridMenuOptions) != null && _a.commandTitle || (_b = this._gridMenuOptions) != null && _b.customTitle) && (this._commandTitleElm = document.createElement("div"), this._commandTitleElm.className = "title", this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString(this._gridMenuOptions.commandTitle || this._gridMenuOptions.customTitle)), commandListElm.appendChild(this._commandTitleElm));
      for (let i = 0, ln = commandItems.length; i < ln; i++) {
        let addClickListener = !0, item = commandItems[i], callbackArgs = {
          grid: this.grid,
          menu: this._menuElm,
          columns: this.columns,
          visibleColumns: this.getVisibleColumns()
        }, isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-gridmenu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-gridmenu-item-divider"), addClickListener = !1), item.disabled && liElm.classList.add("slick-gridmenu-item-disabled"), item.hidden && liElm.classList.add("slick-gridmenu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
        let iconElm = document.createElement("div");
        iconElm.className = "slick-gridmenu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
        let textElm = document.createElement("span");
        if (textElm.className = "slick-gridmenu-content", this.grid.applyHtmlCode(textElm, this.grid.sanitizeHtmlString(item.title || "")), liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandListElm.appendChild(liElm), addClickListener) {
          let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
          this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item, level), void 0, eventGroup);
        }
        if (((_c = this._gridMenuOptions) == null ? void 0 : _c.subMenuOpenByEvent) === "mouseover" && this._bindingEventService.bind(liElm, "mouseover", (e) => {
          item.commandItems || item.customItems ? this.repositionSubMenu(item, level, e) : isSubMenu || this.destroySubMenus();
        }), item.commandItems || item.customItems) {
          let chevronElm = document.createElement("span");
          chevronElm.className = "sub-item-chevron", (_d = this._gridMenuOptions) != null && _d.subItemChevronClass ? chevronElm.classList.add(...this._gridMenuOptions.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", liElm.classList.add("slick-submenu-item"), liElm.appendChild(chevronElm);
          continue;
        }
      }
    }
    /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
    populateColumnPicker() {
      var _a;
      this.grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), (_a = this._gridMenuOptions) != null && _a.columnTitle && (this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "title", this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(this._gridMenuOptions.columnTitle)), this._menuElm.appendChild(this._columnTitleElm)), this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-gridmenu-list", this._listElm.role = "menu";
    }
    /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
    recreateGridMenu() {
      this.deleteMenu(), this.init(this.grid);
    }
    showGridMenu(e) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      let targetEvent = e.touches ? e.touches[0] : e;
      e.preventDefault(), Utils.emptyElement(this._listElm), Utils.emptyElement(this._commandListElm);
      let commandItems = (_d = (_c = (_a = this._gridMenuOptions) == null ? void 0 : _a.commandItems) != null ? _c : (_b = this._gridMenuOptions) == null ? void 0 : _b.customItems) != null ? _d : [];
      this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level: 0 }), this.updateColumnOrder(), this._columnCheckboxes = [];
      let callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      if (this._gridMenuOptions && !this.runOverrideFunctionWhenExists(this._gridMenuOptions.menuUsabilityOverride, callbackArgs) || typeof e.stopPropagation == "function" && this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() === !1)
        return;
      let columnId, columnLabel, excludeCssClass;
      for (let i = 0; i < this.columns.length; i++) {
        columnId = this.columns[i].id, excludeCssClass = this.columns[i].excludeFromGridMenu ? "hidden" : "";
        let colName = this.columns[i].name instanceof HTMLElement ? this.columns[i].name.innerHTML : this.columns[i].name || "", liElm = document.createElement("li");
        liElm.className = excludeCssClass, liElm.ariaLabel = colName;
        let checkboxElm = document.createElement("input");
        checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}-gridmenu-colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), Utils.isDefined(this.grid.getColumnIndex(this.columns[i].id)) && !this.columns[i].hidden && (checkboxElm.checked = !0), this._columnCheckboxes.push(checkboxElm), columnLabel = (_e = this._gridMenuOptions) != null && _e.headerColumnValueExtractor ? this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions) : this._defaults.headerColumnValueExtractor(this.columns[i]);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-${columnId}`, this.grid.applyHtmlCode(labelElm, this.grid.sanitizeHtmlString((columnLabel instanceof HTMLElement ? columnLabel.innerHTML : columnLabel) || "")), liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
      }
      if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !((_f = this._gridMenuOptions) != null && _f.hideForceFitButton)) {
        let forceFitTitle = ((_g = this._gridMenuOptions) == null ? void 0 : _g.forceFitTitle) || this._defaults.forceFitTitle, liElm = document.createElement("li");
        liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", this._listElm.appendChild(liElm);
        let forceFitCheckboxElm = document.createElement("input");
        forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
      }
      if (!((_h = this._gridMenuOptions) != null && _h.hideSyncResizeButton)) {
        let syncResizeTitle = ((_i = this._gridMenuOptions) == null ? void 0 : _i.syncResizeTitle) || this._defaults.syncResizeTitle, liElm = document.createElement("li");
        liElm.ariaLabel = syncResizeTitle, this._listElm.appendChild(liElm);
        let syncResizeCheckboxElm = document.createElement("input");
        syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
      }
      let buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
      buttonElm || (buttonElm = e.target.parentElement), this._menuElm.style.display = "block", this._menuElm.style.opacity = "0", this.repositionMenu(e, this._menuElm, buttonElm);
      let menuMarginBottom = ((_j = this._gridMenuOptions) == null ? void 0 : _j.marginBottom) !== void 0 ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom;
      ((_k = this._gridMenuOptions) == null ? void 0 : _k.height) !== void 0 ? this._menuElm.style.height = `${this._gridMenuOptions.height}px` : this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`, this._menuElm.style.display = "block", this._menuElm.style.opacity = "1", this._menuElm.appendChild(this._listElm), this._isMenuOpen = !0, typeof e.stopPropagation == "function" && this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue();
    }
    getGridUidSelector() {
      let gridUid = this.grid.getUID() || "";
      return gridUid ? `.${gridUid}` : "";
    }
    handleBodyMouseDown(e) {
      var _a;
      let isMenuClicked = !1;
      (_a = this._menuElm) != null && _a.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
        subElm.contains(e.target) && (isMenuClicked = !0);
      }), (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this._isMenuOpen || e.target.className === "close") && this.hideMenu(e);
    }
    handleMenuItemClick(item, level = 0, e) {
      var _a;
      if (item !== "divider" && !item.disabled && !item.divider) {
        let command = item.command || "";
        if (Utils.isDefined(command) && !item.commandItems && !item.customItems) {
          let callbackArgs = {
            grid: this.grid,
            command,
            item,
            allColumns: this.columns,
            visibleColumns: this.getVisibleColumns()
          };
          this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), !!!((_a = this._gridMenuOptions) != null && _a.leaveOpen) && !e.defaultPrevented && this.hideMenu(e), e.preventDefault(), e.stopPropagation();
        } else
          item.commandItems || item.customItems ? this.repositionSubMenu(item, level, e) : this.destroySubMenus();
      }
    }
    hideMenu(e) {
      if (this._menuElm) {
        let callbackArgs = {
          grid: this.grid,
          menu: this._menuElm,
          allColumns: this.columns,
          visibleColumns: this.getVisibleColumns()
        };
        if (this._isMenuOpen && this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() === !1)
          return;
        this._isMenuOpen = !1, Utils.hide(this._menuElm);
      }
      this.destroySubMenus();
    }
    /** Update the Titles of each sections (command, commandTitle, ...) */
    updateAllTitles(gridMenuOptions) {
      this._commandTitleElm && this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.commandTitle || gridMenuOptions.customTitle || "")), this._columnTitleElm && this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.columnTitle || ""));
    }
    addSubMenuTitleWhenExists(item, commandOrOptionMenu) {
      if (item !== "divider" && (item != null && item.subMenuTitle)) {
        let subMenuTitleElm = document.createElement("div");
        subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
        let subMenuTitleClass = item.subMenuTitleCssClass;
        subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandOrOptionMenu.appendChild(subMenuTitleElm);
      }
    }
    repositionSubMenu(item, level, e) {
      e.target.classList.contains("slick-cell") && this.destroySubMenus();
      let subMenuElm = this.createMenu(level + 1, item);
      subMenuElm.style.display = "block", document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
    }
    /**
     * Reposition the menu drop (up/down) and the side (left/right)
     * @param {*} event
     */
    repositionMenu(e, menuElm, buttonElm) {
      var _a, _b, _c, _d;
      let targetEvent = e.touches ? e.touches[0] : e, isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-gridmenu-item") : targetEvent.target, menuIconOffset = Utils.offset(buttonElm || this._buttonElm), menuWidth = menuElm.offsetWidth, useClickToRepositionMenu = ((_a = this._gridMenuOptions) == null ? void 0 : _a.useClickToRepositionMenu) !== void 0 ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu, contentMinWidth = (_b = this._gridMenuOptions) != null && _b.contentMinWidth ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, menuOffsetTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, menuOffsetLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10;
      if (isSubMenu && parentElm) {
        let parentOffset = Utils.offset(parentElm);
        menuOffsetLeft = (_c = parentOffset == null ? void 0 : parentOffset.left) != null ? _c : 0, menuOffsetTop = (_d = parentOffset == null ? void 0 : parentOffset.top) != null ? _d : 0;
        let gridPos = this.grid.getGridPosition(), subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
        isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
        let browserWidth = document.documentElement.clientWidth;
        (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), menuOffsetLeft -= menuWidth) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu && (menuOffsetLeft += parentElm.offsetWidth));
      } else
        menuOffsetTop += 10, menuOffsetLeft = menuOffsetLeft - currentMenuWidth + 10;
      menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`, contentMinWidth > 0 && (this._menuElm.style.minWidth = `${contentMinWidth}px`);
    }
    updateColumnOrder() {
      let current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length);
      for (let i = 0; i < ordered.length; i++)
        this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
      this.columns = ordered;
    }
    updateColumn(e) {
      if (e.target.dataset.option === "autoresize") {
        let previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked;
        this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
        return;
      }
      if (e.target.dataset.option === "syncresize") {
        this.grid.setOptions({ syncColumnCellResize: !!e.target.checked });
        return;
      }
      if (e.target.type === "checkbox") {
        let isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
        if (this._columnCheckboxes.forEach((columnCheckbox, idx) => {
          columnCheckbox.checked && (this.columns[idx].hidden && (this.columns[idx].hidden = !1), visibleColumns.push(this.columns[idx]));
        }), !visibleColumns.length) {
          e.target.checked = !0;
          return;
        }
        let callbackArgs = {
          columnId,
          showing: isChecked,
          grid: this.grid,
          allColumns: this.columns,
          columns: visibleColumns,
          visibleColumns: this.getVisibleColumns()
        };
        this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify(callbackArgs, e, this);
      }
    }
    getAllColumns() {
      return this.columns;
    }
    /** visible columns, we can simply get them directly from the grid */
    getVisibleColumns() {
      return this.grid.getColumns();
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
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.GridMenu = SlickGridMenu);
})();
//# sourceMappingURL=slick.gridmenu.js.map
