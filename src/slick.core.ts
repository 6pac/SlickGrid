/**
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */

import type {
  AnyFunction,
  CSSStyleDeclarationWritable,
  DragRange,
  EditController,
  ElementEventListener,
  Handler,
  InferDOMType,
  MergeTypes,
  CanvasWidthsGeometry,
  FreezeBandCounts,
  PaneHeightsGeometry,
  ViewportFreezeState,
  ViewportMgrBuildOptions,
} from './models/index.js';
import type { SlickGrid } from './slick.grid.js';

export interface BasePubSub {
  publish<ArgType = any>(_eventName: string | any, _data?: ArgType): any;
  subscribe<ArgType = any>(_eventName: string | Function, _callback: (data: ArgType) => void): any;
}

/**
 * An event object for passing data to event handlers and letting them control propagation.
 * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
 * @class EventData
 * @constructor
 */
export class SlickEventData<ArgType = any> {
  protected _isPropagationStopped = false;
  protected _isImmediatePropagationStopped = false;
  protected _isDefaultPrevented = false;
  protected returnValues: string[] = [];
  protected returnValue: any = undefined;
  protected _eventTarget?: EventTarget | null;
  protected nativeEvent?: Event | null;
  protected arguments_?: ArgType;

  // public props that can be optionally pulled from the provided Event in constructor
  // they are all optional props because it really depends on the type of Event provided (KeyboardEvent, MouseEvent, ...)
  readonly altKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly shiftKey?: boolean;
  readonly key?: string;
  readonly keyCode?: number;
  readonly clientX?: number;
  readonly clientY?: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly pageX?: number;
  readonly pageY?: number;
  readonly bubbles?: boolean;
  readonly target?: HTMLElement;
  readonly type?: string;
  readonly which?: number;
  readonly x?: number;
  readonly y?: number;

  get defaultPrevented() {
    return this._isDefaultPrevented;
  }

  constructor(protected event?: Event | null, protected args?: ArgType) {
    this.nativeEvent = event;
    this.arguments_ = args;

    // when we already have an event, we want to keep some of the event properties
    // looping through some props is the only way to keep and sync these properties to the returned EventData
    if (event) {
      [
        'altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'key', 'keyCode',
        'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY',
        'bubbles', 'target', 'type', 'which', 'x', 'y'
      ].forEach(key => (this as any)[key] = event[key as keyof Event]);
    }
    this._eventTarget = this.nativeEvent ? this.nativeEvent.target : undefined;
  }

  /**
   * Stops event from propagating up the DOM tree.
   * @method stopPropagation
   */
  stopPropagation() {
    this._isPropagationStopped = true;
    this.nativeEvent?.stopPropagation();
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
    this._isImmediatePropagationStopped = true;
    if (this.nativeEvent) {
      this.nativeEvent.stopImmediatePropagation();
    }
  };

  /**
   * Returns whether stopImmediatePropagation was called on this event object.\
   * @method isImmediatePropagationStopped
   * @return {Boolean}
   */
  isImmediatePropagationStopped() {
    return this._isImmediatePropagationStopped;
  };

  getNativeEvent<E extends Event>() {
    return this.nativeEvent as E;
  }

  preventDefault() {
    if (this.nativeEvent) {
      this.nativeEvent.preventDefault();
    }
    this._isDefaultPrevented = true;
  }

  isDefaultPrevented() {
    if (this.nativeEvent) {
      return this.nativeEvent.defaultPrevented;
    }
    return this._isDefaultPrevented;
  }

  addReturnValue(value: any) {
    this.returnValues.push(value);
    if (this.returnValue === undefined && value !== undefined) {
      this.returnValue = value;
    }
  }

  getReturnValue() {
    return this.returnValue;
  }

  getArguments() {
    return this.arguments_;
  }
}

/**
 * A simple publisher-subscriber implementation.
 * @class Event
 * @constructor
 */
export class SlickEvent<ArgType = any> {
  protected _handlers: Handler<ArgType>[] = [];
  protected _pubSubService?: BasePubSub;

  get subscriberCount() {
    return this._handlers.length;
  }

  /**
   * Constructor
   * @param {String} [eventName] - event name that could be used for dispatching CustomEvent (when enabled)
   * @param {BasePubSub} [pubSubService] - event name that could be used for dispatching CustomEvent (when enabled)
   */
  constructor(protected readonly eventName?: string, protected readonly pubSub?: BasePubSub) {
    this._pubSubService = pubSub;
  }

  /**
   * Adds an event handler to be called when the event is fired.
   * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
   * object the event was fired with.<p>
   * @method subscribe
   * @param {Function} fn - Event handler.
   */
  subscribe(fn: Handler<ArgType>) {
    this._handlers.push(fn);
  }

  /**
   * Removes an event handler added with <code>subscribe(fn)</code>.
   * @method unsubscribe
   * @param {Function} [fn] - Event handler to be removed.
   */
  unsubscribe(fn?: Handler<ArgType>) {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i] === fn) {
        this._handlers.splice(i, 1);
      }
    }
  }

  /**
   * Fires an event notifying all subscribers.
   * @method notify
   * @param {Object} args Additional data object to be passed to all handlers.
   * @param {EventData} [event] - An <code>EventData</code> object to be passed to all handlers.
   *      For DOM events, an existing W3C event object can be passed in.
   * @param {Object} [scope] - The scope ("this") within which the handler will be executed.
   *      If not specified, the scope will be set to the <code>Event</code> instance.
   */
  notify(args: ArgType, evt?: SlickEventData<ArgType> | Event | MergeTypes<SlickEventData<ArgType>, Event> | null, scope?: any) {
    const sed: SlickEventData = evt instanceof SlickEventData
      ? evt
      : new SlickEventData(evt, args);
    scope = scope || this;

    for (let i = 0; i < this._handlers.length && !(sed.isPropagationStopped() || sed.isImmediatePropagationStopped()); i++) {
      const returnValue = this._handlers[i].call(scope, sed, args);
      sed.addReturnValue(returnValue);
    }

    // user can optionally add a global PubSub Service which makes it easy to publish/subscribe to events
    if (typeof this._pubSubService?.publish === 'function' && this.eventName) {
      const ret = this._pubSubService.publish<{ args: ArgType; eventData?: SlickEventData<ArgType>; nativeEvent?: Event; }>(this.eventName, { args, eventData: sed });
      sed.addReturnValue(ret);
    }
    return sed;
  }

  setPubSubService(pubSub: BasePubSub) {
    this._pubSubService = pubSub;
  }
}

export class SlickEventHandler {
  protected handlers: Array<{ event: SlickEvent; handler: Handler<any>; }> = [];

  subscribe<T = any>(event: SlickEvent<T>, handler: Handler<T>) {
    this.handlers.push({ event, handler });
    event.subscribe(handler);

    return this as SlickEventHandler;  // allow chaining
  }

  unsubscribe<T = any>(event: SlickEvent<T>, handler: Handler<T>) {
    let i = this.handlers.length;
    while (i--) {
      if (this.handlers[i].event === event &&
        this.handlers[i].handler === handler) {
        this.handlers.splice(i, 1);
        event.unsubscribe(handler);
        return;
      }
    }

    return this as SlickEventHandler;  // allow chaining
  }

  unsubscribeAll() {
    let i = this.handlers.length;
    while (i--) {
      this.handlers[i].event.unsubscribe(this.handlers[i].handler);
    }
    this.handlers = [];

    return this as SlickEventHandler;  // allow chaining
  }
}

/**
 * A structure containing a range of cells.
 * @class Range
 * @constructor
 * @param fromRow {Integer} Starting row.
 * @param fromCell {Integer} Starting cell.
 * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
 * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
 */
export class SlickRange {
  fromRow: number;
  fromCell: number;
  toCell: number;
  toRow: number;

  constructor(fromRow: number, fromCell: number, toRow?: number, toCell?: number) {
    if (toRow === undefined && toCell === undefined) {
      toRow = fromRow;
      toCell = fromCell;
    }

    /**
     * @property fromRow
     * @type {Integer}
     */
    this.fromRow = Math.min(fromRow, toRow as number);

    /**
     * @property fromCell
     * @type {Integer}
     */
    this.fromCell = Math.min(fromCell, toCell as number);

    /**
     * @property toCell
     * @type {Integer}
     */
    this.toCell = Math.max(fromCell, toCell as number);

    /**
     * @property toRow
     * @type {Integer}
     */
    this.toRow = Math.max(fromRow, toRow as number);
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
   * Row Count.
   * @method rowCount
   * @return {Number}
   */
  rowCount() {
    return this.toRow - this.fromRow + 1;
  }

  /**
   * Cell Count.
   * @method cellCount
   * @return {Number}
   */
  cellCount() {
    return this.toCell - this.fromCell + 1;
  }

  /**
   * Returns whether a range contains a given cell.
   * @method contains
   * @param row {Integer}
   * @param cell {Integer}
   * @return {Boolean}
   */
  contains(row: number, cell: number) {
    return row >= this.fromRow && row <= this.toRow &&
      cell >= this.fromCell && cell <= this.toCell;
  }

  /**
   * Returns a readable representation of a range.
   * @method toString
   * @return {String}
   */
  toString() {
    if (this.isSingleCell()) {
      return `(${this.fromRow}:${this.fromCell})`;
    }
    else {
      return `(${this.fromRow}:${this.fromCell} - ${this.toRow}:${this.toCell})`;
    }
  };
}

/**
 * A structure containing a range of cells to copy to.
 * @class SlickCopyRange
 * @constructor
 * @param fromRow {Integer} Starting row.
 * @param fromCell {Integer} Starting cell.
 * @param rowCount {Integer} Row Count.
 * @param cellCount {Integer} Cell Count.
 */
export class SlickCopyRange {
  fromRow: number;
  fromCell: number;
  rowCount: number;
  cellCount: number;

  constructor(fromRow: number, fromCell: number, rowCount: number, cellCount: number) {
    this.fromRow = fromRow;
    this.fromCell = fromCell;
    this.rowCount = rowCount;
    this.cellCount = cellCount;
  }

}

/**
 * Create a handle element for Excel style drag-replace
 * @class DragExtendHandle
 * @constructor
 * @param gridUid {String} string UID of parent grid
 */
export class SlickDragExtendHandle {
  id: string;
  cssClass = 'slick-drag-replace-handle';

  constructor(gridUid: string) {
    this.id = `${gridUid}_drag_replace_handle`;
  }

  removeEl() {
    document.getElementById(this.id)?.remove();
  }

  createEl(activeCellNode: any) {
    if (activeCellNode) {
      const dragReplaceEl = document.createElement("div");
      dragReplaceEl.classList.add("slick-drag-replace-handle");
      dragReplaceEl.id = this.id;
      activeCellNode.appendChild(dragReplaceEl);
    }
  }
}

/**
 * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
 * @class NonDataItem
 * @constructor
 */
export class SlickNonDataItem {
  __nonDataRow = true;
}


/**
 * Information about a group of rows.
 * @class Group
 * @extends Slick.NonDataItem
 * @constructor
 */
export class SlickGroup extends SlickNonDataItem {
  __group = true;

  /**
   * Grouping level, starting with 0.
   * @property level
   * @type {Number}
   */
  level = 0;

  /**
   * Number of rows in the group.
   * @property count
   * @type {Integer}
   */
  count = 0;

  /**
   * Grouping value.
   * @property value
   * @type {Object}
   */
  value = null;

  /**
   * Formatted display value of the group.
   * @property title
   * @type {String}
   */
  title: string | null = null;

  /**
   * Whether a group is collapsed.
   * @property collapsed
   * @type {Boolean}
   */
  collapsed: boolean | number = false;

  /**
   * Whether a group selection checkbox is checked.
   * @property selectChecked
   * @type {Boolean}
   */
  selectChecked = false;

  /**
   * GroupTotals, if any.
   * @property totals
   * @type {GroupTotals}
   */
  totals: SlickGroupTotals = null as any;

  /**
   * Rows that are part of the group.
   * @property rows
   * @type {Array}
   */
  rows: number[] = [];

  /**
   * Sub-groups that are part of the group.
   * @property groups
   * @type {Array}
   */
  groups: any[] = null as any;

  /**
   * A unique key used to identify the group.  This key can be used in calls to DataView
   * collapseGroup() or expandGroup().
   * @property groupingKey
   * @type {Object}
   */
  groupingKey: any = null;

  constructor() {
    super();
  }
  /**
   * Compares two Group instances.
   * @method equals
   * @return {Boolean}
   * @param group {Group} Group instance to compare to.
   */
  equals(group: SlickGroup): boolean {
    return this.value === group.value &&
      this.count === group.count &&
      this.collapsed === group.collapsed &&
      this.title === group.title;
  };
}

/**
 * Information about group totals.
 * An instance of GroupTotals will be created for each totals row and passed to the aggregators
 * so that they can store arbitrary data in it.  That data can later be accessed by group totals
 * formatters during the display.
 * @class GroupTotals
 * @extends Slick.NonDataItem
 * @constructor
 */
export class SlickGroupTotals extends SlickNonDataItem {
  __groupTotals = true;

  /**
   * Parent Group.
   * @param group
   * @type {Group}
   */
  group: SlickGroup = null as any;

