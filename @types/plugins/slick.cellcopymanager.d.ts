declare namespace Slick {
    class Range {
        fromRow: number;
        toRow: number;
        fromCell: number;
        toCell: number;
    }
}
declare type CellCopyManager = {
    onCopyCancelled: Slick.Event;
    onCopyCells: Slick.Event;
    onPasteCells: Slick.Event;
};
