declare type Primitive = boolean | string | number | null;
declare type GenericOption = Record<string, Primitive>;
declare type SlickGrid = any;
declare type AutoTooltipsOptions = {
    enableForCells?: boolean;
    enableForHeaderCells?: boolean;
    maxToolTipLength?: number | null;
} & GenericOption;
declare type AutoTooltipsFunction = (options: AutoTooltipsOptions) => void;
