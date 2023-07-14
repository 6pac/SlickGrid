"use strict";
(() => {
  // src/plugins/slick.headermenu.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function HeaderMenu(options) {
    var _grid, _self = this, _handler = new EventHandler(), _bindingEventService = new BindingEventService(), _defaults = {
      buttonCssClass: null,
      buttonImage: null,
      minWidth: 100,
      autoAlign: !0,
      autoAlignOffset: 0
    }, _activeHeaderColumnElm, _menuElm;
    function init(grid) {
      options = Utils.extend(!0, {}, _defaults, options), _grid = grid, _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy), _grid.setColumns(_grid.getColumns()), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown.bind(this));
    }
    function setOptions(newOptions) {
      options = Utils.extend(!0, {}, options, newOptions);
    }
    function getGridUidSelector() {
      let gridUid = _grid.getUID() || "";
      return gridUid ? `.${gridUid}` : "";
    }
    function destroy() {
      _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm = _menuElm || document.body.querySelector(`.slick-header-menu${getGridUidSelector()}`), _menuElm && _menuElm.remove(), _activeHeaderColumnElm = void 0;
    }
    function handleBodyMouseDown(e) {
      (_menuElm !== e.target && !(_menuElm && _menuElm.contains(e.target)) || e.target.className === "close") && hideMenu();
    }
    function hideMenu() {
      _menuElm && (_menuElm.remove(), _menuElm = void 0), _activeHeaderColumnElm && _activeHeaderColumnElm.classList.remove("slick-header-column-active");
    }
    function handleHeaderCellRendered(e, args) {
      var column = args.column, menu = column.header && column.header.menu;
      if (menu) {
        if (!runOverrideFunctionWhenExists(options.menuUsabilityOverride, args))
          return;
        let elm = document.createElement("div");
        if (elm.className = "slick-header-menubutton", elm.ariaLabel = "Header Menu", elm.role = "button", !options.buttonCssClass && !options.buttonImage && (options.buttonCssClass = "caret"), options.buttonCssClass) {
          let icon = document.createElement("span");
          icon.classList.add(...options.buttonCssClass.split(" ")), elm.appendChild(icon);
        }
        options.buttonImage && (elm.style.backgroundImage = "url(" + options.buttonImage + ")"), options.tooltip && (elm.title = options.tooltip), _bindingEventService.bind(elm, "click", (e2) => showMenu(e2, menu, args.column)), args.node.appendChild(elm);
      }
    }
    function handleBeforeHeaderCellDestroy(e, args) {
      var column = args.column;
      column.header && column.header.menu && args.node.querySelectorAll(".slick-header-menubutton").forEach((elm) => elm.remove());
    }
    function showMenu(event, menu, columnDef) {
      var callbackArgs = {
        grid: _grid,
        column: columnDef,
        menu
      };
      if (_self.onBeforeMenuShow.notify(callbackArgs, event, _self).getReturnValue() == !1)
        return;
      if (!_menuElm) {
        _menuElm = document.createElement("div"), _menuElm.className = "slick-header-menu", _menuElm.role = "menu", _menuElm.style.minWidth = `${options.minWidth}px`, _menuElm.setAttribute("aria-expanded", "true");
        let containerNode = _grid.getContainerNode();
        containerNode && containerNode.appendChild(_menuElm);
      }
      Utils.emptyElement(_menuElm);
      for (var i = 0; i < menu.items.length; i++) {
        var item = menu.items[i], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let menuItem = document.createElement("div");
        if (menuItem.className = "slick-header-menuitem", menuItem.role = "menuitem", item.divider || item === "divider") {
          menuItem.classList.add("slick-header-menuitem-divider");
          continue;
        }
        item.disabled && menuItem.classList.add("slick-header-menuitem-disabled"), item.hidden && menuItem.classList.add("slick-header-menuitem-hidden"), item.cssClass && menuItem.classList.add(...item.cssClass.split(" ")), item.tooltip && (menuItem.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.className = "slick-header-menuicon", menuItem.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-header-menucontent", textElm.textContent = item.title, menuItem.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), _menuElm.appendChild(menuItem), _bindingEventService.bind(menuItem, "click", handleMenuItemClick.bind(this, item, columnDef));
      }
      let buttonElm = event.target, btnOffset = Utils.offset(buttonElm), menuOffset = Utils.offset(_menuElm), leftPos = btnOffset && btnOffset.left || 0;
      if (options.autoAlign) {
        let gridPos = _grid.getGridPosition();
        leftPos + _menuElm.offsetWidth >= gridPos.width && (leftPos = leftPos + buttonElm.clientWidth - _menuElm.clientWidth + (options.autoAlignOffset || 0));
      }
      _menuElm.style.top = `${(buttonElm.clientHeight || btnOffset && btnOffset.top || 0) + (options && options.menuOffsetTop || 0)}px`, _menuElm.style.left = `${leftPos - menuOffset.left}px`, _activeHeaderColumnElm = _menuElm.closest(".slick-header-column"), _activeHeaderColumnElm && _activeHeaderColumnElm.classList.add("slick-header-column-active"), _self.onAfterMenuShow.notify(callbackArgs, event, _self).getReturnValue() != !1 && (event.preventDefault(), event.stopPropagation());
    }
    function handleMenuItemClick(item, columnDef, e) {
      let command = item.command || "";
      if (item.disabled || item.divider || item === "divider")
        return !1;
      if (command != null && command !== "") {
        var callbackArgs = {
          grid: _grid,
          column: columnDef,
          command,
          item
        };
        _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
      e.defaultPrevented || hideMenu(), e.preventDefault(), e.stopPropagation();
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "HeaderMenu",
      setOptions,
      onAfterMenuShow: new SlickEvent(),
      onBeforeMenuShow: new SlickEvent(),
      onCommand: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        HeaderMenu
      }
    }
  });
})();
//# sourceMappingURL=slick.headermenu.js.map
