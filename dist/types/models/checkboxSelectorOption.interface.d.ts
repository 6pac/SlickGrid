import type { UsabilityOverrideFn } from './usabilityOverrideFn.type.js';
export interface CheckboxSelectorOption {
    /**
     * Defaults to true, should we apply the row selection on all pages?
     * It requires DataView `syncGridSelection` to have `preserveHidden` to be disabled and `preserveHiddenOnSelectionChange` to be enabled.
     */
    applySelectOnAllPages?: boolean;
    /** Defaults to "_checkbox_selector", you can provide a different column id used as the column header id */
    columnId?: string;
    /** Defaults to "sel", you can provide a different column field id used as the column header id */
    field?: string;
    /**
     * Defaults to 0, the column index position in the grid by default it will show as the first column (index 0).
     * Also note that the index position might vary if you use other extensions, after each extension is created,
     * it will add an offset to take into consideration (1.CheckboxSelector, 2.RowDetail, 3.RowMove)
     */
    columnIndexPosition?: number;
    /** Provide a CSS class used by each row selection check boxes */
    cssClass?: string;
    /** Default to false, which leads to exclude the column title from the Column Picker. */
    excludeFromColumnPicker?: boolean;
    /** Default to false, which leads to exclude the column title from the Grid Menu. */
    excludeFromGridMenu?: boolean;
    /** Defaults to false, which leads to exclude the column from getting a header menu. For example, the checkbox row selection should not have a header menu. */
    excludeFromHeaderMenu?: boolean;
    /** default to false, do we want to hide the "Select All" checkbox? */
    hideSelectAllCheckbox?: boolean;
    /** defaults to false, do we want to hide the "Select All" checkbox from the Column Header Title Row? */
    hideInColumnTitleRow?: boolean;
    /** defaults to true, do we want to hide the "Select All" checkbox from the Column Header Filter Row? */
    hideInFilterHeaderRow?: boolean;
    /**
     * defaults to empty string, column name.
     * This will only work when the "Select All" checkbox is NOT shown in the column header row (`hideInColumnTitleRow: true`)
     */
    name?: string;
    /** Defaults to false, makes the column reorderable to another position in the grid. */
    reorderable?: boolean;
    /** Defaults to "Select/Deselect All", provide a tooltip that will be shown over the "Select All" checkbox */
    toolTip?: string;
    /** Defaults to 30, width of the Row Selection checkbox column */
    width?: number;
    /** Override the logic for showing (or not) the expand icon (use case example: only every 2nd row is expandable) */
    selectableOverride?: UsabilityOverrideFn;
}
//# sourceMappingURL=checkboxSelectorOption.interface.d.ts.map