import type { Column as BaseColumn, CellMenuOption, ColumnPickerOption, ColumnReorderFunction, ContextMenuOption, CustomTooltipOption, EditCommand, EditorConstructor, ExcelCopyBufferOption, Formatter, GridMenuOption, ItemMetadata } from './index.js';
import type { SlickEditorLock } from '../slick.core.js';
export interface CellViewportRange {
    bottom: number;
    top: number;
    leftPx: number;
    rightPx: number;
}
export interface CustomDataView<T = any> {
    getItem: (index: number) => T;
    getItemMetadata(row: number, cell?: boolean | number): ItemMetadata | null;
    getLength: () => number;
}
export interface CssStyleHash {
    [prop: number | string]: {
        [columnId: number | string]: any;
    };
}
export interface GridOption<C extends BaseColumn = BaseColumn> {
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
    auto?: boolean;
    /**
     * Added for CSP header because of dynamic css generation.
     */
    nonce?: string;
    /**
     * Defaults to false, when enabled will try to commit the current edit without focusing on the next row.
     * If a custom editor is implemented and the grid cannot auto commit, you must use this option to implement it yourself
     */
    autoCommitEdit?: boolean;
    /** Defaults to false, when enabled it will automatically open the inlined editor as soon as there is a focus on the cell (can be combined with "enableCellNavigation: true"). */
    autoEdit?: boolean;
    /**
     * Defaults to true, when enabled it will automatically open the editor when clicking on cell that has a defined editor.
     * When using CellExternalCopyManager, this option could be useful to avoid opening the cell editor automatically on empty new row and we wish to paste our cell selection range.
     */
    autoEditNewRow?: boolean;
    /** Defaults to false, which leads to automatically adjust the size (height) of the grid to display the entire content without any scrolling in the grid. */
    autoHeight?: boolean;
    /** defaults to LegacyOff, Grid Autosize Columns Mode used when calling "autosizeColumns()" method */
    autosizeColsMode?: string;
    /** defaults to 4, autosize column padding in pixel */
    autosizeColPaddingPx?: number;
    /** defaults to 0.75, autosize text average to minimum width ratio */
    autosizeTextAvgToMWidthRatio?: number;
    /** CSS class name used to simulate cell flashing */
    cellFlashingCssClass?: string;
    /** Cell menu options (Action menu) */
    cellMenu?: CellMenuOption;
    /** Column Picker Plugin options (columnTitle, forceFitTitle, syncResizeTitle) */
    columnPicker?: ColumnPickerOption;
    /** Context menu options (mouse right+click) */
    contextMenu?: ContextMenuOption;
    /** Defaults to false, which leads to creating the footer row of the grid */
    createFooterRow?: boolean;
    /** Default to false, which leads to creating an extra pre-header panel (on top of column header) for column grouping purposes */
    createPreHeaderPanel?: boolean;
    /** Default to false, which leads to creating an extra top-header panel (on top of column header & pre-header) for column grouping purposes */
    createTopHeaderPanel?: boolean;
    /**
     * Custom Tooltip Options, the tooltip could be defined in any of the Column Definition or in the Grid Options,
     * it will first try to find it in the Column that the user is hovering over or else (when not found) go and try to find it in the Grid Options
     */
    customTooltip?: CustomTooltipOption;
    /** Data item column value extractor (getter) that can be used by the Excel like copy buffer plugin */
    dataItemColumnValueExtractor?: null | ((item: any, columnDef: C) => any);
    /** Default column width, is set to 80 when null */
    defaultColumnWidth?: number;
    /** Default cell Formatter that will be used by the grid */
    defaultFormatter?: Formatter;
    /** Escape hatch geared towards testing Slickgrid in JSDOM based environments to circumvent the lack of stylesheet.ownerNode and clientWidth calculations */
    devMode?: false | {
        ownerNodeIndex?: number;
        containerClientWidth?: number;
    };
    /** Do we have paging enabled? */
    doPaging?: boolean;
    /** Defaults to false, when enabled will give the possibility to edit cell values with inline editors. */
    editable?: boolean;
    /** option to intercept edit commands and implement undo support. */
    editCommandHandler?: (item: any, column: C, command: EditCommand) => void;
    /** Editor classes factory */
    editorFactory?: null | {
        getEditor: (col: C) => EditorConstructor;
    };
    /** a global singleton editor lock. */
    editorLock?: SlickEditorLock;
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
    /** Defaults to false, which will automatically resize the column headers whenever the grid size changes */
    enableAutoSizeColumns?: boolean;
    /** Defaults to false, which will let user click on cell and navigate with arrow keys. */
    enableCellNavigation?: boolean;
    /** Defaults to false, editor cell navigation left/right keys */
    editorCellNavOnLRKeys?: boolean;
    /**
     * Do we want to enable cell rowspan?
     * Note: this is an opt-in option because of the multiple row/column/cells looping that it has to do
     * (which is at least an O^n3 but only for visible range)
     */
    enableCellRowSpan?: boolean;
    /**
     * Defaults to true, this option can be a boolean or a Column Reorder function.
     * When provided as a boolean, it will permits the user to move an entire column from a position to another.
     * We could also provide a Column Reorder function, there's mostly only 1 use for this which is the SlickDraggableGrouping plugin.
     */
    enableColumnReorder?: boolean | ColumnReorderFunction<C>;
    /** Defaults to "unorderable", a CSS class name that will be added to the column classes when the column cannot be reordered. */
    unorderableColumnCssClass?: string;
    /**
     * Defaults to true, do we want to allow passing HTML string to cell/row rendering by using `innerHTML`.
     * When this is enabled and input is a string, it will use `innerHTML = 'some html'` to render the input, however when disable it will use `textContent = 'some html'`.
     * Note: for strict CSP, you would want to disable this option and convert all your custom Formatters to return an HTMLElement instead of a string
     */
    enableHtmlRendering?: boolean;
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
    excelCopyBufferOptions?: ExcelCopyBufferOption;
    /** Do we want explicit grid initialization? */
    explicitInitialization?: boolean;
    /** Firefox max supported CSS height */
    ffMaxSupportedCssHeight?: number;
    /** Defaults to 25, which is the grid footer row panel height */
    footerRowHeight?: number;
    /** Do we want to force fit columns in the grid at all time? */
    forceFitColumns?: boolean;
    /**
     * Defaults to false, force synchronous scrolling without throttling the UI render when scrolling.
     * Note: it might be risky to disable this option on large dataset, use at your own risk
     */
    forceSyncScrolling?: boolean;
    /** Formatter classes factory */
    formatterFactory?: {
        getFormatter: (col: C) => Formatter;
    } | null;
    /** Defaults to false, do we want to freeze (pin) the bottom portion instead of the top */
    frozenBottom?: boolean;
    /** Number of column index(es) to freeze (pin) in the grid */
    frozenColumn?: number;
    /** Number of row index(es) to freeze (pin) in the grid */
    frozenRow?: number;
    /**
     * Defaults to 100, what is the minimum width to keep for the section on the right of a frozen grid?
     * This basically fixes an issue that if the user expand any column on the left of the frozen (pinning) section
     * and make it bigger than the viewport width, then the grid becomes unusable because the right section goes into a void/hidden area.
     */
    frozenRightViewportMinWidth?: number;
    /** Defaults to false, which leads to have row(s) taking full width */
    fullWidthRows?: boolean;
    /** Grid Menu options (aka hamburger menu) */
    gridMenu?: GridMenuOption;
    /** Header row height in pixels (only type the number). Header row is where the filters are. */
    headerRowHeight?: number;
    /** Do we leave space for new rows in the DOM visible buffer */
    leaveSpaceForNewRows?: boolean;
    /** Should we log the sanitized html? */
    logSanitizedHtml?: boolean;
    /**
     * Defaults to 5000, max number of rows that we'll consider doing a partial rowspan remapping.
     * Anything else will be considered to require a full rowspan remap when necessary
     */
    maxPartialRowSpanRemap?: number;
    /** Max supported CSS height */
    maxSupportedCssHeight?: number;
    /** What is the minimum row buffer to use? */
    minRowBuffer?: number;
    /** What is the maximum row buffer to use? */
    maxRowBuffer?: number;
    /** Use a mixin function when applying defaults to passed in option and columns objects, rather than creating a new object, so as not to break references */
    mixinDefaults?: boolean;
    /** Defaults to false, which leads to be able to do multiple columns sorting (or single sort when false) */
    multiColumnSort?: boolean;
    /** Defaults to true, which leads to be able to do multiple selection */
    multiSelect?: boolean;
    /** Defaults to true, which will display numbers indicating column sort precedence are displayed in the columns when multiple columns selected */
    numberedMultiColumnSort?: boolean;
    /** Extra pre-header panel height (on top of column header) */
    preHeaderPanelHeight?: number;
    /** Defaults to "auto", extra pre-header panel (on top of column header) width, it could be a number (pixels) or a string ("100%" or "auto") */
    preHeaderPanelWidth?: number | string;
    /** Extra top-header panel height (on top of column header & pre-header) */
    topHeaderPanelHeight?: number;
    /** Defaults to "auto", extra top-header panel (on top of column header & pre-header) width, it could be a number (pixels) or a string ("100%" or "auto") */
    topHeaderPanelWidth?: number | string;
    /** Do we want to preserve copied selection on paste? */
    preserveCopiedSelectionOnPaste?: boolean;
    /** Defaults to `['ctrlKey', 'metaKey']`, list of keys that when pressed will prevent Draggable events from triggering (e.g. prevent onDrag when Ctrl key is pressed while dragging) */
    preventDragFromKeys?: Array<'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>;
    /** Grid row height in pixels (only type the number). Row of cell values. */
    rowHeight?: number;
    /**
     * Defaults to "highlight-animate", a CSS class name used to simulate row highlight with an optional duration (e.g. after insert).
     * Note: make sure that the duration is always lower than the duration defined in the CSS/SASS variable `$alpine-row-highlight-fade-animation`.
     * Also note that the highlight is temporary and will also disappear as soon as the user starts scrolling or a `render()` is being called
     */
    rowHighlightCssClass?: string;
    /** Defaults to 400, duration to show the row highlight (e.g. after CRUD executions) */
    rowHighlightDuration?: number;
    /**
     * Defaults to "top", what CSS style to we want to use to render each row top offset (we can use "top" or "transform").
     * For example, with a default `rowHeight: 22`, the 2nd row will have a `top` offset of 44px and by default have a CSS style of `top: 44px`.
     * NOTE: for perf reasons, the "transform" might become the default in our future major version.
     */
    rowTopOffsetRenderType?: 'top' | 'transform';
    /** Optional sanitizer function to use for sanitizing data to avoid XSS attacks */
    sanitizer?: (dirtyHtml: string) => string;
    /** Defaults to 10(ms), render throttling when using virtual scroll on large dataset */
    scrollRenderThrottling?: number;
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
    /** Do we want to show the extra top-header panel (on top of column header & pre-header) for column grouping purposes */
    showTopHeaderPanel?: boolean;
    /** Do we want to show top panel row? */
    showTopPanel?: boolean;
    /** Defaults to true, which leads to render a separate span for the number and styles it with css class <i>slick-sort-indicator-numbered</i> */
    sortColNumberInSeparateSpan?: boolean;
    /** Defaults to undefined. If we are inside a Shadow DOM tree, this must be the Shadow root of the tree */
    shadowRoot?: ShadowRoot;
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
    /**
     * Defaults to false, should we throw an erro when frozenColumn is wider than the grid viewport width.
     * When that happens the unfrozen section on the right is in a phantom area that is not viewable neither clickable unless we enable double-scroll on the grid container.
     */
    throwWhenFrozenNotAllViewable?: boolean;
    /** What is the top panel height in pixels (only type the number) */
    topPanelHeight?: number;
    /** Defaults to false, when set to True will lead to multiple columns sorting without the need to hold or do shift-click to execute a multiple sort. */
    tristateMultiColumnSort?: boolean;
    /** Defaults to null, which is the default Viewport CSS class name */
    viewportClass?: string;
    /** Viewport switch to scroll model with percentage */
    viewportSwitchToScrollModeWidthPercent?: number;
    /** Viewport min width in pixel */
    viewportMinWidthPx?: number;
    /** Viewport max width in pixel */
    viewportMaxWidthPx?: number;
    /** @deprecated @use `columnPicker: { columnTitle: '...' }` in your column definitions. */
    columnPickerTitle?: string;
    /** @deprecated @use `columnPicker: { forceFitTitle: '...' }` in your column definitions. */
    forceFitTitle?: string;
    /** @deprecated @use `columnPicker: { syncResizeTitle: '...' }`  in your column definitions. */
    syncResizeTitle?: string;
}
//# sourceMappingURL=gridOption.interface.d.ts.map