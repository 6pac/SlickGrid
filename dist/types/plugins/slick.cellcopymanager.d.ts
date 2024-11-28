import type { SlickPlugin } from '../models/index.js';
import { SlickEvent as SlickEvent_, type SlickEventData, type SlickRange } from '../slick.core.js';
import type { SlickGrid } from '../slick.grid.js';
/**
 * This manager enables users to copy/paste cell data
 */
export declare class SlickCellCopyManager implements SlickPlugin {
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
    protected handleKeyDown(e: SlickEventData): void;
    protected markCopySelection(ranges: SlickRange[]): void;
    protected clearCopySelection(): void;
}
//# sourceMappingURL=slick.cellcopymanager.d.ts.map