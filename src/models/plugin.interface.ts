import { SlickGrid } from '../slick.grid';

export interface Plugin {
  pluginName: string;
  init: (grid: SlickGrid) => void;
  destroy: () => void;
}