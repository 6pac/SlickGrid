import type { Editor, EditorArguments, EditorValidationResult, ElementPosition } from './models/index';
import { keyCode as keyCode_, Utils as Utils_ } from './slick.core';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const keyCode = IIFE_ONLY ? Slick.keyCode : keyCode_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

export class TextEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: number | string;
  protected navOnLR?: boolean;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys;
    this.input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, this.args.container);
    this.input.addEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.focus();
    this.input.select();

    // don't show Save/Cancel when it's a Composite Editor and also trigger a onCompositeEditorChange event when input changes
    if (this.args.compositeEditorOptions) {
      this.input.addEventListener('change', this.onChange.bind(this));
    }
  }

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }

  destroy() {
    this.input.removeEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.removeEventListener('change', this.onChange.bind(this))
    this.input.remove();
  }

  focus() {
    this.input.focus();
  }

  getValue() {
    return this.input.value;
  }

  setValue(val: string) {
    this.input.value = val;
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field] || '';
    this.input.value = String(this.defaultValue ?? '');
    this.input.defaultValue = String(this.defaultValue ?? '');
    this.input.select();
  }

  serializeValue() {
    return this.input.value;
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && (this.input.value != this.defaultValue);
  }

  validate() {
    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    return {
      valid: true,
      msg: null
    };
  }
}

export class IntegerEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: string | number;
  protected navOnLR?: boolean;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys;
    this.input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, this.args.container);
    this.input.addEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.focus()
    this.input.select();

    // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
    if (this.args.compositeEditorOptions) {
      this.input.addEventListener('change', this.onChange.bind(this));
    }
  }

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }

  destroy() {
    this.input.removeEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.removeEventListener('change', this.onChange.bind(this))
    this.input.remove();
  }

  focus() {
    this.input.focus();
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field];
    this.input.value = String(this.defaultValue ?? '');
    this.input.defaultValue = String(this.defaultValue ?? '');
    this.input.select();
  }

  serializeValue() {
    return parseInt(this.input.value, 10) || 0;
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && (this.input.value != this.defaultValue);
  }

  validate() {
    if (isNaN(this.input.value as unknown as number)) {
      return {
        valid: false,
        msg: 'Please enter a valid integer'
      };
    }

    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    return {
      valid: true,
      msg: null
    };
  }
}

export class FloatEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: string | number;
  protected navOnLR?: boolean;

  /** Default number of decimal places to use with FloatEditor */
  static DefaultDecimalPlaces?: number = undefined;

  /** Should we allow empty value when using FloatEditor */
  static AllowEmptyValue = false;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys;
    this.input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, this.args.container);
    this.input.addEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.focus()
    this.input.select();

    // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
    if (this.args.compositeEditorOptions) {
      this.input.addEventListener('change', this.onChange.bind(this));
    }
  };

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  };

  destroy() {
    this.input.removeEventListener('keydown', (this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav) as EventListener);
    this.input.removeEventListener('change', this.onChange.bind(this))
    this.input.remove();
  };

  focus() {
    this.input.focus();
  }

  getDecimalPlaces() {
    // returns the number of fixed decimal places or null
    let rtn: number | undefined = this.args.column.editorFixedDecimalPlaces;
    if (typeof rtn == 'undefined') {
      rtn = FloatEditor.DefaultDecimalPlaces;
    }
    return (!rtn && rtn !== 0 ? null : rtn);
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field];

    const decPlaces = this.getDecimalPlaces();
    if (decPlaces !== null
      && (this.defaultValue || this.defaultValue === 0)
      && (this.defaultValue as number)?.toFixed) {
      this.defaultValue = (this.defaultValue as number).toFixed(decPlaces);
    }

    this.input.value = String(this.defaultValue ?? '');
    this.input.defaultValue = String(this.defaultValue ?? '');
    this.input.select();
  }

  serializeValue() {
    let rtn: number | undefined = parseFloat(this.input.value);
    if (FloatEditor.AllowEmptyValue) {
      if (!rtn && rtn !== 0) {
        rtn = undefined;
      }
    } else {
      rtn = rtn || 0;
    }

    const decPlaces = this.getDecimalPlaces();
    if (decPlaces !== null
      && (rtn || rtn === 0)
      && rtn.toFixed) {
      rtn = parseFloat(rtn.toFixed(decPlaces));
    }

    return rtn as number;
  }

  applyValue(item: any, state: number | string) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && (this.input.value != this.defaultValue);
  }

  validate() {
    if (isNaN(this.input.value as unknown as number)) {
      return {
        valid: false,
        msg: 'Please enter a valid number'
      };
    }

    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    return {
      valid: true,
      msg: null
    };
  }
}

