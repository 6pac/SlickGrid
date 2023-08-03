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
      __publicField(this, "onAfterMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuShow", new SlickEvent());
      __publicField(this, "onMenuClose", new SlickEvent());
      __publicField(this, "onCommand", new SlickEvent());
      __publicField(this, "onColumnsChanged", new SlickEvent());
      // --
      // protected props
      __publicField(this, "_bindingEventService");
      __publicField(this, "_gridOptions");
      __publicField(this, "_gridUid");
      __publicField(this, "_isMenuOpen", !1);
      __publicField(this, "_gridMenuOptions", null);
      __publicField(this, "_columnTitleElm");
      __publicField(this, "_customTitleElm");
      __publicField(this, "_customMenuElm");
      __publicField(this, "_headerElm", null);
      __publicField(this, "_listElm");
      __publicField(this, "_buttonElm");
      __publicField(this, "_menuElm");
      __publicField(this, "_columnCheckboxes", []);
      __publicField(this, "_defaults", {
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
        headerColumnValueExtractor: (columnDef) => columnDef.name
      });
      this._gridUid = grid.getUID(), this._gridOptions = gridOptions, this._gridMenuOptions = Utils.extend({}, gridOptions.gridMenu), this._bindingEventService = new BindingEventService(), grid.onSetOptions.subscribe((_e, args) => {
        if (args && args.optionsBefore && args.optionsAfter) {
          let switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
          (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && this.recreateGridMenu();
        }
      }), this.init(this.grid);
    }
    init(grid) {
      this._gridOptions = grid.getOptions(), this.createGridMenu(), grid.onBeforeDestroy.subscribe(this.destroy.bind(this));
    }
    setOptions(newOptions) {
      this._gridMenuOptions = Utils.extend({}, this._gridMenuOptions, newOptions);
    }
    createGridMenu() {
      var _a, _b, _c, _d, _e;
      let gridMenuWidth = ((_a = this._gridMenuOptions) == null ? void 0 : _a.menuWidth) || this._defaults.menuWidth;
      if (this._gridOptions && this._gridOptions.hasOwnProperty("frozenColumn") && this._gridOptions.frozenColumn >= 0 ? this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-right`) : this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-left`), this._headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`, (((_b = this._gridMenuOptions) == null ? void 0 : _b.resizeOnShowHeaderRow) != null ? this._gridMenuOptions.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow) && this._gridOptions.showHeaderRow) {
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
      this._menuElm = document.createElement("div"), this._menuElm.className = `slick-gridmenu ${this._gridUid}`, this._menuElm.style.display = "none", document.body.appendChild(this._menuElm);
      let buttonElm = document.createElement("button");
      buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-gridmenu", buttonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), this._menuElm.appendChild(buttonElm), this._customMenuElm = document.createElement("div"), this._customMenuElm.className = "slick-gridmenu-custom", this._customMenuElm.role = "menu", this._menuElm.appendChild(this._customMenuElm), this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm), this.populateColumnPicker(), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
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
    populateCustomMenus(gridMenuOptions, customMenuElm) {
      var _a;
      if (!(!gridMenuOptions || !gridMenuOptions.customItems)) {
        (_a = this._gridMenuOptions) != null && _a.customTitle && (this._customTitleElm = document.createElement("div"), this._customTitleElm.className = "title", this._customTitleElm.innerHTML = this._gridMenuOptions.customTitle, customMenuElm.appendChild(this._customTitleElm));
        for (let i = 0, ln = gridMenuOptions.customItems.length; i < ln; i++) {
          let addClickListener = !0, item = gridMenuOptions.customItems[i], callbackArgs = {
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
          textElm.className = "slick-gridmenu-content", textElm.innerHTML = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), customMenuElm.appendChild(liElm), addClickListener && this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item));
        }
      }
    }
    /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
    populateColumnPicker() {
      var _a;
      this.grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), (_a = this._gridMenuOptions) != null && _a.columnTitle && (this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "title", this._columnTitleElm.innerHTML = this._gridMenuOptions.columnTitle, this._menuElm.appendChild(this._columnTitleElm)), this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-gridmenu-list", this._listElm.role = "menu";
    }
    /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
    recreateGridMenu() {
      this.deleteMenu(), this.init(this.grid);
    }
    showGridMenu(e) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      let targetEvent = e.touches ? e.touches[0] : e;
      e.preventDefault(), Utils.emptyElement(this._listElm), Utils.emptyElement(this._customMenuElm), this.populateCustomMenus(this._gridMenuOptions || {}, this._customMenuElm), this.updateColumnOrder(), this._columnCheckboxes = [];
      let callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      if (this._gridMenuOptions && !this.runOverrideFunctionWhenExists(this._gridMenuOptions.menuUsabilityOverride, callbackArgs) || typeof e.stopPropagation == "function" && this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() == !1)
        return;
      let columnId, columnLabel, excludeCssClass;
      for (let i = 0; i < this.columns.length; i++) {
        columnId = this.columns[i].id, excludeCssClass = this.columns[i].excludeFromGridMenu ? "hidden" : "";
        let liElm = document.createElement("li");
        liElm.className = excludeCssClass, liElm.ariaLabel = ((_a = this.columns[i]) == null ? void 0 : _a.name) || "";
        let checkboxElm = document.createElement("input");
        checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}-gridmenu-colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), this.grid.getColumnIndex(this.columns[i].id) != null && !this.columns[i].hidden && (checkboxElm.checked = !0), this._columnCheckboxes.push(checkboxElm), (_b = this._gridMenuOptions) != null && _b.headerColumnValueExtractor ? columnLabel = this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions) : columnLabel = this._defaults.headerColumnValueExtractor(this.columns[i]);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-${columnId}`, labelElm.innerHTML = columnLabel || "", liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
      }
      if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !((_c = this._gridMenuOptions) != null && _c.hideForceFitButton)) {
        let forceFitTitle = ((_d = this._gridMenuOptions) == null ? void 0 : _d.forceFitTitle) || this._defaults.forceFitTitle, liElm = document.createElement("li");
        liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", this._listElm.appendChild(liElm);
        let forceFitCheckboxElm = document.createElement("input");
        forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
      }
      if (!((_e = this._gridMenuOptions) != null && _e.hideSyncResizeButton)) {
        let syncResizeTitle = ((_f = this._gridMenuOptions) == null ? void 0 : _f.syncResizeTitle) || this._defaults.syncResizeTitle, liElm = document.createElement("li");
        liElm.ariaLabel = syncResizeTitle, this._listElm.appendChild(liElm);
        let syncResizeCheckboxElm = document.createElement("input");
        syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
      }
      let buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
      buttonElm || (buttonElm = e.target.parentElement), this._menuElm.style.display = "block", this._menuElm.style.opacity = "0";
      let menuIconOffset = Utils.offset(buttonElm), menuWidth = this._menuElm.offsetWidth, useClickToRepositionMenu = ((_g = this._gridMenuOptions) == null ? void 0 : _g.useClickToRepositionMenu) !== void 0 ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu, contentMinWidth = (_h = this._gridMenuOptions) != null && _h.contentMinWidth ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, nextPositionTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, nextPositionLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10, menuMarginBottom = ((_i = this._gridMenuOptions) == null ? void 0 : _i.marginBottom) !== void 0 ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom;
      this._menuElm.style.top = `${nextPositionTop + 10}px`, this._menuElm.style.left = `${nextPositionLeft - currentMenuWidth + 10}px`, contentMinWidth > 0 && (this._menuElm.style.minWidth = `${contentMinWidth}px`), ((_j = this._gridMenuOptions) == null ? void 0 : _j.height) !== void 0 ? this._menuElm.style.height = `${this._gridMenuOptions.height}px` : this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`, this._menuElm.style.display = "block", this._menuElm.style.opacity = "1", this._menuElm.appendChild(this._listElm), this._isMenuOpen = !0, typeof e.stopPropagation == "function" && this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue() == !1;
    }
    handleBodyMouseDown(event) {
      var _a;
      (this._menuElm !== event.target && !((_a = this._menuElm) != null && _a.contains(event.target)) && this._isMenuOpen || event.target.className === "close") && this.hideMenu(event);
    }
    handleMenuItemClick(item, e) {
      var _a;
      let command = item.command || "";
      if (item.disabled || item.divider || item === "divider")
        return;
      if (command != null && command != "") {
        let callbackArgs = {
          grid: this.grid,
          command,
          item,
          allColumns: this.columns,
          visibleColumns: this.getVisibleColumns()
        };
        this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
      !!!((_a = this._gridMenuOptions) != null && _a.leaveOpen) && !e.defaultPrevented && this.hideMenu(e), e.preventDefault(), e.stopPropagation();
    }
    hideMenu(e) {
      if (this._menuElm) {
        Utils.hide(this._menuElm), this._isMenuOpen = !1;
        let callbackArgs = {
          grid: this.grid,
          menu: this._menuElm,
          allColumns: this.columns,
          visibleColumns: this.getVisibleColumns()
        };
        if (this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() == !1)
          return;
      }
    }
    /** Update the Titles of each sections (command, customTitle, ...) */
    updateAllTitles(gridMenuOptions) {
      var _a, _b;
      (_a = this._customTitleElm) != null && _a.innerHTML && (this._customTitleElm.innerHTML = gridMenuOptions.customTitle || ""), (_b = this._columnTitleElm) != null && _b.innerHTML && (this._columnTitleElm.innerHTML = gridMenuOptions.columnTitle || "");
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
