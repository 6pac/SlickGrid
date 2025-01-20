import { SlickEvent as SlickEvent_ } from '../slick.core.js';
import type { Column, ColumnSort, SlickPlugin } from '../models/index.js';
import type { SlickGrid } from '../slick.grid.js';
export interface SlickStateOption {
    /** optional grid state clientId */
    cid: string;
    /** default columns when loadnig the grid */
    defaultColumns: Column[];
    /** local storage key prefix */
    key_prefix: string;
    /** should we scroll the grid into view? */
    scrollRowIntoView: boolean;
    /** local storage wrapper */
    storage: LocalStorageWrapper;
}
export interface CurrentState {
    columns: Array<{
        id: string | number;
        width: number | undefined;
    }>;
    sortcols: ColumnSort[];
    userData: any;
    viewport: {
        top: number;
        bottom: number;
        leftPx: number;
        rightPx: number;
    };
}
declare class LocalStorageWrapper {
    protected localStorage: Storage;
    constructor();
    get<T = any>(key: string): Promise<T>;
    set(key: string, obj: any): void;
}
export declare class SlickState implements SlickPlugin {
    pluginName: "State";
    onStateChanged: SlickEvent_<CurrentState>;
    protected _grid: SlickGrid;
    protected _cid: string;
    protected _store: LocalStorageWrapper;
    protected _options: SlickStateOption;
    protected _state?: CurrentState;
    protected _userData: {
        state: null;
        current: null;
    };
    constructor(options: Partial<SlickStateOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    save(): void;
    restore(): Promise<unknown>;
    /**
     * allows users to add their own data to the grid state
     * this function does not trigger the save() function, so the actual act of writing the state happens in save()
     * therefore, it's necessary to call save() function after setting user-data
     *
     * @param data
     * @return {State}
     */
    setUserData(data: any): this;
    /**
     *
     * @internal
     * @param data
     * @return {State}
     */
    setUserDataFromState(data: any): this;
    /**
     * returns current value of user-data
     * @return {Object}
     */
    getUserData(): null;
    /**
     * returns user-data found in saved state
     *
     * @return {Object}
     */
    getStateUserData(): null;
    /**
     * Sets user-data to the value read from state
     * @return {State}
     */
    resetUserData(): this;
    getColumns(): {
        id: string | number;
        width: number | undefined;
    }[];
    getSortColumns(): ColumnSort[];
    reset(): void;
}
export {};
//# sourceMappingURL=slick.state.d.ts.map