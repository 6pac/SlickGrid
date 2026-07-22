import type { Column, Editor, Formatter, GroupTotalsFormatter } from './index.js';

export type ColumnMetadata = Pick<Column, 'colspan' | 'rowspan' | 'cssClass' | 'editor' | 'focusable' | 'formatter' | 'selectable'>;

/**
 * Provides a powerful way of specifying additional information about a data item that let the grid customize the appearance
 * and handling of a particular data item. The method should return null if the item requires no special handling,
 * or an object following the ItemMetadata interface
 */
export interface ItemMetadata {
  // properties describing metadata related to the item (i.e. grid row) itself

  /** One or more (space-separated) CSS classes to be added to the entire row. */
  cssClasses?: string;

  /** Optional Editor  */
  editor?: Editor | null;

  /** Whether or not any cells in the row can be set as "active". */
  focusable?: boolean;

  /**
   * Row height in pixels, only used in variable row height mode (i.e. when a `rowHeightProvider`
   * grid option is configured). Applied when the provider returns `undefined` for the row; when
   * this is also undefined the default `rowHeight` grid option is used.
   */
  height?: number;

  /** A custom group formatter. */
  formatter?: GroupTotalsFormatter | Formatter;

  /** Whether or not a row or any cells in it can be selected. */
  selectable?: boolean;

  /** column-level metadata */
  columns?: {
    // properties describing metadata related to individual columns
    [colIdOrIdx in string | number]: ColumnMetadata;
  }
}