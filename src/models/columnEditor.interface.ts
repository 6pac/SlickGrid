import { EditorValidator } from "./editorValidator.interface";

export interface ColumnEditor {
  /**
   * Defaults to false, when set to True and user presses the ENTER key (on Editors that supports it),
   * it will always call a Save regardless if the current value is null and/or previous value was null
   */
  alwaysSaveOnEnterKey?: boolean;

  /** Optionally provide an aria-label for assistive scren reader, defaults to "{inputName} Input Editor" */
  ariaLabel?: string;

  /** number of decimal places, works only with Editors supporting it (input float, integer, range, slider) */
  decimal?: number;

  /** is the Editor disabled when we first open it? This could happen when we use "collectionAsync" and we wait for the "collection" to be filled before enabling the Editor. */
  disabled?: boolean;

  /**
   * Options that could be provided to the Editor, example: { container: 'body', maxHeight: 250}
   *
   * Please note that if you use options that have existed model interfaces, you should cast with "as X",
   * for example { editorOptions: {maxHeight: 250} as MultipleSelectOption }
   */
  editorOptions?: any;

  /**
   * Defaults to false, when set it will render any HTML code instead of removing it (sanitized)
   * Currently only supported by the following Editors: Autocompleter, MultipleSelect & SingleSelect
   */
  enableRenderHtml?: boolean;

  /** Do we want the Editor to handle translation (localization)? */
  enableTranslateLabel?: boolean;

  /** Error message to display when validation fails */
  errorMessage?: string;

  /**
   * This flag can be used with a Composite Editor Modal for a "mass-update" or "mass-selection" change,
   * the modal form is being built dynamically by looping through all the column definition and it adds only the fields with the "massUpdate" enabled.
   */
  massUpdate?: boolean;

  /** Maximum length of the text value, works only with Editors supporting it (autocompleter, text, longText) */
  maxLength?: number;

  /** Maximum value of the editor, works only with Editors supporting it (number, float, slider) */
  maxValue?: number | string;

  /** Minimum length of the text value, works only with Editors supporting it (autocompleter, text, longText) */
  minLength?: number;

  /** Minimum value of the editor, works only with Editors supporting it (number, float, slider) */
  minValue?: number | string;

  /** Any inline editor function that implements Editor for the cell */
  model?: any;

  /**
   * Placeholder text that can be used by some Editors.
   * Note that this will override the default placeholder configured in the global config
   */
  placeholder?: string;

  /** Defaults to "inclusive", operator should be (inclusive or exclusive) when executing validation condition check against the minValue/maxValue. */
  operatorConditionalType?: 'inclusive' | 'exclusive';

  /**
   * Defaults to false, is the field required to be valid?
   * Only on Editors that supports it.
   */
  required?: boolean;

  /**
   * defaults to 'object', how do we want to serialize the editor value to the resulting dataContext object when using a complex object?
   * Currently only applies to Single/Multiple Select Editor.
   *
   * For example, if keep default "object" format and the selected value is { value: 2, label: 'Two' } then the end value will remain as an object, so { value: 2, label: 'Two' }.
   * On the other end, if we set "flat" format and the selected value is { value: 2, label: 'Two' } then the end value will be 2.
   */
  serializeComplexValueFormat?: 'flat' | 'object';

  /**
   * Title attribute that can be used in some Editors as tooltip (usually the "input" editors).
   * To use this as a Tooltip, you can use "@slickgrid-universal/slick-custom-tooltip" plugin.
   */
  title?: string;

  /** Editor Validator */
  validator?: EditorValidator;

  /** Step value of the editor, works only with Editors supporting it (input text, number, float, range, slider) */
  valueStep?: number | string;

  /**
   * Use "params" to pass any type of arguments to your Custom Editor
   * or regular Editor like the Editors.float
   * for example, if we don't want the slider number we could write
   * params: { decimalPlaces: 2 }
   */
  params?: any;
}
