/* eslint-disable @typescript-eslint/indent */

import { ColumnEditor } from "./columnEditor.interface";
import { CustomTooltipOption } from "./customTooltipOption.interface";
import { Formatter } from "./formatter.interface";
import { GroupTotalsFormatter } from "./groupTotalsFormatter.interface";
import { Grouping } from "./grouping.interface";
import { EditorValidator } from "./editorValidator.interface";
import { SlickEventData } from "../slick.core";

type PathsToStringProps<T> = T extends string | number | boolean | Date ? [] : {
  [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

/* eslint-disable @typescript-eslint/indent */
// disable eslint indent rule until this issue is fixed: https://github.com/typescript-eslint/typescript-eslint/issues/1824
type Join<T extends any[], D extends string> =
  T extends [] ? never :
  T extends [infer F] ? F :
  T extends [infer F, ...infer R] ?
  F extends string ? string extends F ? string : `${F}${D}${Join<R, D>}` : never : string;
/* eslint-enable @typescript-eslint/indent */

export interface Column<T = any> {
  /** async background post-rendering formatter */
  asyncPostRender?: (domCellNode: any, row: number, dataContext: T, columnDef: Column) => void;

  /** optional Behavior of a column with action, for example it's used by the Row Move Manager Plugin */
  behavior?: string;

  /** Column group name for grouping of column headers spanning accross multiple columns */
  columnGroup?: string;

  /** Column group name translation key that can be used by the Translate Service (i18n) for grouping of column headers spanning accross multiple columns */
  columnGroupKey?: string;

  /** Column span in pixels or `*`, only input the number value */
  colspan?: number | '*';

  /** CSS class to add to the column cell */
  cssClass?: string;

  /**
   * Custom Tooltip Options, the tooltip could be defined in any of the Column Definition or in the Grid Options,
   * it will first try to find it in the Column that the user is hovering over or else (when not found) go and try to find it in the Grid Options
   */
  customTooltip?: CustomTooltipOption;

  /** Data key, for example this could be used as a property key for complex object comparison (e.g. dataKey: 'id') */
  dataKey?: string;

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
  editor?: ColumnEditor;

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
   *
   * NOTE: a field with dot notation (.) will be considered a complex object.
   * For example: { id: 'Users', field: 'user.firstName' }
   */
  field: Join<PathsToStringProps<T>, '.'>;

  /** are we allowed to focus on the column? */
  focusable?: boolean;

  /** Formatter function is to format, or visually change, the data shown in the grid (UI) in a different way without affecting the source. */
  formatter?: Formatter<T>;

  /** Grouping option used by a Draggable Grouping Column */
  grouping?: Grouping;

  /** Group Totals Formatter function that can be used to add grouping totals in the grid */
  groupTotalsFormatter?: GroupTotalsFormatter;

  /** Options that can be provided to the Header Menu Plugin */
  header?: any;

  /** CSS class that can be added to the column header */
  headerCssClass?: string;

  /** ID of the column, each row have to be unique or SlickGrid will throw an error. */
  id: number | string;

  /** Maximum Width of the column in pixels (number only). */
  maxWidth?: number;

  /** Minimum Width of the column in pixels (number only). */
  minWidth?: number;

  /** Column Title Name to be displayed in the Grid (UI) */
  name?: string;

  /** an event that can be used for executing an action before the cell becomes editable (that event happens before the "onCellChange" event) */
  onBeforeEditCell?: (e: SlickEventData, args: any) => void;

  /** an event that can be used for executing an action after a cell change */
  onCellChange?: (e: SlickEventData, args: any) => void;

  /** an event that can be used for executing an action after a cell click */
  onCellClick?: (e: SlickEventData, args: any) => void;

  /** Is the column resizable, can we make it wider/thinner? A resize cursor will show on the right side of the column when enabled. */
  resizable?: boolean;

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

  /**
   * Defaults to false, can the value be undefined?
   * Typically undefined values are disregarded when sorting, when setting this flag it will adds extra logic to Sorting and also sort undefined value.
   * This is an extra flag that user has to enable by themselve because Sorting undefined values has unwanted behavior in some use case
   * (for example Row Detail has UI inconsistencies since undefined is used in the plugin's logic)
   */
  valueCouldBeUndefined?: boolean;

  /** Width of the column in pixels (number only). */
  width?: number;
}
