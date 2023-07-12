import { AutoTooltipOption } from "./autoTooltipOption.interface";
import { Column } from "./column.interface";
import { ColumnReorderFunction } from "./columnReorderFunction.type";
import { CustomTooltipOption } from "./customTooltipOption.interface";
import { EditCommand } from "./editCommand.interface";
import { Formatter } from "./formatter.interface";
import { GroupItemMetadataProviderOption } from "./groupItemMetadataProviderOption.interface";
import { GridAutosizeColsMode } from '../slick.core';

export interface GridOption {
  /** CSS class name used on newly added row */
  addNewRowCssClass?: string;

  /** Defaults to false, which leads to always show an horizontal scrolling. */
  alwaysAllowHorizontalScroll?: boolean;

  /** Defaults to false, which leads to always show a vertical scrolling. This is rather important to use when using the Grid Menu (hamburger) */
  alwaysShowVerticalScroll?: boolean;

  /** Defaults to 100, which is the asynchronous editor loading delay */
  asyncEditorLoadDelay?: number;

  /** Defaults to false, which leads to load editor asynchronously (delayed) */
  asyncEditorLoading?: boolean;

  /** Defaults to 50, which is the delay before the asynchronous post renderer start execution */
  asyncPostRenderDelay?: number;

  /** Defaults to 40, which is the delay before the asynchronous post renderer start cleanup execution */
  asyncPostRenderCleanupDelay?: number;

  // TODO: not sure what that option does?
  auto?: boolean;

  /** Defaults to false, when enabled will try to commit the current edit without focusing on the next row. If a custom editor is implemented and the grid cannot auto commit, you must use this option to implement it yourself */
  autoCommitEdit?: boolean;

  /** Defaults to false, when enabled will automatically open the inlined editor as soon as there is a focus on the cell (can be combined with "enableCellNavigation: true"). */
  autoEdit?: boolean;

  /**
   * Defaults to true, which leads to automatically adjust the width of each column with the available space. Similar to "Force Fit Column" but only happens on first page/component load.
   * If you wish this resize to also re-evaluate when resizing the browser, then you should also use `enableAutoSizeColumns` (it is also enabled by default)
   */
  autoFitColumnsOnFirstLoad?: boolean;

  /**
   * Defaults to true, when enabled it will parse the filter input string and extract filter operator (<, <=, >=, >, =, *) when found.
   * When an operators is found in the input string, it will automatically be converted to a Filter Operators and will no longer be part of the search value itself.
   * For example when the input value is "> 100", it will transform the search as to a Filter Operator of ">" and a search value of "100".
   * The only time that the user would want to disable this flag is when the user's data has any of these special characters and the user really wants to filter them as part of the string (ie: >, <, ...)
   */
  autoParseInputFilterOperator?: boolean;

  /**
   * Defaults to false, which leads to automatically adjust the width of each column by their cell value content and only on first page/component load.
   * If you wish this resize to also re-evaluate when resizing the browser, then you should also use `enableAutoResizeColumnsByCellContent`
   */
  autosizeColumnsByCellContentOnFirstLoad?: boolean;

  /** Defaults to false, which leads to automatically adjust the size (height) of the grid to display the entire content without any scrolling in the grid. */
  autoHeight?: boolean;

  /**
   * Defaults to 60, when "autoFixResizeWhenBrokenStyleDetected" is enabled then what will be the delay timeout before quitting?
   * Note that that the resize gets called every 200ms
   */
  autoFixResizeTimeout?: number;

  /** Defaults to 2 (or 5x in Salesforce), how many good resize count do we require before we assume that it's all good and we can stop calling a resize of the grid? (only works when `autoFixResizeWhenBrokenStyleDetected` is enabled) */
  autoFixResizeRequiredGoodCount?: number;

  /** Defaults to false, this is a patch for Salesforce since we don't always have access to tab change events. */
  autoFixResizeWhenBrokenStyleDetected?: boolean;

  autosizeColsMode?: string;

  autosizeColPaddingPx: number;

  autosizeTextAvgToMWidthRatio: number;

  /** Auto-tooltip options (enableForCells, enableForHeaderCells, maxToolTipLength) */
  autoTooltipOptions?: AutoTooltipOption;

  /** CSS class name used to simulate cell flashing */
  cellFlashingCssClass?: string;