  /**
   * Whether the totals have been fully initialized / calculated.
   * Will be set to false for lazy-calculated group totals.
   * @param initialized
   * @type {Boolean}
   */
  initialized = false;

  constructor() {
    super();
  }
}

/**
 * A locking helper to track the active edit controller and ensure that only a single controller
 * can be active at a time.  This prevents a whole class of state and validation synchronization
 * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
 * and attempt a commit or cancel before proceeding.
 * @class EditorLock
 * @constructor
 */
export class SlickEditorLock {
  activeEditController: any = null;

  /**
   * Returns true if a specified edit controller is active (has the edit lock).
   * If the parameter is not specified, returns true if any edit controller is active.
   * @method isActive
   * @param editController {EditController}
   * @return {Boolean}
   */
  isActive(editController?: EditController): boolean {
    return (editController ? this.activeEditController === editController : this.activeEditController !== null);
  };

  /**
   * Sets the specified edit controller as the active edit controller (acquire edit lock).
   * If another edit controller is already active, and exception will be throw new Error(.
   * @method activate
   * @param editController {EditController} edit controller acquiring the lock
   */
  activate(editController: EditController) {
    if (editController === this.activeEditController) { // already activated?
      return;
    }
    if (this.activeEditController !== null) {
      throw new Error(`Slick.EditorLock.activate: an editController is still active, can't activate another editController`);
    }
    if (!editController.commitCurrentEdit) {
      throw new Error('Slick.EditorLock.activate: editController must implement .commitCurrentEdit()');
    }
    if (!editController.cancelCurrentEdit) {
      throw new Error('Slick.EditorLock.activate: editController must implement .cancelCurrentEdit()');
    }
    this.activeEditController = editController;
  };

  /**
   * Unsets the specified edit controller as the active edit controller (release edit lock).
   * If the specified edit controller is not the active one, an exception will be throw new Error(.
   * @method deactivate
   * @param editController {EditController} edit controller releasing the lock
   */
  deactivate(editController: EditController) {
    if (!this.activeEditController) {
      return;
    }
    if (this.activeEditController !== editController) {
      throw new Error('Slick.EditorLock.deactivate: specified editController is not the currently active one');
    }
    this.activeEditController = null;
  };

  /**
   * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
   * controller and returns whether the commit attempt was successful (commit may fail due to validation
   * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
   * and false otherwise.  If no edit controller is active, returns true.
   * @method commitCurrentEdit
   * @return {Boolean}
   */
  commitCurrentEdit(): boolean {
    return (this.activeEditController ? this.activeEditController.commitCurrentEdit() : true);
  };

