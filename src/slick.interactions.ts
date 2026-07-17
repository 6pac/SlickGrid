import type { ColumnReorderDragOption, DragItem, DragPosition, ClassDetectElement, DraggableOption, MouseWheelOption, ResizableOption } from './models/index.js';
import { Utils as Utils_ } from './slick.core.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
 * Interactions, add basic behaviors to any element.
 * All the packages are written in pure vanilla JS and supports both mouse & touch events.
 * @module Interactions
 * @namespace Slick
 */

/**
 * Draggable Class, enables dragging functionality for any element for example cell & row selections.
 * Note that mouse/touch start is on the specified container element but all other events are on the document body.
 * code refs:
 *   https://betterprogramming.pub/perfecting-drag-and-drop-in-pure-vanilla-javascript-a761184b797a
 * available optional options:
 *   - containerElement: container DOM element, defaults to "document"
 *   - dragFromClassDetectArr: array of tags and query selectors/ids to match on dragstart, used to determine
 *     drag source element. eg:  [ { tag: 'B', id: 'myElement' }, { tag: 'A', cssSelector: 'div.myClass' } ]
 *   - allowDragFrom: when defined, only allow dragging from an element that matches a specific query selector
 *   - allowDragFromClosest: when defined, only allow dragging from an element or its parent matching a specific .closest() query selector
 *   - onDragInit: drag initialized callback
 *   - onDragStart: drag started callback
 *   - onDrag: drag callback
 *   - onDragEnd: drag ended callback
 * @param {Object} options
 * @returns - Draggable instance which includes destroy method
 * @class Draggable
 */
export function Draggable(options: DraggableOption) {
  let { containerElement } = options;
  const { onDragInit, onDragStart, onDrag, onDragEnd, preventDragFromKeys } = options;
  let element: HTMLElement | null;
  let startX: number;
  let startY: number;
  let deltaX: number;
  let deltaY: number;
  let dragStarted: boolean;
  let matchClassTag: string;

  if (!containerElement) {
    containerElement = document.body;
  }

  let originaldd: Partial<DragItem> = {
    dragSource: containerElement,
    dragHandle: null,
  };

  function init() {
    if (containerElement) {
      containerElement.addEventListener('mousedown', userPressed as EventListener);
      containerElement.addEventListener('touchstart', userPressed as EventListener);
    }
  }

  function executeDragCallbackWhenDefined(callback?: (e: DragEvent, dd: DragItem) => boolean | void, evt?: MouseEvent | Touch | TouchEvent | KeyboardEvent, dd?: DragItem) {
    if (typeof callback === 'function') {
      return callback(evt as DragEvent, dd as DragItem);
    }
  }

  function destroy() {
    if (containerElement) {
      containerElement.removeEventListener('mousedown', userPressed as EventListener);
      containerElement.removeEventListener('touchstart', userPressed as EventListener);
    }
  }

  /** Do we want to prevent Drag events from happening (for example prevent onDrag when Ctrl key is pressed while dragging) */
  function preventDrag(event: MouseEvent | TouchEvent | KeyboardEvent) {
    let eventPrevented = false;
    if (preventDragFromKeys) {
      preventDragFromKeys.forEach(key => {
        if ((event as KeyboardEvent)[key]) {
          eventPrevented = true;
        }
      });
    }
    return eventPrevented;
  }

  function userPressed(event: MouseEvent | TouchEvent | KeyboardEvent) {
    // Dragging is a primary-button action; allow secondary clicks to continue
    // to context-menu handling without starting a drag.
    // Keep synthetic mousedown CustomEvents compatible (they have no `button`).
    if (event.type === 'mousedown' && 'button' in event && (event as MouseEvent).button !== 0) {
      return;
    }

    if (!preventDrag(event)) {
      element = event.target as HTMLElement;
      const targetEvent: MouseEvent | Touch = (event as TouchEvent)?.touches?.[0] ?? event;
      const { target } = targetEvent;

      if (!options.allowDragFrom || (options.allowDragFrom && (element.matches(options.allowDragFrom)) || (options.allowDragFromClosest && element.closest(options.allowDragFromClosest)))) {
        originaldd.dragHandle = element as HTMLElement;

        matchClassTag = '';
        if (options.dragFromClassDetectArr) {
          for (let o: ClassDetectElement, i = 0; i < options.dragFromClassDetectArr.length; i++) {
            o = options.dragFromClassDetectArr[i];

            if ((o.id && element.id === o.id) || (o.cssSelector && element.matches(o.cssSelector))) {
              matchClassTag = o.tag;
              break;
            }
          }
        }

        const winScrollPos = Utils.windowScrollPosition();
        startX = winScrollPos.left + targetEvent.clientX;
        startY = winScrollPos.top + targetEvent.clientY;
        deltaX = targetEvent.clientX - targetEvent.clientX;
        deltaY = targetEvent.clientY - targetEvent.clientY;
        originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target, matchClassTag });
        const result = executeDragCallbackWhenDefined(onDragInit as (e: DragEvent, dd: DragPosition) => boolean | void, event, originaldd as DragItem);

        if (result !== false) {
          document.body.addEventListener('mousemove', userMoved);
          document.body.addEventListener('touchmove', userMoved);
          // register mouseup/... events on the window object so that we can catch them even if the user moves the mouse outside the container element
          window.addEventListener('mouseup', userReleased);
          window.addEventListener('touchend', userReleased);
          window.addEventListener('touchcancel', userReleased);
        }
      }
    }
  }

  function userMoved(event: MouseEvent | TouchEvent | KeyboardEvent) {
    if (!preventDrag(event)) {
      const targetEvent: MouseEvent | Touch = (event as TouchEvent)?.touches?.[0] ?? event;
      deltaX = targetEvent.clientX - startX;
      deltaY = targetEvent.clientY - startY;
      const { target } = targetEvent;

      if (!dragStarted) {
        originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target, matchClassTag });
        executeDragCallbackWhenDefined(onDragStart, event, originaldd as DragItem);
        dragStarted = true;
      }

      originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target, matchClassTag });
      executeDragCallbackWhenDefined(onDrag, event, originaldd as DragItem);
    }
  }

  function userReleased(event: MouseEvent | TouchEvent) {
    document.body.removeEventListener('mousemove', userMoved);
    document.body.removeEventListener('touchmove', userMoved);
    window.removeEventListener('mouseup', userReleased);
    window.removeEventListener('touchend', userReleased);
    window.removeEventListener('touchcancel', userReleased);

    // trigger a dragEnd event only after dragging started and stopped
    if (dragStarted) {
      const { target } = event;
      originaldd = Object.assign(originaldd, { target });
      executeDragCallbackWhenDefined(onDragEnd, event, originaldd as DragItem);
      dragStarted = false;
    }
  }

  // initialize Draggable service by attaching mouse/touch events
  init();

  // public API
  return { destroy };
}

