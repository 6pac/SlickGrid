import type { SlickCellRangeDecorator } from '../plugins/slick.cellrangedecorator.js';
export interface CellRangeDecoratorOption {
    /** class name to add to decorator */
    selectionCssClass: string;
    /** CSS styling to add to decorator (for example blue background on cell) */
    selectionCss: CSSStyleDeclaration;
    /** CSS styling for drag-fill rangel marker (optional) */
    copyToSelectionCss: CSSStyleDeclaration;
    /** offset to add to the cell range outer box size calculation */
    offset: {
        top: number;
        left: number;
        height: number;
        width: number;
    };
}
export interface CellRangeSelectorOption extends CellRangeDecoratorOption {
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
}
//# sourceMappingURL=cellRange.interface.d.ts.map