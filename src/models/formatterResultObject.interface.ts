export interface FormatterResultObject {
  /** Optional CSS classes to add to the cell div */
  addClasses?: string;

  /** Optional CSS classes to remove from the cell div */
  removeClasses?: string;

  /** Text to be displayed in the cell, basically the formatter output */
  text: string;

  /** Optional tooltip text */
  toolTip?: string;
}
