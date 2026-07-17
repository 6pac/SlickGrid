// --
// slick.interactions.ts

import type { DragPosition } from './drag.interface.js';

export interface InteractionBase {
  destroy: () => void;
}
export interface ClassDetectElement {
  /** tag to be returned on match */
  tag: string

  /** element id to match */
  id?: string;

  /** element cssSelector to match */
  cssSelector?: string;
}


export interface DraggableOption {
  /** container DOM element, defaults to "document" */
  containerElement?: HTMLElement | Document;

  /** when defined, will allow dragging from a specific element by using the .matches() query selector. */
  allowDragFrom?: string;

  /** when defined, will allow dragging from a specific element or its closest parent by using the .closest() query selector. */
  allowDragFromClosest?: string;

  /** Defaults to `['ctrlKey', 'metaKey']`, list of keys that when pressed will prevent Draggable events from triggering (e.g. prevent onDrag when Ctrl key is pressed while dragging) */
  preventDragFromKeys?: Array<'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>;

  /** drag initialized callback */
  onDragInit?: (e: DragEvent, dd: DragPosition) => boolean | void;

  /** drag started callback */
  onDragStart?: (e: DragEvent, dd: DragPosition) => boolean | void;

  /** drag callback */
  onDrag?: (e: DragEvent, dd: DragPosition) => boolean | void;

  /** drag ended callback */
  onDragEnd?: (e: DragEvent, dd: DragPosition) => boolean | void;

  dragFromClassDetectArr?: Array<ClassDetectElement>
}

export interface ColumnReorderDragOption {
  /** CSS class applied to dragged header columns while drag is active */
  dragActiveClass?: string;

  /** CSS selector used to find draggable header items (default: `.slick-header-column`) */
  draggableSelector?: string;

  /** Left header container (.slick-header-columns-left) */
  headerLeft: HTMLElement;

  /** Right header container (.slick-header-columns-right) */
  headerRight: HTMLElement;

  /** Grid container - used for the right-edge auto-scroll boundary */
  container: HTMLElement;

  /** Scrollable viewport - used for the left-edge boundary and actual scrolling */
  viewportScrollContainerX: HTMLElement;

  /** Returns true when the grid has frozen columns (determines which pane can auto-scroll) */
  hasFrozenColumns: () => boolean;

  /** CSS class that marks a column as non-reorderable */
  unorderableColumnCssClass?: string;

  /** Dropzone selector used to detect external drop targets, e.g. draggable grouping (default: `.slick-dropzone`) */
  dropzoneSelector?: string;

  /** CSS class toggled while hovering an external dropzone (default: `slick-dropzone-hover`) */
  dropzoneHoverClass?: string;

  /**
   * Generic filter to ignore drag starts from interactive descendants.
   * - `string`: CSS selector used with `closest()`
   * - `function`: return `true` to cancel drag start for this target
   */
  dragStartFilter?: string | ((target: HTMLElement | null, event: DragEvent | MouseEvent | TouchEvent) => boolean);

  /**
   * Called right after dragstart, before any DOM changes.
   * Use this to snapshot column state that your onDragEnd callback needs.
   */
  onDragStart?: (draggedEl: HTMLElement) => void;

  /**
   * Called when drag ends with the new visible-column ID order read from the DOM.
   * Responsible for applying the reorder (setColumns, trigger event, etc.).
   */
  onDragEnd: (reorderedIds: string[]) => void;

  /** Called when the drag is dropped onto an external dropzone such as draggable grouping. */
  onDrop?: (draggedEl: HTMLElement, event: DragEvent | MouseEvent | TouchEvent, draggedColumnId?: string) => void;
}

/** Dropzone pill drag (used by SlickDraggableGrouping to reorder group pills and accept column-header drops) */
export interface DropzonePillDragOption {
  /** The dropzone container element */
  dropzoneElm: HTMLElement;

  /** CSS selector for draggable pill elements inside the dropzone (default: `.slick-dropped-grouping`) */
  itemSelector?: string;

  /** CSS class added to a pill while it is being dragged via the mouse/touch fallback */
  draggingCssClass?: string;

  /** Called when a pill reorder drag-and-drop is complete */
  onPillDragEnd?: (pill: HTMLElement) => void;

  /** Called when an external drag (e.g. column header) enters the dropzone */
  onColumnDragEnter?: (e: DragEvent) => void;

  /** Called when an external drag leaves the dropzone */
  onColumnDragLeave?: (e: DragEvent) => void;

  /** Called when a column header is natively dropped onto the dropzone */
  onColumnDrop?: (columnDataId: string, e: DragEvent) => void;
}

export interface MouseWheelOption {
  /** optional DOM element to attach mousewheel values, if undefined we'll attach it to the "window" object */
  element: HTMLElement | Document;

  /** mousewheel callback */
  onMouseWheel?: (e: MouseEvent, delta: number, deltaX: number, deltaY: number) => boolean | void;
}

export interface ResizableOption {
  /** resizable DOM element */
  resizeableElement: HTMLElement;

  /** resizable DOM element */
  resizeableHandleElement: HTMLElement;

  /** resize start callback */
  onResizeStart?: (e: MouseEvent | Touch | TouchEvent, resizeElms: { resizeableElement: HTMLElement; }) => boolean | void;

  /** resizing callback */
  onResize?: (e: MouseEvent | Touch | TouchEvent, resizeElms: { resizeableElement: HTMLElement; resizeableHandleElement: HTMLElement; }) => boolean | void;

  /** resize ended callback */
  onResizeEnd?: (e: MouseEvent | Touch | TouchEvent, resizeElms: { resizeableElement: HTMLElement; }) => boolean | void;
}