import type { SlickCellRangeDecorator } from '../plugins/slick.cellrangedecorator';
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
export interface CellRangeDecoratorOption {
    selectionCssClass: string;
    selectionCss: CSSStyleDeclaration;
    offset: {
        top: number;
        left: number;
        height: number;
        width: number;
    };
}
export interface CellRangeSelectorOption {
    /** Defaults to True, should we enable auto-scroll? */
    autoScroll?: boolean;
    /** minimum internal to show the next cell? better to a multiple of minIntervalToShowNextCell */
    minIntervalToShowNextCell: number;
    /** maximum internal to show the next cell? better to a multiple of minIntervalToShowNextCell */
    maxIntervalToShowNextCell: number;
    /** how fast do we want to accelerate the interval of auto-scroll? increase 5ms when cursor 1px outside the viewport. */
    accelerateInterval: number;
    /** cell decorator service */
    cellDecorator: SlickCellRangeDecorator;
    /** styling (for example blue background on cell) */
    selectionCss: CSSStyleDeclaration;
}
export type CSSStyleDeclarationReadonly = 'length' | 'parentRule' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty';
export type CSSStyleDeclarationWritable = keyof Omit<CSSStyleDeclaration, CSSStyleDeclarationReadonly>;
//# sourceMappingURL=cellRange.interface.d.ts.map