  /**
   * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
   * controller and returns whether the edit was successfully cancelled.  If no edit controller is
   * active, returns true.
   * @method cancelCurrentEdit
   * @return {Boolean}
   */
  cancelCurrentEdit(): boolean {
    return (this.activeEditController ? this.activeEditController.cancelCurrentEdit() : true);
  };
}

function regexSanitizer(dirtyHtml: string) {
  return dirtyHtml.replace(/(\b)(on[a-z]+)(\s*)=|javascript:([^>]*)[^>]*|(<\s*)(\/*)script([<>]*).*(<\s*)(\/*)script(>*)|(&lt;)(\/*)(script|script defer)(.*)(&gt;|&gt;">)/gi, '');
}

/**
 * A simple binding event service to keep track of all JavaScript events with callback listeners,
 * it allows us to unbind event(s) and their listener(s) by calling a simple unbind method call.
 * Unbinding is a necessary step to make sure that all event listeners are removed to avoid memory leaks when destroing the grid
 */
export class BindingEventService {
  protected _boundedEvents: ElementEventListener[] = [];

  getBoundedEvents() {
    return this._boundedEvents;
  }

  destroy() {
    this.unbindAll();
  }

  /** Bind an event listener to any element */
  bind(element: Element | Window, eventName: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, groupName = '') {
    if (element) {
      element.addEventListener(eventName, listener, options);
      this._boundedEvents.push({ element, eventName, listener, groupName });
    }
  }

  /** Unbind all will remove every every event handlers that were bounded earlier */
  unbind(element: Element | Window, eventName: string, listener: EventListenerOrEventListenerObject) {
    if (element?.removeEventListener) {
      element.removeEventListener(eventName, listener);
    }
  }

  unbindByEventName(element: Element | Window, eventName: string) {
    const boundedEvent = this._boundedEvents.find(e => e.element === element && e.eventName === eventName);
    if (boundedEvent) {
      this.unbind(boundedEvent.element, boundedEvent.eventName, boundedEvent.listener);
    }
  }

  /**
   * Unbind all event listeners that were bounded, optionally provide a group name to unbind all listeners assigned to that specific group only.
   */
  unbindAll(groupName?: string | string[]) {
    if (groupName) {
      const groupNames = Array.isArray(groupName) ? groupName : [groupName];

      // unbind only the bounded event with a specific group
      // Note: we need to loop in reverse order to avoid array reindexing (causing index offset) after a splice is called
      for (let i = this._boundedEvents.length - 1; i >= 0; --i) {
        const boundedEvent = this._boundedEvents[i];
        if (groupNames.some(g => g === boundedEvent.groupName)) {
          const { element, eventName, listener } = boundedEvent;
          this.unbind(element, eventName, listener);
          this._boundedEvents.splice(i, 1);
        }
      }
    } else {
      // unbind everything
      while (this._boundedEvents.length > 0) {
        const boundedEvent = this._boundedEvents.pop() as ElementEventListener;
        const { element, eventName, listener } = boundedEvent;
        this.unbind(element, eventName, listener);
      }
    }
  }
}

export class Utils {
  // jQuery's extend
  private static getProto = Object.getPrototypeOf;
  private static class2type: any = {};
  private static toString = Utils.class2type.toString;
  private static hasOwn = Utils.class2type.hasOwnProperty;
  private static fnToString = Utils.hasOwn.toString;
  private static ObjectFunctionString = Utils.fnToString.call(Object);
  public static storage = {
    // https://stackoverflow.com/questions/29222027/vanilla-alternative-to-jquery-data-function-any-native-javascript-alternati
    _storage: new WeakMap(),
    // eslint-disable-next-line object-shorthand
    put: function (element: any, key: string, obj: any) {
      if (!this._storage.has(element)) {
        this._storage.set(element, new Map());
      }
      this._storage.get(element).set(key, obj);
    },
    // eslint-disable-next-line object-shorthand
    get: function (element: any, key: string) {
      const el = this._storage.get(element);
      if (el) {
        return el.get(key);
      }
      return null;
    },
    // eslint-disable-next-line object-shorthand
    remove: function (element: any, key: string) {
      const ret = this._storage.get(element).delete(key);
      if (!(this._storage.get(element).size === 0)) {
        this._storage.delete(element);
      }
      return ret;
    }
  };

  public static isFunction(obj: any) {
    return typeof obj === 'function' && typeof obj.nodeType !== 'number' && typeof obj.item !== 'function';
  }

  public static isPlainObject(obj: any) {
    if (!obj || Utils.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Utils.getProto(obj);
    if (!proto) {
      return true;
    }
    const Ctor = Utils.hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && Utils.fnToString.call(Ctor) === Utils.ObjectFunctionString;
  }

  public static calculateAvailableSpace(element: HTMLElement) {
    let bottom = 0, top = 0, left = 0, right = 0;

    const windowHeight = window.innerHeight || 0;
    const windowWidth = window.innerWidth || 0;
    const scrollPosition = Utils.windowScrollPosition();
    const pageScrollTop = scrollPosition.top;
    const pageScrollLeft = scrollPosition.left;
    const elmOffset = Utils.offset(element);

    if (elmOffset) {
      const elementOffsetTop = elmOffset.top || 0;
      const elementOffsetLeft = elmOffset.left || 0;
      top = elementOffsetTop - pageScrollTop;
      bottom = windowHeight - (elementOffsetTop - pageScrollTop);
      left = elementOffsetLeft - pageScrollLeft;
      right = windowWidth - (elementOffsetLeft - pageScrollLeft);
    }

    return { top, bottom, left, right };
  }

  public static extend<T = any>(...args: any[]): T {
    let options, name, src, copy, copyIsArray, clone,
      target = args[0],
      i = 1,
      deep = false;
    const length = args.length;

    if (typeof target === 'boolean') {
      deep = target;
      target = args[i] || {};
      i++;
    } else {
      target = target || {};
    }
    if (typeof target !== 'object' && !Utils.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if (Utils.isDefined(options = args[i])) {
        for (name in options) {
          copy = options[name];
          if (name === '__proto__' || target === copy) {
            continue;
          }
          if (deep && copy && (Utils.isPlainObject(copy) ||
            (copyIsArray = Array.isArray(copy)))) {
            src = target[name];
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !Utils.isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;
            target[name] = Utils.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target as T;
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
  public static createDomElement<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(
    tagName: T,
    elementOptions?: null | { [P in K]: InferDOMType<HTMLElementTagNameMap[T][P]> },
    appendToParent?: Element
  ): HTMLElementTagNameMap[T] {
    const elm = document.createElement<T>(tagName);

    if (elementOptions) {
      Object.keys(elementOptions).forEach((elmOptionKey) => {
        if (elmOptionKey === 'innerHTML') {
          console.warn(`[SlickGrid] For better CSP (Content Security Policy) support, do not use "innerHTML" directly in "createDomElement('${tagName}', { innerHTML: 'some html'})"` +
            `, it is better as separate assignment: "const elm = createDomElement('span'); elm.innerHTML = 'some html';"`);
        }

        const elmValue = elementOptions[elmOptionKey as keyof typeof elementOptions];
        if (typeof elmValue === 'object') {
          Object.assign(elm[elmOptionKey as K] as object, elmValue);
        } else {
          elm[elmOptionKey as K] = (elementOptions as any)[elmOptionKey as keyof typeof elementOptions];
        }
      });
    }
    if (appendToParent?.appendChild) {
      appendToParent.appendChild(elm);
    }
    return elm;
  }

  /**
   * From any input provided, return the HTML string (when a string is provided, it will be returned "as is" but when it's a number it will be converted to string)
   * When detecting HTMLElement/DocumentFragment, we can also specify which HTML type to retrieve innerHTML or outerHTML.
   * We can get the HTML by looping through all fragment `childNodes`
   * @param {DocumentFragment | HTMLElement | string | number} input
   * @param {'innerHTML' | 'outerHTML'} [type] - when the input is a DocumentFragment or HTMLElement, which type of HTML do you want to return? 'innerHTML' or 'outerHTML'
   * @returns {String}
   */
  public static getHtmlStringOutput(input: DocumentFragment | HTMLElement | string | number, type: 'innerHTML' | 'outerHTML' = 'innerHTML'): string {
    if (input instanceof DocumentFragment) {
      // a DocumentFragment doesn't have innerHTML/outerHTML, but we can loop through all children and concatenate them all to an HTML string
      return [].map.call(input.childNodes, (x: HTMLElement) => x[type]).join('') || input.textContent || '';
    } else if (input instanceof HTMLElement) {
      return input[type];
    }
    return String(input); // reaching this line means it's already a string (or number) so just return it as string
  }

  public static emptyElement<T extends Element = Element>(element?: T | null): T | undefined | null {
    while (element?.firstChild) {
      element.removeChild(element.firstChild);
    }
    return element;
  }

  /**
   * Accepts string containing the class or space-separated list of classes, and
   * returns list of individual classes.
   * Method properly takes into account extra whitespaces in the `className`
   * e.g.: " class1    class2   " => will result in `['class1', 'class2']`.
   * @param {String} className - space separated list of class names
   */
  public static classNameToList(className = ''): string[] {
    return className.split(' ').filter(cls => cls);
  }

  public static innerSize(elm: HTMLElement, type: 'height' | 'width') {
    let size = 0;

    if (elm) {
      const clientSize = type === 'height' ? 'clientHeight' : 'clientWidth';
      const sides = type === 'height' ? ['top', 'bottom'] : ['left', 'right'];
      size = elm[clientSize];
      for (const side of sides) {
        const sideSize = (parseFloat(Utils.getElementProp(elm, `padding-${side}`) || '') || 0);
        size -= sideSize;
      }
    }
    return size;
  }

  public static isDefined<T>(value: T | undefined | null): value is T {
    return <T>value !== undefined && <T>value !== null && <T>value !== '';
  }

  public static getElementProp(elm: HTMLElement & { getComputedStyle?: () => CSSStyleDeclaration }, property: string) {
    if (elm?.getComputedStyle) {
      return window.getComputedStyle(elm, null).getPropertyValue(property);
    }
    return null;
  }

  /**
   * Get the function details (param & body) of a function.
   * It supports regular function and also ES6 arrow functions
   * @param {Function} fn - function to analyze
   * @param {Boolean} [addReturn] - when using ES6 function as single liner, we could add the missing `return ...`
   * @returns
   */
  public static getFunctionDetails(fn: AnyFunction, addReturn = true) {
    let isAsyncFn = false;

    const getFunctionBody = (func: AnyFunction) => {
      const fnStr = func.toString();
      isAsyncFn = fnStr.includes('async ');

      // when fn is one liner arrow fn returning an object in brackets e.g. `() => ({ hello: 'world' })`
      if ((fnStr.replaceAll(' ', '').includes('=>({'))) {
        const matches = fnStr.match(/(({.*}))/g) || [];
        return matches.length >= 1 ? `return ${matches[0]!.trimStart()}` : fnStr;
      }
      const isOneLinerArrowFn = (!fnStr.includes('{') && fnStr.includes('=>'));
      const body = fnStr.substring(
        (fnStr.indexOf('{') + 1) || (fnStr.indexOf('=>') + 2),
        fnStr.includes('}') ? fnStr.lastIndexOf('}') : fnStr.length
      );
      if (addReturn && isOneLinerArrowFn && !body.startsWith('return')) {
        return 'return ' + body.trimStart(); // add the `return ...` to the body for ES6 arrow fn
      }
      return body;
    };

    const getFunctionParams = (func: AnyFunction): string[] => {
      const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,)]*))/mg;
      const ARG_NAMES = /([^\s,]+)/g;
      const fnStr = func.toString().replace(STRIP_COMMENTS, '');
      return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARG_NAMES) ?? [];
    };

    return {
      params: getFunctionParams(fn),
      body: getFunctionBody(fn),
      isAsync: isAsyncFn,
    };
  }

  public static insertAfterElement(referenceNode: HTMLElement, newNode: HTMLElement) {
    referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
  }

  public static isEmptyObject(obj: any) {
    if (obj === null || obj === undefined) {
      return true;
    }
    return Object.entries(obj).length === 0;
  }

  public static noop() { }

  public static offset(el: HTMLElement | null) {
    if (!el || !el.getBoundingClientRect) {
      return undefined;
    }
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;

    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }

  public static windowScrollPosition() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || 0,
    };
  }

  public static width(el: HTMLElement, value?: number | string): number | void {
    if (!el || !el.getBoundingClientRect) { return; }
    if (value === undefined) {
      return el.getBoundingClientRect().width;
    }
    Utils.setStyleSize(el, 'width', value);
  }

  public static height(el: HTMLElement, value?: number | string): number | void {
    if (!el) { return; }
    if (value === undefined) {
      return el.getBoundingClientRect().height;
    }
    Utils.setStyleSize(el, 'height', value);
  }

  public static setStyleSize<P extends CSSStyleDeclarationWritable>(
    el: HTMLElement,
    style: keyof P,
    val?: number | string | Function
  ): void {
    if (typeof val === 'function') {
      val = val() as number | string;
    }
    Utils.setStyles(el, { [style]: typeof val === 'string' ? val : `${val}px` } as P);
  }

  public static setStyles<T extends HTMLElement, P extends Partial<CSSStyleDeclarationWritable>>(element: T, styles: P): void {
    Object.keys(styles).forEach((key) => {
      const camelStyleKey = key as keyof P;
      const value = styles[camelStyleKey];

      // Ensure value is valid and assignable to the style property
      if (value !== undefined && value !== null) {
        (element.style as unknown as P)[camelStyleKey] = value;
      }
    });
  }

  public static contains(parent: HTMLElement, child: HTMLElement) {
    if (!parent || !child) {
      return false;
    }

    const parentList = Utils.parents(child);
    return !parentList.every((p) => {
      if (parent === p) {
        return false;
      }
      return true;
    });
  }

  public static isHidden(el: HTMLElement) {
    return el.offsetWidth === 0 && el.offsetHeight === 0;
  }

  public static parents(el: HTMLElement | ParentNode, selector?: string) {
    const parents: Array<HTMLElement | ParentNode> = [];
    const visible = selector === ':visible';
    const hidden = selector === ':hidden';

    while ((el = el.parentNode as ParentNode) && el !== document) {
      if (!el || !el.parentNode) {
        break;
      }
      if (hidden) {
        if (Utils.isHidden(el as HTMLElement)) {
          parents.push(el);
        }
      } else if (visible) {
        if (!Utils.isHidden(el as HTMLElement)) {
          parents.push(el);
        }
      } else if (!selector || (el as any).matches(selector)) {
        parents.push(el);
      }
    }
    return parents;
  }

  public static toFloat(value: string | number) {
    const x = parseFloat(value as string);
    if (isNaN(x)) {
      return 0;
    }
    return x;
  }

  public static show(el: HTMLElement | HTMLElement[], type = '') {
    if (Array.isArray(el)) {
      el.forEach((e) => e.style.display = type);
    } else {
      el.style.display = type;
    }
  }

  public static hide(el: HTMLElement | HTMLElement[]) {
    if (Array.isArray(el)) {
      el.forEach((e) => e.style.display = 'none');
    } else {
      el.style.display = 'none';
    }
  }

  public static slideUp(el: HTMLElement | HTMLElement[], callback: Function) {
    return Utils.slideAnimation(el, 'slideUp', callback);
  }

  public static slideDown(el: HTMLElement | HTMLElement[], callback: Function) {
    return Utils.slideAnimation(el, 'slideDown', callback);
  }

  public static slideAnimation(el: HTMLElement | HTMLElement[], slideDirection: 'slideDown' | 'slideUp', callback: Function) {
    if ((window as any).jQuery !== undefined) {
      (window as any).jQuery(el)[slideDirection]('fast', callback);
      return;
    }
    (slideDirection === 'slideUp') ? Utils.hide(el) : Utils.show(el);
    callback();
  }

  public static applyDefaults(targetObj: any, srcObj: any) {
    if (typeof srcObj === 'object') {
      Object.keys(srcObj).forEach(key => {
        if (srcObj.hasOwnProperty(key) && !targetObj.hasOwnProperty(key)) {
          targetObj[key] = srcObj[key];
        }
      });
    }
  }

  /**
   * User could optionally add PubSub Service to SlickEvent
   * When it is defined then a SlickEvent `notify()` call will also dispatch it by using the PubSub publish() method
   * @param {BasePubSub} [pubSubService]
   * @param {*} scope
   */
  public static addSlickEventPubSubWhenDefined<T = any>(pubSub?: BasePubSub, scope?: T) {
    if (pubSub) {
      for (const prop in scope) {
        if (scope[prop] instanceof SlickEvent && typeof (scope[prop] as SlickEvent).setPubSubService === 'function') {
          (scope[prop] as SlickEvent).setPubSubService(pubSub);
        }
      }
    }
  }
}

export class SelectionUtils {

  //   |---0----|---1----|---2----|---3----|---4----|---5----|
  // 0 |        |        |        |     ^  |        |        |
  //   |--------|--------|--------|--------|--------|--------|
  // 1 |        |        |        |        |        |        |
  //   |--------|--------|--------|--------|--------|--------|
  // 2 |        |        |   1    |   2    |    > h |        |
  //   |--------|--------|--------|--------|--------|--------|
  // 3 |   <    |        |   4    |   5   x|    > h |    >   |
  //   |--------|--------|--------|--------|--------|--------|
  // 4 |        |        |    > v |    > v |    > v |        |
  //   |--------|--------|--------|--------|--------|--------|
  // 5 |        |        |        |    v   |        |        |
  //   |--------|--------|--------|--------|--------|--------|
  //
  // original range (1,2,4,5) expanded one cell to right and down
  //  '> h' indicates horizontal target copy area
  //  '> v' indicates vertical target copy area
  // note bottom right (corner) cell is considered part of vertical copy area

  public static normaliseDragRange(rawRange: DragRange) {
    // depending how the range is created (drag up/down) the start row/cell may be
    // greater or less thatn the end row/cell. Create a guaranteed left/down
    // progressive range (ie. start row/cell < end row/cell)

    const rtn: DragRange = {
      start: {
        row: (rawRange.end.row ?? 0) > (rawRange.start.row ?? 0) ? rawRange.start.row : rawRange.end.row,
        cell: (rawRange.end.cell ?? 0) > (rawRange.start.cell ?? 0) ? rawRange.start.cell : rawRange.end.cell
      },
      end: {
        row: (rawRange.end.row ?? 0) > (rawRange.start.row ?? 0) ? rawRange.end.row : rawRange.start.row,
        cell: (rawRange.end.cell ?? 0) > (rawRange.start.cell ?? 0) ? rawRange.end.cell : rawRange.start.cell
      }
    };
    rtn.rowCount = (rtn.end.row ?? 0) - (rtn.start.row ?? 0) + 1;
    rtn.cellCount = (rtn.end.cell ?? 0) - (rtn.start.cell ?? 0) + 1;

    rtn.wasDraggedUp = (rawRange.end.row ?? 0) < (rawRange.start.row ?? 0);
    rtn.wasDraggedLeft = (rawRange.end.row ?? 0) < (rawRange.start.row ?? 0);

    return rtn;
  }

  public static copyRangeIsLarger(baseRange: SlickRange, copyToRange: SlickRange): boolean {
    return copyToRange.fromRow < baseRange.fromRow
      || copyToRange.fromCell < baseRange.fromCell
      || copyToRange.toRow > baseRange.toRow
      || copyToRange.toCell > baseRange.toCell
      ;
  }

  public static normalRangeOppositeCellFromCopy(normalisedDragRange: DragRange, targetCell: { row: number, cell: number }): { row: number, cell: number } {
    const row = targetCell.row < (normalisedDragRange.end.row || 0)
      ? (normalisedDragRange.end.row || 0)
      : (normalisedDragRange.start.row || 0)
      ;
    const cell = targetCell.cell < (normalisedDragRange.end.cell || 0)
      ? (normalisedDragRange.end.cell || 0)
      : (normalisedDragRange.start.cell || 0)
      ;
    return { row, cell };
  }

  // copy to range above or below - includes corner space target range
  public static verticalTargetRange(baseRange: SlickRange, copyToRange: SlickRange) {
    const copyUp = copyToRange.fromRow < baseRange.fromRow;
    const copyDown = copyToRange.toRow > baseRange.toRow;
    if (!copyUp && !copyDown) {
      return null;
    }
    let rtn;
    if (copyUp) {
      rtn = new Range(copyToRange.fromRow, copyToRange.fromCell, baseRange.fromRow - 1, baseRange.toCell);
    } else {
      rtn = new Range(baseRange.toRow + 1, copyToRange.fromCell, copyToRange.toRow, baseRange.toCell);
    }
    return rtn;
  }

  // copy to range left or right - excludes corner space target range
  public static horizontalTargetRange(baseRange: SlickRange, copyToRange: SlickRange) {
    const copyLeft = copyToRange.fromCell < baseRange.fromCell;
    const copyRight = copyToRange.toCell > baseRange.toCell;
    if (!copyLeft && !copyRight) {
      return null;
    }
    let rtn;
    if (copyLeft) {
      rtn = new Range(baseRange.fromRow, copyToRange.fromCell, baseRange.toRow, baseRange.fromCell - 1);
    } else {
      rtn = new Range(baseRange.fromRow, baseRange.toCell + 1, baseRange.toRow, copyToRange.toCell);
    }
    return rtn;
  }

  // copy to corner space target range
  public static cornerTargetRange(baseRange: SlickRange, copyToRange: SlickRange) {
    const copyUp = copyToRange.fromRow < baseRange.fromRow;
    const copyDown = copyToRange.toRow > baseRange.toRow;
    const copyLeft = copyToRange.fromCell < baseRange.fromCell;
    const copyRight = copyToRange.toCell > baseRange.toCell;
    if ((!copyLeft && !copyRight) || (!copyUp && !copyDown)) {
      return null;
    }
    let rtn;
    if (copyLeft) {
      if (copyUp) {
        rtn = new Range(copyToRange.fromRow, copyToRange.fromCell, baseRange.fromRow - 1, baseRange.fromCell - 1);
      } else {
        rtn = new Range(baseRange.toRow + 1, copyToRange.fromCell, copyToRange.toRow, baseRange.fromCell - 1);
      }
    } else {
      if (copyUp) {
        rtn = new Range(copyToRange.fromRow, baseRange.toCell + 1, baseRange.fromRow - 1, copyToRange.toCell);
      } else {
        rtn = new Range(baseRange.toRow + 1, baseRange.toCell + 1, copyToRange.toRow, copyToRange.toCell);
      }
    }
    return rtn;
  }

  public static copyCellsToTargetRange(baseRange: SlickRange, targetRange: SlickRange, grid: SlickGrid) {
    let fromRowOffset = 0, fromCellOffset = 0;
    const columns = grid.getVisibleColumns();
    const options = grid.getOptions();

    for (let i = 0; i < targetRange.rowCount(); i++) {
      const toRow = grid.getDataItem(targetRange.fromRow + i);
      const fromRow = grid.getDataItem(baseRange.fromRow + fromRowOffset);
      fromCellOffset = 0;

      for (let j = 0; j < targetRange.cellCount(); j++) {
        const toColDef = columns[targetRange.fromCell + j];
        const fromColDef = columns[baseRange.fromCell + fromCellOffset];

        if (!toColDef.hidden && !fromColDef.hidden) {
          let val = fromRow[fromColDef.field];
          if (options.dataItemColumnValueExtractor) {
            val = options.dataItemColumnValueExtractor(fromRow, fromColDef);
          }
          toRow[toColDef.field] = val;
        }

        fromCellOffset++;
        if (fromCellOffset >= baseRange.cellCount()) { fromCellOffset = 0; }
      }

      fromRowOffset++;
      if (fromRowOffset >= baseRange.rowCount()) { fromRowOffset = 0; }
    }
  }
}

export const SlickGlobalEditorLock = new SlickEditorLock();

/**
 * ViewportMgr — owns the construction of the grid's pane/viewport/canvas DOM.
 *
 * Phase 1 of the frozen rows/columns encapsulation refactor: this class builds the
 * exact same 6-pane / 4-viewport / 4-canvas structure the grid has always built
 * (characterized by cypress/e2e/dom-shape-characterization.cy.ts) and SlickGrid keeps
 * aliases to every element, so all existing logic is unchanged. Later phases move pane
 * selection, geometry distribution and scroll synchronization in here.
 */
export class ViewportMgr {
  /** the grid container, captured by buildPanes */
  protected container!: HTMLElement;

  /**
   * True when the grid opted into lazyPanes AND no rows/columns were frozen at build
   * time — only the top-left pane set exists until freezing is enabled.
   */
  protected lazy = false;

  /**
   * Array positions of dynamically materialized viewports/canvases (the viewport and
   * canvas arrays always extend in lockstep, so one slot serves both). Recorded at
   * materialization time instead of hardcoding, so band order never matters.
   */
  protected rfTopSlot = -1;
  protected rfBottomSlot = -1;
  protected bfSlotL = -1;
  protected bfSlotR = -1;
  protected bfSlotRF = -1;

  // panes
  paneHeaderL!: HTMLDivElement;
  paneHeaderR!: HTMLDivElement;
  paneTopL!: HTMLDivElement;
  paneTopR!: HTMLDivElement;
  paneBottomL!: HTMLDivElement;
  paneBottomR!: HTMLDivElement;

  // pre-header panels (only when createPreHeaderPanel)
  preHeaderPanelScroller!: HTMLDivElement;
  preHeaderPanel!: HTMLDivElement;
  preHeaderPanelSpacer!: HTMLDivElement;
  preHeaderPanelScrollerR!: HTMLDivElement;
  preHeaderPanelR!: HTMLDivElement;
  preHeaderPanelSpacerR!: HTMLDivElement;

  // header scrollers and header column containers
  headerScrollerL!: HTMLDivElement;
  headerScrollerR!: HTMLDivElement;
  headerScroller: HTMLDivElement[] = [];
  headerL!: HTMLDivElement;
  headerR!: HTMLDivElement;
  headers: HTMLDivElement[] = [];

  // header rows
  headerRowScrollerL!: HTMLDivElement;
  headerRowScrollerR!: HTMLDivElement;
  headerRowScroller: HTMLDivElement[] = [];
  headerRowSpacerL!: HTMLDivElement;
  headerRowSpacerR!: HTMLDivElement;
  headerRowL!: HTMLDivElement;
  headerRowR!: HTMLDivElement;
  headerRows: HTMLDivElement[] = [];

  // top panels
  topPanelScrollerL!: HTMLDivElement;
  topPanelScrollerR!: HTMLDivElement;
  topPanelScrollers: HTMLDivElement[] = [];
  topPanelL!: HTMLDivElement;
  topPanelR!: HTMLDivElement;
  topPanels: HTMLDivElement[] = [];

  // viewports and canvases
  viewportTopL!: HTMLDivElement;
  viewportTopR!: HTMLDivElement;
  viewportBottomL!: HTMLDivElement;
  viewportBottomR!: HTMLDivElement;
  viewport: HTMLDivElement[] = [];
  canvasTopL!: HTMLDivElement;
  canvasTopR!: HTMLDivElement;
  canvasBottomL!: HTMLDivElement;
  canvasBottomR!: HTMLDivElement;
  canvas: HTMLDivElement[] = [];

  // right-frozen band (Phase 4 — exists only while frozenRightColumn > 0 has been applied)
  paneHeaderRF!: HTMLDivElement;
  paneTopRF!: HTMLDivElement;
  paneBottomRF!: HTMLDivElement;
  headerScrollerRF!: HTMLDivElement;
  headerRF!: HTMLDivElement;
  headerRowScrollerRF!: HTMLDivElement;
  headerRowSpacerRF!: HTMLDivElement;
  headerRowRF!: HTMLDivElement;
  topPanelScrollerRF!: HTMLDivElement;
  topPanelRF!: HTMLDivElement;
  viewportTopRF!: HTMLDivElement;
  viewportBottomRF!: HTMLDivElement;
  canvasTopRF!: HTMLDivElement;
  canvasBottomRF!: HTMLDivElement;
  footerRowScrollerRF!: HTMLDivElement;
  footerRowSpacerRF!: HTMLDivElement;
  footerRowRF!: HTMLDivElement;

  // bottom-frozen row band (Phase 4 — exists only in simultaneous top+bottom mode)
  paneBottomFrozenL!: HTMLDivElement;
  paneBottomFrozenR!: HTMLDivElement;
  paneBottomFrozenRF!: HTMLDivElement;
  viewportBottomFrozenL!: HTMLDivElement;
  viewportBottomFrozenR!: HTMLDivElement;
  viewportBottomFrozenRF!: HTMLDivElement;
  canvasBottomFrozenL!: HTMLDivElement;
  canvasBottomFrozenR!: HTMLDivElement;
  canvasBottomFrozenRF!: HTMLDivElement;

  // footer rows (only when createFooterRow)
  footerRowScrollerL!: HTMLDivElement;
  footerRowScrollerR!: HTMLDivElement;
  footerRowScroller: HTMLDivElement[] = [];
  footerRowSpacerL!: HTMLDivElement;
  footerRowSpacerR!: HTMLDivElement;
  footerRowL!: HTMLDivElement;
  footerRowR!: HTMLDivElement;
  footerRow: HTMLDivElement[] = [];

  /**
   * Builds the pane/viewport/canvas DOM inside the given container.
   * The construction order and every class/style is identical to the historical
   * inline construction in SlickGrid.initialize().
   */
  buildPanes(container: HTMLElement, o: ViewportMgrBuildOptions) {
    this.container = container;
    this.lazy = !!o.lazyPanes && !(((o.frozenColumn ?? -1) > -1) || ((o.frozenRow ?? -1) > -1));

    // Containers used for scrolling frozen columns and rows.
    // Under lazyPanes with nothing frozen, only the top-left pane set is built;
    // the creation ORDER of the conditional elements must stay canonical so both
    // modes produce the same sibling sequence for whatever exists.
    this.paneHeaderL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-left', tabIndex: 0 }, container);
    if (!this.lazy) {
      this.paneHeaderR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-right', tabIndex: 0 }, container);
    }
    this.paneTopL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-left', tabIndex: 0 }, container);
    if (!this.lazy) {
      this.paneTopR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-right', tabIndex: 0 }, container);
      this.paneBottomL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-left', tabIndex: 0 }, container);
      this.paneBottomR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-right', tabIndex: 0 }, container);
    }

    if (o.createPreHeaderPanel) {
      this.preHeaderPanelScroller = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, this.paneHeaderL);
      this.preHeaderPanelScroller.appendChild(document.createElement('div'));
      this.preHeaderPanel = Utils.createDomElement('div', null, this.preHeaderPanelScroller);
      this.preHeaderPanelSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.preHeaderPanelScroller);

      if (!this.lazy) {
        this.preHeaderPanelScrollerR = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, this.paneHeaderR);
        this.preHeaderPanelR = Utils.createDomElement('div', null, this.preHeaderPanelScrollerR);
        this.preHeaderPanelSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.preHeaderPanelScrollerR);
      }

      if (!o.showPreHeaderPanel) {
        Utils.hide(this.preHeaderPanelScroller);
        this.hideIf(this.preHeaderPanelScrollerR);
      }
    }