/**
 * MouseWheel Class, add mousewheel listeners and calculate delta values and return them in the callback function.
 * available optional options:
 *   - element: optional DOM element to attach mousewheel values, if undefined we'll attach it to the "window" object
 *   - onMouseWheel: mousewheel callback
 * @param {Object} options
 * @returns - MouseWheel instance which includes destroy method
 * @class MouseWheel
 */
export function MouseWheel(options: MouseWheelOption) {
  const { element, onMouseWheel } = options;

  function destroy() {
    element.removeEventListener('wheel', wheelHandler as EventListener);
    element.removeEventListener('mousewheel', wheelHandler as EventListener);
  }

  function init() {
    element.addEventListener('wheel', wheelHandler as EventListener);
    element.addEventListener('mousewheel', wheelHandler as EventListener);
  }

  // copy over the same event handler code used in jquery.mousewheel
  function wheelHandler(event: WheelEvent & { axis: number; wheelDelta: number; wheelDeltaX: number; wheelDeltaY: number; HORIZONTAL_AXIS: number; }) {
    const orgEvent = event || window.event;
    let delta = 0;
    let deltaX = 0;
    let deltaY = 0;

    // Old school scrollwheel delta
    if (orgEvent.wheelDelta) {
      delta = orgEvent.wheelDelta / 120;
    }
    if (orgEvent.detail) {
      delta = -orgEvent.detail / 3;
    }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
      deltaY = 0;
      deltaX = -1 * delta;
    }

    // WebKit
    if (orgEvent.wheelDeltaY !== undefined) {
      deltaY = orgEvent.wheelDeltaY / 120;
    }
    if (orgEvent.wheelDeltaX !== undefined) {
      deltaX = -1 * orgEvent.wheelDeltaX / 120;
    }

    if (typeof onMouseWheel === 'function') {
      onMouseWheel(event, delta, deltaX, deltaY);
    }
  }

  // initialize MouseWheel service by attaching mousewheel events
  init();

  // public API
  return { destroy };
}

