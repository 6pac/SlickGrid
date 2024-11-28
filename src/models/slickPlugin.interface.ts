import type { SlickGridModel } from './slickGridModel.interface.js';

export interface SlickPlugin {
  pluginName: string;
  init: (grid: SlickGridModel) => void;
  destroy: () => void;
}