  /** CSS class name used when highlighting a cell value. Useful to change background color of the activated cell */
  cellHighlightCssClass?: string | null;

  /** Cell menu options (Action menu) */
  // cellMenu?: CellMenu;

  /**
   * Defaults to false, can the cell value (dataContext) be undefined?
   * Typically undefined values are disregarded when sorting, when setting this flag it will adds extra logic to Sorting and also sort undefined value.
   * This is an extra flag that user has to enable by themselve because Sorting undefined values has unintended behavior in some use case
   * (for example Row Detail has UI inconsistencies since undefined is used in the plugin's logic)
   */
  cellValueCouldBeUndefined?: boolean;

  // /** Checkbox Select Plugin options (columnId, cssClass, toolTip, width) */
  // checkboxSelector?: CheckboxSelectorOption;

  // /** A callback function that will be used to define row spanning accross multiple columns */
  // colspanCallback?: (item: any) => ItemMetadata;

  /** Defaults to " - ", separator between the column group label and the column label. */
  columnGroupSeparator?: string;

  // /** Column Picker Plugin options (columnTitle, forceFitTitle, syncResizeTitle) */
  // columnPicker?: ColumnPicker;

  // /** Context menu options (mouse right+click) */
  // contextMenu?: ContextMenu;

  /** Defaults to false, which leads to create the footer row of the grid */
  createFooterRow?: boolean;

  /** Default to false, which leads to create an extra pre-header panel (on top of column header) for column grouping purposes */
  createPreHeaderPanel?: boolean;

  /**
   * Custom Tooltip Options, the tooltip could be defined in any of the Column Definition or in the Grid Options,
   * it will first try to find it in the Column that the user is hovering over or else (when not found) go and try to find it in the Grid Options
   */
  customTooltip?: CustomTooltipOption;

  /** Data item column value extractor (getter) that can be used by the Excel like copy buffer plugin */
  dataItemColumnValueExtractor?: null | ((item: any, columnDef: Column) => any);

  /** Data item column value setter that can be used by the Excel like copy buffer plugin */
  dataItemColumnValueSetter?: (item: any, columnDef: Column, value: any) => void;

  /** Unique property name on the dataset used by Slick.Data.DataView */
  datasetIdPropertyName?: string;

  /** Defaults to 500, how long to wait between each characters that the user types before processing the filtering process when using a Backend Service? */
  defaultBackendServiceFilterTypingDebounce?: number;

  /** Defaults to 'id', what is the default column field id to sort when calling clear sorting */
  defaultColumnSortFieldId?: string;

  /** Default column width, is set to 80 when null */
  defaultColumnWidth: number;

  /** Default cell Formatter that will be used by the grid */
  defaultFormatter?: Formatter;

  /** Do we have paging enabled? */
  doPaging?: boolean;

  /** Draggable Grouping Plugin options & events */
  // draggableGrouping?: DraggableGrouping;

  /** Defaults to false, when enabled will give the possibility to edit cell values with inline editors. */
  editable?: boolean;

  /** option to intercept edit commands and implement undo support. */
  editCommandHandler?: (item: any, column: Column, command: EditCommand) => void;

  /** Editor classes factory */
  editorFactory?: any;

  /** a global singleton editor lock. */
  editorLock?: any;

  /** Do we want to emulate paging when we are scrolling? */
  emulatePagingWhenScrolling?: boolean;

  /** Defaults to false, which leads to give user possibility to add row to the grid */
  enableAddRow?: boolean;

  /** Do we want to enable asynchronous (delayed) post rendering */
  enableAsyncPostRender?: boolean;

  /** Defaults to false, which leads to cleanup after the post render is finished executing */
  enableAsyncPostRenderCleanup?: boolean;

  /** Defaults to true, which will automatically resize the grid whenever the browser size changes */
  enableAutoResize?: boolean;

  /** Defaults to true, which will automatically resize the column headers whenever the grid size changes */
  enableAutoSizeColumns?: boolean;

  /**
   * Defaults to false, which will automatically resize the column headers by their cell content whenever the grid size changes.
   * NOTE: this option is opt-in and if you decide to use it then you should disable the other grid option `enableAutoSizeColumns: false`
   */
  enableAutoResizeColumnsByCellContent?: boolean;

