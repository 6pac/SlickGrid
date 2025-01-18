import type { Column, Editor, Formatter, GroupTotalsFormatter } from './index.js';
export type ColumnMetadata = Pick<Column, 'colspan' | 'rowspan' | 'cssClass' | 'editor' | 'focusable' | 'formatter' | 'selectable'>;
/**
 * Provides a powerful way of specifying additional information about a data item that let the grid customize the appearance
 * and handling of a particular data item. The method should return null if the item requires no special handling,
 * or an object following the ItemMetadata interface
 */
export interface ItemMetadata {
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
        [colIdOrIdx in string | number]: ColumnMetadata;
    };
}
//# sourceMappingURL=itemMetadata.interface.d.ts.map