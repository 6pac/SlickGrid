import { describe, expect, it, vi } from 'vitest';
import type { Column, CompositeEditorOption, Editor } from '../models';
import { SlickCompositeEditor } from '../slick.compositeeditor';

type CompositeEditorInstance = Editor & {
  applyValue: (item: Record<string, unknown>, values: unknown[]) => void;
  formValues: Record<string, unknown>;
  hide: () => void;
  loadValue: (item: Record<string, unknown>) => void;
  position: (box: { top: number; left: number; bottom: number; right: number; width: number; height: number }) => void;
  show: () => void;
  validate: (target?: HTMLElement | null) => { valid: boolean; msg: string; errors?: unknown[] };
};

class TestEditor {
  args: any;
  value: unknown;
  validation: { valid: boolean; msg: string } = { valid: true, msg: '' };
  focus = vi.fn();
  hide = vi.fn();
  show = vi.fn();
  destroy = vi.fn();
  validate = vi.fn(() => this.validation);
  isValueChanged = vi.fn(() => false);
  serializeValue = vi.fn(() => this.value);
  loadValue = vi.fn((item: Record<string, unknown>) => {
    this.value = item[this.args.column.field as string];
  });
  applyValue = vi.fn((item: Record<string, unknown>, value: unknown) => {
    item[this.args.column.field as string] = value;
  });

  constructor(args: any) {
    this.args = args;
  }
}

function createFixture(columnCount = 2, options: Partial<CompositeEditorOption> = {}) {
  const columns: Column[] = Array.from({ length: columnCount }, (_, index) => ({
    id: `field${index}`,
    field: `field${index}`,
    name: `Field ${index}`,
    editor: TestEditor as any,
  }));
  const containers = columns.map(() => document.createElement('div'));
  const compositeOptions = {
    modalType: 'edit' as const,
    editors: {},
    formValues: {},
    ...options,
  } as CompositeEditorOption;
  const compositeEditor = SlickCompositeEditor(columns, containers, compositeOptions);
  const editor = new (compositeEditor as any)({ item: {} }) as CompositeEditorInstance;
  return { columns, containers, editor, options: compositeOptions };
}

function getTestEditor(editor: Editor): TestEditor {
  return editor as unknown as TestEditor;
}

describe('SlickCompositeEditor', () => {
  it('creates one child editor for each column with an editor', () => {
    const { columns, containers, editor, options } = createFixture();

    expect(Object.keys(options.editors)).toEqual(columns.map((column) => column.id));
    columns.forEach((column, index) => {
      const child = getTestEditor(options.editors[column.id]);
      expect(child.args.column).toBe(column);
      expect(child.args.container).toBe(containers[index]);
      expect(child.args.commitChanges).toEqual(expect.any(Function));
      expect(child.args.cancelChanges).toEqual(expect.any(Function));
    });
  });

  it('skips columns without an editor', () => {
    const columns: Column[] = [
      { id: 'editable', field: 'editable', editor: TestEditor as any },
      { id: 'readonly', field: 'readonly' },
    ];
    const editorOptions = { modalType: 'edit' as const, editors: {}, formValues: {} };
    const editor = new (SlickCompositeEditor(columns, [document.createElement('div'), document.createElement('div')], editorOptions) as any)({});

    expect(Object.keys(editorOptions.editors)).toEqual(['editable']);
  });

  it('loads, serializes, applies values, and detects changes across child editors', () => {
    const { editor, options } = createFixture();
    const item = { field0: 'A', field1: 'B' };

    editor.loadValue(item);
    expect(options.editors.field0.loadValue).toHaveBeenCalledWith(item);
    expect(options.editors.field1.loadValue).toHaveBeenCalledWith(item);

    getTestEditor(options.editors.field0).value = 'updated A';
    getTestEditor(options.editors.field1).value = 'updated B';
    expect(editor.serializeValue()).toEqual(['updated A', 'updated B']);

    const updatedItem = { field0: '', field1: '' };
    editor.applyValue(updatedItem, ['updated A', 'updated B']);
    expect(updatedItem).toEqual({ field0: 'updated A', field1: 'updated B' });
    expect(editor.isValueChanged()).toBe(false);

    vi.mocked(options.editors.field1.isValueChanged).mockReturnValue(true);
    expect(editor.isValueChanged()).toBe(true);
  });

  it('delegates show, hide, position, and destroy to child editors and callbacks', () => {
    const callbacks = { show: vi.fn(), hide: vi.fn(), position: vi.fn(), destroy: vi.fn() };
    const { editor, options } = createFixture(2, callbacks);
    const box = { top: 1, left: 2, bottom: 3, right: 4, width: 2, height: 2 };

    editor.show();
    editor.hide();
    editor.position(box);
    editor.destroy();

    for (const child of Object.values(options.editors).map(getTestEditor)) {
      expect(child.show).toHaveBeenCalledOnce();
      expect(child.hide).toHaveBeenCalledOnce();
      expect(child.destroy).toHaveBeenCalledOnce();
    }
    expect(callbacks.show).toHaveBeenCalledOnce();
    expect(callbacks.hide).toHaveBeenCalledOnce();
    expect(callbacks.position).toHaveBeenCalledWith(box);
    expect(callbacks.destroy).toHaveBeenCalledOnce();
  });

  it('returns a valid result when all child editors validate', () => {
    const { editor, options } = createFixture();

    expect(editor.validate()).toEqual({ valid: true, msg: '' });
    expect(options.editors.field0.validate).toHaveBeenCalledOnce();
    expect(options.editors.field1.validate).toHaveBeenCalledOnce();
  });

  it('collects invalid editor results', () => {
    const { editor, options } = createFixture(2, { validationFailedMsg: 'Please fix the form', validationMsgPrefix: 'Field: ' });
    const firstEditor = getTestEditor(options.editors.field0);
    const secondEditor = getTestEditor(options.editors.field1);
    firstEditor.validation = { valid: false, msg: 'Required' };
    secondEditor.validation = { valid: false, msg: 'Invalid' };

    const result = editor.validate();
    expect(result).toMatchObject({ valid: false, msg: 'Please fix the form' });
    expect(result.errors).toHaveLength(2);
  });

  it('validates only the editor containing the target element', () => {
    const { containers, editor, options } = createFixture();
    const editorElement = document.createElement('div');
    editorElement.dataset.editorid = 'field1';
    const target = document.createElement('input');
    editorElement.appendChild(target);
    document.body.appendChild(editorElement);

    editor.validate(target);

    expect(options.editors.field0.validate).not.toHaveBeenCalled();
    expect(options.editors.field1.validate).toHaveBeenCalledOnce();
    editorElement.remove();
  });
});