/**
 * Resizable Class, enables resize functionality for any element
 * Code mostly comes from these 2 resources:
 *   https://spin.atomicobject.com/2019/11/21/creating-a-resizable-html-element/
 *   https://htmldom.dev/make-a-resizable-element/
 * available optional options:
 *   - resizeableElement: resizable DOM element
 *   - resizeableHandleElement: resizable DOM element
 *   - onResizeStart: resize start callback
 *   - onResize: resizing callback
 *   - onResizeEnd: resize ended callback
 * @param {Object} options
 * @returns - Resizable instance which includes destroy method
 * @class Resizable
 */
export function Resizable(options: ResizableOption) {
  const { resizeableElement, resizeableHandleElement, onResizeStart, onResize, onResizeEnd } = options;
  if (!resizeableHandleElement || typeof resizeableHandleElement.addEventListener !== 'function') {
    throw new Error('[Slick.Resizable] You did not provide a valid html element that will be used for the handle to resize.');
  }

  function init() {
    // add event listeners on the draggable element
    resizeableHandleElement.addEventListener('mousedown', resizeStartHandler);
    resizeableHandleElement.addEventListener('touchstart', resizeStartHandler);
  }

  function destroy() {
    if (typeof resizeableHandleElement?.removeEventListener === 'function') {
      resizeableHandleElement.removeEventListener('mousedown', resizeStartHandler);
      resizeableHandleElement.removeEventListener('touchstart', resizeStartHandler);
    }
  }

  function executeResizeCallbackWhenDefined(callback?: Function, e?: MouseEvent | TouchEvent | Touch) {
    if (typeof callback === 'function') {
      return callback(e, { resizeableElement, resizeableHandleElement });
    }
  }

  function resizeStartHandler(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    const result = executeResizeCallbackWhenDefined(onResizeStart, event);
    if (result !== false) {
      document.body.addEventListener('mousemove', resizingHandler);
      document.body.addEventListener('mouseup', resizeEndHandler);
      document.body.addEventListener('touchmove', resizingHandler);
      document.body.addEventListener('touchend', resizeEndHandler);
    }
  }

  function resizingHandler(e: MouseEvent | TouchEvent) {
    if (e.preventDefault && e.type !== 'touchmove') {
      e.preventDefault();
    }
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    if (typeof onResize === 'function') {
      onResize(event, { resizeableElement, resizeableHandleElement });
    }
  }

  /** Remove all mouse/touch handlers */
  function resizeEndHandler(e: MouseEvent | TouchEvent) {
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    executeResizeCallbackWhenDefined(onResizeEnd, event);
    document.body.removeEventListener('mousemove', resizingHandler);
    document.body.removeEventListener('mouseup', resizeEndHandler);
    document.body.removeEventListener('touchmove', resizingHandler);
    document.body.removeEventListener('touchend', resizeEndHandler);
  }

  // initialize Resizable service by attaching mouse/touch events
  init();

  // public API
  return { destroy };
}

/**
 * Extract { clientX, clientY, pageX } from any pointer-like event.
 * DragEvent inherits clientX/pageX from MouseEvent; TouchEvent uses touches[0] (or
 * changedTouches[0] for touchend/touchcancel where touches is empty).
 */
function getPointerPos(e: DragEvent | MouseEvent | TouchEvent) {
  if ('touches' in e) {
    const t = e.touches[0] ?? e.changedTouches[0];
    return { clientX: t?.clientX ?? 0, clientY: t?.clientY ?? 0, pageX: t?.pageX ?? 0 };
  }
  return { clientX: e.clientX, clientY: e.clientY, pageX: e.pageX };
}

const isRtl = (el: HTMLElement): boolean => getComputedStyle(el).direction === 'rtl';

/**
 * Applies a column header drag to a column list: every column listed in `originalIds` hands its index
 * to the column at the same position in `reorderedIds`, so hidden and non-reorderable columns, and
 * columns that belong to another header container (docking band), keep their original indices.
 * When `originalIds` is omitted, the visible reorderable columns in column order are used.
 * Returns an unchanged copy when both id lists do not hold the same columns.
 * @param {Array<Object>} columns - column definitions before the drag
 * @param {Array<String>} reorderedIds - reorderable header ids in DOM order after the drag
 * @param {Array<String>} [originalIds] - reorderable header ids in DOM order before the drag
 */
