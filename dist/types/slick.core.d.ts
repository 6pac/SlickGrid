/**
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */
import type { EditController, ElementEventListener, Handler, InferDOMType, MergeTypes } from './models/index';
/**
 * An event object for passing data to event handlers and letting them control propagation.
 * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
 * @class EventData
 * @constructor
 */
export declare class SlickEventData {
    protected event?: Event | null | undefined;
    protected args?: any;
    protected _isPropagationStopped: boolean;
    protected _isImmediatePropagationStopped: boolean;
    protected _isDefaultPrevented: boolean;
    protected returnValues: string[];
    protected returnValue: any;
    protected target?: EventTarget | null;
    protected nativeEvent?: Event | null;
    protected arguments_: any;
    constructor(event?: Event | null | undefined, args?: any);
    /**
     * Stops event from propagating up the DOM tree.
     * @method stopPropagation
     */
    stopPropagation(): void;
    /**
     * Returns whether stopPropagation was called on this event object.
     * @method isPropagationStopped
     * @return {Boolean}
     */
    isPropagationStopped(): boolean;
    /**
     * Prevents the rest of the handlers from being executed.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation(): void;
    /**
     * Returns whether stopImmediatePropagation was called on this event object.\
     * @method isImmediatePropagationStopped
     * @return {Boolean}
     */
    isImmediatePropagationStopped(): boolean;
    getNativeEvent<E extends Event>(): E;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    addReturnValue(value: any): void;
    getReturnValue(): any;
    getArguments(): any;
}
/**
 * A simple publisher-subscriber implementation.
 * @class Event
 * @constructor
 */
