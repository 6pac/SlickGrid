import type { DraggableOption, MouseWheelOption, ResizableOption } from './models/index';
import { Utils as Utils_ } from './slick.core';

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
  const { onDragInit, onDragStart, onDrag, onDragEnd } = options;
  let element: HTMLElement | null, startX: number, startY: number, deltaX: number, deltaY: number, dragStarted: boolean;

  if (!containerElement) {
    containerElement = document;
  }
  if (!containerElement || typeof containerElement.addEventListener !== 'function') {
    throw new Error('[Slick.Draggable] You did not provide a valid container html element that will be used for dragging.');
  }

  let originaldd: { dragSource: HTMLElement | Document | null, dragHandle: HTMLElement | null } = {
    dragSource: containerElement,
    dragHandle: null,
  };

  if (containerElement) {
    containerElement.addEventListener('mousedown', userPressed as EventListener);
    containerElement.addEventListener('touchstart', userPressed as EventListener);
  }

  function executeDragCallbackWhenDefined(callback?: Function, e?: MouseEvent | Touch | TouchEvent, dd?: any) {
    if (typeof callback === 'function') {
      callback(e, dd);
    }
  }

  function destroy() {
    if (containerElement) {
      containerElement.removeEventListener('mousedown', userPressed as EventListener);
      containerElement.removeEventListener('touchstart', userPressed as EventListener);
    }
  }

  function userPressed(event: MouseEvent | TouchEvent) {
    element = event.target as HTMLElement;
    const targetEvent: MouseEvent | Touch = (event as TouchEvent)?.touches?.[0] ?? event;
    const { target } = targetEvent;

    if (!options.allowDragFrom || (options.allowDragFrom && element.matches(options.allowDragFrom))) {
      originaldd.dragHandle = element as HTMLElement;
      const winScrollPos = Utils.windowScrollPosition();
      startX = winScrollPos.left + targetEvent.clientX;
      startY = winScrollPos.top + targetEvent.clientY;
      deltaX = targetEvent.clientX - targetEvent.clientX;
      deltaY = targetEvent.clientY - targetEvent.clientY;
      originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
      executeDragCallbackWhenDefined(onDragInit as Function, event, originaldd);

      document.addEventListener('mousemove', userMoved);
      document.addEventListener('touchmove', userMoved);
      document.addEventListener('mouseup', userReleased);
      document.addEventListener('touchend', userReleased);
      document.addEventListener('touchcancel', userReleased);
    }
  }

  function userMoved(event: MouseEvent | TouchEvent) {
    const targetEvent: MouseEvent | Touch = (event as TouchEvent)?.touches?.[0] ?? event;
    deltaX = targetEvent.clientX - startX;
    deltaY = targetEvent.clientY - startY;
    const { target } = targetEvent;

    if (!dragStarted) {
      originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
      executeDragCallbackWhenDefined(onDragStart, event, originaldd);
      dragStarted = true;
    }

    originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target });
    executeDragCallbackWhenDefined(onDrag, event, originaldd);
  }

  function userReleased(event: MouseEvent | TouchEvent) {
    const { target } = event;
    originaldd = Object.assign(originaldd, { target });
    executeDragCallbackWhenDefined(onDragEnd, event, originaldd);
    document.removeEventListener('mousemove', userMoved);
    document.removeEventListener('touchmove', userMoved);
    document.removeEventListener('mouseup', userReleased);
    document.removeEventListener('touchend', userReleased);
    document.removeEventListener('touchcancel', userReleased);
    dragStarted = false;
  }

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
    const orgEvent = event || window.event
    let delta = 0, deltaX = 0, deltaY = 0;

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

  function destroy() {
    if (typeof resizeableHandleElement?.removeEventListener === 'function') {
      resizeableHandleElement.removeEventListener('mousedown', resizeStartHandler);
      resizeableHandleElement.removeEventListener('touchstart', resizeStartHandler);
    }
  }

  function executeResizeCallbackWhenDefined(callback?: Function, e?: MouseEvent | TouchEvent | Touch) {
    if (typeof callback === 'function') {
      callback(e, { resizeableElement, resizeableHandleElement });
    }
  }

  function resizeStartHandler(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    executeResizeCallbackWhenDefined(onResizeStart, event);
    document.addEventListener('mousemove', resizingHandler);
    document.addEventListener('mouseup', resizeEndHandler);
    document.addEventListener('touchmove', resizingHandler);
    document.addEventListener('touchend', resizeEndHandler);
  }

  function resizingHandler(e: MouseEvent | TouchEvent) {
    if (e.preventDefault && e.type !== 'touchmove') {
      e.preventDefault();
    }
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    if (typeof onResize === 'function') {
      onResize(event, { resizeableElement, resizeableHandleElement });
      onResize(event, { resizeableElement, resizeableHandleElement });
    }
  }

  /** Remove all mouse/touch handlers */
  function resizeEndHandler(e: MouseEvent | TouchEvent) {
    const event = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e;
    executeResizeCallbackWhenDefined(onResizeEnd, event);
    document.removeEventListener('mousemove', resizingHandler);
    document.removeEventListener('mouseup', resizeEndHandler);
    document.removeEventListener('touchmove', resizingHandler);
    document.removeEventListener('touchend', resizeEndHandler);
  }

  // add event listeners on the draggable element
  resizeableHandleElement.addEventListener('mousedown', resizeStartHandler);
  resizeableHandleElement.addEventListener('touchstart', resizeStartHandler);

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
