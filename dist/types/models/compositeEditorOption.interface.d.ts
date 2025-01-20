import type { Editor } from './editor.interface.js';
export type CompositeEditorModalType = 'create' | 'edit' | 'clone' | 'auto-mass' | 'mass-update' | 'mass-selection';
export interface CompositeEditorOption {
    /** Defaults to "edit", what is the type of Composite Editor Modal is used? */
    modalType: CompositeEditorModalType;
    /** Failed Message text to display as a global validation error when there's any invalid field(s) */
    validationFailedMsg?: string;
    /** Add an optional prefix to each validation message (only the ones shown in the modal form, not the ones in the "errors") */
    validationMsgPrefix?: string;
    /** Show method that could be overridden */
    show?: () => void;
    /** Hide method that could be overridden */
    hide?: () => void;
    /** Position method that could be overridden */
    position?: (newPosition: any) => void;
    /** Destroy method that could be overridden */
    destroy?: () => void;
    /**
     * Object containing all Editor instance references used by the Composite Editor modal window
     * The object is formed by the column id being the object key which contain each Editor instance
     */
    editors: {
        [columnId: string]: Editor;
    };
    /**
     * Object containing all the modal form values that got changed.
     * The object is formed by the column id being the object key,
     * for example if user changed Title and Completed fields then the object will be:: { title: "Task 123", completed: true }
     */
    formValues: {
        [columnId: string]: any;
    };
}
//# sourceMappingURL=compositeEditorOption.interface.d.ts.map