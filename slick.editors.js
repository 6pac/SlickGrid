/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function () {

  const utils = Slick.Utils;

  function TextEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    var navOnLR;
    this.args = args;

    this.init = function () {
      navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = utils.template("<input type=text class='editor-text' />", args.container);
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
    }
    
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

  function IntegerEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      var navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = utils.template("<input type=text class='editor-text' />", args.container);
      input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.focus()
      input.select();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        input.addEventListener("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      }
    };

    this.destroy = function () {
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

  function FloatEditor(args) {
    var input;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      var navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      input = utils.template("<input type=text class='editor-text' />", args.container);
      input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav);
      input.focus()
      input.select();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        input.addEventListener("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      }
    };

    this.destroy = function () {
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

  function FlatpickrEditor(args) {
    if (typeof flatpickr === 'undefined') {
      throw new Error('Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/');
    }

    var input;
    var defaultValue;
    var scope = this;
    this.args = args;
    var flatpickrInstance;

    this.init = function () {
      input = utils.template('<input type=text class="editor-text" />', args.container);
      input.focus();
      input.select();
      flatpickrInstance = flatpickr(input, {
        closeOnSelect: true,
        allowInput: true,
        altInput: true,
        altFormat: "m/d/Y",
        dateFormat: 'm/d/Y',
        onChange: (e, r) => {
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

      utils.width(input, utils.width(input) - (!args.compositeEditorOptions ? 18 : 28));
    };

    this.destroy = function () {
      scope.hide();
      flatpickrInstance.destroy();
      input.remove();
    };

    this.show = function () {
      if (!args.compositeEditorOptions) {
        flatpickrInstance.open();
      }
    };

    this.hide = function () {
      if (!args.compositeEditorOptions) {
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
      flatpickrInstance.setDate(defaultValue);
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

  function YesNoSelectEditor(args) {
    var select;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      select = utils.template("<select tabIndex='0' class='editor-yesno'><option value='yes'>Yes</option><option value='no'>No</option></select>", args.container);
      select.focus();

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        select.addEventListener("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      }
    };

    this.destroy = function () {
      select.remove();
    };

    this.focus = function () {
      select.focus();
    };

    this.loadValue = function (item) {
      select.value = ((defaultValue = item[args.column.field]) ? "yes" : "no");
      select.select();
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

  function CheckboxEditor(args) {
    var select;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      select = utils.template("<input type=checkbox value='true' class='editor-checkbox' hideFocus>", args.container);
      select.focus();

      // trigger onCompositeEditorChange event when input checkbox changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        select.addEventListener("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      }
    };

    this.destroy = function () {
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

  function PercentCompleteEditor(args) {
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
      input = utils.template('<input type="text" class="editor-percentcomplete" />', args.container);
      utils.width(input, args.container.clientWidth - 25);

      picker = utils.template("<div class='editor-percentcomplete-picker' />", args.container);
      utils.template("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><input type='range' class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /><button val='0'>Not started</button><br/><button val='50'>In Progress</button><br/><button val='100'>Complete</button></div></div>", picker);
      input.focus();
      input.select();

      slider = picker.querySelector('input.editor-percentcomplete-slider');
      slider.value = defaultValue;

      slider.addEventListener('input', sliderInputHandler);
      slider.addEventListener('change', sliderChangeHandler);

      const buttons = picker.querySelectorAll(".editor-percentcomplete-buttons button");
      [].forEach.call(buttons, (button) => {
        button.addEventListener("click", function (e) {
          input.value = this.getAttribute("val");
          slider.value = this.getAttribute("val");
        });
      });
    };

    this.destroy = function () {
      slider.removeEventListener('input', sliderInputHandler);
      slider.removeEventListener('change', sliderChangeHandler);
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
  function LongTextEditor(args) {
    var input, wrapper;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      var compositeEditorOptions = args.compositeEditorOptions;
      var navOnLR = args.grid.getOptions().editorCellNavOnLRKeys;
      var container = compositeEditorOptions ? args.container : document.body;

      wrapper = utils.template("<div class='slick-large-editor-text' style='z-index:10000;background:white;padding:5px;border:3px solid gray; border-radius:10px;'/>", container);
      if (compositeEditorOptions) {
        wrapper.style.position = 'relative';
        utils.setStyleSize(wrapper, "padding", 0);
        utils.setStyleSize(wrapper, "border", 0);
      } else {
        wrapper.style.position = 'absolute';
      }

      input = utils.template("<textarea hidefocus rows=5 style='background:white;width:250px;height:80px;border:0;outline:0'>", wrapper);

      // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
      if (compositeEditorOptions) {
        input.addEventListener("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      } else {
        utils.template("<div style='text-align:right'><button id='save'>Save</button><button id='cancel'>Cancel</button></div>", wrapper);

        wrapper.querySelector("#save").addEventListener("click", this.save);
        wrapper.querySelector("#cancel").addEventListener("click", this.cancel);
        input.addEventListener("keydown", this.handleKeyDown);
        scope.position(args.position);
      }

      input.focus();
      input.select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == Slick.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == Slick.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == Slick.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == Slick.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      } else if (e.which == Slick.keyCode.LEFT || e.which == Slick.keyCode.RIGHT) {
        if (args.grid.getOptions().editorCellNavOnLRKeys) {
          var cursorPosition = this.selectionStart;
          var textLength = this.value.length;
          if (e.keyCode === Slick.keyCode.LEFT && cursorPosition === 0) {
            args.grid.navigatePrev();
          }
          if (e.keyCode === Slick.keyCode.RIGHT && cursorPosition >= textLength - 1) {
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
      utils.hide(wrapper);
    };

    this.show = function () {
      utils.show(wrapper);
    };

    this.position = function (position) {
      utils.setStyleSize(wrapper, "top", position.top - 5);
      utils.setStyleSize(wrapper, "left", position.left - 2);
    };

    this.destroy = function () {
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
    if ((e.keyCode === Slick.keyCode.LEFT && cursorPosition > 0) ||
      e.keyCode === Slick.keyCode.RIGHT && cursorPosition < textLength - 1) {
      e.stopImmediatePropagation();
    }
  }

  function handleKeydownLRNoNav(e) {
    if (e.keyCode === Slick.keyCode.LEFT || e.keyCode === Slick.keyCode.RIGHT) {
      e.stopImmediatePropagation();
    }
  }

  // exports
  utils.extend(true, window, {
    "Slick": {
      "Editors": {
        "Text": TextEditor,
        "Integer": IntegerEditor,
        "Float": FloatEditor,
        "Flatpickr": FlatpickrEditor,
        "YesNoSelect": YesNoSelectEditor,
        "Checkbox": CheckboxEditor,
        "PercentComplete": PercentCompleteEditor,
        "LongText": LongTextEditor
      }
    }
  });
})();
