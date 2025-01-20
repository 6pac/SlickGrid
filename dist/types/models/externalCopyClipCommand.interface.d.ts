import type { Column, ExcelCopyBufferOption } from './index.js';
import type { SlickCellExternalCopyManager } from '../plugins/slick.cellexternalcopymanager.js';
import type { SlickRange } from '../slick.core.js';
export interface ExternalCopyClipCommand {
    activeCell: number;
    activeRow: number;
    cellExternalCopyManager: SlickCellExternalCopyManager;
    clippedRange: SlickRange[];
    destH: number;
    destW: number;
    h: number;
    w: number;
    isClipboardCommand: boolean;
    maxDestX: number;
    maxDestY: number;
    oldValues: any[];
    oneCellToMultiple: boolean;
    _options: ExcelCopyBufferOption;
    execute: () => void;
    markCopySelection: (ranges: SlickRange[]) => void;
    setDataItemValueForColumn: (item: any, columnDef: Column, value: any) => any | void;
    undo: () => void;
}
//# sourceMappingURL=externalCopyClipCommand.interface.d.ts.map