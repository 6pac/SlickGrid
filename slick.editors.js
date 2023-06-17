import { keyCode as keyCode_, Utils as Utils_ } from './slick.core';

// for (iife) load Slick methods from global Slick object, or use imports for (cjs/esm)
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

export function TextEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    var navOnLR;
    this.args = args;

    this.init = function () {
      navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, args.container);
      input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.focus();
      input.select();

      // don't show Save/Cancel when it's a Composite Editor and also trigger a onCompositeEditorChange event when input changes
      if (args.compositeEditorOptions) {
        input.addEventListener("change", this.onChange);
      }
    };

    this.onChange = function() {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.destroy = function () {
      input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.removeEventListener("change", this.onChange)
      input.remove();
    };

    this.focus = function () {
      input.focus();
    };

    this.getValue = function () {
      return input.value;
    };

    this.setValue = function (val) {
      input.value = val;
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
      input.value = defaultValue;
      input.defaultValue = defaultValue;
      input.select();
    };

    this.serializeValue = function () {
      return input.value;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && (input.value != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator(input.value, args);
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

export function IntegerEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    var navOnLR;
    this.args = args;

    this.init = function () {
      navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, args.container);
      input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.focus()
      input.select();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        input.addEventListener("change", this.onChange);
      }
    };

    this.onChange = function () {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.destroy = function () {
      input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.removeEventListener("change", this.onChange)
      input.remove();
    };

    this.focus = function () {
      input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      input.value = defaultValue;
      input.defaultValue = defaultValue;
      input.select();
    };

    this.serializeValue = function () {
      return parseInt(input.value, 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && (input.value != defaultValue);
    };

    this.validate = function () {
      if (isNaN(input.value)) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      if (args.column.validator) {
        var validationResults = args.column.validator(input.value, args);
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

export function FloatEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    var navOnLR;
    this.args = args;

    this.init = function () {
      navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, args.container);
      input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.focus()
      input.select();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        input.addEventListener("change", this.onChange);
      }
    };

    this.onChange = function () {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.destroy = function () {
      input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.removeEventListener("change", this.onChange)
      input.remove();
    };

    this.focus = function () {
      input.focus();
    };

    function getDecimalPlaces() {
      // returns the number of fixed decimal places or null
      var rtn = args.column.editorFixedDecimalPlaces;
      if (typeof rtn == 'undefined') {
        rtn = FloatEditor.DefaultDecimalPlaces;
      }
      return (!rtn && rtn !== 0 ? null : rtn);
    }

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];

      var decPlaces = getDecimalPlaces();
      if (decPlaces !== null
        && (defaultValue || defaultValue === 0)
        && defaultValue.toFixed) {
        defaultValue = defaultValue.toFixed(decPlaces);
      }

      input.value = defaultValue;
      input.defaultValue = defaultValue;
      input.select();
    };

    this.serializeValue = function () {
      var rtn = parseFloat(input.value);
      if (FloatEditor.AllowEmptyValue) {
        if (!rtn && rtn !== 0) { rtn = ''; }
      } else {
        rtn = rtn || 0;
      }

      var decPlaces = getDecimalPlaces();
      if (decPlaces !== null
        && (rtn || rtn === 0)
        && rtn.toFixed) {
        rtn = parseFloat(rtn.toFixed(decPlaces));
      }

      return rtn;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && (input.value != defaultValue);
    };

    this.validate = function () {
      if (isNaN(input.value)) {
        return {
          valid: false,
          msg: "Please enter a valid number"
        };
      }

      if (args.column.validator) {
        var validationResults = args.column.validator(input.value, args);
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  FloatEditor.DefaultDecimalPlaces = null;
  FloatEditor.AllowEmptyValue = false;

export function FlatpickrEditor(args) {
    if (typeof flatpickr === 'undefined') {
      throw new Error('Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/');
    }

    var input;
    var defaultValue;
    var scope = this;
    this.args = args;
    var flatpickrInstance;

    this.init = function () {
      input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, args.container);
      input.focus();
      input.select();
      flatpickrInstance = flatpickr(input, {
        closeOnSelect: true,
        allowInput: true,
        altInput: true,
        altFormat: "m/d/Y",
        dateFormat: 'm/d/Y',
        onChange: () => {
          // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
          if (args.compositeEditorOptions) {
            var activeCell = args.grid.getActiveCell();

            // when valid, we'll also apply the new value to the dataContext item object
            if (scope.validate().valid) {
              scope.applyValue(scope.args.item, scope.serializeValue());
            }
            scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
            args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
          }
        },
      });

      if (!args.compositeEditorOptions) {
        setTimeout(() => {
          scope.show();
          scope.focus();
        }, 50);
      }

      Utils.width(input, Utils.width(input) - (!args.compositeEditorOptions ? 18 : 28));
    };

    this.destroy = function () {
      scope.hide();
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
      }
      input.remove();
    };

    this.show = function () {
      if (!args.compositeEditorOptions && flatpickrInstance) {
        flatpickrInstance.open();
      }
    };

    this.hide = function () {
      if (!args.compositeEditorOptions && flatpickrInstance) {
        flatpickrInstance.close();
      }
    };

    this.focus = function () {
      input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      input.value = defaultValue;
      input.defaultValue = defaultValue;
      input.select();
      if (flatpickrInstance) {
        flatpickrInstance.setDate(defaultValue);
      }
    };

    this.serializeValue = function () {
      return input.value;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && (input.value != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator(input.value, args);
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

export function YesNoSelectEditor(args) {
    var select;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      select = Utils.createDomElement('select', { tabIndex: 0, className: 'editor-yesno' }, args.container);
      Utils.createDomElement('option', { value: 'yes', textContent: 'Yes' }, select);
      Utils.createDomElement('option', { value: 'no', textContent: 'No' }, select);

      select.focus();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        select.addEventListener("change", this.onChange);
      }
    };

    this.onChange = function () {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.destroy = function () {
      select.removeEventListener("change", this.onChange)
      select.remove();
    };

    this.focus = function () {
      select.focus();
    };

    this.loadValue = function (item) {
      select.value = ((defaultValue = item[args.column.field]) ? "yes" : "no");
    };

    this.serializeValue = function () {
      return select.value == "yes";
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return select.value != defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

export function CheckboxEditor(args) {
    var select;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      select = Utils.createDomElement('input', { className: 'editor-checkbox', type: 'checkbox', value: 'true', }, args.container);
      select.focus();

      // trigger onCompositeEditorChange event when input checkbox changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        select.addEventListener("change", this.onChange);
      }
    };

    this.onChange = function () {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.destroy = function () {
      select.removeEventListener("change", this.onChange);
      select.remove();
    };

    this.focus = function () {
      select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        select.checked = true;
      } else {
        select.checked = false;
      }
    };

    this.serializeValue = function () {
      return select.checked;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

export function PercentCompleteEditor(args) {
    var input, picker;
    var defaultValue;
    var scope = this;
    this.args = args;
    var slider;
    var sliderInputHandler = function () {
      input.value = this.value;
    }
    var sliderChangeHandler = function () {
      // trigger onCompositeEditorChange event when slider stops and it's a Composite Editor
      if (args.compositeEditorOptions) {
        var activeCell = args.grid.getActiveCell();

        // when valid, we'll also apply the new value to the dataContext item object
        if (scope.validate().valid) {
          scope.applyValue(scope.args.item, scope.serializeValue());
        }
        scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
        args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
      }
    }

    this.init = function () {
      input = Utils.createDomElement('input', { className: 'editor-percentcomplete', type: 'text' }, args.container);
      Utils.width(input, args.container.clientWidth - 25);

      picker = Utils.createDomElement('div', { className: 'editor-percentcomplete-picker' }, args.container);
      const pickerIcon = Utils.createDomElement('span', { className: 'editor-percentcomplete-picker-icon' }, picker);
      const containerHelper = Utils.createDomElement('div', { className: 'editor-percentcomplete-helper' }, picker);
      const containerWrapper = Utils.createDomElement('div', { className: 'editor-percentcomplete-wrapper' }, containerHelper);
      Utils.createDomElement('div', { className: 'editor-percentcomplete-slider' }, containerWrapper);
      Utils.createDomElement('input', { className: 'editor-percentcomplete-slider', type: 'range' }, containerWrapper);
      const containerButtons = Utils.createDomElement('div', { className: 'editor-percentcomplete-buttons' }, containerWrapper);
      Utils.createDomElement('button', { value: '0', className: 'slick-btn slick-btn-default', textContent: 'Not started' }, containerButtons);
      containerButtons.appendChild(document.createElement('br'));
      Utils.createDomElement('button', { value: '50', className: 'slick-btn slick-btn-default', textContent: 'In Progress' }, containerButtons);
      containerButtons.appendChild(document.createElement('br'));
      Utils.createDomElement('button', { value: '100', className: 'slick-btn slick-btn-default', textContent: 'Complete' }, containerButtons);

      input.focus();
      input.select();

      slider = picker.querySelector('input.editor-percentcomplete-slider');
      slider.value = defaultValue;

      slider.addEventListener('input', sliderInputHandler);
      slider.addEventListener('change', sliderChangeHandler);

      const buttons = picker.querySelectorAll(".editor-percentcomplete-buttons button");
      [].forEach.call(buttons, (button) => {
        button.addEventListener("click", this.onClick);
      });
    };

    this.onClick = function () {
      input.value = this.getAttribute("val");
      slider.value = this.getAttribute("val");
    };

    this.destroy = function () {
      slider.removeEventListener('input', sliderInputHandler);
      slider.removeEventListener('change', sliderChangeHandler);
      picker.querySelectorAll(".editor-percentcomplete-buttons button")
        .forEach(button => button.removeEventListener("click", this.onClick));
      input.remove();
      picker.remove();
    };

    this.focus = function () {
      input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      slider.value = defaultValue;
      input.value = defaultValue;
      input.select();
    };

    this.serializeValue = function () {
      return parseInt(input.value, 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && ((parseInt(input.value, 10) || 0) != defaultValue);
    };

    this.validate = function () {
      if (isNaN(parseInt(input.value, 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * An example of a "detached" editor.
   * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
   * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
   */
export function LongTextEditor(args) {
    var input, wrapper;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      var compositeEditorOptions = args.compositeEditorOptions;
      args.grid.getOptions().editorCellNavOnLRKeys;
      var container = compositeEditorOptions ? args.container : document.body;

      wrapper = Utils.createDomElement('div', { className: 'slick-large-editor-text' }, container);
      if (compositeEditorOptions) {
        wrapper.style.position = 'relative';
        Utils.setStyleSize(wrapper, "padding", 0);
        Utils.setStyleSize(wrapper, "border", 0);
      } else {
        wrapper.style.position = 'absolute';
      }

      input = Utils.createDomElement('textarea', { rows: 5, style: { background: 'white', width: '250px', height: '80px', border: '0', outline: '0' } }, wrapper);

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (compositeEditorOptions) {
        input.addEventListener("change", this.onChange);
      } else {
        const btnContainer = Utils.createDomElement('div', { style: 'text-align:right' }, wrapper);
        Utils.createDomElement('button', { id: 'save', className: 'slick-btn slick-btn-primary', textContent: 'Save' }, btnContainer);
        Utils.createDomElement('button', { id: 'cancel', className: 'slick-btn slick-btn-default', textContent: 'Cancel' }, btnContainer);

        wrapper.querySelector("#save").addEventListener("click", this.save);
        wrapper.querySelector("#cancel").addEventListener("click", this.cancel);
        input.addEventListener("keydown", this.handleKeyDown);
        scope.position(args.position);
      }

      input.focus();
      input.select();
    };

    this.onChange = function () {
      var activeCell = args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (scope.validate().valid) {
        scope.applyValue(scope.args.item, scope.serializeValue());
      }
      scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
      args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    };

    this.handleKeyDown = function (e) {
      if (e.which == keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      } else if (e.which == keyCode.LEFT || e.which == keyCode.RIGHT) {
        if (args.grid.getOptions().editorCellNavOnLRKeys) {
          var cursorPosition = this.selectionStart;
          var textLength = this.value.length;
          if (e.keyCode === keyCode.LEFT && cursorPosition === 0) {
            args.grid.navigatePrev();
          }
          if (e.keyCode === keyCode.RIGHT && cursorPosition >= textLength - 1) {
            args.grid.navigateNext();
          }
        }
      }
    };

    this.save = function () {
      const gridOptions = args.grid.getOptions() || {};
      if (gridOptions.autoCommitEdit) {
        args.grid.getEditorLock().commitCurrentEdit();
      } else {
        args.commitChanges();
      }
    };

    this.cancel = function () {
      input.value = defaultValue;
      args.cancelChanges();
    };

    this.hide = function () {
      Utils.hide(wrapper);
    };

    this.show = function () {
      Utils.show(wrapper);
    };

    this.position = function (position) {
      Utils.setStyleSize(wrapper, "top", position.top - 5);
      Utils.setStyleSize(wrapper, "left", position.left - 2);
    };

    this.destroy = function () {
      if (args.compositeEditorOptions) {
        input.removeEventListener("change", this.onChange);
      } else {
        wrapper.querySelector("#save").removeEventListener("click", this.save);
        wrapper.querySelector("#cancel").removeEventListener("click", this.cancel);
        input.removeEventListener("keydown", this.handleKeyDown);
      }
      wrapper.remove();
    };

    this.focus = function () {
      input.focus();
    };

    this.loadValue = function (item) {
      input.value = defaultValue = item[args.column.field];
      input.select();
    };

    this.serializeValue = function () {
      return input.value;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!(input.value === "" && defaultValue == null)) && (input.value != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator(input.value, args);
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * Depending on the value of Grid option 'editorCellNavOnLRKeys', us
   * Navigate to the cell on the left if the cursor is at the beginning of the input string
   * and to the right cell if it's at the end. Otherwise, move the cursor within the text
   */
  function handleKeydownLRNav(e) {
    var cursorPosition = this.selectionStart;
    var textLength = this.value.length;
    if ((e.keyCode === keyCode.LEFT && cursorPosition > 0) ||
      e.keyCode === keyCode.RIGHT && cursorPosition < textLength - 1) {
      e.stopImmediatePropagation();
    }
  }

  function handleKeydownLRNoNav(e) {
    if (e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) {
      e.stopImmediatePropagation();
    }
  }

export const Editors = {
  Text: TextEditor,
  Integer: IntegerEditor,
  Float: FloatEditor,
  Flatpickr: FlatpickrEditor,
  YesNoSelect: YesNoSelectEditor,
  Checkbox: CheckboxEditor,
  PercentComplete: PercentCompleteEditor,
  LongText: LongTextEditor
};

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Editors
  });
}

