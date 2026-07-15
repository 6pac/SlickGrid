import { Utils as Utils_ } from './slick.core.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/**
 * RowPositionIndex - a prefix-sum index of row top positions, used by SlickGrid when variable
 * row height mode is enabled (i.e. when a `rowHeightProvider` grid option is supplied).
 *
 * `rowPos[i]` holds the virtual top pixel position of row `i` (i.e. the summed heights of all
 * preceding rows) and `rowPos[rowCount]` holds the total height of all indexed rows, which makes
 * row-to-position lookups an O(1) array read and position-to-row lookups an O(log n) binary search.
 *
 * Rows outside the indexed range extrapolate linearly using the default row height so that the
 * index mirrors the fixed-row-height arithmetic it replaces (which happily multiplies out-of-range
 * row indexes); callers are expected to clamp results exactly as they do in fixed mode.
 */
export class RowPositionIndex {
  protected rowPos = new Float64Array(1);
  protected rowCount = 0;
  protected defaultRowHeight = 25;
  protected hint = 0;   // last binary search result; consecutive queries usually hit the same or an adjacent row

  /** Number of rows currently indexed. */
  get count(): number {
    return this.rowCount;
  }

  /**
   * Returns the combined pixel height of all indexed rows.
   *
   * @returns {number} The total height in pixels.
   */
  totalHeight(): number {
    return this.rowPos[this.rowCount];
  }

  /**
   * Rebuilds the index by querying the height of every row. O(n) - the provided callback is
   * called once per row and must therefore be fast (a simple lookup, no DOM access).
   *
   * @param {number} rowCount - The number of rows to index.
   * @param {number} defaultRowHeight - The height used when the callback returns `undefined` and for extrapolating beyond the indexed range.
   * @param {(row: number) => number | undefined} getRowHeight - Returns the height of a row in pixels, or `undefined` to use the default.
   */
  rebuild(rowCount: number, defaultRowHeight: number, getRowHeight: (row: number) => number | undefined): void {
    this.rowCount = rowCount;
    this.defaultRowHeight = defaultRowHeight;
    this.hint = 0;
    if (this.rowPos.length < rowCount + 1) {
      this.rowPos = new Float64Array(rowCount + 1);
    }
    const pos = this.rowPos;
    let acc = 0;
    for (let i = 0; i < rowCount; i++) {
      pos[i] = acc;
      acc += getRowHeight(i) ?? defaultRowHeight;
    }
    pos[rowCount] = acc;
  }

  /**
   * Returns the virtual top pixel position of a row.
   *
   * @param {number} row - The row index; indexes beyond the indexed range extrapolate using the default row height.
   * @returns {number} The virtual pixel position of the top of the row.
   */
  top(row: number): number {
    if (row <= 0) {
      return row * this.defaultRowHeight;
    }
    if (row >= this.rowCount) {
      return this.rowPos[this.rowCount] + (row - this.rowCount) * this.defaultRowHeight;
    }
    return this.rowPos[row];
  }

  /**
   * Returns the height of a row.
   *
   * @param {number} row - The row index; indexes outside the indexed range return the default row height.
   * @returns {number} The row height in pixels.
   */
  height(row: number): number {
    if (row < 0 || row >= this.rowCount) {
      return this.defaultRowHeight;
    }
    return this.rowPos[row + 1] - this.rowPos[row];
  }

  /**
   * Returns the index of the row containing a virtual vertical pixel position.
   * Positions outside the indexed range extrapolate using the default row height, mirroring the
   * fixed-row-height arithmetic (results may be negative or beyond the last row - callers clamp).
   *
   * @param {number} y - The virtual vertical position in pixels.
   * @returns {number} The row index at that position.
   */
  rowAt(y: number): number {
    if (y < 0) {
      return Math.floor(y / this.defaultRowHeight);
    }
    const total = this.rowPos[this.rowCount];
    if (y >= total) {
      return this.rowCount + Math.floor((y - total) / this.defaultRowHeight);
    }

    // check the last result first: consecutive queries during scrolling usually target the same neighborhood
    const h = this.hint;
    if (h >= 0 && h < this.rowCount && this.rowPos[h] <= y && y < this.rowPos[h + 1]) {
      return h;
    }

    let lo = 0;
    let hi = this.rowCount - 1;

    // interpolation probe (borrowed from the GerHobbelt SlickGrid fork): guess assuming rows are
    // close to the default height - exact for uniform grids, and for mostly-uniform grids a second
    // probe a permille of the row count away usually brackets the target, skipping ~10 halvings
    let probe = Math.min(hi, Math.max(0, Math.floor(y / this.defaultRowHeight)));
    const skew = 1 + ((this.rowCount * 0.001) | 0);
    if (this.rowPos[probe] <= y) {
      if (y < this.rowPos[probe + 1]) {
        this.hint = probe;
        return probe;
      }
      lo = probe + 1;
      probe = Math.min(hi, lo + skew);
      if (this.rowPos[probe] <= y) {
        if (y < this.rowPos[probe + 1]) {
          this.hint = probe;
          return probe;
        }
        lo = probe + 1;
      } else {
        hi = probe - 1;
      }
    } else {
      hi = probe - 1;
      probe = Math.max(0, hi - skew);
      if (this.rowPos[probe] <= y) {
        if (y < this.rowPos[probe + 1]) {
          this.hint = probe;
          return probe;
        }
        lo = probe + 1;
      } else {
        hi = probe - 1;
      }
    }

    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1;
      if (this.rowPos[mid] <= y) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    this.hint = lo;
    return lo;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(Slick, {
    RowPositionIndex,
  });
}
