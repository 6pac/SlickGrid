/***
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */

(window as any) = (function () {
  /***
   * An event object for passing data to event handlers and letting them control propagation.
   * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
   * @class EventData
   * @constructor
   */
  const EventData = (function (this: TEventData): void {
    var isPropagationStopped = false;
    var isImmediatePropagationStopped = false;

    /***
     * Stops event from propagating up the DOM tree.
     * @method stopPropagation
     */
    this.stopPropagation = function () {
      isPropagationStopped = true;
    };

    /***
     * Prevents the rest of the handlers from being executed.
     * @method stopImmediatePropagation
     */
    this.stopImmediatePropagation = function () {
      isImmediatePropagationStopped = true;
    };

    /***
     * Returns whether stopPropagation was called on this event object.
     * @method isPropagationStopped
     * @return {Boolean}
     */
    this.isPropagationStopped = function (): boolean {
      return isPropagationStopped;
    };

    /***
     * Returns whether stopImmediatePropagation was called on this event object.\
     * @method isImmediatePropagationStopped
     * @return {Boolean}
     */
    this.isImmediatePropagationStopped = function (): boolean {
      return isImmediatePropagationStopped;
    };
  } as any) as { new (): TEventData };

  /***
   * A simple publisher-subscriber implementation.
   * @class Event
   * @constructor
   */
  const Event = (function (this: IEvent): void {
    var handlers: typeof EventHandler[] = [];

    /***
     * Adds an event handler to be called when the event is fired.
     * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
     * object the event was fired with.<p>
     * @method subscribe
     * @param fn Event handler.
     */
    this.subscribe = function (fn): void {
      handlers.push(fn);
    };

    /***
     * Removes an event handler added with <code>subscribe(fn)</code>.
     * @method unsubscribe
     * @param fn {Function} Event handler to be removed.
     */
    this.unsubscribe = function (fn: Function): void {
      for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === fn) {
          handlers.splice(i, 1);
        }
      }
    };

    /***
     * Fires an event notifying all subscribers.
     * @method notify
     * @param args  Additional data object to be passed to all handlers.
     * @param e {EventData}
     *      Optional.
     *      An <code>EventData</code> object to be passed to all handlers.
     *      For DOM events, an existing W3C/jQuery event object can be passed in.
     * @param scope
     *      Optional.
     *      The scope ("this") within which the handler will be executed.
     *      If not specified, the scope will be set to the <code>Event</code> instance.
     */
    this.notify = function <T>(
      args: {},
      e: TEventData,
      scope: ThisParameterType<T | TEventData>
    ): void {
      e = e || new EventData();
      scope = scope || this;

      var returnValue;
      for (
        var i = 0;
        i < handlers.length &&
        !(e.isPropagationStopped() || e.isImmediatePropagationStopped());
        i++
      ) {
        // @ts-ignore 3 arguments passed 1 expected
        returnValue = handlers[i].call(scope, e, args); //? How is this working -- JACOB
      }

      return returnValue;
    };
  } as any) as { new (): IEvent };

  function EventHandler(this: IEventHandler) {
    var handlers: THandler[] = [];

    this.subscribe = function (event, handler) {
      handlers.push({
        event: event,
        handler: handler,
      });
      event.subscribe(handler);

      return this; // allow chaining
    };

    this.unsubscribe = function (event, handler) {
      var i = handlers.length;
      while (i--) {
        if (handlers[i].event === event && handlers[i].handler === handler) {
          handlers.splice(i, 1);
          event.unsubscribe(handler);
          return;
        }
      }

      return this; // allow chaining
    };

    this.unsubscribeAll = function () {
      var i = handlers.length;
      while (i--) {
        handlers[i].event.unsubscribe(handlers[i].handler);
      }
      handlers = [];

      return this; // allow chaining
    };
  }

  /***
   * A structure containing a range of cells.
   * @class Range
   * @constructor
   * @param fromRow {Integer} Starting row.
   * @param fromCell {Integer} Starting cell.
   * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
   * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
   */
  const Range = (function (
    this: IRange,
    fromRow: number,
    fromCell: number,
    toRow: number,
    toCell: number
  ): void {
    if (toRow === undefined && toCell === undefined) {
      toRow = fromRow;
      toCell = fromCell;
    }

    /***
     * @property fromRow
     * @type {Integer}
     */
    this.fromRow = Math.min(fromRow, toRow);

    /***
     * @property fromCell
     * @type {Integer}
     */
    this.fromCell = Math.min(fromCell, toCell);

    /***
     * @property toRow
     * @type {Integer}
     */
    this.toRow = Math.max(fromRow, toRow);

    /***
     * @property toCell
     * @type {Integer}
     */
    this.toCell = Math.max(fromCell, toCell);

    /***
     * Returns whether a range represents a single row.
     * @method isSingleRow
     * @return {Boolean}
     */
    this.isSingleRow = function (): boolean {
      return this.fromRow == this.toRow;
    };

    /***
     * Returns whether a range represents a single cell.
     * @method isSingleCell
     * @return {Boolean}
     */
    this.isSingleCell = function (): boolean {
      return this.fromRow == this.toRow && this.fromCell == this.toCell;
    };

    /***
     * Returns whether a range contains a given cell.
     * @method contains
     * @param row {Integer}
     * @param cell {Integer}
     * @return {Boolean} boolean
     */
    this.contains = function (row: number, cell: number): boolean {
      return (
        row >= this.fromRow &&
        row <= this.toRow &&
        cell >= this.fromCell &&
        cell <= this.toCell
      );
    };

    /***
     * Returns a readable representation of a range.
     * @method toString
     * @return {String} string
     */
    this.toString = function (): string {
      if (this.isSingleCell()) {
        return "(" + this.fromRow + ":" + this.fromCell + ")";
      } else {
        return (
          "(" +
          this.fromRow +
          ":" +
          this.fromCell +
          " - " +
          this.toRow +
          ":" +
          this.toCell +
          ")"
        );
      }
    };
  } as any) as { new (): IRange };

  /***
   * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
   * @class NonDataItem
   * @constructor
   */
  const NonDataItem = (function (this: INonDataItem): void {
    this.__nonDataRow = true;
  } as any) as { new (): INonDataItem };

  /***
   * Information about a group of rows.
   * @class Group
   * @extends Slick.NonDataItem
   * @constructor
   */
  const Group = (function (this: IGroup) {
    this.__group = true;

    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    this.level = 0;

    /***
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    this.count = 0;

    /***
     * Grouping value.
     * @property value
     * @type {Object}
     */
    this.value = null;

    /***
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    this.title = null;

    /***
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    this.collapsed = false;

    /***
     * Whether a group selection checkbox is checked.
     * @property selectChecked
     * @type {Boolean}
     */
    this.selectChecked = false;

    /***
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    this.totals = null;

    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    this.rows = [];

    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    this.groups = null;

    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    this.groupingKey = null;
  } as any) as { new (): IGroup };

  Group.prototype = new NonDataItem();

  /***
   * Compares two Group instances.
   * @method equals
   * @return {Boolean} boolean
   * @param group {IGroup} Group instance to compare to.
   */
  Group.prototype.equals = function (this: IGroup, group: IGroup): boolean {
    return (
      this.value === group.value &&
      this.count === group.count &&
      this.collapsed === group.collapsed &&
      this.title === group.title
    );
  };

  /***
   * Information about group totals.
   * An instance of GroupTotals will be created for each totals row and passed to the aggregators
   * so that they can store arbitrary data in it.  That data can later be accessed by group totals
   * formatters during the display.
   * @class GroupTotals
   * @extends Slick.NonDataItem
   * @constructor
   */
  const GroupTotals = (function (this: IGroupTotals) {
    this.__groupTotals = true;

    /***
     * Parent Group.
     * @param group
     * @type {Group}
     */
    this.group = null;

    /***
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    this.initialized = false;
  } as any) as { new (): IGroupTotals };

  GroupTotals.prototype = new NonDataItem();

  /***
   * A locking helper to track the active edit controller and ensure that only a single controller
   * can be active at a time.  This prevents a whole class of state and validation synchronization
   * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
   * and attempt a commit or cancel before proceeding.
   * @class EditorLock
   * @constructor
   */
  const EditorLock = (function (this: IEditorLock) {
    var activeEditController: IEditController | null;

    /***
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * @method isActive
     * @param editController
     * @return {Boolean}
     */
    this.isActive = function (editController: IEditController): boolean {
      return editController
        ? activeEditController === editController
        : activeEditController !== null;
    };

    /***
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active, and exception will be throw new Error(.
     * @method activate
     * @param editController edit controller acquiring the lock
     */
    this.activate = function (editController: IEditController) {
      if (editController === activeEditController) {
        // already activated?
        return;
      }
      if (activeEditController !== null) {
        throw new Error(
          "SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController"
        );
      }
      if (!editController.commitCurrentEdit) {
        throw new Error(
          "SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()"
        );
      }
      if (!editController.cancelCurrentEdit) {
        throw new Error(
          "SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()"
        );
      }
      activeEditController = editController;
    };

    /***
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be throw new Error(.
     * @method deactivate
     * @param editController edit controller releasing the lock
     */
    this.deactivate = function (editController: IEditController) {
      if (activeEditController !== editController) {
        throw new Error(
          "SlickGrid.EditorLock.deactivate: specified editController is not the currently active one"
        );
      }
      activeEditController = null;
    };

    /***
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * @method commitCurrentEdit
     * @return {Boolean}
     */
    this.commitCurrentEdit = function (): boolean {
      return activeEditController
        ? activeEditController.commitCurrentEdit()
        : true;
    };

    /***
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully cancelled.  If no edit controller is
     * active, returns true.
     * @method cancelCurrentEdit
     * @return {Boolean}
     */
    this.cancelCurrentEdit = function cancelCurrentEdit(): boolean {
      return activeEditController
        ? activeEditController.cancelCurrentEdit()
        : true;
    };
  } as any) as { new (): IEditorLock };
  /**
   *
   * @param {Array} treeColumns Array com levels of columns
   * @returns {{hasDepth: 'hasDepth', getTreeColumns: 'getTreeColumns', extractColumns: 'extractColumns', getDepth: 'getDepth', getColumnsInDepth: 'getColumnsInDepth', getColumnsInGroup: 'getColumnsInGroup', visibleColumns: 'visibleColumns', filter: 'filter', reOrder: reOrder}}
   * @constructor
   */
  function TreeColumns(this: ITreeColumns, treeColumns: TColumns[]): void {
    var columnsById: TColumns = {};

    function init() {
      mapToId(treeColumns);
    }

    function mapToId(columns: TColumns[]) {
      columns.forEach(function (column) {
        columnsById[column.id] = column;

        if (column.columns) mapToId(column.columns);
      });
    }

    function filter(node: TColumns[], condition: Function) {
      return node.filter(function (column: TColumns) {
        var valid = condition.call(column);

        if (valid && column.columns)
          column.columns = filter(column.columns, condition);

        return valid && (!column.columns || column.columns.length);
      });
    }

    function sort(columns: TColumns, grid: SlickGrid) {
      columns
        .sort(function (a: { id: string }, b: { id: string }) {
          var indexA = getOrDefault(grid.getColumnIndex(a.id)),
            indexB = getOrDefault(grid.getColumnIndex(b.id));

          return indexA - indexB;
        })
        .forEach(function (column: TColumns) {
          if (column.columns) sort(column.columns, grid);
        });
    }

    function getOrDefault<T>(value: T) {
      return typeof value === "undefined" ? -1 : value;
    }

    function getDepth(node: TColumns): number {
      if (node.length) for (var i in node) return getDepth(node[i]);
      else if (node.columns) return 1 + getDepth(node.columns);
      return 1;
    }

    function getColumnsInDepth(
      node: Record<string, any>,
      depth: number,
      current?: number
    ) {
      var columns: TColumns[] = [];
      current = current || 0;

      if (depth == current) {
        if (node.length)
          node.forEach(function (n: Record<string, any>) {
            if (n.columns)
              n.extractColumns = function () {
                return extractColumns(n);
              };
          });

        return node;
      } else
        for (var i in node)
          if (node[i].columns) {
            columns = columns.concat(
              getColumnsInDepth(node[i].columns, depth, current + 1)
            );
          }

      return columns;
    }

    function extractColumns(node: Record<string, any>) {
      var result: TColumns[] = [];

      if (node.hasOwnProperty("length")) {
        for (var i = 0; i < node.length; i++)
          result = result.concat(extractColumns(node[i]));
      } else {
        if (node.hasOwnProperty("columns"))
          result = result.concat(extractColumns(node.columns));
        else return node;
      }

      return result;
    }

    function cloneTreeColumns() {
      return $.extend(true, [], treeColumns);
    }

    init();

    this.hasDepth = function () {
      for (var i in treeColumns)
        if (treeColumns[i].hasOwnProperty("columns")) return true;

      return false;
    };

    this.getTreeColumns = function () {
      return treeColumns;
    };

    this.extractColumns = function () {
      return this.hasDepth() ? extractColumns(treeColumns) : treeColumns;
    };

    this.getDepth = function () {
      return getDepth(treeColumns);
    };

    this.getColumnsInDepth = function (depth) {
      return getColumnsInDepth(treeColumns, depth);
    };

    this.getColumnsInGroup = function (groups) {
      return extractColumns(groups);
    };

    this.visibleColumns = function () {
      return filter(cloneTreeColumns(), function (this: { visible: boolean }) {
        return this.visible;
      });
    };

    this.filter = function (condition: Function) {
      return filter(cloneTreeColumns(), condition);
    };

    this.reOrder = function (grid) {
      return sort(treeColumns, grid);
    };

    this.getById = function (id) {
      return columnsById[id];
    };

    this.getInIds = function (ids) {
      return ids.map(function (id) {
        return columnsById[id];
      });
    };
  }

  /***
   * Polyfill for Map to support old browsers but
   * benefit of the Map speed in modern browsers.
   * @class Map
   * @constructor
   */
  const Map = (function <K extends keyof V, V>(this: IMap<K, V>) {
    var data: Record<K, V>;

    /***
     * Gets the item with the given key from the map or undefined if
     * the map does not contain the item.
     * @method get
     * @param key The key of the item in the map.
     */
    this.get = function (key: K) {
      return data[key];
    };

    /***
     * Adds or updates the item with the given key in the map.
     * @method set
     * @param key The key of the item in the map.
     * @param value The value to insert into the map of the item in the map.
     */
    this.set = function (key: K, value: V) {
      data[key] = value;
    };

    /***
     * Gets a value indicating whether the given key is present in the map.
     * @method has
     * @param key The key of the item in the map.
     * @return {Boolean}
     */
    this.has = function (key: K): boolean {
      return key in data;
    };

    /***
     * Removes the item with the given key from the map.
     * @method delete
     * @param key The key of the item in the map.
     */
    this.delete = function (key: K) {
      delete data[key];
    };
  } as any) as MapConstructor;

  var MapPolly = "Map" in window ? window.Map : Map;

  // exports
  return {
    Slick: {
      Event: Event,
      EventData: EventData,
      EventHandler: EventHandler,
      Range: Range,
      Map: MapPolly,
      NonDataRow: NonDataItem,
      Group: Group,
      GroupTotals: GroupTotals,
      EditorLock: EditorLock,

      /***
       * A global singleton editor lock.
       * @class GlobalEditorLock
       * @static
       * @constructor
       */
      GlobalEditorLock: new EditorLock(),
      TreeColumns: TreeColumns,

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
        A: 65,
      },
      preClickClassName: "slick-edit-preclick",

      GridAutosizeColsMode: {
        None: "NOA",
        LegacyOff: "LOF",
        LegacyForceFit: "LFF",
        IgnoreViewport: "IGV",
        FitColsToViewport: "FCV",
        FitViewportToCols: "FVC",
      },

      ColAutosizeMode: {
        Locked: "LCK",
        Guide: "GUI",
        Content: "CON",
        ContentIntelligent: "CTI",
      },

      RowSelectionMode: {
        FirstRow: "FS1",
        FirstNRows: "FSN",
        AllRows: "ALL",
        LastRow: "LS1",
      },

      ValueFilterMode: {
        None: "NONE",
        DeDuplicate: "DEDP",
        GetGreatestAndSub: "GR8T",
        GetLongestTextAndSub: "LNSB",
        GetLongestText: "LNSC",
      },

      WidthEvalMode: {
        CanvasTextSize: "CANV",
        HTML: "HTML",
      },
    },
  };
})();

type TEventData = Event & JQuery.Event;

interface IEvent {
  subscribe: (fn: () => IEventHandler) => void;
  unsubscribe: (fn: () => void) => void;
  notify: <T>(args: object, e: TEventData, scope: ThisType<T>) => void;
}
interface IEventHandler {
  subscribe: (event: any, handler: any) => IEventHandler;
  unsubscribe: (event: any, handler: any) => void | IEventHandler;
  unsubscribeAll: (event: any, handler: any) => IEventHandler;
}
type THandler = {
  event: IEvent;
  handler: () => void;
};
interface IRange {
  fromRow: number;
  fromCell: number;
  toRow: number;
  toCell: number;
  isSingleRow: () => boolean;
  isSingleCell: () => boolean;
  contains: (row: number, cell: number) => boolean;
  toString: () => string;
}
interface IGroup {
  __group: boolean;
  level: number;
  count: number;
  value: object | null;
  title: string | null;
  collapsed: boolean;
  selectChecked: boolean;
  totals: IGroupTotals | null;
  rows: [];
  groups: IGroup[] | null;
  groupingKey: object | null;
}

interface INonDataItem {
  __nonDataRow: boolean;
  equals: (this: IGroup, group: IGroup) => boolean;
}
interface IGroupTotals {
  __groupTotals: boolean;
  group: IGroup | null;
  initialized: boolean;
}
interface IEditorLock {
  isActive: (editController: IEditController) => boolean;
  activate: (editController: IEditController) => void | undefined;
  deactivate: (editController: IEditController) => void | undefined;
  commitCurrentEdit: () => boolean;
  cancelCurrentEdit: () => boolean;
}
interface IEditController extends IEditorLock {}
interface IMap<K, V> {
  clear(): void;
  delete(key: K): void;
  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): void; //? Return type should probably be contextual "this"
  readonly size: number;
}
interface MapConstructor {
  new (): Map<any, any>;
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<any, any>;
}
//TODO What is the structure of the Node and Columns types
type TColumns = Record<string, any>; //? Find Correct structure
interface ITreeColumns {
  init: () => void;
  mapToId: (columns: []) => void;
  filter: (condition: Function) => TColumns[];
  sort: (columns: TColumns[], grid: SlickGrid) => void;
  hasDepth: () => boolean;
  getOrDefault: <T>(value: T) => T | -1;
  getDepth: (node: {}) => number;
  getTreeColumns: () => TColumns;
  extractColumns: () => TColumns;
  getColumnsInDepth: (depth: number) => TColumns;
  getColumnsInGroup: (groups: Record<string, any>) => any;
  visibleColumns: () => any;
  getById: (id: string) => any;
  getInIds: (ids: string[]) => any;
  reOrder: (grid: SlickGrid) => any;
}
module Core {
  /***
   * An event object for passing data to event handlers and letting them control propagation.
   * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
   * @class EventData
   * @constructor
   */
  const EventData = class {
    stopPropagation: () => void;
    stopImmediatePropagation: () => void;
    isPropagationStopped: () => boolean;
    isImmediatePropagationStopped: () => boolean;

    public constructor() {
      var isPropagationStopped = false;
      var isImmediatePropagationStopped = false;

      /***
       * Stops event from propagating up the DOM tree.
       * @method stopPropagation
       */
      this.stopPropagation = function () {
        isPropagationStopped = true;
      };

      /***
       * Prevents the rest of the handlers from being executed.
       * @method stopImmediatePropagation
       */
      this.stopImmediatePropagation = function () {
        isImmediatePropagationStopped = true;
      };

      /***
       * Returns whether stopPropagation was called on this event object.
       * @method isPropagationStopped
       * @return {Boolean}
       */
      this.isPropagationStopped = function (): boolean {
        return isPropagationStopped;
      };

      /***
       * Returns whether stopImmediatePropagation was called on this event object.\
       * @method isImmediatePropagationStopped
       * @return {Boolean}
       */
      this.isImmediatePropagationStopped = function (): boolean {
        return isImmediatePropagationStopped;
      };
    }
  };

