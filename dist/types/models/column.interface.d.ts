import type { AutoSize, CellMenuOption, CustomTooltipOption, Editor, EditorConstructor, EditorValidator, Formatter, FormatterResultWithHtml, FormatterResultWithText, GroupTotalsFormatter, Grouping, HeaderButtonsOrMenu } from './index.js';
import type { SlickGrid } from '../slick.grid.js';
type PathsToStringProps<T> = T extends string | number | boolean | Date ? [] : {
    [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
}[Extract<keyof T, string>];
type AllowedJoinTypes = string | number | boolean;
type Join<T extends (AllowedJoinTypes | unknown)[], D extends string> = T extends [] ? never : T extends [infer F] ? F : T extends [infer F, ...infer R] ? F extends AllowedJoinTypes ? string extends F ? string : `${F}${D}${Join<Extract<R, AllowedJoinTypes[]>, D>}` : never : string;
export type FormatterOverrideCallback = (row: number, cell: number, val: any, columnDef: Column, item: any, grid: SlickGrid) => string | FormatterResultWithHtml | FormatterResultWithText;
export interface Column<TData = any> {
    /** Defaults to false, should we always render the column? */
    alwaysRenderColumn?: boolean;
    /** async background post-rendering formatter */
    asyncPostRender?: (domCellNode: HTMLElement, row: number, dataContext: TData, columnDef: Column, process?: boolean) => void;
    /** async background post-render cleanup callback function */
    asyncPostRenderCleanup?: (node: HTMLElement, rowIdx: number, column: Column) => void;
    /** column autosize feature */
    autoSize?: AutoSize;
    /** optional Behavior of a column with action, for example it's used by the Row Move Manager Plugin */
    behavior?: string;
    /** cell attributes */
    cellAttrs?: any;
    /** Options that can be provide to the Cell Context Menu Plugin */
    cellMenu?: CellMenuOption;
    /** header cell attributes */
    headerCellAttrs?: any;
    /** Block event triggering of a new row insert */
    cannotTriggerInsert?: boolean;
    /** Column group name for grouping of column headers spanning accross multiple columns */
    columnGroup?: string;
    /** Column span in cell count or use `*` to span across the entire row */
    colspan?: number | string | '*';
    /** CSS class to add to the column cell */
    cssClass?: string;
    /**
     * Custom Tooltip Options, the tooltip could be defined in any of the Column Definition or in the Grid Options,
     * it will first try to find it in the Column that the user is hovering over or else (when not found) it will try to find it in the Grid Options
     */
    customTooltip?: CustomTooltipOption;
    /** Do we want default sort to be ascending? True by default */
    defaultSortAsc?: boolean;
    /** Defaults to false, do we want to deny executing a Paste (from a Copy of CellExternalCopyManager)? */
    denyPaste?: boolean;
    /**
     * defaults to False, optionally enable/disable tooltip.
     * This is typically used on a specific column that you would like to completely disable the custom/regular tooltip.
     */
    disableTooltip?: boolean;
    /** Any inline editor function that implements Editor for the cell value or ColumnEditor */
    editor?: Editor | EditorConstructor | null;
    /** Editor number fixed decimal places */
    editorFixedDecimalPlaces?: number;
    /** Default to false, which leads to exclude the column title from the Column Picker. */
    excludeFromColumnPicker?: boolean;
    /** Default to false, which leads to exclude the column from the export. */
    excludeFromExport?: boolean;
    /** Default to false, which leads to exclude the column title from the Grid Menu. */
    excludeFromGridMenu?: boolean;
    /** Defaults to false, which leads to exclude the field from the query (typically a backend service query) */
    excludeFromQuery?: boolean;
    /** Defaults to false, which leads to exclude the column from getting a header menu. For example, the checkbox row selection should not have a header menu. */
    excludeFromHeaderMenu?: boolean;
    /**
     * Field property name to use from the dataset that is used to display the column data.
     * For example: { id: 'firstName', field: 'firstName' }
     */
    field: Join<PathsToStringProps<TData>, '.'>;
    /** are we allowed to focus on the column? */
    focusable?: boolean;
    /** Formatter function is meant to format, or visually change, the data shown in the grid (UI) in a different way without affecting the source. */
    formatter?: Formatter<TData>;
    /** Formatter override function */
    formatterOverride?: {
        ReturnsTextOnly: boolean;
    } | FormatterOverrideCallback;
    /** Grouping option used by a Draggable Grouping Column */
    grouping?: Grouping;
    /** Group Totals Formatter function that can be used to add grouping totals in the grid */
    groupTotalsFormatter?: GroupTotalsFormatter;
    /** Options that can be provided to the Header Menu Plugin */
    header?: HeaderButtonsOrMenu;
    /** CSS class that can be added to the column header */
    headerCssClass?: string | null;
    /** is the column hidden? */
    hidden?: boolean;
    /** ID of the column, each column definition ID must be unique or else SlickGrid will throw an error. */
    id: number | string;
    /** Maximum Width of the column in pixels (number only). */
    maxWidth?: number;
    /** Minimum Width of the column in pixels (number only). */
    minWidth?: number;
    /** Column Title Name to be displayed in the Grid (UI) */
    name?: string | HTMLElement | DocumentFragment;
    /** column offset width */
    offsetWidth?: number;
    /** extra custom generic parameters that could be used by your Formatter/Editor or anything else */
    params?: any | any[];
    /** column previous width */
    previousWidth?: number;
    /**
     * Defaults to true, makes the column reorderable to another position in the grid.
     * NOTE: Works best when used as first or last columns of the grid (e.g.: row selection checkbox as first column).
     */
    reorderable?: boolean;
    /** Should we re-render when onResize is being triggered? */
    rerenderOnResize?: boolean;
    /** Is the column resizable, can we make it wider/thinner? A resize cursor will show on the right side of the column when enabled. */
    resizable?: boolean;
    /** Row span in cell count or use `*` to span across the entire row */
    rowspan?: number;
    /** Is the column selectable? Goes with grid option "enableCellNavigation: true". */
    selectable?: boolean;
    /** Is the column sortable? Goes with grid option "enableSorting: true". */
    sortable?: boolean;
    /** Custom Tooltip that can ben shown to the column */
    toolTip?: string;
    /** Defaults to false, when set to True will lead to the column being unselected in the UI */
    unselectable?: boolean;
    /** Editor Validator */
    validator?: EditorValidator;
    /** Width of the column in pixels (number only). */
    width?: number;
    /** column width request when resizing */
    widthRequest?: number;
}
export {};
//# sourceMappingURL=column.interface.d.ts.map