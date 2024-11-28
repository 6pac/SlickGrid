import type { SlickCellRangeDecorator } from '../plugins/slick.cellrangedecorator.js';
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
//# sourceMappingURL=cellRange.interface.d.ts.map