"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:../slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:../slick.core.js"() {
    }
  });

  // src/plugins/slick.headerbuttons.js
  var require_slick_headerbuttons = __commonJS({
    "src/plugins/slick.headerbuttons.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickHeaderButtons = void 0;
      var slick_core_1 = require_slick_core(), BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, EventHandler = Slick.EventHandler, Utils = Slick.Utils, SlickHeaderButtons = (
        /** @class */
        function() {
          function SlickHeaderButtons2(options) {
            this.pluginName = "HeaderButtons", this.onCommand = new SlickEvent(), this._handler = new EventHandler(), this._bindingEventService = new BindingEventService(), this._defaults = {
              buttonCssClass: "slick-header-button"
            }, this._options = Utils.extend(!0, {}, this._defaults, options);
          }
          return SlickHeaderButtons2.prototype.init = function(grid) {
            this._grid = grid, this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns());
          }, SlickHeaderButtons2.prototype.destroy = function() {
            this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
          }, SlickHeaderButtons2.prototype.handleHeaderCellRendered = function(_e, args) {
            var _a, _b, column = args.column;
            if (!((_b = column.header) === null || _b === void 0) && _b.buttons)
              for (var i = column.header.buttons.length; i--; ) {
                var button = column.header.buttons[i], isItemVisible = this.runOverrideFunctionWhenExists(button.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(button.itemUsabilityOverride, args);
                if (isItemVisible) {
                  Object.prototype.hasOwnProperty.call(button, "itemUsabilityOverride") && (button.disabled = !isItemUsable);
                  var btn = document.createElement("div");
                  btn.className = this._options.buttonCssClass || "", btn.ariaLabel = "Header Button", btn.role = "button", button.disabled && btn.classList.add("slick-header-button-disabled"), button.showOnHover && btn.classList.add("slick-header-button-hidden"), button.image && (btn.style.backgroundImage = "url(".concat(button.image, ")")), button.cssClass && (_a = btn.classList).add.apply(_a, button.cssClass.split(" ")), button.tooltip && (btn.title = button.tooltip), button.handler && !button.disabled && this._bindingEventService.bind(btn, "click", button.handler), this._bindingEventService.bind(btn, "click", this.handleButtonClick.bind(this, button, args.column)), args.node.appendChild(btn);
                }
              }
          }, SlickHeaderButtons2.prototype.handleBeforeHeaderCellDestroy = function(_e, args) {
            var _a, column = args.column;
            if (!((_a = column.header) === null || _a === void 0) && _a.buttons) {
              var buttonCssClass = (this._options.buttonCssClass || "").replace(/(\s+)/g, ".");
              buttonCssClass && args.node.querySelectorAll(".".concat(buttonCssClass)).forEach(function(elm) {
                return elm.remove();
              });
            }
          }, SlickHeaderButtons2.prototype.handleButtonClick = function(button, columnDef, e) {
            var command = button.command || "", callbackArgs = {
              grid: this._grid,
              column: columnDef,
              button
            };
            command && (callbackArgs.command = command), typeof button.action == "function" && button.action.call(this, e, callbackArgs), command && !button.disabled && (this.onCommand.notify(callbackArgs, e, this), this._grid.updateColumnHeader(columnDef.id)), e.preventDefault(), e.stopPropagation();
          }, SlickHeaderButtons2.prototype.runOverrideFunctionWhenExists = function(overrideFn, args) {
            return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
          }, SlickHeaderButtons2;
        }()
      );
      exports.SlickHeaderButtons = SlickHeaderButtons;
      window.Slick && Utils.extend(!0, window, {
        Slick: {
          Plugins: {
            HeaderButtons: SlickHeaderButtons
          }
        }
      });
    }
  });
  require_slick_headerbuttons();
})();
//# sourceMappingURL=slick.headerbuttons.js.map
