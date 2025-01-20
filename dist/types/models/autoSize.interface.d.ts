import type { Formatter } from './formatter.interface.js';
export interface AutoSize {
    allowAddlPercent?: number;
    autosizeMode?: string;
    colDataTypeOf?: any;
    colValueArray?: any[];
    contentSizePx?: number;
    formatterOverride?: Formatter;
    headerWidthPx?: number;
    ignoreHeaderText?: boolean;
    rowSelectionModeOnInit?: boolean | undefined;
    rowSelectionMode?: string;
    rowSelectionCount?: number;
    sizeToRemaining?: boolean | undefined;
    valueFilterMode?: string;
    widthEvalMode?: string;
    widthPx?: number;
}
//# sourceMappingURL=autoSize.interface.d.ts.map