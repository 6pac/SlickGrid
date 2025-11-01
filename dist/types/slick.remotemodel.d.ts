import type { ColumnSort } from './models/index.js';
import { SlickEvent as SlickEvent_ } from './slick.core.js';
export declare class SlickRemoteModel {
    protected PAGESIZE: number;
    protected data: any;
    protected searchstr: string;
    protected sortcol: ColumnSort | null;
    protected sortdir: number;
    protected h_request?: number;
    protected req: any;
    onDataLoading: SlickEvent_<any>;
    onDataLoaded: SlickEvent_<any>;
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