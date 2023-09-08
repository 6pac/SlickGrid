import type { Editor, EditorArguments, EditorValidationResult, ElementPosition } from './models/index';
/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */
export declare class TextEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: number | string;
    protected navOnLR?: boolean;
    constructor(args: EditorArguments);
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
export declare class IntegerEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected navOnLR?: boolean;
    constructor(args: EditorArguments);
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
export declare class FloatEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected navOnLR?: boolean;
    /** Default number of decimal places to use with FloatEditor */
    static DefaultDecimalPlaces?: number;
    /** Should we allow empty value when using FloatEditor */
    static AllowEmptyValue: boolean;
    constructor(args: EditorArguments);
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
export declare class FlatpickrEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: string | number;
    protected flatpickrInstance: any;
    constructor(args: EditorArguments);
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
export declare class YesNoSelectEditor implements Editor {
    protected readonly args: EditorArguments;
    protected select: HTMLSelectElement;
    protected defaultValue?: string | number;
    constructor(args: EditorArguments);
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
export declare class CheckboxEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: boolean;
    constructor(args: EditorArguments);
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
export declare class PercentCompleteEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLInputElement;
    protected defaultValue?: number;
    protected picker: HTMLDivElement;
    protected slider: HTMLInputElement | null;
    constructor(args: EditorArguments);
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
export declare class LongTextEditor implements Editor {
    protected readonly args: EditorArguments;
    protected input: HTMLTextAreaElement;
    protected wrapper: HTMLDivElement;
    protected defaultValue?: string;
    protected selectionStart: number;
    constructor(args: EditorArguments);
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