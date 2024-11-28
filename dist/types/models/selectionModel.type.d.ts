import type { SlickEvent, SlickRange } from '../slick.core.js';
import type { SlickPlugin } from './index.js';
export type SelectionModel = SlickPlugin & {
    refreshSelections: () => void;
    onSelectedRangesChanged: SlickEvent<SlickRange[]>;
    getSelectedRanges: () => SlickRange[];
    setSelectedRanges: (ranges: SlickRange[], caller?: string) => void;
};
//# sourceMappingURL=selectionModel.type.d.ts.map