export class FlatpickrEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: string | number;
  protected flatpickrInstance: any;

  constructor(protected readonly args: EditorArguments) {
    this.init();
    if (typeof flatpickr === 'undefined') {
      throw new Error('Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/');
    }
  }

  init() {
    this.input = Utils.createDomElement('input', { type: 'text', className: 'editor-text' }, this.args.container);
    this.input.focus();
    this.input.select();
    this.flatpickrInstance = flatpickr(this.input, {
      closeOnSelect: true,
      allowInput: true,
      altInput: true,
      altFormat: 'm/d/Y',
      dateFormat: 'm/d/Y',
      onChange: () => {
        // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
        if (this.args.compositeEditorOptions) {
          const activeCell = this.args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (this.validate().valid) {
            this.applyValue(this.args.item, this.serializeValue());
          }
          this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
          this.args.grid.onCompositeEditorChange.notify({
            row: activeCell?.row ?? 0,
            cell: activeCell?.cell ?? 0,
            item: this.args.item,
            column: this.args.column,
            formValues: this.args.compositeEditorOptions.formValues,
            grid: this.args.grid,
            editors: this.args.compositeEditorOptions.editors
          });
        }
      },
    });

    if (!this.args.compositeEditorOptions) {
      setTimeout(() => {
        this.show();
        this.focus();
      }, 50);
    }

    Utils.width(this.input, (Utils.width(this.input) as number) - (!this.args.compositeEditorOptions ? 18 : 28));
  }

  destroy() {
    this.hide();
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
    this.input.remove();
  }

  show() {
    if (!this.args.compositeEditorOptions && this.flatpickrInstance) {
      this.flatpickrInstance.open();
    }
  }

  hide() {
    if (!this.args.compositeEditorOptions && this.flatpickrInstance) {
      this.flatpickrInstance.close();
    }
  }

  focus() {
    this.input.focus();
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field];
    this.input.value = String(this.defaultValue ?? '');
    this.input.defaultValue = String(this.defaultValue ?? '');
    this.input.select();
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.defaultValue);
    }
  }

  serializeValue() {
    return this.input.value;
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && (this.input.value != this.defaultValue);
  }

  validate() {
    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    return {
      valid: true,
      msg: null
    };
  }
}

export class YesNoSelectEditor implements Editor {
  protected select!: HTMLSelectElement;
  protected defaultValue?: string | number;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    this.select = Utils.createDomElement('select', { tabIndex: 0, className: 'editor-yesno' }, this.args.container);
    Utils.createDomElement('option', { value: 'yes', textContent: 'Yes' }, this.select);
    Utils.createDomElement('option', { value: 'no', textContent: 'No' }, this.select);

    this.select.focus();

    // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
    if (this.args.compositeEditorOptions) {
      this.select.addEventListener('change', this.onChange.bind(this));
    }
  }

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }

  destroy() {
    this.select.removeEventListener('change', this.onChange.bind(this))
    this.select.remove();
  }

  focus() {
    this.select.focus();
  }

  loadValue(item: any) {
    this.select.value = ((this.defaultValue = item[this.args.column.field]) ? 'yes' : 'no');
  }

  serializeValue() {
    return this.select.value == 'yes';
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return this.select.value != this.defaultValue;
  }

  validate() {
    return {
      valid: true,
      msg: null
    };
  }
}

export class CheckboxEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: boolean;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    this.input = Utils.createDomElement('input', { className: 'editor-checkbox', type: 'checkbox', value: 'true' }, this.args.container);
    this.input.focus();

    // trigger onCompositeEditorChange event when input checkbox changes and it's a Composite Editor
    if (this.args.compositeEditorOptions) {
      this.input.addEventListener('change', this.onChange.bind(this));
    }
  };

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  };

  destroy() {
    this.input.removeEventListener('change', this.onChange.bind(this));
    this.input.remove();
  };

  focus() {
    this.input.focus();
  };

  loadValue(item: any) {
    this.defaultValue = !!(item[this.args.column.field]);
    if (this.defaultValue) {
      this.input.checked = true;
    } else {
      this.input.checked = false;
    }
  };

  serializeValue() {
    return this.input.checked;
  };

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (this.serializeValue() !== this.defaultValue);
  }

  validate(): EditorValidationResult {
    return {
      valid: true,
      msg: null
    };
  }
}

export class PercentCompleteEditor implements Editor {
  protected input!: HTMLInputElement;
  protected defaultValue?: number;
  protected picker!: HTMLDivElement;
  protected slider!: HTMLInputElement | null;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  sliderInputHandler(e: MouseEvent & { target: HTMLButtonElement }) {
    this.input.value = e.target.value;
  }

