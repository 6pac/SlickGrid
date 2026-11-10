import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckboxEditor, Editors, FlatpickrEditor, FloatEditor, IntegerEditor, LongTextEditor, PercentCompleteEditor, TextEditor, YesNoSelectEditor } from '../slick.editors';

describe('SlickGrid editors', () => {
  let container: HTMLDivElement;
  let args: any;
  let editor: any;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    args = { container, column: { id: 'value', field: 'value' }, grid: { getOptions: () => ({}), getActiveCell: () => ({ row: 1, cell: 2 }), onCompositeEditorChange: { notify: vi.fn() } }, item: { value: '' } };
  });

  afterEach(() => {
    editor?.destroy();
    editor = undefined;
    container.remove();
    FloatEditor.AllowEmptyValue = false;
    FloatEditor.DefaultDecimalPlaces = undefined;
  });

  it('loads, edits, validates, and applies text', () => {
    args.column.validator = (value: string) => value ? { valid: true } : { valid: false, msg: 'Required' };
    editor = new TextEditor(args);
    editor.loadValue({ value: 'old' });
    expect(editor.isValueChanged()).toBe(false);
    const input = container.querySelector<HTMLInputElement>('input')!;
    input.value = '';
    expect(editor.validate()).toEqual({ valid: false, msg: 'Required' });
    input.value = 'new';
    expect(editor.isValueChanged()).toBe(true);
    expect(editor.validate()).toEqual({ valid: true, msg: null });
    editor.applyValue(args.item, editor.serializeValue());
    expect(args.item.value).toBe('new');
  });

  it('names an editor after a plain column title without asking the grid to render it', () => {
    args.column.name = 'Value';
    editor = new TextEditor(args);

    expect(container.querySelector('input')?.getAttribute('aria-label')).toBe('Value');
  });

  it('puts the accessible name on the input that Flatpickr shows in place of the original one', () => {
    const altInput = document.createElement('input');
    vi.stubGlobal('flatpickr', vi.fn(() => ({ altInput, close: vi.fn(), destroy: vi.fn(), open: vi.fn(), setDate: vi.fn() })));
    vi.useFakeTimers();
    args.column.name = 'Start';

    try {
      editor = new FlatpickrEditor(args);

      expect(altInput.getAttribute('aria-label')).toBe('Start');
    } finally {
      editor?.destroy();
      editor = undefined;
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

  it('validates integer input and serializes valid values', () => {
    editor = new IntegerEditor(args);
    editor.loadValue({ value: 12 });
    const input = container.querySelector<HTMLInputElement>('input')!;
    input.value = 'not a number';
    expect(editor.validate()).toEqual({ valid: false, msg: 'Please enter a valid integer' });
    input.value = '42';
    expect(editor.serializeValue()).toBe(42);
    editor.applyValue(args.item, editor.serializeValue());
    expect(args.item.value).toBe(42);
  });

  it('rounds float values with column precision and supports empty values', () => {
    args.column.editorFixedDecimalPlaces = 2;
    editor = new FloatEditor(args);
    editor.loadValue({ value: 1.234 });
    const input = container.querySelector<HTMLInputElement>('input')!;
    expect(input.value).toBe('1.23');
    input.value = '9.876';
    expect(editor.serializeValue()).toBe(9.88);
    input.value = 'invalid';
    expect(editor.validate().valid).toBe(false);
    FloatEditor.AllowEmptyValue = true;
    input.value = '';
    expect(editor.serializeValue()).toBeUndefined();
  });

  it('edits yes/no and checkbox values', () => {
    editor = new YesNoSelectEditor(args);
    editor.loadValue({ value: true });
    expect(editor.serializeValue()).toBe(true);
    container.querySelector('select')!.value = 'no';
    editor.applyValue(args.item, editor.serializeValue());
    expect(args.item.value).toBe(false);
    editor.destroy();
    editor = new CheckboxEditor(args);
    editor.loadValue({ value: false });
    editor.preClick();
    expect(editor.isValueChanged()).toBe(true);
    editor.applyValue(args.item, editor.serializeValue());
    expect(args.item.value).toBe(true);
  });

  it('keeps percentage controls in sync and validates input', () => {
    editor = new PercentCompleteEditor(args);
    editor.loadValue({ value: 20 });
    const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
    container.querySelector<HTMLButtonElement>('button[value="50"]')!.click();
    expect(input.value).toBe('50');
    expect(editor.serializeValue()).toBe(50);
    input.value = 'invalid';
    expect(editor.validate().valid).toBe(false);
  });

  it('publishes a composite editor change with the edited value', () => {
    args.compositeEditorOptions = { formValues: {}, editors: [] };
    editor = new TextEditor(args);
    const input = container.querySelector<HTMLInputElement>('input')!;
    input.value = 'updated';
    input.dispatchEvent(new Event('change'));
    expect(args.item.value).toBe('updated');
    expect(args.compositeEditorOptions.formValues.value).toBe('updated');
    expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 1, cell: 2, column: args.column }));
  });
  const keydown = (target: EventTarget, init: KeyboardEventInit & { which?: number }) => {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
    if (init.which !== undefined) {
      Object.defineProperty(event, 'which', { value: init.which });
    }
    target.dispatchEvent(event);
    return event;
  };

  describe('editor accessible names', () => {
    it('prefers an explicit editorAriaLabel over the column name', () => {
      args.column.name = 'Value';
      args.column.editorAriaLabel = 'Edit the value';
      editor = new TextEditor(args);

      expect(container.querySelector('input')!.getAttribute('aria-label')).toBe('Edit the value');
    });

    it('renders an HTML column title through the grid and keeps its text only', () => {
      args.column.name = '<b>Due</b> &amp; date';
      args.grid.applyHtmlCode = vi.fn((target: HTMLElement, html: string) => { target.innerHTML = html; });
      editor = new IntegerEditor(args);

      expect(args.grid.applyHtmlCode).toHaveBeenCalledWith(expect.any(HTMLSpanElement), args.column.name);
      expect(container.querySelector('input')!.getAttribute('aria-label')).toBe('Due & date');
    });

    it('uses the raw HTML title when the grid cannot render it', () => {
      args.column.name = 'A & B';
      editor = new FloatEditor(args);

      expect(container.querySelector('input')!.getAttribute('aria-label')).toBe('A & B');
    });

    it('reads the text of an element column title', () => {
      const title = document.createElement('span');
      title.textContent = '  Done  ';
      args.column.name = title;
      editor = new CheckboxEditor(args);

      expect(container.querySelector('input')!.getAttribute('aria-label')).toBe('Done');
    });

    it('falls back to the column id when the title is missing or blank', () => {
      editor = new YesNoSelectEditor(args);
      expect(container.querySelector('select')!.getAttribute('aria-label')).toBe('value');
      editor.destroy();

      args.column.name = '   ';
      editor = new PercentCompleteEditor(args);
      expect(container.querySelector('.editor-percentcomplete')!.getAttribute('aria-label')).toBe('value');
      expect(container.querySelector('input[type="range"]')!.getAttribute('aria-label')).toBe('value');
    });
  });

  describe('left/right key handling of text inputs', () => {
    it('keeps left and right arrows inside the input when cell navigation on those keys is off', () => {
      editor = new TextEditor(args);
      const input = container.querySelector('input')!;
      const outer = vi.fn();
      container.addEventListener('keydown', outer);

      keydown(input, { keyCode: 37 });
      keydown(input, { keyCode: 39 });
      expect(outer).not.toHaveBeenCalled();

      keydown(input, { keyCode: 40 });
      expect(outer).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['integer', IntegerEditor],
      ['float', FloatEditor],
    ])('lets the %s editor stop left and right arrows from reaching the grid', (_name, EditorClass: any) => {
      editor = new EditorClass(args);
      const outer = vi.fn();
      container.addEventListener('keydown', outer);

      keydown(container.querySelector('input')!, { keyCode: 37 });
      expect(outer).not.toHaveBeenCalled();
    });

    it('lets other keys reach the grid when cell navigation on left/right keys is on', () => {
      args.grid.getOptions = () => ({ editorCellNavOnLRKeys: true });
      editor = new TextEditor(args);
      const input = container.querySelector('input')!;
      const outer = vi.fn();
      container.addEventListener('keydown', outer);

      keydown(input, { keyCode: 13 });
      expect(outer).toHaveBeenCalledTimes(1);
    });
  });

  describe('TextEditor', () => {
    it('reports no change for an untouched empty editor and exposes getValue/setValue', () => {
      editor = new TextEditor(args);
      editor.loadValue({});
      expect(editor.isValueChanged()).toBe(false);

      editor.setValue('typed');
      expect(editor.getValue()).toBe('typed');
      expect(editor.isValueChanged()).toBe(true);
    });

    it('focuses its input and removes it on destroy', () => {
      editor = new TextEditor(args);
      const input = container.querySelector('input')!;
      input.blur();
      editor.focus();
      expect(document.activeElement).toBe(input);

      editor.destroy();
      expect(container.querySelector('input')).toBeNull();
      editor = undefined;
    });

    it('passes the editor arguments to the column validator', () => {
      args.column.validator = vi.fn(() => ({ valid: true }));
      editor = new TextEditor(args);
      container.querySelector('input')!.value = 'abc';

      expect(editor.validate()).toEqual({ valid: true, msg: null });
      expect(args.column.validator).toHaveBeenCalledWith('abc', args);
    });

    it('keeps an invalid composite value out of the item but still records it in the form values', () => {
      args.column.validator = (value: string) => value.length > 3 ? { valid: false, msg: 'Too long' } : { valid: true };
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      args.grid.getActiveCell = () => null;
      args.item.value = 'old';
      editor = new TextEditor(args);
      const input = container.querySelector('input')!;
      input.value = 'too long';
      input.dispatchEvent(new Event('change'));

      expect(args.item.value).toBe('old');
      expect(args.compositeEditorOptions.formValues.value).toBe('too long');
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 0, cell: 0, item: args.item, formValues: { value: 'too long' } }));
    });
  });

  describe('IntegerEditor', () => {
    it('parses integers, truncating decimals and defaulting invalid input to zero', () => {
      editor = new IntegerEditor(args);
      const input = container.querySelector('input')!;

      input.value = '7.9';
      expect(editor.serializeValue()).toBe(7);
      input.value = 'abc';
      expect(editor.serializeValue()).toBe(0);
      input.value = '';
      expect(editor.serializeValue()).toBe(0);
    });

    it('shows a missing value as empty and treats an untouched empty input as unchanged', () => {
      editor = new IntegerEditor(args);
      editor.loadValue({});
      const input = container.querySelector('input')!;

      expect(input.value).toBe('');
      expect(editor.isValueChanged()).toBe(false);
      input.value = '3';
      expect(editor.isValueChanged()).toBe(true);
    });

    it('runs the column validator after the number check', () => {
      args.column.validator = (value: string) => Number(value) < 0 ? { valid: false, msg: 'Must be positive' } : { valid: true };
      editor = new IntegerEditor(args);
      const input = container.querySelector('input')!;

      input.value = '-1';
      expect(editor.validate()).toEqual({ valid: false, msg: 'Must be positive' });
      input.value = '1';
      expect(editor.validate()).toEqual({ valid: true, msg: null });
    });

    it('publishes composite changes and applies only valid values to the item', () => {
      args.compositeEditorOptions = { formValues: {}, editors: ['other'] };
      args.item.value = 5;
      editor = new IntegerEditor(args);
      const input = container.querySelector('input')!;

      input.value = 'x';
      input.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(5);
      expect(args.compositeEditorOptions.formValues.value).toBe(0);

      input.value = '9';
      input.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(9);
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenLastCalledWith(expect.objectContaining({ row: 1, cell: 2, editors: ['other'], formValues: { value: 9 } }));
    });

    it('focuses its input and removes it on destroy', () => {
      editor = new IntegerEditor(args);
      const input = container.querySelector('input')!;
      input.blur();
      editor.focus();
      expect(document.activeElement).toBe(input);
      editor.destroy();
      editor = undefined;
      expect(container.querySelector('input')).toBeNull();
    });
  });

  describe('FloatEditor', () => {
    it('uses DefaultDecimalPlaces when the column has no fixed decimal places', () => {
      FloatEditor.DefaultDecimalPlaces = 1;
      editor = new FloatEditor(args);
      editor.loadValue({ value: 2.36 });
      const input = container.querySelector('input')!;

      expect(input.value).toBe('2.4');
      expect(editor.isValueChanged()).toBe(false);
      input.value = '3.14159';
      expect(editor.serializeValue()).toBe(3.1);
    });

    it('lets a column with zero fixed decimal places override DefaultDecimalPlaces', () => {
      FloatEditor.DefaultDecimalPlaces = 3;
      args.column.editorFixedDecimalPlaces = 0;
      editor = new FloatEditor(args);
      editor.loadValue({ value: 0 });
      const input = container.querySelector('input')!;

      expect(input.value).toBe('0');
      input.value = '4.6';
      expect(editor.serializeValue()).toBe(5);
    });

    it('keeps values as typed without any decimal places setting', () => {
      editor = new FloatEditor(args);
      editor.loadValue({ value: 1.23456 });
      const input = container.querySelector('input')!;

      expect(input.value).toBe('1.23456');
      input.value = '9.87654';
      expect(editor.serializeValue()).toBe(9.87654);
    });

    it('does not format a missing or non-numeric value when loading', () => {
      args.column.editorFixedDecimalPlaces = 2;
      editor = new FloatEditor(args);
      const input = container.querySelector('input')!;

      editor.loadValue({});
      expect(input.value).toBe('');
      expect(editor.isValueChanged()).toBe(false);

      editor.loadValue({ value: '1.5' });
      expect(input.value).toBe('1.5');
    });

    it('serializes empty or invalid input as zero unless empty values are allowed', () => {
      editor = new FloatEditor(args);
      const input = container.querySelector('input')!;

      input.value = '';
      expect(editor.serializeValue()).toBe(0);
      input.value = 'abc';
      expect(editor.serializeValue()).toBe(0);

      FloatEditor.AllowEmptyValue = true;
      input.value = '0';
      expect(editor.serializeValue()).toBe(0);
      input.value = 'abc';
      expect(editor.serializeValue()).toBeUndefined();
    });

    it('validates numbers, then the column validator', () => {
      args.column.validator = (value: string) => Number(value) > 10 ? { valid: false, msg: 'Too big' } : { valid: true };
      editor = new FloatEditor(args);
      const input = container.querySelector('input')!;

      input.value = '1.2.3';
      expect(editor.validate()).toEqual({ valid: false, msg: 'Please enter a valid number' });
      input.value = '10.5';
      expect(editor.validate()).toEqual({ valid: false, msg: 'Too big' });
      input.value = '9.5';
      expect(editor.validate()).toEqual({ valid: true, msg: null });
    });

    it('publishes composite changes with the rounded value', () => {
      args.column.editorFixedDecimalPlaces = 1;
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      editor = new FloatEditor(args);
      const input = container.querySelector('input')!;

      input.value = '2.25';
      input.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(2.3);
      expect(args.compositeEditorOptions.formValues.value).toBe(2.3);
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledTimes(1);

      input.value = 'oops';
      input.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(2.3);
      expect(args.compositeEditorOptions.formValues.value).toBe(0);
    });

    it('focuses its input and removes it on destroy', () => {
      editor = new FloatEditor(args);
      const input = container.querySelector('input')!;
      input.blur();
      editor.focus();
      expect(document.activeElement).toBe(input);
      editor.destroy();
      editor = undefined;
      expect(container.querySelector('input')).toBeNull();
    });
  });

  describe('FlatpickrEditor', () => {
    let instance: any;
    let flatpickrMock: any;

    beforeEach(() => {
      instance = { altInput: undefined, close: vi.fn(), destroy: vi.fn(), open: vi.fn(), setDate: vi.fn() };
      flatpickrMock = vi.fn(() => instance);
      vi.stubGlobal('flatpickr', flatpickrMock);
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 200 } as DOMRect);
      vi.useFakeTimers();
    });

    afterEach(() => {
      editor?.destroy();
      editor = undefined;
      vi.useRealTimers();
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('creates the picker with default date formats, makes room for its icon and opens it shortly after', () => {
      editor = new FlatpickrEditor(args);
      const input = container.querySelector('input')!;

      expect(flatpickrMock).toHaveBeenCalledWith(input, expect.objectContaining({ altInput: true, altFormat: 'm/d/Y', dateFormat: 'm/d/Y', closeOnSelect: true, allowInput: true }));
      expect(input.style.width).toBe('182px');
      expect(instance.open).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(instance.open).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(input);
    });

    it('passes the column date formats to the picker', () => {
      args.column.params = { editorOptions: { altFormat: 'd/m/Y', dateFormat: 'Y-m-d' } };
      editor = new FlatpickrEditor(args);

      expect(flatpickrMock).toHaveBeenCalledWith(expect.any(HTMLInputElement), expect.objectContaining({ altFormat: 'd/m/Y', dateFormat: 'Y-m-d' }));
    });

    it('loads, serializes, applies and validates a date', () => {
      args.column.validator = (value: string) => value ? { valid: true } : { valid: false, msg: 'Date required' };
      editor = new FlatpickrEditor(args);
      const input = container.querySelector('input')!;

      editor.loadValue({ value: '01/02/2026' });
      expect(input.value).toBe('01/02/2026');
      expect(instance.setDate).toHaveBeenCalledWith('01/02/2026');
      expect(editor.isValueChanged()).toBe(false);

      input.value = '03/04/2026';
      expect(editor.isValueChanged()).toBe(true);
      expect(editor.validate()).toEqual({ valid: true, msg: null });
      editor.applyValue(args.item, editor.serializeValue());
      expect(args.item.value).toBe('03/04/2026');

      input.value = '';
      expect(editor.validate()).toEqual({ valid: false, msg: 'Date required' });
    });

    it('treats an untouched missing date as unchanged and validates without a validator', () => {
      editor = new FlatpickrEditor(args);
      editor.loadValue({});

      expect(container.querySelector('input')!.value).toBe('');
      expect(editor.isValueChanged()).toBe(false);
      expect(editor.validate()).toEqual({ valid: true, msg: null });
    });

    it('closes and destroys the picker and removes the input on destroy', () => {
      editor = new FlatpickrEditor(args);
      editor.hide();
      expect(instance.close).toHaveBeenCalledTimes(1);

      editor.destroy();
      editor = undefined;
      expect(instance.close).toHaveBeenCalledTimes(2);
      expect(instance.destroy).toHaveBeenCalledTimes(1);
      expect(container.querySelector('input')).toBeNull();
    });

    it('copes with a picker that returns no instance', () => {
      flatpickrMock.mockReturnValue(undefined);
      editor = new FlatpickrEditor(args);
      vi.advanceTimersByTime(50);

      expect(() => editor.loadValue({ value: '01/02/2026' })).not.toThrow();
      expect(container.querySelector('input')!.value).toBe('01/02/2026');
      editor.destroy();
      editor = undefined;
      expect(container.querySelector('input')).toBeNull();
    });

    it('does not auto-open in a composite editor and publishes picker changes', () => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      args.column.validator = (value: string) => value === 'bad' ? { valid: false, msg: 'Bad' } : { valid: true };
      editor = new FlatpickrEditor(args);
      const input = container.querySelector('input')!;
      vi.advanceTimersByTime(50);

      expect(instance.open).not.toHaveBeenCalled();
      expect(input.style.width).toBe('172px');
      editor.show();
      editor.hide();
      expect(instance.open).not.toHaveBeenCalled();
      expect(instance.close).not.toHaveBeenCalled();

      const { onChange } = flatpickrMock.mock.calls[0][1];
      input.value = '05/06/2026';
      onChange();
      expect(args.item.value).toBe('05/06/2026');
      expect(args.compositeEditorOptions.formValues.value).toBe('05/06/2026');
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 1, cell: 2, column: args.column }));

      input.value = 'bad';
      onChange();
      expect(args.item.value).toBe('05/06/2026');
      expect(args.compositeEditorOptions.formValues.value).toBe('bad');
    });

    it('ignores picker changes outside a composite editor', () => {
      editor = new FlatpickrEditor(args);
      flatpickrMock.mock.calls[0][1].onChange();

      expect(args.grid.onCompositeEditorChange.notify).not.toHaveBeenCalled();
      expect(args.item.value).toBe('');
    });
  });

  describe('YesNoSelectEditor', () => {
    it('offers yes and no options and maps falsy values to no', () => {
      editor = new YesNoSelectEditor(args);
      const select = container.querySelector('select')!;

      expect(Array.from(select.options).map(o => [o.value, o.textContent])).toEqual([['yes', 'Yes'], ['no', 'No']]);
      editor.loadValue({ value: 0 });
      expect(select.value).toBe('no');
      expect(editor.serializeValue()).toBe(false);
      expect(editor.validate()).toEqual({ valid: true, msg: null });
    });

    it('reports a change once a different answer is chosen', () => {
      editor = new YesNoSelectEditor(args);
      editor.loadValue({ value: true });
      container.querySelector('select')!.value = 'no';

      expect(editor.isValueChanged()).toBe(true);
    });

    it('focuses its select and removes it on destroy', () => {
      editor = new YesNoSelectEditor(args);
      const select = container.querySelector('select')!;
      select.blur();
      editor.focus();
      expect(document.activeElement).toBe(select);
      editor.destroy();
      editor = undefined;
      expect(container.querySelector('select')).toBeNull();
    });

    it('publishes composite changes', () => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      editor = new YesNoSelectEditor(args);
      const select = container.querySelector('select')!;
      select.value = 'yes';
      select.dispatchEvent(new Event('change'));

      expect(args.item.value).toBe(true);
      expect(args.compositeEditorOptions.formValues.value).toBe(true);
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 1, cell: 2, formValues: { value: true } }));
    });
  });

  describe('CheckboxEditor', () => {
    it('loads checked state and reports no change until toggled', () => {
      editor = new CheckboxEditor(args);
      const input = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

      editor.loadValue({ value: 'truthy' });
      expect(input.checked).toBe(true);
      expect(editor.isValueChanged()).toBe(false);
      editor.preClick();
      expect(editor.serializeValue()).toBe(false);
      expect(editor.isValueChanged()).toBe(true);
      expect(editor.validate()).toEqual({ valid: true, msg: null });
    });

    it('focuses its checkbox and removes it on destroy', () => {
      editor = new CheckboxEditor(args);
      const input = container.querySelector('input')!;
      input.blur();
      editor.focus();
      expect(document.activeElement).toBe(input);
      editor.destroy();
      editor = undefined;
      expect(container.querySelector('input')).toBeNull();
    });

    it('publishes composite changes', () => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      args.grid.getActiveCell = () => undefined;
      editor = new CheckboxEditor(args);
      const input = container.querySelector<HTMLInputElement>('input')!;
      input.checked = true;
      input.dispatchEvent(new Event('change'));

      expect(args.item.value).toBe(true);
      expect(args.compositeEditorOptions.formValues.value).toBe(true);
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 0, cell: 0 }));
    });
  });

  describe('PercentCompleteEditor', () => {
    it('builds a picker with a slider and three preset buttons', () => {
      editor = new PercentCompleteEditor(args);
      const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('.editor-percentcomplete-buttons button'));

      expect(buttons.map(b => [b.value, b.textContent])).toEqual([['0', 'Not started'], ['50', 'In Progress'], ['100', 'Complete']]);
      expect(container.querySelector('input[type="range"]')).not.toBeNull();
    });

    it('loads the value into the input and slider, and tracks changes numerically', () => {
      editor = new PercentCompleteEditor(args);
      editor.loadValue({ value: 30 });
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
      const slider = container.querySelector<HTMLInputElement>('input[type="range"]')!;

      expect(input.value).toBe('30');
      expect(slider.value).toBe('30');
      expect(editor.isValueChanged()).toBe(false);
      input.value = '30.7';
      expect(editor.isValueChanged()).toBe(false);
      input.value = 'abc';
      expect(editor.serializeValue()).toBe(0);
      expect(editor.isValueChanged()).toBe(true);
    });

    it('treats an empty input with no loaded value as unchanged', () => {
      editor = new PercentCompleteEditor(args);
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
      input.value = '';

      expect(editor.isValueChanged()).toBe(false);
    });

    it('copies the slider position into the input while sliding and when a button is clicked', () => {
      editor = new PercentCompleteEditor(args);
      editor.loadValue({ value: 10 });
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
      const slider = container.querySelector<HTMLInputElement>('input[type="range"]')!;

      slider.value = '75';
      slider.dispatchEvent(new Event('input'));
      expect(input.value).toBe('75');

      container.querySelector<HTMLButtonElement>('button[value="100"]')!.click();
      expect(input.value).toBe('100');
      expect(slider.value).toBe('100');
      editor.applyValue(args.item, editor.serializeValue());
      expect(args.item.value).toBe(100);
    });

    it('validates that the input starts with a number', () => {
      editor = new PercentCompleteEditor(args);
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;

      input.value = '42%';
      expect(editor.validate()).toEqual({ valid: true, msg: null });
      input.value = '%';
      expect(editor.validate()).toEqual({ valid: false, msg: 'Please enter a valid positive number' });
    });

    it('only publishes slider changes in a composite editor', () => {
      editor = new PercentCompleteEditor(args);
      const slider = container.querySelector<HTMLInputElement>('input[type="range"]')!;
      slider.dispatchEvent(new Event('change'));
      expect(args.grid.onCompositeEditorChange.notify).not.toHaveBeenCalled();
      editor.destroy();

      args.compositeEditorOptions = { formValues: {}, editors: [] };
      editor = new PercentCompleteEditor(args);
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
      const compositeSlider = container.querySelector<HTMLInputElement>('input[type="range"]')!;
      compositeSlider.value = '60';
      compositeSlider.dispatchEvent(new Event('input'));
      compositeSlider.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(60);
      expect(args.compositeEditorOptions.formValues.value).toBe(60);
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenCalledWith(expect.objectContaining({ row: 1, cell: 2, formValues: { value: 60 } }));

      input.value = 'n/a';
      compositeSlider.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe(60);
      expect(args.compositeEditorOptions.formValues.value).toBe(0);
    });

    it('focuses its input and removes the input and picker on destroy', () => {
      editor = new PercentCompleteEditor(args);
      const input = container.querySelector<HTMLInputElement>('.editor-percentcomplete')!;
      input.blur();
      editor.focus();
      expect(document.activeElement).toBe(input);

      editor.destroy();
      editor = undefined;
      expect(container.children.length).toBe(0);
    });
  });

  describe('LongTextEditor', () => {
    beforeEach(() => {
      args.position = { top: 100, left: 50 };
      args.commitChanges = vi.fn();
      args.cancelChanges = vi.fn();
      args.grid.navigateNext = vi.fn();
      args.grid.navigatePrev = vi.fn();
    });

    const wrapper = () => document.body.querySelector<HTMLDivElement>('.slick-large-editor-text')!;
    const textarea = () => wrapper().querySelector('textarea')!;

    it('is registered with the other editors', () => {
      expect(Editors).toEqual(expect.objectContaining({ LongText: LongTextEditor, Text: TextEditor, PercentComplete: PercentCompleteEditor }));
    });

    it('opens a detached, positioned editor with save and cancel buttons', () => {
      args.column.name = 'Notes';
      editor = new LongTextEditor(args);

      expect(wrapper().parentElement).toBe(document.body);
      expect(wrapper().style.position).toBe('absolute');
      expect(wrapper().style.top).toBe('95px');
      expect(wrapper().style.left).toBe('48px');
      expect(textarea().getAttribute('aria-label')).toBe('Notes');
      expect(document.activeElement).toBe(textarea());
      expect(Array.from(wrapper().querySelectorAll('button')).map(b => b.textContent)).toEqual(['Save', 'Cancel']);

      editor.position({});
      expect(wrapper().style.top).toBe('-5px');
      expect(wrapper().style.left).toBe('-2px');
    });

    it('hides, shows and is removed on destroy', () => {
      editor = new LongTextEditor(args);
      editor.hide();
      expect(wrapper().style.display).toBe('none');
      editor.show();
      expect(wrapper().style.display).toBe('');

      textarea().blur();
      editor.focus();
      expect(document.activeElement).toBe(textarea());

      editor.destroy();
      editor = undefined;
      expect(wrapper()).toBeNull();
    });

    it('loads, edits, validates and applies text', () => {
      args.column.validator = (value: string) => value.length > 5 ? { valid: false, msg: 'Too long' } : { valid: true };
      editor = new LongTextEditor(args);
      editor.loadValue({ value: 'hello' });

      expect(textarea().value).toBe('hello');
      expect(editor.isValueChanged()).toBe(false);
      expect(editor.validate()).toEqual({ valid: true, msg: null });
      textarea().value = 'hello world';
      expect(editor.isValueChanged()).toBe(true);
      expect(editor.validate()).toEqual({ valid: false, msg: 'Too long' });
      textarea().value = 'bye';
      editor.applyValue(args.item, editor.serializeValue());
      expect(args.item.value).toBe('bye');
    });

    it('commits on the save button, through the editor lock when edits auto-commit', () => {
      editor = new LongTextEditor(args);
      wrapper().querySelector<HTMLButtonElement>('#save')!.click();
      expect(args.commitChanges).toHaveBeenCalledTimes(1);

      const commitCurrentEdit = vi.fn();
      args.grid.getOptions = () => ({ autoCommitEdit: true });
      args.grid.getEditorLock = () => ({ commitCurrentEdit });
      wrapper().querySelector<HTMLButtonElement>('#save')!.click();
      expect(commitCurrentEdit).toHaveBeenCalledTimes(1);
      expect(args.commitChanges).toHaveBeenCalledTimes(1);
    });

    it('commits when grid options are missing', () => {
      editor = new LongTextEditor(args);
      args.grid.getOptions = () => undefined;
      editor.save();

      expect(args.commitChanges).toHaveBeenCalledTimes(1);
    });

    it('restores the loaded text and cancels on the cancel button', () => {
      editor = new LongTextEditor(args);
      editor.loadValue({ value: 'original' });
      textarea().value = 'changed';
      wrapper().querySelector<HTMLButtonElement>('#cancel')!.click();

      expect(textarea().value).toBe('original');
      expect(args.cancelChanges).toHaveBeenCalledTimes(1);
    });

    it('saves on Ctrl+Enter and cancels on Escape', () => {
      editor = new LongTextEditor(args);
      editor.loadValue({ value: 'x' });

      keydown(textarea(), { which: 13, keyCode: 13 });
      expect(args.commitChanges).not.toHaveBeenCalled();
      keydown(textarea(), { which: 13, keyCode: 13, ctrlKey: true });
      expect(args.commitChanges).toHaveBeenCalledTimes(1);

      const escape = keydown(textarea(), { which: 27, keyCode: 27 });
      expect(escape.defaultPrevented).toBe(true);
      expect(args.cancelChanges).toHaveBeenCalledTimes(1);
    });

    it('moves to the next cell on Tab and the previous one on Shift+Tab', () => {
      editor = new LongTextEditor(args);

      const tab = keydown(textarea(), { which: 9, keyCode: 9 });
      expect(tab.defaultPrevented).toBe(true);
      expect(args.grid.navigateNext).toHaveBeenCalledTimes(1);

      const shiftTab = keydown(textarea(), { which: 9, keyCode: 9, shiftKey: true });
      expect(shiftTab.defaultPrevented).toBe(true);
      expect(args.grid.navigatePrev).toHaveBeenCalledTimes(1);
      expect(args.grid.navigateNext).toHaveBeenCalledTimes(1);
    });

    it('ignores left and right arrows unless cell navigation on those keys is on', () => {
      editor = new LongTextEditor(args);
      editor.loadValue({ value: '' });
      keydown(textarea(), { which: 37, keyCode: 37 });
      keydown(textarea(), { which: 39, keyCode: 39 });

      expect(args.grid.navigatePrev).not.toHaveBeenCalled();
      expect(args.grid.navigateNext).not.toHaveBeenCalled();
    });

    it('navigates on left/right arrows at the edges of empty text when cell navigation on those keys is on', () => {
      args.grid.getOptions = () => ({ editorCellNavOnLRKeys: true });
      editor = new LongTextEditor(args);
      editor.loadValue({ value: '' });

      keydown(textarea(), { which: 37, keyCode: 37 });
      expect(args.grid.navigatePrev).toHaveBeenCalledTimes(1);
      keydown(textarea(), { which: 39, keyCode: 39 });
      expect(args.grid.navigateNext).toHaveBeenCalledTimes(1);
    });

    it('stays inline in a composite editor and publishes its changes', () => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      args.column.validator = (value: string) => value ? { valid: true } : { valid: false, msg: 'Required' };
      args.item.value = 'kept';
      editor = new LongTextEditor(args);
      const inline = container.querySelector<HTMLDivElement>('.slick-large-editor-text')!;
      const area = inline.querySelector('textarea')!;

      expect(inline.style.position).toBe('relative');
      expect(inline.style.padding).toBe('0px');
      expect(inline.querySelector('button')).toBeNull();

      area.value = '';
      area.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe('kept');
      expect(args.compositeEditorOptions.formValues.value).toBe('');

      area.value = 'new note';
      area.dispatchEvent(new Event('change'));
      expect(args.item.value).toBe('new note');
      expect(args.grid.onCompositeEditorChange.notify).toHaveBeenLastCalledWith(expect.objectContaining({ row: 1, cell: 2, formValues: { value: 'new note' } }));

      editor.destroy();
      editor = undefined;
      expect(container.querySelector('.slick-large-editor-text')).toBeNull();
    });
  });

  describe('fixes found while raising coverage', () => {
    const placeCursor = (input: HTMLInputElement | HTMLTextAreaElement, position: number) => input.setSelectionRange(position, position);

    it('only lets left/right arrows reach the grid once the cursor is at the start or the end of the text', () => {
      args.grid.getOptions = () => ({ editorCellNavOnLRKeys: true });
      editor = new TextEditor(args);
      editor.loadValue({ value: 'abc' });
      const input = container.querySelector('input')!;
      const outer = vi.fn();
      container.addEventListener('keydown', outer);

      placeCursor(input, 1);
      keydown(input, { keyCode: 37 });
      keydown(input, { keyCode: 39 });
      placeCursor(input, 2);
      keydown(input, { keyCode: 39 });
      expect(outer).not.toHaveBeenCalled();

      placeCursor(input, 0);
      keydown(input, { keyCode: 37 });
      expect(outer).toHaveBeenCalledTimes(1);
      placeCursor(input, 3);
      keydown(input, { keyCode: 39 });
      expect(outer).toHaveBeenCalledTimes(2);
    });

    it('lets the long text editor navigate on left/right arrows only from the start or the end of its text', () => {
      args.grid.getOptions = () => ({ editorCellNavOnLRKeys: true });
      args.position = { top: 100, left: 50 };
      args.grid.navigatePrev = vi.fn();
      args.grid.navigateNext = vi.fn();
      editor = new LongTextEditor(args);
      editor.loadValue({ value: 'abc' });
      const area = document.querySelector<HTMLTextAreaElement>('.slick-large-editor-text textarea')!;

      placeCursor(area, 1);
      keydown(area, { which: 37, keyCode: 37 });
      placeCursor(area, 2);
      keydown(area, { which: 39, keyCode: 39 });
      expect(args.grid.navigatePrev).not.toHaveBeenCalled();
      expect(args.grid.navigateNext).not.toHaveBeenCalled();

      placeCursor(area, 0);
      keydown(area, { which: 37, keyCode: 37 });
      placeCursor(area, 3);
      keydown(area, { which: 39, keyCode: 39 });
      expect(args.grid.navigatePrev).toHaveBeenCalledTimes(1);
      expect(args.grid.navigateNext).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['text', TextEditor, 0, '0'],
      ['integer', IntegerEditor, 5, '5'],
      ['float', FloatEditor, 1.5, '1.5'],
    ])('does not report the %s editor as changed when its loaded value was not edited', (_name, EditorClass: any, value, shown) => {
      editor = new EditorClass(args);
      editor.loadValue({ value });

      expect(container.querySelector('input')!.value).toBe(shown);
      expect(editor.isValueChanged()).toBe(false);
    });

    it('does not report the date editor as changed when its loaded value was not edited', () => {
      vi.stubGlobal('flatpickr', vi.fn(() => ({ close: vi.fn(), destroy: vi.fn(), open: vi.fn(), setDate: vi.fn() })));
      try {
        editor = new FlatpickrEditor(args);
        editor.loadValue({ value: 20260101 });

        expect(editor.isValueChanged()).toBe(false);
      } finally {
        editor.destroy();
        editor = undefined;
        vi.unstubAllGlobals();
      }
    });

    it.each([true, false])('does not report the yes/no editor as changed when its loaded value %s was not edited', (value) => {
      editor = new YesNoSelectEditor(args);
      editor.loadValue({ value });

      expect(editor.isValueChanged()).toBe(false);
      container.querySelector('select')!.value = value ? 'no' : 'yes';
      expect(editor.isValueChanged()).toBe(true);
    });

    it('throws before adding an input when Flatpickr is not loaded', () => {
      expect(() => new FlatpickrEditor(args)).toThrow('Flatpickr not loaded');
      expect(container.querySelector('input')).toBeNull();
    });

    it('shows an empty percent complete input for an item without a value', () => {
      editor = new PercentCompleteEditor(args);
      editor.loadValue({});

      expect(container.querySelector<HTMLInputElement>('input.editor-percentcomplete')!.value).toBe('');
    });

    it.each([
      ['text', TextEditor, 'input'],
      ['integer', IntegerEditor, 'input'],
      ['float', FloatEditor, 'input'],
      ['yes/no', YesNoSelectEditor, 'select'],
      ['checkbox', CheckboxEditor, 'input'],
    ])('stops publishing composite changes of the %s editor once it is destroyed', (_name, EditorClass: any, selector) => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      editor = new EditorClass(args);
      const field = container.querySelector(selector)!;

      editor.destroy();
      editor = undefined;
      field.dispatchEvent(new Event('change'));

      expect(args.grid.onCompositeEditorChange.notify).not.toHaveBeenCalled();
    });

    it('stops listening to the long text editor buttons and keys once it is destroyed', () => {
      args.commitChanges = vi.fn();
      args.cancelChanges = vi.fn();
      args.grid.navigateNext = vi.fn();
      args.position = { top: 100, left: 50 };
      editor = new LongTextEditor(args);
      const wrapper = document.querySelector<HTMLDivElement>('.slick-large-editor-text')!;
      const area = wrapper.querySelector('textarea')!;

      editor.destroy();
      editor = undefined;
      wrapper.querySelector<HTMLButtonElement>('#save')!.click();
      wrapper.querySelector<HTMLButtonElement>('#cancel')!.click();
      keydown(area, { which: 9, keyCode: 9 });

      expect(args.commitChanges).not.toHaveBeenCalled();
      expect(args.cancelChanges).not.toHaveBeenCalled();
      expect(args.grid.navigateNext).not.toHaveBeenCalled();
    });

    it('stops listening to the percent complete slider and buttons once it is destroyed', () => {
      args.compositeEditorOptions = { formValues: {}, editors: [] };
      editor = new PercentCompleteEditor(args);
      const input = container.querySelector<HTMLInputElement>('input.editor-percentcomplete')!;
      const slider = container.querySelector<HTMLInputElement>('input.editor-percentcomplete-slider')!;
      const button = container.querySelector<HTMLButtonElement>('.editor-percentcomplete-buttons button')!;
      input.value = '20';

      editor.destroy();
      editor = undefined;
      slider.dispatchEvent(new Event('input'));
      slider.dispatchEvent(new Event('change'));
      button.click();

      expect(input.value).toBe('20');
      expect(args.grid.onCompositeEditorChange.notify).not.toHaveBeenCalled();
    });
  });
});
