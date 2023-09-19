import type { Plugin } from '../models/index';
import { SlickEvent as SlickEvent_, SlickRange } from '../slick.core';
import type { SlickGrid } from '../slick.grid';
/**
 * This manager enables users to copy/paste cell data
 */
export declare class SlickCellCopyManager implements Plugin {
    pluginName: "CellCopyManager";
    onCopyCells: SlickEvent_<{
        ranges: SlickRange[] | null;
    }>;
    onCopyCancelled: SlickEvent_<{
        ranges: SlickRange[] | null;
    }>;
    onPasteCells: SlickEvent_<{
        from: SlickRange[] | undefined;
        to: SlickRange[] | undefined;
    }>;
    protected _grid: SlickGrid;
    protected _copiedRanges?: SlickRange[] | null;
    init(grid: SlickGrid): void;
    destroy(): void;
    protected handleKeyDown(e: KeyboardEvent): void;
    protected markCopySelection(ranges: SlickRange[]): void;
    protected clearCopySelection(): void;
}
//# sourceMappingURL=slick.cellcopymanager.d.ts.map