  /** Defaults to false, which leads to showing tooltip over cell & header values that are not shown completely (... ellipsis) */
  enableAutoTooltip?: boolean;

  /** Do we want to enable Cell Menu? (Action menu cell click) */
  enableCellMenu?: boolean;

  /** Defaults to false, which will let user click on cell and navigate with arrow keys. */
  enableCellNavigation?: boolean;

  /** Defaults to false, editor cell navigation left/right keys */
  editorCellNavOnLRKeys?: boolean;

  /** Defaults to false, when enabled it will add a column for checkbox selection at the 1st column position. A selection will trigger the "onSelectedRowsChanged" event. */
  enableCheckboxSelector?: boolean;

  /** Defaults to true, when enabled will give the possibility to do a right+click on any header title which will open the list of column. User can show/hide a column by using the checkbox from that picker list. */
  enableColumnPicker?: boolean;

  /**
   * Defaults to true, this option can be a boolean or a Column Reorder function.
   * When provided as a boolean, it will permits the user to move an entire column from a position to another.
   * We could also provide a Column Reorder function, there's mostly only 1 use for this which is the SlickDraggableGrouping plugin.
   */
  enableColumnReorder?: boolean | ColumnReorderFunction;

  /**
   * Defaults to true, when doing a double-click in the column resize section (top right of a column when the mouse resize icon shows up),
   * do we want to automatically resize the column by its cell content?
   */
  enableColumnResizeOnDoubleClick?: boolean;

  /** Do we want to enable Context Menu? (mouse right+click) */
  enableContextMenu?: boolean;

  /**
   * Defaults to false, do we want to make a deep copy of the dataset before loading it into the grid?
   * Useful with Salesforce to avoid proxy object error when trying to update a property of an item object by reference (which SlickGrid does a lot)
   */
  enableDeepCopyDatasetOnPageLoad?: boolean;

  /** Defaults to false, do we want to enable the Draggable Grouping Plugin? */
  enableDraggableGrouping?: boolean;

  /**
   * Defaults to true, which leads to use an Excel like copy buffer that gets copied in clipboard and can be pasted back in Excel or any other app.
   * NOTE: please note that this option will NOT work when "Row Selection" & "Row Move" are enabled, because features are conflicting with each other.
   */
  enableExcelCopyBuffer?: boolean;

  /**
   * Defaults to true, will display a warning message positioned inside the grid when there's no data returned.
   * When using local (in-memory) dataset, it will show the message when there's no filtered data returned.
   * When using backend Pagination it will display the message as soon as the total row count is 0.
   */
  enableEmptyDataWarningMessage?: boolean;

  /** Do we want to enable Filters? */
  enableFiltering?: boolean;

  /**
   * Defaults to false, do we want to globally trim white spaces on all filter values typed by the user?
   * User can choose to override the default
   */
  enableFilterTrimWhiteSpace?: boolean;

  /** Do we want to enable Grid Menu (aka hamburger menu) */
  enableGridMenu?: boolean;

  /** Defaults to false, do we want to enable the Grouping & Aggregator Plugin? */
  enableGrouping?: boolean;

  /** Do we want to enable Header Buttons? (buttons with commands that can be shown beside each column)  */
  enableHeaderButton?: boolean;

  /** Do we want to enable Header Menu? (when hovering a column, a menu will appear for that column) */
  enableHeaderMenu?: boolean;

  /** Do we want to enable a styling effect when hovering any row from the grid? */
  enableMouseHoverHighlightRow?: boolean;

  /**
   * Do we want to always enable the mousewheel scroll handler?
   * In other words, do we want the mouse scrolling would work from anywhere.
   * Typically we should only enable it when using a Frozen/Pinned grid and if it does detect it to be a frozen grid,
   * then it will automatically enable the scroll handler if this flag was originally set to undefined (which it is by default unless the user specifically disabled it).
   */
  enableMouseWheelScrollHandler?: boolean;

  /** Do we want to enable pagination? Currently only works with a Backend Service API */
  enablePagination?: boolean;

  /** Defaults to false, do we want to enable the Row Detail Plugin? */
  enableRowDetailView?: boolean;

  /** Defaults to false, when enabled it will make possible to move rows in the grid. */
  enableRowMoveManager?: boolean;