  sliderChangeHandler() {
    // trigger onCompositeEditorChange event when slider stops and it's a Composite Editor
    if (this.args.compositeEditorOptions) {
      const activeCell = this.args.grid.getActiveCell();

      // when valid, we'll also apply the new value to the dataContext item object
      if (this.validate().valid) {
        this.applyValue(this.args.item, this.serializeValue());
      }
      this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
      this.args.grid.onCompositeEditorChange.notify({
        row: activeCell?.row ?? 0,
        cell: activeCell?.cell ?? 0,
        item: this.args.item,
        column: this.args.column,
        formValues: this.args.compositeEditorOptions.formValues,
        grid: this.args.grid,
        editors: this.args.compositeEditorOptions.editors
      });
    }
  }

  init() {
    this.input = Utils.createDomElement('input', { className: 'editor-percentcomplete', type: 'text' }, this.args.container);
    Utils.width(this.input, this.args.container.clientWidth - 25);

    this.picker = Utils.createDomElement('div', { className: 'editor-percentcomplete-picker' }, this.args.container);
    Utils.createDomElement('span', { className: 'editor-percentcomplete-picker-icon' }, this.picker);
    const containerHelper = Utils.createDomElement('div', { className: 'editor-percentcomplete-helper' }, this.picker);
    const containerWrapper = Utils.createDomElement('div', { className: 'editor-percentcomplete-wrapper' }, containerHelper);
    Utils.createDomElement('div', { className: 'editor-percentcomplete-slider' }, containerWrapper);
    this.slider = Utils.createDomElement('input', { className: 'editor-percentcomplete-slider', type: 'range', value: String(this.defaultValue ?? '') }, containerWrapper);
    const containerButtons = Utils.createDomElement('div', { className: 'editor-percentcomplete-buttons' }, containerWrapper);
    Utils.createDomElement('button', { value: '0', className: 'slick-btn slick-btn-default', textContent: 'Not started' }, containerButtons);
    containerButtons.appendChild(document.createElement('br'));
    Utils.createDomElement('button', { value: '50', className: 'slick-btn slick-btn-default', textContent: 'In Progress' }, containerButtons);
    containerButtons.appendChild(document.createElement('br'));
    Utils.createDomElement('button', { value: '100', className: 'slick-btn slick-btn-default', textContent: 'Complete' }, containerButtons);

    this.input.focus();
    this.input.select();

    this.slider.addEventListener('input', this.sliderInputHandler.bind(this) as EventListener);
    this.slider.addEventListener('change', this.sliderChangeHandler.bind(this));

    const buttons = this.picker.querySelectorAll('.editor-percentcomplete-buttons button');
    [].forEach.call(buttons, (button: HTMLButtonElement) => {
      button.addEventListener('click', this.onClick.bind(this) as EventListener);
    });
  };

  onClick(e: MouseEvent & { target: HTMLButtonElement }) {
    this.input.value = String(e.target.value ?? '');
    this.slider!.value = String(e.target.value ?? '');
  };

  destroy() {
    this.slider?.removeEventListener('input', this.sliderInputHandler.bind(this) as EventListener);
    this.slider?.removeEventListener('change', this.sliderChangeHandler.bind(this));
    this.picker.querySelectorAll('.editor-percentcomplete-buttons button')
      .forEach(button => button.removeEventListener('click', this.onClick.bind(this) as EventListener));
    this.input.remove();
    this.picker.remove();
  };

  focus() {
    this.input.focus();
  };

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field];
    this.slider!.value = String(this.defaultValue ?? '');
    this.input.value = String(this.defaultValue);
    this.input.select();
  };

  serializeValue() {
    return parseInt(this.input.value, 10) || 0;
  };

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  };

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && ((parseInt(this.input.value as any, 10) || 0) != this.defaultValue);
  };

  validate(): EditorValidationResult {
    if (isNaN(parseInt(this.input.value, 10))) {
      return {
        valid: false,
        msg: 'Please enter a valid positive number'
      };
    }

    return {
      valid: true,
      msg: null
    };
  };
}

