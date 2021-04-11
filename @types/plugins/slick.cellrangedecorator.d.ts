/** @todo this should be probably extracted to a shared interface folder  */
export interface CellRange {
    /** Selection start from which cell? */
    fromCell: number;
    /** Selection start from which row? */
    fromRow: number;
    /** Selection goes to which cell? */
    toCell: number;
    /** Selection goes to which row? */
    toRow: number;
}
