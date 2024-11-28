import type { CheckboxSelectorOption, Column, DOMEvent, SlickPlugin, SelectableOverrideCallback, OnHeaderClickEventArgs } from '../models/index.js';
import { BindingEventService as BindingEventService_, type SlickEventData, SlickEventHandler as SlickEventHandler_ } from '../slick.core.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';
export declare class SlickCheckboxSelectColumn<T = any> implements SlickPlugin {
    pluginName: "CheckboxSelectColumn";
    protected _dataView: SlickDataView<T>;
    protected _grid: SlickGrid;
    protected _isUsingDataView: boolean;
    protected _selectableOverride: SelectableOverrideCallback<T> | null;
    protected _headerRowNode?: HTMLElement;
    protected _selectAll_UID: number;
    protected _handler: SlickEventHandler_;
    protected _selectedRowsLookup: any;
    protected _checkboxColumnCellIndex: number | null;
    protected _options: CheckboxSelectorOption;
    protected _defaults: CheckboxSelectorOption;
    protected _isSelectAllChecked: boolean;
    protected _bindingEventService: BindingEventService_;
    constructor(options?: Partial<CheckboxSelectorOption>);
    init(grid: SlickGrid): void;
    destroy(): void;
    getOptions(): CheckboxSelectorOption;
    setOptions(options: Partial<CheckboxSelectorOption>): void;
    protected hideSelectAllFromColumnHeaderTitleRow(): void;
    protected hideSelectAllFromColumnHeaderFilterRow(): void;
    protected handleSelectedRowsChanged(): void;
    protected handleDataViewSelectedIdsChanged(): void;
    protected handleKeyDown(e: SlickEventData, args: any): void;
    protected handleClick(e: SlickEventData, args: {
        row: number;
        cell: number;
    }): void;
    protected toggleRowSelection(row: number): void;
    selectRows(rowArray: number[]): void;
    deSelectRows(rowArray: number[]): void;
    protected handleHeaderClick(e: DOMEvent<HTMLInputElement> | SlickEventData, args: OnHeaderClickEventArgs): void;
    protected getCheckboxColumnCellIndex(): number;
    /**
     * use a DocumentFragment to return a fragment including an <input> then a <label> as siblings,
     * the label is using `for` to link it to the input `id`
     * @param {String} inputId - id to link the label
     * @param {Boolean} [checked] - is the input checkbox checked? (defaults to false)
     * @returns
     */
    createCheckboxElement(inputId: string, checked?: boolean): DocumentFragment;
    getColumnDefinition(): {
        id: string | undefined;
        reorderable: boolean | undefined;
        name: string | DocumentFragment;
        toolTip: string | undefined;
        field: string;
        width: number | undefined;
        resizable: boolean;
        sortable: boolean;
        cssClass: string | undefined;
        hideSelectAllCheckbox: boolean | undefined;
        formatter: (row: number, _cell: number, _val: any, _columnDef: Column, dataContext: any, grid: SlickGrid) => DocumentFragment | null;
        excludeFromColumnPicker: boolean;
        excludeFromGridMenu: boolean;
        excludeFromHeaderMenu: boolean;
    };
    protected addCheckboxToFilterHeaderRow(grid: SlickGrid): void;
    protected createUID(): number;
    protected checkboxSelectionFormatter(row: number, _cell: number, _val: any, _columnDef: Column, dataContext: any, grid: SlickGrid): DocumentFragment | null;
    protected checkSelectableOverride(row: number, dataContext: any, grid: SlickGrid): boolean;
    protected renderSelectAllCheckbox(isSelectAllChecked?: boolean): void;
    /**
     * Method that user can pass to override the default behavior or making every row a selectable row.
     * In order word, user can choose which rows to be selectable or not by providing his own logic.
     * @param overrideFn: override function callback
     */
    selectableOverride(overrideFn: SelectableOverrideCallback<T>): void;
}
//# sourceMappingURL=slick.checkboxselectcolumn.d.ts.map