/*
 * An example of a 'detached' editor.
 * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class LongTextEditor implements Editor {
  protected input!: HTMLTextAreaElement;
  protected wrapper!: HTMLDivElement;
  protected defaultValue?: string;
  protected selectionStart = 0;

  constructor(protected readonly args: EditorArguments) {
    this.init();
  }

  init() {
    const compositeEditorOptions = this.args.compositeEditorOptions;
    this.args.grid.getOptions().editorCellNavOnLRKeys;
    const container = compositeEditorOptions ? this.args.container : document.body;

    this.wrapper = Utils.createDomElement('div', { className: 'slick-large-editor-text' }, container);
    if (compositeEditorOptions) {
      this.wrapper.style.position = 'relative';
      Utils.setStyleSize(this.wrapper, 'padding', 0);
      Utils.setStyleSize(this.wrapper, 'border', 0);
    } else {
      this.wrapper.style.position = 'absolute';
    }

    this.input = Utils.createDomElement('textarea', { rows: 5, style: { background: 'white', width: '250px', height: '80px', border: '0', outline: '0' } }, this.wrapper);

    // trigger onCompositeEditorChange event when input changes and it's a Composite Editor
    if (compositeEditorOptions) {
      this.input.addEventListener('change', this.onChange.bind(this));
    } else {
      const btnContainer = Utils.createDomElement('div', { style: 'text-align:right' }, this.wrapper);
      Utils.createDomElement('button', { id: 'save', className: 'slick-btn slick-btn-primary', textContent: 'Save' }, btnContainer);
      Utils.createDomElement('button', { id: 'cancel', className: 'slick-btn slick-btn-default', textContent: 'Cancel' }, btnContainer);

      this.wrapper.querySelector('#save')!.addEventListener('click', this.save.bind(this));
      this.wrapper.querySelector('#cancel')!.addEventListener('click', this.cancel.bind(this));
      this.input.addEventListener('keydown', this.handleKeyDown.bind(this) as EventListener);
      this.position(this.args.position as ElementPosition);
    }

    this.input.focus();
    this.input.select();
  };

  onChange() {
    const activeCell = this.args.grid.getActiveCell();

    // when valid, we'll also apply the new value to the dataContext item object
    if (this.validate().valid) {
      this.applyValue(this.args.item, this.serializeValue());
    }
    this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue());
    this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  };

  handleKeyDown(e: KeyboardEvent & { target: HTMLInputElement }) {
    if (e.which == keyCode.ENTER && e.ctrlKey) {
      this.save();
    } else if (e.which == keyCode.ESCAPE) {
      e.preventDefault();
      this.cancel();
    } else if (e.which == keyCode.TAB && e.shiftKey) {
      e.preventDefault();
      this.args.grid.navigatePrev();
    } else if (e.which == keyCode.TAB) {
      e.preventDefault();
      this.args.grid.navigateNext();
    } else if (e.which == keyCode.LEFT || e.which == keyCode.RIGHT) {
      if (this.args.grid.getOptions().editorCellNavOnLRKeys) {
        const cursorPosition = this.selectionStart;
        const textLength = e.target.value.length;
        if (e.keyCode === keyCode.LEFT && cursorPosition === 0) {
          this.args.grid.navigatePrev();
        }
        if (e.keyCode === keyCode.RIGHT && cursorPosition >= textLength - 1) {
          this.args.grid.navigateNext();
        }
      }
    }
  };

  save() {
    const gridOptions = this.args.grid.getOptions() || {};
    if (gridOptions.autoCommitEdit) {
      this.args.grid.getEditorLock().commitCurrentEdit();
    } else {
      this.args.commitChanges();
    }
  };

  cancel() {
    this.input.value = String(this.defaultValue ?? '');
    this.args.cancelChanges();
  };

  hide() {
    Utils.hide(this.wrapper);
  };

  show() {
    Utils.show(this.wrapper);
  };

  position(position: ElementPosition) {
    Utils.setStyleSize(this.wrapper, 'top', (position.top || 0) - 5);
    Utils.setStyleSize(this.wrapper, 'left', (position.left || 0) - 2);
  };

  destroy() {
    if (this.args.compositeEditorOptions) {
      this.input.removeEventListener('change', this.onChange.bind(this));
    } else {
      this.wrapper.querySelector('#save')!.removeEventListener('click', this.save.bind(this));
      this.wrapper.querySelector('#cancel')!.removeEventListener('click', this.cancel.bind(this));
      this.input.removeEventListener('keydown', this.handleKeyDown.bind(this) as EventListener);
    }
    this.wrapper.remove();
  };

  focus() {
    this.input.focus();
  };

  loadValue(item: any) {
    this.input.value = this.defaultValue = item[this.args.column.field];
    this.input.select();
  };

  serializeValue() {
    return this.input.value;
  };

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  };

  isValueChanged() {
    return (!(this.input.value === '' && this.defaultValue == null)) && (this.input.value != this.defaultValue);
  };

  validate() {
    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    }

    return {
      valid: true,
      msg: null
    };
  };
}

/*
 * Depending on the value of Grid option 'editorCellNavOnLRKeys', us
 * Navigate to the cell on the left if the cursor is at the beginning of the input string
 * and to the right cell if it's at the end. Otherwise, move the cursor within the text
 */
function handleKeydownLRNav(e: KeyboardEvent & { target: HTMLInputElement; selectionStart: number; }) {
  const cursorPosition = e.selectionStart;
  const textLength = e.target.value.length;
  if ((e.keyCode === keyCode.LEFT && cursorPosition > 0) ||
    e.keyCode === keyCode.RIGHT && cursorPosition < textLength - 1) {
    e.stopImmediatePropagation();
  }
}

function handleKeydownLRNoNav(e: KeyboardEvent) {
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

