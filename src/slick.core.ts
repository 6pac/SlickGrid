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
  PaneElementSets,
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
/** Structural column key of a pane set (historical sides, NOT semantic bands — see BAND-LABELLING.md). */
export type PaneColKey = 'l' | 'r' | 'rf';
/** Structural row key of a pane set. */
export type PaneRowKey = 'header' | 'top' | 'bottom' | 'bf';

/** The elements of one pane cell in the (row × column) pane matrix. */
export interface PaneSet {
  pane: HTMLDivElement;
  viewport?: HTMLDivElement;
  canvas?: HTMLDivElement;
  headerScroller?: HTMLDivElement;
  header?: HTMLDivElement;
  headerRowScroller?: HTMLDivElement;
  headerRowSpacer?: HTMLDivElement;
  headerRow?: HTMLDivElement;
  topPanelScroller?: HTMLDivElement;
  topPanel?: HTMLDivElement;
  footerRowScroller?: HTMLDivElement;
  footerRowSpacer?: HTMLDivElement;
  footerRow?: HTMLDivElement;
  preHeaderScroller?: HTMLDivElement;
  preHeader?: HTMLDivElement;
  preHeaderSpacer?: HTMLDivElement;
}

/** css suffix of each structural column (the fixed legacy skin). */
const PANE_COL_CSS: Record<PaneColKey, string> = { l: 'left', r: 'right', rf: 'right-frozen' };
/** css suffix of each structural row. */
const PANE_ROW_CSS: Record<PaneRowKey, string> = { header: 'header', top: 'top', bottom: 'bottom', bf: 'bottom-frozen' };

/**
 * One element-role across the column bands (l | r | rf) — the ViewportMgr facade's
 * jQuery-like element collections (FACADE-FEASIBILITY.md, stage M19). Iteration
 * touches only MATERIALIZED bands, so per-band existence gating disappears from
 * call sites. When a set is identity-critical (headers and the header/footer/panel
 * chrome the grid exposes), `elements` IS the live shared array the grid contract
 * depends on; derived sets (spacers, pre-headers, pick() views) rebuild a fresh
 * snapshot per access — cold paths only.
 *
 * (An ElementGroup-extends-Array design — the shared arrays themselves becoming
 * the collections — was considered and rejected: the wrapper reads the same
 * without Symbol.species/toolchain edge risk.)
 */
export class BandSet {
  constructor(
    protected readonly mgr: ViewportMgr,
    protected readonly row: PaneRowKey,
    protected readonly part: keyof PaneSet,
    protected readonly live?: HTMLDivElement[],
    protected readonly cols: PaneColKey[] = ['l', 'r', 'rf'],
  ) {}

  /** the live shared array for identity-critical sets; a fresh snapshot otherwise */
  get elements(): HTMLDivElement[] {
    if (this.live) { return this.live; }
    const out: HTMLDivElement[] = [];
    this.forEach((el) => { out.push(el); });
    return out;
  }

  get length(): number { return this.elements.length; }

  /** the canonical measurement element (the first materialized band — historically L) */
  first(): HTMLDivElement { return this.elements[0]; }

  at(col: PaneColKey): HTMLDivElement | undefined {
    return this.mgr.paneAt(this.row, col)?.[this.part] as HTMLDivElement | undefined;
  }

  /** a filtered view — keeps historical band asymmetries explicit and grep-able */
  pick(...cols: PaneColKey[]): BandSet {
    return new BandSet(this.mgr, this.row, this.part, undefined, cols);
  }

  forEach(fn: (el: HTMLDivElement, col: PaneColKey, i: number) => void): void {
    let i = 0;
    for (const col of this.cols) {
      const el = this.at(col);
      if (el) { fn(el, col, i++); }
    }
  }

  empty(): void {
    this.forEach((el) => Utils.emptyElement(el));
  }

  /** one width for every materialized band, or a per-band map (absent keys skip) */
  width(w: number | Partial<Record<PaneColKey, number>>): void {
    this.forEach((el, col) => {
      const value = typeof w === 'number' ? w : w[col];
      if (value !== undefined) {
        Utils.width(el, value);
      }
    });
  }

  setStyle(styles: Partial<CSSStyleDeclaration>): void {
    this.forEach((el) => { Object.assign(el.style, styles); });
  }

  query(selector: string): HTMLElement[] {
    const out: HTMLElement[] = [];
    this.forEach((el) => { out.push(...Array.from(el.querySelectorAll<HTMLElement>(selector))); });
    return out;
  }

  // --- band-spanning column-cell conventions (M19b): the CONTINUOUS visible-column
  // --- index threaded across the containers in band order l, r, rf ---

  /** all column cells across the bands, in visible-column order */
  cells(): HTMLElement[] {
    const out: HTMLElement[] = [];
    this.forEach((el) => { out.push(...(Array.from(el.children) as HTMLElement[])); });
    return out;
  }

  /** the cell at a continuous visible-column index (historical cross-band walk) */
  cellAt(visibleIdx: number): HTMLElement | undefined {
    let remaining = visibleIdx;
    let found: HTMLElement | undefined;
    this.forEach((el) => {
      if (found === undefined) {
        if (remaining < el.children.length) {
          found = el.children[remaining] as HTMLElement;
        } else {
          remaining -= el.children.length;
        }
      }
    });
    return found;
  }

  forEachCell(fn: (cell: HTMLElement, visibleIdx: number) => void): void {
    let i = 0;
    this.forEach((el) => {
      for (let c = 0; c < el.children.length; c++, i++) {
        fn(el.children[c] as HTMLElement, i);
      }
    });
  }

  /** the band container owning a data-column index — the historical three-way
   * bandElementForColumn pick with the elements supplied internally */
  containerForColumn(colIdx: number): HTMLDivElement {
    return this.mgr.bandElementForColumn(colIdx, this.at('l') as HTMLDivElement, this.at('r') as HTMLDivElement, this.at('rf') as HTMLDivElement);
  }

  /** container pick + band-local child index in one call (the getHeaderColumn /
   * getHeaderRowColumn / getFooterRowColumn collapse). Deliberately NOT
   * optional-chained: the historical code throws when the container is missing. */
  columnCell(colIdx: number): HTMLDivElement {
    return this.containerForColumn(colIdx).children[this.mgr.bandLocalColumnIdx(colIdx)] as HTMLDivElement;
  }
}

/** 2D analogue of BandSet for the pane/viewport/canvas cells of the pane matrix. */
export class CellSet {
  constructor(
    protected readonly mgr: ViewportMgr,
    protected readonly part: 'pane' | 'viewport' | 'canvas',
    protected readonly live?: HTMLDivElement[],
  ) {}

  /** the live shared array (canonical order) for viewports/canvases; derived for panes */
  get elements(): HTMLDivElement[] {
    if (this.live) { return this.live; }
    const out: HTMLDivElement[] = [];
    for (const row of ['header', 'top', 'bottom', 'bf'] as PaneRowKey[]) {
      for (const col of ['l', 'r', 'rf'] as PaneColKey[]) {
        const el = this.at(row, col);
        if (el) { out.push(el); }
      }
    }
    return out;
  }

