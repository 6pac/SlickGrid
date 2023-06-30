"use strict";
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Aggregators: () => Aggregators,
  AvgAggregator: () => AvgAggregator,
  BindingEventService: () => BindingEventService,
  CellCopyManager: () => CellCopyManager,
  CellExternalCopyManager: () => CellExternalCopyManager,
  CellMenu: () => CellMenu,
  CellRangeDecorator: () => CellRangeDecorator,
  CellRangeSelector: () => CellRangeSelector,
  CellSelectionModel: () => CellSelectionModel,
  CheckboxEditor: () => CheckboxEditor,
  CheckboxFormatter: () => CheckboxFormatter,
  CheckboxSelectColumn: () => CheckboxSelectColumn,
  CheckmarkFormatter: () => CheckmarkFormatter,
  ColAutosizeMode: () => ColAutosizeMode,
  CompositeEditor: () => CompositeEditor,
  ContextMenu: () => ContextMenu,
  CountAggregator: () => CountAggregator,
  CrossGridRowMoveManager: () => CrossGridRowMoveManager,
  CustomTooltip: () => CustomTooltip,
  DataView: () => DataView,
  Draggable: () => Draggable,
  DraggableGrouping: () => DraggableGrouping,
  EditorLock: () => EditorLock,
  Editors: () => Editors,
  Event: () => Event,
  EventData: () => EventData,
  EventHandler: () => EventHandler,
  FlatpickrEditor: () => FlatpickrEditor,
  FloatEditor: () => FloatEditor,
  Formatters: () => Formatters,
  GlobalEditorLock: () => GlobalEditorLock,
  GridAutosizeColsMode: () => GridAutosizeColsMode,
  Group: () => Group,
  GroupItemMetadataProvider: () => GroupItemMetadataProvider,
  GroupTotals: () => GroupTotals,
  HeaderButtons: () => HeaderButtons,
  HeaderMenu: () => HeaderMenu,
  IntegerEditor: () => IntegerEditor,
  LongTextEditor: () => LongTextEditor,
  MaxAggregator: () => MaxAggregator,
  MinAggregator: () => MinAggregator,
  MouseWheel: () => MouseWheel,
  NonDataItem: () => NonDataItem,
  PercentCompleteBarFormatter: () => PercentCompleteBarFormatter,
  PercentCompleteEditor: () => PercentCompleteEditor,
  PercentCompleteFormatter: () => PercentCompleteFormatter,
  Range: () => Range,
  Resizable: () => Resizable,
  Resizer: () => Resizer,
  RowDetailView: () => RowDetailView,
  RowMoveManager: () => RowMoveManager,
  RowSelectionMode: () => RowSelectionMode,
  RowSelectionModel: () => RowSelectionModel,
  SlickAutoTooltips: () => SlickAutoTooltips,
  SlickColumnPicker: () => SlickColumnPicker,
  SlickGrid: () => SlickGrid,
  SlickGridMenu: () => SlickGridMenu,
  SlickGridPager: () => SlickGridPager,
  State: () => State,
  SumAggregator: () => SumAggregator,
  TextEditor: () => TextEditor,
  Utils: () => Utils,
  ValueFilterMode: () => ValueFilterMode,
  WidthEvalMode: () => WidthEvalMode,
  YesNoFormatter: () => YesNoFormatter,
  YesNoSelectEditor: () => YesNoSelectEditor,
  keyCode: () => keyCode,
  preClickClassName: () => preClickClassName
});
module.exports = __toCommonJS(src_exports);

// src/slick.core.js
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
    for (var i2 = handlers.length - 1; i2 >= 0; i2--)
      handlers[i2] === fn && handlers.splice(i2, 1);
  }, this.notify = function(args, e, scope) {
    e instanceof EventData || (e = new EventData(e, args)), scope = scope || this;
    for (var i2 = 0; i2 < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i2++) {
      let returnValue = handlers[i2].call(scope, e, args);
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
    for (var i2 = handlers.length; i2--; )
      if (handlers[i2].event === event && handlers[i2].handler === handler) {
        handlers.splice(i2, 1), event.unsubscribe(handler);
        return;
      }
    return this;
  }, this.unsubscribeAll = function() {
    for (var i2 = handlers.length; i2--; )
      handlers[i2].event.unsubscribe(handlers[i2].handler);
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
  var options, name, src, copy, copyIsArray, clone, target = arguments[0], i2 = 1, length = arguments.length, deep = !1;
  for (typeof target == "boolean" ? (deep = target, target = arguments[i2] || {}, i2++) : target = target || {}, typeof target != "object" && !isFunction(target) && (target = {}), i2 === length && (target = this, i2--); i2 < length; i2++)
    if ((options = arguments[i2]) != null)
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

// src/slick.compositeeditor.js
function CompositeEditor(columns, containers, options) {
  var defaultOptions = {
    modalType: "edit",
    // available type (create, edit, mass)
    validationFailedMsg: "Some of the fields have failed validation",
    validationMsgPrefix: null,
    show: null,
    hide: null,
    position: null,
    destroy: null,
    formValues: {},
    editors: {}
  }, noop2 = function() {
  }, firstInvalidEditor;
  options = Slick.Utils.extend({}, defaultOptions, options);
  function getContainerBox(i2) {
    var c = containers[i2], offset2 = Slick.Utils.offset(c), w = Slick.Utils.width(c), h = Slick.Utils.height(c);
    return {
      top: offset2 && offset2.top,
      left: offset2 && offset2.left,
      bottom: offset2 && offset2.top + h,
      right: offset2 && offset2.left + w,
      width: w,
      height: h,
      visible: !0
    };
  }
  function editor(args) {
    var editors = [];
    function init() {
      for (var newArgs = {}, idx = 0; idx < columns.length; ) {
        if (columns[idx].editor) {
          var column = columns[idx];
          newArgs = Slick.Utils.extend(!1, {}, args), newArgs.container = containers[idx], newArgs.column = column, newArgs.position = getContainerBox(idx), newArgs.commitChanges = noop2, newArgs.cancelChanges = noop2, newArgs.compositeEditorOptions = options, newArgs.formValues = {};
          var currentEditor = new column.editor(newArgs);
          options.editors[column.id] = currentEditor, editors.push(currentEditor);
        }
        idx++;
      }
      setTimeout(function() {
        Array.isArray(editors) && editors.length > 0 && editors[0].focus && editors[0].focus();
      }, 0);
    }
    this.destroy = function() {
      for (var idx = 0; idx < editors.length; )
        editors[idx].destroy(), idx++;
      options.destroy && options.destroy(), editors = [];
    }, this.focus = function() {
      (firstInvalidEditor || editors[0]).focus();
    }, this.isValueChanged = function() {
      for (var idx = 0; idx < editors.length; ) {
        if (editors[idx].isValueChanged())
          return !0;
        idx++;
      }
      return !1;
    }, this.serializeValue = function() {
      for (var serializedValue = [], idx = 0; idx < editors.length; )
        serializedValue[idx] = editors[idx].serializeValue(), idx++;
      return serializedValue;
    }, this.applyValue = function(item, state) {
      for (var idx = 0; idx < editors.length; )
        editors[idx].applyValue(item, state[idx]), idx++;
    }, this.loadValue = function(item) {
      for (var idx = 0; idx < editors.length; )
        editors[idx].loadValue(item), idx++;
    }, this.validate = function(target) {
      var validationResults, errors = [], targetElm = target || null;
      firstInvalidEditor = null;
      for (var idx = 0; idx < editors.length; ) {
        var columnDef = editors[idx].args && editors[idx].args.column || {};
        if (columnDef) {
          var validationElm = document.querySelector(".item-details-validation.editor-" + columnDef.id), labelElm = document.querySelector(".item-details-label.editor-" + columnDef.id), editorElm = document.querySelector("[data-editorid=" + columnDef.id + "]"), validationMsgPrefix = options && options.validationMsgPrefix || "";
          (!targetElm || Slick.Utils.contains(editorElm, targetElm)) && (validationResults = editors[idx].validate(), validationResults.valid ? validationElm && (validationElm.textContent = "", editorElm.classList.remove("invalid"), labelElm.classList.remove("invalid")) : (firstInvalidEditor = editors[idx], errors.push({
            index: idx,
            editor: editors[idx],
            container: containers[idx],
            msg: validationResults.msg
          }), validationElm && (validationElm.textContent = validationMsgPrefix + validationResults.msg, labelElm.classList.add("invalid"), editorElm.classList.add("invalid")))), validationElm = null, labelElm = null, editorElm = null;
        }
        idx++;
      }
      return targetElm = null, errors.length ? {
        valid: !1,
        msg: options.validationFailedMsg,
        errors
      } : {
        valid: !0,
        msg: ""
      };
    }, this.hide = function() {
      for (var idx = 0; idx < editors.length; )
        editors[idx].hide && editors[idx].hide(), idx++;
      options.hide && options.hide();
    }, this.show = function() {
      for (var idx = 0; idx < editors.length; )
        editors[idx].show && editors[idx].show(), idx++;
      options.show && options.show();
    }, this.position = function(box) {
      options.position && options.position(box);
    }, init();
  }
  return editor.prototype = this, editor;
}

// src/slick.groupitemmetadataprovider.js
var Group2 = Group, keyCode2 = keyCode, Utils2 = Utils;
function GroupItemMetadataProvider(inputOptions) {
  var _grid, _defaults = {
    checkboxSelect: !1,
    checkboxSelectCssClass: "slick-group-select-checkbox",
    checkboxSelectPlugin: null,
    groupCssClass: "slick-group",
    groupTitleCssClass: "slick-group-title",
    totalsCssClass: "slick-group-totals",
    groupFocusable: !0,
    totalsFocusable: !1,
    toggleCssClass: "slick-group-toggle",
    toggleExpandedCssClass: "expanded",
    toggleCollapsedCssClass: "collapsed",
    enableExpandCollapse: !0,
    groupFormatter: defaultGroupCellFormatter,
    totalsFormatter: defaultTotalsCellFormatter,
    includeHeaderTotals: !1
  }, options = Utils2.extend(!0, {}, _defaults, inputOptions);
  function getOptions() {
    return options;
  }
  function setOptions(inputOptions2) {
    Utils2.extend(!0, options, inputOptions2);
  }
  function defaultGroupCellFormatter(row, cell, value, columnDef, item, grid) {
    if (!options.enableExpandCollapse)
      return item.title;
    var indentation = item.level * 15 + "px";
    return (options.checkboxSelect ? '<span class="' + options.checkboxSelectCssClass + " " + (item.selectChecked ? "checked" : "unchecked") + '"></span>' : "") + "<span class='" + options.toggleCssClass + " " + (item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) + "' style='margin-left:" + indentation + "'></span><span class='" + options.groupTitleCssClass + "' level='" + item.level + "'>" + item.title + "</span>";
  }
  function defaultTotalsCellFormatter(row, cell, value, columnDef, item, grid) {
    return columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef, grid) || "";
  }
  function init(grid) {
    _grid = grid, _grid.onClick.subscribe(handleGridClick), _grid.onKeyDown.subscribe(handleGridKeyDown);
  }
  function destroy() {
    _grid && (_grid.onClick.unsubscribe(handleGridClick), _grid.onKeyDown.unsubscribe(handleGridKeyDown));
  }
  function handleGridClick(e, args) {
    var target = e.target, item = this.getDataItem(args.row);
    if (item && item instanceof Group2 && target.classList.contains(options.toggleCssClass || "")) {
      var range = _grid.getRenderedRange();
      this.getData().setRefreshHints({
        ignoreDiffsBefore: range.top,
        ignoreDiffsAfter: range.bottom + 1
      }), item.collapsed ? this.getData().expandGroup(item.groupingKey) : this.getData().collapseGroup(item.groupingKey), e.stopImmediatePropagation(), e.preventDefault();
    }
    if (item && item instanceof Group2 && target.classList.contains(options.checkboxSelectCssClass)) {
      item.selectChecked = !item.selectChecked, target.classList.remove(item.selectChecked ? "unchecked" : "checked"), target.classList.add(item.selectChecked ? "checked" : "unchecked");
      var rowIndexes = _grid.getData().mapItemsToRows(item.rows);
      (item.selectChecked ? options.checkboxSelectPlugin.selectRows : options.checkboxSelectPlugin.deSelectRows)(rowIndexes);
    }
  }
  function handleGridKeyDown(e, args) {
    if (options.enableExpandCollapse && e.which == keyCode2.SPACE) {
      var activeCell = this.getActiveCell();
      if (activeCell) {
        var item = this.getDataItem(activeCell.row);
        if (item && item instanceof Group2) {
          var range = _grid.getRenderedRange();
          this.getData().setRefreshHints({
            ignoreDiffsBefore: range.top,
            ignoreDiffsAfter: range.bottom + 1
          }), item.collapsed ? this.getData().expandGroup(item.groupingKey) : this.getData().collapseGroup(item.groupingKey), e.stopImmediatePropagation(), e.preventDefault();
        }
      }
    }
  }
  function getGroupRowMetadata(item) {
    var groupLevel = item && item.level;
    return {
      selectable: !1,
      focusable: options.groupFocusable,
      cssClasses: options.groupCssClass + " slick-group-level-" + groupLevel,
      formatter: options.includeHeaderTotals && options.totalsFormatter,
      columns: {
        0: {
          colspan: options.includeHeaderTotals ? "1" : "*",
          formatter: options.groupFormatter,
          editor: null
        }
      }
    };
  }
  function getTotalsRowMetadata(item) {
    var groupLevel = item && item.group && item.group.level;
    return {
      selectable: !1,
      focusable: options.totalsFocusable,
      cssClasses: options.totalsCssClass + " slick-group-level-" + groupLevel,
      formatter: options.totalsFormatter,
      editor: null
    };
  }
  return {
    init,
    destroy,
    getGroupRowMetadata,
    getTotalsRowMetadata,
    getOptions,
    setOptions
  };
}

// src/slick.dataview.js
var SlickEvent = Event, EventData2 = EventData, Group3 = Group, GroupTotals2 = GroupTotals, Utils3 = Utils, GroupItemMetadataProvider2 = GroupItemMetadataProvider;
function DataView(options) {
  var self = this, defaults2 = {
    groupItemMetadataProvider: null,
    inlineFilters: !1
  }, idProperty = "id", items = [], rows = [], idxById = /* @__PURE__ */ new Map(), rowsById = null, filter = null, updated = null, suspend = !1, isBulkSuspend = !1, bulkDeleteIds = /* @__PURE__ */ new Map(), sortAsc = !0, fastSortField, sortComparer, refreshHints = {}, prevRefreshHints = {}, filterArgs, filteredItems = [], compiledFilter, compiledFilterWithCaching, filterCache = [], _grid = null, groupingInfoDefaults = {
    getter: null,
    formatter: null,
    comparer: function(a, b) {
      return a.value === b.value ? 0 : a.value > b.value ? 1 : -1;
    },
    predefinedValues: [],
    aggregators: [],
    aggregateEmpty: !1,
    aggregateCollapsed: !1,
    aggregateChildGroups: !1,
    collapsed: !1,
    displayTotalsRow: !0,
    lazyTotalsCalculation: !1
  }, groupingInfos = [], groups = [], toggledGroupsByLevel = [], groupingDelimiter = ":|:", selectedRowIds = null, preSelectedRowIdsChangeFn, pagesize = 0, pagenum = 0, totalRows = 0, onSelectedRowIdsChanged = new SlickEvent(), onSetItemsCalled = new SlickEvent(), onRowCountChanged = new SlickEvent(), onRowsChanged = new SlickEvent(), onRowsOrCountChanged = new SlickEvent(), onBeforePagingInfoChanged = new SlickEvent(), onPagingInfoChanged = new SlickEvent(), onGroupExpanded = new SlickEvent(), onGroupCollapsed = new SlickEvent();
  options = Utils3.extend(!0, {}, defaults2, options);
  function beginUpdate(bulkUpdate) {
    suspend = !0, isBulkSuspend = bulkUpdate === !0;
  }
  function endUpdate() {
    var wasBulkSuspend = isBulkSuspend;
    isBulkSuspend = !1, suspend = !1, wasBulkSuspend && (processBulkDelete(), ensureIdUniqueness()), refresh();
  }
  function destroy() {
    items = [], idxById = null, rowsById = null, filter = null, updated = null, sortComparer = null, filterCache = [], filteredItems = [], compiledFilter = null, compiledFilterWithCaching = null, _grid && _grid.onSelectedRowsChanged && _grid.onCellCssStylesChanged && (_grid.onSelectedRowsChanged.unsubscribe(), _grid.onCellCssStylesChanged.unsubscribe()), self.onRowsOrCountChanged && self.onRowsOrCountChanged.unsubscribe();
  }
  function setRefreshHints(hints) {
    refreshHints = hints;
  }
  function setFilterArgs(args) {
    filterArgs = args;
  }
  function processBulkDelete() {
    if (idxById) {
      for (var id, item, newIdx = 0, i2 = 0, l = items.length; i2 < l; i2++) {
        if (item = items[i2], id = item[idProperty], id === void 0)
          throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
        bulkDeleteIds.has(id) ? idxById.delete(id) : (items[newIdx] = item, idxById.set(id, newIdx), ++newIdx);
      }
      items.length = newIdx, bulkDeleteIds = /* @__PURE__ */ new Map();
    }
  }
  function updateIdxById(startingIndex) {
    if (!(isBulkSuspend || !idxById)) {
      startingIndex = startingIndex || 0;
      for (var id, i2 = startingIndex, l = items.length; i2 < l; i2++) {
        if (id = items[i2][idProperty], id === void 0)
          throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
        idxById.set(id, i2);
      }
    }
  }
  function ensureIdUniqueness() {
    if (!(isBulkSuspend || !idxById)) {
      for (var id, i2 = 0, l = items.length; i2 < l; i2++)
        if (id = items[i2][idProperty], id === void 0 || idxById.get(id) !== i2)
          throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
    }
  }
  function getItems() {
    return items;
  }
  function getIdPropertyName() {
    return idProperty;
  }
  function setItems(data, objectIdProperty) {
    objectIdProperty !== void 0 && (idProperty = objectIdProperty), items = filteredItems = data, onSetItemsCalled.notify({ idProperty: objectIdProperty, itemCount: items.length }, null, self), idxById = /* @__PURE__ */ new Map(), updateIdxById(), ensureIdUniqueness(), refresh();
  }
  function setPagingOptions(args) {
    onBeforePagingInfoChanged.notify(getPagingInfo(), null, self).getReturnValue() !== !1 && (args.pageSize != null && (pagesize = args.pageSize, pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0), args.pageNum != null && (pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1))), onPagingInfoChanged.notify(getPagingInfo(), null, self), refresh());
  }
  function getPagingInfo() {
    var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
    return { pageSize: pagesize, pageNum: pagenum, totalRows, totalPages, dataView: self };
  }
  function sort(comparer, ascending) {
    sortAsc = ascending, sortComparer = comparer, fastSortField = null, ascending === !1 && items.reverse(), items.sort(comparer), ascending === !1 && items.reverse(), idxById = /* @__PURE__ */ new Map(), updateIdxById(), refresh();
  }
  function fastSort(field, ascending) {
    sortAsc = ascending, fastSortField = field, sortComparer = null;
    var oldToString = Object.prototype.toString;
    Object.prototype.toString = typeof field == "function" ? field : function() {
      return this[field];
    }, ascending === !1 && items.reverse(), items.sort(), Object.prototype.toString = oldToString, ascending === !1 && items.reverse(), idxById = /* @__PURE__ */ new Map(), updateIdxById(), refresh();
  }
  function reSort() {
    sortComparer ? sort(sortComparer, sortAsc) : fastSortField && fastSort(fastSortField, sortAsc);
  }
  function getFilteredItems() {
    return filteredItems;
  }
  function getFilteredItemCount() {
    return filteredItems.length;
  }
  function getFilter() {
    return filter;
  }
  function setFilter(filterFn) {
    filter = filterFn, options.inlineFilters && (compiledFilter = compileFilter(), compiledFilterWithCaching = compileFilterWithCaching()), refresh();
  }
  function getGrouping() {
    return groupingInfos;
  }
  function setGrouping(groupingInfo) {
    options.groupItemMetadataProvider || (options.groupItemMetadataProvider = new GroupItemMetadataProvider2()), groups = [], toggledGroupsByLevel = [], groupingInfo = groupingInfo || [], groupingInfos = groupingInfo instanceof Array ? groupingInfo : [groupingInfo];
    for (var i2 = 0; i2 < groupingInfos.length; i2++) {
      var gi = groupingInfos[i2] = Utils3.extend(!0, {}, groupingInfoDefaults, groupingInfos[i2]);
      gi.getterIsAFn = typeof gi.getter == "function", gi.compiledAccumulators = [];
      for (var idx = gi.aggregators.length; idx--; )
        gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
      toggledGroupsByLevel[i2] = {};
    }
    refresh();
  }
  function groupBy(valueGetter, valueFormatter, sortComparer2) {
    if (valueGetter == null) {
      setGrouping([]);
      return;
    }
    setGrouping({
      getter: valueGetter,
      formatter: valueFormatter,
      comparer: sortComparer2
    });
  }
  function setAggregators(groupAggregators, includeCollapsed) {
    if (!groupingInfos.length)
      throw new Error("[SlickGrid DataView] At least one grouping must be specified before calling setAggregators().");
    groupingInfos[0].aggregators = groupAggregators, groupingInfos[0].aggregateCollapsed = includeCollapsed, setGrouping(groupingInfos);
  }
  function getItemByIdx(i2) {
    return items[i2];
  }
  function getIdxById(id) {
    return idxById && idxById.get(id);
  }
  function ensureRowsByIdCache() {
    if (!rowsById) {
      rowsById = {};
      for (var i2 = 0, l = rows.length; i2 < l; i2++)
        rowsById[rows[i2][idProperty]] = i2;
    }
  }
  function getRowByItem(item) {
    return ensureRowsByIdCache(), rowsById[item[idProperty]];
  }
  function getRowById(id) {
    return ensureRowsByIdCache(), rowsById[id];
  }
  function getItemById(id) {
    return items[idxById && idxById.get(id)];
  }
  function mapItemsToRows(itemArray) {
    var rows2 = [];
    ensureRowsByIdCache();
    for (var i2 = 0, l = itemArray.length; i2 < l; i2++) {
      var row = rowsById[itemArray[i2][idProperty]];
      row != null && (rows2[rows2.length] = row);
    }
    return rows2;
  }
  function mapIdsToRows(idArray) {
    var rows2 = [];
    ensureRowsByIdCache();
    for (var i2 = 0, l = idArray.length; i2 < l; i2++) {
      var row = rowsById[idArray[i2]];
      row != null && (rows2[rows2.length] = row);
    }
    return rows2;
  }
  function mapRowsToIds(rowArray) {
    for (var ids = [], i2 = 0, l = rowArray.length; i2 < l; i2++)
      if (rowArray[i2] < rows.length) {
        let rowItem = rows[rowArray[i2]];
        ids[ids.length] = rowItem && rowItem[idProperty];
      }
    return ids;
  }
  function updateSingleItem(id, item) {
    if (idxById) {
      if (!idxById.has(id))
        throw new Error("[SlickGrid DataView] Invalid id");
      if (id !== item[idProperty]) {
        var newId = item[idProperty];
        if (newId == null)
          throw new Error("[SlickGrid DataView] Cannot update item to associate with a null id");
        if (idxById.has(newId))
          throw new Error("[SlickGrid DataView] Cannot update item to associate with a non-unique id");
        idxById.set(newId, idxById.get(id)), idxById.delete(id), updated && updated[id] && delete updated[id], id = newId;
      }
      items[idxById.get(id)] = item, updated || (updated = {}), updated[id] = !0;
    }
  }
  function updateItem(id, item) {
    updateSingleItem(id, item), refresh();
  }
  function updateItems(ids, newItems) {
    if (ids.length !== newItems.length)
      throw new Error("[SlickGrid DataView] Mismatch on the length of ids and items provided to update");
    for (var i2 = 0, l = newItems.length; i2 < l; i2++)
      updateSingleItem(ids[i2], newItems[i2]);
    refresh();
  }
  function insertItem(insertBefore, item) {
    items.splice(insertBefore, 0, item), updateIdxById(insertBefore), refresh();
  }
  function insertItems(insertBefore, newItems) {
    Array.prototype.splice.apply(items, [insertBefore, 0].concat(newItems)), updateIdxById(insertBefore), refresh();
  }
  function addItem(item) {
    items.push(item), updateIdxById(items.length - 1), refresh();
  }
  function addItems(newItems) {
    items = items.concat(newItems), updateIdxById(items.length - newItems.length), refresh();
  }
  function deleteItem(id) {
    if (idxById)
      if (isBulkSuspend)
        bulkDeleteIds.set(id, !0);
      else {
        var idx = idxById.get(id);
        if (idx === void 0)
          throw new Error("[SlickGrid DataView] Invalid id");
        idxById.delete(id), items.splice(idx, 1), updateIdxById(idx), refresh();
      }
  }
  function deleteItems(ids) {
    if (!(ids.length === 0 || !idxById))
      if (isBulkSuspend)
        for (var i2 = 0, l = ids.length; i2 < l; i2++) {
          var id = ids[i2], idx = idxById.get(id);
          if (idx === void 0)
            throw new Error("[SlickGrid DataView] Invalid id");
          bulkDeleteIds.set(id, !0);
        }
      else {
        for (var indexesToDelete = [], i2 = 0, l = ids.length; i2 < l; i2++) {
          var id = ids[i2], idx = idxById.get(id);
          if (idx === void 0)
            throw new Error("[SlickGrid DataView] Invalid id");
          idxById.delete(id), indexesToDelete.push(idx);
        }
        indexesToDelete.sort();
        for (var i2 = indexesToDelete.length - 1; i2 >= 0; --i2)
          items.splice(indexesToDelete[i2], 1);
        updateIdxById(indexesToDelete[0]), refresh();
      }
  }
  function sortedAddItem(item) {
    if (!sortComparer)
      throw new Error("[SlickGrid DataView] sortedAddItem() requires a sort comparer, use sort()");
    insertItem(sortedIndex(item), item);
  }
  function sortedUpdateItem(id, item) {
    if (idxById) {
      if (!idxById.has(id) || id !== item[idProperty])
        throw new Error("[SlickGrid DataView] Invalid or non-matching id " + idxById.get(id));
      if (!sortComparer)
        throw new Error("[SlickGrid DataView] sortedUpdateItem() requires a sort comparer, use sort()");
      var oldItem = getItemById(id);
      sortComparer(oldItem, item) !== 0 ? (deleteItem(id), sortedAddItem(item)) : updateItem(id, item);
    }
  }
  function sortedIndex(searchItem) {
    for (var low = 0, high = items.length; low < high; ) {
      var mid = low + high >>> 1;
      sortComparer(items[mid], searchItem) === -1 ? low = mid + 1 : high = mid;
    }
    return low;
  }
  function getItemCount() {
    return items.length;
  }
  function getLength() {
    return rows.length;
  }
  function getItem(i2) {
    var item = rows[i2];
    if (item && item.__group && item.totals && !item.totals.initialized) {
      var gi = groupingInfos[item.level];
      gi.displayTotalsRow || (calculateTotals(item.totals), item.title = gi.formatter ? gi.formatter(item) : item.value);
    } else
      item && item.__groupTotals && !item.initialized && calculateTotals(item);
    return item;
  }
  function getItemMetadata(i2) {
    var item = rows[i2];
    return item === void 0 ? null : item.__group ? options.groupItemMetadataProvider.getGroupRowMetadata(item) : item.__groupTotals ? options.groupItemMetadataProvider.getTotalsRowMetadata(item) : null;
  }
  function expandCollapseAllGroups(level, collapse) {
    if (level == null)
      for (var i2 = 0; i2 < groupingInfos.length; i2++)
        toggledGroupsByLevel[i2] = {}, groupingInfos[i2].collapsed = collapse, collapse === !0 ? onGroupCollapsed.notify({ level: i2, groupingKey: null }) : onGroupExpanded.notify({ level: i2, groupingKey: null });
    else
      toggledGroupsByLevel[level] = {}, groupingInfos[level].collapsed = collapse, collapse === !0 ? onGroupCollapsed.notify({ level, groupingKey: null }) : onGroupExpanded.notify({ level, groupingKey: null });
    refresh();
  }
  function collapseAllGroups(level) {
    expandCollapseAllGroups(level, !0);
  }
  function expandAllGroups(level) {
    expandCollapseAllGroups(level, !1);
  }
  function expandCollapseGroup(level, groupingKey, collapse) {
    toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse, refresh();
  }
  function collapseGroup(varArgs) {
    var args = Array.prototype.slice.call(arguments), arg0 = args[0], groupingKey, level;
    args.length === 1 && arg0.indexOf(groupingDelimiter) !== -1 ? (groupingKey = arg0, level = arg0.split(groupingDelimiter).length - 1) : (groupingKey = args.join(groupingDelimiter), level = args.length - 1), expandCollapseGroup(level, groupingKey, !0), onGroupCollapsed.notify({ level, groupingKey });
  }
  function expandGroup(varArgs) {
    var args = Array.prototype.slice.call(arguments), arg0 = args[0], groupingKey, level;
    args.length === 1 && arg0.indexOf(groupingDelimiter) !== -1 ? (level = arg0.split(groupingDelimiter).length - 1, groupingKey = arg0) : (level = args.length - 1, groupingKey = args.join(groupingDelimiter)), expandCollapseGroup(level, groupingKey, !1), onGroupExpanded.notify({ level, groupingKey });
  }
  function getGroups() {
    return groups;
  }
  function extractGroups(rows2, parentGroup) {
    for (var group, val, groups2 = [], groupsByVal = {}, r, level = parentGroup ? parentGroup.level + 1 : 0, gi = groupingInfos[level], i2 = 0, l = gi.predefinedValues.length; i2 < l; i2++)
      val = gi.predefinedValues[i2], group = groupsByVal[val], group || (group = new Group3(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : "") + val, groups2[groups2.length] = group, groupsByVal[val] = group);
    for (var i2 = 0, l = rows2.length; i2 < l; i2++)
      r = rows2[i2], val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter], group = groupsByVal[val], group || (group = new Group3(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : "") + val, groups2[groups2.length] = group, groupsByVal[val] = group), group.rows[group.count++] = r;
    if (level < groupingInfos.length - 1)
      for (var i2 = 0; i2 < groups2.length; i2++)
        group = groups2[i2], group.groups = extractGroups(group.rows, group);
    return groups2.length && addTotals(groups2, level), groups2.sort(groupingInfos[level].comparer), groups2;
  }
  function calculateTotals(totals) {
    var group = totals.group, gi = groupingInfos[group.level], isLeafLevel = group.level == groupingInfos.length, agg, idx = gi.aggregators.length;
    if (!isLeafLevel && gi.aggregateChildGroups)
      for (var i2 = group.groups.length; i2--; )
        group.groups[i2].totals.initialized || calculateTotals(group.groups[i2].totals);
    for (; idx--; )
      agg = gi.aggregators[idx], agg.init(), !isLeafLevel && gi.aggregateChildGroups ? gi.compiledAccumulators[idx].call(agg, group.groups) : gi.compiledAccumulators[idx].call(agg, group.rows), agg.storeResult(totals);
    totals.initialized = !0;
  }
  function addGroupTotals(group) {
    var gi = groupingInfos[group.level], totals = new GroupTotals2();
    totals.group = group, group.totals = totals, gi.lazyTotalsCalculation || calculateTotals(totals);
  }
  function addTotals(groups2, level) {
    level = level || 0;
    for (var gi = groupingInfos[level], groupCollapsed = gi.collapsed, toggledGroups = toggledGroupsByLevel[level], idx = groups2.length, g; idx--; )
      g = groups2[idx], !(g.collapsed && !gi.aggregateCollapsed) && (g.groups && addTotals(g.groups, level + 1), gi.aggregators.length && (gi.aggregateEmpty || g.rows.length || g.groups && g.groups.length) && addGroupTotals(g), g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey], g.title = gi.formatter ? gi.formatter(g) : g.value);
  }
  function flattenGroupedRows(groups2, level) {
    level = level || 0;
    for (var gi = groupingInfos[level], groupedRows = [], rows2, gl = 0, g, i2 = 0, l = groups2.length; i2 < l; i2++) {
      if (g = groups2[i2], groupedRows[gl++] = g, !g.collapsed) {
        rows2 = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
        for (var j = 0, jj = rows2.length; j < jj; j++)
          groupedRows[gl++] = rows2[j];
      }
      g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed) && (groupedRows[gl++] = g.totals);
    }
    return groupedRows;
  }
  function getFunctionInfo(fn) {
    var fnStr = fn.toString(), usingEs5 = fnStr.indexOf("function") >= 0, fnRegex = usingEs5 ? /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/ : /^[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/, matches = fn.toString().match(fnRegex);
    return {
      params: matches[1].split(","),
      body: matches[2]
    };
  }
  function compileAccumulatorLoop(aggregator) {
    if (aggregator.accumulate) {
      var accumulatorInfo = getFunctionInfo(aggregator.accumulate), fn = new Function(
        "_items",
        "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" + accumulatorInfo.params[0] + " = _items[_i]; " + accumulatorInfo.body + "}"
      ), fnName = "compiledAccumulatorLoop";
      return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
    } else
      return function() {
      };
  }
  function compileFilter() {
    var filterInfo = getFunctionInfo(filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
      /return ([^;}]+?)\s*([;}]|$)/gi,
      "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
    ), tpl = [
      //"function(_items, _args) { ",
      "var _retval = [], _idx = 0; ",
      "var $item$, $args$ = _args; ",
      "_coreloop: ",
      "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
      "$item$ = _items[_i]; ",
      "$filter$; ",
      "} ",
      "return _retval; "
      //"}"
    ].join("");
    tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
    var fn = new Function("_items,_args", tpl), fnName = "compiledFilter";
    return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
  }
  function compileFilterWithCaching() {
    var filterInfo = getFunctionInfo(filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
      /return ([^;}]+?)\s*([;}]|$)/gi,
      "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
    ), tpl = [
      //"function(_items, _args, _cache) { ",
      "var _retval = [], _idx = 0; ",
      "var $item$, $args$ = _args; ",
      "_coreloop: ",
      "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
      "$item$ = _items[_i]; ",
      "if (_cache[_i]) { ",
      "_retval[_idx++] = $item$; ",
      "continue _coreloop; ",
      "} ",
      "$filter$; ",
      "} ",
      "return _retval; "
      //"}"
    ].join("");
    tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
    var fn = new Function("_items,_args,_cache", tpl), fnName = "compiledFilterWithCaching";
    return fn.displayName = fnName, fn.name = setFunctionName(fn, fnName), fn;
  }
  function setFunctionName(fn, fnName) {
    try {
      Object.defineProperty(fn, "name", {
        writable: !0,
        value: fnName
      });
    } catch {
      fn.name = fnName;
    }
  }
  function uncompiledFilter(items2, args) {
    for (var retval = [], idx = 0, i2 = 0, ii = items2.length; i2 < ii; i2++)
      filter(items2[i2], args) && (retval[idx++] = items2[i2]);
    return retval;
  }
  function uncompiledFilterWithCaching(items2, args, cache) {
    for (var retval = [], idx = 0, item, i2 = 0, ii = items2.length; i2 < ii; i2++)
      item = items2[i2], cache[i2] ? retval[idx++] = item : filter(item, args) && (retval[idx++] = item, cache[i2] = !0);
    return retval;
  }
  function getFilteredAndPagedItems(items2) {
    if (filter) {
      var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter, batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;
      refreshHints.isFilterNarrowing ? filteredItems = batchFilter(filteredItems, filterArgs) : refreshHints.isFilterExpanding ? filteredItems = batchFilterWithCaching(items2, filterArgs, filterCache) : refreshHints.isFilterUnchanged || (filteredItems = batchFilter(items2, filterArgs));
    } else
      filteredItems = pagesize ? items2 : items2.concat();
    var paged;
    return pagesize ? (filteredItems.length <= pagenum * pagesize && (filteredItems.length === 0 ? pagenum = 0 : pagenum = Math.floor((filteredItems.length - 1) / pagesize)), paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize)) : paged = filteredItems, { totalRows: filteredItems.length, rows: paged };
  }
  function getRowDiffs(rows2, newRows) {
    var item, r, eitherIsNonData, diff = [], from = 0, to = Math.max(newRows.length, rows2.length);
    refreshHints && refreshHints.ignoreDiffsBefore && (from = Math.max(
      0,
      Math.min(newRows.length, refreshHints.ignoreDiffsBefore)
    )), refreshHints && refreshHints.ignoreDiffsAfter && (to = Math.min(
      newRows.length,
      Math.max(0, refreshHints.ignoreDiffsAfter)
    ));
    for (var i2 = from, rl = rows2.length; i2 < to; i2++)
      i2 >= rl ? diff[diff.length] = i2 : (item = newRows[i2], r = rows2[i2], (!item || groupingInfos.length && (eitherIsNonData = item.__nonDataRow || r.__nonDataRow) && item.__group !== r.__group || item.__group && !item.equals(r) || eitherIsNonData && // no good way to compare totals since they are arbitrary DTOs
      // deep object comparison is pretty expensive
      // always considering them 'dirty' seems easier for the time being
      (item.__groupTotals || r.__groupTotals) || item[idProperty] != r[idProperty] || updated && updated[item[idProperty]]) && (diff[diff.length] = i2));
    return diff;
  }
  function recalc(_items) {
    rowsById = null, (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing || refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) && (filterCache = []);
    var filteredItems2 = getFilteredAndPagedItems(_items);
    totalRows = filteredItems2.totalRows;
    var newRows = filteredItems2.rows;
    groups = [], groupingInfos.length && (groups = extractGroups(newRows), groups.length && (newRows = flattenGroupedRows(groups)));
    var diff = getRowDiffs(rows, newRows);
    return rows = newRows, diff;
  }
  function refresh() {
    if (!suspend) {
      var previousPagingInfo = Utils3.extend(!0, {}, getPagingInfo()), countBefore = rows.length, totalRowsBefore = totalRows, diff = recalc(items, filter);
      pagesize && totalRows < pagenum * pagesize && (pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1), diff = recalc(items, filter)), updated = null, prevRefreshHints = refreshHints, refreshHints = {}, totalRowsBefore !== totalRows && onBeforePagingInfoChanged.notify(previousPagingInfo, null, self) !== !1 && onPagingInfoChanged.notify(getPagingInfo(), null, self), countBefore !== rows.length && onRowCountChanged.notify({ previous: countBefore, current: rows.length, itemCount: items.length, dataView: self, callingOnRowsChanged: diff.length > 0 }, null, self), diff.length > 0 && onRowsChanged.notify({ rows: diff, itemCount: items.length, dataView: self, calledOnRowCountChanged: countBefore !== rows.length }, null, self), (countBefore !== rows.length || diff.length > 0) && onRowsOrCountChanged.notify({
        rowsDiff: diff,
        previousRowCount: countBefore,
        currentRowCount: rows.length,
        itemCount: items.length,
        rowCountChanged: countBefore !== rows.length,
        rowsChanged: diff.length > 0,
        dataView: self
      }, null, self);
    }
  }
  function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
    var self2 = this;
    _grid = grid;
    var inHandler;
    selectedRowIds = self2.mapRowsToIds(grid.getSelectedRows());
    function setSelectedRowIds(rowIds) {
      rowIds === !1 ? selectedRowIds = [] : selectedRowIds.sort().join(",") !== rowIds.sort().join(",") && (selectedRowIds = rowIds);
    }
    function update() {
      if (selectedRowIds.length > 0 && !inHandler) {
        inHandler = !0;
        var selectedRows = self2.mapIdsToRows(selectedRowIds);
        if (!preserveHidden) {
          var selectedRowsChangedArgs = {
            grid: _grid,
            ids: self2.mapRowsToIds(selectedRows),
            rows: selectedRows,
            dataView: self2
          };
          preSelectedRowIdsChangeFn(selectedRowsChangedArgs), onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
            selectedRowIds,
            filteredIds: self2.getAllSelectedFilteredIds()
          }), new EventData2(), self2);
        }
        grid.setSelectedRows(selectedRows), inHandler = !1;
      }
    }
    return grid.onSelectedRowsChanged.subscribe(function(e, args) {
      if (!inHandler) {
        var newSelectedRowIds = self2.mapRowsToIds(args.rows), selectedRowsChangedArgs = {
          grid: _grid,
          ids: newSelectedRowIds,
          rows: args.rows,
          added: !0,
          dataView: self2
        };
        preSelectedRowIdsChangeFn(selectedRowsChangedArgs), onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
          selectedRowIds,
          filteredIds: self2.getAllSelectedFilteredIds()
        }), new EventData2(), self2);
      }
    }), preSelectedRowIdsChangeFn = function(args) {
      if (!inHandler) {
        inHandler = !0;
        var overwrite = typeof args.added > "u";
        if (overwrite)
          setSelectedRowIds(args.ids);
        else {
          var rowIds;
          if (args.added)
            if (preserveHiddenOnSelectionChange && grid.getOptions().multiSelect) {
              var hiddenSelectedRowIds = selectedRowIds.filter(function(id) {
                return self2.getRowById(id) === void 0;
              });
              rowIds = hiddenSelectedRowIds.concat(args.ids);
            } else
              rowIds = args.ids;
          else
            preserveHiddenOnSelectionChange && grid.getOptions().multiSelect ? rowIds = selectedRowIds.filter(function(id) {
              return args.ids.indexOf(id) === -1;
            }) : rowIds = [];
          setSelectedRowIds(rowIds);
        }
        inHandler = !1;
      }
    }, this.onRowsOrCountChanged.subscribe(update), onSelectedRowIdsChanged;
  }
  function getAllSelectedIds() {
    return selectedRowIds;
  }
  function getAllSelectedFilteredIds() {
    return getAllSelectedFilteredItems().map(function(item) {
      return item[idProperty];
    });
  }
  function setSelectedIds(selectedIds, options2) {
    var isRowBeingAdded = options2 && options2.isRowBeingAdded, shouldTriggerEvent = options2 && options2.shouldTriggerEvent, applyRowSelectionToGrid = options2 && options2.applyRowSelectionToGrid;
    isRowBeingAdded !== !1 && (isRowBeingAdded = !0);
    var selectedRows = self.mapIdsToRows(selectedIds), selectedRowsChangedArgs = {
      grid: _grid,
      ids: selectedIds,
      rows: selectedRows,
      added: isRowBeingAdded,
      dataView: self
    };
    preSelectedRowIdsChangeFn(selectedRowsChangedArgs), shouldTriggerEvent !== !1 && onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
      selectedRowIds,
      filteredIds: self.getAllSelectedFilteredIds()
    }), new EventData2(), self), applyRowSelectionToGrid !== !1 && _grid && _grid.setSelectedRows(selectedRows);
  }
  function getAllSelectedItems() {
    var selectedData = [], selectedIds = getAllSelectedIds();
    return selectedIds.forEach(function(id) {
      selectedData.push(self.getItemById(id));
    }), selectedData;
  }
  function getAllSelectedFilteredItems() {
    if (!Array.isArray(selectedRowIds))
      return [];
    var intersection = filteredItems.filter(function(a) {
      return selectedRowIds.some(function(b) {
        return a[idProperty] === b;
      });
    });
    return intersection || [];
  }
  function syncGridCellCssStyles(grid, key) {
    var hashById, inHandler;
    storeCellCssStyles(grid.getCellCssStyles(key));
    function storeCellCssStyles(hash) {
      hashById = {};
      for (var row in hash) {
        var id = rows[row][idProperty];
        hashById[id] = hash[row];
      }
    }
    function update() {
      if (hashById) {
        inHandler = !0, ensureRowsByIdCache();
        var newHash = {};
        for (var id in hashById) {
          var row = rowsById[id];
          row != null && (newHash[row] = hashById[id]);
        }
        grid.setCellCssStyles(key, newHash), inHandler = !1;
      }
    }
    grid.onCellCssStylesChanged.subscribe(function(e, args) {
      debugger;
      inHandler || key == args.key && (args.hash ? storeCellCssStyles(args.hash) : (grid.onCellCssStylesChanged.unsubscribe(), self.onRowsOrCountChanged.unsubscribe(update)));
    }), this.onRowsOrCountChanged.subscribe(update);
  }
  Utils3.extend(this, {
    // methods
    beginUpdate,
    endUpdate,
    destroy,
    setPagingOptions,
    getPagingInfo,
    getIdPropertyName,
    getItems,
    setItems,
    setFilter,
    getFilter,
    getFilteredItems,
    getFilteredItemCount,
    sort,
    fastSort,
    reSort,
    setGrouping,
    getGrouping,
    groupBy,
    setAggregators,
    collapseAllGroups,
    expandAllGroups,
    collapseGroup,
    expandGroup,
    getGroups,
    getAllSelectedIds,
    getAllSelectedItems,
    getAllSelectedFilteredIds,
    getAllSelectedFilteredItems,
    setSelectedIds,
    getIdxById,
    getRowByItem,
    getRowById,
    getItemById,
    getItemByIdx,
    mapItemsToRows,
    mapRowsToIds,
    mapIdsToRows,
    setRefreshHints,
    setFilterArgs,
    refresh,
    updateItem,
    updateItems,
    insertItem,
    insertItems,
    addItem,
    addItems,
    deleteItem,
    deleteItems,
    sortedAddItem,
    sortedUpdateItem,
    syncGridSelection,
    syncGridCellCssStyles,
    // data provider methods
    getItemCount,
    getLength,
    getItem,
    getItemMetadata,
    // events
    onSelectedRowIdsChanged,
    // NOTE this will only work when used with "syncGridSelection"
    onSetItemsCalled,
    onRowCountChanged,
    onRowsChanged,
    onRowsOrCountChanged,
    onBeforePagingInfoChanged,
    onPagingInfoChanged,
    onGroupExpanded,
    onGroupCollapsed
  });
}
function AvgAggregator(field) {
  this.field_ = field, this.init = function() {
    this.count_ = 0, this.nonNullCount_ = 0, this.sum_ = 0;
  }, this.accumulate = function(item) {
    var val = item[this.field_];
    this.count_++, val != null && val !== "" && !isNaN(val) && (this.nonNullCount_++, this.sum_ += parseFloat(val));
  }, this.storeResult = function(groupTotals) {
    groupTotals.avg || (groupTotals.avg = {}), this.nonNullCount_ !== 0 && (groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_);
  };
}
function MinAggregator(field) {
  this.field_ = field, this.init = function() {
    this.min_ = null;
  }, this.accumulate = function(item) {
    var val = item[this.field_];
    val != null && val !== "" && !isNaN(val) && (this.min_ == null || val < this.min_) && (this.min_ = val);
  }, this.storeResult = function(groupTotals) {
    groupTotals.min || (groupTotals.min = {}), groupTotals.min[this.field_] = this.min_;
  };
}
function MaxAggregator(field) {
  this.field_ = field, this.init = function() {
    this.max_ = null;
  }, this.accumulate = function(item) {
    var val = item[this.field_];
    val != null && val !== "" && !isNaN(val) && (this.max_ == null || val > this.max_) && (this.max_ = val);
  }, this.storeResult = function(groupTotals) {
    groupTotals.max || (groupTotals.max = {}), groupTotals.max[this.field_] = this.max_;
  };
}
function SumAggregator(field) {
  this.field_ = field, this.init = function() {
    this.sum_ = null;
  }, this.accumulate = function(item) {
    var val = item[this.field_];
    val != null && val !== "" && !isNaN(val) && (this.sum_ += parseFloat(val));
  }, this.storeResult = function(groupTotals) {
    groupTotals.sum || (groupTotals.sum = {}), groupTotals.sum[this.field_] = this.sum_;
  };
}
function CountAggregator(field) {
  this.field_ = field, this.init = function() {
  }, this.storeResult = function(groupTotals) {
    groupTotals.count || (groupTotals.count = {}), groupTotals.count[this.field_] = groupTotals.group.rows.length;
  };
}
var Aggregators = {
  Avg: AvgAggregator,
  Min: MinAggregator,
  Max: MaxAggregator,
  Sum: SumAggregator,
  Count: CountAggregator
};

// src/slick.editors.js
var keyCode3 = keyCode, Utils4 = Utils;
function TextEditor(args) {
  var input, defaultValue, scope = this, navOnLR;
  this.args = args, this.init = function() {
    navOnLR = args.grid.getOptions().editorCellNavOnLRKeys, input = Utils4.createDomElement("input", { type: "text", className: "editor-text" }, args.container), input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.focus(), input.select(), args.compositeEditorOptions && input.addEventListener("change", this.onChange);
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.destroy = function() {
    input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.removeEventListener("change", this.onChange), input.remove();
  }, this.focus = function() {
    input.focus();
  }, this.getValue = function() {
    return input.value;
  }, this.setValue = function(val) {
    input.value = val;
  }, this.loadValue = function(item) {
    defaultValue = item[args.column.field] || "", input.value = defaultValue, input.defaultValue = defaultValue, input.select();
  }, this.serializeValue = function() {
    return input.value;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && input.value != defaultValue;
  }, this.validate = function() {
    if (args.column.validator) {
      var validationResults = args.column.validator(input.value, args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function IntegerEditor(args) {
  var input, defaultValue, scope = this, navOnLR;
  this.args = args, this.init = function() {
    navOnLR = args.grid.getOptions().editorCellNavOnLRKeys, input = Utils4.createDomElement("input", { type: "text", className: "editor-text" }, args.container), input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.focus(), input.select(), args.compositeEditorOptions && input.addEventListener("change", this.onChange);
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.destroy = function() {
    input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.removeEventListener("change", this.onChange), input.remove();
  }, this.focus = function() {
    input.focus();
  }, this.loadValue = function(item) {
    defaultValue = item[args.column.field], input.value = defaultValue, input.defaultValue = defaultValue, input.select();
  }, this.serializeValue = function() {
    return parseInt(input.value, 10) || 0;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && input.value != defaultValue;
  }, this.validate = function() {
    if (isNaN(input.value))
      return {
        valid: !1,
        msg: "Please enter a valid integer"
      };
    if (args.column.validator) {
      var validationResults = args.column.validator(input.value, args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function FloatEditor(args) {
  var input, defaultValue, scope = this, navOnLR;
  this.args = args, this.init = function() {
    navOnLR = args.grid.getOptions().editorCellNavOnLRKeys, input = Utils4.createDomElement("input", { type: "text", className: "editor-text" }, args.container), input.addEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.focus(), input.select(), args.compositeEditorOptions && input.addEventListener("change", this.onChange);
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.destroy = function() {
    input.removeEventListener("keydown.nav", navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), input.removeEventListener("change", this.onChange), input.remove();
  }, this.focus = function() {
    input.focus();
  };
  function getDecimalPlaces() {
    var rtn = args.column.editorFixedDecimalPlaces;
    return typeof rtn > "u" && (rtn = FloatEditor.DefaultDecimalPlaces), !rtn && rtn !== 0 ? null : rtn;
  }
  this.loadValue = function(item) {
    defaultValue = item[args.column.field];
    var decPlaces = getDecimalPlaces();
    decPlaces !== null && (defaultValue || defaultValue === 0) && defaultValue.toFixed && (defaultValue = defaultValue.toFixed(decPlaces)), input.value = defaultValue, input.defaultValue = defaultValue, input.select();
  }, this.serializeValue = function() {
    var rtn = parseFloat(input.value);
    FloatEditor.AllowEmptyValue ? !rtn && rtn !== 0 && (rtn = "") : rtn = rtn || 0;
    var decPlaces = getDecimalPlaces();
    return decPlaces !== null && (rtn || rtn === 0) && rtn.toFixed && (rtn = parseFloat(rtn.toFixed(decPlaces))), rtn;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && input.value != defaultValue;
  }, this.validate = function() {
    if (isNaN(input.value))
      return {
        valid: !1,
        msg: "Please enter a valid number"
      };
    if (args.column.validator) {
      var validationResults = args.column.validator(input.value, args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
FloatEditor.DefaultDecimalPlaces = null;
FloatEditor.AllowEmptyValue = !1;
function FlatpickrEditor(args) {
  if (typeof flatpickr > "u")
    throw new Error("Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/");
  var input, defaultValue, scope = this;
  this.args = args;
  var flatpickrInstance;
  this.init = function() {
    input = Utils4.createDomElement("input", { type: "text", className: "editor-text" }, args.container), input.focus(), input.select(), flatpickrInstance = flatpickr(input, {
      closeOnSelect: !0,
      allowInput: !0,
      altInput: !0,
      altFormat: "m/d/Y",
      dateFormat: "m/d/Y",
      onChange: () => {
        if (args.compositeEditorOptions) {
          var activeCell = args.grid.getActiveCell();
          scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        }
      }
    }), args.compositeEditorOptions || setTimeout(() => {
      scope.show(), scope.focus();
    }, 50), Utils4.width(input, Utils4.width(input) - (args.compositeEditorOptions ? 28 : 18));
  }, this.destroy = function() {
    scope.hide(), flatpickrInstance && flatpickrInstance.destroy(), input.remove();
  }, this.show = function() {
    !args.compositeEditorOptions && flatpickrInstance && flatpickrInstance.open();
  }, this.hide = function() {
    !args.compositeEditorOptions && flatpickrInstance && flatpickrInstance.close();
  }, this.focus = function() {
    input.focus();
  }, this.loadValue = function(item) {
    defaultValue = item[args.column.field], input.value = defaultValue, input.defaultValue = defaultValue, input.select(), flatpickrInstance && flatpickrInstance.setDate(defaultValue);
  }, this.serializeValue = function() {
    return input.value;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && input.value != defaultValue;
  }, this.validate = function() {
    if (args.column.validator) {
      var validationResults = args.column.validator(input.value, args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function YesNoSelectEditor(args) {
  var select, defaultValue, scope = this;
  this.args = args, this.init = function() {
    select = Utils4.createDomElement("select", { tabIndex: 0, className: "editor-yesno" }, args.container), Utils4.createDomElement("option", { value: "yes", textContent: "Yes" }, select), Utils4.createDomElement("option", { value: "no", textContent: "No" }, select), select.focus(), args.compositeEditorOptions && select.addEventListener("change", this.onChange);
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.destroy = function() {
    select.removeEventListener("change", this.onChange), select.remove();
  }, this.focus = function() {
    select.focus();
  }, this.loadValue = function(item) {
    select.value = (defaultValue = item[args.column.field]) ? "yes" : "no";
  }, this.serializeValue = function() {
    return select.value == "yes";
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return select.value != defaultValue;
  }, this.validate = function() {
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function CheckboxEditor(args) {
  var select, defaultValue, scope = this;
  this.args = args, this.init = function() {
    select = Utils4.createDomElement("input", { className: "editor-checkbox", type: "checkbox", value: "true" }, args.container), select.focus(), args.compositeEditorOptions && select.addEventListener("change", this.onChange);
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.destroy = function() {
    select.removeEventListener("change", this.onChange), select.remove();
  }, this.focus = function() {
    select.focus();
  }, this.loadValue = function(item) {
    defaultValue = !!item[args.column.field], defaultValue ? select.checked = !0 : select.checked = !1;
  }, this.serializeValue = function() {
    return select.checked;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return this.serializeValue() !== defaultValue;
  }, this.validate = function() {
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function PercentCompleteEditor(args) {
  var input, picker, defaultValue, scope = this;
  this.args = args;
  var slider, sliderInputHandler = function() {
    input.value = this.value;
  }, sliderChangeHandler = function() {
    if (args.compositeEditorOptions) {
      var activeCell = args.grid.getActiveCell();
      scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
    }
  };
  this.init = function() {
    input = Utils4.createDomElement("input", { className: "editor-percentcomplete", type: "text" }, args.container), Utils4.width(input, args.container.clientWidth - 25), picker = Utils4.createDomElement("div", { className: "editor-percentcomplete-picker" }, args.container);
    let pickerIcon = Utils4.createDomElement("span", { className: "editor-percentcomplete-picker-icon" }, picker), containerHelper = Utils4.createDomElement("div", { className: "editor-percentcomplete-helper" }, picker), containerWrapper = Utils4.createDomElement("div", { className: "editor-percentcomplete-wrapper" }, containerHelper);
    Utils4.createDomElement("div", { className: "editor-percentcomplete-slider" }, containerWrapper), Utils4.createDomElement("input", { className: "editor-percentcomplete-slider", type: "range" }, containerWrapper);
    let containerButtons = Utils4.createDomElement("div", { className: "editor-percentcomplete-buttons" }, containerWrapper);
    Utils4.createDomElement("button", { value: "0", className: "slick-btn slick-btn-default", textContent: "Not started" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils4.createDomElement("button", { value: "50", className: "slick-btn slick-btn-default", textContent: "In Progress" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils4.createDomElement("button", { value: "100", className: "slick-btn slick-btn-default", textContent: "Complete" }, containerButtons), input.focus(), input.select(), slider = picker.querySelector("input.editor-percentcomplete-slider"), slider.value = defaultValue, slider.addEventListener("input", sliderInputHandler), slider.addEventListener("change", sliderChangeHandler);
    let buttons = picker.querySelectorAll(".editor-percentcomplete-buttons button");
    [].forEach.call(buttons, (button) => {
      button.addEventListener("click", this.onClick);
    });
  }, this.onClick = function() {
    input.value = this.value, slider.value = this.value;
  }, this.destroy = function() {
    slider.removeEventListener("input", sliderInputHandler), slider.removeEventListener("change", sliderChangeHandler), picker.querySelectorAll(".editor-percentcomplete-buttons button").forEach((button) => button.removeEventListener("click", this.onClick)), input.remove(), picker.remove();
  }, this.focus = function() {
    input.focus();
  }, this.loadValue = function(item) {
    defaultValue = item[args.column.field], slider.value = defaultValue, input.value = defaultValue, input.select();
  }, this.serializeValue = function() {
    return parseInt(input.value, 10) || 0;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && (parseInt(input.value, 10) || 0) != defaultValue;
  }, this.validate = function() {
    return isNaN(parseInt(input.value, 10)) ? {
      valid: !1,
      msg: "Please enter a valid positive number"
    } : {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function LongTextEditor(args) {
  var input, wrapper, defaultValue, scope = this;
  this.args = args, this.init = function() {
    var compositeEditorOptions = args.compositeEditorOptions;
    args.grid.getOptions().editorCellNavOnLRKeys;
    var container = compositeEditorOptions ? args.container : document.body;
    if (wrapper = Utils4.createDomElement("div", { className: "slick-large-editor-text" }, container), compositeEditorOptions ? (wrapper.style.position = "relative", Utils4.setStyleSize(wrapper, "padding", 0), Utils4.setStyleSize(wrapper, "border", 0)) : wrapper.style.position = "absolute", input = Utils4.createDomElement("textarea", { rows: 5, style: { background: "white", width: "250px", height: "80px", border: "0", outline: "0" } }, wrapper), compositeEditorOptions)
      input.addEventListener("change", this.onChange);
    else {
      let btnContainer = Utils4.createDomElement("div", { style: "text-align:right" }, wrapper);
      Utils4.createDomElement("button", { id: "save", className: "slick-btn slick-btn-primary", textContent: "Save" }, btnContainer), Utils4.createDomElement("button", { id: "cancel", className: "slick-btn slick-btn-default", textContent: "Cancel" }, btnContainer), wrapper.querySelector("#save").addEventListener("click", this.save), wrapper.querySelector("#cancel").addEventListener("click", this.cancel), input.addEventListener("keydown", this.handleKeyDown), scope.position(args.position);
    }
    input.focus(), input.select();
  }, this.onChange = function() {
    var activeCell = args.grid.getActiveCell();
    scope.validate().valid && scope.applyValue(scope.args.item, scope.serializeValue()), scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue()), args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
  }, this.handleKeyDown = function(e) {
    if (e.which == keyCode3.ENTER && e.ctrlKey)
      scope.save();
    else if (e.which == keyCode3.ESCAPE)
      e.preventDefault(), scope.cancel();
    else if (e.which == keyCode3.TAB && e.shiftKey)
      e.preventDefault(), args.grid.navigatePrev();
    else if (e.which == keyCode3.TAB)
      e.preventDefault(), args.grid.navigateNext();
    else if ((e.which == keyCode3.LEFT || e.which == keyCode3.RIGHT) && args.grid.getOptions().editorCellNavOnLRKeys) {
      var cursorPosition = this.selectionStart, textLength = this.value.length;
      e.keyCode === keyCode3.LEFT && cursorPosition === 0 && args.grid.navigatePrev(), e.keyCode === keyCode3.RIGHT && cursorPosition >= textLength - 1 && args.grid.navigateNext();
    }
  }, this.save = function() {
    (args.grid.getOptions() || {}).autoCommitEdit ? args.grid.getEditorLock().commitCurrentEdit() : args.commitChanges();
  }, this.cancel = function() {
    input.value = defaultValue, args.cancelChanges();
  }, this.hide = function() {
    Utils4.hide(wrapper);
  }, this.show = function() {
    Utils4.show(wrapper);
  }, this.position = function(position) {
    Utils4.setStyleSize(wrapper, "top", position.top - 5), Utils4.setStyleSize(wrapper, "left", position.left - 2);
  }, this.destroy = function() {
    args.compositeEditorOptions ? input.removeEventListener("change", this.onChange) : (wrapper.querySelector("#save").removeEventListener("click", this.save), wrapper.querySelector("#cancel").removeEventListener("click", this.cancel), input.removeEventListener("keydown", this.handleKeyDown)), wrapper.remove();
  }, this.focus = function() {
    input.focus();
  }, this.loadValue = function(item) {
    input.value = defaultValue = item[args.column.field], input.select();
  }, this.serializeValue = function() {
    return input.value;
  }, this.applyValue = function(item, state) {
    item[args.column.field] = state;
  }, this.isValueChanged = function() {
    return !(input.value === "" && defaultValue == null) && input.value != defaultValue;
  }, this.validate = function() {
    if (args.column.validator) {
      var validationResults = args.column.validator(input.value, args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }, this.init();
}
function handleKeydownLRNav(e) {
  var cursorPosition = this.selectionStart, textLength = this.value.length;
  (e.keyCode === keyCode3.LEFT && cursorPosition > 0 || e.keyCode === keyCode3.RIGHT && cursorPosition < textLength - 1) && e.stopImmediatePropagation();
}
function handleKeydownLRNoNav(e) {
  (e.keyCode === keyCode3.LEFT || e.keyCode === keyCode3.RIGHT) && e.stopImmediatePropagation();
}
var Editors = {
  Text: TextEditor,
  Integer: IntegerEditor,
  Float: FloatEditor,
  Flatpickr: FlatpickrEditor,
  YesNoSelect: YesNoSelectEditor,
  Checkbox: CheckboxEditor,
  PercentComplete: PercentCompleteEditor,
  LongText: LongTextEditor
};

// src/slick.formatters.js
function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
  return value == null || value === "" ? "-" : value < 50 ? "<span style='color:red;font-weight:bold;'>" + value + "%</span>" : "<span style='color:green'>" + value + "%</span>";
}
function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
  if (value == null || value === "")
    return "";
  var color;
  return value < 30 ? color = "red" : value < 70 ? color = "silver" : color = "green", "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%' title='" + value + "%'></span>";
}
function YesNoFormatter(row, cell, value, columnDef, dataContext) {
  return value ? "Yes" : "No";
}
function CheckboxFormatter(row, cell, value, columnDef, dataContext) {
  return `<span class="sgi sgi-checkbox-${value ? "intermediate" : "blank-outline"}"></span>`;
}
function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
  return value ? '<span class="sgi sgi-check"></span>' : "";
}
var Formatters = {
  PercentComplete: PercentCompleteFormatter,
  PercentCompleteBar: PercentCompleteBarFormatter,
  YesNo: YesNoFormatter,
  Checkmark: CheckmarkFormatter,
  Checkbox: CheckboxFormatter
};

// src/slick.interactions.js
function Draggable(options) {
  let { containerElement, onDragInit, onDragStart, onDrag, onDragEnd } = options, element, startX, startY, deltaX, deltaY, dragStarted;
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
    element = event.target;
    let targetEvent = event.touches ? event.touches[0] : event, { target } = targetEvent;
    if (!options.allowDragFrom || options.allowDragFrom && element.matches(options.allowDragFrom)) {
      originaldd.dragHandle = element;
      let winScrollPos = windowScrollPosition2(element);
      startX = winScrollPos.left + targetEvent.clientX, startY = winScrollPos.top + targetEvent.clientY, deltaX = targetEvent.clientX - targetEvent.clientX, deltaY = targetEvent.clientY - targetEvent.clientY, originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragInit, event, originaldd), document.addEventListener("mousemove", userMoved), document.addEventListener("touchmove", userMoved), document.addEventListener("mouseup", userReleased), document.addEventListener("touchend", userReleased), document.addEventListener("touchcancel", userReleased);
    }
  }
  function userMoved(event) {
    let targetEvent = event.touches ? event.touches[0] : event;
    deltaX = targetEvent.clientX - startX, deltaY = targetEvent.clientY - startY;
    let { target } = targetEvent;
    dragStarted || (originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragStart, event, originaldd), dragStarted = !0), originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDrag, event, originaldd);
  }
  function userReleased(event) {
    let { target } = event;
    originaldd = Object.assign(originaldd, { target }), executeDragCallbackWhenDefined(onDragEnd, event, originaldd), document.removeEventListener("mousemove", userMoved), document.removeEventListener("touchmove", userMoved), document.removeEventListener("mouseup", userReleased), document.removeEventListener("touchend", userReleased), document.removeEventListener("touchcancel", userReleased), dragStarted = !1;
  }
  function windowScrollPosition2() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || 0
    };
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
    resizeableHandleElement && typeof resizeableHandleElement.removeEventListener == "function" && (resizeableHandleElement.removeEventListener("mousedown", resizeStartHandler), resizeableHandleElement.removeEventListener("touchstart", resizeStartHandler));
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

// src/slick.grid.js
var BindingEventService2 = BindingEventService, ColAutosizeMode2 = ColAutosizeMode, SlickEvent2 = Event, EventData3 = EventData, GlobalEditorLock2 = GlobalEditorLock, GridAutosizeColsMode2 = GridAutosizeColsMode;
var keyCode4 = keyCode, preClickClassName2 = preClickClassName, SlickRange = Range, RowSelectionMode2 = RowSelectionMode, ValueFilterMode2 = ValueFilterMode, Utils5 = Utils, WidthEvalMode2 = WidthEvalMode, Draggable2 = Draggable, MouseWheel2 = MouseWheel, Resizable2 = Resizable, scrollbarDimensions, maxSupportedCssHeight;
function SlickGrid(container, data, columns, options) {
  var defaults2 = {
    alwaysShowVerticalScroll: !1,
    alwaysAllowHorizontalScroll: !1,
    explicitInitialization: !1,
    rowHeight: 25,
    defaultColumnWidth: 80,
    enableAddRow: !1,
    leaveSpaceForNewRows: !1,
    editable: !1,
    autoEdit: !0,
    autoCommitEdit: !1,
    suppressActiveCellChangeOnEdit: !1,
    enableCellNavigation: !0,
    enableColumnReorder: !0,
    asyncEditorLoading: !1,
    asyncEditorLoadDelay: 100,
    forceFitColumns: !1,
    enableAsyncPostRender: !1,
    asyncPostRenderDelay: 50,
    enableAsyncPostRenderCleanup: !1,
    asyncPostRenderCleanupDelay: 40,
    auto: !1,
    editorLock: GlobalEditorLock2,
    showColumnHeader: !0,
    showHeaderRow: !1,
    headerRowHeight: 25,
    createFooterRow: !1,
    showFooterRow: !1,
    footerRowHeight: 25,
    createPreHeaderPanel: !1,
    showPreHeaderPanel: !1,
    preHeaderPanelHeight: 25,
    showTopPanel: !1,
    topPanelHeight: 25,
    formatterFactory: null,
    editorFactory: null,
    cellFlashingCssClass: "flashing",
    selectedCellCssClass: "selected",
    multiSelect: !0,
    enableTextSelectionOnCells: !1,
    dataItemColumnValueExtractor: null,
    frozenBottom: !1,
    frozenColumn: -1,
    frozenRow: -1,
    frozenRightViewportMinWidth: 100,
    fullWidthRows: !1,
    multiColumnSort: !1,
    numberedMultiColumnSort: !1,
    tristateMultiColumnSort: !1,
    sortColNumberInSeparateSpan: !1,
    defaultFormatter,
    forceSyncScrolling: !1,
    addNewRowCssClass: "new-row",
    preserveCopiedSelectionOnPaste: !1,
    showCellSelection: !0,
    viewportClass: null,
    minRowBuffer: 3,
    emulatePagingWhenScrolling: !0,
    // when scrolling off bottom of viewport, place new row at top of viewport
    editorCellNavOnLRKeys: !1,
    enableMouseWheelScrollHandler: !0,
    doPaging: !0,
    autosizeColsMode: GridAutosizeColsMode2.LegacyOff,
    autosizeColPaddingPx: 4,
    autosizeTextAvgToMWidthRatio: 0.75,
    viewportSwitchToScrollModeWidthPercent: void 0,
    viewportMinWidthPx: void 0,
    viewportMaxWidthPx: void 0,
    suppressCssChangesOnHiddenInit: !1,
    scrollDebounceDelay: -1,
    // add a scroll delay to avoid screen flickering, -1 to disable delay
    ffMaxSupportedCssHeight: 6e6,
    maxSupportedCssHeight: 1e9,
    sanitizer: void 0,
    // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
    logSanitizedHtml: !1
    // log to console when sanitised - recommend true for testing of dev and production
  }, columnDefaults = {
    name: "",
    resizable: !0,
    sortable: !1,
    minWidth: 30,
    maxWidth: void 0,
    rerenderOnResize: !1,
    headerCssClass: null,
    defaultSortAsc: !0,
    focusable: !0,
    selectable: !0,
    hidden: !1
  }, columnAutosizeDefaults = {
    ignoreHeaderText: !1,
    colValueArray: void 0,
    allowAddlPercent: void 0,
    formatterOverride: void 0,
    autosizeMode: ColAutosizeMode2.ContentIntelligent,
    rowSelectionModeOnInit: void 0,
    rowSelectionMode: RowSelectionMode2.FirstNRows,
    rowSelectionCount: 100,
    valueFilterMode: ValueFilterMode2.None,
    widthEvalMode: WidthEvalMode2.Auto,
    sizeToRemaining: void 0,
    widthPx: void 0,
    contentSizePx: 0,
    headerWidthPx: 0,
    colDataTypeOf: void 0
  }, th, h, ph, n, cj, page = 0, offset2 = 0, vScrollDir = 1;
  let show2 = Utils5.show, hide2 = Utils5.hide;
  var _bindingEventService = new BindingEventService2(), initialized = !1, _container, uid = "slickgrid_" + Math.round(1e6 * Math.random()), self = this, _focusSink, _focusSink2, _groupHeaders = [], _headerScroller = [], _headers = [], _headerRows, _headerRowScroller, _headerRowSpacerL, _headerRowSpacerR, _footerRow, _footerRowScroller, _footerRowSpacerL, _footerRowSpacerR, _preHeaderPanel, _preHeaderPanelScroller, _preHeaderPanelSpacer, _preHeaderPanelR, _preHeaderPanelScrollerR, _preHeaderPanelSpacerR, _topPanelScrollers, _topPanels, _viewport, _canvas, _style, _boundAncestors = [], stylesheet, columnCssRulesL, columnCssRulesR, viewportH, viewportW, canvasWidth, canvasWidthL, canvasWidthR, headersWidth, headersWidthL, headersWidthR, viewportHasHScroll, viewportHasVScroll, headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, cellWidthDiff = 0, cellHeightDiff = 0, absoluteColumnMinWidth, hasFrozenRows = !1, frozenRowsHeight = 0, actualFrozenRow = -1, paneTopH = 0, paneBottomH = 0, viewportTopH = 0, viewportBottomH = 0, topPanelH = 0, headerRowH = 0, footerRowH = 0, tabbingDirection = 1, _activeCanvasNode, _activeViewportNode, activePosX, activeRow, activeCell, activeCellNode = null, currentEditor = null, serializedEditorValue, editController, rowsCache = {}, renderedRows = 0, numVisibleRows = 0, prevScrollTop = 0, scrollTop = 0, lastRenderedScrollTop = 0, lastRenderedScrollLeft = 0, prevScrollLeft = 0, scrollLeft = 0, selectionModel, selectedRows = [], plugins = [], cellCssClasses = {}, columnsById = {}, sortColumns = [], columnPosLeft = [], columnPosRight = [], pagingActive = !1, pagingIsLastPage = !1, scrollThrottle = ActionThrottle(render, 50), h_editorLoader = null, h_render = null, h_postrender = null, h_postrenderCleanup = null, postProcessedRows = {}, postProcessToRow = null, postProcessFromRow = null, postProcessedCleanupQueue = [], postProcessgroupId = 0, counter_rows_rendered = 0, counter_rows_removed = 0, _paneHeaderL, _paneHeaderR, _paneTopL, _paneTopR, _paneBottomL, _paneBottomR, _headerScrollerL, _headerScrollerR, _headerL, _headerR, _groupHeadersL, _groupHeadersR, _headerRowScrollerL, _headerRowScrollerR, _footerRowScrollerL, _footerRowScrollerR, _headerRowL, _headerRowR, _footerRowL, _footerRowR, _topPanelScrollerL, _topPanelScrollerR, _topPanelL, _topPanelR, _viewportTopL, _viewportTopR, _viewportBottomL, _viewportBottomR, _canvasTopL, _canvasTopR, _canvasBottomL, _canvasBottomR, _viewportScrollContainerX, _viewportScrollContainerY, _headerScrollContainer, _headerRowScrollContainer, _footerRowScrollContainer, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, _hiddenParents, oldProps = [], enforceFrozenRowHeightRecalc = !1, columnResizeDragging = !1, slickDraggableInstance = null, slickMouseWheelInstances = [], slickResizableInstances = [], sortableSideLeftInstance, sortableSideRightInstance;
  function init() {
    if (typeof container == "string" ? _container = document.querySelector(container) : _container = container, !_container)
      throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
    if (maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight(), options = Utils5.extend(!0, {}, defaults2, options), validateAndEnforceOptions(), columnDefaults.width = options.defaultColumnWidth, options.suppressCssChangesOnHiddenInit || cacheCssForHiddenInit(), updateColumnProps(), options.enableColumnReorder && (!Sortable || !Sortable.create))
      throw new Error("SlickGrid requires Sortable.js module to be loaded");
    editController = {
      commitCurrentEdit,
      cancelCurrentEdit
    }, _container.replaceChildren(), _container.style.overflow = "hidden", _container.style.outline = 0, _container.classList.add(uid), _container.classList.add("ui-widget");
    let containerStyles = window.getComputedStyle(_container);
    /relative|absolute|fixed/.test(containerStyles.position) || (_container.style.position = "relative"), _focusSink = Utils5.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, _container), _paneHeaderL = Utils5.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, _container), _paneHeaderR = Utils5.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, _container), _paneTopL = Utils5.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, _container), _paneTopR = Utils5.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, _container), _paneBottomL = Utils5.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, _container), _paneBottomR = Utils5.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, _container), options.createPreHeaderPanel && (_preHeaderPanelScroller = Utils5.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, _paneHeaderL), _preHeaderPanelScroller.appendChild(document.createElement("div")), _preHeaderPanel = Utils5.createDomElement("div", null, _preHeaderPanelScroller), _preHeaderPanelSpacer = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _preHeaderPanelScroller), _preHeaderPanelScrollerR = Utils5.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, _paneHeaderR), _preHeaderPanelR = Utils5.createDomElement("div", null, _preHeaderPanelScrollerR), _preHeaderPanelSpacerR = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _preHeaderPanelScrollerR), options.showPreHeaderPanel || (hide2(_preHeaderPanelScroller), hide2(_preHeaderPanelScrollerR))), _headerScrollerL = Utils5.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, _paneHeaderL), _headerScrollerR = Utils5.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, _paneHeaderR), _headerScroller.push(_headerScrollerL), _headerScroller.push(_headerScrollerR), _headerL = Utils5.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", style: { left: "-1000px" } }, _headerScrollerL), _headerR = Utils5.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", style: { left: "-1000px" } }, _headerScrollerR), _headers = [_headerL, _headerR], _headerRowScrollerL = Utils5.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, _paneTopL), _headerRowScrollerR = Utils5.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, _paneTopR), _headerRowScroller = [_headerRowScrollerL, _headerRowScrollerR], _headerRowSpacerL = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _headerRowScrollerL), _headerRowSpacerR = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _headerRowScrollerR), _headerRowL = Utils5.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, _headerRowScrollerL), _headerRowR = Utils5.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, _headerRowScrollerR), _headerRows = [_headerRowL, _headerRowR], _topPanelScrollerL = Utils5.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, _paneTopL), _topPanelScrollerR = Utils5.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, _paneTopR), _topPanelScrollers = [_topPanelScrollerL, _topPanelScrollerR], _topPanelL = Utils5.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, _topPanelScrollerL), _topPanelR = Utils5.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, _topPanelScrollerR), _topPanels = [_topPanelL, _topPanelR], options.showColumnHeader || _headerScroller.forEach(function(el) {
      hide2(el);
    }), options.showTopPanel || _topPanelScrollers.forEach(function(scroller) {
      hide2(scroller);
    }), options.showHeaderRow || _headerRowScroller.forEach(function(scroller) {
      hide2(scroller);
    }), _viewportTopL = Utils5.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, _paneTopL), _viewportTopR = Utils5.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, _paneTopR), _viewportBottomL = Utils5.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, _paneBottomL), _viewportBottomR = Utils5.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, _paneBottomR), _viewport = [_viewportTopL, _viewportTopR, _viewportBottomL, _viewportBottomR], options.viewportClass && _viewport.forEach(function(view) {
      view.classList.add(options.viewportClass);
    }), _activeViewportNode = _viewportTopL, _canvasTopL = Utils5.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, _viewportTopL), _canvasTopR = Utils5.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, _viewportTopR), _canvasBottomL = Utils5.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, _viewportBottomL), _canvasBottomR = Utils5.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, _viewportBottomR), _canvas = [_canvasTopL, _canvasTopR, _canvasBottomL, _canvasBottomR], scrollbarDimensions = scrollbarDimensions || measureScrollbar(), _activeCanvasNode = _canvasTopL, _preHeaderPanelSpacer && Utils5.width(_preHeaderPanelSpacer, getCanvasWidth() + scrollbarDimensions.width), _headers.forEach(function(el) {
      Utils5.width(el, getHeadersWidth());
    }), Utils5.width(_headerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width), Utils5.width(_headerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width), options.createFooterRow && (_footerRowScrollerR = Utils5.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, _paneTopR), _footerRowScrollerL = Utils5.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, _paneTopL), _footerRowScroller = [_footerRowScrollerL, _footerRowScrollerR], _footerRowSpacerL = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _footerRowScrollerL), Utils5.width(_footerRowSpacerL, getCanvasWidth() + scrollbarDimensions.width), _footerRowSpacerR = Utils5.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, _footerRowScrollerR), Utils5.width(_footerRowSpacerR, getCanvasWidth() + scrollbarDimensions.width), _footerRowL = Utils5.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, _footerRowScrollerL), _footerRowR = Utils5.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, _footerRowScrollerR), _footerRow = [_footerRowL, _footerRowR], options.showFooterRow || _footerRowScroller.forEach(function(scroller) {
      hide2(scroller);
    })), _focusSink2 = _focusSink.cloneNode(!0), _container.append(_focusSink2), options.explicitInitialization || finishInitialization();
  }
  function finishInitialization() {
    initialized || (initialized = !0, getViewportWidth(), getViewportHeight(), measureCellPaddingAndBorder(), disableSelection(_headers), options.enableTextSelectionOnCells || _viewport.forEach(function(view) {
      _bindingEventService.bind(view, "selectstart.ui", function(event) {
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      });
    }), setFrozenOptions(), setPaneVisibility(), setScroller(), setOverflow(), updateColumnCaches(), createColumnHeaders(), createColumnFooter(), setupColumnSort(), createCssRules(), resizeCanvas(), bindAncestorScrollEvents(), _bindingEventService.bind(_container, "resize.slickgrid", resizeCanvas), _viewport.forEach(function(view) {
      _bindingEventService.bind(view, "scroll", handleScroll);
    }), options.enableMouseWheelScrollHandler && _viewport.forEach(function(view) {
      slickMouseWheelInstances.push(MouseWheel2({
        element: view,
        onMouseWheel: handleMouseWheel
      }));
    }), _headerScroller.forEach(function(el) {
      _bindingEventService.bind(el, "contextmenu", handleHeaderContextMenu), _bindingEventService.bind(el, "click", handleHeaderClick);
    }), _headerRowScroller.forEach(function(scroller) {
      _bindingEventService.bind(scroller, "scroll", handleHeaderRowScroll);
    }), options.createFooterRow && (_footerRow.forEach(function(footer) {
      _bindingEventService.bind(footer, "contextmenu", handleFooterContextMenu), _bindingEventService.bind(footer, "click", handleFooterClick);
    }), _footerRowScroller.forEach(function(scroller) {
      _bindingEventService.bind(scroller, "scroll", handleFooterRowScroll);
    })), options.createPreHeaderPanel && _bindingEventService.bind(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll), _bindingEventService.bind(_focusSink, "keydown", handleKeyDown), _bindingEventService.bind(_focusSink2, "keydown", handleKeyDown), _canvas.forEach(function(element) {
      _bindingEventService.bind(element, "keydown", handleKeyDown), _bindingEventService.bind(element, "click", handleClick), _bindingEventService.bind(element, "dblclick", handleDblClick), _bindingEventService.bind(element, "contextmenu", handleContextMenu), _bindingEventService.bind(element, "mouseover", handleCellMouseOver), _bindingEventService.bind(element, "mouseout", handleCellMouseOut);
    }), Draggable2 && (slickDraggableInstance = Draggable2({
      containerElement: _container,
      allowDragFrom: "div.slick-cell",
      onDragInit: handleDragInit,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd
    })), options.suppressCssChangesOnHiddenInit || restoreCssFromHiddenInit());
  }
  function cacheCssForHiddenInit() {
    _hiddenParents = Utils5.parents(_container, ":hidden");
    for (let el of _hiddenParents) {
      var old = {};
      for (let name in cssShow)
        old[name] = el.style[name], el.style[name] = cssShow[name];
      oldProps.push(old);
    }
  }
  function restoreCssFromHiddenInit() {
    let i2 = 0;
    for (let el of _hiddenParents) {
      var old = oldProps[i2++];
      for (let name in cssShow)
        el.style[name] = old[name];
    }
  }
  function hasFrozenColumns() {
    return options.frozenColumn > -1;
  }
  function registerPlugin(plugin) {
    plugins.unshift(plugin), plugin.init(self);
  }
  function unregisterPlugin(plugin) {
    for (var i2 = plugins.length; i2 >= 0; i2--)
      if (plugins[i2] === plugin) {
        plugins[i2].destroy && plugins[i2].destroy(), plugins.splice(i2, 1);
        break;
      }
  }
  function getPluginByName(name) {
    for (var i2 = plugins.length - 1; i2 >= 0; i2--)
      if (plugins[i2].pluginName === name)
        return plugins[i2];
  }
  function setSelectionModel(model) {
    selectionModel && (selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged), selectionModel.destroy && selectionModel.destroy()), selectionModel = model, selectionModel && (selectionModel.init(self), selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged));
  }
  function getSelectionModel() {
    return selectionModel;
  }
  function getCanvasNode(columnIdOrIdx, rowIndex) {
    return _getContainerElement(getCanvases(), columnIdOrIdx, rowIndex);
  }
  function getActiveCanvasNode(e) {
    return e === void 0 || (e instanceof EventData3 && (e = e.getNativeEvent()), _activeCanvasNode = e.target.closest(".grid-canvas")), _activeCanvasNode;
  }
  function getCanvases() {
    return _canvas;
  }
  function getViewportNode(columnIdOrIdx, rowIndex) {
    return _getContainerElement(getViewports(), columnIdOrIdx, rowIndex);
  }
  function getViewports() {
    return _viewport;
  }
  function getActiveViewportNode(e) {
    return setActiveViewportNode(e), _activeViewportNode;
  }
  function setActiveViewportNode(e) {
    return e instanceof EventData3 && (e = e.getNativeEvent()), _activeViewportNode = e.target.closest(".slick-viewport"), _activeViewportNode;
  }
  function _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
    if (targetContainers) {
      columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
      var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), isBottomSide = hasFrozenRows && rowIndex >= actualFrozenRow + (options.frozenBottom ? 0 : 1), isRightSide = hasFrozenColumns() && idx > options.frozenColumn;
      return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
    }
  }
  function measureScrollbar() {
    var outerdiv = Utils5.createDomElement("div", { className: _viewport.className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils5.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
      width: outerdiv.offsetWidth - outerdiv.clientWidth,
      height: outerdiv.offsetHeight - outerdiv.clientHeight
    };
    return innerdiv.remove(), outerdiv.remove(), dim;
  }
  function getHeadersWidth() {
    headersWidth = headersWidthL = headersWidthR = 0;
    for (var includeScrollbar = !options.autoHeight, i2 = 0, ii = columns.length; i2 < ii; i2++)
      if (!(!columns[i2] || columns[i2].hidden)) {
        var width2 = columns[i2].width;
        options.frozenColumn > -1 && i2 > options.frozenColumn ? headersWidthR += width2 : headersWidthL += width2;
      }
    return includeScrollbar && (options.frozenColumn > -1 && i2 > options.frozenColumn ? headersWidthR += scrollbarDimensions.width : headersWidthL += scrollbarDimensions.width), hasFrozenColumns() ? (headersWidthL = headersWidthL + 1e3, headersWidthR = Math.max(headersWidthR, viewportW) + headersWidthL, headersWidthR += scrollbarDimensions.width) : (headersWidthL += scrollbarDimensions.width, headersWidthL = Math.max(headersWidthL, viewportW) + 1e3), headersWidth = headersWidthL + headersWidthR, Math.max(headersWidth, viewportW) + 1e3;
  }
  function getHeadersWidthL() {
    return headersWidthL = 0, columns.forEach(function(column, i2) {
      column.hidden || options.frozenColumn > -1 && i2 > options.frozenColumn || (headersWidthL += column.width);
    }), hasFrozenColumns() ? headersWidthL += 1e3 : (headersWidthL += scrollbarDimensions.width, headersWidthL = Math.max(headersWidthL, viewportW) + 1e3), headersWidthL;
  }
  function getHeadersWidthR() {
    return headersWidthR = 0, columns.forEach(function(column, i2) {
      column.hidden || options.frozenColumn > -1 && i2 > options.frozenColumn && (headersWidthR += column.width);
    }), hasFrozenColumns() && (headersWidthR = Math.max(headersWidthR, viewportW) + getHeadersWidthL(), headersWidthR += scrollbarDimensions.width), headersWidthR;
  }
  function getCanvasWidth() {
    var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW, i2 = columns.length;
    for (canvasWidthL = canvasWidthR = 0; i2--; )
      !columns[i2] || columns[i2].hidden || (hasFrozenColumns() && i2 > options.frozenColumn ? canvasWidthR += columns[i2].width : canvasWidthL += columns[i2].width);
    var totalRowWidth = canvasWidthL + canvasWidthR;
    if (options.fullWidthRows) {
      var extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
      extraWidth > 0 && (totalRowWidth += extraWidth, hasFrozenColumns() ? canvasWidthR += extraWidth : canvasWidthL += extraWidth);
    }
    return totalRowWidth;
  }
  function updateCanvasWidth(forceColumnWidthsUpdate) {
    var oldCanvasWidth = canvasWidth, oldCanvasWidthL = canvasWidthL, oldCanvasWidthR = canvasWidthR, widthChanged;
    if (canvasWidth = getCanvasWidth(), widthChanged = canvasWidth !== oldCanvasWidth || canvasWidthL !== oldCanvasWidthL || canvasWidthR !== oldCanvasWidthR, widthChanged || hasFrozenColumns() || hasFrozenRows)
      if (Utils5.width(_canvasTopL, canvasWidthL), getHeadersWidth(), Utils5.width(_headerL, headersWidthL), Utils5.width(_headerR, headersWidthR), hasFrozenColumns()) {
        let cWidth = Utils5.width(_container) || 0;
        if (cWidth > 0 && canvasWidthL > cWidth)
          throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
        Utils5.width(_canvasTopR, canvasWidthR), Utils5.width(_paneHeaderL, canvasWidthL), Utils5.setStyleSize(_paneHeaderR, "left", canvasWidthL), Utils5.setStyleSize(_paneHeaderR, "width", viewportW - canvasWidthL), Utils5.width(_paneTopL, canvasWidthL), Utils5.setStyleSize(_paneTopR, "left", canvasWidthL), Utils5.width(_paneTopR, viewportW - canvasWidthL), Utils5.width(_headerRowScrollerL, canvasWidthL), Utils5.width(_headerRowScrollerR, viewportW - canvasWidthL), Utils5.width(_headerRowL, canvasWidthL), Utils5.width(_headerRowR, canvasWidthR), options.createFooterRow && (Utils5.width(_footerRowScrollerL, canvasWidthL), Utils5.width(_footerRowScrollerR, viewportW - canvasWidthL), Utils5.width(_footerRowL, canvasWidthL), Utils5.width(_footerRowR, canvasWidthR)), options.createPreHeaderPanel && Utils5.width(_preHeaderPanel, canvasWidth), Utils5.width(_viewportTopL, canvasWidthL), Utils5.width(_viewportTopR, viewportW - canvasWidthL), hasFrozenRows && (Utils5.width(_paneBottomL, canvasWidthL), Utils5.setStyleSize(_paneBottomR, "left", canvasWidthL), Utils5.width(_viewportBottomL, canvasWidthL), Utils5.width(_viewportBottomR, viewportW - canvasWidthL), Utils5.width(_canvasBottomL, canvasWidthL), Utils5.width(_canvasBottomR, canvasWidthR));
      } else
        Utils5.width(_paneHeaderL, "100%"), Utils5.width(_paneTopL, "100%"), Utils5.width(_headerRowScrollerL, "100%"), Utils5.width(_headerRowL, canvasWidth), options.createFooterRow && (Utils5.width(_footerRowScrollerL, "100%"), Utils5.width(_footerRowL, canvasWidth)), options.createPreHeaderPanel && Utils5.width(_preHeaderPanel, canvasWidth), Utils5.width(_viewportTopL, "100%"), hasFrozenRows && (Utils5.width(_viewportBottomL, "100%"), Utils5.width(_canvasBottomL, canvasWidthL));
    viewportHasHScroll = canvasWidth >= viewportW - scrollbarDimensions.width, Utils5.width(_headerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), Utils5.width(_headerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), options.createFooterRow && (Utils5.width(_footerRowSpacerL, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0)), Utils5.width(_footerRowSpacerR, canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0))), (widthChanged || forceColumnWidthsUpdate) && applyColumnWidths();
  }
  function disableSelection(target) {
    target.forEach(function(el) {
      el.setAttribute("unselectable", "on"), el.style.MozUserSelect = "none", _bindingEventService.bind(el, "selectstart.ui", function() {
        return !1;
      });
    });
  }
  function getMaxSupportedCssHeight() {
    let supportedHeight = 1e6, testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? options.ffMaxSupportedCssHeight : options.maxSupportedCssHeight, div = Utils5.createDomElement("div", { style: { display: "hidden" } }, document.body);
    for (; ; ) {
      let test = supportedHeight * 2;
      Utils5.height(div, test);
      let height2 = Utils5.height(div);
      if (test > testUpTo || height2 !== test)
        break;
      supportedHeight = test;
    }
    return div.remove(), supportedHeight;
  }
  function getUID() {
    return uid;
  }
  function getHeaderColumnWidthDiff() {
    return headerColumnWidthDiff;
  }
  function getScrollbarDimensions() {
    return scrollbarDimensions;
  }
  function getDisplayedScrollbarDimensions() {
    return {
      width: viewportHasVScroll ? scrollbarDimensions.width : 0,
      height: viewportHasHScroll ? scrollbarDimensions.height : 0
    };
  }
  function getAbsoluteColumnMinWidth() {
    return absoluteColumnMinWidth;
  }
  function bindAncestorScrollEvents() {
    for (var elem = hasFrozenRows && !options.frozenBottom ? _canvasBottomL : _canvasTopL; (elem = elem.parentNode) != document.body && elem != null; )
      (elem == _viewportTopL || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) && (_boundAncestors.push(elem), _bindingEventService.bind(elem, "scroll." + uid, handleActiveCellPositionChange));
  }
  function unbindAncestorScrollEvents() {
    _boundAncestors.forEach(function(ancestor) {
      _bindingEventService.unbindByEventName(ancestor, "scroll." + uid);
    }), _boundAncestors = [];
  }
  function updateColumnHeader(columnId, title, toolTip) {
    if (initialized) {
      var idx = getColumnIndex(columnId);
      if (idx != null) {
        var columnDef = columns[idx], header = getColumnByIndex(idx);
        header && (title !== void 0 && (columns[idx].name = title), toolTip !== void 0 && (columns[idx].toolTip = toolTip), trigger(self.onBeforeHeaderCellDestroy, {
          node: header,
          column: columnDef,
          grid: self
        }), header.setAttribute("title", toolTip || ""), title !== void 0 && (header.children[0].innerHTML = sanitizeHtmlString(title)), trigger(self.onHeaderCellRendered, {
          node: header,
          column: columnDef,
          grid: self
        }));
      }
    }
  }
  function getHeader(columnDef) {
    if (!columnDef)
      return hasFrozenColumns() ? _headers : _headerL;
    var idx = getColumnIndex(columnDef.id);
    return hasFrozenColumns() ? idx <= options.frozenColumn ? _headerL : _headerR : _headerL;
  }
  function getHeaderColumn(columnIdOrIdx) {
    var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), targetHeader = hasFrozenColumns() ? idx <= options.frozenColumn ? _headerL : _headerR : _headerL, targetIndex = hasFrozenColumns() ? idx <= options.frozenColumn ? idx : idx - options.frozenColumn - 1 : idx;
    return targetHeader.children[targetIndex];
  }
  function getHeaderRow() {
    return hasFrozenColumns() ? _headerRows : _headerRows[0];
  }
  function getFooterRow() {
    return hasFrozenColumns() ? _footerRow : _footerRow[0];
  }
  function getPreHeaderPanel() {
    return _preHeaderPanel;
  }
  function getPreHeaderPanelRight() {
    return _preHeaderPanelR;
  }
  function getHeaderRowColumn(columnIdOrIdx) {
    var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), headerRowTarget;
    return hasFrozenColumns() ? idx <= options.frozenColumn ? headerRowTarget = _headerRowL : (headerRowTarget = _headerRowR, idx -= options.frozenColumn + 1) : headerRowTarget = _headerRowL, headerRowTarget.children[idx];
  }
  function getFooterRowColumn(columnIdOrIdx) {
    var idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : getColumnIndex(columnIdOrIdx), footerRowTarget;
    return hasFrozenColumns() ? idx <= options.frozenColumn ? footerRowTarget = _footerRowL : (footerRowTarget = _footerRowR, idx -= options.frozenColumn + 1) : footerRowTarget = _footerRowL, footerRowTarget.children[idx];
  }
  function createColumnFooter() {
    if (options.createFooterRow) {
      _footerRow.forEach(function(footer) {
        footer.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
          let columnDef = Utils5.storage.get(column, "column");
          trigger(self.onBeforeFooterRowCellDestroy, {
            node: column,
            column: columnDef,
            grid: self
          });
        });
      }), _footerRowL.replaceChildren(), _footerRowR.replaceChildren();
      for (var i2 = 0; i2 < columns.length; i2++) {
        var m = columns[i2];
        if (!m || m.hidden)
          continue;
        let footerRowCell = Utils5.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i2} r${i2}` }, hasFrozenColumns() && i2 > options.frozenColumn ? _footerRowR : _footerRowL), className = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null;
        className && footerRowCell.classList.add(className), Utils5.storage.put(footerRowCell, "column", m), trigger(self.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: self
        });
      }
    }
  }
  function handleHeaderMouseHoverOn(e) {
    e.target.classList.add("ui-state-hover", "slick-state-hover");
  }
  function handleHeaderMouseHoverOff(e) {
    e.target.classList.remove("ui-state-hover", "slick-state-hover");
  }
  function createColumnHeaders() {
    _headers.forEach(function(header) {
      header.querySelectorAll(".slick-header-column").forEach(function(column) {
        var columnDef = Utils5.storage.get(column, "column");
        columnDef && trigger(self.onBeforeHeaderCellDestroy, {
          node: column,
          column: columnDef,
          grid: self
        });
      });
    }), _headerL.replaceChildren(), _headerR.replaceChildren(), getHeadersWidth(), Utils5.width(_headerL, headersWidthL), Utils5.width(_headerR, headersWidthR), _headerRows.forEach(function(row) {
      row.querySelectorAll(".slick-headerrow-column").forEach(function(column) {
        let columnDef = Utils5.storage.get(column, "column");
        columnDef && trigger(self.onBeforeHeaderRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: self
        });
      });
    }), _headerRowL.replaceChildren(), _headerRowR.replaceChildren(), options.createFooterRow && (_footerRowL.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
      var columnDef = Utils5.storage.get(column, "column");
      columnDef && trigger(self.onBeforeFooterRowCellDestroy, {
        node: this,
        column: columnDef,
        grid: self
      });
    }), _footerRowL.replaceChildren(), hasFrozenColumns() && (_footerRowR.querySelectorAll(".slick-footerrow-column").forEach(function(column) {
      var columnDef = Utils5.storage.get(column, "column");
      columnDef && trigger(self.onBeforeFooterRowCellDestroy, {
        node: this,
        column: columnDef,
        grid: self
      });
    }), _footerRowR.replaceChildren()));
    for (var i2 = 0; i2 < columns.length; i2++) {
      let m = columns[i2], headerTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _headerL : _headerR : _headerL, headerRowTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _headerRowL : _headerRowR : _headerRowL, header = Utils5.createDomElement("div", { id: `${uid + m.id}`, dataset: { id: m.id }, className: "ui-state-default slick-state-default slick-header-column", title: m.toolTip || "" }, headerTarget);
      Utils5.createDomElement("span", { className: "slick-column-name", innerHTML: sanitizeHtmlString(m.name) }, header), Utils5.width(header, m.width - headerColumnWidthDiff);
      let classname = m.headerCssClass || null;
      if (classname && header.classList.add(classname), classname = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), _bindingEventService.bind(header, "mouseenter", handleHeaderMouseEnter), _bindingEventService.bind(header, "mouseleave", handleHeaderMouseLeave), Utils5.storage.put(header, "column", m), (options.enableColumnReorder || m.sortable) && (_bindingEventService.bind(header, "mouseenter", handleHeaderMouseHoverOn), _bindingEventService.bind(header, "mouseleave", handleHeaderMouseHoverOff)), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object)
        for (var key in m.headerCellAttrs)
          m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
      if (m.sortable && (header.classList.add("slick-header-sortable"), Utils5.createDomElement("div", { className: `slick-sort-indicator ${options.numberedMultiColumnSort && !options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : ""}` }, header), options.numberedMultiColumnSort && options.sortColNumberInSeparateSpan && Utils5.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), trigger(self.onHeaderCellRendered, {
        node: header,
        column: m,
        grid: self
      }), options.showHeaderRow) {
        let headerRowCell = Utils5.createDomElement("div", { className: `ui-state-default slick-state-default slick-headerrow-column l${i2} r${i2}` }, headerRowTarget), classname2 = hasFrozenColumns() && i2 <= options.frozenColumn ? "frozen" : null;
        classname2 && headerRowCell.classList.add(classname2), _bindingEventService.bind(headerRowCell, "mouseenter", handleHeaderRowMouseEnter), _bindingEventService.bind(headerRowCell, "mouseleave", handleHeaderRowMouseLeave), Utils5.storage.put(headerRowCell, "column", m), trigger(self.onHeaderRowCellRendered, {
          node: headerRowCell,
          column: m,
          grid: self
        });
      }
      if (options.createFooterRow && options.showFooterRow) {
        let footerRowTarget = hasFrozenColumns() ? i2 <= options.frozenColumn ? _footerRow[0] : _footerRow[1] : _footerRow[0], footerRowCell = Utils5.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i2} r${i2}` }, footerRowTarget);
        Utils5.storage.put(footerRowCell, "column", m), trigger(self.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: self
        });
      }
    }
    setSortColumns(sortColumns), setupColumnResize(), options.enableColumnReorder && (typeof options.enableColumnReorder == "function" ? options.enableColumnReorder(self, _headers, headerColumnWidthDiff, setColumns, setupColumnResize, columns, getColumnIndex, uid, trigger) : setupColumnReorder());
  }
  function setupColumnSort() {
    _headers.forEach(function(header) {
      _bindingEventService.bind(header, "click", function(e) {
        if (!columnResizeDragging && !e.target.classList.contains("slick-resizable-handle")) {
          var coll = e.target.closest(".slick-header-column");
          if (coll) {
            var column = Utils5.storage.get(coll, "column");
            if (column.sortable) {
              if (!getEditorLock().commitCurrentEdit())
                return;
              for (var previousSortColumns = sortColumns.slice(), sortColumn = null, i2 = 0; i2 < sortColumns.length; i2++)
                if (sortColumns[i2].columnId == column.id) {
                  sortColumn = sortColumns[i2], sortColumn.sortAsc = !sortColumn.sortAsc;
                  break;
                }
              var hadSortCol = !!sortColumn;
              options.tristateMultiColumnSort ? (sortColumn || (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc }), hadSortCol && sortColumn.sortAsc && (sortColumns.splice(i2, 1), sortColumn = null), options.multiColumnSort || (sortColumns = []), sortColumn && (!hadSortCol || !options.multiColumnSort) && sortColumns.push(sortColumn)) : e.metaKey && options.multiColumnSort ? sortColumn && sortColumns.splice(i2, 1) : ((!e.shiftKey && !e.metaKey || !options.multiColumnSort) && (sortColumns = []), sortColumn ? sortColumns.length === 0 && sortColumns.push(sortColumn) : (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc }, sortColumns.push(sortColumn)));
              var onSortArgs;
              options.multiColumnSort ? onSortArgs = {
                multiColumnSort: !0,
                previousSortColumns,
                sortCols: sortColumns.map(function(col) {
                  return { columnId: columns[getColumnIndex(col.columnId)].id, sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
                })
              } : onSortArgs = {
                multiColumnSort: !1,
                previousSortColumns,
                columnId: sortColumns.length > 0 ? column.id : null,
                sortCol: sortColumns.length > 0 ? column : null,
                sortAsc: sortColumns.length > 0 ? sortColumns[0].sortAsc : !0
              }, trigger(self.onBeforeSort, onSortArgs, e).getReturnValue() !== !1 && (setSortColumns(sortColumns), trigger(self.onSort, onSortArgs, e));
            }
          }
        }
      });
    });
  }
  function currentPositionInHeader(id) {
    let currentPosition = 0;
    return _headers.forEach(function(header) {
      header.querySelectorAll(".slick-header-column").forEach(function(column) {
        column.id == id && (currentPosition = i);
      });
    }), currentPosition;
  }
  function remove(arr, elem) {
    var index = arr.lastIndexOf(elem);
    index > -1 && (arr.splice(index, 1), remove(arr, elem));
  }
  function setupColumnReorder() {
    sortableSideLeftInstance && (sortableSideLeftInstance.destroy(), sortableSideRightInstance.destroy());
    var columnScrollTimer = null;
    function scrollColumnsRight() {
      _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft + 10;
    }
    function scrollColumnsLeft() {
      _viewportScrollContainerX.scrollLeft = _viewportScrollContainerX.scrollLeft - 10;
    }
    var canDragScroll, sortableOptions = {
      animation: 50,
      direction: "horizontal",
      chosenClass: "slick-header-column-active",
      ghostClass: "slick-sortable-placeholder",
      draggable: ".slick-header-column",
      dragoverBubble: !1,
      revertClone: !0,
      scroll: !hasFrozenColumns(),
      // enable auto-scroll
      onStart: function(e) {
        canDragScroll = !hasFrozenColumns() || Utils5.offset(e.item).left > Utils5.offset(_viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > _container.clientWidth ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils5.offset(_viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsLeft, 100)) : (clearInterval(columnScrollTimer), columnScrollTimer = null);
      },
      onEnd: function(e) {
        var cancel = !1;
        clearInterval(columnScrollTimer), columnScrollTimer = null;
        var limit = null;
        if (!(cancel || !getEditorLock().commitCurrentEdit())) {
          var reorderedIds = sortableSideLeftInstance.toArray();
          reorderedIds = reorderedIds.concat(sortableSideRightInstance.toArray());
          for (var reorderedColumns = [], i2 = 0; i2 < reorderedIds.length; i2++)
            reorderedColumns.push(columns[getColumnIndex(reorderedIds[i2])]);
          setColumns(reorderedColumns), trigger(self.onColumnsReordered, { impactedColumns: getImpactedColumns(limit) }), e.stopPropagation(), setupColumnResize();
        }
      }
    };
    sortableSideLeftInstance = Sortable.create(_headerL, sortableOptions), sortableSideRightInstance = Sortable.create(_headerR, sortableOptions);
  }
  function getHeaderChildren() {
    let a = Array.from(_headers[0].children), b = Array.from(_headers[1].children);
    return a.concat(b);
  }
  function getImpactedColumns(limit) {
    var impactedColumns = [];
    if (limit)
      for (var i2 = limit.start; i2 <= limit.end; i2++)
        impactedColumns.push(columns[i2]);
    else
      impactedColumns = columns;
    return impactedColumns;
  }
  function handleResizeableHandleDoubleClick(evt) {
    let triggeredByColumn = evt.target.parentElement.id.replace(uid, "");
    trigger(self.onColumnsResizeDblClick, { triggeredByColumn });
  }
  function setupColumnResize() {
    if (typeof Resizable2 > "u")
      throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
    var j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable, frozenLeftColMaxWidth = 0;
    let children = getHeaderChildren();
    for (let i2 = 0; i2 < children.length; i2++)
      children[i2].querySelectorAll(".slick-resizable-handle").forEach(function(handle) {
        handle.remove();
      }), !(i2 >= columns.length || !columns[i2] || columns[i2].hidden) && columns[i2].resizable && (firstResizable === void 0 && (firstResizable = i2), lastResizable = i2);
    if (firstResizable !== void 0)
      for (let i2 = 0; i2 < children.length; i2++) {
        let colElm = children[i2];
        if (i2 >= columns.length || !columns[i2] || columns[i2].hidden || i2 < firstResizable || options.forceFitColumns && i2 >= lastResizable)
          continue;
        let resizeableHandle = Utils5.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
        _bindingEventService.bind(resizeableHandle, "dblclick", handleResizeableHandleDoubleClick), slickResizableInstances.push(
          Resizable2({
            resizeableElement: colElm,
            resizeableHandleElement: resizeableHandle,
            onResizeStart: function(e, resizeElms) {
              var targetEvent = e.touches ? e.touches[0] : e;
              if (!getEditorLock().commitCurrentEdit())
                return !1;
              pageX = targetEvent.pageX, frozenLeftColMaxWidth = 0, resizeElms.resizeableElement.classList.add("slick-header-column-active");
              var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
              for (let pw = 0; pw < children.length; pw++)
                pw >= columns.length || !columns[pw] || columns[pw].hidden || (columns[pw].previousWidth = children[pw].offsetWidth);
              if (options.forceFitColumns)
                for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i2 + 1; j < columns.length; j++)
                  c = columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - c.previousWidth : stretchLeewayOnRight = null), shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth));
              var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
              for (j = 0; j <= i2; j++)
                c = columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - c.previousWidth : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth));
              shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
            },
            onResize: function(e, resizeElms) {
              var targetEvent = e.touches ? e.touches[0] : e;
              columnResizeDragging = !0;
              var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
              if (d < 0) {
                for (x = d, j = i2; j >= 0; j--)
                  c = columns[j], c && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth), x && c.previousWidth + x < actualMinWidth ? (x += c.previousWidth - actualMinWidth, c.width = actualMinWidth) : (c.width = c.previousWidth + x, x = 0));
                for (k = 0; k <= i2; k++)
                  c = columns[k], !(!c || c.hidden) && (hasFrozenColumns() && k > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                if (options.forceFitColumns)
                  for (x = -d, j = i2 + 1; j < columns.length; j++)
                    c = columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - c.previousWidth < x ? (x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth) : (c.width = c.previousWidth + x, x = 0), hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                else
                  for (j = i2 + 1; j < columns.length; j++)
                    c = columns[j], !(!c || c.hidden) && (hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                if (options.forceFitColumns)
                  for (x = -d, j = i2 + 1; j < columns.length; j++)
                    c = columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - c.previousWidth < x ? (x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth) : (c.width = c.previousWidth + x, x = 0));
              } else {
                for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i2; j >= 0; j--)
                  if (c = columns[j], !(!c || c.hidden) && c.resizable)
                    if (x && c.maxWidth && c.maxWidth - c.previousWidth < x)
                      x -= c.maxWidth - c.previousWidth, c.width = c.maxWidth;
                    else {
                      var newWidth = c.previousWidth + x, resizedCanvasWidthL = canvasWidthL + x;
                      hasFrozenColumns() && j <= options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                    }
                for (k = 0; k <= i2; k++)
                  c = columns[k], !(!c || c.hidden) && (hasFrozenColumns() && k > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                if (options.forceFitColumns)
                  for (x = -d, j = i2 + 1; j < columns.length; j++)
                    c = columns[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth), x && c.previousWidth + x < actualMinWidth ? (x += c.previousWidth - actualMinWidth, c.width = actualMinWidth) : (c.width = c.previousWidth + x, x = 0), hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
                else
                  for (j = i2 + 1; j < columns.length; j++)
                    c = columns[j], !(!c || c.hidden) && (hasFrozenColumns() && j > options.frozenColumn ? newCanvasWidthR += c.width : newCanvasWidthL += c.width);
              }
              hasFrozenColumns() && newCanvasWidthL != canvasWidthL && (Utils5.width(_headerL, newCanvasWidthL + 1e3), Utils5.setStyleSize(_paneHeaderR, "left", newCanvasWidthL)), applyColumnHeaderWidths(), options.syncColumnCellResize && applyColumnWidths(), trigger(self.onColumnsDrag, {
                triggeredByColumn: resizeElms.resizeableElement,
                resizeHandle: resizeElms.resizeableHandleElement
              });
            },
            onResizeEnd: function(e, resizeElms) {
              resizeElms.resizeableElement.classList.remove("slick-header-column-active");
              var triggeredByColumn = resizeElms.resizeableElement.id.replace(uid, "");
              trigger(self.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === !0 && applyColumnHeaderWidths();
              var newWidth;
              for (j = 0; j < columns.length; j++)
                c = columns[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && invalidateAllRows());
              updateCanvasWidth(!0), render(), trigger(self.onColumnsResized, { triggeredByColumn }), setTimeout(function() {
                columnResizeDragging = !1;
              }, 300);
            }
          })
        );
      }
  }
  function getVBoxDelta(el) {
    var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
    return p.forEach(function(val) {
      delta += Utils5.toFloat(styles[val]);
    }), delta;
  }
  function setFrozenOptions() {
    if (options.frozenColumn = options.frozenColumn >= 0 && options.frozenColumn < columns.length ? parseInt(options.frozenColumn) : -1, options.frozenRow > -1) {
      hasFrozenRows = !0, frozenRowsHeight = options.frozenRow * options.rowHeight;
      var dataLength = getDataLength();
      actualFrozenRow = options.frozenBottom ? dataLength - options.frozenRow : options.frozenRow;
    } else
      hasFrozenRows = !1;
  }
  function setPaneVisibility() {
    hasFrozenColumns() ? (show2(_paneHeaderR), show2(_paneTopR), hasFrozenRows ? (show2(_paneBottomL), show2(_paneBottomR)) : (hide2(_paneBottomR), hide2(_paneBottomL))) : (hide2(_paneHeaderR), hide2(_paneTopR), hide2(_paneBottomR), hasFrozenRows ? show2(_paneBottomL) : (hide2(_paneBottomR), hide2(_paneBottomL)));
  }
  function setOverflow() {
    _viewportTopL.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "auto", _viewportTopL.style["overflow-y"] = !hasFrozenColumns() && options.alwaysShowVerticalScroll ? "scroll" : hasFrozenColumns() ? "hidden" : hasFrozenRows ? "scroll" : "auto", _viewportTopR.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "hidden" : "auto", _viewportTopR.style["overflow-y"] = options.alwaysShowVerticalScroll ? "scroll" : (hasFrozenColumns(), hasFrozenRows ? "scroll" : "auto"), _viewportBottomL.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (hasFrozenRows && !options.alwaysAllowHorizontalScroll, "auto"), _viewportBottomL.style["overflow-y"] = !hasFrozenColumns() && options.alwaysShowVerticalScroll ? "scroll" : hasFrozenColumns() ? "hidden" : hasFrozenRows ? "scroll" : "auto", _viewportBottomR.style["overflow-x"] = hasFrozenColumns() ? hasFrozenRows && !options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (hasFrozenRows && !options.alwaysAllowHorizontalScroll, "auto"), _viewportBottomR.style["overflow-y"] = options.alwaysShowVerticalScroll ? "scroll" : (hasFrozenColumns(), "auto"), options.viewportClass && (_viewportTopL.classList.add(options.viewportClass), _viewportTopR.classList.add(options.viewportClass), _viewportBottomL.classList.add(options.viewportClass), _viewportBottomR.classList.add(options.viewportClass));
  }
  function setScroller() {
    hasFrozenColumns() ? (_headerScrollContainer = _headerScrollerR, _headerRowScrollContainer = _headerRowScrollerR, _footerRowScrollContainer = _footerRowScrollerR, hasFrozenRows ? options.frozenBottom ? (_viewportScrollContainerX = _viewportBottomR, _viewportScrollContainerY = _viewportTopR) : _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomR : _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopR) : (_headerScrollContainer = _headerScrollerL, _headerRowScrollContainer = _headerRowScrollerL, _footerRowScrollContainer = _footerRowScrollerL, hasFrozenRows ? options.frozenBottom ? (_viewportScrollContainerX = _viewportBottomL, _viewportScrollContainerY = _viewportTopL) : _viewportScrollContainerX = _viewportScrollContainerY = _viewportBottomL : _viewportScrollContainerX = _viewportScrollContainerY = _viewportTopL);
  }
  function measureCellPaddingAndBorder() {
    let h2 = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = _headers[0];
    headerColumnWidthDiff = headerColumnHeightDiff = 0, cellWidthDiff = cellHeightDiff = 0;
    let el = Utils5.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
    style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box" && (h2.forEach(function(val) {
      headerColumnWidthDiff += Utils5.toFloat(style[val]);
    }), v.forEach(function(val) {
      headerColumnHeightDiff += Utils5.toFloat(style[val]);
    })), el.remove();
    let r = Utils5.createDomElement("div", { className: "slick-row" }, _canvas[0]);
    el = Utils5.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden", textContent: "-" } }, r), style = getComputedStyle(el), style["box-sizing"] != "border-box" && style["-moz-box-sizing"] != "border-box" && style["-webkit-box-sizing"] != "border-box" && (h2.forEach(function(val) {
      cellWidthDiff += Utils5.toFloat(style[val]);
    }), v.forEach(function(val) {
      cellHeightDiff += Utils5.toFloat(style[val]);
    })), r.remove(), absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
  }
  function createCssRules() {
    _style = Utils5.createDomElement("template", { innerHTML: '<style type="text/css" rel="stylesheet" />' }).content.firstChild, document.head.appendChild(_style);
    for (var rowHeight = options.rowHeight - cellHeightDiff, rules = [
      "." + uid + " .slick-group-header-column { left: 1000px; }",
      "." + uid + " .slick-header-column { left: 1000px; }",
      "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
      "." + uid + " .slick-preheader-panel { height:" + options.preHeaderPanelHeight + "px; }",
      "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
      "." + uid + " .slick-footerrow-columns { height:" + options.footerRowHeight + "px; }",
      "." + uid + " .slick-cell { height:" + rowHeight + "px; }",
      "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
    ], i2 = 0; i2 < columns.length; i2++)
      !columns[i2] || columns[i2].hidden || (rules.push("." + uid + " .l" + i2 + " { }"), rules.push("." + uid + " .r" + i2 + " { }"));
    _style.styleSheet ? _style.styleSheet.cssText = rules.join(" ") : _style.appendChild(document.createTextNode(rules.join(" ")));
  }
  function getColumnCssRules(idx) {
    var i2;
    if (!stylesheet) {
      var sheets = document.styleSheets;
      for (i2 = 0; i2 < sheets.length; i2++)
        if ((sheets[i2].ownerNode || sheets[i2].owningElement) == _style) {
          stylesheet = sheets[i2];
          break;
        }
      if (!stylesheet)
        throw new Error("SlickGrid Cannot find stylesheet.");
      columnCssRulesL = [], columnCssRulesR = [];
      var cssRules = stylesheet.cssRules || stylesheet.rules, matches, columnIdx;
      for (i2 = 0; i2 < cssRules.length; i2++) {
        var selector = cssRules[i2].selectorText;
        (matches = /\.l\d+/.exec(selector)) ? (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), columnCssRulesL[columnIdx] = cssRules[i2]) : (matches = /\.r\d+/.exec(selector)) && (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), columnCssRulesR[columnIdx] = cssRules[i2]);
      }
    }
    return {
      left: columnCssRulesL[idx],
      right: columnCssRulesR[idx]
    };
  }
  function removeCssRules() {
    _style.remove(), stylesheet = null;
  }
  function destroy(shouldDestroyAllElements) {
    _bindingEventService.unbindAll(), slickDraggableInstance = destroyAllInstances(slickDraggableInstance), slickMouseWheelInstances = destroyAllInstances(slickMouseWheelInstances), slickResizableInstances = destroyAllInstances(slickResizableInstances), getEditorLock().cancelCurrentEdit(), trigger(self.onBeforeDestroy, {});
    for (var i2 = plugins.length; i2--; )
      unregisterPlugin(plugins[i2]);
    options.enableColumnReorder && sortableSideLeftInstance && typeof sortableSideLeftInstance.destroy == "function" && (sortableSideLeftInstance.destroy(), sortableSideRightInstance.destroy()), unbindAncestorScrollEvents(), _bindingEventService.unbindByEventName(_container, "resize.slickgrid", resizeCanvas), removeCssRules(), _canvas.forEach(function(element) {
      _bindingEventService.unbindByEventName(element, "keydown", handleKeyDown), _bindingEventService.unbindByEventName(element, "click", handleClick), _bindingEventService.unbindByEventName(element, "dblclick", handleDblClick), _bindingEventService.unbindByEventName(element, "contextmenu", handleContextMenu), _bindingEventService.unbindByEventName(element, "mouseover", handleCellMouseOver), _bindingEventService.unbindByEventName(element, "mouseout", handleCellMouseOut);
    }), _viewport.forEach(function(view) {
      _bindingEventService.unbindByEventName(view, "scroll", handleScroll);
    }), _headerScroller.forEach(function(el) {
      _bindingEventService.unbindByEventName(el, "contextmenu", handleHeaderContextMenu), _bindingEventService.unbindByEventName(el, "click", handleHeaderClick);
    }), _headerRowScroller.forEach(function(scroller) {
      _bindingEventService.unbindByEventName(scroller, "scroll", handleHeaderRowScroll);
    }), _footerRow && _footerRow.forEach(function(footer) {
      _bindingEventService.unbindByEventName(footer, "contextmenu", handleFooterContextMenu), _bindingEventService.unbindByEventName(footer, "click", handleFooterClick);
    }), _footerRowScroller && _footerRowScroller.forEach(function(scroller) {
      _bindingEventService.unbindByEventName(scroller, "scroll", handleFooterRowScroll);
    }), _preHeaderPanelScroller && _bindingEventService.unbindByEventName(_preHeaderPanelScroller, "scroll", handlePreHeaderPanelScroll), _bindingEventService.unbindByEventName(_focusSink, "keydown", handleKeyDown), _bindingEventService.unbindByEventName(_focusSink2, "keydown", handleKeyDown);
    let resizeHandles = _container.querySelectorAll(".slick-resizable-handle");
    [].forEach.call(resizeHandles, function(handle) {
      _bindingEventService.unbindByEventName(handle, "dblclick", handleResizeableHandleDoubleClick);
    });
    let headerColumns = _container.querySelectorAll(".slick-header-column");
    [].forEach.call(headerColumns, function(column) {
      _bindingEventService.unbindByEventName(column, "mouseenter", handleHeaderMouseEnter), _bindingEventService.unbindByEventName(column, "mouseleave", handleHeaderMouseLeave), _bindingEventService.unbindByEventName(column, "mouseenter", handleHeaderMouseHoverOn), _bindingEventService.unbindByEventName(column, "mouseleave", handleHeaderMouseHoverOff);
    }), _container.replaceChildren(), _container.classList.remove(uid), shouldDestroyAllElements && destroyAllElements();
  }
  function destroyAllInstances(inputInstances) {
    if (inputInstances) {
      let instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance;
      for (; (instance = instances.pop()) != null; )
        instance && typeof instance.destroy == "function" && instance.destroy();
    }
    return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
  }
  function destroyAllElements() {
    _activeCanvasNode = null, _activeViewportNode = null, _boundAncestors = null, _canvas = null, _canvasTopL = null, _canvasTopR = null, _canvasBottomL = null, _canvasBottomR = null, _container = null, _focusSink = null, _focusSink2 = null, _groupHeaders = null, _groupHeadersL = null, _groupHeadersR = null, _headerL = null, _headerR = null, _headers = null, _headerRows = null, _headerRowL = null, _headerRowR = null, _headerRowSpacerL = null, _headerRowSpacerR = null, _headerRowScrollContainer = null, _headerRowScroller = null, _headerRowScrollerL = null, _headerRowScrollerR = null, _headerScrollContainer = null, _headerScroller = null, _headerScrollerL = null, _headerScrollerR = null, _hiddenParents = null, _footerRow = null, _footerRowL = null, _footerRowR = null, _footerRowSpacerL = null, _footerRowSpacerR = null, _footerRowScroller = null, _footerRowScrollerL = null, _footerRowScrollerR = null, _footerRowScrollContainer = null, _preHeaderPanel = null, _preHeaderPanelR = null, _preHeaderPanelScroller = null, _preHeaderPanelScrollerR = null, _preHeaderPanelSpacer = null, _preHeaderPanelSpacerR = null, _topPanels = null, _topPanelScrollers = null, _style = null, _topPanelScrollerL = null, _topPanelScrollerR = null, _topPanelL = null, _topPanelR = null, _paneHeaderL = null, _paneHeaderR = null, _paneTopL = null, _paneTopR = null, _paneBottomL = null, _paneBottomR = null, _viewport = null, _viewportTopL = null, _viewportTopR = null, _viewportBottomL = null, _viewportBottomR = null, _viewportScrollContainerX = null, _viewportScrollContainerY = null;
  }
  var canvas = null, canvas_context = null;
  function autosizeColumn(columnOrIndexOrId, isInit) {
    var colDef = null, colIndex = -1;
    if (typeof columnOrIndexOrId == "number")
      colDef = columns[columnOrIndexOrId], colIndex = columnOrIndexOrId;
    else if (typeof columnOrIndexOrId == "string")
      for (i = 0; i < columns.length; i++)
        columns[i].Id === columnOrIndexOrId && (colDef = columns[i], colIndex = i);
    if (!colDef)
      return;
    let gridCanvas = getCanvasNode(0, 0);
    getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit, colIndex);
  }
  function treatAsLocked(autoSize) {
    return !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && autoSize.widthPx < 100;
  }
  function autosizeColumns(autosizeMode, isInit) {
    var cssCache = { hiddenParents: null, oldPropArr: [] };
    cacheCssForHiddenInit(cssCache), internalAutosizeColumns(autosizeMode, isInit), restoreCssFromHiddenInit(cssCache);
  }
  function internalAutosizeColumns(autosizeMode, isInit) {
    if (autosizeMode = autosizeMode || options.autosizeColsMode, autosizeMode === GridAutosizeColsMode2.LegacyForceFit || autosizeMode === GridAutosizeColsMode2.LegacyOff) {
      legacyAutosizeColumns();
      return;
    }
    if (autosizeMode !== GridAutosizeColsMode2.None) {
      canvas = document.createElement("canvas"), canvas && canvas.getContext && (canvas_context = canvas.getContext("2d"));
      var gridCanvas = getCanvasNode(0, 0), viewportWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW, i2, c, colWidth, reRender, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
      for (i2 = 0; i2 < columns.length; i2++)
        c = columns[i2], getColAutosizeWidth(c, i2, gridCanvas, isInit, i2), totalLockedColWidth += c.autoSize.autosizeMode === ColAutosizeMode2.Locked ? c.width : treatAsLocked(c.autoSize) ? c.autoSize.widthPx : 0, totalMinWidth += c.autoSize.autosizeMode === ColAutosizeMode2.Locked ? c.width : treatAsLocked(c.autoSize) ? c.autoSize.widthPx : c.minWidth, totalWidth += c.autoSize.widthPx, totalWidthLessSTR += c.autoSize.sizeToRemaining ? 0 : c.autoSize.widthPx, strColsMinWidth += c.autoSize.sizeToRemaining && c.minWidth || 0;
      var strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
      if (autosizeMode === GridAutosizeColsMode2.FitViewportToCols) {
        var setWidth = totalWidth + scrollbarDimensions.width;
        autosizeMode = GridAutosizeColsMode2.IgnoreViewport, options.viewportMaxWidthPx && setWidth > options.viewportMaxWidthPx ? (setWidth = options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode2.FitColsToViewport) : options.viewportMinWidthPx && setWidth < options.viewportMinWidthPx && (setWidth = options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode2.FitColsToViewport), Utils5.width(_container, setWidth);
      }
      if (autosizeMode === GridAutosizeColsMode2.FitColsToViewport)
        if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth) {
          for (i2 = 0; i2 < columns.length; i2++)
            if (c = columns[i2], !(!c || c.hidden)) {
              var totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
              c.autoSize.sizeToRemaining ? colWidth = totalSTRViewportWidth * c.autoSize.widthPx / strColTotalGuideWidth : colWidth = c.autoSize.widthPx, c.rerenderOnResize && c.width != colWidth && (reRender = !0), c.width = colWidth;
            }
        } else if (options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
          autosizeMode = GridAutosizeColsMode2.IgnoreViewport;
        else {
          var unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
          for (i2 = 0; i2 < columns.length; i2++)
            c = columns[i2], !(!c || c.hidden) && (colWidth = c.width, c.autoSize.autosizeMode !== ColAutosizeMode2.Locked && !treatAsLocked(c.autoSize) && (c.autoSize.sizeToRemaining ? colWidth = c.minWidth : (colWidth = unallocatedViewportWidth / unallocatedColWidth * c.autoSize.widthPx - 1, colWidth < c.minWidth && (colWidth = c.minWidth), unallocatedColWidth -= c.autoSize.widthPx, unallocatedViewportWidth -= colWidth)), treatAsLocked(c.autoSize) && (colWidth = c.autoSize.widthPx, colWidth < c.minWidth && (colWidth = c.minWidth)), c.rerenderOnResize && c.width != colWidth && (reRender = !0), c.width = colWidth);
        }
      if (autosizeMode === GridAutosizeColsMode2.IgnoreViewport)
        for (i2 = 0; i2 < columns.length; i2++)
          !columns[i2] || columns[i2].hidden || (colWidth = columns[i2].autoSize.widthPx, columns[i2].rerenderOnResize && columns[i2].width != colWidth && (reRender = !0), columns[i2].width = colWidth);
      reRenderColumns(reRender);
    }
  }
  function LogColWidths() {
    for (var s = "Col Widths:", i2 = 0; i2 < columns.length; i2++)
      s += " " + (columns[i2].hidden ? "H" : columns[i2].width);
    console.log(s);
  }
  function getColAutosizeWidth(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
    var autoSize = columnDef.autoSize;
    if (autoSize.widthPx = columnDef.width, autoSize.autosizeMode === ColAutosizeMode2.Locked || autoSize.autosizeMode === ColAutosizeMode2.Guide)
      return;
    var dl = getDataLength();
    let isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);
    if (autoSize.autosizeMode === ColAutosizeMode2.ContentIntelligent) {
      var colDataTypeOf = autoSize.colDataTypeOf, colDataItem;
      if (dl > 0) {
        var tempRow = getDataItem(0);
        tempRow && (colDataItem = tempRow[columnDef.field], isoDateRegExp.test(colDataItem) && (colDataItem = Date.parse(colDataItem)), colDataTypeOf = typeof colDataItem, colDataTypeOf === "object" && (colDataItem instanceof Date && (colDataTypeOf = "date"), typeof moment < "u" && colDataItem instanceof moment && (colDataTypeOf = "moment")));
      }
      colDataTypeOf === "boolean" && (autoSize.colValueArray = [!0, !1]), colDataTypeOf === "number" && (autoSize.valueFilterMode = ValueFilterMode2.GetGreatestAndSub, autoSize.rowSelectionMode = RowSelectionMode2.AllRows), colDataTypeOf === "string" && (autoSize.valueFilterMode = ValueFilterMode2.GetLongestText, autoSize.rowSelectionMode = RowSelectionMode2.AllRows, autoSize.allowAddlPercent = 5), colDataTypeOf === "date" && (autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]), colDataTypeOf === "moment" && typeof moment < "u" && (autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]);
    }
    var colWidth = autoSize.contentSizePx = getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);
    colWidth === 0 && (colWidth = autoSize.widthPx);
    var addlPercentMultiplier = autoSize.allowAddlPercent ? 1 + autoSize.allowAddlPercent / 100 : 1;
    colWidth = colWidth * addlPercentMultiplier + options.autosizeColPaddingPx, columnDef.minWidth && colWidth < columnDef.minWidth && (colWidth = columnDef.minWidth), columnDef.maxWidth && colWidth > columnDef.maxWidth && (colWidth = columnDef.maxWidth), (autoSize.autosizeMode === ColAutosizeMode2.ContentExpandOnly || columnDef.editor && columnDef.editor.ControlFillsColumn) && colWidth < columnDef.width && (colWidth = columnDef.width), autoSize.widthPx = colWidth;
  }
  function getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
    var autoSize = columnDef.autoSize, widthAdjustRatio = 1, i2, ii, tempVal, maxLen = 0, maxColWidth = 0;
    if (autoSize.headerWidthPx = 0, autoSize.ignoreHeaderText || (autoSize.headerWidthPx = getColHeaderWidth(columnDef)), autoSize.headerWidthPx === 0 && (autoSize.headerWidthPx = columnDef.width ? columnDef.width : columnDef.maxWidth ? columnDef.maxWidth : columnDef.minWidth ? columnDef.minWidth : 20), autoSize.colValueArray)
      return maxColWidth = getColWidth(columnDef, gridCanvas, autoSize.colValueArray), Math.max(autoSize.headerWidthPx, maxColWidth);
    var rowInfo = {};
    rowInfo.colIndex = colIndex, rowInfo.rowCount = getDataLength(), rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.rowCount - 1, rowInfo.valueArr = null, rowInfo.getRowVal = function(i3) {
      return getDataItem(i3)[columnDef.field];
    };
    var rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : void 0) || autoSize.rowSelectionMode;
    if (rowSelectionMode === RowSelectionMode2.FirstRow && (rowInfo.endIndex = 0), rowSelectionMode === RowSelectionMode2.LastRow && (rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1), rowSelectionMode === RowSelectionMode2.FirstNRows && (rowInfo.endIndex = Math.min(autoSize.rowSelectionCount, rowInfo.rowCount) - 1), autoSize.valueFilterMode === ValueFilterMode2.DeDuplicate) {
      var rowsDict = {};
      for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        rowsDict[rowInfo.getRowVal(i2)] = !0;
      if (Object.keys)
        rowInfo.valueArr = Object.keys(rowsDict);
      else {
        rowInfo.valueArr = [];
        for (var v in rowsDict)
          rowInfo.valueArr.push(v);
      }
      rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.length - 1;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetGreatestAndSub) {
      var maxVal, maxAbsVal = 0;
      for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        tempVal = rowInfo.getRowVal(i2), Math.abs(tempVal) > maxAbsVal && (maxVal = tempVal, maxAbsVal = Math.abs(tempVal));
      maxVal = "" + maxVal, maxVal = Array(maxVal.length + 1).join("9"), maxVal = +maxVal, rowInfo.valueArr = [maxVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetLongestTextAndSub) {
      for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        tempVal = rowInfo.getRowVal(i2), (tempVal || "").length > maxLen && (maxLen = tempVal.length);
      tempVal = Array(maxLen + 1).join("m"), widthAdjustRatio = options.autosizeTextAvgToMWidthRatio, rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetLongestText) {
      maxLen = 0;
      var maxIndex = 0;
      for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        tempVal = rowInfo.getRowVal(i2), (tempVal || "").length > maxLen && (maxLen = tempVal.length, maxIndex = i2);
      tempVal = rowInfo.getRowVal(maxIndex), rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    return rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1 && (autoSize.sizeToRemaining = !0), maxColWidth = getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio, Math.max(autoSize.headerWidthPx, maxColWidth);
  }
  function getColWidth(columnDef, gridCanvas, rowInfo) {
    let rowEl = Utils5.createDomElement("div", { className: "slick-row ui-widget-content" }, gridCanvas), cellEl = Utils5.createDomElement("div", { className: "slick-cell" }, rowEl);
    cellEl.style.position = "absolute", cellEl.style.visibility = "hidden", cellEl.style["text-overflow"] = "initial", cellEl.style["white-space"] = "nowrap";
    var i2, len, max = 0, text, maxText, formatterResult, maxWidth = 0, val, useCanvas = columnDef.autoSize.widthEvalMode === WidthEvalMode2.TextOnly;
    if (columnDef.autoSize.widthEvalMode === WidthEvalMode2.Auto) {
      var noFormatter = !columnDef.formatterOverride && !columnDef.formatter, formatterIsText = columnDef.formatterOverride && columnDef.formatterOverride.ReturnsTextOnly || !columnDef.formatterOverride && columnDef.formatter && columnDef.formatter.ReturnsTextOnly;
      useCanvas = noFormatter || formatterIsText;
    }
    if (canvas_context && useCanvas) {
      let style = getComputedStyle(cellEl);
      for (canvas_context.font = style["font-size"] + " " + style["font-family"], i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
        val = rowInfo.valueArr ? rowInfo.valueArr[i2] : rowInfo.getRowVal(i2), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : columnDef.formatter ? formatterResult = columnDef.formatter(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : formatterResult = "" + val, len = formatterResult ? canvas_context.measureText(formatterResult).width : 0, len > max && (max = len, maxText = formatterResult);
      return cellEl.innerHTML = maxText, len = cellEl.offsetWidth, rowEl.remove(), len;
    }
    for (i2 = rowInfo.startIndex; i2 <= rowInfo.endIndex; i2++)
      val = rowInfo.valueArr ? rowInfo.valueArr[i2] : rowInfo.getRowVal(i2), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : columnDef.formatter ? formatterResult = columnDef.formatter(i2, rowInfo.colIndex, val, columnDef, getDataItem(i2), self) : formatterResult = "" + val, applyFormatResultToCellNode(formatterResult, cellEl), len = cellEl.offsetWidth, len > max && (max = len);
    return rowEl.remove(), max;
  }
  function getColHeaderWidth(columnDef) {
    var width2 = 0, headerColElId = getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = headerColElId + "_";
    if (headerColEl) {
      var clone = headerColEl.cloneNode(!0);
      clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width2 = clone.offsetWidth, clone.parentNode.removeChild(clone);
    } else {
      let header = getHeader(columnDef);
      headerColEl = Utils5.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header), Utils5.createDomElement("span", { className: "slick-column-name", innerHTML: sanitizeHtmlString(columnDef.name) }, headerColEl), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.classList.add(columnDef.headerCssClass || ""), width2 = headerColEl.offsetWidth, header.removeChild(headerColEl);
    }
    return width2;
  }
  function legacyAutosizeColumns() {
    var i2, c, widths = [], shrinkLeeway = 0, total = 0, prevTotal, availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
    for (i2 = 0; i2 < columns.length; i2++)
      c = columns[i2], !(!c || c.hidden) && (widths.push(c.width), total += c.width, c.resizable && (shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth)));
    for (prevTotal = total; total > availWidth && shrinkLeeway; ) {
      var shrinkProportion = (total - availWidth) / shrinkLeeway;
      for (i2 = 0; i2 < columns.length && total > availWidth; i2++)
        if (c = columns[i2], !(!c || c.hidden)) {
          var width2 = widths[i2];
          if (!(!c.resizable || width2 <= c.minWidth || width2 <= absoluteColumnMinWidth)) {
            var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth), shrinkSize = Math.floor(shrinkProportion * (width2 - absMinWidth)) || 1;
            shrinkSize = Math.min(shrinkSize, width2 - absMinWidth), total -= shrinkSize, shrinkLeeway -= shrinkSize, widths[i2] -= shrinkSize;
          }
        }
      if (prevTotal <= total)
        break;
      prevTotal = total;
    }
    for (prevTotal = total; total < availWidth; ) {
      var growProportion = availWidth / total;
      for (i2 = 0; i2 < columns.length && total < availWidth; i2++)
        if (c = columns[i2], !(!c || c.hidden)) {
          var currentWidth = widths[i2], growSize;
          !c.resizable || c.maxWidth <= currentWidth ? growSize = 0 : growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1e6) || 1, total += growSize, widths[i2] += total <= availWidth ? growSize : 0;
        }
      if (prevTotal >= total)
        break;
      prevTotal = total;
    }
    var reRender = !1;
    for (i2 = 0; i2 < columns.length; i2++)
      !c || c.hidden || (columns[i2].rerenderOnResize && columns[i2].width != widths[i2] && (reRender = !0), columns[i2].width = widths[i2]);
    reRenderColumns(reRender);
  }
  function reRenderColumns(reRender) {
    applyColumnHeaderWidths(), updateCanvasWidth(!0), trigger(self.onAutosizeColumns, { columns }), reRender && (invalidateAllRows(), render());
  }
  function getVisibleColumns() {
    return columns.filter((c) => !c.hidden);
  }
  function trigger(evt, args, e) {
    return e = e || new EventData3(e, args), args = args || {}, args.grid = self, evt.notify(args, e, self);
  }
  function getEditorLock() {
    return options.editorLock;
  }
  function getEditController() {
    return editController;
  }
  function getColumnIndex(id) {
    return columnsById[id];
  }
  function applyColumnHeaderWidths() {
    if (!initialized)
      return;
    let columnIndex = 0, vc = getVisibleColumns();
    _headers.forEach(function(header) {
      for (let i2 = 0; i2 < header.children.length; i2++, columnIndex++) {
        let h2 = header.children[i2], width2 = ((vc[columnIndex] || {}).width || 0) - headerColumnWidthDiff;
        Utils5.width(h2) !== width2 && Utils5.width(h2, width2);
      }
    }), updateColumnCaches();
  }
  function applyColumnWidths() {
    for (var x = 0, w, rule, i2 = 0; i2 < columns.length; i2++)
      columns[i2] && columns[i2].hidden || (w = columns[i2].width, rule = getColumnCssRules(i2), rule.left.style.left = x + "px", rule.right.style.right = (options.frozenColumn != -1 && i2 > options.frozenColumn ? canvasWidthR : canvasWidthL) - x - w + "px", options.frozenColumn != i2 && (x += columns[i2].width)), options.frozenColumn == i2 && (x = 0);
  }
  function setSortColumn(columnId, ascending) {
    setSortColumns([{ columnId, sortAsc: ascending }]);
  }
  function getColumnByIndex(id) {
    let result = null;
    return _headers.every(function(header) {
      let length = header.children.length;
      return id < length ? (result = header.children[id], !1) : (id -= length, !0);
    }), result;
  }
  function setSortColumns(cols) {
    sortColumns = cols;
    let numberCols = options.numberedMultiColumnSort && sortColumns.length > 1;
    _headers.forEach(function(header) {
      let indicators = header.querySelectorAll(".slick-header-column-sorted");
      indicators.forEach(function(indicator) {
        indicator.classList.remove("slick-header-column-sorted");
      }), indicators = header.querySelectorAll(".slick-sort-indicator"), indicators.forEach(function(indicator) {
        indicator.classList.remove("slick-sort-indicator-asc"), indicator.classList.remove("slick-sort-indicator-desc");
      }), indicators = header.querySelectorAll(".slick-sort-indicator-numbered"), indicators.forEach(function(el) {
        el.textContent = "";
      });
    });
    let i2 = 1;
    sortColumns.forEach(function(col) {
      col.sortAsc == null && (col.sortAsc = !0);
      let columnIndex = getColumnIndex(col.columnId);
      if (columnIndex != null) {
        let column = getColumnByIndex(columnIndex);
        if (column) {
          column.classList.add("slick-header-column-sorted");
          let indicator = column.querySelector(".slick-sort-indicator");
          indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc"), numberCols && (indicator = column.querySelector(".slick-sort-indicator-numbered"), indicator.textContent = i2);
        }
      }
      i2++;
    });
  }
  function getSortColumns() {
    return sortColumns;
  }
  function handleSelectedRangesChanged(e, ranges) {
    let ne = e.getNativeEvent();
    var previousSelectedRows = selectedRows.slice(0);
    selectedRows = [];
    for (var hash = {}, i2 = 0; i2 < ranges.length; i2++)
      for (var j = ranges[i2].fromRow; j <= ranges[i2].toRow; j++) {
        hash[j] || (selectedRows.push(j), hash[j] = {});
        for (var k = ranges[i2].fromCell; k <= ranges[i2].toCell; k++)
          canCellBeSelected(j, k) && (hash[j][columns[k].id] = options.selectedCellCssClass);
      }
    if (setCellCssStyles(options.selectedCellCssClass, hash), simpleArrayEquals(previousSelectedRows, selectedRows)) {
      var caller = ne && ne.detail && ne.detail.caller || "click", newSelectedAdditions = getSelectedRows().filter(function(i3) {
        return previousSelectedRows.indexOf(i3) < 0;
      }), newSelectedDeletions = previousSelectedRows.filter(function(i3) {
        return getSelectedRows().indexOf(i3) < 0;
      });
      trigger(self.onSelectedRowsChanged, {
        rows: getSelectedRows(),
        previousSelectedRows,
        caller,
        changedSelectedRows: newSelectedAdditions,
        changedUnselectedRows: newSelectedDeletions
      }, e);
    }
  }
  function simpleArrayEquals(arr1, arr2) {
    return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
  }
  function getColumns() {
    return columns;
  }
  function updateColumnCaches() {
    columnPosLeft = [], columnPosRight = [];
    for (var x = 0, i2 = 0, ii = columns.length; i2 < ii; i2++)
      !columns[i2] || columns[i2].hidden || (columnPosLeft[i2] = x, columnPosRight[i2] = x + columns[i2].width, options.frozenColumn == i2 ? x = 0 : x += columns[i2].width);
  }
  function updateColumnProps() {
    columnsById = {};
    for (var i2 = 0; i2 < columns.length; i2++) {
      columns[i2].width && (columns[i2].widthRequest = columns[i2].width);
      var m = columns[i2] = Utils5.extend({}, columnDefaults, columns[i2]);
      m.autoSize = Utils5.extend({}, columnAutosizeDefaults, m.autoSize), columnsById[m.id] = i2, m.minWidth && m.width < m.minWidth && (m.width = m.minWidth), m.maxWidth && m.width > m.maxWidth && (m.width = m.maxWidth);
    }
  }
  function setColumns(columnDefinitions) {
    trigger(self.onBeforeSetColumns, { previousColumns: columns, newColumns: columnDefinitions, grid: self }), columns = columnDefinitions, columns = columnDefinitions, updateColumnsInternal();
  }
  function updateColumns() {
    trigger(self.onBeforeUpdateColumns, { columns, grid: self }), updateColumnsInternal();
  }
  function updateColumnsInternal() {
    updateColumnProps(), updateColumnCaches(), initialized && (setPaneVisibility(), setOverflow(), invalidateAllRows(), createColumnHeaders(), createColumnFooter(), removeCssRules(), createCssRules(), resizeCanvas(), updateCanvasWidth(), applyColumnHeaderWidths(), applyColumnWidths(), handleScroll(), getSelectionModel() && getSelectionModel().refreshSelections && getSelectionModel().refreshSelections());
  }
  function getOptions() {
    return options;
  }
  function setOptions(args, suppressRender, suppressColumnSet, suppressSetOverflow) {
    if (getEditorLock().commitCurrentEdit()) {
      makeActiveCellNormal(), args.showColumnHeader !== void 0 && setColumnHeaderVisibility(args.showColumnHeader), options.enableAddRow !== args.enableAddRow && invalidateRow(getDataLength());
      var originalOptions = Utils5.extend(!0, {}, options);
      options = Utils5.extend(options, args), trigger(self.onSetOptions, { optionsBefore: originalOptions, optionsAfter: options }), validateAndEnforceOptions(), setFrozenOptions(), args.frozenBottom !== void 0 && (enforceFrozenRowHeightRecalc = !0), _viewport.forEach(function(view) {
        view.style["overflow-y"] = options.autoHeight ? "hidden" : "auto";
      }), suppressRender || render(), setScroller(), suppressSetOverflow || setOverflow(), suppressColumnSet || setColumns(columns), options.enableMouseWheelScrollHandler && _viewport && (!slickMouseWheelInstances || slickMouseWheelInstances.length === 0) ? _viewport.forEach(function(view) {
        slickMouseWheelInstances.push(MouseWheel2({
          element: view,
          onMouseWheel: handleMouseWheel
        }));
      }) : options.enableMouseWheelScrollHandler === !1 && destroyAllInstances(slickMouseWheelInstances);
    }
  }
  function validateAndEnforceOptions() {
    options.autoHeight && (options.leaveSpaceForNewRows = !1), options.forceFitColumns && (options.autosizeColsMode = GridAutosizeColsMode2.LegacyForceFit, console.log("forceFitColumns option is deprecated - use autosizeColsMode"));
  }
  function setData(newData, scrollToTop) {
    data = newData, invalidateAllRows(), updateRowCount(), scrollToTop && scrollTo(0);
  }
  function getData() {
    return data;
  }
  function getDataLength() {
    return data.getLength ? data.getLength() : data && data.length || 0;
  }
  function getDataLengthIncludingAddNew() {
    return getDataLength() + (options.enableAddRow && (!pagingActive || pagingIsLastPage) ? 1 : 0);
  }
  function getDataItem(i2) {
    return data.getItem ? data.getItem(i2) : data[i2];
  }
  function getTopPanel() {
    return _topPanels[0];
  }
  function getTopPanels() {
    return _topPanels;
  }
  function togglePanelVisibility(option, container2, visible, animate) {
    var animated = animate !== !1;
    if (options[option] != visible)
      if (options[option] = visible, visible) {
        if (animated) {
          Utils5.slideDown(container2, resizeCanvas);
          return;
        }
        show2(container2), resizeCanvas();
      } else {
        if (animated) {
          Utils5.slideUp(container2, resizeCanvas);
          return;
        }
        hide2(container2), resizeCanvas();
      }
  }
  function setTopPanelVisibility(visible, animate) {
    togglePanelVisibility("showTopPanel", _topPanelScrollers, visible, animate);
  }
  function setHeaderRowVisibility(visible, animate) {
    togglePanelVisibility("showHeaderRow", _headerRowScroller, visible, animate);
  }
  function setColumnHeaderVisibility(visible, animate) {
    togglePanelVisibility("showColumnHeader", _headerScroller, visible, animate);
  }
  function setFooterRowVisibility(visible, animate) {
    togglePanelVisibility("showFooterRow", _footerRowScroller, visible, animate);
  }
  function setPreHeaderPanelVisibility(visible, animate) {
    togglePanelVisibility("showPreHeaderPanel", [_preHeaderPanelScroller, _preHeaderPanelScrollerR], visible, animate);
  }
  function getContainerNode() {
    return _container;
  }
  function getRowTop(row) {
    return options.rowHeight * row - offset2;
  }
  function getRowFromPosition(y) {
    return Math.floor((y + offset2) / options.rowHeight);
  }
  function scrollTo(y) {
    y = Math.max(y, 0), y = Math.min(y, th - Utils5.height(_viewportScrollContainerY) + (viewportHasHScroll || hasFrozenColumns() ? scrollbarDimensions.height : 0));
    var oldOffset = offset2;
    page = Math.min(n - 1, Math.floor(y / ph)), offset2 = Math.round(page * cj);
    var newScrollTop = y - offset2;
    if (offset2 != oldOffset) {
      var range = getVisibleRange(newScrollTop);
      cleanupRows(range), updateRowPositions();
    }
    prevScrollTop != newScrollTop && (vScrollDir = prevScrollTop + oldOffset < newScrollTop + offset2 ? 1 : -1, lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop, hasFrozenColumns() && (_viewportTopL.scrollTop = newScrollTop), hasFrozenRows && (_viewportBottomL.scrollTop = _viewportBottomR.scrollTop = newScrollTop), _viewportScrollContainerY.scrollTop = newScrollTop, trigger(self.onViewportChanged, {}));
  }
  function defaultFormatter(row, cell, value, columnDef, dataContext, grid) {
    return value == null ? "" : (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function getFormatter(row, column) {
    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row), columnOverrides = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);
    return columnOverrides && columnOverrides.formatter || rowMetadata && rowMetadata.formatter || column.formatter || options.formatterFactory && options.formatterFactory.getFormatter(column) || options.defaultFormatter;
  }
  function getEditor(row, cell) {
    var column = columns[cell], rowMetadata = data.getItemMetadata && data.getItemMetadata(row), columnMetadata = rowMetadata && rowMetadata.columns;
    return columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== void 0 ? columnMetadata[column.id].editor : columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== void 0 ? columnMetadata[cell].editor : column.editor || options.editorFactory && options.editorFactory.getEditor(column);
  }
  function getDataItemValueForColumn(item, columnDef) {
    return options.dataItemColumnValueExtractor ? options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
  }
  function appendRowHtml(stringArrayL, stringArrayR, row, range, dataLength) {
    var d = getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (hasFrozenRows && row <= options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === activeRow && options.showCellSelection ? " active" : "") + (row % 2 == 1 ? " odd" : " even");
    d || (rowCss += " " + options.addNewRowCssClass);
    var metadata = data.getItemMetadata && data.getItemMetadata(row);
    metadata && metadata.cssClasses && (rowCss += " " + metadata.cssClasses);
    var frozenRowOffset = getFrozenRowOffset(row), rowHtml = `<div class="ui-widget-content ${rowCss}" style="top:${getRowTop(row) - frozenRowOffset}px">`;
    stringArrayL.push(rowHtml), hasFrozenColumns() && stringArrayR.push(rowHtml);
    for (var colspan, m, i2 = 0, ii = columns.length; i2 < ii; i2++)
      if (m = columns[i2], !(!m || m.hidden)) {
        if (colspan = 1, metadata && metadata.columns) {
          var columnData = metadata.columns[m.id] || metadata.columns[i2];
          colspan = columnData && columnData.colspan || 1, colspan === "*" && (colspan = ii - i2);
        }
        if (columnPosRight[Math.min(ii - 1, i2 + colspan - 1)] > range.leftPx) {
          if (!m.alwaysRenderColumn && columnPosLeft[i2] > range.rightPx)
            break;
          hasFrozenColumns() && i2 > options.frozenColumn ? appendCellHtml(stringArrayR, row, i2, colspan, d) : appendCellHtml(stringArrayL, row, i2, colspan, d);
        } else
          (m.alwaysRenderColumn || hasFrozenColumns() && i2 <= options.frozenColumn) && appendCellHtml(stringArrayL, row, i2, colspan, d);
        colspan > 1 && (i2 += colspan - 1);
      }
    stringArrayL.push("</div>"), hasFrozenColumns() && stringArrayR.push("</div>");
  }
  function appendCellHtml(stringArray, row, cell, colspan, item) {
    var m = columns[cell], cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
    hasFrozenColumns() && cell <= options.frozenColumn && (cellCss += " frozen"), row === activeRow && cell === activeCell && options.showCellSelection && (cellCss += " active");
    for (var key in cellCssClasses)
      cellCssClasses[key][row] && cellCssClasses[key][row][m.id] && (cellCss += " " + cellCssClasses[key][row][m.id]);
    var value = null, formatterResult = "";
    item && (value = getDataItemValueForColumn(item, m), formatterResult = getFormatter(row, m)(row, cell, value, m, item, self), formatterResult == null && (formatterResult = ""));
    var addlCssClasses = trigger(self.onBeforeAppendCell, { row, cell, value, dataContext: item }).getReturnValue() || "";
    addlCssClasses += formatterResult && formatterResult.addClasses ? (addlCssClasses ? " " : "") + formatterResult.addClasses : "";
    var toolTip = formatterResult && formatterResult.toolTip ? "title='" + formatterResult.toolTip + "'" : "", customAttrStr = "";
    if (m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object)
      for (var key in m.cellAttrs)
        m.cellAttrs.hasOwnProperty(key) && (customAttrStr += " " + key + '="' + m.cellAttrs[key] + '" ');
    stringArray.push(`<div class="${cellCss + (addlCssClasses ? " " + addlCssClasses : "")}" ${toolTip + customAttrStr}>`), item && stringArray.push(Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.text), stringArray.push("</div>"), rowsCache[row].cellRenderQueue.push(cell), rowsCache[row].cellColSpans[cell] = colspan;
  }
  function cleanupRows(rangeToKeep) {
    for (var i2 in rowsCache) {
      var removeFrozenRow = !0;
      hasFrozenRows && (options.frozenBottom && i2 >= actualFrozenRow || !options.frozenBottom && i2 <= actualFrozenRow) && (removeFrozenRow = !1), (i2 = parseInt(i2, 10)) !== activeRow && (i2 < rangeToKeep.top || i2 > rangeToKeep.bottom) && removeFrozenRow && removeRowFromCache(i2);
    }
    options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
  }
  function invalidate() {
    updateRowCount(), invalidateAllRows(), render();
  }
  function invalidateAllRows() {
    currentEditor && makeActiveCellNormal();
    for (var row in rowsCache)
      removeRowFromCache(row);
    options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
  }
  function queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
    postProcessgroupId++;
    for (var columnIdx in postProcessedRow)
      postProcessedRow.hasOwnProperty(columnIdx) && postProcessedCleanupQueue.push({
        actionType: "C",
        groupId: postProcessgroupId,
        node: cacheEntry.cellNodesByColumnIdx[columnIdx | 0],
        columnIdx: columnIdx | 0,
        rowIdx
      });
    postProcessedCleanupQueue.push({
      actionType: "R",
      groupId: postProcessgroupId,
      node: cacheEntry.rowNode
    }), cacheEntry.rowNode.forEach(function(node) {
      node.remove();
    });
  }
  function queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
    postProcessedCleanupQueue.push({
      actionType: "C",
      groupId: postProcessgroupId,
      node: cellnode,
      columnIdx,
      rowIdx
    }), cellnode.remove();
  }
  function removeRowFromCache(row) {
    var cacheEntry = rowsCache[row];
    cacheEntry && (options.enableAsyncPostRenderCleanup && postProcessedRows[row] ? queuePostProcessedRowForCleanup(cacheEntry, postProcessedRows[row], row) : cacheEntry.rowNode.forEach(function(node) {
      node.parentElement && node.parentElement.removeChild(node);
    }), delete rowsCache[row], delete postProcessedRows[row], renderedRows--, counter_rows_removed++);
  }
  function invalidateRows(rows) {
    var i2, rl;
    if (!(!rows || !rows.length)) {
      for (vScrollDir = 0, rl = rows.length, i2 = 0; i2 < rl; i2++)
        currentEditor && activeRow === rows[i2] && makeActiveCellNormal(), rowsCache[rows[i2]] && removeRowFromCache(rows[i2]);
      options.enableAsyncPostRenderCleanup && startPostProcessingCleanup();
    }
  }
  function invalidateRow(row) {
    !row && row !== 0 || invalidateRows([row]);
  }
  function applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
    if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
      cellNode.innerHTML = sanitizeHtmlString(formatterResult);
      return;
    }
    cellNode.innerHTML = sanitizeHtmlString(formatterResult.text), formatterResult.removeClasses && !suppressRemove && formatterResult.removeClasses.split(" ").forEach(function(c) {
      cellNode.classList.remove(c);
    }), formatterResult.addClasses && formatterResult.addClasses.split(" ").forEach(function(c) {
      cellNode.classList.add(c);
    }), formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
  }
  function updateCell(row, cell) {
    var cellNode = getCellNode(row, cell);
    if (cellNode) {
      var m = columns[cell], d = getDataItem(row);
      if (currentEditor && activeRow === row && activeCell === cell)
        currentEditor.loadValue(d);
      else {
        var formatterResult = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d, self) : "";
        applyFormatResultToCellNode(formatterResult, cellNode), invalidatePostProcessingResults(row);
      }
    }
  }
  function updateRow(row) {
    var cacheEntry = rowsCache[row];
    if (cacheEntry) {
      ensureCellNodesInRowsCache(row);
      var formatterResult, d = getDataItem(row);
      for (var columnIdx in cacheEntry.cellNodesByColumnIdx)
        if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
          columnIdx = columnIdx | 0;
          var m = columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
          row === activeRow && columnIdx === activeCell && currentEditor ? currentEditor.loadValue(d) : d ? (formatterResult = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d, self), applyFormatResultToCellNode(formatterResult, node)) : node.innerHTML = "";
        }
      invalidatePostProcessingResults(row);
    }
  }
  function getViewportHeight() {
    if ((!options.autoHeight || options.frozenColumn != -1) && (topPanelH = options.showTopPanel ? options.topPanelHeight + getVBoxDelta(_topPanelScrollers[0]) : 0, headerRowH = options.showHeaderRow ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0, footerRowH = options.showFooterRow ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0), options.autoHeight) {
      let fullHeight = _paneHeaderL.offsetHeight;
      fullHeight += options.showHeaderRow ? options.headerRowHeight + getVBoxDelta(_headerRowScroller[0]) : 0, fullHeight += options.showFooterRow ? options.footerRowHeight + getVBoxDelta(_footerRowScroller[0]) : 0, fullHeight += getCanvasWidth() > viewportW ? scrollbarDimensions.height : 0, viewportH = options.rowHeight * getDataLengthIncludingAddNew() + (options.frozenColumn == -1 ? fullHeight : 0);
    } else {
      let columnNamesH = options.showColumnHeader ? Utils5.toFloat(Utils5.height(_headerScroller[0])) + getVBoxDelta(_headerScroller[0]) : 0, preHeaderH = options.createPreHeaderPanel && options.showPreHeaderPanel ? options.preHeaderPanelHeight + getVBoxDelta(_preHeaderPanelScroller) : 0, style = getComputedStyle(_container);
      viewportH = Utils5.toFloat(style.height) - Utils5.toFloat(style.paddingTop) - Utils5.toFloat(style.paddingBottom) - columnNamesH - topPanelH - headerRowH - footerRowH - preHeaderH;
    }
    return numVisibleRows = Math.ceil(viewportH / options.rowHeight), viewportH;
  }
  function getViewportWidth() {
    viewportW = parseFloat(Utils5.innerSize(_container, "width"));
  }
  function resizeCanvas() {
    if (initialized) {
      if (paneTopH = 0, paneBottomH = 0, viewportTopH = 0, viewportBottomH = 0, getViewportWidth(), getViewportHeight(), hasFrozenRows ? options.frozenBottom ? (paneTopH = viewportH - frozenRowsHeight - scrollbarDimensions.height, paneBottomH = frozenRowsHeight + scrollbarDimensions.height) : (paneTopH = frozenRowsHeight, paneBottomH = viewportH - frozenRowsHeight) : paneTopH = viewportH, paneTopH += topPanelH + headerRowH + footerRowH, hasFrozenColumns() && options.autoHeight && (paneTopH += scrollbarDimensions.height), viewportTopH = paneTopH - topPanelH - headerRowH - footerRowH, options.autoHeight) {
        if (hasFrozenColumns()) {
          let style = getComputedStyle(_headerScrollerL);
          Utils5.height(_container, paneTopH + Utils5.toFloat(style.height));
        }
        _paneTopL.style.position = "relative";
      }
      Utils5.setStyleSize(_paneTopL, "top", Utils5.height(_paneHeaderL) || (options.showHeaderRow ? options.headerRowHeight : 0) + (options.showPreHeaderPanel ? options.preHeaderPanelHeight : 0)), Utils5.height(_paneTopL, paneTopH);
      var paneBottomTop = _paneTopL.offsetTop + paneTopH;
      options.autoHeight || Utils5.height(_viewportTopL, viewportTopH), hasFrozenColumns() ? (Utils5.setStyleSize(_paneTopR, "top", Utils5.height(_paneHeaderL)), Utils5.height(_paneTopR, paneTopH), Utils5.height(_viewportTopR, viewportTopH), hasFrozenRows && (Utils5.setStyleSize(_paneBottomL, "top", paneBottomTop), Utils5.height(_paneBottomL, paneBottomH), Utils5.setStyleSize(_paneBottomR, "top", paneBottomTop), Utils5.height(_paneBottomR, paneBottomH), Utils5.height(_viewportBottomR, paneBottomH))) : hasFrozenRows && (Utils5.width(_paneBottomL, "100%"), Utils5.height(_paneBottomL, paneBottomH), Utils5.setStyleSize(_paneBottomL, "top", paneBottomTop)), hasFrozenRows ? (Utils5.height(_viewportBottomL, paneBottomH), options.frozenBottom ? (Utils5.height(_canvasBottomL, frozenRowsHeight), hasFrozenColumns() && Utils5.height(_canvasBottomR, frozenRowsHeight)) : (Utils5.height(_canvasTopL, frozenRowsHeight), hasFrozenColumns() && Utils5.height(_canvasTopR, frozenRowsHeight))) : Utils5.height(_viewportTopR, viewportTopH), (!scrollbarDimensions || !scrollbarDimensions.width) && (scrollbarDimensions = measureScrollbar()), options.autosizeColsMode === GridAutosizeColsMode2.LegacyForceFit && autosizeColumns(), updateRowCount(), handleScroll(), lastRenderedScrollLeft = -1, render();
    }
  }
  function updatePagingStatusFromView(pagingInfo) {
    pagingActive = pagingInfo.pageSize !== 0, pagingIsLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
  }
  function updateRowCount() {
    if (initialized) {
      var dataLength = getDataLength(), dataLengthIncludingAddNew = getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = hasFrozenRows && !options.frozenBottom ? Utils5.height(_canvasBottomL) : Utils5.height(_canvasTopL);
      if (hasFrozenRows)
        var numberOfRows = getDataLength() - options.frozenRow;
      else
        var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
      var tempViewportH = Utils5.height(_viewportScrollContainerY), oldViewportHasVScroll = viewportHasVScroll;
      viewportHasVScroll = options.alwaysShowVerticalScroll || !options.autoHeight && numberOfRows * options.rowHeight > tempViewportH, makeActiveCellNormal();
      var r1 = dataLength - 1;
      for (var i2 in rowsCache)
        i2 > r1 && removeRowFromCache(i2);
      options.enableAsyncPostRenderCleanup && startPostProcessingCleanup(), activeCellNode && activeRow > r1 && resetActiveCell();
      var oldH = h;
      options.autoHeight ? h = options.rowHeight * numberOfRows : (th = Math.max(options.rowHeight * numberOfRows, tempViewportH - scrollbarDimensions.height), th < maxSupportedCssHeight ? (h = ph = th, n = 1, cj = 0) : (h = maxSupportedCssHeight, ph = h / 100, n = Math.floor(th / ph), cj = (th - h) / (n - 1))), (h !== oldH || enforceFrozenRowHeightRecalc) && (hasFrozenRows && !options.frozenBottom ? (Utils5.height(_canvasBottomL, h), hasFrozenColumns() && Utils5.height(_canvasBottomR, h)) : (Utils5.height(_canvasTopL, h), Utils5.height(_canvasTopR, h)), scrollTop = _viewportScrollContainerY.scrollTop, enforceFrozenRowHeightRecalc = !1);
      var oldScrollTopInRange = scrollTop + offset2 <= th - tempViewportH;
      th == 0 || scrollTop == 0 ? page = offset2 = 0 : scrollTo(oldScrollTopInRange ? scrollTop + offset2 : th - tempViewportH + scrollbarDimensions.height), h != oldH && options.autoHeight && resizeCanvas(), options.autosizeColsMode === GridAutosizeColsMode2.LegacyForceFit && oldViewportHasVScroll != viewportHasVScroll && autosizeColumns(), updateCanvasWidth(!1);
    }
  }
  function getVisibleRange(viewportTop, viewportLeft) {
    return viewportTop == null && (viewportTop = scrollTop), viewportLeft == null && (viewportLeft = scrollLeft), {
      top: getRowFromPosition(viewportTop),
      bottom: getRowFromPosition(viewportTop + viewportH) + 1,
      leftPx: viewportLeft,
      rightPx: viewportLeft + viewportW
    };
  }
  function getRenderedRange(viewportTop, viewportLeft) {
    var range = getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(viewportH / options.rowHeight), minBuffer = options.minRowBuffer;
    return vScrollDir == -1 ? (range.top -= buffer, range.bottom += minBuffer) : vScrollDir == 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= viewportW, range.rightPx += viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(canvasWidth, range.rightPx), range;
  }
  function ensureCellNodesInRowsCache(row) {
    let cacheEntry = rowsCache[row];
    if (cacheEntry && cacheEntry.cellRenderQueue.length) {
      let rowNode = cacheEntry.rowNode, children = Array.from(rowNode[0].children);
      rowNode.length > 1 && (children = children.concat(Array.from(rowNode[1].children)));
      let i2 = children.length - 1;
      for (; cacheEntry.cellRenderQueue.length; ) {
        let columnIdx = cacheEntry.cellRenderQueue.pop();
        cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i2--];
      }
    }
  }
  function cleanUpCells(range, row) {
    if (!(hasFrozenRows && (options.frozenBottom && row > actualFrozenRow || row <= actualFrozenRow))) {
      var totalCellsRemoved = 0, cacheEntry = rowsCache[row], cellsToRemove = [];
      for (var i2 in cacheEntry.cellNodesByColumnIdx)
        if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i2) && (i2 = i2 | 0, !(i2 <= options.frozenColumn) && !(Array.isArray(columns) && columns[i2] && columns[i2].alwaysRenderColumn))) {
          var colspan = cacheEntry.cellColSpans[i2];
          (columnPosLeft[i2] > range.rightPx || columnPosRight[Math.min(columns.length - 1, i2 + colspan - 1)] < range.leftPx) && (row == activeRow && i2 == activeCell || cellsToRemove.push(i2));
        }
      for (var cellToRemove, cellNode; (cellToRemove = cellsToRemove.pop()) != null; )
        cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], options.enableAsyncPostRenderCleanup && postProcessedRows[row] && postProcessedRows[row][cellToRemove] ? queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : cellNode.parentElement.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], postProcessedRows[row] && delete postProcessedRows[row][cellToRemove], totalCellsRemoved++;
    }
  }
  function cleanUpAndRenderCells(range) {
    for (var cacheEntry, stringArray = [], processedRows = [], cellsAdded, totalCellsAdded = 0, colspan, row = range.top, btm = range.bottom; row <= btm; row++)
      if (cacheEntry = rowsCache[row], !!cacheEntry) {
        ensureCellNodesInRowsCache(row), cleanUpCells(range, row), cellsAdded = 0;
        var metadata = data.getItemMetadata && data.getItemMetadata(row);
        metadata = metadata && metadata.columns;
        for (var d = getDataItem(row), i2 = 0, ii = columns.length; i2 < ii; i2++)
          if (!(!columns[i2] || columns[i2].hidden)) {
            if (columnPosLeft[i2] > range.rightPx)
              break;
            if ((colspan = cacheEntry.cellColSpans[i2]) != null) {
              i2 += colspan > 1 ? colspan - 1 : 0;
              continue;
            }
            if (colspan = 1, metadata) {
              var columnData = metadata[columns[i2].id] || metadata[i2];
              colspan = columnData && columnData.colspan || 1, colspan === "*" && (colspan = ii - i2);
            }
            columnPosRight[Math.min(ii - 1, i2 + colspan - 1)] > range.leftPx && (appendCellHtml(stringArray, row, i2, colspan, d), cellsAdded++), i2 += colspan > 1 ? colspan - 1 : 0;
          }
        cellsAdded && (totalCellsAdded += cellsAdded, processedRows.push(row));
      }
    if (stringArray.length)
      for (var x = Utils5.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArray.join("")) }), processedRow, node; (processedRow = processedRows.pop()) != null; ) {
        cacheEntry = rowsCache[processedRow];
        for (var columnIdx; (columnIdx = cacheEntry.cellRenderQueue.pop()) != null; )
          node = x.lastChild, hasFrozenColumns() && columnIdx > options.frozenColumn ? cacheEntry.rowNode[1].appendChild(node) : cacheEntry.rowNode[0].appendChild(node), cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
      }
  }
  function renderRows(range) {
    for (var stringArrayL = [], stringArrayR = [], rows = [], needToReselectCell = !1, dataLength = getDataLength(), i2 = range.top, ii = range.bottom; i2 <= ii; i2++)
      rowsCache[i2] || hasFrozenRows && options.frozenBottom && i2 == getDataLength() || (renderedRows++, rows.push(i2), rowsCache[i2] = {
        rowNode: null,
        // ColSpans of rendered cells (by column idx).
        // Can also be used for checking whether a cell has been rendered.
        cellColSpans: [],
        // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
        cellNodesByColumnIdx: [],
        // Column indices of cell nodes that have been rendered, but not yet indexed in
        // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
        // end of the row.
        cellRenderQueue: []
      }, appendRowHtml(stringArrayL, stringArrayR, i2, range, dataLength), activeCellNode && activeRow === i2 && (needToReselectCell = !0), counter_rows_rendered++);
    if (!rows.length)
      return;
    let x = Utils5.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArrayL.join("")) }), xRight = Utils5.createDomElement("div", { innerHTML: sanitizeHtmlString(stringArrayR.join("")) });
    for (var i2 = 0, ii = rows.length; i2 < ii; i2++)
      hasFrozenRows && rows[i2] >= actualFrozenRow ? hasFrozenColumns() ? (rowsCache[rows[i2]].rowNode = [x.firstChild, xRight.firstChild], _canvasBottomL.appendChild(x.firstChild), _canvasBottomR.appendChild(xRight.firstChild)) : (rowsCache[rows[i2]].rowNode = [x.firstChild], _canvasBottomL.appendChild(x.firstChild)) : hasFrozenColumns() ? (rowsCache[rows[i2]].rowNode = [x.firstChild, xRight.firstChild], _canvasTopL.appendChild(x.firstChild), _canvasTopR.appendChild(xRight.firstChild)) : (rowsCache[rows[i2]].rowNode = [x.firstChild], _canvasTopL.appendChild(x.firstChild));
    needToReselectCell && (activeCellNode = getCellNode(activeRow, activeCell));
  }
  function startPostProcessing() {
    options.enableAsyncPostRender && (clearTimeout(h_postrender), h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay));
  }
  function startPostProcessingCleanup() {
    options.enableAsyncPostRenderCleanup && (clearTimeout(h_postrenderCleanup), h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay));
  }
  function invalidatePostProcessingResults(row) {
    for (var columnIdx in postProcessedRows[row])
      postProcessedRows[row].hasOwnProperty(columnIdx) && (postProcessedRows[row][columnIdx] = "C");
    postProcessFromRow = Math.min(postProcessFromRow, row), postProcessToRow = Math.max(postProcessToRow, row), startPostProcessing();
  }
  function updateRowPositions() {
    for (var row in rowsCache) {
      var rowNumber = row ? parseInt(row) : 0;
      Utils5.setStyleSize("top", getRowTop(rowNumber));
    }
  }
  function render() {
    if (initialized) {
      scrollThrottle.dequeue();
      var visible = getVisibleRange(), rendered = getRenderedRange();
      if (cleanupRows(rendered), lastRenderedScrollLeft != scrollLeft) {
        if (hasFrozenRows) {
          var renderedFrozenRows = Utils5.extend(!0, {}, rendered);
          options.frozenBottom ? (renderedFrozenRows.top = actualFrozenRow, renderedFrozenRows.bottom = getDataLength()) : (renderedFrozenRows.top = 0, renderedFrozenRows.bottom = options.frozenRow), cleanUpAndRenderCells(renderedFrozenRows);
        }
        cleanUpAndRenderCells(rendered);
      }
      renderRows(rendered), hasFrozenRows && (options.frozenBottom ? renderRows({
        top: actualFrozenRow,
        bottom: getDataLength() - 1,
        leftPx: rendered.leftPx,
        rightPx: rendered.rightPx
      }) : renderRows({
        top: 0,
        bottom: options.frozenRow - 1,
        leftPx: rendered.leftPx,
        rightPx: rendered.rightPx
      })), postProcessFromRow = visible.top, postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom), startPostProcessing(), lastRenderedScrollTop = scrollTop, lastRenderedScrollLeft = scrollLeft, h_render = null, trigger(self.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: self });
    }
  }
  function handleHeaderRowScroll() {
    var scrollLeft2 = _headerRowScrollContainer.scrollLeft;
    scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
  }
  function handleFooterRowScroll() {
    var scrollLeft2 = _footerRowScrollContainer.scrollLeft;
    scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
  }
  function handlePreHeaderPanelScroll() {
    handleElementScroll(_preHeaderPanelScroller);
  }
  function handleElementScroll(element) {
    var scrollLeft2 = element.scrollLeft;
    scrollLeft2 != _viewportScrollContainerX.scrollLeft && (_viewportScrollContainerX.scrollLeft = scrollLeft2);
  }
  function handleScroll() {
    return scrollTop = _viewportScrollContainerY.scrollTop, scrollLeft = _viewportScrollContainerX.scrollLeft, _handleScroll(!1);
  }
  function _handleScroll(isMouseWheel) {
    var maxScrollDistanceY = _viewportScrollContainerY.scrollHeight - _viewportScrollContainerY.clientHeight, maxScrollDistanceX = _viewportScrollContainerY.scrollWidth - _viewportScrollContainerY.clientWidth;
    maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), scrollTop > maxScrollDistanceY && (scrollTop = maxScrollDistanceY), scrollLeft > maxScrollDistanceX && (scrollLeft = maxScrollDistanceX);
    var vScrollDist = Math.abs(scrollTop - prevScrollTop), hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
    if (hScrollDist && (prevScrollLeft = scrollLeft, Utils5.debounce(() => {
      _viewportScrollContainerX.scrollLeft = scrollLeft, _headerScrollContainer.scrollLeft = scrollLeft, _topPanelScrollers[0].scrollLeft = scrollLeft, options.createFooterRow && (_footerRowScrollContainer.scrollLeft = scrollLeft), options.createPreHeaderPanel && (hasFrozenColumns() ? _preHeaderPanelScrollerR.scrollLeft = scrollLeft : _preHeaderPanelScroller.scrollLeft = scrollLeft), hasFrozenColumns() ? (hasFrozenRows && (_viewportTopR.scrollLeft = scrollLeft), _headerRowScrollerR.scrollLeft = scrollLeft) : (hasFrozenRows && (_viewportTopL.scrollLeft = scrollLeft), _headerRowScrollerL.scrollLeft = scrollLeft);
    }, options.scrollDebounceDelay)()), vScrollDist && !options.autoHeight)
      if (vScrollDir = prevScrollTop < scrollTop ? 1 : -1, prevScrollTop = scrollTop, isMouseWheel && (_viewportScrollContainerY.scrollTop = scrollTop), hasFrozenColumns() && (hasFrozenRows && !options.frozenBottom ? _viewportBottomL.scrollTop = scrollTop : _viewportTopL.scrollTop = scrollTop), vScrollDist < viewportH)
        scrollTo(scrollTop + offset2);
      else {
        var oldOffset = offset2;
        h == viewportH ? page = 0 : page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph))), offset2 = Math.round(page * cj), oldOffset != offset2 && invalidateAllRows();
      }
    if (hScrollDist || vScrollDist) {
      var dx = Math.abs(lastRenderedScrollLeft - scrollLeft), dy = Math.abs(lastRenderedScrollTop - scrollTop);
      (dx > 20 || dy > 20) && (options.forceSyncScrolling || dy < viewportH && dx < viewportW ? render() : scrollThrottle.enqueue(), trigger(self.onViewportChanged, {}));
    }
    return trigger(self.onScroll, { scrollLeft, scrollTop }), !!(hScrollDist || vScrollDist);
  }
  function ActionThrottle(action, minPeriod_ms) {
    var blocked = !1, queued = !1;
    function enqueue() {
      blocked ? queued = !0 : blockAndExecute();
    }
    function dequeue() {
      queued = !1;
    }
    function blockAndExecute() {
      blocked = !0, setTimeout(unblock, minPeriod_ms), action();
    }
    function unblock() {
      queued ? (dequeue(), blockAndExecute()) : blocked = !1;
    }
    return {
      enqueue,
      dequeue
    };
  }
  function asyncPostProcessRows() {
    for (var dataLength = getDataLength(); postProcessFromRow <= postProcessToRow; ) {
      var row = vScrollDir >= 0 ? postProcessFromRow++ : postProcessToRow--, cacheEntry = rowsCache[row];
      if (!(!cacheEntry || row >= dataLength)) {
        postProcessedRows[row] || (postProcessedRows[row] = {}), ensureCellNodesInRowsCache(row);
        for (var columnIdx in cacheEntry.cellNodesByColumnIdx)
          if (cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
            columnIdx = columnIdx | 0;
            var m = columns[columnIdx], processedStatus = postProcessedRows[row][columnIdx];
            if (m.asyncPostRender && processedStatus !== "R") {
              var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
              node && m.asyncPostRender(node, row, getDataItem(row), m, processedStatus === "C"), postProcessedRows[row][columnIdx] = "R";
            }
          }
        h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
        return;
      }
    }
  }
  function asyncPostProcessCleanupRows() {
    if (postProcessedCleanupQueue.length > 0) {
      for (var groupId = postProcessedCleanupQueue[0].groupId; postProcessedCleanupQueue.length > 0 && postProcessedCleanupQueue[0].groupId == groupId; ) {
        var entry = postProcessedCleanupQueue.shift();
        if (entry.actionType == "R" && entry.node.forEach(function(node) {
          node.remove();
        }), entry.actionType == "C") {
          var column = columns[entry.columnIdx];
          column.asyncPostRenderCleanup && entry.node && column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
        }
      }
      h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
    }
  }
  function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
    var node, columnId, addedRowHash, removedRowHash;
    for (var row in rowsCache) {
      if (removedRowHash = removedHash && removedHash[row], addedRowHash = addedHash && addedHash[row], removedRowHash)
        for (columnId in removedRowHash)
          (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) && (node = getCellNode(row, getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
      if (addedRowHash)
        for (columnId in addedRowHash)
          (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) && (node = getCellNode(row, getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
    }
  }
  function addCellCssStyles(key, hash) {
    if (cellCssClasses[key])
      throw new Error("SlickGrid addCellCssStyles: cell CSS hash with key '" + key + "' already exists.");
    cellCssClasses[key] = hash, updateCellCssStylesOnRenderedRows(hash, null), trigger(self.onCellCssStylesChanged, { key, hash, grid: self });
  }
  function removeCellCssStyles(key) {
    cellCssClasses[key] && (updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]), delete cellCssClasses[key], trigger(self.onCellCssStylesChanged, { key, hash: null, grid: self }));
  }
  function setCellCssStyles(key, hash) {
    let prevHash = cellCssClasses[key];
    cellCssClasses[key] = hash, updateCellCssStylesOnRenderedRows(hash, prevHash), trigger(self.onCellCssStylesChanged, { key, hash, grid: self });
  }
  function getCellCssStyles(key) {
    return cellCssClasses[key];
  }
  function flashCell(row, cell, speed) {
    speed = speed || 250;
    function toggleCellClass(cellNode, times) {
      times < 1 || setTimeout(function() {
        times % 2 == 0 ? cellNode.classList.add(options.cellFlashingCssClass) : cellNode.classList.remove(options.cellFlashingCssClass), toggleCellClass(cellNode, times - 1);
      }, speed);
    }
    if (rowsCache[row]) {
      let cellNode = getCellNode(row, cell);
      cellNode && toggleCellClass(cellNode, 5);
    }
  }
  function handleMouseWheel(e, delta, deltaX, deltaY) {
    scrollTop = Math.max(0, _viewportScrollContainerY.scrollTop - deltaY * options.rowHeight), scrollLeft = _viewportScrollContainerX.scrollLeft + deltaX * 10;
    var handled = _handleScroll(!0);
    handled && e.preventDefault();
  }
  function handleDragInit(e, dd) {
    var cell = getCellFromEvent(e);
    if (!cell || !cellExists(cell.row, cell.cell))
      return !1;
    var retval = trigger(self.onDragInit, dd, e);
    return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
  }
  function handleDragStart(e, dd) {
    var cell = getCellFromEvent(e);
    if (!cell || !cellExists(cell.row, cell.cell))
      return !1;
    var retval = trigger(self.onDragStart, dd, e);
    return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
  }
  function handleDrag(e, dd) {
    return trigger(self.onDrag, dd, e).getReturnValue();
  }
  function handleDragEnd(e, dd) {
    trigger(self.onDragEnd, dd, e);
  }
  function handleKeyDown(e) {
    var handled = trigger(self.onKeyDown, { row: activeRow, cell: activeCell }, e).isImmediatePropagationStopped();
    if (!handled && !e.shiftKey && !e.altKey) {
      if (options.editable && currentEditor && currentEditor.keyCaptureList && currentEditor.keyCaptureList.indexOf(e.which) > -1)
        return;
      e.which == keyCode4.HOME ? handled = e.ctrlKey ? navigateTop() : navigateRowStart() : e.which == keyCode4.END && (handled = e.ctrlKey ? navigateBottom() : navigateRowEnd());
    }
    if (!handled)
      if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
        if (options.editable && currentEditor && currentEditor.keyCaptureList && currentEditor.keyCaptureList.indexOf(e.which) > -1)
          return;
        if (e.which == keyCode4.ESCAPE) {
          if (!getEditorLock().isActive())
            return;
          cancelEditAndSetFocus();
        } else
          e.which == keyCode4.PAGE_DOWN ? (navigatePageDown(), handled = !0) : e.which == keyCode4.PAGE_UP ? (navigatePageUp(), handled = !0) : e.which == keyCode4.LEFT ? handled = navigateLeft() : e.which == keyCode4.RIGHT ? handled = navigateRight() : e.which == keyCode4.UP ? handled = navigateUp() : e.which == keyCode4.DOWN ? handled = navigateDown() : e.which == keyCode4.TAB ? handled = navigateNext() : e.which == keyCode4.ENTER && (options.editable && (currentEditor ? activeRow === getDataLength() ? navigateDown() : commitEditAndSetFocus() : getEditorLock().commitCurrentEdit() && makeActiveCellEditable(void 0, void 0, e)), handled = !0);
      } else
        e.which == keyCode4.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = navigatePrev());
    if (handled) {
      e.stopPropagation(), e.preventDefault();
      try {
        e.originalEvent.keyCode = 0;
      } catch {
      }
    }
  }
  function handleClick(evt) {
    let e = evt;
    if (e instanceof EventData3 ? e = evt.getNativeEvent() : evt = void 0, !currentEditor && (e.target != document.activeElement || e.target.classList.contains("slick-cell"))) {
      var selection = getTextSelection();
      setFocus(), setTextSelection(selection);
    }
    var cell = getCellFromEvent(e);
    if (!(!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) && (evt = trigger(self.onClick, { row: cell.row, cell: cell.cell }, evt || e), !evt.isImmediatePropagationStopped() && canCellBeActive(cell.row, cell.cell) && (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()))) {
      scrollRowIntoView(cell.row, !1);
      var preClickModeOn = e.target && e.target.className === preClickClassName2, column = columns[cell.cell], suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
      setActiveCellInternal(getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
    }
  }
  function handleContextMenu(e) {
    var cell = e.target.closest(".slick-cell");
    cell && (activeCellNode === cell && currentEditor !== null || trigger(self.onContextMenu, {}, e));
  }
  function handleDblClick(e) {
    var cell = getCellFromEvent(e);
    !cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell || (trigger(self.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && options.editable && gotoCell(cell.row, cell.cell, !0, e));
  }
  function handleHeaderMouseEnter(e) {
    let c = Utils5.storage.get(e.target.closest(".slick-header-column"), "column");
    c && trigger(self.onHeaderMouseEnter, {
      column: c,
      grid: self
    }, e);
  }
  function handleHeaderMouseLeave(e) {
    let c = Utils5.storage.get(e.target.closest(".slick-header-column"), "column");
    c && trigger(self.onHeaderMouseLeave, {
      column: c,
      grid: self
    }, e);
  }
  function handleHeaderRowMouseEnter(e) {
    let c = Utils5.storage.get(e.target.closest(".slick-headerrow-column"), "column");
    c && trigger(self.onHeaderRowMouseEnter, {
      column: c,
      grid: self
    }, e);
  }
  function handleHeaderRowMouseLeave(e) {
    let c = Utils5.storage.get(e.target.closest(".slick-headerrow-column"), "column");
    c && trigger(self.onHeaderRowMouseLeave, {
      column: c,
      grid: self
    }, e);
  }
  function handleHeaderContextMenu(e) {
    var header = e.target.closest(".slick-header-column"), column = header && Utils5.storage.get(header, "column");
    trigger(self.onHeaderContextMenu, { column }, e);
  }
  function handleHeaderClick(e) {
    if (!columnResizeDragging) {
      var header = e.target.closest(".slick-header-column"), column = header && Utils5.storage.get(header, "column");
      column && trigger(self.onHeaderClick, { column }, e);
    }
  }
  function handleFooterContextMenu(e) {
    var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils5.storage.get(footer, "column");
    trigger(self.onFooterContextMenu, { column }, e);
  }
  function handleFooterClick(e) {
    var footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils5.storage.get(footer, "column");
    trigger(self.onFooterClick, { column }, e);
  }
  function handleCellMouseOver(e) {
    trigger(self.onMouseEnter, {}, e);
  }
  function handleCellMouseOut(e) {
    trigger(self.onMouseLeave, {}, e);
  }
  function cellExists(row, cell) {
    return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
  }
  function getCellFromPoint(x, y) {
    for (var row = getRowFromPosition(y), cell = 0, w = 0, i2 = 0; i2 < columns.length && w < x; i2++)
      !columns[i2] || columns[i2].hidden || (w += columns[i2].width, cell++);
    return cell < 0 && (cell = 0), { row, cell: cell - 1 };
  }
  function getCellFromNode(cellNode) {
    var cls = /l\d+/.exec(cellNode.className);
    if (!cls)
      throw new Error("SlickGrid getCellFromNode: cannot get cell - " + cellNode.className);
    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
  }
  function getRowFromNode(rowNode) {
    for (var row in rowsCache)
      for (var i2 in rowsCache[row].rowNode)
        if (rowsCache[row].rowNode[i2] === rowNode)
          return row ? parseInt(row) : 0;
    return null;
  }
  function getFrozenRowOffset(row) {
    let offset3 = 0;
    return hasFrozenRows ? options.frozenBottom ? row >= actualFrozenRow ? h < viewportTopH ? offset3 = actualFrozenRow * options.rowHeight : offset3 = h : offset3 = 0 : row >= actualFrozenRow ? offset3 = frozenRowsHeight : offset3 = 0 : offset3 = 0, offset3;
  }
  function getCellFromEvent(e) {
    e instanceof EventData3 && (e = e.getNativeEvent());
    var targetEvent = e.touches ? e.touches[0] : e, row, cell, cellNode = e.target.closest(".slick-cell");
    if (!cellNode)
      return null;
    if (row = getRowFromNode(cellNode.parentNode), hasFrozenRows) {
      var c = Utils5.offset(Utils5.parents(cellNode, ".grid-canvas")[0]), rowOffset = 0, isBottom = Utils5.parents(cellNode, ".grid-canvas-bottom").length;
      isBottom && (rowOffset = options.frozenBottom ? Utils5.height(_canvasTopL) : frozenRowsHeight), row = getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
    }
    return cell = getCellFromNode(cellNode), row == null || cell == null ? null : {
      row,
      cell
    };
  }
  function getCellNodeBox(row, cell) {
    if (!cellExists(row, cell))
      return null;
    for (var frozenRowOffset = getFrozenRowOffset(row), y1 = getRowTop(row) - frozenRowOffset, y2 = y1 + options.rowHeight - 1, x1 = 0, i2 = 0; i2 < cell; i2++)
      !columns[i2] || columns[i2].hidden || (x1 += columns[i2].width, options.frozenColumn == i2 && (x1 = 0));
    var x2 = x1 + columns[cell].width;
    return {
      top: y1,
      left: x1,
      bottom: y2,
      right: x2
    };
  }
  function resetActiveCell() {
    setActiveCellInternal(null, !1);
  }
  function setFocus() {
    tabbingDirection == -1 ? _focusSink.focus() : _focusSink2.focus();
  }
  function scrollCellIntoView(row, cell, doPaging) {
    if (scrollRowIntoView(row, doPaging), !(cell <= options.frozenColumn)) {
      var colspan = getColspan(row, cell);
      internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
    }
  }
  function internalScrollColumnIntoView(left, right) {
    var scrollRight = scrollLeft + Utils5.width(_viewportScrollContainerX) - (viewportHasVScroll ? scrollbarDimensions.width : 0);
    left < scrollLeft ? (_viewportScrollContainerX.scrollLeft = left, handleScroll(), render()) : right > scrollRight && (_viewportScrollContainerX.scrollLeft = Math.min(left, right - _viewportScrollContainerX.clientWidth), handleScroll(), render());
  }
  function scrollColumnIntoView(cell) {
    internalScrollColumnIntoView(columnPosLeft[cell], columnPosRight[cell]);
  }
  function setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
    activeCellNode !== null && (makeActiveCellNormal(), activeCellNode.classList.remove("active"), rowsCache[activeRow] && rowsCache[activeRow].rowNode.forEach(function(node) {
      node.classList.remove("active");
    }));
    var activeCellChanged = activeCellNode !== newCell;
    if (activeCellNode = newCell, activeCellNode != null) {
      var activeCellOffset = Utils5.offset(activeCellNode), rowOffset = Math.floor(Utils5.offset(Utils5.parents(activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils5.parents(activeCellNode, ".grid-canvas-bottom").length;
      hasFrozenRows && isBottom && (rowOffset -= options.frozenBottom ? Utils5.height(_canvasTopL) : frozenRowsHeight);
      var cell = getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
      activeRow = cell.row, activeCell = activePosX = activeCell = activePosX = getCellFromNode(activeCellNode), opt_editMode == null && (opt_editMode = activeRow == getDataLength() || options.autoEdit), options.showCellSelection && (activeCellNode.classList.add("active"), rowsCache[activeRow] && rowsCache[activeRow].rowNode.forEach(function(node) {
        node.classList.add("active");
      })), options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell) && (clearTimeout(h_editorLoader), options.asyncEditorLoading ? h_editorLoader = setTimeout(function() {
        makeActiveCellEditable(void 0, preClickModeOn, e);
      }, options.asyncEditorLoadDelay) : makeActiveCellEditable(void 0, preClickModeOn, e));
    } else
      activeRow = activeCell = null;
    suppressActiveCellChangedEvent || trigger(self.onActiveCellChanged, getActiveCell());
  }
  function clearTextSelection() {
    if (document.selection && document.selection.empty)
      try {
        document.selection.empty();
      } catch {
      }
    else if (window.getSelection) {
      var sel = window.getSelection();
      sel && sel.removeAllRanges && sel.removeAllRanges();
    }
  }
  function isCellPotentiallyEditable(row, cell) {
    var dataLength = getDataLength();
    return !(row < dataLength && !getDataItem(row) || columns[cell].cannotTriggerInsert && row >= dataLength || !columns[cell] || columns[cell].hidden || !getEditor(row, cell));
  }
  function makeActiveCellNormal() {
    if (currentEditor) {
      if (trigger(self.onBeforeCellEditorDestroy, { editor: currentEditor }), currentEditor.destroy(), currentEditor = null, activeCellNode) {
        var d = getDataItem(activeRow);
        if (activeCellNode.classList.remove("editable"), activeCellNode.classList.remove("invalid"), d) {
          var column = columns[activeCell], formatter = getFormatter(activeRow, column), formatterResult = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d, self);
          applyFormatResultToCellNode(formatterResult, activeCellNode), invalidatePostProcessingResults(activeRow);
        }
      }
      navigator.userAgent.toLowerCase().match(/msie/) && clearTextSelection(), getEditorLock().deactivate(editController);
    }
  }
  function makeActiveCellEditable(editor, preClickModeOn, e) {
    if (activeCellNode) {
      if (!options.editable)
        throw new Error("SlickGrid makeActiveCellEditable : should never get called when options.editable is false");
      if (clearTimeout(h_editorLoader), !!isCellPotentiallyEditable(activeRow, activeCell)) {
        var columnDef = columns[activeCell], item = getDataItem(activeRow);
        if (trigger(self.onBeforeEditCell, { row: activeRow, cell: activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
          setFocus();
          return;
        }
        getEditorLock().activate(editController), activeCellNode.classList.add("editable");
        var useEditor = editor || getEditor(activeRow, activeCell);
        !editor && !useEditor.suppressClearOnEdit && (activeCellNode.innerHTML = "");
        var metadata = data.getItemMetadata && data.getItemMetadata(activeRow);
        metadata = metadata && metadata.columns;
        var columnMetaData = metadata && (metadata[columnDef.id] || metadata[activeCell]);
        currentEditor = new useEditor({
          grid: self,
          gridPosition: absBox(_container),
          position: absBox(activeCellNode),
          container: activeCellNode,
          column: columnDef,
          columnMetaData,
          item: item || {},
          event: e,
          commitChanges: commitEditAndSetFocus,
          cancelChanges: cancelEditAndSetFocus
        }), item && (currentEditor.loadValue(item), preClickModeOn && currentEditor.preClick && currentEditor.preClick()), serializedEditorValue = currentEditor.serializeValue(), currentEditor.position && handleActiveCellPositionChange();
      }
    }
  }
  function commitEditAndSetFocus() {
    getEditorLock().commitCurrentEdit() && (setFocus(), options.autoEdit && !options.autoCommitEdit && navigateDown());
  }
  function cancelEditAndSetFocus() {
    getEditorLock().cancelCurrentEdit() && setFocus();
  }
  function absBox(elem) {
    var box = {
      top: elem.offsetTop,
      left: elem.offsetLeft,
      bottom: 0,
      right: 0,
      width: elem.offsetWidth,
      height: elem.offsetWidth,
      visible: !0
    };
    box.bottom = box.top + box.height, box.right = box.left + box.width;
    for (var offsetParent = elem.offsetParent; (elem = elem.parentNode) != document.body && elem != null; ) {
      let styles = getComputedStyle(elem);
      box.visible && elem.scrollHeight != elem.offsetHeight && styles.overflowY != "visible" && (box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight), box.visible && elem.scrollWidth != elem.offsetWidth && styles.overflowX != "visible" && (box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth), box.left -= elem.scrollLeft, box.top -= elem.scrollTop, elem === offsetParent && (box.left += elem.offsetLeft, box.top += elem.offsetTop, offsetParent = elem.offsetParent), box.bottom = box.top + box.height, box.right = box.left + box.width;
    }
    return box;
  }
  function getActiveCellPosition() {
    return absBox(activeCellNode);
  }
  function getGridPosition() {
    return absBox(_container);
  }
  function handleActiveCellPositionChange() {
    if (activeCellNode && (trigger(self.onActiveCellPositionChanged, {}), currentEditor)) {
      var cellBox = getActiveCellPosition();
      currentEditor.show && currentEditor.hide && (cellBox.visible ? currentEditor.show() : currentEditor.hide()), currentEditor.position && currentEditor.position(cellBox);
    }
  }
  function getCellEditor() {
    return currentEditor;
  }
  function getActiveCell() {
    return activeCellNode ? { row: activeRow, cell: activeCell } : null;
  }
  function getActiveCellNode() {
    return activeCellNode;
  }
  function getTextSelection() {
    var textSelection = null;
    if (window.getSelection) {
      var selection = window.getSelection();
      selection.rangeCount > 0 && (textSelection = selection.getRangeAt(0));
    }
    return textSelection;
  }
  function setTextSelection(selection) {
    if (window.getSelection && selection) {
      var target = window.getSelection();
      target.removeAllRanges(), target.addRange(selection);
    }
  }
  function scrollRowIntoView(row, doPaging) {
    if (!hasFrozenRows || !options.frozenBottom && row > actualFrozenRow - 1 || options.frozenBottom && row < actualFrozenRow - 1) {
      var viewportScrollH = Utils5.height(_viewportScrollContainerY), rowNumber = hasFrozenRows && !options.frozenBottom ? row - options.frozenRow : row, rowAtTop = rowNumber * options.rowHeight, rowAtBottom = (rowNumber + 1) * options.rowHeight - viewportScrollH + (viewportHasHScroll ? scrollbarDimensions.height : 0);
      (rowNumber + 1) * options.rowHeight > scrollTop + viewportScrollH + offset2 ? (scrollTo(doPaging ? rowAtTop : rowAtBottom), render()) : rowNumber * options.rowHeight < scrollTop + offset2 && (scrollTo(doPaging ? rowAtBottom : rowAtTop), render());
    }
  }
  function scrollRowToTop(row) {
    scrollTo(row * options.rowHeight), render();
  }
  function scrollPage(dir) {
    var deltaRows = dir * numVisibleRows, bottomOfTopmostFullyVisibleRow = scrollTop + options.rowHeight - 1;
    if (scrollTo((getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * options.rowHeight), render(), options.enableCellNavigation && activeRow != null) {
      var row = activeRow + deltaRows, dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
      for (var cell = 0, prevCell = null, prevActivePosX = activePosX; cell <= activePosX; )
        canCellBeActive(row, cell) && (prevCell = cell), cell += getColspan(row, cell);
      prevCell !== null ? (setActiveCellInternal(getCellNode(row, prevCell)), activePosX = prevActivePosX) : resetActiveCell();
    }
  }
  function navigatePageDown() {
    scrollPage(1);
  }
  function navigatePageUp() {
    scrollPage(-1);
  }
  function navigateTop() {
    navigateToRow(0);
  }
  function navigateBottom() {
    navigateToRow(getDataLength() - 1);
  }
  function navigateToRow(row) {
    var num_rows = getDataLength();
    if (!num_rows)
      return !0;
    if (row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), scrollCellIntoView(row, 0, !0), options.enableCellNavigation && activeRow != null) {
      for (var cell = 0, prevCell = null, prevActivePosX = activePosX; cell <= activePosX; )
        canCellBeActive(row, cell) && (prevCell = cell), cell += getColspan(row, cell);
      prevCell !== null ? (setActiveCellInternal(getCellNode(row, prevCell)), activePosX = prevActivePosX) : resetActiveCell();
    }
    return !0;
  }
  function getColspan(row, cell) {
    var metadata = data.getItemMetadata && data.getItemMetadata(row);
    if (!metadata || !metadata.columns)
      return 1;
    var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell], colspan = columnData && columnData.colspan;
    return colspan === "*" ? colspan = columns.length - cell : colspan = colspan || 1, colspan;
  }
  function findFirstFocusableCell(row) {
    for (var cell = 0; cell < columns.length; ) {
      if (canCellBeActive(row, cell))
        return cell;
      cell += getColspan(row, cell);
    }
    return null;
  }
  function findLastFocusableCell(row) {
    for (var cell = 0, lastFocusableCell = null; cell < columns.length; )
      canCellBeActive(row, cell) && (lastFocusableCell = cell), cell += getColspan(row, cell);
    return lastFocusableCell;
  }
  function gotoRight(row, cell, posX) {
    if (cell >= columns.length)
      return null;
    do
      cell += getColspan(row, cell);
    while (cell < columns.length && !canCellBeActive(row, cell));
    return cell < columns.length ? {
      row,
      cell,
      posX: cell
    } : null;
  }
  function gotoLeft(row, cell, posX) {
    if (cell <= 0)
      return null;
    var firstFocusableCell = findFirstFocusableCell(row);
    if (firstFocusableCell === null || firstFocusableCell >= cell)
      return null;
    for (var prev = {
      row,
      cell: firstFocusableCell,
      posX: firstFocusableCell
    }, pos; ; ) {
      if (pos = gotoRight(prev.row, prev.cell, prev.posX), !pos)
        return null;
      if (pos.cell >= cell)
        return prev;
      prev = pos;
    }
  }
  function gotoDown(row, cell, posX) {
    for (var prevCell, dataLengthIncludingAddNew = getDataLengthIncludingAddNew(); ; ) {
      if (++row >= dataLengthIncludingAddNew)
        return null;
      for (prevCell = cell = 0; cell <= posX; )
        prevCell = cell, cell += getColspan(row, cell);
      if (canCellBeActive(row, prevCell))
        return {
          row,
          cell: prevCell,
          posX
        };
    }
  }
  function gotoUp(row, cell, posX) {
    for (var prevCell; ; ) {
      if (--row < 0)
        return null;
      for (prevCell = cell = 0; cell <= posX; )
        prevCell = cell, cell += getColspan(row, cell);
      if (canCellBeActive(row, prevCell))
        return {
          row,
          cell: prevCell,
          posX
        };
    }
  }
  function gotoNext(row, cell, posX) {
    if (row == null && cell == null && (row = cell = posX = 0, canCellBeActive(row, cell)))
      return {
        row,
        cell,
        posX: cell
      };
    var pos = gotoRight(row, cell, posX);
    if (pos)
      return pos;
    var firstFocusableCell = null, dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
    for (row === dataLengthIncludingAddNew - 1 && row--; ++row < dataLengthIncludingAddNew; )
      if (firstFocusableCell = findFirstFocusableCell(row), firstFocusableCell !== null)
        return {
          row,
          cell: firstFocusableCell,
          posX: firstFocusableCell
        };
    return null;
  }
  function gotoPrev(row, cell, posX) {
    if (row == null && cell == null && (row = getDataLengthIncludingAddNew() - 1, cell = posX = columns.length - 1, canCellBeActive(row, cell)))
      return {
        row,
        cell,
        posX: cell
      };
    for (var pos, lastSelectableCell; !pos && (pos = gotoLeft(row, cell, posX), !pos); ) {
      if (--row < 0)
        return null;
      cell = 0, lastSelectableCell = findLastFocusableCell(row), lastSelectableCell !== null && (pos = {
        row,
        cell: lastSelectableCell,
        posX: lastSelectableCell
      });
    }
    return pos;
  }
  function gotoRowStart(row, cell, posX) {
    var newCell = findFirstFocusableCell(row);
    return newCell === null ? null : {
      row,
      cell: newCell,
      posX: newCell
    };
  }
  function gotoRowEnd(row, cell, posX) {
    var newCell = findLastFocusableCell(row);
    return newCell === null ? null : {
      row,
      cell: newCell,
      posX: newCell
    };
  }
  function navigateRight() {
    return navigate("right");
  }
  function navigateLeft() {
    return navigate("left");
  }
  function navigateDown() {
    return navigate("down");
  }
  function navigateUp() {
    return navigate("up");
  }
  function navigateNext() {
    return navigate("next");
  }
  function navigatePrev() {
    return navigate("prev");
  }
  function navigateRowStart() {
    return navigate("home");
  }
  function navigateRowEnd() {
    return navigate("end");
  }
  function navigate(dir) {
    if (!options.enableCellNavigation || !activeCellNode && dir != "prev" && dir != "next")
      return !1;
    if (!getEditorLock().commitCurrentEdit())
      return !0;
    setFocus();
    var tabbingDirections = {
      up: -1,
      down: 1,
      left: -1,
      right: 1,
      prev: -1,
      next: 1,
      home: -1,
      end: 1
    };
    tabbingDirection = tabbingDirections[dir];
    var stepFunctions = {
      up: gotoUp,
      down: gotoDown,
      left: gotoLeft,
      right: gotoRight,
      prev: gotoPrev,
      next: gotoNext,
      home: gotoRowStart,
      end: gotoRowEnd
    }, stepFn = stepFunctions[dir], pos = stepFn(activeRow, activeCell, activePosX);
    if (pos) {
      if (hasFrozenRows && options.frozenBottom & pos.row == getDataLength())
        return;
      var isAddNewRow = pos.row == getDataLength();
      return (!options.frozenBottom && pos.row >= actualFrozenRow || options.frozenBottom && pos.row < actualFrozenRow) && scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && options.emulatePagingWhenScrolling), setActiveCellInternal(getCellNode(pos.row, pos.cell)), activePosX = pos.posX, !0;
    } else
      return setActiveCellInternal(getCellNode(activeRow, activeCell)), !1;
  }
  function getCellNode(row, cell) {
    if (rowsCache[row]) {
      ensureCellNodesInRowsCache(row);
      try {
        return rowsCache[row].cellNodesByColumnIdx.length > cell ? rowsCache[row].cellNodesByColumnIdx[cell] : null;
      } catch {
        return rowsCache[row].cellNodesByColumnIdx[cell];
      }
    }
    return null;
  }
  function setActiveCell(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
    initialized && (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0 || options.enableCellNavigation && (scrollCellIntoView(row, cell, !1), setActiveCellInternal(getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent)));
  }
  function setActiveRow(row, cell, suppressScrollIntoView) {
    initialized && (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0 || (activeRow = row, suppressScrollIntoView || scrollCellIntoView(row, cell || 0, !1)));
  }
  function canCellBeActive(row, cell) {
    if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() || row < 0 || cell >= columns.length || cell < 0 || !columns[cell] || columns[cell].hidden)
      return !1;
    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
    if (rowMetadata && typeof rowMetadata.focusable < "u")
      return !!rowMetadata.focusable;
    var columnMetadata = rowMetadata && rowMetadata.columns;
    return columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable < "u" ? !!columnMetadata[columns[cell].id].focusable : columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable < "u" ? !!columnMetadata[cell].focusable : !!columns[cell].focusable;
  }
  function canCellBeSelected(row, cell) {
    if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0 || !columns[cell] || columns[cell].hidden)
      return !1;
    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
    if (rowMetadata && typeof rowMetadata.selectable < "u")
      return !!rowMetadata.selectable;
    var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
    return columnMetadata && typeof columnMetadata.selectable < "u" ? !!columnMetadata.selectable : !!columns[cell].selectable;
  }
  function gotoCell(row, cell, forceEdit, e) {
    if (initialized && canCellBeActive(row, cell) && getEditorLock().commitCurrentEdit()) {
      scrollCellIntoView(row, cell, !1);
      var newCell = getCellNode(row, cell), column = columns[cell], suppressActiveCellChangedEvent = !!(options.editable && column && column.editor && options.suppressActiveCellChangeOnEdit);
      setActiveCellInternal(newCell, forceEdit || row === getDataLength() || options.autoEdit, null, suppressActiveCellChangedEvent, e), currentEditor || setFocus();
    }
  }
  function commitCurrentEdit() {
    var item = getDataItem(activeRow), column = columns[activeCell];
    if (currentEditor) {
      if (currentEditor.isValueChanged()) {
        var validationResults = currentEditor.validate();
        if (validationResults.valid) {
          if (activeRow < getDataLength()) {
            var editCommand = {
              row: activeRow,
              cell: activeCell,
              editor: currentEditor,
              serializedValue: currentEditor.serializeValue(),
              prevSerializedValue: serializedEditorValue,
              execute: function() {
                this.editor.applyValue(item, this.serializedValue), updateRow(this.row), trigger(self.onCellChange, {
                  command: "execute",
                  row: this.row,
                  cell: this.cell,
                  item,
                  column
                });
              },
              undo: function() {
                this.editor.applyValue(item, this.prevSerializedValue), updateRow(this.row), trigger(self.onCellChange, {
                  command: "undo",
                  row: this.row,
                  cell: this.cell,
                  item,
                  column
                });
              }
            };
            options.editCommandHandler ? (makeActiveCellNormal(), options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), makeActiveCellNormal());
          } else {
            var newItem = {};
            currentEditor.applyValue(newItem, currentEditor.serializeValue()), makeActiveCellNormal(), trigger(self.onAddNewRow, { item: newItem, column });
          }
          return !getEditorLock().isActive();
        } else
          return activeCellNode.classList.remove("invalid"), Utils5.width(activeCellNode), activeCellNode.classList.add("invalid"), trigger(self.onValidationError, {
            editor: currentEditor,
            cellNode: activeCellNode,
            validationResults,
            row: activeRow,
            cell: activeCell,
            column
          }), currentEditor.focus(), !1;
      }
      makeActiveCellNormal();
    }
    return !0;
  }
  function cancelCurrentEdit() {
    return makeActiveCellNormal(), !0;
  }
  function rowsToRanges(rows) {
    for (var ranges = [], lastCell = columns.length - 1, i2 = 0; i2 < rows.length; i2++)
      ranges.push(new SlickRange(rows[i2], 0, rows[i2], lastCell));
    return ranges;
  }
  function getSelectedRows() {
    if (!selectionModel)
      throw new Error("SlickGrid Selection model is not set");
    return selectedRows.slice(0);
  }
  function setSelectedRows(rows, caller) {
    if (!selectionModel)
      throw new Error("SlickGrid Selection model is not set");
    self && self.getEditorLock && !self.getEditorLock().isActive() && selectionModel.setSelectedRanges(rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
  }
  var logMessageCount = 0, logMessageMaxCount = 30;
  function sanitizeHtmlString(dirtyHtml, suppressLogging) {
    if (!options.sanitizer || typeof dirtyHtml != "string")
      return dirtyHtml;
    var cleanHtml = options.sanitizer(dirtyHtml);
    return !suppressLogging && options.logSanitizedHtml && logMessageCount <= logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log("sanitizer altered html: " + dirtyHtml + " --> " + cleanHtml), logMessageCount === logMessageMaxCount && console.log("sanitizer: silencing messages after first " + logMessageMaxCount), logMessageCount++), cleanHtml;
  }
  this.debug = function() {
    var s = "";
    s += `
counter_rows_rendered:  ` + counter_rows_rendered, s += `
counter_rows_removed:  ` + counter_rows_removed, s += `
renderedRows:  ` + renderedRows, s += `
numVisibleRows:  ` + numVisibleRows, s += `
maxSupportedCssHeight:  ` + maxSupportedCssHeight, s += `
n(umber of pages):  ` + n, s += `
(current) page:  ` + page, s += `
page height (ph):  ` + ph, s += `
vScrollDir:  ` + vScrollDir, alert(s);
  }, Utils5.extend(this, {
    slickGridVersion: "4.0.0",
    // Events
    onScroll: new SlickEvent2(),
    onBeforeSort: new SlickEvent2(),
    onSort: new SlickEvent2(),
    onHeaderMouseEnter: new SlickEvent2(),
    onHeaderMouseLeave: new SlickEvent2(),
    onHeaderRowMouseEnter: new SlickEvent2(),
    onHeaderRowMouseLeave: new SlickEvent2(),
    onHeaderContextMenu: new SlickEvent2(),
    onHeaderClick: new SlickEvent2(),
    onHeaderCellRendered: new SlickEvent2(),
    onBeforeHeaderCellDestroy: new SlickEvent2(),
    onHeaderRowCellRendered: new SlickEvent2(),
    onFooterRowCellRendered: new SlickEvent2(),
    onFooterContextMenu: new SlickEvent2(),
    onFooterClick: new SlickEvent2(),
    onBeforeHeaderRowCellDestroy: new SlickEvent2(),
    onBeforeFooterRowCellDestroy: new SlickEvent2(),
    onMouseEnter: new SlickEvent2(),
    onMouseLeave: new SlickEvent2(),
    onClick: new SlickEvent2(),
    onDblClick: new SlickEvent2(),
    onContextMenu: new SlickEvent2(),
    onKeyDown: new SlickEvent2(),
    onAddNewRow: new SlickEvent2(),
    onBeforeAppendCell: new SlickEvent2(),
    onValidationError: new SlickEvent2(),
    onViewportChanged: new SlickEvent2(),
    onColumnsReordered: new SlickEvent2(),
    onColumnsDrag: new SlickEvent2(),
    onColumnsResized: new SlickEvent2(),
    onColumnsResizeDblClick: new SlickEvent2(),
    onBeforeColumnsResize: new SlickEvent2(),
    onCellChange: new SlickEvent2(),
    onCompositeEditorChange: new SlickEvent2(),
    onBeforeEditCell: new SlickEvent2(),
    onBeforeCellEditorDestroy: new SlickEvent2(),
    onBeforeDestroy: new SlickEvent2(),
    onActiveCellChanged: new SlickEvent2(),
    onActiveCellPositionChanged: new SlickEvent2(),
    onDragInit: new SlickEvent2(),
    onDragStart: new SlickEvent2(),
    onDrag: new SlickEvent2(),
    onDragEnd: new SlickEvent2(),
    onSelectedRowsChanged: new SlickEvent2(),
    onCellCssStylesChanged: new SlickEvent2(),
    onAutosizeColumns: new SlickEvent2(),
    onBeforeSetColumns: new SlickEvent2(),
    onBeforeUpdateColumns: new SlickEvent2(),
    onRendered: new SlickEvent2(),
    onSetOptions: new SlickEvent2(),
    // Methods
    registerPlugin,
    unregisterPlugin,
    getPluginByName,
    getColumns,
    setColumns,
    updateColumns,
    getVisibleColumns,
    getColumnIndex,
    updateColumnHeader,
    setSortColumn,
    setSortColumns,
    getSortColumns,
    autosizeColumns,
    autosizeColumn,
    getOptions,
    setOptions,
    getData,
    getDataLength,
    getDataItem,
    setData,
    getSelectionModel,
    setSelectionModel,
    getSelectedRows,
    setSelectedRows,
    getContainerNode,
    updatePagingStatusFromView,
    applyFormatResultToCellNode,
    render,
    reRenderColumns,
    invalidate,
    invalidateRow,
    invalidateRows,
    invalidateAllRows,
    updateCell,
    updateRow,
    getViewport: getVisibleRange,
    getRenderedRange,
    resizeCanvas,
    updateRowCount,
    scrollRowIntoView,
    scrollRowToTop,
    scrollCellIntoView,
    scrollColumnIntoView,
    getCanvasNode,
    getUID,
    getHeaderColumnWidthDiff,
    getScrollbarDimensions,
    getHeadersWidth,
    getCanvasWidth,
    getCanvases,
    getActiveCanvasNode,
    getViewportNode,
    getViewports,
    getActiveViewportNode,
    setActiveViewportNode,
    focus: setFocus,
    scrollTo,
    cacheCssForHiddenInit,
    restoreCssFromHiddenInit,
    getCellFromPoint,
    getCellFromEvent,
    getActiveCell,
    setActiveCell,
    setActiveRow,
    getActiveCellNode,
    getActiveCellPosition,
    resetActiveCell,
    editActiveCell: makeActiveCellEditable,
    getCellEditor,
    getCellNode,
    getCellNodeBox,
    canCellBeSelected,
    canCellBeActive,
    navigatePrev,
    navigateNext,
    navigateUp,
    navigateDown,
    navigateLeft,
    navigateRight,
    navigatePageUp,
    navigatePageDown,
    navigateTop,
    navigateBottom,
    navigateRowStart,
    navigateRowEnd,
    gotoCell,
    getTopPanel,
    getTopPanels,
    setTopPanelVisibility,
    getPreHeaderPanel,
    getPreHeaderPanelLeft: getPreHeaderPanel,
    getPreHeaderPanelRight,
    setPreHeaderPanelVisibility,
    getHeader,
    getHeaderColumn,
    setHeaderRowVisibility,
    getHeaderRow,
    getHeaderRowColumn,
    setFooterRowVisibility,
    getFooterRow,
    getFooterRowColumn,
    getGridPosition,
    flashCell,
    addCellCssStyles,
    setCellCssStyles,
    removeCellCssStyles,
    getCellCssStyles,
    getFrozenRowOffset,
    setColumnHeaderVisibility,
    sanitizeHtmlString,
    getDisplayedScrollbarDimensions,
    getAbsoluteColumnMinWidth,
    init: finishInitialization,
    destroy,
    // IEditor implementation
    getEditorLock,
    getEditController
  }), init();
}

// src/controls/slick.columnpicker.js
var BindingEventService3 = BindingEventService, SlickEvent3 = Event, Utils6 = Utils;
function SlickColumnPicker(columns, grid, options) {
  var _grid = grid, _options = options, _gridUid = grid && grid.getUID ? grid.getUID() : "", _columnTitleElm, _listElm, _menuElm, columnCheckboxes, onColumnsChanged = new SlickEvent3(), _bindingEventService = new BindingEventService3(), defaults2 = {
    fadeSpeed: 250,
    // the last 2 checkboxes titles
    hideForceFitButton: !1,
    hideSyncResizeButton: !1,
    forceFitTitle: "Force fit columns",
    syncResizeTitle: "Synchronous resize",
    headerColumnValueExtractor: function(columnDef) {
      return columnDef.name;
    }
  };
  function init(grid2) {
    grid2.onHeaderContextMenu.subscribe(handleHeaderContextMenu), grid2.onColumnsReordered.subscribe(updateColumnOrder), _options = Utils6.extend({}, defaults2, options), _menuElm = document.createElement("div"), _menuElm.className = `slick-columnpicker ${_gridUid}`, _menuElm.style.display = "none", document.body.appendChild(_menuElm);
    let buttonElm = document.createElement("button");
    buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-columnpicker", buttonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), _menuElm.appendChild(buttonElm), _options.columnPickerTitle || _options.columnPicker && _options.columnPicker.columnTitle) {
      var columnTitle = _options.columnPickerTitle || _options.columnPicker.columnTitle;
      _columnTitleElm = document.createElement("div"), _columnTitleElm.className = "slick-gridmenu-custom", _columnTitleElm.textContent = columnTitle, _menuElm.appendChild(_columnTitleElm);
    }
    _bindingEventService.bind(_menuElm, "click", updateColumn), _listElm = document.createElement("span"), _listElm.className = "slick-columnpicker-list", _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown), _bindingEventService.bind(document.body, "beforeunload", destroy);
  }
  function destroy() {
    _grid.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu), _grid.onColumnsReordered.unsubscribe(updateColumnOrder), _bindingEventService.unbindAll(), _listElm && _listElm.remove(), _menuElm && _menuElm.remove();
  }
  function handleBodyMouseDown(e) {
    (_menuElm !== e.target && !(_menuElm && _menuElm.contains(e.target)) || e.target.className === "close") && (_menuElm.setAttribute("aria-expanded", "false"), _menuElm.style.display = "none");
  }
  function handleHeaderContextMenu(e) {
    e.preventDefault(), Utils6.emptyElement(_listElm), updateColumnOrder(), columnCheckboxes = [];
    let columnId, columnLabel, excludeCssClass;
    for (var i2 = 0; i2 < columns.length; i2++) {
      columnId = columns[i2].id, excludeCssClass = columns[i2].excludeFromColumnPicker ? "hidden" : "";
      let liElm = document.createElement("li");
      liElm.className = excludeCssClass, liElm.ariaLabel = columns[i2] && columns[i2].name;
      let checkboxElm = document.createElement("input");
      checkboxElm.type = "checkbox", checkboxElm.id = `${_gridUid}colpicker-${columnId}`, checkboxElm.dataset.columnid = columns[i2].id, liElm.appendChild(checkboxElm), columnCheckboxes.push(checkboxElm), _grid.getColumnIndex(columnId) != null && !columns[i2].hidden && (checkboxElm.checked = !0), _options && _options.columnPicker && _options.columnPicker.headerColumnValueExtractor ? columnLabel = _options.columnPicker.headerColumnValueExtractor(columns[i2], _options) : columnLabel = defaults2.headerColumnValueExtractor(columns[i2], _options);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}colpicker-${columnId}`, labelElm.innerHTML = columnLabel, liElm.appendChild(labelElm), _listElm.appendChild(liElm);
    }
    if (_options.columnPicker && (!_options.columnPicker.hideForceFitButton || !_options.columnPicker.hideSyncResizeButton) && _listElm.appendChild(document.createElement("hr")), !(_options.columnPicker && _options.columnPicker.hideForceFitButton)) {
      let forceFitTitle = _options.columnPicker && _options.columnPicker.forceFitTitle || _options.forceFitTitle, liElm = document.createElement("li");
      liElm.ariaLabel = forceFitTitle, _listElm.appendChild(liElm);
      let forceFitCheckboxElm = document.createElement("input");
      forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${_gridUid}colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), _grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
    }
    if (!(_options.columnPicker && _options.columnPicker.hideSyncResizeButton)) {
      let syncResizeTitle = _options.columnPicker && _options.columnPicker.syncResizeTitle || _options.syncResizeTitle, liElm = document.createElement("li");
      liElm.ariaLabel = syncResizeTitle, _listElm.appendChild(liElm);
      let syncResizeCheckboxElm = document.createElement("input");
      syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${_gridUid}colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), _grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
    }
    repositionMenu(e);
  }
  function repositionMenu(event) {
    let targetEvent = event && event.touches && event.touches[0] || event;
    _menuElm.style.top = `${targetEvent.pageY - 10}px`, _menuElm.style.left = `${targetEvent.pageX - 10}px`, _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`, _menuElm.style.display = "block", _menuElm.setAttribute("aria-expanded", "true"), _menuElm.appendChild(_listElm);
  }
  function updateColumnOrder() {
    let current = _grid.getColumns().slice(0), ordered = new Array(columns.length);
    for (let i2 = 0; i2 < ordered.length; i2++)
      _grid.getColumnIndex(columns[i2].id) === void 0 ? ordered[i2] = columns[i2] : ordered[i2] = current.shift();
    columns = ordered;
  }
  function updateAllTitles(gridMenuOptions) {
    _columnTitleElm && _columnTitleElm.innerHTML && (_columnTitleElm.innerHTML = gridMenuOptions.columnTitle);
  }
  function updateColumn(e) {
    if (e.target.dataset.option === "autoresize") {
      var previousVisibleColumns = getVisibleColumns(), isChecked = e.target.checked;
      _grid.setOptions({ forceFitColumns: isChecked }), _grid.setColumns(previousVisibleColumns);
      return;
    }
    if (e.target.dataset.option === "syncresize") {
      e.target.checked ? _grid.setOptions({ syncColumnCellResize: !0 }) : _grid.setOptions({ syncColumnCellResize: !1 });
      return;
    }
    if (e.target.type === "checkbox") {
      let isChecked2 = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
      if (columnCheckboxes.forEach((columnCheckbox, idx) => {
        columns[idx].hidden !== void 0 && (columns[idx].hidden = !columnCheckbox.checked), columnCheckbox.checked && visibleColumns.push(columns[idx]);
      }), !visibleColumns.length) {
        e.target.checked = !0;
        return;
      }
      _grid.setColumns(visibleColumns), onColumnsChanged.notify({ columnId, showing: isChecked2, allColumns: columns, columns: visibleColumns, grid: _grid });
    }
  }
  function setColumnVisibiliy(idxOrId, show2) {
    var idx = typeof idxOrId == "number" ? idxOrId : getColumnIndexbyId(idxOrId), sVisible = !!_grid.getColumnIndex(columns[idx].id), visibleColumns = getVisibleColumns(), col = columns[idx];
    if (show2)
      col.hidden = !1, visibleColumns.splice(idx, 0, col);
    else {
      let newVisibleColumns = [];
      for (let i2 = 0; i2 < visibleColumns.length; i2++)
        visibleColumns[i2].id !== col.id && newVisibleColumns.push(visibleColumns[i2]);
      visibleColumns = newVisibleColumns;
    }
    _grid.setColumns(visibleColumns), onColumnsChanged.notify({ columnId: col.id, showing: show2, allColumns: columns, columns: visibleColumns, grid: _grid });
  }
  function getAllColumns() {
    return columns;
  }
  function getColumnbyId(id) {
    for (let i2 = 0; i2 < columns.length; i2++)
      if (columns[i2].id === id)
        return columns[i2];
    return null;
  }
  function getColumnIndexbyId(id) {
    for (let i2 = 0; i2 < columns.length; i2++)
      if (columns[i2].id === id)
        return i2;
    return -1;
  }
  function getVisibleColumns() {
    return _grid.getColumns();
  }
  return init(_grid), {
    init,
    getAllColumns,
    getColumnbyId,
    getColumnIndexbyId,
    getVisibleColumns,
    destroy,
    updateAllTitles,
    onColumnsChanged,
    setColumnVisibiliy
  };
}

// src/controls/slick.gridmenu.js
var BindingEventService4 = BindingEventService, SlickEvent4 = Event, Utils7 = Utils;
function SlickGridMenu(columns, grid, options) {
  var _grid = grid, _gridOptions, _gridUid = grid && grid.getUID ? grid.getUID() : "", _isMenuOpen = !1, _options = options, _self = this, _columnTitleElm, _customTitleElm, _customMenuElm, _headerElm, _listElm, _buttonElm, _menuElm, columnCheckboxes, _defaults = {
    showButton: !0,
    hideForceFitButton: !1,
    hideSyncResizeButton: !1,
    forceFitTitle: "Force fit columns",
    marginBottom: 15,
    menuWidth: 18,
    contentMinWidth: 0,
    resizeOnShowHeaderRow: !1,
    syncResizeTitle: "Synchronous resize",
    useClickToRepositionMenu: !0,
    headerColumnValueExtractor: function(columnDef) {
      return columnDef.name;
    }
  }, _bindingEventService = new BindingEventService4();
  grid.onSetOptions.subscribe(function(e, args) {
    if (args && args.optionsBefore && args.optionsAfter) {
      var switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
      (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && recreateGridMenu();
    }
  });
  function init(grid2) {
    _gridOptions = grid2.getOptions(), createGridMenu(), grid2.onBeforeDestroy.subscribe(destroy);
  }
  function setOptions(newOptions) {
    options = Utils7.extend({}, options, newOptions);
  }
  function createGridMenu() {
    var gridMenuWidth = _options.gridMenu && _options.gridMenu.menuWidth || _defaults.menuWidth;
    _gridOptions && _gridOptions.hasOwnProperty("frozenColumn") && _gridOptions.frozenColumn >= 0 ? _headerElm = document.querySelector(`.${_gridUid} .slick-header-right`) : _headerElm = document.querySelector(`.${_gridUid} .slick-header-left`), _headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`;
    var enableResizeHeaderRow = _options.gridMenu && _options.gridMenu.resizeOnShowHeaderRow != null ? _options.gridMenu.resizeOnShowHeaderRow : _defaults.resizeOnShowHeaderRow;
    if (enableResizeHeaderRow && _options.showHeaderRow) {
      let headerRow = document.querySelector(`.${_gridUid}.slick-headerrow`);
      headerRow && (headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`);
    }
    var showButton = _options.gridMenu && _options.gridMenu.showButton !== void 0 ? _options.gridMenu.showButton : _defaults.showButton;
    if (showButton) {
      if (_buttonElm = document.createElement("button"), _buttonElm.className = "slick-gridmenu-button", _buttonElm.ariaLabel = "Grid Menu", _options.gridMenu && _options.gridMenu.iconImage) {
        let iconImageElm = document.createElement("img");
        iconImageElm.src = _options.gridMenu.iconImage, _buttonElm.appendChild(iconImageElm);
      } else
        _options.gridMenu && _options.gridMenu.iconCssClass ? _buttonElm.classList.add(..._options.gridMenu.iconCssClass.split(" ")) : _buttonElm.classList.add("sgi", "sgi-menu");
      options.iconCssClass && _buttonElm.classList.add(...options.iconCssClass.split(" ")), _headerElm.parentElement.insertBefore(_buttonElm, _headerElm.parentElement.firstChild), _bindingEventService.bind(_buttonElm, "click", showGridMenu);
    }
    _menuElm = document.createElement("div"), _menuElm.className = `slick-gridmenu ${_gridUid}`, _menuElm.style.display = "none", document.body.appendChild(_menuElm);
    let buttonElm = document.createElement("button");
    buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-gridmenu", buttonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), _menuElm.appendChild(buttonElm), _customMenuElm = document.createElement("div"), _customMenuElm.className = "slick-gridmenu-custom", _customMenuElm.role = "menu", _menuElm.appendChild(_customMenuElm), populateCustomMenus(_options, _customMenuElm), populateColumnPicker(), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown), _bindingEventService.bind(document.body, "beforeunload", destroy);
  }
  function destroy() {
    _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onColumnsChanged.unsubscribe(), _grid.onColumnsReordered.unsubscribe(updateColumnOrder), _grid.onBeforeDestroy.unsubscribe(), _grid.onSetOptions.unsubscribe(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), deleteMenu();
  }
  function deleteMenu() {
    _bindingEventService.unbindAll();
    let gridMenuElm = document.querySelector(`div.slick-gridmenu.${_gridUid}`);
    gridMenuElm && (gridMenuElm.style.display = "none"), _headerElm && (_headerElm.style.width = "100%"), _buttonElm && _buttonElm.remove(), _menuElm && _menuElm.remove();
  }
  function populateCustomMenus(options2, customMenuElm) {
    if (!(!options2.gridMenu || !options2.gridMenu.customItems)) {
      _options.gridMenu && _options.gridMenu.customTitle && (_customTitleElm = document.createElement("div"), _customTitleElm.className = "title", _customTitleElm.innerHTML = _options.gridMenu.customTitle, customMenuElm.appendChild(_customTitleElm));
      for (let i2 = 0, ln = options2.gridMenu.customItems.length; i2 < ln; i2++) {
        let addClickListener = !0, item = options2.gridMenu.customItems[i2], callbackArgs = {
          grid: _grid,
          menu: _menuElm,
          columns,
          visibleColumns: getVisibleColumns()
        }, isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-gridmenu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-gridmenu-item-divider"), addClickListener = !1), item.disabled && liElm.classList.add("slick-gridmenu-item-disabled"), item.hidden && liElm.classList.add("slick-gridmenu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.className = "slick-gridmenu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-gridmenu-content", textElm.innerHTML = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), customMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemClick.bind(this, item));
      }
    }
  }
  function populateColumnPicker() {
    _grid.onColumnsReordered.subscribe(updateColumnOrder), _options = Utils7.extend({}, _defaults, _options), _options.gridMenu && _options.gridMenu.columnTitle && (_columnTitleElm = document.createElement("div"), _columnTitleElm.className = "title", _columnTitleElm.innerHTML = _options.gridMenu.columnTitle, _menuElm.appendChild(_columnTitleElm)), _bindingEventService.bind(_menuElm, "click", updateColumn), _listElm = document.createElement("span"), _listElm.className = "slick-gridmenu-list", _listElm.role = "menu";
  }
  function recreateGridMenu() {
    deleteMenu(), init(_grid);
  }
  function showGridMenu(e) {
    var targetEvent = e.touches ? e.touches[0] : e;
    e.preventDefault(), Utils7.emptyElement(_listElm), Utils7.emptyElement(_customMenuElm), populateCustomMenus(_options, _customMenuElm), updateColumnOrder(), columnCheckboxes = [];
    var callbackArgs = {
      grid: _grid,
      menu: _menuElm,
      allColumns: columns,
      visibleColumns: getVisibleColumns()
    };
    if (_options && _options.gridMenu && !runOverrideFunctionWhenExists(_options.gridMenu.menuUsabilityOverride, callbackArgs) || typeof e.stopPropagation == "function" && _self.onBeforeMenuShow.notify(callbackArgs, e, _self).getReturnValue() == !1)
      return;
    let columnId, columnLabel, excludeCssClass;
    for (let i2 = 0; i2 < columns.length; i2++) {
      columnId = columns[i2].id, excludeCssClass = columns[i2].excludeFromGridMenu ? "hidden" : "";
      let liElm = document.createElement("li");
      liElm.className = excludeCssClass, liElm.ariaLabel = columns[i2] && columns[i2].name;
      let checkboxElm = document.createElement("input");
      checkboxElm.type = "checkbox", checkboxElm.id = `${_gridUid}-gridmenu-colpicker-${columnId}`, checkboxElm.dataset.columnid = columns[i2].id, liElm.appendChild(checkboxElm), _grid.getColumnIndex(columns[i2].id) != null && !columns[i2].hidden && (checkboxElm.checked = !0), columnCheckboxes.push(checkboxElm), _options && _options.gridMenu && _options.gridMenu.headerColumnValueExtractor ? columnLabel = _options.gridMenu.headerColumnValueExtractor(columns[i2], _gridOptions) : columnLabel = _defaults.headerColumnValueExtractor(columns[i2], _gridOptions);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-${columnId}`, labelElm.innerHTML = columnLabel, liElm.appendChild(labelElm), _listElm.appendChild(liElm);
    }
    if (_options.gridMenu && (!_options.gridMenu.hideForceFitButton || !_options.gridMenu.hideSyncResizeButton) && _listElm.appendChild(document.createElement("hr")), !(_options.gridMenu && _options.gridMenu.hideForceFitButton)) {
      let forceFitTitle = _options.gridMenu && _options.gridMenu.forceFitTitle || _defaults.forceFitTitle, liElm = document.createElement("li");
      liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", _listElm.appendChild(liElm);
      let forceFitCheckboxElm = document.createElement("input");
      forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), _grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
    }
    if (!(_options.gridMenu && _options.gridMenu.hideSyncResizeButton)) {
      let syncResizeTitle = _options.gridMenu && _options.gridMenu.syncResizeTitle || _defaults.syncResizeTitle, liElm = document.createElement("li");
      liElm.ariaLabel = syncResizeTitle, _listElm.appendChild(liElm);
      let syncResizeCheckboxElm = document.createElement("input");
      syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${_gridUid}-gridmenu-colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${_gridUid}-gridmenu-colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), _grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
    }
    let buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
    buttonElm || (buttonElm = e.target.parentElement), _menuElm.style.display = "block", _menuElm.style.opacity = "0";
    let menuIconOffset = Utils7.offset(buttonElm), menuWidth = _menuElm.offsetWidth, useClickToRepositionMenu = _options.gridMenu && _options.gridMenu.useClickToRepositionMenu !== void 0 ? _options.gridMenu.useClickToRepositionMenu : _defaults.useClickToRepositionMenu, contentMinWidth = _options.gridMenu && _options.gridMenu.contentMinWidth ? _options.gridMenu.contentMinWidth : _defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, nextPositionTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, nextPositionLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10, menuMarginBottom = _options.gridMenu && _options.gridMenu.marginBottom !== void 0 ? _options.gridMenu.marginBottom : _defaults.marginBottom;
    _menuElm.style.top = `${nextPositionTop + 10}px`, _menuElm.style.left = `${nextPositionLeft - currentMenuWidth + 10}px`, contentMinWidth > 0 && (_menuElm.style.minWidth = `${contentMinWidth}px`), _options.gridMenu && _options.gridMenu.height !== void 0 ? _menuElm.style.height = `${_options.gridMenu.height}px` : _menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`, _menuElm.style.display = "block", _menuElm.style.opacity = "1", _menuElm.appendChild(_listElm), _isMenuOpen = !0, typeof e.stopPropagation == "function" && _self.onAfterMenuShow.notify(callbackArgs, e, _self).getReturnValue() == !1;
  }
  function handleBodyMouseDown(event) {
    (_menuElm !== event.target && !(_menuElm && _menuElm.contains(event.target)) && _isMenuOpen || event.target.className === "close") && hideMenu(event);
  }
  function handleMenuItemClick(item, e) {
    let command = item.command || "";
    if (!(item.disabled || item.divider || item === "divider")) {
      if (command != null && command != "") {
        var callbackArgs = {
          grid: _grid,
          command,
          item,
          allColumns: columns,
          visibleColumns: getVisibleColumns()
        };
        _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
      }
      var leaveOpen = !!(_options.gridMenu && _options.gridMenu.leaveOpen);
      !leaveOpen && !e.defaultPrevented && hideMenu(e), e.preventDefault(), e.stopPropagation();
    }
  }
  function hideMenu(e) {
    if (_menuElm) {
      Utils7.hide(_menuElm), _isMenuOpen = !1;
      var callbackArgs = {
        grid: _grid,
        menu: _menuElm,
        allColumns: columns,
        visibleColumns: getVisibleColumns()
      };
      if (_self.onMenuClose.notify(callbackArgs, e, _self).getReturnValue() == !1)
        return;
    }
  }
  function updateAllTitles(gridMenuOptions) {
    _customTitleElm && _customTitleElm.innerHTML && (_customTitleElm.innerHTML = gridMenuOptions.customTitle), _columnTitleElm && _columnTitleElm.innerHTML && (_columnTitleElm.innerHTML = gridMenuOptions.columnTitle);
  }
  function updateColumnOrder() {
    for (var current = _grid.getColumns().slice(0), ordered = new Array(columns.length), i2 = 0; i2 < ordered.length; i2++)
      _grid.getColumnIndex(columns[i2].id) === void 0 ? ordered[i2] = columns[i2] : ordered[i2] = current.shift();
    columns = ordered;
  }
  function updateColumn(e) {
    if (e.target.dataset.option === "autoresize") {
      var previousVisibleColumns = getVisibleColumns(), isChecked = e.target.checked;
      _grid.setOptions({ forceFitColumns: isChecked }), _grid.setColumns(previousVisibleColumns);
      return;
    }
    if (e.target.dataset.option === "syncresize") {
      _grid.setOptions({ syncColumnCellResize: !!e.target.checked });
      return;
    }
    if (e.target.type === "checkbox") {
      let isChecked2 = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
      if (columnCheckboxes.forEach((columnCheckbox, idx) => {
        columnCheckbox.checked && (columns[idx].hidden && (columns[idx].hidden = !1), visibleColumns.push(columns[idx]));
      }), !visibleColumns.length) {
        e.target.checked = !0;
        return;
      }
      let callbackArgs = {
        columnId,
        showing: isChecked2,
        grid: _grid,
        allColumns: columns,
        columns: visibleColumns
      };
      _grid.setColumns(visibleColumns), _self.onColumnsChanged.notify(callbackArgs, e, _self);
    }
  }
  init(_grid);
  function getAllColumns() {
    return columns;
  }
  function getVisibleColumns() {
    return _grid.getColumns();
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  Utils7.extend(this, {
    init,
    getAllColumns,
    getVisibleColumns,
    destroy,
    deleteMenu,
    recreateGridMenu,
    showGridMenu,
    setOptions,
    updateAllTitles,
    hideMenu,
    onAfterMenuShow: new SlickEvent4(),
    onBeforeMenuShow: new SlickEvent4(),
    onMenuClose: new SlickEvent4(),
    onCommand: new SlickEvent4(),
    onColumnsChanged: new SlickEvent4()
  });
}

// src/controls/slick.pager.js
var BindingEventService5 = BindingEventService, GlobalEditorLock3 = GlobalEditorLock, Utils8 = Utils;
function SlickGridPager(dataView, grid, selectorOrElm, options) {
  let container = getContainerElement(selectorOrElm), statusElm, _options, _defaults = {
    showAllText: "Showing all {rowCount} rows",
    showPageText: "Showing page {pageNum} of {pageCount}",
    showCountText: "From {countBegin} to {countEnd} of {rowCount} rows",
    showCount: !1,
    pagingOptions: [
      { data: 0, name: "All", ariaLabel: "Show All Pages" },
      { data: -1, name: "Auto", ariaLabel: "Auto Page Size" },
      { data: 25, name: "25", ariaLabel: "Show 25 rows per page" },
      { data: 50, name: "50", ariaLabel: "Show 50 rows per page" },
      { data: 100, name: "100", ariaLabel: "Show 100 rows per page" }
    ],
    showPageSizes: !1
  };
  var _bindingEventService = new BindingEventService5();
  function init() {
    _options = Utils8.extend(!0, {}, _defaults, options), dataView.onPagingInfoChanged.subscribe(function(e, pagingInfo) {
      updatePager(pagingInfo);
    }), constructPagerUI(), updatePager(dataView.getPagingInfo());
  }
  function destroy() {
    setPageSize(0), _bindingEventService.unbindAll(), container.innerHTML = "";
  }
  function getNavState() {
    let cannotLeaveEditMode = !GlobalEditorLock3.commitCurrentEdit(), pagingInfo = dataView.getPagingInfo(), lastPage = pagingInfo.totalPages - 1;
    return {
      canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
      canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
      pagingInfo
    };
  }
  function setPageSize(n) {
    dataView.setRefreshHints({
      isFilterUnchanged: !0
    }), dataView.setPagingOptions({ pageSize: n });
  }
  function gotoFirst() {
    getNavState().canGotoFirst && dataView.setPagingOptions({ pageNum: 0 });
  }
  function gotoLast() {
    let state = getNavState();
    state.canGotoLast && dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
  }
  function gotoPrev() {
    let state = getNavState();
    state.canGotoPrev && dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
  }
  function gotoNext() {
    let state = getNavState();
    state.canGotoNext && dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
  }
  function getContainerElement(selectorOrElm2) {
    return typeof selectorOrElm2 == "string" ? document.querySelector(selectorOrElm2) : typeof selectorOrElm2 == "object" && selectorOrElm2[0] ? selectorOrElm2[0] : selectorOrElm2;
  }
  function constructPagerUI() {
    let container2 = getContainerElement(selectorOrElm);
    if (!container2 || container2.jquery && !container2[0])
      return;
    let navElm = document.createElement("span");
    navElm.className = "slick-pager-nav";
    let settingsElm = document.createElement("span");
    settingsElm.className = "slick-pager-settings", statusElm = document.createElement("span"), statusElm.className = "slick-pager-status";
    let pagerSettingsElm = document.createElement("span");
    pagerSettingsElm.className = "slick-pager-settings-expanded", pagerSettingsElm.textContent = "Show: ";
    for (let o = 0; o < _options.pagingOptions.length; o++) {
      let p = _options.pagingOptions[o], anchorElm = document.createElement("a");
      anchorElm.textContent = p.name, anchorElm.ariaLabel = p.ariaLabel, anchorElm.dataset.val = p.data, pagerSettingsElm.appendChild(anchorElm), _bindingEventService.bind(anchorElm, "click", function(e) {
        let pagesize = e.target.dataset.val;
        if (pagesize !== void 0)
          if (Number(pagesize) === -1) {
            let vp = grid.getViewport();
            setPageSize(vp.bottom - vp.top);
          } else
            setPageSize(parseInt(pagesize));
      });
    }
    pagerSettingsElm.style.display = _options.showPageSizes ? "block" : "none", settingsElm.appendChild(pagerSettingsElm);
    let displayPaginationContainer = document.createElement("span"), displayIconElm = document.createElement("span");
    displayPaginationContainer.className = "sgi-container", displayIconElm.ariaLabel = "Show Pagination Options", displayIconElm.role = "button", displayIconElm.className = "sgi sgi-lightbulb", displayPaginationContainer.appendChild(displayIconElm), _bindingEventService.bind(displayIconElm, "click", () => {
      let styleDisplay = pagerSettingsElm.style.display;
      pagerSettingsElm.style.display = styleDisplay === "none" ? "inline-flex" : "none";
    }), settingsElm.appendChild(displayPaginationContainer), [
      { key: "start", ariaLabel: "First Page", callback: gotoFirst },
      { key: "left", ariaLabel: "Previous Page", callback: gotoPrev },
      { key: "right", ariaLabel: "Next Page", callback: gotoNext },
      { key: "end", ariaLabel: "Last Page", callback: gotoLast }
    ].forEach((pageBtn) => {
      let iconElm = document.createElement("span");
      iconElm.className = "sgi-container";
      let innerIconElm = document.createElement("span");
      innerIconElm.role = "button", innerIconElm.ariaLabel = pageBtn.ariaLabel, innerIconElm.className = `sgi sgi-chevron-${pageBtn.key}`, _bindingEventService.bind(innerIconElm, "click", pageBtn.callback), iconElm.appendChild(innerIconElm), navElm.appendChild(iconElm);
    });
    let slickPagerElm = document.createElement("div");
    slickPagerElm.className = "slick-pager", slickPagerElm.appendChild(navElm), slickPagerElm.appendChild(statusElm), slickPagerElm.appendChild(settingsElm), container2.appendChild(slickPagerElm);
  }
  function updatePager(pagingInfo) {
    if (!container || container.jquery && !container[0])
      return;
    let state = getNavState();
    if (container.querySelectorAll(".slick-pager-nav span").forEach((pagerIcon) => pagerIcon.classList.remove("sgi-state-disabled")), state.canGotoFirst || container.querySelector(".sgi-chevron-start").classList.add("sgi-state-disabled"), state.canGotoLast || container.querySelector(".sgi-chevron-end").classList.add("sgi-state-disabled"), state.canGotoNext || container.querySelector(".sgi-chevron-right").classList.add("sgi-state-disabled"), state.canGotoPrev || container.querySelector(".sgi-chevron-left").classList.add("sgi-state-disabled"), pagingInfo.pageSize === 0 ? statusElm.textContent = _options.showAllText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{pageCount}", pagingInfo.totalPages + "") : statusElm.textContent = _options.showPageText.replace("{pageNum}", pagingInfo.pageNum + 1 + "").replace("{pageCount}", pagingInfo.totalPages + ""), _options.showCount && pagingInfo.pageSize !== 0) {
      let pageBegin = pagingInfo.pageNum * pagingInfo.pageSize, currentText = statusElm.textContent;
      currentText && (currentText += " - "), statusElm.textContent = currentText + _options.showCountText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{countBegin}", pageBegin + 1).replace("{countEnd}", Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows));
    }
  }
  init(), Utils8.extend(this, {
    init,
    destroy
  });
}

// src/plugins/slick.autotooltips.ts
var Utils9 = Utils;
function SlickAutoTooltips(options) {
  let _grid, _defaults = {
    enableForCells: !0,
    enableForHeaderCells: !1,
    maxToolTipLength: void 0,
    replaceExisting: !0
  };
  function init(grid) {
    options = Utils9.extend(!0, {}, _defaults, options), _grid = grid, options.enableForCells && _grid.onMouseEnter.subscribe(handleMouseEnter), options.enableForHeaderCells && _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
  }
  function destroy() {
    options.enableForCells && _grid.onMouseEnter.unsubscribe(handleMouseEnter), options.enableForHeaderCells && _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
  }
  function handleMouseEnter(event) {
    let cell = _grid.getCellFromEvent(event);
    if (cell) {
      let node = _grid.getCellNode(cell.row, cell.cell), text;
      options && node && (!node.title || options?.replaceExisting) && (node.clientWidth < node.scrollWidth ? (text = node.textContent?.trim() ?? "", options && options.maxToolTipLength && text.length > options.maxToolTipLength && (text = text.substring(0, options.maxToolTipLength - 3) + "...")) : text = "", node.title = text), node = null;
    }
  }
  function handleHeaderMouseEnter(event, args) {
    let column = args.column, node, targetElm = event.target;
    targetElm && (node = targetElm.closest(".slick-header-column"), node && !(column && column.toolTip) && (node.title = targetElm.clientWidth < node.clientWidth ? column?.name ?? "" : "")), node = null;
  }
  return {
    init,
    destroy,
    pluginName: "AutoTooltips"
  };
}

// src/plugins/slick.cellcopymanager.js
var keyCode5 = keyCode, SlickEvent5 = Event, Utils10 = Utils;
function CellCopyManager() {
  var _grid, _self = this, _copiedRanges;
  function init(grid) {
    _grid = grid, _grid.onKeyDown.subscribe(handleKeyDown);
  }
  function destroy() {
    _grid.onKeyDown.unsubscribe(handleKeyDown);
  }
  function handleKeyDown(e) {
    var ranges;
    _grid.getEditorLock().isActive() || (e.which == keyCode5.ESCAPE && _copiedRanges && (e.preventDefault(), clearCopySelection(), _self.onCopyCancelled.notify({ ranges: _copiedRanges }), _copiedRanges = null), e.which == 67 && (e.ctrlKey || e.metaKey) && (ranges = _grid.getSelectionModel().getSelectedRanges(), ranges.length !== 0 && (e.preventDefault(), _copiedRanges = ranges, markCopySelection(ranges), _self.onCopyCells.notify({ ranges }))), e.which == 86 && (e.ctrlKey || e.metaKey) && _copiedRanges && (e.preventDefault(), ranges = _grid.getSelectionModel().getSelectedRanges(), _self.onPasteCells.notify({ from: _copiedRanges, to: ranges }), _grid.getOptions().preserveCopiedSelectionOnPaste || (clearCopySelection(), _copiedRanges = null)));
  }
  function markCopySelection(ranges) {
    for (var columns = _grid.getColumns(), hash = {}, i2 = 0; i2 < ranges.length; i2++)
      for (var j = ranges[i2].fromRow; j <= ranges[i2].toRow; j++) {
        hash[j] = {};
        for (var k = ranges[i2].fromCell; k <= ranges[i2].toCell; k++)
          hash[j][columns[k].id] = "copied";
      }
    _grid.setCellCssStyles("copy-manager", hash);
  }
  function clearCopySelection() {
    _grid.removeCellCssStyles("copy-manager");
  }
  Utils10.extend(this, {
    init,
    destroy,
    pluginName: "CellCopyManager",
    clearCopySelection,
    onCopyCells: new SlickEvent5(),
    onCopyCancelled: new SlickEvent5(),
    onPasteCells: new SlickEvent5()
  });
}

// src/plugins/slick.cellexternalcopymanager.js
var SlickEvent6 = Event, Utils11 = Utils;
function CellExternalCopyManager(options) {
  var _grid, _self = this, _copiedRanges, _options = options || {}, _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager", _copiedCellStyle = _options.copiedCellStyle || "copied", _clearCopyTI = 0, _bodyElement = _options.bodyElement || document.body, _onCopyInit = _options.onCopyInit || null, _onCopySuccess = _options.onCopySuccess || null, keyCodes = {
    C: 67,
    V: 86,
    ESC: 27,
    INSERT: 45
  };
  function init(grid) {
    _grid = grid, _grid.onKeyDown.subscribe(handleKeyDown);
    var cellSelectionModel = grid.getSelectionModel();
    if (!cellSelectionModel)
      throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
    cellSelectionModel.onSelectedRangesChanged.subscribe(() => {
      _grid.getEditorLock().isActive() || _grid.focus();
    });
  }
  function destroy() {
    _grid.onKeyDown.unsubscribe(handleKeyDown);
  }
  function getHeaderValueForColumn(columnDef) {
    if (_options.headerColumnValueExtractor) {
      var val = _options.headerColumnValueExtractor(columnDef);
      if (val)
        return val;
    }
    return columnDef.name;
  }
  function getDataItemValueForColumn(item, columnDef, event) {
    if (typeof _options.dataItemColumnValueExtractor == "function") {
      let val = _options.dataItemColumnValueExtractor(item, columnDef);
      if (val)
        return val;
    }
    let retVal = "";
    if (columnDef && columnDef.editor) {
      let tmpP = document.createElement("p"), editor = new columnDef.editor({
        container: tmpP,
        // a dummy container
        column: columnDef,
        event,
        position: { top: 0, left: 0 },
        // a dummy position required by some editors
        grid: _grid
      });
      editor.loadValue(item), retVal = editor.serializeValue(), editor.destroy(), tmpP.remove();
    } else
      retVal = item[columnDef.field || ""];
    return retVal;
  }
  function setDataItemValueForColumn(item, columnDef, value) {
    if (columnDef.denyPaste)
      return null;
    if (_options.dataItemColumnValueSetter)
      return _options.dataItemColumnValueSetter(item, columnDef, value);
    if (columnDef.editor) {
      let tmpDiv = document.createElement("div"), editor = new columnDef.editor({
        container: tmpDiv,
        // a dummy container
        column: columnDef,
        position: { top: 0, left: 0 },
        // a dummy position required by some editors
        grid: _grid
      });
      editor.loadValue(item), editor.applyValue(item, value), editor.destroy(), tmpDiv.remove();
    } else
      item[columnDef.field] = value;
  }
  function _createTextBox(innerText) {
    var ta = document.createElement("textarea");
    return ta.style.position = "absolute", ta.style.left = "-1000px", ta.style.top = document.body.scrollTop + "px", ta.value = innerText, _bodyElement.appendChild(ta), ta.select(), ta;
  }
  function _decodeTabularData(_grid2, ta) {
    var columns = _grid2.getColumns(), clipText = ta.value, clipRows = clipText.split(/[\n\f\r]/);
    clipRows[clipRows.length - 1] === "" && clipRows.pop();
    var clippedRange = [], j = 0;
    _bodyElement.removeChild(ta);
    for (var i2 = 0; i2 < clipRows.length; i2++)
      clipRows[i2] !== "" ? clippedRange[j++] = clipRows[i2].split("	") : clippedRange[j++] = [""];
    var selectedCell = _grid2.getActiveCell(), ranges = _grid2.getSelectionModel().getSelectedRanges(), selectedRange = ranges && ranges.length ? ranges[0] : null, activeRow = null, activeCell = null;
    if (selectedRange)
      activeRow = selectedRange.fromRow, activeCell = selectedRange.fromCell;
    else if (selectedCell)
      activeRow = selectedCell.row, activeCell = selectedCell.cell;
    else
      return;
    var oneCellToMultiple = !1, destH = clippedRange.length, destW = clippedRange.length ? clippedRange[0].length : 0;
    clippedRange.length == 1 && clippedRange[0].length == 1 && selectedRange && (oneCellToMultiple = !0, destH = selectedRange.toRow - selectedRange.fromRow + 1, destW = selectedRange.toCell - selectedRange.fromCell + 1);
    var availableRows = _grid2.getData().length - activeRow, addRows = 0;
    if (availableRows < destH && _options.newRowCreator) {
      var d = _grid2.getData();
      for (addRows = 1; addRows <= destH - availableRows; addRows++)
        d.push({});
      _grid2.setData(d), _grid2.render();
    }
    var overflowsBottomOfGrid = activeRow + destH > _grid2.getDataLength();
    if (_options.newRowCreator && overflowsBottomOfGrid) {
      var newRowsNeeded = activeRow + destH - _grid2.getDataLength();
      _options.newRowCreator(newRowsNeeded);
    }
    var clipCommand = {
      isClipboardCommand: !0,
      clippedRange,
      oldValues: [],
      cellExternalCopyManager: _self,
      _options,
      setDataItemValueForColumn,
      markCopySelection,
      oneCellToMultiple,
      activeRow,
      activeCell,
      destH,
      destW,
      maxDestY: _grid2.getDataLength(),
      maxDestX: _grid2.getColumns().length,
      h: 0,
      w: 0,
      execute: function() {
        this.h = 0;
        for (var y = 0; y < this.destH; y++) {
          this.oldValues[y] = [], this.w = 0, this.h++;
          for (var x = 0; x < this.destW; x++) {
            this.w++;
            var desty = activeRow + y, destx = activeCell + x;
            if (desty < this.maxDestY && destx < this.maxDestX) {
              var nd = _grid2.getCellNode(desty, destx), dt = _grid2.getDataItem(desty);
              this.oldValues[y][x] = dt[columns[destx].field], oneCellToMultiple ? this.setDataItemValueForColumn(dt, columns[destx], clippedRange[0][0]) : this.setDataItemValueForColumn(dt, columns[destx], clippedRange[y] ? clippedRange[y][x] : ""), _grid2.updateCell(desty, destx), _grid2.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid: _grid2
              });
            }
          }
        }
        var bRange = {
          fromCell: activeCell,
          fromRow: activeRow,
          toCell: activeCell + this.w - 1,
          toRow: activeRow + this.h - 1
        };
        this.markCopySelection([bRange]), _grid2.getSelectionModel().setSelectedRanges([bRange]), this.cellExternalCopyManager.onPasteCells.notify({ ranges: [bRange] });
      },
      undo: function() {
        for (var y = 0; y < this.destH; y++)
          for (var x = 0; x < this.destW; x++) {
            var desty = activeRow + y, destx = activeCell + x;
            if (desty < this.maxDestY && destx < this.maxDestX) {
              var nd = _grid2.getCellNode(desty, destx), dt = _grid2.getDataItem(desty);
              oneCellToMultiple ? this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[0][0]) : this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[y][x]), _grid2.updateCell(desty, destx), _grid2.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid: _grid2
              });
            }
          }
        var bRange = {
          fromCell: activeCell,
          fromRow: activeRow,
          toCell: activeCell + this.w - 1,
          toRow: activeRow + this.h - 1
        };
        if (this.markCopySelection([bRange]), _grid2.getSelectionModel().setSelectedRanges([bRange]), this.cellExternalCopyManager.onPasteCells.notify({ ranges: [bRange] }), addRows > 1) {
          for (var d2 = _grid2.getData(); addRows > 1; addRows--)
            d2.splice(d2.length - 1, 1);
          _grid2.setData(d2), _grid2.render();
        }
      }
    };
    _options.clipboardCommandHandler ? _options.clipboardCommandHandler(clipCommand) : clipCommand.execute();
  }
  function handleKeyDown(e, args) {
    var ranges;
    if (!_grid.getEditorLock().isActive() || _grid.getOptions().autoEdit) {
      if (e.which == keyCodes.ESC && _copiedRanges && (e.preventDefault(), clearCopySelection(), _self.onCopyCancelled.notify({ ranges: _copiedRanges }), _copiedRanges = null), (e.which === keyCodes.C || e.which === keyCodes.INSERT) && (e.ctrlKey || e.metaKey) && !e.shiftKey && (_onCopyInit && _onCopyInit.call(), ranges = _grid.getSelectionModel().getSelectedRanges(), ranges.length !== 0)) {
        _copiedRanges = ranges, markCopySelection(ranges), _self.onCopyCells.notify({ ranges });
        for (var columns = _grid.getColumns(), clipText = "", rg = 0; rg < ranges.length; rg++) {
          for (var range = ranges[rg], clipTextRows = [], i2 = range.fromRow; i2 < range.toRow + 1; i2++) {
            var clipTextCells = [], dt = _grid.getDataItem(i2);
            if (clipTextRows.length === 0 && _options.includeHeaderWhenCopying) {
              for (var clipTextHeaders = [], j = range.fromCell; j < range.toCell + 1; j++)
                columns[j].name.length > 0 && !columns[j].hidden && clipTextHeaders.push(getHeaderValueForColumn(columns[j]));
              clipTextRows.push(clipTextHeaders.join("	"));
            }
            for (var j = range.fromCell; j < range.toCell + 1; j++)
              columns[j].name.length > 0 && !columns[j].hidden && clipTextCells.push(getDataItemValueForColumn(dt, columns[j], e));
            clipTextRows.push(clipTextCells.join("	"));
          }
          clipText += clipTextRows.join(`\r
`) + `\r
`;
        }
        if (window.clipboardData)
          return window.clipboardData.setData("Text", clipText), !0;
        var focusEl = document.activeElement, ta = _createTextBox(clipText);
        if (ta.focus(), setTimeout(function() {
          _bodyElement.removeChild(ta), focusEl ? focusEl.focus() : console.log("Not element to restore focus to after copy?");
        }, 100), _onCopySuccess) {
          var rowCount = 0;
          ranges.length === 1 ? rowCount = ranges[0].toRow + 1 - ranges[0].fromRow : rowCount = ranges.length, _onCopySuccess.call(this, rowCount);
        }
        return !1;
      }
      if (!_options.readOnlyMode && (e.which === keyCodes.V && (e.ctrlKey || e.metaKey) && !e.shiftKey || e.which === keyCodes.INSERT && e.shiftKey && !e.ctrlKey)) {
        var ta = _createTextBox("");
        return setTimeout(function() {
          _decodeTabularData(_grid, ta);
        }, 100), !1;
      }
    }
  }
  function markCopySelection(ranges) {
    clearCopySelection();
    for (var columns = _grid.getColumns(), hash = {}, i2 = 0; i2 < ranges.length; i2++)
      for (var j = ranges[i2].fromRow; j <= ranges[i2].toRow; j++) {
        hash[j] = {};
        for (var k = ranges[i2].fromCell; k <= ranges[i2].toCell && k < columns.length; k++)
          hash[j][columns[k].id] = _copiedCellStyle;
      }
    _grid.setCellCssStyles(_copiedCellStyleLayerKey, hash), clearTimeout(_clearCopyTI), _clearCopyTI = setTimeout(function() {
      _self.clearCopySelection();
    }, 2e3);
  }
  function clearCopySelection() {
    _grid.removeCellCssStyles(_copiedCellStyleLayerKey);
  }
  function setIncludeHeaderWhenCopying(includeHeaderWhenCopying) {
    _options.includeHeaderWhenCopying = includeHeaderWhenCopying;
  }
  Utils11.extend(this, {
    init,
    destroy,
    pluginName: "CellExternalCopyManager",
    clearCopySelection,
    handleKeyDown,
    onCopyCells: new SlickEvent6(),
    onCopyCancelled: new SlickEvent6(),
    onPasteCells: new SlickEvent6(),
    setIncludeHeaderWhenCopying
  });
}

// src/plugins/slick.cellmenu.js
var BindingEventService6 = BindingEventService, SlickEvent7 = Event, EventData4 = EventData, EventHandler2 = EventHandler, Utils12 = Utils;
function CellMenu(optionProperties) {
  let _cellMenuProperties, _currentCell = -1, _currentRow = -1, _grid, _gridOptions, _gridUid = "", _handler = new EventHandler2(), _self = this, _commandTitleElm, _optionTitleElm, _menuElm, _bindingEventService = new BindingEventService6(), _defaults = {
    autoAdjustDrop: !0,
    // dropup/dropdown
    autoAlignSide: !0,
    // left/right
    autoAdjustDropOffset: 0,
    autoAlignSideOffset: 0,
    hideMenuOnScroll: !0,
    maxHeight: "none",
    width: "auto"
  };
  function init(grid) {
    _grid = grid, _gridOptions = grid.getOptions(), _cellMenuProperties = Utils12.extend({}, _defaults, optionProperties), _gridUid = grid && grid.getUID ? grid.getUID() : "", _handler.subscribe(_grid.onClick, handleCellClick), _cellMenuProperties.hideMenuOnScroll && _handler.subscribe(_grid.onScroll, destroyMenu);
  }
  function setOptions(newOptions) {
    _cellMenuProperties = Utils12.extend({}, _cellMenuProperties, newOptions);
  }
  function destroy() {
    _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onBeforeMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onOptionSelected.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), _commandTitleElm = null, _optionTitleElm = null, _menuElm = null;
  }
  function createMenu(e) {
    let cell = _grid.getCellFromEvent(e);
    _currentCell = cell && cell.cell, _currentRow = cell && cell.row;
    let columnDef = _grid.getColumns()[_currentCell], dataContext = _grid.getDataItem(_currentRow), commandItems = _cellMenuProperties.commandItems || [], optionItems = _cellMenuProperties.optionItems || [];
    if (!columnDef || !columnDef.cellMenu || !commandItems.length && !optionItems.length || (destroyMenu(), _self.onBeforeMenuShow.notify({
      cell: _currentCell,
      row: _currentRow,
      grid: _grid
    }, e, _self).getReturnValue() == !1))
      return;
    let maxHeight = isNaN(_cellMenuProperties.maxHeight) ? _cellMenuProperties.maxHeight : _cellMenuProperties.maxHeight + "px", width2 = isNaN(_cellMenuProperties.width) ? _cellMenuProperties.width : _cellMenuProperties.width + "px";
    _menuElm = document.createElement("div"), _menuElm.className = `slick-cell-menu ${_gridUid}`, _menuElm.role = "menu", _menuElm.style.width = width2, _menuElm.style.maxHeight = maxHeight, _menuElm.style.top = `${e.pageY + 5}px`, _menuElm.style.left = `${e.pageX}px`, _menuElm.style.display = "none";
    let closeButtonElm = document.createElement("button");
    closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-cell-menu", closeButtonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !_cellMenuProperties.hideOptionSection && optionItems.length > 0) {
      let optionMenuElm = document.createElement("div");
      optionMenuElm.className = "slick-cell-menu-option-list", optionMenuElm.role = "menu", _cellMenuProperties.hideCloseButton || (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(optionMenuElm), populateOptionItems(
        _cellMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
      );
    }
    if (!_cellMenuProperties.hideCommandSection && commandItems.length > 0) {
      let commandMenuElm = document.createElement("div");
      commandMenuElm.className = "slick-cell-menu-command-list", commandMenuElm.role = "menu", !_cellMenuProperties.hideCloseButton && (optionItems.length === 0 || _cellMenuProperties.hideOptionSection) && (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(commandMenuElm), populateCommandItems(
        _cellMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
      );
    }
    if (_menuElm.style.display = "block", document.body.appendChild(_menuElm), _self.onAfterMenuShow.notify({
      cell: _currentCell,
      row: _currentRow,
      grid: _grid
    }, e, _self).getReturnValue() != !1)
      return _menuElm;
  }
  function handleCloseButtonClicked(e) {
    e.defaultPrevented || destroyMenu(e);
  }
  function destroyMenu(e, args) {
    if (_menuElm = _menuElm || document.querySelector(".slick-cell-menu." + _gridUid), _menuElm && _menuElm.remove) {
      if (_self.onBeforeMenuClose.notify({
        cell: args && args.cell,
        row: args && args.row,
        grid: _grid,
        menu: _menuElm
      }, e, _self).getReturnValue() == !1)
        return;
      _menuElm.remove(), _menuElm = null;
    }
  }
  function repositionMenu(e) {
    let parentElm = e.target.closest(".slick-cell"), parentOffset = parentElm && Utils12.offset(parentElm), menuOffsetLeft = parentElm ? parentOffset.left : e.pageX, menuOffsetTop = parentElm ? parentOffset.top : e.pageY, parentCellWidth = parentElm.offsetWidth || 0, menuHeight = _menuElm && _menuElm.offsetHeight || 0, menuWidth = _menuElm && _menuElm.offsetWidth || _cellMenuProperties.width || 0, rowHeight = _gridOptions.rowHeight, dropOffset = _cellMenuProperties.autoAdjustDropOffset, sideOffset = _cellMenuProperties.autoAlignSideOffset;
    if (_cellMenuProperties.autoAdjustDrop) {
      let spaceBottom = Utils12.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils12.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
      (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (_menuElm.classList.remove("dropdown"), _menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (_menuElm.classList.remove("dropup"), _menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
    }
    if (_cellMenuProperties.autoAlignSide) {
      let gridPos = _grid.getGridPosition();
      (menuOffsetLeft + menuWidth >= gridPos.width ? "left" : "right") === "left" ? (_menuElm.classList.remove("dropright"), _menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - (menuWidth - parentCellWidth) - sideOffset) : (_menuElm.classList.remove("dropleft"), _menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
    }
    _menuElm.style.top = `${menuOffsetTop}px`, _menuElm.style.left = `${menuOffsetLeft}px`;
  }
  function handleCellClick(e, args) {
    e instanceof EventData4 && (e = e.getNativeEvent());
    let cell = _grid.getCellFromEvent(e), dataContext = _grid.getDataItem(cell.row), columnDef = _grid.getColumns()[cell.cell];
    columnDef && columnDef.cellMenu && e.preventDefault(), _cellMenuProperties = Utils12.extend({}, _cellMenuProperties, columnDef.cellMenu), args || (args = {}), args.columnDef = columnDef, args.dataContext = dataContext, args.grid = _grid, runOverrideFunctionWhenExists(_cellMenuProperties.menuUsabilityOverride, args) && (_menuElm = createMenu(e, args), _menuElm && (repositionMenu(e), _menuElm.setAttribute("aria-expanded", "true"), _menuElm.style.display = "block"), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown.bind(this)));
  }
  function handleBodyMouseDown(e) {
    _menuElm != e.target && !(_menuElm && _menuElm.contains(e.target)) && (e.defaultPrevented || closeMenu(e, { cell: _currentCell, row: _currentRow }));
  }
  function closeMenu(e, args) {
    if (_menuElm) {
      if (_self.onBeforeMenuClose.notify({
        cell: args && args.cell,
        row: args && args.row,
        grid: _grid,
        menu: _menuElm
      }, e, _self).getReturnValue() == !1)
        return;
      _menuElm && _menuElm.remove && (_menuElm.remove(), _menuElm = null);
    }
  }
  function populateOptionItems(cellMenu, optionMenuElm, optionItems, args) {
    if (!(!args || !optionItems || !cellMenu)) {
      cellMenu && cellMenu.optionTitle && (_optionTitleElm = document.createElement("div"), _optionTitleElm.className = "title", _optionTitleElm.textContent = cellMenu.optionTitle, optionMenuElm.appendChild(_optionTitleElm));
      for (let i2 = 0, ln = optionItems.length; i2 < ln; i2++) {
        let addClickListener = !0, item = optionItems[i2], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-cell-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemOptionClick.bind(this, item));
      }
    }
  }
  function populateCommandItems(cellMenu, commandMenuElm, commandItems, args) {
    if (!(!args || !commandItems || !cellMenu)) {
      cellMenu && cellMenu.commandTitle && (_commandTitleElm = document.createElement("div"), _commandTitleElm.className = "title", _commandTitleElm.textContent = cellMenu.commandTitle, commandMenuElm.appendChild(_commandTitleElm));
      for (let i2 = 0, ln = commandItems.length; i2 < ln; i2++) {
        let addClickListener = !0, item = commandItems[i2], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-cell-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemCommandClick.bind(this, item));
      }
    }
  }
  function handleMenuItemCommandClick(item, e) {
    if (!item || item.disabled || item.divider || item === "divider")
      return;
    let command = item.command || "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row);
    if (command !== null && command !== "") {
      let callbackArgs = {
        cell,
        row,
        grid: _grid,
        command,
        item,
        column: columnDef,
        dataContext
      };
      _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || closeMenu(e, { cell, row });
    }
  }
  function handleMenuItemOptionClick(item, e) {
    if (!item || item.disabled || item.divider || item === "divider" || !_grid.getEditorLock().commitCurrentEdit())
      return;
    let option = item.option !== void 0 ? item.option : "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row);
    if (option !== void 0) {
      let callbackArgs = {
        cell,
        row,
        grid: _grid,
        option,
        item,
        column: columnDef,
        dataContext
      };
      _self.onOptionSelected.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || closeMenu(e, { cell, row });
    }
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  Utils12.extend(this, {
    init,
    closeMenu: destroyMenu,
    destroy,
    pluginName: "CellMenu",
    setOptions,
    onAfterMenuShow: new SlickEvent7(),
    onBeforeMenuShow: new SlickEvent7(),
    onBeforeMenuClose: new SlickEvent7(),
    onCommand: new SlickEvent7(),
    onOptionSelected: new SlickEvent7()
  });
}

// src/plugins/slick.cellrangedecorator.js
var Utils13 = Utils;
function CellRangeDecorator(grid, options) {
  var _elem, _defaults = {
    selectionCssClass: "slick-range-decorator",
    selectionCss: {
      zIndex: "9999",
      border: "2px dashed red"
    },
    offset: { top: -1, left: -1, height: -2, width: -2 }
  };
  options = Utils13.extend(!0, {}, _defaults, options);
  function show2(range) {
    if (!_elem) {
      _elem = document.createElement("div"), _elem.className = options.selectionCssClass, Object.keys(options.selectionCss).forEach((cssStyleKey) => {
        _elem.style[cssStyleKey] = options.selectionCss[cssStyleKey];
      }), _elem.style.position = "absolute";
      let canvasNode = grid.getActiveCanvasNode();
      canvasNode && canvasNode.appendChild(_elem);
    }
    var from = grid.getCellNodeBox(range.fromRow, range.fromCell), to = grid.getCellNodeBox(range.toRow, range.toCell);
    return from && to && options && options.offset && (_elem.style.top = `${from.top + options.offset.top}px`, _elem.style.left = `${from.left + options.offset.left}px`, _elem.style.height = `${to.bottom - from.top + options.offset.height}px`, _elem.style.width = `${to.right - from.left + options.offset.width}px`), _elem;
  }
  function destroy() {
    hide2();
  }
  function hide2() {
    _elem && (_elem.remove(), _elem = null);
  }
  Utils13.extend(this, {
    pluginName: "CellRangeDecorator",
    show: show2,
    hide: hide2,
    destroy
  });
}

// src/plugins/slick.cellrangeselector.js
var SlickEvent8 = Event, EventHandler3 = EventHandler, SlickRange2 = Range, Draggable3 = Draggable, CellRangeDecorator2 = CellRangeDecorator, Utils14 = Utils;
function CellRangeSelector(options) {
  var _grid, _currentlySelectedRange, _canvas, _gridOptions, _activeCanvas, _dragging, _decorator, _self = this, _handler = new EventHandler3(), _defaults = {
    autoScroll: !0,
    minIntervalToShowNextCell: 30,
    maxIntervalToShowNextCell: 600,
    // better to a multiple of minIntervalToShowNextCell
    accelerateInterval: 5,
    // increase 5ms when cursor 1px outside the viewport.
    selectionCss: {
      border: "2px dashed blue"
    }
  }, _rowOffset, _columnOffset, _isRightCanvas, _isBottomCanvas, _activeViewport, _viewportWidth, _viewportHeight, _draggingMouseOffset, _moveDistanceForOneCell, _autoScrollTimerId, _xDelayForNextCell, _yDelayForNextCell, _isRowMoveRegistered = !1, _scrollTop = 0, _scrollLeft = 0;
  function init(grid) {
    if (typeof Draggable3 > "u")
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    options = Utils14.extend(!0, {}, _defaults, options), _decorator = options.cellDecorator || new CellRangeDecorator2(grid, options), _grid = grid, _canvas = _grid.getCanvasNode(), _gridOptions = _grid.getOptions(), _handler.subscribe(_grid.onScroll, handleScroll).subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
  }
  function destroy() {
    _handler.unsubscribeAll(), _activeCanvas = null, _activeViewport = null, _canvas = null, _decorator && _decorator.destroy && _decorator.destroy();
  }
  function getCellDecorator() {
    return _decorator;
  }
  function handleScroll(e, args) {
    _scrollTop = args.scrollTop, _scrollLeft = args.scrollLeft;
  }
  function handleDragInit(e) {
    _activeCanvas = _grid.getActiveCanvasNode(e), _activeViewport = _grid.getActiveViewportNode(e);
    var scrollbarDimensions2 = _grid.getDisplayedScrollbarDimensions();
    if (_viewportWidth = _activeViewport.offsetWidth - scrollbarDimensions2.width, _viewportHeight = _activeViewport.offsetHeight - scrollbarDimensions2.height, _moveDistanceForOneCell = {
      x: _grid.getAbsoluteColumnMinWidth() / 2,
      y: _grid.getOptions().rowHeight / 2
    }, _isRowMoveRegistered = hasRowMoveManager(), _rowOffset = 0, _columnOffset = 0, _isBottomCanvas = _activeCanvas.classList.contains("grid-canvas-bottom"), _gridOptions.frozenRow > -1 && _isBottomCanvas) {
      let canvasSelector = `.${_grid.getUID()} .grid-canvas-${_gridOptions.frozenBottom ? "bottom" : "top"}`, canvasElm = document.querySelector(canvasSelector);
      canvasElm && (_rowOffset = canvasElm.clientHeight || 0);
    }
    if (_isRightCanvas = _activeCanvas.classList.contains("grid-canvas-right"), _gridOptions.frozenColumn > -1 && _isRightCanvas) {
      let canvasLeftElm = document.querySelector(`.${_grid.getUID()} .grid-canvas-left`);
      canvasLeftElm && (_columnOffset = canvasLeftElm.clientWidth || 0);
    }
    e.stopImmediatePropagation(), e.preventDefault();
  }
  function handleDragStart(e, dd) {
    var cell = _grid.getCellFromEvent(e);
    if (_self.onBeforeCellRangeSelected.notify(cell) !== !1 && _grid.canCellBeSelected(cell.row, cell.cell) && (_dragging = !0, e.stopImmediatePropagation()), !_dragging)
      return;
    _grid.focus();
    let canvasOffset = Utils14.offset(_canvas), startX = dd.startX - (canvasOffset.left || 0);
    _gridOptions.frozenColumn >= 0 && _isRightCanvas && (startX += _scrollLeft);
    let startY = dd.startY - (canvasOffset.top || 0);
    _gridOptions.frozenRow >= 0 && _isBottomCanvas && (startY += _scrollTop);
    var start = _grid.getCellFromPoint(startX, startY);
    return dd.range = { start, end: {} }, _currentlySelectedRange = dd.range, _decorator.show(new SlickRange2(start.row, start.cell));
  }
  function handleDrag(evt, dd) {
    if (!_dragging && !_isRowMoveRegistered)
      return;
    _isRowMoveRegistered || evt.stopImmediatePropagation();
    let e = evt.getNativeEvent();
    if (options.autoScroll && (_draggingMouseOffset = getMouseOffsetViewport(e, dd), _draggingMouseOffset.isOutsideViewport))
      return handleDragOutsideViewport();
    stopIntervalTimer(), handleDragTo(e, dd);
  }
  function getMouseOffsetViewport(e, dd) {
    var targetEvent = e.touches ? e.touches[0] : e, viewportLeft = _activeViewport.scrollLeft, viewportTop = _activeViewport.scrollTop, viewportRight = viewportLeft + _viewportWidth, viewportBottom = viewportTop + _viewportHeight, viewportOffset = Utils14.offset(_activeViewport), viewportOffsetLeft = viewportOffset.left || 0, viewportOffsetTop = viewportOffset.top || 0, viewportOffsetRight = viewportOffsetLeft + _viewportWidth, viewportOffsetBottom = viewportOffsetTop + _viewportHeight, result = {
      e,
      dd,
      viewport: {
        left: viewportLeft,
        top: viewportTop,
        right: viewportRight,
        bottom: viewportBottom,
        offset: {
          left: viewportOffsetLeft,
          top: viewportOffsetTop,
          right: viewportOffsetRight,
          bottom: viewportOffsetBottom
        }
      },
      // Consider the viewport as the origin, the `offset` is based on the coordinate system:
      // the cursor is on the viewport's left/bottom when it is less than 0, and on the right/top when greater than 0.
      offset: {
        x: 0,
        y: 0
      },
      isOutsideViewport: !1
    };
    return targetEvent.pageX < viewportOffsetLeft ? result.offset.x = targetEvent.pageX - viewportOffsetLeft : targetEvent.pageX > viewportOffsetRight && (result.offset.x = targetEvent.pageX - viewportOffsetRight), targetEvent.pageY < viewportOffsetTop ? result.offset.y = viewportOffsetTop - targetEvent.pageY : targetEvent.pageY > viewportOffsetBottom && (result.offset.y = viewportOffsetBottom - targetEvent.pageY), result.isOutsideViewport = !!result.offset.x || !!result.offset.y, result;
  }
  function handleDragOutsideViewport() {
    if (_xDelayForNextCell = options.maxIntervalToShowNextCell - Math.abs(_draggingMouseOffset.offset.x) * options.accelerateInterval, _yDelayForNextCell = options.maxIntervalToShowNextCell - Math.abs(_draggingMouseOffset.offset.y) * options.accelerateInterval, !_autoScrollTimerId) {
      var xTotalDelay = 0, yTotalDelay = 0;
      _autoScrollTimerId = setInterval(function() {
        var xNeedUpdate = !1, yNeedUpdate = !1;
        _draggingMouseOffset.offset.x ? (xTotalDelay += options.minIntervalToShowNextCell, xNeedUpdate = xTotalDelay >= _xDelayForNextCell) : xTotalDelay = 0, _draggingMouseOffset.offset.y ? (yTotalDelay += options.minIntervalToShowNextCell, yNeedUpdate = yTotalDelay >= _yDelayForNextCell) : yTotalDelay = 0, (xNeedUpdate || yNeedUpdate) && (xNeedUpdate && (xTotalDelay = 0), yNeedUpdate && (yTotalDelay = 0), handleDragToNewPosition(xNeedUpdate, yNeedUpdate));
      }, options.minIntervalToShowNextCell);
    }
  }
  function handleDragToNewPosition(xNeedUpdate, yNeedUpdate) {
    var pageX = _draggingMouseOffset.e.pageX, pageY = _draggingMouseOffset.e.pageY, mouseOffsetX = _draggingMouseOffset.offset.x, mouseOffsetY = _draggingMouseOffset.offset.y, viewportOffset = _draggingMouseOffset.viewport.offset;
    xNeedUpdate && mouseOffsetX && (mouseOffsetX > 0 ? pageX = viewportOffset.right + _moveDistanceForOneCell.x : pageX = viewportOffset.left - _moveDistanceForOneCell.x), yNeedUpdate && mouseOffsetY && (mouseOffsetY > 0 ? pageY = viewportOffset.top - _moveDistanceForOneCell.y : pageY = viewportOffset.bottom + _moveDistanceForOneCell.y), handleDragTo({
      pageX,
      pageY
    }, _draggingMouseOffset.dd);
  }
  function stopIntervalTimer() {
    clearInterval(_autoScrollTimerId), _autoScrollTimerId = null;
  }
  function handleDragTo(e, dd) {
    let targetEvent = e.touches ? e.touches[0] : e, canvasOffset = Utils14.offset(_activeCanvas), end = _grid.getCellFromPoint(
      targetEvent.pageX - (canvasOffset && canvasOffset.left || 0) + _columnOffset,
      targetEvent.pageY - (canvasOffset && canvasOffset.top || 0) + _rowOffset
    );
    if (!(_gridOptions.frozenColumn >= 0 && !_isRightCanvas && end.cell > _gridOptions.frozenColumn || _isRightCanvas && end.cell <= _gridOptions.frozenColumn) && !(_gridOptions.frozenRow >= 0 && !_isBottomCanvas && end.row >= _gridOptions.frozenRow || _isBottomCanvas && end.row < _gridOptions.frozenRow)) {
      if (options.autoScroll && _draggingMouseOffset) {
        var endCellBox = _grid.getCellNodeBox(end.row, end.cell);
        if (!endCellBox)
          return;
        var viewport = _draggingMouseOffset.viewport;
        (endCellBox.left < viewport.left || endCellBox.right > viewport.right || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) && _grid.scrollCellIntoView(end.row, end.cell);
      }
      if (_grid.canCellBeSelected(end.row, end.cell) && dd && dd.range) {
        dd.range.end = end;
        var range = new SlickRange2(dd.range.start.row, dd.range.start.cell, end.row, end.cell);
        _decorator.show(range), _self.onCellRangeSelecting.notify({
          range
        });
      }
    }
  }
  function hasRowMoveManager() {
    return !!(_grid.getPluginByName("RowMoveManager") || _grid.getPluginByName("CrossGridRowMoveManager"));
  }
  function handleDragEnd(e, dd) {
    _dragging && (_dragging = !1, e.stopImmediatePropagation(), stopIntervalTimer(), _decorator.hide(), _self.onCellRangeSelected.notify({
      range: new SlickRange2(
        dd.range.start.row,
        dd.range.start.cell,
        dd.range.end.row,
        dd.range.end.cell
      )
    }));
  }
  function getCurrentRange() {
    return _currentlySelectedRange;
  }
  Utils14.extend(this, {
    init,
    destroy,
    pluginName: "CellRangeSelector",
    getCellDecorator,
    getCurrentRange,
    onBeforeCellRangeSelected: new SlickEvent8(),
    onCellRangeSelected: new SlickEvent8(),
    onCellRangeSelecting: new SlickEvent8()
  });
}

// src/plugins/slick.cellselectionmodel.js
var SlickEvent9 = Event, EventData5 = EventData, SlickRange3 = Range, CellRangeSelector2 = CellRangeSelector, Utils15 = Utils;
function CellSelectionModel(options) {
  var _grid, _ranges = [], _self = this, _selector;
  typeof options > "u" || typeof options.cellRangeSelector > "u" ? _selector = new CellRangeSelector2({
    selectionCss: {
      border: "2px solid black"
    }
  }) : _selector = options.cellRangeSelector;
  var _options, _defaults = {
    selectActiveCell: !0
  };
  function init(grid) {
    _options = Utils15.extend(!0, {}, _defaults, options), _grid = grid, _grid.onActiveCellChanged.subscribe(handleActiveCellChange), _grid.onKeyDown.subscribe(handleKeyDown), grid.registerPlugin(_selector), _selector.onCellRangeSelected.subscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
  }
  function destroy() {
    _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange), _grid.onKeyDown.unsubscribe(handleKeyDown), _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected), _grid.unregisterPlugin(_selector), _selector && _selector.destroy && _selector.destroy();
  }
  function removeInvalidRanges(ranges) {
    for (var result = [], i2 = 0; i2 < ranges.length; i2++) {
      var r = ranges[i2];
      _grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell) && result.push(r);
    }
    return result;
  }
  function rangesAreEqual(range1, range2) {
    var areDifferent = range1.length !== range2.length;
    if (!areDifferent) {
      for (var i2 = 0; i2 < range1.length; i2++)
        if (range1[i2].fromCell !== range2[i2].fromCell || range1[i2].fromRow !== range2[i2].fromRow || range1[i2].toCell !== range2[i2].toCell || range1[i2].toRow !== range2[i2].toRow) {
          areDifferent = !0;
          break;
        }
    }
    return !areDifferent;
  }
  function setSelectedRanges(ranges, caller) {
    if (!((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0))) {
      var rangeHasChanged = !rangesAreEqual(_ranges, ranges);
      if (_ranges = removeInvalidRanges(ranges), rangeHasChanged) {
        var eventData = new EventData5(null, _ranges);
        Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } }), _self.onSelectedRangesChanged.notify(_ranges, eventData);
      }
    }
  }
  function getSelectedRanges() {
    return _ranges;
  }
  function refreshSelections() {
    setSelectedRanges(getSelectedRanges());
  }
  function handleBeforeCellRangeSelected(e) {
    if (_grid.getEditorLock().isActive())
      return e.stopPropagation(), !1;
  }
  function handleCellRangeSelected(e, args) {
    _grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), setSelectedRanges([args.range]);
  }
  function handleActiveCellChange(e, args) {
    _options.selectActiveCell && args.row != null && args.cell != null ? setSelectedRanges([new SlickRange3(args.row, args.cell)]) : _options.selectActiveCell || setSelectedRanges([]);
  }
  function handleKeyDown(e) {
    var ranges, last, active = _grid.getActiveCell(), metaKey = e.ctrlKey || e.metaKey;
    if (active && e.shiftKey && !metaKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
      ranges = getSelectedRanges().slice(), ranges.length || ranges.push(new SlickRange3(active.row, active.cell)), last = ranges.pop(), last.contains(active.row, active.cell) || (last = new SlickRange3(active.row, active.cell));
      var dRow = last.toRow - last.fromRow, dCell = last.toCell - last.fromCell, dirRow = active.row == last.fromRow ? 1 : -1, dirCell = active.cell == last.fromCell ? 1 : -1;
      e.which == 37 ? dCell -= dirCell : e.which == 39 ? dCell += dirCell : e.which == 38 ? dRow -= dirRow : e.which == 40 && (dRow += dirRow);
      var new_last = new SlickRange3(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
      if (removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow, viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
        _grid.scrollRowIntoView(viewRow), _grid.scrollCellIntoView(viewRow, viewCell);
      } else
        ranges.push(last);
      setSelectedRanges(ranges), e.preventDefault(), e.stopPropagation();
    }
  }
  Utils15.extend(this, {
    getSelectedRanges,
    setSelectedRanges,
    refreshSelections,
    init,
    destroy,
    pluginName: "CellSelectionModel",
    onSelectedRangesChanged: new SlickEvent9()
  });
}

// src/plugins/slick.checkboxselectcolumn.js
var BindingEventService7 = BindingEventService, EventHandler4 = EventHandler, Utils16 = Utils;
function CheckboxSelectColumn(options) {
  let _dataView, _grid, _isUsingDataView = !1, _selectableOverride = null, _headerRowNode, _selectAll_UID = createUID(), _handler = new EventHandler4(), _selectedRowsLookup = {}, _defaults = {
    columnId: "_checkbox_selector",
    cssClass: null,
    hideSelectAllCheckbox: !1,
    toolTip: "Select/Deselect All",
    width: 30,
    applySelectOnAllPages: !1,
    // defaults to false, when that is enabled the "Select All" will be applied to all pages (when using Pagination)
    hideInColumnTitleRow: !1,
    hideInFilterHeaderRow: !0
  }, _isSelectAllChecked = !1, _bindingEventService = new BindingEventService7(), _options = Utils16.extend(!0, {}, _defaults, options);
  typeof _options.selectableOverride == "function" && selectableOverride(_options.selectableOverride);
  function init(grid) {
    _grid = grid, _isUsingDataView = !Array.isArray(grid.getData()), _isUsingDataView && (_dataView = grid.getData()), _handler.subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged).subscribe(_grid.onClick, handleClick).subscribe(_grid.onKeyDown, handleKeyDown), _isUsingDataView && _dataView && _options.applySelectOnAllPages && _handler.subscribe(_dataView.onSelectedRowIdsChanged, handleDataViewSelectedIdsChanged).subscribe(_dataView.onPagingInfoChanged, handleDataViewSelectedIdsChanged), _options.hideInFilterHeaderRow || addCheckboxToFilterHeaderRow(grid), _options.hideInColumnTitleRow || _handler.subscribe(_grid.onHeaderClick, handleHeaderClick);
  }
  function destroy() {
    _handler.unsubscribeAll(), _bindingEventService.unbindAll();
  }
  function getOptions() {
    return _options;
  }
  function setOptions(options2) {
    if (_options = Utils16.extend(!0, {}, _options, options2), _options.hideSelectAllCheckbox)
      hideSelectAllFromColumnHeaderTitleRow(), hideSelectAllFromColumnHeaderFilterRow();
    else if (_options.hideInColumnTitleRow ? hideSelectAllFromColumnHeaderTitleRow() : (renderSelectAllCheckbox(_isSelectAllChecked), _handler.subscribe(_grid.onHeaderClick, handleHeaderClick)), _options.hideInFilterHeaderRow)
      hideSelectAllFromColumnHeaderFilterRow();
    else {
      let selectAllContainerElm = _headerRowNode.querySelector("#filter-checkbox-selectall-container");
      if (selectAllContainerElm) {
        selectAllContainerElm.style.display = "flex";
        let selectAllInputElm = selectAllContainerElm.querySelector('input[type="checkbox"]');
        selectAllInputElm && (selectAllInputElm.checked = _isSelectAllChecked);
      }
    }
  }
  function hideSelectAllFromColumnHeaderTitleRow() {
    _grid.updateColumnHeader(_options.columnId, "", "");
  }
  function hideSelectAllFromColumnHeaderFilterRow() {
    let selectAllContainerElm = _headerRowNode && _headerRowNode.querySelector("#filter-checkbox-selectall-container");
    selectAllContainerElm && (selectAllContainerElm.style.display = "none");
  }
  function handleSelectedRowsChanged() {
    let selectedRows = _grid.getSelectedRows(), lookup = {}, row, i2, k, disabledCount = 0;
    if (typeof _selectableOverride == "function")
      for (k = 0; k < _grid.getDataLength(); k++) {
        let dataItem = _grid.getDataItem(k);
        checkSelectableOverride(i2, dataItem, _grid) || disabledCount++;
      }
    let removeList = [];
    for (i2 = 0; i2 < selectedRows.length; i2++) {
      row = selectedRows[i2];
      let rowItem = _grid.getDataItem(row);
      checkSelectableOverride(i2, rowItem, _grid) ? (lookup[row] = !0, lookup[row] !== _selectedRowsLookup[row] && (_grid.invalidateRow(row), delete _selectedRowsLookup[row])) : removeList.push(row);
    }
    for (i2 in _selectedRowsLookup)
      _grid.invalidateRow(i2);
    if (_selectedRowsLookup = lookup, _grid.render(), _isSelectAllChecked = selectedRows && selectedRows.length + disabledCount >= _grid.getDataLength(), (!_isUsingDataView || !_options.applySelectOnAllPages) && (!_options.hideInColumnTitleRow && !_options.hideSelectAllCheckbox && renderSelectAllCheckbox(_isSelectAllChecked), !_options.hideInFilterHeaderRow)) {
      let selectAllElm = _headerRowNode && _headerRowNode.querySelector(`#header-filter-selector${_selectAll_UID}`);
      selectAllElm && (selectAllElm.checked = _isSelectAllChecked);
    }
    if (removeList.length > 0) {
      for (i2 = 0; i2 < removeList.length; i2++) {
        let remIdx = selectedRows.indexOf(removeList[i2]);
        selectedRows.splice(remIdx, 1);
      }
      _grid.setSelectedRows(selectedRows, "click.cleanup");
    }
  }
  function handleDataViewSelectedIdsChanged() {
    let selectedIds = _dataView.getAllSelectedFilteredIds(), filteredItems = _dataView.getFilteredItems(), disabledCount = 0;
    if (typeof _selectableOverride == "function" && selectedIds.length > 0)
      for (let k = 0; k < _dataView.getItemCount(); k++) {
        let dataItem = _dataView.getItemByIdx(k), idProperty = _dataView.getIdPropertyName(), dataItemId = dataItem[idProperty];
        filteredItems.findIndex(function(item) {
          return item[idProperty] === dataItemId;
        }) >= 0 && !checkSelectableOverride(k, dataItem, _grid) && disabledCount++;
      }
    if (_isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length, !_options.hideInColumnTitleRow && !_options.hideSelectAllCheckbox && renderSelectAllCheckbox(_isSelectAllChecked), !_options.hideInFilterHeaderRow) {
      let selectAllElm = _headerRowNode && _headerRowNode.querySelector(`#header-filter-selector${_selectAll_UID}`);
      selectAllElm && (selectAllElm.checked = _isSelectAllChecked);
    }
  }
  function handleKeyDown(e, args) {
    e.which == 32 && _grid.getColumns()[args.cell].id === _options.columnId && ((!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) && toggleRowSelection(args.row), e.preventDefault(), e.stopImmediatePropagation());
  }
  function handleClick(e, args) {
    if (_grid.getColumns()[args.cell].id === _options.columnId && e.target.type === "checkbox") {
      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      toggleRowSelection(args.row), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  function toggleRowSelection(row) {
    let dataContext = _grid.getDataItem(row);
    if (checkSelectableOverride(row, dataContext, _grid)) {
      if (_selectedRowsLookup[row]) {
        let newSelectedRows = _grid.getSelectedRows().filter((n) => n !== row);
        _grid.setSelectedRows(newSelectedRows, "click.toggle");
      } else
        _grid.setSelectedRows(_grid.getSelectedRows().concat(row), "click.toggle");
      _grid.setActiveCell(row, getCheckboxColumnCellIndex());
    }
  }
  function selectRows(rowArray) {
    let i2, l = rowArray.length, addRows = [];
    for (i2 = 0; i2 < l; i2++)
      _selectedRowsLookup[rowArray[i2]] || (addRows[addRows.length] = rowArray[i2]);
    _grid.setSelectedRows(_grid.getSelectedRows().concat(addRows), "SlickCheckboxSelectColumn.selectRows");
  }
  function deSelectRows(rowArray) {
    let i2, l = rowArray.length, removeRows = [];
    for (i2 = 0; i2 < l; i2++)
      _selectedRowsLookup[rowArray[i2]] && (removeRows[removeRows.length] = rowArray[i2]);
    _grid.setSelectedRows(_grid.getSelectedRows().filter((n) => removeRows.indexOf(n) < 0), "SlickCheckboxSelectColumn.deSelectRows");
  }
  function handleHeaderClick(e, args) {
    if (args.column.id == _options.columnId && e.target.type === "checkbox") {
      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      let isAllSelected = e.target.checked, caller = isAllSelected ? "click.selectAll" : "click.unselectAll", rows = [];
      if (isAllSelected) {
        for (let i2 = 0; i2 < _grid.getDataLength(); i2++) {
          let rowItem = _grid.getDataItem(i2);
          !rowItem.__group && !rowItem.__groupTotals && checkSelectableOverride(i2, rowItem, _grid) && rows.push(i2);
        }
        isAllSelected = !0;
      }
      if (_isUsingDataView && _dataView && _options.applySelectOnAllPages) {
        let ids = [], filteredItems = _dataView.getFilteredItems();
        for (let j = 0; j < filteredItems.length; j++) {
          let dataviewRowItem = filteredItems[j];
          checkSelectableOverride(j, dataviewRowItem, _grid) && ids.push(dataviewRowItem[_dataView.getIdPropertyName()]);
        }
        _dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
      }
      _grid.setSelectedRows(rows, caller), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  let _checkboxColumnCellIndex = null;
  function getCheckboxColumnCellIndex() {
    if (_checkboxColumnCellIndex === null) {
      _checkboxColumnCellIndex = 0;
      let colArr = _grid.getColumns();
      for (let i2 = 0; i2 < colArr.length; i2++)
        colArr[i2].id == _options.columnId && (_checkboxColumnCellIndex = i2);
    }
    return _checkboxColumnCellIndex;
  }
  function getColumnDefinition() {
    return {
      id: _options.columnId,
      name: _options.hideSelectAllCheckbox || _options.hideInColumnTitleRow ? "" : "<input id='header-selector" + _selectAll_UID + "' type='checkbox'><label for='header-selector" + _selectAll_UID + "'></label>",
      toolTip: _options.hideSelectAllCheckbox || _options.hideInColumnTitleRow ? "" : _options.toolTip,
      field: "sel",
      width: _options.width,
      resizable: !1,
      sortable: !1,
      cssClass: _options.cssClass,
      hideSelectAllCheckbox: _options.hideSelectAllCheckbox,
      formatter: checkboxSelectionFormatter,
      // exclude from all menus, defaults to true unless the option is provided differently by the user
      excludeFromColumnPicker: typeof _options.excludeFromColumnPicker < "u" ? _options.excludeFromColumnPicker : !0,
      excludeFromGridMenu: typeof _options.excludeFromGridMenu < "u" ? _options.excludeFromGridMenu : !0,
      excludeFromHeaderMenu: typeof _options.excludeFromHeaderMenu < "u" ? _options.excludeFromHeaderMenu : !0
    };
  }
  function addCheckboxToFilterHeaderRow(grid) {
    _handler.subscribe(grid.onHeaderRowCellRendered, function(e, args) {
      if (args.column.field === "sel") {
        Utils16.emptyElement(args.node);
        let spanElm = document.createElement("span");
        spanElm.id = "filter-checkbox-selectall-container";
        let inputElm = document.createElement("input");
        inputElm.type = "checkbox", inputElm.id = `header-filter-selector${_selectAll_UID}`;
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `header-filter-selector${_selectAll_UID}`, spanElm.appendChild(inputElm), spanElm.appendChild(labelElm), args.node.appendChild(spanElm), _headerRowNode = args.node, _bindingEventService.bind(spanElm, "click", (e2) => handleHeaderClick(e2, args));
      }
    });
  }
  function createUID() {
    return Math.round(1e7 * Math.random());
  }
  function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext, grid) {
    let UID = createUID() + row;
    return dataContext && checkSelectableOverride(row, dataContext, grid) ? _selectedRowsLookup[row] ? "<input id='selector" + UID + "' type='checkbox' checked='checked'><label for='selector" + UID + "'></label>" : "<input id='selector" + UID + "' type='checkbox'><label for='selector" + UID + "'></label>" : null;
  }
  function checkSelectableOverride(row, dataContext, grid) {
    return typeof _selectableOverride == "function" ? _selectableOverride(row, dataContext, grid) : !0;
  }
  function renderSelectAllCheckbox(isSelectAllChecked) {
    isSelectAllChecked ? _grid.updateColumnHeader(_options.columnId, "<input id='header-selector" + _selectAll_UID + "' type='checkbox' checked='checked'><label for='header-selector" + _selectAll_UID + "'></label>", _options.toolTip) : _grid.updateColumnHeader(_options.columnId, "<input id='header-selector" + _selectAll_UID + "' type='checkbox'><label for='header-selector" + _selectAll_UID + "'></label>", _options.toolTip);
  }
  function selectableOverride(overrideFn) {
    _selectableOverride = overrideFn;
  }
  Utils16.extend(this, {
    init,
    destroy,
    pluginName: "CheckboxSelectColumn",
    deSelectRows,
    selectRows,
    getColumnDefinition,
    getOptions,
    selectableOverride,
    setOptions
  });
}

// src/plugins/slick.contextmenu.js
var BindingEventService8 = BindingEventService, SlickEvent10 = Event, EventData6 = EventData, EventHandler5 = EventHandler, Utils17 = Utils;
function ContextMenu(optionProperties) {
  let _contextMenuProperties, _currentCell = -1, _currentRow = -1, _grid, _gridOptions, _gridUid = "", _handler = new EventHandler5(), _self = this, _optionTitleElm, _commandTitleElm, _menuElm, _bindingEventService = new BindingEventService8(), _defaults = {
    autoAdjustDrop: !0,
    // dropup/dropdown
    autoAlignSide: !0,
    // left/right
    autoAdjustDropOffset: -4,
    autoAlignSideOffset: 0,
    hideMenuOnScroll: !1,
    maxHeight: "none",
    width: "auto",
    optionShownOverColumnIds: [],
    commandShownOverColumnIds: []
  };
  function init(grid) {
    _grid = grid, _gridOptions = grid.getOptions(), _contextMenuProperties = Utils17.extend({}, _defaults, optionProperties), _gridUid = grid && grid.getUID ? grid.getUID() : "", _handler.subscribe(_grid.onContextMenu, handleOnContextMenu), _contextMenuProperties.hideMenuOnScroll && _handler.subscribe(_grid.onScroll, destroyMenu);
  }
  function setOptions(newOptions) {
    _contextMenuProperties = Utils17.extend({}, _contextMenuProperties, newOptions), newOptions.commandShownOverColumnIds && (_contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds), newOptions.optionShownOverColumnIds && (_contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds);
  }
  function destroy() {
    _self.onAfterMenuShow.unsubscribe(), _self.onBeforeMenuShow.unsubscribe(), _self.onBeforeMenuClose.unsubscribe(), _self.onCommand.unsubscribe(), _self.onOptionSelected.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm && _menuElm.remove && _menuElm.remove(), _commandTitleElm = null, _optionTitleElm = null, _menuElm = null;
  }
  function createMenu(e) {
    e instanceof EventData6 && (e = e.getNativeEvent());
    let targetEvent = e.touches ? e.touches[0] : e, cell = _grid.getCellFromEvent(e);
    _currentCell = cell && cell.cell, _currentRow = cell && cell.row;
    let columnDef = _grid.getColumns()[_currentCell], dataContext = _grid.getDataItem(_currentRow), isColumnOptionAllowed = checkIsColumnAllowed(_contextMenuProperties.optionShownOverColumnIds, columnDef.id), isColumnCommandAllowed = checkIsColumnAllowed(_contextMenuProperties.commandShownOverColumnIds, columnDef.id), commandItems = _contextMenuProperties.commandItems || [], optionItems = _contextMenuProperties.optionItems || [];
    if (!columnDef || !isColumnCommandAllowed && !isColumnOptionAllowed || !commandItems.length && !optionItems.length || (destroyMenu(e), _self.onBeforeMenuShow.notify({
      cell: _currentCell,
      row: _currentRow,
      grid: _grid
    }, e, _self).getReturnValue() == !1))
      return;
    let maxHeight = isNaN(_contextMenuProperties.maxHeight) ? _contextMenuProperties.maxHeight : _contextMenuProperties.maxHeight + "px", width2 = isNaN(_contextMenuProperties.width) ? _contextMenuProperties.width : _contextMenuProperties.width + "px";
    _menuElm = document.createElement("div"), _menuElm.className = `slick-context-menu ${_gridUid}`, _menuElm.role = "menu", _menuElm.style.width = width2, _menuElm.style.maxHeight = maxHeight, _menuElm.style.top = `${targetEvent.pageY}px`, _menuElm.style.left = `${targetEvent.pageX}px`, _menuElm.style.display = "none";
    let closeButtonElm = document.createElement("button");
    closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-context-menu", closeButtonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", closeButtonElm.appendChild(spanCloseElm), !_contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
      let optionMenuElm = document.createElement("div");
      optionMenuElm.className = "slick-context-menu-option-list", optionMenuElm.role = "menu", _contextMenuProperties.hideCloseButton || (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(optionMenuElm), populateOptionItems(
        _contextMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
      );
    }
    if (!_contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
      let commandMenuElm = document.createElement("div");
      commandMenuElm.className = "slick-context-menu-command-list", commandMenuElm.role = "menu", !_contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || _contextMenuProperties.hideOptionSection) && (_bindingEventService.bind(closeButtonElm, "click", handleCloseButtonClicked), _menuElm.appendChild(closeButtonElm)), _menuElm.appendChild(commandMenuElm), populateCommandItems(
        _contextMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: _currentCell, row: _currentRow, column: columnDef, dataContext, grid: _grid }
      );
    }
    if (_menuElm.style.display = "block", document.body.appendChild(_menuElm), _self.onAfterMenuShow.notify({
      cell: _currentCell,
      row: _currentRow,
      grid: _grid
    }, e, _self).getReturnValue() != !1)
      return _menuElm;
  }
  function handleCloseButtonClicked(e) {
    e.defaultPrevented || destroyMenu(e);
  }
  function destroyMenu(e, args) {
    if (_menuElm = _menuElm || document.querySelector(".slick-context-menu." + _gridUid), _menuElm && _menuElm.remove) {
      if (_self.onBeforeMenuClose.notify({
        cell: args && args.cell,
        row: args && args.row,
        grid: _grid,
        menu: _menuElm
      }, e, _self).getReturnValue() == !1)
        return;
      _menuElm.remove(), _menuElm = null;
    }
  }
  function checkIsColumnAllowed(columnIds, columnId) {
    let isAllowedColumn = !1;
    if (columnIds && columnIds.length > 0)
      for (let o = 0, ln = columnIds.length; o < ln; o++)
        columnIds[o] === columnId && (isAllowedColumn = !0);
    else
      isAllowedColumn = !0;
    return isAllowedColumn;
  }
  function handleOnContextMenu(e, args) {
    e instanceof EventData6 && (e = e.getNativeEvent()), e.preventDefault();
    let cell = _grid.getCellFromEvent(e), columnDef = _grid.getColumns()[cell.cell], dataContext = _grid.getDataItem(cell.row);
    args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = dataContext, args.grid = _grid, runOverrideFunctionWhenExists(_contextMenuProperties.menuUsabilityOverride, args) && (_menuElm = createMenu(e, args), _menuElm && (repositionMenu(e), _menuElm.style.display = "block"), _bindingEventService.bind(document.body, "click", (e2) => {
      e2.defaultPrevented || destroyMenu(e2, { cell: _currentCell, row: _currentRow });
    }));
  }
  function populateOptionItems(contextMenu, optionMenuElm, optionItems, args) {
    if (!(!args || !optionItems || !contextMenu)) {
      contextMenu && contextMenu.optionTitle && (_optionTitleElm = document.createElement("div"), _optionTitleElm.className = "title", _optionTitleElm.textContent = contextMenu.optionTitle, optionMenuElm.appendChild(_optionTitleElm));
      for (let i2 = 0, ln = optionItems.length; i2 < ln; i2++) {
        let addClickListener = !0, item = optionItems[i2], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.role = "button", iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-context-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), optionMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemOptionClick.bind(this, item));
      }
    }
  }
  function populateCommandItems(contextMenu, commandMenuElm, commandItems, args) {
    if (!(!args || !commandItems || !contextMenu)) {
      contextMenu && contextMenu.commandTitle && (_commandTitleElm = document.createElement("div"), _commandTitleElm.className = "title", _commandTitleElm.textContent = contextMenu.commandTitle, commandMenuElm.appendChild(_commandTitleElm));
      for (let i2 = 0, ln = commandItems.length; i2 < ln; i2++) {
        let addClickListener = !0, item = commandItems[i2], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
        let liElm = document.createElement("div");
        liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip);
        let iconElm = document.createElement("div");
        iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
        let textElm = document.createElement("span");
        textElm.className = "slick-context-menu-content", textElm.textContent = item.title, liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandMenuElm.appendChild(liElm), addClickListener && _bindingEventService.bind(liElm, "click", handleMenuItemCommandClick.bind(this, item));
      }
    }
  }
  function handleMenuItemCommandClick(item, e) {
    if (!item || item.disabled || item.divider)
      return;
    let command = item.command || "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row), cellValue;
    if (Object.prototype.hasOwnProperty.call(dataContext, columnDef && columnDef.field) && (cellValue = dataContext[columnDef.field]), command != null && command !== "") {
      let callbackArgs = {
        cell,
        row,
        grid: _grid,
        command,
        item,
        column: columnDef,
        dataContext,
        value: cellValue
      };
      _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
    }
  }
  function handleMenuItemOptionClick(item, e) {
    if (item.disabled || item.divider || !_grid.getEditorLock().commitCurrentEdit())
      return;
    let option = item.option !== void 0 ? item.option : "", row = _currentRow, cell = _currentCell, columnDef = _grid.getColumns()[cell], dataContext = _grid.getDataItem(row);
    if (option !== void 0) {
      let callbackArgs = {
        cell,
        row,
        grid: _grid,
        option,
        item,
        column: columnDef,
        dataContext
      };
      _self.onOptionSelected.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
    }
  }
  function repositionMenu(e) {
    let targetEvent = e.touches ? e.touches[0] : e, parentElm = e.target.closest(".slick-cell"), menuOffsetLeft = targetEvent.pageX, menuOffsetTop = parentElm ? Utils17.offset(parentElm).top : targetEvent.pageY, menuHeight = _menuElm && _menuElm.offsetHeight || 0, menuWidth = _menuElm && _menuElm.offsetWidth || _contextMenuProperties.width || 0, rowHeight = _gridOptions.rowHeight, dropOffset = _contextMenuProperties.autoAdjustDropOffset, sideOffset = _contextMenuProperties.autoAlignSideOffset;
    if (_contextMenuProperties.autoAdjustDrop) {
      let spaceBottom = Utils17.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils17.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
      (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (_menuElm.classList.remove("dropdown"), _menuElm.classList.add("dropup"), menuOffsetTop = menuOffsetTop - menuHeight - dropOffset) : (_menuElm.classList.remove("dropup"), _menuElm.classList.add("dropdown"), menuOffsetTop = menuOffsetTop + rowHeight + dropOffset);
    }
    if (_contextMenuProperties.autoAlignSide) {
      let gridPos = _grid.getGridPosition();
      (menuOffsetLeft + menuWidth >= gridPos.width ? "left" : "right") === "left" ? (_menuElm.classList.remove("dropright"), _menuElm.classList.add("dropleft"), menuOffsetLeft = menuOffsetLeft - menuWidth - sideOffset) : (_menuElm.classList.remove("dropleft"), _menuElm.classList.add("dropright"), menuOffsetLeft = menuOffsetLeft + sideOffset);
    }
    _menuElm.style.top = `${menuOffsetTop}px`, _menuElm.style.left = `${menuOffsetLeft}px`;
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  Utils17.extend(this, {
    init,
    closeMenu: destroyMenu,
    destroy,
    pluginName: "ContextMenu",
    setOptions,
    onAfterMenuShow: new SlickEvent10(),
    onBeforeMenuShow: new SlickEvent10(),
    onBeforeMenuClose: new SlickEvent10(),
    onCommand: new SlickEvent10(),
    onOptionSelected: new SlickEvent10()
  });
}

// src/plugins/slick.crossgridrowmovemanager.js
var SlickEvent11 = Event, EventHandler6 = EventHandler, Utils18 = Utils;
function CrossGridRowMoveManager(options) {
  var _grid, _canvas, _toGrid, _toCanvas, _dragging, _self = this, _usabilityOverride = null, _handler = new EventHandler6(), _defaults = {
    columnId: "_move",
    cssClass: null,
    cancelEditOnDrag: !1,
    disableRowSelection: !1,
    hideRowMoveShadow: !0,
    rowMoveShadowMarginTop: 0,
    rowMoveShadowMarginLeft: 0,
    rowMoveShadowOpacity: 0.95,
    rowMoveShadowScale: 0.75,
    singleRowMove: !1,
    width: 40
  };
  options && typeof options.usabilityOverride == "function" && usabilityOverride(options.usabilityOverride);
  function init(grid) {
    options = Utils18.extend(!0, {}, _defaults, options), _grid = grid, _canvas = _grid.getCanvasNode(), _toGrid = options.toGrid, _toCanvas = _toGrid.getCanvasNode(), _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
  }
  function destroy() {
    _handler.unsubscribeAll();
  }
  function setOptions(newOptions) {
    options = Utils18.extend({}, options, newOptions);
  }
  function handleDragInit(e) {
    e.stopImmediatePropagation();
  }
  function handleDragStart(e, dd) {
    var cell = _grid.getCellFromEvent(e), currentRow = cell && cell.row, dataContext = _grid.getDataItem(currentRow);
    if (checkUsabilityOverride(currentRow, dataContext, _grid)) {
      if (options.cancelEditOnDrag && _grid.getEditorLock().isActive() && _grid.getEditorLock().cancelCurrentEdit(), _grid.getEditorLock().isActive() || !isHandlerColumn(cell.cell))
        return !1;
      if (_dragging = !0, e.stopImmediatePropagation(), !options.hideRowMoveShadow) {
        let cellNodeElm = _grid.getCellNode(cell.row, cell.cell), slickRowElm = cellNodeElm && cellNodeElm.closest(".slick-row");
        slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${options.rowMoveShadowScale || 0.75})`, _canvas.appendChild(dd.clonedSlickRow));
      }
      var selectedRows = options.singleRowMove ? [cell.row] : _grid.getSelectedRows();
      (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], options.disableRowSelection || _grid.setSelectedRows(selectedRows)), selectedRows.sort(function(a, b) {
        return a - b;
      });
      var rowHeight = _grid.getOptions().rowHeight;
      dd.fromGrid = _grid, dd.toGrid = _toGrid, dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${_toCanvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, _toCanvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${_toCanvas.clientWidth}px`, dd.guide.style.top = "-1000px", _toCanvas.appendChild(dd.guide), dd.insertBefore = -1;
    }
  }
  function handleDrag(evt, dd) {
    if (!_dragging)
      return;
    evt.stopImmediatePropagation();
    let e = evt.getNativeEvent();
    var targetEvent = e.touches ? e.touches[0] : e;
    let top = targetEvent.pageY - (Utils18.offset(_toCanvas).top || 0);
    dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
    var insertBefore = Math.max(0, Math.min(Math.round(top / _toGrid.getOptions().rowHeight), _toGrid.getDataLength()));
    if (insertBefore !== dd.insertBefore) {
      var eventData = {
        fromGrid: _grid,
        toGrid: _toGrid,
        rows: dd.selectedRows,
        insertBefore
      };
      if (_self.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, _usabilityOverride && dd.canMove) {
        var insertBeforeDataContext = _toGrid.getDataItem(insertBefore);
        dd.canMove = checkUsabilityOverride(insertBefore, insertBeforeDataContext, _toGrid);
      }
      dd.canMove ? dd.guide.style.top = `${insertBefore * (_toGrid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
    }
  }
  function handleDragEnd(e, dd) {
    if (_dragging && (_dragging = !1, e.stopImmediatePropagation(), dd.guide.remove(), dd.selectionProxy.remove(), dd.clonedSlickRow && (dd.clonedSlickRow.remove(), dd.clonedSlickRow = null), dd.canMove)) {
      var eventData = {
        fromGrid: _grid,
        toGrid: _toGrid,
        rows: dd.selectedRows,
        insertBefore: dd.insertBefore
      };
      _self.onMoveRows.notify(eventData);
    }
  }
  function getColumnDefinition() {
    return {
      id: options.columnId || "_move",
      name: "",
      field: "move",
      width: options.width || 40,
      behavior: "selectAndMove",
      selectable: !1,
      resizable: !1,
      cssClass: options.cssClass,
      formatter: moveIconFormatter
    };
  }
  function moveIconFormatter(row, cell, value, columnDef, dataContext, grid) {
    return checkUsabilityOverride(row, dataContext, grid) ? { addClasses: "cell-reorder dnd", text: "" } : null;
  }
  function checkUsabilityOverride(row, dataContext, grid) {
    return typeof _usabilityOverride == "function" ? _usabilityOverride(row, dataContext, grid) : !0;
  }
  function usabilityOverride(overrideFn) {
    _usabilityOverride = overrideFn;
  }
  function isHandlerColumn(columnIndex) {
    return /move|selectAndMove/.test(_grid.getColumns()[columnIndex].behavior);
  }
  Utils18.extend(this, {
    onBeforeMoveRows: new SlickEvent11(),
    onMoveRows: new SlickEvent11(),
    init,
    destroy,
    getColumnDefinition,
    setOptions,
    usabilityOverride,
    isHandlerColumn,
    pluginName: "CrossGridRowMoveManager"
  });
}

// src/plugins/slick.customtooltip.js
var EventHandler7 = EventHandler, Utils19 = Utils;
function CustomTooltip(options) {
  var _cancellablePromise, _cellNodeElm, _dataView, _grid, _gridOptions, _tooltipElm, _defaults = {
    className: "slick-custom-tooltip",
    offsetLeft: 0,
    offsetRight: 0,
    offsetTopBottom: 4,
    hideArrow: !1,
    tooltipTextMaxLength: 700,
    regularTooltipWhiteSpace: "pre-line",
    whiteSpace: "normal"
  }, _eventHandler = new EventHandler7(), _cellTooltipOptions = {}, _options;
  function init(grid) {
    _grid = grid;
    var _data = grid && grid.getData() || [];
    _dataView = Array.isArray(_data) ? null : _data, _gridOptions = grid.getOptions() || {}, _options = Utils19.extend(!0, {}, _defaults, _gridOptions.customTooltip, options), _eventHandler.subscribe(grid.onMouseEnter, handleOnMouseEnter).subscribe(grid.onHeaderMouseEnter, handleOnHeaderMouseEnter).subscribe(grid.onHeaderRowMouseEnter, handleOnHeaderRowMouseEnter).subscribe(grid.onMouseLeave, hideTooltip).subscribe(grid.onHeaderMouseLeave, hideTooltip).subscribe(grid.onHeaderRowMouseLeave, hideTooltip);
  }
  function destroy() {
    hideTooltip(), _eventHandler.unsubscribeAll();
  }
  function handleOnHeaderMouseEnter(e, args) {
    handleOnHeaderMouseEnterByType(e, args, "slick-header-column");
  }
  function handleOnHeaderRowMouseEnter(e, args) {
    handleOnHeaderMouseEnterByType(e, args, "slick-headerrow-column");
  }
  function handleOnHeaderMouseEnterByType(e, args, selector) {
    hideTooltip();
    var cell = {
      row: -1,
      // negative row to avoid pulling any dataContext while rendering
      cell: _grid.getColumns().findIndex(function(col) {
        return args && args.column && args.column.id === col.id;
      })
    }, columnDef = args.column, item = {}, isHeaderRowType = selector === "slick-headerrow-column";
    if (args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = _grid, args.type = isHeaderRowType ? "header-row" : "header", _cellTooltipOptions = Utils19.extend(!0, {}, _options, columnDef.customTooltip), !(columnDef && columnDef.disableTooltip || !runOverrideFunctionWhenExists(_cellTooltipOptions.usabilityOverride, args)) && columnDef && e.target) {
      _cellNodeElm = findClosestHeaderNode(e.target, selector);
      var formatter = isHeaderRowType ? _cellTooltipOptions.headerRowFormatter : _cellTooltipOptions.headerFormatter;
      if (_cellTooltipOptions.useRegularTooltip || !formatter) {
        var formatterOrText = isHeaderRowType ? _cellTooltipOptions.useRegularTooltip ? null : formatter : columnDef.name;
        renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
      } else
        _cellNodeElm && typeof formatter == "function" && renderTooltipFormatter(formatter, cell, null, columnDef, item);
    }
  }
  function findClosestHeaderNode(elm, selector) {
    return typeof elm.closest == "function" ? elm.closest("." + selector) : elm.classList.contains(selector) ? elm : elm.parentElement.classList.contains(selector) ? elm.parentElement : null;
  }
  function handleOnMouseEnter(e, args) {
    if (hideTooltip(), _grid && e) {
      var cell = _grid.getCellFromEvent(e);
      if (cell) {
        var item = _dataView ? _dataView.getItem(cell.row) : _grid.getDataItem(cell.row), columnDef = _grid.getColumns()[cell.cell];
        if (_cellNodeElm = _grid.getCellNode(cell.row, cell.cell), _cellTooltipOptions = Utils19.extend(!0, {}, _options, columnDef.customTooltip), item && columnDef) {
          if (args || (args = {}), args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = _grid, args.type = "cell", columnDef && columnDef.disableTooltip || !runOverrideFunctionWhenExists(_cellTooltipOptions.usabilityOverride, args))
            return;
          var value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
          if (_cellTooltipOptions.useRegularTooltip || !_cellTooltipOptions.formatter)
            renderRegularTooltip(columnDef.formatter, cell, value, columnDef, item);
          else if (typeof _cellTooltipOptions.formatter == "function" && renderTooltipFormatter(_cellTooltipOptions.formatter, cell, value, columnDef, item), typeof _cellTooltipOptions.asyncProcess == "function") {
            var asyncProcess = _cellTooltipOptions.asyncProcess(cell.row, cell.cell, value, columnDef, item, _grid);
            if (!_cellTooltipOptions.asyncPostFormatter)
              throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
            asyncProcess instanceof Promise && (_cancellablePromise = cancellablePromise(asyncProcess), _cancellablePromise.promise.then(function(asyncResult) {
              asyncProcessCallback(asyncResult, cell, value, columnDef, item);
            }).catch(function(error) {
              if (!error.isPromiseCancelled)
                throw error;
            }));
          }
        }
      }
    }
  }
  function findFirstElementAttribute(inputElm, attributes) {
    if (inputElm) {
      var outputAttrData;
      return attributes.forEach(function(attribute) {
        var attrData = inputElm.getAttribute(attribute);
        attrData && (outputAttrData = attrData);
      }), outputAttrData;
    }
    return null;
  }
  function renderRegularTooltip(formatterOrText, cell, value, columnDef, item) {
    var tmpDiv = document.createElement("div");
    tmpDiv.innerHTML = parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item);
    var tooltipText = columnDef.toolTip || "", tmpTitleElm;
    tooltipText || (_cellNodeElm && _cellNodeElm.clientWidth < _cellNodeElm.scrollWidth && !_cellTooltipOptions.useRegularTooltipFromFormatterOnly ? (tooltipText = (_cellNodeElm.textContent || "").trim() || "", _cellTooltipOptions.tooltipTextMaxLength && tooltipText.length > _cellTooltipOptions.tooltipTextMaxLength && (tooltipText = tooltipText.substring(0, _cellTooltipOptions.tooltipTextMaxLength - 3) + "..."), tmpTitleElm = _cellNodeElm) : (_cellTooltipOptions.useRegularTooltipFromFormatterOnly ? tmpTitleElm = tmpDiv.querySelector("[title], [data-slick-tooltip]") : (tmpTitleElm = findFirstElementAttribute(_cellNodeElm, ["title", "data-slick-tooltip"]) ? _cellNodeElm : tmpDiv.querySelector("[title], [data-slick-tooltip]"), (!tmpTitleElm || !findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"])) && _cellNodeElm && (tmpTitleElm = _cellNodeElm.querySelector("[title], [data-slick-tooltip]"))), (!tooltipText || typeof formatterOrText == "function" && _cellTooltipOptions.useRegularTooltipFromFormatterOnly) && (tooltipText = findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"]) || ""))), tooltipText !== "" && renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText), swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
  }
  function swapAndClearTitleAttribute(inputTitleElm, tooltipText) {
    var titleElm = inputTitleElm || _cellNodeElm && (_cellNodeElm.hasAttribute("title") && _cellNodeElm.getAttribute("title") ? _cellNodeElm : _cellNodeElm.querySelector("[title]"));
    titleElm && (titleElm.setAttribute("data-slick-tooltip", tooltipText || ""), titleElm.hasAttribute("title") && titleElm.setAttribute("title", ""));
  }
  function asyncProcessCallback(asyncResult, cell, value, columnDef, dataContext) {
    hideTooltip();
    var itemWithAsyncData = Utils19.extend(!0, {}, dataContext, { [_cellTooltipOptions.asyncParamsPropName || "__params"]: asyncResult });
    renderTooltipFormatter(_cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
  }
  function calculateAvailableSpaceTop(element) {
    var availableSpace = 0, pageScrollTop = windowScrollPosition2().top, elmOffset = getHtmlElementOffset(element);
    if (elmOffset) {
      var elementOffsetTop = elmOffset.top;
      availableSpace = elementOffsetTop - pageScrollTop;
    }
    return availableSpace;
  }
  function cancellablePromise(inputPromise) {
    var hasCancelled = !1;
    return inputPromise instanceof Promise ? {
      promise: inputPromise.then(function(result) {
        if (hasCancelled)
          throw { isPromiseCancelled: !0 };
        return result;
      }),
      cancel: function() {
        hasCancelled = !0;
      }
    } : inputPromise;
  }
  function windowScrollPosition2() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || 0
    };
  }
  function getHtmlElementOffset(element) {
    if (element) {
      var rect = element.getBoundingClientRect(), top = 0, left = 0, bottom = 0, right = 0;
      return rect.top !== void 0 && rect.left !== void 0 && (top = rect.top + window.pageYOffset, left = rect.left + window.pageXOffset, right = rect.right, bottom = rect.bottom), { top, left, bottom, right };
    }
  }
  function hideTooltip() {
    _cancellablePromise && _cancellablePromise.cancel && _cancellablePromise.cancel();
    var prevTooltip = document.body.querySelector("." + _cellTooltipOptions.className + "." + _grid.getUID());
    prevTooltip && prevTooltip.remove && prevTooltip.remove();
  }
  function reposition(cell) {
    if (_tooltipElm) {
      _cellNodeElm = _cellNodeElm || _grid.getCellNode(cell.row, cell.cell);
      var cellPosition = getHtmlElementOffset(_cellNodeElm), cellContainerWidth = _cellNodeElm.offsetWidth, calculatedTooltipHeight = _tooltipElm.getBoundingClientRect().height, calculatedTooltipWidth = _tooltipElm.getBoundingClientRect().width, calculatedBodyWidth = document.body.offsetWidth || window.innerWidth, newPositionTop = cellPosition.top - _tooltipElm.offsetHeight - (_cellTooltipOptions.offsetTopBottom || 0), newPositionLeft = (cellPosition && cellPosition.left || 0) - (_cellTooltipOptions.offsetRight || 0), position = _cellTooltipOptions.position || "auto";
      position === "center" ? (newPositionLeft += cellContainerWidth / 2 - calculatedTooltipWidth / 2 + (_cellTooltipOptions.offsetRight || 0), _tooltipElm.classList.remove("arrow-left-align"), _tooltipElm.classList.remove("arrow-right-align"), _tooltipElm.classList.add("arrow-center-align")) : position === "right-align" || (position === "auto" || position !== "left-align") && newPositionLeft + calculatedTooltipWidth > calculatedBodyWidth ? (newPositionLeft -= calculatedTooltipWidth - cellContainerWidth - (_cellTooltipOptions.offsetLeft || 0), _tooltipElm.classList.remove("arrow-center-align"), _tooltipElm.classList.remove("arrow-left-align"), _tooltipElm.classList.add("arrow-right-align")) : (_tooltipElm.classList.remove("arrow-center-align"), _tooltipElm.classList.remove("arrow-right-align"), _tooltipElm.classList.add("arrow-left-align")), position === "bottom" || position === "auto" && calculatedTooltipHeight > calculateAvailableSpaceTop(_cellNodeElm) ? (newPositionTop = cellPosition.top + (_gridOptions.rowHeight || 0) + (_cellTooltipOptions.offsetTopBottom || 0), _tooltipElm.classList.remove("arrow-down"), _tooltipElm.classList.add("arrow-up")) : (_tooltipElm.classList.add("arrow-down"), _tooltipElm.classList.remove("arrow-up")), _tooltipElm.style.top = newPositionTop + "px", _tooltipElm.style.left = newPositionLeft + "px";
    }
  }
  function parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item) {
    if (typeof formatterOrText == "function") {
      var tooltipText = formatterOrText(cell.row, cell.cell, value, columnDef, item, _grid), formatterText = typeof tooltipText == "object" && tooltipText && tooltipText.text ? tooltipText.text : typeof tooltipText == "string" ? tooltipText : "";
      return _grid.sanitizeHtmlString(formatterText);
    } else if (typeof formatterOrText == "string")
      return _grid.sanitizeHtmlString(formatterOrText);
    return "";
  }
  function renderTooltipFormatter(formatter, cell, value, columnDef, item, tooltipText, inputTitleElm) {
    _tooltipElm = document.createElement("div"), _tooltipElm.className = _cellTooltipOptions.className, _tooltipElm.classList.add(_grid.getUID()), _tooltipElm.classList.add("l" + cell.cell), _tooltipElm.classList.add("r" + cell.cell);
    var outputText = tooltipText || parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || "";
    outputText = _cellTooltipOptions.tooltipTextMaxLength && outputText.length > _cellTooltipOptions.tooltipTextMaxLength ? outputText.substring(0, _cellTooltipOptions.tooltipTextMaxLength - 3) + "..." : outputText;
    let finalOutputText = "";
    !tooltipText || _cellTooltipOptions && _cellTooltipOptions.renderRegularTooltipAsHtml ? (finalOutputText = _grid.sanitizeHtmlString(outputText), _tooltipElm.innerHTML = finalOutputText, _tooltipElm.style.whiteSpace = _cellTooltipOptions && _cellTooltipOptions.whiteSpace || _defaults.whiteSpace) : (finalOutputText = outputText || "", _tooltipElm.textContent = finalOutputText, _tooltipElm.style.whiteSpace = _cellTooltipOptions && _cellTooltipOptions.regularTooltipWhiteSpace || _defaults.regularTooltipWhiteSpace), _cellTooltipOptions.maxHeight && (_tooltipElm.style.maxHeight = _cellTooltipOptions.maxHeight + "px"), _cellTooltipOptions.maxWidth && (_tooltipElm.style.maxWidth = _cellTooltipOptions.maxWidth + "px"), finalOutputText && (document.body.appendChild(_tooltipElm), reposition(cell), _cellTooltipOptions.hideArrow || _tooltipElm.classList.add("tooltip-arrow"), swapAndClearTitleAttribute(inputTitleElm, outputText));
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  function setOptions(newOptions) {
    _options = Utils19.extend({}, _options, newOptions);
  }
  Utils19.extend(this, {
    init,
    destroy,
    hide: hideTooltip,
    setOptions,
    pluginName: "CustomTooltip"
  });
}

// src/plugins/slick.draggablegrouping.js
var BindingEventService9 = BindingEventService, SlickEvent12 = Event, EventHandler8 = EventHandler, Utils20 = Utils;
function DraggableGrouping(options) {
  var _grid, _gridUid, _gridColumns, _dataView, _dropzoneElm, _droppableInstance, dropzonePlaceholder, groupToggler, _defaults = {}, onGroupChanged = new SlickEvent12(), _bindingEventService = new BindingEventService9(), _handler = new EventHandler8(), _sortableLeftInstance, _sortableRightInstance;
  function init(grid) {
    options = Utils20.extend(!0, {}, _defaults, options), _grid = grid, _gridUid = _grid.getUID(), _gridColumns = _grid.getColumns(), _dataView = _grid.getData(), _dropzoneElm = grid.getPreHeaderPanel(), _dropzoneElm.classList.add("slick-dropzone");
    var dropPlaceHolderText = options.dropPlaceHolderText || "Drop a column header here to group by the column";
    dropzonePlaceholder = document.createElement("div"), dropzonePlaceholder.className = "slick-placeholder", dropzonePlaceholder.textContent = dropPlaceHolderText, groupToggler = document.createElement("div"), groupToggler.className = "slick-group-toggle-all expanded", groupToggler.style.display = "none", _dropzoneElm.appendChild(dropzonePlaceholder), _dropzoneElm.appendChild(groupToggler), setupColumnDropbox(), _handler.subscribe(_grid.onHeaderCellRendered, function(e, args) {
      var column = args.column, node = args.node;
      if (!Utils20.isEmptyObject(column.grouping) && node && (node.style.cursor = "pointer", options.groupIconCssClass || options.groupIconImage)) {
        let groupableIconElm = document.createElement("span");
        groupableIconElm.className = "slick-column-groupable", options.groupIconCssClass && groupableIconElm.classList.add(...options.groupIconCssClass.split(" ")), options.groupIconImage && (groupableIconElm.style.background = "url(" + options.groupIconImage + ") no-repeat center center"), node.appendChild(groupableIconElm);
      }
    });
    for (var i2 = 0; i2 < _gridColumns.length; i2++) {
      var columnId = _gridColumns[i2].field;
      _grid.updateColumnHeader(columnId);
    }
  }
  function setupColumnReorder(grid, headers, _headerColumnWidthDiff, setColumns, setupColumnResize, _columns, getColumnIndex, _uid, trigger) {
    let dropzoneElm = grid.getPreHeaderPanel();
    var sortableOptions = {
      animation: 50,
      // chosenClass: 'slick-header-column-active',
      ghostClass: "slick-sortable-placeholder",
      draggable: ".slick-header-column",
      dataIdAttr: "data-id",
      group: {
        name: "shared",
        pull: "clone",
        put: !1
      },
      revertClone: !0,
      // filter: function (_e, target) {
      //   // block column from being able to be dragged if it's already a grouped column
      //   // NOTE: need to disable for now since it also blocks the column reordering
      //   return columnsGroupBy.some(c => c.id === target.getAttribute('data-id'));
      // },
      onStart: function() {
        dropzoneElm.classList.add("slick-dropzone-hover"), dropzoneElm.classList.add("slick-dropzone-placeholder-hover");
        let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
        draggablePlaceholderElm.style.display = "inline-block", groupToggler.style.display = "none", dropzoneElm.querySelectorAll(".slick-dropped-grouping").forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "none");
      },
      onEnd: function(e) {
        let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
        dropzoneElm.classList.remove("slick-dropzone-hover"), draggablePlaceholderElm.classList.remove("slick-dropzone-placeholder-hover"), dropzonePlaceholder && (dropzonePlaceholder.style.display = "none"), draggablePlaceholderElm && draggablePlaceholderElm.parentElement && draggablePlaceholderElm.parentElement.classList.remove("slick-dropzone-placeholder-hover");
        let droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
        if (droppedGroupingElms.forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "inline-flex"), droppedGroupingElms.length && (draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "none"), groupToggler.style.display = "inline-block"), !grid.getEditorLock().commitCurrentEdit())
          return;
        let reorderedIds = _sortableLeftInstance && _sortableLeftInstance.toArray() || [];
        if (headers.length > 1) {
          let ids = _sortableRightInstance && _sortableRightInstance.toArray() || [];
          for (let id of ids)
            reorderedIds.push(id);
        }
        let finalReorderedColumns = [], reorderedColumns = grid.getColumns();
        for (let reorderedId of reorderedIds)
          finalReorderedColumns.push(reorderedColumns[getColumnIndex(reorderedId)]);
        setColumns(finalReorderedColumns), trigger(grid.onColumnsReordered, { grid }), e.stopPropagation(), setupColumnResize();
      }
    };
    return _sortableLeftInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-left`), sortableOptions), _sortableRightInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-right`), sortableOptions), {
      sortableLeftInstance: _sortableLeftInstance,
      sortableRightInstance: _sortableRightInstance
    };
  }
  function destroy() {
    _sortableLeftInstance && _sortableLeftInstance.el && _sortableLeftInstance.destroy(), _sortableRightInstance && _sortableRightInstance.el && _sortableRightInstance.destroy(), onGroupChanged.unsubscribe(), _handler.unsubscribeAll(), _bindingEventService.unbindAll(), Utils20.emptyElement(document.querySelector(`.${_gridUid} .slick-preheader-panel`));
  }
  function addDragOverDropzoneListeners() {
    let draggablePlaceholderElm = _dropzoneElm.querySelector(".slick-placeholder");
    draggablePlaceholderElm && (_bindingEventService.bind(draggablePlaceholderElm, "dragover", (e) => e.preventDefault), _bindingEventService.bind(draggablePlaceholderElm, "dragenter", () => _dropzoneElm.classList.add("slick-dropzone-hover")), _bindingEventService.bind(draggablePlaceholderElm, "dragleave", () => _dropzoneElm.classList.remove("slick-dropzone-hover")));
  }
  function setupColumnDropbox() {
    let dropzoneElm = _dropzoneElm;
    _droppableInstance = Sortable.create(dropzoneElm, {
      group: "shared",
      // chosenClass: 'slick-header-column-active',
      ghostClass: "slick-droppable-sortitem-hover",
      draggable: ".slick-dropped-grouping",
      dragoverBubble: !0,
      onAdd: (evt) => {
        let el = evt.item, elId = el.getAttribute("id");
        elId && elId.replace(_gridUid, "") && handleGroupByDrop(dropzoneElm, Sortable.utils.clone(evt.item)), evt.clone.style.opacity = ".5", el.parentNode && el.parentNode.removeChild(el);
      },
      onUpdate: () => {
        let sortArray = _droppableInstance && _droppableInstance.toArray() || [], newGroupingOrder = [];
        for (var i2 = 0, l = sortArray.length; i2 < l; i2++)
          for (var a = 0, b = columnsGroupBy.length; a < b; a++)
            if (columnsGroupBy[a].id == sortArray[i2]) {
              newGroupingOrder.push(columnsGroupBy[a]);
              break;
            }
        columnsGroupBy = newGroupingOrder, updateGroupBy("sort-group");
      }
    }), addDragOverDropzoneListeners(), groupToggler && _bindingEventService.bind(groupToggler, "click", (event) => {
      let target = event.target;
      toggleGroupToggler(target, target && target.classList.contains("expanded"));
    });
  }
  var columnsGroupBy = [];
  function handleGroupByDrop(containerElm, headerColumnElm) {
    let headerColDataId = headerColumnElm.getAttribute("data-id"), columnId = headerColDataId && headerColDataId.replace(_gridUid, ""), columnAllowed = !0;
    for (let colGroupBy of columnsGroupBy)
      colGroupBy.id === columnId && (columnAllowed = !1);
    if (columnAllowed) {
      for (let col of _gridColumns)
        if (col.id === columnId && col.grouping && !Utils20.isEmptyObject(col.grouping)) {
          let columnNameElm = headerColumnElm.querySelector(".slick-column-name"), entryElm = document.createElement("div");
          entryElm.id = `${_gridUid}_${col.id}_entry`, entryElm.className = "slick-dropped-grouping", entryElm.dataset.id = `${col.id}`;
          let groupTextElm = document.createElement("div");
          groupTextElm.className = "slick-dropped-grouping-title", groupTextElm.style.display = "inline-flex", groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent, entryElm.appendChild(groupTextElm);
          let groupRemoveIconElm = document.createElement("div");
          groupRemoveIconElm.className = "slick-groupby-remove", options.deleteIconCssClass && groupRemoveIconElm.classList.add(...options.deleteIconCssClass.split(" ")), options.deleteIconImage && groupRemoveIconElm.classList.add(...options.deleteIconImage.split(" ")), options.deleteIconCssClass || groupRemoveIconElm.classList.add("slick-groupby-remove-icon"), !options.deleteIconCssClass && !options.deleteIconImage && groupRemoveIconElm.classList.add("slick-groupby-remove-image"), options && options.hideGroupSortIcons !== !0 && col.sortable && col.grouping && col.grouping.sortAsc === void 0 && (col.grouping.sortAsc = !0), entryElm.appendChild(groupRemoveIconElm), entryElm.appendChild(document.createElement("div")), containerElm.appendChild(entryElm), addColumnGroupBy(col), addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
        }
      groupToggler.style.display = "inline-block";
    }
  }
  function addColumnGroupBy(column) {
    columnsGroupBy.push(column), updateGroupBy("add-group");
  }
  function addGroupByRemoveClickHandler(id, groupRemoveIconElm, headerColumnElm, entry) {
    _bindingEventService.bind(groupRemoveIconElm, "click", () => {
      let boundedElms = _bindingEventService.boundedEvents.filter((boundedEvent) => boundedEvent.element === groupRemoveIconElm);
      for (let boundedEvent of boundedElms)
        _bindingEventService.unbind(boundedEvent.element, "click", boundedEvent.listener);
      removeGroupBy(id, headerColumnElm, entry);
    });
  }
  function setDroppedGroups(groupingInfo) {
    let groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
    dropzonePlaceholder.style.display = "none";
    for (let groupInfo of groupingInfos) {
      let columnElm = _grid.getHeaderColumn(groupInfo);
      handleGroupByDrop(_dropzoneElm, columnElm);
    }
  }
  function clearDroppedGroups() {
    columnsGroupBy = [], updateGroupBy("clear-all");
    let allDroppedGroupingElms = _dropzoneElm.querySelectorAll(".slick-dropped-grouping");
    groupToggler.style.display = "none";
    for (let groupElm of Array.from(allDroppedGroupingElms)) {
      let groupRemoveBtnElm = _dropzoneElm.querySelector(".slick-groupby-remove");
      groupRemoveBtnElm && groupRemoveBtnElm.remove(), groupElm && groupElm.remove();
    }
    dropzonePlaceholder.style.display = "inline-block";
  }
  function removeFromArray(arr) {
    for (var what, a = arguments, L = a.length, ax; L > 1 && arr.length; )
      for (what = a[--L]; (ax = arr.indexOf(what)) != -1; )
        arr.splice(ax, 1);
    return arr;
  }
  function removeGroupBy(id, _column, entry) {
    entry.remove();
    var groupby = [];
    _gridColumns.forEach(function(e) {
      groupby[e.id] = e;
    }), removeFromArray(columnsGroupBy, groupby[id]), columnsGroupBy.length === 0 && (dropzonePlaceholder.style = "block", groupToggler.style.display = "none"), updateGroupBy("remove-group");
  }
  function toggleGroupToggler(targetElm, collapsing = !0, shouldExecuteDataViewCommand = !0) {
    targetElm && (collapsing === !0 ? (targetElm.classList.add("collapsed"), targetElm.classList.remove("expanded"), shouldExecuteDataViewCommand && _dataView.collapseAllGroups()) : (targetElm.classList.remove("collapsed"), targetElm.classList.add("expanded"), shouldExecuteDataViewCommand && _dataView.expandAllGroups()));
  }
  function updateGroupBy(originator) {
    if (columnsGroupBy.length === 0) {
      _dataView.setGrouping([]), onGroupChanged.notify({ caller: originator, groupColumns: [] });
      return;
    }
    var groupingArray = [];
    columnsGroupBy.forEach(function(element) {
      groupingArray.push(element.grouping);
    }), _dataView.setGrouping(groupingArray), onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
  }
  Utils20.extend(this, {
    init,
    destroy,
    pluginName: "DraggableGrouping",
    onGroupChanged,
    setDroppedGroups,
    clearDroppedGroups,
    getSetupColumnReorder: setupColumnReorder
  });
}

// src/plugins/slick.headerbuttons.js
var BindingEventService10 = BindingEventService, SlickEvent13 = Event, EventHandler9 = EventHandler, Utils21 = Utils;
function HeaderButtons(options) {
  var _grid, _self = this, _handler = new EventHandler9(), _bindingEventService = new BindingEventService10(), _defaults = {
    buttonCssClass: "slick-header-button"
  };
  function init(grid) {
    options = Utils21.extend(!0, {}, _defaults, options), _grid = grid, _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy), _grid.setColumns(_grid.getColumns());
  }
  function destroy() {
    _handler.unsubscribeAll(), _bindingEventService.unbindAll();
  }
  function handleHeaderCellRendered(e, args) {
    var column = args.column;
    if (column.header && column.header.buttons)
      for (var i2 = column.header.buttons.length; i2--; ) {
        var button = column.header.buttons[i2], isItemVisible = runOverrideFunctionWhenExists(button.itemVisibilityOverride, args), isItemUsable = runOverrideFunctionWhenExists(button.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(button, "itemUsabilityOverride") && (button.disabled = !isItemUsable);
        let btn = document.createElement("div");
        btn.className = options.buttonCssClass, btn.ariaLabel = "Header Button", btn.role = "button", button.disabled && btn.classList.add("slick-header-button-disabled"), button.showOnHover && btn.classList.add("slick-header-button-hidden"), button.image && (btn.style.backgroundImage = "url(" + button.image + ")"), button.cssClass && btn.classList.add(...button.cssClass.split(" ")), button.tooltip && (btn.title = button.tooltip), button.handler && _bindingEventService.bind(btn, "click", button.handler), _bindingEventService.bind(btn, "click", handleButtonClick.bind(this, button, args.column)), args.node.appendChild(btn);
      }
  }
  function handleBeforeHeaderCellDestroy(e, args) {
    var column = args.column;
    if (column.header && column.header.buttons) {
      let buttonCssClass = (options.buttonCssClass || "").replace(/(\s+)/g, ".");
      buttonCssClass && args.node.querySelectorAll(`.${buttonCssClass}`).forEach((elm) => elm.remove());
    }
  }
  function handleButtonClick(button, columnDef, e) {
    let command = button.command || "", callbackArgs = {
      grid: _grid,
      column: columnDef,
      button
    };
    command != null && (callbackArgs.command = command), typeof button.action == "function" && button.action.call(this, e, callbackArgs), command != null && !button.disabled && (_self.onCommand.notify(callbackArgs, e, _self), _grid.updateColumnHeader(columnDef.id)), e.preventDefault(), e.stopPropagation();
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  Utils21.extend(this, {
    init,
    destroy,
    pluginName: "HeaderButtons",
    onCommand: new SlickEvent13()
  });
}

// src/plugins/slick.headermenu.js
var BindingEventService11 = BindingEventService, SlickEvent14 = Event, EventHandler10 = EventHandler, Utils22 = Utils;
function HeaderMenu(options) {
  var _grid, _self = this, _handler = new EventHandler10(), _bindingEventService = new BindingEventService11(), _defaults = {
    buttonCssClass: null,
    buttonImage: null,
    minWidth: 100,
    autoAlign: !0,
    autoAlignOffset: 0
  }, _activeHeaderColumnElm, _menuElm;
  function init(grid) {
    options = Utils22.extend(!0, {}, _defaults, options), _grid = grid, _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy), _grid.setColumns(_grid.getColumns()), _bindingEventService.bind(document.body, "mousedown", handleBodyMouseDown.bind(this));
  }
  function setOptions(newOptions) {
    options = Utils22.extend(!0, {}, options, newOptions);
  }
  function getGridUidSelector() {
    let gridUid = _grid.getUID() || "";
    return gridUid ? `.${gridUid}` : "";
  }
  function destroy() {
    _handler.unsubscribeAll(), _bindingEventService.unbindAll(), _menuElm = _menuElm || document.body.querySelector(`.slick-header-menu${getGridUidSelector()}`), _menuElm && _menuElm.remove(), _activeHeaderColumnElm = void 0;
  }
  function handleBodyMouseDown(e) {
    (_menuElm !== e.target && !(_menuElm && _menuElm.contains(e.target)) || e.target.className === "close") && hideMenu();
  }
  function hideMenu() {
    _menuElm && (_menuElm.remove(), _menuElm = void 0), _activeHeaderColumnElm && _activeHeaderColumnElm.classList.remove("slick-header-column-active");
  }
  function handleHeaderCellRendered(e, args) {
    var column = args.column, menu = column.header && column.header.menu;
    if (menu) {
      if (!runOverrideFunctionWhenExists(options.menuUsabilityOverride, args))
        return;
      let elm = document.createElement("div");
      if (elm.className = "slick-header-menubutton", elm.ariaLabel = "Header Menu", elm.role = "button", !options.buttonCssClass && !options.buttonImage && (options.buttonCssClass = "caret"), options.buttonCssClass) {
        let icon = document.createElement("span");
        icon.classList.add(...options.buttonCssClass.split(" ")), elm.appendChild(icon);
      }
      options.buttonImage && (elm.style.backgroundImage = "url(" + options.buttonImage + ")"), options.tooltip && (elm.title = options.tooltip), _bindingEventService.bind(elm, "click", (e2) => showMenu(e2, menu, args.column)), args.node.appendChild(elm);
    }
  }
  function handleBeforeHeaderCellDestroy(e, args) {
    var column = args.column;
    column.header && column.header.menu && args.node.querySelectorAll(".slick-header-menubutton").forEach((elm) => elm.remove());
  }
  function showMenu(event, menu, columnDef) {
    var callbackArgs = {
      grid: _grid,
      column: columnDef,
      menu
    };
    if (_self.onBeforeMenuShow.notify(callbackArgs, event, _self).getReturnValue() == !1)
      return;
    if (!_menuElm) {
      _menuElm = document.createElement("div"), _menuElm.className = "slick-header-menu", _menuElm.role = "menu", _menuElm.style.minWidth = `${options.minWidth}px`, _menuElm.setAttribute("aria-expanded", "true");
      let containerNode = _grid.getContainerNode();
      containerNode && containerNode.appendChild(_menuElm);
    }
    Utils22.emptyElement(_menuElm);
    for (var i2 = 0; i2 < menu.items.length; i2++) {
      var item = menu.items[i2], isItemVisible = runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
      if (!isItemVisible)
        continue;
      Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
      let menuItem = document.createElement("div");
      if (menuItem.className = "slick-header-menuitem", menuItem.role = "menuitem", item.divider || item === "divider") {
        menuItem.classList.add("slick-header-menuitem-divider");
        continue;
      }
      item.disabled && menuItem.classList.add("slick-header-menuitem-disabled"), item.hidden && menuItem.classList.add("slick-header-menuitem-hidden"), item.cssClass && menuItem.classList.add(...item.cssClass.split(" ")), item.tooltip && (menuItem.title = item.tooltip);
      let iconElm = document.createElement("div");
      iconElm.className = "slick-header-menuicon", menuItem.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = "url(" + item.iconImage + ")");
      let textElm = document.createElement("span");
      textElm.className = "slick-header-menucontent", textElm.textContent = item.title, menuItem.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), _menuElm.appendChild(menuItem), _bindingEventService.bind(menuItem, "click", handleMenuItemClick.bind(this, item, columnDef));
    }
    let buttonElm = event.target, btnOffset = Utils22.offset(buttonElm), menuOffset = Utils22.offset(_menuElm), leftPos = btnOffset && btnOffset.left || 0;
    if (options.autoAlign) {
      let gridPos = _grid.getGridPosition();
      leftPos + _menuElm.offsetWidth >= gridPos.width && (leftPos = leftPos + buttonElm.clientWidth - _menuElm.clientWidth + (options.autoAlignOffset || 0));
    }
    _menuElm.style.top = `${(buttonElm.clientHeight || btnOffset && btnOffset.top || 0) + (options && options.menuOffsetTop || 0)}px`, _menuElm.style.left = `${leftPos - menuOffset.left}px`, _activeHeaderColumnElm = _menuElm.closest(".slick-header-column"), _activeHeaderColumnElm && _activeHeaderColumnElm.classList.add("slick-header-column-active"), _self.onAfterMenuShow.notify(callbackArgs, event, _self).getReturnValue() != !1 && (event.preventDefault(), event.stopPropagation());
  }
  function handleMenuItemClick(item, columnDef, e) {
    let command = item.command || "";
    if (item.disabled || item.divider || item === "divider")
      return !1;
    if (command != null && command !== "") {
      var callbackArgs = {
        grid: _grid,
        column: columnDef,
        command,
        item
      };
      _self.onCommand.notify(callbackArgs, e, _self), typeof item.action == "function" && item.action.call(this, e, callbackArgs);
    }
    e.defaultPrevented || hideMenu(), e.preventDefault(), e.stopPropagation();
  }
  function runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  Utils22.extend(this, {
    init,
    destroy,
    pluginName: "HeaderMenu",
    setOptions,
    onAfterMenuShow: new SlickEvent14(),
    onBeforeMenuShow: new SlickEvent14(),
    onCommand: new SlickEvent14()
  });
}

// src/plugins/slick.resizer.js
var BindingEventService12 = BindingEventService, SlickEvent15 = Event, Utils23 = Utils;
function Resizer(_options, fixedDimensions) {
  let DATAGRID_MIN_HEIGHT = 180, DATAGRID_MIN_WIDTH = 300, DATAGRID_BOTTOM_PADDING = 20, _self = this, _fixedHeight, _fixedWidth, _grid, _gridOptions, _gridUid, _lastDimensions, _timer, _resizePaused = !1, _gridDomElm, _pageContainerElm, _gridContainerElm, _defaults = {
    bottomPadding: 20,
    applyResizeToContainer: !1,
    minHeight: 180,
    minWidth: 300,
    rightPadding: 0
  }, options = {}, _bindingEventService = new BindingEventService12();
  function setOptions(_newOptions) {
    options = Utils23.extend(!0, {}, _defaults, options, _newOptions);
  }
  function init(grid) {
    setOptions(_options), _grid = grid, _gridOptions = _grid.getOptions(), _gridUid = _grid.getUID(), _gridDomElm = _grid.getContainerNode(), typeof _options.container == "string" ? _pageContainerElm = typeof _options.container == "string" ? document.querySelector(_options.container) : _options.container : _pageContainerElm = _options.container, options.gridContainer && (_gridContainerElm = options.gridContainer), fixedDimensions && (_fixedHeight = fixedDimensions.height, _fixedWidth = fixedDimensions.width), _gridOptions && bindAutoResizeDataGrid();
  }
  function bindAutoResizeDataGrid(newSizes) {
    let gridElmOffset = Utils23.offset(_gridDomElm);
    (_gridDomElm !== void 0 || gridElmOffset !== void 0) && (resizeGrid(0, newSizes, null), _bindingEventService.bind(window, "resize", function(event) {
      _self.onGridBeforeResize.notify({ grid: _grid }, event, _self), _resizePaused || (resizeGrid(0, newSizes, event), resizeGrid(0, newSizes, event));
    }));
  }
  function calculateGridNewDimensions() {
    let gridElmOffset = Utils23.offset(_gridDomElm);
    if (!window || _pageContainerElm === void 0 || _gridDomElm === void 0 || gridElmOffset === void 0)
      return null;
    let bottomPadding = options && options.bottomPadding !== void 0 ? options.bottomPadding : DATAGRID_BOTTOM_PADDING, gridHeight = 0, gridOffsetTop = 0;
    options.calculateAvailableSizeBy === "container" ? gridHeight = Utils23.innerSize(_pageContainerElm, "height") || 0 : (gridHeight = window.innerHeight || 0, gridOffsetTop = gridElmOffset !== void 0 ? gridElmOffset.top : 0);
    let availableHeight = gridHeight - gridOffsetTop - bottomPadding, availableWidth = Utils23.innerSize(_pageContainerElm, "width") || window.innerWidth || 0, maxHeight = options && options.maxHeight || void 0, minHeight = options && options.minHeight !== void 0 ? options.minHeight : DATAGRID_MIN_HEIGHT, maxWidth = options && options.maxWidth || void 0, minWidth = options && options.minWidth !== void 0 ? options.minWidth : DATAGRID_MIN_WIDTH, newHeight = availableHeight, newWidth = options && options.rightPadding ? availableWidth - options.rightPadding : availableWidth;
    return newHeight < minHeight && (newHeight = minHeight), maxHeight && newHeight > maxHeight && (newHeight = maxHeight), newWidth < minWidth && (newWidth = minWidth), maxWidth && newWidth > maxWidth && (newWidth = maxWidth), {
      height: _fixedHeight || newHeight,
      width: _fixedWidth || newWidth
    };
  }
  function destroy() {
    _self.onGridBeforeResize.unsubscribe(), _self.onGridAfterResize.unsubscribe(), _bindingEventService.unbindAll();
  }
  function getLastResizeDimensions() {
    return _lastDimensions;
  }
  function pauseResizer(isResizePaused) {
    _resizePaused = isResizePaused;
  }
  function resizeGrid(delay, newSizes, event) {
    if (delay = delay || 0, typeof Promise == "function")
      return new Promise(function(resolve) {
        delay > 0 ? (clearTimeout(_timer), _timer = setTimeout(function() {
          resolve(resizeGridCallback(newSizes, event));
        }, delay)) : resolve(resizeGridCallback(newSizes, event));
      });
    delay > 0 ? (clearTimeout(_timer), _timer = setTimeout(function() {
      resizeGridCallback(newSizes, event);
    }, delay)) : resizeGridCallback(newSizes, event);
  }
  function resizeGridCallback(newSizes, event) {
    let lastDimensions = resizeGridWithDimensions(newSizes);
    return _self.onGridAfterResize.notify({ grid: _grid, dimensions: lastDimensions }, event, _self), lastDimensions;
  }
  function resizeGridWithDimensions(newSizes) {
    let availableDimensions = calculateGridNewDimensions();
    if ((newSizes || availableDimensions) && _gridDomElm)
      try {
        let newHeight = newSizes && newSizes.height ? newSizes.height : availableDimensions.height, newWidth = newSizes && newSizes.width ? newSizes.width : availableDimensions.width;
        _gridOptions.autoHeight || (_gridDomElm.style.height = `${newHeight}px`), _gridDomElm.style.width = `${newWidth}px`, _gridContainerElm && (_gridContainerElm.style.width = `${newWidth}px`), new RegExp("MSIE [6-8]").exec(navigator.userAgent) === null && _grid && _grid.resizeCanvas && _grid.resizeCanvas(), _gridOptions && _gridOptions.enableAutoSizeColumns && _grid.autosizeColumns && _gridUid && document.querySelector(`.${_gridUid}`) && _grid.autosizeColumns(), _lastDimensions = {
          height: newHeight,
          width: newWidth
        };
      } catch {
        destroy();
      }
    return _lastDimensions;
  }
  Utils23.extend(this, {
    init,
    destroy,
    pluginName: "Resizer",
    bindAutoResizeDataGrid,
    getLastResizeDimensions,
    pauseResizer,
    resizeGrid,
    setOptions,
    onGridAfterResize: new SlickEvent15(),
    onGridBeforeResize: new SlickEvent15()
  });
}

// src/plugins/slick.rowdetailview.js
var SlickEvent16 = Event, EventHandler11 = EventHandler, Utils24 = Utils;
function RowDetailView(options) {
  var _grid, _gridOptions, _gridUid, _dataView, _dataViewIdProperty = "id", _expandableOverride = null, _self = this, _lastRange = null, _expandedRows = [], _handler = new EventHandler11(), _outsideRange = 5, _visibleRenderedCellCount = 0, _defaults = {
    columnId: "_detail_selector",
    cssClass: "detailView-toggle",
    expandedClass: null,
    collapsedClass: null,
    keyPrefix: "_",
    loadOnce: !1,
    collapseAllOnSort: !0,
    saveDetailViewOnScroll: !0,
    singleRowExpand: !1,
    useSimpleViewportCalc: !1,
    alwaysRenderColumn: !0,
    toolTip: "",
    width: 30,
    maxRows: null
  }, _keyPrefix = _defaults.keyPrefix, _gridRowBuffer = 0, _rowIdsOutOfViewport = [], _options = Utils24.extend(!0, {}, _defaults, options);
  typeof _options.expandableOverride == "function" && expandableOverride(_options.expandableOverride);
  function init(grid) {
    if (!grid)
      throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
    _grid = grid, _gridUid = grid.getUID(), _gridOptions = grid.getOptions() || {}, _dataView = _grid.getData(), _keyPrefix = _options && _options.keyPrefix || "_", _gridRowBuffer = _grid.getOptions().minRowBuffer, _grid.getOptions().minRowBuffer = _options.panelRows + 3, _handler.subscribe(_grid.onClick, handleClick).subscribe(_grid.onScroll, handleScroll), _options.collapseAllOnSort && (_handler.subscribe(_grid.onSort, collapseAll), _expandedRows = [], _rowIdsOutOfViewport = []), _handler.subscribe(_grid.getData().onRowCountChanged, function() {
      _grid.updateRowCount(), _grid.render();
    }), _handler.subscribe(_grid.getData().onRowsChanged, function(e, a) {
      _grid.invalidateRows(a.rows), _grid.render();
    }), subscribeToOnAsyncResponse(), _handler.subscribe(_dataView.onSetItemsCalled, function() {
      _dataViewIdProperty = _dataView && _dataView.getIdPropertyName() || "id";
    }), _options.useSimpleViewportCalc && _handler.subscribe(_grid.onRendered, function(e, args) {
      args && args.endRow && (_visibleRenderedCellCount = args.endRow - args.startRow);
    });
  }
  function destroy() {
    _handler.unsubscribeAll(), _self.onAsyncResponse.unsubscribe(), _self.onAsyncEndUpdate.unsubscribe(), _self.onAfterRowDetailToggle.unsubscribe(), _self.onBeforeRowDetailToggle.unsubscribe(), _self.onRowOutOfViewportRange.unsubscribe(), _self.onRowBackToViewportRange.unsubscribe();
  }
  function getOptions() {
    return _options;
  }
  function setOptions(options2) {
    _options = Utils24.extend(!0, {}, _options, options2), _options && _options.singleRowExpand && collapseAll();
  }
  function arrayFindIndex(sourceArray, value) {
    if (sourceArray) {
      for (var i2 = 0; i2 < sourceArray.length; i2++)
        if (sourceArray[i2] === value)
          return i2;
    }
    return -1;
  }
  function handleClick(e, args) {
    var dataContext = _grid.getDataItem(args.row);
    if (checkExpandableOverride(args.row, dataContext, _grid) && (_options.useRowClick || _grid.getColumns()[args.cell].id === _options.columnId && e.target.classList.contains(_options.cssClass || ""))) {
      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      _self.onBeforeRowDetailToggle.notify({
        grid: _grid,
        item: dataContext
      }, e, _self), toggleRowSelection(args.row, dataContext), _self.onAfterRowDetailToggle.notify({
        grid: _grid,
        item: dataContext,
        expandedRows: _expandedRows
      }, e, _self), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  function handleScroll() {
    _options.useSimpleViewportCalc ? calculateOutOfRangeViewsSimplerVersion() : calculateOutOfRangeViews();
  }
  function calculateOutOfRangeViews() {
    if (_grid) {
      var renderedRange = _grid.getRenderedRange();
      if (_expandedRows.length > 0) {
        var scrollDir = "DOWN";
        if (_lastRange) {
          if (_lastRange.top === renderedRange.top && _lastRange.bottom === renderedRange.bottom)
            return;
          (_lastRange.top > renderedRange.top || // Or we are at very top but our bottom is increasing
          _lastRange.top === 0 && renderedRange.top === 0 && _lastRange.bottom > renderedRange.bottom) && (scrollDir = "UP");
        }
      }
      _expandedRows.forEach(function(row) {
        var rowIndex = _dataView.getRowById(row[_dataViewIdProperty]), rowPadding = row[_keyPrefix + "sizePadding"], rowOutOfRange = arrayFindIndex(_rowIdsOutOfViewport, row[_dataViewIdProperty]) >= 0;
        scrollDir === "UP" ? (_options.saveDetailViewOnScroll && rowIndex >= renderedRange.bottom - _gridRowBuffer && saveDetailView(row), rowOutOfRange && rowIndex - _outsideRange < renderedRange.top && rowIndex >= renderedRange.top ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : !rowOutOfRange && rowIndex + rowPadding > renderedRange.bottom && notifyOutOfViewport(row, row[_dataViewIdProperty])) : scrollDir === "DOWN" && (_options.saveDetailViewOnScroll && rowIndex <= renderedRange.top + _gridRowBuffer && saveDetailView(row), rowOutOfRange && rowIndex + rowPadding + _outsideRange > renderedRange.bottom && rowIndex < rowIndex + rowPadding ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : !rowOutOfRange && rowIndex < renderedRange.top && notifyOutOfViewport(row, row[_dataViewIdProperty]));
      }), _lastRange = renderedRange;
    }
  }
  function calculateOutOfRangeViewsSimplerVersion() {
    if (_grid) {
      var renderedRange = _grid.getRenderedRange();
      _expandedRows.forEach(function(row) {
        var rowIndex = _dataView.getRowById(row[_dataViewIdProperty]), isOutOfVisibility = checkIsRowOutOfViewportRange(rowIndex, renderedRange);
        !isOutOfVisibility && arrayFindIndex(_rowIdsOutOfViewport, row[_dataViewIdProperty]) >= 0 ? notifyBackToViewportWhenDomExist(row, row[_dataViewIdProperty]) : isOutOfVisibility && notifyOutOfViewport(row, row[_dataViewIdProperty]);
      });
    }
  }
  function checkIsRowOutOfViewportRange(rowIndex, renderedRange) {
    return Math.abs(renderedRange.bottom - _gridRowBuffer - rowIndex) > _visibleRenderedCellCount * 2;
  }
  function notifyOutOfViewport(item, rowId) {
    var rowIndex = item.rowIndex || _dataView.getRowById(item[_dataViewIdProperty]);
    _self.onRowOutOfViewportRange.notify({
      grid: _grid,
      item,
      rowId,
      rowIndex,
      expandedRows: _expandedRows,
      rowIdsOutOfViewport: syncOutOfViewportArray(rowId, !0)
    }, null, _self);
  }
  function notifyBackToViewportWhenDomExist(item, rowId) {
    var rowIndex = item.rowIndex || _dataView.getRowById(item[_dataViewIdProperty]);
    setTimeout(function() {
      document.querySelector(`.${_gridUid} .cellDetailView_${item[_dataViewIdProperty]}`) && _self.onRowBackToViewportRange.notify({
        grid: _grid,
        item,
        rowId,
        rowIndex,
        expandedRows: _expandedRows,
        rowIdsOutOfViewport: syncOutOfViewportArray(rowId, !1)
      }, null, _self);
    }, 100);
  }
  function syncOutOfViewportArray(rowId, isAdding) {
    var arrayRowIndex = arrayFindIndex(_rowIdsOutOfViewport, rowId);
    return isAdding && arrayRowIndex < 0 ? _rowIdsOutOfViewport.push(rowId) : !isAdding && arrayRowIndex >= 0 && _rowIdsOutOfViewport.splice(arrayRowIndex, 1), _rowIdsOutOfViewport;
  }
  function toggleRowSelection(rowNumber, dataContext) {
    checkExpandableOverride(rowNumber, dataContext, _grid) && (_dataView.beginUpdate(), handleAccordionShowHide(dataContext), _dataView.endUpdate());
  }
  function collapseAll() {
    _dataView.beginUpdate();
    for (var i2 = _expandedRows.length - 1; i2 >= 0; i2--)
      collapseDetailView(_expandedRows[i2], !0);
    _dataView.endUpdate();
  }
  function collapseDetailView(item, isMultipleCollapsing) {
    isMultipleCollapsing || _dataView.beginUpdate(), _options.loadOnce && saveDetailView(item), item[_keyPrefix + "collapsed"] = !0;
    for (var idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
      _dataView.deleteItem(item[_dataViewIdProperty] + "." + idx);
    item[_keyPrefix + "sizePadding"] = 0, _dataView.updateItem(item[_dataViewIdProperty], item), _expandedRows = _expandedRows.filter(function(r) {
      return r[_dataViewIdProperty] !== item[_dataViewIdProperty];
    }), isMultipleCollapsing || _dataView.endUpdate();
  }
  function expandDetailView(item) {
    if (_options && _options.singleRowExpand && collapseAll(), item[_keyPrefix + "collapsed"] = !1, _expandedRows.push(item), item[_keyPrefix + "detailContent"] || (item[_keyPrefix + "detailViewLoaded"] = !1), !item[_keyPrefix + "detailViewLoaded"] || _options.loadOnce !== !0)
      item[_keyPrefix + "detailContent"] = _options.preTemplate(item);
    else {
      _self.onAsyncResponse.notify({
        item,
        itemDetail: item,
        detailView: item[_keyPrefix + "detailContent"]
      }, void 0, this), applyTemplateNewLineHeight(item), _dataView.updateItem(item[_dataViewIdProperty], item);
      return;
    }
    applyTemplateNewLineHeight(item), _dataView.updateItem(item[_dataViewIdProperty], item), _options.process(item);
  }
  function saveDetailView(item) {
    let view = document.querySelector(`.${_gridUid} .innerDetailView_${item[_dataViewIdProperty]}`);
    if (view) {
      let html = view.innerHTML;
      html !== void 0 && (item[`${_keyPrefix}detailContent`] = html);
    }
  }
  function subscribeToOnAsyncResponse() {
    _self.onAsyncResponse.subscribe(function(e, args) {
      if (!args || !args.item && !args.itemDetail)
        throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
      var itemDetail = args.item || args.itemDetail;
      args.detailView ? itemDetail[_keyPrefix + "detailContent"] = args.detailView : itemDetail[_keyPrefix + "detailContent"] = _options.postTemplate(itemDetail), itemDetail[_keyPrefix + "detailViewLoaded"] = !0, _dataView.updateItem(itemDetail[_dataViewIdProperty], itemDetail), _self.onAsyncEndUpdate.notify({
        grid: _grid,
        item: itemDetail,
        itemDetail
      }, e, _self);
    });
  }
  function handleAccordionShowHide(item) {
    item && (item[_keyPrefix + "collapsed"] ? expandDetailView(item) : collapseDetailView(item));
  }
  var getPaddingItem = function(parent, offset2) {
    var item = {};
    for (var prop in _grid.getData())
      item[prop] = null;
    return item[_dataViewIdProperty] = parent[_dataViewIdProperty] + "." + offset2, item[_keyPrefix + "collapsed"] = !0, item[_keyPrefix + "isPadding"] = !0, item[_keyPrefix + "parent"] = parent, item[_keyPrefix + "offset"] = offset2, item;
  };
  function applyTemplateNewLineHeight(item) {
    var rowCount = _options.panelRows, lineHeight = 13;
    item[_keyPrefix + "sizePadding"] = Math.ceil(rowCount * 2 * lineHeight / _gridOptions.rowHeight), item[_keyPrefix + "height"] = item[_keyPrefix + "sizePadding"] * _gridOptions.rowHeight;
    for (var idxParent = _dataView.getIdxById(item[_dataViewIdProperty]), idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
      _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
  }
  function getColumnDefinition() {
    return {
      id: _options.columnId,
      name: "",
      toolTip: _options.toolTip,
      field: "sel",
      width: _options.width,
      resizable: !1,
      sortable: !1,
      alwaysRenderColumn: _options.alwaysRenderColumn,
      cssClass: _options.cssClass,
      formatter: detailSelectionFormatter
    };
  }
  function getExpandedRows() {
    return _expandedRows;
  }
  function detailSelectionFormatter(row, cell, value, columnDef, dataContext, grid) {
    if (checkExpandableOverride(row, dataContext, grid)) {
      if (dataContext[_keyPrefix + "collapsed"] == null && (dataContext[_keyPrefix + "collapsed"] = !0, dataContext[_keyPrefix + "sizePadding"] = 0, dataContext[_keyPrefix + "height"] = 0, dataContext[_keyPrefix + "isPadding"] = !1, dataContext[_keyPrefix + "parent"] = void 0, dataContext[_keyPrefix + "offset"] = 0), !dataContext[_keyPrefix + "isPadding"])
        if (dataContext[_keyPrefix + "collapsed"]) {
          var collapsedClasses = _options.cssClass + " expand ";
          return _options.collapsedClass && (collapsedClasses += _options.collapsedClass), '<div class="' + collapsedClasses + '"></div>';
        } else {
          var html = [], rowHeight = _gridOptions.rowHeight, outterHeight = dataContext[_keyPrefix + "sizePadding"] * _gridOptions.rowHeight;
          _options.maxRows !== null && dataContext[_keyPrefix + "sizePadding"] > _options.maxRows && (outterHeight = _options.maxRows * rowHeight, dataContext[_keyPrefix + "sizePadding"] = _options.maxRows);
          var expandedClasses = _options.cssClass + " collapse ";
          return _options.expandedClass && (expandedClasses += _options.expandedClass), html.push('<div class="' + expandedClasses + '"></div></div>'), html.push('<div class="dynamic-cell-detail cellDetailView_', dataContext[_dataViewIdProperty], '" '), html.push('style="height:', outterHeight, "px;"), html.push("top:", rowHeight, 'px">'), html.push('<div class="detail-container detailViewContainer_', dataContext[_dataViewIdProperty], '">'), html.push('<div class="innerDetailView_', dataContext[_dataViewIdProperty], '">', dataContext[_keyPrefix + "detailContent"], "</div></div>"), html.join("");
        }
    } else
      return null;
    return null;
  }
  function resizeDetailView(item) {
    if (item) {
      var mainContainer = document.querySelector("." + _gridUid + " .detailViewContainer_" + item[_dataViewIdProperty]), cellItem = document.querySelector("." + _gridUid + " .cellDetailView_" + item[_dataViewIdProperty]), inner = document.querySelector("." + _gridUid + " .innerDetailView_" + item[_dataViewIdProperty]);
      if (!(!mainContainer || !cellItem || !inner)) {
        for (var idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
          _dataView.deleteItem(item[_dataViewIdProperty] + "." + idx);
        var rowHeight = _gridOptions.rowHeight, lineHeight = 13;
        mainContainer.style.minHeight = null;
        var itemHeight = mainContainer.scrollHeight, rowCount = Math.ceil(itemHeight / rowHeight);
        item[_keyPrefix + "sizePadding"] = Math.ceil(rowCount * 2 * lineHeight / rowHeight), item[_keyPrefix + "height"] = itemHeight;
        var outterHeight = item[_keyPrefix + "sizePadding"] * rowHeight;
        _options.maxRows !== null && item[_keyPrefix + "sizePadding"] > _options.maxRows && (outterHeight = _options.maxRows * rowHeight, item[_keyPrefix + "sizePadding"] = _options.maxRows), _grid.getOptions().minRowBuffer < item[_keyPrefix + "sizePadding"] && (_grid.getOptions().minRowBuffer = item[_keyPrefix + "sizePadding"] + 3), mainContainer.setAttribute("style", "min-height: " + item[_keyPrefix + "height"] + "px"), cellItem && cellItem.setAttribute("style", "height: " + outterHeight + "px; top:" + rowHeight + "px");
        for (var idxParent = _dataView.getIdxById(item[_dataViewIdProperty]), idx = 1; idx <= item[_keyPrefix + "sizePadding"]; idx++)
          _dataView.insertItem(idxParent + idx, getPaddingItem(item, idx));
        saveDetailView(item);
      }
    }
  }
  function getFilterItem(item) {
    return item[_keyPrefix + "isPadding"] && item[_keyPrefix + "parent"] && (item = item[_keyPrefix + "parent"]), item;
  }
  function checkExpandableOverride(row, dataContext, grid) {
    return typeof _expandableOverride == "function" ? _expandableOverride(row, dataContext, grid) : !0;
  }
  function expandableOverride(overrideFn) {
    _expandableOverride = overrideFn;
  }
  Utils24.extend(this, {
    init,
    destroy,
    pluginName: "RowDetailView",
    collapseAll,
    collapseDetailView,
    expandDetailView,
    expandableOverride,
    getColumnDefinition,
    getExpandedRows,
    getFilterItem,
    getOptions,
    resizeDetailView,
    saveDetailView,
    setOptions,
    // events
    onAsyncResponse: new SlickEvent16(),
    onAsyncEndUpdate: new SlickEvent16(),
    onAfterRowDetailToggle: new SlickEvent16(),
    onBeforeRowDetailToggle: new SlickEvent16(),
    onRowOutOfViewportRange: new SlickEvent16(),
    onRowBackToViewportRange: new SlickEvent16()
  });
}

// src/plugins/slick.rowmovemanager.js
var SlickEvent17 = Event, EventHandler12 = EventHandler, Utils25 = Utils;
function RowMoveManager(options) {
  var _grid, _canvas, _dragging, _self = this, _usabilityOverride = null, _handler = new EventHandler12(), _defaults = {
    columnId: "_move",
    cssClass: null,
    cancelEditOnDrag: !1,
    disableRowSelection: !1,
    hideRowMoveShadow: !0,
    rowMoveShadowMarginTop: 0,
    rowMoveShadowMarginLeft: 0,
    rowMoveShadowOpacity: 0.95,
    rowMoveShadowScale: 0.75,
    singleRowMove: !1,
    width: 40
  };
  options && typeof options.usabilityOverride == "function" && usabilityOverride(options.usabilityOverride);
  function init(grid) {
    options = Utils25.extend(!0, {}, _defaults, options), _grid = grid, _canvas = _grid.getCanvasNode(), _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
  }
  function destroy() {
    _handler.unsubscribeAll();
  }
  function setOptions(newOptions) {
    options = Utils25.extend({}, options, newOptions);
  }
  function handleDragInit(e) {
    e.stopImmediatePropagation();
  }
  function handleDragStart(e, dd) {
    var cell = _grid.getCellFromEvent(e), currentRow = cell && cell.row, dataContext = _grid.getDataItem(currentRow);
    if (checkUsabilityOverride(currentRow, dataContext, _grid)) {
      if (options.cancelEditOnDrag && _grid.getEditorLock().isActive() && _grid.getEditorLock().cancelCurrentEdit(), _grid.getEditorLock().isActive() || !isHandlerColumn(cell.cell))
        return !1;
      if (_dragging = !0, e.stopImmediatePropagation(), !options.hideRowMoveShadow) {
        let cellNodeElm = _grid.getCellNode(cell.row, cell.cell), slickRowElm = cellNodeElm && cellNodeElm.closest(".slick-row");
        slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${options.rowMoveShadowScale || 0.75})`, _canvas.appendChild(dd.clonedSlickRow));
      }
      var selectedRows = options.singleRowMove ? [cell.row] : _grid.getSelectedRows();
      (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], options.disableRowSelection || _grid.setSelectedRows(selectedRows));
      var rowHeight = _grid.getOptions().rowHeight;
      dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${_canvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, _canvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${_canvas.clientWidth}px`, dd.guide.style.top = "-1000px", _canvas.appendChild(dd.guide), dd.insertBefore = -1;
    }
  }
  function handleDrag(evt, dd) {
    if (!_dragging)
      return;
    evt.stopImmediatePropagation();
    let e = evt.getNativeEvent();
    var targetEvent = e.touches ? e.touches[0] : e;
    let top = targetEvent.pageY - (Utils25.offset(_canvas).top || 0);
    dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
    var insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
    if (insertBefore !== dd.insertBefore) {
      var eventData = {
        grid: _grid,
        rows: dd.selectedRows,
        insertBefore
      };
      if (_self.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, _usabilityOverride && dd.canMove) {
        var insertBeforeDataContext = _grid.getDataItem(insertBefore);
        dd.canMove = checkUsabilityOverride(insertBefore, insertBeforeDataContext, _grid);
      }
      dd.canMove ? dd.guide.style.top = `${insertBefore * (_grid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
    }
  }
  function handleDragEnd(e, dd) {
    if (_dragging && (_dragging = !1, e.stopImmediatePropagation(), dd.guide.remove(), dd.selectionProxy.remove(), dd.clonedSlickRow && (dd.clonedSlickRow.remove(), dd.clonedSlickRow = null), dd.canMove)) {
      var eventData = {
        grid: _grid,
        rows: dd.selectedRows,
        insertBefore: dd.insertBefore
      };
      _self.onMoveRows.notify(eventData);
    }
  }
  function getColumnDefinition() {
    return {
      id: options.columnId || "_move",
      name: "",
      field: "move",
      width: options.width || 40,
      behavior: "selectAndMove",
      selectable: !1,
      resizable: !1,
      // cssClass: options.cssClass,
      formatter: moveIconFormatter
    };
  }
  function moveIconFormatter(row, cell, value, columnDef, dataContext, grid) {
    return checkUsabilityOverride(row, dataContext, grid) ? { addClasses: "cell-reorder dnd " + options.cssClass || "", text: "" } : null;
  }
  function checkUsabilityOverride(row, dataContext, grid) {
    return typeof _usabilityOverride == "function" ? _usabilityOverride(row, dataContext, grid) : !0;
  }
  function usabilityOverride(overrideFn) {
    _usabilityOverride = overrideFn;
  }
  function isHandlerColumn(columnIndex) {
    return /move|selectAndMove/.test(_grid.getColumns()[columnIndex].behavior);
  }
  Utils25.extend(this, {
    onBeforeMoveRows: new SlickEvent17(),
    onMoveRows: new SlickEvent17(),
    init,
    destroy,
    getColumnDefinition,
    setOptions,
    usabilityOverride,
    isHandlerColumn,
    pluginName: "RowMoveManager"
  });
}

// src/plugins/slick.rowselectionmodel.js
var EventData7 = EventData, EventHandler13 = EventHandler, keyCode6 = keyCode, SlickEvent18 = Event, SlickRange4 = Range, Draggable4 = Draggable, CellRangeDecorator3 = CellRangeDecorator, CellRangeSelector3 = CellRangeSelector, Utils26 = Utils;
function RowSelectionModel(options) {
  var _grid, _ranges = [], _self = this, _handler = new EventHandler13(), _inHandler, _options, _selector, _isRowMoveManagerHandler, _defaults = {
    selectActiveRow: !0,
    dragToSelect: !1,
    autoScrollWhenDrag: !0,
    cellRangeSelector: void 0
  };
  function init(grid) {
    if (typeof Draggable4 > "u")
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    if (_options = Utils26.extend(!0, {}, _defaults, options), _selector = _options.cellRangeSelector, _grid = grid, !_selector && _options.dragToSelect) {
      if (!CellRangeDecorator3)
        throw new Error("Slick.CellRangeDecorator is required when option dragToSelect set to true");
      _selector = new CellRangeSelector3({
        selectionCss: {
          border: "none"
        },
        autoScroll: _options.autoScrollWhenDrag
      });
    }
    _handler.subscribe(
      _grid.onActiveCellChanged,
      wrapHandler(handleActiveCellChange)
    ), _handler.subscribe(
      _grid.onKeyDown,
      wrapHandler(handleKeyDown)
    ), _handler.subscribe(
      _grid.onClick,
      wrapHandler(handleClick)
    ), _selector && (grid.registerPlugin(_selector), _selector.onCellRangeSelecting.subscribe(handleCellRangeSelected), _selector.onCellRangeSelected.subscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected));
  }
  function destroy() {
    _handler.unsubscribeAll(), _selector && (_selector.onCellRangeSelecting.unsubscribe(handleCellRangeSelected), _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected), _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected), _grid.unregisterPlugin(_selector), _selector.destroy && _selector.destroy());
  }
  function wrapHandler(handler) {
    return function() {
      _inHandler || (_inHandler = !0, handler.apply(this, arguments), _inHandler = !1);
    };
  }
  function rangesToRows(ranges) {
    for (var rows = [], i2 = 0; i2 < ranges.length; i2++)
      for (var j = ranges[i2].fromRow; j <= ranges[i2].toRow; j++)
        rows.push(j);
    return rows;
  }
  function rowsToRanges(rows) {
    for (var ranges = [], lastCell = _grid.getColumns().length - 1, i2 = 0; i2 < rows.length; i2++)
      ranges.push(new SlickRange4(rows[i2], 0, rows[i2], lastCell));
    return ranges;
  }
  function getRowsRange(from, to) {
    var i2, rows = [];
    for (i2 = from; i2 <= to; i2++)
      rows.push(i2);
    for (i2 = to; i2 < from; i2++)
      rows.push(i2);
    return rows;
  }
  function getSelectedRows() {
    return rangesToRows(_ranges);
  }
  function setSelectedRows(rows) {
    setSelectedRanges(rowsToRanges(rows), "SlickRowSelectionModel.setSelectedRows");
  }
  function setSelectedRanges(ranges, caller) {
    if (!((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0))) {
      _ranges = ranges;
      var eventData = new EventData7(null, _ranges);
      Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickRowSelectionModel.setSelectedRanges" } }), _self.onSelectedRangesChanged.notify(_ranges, eventData);
    }
  }
  function getSelectedRanges() {
    return _ranges;
  }
  function refreshSelections() {
    setSelectedRows(getSelectedRows());
  }
  function handleActiveCellChange(e, data) {
    _options.selectActiveRow && data.row != null && setSelectedRanges([new SlickRange4(data.row, 0, data.row, _grid.getColumns().length - 1)]);
  }
  function handleKeyDown(e) {
    var activeRow = _grid.getActiveCell();
    if (_grid.getOptions().multiSelect && activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == keyCode6.UP || e.which == keyCode6.DOWN)) {
      var selectedRows = getSelectedRows();
      selectedRows.sort(function(x, y) {
        return x - y;
      }), selectedRows.length || (selectedRows = [activeRow.row]);
      var top = selectedRows[0], bottom = selectedRows[selectedRows.length - 1], active;
      if (e.which == keyCode6.DOWN ? active = activeRow.row < bottom || top == bottom ? ++bottom : ++top : active = activeRow.row < bottom ? --bottom : --top, active >= 0 && active < _grid.getDataLength()) {
        _grid.scrollRowIntoView(active);
        var tempRanges = rowsToRanges(getRowsRange(top, bottom));
        setSelectedRanges(tempRanges);
      }
      e.preventDefault(), e.stopPropagation();
    }
  }
  function handleClick(e) {
    var cell = _grid.getCellFromEvent(e);
    if (!cell || !_grid.canCellBeActive(cell.row, cell.cell) || !_grid.getOptions().multiSelect || !e.ctrlKey && !e.shiftKey && !e.metaKey)
      return !1;
    var selection = rangesToRows(_ranges), idx = selection.indexOf(cell.row);
    if (idx === -1 && (e.ctrlKey || e.metaKey))
      selection.push(cell.row), _grid.setActiveCell(cell.row, cell.cell);
    else if (idx !== -1 && (e.ctrlKey || e.metaKey))
      selection = selection.filter((o) => o !== cell.row), _grid.setActiveCell(cell.row, cell.cell);
    else if (selection.length && e.shiftKey) {
      var last = selection.pop(), from = Math.min(cell.row, last), to = Math.max(cell.row, last);
      selection = [];
      for (var i2 = from; i2 <= to; i2++)
        i2 !== last && selection.push(i2);
      selection.push(last), _grid.setActiveCell(cell.row, cell.cell);
    }
    var tempRanges = rowsToRanges(selection);
    return setSelectedRanges(tempRanges), e.stopImmediatePropagation(), !0;
  }
  function handleBeforeCellRangeSelected(e, cell) {
    if (!_isRowMoveManagerHandler) {
      var rowMoveManager = _grid.getPluginByName("RowMoveManager") || _grid.getPluginByName("CrossGridRowMoveManager");
      _isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils26.noop;
    }
    if (_grid.getEditorLock().isActive() || _isRowMoveManagerHandler(cell.cell))
      return e.stopPropagation(), !1;
    _grid.setActiveCell(cell.row, cell.cell);
  }
  function handleCellRangeSelected(e, args) {
    if (!_grid.getOptions().multiSelect || !_options.selectActiveRow)
      return !1;
    setSelectedRanges([new SlickRange4(args.range.fromRow, 0, args.range.toRow, _grid.getColumns().length - 1)]);
  }
  Utils26.extend(this, {
    getSelectedRows,
    setSelectedRows,
    getSelectedRanges,
    setSelectedRanges,
    refreshSelections,
    init,
    destroy,
    pluginName: "RowSelectionModel",
    onSelectedRangesChanged: new SlickEvent18()
  });
}

// src/plugins/slick.state.js
var SlickEvent19 = Event, Utils27 = Utils, localStorageWrapper = function() {
  var localStorage = window.localStorage;
  return typeof localStorage > "u" && console.error("localStorage is not available. slickgrid statepersistor disabled."), {
    get: function(key) {
      return new Promise((resolve, reject) => {
        if (!localStorage) {
          reject("missing localStorage");
          return;
        }
        try {
          var d = localStorage.getItem(key);
          if (d)
            return resolve(JSON.parse(d));
          resolve({});
        } catch (exc) {
          reject(exc);
        }
      });
    },
    set: function(key, obj) {
      localStorage && (typeof obj < "u" && (obj = JSON.stringify(obj)), localStorage.setItem(key, obj));
    }
  };
}, defaults = {
  key_prefix: "slickgrid:",
  storage: new localStorageWrapper(),
  scrollRowIntoView: !0
};
function State(options) {
  options = Utils27.extend(!0, {}, defaults, options);
  var _grid, _cid, _store = options.storage, onStateChanged = new SlickEvent19(), userData = {
    state: null,
    current: null
  };
  function init(grid) {
    _grid = grid, _cid = grid.cid || options.cid, _cid ? (_grid.onColumnsResized.subscribe(save), _grid.onColumnsReordered.subscribe(save), _grid.onSort.subscribe(save)) : console.warn("grid has no client id. state persisting is disabled.");
  }
  function destroy() {
    _grid.onSort.unsubscribe(save), _grid.onColumnsReordered.unsubscribe(save), _grid.onColumnsResized.unsubscribe(save), save();
  }
  function save() {
    if (_cid && _store) {
      var state = {
        sortcols: getSortColumns(),
        viewport: _grid.getViewport(),
        columns: getColumns(),
        userData: null
      };
      return state.userData = userData.current, setUserDataFromState(state.userData), onStateChanged.notify(state), _store.set(options.key_prefix + _cid, state);
    }
  }
  function restore() {
    return new Promise((resolve, reject) => {
      if (!_cid) {
        reject("missing client id");
        return;
      }
      if (!_store) {
        reject("missing store");
        return;
      }
      _store.get(options.key_prefix + _cid).then(function(state) {
        if (state) {
          if (state.sortcols && _grid.setSortColumns(state.sortcols || []), state.viewport && options.scrollRowIntoView && _grid.scrollRowIntoView(state.viewport.top, !0), state.columns) {
            var defaultColumns = options.defaultColumns;
            if (defaultColumns) {
              var defaultColumnsLookup = {};
              defaultColumns.forEach(function(colDef) {
                defaultColumnsLookup[colDef.id] = colDef;
              });
              var cols = [];
              (state.columns || []).forEach(function(columnDef) {
                defaultColumnsLookup[columnDef.id] && cols.push(Utils27.extend(!0, {}, defaultColumnsLookup[columnDef.id], {
                  width: columnDef.width,
                  headerCssClass: columnDef.headerCssClass
                }));
              }), state.columns = cols;
            }
            _grid.setColumns(state.columns);
          }
          setUserDataFromState(state.userData);
        }
        resolve(state);
      }).catch(function(e) {
        reject(e);
      });
    });
  }
  function setUserData(data) {
    return userData.current = data, this;
  }
  function setUserDataFromState(data) {
    return userData.state = data, setUserData(data);
  }
  function getUserData() {
    return userData.current;
  }
  function getStateUserData() {
    return userData.state;
  }
  function resetUserData() {
    return userData.current = userData.state, this;
  }
  function getColumns() {
    return _grid.getColumns().map(function(col) {
      return {
        id: col.id,
        width: col.width
      };
    });
  }
  function getSortColumns() {
    var sortCols = _grid.getSortColumns();
    return sortCols;
  }
  function reset() {
    _store.set(options.key_prefix + _cid, {}), setUserDataFromState(null);
  }
  Utils27.extend(this, {
    init,
    destroy,
    save,
    setUserData,
    resetUserData,
    getUserData,
    getStateUserData,
    restore,
    onStateChanged,
    reset
  });
}
/**
 * @license
 * (c) 2009-2016 Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v4.0.0
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */
