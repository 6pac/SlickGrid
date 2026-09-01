import type { SlickEvent, SlickRange } from '../slick.core.js';
import type { SlickPlugin } from './index.js';

export type SelectionModel<T = any> = SlickPlugin & {
  refreshSelections: () => void;
  onSelectedRangesChanged: SlickEvent<SlickRange[]>;
  getOptions: () => T;
  setOptions: (options: Partial<T>) => void;
  getSelectedRanges: () => SlickRange[];
  setSelectedRanges: (ranges: SlickRange[], caller?: string, selectionMode?: string) => void;
};
