export interface FormatterResultObject {
    /** Optional CSS classes to add to the cell div container. */
    addClasses?: string;
    /** Optional CSS classes to remove from the cell div container. */
    removeClasses?: string;
    /** Optional tooltip text when hovering the cell div container. */
    toolTip?: string;
}
export interface FormatterResultWithText extends FormatterResultObject {
    /** Text to be displayed in the cell, basically the formatter output. */
    text: string;
}
export interface FormatterResultWithHtml extends FormatterResultObject {
    /** Text to be displayed in the cell, basically the formatter output. */
    html: HTMLElement;
}
//# sourceMappingURL=formatterResultObject.interface.d.ts.map