"use strict";
var Slick = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: !0 });
  }, __copyProps = (to, from, except, desc) => {
    if (from && typeof from == "object" || typeof from == "function")
      for (let key of __getOwnPropNames(from))
        !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

  // src/slick.core.js
  var slick_core_exports = {};
  __export(slick_core_exports, {
    BindingEventService: () => BindingEventService,
    ColAutosizeMode: () => ColAutosizeMode,
    EditorLock: () => EditorLock,
    Event: () => Event,
    EventData: () => EventData,
    EventHandler: () => EventHandler,
    GlobalEditorLock: () => GlobalEditorLock,
    GridAutosizeColsMode: () => GridAutosizeColsMode,
    Group: () => Group,
    GroupTotals: () => GroupTotals,
    NonDataItem: () => NonDataItem,
    Range: () => Range,
    RowSelectionMode: () => RowSelectionMode,
    Utils: () => Utils,
    ValueFilterMode: () => ValueFilterMode,
    WidthEvalMode: () => WidthEvalMode,
    keyCode: () => keyCode,
    preClickClassName: () => preClickClassName
  });
  function EventData(event, args) {
    this.event = event;
    let nativeEvent = event, arguments_ = args, isPropagationStopped = !1, isImmediatePropagationStopped = !1, isDefaultPrevented = !1, returnValues = [], returnValue;
    if (event) {
      let eventProps = [
        "altKey",
        "ctrlKey",
        "metaKey",
        "shiftKey",
        "key",
        "keyCode",
        "clientX",
        "clientY",
        "offsetX",
        "offsetY",
        "pageX",
        "pageY",
        "bubbles",
        "type",
        "which",
        "x",
        "y"
      ];
      for (let key of eventProps)
        this[key] = event[key];
    }
    this.target = nativeEvent ? nativeEvent.target : void 0, this.stopPropagation = function() {
      isPropagationStopped = !0, nativeEvent && nativeEvent.stopPropagation();
    }, this.isPropagationStopped = function() {
      return isPropagationStopped;
    }, this.stopImmediatePropagation = function() {
      isImmediatePropagationStopped = !0, nativeEvent && nativeEvent.stopImmediatePropagation();
    }, this.isImmediatePropagationStopped = function() {
      return isImmediatePropagationStopped;
    }, this.getNativeEvent = function() {
      return nativeEvent;
    }, this.preventDefault = function() {
      nativeEvent && nativeEvent.preventDefault(), isDefaultPrevented = !0;
    }, this.isDefaultPrevented = function() {
      return nativeEvent ? nativeEvent.defaultPrevented : isDefaultPrevented;
    }, this.addReturnValue = function(value) {
      returnValues.push(value), returnValue === void 0 && value !== void 0 && (returnValue = value);
    }, this.getReturnValue = function() {
      return returnValue;
    }, this.getArguments = function() {
      return arguments_;
    };
  }
  function Event() {
    var handlers = [];
    this.subscribe = function(fn) {
      handlers.push(fn);
    }, this.unsubscribe = function(fn) {
      for (var i = handlers.length - 1; i >= 0; i--)
        handlers[i] === fn && handlers.splice(i, 1);
    }, this.notify = function(args, e, scope) {
      e instanceof EventData || (e = new EventData(e, args)), scope = scope || this;
      for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
        let returnValue = handlers[i].call(scope, e, args);
        e.addReturnValue(returnValue);
      }
      return e;
    };
  }
  function EventHandler() {
    var handlers = [];
    this.subscribe = function(event, handler) {
      return handlers.push({
        event,
        handler
      }), event.subscribe(handler), this;
    }, this.unsubscribe = function(event, handler) {
      for (var i = handlers.length; i--; )
        if (handlers[i].event === event && handlers[i].handler === handler) {
          handlers.splice(i, 1), event.unsubscribe(handler);
          return;
        }
      return this;
    }, this.unsubscribeAll = function() {
      for (var i = handlers.length; i--; )
        handlers[i].event.unsubscribe(handlers[i].handler);
      return handlers = [], this;
    };
  }
  function Range(fromRow, fromCell, toRow, toCell) {
    toRow === void 0 && toCell === void 0 && (toRow = fromRow, toCell = fromCell), this.fromRow = Math.min(fromRow, toRow), this.fromCell = Math.min(fromCell, toCell), this.toRow = Math.max(fromRow, toRow), this.toCell = Math.max(fromCell, toCell), this.isSingleRow = function() {
      return this.fromRow == this.toRow;
    }, this.isSingleCell = function() {
      return this.fromRow == this.toRow && this.fromCell == this.toCell;
    }, this.contains = function(row, cell) {
      return row >= this.fromRow && row <= this.toRow && cell >= this.fromCell && cell <= this.toCell;
    }, this.toString = function() {
      return this.isSingleCell() ? "(" + this.fromRow + ":" + this.fromCell + ")" : "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
    };
  }
  function NonDataItem() {
    this.__nonDataRow = !0;
  }
  function Group() {
    this.__group = !0, this.level = 0, this.count = 0, this.value = null, this.title = null, this.collapsed = !1, this.selectChecked = !1, this.totals = null, this.rows = [], this.groups = null, this.groupingKey = null;
  }
  Group.prototype = new NonDataItem();
  Group.prototype.equals = function(group) {
    return this.value === group.value && this.count === group.count && this.collapsed === group.collapsed && this.title === group.title;
  };
  function GroupTotals() {
    this.__groupTotals = !0, this.group = null, this.initialized = !1;
  }
  GroupTotals.prototype = new NonDataItem();
  function EditorLock() {
    var activeEditController = null;
    this.isActive = function(editController) {
      return editController ? activeEditController === editController : activeEditController !== null;
    }, this.activate = function(editController) {
      if (editController !== activeEditController) {
        if (activeEditController !== null)
          throw new Error("SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController");
        if (!editController.commitCurrentEdit)
          throw new Error("SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()");
        if (!editController.cancelCurrentEdit)
          throw new Error("SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()");
        activeEditController = editController;
      }
    }, this.deactivate = function(editController) {
      if (activeEditController) {
        if (activeEditController !== editController)
          throw new Error("SlickGrid.EditorLock.deactivate: specified editController is not the currently active one");
        activeEditController = null;
      }
    }, this.commitCurrentEdit = function() {
      return activeEditController ? activeEditController.commitCurrentEdit() : !0;
    }, this.cancelCurrentEdit = function() {
      return activeEditController ? activeEditController.cancelCurrentEdit() : !0;
    };
  }
  function regexSanitizer(dirtyHtml) {
    return dirtyHtml.replace(/(\b)(on[a-z]+)(\s*)=|javascript:([^>]*)[^>]*|(<\s*)(\/*)script([<>]*).*(<\s*)(\/*)script(>*)|(&lt;)(\/*)(script|script defer)(.*)(&gt;|&gt;">)/gi, "");
  }
  function calculateAvailableSpace(element) {
    let bottom = 0, top = 0, left = 0, right = 0, windowHeight = window.innerHeight || 0, windowWidth = window.innerWidth || 0, scrollPosition = windowScrollPosition(), pageScrollTop = scrollPosition.top, pageScrollLeft = scrollPosition.left, elmOffset = offset(element);
    if (elmOffset) {
      let elementOffsetTop = elmOffset.top || 0, elementOffsetLeft = elmOffset.left || 0;
      top = elementOffsetTop - pageScrollTop, bottom = windowHeight - (elementOffsetTop - pageScrollTop), left = elementOffsetLeft - pageScrollLeft, right = windowWidth - (elementOffsetLeft - pageScrollLeft);
    }
    return { top, bottom, left, right };
  }
  function createDomElement(tagName, elementOptions, appendToParent) {
    let elm = document.createElement(tagName);
    return elementOptions && Object.keys(elementOptions).forEach((elmOptionKey) => {
      let elmValue = elementOptions[elmOptionKey];
      typeof elmValue == "object" ? Object.assign(elm[elmOptionKey], elmValue) : elm[elmOptionKey] = elementOptions[elmOptionKey];
    }), appendToParent && appendToParent.appendChild && appendToParent.appendChild(elm), elm;
  }
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      wait >= 0 ? (clearTimeout(timeoutId), timeoutId = setTimeout(() => callback.apply(null, args), wait)) : callback.apply(null);
    };
  }
  function emptyElement(element) {
    if (element && element.firstChild)
      for (; element.firstChild; )
        element.lastChild && element.removeChild(element.lastChild);
    return element;
  }
  function innerSize(elm, type) {
    let size = 0;
    if (elm) {
      let clientSize = type === "height" ? "clientHeight" : "clientWidth", sides = type === "height" ? ["top", "bottom"] : ["left", "right"];
      size = elm[clientSize];
      for (let side of sides) {
        let sideSize = parseFloat(getElementProp(elm, `padding-${side}`)) || 0;
        size -= sideSize;
      }
    }
    return size;
  }
  function getElementProp(elm, property) {
    return elm && elm.getComputedStyle ? window.getComputedStyle(elm, null).getPropertyValue(property) : null;
  }
  function isEmptyObject(obj) {
    return obj == null ? !0 : Object.entries(obj).length === 0;
  }
  function noop() {
  }
  function offset(el) {
    if (!el || !el.getBoundingClientRect)
      return;
    let box = el.getBoundingClientRect(), docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }
  function windowScrollPosition() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || 0
    };
  }
  function width(el, value) {
    if (!(!el || !el.getBoundingClientRect)) {
      if (value === void 0)
        return el.getBoundingClientRect().width;
      setStyleSize(el, "width", value);
    }
  }
  function height(el, value) {
    if (el) {
      if (value === void 0)
        return el.getBoundingClientRect().height;
      setStyleSize(el, "height", value);
    }
  }
  function setStyleSize(el, style, val) {
    typeof val == "function" ? val = val() : typeof val == "string" ? el.style[style] = val : el.style[style] = val + "px";
  }
  function contains(parent, child) {
    return !parent || !child ? !1 : !parents(child).every(function(p) {
      return parent != p;
    });
  }
  function isHidden(el) {
    return el.offsetWidth === 0 && el.offsetHeight === 0;
  }
  function parents(el, selector) {
    let parents2 = [], visible = selector == ":visible", hidden = selector == ":hidden";
    for (; (el = el.parentNode) && el !== document && !(!el || !el.parentNode); )
      hidden ? isHidden(el) && parents2.push(el) : visible ? isHidden(el) || parents2.push(el) : (!selector || el.matches(selector)) && parents2.push(el);
    return parents2;
  }
  function toFloat(value) {
    var x = parseFloat(value);
    return isNaN(x) ? 0 : x;
  }
  function show(el, type) {
    type = type || "", Array.isArray(el) ? el.forEach(function(e) {
      e.style.display = type;
    }) : el.style.display = type;
  }
  function hide(el) {
    Array.isArray(el) ? el.forEach(function(e) {
      e.style.display = "none";
    }) : el.style.display = "none";
  }
  function slideUp(el, callback) {
    return slideAnimation(el, "slideUp", callback);
  }
  function slideDown(el, callback) {
    return slideAnimation(el, "slideDown", callback);
  }
  function slideAnimation(el, slideDirection, callback) {
    if (window.jQuery !== void 0) {
      window.jQuery(el)[slideDirection]("fast", callback);
      return;
    }
    slideDirection === "slideUp" ? hide(el) : show(el), callback();
  }
  var getProto = Object.getPrototypeOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object);
  function isFunction(obj) {
    return typeof obj == "function" && typeof obj.nodeType != "number" && typeof obj.item != "function";
  }
  function isPlainObject(obj) {
    var proto, Ctor;
    return !obj || toString.call(obj) !== "[object Object]" ? !1 : (proto = getProto(obj), proto ? (Ctor = hasOwn.call(proto, "constructor") && proto.constructor, typeof Ctor == "function" && fnToString.call(Ctor) === ObjectFunctionString) : !0);
  }
  function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0], i = 1, length = arguments.length, deep = !1;
    for (typeof target == "boolean" ? (deep = target, target = arguments[i] || {}, i++) : target = target || {}, typeof target != "object" && !isFunction(target) && (target = {}), i === length && (target = this, i--); i < length; i++)
      if ((options = arguments[i]) != null)
        for (name in options)
          copy = options[name], !(name === "__proto__" || target === copy) && (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ? (src = target[name], copyIsArray && !Array.isArray(src) ? clone = [] : !copyIsArray && !isPlainObject(src) ? clone = {} : clone = src, copyIsArray = !1, target[name] = extend(deep, clone, copy)) : copy !== void 0 && (target[name] = copy));
    return target;
  }
  function BindingEventService() {
    this.boundedEvents = [], this.destroy = function() {
      this.unbindAll(), this.boundedEvents = [];
    }, this.bind = function(element, eventName, listener, options) {
      element.addEventListener(eventName, listener, options), this.boundedEvents.push({ element, eventName, listener });
    }, this.unbind = function(element, eventName, listener) {
      element && element.removeEventListener && element.removeEventListener(eventName, listener);
    }, this.unbindByEventName = function(element, eventName) {
      let boundedEvent = this.boundedEvents.find((e) => e.element === element && e.eventName === eventName);
      boundedEvent && this.unbind(boundedEvent.element, boundedEvent.eventName, boundedEvent.listener);
    }, this.unbindAll = function() {
      for (; this.boundedEvents.length > 0; ) {
        let boundedEvent = this.boundedEvents.pop(), { element, eventName, listener } = boundedEvent;
        this.unbind(element, eventName, listener);
      }
    };
  }
  var SlickCore = {
    // "Event": Event,
    // "EventData": EventData,
    // "EventHandler": EventHandler,
    // "Range": Range,
    // "NonDataRow": NonDataItem,
    // "Group": Group,
    // "GroupTotals": GroupTotals,
    // "EditorLock": EditorLock,
    RegexSanitizer: regexSanitizer,
    // "BindingEventService": BindingEventService,
    Utils: {
      debounce,
      extend,
      calculateAvailableSpace,
      createDomElement,
      emptyElement,
      innerSize,
      isEmptyObject,
      noop,
      offset,
      height,
      width,
      setStyleSize,
      contains,
      toFloat,
      parents,
      show,
      hide,
      slideUp,
      slideDown,
      storage: {
        // https://stackoverflow.com/questions/29222027/vanilla-alternative-to-jquery-data-function-any-native-javascript-alternati
        _storage: /* @__PURE__ */ new WeakMap(),
        put: function(element, key, obj) {
          this._storage.has(element) || this._storage.set(element, /* @__PURE__ */ new Map()), this._storage.get(element).set(key, obj);
        },
        get: function(element, key) {
          let el = this._storage.get(element);
          return el ? el.get(key) : null;
        },
        remove: function(element, key) {
          var ret = this._storage.get(element).delete(key);
          return !this._storage.get(element).size === 0 && this._storage.delete(element), ret;
        }
      }
    },
    /***
     * A global singleton editor lock.
     * @class GlobalEditorLock
     * @static
     * @constructor
     */
    GlobalEditorLock: new EditorLock(),
    keyCode: {
      SPACE: 8,
      BACKSPACE: 8,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      INSERT: 45,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      RIGHT: 39,
      TAB: 9,
      UP: 38,
      A: 65
    },
    preClickClassName: "slick-edit-preclick",
    GridAutosizeColsMode: {
      None: "NOA",
      LegacyOff: "LOF",
      LegacyForceFit: "LFF",
      IgnoreViewport: "IGV",
      FitColsToViewport: "FCV",
      FitViewportToCols: "FVC"
    },
    ColAutosizeMode: {
      Locked: "LCK",
      Guide: "GUI",
      Content: "CON",
      ContentExpandOnly: "CXO",
      ContentIntelligent: "CTI"
    },
    RowSelectionMode: {
      FirstRow: "FS1",
      FirstNRows: "FSN",
      AllRows: "ALL",
      LastRow: "LS1"
    },
    ValueFilterMode: {
      None: "NONE",
      DeDuplicate: "DEDP",
      GetGreatestAndSub: "GR8T",
      GetLongestTextAndSub: "LNSB",
      GetLongestText: "LNSC"
    },
    WidthEvalMode: {
      Auto: "AUTO",
      TextOnly: "CANV",
      HTML: "HTML"
    }
  }, {
    Utils,
    GlobalEditorLock,
    keyCode,
    preClickClassName,
    GridAutosizeColsMode,
    ColAutosizeMode,
    RowSelectionMode,
    ValueFilterMode,
    WidthEvalMode
  } = SlickCore;
  typeof global != "undefined" && window.Slick && (global.Slick = window.Slick);
  return __toCommonJS(slick_core_exports);
})();
