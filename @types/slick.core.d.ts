/***
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */
/// <reference types="jquery" />
/// <reference types="cypress" />
declare type TEventData = Event & JQuery.Event;
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
declare type THandler = {
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
interface IEditController extends IEditorLock {
}
interface IMap<K, V> {
    clear(): void;
    delete(key: K): void;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): void;
    readonly size: number;
}
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    readonly prototype: Map<any, any>;
}
declare type TColumns = Record<string, any>;
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
declare function Core(): {
    Slick: {
        Event: new () => IEvent;
        EventData: {
            new (): {
                stopPropagation: () => void;
                stopImmediatePropagation: () => void;
                isPropagationStopped: () => boolean;
                isImmediatePropagationStopped: () => boolean;
            };
        };
        EventHandler: (this: IEventHandler) => void;
        Range: new () => IRange;
        Map: MapConstructor;
        NonDataRow: new () => INonDataItem;
        Group: new () => IGroup;
        GroupTotals: new () => IGroupTotals;
        EditorLock: new () => IEditorLock;
        /***
         * A global singleton editor lock.
         * @class GlobalEditorLock
         * @static
         * @constructor
         */
        GlobalEditorLock: IEditorLock;
        TreeColumns: (this: ITreeColumns, treeColumns: TColumns[]) => void;
        keyCode: {
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
        };
        preClickClassName: string;
        GridAutosizeColsMode: {
            None: string;
            LegacyOff: string;
            LegacyForceFit: string;
            IgnoreViewport: string;
            FitColsToViewport: string;
            FitViewportToCols: string;
        };
        ColAutosizeMode: {
            Locked: string;
            Guide: string;
            Content: string;
            ContentIntelligent: string;
        };
        RowSelectionMode: {
            FirstRow: string;
            FirstNRows: string;
            AllRows: string;
            LastRow: string;
        };
        ValueFilterMode: {
            None: string;
            DeDuplicate: string;
            GetGreatestAndSub: string;
            GetLongestTextAndSub: string;
            GetLongestText: string;
        };
        WidthEvalMode: {
            CanvasTextSize: string;
            HTML: string;
        };
    };
};
