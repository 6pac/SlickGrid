import type { Column, ColumnReorderFunction, EditCommand, Editor, Formatter, ItemMetadata, } from './index';
import type { EditorLock } from '../slick.core';

export interface CellRange {
  bottom: number;
  top: number;
  leftPx: number;
  rightPx: number;
}

export interface CustomDataView {
  getLength: () => number;
  getItem: <T = any>(index: number) => T;
  getItemMetadata(index: number): ItemMetadata | null;
}

export interface CssStyleHash {
  [prop: number | string]: { [columnId: number | string]: any; }
}

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

  /** Defaults to false, which leads to automatically adjust the size (height) of the grid to display the entire content without any scrolling in the grid. */
  autoHeight?: boolean;

  /** defaults to LegacyOff, Grid Autosize Columns Mode used when calling "autosizeColumns()" method */
  autosizeColsMode?: string;

  /** defaults to 4, autosize column padding in pixel */
  autosizeColPaddingPx: number;

  /** defaults to 0.75, autosize text average to minimum width ratio */
  autosizeTextAvgToMWidthRatio: number;

  /** CSS class name used to simulate cell flashing */
  cellFlashingCssClass?: string;

  /** Cell menu options (Action menu) */
  // cellMenu?: CellMenu;

  // /** Column Picker Plugin options (columnTitle, forceFitTitle, syncResizeTitle) */
  // columnPicker?: ColumnPicker;

  // /** Context menu options (mouse right+click) */
  // contextMenu?: ContextMenu;

  /** Defaults to false, which leads to create the footer row of the grid */
  createFooterRow?: boolean;

  /** Default to false, which leads to create an extra pre-header panel (on top of column header) for column grouping purposes */
  createPreHeaderPanel?: boolean;

  /** Data item column value extractor (getter) that can be used by the Excel like copy buffer plugin */
  dataItemColumnValueExtractor?: null | ((item: any, columnDef: Column) => any);

  /** Default column width, is set to 80 when null */
  defaultColumnWidth: number;

  /** Default cell Formatter that will be used by the grid */
  defaultFormatter?: Formatter;

  /** Do we have paging enabled? */
  doPaging?: boolean;

  /** Defaults to false, when enabled will give the possibility to edit cell values with inline editors. */
  editable?: boolean;

  /** option to intercept edit commands and implement undo support. */
  editCommandHandler?: (item: any, column: Column, command: EditCommand) => void;

  /** Editor classes factory */
  editorFactory?: null | { getEditor: (col: Column) => Editor; };

  /** a global singleton editor lock. */
  editorLock: EditorLock;

  /** Do we want to emulate paging when we are scrolling? */
  emulatePagingWhenScrolling?: boolean;

  /** Defaults to false, which leads to give user possibility to add row to the grid */
  enableAddRow?: boolean;

  /** Do we want to enable asynchronous (delayed) post rendering */
  enableAsyncPostRender?: boolean;

  /** Defaults to false, which leads to cleanup after the post render is finished executing */
  enableAsyncPostRenderCleanup?: boolean;

  /** Defaults to false, which leads to showing tooltip over cell & header values that are not shown completely (... ellipsis) */
  enableAutoTooltip?: boolean;

  /** Defaults to false, which will let user click on cell and navigate with arrow keys. */
  enableCellNavigation?: boolean;

  /** Defaults to false, editor cell navigation left/right keys */
  editorCellNavOnLRKeys?: boolean;

  /**
   * Defaults to true, this option can be a boolean or a Column Reorder function.
   * When provided as a boolean, it will permits the user to move an entire column from a position to another.
   * We could also provide a Column Reorder function, there's mostly only 1 use for this which is the SlickDraggableGrouping plugin.
   */
  enableColumnReorder?: boolean | ColumnReorderFunction;

  /**
   * Do we want to always enable the mousewheel scroll handler?
   * In other words, do we want the mouse scrolling would work from anywhere.
   * Typically we should only enable it when using a Frozen/Pinned grid and if it does detect it to be a frozen grid,
   * then it will automatically enable the scroll handler if this flag was originally set to undefined (which it is by default unless the user specifically disabled it).
   */
  enableMouseWheelScrollHandler?: boolean;

  /** Do we want to enable text selection on cells? Useful when user wants to do copy to clipboard. */
  enableTextSelectionOnCells?: boolean;

  /** Options for the ExcelCopyBuffer Extension */
  // excelCopyBufferOptions?: ExcelCopyBufferOption;

  /** Do we want explicit grid initialization? */
  explicitInitialization?: boolean;

  /** Firefox max supported CSS height */
  ffMaxSupportedCssHeight: number;

  /** Defaults to 25, which is the grid footer row panel height */
  footerRowHeight: number;

  /** Do we want to force fit columns in the grid at all time? */
  forceFitColumns?: boolean;

  /** Defaults to false, force synchronous scrolling */
  forceSyncScrolling?: boolean;

  /** Formatter classes factory */
  formatterFactory?: { getFormatter: (col: Column) => Formatter; } | null;

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

  // /** Grid Menu options (aka hamburger menu) */
  // gridMenu?: GridMenu;

  /** Header row height in pixels (only type the number). Header row is where the filters are. */
  headerRowHeight: number;

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

  /** Extra pre-header panel height (on top of column header) */
  preHeaderPanelHeight: number;

  /** Do we want to preserve copied selection on paste? */
  preserveCopiedSelectionOnPaste?: boolean;

  /** Grid row height in pixels (only type the number). Row of cell values. */
  rowHeight: number;

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

  /** Defaults to false, when set to True will lead to multiple columns sorting without the need to hold or do shift-click to execute a multiple sort. */
  tristateMultiColumnSort?: boolean;

  /** Defaults to null, which is the default Viewport CSS class name */
  viewportClass?: string | null;

  /** Viewport switch to scroll model with percentage */
  viewportSwitchToScrollModeWidthPercent?: number;

  /** Viewport min width in pixel */
  viewportMinWidthPx?: number;

  /** Viewport max width in pixel */
  viewportMaxWidthPx?: number;
}
