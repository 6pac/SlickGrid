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
      __publicField(this, "onAfterMenuShow", new SlickEvent());
      __publicField(this, "onBeforeMenuShow", new SlickEvent());
      __publicField(this, "onCommand", new SlickEvent());
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_handler", new SlickEventHandler());
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_defaults", {
        buttonCssClass: void 0,
        buttonImage: void 0,
        minWidth: 100,
        autoAlign: !0,
        autoAlignOffset: 0
      });
      __publicField(this, "_options");
      __publicField(this, "_activeHeaderColumnElm");
      __publicField(this, "_menuElm");
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    init(grid) {
      this._grid = grid, this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns()), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this));
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
    handleBodyMouseDown(e) {
      var _a;
      (this._menuElm !== e.target && !((_a = this._menuElm) != null && _a.contains(e.target)) || e.target.className === "close") && this.hideMenu();
    }
    hideMenu() {
      var _a;
      this._menuElm && (this._menuElm.remove(), this._menuElm = void 0), (_a = this._activeHeaderColumnElm) == null || _a.classList.remove("slick-header-column-active");
    }
    handleHeaderCellRendered(_e, args) {
      var _a;
      let column = args.column, menu = (_a = column == null ? void 0 : column.header) == null ? void 0 : _a.menu;
      if (menu) {
        if (!this.runOverrideFunctionWhenExists(this._options.menuUsabilityOverride, args))
          return;
        let elm = document.createElement("div");
        if (elm.className = "slick-header-menubutton", elm.ariaLabel = "Header Menu", elm.role = "button", !this._options.buttonCssClass && !this._options.buttonImage && (this._options.buttonCssClass = "caret"), this._options.buttonCssClass) {
          let icon = document.createElement("span");
          icon.classList.add(...this._options.buttonCssClass.split(" ")), elm.appendChild(icon);
        }
        this._options.buttonImage && (elm.style.backgroundImage = `url(${this._options.buttonImage})`), this._options.tooltip && (elm.title = this._options.tooltip), this._bindingEventService.bind(elm, "click", (e) => this.showMenu(e, menu, args.column)), args.node.appendChild(elm);
      }
    }
    handleBeforeHeaderCellDestroy(_e, args) {
      var _a;
      (_a = args.column.header) != null && _a.menu && args.node.querySelectorAll(".slick-header-menubutton").forEach((elm) => elm.remove());
    }
    showMenu(event, menu, columnDef) {
      var _a, _b, _c, _d, _e, _f;
      let callbackArgs = {
        grid: this._grid,
        column: columnDef,
        menu
      };
      if (this.onBeforeMenuShow.notify(callbackArgs, event, this).getReturnValue() == !1)
        return;
      if (!this._menuElm) {
        this._menuElm = document.createElement("div"), this._menuElm.className = "slick-header-menu", this._menuElm.role = "menu", this._menuElm.style.minWidth = `${this._options.minWidth}px`, this._menuElm.setAttribute("aria-expanded", "true");
        let containerNode = this._grid.getContainerNode();
        containerNode && containerNode.appendChild(this._menuElm);
      }
      Utils.emptyElement(this._menuElm);
      for (let i = 0; i < menu.items.length; i++) {
        let item = menu.items[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let menuItem = document.createElement("div");
        if (menuItem.className = "slick-header-menuitem", menuItem.role = "menuitem", item.divider || item === "divider") {
          menuItem.classList.add("slick-header-menuitem-divider");
          continue;
        }
        item.disabled && menuItem.classList.add("slick-header-menuitem-disabled"), item.hidden && menuItem.classList.add("slick-header-menuitem-hidden"), item.cssClass && menuItem.classList.add(...item.cssClass.split(" ")), item.tooltip && (menuItem.title = item.tooltip || "");
        let iconElm = document.createElement("div");
        iconElm.className = "slick-header-menuicon", menuItem.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-header-menucontent", textElm.textContent = item.title || "", menuItem.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), this._menuElm.appendChild(menuItem), this._bindingEventService.bind(menuItem, "click", this.handleMenuItemClick.bind(this, item, columnDef));
      }
      let buttonElm = event.target, btnOffset = Utils.offset(buttonElm), menuOffset = Utils.offset(this._menuElm), leftPos = (_a = btnOffset == null ? void 0 : btnOffset.left) != null ? _a : 0;
      if (this._options.autoAlign) {
        let gridPos = this._grid.getGridPosition();
        leftPos + this._menuElm.offsetWidth >= gridPos.width && (leftPos = leftPos + buttonElm.clientWidth - this._menuElm.clientWidth + (this._options.autoAlignOffset || 0));
      }
      this._menuElm.style.top = `${(_e = (_b = buttonElm.clientHeight) != null ? _b : btnOffset == null ? void 0 : btnOffset.top) != null ? _e : 0 + ((_d = (_c = this._options) == null ? void 0 : _c.menuOffsetTop) != null ? _d : 0)}px`, this._menuElm.style.left = `${leftPos - ((_f = menuOffset == null ? void 0 : menuOffset.left) != null ? _f : 0)}px`, this._activeHeaderColumnElm = this._menuElm.closest(".slick-header-column"), this._activeHeaderColumnElm && this._activeHeaderColumnElm.classList.add("slick-header-column-active"), this.onAfterMenuShow.notify(callbackArgs, event, this).getReturnValue() != !1 && (event.preventDefault(), event.stopPropagation());
    }
    handleMenuItemClick(item, columnDef, e) {
      let command = item.command || "";
      if (item.disabled || item.divider || item === "divider")
        return !1;
      if (command !== null && command !== "") {
        let callbackArgs = {
          grid: this._grid,
          column: columnDef,
          command,
          item
        };
        this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
      e.defaultPrevented || this.hideMenu(), e.preventDefault(), e.stopPropagation();
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
