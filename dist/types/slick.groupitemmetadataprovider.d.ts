import type { Column, DOMEvent, GroupItemMetadataProviderOption, GroupingFormatterItem, ItemMetadata } from './models/index';
import type { SlickGrid } from './slick.grid';
/**
 * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
 * This metadata overrides the default behavior and formatting of those rows so that they appear and function
 * correctly when processed by the grid.
 *
 * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
 * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
 *
 * @class GroupItemMetadataProvider
 * @module Data
 * @namespace Slick.Data
 * @constructor
 * @param inputOptions
 */
export declare class SlickGroupItemMetadataProvider {
    protected _grid: SlickGrid;
    protected _options: GroupItemMetadataProviderOption;
    protected _defaults: GroupItemMetadataProviderOption;
    constructor(inputOptions?: GroupItemMetadataProviderOption);
    /** Getter of SlickGrid DataView object */
    protected get dataView(): any;
    getOptions(): GroupItemMetadataProviderOption;
    setOptions(inputOptions: GroupItemMetadataProviderOption): void;
    protected defaultGroupCellFormatter(_row: number, _cell: number, _value: any, _columnDef: Column, item: any): string;
    protected defaultTotalsCellFormatter(_row: number, _cell: number, _value: any, columnDef: Column, item: any, grid: SlickGrid): string;
    init(grid: SlickGrid): void;
    destroy(): void;
    protected handleGridClick(e: DOMEvent<HTMLDivElement>, args: {
        row: number;
        cell: number;
        grid: SlickGrid;
    }): void;
    protected handleGridKeyDown(e: KeyboardEvent): void;
    protected handleDataViewExpandOrCollapse(item: any): void;
    getGroupRowMetadata(item: GroupingFormatterItem): ItemMetadata;
    getTotalsRowMetadata(item: {
        group: GroupingFormatterItem;
    }): ItemMetadata | null;
}
//# sourceMappingURL=slick.groupitemmetadataprovider.d.ts.map