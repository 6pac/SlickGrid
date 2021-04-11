declare type SlickGrid = any;
declare type AutoTooltipsOptions = {
    /** are tooltip enabled for all cells? */
    enableForCells: boolean;
    /** are tooltip enabled for column headers */
    enableForHeaderCells: boolean;
    /** what is the maximum tooltip length in pixels (only type the number) */
    maxToolTipLength: number;
    /** Allow preventing custom tooltips from being overwritten by auto tooltips */
    replaceExisting?: boolean;
};
declare type AutoTooltipsFunction = (options: AutoTooltipsOptions) => void;
