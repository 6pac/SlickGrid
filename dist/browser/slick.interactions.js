"use strict";
(() => {
  // src/slick.interactions.ts
  var Utils = Slick.Utils;
  function Draggable(options) {
    let { containerElement } = options, { onDragInit, onDragStart, onDrag, onDragEnd } = options, element, startX, startY, deltaX, deltaY, dragStarted;
    if (containerElement || (containerElement = document), !containerElement || typeof containerElement.addEventListener != "function")
      throw new Error("[Slick.Draggable] You did not provide a valid container html element that will be used for dragging.");
    let originaldd = {
      dragSource: containerElement,
      dragHandle: null
    };
    containerElement && (containerElement.addEventListener("mousedown", userPressed), containerElement.addEventListener("touchstart", userPressed));
    function executeDragCallbackWhenDefined(callback, e, dd) {
      typeof callback == "function" && callback(e, dd);
    }
    function destroy() {
      containerElement && (containerElement.removeEventListener("mousedown", userPressed), containerElement.removeEventListener("touchstart", userPressed));
    }
    function userPressed(event) {
      var _a, _b;
      element = event.target;
      let targetEvent = (_b = (_a = event == null ? void 0 : event.touches) == null ? void 0 : _a[0]) != null ? _b : event, { target } = targetEvent;
      if (!options.allowDragFrom || options.allowDragFrom && element.matches(options.allowDragFrom)) {
        originaldd.dragHandle = element;
        let winScrollPos = Utils.windowScrollPosition();
        startX = winScrollPos.left + targetEvent.clientX, startY = winScrollPos.top + targetEvent.clientY, deltaX = targetEvent.clientX - targetEvent.clientX, deltaY = targetEvent.clientY - targetEvent.clientY, originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragInit, event, originaldd), document.addEventListener("mousemove", userMoved), document.addEventListener("touchmove", userMoved), document.addEventListener("mouseup", userReleased), document.addEventListener("touchend", userReleased), document.addEventListener("touchcancel", userReleased);
      }
    }
    function userMoved(event) {
      var _a, _b;
      let targetEvent = (_b = (_a = event == null ? void 0 : event.touches) == null ? void 0 : _a[0]) != null ? _b : event;
      deltaX = targetEvent.clientX - startX, deltaY = targetEvent.clientY - startY;
      let { target } = targetEvent;
      dragStarted || (originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragStart, event, originaldd), dragStarted = !0), originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDrag, event, originaldd);
    }
    function userReleased(event) {
      let { target } = event;
      originaldd = Object.assign(originaldd, { target }), executeDragCallbackWhenDefined(onDragEnd, event, originaldd), document.removeEventListener("mousemove", userMoved), document.removeEventListener("touchmove", userMoved), document.removeEventListener("mouseup", userReleased), document.removeEventListener("touchend", userReleased), document.removeEventListener("touchcancel", userReleased), dragStarted = !1;
    }
    return { destroy };
  }
  function MouseWheel(options) {
    let { element, onMouseWheel } = options;
    function destroy() {
      element.removeEventListener("wheel", wheelHandler), element.removeEventListener("mousewheel", wheelHandler);
    }
    function init() {
      element.addEventListener("wheel", wheelHandler), element.addEventListener("mousewheel", wheelHandler);
    }
    function wheelHandler(event) {
      let orgEvent = event || window.event, delta = 0, deltaX = 0, deltaY = 0;
      orgEvent.wheelDelta && (delta = orgEvent.wheelDelta / 120), orgEvent.detail && (delta = -orgEvent.detail / 3), deltaY = delta, orgEvent.axis !== void 0 && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaY = 0, deltaX = -1 * delta), orgEvent.wheelDeltaY !== void 0 && (deltaY = orgEvent.wheelDeltaY / 120), orgEvent.wheelDeltaX !== void 0 && (deltaX = -1 * orgEvent.wheelDeltaX / 120), typeof onMouseWheel == "function" && onMouseWheel(event, delta, deltaX, deltaY);
    }
    return init(), { destroy };
  }
  function Resizable(options) {
    let { resizeableElement, resizeableHandleElement, onResizeStart, onResize, onResizeEnd } = options;
    if (!resizeableHandleElement || typeof resizeableHandleElement.addEventListener != "function")
      throw new Error("[Slick.Resizable] You did not provide a valid html element that will be used for the handle to resize.");
    function destroy() {
      typeof (resizeableHandleElement == null ? void 0 : resizeableHandleElement.removeEventListener) == "function" && (resizeableHandleElement.removeEventListener("mousedown", resizeStartHandler), resizeableHandleElement.removeEventListener("touchstart", resizeStartHandler));
    }
    function executeResizeCallbackWhenDefined(callback, e) {
      typeof callback == "function" && callback(e, { resizeableElement, resizeableHandleElement });
    }
    function resizeStartHandler(e) {
      e.preventDefault();
      let event = e.touches ? e.changedTouches[0] : e;
      executeResizeCallbackWhenDefined(onResizeStart, event), document.addEventListener("mousemove", resizingHandler), document.addEventListener("mouseup", resizeEndHandler), document.addEventListener("touchmove", resizingHandler), document.addEventListener("touchend", resizeEndHandler);
    }
    function resizingHandler(e) {
      e.preventDefault && e.type !== "touchmove" && e.preventDefault();
      let event = e.touches ? e.changedTouches[0] : e;
      typeof onResize == "function" && (onResize(event, { resizeableElement, resizeableHandleElement }), onResize(event, { resizeableElement, resizeableHandleElement }));
    }
    function resizeEndHandler(e) {
      let event = e.touches ? e.changedTouches[0] : e;
      executeResizeCallbackWhenDefined(onResizeEnd, event), document.removeEventListener("mousemove", resizingHandler), document.removeEventListener("mouseup", resizeEndHandler), document.removeEventListener("touchmove", resizingHandler), document.removeEventListener("touchend", resizeEndHandler);
    }
    return resizeableHandleElement.addEventListener("mousedown", resizeStartHandler), resizeableHandleElement.addEventListener("touchstart", resizeStartHandler), { destroy };
  }
  window.Slick && Utils.extend(Slick, {
    Draggable,
    MouseWheel,
    Resizable
  });
})();
//# sourceMappingURL=slick.interactions.js.map
