import type { CheckboxSelectorOption, Column, DOMEvent, Plugin, SelectableOverrideCallback } from '../models/index';
import { BindingEventService as BindingEventService_, SlickEventHandler as SlickEventHandler_ } from '../slick.core';
import type { SlickDataView } from '../slick.dataview';
import type { SlickGrid } from '../slick.grid';
export declare class SlickCheckboxSelectColumn<T = any> implements Plugin {
    pluginName: "CheckboxSelectColumn";
    protected _dataView: SlickDataView<T>;
    protected _grid: SlickGrid;
    protected _isUsingDataView: boolean;
    protected _selectableOverride: SelectableOverrideCallback<T> | null;
    protected _headerRowNode?: HTMLElement;
    protected _selectAll_UID: number;
    protected _handler: SlickEventHandler_<any>;
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
    protected handleKeyDown(e: KeyboardEvent, args: any): void;
    protected handleClick(e: DOMEvent<HTMLInputElement>, args: {
        row: number;
        cell: number;
    }): void;
    protected toggleRowSelection(row: number): void;
    selectRows(rowArray: number[]): void;
    deSelectRows(rowArray: number[]): void;
    protected handleHeaderClick(e: DOMEvent<HTMLInputElement>, args: any): void;
    protected getCheckboxColumnCellIndex(): number;
    getColumnDefinition(): {
        id: string | undefined;
        name: string;
        toolTip: string | undefined;
        field: string;
        width: number | undefined;
        resizable: boolean;
        sortable: boolean;
        cssClass: string | undefined;
        hideSelectAllCheckbox: boolean | undefined;
        formatter: (row: number, _cell: number, _val: any, _columnDef: Column<any>, dataContext: any, grid: SlickGrid<any, Column<any>, import("../models/gridOption.interface").GridOption<Column<any>>>) => string | null;
        excludeFromColumnPicker: boolean;
        excludeFromGridMenu: boolean;
        excludeFromHeaderMenu: boolean;
    };
    protected addCheckboxToFilterHeaderRow(grid: SlickGrid): void;
    protected createUID(): number;
    protected checkboxSelectionFormatter(row: number, _cell: number, _val: any, _columnDef: Column, dataContext: any, grid: SlickGrid): string | null;
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