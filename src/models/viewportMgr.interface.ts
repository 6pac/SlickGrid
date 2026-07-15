// ViewportMgr geometry/state contracts (Phase 4 of the frozen rows/columns
// encapsulation refactor). Consumed by slick.core.ts (the class) and slick.grid.ts.

/** Snapshot of the grid's freeze configuration, pushed into ViewportMgr by setFrozenOptions(). */
export interface ViewportFreezeState {
  frozenColumnIdx: number;
  hasFrozenRows: boolean;
  actualFrozenRow: number;
  frozenBottom: boolean;
  /** the frozenRow option value — number of rows in the frozen row band (0/-1 when none) */
  frozenRowCount?: number;
  /** the frozenRightColumn option value — number of columns frozen at the right edge (0 when none) */
  frozenRightColCount?: number;
  /** index of the first right-frozen column (columns.length when the band is off) */
  frozenRightStartIdx?: number;
  /** the frozenBottomRow option value — rows frozen at the bottom ALONGSIDE top rows (0 when none) */
  frozenBottomRowCount?: number;
  /** first row of the bottom-frozen band = dataLength − frozenBottomRow (MAX_SAFE_INTEGER when off) */
  bottomFrozenSplitRow?: number;
}

/**
 * Band-count view of the freeze configuration (Phase 4 groundwork for the 3×3 band
 * model): a zero count means the band does not exist. Derived by updateFreezeState
 * from the legacy freeze snapshot; frozenRightCols stays 0 until right-frozen
 * columns land.
 */
export interface FreezeBandCounts {
  frozenLeftCols: number;
  frozenRightCols: number;
  frozenTopRows: number;
  frozenBottomRows: number;
}

/** Geometry inputs for ViewportMgr.applyCanvasWidths — computed by the grid, distributed by the manager. */
export interface CanvasWidthsGeometry {
  widthChanged: boolean;
  canvasWidth: number;
  canvasWidthL: number;
  canvasWidthR: number;
  canvasWidthRF: number;
  headersWidthL: number;
  headersWidthR: number;
  headersWidthRF: number;
  viewportW: number;
  viewportHasVScroll: boolean;
  scrollbarWidth: number;
  createFooterRow?: boolean;
  createPreHeaderPanel?: boolean;
  preHeaderPanelWidth?: number | string;
}

/** Geometry inputs for ViewportMgr.applyPaneHeights — computed by the grid, distributed by the manager. */
export interface PaneHeightsGeometry {
  viewportH: number;
  frozenRowsHeight: number;
  /** height of the bottom-frozen row band (simultaneous top+bottom mode; 0 otherwise) */
  frozenBottomRowsHeight?: number;
  scrollbarHeight: number;
  topPanelH: number;
  headerRowH: number;
  footerRowH: number;
  /** lazily computed to avoid an unconditional style recalc; only read on the autoHeight+frozen path */
  getContainerVBoxDelta: () => number;
  autoHeight?: boolean;
  showPreHeaderPanel?: boolean;
  preHeaderPanelHeight?: number;
  showTopHeaderPanel?: boolean;
  topHeaderPanelHeight?: number;
  showHeaderRow?: boolean;
  headerRowHeight?: number;
}

/** Options consumed by ViewportMgr when constructing the pane/viewport/canvas DOM. */
export interface ViewportMgrBuildOptions {
  createPreHeaderPanel?: boolean;
  showPreHeaderPanel?: boolean;
  createFooterRow?: boolean;
  showFooterRow?: boolean;
  showColumnHeader?: boolean;
  showTopPanel?: boolean;
  showHeaderRow?: boolean;
  viewportClass?: string;
  lazyPanes?: boolean;
  frozenColumn?: number;
  frozenRow?: number;
}