export function reconcileColumnOrder<T extends { id?: string | number; hidden?: boolean; reorderable?: boolean; }>(columns: T[], reorderedIds: string[], originalIds?: string[]): T[] {
  const indexById = new Map(columns.map((column, index) => [String(column.id), index]));
  const sourceIds = originalIds ?? columns.filter((column) => !column.hidden && column.reorderable !== false).map((column) => String(column.id));
  const slots = sourceIds.map((id) => indexById.get(id));
  const moved = reorderedIds.map((id) => indexById.get(id));
  const slotSet = new Set(slots);
  const sameColumns = moved.length === slots.length && slotSet.size === slots.length && !slotSet.has(undefined)
    && new Set(moved).size === moved.length && moved.every((index) => slotSet.has(index));
  if (!sameColumns) {
    return columns.slice();
  }

  const finalColumns = columns.slice();
  slots.forEach((slot, i) => (finalColumns[slot!] = columns[moved[i]!]));
  return finalColumns;
}

/**
 * Sets up native HTML5 drag-and-drop for column header reordering (replaces the previous SortableJS dependency),
 * ported from the Slickgrid-Universal implementation of the same feature.
 *
 * Handles:
 * - Making orderable header columns draggable
 * - Live DOM reordering during dragover (constrained to the column's own header container,
 *   so columns never cross into another container such as a docking band)
 * - Browser-edge auto-scroll (left / right) during drag
 * - Firefox+Linux ghost rendering fix via explicit setDragImage, with a mouse-based fallback drag
 * - Touch-based fallback drag for touch screens (which never fire HTML5 drag events)
 * - Storing the dragged column's data-id in dataTransfer (for cross-container drops, e.g. draggable grouping)
 *
 * @param {Object} options
 * @returns - setupColumnReorderDrag instance which includes destroy method
 * @class setupColumnReorderDrag
 */
