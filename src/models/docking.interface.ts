export type DockingSide = 'left' | 'right';

export type DockingOverflowStrategy = 'conveyor' | 'clamp';

/** An edge boundary/count or explicit column indexes and ids used by pinning. */
export type ColumnPinningReferences = number | Array<number | string>;

/**
 * Column references used inside the unified `GridOption.pinning` option and
 * grid-state presets. This is the nested value shape, not a separate
 * `pinnedColumns` grid option.
 */
export interface PinnedColumns {
  /**
   * Column indexes or ids to pin to the left edge.
   * A number is an inclusive zero-based boundary among visible columns (`2` pins the first three visible columns).
   * An array accepts zero-based indexes and/or stable column ids for non-contiguous pinning.
   */
  left?: ColumnPinningReferences;

  /**
   * Column indexes or ids to pin to the right edge.
   * A number is a count from the trailing edge of visible columns (`1` pins the last visible column; `0` pins none).
   * An array accepts zero-based indexes and/or stable column ids for non-contiguous pinning.
   */
  right?: ColumnPinningReferences;
}

export interface PinnedRows {
  /** Row indexes or stable row ids to pin permanently to the top edge. */
  top?: Array<number | string>;

  /** Row indexes or stable row ids to pin permanently to the bottom edge. */
  bottom?: Array<number | string>;
}

/** Permanent pinning for both grid axes. */
export interface PinningOption {
  /** Configuration for columns pinned permanently to the left or right edge. */
  columns?: PinnedColumns;

  /** Configuration for rows pinned permanently to the top or bottom edge. */
  rows?: PinnedRows;
}

export interface StickyRows {
  /** Row indexes or stable row ids that dock to the top after scrolling past them. */
  top?: Array<number | string>;

  /** Row indexes or stable row ids that dock to the bottom after scrolling back above them. */
  bottom?: Array<number | string>;

  /** Row indexes or stable row ids that dock to the nearest edge when normal scrolling would clip them. */
  both?: Array<number | string>;
}

export interface DockingOption {
  /** Maximum percentage of the viewport width that left and right docked columns may occupy. Defaults to 60. */
  maxColumnViewportWidthPercent?: number;

  /** Maximum percentage of the viewport height that top and bottom docked rows may occupy. Defaults to 60. */
  maxRowViewportHeightPercent?: number;

  /**
   * Minimum number of rows of breathing room reserved for the scrollable center-row viewport
   * when permanent top/bottom pinned rows are present. Unlike `maxRowViewportHeightPercent`
   * (which only budgets sticky rows), this guarantees the always-rendered permanent rows leave
   * room for at least this many center rows: when the combined top/bottom pinned height would
   * leave less room than that, the container is grown (via `min-height`) so both the pinned rows
   * and this many center rows stay visible, rather than shrinking the center to zero. Expressed as
   * a row count rather than a pixel height so it stays meaningful with variable row heights.
   * Set to 0 to disable. Defaults to 3.
   */
  minCenterRowCount?: number;

  /** How sticky candidates are reduced when their pixel budget is exhausted. Defaults to `conveyor`. */
  overflowStrategy?: DockingOverflowStrategy;

  /** Pixel activation buffer used when resolving sticky columns. Defaults to 2; this is not temporal stateful hysteresis. */
  stickyHysteresis?: number;
}

export type ColumnDockingBand = 'left' | 'center' | 'right';
export type RowDockingBand = 'top' | 'center' | 'bottom';

export interface DockedColumn {
  band: ColumnDockingBand;
  index: number;
  naturalOffset: number;
  offset: number;
  sticky: boolean;
  width: number;
}

export interface ColumnDockingLayout {
  center: DockedColumn[];
  centerWidth: number;
  contentWidth: number;
  left: DockedColumn[];
  leftBaseWidth: number;
  leftWidth: number;
  revision: number;
  right: DockedColumn[];
  rightBaseWidth: number;
  rightWidth: number;
}

export interface DockingRow {
  height: number;
  id: number | string;
  index: number;
  top: number;
}

export interface DockedRow extends DockingRow {
  band: RowDockingBand;
  offset: number;
  sticky: boolean;
}

export interface RowDockingLayout {
  bottom: DockedRow[];
  bottomHeight: number;
  center: DockedRow[];
  revision: number;
  top: DockedRow[];
  topHeight: number;
}
