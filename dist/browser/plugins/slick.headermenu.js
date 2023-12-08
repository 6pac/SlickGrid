"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.headermenu.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, SlickEventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickHeaderMenu = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "HeaderMenu");
      __publicField(this, "onAfterMenuShow", new SlickEvent("onAfterMenuShow"));
      __publicField(this, "onBeforeMenuShow", new SlickEvent("onBeforeMenuShow"));
      __publicField(this, "onCommand", new SlickEvent("onCommand"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_gridUid", "");
      __publicField(this, "_handler", new SlickEventHandler());
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_defaults", {
        buttonCssClass: void 0,
        buttonImage: void 0,
        minWidth: 100,
        autoAlign: !0,
        autoAlignOffset: 0,
        subMenuOpenByEvent: "mouseover"
      });
      __publicField(this, "_options");
      __publicField(this, "_activeHeaderColumnElm");
      __publicField(this, "_menuElm");
      __publicField(this, "_subMenuParentId", "");
      this._options = Utils.extend(!0, {}, options, this._defaults);
    }
    init(grid) {
      this._grid = grid, this._gridUid = (grid == null ? void 0 : grid.getUID()) || "", Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns()), this._bindingEventService.bind(document.body, "click", this.handleBodyMouseDown.bind(this));
    }
    setOptions(newOptions) {
      this._options = Utils.extend(!0, {}, this._options, newOptions);
    }
    getGridUidSelector() {
      let gridUid = this._grid.getUID() || "";
      return gridUid ? `.${gridUid}` : "";
    }
    destroy() {
      var _a;
      this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), this._menuElm = this._menuElm || document.body.querySelector(`.slick-header-menu${this.getGridUidSelector()}`), (_a = this._menuElm) == null || _a.remove(), this._activeHeaderColumnElm = void 0;
    }
    destroyAllMenus() {
      this.destroySubMenus(), this._bindingEventService.unbindAll("parent-menu"), document.querySelectorAll(`.slick-header-menu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
    }
    /** Close and destroy all previously opened sub-menus */
    destroySubMenus() {
      this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
    }
    handleBodyMouseDown(e) {
      var _a;
      let isMenuClicked = !1;
      (_a = this._menuElm) != null && _a.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
        subElm.contains(e.target) && (isMenuClicked = !0);
      }), (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented || e.target.className === "close") && this.hideMenu();
    }
    hideMenu() {
      var _a;
      this._menuElm && (this._menuElm.remove(), this._menuElm = void 0), (_a = this._activeHeaderColumnElm) == null || _a.classList.remove("slick-header-column-active"), this.destroySubMenus();
    }
    handleHeaderCellRendered(_e, args) {
      var _a;
      let column = args.column, menu = (_a = column == null ? void 0 : column.header) == null ? void 0 : _a.menu;
      if (menu != null && menu.items && console.warn('[SlickGrid] Header Menu "items" property was deprecated in favor of "commandItems" to align with all other Menu plugins.'), menu) {
        if (!this.runOverrideFunctionWhenExists(this._options.menuUsabilityOverride, args))
          return;
        let elm = document.createElement("div");
        if (elm.className = "slick-header-menubutton", elm.ariaLabel = "Header Menu", elm.role = "button", !this._options.buttonCssClass && !this._options.buttonImage && (this._options.buttonCssClass = "caret"), this._options.buttonCssClass) {
          let icon = document.createElement("span");
          icon.classList.add(...this._options.buttonCssClass.split(" ")), elm.appendChild(icon);
        }
        this._options.buttonImage && (elm.style.backgroundImage = `url(${this._options.buttonImage})`), this._options.tooltip && (elm.title = this._options.tooltip), this._bindingEventService.bind(elm, "click", (e) => {
          this.destroyAllMenus(), this.createParentMenu(e, menu, args.column);
        }), args.node.appendChild(elm);
      }
    }
    handleBeforeHeaderCellDestroy(_e, args) {
      var _a;
      (_a = args.column.header) != null && _a.menu && args.node.querySelectorAll(".slick-header-menubutton").forEach((elm) => elm.remove());
    }
    addSubMenuTitleWhenExists(item, commandMenuElm) {
      if (item !== "divider" && (item != null && item.subMenuTitle)) {
        let subMenuTitleElm = document.createElement("div");
        subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
        let subMenuTitleClass = item.subMenuTitleCssClass;
        subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandMenuElm.appendChild(subMenuTitleElm);
      }
    }
    createParentMenu(event, menu, columnDef) {
      let callbackArgs = {
        grid: this._grid,
        column: columnDef,
        menu
      };
      if (this.onBeforeMenuShow.notify(callbackArgs, event, this).getReturnValue() === !1)
        return;
      this._menuElm = this.createMenu(menu.commandItems || menu.items, columnDef);
      let containerNode = this._grid.getContainerNode();
      containerNode && containerNode.appendChild(this._menuElm), this.repositionMenu(event, this._menuElm), this.onAfterMenuShow.notify(callbackArgs, event, this).getReturnValue() !== !1 && (event.preventDefault(), event.stopPropagation());
    }
    createMenu(commandItems, columnDef, level = 0, item) {
      let isSubMenu = level > 0, subMenuCommand = item == null ? void 0 : item.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
      subMenuId && (this._subMenuParentId = subMenuId), isSubMenu && (subMenuId = this._subMenuParentId);
      let menuClasses = `slick-header-menu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-header-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
      if (bodyMenuElm) {
        if (bodyMenuElm.dataset.subMenuParent === subMenuId)
          return bodyMenuElm;
        this.destroySubMenus();
      }
      let menuElm = document.createElement("div");
      menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.classList.add(this._gridUid), menuElm.role = "menu", menuElm.ariaLabel = level > 1 ? "SubMenu" : "Header Menu", menuElm.style.minWidth = `${this._options.minWidth}px`, menuElm.setAttribute("aria-expanded", "true");
      let callbackArgs = {
        grid: this._grid,
        column: columnDef,
        menu: { items: commandItems }
      };
      item && level > 0 && this.addSubMenuTitleWhenExists(item, menuElm);
      for (let i = 0; i < commandItems.length; i++) {
        let addClickListener = !0, item2 = commandItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item2.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item2.itemUsabilityOverride, callbackArgs);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item2, "itemUsabilityOverride") && (item2.disabled = !isItemUsable);
        let menuItemElm = document.createElement("div");
        menuItemElm.className = "slick-header-menuitem", menuItemElm.role = "menuitem", (item2.divider || item2 === "divider") && (menuItemElm.classList.add("slick-header-menuitem-divider"), addClickListener = !1), item2.disabled && menuItemElm.classList.add("slick-header-menuitem-disabled"), item2.hidden && menuItemElm.classList.add("slick-header-menuitem-hidden"), item2.cssClass && menuItemElm.classList.add(...item2.cssClass.split(" ")), item2.tooltip && (menuItemElm.title = item2.tooltip || "");
        let iconElm = document.createElement("div");
        iconElm.className = "slick-header-menuicon", menuItemElm.appendChild(iconElm), item2.iconCssClass && iconElm.classList.add(...item2.iconCssClass.split(" ")), item2.iconImage && (iconElm.style.backgroundImage = "url(" + item2.iconImage + ")");
        let textElm = document.createElement("span");
        if (textElm.className = "slick-header-menucontent", textElm.textContent = item2.title || "", menuItemElm.appendChild(textElm), item2.textCssClass && textElm.classList.add(...item2.textCssClass.split(" ")), menuElm.appendChild(menuItemElm), addClickListener) {
          let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
          this._bindingEventService.bind(menuItemElm, "click", this.handleMenuItemClick.bind(this, item2, columnDef, level), void 0, eventGroup);
        }
        if (this._options.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(menuItemElm, "mouseover", (e) => {
          item2.commandItems || item2.items ? this.repositionSubMenu(item2, columnDef, level, e) : isSubMenu || this.destroySubMenus();
        }), item2.commandItems || item2.items) {
          let chevronElm = document.createElement("div");
          chevronElm.className = "sub-item-chevron", this._options.subItemChevronClass ? chevronElm.classList.add(...this._options.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", menuItemElm.classList.add("slick-submenu-item"), menuItemElm.appendChild(chevronElm);
        }
      }
      return menuElm;
    }
    handleMenuItemClick(item, columnDef, level = 0, e) {
      if (item !== "divider" && !item.disabled && !item.divider) {
        let command = item.command || "";
        if (Utils.isDefined(command) && !item.commandItems && !item.items) {
          let callbackArgs = {
            grid: this._grid,
            column: columnDef,
            command,
            item
          };
          this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.hideMenu();
        } else
          item.commandItems || item.items ? this.repositionSubMenu(item, columnDef, level, e) : this.destroySubMenus();
      }
    }
    repositionSubMenu(item, columnDef, level, e) {
      e.target.classList.contains("slick-header-menubutton") && this.destroySubMenus();
      let subMenuElm = this.createMenu(item.commandItems || item.items || [], columnDef, level + 1, item);
      document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
    }
    repositionMenu(e, menuElm) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      let buttonElm = e.target, isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-header-menuitem") : buttonElm, btnOffset = Utils.offset(buttonElm), gridPos = this._grid.getGridPosition(), menuWidth = menuElm.offsetWidth, menuOffset = Utils.offset(this._menuElm), parentOffset = Utils.offset(parentElm), menuOffsetTop = isSubMenu ? (_a = parentOffset == null ? void 0 : parentOffset.top) != null ? _a : 0 : (_e = (_b = buttonElm.clientHeight) != null ? _b : btnOffset == null ? void 0 : btnOffset.top) != null ? _e : 0 + ((_d = (_c = this._options) == null ? void 0 : _c.menuOffsetTop) != null ? _d : 0), menuOffsetLeft = isSubMenu ? (_f = parentOffset == null ? void 0 : parentOffset.left) != null ? _f : 0 : (_g = btnOffset == null ? void 0 : btnOffset.left) != null ? _g : 0;
      if (isSubMenu && parentElm) {
        let subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
        isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
        let browserWidth = document.documentElement.clientWidth;
        (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), menuOffsetLeft -= menuWidth) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu && (menuOffsetLeft += parentElm.offsetWidth));
      } else
        menuOffsetLeft + menuElm.offsetWidth >= gridPos.width && (menuOffsetLeft = menuOffsetLeft + buttonElm.clientWidth - menuElm.clientWidth + (this._options.autoAlignOffset || 0)), menuOffsetLeft -= (_h = menuOffset == null ? void 0 : menuOffset.left) != null ? _h : 0;
      menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`, this._activeHeaderColumnElm = menuElm.closest(".slick-header-column"), this._activeHeaderColumnElm && this._activeHeaderColumnElm.classList.add("slick-header-column-active");
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
        HeaderMenu: SlickHeaderMenu
      }
    }
  });
})();
//# sourceMappingURL=slick.headermenu.js.map