  /***
   * A simple publisher-subscriber implementation.
   * @class Event
   * @constructor
   */
  const Event = (function (this: IEvent): void {
    var handlers: typeof EventHandler[] = [];

    /***
     * Adds an event handler to be called when the event is fired.
     * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
     * object the event was fired with.<p>
     * @method subscribe
     * @param fn Event handler.
     */
    this.subscribe = function (fn): void {
      handlers.push(fn);
    };

    /***
     * Removes an event handler added with <code>subscribe(fn)</code>.
     * @method unsubscribe
     * @param fn {Function} Event handler to be removed.
     */
    this.unsubscribe = function (fn: Function): void {
      for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === fn) {
          handlers.splice(i, 1);
        }
      }
    };

    /***
     * Fires an event notifying all subscribers.
     * @method notify
     * @param args  Additional data object to be passed to all handlers.
     * @param e {EventData}
     *      Optional.
     *      An <code>EventData</code> object to be passed to all handlers.
     *      For DOM events, an existing W3C/jQuery event object can be passed in.
     * @param scope
     *      Optional.
     *      The scope ("this") within which the handler will be executed.
     *      If not specified, the scope will be set to the <code>Event</code> instance.
     */
    this.notify = function <T>(
      args: {},
      e: TEventData,
      scope: ThisParameterType<T | TEventData>
    ): void {
      e = e || new EventData();
      scope = scope || this;

      var returnValue;
      for (
        var i = 0;
        i < handlers.length &&
        !(e.isPropagationStopped() || e.isImmediatePropagationStopped());
        i++
      ) {
        // @ts-ignore 3 arguments passed 1 expected
        returnValue = handlers[i].call(scope, e, args); //? How is this working -- JACOB
      }

      return returnValue;
    };
  } as any) as { new (): IEvent };

  function EventHandler(this: IEventHandler) {
    var handlers: THandler[] = [];

    this.subscribe = function (event, handler) {
      handlers.push({
        event: event,
        handler: handler,
      });
      event.subscribe(handler);

      return this; // allow chaining
    };

    this.unsubscribe = function (event, handler) {
      var i = handlers.length;
      while (i--) {
        if (handlers[i].event === event && handlers[i].handler === handler) {
          handlers.splice(i, 1);
          event.unsubscribe(handler);
          return;
        }
      }

      return this; // allow chaining
    };

    this.unsubscribeAll = function () {
      var i = handlers.length;
      while (i--) {
        handlers[i].event.unsubscribe(handlers[i].handler);
      }
      handlers = [];

      return this; // allow chaining
    };
  }

  /***
   * A structure containing a range of cells.
   * @class Range
   * @constructor
   * @param fromRow {Integer} Starting row.
   * @param fromCell {Integer} Starting cell.
   * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
   * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
   */
  const Range = (function (
    this: IRange,
    fromRow: number,
    fromCell: number,
    toRow: number,
    toCell: number
  ): void {
    if (toRow === undefined && toCell === undefined) {
      toRow = fromRow;
      toCell = fromCell;
    }

    /***
     * @property fromRow
     * @type {Integer}
     */
    this.fromRow = Math.min(fromRow, toRow);

    /***
     * @property fromCell
     * @type {Integer}
     */
    this.fromCell = Math.min(fromCell, toCell);

    /***
     * @property toRow
     * @type {Integer}
     */
    this.toRow = Math.max(fromRow, toRow);

    /***
     * @property toCell
     * @type {Integer}
     */
    this.toCell = Math.max(fromCell, toCell);

    /***
     * Returns whether a range represents a single row.
     * @method isSingleRow
     * @return {Boolean}
     */
    this.isSingleRow = function (): boolean {
      return this.fromRow == this.toRow;
    };

    /***
     * Returns whether a range represents a single cell.
     * @method isSingleCell
     * @return {Boolean}
     */
    this.isSingleCell = function (): boolean {
      return this.fromRow == this.toRow && this.fromCell == this.toCell;
    };

    /***
     * Returns whether a range contains a given cell.
     * @method contains
     * @param row {Integer}
     * @param cell {Integer}
     * @return {Boolean} boolean
     */
    this.contains = function (row: number, cell: number): boolean {
      return (
        row >= this.fromRow &&
        row <= this.toRow &&
        cell >= this.fromCell &&
        cell <= this.toCell
      );
    };

    /***
     * Returns a readable representation of a range.
     * @method toString
     * @return {String} string
     */
    this.toString = function (): string {
      if (this.isSingleCell()) {
        return "(" + this.fromRow + ":" + this.fromCell + ")";
      } else {
        return (
          "(" +
          this.fromRow +
          ":" +
          this.fromCell +
          " - " +
          this.toRow +
          ":" +
          this.toCell +
          ")"
        );
      }
    };
  } as any) as { new (): IRange };

  /***
   * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
   * @class NonDataItem
   * @constructor
   */
  const NonDataItem = (function (this: INonDataItem): void {
    this.__nonDataRow = true;
  } as any) as { new (): INonDataItem };

  /***
   * Information about a group of rows.
   * @class Group
   * @extends Slick.NonDataItem
   * @constructor
   */
  const Group = (function (this: IGroup) {
    this.__group = true;

    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    this.level = 0;

    /***
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    this.count = 0;

    /***
     * Grouping value.
     * @property value
     * @type {Object}
     */
    this.value = null;

    /***
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    this.title = null;

    /***
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    this.collapsed = false;

    /***
     * Whether a group selection checkbox is checked.
     * @property selectChecked
     * @type {Boolean}
     */
    this.selectChecked = false;

    /***
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    this.totals = null;

    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    this.rows = [];

    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    this.groups = null;

    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    this.groupingKey = null;
  } as any) as { new (): IGroup };

  Group.prototype = new NonDataItem();

  /***
   * Compares two Group instances.
   * @method equals
   * @return {Boolean} boolean
   * @param group {IGroup} Group instance to compare to.
   */
  Group.prototype.equals = function (this: IGroup, group: IGroup): boolean {
    return (
      this.value === group.value &&
      this.count === group.count &&
      this.collapsed === group.collapsed &&
      this.title === group.title
    );
  };

  /***
   * Information about group totals.
   * An instance of GroupTotals will be created for each totals row and passed to the aggregators
   * so that they can store arbitrary data in it.  That data can later be accessed by group totals
   * formatters during the display.
   * @class GroupTotals
   * @extends Slick.NonDataItem
   * @constructor
   */
  const GroupTotals = (function (this: IGroupTotals) {
    this.__groupTotals = true;

    /***
     * Parent Group.
     * @param group
     * @type {Group}
     */
    this.group = null;

    /***
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    this.initialized = false;
  } as any) as { new (): IGroupTotals };

  GroupTotals.prototype = new NonDataItem(); //? Is this being used -- JACOB

  /***
   * A locking helper to track the active edit controller and ensure that only a single controller
   * can be active at a time.  This prevents a whole class of state and validation synchronization
   * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
   * and attempt a commit or cancel before proceeding.
   * @class EditorLock
   * @constructor
   */
  const EditorLock = (function (this: IEditorLock) {
    var activeEditController: IEditController | null;

    /***
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * @method isActive
     * @param editController
     * @return {Boolean}
     */
    this.isActive = function (editController: IEditController): boolean {
      return editController
        ? activeEditController === editController
        : activeEditController !== null;
    };

    /***
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active, and exception will be throw new Error(.
     * @method activate
     * @param editController edit controller acquiring the lock
     */
    this.activate = function (editController: IEditController) {
      if (editController === activeEditController) {
        // already activated?
        return;
      }
      if (activeEditController !== null) {
        throw new Error(
          "SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController"
        );
      }
      if (!editController.commitCurrentEdit) {
        throw new Error(
          "SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()"
        );
      }
      if (!editController.cancelCurrentEdit) {
        throw new Error(
          "SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()"
        );
      }
      activeEditController = editController;
    };

    /***
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be throw new Error(.
     * @method deactivate
     * @param editController edit controller releasing the lock
     */
    this.deactivate = function (editController: IEditController) {
      if (activeEditController !== editController) {
        throw new Error(
          "SlickGrid.EditorLock.deactivate: specified editController is not the currently active one"
        );
      }
      activeEditController = null;
    };

    /***
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * @method commitCurrentEdit
     * @return {Boolean}
     */
    this.commitCurrentEdit = function (): boolean {
      return activeEditController
        ? activeEditController.commitCurrentEdit()
        : true;
    };

    /***
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully cancelled.  If no edit controller is
     * active, returns true.
     * @method cancelCurrentEdit
     * @return {Boolean}
     */
    this.cancelCurrentEdit = function cancelCurrentEdit(): boolean {
      return activeEditController
        ? activeEditController.cancelCurrentEdit()
        : true;
    };
  } as any) as { new (): IEditorLock };

  /**
   *
   * @param {Array} treeColumns Array com levels of columns
   * @returns {{hasDepth: 'hasDepth', getTreeColumns: 'getTreeColumns', extractColumns: 'extractColumns', getDepth: 'getDepth', getColumnsInDepth: 'getColumnsInDepth', getColumnsInGroup: 'getColumnsInGroup', visibleColumns: 'visibleColumns', filter: 'filter', reOrder: reOrder}}
   * @constructor
   */
  function TreeColumns(this: ITreeColumns, treeColumns: TColumns[]): void {
    var columnsById: TColumns = {};

    function init() {
      mapToId(treeColumns);
    }

    function mapToId(columns: TColumns[]) {
      columns.forEach(function (column) {
        columnsById[column.id] = column;

        if (column.columns) mapToId(column.columns);
      });
    }

    function filter(node: TColumns[], condition: Function) {
      return node.filter(function (column: TColumns) {
        var valid = condition.call(column);

        if (valid && column.columns)
          column.columns = filter(column.columns, condition);

        return valid && (!column.columns || column.columns.length);
      });
    }

    function sort(columns: TColumns, grid: SlickGrid) {
      columns
        .sort(function (a: { id: string }, b: { id: string }) {
          var indexA = getOrDefault(grid.getColumnIndex(a.id)),
            indexB = getOrDefault(grid.getColumnIndex(b.id));

          return indexA - indexB;
        })
        .forEach(function (column: TColumns) {
          if (column.columns) sort(column.columns, grid);
        });
    }

    function getOrDefault<T>(value: T) {
      return typeof value === "undefined" ? -1 : value;
    }

    function getDepth(node: TColumns): number {
      if (node.length) for (var i in node) return getDepth(node[i]);
      else if (node.columns) return 1 + getDepth(node.columns);
      return 1;
    }

    function getColumnsInDepth(
      node: Record<string, any>,
      depth: number,
      current?: number
    ) {
      var columns: TColumns[] = [];
      current = current || 0;

      if (depth == current) {
        if (node.length)
          node.forEach(function (n: Record<string, any>) {
            if (n.columns)
              n.extractColumns = function () {
                return extractColumns(n);
              };
          });

        return node;
      } else
        for (var i in node)
          if (node[i].columns) {
            columns = columns.concat(
              getColumnsInDepth(node[i].columns, depth, current + 1)
            );
          }

      return columns;
    }

    function extractColumns(node: Record<string, any>) {
      var result: TColumns[] = [];

      if (node.hasOwnProperty("length")) {
        for (var i = 0; i < node.length; i++)
          result = result.concat(extractColumns(node[i]));
      } else {
        if (node.hasOwnProperty("columns"))
          result = result.concat(extractColumns(node.columns));
        else return node;
      }

      return result;
    }

    function cloneTreeColumns() {
      return $.extend(true, [], treeColumns);
    }

    init();

    this.hasDepth = function () {
      for (var i in treeColumns)
        if (treeColumns[i].hasOwnProperty("columns")) return true;

      return false;
    };

    this.getTreeColumns = function () {
      return treeColumns;
    };

    this.extractColumns = function () {
      return this.hasDepth() ? extractColumns(treeColumns) : treeColumns;
    };

    this.getDepth = function () {
      return getDepth(treeColumns);
    };

    this.getColumnsInDepth = function (depth) {
      return getColumnsInDepth(treeColumns, depth);
    };

    this.getColumnsInGroup = function (groups) {
      return extractColumns(groups);
    };

    this.visibleColumns = function () {
      return filter(cloneTreeColumns(), function (this: { visible: boolean }) {
        return this.visible;
      });
    };

    this.filter = function (condition: Function) {
      return filter(cloneTreeColumns(), condition);
    };

    this.reOrder = function (grid) {
      return sort(treeColumns, grid);
    };

    this.getById = function (id) {
      return columnsById[id];
    };

    this.getInIds = function (ids) {
      return ids.map(function (id) {
        return columnsById[id];
      });
    };
  }

  /***
   * Polyfill for Map to support old browsers but
   * benefit of the Map speed in modern browsers.
   * @class Map
   * @constructor
   */
  const Map = (function <K extends keyof V, V>(this: IMap<K, V>) {
    var data: Record<K, V>;

    /***
     * Gets the item with the given key from the map or undefined if
     * the map does not contain the item.
     * @method get
     * @param key The key of the item in the map.
     */
    this.get = function (key: K) {
      return data[key];
    };

    /***
     * Adds or updates the item with the given key in the map.
     * @method set
     * @param key The key of the item in the map.
     * @param value The value to insert into the map of the item in the map.
     */
    this.set = function (key: K, value: V) {
      data[key] = value;
    };

    /***
     * Gets a value indicating whether the given key is present in the map.
     * @method has
     * @param key The key of the item in the map.
     * @return {Boolean}
     */
    this.has = function (key: K): boolean {
      return key in data;
    };

    /***
     * Removes the item with the given key from the map.
     * @method delete
     * @param key The key of the item in the map.
     */
    this.delete = function (key: K) {
      delete data[key];
    };
  } as any) as MapConstructor;

  var MapPolly = "Map" in window ? window.Map : Map;

   export type Slick = {
      Event: Event,
      EventData: typeof  EventData,
      EventHandler: typeof EventHandler,
      Range: Range,
      Map: typeof  MapPolly,
      NonDataRow: typeof NonDataItem,
      Group: typeof Group,
      GroupTotals: typeof GroupTotals,
      EditorLock: typeof EditorLock,

      /***
       * A global singleton editor lock.
       * @class GlobalEditorLock
       * @static
       * @constructor
       */
      GlobalEditorLock: typeof EditorLock,
      TreeColumns: typeof TreeColumns,

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
        A: 65,
      },
      preClickClassName: "slick-edit-preclick",

      GridAutosizeColsMode: {
        None: "NOA",
        LegacyOff: "LOF",
        LegacyForceFit: "LFF",
        IgnoreViewport: "IGV",
        FitColsToViewport: "FCV",
        FitViewportToCols: "FVC",
      },

      ColAutosizeMode: {
        Locked: "LCK",
        Guide: "GUI",
        Content: "CON",
        ContentIntelligent: "CTI",
      },

      RowSelectionMode: {
        FirstRow: "FS1",
        FirstNRows: "FSN",
        AllRows: "ALL",
        LastRow: "LS1",
      },

      ValueFilterMode: {
        None: "NONE",
        DeDuplicate: "DEDP",
        GetGreatestAndSub: "GR8T",
        GetLongestTextAndSub: "LNSB",
        GetLongestText: "LNSC",
      },

      WidthEvalMode: {
        CanvasTextSize: "CANV",
        HTML: "HTML",
      },
    }
}
