import type { ColumnSort } from './models/index.js';
/***
 * A sample AJAX data store implementation.
 * Right now, it's hooked up to load search results from Octopart, but can
 * easily be extended to support any JSONP-compatible backend that accepts paging parameters.
 */
export declare class SlickRemoteModel {
    protected PAGESIZE: number;
    protected data: any;
    protected searchstr: string;
    protected sortcol: ColumnSort | null;
    protected sortdir: number;
    protected h_request?: number;
    protected req: any;
    onDataLoading: import("./slick.core.js").SlickEvent<any>;
    onDataLoaded: import("./slick.core.js").SlickEvent<any>;
    constructor();
    init(): void;
    isDataLoaded(from: number, to: number): boolean;
    clear(): void;
    ensureData(from: number, to: number): void;
    protected onError(fromPage: number | string, toPage: number | string): void;
    protected onSuccess(resp: any): void;
    reloadData(from: number, to: number): void;
    setSort(column: ColumnSort, dir: number): void;
    setSearch(str: string): void;
}
//# sourceMappingURL=slick.remotemodel.d.ts.map