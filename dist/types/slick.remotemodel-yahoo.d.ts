/***
 * A sample AJAX data store implementation.
 * Right now, it's hooked up to load Hackernews stories, but can
 * easily be extended to support any JSONP-compatible backend that accepts paging parameters.
 */
export declare class SlickRemoteModelYahoo {
    protected PAGESIZE: number;
    protected data: any;
    protected h_request?: number;
    protected req: any;
    protected onDataLoading: import("./slick.core").SlickEvent<any>;
    protected onDataLoaded: import("./slick.core").SlickEvent<any>;
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