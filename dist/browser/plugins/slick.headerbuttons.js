"use strict";
(() => {
  // src/plugins/slick.headerbuttons.js
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils;
  function HeaderButtons(options) {
    var _grid, _self = this, _handler = new EventHandler(), _bindingEventService = new BindingEventService(), _defaults = {
      buttonCssClass: "slick-header-button"
    };
    function init(grid) {
      options = Utils.extend(!0, {}, _defaults, options), _grid = grid, _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy), _grid.setColumns(_grid.getColumns());
    }
    function destroy() {
      _handler.unsubscribeAll(), _bindingEventService.unbindAll();
    }
    function handleHeaderCellRendered(e, args) {
      var column = args.column;
      if (column.header && column.header.buttons)
        for (var i = column.header.buttons.length; i--; ) {
          var button = column.header.buttons[i], isItemVisible = runOverrideFunctionWhenExists(button.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(button.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(button, "itemUsabilityOverride") && (button.disabled = !isItemUsable);
          let btn = document.createElement("div");
          btn.className = options.buttonCssClass, btn.ariaLabel = "Header Button", btn.role = "button", button.disabled && btn.classList.add("slick-header-button-disabled"), button.showOnHover && btn.classList.add("slick-header-button-hidden"), button.image && (btn.style.backgroundImage = "url(" + button.image + ")"), button.cssClass && btn.classList.add(...button.cssClass.split(" ")), button.tooltip && (btn.title = button.tooltip), button.handler && _bindingEventService.bind(btn, "click", button.handler), _bindingEventService.bind(btn, "click", handleButtonClick.bind(this, button, args.column)), args.node.appendChild(btn);
        }
    }
    function handleBeforeHeaderCellDestroy(e, args) {
      var column = args.column;
      if (column.header && column.header.buttons) {
        let buttonCssClass = (options.buttonCssClass || "").replace(/(\s+)/g, ".");
        buttonCssClass && args.node.querySelectorAll(`.${buttonCssClass}`).forEach((elm) => elm.remove());
      }
    }
    function handleButtonClick(button, columnDef, e) {
      let command = button.command || "", callbackArgs = {
        grid: _grid,
        column: columnDef,
        button
      };
      command != null && (callbackArgs.command = command), typeof button.action == "function" && button.action.call(this, e, callbackArgs), command != null && !button.disabled && (_self.onCommand.notify(callbackArgs, e, _self), _grid.updateColumnHeader(columnDef.id)), e.preventDefault(), e.stopPropagation();
    }
    function runOverrideFunctionWhenExists(overrideFn, args) {
      return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
    }
    Utils.extend(this, {
      init,
      destroy,
      pluginName: "HeaderButtons",
      onCommand: new SlickEvent()
    });
  }
  window.Slick && Utils.extend(!0, window, {
    Slick: {
      Plugins: {
        HeaderButtons
      }
    }
  });
})();
//# sourceMappingURL=slick.headerbuttons.js.map