  at(row: PaneRowKey, col: PaneColKey): HTMLDivElement | undefined {
    return this.mgr.paneAt(row, col)?.[this.part] as HTMLDivElement | undefined;
  }

  /** the top-left cell — the measurement/default-active canonical (historical `[0]`) */
  first(): HTMLDivElement { return this.elements[0]; }

  forEach(fn: (el: HTMLDivElement, i: number) => void): void {
    this.elements.forEach((el, i) => fn(el, i));
  }

  setStyle(styles: Partial<CSSStyleDeclaration>): void {
    this.forEach((el) => { Object.assign(el.style, styles); });
  }
}

export class ViewportMgr {
  // named-element compat getters over the pane matrix (M18b): same runtime
  // semantics as the historical definite-assignment fields (undefined until built)
  get paneHeaderL(): HTMLDivElement { return this.paneAt('header', 'l')?.pane as HTMLDivElement; }
  get paneHeaderR(): HTMLDivElement { return this.paneAt('header', 'r')?.pane as HTMLDivElement; }
  get paneHeaderRF(): HTMLDivElement { return this.paneAt('header', 'rf')?.pane as HTMLDivElement; }
  get paneTopL(): HTMLDivElement { return this.paneAt('top', 'l')?.pane as HTMLDivElement; }
  get paneTopR(): HTMLDivElement { return this.paneAt('top', 'r')?.pane as HTMLDivElement; }
  get paneTopRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.pane as HTMLDivElement; }
  get paneBottomL(): HTMLDivElement { return this.paneAt('bottom', 'l')?.pane as HTMLDivElement; }
  get paneBottomR(): HTMLDivElement { return this.paneAt('bottom', 'r')?.pane as HTMLDivElement; }
  get paneBottomRF(): HTMLDivElement { return this.paneAt('bottom', 'rf')?.pane as HTMLDivElement; }
  get paneBottomFrozenL(): HTMLDivElement { return this.paneAt('bf', 'l')?.pane as HTMLDivElement; }
  get paneBottomFrozenR(): HTMLDivElement { return this.paneAt('bf', 'r')?.pane as HTMLDivElement; }
  get paneBottomFrozenRF(): HTMLDivElement { return this.paneAt('bf', 'rf')?.pane as HTMLDivElement; }
  get preHeaderPanelScroller(): HTMLDivElement { return this.paneAt('header', 'l')?.preHeaderScroller as HTMLDivElement; }
  get preHeaderPanel(): HTMLDivElement { return this.paneAt('header', 'l')?.preHeader as HTMLDivElement; }
  get preHeaderPanelSpacer(): HTMLDivElement { return this.paneAt('header', 'l')?.preHeaderSpacer as HTMLDivElement; }
  get preHeaderPanelScrollerR(): HTMLDivElement { return this.paneAt('header', 'r')?.preHeaderScroller as HTMLDivElement; }
  get preHeaderPanelR(): HTMLDivElement { return this.paneAt('header', 'r')?.preHeader as HTMLDivElement; }
  get preHeaderPanelSpacerR(): HTMLDivElement { return this.paneAt('header', 'r')?.preHeaderSpacer as HTMLDivElement; }
  get headerScrollerL(): HTMLDivElement { return this.paneAt('header', 'l')?.headerScroller as HTMLDivElement; }
  get headerScrollerR(): HTMLDivElement { return this.paneAt('header', 'r')?.headerScroller as HTMLDivElement; }
  get headerScrollerRF(): HTMLDivElement { return this.paneAt('header', 'rf')?.headerScroller as HTMLDivElement; }
  get headerL(): HTMLDivElement { return this.paneAt('header', 'l')?.header as HTMLDivElement; }
  get headerR(): HTMLDivElement { return this.paneAt('header', 'r')?.header as HTMLDivElement; }
  get headerRF(): HTMLDivElement { return this.paneAt('header', 'rf')?.header as HTMLDivElement; }
  get headerRowScrollerL(): HTMLDivElement { return this.paneAt('top', 'l')?.headerRowScroller as HTMLDivElement; }
  get headerRowScrollerR(): HTMLDivElement { return this.paneAt('top', 'r')?.headerRowScroller as HTMLDivElement; }
  get headerRowScrollerRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.headerRowScroller as HTMLDivElement; }
  get headerRowSpacerL(): HTMLDivElement { return this.paneAt('top', 'l')?.headerRowSpacer as HTMLDivElement; }
  get headerRowSpacerR(): HTMLDivElement { return this.paneAt('top', 'r')?.headerRowSpacer as HTMLDivElement; }
  get headerRowSpacerRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.headerRowSpacer as HTMLDivElement; }
  get headerRowL(): HTMLDivElement { return this.paneAt('top', 'l')?.headerRow as HTMLDivElement; }
  get headerRowR(): HTMLDivElement { return this.paneAt('top', 'r')?.headerRow as HTMLDivElement; }
  get headerRowRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.headerRow as HTMLDivElement; }
  get topPanelScrollerL(): HTMLDivElement { return this.paneAt('top', 'l')?.topPanelScroller as HTMLDivElement; }
  get topPanelScrollerR(): HTMLDivElement { return this.paneAt('top', 'r')?.topPanelScroller as HTMLDivElement; }
  get topPanelScrollerRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.topPanelScroller as HTMLDivElement; }
  get topPanelL(): HTMLDivElement { return this.paneAt('top', 'l')?.topPanel as HTMLDivElement; }
  get topPanelR(): HTMLDivElement { return this.paneAt('top', 'r')?.topPanel as HTMLDivElement; }
  get topPanelRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.topPanel as HTMLDivElement; }
  get viewportTopL(): HTMLDivElement { return this.paneAt('top', 'l')?.viewport as HTMLDivElement; }
  get viewportTopR(): HTMLDivElement { return this.paneAt('top', 'r')?.viewport as HTMLDivElement; }
  get viewportTopRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.viewport as HTMLDivElement; }
  get viewportBottomL(): HTMLDivElement { return this.paneAt('bottom', 'l')?.viewport as HTMLDivElement; }
  get viewportBottomR(): HTMLDivElement { return this.paneAt('bottom', 'r')?.viewport as HTMLDivElement; }
  get viewportBottomRF(): HTMLDivElement { return this.paneAt('bottom', 'rf')?.viewport as HTMLDivElement; }
  get viewportBottomFrozenL(): HTMLDivElement { return this.paneAt('bf', 'l')?.viewport as HTMLDivElement; }
  get viewportBottomFrozenR(): HTMLDivElement { return this.paneAt('bf', 'r')?.viewport as HTMLDivElement; }
  get viewportBottomFrozenRF(): HTMLDivElement { return this.paneAt('bf', 'rf')?.viewport as HTMLDivElement; }
  get canvasTopL(): HTMLDivElement { return this.paneAt('top', 'l')?.canvas as HTMLDivElement; }
  get canvasTopR(): HTMLDivElement { return this.paneAt('top', 'r')?.canvas as HTMLDivElement; }
  get canvasTopRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.canvas as HTMLDivElement; }
  get canvasBottomL(): HTMLDivElement { return this.paneAt('bottom', 'l')?.canvas as HTMLDivElement; }
  get canvasBottomR(): HTMLDivElement { return this.paneAt('bottom', 'r')?.canvas as HTMLDivElement; }
  get canvasBottomRF(): HTMLDivElement { return this.paneAt('bottom', 'rf')?.canvas as HTMLDivElement; }
  get canvasBottomFrozenL(): HTMLDivElement { return this.paneAt('bf', 'l')?.canvas as HTMLDivElement; }
  get canvasBottomFrozenR(): HTMLDivElement { return this.paneAt('bf', 'r')?.canvas as HTMLDivElement; }
  get canvasBottomFrozenRF(): HTMLDivElement { return this.paneAt('bf', 'rf')?.canvas as HTMLDivElement; }
  get footerRowScrollerL(): HTMLDivElement { return this.paneAt('top', 'l')?.footerRowScroller as HTMLDivElement; }
  get footerRowScrollerR(): HTMLDivElement { return this.paneAt('top', 'r')?.footerRowScroller as HTMLDivElement; }
  get footerRowScrollerRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.footerRowScroller as HTMLDivElement; }
  get footerRowSpacerL(): HTMLDivElement { return this.paneAt('top', 'l')?.footerRowSpacer as HTMLDivElement; }
  get footerRowSpacerR(): HTMLDivElement { return this.paneAt('top', 'r')?.footerRowSpacer as HTMLDivElement; }
  get footerRowSpacerRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.footerRowSpacer as HTMLDivElement; }
  get footerRowL(): HTMLDivElement { return this.paneAt('top', 'l')?.footerRow as HTMLDivElement; }
  get footerRowR(): HTMLDivElement { return this.paneAt('top', 'r')?.footerRow as HTMLDivElement; }
  get footerRowRF(): HTMLDivElement { return this.paneAt('top', 'rf')?.footerRow as HTMLDivElement; }

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

  /**
   * The pane matrix (M18): every pane cell keyed by structural (row, column) —
   * the single store behind the named-element getters. Cells exist only once
   * built; `paneAt(row, col)` is the lookup.
   */
  protected paneMatrix: Partial<Record<PaneRowKey, Partial<Record<PaneColKey, PaneSet>>>> = {};

  paneAt(row: PaneRowKey, col: PaneColKey): PaneSet | undefined {
    return this.paneMatrix[row]?.[col];
  }

  /**
   * Builds one pane cell — the pane element plus its standard children for the row
   * kind (header chrome / top chrome+viewport+canvas / bottom viewport+canvas) —
   * with the historical class skin, and registers it in the matrix. `after` places
   * the pane at a canonical sibling position for materialized bands; omitted panes
   * append to the container (initial build order).
   */
  protected buildPaneSet(row: PaneRowKey, col: PaneColKey, o: ViewportMgrBuildOptions, after?: HTMLElement): PaneSet {
    const colCss = PANE_COL_CSS[col];
    const rowCss = PANE_ROW_CSS[row];

    const pane = Utils.createDomElement('div', { className: `slick-pane slick-pane-${rowCss} slick-pane-${colCss}`, tabIndex: 0 });
    if (after) {
      this.container.insertBefore(pane, after.nextSibling);
    } else {
      this.container.appendChild(pane);
    }
    const set: PaneSet = { pane };

    if (row === 'header') {
      if (o.createPreHeaderPanel && col !== 'rf') {
        set.preHeaderScroller = Utils.createDomElement('div', { className: 'slick-preheader-panel ui-state-default slick-state-default', style: { overflow: 'hidden', position: 'relative' } }, pane);
        if (col === 'l') {
          // historical: the left pre-header scroller carries a leading anonymous div
          set.preHeaderScroller.appendChild(document.createElement('div'));
        }
        set.preHeader = Utils.createDomElement('div', null, set.preHeaderScroller);
        set.preHeaderSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, set.preHeaderScroller);
        if (!o.showPreHeaderPanel) {
          Utils.hide(set.preHeaderScroller);
        }
      }
      set.headerScroller = Utils.createDomElement('div', { className: `slick-header ui-state-default slick-state-default slick-header-${colCss}` }, pane);
      set.header = Utils.createDomElement('div', { className: `slick-header-columns slick-header-columns-${colCss}`, role: 'row', style: { left: '-1000px' } }, set.headerScroller);
      if (!o.showColumnHeader) {
        Utils.hide(set.headerScroller);
      }
    } else if (row === 'top') {
      set.headerRowScroller = Utils.createDomElement('div', { className: 'slick-headerrow ui-state-default slick-state-default' }, pane);
      set.headerRowSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, set.headerRowScroller);
      set.headerRow = Utils.createDomElement('div', { className: `slick-headerrow-columns slick-headerrow-columns-${colCss}`, }, set.headerRowScroller);
      if (!o.showHeaderRow) {
        Utils.hide(set.headerRowScroller);
      }
      set.topPanelScroller = Utils.createDomElement('div', { className: 'slick-top-panel-scroller ui-state-default slick-state-default' }, pane);
      set.topPanel = Utils.createDomElement('div', { className: 'slick-top-panel', style: { width: '10000px' } }, set.topPanelScroller);
      if (!o.showTopPanel) {
        Utils.hide(set.topPanelScroller);
      }
      this.addViewportAndCanvas(set, 'top', colCss, o);
      // the footer-row chrome is appended after the viewport by buildFooterRowFor
      // (historically created later, in R-before-L order)
    } else {
      this.addViewportAndCanvas(set, rowCss, colCss, o);
    }

    (this.paneMatrix[row] ??= {})[col] = set;
    return set;
  }

  /** Adds the viewport+canvas pair of a pane cell (all rows except the header row). */
  protected addViewportAndCanvas(set: PaneSet, rowCss: string, colCss: string, o: ViewportMgrBuildOptions) {
    set.viewport = Utils.createDomElement('div', { className: `slick-viewport slick-viewport-${rowCss} slick-viewport-${colCss}`, tabIndex: 0 }, set.pane);
    if (o.viewportClass) {
      set.viewport.classList.add(...Utils.classNameToList(o.viewportClass));
    }
    set.canvas = Utils.createDomElement('div', { className: `grid-canvas grid-canvas-${rowCss} grid-canvas-${colCss}`, tabIndex: 0 }, set.viewport);
  }

  /** Adds the footer-row chrome to an existing top-row pane cell (historical order and widths). */
  protected buildFooterRowFor(col: PaneColKey, o: ViewportMgrBuildOptions, canvasWithScrollbarWidth?: number) {
    const set = this.paneAt('top', col);
    if (!set || set.footerRowScroller) {
      return;
    }
    set.footerRowScroller = Utils.createDomElement('div', { className: 'slick-footerrow ui-state-default slick-state-default' }, set.pane);
    set.footerRowSpacer = Utils.createDomElement('div', { style: { display: 'block', height: '1px', position: 'absolute', top: '0px', left: '0px' } }, set.footerRowScroller);
    if (canvasWithScrollbarWidth !== undefined) {
      // init-time path sets the spacer width immediately; materialization paths leave
      // it to the updateCanvasWidth that follows (historical behaviour of both)
      Utils.width(set.footerRowSpacer, canvasWithScrollbarWidth);
    }
    set.footerRow = Utils.createDomElement('div', { className: `slick-footerrow-columns slick-footerrow-columns-${PANE_COL_CSS[col]}` }, set.footerRowScroller);
    if (!o.showFooterRow) {
      Utils.hide(set.footerRowScroller);
    }
  }

  /**
   * Rebuilds the shared element arrays IN PLACE from the matrix in canonical
   * (historical) order, and refreshes the dynamic-band slot registry. The array
   * object identities are part of the grid contract and never change.
   */
  protected syncElementArrays() {
    const fill = (arr: HTMLDivElement[], els: Array<HTMLDivElement | undefined>) => {
      arr.length = 0;
      els.forEach((el) => { if (el) { arr.push(el); } });
    };
    const cell = (row: PaneRowKey, col: PaneColKey) => this.paneAt(row, col);
    // canonical order preserves the historical array layout: classic four first,
    // then the right-frozen pair, then the bottom-frozen row
    const vpOrder: Array<PaneSet | undefined> = [
      cell('top', 'l'), cell('top', 'r'), cell('bottom', 'l'), cell('bottom', 'r'),
      cell('top', 'rf'), cell('bottom', 'rf'),
      cell('bf', 'l'), cell('bf', 'r'), cell('bf', 'rf'),
    ];
    fill(this.viewport, vpOrder.map((s) => s?.viewport));
    fill(this.canvas, vpOrder.map((s) => s?.canvas));

    const colOrder: PaneColKey[] = ['l', 'r', 'rf'];
    fill(this.headerScroller, colOrder.map((c) => cell('header', c)?.headerScroller));
    fill(this.headersArr, colOrder.map((c) => cell('header', c)?.header));
    fill(this.headerRowScroller, colOrder.map((c) => cell('top', c)?.headerRowScroller));
    fill(this.headerRowsArr, colOrder.map((c) => cell('top', c)?.headerRow));
    fill(this.topPanelScrollersArr, colOrder.map((c) => cell('top', c)?.topPanelScroller));
    fill(this.topPanelsArr, colOrder.map((c) => cell('top', c)?.topPanel));
    fill(this.footerRowScroller, colOrder.map((c) => cell('top', c)?.footerRowScroller));
    fill(this.footerRow, colOrder.map((c) => cell('top', c)?.footerRow));

    // dynamic-band slots (index into the viewport/canvas arrays)
    this.rfTopSlot = this.canvas.indexOf(cell('top', 'rf')?.canvas as HTMLDivElement);
    this.rfBottomSlot = this.canvas.indexOf(cell('bottom', 'rf')?.canvas as HTMLDivElement);
    this.bfSlotL = this.canvas.indexOf(cell('bf', 'l')?.canvas as HTMLDivElement);
    this.bfSlotR = this.canvas.indexOf(cell('bf', 'r')?.canvas as HTMLDivElement);
    this.bfSlotRF = this.canvas.indexOf(cell('bf', 'rf')?.canvas as HTMLDivElement);
  }

  // --- facade collections (M19a): one cached instance per set, wrapping the live
  // --- shared arrays (identity contract) or deriving from the matrix (cold sets)
  protected readonly facadeSets: Record<string, BandSet | CellSet> = {};
  protected bandSetFor(key: string, row: PaneRowKey, part: keyof PaneSet, live?: HTMLDivElement[]): BandSet {
    return (this.facadeSets[key] ??= new BandSet(this, row, part, live)) as BandSet;
  }
  protected cellSetFor(part: 'pane' | 'viewport' | 'canvas', live?: HTMLDivElement[]): CellSet {
    return (this.facadeSets[part] ??= new CellSet(this, part, live)) as CellSet;
  }

  get headers(): BandSet { return this.bandSetFor('headers', 'header', 'header', this.headersArr); }
  get headerScrollers(): BandSet { return this.bandSetFor('headerScrollers', 'header', 'headerScroller', this.headerScroller); }
  get headerRows(): BandSet { return this.bandSetFor('headerRows', 'top', 'headerRow', this.headerRowsArr); }
  get headerRowScrollers(): BandSet { return this.bandSetFor('headerRowScrollers', 'top', 'headerRowScroller', this.headerRowScroller); }
  get headerRowSpacers(): BandSet { return this.bandSetFor('headerRowSpacers', 'top', 'headerRowSpacer'); }
  get footerRows(): BandSet { return this.bandSetFor('footerRows', 'top', 'footerRow', this.footerRow); }
  get footerRowScrollers(): BandSet { return this.bandSetFor('footerRowScrollers', 'top', 'footerRowScroller', this.footerRowScroller); }
  get footerRowSpacers(): BandSet { return this.bandSetFor('footerRowSpacers', 'top', 'footerRowSpacer'); }
  get topPanels(): BandSet { return this.bandSetFor('topPanels', 'top', 'topPanel', this.topPanelsArr); }
  get topPanelScrollers(): BandSet { return this.bandSetFor('topPanelScrollers', 'top', 'topPanelScroller', this.topPanelScrollersArr); }
  get preHeaderPanels(): BandSet { return this.bandSetFor('preHeaderPanels', 'header', 'preHeader'); }
  get preHeaderScrollers(): BandSet { return this.bandSetFor('preHeaderScrollers', 'header', 'preHeaderScroller'); }
  get preHeaderSpacers(): BandSet { return this.bandSetFor('preHeaderSpacers', 'header', 'preHeaderSpacer'); }
  get viewports(): CellSet { return this.cellSetFor('viewport', this.viewport); }
  get canvases(): CellSet { return this.cellSetFor('canvas', this.canvas); }
  get panes(): CellSet { return this.cellSetFor('pane'); }

  // --- scroll-container facade (M19a): LIVE selection per access, so the owners can
  // --- never be stale (replaces the grid's setScroller()-time alias snapshots; the
  // --- selection itself is a handful of field reads)
  get scrollContainerX(): HTMLDivElement { return this.selectScrollContainers().x; }
  get scrollContainerY(): HTMLDivElement { return this.selectScrollContainers().y; }
  get headerScrollContainer(): HTMLDivElement { return this.selectScrollContainers().header; }
  get headerRowScrollContainer(): HTMLDivElement { return this.selectScrollContainers().headerRow; }
  get footerRowScrollContainer(): HTMLDivElement { return this.selectScrollContainers().footerRow; }

  // panes

  // pre-header panels (only when createPreHeaderPanel)

  // header scrollers and header column containers
  headerScroller: HTMLDivElement[] = [];
  protected headersArr: HTMLDivElement[] = [];

  // header rows
  headerRowScroller: HTMLDivElement[] = [];
  protected headerRowsArr: HTMLDivElement[] = [];

  // top panels
  protected topPanelScrollersArr: HTMLDivElement[] = [];
  protected topPanelsArr: HTMLDivElement[] = [];

  // viewports and canvases
  viewport: HTMLDivElement[] = [];
  canvas: HTMLDivElement[] = [];

  // right-frozen band (Phase 4 — exists only while frozenRightColumn > 0 has been applied)

  // bottom-frozen row band (Phase 4 — exists only in simultaneous top+bottom mode)

  // footer rows (only when createFooterRow)
  footerRowScroller: HTMLDivElement[] = [];
  footerRow: HTMLDivElement[] = [];

  /**
   * Builds the pane/viewport/canvas DOM inside the given container.
   * The construction order and every class/style is identical to the historical
   * inline construction in SlickGrid.initialize().
   */
  buildPanes(container: HTMLElement, o: ViewportMgrBuildOptions) {
    this.container = container;
    this.lazy = !!o.lazyPanes && !(((o.frozenColumn ?? -1) > -1) || ((o.frozenRow ?? -1) > -1));

    // historical sibling order: headerL, [headerR], topL, [topR, bottomL, bottomR]
    this.buildPaneSet('header', 'l', o);
    if (!this.lazy) {
      this.buildPaneSet('header', 'r', o);
    }
    this.buildPaneSet('top', 'l', o);
    if (!this.lazy) {
      this.buildPaneSet('top', 'r', o);
      this.buildPaneSet('bottom', 'l', o);
      this.buildPaneSet('bottom', 'r', o);
    }
    this.syncElementArrays();
  }

  /**
   * Builds the footer-row containers (only called when the createFooterRow option is on).
   * Identical construction to the historical inline code, including the R-before-L
   * scroller creation order and spacer widths.
   */
  buildFooterRows(o: ViewportMgrBuildOptions, canvasWithScrollbarWidth: number) {
    // historical creation order: right scroller before left
    if (!this.lazy) {
      this.buildFooterRowFor('r', o, canvasWithScrollbarWidth);
    }
    this.buildFooterRowFor('l', o, canvasWithScrollbarWidth);
    this.syncElementArrays();
  }

  /**
   * Builds the right/bottom panes, chrome, viewports and canvases that a lazyPanes
   * grid skipped at init, inserting each pane at its canonical sibling position and
   * pushing the new elements into the shared caches IN PLACE (the grid's array
   * aliases keep working). Idempotent: returns null when the grid is not lazy
   * (already fully built or built non-lazy); otherwise a manifest of exactly the
   * NEW elements, for the grid's event wiring (M19c).
   */
  materializeSecondaryPanes(o: ViewportMgrBuildOptions): PaneElementSets | null {
    if (!this.lazy) {
      return null;
    }
    this.lazy = false;

    // canonical sibling positions between the existing panes
    const headerL = this.paneAt('header', 'l')!.pane;
    const topR = this.buildPaneSet('top', 'r', o, this.paneAt('top', 'l')!.pane);
    this.buildPaneSet('header', 'r', o, headerL);
    const bottomL = this.buildPaneSet('bottom', 'l', o, topR.pane);
    this.buildPaneSet('bottom', 'r', o, bottomL.pane);

    if (o.createFooterRow) {
      // spacer width is applied by the updateCanvasWidth that follows materialization
      this.buildFooterRowFor('r', o);
    }
    this.syncElementArrays();
    return {
      // historical wiring order preserved: topR before the bottom pair
      viewports: [this.viewportTopR, this.viewportBottomL, this.viewportBottomR],
      canvases: [this.canvasTopR, this.canvasBottomL, this.canvasBottomR],
      headers: [this.headerR],
      headerScrollers: [this.headerScrollerR],
      headerRowScrollers: [this.headerRowScrollerR],
      footerRows: o.createFooterRow ? [this.footerRowR] : [],
      footerRowScrollers: o.createFooterRow ? [this.footerRowScrollerR] : [],
      preHeaderScrollers: o.createPreHeaderPanel ? [this.preHeaderPanelScrollerR] : [],
      // classic materialization can move the ancestor-scroll anchor canvas
      bodyCanvasChanged: true,
    };
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
   * MIDDLE band while this band is active. Returns a manifest of exactly the NEW
   * elements (incl. the BF×RF corner when it arrived with this band), or null when
   * the band already exists.
   */
  materializeRightFrozenBand(o: ViewportMgrBuildOptions): PaneElementSets | null {
    if (this.paneAt('header', 'rf')) {
      // band already exists: no corner work here (pre-matrix behavior). The BF×RF
      // corner is always created by whichever band materializes SECOND, on its
      // success path — and no pane events are wired on this early return, so
      // creating the corner here would leave it event-less.
      return null;
    }

    // appended as a block after the last classic pane
    const lastClassic = (this.paneAt('bottom', 'r') ?? this.paneAt('top', 'l'))!.pane;
    const h = this.buildPaneSet('header', 'rf', o, lastClassic);
    const t = this.buildPaneSet('top', 'rf', o, h.pane);
    this.buildPaneSet('bottom', 'rf', o, t.pane);
    if (o.createFooterRow) {
      this.buildFooterRowFor('rf', o);
    }

    // if the bottom-frozen band already exists, add the shared corner pane; the
    // CREATOR reports it — the exactly-once manifest rule
    const corner = this.ensureBottomFrozenRightVariant(o);
    this.syncElementArrays();
    const viewports = [this.viewportTopRF, this.viewportBottomRF];
    const canvases = [this.canvasTopRF, this.canvasBottomRF];
    if (corner) {
      viewports.push(corner.viewport as HTMLDivElement);
      canvases.push(corner.canvas as HTMLDivElement);
    }
    return {
      viewports,
      canvases,
      headers: [this.headerRF],
      headerScrollers: [this.headerScrollerRF],
      headerRowScrollers: [this.headerRowScrollerRF],
      footerRows: o.createFooterRow ? [this.footerRowRF] : [],
      footerRowScrollers: o.createFooterRow ? [this.footerRowScrollerRF] : [],
    };
  }

  /**
   * Builds the bottom-frozen row band (Phase 4, simultaneous top+bottom mode): one
   * pane+viewport+canvas per active column band, appended after all existing panes
   * with `*-bottom-frozen` css classes. Element arrays extend at the END and the
   * slots are recorded (bfSlotL/R/RF). Idempotent: returns false when the band
   * already exists (a corner-only manifest when the idempotent recall added the
   * late RF corner variant). The right-frozen column variant is built only when
   * that band's DOM exists at call time; materializeRightFrozenBand adds it later
   * otherwise.
   */
  materializeBottomFrozenBand(o: ViewportMgrBuildOptions): PaneElementSets | null {
    if (this.paneAt('bf', 'l')) {
      // idempotent call may still need to add the RF corner variant late — the
      // creator reports it, exactly once
      const lateCorner = this.ensureBottomFrozenRightVariant(o);
      return lateCorner
        ? { viewports: [lateCorner.viewport as HTMLDivElement], canvases: [lateCorner.canvas as HTMLDivElement] }
        : null;
    }

    const lastPane = (this.paneAt('bottom', 'rf') ?? this.paneAt('bottom', 'r') ?? this.paneAt('top', 'l'))!.pane;
    const l = this.buildPaneSet('bf', 'l', o, lastPane);
    this.buildPaneSet('bf', 'r', o, l.pane);
    const corner = this.ensureBottomFrozenRightVariant(o);
    this.syncElementArrays();
    const viewports = [this.viewportBottomFrozenL, this.viewportBottomFrozenR];
    const canvases = [this.canvasBottomFrozenL, this.canvasBottomFrozenR];
    if (corner) {
      viewports.push(corner.viewport as HTMLDivElement);
      canvases.push(corner.canvas as HTMLDivElement);
    }
    return { viewports, canvases };
  }

  /** Adds the bottom-frozen × right-frozen corner pane when both bands exist,
   * returning the created PaneSet (null when nothing was created) so the CALLING
   * materializer — and only it — reports the corner in its manifest. */
  protected ensureBottomFrozenRightVariant(o: ViewportMgrBuildOptions): PaneSet | null {
    if (!this.paneAt('bf', 'l') || !this.paneAt('header', 'rf') || this.paneAt('bf', 'rf')) {
      return null;
    }
    const created = this.buildPaneSet('bf', 'rf', o, this.paneAt('bf', 'r')!.pane);
    this.syncElementArrays();
    return created;
  }

  /**
   * The full current element manifest — the init-time array-wide bind pass and the
   * destroy-time unbind pass iterate the SAME shape, so they can never diverge.
   */
  allPaneElements(): PaneElementSets {
    return {
      viewports: this.viewport,
      canvases: this.canvas,
      headerScrollers: this.headerScroller,
      headerRowScrollers: this.headerRowScroller,
      footerRows: this.footerRow,
      footerRowScrollers: this.footerRowScroller,
    };
  }

  /**
   * One entry for every runtime freeze change (M19c): materializes whatever bands
   * the CURRENT freeze snapshot requires, in the load-bearing order classic → RF →
   * BF (paneCellIndex's classic slots 0–3 depend on classic canonicalization
   * happening first — the historical wrappers forced it before either band), and
   * merges the per-band manifests of newly created elements into one.
   */
  ensureBandsMaterialized(o: ViewportMgrBuildOptions): PaneElementSets | null {
    const classicGate = this.freeze.frozenColumnIdx > -1 || this.freeze.hasFrozenRows;
    const rfGate = (this.freeze.frozenRightColCount ?? 0) > 0;
    const bfGate = (this.freeze.frozenRowCount ?? -1) > -1 && (this.freeze.frozenBottomRowCount ?? 0) > 0;

    let merged: PaneElementSets | null = null;
    const merge = (m: PaneElementSets | null) => {
      if (!m) { return; }
      merged ??= {};
      for (const key of ['viewports', 'canvases', 'headers', 'headerScrollers', 'headerRowScrollers', 'footerRows', 'footerRowScrollers', 'preHeaderScrollers'] as const) {
        if (m[key]?.length) {
          (merged[key] ??= []).push(...m[key]!);
        }
      }
      if (m.bodyCanvasChanged) {
        merged.bodyCanvasChanged = true;
      }
    };

    if (classicGate || rfGate || bfGate) {
      merge(this.materializeSecondaryPanes(o));
    }
    if (rfGate) {
      merge(this.materializeRightFrozenBand(o));
    }
    if (bfGate) {
      merge(this.materializeBottomFrozenBand(o));
    }
    return merged;
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

  // --- per-semantic band predicates (M19b). Doctrine (FACADE-FEASIBILITY.md §5):
  // --- one predicate per HISTORICAL semantic, transcribed from its call sites —
  // --- never unified, because the boundary comparisons deliberately differ. ---

  /** left OR right frozen membership — the appendCellHtml 'frozen' CELL class and the
   * cleanUpCells exemption semantic. Header cells keep isColumnInFrozenBand alone
   * (left-band-only) — a different historical semantic, not an oversight. */
  isColumnInAnyFrozenBand(colIdx: number): boolean {
    return this.isColumnInFrozenBand(colIdx) || this.isColumnInRightFrozenBand(colIdx);
  }

  /** scrollCellIntoView's early-out pair, preserving the historical INCLUSIVE
   * `cell <= frozenColumn` comparison — the boundary column itself never scrolls. */
  isColumnAlwaysHorizontallyVisible(colIdx: number): boolean {
    return colIdx <= this.freeze.frozenColumnIdx || this.isColumnInRightFrozenBand(colIdx);
  }

  /** appendRowHtml's row 'frozen' css semantic: the INCLUSIVE top test (the row equal
   * to the frozenRow count is classed although it renders in the scrollable canvas —
   * pinned by viewportmgr-band-routing.cy.ts) OR bottom-frozen band membership.
   * Distinct from isRowInFrozenBand (cleanup) and the render split (attachRow). */
  isRowFrozenClassed(row: number): boolean {
    return (this.freeze.hasFrozenRows && row <= (this.freeze.frozenRowCount ?? -1)) || this.isRowInBottomFrozenBand(row);
  }

  /**
   * Vertical data offset of the row-band canvas containing `node` (M19), for
   * translating page coordinates into canvas-local rows. Two historical variants:
   * - bfAware (getCellFromEvent): the bottom-frozen band rebases to its first row;
   * - NOT bfAware (setActiveCellInternal): the bf band is deliberately not
   *   distinguished — bf canvases carry no 'grid-canvas-bottom' class token, so the
   *   bottom test is false and the offset is 0 for them (historical behavior kept
   *   as an explicit flag, not silently unified).
   * The classic bottom offset keeps its asymmetric source: frozenBottom measures the
   * LIVE top-left canvas height, top-freeze uses the caller's cached frozenRowsHeight.
   * Callers keep their own hasFrozenRows() gating (their surrounding logic differs).
   */
  canvasNodeRowOffset(node: Element, g: { dataLength: number; frozenBottomRowCount: number; rowHeight: number; frozenRowsHeight: number; frozenBottom: boolean; }, opts?: { bfAware?: boolean; }): number {
    if (opts?.bfAware && this.hasBottomFrozenBand() && Utils.parents(node, '.grid-canvas-bottom-frozen').length) {
      // bottom-frozen band: canvas origin is the band's first row
      return (g.dataLength - g.frozenBottomRowCount) * g.rowHeight;
    }
    if (Utils.parents(node, '.grid-canvas-bottom').length) {
      return g.frozenBottom ? Utils.height(this.canvasTopL) as number : g.frozenRowsHeight;
    }
    return 0;
  }

  /** scrollRowIntoView's guard: bottom-frozen rows never scroll; frozen-band rows are
   * skipped with the exact historical `actualFrozenRow - 1` boundaries. */
  shouldScrollRowIntoView(row: number): boolean {
    if (this.isRowInBottomFrozenBand(row)) {
      return false;
    }
    return !this.freeze.hasFrozenRows
      || (!this.freeze.frozenBottom && row > this.freeze.actualFrozenRow - 1)
      || (this.freeze.frozenBottom && row < this.freeze.actualFrozenRow - 1);
  }

  /** frozen-top row-index rebase for vertical scroll arithmetic. */
  scrollableRowIndex(row: number): number {
    return this.freeze.hasFrozenRows && !this.freeze.frozenBottom ? row - (this.freeze.frozenRowCount ?? 0) : row;
  }

  /**
   * The per-band header width arithmetic (M19d), moved VERBATIM from the grid's
   * getHeadersWidth and guarded by viewportmgr-width-golden.cy.ts. Quirks preserved:
   * the +1000 slack on the left/single band, CUMULATIVE r (includes the post-slack
   * l) under a left freeze, the RF band as a plain sum (no slack, no scrollbar),
   * and the out-of-range isColumnRightOfFreeze(columns.length) scrollbar-attribution
   * probe after the loop. g.rfStartIdx stays a GRID-derived fresh input — these
   * call sites historically re-derive it per call rather than reading the snapshot.
   */
  computeHeaderWidths(columns: Array<{ width?: number; hidden?: boolean; } | undefined>, g: { includeScrollbar: boolean; scrollbarWidth: number; viewportW: number; rfStartIdx: number; }): { l: number; r: number; rf: number; sum: number; padded: number; } {
    let l = 0;
    let r = 0;
    let rf = 0;

    let i = 0;
    const ii = columns.length;
    for (i = 0; i < ii; i++) {
      if (!columns[i] || columns[i]!.hidden) { continue; }

      const width = columns[i]!.width;

      if (i >= g.rfStartIdx) {
        // right-frozen headers are fixed-width (no horizontal scrolling): plain sum
        rf += width || 0;
      } else if (this.isColumnRightOfFreeze(i)) {
        r += width || 0;
      } else {
        l += width || 0;
      }
    }

    if (g.includeScrollbar) {
      // historical out-of-range probe: i === columns.length here, so this reads the
      // raw predicate deliberately (a band oracle is undefined past the last column)
      if (this.isColumnRightOfFreeze(i)) {
        r += g.scrollbarWidth;
      } else {
        l += g.scrollbarWidth;
      }
    }

    if (this.hasFrozenColumns()) {
      l = l + 1000;

      r = Math.max(r, g.viewportW) + l;
      r += g.scrollbarWidth;
    } else {
      l += g.scrollbarWidth;
      l = Math.max(l, g.viewportW) + 1000;
    }

    const sum = l + r;
    return { l, r, rf, sum, padded: Math.max(sum, g.viewportW) + 1000 };
  }

  /**
   * The per-band canvas width arithmetic (M19d), moved VERBATIM from the grid's
   * getCanvasWidth (reverse iteration and all): plain per-band sums, with the
   * fullWidthRows extra width going to the scrollable band (r under a left freeze,
   * l otherwise). g.rfStartIdx is the grid's fresh derivation, as above.
   */
  computeCanvasWidths(columns: Array<{ width?: number; hidden?: boolean; } | undefined>, g: { availableWidth: number; fullWidthRows: boolean; rfStartIdx: number; }): { l: number; r: number; rf: number; total: number; } {
    let l = 0;
    let r = 0;
    let rf = 0;
    let i = columns.length;

    while (i--) {
      if (!columns[i] || columns[i]!.hidden) { continue; }

      if (i >= g.rfStartIdx) {
        rf += columns[i]!.width || 0;
      } else if (this.isColumnRightOfFreeze(i)) {
        r += columns[i]!.width || 0;
      } else {
        l += columns[i]!.width || 0;
      }
    }

    let total = l + r + rf;
    if (g.fullWidthRows) {
      const extraWidth = Math.max(total, g.availableWidth) - total;
      if (extraWidth > 0) {
        total += extraWidth;
        if (this.hasFrozenColumns()) {
          r += extraWidth;
        } else {
          l += extraWidth;
        }
      }
    }
    return { l, r, rf, total };
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
    const leftActive = this.hasFrozenColumns();
    const rfActive = this.bands.frozenRightCols > 0 && !!this.paneAt('header', 'rf');
    const hasRows = this.freeze.hasFrozenRows;
    const bf = this.hasBottomFrozenBand();
    const legacyBottom = hasRows && this.bands.frozenBottomRows > 0 && this.bands.frozenTopRows === 0;

    for (const row of ['header', 'top', 'bottom', 'bf'] as PaneRowKey[]) {
      for (const col of ['l', 'r', 'rf'] as PaneColKey[]) {
        const set = this.paneAt(row, col);
        if (!set) { continue; }

        const colActive = col === 'l' ? true : (col === 'r' ? leftActive : rfActive);
        const rowActive = (row === 'header' || row === 'top') ? true : (row === 'bottom' ? hasRows : bf);
        const active = colActive && rowActive;

        // visibility — the left header/top panes were historically never toggled
        if (!(col === 'l' && (row === 'header' || row === 'top'))) {
          if (active) {
            this.showIf(set.pane);
          } else {
            this.hideIf(set.pane);
          }
        }

        // band-truth markers (BAND-LABELLING.md): stamped on active pane/viewport/
        // canvas with the CURRENT role; removed from inactive elements
        const colband = col === 'l' ? (leftActive ? 'left' : 'main') : (col === 'r' ? 'main' : 'right-frozen');
        const rowband = row === 'header' ? 'header'
          : row === 'top' ? (this.bands.frozenTopRows > 0 ? 'top-frozen' : 'body')
          : row === 'bottom' ? (legacyBottom ? 'bottom-frozen' : 'body')
          : 'bottom-frozen';
        for (const el of [set.pane, set.viewport, set.canvas]) {
          if (!el) { continue; }
          if (active) {
            el.setAttribute('data-colband', colband);
            el.setAttribute('data-rowband', rowband);
          } else {
            el.removeAttribute('data-colband');
            el.removeAttribute('data-rowband');
          }
        }
      }
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
    const leftActive = this.hasFrozenColumns();
    const rfActive = this.bands.frozenRightCols > 0 && !!this.paneAt('header', 'rf');
    const rfW = rfActive ? g.canvasWidthRF : 0;

    if (g.widthChanged || leftActive || this.freeze.hasFrozenRows || rfActive) {
      // header element widths are written whenever the element exists (historical:
      // a plain grid writes headerR's width too — it computes to 0)
      Utils.width(this.headerL, g.headersWidthL);
      if (this.headerR) {
        Utils.width(this.headerR, g.headersWidthR);
      }
      if (rfActive && this.headerRF) {
        Utils.width(this.headerRF, g.headersWidthRF);
      }

      // one geometry record per ACTIVE structural column; paneW may be the
      // historical '100%' in the plain single-band layout.
      // canvasW = the band's own column-width sum; chromeW = header-row/footer-row
      // content width (historically the FULL row width for the main band when no
      // left freeze is active).
      const cols: Array<[PaneColKey, { paneLeft?: number; paneW: number | string; canvasW: number; chromeW: number; }]> = [];
      cols.push(['l', leftActive
        ? { paneW: g.canvasWidthL, canvasW: g.canvasWidthL, chromeW: g.canvasWidthL }
        : { paneW: rfActive ? g.viewportW - rfW : '100%', canvasW: g.canvasWidthL, chromeW: g.canvasWidth }]);
      if (leftActive) {
        cols.push(['r', { paneLeft: g.canvasWidthL, paneW: g.viewportW - g.canvasWidthL - rfW, canvasW: g.canvasWidthR, chromeW: g.canvasWidthR }]);
      }
      if (rfActive) {
        cols.push(['rf', { paneLeft: g.viewportW - rfW, paneW: rfW, canvasW: g.canvasWidthRF, chromeW: g.canvasWidthRF }]);
      }

      for (const [col, w] of cols) {
        const placePane = (el: HTMLElement | undefined, sizeWidth = true) => {
          if (!el) { return; }
          if (w.paneLeft !== undefined) {
            Utils.setStyleSize(el, 'left', w.paneLeft);
          }
          if (sizeWidth) {
            Utils.width(el, w.paneW);
          }
        };
        const header = this.paneAt('header', col);
        const top = this.paneAt('top', col);
        const bottom = this.paneAt('bottom', col);
        const bf = this.paneAt('bf', col);

        placePane(header?.pane);

        if (top) {
          placePane(top.pane);
          if (top.headerRowScroller) {
            Utils.width(top.headerRowScroller, w.paneW);
            Utils.width(top.headerRow as HTMLElement, w.chromeW);
          }
          if (g.createFooterRow && top.footerRowScroller) {
            Utils.width(top.footerRowScroller, w.paneW);
            Utils.width(top.footerRow as HTMLElement, w.chromeW);
          }
          if (top.viewport) {
            Utils.width(top.viewport, w.paneW);
            Utils.width(top.canvas as HTMLElement, w.canvasW);
          }
        }

        // classic bottom row participates while rows are frozen. Historical quirks
        // preserved: its left pane is width-sized only under a left freeze, and its
        // middle pane receives 'left' but no width.
        if (this.freeze.hasFrozenRows && bottom) {
          placePane(bottom.pane, col === 'l' ? leftActive : col === 'rf');
          if (bottom.viewport) {
            Utils.width(bottom.viewport, w.paneW);
            Utils.width(bottom.canvas as HTMLElement, w.canvasW);
          }
        }

        // the bottom-frozen band (simultaneous mode) sizes left AND width everywhere
        if (this.hasBottomFrozenBand() && bf) {
          placePane(bf.pane);
          if (bf.viewport) {
            Utils.width(bf.viewport, w.paneW);
            Utils.width(bf.canvas as HTMLElement, w.canvasW);
          }
        }
      }

      if (g.createPreHeaderPanel && this.preHeaderPanel) {
        Utils.width(this.preHeaderPanel, g.preHeaderPanelWidth ?? g.canvasWidth);
      }
    }

    // spacers: historically only the classic left/right pair, never the RF one
    const spacerW = g.canvasWidth + (g.viewportHasVScroll ? g.scrollbarWidth : 0);
    Utils.width(this.headerRowSpacerL, spacerW);
    if (this.headerRowSpacerR) {
      Utils.width(this.headerRowSpacerR, spacerW);
    }
    if (g.createFooterRow) {
      Utils.width(this.footerRowSpacerL, spacerW);
      if (this.footerRowSpacerR) {
        Utils.width(this.footerRowSpacerR, spacerW);
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

    const leftActive = this.hasFrozenColumns();
    const rfActive = this.bands.frozenRightCols > 0 && !!this.paneAt('header', 'rf');
    const simultaneousBands = this.bands.frozenTopRows > 0 && this.bands.frozenBottomRows > 0 && !!this.paneAt('bf', 'l');

    // Account for Frozen Rows
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

    if (leftActive && g.autoHeight) {
      paneTopH += g.scrollbarHeight;
    }

    // The top viewport does not contain the top panel or header row
    viewportTopH = paneTopH - g.topPanelH - g.headerRowH - g.footerRowH;

    if (g.autoHeight) {
      if (leftActive) {
        let fullHeight = paneTopH + this.headerScrollerL.offsetHeight;
        fullHeight += g.getContainerVBoxDelta();
        if (g.showPreHeaderPanel) {
          fullHeight += g.preHeaderPanelHeight!;
        }
        Utils.height(this.container, fullHeight);
      }

      this.paneTopL.style.position = 'relative';
    }

    // place the left top pane first (offset WITH the historical fallback), then read
    // the shared bottom offset from it, then place the secondary columns (offset
    // recomputed WITHOUT the fallback — historical asymmetry preserved)
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

    const secondaryCols: PaneColKey[] = [];
    if (leftActive) { secondaryCols.push('r'); }
    if (rfActive) { secondaryCols.push('rf'); }
    for (const col of secondaryCols) {
      const top = this.paneAt('top', col);
      if (!top) { continue; }
      let offset = Utils.height(this.paneHeaderL);
      if (offset) {
        offset += (g.showTopHeaderPanel ? g.topHeaderPanelHeight! : 0);
      }
      Utils.setStyleSize(top.pane, 'top', offset as number);
      Utils.height(top.pane, paneTopH);
      Utils.height(top.viewport as HTMLElement, viewportTopH);
    }

    if (this.freeze.hasFrozenRows) {
      // classic bottom panes per column; historical quirk: in the plain layout the
      // left bottom pane also gets width '100%' here
      const bottomCols: PaneColKey[] = ['l', ...secondaryCols];
      for (const col of bottomCols) {
        const bottom = this.paneAt('bottom', col);
        if (!bottom) { continue; }
        if (col === 'l' && !leftActive) {
          Utils.width(bottom.pane, '100%');
        }
        Utils.setStyleSize(bottom.pane, 'top', paneBottomTop);
        Utils.height(bottom.pane, paneBottomH);
        if (col !== 'l') {
          Utils.height(bottom.viewport as HTMLElement, paneBottomH);
        }
      }
      Utils.height(this.viewportBottomL, paneBottomH);

      // the frozen row band's canvases carry the band height
      const frozenRow: PaneRowKey = this.freeze.frozenBottom ? 'bottom' : 'top';
      for (const col of ['l', ...secondaryCols] as PaneColKey[]) {
        const set = this.paneAt(frozenRow, col);
        if (set?.canvas) {
          Utils.height(set.canvas, g.frozenRowsHeight);
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
      for (const col of ['l', 'r', 'rf'] as PaneColKey[]) {
        const bf = this.paneAt('bf', col);
        if (!bf || (col === 'r' && !leftActive)) { continue; }
        Utils.setStyleSize(bf.pane, 'top', bfTop);
        Utils.height(bf.pane, bfH);
        Utils.height(bf.viewport as HTMLElement, bfH);
        Utils.height(bf.canvas as HTMLElement, bfH);
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
    this.topPanelScrollersArr[0].scrollLeft = x;
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
    // the frozen-left and right-frozen bands' scrollable-body viewports follow Y
    const followerViewport = (col: PaneColKey) =>
      (this.freeze.hasFrozenRows && !this.freeze.frozenBottom ? this.paneAt('bottom', col) : this.paneAt('top', col))?.viewport;
    if (this.hasFrozenColumns()) {
      const v = followerViewport('l');
      if (v) { v.scrollTop = scrollTop; }
    }
    if (this.bands.frozenRightCols > 0) {
      const v = followerViewport('rf');
      if (v) { v.scrollTop = scrollTop; }
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
