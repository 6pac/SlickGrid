import type { DraggableOption, MouseWheelOption, ResizableOption } from './models/index.js';
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
export declare function Draggable(options: DraggableOption): {
    destroy: () => void;
};
/**
 * MouseWheel Class, add mousewheel listeners and calculate delta values and return them in the callback function.
 * available optional options:
 *   - element: optional DOM element to attach mousewheel values, if undefined we'll attach it to the "window" object
 *   - onMouseWheel: mousewheel callback
 * @param {Object} options
 * @returns - MouseWheel instance which includes destroy method
 * @class MouseWheel
 */
export declare function MouseWheel(options: MouseWheelOption): {
    destroy: () => void;
};
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
export declare function Resizable(options: ResizableOption): {
    destroy: () => void;
};
//# sourceMappingURL=slick.interactions.d.ts.map