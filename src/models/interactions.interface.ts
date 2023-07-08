// --
// slick.interactions.ts

export interface InteractionBase {
  destroy: () => void;
}
export interface DraggableOption {
  /** container DOM element, defaults to "document" */
  containerElement?: HTMLElement | Document;

  /** when defined, only allow dragging from an element that matches a specific query selector */
  allowDragFrom?: string;

  /** drag initialized callback */
  onDragInit?: Function;

  /** drag started callback */
  onDragStart?: Function;

  /** drag callback */
  onDrag?: Function;

  /** drag ended callback */
  onDragEnd?: Function;
}

export interface MouseWheelOption {
  /** optional DOM element to attach mousewheel values, if undefined we'll attach it to the "window" object */
  element: HTMLElement | Document;

  /** mousewheel callback */
  onMouseWheel?: Function;
}

export interface ResizableOption {
  /** resizable DOM element */
  resizeableElement: HTMLElement;

  /** resizable DOM element */
  resizeableHandleElement: HTMLElement;

  /** resize start callback */
  onResizeStart?: Function;

  /** resizing callback */
  onResize?: Function;

  /** resize ended callback */
  onResizeEnd?: Function;
}