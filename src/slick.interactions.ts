import type { DragItem, DragPosition, DraggableOption, MouseWheelOption, ResizableOption } from './models/index.js';
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
    if (!preventDrag(event)) {
      element = event.target as HTMLElement;
      const targetEvent: MouseEvent | Touch = (event as TouchEvent)?.touches?.[0] ?? event;
      const { target } = targetEvent;

      if (!options.allowDragFrom || (options.allowDragFrom && (element.matches(options.allowDragFrom)) || (options.allowDragFromClosest && element.closest(options.allowDragFromClosest)))) {
        originaldd.dragHandle = element as HTMLElement;
        const winScrollPos = Utils.windowScrollPosition();
        startX = winScrollPos.left + targetEvent.clientX;
        startY = winScrollPos.top + targetEvent.clientY;
        deltaX = targetEvent.clientX - targetEvent.clientX;
        deltaY = targetEvent.clientY - targetEvent.clientY;
        originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
        const result = executeDragCallbackWhenDefined(onDragInit as (e: DragEvent, dd: DragPosition) => boolean | void, event, originaldd as DragItem);

        if (result !== false) {
          document.body.addEventListener('mousemove', userMoved);
          document.body.addEventListener('touchmove', userMoved);
          document.body.addEventListener('mouseup', userReleased);
          document.body.addEventListener('touchend', userReleased);
          document.body.addEventListener('touchcancel', userReleased);
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
        originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
        executeDragCallbackWhenDefined(onDragStart, event, originaldd as DragItem);
        dragStarted = true;
      }

      originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
      executeDragCallbackWhenDefined(onDrag, event, originaldd as DragItem);
    }
  }

  function userReleased(event: MouseEvent | TouchEvent) {
    document.body.removeEventListener('mousemove', userMoved);
    document.body.removeEventListener('touchmove', userMoved);
    document.body.removeEventListener('mouseup', userReleased);
    document.body.removeEventListener('touchend', userReleased);
    document.body.removeEventListener('touchcancel', userReleased);

    // trigger a dragEnd event only after dragging started and stopped
    if (dragStarted) {
      const { target } = event;
      originaldd = Object.assign(originaldd, { target });
      executeDragCallbackWhenDefined(onDragEnd, event, originaldd as DragItem);
      dragStarted = false;
    }
  }

  // initialize Slick.MouseWheel by attaching mousewheel event
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

  // initialize Slick.MouseWheel by attaching mousewheel event
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

  init();

  // public API
  return { destroy };
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    Draggable,
    MouseWheel,
    Resizable,
  });
}
