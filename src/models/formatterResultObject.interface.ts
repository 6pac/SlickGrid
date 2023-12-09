export interface FormatterResultObject {
  /** Optional CSS classes to add to the cell div container. */
  addClasses?: string;

  /** Optional CSS classes to remove from the cell div container. */
  removeClasses?: string;

  /** Optional tooltip text when hovering the cell div container. */
  toolTip?: string;

  /**
   * optionally insert an HTML element after the element target
   * for example we use this technique to take a div containing the row detail and insert it after the `.slick-cell`
   * e.g.: <div class="slick-cell"></div><div class="row-detail">...</div>
   */
  insertElementAfterTarget?: HTMLElement;
}

export interface FormatterResultWithText extends FormatterResultObject {
  /** Text to be displayed in the cell, basically the formatter output. */
  text: string;
}

export interface FormatterResultWithHtml extends FormatterResultObject {
  /** Text to be displayed in the cell, basically the formatter output. */
  html: HTMLElement;
}
