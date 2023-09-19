import type { SlickCellExternalCopyManager } from '../plugins/slick.cellexternalcopymanager';
import type { CellRange, Column, ExcelCopyBufferOption } from './index';
export interface ExternalCopyClipCommand {
    activeCell: number;
    activeRow: number;
    cellExternalCopyManager: SlickCellExternalCopyManager;
    clippedRange: CellRange[];
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
    markCopySelection: (ranges: CellRange[]) => void;
    setDataItemValueForColumn: (item: any, columnDef: Column, value: any) => any | void;
    undo: () => void;
}
//# sourceMappingURL=externalCopyClipCommand.interface.d.ts.map