    // Append the header scroller containers
    this.headerScrollerL = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-left' }, this.paneHeaderL);
    if (!this.lazy) {
      this.headerScrollerR = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-right' }, this.paneHeaderR);
    }

    // Cache the header scroller containers
    this.headerScroller.push(this.headerScrollerL);
    if (!this.lazy) {
      this.headerScroller.push(this.headerScrollerR);
    }

    // Append the columnn containers to the headers
    this.headerL = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-left', role: 'row', style: { left: '-1000px' } }, this.headerScrollerL);
    if (!this.lazy) {
      this.headerR = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-right', role: 'row', style: { left: '-1000px' } }, this.headerScrollerR);
    }

    // Cache the header columns
    this.headers = this.lazy ? [this.headerL] : [this.headerL, this.headerR];

    this.headerRowScrollerL = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this.paneTopL);
    if (!this.lazy) {
      this.headerRowScrollerR = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this.paneTopR);
    }

    this.headerRowScroller = this.lazy ? [this.headerRowScrollerL] : [this.headerRowScrollerL, this.headerRowScrollerR];

    this.headerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.headerRowScrollerL);
    if (!this.lazy) {
      this.headerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.headerRowScrollerR);
    }

    this.headerRowL = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-left' }, this.headerRowScrollerL);
    if (!this.lazy) {
      this.headerRowR = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-right' }, this.headerRowScrollerR);
    }

    this.headerRows = this.lazy ? [this.headerRowL] : [this.headerRowL, this.headerRowR];

    // Append the top panel scroller
    this.topPanelScrollerL = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this.paneTopL);
    if (!this.lazy) {
      this.topPanelScrollerR = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this.paneTopR);
    }

    this.topPanelScrollers = this.lazy ? [this.topPanelScrollerL] : [this.topPanelScrollerL, this.topPanelScrollerR];

    // Append the top panel
    this.topPanelL = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this.topPanelScrollerL);
    if (!this.lazy) {
      this.topPanelR = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this.topPanelScrollerR);
    }

    this.topPanels = this.lazy ? [this.topPanelL] : [this.topPanelL, this.topPanelR];

    if (!o.showColumnHeader) {
      this.headerScroller.forEach((el) => {
        Utils.hide(el);
      });
    }

    if (!o.showTopPanel) {
      this.topPanelScrollers.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    if (!o.showHeaderRow) {
      this.headerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }

    // Append the viewport containers
    this.viewportTopL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-left', tabIndex: 0 }, this.paneTopL);
    if (!this.lazy) {
      this.viewportTopR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-right', tabIndex: 0 }, this.paneTopR);
      this.viewportBottomL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-left', tabIndex: 0 }, this.paneBottomL);
      this.viewportBottomR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-right', tabIndex: 0 }, this.paneBottomR);
    }

    // Cache the viewports
    this.viewport = this.lazy
      ? [this.viewportTopL]
      : [this.viewportTopL, this.viewportTopR, this.viewportBottomL, this.viewportBottomR];
    if (o.viewportClass) {
      this.viewport.forEach((view) => {
        view.classList.add(...Utils.classNameToList((o.viewportClass)));
      });
    }

    // Append the canvas containers
    this.canvasTopL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-left', tabIndex: 0 }, this.viewportTopL);
    if (!this.lazy) {
      this.canvasTopR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-right', tabIndex: 0 }, this.viewportTopR);
      this.canvasBottomL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-left', tabIndex: 0 }, this.viewportBottomL);
      this.canvasBottomR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-right', tabIndex: 0 }, this.viewportBottomR);
    }

    // Cache the canvases
    this.canvas = this.lazy
      ? [this.canvasTopL]
      : [this.canvasTopL, this.canvasTopR, this.canvasBottomL, this.canvasBottomR];
  }

  /**
   * Builds the footer-row containers (only called when the createFooterRow option is on).
   * Identical construction to the historical inline code, including the R-before-L
   * scroller creation order and spacer widths.
   */
  buildFooterRows(o: ViewportMgrBuildOptions, canvasWithScrollbarWidth: number) {
    if (!this.lazy) {
      this.footerRowScrollerR = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this.paneTopR);
    }
    this.footerRowScrollerL = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this.paneTopL);

    this.footerRowScroller = this.lazy ? [this.footerRowScrollerL] : [this.footerRowScrollerL, this.footerRowScrollerR];

    this.footerRowSpacerL = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.footerRowScrollerL);
    Utils.width(this.footerRowSpacerL, canvasWithScrollbarWidth);
    if (!this.lazy) {
      this.footerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.footerRowScrollerR);
      Utils.width(this.footerRowSpacerR, canvasWithScrollbarWidth);
    }

    this.footerRowL = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-left' }, this.footerRowScrollerL);
    if (!this.lazy) {
      this.footerRowR = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-right' }, this.footerRowScrollerR);
    }

    this.footerRow = this.lazy ? [this.footerRowL] : [this.footerRowL, this.footerRowR];

    if (!o.showFooterRow) {
      this.footerRowScroller.forEach((scroller) => {
        Utils.hide(scroller);
      });
    }
  }

  /**
   * Builds the right/bottom panes, chrome, viewports and canvases that a lazyPanes
   * grid skipped at init, inserting each pane at its canonical sibling position and
   * pushing the new elements into the shared caches IN PLACE (the grid's array
   * aliases keep working). Idempotent: returns false when the grid is not lazy
   * (already fully built or built non-lazy).
   */
  materializeSecondaryPanes(o: ViewportMgrBuildOptions): boolean {
    if (!this.lazy) {
      return false;
    }
    this.lazy = false;

    const container = this.container;

    // panes, at their canonical sibling positions
    this.paneHeaderR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-right', tabIndex: 0 });
    container.insertBefore(this.paneHeaderR, this.paneTopL);
    this.paneTopR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-right', tabIndex: 0 });
    container.insertBefore(this.paneTopR, this.paneTopL.nextSibling);
    this.paneBottomL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-left', tabIndex: 0 });
    container.insertBefore(this.paneBottomL, this.paneTopR.nextSibling);
    this.paneBottomR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-right', tabIndex: 0 });
    container.insertBefore(this.paneBottomR, this.paneBottomL.nextSibling);

    if (o.createPreHeaderPanel) {
      this.preHeaderPanelScrollerR = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, this.paneHeaderR);
      this.preHeaderPanelR = Utils.createDomElement('div', null, this.preHeaderPanelScrollerR);
      this.preHeaderPanelSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.preHeaderPanelScrollerR);

      if (!o.showPreHeaderPanel) {
        Utils.hide(this.preHeaderPanelScrollerR);
      }
    }

    // header scroller + header columns
    this.headerScrollerR = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-right' }, this.paneHeaderR);
    this.headerScroller.push(this.headerScrollerR);
    this.headerR = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-right', role: 'row', style: { left: '-1000px' } }, this.headerScrollerR);
    this.headers.push(this.headerR);

    // header row
    this.headerRowScrollerR = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this.paneTopR);
    this.headerRowScroller.push(this.headerRowScrollerR);
    this.headerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.headerRowScrollerR);
    this.headerRowR = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-right' }, this.headerRowScrollerR);
    this.headerRows.push(this.headerRowR);

    // top panel
    this.topPanelScrollerR = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this.paneTopR);
    this.topPanelScrollers.push(this.topPanelScrollerR);
    this.topPanelR = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this.topPanelScrollerR);
    this.topPanels.push(this.topPanelR);

    if (!o.showColumnHeader) {
      Utils.hide(this.headerScrollerR);
    }
    if (!o.showTopPanel) {
      Utils.hide(this.topPanelScrollerR);
    }
    if (!o.showHeaderRow) {
      Utils.hide(this.headerRowScrollerR);
    }

    // viewports (pushed in canonical [TopL, TopR, BottomL, BottomR] order)
    this.viewportTopR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-right', tabIndex: 0 }, this.paneTopR);
    this.viewportBottomL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-left', tabIndex: 0 }, this.paneBottomL);
    this.viewportBottomR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-right', tabIndex: 0 }, this.paneBottomR);
    this.viewport.push(this.viewportTopR, this.viewportBottomL, this.viewportBottomR);
    if (o.viewportClass) {
      const viewportClassList = Utils.classNameToList(o.viewportClass);
      this.viewportTopR.classList.add(...viewportClassList);
      this.viewportBottomL.classList.add(...viewportClassList);
      this.viewportBottomR.classList.add(...viewportClassList);
    }

    // canvases
    this.canvasTopR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-right', tabIndex: 0 }, this.viewportTopR);
    this.canvasBottomL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-left', tabIndex: 0 }, this.viewportBottomL);
    this.canvasBottomR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-right', tabIndex: 0 }, this.viewportBottomR);
    this.canvas.push(this.canvasTopR, this.canvasBottomL, this.canvasBottomR);

    // footer row (right side; the left one was built at init when createFooterRow)
    if (o.createFooterRow) {
      this.footerRowScrollerR = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this.paneTopR);
      this.footerRowScroller.push(this.footerRowScrollerR);
      this.footerRowSpacerR = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.footerRowScrollerR);
      this.footerRowR = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-right' }, this.footerRowScrollerR);
      this.footerRow.push(this.footerRowR);

      if (!o.showFooterRow) {
        Utils.hide(this.footerRowScrollerR);
      }
    }

    return true;
  }

  /**
   * Builds the right-frozen column band (Phase 4): three panes with NEW
   * `*-right-frozen` css classes, appended AFTER the six classic panes so classic
   * sibling positions are untouched, plus header/header-row/top-panel chrome,
   * viewports and canvases. Shared element arrays are extended at the END so the
   * classic indexes 0–3 (and [L, R] pairs) stay valid for every existing consumer.
   * Idempotent: returns false when the band already exists.
   *
   * The historical "right" elements keep their class names and become the scrollable
   * MIDDLE band while this band is active.
   */
  materializeRightFrozenBand(o: ViewportMgrBuildOptions): boolean {
    if (this.paneHeaderRF) {
      return false;
    }

    const container = this.container;

    // panes — appended after the classic six (still before the trailing focus sink,
    // which the grid appends after all panes)
    this.paneHeaderRF = Utils.createDomElement('div', { className: 'slick-pane slick-pane-header slick-pane-right-frozen', tabIndex: 0 });
    this.paneTopRF = Utils.createDomElement('div', { className: 'slick-pane slick-pane-top slick-pane-right-frozen', tabIndex: 0 });
    this.paneBottomRF = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom slick-pane-right-frozen', tabIndex: 0 });
    // insert as a block after the last classic pane (paneBottomR when it exists,
    // else the lazy grid's paneTopL)
    const lastClassicPane = this.paneBottomR ?? this.paneTopL;
    container.insertBefore(this.paneHeaderRF, lastClassicPane.nextSibling);
    container.insertBefore(this.paneTopRF, this.paneHeaderRF.nextSibling);
    container.insertBefore(this.paneBottomRF, this.paneTopRF.nextSibling);

    // header chrome
    this.headerScrollerRF = Utils.createDomElement('div', { className: 'slick-header ui-state-default slick-state-default slick-header-right-frozen' }, this.paneHeaderRF);
    this.headerScroller.push(this.headerScrollerRF);
    this.headerRF = Utils.createDomElement('div', { className: 'slick-header-columns slick-header-columns-right-frozen', role: 'row', style: { left: '-1000px' } }, this.headerScrollerRF);
    this.headers.push(this.headerRF);

    // header row
    this.headerRowScrollerRF = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, this.paneTopRF);
    this.headerRowScroller.push(this.headerRowScrollerRF);
    this.headerRowSpacerRF = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.headerRowScrollerRF);
    this.headerRowRF = Utils.createDomElement('div', { className: 'slick-headerrow-columns slick-headerrow-columns-right-frozen' }, this.headerRowScrollerRF);
    this.headerRows.push(this.headerRowRF);

    // top panel
    this.topPanelScrollerRF = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, this.paneTopRF);
    this.topPanelScrollers.push(this.topPanelScrollerRF);
    this.topPanelRF = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, this.topPanelScrollerRF);
    this.topPanels.push(this.topPanelRF);

    if (!o.showColumnHeader) {
      Utils.hide(this.headerScrollerRF);
    }
    if (!o.showTopPanel) {
      Utils.hide(this.topPanelScrollerRF);
    }
    if (!o.showHeaderRow) {
      Utils.hide(this.headerRowScrollerRF);
    }

    // viewports and canvases (array order extended at the END: classic 0–3 preserved)
    this.viewportTopRF = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-top slick-viewport-right-frozen', tabIndex: 0 }, this.paneTopRF);
    this.viewportBottomRF = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom slick-viewport-right-frozen', tabIndex: 0 }, this.paneBottomRF);
    this.viewport.push(this.viewportTopRF, this.viewportBottomRF);
    if (o.viewportClass) {
      const viewportClassList = Utils.classNameToList(o.viewportClass);
      this.viewportTopRF.classList.add(...viewportClassList);
      this.viewportBottomRF.classList.add(...viewportClassList);
    }

    this.canvasTopRF = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-top grid-canvas-right-frozen', tabIndex: 0 }, this.viewportTopRF);
    this.canvasBottomRF = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom grid-canvas-right-frozen', tabIndex: 0 }, this.viewportBottomRF);
    this.canvas.push(this.canvasTopRF, this.canvasBottomRF);
    this.rfTopSlot = this.canvas.indexOf(this.canvasTopRF);
    this.rfBottomSlot = this.canvas.indexOf(this.canvasBottomRF);

    // footer row
    if (o.createFooterRow) {
      this.footerRowScrollerRF = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, this.paneTopRF);
      this.footerRowScroller.push(this.footerRowScrollerRF);
      this.footerRowSpacerRF = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, this.footerRowScrollerRF);
      this.footerRowRF = Utils.createDomElement('div', { className: 'slick-footerrow-columns slick-footerrow-columns-right-frozen' }, this.footerRowScrollerRF);
      this.footerRow.push(this.footerRowRF);

      if (!o.showFooterRow) {
        Utils.hide(this.footerRowScrollerRF);
      }
    }

    // if the bottom-frozen band already exists, add the shared corner pane
    this.ensureBottomFrozenRightVariant(o);

    return true;
  }

  /**
   * Builds the bottom-frozen row band (Phase 4, simultaneous top+bottom mode): one
   * pane+viewport+canvas per active column band, appended after all existing panes
   * with `*-bottom-frozen` css classes. Element arrays extend at the END and the
   * slots are recorded (bfSlotL/R/RF). Idempotent: returns false when the band
   * already exists. The right-frozen column variant is built only when that band's
   * DOM exists at call time; materializeRightFrozenBand adds it later otherwise.
   */
  materializeBottomFrozenBand(o: ViewportMgrBuildOptions): boolean {
    if (this.paneBottomFrozenL) {
      // band exists — but the RF column variant may have arrived after us
      this.ensureBottomFrozenRightVariant(o);
      return false;
    }

    const container = this.container;
    const lastPane = this.paneBottomRF ?? this.paneBottomR ?? this.paneTopL;

    this.paneBottomFrozenL = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom-frozen slick-pane-left', tabIndex: 0 });
    container.insertBefore(this.paneBottomFrozenL, lastPane.nextSibling);
    this.paneBottomFrozenR = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom-frozen slick-pane-right', tabIndex: 0 });
    container.insertBefore(this.paneBottomFrozenR, this.paneBottomFrozenL.nextSibling);

    this.viewportBottomFrozenL = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom-frozen slick-viewport-left', tabIndex: 0 }, this.paneBottomFrozenL);
    this.viewportBottomFrozenR = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom-frozen slick-viewport-right', tabIndex: 0 }, this.paneBottomFrozenR);
    this.canvasBottomFrozenL = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom-frozen grid-canvas-left', tabIndex: 0 }, this.viewportBottomFrozenL);
    this.canvasBottomFrozenR = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom-frozen grid-canvas-right', tabIndex: 0 }, this.viewportBottomFrozenR);

    if (o.viewportClass) {
      const viewportClassList = Utils.classNameToList(o.viewportClass);
      this.viewportBottomFrozenL.classList.add(...viewportClassList);
      this.viewportBottomFrozenR.classList.add(...viewportClassList);
    }

    this.viewport.push(this.viewportBottomFrozenL, this.viewportBottomFrozenR);
    this.canvas.push(this.canvasBottomFrozenL, this.canvasBottomFrozenR);
    this.bfSlotL = this.canvas.indexOf(this.canvasBottomFrozenL);
    this.bfSlotR = this.canvas.indexOf(this.canvasBottomFrozenR);

    this.ensureBottomFrozenRightVariant(o);
    return true;
  }

  /** Adds the bottom-frozen × right-frozen corner pane when both bands exist. */
  protected ensureBottomFrozenRightVariant(o: ViewportMgrBuildOptions) {
    if (!this.paneBottomFrozenL || !this.paneHeaderRF || this.paneBottomFrozenRF) {
      return;
    }
    this.paneBottomFrozenRF = Utils.createDomElement('div', { className: 'slick-pane slick-pane-bottom-frozen slick-pane-right-frozen', tabIndex: 0 });
    this.container.insertBefore(this.paneBottomFrozenRF, this.paneBottomFrozenR.nextSibling);
    this.viewportBottomFrozenRF = Utils.createDomElement('div', { className: 'slick-viewport slick-viewport-bottom-frozen slick-viewport-right-frozen', tabIndex: 0 }, this.paneBottomFrozenRF);
    this.canvasBottomFrozenRF = Utils.createDomElement('div', { className: 'grid-canvas grid-canvas-bottom-frozen grid-canvas-right-frozen', tabIndex: 0 }, this.viewportBottomFrozenRF);
    if (o.viewportClass) {
      this.viewportBottomFrozenRF.classList.add(...Utils.classNameToList(o.viewportClass));
    }
    this.viewport.push(this.viewportBottomFrozenRF);
    this.canvas.push(this.canvasBottomFrozenRF);
    this.bfSlotRF = this.canvas.indexOf(this.canvasBottomFrozenRF);
  }

  /** Whether the simultaneous top+bottom row mode is active AND its DOM exists. */
  hasBottomFrozenBand(): boolean {
    return this.bands.frozenTopRows > 0 && this.bands.frozenBottomRows > 0 && !!this.paneBottomFrozenL;
  }

  /**
   * Whether the row belongs to the bottom-frozen band. BOUNDED on both sides so the
   * add-new row (index === dataLength) can never be captured by the band. The same
   * test is used on both the render and lookup sides — the new band deliberately
   * avoids the historical one-row threshold asymmetry of the legacy single band.
   */
  isRowInBottomFrozenBand(row: number): boolean {
    if (!this.hasBottomFrozenBand()) {
      return false;
    }
    const split = this.freeze.bottomFrozenSplitRow ?? Number.MAX_SAFE_INTEGER;
    return row >= split && row < split + this.bands.frozenBottomRows;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Freeze state and pane selection (Phase 2 of the encapsulation refactor)
  //////////////////////////////////////////////////////////////////////////////////////////////

  protected freeze: ViewportFreezeState = { frozenColumnIdx: -1, hasFrozenRows: false, actualFrozenRow: -1, frozenBottom: false };
  protected bands: FreezeBandCounts = { frozenLeftCols: 0, frozenRightCols: 0, frozenTopRows: 0, frozenBottomRows: 0 };

  /** Receives the grid's freeze configuration; called by SlickGrid.setFrozenOptions(). */
  updateFreezeState(f: ViewportFreezeState) {
    this.freeze = { ...f };

    // derive the band-count view (Phase 4 groundwork); the legacy fields above stay
    // authoritative for the existing 2×2 code paths
    const rowCount = f.hasFrozenRows ? Math.max(0, f.frozenRowCount ?? 0) : 0;
    const bottomRowCount = Math.max(0, f.frozenBottomRowCount ?? 0);
    this.bands = {
      frozenLeftCols: f.frozenColumnIdx + 1,
      frozenRightCols: Math.max(0, f.frozenRightColCount ?? 0),
      // with an explicit bottom count, frozenRow always means TOP rows and the legacy
      // frozenBottom flag is ignored (it only positions the single-band case)
      frozenTopRows: bottomRowCount > 0 ? rowCount : (f.frozenBottom ? 0 : rowCount),
      frozenBottomRows: bottomRowCount > 0 ? bottomRowCount : (f.frozenBottom ? rowCount : 0),
    };
  }

  /** Band-count view of the freeze configuration (zero count = band does not exist). */
  bandCounts(): FreezeBandCounts {
    return this.bands;
  }

  /** Returns a boolean indicating whether the grid is configured with frozen columns. */
  hasFrozenColumns() {
    return this.bands.frozenLeftCols > 0;
  }

  /** Returns a boolean indicating whether the grid is configured with frozen rows. */
  hasFrozenRows() {
    return this.freeze.hasFrozenRows;
  }

  /**
   * The left canvas of the scrollable body band: bottom-left while rows are frozen at
   * the top, top-left otherwise (historical selector used by updateRowCount and
   * bindAncestorScrollEvents).
   */
  bodyCanvasL(): HTMLDivElement {
    return (this.freeze.hasFrozenRows && !this.freeze.frozenBottom) ? this.canvasBottomL : this.canvasTopL;
  }

  /**
   * Index of the pane owning cell (colIdx, rowIdx) in the element arrays:
   * classic slots [TopL, TopR, BottomL, BottomR], right-frozen slots [TopRF, BottomRF]
   * appended at 4/5 (materializeRightFrozenPanes canonicalizes the classic set first,
   * so these positions hold under lazyPanes too).
   */
  paneCellIndex(colIdx: number, rowIdx: number): number {
    if (this.isRowInBottomFrozenBand(rowIdx)) {
      if (this.isColumnInRightFrozenBand(colIdx)) {
        return this.bfSlotRF;
      }
      const isRightSideBF = this.hasFrozenColumns() && colIdx > this.freeze.frozenColumnIdx;
      return isRightSideBF ? this.bfSlotR : this.bfSlotL;
    }
    const isBottomSide = this.freeze.hasFrozenRows && rowIdx >= this.freeze.actualFrozenRow + (this.freeze.frozenBottom ? 0 : 1);
    if (this.isColumnInRightFrozenBand(colIdx)) {
      return isBottomSide ? this.rfBottomSlot : this.rfTopSlot;
    }
    const isRightSide = this.hasFrozenColumns() && colIdx > this.freeze.frozenColumnIdx;
    return (isBottomSide ? 2 : 0) + (isRightSide ? 1 : 0);
  }

  /**
   * Get frozen (pinned) row offset
   *
   * Returns the vertical pixel offset to apply for frozen rows.
   * Depending on whether frozen rows are pinned at the bottom or top and based on grid height,
   * it returns either a fixed frozen rows height or a calculated offset.
   *
   * @param {Number} row - grid row number
   */
  frozenRowOffset(row: number, g: { h: number; viewportTopH: number; frozenRowsHeight: number; rowHeight: number; }): number {
    // bottom-frozen band (simultaneous mode): rebase to band-local coordinates
    if (this.isRowInBottomFrozenBand(row)) {
      return this.freeze.bottomFrozenSplitRow! * g.rowHeight;
    }

    // let offset = ( hasFrozenRows ) ? ( this._options.frozenBottom ) ? ( row >= actualFrozenRow ) ? ( h < viewportTopH ) ? ( actualFrozenRow * this._options.rowHeight ) : h : 0 : ( row >= actualFrozenRow ) ? frozenRowsHeight : 0 : 0; // WTF?
    let offset = 0;
    if (this.freeze.hasFrozenRows) {
      if (this.freeze.frozenBottom) {
        if (row >= this.freeze.actualFrozenRow) {
          if (g.h < g.viewportTopH) {
            offset = (this.freeze.actualFrozenRow * g.rowHeight);
          } else {
            offset = g.h;
          }
        } else {
          offset = 0;
        }
      }
      else {
        if (row >= this.freeze.actualFrozenRow) {
          offset = g.frozenRowsHeight;
        } else {
          offset = 0;
        }
      }
    } else {
      offset = 0;
    }

    return offset;
  }

  /**
   * Whether the row lives in a frozen band and must therefore be kept out of row
   * virtualization cleanup (historical cleanupRows predicate).
   */
  isRowInFrozenBand(row: number): boolean {
    if (this.isRowInBottomFrozenBand(row)) {
      return true;
    }
    return this.freeze.hasFrozenRows
      && ((this.freeze.frozenBottom && row >= this.freeze.actualFrozenRow) // Frozen bottom rows
        || (!this.freeze.frozenBottom && row <= this.freeze.actualFrozenRow) // Frozen top rows
      );
  }

  /**
   * Whether cell-level cleanup must skip the row entirely (historical cleanUpCells
   * predicate). NOTE: transcribed verbatim — the second disjunct is NOT guarded by
   * !frozenBottom, so for frozenBottom grids every row is exempt; that quirk is
   * long-standing upstream behaviour and is deliberately preserved.
   */
  isRowCellCleanupExempt(row: number): boolean {
    if (this.isRowInBottomFrozenBand(row)) {
      return true;
    }
    return this.freeze.hasFrozenRows
      && ((this.freeze.frozenBottom && row > this.freeze.actualFrozenRow) // Frozen bottom rows
        || (row <= this.freeze.actualFrozenRow)                     // Frozen top rows
      );
  }

  /** Whether the column index falls inside the left frozen band. */
  isColumnInFrozenBand(colIdx: number): boolean {
    return colIdx <= this.freeze.frozenColumnIdx;
  }

  /** True when frozen columns are on AND the column index falls right of the freeze. */
  isColumnRightOfFreeze(colIdx: number): boolean {
    return this.hasFrozenColumns() && colIdx > this.freeze.frozenColumnIdx;
  }

  /** Column index local to its side container (right-side children are indexed after the freeze). */
  sideLocalColumnIdx(colIdx: number): number {
    return this.isColumnRightOfFreeze(colIdx) ? colIdx - this.freeze.frozenColumnIdx - 1 : colIdx;
  }

  /** Pick the left or right element of an [L, R] pair for the given column. */
  sideForColumn<T>(colIdx: number, left: T, right: T): T {
    return this.isColumnRightOfFreeze(colIdx) ? right : left;
  }

  /** Whether the right-frozen band is active AND its DOM has been materialized. */
  hasRightFrozenBand(): boolean {
    return this.bands.frozenRightCols > 0 && !!this.paneHeaderRF;
  }

  /** Whether the column index falls inside the right-frozen band. */
  isColumnInRightFrozenBand(colIdx: number): boolean {
    return this.bands.frozenRightCols > 0 && colIdx >= (this.freeze.frozenRightStartIdx ?? Number.MAX_SAFE_INTEGER);
  }

  /** Three-way band pick: left band, scrollable middle, or right-frozen element. */
  bandElementForColumn<T>(colIdx: number, left: T, right: T, rightFrozen: T): T {
    if (this.isColumnInRightFrozenBand(colIdx)) {
      return rightFrozen;
    }
    return this.sideForColumn(colIdx, left, right);
  }

  /** Column index local to its band container (right-frozen children index from the band start). */
  bandLocalColumnIdx(colIdx: number): number {
    if (this.isColumnInRightFrozenBand(colIdx)) {
      return colIdx - this.freeze.frozenRightStartIdx!;
    }
    return this.sideLocalColumnIdx(colIdx);
  }

  /**
   * Index of the column's node inside rowsCache[].rowNode: 0 for the left fragment
   * (which is the scrollable fragment when no columns are left-frozen), 1 for the
   * middle fragment under a left freeze, and last for the right-frozen fragment.
   */
  rowNodeIdxForColumn(colIdx: number): number {
    if (this.isColumnInRightFrozenBand(colIdx)) {
      return this.hasFrozenColumns() ? 2 : 1;
    }
    return this.isColumnRightOfFreeze(colIdx) ? 1 : 0;
  }

  /** Utils.show that tolerates panes not built under lazyPanes. */
  protected showIf(el?: HTMLElement) {
    if (el) { Utils.show(el); }
  }

  /** Utils.hide that tolerates panes not built under lazyPanes. */
  protected hideIf(el?: HTMLElement) {
    if (el) { Utils.hide(el); }
  }

  /** add/remove frozen class to left headers/footer when defined */
  applyPaneFrozenClasses(): void {
    const classAction = this.hasFrozenColumns() ? 'add' : 'remove';
    for (const elm of [this.paneHeaderL, this.paneTopL, this.paneBottomL]) {
      elm?.classList[classAction]('frozen');
    }
  }

  /** Shows/hides the right and bottom panes according to the freeze configuration. */
  applyPaneVisibility() {
    if (this.hasFrozenColumns()) {
      this.showIf(this.paneHeaderR);
      this.showIf(this.paneTopR);

      if (this.freeze.hasFrozenRows) {
        this.showIf(this.paneBottomL);
        this.showIf(this.paneBottomR);
      } else {
        this.hideIf(this.paneBottomR);
        this.hideIf(this.paneBottomL);
      }
    } else {
      this.hideIf(this.paneHeaderR);
      this.hideIf(this.paneTopR);
      this.hideIf(this.paneBottomR);

      if (this.freeze.hasFrozenRows) {
        this.showIf(this.paneBottomL);
      } else {
        this.hideIf(this.paneBottomR);
        this.hideIf(this.paneBottomL);
      }
    }

    // right-frozen band (exists only after materialization; kept hidden — like the
    // classic panes — when the right freeze is turned off again)
    if (this.bands.frozenRightCols > 0) {
      this.showIf(this.paneHeaderRF);
      this.showIf(this.paneTopRF);
      if (this.freeze.hasFrozenRows) {
        this.showIf(this.paneBottomRF);
      } else {
        this.hideIf(this.paneBottomRF);
      }
    } else {
      this.hideIf(this.paneHeaderRF);
      this.hideIf(this.paneTopRF);
      this.hideIf(this.paneBottomRF);
    }

    // bottom-frozen row band (simultaneous top+bottom mode only); column-band
    // visibility mirrors the classic bottom panes
    if (this.bands.frozenTopRows > 0 && this.bands.frozenBottomRows > 0) {
      this.showIf(this.paneBottomFrozenL);
      if (this.hasFrozenColumns()) {
        this.showIf(this.paneBottomFrozenR);
      } else {
        this.hideIf(this.paneBottomFrozenR);
      }
      if (this.bands.frozenRightCols > 0) {
        this.showIf(this.paneBottomFrozenRF);
      } else {
        this.hideIf(this.paneBottomFrozenRF);
      }
    } else {
      this.hideIf(this.paneBottomFrozenL);
      this.hideIf(this.paneBottomFrozenR);
      this.hideIf(this.paneBottomFrozenRF);
    }
  }

  /**
   * Sets the CSS overflowX and overflowY styles for all four viewport elements
   * (top–left, top–right, bottom–left, bottom–right) based on the freeze configuration
   * and options such as alwaysAllowHorizontalScroll and alwaysShowVerticalScroll.
   * If a viewportClass is specified in options, the class is added to each viewport.
   */
  applyOverflow(o: { alwaysAllowHorizontalScroll?: boolean; alwaysShowVerticalScroll?: boolean; viewportClass?: string; }) {
    const hasFrozenRows = this.freeze.hasFrozenRows;
    this.viewportTopL.style.overflowX = (this.hasFrozenColumns()) ? (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll') : (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'hidden' : 'auto');
    this.viewportTopL.style.overflowY = (!this.hasFrozenColumns() && o.alwaysShowVerticalScroll) ? 'scroll' : ((this.hasFrozenColumns()) ? (hasFrozenRows ? 'hidden' : 'hidden') : (hasFrozenRows ? 'scroll' : 'auto'));

    if (this.viewportTopR) {
      this.viewportTopR.style.overflowX = (this.hasFrozenColumns()) ? (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'hidden' : 'scroll') : (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'hidden' : 'auto');
      this.viewportTopR.style.overflowY = o.alwaysShowVerticalScroll ? 'scroll' : ((this.hasFrozenColumns()) ? (hasFrozenRows ? 'scroll' : 'auto') : (hasFrozenRows ? 'scroll' : 'auto'));
    }

    if (this.viewportBottomL) {
      this.viewportBottomL.style.overflowX = (this.hasFrozenColumns()) ? (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'scroll' : 'auto') : (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'auto' : 'auto');
      this.viewportBottomL.style.overflowY = (!this.hasFrozenColumns() && o.alwaysShowVerticalScroll) ? 'scroll' : ((this.hasFrozenColumns()) ? (hasFrozenRows ? 'hidden' : 'hidden') : (hasFrozenRows ? 'scroll' : 'auto'));
    }

    if (this.viewportBottomR) {
      this.viewportBottomR.style.overflowX = (this.hasFrozenColumns()) ? (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'scroll' : 'auto') : (hasFrozenRows && !o.alwaysAllowHorizontalScroll ? 'auto' : 'auto');
      this.viewportBottomR.style.overflowY = o.alwaysShowVerticalScroll ? 'scroll' : ((this.hasFrozenColumns()) ? (hasFrozenRows ? 'auto' : 'auto') : (hasFrozenRows ? 'auto' : 'auto'));
    }

    // bottom-frozen viewports never own a scrollbar: Y is fixed, X follows the
    // scroll owner programmatically
    if (this.viewportBottomFrozenL) {
      this.viewportBottomFrozenL.style.overflowX = 'hidden';
      this.viewportBottomFrozenL.style.overflowY = 'hidden';
    }
    if (this.viewportBottomFrozenR) {
      this.viewportBottomFrozenR.style.overflowX = 'hidden';
      this.viewportBottomFrozenR.style.overflowY = 'hidden';
    }
    if (this.viewportBottomFrozenRF) {
      this.viewportBottomFrozenRF.style.overflowX = 'hidden';
      this.viewportBottomFrozenRF.style.overflowY = 'hidden';
    }

    // right-frozen viewports never own a scrollbar: X is fixed, Y follows the
    // scroll owner programmatically (same rationale as the frozen-left viewport)
    if (this.viewportTopRF) {
      this.viewportTopRF.style.overflowX = 'hidden';
      this.viewportTopRF.style.overflowY = 'hidden';
    }
    if (this.viewportBottomRF) {
      this.viewportBottomRF.style.overflowX = 'hidden';
      this.viewportBottomRF.style.overflowY = 'hidden';
    }

    if (o.viewportClass) {
      const viewportClassList = Utils.classNameToList(o.viewportClass);
      // this.viewport only ever contains the elements that were actually built
      this.viewport.forEach((view) => {
        view.classList.add(...viewportClassList);
      });
    }
  }

  /**
   * Picks which viewport owns the X and Y scrollbars and which header/header-row/footer-row
   * scrollers follow horizontal scrolling, according to the freeze configuration.
   * The horizontal scrollbar must sit at the physical bottom of the grid, which is why
   * frozenBottom splits X and Y ownership.
   */
  /**
   * Distributes computed canvas/header widths onto the pane, viewport, canvas, header,
   * header-row and footer-row elements. Transcribed from the historical middle section
   * of SlickGrid.updateCanvasWidth(); the width computations stay in the grid.
   */
  applyCanvasWidths(g: CanvasWidthsGeometry) {
    // width reserved by the right-frozen band (0 while the band is off or not built);
    // the scrollable middle band shrinks by this amount
    const rfActive = this.bands.frozenRightCols > 0 && !!this.paneHeaderRF;
    const rfW = rfActive ? g.canvasWidthRF : 0;

    if (g.widthChanged || this.hasFrozenColumns() || this.freeze.hasFrozenRows || rfActive) {
      Utils.width(this.canvasTopL, g.canvasWidthL);

      Utils.width(this.headerL, g.headersWidthL);
      if (this.headerR) {
        Utils.width(this.headerR, g.headersWidthR);
      }

      if (this.hasFrozenColumns()) {
        Utils.width(this.canvasTopR, g.canvasWidthR);

        Utils.width(this.paneHeaderL, g.canvasWidthL);
        Utils.setStyleSize(this.paneHeaderR, 'left', g.canvasWidthL);
        Utils.setStyleSize(this.paneHeaderR, 'width', g.viewportW - g.canvasWidthL - rfW);

        Utils.width(this.paneTopL, g.canvasWidthL);
        Utils.setStyleSize(this.paneTopR, 'left', g.canvasWidthL);
        Utils.width(this.paneTopR, g.viewportW - g.canvasWidthL - rfW);

        Utils.width(this.headerRowScrollerL, g.canvasWidthL);
        Utils.width(this.headerRowScrollerR, g.viewportW - g.canvasWidthL - rfW);

        Utils.width(this.headerRowL, g.canvasWidthL);
        Utils.width(this.headerRowR, g.canvasWidthR);

        if (g.createFooterRow) {
          Utils.width(this.footerRowScrollerL, g.canvasWidthL);
          Utils.width(this.footerRowScrollerR, g.viewportW - g.canvasWidthL - rfW);

          Utils.width(this.footerRowL, g.canvasWidthL);
          Utils.width(this.footerRowR, g.canvasWidthR);
        }
        if (g.createPreHeaderPanel) {
          Utils.width(this.preHeaderPanel, g.preHeaderPanelWidth ?? g.canvasWidth);
        }
        Utils.width(this.viewportTopL, g.canvasWidthL);
        Utils.width(this.viewportTopR, g.viewportW - g.canvasWidthL - rfW);

        if (this.freeze.hasFrozenRows) {
          Utils.width(this.paneBottomL, g.canvasWidthL);
          Utils.setStyleSize(this.paneBottomR, 'left', g.canvasWidthL);

          Utils.width(this.viewportBottomL, g.canvasWidthL);
          Utils.width(this.viewportBottomR, g.viewportW - g.canvasWidthL - rfW);

          Utils.width(this.canvasBottomL, g.canvasWidthL);
          Utils.width(this.canvasBottomR, g.canvasWidthR);
        }
      } else if (rfActive) {
        // no left freeze, but a right-frozen band: the left pane IS the scrollable
        // middle band — pixel widths instead of the historical '100%'
        const middleW = g.viewportW - rfW;
        Utils.width(this.paneHeaderL, middleW);
        Utils.width(this.paneTopL, middleW);
        Utils.width(this.headerRowScrollerL, middleW);
        Utils.width(this.headerRowL, g.canvasWidth);

        if (g.createFooterRow) {
          Utils.width(this.footerRowScrollerL, middleW);
          Utils.width(this.footerRowL, g.canvasWidth);
        }

        if (g.createPreHeaderPanel) {
          Utils.width(this.preHeaderPanel, g.preHeaderPanelWidth ?? g.canvasWidth);
        }
        Utils.width(this.viewportTopL, middleW);

        if (this.freeze.hasFrozenRows) {
          Utils.width(this.viewportBottomL, middleW);
          Utils.width(this.canvasBottomL, g.canvasWidthL);
        }
      } else {
        Utils.width(this.paneHeaderL, '100%');
        Utils.width(this.paneTopL, '100%');
        Utils.width(this.headerRowScrollerL, '100%');
        Utils.width(this.headerRowL, g.canvasWidth);

        if (g.createFooterRow) {
          Utils.width(this.footerRowScrollerL, '100%');
          Utils.width(this.footerRowL, g.canvasWidth);
        }

        if (g.createPreHeaderPanel) {
          Utils.width(this.preHeaderPanel, g.preHeaderPanelWidth ?? g.canvasWidth);
        }
        Utils.width(this.viewportTopL, '100%');

        if (this.freeze.hasFrozenRows) {
          Utils.width(this.viewportBottomL, '100%');
          Utils.width(this.canvasBottomL, g.canvasWidthL);
        }
      }

      // bottom-frozen row band (simultaneous mode): column widths mirror the classic
      // bottom panes
      if (this.hasBottomFrozenBand()) {
        if (this.hasFrozenColumns()) {
          Utils.width(this.paneBottomFrozenL, g.canvasWidthL);
          Utils.width(this.canvasBottomFrozenL, g.canvasWidthL);
          Utils.setStyleSize(this.paneBottomFrozenR, 'left', g.canvasWidthL);
          Utils.width(this.paneBottomFrozenR, g.viewportW - g.canvasWidthL - rfW);
          Utils.width(this.viewportBottomFrozenR, g.viewportW - g.canvasWidthL - rfW);
          Utils.width(this.canvasBottomFrozenR, g.canvasWidthR);
          Utils.width(this.viewportBottomFrozenL, g.canvasWidthL);
        } else if (rfActive) {
          Utils.width(this.paneBottomFrozenL, g.viewportW - rfW);
          Utils.width(this.viewportBottomFrozenL, g.viewportW - rfW);
          Utils.width(this.canvasBottomFrozenL, g.canvasWidthL);
        } else {
          Utils.width(this.paneBottomFrozenL, '100%');
          Utils.width(this.viewportBottomFrozenL, '100%');
          Utils.width(this.canvasBottomFrozenL, g.canvasWidthL);
        }

        if (this.paneBottomFrozenRF && rfActive) {
          Utils.setStyleSize(this.paneBottomFrozenRF, 'left', g.viewportW - rfW);
          Utils.width(this.paneBottomFrozenRF, rfW);
          Utils.width(this.viewportBottomFrozenRF, rfW);
          Utils.width(this.canvasBottomFrozenRF, g.canvasWidthRF);
        }
      }

      // right-frozen band: fixed-width panes pinned to the right edge
      if (rfActive) {
        const rfLeft = g.viewportW - rfW;
        Utils.setStyleSize(this.paneHeaderRF, 'left', rfLeft);
        Utils.width(this.paneHeaderRF, rfW);
        Utils.width(this.headerRF, g.headersWidthRF);

        Utils.setStyleSize(this.paneTopRF, 'left', rfLeft);
        Utils.width(this.paneTopRF, rfW);
        Utils.width(this.headerRowScrollerRF, rfW);
        Utils.width(this.headerRowRF, g.canvasWidthRF);
        Utils.width(this.viewportTopRF, rfW);
        Utils.width(this.canvasTopRF, g.canvasWidthRF);

        if (g.createFooterRow) {
          Utils.width(this.footerRowScrollerRF, rfW);
          Utils.width(this.footerRowRF, g.canvasWidthRF);
        }

        if (this.freeze.hasFrozenRows) {
          Utils.setStyleSize(this.paneBottomRF, 'left', rfLeft);
          Utils.width(this.paneBottomRF, rfW);
          Utils.width(this.viewportBottomRF, rfW);
          Utils.width(this.canvasBottomRF, g.canvasWidthRF);
        }
      }
    }

    Utils.width(this.headerRowSpacerL, g.canvasWidth + (g.viewportHasVScroll ? g.scrollbarWidth : 0));
    if (this.headerRowSpacerR) {
      Utils.width(this.headerRowSpacerR, g.canvasWidth + (g.viewportHasVScroll ? g.scrollbarWidth : 0));
    }

    if (g.createFooterRow) {
      Utils.width(this.footerRowSpacerL, g.canvasWidth + (g.viewportHasVScroll ? g.scrollbarWidth : 0));
      if (this.footerRowSpacerR) {
        Utils.width(this.footerRowSpacerR, g.canvasWidth + (g.viewportHasVScroll ? g.scrollbarWidth : 0));
      }
    }
  }

  /**
   * Computes the pane/viewport heights from the freeze configuration and distributes them
   * onto the pane, viewport and canvas elements. Transcribed from the historical middle
   * section of SlickGrid.resizeCanvas(); returns the computed heights for the grid to keep.
   */
  applyPaneHeights(g: PaneHeightsGeometry): { paneTopH: number; paneBottomH: number; viewportTopH: number; viewportBottomH: number; } {
    let paneTopH = 0;
    let paneBottomH = 0;
    let viewportTopH = 0;
    const viewportBottomH = 0;

    // Account for Frozen Rows
    const simultaneousBands = this.bands.frozenTopRows > 0 && this.bands.frozenBottomRows > 0 && !!this.paneBottomFrozenL;
    if (this.freeze.hasFrozenRows) {
      if (this.freeze.frozenBottom) {
        paneTopH = g.viewportH - g.frozenRowsHeight - g.scrollbarHeight;
        paneBottomH = g.frozenRowsHeight + g.scrollbarHeight;
      } else {
        paneTopH = g.frozenRowsHeight;
        paneBottomH = g.viewportH - g.frozenRowsHeight;
        if (simultaneousBands) {
          // the scrollable body shrinks by the bottom-frozen band height
          paneBottomH -= g.frozenBottomRowsHeight ?? 0;
        }
      }
    } else {
      paneTopH = g.viewportH;
    }

    // The top pane includes the top panel and the header row
    paneTopH += g.topPanelH + g.headerRowH + g.footerRowH;

    if (this.hasFrozenColumns() && g.autoHeight) {
      paneTopH += g.scrollbarHeight;
    }

    // The top viewport does not contain the top panel or header row
    viewportTopH = paneTopH - g.topPanelH - g.headerRowH - g.footerRowH;

    if (g.autoHeight) {
      if (this.hasFrozenColumns()) {
        let fullHeight = paneTopH + this.headerScrollerL.offsetHeight;
        fullHeight += g.getContainerVBoxDelta();
        if (g.showPreHeaderPanel) {
          fullHeight += g.preHeaderPanelHeight!;
        }
        Utils.height(this.container, fullHeight);
      }

      this.paneTopL.style.position = 'relative';
    }

    let topHeightOffset = Utils.height(this.paneHeaderL);
    if (topHeightOffset) {
      topHeightOffset += (g.showTopHeaderPanel ? g.topHeaderPanelHeight! : 0);
    } else {
      topHeightOffset = (g.showHeaderRow ? g.headerRowHeight! : 0) + (g.showPreHeaderPanel ? g.preHeaderPanelHeight! : 0);
    }
    Utils.setStyleSize(this.paneTopL, 'top', topHeightOffset || topHeightOffset);
    Utils.height(this.paneTopL, paneTopH);

    const paneBottomTop = this.paneTopL.offsetTop + paneTopH;

    if (!g.autoHeight) {
      Utils.height(this.viewportTopL, viewportTopH);
    }

    if (this.hasFrozenColumns()) {
      let topHeightOffset = Utils.height(this.paneHeaderL);
      if (topHeightOffset) {
        topHeightOffset += (g.showTopHeaderPanel ? g.topHeaderPanelHeight! : 0);
      }
      Utils.setStyleSize(this.paneTopR, 'top', topHeightOffset as number);
      Utils.height(this.paneTopR, paneTopH);
      Utils.height(this.viewportTopR, viewportTopH);

      if (this.freeze.hasFrozenRows) {
        Utils.setStyleSize(this.paneBottomL, 'top', paneBottomTop);
        Utils.height(this.paneBottomL, paneBottomH);
        Utils.setStyleSize(this.paneBottomR, 'top', paneBottomTop);
        Utils.height(this.paneBottomR, paneBottomH);
        Utils.height(this.viewportBottomR, paneBottomH);
      }
    } else {
      if (this.freeze.hasFrozenRows) {
        Utils.width(this.paneBottomL, '100%');
        Utils.height(this.paneBottomL, paneBottomH);
        Utils.setStyleSize(this.paneBottomL, 'top', paneBottomTop);
      }
    }

    if (this.freeze.hasFrozenRows) {
      Utils.height(this.viewportBottomL, paneBottomH);

      if (this.freeze.frozenBottom) {
        Utils.height(this.canvasBottomL, g.frozenRowsHeight);

        if (this.hasFrozenColumns()) {
          Utils.height(this.canvasBottomR, g.frozenRowsHeight);
        }
      } else {
        Utils.height(this.canvasTopL, g.frozenRowsHeight);

        if (this.hasFrozenColumns()) {
          Utils.height(this.canvasTopR, g.frozenRowsHeight);
        }
      }
    } else {
      if (this.viewportTopR) {
        Utils.height(this.viewportTopR, viewportTopH);
      }
    }

    // bottom-frozen row band (simultaneous mode): pinned below the shrunk body pane
    if (simultaneousBands) {
      const bfH = g.frozenBottomRowsHeight ?? 0;
      const bfTop = this.paneTopL.offsetTop + paneTopH + paneBottomH;

      Utils.setStyleSize(this.paneBottomFrozenL, 'top', bfTop);
      Utils.height(this.paneBottomFrozenL, bfH);
      Utils.height(this.viewportBottomFrozenL, bfH);
      Utils.height(this.canvasBottomFrozenL, bfH);

      if (this.hasFrozenColumns()) {
        Utils.setStyleSize(this.paneBottomFrozenR, 'top', bfTop);
        Utils.height(this.paneBottomFrozenR, bfH);
        Utils.height(this.viewportBottomFrozenR, bfH);
        Utils.height(this.canvasBottomFrozenR, bfH);
      }

      if (this.paneBottomFrozenRF) {
        Utils.setStyleSize(this.paneBottomFrozenRF, 'top', bfTop);
        Utils.height(this.paneBottomFrozenRF, bfH);
        Utils.height(this.viewportBottomFrozenRF, bfH);
        Utils.height(this.canvasBottomFrozenRF, bfH);
      }
    }

    // right-frozen band: mirror the classic right-pane vertical geometry
    if (this.bands.frozenRightCols > 0 && this.paneHeaderRF) {
      let topHeightOffsetRF = Utils.height(this.paneHeaderL);
      if (topHeightOffsetRF) {
        topHeightOffsetRF += (g.showTopHeaderPanel ? g.topHeaderPanelHeight! : 0);
      }
      Utils.setStyleSize(this.paneTopRF, 'top', topHeightOffsetRF as number);
      Utils.height(this.paneTopRF, paneTopH);
      Utils.height(this.viewportTopRF, viewportTopH);

      if (this.freeze.hasFrozenRows) {
        const paneBottomTopRF = this.paneTopL.offsetTop + paneTopH;
        Utils.setStyleSize(this.paneBottomRF, 'top', paneBottomTopRF);
        Utils.height(this.paneBottomRF, paneBottomH);
        Utils.height(this.viewportBottomRF, paneBottomH);

        if (this.freeze.frozenBottom) {
          Utils.height(this.canvasBottomRF, g.frozenRowsHeight);
        } else {
          Utils.height(this.canvasTopRF, g.frozenRowsHeight);
        }
      }
    }

    return { paneTopH, paneBottomH, viewportTopH, viewportBottomH };
  }

  /** the current scroll-owner/follower set, refreshed by selectScrollContainers() */
  protected scrollContainers!: { x: HTMLDivElement; y: HTMLDivElement; header: HTMLDivElement; headerRow: HTMLDivElement; footerRow: HTMLDivElement; };

  /**
   * Attaches one rendered row (left fragment + right fragment when columns are frozen)
   * to the canvases owned by the row's band, returning the rowNode array for the grid's
   * rowsCache (or null if the expected fragments are missing).
   *
   * NOTE: the band threshold here is `rowIdx >= actualFrozenRow` — deliberately WITHOUT
   * the `+ (frozenBottom ? 0 : 1)` adjustment used by paneCellIndex(); the historical
   * render-side and cell-lookup-side splits differ by one row in the non-frozenBottom
   * case, and that asymmetry is preserved verbatim.
   */
  attachRow(rowIdx: number, left: HTMLElement | null, right: HTMLElement | null, rightFrozen?: HTMLElement | null): HTMLElement[] | null {
    let attached: HTMLElement[] | null = null;
    const isBFBand = this.isRowInBottomFrozenBand(rowIdx);
    const isBottomBand = !isBFBand && (this.freeze.hasFrozenRows) && (rowIdx >= this.freeze.actualFrozenRow);

    if (isBFBand) {
      if (this.hasFrozenColumns()) {
        if (left && right) {
          this.canvasBottomFrozenL.appendChild(left);
          this.canvasBottomFrozenR.appendChild(right);
          attached = [left, right];
        }
      } else if (left) {
        this.canvasBottomFrozenL.appendChild(left);
        attached = [left];
      }
    } else if (isBottomBand) {
      if (this.hasFrozenColumns()) {
        if (left && right) {
          this.canvasBottomL.appendChild(left);
          this.canvasBottomR.appendChild(right);
          attached = [left, right];
        }
      } else if (left) {
        this.canvasBottomL.appendChild(left);
        attached = [left];
      }
    } else if (this.hasFrozenColumns()) {
      if (left && right) {
        this.canvasTopL.appendChild(left);
        this.canvasTopR.appendChild(right);
        attached = [left, right];
      }
    } else if (left) {
      this.canvasTopL.appendChild(left);
      attached = [left];
    }

    // right-frozen fragment always sits LAST in the rowNode array
    const rfTargetCanvas = isBFBand ? this.canvasBottomFrozenRF : (isBottomBand ? this.canvasBottomRF : this.canvasTopRF);
    if (attached && this.bands.frozenRightCols > 0 && rfTargetCanvas && rightFrozen) {
      rfTargetCanvas.appendChild(rightFrozen);
      attached.push(rightFrozen);
    }

    return attached;
  }

  /** Applies an X scroll position to the scroll-owner viewport and every horizontal follower. */
  syncHorizontalScroll(x: number, o: { createFooterRow?: boolean; createPreHeaderPanel?: boolean; }) {
    this.scrollContainers.x.scrollLeft = x;
    this.scrollContainers.header.scrollLeft = x;
    this.topPanelScrollers[0].scrollLeft = x;
    if (o.createFooterRow) {
      this.scrollContainers.footerRow.scrollLeft = x;
    }
    if (o.createPreHeaderPanel) {
      if (this.hasFrozenColumns()) {
        this.preHeaderPanelScrollerR.scrollLeft = x;
      } else {
        this.preHeaderPanelScroller.scrollLeft = x;
      }
    }

    if (this.hasFrozenColumns()) {
      if (this.freeze.hasFrozenRows) {
        this.viewportTopR.scrollLeft = x;
      }
      this.headerRowScrollerR.scrollLeft = x; // right header row scrolling with frozen grid
    } else {
      if (this.freeze.hasFrozenRows) {
        this.viewportTopL.scrollLeft = x;
      }
      this.headerRowScrollerL.scrollLeft = x; // left header row scrolling with regular grid
    }

    // the bottom-frozen band's scrollable-column viewport follows X like the
    // frozen-top viewports do
    if (this.hasBottomFrozenBand()) {
      (this.hasFrozenColumns() ? this.viewportBottomFrozenR : this.viewportBottomFrozenL).scrollLeft = x;
    }
  }

  /** Mirrors the Y scroll position onto the frozen-band viewports that follow the scroll owner. */
  syncVerticalFollowers(scrollTop: number) {
    if (this.hasFrozenColumns()) {
      if (this.freeze.hasFrozenRows && !this.freeze.frozenBottom) {
        this.viewportBottomL.scrollTop = scrollTop;
      } else {
        this.viewportTopL.scrollTop = scrollTop;
      }
    }

    // the right-frozen band's scrollable-body viewport follows Y the same way
    if (this.bands.frozenRightCols > 0 && this.viewportTopRF) {
      if (this.freeze.hasFrozenRows && !this.freeze.frozenBottom) {
        this.viewportBottomRF.scrollTop = scrollTop;
      } else {
        this.viewportTopRF.scrollTop = scrollTop;
      }
    }
  }

  selectScrollContainers(): { x: HTMLDivElement; y: HTMLDivElement; header: HTMLDivElement; headerRow: HTMLDivElement; footerRow: HTMLDivElement; } {
    let x: HTMLDivElement;
    let y: HTMLDivElement;
    let header: HTMLDivElement;
    let headerRow: HTMLDivElement;
    let footerRow: HTMLDivElement;

    if (this.hasFrozenColumns()) {
      header = this.headerScrollerR;
      headerRow = this.headerRowScrollerR;
      footerRow = this.footerRowScrollerR;

      if (this.freeze.hasFrozenRows) {
        if (this.freeze.frozenBottom) {
          x = this.viewportBottomR;
          y = this.viewportTopR;
        } else {
          x = y = this.viewportBottomR;
        }
      } else {
        x = y = this.viewportTopR;
      }
    } else {
      header = this.headerScrollerL;
      headerRow = this.headerRowScrollerL;
      footerRow = this.footerRowScrollerL;

      if (this.freeze.hasFrozenRows) {
        if (this.freeze.frozenBottom) {
          x = this.viewportBottomL;
          y = this.viewportTopL;
        } else {
          x = y = this.viewportBottomL;
        }
      } else {
        x = y = this.viewportTopL;
      }
    }

    this.scrollContainers = { x, y, header, headerRow, footerRow };
    return this.scrollContainers;
  }
}

// export Slick namespace on both global & window objects
const SlickCore = {
  Event: SlickEvent,
  EventData: SlickEventData,
  EventHandler: SlickEventHandler,
  Range: SlickRange,
  CopyRange: SlickCopyRange,
  DragExtendHandle: SlickDragExtendHandle,
  ViewportMgr,
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
  preClickClassName: 'slick-edit-preclick',

  GridAutosizeColsMode: {
    None: 'NOA',
    LegacyOff: 'LOF',
    LegacyForceFit: 'LFF',
    IgnoreViewport: 'IGV',
    FitColsToViewport: 'FCV',
    FitViewportToCols: 'FVC'
  },

  'ColAutosizeMode': {
    Locked: 'LCK',
    Guide: 'GUI',
    Content: 'CON',
    ContentExpandOnly: 'CXO',
    ContentIntelligent: 'CTI'
  },

  'RowSelectionMode': {
    FirstRow: 'FS1',
    FirstNRows: 'FSN',
    AllRows: 'ALL',
    LastRow: 'LS1'
  },

  'CellSelectionMode': {
    Select: "SEL",
    Replace: "REP"
  },

  'ValueFilterMode': {
    None: 'NONE',
    DeDuplicate: 'DEDP',
    GetGreatestAndSub: 'GR8T',
    GetLongestTextAndSub: 'LNSB',
    GetLongestText: 'LNSC'
  },

  WidthEvalMode: {
    Auto: 'AUTO',
    TextOnly: 'CANV',
    HTML: 'HTML'
  }
};

export const {
  EditorLock, Event, EventData, EventHandler, Group, GroupTotals, NonDataRow, Range, CopyRange, DragExtendHandle,
  RegexSanitizer, GlobalEditorLock, keyCode, preClickClassName, GridAutosizeColsMode, ColAutosizeMode,
  RowSelectionMode, CellSelectionMode, ValueFilterMode, WidthEvalMode
} = SlickCore;

// also add to global object when exist
if (IIFE_ONLY && typeof global !== 'undefined' && window.Slick) {
  global.Slick = window.Slick;
}