export declare class SlickEvent<ArgType = any> {
    protected handlers: Handler<ArgType>[];
    /**
     * Adds an event handler to be called when the event is fired.
     * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
     * object the event was fired with.<p>
     * @method subscribe
     * @param fn {Function} Event handler.
     */
    subscribe(fn: Handler<ArgType>): void;
    /**
     * Removes an event handler added with <code>subscribe(fn)</code>.
     * @method unsubscribe
     * @param fn {Function} Event handler to be removed.
     */
    unsubscribe(fn?: Handler<ArgType>): void;
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
    notify(args: ArgType, evt?: SlickEventData | Event | MergeTypes<SlickEventData, Event> | null, scope?: any): SlickEventData;
}
export declare class SlickEventHandler<ArgType = any> {
    protected handlers: Array<{
        event: SlickEvent;
        handler: Handler<ArgType>;
    }>;
    subscribe(event: SlickEvent, handler: Handler<ArgType>): this;
    unsubscribe(event: SlickEvent, handler: Handler<ArgType>): this | undefined;
    unsubscribeAll(): this;
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
export declare class SlickRange {
    fromRow: number;
    fromCell: number;
    toCell: number;
    toRow: number;
    constructor(fromRow: number, fromCell: number, toRow?: number, toCell?: number);
    /**
     * Returns whether a range represents a single row.
     * @method isSingleRow
     * @return {Boolean}
     */
    isSingleRow(): boolean;
    /**
     * Returns whether a range represents a single cell.
     * @method isSingleCell
     * @return {Boolean}
     */
    isSingleCell(): boolean;
    /**
     * Returns whether a range contains a given cell.
     * @method contains
     * @param row {Integer}
     * @param cell {Integer}
     * @return {Boolean}
     */
    contains(row: number, cell: number): boolean;
    /**
     * Returns a readable representation of a range.
     * @method toString
     * @return {String}
     */
    toString(): string;
}
/**
 * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
 * @class NonDataItem
 * @constructor
 */
export declare class SlickNonDataItem {
    __nonDataRow: boolean;
}
/**
 * Information about a group of rows.
 * @class Group
 * @extends Slick.NonDataItem
 * @constructor
 */
export declare class SlickGroup extends SlickNonDataItem {
    __group: boolean;
    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    level: number;
    /**
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    count: number;
    /**
     * Grouping value.
     * @property value
     * @type {Object}
     */
    value: null;
    /**
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    title: string | null;
    /**
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    collapsed: boolean | number;
    /**
     * Whether a group selection checkbox is checked.
     * @property selectChecked
     * @type {Boolean}
     */
    selectChecked: boolean;
    /**
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    totals: SlickGroupTotals;
    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    rows: number[];
    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    groups: any[];
    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    groupingKey: any;
    constructor();
    /**
     * Compares two Group instances.
     * @method equals
     * @return {Boolean}
     * @param group {Group} Group instance to compare to.
     */
    equals(group: SlickGroup): boolean;
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
export declare class SlickGroupTotals extends SlickNonDataItem {
    __groupTotals: boolean;
    /**
     * Parent Group.
     * @param group
     * @type {Group}
     */
    group: SlickGroup;
    /**
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    initialized: boolean;
    constructor();
}
/**
 * A locking helper to track the active edit controller and ensure that only a single controller
 * can be active at a time.  This prevents a whole class of state and validation synchronization
 * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
 * and attempt a commit or cancel before proceeding.
 * @class EditorLock
 * @constructor
 */
export declare class SlickEditorLock {
    activeEditController: any;
    /**
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * @method isActive
     * @param editController {EditController}
     * @return {Boolean}
     */
    isActive(editController?: EditController): boolean;
    /**
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active, and exception will be throw new Error(.
     * @method activate
     * @param editController {EditController} edit controller acquiring the lock
     */
    activate(editController: EditController): void;
    /**
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be throw new Error(.
     * @method deactivate
     * @param editController {EditController} edit controller releasing the lock
     */
    deactivate(editController: EditController): void;
    /**
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * @method commitCurrentEdit
     * @return {Boolean}
     */
    commitCurrentEdit(): boolean;
    /**
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully cancelled.  If no edit controller is
     * active, returns true.
     * @method cancelCurrentEdit
     * @return {Boolean}
     */
    cancelCurrentEdit(): boolean;
}
declare function regexSanitizer(dirtyHtml: string): string;
/**
 * A simple binding event service to keep track of all JavaScript events with callback listeners,
 * it allows us to unbind event(s) and their listener(s) by calling a simple unbind method call.
 * Unbinding is a necessary step to make sure that all event listeners are removed to avoid memory leaks when destroing the grid
 */
export declare class BindingEventService {
    protected _boundedEvents: ElementEventListener[];
    getBoundedEvents(): ElementEventListener[];
    destroy(): void;
    /** Bind an event listener to any element */
    bind(element: Element | Window, eventName: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /** Unbind all will remove every every event handlers that were bounded earlier */
    unbind(element: Element | Window, eventName: string, listener: EventListenerOrEventListenerObject): void;
    unbindByEventName(element: Element | Window, eventName: string): void;
    /** Unbind all will remove every every event handlers that were bounded earlier */
    unbindAll(): void;
}
export declare class Utils {
    private static getProto;
    private static class2type;
    private static toString;
    private static hasOwn;
    private static fnToString;
    private static ObjectFunctionString;
    static storage: {
        _storage: WeakMap<WeakKey, any>;
        put: (element: any, key: string, obj: any) => void;
        get: (element: any, key: string) => any;
        remove: (element: any, key: string) => any;
    };
    static isFunction(obj: any): boolean;
    static isPlainObject(obj: any): boolean;
    static calculateAvailableSpace(element: HTMLElement): {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    static extend<T = any>(...args: any[]): T;
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
    static createDomElement<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(tagName: T, elementOptions?: null | {
        [P in K]: InferDOMType<HTMLElementTagNameMap[T][P]>;
    }, appendToParent?: Element): HTMLElementTagNameMap[T];
    static emptyElement(element: HTMLElement | null): HTMLElement | null;
    static innerSize(elm: HTMLElement, type: 'height' | 'width'): number;
    static getElementProp(elm: HTMLElement & {
        getComputedStyle?: () => CSSStyleDeclaration;
    }, property: string): string | null;
    static isEmptyObject(obj: any): boolean;
    static noop(): void;
    static offset(el: HTMLElement | null): {
        top: number;
        left: number;
    } | undefined;
    static windowScrollPosition(): {
        left: number;
        top: number;
    };
    static width(el: HTMLElement, value?: number | string): number | void;
    static height(el: HTMLElement, value?: number | string): number | void;
    static setStyleSize(el: HTMLElement, style: string, val?: number | string | Function): void;
    static contains(parent: HTMLElement, child: HTMLElement): boolean;
    static isHidden(el: HTMLElement): boolean;
    static parents(el: HTMLElement | ParentNode, selector?: string): (HTMLElement | ParentNode)[];
    static toFloat(value: string | number): number;
    static show(el: HTMLElement | HTMLElement[], type?: string): void;
    static hide(el: HTMLElement | HTMLElement[]): void;
    static slideUp(el: HTMLElement | HTMLElement[], callback: Function): void;
    static slideDown(el: HTMLElement | HTMLElement[], callback: Function): void;
    static slideAnimation(el: HTMLElement | HTMLElement[], slideDirection: 'slideDown' | 'slideUp', callback: Function): void;
    static applyDefaults(targetObj: any, srcObj: any): void;
}
export declare const SlickGlobalEditorLock: SlickEditorLock;
export declare const EditorLock: typeof SlickEditorLock, Event: typeof SlickEvent, EventData: typeof SlickEventData, EventHandler: typeof SlickEventHandler, Group: typeof SlickGroup, GroupTotals: typeof SlickGroupTotals, NonDataRow: typeof SlickNonDataItem, Range: typeof SlickRange, RegexSanitizer: typeof regexSanitizer, GlobalEditorLock: SlickEditorLock, keyCode: {
    SPACE: number;
    BACKSPACE: number;
    DELETE: number;
    DOWN: number;
    END: number;
    ENTER: number;
    ESCAPE: number;
    HOME: number;
    INSERT: number;
    LEFT: number;
    PAGE_DOWN: number;
    PAGE_UP: number;
    RIGHT: number;
    TAB: number;
    UP: number;
    A: number;
}, preClickClassName: string, GridAutosizeColsMode: {
    None: string;
    LegacyOff: string;
    LegacyForceFit: string;
    IgnoreViewport: string;
    FitColsToViewport: string;
    FitViewportToCols: string;
}, ColAutosizeMode: {
    Locked: string;
    Guide: string;
    Content: string;
    ContentExpandOnly: string;
    ContentIntelligent: string;
}, RowSelectionMode: {
    FirstRow: string;
    FirstNRows: string;
    AllRows: string;
    LastRow: string;
}, ValueFilterMode: {
    None: string;
    DeDuplicate: string;
    GetGreatestAndSub: string;
    GetLongestTextAndSub: string;
    GetLongestText: string;
}, WidthEvalMode: {
    Auto: string;
    TextOnly: string;
    HTML: string;
};
export {};
//# sourceMappingURL=slick.core.d.ts.map