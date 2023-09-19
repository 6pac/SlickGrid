import type { Column, CompositeEditorOption, Editor, EditorArguments, HtmlElementPosition } from './models/index';
import { Utils as Utils_ } from './slick.core';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * A composite SlickGrid editor factory.
 * Generates an editor that is composed of multiple editors for given columns.
 * Individual editors are provided given containers instead of the original cell.
 * Validation will be performed on all editors individually and the results will be aggregated into one
 * validation result.
 *
 *
 * The returned editor will have its prototype set to CompositeEditor, so you can use the "instanceof" check.
 *
 * NOTE:  This doesn't work for detached editors since they will be created and positioned relative to the
 *        active cell and not the provided container.
 *
 * @namespace Slick
 * @class CompositeEditor
 * @constructor
 * @param columns {Array} Column definitions from which editors will be pulled.
 * @param containers {Array} Container HTMLElements in which editors will be placed.
 * @param options {Object} Options hash:
 *  validationFailedMsg     -   A generic failed validation message set on the aggregated validation resuls.
 *  validationMsgPrefix     -   Add an optional prefix to each validation message (only the ones shown in the modal form, not the ones in the "errors")
 *  modalType               -   Defaults to "edit", modal type can 1 of these 3: (create, edit, mass, mass-selection)
 *  hide                    -   A function to be called when the grid asks the editor to hide itself.
 *  show                    -   A function to be called when the grid asks the editor to show itself.
 *  position                -   A function to be called when the grid asks the editor to reposition itself.
 *  destroy                 -   A function to be called when the editor is destroyed.
 */
export function SlickCompositeEditor(columns: Column[], containers: Array<HTMLDivElement>, options: CompositeEditorOption) {
  const defaultOptions = {
    modalType: 'edit', // available type (create, edit, mass)
    validationFailedMsg: 'Some of the fields have failed validation',
    validationMsgPrefix: null,
    show: null,
    hide: null,
    position: null,
    destroy: null,
    formValues: {},
    editors: {}
  };

  const noop = function () { };

  let firstInvalidEditor: Editor | null = null;

  options = Slick.Utils.extend({}, defaultOptions, options);

  function getContainerBox(i: number) {
    const c = containers[i];
    const offset = Slick.Utils.offset(c);
    const w = Slick.Utils.width(c);
    const h = Slick.Utils.height(c);

    return {
      top: (offset?.top ?? 0),
      left: (offset?.left ?? 0),
      bottom: (offset?.top ?? 0) + (h || 0),
      right: (offset?.left ?? 0) + (w || 0),
      width: w,
      height: h,
      visible: true
    };
  }

  function editor(args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context: any = this;
    let editors: Array<Editor & { args: EditorArguments }> = [];

    function init() {
      let newArgs: any = {};
      let idx = 0;
      while (idx < columns.length) {
        if (columns[idx].editor) {
          const column = columns[idx];
          newArgs = Slick.Utils.extend(false, {}, args);
          newArgs.container = containers[idx];
          newArgs.column = column;
          newArgs.position = getContainerBox(idx);
          newArgs.commitChanges = noop;
          newArgs.cancelChanges = noop;
          newArgs.compositeEditorOptions = options;
          newArgs.formValues = {};

          const currentEditor = new (column.editor as any)(newArgs) as Editor & { args: EditorArguments };
          options.editors[column.id] = currentEditor; // add every Editor instance refs
          editors.push(currentEditor);
        }
        idx++;
      }

      // focus on first input
      setTimeout(function () {
        if (Array.isArray(editors) && editors.length > 0 && typeof editors[0].focus === 'function') {
          editors[0].focus();
        }
      }, 0);
    }

    context.destroy = () => {
      let idx = 0;
      while (idx < editors.length) {
        editors[idx].destroy();
        idx++;
      }

      options.destroy?.();
      editors = [];
    };


    context.focus = () => {
      // if validation has failed, set the focus to the first invalid editor
      (firstInvalidEditor || editors[0]).focus();
    };

    context.isValueChanged = () => {
      let idx = 0;
      while (idx < editors.length) {
        if (editors[idx].isValueChanged()) {
          return true;
        }
        idx++;
      }
      return false;
    };

    context.serializeValue = () => {
      const serializedValue: any[] = [];
      let idx = 0;
      while (idx < editors.length) {
        serializedValue[idx] = editors[idx].serializeValue();
        idx++;
      }
      return serializedValue;
    };

    context.applyValue = (item: any, state: any) => {
      let idx = 0;
      while (idx < editors.length) {
        editors[idx].applyValue(item, state[idx]);
        idx++;
      }
    };

    context.loadValue = (item: any) => {
      let idx = 0;

      while (idx < editors.length) {
        editors[idx].loadValue(item);
        idx++;
      }
    };

    context.validate = (target: HTMLElement | null) => {
      let validationResults;
      const errors: any[] = [];
      let targetElm = target ? target : null;

      firstInvalidEditor = null;

      let idx = 0;
      while (idx < editors.length) {
        const columnDef = editors[idx].args?.column ?? {};
        if (columnDef) {
          let validationElm = document.querySelector(`.item-details-validation.editor-${columnDef.id}`);
          let labelElm = document.querySelector(`.item-details-label.editor-${columnDef.id}`);
          let editorElm = document.querySelector(`[data-editorid=${columnDef.id}]`);
          const validationMsgPrefix = options?.validationMsgPrefix || '';

          if (!targetElm || Slick.Utils.contains(editorElm as HTMLElement, targetElm)) {
            validationResults = editors[idx].validate();

            if (!validationResults.valid) {
              firstInvalidEditor = editors[idx];
              errors.push({
                index: idx,
                editor: editors[idx],
                container: containers[idx],
                msg: validationResults.msg
              });

              if (validationElm) {
                validationElm.textContent = validationMsgPrefix + validationResults.msg;
                labelElm?.classList.add('invalid');
                editorElm?.classList.add('invalid');
              }
            } else if (validationElm) {
              validationElm.textContent = '';
              editorElm?.classList.remove('invalid');
              labelElm?.classList.remove('invalid');
            }
          }
          validationElm = null;
          labelElm = null;
          editorElm = null;
        }
        idx++;
      }
      targetElm = null;

      if (errors.length) {
        return {
          valid: false,
          msg: options.validationFailedMsg,
          errors: errors
        };
      } else {
        return {
          valid: true,
          msg: ''
        };
      }
    };

    context.hide = () => {
      let idx = 0;
      while (idx < editors.length) {
        editors[idx]?.hide?.();
        idx++;
      }
      options?.hide?.();
    };

    context.show = () => {
      let idx = 0;
      while (idx < editors.length) {
        editors[idx]?.show?.();
        idx++;
      }
      options?.show?.();
    };

    context.position = (box: HtmlElementPosition) => {
      options?.position?.(box);
    };

    init();
  }

  // so we can do "editor instanceof Slick.CompositeEditor
  // @ts-ignore
  editor.prototype = this;
  return editor;
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    CompositeEditor: SlickCompositeEditor
  });
}
