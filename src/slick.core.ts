/**
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */

import type {
  AnyFunction,
  CSSStyleDeclarationWritable,
  EditController,
  ElementEventListener,
  Handler,
  InferDOMType,
  MergeTypes
} from './models/index.js';

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
      // eslint-disable-next-line @typescript-eslint/no-this-alias
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

  public static setStyleSize(el: HTMLElement, style: string, val?: number | string | Function) {
    if (typeof val === 'function') {
      val = val();
    } else if (typeof val === 'string') {
      el.style[style as CSSStyleDeclarationWritable] = val;
    } else {
      el.style[style as CSSStyleDeclarationWritable] = val + 'px';
    }
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

export const SlickGlobalEditorLock = new SlickEditorLock();

// export Slick namespace on both global & window objects
const SlickCore = {
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
  EditorLock, Event, EventData, EventHandler, Group, GroupTotals, NonDataRow, Range,
  RegexSanitizer, GlobalEditorLock, keyCode, preClickClassName, GridAutosizeColsMode, ColAutosizeMode,
  RowSelectionMode, ValueFilterMode, WidthEvalMode
} = SlickCore;

// also add to global object when exist
if (IIFE_ONLY && typeof global !== 'undefined' && window.Slick) {
  global.Slick = window.Slick;
}
