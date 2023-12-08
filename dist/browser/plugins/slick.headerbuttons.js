"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/plugins/slick.headerbuttons.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickHeaderButtons = class {
    constructor(options) {
      // --
      // public API
      __publicField(this, "pluginName", "HeaderButtons");
      __publicField(this, "onCommand", new SlickEvent("onCommand"));
      // --
      // protected props
      __publicField(this, "_grid");
      __publicField(this, "_handler", new EventHandler());
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_defaults", {
        buttonCssClass: "slick-header-button"
      });
      __publicField(this, "_options");
      this._options = Utils.extend(!0, {}, this._defaults, options);
    }
    init(grid) {
      this._grid = grid, Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this), this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns());
    }
    destroy() {
      this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
    }
    handleHeaderCellRendered(_e, args) {
      var _a;
      let column = args.column;
      if ((_a = column.header) != null && _a.buttons) {
        let i = column.header.buttons.length;
        for (; i--; ) {
          let button = column.header.buttons[i], isItemVisible = this.runOverrideFunctionWhenExists(button.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(button.itemUsabilityOverride, args);
          if (!isItemVisible)
            continue;
          Object.prototype.hasOwnProperty.call(button, "itemUsabilityOverride") && (button.disabled = !isItemUsable);
          let btn = document.createElement("div");
          btn.className = this._options.buttonCssClass || "", btn.ariaLabel = "Header Button", btn.role = "button", button.disabled && btn.classList.add("slick-header-button-disabled"), button.showOnHover && btn.classList.add("slick-header-button-hidden"), button.image && (btn.style.backgroundImage = `url(${button.image})`), button.cssClass && btn.classList.add(...button.cssClass.split(" ")), button.tooltip && (btn.title = button.tooltip), button.handler && !button.disabled && this._bindingEventService.bind(btn, "click", button.handler), this._bindingEventService.bind(btn, "click", this.handleButtonClick.bind(this, button, args.column)), args.node.appendChild(btn);
        }
      }
    }
    handleBeforeHeaderCellDestroy(_e, args) {
      var _a;
      if ((_a = args.column.header) != null && _a.buttons) {
        let buttonCssClass = (this._options.buttonCssClass || "").replace(/(\s+)/g, ".");
        buttonCssClass && args.node.querySelectorAll(`.${buttonCssClass}`).forEach((elm) => elm.remove());
      }
    }
    handleButtonClick(button, columnDef, e) {
      let command = button.command || "", callbackArgs = {
        grid: this._grid,
        column: columnDef,
        button
      };
      command && (callbackArgs.command = command), typeof button.action == "function" && button.action.call(this, e, callbackArgs), command && !button.disabled && (this.onCommand.notify(callbackArgs, e, this), this._grid.updateColumnHeader(columnDef.id)), e.preventDefault(), e.stopPropagation();
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
        HeaderButtons: SlickHeaderButtons
      }
    }
  });
})();
//# sourceMappingURL=slick.headerbuttons.js.map
