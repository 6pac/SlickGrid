"use strict";
var Slick = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/slick.core.js
  var require_slick_core = __commonJS({
    "src/slick.core.js"(exports) {
      var __extends = exports && exports.__extends || function() {
        var extendStatics = function(d, b) {
          return extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2)
              Object.prototype.hasOwnProperty.call(b2, p) && (d2[p] = b2[p]);
          }, extendStatics(d, b);
        };
        return function(d, b) {
          if (typeof b != "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.WidthEvalMode = exports.ValueFilterMode = exports.RowSelectionMode = exports.ColAutosizeMode = exports.GridAutosizeColsMode = exports.preClickClassName = exports.keyCode = exports.GlobalEditorLock = exports.RegexSanitizer = exports.Range = exports.NonDataRow = exports.GroupTotals = exports.Group = exports.EventHandler = exports.EventData = exports.Event = exports.EditorLock = exports.Utils = exports.SlickGlobalEditorLock = exports.BindingEventService = exports.SlickEditorLock = exports.SlickGroupTotals = exports.SlickGroup = exports.SlickNonDataItem = exports.SlickRange = exports.SlickEventHandler = exports.SlickEvent = exports.SlickEventData = void 0;
      var SlickEventData = (
        /** @class */
        function() {
          function SlickEventData2(event, args) {
            if (this.event = event, this.args = args, this._isPropagationStopped = !1, this._isImmediatePropagationStopped = !1, this._isDefaultPrevented = !1, this.returnValues = [], this.returnValue = void 0, this.nativeEvent = event, this.arguments_ = args, event)
              for (var eventProps = [
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
              ], _i = 0, eventProps_1 = eventProps; _i < eventProps_1.length; _i++) {
                var key = eventProps_1[_i];
                this[key] = event[key];
              }
            this.target = this.nativeEvent ? this.nativeEvent.target : void 0;
          }
          return SlickEventData2.prototype.stopPropagation = function() {
            var _a;
            this._isPropagationStopped = !0, (_a = this.nativeEvent) === null || _a === void 0 || _a.stopPropagation();
          }, SlickEventData2.prototype.isPropagationStopped = function() {
            return this._isPropagationStopped;
          }, SlickEventData2.prototype.stopImmediatePropagation = function() {
            this._isImmediatePropagationStopped = !0, this.nativeEvent && this.nativeEvent.stopImmediatePropagation();
          }, SlickEventData2.prototype.isImmediatePropagationStopped = function() {
            return this._isImmediatePropagationStopped;
          }, SlickEventData2.prototype.getNativeEvent = function() {
            return this.nativeEvent;
          }, SlickEventData2.prototype.preventDefault = function() {
            this.nativeEvent && this.nativeEvent.preventDefault(), this._isDefaultPrevented = !0;
          }, SlickEventData2.prototype.isDefaultPrevented = function() {
            return this.nativeEvent ? this.nativeEvent.defaultPrevented : this._isDefaultPrevented;
          }, SlickEventData2.prototype.addReturnValue = function(value) {
            this.returnValues.push(value), this.returnValue === void 0 && value !== void 0 && (this.returnValue = value);
          }, SlickEventData2.prototype.getReturnValue = function() {
            return this.returnValue;
          }, SlickEventData2.prototype.getArguments = function() {
            return this.arguments_;
          }, SlickEventData2;
        }()
      );
      exports.SlickEventData = SlickEventData;
      var SlickEvent = (
        /** @class */
        function() {
          function SlickEvent2() {
            this.handlers = [];
          }
          return SlickEvent2.prototype.subscribe = function(fn) {
            this.handlers.push(fn);
          }, SlickEvent2.prototype.unsubscribe = function(fn) {
            for (var i = this.handlers.length - 1; i >= 0; i--)
              this.handlers[i] === fn && this.handlers.splice(i, 1);
          }, SlickEvent2.prototype.notify = function(args, evt, scope) {
            var sed = evt instanceof SlickEventData ? evt : new SlickEventData(evt, args);
            scope = scope || this;
            for (var i = 0; i < this.handlers.length && !(sed.isPropagationStopped() || sed.isImmediatePropagationStopped()); i++) {
              var returnValue = this.handlers[i].call(scope, sed, args);
              sed.addReturnValue(returnValue);
            }
            return sed;
          }, SlickEvent2;
        }()
      );
      exports.SlickEvent = SlickEvent;
      var SlickEventHandler = (
        /** @class */
        function() {
          function SlickEventHandler2() {
            this.handlers = [];
          }
          return SlickEventHandler2.prototype.subscribe = function(event, handler) {
            return this.handlers.push({ event, handler }), event.subscribe(handler), this;
          }, SlickEventHandler2.prototype.unsubscribe = function(event, handler) {
            for (var i = this.handlers.length; i--; )
              if (this.handlers[i].event === event && this.handlers[i].handler === handler) {
                this.handlers.splice(i, 1), event.unsubscribe(handler);
                return;
              }
            return this;
          }, SlickEventHandler2.prototype.unsubscribeAll = function() {
            for (var i = this.handlers.length; i--; )
              this.handlers[i].event.unsubscribe(this.handlers[i].handler);
            return this.handlers = [], this;
          }, SlickEventHandler2;
        }()
      );
      exports.SlickEventHandler = SlickEventHandler;
      var SlickRange = (
        /** @class */
        function() {
          function SlickRange2(fromRow, fromCell, toRow, toCell) {
            toRow === void 0 && toCell === void 0 && (toRow = fromRow, toCell = fromCell), this.fromRow = Math.min(fromRow, toRow), this.fromCell = Math.min(fromCell, toCell), this.toRow = Math.max(fromRow, toRow), this.toCell = Math.max(fromCell, toCell);
          }
          return SlickRange2.prototype.isSingleRow = function() {
            return this.fromRow == this.toRow;
          }, SlickRange2.prototype.isSingleCell = function() {
            return this.fromRow == this.toRow && this.fromCell == this.toCell;
          }, SlickRange2.prototype.contains = function(row, cell) {
            return row >= this.fromRow && row <= this.toRow && cell >= this.fromCell && cell <= this.toCell;
          }, SlickRange2.prototype.toString = function() {
            return this.isSingleCell() ? "(".concat(this.fromRow, ":").concat(this.fromCell, ")") : "(".concat(this.fromRow, ":").concat(this.fromCell, " - ").concat(this.toRow, ":").concat(this.toCell, ")");
          }, SlickRange2;
        }()
      );
      exports.SlickRange = SlickRange;
      var SlickNonDataItem = (
        /** @class */
        function() {
          function SlickNonDataItem2() {
            this.__nonDataRow = !0;
          }
          return SlickNonDataItem2;
        }()
      );
      exports.SlickNonDataItem = SlickNonDataItem;
      var SlickGroup = (
        /** @class */
        function(_super) {
          __extends(SlickGroup2, _super);
          function SlickGroup2() {
            var _this = _super.call(this) || this;
            return _this.__group = !0, _this.level = 0, _this.count = 0, _this.value = null, _this.title = null, _this.collapsed = !1, _this.selectChecked = !1, _this.totals = null, _this.rows = [], _this.groups = null, _this.groupingKey = null, _this;
          }
          return SlickGroup2.prototype.equals = function(group) {
            return this.value === group.value && this.count === group.count && this.collapsed === group.collapsed && this.title === group.title;
          }, SlickGroup2;
        }(SlickNonDataItem)
      );
      exports.SlickGroup = SlickGroup;
      var SlickGroupTotals = (
        /** @class */
        function(_super) {
          __extends(SlickGroupTotals2, _super);
          function SlickGroupTotals2() {
            var _this = _super.call(this) || this;
            return _this.__groupTotals = !0, _this.group = null, _this.initialized = !1, _this;
          }
          return SlickGroupTotals2;
        }(SlickNonDataItem)
      );
      exports.SlickGroupTotals = SlickGroupTotals;
      var SlickEditorLock = (
        /** @class */
        function() {
          function SlickEditorLock2() {
            this.activeEditController = null;
          }
          return SlickEditorLock2.prototype.isActive = function(editController) {
            return editController ? this.activeEditController === editController : this.activeEditController !== null;
          }, SlickEditorLock2.prototype.activate = function(editController) {
            if (editController !== this.activeEditController) {
              if (this.activeEditController !== null)
                throw new Error("Slick.EditorLock.activate: an editController is still active, can't activate another editController");
              if (!editController.commitCurrentEdit)
                throw new Error("Slick.EditorLock.activate: editController must implement .commitCurrentEdit()");
              if (!editController.cancelCurrentEdit)
                throw new Error("Slick.EditorLock.activate: editController must implement .cancelCurrentEdit()");
              this.activeEditController = editController;
            }
          }, SlickEditorLock2.prototype.deactivate = function(editController) {
            if (this.activeEditController) {
              if (this.activeEditController !== editController)
                throw new Error("Slick.EditorLock.deactivate: specified editController is not the currently active one");
              this.activeEditController = null;
            }
          }, SlickEditorLock2.prototype.commitCurrentEdit = function() {
            return this.activeEditController ? this.activeEditController.commitCurrentEdit() : !0;
          }, SlickEditorLock2.prototype.cancelCurrentEdit = function() {
            return this.activeEditController ? this.activeEditController.cancelCurrentEdit() : !0;
          }, SlickEditorLock2;
        }()
      );
      exports.SlickEditorLock = SlickEditorLock;
      function regexSanitizer(dirtyHtml) {
        return dirtyHtml.replace(/(\b)(on[a-z]+)(\s*)=|javascript:([^>]*)[^>]*|(<\s*)(\/*)script([<>]*).*(<\s*)(\/*)script(>*)|(&lt;)(\/*)(script|script defer)(.*)(&gt;|&gt;">)/gi, "");
      }
      function calculateAvailableSpace(element) {
        var bottom = 0, top = 0, left = 0, right = 0, windowHeight = window.innerHeight || 0, windowWidth = window.innerWidth || 0, scrollPosition = windowScrollPosition(), pageScrollTop = scrollPosition.top, pageScrollLeft = scrollPosition.left, elmOffset = offset(element);
        if (elmOffset) {
          var elementOffsetTop = elmOffset.top || 0, elementOffsetLeft = elmOffset.left || 0;
          top = elementOffsetTop - pageScrollTop, bottom = windowHeight - (elementOffsetTop - pageScrollTop), left = elementOffsetLeft - pageScrollLeft, right = windowWidth - (elementOffsetLeft - pageScrollLeft);
        }
        return { top, bottom, left, right };
      }
      function createDomElement(tagName, elementOptions, appendToParent) {
        var elm = document.createElement(tagName);
        return elementOptions && Object.keys(elementOptions).forEach(function(elmOptionKey) {
          var elmValue = elementOptions[elmOptionKey];
          typeof elmValue == "object" ? Object.assign(elm[elmOptionKey], elmValue) : elm[elmOptionKey] = elementOptions[elmOptionKey];
        }), appendToParent != null && appendToParent.appendChild && appendToParent.appendChild(elm), elm;
      }
      function emptyElement(element) {
        if (element != null && element.firstChild)
          for (; element.firstChild; )
            element.lastChild && element.removeChild(element.lastChild);
        return element;
      }
      function innerSize(elm, type) {
        var size = 0;
        if (elm) {
          var clientSize = type === "height" ? "clientHeight" : "clientWidth", sides = type === "height" ? ["top", "bottom"] : ["left", "right"];
          size = elm[clientSize];
          for (var _i = 0, sides_1 = sides; _i < sides_1.length; _i++) {
            var side = sides_1[_i], sideSize = parseFloat(getElementProp(elm, "padding-".concat(side)) || "") || 0;
            size -= sideSize;
          }
        }
        return size;
      }
      function getElementProp(elm, property) {
        return elm != null && elm.getComputedStyle ? window.getComputedStyle(elm, null).getPropertyValue(property) : null;
      }
      function isEmptyObject(obj) {
        return obj == null ? !0 : Object.entries(obj).length === 0;
      }
      function noop() {
      }
      function offset(el) {
        if (!(!el || !el.getBoundingClientRect)) {
          var box = el.getBoundingClientRect(), docElem = document.documentElement;
          return {
            top: box.top + window.pageYOffset - docElem.clientTop,
            left: box.left + window.pageXOffset - docElem.clientLeft
          };
        }
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
        if (!parent || !child)
          return !1;
        var parentList = parents(child);
        return !parentList.every(function(p) {
          return parent != p;
        });
      }
      function isHidden(el) {
        return el.offsetWidth === 0 && el.offsetHeight === 0;
      }
      function parents(el, selector) {
        for (var parents2 = [], visible = selector == ":visible", hidden = selector == ":hidden"; (el = el.parentNode) && el !== document && !(!el || !el.parentNode); )
          hidden ? isHidden(el) && parents2.push(el) : visible ? isHidden(el) || parents2.push(el) : (!selector || el.matches(selector)) && parents2.push(el);
        return parents2;
      }
      function toFloat(value) {
        var x = parseFloat(value);
        return isNaN(x) ? 0 : x;
      }
      function show(el, type) {
        type === void 0 && (type = ""), Array.isArray(el) ? el.forEach(function(e) {
          return e.style.display = type;
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
      function applyDefaults(targetObj, srcObj) {
        for (var key in srcObj)
          srcObj.hasOwnProperty(key) && !targetObj.hasOwnProperty(key) && (targetObj[key] = srcObj[key]);
      }
      var getProto = Object.getPrototypeOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object);
      function isFunction(obj) {
        return typeof obj == "function" && typeof obj.nodeType != "number" && typeof obj.item != "function";
      }
      function isPlainObject(obj) {
        if (!obj || toString.call(obj) !== "[object Object]")
          return !1;
        var proto = getProto(obj);
        if (!proto)
          return !0;
        var Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && fnToString.call(Ctor) === ObjectFunctionString;
      }
      function extend() {
        for (var args = [], _i = 0; _i < arguments.length; _i++)
          args[_i] = arguments[_i];
        var options, name, src, copy, copyIsArray, clone, target = args[0], i = 1, deep = !1, length = args.length;
        for (typeof target == "boolean" ? (deep = target, target = args[i] || {}, i++) : target = target || {}, typeof target != "object" && !isFunction(target) && (target = {}), i === length && (target = this, i--); i < length; i++)
          if ((options = args[i]) != null)
            for (name in options)
              copy = options[name], !(name === "__proto__" || target === copy) && (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ? (src = target[name], copyIsArray && !Array.isArray(src) ? clone = [] : !copyIsArray && !isPlainObject(src) ? clone = {} : clone = src, copyIsArray = !1, target[name] = extend(deep, clone, copy)) : copy !== void 0 && (target[name] = copy));
        return target;
      }
      var BindingEventService = (
        /** @class */
        function() {
          function BindingEventService2() {
            this._boundedEvents = [];
          }
          return BindingEventService2.prototype.getBoundedEvents = function() {
            return this._boundedEvents;
          }, BindingEventService2.prototype.destroy = function() {
            this.unbindAll();
          }, BindingEventService2.prototype.bind = function(element, eventName, listener, options) {
            element.addEventListener(eventName, listener, options), this._boundedEvents.push({ element, eventName, listener });
          }, BindingEventService2.prototype.unbind = function(element, eventName, listener) {
            element != null && element.removeEventListener && element.removeEventListener(eventName, listener);
          }, BindingEventService2.prototype.unbindByEventName = function(element, eventName) {
            var boundedEvent = this._boundedEvents.find(function(e) {
              return e.element === element && e.eventName === eventName;
            });
            boundedEvent && this.unbind(boundedEvent.element, boundedEvent.eventName, boundedEvent.listener);
          }, BindingEventService2.prototype.unbindAll = function() {
            for (; this._boundedEvents.length > 0; ) {
              var boundedEvent = this._boundedEvents.pop();
              this.unbind(boundedEvent.element, boundedEvent.eventName, boundedEvent.listener);
            }
          }, BindingEventService2;
        }()
      );
      exports.BindingEventService = BindingEventService;
      exports.SlickGlobalEditorLock = new SlickEditorLock();
      var SlickCore = {
        Event: SlickEvent,
        EventData: SlickEventData,
        EventHandler: SlickEventHandler,
        Range: SlickRange,
        NonDataRow: SlickNonDataItem,
        Group: SlickGroup,
        GroupTotals: SlickGroupTotals,
        EditorLock: SlickEditorLock,
        RegexSanitizer: regexSanitizer,
        // BindingEventService: BindingEventService,
        Utils: {
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
          applyDefaults,
          windowScrollPosition,
          storage: {
            // https://stackoverflow.com/questions/29222027/vanilla-alternative-to-jquery-data-function-any-native-javascript-alternati
            _storage: /* @__PURE__ */ new WeakMap(),
            put: function(element, key, obj) {
              this._storage.has(element) || this._storage.set(element, /* @__PURE__ */ new Map()), this._storage.get(element).set(key, obj);
            },
            get: function(element, key) {
              var el = this._storage.get(element);
              return el ? el.get(key) : null;
            },
            remove: function(element, key) {
              var ret = this._storage.get(element).delete(key);
              return this._storage.get(element).size !== 0 && this._storage.delete(element), ret;
            }
          }
        },
        /**
         * A global singleton editor lock.
         * @class GlobalEditorLock
         * @static
         * @constructor
         */
        GlobalEditorLock: exports.SlickGlobalEditorLock,
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
      };
      exports.Utils = SlickCore.Utils, exports.EditorLock = SlickCore.EditorLock, exports.Event = SlickCore.Event, exports.EventData = SlickCore.EventData, exports.EventHandler = SlickCore.EventHandler, exports.Group = SlickCore.Group, exports.GroupTotals = SlickCore.GroupTotals, exports.NonDataRow = SlickCore.NonDataRow, exports.Range = SlickCore.Range, exports.RegexSanitizer = SlickCore.RegexSanitizer, exports.GlobalEditorLock = SlickCore.GlobalEditorLock, exports.keyCode = SlickCore.keyCode, exports.preClickClassName = SlickCore.preClickClassName, exports.GridAutosizeColsMode = SlickCore.GridAutosizeColsMode, exports.ColAutosizeMode = SlickCore.ColAutosizeMode, exports.RowSelectionMode = SlickCore.RowSelectionMode, exports.ValueFilterMode = SlickCore.ValueFilterMode, exports.WidthEvalMode = SlickCore.WidthEvalMode;
      typeof global != "undefined" && window.Slick && (global.Slick = window.Slick);
    }
  });
  return require_slick_core();
})();
//# sourceMappingURL=slick.core.js.map
