"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Aggregators: () => Aggregators,
  AvgAggregator: () => AvgAggregator,
  BindingEventService: () => BindingEventService,
  CheckboxEditor: () => CheckboxEditor,
  CheckboxFormatter: () => CheckboxFormatter,
  CheckmarkFormatter: () => CheckmarkFormatter,
  ColAutosizeMode: () => ColAutosizeMode,
  CountAggregator: () => CountAggregator,
  Draggable: () => Draggable,
  EditorLock: () => EditorLock,
  Editors: () => Editors,
  Event: () => Event,
  EventData: () => EventData,
  EventHandler: () => EventHandler,
  FieldType: () => FieldType,
  FlatpickrEditor: () => FlatpickrEditor,
  FloatEditor: () => FloatEditor,
  Formatters: () => Formatters,
  GlobalEditorLock: () => GlobalEditorLock,
  GridAutosizeColsMode: () => GridAutosizeColsMode,
  Group: () => Group,
  GroupTotals: () => GroupTotals,
  IntegerEditor: () => IntegerEditor,
  LongTextEditor: () => LongTextEditor,
  MaxAggregator: () => MaxAggregator,
  MinAggregator: () => MinAggregator,
  MouseWheel: () => MouseWheel,
  NonDataRow: () => NonDataRow,
  PercentCompleteBarFormatter: () => PercentCompleteBarFormatter,
  PercentCompleteEditor: () => PercentCompleteEditor,
  PercentCompleteFormatter: () => PercentCompleteFormatter,
  Range: () => Range,
  RegexSanitizer: () => RegexSanitizer,
  Resizable: () => Resizable,
  RowSelectionMode: () => RowSelectionMode,
  SlickAutoTooltips: () => SlickAutoTooltips,
  SlickCellCopyManager: () => SlickCellCopyManager,
  SlickCellExternalCopyManager: () => SlickCellExternalCopyManager,
  SlickCellMenu: () => SlickCellMenu,
  SlickCellRangeDecorator: () => SlickCellRangeDecorator,
  SlickCellRangeSelector: () => SlickCellRangeSelector,
  SlickCellSelectionModel: () => SlickCellSelectionModel,
  SlickCheckboxSelectColumn: () => SlickCheckboxSelectColumn,
  SlickColumnMenu: () => SlickColumnMenu,
  SlickColumnPicker: () => SlickColumnPicker,
  SlickCompositeEditor: () => SlickCompositeEditor,
  SlickContextMenu: () => SlickContextMenu,
  SlickCrossGridRowMoveManager: () => SlickCrossGridRowMoveManager,
  SlickCustomTooltip: () => SlickCustomTooltip,
  SlickDataView: () => SlickDataView,
  SlickDraggableGrouping: () => SlickDraggableGrouping,
  SlickEditorLock: () => SlickEditorLock,
  SlickEvent: () => SlickEvent,
  SlickEventData: () => SlickEventData,
  SlickEventHandler: () => SlickEventHandler,
  SlickGlobalEditorLock: () => SlickGlobalEditorLock,
  SlickGrid: () => SlickGrid,
  SlickGridMenu: () => SlickGridMenu,
  SlickGridPager: () => SlickGridPager,
  SlickGroup: () => SlickGroup,
  SlickGroupItemMetadataProvider: () => SlickGroupItemMetadataProvider,
  SlickGroupTotals: () => SlickGroupTotals,
  SlickHeaderButtons: () => SlickHeaderButtons,
  SlickHeaderMenu: () => SlickHeaderMenu,
  SlickNonDataItem: () => SlickNonDataItem,
  SlickRange: () => SlickRange,
  SlickRemoteModel: () => SlickRemoteModel,
  SlickRemoteModelYahoo: () => SlickRemoteModelYahoo,
  SlickResizer: () => SlickResizer,
  SlickRowDetailView: () => SlickRowDetailView,
  SlickRowMoveManager: () => SlickRowMoveManager,
  SlickRowSelectionModel: () => SlickRowSelectionModel,
  SlickState: () => SlickState,
  SortDirectionNumber: () => SortDirectionNumber,
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

// src/slick.core.ts
var SlickEventData = class {
  constructor(event2, args) {
    this.event = event2;
    this.args = args;
    __publicField(this, "_isPropagationStopped", !1);
    __publicField(this, "_isImmediatePropagationStopped", !1);
    __publicField(this, "_isDefaultPrevented", !1);
    __publicField(this, "returnValues", []);
    __publicField(this, "returnValue");
    __publicField(this, "target");
    __publicField(this, "nativeEvent");
    __publicField(this, "arguments_");
    if (this.nativeEvent = event2, this.arguments_ = args, event2) {
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
        this[key] = event2[key];
    }
    this.target = this.nativeEvent ? this.nativeEvent.target : void 0;
  }
  /**
   * Stops event from propagating up the DOM tree.
   * @method stopPropagation
   */
  stopPropagation() {
    this._isPropagationStopped = !0, this.nativeEvent?.stopPropagation();
  }
  /**
   * Returns whether stopPropagation was called on this event object.
   * @method isPropagationStopped
   * @return {Boolean}
   */
  isPropagationStopped() {
    return this._isPropagationStopped;
  }
  /**
   * Prevents the rest of the handlers from being executed.
   * @method stopImmediatePropagation
   */
  stopImmediatePropagation() {
    this._isImmediatePropagationStopped = !0, this.nativeEvent && this.nativeEvent.stopImmediatePropagation();
  }
  /**
   * Returns whether stopImmediatePropagation was called on this event object.\
   * @method isImmediatePropagationStopped
   * @return {Boolean}
   */
  isImmediatePropagationStopped() {
    return this._isImmediatePropagationStopped;
  }
  getNativeEvent() {
    return this.nativeEvent;
  }
  preventDefault() {
    this.nativeEvent && this.nativeEvent.preventDefault(), this._isDefaultPrevented = !0;
  }
  isDefaultPrevented() {
    return this.nativeEvent ? this.nativeEvent.defaultPrevented : this._isDefaultPrevented;
  }
  addReturnValue(value) {
    this.returnValues.push(value), this.returnValue === void 0 && value !== void 0 && (this.returnValue = value);
  }
  getReturnValue() {
    return this.returnValue;
  }
  getArguments() {
    return this.arguments_;
  }
}, SlickEvent = class {
  constructor() {
    __publicField(this, "handlers", []);
  }
  /**
   * Adds an event handler to be called when the event is fired.
   * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
   * object the event was fired with.<p>
   * @method subscribe
   * @param fn {Function} Event handler.
   */
  subscribe(fn) {
    this.handlers.push(fn);
  }
  /**
   * Removes an event handler added with <code>subscribe(fn)</code>.
   * @method unsubscribe
   * @param fn {Function} Event handler to be removed.
   */
  unsubscribe(fn) {
    for (let i = this.handlers.length - 1; i >= 0; i--)
      this.handlers[i] === fn && this.handlers.splice(i, 1);
  }
  /**
   * Fires an event notifying all subscribers.
   * @method notify
   * @param args {Object} Additional data object to be passed to all handlers.
   * @param e {EventData}
   *      Optional.
   *      An <code>EventData</code> object to be passed to all handlers.
   *      For DOM events, an existing W3C event object can be passed in.
   * @param scope {Object}
   *      Optional.
   *      The scope ("this") within which the handler will be executed.
   *      If not specified, the scope will be set to the <code>Event</code> instance.
   */
  notify(args, evt, scope) {
    let sed = evt instanceof SlickEventData ? evt : new SlickEventData(evt, args);
    scope = scope || this;
    for (let i = 0; i < this.handlers.length && !(sed.isPropagationStopped() || sed.isImmediatePropagationStopped()); i++) {
      let returnValue = this.handlers[i].call(scope, sed, args);
      sed.addReturnValue(returnValue);
    }
    return sed;
  }
}, SlickEventHandler = class {
  constructor() {
    __publicField(this, "handlers", []);
  }
  subscribe(event2, handler) {
    return this.handlers.push({ event: event2, handler }), event2.subscribe(handler), this;
  }
  unsubscribe(event2, handler) {
    let i = this.handlers.length;
    for (; i--; )
      if (this.handlers[i].event === event2 && this.handlers[i].handler === handler) {
        this.handlers.splice(i, 1), event2.unsubscribe(handler);
        return;
      }
    return this;
  }
  unsubscribeAll() {
    let i = this.handlers.length;
    for (; i--; )
      this.handlers[i].event.unsubscribe(this.handlers[i].handler);
    return this.handlers = [], this;
  }
}, SlickRange = class {
  constructor(fromRow, fromCell, toRow, toCell) {
    __publicField(this, "fromRow");
    __publicField(this, "fromCell");
    __publicField(this, "toCell");
    __publicField(this, "toRow");
    toRow === void 0 && toCell === void 0 && (toRow = fromRow, toCell = fromCell), this.fromRow = Math.min(fromRow, toRow), this.fromCell = Math.min(fromCell, toCell), this.toCell = Math.max(fromCell, toCell), this.toRow = Math.max(fromRow, toRow);
  }
  /**
   * Returns whether a range represents a single row.
   * @method isSingleRow
   * @return {Boolean}
   */
  isSingleRow() {
    return this.fromRow === this.toRow;
  }
  /**
   * Returns whether a range represents a single cell.
   * @method isSingleCell
   * @return {Boolean}
   */
  isSingleCell() {
    return this.fromRow === this.toRow && this.fromCell === this.toCell;
  }
  /**
   * Returns whether a range contains a given cell.
   * @method contains
   * @param row {Integer}
   * @param cell {Integer}
   * @return {Boolean}
   */
  contains(row, cell) {
    return row >= this.fromRow && row <= this.toRow && cell >= this.fromCell && cell <= this.toCell;
  }
  /**
   * Returns a readable representation of a range.
   * @method toString
   * @return {String}
   */
  toString() {
    return this.isSingleCell() ? `(${this.fromRow}:${this.fromCell})` : `(${this.fromRow}:${this.fromCell} - ${this.toRow}:${this.toCell})`;
  }
}, SlickNonDataItem = class {
  constructor() {
    __publicField(this, "__nonDataRow", !0);
  }
}, SlickGroup = class extends SlickNonDataItem {
  constructor() {
    super();
    __publicField(this, "__group", !0);
    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    __publicField(this, "level", 0);
    /**
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    __publicField(this, "count", 0);
    /**
     * Grouping value.
     * @property value
     * @type {Object}
     */
    __publicField(this, "value", null);
    /**
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    __publicField(this, "title", null);
    /**
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    __publicField(this, "collapsed", !1);
    /**
     * Whether a group selection checkbox is checked.
     * @property selectChecked
     * @type {Boolean}
     */
    __publicField(this, "selectChecked", !1);
    /**
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    __publicField(this, "totals", null);
    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    __publicField(this, "rows", []);
    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    __publicField(this, "groups", null);
    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    __publicField(this, "groupingKey", null);
  }
  /**
   * Compares two Group instances.
   * @method equals
   * @return {Boolean}
   * @param group {Group} Group instance to compare to.
   */
  equals(group) {
    return this.value === group.value && this.count === group.count && this.collapsed === group.collapsed && this.title === group.title;
  }
}, SlickGroupTotals = class extends SlickNonDataItem {
  constructor() {
    super();
    __publicField(this, "__groupTotals", !0);
    /**
     * Parent Group.
     * @param group
     * @type {Group}
     */
    __publicField(this, "group", null);
    /**
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    __publicField(this, "initialized", !1);
  }
}, SlickEditorLock = class {
  constructor() {
    __publicField(this, "activeEditController", null);
  }
  /**
   * Returns true if a specified edit controller is active (has the edit lock).
   * If the parameter is not specified, returns true if any edit controller is active.
   * @method isActive
   * @param editController {EditController}
   * @return {Boolean}
   */
  isActive(editController) {
    return editController ? this.activeEditController === editController : this.activeEditController !== null;
  }
  /**
   * Sets the specified edit controller as the active edit controller (acquire edit lock).
   * If another edit controller is already active, and exception will be throw new Error(.
   * @method activate
   * @param editController {EditController} edit controller acquiring the lock
   */
  activate(editController) {
    if (editController !== this.activeEditController) {
      if (this.activeEditController !== null)
        throw new Error("Slick.EditorLock.activate: an editController is still active, can't activate another editController");
      if (!editController.commitCurrentEdit)
        throw new Error("Slick.EditorLock.activate: editController must implement .commitCurrentEdit()");
      if (!editController.cancelCurrentEdit)
        throw new Error("Slick.EditorLock.activate: editController must implement .cancelCurrentEdit()");
      this.activeEditController = editController;
    }
  }
  /**
   * Unsets the specified edit controller as the active edit controller (release edit lock).
   * If the specified edit controller is not the active one, an exception will be throw new Error(.
   * @method deactivate
   * @param editController {EditController} edit controller releasing the lock
   */
  deactivate(editController) {
    if (this.activeEditController) {
      if (this.activeEditController !== editController)
        throw new Error("Slick.EditorLock.deactivate: specified editController is not the currently active one");
      this.activeEditController = null;
    }
  }
  /**
   * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
   * controller and returns whether the commit attempt was successful (commit may fail due to validation
   * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
   * and false otherwise.  If no edit controller is active, returns true.
   * @method commitCurrentEdit
   * @return {Boolean}
   */
  commitCurrentEdit() {
    return this.activeEditController ? this.activeEditController.commitCurrentEdit() : !0;
  }
  /**
   * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
   * controller and returns whether the edit was successfully cancelled.  If no edit controller is
   * active, returns true.
   * @method cancelCurrentEdit
   * @return {Boolean}
   */
  cancelCurrentEdit() {
    return this.activeEditController ? this.activeEditController.cancelCurrentEdit() : !0;
  }
};
function regexSanitizer(dirtyHtml) {
  return dirtyHtml.replace(/(\b)(on[a-z]+)(\s*)=|javascript:([^>]*)[^>]*|(<\s*)(\/*)script([<>]*).*(<\s*)(\/*)script(>*)|(&lt;)(\/*)(script|script defer)(.*)(&gt;|&gt;">)/gi, "");
}
var BindingEventService = class {
  constructor() {
    __publicField(this, "_boundedEvents", []);
  }
  getBoundedEvents() {
    return this._boundedEvents;
  }
  destroy() {
    this.unbindAll();
  }
  /** Bind an event listener to any element */
  bind(element, eventName, listener, options, groupName = "") {
    element.addEventListener(eventName, listener, options), this._boundedEvents.push({ element, eventName, listener, groupName });
  }
  /** Unbind all will remove every every event handlers that were bounded earlier */
  unbind(element, eventName, listener) {
    element?.removeEventListener && element.removeEventListener(eventName, listener);
  }
  unbindByEventName(element, eventName) {
    let boundedEvent = this._boundedEvents.find((e) => e.element === element && e.eventName === eventName);
    boundedEvent && this.unbind(boundedEvent.element, boundedEvent.eventName, boundedEvent.listener);
  }
  /**
   * Unbind all event listeners that were bounded, optionally provide a group name to unbind all listeners assigned to that specific group only.
   */
  unbindAll(groupName) {
    if (groupName) {
      let groupNames = Array.isArray(groupName) ? groupName : [groupName];
      for (let i = this._boundedEvents.length - 1; i >= 0; --i) {
        let boundedEvent = this._boundedEvents[i];
        if (groupNames.some((g) => g === boundedEvent.groupName)) {
          let { element, eventName, listener } = boundedEvent;
          this.unbind(element, eventName, listener), this._boundedEvents.splice(i, 1);
        }
      }
    } else
      for (; this._boundedEvents.length > 0; ) {
        let boundedEvent = this._boundedEvents.pop(), { element, eventName, listener } = boundedEvent;
        this.unbind(element, eventName, listener);
      }
  }
}, _Utils = class _Utils {
  static isFunction(obj) {
    return typeof obj == "function" && typeof obj.nodeType != "number" && typeof obj.item != "function";
  }
  static isPlainObject(obj) {
    if (!obj || _Utils.toString.call(obj) !== "[object Object]")
      return !1;
    let proto = _Utils.getProto(obj);
    if (!proto)
      return !0;
    let Ctor = _Utils.hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && _Utils.fnToString.call(Ctor) === _Utils.ObjectFunctionString;
  }
  static calculateAvailableSpace(element) {
    let bottom = 0, top = 0, left = 0, right = 0, windowHeight = window.innerHeight || 0, windowWidth = window.innerWidth || 0, scrollPosition = _Utils.windowScrollPosition(), pageScrollTop = scrollPosition.top, pageScrollLeft = scrollPosition.left, elmOffset = _Utils.offset(element);
    if (elmOffset) {
      let elementOffsetTop = elmOffset.top || 0, elementOffsetLeft = elmOffset.left || 0;
      top = elementOffsetTop - pageScrollTop, bottom = windowHeight - (elementOffsetTop - pageScrollTop), left = elementOffsetLeft - pageScrollLeft, right = windowWidth - (elementOffsetLeft - pageScrollLeft);
    }
    return { top, bottom, left, right };
  }
  static extend(...args) {
    let options, name, src, copy, copyIsArray, clone, target = args[0], i = 1, deep = !1, length = args.length;
    for (typeof target == "boolean" ? (deep = target, target = args[i] || {}, i++) : target = target || {}, typeof target != "object" && !_Utils.isFunction(target) && (target = {}), i === length && (target = this, i--); i < length; i++)
      if (_Utils.isDefined(options = args[i]))
        for (name in options)
          copy = options[name], !(name === "__proto__" || target === copy) && (deep && copy && (_Utils.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ? (src = target[name], copyIsArray && !Array.isArray(src) ? clone = [] : !copyIsArray && !_Utils.isPlainObject(src) ? clone = {} : clone = src, copyIsArray = !1, target[name] = _Utils.extend(deep, clone, copy)) : copy !== void 0 && (target[name] = copy));
    return target;
  }
  /**
   * Create a DOM Element with any optional attributes or properties.
   * It will only accept valid DOM element properties that `createElement` would accept.
   * For example: `createDomElement('div', { className: 'my-css-class' })`,
   * for style or dataset you need to use nested object `{ style: { display: 'none' }}
   * The last argument is to optionally append the created element to a parent container element.
   * @param {String} tagName - html tag
   * @param {Object} options - element properties
   * @param {[HTMLElement]} appendToParent - parent element to append to
   */
  static createDomElement(tagName, elementOptions, appendToParent) {
    let elm = document.createElement(tagName);
    return elementOptions && Object.keys(elementOptions).forEach((elmOptionKey) => {
      elmOptionKey === "innerHTML" && console.warn(`[SlickGrid] For better CSP (Content Security Policy) support, do not use "innerHTML" directly in "createDomElement('${tagName}', { innerHTML: 'some html'})", it is better as separate assignment: "const elm = createDomElement('span'); elm.innerHTML = 'some html';"`);
      let elmValue = elementOptions[elmOptionKey];
      typeof elmValue == "object" ? Object.assign(elm[elmOptionKey], elmValue) : elm[elmOptionKey] = elementOptions[elmOptionKey];
    }), appendToParent?.appendChild && appendToParent.appendChild(elm), elm;
  }
  static emptyElement(element) {
    if (element?.firstChild)
      for (; element.firstChild; )
        element.lastChild && element.removeChild(element.lastChild);
    return element;
  }
  static innerSize(elm, type) {
    let size = 0;
    if (elm) {
      let clientSize = type === "height" ? "clientHeight" : "clientWidth", sides = type === "height" ? ["top", "bottom"] : ["left", "right"];
      size = elm[clientSize];
      for (let side of sides) {
        let sideSize = parseFloat(_Utils.getElementProp(elm, `padding-${side}`) || "") || 0;
        size -= sideSize;
      }
    }
    return size;
  }
  static isDefined(value) {
    return value != null;
  }
  static getElementProp(elm, property) {
    return elm?.getComputedStyle ? window.getComputedStyle(elm, null).getPropertyValue(property) : null;
  }
  static isEmptyObject(obj) {
    return obj == null ? !0 : Object.entries(obj).length === 0;
  }
  static noop() {
  }
  static offset(el) {
    if (!el || !el.getBoundingClientRect)
      return;
    let box = el.getBoundingClientRect(), docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }
  static windowScrollPosition() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || 0
    };
  }
  static width(el, value) {
    if (!(!el || !el.getBoundingClientRect)) {
      if (value === void 0)
        return el.getBoundingClientRect().width;
      _Utils.setStyleSize(el, "width", value);
    }
  }
  static height(el, value) {
    if (el) {
      if (value === void 0)
        return el.getBoundingClientRect().height;
      _Utils.setStyleSize(el, "height", value);
    }
  }
  static setStyleSize(el, style, val) {
    typeof val == "function" ? val = val() : typeof val == "string" ? el.style[style] = val : el.style[style] = val + "px";
  }
  static contains(parent, child) {
    return !parent || !child ? !1 : !_Utils.parents(child).every((p) => parent !== p);
  }
  static isHidden(el) {
    return el.offsetWidth === 0 && el.offsetHeight === 0;
  }
  static parents(el, selector) {
    let parents = [], visible = selector === ":visible", hidden = selector === ":hidden";
    for (; (el = el.parentNode) && el !== document && !(!el || !el.parentNode); )
      hidden ? _Utils.isHidden(el) && parents.push(el) : visible ? _Utils.isHidden(el) || parents.push(el) : (!selector || el.matches(selector)) && parents.push(el);
    return parents;
  }
  static toFloat(value) {
    let x = parseFloat(value);
    return isNaN(x) ? 0 : x;
  }
  static show(el, type = "") {
    Array.isArray(el) ? el.forEach((e) => e.style.display = type) : el.style.display = type;
  }
  static hide(el) {
    Array.isArray(el) ? el.forEach(function(e) {
      e.style.display = "none";
    }) : el.style.display = "none";
  }
  static slideUp(el, callback) {
    return _Utils.slideAnimation(el, "slideUp", callback);
  }
  static slideDown(el, callback) {
    return _Utils.slideAnimation(el, "slideDown", callback);
  }
  static slideAnimation(el, slideDirection, callback) {
    if (window.jQuery !== void 0) {
      window.jQuery(el)[slideDirection]("fast", callback);
      return;
    }
    slideDirection === "slideUp" ? _Utils.hide(el) : _Utils.show(el), callback();
  }
  static applyDefaults(targetObj, srcObj) {
    for (let key in srcObj)
      srcObj.hasOwnProperty(key) && !targetObj.hasOwnProperty(key) && (targetObj[key] = srcObj[key]);
  }
};
// jQuery's extend
__publicField(_Utils, "getProto", Object.getPrototypeOf), __publicField(_Utils, "class2type", {}), __publicField(_Utils, "toString", _Utils.class2type.toString), __publicField(_Utils, "hasOwn", _Utils.class2type.hasOwnProperty), __publicField(_Utils, "fnToString", _Utils.hasOwn.toString), __publicField(_Utils, "ObjectFunctionString", _Utils.fnToString.call(Object)), __publicField(_Utils, "storage", {
  // https://stackoverflow.com/questions/29222027/vanilla-alternative-to-jquery-data-function-any-native-javascript-alternati
  _storage: /* @__PURE__ */ new WeakMap(),
  // eslint-disable-next-line object-shorthand
  put: function(element, key, obj) {
    this._storage.has(element) || this._storage.set(element, /* @__PURE__ */ new Map()), this._storage.get(element).set(key, obj);
  },
  // eslint-disable-next-line object-shorthand
  get: function(element, key) {
    let el = this._storage.get(element);
    return el ? el.get(key) : null;
  },
  // eslint-disable-next-line object-shorthand
  remove: function(element, key) {
    let ret = this._storage.get(element).delete(key);
    return this._storage.get(element).size !== 0 && this._storage.delete(element), ret;
  }
});
var Utils = _Utils, SlickGlobalEditorLock = new SlickEditorLock(), SlickCore = {
  Event: SlickEvent,
  EventData: SlickEventData,
  EventHandler: SlickEventHandler,
  Range: SlickRange,
  NonDataRow: SlickNonDataItem,
  Group: SlickGroup,
  GroupTotals: SlickGroupTotals,
  EditorLock: SlickEditorLock,
  RegexSanitizer: regexSanitizer,
  /**
   * A global singleton editor lock.
   * @class GlobalEditorLock
   * @static
   * @constructor
   */
  GlobalEditorLock: SlickGlobalEditorLock,
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
  EditorLock,
  Event,
  EventData,
  EventHandler,
  Group,
  GroupTotals,
  NonDataRow,
  Range,
  RegexSanitizer,
  GlobalEditorLock,
  keyCode,
  preClickClassName,
  GridAutosizeColsMode,
  ColAutosizeMode,
  RowSelectionMode,
  ValueFilterMode,
  WidthEvalMode
} = SlickCore;

// src/controls/slick.columnmenu.ts
var BindingEventService2 = BindingEventService, SlickEvent2 = Event, Utils2 = Utils, SlickColumnMenu = class {
  constructor(columns, grid, options) {
    this.columns = columns;
    this.grid = grid;
    // --
    // public API
    __publicField(this, "onColumnsChanged", new SlickEvent2());
    // --
    // protected props
    __publicField(this, "_gridUid");
    __publicField(this, "_columnTitleElm");
    __publicField(this, "_listElm");
    __publicField(this, "_menuElm");
    __publicField(this, "_columnCheckboxes", []);
    __publicField(this, "_bindingEventService", new BindingEventService2());
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      fadeSpeed: 250,
      // the last 2 checkboxes titles
      hideForceFitButton: !1,
      hideSyncResizeButton: !1,
      forceFitTitle: "Force fit columns",
      syncResizeTitle: "Synchronous resize",
      headerColumnValueExtractor: (columnDef) => columnDef.name instanceof HTMLElement ? columnDef.name.innerHTML : columnDef.name || ""
    });
    this._gridUid = grid.getUID(), this._options = Utils2.extend({}, this._defaults, options), this.init(this.grid);
  }
  init(grid) {
    grid.onHeaderContextMenu.subscribe(this.handleHeaderContextMenu.bind(this)), grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), this._menuElm = document.createElement("div"), this._menuElm.className = `slick-columnpicker ${this._gridUid}`, this._menuElm.style.display = "none", document.body.appendChild(this._menuElm);
    let buttonElm = document.createElement("button");
    buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-columnpicker", buttonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", buttonElm.appendChild(spanCloseElm), this._menuElm.appendChild(buttonElm), this._options.columnPickerTitle || this._options.columnPicker?.columnTitle) {
      let columnTitle = this._options.columnPickerTitle || this._options.columnPicker?.columnTitle;
      this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "slick-gridmenu-custom", this._columnTitleElm.textContent = columnTitle || "", this._menuElm.appendChild(this._columnTitleElm);
    }
    this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-columnpicker-list", this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
  }
  destroy() {
    this.grid.onHeaderContextMenu.unsubscribe(this.handleHeaderContextMenu.bind(this)), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this._bindingEventService.unbindAll(), this._listElm?.remove(), this._menuElm?.remove();
  }
  handleBodyMouseDown(e) {
    (this._menuElm !== e.target && !(this._menuElm && this._menuElm.contains(e.target)) || e.target.className === "close") && (this._menuElm.setAttribute("aria-expanded", "false"), this._menuElm.style.display = "none");
  }
  handleHeaderContextMenu(e) {
    e.preventDefault(), Utils2.emptyElement(this._listElm), this.updateColumnOrder(), this._columnCheckboxes = [];
    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id;
      let colName = this.columns[i].name instanceof HTMLElement ? this.columns[i].name.innerHTML : this.columns[i].name || "";
      excludeCssClass = this.columns[i].excludeFromColumnPicker ? "hidden" : "";
      let liElm = document.createElement("li");
      liElm.className = excludeCssClass, liElm.ariaLabel = colName;
      let checkboxElm = document.createElement("input");
      checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), this._columnCheckboxes.push(checkboxElm), Utils2.isDefined(this.grid.getColumnIndex(columnId)) && !this.columns[i].hidden && (checkboxElm.checked = !0), columnLabel = this._options?.columnPicker?.headerColumnValueExtractor ? this._options.columnPicker.headerColumnValueExtractor(this.columns[i], this._options) : this._defaults.headerColumnValueExtractor(this.columns[i], this._options);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-${columnId}`, this.grid.applyHtmlCode(labelElm, columnLabel), liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
    }
    if (this._options.columnPicker && (!this._options.columnPicker.hideForceFitButton || !this._options.columnPicker.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !this._options.columnPicker?.hideForceFitButton) {
      let forceFitTitle = this._options.columnPicker?.forceFitTitle || this._options.forceFitTitle, liElm = document.createElement("li");
      liElm.ariaLabel = forceFitTitle || "", this._listElm.appendChild(liElm);
      let forceFitCheckboxElm = document.createElement("input");
      forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-forcefit`, labelElm.textContent = forceFitTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
    }
    if (!this._options.columnPicker?.hideSyncResizeButton) {
      let syncResizeTitle = this._options.columnPicker?.syncResizeTitle || this._options.syncResizeTitle, liElm = document.createElement("li");
      liElm.ariaLabel = syncResizeTitle || "", this._listElm.appendChild(liElm);
      let syncResizeCheckboxElm = document.createElement("input");
      syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-syncresize`, labelElm.textContent = syncResizeTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
    }
    this.repositionMenu(e);
  }
  repositionMenu(event2) {
    let targetEvent = event2?.touches?.[0] || event2;
    this._menuElm.style.top = `${targetEvent.pageY - 10}px`, this._menuElm.style.left = `${targetEvent.pageX - 10}px`, this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`, this._menuElm.style.display = "block", this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.appendChild(this._listElm);
  }
  updateColumnOrder() {
    let current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length);
    for (let i = 0; i < ordered.length; i++)
      this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
    this.columns = ordered;
  }
  /** Update the Titles of each sections (command, customTitle, ...) */
  updateAllTitles(pickerOptions) {
    this.grid.applyHtmlCode(this._columnTitleElm, pickerOptions.columnTitle);
  }
  updateColumn(e) {
    if (e.target.dataset.option === "autoresize") {
      let previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked;
      this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
      return;
    }
    if (e.target.dataset.option === "syncresize") {
      e.target.checked ? this.grid.setOptions({ syncColumnCellResize: !0 }) : this.grid.setOptions({ syncColumnCellResize: !1 });
      return;
    }
    if (e.target.type === "checkbox") {
      let isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
      if (this._columnCheckboxes.forEach((columnCheckbox, idx) => {
        this.columns[idx].hidden !== void 0 && (this.columns[idx].hidden = !columnCheckbox.checked), columnCheckbox.checked && visibleColumns.push(this.columns[idx]);
      }), !visibleColumns.length) {
        e.target.checked = !0;
        return;
      }
      this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId, showing: isChecked, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
    }
  }
  setColumnVisibiliy(idxOrId, show) {
    let idx = typeof idxOrId == "number" ? idxOrId : this.getColumnIndexbyId(idxOrId), visibleColumns = this.getVisibleColumns(), col = this.columns[idx];
    if (show)
      col.hidden = !1, visibleColumns.splice(idx, 0, col);
    else {
      let newVisibleColumns = [];
      for (let i = 0; i < visibleColumns.length; i++)
        visibleColumns[i].id !== col.id && newVisibleColumns.push(visibleColumns[i]);
      visibleColumns = newVisibleColumns;
    }
    this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
  }
  getAllColumns() {
    return this.columns;
  }
  getColumnbyId(id) {
    for (let i = 0; i < this.columns.length; i++)
      if (this.columns[i].id === id)
        return this.columns[i];
    return null;
  }
  getColumnIndexbyId(id) {
    for (let i = 0; i < this.columns.length; i++)
      if (this.columns[i].id === id)
        return i;
    return -1;
  }
  /** visible columns, we can simply get them directly from the grid */
  getVisibleColumns() {
    return this.grid.getColumns();
  }
};

// src/controls/slick.columnpicker.ts
var BindingEventService3 = BindingEventService, SlickEvent3 = Event, Utils3 = Utils, SlickColumnPicker = class {
  constructor(columns, grid, gridOptions) {
    this.columns = columns;
    this.grid = grid;
    // --
    // public API
    __publicField(this, "onColumnsChanged", new SlickEvent3());
    // --
    // protected props
    __publicField(this, "_gridUid");
    __publicField(this, "_columnTitleElm");
    __publicField(this, "_listElm");
    __publicField(this, "_menuElm");
    __publicField(this, "_columnCheckboxes", []);
    __publicField(this, "_bindingEventService", new BindingEventService3());
    __publicField(this, "_gridOptions");
    __publicField(this, "_defaults", {
      fadeSpeed: 250,
      // the last 2 checkboxes titles
      hideForceFitButton: !1,
      hideSyncResizeButton: !1,
      forceFitTitle: "Force fit columns",
      syncResizeTitle: "Synchronous resize",
      headerColumnValueExtractor: (columnDef) => columnDef.name instanceof HTMLElement ? columnDef.name.innerHTML : columnDef.name || ""
    });
    this._gridUid = grid.getUID(), this._gridOptions = Utils3.extend({}, this._defaults, gridOptions), this.init(this.grid);
  }
  init(grid) {
    grid.onHeaderContextMenu.subscribe(this.handleHeaderContextMenu.bind(this)), grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), this._menuElm = document.createElement("div"), this._menuElm.className = `slick-columnpicker ${this._gridUid}`, this._menuElm.style.display = "none", document.body.appendChild(this._menuElm);
    let buttonElm = document.createElement("button");
    buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-columnpicker", buttonElm.ariaLabel = "Close";
    let spanCloseElm = document.createElement("span");
    if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", buttonElm.appendChild(spanCloseElm), this._menuElm.appendChild(buttonElm), this._gridOptions.columnPickerTitle || this._gridOptions.columnPicker?.columnTitle) {
      let columnTitle = this._gridOptions.columnPickerTitle || this._gridOptions.columnPicker?.columnTitle;
      this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "slick-gridmenu-custom", this._columnTitleElm.textContent = columnTitle || "", this._menuElm.appendChild(this._columnTitleElm);
    }
    this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-columnpicker-list", this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
  }
  destroy() {
    this.grid.onHeaderContextMenu.unsubscribe(this.handleHeaderContextMenu.bind(this)), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this._bindingEventService.unbindAll(), this._listElm?.remove(), this._menuElm?.remove();
  }
  handleBodyMouseDown(e) {
    (this._menuElm !== e.target && !this._menuElm?.contains(e.target) || e.target.className === "close") && (this._menuElm.setAttribute("aria-expanded", "false"), this._menuElm.style.display = "none");
  }
  handleHeaderContextMenu(e) {
    e.preventDefault(), Utils3.emptyElement(this._listElm), this.updateColumnOrder(), this._columnCheckboxes = [];
    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id;
      let colName = this.columns[i].name instanceof HTMLElement ? this.columns[i].name.innerHTML : this.columns[i].name || "";
      excludeCssClass = this.columns[i].excludeFromColumnPicker ? "hidden" : "";
      let liElm = document.createElement("li");
      liElm.className = excludeCssClass, liElm.ariaLabel = colName;
      let checkboxElm = document.createElement("input");
      checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), this._columnCheckboxes.push(checkboxElm), Utils3.isDefined(this.grid.getColumnIndex(columnId)) && !this.columns[i].hidden && (checkboxElm.checked = !0), columnLabel = this._gridOptions?.columnPicker?.headerColumnValueExtractor ? this._gridOptions.columnPicker.headerColumnValueExtractor(this.columns[i], this._gridOptions) : this._defaults.headerColumnValueExtractor(this.columns[i], this._gridOptions);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-${columnId}`, this.grid.applyHtmlCode(labelElm, columnLabel), liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
    }
    if (this._gridOptions.columnPicker && (!this._gridOptions.columnPicker.hideForceFitButton || !this._gridOptions.columnPicker.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !this._gridOptions.columnPicker?.hideForceFitButton) {
      let forceFitTitle = this._gridOptions.columnPicker?.forceFitTitle || this._gridOptions.forceFitTitle, liElm = document.createElement("li");
      liElm.ariaLabel = forceFitTitle || "", this._listElm.appendChild(liElm);
      let forceFitCheckboxElm = document.createElement("input");
      forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-forcefit`, labelElm.textContent = forceFitTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
    }
    if (!this._gridOptions.columnPicker?.hideSyncResizeButton) {
      let syncResizeTitle = this._gridOptions.columnPicker?.syncResizeTitle || this._gridOptions.syncResizeTitle, liElm = document.createElement("li");
      liElm.ariaLabel = syncResizeTitle || "", this._listElm.appendChild(liElm);
      let syncResizeCheckboxElm = document.createElement("input");
      syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}colpicker-syncresize`, labelElm.textContent = syncResizeTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
    }
    this.repositionMenu(e);
  }
  repositionMenu(event2) {
    let targetEvent = event2?.touches?.[0] ?? event2;
    this._menuElm.style.top = `${targetEvent.pageY - 10}px`, this._menuElm.style.left = `${targetEvent.pageX - 10}px`, this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`, this._menuElm.style.display = "block", this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.appendChild(this._listElm);
  }
  updateColumnOrder() {
    let current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length);
    for (let i = 0; i < ordered.length; i++)
      this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
    this.columns = ordered;
  }
  /** Update the Titles of each sections (command, customTitle, ...) */
  updateAllTitles(pickerOptions) {
    this.grid.applyHtmlCode(this._columnTitleElm, pickerOptions.columnTitle);
  }
  updateColumn(e) {
    if (e.target.dataset.option === "autoresize") {
      let previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked || !1;
      this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
      return;
    }
    if (e.target.dataset.option === "syncresize") {
      e.target.checked ? this.grid.setOptions({ syncColumnCellResize: !0 }) : this.grid.setOptions({ syncColumnCellResize: !1 });
      return;
    }
    if (e.target.type === "checkbox") {
      let isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
      if (this._columnCheckboxes.forEach((columnCheckbox, idx) => {
        this.columns[idx].hidden !== void 0 && (this.columns[idx].hidden = !columnCheckbox.checked), columnCheckbox.checked && visibleColumns.push(this.columns[idx]);
      }), !visibleColumns.length) {
        e.target.checked = !0;
        return;
      }
      this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId, showing: isChecked, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
    }
  }
  setColumnVisibiliy(idxOrId, show) {
    let idx = typeof idxOrId == "number" ? idxOrId : this.getColumnIndexbyId(idxOrId), visibleColumns = this.getVisibleColumns(), col = this.columns[idx];
    if (show)
      col.hidden = !1, visibleColumns.splice(idx, 0, col);
    else {
      let newVisibleColumns = [];
      for (let i = 0; i < visibleColumns.length; i++)
        visibleColumns[i].id !== col.id && newVisibleColumns.push(visibleColumns[i]);
      visibleColumns = newVisibleColumns;
    }
    this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
  }
  getAllColumns() {
    return this.columns;
  }
  getColumnbyId(id) {
    for (let i = 0; i < this.columns.length; i++)
      if (this.columns[i].id === id)
        return this.columns[i];
    return null;
  }
  getColumnIndexbyId(id) {
    for (let i = 0; i < this.columns.length; i++)
      if (this.columns[i].id === id)
        return i;
    return -1;
  }
  /** visible columns, we can simply get them directly from the grid */
  getVisibleColumns() {
    return this.grid.getColumns();
  }
};

// src/controls/slick.gridmenu.ts
var BindingEventService4 = BindingEventService, SlickEvent4 = Event, Utils4 = Utils, SlickGridMenu = class {
  constructor(columns, grid, gridOptions) {
    this.columns = columns;
    this.grid = grid;
    // --
    // public API
    __publicField(this, "onAfterMenuShow", new SlickEvent4());
    __publicField(this, "onBeforeMenuShow", new SlickEvent4());
    __publicField(this, "onMenuClose", new SlickEvent4());
    __publicField(this, "onCommand", new SlickEvent4());
    __publicField(this, "onColumnsChanged", new SlickEvent4());
    // --
    // protected props
    __publicField(this, "_bindingEventService");
    __publicField(this, "_gridOptions");
    __publicField(this, "_gridUid");
    __publicField(this, "_isMenuOpen", !1);
    __publicField(this, "_columnCheckboxes", []);
    __publicField(this, "_columnTitleElm");
    __publicField(this, "_commandTitleElm");
    __publicField(this, "_commandListElm");
    __publicField(this, "_headerElm", null);
    __publicField(this, "_listElm");
    __publicField(this, "_buttonElm");
    __publicField(this, "_menuElm");
    __publicField(this, "_subMenuParentId", "");
    __publicField(this, "_gridMenuOptions", null);
    __publicField(this, "_defaults", {
      showButton: !0,
      hideForceFitButton: !1,
      hideSyncResizeButton: !1,
      forceFitTitle: "Force fit columns",
      marginBottom: 15,
      menuWidth: 18,
      contentMinWidth: 0,
      resizeOnShowHeaderRow: !1,
      subMenuOpenByEvent: "mouseover",
      syncResizeTitle: "Synchronous resize",
      useClickToRepositionMenu: !0,
      headerColumnValueExtractor: (columnDef) => columnDef.name instanceof HTMLElement ? columnDef.name.innerHTML : columnDef.name || ""
    });
    this._gridUid = grid.getUID(), this._gridOptions = gridOptions, this._gridMenuOptions = Utils4.extend({}, this._defaults, gridOptions.gridMenu), this._bindingEventService = new BindingEventService4(), grid.onSetOptions.subscribe((_e, args) => {
      if (args && args.optionsBefore && args.optionsAfter) {
        let switchedFromRegularToFrozen = args.optionsBefore.frozenColumn >= 0 && args.optionsAfter.frozenColumn === -1, switchedFromFrozenToRegular = args.optionsBefore.frozenColumn === -1 && args.optionsAfter.frozenColumn >= 0;
        (switchedFromRegularToFrozen || switchedFromFrozenToRegular) && this.recreateGridMenu();
      }
    }), this.init(this.grid);
  }
  init(grid) {
    this._gridOptions = grid.getOptions(), this.createGridMenu(), (this._gridMenuOptions?.customItems || this._gridMenuOptions?.customTitle) && console.warn('[SlickGrid] Grid Menu "customItems" and "customTitle" were deprecated to align with other Menu plugins, please use "commandItems" and "commandTitle" instead.'), grid.onBeforeDestroy.subscribe(this.destroy.bind(this));
  }
  setOptions(newOptions) {
    this._gridMenuOptions = Utils4.extend({}, this._gridMenuOptions, newOptions);
  }
  createGridMenu() {
    let gridMenuWidth = this._gridMenuOptions?.menuWidth || this._defaults.menuWidth;
    if (this._gridOptions && this._gridOptions.hasOwnProperty("frozenColumn") && this._gridOptions.frozenColumn >= 0 ? this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-right`) : this._headerElm = document.querySelector(`.${this._gridUid} .slick-header-left`), this._headerElm.style.width = `calc(100% - ${gridMenuWidth}px)`, (Utils4.isDefined(this._gridMenuOptions?.resizeOnShowHeaderRow) ? this._gridMenuOptions.resizeOnShowHeaderRow : this._defaults.resizeOnShowHeaderRow) && this._gridOptions.showHeaderRow) {
      let headerRow = document.querySelector(`.${this._gridUid}.slick-headerrow`);
      headerRow && (headerRow.style.width = `calc(100% - ${gridMenuWidth}px)`);
    }
    if (this._gridMenuOptions?.showButton !== void 0 ? this._gridMenuOptions.showButton : this._defaults.showButton) {
      if (this._buttonElm = document.createElement("button"), this._buttonElm.className = "slick-gridmenu-button", this._buttonElm.ariaLabel = "Grid Menu", this._gridMenuOptions?.iconCssClass)
        this._buttonElm.classList.add(...this._gridMenuOptions.iconCssClass.split(" "));
      else {
        let iconImageElm = document.createElement("img");
        iconImageElm.src = this._gridMenuOptions?.iconImage ? this._gridMenuOptions.iconImage : "../images/drag-handle.png", this._buttonElm.appendChild(iconImageElm);
      }
      this._headerElm.parentElement.insertBefore(this._buttonElm, this._headerElm.parentElement.firstChild), this._bindingEventService.bind(this._buttonElm, "click", this.showGridMenu.bind(this));
    }
    this._menuElm = this.createMenu(0), this.populateColumnPicker(), document.body.appendChild(this._menuElm), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
  }
  /** Create the menu or sub-menu(s) but without the column picker which is a separate single process */
  createMenu(level = 0, item) {
    let maxHeight = isNaN(this._gridMenuOptions?.maxHeight) ? this._gridMenuOptions?.maxHeight : `${this._gridMenuOptions?.maxHeight ?? 0}px`, width = isNaN(this._gridMenuOptions?.width) ? this._gridMenuOptions?.width : `${this._gridMenuOptions?.maxWidth ?? 0}px`, subMenuCommand = item?.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
    subMenuId && (this._subMenuParentId = subMenuId), level > 1 && (subMenuId = this._subMenuParentId);
    let menuClasses = `slick-gridmenu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-gridmenu.slick-menu-level-${level}${this.getGridUidSelector()}`);
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId)
        return bodyMenuElm;
      this.destroySubMenus();
    }
    let menuElm = document.createElement("div");
    menuElm.role = "menu", menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.ariaLabel = level > 1 ? "SubMenu" : "Grid Menu", width && (menuElm.style.width = width), maxHeight && (menuElm.style.maxHeight = maxHeight), menuElm.style.display = "none";
    let closeButtonElm = null;
    if (level === 0) {
      closeButtonElm = document.createElement("button"), closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-gridmenu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", closeButtonElm.appendChild(spanCloseElm), menuElm.appendChild(closeButtonElm);
    }
    this._commandListElm = document.createElement("div"), this._commandListElm.className = `slick-gridmenu-custom slick-gridmenu-command-list slick-menu-level-${level}`, this._commandListElm.role = "menu", menuElm.appendChild(this._commandListElm);
    let commandItems = item?.commandItems ?? item?.customItems ?? this._gridMenuOptions?.commandItems ?? this._gridMenuOptions?.customItems ?? [];
    return commandItems.length > 0 && item && level > 0 && this.addSubMenuTitleWhenExists(item, this._commandListElm), this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level }), level++, menuElm;
  }
  /** Destroy the plugin by unsubscribing every events & also delete the menu DOM elements */
  destroy() {
    this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onColumnsChanged.unsubscribe(), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this.grid.onBeforeDestroy.unsubscribe(), this.grid.onSetOptions.unsubscribe(), this._bindingEventService.unbindAll(), this._menuElm?.remove(), this.deleteMenu();
  }
  /** Delete the menu DOM element but without unsubscribing any events */
  deleteMenu() {
    this._bindingEventService.unbindAll();
    let gridMenuElm = document.querySelector(`div.slick-gridmenu.${this._gridUid}`);
    gridMenuElm && (gridMenuElm.style.display = "none"), this._headerElm && (this._headerElm.style.width = "100%"), this._buttonElm?.remove(), this._menuElm?.remove();
  }
  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  /** Construct the custom command menu items. */
  populateCommandsMenu(commandItems, commandListElm, args) {
    let level = args?.level || 0, isSubMenu = level > 0;
    !isSubMenu && (this._gridMenuOptions?.commandTitle || this._gridMenuOptions?.customTitle) && (this._commandTitleElm = document.createElement("div"), this._commandTitleElm.className = "title", this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString(this._gridMenuOptions.commandTitle || this._gridMenuOptions.customTitle)), commandListElm.appendChild(this._commandTitleElm));
    for (let i = 0, ln = commandItems.length; i < ln; i++) {
      let addClickListener = !0, item = commandItems[i], callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        columns: this.columns,
        visibleColumns: this.getVisibleColumns()
      }, isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, callbackArgs);
      if (!isItemVisible)
        continue;
      Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
      let liElm = document.createElement("div");
      liElm.className = "slick-gridmenu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-gridmenu-item-divider"), addClickListener = !1), item.disabled && liElm.classList.add("slick-gridmenu-item-disabled"), item.hidden && liElm.classList.add("slick-gridmenu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
      let iconElm = document.createElement("div");
      iconElm.className = "slick-gridmenu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
      let textElm = document.createElement("span");
      if (textElm.className = "slick-gridmenu-content", this.grid.applyHtmlCode(textElm, this.grid.sanitizeHtmlString(item.title || "")), liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandListElm.appendChild(liElm), addClickListener) {
        let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
        this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item, level), void 0, eventGroup);
      }
      if (this._gridMenuOptions?.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(liElm, "mouseover", (e) => {
        item.commandItems || item.customItems ? this.repositionSubMenu(item, level, e) : isSubMenu || this.destroySubMenus();
      }), item.commandItems || item.customItems) {
        let chevronElm = document.createElement("span");
        chevronElm.className = "sub-item-chevron", this._gridMenuOptions?.subItemChevronClass ? chevronElm.classList.add(...this._gridMenuOptions.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", liElm.classList.add("slick-submenu-item"), liElm.appendChild(chevronElm);
        continue;
      }
    }
  }
  /** Build the column picker, the code comes almost untouched from the file "slick.columnpicker.js" */
  populateColumnPicker() {
    this.grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), this._gridMenuOptions?.columnTitle && (this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "title", this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(this._gridMenuOptions.columnTitle)), this._menuElm.appendChild(this._columnTitleElm)), this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-gridmenu-list", this._listElm.role = "menu";
  }
  /** Delete and then Recreate the Grid Menu (for example when we switch from regular to a frozen grid) */
  recreateGridMenu() {
    this.deleteMenu(), this.init(this.grid);
  }
  showGridMenu(e) {
    let targetEvent = e.touches ? e.touches[0] : e;
    e.preventDefault(), Utils4.emptyElement(this._listElm), Utils4.emptyElement(this._commandListElm);
    let commandItems = this._gridMenuOptions?.commandItems ?? this._gridMenuOptions?.customItems ?? [];
    this.populateCommandsMenu(commandItems, this._commandListElm, { grid: this.grid, level: 0 }), this.updateColumnOrder(), this._columnCheckboxes = [];
    let callbackArgs = {
      grid: this.grid,
      menu: this._menuElm,
      allColumns: this.columns,
      visibleColumns: this.getVisibleColumns()
    };
    if (this._gridMenuOptions && !this.runOverrideFunctionWhenExists(this._gridMenuOptions.menuUsabilityOverride, callbackArgs) || typeof e.stopPropagation == "function" && this.onBeforeMenuShow.notify(callbackArgs, e, this).getReturnValue() === !1)
      return;
    let columnId, columnLabel, excludeCssClass;
    for (let i = 0; i < this.columns.length; i++) {
      columnId = this.columns[i].id, excludeCssClass = this.columns[i].excludeFromGridMenu ? "hidden" : "";
      let colName = this.columns[i].name instanceof HTMLElement ? this.columns[i].name.innerHTML : this.columns[i].name || "", liElm = document.createElement("li");
      liElm.className = excludeCssClass, liElm.ariaLabel = colName;
      let checkboxElm = document.createElement("input");
      checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}-gridmenu-colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), Utils4.isDefined(this.grid.getColumnIndex(this.columns[i].id)) && !this.columns[i].hidden && (checkboxElm.checked = !0), this._columnCheckboxes.push(checkboxElm), columnLabel = this._gridMenuOptions?.headerColumnValueExtractor ? this._gridMenuOptions.headerColumnValueExtractor(this.columns[i], this._gridOptions) : this._defaults.headerColumnValueExtractor(this.columns[i]);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-${columnId}`, this.grid.applyHtmlCode(labelElm, this.grid.sanitizeHtmlString((columnLabel instanceof HTMLElement ? columnLabel.innerHTML : columnLabel) || "")), liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
    }
    if (this._gridMenuOptions && (!this._gridMenuOptions.hideForceFitButton || !this._gridMenuOptions.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !this._gridMenuOptions?.hideForceFitButton) {
      let forceFitTitle = this._gridMenuOptions?.forceFitTitle || this._defaults.forceFitTitle, liElm = document.createElement("li");
      liElm.ariaLabel = forceFitTitle, liElm.role = "menuitem", this._listElm.appendChild(liElm);
      let forceFitCheckboxElm = document.createElement("input");
      forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-forcefit`, labelElm.textContent = forceFitTitle, liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
    }
    if (!this._gridMenuOptions?.hideSyncResizeButton) {
      let syncResizeTitle = this._gridMenuOptions?.syncResizeTitle || this._defaults.syncResizeTitle, liElm = document.createElement("li");
      liElm.ariaLabel = syncResizeTitle, this._listElm.appendChild(liElm);
      let syncResizeCheckboxElm = document.createElement("input");
      syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}-gridmenu-colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
      let labelElm = document.createElement("label");
      labelElm.htmlFor = `${this._gridUid}-gridmenu-colpicker-syncresize`, labelElm.textContent = syncResizeTitle, liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
    }
    let buttonElm = e.target.nodeName === "BUTTON" ? e.target : e.target.querySelector("button");
    buttonElm || (buttonElm = e.target.parentElement), this._menuElm.style.display = "block", this._menuElm.style.opacity = "0", this.repositionMenu(e, this._menuElm, buttonElm);
    let menuMarginBottom = this._gridMenuOptions?.marginBottom !== void 0 ? this._gridMenuOptions.marginBottom : this._defaults.marginBottom;
    this._gridMenuOptions?.height !== void 0 ? this._menuElm.style.height = `${this._gridMenuOptions.height}px` : this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY - menuMarginBottom}px`, this._menuElm.style.display = "block", this._menuElm.style.opacity = "1", this._menuElm.appendChild(this._listElm), this._isMenuOpen = !0, typeof e.stopPropagation == "function" && this.onAfterMenuShow.notify(callbackArgs, e, this).getReturnValue();
  }
  getGridUidSelector() {
    let gridUid = this.grid.getUID() || "";
    return gridUid ? `.${gridUid}` : "";
  }
  handleBodyMouseDown(e) {
    let isMenuClicked = !1;
    this._menuElm?.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-gridmenu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
      subElm.contains(e.target) && (isMenuClicked = !0);
    }), (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this._isMenuOpen || e.target.className === "close") && this.hideMenu(e);
  }
  handleMenuItemClick(item, level = 0, e) {
    if (item !== "divider" && !item.disabled && !item.divider) {
      let command = item.command || "";
      if (Utils4.isDefined(command) && !item.commandItems && !item.customItems) {
        let callbackArgs = {
          grid: this.grid,
          command,
          item,
          allColumns: this.columns,
          visibleColumns: this.getVisibleColumns()
        };
        this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), !!!this._gridMenuOptions?.leaveOpen && !e.defaultPrevented && this.hideMenu(e), e.preventDefault(), e.stopPropagation();
      } else
        item.commandItems || item.customItems ? this.repositionSubMenu(item, level, e) : this.destroySubMenus();
    }
  }
  hideMenu(e) {
    if (this._menuElm) {
      let callbackArgs = {
        grid: this.grid,
        menu: this._menuElm,
        allColumns: this.columns,
        visibleColumns: this.getVisibleColumns()
      };
      if (this._isMenuOpen && this.onMenuClose.notify(callbackArgs, e, this).getReturnValue() === !1)
        return;
      this._isMenuOpen = !1, Utils4.hide(this._menuElm);
    }
    this.destroySubMenus();
  }
  /** Update the Titles of each sections (command, commandTitle, ...) */
  updateAllTitles(gridMenuOptions) {
    this._commandTitleElm && this.grid.applyHtmlCode(this._commandTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.commandTitle || gridMenuOptions.customTitle || "")), this._columnTitleElm && this.grid.applyHtmlCode(this._columnTitleElm, this.grid.sanitizeHtmlString(gridMenuOptions.columnTitle || ""));
  }
  addSubMenuTitleWhenExists(item, commandOrOptionMenu) {
    if (item !== "divider" && item?.subMenuTitle) {
      let subMenuTitleElm = document.createElement("div");
      subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
      let subMenuTitleClass = item.subMenuTitleCssClass;
      subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandOrOptionMenu.appendChild(subMenuTitleElm);
    }
  }
  repositionSubMenu(item, level, e) {
    e.target.classList.contains("slick-cell") && this.destroySubMenus();
    let subMenuElm = this.createMenu(level + 1, item);
    subMenuElm.style.display = "block", document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
  }
  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  repositionMenu(e, menuElm, buttonElm) {
    let targetEvent = e.touches ? e.touches[0] : e, isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-gridmenu-item") : targetEvent.target, menuIconOffset = Utils4.offset(buttonElm || this._buttonElm), menuWidth = menuElm.offsetWidth, useClickToRepositionMenu = this._gridMenuOptions?.useClickToRepositionMenu !== void 0 ? this._gridMenuOptions.useClickToRepositionMenu : this._defaults.useClickToRepositionMenu, contentMinWidth = this._gridMenuOptions?.contentMinWidth ? this._gridMenuOptions.contentMinWidth : this._defaults.contentMinWidth, currentMenuWidth = contentMinWidth > menuWidth ? contentMinWidth : menuWidth + 5, menuOffsetTop = useClickToRepositionMenu && targetEvent.pageY > 0 ? targetEvent.pageY : menuIconOffset.top + 10, menuOffsetLeft = useClickToRepositionMenu && targetEvent.pageX > 0 ? targetEvent.pageX : menuIconOffset.left + 10;
    if (isSubMenu && parentElm) {
      let parentOffset = Utils4.offset(parentElm);
      menuOffsetLeft = parentOffset?.left ?? 0, menuOffsetTop = parentOffset?.top ?? 0;
      let gridPos = this.grid.getGridPosition(), subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
      isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
      let browserWidth = document.documentElement.clientWidth;
      (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), menuOffsetLeft -= menuWidth) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu && (menuOffsetLeft += parentElm.offsetWidth));
    } else
      menuOffsetTop += 10, menuOffsetLeft = menuOffsetLeft - currentMenuWidth + 10;
    menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`, contentMinWidth > 0 && (this._menuElm.style.minWidth = `${contentMinWidth}px`);
  }
  updateColumnOrder() {
    let current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length);
    for (let i = 0; i < ordered.length; i++)
      this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
    this.columns = ordered;
  }
  updateColumn(e) {
    if (e.target.dataset.option === "autoresize") {
      let previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked;
      this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
      return;
    }
    if (e.target.dataset.option === "syncresize") {
      this.grid.setOptions({ syncColumnCellResize: !!e.target.checked });
      return;
    }
    if (e.target.type === "checkbox") {
      let isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
      if (this._columnCheckboxes.forEach((columnCheckbox, idx) => {
        columnCheckbox.checked && (this.columns[idx].hidden && (this.columns[idx].hidden = !1), visibleColumns.push(this.columns[idx]));
      }), !visibleColumns.length) {
        e.target.checked = !0;
        return;
      }
      let callbackArgs = {
        columnId,
        showing: isChecked,
        grid: this.grid,
        allColumns: this.columns,
        columns: visibleColumns,
        visibleColumns: this.getVisibleColumns()
      };
      this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify(callbackArgs, e, this);
    }
  }
  getAllColumns() {
    return this.columns;
  }
  /** visible columns, we can simply get them directly from the grid */
  getVisibleColumns() {
    return this.grid.getColumns();
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
};

// src/controls/slick.pager.ts
var BindingEventService5 = BindingEventService, SlickGlobalEditorLock2 = SlickGlobalEditorLock, Utils5 = Utils, SlickGridPager = class {
  constructor(dataView, grid, selectorOrElm, options) {
    this.dataView = dataView;
    this.grid = grid;
    // --
    // public API
    // --
    // protected props
    __publicField(this, "_container");
    // the container might be a string, a jQuery object or a native element
    __publicField(this, "_statusElm");
    __publicField(this, "_bindingEventService");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
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
    });
    this._container = this.getContainerElement(selectorOrElm), this._options = Utils5.extend(!0, {}, this._defaults, options), this._bindingEventService = new BindingEventService5(), this.init();
  }
  init() {
    this.constructPagerUI(), this.updatePager(this.dataView.getPagingInfo()), this.dataView.onPagingInfoChanged.subscribe((_e, pagingInfo) => {
      this.updatePager(pagingInfo);
    });
  }
  /** Destroy function when element is destroyed */
  destroy() {
    this.setPageSize(0), this._bindingEventService.unbindAll(), Utils5.emptyElement(this._container);
  }
  getNavState() {
    let cannotLeaveEditMode = !SlickGlobalEditorLock2.commitCurrentEdit(), pagingInfo = this.dataView.getPagingInfo(), lastPage = pagingInfo.totalPages - 1;
    return {
      canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum !== lastPage,
      canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum > 0,
      canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize !== 0 && pagingInfo.pageNum < lastPage,
      pagingInfo
    };
  }
  setPageSize(n) {
    this.dataView.setRefreshHints({
      isFilterUnchanged: !0
    }), this.dataView.setPagingOptions({ pageSize: n });
  }
  gotoFirst() {
    this.getNavState().canGotoFirst && this.dataView.setPagingOptions({ pageNum: 0 });
  }
  gotoLast() {
    let state = this.getNavState();
    state.canGotoLast && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
  }
  gotoPrev() {
    let state = this.getNavState();
    state.canGotoPrev && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
  }
  gotoNext() {
    let state = this.getNavState();
    state.canGotoNext && this.dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
  }
  getContainerElement(selectorOrElm) {
    return typeof selectorOrElm == "string" ? document.querySelector(selectorOrElm) : typeof selectorOrElm == "object" && selectorOrElm[0] ? selectorOrElm[0] : selectorOrElm;
  }
  constructPagerUI() {
    let container = this.getContainerElement(this._container);
    if (!container || container.jquery && !container[0])
      return;
    let navElm = document.createElement("span");
    navElm.className = "slick-pager-nav";
    let settingsElm = document.createElement("span");
    settingsElm.className = "slick-pager-settings", this._statusElm = document.createElement("span"), this._statusElm.className = "slick-pager-status";
    let pagerSettingsElm = document.createElement("span");
    pagerSettingsElm.className = "slick-pager-settings-expanded", pagerSettingsElm.textContent = "Show: ";
    for (let o = 0; o < this._options.pagingOptions.length; o++) {
      let p = this._options.pagingOptions[o], anchorElm = document.createElement("a");
      anchorElm.textContent = p.name, anchorElm.ariaLabel = p.ariaLabel, anchorElm.dataset.val = String(p.data), pagerSettingsElm.appendChild(anchorElm), this._bindingEventService.bind(anchorElm, "click", (e) => {
        let pagesize = e.target.dataset.val;
        if (pagesize !== void 0)
          if (Number(pagesize) === -1) {
            let vp = this.grid.getViewport();
            this.setPageSize(vp.bottom - vp.top);
          } else
            this.setPageSize(parseInt(pagesize));
      });
    }
    pagerSettingsElm.style.display = this._options.showPageSizes ? "block" : "none", settingsElm.appendChild(pagerSettingsElm);
    let displayPaginationContainer = document.createElement("span"), displayIconElm = document.createElement("span");
    displayPaginationContainer.className = "sgi-container", displayIconElm.ariaLabel = "Show Pagination Options", displayIconElm.role = "button", displayIconElm.className = "sgi sgi-lightbulb", displayPaginationContainer.appendChild(displayIconElm), this._bindingEventService.bind(displayIconElm, "click", () => {
      let styleDisplay = pagerSettingsElm.style.display;
      pagerSettingsElm.style.display = styleDisplay === "none" ? "inline-flex" : "none";
    }), settingsElm.appendChild(displayPaginationContainer), [
      { key: "start", ariaLabel: "First Page", callback: this.gotoFirst },
      { key: "left", ariaLabel: "Previous Page", callback: this.gotoPrev },
      { key: "right", ariaLabel: "Next Page", callback: this.gotoNext },
      { key: "end", ariaLabel: "Last Page", callback: this.gotoLast }
    ].forEach((pageBtn) => {
      let iconElm = document.createElement("span");
      iconElm.className = "sgi-container";
      let innerIconElm = document.createElement("span");
      innerIconElm.role = "button", innerIconElm.ariaLabel = pageBtn.ariaLabel, innerIconElm.className = `sgi sgi-chevron-${pageBtn.key}`, this._bindingEventService.bind(innerIconElm, "click", pageBtn.callback.bind(this)), iconElm.appendChild(innerIconElm), navElm.appendChild(iconElm);
    });
    let slickPagerElm = document.createElement("div");
    slickPagerElm.className = "slick-pager", slickPagerElm.appendChild(navElm), slickPagerElm.appendChild(this._statusElm), slickPagerElm.appendChild(settingsElm), container.appendChild(slickPagerElm);
  }
  updatePager(pagingInfo) {
    if (!this._container || this._container.jquery && !this._container[0])
      return;
    let state = this.getNavState();
    if (this._container.querySelectorAll(".slick-pager-nav span").forEach((pagerIcon) => pagerIcon.classList.remove("sgi-state-disabled")), state.canGotoFirst || this._container.querySelector(".sgi-chevron-start").classList.add("sgi-state-disabled"), state.canGotoLast || this._container.querySelector(".sgi-chevron-end").classList.add("sgi-state-disabled"), state.canGotoNext || this._container.querySelector(".sgi-chevron-right").classList.add("sgi-state-disabled"), state.canGotoPrev || this._container.querySelector(".sgi-chevron-left").classList.add("sgi-state-disabled"), pagingInfo.pageSize === 0 ? this._statusElm.textContent = this._options.showAllText.replace("{rowCount}", pagingInfo.totalRows + "").replace("{pageCount}", pagingInfo.totalPages + "") : this._statusElm.textContent = this._options.showPageText.replace("{pageNum}", pagingInfo.pageNum + 1 + "").replace("{pageCount}", pagingInfo.totalPages + ""), this._options.showCount && pagingInfo.pageSize !== 0) {
      let pageBegin = pagingInfo.pageNum * pagingInfo.pageSize, currentText = this._statusElm.textContent;
      currentText && (currentText += " - "), this._statusElm.textContent = currentText + this._options.showCountText.replace("{rowCount}", String(pagingInfo.totalRows)).replace("{countBegin}", String(pageBegin + 1)).replace("{countEnd}", String(Math.min(pageBegin + pagingInfo.pageSize, pagingInfo.totalRows)));
    }
  }
};

// src/models/fieldType.enum.ts
var FieldType = {
  /** unknown type */
  unknown: "unknown",
  /** string type */
  string: "string",
  /** boolean type (true/false) */
  boolean: "boolean",
  /** integer number type (1,2,99) */
  integer: "integer",
  /** float number (with decimal) type */
  float: "float",
  /** number includes Integer and Float */
  number: "number",
  /** new Date(), javascript Date object */
  date: "date",
  /** Format: 'YYYY-MM-DD' <=> 2001-02-28 */
  dateIso: "dateIso",
  /** Format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' <=> 2001-02-28T14:00:00.123Z */
  dateUtc: "dateUtc",
  /** new Date(), javacript Date Object with Time */
  dateTime: "dateTime",
  /** Format: 'YYYY-MM-DD HH:mm:ss' <=> 2001-02-28 14:01:01 */
  dateTimeIso: "dateTimeIso",
  /** Format: 'YYYY-MM-DD hh:mm:ss a' <=> 2001-02-28 11:01:01 pm */
  dateTimeIsoAmPm: "dateTimeIsoAmPm",
  /** Format: 'YYYY-MM-DD hh:mm:ss A' <=> 2001-02-28 11:01:01 PM */
  dateTimeIsoAM_PM: "dateTimeIsoAM_PM",
  /** Format: 'YYYY-MM-DD HH:mm' <=> 2001-02-28 14:01 */
  dateTimeShortIso: "dateTimeShortIso",
  /** Format (Euro): 'DD/MM/YYYY' <=> 28/02/2001 */
  dateEuro: "dateEuro",
  /** Format (Euro): 'D/M/YY' <=> 28/2/12 */
  dateEuroShort: "dateEuroShort",
  /** Format (Euro): 'DD/MM/YYYY HH:mm' <=> 28/02/2001 13:01 */
  dateTimeShortEuro: "dateTimeShortEuro",
  /** Format (Euro): 'DD/MM/YYYY HH:mm:ss' <=> 02/28/2001 13:01:01 */
  dateTimeEuro: "dateTimeEuro",
  /** Format (Euro): 'DD/MM/YYYY hh:mm:ss a' <=> 28/02/2001 11:01:01 pm */
  dateTimeEuroAmPm: "dateTimeEuroAmPm",
  /** Format (Euro): 'DD/MM/YYYY hh:mm:ss A' <=> 28/02/2001 11:01:01 PM */
  dateTimeEuroAM_PM: "dateTimeEuroAM_PM",
  /** Format (Euro): 'D/M/YY H:m:s' <=> 28/2/14 14:1:2 */
  dateTimeEuroShort: "dateTimeEuroShort",
  /** Format (Euro): 'D/M/YY h:m:s a' <=> 28/2/14 1:2:10 pm */
  dateTimeEuroShortAmPm: "dateTimeEuroShortAmPm",
  /** Format (Euro): 'D/M/YY h:m:s A' <=> 28/2/14 14:1:1 PM */
  dateTimeEuroShortAM_PM: "dateTimeEuroShortAM_PM",
  /** Format: 'MM/DD/YYYY' <=> 02/28/2001 */
  dateUs: "dateUs",
  /** Format: 'M/D/YY' <=> 2/28/12 */
  dateUsShort: "dateUsShort",
  /** Format: 'MM/DD/YYYY HH:mm' <=> 02/28/2001 13:01 */
  dateTimeShortUs: "dateTimeShortUs",
  /** Format: 'MM/DD/YYYY HH:mm:ss' <=> 02/28/2001 13:01:01 */
  dateTimeUs: "dateTimeUs",
  /** Format: 'MM/DD/YYYY hh:mm:ss a' <=> 02/28/2001 11:01:01 pm */
  dateTimeUsAmPm: "dateTimeUsAmPm",
  /** Format: 'MM/DD/YYYY hh:mm:ss A' <=> 02/28/2001 11:01:01 PM */
  dateTimeUsAM_PM: "dateTimeUsAM_PM",
  /** Format: 'M/D/YY H:m:s' <=> 2/28/14 14:1:2 */
  dateTimeUsShort: "dateTimeUsShort",
  /** Format: 'M/D/YY h:m:s a' <=> 2/28/14 1:2:10 pm */
  dateTimeUsShortAmPm: "dateTimeUsShortAmPm",
  /** Format: 'M/D/YY h:m:s A' <=> 2/28/14 14:1:1 PM */
  dateTimeUsShortAM_PM: "dateTimeUsShortAM_PM",
  /** complex object with various properties */
  object: "object",
  /** password text string */
  password: "password",
  /** alias to string */
  text: "text",
  /** readonly text string */
  readonly: "readonly"
};

// src/models/sortDirectionNumber.enum.ts
var SortDirectionNumber = /* @__PURE__ */ ((SortDirectionNumber2) => (SortDirectionNumber2[SortDirectionNumber2.asc = 1] = "asc", SortDirectionNumber2[SortDirectionNumber2.desc = -1] = "desc", SortDirectionNumber2[SortDirectionNumber2.neutral = 0] = "neutral", SortDirectionNumber2))(SortDirectionNumber || {});

// src/plugins/slick.autotooltips.ts
var Utils6 = Utils, SlickAutoTooltips = class {
  /**
   * Constructor of the SlickGrid 3rd party plugin, it can optionally receive options
   * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
   * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
   * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
   * @param {boolean} [options.replaceExisting=null]       - Allow preventing custom tooltips from being overwritten by auto tooltips
   */
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "AutoTooltips");
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      enableForCells: !0,
      enableForHeaderCells: !1,
      maxToolTipLength: void 0,
      replaceExisting: !0
    });
    this._options = Utils6.extend(!0, {}, this._defaults, options);
  }
  /**
   * Initialize plugin.
   */
  init(grid) {
    this._grid = grid, this._options?.enableForCells && this._grid.onMouseEnter.subscribe(this.handleMouseEnter.bind(this)), this._options?.enableForHeaderCells && this._grid.onHeaderMouseEnter.subscribe(this.handleHeaderMouseEnter.bind(this));
  }
  /**
   * Destroy plugin.
   */
  destroy() {
    this._options?.enableForCells && this._grid.onMouseEnter.unsubscribe(this.handleMouseEnter.bind(this)), this._options?.enableForHeaderCells && this._grid.onHeaderMouseEnter.unsubscribe(this.handleHeaderMouseEnter.bind(this));
  }
  /**
   * Handle mouse entering grid cell to add/remove tooltip.
   * @param {MouseEvent} event - The event
   */
  handleMouseEnter(event2) {
    let cell = this._grid.getCellFromEvent(event2);
    if (cell) {
      let node = this._grid.getCellNode(cell.row, cell.cell), text;
      this._options && node && (!node.title || this._options?.replaceExisting) && (node.clientWidth < node.scrollWidth ? (text = node.textContent?.trim() ?? "", this._options?.maxToolTipLength && text.length > this._options?.maxToolTipLength && (text = text.substring(0, this._options.maxToolTipLength - 3) + "...")) : text = "", node.title = text), node = null;
    }
  }
  /**
   * Handle mouse entering header cell to add/remove tooltip.
   * @param {MouseEvent} event   - The event
   * @param {object} args.column - The column definition
   */
  handleHeaderMouseEnter(event2, args) {
    let column = args.column, node, targetElm = event2.target;
    if (targetElm && (node = targetElm.closest(".slick-header-column"), node && !column?.toolTip)) {
      let titleVal = targetElm.clientWidth < node.clientWidth ? column?.name ?? "" : "";
      node.title = titleVal instanceof HTMLElement ? titleVal.innerHTML : titleVal;
    }
    node = null;
  }
};

// src/plugins/slick.cellcopymanager.ts
var keyCode2 = keyCode, SlickEvent5 = SlickEvent;
var SlickCellCopyManager = class {
  constructor() {
    // --
    // public API
    __publicField(this, "pluginName", "CellCopyManager");
    __publicField(this, "onCopyCells", new SlickEvent5());
    __publicField(this, "onCopyCancelled", new SlickEvent5());
    __publicField(this, "onPasteCells", new SlickEvent5());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_copiedRanges", null);
  }
  init(grid) {
    this._grid = grid, this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));
  }
  destroy() {
    this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
  }
  handleKeyDown(e) {
    let ranges;
    this._grid.getEditorLock().isActive() || (e.which === keyCode2.ESCAPE && this._copiedRanges && (e.preventDefault(), this.clearCopySelection(), this.onCopyCancelled.notify({ ranges: this._copiedRanges }), this._copiedRanges = null), e.which === 67 && (e.ctrlKey || e.metaKey) && (ranges = this._grid.getSelectionModel()?.getSelectedRanges() ?? [], ranges.length !== 0 && (e.preventDefault(), this._copiedRanges = ranges, this.markCopySelection(ranges), this.onCopyCells.notify({ ranges }))), e.which === 86 && (e.ctrlKey || e.metaKey) && this._copiedRanges && (e.preventDefault(), ranges = this._grid.getSelectionModel()?.getSelectedRanges(), this.onPasteCells.notify({ from: this._copiedRanges, to: ranges }), this._grid.getOptions().preserveCopiedSelectionOnPaste || (this.clearCopySelection(), this._copiedRanges = null)));
  }
  markCopySelection(ranges) {
    let columns = this._grid.getColumns(), hash = {};
    for (let i = 0; i < ranges.length; i++)
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] = {};
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
          hash[j][columns[k].id] = "copied";
      }
    this._grid.setCellCssStyles("copy-manager", hash);
  }
  clearCopySelection() {
    this._grid.removeCellCssStyles("copy-manager");
  }
};

// src/plugins/slick.cellexternalcopymanager.ts
var SlickEvent6 = SlickEvent, SlickRange3 = SlickRange;
var CLEAR_COPY_SELECTION_DELAY = 2e3, CLIPBOARD_PASTE_DELAY = 100, SlickCellExternalCopyManager = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "CellExternalCopyManager");
    __publicField(this, "onCopyCells", new SlickEvent6());
    __publicField(this, "onCopyCancelled", new SlickEvent6());
    __publicField(this, "onPasteCells", new SlickEvent6());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_bodyElement");
    __publicField(this, "_copiedRanges", null);
    __publicField(this, "_clearCopyTI");
    __publicField(this, "_copiedCellStyle");
    __publicField(this, "_copiedCellStyleLayerKey");
    __publicField(this, "_onCopyInit");
    __publicField(this, "_onCopySuccess");
    __publicField(this, "_options");
    __publicField(this, "keyCodes", {
      C: 67,
      V: 86,
      ESC: 27,
      INSERT: 45
    });
    this._options = options || {}, this._copiedCellStyleLayerKey = this._options.copiedCellStyleLayerKey || "copy-manager", this._copiedCellStyle = this._options.copiedCellStyle || "copied", this._bodyElement = this._options.bodyElement || document.body, this._onCopyInit = this._options.onCopyInit || void 0, this._onCopySuccess = this._options.onCopySuccess || void 0;
  }
  init(grid) {
    this._grid = grid, this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this));
    let cellSelectionModel = grid.getSelectionModel();
    if (!cellSelectionModel)
      throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
    cellSelectionModel.onSelectedRangesChanged.subscribe(() => {
      this._grid.getEditorLock().isActive() || this._grid.focus();
    });
  }
  destroy() {
    this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this));
  }
  getHeaderValueForColumn(columnDef) {
    if (this._options.headerColumnValueExtractor) {
      let val = this._options.headerColumnValueExtractor(columnDef);
      if (val)
        return val;
    }
    return columnDef.name;
  }
  getDataItemValueForColumn(item, columnDef, event2) {
    if (typeof this._options.dataItemColumnValueExtractor == "function") {
      let val = this._options.dataItemColumnValueExtractor(item, columnDef);
      if (val)
        return val;
    }
    let retVal = "";
    if (columnDef?.editor) {
      let tmpP = document.createElement("p"), editor = new columnDef.editor({
        container: tmpP,
        // a dummy container
        column: columnDef,
        event: event2,
        position: { top: 0, left: 0 },
        // a dummy position required by some editors
        grid: this._grid
      });
      editor.loadValue(item), retVal = editor.serializeValue(), editor.destroy(), tmpP.remove();
    } else
      retVal = item[columnDef.field || ""];
    return retVal;
  }
  setDataItemValueForColumn(item, columnDef, value) {
    if (columnDef.denyPaste)
      return null;
    if (this._options.dataItemColumnValueSetter)
      return this._options.dataItemColumnValueSetter(item, columnDef, value);
    if (columnDef.editor) {
      let tmpDiv = document.createElement("div"), editor = new columnDef.editor({
        container: tmpDiv,
        // a dummy container
        column: columnDef,
        position: { top: 0, left: 0 },
        // a dummy position required by some editors
        grid: this._grid
      });
      editor.loadValue(item), editor.applyValue(item, value), editor.destroy(), tmpDiv.remove();
    } else
      item[columnDef.field] = value;
  }
  _createTextBox(innerText) {
    let ta = document.createElement("textarea");
    return ta.style.position = "absolute", ta.style.left = "-1000px", ta.style.top = document.body.scrollTop + "px", ta.value = innerText, this._bodyElement.appendChild(ta), ta.select(), ta;
  }
  _decodeTabularData(grid, ta) {
    let columns = grid.getColumns(), clipRows = ta.value.split(/[\n\f\r]/);
    clipRows[clipRows.length - 1] === "" && clipRows.pop();
    let j = 0, clippedRange = [];
    this._bodyElement.removeChild(ta);
    for (let i = 0; i < clipRows.length; i++)
      clipRows[i] !== "" ? clippedRange[j++] = clipRows[i].split("	") : clippedRange[j++] = [""];
    let selectedCell = grid.getActiveCell(), ranges = grid.getSelectionModel()?.getSelectedRanges(), selectedRange = ranges && ranges.length ? ranges[0] : null, activeRow, activeCell;
    if (selectedRange)
      activeRow = selectedRange.fromRow, activeCell = selectedRange.fromCell;
    else if (selectedCell)
      activeRow = selectedCell.row, activeCell = selectedCell.cell;
    else
      return;
    let oneCellToMultiple = !1, destH = clippedRange.length, destW = clippedRange.length ? clippedRange[0].length : 0;
    clippedRange.length === 1 && clippedRange[0].length === 1 && selectedRange && (oneCellToMultiple = !0, destH = selectedRange.toRow - selectedRange.fromRow + 1, destW = selectedRange.toCell - selectedRange.fromCell + 1);
    let availableRows = grid.getData().length - (activeRow || 0), addRows = 0;
    if (availableRows < destH && typeof this._options.newRowCreator == "function") {
      let d = grid.getData();
      for (addRows = 1; addRows <= destH - availableRows; addRows++)
        d.push({});
      grid.setData(d), grid.render();
    }
    let overflowsBottomOfGrid = (activeRow || 0) + destH > grid.getDataLength();
    if (this._options.newRowCreator && overflowsBottomOfGrid) {
      let newRowsNeeded = (activeRow || 0) + destH - grid.getDataLength();
      this._options.newRowCreator(newRowsNeeded);
    }
    let clipCommand = {
      isClipboardCommand: !0,
      clippedRange,
      oldValues: [],
      cellExternalCopyManager: this,
      _options: this._options,
      setDataItemValueForColumn: this.setDataItemValueForColumn.bind(this),
      markCopySelection: this.markCopySelection.bind(this),
      oneCellToMultiple,
      activeRow,
      activeCell,
      destH,
      destW,
      maxDestY: grid.getDataLength(),
      maxDestX: grid.getColumns().length,
      h: 0,
      w: 0,
      execute: () => {
        clipCommand.h = 0;
        for (let y = 0; y < clipCommand.destH; y++) {
          clipCommand.oldValues[y] = [], clipCommand.w = 0, clipCommand.h++;
          for (let x = 0; x < clipCommand.destW; x++) {
            clipCommand.w++;
            let desty = activeRow + y, destx = activeCell + x;
            if (desty < clipCommand.maxDestY && destx < clipCommand.maxDestX) {
              let dt = grid.getDataItem(desty);
              clipCommand.oldValues[y][x] = dt[columns[destx].field], oneCellToMultiple ? clipCommand.setDataItemValueForColumn(dt, columns[destx], clippedRange[0][0]) : clipCommand.setDataItemValueForColumn(dt, columns[destx], clippedRange[y] ? clippedRange[y][x] : ""), grid.updateCell(desty, destx), grid.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid,
                column: {}
              });
            }
          }
        }
        let bRange = new SlickRange3(
          activeRow,
          activeCell,
          activeRow + clipCommand.h - 1,
          activeCell + clipCommand.w - 1
        );
        this.markCopySelection([bRange]), grid.getSelectionModel()?.setSelectedRanges([bRange]), this.onPasteCells.notify({ ranges: [bRange] });
      },
      undo: () => {
        for (let y = 0; y < clipCommand.destH; y++)
          for (let x = 0; x < clipCommand.destW; x++) {
            let desty = activeRow + y, destx = activeCell + x;
            if (desty < clipCommand.maxDestY && destx < clipCommand.maxDestX) {
              let dt = grid.getDataItem(desty);
              oneCellToMultiple ? clipCommand.setDataItemValueForColumn(dt, columns[destx], clipCommand.oldValues[0][0]) : clipCommand.setDataItemValueForColumn(dt, columns[destx], clipCommand.oldValues[y][x]), grid.updateCell(desty, destx), grid.onCellChange.notify({
                row: desty,
                cell: destx,
                item: dt,
                grid,
                column: {}
              });
            }
          }
        let bRange = new SlickRange3(
          activeRow,
          activeCell,
          activeRow + clipCommand.h - 1,
          activeCell + clipCommand.w - 1
        );
        if (this.markCopySelection([bRange]), grid.getSelectionModel()?.setSelectedRanges([bRange]), typeof this._options.onPasteCells == "function" && this.onPasteCells.notify({ ranges: [bRange] }), addRows > 1) {
          let d = grid.getData();
          for (; addRows > 1; addRows--)
            d.splice(d.length - 1, 1);
          grid.setData(d), grid.render();
        }
      }
    };
    typeof this._options.clipboardCommandHandler == "function" ? this._options.clipboardCommandHandler(clipCommand) : clipCommand.execute();
  }
  handleKeyDown(e) {
    let ranges;
    if (!this._grid.getEditorLock().isActive() || this._grid.getOptions().autoEdit) {
      if (e.which === this.keyCodes.ESC && this._copiedRanges && (e.preventDefault(), this.clearCopySelection(), this.onCopyCancelled.notify({ ranges: this._copiedRanges }), this._copiedRanges = null), (e.which === this.keyCodes.C || e.which === this.keyCodes.INSERT) && (e.ctrlKey || e.metaKey) && !e.shiftKey && (typeof this._onCopyInit == "function" && this._onCopyInit.call(this), ranges = this._grid.getSelectionModel()?.getSelectedRanges() ?? [], ranges.length !== 0)) {
        this._copiedRanges = ranges, this.markCopySelection(ranges), this.onCopyCells.notify({ ranges });
        let columns = this._grid.getColumns(), clipText = "";
        for (let rg = 0; rg < ranges.length; rg++) {
          let range = ranges[rg], clipTextRows = [];
          for (let i = range.fromRow; i < range.toRow + 1; i++) {
            let clipTextCells = [], dt = this._grid.getDataItem(i);
            if (clipTextRows.length === 0 && this._options.includeHeaderWhenCopying) {
              let clipTextHeaders = [];
              for (let j = range.fromCell; j < range.toCell + 1; j++)
                (columns[j].name instanceof HTMLElement ? columns[j].name.innerHTML : columns[j].name).length > 0 && !columns[j].hidden && clipTextHeaders.push(this.getHeaderValueForColumn(columns[j]));
              clipTextRows.push(clipTextHeaders.join("	"));
            }
            for (let j = range.fromCell; j < range.toCell + 1; j++)
              (columns[j].name instanceof HTMLElement ? columns[j].name.innerHTML : columns[j].name).length > 0 && !columns[j].hidden && clipTextCells.push(this.getDataItemValueForColumn(dt, columns[j], e));
            clipTextRows.push(clipTextCells.join("	"));
          }
          clipText += clipTextRows.join(`\r
`) + `\r
`;
        }
        if (window.clipboardData)
          return window.clipboardData.setData("Text", clipText), !0;
        {
          let focusEl = document.activeElement, ta = this._createTextBox(clipText);
          if (ta.focus(), setTimeout(() => {
            this._bodyElement.removeChild(ta), focusEl ? focusEl.focus() : console.log("No element to restore focus to after copy?");
          }, this._options?.clipboardPasteDelay ?? CLIPBOARD_PASTE_DELAY), typeof this._onCopySuccess == "function") {
            let rowCount = 0;
            ranges.length === 1 ? rowCount = ranges[0].toRow + 1 - ranges[0].fromRow : rowCount = ranges.length, this._onCopySuccess(rowCount);
          }
          return !1;
        }
      }
      if (!this._options.readOnlyMode && (e.which === this.keyCodes.V && (e.ctrlKey || e.metaKey) && !e.shiftKey || e.which === this.keyCodes.INSERT && e.shiftKey && !e.ctrlKey)) {
        let ta = this._createTextBox("");
        return setTimeout(() => this._decodeTabularData(this._grid, ta), 100), !1;
      }
    }
  }
  markCopySelection(ranges) {
    this.clearCopySelection();
    let columns = this._grid.getColumns(), hash = {};
    for (let i = 0; i < ranges.length; i++)
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] = {};
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell && k < columns.length; k++)
          hash[j][columns[k].id] = this._copiedCellStyle;
      }
    this._grid.setCellCssStyles(this._copiedCellStyleLayerKey, hash), clearTimeout(this._clearCopyTI), this._clearCopyTI = setTimeout(() => {
      this.clearCopySelection();
    }, this._options?.clearCopySelectionDelay || CLEAR_COPY_SELECTION_DELAY);
  }
  clearCopySelection() {
    this._grid.removeCellCssStyles(this._copiedCellStyleLayerKey);
  }
  setIncludeHeaderWhenCopying(includeHeaderWhenCopying) {
    this._options.includeHeaderWhenCopying = includeHeaderWhenCopying;
  }
};

// src/plugins/slick.cellmenu.ts
var BindingEventService6 = BindingEventService, SlickEvent7 = SlickEvent, SlickEventData2 = SlickEventData, EventHandler2 = SlickEventHandler, Utils7 = Utils, SlickCellMenu = class {
  constructor(optionProperties) {
    // --
    // public API
    __publicField(this, "pluginName", "CellMenu");
    __publicField(this, "onAfterMenuShow", new SlickEvent7());
    __publicField(this, "onBeforeMenuShow", new SlickEvent7());
    __publicField(this, "onBeforeMenuClose", new SlickEvent7());
    __publicField(this, "onCommand", new SlickEvent7());
    __publicField(this, "onOptionSelected", new SlickEvent7());
    // --
    // protected props
    __publicField(this, "_bindingEventService", new BindingEventService6());
    __publicField(this, "_cellMenuProperties");
    __publicField(this, "_currentCell", -1);
    __publicField(this, "_currentRow", -1);
    __publicField(this, "_grid");
    __publicField(this, "_gridOptions");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_handler", new EventHandler2());
    __publicField(this, "_commandTitleElm");
    __publicField(this, "_optionTitleElm");
    __publicField(this, "_lastMenuTypeClicked", "");
    __publicField(this, "_menuElm");
    __publicField(this, "_subMenuParentId", "");
    __publicField(this, "_defaults", {
      autoAdjustDrop: !0,
      // dropup/dropdown
      autoAlignSide: !0,
      // left/right
      autoAdjustDropOffset: 0,
      autoAlignSideOffset: 0,
      hideMenuOnScroll: !0,
      maxHeight: "none",
      width: "auto",
      subMenuOpenByEvent: "mouseover"
    });
    this._cellMenuProperties = Utils7.extend({}, this._defaults, optionProperties);
  }
  init(grid) {
    this._grid = grid, this._gridOptions = grid.getOptions(), this._gridUid = grid?.getUID() || "", this._handler.subscribe(this._grid.onClick, this.handleCellClick.bind(this)), this._cellMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.closeMenu.bind(this));
  }
  setOptions(newOptions) {
    this._cellMenuProperties = Utils7.extend({}, this._cellMenuProperties, newOptions);
  }
  destroy() {
    this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), this._menuElm?.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
  }
  createParentMenu(e) {
    let cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0, this._currentRow = cell?.row ?? 0;
    let columnDef = this._grid.getColumns()[this._currentCell], commandItems = this._cellMenuProperties.commandItems || [], optionItems = this._cellMenuProperties.optionItems || [];
    if (!(!columnDef || !columnDef.cellMenu || !commandItems.length && !optionItems.length) && (this.closeMenu(), this.onBeforeMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() !== !1 && (this._menuElm = this.createMenu(commandItems, optionItems), this._menuElm.style.top = `${e.pageY + 5}px`, this._menuElm.style.left = `${e.pageX}px`, this._menuElm.style.display = "block", document.body.appendChild(this._menuElm), this.onAfterMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() !== !1)))
      return this._menuElm;
  }
  /**
   * Create parent menu or sub-menu(s), a parent menu will start at level 0 while sub-menu(s) will be incremented
   * @param commandItems - array of optional commands or dividers
   * @param optionItems - array of optional options or dividers
   * @param level - menu level
   * @param item - command, option or divider
   * @returns menu DOM element
   */
  createMenu(commandItems, optionItems, level = 0, item) {
    let columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), maxHeight = isNaN(this._cellMenuProperties.maxHeight) ? this._cellMenuProperties.maxHeight : `${this._cellMenuProperties.maxHeight ?? 0}px`, width = isNaN(this._cellMenuProperties.width) ? this._cellMenuProperties.width : `${this._cellMenuProperties.maxWidth ?? 0}px`, subMenuCommand = item?.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
    subMenuId && (this._subMenuParentId = subMenuId), level > 1 && (subMenuId = this._subMenuParentId);
    let menuClasses = `slick-cell-menu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-cell-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId)
        return bodyMenuElm;
      this.destroySubMenus();
    }
    let menuElm = document.createElement("div");
    menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.ariaLabel = level > 1 ? "SubMenu" : "Cell Menu", menuElm.role = "menu", width && (menuElm.style.width = width), maxHeight && (menuElm.style.maxHeight = maxHeight), menuElm.style.display = "none";
    let closeButtonElm = null;
    if (level === 0) {
      closeButtonElm = document.createElement("button"), closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-cell-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", closeButtonElm.appendChild(spanCloseElm);
    }
    if (!this._cellMenuProperties.hideOptionSection && optionItems.length > 0) {
      let optionMenuElm = document.createElement("div");
      optionMenuElm.className = "slick-cell-menu-option-list", optionMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, optionMenuElm), closeButtonElm && !this._cellMenuProperties.hideCloseButton && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(optionMenuElm), this.populateCommandOrOptionItems(
        "option",
        this._cellMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }
    if (!this._cellMenuProperties.hideCommandSection && commandItems.length > 0) {
      let commandMenuElm = document.createElement("div");
      commandMenuElm.className = "slick-cell-menu-command-list", commandMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, commandMenuElm), closeButtonElm && !this._cellMenuProperties.hideCloseButton && (optionItems.length === 0 || this._cellMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(commandMenuElm), this.populateCommandOrOptionItems(
        "command",
        this._cellMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }
    return level++, menuElm;
  }
  addSubMenuTitleWhenExists(item, commandOrOptionMenu) {
    if (item !== "divider" && item?.subMenuTitle) {
      let subMenuTitleElm = document.createElement("div");
      subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
      let subMenuTitleClass = item.subMenuTitleCssClass;
      subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandOrOptionMenu.appendChild(subMenuTitleElm);
    }
  }
  handleCloseButtonClicked(e) {
    e.defaultPrevented || this.closeMenu(e);
  }
  /** Close and destroy Cell Menu */
  closeMenu(e, args) {
    if (this._menuElm) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell ?? 0,
        row: args?.row ?? 0,
        grid: this._grid
      }, e, this).getReturnValue() === !1)
        return;
      this._menuElm.remove(), this._menuElm = null;
    }
    this.destroySubMenus();
  }
  /** Destroy all parent menus and any sub-menus */
  destroyAllMenus() {
    this.destroySubMenus(), this._bindingEventService.unbindAll("parent-menu"), document.querySelectorAll(`.slick-cell-menu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  repositionSubMenu(item, type, level, e) {
    (e.target.classList.contains("slick-cell") || this._lastMenuTypeClicked !== type) && this.destroySubMenus();
    let subMenuElm = this.createMenu(item?.commandItems || [], item?.optionItems || [], level + 1, item);
    subMenuElm.style.display = "block", document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
  }
  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  repositionMenu(e, menuElm) {
    let isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-cell-menu-item") : e.target.closest(".slick-cell");
    if (menuElm && parentElm) {
      let parentOffset = Utils7.offset(parentElm), menuOffsetLeft = parentElm ? parentOffset?.left ?? 0 : e?.pageX ?? 0, menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : e?.pageY ?? 0, parentCellWidth = parentElm?.offsetWidth || 0, menuHeight = menuElm?.offsetHeight ?? 0, menuWidth = Number(menuElm?.offsetWidth ?? this._cellMenuProperties.width ?? 0), rowHeight = this._gridOptions.rowHeight, dropOffset = Number(this._cellMenuProperties.autoAdjustDropOffset || 0), sideOffset = Number(this._cellMenuProperties.autoAlignSideOffset || 0);
      if (this._cellMenuProperties.autoAdjustDrop) {
        let spaceBottom = Utils7.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils7.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
        (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (menuElm.classList.remove("dropdown"), menuElm.classList.add("dropup"), isSubMenu ? menuOffsetTop -= menuHeight - dropOffset - parentElm.clientHeight : menuOffsetTop -= menuHeight - dropOffset) : (menuElm.classList.remove("dropup"), menuElm.classList.add("dropdown"), isSubMenu ? menuOffsetTop += dropOffset : menuOffsetTop += rowHeight + dropOffset);
      }
      if (this._cellMenuProperties.autoAlignSide) {
        let gridPos = this._grid.getGridPosition(), subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
        isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
        let browserWidth = document.documentElement.clientWidth;
        (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), isSubMenu ? menuOffsetLeft -= menuWidth - sideOffset : menuOffsetLeft -= menuWidth - parentCellWidth - sideOffset) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu ? menuOffsetLeft += sideOffset + parentElm.offsetWidth : menuOffsetLeft += sideOffset);
      }
      menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`;
    }
  }
  getGridUidSelector() {
    let gridUid = this._grid.getUID() || "";
    return gridUid ? `.${gridUid}` : "";
  }
  handleCellClick(evt, args) {
    this.destroyAllMenus();
    let e = evt instanceof SlickEventData2 ? evt.getNativeEvent() : evt, cell = this._grid.getCellFromEvent(e);
    if (cell) {
      let dataContext = this._grid.getDataItem(cell.row), columnDef = this._grid.getColumns()[cell.cell];
      if (columnDef?.cellMenu && e.preventDefault(), this._cellMenuProperties = Utils7.extend({}, this._cellMenuProperties, columnDef.cellMenu), args = args || {}, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._cellMenuProperties.menuUsabilityOverride, args))
        return;
      this._menuElm = this.createParentMenu(e), this._menuElm && (this.repositionMenu(e, this._menuElm), this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this));
    }
  }
  /** When users click outside the Cell Menu, we will typically close the Cell Menu (and any sub-menus) */
  handleBodyMouseDown(e) {
    let isMenuClicked = !1;
    this._menuElm?.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-cell-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
      subElm.contains(e.target) && (isMenuClicked = !0);
    }), this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this.closeMenu(e, { cell: this._currentCell, row: this._currentRow, grid: this._grid });
  }
  /** Build the Command Items section. */
  populateCommandOrOptionItems(itemType, cellMenu, commandOrOptionMenuElm, commandOrOptionItems, args) {
    if (!args || !commandOrOptionItems || !cellMenu)
      return;
    let level = args?.level || 0, isSubMenu = level > 0;
    cellMenu?.[`${itemType}Title`] && !isSubMenu && (this[`_${itemType}TitleElm`] = document.createElement("div"), this[`_${itemType}TitleElm`].className = "slick-menu-title", this[`_${itemType}TitleElm`].textContent = cellMenu[`${itemType}Title`], commandOrOptionMenuElm.appendChild(this[`_${itemType}TitleElm`]));
    for (let i = 0, ln = commandOrOptionItems.length; i < ln; i++) {
      let addClickListener = !0, item = commandOrOptionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
      if (!isItemVisible)
        continue;
      Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
      let liElm = document.createElement("div");
      liElm.className = "slick-cell-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-cell-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-cell-menu-item-disabled"), item.hidden && liElm.classList.add("slick-cell-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
      let iconElm = document.createElement("div");
      iconElm.className = "slick-cell-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
      let textElm = document.createElement("span");
      if (textElm.className = "slick-cell-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandOrOptionMenuElm.appendChild(liElm), addClickListener) {
        let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
        this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item, itemType, level), void 0, eventGroup);
      }
      if (this._cellMenuProperties.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(liElm, "mouseover", (e) => {
        item.commandItems || item.optionItems ? (this.repositionSubMenu(item, itemType, level, e), this._lastMenuTypeClicked = itemType) : isSubMenu || this.destroySubMenus();
      }), item.commandItems || item.optionItems) {
        let chevronElm = document.createElement("span");
        chevronElm.className = "sub-item-chevron", this._cellMenuProperties.subItemChevronClass ? chevronElm.classList.add(...this._cellMenuProperties.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", liElm.classList.add("slick-submenu-item"), liElm.appendChild(chevronElm);
        continue;
      }
    }
  }
  handleMenuItemClick(item, type, level = 0, e) {
    if (item?.[type] !== void 0 && item !== "divider" && !item.disabled && !item.divider && this._currentCell !== void 0 && this._currentRow !== void 0) {
      if (type === "option" && !this._grid.getEditorLock().commitCurrentEdit())
        return;
      let optionOrCommand = item[type] !== void 0 ? item[type] : "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row);
      if (optionOrCommand !== void 0 && !item[`${type}Items`]) {
        let callbackArgs = {
          cell,
          row,
          grid: this._grid,
          [type]: optionOrCommand,
          item,
          column: columnDef,
          dataContext
        };
        this[type === "command" ? "onCommand" : "onOptionSelected"].notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.closeMenu(e, { cell, row, grid: this._grid });
      } else
        item.commandItems || item.optionItems ? this.repositionSubMenu(item, type, level, e) : this.destroySubMenus();
      this._lastMenuTypeClicked = type;
    }
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
};

// src/plugins/slick.cellrangedecorator.ts
var Utils8 = Utils, SlickCellRangeDecorator = class {
  constructor(grid, options) {
    this.grid = grid;
    // --
    // public API
    __publicField(this, "pluginName", "CellRangeDecorator");
    // --
    // protected props
    __publicField(this, "_options");
    __publicField(this, "_elem");
    __publicField(this, "_defaults", {
      selectionCssClass: "slick-range-decorator",
      selectionCss: {
        zIndex: "9999",
        border: "2px dashed red"
      },
      offset: { top: -1, left: -1, height: -2, width: -2 }
    });
    this._options = Utils8.extend(!0, {}, this._defaults, options);
  }
  destroy() {
    this.hide();
  }
  init() {
  }
  hide() {
    this._elem?.remove(), this._elem = null;
  }
  show(range) {
    if (!this._elem) {
      this._elem = document.createElement("div"), this._elem.className = this._options.selectionCssClass, Object.keys(this._options.selectionCss).forEach((cssStyleKey) => {
        this._elem.style[cssStyleKey] = this._options.selectionCss[cssStyleKey];
      }), this._elem.style.position = "absolute";
      let canvasNode = this.grid.getActiveCanvasNode();
      canvasNode && canvasNode.appendChild(this._elem);
    }
    let from = this.grid.getCellNodeBox(range.fromRow, range.fromCell), to = this.grid.getCellNodeBox(range.toRow, range.toCell);
    return from && to && this._options?.offset && (this._elem.style.top = `${from.top + this._options.offset.top}px`, this._elem.style.left = `${from.left + this._options.offset.left}px`, this._elem.style.height = `${to.bottom - from.top + this._options.offset.height}px`, this._elem.style.width = `${to.right - from.left + this._options.offset.width}px`), this._elem;
  }
};

// src/slick.interactions.ts
var Utils9 = Utils;
function Draggable(options) {
  let { containerElement } = options, { onDragInit, onDragStart, onDrag, onDragEnd } = options, element, startX, startY, deltaX, deltaY, dragStarted;
  containerElement || (containerElement = document.body);
  let originaldd = {
    dragSource: containerElement,
    dragHandle: null
  };
  function init() {
    containerElement && (containerElement.addEventListener("mousedown", userPressed), containerElement.addEventListener("touchstart", userPressed));
  }
  function executeDragCallbackWhenDefined(callback, evt, dd) {
    typeof callback == "function" && callback(evt, dd);
  }
  function destroy() {
    containerElement && (containerElement.removeEventListener("mousedown", userPressed), containerElement.removeEventListener("touchstart", userPressed));
  }
  function userPressed(event2) {
    element = event2.target;
    let targetEvent = event2?.touches?.[0] ?? event2, { target } = targetEvent;
    if (!options.allowDragFrom || options.allowDragFrom && element.matches(options.allowDragFrom) || options.allowDragFromClosest && element.closest(options.allowDragFromClosest)) {
      originaldd.dragHandle = element;
      let winScrollPos = Utils9.windowScrollPosition();
      startX = winScrollPos.left + targetEvent.clientX, startY = winScrollPos.top + targetEvent.clientY, deltaX = targetEvent.clientX - targetEvent.clientX, deltaY = targetEvent.clientY - targetEvent.clientY, originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragInit, event2, originaldd), document.body.addEventListener("mousemove", userMoved), document.body.addEventListener("touchmove", userMoved), document.body.addEventListener("mouseup", userReleased), document.body.addEventListener("touchend", userReleased), document.body.addEventListener("touchcancel", userReleased);
    }
  }
  function userMoved(event2) {
    let targetEvent = event2?.touches?.[0] ?? event2;
    deltaX = targetEvent.clientX - startX, deltaY = targetEvent.clientY - startY;
    let { target } = targetEvent;
    dragStarted || (originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDragStart, event2, originaldd), dragStarted = !0), originaldd = Object.assign(originaldd, { deltaX, deltaY, startX, startY, target }), executeDragCallbackWhenDefined(onDrag, event2, originaldd);
  }
  function userReleased(event2) {
    if (document.body.removeEventListener("mousemove", userMoved), document.body.removeEventListener("touchmove", userMoved), document.body.removeEventListener("mouseup", userReleased), document.body.removeEventListener("touchend", userReleased), document.body.removeEventListener("touchcancel", userReleased), dragStarted) {
      let { target } = event2;
      originaldd = Object.assign(originaldd, { target }), executeDragCallbackWhenDefined(onDragEnd, event2, originaldd), dragStarted = !1;
    }
  }
  return init(), { destroy };
}
function MouseWheel(options) {
  let { element, onMouseWheel } = options;
  function destroy() {
    element.removeEventListener("wheel", wheelHandler), element.removeEventListener("mousewheel", wheelHandler);
  }
  function init() {
    element.addEventListener("wheel", wheelHandler), element.addEventListener("mousewheel", wheelHandler);
  }
  function wheelHandler(event2) {
    let orgEvent = event2 || window.event, delta = 0, deltaX = 0, deltaY = 0;
    orgEvent.wheelDelta && (delta = orgEvent.wheelDelta / 120), orgEvent.detail && (delta = -orgEvent.detail / 3), deltaY = delta, orgEvent.axis !== void 0 && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaY = 0, deltaX = -1 * delta), orgEvent.wheelDeltaY !== void 0 && (deltaY = orgEvent.wheelDeltaY / 120), orgEvent.wheelDeltaX !== void 0 && (deltaX = -1 * orgEvent.wheelDeltaX / 120), typeof onMouseWheel == "function" && onMouseWheel(event2, delta, deltaX, deltaY);
  }
  return init(), { destroy };
}
function Resizable(options) {
  let { resizeableElement, resizeableHandleElement, onResizeStart, onResize, onResizeEnd } = options;
  if (!resizeableHandleElement || typeof resizeableHandleElement.addEventListener != "function")
    throw new Error("[Slick.Resizable] You did not provide a valid html element that will be used for the handle to resize.");
  function init() {
    resizeableHandleElement.addEventListener("mousedown", resizeStartHandler), resizeableHandleElement.addEventListener("touchstart", resizeStartHandler);
  }
  function destroy() {
    typeof resizeableHandleElement?.removeEventListener == "function" && (resizeableHandleElement.removeEventListener("mousedown", resizeStartHandler), resizeableHandleElement.removeEventListener("touchstart", resizeStartHandler));
  }
  function executeResizeCallbackWhenDefined(callback, e) {
    typeof callback == "function" && callback(e, { resizeableElement, resizeableHandleElement });
  }
  function resizeStartHandler(e) {
    e.preventDefault();
    let event2 = e.touches ? e.changedTouches[0] : e;
    executeResizeCallbackWhenDefined(onResizeStart, event2), document.body.addEventListener("mousemove", resizingHandler), document.body.addEventListener("mouseup", resizeEndHandler), document.body.addEventListener("touchmove", resizingHandler), document.body.addEventListener("touchend", resizeEndHandler);
  }
  function resizingHandler(e) {
    e.preventDefault && e.type !== "touchmove" && e.preventDefault();
    let event2 = e.touches ? e.changedTouches[0] : e;
    typeof onResize == "function" && onResize(event2, { resizeableElement, resizeableHandleElement });
  }
  function resizeEndHandler(e) {
    let event2 = e.touches ? e.changedTouches[0] : e;
    executeResizeCallbackWhenDefined(onResizeEnd, event2), document.body.removeEventListener("mousemove", resizingHandler), document.body.removeEventListener("mouseup", resizeEndHandler), document.body.removeEventListener("touchmove", resizingHandler), document.body.removeEventListener("touchend", resizeEndHandler);
  }
  return init(), { destroy };
}

// src/plugins/slick.cellrangeselector.ts
var SlickEvent8 = SlickEvent, SlickEventHandler2 = SlickEventHandler, SlickRange4 = SlickRange, Draggable2 = Draggable, SlickCellRangeDecorator2 = SlickCellRangeDecorator, Utils10 = Utils, SlickCellRangeSelector = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "CellRangeSelector");
    __publicField(this, "onBeforeCellRangeSelected", new SlickEvent8());
    __publicField(this, "onCellRangeSelected", new SlickEvent8());
    __publicField(this, "onCellRangeSelecting", new SlickEvent8());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_currentlySelectedRange", null);
    __publicField(this, "_canvas", null);
    __publicField(this, "_decorator");
    __publicField(this, "_gridOptions");
    __publicField(this, "_activeCanvas");
    __publicField(this, "_dragging", !1);
    __publicField(this, "_handler", new SlickEventHandler2());
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      autoScroll: !0,
      minIntervalToShowNextCell: 30,
      maxIntervalToShowNextCell: 600,
      // better to a multiple of minIntervalToShowNextCell
      accelerateInterval: 5,
      // increase 5ms when cursor 1px outside the viewport.
      selectionCss: {
        border: "2px dashed blue"
      }
    });
    // Frozen row & column variables
    __publicField(this, "_rowOffset", 0);
    __publicField(this, "_columnOffset", 0);
    __publicField(this, "_isRightCanvas", !1);
    __publicField(this, "_isBottomCanvas", !1);
    // autoScroll related constiables
    __publicField(this, "_activeViewport");
    __publicField(this, "_autoScrollTimerId");
    __publicField(this, "_draggingMouseOffset");
    __publicField(this, "_moveDistanceForOneCell");
    __publicField(this, "_xDelayForNextCell", 0);
    __publicField(this, "_yDelayForNextCell", 0);
    __publicField(this, "_viewportHeight", 0);
    __publicField(this, "_viewportWidth", 0);
    __publicField(this, "_isRowMoveRegistered", !1);
    // Scrollings
    __publicField(this, "_scrollLeft", 0);
    __publicField(this, "_scrollTop", 0);
    this._options = Utils10.extend(!0, {}, this._defaults, options);
  }
  init(grid) {
    if (Draggable2 === void 0)
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    this._decorator = this._options.cellDecorator || new SlickCellRangeDecorator2(grid, this._options), this._grid = grid, this._canvas = this._grid.getCanvasNode(), this._gridOptions = this._grid.getOptions(), this._handler.subscribe(this._grid.onScroll, this.handleScroll.bind(this)).subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
  }
  destroy() {
    this._handler.unsubscribeAll(), this._activeCanvas = null, this._activeViewport = null, this._canvas = null, this._decorator?.destroy();
  }
  getCellDecorator() {
    return this._decorator;
  }
  handleScroll(_e, args) {
    this._scrollTop = args.scrollTop, this._scrollLeft = args.scrollLeft;
  }
  handleDragInit(e) {
    this._activeCanvas = this._grid.getActiveCanvasNode(e), this._activeViewport = this._grid.getActiveViewportNode(e);
    let scrollbarDimensions = this._grid.getDisplayedScrollbarDimensions();
    if (this._viewportWidth = this._activeViewport.offsetWidth - scrollbarDimensions.width, this._viewportHeight = this._activeViewport.offsetHeight - scrollbarDimensions.height, this._moveDistanceForOneCell = {
      x: this._grid.getAbsoluteColumnMinWidth() / 2,
      y: this._grid.getOptions().rowHeight / 2
    }, this._isRowMoveRegistered = this.hasRowMoveManager(), this._rowOffset = 0, this._columnOffset = 0, this._isBottomCanvas = this._activeCanvas.classList.contains("grid-canvas-bottom"), this._gridOptions.frozenRow > -1 && this._isBottomCanvas) {
      let canvasSelector = `.${this._grid.getUID()} .grid-canvas-${this._gridOptions.frozenBottom ? "bottom" : "top"}`, canvasElm = document.querySelector(canvasSelector);
      canvasElm && (this._rowOffset = canvasElm.clientHeight || 0);
    }
    if (this._isRightCanvas = this._activeCanvas.classList.contains("grid-canvas-right"), this._gridOptions.frozenColumn > -1 && this._isRightCanvas) {
      let canvasLeftElm = document.querySelector(`.${this._grid.getUID()} .grid-canvas-left`);
      canvasLeftElm && (this._columnOffset = canvasLeftElm.clientWidth || 0);
    }
    e.stopImmediatePropagation(), e.preventDefault();
  }
  handleDragStart(e, dd) {
    let cell = this._grid.getCellFromEvent(e);
    if (cell && this.onBeforeCellRangeSelected.notify(cell).getReturnValue() !== !1 && this._grid.canCellBeSelected(cell.row, cell.cell) && (this._dragging = !0, e.stopImmediatePropagation()), !this._dragging)
      return;
    this._grid.focus();
    let canvasOffset = Utils10.offset(this._canvas), startX = dd.startX - (canvasOffset?.left ?? 0);
    this._gridOptions.frozenColumn >= 0 && this._isRightCanvas && (startX += this._scrollLeft);
    let startY = dd.startY - (canvasOffset?.top ?? 0);
    this._gridOptions.frozenRow >= 0 && this._isBottomCanvas && (startY += this._scrollTop);
    let start = this._grid.getCellFromPoint(startX, startY);
    return dd.range = { start, end: {} }, this._currentlySelectedRange = dd.range, this._decorator.show(new SlickRange4(start.row, start.cell));
  }
  handleDrag(evt, dd) {
    if (!this._dragging && !this._isRowMoveRegistered)
      return;
    this._isRowMoveRegistered || evt.stopImmediatePropagation();
    let e = evt.getNativeEvent();
    if (this._options.autoScroll && (this._draggingMouseOffset = this.getMouseOffsetViewport(e, dd), this._draggingMouseOffset.isOutsideViewport))
      return this.handleDragOutsideViewport();
    this.stopIntervalTimer(), this.handleDragTo(e, dd);
  }
  getMouseOffsetViewport(e, dd) {
    let targetEvent = e?.touches?.[0] ?? e, viewportLeft = this._activeViewport.scrollLeft, viewportTop = this._activeViewport.scrollTop, viewportRight = viewportLeft + this._viewportWidth, viewportBottom = viewportTop + this._viewportHeight, viewportOffset = Utils10.offset(this._activeViewport), viewportOffsetLeft = viewportOffset?.left ?? 0, viewportOffsetTop = viewportOffset?.top ?? 0, viewportOffsetRight = viewportOffsetLeft + this._viewportWidth, viewportOffsetBottom = viewportOffsetTop + this._viewportHeight, result = {
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
  handleDragOutsideViewport() {
    if (this._xDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.x) * this._options.accelerateInterval, this._yDelayForNextCell = this._options.maxIntervalToShowNextCell - Math.abs(this._draggingMouseOffset.offset.y) * this._options.accelerateInterval, !this._autoScrollTimerId) {
      let xTotalDelay = 0, yTotalDelay = 0;
      this._autoScrollTimerId = setInterval(() => {
        let xNeedUpdate = !1, yNeedUpdate = !1;
        this._draggingMouseOffset.offset.x ? (xTotalDelay += this._options.minIntervalToShowNextCell, xNeedUpdate = xTotalDelay >= this._xDelayForNextCell) : xTotalDelay = 0, this._draggingMouseOffset.offset.y ? (yTotalDelay += this._options.minIntervalToShowNextCell, yNeedUpdate = yTotalDelay >= this._yDelayForNextCell) : yTotalDelay = 0, (xNeedUpdate || yNeedUpdate) && (xNeedUpdate && (xTotalDelay = 0), yNeedUpdate && (yTotalDelay = 0), this.handleDragToNewPosition(xNeedUpdate, yNeedUpdate));
      }, this._options.minIntervalToShowNextCell);
    }
  }
  handleDragToNewPosition(xNeedUpdate, yNeedUpdate) {
    let pageX = this._draggingMouseOffset.e.pageX, pageY = this._draggingMouseOffset.e.pageY, mouseOffsetX = this._draggingMouseOffset.offset.x, mouseOffsetY = this._draggingMouseOffset.offset.y, viewportOffset = this._draggingMouseOffset.viewport.offset;
    xNeedUpdate && mouseOffsetX && (mouseOffsetX > 0 ? pageX = viewportOffset.right + this._moveDistanceForOneCell.x : pageX = viewportOffset.left - this._moveDistanceForOneCell.x), yNeedUpdate && mouseOffsetY && (mouseOffsetY > 0 ? pageY = viewportOffset.top - this._moveDistanceForOneCell.y : pageY = viewportOffset.bottom + this._moveDistanceForOneCell.y), this.handleDragTo({ pageX, pageY }, this._draggingMouseOffset.dd);
  }
  stopIntervalTimer() {
    this._autoScrollTimerId && (clearInterval(this._autoScrollTimerId), this._autoScrollTimerId = void 0);
  }
  handleDragTo(e, dd) {
    let targetEvent = e?.touches?.[0] ?? e, canvasOffset = Utils10.offset(this._activeCanvas), end = this._grid.getCellFromPoint(
      targetEvent.pageX - (canvasOffset?.left ?? 0) + this._columnOffset,
      targetEvent.pageY - (canvasOffset?.top ?? 0) + this._rowOffset
    );
    if (!(this._gridOptions.frozenColumn >= 0 && !this._isRightCanvas && end.cell > this._gridOptions.frozenColumn || this._isRightCanvas && end.cell <= this._gridOptions.frozenColumn) && !(this._gridOptions.frozenRow >= 0 && !this._isBottomCanvas && end.row >= this._gridOptions.frozenRow || this._isBottomCanvas && end.row < this._gridOptions.frozenRow)) {
      if (this._options.autoScroll && this._draggingMouseOffset) {
        let endCellBox = this._grid.getCellNodeBox(end.row, end.cell);
        if (!endCellBox)
          return;
        let viewport = this._draggingMouseOffset.viewport;
        (endCellBox.left < viewport.left || endCellBox.right > viewport.right || endCellBox.top < viewport.top || endCellBox.bottom > viewport.bottom) && this._grid.scrollCellIntoView(end.row, end.cell);
      }
      if (this._grid.canCellBeSelected(end.row, end.cell) && dd?.range) {
        dd.range.end = end;
        let range = new SlickRange4(dd.range.start.row ?? 0, dd.range.start.cell ?? 0, end.row, end.cell);
        this._decorator.show(range), this.onCellRangeSelecting.notify({
          range
        });
      }
    }
  }
  hasRowMoveManager() {
    return !!(this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager"));
  }
  handleDragEnd(e, dd) {
    this._decorator.hide(), this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), this.stopIntervalTimer(), this.onCellRangeSelected.notify({
      range: new SlickRange4(
        dd.range.start.row ?? 0,
        dd.range.start.cell ?? 0,
        dd.range.end.row,
        dd.range.end.cell
      )
    }));
  }
  getCurrentRange() {
    return this._currentlySelectedRange;
  }
};

// src/plugins/slick.cellselectionmodel.ts
var SlickEvent9 = SlickEvent, SlickEventData4 = SlickEventData, SlickRange5 = SlickRange, SlickCellRangeSelector2 = SlickCellRangeSelector, Utils11 = Utils, SlickCellSelectionModel = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "CellSelectionModel");
    __publicField(this, "onSelectedRangesChanged", new SlickEvent9());
    // --
    // protected props
    __publicField(this, "_cachedPageRowCount", 0);
    __publicField(this, "_dataView");
    __publicField(this, "_grid");
    __publicField(this, "_prevSelectedRow");
    __publicField(this, "_prevKeyDown", "");
    __publicField(this, "_ranges", []);
    __publicField(this, "_selector");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      selectActiveCell: !0
    });
    options === void 0 || options.cellRangeSelector === void 0 ? this._selector = new SlickCellRangeSelector2({ selectionCss: { border: "2px solid black" } }) : this._selector = options.cellRangeSelector;
  }
  init(grid) {
    this._options = Utils11.extend(!0, {}, this._defaults, this._options), this._grid = grid, grid.hasDataView() && (this._dataView = grid.getData()), this._grid.onActiveCellChanged.subscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.subscribe(this.handleKeyDown.bind(this)), grid.registerPlugin(this._selector), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this));
  }
  destroy() {
    this._grid.onActiveCellChanged.unsubscribe(this.handleActiveCellChange.bind(this)), this._grid.onKeyDown.unsubscribe(this.handleKeyDown.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), this._selector?.destroy();
  }
  removeInvalidRanges(ranges) {
    let result = [];
    for (let i = 0; i < ranges.length; i++) {
      let r = ranges[i];
      this._grid.canCellBeSelected(r.fromRow, r.fromCell) && this._grid.canCellBeSelected(r.toRow, r.toCell) && result.push(r);
    }
    return result;
  }
  rangesAreEqual(range1, range2) {
    let areDifferent = range1.length !== range2.length;
    if (!areDifferent) {
      for (let i = 0; i < range1.length; i++)
        if (range1[i].fromCell !== range2[i].fromCell || range1[i].fromRow !== range2[i].fromRow || range1[i].toCell !== range2[i].toCell || range1[i].toRow !== range2[i].toRow) {
          areDifferent = !0;
          break;
        }
    }
    return !areDifferent;
  }
  /** Provide a way to force a recalculation of page row count (for example on grid resize) */
  resetPageRowCount() {
    this._cachedPageRowCount = 0;
  }
  setSelectedRanges(ranges, caller = "SlickCellSelectionModel.setSelectedRanges") {
    if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))
      return;
    let rangeHasChanged = !this.rangesAreEqual(this._ranges, ranges);
    if (this._ranges = this.removeInvalidRanges(ranges), rangeHasChanged) {
      let eventData = new SlickEventData4(null, this._ranges);
      Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickCellSelectionModel.setSelectedRanges" } }), this.onSelectedRangesChanged.notify(this._ranges, eventData);
    }
  }
  getSelectedRanges() {
    return this._ranges;
  }
  refreshSelections() {
    this.setSelectedRanges(this.getSelectedRanges());
  }
  handleBeforeCellRangeSelected(e) {
    if (this._grid.getEditorLock().isActive())
      return e.stopPropagation(), !1;
  }
  handleCellRangeSelected(_e, args) {
    this._grid.setActiveCell(args.range.fromRow, args.range.fromCell, !1, !1, !0), this.setSelectedRanges([args.range]);
  }
  handleActiveCellChange(_e, args) {
    this._prevSelectedRow = void 0, this._options?.selectActiveCell && Utils11.isDefined(args.row) && Utils11.isDefined(args.cell) ? this.setSelectedRanges([new SlickRange5(args.row, args.cell)]) : this._options?.selectActiveCell || this.setSelectedRanges([]);
  }
  isKeyAllowed(key) {
    return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageDown", "PageUp", "Home", "End"].some((k) => k === key);
  }
  handleKeyDown(e) {
    let ranges, last, active = this._grid.getActiveCell(), metaKey = e.ctrlKey || e.metaKey, dataLn = 0;
    if (this._dataView ? dataLn = this._dataView?.getPagingInfo().pageSize || this._dataView.getLength() : dataLn = this._grid.getDataLength(), active && e.shiftKey && !metaKey && !e.altKey && this.isKeyAllowed(e.key)) {
      ranges = this.getSelectedRanges().slice(), ranges.length || ranges.push(new SlickRange5(active.row, active.cell)), last = ranges.pop(), last.contains(active.row, active.cell) || (last = new SlickRange5(active.row, active.cell));
      let dRow = last.toRow - last.fromRow, dCell = last.toCell - last.fromCell, dirRow = active.row === last.fromRow ? 1 : -1, dirCell = active.cell === last.fromCell ? 1 : -1, isSingleKeyMove = e.key.startsWith("Arrow"), toRow = 0;
      isSingleKeyMove ? (e.key === "ArrowLeft" ? dCell -= dirCell : e.key === "ArrowRight" ? dCell += dirCell : e.key === "ArrowUp" ? dRow -= dirRow : e.key === "ArrowDown" && (dRow += dirRow), toRow = active.row + dirRow * dRow) : (this._cachedPageRowCount < 1 && (this._cachedPageRowCount = this._grid.getViewportRowCount()), this._prevSelectedRow === void 0 && (this._prevSelectedRow = active.row), e.key === "Home" ? toRow = 0 : e.key === "End" ? toRow = dataLn - 1 : e.key === "PageUp" ? (this._prevSelectedRow >= 0 && (toRow = this._prevSelectedRow - this._cachedPageRowCount), toRow < 0 && (toRow = 0)) : e.key === "PageDown" && (this._prevSelectedRow <= dataLn - 1 && (toRow = this._prevSelectedRow + this._cachedPageRowCount), toRow > dataLn - 1 && (toRow = dataLn - 1)), this._prevSelectedRow = toRow);
      let new_last = new SlickRange5(active.row, active.cell, toRow, active.cell + dirCell * dCell);
      if (this.removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        let viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow, viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
        isSingleKeyMove ? (this._grid.scrollRowIntoView(viewRow), this._grid.scrollCellIntoView(viewRow, viewCell)) : (this._grid.scrollRowIntoView(toRow), this._grid.scrollCellIntoView(toRow, viewCell));
      } else
        ranges.push(last);
      this.setSelectedRanges(ranges), e.preventDefault(), e.stopPropagation(), this._prevKeyDown = e.key;
    }
  }
};

// src/plugins/slick.checkboxselectcolumn.ts
var BindingEventService7 = BindingEventService, SlickEventHandler3 = SlickEventHandler, Utils12 = Utils, SlickCheckboxSelectColumn = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "CheckboxSelectColumn");
    // --
    // protected props
    __publicField(this, "_dataView");
    __publicField(this, "_grid");
    __publicField(this, "_isUsingDataView", !1);
    __publicField(this, "_selectableOverride", null);
    __publicField(this, "_headerRowNode");
    __publicField(this, "_selectAll_UID");
    __publicField(this, "_handler", new SlickEventHandler3());
    __publicField(this, "_selectedRowsLookup", {});
    __publicField(this, "_checkboxColumnCellIndex", null);
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      columnId: "_checkbox_selector",
      cssClass: void 0,
      hideSelectAllCheckbox: !1,
      toolTip: "Select/Deselect All",
      width: 30,
      applySelectOnAllPages: !1,
      // defaults to false, when that is enabled the "Select All" will be applied to all pages (when using Pagination)
      hideInColumnTitleRow: !1,
      hideInFilterHeaderRow: !0
    });
    __publicField(this, "_isSelectAllChecked", !1);
    __publicField(this, "_bindingEventService");
    this._bindingEventService = new BindingEventService7(), this._options = Utils12.extend(!0, {}, this._defaults, options), this._selectAll_UID = this.createUID(), typeof this._options.selectableOverride == "function" && this.selectableOverride(this._options.selectableOverride);
  }
  init(grid) {
    this._grid = grid, this._isUsingDataView = !Array.isArray(grid.getData()), this._isUsingDataView && (this._dataView = grid.getData()), this._handler.subscribe(this._grid.onSelectedRowsChanged, this.handleSelectedRowsChanged.bind(this)).subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onKeyDown, this.handleKeyDown.bind(this)), this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages && this._handler.subscribe(this._dataView.onSelectedRowIdsChanged, this.handleDataViewSelectedIdsChanged.bind(this)).subscribe(this._dataView.onPagingInfoChanged, this.handleDataViewSelectedIdsChanged.bind(this)), this._options.hideInFilterHeaderRow || this.addCheckboxToFilterHeaderRow(grid), this._options.hideInColumnTitleRow || this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this));
  }
  destroy() {
    this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
  }
  getOptions() {
    return this._options;
  }
  setOptions(options) {
    if (this._options = Utils12.extend(!0, {}, this._options, options), this._options.hideSelectAllCheckbox)
      this.hideSelectAllFromColumnHeaderTitleRow(), this.hideSelectAllFromColumnHeaderFilterRow();
    else if (this._options.hideInColumnTitleRow ? this.hideSelectAllFromColumnHeaderTitleRow() : (this.renderSelectAllCheckbox(this._isSelectAllChecked), this._handler.subscribe(this._grid.onHeaderClick, this.handleHeaderClick.bind(this))), this._options.hideInFilterHeaderRow)
      this.hideSelectAllFromColumnHeaderFilterRow();
    else {
      let selectAllContainerElm = this._headerRowNode?.querySelector("#filter-checkbox-selectall-container");
      if (selectAllContainerElm) {
        selectAllContainerElm.style.display = "flex";
        let selectAllInputElm = selectAllContainerElm.querySelector('input[type="checkbox"]');
        selectAllInputElm && (selectAllInputElm.checked = this._isSelectAllChecked);
      }
    }
  }
  hideSelectAllFromColumnHeaderTitleRow() {
    this._grid.updateColumnHeader(this._options.columnId || "", "", "");
  }
  hideSelectAllFromColumnHeaderFilterRow() {
    let selectAllContainerElm = this._headerRowNode?.querySelector("#filter-checkbox-selectall-container");
    selectAllContainerElm && (selectAllContainerElm.style.display = "none");
  }
  handleSelectedRowsChanged() {
    let selectedRows = this._grid.getSelectedRows(), lookup = {}, row = 0, i = 0, k = 0, disabledCount = 0;
    if (typeof this._selectableOverride == "function")
      for (k = 0; k < this._grid.getDataLength(); k++) {
        let dataItem = this._grid.getDataItem(k);
        this.checkSelectableOverride(i, dataItem, this._grid) || disabledCount++;
      }
    let removeList = [];
    for (i = 0; i < selectedRows.length; i++) {
      row = selectedRows[i];
      let rowItem = this._grid.getDataItem(row);
      this.checkSelectableOverride(i, rowItem, this._grid) ? (lookup[row] = !0, lookup[row] !== this._selectedRowsLookup[row] && (this._grid.invalidateRow(row), delete this._selectedRowsLookup[row])) : removeList.push(row);
    }
    for (let selectedRow in this._selectedRowsLookup)
      this._grid.invalidateRow(+selectedRow);
    if (this._selectedRowsLookup = lookup, this._grid.render(), this._isSelectAllChecked = (selectedRows?.length ?? 0) + disabledCount >= this._grid.getDataLength(), (!this._isUsingDataView || !this._options.applySelectOnAllPages) && (!this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow)) {
      let selectAllElm = this._headerRowNode?.querySelector(`#header-filter-selector${this._selectAll_UID}`);
      selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
    }
    if (removeList.length > 0) {
      for (i = 0; i < removeList.length; i++) {
        let remIdx = selectedRows.indexOf(removeList[i]);
        selectedRows.splice(remIdx, 1);
      }
      this._grid.setSelectedRows(selectedRows, "click.cleanup");
    }
  }
  handleDataViewSelectedIdsChanged() {
    let selectedIds = this._dataView.getAllSelectedFilteredIds(), filteredItems = this._dataView.getFilteredItems(), disabledCount = 0;
    if (typeof this._selectableOverride == "function" && selectedIds.length > 0)
      for (let k = 0; k < this._dataView.getItemCount(); k++) {
        let dataItem = this._dataView.getItemByIdx(k), idProperty = this._dataView.getIdPropertyName(), dataItemId = dataItem[idProperty];
        filteredItems.findIndex(function(item) {
          return item[idProperty] === dataItemId;
        }) >= 0 && !this.checkSelectableOverride(k, dataItem, this._grid) && disabledCount++;
      }
    if (this._isSelectAllChecked = (selectedIds && selectedIds.length) + disabledCount >= filteredItems.length, !this._options.hideInColumnTitleRow && !this._options.hideSelectAllCheckbox && this.renderSelectAllCheckbox(this._isSelectAllChecked), !this._options.hideInFilterHeaderRow) {
      let selectAllElm = this._headerRowNode?.querySelector(`#header-filter-selector${this._selectAll_UID}`);
      selectAllElm && (selectAllElm.checked = this._isSelectAllChecked);
    }
  }
  handleKeyDown(e, args) {
    e.which === 32 && this._grid.getColumns()[args.cell].id === this._options.columnId && ((!this._grid.getEditorLock().isActive() || this._grid.getEditorLock().commitCurrentEdit()) && this.toggleRowSelection(args.row), e.preventDefault(), e.stopImmediatePropagation());
  }
  handleClick(e, args) {
    if (this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.type === "checkbox") {
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      this.toggleRowSelection(args.row), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  toggleRowSelection(row) {
    let dataContext = this._grid.getDataItem(row);
    if (this.checkSelectableOverride(row, dataContext, this._grid)) {
      if (this._selectedRowsLookup[row]) {
        let newSelectedRows = this._grid.getSelectedRows().filter((n) => n !== row);
        this._grid.setSelectedRows(newSelectedRows, "click.toggle");
      } else
        this._grid.setSelectedRows(this._grid.getSelectedRows().concat(row), "click.toggle");
      this._grid.setActiveCell(row, this.getCheckboxColumnCellIndex());
    }
  }
  selectRows(rowArray) {
    let addRows = [];
    for (let i = 0, l = rowArray.length; i < l; i++)
      this._selectedRowsLookup[rowArray[i]] || (addRows[addRows.length] = rowArray[i]);
    this._grid.setSelectedRows(this._grid.getSelectedRows().concat(addRows), "SlickCheckboxSelectColumn.selectRows");
  }
  deSelectRows(rowArray) {
    let removeRows = [];
    for (let i = 0, l = rowArray.length; i < l; i++)
      this._selectedRowsLookup[rowArray[i]] && (removeRows[removeRows.length] = rowArray[i]);
    this._grid.setSelectedRows(this._grid.getSelectedRows().filter((n) => removeRows.indexOf(n) < 0), "SlickCheckboxSelectColumn.deSelectRows");
  }
  handleHeaderClick(e, args) {
    if (args.column.id === this._options.columnId && e.target.type === "checkbox") {
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      let isAllSelected = e.target.checked, caller = isAllSelected ? "click.selectAll" : "click.unselectAll", rows = [];
      if (isAllSelected) {
        for (let i = 0; i < this._grid.getDataLength(); i++) {
          let rowItem = this._grid.getDataItem(i);
          !rowItem.__group && !rowItem.__groupTotals && this.checkSelectableOverride(i, rowItem, this._grid) && rows.push(i);
        }
        isAllSelected = !0;
      }
      if (this._isUsingDataView && this._dataView && this._options.applySelectOnAllPages) {
        let ids = [], filteredItems = this._dataView.getFilteredItems();
        for (let j = 0; j < filteredItems.length; j++) {
          let dataviewRowItem = filteredItems[j];
          this.checkSelectableOverride(j, dataviewRowItem, this._grid) && ids.push(dataviewRowItem[this._dataView.getIdPropertyName()]);
        }
        this._dataView.setSelectedIds(ids, { isRowBeingAdded: isAllSelected });
      }
      this._grid.setSelectedRows(rows, caller), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  getCheckboxColumnCellIndex() {
    if (this._checkboxColumnCellIndex === null) {
      this._checkboxColumnCellIndex = 0;
      let colArr = this._grid.getColumns();
      for (let i = 0; i < colArr.length; i++)
        colArr[i].id === this._options.columnId && (this._checkboxColumnCellIndex = i);
    }
    return this._checkboxColumnCellIndex;
  }
  getColumnDefinition() {
    return {
      id: this._options.columnId,
      name: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`,
      toolTip: this._options.hideSelectAllCheckbox || this._options.hideInColumnTitleRow ? "" : this._options.toolTip,
      field: "sel",
      width: this._options.width,
      resizable: !1,
      sortable: !1,
      cssClass: this._options.cssClass,
      hideSelectAllCheckbox: this._options.hideSelectAllCheckbox,
      formatter: this.checkboxSelectionFormatter.bind(this),
      // exclude from all menus, defaults to true unless the option is provided differently by the user
      excludeFromColumnPicker: this._options.excludeFromColumnPicker ?? !0,
      excludeFromGridMenu: this._options.excludeFromGridMenu ?? !0,
      excludeFromHeaderMenu: this._options.excludeFromHeaderMenu ?? !0
    };
  }
  addCheckboxToFilterHeaderRow(grid) {
    this._handler.subscribe(grid.onHeaderRowCellRendered, (_e, args) => {
      if (args.column.field === "sel") {
        Utils12.emptyElement(args.node);
        let spanElm = document.createElement("span");
        spanElm.id = "filter-checkbox-selectall-container";
        let inputElm = document.createElement("input");
        inputElm.type = "checkbox", inputElm.id = `header-filter-selector${this._selectAll_UID}`;
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `header-filter-selector${this._selectAll_UID}`, spanElm.appendChild(inputElm), spanElm.appendChild(labelElm), args.node.appendChild(spanElm), this._headerRowNode = args.node, this._bindingEventService.bind(spanElm, "click", (e) => this.handleHeaderClick(e, args));
      }
    });
  }
  createUID() {
    return Math.round(1e7 * Math.random());
  }
  checkboxSelectionFormatter(row, _cell, _val, _columnDef, dataContext, grid) {
    let UID = this.createUID() + row;
    return dataContext && this.checkSelectableOverride(row, dataContext, grid) ? this._selectedRowsLookup[row] ? `<input id="selector${UID}" type="checkbox" checked="checked"><label for="selector${UID}"></label>` : `<input id="selector${UID}" type="checkbox"><label for="selector${UID}"></label>` : null;
  }
  checkSelectableOverride(row, dataContext, grid) {
    return typeof this._selectableOverride == "function" ? this._selectableOverride(row, dataContext, grid) : !0;
  }
  renderSelectAllCheckbox(isSelectAllChecked) {
    isSelectAllChecked ? this._grid.updateColumnHeader(this._options.columnId || "", `<input id="header-selector${this._selectAll_UID}" type="checkbox" checked="checked"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip) : this._grid.updateColumnHeader(this._options.columnId || "", `<input id="header-selector${this._selectAll_UID}" type="checkbox"><label for="header-selector${this._selectAll_UID}"></label>`, this._options.toolTip);
  }
  /**
   * Method that user can pass to override the default behavior or making every row a selectable row.
   * In order word, user can choose which rows to be selectable or not by providing his own logic.
   * @param overrideFn: override function callback
   */
  selectableOverride(overrideFn) {
    this._selectableOverride = overrideFn;
  }
  // Utils.extend(this, {
  //     "init": init,
  //     "destroy": destroy,
  //     "deSelectRows": deSelectRows,
  //     "selectRows": selectRows,
  //     "getColumnDefinition": getColumnDefinition,
  //     "getOptions": getOptions,
  //     "selectableOverride": selectableOverride,
  //     "setOptions": setOptions,
  //   });
};

// src/plugins/slick.contextmenu.ts
var BindingEventService8 = BindingEventService, SlickEvent10 = SlickEvent, SlickEventData5 = SlickEventData, EventHandler3 = SlickEventHandler, Utils13 = Utils, SlickContextMenu = class {
  constructor(optionProperties) {
    // --
    // public API
    __publicField(this, "pluginName", "ContextMenu");
    __publicField(this, "onAfterMenuShow", new SlickEvent10());
    __publicField(this, "onBeforeMenuShow", new SlickEvent10());
    __publicField(this, "onBeforeMenuClose", new SlickEvent10());
    __publicField(this, "onCommand", new SlickEvent10());
    __publicField(this, "onOptionSelected", new SlickEvent10());
    // --
    // protected props
    __publicField(this, "_bindingEventService", new BindingEventService8());
    __publicField(this, "_contextMenuProperties");
    __publicField(this, "_currentCell", -1);
    __publicField(this, "_currentRow", -1);
    __publicField(this, "_grid");
    __publicField(this, "_gridOptions");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_handler", new EventHandler3());
    __publicField(this, "_commandTitleElm");
    __publicField(this, "_optionTitleElm");
    __publicField(this, "_lastMenuTypeClicked", "");
    __publicField(this, "_menuElm");
    __publicField(this, "_subMenuParentId", "");
    __publicField(this, "_defaults", {
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
      commandShownOverColumnIds: [],
      subMenuOpenByEvent: "mouseover"
    });
    this._contextMenuProperties = Utils13.extend({}, this._defaults, optionProperties);
  }
  init(grid) {
    this._grid = grid, this._gridOptions = grid.getOptions(), this._gridUid = grid?.getUID() || "", this._handler.subscribe(this._grid.onContextMenu, this.handleOnContextMenu.bind(this)), this._contextMenuProperties.hideMenuOnScroll && this._handler.subscribe(this._grid.onScroll, this.destroyMenu.bind(this));
  }
  setOptions(newOptions) {
    this._contextMenuProperties = Utils13.extend({}, this._contextMenuProperties, newOptions), newOptions.commandShownOverColumnIds && (this._contextMenuProperties.commandShownOverColumnIds = newOptions.commandShownOverColumnIds), newOptions.optionShownOverColumnIds && (this._contextMenuProperties.optionShownOverColumnIds = newOptions.optionShownOverColumnIds);
  }
  destroy() {
    this.onAfterMenuShow.unsubscribe(), this.onBeforeMenuShow.unsubscribe(), this.onBeforeMenuClose.unsubscribe(), this.onCommand.unsubscribe(), this.onOptionSelected.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), this._menuElm?.remove(), this._commandTitleElm = null, this._optionTitleElm = null, this._menuElm = null;
  }
  createParentMenu(evt) {
    let e = evt instanceof SlickEventData5 ? evt.getNativeEvent() : evt, targetEvent = e.touches?.[0] ?? e, cell = this._grid.getCellFromEvent(e);
    this._currentCell = cell?.cell ?? 0, this._currentRow = cell?.row ?? 0;
    let columnDef = this._grid.getColumns()[this._currentCell], isColumnOptionAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.optionShownOverColumnIds ?? [], columnDef.id), isColumnCommandAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.commandShownOverColumnIds ?? [], columnDef.id), commandItems = this._contextMenuProperties.commandItems || [], optionItems = this._contextMenuProperties.optionItems || [];
    if (!(!columnDef || !isColumnCommandAllowed && !isColumnOptionAllowed || !commandItems.length && !optionItems.length) && (this.destroyMenu(e), this.onBeforeMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() !== !1 && (this._menuElm = this.createMenu(commandItems, optionItems), this._menuElm.style.top = `${targetEvent.pageY}px`, this._menuElm.style.left = `${targetEvent.pageX}px`, this._menuElm.style.display = "block", document.body.appendChild(this._menuElm), this.onAfterMenuShow.notify({
      cell: this._currentCell,
      row: this._currentRow,
      grid: this._grid
    }, e, this).getReturnValue() !== !1)))
      return this._menuElm;
  }
  createMenu(commandItems, optionItems, level = 0, item) {
    let columnDef = this._grid.getColumns()[this._currentCell], dataContext = this._grid.getDataItem(this._currentRow), isColumnOptionAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.optionShownOverColumnIds ?? [], columnDef.id), isColumnCommandAllowed = this.checkIsColumnAllowed(this._contextMenuProperties.commandShownOverColumnIds ?? [], columnDef.id), maxHeight = isNaN(this._contextMenuProperties.maxHeight) ? this._contextMenuProperties.maxHeight : `${this._contextMenuProperties.maxHeight ?? 0}px`, width = isNaN(this._contextMenuProperties.width) ? this._contextMenuProperties.width : `${this._contextMenuProperties.maxWidth ?? 0}px`, subMenuCommand = item?.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
    subMenuId && (this._subMenuParentId = subMenuId), level > 1 && (subMenuId = this._subMenuParentId);
    let menuClasses = `slick-context-menu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-context-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId)
        return bodyMenuElm;
      this.destroySubMenus();
    }
    let menuElm = document.createElement("div");
    menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.ariaLabel = level > 1 ? "SubMenu" : "Context Menu", menuElm.role = "menu", width && (menuElm.style.width = width), maxHeight && (menuElm.style.maxHeight = maxHeight), menuElm.style.display = "none";
    let closeButtonElm = null;
    if (level === 0) {
      closeButtonElm = document.createElement("button"), closeButtonElm.type = "button", closeButtonElm.className = "close", closeButtonElm.dataset.dismiss = "slick-context-menu", closeButtonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.textContent = "\xD7", closeButtonElm.appendChild(spanCloseElm);
    }
    if (!this._contextMenuProperties.hideOptionSection && isColumnOptionAllowed && optionItems.length > 0) {
      let optionMenuElm = document.createElement("div");
      optionMenuElm.className = "slick-context-menu-option-list", optionMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, optionMenuElm), closeButtonElm && !this._contextMenuProperties.hideCloseButton && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(optionMenuElm), this.populateCommandOrOptionItems(
        "option",
        this._contextMenuProperties,
        optionMenuElm,
        optionItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }
    if (!this._contextMenuProperties.hideCommandSection && isColumnCommandAllowed && commandItems.length > 0) {
      let commandMenuElm = document.createElement("div");
      commandMenuElm.className = "slick-context-menu-command-list", commandMenuElm.role = "menu", item && level > 0 && this.addSubMenuTitleWhenExists(item, commandMenuElm), closeButtonElm && !this._contextMenuProperties.hideCloseButton && (!isColumnOptionAllowed || optionItems.length === 0 || this._contextMenuProperties.hideOptionSection) && (this._bindingEventService.bind(closeButtonElm, "click", this.handleCloseButtonClicked.bind(this)), menuElm.appendChild(closeButtonElm)), menuElm.appendChild(commandMenuElm), this.populateCommandOrOptionItems(
        "command",
        this._contextMenuProperties,
        commandMenuElm,
        commandItems,
        { cell: this._currentCell, row: this._currentRow, column: columnDef, dataContext, grid: this._grid, level }
      );
    }
    return level++, menuElm;
  }
  addSubMenuTitleWhenExists(item, commandOrOptionMenu) {
    if (item !== "divider" && item?.subMenuTitle) {
      let subMenuTitleElm = document.createElement("div");
      subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
      let subMenuTitleClass = item.subMenuTitleCssClass;
      subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandOrOptionMenu.appendChild(subMenuTitleElm);
    }
  }
  handleCloseButtonClicked(e) {
    e.defaultPrevented || this.destroyMenu(e);
  }
  destroyMenu(e, args) {
    if (this._menuElm = this._menuElm || document.querySelector(`.slick-context-menu${this.getGridUidSelector()}`), this._menuElm?.remove) {
      if (this.onBeforeMenuClose.notify({
        cell: args?.cell ?? 0,
        row: args?.row ?? 0,
        grid: this._grid
      }, e, this).getReturnValue() === !1)
        return;
      this._menuElm.remove(), this._menuElm = null;
    }
    this.destroySubMenus();
  }
  /** Destroy all parent menus and any sub-menus */
  destroyAllMenus() {
    this.destroySubMenus(), this._bindingEventService.unbindAll("parent-menu"), document.querySelectorAll(`.slick-context-menu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-context-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  checkIsColumnAllowed(columnIds, columnId) {
    let isAllowedColumn = !1;
    if (columnIds?.length > 0)
      for (let o = 0, ln = columnIds.length; o < ln; o++)
        columnIds[o] === columnId && (isAllowedColumn = !0);
    else
      isAllowedColumn = !0;
    return isAllowedColumn;
  }
  getGridUidSelector() {
    let gridUid = this._grid.getUID() || "";
    return gridUid ? `.${gridUid}` : "";
  }
  handleOnContextMenu(evt, args) {
    this.destroyAllMenus();
    let e = evt instanceof SlickEventData5 ? evt.getNativeEvent() : evt;
    e.preventDefault();
    let cell = this._grid.getCellFromEvent(e);
    if (cell) {
      let columnDef = this._grid.getColumns()[cell.cell], dataContext = this._grid.getDataItem(cell.row);
      if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.column = columnDef, args.dataContext = dataContext, args.grid = this._grid, !this.runOverrideFunctionWhenExists(this._contextMenuProperties.menuUsabilityOverride, args))
        return;
      this._menuElm = this.createParentMenu(e), this._menuElm && (this.repositionMenu(e, this._menuElm), this._menuElm.style.display = "block"), this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this));
    }
  }
  /** When users click outside the Cell Menu, we will typically close the Cell Menu (and any sub-menus) */
  handleBodyMouseDown(e) {
    let isMenuClicked = !1;
    this._menuElm?.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-context-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
      subElm.contains(e.target) && (isMenuClicked = !0);
    }), this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented && this.destroyMenu(e, { cell: this._currentCell, row: this._currentRow });
  }
  /** Construct the Command Items section. */
  populateCommandOrOptionItems(itemType, contextMenu, commandOrOptionMenuElm, commandOrOptionItems, args) {
    if (!args || !commandOrOptionItems || !contextMenu)
      return;
    let level = args?.level || 0, isSubMenu = level > 0;
    contextMenu?.[`${itemType}Title`] && !isSubMenu && (this[`_${itemType}TitleElm`] = document.createElement("div"), this[`_${itemType}TitleElm`].className = "slick-menu-title", this[`_${itemType}TitleElm`].textContent = contextMenu[`${itemType}Title`], commandOrOptionMenuElm.appendChild(this[`_${itemType}TitleElm`]));
    for (let i = 0, ln = commandOrOptionItems.length; i < ln; i++) {
      let addClickListener = !0, item = commandOrOptionItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(item.itemUsabilityOverride, args);
      if (!isItemVisible)
        continue;
      Object.prototype.hasOwnProperty.call(item, "itemUsabilityOverride") && (item.disabled = !isItemUsable);
      let liElm = document.createElement("div");
      liElm.className = "slick-context-menu-item", liElm.role = "menuitem", (item.divider || item === "divider") && (liElm.classList.add("slick-context-menu-item-divider"), addClickListener = !1), (item.disabled || !isItemUsable) && liElm.classList.add("slick-context-menu-item-disabled"), item.hidden && liElm.classList.add("slick-context-menu-item-hidden"), item.cssClass && liElm.classList.add(...item.cssClass.split(" ")), item.tooltip && (liElm.title = item.tooltip || "");
      let iconElm = document.createElement("div");
      iconElm.className = "slick-context-menu-icon", liElm.appendChild(iconElm), item.iconCssClass && iconElm.classList.add(...item.iconCssClass.split(" ")), item.iconImage && (iconElm.style.backgroundImage = `url(${item.iconImage})`);
      let textElm = document.createElement("span");
      if (textElm.className = "slick-context-menu-content", textElm.textContent = item.title || "", liElm.appendChild(textElm), item.textCssClass && textElm.classList.add(...item.textCssClass.split(" ")), commandOrOptionMenuElm.appendChild(liElm), addClickListener) {
        let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
        this._bindingEventService.bind(liElm, "click", this.handleMenuItemClick.bind(this, item, itemType, level), void 0, eventGroup);
      }
      if (this._contextMenuProperties.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(liElm, "mouseover", (e) => {
        item.commandItems || item.optionItems ? (this.repositionSubMenu(item, itemType, level, e), this._lastMenuTypeClicked = itemType) : isSubMenu || this.destroySubMenus();
      }), item.commandItems || item.optionItems) {
        let chevronElm = document.createElement("span");
        chevronElm.className = "sub-item-chevron", this._contextMenuProperties.subItemChevronClass ? chevronElm.classList.add(...this._contextMenuProperties.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", liElm.classList.add("slick-submenu-item"), liElm.appendChild(chevronElm);
        continue;
      }
    }
  }
  handleMenuItemClick(item, type, level = 0, e) {
    if (item?.[type] !== void 0 && item !== "divider" && !item.disabled && !item.divider && this._currentCell !== void 0 && this._currentRow !== void 0) {
      if (type === "option" && !this._grid.getEditorLock().commitCurrentEdit())
        return;
      let optionOrCommand = item[type] !== void 0 ? item[type] : "", row = this._currentRow, cell = this._currentCell, columnDef = this._grid.getColumns()[cell], dataContext = this._grid.getDataItem(row), cellValue;
      if (Object.prototype.hasOwnProperty.call(dataContext, columnDef?.field) && (cellValue = dataContext[columnDef.field]), optionOrCommand !== void 0 && !item[`${type}Items`]) {
        let callbackArgs = {
          cell,
          row,
          grid: this._grid,
          [type]: optionOrCommand,
          item,
          column: columnDef,
          dataContext,
          value: cellValue
        };
        this[type === "command" ? "onCommand" : "onOptionSelected"].notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.destroyMenu(e, { cell, row });
      } else
        item.commandItems || item.optionItems ? this.repositionSubMenu(item, type, level, e) : this.destroySubMenus();
      this._lastMenuTypeClicked = type;
    }
  }
  repositionSubMenu(item, type, level, e) {
    (e.target.classList.contains("slick-cell") || this._lastMenuTypeClicked !== type) && this.destroySubMenus();
    let subMenuElm = this.createMenu(item?.commandItems || [], item?.optionItems || [], level + 1, item);
    subMenuElm.style.display = "block", document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
  }
  /**
   * Reposition the menu drop (up/down) and the side (left/right)
   * @param {*} event
   */
  repositionMenu(e, menuElm) {
    let isSubMenu = menuElm.classList.contains("slick-submenu"), targetEvent = e.touches?.[0] ?? e, parentElm = isSubMenu ? e.target.closest(".slick-context-menu-item") : e.target.closest(".slick-cell");
    if (menuElm && parentElm) {
      let parentOffset = Utils13.offset(parentElm), menuOffsetLeft = isSubMenu && parentElm ? parentOffset?.left ?? 0 : targetEvent.pageX, menuOffsetTop = parentElm ? parentOffset?.top ?? 0 : targetEvent.pageY, menuHeight = menuElm?.offsetHeight || 0, menuWidth = Number(menuElm?.offsetWidth || this._contextMenuProperties.width || 0), rowHeight = this._gridOptions.rowHeight, dropOffset = Number(this._contextMenuProperties.autoAdjustDropOffset || 0), sideOffset = Number(this._contextMenuProperties.autoAlignSideOffset || 0);
      if (this._contextMenuProperties.autoAdjustDrop) {
        let spaceBottom = Utils13.calculateAvailableSpace(parentElm).bottom, spaceTop = Utils13.calculateAvailableSpace(parentElm).top, spaceBottomRemaining = spaceBottom + dropOffset - rowHeight, spaceTopRemaining = spaceTop - dropOffset + rowHeight;
        (spaceBottomRemaining < menuHeight && spaceTopRemaining > spaceBottomRemaining ? "top" : "bottom") === "top" ? (menuElm.classList.remove("dropdown"), menuElm.classList.add("dropup"), isSubMenu ? menuOffsetTop -= menuHeight - dropOffset - parentElm.clientHeight : menuOffsetTop -= menuHeight - dropOffset) : (menuElm.classList.remove("dropup"), menuElm.classList.add("dropdown"), isSubMenu ? menuOffsetTop += dropOffset : menuOffsetTop += rowHeight + dropOffset);
      }
      if (this._contextMenuProperties.autoAlignSide) {
        let gridPos = this._grid.getGridPosition(), subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
        isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
        let browserWidth = document.documentElement.clientWidth;
        (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), menuOffsetLeft -= menuWidth - sideOffset) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu ? menuOffsetLeft += sideOffset + parentElm.offsetWidth : menuOffsetLeft += sideOffset);
      }
      menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`;
    }
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
};

// src/plugins/slick.crossgridrowmovemanager.ts
var SlickEvent11 = SlickEvent, SlickEventHandler4 = SlickEventHandler, Utils14 = Utils, SlickCrossGridRowMoveManager = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "CrossGridRowMoveManager");
    __publicField(this, "onBeforeMoveRows", new SlickEvent11());
    __publicField(this, "onMoveRows", new SlickEvent11());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_canvas");
    __publicField(this, "_dragging", !1);
    __publicField(this, "_toGrid");
    __publicField(this, "_toCanvas");
    __publicField(this, "_usabilityOverride");
    __publicField(this, "_eventHandler");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      columnId: "_move",
      cssClass: void 0,
      cancelEditOnDrag: !1,
      disableRowSelection: !1,
      hideRowMoveShadow: !0,
      rowMoveShadowMarginTop: 0,
      rowMoveShadowMarginLeft: 0,
      rowMoveShadowOpacity: 0.95,
      rowMoveShadowScale: 0.75,
      singleRowMove: !1,
      toGrid: void 0,
      width: 40
    });
    this._options = Utils14.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler4();
  }
  init(grid) {
    this._grid = grid, this._canvas = this._grid.getCanvasNode(), this._toGrid = this._options.toGrid, this._toCanvas = this._toGrid.getCanvasNode(), typeof this._options?.usabilityOverride == "function" && this.usabilityOverride(this._options.usabilityOverride), this._eventHandler.subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
  }
  destroy() {
    this._eventHandler.unsubscribeAll();
  }
  setOptions(newOptions) {
    this._options = Utils14.extend({}, this._options, newOptions);
  }
  handleDragInit(e) {
    e.stopImmediatePropagation();
  }
  handleDragStart(e, dd) {
    let cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 }, currentRow = cell?.row ?? 0, dataContext = this._grid.getDataItem(currentRow);
    if (!this.checkUsabilityOverride(currentRow, dataContext, this._grid))
      return;
    if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive() && this._grid.getEditorLock().cancelCurrentEdit(), this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell))
      return !1;
    if (this._dragging = !0, e.stopImmediatePropagation(), !this._options.hideRowMoveShadow) {
      let slickRowElm = this._grid.getCellNode(cell.row, cell.cell)?.closest(".slick-row");
      slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${this._options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${this._options.rowMoveShadowScale || 0.75})`, this._canvas.appendChild(dd.clonedSlickRow));
    }
    let selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
    (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], this._options.disableRowSelection || this._grid.setSelectedRows(selectedRows)), selectedRows.sort((a, b) => a - b);
    let rowHeight = this._grid.getOptions().rowHeight;
    dd.fromGrid = this._grid, dd.toGrid = this._toGrid, dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${this._toCanvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, this._toCanvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${this._toCanvas.clientWidth}px`, dd.guide.style.top = "-1000px", this._toCanvas.appendChild(dd.guide), dd.insertBefore = -1;
  }
  handleDrag(evt, dd) {
    if (!this._dragging)
      return;
    evt.stopImmediatePropagation();
    let e = evt.getNativeEvent(), top = (e.touches?.[0] ?? e).pageY - (Utils14.offset(this._toCanvas)?.top ?? 0);
    dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
    let insertBefore = Math.max(0, Math.min(Math.round(top / this._toGrid.getOptions().rowHeight), this._toGrid.getDataLength()));
    if (insertBefore !== dd.insertBefore) {
      let eventData = {
        fromGrid: this._grid,
        toGrid: this._toGrid,
        rows: dd.selectedRows,
        insertBefore
      };
      if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, this._usabilityOverride && dd.canMove) {
        let insertBeforeDataContext = this._toGrid.getDataItem(insertBefore);
        dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._toGrid);
      }
      dd.canMove ? dd.guide.style.top = `${insertBefore * (this._toGrid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
    }
  }
  handleDragEnd(e, dd) {
    if (this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), dd.guide?.remove(), dd.selectionProxy?.remove(), dd.clonedSlickRow?.remove(), dd.canMove)) {
      let eventData = {
        fromGrid: this._grid,
        toGrid: this._toGrid,
        rows: dd.selectedRows,
        insertBefore: dd.insertBefore
      };
      this.onMoveRows.notify(eventData);
    }
  }
  getColumnDefinition() {
    return {
      id: String(this._options?.columnId ?? this._defaults.columnId),
      name: "",
      field: "move",
      behavior: "selectAndMove",
      excludeFromColumnPicker: !0,
      excludeFromGridMenu: !0,
      excludeFromHeaderMenu: !0,
      selectable: !1,
      resizable: !1,
      width: this._options.width || 40,
      formatter: this.moveIconFormatter.bind(this)
    };
  }
  moveIconFormatter(row, _cell, _val, _column, dataContext, grid) {
    return this.checkUsabilityOverride(row, dataContext, grid) ? { addClasses: `cell-reorder dnd ${this._options.cssClass || ""}`.trim(), text: "" } : "";
  }
  checkUsabilityOverride(row, dataContext, grid) {
    return typeof this._usabilityOverride == "function" ? this._usabilityOverride(row, dataContext, grid) : !0;
  }
  /**
   * Method that user can pass to override the default behavior or making every row moveable.
   * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
   * @param overrideFn: override function callback
   */
  usabilityOverride(overrideFn) {
    this._usabilityOverride = overrideFn;
  }
  isHandlerColumn(columnIndex) {
    return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || "");
  }
};

// src/plugins/slick.customtooltip.ts
var SlickEventHandler5 = SlickEventHandler, Utils15 = Utils, SlickCustomTooltip = class {
  constructor(tooltipOptions) {
    this.tooltipOptions = tooltipOptions;
    // --
    // public API
    __publicField(this, "pluginName", "CustomTooltip");
    // --
    // protected props
    __publicField(this, "_cancellablePromise");
    __publicField(this, "_cellNodeElm");
    __publicField(this, "_dataView");
    __publicField(this, "_grid");
    __publicField(this, "_gridOptions");
    __publicField(this, "_tooltipElm");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      className: "slick-custom-tooltip",
      offsetLeft: 0,
      offsetRight: 0,
      offsetTopBottom: 4,
      hideArrow: !1,
      tooltipTextMaxLength: 700,
      regularTooltipWhiteSpace: "pre-line",
      whiteSpace: "normal"
    });
    __publicField(this, "_eventHandler", new SlickEventHandler5());
    __publicField(this, "_cellTooltipOptions");
  }
  /**
   * Initialize plugin.
   */
  init(grid) {
    this._grid = grid;
    let _data = grid?.getData() || [];
    this._dataView = Array.isArray(_data) ? null : _data, this._gridOptions = grid.getOptions() || {}, this._options = Utils15.extend(!0, {}, this._defaults, this._gridOptions.customTooltip, this.tooltipOptions), this._eventHandler.subscribe(grid.onMouseEnter, this.handleOnMouseEnter.bind(this)).subscribe(grid.onHeaderMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, "slick-header-column")).subscribe(grid.onHeaderRowMouseEnter, (e, args) => this.handleOnHeaderMouseEnterByType(e, args, "slick-headerrow-column")).subscribe(grid.onMouseLeave, () => this.hideTooltip()).subscribe(grid.onHeaderMouseLeave, () => this.hideTooltip()).subscribe(grid.onHeaderRowMouseLeave, () => this.hideTooltip());
  }
  /**
   * Destroy plugin.
   */
  destroy() {
    this.hideTooltip(), this._eventHandler.unsubscribeAll();
  }
  /** depending on the selector type, execute the necessary handler code */
  handleOnHeaderMouseEnterByType(e, args, selector) {
    this.hideTooltip();
    let cell = {
      row: -1,
      // negative row to avoid pulling any dataContext while rendering
      cell: this._grid.getColumns().findIndex((col) => args?.column?.id === col.id)
    }, columnDef = args.column, item = {}, isHeaderRowType = selector === "slick-headerrow-column";
    if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = this._grid, args.type = isHeaderRowType ? "header-row" : "header", this._cellTooltipOptions = Utils15.extend(!0, {}, this._options, columnDef.customTooltip), !(columnDef?.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args)) && columnDef && e.target) {
      this._cellNodeElm = e.target.closest(`.${selector}`);
      let formatter = isHeaderRowType ? this._cellTooltipOptions.headerRowFormatter : this._cellTooltipOptions.headerFormatter;
      if (this._cellTooltipOptions.useRegularTooltip || !formatter) {
        let formatterOrText = isHeaderRowType ? this._cellTooltipOptions.useRegularTooltip ? null : formatter : columnDef.name;
        this.renderRegularTooltip(formatterOrText, cell, null, columnDef, item);
      } else
        this._cellNodeElm && typeof formatter == "function" && this.renderTooltipFormatter(formatter, cell, null, columnDef, item);
    }
  }
  /**
   * Handle mouse entering grid cell to show tooltip.
   * @param {jQuery.Event} e - The event
   */
  handleOnMouseEnter(e, args) {
    if (this.hideTooltip(), this._grid && e) {
      let targetClassName = event?.target?.closest(".slick-cell")?.className, cell = targetClassName && /l\d+/.exec(targetClassName || "") ? this._grid.getCellFromEvent(e) : null;
      if (cell) {
        let item = this._dataView ? this._dataView.getItem(cell.row) : this._grid.getDataItem(cell.row), columnDef = this._grid.getColumns()[cell.cell];
        if (this._cellNodeElm = this._grid.getCellNode(cell.row, cell.cell), this._cellTooltipOptions = Utils15.extend(!0, {}, this._options, columnDef.customTooltip), item && columnDef) {
          if (args = args || {}, args.cell = cell.cell, args.row = cell.row, args.columnDef = columnDef, args.dataContext = item, args.grid = this._grid, args.type = "cell", columnDef?.disableTooltip || !this.runOverrideFunctionWhenExists(this._cellTooltipOptions.usabilityOverride, args))
            return;
          let value = item.hasOwnProperty(columnDef.field) ? item[columnDef.field] : null;
          if (this._cellTooltipOptions.useRegularTooltip || !this._cellTooltipOptions.formatter)
            this.renderRegularTooltip(columnDef.formatter, cell, value, columnDef, item);
          else if (typeof this._cellTooltipOptions.formatter == "function" && this.renderTooltipFormatter(this._cellTooltipOptions.formatter, cell, value, columnDef, item), typeof this._cellTooltipOptions.asyncProcess == "function") {
            let asyncProcess = this._cellTooltipOptions.asyncProcess(cell.row, cell.cell, value, columnDef, item, this._grid);
            if (!this._cellTooltipOptions.asyncPostFormatter)
              throw new Error('[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter');
            asyncProcess instanceof Promise && (this._cancellablePromise = this.cancellablePromise(asyncProcess), this._cancellablePromise.promise.then((asyncResult) => {
              this.asyncProcessCallback(asyncResult, cell, value, columnDef, item);
            }).catch(function(error) {
              if (!error.isPromiseCancelled)
                throw error;
            }));
          }
        }
      }
    }
  }
  findFirstElementAttribute(inputElm, attributes) {
    if (inputElm) {
      let outputAttrData = null;
      return attributes.forEach((attribute) => {
        let attrData = inputElm.getAttribute(attribute);
        attrData && (outputAttrData = attrData);
      }), outputAttrData;
    }
    return null;
  }
  /**
   * Parse the cell formatter and assume it might be html
   * then create a temporary html element to easily retrieve the first [title=""] attribute text content
   * also clear the "title" attribute from the grid div text content so that it won't show also as a 2nd browser tooltip
   */
  renderRegularTooltip(formatterOrText, cell, value, columnDef, item) {
    let tmpDiv = document.createElement("div");
    this._grid.applyHtmlCode(tmpDiv, this.parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item));
    let tooltipText = columnDef.toolTip || "", tmpTitleElm;
    tooltipText || (this._cellNodeElm && this._cellNodeElm.clientWidth < this._cellNodeElm.scrollWidth && !this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? (tooltipText = (this._cellNodeElm.textContent || "").trim() || "", this._cellTooltipOptions.tooltipTextMaxLength && tooltipText.length > this._cellTooltipOptions.tooltipTextMaxLength && (tooltipText = tooltipText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..."), tmpTitleElm = this._cellNodeElm) : (this._cellTooltipOptions.useRegularTooltipFromFormatterOnly ? tmpTitleElm = tmpDiv.querySelector("[title], [data-slick-tooltip]") : (tmpTitleElm = this.findFirstElementAttribute(this._cellNodeElm, ["title", "data-slick-tooltip"]) ? this._cellNodeElm : tmpDiv.querySelector("[title], [data-slick-tooltip]"), (!tmpTitleElm || !this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"])) && this._cellNodeElm && (tmpTitleElm = this._cellNodeElm.querySelector("[title], [data-slick-tooltip]"))), (!tooltipText || typeof formatterOrText == "function" && this._cellTooltipOptions.useRegularTooltipFromFormatterOnly) && (tooltipText = this.findFirstElementAttribute(tmpTitleElm, ["title", "data-slick-tooltip"]) || ""))), tooltipText !== "" && this.renderTooltipFormatter(formatterOrText, cell, value, columnDef, item, tooltipText), this.swapAndClearTitleAttribute(tmpTitleElm, tooltipText);
  }
  /**
  * swap and copy the "title" attribute into a new custom attribute then clear the "title" attribute
  * from the grid div text content so that it won't show also as a 2nd browser tooltip
  */
  swapAndClearTitleAttribute(inputTitleElm, tooltipText) {
    let titleElm = inputTitleElm || this._cellNodeElm && (this._cellNodeElm.hasAttribute("title") && this._cellNodeElm.getAttribute("title") ? this._cellNodeElm : this._cellNodeElm.querySelector("[title]"));
    titleElm && (titleElm.setAttribute("data-slick-tooltip", tooltipText || ""), titleElm.hasAttribute("title") && titleElm.setAttribute("title", ""));
  }
  asyncProcessCallback(asyncResult, cell, value, columnDef, dataContext) {
    this.hideTooltip();
    let itemWithAsyncData = Utils15.extend(!0, {}, dataContext, { [this._cellTooltipOptions.asyncParamsPropName || "__params"]: asyncResult });
    this.renderTooltipFormatter(this._cellTooltipOptions.asyncPostFormatter, cell, value, columnDef, itemWithAsyncData);
  }
  cancellablePromise(inputPromise) {
    let hasCancelled = !1;
    return inputPromise instanceof Promise ? {
      promise: inputPromise.then(function(result) {
        if (hasCancelled)
          throw { isPromiseCancelled: !0 };
        return result;
      }),
      cancel: () => hasCancelled = !0
    } : inputPromise;
  }
  getHtmlElementOffset(element) {
    if (!element)
      return;
    let rect = element.getBoundingClientRect(), left = 0, top = 0, bottom = 0, right = 0;
    return rect.top !== void 0 && rect.left !== void 0 && (top = rect.top + window.pageYOffset, left = rect.left + window.pageXOffset, right = rect.right, bottom = rect.bottom), { top, left, bottom, right };
  }
  /**
   * hide (remove) tooltip from the DOM,
   * when using async process, it will also cancel any opened Promise/Observable that might still be opened/pending.
   */
  hideTooltip() {
    this._cancellablePromise?.cancel(), document.body.querySelector(`.${this._cellTooltipOptions?.className ?? this._defaults.className}.${this._grid.getUID()}`)?.remove();
  }
  /**
   * Reposition the Tooltip to be top-left position over the cell.
   * By default we use an "auto" mode which will allow to position the Tooltip to the best logical position in the window, also when we mention position, we are talking about the relative position against the grid cell.
   * We can assume that in 80% of the time the default position is top-right, the default is "auto" but we can also override it and use a specific position.
   * Most of the time positioning of the tooltip will be to the "top-right" of the cell is ok but if our column is completely on the right side then we'll want to change the position to "left" align.
   * Same goes for the top/bottom position, Most of the time positioning the tooltip to the "top" but if we are hovering a cell at the top of the grid and there's no room to display it then we might need to reposition to "bottom" instead.
   */
  reposition(cell) {
    if (this._tooltipElm) {
      this._cellNodeElm = this._cellNodeElm || this._grid.getCellNode(cell.row, cell.cell);
      let cellPosition = this.getHtmlElementOffset(this._cellNodeElm), cellContainerWidth = this._cellNodeElm.offsetWidth, calculatedTooltipHeight = this._tooltipElm.getBoundingClientRect().height, calculatedTooltipWidth = this._tooltipElm.getBoundingClientRect().width, calculatedBodyWidth = document.body.offsetWidth || window.innerWidth, newPositionTop = (cellPosition?.top || 0) - this._tooltipElm.offsetHeight - (this._cellTooltipOptions.offsetTopBottom ?? 0), newPositionLeft = (cellPosition?.left || 0) - (this._cellTooltipOptions.offsetRight ?? 0), position = this._cellTooltipOptions.position || "auto";
      position === "center" ? (newPositionLeft += cellContainerWidth / 2 - calculatedTooltipWidth / 2 + (this._cellTooltipOptions.offsetRight || 0), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-center-align")) : position === "right-align" || (position === "auto" || position !== "left-align") && newPositionLeft + calculatedTooltipWidth > calculatedBodyWidth ? (newPositionLeft -= calculatedTooltipWidth - cellContainerWidth - (this._cellTooltipOptions.offsetLeft || 0), this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-left-align"), this._tooltipElm.classList.add("arrow-right-align")) : (this._tooltipElm.classList.remove("arrow-center-align"), this._tooltipElm.classList.remove("arrow-right-align"), this._tooltipElm.classList.add("arrow-left-align")), position === "bottom" || position === "auto" && calculatedTooltipHeight > Utils15.calculateAvailableSpace(this._cellNodeElm).top ? (newPositionTop = (cellPosition?.top || 0) + (this._gridOptions.rowHeight || 0) + (this._cellTooltipOptions.offsetTopBottom || 0), this._tooltipElm.classList.remove("arrow-down"), this._tooltipElm.classList.add("arrow-up")) : (this._tooltipElm.classList.add("arrow-down"), this._tooltipElm.classList.remove("arrow-up")), this._tooltipElm.style.top = newPositionTop + "px", this._tooltipElm.style.left = newPositionLeft + "px";
    }
  }
  /**
   * Parse the Custom Formatter (when provided) or return directly the text when it is already a string.
   * We will also sanitize the text in both cases before returning it so that it can be used safely.
   */
  parseFormatterAndSanitize(formatterOrText, cell, value, columnDef, item) {
    if (typeof formatterOrText == "function") {
      let tooltipResult = formatterOrText(cell.row, cell.cell, value, columnDef, item, this._grid), formatterText = Object.prototype.toString.call(tooltipResult) !== "[object Object]" ? tooltipResult : tooltipResult.html || tooltipResult.text;
      return formatterText instanceof HTMLElement ? formatterText : this._grid.sanitizeHtmlString(formatterText);
    } else if (typeof formatterOrText == "string")
      return this._grid.sanitizeHtmlString(formatterOrText);
    return "";
  }
  renderTooltipFormatter(formatter, cell, value, columnDef, item, tooltipText, inputTitleElm) {
    this._tooltipElm = document.createElement("div"), this._tooltipElm.className = this._cellTooltipOptions.className || this._defaults.className, this._tooltipElm.classList.add(this._grid.getUID()), this._tooltipElm.classList.add("l" + cell.cell), this._tooltipElm.classList.add("r" + cell.cell);
    let outputText = tooltipText || this.parseFormatterAndSanitize(formatter, cell, value, columnDef, item) || "";
    if (outputText instanceof HTMLElement) {
      let content = outputText.textContent || "";
      this._cellTooltipOptions.tooltipTextMaxLength && content.length > this._cellTooltipOptions.tooltipTextMaxLength && (outputText.textContent = content.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "...");
    } else
      outputText = this._cellTooltipOptions.tooltipTextMaxLength && outputText.length > this._cellTooltipOptions.tooltipTextMaxLength ? outputText.substring(0, this._cellTooltipOptions.tooltipTextMaxLength - 3) + "..." : outputText;
    let finalOutputText = "";
    !tooltipText || this._cellTooltipOptions?.renderRegularTooltipAsHtml ? (outputText instanceof HTMLElement ? (this._grid.applyHtmlCode(this._tooltipElm, outputText), finalOutputText = this._grid.sanitizeHtmlString(outputText.textContent || "")) : (finalOutputText = this._grid.sanitizeHtmlString(outputText), this._tooltipElm.innerHTML = finalOutputText), this._tooltipElm.style.whiteSpace = this._cellTooltipOptions?.whiteSpace ?? this._defaults.whiteSpace) : (finalOutputText = (outputText instanceof HTMLElement ? outputText.textContent : outputText) || "", this._tooltipElm.textContent = finalOutputText, this._tooltipElm.style.whiteSpace = this._cellTooltipOptions?.regularTooltipWhiteSpace ?? this._defaults.regularTooltipWhiteSpace), this._cellTooltipOptions.maxHeight && (this._tooltipElm.style.maxHeight = this._cellTooltipOptions.maxHeight + "px"), this._cellTooltipOptions.maxWidth && (this._tooltipElm.style.maxWidth = this._cellTooltipOptions.maxWidth + "px"), finalOutputText && (document.body.appendChild(this._tooltipElm), this.reposition(cell), this._cellTooltipOptions.hideArrow || this._tooltipElm.classList.add("tooltip-arrow"), this.swapAndClearTitleAttribute(inputTitleElm, (outputText instanceof HTMLElement ? outputText.textContent : outputText) || ""));
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
  setOptions(newOptions) {
    this._options = Utils15.extend({}, this._options, newOptions);
  }
};

// src/plugins/slick.draggablegrouping.ts
var BindingEventService9 = BindingEventService, SlickEvent12 = SlickEvent, SlickEventHandler6 = SlickEventHandler, Utils16 = Utils, SlickDraggableGrouping = class {
  /**
   * @param options {Object} Options:
   *    deleteIconCssClass:  an extra CSS class to add to the delete button (default undefined), if deleteIconCssClass && deleteIconImage undefined then slick-groupby-remove-image class will be added
   *    deleteIconImage:     a url to the delete button image (default undefined)
   *    groupIconCssClass:   an extra CSS class to add to the grouping field hint  (default undefined)
   *    groupIconImage:      a url to the grouping field hint image (default undefined)
   *    dropPlaceHolderText:      option to specify set own placeholder note text
   */
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "DraggableGrouping");
    __publicField(this, "onGroupChanged", new SlickEvent12());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_gridColumns", []);
    __publicField(this, "_dataView");
    __publicField(this, "_dropzoneElm");
    __publicField(this, "_droppableInstance");
    __publicField(this, "_dropzonePlaceholder");
    __publicField(this, "_groupToggler");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      dropPlaceHolderText: "Drop a column header here to group by the column",
      hideGroupSortIcons: !1,
      hideToggleAllButton: !1,
      toggleAllButtonText: "",
      toggleAllPlaceholderText: "Toggle all Groups"
    });
    __publicField(this, "_bindingEventService", new BindingEventService9());
    __publicField(this, "_handler", new SlickEventHandler6());
    __publicField(this, "_sortableLeftInstance");
    __publicField(this, "_sortableRightInstance");
    __publicField(this, "_columnsGroupBy", []);
    this._options = Utils16.extend(!0, {}, this._defaults, options);
  }
  /**
   * Initialize plugin.
   */
  init(grid) {
    this._grid = grid, this._gridUid = this._grid.getUID(), this._gridColumns = this._grid.getColumns(), this._dataView = this._grid.getData(), this._dropzoneElm = this._grid.getPreHeaderPanel(), this._dropzoneElm.classList.add("slick-dropzone");
    let dropPlaceHolderText = this._options.dropPlaceHolderText || "Drop a column header here to group by the column";
    this._dropzonePlaceholder = document.createElement("div"), this._dropzonePlaceholder.className = "slick-placeholder", this._dropzonePlaceholder.textContent = dropPlaceHolderText, this._groupToggler = document.createElement("div"), this._groupToggler.className = "slick-group-toggle-all expanded", this._groupToggler.style.display = "none", this._dropzoneElm.appendChild(this._dropzonePlaceholder), this._dropzoneElm.appendChild(this._groupToggler), this.setupColumnDropbox(), this._handler.subscribe(this._grid.onHeaderCellRendered, (_e, args) => {
      let column = args.column, node = args.node;
      if (!Utils16.isEmptyObject(column.grouping) && node && (node.style.cursor = "pointer", this._options.groupIconCssClass || this._options.groupIconImage)) {
        let groupableIconElm = document.createElement("span");
        groupableIconElm.className = "slick-column-groupable", this._options.groupIconCssClass && groupableIconElm.classList.add(...this._options.groupIconCssClass.split(" ")), this._options.groupIconImage && (groupableIconElm.style.background = `url(${this._options.groupIconImage}) no-repeat center center`), node.appendChild(groupableIconElm);
      }
    });
    for (let i = 0; i < this._gridColumns.length; i++) {
      let columnId = this._gridColumns[i].field;
      this._grid.updateColumnHeader(columnId);
    }
  }
  /**
   * Setup the column reordering
   * NOTE: this function is a standalone function and is called externally and does not have access to `this` instance
   * @param grid - slick grid object
   * @param headers - slick grid column header elements
   * @param _headerColumnWidthDiff - header column width difference
   * @param setColumns - callback to reassign columns
   * @param setupColumnResize - callback to setup the column resize
   * @param columns - columns array
   * @param getColumnIndex - callback to find index of a column
   * @param uid - grid UID
   * @param trigger - callback to execute when triggering a column grouping
   */
  getSetupColumnReorder(grid, headers, _headerColumnWidthDiff, setColumns, setupColumnResize, _columns, getColumnIndex, _uid, trigger) {
    this.destroySortableInstances();
    let dropzoneElm = grid.getPreHeaderPanel(), groupTogglerElm = dropzoneElm.querySelector(".slick-group-toggle-all"), sortableOptions = {
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
      //   return this.columnsGroupBy.some(c => c.id === target.getAttribute('data-id'));
      // },
      onStart: () => {
        dropzoneElm.classList.add("slick-dropzone-hover"), dropzoneElm.classList.add("slick-dropzone-placeholder-hover");
        let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
        draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "inline-block"), dropzoneElm.querySelectorAll(".slick-dropped-grouping").forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "none"), groupTogglerElm && (groupTogglerElm.style.display = "none");
      },
      onEnd: (e) => {
        let draggablePlaceholderElm = dropzoneElm.querySelector(".slick-placeholder");
        dropzoneElm.classList.remove("slick-dropzone-hover"), draggablePlaceholderElm?.classList.remove("slick-dropzone-placeholder-hover"), this._dropzonePlaceholder && (this._dropzonePlaceholder.style.display = "none"), draggablePlaceholderElm && draggablePlaceholderElm.parentElement?.classList.remove("slick-dropzone-placeholder-hover");
        let droppedGroupingElms = dropzoneElm.querySelectorAll(".slick-dropped-grouping");
        if (droppedGroupingElms.length && (droppedGroupingElms.forEach((droppedGroupingElm) => droppedGroupingElm.style.display = "inline-flex"), draggablePlaceholderElm && (draggablePlaceholderElm.style.display = "none"), groupTogglerElm && (groupTogglerElm.style.display = "inline-block")), !grid.getEditorLock().commitCurrentEdit())
          return;
        let reorderedIds = this._sortableLeftInstance?.toArray() ?? [];
        if (headers.length > 1) {
          let ids = this._sortableRightInstance?.toArray() ?? [];
          for (let id of ids)
            reorderedIds.push(id);
        }
        let finalReorderedColumns = [], reorderedColumns = grid.getColumns();
        for (let reorderedId of reorderedIds)
          finalReorderedColumns.push(reorderedColumns[getColumnIndex.call(grid, reorderedId)]);
        setColumns.call(grid, finalReorderedColumns), trigger.call(grid, grid.onColumnsReordered, { grid }), e.stopPropagation(), setupColumnResize.call(grid);
      }
    };
    return this._sortableLeftInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-left`), sortableOptions), this._sortableRightInstance = Sortable.create(document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-right`), sortableOptions), {
      sortableLeftInstance: this._sortableLeftInstance,
      sortableRightInstance: this._sortableRightInstance
    };
  }
  /**
   * Destroy plugin.
   */
  destroy() {
    this.destroySortableInstances(), this.onGroupChanged.unsubscribe(), this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), Utils16.emptyElement(document.querySelector(`.${this._gridUid} .slick-preheader-panel`));
  }
  destroySortableInstances() {
    this._sortableLeftInstance?.el && this._sortableLeftInstance?.destroy(), this._sortableRightInstance?.el && this._sortableRightInstance?.destroy();
  }
  addDragOverDropzoneListeners() {
    let draggablePlaceholderElm = this._dropzoneElm.querySelector(".slick-placeholder");
    draggablePlaceholderElm && this._dropzoneElm && (this._bindingEventService.bind(draggablePlaceholderElm, "dragover", (e) => e.preventDefault()), this._bindingEventService.bind(draggablePlaceholderElm, "dragenter", () => this._dropzoneElm.classList.add("slick-dropzone-hover")), this._bindingEventService.bind(draggablePlaceholderElm, "dragleave", () => this._dropzoneElm.classList.remove("slick-dropzone-hover")));
  }
  setupColumnDropbox() {
    let dropzoneElm = this._dropzoneElm;
    this._droppableInstance = Sortable.create(dropzoneElm, {
      group: "shared",
      // chosenClass: 'slick-header-column-active',
      ghostClass: "slick-droppable-sortitem-hover",
      draggable: ".slick-dropped-grouping",
      dragoverBubble: !0,
      onAdd: (evt) => {
        let el = evt.item;
        el.getAttribute("id")?.replace(this._gridUid, "") && this.handleGroupByDrop(dropzoneElm, Sortable.utils.clone(evt.item)), evt.clone.style.opacity = ".5", el.parentNode?.removeChild(el);
      },
      onUpdate: () => {
        let sortArray = this._droppableInstance?.toArray() ?? [], newGroupingOrder = [];
        for (let i = 0, l = sortArray.length; i < l; i++)
          for (let a = 0, b = this._columnsGroupBy.length; a < b; a++)
            if (this._columnsGroupBy[a].id === sortArray[i]) {
              newGroupingOrder.push(this._columnsGroupBy[a]);
              break;
            }
        this._columnsGroupBy = newGroupingOrder, this.updateGroupBy("sort-group");
      }
    }), this.addDragOverDropzoneListeners(), this._groupToggler && this._bindingEventService.bind(this._groupToggler, "click", (event2) => {
      let target = event2.target;
      this.toggleGroupToggler(target, target?.classList.contains("expanded"));
    });
  }
  handleGroupByDrop(containerElm, headerColumnElm) {
    let columnId = headerColumnElm.getAttribute("data-id")?.replace(this._gridUid, ""), columnAllowed = !0;
    for (let colGroupBy of this._columnsGroupBy)
      colGroupBy.id === columnId && (columnAllowed = !1);
    if (columnAllowed) {
      for (let col of this._gridColumns)
        if (col.id === columnId && col.grouping && !Utils16.isEmptyObject(col.grouping)) {
          let columnNameElm = headerColumnElm.querySelector(".slick-column-name"), entryElm = document.createElement("div");
          entryElm.id = `${this._gridUid}_${col.id}_entry`, entryElm.className = "slick-dropped-grouping", entryElm.dataset.id = `${col.id}`;
          let groupTextElm = document.createElement("div");
          groupTextElm.className = "slick-dropped-grouping-title", groupTextElm.style.display = "inline-flex", groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent, entryElm.appendChild(groupTextElm);
          let groupRemoveIconElm = document.createElement("div");
          groupRemoveIconElm.className = "slick-groupby-remove", this._options.deleteIconCssClass && groupRemoveIconElm.classList.add(...this._options.deleteIconCssClass.split(" ")), this._options.deleteIconImage && groupRemoveIconElm.classList.add(...this._options.deleteIconImage.split(" ")), this._options.deleteIconCssClass || groupRemoveIconElm.classList.add("slick-groupby-remove-icon"), !this._options.deleteIconCssClass && !this._options.deleteIconImage && groupRemoveIconElm.classList.add("slick-groupby-remove-image"), this._options?.hideGroupSortIcons !== !0 && col.sortable && col.grouping?.sortAsc === void 0 && (col.grouping.sortAsc = !0), entryElm.appendChild(groupRemoveIconElm), entryElm.appendChild(document.createElement("div")), containerElm.appendChild(entryElm), this.addColumnGroupBy(col), this.addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
        }
      this._groupToggler && this._columnsGroupBy.length > 0 && (this._groupToggler.style.display = "inline-block");
    }
  }
  addColumnGroupBy(column) {
    this._columnsGroupBy.push(column), this.updateGroupBy("add-group");
  }
  addGroupByRemoveClickHandler(id, groupRemoveIconElm, headerColumnElm, entry) {
    this._bindingEventService.bind(groupRemoveIconElm, "click", () => {
      let boundedElms = this._bindingEventService.getBoundedEvents().filter((boundedEvent) => boundedEvent.element === groupRemoveIconElm);
      for (let boundedEvent of boundedElms)
        this._bindingEventService.unbind(boundedEvent.element, "click", boundedEvent.listener);
      this.removeGroupBy(id, headerColumnElm, entry);
    });
  }
  setDroppedGroups(groupingInfo) {
    let groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
    this._dropzonePlaceholder.style.display = "none";
    for (let groupInfo of groupingInfos) {
      let columnElm = this._grid.getHeaderColumn(groupInfo);
      this.handleGroupByDrop(this._dropzoneElm, columnElm);
    }
  }
  clearDroppedGroups() {
    this._columnsGroupBy = [], this.updateGroupBy("clear-all");
    let allDroppedGroupingElms = this._dropzoneElm.querySelectorAll(".slick-dropped-grouping");
    for (let groupElm of Array.from(allDroppedGroupingElms))
      this._dropzoneElm.querySelector(".slick-groupby-remove")?.remove(), groupElm?.remove();
    this._dropzonePlaceholder.style.display = "inline-block", this._groupToggler && (this._groupToggler.style.display = "none");
  }
  removeFromArray(arrayToModify, itemToRemove) {
    if (Array.isArray(arrayToModify)) {
      let itemIdx = arrayToModify.findIndex((a) => a.id === itemToRemove.id);
      itemIdx >= 0 && arrayToModify.splice(itemIdx, 1);
    }
    return arrayToModify;
  }
  removeGroupBy(id, _hdrColumnElm, entry) {
    entry.remove();
    let groupby = [];
    this._gridColumns.forEach((col) => groupby[col.id] = col), this.removeFromArray(this._columnsGroupBy, groupby[id]), this._columnsGroupBy.length === 0 && (this._dropzonePlaceholder.style.display = "block", this._groupToggler && (this._groupToggler.style.display = "none")), this.updateGroupBy("remove-group");
  }
  toggleGroupToggler(targetElm, collapsing = !0, shouldExecuteDataViewCommand = !0) {
    targetElm && (collapsing === !0 ? (targetElm.classList.add("collapsed"), targetElm.classList.remove("expanded"), shouldExecuteDataViewCommand && this._dataView.collapseAllGroups()) : (targetElm.classList.remove("collapsed"), targetElm.classList.add("expanded"), shouldExecuteDataViewCommand && this._dataView.expandAllGroups()));
  }
  updateGroupBy(originator) {
    if (this._columnsGroupBy.length === 0) {
      this._dataView.setGrouping([]), this.onGroupChanged.notify({ caller: originator, groupColumns: [] });
      return;
    }
    let groupingArray = [];
    this._columnsGroupBy.forEach((element) => groupingArray.push(element.grouping)), this._dataView.setGrouping(groupingArray), this.onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
  }
};

// src/plugins/slick.headerbuttons.ts
var BindingEventService10 = BindingEventService, SlickEvent13 = Event, EventHandler4 = EventHandler, Utils17 = Utils, SlickHeaderButtons = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "HeaderButtons");
    __publicField(this, "onCommand", new SlickEvent13());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_handler", new EventHandler4());
    __publicField(this, "_bindingEventService", new BindingEventService10());
    __publicField(this, "_defaults", {
      buttonCssClass: "slick-header-button"
    });
    __publicField(this, "_options");
    this._options = Utils17.extend(!0, {}, this._defaults, options);
  }
  init(grid) {
    this._grid = grid, this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns());
  }
  destroy() {
    this._handler.unsubscribeAll(), this._bindingEventService.unbindAll();
  }
  handleHeaderCellRendered(_e, args) {
    let column = args.column;
    if (column.header?.buttons) {
      let i = column.header.buttons.length;
      for (; i--; ) {
        let button = column.header.buttons[i], isItemVisible = this.runOverrideFunctionWhenExists(button.itemVisibilityOverride, args), isItemUsable = this.runOverrideFunctionWhenExists(button.itemUsabilityOverride, args);
        if (!isItemVisible)
          continue;
        Object.prototype.hasOwnProperty.call(button, "itemUsabilityOverride") && (button.disabled = !isItemUsable);
        let btn = document.createElement("div");
        btn.className = this._options.buttonCssClass || "", btn.ariaLabel = "Header Button", btn.role = "button", button.disabled && btn.classList.add("slick-header-button-disabled"), button.showOnHover && btn.classList.add("slick-header-button-hidden"), button.image && (btn.style.backgroundImage = `url(${button.image})`), button.cssClass && btn.classList.add(...button.cssClass.split(" ")), button.tooltip && (btn.title = button.tooltip), button.handler && !button.disabled && this._bindingEventService.bind(btn, "click", button.handler), this._bindingEventService.bind(btn, "click", this.handleButtonClick.bind(this, button, args.column)), args.node.appendChild(btn);
      }
    }
  }
  handleBeforeHeaderCellDestroy(_e, args) {
    if (args.column.header?.buttons) {
      let buttonCssClass = (this._options.buttonCssClass || "").replace(/(\s+)/g, ".");
      buttonCssClass && args.node.querySelectorAll(`.${buttonCssClass}`).forEach((elm) => elm.remove());
    }
  }
  handleButtonClick(button, columnDef, e) {
    let command = button.command || "", callbackArgs = {
      grid: this._grid,
      column: columnDef,
      button
    };
    command && (callbackArgs.command = command), typeof button.action == "function" && button.action.call(this, e, callbackArgs), command && !button.disabled && (this.onCommand.notify(callbackArgs, e, this), this._grid.updateColumnHeader(columnDef.id)), e.preventDefault(), e.stopPropagation();
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
};

// src/plugins/slick.headermenu.ts
var BindingEventService11 = BindingEventService, SlickEvent14 = Event, SlickEventHandler7 = SlickEventHandler, Utils18 = Utils, SlickHeaderMenu = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "HeaderMenu");
    __publicField(this, "onAfterMenuShow", new SlickEvent14());
    __publicField(this, "onBeforeMenuShow", new SlickEvent14());
    __publicField(this, "onCommand", new SlickEvent14());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_handler", new SlickEventHandler7());
    __publicField(this, "_bindingEventService", new BindingEventService11());
    __publicField(this, "_defaults", {
      buttonCssClass: void 0,
      buttonImage: void 0,
      minWidth: 100,
      autoAlign: !0,
      autoAlignOffset: 0,
      subMenuOpenByEvent: "mouseover"
    });
    __publicField(this, "_options");
    __publicField(this, "_activeHeaderColumnElm");
    __publicField(this, "_menuElm");
    __publicField(this, "_subMenuParentId", "");
    this._options = Utils18.extend(!0, {}, options, this._defaults);
  }
  init(grid) {
    this._grid = grid, this._gridUid = grid?.getUID() || "", this._handler.subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this)).subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this)), this._grid.setColumns(this._grid.getColumns()), this._bindingEventService.bind(document.body, "click", this.handleBodyMouseDown.bind(this));
  }
  setOptions(newOptions) {
    this._options = Utils18.extend(!0, {}, this._options, newOptions);
  }
  getGridUidSelector() {
    let gridUid = this._grid.getUID() || "";
    return gridUid ? `.${gridUid}` : "";
  }
  destroy() {
    this._handler.unsubscribeAll(), this._bindingEventService.unbindAll(), this._menuElm = this._menuElm || document.body.querySelector(`.slick-header-menu${this.getGridUidSelector()}`), this._menuElm?.remove(), this._activeHeaderColumnElm = void 0;
  }
  destroyAllMenus() {
    this.destroySubMenus(), this._bindingEventService.unbindAll("parent-menu"), document.querySelectorAll(`.slick-header-menu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  /** Close and destroy all previously opened sub-menus */
  destroySubMenus() {
    this._bindingEventService.unbindAll("sub-menu"), document.querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => subElm.remove());
  }
  handleBodyMouseDown(e) {
    let isMenuClicked = !1;
    this._menuElm?.contains(e.target) && (isMenuClicked = !0), isMenuClicked || document.querySelectorAll(`.slick-header-menu.slick-submenu${this.getGridUidSelector()}`).forEach((subElm) => {
      subElm.contains(e.target) && (isMenuClicked = !0);
    }), (this._menuElm !== e.target && !isMenuClicked && !e.defaultPrevented || e.target.className === "close") && this.hideMenu();
  }
  hideMenu() {
    this._menuElm && (this._menuElm.remove(), this._menuElm = void 0), this._activeHeaderColumnElm?.classList.remove("slick-header-column-active"), this.destroySubMenus();
  }
  handleHeaderCellRendered(_e, args) {
    let menu = args.column?.header?.menu;
    if (menu?.items && console.warn('[SlickGrid] Header Menu "items" property was deprecated in favor of "commandItems" to align with all other Menu plugins.'), menu) {
      if (!this.runOverrideFunctionWhenExists(this._options.menuUsabilityOverride, args))
        return;
      let elm = document.createElement("div");
      if (elm.className = "slick-header-menubutton", elm.ariaLabel = "Header Menu", elm.role = "button", !this._options.buttonCssClass && !this._options.buttonImage && (this._options.buttonCssClass = "caret"), this._options.buttonCssClass) {
        let icon = document.createElement("span");
        icon.classList.add(...this._options.buttonCssClass.split(" ")), elm.appendChild(icon);
      }
      this._options.buttonImage && (elm.style.backgroundImage = `url(${this._options.buttonImage})`), this._options.tooltip && (elm.title = this._options.tooltip), this._bindingEventService.bind(elm, "click", (e) => {
        this.destroyAllMenus(), this.createParentMenu(e, menu, args.column);
      }), args.node.appendChild(elm);
    }
  }
  handleBeforeHeaderCellDestroy(_e, args) {
    args.column.header?.menu && args.node.querySelectorAll(".slick-header-menubutton").forEach((elm) => elm.remove());
  }
  addSubMenuTitleWhenExists(item, commandMenuElm) {
    if (item !== "divider" && item?.subMenuTitle) {
      let subMenuTitleElm = document.createElement("div");
      subMenuTitleElm.className = "slick-menu-title", subMenuTitleElm.textContent = item.subMenuTitle;
      let subMenuTitleClass = item.subMenuTitleCssClass;
      subMenuTitleClass && subMenuTitleElm.classList.add(...subMenuTitleClass.split(" ")), commandMenuElm.appendChild(subMenuTitleElm);
    }
  }
  createParentMenu(event2, menu, columnDef) {
    let callbackArgs = {
      grid: this._grid,
      column: columnDef,
      menu
    };
    if (this.onBeforeMenuShow.notify(callbackArgs, event2, this).getReturnValue() === !1)
      return;
    this._menuElm = this.createMenu(menu.commandItems || menu.items, columnDef);
    let containerNode = this._grid.getContainerNode();
    containerNode && containerNode.appendChild(this._menuElm), this.repositionMenu(event2, this._menuElm), this.onAfterMenuShow.notify(callbackArgs, event2, this).getReturnValue() !== !1 && (event2.preventDefault(), event2.stopPropagation());
  }
  createMenu(commandItems, columnDef, level = 0, item) {
    let isSubMenu = level > 0, subMenuCommand = item?.command, subMenuId = level === 1 && subMenuCommand ? subMenuCommand.replaceAll(" ", "") : "";
    subMenuId && (this._subMenuParentId = subMenuId), isSubMenu && (subMenuId = this._subMenuParentId);
    let menuClasses = `slick-header-menu slick-menu-level-${level} ${this._gridUid}`, bodyMenuElm = document.body.querySelector(`.slick-header-menu.slick-menu-level-${level}${this.getGridUidSelector()}`);
    if (bodyMenuElm) {
      if (bodyMenuElm.dataset.subMenuParent === subMenuId)
        return bodyMenuElm;
      this.destroySubMenus();
    }
    let menuElm = document.createElement("div");
    menuElm.className = menuClasses, level > 0 && (menuElm.classList.add("slick-submenu"), subMenuId && (menuElm.dataset.subMenuParent = subMenuId)), menuElm.classList.add(this._gridUid), menuElm.role = "menu", menuElm.ariaLabel = level > 1 ? "SubMenu" : "Header Menu", menuElm.style.minWidth = `${this._options.minWidth}px`, menuElm.setAttribute("aria-expanded", "true");
    let callbackArgs = {
      grid: this._grid,
      column: columnDef,
      menu: { items: commandItems }
    };
    item && level > 0 && this.addSubMenuTitleWhenExists(item, menuElm);
    for (let i = 0; i < commandItems.length; i++) {
      let addClickListener = !0, item2 = commandItems[i], isItemVisible = this.runOverrideFunctionWhenExists(item2.itemVisibilityOverride, callbackArgs), isItemUsable = this.runOverrideFunctionWhenExists(item2.itemUsabilityOverride, callbackArgs);
      if (!isItemVisible)
        continue;
      Object.prototype.hasOwnProperty.call(item2, "itemUsabilityOverride") && (item2.disabled = !isItemUsable);
      let menuItemElm = document.createElement("div");
      menuItemElm.className = "slick-header-menuitem", menuItemElm.role = "menuitem", (item2.divider || item2 === "divider") && (menuItemElm.classList.add("slick-header-menuitem-divider"), addClickListener = !1), item2.disabled && menuItemElm.classList.add("slick-header-menuitem-disabled"), item2.hidden && menuItemElm.classList.add("slick-header-menuitem-hidden"), item2.cssClass && menuItemElm.classList.add(...item2.cssClass.split(" ")), item2.tooltip && (menuItemElm.title = item2.tooltip || "");
      let iconElm = document.createElement("div");
      iconElm.className = "slick-header-menuicon", menuItemElm.appendChild(iconElm), item2.iconCssClass && iconElm.classList.add(...item2.iconCssClass.split(" ")), item2.iconImage && (iconElm.style.backgroundImage = "url(" + item2.iconImage + ")");
      let textElm = document.createElement("span");
      if (textElm.className = "slick-header-menucontent", textElm.textContent = item2.title || "", menuItemElm.appendChild(textElm), item2.textCssClass && textElm.classList.add(...item2.textCssClass.split(" ")), menuElm.appendChild(menuItemElm), addClickListener) {
        let eventGroup = isSubMenu ? "sub-menu" : "parent-menu";
        this._bindingEventService.bind(menuItemElm, "click", this.handleMenuItemClick.bind(this, item2, columnDef, level), void 0, eventGroup);
      }
      if (this._options.subMenuOpenByEvent === "mouseover" && this._bindingEventService.bind(menuItemElm, "mouseover", (e) => {
        item2.commandItems || item2.items ? this.repositionSubMenu(item2, columnDef, level, e) : isSubMenu || this.destroySubMenus();
      }), item2.commandItems || item2.items) {
        let chevronElm = document.createElement("div");
        chevronElm.className = "sub-item-chevron", this._options.subItemChevronClass ? chevronElm.classList.add(...this._options.subItemChevronClass.split(" ")) : chevronElm.textContent = "\u2B9E", menuItemElm.classList.add("slick-submenu-item"), menuItemElm.appendChild(chevronElm);
      }
    }
    return menuElm;
  }
  handleMenuItemClick(item, columnDef, level = 0, e) {
    if (item !== "divider" && !item.disabled && !item.divider) {
      let command = item.command || "";
      if (Utils18.isDefined(command) && !item.commandItems && !item.items) {
        let callbackArgs = {
          grid: this._grid,
          column: columnDef,
          command,
          item
        };
        this.onCommand.notify(callbackArgs, e, this), typeof item.action == "function" && item.action.call(this, e, callbackArgs), e.defaultPrevented || this.hideMenu();
      } else
        item.commandItems || item.items ? this.repositionSubMenu(item, columnDef, level, e) : this.destroySubMenus();
    }
  }
  repositionSubMenu(item, columnDef, level, e) {
    e.target.classList.contains("slick-header-menubutton") && this.destroySubMenus();
    let subMenuElm = this.createMenu(item.commandItems || item.items || [], columnDef, level + 1, item);
    document.body.appendChild(subMenuElm), this.repositionMenu(e, subMenuElm);
  }
  repositionMenu(e, menuElm) {
    let buttonElm = e.target, isSubMenu = menuElm.classList.contains("slick-submenu"), parentElm = isSubMenu ? e.target.closest(".slick-header-menuitem") : buttonElm, btnOffset = Utils18.offset(buttonElm), gridPos = this._grid.getGridPosition(), menuWidth = menuElm.offsetWidth, menuOffset = Utils18.offset(this._menuElm), parentOffset = Utils18.offset(parentElm), menuOffsetTop = isSubMenu ? parentOffset?.top ?? 0 : buttonElm.clientHeight ?? btnOffset?.top ?? 0 + (this._options?.menuOffsetTop ?? 0), menuOffsetLeft = isSubMenu ? parentOffset?.left ?? 0 : btnOffset?.left ?? 0;
    if (isSubMenu && parentElm) {
      let subMenuPosCalc = menuOffsetLeft + Number(menuWidth);
      isSubMenu && (subMenuPosCalc += parentElm.clientWidth);
      let browserWidth = document.documentElement.clientWidth;
      (subMenuPosCalc >= gridPos.width || subMenuPosCalc >= browserWidth ? "left" : "right") === "left" ? (menuElm.classList.remove("dropright"), menuElm.classList.add("dropleft"), menuOffsetLeft -= menuWidth) : (menuElm.classList.remove("dropleft"), menuElm.classList.add("dropright"), isSubMenu && (menuOffsetLeft += parentElm.offsetWidth));
    } else
      menuOffsetLeft + menuElm.offsetWidth >= gridPos.width && (menuOffsetLeft = menuOffsetLeft + buttonElm.clientWidth - menuElm.clientWidth + (this._options.autoAlignOffset || 0)), menuOffsetLeft -= menuOffset?.left ?? 0;
    menuElm.style.top = `${menuOffsetTop}px`, menuElm.style.left = `${menuOffsetLeft}px`, this._activeHeaderColumnElm = menuElm.closest(".slick-header-column"), this._activeHeaderColumnElm && this._activeHeaderColumnElm.classList.add("slick-header-column-active");
  }
  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  runOverrideFunctionWhenExists(overrideFn, args) {
    return typeof overrideFn == "function" ? overrideFn.call(this, args) : !0;
  }
};

// src/plugins/slick.resizer.ts
var BindingEventService12 = BindingEventService, SlickEvent15 = Event, Utils19 = Utils, DATAGRID_MIN_HEIGHT = 180, DATAGRID_MIN_WIDTH = 300, DATAGRID_BOTTOM_PADDING = 20, SlickResizer = class {
  constructor(options, fixedDimensions) {
    // --
    // public API
    __publicField(this, "pluginName", "Resizer");
    __publicField(this, "onGridAfterResize", new SlickEvent15());
    __publicField(this, "onGridBeforeResize", new SlickEvent15());
    // --
    // protected props
    __publicField(this, "_bindingEventService");
    __publicField(this, "_fixedHeight");
    __publicField(this, "_fixedWidth");
    __publicField(this, "_grid");
    __publicField(this, "_gridDomElm");
    __publicField(this, "_gridContainerElm");
    __publicField(this, "_pageContainerElm");
    __publicField(this, "_gridOptions");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_lastDimensions");
    __publicField(this, "_resizePaused", !1);
    __publicField(this, "_timer");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      bottomPadding: 20,
      applyResizeToContainer: !1,
      minHeight: 180,
      minWidth: 300,
      rightPadding: 0
    });
    this._bindingEventService = new BindingEventService12(), this._options = Utils19.extend(!0, {}, this._defaults, options), fixedDimensions && (this._fixedHeight = fixedDimensions.height, this._fixedWidth = fixedDimensions.width);
  }
  setOptions(newOptions) {
    this._options = Utils19.extend(!0, {}, this._defaults, this._options, newOptions);
  }
  init(grid) {
    this.setOptions(this._options), this._grid = grid, this._gridOptions = this._grid.getOptions(), this._gridUid = this._grid.getUID(), this._gridDomElm = this._grid.getContainerNode(), this._pageContainerElm = typeof this._options.container == "string" ? document.querySelector(this._options.container) : this._options.container, this._options.gridContainer && (this._gridContainerElm = this._options.gridContainer), this._gridOptions && this.bindAutoResizeDataGrid();
  }
  /** Bind an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
  * Options: we could also provide a % factor to resize on each height/width independently
  */
  bindAutoResizeDataGrid(newSizes) {
    let gridElmOffset = Utils19.offset(this._gridDomElm);
    (this._gridDomElm !== void 0 || gridElmOffset !== void 0) && (this.resizeGrid(0, newSizes, null), this._bindingEventService.bind(window, "resize", (event2) => {
      this.onGridBeforeResize.notify({ grid: this._grid }, event2, this), this._resizePaused || (this.resizeGrid(0, newSizes, event2), this.resizeGrid(0, newSizes, event2));
    }));
  }
  /**
   * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
   */
  calculateGridNewDimensions() {
    let gridElmOffset = Utils19.offset(this._gridDomElm);
    if (!window || this._pageContainerElm === void 0 || this._gridDomElm === void 0 || gridElmOffset === void 0)
      return null;
    let bottomPadding = this._options?.bottomPadding !== void 0 ? this._options.bottomPadding : DATAGRID_BOTTOM_PADDING, gridHeight = 0, gridOffsetTop = 0;
    this._options.calculateAvailableSizeBy === "container" ? gridHeight = Utils19.innerSize(this._pageContainerElm, "height") || 0 : (gridHeight = window.innerHeight || 0, gridOffsetTop = gridElmOffset !== void 0 ? gridElmOffset.top : 0);
    let availableHeight = gridHeight - gridOffsetTop - bottomPadding, availableWidth = Utils19.innerSize(this._pageContainerElm, "width") || window.innerWidth || 0, maxHeight = this._options?.maxHeight || void 0, minHeight = this._options?.minHeight !== void 0 ? this._options.minHeight : DATAGRID_MIN_HEIGHT, maxWidth = this._options?.maxWidth || void 0, minWidth = this._options?.minWidth !== void 0 ? this._options.minWidth : DATAGRID_MIN_WIDTH, newHeight = availableHeight, newWidth = this._options?.rightPadding ? availableWidth - this._options.rightPadding : availableWidth;
    return newHeight < minHeight && (newHeight = minHeight), maxHeight && newHeight > maxHeight && (newHeight = maxHeight), newWidth < minWidth && (newWidth = minWidth), maxWidth && newWidth > maxWidth && (newWidth = maxWidth), {
      height: this._fixedHeight || newHeight,
      width: this._fixedWidth || newWidth
    };
  }
  /** Destroy function when element is destroyed */
  destroy() {
    this.onGridBeforeResize.unsubscribe(), this.onGridAfterResize.unsubscribe(), this._bindingEventService.unbindAll();
  }
  /**
  * Return the last resize dimensions used by the service
  * @return {object} last dimensions (height: number, width: number)
  */
  getLastResizeDimensions() {
    return this._lastDimensions;
  }
  /**
   * Provide the possibility to pause the resizer for some time, until user decides to re-enabled it later if he wish to.
   * @param {boolean} isResizePaused are we pausing the resizer?
   */
  pauseResizer(isResizePaused) {
    this._resizePaused = isResizePaused;
  }
  /**
   * Resize the datagrid to fit the browser height & width.
   * @param {number} [delay] to wait before resizing, defaults to 0 (in milliseconds)
   * @param {object} [newSizes] can optionally be passed (height: number, width: number)
   * @param {object} [event] that triggered the resize, defaults to null
   * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
   */
  resizeGrid(delay, newSizes, event2) {
    let resizeDelay = delay || 0;
    if (typeof Promise == "function")
      return new Promise((resolve) => {
        resizeDelay > 0 ? (clearTimeout(this._timer), this._timer = setTimeout(() => {
          resolve(this.resizeGridCallback(newSizes, event2));
        }, resizeDelay)) : resolve(this.resizeGridCallback(newSizes, event2));
      });
    resizeDelay > 0 ? (clearTimeout(this._timer), this._timer = setTimeout(() => {
      this.resizeGridCallback(newSizes, event2);
    }, resizeDelay)) : this.resizeGridCallback(newSizes, event2);
  }
  resizeGridCallback(newSizes, event2) {
    let lastDimensions = this.resizeGridWithDimensions(newSizes);
    return this.onGridAfterResize.notify({ grid: this._grid, dimensions: lastDimensions }, event2, this), lastDimensions;
  }
  resizeGridWithDimensions(newSizes) {
    let availableDimensions = this.calculateGridNewDimensions();
    if ((newSizes || availableDimensions) && this._gridDomElm)
      try {
        let newHeight = newSizes?.height ? newSizes.height : availableDimensions?.height, newWidth = newSizes?.width ? newSizes.width : availableDimensions?.width;
        this._gridOptions.autoHeight || (this._gridDomElm.style.height = `${newHeight}px`), this._gridDomElm.style.width = `${newWidth}px`, this._gridContainerElm && (this._gridContainerElm.style.width = `${newWidth}px`), this._grid?.resizeCanvas && this._grid.resizeCanvas(), this._gridOptions?.enableAutoSizeColumns && this._grid.autosizeColumns && this._gridUid && document.querySelector(`.${this._gridUid}`) && this._grid.autosizeColumns(), this._lastDimensions = {
          height: newHeight,
          width: newWidth
        };
      } catch {
        this.destroy();
      }
    return this._lastDimensions;
  }
};

// src/plugins/slick.rowdetailview.ts
var SlickEvent16 = SlickEvent, SlickEventHandler8 = SlickEventHandler, Utils20 = Utils, SlickRowDetailView = class {
  /** Constructor of the Row Detail View Plugin which accepts optional options */
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "RowDetailView");
    __publicField(this, "onAsyncResponse", new SlickEvent16());
    __publicField(this, "onAsyncEndUpdate", new SlickEvent16());
    __publicField(this, "onAfterRowDetailToggle", new SlickEvent16());
    __publicField(this, "onBeforeRowDetailToggle", new SlickEvent16());
    __publicField(this, "onRowBackToViewportRange", new SlickEvent16());
    __publicField(this, "onRowOutOfViewportRange", new SlickEvent16());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_gridOptions");
    __publicField(this, "_gridUid", "");
    __publicField(this, "_dataView");
    __publicField(this, "_dataViewIdProperty", "id");
    __publicField(this, "_expandableOverride", null);
    __publicField(this, "_lastRange", null);
    __publicField(this, "_expandedRows", []);
    __publicField(this, "_eventHandler");
    __publicField(this, "_outsideRange", 5);
    __publicField(this, "_visibleRenderedCellCount", 0);
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      columnId: "_detail_selector",
      cssClass: "detailView-toggle",
      expandedClass: void 0,
      collapsedClass: void 0,
      keyPrefix: "_",
      loadOnce: !1,
      collapseAllOnSort: !0,
      saveDetailViewOnScroll: !0,
      singleRowExpand: !1,
      useSimpleViewportCalc: !1,
      alwaysRenderColumn: !0,
      toolTip: "",
      width: 30,
      maxRows: void 0
    });
    __publicField(this, "_keyPrefix", this._defaults.keyPrefix);
    __publicField(this, "_gridRowBuffer", 0);
    __publicField(this, "_rowIdsOutOfViewport", []);
    this._options = Utils20.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler8(), typeof this._options.expandableOverride == "function" && this.expandableOverride(this._options.expandableOverride);
  }
  /**
   * Initialize the plugin, which requires user to pass the SlickGrid Grid object
   * @param grid: SlickGrid Grid object
   */
  init(grid) {
    if (!grid)
      throw new Error('RowDetailView Plugin requires the Grid instance to be passed as argument to the "init()" method');
    this._grid = grid, this._gridUid = grid.getUID(), this._gridOptions = grid.getOptions() || {}, this._dataView = this._grid.getData(), this._keyPrefix = this._options?.keyPrefix ?? "_", this._gridRowBuffer = this._gridOptions.minRowBuffer || 0, this._gridOptions.minRowBuffer = this._options.panelRows + 3, this._eventHandler.subscribe(this._grid.onClick, this.handleClick.bind(this)).subscribe(this._grid.onScroll, this.handleScroll.bind(this)), this._options.collapseAllOnSort && (this._eventHandler.subscribe(this._grid.onSort, this.collapseAll.bind(this)), this._expandedRows = [], this._rowIdsOutOfViewport = []), this._eventHandler.subscribe(this._dataView.onRowCountChanged, () => {
      this._grid.updateRowCount(), this._grid.render();
    }), this._eventHandler.subscribe(this._dataView.onRowsChanged, (_e, a) => {
      this._grid.invalidateRows(a.rows), this._grid.render();
    }), this.subscribeToOnAsyncResponse(), this._eventHandler.subscribe(this._dataView.onSetItemsCalled, () => {
      this._dataViewIdProperty = this._dataView?.getIdPropertyName() ?? "id";
    }), this._options.useSimpleViewportCalc && this._eventHandler.subscribe(this._grid.onRendered, (_e, args) => {
      args?.endRow && (this._visibleRenderedCellCount = args.endRow - args.startRow);
    });
  }
  /** destroy the plugin and it's events */
  destroy() {
    this._eventHandler.unsubscribeAll(), this.onAsyncResponse.unsubscribe(), this.onAsyncEndUpdate.unsubscribe(), this.onAfterRowDetailToggle.unsubscribe(), this.onBeforeRowDetailToggle.unsubscribe(), this.onRowOutOfViewportRange.unsubscribe(), this.onRowBackToViewportRange.unsubscribe();
  }
  /** Get current plugin options */
  getOptions() {
    return this._options;
  }
  /** set or change some of the plugin options */
  setOptions(options) {
    this._options = Utils20.extend(!0, {}, this._options, options), this._options?.singleRowExpand && this.collapseAll();
  }
  /** Find a value in an array and return the index when (or -1 when not found) */
  arrayFindIndex(sourceArray, value) {
    if (Array.isArray(sourceArray)) {
      for (let i = 0; i < sourceArray.length; i++)
        if (sourceArray[i] === value)
          return i;
    }
    return -1;
  }
  /** Handle mouse click event */
  handleClick(e, args) {
    let dataContext = this._grid.getDataItem(args.row);
    if (this.checkExpandableOverride(args.row, dataContext, this._grid) && (this._options.useRowClick || this._grid.getColumns()[args.cell].id === this._options.columnId && e.target.classList.contains(this._options.cssClass || ""))) {
      if (this._grid.getEditorLock().isActive() && !this._grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault(), e.stopImmediatePropagation();
        return;
      }
      if (this.onBeforeRowDetailToggle.notify({ grid: this._grid, item: dataContext }, e, this).getReturnValue() === !1)
        return;
      this.toggleRowSelection(args.row, dataContext), this.onAfterRowDetailToggle.notify({
        grid: this._grid,
        item: dataContext,
        expandedRows: this._expandedRows
      }, e, this), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  /** If we scroll save detail views that go out of cache range */
  handleScroll() {
    this._options.useSimpleViewportCalc ? this.calculateOutOfRangeViewsSimplerVersion() : this.calculateOutOfRangeViews();
  }
  /** Calculate when expanded rows become out of view range */
  calculateOutOfRangeViews() {
    let scrollDir = "";
    if (this._grid) {
      let renderedRange = this._grid.getRenderedRange();
      if (this._expandedRows.length > 0 && (scrollDir = "DOWN", this._lastRange)) {
        if (this._lastRange.top === renderedRange.top && this._lastRange.bottom === renderedRange.bottom)
          return;
        (this._lastRange.top > renderedRange.top || // Or we are at very top but our bottom is increasing
        this._lastRange.top === 0 && renderedRange.top === 0 && this._lastRange.bottom > renderedRange.bottom) && (scrollDir = "UP");
      }
      this._expandedRows.forEach((row) => {
        let rowIndex = this._dataView?.getRowById(row[this._dataViewIdProperty]) ?? 0, rowPadding = row[`${this._keyPrefix}sizePadding`], rowOutOfRange = this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0;
        scrollDir === "UP" ? (this._options.saveDetailViewOnScroll && rowIndex >= renderedRange.bottom - this._gridRowBuffer && this.saveDetailView(row), rowOutOfRange && rowIndex - this._outsideRange < renderedRange.top && rowIndex >= renderedRange.top ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : !rowOutOfRange && rowIndex + rowPadding > renderedRange.bottom && this.notifyOutOfViewport(row, row[this._dataViewIdProperty])) : scrollDir === "DOWN" && (this._options.saveDetailViewOnScroll && rowIndex <= renderedRange.top + this._gridRowBuffer && this.saveDetailView(row), rowOutOfRange && rowIndex + rowPadding + this._outsideRange > renderedRange.bottom && rowIndex < rowIndex + rowPadding ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : !rowOutOfRange && rowIndex < renderedRange.top && this.notifyOutOfViewport(row, row[this._dataViewIdProperty]));
      }), this._lastRange = renderedRange;
    }
  }
  /** This is an alternative & more simpler version of the Calculate when expanded rows become out of view range */
  calculateOutOfRangeViewsSimplerVersion() {
    if (this._grid) {
      let renderedRange = this._grid.getRenderedRange();
      this._expandedRows.forEach((row) => {
        let rowIndex = this._dataView.getRowById(row[this._dataViewIdProperty]) ?? -1, isOutOfVisibility = this.checkIsRowOutOfViewportRange(rowIndex, renderedRange);
        !isOutOfVisibility && this.arrayFindIndex(this._rowIdsOutOfViewport, row[this._dataViewIdProperty]) >= 0 ? this.notifyBackToViewportWhenDomExist(row, row[this._dataViewIdProperty]) : isOutOfVisibility && this.notifyOutOfViewport(row, row[this._dataViewIdProperty]);
      });
    }
  }
  /**
   * Check if the row became out of visible range (when user can't see it anymore)
   * @param rowIndex
   * @param renderedRange from SlickGrid
   */
  checkIsRowOutOfViewportRange(rowIndex, renderedRange) {
    return Math.abs(renderedRange.bottom - this._gridRowBuffer - rowIndex) > this._visibleRenderedCellCount * 2;
  }
  /** Send a notification, through "onRowOutOfViewportRange", that is out of the viewport range */
  notifyOutOfViewport(item, rowId) {
    let rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
    this.onRowOutOfViewportRange.notify({
      grid: this._grid,
      item,
      rowId,
      rowIndex,
      expandedRows: this._expandedRows,
      rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, !0)
    }, null, this);
  }
  /** Send a notification, through "onRowBackToViewportRange", that a row came back into the viewport visible range */
  notifyBackToViewportWhenDomExist(item, rowId) {
    let rowIndex = item.rowIndex || this._dataView.getRowById(item[this._dataViewIdProperty]);
    setTimeout(() => {
      document.querySelector(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`) && this.onRowBackToViewportRange.notify({
        grid: this._grid,
        item,
        rowId,
        rowIndex,
        expandedRows: this._expandedRows,
        rowIdsOutOfViewport: this.syncOutOfViewportArray(rowId, !1)
      }, null, this);
    }, 100);
  }
  /**
   * This function will sync the "out of viewport" array whenever necessary.
   * The sync can add a detail row (when necessary, no need to add again if it already exist) or delete a row from the array.
   * @param rowId: number
   * @param isAdding: are we adding or removing a row?
   */
  syncOutOfViewportArray(rowId, isAdding) {
    let arrayRowIndex = this.arrayFindIndex(this._rowIdsOutOfViewport, rowId);
    return isAdding && arrayRowIndex < 0 ? this._rowIdsOutOfViewport.push(rowId) : !isAdding && arrayRowIndex >= 0 && this._rowIdsOutOfViewport.splice(arrayRowIndex, 1), this._rowIdsOutOfViewport;
  }
  // Toggle between showing or hiding a row
  toggleRowSelection(rowNumber, dataContext) {
    this.checkExpandableOverride(rowNumber, dataContext, this._grid) && (this._dataView.beginUpdate(), this.handleAccordionShowHide(dataContext), this._dataView.endUpdate());
  }
  /** Collapse all of the open detail rows */
  collapseAll() {
    this._dataView.beginUpdate();
    for (let i = this._expandedRows.length - 1; i >= 0; i--)
      this.collapseDetailView(this._expandedRows[i], !0);
    this._dataView.endUpdate();
  }
  /** Collapse a detail row so that it is not longer open */
  collapseDetailView(item, isMultipleCollapsing = !1) {
    isMultipleCollapsing || this._dataView.beginUpdate(), this._options.loadOnce && this.saveDetailView(item), item[`${this._keyPrefix}collapsed`] = !0;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
      this._dataView.deleteItem(item[this._dataViewIdProperty] + "." + idx);
    item[`${this._keyPrefix}sizePadding`] = 0, this._dataView.updateItem(item[this._dataViewIdProperty], item), this._expandedRows = this._expandedRows.filter((r) => r[this._dataViewIdProperty] !== item[this._dataViewIdProperty]), isMultipleCollapsing || this._dataView.endUpdate();
  }
  /** Expand a detail row by providing the dataview item that is to be expanded */
  expandDetailView(item) {
    if (this._options?.singleRowExpand && this.collapseAll(), item[`${this._keyPrefix}collapsed`] = !1, this._expandedRows.push(item), item[`${this._keyPrefix}detailContent`] || (item[`${this._keyPrefix}detailViewLoaded`] = !1), !item[`${this._keyPrefix}detailViewLoaded`] || this._options.loadOnce !== !0)
      item[`${this._keyPrefix}detailContent`] = this._options?.preTemplate?.(item);
    else {
      this.onAsyncResponse.notify({
        item,
        itemDetail: item,
        detailView: item[`${this._keyPrefix}detailContent`]
      }, void 0, this), this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item);
      return;
    }
    this.applyTemplateNewLineHeight(item), this._dataView.updateItem(item[this._dataViewIdProperty], item), this._options.process(item);
  }
  /** Saves the current state of the detail view */
  saveDetailView(item) {
    let view = document.querySelector(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);
    if (view) {
      let html = view.innerHTML;
      html !== void 0 && (item[`${this._keyPrefix}detailContent`] = html);
    }
  }
  /**
   * subscribe to the onAsyncResponse so that the plugin knows when the user server side calls finished
   * the response has to be as "args.item" (or "args.itemDetail") with it's data back
   */
  subscribeToOnAsyncResponse() {
    this.onAsyncResponse.subscribe((e, args) => {
      if (!args || !args.item && !args.itemDetail)
        throw 'Slick.RowDetailView plugin requires the onAsyncResponse() to supply "args.item" property.';
      let itemDetail = args.item || args.itemDetail;
      args.detailView ? itemDetail[`${this._keyPrefix}detailContent`] = args.detailView : itemDetail[`${this._keyPrefix}detailContent`] = this._options?.postTemplate?.(itemDetail), itemDetail[`${this._keyPrefix}detailViewLoaded`] = !0, this._dataView.updateItem(itemDetail[this._dataViewIdProperty], itemDetail), this.onAsyncEndUpdate.notify({
        grid: this._grid,
        item: itemDetail,
        itemDetail
      }, e, this);
    });
  }
  /** When row is getting toggled, we will handle the action of collapsing/expanding */
  handleAccordionShowHide(item) {
    item && (item[`${this._keyPrefix}collapsed`] ? this.expandDetailView(item) : this.collapseDetailView(item));
  }
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  /** Get the Row Detail padding (which are the rows dedicated to the detail panel) */
  getPaddingItem(parent, offset) {
    let item = {};
    for (let prop in this._dataView)
      item[prop] = null;
    return item[this._dataViewIdProperty] = parent[this._dataViewIdProperty] + "." + offset, item[`${this._keyPrefix}collapsed`] = !0, item[`${this._keyPrefix}isPadding`] = !0, item[`${this._keyPrefix}parent`] = parent, item[`${this._keyPrefix}offset`] = offset, item;
  }
  /** Create the detail ctr node. this belongs to the dev & can be custom-styled as per */
  applyTemplateNewLineHeight(item) {
    let rowCount = this._options.panelRows, lineHeight = 13;
    item[`${this._keyPrefix}sizePadding`] = Math.ceil(rowCount * 2 * lineHeight / this._gridOptions.rowHeight), item[`${this._keyPrefix}height`] = item[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight;
    let idxParent = this._dataView.getIdxById(item[this._dataViewIdProperty]) ?? 0;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
      this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
  }
  /** Get the Column Definition of the first column dedicated to toggling the Row Detail View */
  getColumnDefinition() {
    return {
      id: this._options.columnId,
      name: "",
      toolTip: this._options.toolTip,
      field: "sel",
      width: this._options.width,
      resizable: !1,
      sortable: !1,
      alwaysRenderColumn: this._options.alwaysRenderColumn,
      cssClass: this._options.cssClass,
      formatter: this.detailSelectionFormatter.bind(this)
    };
  }
  /** Return the currently expanded rows */
  getExpandedRows() {
    return this._expandedRows;
  }
  /** The cell Formatter that shows the icon that will be used to toggle the Row Detail */
  detailSelectionFormatter(row, _cell, _val, _column, dataContext, grid) {
    if (this.checkExpandableOverride(row, dataContext, grid)) {
      if (dataContext[`${this._keyPrefix}collapsed`] === void 0 && (dataContext[`${this._keyPrefix}collapsed`] = !0, dataContext[`${this._keyPrefix}sizePadding`] = 0, dataContext[`${this._keyPrefix}height`] = 0, dataContext[`${this._keyPrefix}isPadding`] = !1, dataContext[`${this._keyPrefix}parent`] = void 0, dataContext[`${this._keyPrefix}offset`] = 0), !dataContext[`${this._keyPrefix}isPadding`])
        if (dataContext[`${this._keyPrefix}collapsed`]) {
          let collapsedClasses = this._options.cssClass + " expand ";
          return this._options.collapsedClass && (collapsedClasses += this._options.collapsedClass), '<div class="' + collapsedClasses + '"></div>';
        } else {
          let html = [], rowHeight = this._gridOptions.rowHeight, outterHeight = dataContext[`${this._keyPrefix}sizePadding`] * this._gridOptions.rowHeight;
          this._options.maxRows !== void 0 && dataContext[`${this._keyPrefix}sizePadding`] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, dataContext[`${this._keyPrefix}sizePadding`] = this._options.maxRows);
          let expandedClasses = this._options.cssClass + " collapse ";
          return this._options.expandedClass && (expandedClasses += this._options.expandedClass), html.push('<div class="' + expandedClasses + '"></div></div>'), html.push(`<div class="dynamic-cell-detail cellDetailView_${dataContext[this._dataViewIdProperty]}" `), html.push(`style="height: ${outterHeight}px;`), html.push(`top: ${rowHeight}px">`), html.push(`<div class="detail-container detailViewContainer_${dataContext[this._dataViewIdProperty]}">`), html.push(`<div class="innerDetailView_${dataContext[this._dataViewIdProperty]}">${dataContext[`${this._keyPrefix}detailContent`]}</div></div>`), html.join("");
        }
    } else
      return "";
    return "";
  }
  /** Resize the Row Detail View */
  resizeDetailView(item) {
    if (!item)
      return;
    let mainContainer = document.querySelector(`.${this._gridUid} .detailViewContainer_${item[this._dataViewIdProperty]}`), cellItem = document.querySelector(`.${this._gridUid} .cellDetailView_${item[this._dataViewIdProperty]}`), inner = document.querySelector(`.${this._gridUid} .innerDetailView_${item[this._dataViewIdProperty]}`);
    if (!mainContainer || !cellItem || !inner)
      return;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
      this._dataView.deleteItem(`${item[this._dataViewIdProperty]}.${idx}`);
    let rowHeight = this._gridOptions.rowHeight, lineHeight = 13;
    mainContainer.style.minHeight = "";
    let itemHeight = mainContainer.scrollHeight, rowCount = Math.ceil(itemHeight / rowHeight);
    item[`${this._keyPrefix}sizePadding`] = Math.ceil(rowCount * 2 * lineHeight / rowHeight), item[`${this._keyPrefix}height`] = itemHeight;
    let outterHeight = item[`${this._keyPrefix}sizePadding`] * rowHeight;
    this._options.maxRows !== void 0 && item[`${this._keyPrefix}sizePadding`] > this._options.maxRows && (outterHeight = this._options.maxRows * rowHeight, item[`${this._keyPrefix}sizePadding`] = this._options.maxRows), this._grid.getOptions().minRowBuffer < item[`${this._keyPrefix}sizePadding`] && (this._grid.getOptions().minRowBuffer = item[`${this._keyPrefix}sizePadding`] + 3), mainContainer.setAttribute("style", "min-height: " + item[`${this._keyPrefix}height`] + "px"), cellItem && cellItem.setAttribute("style", "height: " + outterHeight + "px; top:" + rowHeight + "px");
    let idxParent = this._dataView.getIdxById(item[this._dataViewIdProperty]) ?? 0;
    for (let idx = 1; idx <= item[`${this._keyPrefix}sizePadding`]; idx++)
      this._dataView.insertItem(idxParent + idx, this.getPaddingItem(item, idx));
    this.saveDetailView(item);
  }
  /** Takes in the item we are filtering and if it is an expanded row returns it's parents row to filter on */
  getFilterItem(item) {
    return item[`${this._keyPrefix}isPadding`] && item[`${this._keyPrefix}parent`] && (item = item[`${this._keyPrefix}parent`]), item;
  }
  checkExpandableOverride(row, dataContext, grid) {
    return typeof this._expandableOverride == "function" ? this._expandableOverride(row, dataContext, grid) : !0;
  }
  /**
   * Method that user can pass to override the default behavior or making every row an expandable row.
   * In order word, user can choose which rows to be an available row detail (or not) by providing his own logic.
   * @param overrideFn: override function callback
   */
  expandableOverride(overrideFn) {
    this._expandableOverride = overrideFn;
  }
};

// src/plugins/slick.rowmovemanager.ts
var SlickEvent17 = SlickEvent, SlickEventHandler9 = SlickEventHandler, Utils21 = Utils, SlickRowMoveManager = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "RowMoveManager");
    __publicField(this, "onBeforeMoveRows", new SlickEvent17());
    __publicField(this, "onMoveRows", new SlickEvent17());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_canvas");
    __publicField(this, "_dragging", !1);
    __publicField(this, "_eventHandler");
    __publicField(this, "_usabilityOverride");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      columnId: "_move",
      cssClass: void 0,
      cancelEditOnDrag: !1,
      disableRowSelection: !1,
      hideRowMoveShadow: !0,
      rowMoveShadowMarginTop: 0,
      rowMoveShadowMarginLeft: 0,
      rowMoveShadowOpacity: 0.95,
      rowMoveShadowScale: 0.75,
      singleRowMove: !1,
      width: 40
    });
    this._options = Utils21.extend(!0, {}, this._defaults, options), this._eventHandler = new SlickEventHandler9();
  }
  init(grid) {
    this._grid = grid, this._canvas = this._grid.getCanvasNode(), typeof this._options?.usabilityOverride == "function" && this.usabilityOverride(this._options.usabilityOverride), this._eventHandler.subscribe(this._grid.onDragInit, this.handleDragInit.bind(this)).subscribe(this._grid.onDragStart, this.handleDragStart.bind(this)).subscribe(this._grid.onDrag, this.handleDrag.bind(this)).subscribe(this._grid.onDragEnd, this.handleDragEnd.bind(this));
  }
  destroy() {
    this._eventHandler.unsubscribeAll();
  }
  setOptions(newOptions) {
    this._options = Utils21.extend({}, this._options, newOptions);
  }
  handleDragInit(e) {
    e.stopImmediatePropagation();
  }
  handleDragStart(e, dd) {
    let cell = this._grid.getCellFromEvent(e) || { cell: -1, row: -1 }, currentRow = cell?.row, dataContext = this._grid.getDataItem(currentRow);
    if (!this.checkUsabilityOverride(currentRow, dataContext, this._grid))
      return;
    if (this._options.cancelEditOnDrag && this._grid.getEditorLock().isActive() && this._grid.getEditorLock().cancelCurrentEdit(), this._grid.getEditorLock().isActive() || !this.isHandlerColumn(cell.cell))
      return !1;
    if (this._dragging = !0, e.stopImmediatePropagation(), !this._options.hideRowMoveShadow) {
      let slickRowElm = this._grid.getCellNode(cell.row, cell.cell)?.closest(".slick-row");
      slickRowElm && (dd.clonedSlickRow = slickRowElm.cloneNode(!0), dd.clonedSlickRow.classList.add("slick-reorder-shadow-row"), dd.clonedSlickRow.style.display = "none", dd.clonedSlickRow.style.marginLeft = Number(this._options.rowMoveShadowMarginLeft || 0) + "px", dd.clonedSlickRow.style.marginTop = Number(this._options.rowMoveShadowMarginTop || 0) + "px", dd.clonedSlickRow.style.opacity = `${this._options.rowMoveShadowOpacity || 0.95}`, dd.clonedSlickRow.style.transform = `scale(${this._options.rowMoveShadowScale || 0.75})`, this._canvas.appendChild(dd.clonedSlickRow));
    }
    let selectedRows = this._options.singleRowMove ? [cell.row] : this._grid.getSelectedRows();
    (selectedRows.length === 0 || !selectedRows.some((selectedRow) => selectedRow === cell.row)) && (selectedRows = [cell.row], this._options.disableRowSelection || this._grid.setSelectedRows(selectedRows));
    let rowHeight = this._grid.getOptions().rowHeight;
    dd.selectedRows = selectedRows, dd.selectionProxy = document.createElement("div"), dd.selectionProxy.className = "slick-reorder-proxy", dd.selectionProxy.style.display = "none", dd.selectionProxy.style.position = "absolute", dd.selectionProxy.style.zIndex = "99999", dd.selectionProxy.style.width = `${this._canvas.clientWidth}px`, dd.selectionProxy.style.height = `${rowHeight * selectedRows.length}px`, this._canvas.appendChild(dd.selectionProxy), dd.guide = document.createElement("div"), dd.guide.className = "slick-reorder-guide", dd.guide.style.position = "absolute", dd.guide.style.zIndex = "99999", dd.guide.style.width = `${this._canvas.clientWidth}px`, dd.guide.style.top = "-1000px", this._canvas.appendChild(dd.guide), dd.insertBefore = -1;
  }
  handleDrag(evt, dd) {
    if (!this._dragging)
      return;
    evt.stopImmediatePropagation();
    let e = evt.getNativeEvent(), top = (e?.touches?.[0] ?? e).pageY - (Utils21.offset(this._canvas)?.top ?? 0);
    dd.selectionProxy.style.top = `${top - 5}px`, dd.selectionProxy.style.display = "block", dd.clonedSlickRow && (dd.clonedSlickRow.style.top = `${top - 6}px`, dd.clonedSlickRow.style.display = "block");
    let insertBefore = Math.max(0, Math.min(Math.round(top / this._grid.getOptions().rowHeight), this._grid.getDataLength()));
    if (insertBefore !== dd.insertBefore) {
      let eventData = {
        grid: this._grid,
        rows: dd.selectedRows,
        insertBefore
      };
      if (this.onBeforeMoveRows.notify(eventData).getReturnValue() === !1 ? dd.canMove = !1 : dd.canMove = !0, this._usabilityOverride && dd.canMove) {
        let insertBeforeDataContext = this._grid.getDataItem(insertBefore);
        dd.canMove = this.checkUsabilityOverride(insertBefore, insertBeforeDataContext, this._grid);
      }
      dd.canMove ? dd.guide.style.top = `${insertBefore * (this._grid.getOptions().rowHeight || 0)}px` : dd.guide.style.top = "-1000px", dd.insertBefore = insertBefore;
    }
  }
  handleDragEnd(e, dd) {
    if (this._dragging && (this._dragging = !1, e.stopImmediatePropagation(), dd.guide?.remove(), dd.selectionProxy?.remove(), dd.clonedSlickRow?.remove(), dd.canMove)) {
      let eventData = {
        grid: this._grid,
        rows: dd.selectedRows,
        insertBefore: dd.insertBefore
      };
      this.onMoveRows.notify(eventData);
    }
  }
  getColumnDefinition() {
    return {
      id: String(this._options?.columnId ?? this._defaults.columnId),
      name: "",
      field: "move",
      behavior: "selectAndMove",
      excludeFromColumnPicker: !0,
      excludeFromGridMenu: !0,
      excludeFromHeaderMenu: !0,
      resizable: !1,
      selectable: !1,
      width: this._options.width || 40,
      formatter: this.moveIconFormatter.bind(this)
    };
  }
  moveIconFormatter(row, _cell, _val, _column, dataContext, grid) {
    if (this.checkUsabilityOverride(row, dataContext, grid)) {
      let iconElm = document.createElement("div");
      return iconElm.className = this._options.cssClass || "", {
        addClasses: `cell-reorder dnd ${this._options.containerCssClass || ""}`,
        html: iconElm
      };
    } else
      return "";
  }
  checkUsabilityOverride(row, dataContext, grid) {
    return typeof this._usabilityOverride == "function" ? this._usabilityOverride(row, dataContext, grid) : !0;
  }
  /**
   * Method that user can pass to override the default behavior or making every row moveable.
   * In order word, user can choose which rows to be an available as moveable (or not) by providing his own logic show/hide icon and usability.
   * @param overrideFn: override function callback
   */
  usabilityOverride(overrideFn) {
    this._usabilityOverride = overrideFn;
  }
  isHandlerColumn(columnIndex) {
    return /move|selectAndMove/.test(this._grid.getColumns()[+columnIndex].behavior || "");
  }
};

// src/plugins/slick.rowselectionmodel.ts
var Draggable3 = Draggable, keyCode3 = keyCode, SlickCellRangeDecorator3 = SlickCellRangeDecorator, SlickCellRangeSelector3 = SlickCellRangeSelector, SlickEvent18 = SlickEvent, SlickEventData6 = SlickEventData, SlickEventHandler10 = SlickEventHandler, SlickRange6 = SlickRange, Utils22 = Utils, SlickRowSelectionModel = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "RowSelectionModel");
    __publicField(this, "onSelectedRangesChanged", new SlickEvent18());
    // _handler, _inHandler, _isRowMoveManagerHandler, _options, wrapHandler
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_ranges", []);
    __publicField(this, "_eventHandler", new SlickEventHandler10());
    __publicField(this, "_inHandler", !1);
    __publicField(this, "_selector");
    __publicField(this, "_isRowMoveManagerHandler");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      selectActiveRow: !0,
      dragToSelect: !1,
      autoScrollWhenDrag: !0,
      cellRangeSelector: void 0
    });
    this._options = Utils22.extend(!0, {}, this._defaults, options);
  }
  init(grid) {
    if (Draggable3 === void 0)
      throw new Error('Slick.Draggable is undefined, make sure to import "slick.interactions.js"');
    if (this._selector = this._options.cellRangeSelector, this._grid = grid, !this._selector && this._options.dragToSelect) {
      if (!SlickCellRangeDecorator3)
        throw new Error("Slick.CellRangeDecorator is required when option dragToSelect set to true");
      this._selector = new SlickCellRangeSelector3({
        selectionCss: { border: "none" },
        autoScroll: this._options.autoScrollWhenDrag
      });
    }
    this._eventHandler.subscribe(this._grid.onActiveCellChanged, this.wrapHandler(this.handleActiveCellChange).bind(this)), this._eventHandler.subscribe(this._grid.onKeyDown, this.wrapHandler(this.handleKeyDown).bind(this)), this._eventHandler.subscribe(this._grid.onClick, this.wrapHandler(this.handleClick).bind(this)), this._selector && (grid.registerPlugin(this._selector), this._selector.onCellRangeSelecting.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.subscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.subscribe(this.handleBeforeCellRangeSelected.bind(this)));
  }
  destroy() {
    this._eventHandler.unsubscribeAll(), this._selector && (this._selector.onCellRangeSelecting.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onCellRangeSelected.unsubscribe(this.handleCellRangeSelected.bind(this)), this._selector.onBeforeCellRangeSelected.unsubscribe(this.handleBeforeCellRangeSelected.bind(this)), this._grid.unregisterPlugin(this._selector), this._selector.destroy && this._selector.destroy());
  }
  wrapHandler(handler) {
    return (...args) => {
      this._inHandler || (this._inHandler = !0, handler.apply(this, args), this._inHandler = !1);
    };
  }
  rangesToRows(ranges) {
    let rows = [];
    for (let i = 0; i < ranges.length; i++)
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++)
        rows.push(j);
    return rows;
  }
  rowsToRanges(rows) {
    let ranges = [], lastCell = this._grid.getColumns().length - 1;
    for (let i = 0; i < rows.length; i++)
      ranges.push(new SlickRange6(rows[i], 0, rows[i], lastCell));
    return ranges;
  }
  getRowsRange(from, to) {
    let i, rows = [];
    for (i = from; i <= to; i++)
      rows.push(i);
    for (i = to; i < from; i++)
      rows.push(i);
    return rows;
  }
  getSelectedRows() {
    return this.rangesToRows(this._ranges);
  }
  setSelectedRows(rows) {
    this.setSelectedRanges(this.rowsToRanges(rows), "SlickRowSelectionModel.setSelectedRows");
  }
  setSelectedRanges(ranges, caller = "SlickRowSelectionModel.setSelectedRanges") {
    if ((!this._ranges || this._ranges.length === 0) && (!ranges || ranges.length === 0))
      return;
    this._ranges = ranges;
    let eventData = new SlickEventData6(null, this._ranges);
    Object.defineProperty(eventData, "detail", { writable: !0, configurable: !0, value: { caller: caller || "SlickRowSelectionModel.setSelectedRanges" } }), this.onSelectedRangesChanged.notify(this._ranges, eventData);
  }
  getSelectedRanges() {
    return this._ranges;
  }
  refreshSelections() {
    this.setSelectedRows(this.getSelectedRows());
  }
  handleActiveCellChange(_e, args) {
    this._options.selectActiveRow && Utils22.isDefined(args.row) && this.setSelectedRanges([new SlickRange6(args.row, 0, args.row, this._grid.getColumns().length - 1)]);
  }
  handleKeyDown(e) {
    let activeRow = this._grid.getActiveCell();
    if (this._grid.getOptions().multiSelect && activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which === keyCode3.UP || e.which === keyCode3.DOWN)) {
      let selectedRows = this.getSelectedRows();
      selectedRows.sort(function(x, y) {
        return x - y;
      }), selectedRows.length || (selectedRows = [activeRow.row]);
      let top = selectedRows[0], bottom = selectedRows[selectedRows.length - 1], active;
      if (e.which === keyCode3.DOWN ? active = activeRow.row < bottom || top === bottom ? ++bottom : ++top : active = activeRow.row < bottom ? --bottom : --top, active >= 0 && active < this._grid.getDataLength()) {
        this._grid.scrollRowIntoView(active);
        let tempRanges = this.rowsToRanges(this.getRowsRange(top, bottom));
        this.setSelectedRanges(tempRanges);
      }
      e.preventDefault(), e.stopPropagation();
    }
  }
  handleClick(e) {
    let cell = this._grid.getCellFromEvent(e);
    if (!cell || !this._grid.canCellBeActive(cell.row, cell.cell) || !this._grid.getOptions().multiSelect || !e.ctrlKey && !e.shiftKey && !e.metaKey)
      return !1;
    let selection = this.rangesToRows(this._ranges), idx = selection.indexOf(cell.row);
    if (idx === -1 && (e.ctrlKey || e.metaKey))
      selection.push(cell.row), this._grid.setActiveCell(cell.row, cell.cell);
    else if (idx !== -1 && (e.ctrlKey || e.metaKey))
      selection = selection.filter((o) => o !== cell.row), this._grid.setActiveCell(cell.row, cell.cell);
    else if (selection.length && e.shiftKey) {
      let last = selection.pop(), from = Math.min(cell.row, last), to = Math.max(cell.row, last);
      selection = [];
      for (let i = from; i <= to; i++)
        i !== last && selection.push(i);
      selection.push(last), this._grid.setActiveCell(cell.row, cell.cell);
    }
    let tempRanges = this.rowsToRanges(selection);
    return this.setSelectedRanges(tempRanges), e.stopImmediatePropagation(), !0;
  }
  handleBeforeCellRangeSelected(e, cell) {
    if (!this._isRowMoveManagerHandler) {
      let rowMoveManager = this._grid.getPluginByName("RowMoveManager") || this._grid.getPluginByName("CrossGridRowMoveManager");
      this._isRowMoveManagerHandler = rowMoveManager ? rowMoveManager.isHandlerColumn : Utils22.noop;
    }
    if (this._grid.getEditorLock().isActive() || this._isRowMoveManagerHandler(cell.cell))
      return e.stopPropagation(), !1;
    this._grid.setActiveCell(cell.row, cell.cell);
  }
  handleCellRangeSelected(_e, args) {
    if (!this._grid.getOptions().multiSelect || !this._options.selectActiveRow)
      return !1;
    this.setSelectedRanges([new SlickRange6(args.range.fromRow, 0, args.range.toRow, this._grid.getColumns().length - 1)]);
  }
};

// src/plugins/slick.state.ts
var SlickEvent19 = SlickEvent, Utils23 = Utils, LocalStorageWrapper = class {
  constructor() {
    __publicField(this, "localStorage", window.localStorage);
    typeof localStorage > "u" && console.error("localStorage is not available. slickgrid statepersistor disabled.");
  }
  get(key) {
    return new Promise((resolve, reject) => {
      if (!localStorage) {
        reject("missing localStorage");
        return;
      }
      try {
        let d = localStorage.getItem(key);
        if (d)
          return resolve(JSON.parse(d));
        resolve({});
      } catch (exc) {
        reject(exc);
      }
    });
  }
  set(key, obj) {
    localStorage && (typeof obj < "u" && (obj = JSON.stringify(obj)), localStorage.setItem(key, obj));
  }
}, SlickState = class {
  constructor(options) {
    // --
    // public API
    __publicField(this, "pluginName", "State");
    __publicField(this, "onStateChanged", new SlickEvent19());
    // --
    // protected props
    __publicField(this, "_grid");
    __publicField(this, "_cid", "");
    __publicField(this, "_store");
    __publicField(this, "_options");
    __publicField(this, "_state");
    __publicField(this, "_userData", {
      state: null,
      current: null
    });
    let defaults = {
      key_prefix: "slickgrid:",
      storage: new LocalStorageWrapper(),
      scrollRowIntoView: !0
    };
    this._options = Utils23.extend(!0, {}, defaults, options), this._store = this._options.storage;
  }
  init(grid) {
    this._grid = grid, this._cid = grid.cid || this._options.cid, this._cid ? (this._grid.onColumnsResized.subscribe(this.save.bind(this)), this._grid.onColumnsReordered.subscribe(this.save.bind(this)), this._grid.onSort.subscribe(this.save.bind(this))) : console.warn("grid has no client id. state persisting is disabled.");
  }
  destroy() {
    this._grid.onSort.unsubscribe(this.save.bind(this)), this._grid.onColumnsReordered.unsubscribe(this.save.bind(this)), this._grid.onColumnsResized.unsubscribe(this.save.bind(this)), this.save();
  }
  save() {
    if (this._cid && this._store)
      return this._state = {
        sortcols: this.getSortColumns(),
        viewport: this._grid.getViewport(),
        columns: this.getColumns(),
        userData: null
      }, this._state.userData = this._userData.current, this.setUserDataFromState(this._state.userData), this.onStateChanged.notify(this._state), this._store.set(this._options.key_prefix + this._cid, this._state);
  }
  restore() {
    return new Promise((resolve, reject) => {
      if (!this._cid) {
        reject("missing client id");
        return;
      }
      if (!this._store) {
        reject("missing store");
        return;
      }
      this._store.get(this._options.key_prefix + this._cid).then((state) => {
        if (state) {
          if (state.sortcols && this._grid.setSortColumns(state.sortcols || []), state.viewport && this._options.scrollRowIntoView && this._grid.scrollRowIntoView(state.viewport.top, !0), state.columns) {
            let defaultColumns = this._options.defaultColumns;
            if (defaultColumns) {
              let defaultColumnsLookup = {};
              defaultColumns.forEach((colDef) => defaultColumnsLookup[colDef.id] = colDef);
              let cols = [];
              (state.columns || []).forEach((columnDef) => {
                defaultColumnsLookup[columnDef.id] && cols.push(Utils23.extend(!0, {}, defaultColumnsLookup[columnDef.id], {
                  width: columnDef.width,
                  headerCssClass: columnDef.headerCssClass
                }));
              }), state.columns = cols;
            }
            this._grid.setColumns(state.columns);
          }
          this.setUserDataFromState(state.userData);
        }
        resolve(state);
      }).catch((e) => {
        reject(e);
      });
    });
  }
  /**
   * allows users to add their own data to the grid state
   * this function does not trigger the save() function, so the actual act of writing the state happens in save()
   * therefore, it's necessary to call save() function after setting user-data
   *
   * @param data
   * @return {State}
   */
  setUserData(data) {
    return this._userData.current = data, this;
  }
  /**
   *
   * @internal
   * @param data
   * @return {State}
   */
  setUserDataFromState(data) {
    return this._userData.state = data, this.setUserData(data);
  }
  /**
   * returns current value of user-data
   * @return {Object}
   */
  getUserData() {
    return this._userData.current;
  }
  /**
   * returns user-data found in saved state
   *
   * @return {Object}
   */
  getStateUserData() {
    return this._userData.state;
  }
  /**
   * Sets user-data to the value read from state
   * @return {State}
   */
  resetUserData() {
    return this._userData.current = this._userData.state, this;
  }
  getColumns() {
    return this._grid.getColumns().map((col) => ({
      id: col.id,
      width: col.width
    }));
  }
  getSortColumns() {
    return this._grid.getSortColumns();
  }
  reset() {
    this._store.set(this._options.key_prefix + this._cid, {}), this.setUserDataFromState(null);
  }
};

// src/slick.compositeeditor.ts
function SlickCompositeEditor(columns, containers, options) {
  let defaultOptions = {
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
  }, noop = function() {
  }, firstInvalidEditor = null;
  options = Slick.Utils.extend({}, defaultOptions, options);
  function getContainerBox(i) {
    let c = containers[i], offset = Slick.Utils.offset(c), w = Slick.Utils.width(c), h = Slick.Utils.height(c);
    return {
      top: offset?.top ?? 0,
      left: offset?.left ?? 0,
      bottom: (offset?.top ?? 0) + (h || 0),
      right: (offset?.left ?? 0) + (w || 0),
      width: w,
      height: h,
      visible: !0
    };
  }
  function editor(args) {
    let context = this, editors = [];
    function init() {
      let newArgs = {}, idx = 0;
      for (; idx < columns.length; ) {
        if (columns[idx].editor) {
          let column = columns[idx];
          newArgs = Slick.Utils.extend(!1, {}, args), newArgs.container = containers[idx], newArgs.column = column, newArgs.position = getContainerBox(idx), newArgs.commitChanges = noop, newArgs.cancelChanges = noop, newArgs.compositeEditorOptions = options, newArgs.formValues = {};
          let currentEditor = new column.editor(newArgs);
          options.editors[column.id] = currentEditor, editors.push(currentEditor);
        }
        idx++;
      }
      setTimeout(function() {
        Array.isArray(editors) && editors.length > 0 && typeof editors[0].focus == "function" && editors[0].focus();
      }, 0);
    }
    context.destroy = () => {
      let idx = 0;
      for (; idx < editors.length; )
        editors[idx].destroy(), idx++;
      options.destroy?.(), editors = [];
    }, context.focus = () => {
      (firstInvalidEditor || editors[0]).focus();
    }, context.isValueChanged = () => {
      let idx = 0;
      for (; idx < editors.length; ) {
        if (editors[idx].isValueChanged())
          return !0;
        idx++;
      }
      return !1;
    }, context.serializeValue = () => {
      let serializedValue = [], idx = 0;
      for (; idx < editors.length; )
        serializedValue[idx] = editors[idx].serializeValue(), idx++;
      return serializedValue;
    }, context.applyValue = (item, state) => {
      let idx = 0;
      for (; idx < editors.length; )
        editors[idx].applyValue(item, state[idx]), idx++;
    }, context.loadValue = (item) => {
      let idx = 0;
      for (; idx < editors.length; )
        editors[idx].loadValue(item), idx++;
    }, context.validate = (target) => {
      let validationResults, errors = [], targetElm = target || null;
      firstInvalidEditor = null;
      let idx = 0;
      for (; idx < editors.length; ) {
        let columnDef = editors[idx].args?.column ?? {};
        if (columnDef) {
          let validationElm = document.querySelector(`.item-details-validation.editor-${columnDef.id}`), labelElm = document.querySelector(`.item-details-label.editor-${columnDef.id}`), editorElm = document.querySelector(`[data-editorid=${columnDef.id}]`), validationMsgPrefix = options?.validationMsgPrefix || "";
          (!targetElm || Slick.Utils.contains(editorElm, targetElm)) && (validationResults = editors[idx].validate(), validationResults.valid ? validationElm && (validationElm.textContent = "", editorElm?.classList.remove("invalid"), labelElm?.classList.remove("invalid")) : (firstInvalidEditor = editors[idx], errors.push({
            index: idx,
            editor: editors[idx],
            container: containers[idx],
            msg: validationResults.msg
          }), validationElm && (validationElm.textContent = validationMsgPrefix + validationResults.msg, labelElm?.classList.add("invalid"), editorElm?.classList.add("invalid")))), validationElm = null, labelElm = null, editorElm = null;
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
    }, context.hide = () => {
      let idx = 0;
      for (; idx < editors.length; )
        editors[idx]?.hide?.(), idx++;
      options?.hide?.();
    }, context.show = () => {
      let idx = 0;
      for (; idx < editors.length; )
        editors[idx]?.show?.(), idx++;
      options?.show?.();
    }, context.position = (box) => {
      options?.position?.(box);
    }, init();
  }
  return editor.prototype = this, editor;
}

// src/slick.groupitemmetadataprovider.ts
var keyCode4 = keyCode, SlickGroup2 = SlickGroup, Utils24 = Utils, SlickGroupItemMetadataProvider = class {
  constructor(inputOptions) {
    __publicField(this, "_grid");
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
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
      groupFormatter: this.defaultGroupCellFormatter.bind(this),
      totalsFormatter: this.defaultTotalsCellFormatter.bind(this),
      includeHeaderTotals: !1
    });
    this._options = Utils24.extend(!0, {}, this._defaults, inputOptions);
  }
  /** Getter of SlickGrid DataView object */
  get dataView() {
    return this._grid?.getData?.() ?? {};
  }
  getOptions() {
    return this._options;
  }
  setOptions(inputOptions) {
    Utils24.extend(!0, this._options, inputOptions);
  }
  defaultGroupCellFormatter(_row, _cell, _value, _columnDef, item) {
    if (!this._options.enableExpandCollapse)
      return item.title;
    let indentation = `${item.level * 15}px`, toggleClass = item.collapsed ? this._options.toggleCollapsedCssClass : this._options.toggleExpandedCssClass, containerElm = document.createDocumentFragment();
    this._options.checkboxSelect && containerElm.appendChild(Utils24.createDomElement("span", { className: `${this._options.checkboxSelectCssClass} ${item.selectChecked ? "checked" : "unchecked"}` })), containerElm.appendChild(Utils24.createDomElement("span", {
      className: `${this._options.toggleCssClass} ${toggleClass}`,
      ariaExpanded: String(!item.collapsed),
      style: { marginLeft: indentation }
    }));
    let groupTitleElm = Utils24.createDomElement("span", { className: this._options.groupTitleCssClass || "" });
    return groupTitleElm.setAttribute("level", item.level), item.title instanceof HTMLElement ? groupTitleElm.appendChild(item.title) : this._grid.applyHtmlCode(groupTitleElm, item.title ?? ""), containerElm.appendChild(groupTitleElm), containerElm;
  }
  defaultTotalsCellFormatter(_row, _cell, _value, columnDef, item, grid) {
    return columnDef?.groupTotalsFormatter?.(item, columnDef, grid) ?? "";
  }
  init(grid) {
    this._grid = grid, this._grid.onClick.subscribe(this.handleGridClick.bind(this)), this._grid.onKeyDown.subscribe(this.handleGridKeyDown.bind(this));
  }
  destroy() {
    this._grid && (this._grid.onClick.unsubscribe(this.handleGridClick.bind(this)), this._grid.onKeyDown.unsubscribe(this.handleGridKeyDown.bind(this)));
  }
  handleGridClick(e, args) {
    let target = e.target, item = this._grid.getDataItem(args.row);
    if (item && item instanceof SlickGroup2 && target.classList.contains(this._options.toggleCssClass || "") && (this.handleDataViewExpandOrCollapse(item), e.stopImmediatePropagation(), e.preventDefault()), item && item instanceof SlickGroup2 && target.classList.contains(this._options.checkboxSelectCssClass || "")) {
      item.selectChecked = !item.selectChecked, target.classList.remove(item.selectChecked ? "unchecked" : "checked"), target.classList.add(item.selectChecked ? "checked" : "unchecked");
      let rowIndexes = this.dataView.mapItemsToRows(item.rows);
      (item.selectChecked ? this._options.checkboxSelectPlugin.selectRows : this._options.checkboxSelectPlugin.deSelectRows)(rowIndexes);
    }
  }
  // TODO:  add -/+ handling
  handleGridKeyDown(e) {
    if (this._options.enableExpandCollapse && e.which === keyCode4.SPACE) {
      let activeCell = this._grid.getActiveCell();
      if (activeCell) {
        let item = this._grid.getDataItem(activeCell.row);
        item && item instanceof SlickGroup2 && (this.handleDataViewExpandOrCollapse(item), e.stopImmediatePropagation(), e.preventDefault());
      }
    }
  }
  handleDataViewExpandOrCollapse(item) {
    let range = this._grid.getRenderedRange();
    this.dataView.setRefreshHints({
      ignoreDiffsBefore: range.top,
      ignoreDiffsAfter: range.bottom + 1
    }), item.collapsed ? this.dataView.expandGroup(item.groupingKey) : this.dataView.collapseGroup(item.groupingKey);
  }
  getGroupRowMetadata(item) {
    let groupLevel = item?.level;
    return {
      selectable: !1,
      focusable: this._options.groupFocusable,
      cssClasses: `${this._options.groupCssClass} slick-group-level-${groupLevel}`,
      formatter: this._options.includeHeaderTotals && this._options.totalsFormatter || void 0,
      columns: {
        0: {
          colspan: this._options.includeHeaderTotals ? "1" : "*",
          formatter: this._options.groupFormatter,
          editor: null
        }
      }
    };
  }
  getTotalsRowMetadata(item) {
    let groupLevel = item?.group?.level;
    return {
      selectable: !1,
      focusable: this._options.totalsFocusable,
      cssClasses: `${this._options.totalsCssClass} slick-group-level-${groupLevel}`,
      formatter: this._options.totalsFormatter,
      editor: null
    };
  }
};

// src/slick.dataview.ts
var SlickEvent20 = SlickEvent, SlickEventData7 = SlickEventData, SlickGroup3 = SlickGroup, SlickGroupTotals2 = SlickGroupTotals, Utils25 = Utils, SlickGroupItemMetadataProvider2 = SlickGroupItemMetadataProvider, SlickDataView = class {
  constructor(options) {
    __publicField(this, "defaults", {
      groupItemMetadataProvider: null,
      inlineFilters: !1,
      useCSPSafeFilter: !1
    });
    // private
    __publicField(this, "idProperty", "id");
    // property holding a unique row id
    __publicField(this, "items", []);
    // data by index
    __publicField(this, "rows", []);
    // data by row
    __publicField(this, "idxById", /* @__PURE__ */ new Map());
    // indexes by id
    __publicField(this, "rowsById");
    // rows by id; lazy-calculated
    __publicField(this, "filter", null);
    // filter function
    __publicField(this, "filterCSPSafe", null);
    // filter function
    __publicField(this, "updated", null);
    // updated item ids
    __publicField(this, "suspend", !1);
    // suspends the recalculation
    __publicField(this, "isBulkSuspend", !1);
    // delays protectedious operations like the
    // index update and delete to efficient
    // versions at endUpdate
    __publicField(this, "bulkDeleteIds", /* @__PURE__ */ new Map());
    __publicField(this, "sortAsc", !0);
    __publicField(this, "fastSortField");
    __publicField(this, "sortComparer");
    __publicField(this, "refreshHints", {});
    __publicField(this, "prevRefreshHints", {});
    __publicField(this, "filterArgs");
    __publicField(this, "filteredItems", []);
    __publicField(this, "compiledFilter");
    __publicField(this, "compiledFilterCSPSafe");
    __publicField(this, "compiledFilterWithCaching");
    __publicField(this, "compiledFilterWithCachingCSPSafe");
    __publicField(this, "filterCache", []);
    __publicField(this, "_grid");
    // grid object will be defined only after using "syncGridSelection()" method"
    // grouping
    __publicField(this, "groupingInfoDefaults", {
      getter: void 0,
      formatter: void 0,
      comparer: (a, b) => a.value === b.value ? 0 : a.value > b.value ? 1 : -1,
      predefinedValues: [],
      aggregators: [],
      aggregateEmpty: !1,
      aggregateCollapsed: !1,
      aggregateChildGroups: !1,
      collapsed: !1,
      displayTotalsRow: !0,
      lazyTotalsCalculation: !1
    });
    __publicField(this, "groupingInfos", []);
    __publicField(this, "groups", []);
    __publicField(this, "toggledGroupsByLevel", []);
    __publicField(this, "groupingDelimiter", ":|:");
    __publicField(this, "selectedRowIds", []);
    __publicField(this, "preSelectedRowIdsChangeFn");
    __publicField(this, "pagesize", 0);
    __publicField(this, "pagenum", 0);
    __publicField(this, "totalRows", 0);
    __publicField(this, "_options");
    // public events
    __publicField(this, "onBeforePagingInfoChanged", new SlickEvent20());
    __publicField(this, "onGroupExpanded", new SlickEvent20());
    __publicField(this, "onGroupCollapsed", new SlickEvent20());
    __publicField(this, "onPagingInfoChanged", new SlickEvent20());
    __publicField(this, "onRowCountChanged", new SlickEvent20());
    __publicField(this, "onRowsChanged", new SlickEvent20());
    __publicField(this, "onRowsOrCountChanged", new SlickEvent20());
    __publicField(this, "onSelectedRowIdsChanged", new SlickEvent20());
    __publicField(this, "onSetItemsCalled", new SlickEvent20());
    this._options = Utils25.extend(!0, {}, this.defaults, options);
  }
  /**
   * Begins a bached update of the items in the data view.
   * including deletes and the related events are postponed to the endUpdate call.
   * As certain operations are postponed during this update, some methods might not
   * deliver fully consistent information.
   * @param {Boolean} [bulkUpdate] - if set to true, most data view modifications
   */
  beginUpdate(bulkUpdate) {
    this.suspend = !0, this.isBulkSuspend = bulkUpdate === !0;
  }
  endUpdate() {
    let wasBulkSuspend = this.isBulkSuspend;
    this.isBulkSuspend = !1, this.suspend = !1, wasBulkSuspend && (this.processBulkDelete(), this.ensureIdUniqueness()), this.refresh();
  }
  destroy() {
    this.items = [], this.idxById = null, this.rowsById = null, this.filter = null, this.filterCSPSafe = null, this.updated = null, this.sortComparer = null, this.filterCache = [], this.filteredItems = [], this.compiledFilter = null, this.compiledFilterCSPSafe = null, this.compiledFilterWithCaching = null, this.compiledFilterWithCachingCSPSafe = null, this._grid && this._grid.onSelectedRowsChanged && this._grid.onCellCssStylesChanged && (this._grid.onSelectedRowsChanged.unsubscribe(), this._grid.onCellCssStylesChanged.unsubscribe()), this.onRowsOrCountChanged && this.onRowsOrCountChanged.unsubscribe();
  }
  setRefreshHints(hints) {
    this.refreshHints = hints;
  }
  setFilterArgs(args) {
    this.filterArgs = args;
  }
  /**
   * Processes all delete requests placed during bulk update
   * by recomputing the items and idxById members.
   */
  processBulkDelete() {
    if (!this.idxById)
      return;
    let id, item, newIdx = 0;
    for (let i = 0, l = this.items.length; i < l; i++) {
      if (item = this.items[i], id = item[this.idProperty], id === void 0)
        throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
      this.bulkDeleteIds.has(id) ? this.idxById.delete(id) : (this.items[newIdx] = item, this.idxById.set(id, newIdx), ++newIdx);
    }
    this.items.length = newIdx, this.bulkDeleteIds = /* @__PURE__ */ new Map();
  }
  updateIdxById(startingIndex) {
    if (this.isBulkSuspend || !this.idxById)
      return;
    startingIndex = startingIndex || 0;
    let id;
    for (let i = startingIndex, l = this.items.length; i < l; i++) {
      if (id = this.items[i][this.idProperty], id === void 0)
        throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
      this.idxById.set(id, i);
    }
  }
  ensureIdUniqueness() {
    if (this.isBulkSuspend || !this.idxById)
      return;
    let id;
    for (let i = 0, l = this.items.length; i < l; i++)
      if (id = this.items[i][this.idProperty], id === void 0 || this.idxById.get(id) !== i)
        throw new Error("[SlickGrid DataView] Each data element must implement a unique 'id' property");
  }
  /** Get all DataView Items */
  getItems() {
    return this.items;
  }
  /** Get the DataView Id property name to use (defaults to "Id" but could be customized to something else when instantiating the DataView) */
  getIdPropertyName() {
    return this.idProperty;
  }
  /**
   * Set the Items with a new Dataset and optionally pass a different Id property name
   * @param {Array<*>} data - array of data
   * @param {String} [objectIdProperty] - optional id property to use as primary id
   */
  setItems(data, objectIdProperty) {
    objectIdProperty !== void 0 && (this.idProperty = objectIdProperty), this.items = this.filteredItems = data, this.onSetItemsCalled.notify({ idProperty: this.idProperty, itemCount: this.items.length }, null, this), this.idxById = /* @__PURE__ */ new Map(), this.updateIdxById(), this.ensureIdUniqueness(), this.refresh();
  }
  /** Set Paging Options */
  setPagingOptions(args) {
    this.onBeforePagingInfoChanged.notify(this.getPagingInfo(), null, this).getReturnValue() !== !1 && (Utils25.isDefined(args.pageSize) && (this.pagesize = args.pageSize, this.pagenum = this.pagesize ? Math.min(this.pagenum, Math.max(0, Math.ceil(this.totalRows / this.pagesize) - 1)) : 0), Utils25.isDefined(args.pageNum) && (this.pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(this.totalRows / this.pagesize) - 1))), this.onPagingInfoChanged.notify(this.getPagingInfo(), null, this), this.refresh());
  }
  /** Get Paging Options */
  getPagingInfo() {
    let totalPages = this.pagesize ? Math.max(1, Math.ceil(this.totalRows / this.pagesize)) : 1;
    return { pageSize: this.pagesize, pageNum: this.pagenum, totalRows: this.totalRows, totalPages, dataView: this };
  }
  /** Sort Method to use by the DataView */
  sort(comparer, ascending) {
    this.sortAsc = ascending, this.sortComparer = comparer, this.fastSortField = null, ascending === !1 && this.items.reverse(), this.items.sort(comparer), ascending === !1 && this.items.reverse(), this.idxById = /* @__PURE__ */ new Map(), this.updateIdxById(), this.refresh();
  }
  /**
   * Provides a workaround for the extremely slow sorting in IE.
   * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
   * to return the value of that field and then doing a native Array.sort().
   */
  fastSort(field, ascending) {
    this.sortAsc = ascending, this.fastSortField = field, this.sortComparer = null;
    let oldToString = Object.prototype.toString;
    Object.prototype.toString = typeof field == "function" ? field : function() {
      return this[field];
    }, ascending === !1 && this.items.reverse(), this.items.sort(), Object.prototype.toString = oldToString, ascending === !1 && this.items.reverse(), this.idxById = /* @__PURE__ */ new Map(), this.updateIdxById(), this.refresh();
  }
  /** Re-Sort the dataset */
  reSort() {
    this.sortComparer ? this.sort(this.sortComparer, this.sortAsc) : this.fastSortField && this.fastSort(this.fastSortField, this.sortAsc);
  }
  /** Get only the DataView filtered items */
  getFilteredItems() {
    return this.filteredItems;
  }
  /** Get the array length (count) of only the DataView filtered items */
  getFilteredItemCount() {
    return this.filteredItems.length;
  }
  /** Get current Filter used by the DataView */
  getFilter() {
    return this._options.useCSPSafeFilter ? this.filterCSPSafe : this.filter;
  }
  /**
   * Set a Filter that will be used by the DataView
   * @param {Function} fn - filter callback function
   */
  setFilter(filterFn) {
    this.filterCSPSafe = filterFn, this.filter = filterFn, this._options.inlineFilters && (this.compiledFilterCSPSafe = this.compileFilterCSPSafe, this.compiledFilterWithCachingCSPSafe = this.compileFilterWithCachingCSPSafe, this.compiledFilter = this.compileFilter(this._options.useCSPSafeFilter), this.compiledFilterWithCaching = this.compileFilterWithCaching(this._options.useCSPSafeFilter)), this.refresh();
  }
  /** Get current Grouping info */
  getGrouping() {
    return this.groupingInfos;
  }
  /** Set some Grouping */
  setGrouping(groupingInfo) {
    this._options.groupItemMetadataProvider || (this._options.groupItemMetadataProvider = new SlickGroupItemMetadataProvider2()), this.groups = [], this.toggledGroupsByLevel = [], groupingInfo = groupingInfo || [], this.groupingInfos = groupingInfo instanceof Array ? groupingInfo : [groupingInfo];
    for (let i = 0; i < this.groupingInfos.length; i++) {
      let gi = this.groupingInfos[i] = Utils25.extend(!0, {}, this.groupingInfoDefaults, this.groupingInfos[i]);
      gi.getterIsAFn = typeof gi.getter == "function", gi.compiledAccumulators = [];
      let idx = gi.aggregators.length;
      for (; idx--; )
        gi.compiledAccumulators[idx] = this.compileAccumulatorLoop(gi.aggregators[idx]);
      this.toggledGroupsByLevel[i] = {};
    }
    this.refresh();
  }
  /** Get an item in the DataView by its row index */
  getItemByIdx(i) {
    return this.items[i];
  }
  /** Get row index in the DataView by its Id */
  getIdxById(id) {
    return this.idxById?.get(id);
  }
  ensureRowsByIdCache() {
    if (!this.rowsById) {
      this.rowsById = {};
      for (let i = 0, l = this.rows.length; i < l; i++)
        this.rowsById[this.rows[i][this.idProperty]] = i;
    }
  }
  /** Get row number in the grid by its item object */
  getRowByItem(item) {
    return this.ensureRowsByIdCache(), this.rowsById?.[item[this.idProperty]];
  }
  /** Get row number in the grid by its Id */
  getRowById(id) {
    return this.ensureRowsByIdCache(), this.rowsById?.[id];
  }
  /** Get an item in the DataView by its Id */
  getItemById(id) {
    return this.items[this.idxById.get(id)];
  }
  /** From the items array provided, return the mapped rows */
  mapItemsToRows(itemArray) {
    let rows = [];
    this.ensureRowsByIdCache();
    for (let i = 0, l = itemArray.length; i < l; i++) {
      let row = this.rowsById?.[itemArray[i][this.idProperty]];
      Utils25.isDefined(row) && (rows[rows.length] = row);
    }
    return rows;
  }
  /** From the Ids array provided, return the mapped rows */
  mapIdsToRows(idArray) {
    let rows = [];
    this.ensureRowsByIdCache();
    for (let i = 0, l = idArray.length; i < l; i++) {
      let row = this.rowsById?.[idArray[i]];
      Utils25.isDefined(row) && (rows[rows.length] = row);
    }
    return rows;
  }
  /** From the rows array provided, return the mapped Ids */
  mapRowsToIds(rowArray) {
    let ids = [];
    for (let i = 0, l = rowArray.length; i < l; i++)
      if (rowArray[i] < this.rows.length) {
        let rowItem = this.rows[rowArray[i]];
        ids[ids.length] = rowItem[this.idProperty];
      }
    return ids;
  }
  /**
   * Performs the update operations of a single item by id without
   * triggering any events or refresh operations.
   * @param id The new id of the item.
   * @param item The item which should be the new value for the given id.
   */
  updateSingleItem(id, item) {
    if (this.idxById) {
      if (!this.idxById.has(id))
        throw new Error("[SlickGrid DataView] Invalid id");
      if (id !== item[this.idProperty]) {
        let newId = item[this.idProperty];
        if (!Utils25.isDefined(newId))
          throw new Error("[SlickGrid DataView] Cannot update item to associate with a null id");
        if (this.idxById.has(newId))
          throw new Error("[SlickGrid DataView] Cannot update item to associate with a non-unique id");
        this.idxById.set(newId, this.idxById.get(id)), this.idxById.delete(id), this.updated?.[id] && delete this.updated[id], id = newId;
      }
      this.items[this.idxById.get(id)] = item, this.updated || (this.updated = {}), this.updated[id] = !0;
    }
  }
  /**
   * Updates a single item in the data view given the id and new value.
   * @param id The new id of the item.
   * @param item The item which should be the new value for the given id.
   */
  updateItem(id, item) {
    this.updateSingleItem(id, item), this.refresh();
  }
  /**
   * Updates multiple items in the data view given the new ids and new values.
   * @param id {Array} The array of new ids which is in the same order as the items.
   * @param newItems {Array} The new items that should be set in the data view for the given ids.
   */
  updateItems(ids, newItems) {
    if (ids.length !== newItems.length)
      throw new Error("[SlickGrid DataView] Mismatch on the length of ids and items provided to update");
    for (let i = 0, l = newItems.length; i < l; i++)
      this.updateSingleItem(ids[i], newItems[i]);
    this.refresh();
  }
  /**
   * Inserts a single item into the data view at the given position.
   * @param insertBefore {Number} The 0-based index before which the item should be inserted.
   * @param item The item to insert.
   */
  insertItem(insertBefore, item) {
    this.items.splice(insertBefore, 0, item), this.updateIdxById(insertBefore), this.refresh();
  }
  /**
   * Inserts multiple items into the data view at the given position.
   * @param insertBefore {Number} The 0-based index before which the items should be inserted.
   * @param newItems {Array}  The items to insert.
   */
  insertItems(insertBefore, newItems) {
    Array.prototype.splice.apply(this.items, [insertBefore, 0].concat(newItems)), this.updateIdxById(insertBefore), this.refresh();
  }
  /**
   * Adds a single item at the end of the data view.
   * @param item The item to add at the end.
   */
  addItem(item) {
    this.items.push(item), this.updateIdxById(this.items.length - 1), this.refresh();
  }
  /**
   * Adds multiple items at the end of the data view.
   * @param {Array} newItems The items to add at the end.
   */
  addItems(newItems) {
    this.items = this.items.concat(newItems), this.updateIdxById(this.items.length - newItems.length), this.refresh();
  }
  /**
   * Deletes a single item identified by the given id from the data view.
   * @param {String|Number} id The id identifying the object to delete.
   */
  deleteItem(id) {
    if (this.idxById)
      if (this.isBulkSuspend)
        this.bulkDeleteIds.set(id, !0);
      else {
        let idx = this.idxById.get(id);
        if (idx === void 0)
          throw new Error("[SlickGrid DataView] Invalid id");
        this.idxById.delete(id), this.items.splice(idx, 1), this.updateIdxById(idx), this.refresh();
      }
  }
  /**
   * Deletes multiple item identified by the given ids from the data view.
   * @param {Array} ids The ids of the items to delete.
   */
  deleteItems(ids) {
    if (!(ids.length === 0 || !this.idxById))
      if (this.isBulkSuspend)
        for (let i = 0, l = ids.length; i < l; i++) {
          let id = ids[i];
          if (this.idxById.get(id) === void 0)
            throw new Error("[SlickGrid DataView] Invalid id");
          this.bulkDeleteIds.set(id, !0);
        }
      else {
        let indexesToDelete = [];
        for (let i = 0, l = ids.length; i < l; i++) {
          let id = ids[i], idx = this.idxById.get(id);
          if (idx === void 0)
            throw new Error("[SlickGrid DataView] Invalid id");
          this.idxById.delete(id), indexesToDelete.push(idx);
        }
        indexesToDelete.sort();
        for (let i = indexesToDelete.length - 1; i >= 0; --i)
          this.items.splice(indexesToDelete[i], 1);
        this.updateIdxById(indexesToDelete[0]), this.refresh();
      }
  }
  /** Add an item in a sorted dataset (a Sort function must be defined) */
  sortedAddItem(item) {
    if (!this.sortComparer)
      throw new Error("[SlickGrid DataView] sortedAddItem() requires a sort comparer, use sort()");
    this.insertItem(this.sortedIndex(item), item);
  }
  /** Update an item in a sorted dataset (a Sort function must be defined) */
  sortedUpdateItem(id, item) {
    if (!this.idxById)
      return;
    if (!this.idxById.has(id) || id !== item[this.idProperty])
      throw new Error("[SlickGrid DataView] Invalid or non-matching id " + this.idxById.get(id));
    if (!this.sortComparer)
      throw new Error("[SlickGrid DataView] sortedUpdateItem() requires a sort comparer, use sort()");
    let oldItem = this.getItemById(id);
    this.sortComparer(oldItem, item) !== 0 ? (this.deleteItem(id), this.sortedAddItem(item)) : this.updateItem(id, item);
  }
  sortedIndex(searchItem) {
    let low = 0, high = this.items.length;
    for (; low < high; ) {
      let mid = low + high >>> 1;
      this.sortComparer(this.items[mid], searchItem) === -1 ? low = mid + 1 : high = mid;
    }
    return low;
  }
  /** Get item count, that is the full dataset lenght of the DataView */
  getItemCount() {
    return this.items.length;
  }
  /** Get row count (rows displayed in current page) */
  getLength() {
    return this.rows.length;
  }
  /** Retrieve an item from the DataView at specific index */
  getItem(i) {
    let item = this.rows[i];
    if (item?.__group && item.totals && !item.totals?.initialized) {
      let gi = this.groupingInfos[item.level];
      gi.displayTotalsRow || (this.calculateTotals(item.totals), item.title = gi.formatter ? gi.formatter(item) : item.value);
    } else
      item?.__groupTotals && !item.initialized && this.calculateTotals(item);
    return item;
  }
  getItemMetadata(i) {
    let item = this.rows[i];
    return item === void 0 ? null : item.__group ? this._options.groupItemMetadataProvider.getGroupRowMetadata(item) : item.__groupTotals ? this._options.groupItemMetadataProvider.getTotalsRowMetadata(item) : null;
  }
  expandCollapseAllGroups(level, collapse) {
    if (Utils25.isDefined(level))
      this.toggledGroupsByLevel[level] = {}, this.groupingInfos[level].collapsed = collapse, collapse === !0 ? this.onGroupCollapsed.notify({ level, groupingKey: null }) : this.onGroupExpanded.notify({ level, groupingKey: null });
    else
      for (let i = 0; i < this.groupingInfos.length; i++)
        this.toggledGroupsByLevel[i] = {}, this.groupingInfos[i].collapsed = collapse, collapse === !0 ? this.onGroupCollapsed.notify({ level: i, groupingKey: null }) : this.onGroupExpanded.notify({ level: i, groupingKey: null });
    this.refresh();
  }
  /**
   * @param {Number} [level] Optional level to collapse.  If not specified, applies to all levels.
   */
  collapseAllGroups(level) {
    this.expandCollapseAllGroups(level, !0);
  }
  /**
   * @param {Number} [level] Optional level to expand.  If not specified, applies to all levels.
   */
  expandAllGroups(level) {
    this.expandCollapseAllGroups(level, !1);
  }
  expandCollapseGroup(level, groupingKey, collapse) {
    this.toggledGroupsByLevel[level][groupingKey] = this.groupingInfos[level].collapsed ^ collapse, this.refresh();
  }
  /**
   * @param varArgs Either a Slick.Group's "groupingKey" property, or a
   *     variable argument list of grouping values denoting a unique path to the row.  For
   *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
   *     the 'high' group.
   */
  collapseGroup(...args) {
    let arg0 = Array.prototype.slice.call(args)[0], groupingKey, level;
    args.length === 1 && arg0.indexOf(this.groupingDelimiter) !== -1 ? (groupingKey = arg0, level = arg0.split(this.groupingDelimiter).length - 1) : (groupingKey = args.join(this.groupingDelimiter), level = args.length - 1), this.expandCollapseGroup(level, groupingKey, !0), this.onGroupCollapsed.notify({ level, groupingKey });
  }
  /**
   * @param varArgs Either a Slick.Group's "groupingKey" property, or a
   *     variable argument list of grouping values denoting a unique path to the row.  For
   *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
   *     the 'high' group.
   */
  expandGroup(...args) {
    let arg0 = Array.prototype.slice.call(args)[0], groupingKey, level;
    args.length === 1 && arg0.indexOf(this.groupingDelimiter) !== -1 ? (level = arg0.split(this.groupingDelimiter).length - 1, groupingKey = arg0) : (level = args.length - 1, groupingKey = args.join(this.groupingDelimiter)), this.expandCollapseGroup(level, groupingKey, !1), this.onGroupExpanded.notify({ level, groupingKey });
  }
  getGroups() {
    return this.groups;
  }
  extractGroups(rows, parentGroup) {
    let group, val, groups = [], groupsByVal = {}, r, level = parentGroup ? parentGroup.level + 1 : 0, gi = this.groupingInfos[level];
    for (let i = 0, l = gi.predefinedValues?.length ?? 0; i < l; i++)
      val = gi.predefinedValues?.[i], group = groupsByVal[val], group || (group = new SlickGroup3(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + this.groupingDelimiter : "") + val, groups[groups.length] = group, groupsByVal[val] = group);
    for (let i = 0, l = rows.length; i < l; i++)
      r = rows[i], val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter], group = groupsByVal[val], group || (group = new SlickGroup3(), group.value = val, group.level = level, group.groupingKey = (parentGroup ? parentGroup.groupingKey + this.groupingDelimiter : "") + val, groups[groups.length] = group, groupsByVal[val] = group), group.rows[group.count++] = r;
    if (level < this.groupingInfos.length - 1)
      for (let i = 0; i < groups.length; i++)
        group = groups[i], group.groups = this.extractGroups(group.rows, group);
    return groups.length && this.addTotals(groups, level), groups.sort(this.groupingInfos[level].comparer), groups;
  }
  calculateTotals(totals) {
    let group = totals.group, gi = this.groupingInfos[group.level ?? 0], isLeafLevel = group.level === this.groupingInfos.length, agg, idx = gi.aggregators.length;
    if (!isLeafLevel && gi.aggregateChildGroups) {
      let i = group.groups?.length ?? 0;
      for (; i--; )
        group.groups[i].totals.initialized || this.calculateTotals(group.groups[i].totals);
    }
    for (; idx--; )
      agg = gi.aggregators[idx], agg.init(), !isLeafLevel && gi.aggregateChildGroups ? gi.compiledAccumulators[idx].call(agg, group.groups) : gi.compiledAccumulators[idx].call(agg, group.rows), agg.storeResult(totals);
    totals.initialized = !0;
  }
  addGroupTotals(group) {
    let gi = this.groupingInfos[group.level], totals = new SlickGroupTotals2();
    totals.group = group, group.totals = totals, gi.lazyTotalsCalculation || this.calculateTotals(totals);
  }
  addTotals(groups, level) {
    level = level || 0;
    let gi = this.groupingInfos[level], groupCollapsed = gi.collapsed, toggledGroups = this.toggledGroupsByLevel[level], idx = groups.length, g;
    for (; idx--; )
      g = groups[idx], !(g.collapsed && !gi.aggregateCollapsed) && (g.groups && this.addTotals(g.groups, level + 1), gi.aggregators?.length && (gi.aggregateEmpty || g.rows.length || g.groups?.length) && this.addGroupTotals(g), g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey], g.title = gi.formatter ? gi.formatter(g) : g.value);
  }
  flattenGroupedRows(groups, level) {
    level = level || 0;
    let gi = this.groupingInfos[level], groupedRows = [], rows, gl = 0, g;
    for (let i = 0, l = groups.length; i < l; i++) {
      if (g = groups[i], groupedRows[gl++] = g, !g.collapsed) {
        rows = g.groups ? this.flattenGroupedRows(g.groups, level + 1) : g.rows;
        for (let j = 0, jj = rows.length; j < jj; j++)
          groupedRows[gl++] = rows[j];
      }
      g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed) && (groupedRows[gl++] = g.totals);
    }
    return groupedRows;
  }
  getFunctionInfo(fn) {
    let fnRegex = fn.toString().indexOf("function") >= 0 ? /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/ : /^[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/, matches = fn.toString().match(fnRegex) || [];
    return {
      params: matches[1].split(","),
      body: matches[2]
    };
  }
  compileAccumulatorLoop(aggregator) {
    if (aggregator.accumulate) {
      let accumulatorInfo = this.getFunctionInfo(aggregator.accumulate), fn = new Function(
        "_items",
        "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" + accumulatorInfo.params[0] + " = _items[_i]; " + accumulatorInfo.body + "}"
      ), fnName = "compiledAccumulatorLoop";
      return fn.displayName = fnName, fn.name = this.setFunctionName(fn, fnName), fn;
    } else
      return function() {
      };
  }
  compileFilterCSPSafe(items, args) {
    if (typeof this.filterCSPSafe != "function")
      return [];
    let _retval = [], _il = items.length;
    for (let _i = 0; _i < _il; _i++)
      this.filterCSPSafe(items[_i], args) && _retval.push(items[_i]);
    return _retval;
  }
  compileFilter(stopRunningIfCSPSafeIsActive = !1) {
    if (stopRunningIfCSPSafeIsActive)
      return null;
    let filterInfo = this.getFunctionInfo(this.filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
      /return ([^;}]+?)\s*([;}]|$)/gi,
      "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
    ), tpl = [
      // 'function(_items, _args) { ',
      "var _retval = [], _idx = 0; ",
      "var $item$, $args$ = _args; ",
      "_coreloop: ",
      "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
      "$item$ = _items[_i]; ",
      "$filter$; ",
      "} ",
      "return _retval; "
      // '}'
    ].join("");
    tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
    let fn = new Function("_items,_args", tpl), fnName = "compiledFilter";
    return fn.displayName = fnName, fn.name = this.setFunctionName(fn, fnName), fn;
  }
  compileFilterWithCaching(stopRunningIfCSPSafeIsActive = !1) {
    if (stopRunningIfCSPSafeIsActive)
      return null;
    let filterInfo = this.getFunctionInfo(this.filter), filterPath1 = "{ continue _coreloop; }$1", filterPath2 = "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1", filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(
      /return ([^;}]+?)\s*([;}]|$)/gi,
      "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"
    ), tpl = [
      // 'function(_items, _args, _cache) { ',
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
      // '}'
    ].join("");
    tpl = tpl.replace(/\$filter\$/gi, filterBody), tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]), tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
    let fn = new Function("_items,_args,_cache", tpl), fnName = "compiledFilterWithCaching";
    return fn.displayName = fnName, fn.name = this.setFunctionName(fn, fnName), fn;
  }
  compileFilterWithCachingCSPSafe(items, args, filterCache) {
    if (typeof this.filterCSPSafe != "function")
      return [];
    let retval = [], il = items.length;
    for (let _i = 0; _i < il; _i++)
      (filterCache[_i] || this.filterCSPSafe(items[_i], args)) && retval.push(items[_i]);
    return retval;
  }
  /**
   * In ES5 we could set the function name on the fly but in ES6 this is forbidden and we need to set it through differently
   * We can use Object.defineProperty and set it the property to writable, see MDN for reference
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
   * @param {*} fn
   * @param {string} fnName
   */
  setFunctionName(fn, fnName) {
    try {
      Object.defineProperty(fn, "name", {
        writable: !0,
        value: fnName
      });
    } catch {
      fn.name = fnName;
    }
  }
  uncompiledFilter(items, args) {
    let retval = [], idx = 0;
    for (let i = 0, ii = items.length; i < ii; i++)
      this.filter?.(items[i], args) && (retval[idx++] = items[i]);
    return retval;
  }
  uncompiledFilterWithCaching(items, args, cache) {
    let retval = [], idx = 0, item;
    for (let i = 0, ii = items.length; i < ii; i++)
      item = items[i], cache[i] ? retval[idx++] = item : this.filter?.(item, args) && (retval[idx++] = item, cache[i] = !0);
    return retval;
  }
  getFilteredAndPagedItems(items) {
    if (this._options.useCSPSafeFilter ? this.filterCSPSafe : this.filter) {
      let batchFilter, batchFilterWithCaching;
      this._options.useCSPSafeFilter ? (batchFilter = this._options.inlineFilters ? this.compiledFilterCSPSafe : this.uncompiledFilter, batchFilterWithCaching = this._options.inlineFilters ? this.compiledFilterWithCachingCSPSafe : this.uncompiledFilterWithCaching) : (batchFilter = this._options.inlineFilters ? this.compiledFilter : this.uncompiledFilter, batchFilterWithCaching = this._options.inlineFilters ? this.compiledFilterWithCaching : this.uncompiledFilterWithCaching), this.refreshHints.isFilterNarrowing ? this.filteredItems = batchFilter.call(this, this.filteredItems, this.filterArgs) : this.refreshHints.isFilterExpanding ? this.filteredItems = batchFilterWithCaching.call(this, items, this.filterArgs, this.filterCache) : this.refreshHints.isFilterUnchanged || (this.filteredItems = batchFilter.call(this, items, this.filterArgs));
    } else
      this.filteredItems = this.pagesize ? items : items.concat();
    let paged;
    return this.pagesize ? (this.filteredItems.length <= this.pagenum * this.pagesize && (this.filteredItems.length === 0 ? this.pagenum = 0 : this.pagenum = Math.floor((this.filteredItems.length - 1) / this.pagesize)), paged = this.filteredItems.slice(this.pagesize * this.pagenum, this.pagesize * this.pagenum + this.pagesize)) : paged = this.filteredItems, { totalRows: this.filteredItems.length, rows: paged };
  }
  getRowDiffs(rows, newRows) {
    let item, r, eitherIsNonData, diff = [], from = 0, to = Math.max(newRows.length, rows.length);
    this.refreshHints?.ignoreDiffsBefore && (from = Math.max(
      0,
      Math.min(newRows.length, this.refreshHints.ignoreDiffsBefore)
    )), this.refreshHints?.ignoreDiffsAfter && (to = Math.min(
      newRows.length,
      Math.max(0, this.refreshHints.ignoreDiffsAfter)
    ));
    for (let i = from, rl = rows.length; i < to; i++)
      i >= rl ? diff[diff.length] = i : (item = newRows[i], r = rows[i], (!item || this.groupingInfos.length && (eitherIsNonData = item.__nonDataRow || r.__nonDataRow) && item.__group !== r.__group || item.__group && !item.equals(r) || eitherIsNonData && // no good way to compare totals since they are arbitrary DTOs
      // deep object comparison is pretty expensive
      // always considering them 'dirty' seems easier for the time being
      (item.__groupTotals || r.__groupTotals) || item[this.idProperty] !== r[this.idProperty] || this.updated?.[item[this.idProperty]]) && (diff[diff.length] = i));
    return diff;
  }
  recalc(_items) {
    this.rowsById = void 0, (this.refreshHints.isFilterNarrowing !== this.prevRefreshHints.isFilterNarrowing || this.refreshHints.isFilterExpanding !== this.prevRefreshHints.isFilterExpanding) && (this.filterCache = []);
    let filteredItems = this.getFilteredAndPagedItems(_items);
    this.totalRows = filteredItems.totalRows;
    let newRows = filteredItems.rows;
    this.groups = [], this.groupingInfos.length && (this.groups = this.extractGroups(newRows), this.groups.length && (newRows = this.flattenGroupedRows(this.groups)));
    let diff = this.getRowDiffs(this.rows, newRows);
    return this.rows = newRows, diff;
  }
  refresh() {
    if (this.suspend)
      return;
    let previousPagingInfo = Utils25.extend(!0, {}, this.getPagingInfo()), countBefore = this.rows.length, totalRowsBefore = this.totalRows, diff = this.recalc(this.items);
    this.pagesize && this.totalRows < this.pagenum * this.pagesize && (this.pagenum = Math.max(0, Math.ceil(this.totalRows / this.pagesize) - 1), diff = this.recalc(this.items)), this.updated = null, this.prevRefreshHints = this.refreshHints, this.refreshHints = {}, totalRowsBefore !== this.totalRows && this.onBeforePagingInfoChanged.notify(previousPagingInfo, null, this).getReturnValue() !== !1 && this.onPagingInfoChanged.notify(this.getPagingInfo(), null, this), countBefore !== this.rows.length && this.onRowCountChanged.notify({ previous: countBefore, current: this.rows.length, itemCount: this.items.length, dataView: this, callingOnRowsChanged: diff.length > 0 }, null, this), diff.length > 0 && this.onRowsChanged.notify({ rows: diff, itemCount: this.items.length, dataView: this, calledOnRowCountChanged: countBefore !== this.rows.length }, null, this), (countBefore !== this.rows.length || diff.length > 0) && this.onRowsOrCountChanged.notify({
      rowsDiff: diff,
      previousRowCount: countBefore,
      currentRowCount: this.rows.length,
      itemCount: this.items.length,
      rowCountChanged: countBefore !== this.rows.length,
      rowsChanged: diff.length > 0,
      dataView: this
    }, null, this);
  }
  /**
   * Wires the grid and the DataView together to keep row selection tied to item ids.
   * This is useful since, without it, the grid only knows about rows, so if the items
   * move around, the same rows stay selected instead of the selection moving along
   * with the items.
   *
   * NOTE:  This doesn't work with cell selection model.
   *
   * @param {SlickGrid} grid - The grid to sync selection with.
   * @param {Boolean} preserveHidden - Whether to keep selected items that go out of the
   *     view due to them getting filtered out.
   * @param {Boolean} [preserveHiddenOnSelectionChange] - Whether to keep selected items
   *     that are currently out of the view (see preserveHidden) as selected when selection
   *     changes.
   * @return {Event} An event that notifies when an internal list of selected row ids
   *     changes.  This is useful since, in combination with the above two options, it allows
   *     access to the full list selected row ids, and not just the ones visible to the grid.
   * @method syncGridSelection
   */
  syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
    this._grid = grid;
    let inHandler;
    this.selectedRowIds = this.mapRowsToIds(grid.getSelectedRows());
    let setSelectedRowIds = (rowIds) => {
      rowIds === !1 ? this.selectedRowIds = [] : this.selectedRowIds.sort().join(",") !== rowIds.sort().join(",") && (this.selectedRowIds = rowIds);
    }, update = () => {
      if ((this.selectedRowIds || []).length > 0 && !inHandler) {
        inHandler = !0;
        let selectedRows = this.mapIdsToRows(this.selectedRowIds || []);
        if (!preserveHidden) {
          let selectedRowsChangedArgs = {
            grid: this._grid,
            ids: this.mapRowsToIds(selectedRows),
            rows: selectedRows,
            dataView: this
          };
          this.preSelectedRowIdsChangeFn(selectedRowsChangedArgs), this.onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
            selectedRowIds: this.selectedRowIds,
            filteredIds: this.getAllSelectedFilteredIds()
          }), new SlickEventData7(), this);
        }
        grid.setSelectedRows(selectedRows), inHandler = !1;
      }
    };
    return grid.onSelectedRowsChanged.subscribe((_e, args) => {
      if (!inHandler) {
        let newSelectedRowIds = this.mapRowsToIds(args.rows), selectedRowsChangedArgs = {
          grid: this._grid,
          ids: newSelectedRowIds,
          rows: args.rows,
          added: !0,
          dataView: this
        };
        this.preSelectedRowIdsChangeFn(selectedRowsChangedArgs), this.onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
          selectedRowIds: this.selectedRowIds,
          filteredIds: this.getAllSelectedFilteredIds()
        }), new SlickEventData7(), this);
      }
    }), this.preSelectedRowIdsChangeFn = (args) => {
      if (!inHandler) {
        if (inHandler = !0, typeof args.added > "u")
          setSelectedRowIds(args.ids);
        else {
          let rowIds;
          args.added ? preserveHiddenOnSelectionChange && grid.getOptions().multiSelect ? rowIds = (this.selectedRowIds?.filter((id) => this.getRowById(id) === void 0)).concat(args.ids) : rowIds = args.ids : preserveHiddenOnSelectionChange && grid.getOptions().multiSelect ? rowIds = this.selectedRowIds.filter((id) => args.ids.indexOf(id) === -1) : rowIds = [], setSelectedRowIds(rowIds);
        }
        inHandler = !1;
      }
    }, this.onRowsOrCountChanged.subscribe(update.bind(this)), this.onSelectedRowIdsChanged;
  }
  /**
   * Get all selected IDs
   * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
   */
  getAllSelectedIds() {
    return this.selectedRowIds;
  }
  /**
   * Get all selected filtered IDs (similar to "getAllSelectedIds" but only return filtered data)
   * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
   */
  getAllSelectedFilteredIds() {
    return this.getAllSelectedFilteredItems().map((item) => item[this.idProperty]);
  }
  /**
   * Set current row selected IDs array (regardless of Pagination)
   * NOTE: This will NOT change the selection in the grid, if you need to do that then you still need to call
   * "grid.setSelectedRows(rows)"
   * @param {Array} selectedIds - list of IDs which have been selected for this action
   * @param {Object} options
   *  - `isRowBeingAdded`: defaults to true, are the new selected IDs being added (or removed) as new row selections
   *  - `shouldTriggerEvent`: defaults to true, should we trigger `onSelectedRowIdsChanged` event
   *  - `applyRowSelectionToGrid`: defaults to true, should we apply the row selections to the grid in the UI
   */
  setSelectedIds(selectedIds, options) {
    let isRowBeingAdded = options?.isRowBeingAdded, shouldTriggerEvent = options?.shouldTriggerEvent, applyRowSelectionToGrid = options?.applyRowSelectionToGrid;
    isRowBeingAdded !== !1 && (isRowBeingAdded = !0);
    let selectedRows = this.mapIdsToRows(selectedIds), selectedRowsChangedArgs = {
      grid: this._grid,
      ids: selectedIds,
      rows: selectedRows,
      added: isRowBeingAdded,
      dataView: this
    };
    this.preSelectedRowIdsChangeFn?.(selectedRowsChangedArgs), shouldTriggerEvent !== !1 && this.onSelectedRowIdsChanged.notify(Object.assign(selectedRowsChangedArgs, {
      selectedRowIds: this.selectedRowIds,
      filteredIds: this.getAllSelectedFilteredIds()
    }), new SlickEventData7(), this), applyRowSelectionToGrid !== !1 && this._grid && this._grid.setSelectedRows(selectedRows);
  }
  /**
   * Get all selected dataContext items
   * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
   */
  getAllSelectedItems() {
    let selectedData = [];
    return this.getAllSelectedIds().forEach((id) => {
      selectedData.push(this.getItemById(id));
    }), selectedData;
  }
  /**
  * Get all selected filtered dataContext items (similar to "getAllSelectedItems" but only return filtered data)
  * Note: when using Pagination it will also include hidden selections assuming `preserveHiddenOnSelectionChange` is set to true.
  */
  getAllSelectedFilteredItems() {
    return Array.isArray(this.selectedRowIds) ? this.filteredItems.filter((a) => this.selectedRowIds.some((b) => a[this.idProperty] === b)) || [] : [];
  }
  syncGridCellCssStyles(grid, key) {
    let hashById, inHandler, storeCellCssStyles = (hash) => {
      hashById = {};
      for (let row in hash)
        if (hash) {
          let id = this.rows[row][this.idProperty];
          hashById[id] = hash[row];
        }
    };
    storeCellCssStyles(grid.getCellCssStyles(key));
    let update = () => {
      if (hashById) {
        inHandler = !0, this.ensureRowsByIdCache();
        let newHash = {};
        for (let id in hashById)
          if (hashById) {
            let row = this.rowsById?.[id];
            Utils25.isDefined(row) && (newHash[row] = hashById[id]);
          }
        grid.setCellCssStyles(key, newHash), inHandler = !1;
      }
    };
    grid.onCellCssStylesChanged.subscribe((_e, args) => {
      inHandler || key === args.key && (args.hash ? storeCellCssStyles(args.hash) : (grid.onCellCssStylesChanged.unsubscribe(), this.onRowsOrCountChanged.unsubscribe(update)));
    }), this.onRowsOrCountChanged.subscribe(update.bind(this));
  }
}, AvgAggregator = class {
  constructor(field) {
    __publicField(this, "_nonNullCount", 0);
    __publicField(this, "_sum", 0);
    __publicField(this, "_field");
    __publicField(this, "_type", "avg");
    this._field = field;
  }
  get field() {
    return this._field;
  }
  get type() {
    return this._type;
  }
  init() {
    this._nonNullCount = 0, this._sum = 0;
  }
  accumulate(item) {
    let val = item?.hasOwnProperty(this._field) ? item[this._field] : null;
    val !== null && val !== "" && !isNaN(val) && (this._nonNullCount++, this._sum += parseFloat(val));
  }
  storeResult(groupTotals) {
    (!groupTotals || groupTotals[this._type] === void 0) && (groupTotals[this._type] = {}), this._nonNullCount !== 0 && (groupTotals[this._type][this._field] = this._sum / this._nonNullCount);
  }
}, MinAggregator = class {
  constructor(field) {
    __publicField(this, "_min", null);
    __publicField(this, "_field");
    __publicField(this, "_type", "min");
    this._field = field;
  }
  get field() {
    return this._field;
  }
  get type() {
    return this._type;
  }
  init() {
    this._min = null;
  }
  accumulate(item) {
    let val = item?.hasOwnProperty(this._field) ? item[this._field] : null;
    val !== null && val !== "" && !isNaN(val) && (this._min === null || val < this._min) && (this._min = parseFloat(val));
  }
  storeResult(groupTotals) {
    (!groupTotals || groupTotals[this._type] === void 0) && (groupTotals[this._type] = {}), groupTotals[this._type][this._field] = this._min;
  }
}, MaxAggregator = class {
  constructor(field) {
    __publicField(this, "_max", null);
    __publicField(this, "_field");
    __publicField(this, "_type", "max");
    this._field = field;
  }
  get field() {
    return this._field;
  }
  get type() {
    return this._type;
  }
  init() {
    this._max = null;
  }
  accumulate(item) {
    let val = item?.hasOwnProperty(this._field) ? item[this._field] : null;
    val !== null && val !== "" && !isNaN(val) && (this._max === null || val > this._max) && (this._max = parseFloat(val));
  }
  storeResult(groupTotals) {
    (!groupTotals || groupTotals[this._type] === void 0) && (groupTotals[this._type] = {}), groupTotals[this._type][this._field] = this._max;
  }
}, SumAggregator = class {
  constructor(field) {
    __publicField(this, "_sum", 0);
    __publicField(this, "_field");
    __publicField(this, "_type", "sum");
    this._field = field;
  }
  get field() {
    return this._field;
  }
  get type() {
    return this._type;
  }
  init() {
    this._sum = 0;
  }
  accumulate(item) {
    let val = item?.hasOwnProperty(this._field) ? item[this._field] : null;
    val !== null && val !== "" && !isNaN(val) && (this._sum += parseFloat(val));
  }
  storeResult(groupTotals) {
    (!groupTotals || groupTotals[this._type] === void 0) && (groupTotals[this._type] = {}), groupTotals[this._type][this._field] = this._sum;
  }
}, CountAggregator = class {
  constructor(field) {
    __publicField(this, "_field");
    __publicField(this, "_type", "count");
    this._field = field;
  }
  get field() {
    return this._field;
  }
  get type() {
    return this._type;
  }
  init() {
  }
  storeResult(groupTotals) {
    (!groupTotals || groupTotals[this._type] === void 0) && (groupTotals[this._type] = {}), groupTotals[this._type][this._field] = groupTotals.group.rows.length;
  }
}, Aggregators = {
  Avg: AvgAggregator,
  Min: MinAggregator,
  Max: MaxAggregator,
  Sum: SumAggregator,
  Count: CountAggregator
};

// src/slick.editors.ts
var keyCode5 = keyCode, Utils26 = Utils, TextEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    __publicField(this, "navOnLR");
    this.init();
  }
  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils26.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  destroy() {
    this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
  }
  focus() {
    this.input.focus();
  }
  getValue() {
    return this.input.value;
  }
  setValue(val) {
    this.input.value = val;
  }
  loadValue(item) {
    this.defaultValue = item[this.args.column.field] || "", this.input.value = String(this.defaultValue ?? ""), this.input.defaultValue = String(this.defaultValue ?? ""), this.input.select();
  }
  serializeValue() {
    return this.input.value;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && this.input.value !== this.defaultValue;
  }
  validate() {
    if (this.args.column.validator) {
      let validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }
}, IntegerEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    __publicField(this, "navOnLR");
    this.init();
  }
  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils26.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  destroy() {
    this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
  }
  focus() {
    this.input.focus();
  }
  loadValue(item) {
    this.defaultValue = item[this.args.column.field], this.input.value = String(this.defaultValue ?? ""), this.input.defaultValue = String(this.defaultValue ?? ""), this.input.select();
  }
  serializeValue() {
    return parseInt(this.input.value, 10) || 0;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && this.input.value !== this.defaultValue;
  }
  validate() {
    if (isNaN(this.input.value))
      return {
        valid: !1,
        msg: "Please enter a valid integer"
      };
    if (this.args.column.validator) {
      let validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }
}, _FloatEditor = class _FloatEditor {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    __publicField(this, "navOnLR");
    this.init();
  }
  init() {
    this.navOnLR = this.args.grid.getOptions().editorCellNavOnLRKeys, this.input = Utils26.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.addEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.focus(), this.input.select(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  destroy() {
    this.input.removeEventListener("keydown", this.navOnLR ? handleKeydownLRNav : handleKeydownLRNoNav), this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
  }
  focus() {
    this.input.focus();
  }
  getDecimalPlaces() {
    let rtn = this.args.column.editorFixedDecimalPlaces;
    return Utils26.isDefined(rtn) || (rtn = _FloatEditor.DefaultDecimalPlaces), !rtn && rtn !== 0 ? null : rtn;
  }
  loadValue(item) {
    this.defaultValue = item[this.args.column.field];
    let decPlaces = this.getDecimalPlaces();
    decPlaces !== null && (this.defaultValue || this.defaultValue === 0) && this.defaultValue?.toFixed && (this.defaultValue = this.defaultValue.toFixed(decPlaces)), this.input.value = String(this.defaultValue ?? ""), this.input.defaultValue = String(this.defaultValue ?? ""), this.input.select();
  }
  serializeValue() {
    let rtn = parseFloat(this.input.value);
    _FloatEditor.AllowEmptyValue ? !rtn && rtn !== 0 && (rtn = void 0) : rtn = rtn || 0;
    let decPlaces = this.getDecimalPlaces();
    return decPlaces !== null && (rtn || rtn === 0) && rtn.toFixed && (rtn = parseFloat(rtn.toFixed(decPlaces))), rtn;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && this.input.value !== this.defaultValue;
  }
  validate() {
    if (isNaN(this.input.value))
      return {
        valid: !1,
        msg: "Please enter a valid number"
      };
    if (this.args.column.validator) {
      let validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }
};
/** Default number of decimal places to use with FloatEditor */
__publicField(_FloatEditor, "DefaultDecimalPlaces"), /** Should we allow empty value when using FloatEditor */
__publicField(_FloatEditor, "AllowEmptyValue", !1);
var FloatEditor = _FloatEditor, FlatpickrEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    __publicField(this, "flatpickrInstance");
    if (this.init(), typeof flatpickr > "u")
      throw new Error("Flatpickr not loaded but required in SlickGrid.Editors, refer to Flatpickr documentation: https://flatpickr.js.org/getting-started/");
  }
  init() {
    this.input = Utils26.createDomElement("input", { type: "text", className: "editor-text" }, this.args.container), this.input.focus(), this.input.select(), this.flatpickrInstance = flatpickr(this.input, {
      closeOnSelect: !0,
      allowInput: !0,
      altInput: !0,
      altFormat: "m/d/Y",
      dateFormat: "m/d/Y",
      onChange: () => {
        if (this.args.compositeEditorOptions) {
          let activeCell = this.args.grid.getActiveCell();
          this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
            row: activeCell?.row ?? 0,
            cell: activeCell?.cell ?? 0,
            item: this.args.item,
            column: this.args.column,
            formValues: this.args.compositeEditorOptions.formValues,
            grid: this.args.grid,
            editors: this.args.compositeEditorOptions.editors
          });
        }
      }
    }), this.args.compositeEditorOptions || setTimeout(() => {
      this.show(), this.focus();
    }, 50), Utils26.width(this.input, Utils26.width(this.input) - (this.args.compositeEditorOptions ? 28 : 18));
  }
  destroy() {
    this.hide(), this.flatpickrInstance && this.flatpickrInstance.destroy(), this.input.remove();
  }
  show() {
    !this.args.compositeEditorOptions && this.flatpickrInstance && this.flatpickrInstance.open();
  }
  hide() {
    !this.args.compositeEditorOptions && this.flatpickrInstance && this.flatpickrInstance.close();
  }
  focus() {
    this.input.focus();
  }
  loadValue(item) {
    this.defaultValue = item[this.args.column.field], this.input.value = String(this.defaultValue ?? ""), this.input.defaultValue = String(this.defaultValue ?? ""), this.input.select(), this.flatpickrInstance && this.flatpickrInstance.setDate(this.defaultValue);
  }
  serializeValue() {
    return this.input.value;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && this.input.value !== this.defaultValue;
  }
  validate() {
    if (this.args.column.validator) {
      let validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }
}, YesNoSelectEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "select");
    __publicField(this, "defaultValue");
    this.init();
  }
  init() {
    this.select = Utils26.createDomElement("select", { tabIndex: 0, className: "editor-yesno" }, this.args.container), Utils26.createDomElement("option", { value: "yes", textContent: "Yes" }, this.select), Utils26.createDomElement("option", { value: "no", textContent: "No" }, this.select), this.select.focus(), this.args.compositeEditorOptions && this.select.addEventListener("change", this.onChange.bind(this));
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  destroy() {
    this.select.removeEventListener("change", this.onChange.bind(this)), this.select.remove();
  }
  focus() {
    this.select.focus();
  }
  loadValue(item) {
    this.select.value = (this.defaultValue = item[this.args.column.field]) ? "yes" : "no";
  }
  serializeValue() {
    return this.select.value === "yes";
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return this.select.value !== this.defaultValue;
  }
  validate() {
    return {
      valid: !0,
      msg: null
    };
  }
}, CheckboxEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    this.init();
  }
  init() {
    this.input = Utils26.createDomElement("input", { className: "editor-checkbox", type: "checkbox", value: "true" }, this.args.container), this.input.focus(), this.args.compositeEditorOptions && this.input.addEventListener("change", this.onChange.bind(this));
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  destroy() {
    this.input.removeEventListener("change", this.onChange.bind(this)), this.input.remove();
  }
  focus() {
    this.input.focus();
  }
  loadValue(item) {
    this.defaultValue = !!item[this.args.column.field], this.defaultValue ? this.input.checked = !0 : this.input.checked = !1;
  }
  serializeValue() {
    return this.input.checked;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return this.serializeValue() !== this.defaultValue;
  }
  validate() {
    return {
      valid: !0,
      msg: null
    };
  }
}, PercentCompleteEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "defaultValue");
    __publicField(this, "picker");
    __publicField(this, "slider");
    this.init();
  }
  sliderInputHandler(e) {
    this.input.value = e.target.value;
  }
  sliderChangeHandler() {
    if (this.args.compositeEditorOptions) {
      let activeCell = this.args.grid.getActiveCell();
      this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
        row: activeCell?.row ?? 0,
        cell: activeCell?.cell ?? 0,
        item: this.args.item,
        column: this.args.column,
        formValues: this.args.compositeEditorOptions.formValues,
        grid: this.args.grid,
        editors: this.args.compositeEditorOptions.editors
      });
    }
  }
  init() {
    this.input = Utils26.createDomElement("input", { className: "editor-percentcomplete", type: "text" }, this.args.container), Utils26.width(this.input, this.args.container.clientWidth - 25), this.picker = Utils26.createDomElement("div", { className: "editor-percentcomplete-picker" }, this.args.container), Utils26.createDomElement("span", { className: "editor-percentcomplete-picker-icon" }, this.picker);
    let containerHelper = Utils26.createDomElement("div", { className: "editor-percentcomplete-helper" }, this.picker), containerWrapper = Utils26.createDomElement("div", { className: "editor-percentcomplete-wrapper" }, containerHelper);
    Utils26.createDomElement("div", { className: "editor-percentcomplete-slider" }, containerWrapper), this.slider = Utils26.createDomElement("input", { className: "editor-percentcomplete-slider", type: "range", value: String(this.defaultValue ?? "") }, containerWrapper);
    let containerButtons = Utils26.createDomElement("div", { className: "editor-percentcomplete-buttons" }, containerWrapper);
    Utils26.createDomElement("button", { value: "0", className: "slick-btn slick-btn-default", textContent: "Not started" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils26.createDomElement("button", { value: "50", className: "slick-btn slick-btn-default", textContent: "In Progress" }, containerButtons), containerButtons.appendChild(document.createElement("br")), Utils26.createDomElement("button", { value: "100", className: "slick-btn slick-btn-default", textContent: "Complete" }, containerButtons), this.input.focus(), this.input.select(), this.slider.addEventListener("input", this.sliderInputHandler.bind(this)), this.slider.addEventListener("change", this.sliderChangeHandler.bind(this));
    let buttons = this.picker.querySelectorAll(".editor-percentcomplete-buttons button");
    [].forEach.call(buttons, (button) => {
      button.addEventListener("click", this.onClick.bind(this));
    });
  }
  onClick(e) {
    this.input.value = String(e.target.value ?? ""), this.slider.value = String(e.target.value ?? "");
  }
  destroy() {
    this.slider?.removeEventListener("input", this.sliderInputHandler.bind(this)), this.slider?.removeEventListener("change", this.sliderChangeHandler.bind(this)), this.picker.querySelectorAll(".editor-percentcomplete-buttons button").forEach((button) => button.removeEventListener("click", this.onClick.bind(this))), this.input.remove(), this.picker.remove();
  }
  focus() {
    this.input.focus();
  }
  loadValue(item) {
    this.defaultValue = item[this.args.column.field], this.slider.value = String(this.defaultValue ?? ""), this.input.value = String(this.defaultValue), this.input.select();
  }
  serializeValue() {
    return parseInt(this.input.value, 10) || 0;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && (parseInt(this.input.value, 10) || 0) !== this.defaultValue;
  }
  validate() {
    return isNaN(parseInt(this.input.value, 10)) ? {
      valid: !1,
      msg: "Please enter a valid positive number"
    } : {
      valid: !0,
      msg: null
    };
  }
}, LongTextEditor = class {
  constructor(args) {
    this.args = args;
    __publicField(this, "input");
    __publicField(this, "wrapper");
    __publicField(this, "defaultValue");
    __publicField(this, "selectionStart", 0);
    this.init();
  }
  init() {
    let compositeEditorOptions = this.args.compositeEditorOptions;
    this.args.grid.getOptions().editorCellNavOnLRKeys;
    let container = compositeEditorOptions ? this.args.container : document.body;
    if (this.wrapper = Utils26.createDomElement("div", { className: "slick-large-editor-text" }, container), compositeEditorOptions ? (this.wrapper.style.position = "relative", Utils26.setStyleSize(this.wrapper, "padding", 0), Utils26.setStyleSize(this.wrapper, "border", 0)) : this.wrapper.style.position = "absolute", this.input = Utils26.createDomElement("textarea", { rows: 5, style: { background: "white", width: "250px", height: "80px", border: "0", outline: "0" } }, this.wrapper), compositeEditorOptions)
      this.input.addEventListener("change", this.onChange.bind(this));
    else {
      let btnContainer = Utils26.createDomElement("div", { style: "text-align:right" }, this.wrapper);
      Utils26.createDomElement("button", { id: "save", className: "slick-btn slick-btn-primary", textContent: "Save" }, btnContainer), Utils26.createDomElement("button", { id: "cancel", className: "slick-btn slick-btn-default", textContent: "Cancel" }, btnContainer), this.wrapper.querySelector("#save").addEventListener("click", this.save.bind(this)), this.wrapper.querySelector("#cancel").addEventListener("click", this.cancel.bind(this)), this.input.addEventListener("keydown", this.handleKeyDown.bind(this)), this.position(this.args.position);
    }
    this.input.focus(), this.input.select();
  }
  onChange() {
    let activeCell = this.args.grid.getActiveCell();
    this.validate().valid && this.applyValue(this.args.item, this.serializeValue()), this.applyValue(this.args.compositeEditorOptions.formValues, this.serializeValue()), this.args.grid.onCompositeEditorChange.notify({
      row: activeCell?.row ?? 0,
      cell: activeCell?.cell ?? 0,
      item: this.args.item,
      column: this.args.column,
      formValues: this.args.compositeEditorOptions.formValues,
      grid: this.args.grid,
      editors: this.args.compositeEditorOptions.editors
    });
  }
  handleKeyDown(e) {
    if (e.which === keyCode5.ENTER && e.ctrlKey)
      this.save();
    else if (e.which === keyCode5.ESCAPE)
      e.preventDefault(), this.cancel();
    else if (e.which === keyCode5.TAB && e.shiftKey)
      e.preventDefault(), this.args.grid.navigatePrev();
    else if (e.which === keyCode5.TAB)
      e.preventDefault(), this.args.grid.navigateNext();
    else if ((e.which === keyCode5.LEFT || e.which === keyCode5.RIGHT) && this.args.grid.getOptions().editorCellNavOnLRKeys) {
      let cursorPosition = this.selectionStart, textLength = e.target.value.length;
      e.keyCode === keyCode5.LEFT && cursorPosition === 0 && this.args.grid.navigatePrev(), e.keyCode === keyCode5.RIGHT && cursorPosition >= textLength - 1 && this.args.grid.navigateNext();
    }
  }
  save() {
    (this.args.grid.getOptions() || {}).autoCommitEdit ? this.args.grid.getEditorLock().commitCurrentEdit() : this.args.commitChanges();
  }
  cancel() {
    this.input.value = String(this.defaultValue ?? ""), this.args.cancelChanges();
  }
  hide() {
    Utils26.hide(this.wrapper);
  }
  show() {
    Utils26.show(this.wrapper);
  }
  position(position) {
    Utils26.setStyleSize(this.wrapper, "top", (position.top || 0) - 5), Utils26.setStyleSize(this.wrapper, "left", (position.left || 0) - 2);
  }
  destroy() {
    this.args.compositeEditorOptions ? this.input.removeEventListener("change", this.onChange.bind(this)) : (this.wrapper.querySelector("#save").removeEventListener("click", this.save.bind(this)), this.wrapper.querySelector("#cancel").removeEventListener("click", this.cancel.bind(this)), this.input.removeEventListener("keydown", this.handleKeyDown.bind(this))), this.wrapper.remove();
  }
  focus() {
    this.input.focus();
  }
  loadValue(item) {
    this.input.value = this.defaultValue = item[this.args.column.field], this.input.select();
  }
  serializeValue() {
    return this.input.value;
  }
  applyValue(item, state) {
    item[this.args.column.field] = state;
  }
  isValueChanged() {
    return !(this.input.value === "" && !Utils26.isDefined(this.defaultValue)) && this.input.value !== this.defaultValue;
  }
  validate() {
    if (this.args.column.validator) {
      let validationResults = this.args.column.validator(this.input.value, this.args);
      if (!validationResults.valid)
        return validationResults;
    }
    return {
      valid: !0,
      msg: null
    };
  }
};
function handleKeydownLRNav(e) {
  let cursorPosition = e.selectionStart, textLength = e.target.value.length;
  (e.keyCode === keyCode5.LEFT && cursorPosition > 0 || e.keyCode === keyCode5.RIGHT && cursorPosition < textLength - 1) && e.stopImmediatePropagation();
}
function handleKeydownLRNoNav(e) {
  (e.keyCode === keyCode5.LEFT || e.keyCode === keyCode5.RIGHT) && e.stopImmediatePropagation();
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

// src/slick.formatters.ts
var Utils27 = Utils, PercentCompleteFormatter = (_row, _cell, value) => !Utils27.isDefined(value) || value === "" ? "-" : value < 50 ? `<span style="color:red;font-weight:bold;">${value}%</span>` : `<span style="color:green">${value}%</span>`, PercentCompleteBarFormatter = (_row, _cell, value) => {
  if (!Utils27.isDefined(value) || value === "")
    return "";
  let color;
  return value < 30 ? color = "red" : value < 70 ? color = "silver" : color = "green", `<span class="percent-complete-bar" style="background:${color};width:${value}%" title="${value}%"></span>`;
}, YesNoFormatter = (_row, _cell, value) => value ? "Yes" : "No", CheckboxFormatter = (_row, _cell, value) => `<span class="sgi sgi-checkbox-${value ? "intermediate" : "blank-outline"}"></span>`, CheckmarkFormatter = (_row, _cell, value) => value ? '<span class="sgi sgi-check"></span>' : "", Formatters = {
  PercentComplete: PercentCompleteFormatter,
  PercentCompleteBar: PercentCompleteBarFormatter,
  YesNo: YesNoFormatter,
  Checkmark: CheckmarkFormatter,
  Checkbox: CheckboxFormatter
};

// src/slick.grid.ts
var BindingEventService13 = BindingEventService, ColAutosizeMode2 = ColAutosizeMode, SlickEvent21 = SlickEvent, SlickEventData8 = SlickEventData, GlobalEditorLock2 = GlobalEditorLock, GridAutosizeColsMode2 = GridAutosizeColsMode, keyCode6 = keyCode, preClickClassName2 = preClickClassName, SlickRange7 = SlickRange, RowSelectionMode2 = RowSelectionMode, ValueFilterMode2 = ValueFilterMode, Utils28 = Utils, WidthEvalMode2 = WidthEvalMode, Draggable4 = Draggable, MouseWheel2 = MouseWheel, Resizable2 = Resizable;
var SlickGrid = class {
  /**
   * Creates a new instance of the grid.
   * @class SlickGrid
   * @constructor
   * @param {Node} container - Container node to create the grid in.
   * @param {Array|Object} data - An array of objects for databinding.
   * @param {Array<C>} columns - An array of column definitions.
   * @param {Object} [options] - Grid this._options.
   **/
  constructor(container, data, columns, options) {
    this.container = container;
    this.data = data;
    this.columns = columns;
    this.options = options;
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Public API
    __publicField(this, "slickGridVersion", "5.5.4");
    /** optional grid state clientId */
    __publicField(this, "cid", "");
    // Events
    __publicField(this, "onActiveCellChanged", new SlickEvent21());
    __publicField(this, "onActiveCellPositionChanged", new SlickEvent21());
    __publicField(this, "onAddNewRow", new SlickEvent21());
    __publicField(this, "onAutosizeColumns", new SlickEvent21());
    __publicField(this, "onBeforeAppendCell", new SlickEvent21());
    __publicField(this, "onBeforeCellEditorDestroy", new SlickEvent21());
    __publicField(this, "onBeforeColumnsResize", new SlickEvent21());
    __publicField(this, "onBeforeDestroy", new SlickEvent21());
    __publicField(this, "onBeforeEditCell", new SlickEvent21());
    __publicField(this, "onBeforeFooterRowCellDestroy", new SlickEvent21());
    __publicField(this, "onBeforeHeaderCellDestroy", new SlickEvent21());
    __publicField(this, "onBeforeHeaderRowCellDestroy", new SlickEvent21());
    __publicField(this, "onBeforeSetColumns", new SlickEvent21());
    __publicField(this, "onBeforeSort", new SlickEvent21());
    __publicField(this, "onBeforeUpdateColumns", new SlickEvent21());
    __publicField(this, "onCellChange", new SlickEvent21());
    __publicField(this, "onCellCssStylesChanged", new SlickEvent21());
    __publicField(this, "onClick", new SlickEvent21());
    __publicField(this, "onColumnsReordered", new SlickEvent21());
    __publicField(this, "onColumnsDrag", new SlickEvent21());
    __publicField(this, "onColumnsResized", new SlickEvent21());
    __publicField(this, "onColumnsResizeDblClick", new SlickEvent21());
    __publicField(this, "onCompositeEditorChange", new SlickEvent21());
    __publicField(this, "onContextMenu", new SlickEvent21());
    __publicField(this, "onDrag", new SlickEvent21());
    __publicField(this, "onDblClick", new SlickEvent21());
    __publicField(this, "onDragInit", new SlickEvent21());
    __publicField(this, "onDragStart", new SlickEvent21());
    __publicField(this, "onDragEnd", new SlickEvent21());
    __publicField(this, "onFooterClick", new SlickEvent21());
    __publicField(this, "onFooterContextMenu", new SlickEvent21());
    __publicField(this, "onFooterRowCellRendered", new SlickEvent21());
    __publicField(this, "onHeaderCellRendered", new SlickEvent21());
    __publicField(this, "onHeaderClick", new SlickEvent21());
    __publicField(this, "onHeaderContextMenu", new SlickEvent21());
    __publicField(this, "onHeaderMouseEnter", new SlickEvent21());
    __publicField(this, "onHeaderMouseLeave", new SlickEvent21());
    __publicField(this, "onHeaderRowCellRendered", new SlickEvent21());
    __publicField(this, "onHeaderRowMouseEnter", new SlickEvent21());
    __publicField(this, "onHeaderRowMouseLeave", new SlickEvent21());
    __publicField(this, "onKeyDown", new SlickEvent21());
    __publicField(this, "onMouseEnter", new SlickEvent21());
    __publicField(this, "onMouseLeave", new SlickEvent21());
    __publicField(this, "onRendered", new SlickEvent21());
    __publicField(this, "onScroll", new SlickEvent21());
    __publicField(this, "onSelectedRowsChanged", new SlickEvent21());
    __publicField(this, "onSetOptions", new SlickEvent21());
    __publicField(this, "onActivateChangedOptions", new SlickEvent21());
    __publicField(this, "onSort", new SlickEvent21());
    __publicField(this, "onValidationError", new SlickEvent21());
    __publicField(this, "onViewportChanged", new SlickEvent21());
    // ---
    // protected variables
    // shared across all grids on the page
    __publicField(this, "scrollbarDimensions");
    __publicField(this, "maxSupportedCssHeight");
    // browser's breaking point
    __publicField(this, "canvas", null);
    __publicField(this, "canvas_context", null);
    // settings
    __publicField(this, "_options");
    __publicField(this, "_defaults", {
      alwaysShowVerticalScroll: !1,
      alwaysAllowHorizontalScroll: !1,
      explicitInitialization: !1,
      rowHeight: 25,
      defaultColumnWidth: 80,
      enableHtmlRendering: !0,
      enableAddRow: !1,
      leaveSpaceForNewRows: !1,
      editable: !1,
      autoEdit: !0,
      autoEditNewRow: !0,
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
      nonce: "",
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
      throwWhenFrozenNotAllViewable: !1,
      fullWidthRows: !1,
      multiColumnSort: !1,
      numberedMultiColumnSort: !1,
      tristateMultiColumnSort: !1,
      sortColNumberInSeparateSpan: !1,
      defaultFormatter: this.defaultFormatter,
      forceSyncScrolling: !1,
      addNewRowCssClass: "new-row",
      preserveCopiedSelectionOnPaste: !1,
      showCellSelection: !0,
      viewportClass: void 0,
      minRowBuffer: 3,
      emulatePagingWhenScrolling: !0,
      // when scrolling off bottom of viewport, place new row at top of viewport
      editorCellNavOnLRKeys: !1,
      enableMouseWheelScrollHandler: !0,
      doPaging: !0,
      autosizeColsMode: GridAutosizeColsMode2.LegacyOff,
      autosizeColPaddingPx: 4,
      scrollRenderThrottling: 50,
      autosizeTextAvgToMWidthRatio: 0.75,
      viewportSwitchToScrollModeWidthPercent: void 0,
      viewportMinWidthPx: void 0,
      viewportMaxWidthPx: void 0,
      suppressCssChangesOnHiddenInit: !1,
      ffMaxSupportedCssHeight: 6e6,
      maxSupportedCssHeight: 1e9,
      sanitizer: void 0,
      // sanitize function, built in basic sanitizer is: Slick.RegexSanitizer(dirtyHtml)
      logSanitizedHtml: !1,
      // log to console when sanitised - recommend true for testing of dev and production
      mixinDefaults: !0,
      shadowRoot: void 0
    });
    __publicField(this, "_columnDefaults", {
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
    });
    __publicField(this, "_columnAutosizeDefaults", {
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
    });
    // scroller
    __publicField(this, "th");
    // virtual height
    __publicField(this, "h");
    // real scrollable height
    __publicField(this, "ph");
    // page height
    __publicField(this, "n");
    // number of pages
    __publicField(this, "cj");
    // "jumpiness" coefficient
    __publicField(this, "page", 0);
    // current page
    __publicField(this, "offset", 0);
    // current page offset
    __publicField(this, "vScrollDir", 1);
    __publicField(this, "_bindingEventService", new BindingEventService13());
    __publicField(this, "initialized", !1);
    __publicField(this, "_container");
    __publicField(this, "uid", `slickgrid_${Math.round(1e6 * Math.random())}`);
    __publicField(this, "_focusSink");
    __publicField(this, "_focusSink2");
    __publicField(this, "_groupHeaders", []);
    __publicField(this, "_headerScroller", []);
    __publicField(this, "_headers", []);
    __publicField(this, "_headerRows");
    __publicField(this, "_headerRowScroller");
    __publicField(this, "_headerRowSpacerL");
    __publicField(this, "_headerRowSpacerR");
    __publicField(this, "_footerRow");
    __publicField(this, "_footerRowScroller");
    __publicField(this, "_footerRowSpacerL");
    __publicField(this, "_footerRowSpacerR");
    __publicField(this, "_preHeaderPanel");
    __publicField(this, "_preHeaderPanelScroller");
    __publicField(this, "_preHeaderPanelSpacer");
    __publicField(this, "_preHeaderPanelR");
    __publicField(this, "_preHeaderPanelScrollerR");
    __publicField(this, "_preHeaderPanelSpacerR");
    __publicField(this, "_topPanelScrollers");
    __publicField(this, "_topPanels");
    __publicField(this, "_viewport");
    __publicField(this, "_canvas");
    __publicField(this, "_style");
    __publicField(this, "_boundAncestors", []);
    __publicField(this, "stylesheet");
    __publicField(this, "columnCssRulesL");
    __publicField(this, "columnCssRulesR");
    __publicField(this, "viewportH", 0);
    __publicField(this, "viewportW", 0);
    __publicField(this, "canvasWidth", 0);
    __publicField(this, "canvasWidthL", 0);
    __publicField(this, "canvasWidthR", 0);
    __publicField(this, "headersWidth", 0);
    __publicField(this, "headersWidthL", 0);
    __publicField(this, "headersWidthR", 0);
    __publicField(this, "viewportHasHScroll", !1);
    __publicField(this, "viewportHasVScroll", !1);
    __publicField(this, "headerColumnWidthDiff", 0);
    __publicField(this, "headerColumnHeightDiff", 0);
    // border+padding
    __publicField(this, "cellWidthDiff", 0);
    __publicField(this, "cellHeightDiff", 0);
    __publicField(this, "absoluteColumnMinWidth");
    __publicField(this, "hasFrozenRows", !1);
    __publicField(this, "frozenRowsHeight", 0);
    __publicField(this, "actualFrozenRow", -1);
    __publicField(this, "paneTopH", 0);
    __publicField(this, "paneBottomH", 0);
    __publicField(this, "viewportTopH", 0);
    __publicField(this, "viewportBottomH", 0);
    __publicField(this, "topPanelH", 0);
    __publicField(this, "headerRowH", 0);
    __publicField(this, "footerRowH", 0);
    __publicField(this, "tabbingDirection", 1);
    __publicField(this, "_activeCanvasNode");
    __publicField(this, "_activeViewportNode");
    __publicField(this, "activePosX");
    __publicField(this, "activeRow");
    __publicField(this, "activeCell");
    __publicField(this, "activeCellNode", null);
    __publicField(this, "currentEditor", null);
    __publicField(this, "serializedEditorValue");
    __publicField(this, "editController");
    __publicField(this, "rowsCache", {});
    __publicField(this, "renderedRows", 0);
    __publicField(this, "numVisibleRows", 0);
    __publicField(this, "prevScrollTop", 0);
    __publicField(this, "scrollTop", 0);
    __publicField(this, "lastRenderedScrollTop", 0);
    __publicField(this, "lastRenderedScrollLeft", 0);
    __publicField(this, "prevScrollLeft", 0);
    __publicField(this, "scrollLeft", 0);
    __publicField(this, "selectionModel");
    __publicField(this, "selectedRows", []);
    __publicField(this, "plugins", []);
    __publicField(this, "cellCssClasses", {});
    __publicField(this, "columnsById", {});
    __publicField(this, "sortColumns", []);
    __publicField(this, "columnPosLeft", []);
    __publicField(this, "columnPosRight", []);
    __publicField(this, "pagingActive", !1);
    __publicField(this, "pagingIsLastPage", !1);
    __publicField(this, "scrollThrottle");
    // async call handles
    __publicField(this, "h_editorLoader", null);
    __publicField(this, "h_render", null);
    __publicField(this, "h_postrender", null);
    __publicField(this, "h_postrenderCleanup", null);
    __publicField(this, "postProcessedRows", {});
    __publicField(this, "postProcessToRow", null);
    __publicField(this, "postProcessFromRow", null);
    __publicField(this, "postProcessedCleanupQueue", []);
    __publicField(this, "postProcessgroupId", 0);
    // perf counters
    __publicField(this, "counter_rows_rendered", 0);
    __publicField(this, "counter_rows_removed", 0);
    __publicField(this, "_paneHeaderL");
    __publicField(this, "_paneHeaderR");
    __publicField(this, "_paneTopL");
    __publicField(this, "_paneTopR");
    __publicField(this, "_paneBottomL");
    __publicField(this, "_paneBottomR");
    __publicField(this, "_headerScrollerL");
    __publicField(this, "_headerScrollerR");
    __publicField(this, "_headerL");
    __publicField(this, "_headerR");
    __publicField(this, "_groupHeadersL");
    __publicField(this, "_groupHeadersR");
    __publicField(this, "_headerRowScrollerL");
    __publicField(this, "_headerRowScrollerR");
    __publicField(this, "_footerRowScrollerL");
    __publicField(this, "_footerRowScrollerR");
    __publicField(this, "_headerRowL");
    __publicField(this, "_headerRowR");
    __publicField(this, "_footerRowL");
    __publicField(this, "_footerRowR");
    __publicField(this, "_topPanelScrollerL");
    __publicField(this, "_topPanelScrollerR");
    __publicField(this, "_topPanelL");
    __publicField(this, "_topPanelR");
    __publicField(this, "_viewportTopL");
    __publicField(this, "_viewportTopR");
    __publicField(this, "_viewportBottomL");
    __publicField(this, "_viewportBottomR");
    __publicField(this, "_canvasTopL");
    __publicField(this, "_canvasTopR");
    __publicField(this, "_canvasBottomL");
    __publicField(this, "_canvasBottomR");
    __publicField(this, "_viewportScrollContainerX");
    __publicField(this, "_viewportScrollContainerY");
    __publicField(this, "_headerScrollContainer");
    __publicField(this, "_headerRowScrollContainer");
    __publicField(this, "_footerRowScrollContainer");
    // store css attributes if display:none is active in container or parent
    __publicField(this, "cssShow", { position: "absolute", visibility: "hidden", display: "block" });
    __publicField(this, "_hiddenParents", []);
    __publicField(this, "oldProps", []);
    __publicField(this, "enforceFrozenRowHeightRecalc", !1);
    __publicField(this, "columnResizeDragging", !1);
    __publicField(this, "slickDraggableInstance", null);
    __publicField(this, "slickMouseWheelInstances", []);
    __publicField(this, "slickResizableInstances", []);
    __publicField(this, "sortableSideLeftInstance");
    __publicField(this, "sortableSideRightInstance");
    __publicField(this, "logMessageCount", 0);
    __publicField(this, "logMessageMaxCount", 30);
    this.initialize();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Initialization
  /** Initializes the grid. */
  init() {
    this.finishInitialization();
  }
  /**
   * Apply HTML code by 3 different ways depending on what is provided as input and what options are enabled.
   * 1. value is an HTMLElement or DocumentFragment, then first empty the target and simply append the HTML to the target element.
   * 2. value is string and `enableHtmlRendering` is enabled, then use `target.innerHTML = value;`
   * 3. value is string and `enableHtmlRendering` is disabled, then use `target.textContent = value;`
   * @param target - target element to apply to
   * @param val - input value can be either a string or an HTMLElement
   */
  applyHtmlCode(target, val, emptyTarget = !0) {
    target && (val instanceof HTMLElement || val instanceof DocumentFragment ? (emptyTarget && Utils28.emptyElement(target), target.appendChild(val)) : this._options.enableHtmlRendering ? target.innerHTML = this.sanitizeHtmlString(val) : target.textContent = this.sanitizeHtmlString(val));
  }
  initialize() {
    if (typeof this.container == "string" ? this._container = document.querySelector(this.container) : this._container = this.container, !this._container)
      throw new Error(`SlickGrid requires a valid container, ${this.container} does not exist in the DOM.`);
    if (this.options.mixinDefaults ? (this.options || (this.options = {}), Utils28.applyDefaults(this.options, this._defaults)) : this._options = Utils28.extend(!0, {}, this._defaults, this.options), this.scrollThrottle = this.actionThrottle(this.render.bind(this), this._options.scrollRenderThrottling), this.maxSupportedCssHeight = this.maxSupportedCssHeight || this.getMaxSupportedCssHeight(), this.validateAndEnforceOptions(), this._columnDefaults.width = this._options.defaultColumnWidth, this._options.suppressCssChangesOnHiddenInit || this.cacheCssForHiddenInit(), this.updateColumnProps(), this._options.enableColumnReorder && (!Sortable || !Sortable.create))
      throw new Error("SlickGrid requires Sortable.js module to be loaded");
    this.editController = {
      commitCurrentEdit: this.commitCurrentEdit.bind(this),
      cancelCurrentEdit: this.cancelCurrentEdit.bind(this)
    }, Utils28.emptyElement(this._container), this._container.style.overflow = "hidden", this._container.style.outline = String(0), this._container.classList.add(this.uid), this._container.classList.add("ui-widget");
    let containerStyles = window.getComputedStyle(this._container);
    /relative|absolute|fixed/.test(containerStyles.position) || (this._container.style.position = "relative"), this._focusSink = Utils28.createDomElement("div", { tabIndex: 0, style: { position: "fixed", width: "0px", height: "0px", top: "0px", left: "0px", outline: "0px" } }, this._container), this._paneHeaderL = Utils28.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-left", tabIndex: 0 }, this._container), this._paneHeaderR = Utils28.createDomElement("div", { className: "slick-pane slick-pane-header slick-pane-right", tabIndex: 0 }, this._container), this._paneTopL = Utils28.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-left", tabIndex: 0 }, this._container), this._paneTopR = Utils28.createDomElement("div", { className: "slick-pane slick-pane-top slick-pane-right", tabIndex: 0 }, this._container), this._paneBottomL = Utils28.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-left", tabIndex: 0 }, this._container), this._paneBottomR = Utils28.createDomElement("div", { className: "slick-pane slick-pane-bottom slick-pane-right", tabIndex: 0 }, this._container), this._options.createPreHeaderPanel && (this._preHeaderPanelScroller = Utils28.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderL), this._preHeaderPanelScroller.appendChild(document.createElement("div")), this._preHeaderPanel = Utils28.createDomElement("div", null, this._preHeaderPanelScroller), this._preHeaderPanelSpacer = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScroller), this._preHeaderPanelScrollerR = Utils28.createDomElement("div", { className: "slick-preheader-panel ui-state-default slick-state-default", style: { overflow: "hidden", position: "relative" } }, this._paneHeaderR), this._preHeaderPanelR = Utils28.createDomElement("div", null, this._preHeaderPanelScrollerR), this._preHeaderPanelSpacerR = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._preHeaderPanelScrollerR), this._options.showPreHeaderPanel || (Utils28.hide(this._preHeaderPanelScroller), Utils28.hide(this._preHeaderPanelScrollerR))), this._headerScrollerL = Utils28.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-left" }, this._paneHeaderL), this._headerScrollerR = Utils28.createDomElement("div", { className: "slick-header ui-state-default slick-state-default slick-header-right" }, this._paneHeaderR), this._headerScroller.push(this._headerScrollerL), this._headerScroller.push(this._headerScrollerR), this._headerL = Utils28.createDomElement("div", { className: "slick-header-columns slick-header-columns-left", style: { left: "-1000px" } }, this._headerScrollerL), this._headerR = Utils28.createDomElement("div", { className: "slick-header-columns slick-header-columns-right", style: { left: "-1000px" } }, this._headerScrollerR), this._headers = [this._headerL, this._headerR], this._headerRowScrollerL = Utils28.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopL), this._headerRowScrollerR = Utils28.createDomElement("div", { className: "slick-headerrow ui-state-default slick-state-default" }, this._paneTopR), this._headerRowScroller = [this._headerRowScrollerL, this._headerRowScrollerR], this._headerRowSpacerL = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerL), this._headerRowSpacerR = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._headerRowScrollerR), this._headerRowL = Utils28.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-left" }, this._headerRowScrollerL), this._headerRowR = Utils28.createDomElement("div", { className: "slick-headerrow-columns slick-headerrow-columns-right" }, this._headerRowScrollerR), this._headerRows = [this._headerRowL, this._headerRowR], this._topPanelScrollerL = Utils28.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopL), this._topPanelScrollerR = Utils28.createDomElement("div", { className: "slick-top-panel-scroller ui-state-default slick-state-default" }, this._paneTopR), this._topPanelScrollers = [this._topPanelScrollerL, this._topPanelScrollerR], this._topPanelL = Utils28.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerL), this._topPanelR = Utils28.createDomElement("div", { className: "slick-top-panel", style: { width: "10000px" } }, this._topPanelScrollerR), this._topPanels = [this._topPanelL, this._topPanelR], this._options.showColumnHeader || this._headerScroller.forEach((el) => {
      Utils28.hide(el);
    }), this._options.showTopPanel || this._topPanelScrollers.forEach((scroller) => {
      Utils28.hide(scroller);
    }), this._options.showHeaderRow || this._headerRowScroller.forEach((scroller) => {
      Utils28.hide(scroller);
    }), this._viewportTopL = Utils28.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-left", tabIndex: 0 }, this._paneTopL), this._viewportTopR = Utils28.createDomElement("div", { className: "slick-viewport slick-viewport-top slick-viewport-right", tabIndex: 0 }, this._paneTopR), this._viewportBottomL = Utils28.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-left", tabIndex: 0 }, this._paneBottomL), this._viewportBottomR = Utils28.createDomElement("div", { className: "slick-viewport slick-viewport-bottom slick-viewport-right", tabIndex: 0 }, this._paneBottomR), this._viewport = [this._viewportTopL, this._viewportTopR, this._viewportBottomL, this._viewportBottomR], this._options.viewportClass && this._viewport.forEach((view) => {
      view.classList.add(...(this._options.viewportClass || "").split(" "));
    }), this._activeViewportNode = this._viewportTopL, this._canvasTopL = Utils28.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-left", tabIndex: 0 }, this._viewportTopL), this._canvasTopR = Utils28.createDomElement("div", { className: "grid-canvas grid-canvas-top grid-canvas-right", tabIndex: 0 }, this._viewportTopR), this._canvasBottomL = Utils28.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-left", tabIndex: 0 }, this._viewportBottomL), this._canvasBottomR = Utils28.createDomElement("div", { className: "grid-canvas grid-canvas-bottom grid-canvas-right", tabIndex: 0 }, this._viewportBottomR), this._canvas = [this._canvasTopL, this._canvasTopR, this._canvasBottomL, this._canvasBottomR], this.scrollbarDimensions = this.scrollbarDimensions || this.measureScrollbar(), this._activeCanvasNode = this._canvasTopL, this._preHeaderPanelSpacer && Utils28.width(this._preHeaderPanelSpacer, this.getCanvasWidth() + this.scrollbarDimensions.width), this._headers.forEach((el) => {
      Utils28.width(el, this.getHeadersWidth());
    }), Utils28.width(this._headerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), Utils28.width(this._headerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._options.createFooterRow && (this._footerRowScrollerR = Utils28.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopR), this._footerRowScrollerL = Utils28.createDomElement("div", { className: "slick-footerrow ui-state-default slick-state-default" }, this._paneTopL), this._footerRowScroller = [this._footerRowScrollerL, this._footerRowScrollerR], this._footerRowSpacerL = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerL), Utils28.width(this._footerRowSpacerL, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowSpacerR = Utils28.createDomElement("div", { style: { display: "block", height: "1px", position: "absolute", top: "0px", left: "0px" } }, this._footerRowScrollerR), Utils28.width(this._footerRowSpacerR, this.getCanvasWidth() + this.scrollbarDimensions.width), this._footerRowL = Utils28.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-left" }, this._footerRowScrollerL), this._footerRowR = Utils28.createDomElement("div", { className: "slick-footerrow-columns slick-footerrow-columns-right" }, this._footerRowScrollerR), this._footerRow = [this._footerRowL, this._footerRowR], this._options.showFooterRow || this._footerRowScroller.forEach((scroller) => {
      Utils28.hide(scroller);
    })), this._focusSink2 = this._focusSink.cloneNode(!0), this._container.appendChild(this._focusSink2), this._options.explicitInitialization || this.finishInitialization();
  }
  finishInitialization() {
    this.initialized || (this.initialized = !0, this.getViewportWidth(), this.getViewportHeight(), this.measureCellPaddingAndBorder(), this.disableSelection(this._headers), this._options.enableTextSelectionOnCells || this._viewport.forEach((view) => {
      this._bindingEventService.bind(view, "selectstart", (event2) => {
        event2.target instanceof HTMLInputElement || event2.target instanceof HTMLTextAreaElement;
      });
    }), this.setFrozenOptions(), this.setPaneVisibility(), this.setScroller(), this.setOverflow(), this.updateColumnCaches(), this.createColumnHeaders(), this.createColumnFooter(), this.setupColumnSort(), this.createCssRules(), this.resizeCanvas(), this.bindAncestorScrollEvents(), this._bindingEventService.bind(this._container, "resize", this.resizeCanvas.bind(this)), this._viewport.forEach((view) => {
      this._bindingEventService.bind(view, "scroll", this.handleScroll.bind(this));
    }), this._options.enableMouseWheelScrollHandler && this._viewport.forEach((view) => {
      this.slickMouseWheelInstances.push(MouseWheel2({
        element: view,
        onMouseWheel: this.handleMouseWheel.bind(this)
      }));
    }), this._headerScroller.forEach((el) => {
      this._bindingEventService.bind(el, "contextmenu", this.handleHeaderContextMenu.bind(this)), this._bindingEventService.bind(el, "click", this.handleHeaderClick.bind(this));
    }), this._headerRowScroller.forEach((scroller) => {
      this._bindingEventService.bind(scroller, "scroll", this.handleHeaderRowScroll.bind(this));
    }), this._options.createFooterRow && (this._footerRow.forEach((footer) => {
      this._bindingEventService.bind(footer, "contextmenu", this.handleFooterContextMenu.bind(this)), this._bindingEventService.bind(footer, "click", this.handleFooterClick.bind(this));
    }), this._footerRowScroller.forEach((scroller) => {
      this._bindingEventService.bind(scroller, "scroll", this.handleFooterRowScroll.bind(this));
    })), this._options.createPreHeaderPanel && this._bindingEventService.bind(this._preHeaderPanelScroller, "scroll", this.handlePreHeaderPanelScroll.bind(this)), this._bindingEventService.bind(this._focusSink, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(this._focusSink2, "keydown", this.handleKeyDown.bind(this)), this._canvas.forEach((element) => {
      this._bindingEventService.bind(element, "keydown", this.handleKeyDown.bind(this)), this._bindingEventService.bind(element, "click", this.handleClick.bind(this)), this._bindingEventService.bind(element, "dblclick", this.handleDblClick.bind(this)), this._bindingEventService.bind(element, "contextmenu", this.handleContextMenu.bind(this)), this._bindingEventService.bind(element, "mouseover", this.handleCellMouseOver.bind(this)), this._bindingEventService.bind(element, "mouseout", this.handleCellMouseOut.bind(this));
    }), Draggable4 && (this.slickDraggableInstance = Draggable4({
      containerElement: this._container,
      allowDragFrom: "div.slick-cell",
      allowDragFromClosest: "div.slick-cell",
      onDragInit: this.handleDragInit.bind(this),
      onDragStart: this.handleDragStart.bind(this),
      onDrag: this.handleDrag.bind(this),
      onDragEnd: this.handleDragEnd.bind(this)
    })), this._options.suppressCssChangesOnHiddenInit || this.restoreCssFromHiddenInit());
  }
  /** handles "display:none" on container or container parents, related to issue: https://github.com/6pac/SlickGrid/issues/568 */
  cacheCssForHiddenInit() {
    this._hiddenParents = Utils28.parents(this._container, ":hidden");
    for (let el of this._hiddenParents) {
      let old = {};
      for (let name in this.cssShow)
        this.cssShow && (old[name] = el.style[name], el.style[name] = this.cssShow[name]);
      this.oldProps.push(old);
    }
  }
  restoreCssFromHiddenInit() {
    let i = 0;
    for (let el of this._hiddenParents) {
      let old = this.oldProps[i++];
      for (let name in this.cssShow)
        this.cssShow && (el.style[name] = old[name]);
    }
  }
  hasFrozenColumns() {
    return this._options.frozenColumn > -1;
  }
  /** Register an external Plugin */
  registerPlugin(plugin) {
    this.plugins.unshift(plugin), plugin.init(this);
  }
  /** Unregister (destroy) an external Plugin */
  unregisterPlugin(plugin) {
    for (let i = this.plugins.length; i >= 0; i--)
      if (this.plugins[i] === plugin) {
        this.plugins[i]?.destroy(), this.plugins.splice(i, 1);
        break;
      }
  }
  /** Get a Plugin (addon) by its name */
  getPluginByName(name) {
    for (let i = this.plugins.length - 1; i >= 0; i--)
      if (this.plugins[i]?.pluginName === name)
        return this.plugins[i];
  }
  /**
   * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
   * @param {Object} selectionModel A SelectionModel.
   */
  setSelectionModel(model) {
    this.selectionModel && (this.selectionModel.onSelectedRangesChanged.unsubscribe(this.handleSelectedRangesChanged.bind(this)), this.selectionModel.destroy && this.selectionModel.destroy()), this.selectionModel = model, this.selectionModel && (this.selectionModel.init(this), this.selectionModel.onSelectedRangesChanged.subscribe(this.handleSelectedRangesChanged.bind(this)));
  }
  /** Returns the current SelectionModel. See here for more information about SelectionModels. */
  getSelectionModel() {
    return this.selectionModel;
  }
  /** Get Grid Canvas Node DOM Element */
  getCanvasNode(columnIdOrIdx, rowIndex) {
    return this._getContainerElement(this.getCanvases(), columnIdOrIdx, rowIndex);
  }
  /** Get the canvas DOM element */
  getActiveCanvasNode(e) {
    return e === void 0 ? this._activeCanvasNode : (e instanceof SlickEventData8 && (e = e.getNativeEvent()), this._activeCanvasNode = e?.target.closest(".grid-canvas"), this._activeCanvasNode);
  }
  /** Get the canvas DOM element */
  getCanvases() {
    return this._canvas;
  }
  /** Get the Viewport DOM node element */
  getViewportNode(columnIdOrIdx, rowIndex) {
    return this._getContainerElement(this.getViewports(), columnIdOrIdx, rowIndex);
  }
  /** Get all the Viewport node elements */
  getViewports() {
    return this._viewport;
  }
  getActiveViewportNode(e) {
    return this.setActiveViewportNode(e), this._activeViewportNode;
  }
  /** Sets an active viewport node */
  setActiveViewportNode(e) {
    return e instanceof SlickEventData8 && (e = e.getNativeEvent()), this._activeViewportNode = e?.target.closest(".slick-viewport"), this._activeViewportNode;
  }
  _getContainerElement(targetContainers, columnIdOrIdx, rowIndex) {
    if (!targetContainers)
      return;
    columnIdOrIdx || (columnIdOrIdx = 0), rowIndex || (rowIndex = 0);
    let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), isBottomSide = this.hasFrozenRows && rowIndex >= this.actualFrozenRow + (this._options.frozenBottom ? 0 : 1), isRightSide = this.hasFrozenColumns() && idx > this._options.frozenColumn;
    return targetContainers[(isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0)];
  }
  measureScrollbar() {
    let className = "";
    this._viewport.forEach((v) => className += v.className);
    let outerdiv = Utils28.createDomElement("div", { className, style: { position: "absolute", top: "-10000px", left: "-10000px", overflow: "auto", width: "100px", height: "100px" } }, document.body), innerdiv = Utils28.createDomElement("div", { style: { width: "200px", height: "200px", overflow: "auto" } }, outerdiv), dim = {
      width: outerdiv.offsetWidth - outerdiv.clientWidth,
      height: outerdiv.offsetHeight - outerdiv.clientHeight
    };
    return innerdiv.remove(), outerdiv.remove(), dim;
  }
  /** Get the headers width in pixel */
  getHeadersWidth() {
    this.headersWidth = this.headersWidthL = this.headersWidthR = 0;
    let includeScrollbar = !this._options.autoHeight, i = 0, ii = this.columns.length;
    for (i = 0; i < ii; i++) {
      if (!this.columns[i] || this.columns[i].hidden)
        continue;
      let width = this.columns[i].width;
      this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += width || 0 : this.headersWidthL += width || 0;
    }
    return includeScrollbar && (this._options.frozenColumn > -1 && i > this._options.frozenColumn ? this.headersWidthR += this.scrollbarDimensions?.width ?? 0 : this.headersWidthL += this.scrollbarDimensions?.width ?? 0), this.hasFrozenColumns() ? (this.headersWidthL = this.headersWidthL + 1e3, this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.headersWidthL, this.headersWidthR += this.scrollbarDimensions?.width ?? 0) : (this.headersWidthL += this.scrollbarDimensions?.width ?? 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidth = this.headersWidthL + this.headersWidthR, Math.max(this.headersWidth, this.viewportW) + 1e3;
  }
  getHeadersWidthL() {
    return this.headersWidthL = 0, this.columns.forEach((column, i) => {
      column.hidden || this._options.frozenColumn > -1 && i > this._options.frozenColumn || (this.headersWidthL += column.width || 0);
    }), this.hasFrozenColumns() ? this.headersWidthL += 1e3 : (this.headersWidthL += this.scrollbarDimensions?.width ?? 0, this.headersWidthL = Math.max(this.headersWidthL, this.viewportW) + 1e3), this.headersWidthL;
  }
  getHeadersWidthR() {
    return this.headersWidthR = 0, this.columns.forEach((column, i) => {
      column.hidden || this._options.frozenColumn > -1 && i > this._options.frozenColumn && (this.headersWidthR += column.width || 0);
    }), this.hasFrozenColumns() && (this.headersWidthR = Math.max(this.headersWidthR, this.viewportW) + this.getHeadersWidthL(), this.headersWidthR += this.scrollbarDimensions?.width ?? 0), this.headersWidthR;
  }
  /** Get the grid canvas width */
  getCanvasWidth() {
    let availableWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW, i = this.columns.length;
    for (this.canvasWidthL = this.canvasWidthR = 0; i--; )
      !this.columns[i] || this.columns[i].hidden || (this.hasFrozenColumns() && i > this._options.frozenColumn ? this.canvasWidthR += this.columns[i].width || 0 : this.canvasWidthL += this.columns[i].width || 0);
    let totalRowWidth = this.canvasWidthL + this.canvasWidthR;
    if (this._options.fullWidthRows) {
      let extraWidth = Math.max(totalRowWidth, availableWidth) - totalRowWidth;
      extraWidth > 0 && (totalRowWidth += extraWidth, this.hasFrozenColumns() ? this.canvasWidthR += extraWidth : this.canvasWidthL += extraWidth);
    }
    return totalRowWidth;
  }
  updateCanvasWidth(forceColumnWidthsUpdate) {
    let oldCanvasWidth = this.canvasWidth, oldCanvasWidthL = this.canvasWidthL, oldCanvasWidthR = this.canvasWidthR;
    this.canvasWidth = this.getCanvasWidth();
    let widthChanged = this.canvasWidth !== oldCanvasWidth || this.canvasWidthL !== oldCanvasWidthL || this.canvasWidthR !== oldCanvasWidthR;
    if (widthChanged || this.hasFrozenColumns() || this.hasFrozenRows)
      if (Utils28.width(this._canvasTopL, this.canvasWidthL), this.getHeadersWidth(), Utils28.width(this._headerL, this.headersWidthL), Utils28.width(this._headerR, this.headersWidthR), this.hasFrozenColumns()) {
        let cWidth = Utils28.width(this._container) || 0;
        if (cWidth > 0 && this.canvasWidthL > cWidth && this._options.throwWhenFrozenNotAllViewable)
          throw new Error("[SlickGrid] Frozen columns cannot be wider than the actual grid container width. Make sure to have less columns freezed or make your grid container wider");
        Utils28.width(this._canvasTopR, this.canvasWidthR), Utils28.width(this._paneHeaderL, this.canvasWidthL), Utils28.setStyleSize(this._paneHeaderR, "left", this.canvasWidthL), Utils28.setStyleSize(this._paneHeaderR, "width", this.viewportW - this.canvasWidthL), Utils28.width(this._paneTopL, this.canvasWidthL), Utils28.setStyleSize(this._paneTopR, "left", this.canvasWidthL), Utils28.width(this._paneTopR, this.viewportW - this.canvasWidthL), Utils28.width(this._headerRowScrollerL, this.canvasWidthL), Utils28.width(this._headerRowScrollerR, this.viewportW - this.canvasWidthL), Utils28.width(this._headerRowL, this.canvasWidthL), Utils28.width(this._headerRowR, this.canvasWidthR), this._options.createFooterRow && (Utils28.width(this._footerRowScrollerL, this.canvasWidthL), Utils28.width(this._footerRowScrollerR, this.viewportW - this.canvasWidthL), Utils28.width(this._footerRowL, this.canvasWidthL), Utils28.width(this._footerRowR, this.canvasWidthR)), this._options.createPreHeaderPanel && Utils28.width(this._preHeaderPanel, this.canvasWidth), Utils28.width(this._viewportTopL, this.canvasWidthL), Utils28.width(this._viewportTopR, this.viewportW - this.canvasWidthL), this.hasFrozenRows && (Utils28.width(this._paneBottomL, this.canvasWidthL), Utils28.setStyleSize(this._paneBottomR, "left", this.canvasWidthL), Utils28.width(this._viewportBottomL, this.canvasWidthL), Utils28.width(this._viewportBottomR, this.viewportW - this.canvasWidthL), Utils28.width(this._canvasBottomL, this.canvasWidthL), Utils28.width(this._canvasBottomR, this.canvasWidthR));
      } else
        Utils28.width(this._paneHeaderL, "100%"), Utils28.width(this._paneTopL, "100%"), Utils28.width(this._headerRowScrollerL, "100%"), Utils28.width(this._headerRowL, this.canvasWidth), this._options.createFooterRow && (Utils28.width(this._footerRowScrollerL, "100%"), Utils28.width(this._footerRowL, this.canvasWidth)), this._options.createPreHeaderPanel && Utils28.width(this._preHeaderPanel, this.canvasWidth), Utils28.width(this._viewportTopL, "100%"), this.hasFrozenRows && (Utils28.width(this._viewportBottomL, "100%"), Utils28.width(this._canvasBottomL, this.canvasWidthL));
    this.viewportHasHScroll = this.canvasWidth >= this.viewportW - (this.scrollbarDimensions?.width ?? 0), Utils28.width(this._headerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0)), Utils28.width(this._headerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0)), this._options.createFooterRow && (Utils28.width(this._footerRowSpacerL, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0)), Utils28.width(this._footerRowSpacerR, this.canvasWidth + (this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0))), (widthChanged || forceColumnWidthsUpdate) && this.applyColumnWidths();
  }
  disableSelection(target) {
    target.forEach((el) => {
      el.setAttribute("unselectable", "on"), el.style.mozUserSelect = "none", this._bindingEventService.bind(el, "selectstart", () => !1);
    });
  }
  getMaxSupportedCssHeight() {
    let supportedHeight = 1e6, testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? this._options.ffMaxSupportedCssHeight : this._options.maxSupportedCssHeight, div = Utils28.createDomElement("div", { style: { display: "hidden" } }, document.body);
    for (; ; ) {
      let test = supportedHeight * 2;
      Utils28.height(div, test);
      let height = Utils28.height(div);
      if (test > testUpTo || height !== test)
        break;
      supportedHeight = test;
    }
    return div.remove(), supportedHeight;
  }
  /** Get grid unique identifier */
  getUID() {
    return this.uid;
  }
  /** Get Header Column Width Difference in pixel */
  getHeaderColumnWidthDiff() {
    return this.headerColumnWidthDiff;
  }
  /** Get scrollbar dimensions */
  getScrollbarDimensions() {
    return this.scrollbarDimensions;
  }
  /** Get the displayed scrollbar dimensions */
  getDisplayedScrollbarDimensions() {
    return {
      width: this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0,
      height: this.viewportHasHScroll ? this.scrollbarDimensions?.height ?? 0 : 0
    };
  }
  /** Get the absolute column minimum width */
  getAbsoluteColumnMinWidth() {
    return this.absoluteColumnMinWidth;
  }
  // TODO:  this is static.  need to handle page mutation.
  bindAncestorScrollEvents() {
    let elem = this.hasFrozenRows && !this._options.frozenBottom ? this._canvasBottomL : this._canvasTopL;
    for (; (elem = elem.parentNode) !== document.body && elem; )
      (elem === this._viewportTopL || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) && (this._boundAncestors.push(elem), this._bindingEventService.bind(elem, "scroll", this.handleActiveCellPositionChange.bind(this)));
  }
  unbindAncestorScrollEvents() {
    this._boundAncestors.forEach((ancestor) => {
      this._bindingEventService.unbindByEventName(ancestor, "scroll");
    }), this._boundAncestors = [];
  }
  /**
   * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
   * @param {Number|String} columnId Column id.
   * @param {String} [title] New column name.
   * @param {String} [toolTip] New column tooltip.
   */
  updateColumnHeader(columnId, title, toolTip) {
    if (!this.initialized)
      return;
    let idx = this.getColumnIndex(columnId);
    if (!Utils28.isDefined(idx))
      return;
    let columnDef = this.columns[idx], header = this.getColumnByIndex(idx);
    header && (title !== void 0 && (this.columns[idx].name = title), toolTip !== void 0 && (this.columns[idx].toolTip = toolTip), this.trigger(this.onBeforeHeaderCellDestroy, {
      node: header,
      column: columnDef,
      grid: this
    }), header.setAttribute("title", toolTip || ""), title !== void 0 && this.applyHtmlCode(header.children[0], title), this.trigger(this.onHeaderCellRendered, {
      node: header,
      column: columnDef,
      grid: this
    }));
  }
  /**
   * Get the Header DOM element
   * @param {C} columnDef - column definition
   */
  getHeader(columnDef) {
    if (!columnDef)
      return this.hasFrozenColumns() ? this._headers : this._headerL;
    let idx = this.getColumnIndex(columnDef.id);
    return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL;
  }
  /**
   * Get a specific Header Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderColumn(columnIdOrIdx) {
    let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), targetHeader = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, targetIndex = this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? idx : idx - this._options.frozenColumn - 1 : idx;
    return targetHeader.children[targetIndex];
  }
  /** Get the Header Row DOM element */
  getHeaderRow() {
    return this.hasFrozenColumns() ? this._headerRows : this._headerRows[0];
  }
  /** Get the Footer DOM element */
  getFooterRow() {
    return this.hasFrozenColumns() ? this._footerRow : this._footerRow[0];
  }
  /** @alias `getPreHeaderPanelLeft` */
  getPreHeaderPanel() {
    return this._preHeaderPanel;
  }
  /** Get the Pre-Header Panel Left DOM node element */
  getPreHeaderPanelLeft() {
    return this._preHeaderPanel;
  }
  /** Get the Pre-Header Panel Right DOM node element */
  getPreHeaderPanelRight() {
    return this._preHeaderPanelR;
  }
  /**
   * Get Header Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getHeaderRowColumn(columnIdOrIdx) {
    let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), headerRowTarget;
    return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? headerRowTarget = this._headerRowL : (headerRowTarget = this._headerRowR, idx -= this._options.frozenColumn + 1) : headerRowTarget = this._headerRowL, headerRowTarget.children[idx];
  }
  /**
   * Get the Footer Row Column DOM element by its column Id or index
   * @param {Number|String} columnIdOrIdx - column Id or index
   */
  getFooterRowColumn(columnIdOrIdx) {
    let idx = typeof columnIdOrIdx == "number" ? columnIdOrIdx : this.getColumnIndex(columnIdOrIdx), footerRowTarget;
    return this.hasFrozenColumns() ? idx <= this._options.frozenColumn ? footerRowTarget = this._footerRowL : (footerRowTarget = this._footerRowR, idx -= this._options.frozenColumn + 1) : footerRowTarget = this._footerRowL, footerRowTarget.children[idx];
  }
  createColumnFooter() {
    if (this._options.createFooterRow) {
      this._footerRow.forEach((footer) => {
        footer.querySelectorAll(".slick-footerrow-column").forEach((column) => {
          let columnDef = Utils28.storage.get(column, "column");
          this.trigger(this.onBeforeFooterRowCellDestroy, {
            node: column,
            column: columnDef,
            grid: this
          });
        });
      }), Utils28.emptyElement(this._footerRowL), Utils28.emptyElement(this._footerRowR);
      for (let i = 0; i < this.columns.length; i++) {
        let m = this.columns[i];
        if (!m || m.hidden)
          continue;
        let footerRowCell = Utils28.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, this.hasFrozenColumns() && i > this._options.frozenColumn ? this._footerRowR : this._footerRowL), className = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
        className && footerRowCell.classList.add(className), Utils28.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: this
        });
      }
    }
  }
  handleHeaderMouseHoverOn(e) {
    e?.target.classList.add("ui-state-hover", "slick-state-hover");
  }
  handleHeaderMouseHoverOff(e) {
    e?.target.classList.remove("ui-state-hover", "slick-state-hover");
  }
  createColumnHeaders() {
    this._headers.forEach((header) => {
      header.querySelectorAll(".slick-header-column").forEach((column) => {
        let columnDef = Utils28.storage.get(column, "column");
        columnDef && this.trigger(this.onBeforeHeaderCellDestroy, {
          node: column,
          column: columnDef,
          grid: this
        });
      });
    }), Utils28.emptyElement(this._headerL), Utils28.emptyElement(this._headerR), this.getHeadersWidth(), Utils28.width(this._headerL, this.headersWidthL), Utils28.width(this._headerR, this.headersWidthR), this._headerRows.forEach((row) => {
      row.querySelectorAll(".slick-headerrow-column").forEach((column) => {
        let columnDef = Utils28.storage.get(column, "column");
        columnDef && this.trigger(this.onBeforeHeaderRowCellDestroy, {
          node: this,
          column: columnDef,
          grid: this
        });
      });
    }), Utils28.emptyElement(this._headerRowL), Utils28.emptyElement(this._headerRowR), this._options.createFooterRow && (this._footerRowL.querySelectorAll(".slick-footerrow-column").forEach((column) => {
      let columnDef = Utils28.storage.get(column, "column");
      columnDef && this.trigger(this.onBeforeFooterRowCellDestroy, {
        node: this,
        column: columnDef,
        grid: this
      });
    }), Utils28.emptyElement(this._footerRowL), this.hasFrozenColumns() && (this._footerRowR.querySelectorAll(".slick-footerrow-column").forEach((column) => {
      let columnDef = Utils28.storage.get(column, "column");
      columnDef && this.trigger(this.onBeforeFooterRowCellDestroy, {
        node: this,
        column: columnDef,
        grid: this
      });
    }), Utils28.emptyElement(this._footerRowR)));
    for (let i = 0; i < this.columns.length; i++) {
      let m = this.columns[i], headerTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerL : this._headerR : this._headerL, headerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._headerRowL : this._headerRowR : this._headerRowL, header = Utils28.createDomElement("div", { id: `${this.uid + m.id}`, dataset: { id: String(m.id) }, className: "ui-state-default slick-state-default slick-header-column", title: m.toolTip || "" }, headerTarget), colNameElm = Utils28.createDomElement("span", { className: "slick-column-name" }, header);
      this.applyHtmlCode(colNameElm, m.name), Utils28.width(header, m.width - this.headerColumnWidthDiff);
      let classname = m.headerCssClass || null;
      if (classname && header.classList.add(...classname.split(" ")), classname = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null, classname && header.classList.add(classname), this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseEnter.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseLeave.bind(this)), Utils28.storage.put(header, "column", m), (this._options.enableColumnReorder || m.sortable) && (this._bindingEventService.bind(header, "mouseenter", this.handleHeaderMouseHoverOn.bind(this)), this._bindingEventService.bind(header, "mouseleave", this.handleHeaderMouseHoverOff.bind(this))), m.hasOwnProperty("headerCellAttrs") && m.headerCellAttrs instanceof Object)
        for (let key in m.headerCellAttrs)
          m.headerCellAttrs.hasOwnProperty(key) && header.setAttribute(key, m.headerCellAttrs[key]);
      if (m.sortable && (header.classList.add("slick-header-sortable"), Utils28.createDomElement("div", { className: `slick-sort-indicator ${this._options.numberedMultiColumnSort && !this._options.sortColNumberInSeparateSpan ? " slick-sort-indicator-numbered" : ""}` }, header), this._options.numberedMultiColumnSort && this._options.sortColNumberInSeparateSpan && Utils28.createDomElement("div", { className: "slick-sort-indicator-numbered" }, header)), this.trigger(this.onHeaderCellRendered, {
        node: header,
        column: m,
        grid: this
      }), this._options.showHeaderRow) {
        let headerRowCell = Utils28.createDomElement("div", { className: `ui-state-default slick-state-default slick-headerrow-column l${i} r${i}` }, headerRowTarget), frozenClasses = this.hasFrozenColumns() && i <= this._options.frozenColumn ? "frozen" : null;
        frozenClasses && headerRowCell.classList.add(frozenClasses), this._bindingEventService.bind(headerRowCell, "mouseenter", this.handleHeaderRowMouseEnter.bind(this)), this._bindingEventService.bind(headerRowCell, "mouseleave", this.handleHeaderRowMouseLeave.bind(this)), Utils28.storage.put(headerRowCell, "column", m), this.trigger(this.onHeaderRowCellRendered, {
          node: headerRowCell,
          column: m,
          grid: this
        });
      }
      if (this._options.createFooterRow && this._options.showFooterRow) {
        let footerRowTarget = this.hasFrozenColumns() ? i <= this._options.frozenColumn ? this._footerRow[0] : this._footerRow[1] : this._footerRow[0], footerRowCell = Utils28.createDomElement("div", { className: `ui-state-default slick-state-default slick-footerrow-column l${i} r${i}` }, footerRowTarget);
        Utils28.storage.put(footerRowCell, "column", m), this.trigger(this.onFooterRowCellRendered, {
          node: footerRowCell,
          column: m,
          grid: this
        });
      }
    }
    this.setSortColumns(this.sortColumns), this.setupColumnResize(), this._options.enableColumnReorder && (typeof this._options.enableColumnReorder == "function" ? this._options.enableColumnReorder(this, this._headers, this.headerColumnWidthDiff, this.setColumns, this.setupColumnResize, this.columns, this.getColumnIndex, this.uid, this.trigger) : this.setupColumnReorder());
  }
  setupColumnSort() {
    this._headers.forEach((header) => {
      this._bindingEventService.bind(header, "click", (e) => {
        if (this.columnResizeDragging || e.target.classList.contains("slick-resizable-handle"))
          return;
        let coll = e.target.closest(".slick-header-column");
        if (!coll)
          return;
        let column = Utils28.storage.get(coll, "column");
        if (column.sortable) {
          if (!this.getEditorLock()?.commitCurrentEdit())
            return;
          let previousSortColumns = this.sortColumns.slice(), sortColumn = null, i = 0;
          for (; i < this.sortColumns.length; i++)
            if (this.sortColumns[i].columnId === column.id) {
              sortColumn = this.sortColumns[i], sortColumn.sortAsc = !sortColumn.sortAsc;
              break;
            }
          let hadSortCol = !!sortColumn;
          this._options.tristateMultiColumnSort ? (sortColumn || (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }), hadSortCol && sortColumn.sortAsc && (this.sortColumns.splice(i, 1), sortColumn = null), this._options.multiColumnSort || (this.sortColumns = []), sortColumn && (!hadSortCol || !this._options.multiColumnSort) && this.sortColumns.push(sortColumn)) : e.metaKey && this._options.multiColumnSort ? sortColumn && this.sortColumns.splice(i, 1) : ((!e.shiftKey && !e.metaKey || !this._options.multiColumnSort) && (this.sortColumns = []), sortColumn ? this.sortColumns.length === 0 && this.sortColumns.push(sortColumn) : (sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc, sortCol: column }, this.sortColumns.push(sortColumn)));
          let onSortArgs;
          this._options.multiColumnSort ? onSortArgs = {
            multiColumnSort: !0,
            previousSortColumns,
            sortCols: this.sortColumns.map((col) => ({ columnId: this.columns[this.getColumnIndex(col.columnId)].id, sortCol: this.columns[this.getColumnIndex(col.columnId)], sortAsc: col.sortAsc }))
          } : onSortArgs = {
            multiColumnSort: !1,
            previousSortColumns,
            columnId: this.sortColumns.length > 0 ? column.id : null,
            sortCol: this.sortColumns.length > 0 ? column : null,
            sortAsc: this.sortColumns.length > 0 ? this.sortColumns[0].sortAsc : !0
          }, this.trigger(this.onBeforeSort, onSortArgs, e).getReturnValue() !== !1 && (this.setSortColumns(this.sortColumns), this.trigger(this.onSort, onSortArgs, e));
        }
      });
    });
  }
  currentPositionInHeader(id) {
    let currentPosition = 0;
    return this._headers.forEach((header) => {
      header.querySelectorAll(".slick-header-column").forEach((column, i) => {
        column.id === id && (currentPosition = i);
      });
    }), currentPosition;
  }
  remove(arr, elem) {
    let index = arr.lastIndexOf(elem);
    index > -1 && (arr.splice(index, 1), this.remove(arr, elem));
  }
  setupColumnReorder() {
    this.sortableSideLeftInstance?.destroy(), this.sortableSideRightInstance?.destroy();
    let columnScrollTimer = null, scrollColumnsRight = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft + 10, scrollColumnsLeft = () => this._viewportScrollContainerX.scrollLeft = this._viewportScrollContainerX.scrollLeft - 10, canDragScroll, sortableOptions = {
      animation: 50,
      direction: "horizontal",
      chosenClass: "slick-header-column-active",
      ghostClass: "slick-sortable-placeholder",
      draggable: ".slick-header-column",
      dragoverBubble: !1,
      revertClone: !0,
      scroll: !this.hasFrozenColumns(),
      // enable auto-scroll
      onStart: (e) => {
        canDragScroll = !this.hasFrozenColumns() || Utils28.offset(e.item).left > Utils28.offset(this._viewportScrollContainerX).left, canDragScroll && e.originalEvent.pageX > this._container.clientWidth ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsRight, 100)) : canDragScroll && e.originalEvent.pageX < Utils28.offset(this._viewportScrollContainerX).left ? columnScrollTimer || (columnScrollTimer = setInterval(scrollColumnsLeft, 100)) : (clearInterval(columnScrollTimer), columnScrollTimer = null);
      },
      onEnd: (e) => {
        clearInterval(columnScrollTimer), columnScrollTimer = null;
        let limit;
        if (!this.getEditorLock()?.commitCurrentEdit())
          return;
        let reorderedIds = this.sortableSideLeftInstance?.toArray() ?? [];
        reorderedIds = reorderedIds.concat(this.sortableSideRightInstance?.toArray() ?? []);
        let reorderedColumns = [];
        for (let i = 0; i < reorderedIds.length; i++)
          reorderedColumns.push(this.columns[this.getColumnIndex(reorderedIds[i])]);
        this.setColumns(reorderedColumns), this.trigger(this.onColumnsReordered, { impactedColumns: this.getImpactedColumns(limit) }), e.stopPropagation(), this.setupColumnResize(), this.activeCellNode && this.setFocus();
      }
    };
    this.sortableSideLeftInstance = Sortable.create(this._headerL, sortableOptions), this.sortableSideRightInstance = Sortable.create(this._headerR, sortableOptions);
  }
  getHeaderChildren() {
    let a = Array.from(this._headers[0].children), b = Array.from(this._headers[1].children);
    return a.concat(b);
  }
  getImpactedColumns(limit) {
    let impactedColumns = [];
    if (limit)
      for (let i = limit.start; i <= limit.end; i++)
        impactedColumns.push(this.columns[i]);
    else
      impactedColumns = this.columns;
    return impactedColumns;
  }
  handleResizeableHandleDoubleClick(evt) {
    let triggeredByColumn = evt.target.parentElement.id.replace(this.uid, "");
    this.trigger(this.onColumnsResizeDblClick, { triggeredByColumn });
  }
  setupColumnResize() {
    if (typeof Resizable2 > "u")
      throw new Error('Slick.Resizable is undefined, make sure to import "slick.interactions.js"');
    let j, k, c, pageX, minPageX, maxPageX, firstResizable, lastResizable = -1, frozenLeftColMaxWidth = 0, children = this.getHeaderChildren();
    for (let i = 0; i < children.length; i++)
      children[i].querySelectorAll(".slick-resizable-handle").forEach((handle) => handle.remove()), !(i >= this.columns.length || !this.columns[i] || this.columns[i].hidden) && this.columns[i].resizable && (firstResizable === void 0 && (firstResizable = i), lastResizable = i);
    if (firstResizable !== void 0)
      for (let i = 0; i < children.length; i++) {
        let colElm = children[i];
        if (i >= this.columns.length || !this.columns[i] || this.columns[i].hidden || i < firstResizable || this._options.forceFitColumns && i >= lastResizable)
          continue;
        let resizeableHandle = Utils28.createDomElement("div", { className: "slick-resizable-handle", role: "separator", ariaOrientation: "horizontal" }, colElm);
        this._bindingEventService.bind(resizeableHandle, "dblclick", this.handleResizeableHandleDoubleClick.bind(this)), this.slickResizableInstances.push(
          Resizable2({
            resizeableElement: colElm,
            resizeableHandleElement: resizeableHandle,
            onResizeStart: (e, resizeElms) => {
              let targetEvent = e.touches ? e.changedTouches[0] : e;
              if (!this.getEditorLock()?.commitCurrentEdit())
                return !1;
              pageX = targetEvent.pageX, frozenLeftColMaxWidth = 0, resizeElms.resizeableElement.classList.add("slick-header-column-active");
              let shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
              for (let pw = 0; pw < children.length; pw++)
                pw >= this.columns.length || !this.columns[pw] || this.columns[pw].hidden || (this.columns[pw].previousWidth = children[pw].offsetWidth);
              if (this._options.forceFitColumns)
                for (shrinkLeewayOnRight = 0, stretchLeewayOnRight = 0, j = i + 1; j < this.columns.length; j++)
                  c = this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnRight !== null && (c.maxWidth ? stretchLeewayOnRight += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnRight = null), shrinkLeewayOnRight += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
              let shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
              for (j = 0; j <= i; j++)
                c = this.columns[j], c && c.resizable && !c.hidden && (stretchLeewayOnLeft !== null && (c.maxWidth ? stretchLeewayOnLeft += c.maxWidth - (c.previousWidth || 0) : stretchLeewayOnLeft = null), shrinkLeewayOnLeft += (c.previousWidth || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth));
              shrinkLeewayOnRight === null && (shrinkLeewayOnRight = 1e5), shrinkLeewayOnLeft === null && (shrinkLeewayOnLeft = 1e5), stretchLeewayOnRight === null && (stretchLeewayOnRight = 1e5), stretchLeewayOnLeft === null && (stretchLeewayOnLeft = 1e5), maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft), minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
            },
            onResize: (e, resizeElms) => {
              let targetEvent = e.touches ? e.changedTouches[0] : e;
              this.columnResizeDragging = !0;
              let actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, targetEvent.pageX)) - pageX, x, newCanvasWidthL = 0, newCanvasWidthR = 0, viewportWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;
              if (d < 0) {
                for (x = d, j = i; j >= 0; j--)
                  c = this.columns[j], c && c.resizable && !c.hidden && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
                for (k = 0; k <= i; k++)
                  c = this.columns[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                if (this._options.forceFitColumns)
                  for (x = -d, j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                else
                  for (j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                if (this._options.forceFitColumns)
                  for (x = -d, j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], !(!c || c.hidden) && c.resizable && (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x ? (x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth) : (c.width = (c.previousWidth || 0) + x, x = 0));
              } else {
                for (x = d, newCanvasWidthL = 0, newCanvasWidthR = 0, j = i; j >= 0; j--)
                  if (c = this.columns[j], !(!c || c.hidden) && c.resizable)
                    if (x && c.maxWidth && c.maxWidth - (c.previousWidth || 0) < x)
                      x -= c.maxWidth - (c.previousWidth || 0), c.width = c.maxWidth;
                    else {
                      let newWidth = (c.previousWidth || 0) + x, resizedCanvasWidthL = this.canvasWidthL + x;
                      this.hasFrozenColumns() && j <= this._options.frozenColumn ? (newWidth > frozenLeftColMaxWidth && resizedCanvasWidthL < viewportWidth - this._options.frozenRightViewportMinWidth && (frozenLeftColMaxWidth = newWidth), c.width = resizedCanvasWidthL + this._options.frozenRightViewportMinWidth > viewportWidth ? frozenLeftColMaxWidth : newWidth) : c.width = newWidth, x = 0;
                    }
                for (k = 0; k <= i; k++)
                  c = this.columns[k], !(!c || c.hidden) && (this.hasFrozenColumns() && k > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                if (this._options.forceFitColumns)
                  for (x = -d, j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], !(!c || c.hidden) && c.resizable && (actualMinWidth = Math.max(c.minWidth || 0, this.absoluteColumnMinWidth), x && (c.previousWidth || 0) + x < actualMinWidth ? (x += (c.previousWidth || 0) - actualMinWidth, c.width = actualMinWidth) : (c.width = (c.previousWidth || 0) + x, x = 0), this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
                else
                  for (j = i + 1; j < this.columns.length; j++)
                    c = this.columns[j], !(!c || c.hidden) && (this.hasFrozenColumns() && j > this._options.frozenColumn ? newCanvasWidthR += c.width || 0 : newCanvasWidthL += c.width || 0);
              }
              this.hasFrozenColumns() && newCanvasWidthL !== this.canvasWidthL && (Utils28.width(this._headerL, newCanvasWidthL + 1e3), Utils28.setStyleSize(this._paneHeaderR, "left", newCanvasWidthL)), this.applyColumnHeaderWidths(), this._options.syncColumnCellResize && this.applyColumnWidths(), this.trigger(this.onColumnsDrag, {
                triggeredByColumn: resizeElms.resizeableElement,
                resizeHandle: resizeElms.resizeableHandleElement
              });
            },
            onResizeEnd: (_e, resizeElms) => {
              resizeElms.resizeableElement.classList.remove("slick-header-column-active");
              let triggeredByColumn = resizeElms.resizeableElement.id.replace(this.uid, "");
              this.trigger(this.onBeforeColumnsResize, { triggeredByColumn }).getReturnValue() === !0 && this.applyColumnHeaderWidths();
              let newWidth;
              for (j = 0; j < this.columns.length; j++)
                c = this.columns[j], !(!c || c.hidden) && (newWidth = children[j].offsetWidth, c.previousWidth !== newWidth && c.rerenderOnResize && this.invalidateAllRows());
              this.updateCanvasWidth(!0), this.render(), this.trigger(this.onColumnsResized, { triggeredByColumn }), setTimeout(() => {
                this.columnResizeDragging = !1;
              }, 300);
            }
          })
        );
      }
  }
  getVBoxDelta(el) {
    let p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], styles = getComputedStyle(el), delta = 0;
    return p.forEach((val) => delta += Utils28.toFloat(styles[val])), delta;
  }
  setFrozenOptions() {
    if (this._options.frozenColumn = this._options.frozenColumn >= 0 && this._options.frozenColumn < this.columns.length ? parseInt(this._options.frozenColumn, 10) : -1, this._options.frozenRow > -1) {
      this.hasFrozenRows = !0, this.frozenRowsHeight = this._options.frozenRow * this._options.rowHeight;
      let dataLength = this.getDataLength();
      this.actualFrozenRow = this._options.frozenBottom ? dataLength - this._options.frozenRow : this._options.frozenRow;
    } else
      this.hasFrozenRows = !1;
  }
  setPaneVisibility() {
    this.hasFrozenColumns() ? (Utils28.show(this._paneHeaderR), Utils28.show(this._paneTopR), this.hasFrozenRows ? (Utils28.show(this._paneBottomL), Utils28.show(this._paneBottomR)) : (Utils28.hide(this._paneBottomR), Utils28.hide(this._paneBottomL))) : (Utils28.hide(this._paneHeaderR), Utils28.hide(this._paneTopR), Utils28.hide(this._paneBottomR), this.hasFrozenRows ? Utils28.show(this._paneBottomL) : (Utils28.hide(this._paneBottomR), Utils28.hide(this._paneBottomL)));
  }
  setOverflow() {
    this._viewportTopL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportTopR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "scroll" : this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "hidden" : "auto", this._viewportTopR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? this.hasFrozenRows ? "scroll" : "auto" : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomL.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomL.style.overflowY = !this.hasFrozenColumns() && this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "hidden") : this.hasFrozenRows ? "scroll" : "auto", this._viewportBottomR.style.overflowX = this.hasFrozenColumns() ? this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll ? "scroll" : "auto" : (this.hasFrozenRows && !this._options.alwaysAllowHorizontalScroll, "auto"), this._viewportBottomR.style.overflowY = this._options.alwaysShowVerticalScroll ? "scroll" : this.hasFrozenColumns() ? (this.hasFrozenRows, "auto") : (this.hasFrozenRows, "auto"), this._options.viewportClass && (this._viewportTopL.classList.add(...this._options.viewportClass.split(" ")), this._viewportTopR.classList.add(...this._options.viewportClass.split(" ")), this._viewportBottomL.classList.add(...this._options.viewportClass.split(" ")), this._viewportBottomR.classList.add(...this._options.viewportClass.split(" ")));
  }
  setScroller() {
    this.hasFrozenColumns() ? (this._headerScrollContainer = this._headerScrollerR, this._headerRowScrollContainer = this._headerRowScrollerR, this._footerRowScrollContainer = this._footerRowScrollerR, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomR, this._viewportScrollContainerY = this._viewportTopR) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomR : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopR) : (this._headerScrollContainer = this._headerScrollerL, this._headerRowScrollContainer = this._headerRowScrollerL, this._footerRowScrollContainer = this._footerRowScrollerL, this.hasFrozenRows ? this._options.frozenBottom ? (this._viewportScrollContainerX = this._viewportBottomL, this._viewportScrollContainerY = this._viewportTopL) : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportBottomL : this._viewportScrollContainerX = this._viewportScrollContainerY = this._viewportTopL);
  }
  measureCellPaddingAndBorder() {
    let h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], header = this._headers[0];
    this.headerColumnWidthDiff = this.headerColumnHeightDiff = 0, this.cellWidthDiff = this.cellHeightDiff = 0;
    let el = Utils28.createDomElement("div", { className: "ui-state-default slick-state-default slick-header-column", style: { visibility: "hidden" }, textContent: "-" }, header), style = getComputedStyle(el);
    style.boxSizing !== "border-box" && (h.forEach((val) => this.headerColumnWidthDiff += Utils28.toFloat(style[val])), v.forEach((val) => this.headerColumnHeightDiff += Utils28.toFloat(style[val]))), el.remove();
    let r = Utils28.createDomElement("div", { className: "slick-row" }, this._canvas[0]);
    el = Utils28.createDomElement("div", { className: "slick-cell", id: "", style: { visibility: "hidden" }, textContent: "-" }, r), style = getComputedStyle(el), style.boxSizing !== "border-box" && (h.forEach((val) => this.cellWidthDiff += Utils28.toFloat(style[val])), v.forEach((val) => this.cellHeightDiff += Utils28.toFloat(style[val]))), r.remove(), this.absoluteColumnMinWidth = Math.max(this.headerColumnWidthDiff, this.cellWidthDiff);
  }
  createCssRules() {
    this._style = document.createElement("style"), this._style.nonce = this._options.nonce || "", (this._options.shadowRoot || document.head).appendChild(this._style);
    let rowHeight = this._options.rowHeight - this.cellHeightDiff, rules = [
      `.${this.uid} .slick-group-header-column { left: 1000px; }`,
      `.${this.uid} .slick-header-column { left: 1000px; }`,
      `.${this.uid} .slick-top-panel { height: ${this._options.topPanelHeight}px; }`,
      `.${this.uid} .slick-preheader-panel { height: ${this._options.preHeaderPanelHeight}px; }`,
      `.${this.uid} .slick-headerrow-columns { height: ${this._options.headerRowHeight}px; }`,
      `.${this.uid} .slick-footerrow-columns { height: ${this._options.footerRowHeight}px; }`,
      `.${this.uid} .slick-cell { height: ${rowHeight}px; }`,
      `.${this.uid} .slick-row { height: ${this._options.rowHeight}px; }`
    ], sheet = this._style.sheet;
    if (sheet) {
      for (let rule of rules)
        sheet.insertRule(rule);
      for (let i = 0; i < this.columns.length; i++)
        !this.columns[i] || this.columns[i].hidden || (sheet.insertRule(`.${this.uid} .l${i} { }`), sheet.insertRule(`.${this.uid} .r${i} { }`));
    } else
      this.createCssRulesAlternative(rules);
  }
  /** Create CSS rules via template in case the first approach with createElement('style') doesn't work */
  createCssRulesAlternative(rules) {
    let template = document.createElement("template");
    template.innerHTML = '<style type="text/css" rel="stylesheet" />', this._style = template.content.firstChild, (this._options.shadowRoot || document.head).appendChild(this._style);
    for (let i = 0; i < this.columns.length; i++)
      !this.columns[i] || this.columns[i].hidden || (rules.push(`.${this.uid} .l${i} { }`), rules.push(`.${this.uid} .r${i} { }`));
    this._style.styleSheet ? this._style.styleSheet.cssText = rules.join(" ") : this._style.appendChild(document.createTextNode(rules.join(" ")));
  }
  getColumnCssRules(idx) {
    let i;
    if (!this.stylesheet) {
      let sheets = (this._options.shadowRoot || document).styleSheets;
      for (i = 0; i < sheets.length; i++)
        if ((sheets[i].ownerNode || sheets[i].owningElement) === this._style) {
          this.stylesheet = sheets[i];
          break;
        }
      if (!this.stylesheet)
        throw new Error("SlickGrid Cannot find stylesheet.");
      this.columnCssRulesL = [], this.columnCssRulesR = [];
      let cssRules = this.stylesheet.cssRules || this.stylesheet.rules, matches, columnIdx;
      for (i = 0; i < cssRules.length; i++) {
        let selector = cssRules[i].selectorText;
        (matches = /\.l\d+/.exec(selector)) ? (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesL[columnIdx] = cssRules[i]) : (matches = /\.r\d+/.exec(selector)) && (columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10), this.columnCssRulesR[columnIdx] = cssRules[i]);
      }
    }
    return {
      left: this.columnCssRulesL[idx],
      right: this.columnCssRulesR[idx]
    };
  }
  removeCssRules() {
    this._style?.remove(), this.stylesheet = null;
  }
  /**
   * Destroy (dispose) of SlickGrid
   * @param {boolean} shouldDestroyAllElements - do we want to destroy (nullify) all DOM elements as well? This help in avoiding mem leaks
   */
  destroy(shouldDestroyAllElements) {
    this._bindingEventService.unbindAll(), this.slickDraggableInstance = this.destroyAllInstances(this.slickDraggableInstance), this.slickMouseWheelInstances = this.destroyAllInstances(this.slickMouseWheelInstances), this.slickResizableInstances = this.destroyAllInstances(this.slickResizableInstances), this.getEditorLock()?.cancelCurrentEdit(), this.trigger(this.onBeforeDestroy, {});
    let i = this.plugins.length;
    for (; i--; )
      this.unregisterPlugin(this.plugins[i]);
    this._options.enableColumnReorder && typeof this.sortableSideLeftInstance?.destroy == "function" && (this.sortableSideLeftInstance?.destroy(), this.sortableSideRightInstance?.destroy()), this.unbindAncestorScrollEvents(), this._bindingEventService.unbindByEventName(this._container, "resize"), this.removeCssRules(), this._canvas.forEach((element) => {
      this._bindingEventService.unbindByEventName(element, "keydown"), this._bindingEventService.unbindByEventName(element, "click"), this._bindingEventService.unbindByEventName(element, "dblclick"), this._bindingEventService.unbindByEventName(element, "contextmenu"), this._bindingEventService.unbindByEventName(element, "mouseover"), this._bindingEventService.unbindByEventName(element, "mouseout");
    }), this._viewport.forEach((view) => {
      this._bindingEventService.unbindByEventName(view, "scroll");
    }), this._headerScroller.forEach((el) => {
      this._bindingEventService.unbindByEventName(el, "contextmenu"), this._bindingEventService.unbindByEventName(el, "click");
    }), this._headerRowScroller.forEach((scroller) => {
      this._bindingEventService.unbindByEventName(scroller, "scroll");
    }), this._footerRow && this._footerRow.forEach((footer) => {
      this._bindingEventService.unbindByEventName(footer, "contextmenu"), this._bindingEventService.unbindByEventName(footer, "click");
    }), this._footerRowScroller && this._footerRowScroller.forEach((scroller) => {
      this._bindingEventService.unbindByEventName(scroller, "scroll");
    }), this._preHeaderPanelScroller && this._bindingEventService.unbindByEventName(this._preHeaderPanelScroller, "scroll"), this._bindingEventService.unbindByEventName(this._focusSink, "keydown"), this._bindingEventService.unbindByEventName(this._focusSink2, "keydown");
    let resizeHandles = this._container.querySelectorAll(".slick-resizable-handle");
    [].forEach.call(resizeHandles, (handle) => {
      this._bindingEventService.unbindByEventName(handle, "dblclick");
    });
    let headerColumns = this._container.querySelectorAll(".slick-header-column");
    [].forEach.call(headerColumns, (column) => {
      this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave"), this._bindingEventService.unbindByEventName(column, "mouseenter"), this._bindingEventService.unbindByEventName(column, "mouseleave");
    }), Utils28.emptyElement(this._container), this._container.classList.remove(this.uid), shouldDestroyAllElements && this.destroyAllElements();
  }
  /**
   * call destroy method, when exists, on all the instance(s) it found
   * @params instances - can be a single instance or a an array of instances
   */
  destroyAllInstances(inputInstances) {
    if (inputInstances) {
      let instances = Array.isArray(inputInstances) ? inputInstances : [inputInstances], instance;
      for (; Utils28.isDefined(instance = instances.pop()); )
        instance && typeof instance.destroy == "function" && instance.destroy();
    }
    return inputInstances = Array.isArray(inputInstances) ? [] : null, inputInstances;
  }
  destroyAllElements() {
    this._activeCanvasNode = null, this._activeViewportNode = null, this._boundAncestors = null, this._canvas = null, this._canvasTopL = null, this._canvasTopR = null, this._canvasBottomL = null, this._canvasBottomR = null, this._container = null, this._focusSink = null, this._focusSink2 = null, this._groupHeaders = null, this._groupHeadersL = null, this._groupHeadersR = null, this._headerL = null, this._headerR = null, this._headers = null, this._headerRows = null, this._headerRowL = null, this._headerRowR = null, this._headerRowSpacerL = null, this._headerRowSpacerR = null, this._headerRowScrollContainer = null, this._headerRowScroller = null, this._headerRowScrollerL = null, this._headerRowScrollerR = null, this._headerScrollContainer = null, this._headerScroller = null, this._headerScrollerL = null, this._headerScrollerR = null, this._hiddenParents = null, this._footerRow = null, this._footerRowL = null, this._footerRowR = null, this._footerRowSpacerL = null, this._footerRowSpacerR = null, this._footerRowScroller = null, this._footerRowScrollerL = null, this._footerRowScrollerR = null, this._footerRowScrollContainer = null, this._preHeaderPanel = null, this._preHeaderPanelR = null, this._preHeaderPanelScroller = null, this._preHeaderPanelScrollerR = null, this._preHeaderPanelSpacer = null, this._preHeaderPanelSpacerR = null, this._topPanels = null, this._topPanelScrollers = null, this._style = null, this._topPanelScrollerL = null, this._topPanelScrollerR = null, this._topPanelL = null, this._topPanelR = null, this._paneHeaderL = null, this._paneHeaderR = null, this._paneTopL = null, this._paneTopR = null, this._paneBottomL = null, this._paneBottomR = null, this._viewport = null, this._viewportTopL = null, this._viewportTopR = null, this._viewportBottomL = null, this._viewportBottomR = null, this._viewportScrollContainerX = null, this._viewportScrollContainerY = null;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Column Autosizing
  //////////////////////////////////////////////////////////////////////////////////////////////
  /** Proportionally resize a specific column by its name, index or Id */
  autosizeColumn(columnOrIndexOrId, isInit) {
    let colDef = null, colIndex = -1;
    if (typeof columnOrIndexOrId == "number")
      colDef = this.columns[columnOrIndexOrId], colIndex = columnOrIndexOrId;
    else if (typeof columnOrIndexOrId == "string")
      for (let i = 0; i < this.columns.length; i++)
        this.columns[i].id === columnOrIndexOrId && (colDef = this.columns[i], colIndex = i);
    if (!colDef)
      return;
    let gridCanvas = this.getCanvasNode(0, 0);
    this.getColAutosizeWidth(colDef, colIndex, gridCanvas, isInit || !1, colIndex);
  }
  treatAsLocked(autoSize = {}) {
    return !autoSize.ignoreHeaderText && !autoSize.sizeToRemaining && autoSize.contentSizePx === autoSize.headerWidthPx && (autoSize.widthPx ?? 0) < 100;
  }
  /** Proportionately resizes all columns to fill available horizontal space. This does not take the cell contents into consideration. */
  autosizeColumns(autosizeMode, isInit) {
    this.cacheCssForHiddenInit(), this.internalAutosizeColumns(autosizeMode, isInit), this.restoreCssFromHiddenInit();
  }
  internalAutosizeColumns(autosizeMode, isInit) {
    if (autosizeMode = autosizeMode || this._options.autosizeColsMode, autosizeMode === GridAutosizeColsMode2.LegacyForceFit || autosizeMode === GridAutosizeColsMode2.LegacyOff) {
      this.legacyAutosizeColumns();
      return;
    }
    if (autosizeMode === GridAutosizeColsMode2.None)
      return;
    this.canvas = document.createElement("canvas"), this.canvas?.getContext && (this.canvas_context = this.canvas.getContext("2d"));
    let gridCanvas = this.getCanvasNode(0, 0), viewportWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW, i, c, colWidth, reRender = !1, totalWidth = 0, totalWidthLessSTR = 0, strColsMinWidth = 0, totalMinWidth = 0, totalLockedColWidth = 0;
    for (i = 0; i < this.columns.length; i++)
      c = this.columns[i], this.getColAutosizeWidth(c, i, gridCanvas, isInit || !1, i), totalLockedColWidth += c.autoSize?.autosizeMode === ColAutosizeMode2.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) && c.autoSize?.widthPx || 0, totalMinWidth += c.autoSize?.autosizeMode === ColAutosizeMode2.Locked ? c.width || 0 : this.treatAsLocked(c.autoSize) ? c.autoSize?.widthPx || 0 : c.minWidth || 0, totalWidth += c.autoSize?.widthPx || 0, totalWidthLessSTR += c.autoSize?.sizeToRemaining ? 0 : c.autoSize?.widthPx || 0, strColsMinWidth += c.autoSize?.sizeToRemaining && c.minWidth || 0;
    let strColTotalGuideWidth = totalWidth - totalWidthLessSTR;
    if (autosizeMode === GridAutosizeColsMode2.FitViewportToCols) {
      let setWidth = totalWidth + (this.scrollbarDimensions?.width ?? 0);
      autosizeMode = GridAutosizeColsMode2.IgnoreViewport, this._options.viewportMaxWidthPx && setWidth > this._options.viewportMaxWidthPx ? (setWidth = this._options.viewportMaxWidthPx, autosizeMode = GridAutosizeColsMode2.FitColsToViewport) : this._options.viewportMinWidthPx && setWidth < this._options.viewportMinWidthPx && (setWidth = this._options.viewportMinWidthPx, autosizeMode = GridAutosizeColsMode2.FitColsToViewport), Utils28.width(this._container, setWidth);
    }
    if (autosizeMode === GridAutosizeColsMode2.FitColsToViewport)
      if (strColTotalGuideWidth > 0 && totalWidthLessSTR < viewportWidth - strColsMinWidth)
        for (i = 0; i < this.columns.length; i++) {
          if (c = this.columns[i], !c || c.hidden)
            continue;
          let totalSTRViewportWidth = viewportWidth - totalWidthLessSTR;
          c.autoSize?.sizeToRemaining ? colWidth = totalSTRViewportWidth * (c.autoSize?.widthPx || 0) / strColTotalGuideWidth : colWidth = c.autoSize?.widthPx || 0, c.rerenderOnResize && (c.width || 0) !== colWidth && (reRender = !0), c.width = colWidth;
        }
      else if (this._options.viewportSwitchToScrollModeWidthPercent && totalWidthLessSTR + strColsMinWidth > viewportWidth * this._options.viewportSwitchToScrollModeWidthPercent / 100 || totalMinWidth > viewportWidth)
        autosizeMode = GridAutosizeColsMode2.IgnoreViewport;
      else {
        let unallocatedColWidth = totalWidthLessSTR - totalLockedColWidth, unallocatedViewportWidth = viewportWidth - totalLockedColWidth - strColsMinWidth;
        for (i = 0; i < this.columns.length; i++)
          c = this.columns[i], !(!c || c.hidden) && (colWidth = c.width || 0, c.autoSize?.autosizeMode !== ColAutosizeMode2.Locked && !this.treatAsLocked(c.autoSize) && (c.autoSize?.sizeToRemaining ? colWidth = c.minWidth || 0 : (colWidth = unallocatedViewportWidth / unallocatedColWidth * (c.autoSize?.widthPx || 0) - 1, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0), unallocatedColWidth -= c.autoSize?.widthPx || 0, unallocatedViewportWidth -= colWidth)), this.treatAsLocked(c.autoSize) && (colWidth = c.autoSize?.widthPx || 0, colWidth < (c.minWidth || 0) && (colWidth = c.minWidth || 0)), c.rerenderOnResize && c.width !== colWidth && (reRender = !0), c.width = colWidth);
      }
    if (autosizeMode === GridAutosizeColsMode2.IgnoreViewport)
      for (i = 0; i < this.columns.length; i++)
        !this.columns[i] || this.columns[i].hidden || (colWidth = this.columns[i].autoSize?.widthPx || 0, this.columns[i].rerenderOnResize && this.columns[i].width !== colWidth && (reRender = !0), this.columns[i].width = colWidth);
    this.reRenderColumns(reRender);
  }
  LogColWidths() {
    let s = "Col Widths:";
    for (let i = 0; i < this.columns.length; i++)
      s += " " + (this.columns[i].hidden ? "H" : this.columns[i].width);
    console.log(s);
  }
  getColAutosizeWidth(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
    let autoSize = columnDef.autoSize;
    if (autoSize.widthPx = columnDef.width, autoSize.autosizeMode === ColAutosizeMode2.Locked || autoSize.autosizeMode === ColAutosizeMode2.Guide)
      return;
    let dl = this.getDataLength(), isoDateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/);
    if (autoSize.autosizeMode === ColAutosizeMode2.ContentIntelligent) {
      let colDataTypeOf = autoSize.colDataTypeOf, colDataItem;
      if (dl > 0) {
        let tempRow = this.getDataItem(0);
        tempRow && (colDataItem = tempRow[columnDef.field], isoDateRegExp.test(colDataItem) && (colDataItem = Date.parse(colDataItem)), colDataTypeOf = typeof colDataItem, colDataTypeOf === "object" && (colDataItem instanceof Date && (colDataTypeOf = "date"), typeof moment < "u" && colDataItem instanceof moment && (colDataTypeOf = "moment")));
      }
      colDataTypeOf === "boolean" && (autoSize.colValueArray = [!0, !1]), colDataTypeOf === "number" && (autoSize.valueFilterMode = ValueFilterMode2.GetGreatestAndSub, autoSize.rowSelectionMode = RowSelectionMode2.AllRows), colDataTypeOf === "string" && (autoSize.valueFilterMode = ValueFilterMode2.GetLongestText, autoSize.rowSelectionMode = RowSelectionMode2.AllRows, autoSize.allowAddlPercent = 5), colDataTypeOf === "date" && (autoSize.colValueArray = [new Date(2009, 8, 30, 12, 20, 20)]), colDataTypeOf === "moment" && typeof moment < "u" && (autoSize.colValueArray = [moment([2009, 8, 30, 12, 20, 20])]);
    }
    let colWidth = autoSize.contentSizePx = this.getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex);
    colWidth === 0 && (colWidth = autoSize.widthPx || 0);
    let addlPercentMultiplier = autoSize.allowAddlPercent ? 1 + autoSize.allowAddlPercent / 100 : 1;
    colWidth = colWidth * addlPercentMultiplier + (this._options.autosizeColPaddingPx || 0), columnDef.minWidth && colWidth < columnDef.minWidth && (colWidth = columnDef.minWidth), columnDef.maxWidth && colWidth > columnDef.maxWidth && (colWidth = columnDef.maxWidth), (autoSize.autosizeMode === ColAutosizeMode2.ContentExpandOnly || columnDef?.editor?.ControlFillsColumn) && colWidth < (columnDef.width || 0) && (colWidth = columnDef.width || 0), autoSize.widthPx = colWidth;
  }
  getColContentSize(columnDef, colIndex, gridCanvas, isInit, colArrayIndex) {
    let autoSize = columnDef.autoSize, widthAdjustRatio = 1, i, tempVal, maxLen = 0, maxColWidth = 0;
    if (autoSize.headerWidthPx = 0, autoSize.ignoreHeaderText || (autoSize.headerWidthPx = this.getColHeaderWidth(columnDef)), autoSize.headerWidthPx === 0 && (autoSize.headerWidthPx = columnDef.width ? columnDef.width : columnDef.maxWidth ? columnDef.maxWidth : columnDef.minWidth ? columnDef.minWidth : 20), autoSize.colValueArray)
      return maxColWidth = this.getColWidth(columnDef, gridCanvas, autoSize.colValueArray), Math.max(autoSize.headerWidthPx, maxColWidth);
    let rowInfo = {};
    rowInfo.colIndex = colIndex, rowInfo.rowCount = this.getDataLength(), rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.rowCount - 1, rowInfo.valueArr = null, rowInfo.getRowVal = (j) => this.getDataItem(j)[columnDef.field];
    let rowSelectionMode = (isInit ? autoSize.rowSelectionModeOnInit : void 0) || autoSize.rowSelectionMode;
    if (rowSelectionMode === RowSelectionMode2.FirstRow && (rowInfo.endIndex = 0), rowSelectionMode === RowSelectionMode2.LastRow && (rowInfo.endIndex = rowInfo.startIndex = rowInfo.rowCount - 1), rowSelectionMode === RowSelectionMode2.FirstNRows && (rowInfo.endIndex = Math.min(autoSize.rowSelectionCount || 0, rowInfo.rowCount) - 1), autoSize.valueFilterMode === ValueFilterMode2.DeDuplicate) {
      let rowsDict = {};
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        rowsDict[rowInfo.getRowVal(i)] = !0;
      if (Object.keys)
        rowInfo.valueArr = Object.keys(rowsDict);
      else {
        rowInfo.valueArr = [];
        for (let v in rowsDict)
          rowsDict && rowInfo.valueArr.push(v);
      }
      rowInfo.startIndex = 0, rowInfo.endIndex = rowInfo.length - 1;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetGreatestAndSub) {
      let maxVal, maxAbsVal = 0;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        tempVal = rowInfo.getRowVal(i), Math.abs(tempVal) > maxAbsVal && (maxVal = tempVal, maxAbsVal = Math.abs(tempVal));
      maxVal = "" + maxVal, maxVal = Array(maxVal.length + 1).join("9"), maxVal = +maxVal, rowInfo.valueArr = [maxVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetLongestTextAndSub) {
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        tempVal = rowInfo.getRowVal(i), (tempVal || "").length > maxLen && (maxLen = tempVal.length);
      tempVal = Array(maxLen + 1).join("m"), widthAdjustRatio = this._options.autosizeTextAvgToMWidthRatio || 0, rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    if (autoSize.valueFilterMode === ValueFilterMode2.GetLongestText) {
      maxLen = 0;
      let maxIndex = 0;
      for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        tempVal = rowInfo.getRowVal(i), (tempVal || "").length > maxLen && (maxLen = tempVal.length, maxIndex = i);
      tempVal = rowInfo.getRowVal(maxIndex), rowInfo.maxLen = maxLen, rowInfo.valueArr = [tempVal], rowInfo.startIndex = rowInfo.endIndex = 0;
    }
    return rowInfo.maxLen && rowInfo.maxLen > 30 && colArrayIndex > 1 && (autoSize.sizeToRemaining = !0), maxColWidth = this.getColWidth(columnDef, gridCanvas, rowInfo) * widthAdjustRatio, Math.max(autoSize.headerWidthPx, maxColWidth);
  }
  getColWidth(columnDef, gridCanvas, rowInfo) {
    let rowEl = Utils28.createDomElement("div", { className: "slick-row ui-widget-content" }, gridCanvas), cellEl = Utils28.createDomElement("div", { className: "slick-cell" }, rowEl);
    cellEl.style.position = "absolute", cellEl.style.visibility = "hidden", cellEl.style.textOverflow = "initial", cellEl.style.whiteSpace = "nowrap";
    let i, len, max = 0, maxText = "", formatterResult, val, useCanvas = columnDef.autoSize.widthEvalMode === WidthEvalMode2.TextOnly;
    if (columnDef.autoSize?.widthEvalMode === WidthEvalMode2.Auto) {
      let noFormatter = !columnDef.formatterOverride && !columnDef.formatter, formatterIsText = columnDef?.formatterOverride?.ReturnsTextOnly || !columnDef.formatterOverride && columnDef.formatter?.ReturnsTextOnly;
      useCanvas = noFormatter || formatterIsText;
    }
    if (this.canvas_context && useCanvas) {
      let style = getComputedStyle(cellEl);
      for (this.canvas_context.font = style.fontSize + " " + style.fontFamily, i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
        val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, len = formatterResult ? this.canvas_context.measureText(formatterResult).width : 0, len > max && (max = len, maxText = formatterResult);
      return cellEl.textContent = maxText, len = cellEl.offsetWidth, rowEl.remove(), len;
    }
    for (i = rowInfo.startIndex; i <= rowInfo.endIndex; i++)
      val = rowInfo.valueArr ? rowInfo.valueArr[i] : rowInfo.getRowVal(i), columnDef.formatterOverride ? formatterResult = columnDef.formatterOverride(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : columnDef.formatter ? formatterResult = columnDef.formatter(i, rowInfo.colIndex, val, columnDef, this.getDataItem(i), this) : formatterResult = "" + val, this.applyFormatResultToCellNode(formatterResult, cellEl), len = cellEl.offsetWidth, len > max && (max = len);
    return rowEl.remove(), max;
  }
  getColHeaderWidth(columnDef) {
    let width = 0, headerColElId = this.getUID() + columnDef.id, headerColEl = document.getElementById(headerColElId), dummyHeaderColElId = `${headerColElId}_`, clone = headerColEl.cloneNode(!0);
    if (headerColEl)
      clone.id = dummyHeaderColElId, clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", headerColEl.parentNode.insertBefore(clone, headerColEl), width = clone.offsetWidth, clone.parentNode.removeChild(clone);
    else {
      let header = this.getHeader(columnDef);
      headerColEl = Utils28.createDomElement("div", { id: dummyHeaderColElId, className: "ui-state-default slick-state-default slick-header-column" }, header);
      let colNameElm = Utils28.createDomElement("span", { className: "slick-column-name" }, headerColEl);
      this.applyHtmlCode(colNameElm, columnDef.name), clone.style.cssText = "position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;", columnDef.headerCssClass && headerColEl.classList.add(...(columnDef.headerCssClass || "").split(" ")), width = headerColEl.offsetWidth, header.removeChild(headerColEl);
    }
    return width;
  }
  legacyAutosizeColumns() {
    let i, c, shrinkLeeway = 0, total = 0, prevTotal = 0, widths = [], availWidth = this.viewportHasVScroll ? this.viewportW - (this.scrollbarDimensions?.width ?? 0) : this.viewportW;
    for (i = 0; i < this.columns.length; i++)
      c = this.columns[i], !(!c || c.hidden) && (widths.push(c.width || 0), total += c.width || 0, c.resizable && (shrinkLeeway += (c.width || 0) - Math.max(c.minWidth || 0, this.absoluteColumnMinWidth)));
    for (prevTotal = total; total > availWidth && shrinkLeeway; ) {
      let shrinkProportion = (total - availWidth) / shrinkLeeway;
      for (i = 0; i < this.columns.length && total > availWidth; i++) {
        if (c = this.columns[i], !c || c.hidden)
          continue;
        let width = widths[i];
        if (!c.resizable || width <= c.minWidth || width <= this.absoluteColumnMinWidth)
          continue;
        let absMinWidth = Math.max(c.minWidth, this.absoluteColumnMinWidth), shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
        shrinkSize = Math.min(shrinkSize, width - absMinWidth), total -= shrinkSize, shrinkLeeway -= shrinkSize, widths[i] -= shrinkSize;
      }
      if (prevTotal <= total)
        break;
      prevTotal = total;
    }
    for (prevTotal = total; total < availWidth; ) {
      let growProportion = availWidth / total;
      for (i = 0; i < this.columns.length && total < availWidth; i++) {
        if (c = this.columns[i], !c || c.hidden)
          continue;
        let currentWidth = widths[i], growSize;
        !c.resizable || c.maxWidth <= currentWidth ? growSize = 0 : growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1e6) || 1, total += growSize, widths[i] += total <= availWidth ? growSize : 0;
      }
      if (prevTotal >= total)
        break;
      prevTotal = total;
    }
    let reRender = !1;
    for (i = 0; i < this.columns.length; i++)
      !c || c.hidden || (this.columns[i].rerenderOnResize && this.columns[i].width !== widths[i] && (reRender = !0), this.columns[i].width = widths[i]);
    this.reRenderColumns(reRender);
  }
  /**
   * Apply Columns Widths in the UI and optionally invalidate & re-render the columns when specified
   * @param {Boolean} shouldReRender - should we invalidate and re-render the grid?
   */
  reRenderColumns(reRender) {
    this.applyColumnHeaderWidths(), this.updateCanvasWidth(!0), this.trigger(this.onAutosizeColumns, { columns: this.columns }), reRender && (this.invalidateAllRows(), this.render());
  }
  getVisibleColumns() {
    return this.columns.filter((c) => !c.hidden);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // General
  //////////////////////////////////////////////////////////////////////////////////////////////
  trigger(evt, args, e) {
    let event2 = e || new SlickEventData8(e, args), eventArgs = args || {};
    return eventArgs.grid = this, evt.notify(eventArgs, event2, this);
  }
  /** Get Editor lock */
  getEditorLock() {
    return this._options.editorLock;
  }
  /** Get Editor Controller */
  getEditController() {
    return this.editController;
  }
  /**
   * Returns the index of a column with a given id. Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
   * @param {String | Number} id A column id.
   */
  getColumnIndex(id) {
    return this.columnsById[id];
  }
  applyColumnHeaderWidths() {
    if (!this.initialized)
      return;
    let columnIndex = 0, vc = this.getVisibleColumns();
    this._headers.forEach((header) => {
      for (let i = 0; i < header.children.length; i++, columnIndex++) {
        let h = header.children[i], width = ((vc[columnIndex] || {}).width || 0) - this.headerColumnWidthDiff;
        Utils28.width(h) !== width && Utils28.width(h, width);
      }
    }), this.updateColumnCaches();
  }
  applyColumnWidths() {
    let x = 0, w = 0, rule;
    for (let i = 0; i < this.columns.length; i++)
      this.columns[i]?.hidden || (w = this.columns[i].width || 0, rule = this.getColumnCssRules(i), rule.left.style.left = `${x}px`, rule.right.style.right = (this._options.frozenColumn !== -1 && i > this._options.frozenColumn ? this.canvasWidthR : this.canvasWidthL) - x - w + "px", this._options.frozenColumn !== i && (x += this.columns[i].width)), this._options.frozenColumn === i && (x = 0);
  }
  /**
   * Accepts a columnId string and an ascending boolean. Applies a sort glyph in either ascending or descending form to the header of the column. Note that this does not actually sort the column. It only adds the sort glyph to the header.
   * @param {String | Number} columnId
   * @param {Boolean} ascending
   */
  setSortColumn(columnId, ascending) {
    this.setSortColumns([{ columnId, sortAsc: ascending }]);
  }
  /**
   * Get column by index
   * @param {Number} id - column index
   * @returns
   */
  getColumnByIndex(id) {
    let result;
    return this._headers.every((header) => {
      let length = header.children.length;
      return id < length ? (result = header.children[id], !1) : (id -= length, !0);
    }), result;
  }
  /**
   * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ]. When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array. Note that this does not actually sort the column. It only adds the sort glyph to the header
   * @param {ColumnSort[]} cols - column sort
   */
  setSortColumns(cols) {
    this.sortColumns = cols;
    let numberCols = this._options.numberedMultiColumnSort && this.sortColumns.length > 1;
    this._headers.forEach((header) => {
      let indicators = header.querySelectorAll(".slick-header-column-sorted");
      indicators.forEach((indicator) => {
        indicator.classList.remove("slick-header-column-sorted");
      }), indicators = header.querySelectorAll(".slick-sort-indicator"), indicators.forEach((indicator) => {
        indicator.classList.remove("slick-sort-indicator-asc"), indicator.classList.remove("slick-sort-indicator-desc");
      }), indicators = header.querySelectorAll(".slick-sort-indicator-numbered"), indicators.forEach((el) => {
        el.textContent = "";
      });
    });
    let i = 1;
    this.sortColumns.forEach((col) => {
      Utils28.isDefined(col.sortAsc) || (col.sortAsc = !0);
      let columnIndex = this.getColumnIndex(col.columnId);
      if (Utils28.isDefined(columnIndex)) {
        let column = this.getColumnByIndex(columnIndex);
        if (column) {
          column.classList.add("slick-header-column-sorted");
          let indicator = column.querySelector(".slick-sort-indicator");
          indicator.classList.add(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc"), numberCols && (indicator = column.querySelector(".slick-sort-indicator-numbered"), indicator.textContent = String(i));
        }
      }
      i++;
    });
  }
  /** Get sorted columns **/
  getSortColumns() {
    return this.sortColumns;
  }
  handleSelectedRangesChanged(e, ranges) {
    let ne = e.getNativeEvent(), previousSelectedRows = this.selectedRows.slice(0);
    this.selectedRows = [];
    let hash = {};
    for (let i = 0; i < ranges.length; i++)
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] || (this.selectedRows.push(j), hash[j] = {});
        for (let k = ranges[i].fromCell; k <= ranges[i].toCell; k++)
          this.canCellBeSelected(j, k) && (hash[j][this.columns[k].id] = this._options.selectedCellCssClass);
      }
    if (this.setCellCssStyles(this._options.selectedCellCssClass || "", hash), this.simpleArrayEquals(previousSelectedRows, this.selectedRows)) {
      let caller = ne?.detail?.caller ?? "click", newSelectedAdditions = this.getSelectedRows().filter((i) => previousSelectedRows.indexOf(i) < 0), newSelectedDeletions = previousSelectedRows.filter((i) => this.getSelectedRows().indexOf(i) < 0);
      this.trigger(this.onSelectedRowsChanged, {
        rows: this.getSelectedRows(),
        previousSelectedRows,
        caller,
        changedSelectedRows: newSelectedAdditions,
        changedUnselectedRows: newSelectedDeletions
      }, e);
    }
  }
  // compare 2 simple arrays (integers or strings only, do not use to compare object arrays)
  simpleArrayEquals(arr1, arr2) {
    return Array.isArray(arr1) && Array.isArray(arr2) && arr2.sort().toString() !== arr1.sort().toString();
  }
  /** Returns an array of column definitions. */
  getColumns() {
    return this.columns;
  }
  updateColumnCaches() {
    this.columnPosLeft = [], this.columnPosRight = [];
    let x = 0;
    for (let i = 0, ii = this.columns.length; i < ii; i++)
      !this.columns[i] || this.columns[i].hidden || (this.columnPosLeft[i] = x, this.columnPosRight[i] = x + (this.columns[i].width || 0), this._options.frozenColumn === i ? x = 0 : x += this.columns[i].width || 0);
  }
  updateColumnProps() {
    this.columnsById = {};
    for (let i = 0; i < this.columns.length; i++) {
      let m = this.columns[i];
      m.width && (m.widthRequest = m.width), this.options.mixinDefaults ? (Utils28.applyDefaults(m, this._columnDefaults), m.autoSize || (m.autoSize = {}), Utils28.applyDefaults(m.autoSize, this._columnAutosizeDefaults)) : (m = this.columns[i] = Utils28.extend({}, this._columnDefaults, m), m.autoSize = Utils28.extend({}, this._columnAutosizeDefaults, m.autoSize)), this.columnsById[m.id] = i, m.minWidth && (m.width || 0) < m.minWidth && (m.width = m.minWidth), m.maxWidth && (m.width || 0) > m.maxWidth && (m.width = m.maxWidth);
    }
  }
  /**
   * Sets grid columns. Column headers will be recreated and all rendered rows will be removed. To rerender the grid (if necessary), call render().
   * @param {Column[]} columnDefinitions An array of column definitions.
   */
  setColumns(columnDefinitions) {
    this.trigger(this.onBeforeSetColumns, { previousColumns: this.columns, newColumns: columnDefinitions, grid: this }), this.columns = columnDefinitions, this.updateColumnsInternal();
  }
  updateColumns() {
    this.trigger(this.onBeforeUpdateColumns, { columns: this.columns, grid: this }), this.updateColumnsInternal();
  }
  updateColumnsInternal() {
    this.updateColumnProps(), this.updateColumnCaches(), this.initialized && (this.setPaneVisibility(), this.setOverflow(), this.invalidateAllRows(), this.createColumnHeaders(), this.createColumnFooter(), this.removeCssRules(), this.createCssRules(), this.resizeCanvas(), this.updateCanvasWidth(), this.applyColumnHeaderWidths(), this.applyColumnWidths(), this.handleScroll(), this.getSelectionModel()?.refreshSelections());
  }
  /** Returns an object containing all of the Grid options set on the grid. See a list of Grid Options here.  */
  getOptions() {
    return this._options;
  }
  /**
   * Extends grid options with a given hash. If an there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.
   * @param {Object} options - an object with configuration options.
   * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
   * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
   * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
   */
  setOptions(args, suppressRender, suppressColumnSet, suppressSetOverflow) {
    this.prepareForOptionsChange(), this._options.enableAddRow !== args.enableAddRow && this.invalidateRow(this.getDataLength()), args.frozenColumn && (this.getViewports().forEach((vp) => vp.scrollLeft = 0), this.handleScroll());
    let originalOptions = Utils28.extend(!0, {}, this._options);
    this._options = Utils28.extend(this._options, args), this.trigger(this.onSetOptions, { optionsBefore: originalOptions, optionsAfter: this._options }), this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
  }
  /**
   * If option.mixinDefaults is true then external code maintains a reference to the options object. In this case there is no need
   * to call setOptions() - changes can be made directly to the object. However setOptions() also performs some recalibration of the
   * grid in reaction to changed options. activateChangedOptions call the same recalibration routines as setOptions() would have.
   * @param {Boolean} [suppressRender] - do we want to supress the grid re-rendering? (defaults to false)
   * @param {Boolean} [suppressColumnSet] - do we want to supress the columns set, via "setColumns()" method? (defaults to false)
   * @param {Boolean} [suppressSetOverflow] - do we want to suppress the call to `setOverflow`
   */
  activateChangedOptions(suppressRender, suppressColumnSet, suppressSetOverflow) {
    this.prepareForOptionsChange(), this.invalidateRow(this.getDataLength()), this.trigger(this.onActivateChangedOptions, { options: this._options }), this.internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow);
  }
  prepareForOptionsChange() {
    this.getEditorLock().commitCurrentEdit() && this.makeActiveCellNormal();
  }
  internal_setOptions(suppressRender, suppressColumnSet, suppressSetOverflow) {
    this._options.showColumnHeader !== void 0 && this.setColumnHeaderVisibility(this._options.showColumnHeader), this.validateAndEnforceOptions(), this.setFrozenOptions(), this._options.frozenBottom !== void 0 && (this.enforceFrozenRowHeightRecalc = !0), this._viewport.forEach((view) => {
      view.style.overflowY = this._options.autoHeight ? "hidden" : "auto";
    }), suppressRender || this.render(), this.setScroller(), suppressSetOverflow || this.setOverflow(), suppressColumnSet || this.setColumns(this.columns), this._options.enableMouseWheelScrollHandler && this._viewport && (!this.slickMouseWheelInstances || this.slickMouseWheelInstances.length === 0) ? this._viewport.forEach((view) => {
      this.slickMouseWheelInstances.push(MouseWheel2({
        element: view,
        onMouseWheel: this.handleMouseWheel.bind(this)
      }));
    }) : this._options.enableMouseWheelScrollHandler === !1 && this.destroyAllInstances(this.slickMouseWheelInstances);
  }
  validateAndEnforceOptions() {
    this._options.autoHeight && (this._options.leaveSpaceForNewRows = !1), this._options.forceFitColumns && (this._options.autosizeColsMode = GridAutosizeColsMode2.LegacyForceFit, console.log("forceFitColumns option is deprecated - use autosizeColsMode"));
  }
  /**
   * Sets a new source for databinding and removes all rendered rows. Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
   * @param {CustomDataView|Array<*>} newData New databinding source using a regular JavaScript array.. or a custom object exposing getItem(index) and getLength() functions.
   * @param {Number} [scrollToTop] If true, the grid will reset the vertical scroll position to the top of the grid.
   */
  setData(newData, scrollToTop) {
    this.data = newData, this.invalidateAllRows(), this.updateRowCount(), scrollToTop && this.scrollTo(0);
  }
  /** Returns an array of every data object, unless you're using DataView in which case it returns a DataView object. */
  getData() {
    return this.data;
  }
  /** Returns the size of the databinding source. */
  getDataLength() {
    return this.data.getLength ? this.data.getLength() : this.data?.length ?? 0;
  }
  getDataLengthIncludingAddNew() {
    return this.getDataLength() + (this._options.enableAddRow && (!this.pagingActive || this.pagingIsLastPage) ? 1 : 0);
  }
  /**
   * Returns the databinding item at a given position.
   * @param {Number} index Item row index.
   */
  getDataItem(i) {
    return this.data.getItem ? this.data.getItem(i) : this.data[i];
  }
  /** Get Top Panel DOM element */
  getTopPanel() {
    return this._topPanels[0];
  }
  /** Get Top Panels (left/right) DOM element */
  getTopPanels() {
    return this._topPanels;
  }
  /** Are we using a DataView? */
  hasDataView() {
    return !Array.isArray(this.data);
  }
  togglePanelVisibility(option, container, visible, animate) {
    let animated = animate !== !1;
    if (this._options[option] !== visible)
      if (this._options[option] = visible, visible) {
        if (animated) {
          Utils28.slideDown(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils28.show(container), this.resizeCanvas();
      } else {
        if (animated) {
          Utils28.slideUp(container, this.resizeCanvas.bind(this));
          return;
        }
        Utils28.hide(container), this.resizeCanvas();
      }
  }
  /**
   * Set the Top Panel Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if top panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setTopPanelVisibility(visible, animate) {
    this.togglePanelVisibility("showTopPanel", this._topPanelScrollers, visible, animate);
  }
  /**
   * Set the Header Row Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if header row panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setHeaderRowVisibility(visible, animate) {
    this.togglePanelVisibility("showHeaderRow", this._headerRowScroller, visible, animate);
  }
  /**
   * Set the Column Header Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if column header is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setColumnHeaderVisibility(visible, animate) {
    this.togglePanelVisibility("showColumnHeader", this._headerScroller, visible, animate);
  }
  /**
   * Set the Footer Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if footer row panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setFooterRowVisibility(visible, animate) {
    this.togglePanelVisibility("showFooterRow", this._footerRowScroller, visible, animate);
  }
  /**
   * Set the Pre-Header Visibility and optionally enable/disable animation (enabled by default)
   * @param {Boolean} [visible] - optionally set if pre-header panel is visible or not
   * @param {Boolean} [animate] - optionally enable an animation while toggling the panel
   */
  setPreHeaderPanelVisibility(visible, animate) {
    this.togglePanelVisibility("showPreHeaderPanel", [this._preHeaderPanelScroller, this._preHeaderPanelScrollerR], visible, animate);
  }
  /** Get Grid Canvas Node DOM Element */
  getContainerNode() {
    return this._container;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Rendering / Scrolling
  getRowTop(row) {
    return this._options.rowHeight * row - this.offset;
  }
  getRowFromPosition(y) {
    return Math.floor((y + this.offset) / this._options.rowHeight);
  }
  /**
   * Scroll to an Y position in the grid
   * @param {Number} y
   */
  scrollTo(y) {
    y = Math.max(y, 0), y = Math.min(y, (this.th || 0) - Utils28.height(this._viewportScrollContainerY) + (this.viewportHasHScroll || this.hasFrozenColumns() ? this.scrollbarDimensions?.height ?? 0 : 0));
    let oldOffset = this.offset;
    this.offset = Math.round(this.page * (this.cj || 0)), this.page = Math.min((this.n || 0) - 1, Math.floor(y / (this.ph || 0)));
    let newScrollTop = y - this.offset;
    if (this.offset !== oldOffset) {
      let range = this.getVisibleRange(newScrollTop);
      this.cleanupRows(range), this.updateRowPositions();
    }
    this.prevScrollTop !== newScrollTop && (this.vScrollDir = this.prevScrollTop + oldOffset < newScrollTop + this.offset ? 1 : -1, this.lastRenderedScrollTop = this.scrollTop = this.prevScrollTop = newScrollTop, this.hasFrozenColumns() && (this._viewportTopL.scrollTop = newScrollTop), this.hasFrozenRows && (this._viewportBottomL.scrollTop = this._viewportBottomR.scrollTop = newScrollTop), this._viewportScrollContainerY && (this._viewportScrollContainerY.scrollTop = newScrollTop), this.trigger(this.onViewportChanged, {}));
  }
  defaultFormatter(_row, _cell, value) {
    return Utils28.isDefined(value) ? (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
  }
  getFormatter(row, column) {
    let rowMetadata = this.data?.getItemMetadata?.(row);
    return (rowMetadata?.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[this.getColumnIndex(column.id)]))?.formatter || rowMetadata?.formatter || column.formatter || this._options.formatterFactory?.getFormatter(column) || this._options.defaultFormatter;
  }
  getEditor(row, cell) {
    let column = this.columns[cell], columnMetadata = this.data?.getItemMetadata?.(row)?.columns;
    return columnMetadata?.[column.id]?.editor !== void 0 ? columnMetadata[column.id].editor : columnMetadata?.[cell]?.editor !== void 0 ? columnMetadata[cell].editor : column.editor || this._options?.editorFactory?.getEditor(column);
  }
  getDataItemValueForColumn(item, columnDef) {
    return this._options.dataItemColumnValueExtractor ? this._options.dataItemColumnValueExtractor(item, columnDef) : item[columnDef.field];
  }
  appendRowHtml(divArrayL, divArrayR, row, range, dataLength) {
    let d = this.getDataItem(row), dataLoading = row < dataLength && !d, rowCss = "slick-row" + (this.hasFrozenRows && row <= this._options.frozenRow ? " frozen" : "") + (dataLoading ? " loading" : "") + (row === this.activeRow && this._options.showCellSelection ? " active" : "") + (row % 2 === 1 ? " odd" : " even");
    d || (rowCss += " " + this._options.addNewRowCssClass);
    let metadata = this.data?.getItemMetadata?.(row);
    metadata?.cssClasses && (rowCss += " " + metadata.cssClasses);
    let frozenRowOffset = this.getFrozenRowOffset(row), rowDiv = Utils28.createDomElement("div", { className: `ui-widget-content ${rowCss}`, style: { top: `${this.getRowTop(row) - frozenRowOffset}px` } }), rowDivR;
    divArrayL.push(rowDiv), this.hasFrozenColumns() && (rowDivR = rowDiv.cloneNode(!0), divArrayR.push(rowDivR));
    let colspan, m;
    for (let i = 0, ii = this.columns.length; i < ii; i++)
      if (m = this.columns[i], !(!m || m.hidden)) {
        if (colspan = 1, metadata?.columns && (colspan = (metadata.columns[m.id] || metadata.columns[i])?.colspan || 1, colspan === "*" && (colspan = ii - i)), this.columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
          if (!m.alwaysRenderColumn && this.columnPosLeft[i] > range.rightPx)
            break;
          this.hasFrozenColumns() && i > this._options.frozenColumn ? this.appendCellHtml(rowDivR, row, i, colspan, d) : this.appendCellHtml(rowDiv, row, i, colspan, d);
        } else
          (m.alwaysRenderColumn || this.hasFrozenColumns() && i <= this._options.frozenColumn) && this.appendCellHtml(rowDiv, row, i, colspan, d);
        colspan > 1 && (i += colspan - 1);
      }
  }
  appendCellHtml(divRow, row, cell, colspan, item) {
    let m = this.columns[cell], cellCss = "slick-cell l" + cell + " r" + Math.min(this.columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
    this.hasFrozenColumns() && cell <= this._options.frozenColumn && (cellCss += " frozen"), row === this.activeRow && cell === this.activeCell && this._options.showCellSelection && (cellCss += " active");
    for (let key in this.cellCssClasses)
      this.cellCssClasses[key][row]?.[m.id] && (cellCss += " " + this.cellCssClasses[key][row][m.id]);
    let value = null, formatterResult = "";
    item && (value = this.getDataItemValueForColumn(item, m), formatterResult = this.getFormatter(row, m)(row, cell, value, m, item, this), formatterResult == null && (formatterResult = ""));
    let appendCellResult = this.trigger(this.onBeforeAppendCell, { row, cell, value, dataContext: item }).getReturnValue(), addlCssClasses = typeof appendCellResult == "string" ? appendCellResult : "";
    formatterResult?.addClasses && (addlCssClasses += (addlCssClasses ? " " : "") + formatterResult.addClasses);
    let toolTipText = formatterResult?.toolTip ? `${formatterResult.toolTip}` : "", cellDiv = document.createElement("div");
    if (cellDiv.className = `${cellCss} ${addlCssClasses || ""}`.trim(), cellDiv.setAttribute("title", toolTipText), m.hasOwnProperty("cellAttrs") && m.cellAttrs instanceof Object)
      for (let key in m.cellAttrs)
        m.cellAttrs.hasOwnProperty(key) && cellDiv.setAttribute(key, m.cellAttrs[key]);
    if (item) {
      let cellResult = Object.prototype.toString.call(formatterResult) !== "[object Object]" ? formatterResult : formatterResult.html || formatterResult.text;
      this.applyHtmlCode(cellDiv, cellResult);
    }
    divRow.appendChild(cellDiv), this.rowsCache[row].cellRenderQueue.push(cell), this.rowsCache[row].cellColSpans[cell] = colspan;
  }
  cleanupRows(rangeToKeep) {
    for (let rowId in this.rowsCache)
      if (this.rowsCache) {
        let i = +rowId, removeFrozenRow = !0;
        this.hasFrozenRows && (this._options.frozenBottom && i >= this.actualFrozenRow || !this._options.frozenBottom && i <= this.actualFrozenRow) && (removeFrozenRow = !1), (i = parseInt(rowId, 10)) !== this.activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom) && removeFrozenRow && this.removeRowFromCache(i);
      }
    this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
  }
  /** Invalidate all grid rows and re-render the grid rows */
  invalidate() {
    this.updateRowCount(), this.invalidateAllRows(), this.render();
  }
  /** Invalidate all grid rows */
  invalidateAllRows() {
    this.currentEditor && this.makeActiveCellNormal();
    for (let row in this.rowsCache)
      this.rowsCache && this.removeRowFromCache(+row);
    this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
  }
  /**
   * Invalidate a specific set of row numbers
   * @param {Number[]} rows
   */
  invalidateRows(rows) {
    if (!rows || !rows.length)
      return;
    this.vScrollDir = 0;
    let rl = rows.length;
    for (let i = 0; i < rl; i++)
      this.currentEditor && this.activeRow === rows[i] && this.makeActiveCellNormal(), this.rowsCache[rows[i]] && this.removeRowFromCache(rows[i]);
    this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup();
  }
  /**
   * Invalidate a specific row number
   * @param {Number} row
   */
  invalidateRow(row) {
    !row && row !== 0 || this.invalidateRows([row]);
  }
  queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
    this.postProcessgroupId++;
    for (let columnIdx in postProcessedRow)
      postProcessedRow.hasOwnProperty(columnIdx) && this.postProcessedCleanupQueue.push({
        actionType: "C",
        groupId: this.postProcessgroupId,
        node: cacheEntry.cellNodesByColumnIdx[+columnIdx],
        columnIdx: +columnIdx,
        rowIdx
      });
    cacheEntry.rowNode || (cacheEntry.rowNode = []), this.postProcessedCleanupQueue.push({
      actionType: "R",
      groupId: this.postProcessgroupId,
      node: cacheEntry.rowNode
    }), cacheEntry.rowNode?.forEach((node) => node.remove());
  }
  queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
    this.postProcessedCleanupQueue.push({
      actionType: "C",
      groupId: this.postProcessgroupId,
      node: cellnode,
      columnIdx,
      rowIdx
    }), cellnode.remove();
  }
  removeRowFromCache(row) {
    let cacheEntry = this.rowsCache[row];
    !cacheEntry || !cacheEntry.rowNode || (this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row] ? this.queuePostProcessedRowForCleanup(cacheEntry, this.postProcessedRows[row], row) : cacheEntry.rowNode?.forEach((node) => node.parentElement?.removeChild(node)), delete this.rowsCache[row], delete this.postProcessedRows[row], this.renderedRows--, this.counter_rows_removed++);
  }
  /** Apply a Formatter Result to a Cell DOM Node */
  applyFormatResultToCellNode(formatterResult, cellNode, suppressRemove) {
    if (formatterResult == null && (formatterResult = ""), Object.prototype.toString.call(formatterResult) !== "[object Object]") {
      this.applyHtmlCode(cellNode, formatterResult);
      return;
    }
    let formatterVal = formatterResult.html || formatterResult.text;
    this.applyHtmlCode(cellNode, formatterVal), formatterResult.removeClasses && !suppressRemove && formatterResult.removeClasses.split(" ").forEach((c) => cellNode.classList.remove(c)), formatterResult.addClasses && formatterResult.addClasses.split(" ").forEach((c) => cellNode.classList.add(c)), formatterResult.toolTip && cellNode.setAttribute("title", formatterResult.toolTip);
  }
  /**
   * Update a specific cell by its row and column index
   * @param {Number} row - grid row number
   * @param {Number} cell - grid cell column number
   */
  updateCell(row, cell) {
    let cellNode = this.getCellNode(row, cell);
    if (!cellNode)
      return;
    let m = this.columns[cell], d = this.getDataItem(row);
    if (this.currentEditor && this.activeRow === row && this.activeCell === cell)
      this.currentEditor.loadValue(d);
    else {
      let formatterResult = d ? this.getFormatter(row, m)(row, cell, this.getDataItemValueForColumn(d, m), m, d, this) : "";
      this.applyFormatResultToCellNode(formatterResult, cellNode), this.invalidatePostProcessingResults(row);
    }
  }
  /**
   * Update a specific row by its row index
   * @param {Number} row - grid row number
   */
  updateRow(row) {
    let cacheEntry = this.rowsCache[row];
    if (!cacheEntry)
      return;
    this.ensureCellNodesInRowsCache(row);
    let formatterResult, d = this.getDataItem(row);
    for (let colIdx in cacheEntry.cellNodesByColumnIdx) {
      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx))
        continue;
      let columnIdx = +colIdx, m = this.columns[columnIdx], node = cacheEntry.cellNodesByColumnIdx[columnIdx];
      row === this.activeRow && columnIdx === this.activeCell && this.currentEditor ? this.currentEditor.loadValue(d) : d ? (formatterResult = this.getFormatter(row, m)(row, columnIdx, this.getDataItemValueForColumn(d, m), m, d, this), this.applyFormatResultToCellNode(formatterResult, node)) : Utils28.emptyElement(node);
    }
    this.invalidatePostProcessingResults(row);
  }
  /**
   * Get the number of rows displayed in the viewport
   * Note that the row count is an approximation because it is a calculated value using this formula (viewport / rowHeight = rowCount),
   * the viewport must also be displayed for this calculation to work.
   * @return {Number} rowCount
   */
  getViewportRowCount() {
    let vh = this.getViewportHeight(), scrollbarHeight = this.getScrollbarDimensions()?.height ?? 0;
    return Math.floor((vh - scrollbarHeight) / this._options.rowHeight);
  }
  getViewportHeight() {
    if ((!this._options.autoHeight || this._options.frozenColumn !== -1) && (this.topPanelH = this._options.showTopPanel ? this._options.topPanelHeight + this.getVBoxDelta(this._topPanelScrollers[0]) : 0, this.headerRowH = this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, this.footerRowH = this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0), this._options.autoHeight) {
      let fullHeight = this._paneHeaderL.offsetHeight;
      fullHeight += this._options.showHeaderRow ? this._options.headerRowHeight + this.getVBoxDelta(this._headerRowScroller[0]) : 0, fullHeight += this._options.showFooterRow ? this._options.footerRowHeight + this.getVBoxDelta(this._footerRowScroller[0]) : 0, fullHeight += this.getCanvasWidth() > this.viewportW ? this.scrollbarDimensions?.height ?? 0 : 0, this.viewportH = this._options.rowHeight * this.getDataLengthIncludingAddNew() + (this._options.frozenColumn === -1 ? fullHeight : 0);
    } else {
      let columnNamesH = this._options.showColumnHeader ? Utils28.toFloat(Utils28.height(this._headerScroller[0])) + this.getVBoxDelta(this._headerScroller[0]) : 0, preHeaderH = this._options.createPreHeaderPanel && this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight + this.getVBoxDelta(this._preHeaderPanelScroller) : 0, style = getComputedStyle(this._container);
      this.viewportH = Utils28.toFloat(style.height) - Utils28.toFloat(style.paddingTop) - Utils28.toFloat(style.paddingBottom) - columnNamesH - this.topPanelH - this.headerRowH - this.footerRowH - preHeaderH;
    }
    return this.numVisibleRows = Math.ceil(this.viewportH / this._options.rowHeight), this.viewportH;
  }
  getViewportWidth() {
    return this.viewportW = parseFloat(Utils28.innerSize(this._container, "width")), this.viewportW;
  }
  /** Execute a Resize of the Grid Canvas */
  resizeCanvas() {
    if (!this.initialized)
      return;
    if (this.paneTopH = 0, this.paneBottomH = 0, this.viewportTopH = 0, this.viewportBottomH = 0, this.getViewportWidth(), this.getViewportHeight(), this.hasFrozenRows ? this._options.frozenBottom ? (this.paneTopH = this.viewportH - this.frozenRowsHeight - (this.scrollbarDimensions?.height ?? 0), this.paneBottomH = this.frozenRowsHeight + (this.scrollbarDimensions?.height ?? 0)) : (this.paneTopH = this.frozenRowsHeight, this.paneBottomH = this.viewportH - this.frozenRowsHeight) : this.paneTopH = this.viewportH, this.paneTopH += this.topPanelH + this.headerRowH + this.footerRowH, this.hasFrozenColumns() && this._options.autoHeight && (this.paneTopH += this.scrollbarDimensions?.height ?? 0), this.viewportTopH = this.paneTopH - this.topPanelH - this.headerRowH - this.footerRowH, this._options.autoHeight) {
      if (this.hasFrozenColumns()) {
        let style = getComputedStyle(this._headerScrollerL);
        Utils28.height(this._container, this.paneTopH + Utils28.toFloat(style.height));
      }
      this._paneTopL.style.position = "relative";
    }
    Utils28.setStyleSize(this._paneTopL, "top", Utils28.height(this._paneHeaderL) || (this._options.showHeaderRow ? this._options.headerRowHeight : 0) + (this._options.showPreHeaderPanel ? this._options.preHeaderPanelHeight : 0)), Utils28.height(this._paneTopL, this.paneTopH);
    let paneBottomTop = this._paneTopL.offsetTop + this.paneTopH;
    this._options.autoHeight || Utils28.height(this._viewportTopL, this.viewportTopH), this.hasFrozenColumns() ? (Utils28.setStyleSize(this._paneTopR, "top", Utils28.height(this._paneHeaderL)), Utils28.height(this._paneTopR, this.paneTopH), Utils28.height(this._viewportTopR, this.viewportTopH), this.hasFrozenRows && (Utils28.setStyleSize(this._paneBottomL, "top", paneBottomTop), Utils28.height(this._paneBottomL, this.paneBottomH), Utils28.setStyleSize(this._paneBottomR, "top", paneBottomTop), Utils28.height(this._paneBottomR, this.paneBottomH), Utils28.height(this._viewportBottomR, this.paneBottomH))) : this.hasFrozenRows && (Utils28.width(this._paneBottomL, "100%"), Utils28.height(this._paneBottomL, this.paneBottomH), Utils28.setStyleSize(this._paneBottomL, "top", paneBottomTop)), this.hasFrozenRows ? (Utils28.height(this._viewportBottomL, this.paneBottomH), this._options.frozenBottom ? (Utils28.height(this._canvasBottomL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils28.height(this._canvasBottomR, this.frozenRowsHeight)) : (Utils28.height(this._canvasTopL, this.frozenRowsHeight), this.hasFrozenColumns() && Utils28.height(this._canvasTopR, this.frozenRowsHeight))) : Utils28.height(this._viewportTopR, this.viewportTopH), (!this.scrollbarDimensions || !this.scrollbarDimensions.width) && (this.scrollbarDimensions = this.measureScrollbar()), this._options.autosizeColsMode === GridAutosizeColsMode2.LegacyForceFit && this.autosizeColumns(), this.updateRowCount(), this.handleScroll(), this.lastRenderedScrollLeft = -1, this.render();
  }
  /**
   * Update paging information status from the View
   * @param {PagingInfo} pagingInfo
   */
  updatePagingStatusFromView(pagingInfo) {
    this.pagingActive = pagingInfo.pageSize !== 0, this.pagingIsLastPage = pagingInfo.pageNum === pagingInfo.totalPages - 1;
  }
  /** Update the dataset row count */
  updateRowCount() {
    if (!this.initialized)
      return;
    let dataLength = this.getDataLength(), dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew(), numberOfRows = 0, oldH = this.hasFrozenRows && !this._options.frozenBottom ? Utils28.height(this._canvasBottomL) : Utils28.height(this._canvasTopL);
    this.hasFrozenRows ? numberOfRows = this.getDataLength() - this._options.frozenRow : numberOfRows = dataLengthIncludingAddNew + (this._options.leaveSpaceForNewRows ? this.numVisibleRows - 1 : 0);
    let tempViewportH = Utils28.height(this._viewportScrollContainerY), oldViewportHasVScroll = this.viewportHasVScroll;
    this.viewportHasVScroll = this._options.alwaysShowVerticalScroll || !this._options.autoHeight && numberOfRows * this._options.rowHeight > tempViewportH, this.makeActiveCellNormal();
    let r1 = dataLength - 1;
    for (let i in this.rowsCache)
      Number(i) > r1 && this.removeRowFromCache(+i);
    this._options.enableAsyncPostRenderCleanup && this.startPostProcessingCleanup(), this.activeCellNode && this.activeRow > r1 && this.resetActiveCell(), oldH = this.h, this._options.autoHeight ? this.h = this._options.rowHeight * numberOfRows : (this.th = Math.max(this._options.rowHeight * numberOfRows, tempViewportH - (this.scrollbarDimensions?.height ?? 0)), this.th < this.maxSupportedCssHeight ? (this.h = this.ph = this.th, this.n = 1, this.cj = 0) : (this.h = this.maxSupportedCssHeight, this.ph = this.h / 100, this.n = Math.floor(this.th / this.ph), this.cj = (this.th - this.h) / (this.n - 1))), (this.h !== oldH || this.enforceFrozenRowHeightRecalc) && (this.hasFrozenRows && !this._options.frozenBottom ? (Utils28.height(this._canvasBottomL, this.h), this.hasFrozenColumns() && Utils28.height(this._canvasBottomR, this.h)) : (Utils28.height(this._canvasTopL, this.h), Utils28.height(this._canvasTopR, this.h)), this.scrollTop = this._viewportScrollContainerY.scrollTop, this.enforceFrozenRowHeightRecalc = !1);
    let oldScrollTopInRange = this.scrollTop + this.offset <= this.th - tempViewportH;
    this.th === 0 || this.scrollTop === 0 ? this.page = this.offset = 0 : oldScrollTopInRange ? this.scrollTo(this.scrollTop + this.offset) : this.scrollTo(this.th - tempViewportH + (this.scrollbarDimensions?.height ?? 0)), this.h !== oldH && this._options.autoHeight && this.resizeCanvas(), this._options.autosizeColsMode === GridAutosizeColsMode2.LegacyForceFit && oldViewportHasVScroll !== this.viewportHasVScroll && this.autosizeColumns(), this.updateCanvasWidth(!1);
  }
  /** @alias `getVisibleRange` */
  getViewport(viewportTop, viewportLeft) {
    return this.getVisibleRange(viewportTop, viewportLeft);
  }
  getVisibleRange(viewportTop, viewportLeft) {
    return viewportTop ?? (viewportTop = this.scrollTop), viewportLeft ?? (viewportLeft = this.scrollLeft), {
      top: this.getRowFromPosition(viewportTop),
      bottom: this.getRowFromPosition(viewportTop + this.viewportH) + 1,
      leftPx: viewportLeft,
      rightPx: viewportLeft + this.viewportW
    };
  }
  /** Get rendered range */
  getRenderedRange(viewportTop, viewportLeft) {
    let range = this.getVisibleRange(viewportTop, viewportLeft), buffer = Math.round(this.viewportH / this._options.rowHeight), minBuffer = this._options.minRowBuffer;
    return this.vScrollDir === -1 ? (range.top -= buffer, range.bottom += minBuffer) : this.vScrollDir === 1 ? (range.top -= minBuffer, range.bottom += buffer) : (range.top -= minBuffer, range.bottom += minBuffer), range.top = Math.max(0, range.top), range.bottom = Math.min(this.getDataLengthIncludingAddNew() - 1, range.bottom), range.leftPx -= this.viewportW, range.rightPx += this.viewportW, range.leftPx = Math.max(0, range.leftPx), range.rightPx = Math.min(this.canvasWidth, range.rightPx), range;
  }
  ensureCellNodesInRowsCache(row) {
    let cacheEntry = this.rowsCache[row];
    if (cacheEntry?.cellRenderQueue.length && cacheEntry.rowNode?.length) {
      let rowNode = cacheEntry.rowNode, children = Array.from(rowNode[0].children);
      rowNode.length > 1 && (children = children.concat(Array.from(rowNode[1].children)));
      let i = children.length - 1;
      for (; cacheEntry.cellRenderQueue.length; ) {
        let columnIdx = cacheEntry.cellRenderQueue.pop();
        cacheEntry.cellNodesByColumnIdx[columnIdx] = children[i--];
      }
    }
  }
  cleanUpCells(range, row) {
    if (this.hasFrozenRows && (this._options.frozenBottom && row > this.actualFrozenRow || row <= this.actualFrozenRow))
      return;
    let totalCellsRemoved = 0, cacheEntry = this.rowsCache[row], cellsToRemove = [];
    for (let cellNodeIdx in cacheEntry.cellNodesByColumnIdx) {
      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(cellNodeIdx))
        continue;
      let i = +cellNodeIdx;
      if (i <= this._options.frozenColumn || Array.isArray(this.columns) && this.columns[i] && this.columns[i].alwaysRenderColumn)
        continue;
      let colspan = cacheEntry.cellColSpans[i];
      (this.columnPosLeft[i] > range.rightPx || this.columnPosRight[Math.min(this.columns.length - 1, (i || 0) + colspan - 1)] < range.leftPx) && (row === this.activeRow && Number(i) === this.activeCell || cellsToRemove.push(i));
    }
    let cellToRemove, cellNode;
    for (; Utils28.isDefined(cellToRemove = cellsToRemove.pop()); )
      cellNode = cacheEntry.cellNodesByColumnIdx[cellToRemove], this._options.enableAsyncPostRenderCleanup && this.postProcessedRows[row]?.[cellToRemove] ? this.queuePostProcessedCellForCleanup(cellNode, cellToRemove, row) : cellNode.parentElement?.removeChild(cellNode), delete cacheEntry.cellColSpans[cellToRemove], delete cacheEntry.cellNodesByColumnIdx[cellToRemove], this.postProcessedRows[row] && delete this.postProcessedRows[row][cellToRemove], totalCellsRemoved++;
  }
  cleanUpAndRenderCells(range) {
    let cacheEntry, divRow = document.createElement("div"), processedRows = [], cellsAdded, totalCellsAdded = 0, colspan;
    for (let row = range.top, btm = range.bottom; row <= btm; row++) {
      if (cacheEntry = this.rowsCache[row], !cacheEntry)
        continue;
      this.ensureCellNodesInRowsCache(row), this.cleanUpCells(range, row), cellsAdded = 0;
      let metadata = this.data?.getItemMetadata?.(row) ?? {};
      metadata = metadata?.columns;
      let d = this.getDataItem(row);
      for (let i = 0, ii = this.columns.length; i < ii; i++) {
        if (!this.columns[i] || this.columns[i].hidden)
          continue;
        if (this.columnPosLeft[i] > range.rightPx)
          break;
        if (Utils28.isDefined(colspan = cacheEntry.cellColSpans[i])) {
          i += colspan > 1 ? colspan - 1 : 0;
          continue;
        }
        colspan = 1, metadata && (colspan = (metadata[this.columns[i].id] || metadata[i])?.colspan ?? 1, colspan === "*" && (colspan = ii - i));
        let colspanNb = colspan;
        this.columnPosRight[Math.min(ii - 1, i + colspanNb - 1)] > range.leftPx && (this.appendCellHtml(divRow, row, i, colspanNb, d), cellsAdded++), i += colspanNb > 1 ? colspanNb - 1 : 0;
      }
      cellsAdded && (totalCellsAdded += cellsAdded, processedRows.push(row));
    }
    if (!divRow.children.length)
      return;
    let processedRow, node;
    for (; Utils28.isDefined(processedRow = processedRows.pop()); ) {
      cacheEntry = this.rowsCache[processedRow];
      let columnIdx;
      for (; Utils28.isDefined(columnIdx = cacheEntry.cellRenderQueue.pop()); )
        node = divRow.lastChild, node && (this.hasFrozenColumns() && columnIdx > this._options.frozenColumn ? cacheEntry.rowNode[1].appendChild(node) : cacheEntry.rowNode[0].appendChild(node), cacheEntry.cellNodesByColumnIdx[columnIdx] = node);
    }
  }
  renderRows(range) {
    let divArrayL = [], divArrayR = [], rows = [], needToReselectCell = !1, dataLength = this.getDataLength();
    for (let i = range.top, ii = range.bottom; i <= ii; i++)
      this.rowsCache[i] || this.hasFrozenRows && this._options.frozenBottom && i === this.getDataLength() || (this.renderedRows++, rows.push(i), this.rowsCache[i] = {
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
      }, this.appendRowHtml(divArrayL, divArrayR, i, range, dataLength), this.activeCellNode && this.activeRow === i && (needToReselectCell = !0), this.counter_rows_rendered++);
    if (!rows.length)
      return;
    let x = document.createElement("div"), xRight = document.createElement("div");
    divArrayL.forEach((elm) => x.appendChild(elm)), divArrayR.forEach((elm) => xRight.appendChild(elm));
    for (let i = 0, ii = rows.length; i < ii; i++)
      this.hasFrozenRows && rows[i] >= this.actualFrozenRow ? this.hasFrozenColumns() ? this.rowsCache?.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasBottomL.appendChild(x.firstChild), this._canvasBottomR.appendChild(xRight.firstChild)) : this.rowsCache?.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasBottomL.appendChild(x.firstChild)) : this.hasFrozenColumns() ? this.rowsCache?.hasOwnProperty(rows[i]) && x.firstChild && xRight.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild, xRight.firstChild], this._canvasTopL.appendChild(x.firstChild), this._canvasTopR.appendChild(xRight.firstChild)) : this.rowsCache?.hasOwnProperty(rows[i]) && x.firstChild && (this.rowsCache[rows[i]].rowNode = [x.firstChild], this._canvasTopL.appendChild(x.firstChild));
    needToReselectCell && (this.activeCellNode = this.getCellNode(this.activeRow, this.activeCell));
  }
  startPostProcessing() {
    this._options.enableAsyncPostRender && (clearTimeout(this.h_postrender), this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay));
  }
  startPostProcessingCleanup() {
    this._options.enableAsyncPostRenderCleanup && (clearTimeout(this.h_postrenderCleanup), this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay));
  }
  invalidatePostProcessingResults(row) {
    for (let columnIdx in this.postProcessedRows[row])
      this.postProcessedRows[row].hasOwnProperty(columnIdx) && (this.postProcessedRows[row][columnIdx] = "C");
    this.postProcessFromRow = Math.min(this.postProcessFromRow, row), this.postProcessToRow = Math.max(this.postProcessToRow, row), this.startPostProcessing();
  }
  updateRowPositions() {
    for (let row in this.rowsCache)
      if (this.rowsCache) {
        let rowNumber = row ? parseInt(row, 10) : 0;
        Utils28.setStyleSize(this.rowsCache[rowNumber].rowNode[0], "top", this.getRowTop(rowNumber));
      }
  }
  /** (re)Render the grid */
  render() {
    if (!this.initialized)
      return;
    this.scrollThrottle.dequeue();
    let visible = this.getVisibleRange(), rendered = this.getRenderedRange();
    if (this.cleanupRows(rendered), this.lastRenderedScrollLeft !== this.scrollLeft) {
      if (this.hasFrozenRows) {
        let renderedFrozenRows = Utils28.extend(!0, {}, rendered);
        this._options.frozenBottom ? (renderedFrozenRows.top = this.actualFrozenRow, renderedFrozenRows.bottom = this.getDataLength()) : (renderedFrozenRows.top = 0, renderedFrozenRows.bottom = this._options.frozenRow), this.cleanUpAndRenderCells(renderedFrozenRows);
      }
      this.cleanUpAndRenderCells(rendered);
    }
    this.renderRows(rendered), this.hasFrozenRows && (this._options.frozenBottom ? this.renderRows({
      top: this.actualFrozenRow,
      bottom: this.getDataLength() - 1,
      leftPx: rendered.leftPx,
      rightPx: rendered.rightPx
    }) : this.renderRows({
      top: 0,
      bottom: this._options.frozenRow - 1,
      leftPx: rendered.leftPx,
      rightPx: rendered.rightPx
    })), this.postProcessFromRow = visible.top, this.postProcessToRow = Math.min(this.getDataLengthIncludingAddNew() - 1, visible.bottom), this.startPostProcessing(), this.lastRenderedScrollTop = this.scrollTop, this.lastRenderedScrollLeft = this.scrollLeft, this.h_render = null, this.trigger(this.onRendered, { startRow: visible.top, endRow: visible.bottom, grid: this });
  }
  handleHeaderRowScroll() {
    let scrollLeft = this._headerRowScrollContainer.scrollLeft;
    scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
  }
  handleFooterRowScroll() {
    let scrollLeft = this._footerRowScrollContainer.scrollLeft;
    scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
  }
  handlePreHeaderPanelScroll() {
    this.handleElementScroll(this._preHeaderPanelScroller);
  }
  handleElementScroll(element) {
    let scrollLeft = element.scrollLeft;
    scrollLeft !== this._viewportScrollContainerX.scrollLeft && (this._viewportScrollContainerX.scrollLeft = scrollLeft);
  }
  handleScroll() {
    return this.scrollTop = this._viewportScrollContainerY.scrollTop, this.scrollLeft = this._viewportScrollContainerX.scrollLeft, this._handleScroll(!1);
  }
  _handleScroll(isMouseWheel) {
    let maxScrollDistanceY = this._viewportScrollContainerY.scrollHeight - this._viewportScrollContainerY.clientHeight, maxScrollDistanceX = this._viewportScrollContainerY.scrollWidth - this._viewportScrollContainerY.clientWidth;
    maxScrollDistanceY = Math.max(0, maxScrollDistanceY), maxScrollDistanceX = Math.max(0, maxScrollDistanceX), this.scrollTop > maxScrollDistanceY && (this.scrollTop = maxScrollDistanceY), this.scrollLeft > maxScrollDistanceX && (this.scrollLeft = maxScrollDistanceX);
    let vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop), hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);
    if (hScrollDist && (this.prevScrollLeft = this.scrollLeft, this._viewportScrollContainerX.scrollLeft = this.scrollLeft, this._headerScrollContainer.scrollLeft = this.scrollLeft, this._topPanelScrollers[0].scrollLeft = this.scrollLeft, this._options.createFooterRow && (this._footerRowScrollContainer.scrollLeft = this.scrollLeft), this._options.createPreHeaderPanel && (this.hasFrozenColumns() ? this._preHeaderPanelScrollerR.scrollLeft = this.scrollLeft : this._preHeaderPanelScroller.scrollLeft = this.scrollLeft), this.hasFrozenColumns() ? (this.hasFrozenRows && (this._viewportTopR.scrollLeft = this.scrollLeft), this._headerRowScrollerR.scrollLeft = this.scrollLeft) : (this.hasFrozenRows && (this._viewportTopL.scrollLeft = this.scrollLeft), this._headerRowScrollerL.scrollLeft = this.scrollLeft)), vScrollDist && !this._options.autoHeight)
      if (this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1, this.prevScrollTop = this.scrollTop, isMouseWheel && (this._viewportScrollContainerY.scrollTop = this.scrollTop), this.hasFrozenColumns() && (this.hasFrozenRows && !this._options.frozenBottom ? this._viewportBottomL.scrollTop = this.scrollTop : this._viewportTopL.scrollTop = this.scrollTop), vScrollDist < this.viewportH)
        this.scrollTo(this.scrollTop + this.offset);
      else {
        let oldOffset = this.offset;
        this.h === this.viewportH ? this.page = 0 : this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.th - this.viewportH) / (this.h - this.viewportH)) * (1 / this.ph))), this.offset = Math.round(this.page * this.cj), oldOffset !== this.offset && this.invalidateAllRows();
      }
    if (hScrollDist || vScrollDist) {
      let dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft), dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);
      (dx > 20 || dy > 20) && (this._options.forceSyncScrolling || dy < this.viewportH && dx < this.viewportW ? this.render() : this.scrollThrottle.enqueue(), this.trigger(this.onViewportChanged, {}));
    }
    return this.trigger(this.onScroll, { scrollLeft: this.scrollLeft, scrollTop: this.scrollTop }), !!(hScrollDist || vScrollDist);
  }
  /**
   * limits the frequency at which the provided action is executed.
   * call enqueue to execute the action - it will execute either immediately or, if it was executed less than minPeriod_ms in the past, as soon as minPeriod_ms has expired.
   * call dequeue to cancel any pending action.
   */
  actionThrottle(action, minPeriod_ms) {
    let blocked = !1, queued = !1, enqueue = () => {
      blocked ? queued = !0 : blockAndExecute();
    }, dequeue = () => {
      queued = !1;
    }, blockAndExecute = () => {
      blocked = !0, setTimeout(unblock, minPeriod_ms), action.call(this);
    }, unblock = () => {
      queued ? (dequeue(), blockAndExecute()) : blocked = !1;
    };
    return {
      enqueue: enqueue.bind(this),
      dequeue: dequeue.bind(this)
    };
  }
  asyncPostProcessRows() {
    let dataLength = this.getDataLength();
    for (; this.postProcessFromRow <= this.postProcessToRow; ) {
      let row = this.vScrollDir >= 0 ? this.postProcessFromRow++ : this.postProcessToRow--, cacheEntry = this.rowsCache[row];
      if (!(!cacheEntry || row >= dataLength)) {
        this.postProcessedRows[row] || (this.postProcessedRows[row] = {}), this.ensureCellNodesInRowsCache(row);
        for (let colIdx in cacheEntry.cellNodesByColumnIdx) {
          if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(colIdx))
            continue;
          let columnIdx = +colIdx, m = this.columns[columnIdx], processedStatus = this.postProcessedRows[row][columnIdx];
          if (m.asyncPostRender && processedStatus !== "R") {
            let node = cacheEntry.cellNodesByColumnIdx[columnIdx];
            node && m.asyncPostRender(node, row, this.getDataItem(row), m, processedStatus === "C"), this.postProcessedRows[row][columnIdx] = "R";
          }
        }
        this.h_postrender = setTimeout(this.asyncPostProcessRows.bind(this), this._options.asyncPostRenderDelay);
        return;
      }
    }
  }
  asyncPostProcessCleanupRows() {
    if (this.postProcessedCleanupQueue.length > 0) {
      let groupId = this.postProcessedCleanupQueue[0].groupId;
      for (; this.postProcessedCleanupQueue.length > 0 && this.postProcessedCleanupQueue[0].groupId === groupId; ) {
        let entry = this.postProcessedCleanupQueue.shift();
        if (entry?.actionType === "R" && entry.node.forEach((node) => {
          node.remove();
        }), entry?.actionType === "C") {
          let column = this.columns[entry.columnIdx];
          column.asyncPostRenderCleanup && entry.node && column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
        }
      }
      this.h_postrenderCleanup = setTimeout(this.asyncPostProcessCleanupRows.bind(this), this._options.asyncPostRenderCleanupDelay);
    }
  }
  updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
    let node, columnId, addedRowHash, removedRowHash;
    for (let row in this.rowsCache)
      if (this.rowsCache) {
        if (removedRowHash = removedHash?.[row], addedRowHash = addedHash?.[row], removedRowHash)
          for (columnId in removedRowHash)
            (!addedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.remove(removedRowHash[columnId]));
        if (addedRowHash)
          for (columnId in addedRowHash)
            (!removedRowHash || removedRowHash[columnId] !== addedRowHash[columnId]) && (node = this.getCellNode(+row, this.getColumnIndex(columnId)), node && node.classList.add(addedRowHash[columnId]));
      }
  }
  /**
   * Adds an "overlay" of CSS classes to cell DOM elements. SlickGrid can have many such overlays associated with different keys and they are frequently used by plugins. For example, SlickGrid uses this method internally to decorate selected cells with selectedCellCssClass (see options).
   * @param {String} key A unique key you can use in calls to setCellCssStyles and removeCellCssStyles. If a hash with that key has already been set, an exception will be thrown.
   * @param {CssStyleHash} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
   * @example
   * `{
   * 	 0: { number_column: SlickEvent; title_column: SlickEvent;	},
   * 	 4: { percent_column: SlickEvent; }
   * }`
   */
  addCellCssStyles(key, hash) {
    if (this.cellCssClasses[key])
      throw new Error(`SlickGrid addCellCssStyles: cell CSS hash with key "${key}" already exists.`);
    this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, null), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
  }
  /**
   * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
   * @param {String} key A string key.
   */
  removeCellCssStyles(key) {
    this.cellCssClasses[key] && (this.updateCellCssStylesOnRenderedRows(null, this.cellCssClasses[key]), delete this.cellCssClasses[key], this.trigger(this.onCellCssStylesChanged, { key, hash: null, grid: this }));
  }
  /**
   * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash). key is name for this set of styles so you can reference it later - to modify it or remove it, for example. hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
   * Suppose you have a grid with columns:
   * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
   * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).
   * @param {String} key A string key. Will overwrite any data already associated with this key.
   * @param {Object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
   */
  setCellCssStyles(key, hash) {
    let prevHash = this.cellCssClasses[key];
    this.cellCssClasses[key] = hash, this.updateCellCssStylesOnRenderedRows(hash, prevHash), this.trigger(this.onCellCssStylesChanged, { key, hash, grid: this });
  }
  /**
   * Accepts a key name, returns the group of CSS styles defined under that name. See setCellCssStyles for more info.
   * @param {String} key A string.
   */
  getCellCssStyles(key) {
    return this.cellCssClasses[key];
  }
  /**
   * Flashes the cell twice by toggling the CSS class 4 times.
   * @param {Number} row A row index.
   * @param {Number} cell A column index.
   * @param {Number} [speed] (optional) - The milliseconds delay between the toggling calls. Defaults to 100 ms.
   */
  flashCell(row, cell, speed) {
    speed = speed || 250;
    let toggleCellClass = (cellNode, times) => {
      times < 1 || setTimeout(() => {
        times % 2 === 0 ? cellNode.classList.add(this._options.cellFlashingCssClass || "") : cellNode.classList.remove(this._options.cellFlashingCssClass || ""), toggleCellClass(cellNode, times - 1);
      }, speed);
    };
    if (this.rowsCache[row]) {
      let cellNode = this.getCellNode(row, cell);
      cellNode && toggleCellClass(cellNode, 5);
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Interactivity
  handleMouseWheel(e, _delta, deltaX, deltaY) {
    this.scrollTop = Math.max(0, this._viewportScrollContainerY.scrollTop - deltaY * this._options.rowHeight), this.scrollLeft = this._viewportScrollContainerX.scrollLeft + deltaX * 10, this._handleScroll(!0) && e.preventDefault();
  }
  handleDragInit(e, dd) {
    let cell = this.getCellFromEvent(e);
    if (!cell || !this.cellExists(cell.row, cell.cell))
      return !1;
    let retval = this.trigger(this.onDragInit, dd, e);
    return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
  }
  handleDragStart(e, dd) {
    let cell = this.getCellFromEvent(e);
    if (!cell || !this.cellExists(cell.row, cell.cell))
      return !1;
    let retval = this.trigger(this.onDragStart, dd, e);
    return retval.isImmediatePropagationStopped() ? retval.getReturnValue() : !1;
  }
  handleDrag(e, dd) {
    return this.trigger(this.onDrag, dd, e).getReturnValue();
  }
  handleDragEnd(e, dd) {
    this.trigger(this.onDragEnd, dd, e);
  }
  handleKeyDown(e) {
    let handled = this.trigger(this.onKeyDown, { row: this.activeRow, cell: this.activeCell }, e).isImmediatePropagationStopped();
    if (!handled && !e.shiftKey && !e.altKey) {
      if (this._options.editable && this.currentEditor?.keyCaptureList && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
        return;
      e.which === keyCode6.HOME ? handled = e.ctrlKey ? this.navigateTop() : this.navigateRowStart() : e.which === keyCode6.END && (handled = e.ctrlKey ? this.navigateBottom() : this.navigateRowEnd());
    }
    if (!handled)
      if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
        if (this._options.editable && this.currentEditor?.keyCaptureList && this.currentEditor.keyCaptureList.indexOf(String(e.which)) > -1)
          return;
        if (e.which === keyCode6.ESCAPE) {
          if (!this.getEditorLock()?.isActive())
            return;
          this.cancelEditAndSetFocus();
        } else
          e.which === keyCode6.PAGE_DOWN ? (this.navigatePageDown(), handled = !0) : e.which === keyCode6.PAGE_UP ? (this.navigatePageUp(), handled = !0) : e.which === keyCode6.LEFT ? handled = this.navigateLeft() : e.which === keyCode6.RIGHT ? handled = this.navigateRight() : e.which === keyCode6.UP ? handled = this.navigateUp() : e.which === keyCode6.DOWN ? handled = this.navigateDown() : e.which === keyCode6.TAB ? handled = this.navigateNext() : e.which === keyCode6.ENTER && (this._options.editable && (this.currentEditor ? this.activeRow === this.getDataLength() ? this.navigateDown() : this.commitEditAndSetFocus() : this.getEditorLock()?.commitCurrentEdit() && this.makeActiveCellEditable(void 0, void 0, e)), handled = !0);
      } else
        e.which === keyCode6.TAB && e.shiftKey && !e.ctrlKey && !e.altKey && (handled = this.navigatePrev());
    if (handled) {
      e.stopPropagation(), e.preventDefault();
      try {
        e.originalEvent.keyCode = 0;
      } catch {
      }
    }
  }
  handleClick(evt) {
    let e = evt instanceof SlickEventData8 ? evt.getNativeEvent() : evt;
    if (!this.currentEditor && (e.target !== document.activeElement || e.target.classList.contains("slick-cell"))) {
      let selection = this.getTextSelection();
      this.setFocus(), this.setTextSelection(selection);
    }
    let cell = this.getCellFromEvent(e);
    if (!(!cell || this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell) && (evt = this.trigger(this.onClick, { row: cell.row, cell: cell.cell }, evt || e), !evt.isImmediatePropagationStopped() && this.canCellBeActive(cell.row, cell.cell) && (!this.getEditorLock()?.isActive() || this.getEditorLock()?.commitCurrentEdit()))) {
      this.scrollRowIntoView(cell.row, !1);
      let preClickModeOn = e.target?.className === preClickClassName2, column = this.columns[cell.cell], suppressActiveCellChangedEvent = !!(this._options.editable && column?.editor && this._options.suppressActiveCellChangeOnEdit);
      this.setActiveCellInternal(this.getCellNode(cell.row, cell.cell), null, preClickModeOn, suppressActiveCellChangedEvent, e);
    }
  }
  handleContextMenu(e) {
    let cell = e.target.closest(".slick-cell");
    cell && (this.activeCellNode === cell && this.currentEditor !== null || this.trigger(this.onContextMenu, {}, e));
  }
  handleDblClick(e) {
    let cell = this.getCellFromEvent(e);
    !cell || this.currentEditor !== null && this.activeRow === cell.row && this.activeCell === cell.cell || (this.trigger(this.onDblClick, { row: cell.row, cell: cell.cell }, e), !e.defaultPrevented && this._options.editable && this.gotoCell(cell.row, cell.cell, !0, e));
  }
  handleHeaderMouseEnter(e) {
    let c = Utils28.storage.get(e.target.closest(".slick-header-column"), "column");
    c && this.trigger(this.onHeaderMouseEnter, {
      column: c,
      grid: this
    }, e);
  }
  handleHeaderMouseLeave(e) {
    let c = Utils28.storage.get(e.target.closest(".slick-header-column"), "column");
    c && this.trigger(this.onHeaderMouseLeave, {
      column: c,
      grid: this
    }, e);
  }
  handleHeaderRowMouseEnter(e) {
    let c = Utils28.storage.get(e.target.closest(".slick-headerrow-column"), "column");
    c && this.trigger(this.onHeaderRowMouseEnter, {
      column: c,
      grid: this
    }, e);
  }
  handleHeaderRowMouseLeave(e) {
    let c = Utils28.storage.get(e.target.closest(".slick-headerrow-column"), "column");
    c && this.trigger(this.onHeaderRowMouseLeave, {
      column: c,
      grid: this
    }, e);
  }
  handleHeaderContextMenu(e) {
    let header = e.target.closest(".slick-header-column"), column = header && Utils28.storage.get(header, "column");
    this.trigger(this.onHeaderContextMenu, { column }, e);
  }
  handleHeaderClick(e) {
    if (this.columnResizeDragging)
      return;
    let header = e.target.closest(".slick-header-column"), column = header && Utils28.storage.get(header, "column");
    column && this.trigger(this.onHeaderClick, { column }, e);
  }
  handleFooterContextMenu(e) {
    let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils28.storage.get(footer, "column");
    this.trigger(this.onFooterContextMenu, { column }, e);
  }
  handleFooterClick(e) {
    let footer = e.target.closest(".slick-footerrow-column"), column = footer && Utils28.storage.get(footer, "column");
    this.trigger(this.onFooterClick, { column }, e);
  }
  handleCellMouseOver(e) {
    this.trigger(this.onMouseEnter, {}, e);
  }
  handleCellMouseOut(e) {
    this.trigger(this.onMouseLeave, {}, e);
  }
  cellExists(row, cell) {
    return !(row < 0 || row >= this.getDataLength() || cell < 0 || cell >= this.columns.length);
  }
  /**
   * Returns a hash containing row and cell indexes. Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
   * @param x An x coordinate.
   * @param y A y coordinate.
   */
  getCellFromPoint(x, y) {
    let row = this.getRowFromPosition(y), cell = 0, w = 0;
    for (let i = 0; i < this.columns.length && w < x; i++)
      !this.columns[i] || this.columns[i].hidden || (w += this.columns[i].width, cell++);
    return cell < 0 && (cell = 0), { row, cell: cell - 1 };
  }
  getCellFromNode(cellNode) {
    let cls = /l\d+/.exec(cellNode.className);
    if (!cls)
      throw new Error(`SlickGrid getCellFromNode: cannot get cell - ${cellNode.className}`);
    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
  }
  getRowFromNode(rowNode) {
    for (let row in this.rowsCache)
      if (this.rowsCache) {
        for (let i in this.rowsCache[row].rowNode)
          if (this.rowsCache[row].rowNode?.[+i] === rowNode)
            return row ? parseInt(row, 10) : 0;
      }
    return null;
  }
  /**
   * Get frozen (pinned) row offset
   * @param {Number} row - grid row number
   */
  getFrozenRowOffset(row) {
    let offset = 0;
    return this.hasFrozenRows ? this._options.frozenBottom ? row >= this.actualFrozenRow ? this.h < this.viewportTopH ? offset = this.actualFrozenRow * this._options.rowHeight : offset = this.h : offset = 0 : row >= this.actualFrozenRow ? offset = this.frozenRowsHeight : offset = 0 : offset = 0, offset;
  }
  /**
   * Returns a hash containing row and cell indexes from a standard W3C event.
   * @param {*} event A standard W3C event.
   */
  getCellFromEvent(evt) {
    let e = evt instanceof SlickEventData8 ? evt.getNativeEvent() : evt, targetEvent = e.touches ? e.touches[0] : e, cellNode = e.target.closest(".slick-cell");
    if (!cellNode)
      return null;
    let row = this.getRowFromNode(cellNode.parentNode);
    if (this.hasFrozenRows) {
      let rowOffset = 0, c = Utils28.offset(Utils28.parents(cellNode, ".grid-canvas")[0]);
      Utils28.parents(cellNode, ".grid-canvas-bottom").length && (rowOffset = this._options.frozenBottom ? Utils28.height(this._canvasTopL) : this.frozenRowsHeight), row = this.getCellFromPoint(targetEvent.clientX - c.left, targetEvent.clientY - c.top + rowOffset + document.documentElement.scrollTop).row;
    }
    let cell = this.getCellFromNode(cellNode);
    return !Utils28.isDefined(row) || !Utils28.isDefined(cell) ? null : { row, cell };
  }
  /**
   * Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
   * @param {Number} row - A row number.
   * @param {Number} cell - A column number.
   */
  getCellNodeBox(row, cell) {
    if (!this.cellExists(row, cell))
      return null;
    let frozenRowOffset = this.getFrozenRowOffset(row), y1 = this.getRowTop(row) - frozenRowOffset, y2 = y1 + this._options.rowHeight - 1, x1 = 0;
    for (let i = 0; i < cell; i++)
      !this.columns[i] || this.columns[i].hidden || (x1 += this.columns[i].width || 0, this._options.frozenColumn === i && (x1 = 0));
    let x2 = x1 + (this.columns[cell]?.width || 0);
    return {
      top: y1,
      left: x1,
      bottom: y2,
      right: x2
    };
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Cell switching
  /**  Resets active cell. */
  resetActiveCell() {
    this.setActiveCellInternal(null, !1);
  }
  /** @alias `setFocus` */
  focus() {
    this.setFocus();
  }
  setFocus() {
    this.tabbingDirection === -1 ? this._focusSink.focus() : this._focusSink2.focus();
  }
  /** Scroll to a specific cell and make it into the view */
  scrollCellIntoView(row, cell, doPaging) {
    if (this.scrollRowIntoView(row, doPaging), cell <= this._options.frozenColumn)
      return;
    let colspan = this.getColspan(row, cell);
    this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)]);
  }
  internalScrollColumnIntoView(left, right) {
    let scrollRight = this.scrollLeft + Utils28.width(this._viewportScrollContainerX) - (this.viewportHasVScroll ? this.scrollbarDimensions?.width ?? 0 : 0);
    left < this.scrollLeft ? (this._viewportScrollContainerX.scrollLeft = left, this.handleScroll(), this.render()) : right > scrollRight && (this._viewportScrollContainerX.scrollLeft = Math.min(left, right - this._viewportScrollContainerX.clientWidth), this.handleScroll(), this.render());
  }
  /**
   * Scroll to a specific column and show it into the viewport
   * @param {Number} cell - cell column number
   */
  scrollColumnIntoView(cell) {
    this.internalScrollColumnIntoView(this.columnPosLeft[cell], this.columnPosRight[cell]);
  }
  setActiveCellInternal(newCell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent, e) {
    if (this.activeCellNode !== null && (this.makeActiveCellNormal(), this.activeCellNode.classList.remove("active"), this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.remove("active"))), this.activeCellNode = newCell, Utils28.isDefined(this.activeCellNode)) {
      let activeCellOffset = Utils28.offset(this.activeCellNode), rowOffset = Math.floor(Utils28.offset(Utils28.parents(this.activeCellNode, ".grid-canvas")[0]).top), isBottom = Utils28.parents(this.activeCellNode, ".grid-canvas-bottom").length;
      this.hasFrozenRows && isBottom && (rowOffset -= this._options.frozenBottom ? Utils28.height(this._canvasTopL) : this.frozenRowsHeight);
      let cell = this.getCellFromPoint(activeCellOffset.left, Math.ceil(activeCellOffset.top) - rowOffset);
      this.activeRow = cell.row, this.activeCell = this.activePosX = this.activeCell = this.activePosX = this.getCellFromNode(this.activeCellNode), !Utils28.isDefined(opt_editMode) && this._options.autoEditNewRow && (opt_editMode = this.activeRow === this.getDataLength() || this._options.autoEdit), this._options.showCellSelection && (this.activeCellNode.classList.add("active"), this.rowsCache[this.activeRow]?.rowNode?.forEach((node) => node.classList.add("active"))), this._options.editable && opt_editMode && this.isCellPotentiallyEditable(this.activeRow, this.activeCell) && (clearTimeout(this.h_editorLoader), this._options.asyncEditorLoading ? this.h_editorLoader = setTimeout(() => {
        this.makeActiveCellEditable(void 0, preClickModeOn, e);
      }, this._options.asyncEditorLoadDelay) : this.makeActiveCellEditable(void 0, preClickModeOn, e));
    } else
      this.activeRow = this.activeCell = null;
    suppressActiveCellChangedEvent || this.trigger(this.onActiveCellChanged, this.getActiveCell());
  }
  clearTextSelection() {
    if (document.selection?.empty)
      try {
        document.selection.empty();
      } catch {
      }
    else if (window.getSelection) {
      let sel = window.getSelection();
      sel?.removeAllRanges && sel.removeAllRanges();
    }
  }
  isCellPotentiallyEditable(row, cell) {
    let dataLength = this.getDataLength();
    return !(row < dataLength && !this.getDataItem(row) || this.columns[cell].cannotTriggerInsert && row >= dataLength || !this.columns[cell] || this.columns[cell].hidden || !this.getEditor(row, cell));
  }
  /**
   * Make the cell normal again (for example after destroying cell editor),
   * we can also optionally refocus on the current active cell (again possibly after closing cell editor)
   * @param {Boolean} [refocusActiveCell]
   */
  makeActiveCellNormal(refocusActiveCell = !1) {
    if (this.currentEditor) {
      if (this.trigger(this.onBeforeCellEditorDestroy, { editor: this.currentEditor }), this.currentEditor.destroy(), this.currentEditor = null, this.activeCellNode) {
        let d = this.getDataItem(this.activeRow);
        if (this.activeCellNode.classList.remove("editable"), this.activeCellNode.classList.remove("invalid"), d) {
          let column = this.columns[this.activeCell], formatterResult = this.getFormatter(this.activeRow, column)(this.activeRow, this.activeCell, this.getDataItemValueForColumn(d, column), column, d, this);
          this.applyFormatResultToCellNode(formatterResult, this.activeCellNode), this.invalidatePostProcessingResults(this.activeRow);
        }
        refocusActiveCell && this.setFocus();
      }
      navigator.userAgent.toLowerCase().match(/msie/) && this.clearTextSelection(), this.getEditorLock()?.deactivate(this.editController);
    }
  }
  editActiveCell(editor, preClickModeOn, e) {
    this.makeActiveCellEditable(editor, preClickModeOn, e);
  }
  makeActiveCellEditable(editor, preClickModeOn, e) {
    if (!this.activeCellNode)
      return;
    if (!this._options.editable)
      throw new Error("SlickGrid makeActiveCellEditable : should never get called when this._options.editable is false");
    if (clearTimeout(this.h_editorLoader), !this.isCellPotentiallyEditable(this.activeRow, this.activeCell))
      return;
    let columnDef = this.columns[this.activeCell], item = this.getDataItem(this.activeRow);
    if (this.trigger(this.onBeforeEditCell, { row: this.activeRow, cell: this.activeCell, item, column: columnDef, target: "grid" }).getReturnValue() === !1) {
      this.setFocus();
      return;
    }
    this.getEditorLock()?.activate(this.editController), this.activeCellNode.classList.add("editable");
    let useEditor = editor || this.getEditor(this.activeRow, this.activeCell);
    !editor && !useEditor.suppressClearOnEdit && Utils28.emptyElement(this.activeCellNode);
    let metadata = this.data?.getItemMetadata?.(this.activeRow);
    metadata = metadata?.columns;
    let columnMetaData = metadata && (metadata[columnDef.id] || metadata[this.activeCell]);
    this.currentEditor = new useEditor({
      grid: this,
      gridPosition: this.absBox(this._container),
      position: this.absBox(this.activeCellNode),
      container: this.activeCellNode,
      column: columnDef,
      columnMetaData,
      item: item || {},
      event: e,
      commitChanges: this.commitEditAndSetFocus.bind(this),
      cancelChanges: this.cancelEditAndSetFocus.bind(this)
    }), item && this.currentEditor && (this.currentEditor.loadValue(item), preClickModeOn && this.currentEditor?.preClick && this.currentEditor.preClick()), this.serializedEditorValue = this.currentEditor?.serializeValue(), this.currentEditor?.position && this.handleActiveCellPositionChange();
  }
  commitEditAndSetFocus() {
    this.getEditorLock()?.commitCurrentEdit() && (this.setFocus(), this._options.autoEdit && !this._options.autoCommitEdit && this.navigateDown());
  }
  cancelEditAndSetFocus() {
    this.getEditorLock()?.cancelCurrentEdit() && this.setFocus();
  }
  absBox(elem) {
    let box = {
      top: elem.offsetTop,
      left: elem.offsetLeft,
      bottom: 0,
      right: 0,
      width: elem.offsetWidth,
      height: elem.offsetWidth,
      visible: !0
    };
    box.bottom = box.top + box.height, box.right = box.left + box.width;
    let offsetParent = elem.offsetParent;
    for (; (elem = elem.parentNode) !== document.body && !(!elem || !elem.parentNode); ) {
      let styles = getComputedStyle(elem);
      box.visible && elem.scrollHeight !== elem.offsetHeight && styles.overflowY !== "visible" && (box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight), box.visible && elem.scrollWidth !== elem.offsetWidth && styles.overflowX !== "visible" && (box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth), box.left -= elem.scrollLeft, box.top -= elem.scrollTop, elem === offsetParent && (box.left += elem.offsetLeft, box.top += elem.offsetTop, offsetParent = elem.offsetParent), box.bottom = box.top + box.height, box.right = box.left + box.width;
    }
    return box;
  }
  /** Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. */
  getActiveCellPosition() {
    return this.absBox(this.activeCellNode);
  }
  /** Get the Grid Position */
  getGridPosition() {
    return this.absBox(this._container);
  }
  handleActiveCellPositionChange() {
    if (this.activeCellNode && (this.trigger(this.onActiveCellPositionChanged, {}), this.currentEditor)) {
      let cellBox = this.getActiveCellPosition();
      this.currentEditor.show && this.currentEditor.hide && (cellBox.visible ? this.currentEditor.show() : this.currentEditor.hide()), this.currentEditor.position && this.currentEditor.position(cellBox);
    }
  }
  /** Returns the active cell editor. If there is no actively edited cell, null is returned.   */
  getCellEditor() {
    return this.currentEditor;
  }
  /**
   * Returns an object representing the coordinates of the currently active cell:
   * @example	`{ row: activeRow, cell: activeCell }`
   */
  getActiveCell() {
    return this.activeCellNode ? { row: this.activeRow, cell: this.activeCell } : null;
  }
  /** Returns the DOM element containing the currently active cell. If no cell is active, null is returned. */
  getActiveCellNode() {
    return this.activeCellNode;
  }
  // This get/set methods are used for keeping text-selection. These don't consider IE because they don't loose text-selection.
  // Fix for firefox selection. See https://github.com/mleibman/SlickGrid/pull/746/files
  getTextSelection() {
    let textSelection = null;
    if (window.getSelection) {
      let selection = window.getSelection();
      (selection?.rangeCount ?? 0) > 0 && (textSelection = selection.getRangeAt(0));
    }
    return textSelection;
  }
  setTextSelection(selection) {
    if (window.getSelection && selection) {
      let target = window.getSelection();
      target && (target.removeAllRanges(), target.addRange(selection));
    }
  }
  /**
   * Scroll to a specific row and make it into the view
   * @param {Number} row - grid row number
   * @param {Boolean} doPaging - scroll when pagination is enabled
   */
  scrollRowIntoView(row, doPaging) {
    if (!this.hasFrozenRows || !this._options.frozenBottom && row > this.actualFrozenRow - 1 || this._options.frozenBottom && row < this.actualFrozenRow - 1) {
      let viewportScrollH = Utils28.height(this._viewportScrollContainerY), rowNumber = this.hasFrozenRows && !this._options.frozenBottom ? row - this._options.frozenRow : row, rowAtTop = rowNumber * this._options.rowHeight, rowAtBottom = (rowNumber + 1) * this._options.rowHeight - viewportScrollH + (this.viewportHasHScroll ? this.scrollbarDimensions?.height ?? 0 : 0);
      (rowNumber + 1) * this._options.rowHeight > this.scrollTop + viewportScrollH + this.offset ? (this.scrollTo(doPaging ? rowAtTop : rowAtBottom), this.render()) : rowNumber * this._options.rowHeight < this.scrollTop + this.offset && (this.scrollTo(doPaging ? rowAtBottom : rowAtTop), this.render());
    }
  }
  /**
   * Scroll to the top row and make it into the view
   * @param {Number} row - grid row number
   */
  scrollRowToTop(row) {
    this.scrollTo(row * this._options.rowHeight), this.render();
  }
  scrollPage(dir) {
    let deltaRows = dir * this.numVisibleRows, bottomOfTopmostFullyVisibleRow = this.scrollTop + this._options.rowHeight - 1;
    if (this.scrollTo((this.getRowFromPosition(bottomOfTopmostFullyVisibleRow) + deltaRows) * this._options.rowHeight), this.render(), this._options.enableCellNavigation && Utils28.isDefined(this.activeRow)) {
      let row = this.activeRow + deltaRows, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
      row >= dataLengthIncludingAddNew && (row = dataLengthIncludingAddNew - 1), row < 0 && (row = 0);
      let cell = 0, prevCell = null, prevActivePosX = this.activePosX;
      for (; cell <= this.activePosX; )
        this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
      prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
    }
  }
  /** Navigate (scroll) by a page down */
  navigatePageDown() {
    this.scrollPage(1);
  }
  /** Navigate (scroll) by a page up */
  navigatePageUp() {
    this.scrollPage(-1);
  }
  /** Navigate to the top of the grid */
  navigateTop() {
    this.navigateToRow(0);
  }
  /** Navigate to the bottom of the grid */
  navigateBottom() {
    this.navigateToRow(this.getDataLength() - 1);
  }
  navigateToRow(row) {
    let num_rows = this.getDataLength();
    if (!num_rows)
      return !0;
    if (row < 0 ? row = 0 : row >= num_rows && (row = num_rows - 1), this.scrollCellIntoView(row, 0, !0), this._options.enableCellNavigation && Utils28.isDefined(this.activeRow)) {
      let cell = 0, prevCell = null, prevActivePosX = this.activePosX;
      for (; cell <= this.activePosX; )
        this.canCellBeActive(row, cell) && (prevCell = cell), cell += this.getColspan(row, cell);
      prevCell !== null ? (this.setActiveCellInternal(this.getCellNode(row, prevCell)), this.activePosX = prevActivePosX) : this.resetActiveCell();
    }
    return !0;
  }
  getColspan(row, cell) {
    let metadata = this.data?.getItemMetadata?.(row);
    if (!metadata || !metadata.columns)
      return 1;
    let colspan = (metadata.columns[this.columns[cell].id] || metadata.columns[cell])?.colspan;
    return colspan === "*" ? colspan = this.columns.length - cell : colspan = colspan || 1, colspan;
  }
  findFirstFocusableCell(row) {
    let cell = 0;
    for (; cell < this.columns.length; ) {
      if (this.canCellBeActive(row, cell))
        return cell;
      cell += this.getColspan(row, cell);
    }
    return null;
  }
  findLastFocusableCell(row) {
    let cell = 0, lastFocusableCell = null;
    for (; cell < this.columns.length; )
      this.canCellBeActive(row, cell) && (lastFocusableCell = cell), cell += this.getColspan(row, cell);
    return lastFocusableCell;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gotoRight(row, cell, _posX) {
    if (cell >= this.columns.length)
      return null;
    do
      cell += this.getColspan(row, cell);
    while (cell < this.columns.length && !this.canCellBeActive(row, cell));
    return cell < this.columns.length ? {
      row,
      cell,
      posX: cell
    } : null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gotoLeft(row, cell, _posX) {
    if (cell <= 0)
      return null;
    let firstFocusableCell = this.findFirstFocusableCell(row);
    if (firstFocusableCell === null || firstFocusableCell >= cell)
      return null;
    let prev = {
      row,
      cell: firstFocusableCell,
      posX: firstFocusableCell
    }, pos;
    for (; ; ) {
      if (pos = this.gotoRight(prev.row, prev.cell, prev.posX), !pos)
        return null;
      if (pos.cell >= cell)
        return prev;
      prev = pos;
    }
  }
  gotoDown(row, cell, posX) {
    let prevCell, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
    for (; ; ) {
      if (++row >= dataLengthIncludingAddNew)
        return null;
      for (prevCell = cell = 0; cell <= posX; )
        prevCell = cell, cell += this.getColspan(row, cell);
      if (this.canCellBeActive(row, prevCell))
        return {
          row,
          cell: prevCell,
          posX
        };
    }
  }
  gotoUp(row, cell, posX) {
    let prevCell;
    for (; ; ) {
      if (--row < 0)
        return null;
      for (prevCell = cell = 0; cell <= posX; )
        prevCell = cell, cell += this.getColspan(row, cell);
      if (this.canCellBeActive(row, prevCell))
        return {
          row,
          cell: prevCell,
          posX
        };
    }
  }
  gotoNext(row, cell, posX) {
    if (!Utils28.isDefined(row) && !Utils28.isDefined(cell) && (row = cell = posX = 0, this.canCellBeActive(row, cell)))
      return {
        row,
        cell,
        posX: cell
      };
    let pos = this.gotoRight(row, cell, posX);
    if (pos)
      return pos;
    let firstFocusableCell = null, dataLengthIncludingAddNew = this.getDataLengthIncludingAddNew();
    for (row === dataLengthIncludingAddNew - 1 && row--; ++row < dataLengthIncludingAddNew; )
      if (firstFocusableCell = this.findFirstFocusableCell(row), firstFocusableCell !== null)
        return {
          row,
          cell: firstFocusableCell,
          posX: firstFocusableCell
        };
    return null;
  }
  gotoPrev(row, cell, posX) {
    if (!Utils28.isDefined(row) && !Utils28.isDefined(cell) && (row = this.getDataLengthIncludingAddNew() - 1, cell = posX = this.columns.length - 1, this.canCellBeActive(row, cell)))
      return {
        row,
        cell,
        posX: cell
      };
    let pos, lastSelectableCell;
    for (; !pos && (pos = this.gotoLeft(row, cell, posX), !pos); ) {
      if (--row < 0)
        return null;
      cell = 0, lastSelectableCell = this.findLastFocusableCell(row), lastSelectableCell !== null && (pos = {
        row,
        cell: lastSelectableCell,
        posX: lastSelectableCell
      });
    }
    return pos;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gotoRowStart(row, _cell, _posX) {
    let newCell = this.findFirstFocusableCell(row);
    return newCell === null ? null : {
      row,
      cell: newCell,
      posX: newCell
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gotoRowEnd(row, _cell, _posX) {
    let newCell = this.findLastFocusableCell(row);
    return newCell === null ? null : {
      row,
      cell: newCell,
      posX: newCell
    };
  }
  /** Switches the active cell one cell right skipping unselectable cells. Unline navigateNext, navigateRight stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateRight() {
    return this.navigate("right");
  }
  /** Switches the active cell one cell left skipping unselectable cells. Unline navigatePrev, navigateLeft stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not. */
  navigateLeft() {
    return this.navigate("left");
  }
  /** Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateDown() {
    return this.navigate("down");
  }
  /** Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not. */
  navigateUp() {
    return this.navigate("up");
  }
  /** Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigateNext() {
    return this.navigate("next");
  }
  /** Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not. */
  navigatePrev() {
    return this.navigate("prev");
  }
  /** Navigate to the start row in the grid */
  navigateRowStart() {
    return this.navigate("home");
  }
  /** Navigate to the end row in the grid */
  navigateRowEnd() {
    return this.navigate("end");
  }
  /**
   * @param {string} dir Navigation direction.
   * @return {boolean} Whether navigation resulted in a change of active cell.
   */
  navigate(dir) {
    if (!this._options.enableCellNavigation || !this.activeCellNode && dir !== "prev" && dir !== "next")
      return !1;
    if (!this.getEditorLock()?.commitCurrentEdit())
      return !0;
    this.setFocus();
    let tabbingDirections = {
      up: -1,
      down: 1,
      left: -1,
      right: 1,
      prev: -1,
      next: 1,
      home: -1,
      end: 1
    };
    this.tabbingDirection = tabbingDirections[dir];
    let pos = {
      up: this.gotoUp,
      down: this.gotoDown,
      left: this.gotoLeft,
      right: this.gotoRight,
      prev: this.gotoPrev,
      next: this.gotoNext,
      home: this.gotoRowStart,
      end: this.gotoRowEnd
    }[dir].call(this, this.activeRow, this.activeCell, this.activePosX);
    if (pos) {
      if (this.hasFrozenRows && this._options.frozenBottom && pos.row === this.getDataLength())
        return;
      let isAddNewRow = pos.row === this.getDataLength();
      return (!this._options.frozenBottom && pos.row >= this.actualFrozenRow || this._options.frozenBottom && pos.row < this.actualFrozenRow) && this.scrollCellIntoView(pos.row, pos.cell, !isAddNewRow && this._options.emulatePagingWhenScrolling), this.setActiveCellInternal(this.getCellNode(pos.row, pos.cell)), this.activePosX = pos.posX, !0;
    } else
      return this.setActiveCellInternal(this.getCellNode(this.activeRow, this.activeCell)), !1;
  }
  /**
   * Returns a DOM element containing a cell at a given row and cell.
   * @param row A row index.
   * @param cell A column index.
   */
  getCellNode(row, cell) {
    if (this.rowsCache[row]) {
      this.ensureCellNodesInRowsCache(row);
      try {
        return this.rowsCache[row].cellNodesByColumnIdx.length > cell ? this.rowsCache[row].cellNodesByColumnIdx[cell] : null;
      } catch {
        return this.rowsCache[row].cellNodesByColumnIdx[cell];
      }
    }
    return null;
  }
  /**
   * Sets an active cell.
   * @param {number} row - A row index.
   * @param {number} cell - A column index.
   * @param {boolean} [optionEditMode] Option Edit Mode is Auto-Edit?
   * @param {boolean} [preClickModeOn] Pre-Click Mode is Enabled?
   * @param {boolean} [suppressActiveCellChangedEvent] Are we suppressing Active Cell Changed Event (defaults to false)
   */
  setActiveCell(row, cell, opt_editMode, preClickModeOn, suppressActiveCellChangedEvent) {
    this.initialized && (row > this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || this._options.enableCellNavigation && (this.scrollCellIntoView(row, cell, !1), this.setActiveCellInternal(this.getCellNode(row, cell), opt_editMode, preClickModeOn, suppressActiveCellChangedEvent)));
  }
  /**
   * Sets an active cell.
   * @param {number} row - A row index.
   * @param {number} cell - A column index.
   * @param {boolean} [suppressScrollIntoView] - optionally suppress the ScrollIntoView that happens by default (defaults to false)
   */
  setActiveRow(row, cell, suppressScrollIntoView) {
    this.initialized && (row > this.getDataLength() || row < 0 || (cell ?? 0) >= this.columns.length || (cell ?? 0) < 0 || (this.activeRow = row, suppressScrollIntoView || this.scrollCellIntoView(row, cell || 0, !1)));
  }
  /**
   * Returns true if you can click on a given cell and make it the active focus.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeActive(row, cell) {
    if (!this.options.enableCellNavigation || row >= this.getDataLengthIncludingAddNew() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
      return !1;
    let rowMetadata = this.data?.getItemMetadata?.(row);
    if (rowMetadata?.focusable !== void 0)
      return !!rowMetadata.focusable;
    let columnMetadata = rowMetadata?.columns;
    return columnMetadata?.[this.columns[cell].id]?.focusable !== void 0 ? !!columnMetadata[this.columns[cell].id].focusable : columnMetadata?.[cell]?.focusable !== void 0 ? !!columnMetadata[cell].focusable : !!this.columns[cell].focusable;
  }
  /**
   * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
   * @param {number} row A row index.
   * @param {number} col A column index.
   */
  canCellBeSelected(row, cell) {
    if (row >= this.getDataLength() || row < 0 || cell >= this.columns.length || cell < 0 || !this.columns[cell] || this.columns[cell].hidden)
      return !1;
    let rowMetadata = this.data?.getItemMetadata?.(row);
    if (rowMetadata?.selectable !== void 0)
      return !!rowMetadata.selectable;
    let columnMetadata = rowMetadata?.columns && (rowMetadata.columns[this.columns[cell].id] || rowMetadata.columns[cell]);
    return columnMetadata?.selectable !== void 0 ? !!columnMetadata.selectable : !!this.columns[cell].selectable;
  }
  /**
   * Accepts a row integer and a cell integer, scrolling the view to the row where row is its row index, and cell is its cell index. Optionally accepts a forceEdit boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.
   * Unlike setActiveCell, this scrolls the row into the viewport and sets the keyboard focus.
   * @param {Number} row A row index.
   * @param {Number} cell A column index.
   * @param {Boolean} [forceEdit] If true, will attempt to initiate the edit dialogue for the field in the specified cell.
   */
  gotoCell(row, cell, forceEdit, e) {
    if (!this.initialized || !this.canCellBeActive(row, cell) || !this.getEditorLock()?.commitCurrentEdit())
      return;
    this.scrollCellIntoView(row, cell, !1);
    let newCell = this.getCellNode(row, cell), column = this.columns[cell], suppressActiveCellChangedEvent = !!(this._options.editable && column?.editor && this._options.suppressActiveCellChangeOnEdit);
    this.setActiveCellInternal(newCell, forceEdit || row === this.getDataLength() || this._options.autoEdit, null, suppressActiveCellChangedEvent, e), this.currentEditor || this.setFocus();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  // IEditor implementation for the editor lock
  commitCurrentEdit() {
    let self = this, item = self.getDataItem(self.activeRow), column = self.columns[self.activeCell];
    if (self.currentEditor) {
      if (self.currentEditor.isValueChanged()) {
        let validationResults = self.currentEditor.validate();
        if (validationResults.valid) {
          let row = self.activeRow, cell = self.activeCell, editor = self.currentEditor, serializedValue = self.currentEditor.serializeValue(), prevSerializedValue = self.serializedEditorValue;
          if (self.activeRow < self.getDataLength()) {
            let editCommand = {
              row,
              cell,
              editor,
              serializedValue,
              prevSerializedValue,
              execute: () => {
                editor.applyValue(item, serializedValue), self.updateRow(row), self.trigger(self.onCellChange, { command: "execute", row, cell, item, column });
              },
              undo: () => {
                editor.applyValue(item, prevSerializedValue), self.updateRow(row), self.trigger(self.onCellChange, { command: "undo", row, cell, item, column });
              }
            };
            self.options.editCommandHandler ? (self.makeActiveCellNormal(!0), self.options.editCommandHandler(item, column, editCommand)) : (editCommand.execute(), self.makeActiveCellNormal(!0));
          } else {
            let newItem = {};
            self.currentEditor.applyValue(newItem, self.currentEditor.serializeValue()), self.makeActiveCellNormal(!0), self.trigger(self.onAddNewRow, { item: newItem, column });
          }
          return !self.getEditorLock()?.isActive();
        } else
          return self.activeCellNode && (self.activeCellNode.classList.remove("invalid"), Utils28.width(self.activeCellNode), self.activeCellNode.classList.add("invalid")), self.trigger(self.onValidationError, {
            editor: self.currentEditor,
            cellNode: self.activeCellNode,
            validationResults,
            row: self.activeRow,
            cell: self.activeCell,
            column
          }), self.currentEditor.focus(), !1;
      }
      self.makeActiveCellNormal(!0);
    }
    return !0;
  }
  cancelCurrentEdit() {
    return this.makeActiveCellNormal(), !0;
  }
  rowsToRanges(rows) {
    let ranges = [], lastCell = this.columns.length - 1;
    for (let i = 0; i < rows.length; i++)
      ranges.push(new SlickRange7(rows[i], 0, rows[i], lastCell));
    return ranges;
  }
  /** Returns an array of row indices corresponding to the currently selected rows. */
  getSelectedRows() {
    if (!this.selectionModel)
      throw new Error("SlickGrid Selection model is not set");
    return this.selectedRows.slice(0);
  }
  /**
   * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
   * @param {Array<number>} rowsArray - an array of row numbers.
   * @param {String} [caller] - an optional string to identify who called the method
   */
  setSelectedRows(rows, caller) {
    if (!this.selectionModel)
      throw new Error("SlickGrid Selection model is not set");
    this && this.getEditorLock && !this.getEditorLock()?.isActive() && this.selectionModel.setSelectedRanges(this.rowsToRanges(rows), caller || "SlickGrid.setSelectedRows");
  }
  /** html sanitizer to avoid scripting attack */
  sanitizeHtmlString(dirtyHtml, suppressLogging) {
    if (!this._options.sanitizer || typeof dirtyHtml != "string")
      return dirtyHtml;
    let cleanHtml = this._options.sanitizer(dirtyHtml);
    return !suppressLogging && this._options.logSanitizedHtml && this.logMessageCount <= this.logMessageMaxCount && cleanHtml !== dirtyHtml && (console.log(`sanitizer altered html: ${dirtyHtml} --> ${cleanHtml}`), this.logMessageCount === this.logMessageMaxCount && console.log(`sanitizer: silencing messages after first ${this.logMessageMaxCount}`), this.logMessageCount++), cleanHtml;
  }
};

// src/slick.remotemodel-yahoo.ts
var SlickRemoteModelYahoo = class {
  constructor() {
    // protected
    __publicField(this, "PAGESIZE", 10);
    __publicField(this, "data", { length: 0 });
    __publicField(this, "h_request", null);
    __publicField(this, "req", null);
    // ajax request
    // events
    __publicField(this, "onDataLoading", new Slick.Event());
    __publicField(this, "onDataLoaded", new Slick.Event());
    if (!(window.$ || window.jQuery) || !window.$.jsonp)
      throw new Error("SlickRemoteModel requires both jQuery and jQuery jsonp library to be loaded.");
    this.init();
  }
  init() {
  }
  isDataLoaded(from, to) {
    for (let i = from; i <= to; i++)
      if (this.data[i] === void 0 || this.data[i] === null)
        return !1;
    return !0;
  }
  clear() {
    for (let key in this.data)
      delete this.data[key];
    this.data.length = 0;
  }
  ensureData(from, to) {
    if (this.req) {
      this.req.abort();
      for (let i = this.req.fromPage; i <= this.req.toPage; i++)
        this.data[i * this.PAGESIZE] = void 0;
    }
    from < 0 && (from = 0), this.data.length > 0 && (to = Math.min(to, this.data.length - 1));
    let fromPage = Math.floor(from / this.PAGESIZE), toPage = Math.floor(to / this.PAGESIZE);
    for (; this.data[fromPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
      fromPage++;
    for (; this.data[toPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
      toPage--;
    if (fromPage > toPage || fromPage === toPage && this.data[fromPage * this.PAGESIZE] !== void 0) {
      this.onDataLoaded.notify({ from, to });
      return;
    }
    let recStart = fromPage * this.PAGESIZE, recCount = (toPage - fromPage) * this.PAGESIZE + this.PAGESIZE, url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(" + recStart + "%2C" + recCount + ")%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json";
    this.h_request !== null && clearTimeout(this.h_request), this.h_request = setTimeout(() => {
      for (let i = fromPage; i <= toPage; i++)
        this.data[i * this.PAGESIZE] = null;
      this.onDataLoading.notify({ from, to }), this.req = window.$.jsonp({
        url,
        callbackParameter: "callback",
        cache: !0,
        success: (json) => {
          this.onSuccess(json, recStart);
        },
        error: () => {
          this.onError(fromPage, toPage);
        }
      }), this.req.fromPage = fromPage, this.req.toPage = toPage;
    }, 50);
  }
  onError(fromPage, toPage) {
    alert("error loading pages " + fromPage + " to " + toPage);
  }
  // SAMPLE DATA
  //    {
  //      "query": {
  //        "count": 40,
  //        "created": "2015-03-03T00:34:00Z",
  //        "lang": "en-US",
  //        "results": {
  //          "item": [
  //            {
  //              "title": "Netanyahu assails Iran deal, touts US-Israel ties",
  //              "description": "<p><a href=\"http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html\"><img src=\"http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg\" width=\"130\" height=\"86\" alt=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" align=\"left\" title=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" border=\"0\" /></a>WASHINGTON (AP) — Seeking to lower tensions, Benjamin Netanyahu and U.S. officials cast their dispute over Iran as a family squabble on Monday, even as the Israeli leader claimed President Barack Obama did not — and could not — fully understand his nation&#039;s vital security concerns.</p><br clear=\"all\"/>",
  //              "link": "http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html",
  //              "pubDate": "Mon, 02 Mar 2015 19:17:36 -0500",
  //              "source": {
  //                "url": "http://www.ap.org/",
  //                "content": "Associated Press"
  //              },
  //              "guid": {
  //                "isPermaLink": "false",
  //                "content": "netanyahu-us-officials-face-off-iran-133539021--politics"
  //              },
  //              "content": {
  //                "height": "86",
  //                "type": "image/jpeg",
  //                "url": "http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg",
  //                "width": "130"
  //              },
  //              "text": {
  //                "type": "html",
  //                "content": "<p><a href=\"http://news.yahoo.com/netanyahu-us-officials-face-off-iran-133539021--politics.html\"><img src=\"http://l2.yimg.com/bt/api/res/1.2/4eoBxbJStrbGAKbmBYOJfg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDtoPTg2O3E9NzU7dz0xMzA-/http://media.zenfs.com/en_us/News/ap_webfeeds/2f3a20c2d46d9f096f0f6a706700d430.jpg\" width=\"130\" height=\"86\" alt=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" align=\"left\" title=\"Israeli Prime Minister Benjamin Netanyahu addresses the 2015 American Israel Public Affairs Committee (AIPAC) Policy Conference in Washington, Monday, March 2, 2015. (AP Photo/Cliff Owen)\" border=\"0\" /></a>WASHINGTON (AP) — Seeking to lower tensions, Benjamin Netanyahu and U.S. officials cast their dispute over Iran as a family squabble on Monday, even as the Israeli leader claimed President Barack Obama did not — and could not — fully understand his nation&#039;s vital security concerns.</p><br clear=\"all\"/>"
  //              },
  //              "credit": {
  //                "role": "publishing company"
  //              }
  //            },
  //            {... },
  //            {... },
  //          ]
  //        }
  //      }
  //    }
  onSuccess(json, recStart) {
    let recEnd = recStart;
    if (json.query.count > 0) {
      let results = json.query.results.item;
      recEnd = recStart + results.length, this.data.length = 100;
      for (let i = 0; i < results.length; i++) {
        let item = results[i];
        item.pubDate = new Date(item.pubDate), this.data[recStart + i] = { index: recStart + i }, this.data[recStart + i].pubDate = item.pubDate, this.data[recStart + i].title = item.title, this.data[recStart + i].url = item.link, this.data[recStart + i].text = item.description;
      }
    }
    this.req = null, this.onDataLoaded.notify({ from: recStart, to: recEnd });
  }
  reloadData(from, to) {
    for (let i = from; i <= to; i++)
      delete this.data[i];
    this.ensureData(from, to);
  }
  // return {
  //   // properties
  //   "data": data,
  //   // methods
  //   "clear": clear,
  //   "isDataLoaded": isDataLoaded,
  //   "ensureData": ensureData,
  //   "reloadData": reloadData,
  //   // events
  //   "onDataLoading": onDataLoading,
  //   "onDataLoaded": onDataLoaded
  // };
};

// src/slick.remotemodel.ts
var SlickRemoteModel = class {
  constructor() {
    // private
    __publicField(this, "PAGESIZE", 50);
    __publicField(this, "data", { length: 0 });
    __publicField(this, "searchstr", "");
    __publicField(this, "sortcol", null);
    __publicField(this, "sortdir", 1);
    __publicField(this, "h_request", null);
    __publicField(this, "req", null);
    // ajax request
    // events
    __publicField(this, "onDataLoading", new Slick.Event());
    __publicField(this, "onDataLoaded", new Slick.Event());
    if (!(window.$ || window.jQuery) || !window.$.jsonp)
      throw new Error("SlickRemoteModel requires both jQuery and jQuery jsonp library to be loaded.");
    this.init();
  }
  init() {
  }
  isDataLoaded(from, to) {
    for (let i = from; i <= to; i++)
      if (this.data[i] === void 0 || this.data[i] === null)
        return !1;
    return !0;
  }
  clear() {
    for (let key in this.data)
      delete this.data[key];
    this.data.length = 0;
  }
  ensureData(from, to) {
    if (this.req) {
      this.req.abort();
      for (let i = this.req.fromPage; i <= this.req.toPage; i++)
        this.data[i * this.PAGESIZE] = void 0;
    }
    from < 0 && (from = 0), this.data.length > 0 && (to = Math.min(to, this.data.length - 1));
    let fromPage = Math.floor(from / this.PAGESIZE), toPage = Math.floor(to / this.PAGESIZE);
    for (; this.data[fromPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
      fromPage++;
    for (; this.data[toPage * this.PAGESIZE] !== void 0 && fromPage < toPage; )
      toPage--;
    if (fromPage > toPage || fromPage === toPage && this.data[fromPage * this.PAGESIZE] !== void 0) {
      this.onDataLoaded.notify({ from, to });
      return;
    }
    let url = "http://octopart.com/api/v3/parts/search?apikey=68b25f31&include[]=short_description&show[]=uid&show[]=manufacturer&show[]=mpn&show[]=brand&show[]=octopart_url&show[]=short_description&q=" + this.searchstr + "&start=" + fromPage * this.PAGESIZE + "&limit=" + ((toPage - fromPage) * this.PAGESIZE + this.PAGESIZE);
    this.sortcol !== null && (url += "&sortby=" + this.sortcol + (this.sortdir > 0 ? "+asc" : "+desc")), this.h_request !== null && clearTimeout(this.h_request), this.h_request = setTimeout(() => {
      for (let i = fromPage; i <= toPage; i++)
        this.data[i * this.PAGESIZE] = null;
      this.onDataLoading.notify({ from, to }), this.req = window.$.jsonp({
        url,
        callbackParameter: "callback",
        cache: !0,
        success: this.onSuccess,
        error: () => this.onError(fromPage, toPage)
      }), this.req.fromPage = fromPage, this.req.toPage = toPage;
    }, 50);
  }
  onError(fromPage, toPage) {
    alert("error loading pages " + fromPage + " to " + toPage);
  }
  onSuccess(resp) {
    let from = resp.request.start, to = from + resp.results.length;
    this.data.length = Math.min(parseInt(resp.hits), 1e3);
    for (let i = 0; i < resp.results.length; i++) {
      let item = resp.results[i].item;
      this.data[from + i] = item, this.data[from + i].index = from + i;
    }
    this.req = null, this.onDataLoaded.notify({ from, to });
  }
  reloadData(from, to) {
    for (let i = from; i <= to; i++)
      delete this.data[i];
    this.ensureData(from, to);
  }
  setSort(column, dir) {
    this.sortcol = column, this.sortdir = dir, this.clear();
  }
  setSearch(str) {
    this.searchstr = str, this.clear();
  }
};
/**
 * @license
 * (c) 2009-present Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v5.5.4
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing JS DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */
//# sourceMappingURL=index.js.map
