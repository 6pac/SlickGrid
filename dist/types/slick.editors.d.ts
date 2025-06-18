import type { Column, Editor, EditorArguments, EditorValidationResult, ElementPosition, GridOption } from './models/index.js';
/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */
export declare class TextEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: number | string;
    protected navOnLR?: boolean;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    destroy(): void;
    focus(): void;
    getValue(): string;
    setValue(val: string): void;
    loadValue(item: any): void;
    serializeValue(): string;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class IntegerEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected navOnLR?: boolean;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): number;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class FloatEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected navOnLR?: boolean;
    /** Default number of decimal places to use with FloatEditor */
    static DefaultDecimalPlaces?: number;
    /** Should we allow empty value when using FloatEditor */
    static AllowEmptyValue: boolean;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    destroy(): void;
    focus(): void;
    getDecimalPlaces(): number | null;
    loadValue(item: any): void;
    serializeValue(): number;
    applyValue(item: any, state: number | string): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class FlatpickrEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected flatpickrInstance: any;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    destroy(): void;
    show(): void;
    hide(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): string;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class YesNoSelectEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected select: HTMLSelectElement;
    protected defaultValue?: string | number;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): boolean;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): {
        valid: boolean;
        msg: null;
    };
}
export declare class CheckboxEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: boolean;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): boolean;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class PercentCompleteEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLInputElement;
    protected defaultValue?: number;
    protected picker: HTMLDivElement;
    protected slider: HTMLInputElement | null;
    constructor(args: EditorArguments<TData, C, O>);
    sliderInputHandler(e: MouseEvent & {
        target: HTMLButtonElement;
    }): void;
    sliderChangeHandler(): void;
    init(): void;
    onClick(e: MouseEvent & {
        target: HTMLButtonElement;
    }): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): number;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare class LongTextEditor<TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>> implements Editor {
    protected readonly args: EditorArguments<TData, C, O>;
    protected input: HTMLTextAreaElement;
    protected wrapper: HTMLDivElement;
    protected defaultValue?: string;
    protected selectionStart: number;
    constructor(args: EditorArguments<TData, C, O>);
    init(): void;
    onChange(): void;
    handleKeyDown(e: KeyboardEvent & {
        target: HTMLInputElement;
    }): void;
    save(): void;
    cancel(): void;
    hide(): void;
    show(): void;
    position(position: ElementPosition): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): string;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidationResult;
}
export declare const Editors: {
    Text: typeof TextEditor;
    Integer: typeof IntegerEditor;
    Float: typeof FloatEditor;
    Flatpickr: typeof FlatpickrEditor;
    YesNoSelect: typeof YesNoSelectEditor;
    Checkbox: typeof CheckboxEditor;
    PercentComplete: typeof PercentCompleteEditor;
    LongText: typeof LongTextEditor;
};
//# sourceMappingURL=slick.editors.d.ts.map