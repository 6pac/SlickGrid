import { SlickEvent as SlickEvent_ } from './slick.core.js';
export declare class SlickRemoteModelYahoo {
    protected PAGESIZE: number;
    protected data: any;
    protected h_request?: number;
    protected req: any;
    protected onDataLoading: SlickEvent_<any>;
    protected onDataLoaded: SlickEvent_<any>;
    constructor();
    init(): void;
    isDataLoaded(from: number, to: number): boolean;
    clear(): void;
    ensureData(from: number, to: number): void;
    onError(fromPage: number, toPage: number): void;
    onSuccess(json: any, recStart: number): void;
    reloadData(from: number, to: number): void;
}
//# sourceMappingURL=slick.remotemodel-yahoo.d.ts.map