  /** Do we want to enable row selection? */
  enableRowSelection?: boolean;

  /** Do we want to enable sorting? */
  enableSorting?: boolean;

  /** Do we want to enable text selection on cells? Useful when user wants to do copy to clipboard. */
  enableTextSelectionOnCells?: boolean;

  /** Do we want to enable localization translation (i18n)? */
  enableTranslate?: boolean;

  /** Options for the ExcelCopyBuffer Extension */
  // excelCopyBufferOptions?: ExcelCopyBufferOption;

  /** Do we want explicit grid initialization? */
  explicitInitialization?: boolean;

  /**
   * Default to 0, how long to wait between each characters that the user types before processing the filtering process (only applies for local/in-memory grid).
   * Especially useful when you have a big dataset and you want to limit the amount of search called (by default every keystroke will trigger a search on the dataset and that is sometime slow).
   * This is only used by and relevant to 2 filters (InputFilter & CompoundInputFilter) which are the only ones triggering a search after each character typed.
   * NOTE: please note that the BackendServiceApi has its own `filterTypingDebounce` within the `BackendServiceApi` options which is set to 500ms.
   */
  filterTypingDebounce?: number;

  /** Firefox max supported CSS height */
  ffMaxSupportedCssHeight: number;

  /** Defaults to 25, which is the grid footer row panel height */
  footerRowHeight: number;

  /** Do we want to force fit columns in the grid at all time? */
  forceFitColumns?: boolean;

  /** Defaults to false, force synchronous scrolling */
  forceSyncScrolling?: boolean;

  /** Formatter classes factory */
  formatterFactory?: any;

  /** Optional frozen border in pixel to remove from total header width calculation (depending on your border width, it should be 0, 1 or 2 defaults is 1) */
  frozenHeaderWidthCalcDifferential?: number;

  /** Defaults to false, do we want to freeze (pin) the bottom portion instead of the top */
  frozenBottom: boolean;

  /** Number of column index(es) to freeze (pin) in the grid */
  frozenColumn: number;

  /** Number of row index(es) to freeze (pin) in the grid */
  frozenRow: number;

  /**
   * Defaults to 100, what is the minimum width to keep for the section on the right of a frozen grid?
   * This basically fixes an issue that if the user expand any column on the left of the frozen (pinning) section
   * and make it bigger than the viewport width, then the grid becomes unusable because the right section goes into a void/hidden area.
   */
  frozenRightViewportMinWidth: number;

  /** Defaults to false, which leads to have row(s) taking full width */
  fullWidthRows?: boolean;

  // /** defaults to None, Grid Autosize Columns Mode used when calling "autosizeColumns()" method */
  // gridAutosizeColsMode?: GridAutosizeColsMode;

  /** Grid DOM element container ID (used Slickgrid-Universal auto-resizer) */
  gridContainerId?: string;

  /**
   * When using a fixed grid height, can be a number or a string.
   * if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as is.
   */
  gridHeight?: number | string;

  /** Grid DOM element ID */
  gridId?: string;

  // /** Grid Menu options (aka hamburger menu) */
  // gridMenu?: GridMenu;

  /**
   * When using a fixed grid width, can be a number or a string.
   * if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as it is.
   */
  gridWidth?: number | string;

  /** Optional option to provide to the GroupItemMetadataProvider */
  groupItemMetadataOption?: GroupItemMetadataProviderOption;

  /** Header row height in pixels (only type the number). Header row is where the filters are. */
  headerRowHeight: number;

  // /** Header button options */
  // headerButton?: HeaderButton;

  // /** Header menu options */
  // headerMenu?: HeaderMenu;

  /**
   * Defaults to false, should we ignore any accent while filtering and sorting text?
   * For example if our text is "José" and we type "Jose" then it won't return unless we use this flag because "é" is not equal to "e"
   */
  ignoreAccentOnStringFilterAndSort?: boolean;

  /** Do we leave space for new rows in the DOM visible buffer */
  leaveSpaceForNewRows?: boolean;

  /** Should we log the sanitized html? */
  logSanitizedHtml?: boolean;

  /** Max supported CSS height */
  maxSupportedCssHeight: number;

  /** What is the minimum row buffer to use? */
  minRowBuffer: number;

