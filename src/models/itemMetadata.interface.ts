import type { Column, Editor, Formatter, GroupTotalsFormatter } from './index';

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

  /** A custom group formatter. */
  formatter?: GroupTotalsFormatter | Formatter;

  /** Whether or not a row or any cells in it can be selected. */
  selectable?: boolean;

  /** column-level metadata */
  columns?: {
    // properties describing metadata related to individual columns
    [colIdOrIdx in string | number]: Pick<Column, 'colspan' | 'editor' | 'focusable' | 'formatter' | 'selectable'>;
  }
}