import type { PagingInfo } from '../models/index.js';
import { BindingEventService as BindingEventService_ } from '../slick.core.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
export interface GridPagerOption {
    showAllText: string;
    showPageText: string;
    showCountText: string;
    showCount: boolean;
    pagingOptions: Array<{
        data: number;
        name: string;
        ariaLabel: string;
    }>;
    showPageSizes: boolean;
}
export declare class SlickGridPager {
    protected readonly dataView: SlickDataView;
    protected readonly grid: SlickGrid;
    protected _container: HTMLElement;
    protected _statusElm: HTMLElement;
    protected _bindingEventService: BindingEventService_;
    protected _options: GridPagerOption;
    protected _defaults: GridPagerOption;
    constructor(dataView: SlickDataView, grid: SlickGrid, selectorOrElm: HTMLElement | string, options?: Partial<GridPagerOption>);
    init(): void;
    /** Destroy function when element is destroyed */
    destroy(): void;
    protected getNavState(): {
        canGotoFirst: boolean;
        canGotoLast: boolean;
        canGotoPrev: boolean;
        canGotoNext: boolean;
        pagingInfo: PagingInfo;
    };
    protected setPageSize(n: number): void;
    protected gotoFirst(): void;
    protected gotoLast(): void;
    protected gotoPrev(): void;
    protected gotoNext(): void;
    protected getContainerElement(selectorOrElm: object | HTMLElement | string): object | null;
    protected constructPagerUI(): void;
    protected updatePager(pagingInfo: PagingInfo): void;
}
//# sourceMappingURL=slick.pager.d.ts.map