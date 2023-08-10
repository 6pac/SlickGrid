"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:./slick.core.js"() {
    }
  });

  // src/slick.interactions.js
  var require_slick_interactions = __commonJS({
    "src/slick.interactions.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.Resizable = exports.MouseWheel = exports.Draggable = void 0;
      var slick_core_1 = require_slick_core(), Utils = Slick.Utils;
      function Draggable(options) {
        var containerElement = options.containerElement, onDragInit = options.onDragInit, onDragStart = options.onDragStart, onDrag = options.onDrag, onDragEnd = options.onDragEnd, element, startX, startY, deltaX, deltaY, dragStarted;
        if (containerElement || (containerElement = document), !containerElement || typeof containerElement.addEventListener != "function")
          throw new Error("[Slick.Draggable] You did not provide a valid container html element that will be used for dragging.");
        var originaldd = {
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
          var targetEvent = (_b = (_a = event == null ? void 0 : event.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : event, target = targetEvent.target;
          if (!options.allowDragFrom || options.allowDragFrom && element.matches(options.allowDragFrom)) {
            originaldd.dragHandle = element;
            var winScrollPos = Utils.windowScrollPosition();
            startX = winScrollPos.left + targetEvent.clientX, startY = winScrollPos.top + targetEvent.clientY, deltaX = targetEvent.clientX - targetEvent.clientX, deltaY = targetEvent.clientY - targetEvent.clientY, originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragInit, event, originaldd), document.addEventListener("mousemove", userMoved), document.addEventListener("touchmove", userMoved), document.addEventListener("mouseup", userReleased), document.addEventListener("touchend", userReleased), document.addEventListener("touchcancel", userReleased);
          }
        }
        function userMoved(event) {
          var _a, _b, targetEvent = (_b = (_a = event == null ? void 0 : event.touches) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : event;
          deltaX = targetEvent.clientX - startX, deltaY = targetEvent.clientY - startY;
          var target = targetEvent.target;
          dragStarted || (originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragStart, event, originaldd), dragStarted = !0), originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDrag, event, originaldd);
        }
        function userReleased(event) {
          var target = event.target;
          originaldd = Object.assign(originaldd, { target }), executeDragCallbackWhenDefined(onDragEnd, event, originaldd), document.removeEventListener("mousemove", userMoved), document.removeEventListener("touchmove", userMoved), document.removeEventListener("mouseup", userReleased), document.removeEventListener("touchend", userReleased), document.removeEventListener("touchcancel", userReleased), dragStarted = !1;
        }
        return { destroy };
      }
      exports.Draggable = Draggable;
      function MouseWheel(options) {
        var element = options.element, onMouseWheel = options.onMouseWheel;
        function destroy() {
          element.removeEventListener("wheel", wheelHandler), element.removeEventListener("mousewheel", wheelHandler);
        }
        function init() {
          element.addEventListener("wheel", wheelHandler), element.addEventListener("mousewheel", wheelHandler);
        }
        function wheelHandler(event) {
          var orgEvent = event || window.event, delta = 0, deltaX = 0, deltaY = 0;
          orgEvent.wheelDelta && (delta = orgEvent.wheelDelta / 120), orgEvent.detail && (delta = -orgEvent.detail / 3), deltaY = delta, orgEvent.axis !== void 0 && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaY = 0, deltaX = -1 * delta), orgEvent.wheelDeltaY !== void 0 && (deltaY = orgEvent.wheelDeltaY / 120), orgEvent.wheelDeltaX !== void 0 && (deltaX = -1 * orgEvent.wheelDeltaX / 120), typeof onMouseWheel == "function" && onMouseWheel(event, delta, deltaX, deltaY);
        }
        return init(), { destroy };
      }
      exports.MouseWheel = MouseWheel;
      function Resizable(options) {
        var resizeableElement = options.resizeableElement, resizeableHandleElement = options.resizeableHandleElement, onResizeStart = options.onResizeStart, onResize = options.onResize, onResizeEnd = options.onResizeEnd;
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
          var event = e.touches ? e.changedTouches[0] : e;
          executeResizeCallbackWhenDefined(onResizeStart, event), document.addEventListener("mousemove", resizingHandler), document.addEventListener("mouseup", resizeEndHandler), document.addEventListener("touchmove", resizingHandler), document.addEventListener("touchend", resizeEndHandler);
        }
        function resizingHandler(e) {
          e.preventDefault && e.type !== "touchmove" && e.preventDefault();
          var event = e.touches ? e.changedTouches[0] : e;
          typeof onResize == "function" && (onResize(event, { resizeableElement, resizeableHandleElement }), onResize(event, { resizeableElement, resizeableHandleElement }));
        }
        function resizeEndHandler(e) {
          var event = e.touches ? e.changedTouches[0] : e;
          executeResizeCallbackWhenDefined(onResizeEnd, event), document.removeEventListener("mousemove", resizingHandler), document.removeEventListener("mouseup", resizeEndHandler), document.removeEventListener("touchmove", resizingHandler), document.removeEventListener("touchend", resizeEndHandler);
        }
        return resizeableHandleElement.addEventListener("mousedown", resizeStartHandler), resizeableHandleElement.addEventListener("touchstart", resizeStartHandler), { destroy };
      }
      exports.Resizable = Resizable;
      window.Slick && Utils.extend(Slick, {
        Draggable,
        MouseWheel,
        Resizable
      });
    }
  });
  require_slick_interactions();
})();
//# sourceMappingURL=slick.interactions.js.map
