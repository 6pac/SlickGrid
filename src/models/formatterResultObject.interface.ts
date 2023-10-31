export interface FormatterResultObject {
  /** Optional CSS classes to add to the cell div container. */
  addClasses?: string;

  /** Optional CSS classes to remove from the cell div container. */
  removeClasses?: string;

  /** Text to be displayed in the cell, basically the formatter output. */
  text: string | HTMLElement;

  /** Optional tooltip text when hovering the cell div container. */
  toolTip?: string;
}

export interface FormatterHtmlResultObject extends Omit<FormatterResultObject, 'text'> {
  /** Text to be displayed in the cell, basically the formatter output. */
  html: HTMLElement;
}