export function setupColumnReorderDrag(options: ColumnReorderDragOption) {
  const { headers, container, viewportScrollContainerX, unorderableColumnCssClass } = options;
  const dragActiveClass = options.dragActiveClass ?? 'slick-header-column-active';
  const draggableSelector = options.draggableSelector ?? '.slick-header-column';
  const dropzoneSelector = options.dropzoneSelector ?? '.slick-dropzone';
  const dropzoneHoverClass = options.dropzoneHoverClass ?? 'slick-dropzone-hover';
  const DRAG_THRESHOLD = 5; // pixels before we consider it a drag, not a click
  const AUTO_SCROLL_DISTANCE = 10; // px per browser-edge auto-scroll step
  const AUTO_SCROLL_INTERVAL = 30; // ms between browser-edge auto-scroll steps

  let columnScrollTimer: ReturnType<typeof setInterval> | undefined;
  let columnScrollDirection = 0;
  let canAutoScroll = false;
  let originalIds: string[] = [];
  let draggedEl: HTMLElement | null = null;
  let originalParent: Node | null = null;
  let originalNextSibling: ChildNode | null = null;
  let dropzoneTargetActive = false;
  let draggedColumnId = '';
  let dragGhost: HTMLElement | null = null;
  let dragStartX: number | null = null;
  let dragStartY: number | null = null;
  let pointerDragCommitted = false;

  const isOverDropzone = (el: HTMLElement | null | undefined): boolean => !!el?.closest?.(dropzoneSelector);
  const stopAutoScroll = () => {
    clearInterval(columnScrollTimer);
    columnScrollTimer = undefined;
    columnScrollDirection = 0;
  };

  // scroll while the pointer is past the viewport's left edge or the container's right edge
  const updateAutoScroll = (pageX: number) => {
    const viewportLeft = Utils.offset(viewportScrollContainerX)?.left ?? 0;
    const containerRight = (Utils.offset(container)?.left ?? 0) + container.clientWidth;
    const direction = pageX > containerRight ? 1 : pageX < viewportLeft ? -1 : 0;
    if (direction !== columnScrollDirection) {
      stopAutoScroll();
      columnScrollDirection = direction;
      if (direction) {
        columnScrollTimer = setInterval(() => (viewportScrollContainerX.scrollLeft += direction * AUTO_SCROLL_DISTANCE), AUTO_SCROLL_INTERVAL);
      }
    }
  };

  const restoreDraggedToOriginalParent = () => {
    if (originalParent && draggedEl && draggedEl.parentElement !== originalParent) {
      originalParent.insertBefore(draggedEl, originalNextSibling as Node | null);
    }
  };

  const toggleDropzoneHoverClass = (el: HTMLElement | null | undefined, isActive: boolean) => {
    const dropzone = el?.closest?.(dropzoneSelector) as HTMLElement | null;
    dropzone?.classList.toggle(dropzoneHoverClass, isActive);
  };

  const clearDropzoneHoverClasses = () => {
    document.querySelectorAll<HTMLElement>(dropzoneSelector).forEach((el) => el.classList.remove(dropzoneHoverClass));
  };

  const safely = (operation: () => void, onError?: (error: unknown) => void) => {
    try {
      operation();
    } catch (error) {
      onError?.(error);
    }
  };

  const isDragStartIgnoredTarget = (el: HTMLElement | null, event: DragEvent | MouseEvent | TouchEvent): boolean => {
    const dragStartFilter = options.dragStartFilter;
    return typeof dragStartFilter === 'function'
      ? !!dragStartFilter(el, event)
      : typeof dragStartFilter === 'string' && dragStartFilter.trim()
        ? !!el?.closest?.(dragStartFilter)
        : false;
  };

  const reorderDraggedAgainstTarget = (target: HTMLElement, clientX: number) => {
    if (!draggedEl || target === draggedEl || !isDraggable(target)) {
      return;
    }

    // only allow reordering within the dragged column's own header container; this keeps
    // columns from crossing into another docking band (same behavior as the previous
    // SortableJS implementation which used one unconnected list per header container)
    const targetParent = target.parentElement;
    if (!targetParent || targetParent !== originalParent) {
      return;
    }

    // move the dragged header past the hovered one (like SortableJS) once the pointer is far enough into it
    // for the dragged header to land under the pointer, so headers of unequal widths cannot swap back and forth
    const rect = target.getBoundingClientRect();
    const draggedRect = draggedEl.getBoundingClientRect();
    const targetOnRight = rect.left + rect.width / 2 > draggedRect.left + draggedRect.width / 2;
    if (targetOnRight ? clientX <= rect.right - draggedRect.width : clientX >= rect.left + draggedRect.width) {
      return;
    }
    const insertBefore = isRtl(targetParent) ? targetOnRight : !targetOnRight;
    targetParent.insertBefore(draggedEl, insertBefore ? target : target.nextSibling);
  };

  const isDraggable = (el: HTMLElement): boolean =>
    el.matches(draggableSelector) && (!unorderableColumnCssClass || !el.classList.contains(unorderableColumnCssClass));

  // Mirror SortableJS's Firefox/Linux fallback detection so the mouse-based path is used only for the broken browser combo.
  const isFfLinux = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent) && /linux/i.test(navigator.userAgent);

  const getColumnIds = (): string[] =>
    headers.flatMap((parent) =>
      Array.from(parent.children)
        .filter((el) => isDraggable(el as HTMLElement))
        .map((el) => (el as HTMLElement).dataset.id ?? '')
        .filter(Boolean)
    );

  // Set draggable attribute on all eligible header columns
  const refreshDraggable = (parent: HTMLElement) => {
    Array.from(parent.children as HTMLCollectionOf<HTMLElement>).forEach((el) => {
      if (el.matches(draggableSelector)) {
        // Disable native HTML5 drag on Firefox/Linux and use mouse fallback
        el.draggable = isDraggable(el) && !isFfLinux;
      }
    });
  };
  headers.forEach(refreshDraggable);

  // the drag event reports 0,0 coordinates when the drag ends, ignore those
  const autoScrollHandler = (e: DragEvent) => {
    if (e.clientX && e.clientY) {
      updateAutoScroll(e.pageX);
    }
  };

  const clearDropzoneTarget = () => (dropzoneTargetActive = false);
  const clearFallbackGhost = () => {
    dragGhost?.parentElement?.removeChild(dragGhost);
    dragGhost = null;
  };

  const resetDragState = () => {
    draggedEl = null;
    originalParent = null;
    originalNextSibling = null;
    draggedColumnId = '';
    dragStartX = null;
    dragStartY = null;
    pointerDragCommitted = false;
    canAutoScroll = false;
    originalIds = [];
    clearDropzoneTarget();
    clearDropzoneHoverClasses();
    clearFallbackGhost();
  };

  const createFallbackGhost = (source: HTMLElement, clientX: number, clientY: number) => {
    clearFallbackGhost();
    const rect = source.getBoundingClientRect();
    dragGhost = source.cloneNode(true) as HTMLElement;
    dragGhost.classList.add('slick-header-column-drag-ghost');
    // Explicitly set dimensions and styles so the ghost renders correctly outside its original container
    dragGhost.style.width = `${rect.width}px`;
    dragGhost.style.height = `${rect.height}px`;
    dragGhost.style.opacity = '0.8';
    dragGhost.style.left = `${clientX}px`;
    dragGhost.style.top = `${clientY}px`;
    document.body.appendChild(dragGhost);
  };

  const updateFallbackGhost = (clientX: number, clientY: number) => {
    if (dragGhost) {
      dragGhost.style.left = `${clientX}px`;
      dragGhost.style.top = `${clientY}px`;
    }
  };

  const onDropzoneDragEnter = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (draggedEl && isOverDropzone(target)) {
      dropzoneTargetActive = true;
      toggleDropzoneHoverClass(target, true);
      // Ensure the dragged header remains in the header DOM (non-destructive)
      safely(() => {
        restoreDraggedToOriginalParent();
      });
    }
  };

  const onDropzoneDragLeave = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    const relatedTarget =
      (e.relatedTarget as HTMLElement | null) ??
      (e.clientX !== undefined && e.clientY !== undefined ? (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null) : null);
    if (isOverDropzone(target) && !isOverDropzone(relatedTarget)) {
      dropzoneTargetActive = false;
      toggleDropzoneHoverClass(target, false);
    }
  };

  document.addEventListener('dragenter', onDropzoneDragEnter as EventListener);
  document.addEventListener('dragleave', onDropzoneDragLeave as EventListener);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    const overDropzone = isOverDropzone(e.target as HTMLElement | null);
    if (overDropzone) {
      dropzoneTargetActive = true;
      toggleDropzoneHoverClass(e.target as HTMLElement | null, true);
      // Keep the dragged header visible in the original header DOM while over the dropzone
      safely(() => {
        restoreDraggedToOriginalParent();
      });
      return;
    }

    clearDropzoneHoverClasses();

    const target = (e.target as HTMLElement).closest<HTMLElement>(draggableSelector);
    if (target) {
      reorderDraggedAgainstTarget(target, e.clientX);
    }
  };

  const finalizeDrag = (e: DragEvent) => {
    const draggedHeader = draggedEl;
    draggedHeader?.classList.remove(dragActiveClass);
    stopAutoScroll();
    document.removeEventListener('drag', autoScrollHandler as EventListener);

    // If the drop happened over an external dropzone (eg. DraggableGrouping), the header
    // may have been moved out of the header DOM during dragover. Detect that and
    // restore the header to its original parent to avoid permanently removing the column
    // from the grid's column list when we read column order from the DOM.
    let droppedOnDropzone = dropzoneTargetActive;
    safely(
      () => {
        if (!droppedOnDropzone && e.clientX !== undefined && e.clientY !== undefined) {
          const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
          if (el && el.closest && el.closest(dropzoneSelector)) {
            droppedOnDropzone = true;
          }
        }
      },
      () => {
        droppedOnDropzone = false;
      }
    );

    if (droppedOnDropzone && draggedHeader && originalParent) {
      // restore the header DOM to its original location
      originalParent.insertBefore(draggedHeader, originalNextSibling as Node | null);
    }

    const reorderedIds = getColumnIds();
    e.stopPropagation();
    if (droppedOnDropzone && draggedHeader) {
      options.onDrop?.(draggedHeader, e, draggedColumnId);
    } else {
      options.onDragEnd(reorderedIds, originalIds);
    }
    // clear stored original position
    resetDragState();
  };

  const onDragEnd = (e: DragEvent) => {
    if (!draggedEl) {
      // drag already finalized (e.g. by a `drop` on the headers) or never started
      stopAutoScroll();
      document.removeEventListener('drag', autoScrollHandler as EventListener);
      return;
    }
    finalizeDrag(e);
  };

  // finalize on `drop` too (like SortableJS did): some drag sources dispatch `drop`
  // without a subsequent `dragend`, and finalizing here is a no-op for the dragend
  // that normally follows since the drag state is reset
  const onHeaderDrop = (e: DragEvent) => {
    e.preventDefault();
    if (draggedEl) {
      finalizeDrag(e);
    }
  };

  // Firefox/Linux native HTML5 drag is broken; touch screens never fire HTML5 drag events.
  // All three start events (dragstart, mousedown, touchstart) share one handler.

  const onStart = (e: DragEvent | MouseEvent | TouchEvent) => {
    const { clientX, clientY } = getPointerPos(e);
    const eventTarget = e.target as HTMLElement | null;
    const cancelNativeDragIfNeeded = (evt: DragEvent | MouseEvent | TouchEvent) => {
      if (evt.type === 'dragstart') {
        evt.preventDefault();
      }
    };

    if (isDragStartIgnoredTarget(eventTarget, e)) {
      cancelNativeDragIfNeeded(e);
      return;
    }
    const target = eventTarget?.closest<HTMLElement>(draggableSelector);
    if (!target || !isDraggable(target)) {
      // Cancel a native drag that started on a non-orderable column
      cancelNativeDragIfNeeded(e);
      return;
    }
    // Common state setup
    draggedEl = target;
    draggedColumnId = target.dataset.id ?? '';
    clearDropzoneTarget();
    originalParent = target.parentElement;
    originalNextSibling = target.nextSibling;
    originalIds = getColumnIds();
    canAutoScroll = options.canAutoScroll?.(target) ?? true;
    if (e.type === 'dragstart') {
      options.onDragStart?.(target);
      // Native HTML5 drag: configure dataTransfer and auto-scroll
      // Add class immediately for native drag since it's committed
      target.classList.add(dragActiveClass);
      const de = e as DragEvent;
      if (de.dataTransfer) {
        de.dataTransfer.effectAllowed = 'move';
        // Store column id so the dropzone can identify which column was dragged
        if (typeof de.dataTransfer.setData === 'function') {
          de.dataTransfer.setData('text/plain', target.dataset.id ?? '');
        }
        // Explicit drag image avoids Firefox+Linux ghost rendering issues.
        // Use clientX/Y minus the target rect to get the offset relative to the
        // actual column header element (e.offsetX/Y is relative to e.target which
        // may be a child span, causing a wrong ghost position on Firefox/Linux).
        if (typeof de.dataTransfer.setDragImage === 'function') {
          const rect = target.getBoundingClientRect();
          de.dataTransfer.setDragImage(target, clientX - rect.left, clientY - rect.top);
        }
      }
      if (canAutoScroll) {
        document.addEventListener('drag', autoScrollHandler as EventListener);
      }
    } else {
      // Pointer fallback (mouse on FF/Linux, touch on all platforms)
      dragStartX = clientX;
      dragStartY = clientY;
      pointerDragCommitted = false;
      if ('touches' in e) {
        document.addEventListener('touchmove', onPointerMove as EventListener, { passive: false });
        document.addEventListener('touchend', onPointerUp as EventListener);
        document.addEventListener('touchcancel', onPointerUp as EventListener);
      } else {
        document.addEventListener('mousemove', onPointerMove as EventListener);
        document.addEventListener('mouseup', onPointerUp as EventListener);
      }
    }
  };

  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (draggedEl && dragStartX !== null && dragStartY !== null) {
      const { clientX, clientY, pageX } = getPointerPos(e);

      // Check if we've exceeded the drag threshold
      if (!pointerDragCommitted) {
        const deltaX = Math.abs(clientX - dragStartX);
        const deltaY = Math.abs(clientY - dragStartY);
        if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
          // Haven't moved far enough yet - don't commit to drag
          return;
        }
        // Threshold exceeded - now commit to drag
        e.preventDefault();
        options.onDragStart?.(draggedEl);
        createFallbackGhost(draggedEl, clientX, clientY);
        draggedEl.classList.add(dragActiveClass);
        // Disable text selection only after drag intent is confirmed
        document.body.style.userSelect = 'none';
        pointerDragCommitted = true;
      }

      // Always update ghost position for visual feedback once drag is committed
      updateFallbackGhost(clientX, clientY);

      e.preventDefault();

      if (canAutoScroll) {
        updateAutoScroll(pageX);
      }

      const elUnder = (() => {
        // Hide ghost temporarily so elementFromPoint doesn't hit it
        if (dragGhost) {
          dragGhost.style.display = 'none';
        }
        const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
        if (dragGhost) {
          dragGhost.style.display = '';
        }
        return el;
      })();
      const overDropzone = isOverDropzone(elUnder);
      if (overDropzone) {
        dropzoneTargetActive = true;
        toggleDropzoneHoverClass(elUnder, true);
      } else {
        dropzoneTargetActive = false;
        clearDropzoneHoverClasses();
        const targetHeader = elUnder?.closest?.(draggableSelector) as HTMLElement | null;
        if (targetHeader) {
          safely(() => {
            reorderDraggedAgainstTarget(targetHeader, clientX);
          });
        }
      }
    }
  };

  const cleanupPointerListeners = () => {
    document.removeEventListener('mousemove', onPointerMove as EventListener);
    document.removeEventListener('mouseup', onPointerUp as EventListener);
    document.removeEventListener('touchmove', onPointerMove as EventListener);
    document.removeEventListener('touchend', onPointerUp as EventListener);
    document.removeEventListener('touchcancel', onPointerUp as EventListener);
  };

  const onPointerUp = (e: MouseEvent | TouchEvent) => {
    cleanupPointerListeners();
    const draggedHeader = draggedEl;
    draggedHeader?.classList.remove(dragActiveClass);
    stopAutoScroll();

    const { clientX, clientY } = getPointerPos(e);
    let droppedOnDropzone = dropzoneTargetActive;
    safely(
      () => {
        if (!droppedOnDropzone) {
          const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
          if (el?.closest?.(dropzoneSelector)) {
            droppedOnDropzone = true;
          }
        }
      },
      () => {
        droppedOnDropzone = false;
      }
    );
    const originalParentNode = originalParent;
    const originalSiblingNode = originalNextSibling;
    if (droppedOnDropzone && draggedHeader && originalParentNode) {
      safely(() => {
        originalParentNode.insertBefore(draggedHeader, originalSiblingNode as Node | null);
      });
    }
    const reorderedIds = getColumnIds();
    if (pointerDragCommitted && droppedOnDropzone && draggedHeader) {
      options.onDrop?.(draggedHeader, e, draggedColumnId);
    } else if (pointerDragCommitted) {
      options.onDragEnd(reorderedIds, originalIds);
    }
    resetDragState();
    // Re-enable text selection after drag completes
    document.body.style.userSelect = '';
  };

  for (const parent of headers) {
    parent.addEventListener('dragstart', onStart as EventListener);
    parent.addEventListener('dragover', onDragOver as EventListener);
    parent.addEventListener('dragend', onDragEnd as EventListener);
    parent.addEventListener('drop', onHeaderDrop as EventListener);
    if (isFfLinux) {
      // Mouse-based fallback for Firefox on Linux
      parent.addEventListener('mousedown', onStart as EventListener, true);
    }
    // Touch fallback for all platforms (touch screens don't fire HTML5 drag events)
    parent.addEventListener('touchstart', onStart as EventListener, { passive: false });
  }

  function destroy() {
    for (const parent of headers) {
      parent.removeEventListener('dragstart', onStart as EventListener);
      parent.removeEventListener('dragover', onDragOver as EventListener);
      parent.removeEventListener('dragend', onDragEnd as EventListener);
      parent.removeEventListener('drop', onHeaderDrop as EventListener);
      if (isFfLinux) {
        parent.removeEventListener('mousedown', onStart as EventListener, true);
      }
      parent.removeEventListener('touchstart', onStart as EventListener);
    }
    document.removeEventListener('drag', autoScrollHandler as EventListener);
    cleanupPointerListeners();
    document.removeEventListener('dragenter', onDropzoneDragEnter as EventListener);
    document.removeEventListener('dragleave', onDropzoneDragLeave as EventListener);
    stopAutoScroll();
    resetDragState();
    headers.forEach((parent) =>
      Array.from(parent.querySelectorAll<HTMLElement>(draggableSelector)).forEach((el) => {
        el.draggable = false;
        el.classList.remove(dragActiveClass);
      })
    );
  }

  // public API
  return { destroy };
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Draggable,
    MouseWheel,
    reconcileColumnOrder,
    Resizable,
    setupColumnReorderDrag,
  });
}
