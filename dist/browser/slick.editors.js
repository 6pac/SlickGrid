"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:./slick.core.js"() {
    }
  });

  // src/slick.editors.js
  var require_slick_editors = __commonJS({
    "src/slick.editors.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.Editors = exports.LongTextEditor = exports.PercentCompleteEditor = exports.CheckboxEditor = exports.YesNoSelectEditor = exports.FlatpickrEditor = exports.FloatEditor = exports.IntegerEditor = exports.TextEditor = void 0;
      var slick_core_1 = require_slick_core(), keyCode = Slick.keyCode, Utils = Slick.Utils, TextEditor = (
        /** @class */
        function() {
          function TextEditor2(args) {
            this.args = args, this.init();
          }
          return TextEditor2.prototype.init = function() {
            this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
          }, TextEditor2.prototype.onChange = function() {
            var _a, _b, activeCell = this.args.grid.getActiveCell();
            this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
              row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
              cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
              item: this.args.item,
              column: this.args.column,
              formValues: this.args.compositeEditorOptions.formValues,
              grid: this.args.grid,
              editors: this.args.compositeEditorOptions.editors
            });
          }, TextEditor2.prototype.destroy = function() {
            this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
          }, TextEditor2.prototype.focus = function() {
            this.input.focus();
          }, TextEditor2.prototype.getValue = function() {
            return this.input.value;
          }, TextEditor2.prototype.setValue = function(val) {
            this.input.value = val;
          }, TextEditor2.prototype.loadValue = function(item) {
            var _a, _b;
            this.defaultValue = item[this.args.column.field] || "", this.input.value = String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : ""), this.input.defaultValue = String((_b = this.defaultValue) !== null && _b !== void 0 ? _b : ""), this.input.select();
          }, TextEditor2.prototype.serializeValue = function() {
            return this.input.value;
          }, TextEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, TextEditor2.prototype.isValueChanged = function() {
            return !(this.input.value === "" && this.defaultValue == null) && this.input.value != this.defaultValue;
          }, TextEditor2.prototype.validate = function() {
            if (this.args.column.validator) {
              var validationResults = this.args.column.validator(this.input.value, this.args);
              if (!validationResults.valid)
                return validationResults;
            }
            return {
              valid: !0,
              msg: null
            };
          }, TextEditor2;
        }()
      );
      exports.TextEditor = TextEditor;
      var IntegerEditor = (
        /** @class */
        function() {
          function IntegerEditor2(args) {
            this.args = args, this.init();
          }
          return IntegerEditor2.prototype.init = function() {
            this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
          }, IntegerEditor2.prototype.onChange = function() {
            var _a, _b, activeCell = this.args.grid.getActiveCell();
            this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
              row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
              cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
              item: this.args.item,
              column: this.args.column,
              formValues: this.args.compositeEditorOptions.formValues,
              grid: this.args.grid,
              editors: this.args.compositeEditorOptions.editors
            });
          }, IntegerEditor2.prototype.destroy = function() {
            this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
          }, IntegerEditor2.prototype.focus = function() {
            this.input.focus();
          }, IntegerEditor2.prototype.loadValue = function(item) {
            var _a, _b;
            this.defaultValue = item[this.args.column.field], this.input.value = String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : ""), this.input.defaultValue = String((_b = this.defaultValue) !== null && _b !== void 0 ? _b : ""), this.input.select();
          }, IntegerEditor2.prototype.serializeValue = function() {
            return parseInt(this.input.value, 10) || 0;
          }, IntegerEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, IntegerEditor2.prototype.isValueChanged = function() {
            return !(this.input.value === "" && this.defaultValue == null) && this.input.value != this.defaultValue;
          }, IntegerEditor2.prototype.validate = function() {
            if (isNaN(this.input.value))
              return {
                valid: !1,
                msg: "Please enter a valid integer"
              };
            if (this.args.column.validator) {
              var validationResults = this.args.column.validator(this.input.value, this.args);
              if (!validationResults.valid)
                return validationResults;
            }
            return {
              valid: !0,
              msg: null
            };
          }, IntegerEditor2;
        }()
      );
      exports.IntegerEditor = IntegerEditor;
      var FloatEditor = exports.FloatEditor = /** @class */
      function() {
        function FloatEditor2(args) {
          this.args = args, this.init();
        }
        return FloatEditor2.prototype.init = function() {
          this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
        }, FloatEditor2.prototype.onChange = function() {
          var _a, _b, activeCell = this.args.grid.getActiveCell();
          this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
            row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
            cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
            item: this.args.item,
            column: this.args.column,
            formValues: this.args.compositeEditorOptions.formValues,
            grid: this.args.grid,
            editors: this.args.compositeEditorOptions.editors
          });
        }, FloatEditor2.prototype.destroy = function() {
          this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
        }, FloatEditor2.prototype.focus = function() {
          this.input.focus();
        }, FloatEditor2.prototype.getDecimalPlaces = function() {
          var rtn = this.args.column.editorFixedDecimalPlaces;
          return typeof rtn == "undefined" && (rtn = FloatEditor2.DefaultDecimalPlaces), !rtn && rtn !== 0 ? null : rtn;
        }, FloatEditor2.prototype.loadValue = function(item) {
          var _a, _b, _c;
          this.defaultValue = item[this.args.column.field];
          var decPlaces = this.getDecimalPlaces();
          decPlaces !== null && (this.defaultValue || this.defaultValue === 0) && (!((_a = this.defaultValue) === null || _a === void 0) && _a.toFixed) && (this.defaultValue = this.defaultValue.toFixed(decPlaces)), this.input.value = String((_b = this.defaultValue) !== null && _b !== void 0 ? _b : ""), this.input.defaultValue = String((_c = this.defaultValue) !== null && _c !== void 0 ? _c : ""), this.input.select();
        }, FloatEditor2.prototype.serializeValue = function() {
          var rtn = parseFloat(this.input.value);
          FloatEditor2.AllowEmptyValue ? !rtn && rtn !== 0 && (rtn = void 0) : rtn = rtn || 0;
          var decPlaces = this.getDecimalPlaces();
          return decPlaces !== null && (rtn || rtn === 0) && rtn.toFixed && (rtn = parseFloat(rtn.toFixed(decPlaces))), rtn;
        }, FloatEditor2.prototype.applyValue = function(item, state) {
          item[this.args.column.field] = state;
        }, FloatEditor2.prototype.isValueChanged = function() {
          return !(this.input.value === "" && this.defaultValue == null) && this.input.value != this.defaultValue;
        }, FloatEditor2.prototype.validate = function() {
          if (isNaN(this.input.value))
            return {
              valid: !1,
              msg: "Please enter a valid number"
            };
          if (this.args.column.validator) {
            var validationResults = this.args.column.validator(this.input.value, this.args);
            if (!validationResults.valid)
              return validationResults;
          }
          return {
            valid: !0,
            msg: null
          };
        }, FloatEditor2.DefaultDecimalPlaces = void 0, FloatEditor2.AllowEmptyValue = !1, FloatEditor2;
      }(), FlatpickrEditor = (
        /** @class */
        function() {
          function FlatpickrEditor2(args) {
            if (this.args = args, this.init(), typeof flatpickr == "undefined")
              throw new Error("Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/");
          }
          return FlatpickrEditor2.prototype.init = function() {
            var _this = this;
            this.input = Utils.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.focus(), this.input.select(), this.flatpickrInstance = flatpickr(this.input, {
              closeOnSelect: !0,
              allowInput: !0,
              altInput: !0,
              altFormat: "m/d/Y",
              dateFormat: "m/d/Y",
              onChange: function() {
                var _a, _b;
                if (_this.args.compositeEditorOptions) {
                  var activeCell = _this.args.grid.getActiveCell();
                  _this.validate().valid && _this.applyValue(_this.args.item, _this.serializeValue()), _this.applyValue(_this.args.compositeEditorOptions.formValues, _this.serializeValue()), _this.args.grid.onCompositeEditorChange.notify({
                    row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
                    cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
                    item: _this.args.item,
                    column: _this.args.column,
                    formValues: _this.args.compositeEditorOptions.formValues,
                    grid: _this.args.grid,
                    editors: _this.args.compositeEditorOptions.editors
                  });
                }
              }
            }), this.args.compositeEditorOptions || setTimeout(function() {
              _this.show(), _this.focus();
            }, 50), Utils.width(this.input, Utils.width(this.input) - (this.args.compositeEditorOptions ? 28 : 18));
          }, FlatpickrEditor2.prototype.destroy = function() {
            this.hide(), this.flatpickrInstance && this.flatpickrInstance.destroy(), this.input.remove();
          }, FlatpickrEditor2.prototype.show = function() {
            !this.args.compositeEditorOptions && this.flatpickrInstance && this.flatpickrInstance.open();
          }, FlatpickrEditor2.prototype.hide = function() {
            !this.args.compositeEditorOptions && this.flatpickrInstance && this.flatpickrInstance.close();
          }, FlatpickrEditor2.prototype.focus = function() {
            this.input.focus();
          }, FlatpickrEditor2.prototype.loadValue = function(item) {
            var _a, _b;
            this.defaultValue = item[this.args.column.field], this.input.value = String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : ""), this.input.defaultValue = String((_b = this.defaultValue) !== null && _b !== void 0 ? _b : ""), this.input.select(), this.flatpickrInstance && this.flatpickrInstance.setDate(this.defaultValue);
          }, FlatpickrEditor2.prototype.serializeValue = function() {
            return this.input.value;
          }, FlatpickrEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, FlatpickrEditor2.prototype.isValueChanged = function() {
            return !(this.input.value === "" && this.defaultValue == null) && this.input.value != this.defaultValue;
          }, FlatpickrEditor2.prototype.validate = function() {
            if (this.args.column.validator) {
              var validationResults = this.args.column.validator(this.input.value, this.args);
              if (!validationResults.valid)
                return validationResults;
            }
            return {
              valid: !0,
              msg: null
            };
          }, FlatpickrEditor2;
        }()
      );
      exports.FlatpickrEditor = FlatpickrEditor;
      var YesNoSelectEditor = (
        /** @class */
        function() {
          function YesNoSelectEditor2(args) {
            this.args = args, this.init();
          }
          return YesNoSelectEditor2.prototype.init = function() {
            this.select = Utils.createDomElement("select", { tabIndex: 0, className: "editor-yesno" }, this.args.container), Utils.createDomElement("option", { value: "yes", textContent: "Yes" }, this.select), Utils.createDomElement("option", { value: "no", textContent: "No" }, this.select), this.select.focus(), this.args.compositeEditorOptions && this.select.addEventListener("change", this.onChange.bind(this));
          }, YesNoSelectEditor2.prototype.onChange = function() {
            var _a, _b, activeCell = this.args.grid.getActiveCell();
            this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
              row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
              cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
              item: this.args.item,
              column: this.args.column,
              formValues: this.args.compositeEditorOptions.formValues,
              grid: this.args.grid,
              editors: this.args.compositeEditorOptions.editors
            });
          }, YesNoSelectEditor2.prototype.destroy = function() {
            this.select.removeEventListener("change", this.onChange.bind(this)), this.select.remove();
          }, YesNoSelectEditor2.prototype.focus = function() {
            this.select.focus();
          }, YesNoSelectEditor2.prototype.loadValue = function(item) {
            this.select.value = (this.defaultValue = item[this.args.column.field]) ? "yes" : "no";
          }, YesNoSelectEditor2.prototype.serializeValue = function() {
            return this.select.value == "yes";
          }, YesNoSelectEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, YesNoSelectEditor2.prototype.isValueChanged = function() {
            return this.select.value != this.defaultValue;
          }, YesNoSelectEditor2.prototype.validate = function() {
            return {
              valid: !0,
              msg: null
            };
          }, YesNoSelectEditor2;
        }()
      );
      exports.YesNoSelectEditor = YesNoSelectEditor;
      var CheckboxEditor = (
        /** @class */
        function() {
          function CheckboxEditor2(args) {
            this.args = args, this.init();
          }
          return CheckboxEditor2.prototype.init = function() {
            this.input = Utils.createDomElement("input", { className: "editor-checkbox", type: "checkbox", value: "true" }, this.args.container), this.input.focus(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
          }, CheckboxEditor2.prototype.onChange = function() {
            var _a, _b, activeCell = this.args.grid.getActiveCell();
            this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
              row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
              cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
              item: this.args.item,
              column: this.args.column,
              formValues: this.args.compositeEditorOptions.formValues,
              grid: this.args.grid,
              editors: this.args.compositeEditorOptions.editors
            });
          }, CheckboxEditor2.prototype.destroy = function() {
            this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
          }, CheckboxEditor2.prototype.focus = function() {
            this.input.focus();
          }, CheckboxEditor2.prototype.loadValue = function(item) {
            this.defaultValue = !!item[this.args.column.field], this.defaultValue ? this.input.checked = !0 : this.input.checked = !1;
          }, CheckboxEditor2.prototype.serializeValue = function() {
            return this.input.checked;
          }, CheckboxEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, CheckboxEditor2.prototype.isValueChanged = function() {
            return this.serializeValue() !== this.defaultValue;
          }, CheckboxEditor2.prototype.validate = function() {
            return {
              valid: !0,
              msg: null
            };
          }, CheckboxEditor2;
        }()
      );
      exports.CheckboxEditor = CheckboxEditor;
      var PercentCompleteEditor = (
        /** @class */
        function() {
          function PercentCompleteEditor2(args) {
            this.args = args, this.init();
          }
          return PercentCompleteEditor2.prototype.sliderInputHandler = function(e) {
            this.input.value = e.target.value;
          }, PercentCompleteEditor2.prototype.sliderChangeHandler = function() {
            var _a, _b;
            if (this.args.compositeEditorOptions) {
              var activeCell = this.args.grid.getActiveCell();
              this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
                row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
                cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
                item: this.args.item,
                column: this.args.column,
                formValues: this.args.compositeEditorOptions.formValues,
                grid: this.args.grid,
                editors: this.args.compositeEditorOptions.editors
              });
            }
          }, PercentCompleteEditor2.prototype.init = function() {
            var _this = this, _a;
            this.input = Utils.createDomElement("input", { className: "editor-percentcomplete", type: "text" }, this.args.container), Utils.width(this.input, this.args.container.clientWidth - 25), this.picker = Utils.createDomElement("div", { className: "editor-percentcomplete-picker" }, this.args.container), Utils.createDomElement("span", { className: "editor-percentcomplete-picker-icon" }, this.picker);
            var containerHelper = Utils.createDomElement("div", { className: "editor-percentcomplete-helper" }, this.picker), containerWrapper = Utils.createDomElement("div", { className: "editor-percentcomplete-wrapper" }, containerHelper);
            Utils.createDomElement("div", { className: "editor-percentcomplete-slider" }, containerWrapper), this.slider = Utils.createDomElement("input", { className: "editor-percentcomplete-slider", type: "range", value: String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : "") }, containerWrapper);
            var containerButtons = Utils.createDomElement("div", { className: "editor-percentcomplete-buttons" }, containerWrapper);
            Utils.createDomElement("button", { value: "0", className: "slick-btn slick-btn-default", textContent: "Not started" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils.createDomElement("button", { value: "50", className: "slick-btn slick-btn-default", textContent: "In Progress" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils.createDomElement("button", { value: "100", className: "slick-btn slick-btn-default", textContent: "Complete" }, containerButtons), this.input.focus(), this.input.select(), this.slider.addEventListener("input", this.sliderInputHandler.bind(this)), this.slider.addEventListener("change", this.sliderChangeHandler.bind(this));
            var buttons = this.picker.querySelectorAll(".editor-percentcomplete-buttons button");
            [].forEach.call(buttons, function(button) {
              button.addEventListener("click", _this.onClick.bind(_this));
            });
          }, PercentCompleteEditor2.prototype.onClick = function(e) {
            var _a, _b;
            this.input.value = String((_a = e.target.value) !== null && _a !== void 0 ? _a : ""), this.slider.value = String((_b = e.target.value) !== null && _b !== void 0 ? _b : "");
          }, PercentCompleteEditor2.prototype.destroy = function() {
            var _this = this, _a, _b;
            (_a = this.slider) === null || _a === void 0 || _a.removeEventListener("input", this.sliderInputHandler.bind(this)), (_b = this.slider) === null || _b === void 0 || _b.removeEventListener("change", this.sliderChangeHandler.bind(this)), this.picker.querySelectorAll(".editor-percentcomplete-buttons button").forEach(function(button) {
              return button.removeEventListener("click", _this.onClick.bind(_this));
            }), this.input.remove(), this.picker.remove();
          }, PercentCompleteEditor2.prototype.focus = function() {
            this.input.focus();
          }, PercentCompleteEditor2.prototype.loadValue = function(item) {
            var _a;
            this.defaultValue = item[this.args.column.field], this.slider.value = String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : ""), this.input.value = String(this.defaultValue), this.input.select();
          }, PercentCompleteEditor2.prototype.serializeValue = function() {
            return parseInt(this.input.value, 10) || 0;
          }, PercentCompleteEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, PercentCompleteEditor2.prototype.isValueChanged = function() {
            return !(this.input.value === "" && this.defaultValue == null) && (parseInt(this.input.value, 10) || 0) != this.defaultValue;
          }, PercentCompleteEditor2.prototype.validate = function() {
            return isNaN(parseInt(this.input.value, 10)) ? {
              valid: !1,
              msg: "Please enter a valid positive number"
            } : {
              valid: !0,
              msg: null
            };
          }, PercentCompleteEditor2;
        }()
      );
      exports.PercentCompleteEditor = PercentCompleteEditor;
      var LongTextEditor = (
        /** @class */
        function() {
          function LongTextEditor2(args) {
            this.args = args, this.selectionStart = 0, this.init();
          }
          return LongTextEditor2.prototype.init = function() {
            var compositeEditorOptions = this.args.compositeEditorOptions;
            this.args.grid.getOptions().editorCellNavOnLRKeys;
            var container = compositeEditorOptions ? this.args.container : document.body;
            if (this.wrapper = Utils.createDomElement("div", { className: "slick-large-editor-text" }, container), compositeEditorOptions ? (this.wrapper.style.position = "relative", Utils.setStyleSize(this.wrapper, "padding", 0), Utils.setStyleSize(this.wrapper, "border", 0)) : this.wrapper.style.position = "absolute", this.input = Utils.createDomElement("textarea", { rows: 5, style: { background: "white", width: "250px", height: "80px", border: "0", outline: "0" } }, this.wrapper), compositeEditorOptions)
              this.input.addEventListener("change", this.onChange.bind(this));
            else {
              var btnContainer = Utils.createDomElement("div", { style: "text-align:right" }, this.wrapper);
              Utils.createDomElement("button", { id: "save", className: "slick-btn slick-btn-primary", textContent: "Save" }, btnContainer), Utils.createDomElement("button", { id: "cancel", className: "slick-btn slick-btn-default", textContent: "Cancel" }, btnContainer), this.wrapper.querySelector("#save").addEventListener("click", this.save.bind(this)), this.wrapper.querySelector("#cancel").addEventListener("click", this.cancel.bind), this.input.addEventListener("keydown", this.handleKeyDown.bind(this)), this.position(this.args.position);
            }
            this.input.focus(), this.input.select();
          }, LongTextEditor2.prototype.onChange = function() {
            var _a, _b, activeCell = this.args.grid.getActiveCell();
            this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
              row: (_a = activeCell == null ? void 0 : activeCell.row) !== null && _a !== void 0 ? _a : 0,
              cell: (_b = activeCell == null ? void 0 : activeCell.cell) !== null && _b !== void 0 ? _b : 0,
              item: this.args.item,
              column: this.args.column,
              formValues: this.args.compositeEditorOptions.formValues,
              grid: this.args.grid,
              editors: this.args.compositeEditorOptions.editors
            });
          }, LongTextEditor2.prototype.handleKeyDown = function(e) {
            if (e.which == keyCode.ENTER && e.ctrlKey)
              this.save();
            else if (e.which == keyCode.ESCAPE)
              e.preventDefault(), this.cancel();
            else if (e.which == keyCode.TAB && e.shiftKey)
              e.preventDefault(), this.args.grid.navigatePrev();
            else if (e.which == keyCode.TAB)
              e.preventDefault(), this.args.grid.navigateNext();
            else if ((e.which == keyCode.LEFT || e.which == keyCode.RIGHT) && this.args.grid.getOptions().editorCellNavOnLRKeys) {
              var cursorPosition = this.selectionStart, textLength = e.target.value.length;
              e.keyCode === keyCode.LEFT && cursorPosition === 0 && this.args.grid.navigatePrev(), e.keyCode === keyCode.RIGHT && cursorPosition >= textLength - 1 && this.args.grid.navigateNext();
            }
          }, LongTextEditor2.prototype.save = function() {
            var gridOptions = this.args.grid.getOptions() || {};
            gridOptions.autoCommitEdit ? this.args.grid.getEditorLock().commitCurrentEdit() : this.args.commitChanges();
          }, LongTextEditor2.prototype.cancel = function() {
            var _a;
            this.input.value = String((_a = this.defaultValue) !== null && _a !== void 0 ? _a : ""), this.args.cancelChanges();
          }, LongTextEditor2.prototype.hide = function() {
            Utils.hide(this.wrapper);
          }, LongTextEditor2.prototype.show = function() {
            Utils.show(this.wrapper);
          }, LongTextEditor2.prototype.position = function(position) {
            Utils.setStyleSize(this.wrapper, "top", (position.top || 0) - 5), Utils.setStyleSize(this.wrapper, "left", (position.left || 0) - 2);
          }, LongTextEditor2.prototype.destroy = function() {
            this.args.compositeEditorOptions ? this.input.removeEventListener("change", this.onChange.bind(this)) : (this.wrapper.querySelector("#save").removeEventListener("click", this.save.bind(this)), this.wrapper.querySelector("#cancel").removeEventListener("click", this.cancel.bind(this)), this.input.removeEventListener("keydown", this.handleKeyDown.bind(this))), this.wrapper.remove();
          }, LongTextEditor2.prototype.focus = function() {
            this.input.focus();
          }, LongTextEditor2.prototype.loadValue = function(item) {
            this.input.value = this.defaultValue = item[this.args.column.field], this.input.select();
          }, LongTextEditor2.prototype.serializeValue = function() {
            return this.input.value;
          }, LongTextEditor2.prototype.applyValue = function(item, state) {
            item[this.args.column.field] = state;
          }, LongTextEditor2.prototype.isValueChanged = function() {
            return !(this.input.value === "" && this.defaultValue == null) && this.input.value != this.defaultValue;
          }, LongTextEditor2.prototype.validate = function() {
            if (this.args.column.validator) {
              var validationResults = this.args.column.validator(this.input.value, this.args);
              if (!validationResults.valid)
                return validationResults;
            }
            return {
              valid: !0,
              msg: null
            };
          }, LongTextEditor2;
        }()
      );
      exports.LongTextEditor = LongTextEditor;
      function handleKeydownLRNav(e) {
        var cursorPosition = e.selectionStart, textLength = e.target.value.length;
        (e.keyCode === keyCode.LEFT && cursorPosition > 0 || e.keyCode === keyCode.RIGHT && cursorPosition < textLength - 1) && e.stopImmediatePropagation();
      }
      function handleKeydownLRNoNav(e) {
        (e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) && e.stopImmediatePropagation();
      }
      exports.Editors = {
        Text: TextEditor,
        Integer: IntegerEditor,
        Float: FloatEditor,
        Flatpickr: FlatpickrEditor,
        YesNoSelect: YesNoSelectEditor,
        Checkbox: CheckboxEditor,
        PercentComplete: PercentCompleteEditor,
        LongText: LongTextEditor
      };
      window.Slick && Utils.extend(Slick, {
        Editors: exports.Editors
      });
    }
  });
  require_slick_editors();
})();
//# sourceMappingURL=slick.editors.js.map