  /** Defaults to false, which leads to be able to do multiple columns sorting (or single sort when false) */
  multiColumnSort?: boolean;

  /** Defaults to true, which leads to be able to do multiple selection */
  multiSelect?: boolean;

  /** Defaults to true, which will display numbers indicating column sort precedence are displayed in the columns when multiple columns selected */
  numberedMultiColumnSort?: boolean;

  /** if you want to pass custom paramaters to your Formatter/Editor or anything else */
  params?: any | any[];

  /** Extra pre-header panel height (on top of column header) */
  preHeaderPanelHeight: number;

  /** Do we want to preserve copied selection on paste? */
  preserveCopiedSelectionOnPaste?: boolean;

  /** Preselect certain rows by their row index ("enableCheckboxSelector" must be enabled) */
  preselectedRows?: number[];

  /**
   * Should we skip filtering when the Operator is changed before the Compound Filter input.
   * For example, with a CompoundDate Filter it's probably better to wait until we have a date filled before filtering even if we start with the operator.
   * Defaults to True only for the Compound Date Filter (all other compound filters will still filter even when operator is first changed).
   */
  skipCompoundOperatorFilterWithNullInput?: boolean;

  // /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  // rowDetailView?: RowDetailView;

  /** Grid row height in pixels (only type the number). Row of cell values. */
  rowHeight: number;

  // /** Row Move Manager Plugin options & events */
  // rowMoveManager?: RowMoveManager;

  // /** Row selection options */
  // rowSelectionOptions?: RowSelectionModelOption;

  /** Optional sanitizer function to use for sanitizing data to avoid XSS attacks */
  sanitizer?: (dirtyHtml: string) => string;

  /** Defaults to 50, render throttling when scrolling large dataset */
  scrollRenderThrottling: number;

  /** CSS class name used when cell is selected */
  selectedCellCssClass?: string;

  /** Do we want to show column header? */
  showColumnHeader?: boolean;

  /** Do we want to show cell selection? */
  showCellSelection?: boolean;

  /** Do we want to show the footer row? */
  showFooterRow?: boolean;

  /** Do we want to show header row? */
  showHeaderRow?: boolean;

  /** Do we want to show the extra pre-header panel (on top of column header) for column grouping purposes */
  showPreHeaderPanel?: boolean;

  /** Do we want to show top panel row? */
  showTopPanel?: boolean;

  /** Defaults to true, which leads to render a separate span for the number and styles it with css class <i>slick-sort-indicator-numbered</i> */
  sortColNumberInSeparateSpan?: boolean;

  /**
   * Defaults to false, which leads to suppress the cell from becoming active when cell as an editor and is clicked.
   * This flag was originally enabled to work properly with (Row Selections & Inline Editors) features but it caused problem when also used with CellExternalCopyManager,
   * however this flag shouldn't be need anymore when editing & using all 3 features and the flag's default is now disabled (false) but user can still change it if needed.
   */
  suppressActiveCellChangeOnEdit?: boolean;

  /** Defaults to false, do we want to suppress CSS changes when onHiddenInit event is triggered */
  suppressCssChangesOnHiddenInit?: boolean;

  /** Defaults to false, when set to True will sync the column cell resize & apply the column width */
  syncColumnCellResize?: boolean;

  /** What is the top panel height in pixels (only type the number) */
  topPanelHeight: number;

  /** I18N Namespace Translation Prefix, you can also optionally change the separator by setting "translationNamespaceSeparator" (defaults to ":") */
  translationNamespace?: string;

  /** Defaults to ":", Separator to use between the I18N Namespace Prefix */
  translationNamespaceSeparator?: string;

  /** Defaults to false, when set to True will lead to multiple columns sorting without the need to hold or do shift-click to execute a multiple sort. */
  tristateMultiColumnSort?: boolean;

  /** Defaults to false, do we want to use default Salesforce grid  */
  useSalesforceDefaultGridOptions?: boolean;

  /** Defaults to null, which is the default Viewport CSS class name */
  viewportClass?: string | null;

  /** Viewport switch to scroll model with percentage */
  viewportSwitchToScrollModeWidthPercent?: number;

  /** Viewport min width in pixel */
  viewportMinWidthPx?: number;

  /** Viewport max width in pixel */
  viewportMaxWidthPx?: number;
}
