import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckboxEditor, FloatEditor, IntegerEditor, PercentCompleteEditor, TextEditor, YesNoSelectEditor } from '../slick.editors';

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
});
