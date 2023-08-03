import type { SlickEvent, SlickRange } from '../slick.core';
import type { Plugin } from './index';

export type SelectionModel = Plugin & {
  refreshSelections: () => void;
  onSelectedRangesChanged: SlickEvent<SlickRange[]>;
  getSelectedRanges: () => SlickRange[];
  setSelectedRanges: (ranges: SlickRange[], caller?: string) => void;
};
